import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion';
import { getAllowedCardIds } from '../utils/authEmployees.js';

/* ─────────────────────────────────────────────
   VIEWPORT HOOK  (w + h)
───────────────────────────────────────────── */
function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth  : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));
  useEffect(() => {
    const fn = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return vp;
}

/* ─────────────────────────────────────────────
   SCALE — card dimensions from viewport width
───────────────────────────────────────────── */
function getScale(w) {
  if (w < 480)  return { cardW:158, cardH:88,  iconWrap:34, iconSvg:16, fontSize:'0.56rem', gap:5, pad:'8px 10px',     br:11, colGap:7,  titleSize:'clamp(1rem,5vw,1.4rem)',    subSize:'0.42rem', subGap:6,  lineW:20, brandSize:'0.58rem', brandSub:'0.36rem', brandTop:12, brandLeft:10, backTop:12, backRight:10, backPad:'5px 10px', backFont:'0.58rem', logoH:16 };
  if (w < 768)  return { cardW:186, cardH:105, iconWrap:42, iconSvg:20, fontSize:'0.65rem', gap:6, pad:'10px 12px',    br:13, colGap:8,  titleSize:'clamp(1.2rem,4vw,1.7rem)',  subSize:'0.46rem', subGap:7,  lineW:24, brandSize:'0.65rem', brandSub:'0.40rem', brandTop:14, brandLeft:12, backTop:14, backRight:12, backPad:'5px 12px', backFont:'0.62rem', logoH:18 };
  if (w < 1024) return { cardW:212, cardH:120, iconWrap:50, iconSvg:24, fontSize:'0.72rem', gap:7, pad:'12px 14px',    br:14, colGap:10, titleSize:'clamp(1.4rem,3vw,2rem)',    subSize:'0.48rem', subGap:8,  lineW:28, brandSize:'0.70rem', brandSub:'0.42rem', brandTop:16, brandLeft:16, backTop:16, backRight:16, backPad:'6px 13px', backFont:'0.66rem', logoH:20 };
  if (w < 1440) return { cardW:238, cardH:136, iconWrap:58, iconSvg:28, fontSize:'0.78rem', gap:8, pad:'14px 16px',    br:15, colGap:12, titleSize:'clamp(1.6rem,2.4vw,2.2rem)',subSize:'0.50rem', subGap:9,  lineW:32, brandSize:'0.74rem', brandSub:'0.44rem', brandTop:18, brandLeft:20, backTop:18, backRight:18, backPad:'6px 14px', backFont:'0.68rem', logoH:22 };
  return         { cardW:262, cardH:150, iconWrap:64, iconSvg:32, fontSize:'0.82rem', gap:9, pad:'16px 18px 14px', br:16, colGap:14, titleSize:'clamp(1.6rem,2.6vw,2.4rem)',subSize:'0.52rem', subGap:10, lineW:36, brandSize:'0.76rem', brandSub:'0.46rem', brandTop:20, brandLeft:22, backTop:20, backRight:22, backPad:'7px 15px', backFont:'0.70rem', logoH:24 };
}

/* ─────────────────────────────────────────────
   SUB-BUTTON POSITIONS  (arc around active card)
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   SLOT POSITIONS
   Slots 0–3 = left col, Slots 4–7 = right col
───────────────────────────────────────────── */
function getSlotPos(slotIdx, sc, vp) {
  const isRight = slotIdx >= 3;           // slots 0-2 = left (3 cards), 3-6 = right (4 cards)
  const row     = isRight ? slotIdx - 3 : slotIdx;
  const margin  = Math.max(10, Math.round(vp.w * 0.018));
  const numRows = isRight ? 4 : 3;
  const totalH  = numRows * sc.cardH + (numRows - 1) * sc.colGap;
  const startY  = Math.round((vp.h - totalH) * 0.44);
  return {
    x: isRight ? vp.w - margin - sc.cardW : margin,
    y: startY + row * (sc.cardH + sc.colGap),
  };
}

/* ─────────────────────────────────────────────
   OPTION DATA  (all 8 together)
───────────────────────────────────────────── */
const ALL_OPTIONS = [
  {
    id: 'quotations', label: 'Quotations',
    color: '#7c3aed', route: 'estimation',
    subOptions: [
      { key:'',             label:'Overall',      c:'rgba(180,130,255,0.95)', bg:'rgba(140,80,255,0.14)',  bd:'rgba(180,130,255,0.35)' },
      { key:'new',          label:'New',          c:'rgba(100,200,255,0.95)', bg:'rgba(30,140,255,0.12)',  bd:'rgba(60,180,255,0.35)'  },
      { key:'revise',       label:'Revise',       c:'rgba(0,220,255,0.95)',   bg:'rgba(0,180,255,0.10)',   bd:'rgba(0,200,255,0.35)'   },
      { key:'discount',     label:'Discount',     c:'rgba(251,191,36,0.95)',  bg:'rgba(180,120,0,0.12)',   bd:'rgba(251,191,36,0.35)'  },
      { key:'final',        label:'Final',        c:'rgba(52,211,153,0.95)',  bg:'rgba(0,180,100,0.10)',   bd:'rgba(0,200,120,0.35)'   },
      { key:'out-of-scope', label:'Out of Scope', c:'rgba(255,90,90,0.95)',   bg:'rgba(200,40,40,0.10)',   bd:'rgba(220,60,60,0.35)'   },
    ],
    /* Quotations — document with animated writing line */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="12" x2="16" y2="12" strokeOpacity="0.55"/>
        <line x1="8" y1="16" x2="14" y2="16" strokeOpacity="0.35"/>
        <line x1="8" y1="20" x2="16" y2="20"
          strokeDasharray="14 14"
          style={{animation:'eh-typewrite 5s ease-in-out infinite'}}/>
      </svg>
    ),
  },
  {
    id: 'team', label: 'Team',
    color: '#34d399', route: 'team',
    subOptions: [
      { key:'kpi',      label:'KPI'       },
      { key:'orgchart', label:'Org Chart' },
    ],
    /* Team — two people with pulsing connection node */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="7" r="4"/>
        <path d="M2 21v-1a6 6 0 016-6h1"/>
        <circle cx="17" cy="7" r="3"/>
        <path d="M13 17a5 5 0 018 0v1"/>
        <line x1="9" y1="17" x2="11.5" y2="19" strokeOpacity="0.4"/>
        <line x1="15" y1="17" x2="12.5" y2="19" strokeOpacity="0.4"/>
        <circle cx="12" cy="20" r="2" fill={c} stroke="none"
          style={{animation:'eh-pulse-dot 4.5s ease-in-out infinite', transformOrigin:'12px 20px'}}/>
      </svg>
    ),
  },
  {
    id: 'customers', label: 'Customers',
    color: '#ec4899', route: 'customers',
    subOptions: [
      { key:'contractor', label:'Contractor' },
      { key:'consultant', label:'Consultant' },
      { key:'client',     label:'Client'     },
    ],
    /* Customers — person with rising metric arrow */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="7" r="4"/>
        <path d="M2 21v-1a7 7 0 0114 0v1"/>
        <g style={{animation:'eh-rise 4s ease-in-out infinite'}}>
          <line x1="20" y1="14" x2="20" y2="6"/>
          <polyline points="17 9 20 6 23 9"/>
        </g>
      </svg>
    ),
  },
  {
    id: 'ai-data', label: 'AI\nAnalysis',
    color: '#00e5ff', route: 'aiAnalysis',
    subOptions: [
      { key:'overview',     label:'Overview'     },
      { key:'trends',       label:'Trends'       },
      { key:'performance',  label:'Performance'  },
      { key:'reports',      label:'Reports'      },
    ],
    /* AI Data — animated bar chart */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
        <line x1="2" y1="22" x2="22" y2="22" stroke={c} strokeWidth="1.4" strokeOpacity="0.4"/>
        <rect x="3"  y="12" width="4" height="10" rx="1" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.12"
          style={{transformBox:'fill-box', transformOrigin:'50% 100%', animation:'eh-bar-a 4s ease-in-out infinite'}}/>
        <rect x="10" y="8"  width="4" height="14" rx="1" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.12"
          style={{transformBox:'fill-box', transformOrigin:'50% 100%', animation:'eh-bar-b 4s ease-in-out 0.7s infinite'}}/>
        <rect x="17" y="15" width="4" height="7"  rx="1" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.12"
          style={{transformBox:'fill-box', transformOrigin:'50% 100%', animation:'eh-bar-c 4s ease-in-out 1.4s infinite'}}/>
      </svg>
    ),
  },
  {
    id: 'competitors', label: 'Competitors',
    color: '#fb923c', route: 'competitors',
    subOptions: [
      { key:'list-price', label:'List Price Analysis' },
    ],
    /* Competitors — target with spinning outer ring */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="5"/>
        <circle cx="12" cy="12" r="1.5" fill={c} stroke="none"/>
        <line x1="12" y1="2"  x2="12" y2="5"  strokeOpacity="0.5"/>
        <line x1="12" y1="19" x2="12" y2="22" strokeOpacity="0.5"/>
        <line x1="2"  y1="12" x2="5"  y2="12" strokeOpacity="0.5"/>
        <line x1="19" y1="12" x2="22" y2="12" strokeOpacity="0.5"/>
        <circle cx="12" cy="12" r="10" strokeDasharray="8 4"
          style={{animation:'eh-spin-slow 14s linear infinite', transformOrigin:'12px 12px'}}
          strokeOpacity="0.4"/>
      </svg>
    ),
  },
  {
    id: 'projects', label: 'Project List\n& Respond',
    color: '#818cf8', route: 'projectList',
    subOptions: [
      { key:'all',         label:'All Projects'    },
      { key:'low-margin',  label:'Low Margin'      },
      { key:'overdue',     label:'Overdue Offers'  },
      { key:'duplication', label:'Duplication'     },
    ],
    /* Projects — clipboard with animated checkmark */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M9 2h6a1 1 0 010 2H9a1 1 0 010-2z"/>
        <line x1="8" y1="12" x2="16" y2="12" strokeOpacity="0.4"/>
        <line x1="8" y1="16" x2="13" y2="16" strokeOpacity="0.4"/>
        <path d="M8 8 l3 3 5-6"
          strokeDasharray="18"
          style={{animation:'eh-draw-check 6s ease-in-out infinite'}}/>
      </svg>
    ),
  },
  {
    id: 'costing', label: 'Costing Art',
    color: '#f59e0b', route: 'costingArt',
    subOptions: [
      { key:'calculations',   label:'Calculations'          },
      { key:'raw-materials',  label:'Raw Materials'         },
      { key:'suppliers',      label:'Suppliers'             },
      { key:'won-projects',   label:'Won Projects'          },
      { key:'margin-control', label:'Margin Control'        },
    ],
    /* Costing — diamond gem with sparkle points */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L22 9 L12 22 L2 9 Z"/>
        <line x1="2"  y1="9"  x2="22" y2="9"  strokeOpacity="0.35"/>
        <line x1="12" y1="2"  x2="7"  y2="9"  strokeOpacity="0.25"/>
        <line x1="12" y1="2"  x2="17" y2="9"  strokeOpacity="0.25"/>
        <line x1="12" y1="0"  x2="12" y2="-2" strokeWidth="1.2"
          style={{animation:'eh-sparkle 5s ease-in-out 0s infinite', transformOrigin:'12px 2px'}}/>
        <line x1="23" y1="8"  x2="25" y2="6"  strokeWidth="1.2"
          style={{animation:'eh-sparkle 5s ease-in-out 1s infinite', transformOrigin:'22px 9px'}}/>
        <line x1="23" y1="10" x2="25" y2="12" strokeWidth="1.2"
          style={{animation:'eh-sparkle 5s ease-in-out 2s infinite', transformOrigin:'22px 9px'}}/>
        <line x1="1"  y1="8"  x2="-1" y2="6"  strokeWidth="1.2"
          style={{animation:'eh-sparkle 5s ease-in-out 3s infinite', transformOrigin:'2px 9px'}}/>
      </svg>
    ),
  },
  {
    id: 'team-access', label: 'Team Access',
    color: '#22d3ee', route: 'teamAccess',
    subOptions: [
      { key:'members',     label:'Members'      },
      { key:'roles',       label:'Roles'        },
      { key:'permissions', label:'Permissions'  },
    ],
    /* Team Access — shield with keyhole + pulsing access dot */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L20 5 V11 C20 16 16.5 19.5 12 22 C7.5 19.5 4 16 4 11 V5 Z"/>
        <circle cx="12" cy="10" r="2.2"/>
        <line x1="12" y1="12" x2="12" y2="15"/>
        <circle cx="12" cy="10" r="2.2" fill={c} stroke="none" fillOpacity="0.18"
          style={{animation:'eh-pulse-dot 4.5s ease-in-out infinite', transformOrigin:'12px 10px'}}/>
      </svg>
    ),
  },
  {
    id: 'ai-estimation', label: 'AI Estimation Tool',
    color: '#a855f7', route: 'aiTool', compactCard: true,
    /* AI Tool — neural layers with animated traveling particle */
    icon: (c, sz) => (
      <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1"  y="4"  width="6" height="5" rx="1.5"/>
        <rect x="9"  y="1"  width="6" height="5" rx="1.5"/>
        <rect x="9"  y="10" width="6" height="5" rx="1.5"/>
        <rect x="9"  y="19" width="6" height="5" rx="1.5"/>
        <rect x="17" y="10" width="6" height="5" rx="1.5"/>
        <line x1="7" y1="6.5" x2="9" y2="3.5"   strokeOpacity="0.35"/>
        <line x1="7" y1="6.5" x2="9" y2="12.5"  strokeOpacity="0.35"/>
        <line x1="7" y1="6.5" x2="9" y2="21.5"  strokeOpacity="0.35"/>
        <line x1="15" y1="12.5" x2="17" y2="12.5" strokeOpacity="0.35"/>
        <circle r="1.8" fill={c} stroke="none" style={{animation:'eh-dot-travel 4.5s ease-in-out infinite'}}>
          <animateMotion dur="4.5s" repeatCount="indefinite" path="M4 6.5 Q8 3 12 3"/>
        </circle>
        <circle r="1.8" fill={c} stroke="none" style={{animation:'eh-dot-travel 4.5s ease-in-out 2.25s infinite'}}>
          <animateMotion dur="4.5s" begin="2.25s" repeatCount="indefinite" path="M4 6.5 Q8 12 12 12.5"/>
        </circle>
      </svg>
    ),
  },
];

/* grid cards (all except the last ai-estimation entry) */
const GRID_OPTIONS   = ALL_OPTIONS.slice(0, 8);
const AI_TOOL_OPTION = ALL_OPTIONS[8]; // renders at center-bottom, outside the slot grid


/* ─────────────────────────────────────────────
   DRAGGABLE CARD  (iPhone-style free movement)
───────────────────────────────────────────── */
function DraggableCard({ opt, sc, onNavigate, pos, onDrop, cardIdx, entryDelay }) {
  const [hov, setHov]         = useState(false);
  const [dragging, setDragging] = useState(false);
  const isSoon = opt.route === 'soon';

  const motX = useMotionValue(pos.x);
  const motY = useMotionValue(pos.y);

  // Only animate on first mount or explicit position reset
  const prevPos = useRef(pos);
  useEffect(() => {
    if (prevPos.current.x === pos.x && prevPos.current.y === pos.y) return;
    prevPos.current = pos;
    const cx = animate(motX, pos.x, { type:'spring', stiffness:280, damping:24, mass:0.85 });
    const cy = animate(motY, pos.y, { type:'spring', stiffness:280, damping:24, mass:0.85 });
    return () => { cx.stop(); cy.stop(); };
  }, [pos.x, pos.y]); // eslint-disable-line

  return (
    <motion.div
      initial={{ opacity:0, scale:0.82 }} // REMOVED y: 24
      animate={{ opacity:1, scale: 1 }}   // REMOVED y: 0
      transition={{ duration:0.55, delay:entryDelay, ease:[0.22,1,0.36,1] }}
      drag
      dragMomentum={false}
      dragElastic={0.06}
      style={{
        x: motX, y: motY,
        position: 'fixed',
        width:  opt.compactCard ? Math.round(sc.cardW * 1.28) : sc.cardW,
        height: opt.compactCard ? Math.round(sc.cardH * 0.52) : sc.cardH,
        zIndex: dragging ? 100 : 20,
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        padding: sc.pad,
        background: hov && !isSoon ? 'rgba(255,255,255,0.062)' : 'rgba(255,255,255,0.032)',
        backdropFilter: hov && !isSoon
          ? 'blur(8px) saturate(140%) brightness(1.22)'
          : 'blur(4px) saturate(110%) brightness(1.12)',
        WebkitBackdropFilter: hov && !isSoon
          ? 'blur(8px) saturate(140%) brightness(1.22)'
          : 'blur(4px) saturate(110%) brightness(1.12)',
        border: `1px solid rgba(200,225,255,${hov && !isSoon ? 0.32 : 0.14})`,
        borderRadius: sc.br,
        boxShadow: hov && !isSoon
          ? '0 28px 72px rgba(0,8,40,0.65), 0 0 0 1px rgba(200,225,255,0.14), inset 0 1.5px 0 rgba(255,255,255,0.42), inset 0 -1px 0 rgba(180,210,255,0.16)'
          : '0 8px 32px rgba(0,8,40,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
        display: 'flex',
        flexDirection: opt.compactCard ? 'row' : 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: opt.compactCard ? sc.gap * 2 : sc.gap,
        cursor: isSoon ? 'default' : dragging ? 'grabbing' : 'grab',
        opacity: isSoon ? 0.44 : 1,
        transition: 'border 0.14s, box-shadow 0.14s, background 0.14s, backdrop-filter 0.14s',
      }}
      whileTap={!isSoon ? { scale:0.94, transition:{ duration:0.10 } } : {}}
      whileDrag={{
        scale: 1.08,
        rotate: 4,
        boxShadow: '0 32px 80px rgba(0,8,40,0.75), inset 0 1px 0 rgba(255,255,255,0.38)',
        zIndex: 100,
        cursor: 'grabbing',
      }}
      onDragStart={() => { setDragging(true); setHov(false); }}
      onDragEnd={() => {
        setDragging(false);
        onDrop(cardIdx, motX.get(), motY.get()); // store top-left corner, no slot snapping
      }}
      onHoverStart={() => !dragging && setHov(true)}
      onHoverEnd={() => setHov(false)}
      onTap={() => { if (!isSoon && !dragging) onNavigate(opt.route); }}
    >
      {/* top specular streak — brightens on hover */}
      <div style={{ position:'absolute', top:0, left:'18%', right:'18%', height:1, zIndex:5,
        background: hov && !isSoon
          ? 'linear-gradient(90deg,transparent,rgba(255,255,255,0.28) 25%,rgba(255,255,255,0.55) 50%,rgba(255,255,255,0.28) 75%,transparent)'
          : 'linear-gradient(90deg,transparent,rgba(255,255,255,0.10) 30%,rgba(255,255,255,0.22) 50%,rgba(255,255,255,0.10) 70%,transparent)',
        transition:'background 0.14s', pointerEvents:'none' }}/>
      {/* left edge glint */}
      <div style={{ position:'absolute', top:'6%', left:0, height:'28%', width:1, zIndex:5, background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.14) 40%,rgba(255,255,255,0.08) 70%,transparent)', pointerEvents:'none' }}/>
      {/* inner lens */}
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'linear-gradient(128deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 28%,transparent 55%)', borderRadius:'inherit' }}/>
      {/* bottom depth */}
      <div style={{ position:'absolute', bottom:0, left:'8%', right:'8%', height:1, zIndex:5, background:'linear-gradient(90deg,transparent,rgba(0,10,60,0.18) 40%,rgba(0,10,60,0.22) 50%,rgba(0,10,60,0.18) 60%,transparent)', pointerEvents:'none' }}/>

      {/* hover glow */}
      {hov && !isSoon && (
        <>
          <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(140,190,255,0.40) 30%,rgba(160,205,255,0.55) 50%,rgba(140,190,255,0.40) 70%,transparent)', pointerEvents:'none', zIndex:6 }}/>
          <div style={{ position:'absolute', bottom:-50, left:'-20%', right:'-20%', height:65, background:'radial-gradient(ellipse 70% 100% at 50% 0%,rgba(100,160,255,0.50) 0%,rgba(80,120,255,0.16) 50%,transparent 100%)', pointerEvents:'none', borderRadius:'50%', filter:'blur(8px)', zIndex:0 }}/>
          <div style={{ position:'absolute', bottom:0, left:'5%', right:'5%', height:2, background:'linear-gradient(90deg,transparent,rgba(140,190,255,0.70) 25%,rgba(180,220,255,0.90) 50%,rgba(140,190,255,0.70) 75%,transparent)', pointerEvents:'none', zIndex:6 }}/>
        </>
      )}

      {/* SOON badge */}
      {isSoon && (
        <span style={{ position:'absolute', top:6, right:8, fontSize:'0.42rem', letterSpacing:'0.13em', fontWeight:600, color:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:4, padding:'1px 4px' }}>SOON</span>
      )}

      {/* 6-dot drag handle */}
      {!isSoon && (
        <div style={{ position:'absolute', top:8, right:9, display:'flex', flexDirection:'column', gap:2.5, opacity: hov || dragging ? 0.55 : 0.18, transition:'opacity 0.22s', zIndex:6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display:'flex', gap:2.5 }}>
              {[0,1].map(j => <div key={j} style={{ width:2.5, height:2.5, borderRadius:'50%', background:'rgba(160,205,255,0.85)' }}/>)}
            </div>
          ))}
        </div>
      )}

      {/* animated icon — aurora color cycling */}
      <div style={{ position:'relative', zIndex:2, flexShrink:0,
        width:sc.iconWrap, height:sc.iconWrap,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: isSoon ? 'rgba(255,255,255,0.12)' : '#00e5ff',
        animation: isSoon ? 'none' : 'eh-icon-aurora 5s ease infinite',
        filter: isSoon ? 'none'
          : hov
            ? 'drop-shadow(0 0 7px currentColor) drop-shadow(0 0 20px rgba(124,58,237,0.40))'
            : 'drop-shadow(0 0 4px currentColor) drop-shadow(0 0 10px rgba(124,58,237,0.22))',
        transition:'filter 0.14s',
        opacity: isSoon ? 0.22 : 1,
      }}>
        {opt.icon(isSoon ? 'rgba(255,255,255,0.12)' : 'currentColor', Math.round(sc.iconWrap * 0.75))}
      </div>

      {/* label — aurora Cinzel */}
      <div style={{
        fontSize: sc.fontSize, fontWeight:700, lineHeight:1.25,
        fontFamily:"'Cinzel',serif", letterSpacing:'0.04em', textTransform:'uppercase',
        background: isSoon ? undefined : 'linear-gradient(90deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
        backgroundSize:'300% auto',
        WebkitBackgroundClip: isSoon ? undefined : 'text',
        WebkitTextFillColor: isSoon ? 'rgba(255,255,255,0.30)' : 'transparent',
        backgroundClip: isSoon ? undefined : 'text',
        animation: isSoon ? 'none' : 'eh-aurora 5s ease infinite',
        filter: isSoon ? 'none' : 'drop-shadow(0 0 10px rgba(6,182,212,0.55))',
        textAlign:'center', whiteSpace:'pre-line', zIndex:2,
      }}>
        {opt.label}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function EstimationHub({ onNavigate, onBack, currentUser }) {
  const { w, h } = useViewport();
  const sc = getScale(w);

  // Role-based card visibility
  const allowedIds = useMemo(() => getAllowedCardIds(currentUser), [currentUser]);
  const visibleGridOptions = useMemo(() =>
    allowedIds ? GRID_OPTIONS.filter(o => allowedIds.has(o.id)) : GRID_OPTIONS,
  [allowedIds]);
  const aiToolVisible = !allowedIds || allowedIds.has('ai-estimation');

  // 1. Calculate default layout matching Image 2 perfectly
  const defaultPositions = useMemo(() => {
    const cw  = sc.cardW;
    const aiW = Math.round(cw * 1.28);

    // Horizontal spacing columns
    const hPad   = Math.max(20, Math.round(w * 0.04));
    const colGap = Math.round(w * 0.06);

    const xFarLeft    = hPad;
    const xInnerLeft  = xFarLeft + cw + colGap;
    const xFarRight   = w - hPad - cw;
    const xInnerRight = xFarRight - cw - colGap;
    const aiCenX      = Math.round((w - aiW) / 2);

    // Vertical spacing rows — tuned to match the reference layout (4 rows per side)
    const yTop    = Math.round(h * 0.14);   // Quotations / Team Access (top)
    const yMidTop = Math.round(h * 0.31);   // Customers / Team
    const yMid    = Math.round(h * 0.48);   // Competitors / Project List
    const yLow    = Math.round(h * 0.65);   // Costing Art / AI Analysis (bottom)
    const aiYBot  = Math.round(h * 0.90);   // AI Estimation Tool — anchored bottom-center

    return [
      { x: xFarLeft,    y: yTop },     // 0: Quotations (Far Left, Top)
      { x: xInnerRight, y: yMidTop },  // 1: Team (Inner Right, Mid-Top)
      { x: xInnerLeft,  y: yMidTop },  // 2: Customers (Inner Left, Mid-Top)
      { x: xInnerRight, y: yLow },     // 3: AI Analysis (Inner Right, Bottom)
      { x: xFarLeft,    y: yMid },     // 4: Competitors (Far Left, Middle)
      { x: xFarRight,   y: yMid },     // 5: Project List (Far Right, Middle)
      { x: xInnerLeft,  y: yLow },     // 6: Costing Art (Inner Left, Bottom)
      { x: xFarRight,   y: yTop },     // 7: Team Access (Far Right, Top)
      { x: aiCenX,      y: aiYBot },   // 8: AI Estimation Tool (Center, Bottom)
    ];
  }, [w, h, sc.cardW]);

  // 2. Initialize State
  const [cardPositions, setCardPositions] = useState(defaultPositions);

  // 3. FORCE reset to bypass Vite's HMR cache and old positions
  useEffect(() => {
    setCardPositions(defaultPositions);
    // Safety purge: clear the old local storage key entirely from the browser
    try { localStorage.removeItem('naffco_cards_2026b'); } catch {}
  }, [defaultPositions]); // <--- This dependency is the magic fix that forces the layout

  /* ── Estimation intro: plays only once per calendar day (first login of the day) ── */
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [playIntro] = useState(() => {
    try { return localStorage.getItem('naffco_intro_date') !== todayKey; }
    catch { return true; }
  });
  // Intro: 0 loading → 1 spline appears → 2 top bar → 3 cards. Already seen today → jump straight to cards.
  const [introStage, setIntroStage] = useState(playIntro ? 0 : 3);
  // Cards must not appear until the Spline 3D scene has actually finished loading.
  const [botLoaded, setBotLoaded] = useState(!playIntro);

  // Mark intro as seen + safety fallback in case the iframe never fires onLoad (slow/blocked network).
  useEffect(() => {
    if (!playIntro) return;
    try { localStorage.setItem('naffco_intro_date', todayKey); } catch {}
    const fb = setTimeout(() => setBotLoaded(true), 9000);
    return () => clearTimeout(fb);
  }, [playIntro, todayKey]);

  // Once the bot has loaded, reveal in sequence — spline → top bar → cards — slow and smooth.
  useEffect(() => {
    if (!playIntro || !botLoaded) return;
    setIntroStage(1);                                     // spline fades in
    const t1 = setTimeout(() => setIntroStage(2), 1500);  // top bar appears slowly
    const t2 = setTimeout(() => setIntroStage(3), 3000);  // cards begin appearing one by one
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [playIntro, botLoaded]);

  /* Randomized per-card entry delays so cards pop in one-by-one in a random order (intro only) */
  const cardEntryDelays = useMemo(() => {
    const n = ALL_OPTIONS.length;
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { // Fisher–Yates shuffle
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const delays = new Array(n);
    order.forEach((cardIdx, rank) => { delays[cardIdx] = rank; });
    return delays;
  }, []);

  const getEntryDelay = useCallback(
    (origIdx) => playIntro ? 0.2 + cardEntryDelays[origIdx] * 0.34 : 0,
    [playIntro, cardEntryDelays],
  );

  /* 4. Drop handler: Updates state for free dragging, but doesn't save to localStorage */
  const handleDrop = useCallback((cardIdx, x, y) => {
    setCardPositions(prev => {
      const next = [...prev];
      next[cardIdx] = { x, y };
      return next;
    });
  }, []);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'#000', fontFamily:"'Inter',sans-serif", overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        @keyframes eh-aurora { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes eh-ping { 0%,100%{transform:scale(0.80);opacity:0.38} 50%{transform:scale(1.35);opacity:1} }
        @keyframes eh-intro-glow  { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes eh-typewrite   { 0%,15%{stroke-dashoffset:14} 70%,100%{stroke-dashoffset:0} }
        @keyframes eh-pulse-dot   { 0%,100%{transform:scale(0.4);opacity:0.25} 50%{transform:scale(1.3);opacity:1} }
        @keyframes eh-rise        { 0%{transform:translateY(5px);opacity:0} 55%{opacity:1} 100%{transform:translateY(-5px);opacity:0} }
        @keyframes eh-bar-a       { 0%,100%{transform:scaleY(0.30)} 50%{transform:scaleY(1)} }
        @keyframes eh-bar-b       { 0%,100%{transform:scaleY(0.75)} 50%{transform:scaleY(0.20)} }
        @keyframes eh-bar-c       { 0%,100%{transform:scaleY(0.50)} 50%{transform:scaleY(0.90)} }
        @keyframes eh-spin-slow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes eh-draw-check  { 0%,20%{stroke-dashoffset:18} 80%,100%{stroke-dashoffset:0} }
        @keyframes eh-sparkle     { 0%,70%,100%{opacity:0;transform:scale(0.1)} 35%{opacity:1;transform:scale(1)} }
        @keyframes eh-dot-travel  { 0%{opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{opacity:0} }
        @keyframes eh-icon-aurora  {
          0%   { color:#00e5ff; }
          22%  { color:#4f46e5; }
          38%  { color:#7c3aed; }
          54%  { color:#a855f7; }
          72%  { color:#06b6d4; }
          100% { color:#00e5ff; }
        }
      `}</style>

      {/* ── STAGE 0: centered Estimation title ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.90 }}
        animate={{
          opacity: introStage === 0 ? 1 : 0,
          scale:   introStage === 0 ? 1 : 1.06,
        }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 14, pointerEvents: 'none',
        }}
      >
        <h1 style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 'clamp(3rem, 9vw, 7rem)',
          fontWeight: 400,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          margin: 0, lineHeight: 1,
          background: 'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'eh-aurora 5s ease infinite',
          filter: 'drop-shadow(0 0 48px rgba(124,58,237,0.80)) drop-shadow(0 0 100px rgba(0,229,255,0.35))',
          textAlign: 'center',
        }}>
          Estimation
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 70, height: 1, background: 'linear-gradient(to right,transparent,rgba(124,58,237,0.80))', display: 'inline-block' }}/>
          <span style={{ fontSize: '0.70rem', letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Precision Engine</span>
          <span style={{ width: 70, height: 1, background: 'linear-gradient(to left,transparent,rgba(124,58,237,0.80))', display: 'inline-block' }}/>
        </div>
      </motion.div>

      {/* ── STAGE 1+: Spline bot (fades in) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introStage >= 1 ? 1 : 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      >
        <iframe
          src="https://my.spline.design/nexbotrobotcharacterconcept-EebmabQUV0mdXFErpVMXa8Fp/"
          frameBorder="0" width="100%" height="100%" title="Estimation AI Bot"
          style={{ position: 'absolute', inset: 0, border: 'none', display: 'block' }}
          allow="autoplay"
          onLoad={() => setBotLoaded(true)}
        />
      </motion.div>

      {/* ── Spline watermark cover — bottom right ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, right: 0,
        width: Math.round(sc.cardW * 1.28),
        height: Math.round(sc.cardH * 0.52),
        background: '#000',
        zIndex: 10,
        pointerEvents: 'none',
      }}/>

      {/* ── STAGE 1+: NAFFCO branding — top left ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: introStage >= 2 ? 1 : 0, y: introStage >= 2 ? 0 : -8 }}
        transition={{ duration: 0.7, delay: introStage >= 2 ? 0.30 : 0 }}
        style={{ position:'absolute', top:sc.brandTop, left:sc.brandLeft, zIndex:30, display:'flex', flexDirection:'column', gap:1 }}
      >
        <div style={{ fontSize:sc.brandSize, fontWeight:500, letterSpacing:'0.26em', textTransform:'uppercase', background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)', backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'eh-aurora 5s ease infinite' }}>NAFFCO AI APEX</div>
        <div style={{ fontSize:sc.brandSub, letterSpacing:'0.34em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)' }}>Passion to Protect</div>
        {currentUser && (
          <div style={{ marginTop:4, display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background: currentUser.level === 1 ? '#fbbf24' : '#60a5fa', flexShrink:0 }}/>
            <span style={{ fontSize:'0.52rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.40)', fontWeight:600 }}>
              {currentUser.name} · {currentUser.designation}
            </span>
          </div>
        )}
      </motion.div>

      {/* ── STAGE 1+: Estimation title — centered ── */}
      <motion.div
        initial={{ opacity:0, y:6 }}
        animate={{ opacity: introStage >= 2 ? 1 : 0, y: introStage >= 2 ? 0 : 6 }}
        transition={{ duration:0.9, delay: introStage >= 2 ? 0.55 : 0, ease:[0.22,1,0.36,1] }}
        style={{
          position:'absolute', top: sc.brandTop, left:0, right:0, zIndex:30,
          display:'flex', flexDirection:'column', alignItems:'center', gap:sc.subGap,
          pointerEvents:'none',
        }}
      >
        <h1 style={{
          fontFamily:"'Cinzel',serif", fontSize:sc.titleSize, fontWeight:400,
          letterSpacing:'0.18em', textTransform:'uppercase', margin:0, lineHeight:1,
          background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
          backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          animation:'eh-aurora 5s ease infinite', filter:'drop-shadow(0 2px 18px rgba(124,58,237,0.60))',
        }}>Estimation</h1>
        <div style={{ display:'flex', alignItems:'center', gap:sc.subGap }}>
          <span style={{ width:sc.lineW, height:1, background:'linear-gradient(to right,transparent,rgba(124,58,237,0.70))', display:'inline-block' }}/>
          <span style={{ fontSize:sc.subSize, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.30)', fontWeight:600 }}>Precision Engine</span>
          <span style={{ width:sc.lineW, height:1, background:'linear-gradient(to left,transparent,rgba(124,58,237,0.70))', display:'inline-block' }}/>
        </div>
      </motion.div>

      {/* ── STAGE 1+: Back button — top right ── */}
      <motion.button
        initial={{ opacity:0 }}
        animate={{ opacity: introStage >= 2 ? 1 : 0 }}
        transition={{ duration:0.50, delay: introStage >= 2 ? 0.45 : 0 }}
        onClick={onBack}
        style={{ position:'absolute', top:sc.backTop, right:sc.backRight, zIndex:30, display:'inline-flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.44)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.13)', borderRadius:100, padding:sc.backPad, cursor:'pointer', color:'rgba(255,255,255,0.55)', fontSize:sc.backFont, letterSpacing:'0.10em', textTransform:'uppercase', fontFamily:"'Inter',sans-serif", fontWeight:500, transition:'color 0.2s, border-color 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(255,255,255,0.30)'; }}
        onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.13)'; }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </motion.button>

      {/* ── STAGE 3: grid cards (filtered by role) ── */}
      {introStage >= 3 && visibleGridOptions.map((opt) => {
        const origIdx = ALL_OPTIONS.indexOf(opt);
        return (
          <DraggableCard
            key={opt.id}
            opt={opt}
            sc={sc}
            onNavigate={onNavigate}
            pos={cardPositions[origIdx] || { x: 20, y: 20 + origIdx * 60 }}
            onDrop={handleDrop}
            cardIdx={origIdx}
            entryDelay={getEntryDelay(origIdx)}
          />
        );
      })}

      {/* ── STAGE 3: AI Estimation Tool — freely positionable ── */}
      {introStage >= 3 && aiToolVisible && (
        <DraggableCard
          key={AI_TOOL_OPTION.id}
          opt={AI_TOOL_OPTION}
          sc={sc}
          onNavigate={onNavigate}
          pos={cardPositions[8] || { x: Math.round((w - Math.round(sc.cardW * 1.28)) / 2), y: h - Math.round(sc.cardH * 0.52) - 24 }}
          onDrop={handleDrop}
          cardIdx={8}
          entryDelay={getEntryDelay(8)}
        />
      )}

      {/* ── STAGE 2+: NAFFCO logo — bottom left ── */}
      <motion.img
        src="/logo.png" alt="NAFFCO"
        initial={{ opacity:0 }}
        animate={{ opacity: introStage >= 3 ? 0.28 : 0 }}
        transition={{ duration:0.8, delay: introStage >= 3 ? 0.7 : 0 }}
        style={{ position:'absolute', bottom:14, left:sc.brandLeft, zIndex:30, height:sc.logoH, objectFit:'contain', filter:'drop-shadow(0 1px 5px rgba(124,58,237,0.22))', pointerEvents:'none' }}
      />
    </div>
  );
}
