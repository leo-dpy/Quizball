
export type ModeId = 'solo' | 'chrono' | 'survie' | 'defi';

export interface Mode {
  id: ModeId;
  nom: string;
  desc: string;
  regle: string;
  choixDifficulte: boolean;
  nbQuestions: number;
  secondesParQuestion: number;
  secondesPartie: number;
  mortSubite: boolean;
  defiDuJour: boolean;
}

export const MODES: Mode[] = [
  {
    id: 'solo',
    nom: 'SOLO',
    desc: '10 questions, la difficulté que tu choisis. Le classique pour se chauffer.',
    regle: '10 questions, 30 secondes chacune. Pas de deuxième chance.',
    choixDifficulte: true,
    nbQuestions: 10,
    secondesParQuestion: 30,
    secondesPartie: 0,
    mortSubite: false,
    defiDuJour: false,
  },
  {
    id: 'chrono',
    nom: 'CONTRE-LA-MONTRE',
    desc: '60 secondes. Un maximum de bonnes réponses avant la sirène.',
    regle: '60 secondes pour toute la partie. Les questions défilent sans pause.',
    choixDifficulte: true,
    nbQuestions: 0,
    secondesParQuestion: 0,
    secondesPartie: 60,
    mortSubite: false,
    defiDuJour: false,
  },
  {
    id: 'survie',
    nom: 'SURVIE',
    desc: "Une seule erreur et c'est fini. La difficulté monte à chaque palier.",
    regle: "Une erreur et la partie s'arrête. Facile, puis moyen, puis difficile.",
    choixDifficulte: false,
    nbQuestions: 0,
    secondesParQuestion: 15,
    secondesPartie: 0,
    mortSubite: true,
    defiDuJour: false,
  },
  {
    id: 'defi',
    nom: 'DÉFI DU JOUR',
    desc: 'Une seule question, la même pour tous. Reviens chaque jour pour allonger ta série.',
    regle: 'Une question, un seul essai. Ta série grimpe à chaque jour consécutif.',
    choixDifficulte: false,
    nbQuestions: 1,
    secondesParQuestion: 15,
    secondesPartie: 0,
    mortSubite: false,
    defiDuJour: true,
  },
];

export function trouverMode(id: ModeId | string): Mode {
  return MODES.find((m) => m.id === id) ?? MODES[0];
}

export function graineDuJour(): string {
  const maintenant = new Date();
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
  const jour = String(maintenant.getDate()).padStart(2, '0');
  return `${maintenant.getFullYear()}-${mois}-${jour}`;
}

export function cleDefi(sport: string): string {
  return `quizball-defi-${graineDuJour()}-${sport}`;
}
