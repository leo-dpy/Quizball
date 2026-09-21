// Définition des types TypeScript pour QuizBall

/** Les niveaux de difficulté ; « toutes » mélange les trois. */
export type Difficulte = 'facile' | 'moyen' | 'difficile' | 'toutes';

/** Un sport jouable, tel que renvoyé par /api/categories. */
export interface Categorie {
  id: number;
  slug: string;
  nom: string;
  couleur: string;
  nb_questions: number;
}

/** Une question tirée pour une partie (propositions déjà mélangées par l'API). */
export interface QuestionQuiz {
  id: number;
  question: string;
  difficulte: Difficulte;
  propositions: string[];
  bonne_reponse: string;
}

/** Le tirage complet renvoyé par /api/quiz. */
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

/** Une ligne du classement (/api/scores). */
export interface Score {
  id: number;
  pseudo: string;
  sport: string | null;
  sport_nom: string | null;
  difficulte: Difficulte;
  score: number;
  total: number;
  date: string;
}

/** Ce que le joueur a répondu à une question, gardé pour le récap final. */
export interface ReponseJoueur {
  question: QuestionQuiz;
  choix: string | null;
  correcte: boolean;
}

/** Les réglages d'une partie. */
export interface Reglages {
  sport: string;
  difficulte: Difficulte;
  pseudo: string;
}
