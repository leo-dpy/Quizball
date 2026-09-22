// Écran de jeu. Le comportement dépend du mode : questions comptées, chrono global ou mort subite.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Timer } from '../components/Timer';
import { api } from '../services/api';
import { trouverSport } from '../data/sports';
import { graineDuJour, trouverMode } from '../data/modes';
import type { ModeId } from '../data/modes';
import type { Difficulte, QuestionQuiz, ReponseJoueur } from '../types/quiz';
import './quiz.css';

/** Réservoir de questions pour les modes sans nombre fixe (chrono, survie). */
const RESERVE = 30;
/** Ordre des paliers du mode survie. */
const PALIERS: Difficulte[] = ['facile', 'moyen', 'difficile'];

interface QuizViewProps {
  sport: string;
  difficulte: Difficulte;
  mode: ModeId;
  onTermine: (reponses: ReponseJoueur[]) => void;
  onQuitter: () => void;
}

export function QuizView({ sport, difficulte, mode, onTermine, onQuitter }: QuizViewProps) {
  const config = trouverMode(mode);

  const [questions, setQuestions] = useState<QuestionQuiz[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<string | null>(null);
  const [figee, setFigee] = useState(false);
  const [restant, setRestant] = useState(config.secondesParQuestion);
  const [tempsPartie, setTempsPartie] = useState(config.secondesPartie);
  const [reponses, setReponses] = useState<ReponseJoueur[]>([]);

  // Copie des réponses lisible depuis les minuteurs, qui ne voient pas l'état à jour
  const reponsesRef = useRef<ReponseJoueur[]>([]);
  const termine = useRef(false);

  const infosSport = trouverSport(sport);
  const style = { '--accent': infosSport.color, '--accent-rgb': infosSport.rgb } as CSSProperties;

  /** Termine la partie une seule fois, quel que soit le minuteur qui déclenche. */
  const terminer = useCallback(() => {
    if (termine.current) return;
    termine.current = true;
    onTermine(reponsesRef.current);
  }, [onTermine]);

  // Tirage des questions au démarrage
  useEffect(() => {
    let annule = false;

    const limite = config.nbQuestions > 0 ? config.nbQuestions : RESERVE;
    const niveau: Difficulte = config.choixDifficulte ? difficulte : 'toutes';
    const graine = config.defiDuJour ? graineDuJour() : undefined;

    api
      .tirage(sport, niveau, limite, graine)
      .then((tirage) => {
        if (annule) return;
        let liste = tirage.questions;

        // En survie, on monte les paliers : facile, puis moyen, puis difficile
        if (config.mortSubite) {
          liste = [...liste].sort(
            (a, b) => PALIERS.indexOf(a.difficulte) - PALIERS.indexOf(b.difficulte),
          );
        }

        if (liste.length === 0) {
          setErreur('Aucune question pour ce sport et cette difficulté.');
        }
        setQuestions(liste);
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
  }, [sport, difficulte, config]);

  const question = questions[index];

  /** Enregistre la réponse puis fige la question le temps d'afficher le corrigé. */
  const repondre = useCallback(
    (proposition: string | null) => {
      if (figee || !question) return;

      const reponse: ReponseJoueur = {
        question,
        choix: proposition,
        correcte: proposition === question.bonne_reponse,
      };

      reponsesRef.current = [...reponsesRef.current, reponse];
      setReponses(reponsesRef.current);
      setChoix(proposition);
      setFigee(true);
    },
    [figee, question],
  );

  // Chrono par question (solo, survie, défi)
  useEffect(() => {
    if (config.secondesParQuestion === 0) return;
    if (chargement || erreur || figee || !question) return;

    const debut = Date.now();
    const minuteur = window.setInterval(() => {
      const reste = config.secondesParQuestion - (Date.now() - debut) / 1000;

      if (reste <= 0) {
        window.clearInterval(minuteur);
        setRestant(0);
        repondre(null);
      } else {
        setRestant(reste);
      }
    }, 100);

    return () => window.clearInterval(minuteur);
  }, [chargement, erreur, figee, question, repondre, config.secondesParQuestion]);

  // Chrono global (contre-la-montre) : la sirène arrête la partie sur-le-champ
  useEffect(() => {
    if (config.secondesPartie === 0 || chargement || erreur) return;

    const debut = Date.now();
    const minuteur = window.setInterval(() => {
      const reste = config.secondesPartie - (Date.now() - debut) / 1000;

      if (reste <= 0) {
        window.clearInterval(minuteur);
        setTempsPartie(0);
        terminer();
      } else {
        setTempsPartie(reste);
      }
    }, 100);

    return () => window.clearInterval(minuteur);
  }, [chargement, erreur, config.secondesPartie, terminer]);

  // Passage à la question suivante, ou fin de partie
  useEffect(() => {
    if (!figee) return;

    // Le corrigé s'affiche moins longtemps quand le chrono global tourne
    const pause = config.secondesPartie > 0 ? 700 : 1600;

    const suite = window.setTimeout(() => {
      const derniere = reponsesRef.current[reponsesRef.current.length - 1];

      if (config.mortSubite && derniere && !derniere.correcte) {
        terminer();
        return;
      }

      if (index + 1 >= questions.length) {
        terminer();
        return;
      }

      setIndex((i) => i + 1);
      setChoix(null);
      setFigee(false);
      setRestant(config.secondesParQuestion);
    }, pause);

    return () => window.clearTimeout(suite);
  }, [figee, index, questions.length, config.mortSubite, config.secondesPartie, config.secondesParQuestion, terminer]);

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
  const chronoGlobal = config.secondesPartie > 0;

  // Ce que montre le compteur du milieu et la barre, selon le mode
  let compteur: string;
  let progression: number;
  if (chronoGlobal) {
    compteur = `${Math.ceil(tempsPartie)} S RESTANTES`;
    progression = (tempsPartie / config.secondesPartie) * 100;
  } else if (config.mortSubite) {
    compteur = `SÉRIE : ${bonnes}`;
    progression = ((index + (figee ? 1 : 0)) / questions.length) * 100;
  } else {
    compteur = `QUESTION ${index + 1} / ${questions.length}`;
    progression = ((index + (figee ? 1 : 0)) / questions.length) * 100;
  }

  const juste = choix === question.bonne_reponse;

  return (
    <div className="qz" style={style}>
      <div className="qz__inner">
        <div className="qz-entete">
          <span>{config.nom}</span>
          <span>{compteur}</span>
          <span className="qz-entete__score">{bonnes} PT{bonnes > 1 ? 'S' : ''}</span>
        </div>
        <div className="qz-barre">
          <div className="qz-barre__remplissage" style={{ width: `${progression}%` }} />
        </div>

        {chronoGlobal ? (
          <Timer restant={tempsPartie} duree={config.secondesPartie} />
        ) : (
          <Timer restant={restant} duree={config.secondesParQuestion} />
        )}

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
