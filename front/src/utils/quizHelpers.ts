import type { Question, PreparedQuestion } from '../types/quiz';

/**
 * Mélange un tableau selon l'algorithme Fisher-Yates (non destructif).
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Prépare une question conformément aux consignes du sujet :
 * - 10 réponses existent en base.
 * - Exactement 4 propositions sont affichées (la bonne réponse reponse1 + 3 mauvaises au hasard).
 * - Les 4 propositions sont mélangées aléatoirement.
 */
export function prepareQuestion(rawQuestion: Question): PreparedQuestion {
  const correctAnswer = rawQuestion.reponse1;

  // Récupérer toutes les propositions incorrectes existantes
  const allWrongAnswers = [
    rawQuestion.reponse2,
    rawQuestion.reponse3,
    rawQuestion.reponse4,
    rawQuestion.reponse5,
    rawQuestion.reponse6,
    rawQuestion.reponse7,
    rawQuestion.reponse8,
    rawQuestion.reponse9,
    rawQuestion.reponse10,
  ].filter((ans) => Boolean(ans && ans.trim()));

  // Mélanger et piocher 3 mauvaises réponses
  const shuffledWrong = shuffleArray(allWrongAnswers);
  const pickedWrong = shuffledWrong.slice(0, 3);

  // 4 propositions : la bonne réponse + 3 mauvaises, puis mélange aléatoire
  const options = shuffleArray([correctAnswer, ...pickedWrong]);

  return {
    id: rawQuestion.id,
    categorie: rawQuestion.categorie,
    question: rawQuestion.question,
    correctAnswer,
    options,
  };
}

/**
 * Prépare la liste de questions pour une session de jeu (par défaut 10 questions).
 */
export function prepareQuiz(questions: Question[], limit: number = 10): PreparedQuestion[] {
  const shuffledQuestions = shuffleArray(questions);
  const selected = shuffledQuestions.slice(0, limit);
  return selected.map(prepareQuestion);
}
