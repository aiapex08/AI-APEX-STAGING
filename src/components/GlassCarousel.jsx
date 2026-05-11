import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Dimensions ───────────────────────────────────────────────────────────────
const CW   = 230;   // card width  (px)
const CH   = 390;   // card height (px)
const GAP  = 28;    // gap between cards
const STEP = CW + GAP;
const DRAG_THRESHOLD = 55;

const SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 0.9 };

// Per-distance visual: center is vivid, sides are grey + shrunk
function cardVisual(dist) {
  const abs = Math.abs(dist);
  if (abs === 0) return { scale: 1.00, opacity: 1.00, y: -8,  filter: 'none',                              zIndex: 20 };
  if (abs === 1) return { scale: 0.84, opacity: 0.75, y:  0,  filter: 'grayscale(0.72) brightness(0.42)', zIndex: 10 };
  return            { scale: 0.72, opacity: 0.45, y:  4,  filter: 'grayscale(0.90) brightness(0.28)', zIndex:  5 };
}

// ── Main carousel ─────────────────────────────────────────────────────────────
export default function GlassCarousel({ depts, palettes, onSelect }) {
  const [active,    setActive]    = useState(0);
  const [expanding, setExpanding] = useState(false);

  const dragStart = useRef(null);
  const didDrag   = useRef(false);
  const expandPal = palettes[active % palettes.length];

  const goTo = useCallback((idx) =>
    setActive(Math.max(0, Math.min(depts.length - 1, idx))),
  [depts.length]);

  const handleClick = useCallback((idx) => {
    if (didDrag.current) return;
    if (idx !== active) { goTo(idx); return; }
    setExpanding(true);
    setTimeout(() => onSelect(depts[idx]), 700);
  }, [active, depts, goTo, onSelect]);

  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
    didDrag.current   = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (dragStart.current === null) return;
    if (Math.abs(e.clientX - dragStart.current) > 10) didDrag.current = true;
  };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (didDrag.current) {
      if (delta < -DRAG_THRESHOLD) goTo(active + 1);
      else if (delta > DRAG_THRESHOLD) goTo(active - 1);
    }
    dragStart.current = null;
  };

  return (
    <div style={{ position: 'relative', userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* ── TRACK ── */}
      <div
        style={{ position: 'relative', height: CH + 60, overflow: 'visible', cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Zero anchor — cards position relative to this center point */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
          {depts.map((dept, idx) => {
            const dist = idx - active;
            const vis  = cardVisual(dist);
            const pal  = palettes[idx % palettes.length];
            return (
              <motion.div
                key={dept.id}
                style={{
                  position: 'absolute',
                  left: -CW / 2, top: -CH / 2,
                  width: CW, height: CH,
                  zIndex: vis.zIndex,
                  cursor: 'pointer',
                }}
                /* ── Entrance: slide in from left, staggered per card ── */
                initial={{ x: -900, opacity: 0, scale: 0.85 }}
                animate={{
                  x: dist * STEP,
                  scale:   vis.scale,
                  opacity: vis.opacity,
                  y:       vis.y,
                  filter:  vis.filter,
                }}
                transition={{
                  ...SPRING,
                  delay: idx * 0.08,   // stagger: 0ms, 80ms, 160ms, 240ms
                }}
                onClick={() => handleClick(idx)}
              >
                <GlassCard dept={dept} pal={pal} isActive={dist === 0} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── DOTS ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 6 }}>
        {depts.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{
              width:           i === active ? 28 : 7,
              opacity:         i === active ? 1  : 0.35,
              backgroundColor: i === active
                ? `rgb(${palettes[i % palettes.length].a})`
                : 'rgba(255,255,255,0.40)',
            }}
            transition={SPRING}
            style={{ height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
          />
        ))}
      </div>

      {/* ── TAP HINT ── */}
      <motion.div
        animate={{ opacity: expanding ? 0 : 1 }}
        style={{
          textAlign: 'center', marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontSize: '0.60rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: `rgba(${expandPal.a},0.80)`,
        }}
      >
        <PulsingDot color={expandPal.a} />
        {depts[active].label} — tap to enter
      </motion.div>

      {/* ── FULLSCREEN OVERLAY ── */}
      <AnimatePresence>
        {expanding && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, scale: 0.05, borderRadius: 28 }}
            animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
            transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: `radial-gradient(ellipse 120% 70% at 50% 10%,
                rgba(${expandPal.a},0.55) 0%,
                rgba(${expandPal.b},0.28) 35%,
                #010106 75%)`,
              backdropFilter: 'blur(32px)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Pulsing dot ───────────────────────────────────────────────────────────────
function PulsingDot({ color }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: `rgb(${color})`,
        boxShadow: `0 0 8px rgba(${color},0.90)`,
      }}
    />
  );
}

// ── Glass card ────────────────────────────────────────────────────────────────
function GlassCard({ dept, pal, isActive }) {
  const { a, b } = pal;
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes gc-halo  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gc-sweep {
          0%  {transform:translateX(-130%) skewX(-18deg);opacity:0}
          15% {opacity:0.80} 85%{opacity:0.80}
          100%{transform:translateX(330%) skewX(-18deg);opacity:0}
        }
        @keyframes gc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes gc-ringPulse {
          0%,100%{opacity:0.85;transform:scaleX(1)}
          50%{opacity:1;transform:scaleX(1.06)}
        }
      `}</style>

      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{
          boxShadow: isActive
            ? hovered
              ? `0 0 45px rgba(${a},0.80), 0 0 100px rgba(${a},0.30), 0 28px 65px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.14)`
              : `0 0 30px rgba(${a},0.62), 0 0 75px rgba(${a},0.22), 0 24px 58px rgba(0,0,0,0.82), inset 0 1px 0 rgba(255,255,255,0.10)`
            : `0 4px 18px rgba(0,0,0,0.55)`,
        }}
        transition={{ duration: 0.28 }}
        style={{
          width: '100%', height: '100%',
          borderRadius: 28,
          position: 'relative', overflow: 'hidden',

          background: isActive
            ? `radial-gradient(ellipse 110% 60% at 50% 12%,
                rgba(${a},0.85) 0%,
                rgba(${b},0.55) 28%,
                rgba(8,5,22,0.96) 58%,
                rgba(2,1,8,1) 100%)`
            : `radial-gradient(ellipse 110% 60% at 50% 12%,
                rgba(50,50,60,0.70) 0%,
                rgba(30,30,38,0.55) 30%,
                rgba(8,6,18,0.97) 62%,
                rgba(2,1,8,1) 100%)`,

          backdropFilter: 'blur(22px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(22px) saturate(1.8)',

          border: isActive
            ? `1.5px solid rgba(${a},0.65)`
            : '1.5px solid rgba(120,120,140,0.22)',

          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 16px 22px',
          cursor: 'pointer',
        }}
      >
        {/* Rotating halo — only on active */}
        {isActive && (
          <div style={{
            position: 'absolute', width: '220%', height: '220%', top: '-60%', left: '-60%',
            background: `conic-gradient(from 0deg at 50% 28%,
              transparent 0deg, rgba(${a},0.30) 40deg,
              rgba(${b},0.20) 80deg, transparent 140deg,
              transparent 210deg, rgba(${a},0.24) 308deg, transparent 360deg)`,
            animation: 'gc-halo 7s linear infinite',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
        )}

        {/* Top highlight edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
          background: isActive
            ? `linear-gradient(90deg, transparent, rgba(${a},1), rgba(${b},0.80), transparent)`
            : 'linear-gradient(90deg, transparent, rgba(180,180,200,0.35), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Bottom ring glow — only active */}
        {isActive && (
          <div style={{
            position: 'absolute', bottom: 0, left: '6%', right: '6%', height: '4px',
            background: `linear-gradient(90deg, transparent, rgba(${a},1), rgba(${b},0.85), rgba(${a},1), transparent)`,
            filter: 'blur(5px)',
            animation: 'gc-ringPulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Sweep light */}
        {isActive && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '42%', height: '100%',
            background: 'linear-gradient(108deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)',
            animation: 'gc-sweep 5.5s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Icon */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 56, height: 56, borderRadius: 18,
          background: isActive ? 'rgba(255,255,255,0.10)' : 'rgba(140,140,155,0.12)',
          border: isActive
            ? '1px solid rgba(255,255,255,0.20)'
            : '1px solid rgba(140,140,155,0.18)',
          boxShadow: isActive ? `0 0 24px rgba(${a},0.55)` : 'none',
          animation: isActive ? 'gc-float 3.2s ease-in-out infinite' : 'none',
        }}>
          {dept.icon(isActive ? '#fff' : 'rgba(180,180,195,0.80)')}
        </div>

        {/* Label + desc */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <div style={{
            fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 5,
            color: isActive ? '#ffffff' : 'rgba(160,160,175,0.75)',
            letterSpacing: '0.01em',
          }}>
            {dept.label}
          </div>
          <div style={{
            fontSize: '0.66rem', lineHeight: 1.45,
            color: isActive ? 'rgba(255,255,255,0.50)' : 'rgba(120,120,135,0.60)',
          }}>
            {dept.desc}
          </div>

          {/* Active pulse dot */}
          {isActive && (
            <div style={{
              marginTop: 12,
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: '0.56rem', letterSpacing: '0.16em',
              textTransform: 'uppercase', color: `rgba(${a},0.90)`,
            }}>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: `rgb(${a})`,
                  boxShadow: `0 0 7px rgba(${a},0.85)`,
                }}
              />
              Tap to enter
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
