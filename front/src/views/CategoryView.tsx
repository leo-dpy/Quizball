import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Header } from '../components/Header';
import { getCategories } from '../services/api';
import type { Categorie } from '../types/quiz';

interface CategoryViewProps {
  onSelectCategory: (categoryName: string) => void;
  onBack: () => void;
}

interface CategoryTheme {
  icon: string;
  color: string;
  desc: string;
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  Histoire: {
    icon: '🏛️',
    color: '#FE8D07',
    desc: 'Antiquité, révolutions, grands personnages & dates clés',
  },
  Cinéma: {
    icon: '🎬',
    color: '#A855F7',
    desc: 'Films cultes, acteurs légendaires, Oscars & répliques',
  },
  Sport: {
    icon: '⚽',
    color: '#01C187',
    desc: 'Football, basketball, tennis, records & Jeux Olympiques',
  },
  Géographie: {
    icon: '🌍',
    color: '#38BDF8',
    desc: 'Capitales du monde, océans, sommets & frontières',
  },
  Sciences: {
    icon: '🧪',
    color: '#FFC93C',
    desc: 'Physique, chimie, astronomie, corps humain & nature',
  },
};

export function CategoryView({ onSelectCategory, onBack }: CategoryViewProps) {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = () => {
    setLoading(true);
    setError(null);
    getCategories()
      .then((data) => {
        setCategories(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de joindre le serveur API. Vérifiez que le backend Laravel est bien lancé.');
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    getCategories()
      .then((data) => {
        if (!ignore) {
          setCategories(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          setError('Impossible de joindre le serveur API. Vérifiez que le backend Laravel est bien lancé.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="cq-container cq-categories-view">
      <Header onBack={onBack} onHome={onBack} />

      <div className="cq-section-heading">
        <div className="cq-kicker">Étape 1 · Sélection</div>
        <h1 className="cq-page-title">Choisis ta thématique</h1>
        <p className="cq-page-lead">
          10 questions chronométrées à 30 secondes. Teste tes connaissances et prouve ton niveau !
        </p>
      </div>

      {loading && (
        <div className="cq-loading-state">
          <div className="cq-spinner" />
          <p style={{ color: 'var(--cq-ink-muted)', fontSize: '15px' }}>
            Chargement des catégories depuis l'API...
          </p>
        </div>
      )}

      {error && (
        <div className="cq-error-state">
          <div style={{ fontSize: '36px' }}>⚠️</div>
          <p className="cq-error-msg">{error}</p>
          <button type="button" className="cq-btn-secondary" onClick={loadCategories}>
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="cq-categories-grid">
          {categories.map((cat) => {
            const theme = CATEGORY_THEMES[cat.categorie] ?? {
              icon: '🧠',
              color: '#01C187',
              desc: 'Quiz de culture générale et questions variées',
            };

            const cardStyle = {
              '--cat-accent': theme.color,
            } as CSSProperties;

            return (
              <button
                key={cat.id}
                type="button"
                className="cq-cat-card"
                style={cardStyle}
                onClick={() => onSelectCategory(cat.categorie)}
              >
                <div className="cq-cat-icon">{theme.icon}</div>
                <div className="cq-cat-info">
                  <div className="cq-cat-name">{cat.categorie}</div>
                  <div className="cq-cat-desc">{theme.desc}</div>
                </div>
                <div className="cq-cat-arrow">→</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
