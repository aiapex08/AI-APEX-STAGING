import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating icons per department — each entry: { x%, y%, sz, delay, dur, path }
const FLOATS = {
  sales: [
    { x:12, y:18, sz:36, delay:0,    dur:3.4, d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { x:68, y:12, sz:30, delay:0.6,  dur:4.1, d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { x:80, y:48, sz:28, delay:1.1,  dur:3.7, d:'M22 12h-4l-3 9L9 3l-3 9H2' },
    { x:35, y:62, sz:32, delay:0.4,  dur:4.3, d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { x:55, y:35, sz:26, delay:1.5,  dur:3.2, d:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { x:20, y:75, sz:34, delay:0.9,  dur:3.9, d:'M18 20V10M12 20V4M6 20v-6' },
  ],
  estimation: [
    { x:15, y:20, sz:34, delay:0,    dur:3.6, d:'M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M18 2h4v4M12 12l10-10' },
    { x:70, y:10, sz:28, delay:0.7,  dur:4.0, d:'M4 2v20l8-5 8 5V2z' },
    { x:82, y:52, sz:30, delay:1.2,  dur:3.5, d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { x:30, y:65, sz:26, delay:0.3,  dur:4.2, d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { x:58, y:38, sz:32, delay:1.6,  dur:3.3, d:'M3 3h18v4H3zM3 11h18v4H3zM3 19h18v4H3z' },
    { x:22, y:80, sz:36, delay:0.8,  dur:3.8, d:'M18 20V10M12 20V4M6 20v-6' },
  ],
  contracts: [
    { x:14, y:22, sz:32, delay:0,    dur:3.5, d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
    { x:72, y:14, sz:28, delay:0.5,  dur:4.1, d:'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { x:80, y:55, sz:30, delay:1.0,  dur:3.6, d:'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3' },
    { x:28, y:68, sz:26, delay:0.4,  dur:4.4, d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { x:52, y:35, sz:34, delay:1.4,  dur:3.2, d:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
    { x:18, y:82, sz:28, delay:0.9,  dur:3.9, d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  ],
  engineering: [
    { x:10, y:18, sz:34, delay:0,    dur:3.8, d:'M12 15a3 3 0 100-6 3 3 0 000 6zM19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14' },
    { x:74, y:12, sz:28, delay:0.6,  dur:4.0, d:'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
    { x:82, y:50, sz:32, delay:1.1,  dur:3.4, d:'M2 20h20M4 14v6M8 10v10M12 4v16M16 10v10M20 14v6' },
    { x:32, y:64, sz:26, delay:0.3,  dur:4.3, d:'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9zM13 2v7h7' },
    { x:55, y:32, sz:30, delay:1.5,  dur:3.6, d:'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
    { x:20, y:78, sz:36, delay:0.8,  dur:3.7, d:'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 8v4l3 3' },
  ],
  salesorder: [
    { x:12, y:20, sz:32, delay:0,    dur:3.5, d:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0' },
    { x:70, y:10, sz:28, delay:0.5,  dur:4.2, d:'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01' },
    { x:80, y:52, sz:30, delay:1.0,  dur:3.7, d:'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3' },
    { x:30, y:66, sz:26, delay:0.4,  dur:4.1, d:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { x:54, y:36, sz:34, delay:1.4,  dur:3.3, d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { x:22, y:80, sz:28, delay:0.9,  dur:4.0, d:'M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  ],
  supplier: [
    { x:10, y:16, sz:34, delay:0,    dur:3.6, d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { x:72, y:12, sz:28, delay:0.6,  dur:4.1, d:'M1 3h15v13H1zM16 8h4l3 5v3h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' },
    { x:82, y:54, sz:30, delay:1.1,  dur:3.5, d:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 10a1 1 0 110-2 1 1 0 010 2z' },
    { x:32, y:66, sz:26, delay:0.3,  dur:4.3, d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
    { x:55, y:36, sz:32, delay:1.5,  dur:3.2, d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { x:18, y:80, sz:36, delay:0.8,  dur:3.9, d:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  ],
};

export default function DummyHub() {
  const [phase, setPhase]           = useState('select');
  const [selDept, setSelDept]       = useState(null);
  const [code, setCode]             = useState('');
  const [showCode, setShowCode]     = useState(false);
  const [shake, setShake]           = useState(false);
  const [errMsg, setErrMsg]         = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const inputRef = useRef(null);

  const depts = [
    {
      id:'sales', label:'Sales & Marketing', hint:'Enter sales code',
      color:'#f59e0b', a:'245,158,11', b:'234,88,12',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
    {
      id:'estimation', label:'Estimation', hint:'Enter estimation code',
      color:'#a78bfa', a:'167,139,250', b:'168,85,247',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="8" y1="15" x2="11" y2="15"/>
        </svg>
      ),
    },
    {
      id:'contracts', label:'Contracts', hint:'Enter contracts code',
      color:'#60a5fa', a:'96,165,250', b:'59,130,246',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <path d="M9 13h6M9 17h4"/>
        </svg>
      ),
    },
    {
      id:'engineering', label:'Engineering', hint:'Enter engineering code',
      color:'#34d399', a:'52,211,153', b:'16,185,129',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
    },
    {
      id:'salesorder', label:'Sales Order', hint:'Enter sales order code',
      color:'#fb923c', a:'251,146,60', b:'239,68,68',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
    },
    {
      id:'supplier', label:'Supplier', hint:'Enter supplier code',
      color:'#2dd4bf', a:'45,212,191', b:'20,184,166',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
  ];

  const pickDept = (dept) => {
    setSelDept(dept); setCode(''); setErrMsg(''); setPhase('code');
    setTimeout(() => inputRef.current?.focus(), 80);
  };
  const doShake = (msg) => {
    setErrMsg(msg); setShake(true);
    setTimeout(() => { setShake(false); setCode(''); }, 620);
  };
  const handleSubmit = (e) => {
    e?.preventDefault();
    const entered = code.trim().toUpperCase();
    if (!entered) return;
    if (entered === 'TEST') alert(`Logged into ${selDept.label} successfully!`);
    else doShake('Invalid code (Try "TEST")');
  };

  // ── Arc constants ──
  const N       = depts.length;   // 6
  const ARC     = 110;              // total spread in degrees
  const RADIUS  = 890;            // px — distance from viewer to each panel
  const PW      = 200;            // panel width  px
  const PH      = 430;            // panel height px
  const STAGE_H = 560;            // stage container height px

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:'#010106',
      fontFamily:"'Inter',sans-serif", color:'#e2e8f0', overflow:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Barlow+Condensed:wght@600;700&display=swap');
        @keyframes hs-aurora  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes hs-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hs-shake   { 0%{transform:translateX(0)} 15%{transform:translateX(-10px)} 30%{transform:translateX(10px)} 45%{transform:translateX(-8px)} 60%{transform:translateX(8px)} 75%{transform:translateX(-4px)} 90%{transform:translateX(4px)} 100%{transform:translateX(0)} }
        @keyframes hs-errP    { 0%{box-shadow:0 0 0 rgba(220,30,30,0)} 50%{box-shadow:0 0 22px rgba(220,30,30,0.7)} 100%{box-shadow:0 0 8px rgba(220,30,30,0.3)} }
        @keyframes cardSweep  { 0%{left:-60%} 70%,100%{left:130%} }
        @keyframes hs-spin      { to{transform:rotate(360deg)} }
        @keyframes hs-spin-rev  { to{transform:rotate(-360deg)} }
        @keyframes hs-orbit-x   { to{transform:rotateX(60deg) rotateZ(360deg)} }
        @keyframes hs-orbit-y   { to{transform:rotateY(60deg) rotateZ(-360deg)} }
        @keyframes hs-pulse-ring{
          0%  { transform:translate(-50%,-50%) scale(0.55); opacity:0.9; }
          100%{ transform:translate(-50%,-50%) scale(2.2);  opacity:0; }
        }
        @keyframes hs-radar     { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes hs-core-glow {
          0%,100%{ box-shadow:0 0 24px 4px var(--tc-glow), inset 0 0 20px rgba(255,255,255,0.05); }
          50%    { box-shadow:0 0 60px 16px var(--tc-glow), inset 0 0 40px rgba(255,255,255,0.12); }
        }
        @keyframes hs-dot-orbit { to{transform:rotate(360deg) translateX(88px) rotate(-360deg)} }
        @keyframes hs-ticker    { 0%{opacity:0.2} 50%{opacity:1} 100%{opacity:0.2} }

        /* branding */
        .hs-topbrand { position:absolute; top:22px; left:40px; z-index:30; display:flex; flex-direction:column; gap:2px; animation:hs-fadeUp 0.5s ease both; }
        .hs-topbrand-naffco {
          font-size:clamp(0.78rem,1vw,0.95rem); font-weight:500; letter-spacing:0.28em;
          text-transform:uppercase; line-height:1;
          background:linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%);
          background-size:250% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 1px 8px rgba(109,40,217,0.5)); animation:hs-aurora 6s ease infinite;
        }
        .hs-topbrand-sub { font-size:clamp(0.52rem,0.65vw,0.62rem); font-weight:400; letter-spacing:0.38em; text-transform:uppercase; color:rgba(255,255,255,0.28); margin-bottom:10px; }
        .hs-title {
          font-family:'Cinzel',serif; font-size:clamp(3.2rem,6vw,6rem); font-weight:400; letter-spacing:0.08em; text-transform:uppercase; line-height:1.1; margin-bottom:6px;
          background:linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%);
          background-size:220% 220%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 2px 16px rgba(109,40,217,0.55)); animation:hs-aurora 6s ease infinite;
        }
        .hs-state-of-art { font-family:'Barlow Condensed',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.38em; text-transform:uppercase; color:rgba(255,255,255,0.32); margin-top:-4px; }

        /* icon */
        .hs-icon-wrap { position:relative; width:54px; height:54px; flex-shrink:0; }
        .hs-icon-ring { position:absolute; inset:-2px; border-radius:13px; background:conic-gradient(from 0deg, var(--tc) 0deg, transparent 110deg, transparent 250deg, var(--tc) 360deg); animation:hs-spin 3.5s linear infinite; opacity:0.6; }
        .hs-panel:hover .hs-icon-ring { opacity:1; }
        .hs-icon-bg  { position:absolute; inset:2px; border-radius:11px; background:rgba(6,4,22,0.90); display:flex; align-items:center; justify-content:center; }

        /* code entry */
        .hs-cinput { background:transparent;border:none;border-bottom:2px solid #333;outline:none; color:#e0e0e0;font-size:clamp(20px,3vw,36px);font-weight:600;letter-spacing:0.3em;text-align:center; text-transform:uppercase;width:clamp(200px,28vw,320px);padding:8px 0; caret-color:#cc0000;transition:border-color 0.3s; }
        .hs-cinput:focus  { border-bottom-color:#cc0000; }
        .hs-cinput.hs-err { border-bottom-color:#dc1e1e;color:#dc1e1e;animation:hs-errP 0.5s ease forwards; }
        .hs-cform.hs-shake { animation:hs-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .hs-back { display:inline-flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer; color:rgba(255,255,255,0.38);font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;padding:0;transition:color 0.2s; }
        .hs-back:hover { color:rgba(255,255,255,0.75); }
        .hs-hint   { font-size:11px;letter-spacing:0.3em;color:#2a2a2a;text-transform:uppercase;margin-top:22px; }
        .hs-errmsg { font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#dc1e1e;margin-top:10px;opacity:0;transition:opacity 0.2s; }
        .hs-errmsg.vis { opacity:1; }

        /* AR pill */
        .hs-ar-btn { position:absolute; bottom:24px; right:24px; z-index:40; display:inline-flex; align-items:center; gap:7px; background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.20); border-radius:100px; padding:7px 16px; cursor:pointer; color:rgba(255,255,255,0.82); font-size:0.70rem; font-weight:600; letter-spacing:0.10em; text-transform:uppercase; transition:background 0.2s,border-color 0.2s,color 0.2s,box-shadow 0.2s; }
        .hs-ar-btn:hover { background:rgba(0,200,255,0.12); border-color:rgba(0,200,255,0.45); color:#fff; box-shadow:0 0 16px rgba(0,200,255,0.22); }
        .hs-ar-dot { width:6px; height:6px; border-radius:50%; background:#00cfff; box-shadow:0 0 6px #00cfff; }
      `}</style>

      {/* ── FULL-SCREEN BACKGROUND: aurora + robot ── */}
      <div style={{position:'absolute',inset:0,zIndex:0}}>
        <div style={{position:'absolute',top:'-10%',left:0,right:0,bottom:'-5%',
          background:'conic-gradient(from 0deg at 50% 50%,#ff0000,#ff7700,#ffff00,#00ff88,#00cfff,#6d28d9,#a855f7,#ec4899,#ff0000)',
          backgroundSize:'300% 300%',animation:'hs-aurora 6s ease-in-out infinite',
          filter:'blur(60px)',opacity:0.45}}/>
        <div style={{position:'absolute',top:'-2%',left:'8%',right:'8%',bottom:0,
          background:'linear-gradient(120deg,#ff0000 0%,#ff6600 12%,#ffcc00 24%,#00ff88 36%,#00bfff 48%,#3b82f6 58%,#8b5cf6 68%,#ec4899 80%,#ff3366 90%,#ff0000 100%)',
          backgroundSize:'300% 300%',animation:'hs-aurora 4s ease-in-out infinite reverse',
          filter:'blur(32px)',opacity:0.55}}/>
        <img src="/AIBOT.png" alt="AI Bot" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',pointerEvents:'none'}}/>
      </div>

      {/* ── TOP-LEFT BRANDING ── */}
      <div className="hs-topbrand">
        <div className="hs-topbrand-naffco">NAFFCO AI APEX</div>
        <div className="hs-topbrand-sub">Passion to Protect</div>
        <h1 className="hs-title">AI APEX HUB</h1>
        <p className="hs-state-of-art">— STATE OF ART —</p>
      </div>

      {/* ── BOTTOM-LEFT LOGO ── */}
      <img src="/logo.png" alt="NAFFCO" style={{
        position:'absolute', bottom:24, left:36, zIndex:30,
        height:32, objectFit:'contain', opacity:0.55,
        filter:'drop-shadow(0 1px 8px rgba(109,40,217,0.35))',
        animation:'hs-fadeUp 0.6s ease both', cursor:'pointer',
      }} onClick={() => alert('Cost Artist Login Prompt!')} />

      {/* ── AR VIEWER ── */}
      <button className="hs-ar-btn" onClick={() => alert('AR Viewer Activated!')}>
        <span className="hs-ar-dot"/> AR Viewer
      </button>

      {/* ══════════════════════════════════════════
          SELECT PHASE — PANORAMIC ARC STAGE
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'select' && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.5 }}
            style={{
              position:'absolute',
              top:210, left:0, right:0, bottom:0,
              /* 3-D perspective — viewer inside the arc */
              perspective:`${RADIUS * 1.1}px`,
              perspectiveOrigin:'34% 30%',
              zIndex:20,
            }}
          >
            {/* ── outside-click dismiss overlay ── */}
            {expandedCard && (
              <div
                onClick={() => setExpandedCard(null)}
                style={{ position:'fixed', inset:0, zIndex:8, cursor:'default' }}
              />
            )}

            {/* ── arc panels ── */}
            {depts.map((dept, idx) => {
              const angle      = -(ARC / 2) + idx * (ARC / (N - 1));
              const isExpanded = expandedCard === dept.id;
              const isHidden   = expandedCard && !isExpanded;
              const floats     = FLOATS[dept.id] || [];

              return (
                <motion.div
                  key={dept.id}
                  className="hs-panel"
                  /* Fix transform order: rotateY THEN translateZ creates the proper cylinder arc */
                  transformTemplate={({ x, rotateY, z, scaleX, scaleY }) =>
                    `translateX(${x ?? '-50%'}) scaleX(${scaleX ?? 1}) scaleY(${scaleY ?? 1}) rotateY(${rotateY ?? '0deg'}) translateZ(${z ?? '0px'})`
                  }
                  style={{
                    '--tc': dept.color,
                    position:'absolute',
                    left:'34%', bottom:120,
                    originX:'50%', originY:'50%',
                    borderRadius:'18px 18px 0 0',
                    cursor:'pointer', overflow:'hidden',
                    backdropFilter:'blur(22px)',
                    zIndex: isExpanded ? 15 : 9,
                  }}
                  initial={false}
                  animate={isExpanded ? {
                    x: -440, rotateY: 15, z: 150,
                    width: 800, height: 500,
                    opacity: 1,
                    background:`linear-gradient(160deg,rgba(${dept.a},0.32) 0%,rgba(0,2,18,0.92) 60%)`,
                    border:`1px solid rgba(${dept.a},0.32)`,
                    boxShadow:`0 0 0 1px rgba(${dept.a},0.18), inset 0 0 20px rgba(${dept.a},0.06)`,
} : {
  x:'-50%', rotateY: -angle,
  z: -RADIUS,
  width: PW, height: PH,
  opacity: isHidden ? 0 : 1,
background:`rgba(0,2,12,0.45)`,
border:`1px solid rgba(255,255,255,0.12)`,
boxShadow:`0 0 0 1px rgba(255,255,255,0.06), inset 0 0 20px rgba(255,255,255,0.03)`,
}}
                  transition={{ type:'spring', stiffness:200, damping:28, opacity:{ duration:0.25 } }}
                  whileHover={!expandedCard ? { scale:1.06 } : {}}
                  whileTap={!expandedCard ? { scale:0.95 } : {}}
                  onClick={(e) => { e.stopPropagation(); if (isExpanded) { pickDept(dept); } else { setExpandedCard(dept.id); } }}
                >
                  {/* sweeping sheen */}
                  <div style={{
                    position:'absolute', top:0, width:'55%', height:'100%',
                    background:'linear-gradient(108deg,transparent 0%,rgba(255,255,255,0.055) 50%,transparent 100%)',
                    animation:'cardSweep 6s ease-in-out infinite',
                    animationDelay:`${-(idx*0.75).toFixed(2)}s`, pointerEvents:'none',
                  }}/>
                  {/* top edge glow */}
                  <div style={{
                    position:'absolute', top:0, left:0, right:0, height:2,
                    background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)`,
                    pointerEvents:'none',
                  }}/>
                  {/* left edge accent */}
                  <div style={{
                    position:'absolute', top:0, left:0, bottom:0, width:1.5,
                    background:`linear-gradient(to bottom,rgba(255,255,255,0.12),transparent)`,
                    pointerEvents:'none',
                  }}/>

                  {/* ── NORMAL content (hidden when expanded) ── */}
                  <AnimatePresence>
                    {!isExpanded && (
                      <motion.div
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration:0.2 }}
style={{ display:'flex', flexDirection:'column', height:'100%', padding:'14px 12px 12px' }}
>
  {/* ── top: index + badge ── */}
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
    <span style={{ fontSize:'0.55rem', letterSpacing:'0.10em', color:'rgba(255,255,255,0.38)', fontWeight:600 }}>
      #{String(idx+1).padStart(2,'0')} {dept.id.toUpperCase().slice(0,6)}
    </span>
    <span style={{
      fontSize:'0.46rem', fontWeight:800, letterSpacing:'0.13em', textTransform:'uppercase',
      padding:'3px 7px', borderRadius:4,
background:`rgba(${dept.a},0.16)`,
border:`1px solid rgba(${dept.a},0.58)`,
color:`rgba(${dept.a},1)`,
    }}>
      {dept.label.split(' ')[0]}
    </span>
  </div>

  {/* ── icon — unchanged, same size ── */}
  <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
    <div className="hs-icon-wrap">
      <div className="hs-icon-ring"/>
      <div className="hs-icon-bg">{dept.icon(dept.color)}</div>
    </div>
  </div>

  {/* ── bold title ── */}
  <div style={{
    fontSize:'0.80rem', fontWeight:800, letterSpacing:'0.02em',
    color:'rgba(255,255,255,0.97)', lineHeight:1.2,
    textTransform:'uppercase', marginBottom:4,
    textShadow:'0 1px 10px rgba(0,0,0,0.9)',
  }}>
    {dept.label}
  </div>

  {/* ── colored subtitle ── */}
  <div style={{
    fontSize:'0.56rem', fontWeight:600, letterSpacing:'0.03em',
    color:`rgba(255,255,255,0.45)`, marginBottom:4, lineHeight:1.3,
  }}>
    AI-Powered {dept.label} Module
  </div>

  {/* ── description ── */}
  <div style={{
    fontSize:'0.50rem', color:'rgba(255,255,255,0.35)',
    lineHeight:1.4, letterSpacing:'0.02em',
  }}>
    Manage all {dept.label.toLowerCase()} ops with real-time AI insights.
  </div>

  {/* ── spacer ── */}
  <div style={{ flex:1 }}/>

  {/* ── meta row: person + date ── */}
  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9 }}>
    <span style={{ display:'flex', alignItems:'center', gap:3, color:'rgba(255,255,255,0.42)', fontSize:'0.50rem' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
      AI Agent
    </span>
    <span style={{ display:'flex', alignItems:'center', gap:3, color:'rgba(255,255,255,0.32)', fontSize:'0.50rem' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      2026-06
    </span>
    <span style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.50rem' }}>
      {new Date().toLocaleDateString('en-GB')}
    </span>
  </div>

  {/* ── full-width CTA button ── */}
  <div style={{
    width:'100%', padding:'9px 0', borderRadius:8,
    display:'flex', alignItems:'center', justifyContent:'center', gap:6,
background:`rgba(255,255,255,0.08)`,
border:`1px solid rgba(255,255,255,0.18)`,
color:'rgba(255,255,255,0.85)',
fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
boxShadow:`0 0 16px rgba(255,255,255,0.06)`,
  }}>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
    Enter {dept.label}
  </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── EXPANDED content: floating icons ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration:0.35, delay:0.15 }}
                        style={{ position:'absolute', inset:0 }}
                      >
                        {/* dept label */}
                        <div style={{
                          position:'absolute', top:22, left:22, right:22,
                          fontFamily:"'Cinzel',serif",
                          fontSize:'1.5rem', fontWeight:400, letterSpacing:'0.10em',
                          color:'rgba(255,255,255,0.95)', textShadow:`0 0 20px rgba(${dept.a},0.7)`,
                          textTransform:'uppercase',
                        }}>
                          {dept.label}
                        </div>

                        {/* ── corner floating mini-icons ── */}
                        {floats.slice(0,4).map((fi, i) => (
                          <motion.div key={i} style={{
                            position:'absolute', left:`${fi.x}%`, top:`${fi.y}%`,
                            color:`rgba(${dept.a},0.55)`,
                            filter:`drop-shadow(0 0 6px rgba(${dept.a},0.5))`,
                            pointerEvents:'none',
                          }}
                            animate={{ y:[-8,8,-8], x:[-3,3,-3], rotate:[-5,5,-5], opacity:[0.35,0.7,0.35] }}
                            transition={{ duration:fi.dur, delay:fi.delay, repeat:Infinity, ease:'easeInOut' }}
                          >
                            <svg width={fi.sz*0.75} height={fi.sz*0.75} viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d={fi.d}/>
                            </svg>
                          </motion.div>
                        ))}

                        {/* ── HOLOGRAPHIC CORE ANIMATION ── */}
                        <div style={{
                          position:'absolute', left:'50%', top:'52%',
                          width:0, height:0, pointerEvents:'none',
                        }}>
                          {/* pulse rings × 3 */}
                          {[0, 0.7, 1.4].map((delay,i) => (
                            <div key={i} style={{
                              position:'absolute',
                              width:90, height:90,
                              borderRadius:'50%',
                              border:`1px solid rgba(${dept.a},0.55)`,
                              animation:`hs-pulse-ring 2.2s ease-out ${delay}s infinite`,
                              pointerEvents:'none',
                            }}/>
                          ))}

                          {/* outer orbit ring A */}
                          <div style={{
                            position:'absolute',
                            width:200, height:200,
                            marginLeft:-100, marginTop:-100,
                            borderRadius:'50%',
                            border:`1.5px solid rgba(${dept.a},0.22)`,
                            borderTopColor:`rgba(${dept.a},0.85)`,
                            animation:'hs-spin 4s linear infinite',
                          }}>
                            <div style={{
                              position:'absolute', top:-5, left:'50%', marginLeft:-5,
                              width:10, height:10, borderRadius:'50%',
                              background:`rgba(${dept.a},1)`,
                              boxShadow:`0 0 14px 4px rgba(${dept.a},0.9)`,
                            }}/>
                          </div>

                          {/* outer orbit ring B — tilted, reverse */}
                          <div style={{
                            position:'absolute',
                            width:240, height:240,
                            marginLeft:-120, marginTop:-120,
                            borderRadius:'50%',
                            border:`1px solid rgba(${dept.a},0.16)`,
                            borderBottomColor:`rgba(${dept.a},0.70)`,
                            transform:'rotateX(65deg)',
                            animation:'hs-spin-rev 6s linear infinite',
                          }}>
                            <div style={{
                              position:'absolute', bottom:-5, left:'50%', marginLeft:-4,
                              width:8, height:8, borderRadius:'50%',
                              background:`rgba(${dept.a},0.9)`,
                              boxShadow:`0 0 10px 3px rgba(${dept.a},0.8)`,
                            }}/>
                          </div>

                          {/* inner orbit ring C — perpendicular */}
                          <div style={{
                            position:'absolute',
                            width:160, height:160,
                            marginLeft:-80, marginTop:-80,
                            borderRadius:'50%',
                            border:`1px solid rgba(${dept.a},0.18)`,
                            borderRightColor:`rgba(${dept.a},0.65)`,
                            transform:'rotateY(70deg)',
                            animation:'hs-spin 3s linear infinite',
                          }}>
                            <div style={{
                              position:'absolute', top:'50%', right:-4, marginTop:-4,
                              width:8, height:8, borderRadius:'50%',
                              background:`rgba(${dept.a},0.9)`,
                              boxShadow:`0 0 10px 3px rgba(${dept.a},0.8)`,
                            }}/>
                          </div>

                          {/* radar sweep */}
                          <div style={{
                            position:'absolute',
                            width:160, height:160,
                            marginLeft:-80, marginTop:-80,
                            borderRadius:'50%',
                            background:`conic-gradient(from 0deg, transparent 75%, rgba(${dept.a},0.35) 100%)`,
                            animation:'hs-radar 3s linear infinite',
                          }}/>

                          {/* core icon */}
                          <div style={{
                            '--tc-glow': `rgba(${dept.a},0.55)`,
                            position:'absolute',
                            width:82, height:82,
                            marginLeft:-41, marginTop:-41,
                            borderRadius:20,
                            background:`linear-gradient(135deg,rgba(${dept.a},0.22) 0%,rgba(0,2,14,0.85) 100%)`,
                            border:`1.5px solid rgba(${dept.a},0.55)`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            animation:'hs-core-glow 2.5s ease-in-out infinite',
                            zIndex:2,
                          }}>
                            <div style={{ transform:'scale(1.4)' }}>{dept.icon(dept.color)}</div>
                          </div>
                        </div>

                        {/* status ticker bottom-left */}
                        <div style={{
                          position:'absolute', bottom:18, left:22,
                          display:'flex', flexDirection:'column', gap:5, pointerEvents:'none',
                        }}>
                          {['SYSTEM ONLINE','AI READY','SECURE LINK'].map((txt,i) => (
                            <div key={i} style={{
                              display:'flex', alignItems:'center', gap:6,
                              animation:`hs-ticker 2.4s ease-in-out ${i*0.6}s infinite`,
                            }}>
                              <div style={{
                                width:5, height:5, borderRadius:'50%',
                                background:`rgba(${dept.a},0.9)`,
                                boxShadow:`0 0 6px rgba(${dept.a},1)`,
                              }}/>
                              <span style={{
                                fontSize:'0.58rem', letterSpacing:'0.22em', textTransform:'uppercase',
                                color:`rgba(${dept.a},0.75)`, fontWeight:600,
                              }}>{txt}</span>
                            </div>
                          ))}
                        </div>

                        {/* radial glow */}
                        <div style={{
                          position:'absolute', inset:0, pointerEvents:'none',
                          background:`radial-gradient(ellipse at 50% 52%, rgba(${dept.a},0.18) 0%, transparent 65%)`,
                        }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* ── glossy floor seam ── */}
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:1.5, zIndex:5,
              background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 10%,rgba(255,255,255,0.30) 35%,rgba(255,255,255,0.30) 65%,rgba(255,255,255,0.08) 90%,transparent 100%)',
              boxShadow:'0 0 22px 2px rgba(255,255,255,0.10)',
            }}/>

            {/* ── floor colored light columns ── */}
            {depts.map((dept, idx) => {
              const angle = -(ARC / 2) + idx * (ARC / (N - 1));
              const xPct  = 34 + Math.sin(angle * Math.PI / 180) * 36;
              return (
                <div key={`lc-${dept.id}`} style={{
                  position:'absolute', bottom:0, zIndex:3,
                  left:`${xPct}%`, transform:'translateX(-50%)',
                  width:90, height:210,
                  background:`radial-gradient(ellipse at top, rgba(${dept.a},0.40) 0%, rgba(${dept.a},0.08) 50%, transparent 100%)`,
                  filter:'blur(14px)', pointerEvents:'none',
                }}/>
              );
            })}

            {/* ── floor mirror reflection ── */}
            {depts.map((dept, idx) => {
              const angle  = -(ARC / 2) + idx * (ARC / (N - 1));
              const xPct   = 40 + Math.sin(angle * Math.PI / 180) * 32;
              const scaleX = Math.cos(angle * Math.PI / 180);
              return (
                <div key={`rf-${dept.id}`} style={{
                  position:'absolute', bottom:0, zIndex:4,
                  left:`${xPct}%`, transform:`translateX(-50%) scaleX(${scaleX.toFixed(3)})`,
                  width:PW, height:160, overflow:'hidden', pointerEvents:'none',
                }}>
                  <div style={{
                    position:'absolute', top:0, left:0, right:0, height:'100%',
                    transform:'scaleY(-1)', transformOrigin:'top center',
                    background:`linear-gradient(170deg,rgba(${dept.a},0.22) 0%,rgba(0,2,12,0.80) 55%)`,
                    border:`1px solid rgba(${dept.a},0.22)`, borderTop:'none',
                    WebkitMaskImage:'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.55) 100%)',
                    maskImage:'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.55) 100%)',
                  }}>
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1.5, background:`linear-gradient(90deg,transparent,rgba(${dept.a},0.85),transparent)` }}/>
                  </div>
                </div>
              );
            })}

            {/* ── floor depth fade ── */}
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:220, zIndex:6,
              background:'linear-gradient(to bottom, transparent 0%, rgba(1,1,6,0.78) 100%)',
              pointerEvents:'none',
            }}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          CODE ENTRY PHASE
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'code' && (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            transition={{ duration:0.4 }}
            style={{
              position:'absolute', inset:0, zIndex:30,
              display:'flex', flexDirection:'column',
              justifyContent:'center', alignItems:'flex-start',
              padding:'0 10vw',
            }}
          >
            <button className="hs-back" onClick={() => { setPhase('select'); setCode(''); setErrMsg(''); setExpandedCard(null); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <h1 style={{
              fontFamily:'Cinzel,serif', fontSize:'clamp(1.8rem,3.2vw,3rem)', fontWeight:400,
              letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8,
              background:'linear-gradient(105deg,#1e1b6e,#a855f7,#ec4899,#f97316)',
              backgroundSize:'220% 220%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text', animation:'hs-aurora 6s ease infinite',
            }}>{selDept?.label}</h1>
            <p style={{fontSize:'0.78rem', letterSpacing:'0.18em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:28}}>
              {selDept?.hint}
            </p>
            <form
              className={`hs-cform${shake ? ' hs-shake' : ''}`}
              onSubmit={handleSubmit}
              style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}
            >
              <div style={{position:'relative', display:'inline-flex', alignItems:'center'}}>
                <input
                  ref={inputRef}
                  className={`hs-cinput${errMsg ? ' hs-err' : ''}`}
                  type={showCode ? 'text' : 'password'}
                  value={code}
                  onChange={e => { setCode(e.target.value); setErrMsg(''); }}
                  placeholder="— — — —" maxLength={10} autoComplete="off" spellCheck={false}
                  style={{paddingRight:36}}
                />
                <button type="button" onClick={() => setShowCode(v => !v)}
                  style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:4,color:showCode?'#cc0000':'#444',outline:'none'}}>
                  {showCode
                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  }
                </button>
              </div>
              <div className={`hs-errmsg${errMsg ? ' vis' : ''}`}>{errMsg || ' '}</div>
              <div className="hs-hint">Press Enter to confirm</div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
