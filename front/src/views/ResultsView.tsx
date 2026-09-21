// Écran de fin : score, récap des erreurs et classement
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import logo from '../assets/quizball-logo.png';
import { api } from '../services/api';
import { trouverSport } from '../data/sports';
import type { Difficulte, ReponseJoueur, Score } from '../types/quiz';
import './quiz.css';

interface ResultsViewProps {
  sport: string;
  difficulte: Difficulte;
  pseudo: string;
  reponses: ReponseJoueur[];
  onRejouer: () => void;
  onChangerSport: () => void;
}

/** Le petit mot qui accompagne le score. */
function bilan(score: number, total: number): string {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio === 1) return 'Sans faute. Personne ne te conteste le titre.';
  if (ratio >= 0.8) return 'Gros niveau, tu connais ton sujet.';
  if (ratio >= 0.5) return 'Pas mal, mais la légende attendra.';
  if (ratio >= 0.3) return 'Il va falloir réviser avant de parler aux potes.';
  return 'Aïe. On va dire que tu débutes.';
}

export function ResultsView({ sport, difficulte, pseudo, reponses, onRejouer, onChangerSport }: ResultsViewProps) {
  const [classement, setClassement] = useState<Score[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const envoi = useRef<Promise<Score> | null>(null);

  const infosSport = trouverSport(sport);
  const style = { '--accent': infosSport.color, '--accent-rgb': infosSport.rgb } as CSSProperties;

  const total = reponses.length;
  const score = reponses.filter((r) => r.correcte).length;
  const ratees = reponses.filter((r) => !r.correcte);

  // Envoi du score, puis récupération du classement.
  // En mode strict, React monte le composant deux fois : on réutilise la même promesse
  // d'envoi pour enregistrer le score une seule fois tout en affichant le classement.
  useEffect(() => {
    if (total === 0) return;

    let annule = false;

    if (!envoi.current) {
      envoi.current = api.enregistrerScore({ pseudo, sport, difficulte, score, total });
    }

    envoi.current
      .then(() => api.classement(sport, 5))
      .then((tops) => {
        if (!annule) setClassement(tops);
      })
      .catch((e: Error) => {
        if (!annule) setErreur(e.message);
      });

    return () => {
      annule = true;
    };
  }, [pseudo, sport, difficulte, score, total]);

  return (
    <div className="qz" style={style}>
      <div className="qz__inner">
        <img className="qz-logo" src={logo} alt="QuizBall" />

        <div className="qz-kicker">QUIZ {infosSport.name}</div>
        <p className="qz-score">
          {score}<span className="qz-score__total"> / {total}</span>
        </p>
        <p className="qz-bilan">{bilan(score, total)}</p>

        <div className="qz-actions">
          <button className="qz-btn" type="button" onClick={onRejouer}>REJOUER</button>
          <button className="qz-btn qz-btn--ghost" type="button" onClick={onChangerSport}>CHANGER DE SPORT</button>
        </div>

        {ratees.length > 0 && (
          <>
            <h2 className="qz-section-titre">Ce qu'il fallait répondre</h2>
            <ul className="qz-recap">
              {ratees.map((r) => (
                <li className="qz-recap__item" key={r.question.id}>
                  <div className="qz-recap__question">{r.question.question}</div>
                  <div className="qz-recap__ligne">
                    Bonne réponse : <span className="qz-recap__bonne">{r.question.bonne_reponse}</span>
                  </div>
                  <div className="qz-recap__ligne">
                    Ta réponse : <span className="qz-recap__choix">{r.choix ?? 'aucune (temps écoulé)'}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="qz-section-titre">Meilleurs scores — {infosSport.name}</h2>
        {erreur && <p className="qz-erreur-api">{erreur}</p>}
        {!erreur && classement === null && <p className="qz-chargement">Enregistrement du score…</p>}
        {!erreur && classement !== null && classement.length === 0 && (
          <p className="qz-info">Aucun score enregistré pour ce sport.</p>
        )}
        {!erreur && classement !== null && classement.length > 0 && (
          <ul className="qz-classement">
            {classement.map((ligne, rang) => (
              <li className={`qz-rang${ligne.pseudo === pseudo && ligne.score === score ? ' is-moi' : ''}`} key={ligne.id}>
                <span className="qz-rang__place">{rang + 1}</span>
                <span className="qz-rang__pseudo">{ligne.pseudo}</span>
                <span className="qz-rang__detail">{ligne.difficulte.toUpperCase()}</span>
                <span className="qz-rang__place">{ligne.score}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ResultsView;
