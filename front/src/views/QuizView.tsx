// Écran de jeu : 10 questions, 15 secondes chacune, feedback vert/rouge
import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Timer } from '../components/Timer';
import { api } from '../services/api';
import { trouverSport } from '../data/sports';
import type { Difficulte, QuestionQuiz, ReponseJoueur } from '../types/quiz';
import './quiz.css';

/** Durée d'une question, en secondes. */
const DUREE = 15;
/** Temps d'affichage du corrigé avant la question suivante, en millisecondes. */
const PAUSE_CORRECTION = 1600;

interface QuizViewProps {
  sport: string;
  difficulte: Difficulte;
  onTermine: (reponses: ReponseJoueur[]) => void;
  onQuitter: () => void;
}

export function QuizView({ sport, difficulte, onTermine, onQuitter }: QuizViewProps) {
  const [questions, setQuestions] = useState<QuestionQuiz[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<string | null>(null);
  const [figee, setFigee] = useState(false);
  const [restant, setRestant] = useState(DUREE);
  const [reponses, setReponses] = useState<ReponseJoueur[]>([]);

  const infosSport = trouverSport(sport);
  const style = { '--accent': infosSport.color, '--accent-rgb': infosSport.rgb } as CSSProperties;

  // Tirage des questions au démarrage
  useEffect(() => {
    let annule = false;

    api
      .tirage(sport, difficulte)
      .then((tirage) => {
        if (annule) return;
        if (tirage.questions.length === 0) {
          setErreur('Aucune question pour ce sport et cette difficulté.');
        }
        setQuestions(tirage.questions);
        setChargement(false);
      })
      .catch((e: Error) => {
        if (annule) return;
        setErreur(e.message);
        setChargement(false);
      });

    return () => {
      annule = true;
    };
  }, [sport, difficulte]);

  const question = questions[index];

  /** Enregistre la réponse puis fige la question le temps d'afficher le corrigé. */
  const repondre = useCallback(
    (proposition: string | null) => {
      if (figee || !question) return;

      setChoix(proposition);
      setFigee(true);
      setReponses((liste) => [
        ...liste,
        {
          question,
          choix: proposition,
          correcte: proposition === question.bonne_reponse,
        },
      ]);
    },
    [figee, question],
  );

  // Décompte : une question non répondue à temps compte comme ratée
  useEffect(() => {
    if (chargement || erreur || figee || !question) return;

    const debut = Date.now();
    const timer = window.setInterval(() => {
      const ecoule = (Date.now() - debut) / 1000;
      const reste = DUREE - ecoule;

      if (reste <= 0) {
        window.clearInterval(timer);
        setRestant(0);
        repondre(null);
      } else {
        setRestant(reste);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [chargement, erreur, figee, question, repondre]);

  // Passage à la question suivante, ou fin de partie
  useEffect(() => {
    if (!figee) return;

    const suite = window.setTimeout(() => {
      if (index + 1 >= questions.length) {
        onTermine(reponses);
        return;
      }
      setIndex((i) => i + 1);
      setChoix(null);
      setFigee(false);
      setRestant(DUREE);
    }, PAUSE_CORRECTION);

    return () => window.clearTimeout(suite);
  }, [figee, index, questions.length, reponses, onTermine]);

  if (chargement) {
    return (
      <div className="qz" style={style}>
        <div className="qz__inner">
          <p className="qz-chargement">Tirage des questions…</p>
        </div>
      </div>
    );
  }

  if (erreur || !question) {
    return (
      <div className="qz" style={style}>
        <div className="qz__inner">
          <p className="qz-erreur-api">{erreur ?? 'Aucune question à jouer.'}</p>
          <button className="qz-retour" type="button" onClick={onQuitter}>← RETOUR</button>
        </div>
      </div>
    );
  }

  const bonnes = reponses.filter((r) => r.correcte).length;
  const progression = ((index + (figee ? 1 : 0)) / questions.length) * 100;
  const juste = choix === question.bonne_reponse;

  return (
    <div className="qz" style={style}>
      <div className="qz__inner">
        <div className="qz-entete">
          <span>{infosSport.name}</span>
          <span>QUESTION {index + 1} / {questions.length}</span>
          <span className="qz-entete__score">{bonnes} PT{bonnes > 1 ? 'S' : ''}</span>
        </div>
        <div className="qz-barre">
          <div className="qz-barre__remplissage" style={{ width: `${progression}%` }} />
        </div>

        <Timer restant={restant} duree={DUREE} />

        <h1 className="qz-question">{question.question}</h1>

        <div className="qz-propositions">
          {question.propositions.map((proposition) => {
            let etat = '';
            if (figee) {
              if (proposition === question.bonne_reponse) etat = ' is-bonne';
              else if (proposition === choix) etat = ' is-mauvaise';
              else etat = ' is-eteinte';
            }

            return (
              <button
                key={proposition}
                type="button"
                className={`qz-prop${etat}`}
                disabled={figee}
                onClick={() => repondre(proposition)}
              >
                {proposition}
              </button>
            );
          })}
        </div>

        <p className={`qz-verdict${figee ? (juste ? ' is-bonne' : ' is-mauvaise') : ''}`}>
          {figee && (juste ? 'Bien joué !' : choix === null ? 'Trop tard !' : 'Raté !')}
        </p>

        <button className="qz-retour" type="button" onClick={onQuitter}>← ABANDONNER</button>
      </div>
    </div>
  );
}

export default QuizView;
