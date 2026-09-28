import type { ModeId } from '../data/modes';

export type Difficulte = 'facile' | 'moyen' | 'difficile' | 'toutes' | 'progressive';

export interface Categorie {
  id: number;
  slug: string;
  nom: string;
  couleur: string;
  nb_questions: number;
}

export interface QuestionQuiz {
  id: number;
  question: string;
  difficulte: Difficulte;
  propositions: string[];
  bonne_reponse: string;
}

export interface Tirage {
  sport: {
    slug: string;
    nom: string;
    couleur: string;
  };
  difficulte: Difficulte;
  total: number;
  questions: QuestionQuiz[];
}

export interface Score {
  id: number;
  pseudo: string;
  sport: string | null;
  sport_nom: string | null;
  difficulte: Difficulte;
  mode: ModeId;
  score: number;
  total: number;
  date: string;
}

export interface ReponseJoueur {
  question: QuestionQuiz;
  choix: string | null;
  correcte: boolean;
}

export interface Reglages {
  sport: string;
  difficulte: Difficulte;
  mode: ModeId;
  pseudo: string;
}
