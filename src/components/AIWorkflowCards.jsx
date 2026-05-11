import React from 'react';

// ── CSS Keyframes ─────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes orbGlow {
    0%,100% {
      box-shadow: 0 0 20px 5px rgba(139,92,246,.82),
                  0 0 44px 12px rgba(59,130,246,.52),
                  0 0 68px 20px rgba(236,72,153,.34);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 34px 10px rgba(139,92,246,1),
                  0 0 68px 22px rgba(59,130,246,.72),
                  0 0 100px 32px rgba(236,72,153,.55);
      transform: scale(1.11);
    }
  }
  @keyframes orbBlue {
    0%,100% { box-shadow: 0 0 10px 3px rgba(59,130,246,.38); transform: scale(1); }
    50%     { box-shadow: 0 0 22px 7px rgba(59,130,246,.62); transform: scale(1.05); }
  }
  @keyframes orbGreen {
    0%,100% { box-shadow: 0 0 8px 2px rgba(16,185,129,.32); transform: scale(1); }
    50%     { box-shadow: 0 0 20px 7px rgba(16,185,129,.56); transform: scale(1.05); }
  }
  @keyframes orbDim {
    0%,100% { opacity: .44; }
    50%     { opacity: .60; }
  }
  @keyframes waveBar {
    0%,100% { transform: scaleY(.28); }
    50%     { transform: scaleY(1.00); }
  }
  @keyframes checkBounce {
    0%   { transform: scale(.50); opacity: 0; }
    65%  { transform: scale(1.20); opacity: 1; }
    100% { transform: scale(1.00); }
  }
  @keyframes haloSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ringPulse {
    0%,100% { opacity:.80; transform: scaleX(1); }
    50%     { opacity:1;   transform: scaleX(1.06); }
  }
`;

// ── SVG Icons — swap with your design-system icons as needed ──────────────────

// Sales & Marketing — trending chart with upward arrow
function SalesIcon({ color = '#fff', s = 26 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

// Estimation — document with magnifier (search/calculate)
function EstimationIcon({ color = '#fff', s = 26 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8"  y1="7"  x2="16" y2="7" />
      <line x1="8"  y1="11" x2="16" y2="11" />
      <line x1="8"  y1="15" x2="12" y2="15" />
      <circle cx="16.5" cy="16.5" r="2.8" />
      <line x1="18.5" y1="18.5" x2="21" y2="21" />
    </svg>
  );
}

// Contract — document with signature line
function ContractIcon({ color = '#fff', s = 26 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8"  y1="12" x2="16" y2="12" />
      <line x1="8"  y1="16" x2="13" y2="16" />
      <path d="M8 9.5c.9-1.3 2.6-.8 2.6.7 0 1.4-2.2 1.6-2.2 3 0 1.3 1.7 1.5 2.6.4" />
    </svg>
  );
}

// Engineering — cog / gear
function EngineeringIcon({ color = '#fff', s = 26 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
               a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
               A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
               l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
               A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
               l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
               a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
               l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
               a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// Checkmark
function CheckIcon({ color = '#10B981', s = 22 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Wave bars (inside voice orb) ──────────────────────────────────────────────
function WaveBars({ color = 'rgba(255,255,255,0.88)', h = 12, speed = '1.4s' }) {
  const delays = [0, 0.14, 0.28, 0.14, 0];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
      {delays.map((d, i) => (
        <div key={i} style={{
          width: 2.6, height: h, borderRadius: 2,
          background: color,
          transformOrigin: 'center',
          animation: `waveBar ${speed} ease-in-out ${d}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Voice Orb ─────────────────────────────────────────────────────────────────
function VoiceOrb({ variant }) {
  if (variant === 'active') return (
    <div style={{
      width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 36% 30%, #c4b5fd, #8B5CF6 32%, #3B82F6 62%, #EC4899 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'orbGlow 2s ease-in-out infinite',
    }}>
      <WaveBars color="rgba(255,255,255,0.95)" h={15} speed="1.15s" />
    </div>
  );

  if (variant === 'subtle') return (
    <div style={{
      width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 36% 30%, rgba(99,102,241,.88), rgba(22,26,90,.96))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'orbBlue 2.8s ease-in-out infinite',
    }}>
      <WaveBars color="rgba(255,255,255,0.65)" h={10} speed="1.7s" />
    </div>
  );

  if (variant === 'ready') return (
    <div style={{
      width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 36% 30%, rgba(52,211,153,.88), rgba(4,44,32,.96))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'orbGreen 3s ease-in-out infinite',
    }}>
      <WaveBars color="rgba(255,255,255,0.65)" h={10} speed="2.1s" />
    </div>
  );

  // dim (Sales — inactive)
  return (
    <div style={{
      width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 36% 30%, rgba(110,110,155,.55), rgba(18,18,32,.92))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'orbDim 3.8s ease-in-out infinite',
    }}>
      <WaveBars color="rgba(255,255,255,0.35)" h={8} speed="3.2s" />
    </div>
  );
}

// ── Card data ─────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'sales',
    variant: 'inactive',
    orbVariant: 'dim',
    badge: 'Sales & Marketing',
    label: 'Good Morning, Monica…',
    message: "Would you like to review today's sales pipeline?",
    Icon: SalesIcon,
    a: '99,102,241',
    bg: `radial-gradient(ellipse 130% 56% at 50% 0%,
          rgba(48,40,105,.48) 0%,
          rgba(10,10,20,.98) 58%)`,
    border: 'rgba(99,102,241,.14)',
    shadow: 'none',
    wrap: { transform: 'scale(0.85)', opacity: 0.42, filter: 'blur(2.8px)', zIndex: 1, marginRight: '-40px' },
    showCheck: false,
  },
  {
    id: 'estimation',
    variant: 'semi',
    orbVariant: 'subtle',
    badge: 'Estimation',
    label: 'Estimation Assistant',
    message: 'Would you like to generate a project estimate?',
    Icon: EstimationIcon,
    a: '59,130,246',
    bg: `radial-gradient(ellipse 145% 62% at 50% 0%,
          rgba(22,52,125,.65) 0%,
          rgba(10,10,22,.97) 56%)`,
    border: 'rgba(59,130,246,.30)',
    shadow: '0 0 55px rgba(59,130,246,.12)',
    wrap: { transform: 'scale(0.92)', opacity: 0.72, zIndex: 3, marginRight: '-22px' },
    showCheck: false,
  },
  {
    id: 'contract',
    variant: 'active',
    orbVariant: 'active',
    badge: 'Contract',
    label: 'Contract Ready',
    message: 'Done! Your contract draft is ready to review.',
    Icon: ContractIcon,
    a: '139,92,246',
    bg: `radial-gradient(ellipse 155% 70% at 50% 0%,
          rgba(139,92,246,.84) 0%,
          rgba(100,98,238,.58) 18%,
          rgba(59,130,246,.40) 36%,
          rgba(236,72,153,.28) 52%,
          rgba(8,5,22,.97) 68%)`,
    border: 'rgba(139,92,246,.72)',
    shadow: '0 0 90px rgba(139,92,246,.38), 0 0 160px rgba(59,130,246,.20)',
    wrap: { transform: 'scale(1.00)', opacity: 1, zIndex: 10 },
    showCheck: true,
  },
  {
    id: 'engineering',
    variant: 'preview',
    orbVariant: 'ready',
    badge: 'Engineering',
    label: 'Engineering Queue',
    message: 'Ready to assign to the engineering team?',
    Icon: EngineeringIcon,
    a: '16,185,129',
    bg: `radial-gradient(ellipse 130% 56% at 50% 0%,
          rgba(8,74,54,.58) 0%,
          rgba(8,10,20,.97) 56%)`,
    border: 'rgba(16,185,129,.28)',
    shadow: '0 0 55px rgba(16,185,129,.12)',
    wrap: { transform: 'scale(0.92)', opacity: 0.76, zIndex: 3, marginLeft: '-22px' },
    showCheck: false,
  },
];

// ── Single Card ───────────────────────────────────────────────────────────────
function WorkflowCard({ data }) {
  const { badge, label, message, Icon, a, bg, border, shadow, wrap, showCheck, orbVariant, variant } = data;
  const isActive = variant === 'active';

  return (
    <div style={{ ...wrap, flexShrink: 0 }}>
      <div style={{
        position: 'relative',
        width: 282,
        minHeight: 465,
        borderRadius: 28,
        background: bg,
        border: `1.5px solid ${border}`,
        backdropFilter: 'blur(28px) saturate(1.75)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.75)',
        boxShadow: isActive
          ? `${shadow}, 0 36px 90px rgba(0,0,0,0.90), inset 0 1px 0 rgba(255,255,255,0.13)`
          : shadow !== 'none'
            ? `${shadow}, 0 14px 44px rgba(0,0,0,0.68), inset 0 1px 0 rgba(255,255,255,0.04)`
            : `0 14px 44px rgba(0,0,0,0.68), inset 0 1px 0 rgba(255,255,255,0.04)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '30px 20px 26px',
        overflow: 'hidden', cursor: 'pointer',
      }}>

        {/* Top shimmer edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
          borderRadius: '28px 28px 0 0',
          background: isActive
            ? `linear-gradient(90deg, transparent, rgba(${a},.96), rgba(236,72,153,.78), transparent)`
            : `linear-gradient(90deg, transparent, rgba(${a},.42), transparent)`,
          pointerEvents: 'none',
        }} />

        {/* Rotating halo — active card only */}
        {isActive && (
          <div style={{
            position: 'absolute',
            width: '230%', height: '230%', top: '-65%', left: '-65%',
            background: `conic-gradient(from 0deg at 50% 26%,
              transparent 0deg, rgba(139,92,246,.26) 42deg,
              rgba(59,130,246,.18) 82deg, transparent 138deg,
              transparent 222deg, rgba(236,72,153,.20) 308deg, transparent 360deg)`,
            animation: 'haloSpin 9s linear infinite',
            borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          }} />
        )}

        {/* Badge pill */}
        <div style={{
          position: 'relative', zIndex: 1,
          fontSize: '0.60rem', letterSpacing: '0.17em', textTransform: 'uppercase',
          color: `rgba(${a},.85)`, fontWeight: 600,
          background: `rgba(${a},.10)`,
          border: `1px solid rgba(${a},.22)`,
          borderRadius: 20, padding: '3px 11px',
          marginBottom: 18, flexShrink: 0,
        }}>
          {badge}
        </div>

        {/* Checkmark button (active) or Icon box */}
        {showCheck ? (
          <div style={{
            position: 'relative', zIndex: 1,
            width: 55, height: 55, borderRadius: 18,
            background: 'rgba(255,255,255,.10)',
            border: '1.5px solid rgba(255,255,255,.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18, flexShrink: 0,
            boxShadow: '0 0 22px rgba(16,185,129,.35)',
            animation: 'checkBounce .55s cubic-bezier(0.34,1.56,0.64,1) both',
          }}>
            <CheckIcon s={22} color="#10B981" />
          </div>
        ) : (
          <div style={{
            position: 'relative', zIndex: 1,
            width: 55, height: 55, borderRadius: 18,
            background: `rgba(${a},.12)`,
            border: `1px solid rgba(${a},.26)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18, flexShrink: 0,
            boxShadow: isActive ? `0 0 26px rgba(${a},.48)` : 'none',
          }}>
            <Icon color={isActive ? '#fff' : `rgba(${a},.78)`} s={26} />
          </div>
        )}

        {/* Sub-label */}
        <div style={{
          position: 'relative', zIndex: 1,
          fontSize: '0.67rem', letterSpacing: '0.08em',
          color: isActive ? `rgba(${a},.90)` : 'rgba(255,255,255,.34)',
          marginBottom: 10, textAlign: 'center', fontWeight: 500, flexShrink: 0,
        }}>
          {label}
        </div>

        {/* Main message */}
        <div style={{
          position: 'relative', zIndex: 1,
          fontSize: isActive ? '1.07rem' : '0.88rem',
          fontWeight: isActive ? 700 : 500,
          lineHeight: 1.50,
          color: isActive ? '#ffffff' : 'rgba(255,255,255,.54)',
          textAlign: 'center', flexGrow: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 6px',
        }}>
          {message}
        </div>

        {/* Divider */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${a},${isActive ? '.40' : '.13'}), transparent)`,
          margin: '18px 0 16px', flexShrink: 0,
        }} />

        {/* Voice Orb */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <VoiceOrb variant={orbVariant} />
        </div>

        {/* Bottom glow ring — active card only */}
        {isActive && (
          <div style={{
            position: 'absolute', bottom: 0, left: '7%', right: '7%', height: 3,
            background: `linear-gradient(90deg, transparent, rgba(${a},1), rgba(236,72,153,.88), rgba(${a},1), transparent)`,
            filter: 'blur(4px)',
            animation: 'ringPulse 2.6s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────────
export default function AIWorkflowCards() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse 85% 48% at 50% -5%,
          rgba(60,28,105,.24) 0%, #0a0a14 55%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px',
        fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
      }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: 52, maxWidth: 580 }}>
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase',
            color: 'rgba(139,92,246,.74)', marginBottom: 14, fontWeight: 500,
          }}>
            AI Workflow Sequence
          </div>
          <h2 style={{
            margin: 0, fontWeight: 700, lineHeight: 1.18,
            fontSize: 'clamp(1.7rem,3vw,2.5rem)', letterSpacing: '-0.01em', color: '#fff',
          }}>
            Voice Commands Act as an Integral<br />
            <span style={{
              background: 'linear-gradient(105deg,#8B5CF6,#3B82F6,#EC4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Part of Every Workflow
            </span>
          </h2>
          <p style={{
            marginTop: 10, fontSize: '0.82rem',
            color: 'rgba(255,255,255,.36)', letterSpacing: '0.04em',
          }}>
            simplified AI voice control
          </p>
        </div>

        {/* ── Cards row ── */}
        <div style={{
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', padding: '20px 48px',
        }}>
          {CARDS.map(card => <WorkflowCard key={card.id} data={card} />)}
        </div>

        {/* ── Step indicator dots ── */}
        <div style={{ display: 'flex', gap: 8, marginTop: 40, alignItems: 'center' }}>
          {CARDS.map(card => (
            <div key={card.id} style={{
              height: 5, borderRadius: 3,
              width: card.variant === 'active' ? 28 : 8,
              background: card.variant === 'active'
                ? `rgba(${card.a},1)`
                : `rgba(${card.a},.24)`,
              transition: 'width .3s ease',
            }} />
          ))}
        </div>

      </div>
    </>
  );
}
