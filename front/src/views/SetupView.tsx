// Écran de réglages : pseudo et difficulté, avant de lancer la partie
import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import logo from '../assets/quizball-logo.png';
import { trouverSport } from '../data/sports';
import type { Difficulte } from '../types/quiz';
import './quiz.css';

const DIFFICULTES: { valeur: Difficulte; label: string }[] = [
  { valeur: 'toutes', label: 'TOUTES' },
  { valeur: 'facile', label: 'FACILE' },
  { valeur: 'moyen', label: 'MOYEN' },
  { valeur: 'difficile', label: 'DIFFICILE' },
];

interface SetupViewProps {
  sport: string;
  pseudo: string;
  difficulte: Difficulte;
  onLancer: (pseudo: string, difficulte: Difficulte) => void;
  onRetour: () => void;
}

export function SetupView({ sport, pseudo, difficulte, onLancer, onRetour }: SetupViewProps) {
  const [nom, setNom] = useState(pseudo);
  const [niveau, setNiveau] = useState<Difficulte>(difficulte);

  const infosSport = trouverSport(sport);
  const style = { '--accent': infosSport.color, '--accent-rgb': infosSport.rgb } as CSSProperties;

  const valider = (e: FormEvent) => {
    e.preventDefault();
    const pseudoFinal = nom.trim() === '' ? 'Anonyme' : nom.trim();
    onLancer(pseudoFinal, niveau);
  };

  return (
    <div className="qz" style={style}>
      <div className="qz__inner">
        <img className="qz-logo" src={logo} alt="QuizBall" />

        <div className="qz-kicker">QUIZ {infosSport.name}</div>
        <h1 className="qz-titre">Prêt à jouer ?</h1>
        <p className="qz-sous-titre">10 questions, 15 secondes chacune. Pas de deuxième chance.</p>

        <form className="qz-carte" onSubmit={valider}>
          <div className="qz-bloc">
            <label className="qz-label" htmlFor="pseudo">TON PSEUDO</label>
            <input
              className="qz-champ"
              id="pseudo"
              type="text"
              maxLength={20}
              placeholder="Anonyme"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>

          <div className="qz-bloc">
            <span className="qz-label">DIFFICULTÉ</span>
            <div className="qz-pills">
              {DIFFICULTES.map((d) => (
                <button
                  key={d.valeur}
                  type="button"
                  className={`qz-pill${d.valeur === niveau ? ' is-active' : ''}`}
                  aria-pressed={d.valeur === niveau}
                  onClick={() => setNiveau(d.valeur)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="qz-bloc">
            <button className="qz-btn" type="submit">LANCER LE QUIZ</button>
          </div>
        </form>

        <button className="qz-retour" type="button" onClick={onRetour}>← CHANGER DE SPORT</button>
      </div>
    </div>
  );
}

export default SetupView;
