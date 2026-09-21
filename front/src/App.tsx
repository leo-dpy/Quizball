import { useState } from 'react';
import './App.css';
import './styles/quiz.css';
import type { QuizSummary } from './types/quiz';
import { CategoryView } from './views/CategoryView';
import { LandingView } from './views/LandingView';
import { QuizView } from './views/QuizView';
import { ResultsView } from './views/ResultsView';

type View = 'landing' | 'categories' | 'quiz' | 'results';

export function App() {
  const [view, setView] = useState<View>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string>('Histoire');
  const [quizSummary, setQuizSummary] = useState<QuizSummary | null>(null);

  const handleStartPlay = () => {
    setView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizFinish = (summary: QuizSummary) => {
    setQuizSummary(summary);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplay = () => {
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeCategory = () => {
    setView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'landing') {
    return <LandingView onPlay={handleStartPlay} />;
  }

  if (view === 'categories') {
    return (
      <CategoryView
        onSelectCategory={handleSelectCategory}
        onBack={handleGoHome}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <QuizView
        category={selectedCategory}
        onFinish={handleQuizFinish}
        onQuit={handleChangeCategory}
      />
    );
  }

  if (view === 'results' && quizSummary) {
    return (
      <ResultsView
        summary={quizSummary}
        onReplay={handleReplay}
        onChangeCategory={handleChangeCategory}
        onHome={handleGoHome}
      />
    );
  }

  // Sécurité repli
  return <LandingView onPlay={handleStartPlay} />;
}

export default App;
