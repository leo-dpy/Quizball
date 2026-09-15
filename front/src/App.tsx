import { useState } from 'react';
import './App.css';
import { LandingView } from './views/LandingView.tsx';
import { CategoryView } from './views/CategoryView.tsx';

type View = 'landing' | 'categories';

export function App() {
  const [view, setView] = useState<View>('landing');

  if (view === 'landing') {
    return <LandingView onPlay={() => setView('categories')} />;
  }

  return (
    <div className="app">
      <CategoryView />
    </div>
  );
}

export default App;
