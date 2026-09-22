// La série du défi du jour : nombre de jours consécutifs où le défi a été relevé.
// Tout est gardé dans le navigateur, il n'y a pas de compte utilisateur.

const CLE = 'quizball-serie';

interface EtatSerie {
  jours: number;
  dernierJour: string;
}

/** Une date au format AAAA-MM-JJ. */
function formater(date: Date): string {
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mois}-${jour}`;
}

function aujourdhui(): string {
  return formater(new Date());
}

function hier(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formater(date);
}

function lire(): EtatSerie | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const etat = JSON.parse(brut) as EtatSerie;
    return typeof etat.jours === 'number' && typeof etat.dernierJour === 'string' ? etat : null;
  } catch {
    return null;
  }
}

/** La série en cours. Elle retombe à 0 si le défi d'hier a été manqué. */
export function serieActuelle(): number {
  const etat = lire();
  if (!etat) return 0;
  return etat.dernierJour === aujourdhui() || etat.dernierJour === hier() ? etat.jours : 0;
}

/**
 * Enregistre le défi du jour comme relevé et renvoie la nouvelle série.
 * Rejouer le même jour ne fait pas monter le compteur.
 */
export function enregistrerJour(): number {
  const etat = lire();
  const jour = aujourdhui();

  if (etat && etat.dernierJour === jour) return etat.jours;

  const jours = etat && etat.dernierJour === hier() ? etat.jours + 1 : 1;

  try {
    window.localStorage.setItem(CLE, JSON.stringify({ jours, dernierJour: jour }));
  } catch {
    // stockage indisponible : la série ne sera pas retenue
  }

  return jours;
}
