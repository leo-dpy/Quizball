import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Timer } from '../components/Timer';
import { getQuestions } from '../services/api';
import type { PreparedQuestion, QuestionAnswerRecord, QuizSummary } from '../types/quiz';
import { prepareQuiz } from '../utils/quizHelpers';

interface QuizViewProps {
  category: string;
  onFinish: (summary: QuizSummary) => void;
  onQuit: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuizView({ category, onFinish, onQuit }: QuizViewProps) {
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État de réponse pour la question courante
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Statistiques de la partie
  const [score, setScore] = useState(0);
  const [records, setRecords] = useState<QuestionAnswerRecord[]>([]);

  // Référence pour le délai de transition
  const timerTimeoutRef = useRef<number | null>(null);

  // Chargement des questions pour la catégorie sélectionnée
  useEffect(() => {
    let isMounted = true;

    async function loadQuizQuestions() {
      setLoading(true);
      setError(null);
      try {
        const rawQuestions = await getQuestions(category);
        if (!isMounted) return;

        if (!rawQuestions || rawQuestions.length === 0) {
          setError(`Aucune question trouvée pour la catégorie "${category}".`);
          setLoading(false);
          return;
        }

        // Préparation de 10 questions avec 4 propositions mélangées chacune
        const prepared = prepareQuiz(rawQuestions, 10);
        setQuestions(prepared);
        setCurrentIndex(0);
        setScore(0);
        setRecords([]);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setError("Erreur lors de la récupération des questions de l'API Laravel.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadQuizQuestions();

    return () => {
      isMounted = false;
      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
      }
    };
  }, [category]);

  const currentQuestion = questions[currentIndex];

  // Passage à la question suivante ou affichage des résultats
  const advanceToNext = useCallback(
    (newScore: number, updatedRecords: QuestionAnswerRecord[]) => {
      timerTimeoutRef.current = window.setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setHasAnswered(false);
          setTimedOut(false);
        } else {
          onFinish({
            category,
            totalQuestions: questions.length,
            score: newScore,
            records: updatedRecords,
          });
        }
      }, 1200); // 1,2s pour observer la coloration vert/rouge
    },
    [currentIndex, questions.length, category, onFinish]
  );

  // Clic sur une proposition
  const handleSelectOption = (option: string) => {
    if (hasAnswered || timedOut || !currentQuestion) return;

    setHasAnswered(true);
    setSelectedOption(option);

    const isCorrect = option === currentQuestion.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    const newRecord: QuestionAnswerRecord = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      selectedAnswer: option,
      isCorrect,
      timedOut: false,
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);

    advanceToNext(newScore, updatedRecords);
  };

  // Expiration du timer (30 secondes écoulées)
  const handleTimeUp = useCallback(() => {
    if (hasAnswered || timedOut || !currentQuestion) return;

    setTimedOut(true);
    setHasAnswered(true);

    const newRecord: QuestionAnswerRecord = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      selectedAnswer: null,
      isCorrect: false,
      timedOut: true,
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);

    advanceToNext(score, updatedRecords);
  }, [hasAnswered, timedOut, currentQuestion, records, score, advanceToNext]);

  // Chargement en cours
  if (loading) {
    return (
      <div className="cq-container cq-quiz-view">
        <Header categoryName={category} onBack={onQuit} />
        <div className="cq-loading-state">
          <div className="cq-spinner" />
          <p style={{ color: 'var(--cq-ink-muted)' }}>
            Préparation du quiz ({category})...
          </p>
        </div>
      </div>
    );
  }

  // Erreur
  if (error || !currentQuestion) {
    return (
      <div className="cq-container cq-quiz-view">
        <Header categoryName={category} onBack={onQuit} />
        <div className="cq-error-state">
          <div style={{ fontSize: '36px' }}>⚠️</div>
          <p className="cq-error-msg">{error || 'Erreur inattendue.'}</p>
          <button type="button" className="cq-btn-primary" onClick={onQuit}>
            Retour aux catégories
          </button>
        </div>
      </div>
    );
  }

  const isCurrentAnswerCorrect = selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="cq-container cq-quiz-view">
      {/* En-tête */}
      <Header categoryName={category} onBack={onQuit} />

      {/* Barre de statut supérieure */}
      <div className="cq-quiz-topbar">
        <span className="cq-quiz-progress-text">
          Question {currentIndex + 1} / {questions.length}
        </span>
        <span className="cq-quiz-score-live">
          Score : {score} pts
        </span>
      </div>

      {/* Timer de 30 secondes en haut */}
      <Timer
        key={currentIndex}
        durationSeconds={30}
        isPaused={hasAnswered || timedOut}
        onTimeUp={handleTimeUp}
      />

      {/* Carte Question */}
      <div className="cq-question-card">
        <span className="cq-question-category">{category} · Question {currentIndex + 1}</span>
        <h2 className="cq-question-text">{currentQuestion.question}</h2>
      </div>

      {/* Les 4 propositions de réponse */}
      <div className="cq-options-grid">
        {currentQuestion.options.map((option, idx) => {
          const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
          let buttonClass = 'cq-option-btn';

          if (hasAnswered) {
            const isThisOptionCorrect = option === currentQuestion.correctAnswer;
            const isThisOptionSelected = option === selectedOption;

            if (isThisOptionCorrect) {
              // Révélation en vert de la bonne réponse
              buttonClass += ' is-correct';
            } else if (isThisOptionSelected && !isThisOptionCorrect) {
              // Coloration en rouge de la mauvaise réponse choisie
              buttonClass += ' is-wrong';
            } else {
              // Assombrissement des autres réponses non choisies
              buttonClass += ' is-dimmed';
            }
          }

          return (
            <button
              key={`${currentQuestion.id}-${idx}-${option}`}
              type="button"
              className={buttonClass}
              onClick={() => handleSelectOption(option)}
              disabled={hasAnswered || timedOut}
            >
              <div className="cq-option-badge">{letter}</div>
              <span className="cq-option-text">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Bannière de feedback immédiat */}
      {hasAnswered && (
        <div
          className={`cq-feedback-banner ${
            timedOut
              ? 'is-timeout'
              : isCurrentAnswerCorrect
              ? 'is-correct'
              : 'is-wrong'
          }`}
        >
          {timedOut && '⏱️ Temps écoulé ! 0 pt'}
          {!timedOut && isCurrentAnswerCorrect && '✅ Bonne réponse ! +1 pt'}
          {!timedOut && !isCurrentAnswerCorrect && '❌ Mauvaise réponse !'}
        </div>
      )}
    </div>
  );
}
