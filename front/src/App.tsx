import { useState } from 'react';
import { LandingView } from './views/LandingView.tsx';
import { SetupView } from './views/SetupView.tsx';
import { QuizView } from './views/QuizView.tsx';
import { ResultsView } from './views/ResultsView.tsx';
import { CheckoutView } from './views/CheckoutView.tsx';
import type { Offre } from './views/CheckoutView';
import { cleDefi } from './data/modes';
import type { ModeId } from './data/modes';
import { enregistrerJour } from './data/serie';
import type { Difficulte, ReponseJoueur } from './types/quiz';

type Etape = 'landing' | 'reglages' | 'quiz' | 'resultats' | 'paiement';

export function App() {
  const [etape, setEtape] = useState<Etape>('landing');
  const [sport, setSport] = useState('foot');
  const [mode, setMode] = useState<ModeId>('solo');
  const [pseudo, setPseudo] = useState('');
  const [difficulte, setDifficulte] = useState<Difficulte>('toutes');
  const [reponses, setReponses] = useState<ReponseJoueur[]>([]);
  const [offre, setOffre] = useState<Offre | null>(null);
  const [serie, setSerie] = useState(0);

  /** Fin de partie : on retient le résultat du défi du jour et on avance la série. */
  const terminerPartie = (resultat: ReponseJoueur[]) => {
    setReponses(resultat);

    if (mode === 'defi' && resultat.length > 0) {
      const reussites = resultat.filter((r) => r.correcte).length;
      try {
        window.localStorage.setItem(cleDefi(sport), `${reussites}/${resultat.length}`);
      } catch {
        // navigation privée ou stockage refusé : le défi restera rejouable
      }
      setSerie(enregistrerJour());
    }

    setEtape('resultats');
  };

  switch (etape) {
    case 'reglages':
      return (
        <SetupView
          sport={sport}
          mode={mode}
          pseudo={pseudo}
          difficulte={difficulte}
          onLancer={(nouveauPseudo, niveau, modeChoisi) => {
            setPseudo(nouveauPseudo);
            setDifficulte(niveau);
            setMode(modeChoisi);
            setEtape('quiz');
          }}
          onRetour={() => setEtape('landing')}
        />
      );

    case 'quiz':
      return (
        <QuizView
          sport={sport}
          difficulte={difficulte}
          mode={mode}
          onTermine={terminerPartie}
          onQuitter={() => setEtape('landing')}
        />
      );

    case 'resultats':
      return (
        <ResultsView
          sport={sport}
          difficulte={difficulte}
          mode={mode}
          pseudo={pseudo}
          reponses={reponses}
          serie={serie}
          onRejouer={() => setEtape('quiz')}
          onChangerSport={() => setEtape('landing')}
        />
      );

    case 'paiement':
      return offre ? (
        <CheckoutView offre={offre} onRetour={() => setEtape('landing')} />
      ) : null;

    default:
      return (
        <LandingView
          onPlay={(sportChoisi, modeChoisi) => {
            setSport(sportChoisi);
            setMode(modeChoisi);
            setEtape('reglages');
          }}
          onAcheter={(offreChoisie) => {
            setOffre(offreChoisie);
            setEtape('paiement');
          }}
        />
      );
  }
}

export default App;
