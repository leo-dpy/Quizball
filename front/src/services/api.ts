import type { ModeId } from '../data/modes';
import type { Categorie, Difficulte, Score, Tirage } from '../types/quiz';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

function url(chemin: string, params: Record<string, string | number | undefined> = {}): string {
  const query = new URLSearchParams();
  for (const [cle, valeur] of Object.entries(params)) {
    if (valeur !== undefined && valeur !== '') query.set(cle, String(valeur));
  }
  const suffixe = query.toString();
  return `${BASE_URL}${chemin}${suffixe ? `?${suffixe}` : ''}`;
}

async function requete<T>(adresse: string, options?: RequestInit): Promise<T> {
  let reponse: Response;
  try {
    reponse = await fetch(adresse, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error("L'API est injoignable. Lance le serveur Laravel (php artisan serve).");
  }

  if (!reponse.ok) {
    throw new Error(`L'API a répondu ${reponse.status}.`);
  }

  return (await reponse.json()) as T;
}

export const api = {
  categories(): Promise<Categorie[]> {
    return requete<Categorie[]>(url('/categories'));
  },

  tirage(sport: string, difficulte: Difficulte, limite = 10, graine?: string): Promise<Tirage> {
    return requete<Tirage>(url('/quiz', { sport, difficulte, limite, graine }));
  },

  classement(sport?: string, mode?: ModeId, limite = 5): Promise<Score[]> {
    return requete<Score[]>(url('/scores', { sport, mode, limite }));
  },

  enregistrerScore(partie: {
    pseudo: string;
    sport: string;
    difficulte: Difficulte;
    mode: ModeId;
    score: number;
    total: number;
  }): Promise<Score> {
    return requete<Score>(url('/scores'), {
      method: 'POST',
      body: JSON.stringify(partie),
    });
  },
};
