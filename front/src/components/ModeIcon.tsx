// Icônes des modes de jeu, dessinées à la main pour rester dans le style du site
import type { ModeId } from '../data/modes';

interface ModeIconProps {
  mode: ModeId;
  taille?: number;
}

export function ModeIcon({ mode, taille = 28 }: ModeIconProps) {
  const commun = {
    width: taille,
    height: taille,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (mode) {
    // Ballon : le mode classique
    case 'solo':
      return (
        <svg {...commun}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.2l3.4 2.5-1.3 4h-4.2l-1.3-4z" />
          <path d="M12 3v4.2M20.6 9.7l-5.2 2M17.5 19.4L14.1 13.7M6.5 19.4l3.4-5.7M3.4 9.7l5.2 2" />
        </svg>
      );

    // Chronomètre : contre-la-montre
    case 'chrono':
      return (
        <svg {...commun}>
          <circle cx="12" cy="13.5" r="7.5" />
          <path d="M12 9.5v4l2.5 1.7" />
          <path d="M9.5 2.5h5M12 2.5v3.5M18.8 6.2l1.6-1.6" />
        </svg>
      );

    // Cœur : survie
    case 'survie':
      return (
        <svg {...commun}>
          <path d="M12 20.3l-1.3-1.2C6.1 15 3 12.2 3 8.8 3 6.1 5.1 4 7.8 4c1.5 0 3 .7 4.2 2 1.2-1.3 2.7-2 4.2-2C18.9 4 21 6.1 21 8.8c0 3.4-3.1 6.2-7.7 10.3z" />
        </svg>
      );

    // Calendrier : défi du jour
    default:
      return (
        <svg {...commun}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <path d="M9.5 15.5l1.8 1.8 3.4-3.6" />
        </svg>
      );
  }
}

export default ModeIcon;
