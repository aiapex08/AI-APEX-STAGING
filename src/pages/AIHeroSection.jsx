import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const CW = 255;   // card width  px
const CH = 418;   // card height px

// Stack visual per distance from front (dist 0 = front card)
const STACK = [
  { x: 0,    y: 0,  rotY: 0,  rotZ: 0,   scale: 1.00, opacity: 1.00, brightness: 1.00, blur: 0, zIndex: 40 },
  { x: -65,  y: 20, rotY: 12, rotZ: -6,  scale: 0.88, opacity: 0.72, brightness: 0.52, blur: 1, zIndex: 30 },
  { x: -118, y: 38, rotY: 21, rotZ: -11, scale: 0.76, opacity: 0.48, brightness: 0.34, blur: 3, zIndex: 20 },
  { x: -158, y: 52, rotY: 28, rotZ: -15, scale: 0.65, opacity: 0.28, brightness: 0.20, blur: 5, zIndex: 10 },
];

const SPRING = { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 };

// ─── Card definitions ─────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'engineering',
    title: 'Engineering',
    subtitle: 'Design, Systems & Technical',
    tag: 'TECH · OPS',
    status: 'Operational',
    c1: '16,185,129', c2: '6,182,212',
    progress: 78,
    icon: (col) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
    ),
  },
  {
    id: 'contracts',
    title: 'Contracts',
    subtitle: 'Document & Legal Management',
    tag: 'LEGAL · DOC',
    status: 'Under Review',
    c1: '96,165,250', c2: '99,102,241',
    progress: 62,
    icon: (col) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M9 13h6M9 17h4"/>
      </svg>
    ),
  },
  {
    id: 'sales',
    title: 'Sales & Marketing',
    subtitle: 'Pipeline, CRM & Campaigns',
    tag: 'GROWTH · CRM',
    status: 'Active',
    c1: '245,158,11', c2: '249,115,22',
    progress: 89,
    icon: (col) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    id: 'estimation',
    title: 'Estimation',
    subtitle: 'Cost Analysis & Quotations',
    tag: 'ACTIVE · AI',
    status: 'Live',
    c1: '168,85,247', c2: '99,102,241',
    progress: 94,
    icon: (col) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="7" x2="16" y2="7"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
        <line x1="8" y1="15" x2="11" y2="15"/>
      </svg>
    ),
  },
];

// ─── Keyframe styles injected once ───────────────────────────────────────────
const CSS = `
  @keyframes hero-aurora {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes hero-orb1 {
    0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity: 0.55; }
    33%     { transform: translate(-50%,-50%) scale(1.18) rotate(120deg); opacity: 0.75; }
    66%     { transform: translate(-50%,-50%) scale(0.90) rotate(240deg); opacity: 0.60; }
  }
  @keyframes hero-orb2 {
    0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity: 0.40; }
    50%     { transform: translate(-50%,-50%) scale(1.22) rotate(180deg); opacity: 0.62; }
  }
  @keyframes hero-pulse {
    0%,100% { opacity: 0.6; transform: scale(1); }
    50%     { opacity: 1.0; transform: scale(1.05); }
  }
  @keyframes hero-ring {
    0%   { transform: translate(-50%,-50%) scale(0.95); opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(1.55); opacity: 0; }
  }
  @keyframes hero-scan {
    0%   { top: 0; opacity: 0; }
    8%   { opacity: 0.6; }
    92%  { opacity: 0.6; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes hero-sweep {
    0%   { transform: translateX(-160%) skewX(-18deg); opacity: 0; }
    12%  { opacity: 0.55; }
    88%  { opacity: 0.55; }
    100% { transform: translateX(340%) skewX(-18deg); opacity: 0; }
  }
  @keyframes hero-dot-blink {
    0%,100% { opacity: 1; box-shadow: 0 0 8px currentColor; }
    50%     { opacity: 0.3; box-shadow: 0 0 3px currentColor; }
  }
  @keyframes hero-grid-fade {
    0%,100% { opacity: 0.05; }
    50%     { opacity: 0.10; }
  }
  @keyframes hero-float-robot {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-14px); }
  }
  @keyframes hero-rotor {
    from { transform: translate(-50%,-50%) rotate(0deg); }
    to   { transform: translate(-50%,-50%) rotate(360deg); }
  }
  @keyframes hero-rotor-rev {
    from { transform: translate(-50%,-50%) rotate(0deg); }
    to   { transform: translate(-50%,-50%) rotate(-360deg); }
  }
  @keyframes hero-title-glow {
    0%,100% { filter: drop-shadow(0 0 18px rgba(168,85,247,0.7)); }
    50%     { filter: drop-shadow(0 0 32px rgba(99,102,241,0.9)); }
  }
  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Main Hero Section ────────────────────────────────────────────────────────
export default function AIHeroSection() {
  const [front, setFront] = useState(3); // Estimation starts as front card
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  // Mouse-tracking 3-D tilt for front card only
  const mX = useMotionValue(0.5);
  const mY = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(mY, [0, 1], [7, -7]),  { stiffness: 180, damping: 22 });
  const tiltY = useSpring(useTransform(mX, [0, 1], [-9, 9]),  { stiffness: 180, damping: 22 });

  const onCardMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mX.set((e.clientX - r.left) / r.width);
    mY.set((e.clientY - r.top)  / r.height);
  }, [mX, mY]);

  const onCardMouseLeave = useCallback(() => {
    mX.set(0.5);
    mY.set(0.5);
    setHovered(false);
  }, [mX, mY]);

  // Distance of card idx from front (circular)
  const dist = (idx) => ((front - idx) % CARDS.length + CARDS.length) % CARDS.length;

  const handleCardClick = (idx) => {
    if (idx !== front) setFront(idx);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#01010a',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: 'hidden',
      color: '#e2e8f0',
    }}>
      <style>{CSS}</style>

      {/* ── BACKGROUND LAYER ─────────────────────────────────────── */}
      <Background />

      {/* ── TOP-LEFT BRANDING ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 28, left: 40, zIndex: 50,
        animation: 'hero-fade-up 0.6s ease both',
      }}>
        <div style={{
          fontSize: 'clamp(0.72rem,0.9vw,0.88rem)', fontWeight: 600, letterSpacing: '0.30em',
          textTransform: 'uppercase',
          background: 'linear-gradient(105deg,#3730a3,#6d28d9,#a855f7,#ec4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundSize: '250% auto', animation: 'hero-aurora 6s ease infinite',
        }}>NAFFCO AI APEX</div>
        <div style={{ fontSize: '0.54rem', letterSpacing: '0.38em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>
          Passion to Protect
        </div>
      </div>

      {/* ── STATUS BAR (top right) ──────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 28, right: 40, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 16,
        animation: 'hero-fade-up 0.7s ease both',
      }}>
        <StatusChip label="SYSTEMS ONLINE" color="6,182,212" />
        <StatusChip label="AI ACTIVE" color="168,85,247" />
      </div>

      {/* ── MAIN LAYOUT ─────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', alignItems: 'center',
        zIndex: 10,
      }}>

        {/* ── LEFT PANEL ────────────────────────────────── */}
        <div style={{
          width: '58%', height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(48px, 8vw, 120px)',
          paddingRight: '2vw',
          position: 'relative',
        }}>

          {/* Hero text */}
          <div style={{ marginBottom: 48, animation: 'hero-fade-up 0.5s ease both' }}>
            <p style={{
              fontSize: '0.68rem', letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(168,85,247,0.80)', marginBottom: 14, fontWeight: 500,
            }}>
              — AI APEX DASHBOARD
            </p>
            <h1 style={{
              fontSize: 'clamp(2.4rem,4.5vw,4.2rem)',
              fontWeight: 300, letterSpacing: '0.06em',
              textTransform: 'uppercase', lineHeight: 1.08, marginBottom: 14,
              background: 'linear-gradient(120deg,#ffffff 0%,#e0e7ff 30%,#a5b4fc 55%,#c084fc 75%,#ffffff 100%)',
              backgroundSize: '250% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'hero-aurora 8s ease infinite, hero-title-glow 4s ease-in-out infinite',
            }}>
              AI APEX<br/>HUB
            </h1>
            <p style={{
              fontSize: '0.80rem', letterSpacing: '0.04em', lineHeight: 1.75,
              maxWidth: 280, fontWeight: 400,
              color: 'rgba(255,255,255,0.40)',
            }}>
              Select your department to access<br/>intelligent tools and AI workflows.
            </p>
          </div>

          {/* ── CARD STACK ──────────────────────────────── */}
          <div style={{
            position: 'relative',
            width: CW + 200,
            height: CH + 80,
            perspective: 1400,
          }}>
            {/* Floor ambient glow */}
            <FloorGlow card={CARDS[front]} />

            {/* Cards rendered back-to-front */}
            {[0, 1, 2, 3].map((idx) => {
              const d     = dist(idx);
              const s     = STACK[d];
              const card  = CARDS[idx];
              const isActive = d === 0;

              return (
                <motion.div
                  key={card.id}
                  style={{
                    position: 'absolute',
                    left: CW / 2 + 80,
                    top: CH / 2 + 20,
                    width: CW, height: CH,
                    marginLeft: -CW / 2,
                    marginTop:  -CH / 2,
                    zIndex: s.zIndex,
                    transformStyle: 'preserve-3d',
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                  animate={{
                    x:       s.x,
                    y:       s.y,
                    scale:   s.scale,
                    opacity: s.opacity,
                    rotateY: s.rotateY,
                    rotateZ: s.rotateZ,
                  }}
                  transition={SPRING}
                  onClick={() => handleCardClick(idx)}
                >
                  {/* Continuous float wrapper */}
                  <motion.div
                    animate={{ y: [0, -11, 0] }}
                    transition={{
                      duration: 3.5 + d * 0.55,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: d * 0.65,
                    }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Front card gets 3-D tilt + hover effects */}
                    {isActive ? (
                      <motion.div
                        ref={cardRef}
                        style={{
                          width: '100%', height: '100%',
                          rotateX: tiltX,
                          rotateY: tiltY,
                          transformStyle: 'preserve-3d',
                        }}
                        onMouseMove={onCardMouseMove}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={onCardMouseLeave}
                        animate={{ scale: hovered ? 1.025 : 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <GlassCard card={card} isActive dist={d} hovered={hovered} />
                      </motion.div>
                    ) : (
                      <GlassCard card={card} isActive={false} dist={d} hovered={false} />
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation dots */}
          <NavDots cards={CARDS} front={front} onDotClick={setFront} />
        </div>

        {/* ── RIGHT PANEL ───────────────────────────────── */}
        <RightPanel />
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────────── */}
      <BottomBar />
    </div>
  );
}

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ card, isActive, dist, hovered }) {
  const { c1, c2, title, subtitle, tag, status, progress, icon } = card;

  const glow = isActive
    ? hovered
      ? `0 0 70px rgba(${c1},0.95), 0 0 140px rgba(${c1},0.40), 0 36px 90px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.20)`
      : `0 0 45px rgba(${c1},0.80), 0 0 100px rgba(${c1},0.30), 0 32px 72px rgba(0,0,0,0.90), inset 0 1px 0 rgba(255,255,255,0.14)`
    : `0 8px 32px rgba(0,0,0,0.70)`;

  return (
    <>
      <style>{`
        @keyframes gc2-halo { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gc2-neon { 0%,100%{opacity:0.65;filter:blur(3px)} 50%{opacity:1;filter:blur(1.5px)} }
      `}</style>

      <motion.div
        animate={{ boxShadow: glow }}
        transition={{ duration: 0.35 }}
        style={{
          width: '100%', height: '100%',
          borderRadius: 28,
          position: 'relative', overflow: 'hidden',
          border: isActive
            ? `1.5px solid rgba(${c1},0.72)`
            : `1.5px solid rgba(${c1},0.18)`,
          background: isActive
            ? `radial-gradient(ellipse 155% 70% at 50% 0%,
                rgba(${c1},0.84) 0%,
                rgba(${c1},0.58) 18%,
                rgba(${c2},0.40) 36%,
                rgba(${c2},0.28) 52%,
                rgba(8,5,22,0.97) 68%)`
            : `radial-gradient(ellipse 130% 56% at 50% 0%,
                rgba(${c1},0.22) 0%,
                rgba(8,5,22,0.98) 60%)`,
          backdropFilter: 'blur(28px) saturate(1.9)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.9)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px 24px',
          filter: isActive ? 'none' : `brightness(${1 - dist * 0.12}) blur(${dist * 1.5}px)`,
        }}
      >
        {/* Top shimmer edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
          borderRadius: '28px 28px 0 0',
          background: isActive
            ? `linear-gradient(90deg, transparent, rgba(${c1},0.96), rgba(${c2},0.78), transparent)`
            : `linear-gradient(90deg, transparent, rgba(${c1},0.38), transparent)`,
          pointerEvents: 'none',
        }} />

        {/* Rotating halo (active only) */}
        {isActive && (
          <div style={{
            position: 'absolute', width: '230%', height: '230%', top: '-65%', left: '-65%',
            background: `conic-gradient(from 0deg at 50% 26%,
              transparent 0deg, rgba(${c1},0.26) 42deg,
              rgba(${c2},0.18) 82deg, transparent 138deg,
              transparent 222deg, rgba(${c1},0.20) 308deg, transparent 360deg)`,
            animation: 'gc2-halo 11s linear infinite',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
        )}

        {/* Badge pill — centered */}
        <div style={{
          position: 'relative', zIndex: 1, flexShrink: 0,
          fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 600,
          color: isActive ? `rgba(${c1},0.90)` : `rgba(${c1},0.50)`,
          background: isActive ? `rgba(${c1},0.12)` : `rgba(${c1},0.06)`,
          border: `1px solid rgba(${c1},${isActive ? '0.28' : '0.12'})`,
          borderRadius: 20, padding: '4px 12px', marginBottom: 20,
        }}>
          {tag}
        </div>

        {/* Icon box — centered, clean */}
        <div style={{
          position: 'relative', zIndex: 1, flexShrink: 0,
          width: 58, height: 58, borderRadius: 18,
          background: isActive ? `rgba(${c1},0.15)` : `rgba(${c1},0.08)`,
          border: `1px solid rgba(${c1},${isActive ? '0.35' : '0.16'})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
          boxShadow: isActive
            ? `0 0 28px rgba(${c1},0.55), inset 0 1px 0 rgba(255,255,255,0.15)`
            : 'none',
        }}>
          {icon(isActive ? '#fff' : `rgba(${c1},0.60)`)}
        </div>

        {/* Status label — small dot + text */}
        <div style={{
          position: 'relative', zIndex: 1, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: '0.60rem', letterSpacing: '0.10em', fontWeight: 500,
          color: isActive ? `rgba(${c1},0.88)` : 'rgba(255,255,255,0.30)',
          marginBottom: 10,
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: isActive ? `rgb(${c1})` : 'rgba(255,255,255,0.24)',
            boxShadow: isActive ? `0 0 7px rgba(${c1},0.80)` : 'none',
            animation: isActive ? 'hero-dot-blink 2.2s ease-in-out infinite' : 'none',
          }} />
          {status}
        </div>

        {/* Department title — large, bold, centered (main message slot) */}
        <div style={{
          position: 'relative', zIndex: 1,
          fontSize: isActive ? '1.05rem' : '0.88rem',
          fontWeight: isActive ? 700 : 500,
          lineHeight: 1.35, letterSpacing: '0.01em',
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.46)',
          textAlign: 'center', flexGrow: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textShadow: isActive ? '0 1px 14px rgba(0,0,0,0.55)' : 'none',
        }}>
          {title}
        </div>

        {/* Subtitle */}
        <div style={{
          position: 'relative', zIndex: 1, flexShrink: 0,
          fontSize: '0.60rem', lineHeight: 1.5, letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: isActive ? 'rgba(255,255,255,0.58)' : 'rgba(255,255,255,0.22)',
          textAlign: 'center', marginTop: 7,
        }}>
          {subtitle}
        </div>

        {/* Divider */}
        <div style={{
          position: 'relative', zIndex: 1, flexShrink: 0,
          width: '100%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${c1},${isActive ? 0.42 : 0.12}), transparent)`,
          margin: '16px 0 14px',
        }} />

        {/* Progress bar */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{
              fontSize: '0.46rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: isActive ? `rgba(${c1},0.75)` : 'rgba(255,255,255,0.26)',
            }}>System Load</span>
            <span style={{
              fontSize: '0.48rem', fontWeight: 700,
              color: isActive ? `rgba(${c1},0.95)` : 'rgba(255,255,255,0.34)',
            }}>{progress}%</span>
          </div>
          <div style={{ height: 3, borderRadius: 99, background: `rgba(${c1},${isActive ? 0.14 : 0.07})`, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, rgba(${c1},0.80), rgba(${c2},1))`,
                boxShadow: isActive ? `0 0 8px rgba(${c1},0.60)` : 'none',
              }}
            />
          </div>
        </div>

        {/* Bottom glow ring (active only) */}
        {isActive && (
          <div style={{
            position: 'absolute', bottom: 0, left: '7%', right: '7%', height: 3,
            background: `linear-gradient(90deg, transparent, rgba(${c1},1), rgba(${c2},0.88), rgba(${c1},1), transparent)`,
            filter: 'blur(4px)',
            animation: 'gc2-neon 2.8s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </motion.div>
    </>
  );
}

// ─── Floor Glow ───────────────────────────────────────────────────────────────
function FloorGlow({ card }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: -15, left: '50%', transform: 'translateX(-50%)',
      width: CW * 2.2, height: 80,
      background: `radial-gradient(ellipse 85% 100% at 50% 100%,
        rgba(${card.c1},0.60) 0%,
        rgba(${card.c2},0.30) 40%,
        transparent 72%)`,
      filter: 'blur(28px)',
      pointerEvents: 'none', zIndex: 0,
      animation: 'hero-pulse 3.5s ease-in-out infinite',
    }} />
  );
}

// ─── Nav Dots ─────────────────────────────────────────────────────────────────
function NavDots({ cards, front, onDotClick }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginTop: 16,
      paddingLeft: CW / 2 + 80,
    }}>
      {cards.map((card, i) => {
        const isActive = i === front;
        return (
          <motion.button
            key={card.id}
            onClick={() => onDotClick(i)}
            animate={{
              width: isActive ? 28 : 7,
              backgroundColor: isActive ? `rgb(${card.c1})` : 'rgba(255,255,255,0.28)',
              opacity: isActive ? 1 : 0.45,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
              boxShadow: isActive ? `0 0 10px rgba(${card.c1},0.80)` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Right Panel ─────────────────────────────────────────────────────────────
function RightPanel() {
  return (
    <div style={{
      width: '42%', height: '100%',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Aurora blobs */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: '90%', height: '90%',
        background: 'conic-gradient(from 200deg at 52% 48%, #0a0030,#1a0050 8%,#3b0082 16%,#6d28d9 24%,#a855f7 32%,#ec4899 40%,#06b6d4 50%,#3b82f6 58%,#6d28d9 66%,#1a0050 80%,#0a0030)',
        filter: 'blur(65px)', opacity: 0.52,
        animation: 'hero-orb1 12s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '30%', left: '40%', width: '75%', height: '65%',
        background: 'radial-gradient(ellipse at center, rgba(109,40,217,0.45) 0%, rgba(6,182,212,0.22) 40%, transparent 68%)',
        filter: 'blur(42px)', opacity: 0.70,
        animation: 'hero-orb2 8s ease-in-out infinite',
        mixBlendMode: 'screen',
      }} />

      {/* Holographic rings */}
      <HoloRings />

      {/* Floor reflection */}
      <div style={{
        position: 'absolute', bottom: 0, left: '-8%', right: '-8%', height: '30%', zIndex: 2,
        background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(99,102,241,0.55) 0%, rgba(6,182,212,0.32) 35%, rgba(168,85,247,0.18) 55%, transparent 72%)',
        filter: 'blur(32px)', animation: 'hero-pulse 4.8s ease-in-out infinite',
        mixBlendMode: 'screen',
      }} />

      {/* Cyan rim light */}
      <div style={{
        position: 'absolute', top: '10%', right: 0, bottom: '10%', width: '22%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.28) 35%, rgba(6,182,212,0.18) 65%, transparent 100%)',
        filter: 'blur(28px)', mixBlendMode: 'screen',
        animation: 'hero-pulse 5s ease-in-out infinite 1.5s',
      }} />

      {/* Holographic scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2, zIndex: 3,
        background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.55) 30%, rgba(99,102,241,0.70) 50%, rgba(6,182,212,0.55) 70%, transparent 100%)',
        animation: 'hero-scan 7s linear infinite',
        mixBlendMode: 'screen', opacity: 0.5,
      }} />

      {/* Robot image */}
      <img
        src="/AIBOT.png"
        alt="AI Bot"
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
          pointerEvents: 'none',
          animation: 'hero-float-robot 5s ease-in-out infinite',
        }}
      />
    </div>
  );
}

// ─── Holographic rings around orb ─────────────────────────────────────────────
function HoloRings() {
  const rings = [
    { r: 180, dur: '14s', color: 'rgba(99,102,241,0.22)',  border: 2 },
    { r: 240, dur: '20s', color: 'rgba(6,182,212,0.16)',   border: 1, rev: true },
    { r: 300, dur: '28s', color: 'rgba(168,85,247,0.12)',  border: 1 },
  ];
  return (
    <div style={{ position: 'absolute', top: '42%', left: '50%', zIndex: 1, pointerEvents: 'none' }}>
      {rings.map((ring, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: ring.r * 2, height: ring.r * 2,
          borderRadius: '50%',
          border: `${ring.border}px solid ${ring.color}`,
          animation: `${ring.rev ? 'hero-rotor-rev' : 'hero-rotor'} ${ring.dur} linear infinite`,
          boxShadow: `0 0 12px ${ring.color}`,
        }}>
          {/* Accent dot on ring */}
          <div style={{
            position: 'absolute', top: -3, left: '50%', marginLeft: -3,
            width: 6, height: 6, borderRadius: '50%',
            background: ring.color.replace('0.', '0.9').replace('rgba', 'rgb').replace(/,[^,]*\)/, ')'),
            boxShadow: `0 0 10px ${ring.color}`,
          }} />
        </div>
      ))}
    </div>
  );
}

// ─── Background ───────────────────────────────────────────────────────────────
function Background() {
  return (
    <>
      {/* Purple aurora blob */}
      <div style={{
        position: 'fixed', top: '30%', left: '20%', zIndex: 0, pointerEvents: 'none',
        width: 600, height: 600,
        background: 'radial-gradient(ellipse at center, rgba(109,40,217,0.18) 0%, transparent 68%)',
        filter: 'blur(50px)',
        animation: 'hero-orb1 15s ease-in-out infinite',
        transform: 'translate(-50%,-50%)',
      }} />

      {/* Cyan aurora blob */}
      <div style={{
        position: 'fixed', top: '65%', left: '35%', zIndex: 0, pointerEvents: 'none',
        width: 450, height: 380,
        background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, transparent 68%)',
        filter: 'blur(45px)',
        animation: 'hero-orb2 10s ease-in-out infinite 2s',
        transform: 'translate(-50%,-50%)',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.055) 1px, transparent 1px)`,
        backgroundSize: '68px 68px',
        animation: 'hero-grid-fade 8s ease-in-out infinite',
        maskImage: 'radial-gradient(ellipse 75% 85% at 28% 52%, black 0%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 85% at 28% 52%, black 0%, transparent 80%)',
      }} />
    </>
  );
}

// ─── Status Chip ─────────────────────────────────────────────────────────────
function StatusChip({ label, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 100,
      background: `rgba(${color},0.08)`,
      border: `1px solid rgba(${color},0.28)`,
    }}>
      <div style={{
        width: 5, height: 5, borderRadius: '50%',
        background: `rgb(${color})`, boxShadow: `0 0 7px rgba(${color},0.90)`,
        animation: 'hero-dot-blink 2.2s ease-in-out infinite',
        color: `rgb(${color})`,
      }} />
      <span style={{
        fontSize: '0.48rem', letterSpacing: '0.22em', fontWeight: 600,
        textTransform: 'uppercase', color: `rgba(${color},0.85)`,
      }}>{label}</span>
    </div>
  );
}

// ─── Bottom Bar ───────────────────────────────────────────────────────────────
function BottomBar() {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 40, right: 40, zIndex: 50,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <img src="/logo.png" alt="NAFFCO" style={{
        height: 30, width: 'auto', objectFit: 'contain',
        opacity: 0.50,
        filter: 'drop-shadow(0 1px 8px rgba(109,40,217,0.35))',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#00cfff', boxShadow: '0 0 8px #00cfff',
        }} />
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,207,255,0.75)' }}>
          AR Viewer
        </span>
      </div>
    </div>
  );
}
