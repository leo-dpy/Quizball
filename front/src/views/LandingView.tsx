// Landing page QUIZZBALL (maquette Claude Design portée en React)
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import logo from '../assets/quizball-logo.png';
import './LandingView.css';

type SportId = 'foot' | 'basket' | 'tennis';

interface Sport {
  id: SportId;
  name: string;
  color: string;
  rgb: string;
}

const SPORTS: Sport[] = [
  { id: 'foot', name: 'FOOTBALL', color: '#01C187', rgb: '1, 193, 135' },
  { id: 'basket', name: 'BASKET', color: '#FE8D07', rgb: '254, 141, 7' },
  { id: 'tennis', name: 'TENNIS', color: '#FFC93C', rgb: '255, 201, 60' },
];

const MODES = [
  { title: 'SOLO', desc: '10 questions, difficulté croissante. Le classique pour se chauffer.' },
  { title: 'CONTRE-LA-MONTRE', desc: '60 secondes. Un maximum de bonnes réponses avant la sirène.' },
  { title: 'SURVIE', desc: "Une seule erreur et c'est fini. Le multiplicateur grimpe à chaque bonne réponse." },
  { title: 'DUEL 1V1', desc: 'Envoie un lien à un pote, écran splitté, scores côte à côte en direct.' },
  { title: 'DÉFI DU JOUR', desc: 'La même question pour tout le monde. Résultat partageable, façon grille colorée.' },
];

const RETENTION = [
  { title: 'Streak quotidienne', desc: 'Joue chaque jour pour garder ta série. Une notif te prévient avant la rupture.' },
  { title: 'XP & Divisions', desc: 'Amateur → Régional → National → Pro → Légende. Grimpe à chaque partie.' },
  { title: 'Badges à débloquer', desc: 'Tiki-Taka, Buzzer Beater... des dizaines de badges à collectionner.' },
  { title: 'Classements', desc: 'Hebdo qui se reset chaque lundi, et all-time pour les légendes.' },
];

const STATS = [
  { label: 'STREAK ACTUELLE', value: '12 JOURS', color: '#FE8D07' },
  { label: 'DIVISION', value: 'RÉGIONAL', color: '#FFC93C' },
  { label: 'BADGES', value: '7 / 24', color: '#01C187' },
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
  onPlay: () => void;
}

export function LandingView({ onPlay }: LandingViewProps) {
  const [sport, setSport] = useState<SportId>('foot');
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [subscribed, setSubscribed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
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
          <button type="button" className="qb-btn qb-btn--small" onClick={onPlay} onMouseMove={magnetMove} onMouseLeave={magnetLeave}>
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
            Football, basket, tennis. Des vraies questions, un chrono qui te met la pression, et un classement pour humilier tes potes.
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
                <div className="qb-ball__seam" />
                <div className="qb-ball__seam qb-ball__seam--h" />
                <div className="qb-ball__ring" />
              </div>
            </div>
          </div>

          <div className="qb-cta-row">
            <button type="button" className="qb-btn qb-btn--main" onClick={onPlay} onMouseMove={magnetMove} onMouseLeave={magnetLeave}>
              JOUER MAINTENANT
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
            <div key={m.title} className="qb-glass qb-mode">
              <div className="qb-mode__icon" />
              <div className="qb-mode__title">{m.title}</div>
              <div className="qb-text-muted">{m.desc}</div>
            </div>
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
          {STATS.map((st) => (
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
              <button type="button" className="qb-btn qb-plan__cta">
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="qb-section qb-newsletter">
        <div className="qb-newsletter__title">Reçois le quiz du jour</div>
        <div className="qb-text-muted qb-newsletter__lead">Une question par jour, dans ta boîte mail. Gratuit.</div>
        {subscribed ? (
          <div className="qb-newsletter__done">C'est fait — surveille ta boîte mail dès demain.</div>
        ) : (
          <form
            className="qb-newsletter__form"
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
          >
            <input className="qb-newsletter__input" type="email" required placeholder="ton@email.com" aria-label="Adresse email" />
            <button type="submit" className="qb-btn qb-newsletter__submit">
              RECEVOIR
            </button>
          </form>
        )}
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
              <button type="button" className="qb-link-btn" onClick={onPlay}>
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
          <button type="button" className="qb-sound" aria-pressed={soundOn} onClick={() => setSoundOn((on) => !on)}>
            {soundOn ? '♪ SON: ON' : '♪ SON: OFF'}
          </button>
        </div>
      </footer>
    </div>
  );
}
