// Écran de réglages : mode, pseudo et difficulté, avant de lancer la partie
import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import logo from '../assets/quizball-logo.png';
import { ModeIcon } from '../components/ModeIcon';
import { trouverSport } from '../data/sports';
import { MODES, cleDefi, trouverMode } from '../data/modes';
import type { ModeId } from '../data/modes';
import type { Difficulte } from '../types/quiz';
import './quiz.css';

const DIFFICULTES: { valeur: Difficulte; label: string }[] = [
  { valeur: 'toutes', label: 'TOUTES' },
  { valeur: 'facile', label: 'FACILE' },
  { valeur: 'moyen', label: 'MOYEN' },
  { valeur: 'difficile', label: 'DIFFICILE' },
];

/** Le score du défi du jour déjà joué sur ce sport, s'il existe. */
function defiDejaJoue(sport: string): string | null {
  try {
    return window.localStorage.getItem(cleDefi(sport));
  } catch {
    return null;
  }
}

interface SetupViewProps {
  sport: string;
  mode: ModeId;
  pseudo: string;
  difficulte: Difficulte;
  onLancer: (pseudo: string, difficulte: Difficulte, mode: ModeId) => void;
  onRetour: () => void;
}

export function SetupView({ sport, mode, pseudo, difficulte, onLancer, onRetour }: SetupViewProps) {
  const [nom, setNom] = useState(pseudo);
  const [niveau, setNiveau] = useState<Difficulte>(difficulte);
  const [modeChoisi, setModeChoisi] = useState<ModeId>(mode);

  const infosSport = trouverSport(sport);
  const config = trouverMode(modeChoisi);
  const style = { '--accent': infosSport.color, '--accent-rgb': infosSport.rgb } as CSSProperties;

  const defiVerrouille = config.defiDuJour ? defiDejaJoue(sport) : null;

  const valider = (e: FormEvent) => {
    e.preventDefault();
    if (defiVerrouille) return;
    const pseudoFinal = nom.trim() === '' ? 'Anonyme' : nom.trim();
    onLancer(pseudoFinal, config.choixDifficulte ? niveau : 'toutes', modeChoisi);
  };

  return (
    <div className="qz" style={style}>
      <div className="qz__inner">
        <img className="qz-logo" src={logo} alt="QuizBall" />

        <div className="qz-kicker">QUIZ {infosSport.name}</div>
        <h1 className="qz-titre">Prêt à jouer ?</h1>
        <p className="qz-sous-titre">{config.regle}</p>

        <form className="qz-carte" onSubmit={valider}>
          <div className="qz-bloc">
            <span className="qz-label">MODE DE JEU</span>
            <div className="qz-modes">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`qz-mode${m.id === modeChoisi ? ' is-active' : ''}`}
                  aria-pressed={m.id === modeChoisi}
                  onClick={() => setModeChoisi(m.id)}
                >
                  <ModeIcon mode={m.id} taille={22} />
                  <span>{m.nom}</span>
                </button>
              ))}
            </div>
          </div>

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

          {config.choixDifficulte && (
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
          )}

          <div className="qz-bloc">
            {defiVerrouille ? (
              <p className="qz-info">
                Défi du jour déjà joué sur ce sport : <strong>{defiVerrouille}</strong>.
                Reviens demain, ou choisis un autre mode.
              </p>
            ) : (
              <button className="qz-btn" type="submit">LANCER LE QUIZ</button>
            )}
          </div>
        </form>

        <button className="qz-retour" type="button" onClick={onRetour}>← CHANGER DE SPORT</button>
      </div>
    </div>
  );
}

export default SetupView;
