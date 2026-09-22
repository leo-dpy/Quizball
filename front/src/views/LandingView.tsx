// Landing page QUIZZBALL (maquette Claude Design portée en React)
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import logo from '../assets/quizball-logo.png';
import './LandingView.css';

import { SPORTS } from '../data/sports';
import { MODES } from '../data/modes';
import type { ModeId } from '../data/modes';
import { ModeIcon } from '../components/ModeIcon';
import { serieActuelle } from '../data/serie';
import type { Offre } from './CheckoutView';

const RETENTION = [
  { title: 'Streak quotidienne', desc: 'Joue chaque jour pour garder ta série. Une notif te prévient avant la rupture.' },
  { title: 'XP & Divisions', desc: 'Amateur → Régional → National → Pro → Légende. Grimpe à chaque partie.' },
  { title: 'Badges à débloquer', desc: 'Tiki-Taka, Buzzer Beater... des dizaines de badges à collectionner.' },
  { title: 'Classements', desc: 'Hebdo qui se reset chaque lundi, et all-time pour les légendes.' },
];

const PRICING = [
  { tier: 'GRATUIT', price: '0€', features: ['3 parties par jour', '1 sport au choix', 'Avec publicité'], cta: 'Commencer', highlight: false },
  { tier: 'PRO', price: '4,99€/mois', features: ['Parties illimitées', 'Tous les sports', 'Sans publicité', 'Stats détaillées', 'Duels privés'], cta: 'Passer Pro', highlight: true },
  { tier: 'CLUB', price: '39,99€/an', features: ['Tout Pro inclus', 'Accès anticipé nouveaux sports', 'Badge Club exclusif'], cta: 'Rejoindre le Club', highlight: false },
];

// Effet "aimant" : le bouton suit légèrement la souris
function magnetMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
  const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
  el.style.transform = `translate(${x}px, ${y}px)`;
}

function magnetLeave(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = '';
}

interface LandingViewProps {
  /** Lance une partie sur le sport sélectionné, dans le mode demandé. */
  onPlay: (sport: string, mode: ModeId) => void;
  /** Ouvre la page de paiement (fictive) de l'offre choisie. */
  onAcheter: (offre: Offre) => void;
}

export function LandingView({ onPlay, onAcheter }: LandingViewProps) {
  const [sport, setSport] = useState('foot');
  // La série du défi du jour, lue au montage de la page
  const [serie] = useState(() => serieActuelle());
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const tiltPending = useRef(false);

  const active = SPORTS.find((s) => s.id === sport) ?? SPORTS[0];

  // Header compact dès qu'on scrolle
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fond animé (bandes lumineuses à la couleur du sport)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const c = active.rgb;
    let raf = 0;

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const t = timeRef.current;
      ctx.fillStyle = '#030A14';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 4; i++) {
        const y = h * 0.15 + i * h * 0.22 + Math.sin(t * 0.4 + i) * 30;
        const grad = ctx.createLinearGradient(0, y - 60, w, y + 60);
        grad.addColorStop(0, `rgba(${c},0)`);
        grad.addColorStop(0.5, `rgba(${c},${0.05 + 0.02 * Math.sin(t * 0.6 + i)})`);
        grad.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, y - 90, w, 180);
      }
      const rg = ctx.createRadialGradient(w * 0.5, h * 0.35, 10, w * 0.5, h * 0.35, h * 0.6);
      rg.addColorStop(0, `rgba(${c},0.08)`);
      rg.addColorStop(1, 'rgba(3,10,20,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      timeRef.current += 0.012;
      if (!reducedMotion) raf = requestAnimationFrame(draw);
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (reducedMotion) draw();
    }

    resize();
    if (!reducedMotion) draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active.rgb, reducedMotion]);

  // Inclinaison 3D du ballon selon la position de la souris
  const handleHeroMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion || tiltPending.current) return;
    tiltPending.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    requestAnimationFrame(() => {
      setTilt({ x, y });
      tiltPending.current = false;
    });
  };

  const stats = [
    {
      label: 'SÉRIE ACTUELLE',
      value: serie > 0 ? `${serie} JOUR${serie > 1 ? 'S' : ''}` : 'AUCUNE',
      color: '#FE8D07',
    },
    { label: 'DIVISION', value: 'RÉGIONAL', color: '#FFC93C' },
    { label: 'BADGES', value: '7 / 24', color: '#01C187' },
  ];

  const rootStyle = { '--accent': active.color, '--accent-rgb': active.rgb } as CSSProperties;
  const ballTilt = `perspective(700px) rotateX(${(tilt.y * 10).toFixed(2)}deg) rotateY(${(tilt.x * -10).toFixed(2)}deg)`;

  return (
    <div className="qb" style={rootStyle}>
      <canvas ref={canvasRef} className="qb-canvas" aria-hidden="true" />

      <header className={`qb-header${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#" className="qb-logo" aria-label="QuizBall — retour en haut">
          <img src={logo} alt="QuizBall" />
        </a>
        <nav className="qb-nav">
          <a href="#modes">MODES</a>
          <a href="#retention">PROGRESSION</a>
          <a href="#pricing">TARIFS</a>
          <button type="button" className="qb-btn qb-btn--small" onClick={() => onPlay(sport, 'solo')} onMouseMove={magnetMove} onMouseLeave={magnetLeave}>
            JOUER
          </button>
        </nav>
      </header>

      <section className="qb-hero" onMouseMove={handleHeroMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
        <div className="qb-hero__inner">
          <div className="qb-kicker qb-kicker--muted">QUIZ SPORTIF · ARÈNE NOCTURNE</div>
          <h1 className="qb-title qb-hero__title">
            Prouve que t'es
            <br />
            <span className="qb-accent">le plus fort</span>
          </h1>
          <p className="qb-hero__lead">
            Football, basket, tennis ou tous les sports. Choisis ton terrain, le quiz démarre aussitôt : 10 questions, 15 secondes chacune, et un classement pour humilier tes potes.
          </p>

          <div className="qb-pills">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`qb-pill${s.id === sport ? ' is-active' : ''}`}
                aria-pressed={s.id === sport}
                onClick={() => setSport(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="qb-ball" aria-hidden="true">
            <div className="qb-ball__glow" />
            <div className="qb-ball__float">
              <div className="qb-ball__body" style={{ transform: ballTilt }}>
                {SPORTS.map((s) => (
                  <div
                    key={s.id}
                    className={`qb-ball__layer${s.id === sport ? ' is-active' : ''}`}
                    style={{ background: `radial-gradient(circle at 35% 30%, ${s.color}, ${s.color}55 60%, #030A14 100%)` }}
                  >
                    {s.id === 'foot' && <div className="qb-ball__pattern" />}
                  </div>
                ))}
                {sport !== 'multi' && (
                  <>
                    <div className="qb-ball__seam" />
                    <div className="qb-ball__seam qb-ball__seam--h" />
                    <div className="qb-ball__ring" />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="qb-cta-row">
            <button type="button" className="qb-btn qb-btn--main" onClick={() => onPlay(sport, 'solo')} onMouseMove={magnetMove} onMouseLeave={magnetLeave}>
              JOUER AU QUIZ {active.name}
            </button>
            <a href="#pricing" className="qb-btn qb-btn--ghost">
              VOIR LES OFFRES
            </a>
          </div>
        </div>
      </section>

      <section id="modes" className="qb-section qb-section--modes">
        <div className="qb-section__head">
          <div className="qb-kicker">MODES DE JEU</div>
          <h2 className="qb-title qb-section__title">Choisis ton terrain</h2>
        </div>
        <div className="qb-modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="qb-glass qb-mode"
              onClick={() => onPlay(sport, m.id)}
            >
              <span className="qb-mode__icon"><ModeIcon mode={m.id} /></span>
              <span className="qb-mode__title">{m.nom}</span>
              <span className="qb-text-muted">{m.desc}</span>
              <span className="qb-mode__cta">JOUER EN {m.nom} →</span>
            </button>
          ))}
        </div>
      </section>

      <section id="retention" className="qb-section qb-retention">
        <div>
          <div className="qb-kicker">PROGRESSION</div>
          <h2 className="qb-title qb-retention__title">Deviens une légende</h2>
          <div className="qb-perks">
            {RETENTION.map((r) => (
              <div key={r.title} className="qb-perk">
                <div className="qb-perk__dot" />
                <div>
                  <div className="qb-perk__title">{r.title}</div>
                  <div className="qb-text-muted">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="qb-glass qb-stats">
          {stats.map((st) => (
            <div key={st.label} className="qb-stat">
              <div className="qb-stat__label">{st.label}</div>
              <div className="qb-stat__value" style={{ color: st.color }}>
                {st.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="qb-section">
        <div className="qb-section__head">
          <div className="qb-kicker">TARIFS</div>
          <h2 className="qb-title qb-section__title">Choisis ton niveau</h2>
        </div>
        <div className="qb-pricing">
          {PRICING.map((p) => (
            <div key={p.tier} className={`qb-plan${p.highlight ? ' is-highlight' : ''}`}>
              {p.highlight && <div className="qb-plan__badge">LE PLUS CHOISI</div>}
              <div className="qb-plan__tier">{p.tier}</div>
              <div className="qb-plan__price">{p.price}</div>
              <ul className="qb-plan__features">
                {p.features.map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <button type="button" className="qb-btn qb-plan__cta" onClick={() => onAcheter({ tier: p.tier, price: p.price, features: p.features })}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>


      <footer className="qb-footer">
        <div className="qb-footer__grid">
          <div>
            <img className="qb-footer__logo" src={logo} alt="QuizBall" />
            <div className="qb-footer__about">L'arène du quiz sportif. Foot, basket, tennis — prouve que t'es le plus fort.</div>
          </div>
          <div>
            <div className="qb-footer__heading">PRODUIT</div>
            <div className="qb-footer__links">
              <a href="#modes">Modes de jeu</a>
              <a href="#pricing">Tarifs</a>
              <button type="button" className="qb-link-btn" onClick={() => onPlay(sport, 'solo')}>
                Jouer
              </button>
            </div>
          </div>
          <div>
            <div className="qb-footer__heading">LÉGAL</div>
            <div className="qb-footer__links">
              <a href="#">Mentions légales</a>
              <a href="#">CGV</a>
              <a href="#">Confidentialité</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div>
            <div className="qb-footer__heading">RÉSEAUX</div>
            <div className="qb-footer__links">
              <a href="#">Instagram</a>
              <a href="#">TikTok</a>
              <a href="#">X</a>
            </div>
          </div>
        </div>
        <div className="qb-footer__bottom">
          <div>© 2026 QUIZZBALL. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
