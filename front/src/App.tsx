import { useState } from 'react';
import './App.css';
import { LandingView } from './views/LandingView.tsx';
import { SetupView } from './views/SetupView.tsx';
import { QuizView } from './views/QuizView.tsx';
import { ResultsView } from './views/ResultsView.tsx';
import type { Difficulte, ReponseJoueur } from './types/quiz';

type Etape = 'landing' | 'reglages' | 'quiz' | 'resultats';

export function App() {
  const [etape, setEtape] = useState<Etape>('landing');
  const [sport, setSport] = useState('foot');
  const [pseudo, setPseudo] = useState('');
  const [difficulte, setDifficulte] = useState<Difficulte>('toutes');
  const [reponses, setReponses] = useState<ReponseJoueur[]>([]);

  switch (etape) {
    case 'reglages':
      return (
        <SetupView
          sport={sport}
          pseudo={pseudo}
          difficulte={difficulte}
          onLancer={(nouveauPseudo, niveau) => {
            setPseudo(nouveauPseudo);
            setDifficulte(niveau);
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
          onTermine={(resultat) => {
            setReponses(resultat);
            setEtape('resultats');
          }}
          onQuitter={() => setEtape('landing')}
        />
      );

    case 'resultats':
      return (
        <ResultsView
          sport={sport}
          difficulte={difficulte}
          pseudo={pseudo}
          reponses={reponses}
          onRejouer={() => setEtape('quiz')}
          onChangerSport={() => setEtape('landing')}
        />
      );

    default:
      return (
        <LandingView
          onPlay={(sportChoisi) => {
            setSport(sportChoisi);
            setEtape('reglages');
          }}
        />
      );
  }
}

export default App;
