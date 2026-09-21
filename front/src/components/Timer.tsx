// Composant chronomètre : anneau qui se vide sur la durée d'une question

interface TimerProps {
  /** Secondes restantes (peut être décimal pour une animation fluide). */
  restant: number;
  /** Durée totale d'une question, en secondes. */
  duree: number;
}

const RAYON = 33;
const CIRCONFERENCE = 2 * Math.PI * RAYON;

export function Timer({ restant, duree }: TimerProps) {
  const ratio = Math.max(0, Math.min(1, restant / duree));
  const urgent = restant <= 5;

  return (
    <div className={`qz-chrono${urgent ? ' is-urgent' : ''}`} role="timer" aria-label={`${Math.ceil(restant)} secondes restantes`}>
      <svg viewBox="0 0 78 78" aria-hidden="true">
        <circle className="qz-chrono__fond" cx="39" cy="39" r={RAYON} />
        <circle
          className="qz-chrono__jauge"
          cx="39"
          cy="39"
          r={RAYON}
          strokeDasharray={CIRCONFERENCE}
          strokeDashoffset={CIRCONFERENCE * (1 - ratio)}
        />
      </svg>
      <div className="qz-chrono__valeur">{Math.ceil(restant)}</div>
    </div>
  );
}

export default Timer;
