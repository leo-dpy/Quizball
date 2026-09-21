import type { Categorie, Question } from '../types/quiz';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

/**
 * Récupère la liste de toutes les catégories depuis l'API Laravel (/api/categories).
 */
export async function getCategories(): Promise<Categorie[]> {
  try {
    const response = await fetch(`${BASE_URL}/categories`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur (${response.status}) lors de la récupération des catégories.`);
    }

    const data: Categorie[] = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API getCategories:', error);
    throw error;
  }
}

/**
 * Récupère les questions depuis l'API Laravel (/api/questions).
 * Supporte le filtrage par catégorie côté serveur ou client.
 */
export async function getQuestions(categorie?: string): Promise<Question[]> {
  try {
    const url = categorie
      ? `${BASE_URL}/questions?categorie=${encodeURIComponent(categorie)}`
      : `${BASE_URL}/questions`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur (${response.status}) lors de la récupération des questions.`);
    }

    let questions: Question[] = await response.json();

    // Sécurité : si le backend renvoie tout sans filtrer, on applique le filtre côté client
    if (categorie) {
      const filtered = questions.filter(
        (q) => q.categorie.trim().toLowerCase() === categorie.trim().toLowerCase()
      );
      if (filtered.length > 0) {
        questions = filtered;
      }
    }

    return questions;
  } catch (error) {
    console.error('Erreur API getQuestions:', error);
    throw error;
  }
}

/**
 * Enregistre le score ou l'utilisateur (/api/users)
 */
export async function saveUserScore(name: string, score: number): Promise<{ success: boolean; data?: unknown }> {
  try {
    const sanitizedName = name.trim() || 'Joueur Anonyme';
    const email = `${sanitizedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'joueur'}_${Date.now()}@culturequiz.local`;

    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: `${sanitizedName} (${score}/10)`,
        email,
        password: 'quizpassword',
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'enregistrement du score (${response.status})`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.warn('Impossible de sauvegarder le score via l\'API :', error);
    return { success: false };
  }
}
