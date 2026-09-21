import { useState } from 'react';
import { Header } from '../components/Header';
import { saveUserScore } from '../services/api';
import type { QuizSummary } from '../types/quiz';

interface ResultsViewProps {
  summary: QuizSummary;
  onReplay: () => void;
  onChangeCategory: () => void;
  onHome: () => void;
}

export function ResultsView({
  summary,
  onReplay,
  onChangeCategory,
  onHome,
}: ResultsViewProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showRecap, setShowRecap] = useState(false);

  const { score, totalQuestions, category, records } = summary;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Rang selon le score
  let rankBadge = 'AMATEUR';
  let rankEmoji = '🥉';
  let rankMessage = 'Entraîne-toi encore pour monter en division !';

  if (score === 10) {
    rankBadge = 'LÉGENDE ABSOLUE';
    rankEmoji = '👑';
    rankMessage = 'Score parfait ! Tu domines totalement cette catégorie !';
  } else if (score >= 8) {
    rankBadge = 'PRO DU QUIZ';
    rankEmoji = '🥇';
    rankMessage = 'Impressionnant ! Tu as un excellent niveau de culture générale.';
  } else if (score >= 5) {
    rankBadge = 'JOUEUR RÉGIONAL';
    rankEmoji = '🥈';
    rankMessage = 'Pas mal du tout ! Tu as la moyenne, encore un petit effort.';
  }

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await saveUserScore(playerName.trim(), score);
      setSavedSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="cq-container cq-results-view">
      <Header categoryName={category} onHome={onHome} />

      <div className="cq-results-hero">
        <div className="cq-score-circle">
          <span className="cq-score-val">{score}</span>
          <span className="cq-score-total">/ {totalQuestions}</span>
        </div>

        <div className="cq-rank-badge">
          {rankEmoji} {rankBadge} · {percentage}%
        </div>

        <p className="cq-results-lead">{rankMessage}</p>
      </div>

      {/* Formulaire d'enregistrement du score via l'API Laravel */}
      <div className="cq-save-form">
        <span className="cq-save-label">Enregistrer mon score dans l'arène :</span>
        {savedSuccess ? (
          <div className="cq-save-success">
            🎉 Score enregistré avec succès dans l'API !
          </div>
        ) : (
          <form onSubmit={handleSaveScore} className="cq-save-input-group">
            <input
              type="text"
              className="cq-save-input"
              placeholder="Ton pseudo..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={25}
              disabled={isSaving}
            />
            <button
              type="submit"
              className="cq-save-btn"
              disabled={!playerName.trim() || isSaving}
            >
              {isSaving ? '...' : 'Valider'}
            </button>
          </form>
        )}
      </div>

      {/* Accordéon récapitulatif des questions */}
      <div style={{ width: '100%', marginBottom: '24px' }}>
        <button
          type="button"
          className="cq-btn-secondary"
          onClick={() => setShowRecap((prev) => !prev)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>📋 Voir le détail des 10 questions</span>
          <span>{showRecap ? '▲' : '▼'}</span>
        </button>

        {showRecap && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
            {records.map((r, i) => (
              <div
                key={`${i}-${r.question}`}
                style={{
                  background: 'var(--cq-surface)',
                  border: '1px solid var(--cq-border)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--cq-ink)', marginBottom: '4px' }}>
                  {i + 1}. {r.question}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {r.isCorrect ? (
                    <span style={{ color: 'var(--cq-correct)', fontWeight: 700 }}>✅ Réussi</span>
                  ) : r.timedOut ? (
                    <span style={{ color: 'var(--cq-accent-orange)', fontWeight: 700 }}>⏱️ Temps écoulé</span>
                  ) : (
                    <span style={{ color: 'var(--cq-wrong)', fontWeight: 700 }}>❌ Ta réponse : {r.selectedAnswer}</span>
                  )}
                </div>
                {!r.isCorrect && (
                  <div style={{ color: 'var(--cq-correct)', fontSize: '12px', marginTop: '2px' }}>
                    Bonne réponse : {r.correctAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Groupe de boutons d'action */}
      <div className="cq-actions-group">
        <button type="button" className="cq-btn-primary" onClick={onReplay}>
          🔄 Rejouer ({category})
        </button>

        <button type="button" className="cq-btn-secondary" onClick={onChangeCategory}>
          🗂️ Choisir une autre catégorie
        </button>

        <button
          type="button"
          onClick={onHome}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--cq-ink-muted)',
            fontSize: '13px',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
