// Page de paiement FICTIVE : aucune donnée n'est envoyée, aucun paiement n'est réalisé.
// Elle sert de maquette pour la démonstration du projet.
import { useState } from 'react';
import type { FormEvent } from 'react';
import logo from '../assets/quizball-logo.png';
import './checkout.css';

export interface Offre {
  tier: string;
  price: string;
  features: string[];
}

interface CheckoutViewProps {
  offre: Offre;
  onRetour: () => void;
}

export function CheckoutView({ offre, onRetour }: CheckoutViewProps) {
  const [paye, setPaye] = useState(false);

  const valider = (e: FormEvent) => {
    e.preventDefault();
    setPaye(true);
  };

  return (
    <div className="ck">
      <div className="ck__inner">
        <p className="ck-bandeau">
          DÉMONSTRATION — projet étudiant. Aucun paiement n'est réalisé et aucune donnée n'est envoyée.
          N'entre jamais un vrai numéro de carte.
        </p>

        <img className="ck-logo" src={logo} alt="QuizBall" />

        {paye ? (
          <div className="ck-carte ck-confirmation">
            <div className="ck-coche">✓</div>
            <h1 className="ck-titre">Paiement simulé</h1>
            <p className="ck-texte">
              Voilà à quoi ressemblerait la confirmation de l'offre <strong>{offre.tier}</strong>.
              Rien n'a été débité : cette page est une maquette.
            </p>
            <button className="ck-btn" type="button" onClick={onRetour}>RETOUR AU SITE</button>
          </div>
        ) : (
          <>
            <h1 className="ck-titre">Offre {offre.tier}</h1>
            <p className="ck-prix">{offre.price}</p>

            <div className="ck-grille">
              <div className="ck-carte">
                <h2 className="ck-sous-titre">Ce que comprend l'offre</h2>
                <ul className="ck-features">
                  {offre.features.map((f) => (
                    <li key={f}>— {f}</li>
                  ))}
                </ul>
              </div>

              <form className="ck-carte" onSubmit={valider}>
                <h2 className="ck-sous-titre">Coordonnées de paiement</h2>

                <label className="ck-label" htmlFor="ck-nom">NOM SUR LA CARTE</label>
                <input className="ck-champ" id="ck-nom" type="text" placeholder="Prénom Nom" autoComplete="off" />

                <label className="ck-label" htmlFor="ck-email">EMAIL</label>
                <input className="ck-champ" id="ck-email" type="email" placeholder="ton@email.com" autoComplete="off" />

                <label className="ck-label" htmlFor="ck-carte">NUMÉRO DE CARTE (FICTIF)</label>
                <input
                  className="ck-champ"
                  id="ck-carte"
                  type="text"
                  defaultValue="4242 4242 4242 4242"
                  autoComplete="off"
                  inputMode="numeric"
                />

                <div className="ck-ligne">
                  <div>
                    <label className="ck-label" htmlFor="ck-exp">EXPIRATION</label>
                    <input className="ck-champ" id="ck-exp" type="text" defaultValue="12/30" autoComplete="off" />
                  </div>
                  <div>
                    <label className="ck-label" htmlFor="ck-cvc">CVC</label>
                    <input className="ck-champ" id="ck-cvc" type="text" defaultValue="123" autoComplete="off" />
                  </div>
                </div>

                <button className="ck-btn" type="submit">PAYER {offre.price}</button>
                <p className="ck-note">Bouton de démonstration : il affiche simplement une confirmation.</p>
              </form>
            </div>
          </>
        )}

        <button className="ck-retour" type="button" onClick={onRetour}>← RETOUR AU SITE</button>
      </div>
    </div>
  );
}

export default CheckoutView;
