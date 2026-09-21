import logo from '../assets/quizball-logo.png';

interface HeaderProps {
  onBack?: () => void;
  categoryName?: string;
  onHome?: () => void;
}

export function Header({ onBack, categoryName, onHome }: HeaderProps) {
  return (
    <header className="cq-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {onBack && (
          <button
            type="button"
            className="cq-btn-icon"
            onClick={onBack}
            aria-label="Retour"
            title="Retour"
          >
            ←
          </button>
        )}
        <div
          className="cq-header__brand"
          onClick={onHome}
          style={{ cursor: onHome ? 'pointer' : 'default' }}
          role={onHome ? 'button' : undefined}
          tabIndex={onHome ? 0 : undefined}
        >
          <img src={logo} alt="Culture Quiz Logo" className="cq-header__logo" />
          <span className="cq-header__title">CULTURE QUIZ</span>
        </div>
      </div>

      {categoryName ? (
        <span className="cq-header__badge">{categoryName}</span>
      ) : (
        <span className="cq-header__badge">30s CHRONO</span>
      )}
    </header>
  );
}
