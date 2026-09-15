// Définition des types TypeScript pour notre projet Culture Quiz

export interface Categorie {
  id: number;
  categorie: string;
}

export interface Question {
  id: number;
  categorie: string;
  question: string;
  reponse1: string;
  reponse2: string;
  reponse3: string;
  reponse4: string;
  reponse5: string;
  reponse6: string;
  reponse7: string;
  reponse8: string;
  reponse9: string;
  reponse10: string;
}
