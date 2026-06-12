import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Mail, X, FileText } from 'lucide-react';
import Estimator from './Estimator';
import { uploadFile, deleteFile } from '../utils/sp-upload';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Dancing+Script:wght@700&family=Cinzel:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dotPulse { 0%,80%,100%{opacity:0.15} 40%{opacity:1} }
  @keyframes barA1    { 0%,100%{height:20px} 50%{height:68px} }
  @keyframes barA2    { 0%,100%{height:38px} 50%{height:52px} }
  @keyframes barA3    { 0%,100%{height:58px} 50%{height:28px} }
  @keyframes barA4    { 0%,100%{height:28px} 50%{height:72px} }
  @keyframes barA5    { 0%,100%{height:48px} 50%{height:20px} }
  @keyframes floatUD  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes goldFlic { 0%,100%{opacity:0.75} 50%{opacity:1} }
  @keyframes splitGold { 0%,100%{opacity:0.55;box-shadow:0 0 6px rgba(255,200,0,0.25)} 50%{opacity:1;box-shadow:0 0 20px rgba(255,200,0,0.70)} }
  @keyframes robFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
  @keyframes visorScn { 0%{opacity:0;transform:translateY(-22px)} 12%{opacity:0.65} 88%{opacity:0.65} 100%{opacity:0;transform:translateY(22px)} }
  @keyframes callout  { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes coreOrb  { to{transform:rotate(360deg)} }
  @keyframes glowBtn  { 0%,100%{box-shadow:0 0 16px rgba(220,165,0,0.15)} 50%{box-shadow:0 0 36px rgba(220,165,0,0.38)} }
  @keyframes notifIn  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes notifOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(32px)} }
  @keyframes dashFlyLeft  { 0%{opacity:0;transform:translateX(-140px) translateY(50px) scale(0.70) rotate(-10deg)} 70%{transform:translateX(8px) translateY(-4px) scale(1.02) rotate(0.5deg)} 100%{opacity:1;transform:translateX(0) translateY(0) scale(1) rotate(0deg)} }
  @keyframes dashFlyRight { 0%{opacity:0;transform:translateX(140px) translateY(50px) scale(0.70) rotate(10deg)}  70%{transform:translateX(-8px) translateY(-4px) scale(1.02) rotate(-0.5deg)} 100%{opacity:1;transform:translateX(0) translateY(0) scale(1) rotate(0deg)} }
  @keyframes dashFlyUp    { 0%{opacity:0;transform:translateY(-100px) scale(0.72) rotate(-6deg)} 70%{transform:translateY(6px) scale(1.02) rotate(0.3deg)} 100%{opacity:1;transform:translateY(0) scale(1) rotate(0deg)} }
  @keyframes dashFlyDown  { 0%{opacity:0;transform:translateY(110px) scale(0.72) rotate(5deg)}  70%{transform:translateY(-6px) scale(1.02) rotate(-0.3deg)} 100%{opacity:1;transform:translateY(0) scale(1) rotate(0deg)} }
  @keyframes dashHdrIn    { 0%{opacity:0;transform:translateY(-28px) scale(0.92)} 70%{transform:translateY(4px) scale(1.01)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes tlProgressIn { from{width:0} }
  @keyframes tlShimmer    { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes tlNodePop    { 0%{transform:scale(0.4);opacity:0} 65%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
  @keyframes tlRipple     { 0%{transform:scale(1);opacity:0.65} 100%{transform:scale(2.6);opacity:0} }
  @keyframes tileGlow   { 0%,100%{opacity:0.28} 50%{opacity:0.55} }
  @keyframes drawRect   { from{stroke-dashoffset:220;opacity:0} to{stroke-dashoffset:0;opacity:1} }
  @keyframes drawLine   { from{stroke-dashoffset:80;opacity:0}  to{stroke-dashoffset:0;opacity:1} }
  @keyframes spinIn     { from{transform:rotate(-90deg) scale(0.4);opacity:0} 75%{transform:rotate(5deg) scale(1.06)} to{transform:rotate(0deg) scale(1);opacity:1} }
  @keyframes tileIconIn { 0%{opacity:0;transform:scale(0.72) rotate(-8deg)} 72%{transform:scale(1.06) rotate(1deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }

  .root {
    position:fixed; inset:0; width:100vw; height:100vh; z-index:100;
    background:url('/AI_ESTIMATION1.jpeg') center/cover no-repeat;
    font-family:'Inter',sans-serif; color:#e2e8f0; overflow:hidden;
  }
  .veil {
    position:absolute; inset:0;
    background:rgba(0,1,3,0.70);
    pointer-events:none;
  }

  /* ── LANDING ── */
  .land {
    position:relative; width:100%; height:100%;
    display:flex; animation:fadeUp 0.6s ease both;
    padding-top: 52px;
  }
  .left-col {
    width:50%; height:100%;
    display:flex; flex-direction:column; justify-content:center;
    padding:0 3vw 0 10vw; position:relative; z-index:10; overflow:visible;
  }
  .right-col {
    width:56%; height:100%;
    position:relative; overflow:hidden;
  }
  .dot-nav {
    position:absolute; left:22px; top:50%; transform:translateY(-50%);
    display:flex; flex-direction:column; gap:14px; z-index:20;
  }
  .nav-d {
    width:4px; height:4px; border-radius:50%;
    background:rgba(255,255,255,0.22); transition:all 0.2s;
  }
  .nav-d.on { background:rgba(255,255,255,0.75); transform:scale(1.5); }

  .brand { font-size:0.62rem; letter-spacing:0.28em; text-transform:uppercase; margin-bottom:28px; font-weight:700;
    background: linear-gradient(105deg, #1e1b6e 0%, #3730a3 18%, #6d28d9 36%, #a855f7 50%, #ec4899 66%, #f97316 82%, #fbbf24 100%);
    background-size: 250% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 1px 8px rgba(109,40,217,0.55));
    animation: auroraShift 6s ease infinite; }

  .page-title { font-size:clamp(2.4rem,4.5vw,4.2rem); font-weight:400; font-family:'Georgia','Times New Roman',serif; letter-spacing:0.04em; text-transform:uppercase; line-height:1.1; margin-bottom:10px; margin-top:-14px;
    background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(210,228,255,0.90) 25%, rgba(255,255,255,0.65) 50%, rgba(190,215,255,0.92) 75%, rgba(255,255,255,0.80) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 12px rgba(160,200,255,0.45)); }
  .page-sub { font-size:0.82rem; letter-spacing:0.04em; margin-bottom:44px; font-weight:400; line-height:1.7; max-width:280px;
    background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(200,220,255,0.65) 40%, rgba(255,255,255,0.45) 65%, rgba(180,210,255,0.70) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 1px 5px rgba(160,200,255,0.25)); }

  .btn-new {
    position: relative; overflow: hidden;
    display:inline-flex; align-items:center; gap:10px;
    background: linear-gradient(105deg,
      #1e1b6e 0%, #3730a3 18%, #6d28d9 36%,
      #a855f7 50%, #ec4899 66%, #f97316 82%, #fbbf24 100%);
    background-size: 220% 220%;
    animation: auroraShift 5s ease-in-out infinite;
    border: 1px solid rgba(255,255,255,0.22);
    color: #fff;
    padding:13px 30px; border-radius:100px; cursor:pointer;
    font-size:0.86rem; font-weight:600; font-family:'Inter',sans-serif;
    letter-spacing:0.07em;
    box-shadow: 0 8px 36px rgba(109,40,217,0.5), 0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: transform 0.25s, box-shadow 0.25s;
    width:fit-content; margin-bottom:34px;
  }
  .btn-new::before {
    content:''; position:absolute; inset:0; border-radius:100px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 55%, transparent 100%);
    pointer-events:none;
  }
  .btn-new::after {
    content:''; position:absolute;
    top:0; left:-80%; width:55%; height:100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    animation: glassSheen 3.5s ease-in-out infinite;
    pointer-events:none; border-radius:100px;
  }
  .btn-new:hover { transform:translateY(-3px); box-shadow: 0 14px 50px rgba(109,40,217,0.7), 0 4px 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2); }
  .btn-new:active { transform:translateY(-1px); }
  .btn-new .arr { font-size:1rem; opacity:0.8; }

  .s-lbl { font-size:0.65rem; letter-spacing:0.18em; text-transform:uppercase; margin-bottom:10px; font-weight:600;
    background: linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(200,220,255,0.70) 40%, rgba(255,255,255,0.50) 65%, rgba(180,210,255,0.75) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 1px 5px rgba(160,200,255,0.30)); }
  .s-bar {
    display:flex; align-items:center;
    background: rgba(255,255,255,0.07);
    border:1px solid rgba(255,255,255,0.18);
    border-radius:100px; width:min(380px,90%); overflow:hidden;
    backdrop-filter: blur(18px) saturate(1.4);
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2);
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .s-bar:focus-within {
    border-color: rgba(251,191,36,0.55);
    box-shadow: 0 4px 28px rgba(0,0,0,0.4), 0 0 0 3px rgba(251,191,36,0.12), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .s-bar .ico { padding:0 14px; display:flex; align-items:center; opacity:0.4; flex-shrink:0; }
  .s-bar input { flex:1; background:transparent; border:none; outline:none; color:rgba(255,255,255,0.85); font-family:'Inter',sans-serif; font-size:0.84rem; padding:13px 0; }
  .s-bar input::placeholder { color:rgba(255,255,255,0.25); }
  .s-bar .sent { background:transparent; border:none; border-left:1px solid rgba(255,255,255,0.1); padding:10px 16px; cursor:pointer; color:rgba(255,255,255,0.4); font-family:'Inter',sans-serif; font-size:0.8rem; font-weight:500; letter-spacing:0.07em; transition:color 0.2s; white-space:nowrap; margin:4px; border-radius:100px; }
  .s-bar .sent:hover { color:rgba(251,191,36,0.9); }

  /* ── FORM PANEL ── */
  .form-panel { width:min(800px,96vw); max-height:calc(100vh - 32px); overflow-y:auto; background:rgba(0,8,14,0.88); border:1px solid rgba(200,145,0,0.2); border-radius:8px; backdrop-filter:blur(20px); padding:30px 34px 34px; animation:fadeUp 0.4s ease both; scrollbar-width:thin; scrollbar-color:rgba(200,145,0,0.2) transparent; }
  .form-panel::-webkit-scrollbar{width:4px}
  .form-panel::-webkit-scrollbar-thumb{background:rgba(200,145,0,0.2);border-radius:4px}
  .form-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:14px; border-bottom:1px solid rgba(200,145,0,0.12); }
  .form-title { font-size:0.95rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(220,165,0,0.85); }
  .back-btn { background:transparent; border:none; cursor:pointer; color:rgba(148,163,184,0.55); font-family:'Inter',sans-serif; font-size:0.8rem; transition:color 0.2s; }
  .back-btn:hover { color:rgba(220,165,0,0.8); }
  .sec-lbl { font-size:0.65rem; letter-spacing:0.16em; text-transform:uppercase; color:rgba(200,145,0,0.45); font-weight:600; margin:18px 0 9px; }
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
  .ga{display:grid;grid-template-columns:1fr auto;gap:10px}
  .fld{display:flex;flex-direction:column;gap:5px}
  .fld label{font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(200,160,80,0.45);font-weight:600}
  .fld input{background:rgba(0,10,18,0.7);border:1px solid rgba(200,145,0,0.18);border-radius:4px;padding:10px 13px;color:#e2e8f0;font-family:'Inter',sans-serif;font-size:0.87rem;outline:none;transition:border-color 0.2s;}
  .fld input:focus{border-color:rgba(220,165,0,0.5)}
  .fld input::placeholder{color:rgba(148,163,184,0.25)}
  .toggle{display:flex;background:rgba(0,10,18,0.7);border:1px solid rgba(200,145,0,0.18);border-radius:4px;overflow:hidden;height:42px;min-width:210px;flex-shrink:0;}
  .topt{flex:1;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.78rem;font-weight:500;font-family:'Inter',sans-serif;transition:all 0.25s;white-space:nowrap;padding:0 10px;user-select:none;}
  .topt.jih{background:rgba(200,160,0,0.22);color:#FFD700;border-right:1px solid rgba(200,160,0,0.22)}
  .topt.tend{background:rgba(0,150,120,0.18);color:#4fffdf}
  .topt.off{color:rgba(148,163,184,0.38)}
  .upload-zone{border:1px dashed rgba(200,145,0,0.25);border-radius:6px;padding:26px 22px;cursor:pointer;background:rgba(0,10,18,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;text-align:center;transition:all 0.25s;}
  .upload-zone:hover,.upload-zone.drag{border-color:rgba(220,165,0,0.5);background:rgba(200,145,0,0.04)}
  .file-chip{display:flex;align-items:center;gap:8px;background:rgba(0,12,22,0.75);border:1px solid rgba(200,145,0,0.18);border-radius:4px;padding:7px 11px;font-size:0.78rem;}
  .sub-btn{background:rgba(20,14,0,0.85);border:1px solid rgba(200,145,0,0.45);color:#e2e8f0;padding:13px 66px;border-radius:5px;cursor:pointer;font-family:'Inter',sans-serif;font-size:0.92rem;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;transition:all 0.3s;}
  .sub-btn:hover{border-color:rgba(220,175,0,0.7);transform:translateY(-1px);box-shadow:0 4px 24px rgba(200,145,0,0.2)}

  /* ── TOP SEARCH BAR ── */
  .top-sb{position:absolute;top:26px;left:50%;transform:translateX(-50%);z-index:50;width:min(500px,88vw);}

  /* ── LOADING ── */
  .lc{display:flex;flex-direction:column;align-items:center;gap:22px;animation:fadeUp 0.5s ease both;padding-top:64px}
  .qid{font-size:clamp(2rem,5vw,3rem);font-weight:700;letter-spacing:0.14em;color:rgba(90,155,220,0.9);text-align:center}
  .qsub{font-size:0.98rem;color:rgba(155,175,200,0.75);text-align:center;line-height:1.7;max-width:460px}
  .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:rgba(80,140,210,0.9);margin:0 3px}
  .d1{animation:dotPulse 1.4s 0s infinite}.d2{animation:dotPulse 1.4s 0.2s infinite}.d3{animation:dotPulse 1.4s 0.4s infinite}
  .lrow{display:flex;align-items:center;gap:68px;margin-top:8px}
  .bars{display:flex;align-items:flex-end;gap:7px;height:78px}
  .bar{width:12px;border-radius:3px 3px 0 0;background:linear-gradient(to top,rgba(30,70,140,0.5),rgba(80,145,225,0.9))}
  .b1{animation:barA1 1.4s 0s ease-in-out infinite}.b2{animation:barA2 1.4s .15s ease-in-out infinite}
  .b3{animation:barA3 1.4s .3s ease-in-out infinite}.b4{animation:barA4 1.4s .45s ease-in-out infinite}.b5{animation:barA5 1.4s .6s ease-in-out infinite}

  /* ── RESULTS ── */
  .rw{display:flex;flex-direction:column;gap:18px;padding-top:68px;animation:fadeUp 0.5s ease both;max-width:640px;width:90vw}
  .rid{font-size:clamp(2rem,5vw,3rem);font-weight:700;letter-spacing:0.12em;color:rgba(90,155,220,0.9)}
  .rsub{font-size:0.93rem;color:rgba(150,170,195,0.75);line-height:1.7;max-width:420px}
  .dl-row{display:flex;align-items:center;flex-wrap:wrap;gap:11px;margin-top:6px}
  .dl-lbl{font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(120,150,185,0.55);width:100%}
  .dl-btn{display:flex;align-items:center;gap:8px;background:rgba(5,15,30,0.85);border:1px solid rgba(70,110,180,0.3);border-radius:5px;padding:11px 22px;cursor:pointer;color:rgba(180,205,235,0.9);font-family:'Inter',sans-serif;font-size:0.88rem;font-weight:500;transition:all 0.25s;}
  .dl-btn:hover{border-color:rgba(90,145,220,0.65);background:rgba(60,100,180,0.1);transform:translateY(-1px)}
  .email-row{display:flex;background:rgba(5,15,30,0.85);border:1px solid rgba(70,110,180,0.28);border-radius:5px;overflow:hidden;transition:border-color 0.25s;}
  .email-row:focus-within{border-color:rgba(90,145,220,0.55)}
  .email-row input{flex:1;background:transparent;border:none;outline:none;padding:11px 15px;color:rgba(190,210,235,0.9);font-family:'Inter',sans-serif;font-size:0.84rem;min-width:0}
  .email-row input::placeholder{color:rgba(130,160,195,0.35)}
  .email-row button{background:rgba(60,100,180,0.14);border:none;border-left:1px solid rgba(70,110,180,0.25);padding:11px 14px;cursor:pointer;display:flex;align-items:center;transition:background 0.2s;}
  .email-row button:hover{background:rgba(80,130,210,0.22)}
  .fold-fl{position:absolute;bottom:7%;left:5%;animation:floatUD 4s ease-in-out infinite;z-index:5}

  /* ── NAV BAR ── */
  .nav-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 28px;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    z-index: 500;
  }
  .nav-brand {
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.85);
    white-space: nowrap;
    margin-right: 28px;
    flex-shrink: 0;
  }
  .nav-pills {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 50px;
    padding: 3px;
    gap: 1px;
  }
  @keyframes navShimmer {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes cardAura {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes cardSweep {
    0%   { transform: translateX(-120%) skewX(-20deg); opacity:0; }
    12%  { opacity: 0.7; }
    88%  { opacity: 0.7; }
    100% { transform: translateX(320%) skewX(-20deg); opacity:0; }
  }
  @keyframes navSpark {
    0%   { transform: translateX(-100%) skewX(-18deg); opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
  }
  /* ── Arch-tab buttons (AI Tool Direct & Cost-Artist) ── */
  .arch-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px 28px 12px;
    border-radius: 26px 26px 0 0;
    border: 1.5px solid rgba(168,85,247,0.40);
    border-bottom: none;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.22s;
    overflow: visible;
  }
  .arch-tab::before,
  .arch-tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 14px;
    height: 14px;
    pointer-events: none;
  }
  .arch-tab::before {
    left: -14px;
    border-radius: 0 0 100% 0;
    box-shadow: 5px 5px 0 5px rgba(168,85,247,0.40);
    clip-path: inset(0 0 0 5px);
  }
  .arch-tab::after {
    right: -14px;
    border-radius: 0 0 0 100%;
    box-shadow: -5px 5px 0 5px rgba(168,85,247,0.40);
    clip-path: inset(0 5px 0 0);
  }
  .arch-tab-tool {
    background: rgba(10,6,30,0.92);
    color: rgba(200,160,255,0.95);
    box-shadow: 0 -4px 20px rgba(168,85,247,0.18), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .arch-tab-tool:hover {
    background: linear-gradient(135deg,rgba(109,40,217,0.70),rgba(168,85,247,0.60),rgba(236,72,153,0.50));
    color: #fff;
    border-color: rgba(168,85,247,0.75);
    box-shadow: 0 -6px 28px rgba(168,85,247,0.40);
  }
  .arch-tab-cost {
    background: rgba(10,18,40,0.92);
    color: rgba(120,220,255,0.92);
    border-color: rgba(0,200,255,0.40);
    box-shadow: 0 -4px 20px rgba(0,200,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .arch-tab-cost::before {
    box-shadow: 5px 5px 0 5px rgba(0,200,255,0.40);
  }
  .arch-tab-cost::after {
    box-shadow: -5px 5px 0 5px rgba(0,200,255,0.40);
  }
  .arch-tab-cost:hover {
    background: linear-gradient(135deg,rgba(0,100,180,0.55),rgba(0,200,255,0.40));
    color: #fff;
    border-color: rgba(0,200,255,0.75);
    box-shadow: 0 -6px 28px rgba(0,200,255,0.35);
  }

  .nav-btn {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.42);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    padding: 7px 18px;
    border-radius: 50px;
    cursor: pointer;
    transition: color 0.22s, background 0.22s, box-shadow 0.22s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .nav-btn:not(.active):hover {
    color: rgba(255,255,255,0.88);
    background: rgba(255,255,255,0.07);
  }
  .nav-btn.active {
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.06em;
    border: none;
    background: linear-gradient(120deg,
      rgba(99,102,241,0.65),
      rgba(139,92,246,0.60),
      rgba(236,72,153,0.52),
      rgba(6,182,212,0.55),
      rgba(99,102,241,0.65));
    background-size: 300% 300%;
    animation: navShimmer 5s ease infinite;
    box-shadow:
      0 0 24px rgba(139,92,246,0.52),
      0 4px 20px rgba(0,0,0,0.55);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    text-shadow: 0 1px 8px rgba(180,140,255,0.55);
  }
  .nav-btn.active::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 38%;
    height: 100%;
    background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
    border-radius: 50px;
    animation: navSpark 3s ease-in-out infinite;
    pointer-events: none;
  }
  .nav-back {
    margin-left: auto;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.4);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    padding: 7px 20px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.22s;
    white-space: nowrap;
  }
  .nav-back:hover { color: #fff; border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.07); }

  /* ── FORM (glassy redesign) ── */
  .form-page {
    position: relative; width: 100%; height: 100%;
    overflow: hidden;
  }
  /* AIBOT2 — left panel */
  .form-left {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 40%;
    background: url('/AIBOT2.png') left center / cover no-repeat;
    display: flex; flex-direction: column;
    justify-content: flex-start;
    padding: 78px 28px 36px 28px;
    overflow: hidden;
  }
  .form-left::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(0,5,20,0.18) 0%, rgba(0,5,20,0.80) 100%);
    pointer-events: none; z-index: 0;
  }
  .form-left > * { position: relative; z-index: 1; }
  .form-left h2 {
    font-size: clamp(1.6rem, 2.8vw, 2.4rem);
    font-weight: 700;
    color: rgba(255,255,255,0.92);
    letter-spacing: 0.02em;
    line-height: 1.2;
  }
  .form-left .sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.38);
    font-weight: 300;
    margin-top: 6px;
  }
  .upload-glass {
    border: 1.5px dashed rgba(255,255,255,0.2);
    border-radius: 16px;
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 20px; cursor: pointer;
    transition: all 0.25s;
    padding: 64px 32px;
    text-align: center;
    flex: 1;
    min-height: 0;
  }
  .upload-glass:hover, .upload-glass.drag {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.07);
  }
  .upload-glass .u-icon { color: rgba(255,255,255,0.5); }
  .upload-glass .u-text { font-size: 0.9rem; color: rgba(255,255,255,0.4); line-height: 1.6; }
  .upload-glass .u-text b { color: rgba(255,255,255,0.75); font-weight: 600; }
  .form-right {
    position: absolute; left: 40%; right: 0; top: 58px; bottom: 0;
    display: flex; flex-direction: column; gap: 7px;
    overflow: hidden;
    padding: 60px 44px 14px 36px;
  }
  .form-right::-webkit-scrollbar { display: none; }
  .form-right-hdr {
    display: flex; flex-direction: row; align-items: flex-start; justify-content: space-between;
    margin-bottom: 4px; padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    gap: 12px;
    flex-shrink: 0;
  }
  .form-right-hdr-text { display: flex; flex-direction: column; gap: 3px; }
  .form-right-hdr .fr-label {
    font-size: 0.6rem; letter-spacing: 0.24em; text-transform: uppercase;
    font-weight: 700;
    background: linear-gradient(135deg,
      rgba(255,255,255,0.95) 0%,
      rgba(200,220,255,0.80) 30%,
      rgba(255,255,255,0.55) 55%,
      rgba(180,210,255,0.85) 80%,
      rgba(255,255,255,0.70) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 1px 6px rgba(160,200,255,0.35));
  }
  .form-right-hdr h3 {
    font-size: clamp(1.3rem, 2.2vw, 1.8rem); font-weight: 700;
    color: rgba(255,255,255,0.88); letter-spacing: 0.03em; margin: 0;
  }
  .form-right-hdr p {
    font-size: 0.74rem; color: rgba(255,255,255,0.32);
    font-weight: 300; line-height: 1.5; margin: 0;
  }
  .glass-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 15px 20px;
    color: rgba(255,255,255,0.90);
    font-family: 'Inter', sans-serif;
    font-size: 1.02rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    backdrop-filter: blur(6px);
  }
  .glass-input:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.09); }
  .glass-input::placeholder { color: rgba(255,255,255,0.28); }
  select.glass-input option, select.glass-input optgroup { background: #0a061e; color: rgba(255,255,255,0.85); }
  .glass-textarea {
    width: 100%; min-height: 68px; resize: none;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 15px 20px;
    color: rgba(255,255,255,0.90);
    font-family: 'Inter', sans-serif;
    font-size: 1.02rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .glass-textarea:focus { border-color: rgba(255,255,255,0.3); }
  .glass-textarea::placeholder { color: rgba(255,255,255,0.28); }
  .two-col-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .three-col-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .type-lead-row { display: flex; gap: 10px; align-items: center; }
  .type-lead-row .type-row { flex-shrink: 0; }
  .date-field-wrap {
    flex: 1; display: flex; align-items: center; gap: 8px;
    padding: 0 12px; cursor: text;
  }
  .date-field-lbl {
    font-size: 0.85rem; color: rgba(255,255,255,0.38);
    white-space: nowrap; font-family: 'Inter', sans-serif; flex-shrink: 0;
  }
  .date-inner {
    flex: 1; background: transparent; border: none; outline: none;
    color: rgba(255,255,255,0.75); font-family: 'Inter', sans-serif;
    font-size: 0.92rem; padding: 11px 0; min-width: 0;
  }
  .remarks-box { flex: none; min-height: 0; height: 72px; resize: none; }
  .submit-glass { flex-shrink: 0; }
  .check-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; padding: 2px 0; }
  .glass-check {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 0.92rem; color: rgba(255,255,255,0.65);
    user-select: none;
  }
  .glass-check input[type="checkbox"] { display: none; }
  .glass-check .check-box {
    width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
    border: 1.5px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(8px);
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .glass-check input:checked + .check-box {
    background: linear-gradient(135deg, #fbbf24 0%, #ec4899 100%);
    border-color: transparent;
    box-shadow: 0 0 12px rgba(251,191,36,0.5), 0 0 6px rgba(236,72,153,0.3);
  }
  .glass-check input:checked + .check-box::after {
    content: ''; position: absolute;
    left: 5px; top: 2px; width: 5px; height: 9px;
    border: 2px solid #fff; border-top: none; border-left: none;
    transform: rotate(45deg);
  }
  .type-row {
    display: flex; align-items: center; gap: 10px;
  }
  .type-lbl {
    font-size: 0.85rem; color: rgba(255,255,255,0.45);
    font-weight: 500; white-space: nowrap;
  }
  .type-select {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 13px 14px;
    color: rgba(255,255,255,0.75);
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .type-select option { background: #111; }
  /* Glow toggle */
  .glow-toggle {
    position: relative; display: flex;
    background: rgba(20,20,35,0.75);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50px; overflow: hidden;
    flex-shrink: 0;
  }
  .glow-pill {
    position: absolute; top: 3px; bottom: 3px;
    width: calc(50% - 3px);
    border-radius: 50px;
    transition: left 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s, box-shadow 0.35s;
    pointer-events: none;
    z-index: 0;
  }
  .glow-pill.jih {
    left: 3px;
    background: linear-gradient(105deg, #fbbf24 0%, #fcd34d 80%, #ec4899 100%);
    background-size: 220% 220%;
    animation: auroraShift 5s ease-in-out infinite;
    box-shadow: 0 0 22px rgba(251,191,36,0.7), 0 0 10px rgba(236,72,153,0.3);
  }
  .glow-pill.tender {
    left: calc(50%);
    background: linear-gradient(105deg, #fbbf24 0%, #fcd34d 80%, #ec4899 100%);
    background-size: 220% 220%;
    animation: auroraShift 5s ease-in-out infinite;
    box-shadow: 0 0 22px rgba(251,191,36,0.7), 0 0 10px rgba(236,72,153,0.3);
  }
  .glow-toggle button {
    flex: 1; position: relative; z-index: 1;
    background: transparent; border: none;
    padding: 11px 16px;
    color: rgba(255,255,255,0.4);
    font-family: 'Inter', sans-serif; font-size: 0.90rem;
    cursor: pointer; transition: color 0.25s;
    white-space: nowrap; font-weight: 500;
  }
  .glow-toggle button.sel { color: rgba(255,255,255,0.95); font-weight: 600; }

  /* Relax screen */
  @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes imgFadeIn   { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
  .relax-screen {
    position: fixed; inset: 0;
    width: 100vw; height: 100vh;
    display: flex; padding-top: 58px;
    z-index: 300;
    background: url('/AI_ESTIMATION1.jpeg') center/cover no-repeat;
  }
  .relax-screen::before {
    content:''; position:absolute; inset:0;
    background: rgba(0,0,0,0.55); pointer-events:none; z-index:0;
  }
  .relax-left {
    position: relative; z-index: 1;
    width: 46%; height: 100%;
    background: transparent;
    display: flex; flex-direction: column;
    justify-content: center; padding: 0 8% 0 12%;
    gap: 28px;
  }
  .relax-right {
    position: relative; z-index: 1;
    width: 54%; height: 100%;
    overflow: hidden;
    background: transparent;
  }
  .relax-img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    display: block;
    opacity: 0;
    transition: opacity 1.6s ease;
  }
  .relax-img.visible { opacity: 1; animation: imgFadeIn 1.6s ease both; }
  .type-cursor {
    display: inline-block;
    width: 2px; height: 1.1em;
    background: rgba(255,255,255,0.85);
    margin-left: 3px;
    vertical-align: middle;
    animation: cursorBlink 0.75s step-end infinite;
    border-radius: 1px;
  }

  /* ── SEARCH STATUS VIEWS ── */
  .est-wm-upper {
    position: absolute; left: 50%; top: 110px;
    transform: translateX(-50%);
    font-size: clamp(4rem,12vw,9rem);
    font-weight: 900; letter-spacing: 0.2em;
    color: rgba(60,100,170,0.13); text-transform: uppercase;
    pointer-events: none; user-select: none; white-space: nowrap; z-index: 1;
  }
  .search-pg-lbl {
    font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(100,140,190,0.6); font-weight: 600;
  }
  @keyframes auroraShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes glassSheen { 0%{left:-80%} 100%{left:160%} }
  .submit-glass {
    position: relative; overflow: hidden;
    width: 100%; padding: 11px 36px;
    border-radius: 100px;
    background: linear-gradient(105deg,
      #1e1b6e 0%, #3730a3 18%, #6d28d9 36%,
      #a855f7 50%, #ec4899 66%, #f97316 82%, #fbbf24 100%);
    background-size: 220% 220%;
    animation: auroraShift 5s ease-in-out infinite;
    border: 1px solid rgba(255,255,255,0.22);
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 1rem; font-weight: 600;
    letter-spacing: 0.05em;
    cursor: pointer;
    box-shadow: 0 8px 36px rgba(109,40,217,0.5), 0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: transform 0.25s, box-shadow 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 2px;
  }
  /* frosted glass top highlight */
  .submit-glass::before {
    content: ''; position: absolute; inset: 0; border-radius: 100px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 55%, transparent 100%);
    pointer-events: none;
  }
  /* moving sheen */
  .submit-glass::after {
    content: ''; position: absolute;
    top: 0; left: -80%; width: 55%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    animation: glassSheen 3.5s ease-in-out infinite;
    pointer-events: none; border-radius: 100px;
  }
  .submit-glass:hover { transform: translateY(-3px); box-shadow: 0 14px 50px rgba(109,40,217,0.7), 0 4px 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2); }
  .submit-glass:active { transform: translateY(-1px); }
  @keyframes goldText { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes auroraFadeIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
  @keyframes introBotUp { from{opacity:0;transform:translateY(28px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  .btn-text-glow {
    color: rgba(255,255,255,0.95);
    font-weight: 700;
    text-shadow: 0 0 18px rgba(255,255,255,0.35), 0 1px 4px rgba(0,0,0,0.3);
  }
  .brand-text-glow {
    background: linear-gradient(105deg, #1e1b6e 0%, #3730a3 18%, #6d28d9 36%, #a855f7 50%, #ec4899 66%, #f97316 82%, #fbbf24 100%);
    background-size: 250% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: auroraShift 6s ease infinite;
    font-weight: 700;
  }
  .file-chip-g {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px; padding: 7px 12px; font-size: 0.8rem;
    color: rgba(255,255,255,0.7);
  }

  /* ── SALES STATUS VIEW ── */
  .ss-page {
    position: absolute; inset: 0; top: 0;
    display: flex; flex-direction: column;
    padding: 74px 40px 24px;
    overflow: hidden;
    animation: fadeUp 0.4s ease both;
  }
  .ss-hdr {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-shrink: 0;
  }
  .ss-title {
    font-size: 1.1rem; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase;
    background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(200,220,255,0.80) 40%, rgba(255,255,255,0.60) 70%, rgba(180,210,255,0.85) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .ss-count {
    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); font-weight: 600;
  }
  .ss-table-wrap {
    flex: 1; overflow-y: auto; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,4,12,0.55);
    backdrop-filter: blur(14px);
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent;
  }
  .ss-table-wrap::-webkit-scrollbar { width: 4px; }
  .ss-table-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
  .ss-table { width: 100%; border-collapse: collapse; }
  .ss-table thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.07);
    position: sticky; top: 0; z-index: 2;
    background: rgba(0,4,14,0.80); backdrop-filter: blur(14px);
  }
  .ss-table th {
    text-align: left; padding: 11px 16px;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
  }
  .ss-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.18s;
  }
  .ss-table tbody tr:hover { background: rgba(255,255,255,0.03); }
  .ss-table td {
    padding: 11px 16px;
    font-size: 0.85rem; color: rgba(255,255,255,0.72);
    vertical-align: middle;
  }
  .ss-id { font-weight: 700; letter-spacing: 0.08em; color: rgba(180,210,255,0.85); font-size: 0.82rem; }
  .ss-status-select {
    appearance: none;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 50px;
    padding: 7px 32px 7px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.80);
    cursor: pointer; outline: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 11px center;
    transition: border-color 0.2s, background 0.2s;
    min-width: 130px;
  }
  .ss-status-select option { background: #0d1117; }
  .ss-status-select.won   { border-color: rgba(34,197,94,0.55);  color: #4ade80; background-color: rgba(34,197,94,0.10); }
  .ss-status-select.lost  { border-color: rgba(239,68,68,0.55);  color: #f87171; background-color: rgba(239,68,68,0.10); }
  .ss-status-select.follow-up  { border-color: rgba(251,191,36,0.55); color: #fbbf24; background-color: rgba(251,191,36,0.09); }
  .ss-status-select.risk, .ss-status-select.risky { border-color: rgba(249,115,22,0.55); color: #fb923c; background-color: rgba(249,115,22,0.10); }
  .ss-status-select.pending { border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.45); }
  .ss-ts {
    font-size: 0.72rem; color: rgba(255,255,255,0.28); letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .ss-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em;
    padding: 3px 10px; border-radius: 50px;
    text-transform: uppercase;
  }
  .ss-badge.won  { background: rgba(34,197,94,0.12);  border: 1px solid rgba(34,197,94,0.3);  color: #4ade80; }
  .ss-badge.lost { background: rgba(239,68,68,0.12);  border: 1px solid rgba(239,68,68,0.3);  color: #f87171; }
  .ss-badge.follow-up { background: rgba(251,191,36,0.10); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24; }
  .ss-badge.risk, .ss-badge.risky { background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.3); color: #fb923c; }
  .ss-badge.pending { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.38); }
  @keyframes ssRowFlash { 0%{background:rgba(168,85,247,0.12)} 100%{background:transparent} }
  .ss-flash { animation: ssRowFlash 0.8s ease-out; }

  /* ── AIBOT background image ── */
  .land-aibot { opacity:1;transition:opacity 0.3s }

  /* ── OPEN REQUESTS LAYOUT ── */
  .or-layout { position:relative;width:100%;height:100%;display:flex;flex-direction:row }
  .or-main   { flex:1;min-width:0;overflow-y:auto;padding:64px 32px 16px }
  .or-team   { flex-shrink:0;height:16vh;min-height:110px;border-top:1px solid rgba(255,255,255,0.06);
    background:rgba(4,2,14,0.72);backdrop-filter:blur(14px);
    padding:10px 28px 10px;display:flex;flex-direction:column;gap:0;overflow:hidden }

  /* ── LANDING 3-BUTTON ROW ── */
  .land-btns { display:flex;flex-direction:row;gap:8px;margin-bottom:34px }

  /* ═══════════════════════════════════════════════
     RESPONSIVE — Mobile-first breakpoints
  ═══════════════════════════════════════════════ */

  /* ── Tablet & below (≤ 1024px) ── */
  @media (max-width: 1024px) {
    .left-col  { width:55%;padding:0 3vw 0 6vw }
    .right-col { width:45% }
    .form-right { padding:52px 28px 14px 24px }
    .or-team  { height:16vh;min-height:100px;padding:8px 18px 8px }
  }

  /* ── Mobile landscape + small tablet (≤ 768px) ── */
  @media (max-width: 768px) {
    /* Landing */
    .land { flex-direction:column;padding-top:60px;overflow-y:auto;height:auto;min-height:100% }
    .left-col  { width:100%;padding:24px 20px 0;height:auto;justify-content:flex-start }
    .right-col { display:none }
    .page-title { font-size:2.4rem }
    .page-sub { margin-bottom:24px }
    .land-btns { flex-direction:column;gap:8px;margin-bottom:20px }
    .btn-new { width:100%;padding:12px 20px;justify-content:center }
    .s-bar   { width:100% }
    .top-sb  { width:calc(100vw - 24px) }

    /* Nav */
    .nav-bar { height:auto;min-height:58px;flex-wrap:wrap;padding:8px 14px;gap:6px }
    .nav-pills { overflow-x:auto;scrollbar-width:none;max-width:100%;order:10;width:100%;
      padding:4px;margin-top:2px }
    .nav-pills::-webkit-scrollbar { display:none }
    .nav-btn { padding:6px 12px;font-size:0.72rem }
    .nav-back { margin-left:auto }

    /* Forms */
    .form-page { overflow-y:auto }
    .form-left  { display:none }
    .form-right { position:relative;left:0;top:0;width:100%;padding:70px 18px 20px;overflow-y:auto }
    .two-col-row   { grid-template-columns:1fr }
    .three-col-row { grid-template-columns:1fr }
    .g2 { grid-template-columns:1fr }
    .g3 { grid-template-columns:1fr }
    .type-lead-row { flex-direction:column;align-items:stretch }
    .glow-toggle button { padding:10px 10px;font-size:0.80rem }

    /* Form panel (gold-border variant) */
    .form-panel { width:calc(100vw - 16px);padding:20px 16px 24px;max-height:calc(100vh - 70px) }

    /* Relax */
    .relax-screen { flex-direction:column }
    .relax-left  { width:100%;height:auto;padding:80px 6% 24px;gap:18px }
    .relax-right { width:100%;height:260px;flex-shrink:0 }

    /* Background image dimmer on mobile so text is readable */
    .land-aibot { opacity:0.35 }

    /* Open Requests */
    .or-main   { padding:64px 16px 12px }
    .or-team   { height:16vh;min-height:100px;padding:8px 16px 8px }

    /* Dashboard detail */
    .dash-detail-wrap { inset:50px 0 0 0!important; padding:0!important }
    .dash-detail-wrap .g2,
    .dash-detail-wrap .g3 { grid-template-columns:1fr!important }
    .dash-2col { grid-template-columns:1fr!important }
    .analyse-wrap { padding:62px 16px 24px!important }
    .analyse-2col { grid-template-columns:1fr!important }
    /* Director layout */
    .dir-layout  { flex-direction:column!important;overflow-y:auto!important }
    .dir-sidebar { width:100%!important;max-width:100%!important;flex-shrink:0!important }
    .dir-3col    { grid-template-columns:1fr 1fr!important }
    .dir-4col    { grid-template-columns:1fr 1fr!important }
  }

  /* ── Small mobile (≤ 480px) ── */
  @media (max-width: 480px) {
    .nav-bar { padding:6px 10px }
    .nav-brand { display:none }
    .nav-btn { padding:5px 9px;font-size:0.66rem }
    .nav-back { padding:5px 10px;font-size:0.70rem }
    .form-right { padding:68px 12px 16px }
    .glass-input, .glass-textarea { padding:12px 14px;font-size:0.90rem }
    .land-btns { gap:6px }
    .or-main { padding:62px 12px 12px }
    .page-title { font-size:2rem }
    .s-bar input { font-size:0.76rem }
  }
`;

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────
const TopSB = ({ v, set, go }) => (
  <div className="top-sb">
    <div className="s-bar" style={{width:'100%'}}>
      <span className="ico"><Search size={15} color="rgba(255,255,255,0.5)"/></span>
      <input value={v} onChange={e=>set(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="Search for Requested Quote..."/>
      <button className="sent" onClick={go}>Search</button>
    </div>
  </div>
);

const CircLoader = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <circle cx="36" cy="36" r="28" stroke="rgba(80,130,210,0.15)" strokeWidth="5"/>
    <circle cx="36" cy="36" r="28" stroke="rgba(80,145,225,0.9)" strokeWidth="5"
      strokeDasharray="88 88" strokeLinecap="round"
      style={{transformOrigin:'center',animation:'coreOrb 1.2s linear infinite'}}/>
  </svg>
);

const FolderVisual = () => (
  <svg width="200" height="155" viewBox="0 0 200 155" fill="none" opacity="0.6">
    <rect x="2" y="30" width="196" height="120" rx="9" fill="rgba(200,145,0,0.1)" stroke="rgba(200,145,0,0.32)" strokeWidth="1.5"/>
    <path d="M2 30 Q2 22 10 22 L65 22 Q73 22 80 30" fill="rgba(200,145,0,0.16)" stroke="rgba(200,145,0,0.32)" strokeWidth="1.5"/>
    <rect x="22" y="58" width="155" height="12" rx="3" fill="rgba(200,145,0,0.18)"/>
    <rect x="22" y="79" width="110" height="10" rx="3" fill="rgba(200,145,0,0.12)"/>
    <rect x="22" y="98" width="130" height="10" rx="3" fill="rgba(200,145,0,0.10)"/>
    <rect x="22" y="117" width="90" height="10" rx="3" fill="rgba(200,145,0,0.08)"/>
  </svg>
);

// ─── AI CHAT PANEL ────────────────────────────────────────────────────────────
const AIChatPanel = ({ onClose }) => {
  const F = "'Inter',sans-serif";
  const apiKey = 'AIzaSyDTys_PKAvil7bGqkHlkFIczsUBD4xa_Yc';
  const [messages, setMessages] = useState([
    { role:'assistant', text:'Hello! I\'m your APEX AI assistant. How can I help you today?' }
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef  = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', text }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts:[{ text:'You are APEX AI, a smart assistant for NAFFCO\'s estimation and project management system. Be concise, professional, and helpful.' }] },
            contents: [...history, { role:'user', parts:[{ text }] }]
          })
        }
      );
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response received.';
      setMessages(prev => [...prev, { role:'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role:'assistant', text:'Connection error. Check your API key and try again.' }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    /* ── Glass overlay — frosted backdrop ── */
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:8000,
        background:'rgba(5,3,20,0.55)',
        backdropFilter:'blur(18px) saturate(160%)',
        WebkitBackdropFilter:'blur(18px) saturate(160%)',
        display:'flex', alignItems:'center', justifyContent:'center',
        animation:'fadeUp 0.22s ease both',
        fontFamily:F,
      }}
    >
      {/* ── Glass card — stop click propagation so inner clicks don't close ── */}
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          width:'min(680px,92vw)', height:'min(620px,86vh)',
          display:'flex', flexDirection:'column',
          background:'rgba(255,255,255,0.08)',
          backdropFilter:'blur(24px) saturate(180%)',
          WebkitBackdropFilter:'blur(24px) saturate(180%)',
          borderRadius:24,
          border:'1px solid rgba(255,255,255,0.18)',
          boxShadow:'0 8px 48px rgba(31,38,135,0.45), 0 2px 0 rgba(255,255,255,0.10) inset',
          overflow:'hidden',
          position:'relative',
        }}
      >
        {/* aurora accent line at top of card */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#6d28d9,#a855f7,#ec4899,#f97316,#fbbf24)',backgroundSize:'200% 100%',animation:'auroraShift 5s ease-in-out infinite',pointerEvents:'none',zIndex:1,borderRadius:'24px 24px 0 0'}}/>

        {/* ── Header ── */}
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'18px 24px',borderBottom:'1px solid rgba(255,255,255,0.10)',flexShrink:0}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'linear-gradient(135deg,#a855f7,#ec4899)',boxShadow:'0 0 10px rgba(168,85,247,0.90)',flexShrink:0}}/>
          <span style={{fontSize:'1rem',fontWeight:700,color:'rgba(255,255,255,0.95)',letterSpacing:'0.03em'}}>APEX AI</span>
          <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.30)',letterSpacing:'0.14em',textTransform:'uppercase'}}>Intelligent Assistant</span>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'0.62rem',color:'rgba(52,211,153,0.80)',letterSpacing:'0.08em'}}>● Connected</span>
            <button onClick={onClose}
              style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.14)',borderRadius:8,color:'rgba(255,255,255,0.50)',fontFamily:F,fontSize:'0.82rem',width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',outline:'none',transition:'all 0.15s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.16)';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.color='rgba(255,255,255,0.50)';}}>✕</button>
          </div>
        </div>

        {/* ── Messages area ── */}
        <div style={{flex:1,overflowY:'auto',padding:'24px 28px',display:'flex',flexDirection:'column',gap:16}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',alignItems:'flex-end',gap:10}}>
              {m.role==='assistant' && (
                <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6d28d9,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.58rem',fontWeight:800,color:'#fff',flexShrink:0,boxShadow:'0 0 12px rgba(168,85,247,0.60)'}}>AI</div>
              )}
              <div style={{
                maxWidth:'72%', padding:'11px 16px',
                borderRadius:m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',
                background:m.role==='user'
                  ?'linear-gradient(135deg,rgba(109,40,217,0.55),rgba(236,72,153,0.45))'
                  :'rgba(255,255,255,0.10)',
                border:m.role==='user'?'1px solid rgba(168,85,247,0.35)':'1px solid rgba(255,255,255,0.12)',
                backdropFilter:'blur(8px)',
                fontSize:'0.88rem', color:'rgba(255,255,255,0.90)', lineHeight:1.68,
                whiteSpace:'pre-wrap', wordBreak:'break-word',
                boxShadow:m.role==='user'?'0 4px 20px rgba(109,40,217,0.25)':'0 2px 12px rgba(0,0,0,0.20)',
              }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{display:'flex',alignItems:'flex-end',gap:10}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6d28d9,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.58rem',fontWeight:800,color:'#fff',flexShrink:0,boxShadow:'0 0 12px rgba(168,85,247,0.60)'}}>AI</div>
              <div style={{padding:'12px 18px',borderRadius:'18px 18px 18px 4px',background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.12)',backdropFilter:'blur(8px)',display:'flex',gap:6,alignItems:'center'}}>
                {[0,1,2].map(d=>(
                  <div key={d} style={{width:6,height:6,borderRadius:'50%',background:'rgba(168,85,247,0.75)',animation:`dotPulse 1.2s ease-in-out ${d*0.22}s infinite`}}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* ── Input bar ── */}
        <div style={{padding:'16px 24px 20px',borderTop:'1px solid rgba(255,255,255,0.10)',flexShrink:0}}>
          <div style={{display:'flex',gap:10,alignItems:'flex-end',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.14)',borderRadius:14,padding:'10px 14px',transition:'border-color 0.2s',backdropFilter:'blur(8px)'}}
            onFocusCapture={e=>e.currentTarget.style.borderColor='rgba(168,85,247,0.50)'}
            onBlurCapture={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.14)'}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
              placeholder='Ask anything… (Enter to send)'
              rows={1}
              style={{flex:1,background:'transparent',border:'none',outline:'none',resize:'none',fontFamily:F,fontSize:'0.90rem',color:'rgba(255,255,255,0.90)',lineHeight:1.55,maxHeight:130,overflowY:'auto',padding:0}}
              onInput={e=>{e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px';}}
            />
            <button onClick={send} disabled={!input.trim()||loading}
              style={{flexShrink:0,background:input.trim()&&!loading?'linear-gradient(135deg,#6d28d9,#a855f7,#ec4899)':'rgba(255,255,255,0.06)',border:'none',borderRadius:10,padding:'8px 20px',color:input.trim()&&!loading?'#fff':'rgba(255,255,255,0.22)',fontFamily:F,fontSize:'0.83rem',fontWeight:700,cursor:input.trim()&&!loading?'pointer':'not-allowed',outline:'none',transition:'all 0.2s',boxShadow:input.trim()&&!loading?'0 4px 16px rgba(168,85,247,0.50)':'none',letterSpacing:'0.04em'}}>
              Send ↑
            </button>
          </div>
          <div style={{fontSize:'0.54rem',color:'rgba(255,255,255,0.16)',marginTop:7,textAlign:'center',letterSpacing:'0.10em'}}>APEX AI · NAFFCO Intelligent Assistant</div>
        </div>
      </div>
    </div>
  );
};

// ─── SALES PERFORMANCE ───────────────────────────────────────────────────────
const SalesPerformance = ({ spName, showAll, requests=[] }) => {
  const F = "'Inter',sans-serif";
  const SK  = `sp_perf_${spName||'all'}`;
  const TK  = `sp_target_${spName||'all'}`;
  const [rows, setRows]       = useState(() => { try { return JSON.parse(localStorage.getItem(SK)||'[]'); } catch { return []; } });
  const [target, setTarget]   = useState(() => { try { return localStorage.getItem(TK)||''; } catch { return ''; } });
  const [editTarget, setEditTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const blank = { customer:'', so:'', soValue:'', invoiceValue:'', collection:'', netProfit:'' };
  const [form, setForm] = useState(blank);
  const UP = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = () => {
    if (!form.customer.trim()) return;
    const updated = [...rows, { ...form, id: Date.now(), addedAt: new Date().toISOString() }];
    setRows(updated);
    try { localStorage.setItem(SK, JSON.stringify(updated)); } catch {}
    setForm(blank); setShowAdd(false);
  };
  const del = (id) => {
    const updated = rows.filter(r => r.id !== id);
    setRows(updated);
    try { localStorage.setItem(SK, JSON.stringify(updated)); } catch {}
  };
  const saveTarget = () => {
    setTarget(targetDraft); setEditTarget(false);
    try { localStorage.setItem(TK, targetDraft); } catch {}
  };

  const totalSO    = rows.reduce((s,r) => s + (Number(r.soValue)||0), 0);
  const totalInv   = rows.reduce((s,r) => s + (Number(r.invoiceValue)||0), 0);
  const totalCol   = rows.reduce((s,r) => s + (Number(r.collection)||0), 0);
  const totalProfit= rows.reduce((s,r) => s + (Number(r.netProfit)||0), 0);
  const maxSO      = Math.max(1, ...rows.map(r => Number(r.soValue)||0));

  // Lost count from actual approved requests
  const myLost = requests.filter(r =>
    r.salesStatus === 'Lost' && (
      showAll || (r.salesPerson||'').toLowerCase() === (spName||'').toLowerCase()
    )
  ).length;

  const fmt  = v => { const n = Number(v)||0; return n>=1000000?`${(n/1000000).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(1)}K`:String(n); };
  const fmtN = v => Number(v||0).toLocaleString();
  const inp  = (ex={}) => ({ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:7, color:'rgba(255,255,255,0.85)', fontFamily:F, fontSize:'0.84rem', padding:'9px 12px', outline:'none', boxSizing:'border-box', ...ex });

  const COL = '1fr 90px 140px 140px 140px 140px 36px';

  return (
    <div className="ss-page" style={{ overflowY:'auto', fontFamily:F }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, letterSpacing:'0.10em', color:'rgba(255,255,255,0.88)', textTransform:'uppercase', margin:0 }}>My Performance</h2>
          <p style={{ fontSize:'0.70rem', color:'rgba(255,255,255,0.30)', marginTop:4, letterSpacing:'0.06em' }}>SO Value · Invoice · Collection · Net Profit · Lost</p>
        </div>
        {!showAll && (
          <button onClick={()=>setShowAdd(s=>!s)}
            style={{ padding:'9px 20px', borderRadius:100, background:'linear-gradient(105deg,#1e1b6e,#3730a3,#6d28d9,#a855f7)', backgroundSize:'220% 220%', animation:'auroraShift 5s ease-in-out infinite', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', fontFamily:F, fontSize:'0.84rem', fontWeight:700, cursor:'pointer', outline:'none', letterSpacing:'0.06em' }}>
            + Add Record
          </button>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background:'rgba(4,6,20,0.95)', border:'1px solid rgba(168,85,247,0.25)', borderRadius:14, padding:'22px 24px', marginBottom:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr auto', gap:10, alignItems:'flex-end' }}>
            {[['Customer','customer','Company name',{}],['SO #','so','Order ref',{}],['SO Value (AED)','soValue','0',{textAlign:'right'}],['Invoice Value (AED)','invoiceValue','0',{textAlign:'right'}],['Collection (AED)','collection','0',{textAlign:'right'}],['Net Profit (AED)','netProfit','0',{textAlign:'right'}]].map(([lbl,key,ph,ex])=>(
              <div key={key}>
                <label style={{ fontSize:'0.54rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.32)', display:'block', marginBottom:5 }}>{lbl}</label>
                <input value={form[key]} onChange={e=>UP(key,e.target.value)} placeholder={ph} style={inp(ex)}/>
              </div>
            ))}
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={()=>setShowAdd(false)} style={{ padding:'9px 12px', borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.38)', fontFamily:F, fontSize:'0.80rem', cursor:'pointer', outline:'none' }}>✕</button>
              <button onClick={save} style={{ padding:'9px 18px', borderRadius:8, background:'rgba(168,85,247,0.20)', border:'1px solid rgba(168,85,247,0.45)', color:'rgba(200,160,255,0.95)', fontFamily:F, fontSize:'0.84rem', fontWeight:700, cursor:'pointer', outline:'none' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Chips row */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
        {/* Target chip — editable */}
        <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.25)', display:'flex', flexDirection:'column', gap:4, minWidth:130, position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6 }}>
            <span style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(168,85,247,0.60)', fontWeight:700 }}>Target</span>
            {!showAll && <button onClick={()=>{ setEditTarget(true); setTargetDraft(target); }} style={{ background:'none', border:'none', color:'rgba(168,85,247,0.55)', cursor:'pointer', fontSize:'0.62rem', padding:0, outline:'none' }}>✎</button>}
          </div>
          {editTarget ? (
            <div style={{ display:'flex', gap:4 }}>
              <input value={targetDraft} onChange={e=>setTargetDraft(e.target.value)} placeholder="AED target"
                style={{ flex:1, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(168,85,247,0.35)', borderRadius:5, color:'#fff', fontFamily:F, fontSize:'0.78rem', padding:'3px 7px', outline:'none', width:70 }}/>
              <button onClick={saveTarget} style={{ background:'rgba(168,85,247,0.25)', border:'1px solid rgba(168,85,247,0.45)', borderRadius:5, color:'rgba(200,160,255,0.95)', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', padding:'2px 8px', outline:'none' }}>✓</button>
            </div>
          ) : (
            <span style={{ fontSize:'1.0rem', fontWeight:800, color:'rgba(168,85,247,0.90)' }}>{target ? `AED ${Number(target).toLocaleString()}` : '—'}</span>
          )}
        </div>
        {/* Lost */}
        <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.22)', display:'flex', flexDirection:'column', gap:4, minWidth:110 }}>
          <span style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(239,68,68,0.60)', fontWeight:700 }}>Lost Deals</span>
          <span style={{ fontSize:'1.0rem', fontWeight:800, color:'rgba(248,113,113,0.90)' }}>{myLost}</span>
        </div>
        {/* SO Value */}
        <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', flexDirection:'column', gap:4, minWidth:130 }}>
          <span style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', fontWeight:700 }}>SO Value</span>
          <span style={{ fontSize:'1.0rem', fontWeight:800, color:'rgba(255,200,80,0.90)' }}>AED {fmtN(totalSO)}</span>
        </div>
        {/* Invoice Value */}
        <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', flexDirection:'column', gap:4, minWidth:130 }}>
          <span style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(99,200,255,0.55)', fontWeight:700 }}>Invoice Value</span>
          <span style={{ fontSize:'1.0rem', fontWeight:800, color:'rgba(99,200,255,0.90)' }}>AED {fmtN(totalInv)}</span>
        </div>
        {/* Collection */}
        <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', flexDirection:'column', gap:4, minWidth:130 }}>
          <span style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(52,211,153,0.55)', fontWeight:700 }}>Collection</span>
          <span style={{ fontSize:'1.0rem', fontWeight:800, color:'rgba(52,211,153,0.90)' }}>AED {fmtN(totalCol)}</span>
        </div>
        {/* Net Profit */}
        <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', flexDirection:'column', gap:4, minWidth:130 }}>
          <span style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(180,130,255,0.55)', fontWeight:700 }}>Net Profit</span>
          <span style={{ fontSize:'1.0rem', fontWeight:800, color:'rgba(180,130,255,0.90)' }}>AED {fmtN(totalProfit)}</span>
        </div>
        {/* Outstanding */}
        <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.18)', display:'flex', flexDirection:'column', gap:4, minWidth:130 }}>
          <span style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(251,191,36,0.55)', fontWeight:700 }}>Outstanding</span>
          <span style={{ fontSize:'1.0rem', fontWeight:800, color:'rgba(251,191,36,0.90)' }}>AED {fmtN(Math.max(0,totalInv-totalCol))}</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:220, gap:12, opacity:0.35 }}>
          <span style={{ fontSize:'2.4rem' }}>📊</span>
          <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.40)', textAlign:'center' }}>No records yet. Add your first record above.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* Bar chart — SO Value per customer */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 20px' }}>
            <p style={{ fontSize:'0.56rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:14, fontWeight:700 }}>SO Value · Invoice · Collection by Customer</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {rows.map(r => {
                const so  = Number(r.soValue)||0;
                const inv = Number(r.invoiceValue)||0;
                const col = Number(r.collection)||0;
                const pSO  = (so/maxSO)*100;
                const pInv = so>0?(inv/so)*100:0;
                const pCol = inv>0?(col/inv)*100:0;
                return (
                  <div key={r.id} style={{ display:'grid', gridTemplateColumns:'150px 1fr 120px', gap:10, alignItems:'center' }}>
                    <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.70)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.customer}</span>
                    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                      {[['rgba(255,200,80,0.70)',pSO],['rgba(99,160,255,0.70)',pInv],['rgba(52,211,153,0.70)',pCol]].map(([c,p],bi)=>(
                        <div key={bi} style={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${p}%`, background:c, borderRadius:3 }}/>
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign:'right', display:'flex', flexDirection:'column', gap:1 }}>
                      <span style={{ fontSize:'0.62rem', color:'rgba(255,200,80,0.80)', fontWeight:600 }}>SO {fmt(so)}</span>
                      <span style={{ fontSize:'0.60rem', color:'rgba(99,160,255,0.75)' }}>Inv {fmt(inv)}</span>
                      <span style={{ fontSize:'0.58rem', color:'rgba(52,211,153,0.70)' }}>Col {fmt(col)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:'flex', gap:14, marginTop:12 }}>
              {[['rgba(255,200,80,0.70)','SO Value'],['rgba(99,160,255,0.70)','Invoice'],['rgba(52,211,153,0.70)','Collection']].map(([c,l])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:18, height:5, borderRadius:3, background:c }}/>
                  <span style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.35)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:COL, padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', minWidth:700 }}>
              {['Customer','SO #','SO Value','Invoice Value','Collection','Net Profit',''].map(h=>(
                <span key={h} style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', fontWeight:700 }}>{h}</span>
              ))}
            </div>
            {rows.map((r,i) => (
              <div key={r.id} style={{ display:'grid', gridTemplateColumns:COL, padding:'11px 16px', borderBottom: i<rows.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center', minWidth:700 }}>
                <span style={{ fontSize:'0.80rem', fontWeight:600, color:'rgba(255,255,255,0.80)' }}>{r.customer}</span>
                <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.40)', fontFamily:'monospace' }}>{r.so||'—'}</span>
                <span style={{ fontSize:'0.78rem', fontWeight:600, color:'rgba(255,200,80,0.85)', textAlign:'right' }}>AED {fmtN(r.soValue)}</span>
                <span style={{ fontSize:'0.78rem', fontWeight:600, color:'rgba(99,160,255,0.85)', textAlign:'right' }}>AED {fmtN(r.invoiceValue)}</span>
                <span style={{ fontSize:'0.78rem', fontWeight:600, color:'rgba(52,211,153,0.85)', textAlign:'right' }}>AED {fmtN(r.collection)}</span>
                <span style={{ fontSize:'0.78rem', fontWeight:600, color:'rgba(180,130,255,0.85)', textAlign:'right' }}>AED {fmtN(r.netProfit)}</span>
                {!showAll && (
                  <button onClick={()=>del(r.id)} style={{ background:'rgba(220,50,50,0.08)', border:'1px solid rgba(220,50,50,0.22)', borderRadius:6, color:'rgba(255,100,100,0.65)', fontFamily:F, fontSize:'0.68rem', padding:'3px 7px', cursor:'pointer', outline:'none' }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SALES STATUS VIEW ───────────────────────────────────────────────────────
const SALES_STATUSES = ['Pending', 'Won', 'Lost', 'Follow-up', 'Risky'];

const statusDot = { Won: '🟢', Lost: '🔴', 'Follow-up': '🟡', Risky: '🟠', Pending: '⚪' };

const SalesStatusView = ({ requests, onUpdate, autoSpName, showAll }) => {
  const F2 = "'Inter',sans-serif";
  const [spName, setSpName] = useState(autoSpName || '');
  const [loggedIn, setLoggedIn] = useState(showAll || !!autoSpName);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);   // global index in requests[]
  const [flashId, setFlashId] = useState(null);
  const [dsearch, setDsearch] = useState('');
  const [pendingStatus, setPendingStatus] = useState(null);
  const [remarkDraft, setRemarkDraft] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const [supportDraft, setSupportDraft] = useState('');

  const handleLogin = (e) => {
    e && e.preventDefault();
    const raw = loginInput.trim();
    if (!raw) { setLoginError(true); return; }
    // resolve staff code (e.g. SE421) to full name, or use as-is
    const resolvedName = STAFF_NAMES[raw.toUpperCase()] || raw;
    const match = requests.find(r =>
      (r.salesPerson || '').toLowerCase() === resolvedName.toLowerCase()
    );
    if (!match) { setLoginError(true); return; }
    setSpName(match.salesPerson);
    setLoggedIn(true);
    setLoginError(false);
  };

  // For sales: show only approved requests (director approved or completed)
  const myRequests = showAll
    ? requests
    : loggedIn
      ? requests.filter(r => {
          const isMine = (r.salesPerson || '').toLowerCase() === spName.toLowerCase() ||
                         (r.salesPerson || '').toUpperCase() === spName.toUpperCase();
          if (!isMine) return false;
          return r.directorAction === 'approved' || r.reqStatus === 'completed';
        })
      : [];

  const filtered = dsearch.trim()
    ? myRequests.filter(r => {
        const lo = dsearch.toLowerCase();
        return [r.id, r.proj, r.client, r.submittedBy, r.salesPerson, r.estimator,
          r.mainContractor, r.consultant, r.deal, r.status, r.email, r.mob,
          r.tel, r.address, r.remarks, r.leadTime, r.projValue]
          .some(v => (v||'').toLowerCase().includes(lo));
      })
    : myRequests;

  const statusClass = (s) => {
    if (!s || s === 'Pending') return 'pending';
    return s.toLowerCase();
  };

  const handleStatusChange = (globalIdx, newStatus, remark = '') => {
    const now = new Date();
    const ts = now.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
    const entry = { status: newStatus, remark: remark.trim(), by: spName || 'Sales', ts, tsMs: now.getTime() };
    const prev = requests[globalIdx].salesLog || [];
    onUpdate(requests[globalIdx].id, { salesStatus: newStatus, salesStatusAt: ts, salesLog: [...prev, entry] });
    setFlashId(requests[globalIdx].id);
    setTimeout(() => setFlashId(null), 900);
  };

  /* ── login screen ── */
  if (!loggedIn) {
    return (
      <div className="ss-page" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{
          width: 'min(420px,92vw)',
          background: 'rgba(0,4,14,0.75)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 16,
          padding: '40px 38px 36px',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', gap: 22,
          boxShadow: '0 8px 40px rgba(0,0,0,0.50)',
        }}>
          <div>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 8, fontWeight: 700 }}>NAFFCO · AI SYSTEM</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>Quoted Request</h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>Enter your name as registered in a request to view your assigned requests.</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>Sales Person Name</label>
              <input
                value={loginInput}
                onChange={e => { setLoginInput(e.target.value); setLoginError(false); }}
                placeholder="e.g. John Smith"
                autoFocus
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${loginError ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 8, padding: '13px 16px',
                  color: '#fff', fontFamily: F2, fontSize: '1rem', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = loginError ? 'rgba(239,68,68,0.70)' : 'rgba(255,255,255,0.35)'}
                onBlur={e => e.target.style.borderColor = loginError ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.12)'}
              />
              {loginError && (
                <span style={{ fontSize: '0.72rem', color: '#f87171', letterSpacing: '0.06em' }}>Name not found — make sure it matches the Sales Person field on a request.</span>
              )}
            </div>
            <button type="submit" style={{
              background: 'linear-gradient(105deg,#1e1b6e,#3730a3,#6d28d9,#a855f7,#ec4899)',
              backgroundSize: '220% 220%', animation: 'auroraShift 5s ease-in-out infinite',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 100,
              color: '#fff', fontFamily: F2, fontSize: '0.92rem', fontWeight: 700,
              padding: '13px 0', cursor: 'pointer', letterSpacing: '0.06em',
              boxShadow: '0 6px 28px rgba(109,40,217,0.45)',
            }}>View My Requests →</button>
          </form>
        </div>
      </div>
    );
  }

  /* ── detail view ── */
  if (openIdx !== null) {
    const r = requests[openIdx];
    const curStatus = r.salesStatus || 'Pending';
    const statusColors = {
      Won:  { c: '#4ade80', bg: 'rgba(34,197,94,0.10)',  bd: 'rgba(34,197,94,0.30)'  },
      Lost: { c: '#f87171', bg: 'rgba(239,68,68,0.10)',  bd: 'rgba(239,68,68,0.30)'  },
      'Follow-up': { c: '#fbbf24', bg: 'rgba(251,191,36,0.09)', bd: 'rgba(251,191,36,0.30)' },
      Risky: { c: '#fb923c', bg: 'rgba(249,115,22,0.10)', bd: 'rgba(249,115,22,0.30)' },
      Pending: { c: 'rgba(255,255,255,0.40)', bg: 'rgba(255,255,255,0.04)', bd: 'rgba(255,255,255,0.12)' },
    };
    const sc2 = statusColors[curStatus] || statusColors.Pending;
    const infoRows = [
      [r.id || '—',                                                          'Request ID'],
      [r.proj || '—',                                                        'Project'],
      [r.client || '—',                                                      'Client'],
      [r.mainContractor || '—',                                              'Main Contractor'],
      [r.consultant || '—',                                                  'Consultant'],
      [r.submittedBy || '—',                                                 'Submitted By'],
      [r.deal || '—',                                                        'Deal Type'],
      [r.supplyOnly ? 'Supply Only' : r.supplyInstall ? 'Supply & Install' : '—', 'Supply'],
      [r.email || '—',                                                       'Email'],
      [r.mob || '—',                                                         'MOB'],
      [r.tel || '—',                                                         'Tel'],
      [r.leadTime || '—',                                                    'Lead Time'],
      [r.address || '—',                                                     'Address'],
      [r.date || '—',                                                        'Submitted On'],
    ];

    return (
      <div className="ss-page" style={{ overflowY: 'auto', padding: '28px 40px 32px' }}>
        <button onClick={() => setOpenIdx(null)}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: F2, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          ← My Requests
        </button>

        {/* Status bar */}
        <div style={{ background: sc2.bg, border: `1px solid ${sc2.bd}`, borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: sc2.c, boxShadow: `0 0 8px ${sc2.c}`, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.54rem', color: 'rgba(255,255,255,0.30)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3 }}>Sales Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: sc2.c }}>{curStatus}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.54rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Request ID</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'rgba(220,165,0,0.90)', fontFamily: 'monospace' }}>{r.id}</div>
          </div>
          {r.salesStatusAt && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.54rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Updated At</div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)' }}>{r.salesStatusAt}</div>
            </div>
          )}
        </div>

        {/* ── Estimator / Cost-Artist Rejection Notice ── */}
        {(r.reqStatus === 'out-of-scope' || r.directorAction === 'rejected') && (
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
            {r.reqStatus === 'out-of-scope' && (
              <div style={{ background:'rgba(200,40,40,0.10)', border:'1px solid rgba(220,60,60,0.45)', borderRadius:10, padding:'16px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,90,0.90)" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  <span style={{ fontSize:'0.62rem', letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:700, color:'rgba(255,90,90,0.95)' }}>Cost-Artist — Out of Scope</span>
                  {r.outScopeAt && (
                    <span style={{ fontSize:'0.60rem', color:'rgba(255,160,160,0.45)', marginLeft:'auto' }}>
                      {new Date(r.outScopeAt).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}
                    </span>
                  )}
                </div>
                {r.outScopeBy && (
                  <div style={{ fontSize:'0.66rem', color:'rgba(255,160,160,0.55)', marginBottom:8, letterSpacing:'0.04em' }}>
                    Marked by: <span style={{ fontWeight:700, color:'rgba(255,160,160,0.80)' }}>{r.outScopeBy}</span>
                  </div>
                )}
                {r.outScopeRemark ? (
                  <div style={{ fontSize:'0.84rem', color:'rgba(255,210,210,0.88)', lineHeight:1.6, borderLeft:'2px solid rgba(220,60,60,0.50)', paddingLeft:12, fontStyle:'italic' }}>
                    "{r.outScopeRemark}"
                  </div>
                ) : (
                  <div style={{ fontSize:'0.78rem', color:'rgba(255,160,160,0.35)', fontStyle:'italic' }}>No reason provided.</div>
                )}
              </div>
            )}
            {r.directorAction === 'rejected' && (
              <div style={{ background:'rgba(200,40,40,0.10)', border:'1px solid rgba(220,60,60,0.45)', borderRadius:10, padding:'16px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,90,0.90)" strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span style={{ fontSize:'0.62rem', letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:700, color:'rgba(255,90,90,0.95)' }}>Cost-Artist — Rejected</span>
                  {r.directorRespondedAt && (
                    <span style={{ fontSize:'0.60rem', color:'rgba(255,160,160,0.45)', marginLeft:'auto' }}>
                      {new Date(r.directorRespondedAt).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}
                    </span>
                  )}
                </div>
                {r.directorNote ? (
                  <div style={{ fontSize:'0.84rem', color:'rgba(255,210,210,0.88)', lineHeight:1.6, borderLeft:'2px solid rgba(220,60,60,0.50)', paddingLeft:12, fontStyle:'italic' }}>
                    "{r.directorNote}"
                  </div>
                ) : (
                  <div style={{ fontSize:'0.78rem', color:'rgba(255,160,160,0.35)', fontStyle:'italic' }}>No remarks provided.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAT Timeline row ── */}
        {(() => {
          const fmtDHMS = (ms) => {
            if (!ms || ms <= 0) return null;
            const d = Math.floor(ms / 86400000);
            const h = Math.floor((ms % 86400000) / 3600000);
            const m = Math.floor((ms % 3600000) / 60000);
            const s = Math.floor((ms % 60000) / 1000);
            return d > 0
              ? `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
              : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
          };
          const subMs = r.submittedAt ? new Date(r.submittedAt).getTime()
            : r.date ? (() => { const p = r.date.split('/'); return p.length===3 ? new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime() : new Date(r.date).getTime(); })()
            : null;
          const now = Date.now();

          // Estimation stages
          const estStages = [
            { label:'Submitted',   color:'rgba(120,180,255,0.90)', done:!!(r.submittedAt||r.date), tsMs: subMs, tat: null },
            { label:'Assigned',    color:'rgba(255,200,50,0.90)',  done:!!r.taggedAt,              tsMs: r.taggedAt||null, tat: r.taggedAt && subMs ? r.taggedAt - subMs : null },
            { label:'Quoted',      color:'rgba(160,130,255,0.90)', done:!!r.quotationSubmittedAt,  tsMs: r.quotationSubmittedAt ? new Date(r.quotationSubmittedAt).getTime() : null, tat: r.quotationSubmittedAt && r.taggedAt ? new Date(r.quotationSubmittedAt).getTime() - r.taggedAt : null },
            { label:'Cost-Artist', color:'rgba(0,220,180,0.90)',   done:!!r.directorRespondedAt,   tsMs: r.directorRespondedAt ? new Date(r.directorRespondedAt).getTime() : null, tat: r.directorRespondedAt && r.quotationSubmittedAt ? new Date(r.directorRespondedAt).getTime() - new Date(r.quotationSubmittedAt).getTime() : null },
          ];

          // Sales cycle TAT: submitted → Won/Lost
          const wonLostEntry = (r.salesLog||[]).slice().reverse().find(e => e.status==='Won' || e.status==='Lost');
          const salesEndMs = wonLostEntry?.tsMs || null;
          const salesTatMs = subMs && salesEndMs ? salesEndMs - subMs : subMs ? now - subMs : null;
          const salesOngoing = !salesEndMs;
          const salesTatColor = curStatus==='Won' ? '#4ade80' : curStatus==='Lost' ? '#f87171' : curStatus==='Risky' ? '#fb923c' : curStatus==='Follow-up' ? '#fbbf24' : 'rgba(255,255,255,0.45)';

          return (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16, maxWidth:960 }}>
              {/* Estimation TAT stages */}
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 16px' }}>
                <p style={{ fontSize:'0.52rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.24)', marginBottom:10, fontWeight:700 }}>Estimation TAT Stages</p>
                <div style={{ display:'flex', alignItems:'center', gap:0, flexWrap:'nowrap', overflow:'hidden' }}>
                  {estStages.map((st, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:0, flexShrink:0 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%',
                          background: st.done ? st.color : 'rgba(255,255,255,0.10)',
                          boxShadow: st.done ? `0 0 7px ${st.color}` : 'none',
                          border: st.done ? 'none' : '1px solid rgba(255,255,255,0.16)', flexShrink:0 }}/>
                        <span style={{ fontSize:'0.48rem', color: st.done ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)', letterSpacing:'0.06em', whiteSpace:'nowrap', fontFamily:F2 }}>{st.label}</span>
                        {st.done && !st.tat && i===0 && (
                          <span style={{ fontSize:'0.44rem', color:'rgba(255,255,255,0.25)', fontFamily:'monospace', whiteSpace:'nowrap' }}>start</span>
                        )}
                        {st.done && st.tat && (
                          <span style={{ fontSize:'0.44rem', color:st.color, fontFamily:'monospace', whiteSpace:'nowrap', opacity:0.75 }}>{fmtDHMS(st.tat)}</span>
                        )}
                      </div>
                      {i < estStages.length - 1 && (
                        <div style={{ width:20, height:1, background: estStages[i+1].done ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)', margin:'0 3px', marginBottom:12, flexShrink:0 }}/>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Cycle TAT */}
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <p style={{ fontSize:'0.52rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.24)', fontWeight:700 }}>Sales Cycle TAT</p>
                  {salesOngoing && (
                    <span style={{ fontSize:'0.46rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,200,50,0.60)', fontWeight:700, background:'rgba(255,200,50,0.08)', border:'1px solid rgba(255,200,50,0.20)', borderRadius:50, padding:'2px 8px' }}>Live</span>
                  )}
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontSize:'1.2rem', fontWeight:800, fontFamily:'monospace', color:salesTatColor, letterSpacing:'0.04em' }}>
                    {salesTatMs !== null ? fmtDHMS(salesTatMs) : '—'}
                  </span>
                  {salesOngoing && (
                    <span style={{ fontSize:'0.60rem', color:'rgba(255,255,255,0.28)', fontFamily:F2 }}>ongoing</span>
                  )}
                  {!salesOngoing && wonLostEntry && (
                    <span style={{ fontSize:'0.60rem', color:salesTatColor, fontFamily:F2, fontWeight:700 }}>→ {wonLostEntry.status}</span>
                  )}
                </div>
                <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:4, flexWrap:'wrap' }}>
                  <span style={{ fontSize:'0.52rem', color:'rgba(255,255,255,0.22)', fontFamily:F2 }}>Submitted</span>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)', minWidth:12 }}/>
                  <span style={{ fontSize:'0.52rem', color: salesOngoing ? 'rgba(255,200,50,0.55)' : salesTatColor, fontFamily:F2, fontWeight:600 }}>
                    {salesOngoing ? 'In Progress' : (wonLostEntry?.status || curStatus)}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 960 }}>
          {/* Left — request info */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '18px 20px' }}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 12 }}>Request Info</p>
            {infoRows.map(([k, v]) => (
              <div key={v} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 0', gap: 12 }}>
                <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.82)', fontWeight: 600, flex: 1, minWidth: 0, wordBreak: 'break-word', lineHeight: 1.45 }}>{k}</span>
                <span style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.32)', flexShrink: 0, textAlign: 'right', lineHeight: 1.45 }}>{v}</span>
              </div>
            ))}
            {r.remarks && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', marginBottom: 5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Remarks</p>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.60)', lineHeight: 1.6 }}>{r.remarks}</p>
              </div>
            )}
            {r.estimatorComments && (
              <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,200,80,0.12)', background:'rgba(255,200,80,0.04)', borderRadius:8, padding:'10px 12px', marginTop:10 }}>
                <p style={{ fontSize: '0.58rem', color: 'rgba(255,200,80,0.55)', marginBottom: 5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight:700 }}>Estimator Comments</p>
                <p style={{ fontSize: '0.80rem', color: 'rgba(255,230,140,0.82)', lineHeight: 1.6, margin:0 }}>{r.estimatorComments}</p>
              </div>
            )}
          </div>

          {/* Right — update sales status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '18px 20px' }}>
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 14 }}>Update Sales Status</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {SALES_STATUSES.filter(s => s !== 'Pending').map(s => {
                  const sColors = statusColors[s] || statusColors.Pending;
                  const isActive = pendingStatus ? pendingStatus === s : curStatus === s;
                  return (
                    <button key={s} onClick={() => { setPendingStatus(s === pendingStatus ? null : s); setRemarkDraft(''); }}
                      style={{
                        padding: '14px 0', borderRadius: 10, cursor: 'pointer',
                        background: isActive ? sColors.bg : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isActive ? sColors.bd : 'rgba(255,255,255,0.09)'}`,
                        color: isActive ? sColors.c : 'rgba(255,255,255,0.40)',
                        fontFamily: F2, fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
                        letterSpacing: '0.06em', transition: 'all 0.2s',
                        boxShadow: isActive ? `0 4px 18px ${sColors.c}22` : 'none',
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = sColors.bg; e.currentTarget.style.color = sColors.c; e.currentTarget.style.borderColor = sColors.bd; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.40)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; } }}
                    >
                      {statusDot[s]} {s}
                    </button>
                  );
                })}
              </div>

              {/* Comment — always visible, mandatory before saving */}
              {(() => {
                const sc = pendingStatus ? (statusColors[pendingStatus] || statusColors.Pending) : { bd: 'rgba(255,255,255,0.12)', c: 'rgba(255,255,255,0.35)' };
                const canSave = pendingStatus && remarkDraft.trim().length > 0;
                return (
                  <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.54rem', color: pendingStatus ? sc.c : 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                        {pendingStatus ? `Comment for "${pendingStatus}"` : 'Select status above, then add comment'}
                      </div>
                      <span style={{ fontSize: '0.52rem', color: 'rgba(239,68,68,0.70)', letterSpacing: '0.10em' }}>* Required</span>
                    </div>
                    <textarea
                      value={remarkDraft}
                      onChange={e => setRemarkDraft(e.target.value)}
                      placeholder="Describe the outcome, next steps or any notes… (mandatory)"
                      rows={3}
                      disabled={!pendingStatus}
                      style={{ width: '100%', background: pendingStatus ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${sc.bd}`, borderRadius: 8, color: pendingStatus ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.25)', fontFamily: F2, fontSize: '0.84rem', padding: '10px 12px', outline: 'none', resize: 'vertical', lineHeight: 1.55, boxSizing: 'border-box', cursor: pendingStatus ? 'text' : 'not-allowed' }}
                    />
                    {pendingStatus && remarkDraft.trim().length === 0 && (
                      <span style={{ fontSize: '0.60rem', color: 'rgba(239,68,68,0.75)', letterSpacing: '0.06em' }}>Comment is required before saving.</span>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setPendingStatus(null); setRemarkDraft(''); }}
                        style={{ flex: 1, padding: '9px 0', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.38)', fontFamily: F2, fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}>
                        Reset
                      </button>
                      <button
                        disabled={!canSave}
                        onClick={() => { if (canSave) { handleStatusChange(openIdx, pendingStatus, remarkDraft); setPendingStatus(null); setRemarkDraft(''); } }}
                        style={{ flex: 2, padding: '9px 0', borderRadius: 8, background: canSave ? sc.bg : 'rgba(255,255,255,0.04)', border: `1px solid ${canSave ? sc.bd : 'rgba(255,255,255,0.09)'}`, color: canSave ? sc.c : 'rgba(255,255,255,0.22)', fontFamily: F2, fontSize: '0.86rem', fontWeight: 700, cursor: canSave ? 'pointer' : 'not-allowed', outline: 'none', transition: 'all 0.2s' }}>
                        {pendingStatus ? `Save — ${pendingStatus}` : 'Save'}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {r.salesStatusAt && !pendingStatus && (
                <p style={{ marginTop: 14, fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>
                  Last updated: {r.salesStatusAt}
                </p>
              )}
            </div>

            {/* Sales Activity Log */}
            {r.salesLog?.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px 18px' }}>
                <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.26)', marginBottom: 12 }}>Activity Log</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[...r.salesLog].reverse().map((entry, i) => {
                    const ec = statusColors[entry.status] || statusColors.Pending;
                    return (
                      <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: i < r.salesLog.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: ec.c, boxShadow: `0 0 6px ${ec.c}`, marginTop: 3, flexShrink: 0 }} />
                          {i < r.salesLog.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 12, background: 'rgba(255,255,255,0.07)', marginTop: 3 }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: entry.remark ? 5 : 0, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: ec.c }}>{entry.status}</span>
                            <span style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.25)' }}>·</span>
                            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)' }}>{entry.by}</span>
                            <span style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.20)', marginLeft: 'auto' }}>{entry.ts}</span>
                          </div>
                          {entry.remark && (
                            <p style={{ fontSize: '0.80rem', color: 'rgba(255,255,255,0.60)', lineHeight: 1.55, margin: 0, borderLeft: `2px solid ${ec.c}40`, paddingLeft: 8 }}>{entry.remark}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sales Status Subtimeline */}
            {(() => {
              const statusColors2 = {
                Won:  { c: '#4ade80', bg: 'rgba(34,197,94,0.12)',  bd: 'rgba(34,197,94,0.30)' },
                Lost: { c: '#f87171', bg: 'rgba(239,68,68,0.12)',  bd: 'rgba(239,68,68,0.30)' },
                'Follow-up': { c: '#fbbf24', bg: 'rgba(251,191,36,0.10)', bd: 'rgba(251,191,36,0.30)' },
                Risky: { c: '#fb923c', bg: 'rgba(249,115,22,0.12)', bd: 'rgba(249,115,22,0.30)' },
                Pending: { c: 'rgba(255,255,255,0.40)', bg: 'rgba(255,255,255,0.04)', bd: 'rgba(255,255,255,0.10)' },
              };
              const log = r.salesLog || [];
              const fmtDHMS2 = (ms) => {
                if (!ms || ms <= 0) return null;
                const d = Math.floor(ms / 86400000);
                const h = Math.floor((ms % 86400000) / 3600000);
                const m = Math.floor((ms % 3600000) / 60000);
                const s = Math.floor((ms % 60000) / 1000);
                return d > 0 ? `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}` : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
              };
              // build steps: always start with Pending
              const subMs2 = r.submittedAt ? new Date(r.submittedAt).getTime()
                : r.date ? (() => { const p = r.date.split('/'); return p.length===3 ? new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime() : new Date(r.date).getTime(); })()
                : null;
              const steps = [
                { status: 'Pending', tsMs: subMs2, isFirst: true },
                ...log.map(e => ({ status: e.status, tsMs: e.tsMs || null, remark: e.remark })),
              ];
              if (steps.length < 2 && log.length === 0) return null;
              return (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.52rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)', marginBottom: 12, fontWeight: 700 }}>Sales Status Journey</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, flexWrap: 'wrap' }}>
                    {steps.map((step, i) => {
                      const col = statusColors2[step.status] || statusColors2.Pending;
                      const nextStep = steps[i + 1];
                      const dur = step.tsMs && nextStep?.tsMs ? nextStep.tsMs - step.tsMs : null;
                      const isLast = i === steps.length - 1;
                      const isFinal = step.status === 'Won' || step.status === 'Lost';
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <div style={{ width: 9, height: 9, borderRadius: '50%',
                              background: col.c,
                              boxShadow: `0 0 7px ${col.c}`,
                              border: 'none', flexShrink: 0 }}/>
                            <span style={{ fontSize: '0.50rem', color: col.c, letterSpacing: '0.06em', whiteSpace: 'nowrap', fontFamily: F2, fontWeight: 700, maxWidth: 60, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.status}</span>
                            {step.tsMs && (
                              <span style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                {new Date(step.tsMs).toLocaleDateString('en-GB', { day:'2-digit', month:'short' })}
                              </span>
                            )}
                          </div>
                          {!isLast && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 3px', marginBottom: 18 }}>
                              {dur && <span style={{ fontSize: '0.40rem', color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace', whiteSpace: 'nowrap', marginBottom: 1 }}>{fmtDHMS2(dur)}</span>}
                              <div style={{ width: 18, height: 1, background: isFinal ? col.c : 'rgba(255,255,255,0.14)' }}/>
                              <span style={{ fontSize: '0.36rem', color: 'rgba(255,255,255,0.18)' }}>▶</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Estimation status (read-only) */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px' }}>
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>Estimation Status</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 50, background: 'rgba(220,165,0,0.10)', border: '1px solid rgba(220,165,0,0.25)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(220,185,80,0.9)', boxShadow: '0 0 6px rgba(220,165,0,0.55)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(220,185,80,0.90)' }}>{r.status || '—'}</span>
              </div>
              {r.directorNote && (
                <p style={{ marginTop: 10, fontSize: '0.78rem', color: 'rgba(255,160,90,0.80)', lineHeight: 1.55 }}>{r.directorNote}</p>
              )}
            </div>

            {/* Submitted documents — always visible */}
            {r.docs?.filter(d => d && typeof d === 'object').length > 0 && (
              <div style={{ background: 'rgba(0,160,255,0.04)', border: '1px solid rgba(0,160,255,0.18)', borderRadius: 10, padding: '16px 18px' }}>
                <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.55)', marginBottom: 10 }}>Submitted Documents</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {r.docs.filter(d => d && typeof d === 'object').map((d, i) => (
                    <button key={i} onClick={() => downloadDoc(d)}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 7, background: 'rgba(0,160,255,0.08)', border: '1px solid rgba(0,160,255,0.24)', color: 'rgba(100,190,255,0.90)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: F2, transition: 'background 0.15s', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,160,255,0.16)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,160,255,0.08)'}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {d.name || `Document_${i + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Approved quotation download — only cost-artist released files */}
            {(() => {
              const isApproved = r.directorAction === 'approved' || r.reqStatus === 'completed';
              if (!isApproved) return null;
              const allDocs = r.estimationDocs?.length > 0 ? r.estimationDocs : [r.estimationDoc].filter(Boolean);
              const releasedDocs = r.salesApprovedDocs?.length > 0
                ? allDocs.filter(d => d && r.salesApprovedDocs.includes(d.id))
                : allDocs;
              return (
                <div style={{ background: 'rgba(0,40,20,0.40)', border: '1px solid rgba(0,200,100,0.28)', borderRadius: 10, padding: '16px 18px' }}>
                  <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,200,100,0.60)', marginBottom: 10 }}>Download Approved Quotation</p>
                  {releasedDocs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {releasedDocs.map((d, i) => (
                        <button key={i} onClick={() => downloadDoc(d)}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 8, background: 'rgba(0,160,70,0.10)', border: '1px solid rgba(0,180,80,0.40)', color: 'rgba(52,211,153,0.90)', fontFamily: F2, fontSize: '0.80rem', fontWeight: 600, cursor: 'pointer', outline: 'none', transition: 'background 0.15s', width: '100%', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,160,70,0.20)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,160,70,0.10)'}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          ↓ {d.name || `Quotation_${i + 1}`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', margin: 0, lineHeight: 1.6 }}>No quotation files released by Cost-Artist yet.</p>
                  )}
                </div>
              );
            })()}

            {/* 🚩 Highlight / Escalate to Director or Cost-Artist */}
            <div style={{ background: r.salesNeedsSupport ? 'rgba(255,130,30,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${r.salesNeedsSupport ? 'rgba(255,140,40,0.38)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: r.salesNeedsSupport || showSupport ? 10 : 0 }}>
                <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: r.salesNeedsSupport ? 'rgba(255,150,50,0.80)' : 'rgba(255,255,255,0.25)', fontWeight:700, margin:0 }}>🚩 Escalate for Support</p>
                {!showAll && (
                  <button onClick={() => { setShowSupport(s=>!s); setSupportDraft(r.salesNeedsSupport?.note||''); }}
                    style={{ padding:'4px 14px', borderRadius:50, background: showSupport ? 'rgba(255,140,40,0.18)' : 'rgba(255,255,255,0.05)', border:`1px solid ${showSupport?'rgba(255,140,40,0.40)':'rgba(255,255,255,0.12)'}`, color: showSupport ? 'rgba(255,170,60,0.95)' : 'rgba(255,255,255,0.40)', fontFamily:F2, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', outline:'none', transition:'all 0.2s' }}>
                    {r.salesNeedsSupport ? 'Update' : '+ Flag'}
                  </button>
                )}
              </div>
              {r.salesNeedsSupport && !showSupport && (
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  <span style={{ fontSize:'0.60rem', color:'rgba(255,150,50,0.60)', letterSpacing:'0.10em', textTransform:'uppercase' }}>Flagged by {r.salesNeedsSupport.by} · {r.salesNeedsSupport.ts}</span>
                  <p style={{ fontSize:'0.82rem', color:'rgba(255,200,100,0.80)', lineHeight:1.5, margin:0, borderLeft:'2px solid rgba(255,140,40,0.38)', paddingLeft:10 }}>{r.salesNeedsSupport.note}</p>
                </div>
              )}
              {showSupport && (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <textarea value={supportDraft} onChange={e=>setSupportDraft(e.target.value)}
                    placeholder="Describe what support or clarification you need from Cost-Artist or Director…"
                    rows={3}
                    style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,140,40,0.30)', borderRadius:8, padding:'10px 13px', color:'rgba(255,255,255,0.85)', fontFamily:F2, fontSize:'0.84rem', outline:'none', resize:'none', boxSizing:'border-box', lineHeight:1.5 }}/>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>{ setShowSupport(false); setSupportDraft(''); }}
                      style={{ padding:'7px 16px', borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.38)', fontFamily:F2, fontSize:'0.80rem', cursor:'pointer', outline:'none' }}>Cancel</button>
                    <button onClick={()=>{
                      if (!supportDraft.trim()) return;
                      const ts = new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
                      onUpdate(requests[openIdx].id, { salesNeedsSupport: { note: supportDraft.trim(), by: spName||'Sales', ts, tsMs: Date.now() } });
                      setShowSupport(false); setSupportDraft('');
                    }}
                      style={{ flex:1, padding:'7px 16px', borderRadius:8, background:'rgba(255,140,40,0.18)', border:'1px solid rgba(255,140,40,0.38)', color:'rgba(255,200,80,0.95)', fontFamily:F2, fontSize:'0.82rem', fontWeight:700, cursor:'pointer', outline:'none' }}>
                      🚩 Send Flag
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Attached submitted files */}
           {/* Attached submitted files */}
            {r.docs?.filter(d => d && typeof d === 'object').length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px' }}>
                <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>Attached Documents</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  
                  {/* Notice how the .map is cleanly inside this div now! */}
                  {r.docs.filter(d => d && typeof d === 'object').map((d, i) => (
                    <button key={i} onClick={() => downloadDoc(d)}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 7, background: 'rgba(99,160,240,0.07)', border: '1px solid rgba(99,160,240,0.22)', color: 'rgba(99,160,240,0.88)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: F2, transition: 'background 0.15s', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,160,240,0.16)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,160,240,0.07)'}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {d.name}
                    </button>
                  ))}
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── list view ── */
  const wonCount      = myRequests.filter(r => r.salesStatus === 'Won').length;
  const lostCount     = myRequests.filter(r => r.salesStatus === 'Lost').length;
  const followupCount = myRequests.filter(r => r.salesStatus === 'Follow-up').length;
  const riskyCount    = myRequests.filter(r => r.salesStatus === 'Risky' || r.salesStatus === 'Risk').length;

  return (
    <div className="ss-page">
      {/* Header */}
      <div className="ss-hdr" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', flex: 1 }}>
          <div style={{ flexShrink: 0 }}>
            <span className="ss-title">{showAll ? 'Sales Overview' : 'Quoted Request'}</span>
            <div style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em' }}>
              {showAll
                ? <span style={{ color: 'rgba(200,220,255,0.70)', fontWeight: 600 }}>All Sales Requests</span>
                : <>Logged in as <span style={{ color: 'rgba(200,220,255,0.70)', fontWeight: 600 }}>{spName}</span></>
              }
            </div>
          </div>
          {/* Search — inline next to title */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, overflow: 'hidden', minWidth: 200, maxWidth: 340, flex: 1 }}>
            <span style={{ padding: '8px 12px', display: 'flex', alignItems: 'center' }}><Search size={13} color="rgba(255,255,255,0.35)" /></span>
            <input value={dsearch} onChange={e => setDsearch(e.target.value)} placeholder="Search by ID, project or client..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.85)', fontFamily: F2, fontSize: '0.82rem', padding: '8px 0' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Summary chips */}
          {[
            { label: 'Won',       count: wonCount,      c: '#4ade80', bg: 'rgba(34,197,94,0.10)',  bd: 'rgba(34,197,94,0.25)'  },
            { label: 'Lost',      count: lostCount,     c: '#f87171', bg: 'rgba(239,68,68,0.10)',  bd: 'rgba(239,68,68,0.25)'  },
            { label: 'Follow-up', count: followupCount, c: '#fbbf24', bg: 'rgba(251,191,36,0.09)', bd: 'rgba(251,191,36,0.25)' },
            { label: 'Risky',     count: riskyCount,    c: '#fb923c', bg: 'rgba(249,115,22,0.10)', bd: 'rgba(249,115,22,0.25)' },
          ].map(chip => (
            <div key={chip.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 50, background: chip.bg, border: `1px solid ${chip.bd}` }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: chip.c }}>{chip.count}</span>
              <span style={{ fontSize: '0.65rem', color: chip.c, fontWeight: 600, letterSpacing: '0.08em' }}>{chip.label}</span>
            </div>
          ))}
          {!showAll && (
          <button onClick={() => { setLoggedIn(false); setLoginInput(''); setSpName(''); }}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 50, color: 'rgba(255,255,255,0.38)', fontFamily: F2, fontSize: '0.72rem', padding: '5px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.30)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
            Sign Out
          </button>
          )}
        </div>
      </div>

      {myRequests.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.22)', fontSize: '0.88rem', letterSpacing: '0.08em' }}>
          No requests assigned to you yet.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10, overflowY:'auto', flex:1 }}>
          {/* Column headers */}
          <div style={{ display:'grid', gridTemplateColumns:'110px 1fr 150px 150px 140px 36px', gap:10, padding:'0 14px', alignItems:'center' }}>
            {['Request #','Project · Customer','Est. Status','Ageing TAT','Update Status',''].map(h=>(
              <span key={h} style={{ fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', fontWeight:700 }}>{h}</span>
            ))}
          </div>
          {filtered.map((r) => {
            const globalIdx = requests.findIndex(x => x.id === r.id);
            const curSales  = r.salesStatus || 'Pending';
            const scol = {
              Won:       { c:'#4ade80', bg:'rgba(34,197,94,0.12)',  bd:'rgba(34,197,94,0.30)'  },
              Lost:      { c:'#f87171', bg:'rgba(239,68,68,0.12)',  bd:'rgba(239,68,68,0.30)'  },
              'Follow-up':{ c:'#fbbf24', bg:'rgba(251,191,36,0.10)', bd:'rgba(251,191,36,0.30)' },
              Risky:     { c:'#fb923c', bg:'rgba(249,115,22,0.12)', bd:'rgba(249,115,22,0.30)' },
              Pending:   { c:'rgba(255,255,255,0.38)', bg:'rgba(255,255,255,0.04)', bd:'rgba(255,255,255,0.10)' },
            };
            // TAT: elapsed since submission in ms
            const submittedMs = (() => {
              if (r.submittedAt) { const d = new Date(r.submittedAt); return isNaN(d) ? null : d.getTime(); }
              if (!r.date) return null;
              const parts = r.date.split('/');
              const d = parts.length === 3 ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`) : new Date(r.date);
              return isNaN(d) ? null : d.getTime();
            })();
            const tatMs = submittedMs ? Math.max(0, Date.now() - submittedMs) : null;
            const tatDays = tatMs !== null ? Math.floor(tatMs / 86400000) : null;
            const fmtDHMS = (ms) => {
              if (ms === null || ms === undefined) return '—';
              const d = Math.floor(ms / 86400000);
              const h = Math.floor((ms % 86400000) / 3600000);
              const m = Math.floor((ms % 3600000) / 60000);
              const s = Math.floor((ms % 60000) / 1000);
              return `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            };
            const tatColor = tatMs === null ? 'rgba(255,255,255,0.25)' : tatDays <= 3 ? '#4ade80' : tatDays <= 7 ? '#fbbf24' : tatDays <= 14 ? '#fb923c' : '#f87171';
            const isOos = r.reqStatus === 'out-of-scope';
            const isRFI = r.reqStatus === 'rfi';
            const isCaRej = r.directorAction === 'rejected';
            const hasNotice = isOos || isRFI || isCaRej;
            const noticeComment = isRFI ? r.rfiRemark : isOos ? r.outScopeRemark : r.directorNote;
            return (
              <div key={r.id}
                style={{ borderRadius:12,
                  background: flashId===r.id ? 'rgba(99,220,160,0.08)' : isRFI ? 'rgba(180,120,0,0.06)' : (isOos||isCaRej) ? 'rgba(200,40,40,0.06)' : r.salesNeedsSupport ? 'rgba(255,140,40,0.04)' : 'rgba(255,255,255,0.03)',
                  border:`1px solid ${flashId===r.id ? 'rgba(52,211,153,0.30)' : isRFI ? 'rgba(251,191,36,0.35)' : (isOos||isCaRej) ? 'rgba(220,60,60,0.35)' : r.salesNeedsSupport ? 'rgba(255,140,40,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  transition:'all 0.3s', overflow:'hidden' }}>

                {/* Main row grid */}
                <div style={{ display:'grid', gridTemplateColumns:'110px 1fr 150px 150px 140px 36px', gap:10, padding:'12px 14px', alignItems:'center' }}>

                  {/* Request # */}
                  <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                    <span style={{ fontSize:'0.76rem', fontWeight:700, color:'rgba(220,165,0,0.90)', fontFamily:'monospace', letterSpacing:'0.04em' }}>{r.id}</span>
                    {r.salesNeedsSupport && <span style={{ fontSize:'0.50rem', color:'rgba(255,150,50,0.90)', fontWeight:700, letterSpacing:'0.06em' }}>🚩 Flagged</span>}
                  </div>

                  {/* Project · Customer */}
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.82)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.proj || '—'}</div>
                    <div style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.35)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {[r.client, r.mainContractor].filter(Boolean).join(' · ') || '—'}
                    </div>
                  </div>

                  {/* Estimation Status — highlights RFI / out-of-scope / rejected */}
                  {hasNotice ? (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:50,
                      background: isRFI ? 'rgba(180,120,0,0.14)' : 'rgba(220,50,50,0.12)',
                      border: isRFI ? '1px solid rgba(251,191,36,0.45)' : '1px solid rgba(220,60,60,0.40)', maxWidth:155 }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background: isRFI ? 'rgba(251,191,36,0.95)' : 'rgba(255,90,90,0.95)', flexShrink:0 }}/>
                      <span style={{ fontSize:'0.64rem', fontWeight:700, color: isRFI ? 'rgba(251,210,60,0.95)' : 'rgba(255,110,110,0.95)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {isRFI ? 'RFI — Needs Info' : isOos ? 'Out of Scope' : 'Rejected'}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:50,
                      background:'rgba(220,165,0,0.08)', border:'1px solid rgba(220,165,0,0.22)', maxWidth:155 }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:'rgba(220,185,80,0.9)', flexShrink:0 }}/>
                      <span style={{ fontSize:'0.64rem', fontWeight:600, color:'rgba(220,185,80,0.88)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.status || 'Pending'}</span>
                    </div>
                  )}

                  {/* Ageing TAT */}
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <span style={{ fontSize:'0.70rem', fontWeight:800, color:tatColor, fontFamily:'monospace', letterSpacing:'0.04em' }}>
                      {tatMs !== null ? fmtDHMS(tatMs) : '—'}
                    </span>
                    {tatMs !== null && (
                      <div style={{ width:'100%', height:2, borderRadius:2, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${Math.min(100,(tatDays/30)*100)}%`, background:tatColor, borderRadius:2 }}/>
                      </div>
                    )}
                  </div>

                  {/* Sales Status — inline editable select */}
                  <div style={{ display:'flex', alignItems:'center', gap:6 }} data-no-nav onClick={e=>e.stopPropagation()}>
                    {(() => {
                      const col = scol[curSales] || scol.Pending;
                      return (
                        <select
                          value={curSales}
                          onChange={e => { if (e.target.value !== curSales) handleStatusChange(globalIdx, e.target.value, `Updated to ${e.target.value}`); }}
                          style={{
                            appearance:'none', background: col.bg, border:`1px solid ${col.bd}`,
                            borderRadius:50, padding:'4px 28px 4px 12px', color: col.c,
                            fontFamily: F2, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.06em',
                            cursor:'pointer', outline:'none',
                            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='${encodeURIComponent(col.c)}' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center',
                          }}>
                          {SALES_STATUSES.map(s => <option key={s} value={s} style={{background:'#0d1117',color:'#e2e8f0'}}>{s}</option>)}
                        </select>
                      );
                    })()}
                  </div>

                  {/* View detail */}
                  <button onClick={() => setOpenIdx(globalIdx)}
                    style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6,
                      color:'rgba(255,255,255,0.45)', fontFamily:F2, fontSize:'0.70rem', padding:'4px 8px',
                      cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,0.30)';}}
                    onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.45)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';}}>
                    →
                  </button>
                </div>

                {/* Comment strip for RFI / out-of-scope / rejected */}
                {hasNotice && (
                  <div style={{ padding:'8px 14px 11px', borderTop: isRFI ? '1px solid rgba(251,191,36,0.18)' : '1px solid rgba(220,60,60,0.18)', background: isRFI ? 'rgba(180,120,0,0.04)' : 'rgba(200,40,40,0.04)', display:'flex', alignItems:'flex-start', gap:8 }}>
                    <span style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:700,
                      color: isRFI ? 'rgba(251,191,36,0.85)' : 'rgba(255,90,90,0.80)',
                      background: isRFI ? 'rgba(180,120,0,0.16)' : 'rgba(220,50,50,0.14)',
                      border: isRFI ? '1px solid rgba(251,191,36,0.38)' : '1px solid rgba(220,60,60,0.35)', borderRadius:50,
                      padding:'2px 8px', flexShrink:0, marginTop:2 }}>
                      {isRFI ? '📋 RFI' : isOos ? '⊘ Out of Scope' : '✕ Rejected'}
                    </span>
                    <span style={{ fontSize:'0.74rem', color: isRFI ? 'rgba(255,220,120,0.75)' : 'rgba(255,190,190,0.75)', lineHeight:1.5, flex:1, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {noticeComment || (isRFI ? 'No details provided.' : isOos ? 'No reason provided.' : 'No remarks provided.')}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ─── ROLE LOGIN ───────────────────────────────────────────────────────────────
const ROLE_CODES = {
  // Sales (kept for legacy sales login flow)
  SX985:'sales', SX417:'sales', SE628:'sales', SE842:'sales', SE519:'sales', SM386:'sales', SE421:'sales',
  MYD:'sales',
};

const RoleLogin = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  const F2 = "'Inter',sans-serif";

  const submit = () => {
    const c = code.trim().toUpperCase();
    const role = ROLE_CODES[c];
    if (role) { onLogin(role, c); }
    else { setErr(true); }
  };

  // Particles: [left%, bottom%, size_px, delay_s, duration_s, type(0=float,1=twinkle), color(0=gold,1=blue,2=white)]
  const RL_PARTS = [
    [7,12,3,0.0,3.2,0,0],[14,45,2,0.6,4.0,1,0],[22,28,4,1.1,3.6,0,0],[31,60,2,0.3,4.5,1,1],[40,18,3,1.8,3.1,0,0],
    [49,52,2,0.8,4.2,1,0],[57,35,5,2.1,3.8,0,0],[65,70,2,0.4,3.4,1,2],[73,22,3,1.5,4.6,0,0],[82,48,2,0.9,3.3,1,0],
    [90,15,4,1.3,4.1,0,0],[95,62,2,2.4,3.7,1,1],[18,80,3,2.7,4.3,0,0],[35,38,2,1.6,3.5,1,0],[53,55,4,0.2,4.8,0,2],
    [68,25,2,2.0,3.9,1,0],[78,72,3,0.7,4.4,0,0],[87,42,2,1.9,3.6,1,1],[11,65,5,2.3,4.2,0,0],[44,30,2,1.0,3.8,1,0],
    [5,50,3,1.4,3.5,0,0],[25,15,2,0.5,4.1,1,2],[60,85,4,2.2,3.3,0,0],[75,40,2,0.1,4.7,1,1],[93,28,3,1.7,3.9,0,0],
    [3,35,3,0.9,3.6,0,0],[16,70,2,1.3,4.4,1,0],[29,20,4,2.5,3.2,0,1],[48,88,2,0.4,4.9,1,0],[72,55,3,1.8,3.7,0,2],
  ];
  const RL_COLORS = [
    { bg:'radial-gradient(circle,#ffd93d 30%,rgba(255,160,0,0.55) 100%)', glowAnim:'rlGlowGold' },
    { bg:'radial-gradient(circle,#60c8ff 30%,rgba(30,120,255,0.55) 100%)',  glowAnim:'rlGlowBlue' },
    { bg:'radial-gradient(circle,#ffffff 20%,rgba(180,220,255,0.50) 100%)', glowAnim:'rlGlowWhite' },
  ];
  // digit streams: [left%, startBottom%, text, delay_s, dur_s, color]
  const RL_NUMS = [
    [3,  -5,'7 2 9',0.0,6.5,'rgba(255,210,60,0.90)'],[10,-8,'4 1',  1.2,5.8,'rgba(255,220,80,0.85)'],
    [19, -3,'8 3 6',2.4,7.1,'rgba(180,210,255,0.80)'],[27,-10,'0 5', 0.7,6.2,'rgba(255,215,50,0.90)'],
    [36, -6,'1 9 4',3.1,5.5,'rgba(255,210,60,0.85)'],[45,-4,'6 2',  1.8,6.8,'rgba(220,235,255,0.75)'],
    [54, -9,'3 7 0',0.3,7.3,'rgba(255,220,70,0.90)'],[63,-2,'5 8',  2.6,5.9,'rgba(255,210,60,0.85)'],
    [72, -7,'2 4 1',1.0,6.4,'rgba(180,210,255,0.80)'],[81,-11,'9 6',3.5,5.6,'rgba(255,215,50,0.90)'],
    [89, -5,'0 3 8',0.6,7.0,'rgba(255,220,80,0.85)'],[97,-3,'5 1',  2.0,6.1,'rgba(220,235,255,0.75)'],
  ];

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'rgba(0,1,6,0.94)', backdropFilter:'blur(20px)',
      animation:'fadeUp 0.4s ease both', fontFamily:F2, overflow:'hidden',
    }}>
      <style>{`
        @keyframes rlFloat   { 0%{transform:translateY(0) scale(1);opacity:var(--gop,0.8)} 55%{opacity:var(--gop,0.8)} 100%{transform:translateY(-100px) scale(0.10);opacity:0} }
        @keyframes rlTwinkle { 0%,100%{transform:scale(0.5) rotate(0deg);opacity:0.15} 50%{transform:scale(1.6) rotate(180deg);opacity:var(--gop,0.95)} }
        @keyframes rlGlowGold  { 0%,100%{box-shadow:0 0 5px 2px rgba(255,200,50,0.45)} 50%{box-shadow:0 0 16px 6px rgba(255,220,80,0.95)} }
        @keyframes rlGlowBlue  { 0%,100%{box-shadow:0 0 5px 2px rgba(60,160,255,0.45)} 50%{box-shadow:0 0 16px 6px rgba(100,200,255,0.95)} }
        @keyframes rlGlowWhite { 0%,100%{box-shadow:0 0 5px 2px rgba(200,230,255,0.35)} 50%{box-shadow:0 0 14px 5px rgba(255,255,255,0.80)} }
        @keyframes rlNumRise   { 0%{transform:translateY(0);opacity:0} 12%{opacity:var(--nop,0.15)} 80%{opacity:var(--nop,0.15)} 100%{transform:translateY(-140px);opacity:0} }
      `}</style>

      {/* Digit streams */}
      {RL_NUMS.map(([x,b,txt,delay,dur,col],i)=>(
        <div key={`rn${i}`} style={{
          position:'absolute',left:`${x}%`,bottom:`${b}%`,
          pointerEvents:'none',userSelect:'none',
          fontFamily:"'Courier New',monospace",fontSize:'0.70rem',fontWeight:700,
          letterSpacing:'0.18em',color:col,lineHeight:2.2,whiteSpace:'nowrap',
          writingMode:'vertical-lr',textOrientation:'mixed',
          '--nop':0.13+(i%5)*0.02,
          animationName:'rlNumRise',animationDuration:`${dur}s`,animationDelay:`${delay}s`,
          animationTimingFunction:'linear',animationIterationCount:'infinite',animationFillMode:'both',
        }}>{txt.split(' ').join('\n')}</div>
      ))}

      {/* Floating particles */}
      {RL_PARTS.map(([x,b,sz,delay,dur,type,col],i)=>{
        const C=RL_COLORS[col];
        const moveAnim=type===1?'rlTwinkle':'rlFloat';
        return (
          <div key={`rp${i}`} style={{
            position:'absolute',left:`${x}%`,bottom:`${b}%`,width:sz,height:sz,
            borderRadius:type===1?'2px':'50%',pointerEvents:'none',
            background:C.bg,'--gop':0.55+(i%6)*0.08,
            animationName:`${moveAnim}, ${C.glowAnim}`,
            animationDuration:`${dur}s, ${dur*0.65}s`,
            animationDelay:`${delay}s, ${delay*0.4}s`,
            animationTimingFunction:'ease-in-out, ease-in-out',
            animationIterationCount:'infinite, infinite',
            animationFillMode:'both, both',
          }}/>
        );
      })}

      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',width:'60vw',height:'60vw',borderRadius:'50%',top:'-20vw',left:'-15vw',
          background:'radial-gradient(circle,rgba(109,40,217,0.12) 0%,transparent 70%)',filter:'blur(40px)'}}/>
        <div style={{position:'absolute',width:'50vw',height:'50vw',borderRadius:'50%',bottom:'-15vw',right:'-10vw',
          background:'radial-gradient(circle,rgba(0,180,255,0.10) 0%,transparent 70%)',filter:'blur(40px)'}}/>
      </div>
      <div style={{
        position:'relative', zIndex:1,
        width:'min(460px,94vw)',
        background:'rgba(255,255,255,0.06)',
        borderRadius:20, padding:'44px 40px 40px',
        backdropFilter:'blur(32px) saturate(1.4) brightness(1.05)',
        WebkitBackdropFilter:'blur(32px) saturate(1.4) brightness(1.05)',
        boxShadow:'0 24px 80px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.10)',
        display:'flex', flexDirection:'column', gap:26,
      }}>
        {/* Header */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
            <img src="/NN.png" alt="NAFFCO" style={{height:26,width:'auto',objectFit:'contain',filter:'brightness(10) saturate(0)',opacity:0.65}}/>
            <span style={{fontSize:'0.58rem',letterSpacing:'0.24em',textTransform:'uppercase',
              color:'rgba(255,255,255,0.28)',fontWeight:700}}>NAFFCO · AI ESTIMATION</span>
          </div>
          <h2 style={{fontSize:'1.55rem',fontWeight:800,color:'rgba(255,255,255,0.92)',margin:0,letterSpacing:'0.02em'}}>
            Welcome Back
          </h2>
          <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.36)',marginTop:5,lineHeight:1.6}}>
            Enter your access code to continue
          </p>
        </div>

        {/* Role hints */}
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {[
            { label:'Sales',       sub:'Sales team access',           color:'rgba(160,130,255,0.85)', bg:'rgba(130,90,255,0.07)',  bd:'rgba(130,90,255,0.20)'  },
            { label:'Estimator',   sub:'Cost estimation team access', color:'rgba(0,200,255,0.85)',   bg:'rgba(0,150,255,0.07)',   bd:'rgba(0,180,255,0.20)'   },
            { label:'Cost-Artist', sub:'Director / approval access',  color:'rgba(255,210,60,0.85)',  bg:'rgba(200,150,0,0.07)',   bd:'rgba(220,170,0,0.20)'   },
          ].map(({label,sub,color,bg,bd}) => (
            <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
              background:bg, border:`1px solid ${bd}`, borderRadius:10, padding:'9px 14px'}}>
              <span style={{fontSize:'0.78rem',fontWeight:600,color,letterSpacing:'0.04em'}}>{label}</span>
              <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.22)',fontFamily:"'Inter',sans-serif",letterSpacing:'0.03em'}}>{sub}</span>
            </div>
          ))}
        </div>

        {/* Input + Submit */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <input
            value={code}
            onChange={e=>{ setCode(e.target.value); setErr(false); }}
            onKeyDown={e=>e.key==='Enter'&&submit()}
            placeholder="Enter access code..."
            autoFocus
            style={{
              background:'rgba(255,255,255,0.06)',
              border:`1px solid ${err?'rgba(239,68,68,0.55)':'rgba(255,255,255,0.14)'}`,
              borderRadius:10, padding:'14px 18px',
              color:'#fff', fontFamily:F2, fontSize:'1.05rem',
              outline:'none', letterSpacing:'0.10em', textTransform:'uppercase',
              transition:'border-color 0.2s',
            }}
            onFocus={e=>e.target.style.borderColor=err?'rgba(239,68,68,0.70)':'rgba(255,255,255,0.32)'}
            onBlur={e=>e.target.style.borderColor=err?'rgba(239,68,68,0.55)':'rgba(255,255,255,0.14)'}
          />
          {err && <span style={{fontSize:'0.72rem',color:'#f87171',letterSpacing:'0.04em'}}>
            Invalid access code. Please try again.
          </span>}
          <button onClick={submit} style={{
            background:'linear-gradient(105deg,#1e1b6e,#3730a3,#6d28d9,#a855f7,#ec4899)',
            backgroundSize:'220% 220%', animation:'auroraShift 5s ease-in-out infinite',
            border:'1px solid rgba(255,255,255,0.18)', borderRadius:100,
            color:'#fff', fontFamily:F2, fontSize:'0.92rem', fontWeight:700,
            padding:'13px 0', cursor:'pointer', letterSpacing:'0.06em',
            boxShadow:'0 6px 28px rgba(109,40,217,0.45)',
          }}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MY DAILY ACTIVITIES ─────────────────────────────────────────────────────
const ACT_TAGS = [
  { label:'Note',       color:'rgba(148,163,184,0.90)', bg:'rgba(148,163,184,0.12)' },
  { label:'Meeting',    color:'rgba(139,92,246,0.90)',  bg:'rgba(139,92,246,0.12)'  },
  { label:'Call',       color:'rgba(34,197,94,0.90)',   bg:'rgba(34,197,94,0.12)'   },
  { label:'Task',       color:'rgba(251,191,36,0.90)',  bg:'rgba(251,191,36,0.12)'  },
  { label:'Visit',      color:'rgba(99,179,237,0.90)',  bg:'rgba(99,179,237,0.12)'  },
  { label:'Follow-up',  color:'rgba(251,113,133,0.90)', bg:'rgba(251,113,133,0.12)' },
];
const ACT_TAG_MAP = Object.fromEntries(ACT_TAGS.map(t => [t.label, t]));

const MyDailyActivities = ({ spName, showAll }) => {
  const F = "'Inter',sans-serif";
  const storageKey = `sp_acts_${spName||'all'}`;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const [acts, setActs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)||'[]'); } catch { return []; }
  });
  const [curYear,  setCurYear]  = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [selDate,  setSelDate]  = useState(todayStr);
  const [draft,    setDraft]    = useState('');
  const [draftTag, setDraftTag] = useState('Note');
  const [editId,   setEditId]   = useState(null);
  const [editText, setEditText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(acts)); }, [acts, storageKey]);

  const daysInMonth = new Date(curYear, curMonth+1, 0).getDate();
  const firstDow    = new Date(curYear, curMonth, 1).getDay();
  const monthName   = new Date(curYear, curMonth).toLocaleString('en', { month:'long' });
  const prevMonth   = () => { if (curMonth===0){setCurYear(y=>y-1);setCurMonth(11);}else setCurMonth(m=>m-1); };
  const nextMonth   = () => { if (curMonth===11){setCurYear(y=>y+1);setCurMonth(0);}else setCurMonth(m=>m+1); };

  const dotDays = new Set(acts.map(a => a.date));

  const dateStr = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const dayEntries = acts.filter(a => a.date === selDate).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));

  const saveEntry = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
    setActs(prev => [
      ...prev,
      { id:'A'+Date.now(), date:selDate, time:timeStr, tag:draftTag, content:draft.trim(), createdAt:now.toISOString() }
    ]);
    setDraft('');
    setTimeout(()=>textareaRef.current?.focus(), 60);
  };

  const deleteEntry = id => setActs(prev => prev.filter(a => a.id !== id));

  const saveEdit = id => {
    setActs(prev => prev.map(a => a.id===id ? {...a, content:editText.trim(), editedAt:new Date().toISOString()} : a));
    setEditId(null); setEditText('');
  };

  const selLabel = new Date(selDate+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  return (
    <div style={{minHeight:'100vh',background:'transparent',padding:'32px 24px 60px',fontFamily:F}}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <h2 style={{fontSize:'1.3rem',fontWeight:800,letterSpacing:'0.10em',color:'rgba(255,255,255,0.88)',textTransform:'uppercase',margin:0}}>My Daily Activities</h2>
        <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.30)',margin:'4px 0 0',letterSpacing:'0.06em'}}>{showAll?'All staff':'Personal'} activity log — stored locally</p>
      </div>

      <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
        {/* ── Left: Calendar ── */}
        <div style={{width:220,flexShrink:0,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'14px 12px'}}>
          {/* Month nav */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <button onClick={prevMonth} style={{background:'none',border:'none',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:'1rem',padding:'0 4px',lineHeight:1}}>‹</button>
            <span style={{fontSize:'0.78rem',fontWeight:700,color:'rgba(255,255,255,0.80)'}}>{monthName} {curYear}</span>
            <button onClick={nextMonth} style={{background:'none',border:'none',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:'1rem',padding:'0 4px',lineHeight:1}}>›</button>
          </div>
          {/* Day-of-week headers */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4}}>
            {['S','M','T','W','T','F','S'].map((d,i)=>(
              <div key={i} style={{textAlign:'center',fontSize:'0.52rem',fontWeight:700,color:'rgba(255,255,255,0.22)',letterSpacing:'0.08em'}}>{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
            {Array.from({length:firstDow}).map((_,i)=><div key={'e'+i}/>)}
            {Array.from({length:daysInMonth}).map((_,i)=>{
              const d=i+1, ds=dateStr(curYear,curMonth,d), isSel=ds===selDate, isToday=ds===todayStr, hasDot=dotDays.has(ds);
              return (
                <div key={d} onClick={()=>setSelDate(ds)}
                  style={{position:'relative',textAlign:'center',padding:'4px 0',borderRadius:6,cursor:'pointer',fontSize:'0.72rem',fontWeight:isSel||isToday?700:400,
                    color: isSel?'#000':isToday?'rgba(100,210,255,0.95)':'rgba(255,255,255,0.65)',
                    background: isSel?'rgba(100,210,255,0.90)':'transparent',
                    outline: isToday&&!isSel?'1px solid rgba(100,210,255,0.35)':'none',transition:'all 0.15s'}}>
                  {d}
                  {hasDot && !isSel && <span style={{position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',width:3,height:3,borderRadius:'50%',background:'rgba(100,210,255,0.70)',display:'block'}}/>}
                </div>
              );
            })}
          </div>
          {/* Recent days with entries */}
          <div style={{marginTop:14,borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:10}}>
            <p style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',margin:'0 0 6px',fontWeight:700}}>Recent Active Days</p>
            {[...dotDays].sort((a,b)=>b.localeCompare(a)).slice(0,6).map(ds=>{
              const label=new Date(ds+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});
              const cnt=acts.filter(a=>a.date===ds).length;
              return (
                <div key={ds} onClick={()=>{setSelDate(ds);setCurYear(parseInt(ds.split('-')[0]));setCurMonth(parseInt(ds.split('-')[1])-1);}}
                  style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 6px',borderRadius:6,cursor:'pointer',
                    background:ds===selDate?'rgba(100,210,255,0.10)':'transparent',marginBottom:2,transition:'background 0.15s'}}>
                  <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.60)',fontWeight:ds===selDate?700:400}}>{label}</span>
                  <span style={{fontSize:'0.60rem',color:'rgba(100,210,255,0.60)',fontWeight:600}}>{cnt}</span>
                </div>
              );
            })}
            {dotDays.size===0 && <p style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.20)',margin:0}}>No entries yet</p>}
          </div>
        </div>

        {/* ── Right: Day view ── */}
        <div style={{flex:1,minWidth:0}}>
          {/* Day header */}
          <div style={{marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <p style={{margin:0,fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:700}}>Selected Day</p>
              <p style={{margin:'2px 0 0',fontSize:'0.90rem',fontWeight:700,color:'rgba(255,255,255,0.85)'}}>{selLabel}</p>
            </div>
            <span style={{fontSize:'0.68rem',color:'rgba(100,210,255,0.55)',fontWeight:600}}>{dayEntries.length} {dayEntries.length===1?'entry':'entries'}</span>
          </div>

          {/* Entries */}
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
            {dayEntries.length===0 && (
              <div style={{padding:'28px 20px',textAlign:'center',background:'rgba(255,255,255,0.02)',border:'1px dashed rgba(255,255,255,0.08)',borderRadius:12}}>
                <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.22)',margin:0}}>No entries for this day — add one below</p>
              </div>
            )}
            {dayEntries.map(a => {
              const tag = ACT_TAG_MAP[a.tag] || ACT_TAGS[0];
              const isEditing = editId === a.id;
              return (
                <div key={a.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'12px 14px',position:'relative'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:isEditing?10:6}}>
                    <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:tag.color,background:tag.bg,padding:'2px 8px',borderRadius:50}}>{a.tag}</span>
                    <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.28)',fontWeight:500}}>{a.time}</span>
                    {a.editedAt && <span style={{fontSize:'0.54rem',color:'rgba(255,255,255,0.20)',fontStyle:'italic'}}>edited</span>}
                    <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                      {!isEditing && <button onClick={()=>{setEditId(a.id);setEditText(a.content);}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.30)',cursor:'pointer',fontSize:'0.72rem',padding:'0 2px',lineHeight:1}} title="Edit">✎</button>}
                      <button onClick={()=>deleteEntry(a.id)} style={{background:'none',border:'none',color:'rgba(255,80,80,0.40)',cursor:'pointer',fontSize:'0.72rem',padding:'0 2px',lineHeight:1}} title="Delete">✕</button>
                    </div>
                  </div>
                  {isEditing ? (
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <textarea value={editText} onChange={e=>setEditText(e.target.value)}
                        onKeyDown={e=>{ if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();saveEdit(a.id);} }}
                        style={{width:'100%',minHeight:60,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(100,210,255,0.25)',borderRadius:8,color:'rgba(255,255,255,0.88)',fontFamily:F,fontSize:'0.82rem',padding:'8px 10px',resize:'vertical',outline:'none',boxSizing:'border-box'}}
                        autoFocus/>
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>saveEdit(a.id)} style={{padding:'5px 14px',borderRadius:7,background:'rgba(100,210,255,0.12)',border:'1px solid rgba(100,210,255,0.30)',color:'rgba(100,210,255,0.90)',fontSize:'0.72rem',fontWeight:700,cursor:'pointer'}}>Save</button>
                        <button onClick={()=>{setEditId(null);setEditText('');}} style={{padding:'5px 10px',borderRadius:7,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.35)',fontSize:'0.72rem',cursor:'pointer'}}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p style={{margin:0,fontSize:'0.82rem',color:'rgba(255,255,255,0.80)',lineHeight:1.55,whiteSpace:'pre-wrap'}}>{a.content}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* New entry input */}
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:14,padding:'14px 16px'}}>
            {/* Tag picker */}
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
              {ACT_TAGS.map(t=>(
                <button key={t.label} onClick={()=>setDraftTag(t.label)}
                  style={{padding:'3px 12px',borderRadius:50,fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.06em',cursor:'pointer',border:'none',
                    background: draftTag===t.label ? t.bg : 'rgba(255,255,255,0.04)',
                    color: draftTag===t.label ? t.color : 'rgba(255,255,255,0.28)',
                    outline: draftTag===t.label ? `1px solid ${t.color.replace('0.90','0.40')}` : 'none',
                    transition:'all 0.15s'}}>
                  {t.label}
                </button>
              ))}
            </div>
            <textarea ref={textareaRef} value={draft} onChange={e=>setDraft(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();saveEntry();} }}
              placeholder="What did you do today? (Ctrl+Enter to save)"
              style={{width:'100%',minHeight:80,background:'transparent',border:'none',borderBottom:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)',fontFamily:F,fontSize:'0.84rem',padding:'4px 0',resize:'none',outline:'none',boxSizing:'border-box',lineHeight:1.6}}/>
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:10}}>
              <button onClick={saveEntry} disabled={!draft.trim()}
                style={{padding:'7px 20px',borderRadius:8,background:draft.trim()?'rgba(100,210,255,0.14)':'rgba(255,255,255,0.04)',
                  border:`1px solid ${draft.trim()?'rgba(100,210,255,0.35)':'rgba(255,255,255,0.08)'}`,
                  color:draft.trim()?'rgba(100,210,255,0.90)':'rgba(255,255,255,0.20)',
                  fontSize:'0.76rem',fontWeight:700,cursor:draft.trim()?'pointer':'default',transition:'all 0.15s'}}>
                + Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SALES DIARY ─────────────────────────────────────────────────────────────
const MEET_TYPES = ['Customer Visit', 'Site Visit', 'Phone Call', 'Online Meeting', 'Internal'];
const PROB_COLORS = p => p >= 75 ? '#4ade80' : p >= 50 ? '#fbbf24' : p >= 25 ? '#fb923c' : '#f87171';

const SalesDiary = ({ diaryEntries, onAddEntry, onEditEntry, onDeleteEntry, spName, showAll }) => {
  const F = "'Inter',sans-serif";
  const today = new Date();
  const [curYear,  setCurYear]  = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());  // 0-based
  const [selDay,   setSelDay]   = useState(today.getDate());
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);   // null = new
  const [filterSp, setFilterSp] = useState('');
  const [diaryTab, setDiaryTab] = useState('all'); // 'all' | 'activity' | 'visits'

  // ── form state ──
  const blankForm = () => ({
    date: `${curYear}-${String(curMonth+1).padStart(2,'0')}-${String(selDay).padStart(2,'0')}`,
    time: '09:00', customer: '', requestId: '', meetingType: 'Customer Visit',
    probability: 50, remarks: '', nextDate: '', nextTime: '', nextNote: '',
  });
  const [form, setForm] = useState(blankForm);

  const openNew = () => {
    setEditEntry(null);
    setForm({ ...blankForm(), date: `${curYear}-${String(curMonth+1).padStart(2,'0')}-${String(selDay).padStart(2,'0')}` });
    setShowForm(true);
  };
  const openEdit = (e) => { setEditEntry(e); setForm({ ...e }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditEntry(null); };

  const saveEntry = () => {
    if (!form.customer.trim() || !form.date) return;
    if (editEntry) {
      onEditEntry({ ...editEntry, ...form });
    } else {
      onAddEntry({ ...form, id: 'D' + Date.now(), salesPerson: spName, createdAt: new Date().toISOString() });
    }
    closeForm();
  };

  // ── calendar helpers ──
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const firstDow    = new Date(curYear, curMonth, 1).getDay(); // 0=Sun
  const prevMonth   = () => { if (curMonth === 0) { setCurYear(y => y-1); setCurMonth(11); } else setCurMonth(m => m-1); };
  const nextMonth   = () => { if (curMonth === 11) { setCurYear(y => y+1); setCurMonth(0); } else setCurMonth(m => m+1); };
  const monthName   = new Date(curYear, curMonth).toLocaleString('en', { month: 'long' });

  const VISIT_TYPES    = ['Customer Visit','Site Visit'];
  const ACTIVITY_TYPES = ['Phone Call','Online Meeting','Internal'];

  // entries visible to current user
  const baseEntries = showAll
    ? (filterSp ? diaryEntries.filter(e => e.salesPerson === filterSp) : diaryEntries)
    : diaryEntries.filter(e => e.salesPerson === spName);
  const myEntries = diaryTab === 'visits'
    ? baseEntries.filter(e => VISIT_TYPES.includes(e.meetingType))
    : diaryTab === 'activity'
    ? baseEntries.filter(e => ACTIVITY_TYPES.includes(e.meetingType))
    : baseEntries;

  // entries keyed by date string 'YYYY-MM-DD'
  const byDate = {};
  myEntries.forEach(e => { if (!byDate[e.date]) byDate[e.date] = []; byDate[e.date].push(e); });

  const selDateStr = `${curYear}-${String(curMonth+1).padStart(2,'0')}-${String(selDay).padStart(2,'0')}`;
  const dayEntries = byDate[selDateStr] || [];

  // all sales persons (for director filter)
  const allSp = [...new Set(diaryEntries.map(e => e.salesPerson).filter(Boolean))].sort();

  const UP = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── input style helper ──
  const inp = (extra={}) => ({
    width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:7, color:'rgba(255,255,255,0.85)', fontFamily:F, fontSize:'0.84rem',
    padding:'9px 12px', outline:'none', boxSizing:'border-box', ...extra,
  });

  return (
    <div className="ss-page" style={{ overflowY:'auto', fontFamily:F }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, letterSpacing:'0.10em', color:'rgba(255,255,255,0.88)', textTransform:'uppercase', margin:0 }}>My Diary</h2>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
            {[{key:'all',label:'All'},{key:'activity',label:'Activity'},{key:'visits',label:'Visits'}].map(t=>(
              <button key={t.key} onClick={()=>setDiaryTab(t.key)}
                style={{ padding:'3px 12px', borderRadius:50, fontSize:'0.62rem', fontWeight:700, cursor:'pointer', outline:'none',
                  background: diaryTab===t.key ? 'rgba(168,85,247,0.20)' : 'rgba(255,255,255,0.05)',
                  border:`1px solid ${diaryTab===t.key ? 'rgba(168,85,247,0.50)' : 'rgba(255,255,255,0.10)'}`,
                  color: diaryTab===t.key ? 'rgba(200,160,255,0.95)' : 'rgba(255,255,255,0.40)',
                  transition:'all 0.15s' }}>
                {t.label}
              </button>
            ))}
            <span style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.25)', letterSpacing:'0.06em' }}>
              {showAll ? 'All Sales Activity' : spName}
            </span>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          {showAll && allSp.length > 0 && (
            <select value={filterSp} onChange={e => setFilterSp(e.target.value)}
              style={{ background:'rgba(0,10,30,0.70)', border:'1px solid rgba(0,200,255,0.22)', borderRadius:8, color:filterSp?'rgba(100,200,255,0.90)':'rgba(255,255,255,0.35)', fontFamily:F, fontSize:'0.80rem', padding:'8px 12px', outline:'none', cursor:'pointer' }}>
              <option value="">All Sales Persons</option>
              {allSp.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          )}
          {!showAll && (
            <button onClick={openNew}
              style={{ padding:'9px 20px', borderRadius:100, background:'linear-gradient(105deg,#1e1b6e,#3730a3,#6d28d9,#a855f7)', backgroundSize:'220% 220%', animation:'auroraShift 5s ease-in-out infinite', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', fontFamily:F, fontSize:'0.84rem', fontWeight:700, cursor:'pointer', outline:'none', letterSpacing:'0.06em', boxShadow:'0 4px 18px rgba(109,40,217,0.40)' }}>
              + Log Activity
            </button>
          )}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20 }}>

        {/* ── LEFT: Calendar ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Month nav */}
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <button onClick={prevMonth} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.50)', cursor:'pointer', fontSize:'1.1rem', padding:'2px 8px', borderRadius:6, outline:'none' }}>‹</button>
              <span style={{ fontSize:'0.92rem', fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.06em' }}>{monthName} {curYear}</span>
              <button onClick={nextMonth} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.50)', cursor:'pointer', fontSize:'1.1rem', padding:'2px 8px', borderRadius:6, outline:'none' }}>›</button>
            </div>

            {/* Day-of-week headers */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:6 }}>
              {['S','M','T','W','T','F','S'].map((d,i) => (
                <div key={i} style={{ textAlign:'center', fontSize:'0.58rem', color:'rgba(255,255,255,0.28)', fontWeight:600, letterSpacing:'0.06em', paddingBottom:4 }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
              {Array.from({ length: firstDow }).map((_,i) => <div key={'e'+i}/>)}
              {Array.from({ length: daysInMonth }).map((_,i) => {
                const day = i + 1;
                const ds  = `${curYear}-${String(curMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const cnt = byDate[ds]?.length || 0;
                const isToday = day === today.getDate() && curMonth === today.getMonth() && curYear === today.getFullYear();
                const isSel   = day === selDay;
                const maxProb = cnt ? Math.max(...(byDate[ds].map(e => Number(e.probability||0)))) : 0;
                return (
                  <div key={day} onClick={() => setSelDay(day)}
                    style={{
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                      height:36, borderRadius:8, cursor:'pointer', position:'relative', transition:'all 0.15s',
                      background: isSel ? 'rgba(109,40,217,0.30)' : isToday ? 'rgba(255,255,255,0.08)' : 'transparent',
                      border: isSel ? '1px solid rgba(180,130,255,0.55)' : isToday ? '1px solid rgba(255,255,255,0.20)' : '1px solid transparent',
                    }}
                    onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background='transparent'; }}>
                    <span style={{ fontSize:'0.78rem', fontWeight: isToday||isSel?700:400, color: isSel?'rgba(200,160,255,0.95)':isToday?'rgba(255,255,255,0.90)':'rgba(255,255,255,0.60)' }}>{day}</span>
                    {cnt > 0 && (
                      <div style={{ display:'flex', gap:2, marginTop:1 }}>
                        {Array.from({ length: Math.min(cnt,3) }).map((_,di) => (
                          <span key={di} style={{ width:4, height:4, borderRadius:'50%', background:PROB_COLORS(maxProb), boxShadow:`0 0 4px ${PROB_COLORS(maxProb)}` }}/>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'10px 14px' }}>
            <p style={{ fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:8 }}>Probability Legend</p>
            {[['≥75% — High',PROB_COLORS(75)],['50–74% — Medium',PROB_COLORS(50)],['25–49% — Low',PROB_COLORS(25)],['<25% — Very Low',PROB_COLORS(10)]].map(([l,c])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:5 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:c, boxShadow:`0 0 5px ${c}`, flexShrink:0 }}/>
                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.45)' }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Director: upcoming across all (or filtered) */}
          {showAll && (() => {
            const upcoming = myEntries
              .filter(e => e.nextDate && e.nextDate >= new Date().toISOString().slice(0,10))
              .sort((a,b) => a.nextDate.localeCompare(b.nextDate))
              .slice(0, 5);
            if (!upcoming.length) return null;
            return (
              <div style={{ background:'rgba(0,200,255,0.04)', border:'1px solid rgba(0,200,255,0.12)', borderRadius:10, padding:'12px 14px' }}>
                <p style={{ fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,200,255,0.45)', marginBottom:10 }}>Upcoming Meetings</p>
                {upcoming.map(e => (
                  <div key={e.id} style={{ marginBottom:8, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize:'0.72rem', fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{e.customer}</div>
                    <div style={{ fontSize:'0.62rem', color:'rgba(0,200,255,0.65)', marginTop:2 }}>{e.nextDate}{e.nextTime?` · ${e.nextTime}`:''}</div>
                    <div style={{ fontSize:'0.60rem', color:'rgba(255,255,255,0.30)' }}>{e.salesPerson}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* ── RIGHT: Day entries ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <div>
              <span style={{ fontSize:'1rem', fontWeight:700, color:'rgba(255,255,255,0.80)' }}>
                {new Date(curYear, curMonth, selDay).toLocaleDateString('en', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              </span>
              <span style={{ marginLeft:10, fontSize:'0.68rem', color:'rgba(255,255,255,0.30)' }}>{dayEntries.length} entr{dayEntries.length===1?'y':'ies'}</span>
            </div>
            {!showAll && (
              <button onClick={openNew}
                style={{ padding:'7px 16px', borderRadius:8, background:'rgba(109,40,217,0.18)', border:'1px solid rgba(180,130,255,0.35)', color:'rgba(200,160,255,0.90)', fontFamily:F, fontSize:'0.78rem', fontWeight:600, cursor:'pointer', outline:'none' }}>
                + Add
              </button>
            )}
          </div>

          {dayEntries.length === 0 ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'40px 20px', minHeight:200 }}>
              <span style={{ fontSize:'1.8rem', opacity:0.25 }}>📅</span>
              <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.22)', textAlign:'center' }}>
                No {diaryTab === 'visits' ? 'visits' : diaryTab === 'activity' ? 'activities' : 'entries'} logged for this day.
              </p>
              {!showAll && <button onClick={openNew} style={{ marginTop:4, padding:'8px 20px', borderRadius:8, background:'rgba(109,40,217,0.15)', border:'1px solid rgba(180,130,255,0.30)', color:'rgba(200,160,255,0.80)', fontFamily:F, fontSize:'0.80rem', cursor:'pointer', outline:'none' }}>+ Add Entry</button>}
            </div>
          ) : (
            dayEntries.map(entry => {
              const pc = PROB_COLORS(Number(entry.probability||0));
              return (
                <div key={entry.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'16px 18px', position:'relative' }}>
                  {/* Header row */}
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.98rem', fontWeight:700, color:'rgba(255,255,255,0.88)', marginBottom:3 }}>{entry.customer}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.40)', background:'rgba(255,255,255,0.06)', borderRadius:5, padding:'2px 8px' }}>{entry.meetingType}</span>
                        {entry.time && <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.40)' }}>⏱ {entry.time}</span>}
                        {entry.requestId && <span style={{ fontSize:'0.64rem', color:'rgba(100,180,255,0.70)', fontFamily:'monospace' }}>#{entry.requestId}</span>}
                        {showAll && <span style={{ fontSize:'0.64rem', color:'rgba(200,160,255,0.70)', marginLeft:'auto' }}>{entry.salesPerson}</span>}
                      </div>
                    </div>
                    {/* Probability gauge */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, flexShrink:0 }}>
                      <span style={{ fontSize:'1.3rem', fontWeight:800, color:pc, fontFamily:'monospace', lineHeight:1 }}>{entry.probability}%</span>
                      <span style={{ fontSize:'0.52rem', color:'rgba(255,255,255,0.28)', letterSpacing:'0.08em', textTransform:'uppercase' }}>Close</span>
                      <div style={{ width:48, height:5, borderRadius:3, background:'rgba(255,255,255,0.08)', overflow:'hidden', marginTop:2 }}>
                        <div style={{ height:'100%', width:`${entry.probability}%`, background:pc, borderRadius:3, boxShadow:`0 0 6px ${pc}` }}/>
                      </div>
                    </div>
                    {!showAll && (
                      <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                        <button onClick={()=>openEdit(entry)} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, color:'rgba(255,255,255,0.50)', fontFamily:F, fontSize:'0.70rem', padding:'4px 10px', cursor:'pointer', outline:'none' }}>Edit</button>
                        <button onClick={()=>{ if(window.confirm('Delete this entry?')) onDeleteEntry(entry.id); }} style={{ background:'rgba(220,50,50,0.10)', border:'1px solid rgba(220,50,50,0.25)', borderRadius:6, color:'rgba(255,100,100,0.70)', fontFamily:F, fontSize:'0.70rem', padding:'4px 10px', cursor:'pointer', outline:'none' }}>✕</button>
                      </div>
                    )}
                  </div>

                  {/* Remarks */}
                  {entry.remarks && (
                    <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'9px 12px', marginBottom:10 }}>
                      <p style={{ fontSize:'0.52rem', letterSpacing:'0.10em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)', marginBottom:5 }}>Remarks</p>
                      <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.62)', lineHeight:1.55, margin:0 }}>{entry.remarks}</p>
                    </div>
                  )}

                  {/* Next meeting */}
                  {entry.nextDate && (
                    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8, background:'rgba(0,200,255,0.05)', border:'1px solid rgba(0,200,255,0.15)' }}>
                      <span style={{ fontSize:'0.80rem' }}>📌</span>
                      <div>
                        <span style={{ fontSize:'0.62rem', color:'rgba(0,200,255,0.55)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600 }}>Next Meeting</span>
                        <div style={{ fontSize:'0.78rem', color:'rgba(0,220,255,0.80)', fontWeight:600, marginTop:2 }}>
                          {new Date(entry.nextDate).toLocaleDateString('en',{weekday:'short',day:'numeric',month:'short'})}
                          {entry.nextTime && ` · ${entry.nextTime}`}
                        </div>
                        {entry.nextNote && <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.45)', margin:'3px 0 0', lineHeight:1.4 }}>{entry.nextNote}</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* ── Director: monthly summary across persons ── */}
          {showAll && (() => {
            const monthKey = `${curYear}-${String(curMonth+1).padStart(2,'0')}`;
            const monthEntries = myEntries.filter(e => e.date?.startsWith(monthKey));
            if (!monthEntries.length) return null;
            const byPerson = {};
            monthEntries.forEach(e => {
              if (!byPerson[e.salesPerson]) byPerson[e.salesPerson] = [];
              byPerson[e.salesPerson].push(e);
            });
            return (
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 18px', marginTop:4 }}>
                <p style={{ fontSize:'0.56rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.26)', marginBottom:12 }}>Month Summary — {monthName}</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
                  {Object.entries(byPerson).map(([sp, entries]) => {
                    const avgProb = Math.round(entries.reduce((s,e)=>s+Number(e.probability||0),0)/entries.length);
                    const pc = PROB_COLORS(avgProb);
                    return (
                      <div key={sp} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, padding:'12px 14px' }}>
                        <div style={{ fontSize:'0.80rem', fontWeight:700, color:'rgba(255,255,255,0.78)', marginBottom:6 }}>{sp}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'rgba(255,255,255,0.40)', marginBottom:4 }}>
                          <span>Meetings</span><span style={{ fontWeight:700, color:'rgba(255,255,255,0.70)' }}>{entries.length}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'rgba(255,255,255,0.40)', marginBottom:6 }}>
                          <span>Avg Probability</span><span style={{ fontWeight:700, color:pc }}>{avgProb}%</span>
                        </div>
                        <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${avgProb}%`, background:pc, boxShadow:`0 0 5px ${pc}` }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:9900, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={closeForm}>
          <div style={{ width:'min(680px,96vw)', maxHeight:'90vh', overflowY:'auto', background:'rgba(4,6,20,0.98)', border:'1px solid rgba(180,130,255,0.20)', borderRadius:16, padding:'28px 30px', fontFamily:F, animation:'fadeUp 0.18s ease both', boxShadow:'0 40px 100px rgba(0,0,0,0.90)' }} onClick={e=>e.stopPropagation()}>

            <div style={{ fontSize:'0.56rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(180,130,255,0.65)', marginBottom:6, fontWeight:700 }}>{editEntry ? 'Edit Activity' : 'Log Activity'}</div>
            <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'rgba(255,255,255,0.88)', marginBottom:20 }}>{editEntry ? 'Update Entry' : 'New Diary Entry'}</h3>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', display:'block', marginBottom:5 }}>Customer / Company *</label>
                <input value={form.customer} onChange={e=>UP('customer',e.target.value)} placeholder="Customer or company name" style={inp()}/>
              </div>
              <div>
                <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', display:'block', marginBottom:5 }}>Meeting Date *</label>
                <input type="date" value={form.date} onChange={e=>UP('date',e.target.value)} style={inp()}/>
              </div>
              <div>
                <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', display:'block', marginBottom:5 }}>Meeting Time</label>
                <input type="time" value={form.time} onChange={e=>UP('time',e.target.value)} style={inp()}/>
              </div>
              <div>
                <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', display:'block', marginBottom:5 }}>Meeting Type</label>
                <select value={form.meetingType} onChange={e=>UP('meetingType',e.target.value)} style={{ ...inp(), cursor:'pointer' }}>
                  {MEET_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', display:'block', marginBottom:5 }}>Linked Request ID</label>
                <input value={form.requestId} onChange={e=>UP('requestId',e.target.value)} placeholder="e.g. AX0001 (optional)" style={inp()}/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', display:'block', marginBottom:5 }}>
                  Probability of Closure — <span style={{ color:PROB_COLORS(form.probability), fontWeight:700 }}>{form.probability}%</span>
                </label>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <input type="range" min={0} max={100} step={5} value={form.probability} onChange={e=>UP('probability',Number(e.target.value))}
                    style={{ flex:1, accentColor:PROB_COLORS(form.probability), cursor:'pointer' }}/>
                  <div style={{ width:52, height:7, borderRadius:4, background:'rgba(255,255,255,0.08)', overflow:'hidden', flexShrink:0 }}>
                    <div style={{ height:'100%', width:`${form.probability}%`, background:PROB_COLORS(form.probability), borderRadius:4, transition:'width 0.2s, background 0.2s', boxShadow:`0 0 6px ${PROB_COLORS(form.probability)}` }}/>
                  </div>
                </div>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', display:'block', marginBottom:5 }}>Remarks / Meeting Notes</label>
                <textarea value={form.remarks} onChange={e=>UP('remarks',e.target.value)} placeholder="Outcome, discussion points, next actions…" rows={3} style={{ ...inp(), resize:'vertical', lineHeight:1.55 }}/>
              </div>
              <div style={{ gridColumn:'1/-1', borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:14, marginTop:2 }}>
                <p style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,200,255,0.45)', marginBottom:10, fontWeight:600 }}>Next Meeting (if any)</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.30)', display:'block', marginBottom:5 }}>Next Date</label>
                    <input type="date" value={form.nextDate} onChange={e=>UP('nextDate',e.target.value)} style={inp()}/>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.30)', display:'block', marginBottom:5 }}>Next Time</label>
                    <input type="time" value={form.nextTime} onChange={e=>UP('nextTime',e.target.value)} style={inp()}/>
                  </div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'0.56rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.30)', display:'block', marginBottom:5 }}>Next Meeting Note</label>
                    <input value={form.nextNote} onChange={e=>UP('nextNote',e.target.value)} placeholder="Agenda or preparation notes…" style={inp()}/>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:22 }}>
              <button onClick={closeForm} style={{ flex:1, padding:'11px 0', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.40)', fontFamily:F, fontSize:'0.85rem', cursor:'pointer', outline:'none' }}>Cancel</button>
              <button onClick={saveEntry} disabled={!form.customer.trim()||!form.date}
                style={{ flex:2, padding:'11px 0', borderRadius:10, background:form.customer.trim()&&form.date?'linear-gradient(105deg,#1e1b6e,#3730a3,#6d28d9,#a855f7)':'rgba(255,255,255,0.04)', backgroundSize:'220% 220%', animation:form.customer.trim()&&form.date?'auroraShift 5s ease-in-out infinite':'none', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', fontFamily:F, fontSize:'0.90rem', fontWeight:700, cursor:form.customer.trim()&&form.date?'pointer':'not-allowed', outline:'none', letterSpacing:'0.06em' }}>
                {editEntry ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── OPEN REQUESTS ───────────────────────────────────────────────────────────
const AVATAR_PALETTES = [
  {bg:'linear-gradient(135deg,#6d28d9,#a855f7)',border:'rgba(168,85,247,0.50)',glow:'rgba(168,85,247,0.35)'},
  {bg:'linear-gradient(135deg,#1d4ed8,#3b82f6)',border:'rgba(59,130,246,0.50)',glow:'rgba(59,130,246,0.35)'},
  {bg:'linear-gradient(135deg,#065f46,#10b981)',border:'rgba(16,185,129,0.50)',glow:'rgba(16,185,129,0.35)'},
  {bg:'linear-gradient(135deg,#9d174d,#ec4899)',border:'rgba(236,72,153,0.50)',glow:'rgba(236,72,153,0.35)'},
  {bg:'linear-gradient(135deg,#92400e,#f59e0b)',border:'rgba(245,158,11,0.50)',glow:'rgba(245,158,11,0.35)'},
  {bg:'linear-gradient(135deg,#0e7490,#06b6d4)',border:'rgba(6,182,212,0.50)',glow:'rgba(6,182,212,0.35)'},
  {bg:'linear-gradient(135deg,#7f1d1d,#ef4444)',border:'rgba(239,68,68,0.50)',glow:'rgba(239,68,68,0.35)'},
  {bg:'linear-gradient(135deg,#1e3a5f,#38bdf8)',border:'rgba(56,189,248,0.50)',glow:'rgba(56,189,248,0.35)'},
];
const avatarPalette = name => {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_PALETTES[Math.abs(h) % AVATAR_PALETTES.length];
};
const initials = name => name.trim().split(/\s+/).map(w=>w[0]||'').join('').toUpperCase().slice(0,2) || '?';

const STAFF_NAMES = {
  // Sales
  'SX985':'Ammar Khaldoun','SX417':'Ashik Bin Shams',
  'SE628':'Mohammad Hindawi','SE842':'Ibrahim Odeh',
  'SE519':'Yazan Al Agha','SM386':'Ali Hussnain','SE421':'Almira Abogado',
  'MYD':'My Dashboard',
  // Estimators
  'EX552':'Sachin Poojary','EX719':'Mohammad Samee Hamid Khan',
  'EX638':'Moazzam Ali','EX904':'Benson Benjamine',
  'EX471':'Pranav Manjalam Kandiyil','EX856':'Saeem Sajid Gadkari',
  'EX392':'Jaffar Shaik',
  // Costing Art Lead
  'STAR':'Nour Alyazji',
};

const EST_ROSTER = [
  {code:'EX552',name:'Sachin Poojary'},
  {code:'EX719',name:'Mohammad Samee Hamid Khan'},
  {code:'EX638',name:'Moazzam Ali'},
  {code:'EX904',name:'Benson Benjamine'},
  {code:'EX471',name:'Pranav Manjalam Kandiyil'},
  {code:'EX856',name:'Saeem Sajid Gadkari'},
  {code:'EX392',name:'Jaffar Shaik'},
];

const COSTING_ROSTER = [
  {code:'STAR', name:'Nour Alyazji'},
];

// Photo URLs keyed by estimator code — add entries here when photos are available
const AVATAR_URLS = {};

const FULL_STAFF = [
  {code:'SX985',name:'Ammar Khaldoun',    role:'sales'},
  {code:'SX417',name:'Ashik Bin Shams',   role:'sales'},
  {code:'SE628',name:'Mohammad Hindawi',  role:'sales'},
  {code:'SE842',name:'Ibrahim Odeh',      role:'sales'},
  {code:'SE519',name:'Yazan Al Agha',     role:'sales'},
  {code:'SM386',name:'Ali Hussnain',      role:'sales'},
  {code:'SE421',name:'Almira Abogado',    role:'sales'},
  ...EST_ROSTER.map(e => ({ ...e, role:'estimator' })),
];

const PROFILE_PICS = {
  // Sales (A–f)
  'SX985':'/A.jpg','SX417':'/b.jpg','SE628':'/c.jpg',
  'SE842':'/d.jpg','SE519':'/e.jpg','SM386':'/f.jpg',
  // Estimators (g–q)
  'EX552':'/g.jpg','EX719':'/h.jpg','EX638':'/i.jpg','EX904':'/j.jpg',
  'EX471':'/K.jpg','EX856':'/L.jpg','EX392':'/M.jpg','EX681':'/N.jpg',
  'EX547':'/O.jpg','EX903':'/P.jpg','EX764':'/Q.jpg',
  // Cost Artist
  'STAR':'/S.jpg',
  // Lowercase name keys — Sales
  'ammar khaldoun':'/A.jpg','ashik bin shams':'/b.jpg',
  'mohammad hindawi':'/c.jpg','ibrahim odeh':'/d.jpg',
  'yazan al agha':'/e.jpg','ali hussnain':'/f.jpg',
  // Lowercase name keys — Estimators
  'sachin poojary':'/g.jpg','mohammad samee hamid khan':'/h.jpg',
  'moazzam ali':'/i.jpg','benson benjamine':'/j.jpg',
  'pranav manjalam kandiyil':'/K.jpg','saeem sajid gadkari':'/L.jpg',
  'jaffar shaik':'/M.jpg',
  // Cost Artist name key
  'Nour Alyazji':'/R.jpg',
};

const EstAvatar = ({ name, size=40, code='' }) => {
  const pic = PROFILE_PICS[code] || PROFILE_PICS[(name||'').trim().toLowerCase()];
  if (pic) return (
    <img src={pic} alt={name}
      style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',
        border:'2px solid rgba(255,255,255,0.18)',flexShrink:0,display:'block'}}/>
  );
  const pal = avatarPalette(name);
  return (
    <div style={{width:size,height:size,borderRadius:'50%',background:pal.bg,
      border:`2px solid ${pal.border}`,boxShadow:`0 0 12px ${pal.glow}`,
      display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <span style={{fontSize:size*0.34,fontWeight:800,color:'#fff',fontFamily:"'Inter',sans-serif",letterSpacing:'0.02em'}}>{initials(name)}</span>
    </div>
  );
};

const OpenRequests = ({ requests, onUpdate, onDelete, userCode='', userRole='', isEmbedded=false }) => {
  const F = "'Inter',sans-serif";
  const isCostingRole = userRole === 'director';
  const [orSearch, setOrSearch] = useState('');
  const COSTING_TYPES = ['discount','finalPrice'];
  const allOpen = requests.map((r,i)=>({r,i})).filter(({r}) => {
    if (r.status !== 'Pending Estimation') return false;
    if (isCostingRole) return !r.costingArt && COSTING_TYPES.includes(r.requestType);
    return !r.estimator && !COSTING_TYPES.includes(r.requestType);
  });
  const openReqs = orSearch.trim()
    ? allOpen.filter(({r}) => {
        const lo = orSearch.trim().toLowerCase();
        return (r.id||'').toLowerCase().includes(lo)
          || (r.proj||'').toLowerCase().includes(lo)
          || (r.client||'').toLowerCase().includes(lo)
          || (r.mainContractor||'').toLowerCase().includes(lo)
          || (r.submittedBy||'').toLowerCase().includes(lo);
      })
    : allOpen;
  const jobInHandReqs = openReqs.filter(({r}) => r.deal === 'Job In Hand');
  const tenderReqs    = openReqs.filter(({r}) => r.deal === 'Tender');
  const allJobInHandCount = allOpen.filter(({r}) => r.deal === 'Job In Hand').length;
  const allTenderCount    = allOpen.filter(({r}) => r.deal === 'Tender').length;
  const [orSidebarOpen, setOrSidebarOpen] = useState(false);
  const [splitPct, setSplitPct] = useState(50);
  const splitDragging = useRef(false);
  const splitContainerRef = useRef(null);
  const onSplitMouseDown = (e) => {
    e.preventDefault();
    splitDragging.current = true;
    const onMove = (ev) => {
      if (!splitDragging.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pct = Math.min(80, Math.max(20, ((ev.clientX - rect.left) / rect.width) * 100));
      setSplitPct(pct);
    };
    const onUp = () => { splitDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  const [claiming, setClaiming] = useState(null);
  const [estName, setEstName] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [justClaimed, setJustClaimed] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // {idx, id}
  const [deleteCode, setDeleteCode] = useState('');

  const openClaim = (idx, reqId) => {
    // If the user is logged in as an estimator with a known code, auto-claim without showing the picker
    const autoName = !isCostingRole && userCode ? (STAFF_NAMES[userCode] || '') : '';
    if (autoName) {
      const nowMs = Date.now();
      const ts    = new Date(nowMs).toISOString();
      const req   = requests[idx];
      onUpdate(reqId, {
        estimator:   autoName,
        taggedAt:    nowMs,
        claimedAtMs: nowMs,
        reqStatus:   'inprogress',
        timeline: [...(req.timeline||[]), { event:'assigned', ts, tsMs:nowMs, label:`Assigned to ${autoName}`, by:autoName }],
        _immediate: true,
      });
      setJustClaimed(reqId);
      setTimeout(() => setJustClaimed(null), 2200);
      return;
    }
    setClaiming({idx,reqId});
    setEstName('');
    setNameErr(false);
  };
  const closeClaim = () => { setClaiming(null); setEstName(''); setNameErr(false); };

  const confirmClaim = () => {
    const name = estName.trim();
    if (!name) { setNameErr(true); return; }
    const nowMs = Date.now();
    const ts    = new Date(nowMs).toISOString();
    const req   = requests[claiming.idx];
    // For Costing Art claims: preserve the original estimator chain
    const originalEstimator = req.estimator
      || requests.find(x => x.id === req.originalId)?.estimator
      || '';
    const assignField = isCostingRole
      ? { costingArt: name, originalEstimator: originalEstimator || undefined }
      : { estimator: name };
    onUpdate(claiming.reqId, {
      ...assignField,
      taggedAt:    nowMs,
      claimedAtMs: nowMs,
      reqStatus:   'inprogress',
      timeline: [...(req.timeline||[]), {
        event: 'assigned',
        ts,
        tsMs:  nowMs,
        label: isCostingRole
          ? `Costing Art: ${name}${originalEstimator ? ` · Est: ${originalEstimator}` : ''}`
          : `Assigned to ${name}`,
        by:    name,
      }],
      _immediate: true,
    });
    setJustClaimed(claiming.reqId);
    closeClaim();
    setTimeout(() => setJustClaimed(null), 2200);
  };

  const dealColor = d => d==='Job In Hand'?'rgba(255,215,0,0.80)':d==='Tender'?'rgba(79,255,223,0.80)':'rgba(160,130,255,0.70)';

  // ── Estimator roster derived from requests ──────────────────────────────────
  const estRoster = (() => {
    const map = {};
    requests.forEach(r => {
      if (!r.estimator) return;
      if (!map[r.estimator]) map[r.estimator] = { name: r.estimator, active: 0, pending: 0, done: 0, lastActive: null };
      const e = map[r.estimator];
      if (r.reqStatus === 'inprogress') e.active++;
      else if (r.reqStatus === 'pending-director') e.pending++;
      else if (r.reqStatus === 'completed') e.done++;
      if (r.taggedAt && (!e.lastActive || r.taggedAt > e.lastActive)) e.lastActive = r.taggedAt;
    });
    return Object.values(map).sort((a,b) => (b.active+b.pending) - (a.active+a.pending));
  })();

  // ── Costing Art roster derived from requests ─────────────────────────────────
  const costingRoster = (() => {
    const map = {};
    requests.forEach(r => {
      if (!r.costingArt) return;
      if (!map[r.costingArt]) map[r.costingArt] = { name: r.costingArt, active: 0, done: 0, lastActive: null };
      const e = map[r.costingArt];
      if (r.reqStatus === 'inprogress') e.active++;
      else if (r.reqStatus === 'completed') e.done++;
      if (r.taggedAt && (!e.lastActive || r.taggedAt > e.lastActive)) e.lastActive = r.taggedAt;
    });
    return Object.values(map);
  })();

  const estStatus = e => {
    const inHand = e.active + e.pending;
    if (inHand === 0) return { label:'Available', dot:'#22c55e', glow:'rgba(34,197,94,0.55)', dim:false };
    if (inHand <= 2)  return { label:`${inHand} In Hand`, dot:'#fbbf24', glow:'rgba(251,191,36,0.50)', dim:false };
    return               { label:`${inHand} Requests`, dot:'#ef4444', glow:'rgba(239,68,68,0.50)', dim:false };
  };

  // check if last active within 24 h → online, else offline
  const isOnline = e => e.lastActive && (Date.now() - e.lastActive) < 86400000;

  const renderCard = (r, i, idx) => {
    const isClaimed = justClaimed === r.id;
    const PALS = [
      {a:'99,102,241',  b:'168,85,247'},
      {a:'6,182,212',   b:'99,102,241'},
      {a:'236,72,153',  b:'245,158,11'},
      {a:'245,158,11',  b:'16,185,129'},
      {a:'16,185,129',  b:'6,182,212'},
      {a:'168,85,247',  b:'236,72,153'},
    ];
    const pal   = isClaimed ? {a:'52,211,153',b:'16,185,129'} : PALS[idx % PALS.length];
    const delay = `${-(idx * 1.3).toFixed(1)}s`;
    const rank  = idx + 1;
    return (
      <div key={r.id} style={{
        position:'relative', overflow:'hidden',
        borderRadius:22, padding:'22px 20px 18px',
        display:'flex', flexDirection:'column', gap:16,
        transition:'transform 0.22s, box-shadow 0.22s',
        background:`linear-gradient(135deg,rgba(${pal.a},0.18) 0%,rgba(${pal.b},0.10) 50%,rgba(${pal.a},0.15) 100%)`,
        backgroundSize:'250% 250%',
        animation:`cardAura 7s ease infinite`,
        animationDelay: delay,
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        boxShadow:`0 0 0 1px rgba(${pal.a},0.22), 0 12px 40px rgba(${pal.a},0.18), 0 2px 8px rgba(0,0,0,0.55)`,
      }}>
        <div style={{position:'absolute',top:0,left:0,width:'30%',height:'100%',
          background:`linear-gradient(105deg,transparent 0%,rgba(255,255,255,0.06) 50%,transparent 100%)`,
          animation:'cardSweep 5s ease-in-out infinite',
          animationDelay:`${-(idx*0.9).toFixed(1)}s`,
          pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,
          background:`linear-gradient(90deg,transparent,rgba(${pal.a},0.90),rgba(${pal.b},0.70),transparent)`,
          pointerEvents:'none'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:'0.56rem',fontWeight:800,letterSpacing:'0.16em',color:`rgba(${pal.a},0.75)`,textTransform:'uppercase'}}>#{rank}</span>
            <span style={{fontSize:'0.62rem',fontFamily:'monospace',fontWeight:700,color:'rgba(255,255,255,0.28)',letterSpacing:'0.10em'}}>{r.id}</span>
          </div>
          <div style={{display:'flex',gap:5,alignItems:'center'}}>
            {r.deal && <span style={{fontSize:'0.50rem',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase',color:dealColor(r.deal),background:dealColor(r.deal).replace(/[\d.]+\)$/,'0.12)'),borderRadius:20,padding:'2px 9px'}}>{r.deal}</span>}
            {r.requestType==='revised'    && <span style={{fontSize:'0.48rem',fontWeight:700,color:'rgba(0,200,255,0.80)',background:'rgba(0,200,255,0.10)',borderRadius:20,padding:'2px 8px',letterSpacing:'0.08em',textTransform:'uppercase'}}>REVISE</span>}
            {r.requestType==='discount'   && <span style={{fontSize:'0.48rem',fontWeight:700,color:'rgba(251,191,36,0.90)',background:'rgba(251,191,36,0.10)',borderRadius:20,padding:'2px 8px',letterSpacing:'0.08em',textTransform:'uppercase'}}>DISCOUNT</span>}
            {r.requestType==='finalPrice' && <span style={{fontSize:'0.48rem',fontWeight:700,color:'rgba(52,211,153,0.85)',background:'rgba(52,211,153,0.10)',borderRadius:20,padding:'2px 8px',letterSpacing:'0.08em',textTransform:'uppercase'}}>FINAL</span>}
            <CopyLinkBtn reqId={r.id} link={r.appLink} size="small"/>
            <SpBtn reqId={r.id} link={r.spLink} size="small"/>
            {userRole==='director' && (
              <button onClick={e=>{e.stopPropagation();setDeleteConfirm({idx:i,id:r.id});}}
                style={{display:'flex',alignItems:'center',justifyContent:'center',width:24,height:24,borderRadius:6,background:'rgba(220,50,50,0.08)',border:'none',color:'rgba(220,80,80,0.55)',cursor:'pointer',outline:'none',flexShrink:0}}
                onMouseEnter={e=>{e.currentTarget.style.color='rgba(255,100,100,0.95)';e.currentTarget.style.background='rgba(220,50,50,0.20)';}}
                onMouseLeave={e=>{e.currentTarget.style.color='rgba(220,80,80,0.55)';e.currentTarget.style.background='rgba(220,50,50,0.08)';}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
              </button>
            )}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          <div style={{fontSize:'1.08rem',fontWeight:900,lineHeight:1.15,color:'rgba(255,255,255,0.96)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textShadow:`0 0 28px rgba(${pal.a},0.55), 0 0 60px rgba(${pal.b},0.25)`}}>{r.mainContractor||'—'}</div>
          <div style={{fontSize:'0.80rem',fontWeight:700,lineHeight:1.3,color:`rgba(${pal.a},0.88)`,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.client||'—'}</div>
          <div style={{fontSize:'0.62rem',fontWeight:400,color:'rgba(255,255,255,0.38)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</div>
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,rgba(${pal.a},0.35),rgba(${pal.b},0.20),transparent)`}}/>
        <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          {/* Sales name */}
          <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.55)',display:'flex',alignItems:'center',gap:5}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={`rgba(${pal.a},0.70)`} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span style={{fontSize:'0.52rem',color:`rgba(${pal.a},0.55)`,letterSpacing:'0.06em',textTransform:'uppercase',marginRight:2}}>Sales</span>
            {r.submittedBy||r.salesPerson||'—'}
          </span>
          {/* Estimator name — shown for both roles if present */}
          {r.estimator && (
            <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.55)',display:'flex',alignItems:'center',gap:5}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={`rgba(${pal.b},0.70)`} strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              <span style={{fontSize:'0.52rem',color:`rgba(${pal.b},0.55)`,letterSpacing:'0.06em',textTransform:'uppercase',marginRight:2}}>Est</span>
              {r.estimator}
            </span>
          )}
          {/* Costing Art name — shown once claimed */}
          {r.costingArt && (
            <span style={{fontSize:'0.65rem',color:'rgba(251,191,36,0.75)',display:'flex',alignItems:'center',gap:5}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,0.70)" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span style={{fontSize:'0.52rem',color:'rgba(251,191,36,0.50)',letterSpacing:'0.06em',textTransform:'uppercase',marginRight:2}}>CA</span>
              {r.costingArt}
            </span>
          )}
          {!r.estimator && !isCostingRole && (
            <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.55)',display:'flex',alignItems:'center',gap:5}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={`rgba(${pal.b},0.70)`} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {r.leadTime||'—'}
            </span>
          )}
          <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.35)'}}>{r.date||'—'}</span>
        </div>
        {isClaimed ? (
          <div style={{display:'flex',alignItems:'center',gap:9,padding:'10px 14px',background:'rgba(52,211,153,0.10)',borderRadius:12}}>
            <span style={{width:7,height:7,borderRadius:'50%',flexShrink:0,background:'rgba(52,211,153,0.90)',boxShadow:'0 0 8px rgba(52,211,153,0.70)'}}/>
            <span style={{fontSize:'0.78rem',color:'rgba(52,211,153,0.90)',fontWeight:700}}>Request Claimed!</span>
          </div>
        ) : (
          <button onClick={()=>openClaim(i,r.id)} style={{
            width:'100%',padding:'11px 0',borderRadius:12,border:'none',
            background:`linear-gradient(120deg,rgba(${pal.a},0.30),rgba(${pal.b},0.22))`,
            color:'rgba(255,255,255,0.92)',fontFamily:F,fontSize:'0.82rem',fontWeight:700,
            cursor:'pointer',outline:'none',letterSpacing:'0.05em',
            display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all 0.20s'}}
            onMouseEnter={e=>{
              e.currentTarget.style.background=`linear-gradient(120deg,rgba(${pal.a},0.55),rgba(${pal.b},0.42))`;
              e.currentTarget.style.boxShadow=`0 6px 24px rgba(${pal.a},0.40)`;
              e.currentTarget.style.transform='translateY(-1px)';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background=`linear-gradient(120deg,rgba(${pal.a},0.30),rgba(${pal.b},0.22))`;
              e.currentTarget.style.boxShadow='none';
              e.currentTarget.style.transform='translateY(0)';
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Take This Request
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="or-layout" style={{fontFamily:F}}>
      {isEmbedded && <style>{`.or-main { padding-top: 8px !important; }`}</style>}

      {/* Vertical OPEN watermark — embedded mode */}
      {isEmbedded && (
        <div style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',
          writingMode:'vertical-rl',textOrientation:'mixed',
          fontFamily:"'Cinzel',serif",fontSize:'4.5rem',fontWeight:800,letterSpacing:'0.40em',
          color:'rgba(255,255,255,0.035)',pointerEvents:'none',userSelect:'none',zIndex:0,whiteSpace:'nowrap'}}>
          OPEN
        </div>
      )}

      {/* ── LEFT SIDEBAR (hidden by default, hamburger to reveal) — hidden when embedded in dashboard ── */}
      {!isEmbedded && (orSidebarOpen ? (
        <div style={{width:210,flexShrink:0,display:'flex',flexDirection:'column',
          background:'rgba(0,0,10,0.84)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
          borderRight:'1px solid rgba(255,255,255,0.08)',zIndex:10,overflow:'hidden'}}>
          {/* Header row: hamburger + module title */}
          <div style={{display:'flex',alignItems:'center',gap:9,padding:'13px 12px 10px',flexShrink:0,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <button onClick={()=>setOrSidebarOpen(false)}
              style={{background:'transparent',border:'none',cursor:'pointer',padding:'6px 7px',borderRadius:7,display:'flex',flexDirection:'column',gap:4,outline:'none',flexShrink:0}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              {[0,1,2].map(i=><div key={i} style={{width:16,height:2,background:'rgba(255,255,255,0.65)',borderRadius:2}}/>)}
            </button>
            <div style={{minWidth:0}}>
              <div style={{fontSize:'0.43rem',letterSpacing:'0.20em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:2}}>Module</div>
              <div style={{fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase',fontFamily:"'Cinzel',serif",
                background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 40%,#a855f7 70%,#00e5ff 100%)',
                backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                animation:'auroraShift 5s ease infinite',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                Open Requests
              </div>
            </div>
          </div>
          {/* Deal stats */}
          <div style={{padding:'10px 12px 6px',display:'flex',flexDirection:'column',gap:5,flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 10px',borderRadius:8,background:'rgba(255,215,0,0.06)',border:'1px solid rgba(255,215,0,0.14)'}}>
              <span style={{fontSize:'0.58rem',fontWeight:700,color:'rgba(255,215,0,0.75)',letterSpacing:'0.07em',textTransform:'uppercase',fontFamily:"'Cinzel',serif"}}>Job In Hand</span>
              <span style={{fontSize:'0.72rem',fontWeight:800,color:'rgba(255,215,0,0.90)',fontFamily:"'Inter',sans-serif"}}>{allJobInHandCount}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 10px',borderRadius:8,background:'rgba(79,255,223,0.06)',border:'1px solid rgba(79,255,223,0.14)'}}>
              <span style={{fontSize:'0.58rem',fontWeight:700,color:'rgba(79,255,223,0.75)',letterSpacing:'0.07em',textTransform:'uppercase',fontFamily:"'Cinzel',serif"}}>Tender</span>
              <span style={{fontSize:'0.72rem',fontWeight:800,color:'rgba(79,255,223,0.90)',fontFamily:"'Inter',sans-serif"}}>{allTenderCount}</span>
            </div>
          </div>
          {/* Team label */}
          <div style={{padding:'8px 14px 4px',flexShrink:0}}>
            <div style={{fontSize:'0.42rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:700}}>
              {isCostingRole ? 'Costing Art Team' : 'Estimator Team'}
            </div>
          </div>
          {/* Team list */}
          <div style={{flex:1,overflowY:'auto',padding:'0 10px 14px',display:'flex',flexDirection:'column',gap:3}}>
            {(isCostingRole ? COSTING_ROSTER : EST_ROSTER).map(er => {
              const stats = isCostingRole
                ? costingRoster.find(x=>x.name===er.name)
                : estRoster.find(x=>x.name===er.name);
              const inHand = stats ? (stats.active + (stats.pending||0)) : 0;
              const online = stats ? isOnline(stats) : false;
              const idle   = inHand===0;
              const accentColor = isCostingRole ? '251,191,36' : '99,180,255';
              return (
                <div key={er.name} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',borderRadius:8,
                  border: idle ? '1px solid rgba(255,255,255,0.04)' : `1px solid rgba(${accentColor},0.15)`,
                  background: idle ? 'rgba(255,255,255,0.015)' : `rgba(${accentColor},0.06)`,
                  opacity: idle ? 0.45 : 1}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    <EstAvatar name={er.name} code={er.code} size={30}/>
                    <span style={{position:'absolute',bottom:0,right:0,width:7,height:7,borderRadius:'50%',
                      background: idle ? 'rgba(255,255,255,0.18)' : (online?'#22c55e':'rgba(255,255,255,0.18)'),
                      border:'2px solid rgba(4,2,14,0.95)'}}/>
                  </div>
                  <div style={{minWidth:0}}>
                    <p style={{fontSize:'0.62rem',fontWeight:700,
                      color: idle?'rgba(255,255,255,0.38)':'rgba(255,255,255,0.88)',
                      margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{er.name}</p>
                    <span style={{fontSize:'0.54rem',color: idle?'rgba(255,255,255,0.25)':`rgba(${accentColor},0.85)`,fontWeight:700}}>
                      {inHand} in hand
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <button onClick={()=>setOrSidebarOpen(true)}
          style={{position:'absolute',top:14,left:14,zIndex:50,background:'rgba(0,0,10,0.80)',backdropFilter:'blur(14px)',border:'1px solid rgba(255,255,255,0.14)',borderRadius:8,padding:'9px 11px',cursor:'pointer',display:'flex',flexDirection:'column',gap:4.5,outline:'none'}}>
          {[0,1,2].map(i=><div key={i} style={{width:17,height:2,background:'rgba(255,255,255,0.70)',borderRadius:2}}/>)}
        </button>
      ))}

      {/* ── RIGHT COLUMN: main content + team strip ── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,overflow:'hidden'}}>
      <div className="or-main">

      {/* Claim identity modal */}
      {claiming && (
        <div style={{position:'fixed',inset:0,zIndex:9500,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,8,0.72)',backdropFilter:'blur(10px)'}}>
          <div style={{background:'rgba(8,4,24,0.98)',border:'1px solid rgba(168,85,247,0.30)',borderRadius:20,padding:'36px 32px',width:340,display:'flex',flexDirection:'column',alignItems:'center',gap:18,boxShadow:'0 30px 80px rgba(0,0,0,0.7)',animation:'fadeUp 0.25s ease both'}}>
            <p style={{fontSize:'0.55rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(168,85,247,0.60)',margin:0,fontWeight:700}}>Claim Request · {claiming.reqId}</p>
            {/* Show original estimator chain for Costing Art claims */}
            {isCostingRole && (() => {
              const req = requests[claiming.idx];
              const origEst = req.estimator || requests.find(x=>x.id===req.originalId)?.estimator;
              return origEst ? (
                <div style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:10,background:'rgba(0,180,255,0.06)',border:'1px solid rgba(0,180,255,0.18)'}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.60)" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  <span style={{fontSize:'0.58rem',color:'rgba(0,200,255,0.50)',letterSpacing:'0.08em',textTransform:'uppercase'}}>Original Estimator</span>
                  <span style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(0,200,255,0.85)',fontFamily:F}}>{origEst}</span>
                </div>
              ) : null;
            })()}
            <p style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.30)',margin:0,alignSelf:'flex-start',letterSpacing:'0.06em'}}>
              {isCostingRole ? 'Select Costing Art Lead' : 'Select estimator'}
            </p>
            <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7,maxHeight:240,overflowY:'auto',paddingRight:2}}>
              {(isCostingRole ? COSTING_ROSTER : EST_ROSTER).map(e=>{
                const selected = estName === e.name;
                return (
                  <button key={e.code} onClick={()=>{setEstName(e.name);setNameErr(false);}}
                    style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:12,
                      cursor:'pointer',textAlign:'left',width:'100%',
                      background:selected?'rgba(168,85,247,0.18)':'rgba(255,255,255,0.04)',
                      border:`1px solid ${selected?'rgba(168,85,247,0.55)':'rgba(255,255,255,0.08)'}`,
                      boxShadow:selected?'0 0 16px rgba(168,85,247,0.20)':'none',
                      transition:'all 0.15s',outline:'none',
                    }}>
                    <EstAvatar name={e.name} code={e.code} size={36}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'0.84rem',fontWeight:700,color:selected?'rgba(210,170,255,0.95)':'rgba(255,255,255,0.80)',
                        fontFamily:F,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</div>
                    </div>
                    {selected && <span style={{color:'rgba(168,85,247,0.90)',fontSize:16,flexShrink:0}}>✓</span>}
                  </button>
                );
              })}
            </div>
            {nameErr && <p style={{fontSize:'0.72rem',color:'rgba(255,90,90,0.80)',margin:0,textAlign:'center'}}>
              {isCostingRole ? 'Please select Costing Art Lead' : 'Please select an estimator'}
            </p>}
            <div style={{display:'flex',gap:10,width:'100%'}}>
              <button onClick={closeClaim} style={{flex:1,padding:'11px 0',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.38)',fontFamily:F,fontSize:'0.84rem',cursor:'pointer',outline:'none',transition:'all 0.15s'}}>Cancel</button>
              <button onClick={confirmClaim}
                style={{flex:2,padding:'11px 0',borderRadius:10,
                  background:estName.trim()?'linear-gradient(105deg,#4c1d95,#6d28d9,#a855f7)':'rgba(255,255,255,0.04)',
                  border:estName.trim()?'1px solid rgba(168,85,247,0.50)':'1px solid rgba(255,255,255,0.07)',
                  color:estName.trim()?'#fff':'rgba(255,255,255,0.20)',fontFamily:F,fontSize:'0.88rem',fontWeight:700,cursor:estName.trim()?'pointer':'default',outline:'none',transition:'all 0.2s',letterSpacing:'0.04em'}}>
                Claim Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header + inline search */}
      <div style={{marginBottom:22}}>
        <p style={{fontSize:'0.55rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(160,130,255,0.55)',marginBottom:8,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:12,flexShrink:0}}>
            <h2 style={{fontSize:'1.5rem',fontWeight:800,color:'rgba(255,255,255,0.88)',margin:0}}>Open Requests</h2>
            <span style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.28)',fontWeight:400}}>
              {allOpen.length} {isCostingRole ? 'pending costing review' : 'unassigned'}
            </span>
          </div>
          {/* Search — inline right of heading */}
          <div style={{display:'flex',alignItems:'center',flex:1,minWidth:260,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,overflow:'hidden'}}>
            <span style={{padding:'0 14px',display:'flex',alignItems:'center',flexShrink:0,opacity:0.35}}><Search size={15} color="#fff"/></span>
            <input value={orSearch} onChange={e=>setOrSearch(e.target.value)}
              placeholder="Search by project, client, contractor, ID or requester…"
              style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.82)',fontFamily:F,fontSize:'0.86rem',padding:'13px 0'}}/>
            {orSearch && <button onClick={()=>setOrSearch('')} style={{background:'transparent',border:'none',cursor:'pointer',padding:'0 14px',display:'flex',alignItems:'center',opacity:0.40,flexShrink:0}}><X size={13} color="#fff"/></button>}
          </div>
        </div>
        <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.32)',marginTop:6}}>
          {isCostingRole
            ? 'Pick a discount or final price request and assign it to begin costing review.'
            : 'Pick a request and assign it to yourself to begin estimation.'}
        </p>
      </div>

      {/* ── Split: Job In Hand (left) | Tender (right) ── */}
      <div ref={splitContainerRef} style={{display:'flex',alignItems:'start',gap:0,userSelect:'none'}}>

        {/* ═══ LEFT: Job In Hand ═══ */}
        <div style={{width:`${splitPct}%`,flexShrink:0,minWidth:0,overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,paddingBottom:10,borderBottom:'1px solid rgba(255,215,0,0.18)'}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,215,0,0.85)',flexShrink:0,boxShadow:'0 0 8px rgba(255,215,0,0.55)'}}/>
            <span style={{fontSize:'0.88rem',fontWeight:800,color:'rgba(255,215,0,0.92)',letterSpacing:'0.02em'}}>Job In Hand</span>
            <span style={{fontSize:'0.65rem',fontWeight:700,color:'rgba(255,215,0,0.55)',background:'rgba(255,215,0,0.10)',borderRadius:8,padding:'2px 8px',marginLeft:'auto'}}>{jobInHandReqs.length} open</span>
          </div>
          {jobInHandReqs.length === 0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:200,gap:12,opacity:0.35}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,215,0,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p style={{fontSize:'0.82rem',color:'rgba(255,215,0,0.55)',fontFamily:F,textAlign:'center',margin:0}}>
                {orSearch.trim() ? 'No Job In Hand matches' : 'No open Job In Hand requests'}
              </p>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              {jobInHandReqs.map(({r,i},idx) => renderCard(r,i,idx))}
            </div>
          )}
        </div>

        {/* ── Draggable divider ── */}
        <div onMouseDown={onSplitMouseDown}
          style={{width:32,flexShrink:0,alignSelf:'stretch',cursor:'col-resize',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,position:'relative',marginTop:0}}
          title="Drag to resize">
          <div style={{width:3,height:'100%',minHeight:60,background:'linear-gradient(180deg,transparent 0%,rgba(255,210,0,0.75) 25%,rgba(255,180,0,1) 50%,rgba(255,210,0,0.75) 75%,transparent 100%)',borderRadius:2,animation:'splitGold 2s ease-in-out infinite'}}/>
        </div>

        {/* ═══ RIGHT: Tender ═══ */}
        <div style={{flex:1,minWidth:0,overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,paddingBottom:10,borderBottom:'1px solid rgba(79,255,223,0.18)'}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(79,255,223,0.85)',flexShrink:0,boxShadow:'0 0 8px rgba(79,255,223,0.55)'}}/>
            <span style={{fontSize:'0.88rem',fontWeight:800,color:'rgba(79,255,223,0.92)',letterSpacing:'0.02em'}}>Tender</span>
            <span style={{fontSize:'0.65rem',fontWeight:700,color:'rgba(79,255,223,0.55)',background:'rgba(79,255,223,0.10)',borderRadius:8,padding:'2px 8px',marginLeft:'auto'}}>{tenderReqs.length} open</span>
          </div>
          {tenderReqs.length === 0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:200,gap:12,opacity:0.35}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(79,255,223,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p style={{fontSize:'0.82rem',color:'rgba(79,255,223,0.55)',fontFamily:F,textAlign:'center',margin:0}}>
                {orSearch.trim() ? 'No Tender matches' : 'No open Tender requests'}
              </p>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              {tenderReqs.map(({r,i},idx) => renderCard(r,i,idx))}
            </div>
          )}
        </div>

      </div>
      </div>{/* end or-main */}

      {/* ── BOTTOM: Team strip — Estimator or Costing Art based on role ── */}
      <div className="or-team">
        <p style={{fontSize:'0.45rem',letterSpacing:'0.18em',textTransform:'uppercase',
          color:'rgba(255,255,255,0.22)',fontWeight:700,margin:'0 0 8px',flexShrink:0}}>
          {isCostingRole ? 'Costing Art Team' : 'Estimator Team'}
        </p>
        <div style={{display:'flex',gap:8,overflowX:'auto',flex:1,alignItems:'center',paddingBottom:2}}>
          {(isCostingRole ? COSTING_ROSTER : EST_ROSTER).map(er => {
            const stats = isCostingRole
              ? costingRoster.find(x => x.name === er.name)
              : estRoster.find(x => x.name === er.name);
            const inHand  = stats ? (stats.active + (stats.pending||0)) : 0;
            const done    = stats ? stats.done : 0;
            const online  = stats ? isOnline(stats) : false;
            const idle    = inHand === 0;
            return (
              <div key={er.name}
                style={{display:'flex',alignItems:'center',gap:9,padding:'6px 12px',
                  borderRadius:10,flexShrink:0,
                  border: idle ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(99,180,255,0.18)',
                  background: idle ? 'rgba(255,255,255,0.015)' : 'rgba(99,160,255,0.06)',
                  opacity: idle ? 0.42 : 1,
                  transition:'opacity 0.2s'}}>
                <div style={{position:'relative',flexShrink:0}}>
                  <EstAvatar name={er.name} code={er.code} size={38}/>
                  <span style={{position:'absolute',bottom:0,right:0,width:8,height:8,borderRadius:'50%',
                    background: idle ? 'rgba(255,255,255,0.18)' : (online ? '#22c55e' : 'rgba(255,255,255,0.18)'),
                    border:'2px solid rgba(4,2,14,0.95)',
                    boxShadow: (!idle && online) ? '0 0 5px rgba(34,197,94,0.70)' : 'none'}}/>
                </div>
                <div style={{minWidth:0}}>
                  <p style={{fontSize:'0.72rem',fontWeight:700,
                    color: idle ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.88)',
                    margin:'0 0 4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:120}}>{er.name}</p>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.58rem',
                      color: idle ? 'rgba(255,255,255,0.25)' : 'rgba(251,191,36,0.90)',fontWeight:700}}>
                      <span style={{width:4,height:4,borderRadius:'50%',
                        background: idle ? 'rgba(255,255,255,0.25)' : 'rgba(251,191,36,0.90)',flexShrink:0}}/>
                      {inHand} In Hand
                    </span>
                    <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.58rem',
                      color: idle ? 'rgba(255,255,255,0.22)' : 'rgba(52,211,153,0.80)',fontWeight:700}}>
                      <span style={{width:4,height:4,borderRadius:'50%',
                        background: idle ? 'rgba(255,255,255,0.22)' : 'rgba(52,211,153,0.80)',flexShrink:0}}/>
                      {done} Done
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>{/* end right column */}

      {/* ── Delete confirmation modal (Cost Artist only) ── */}
      {deleteConfirm !== null && (
        <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.65)',backdropFilter:'blur(8px)'}}>
          <div style={{background:'rgba(10,4,20,0.98)',border:'1px solid rgba(220,60,60,0.38)',borderRadius:16,padding:'28px 32px',maxWidth:380,width:'92%',boxShadow:'0 24px 70px rgba(0,0,0,0.75)',display:'flex',flexDirection:'column',gap:18,animation:'fadeUp 0.2s ease both'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{width:10,height:10,borderRadius:'50%',background:'rgba(220,60,60,0.90)',boxShadow:'0 0 12px rgba(220,60,60,0.60)',flexShrink:0}}/>
              <span style={{fontSize:'0.60rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(220,80,80,0.80)',fontWeight:700,fontFamily:F}}>Cost Artist · Delete Request</span>
            </div>
            <p style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.80)',lineHeight:1.6,margin:0,fontFamily:F}}>
              Permanently delete request <strong style={{color:'rgba(100,180,255,0.95)',fontFamily:'monospace'}}>{deleteConfirm.id}</strong>? This cannot be undone.
            </p>
            <div>
              <div style={{fontSize:'0.56rem',color:'rgba(255,100,100,0.60)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:6,fontFamily:F}}>
                Type <strong style={{color:'rgba(255,150,150,0.90)',letterSpacing:'0.08em'}}>xepa</strong> to confirm
              </div>
              <input
                autoFocus
                value={deleteCode}
                onChange={e=>setDeleteCode(e.target.value)}
                placeholder="xepa"
                style={{width:'100%',background:'rgba(0,0,0,0.40)',border:`1px solid ${deleteCode.toLowerCase()==='xepa'?'rgba(220,60,60,0.60)':'rgba(255,255,255,0.12)'}`,borderRadius:7,padding:'9px 13px',color:'rgba(255,180,180,0.95)',fontFamily:'monospace',fontSize:'0.95rem',letterSpacing:'0.18em',outline:'none',transition:'border-color 0.2s'}}
              />
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={()=>{setDeleteConfirm(null);setDeleteCode('');}}
                style={{padding:'9px 22px',borderRadius:8,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.60)',cursor:'pointer',fontFamily:F,fontSize:'0.82rem',fontWeight:600,outline:'none',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.10)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                Cancel
              </button>
              <button
                disabled={deleteCode.toLowerCase()!=='xepa'}
                onClick={()=>{ if(deleteCode.toLowerCase()==='xepa'){onDelete(deleteConfirm.idx);setDeleteConfirm(null);setDeleteCode('');} }}
                style={{padding:'9px 22px',borderRadius:8,background:deleteCode.toLowerCase()==='xepa'?'rgba(200,40,40,0.25)':'rgba(255,255,255,0.03)',border:`1px solid ${deleteCode.toLowerCase()==='xepa'?'rgba(220,60,60,0.55)':'rgba(255,255,255,0.08)'}`,color:deleteCode.toLowerCase()==='xepa'?'rgba(255,100,100,0.95)':'rgba(255,255,255,0.20)',cursor:deleteCode.toLowerCase()==='xepa'?'pointer':'not-allowed',fontFamily:F,fontSize:'0.82rem',fontWeight:700,outline:'none',transition:'all 0.2s'}}
                onMouseEnter={e=>{if(deleteCode.toLowerCase()==='xepa')e.currentTarget.style.background='rgba(200,40,40,0.38)';}}
                onMouseLeave={e=>{if(deleteCode.toLowerCase()==='xepa')e.currentTarget.style.background='rgba(200,40,40,0.25)';}}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ─── NOTIFICATION HELPERS ─────────────────────────────────────────────────────
const _getSeen = () => { try { return JSON.parse(localStorage.getItem('apex_seen_msgs')||'{}'); } catch { return {}; }};
const _markSeen = (reqId, watchRole) => {
  const s = _getSeen(); s[reqId] = {...(s[reqId]||{}), [watchRole]: Date.now()};
  localStorage.setItem('apex_seen_msgs', JSON.stringify(s));
};
const _unreadCount = (convo, reqId, watchRole) => {
  const last = (_getSeen()[reqId]||{})[watchRole] || 0;
  return (convo||[]).filter(m => m.role===watchRole && (m.tsMs||0) > last).length;
};

const NotifToast = ({ toasts, onDismiss }) => (
  <div style={{position:'fixed',bottom:28,right:28,zIndex:99999,display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end',pointerEvents:'none'}}>
    {toasts.map(t=>(
      <div key={t.id} onClick={()=>onDismiss(t.id)}
        style={{
          background: t.type==='oos' ? 'rgba(22,4,4,0.97)' : t.type==='rfi' ? 'rgba(18,10,0,0.97)' : 'rgba(8,4,22,0.97)',
          border: `1px solid ${t.type==='oos' ? 'rgba(220,60,60,0.55)' : t.type==='rfi' ? 'rgba(251,191,36,0.45)' : 'rgba(100,210,255,0.38)'}`,
          borderRadius:12,padding:'12px 16px',width:294,
          boxShadow: t.type==='oos' ? '0 10px 40px rgba(200,40,40,0.30)' : '0 10px 40px rgba(0,0,0,0.70)',
          animation:'notifIn 0.32s cubic-bezier(0.22,1,0.36,1) both',
          display:'flex',flexDirection:'column',gap:5,pointerEvents:'auto',cursor:'pointer',backdropFilter:'blur(14px)',
        }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <span style={{fontSize:'0.50rem',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,fontFamily:"'Inter',sans-serif",
            color: t.type==='oos' ? 'rgba(255,90,90,0.90)' : t.type==='rfi' ? 'rgba(251,191,36,0.90)' : 'rgba(100,210,255,0.80)'}}>
            {t.type==='oos' ? `⊘ Cancelled · ${t.reqId}` : t.type==='rfi' ? `📋 RFI · ${t.reqId}` : `💬 New Message · ${t.reqId}`}
          </span>
          <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.28)',lineHeight:1}}>✕</span>
        </div>
        <div style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.90)',fontWeight:700,fontFamily:"'Inter',sans-serif",overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.client||t.proj||'—'}</div>
        {t.type==='oos' ? (
          <div style={{display:'flex',flexDirection:'column',gap:2,fontFamily:"'Inter',sans-serif"}}>
            <span style={{fontSize:'0.68rem',color:'rgba(255,100,100,0.80)',fontWeight:600}}>Cancelled - Due to Invalid Documents</span>
            {t.text && <span style={{fontSize:'0.64rem',color:'rgba(255,180,180,0.50)',fontStyle:'italic',lineHeight:1.4}}>{t.text.slice(0,80)}{t.text.length>80?'…':''}</span>}
          </div>
        ) : t.type==='rfi' ? (
          <div style={{display:'flex',flexDirection:'column',gap:2,fontFamily:"'Inter',sans-serif"}}>
            <span style={{fontSize:'0.68rem',color:'rgba(251,191,36,0.85)',fontWeight:600}}>RFI — Estimator needs more information</span>
            {t.text && <span style={{fontSize:'0.64rem',color:'rgba(255,220,120,0.50)',fontStyle:'italic',lineHeight:1.4}}>{t.text.slice(0,80)}{t.text.length>80?'…':''}</span>}
          </div>
        ) : (
          <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.48)',lineHeight:1.4,fontFamily:"'Inter',sans-serif"}}><span style={{color:'rgba(168,85,247,0.95)',fontWeight:600}}>{t.from}: </span>{(t.text||'').slice(0,90)}{(t.text||'').length>90?'…':''}</div>
        )}
      </div>
    ))}
  </div>
);

// ─── TRACK YOUR QUOTATION ────────────────────────────────────────────────────
const TrackQuotation = ({ requests, spName, showAll, onUpdate, userCode='' }) => {
  const F = "'Inter',sans-serif";
  const [search, setSearch]     = useState('');
  const [openIdx, setOpenIdx]   = useState(null);
  const [statFilter, setStatFilter] = useState(null); // null | 'approved' | 'inProgress' | 'rejected'
  const [chatMsg, setChatMsg]   = useState('');
  const chatEndRef              = useRef(null);
  const [seenTs, setSeenTs]       = useState(() => _getSeen());
  const [showAddPpl, setShowAddPpl] = useState(false);
  const [addPplQ,    setAddPplQ]    = useState('');
  const addPplRef = useRef(null);
  const [recallOpen, setRecallOpen]     = useState(null); // req.id being recalled
  const [recallDocs, setRecallDocs]     = useState([]);
  const [recallUpState, setRecallUpState] = useState(null);
  const recallFileRef = useRef(null);
  const [rfiRespondOpen, setRfiRespondOpen] = useState(null); // req.id with active RFI respond panel
  const [rfiDocs, setRfiDocs]           = useState([]);
  const [rfiDocUpState, setRfiDocUpState] = useState(null);
  const [rfiNote, setRfiNote]           = useState('');
  const rfiFileRef = useRef(null);

  const handleRecall = (req, realIdx) => {
    const nowMs = Date.now();
    onUpdate(req.id, {
      reqStatus:           'not-started',
      status:              'Pending Estimation',
      outScopeRemark:      null,
      outScopeAt:          null,
      outScopeBy:          null,
      outOfScopeSubmitted: null,
      oosNotification:     null,
      estimator:           null,
      estimationFile:      null,
      estimationDocs:      [],
      directorAction:      null,
      directorNote:        null,
      directorRespondedAt: null,
      submittedAt:         new Date(nowMs).toISOString(),
      docs:                recallDocs.length ? recallDocs : (req.docs || []),
      timeline: [...(req.timeline || []), {
        event: 'recalled',
        ts:    new Date(nowMs).toISOString(),
        tsMs:  nowMs,
        label: 'Resubmitted by Sales — Back in Estimation Queue',
        by:    req.salesPerson || spName || 'Sales',
      }],
      _immediate: true,
    });
    setRecallOpen(null);
    setRecallDocs([]);
  };

  const handleRfiRespond = (req) => {
    const nowMs = Date.now();
    const addedDocs = rfiDocs.length ? [...(req.docs || []), ...rfiDocs] : (req.docs || []);
    onUpdate(req.id, {
      reqStatus:      'not-started',
      status:         'Pending Estimation',
      rfiRemark:      null,
      rfiAt:          null,
      rfiBy:          null,
      rfiSubmitted:   null,
      rfiNotification: null,
      docs:           addedDocs,
      timeline: [...(req.timeline || []), {
        event: 'rfi-responded',
        ts:    new Date(nowMs).toISOString(),
        tsMs:  nowMs,
        label: 'Sales Responded to RFI — Info Provided',
        by:    req.salesPerson || spName || 'Sales',
        remark: rfiNote.trim() || undefined,
      }],
      _immediate: true,
    });
    setRfiRespondOpen(null);
    setRfiDocs([]);
    setRfiNote('');
  };

  const markReqSeen = (reqId) => {
    _markSeen(reqId, 'estimator');
    setSeenTs(_getSeen());
  };

  useEffect(() => {
    if (!showAddPpl) return;
    const close = e => { if (addPplRef.current && !addPplRef.current.contains(e.target)) { setShowAddPpl(false); setAddPplQ(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showAddPpl]);

  const myReqs = requests.filter(r => {
    if (!r) return false;
    const spL = (spName || '').toLowerCase();
    const codeU = (userCode || '').toUpperCase();
    const matchSP = showAll ||
      (spL && (r.salesPerson || '').toLowerCase() === spL) ||
      (spL && (r.submittedBy || '').toLowerCase() === spL) ||
      (codeU && (r.salesPerson || '').toUpperCase() === codeU) ||
      (codeU && (r.submittedBy || '').toUpperCase() === codeU);
    const matchSearch = !search || r.id?.toLowerCase().includes(search.toLowerCase()) || (r.proj||'').toLowerCase().includes(search.toLowerCase()) || (r.client||'').toLowerCase().includes(search.toLowerCase());
    return matchSP && matchSearch;
  }).sort((a,b) => {
    const av = +(new Date(a.submittedAt||a.date||0));
    const bv = +(new Date(b.submittedAt||b.date||0));
    return bv - av;
  });

  const STAGES = [
    { key:'submitted',  label:'Submitted',         color:'rgba(100,180,255,0.90)' },
    { key:'assigned',   label:'Estimator Assigned', color:'rgba(255,200,50,0.90)'  },
    { key:'quoted',     label:'Quotation Ready',    color:'rgba(168,85,247,0.90)'  },
    { key:'dir_review', label:'Cost-Artist Review',    color:'rgba(255,140,50,0.90)'  },
    { key:'completed',  label:'Approved',           color:'rgba(0,220,130,0.90)'   },
  ];

  const getStageIdx = r => {
    if (r.reqStatus === 'completed' || r.directorAction === 'approved') return 4;
    if (r.reqStatus === 'pending-director') return 3;
    if (r.estimationFile || r.estimationDocs?.length) return 2;
    if (r.estimator) return 1;
    return 0;
  };
  const statusColor = r => {
    if (r.reqStatus === 'out-of-scope') return 'rgba(255,70,70,0.95)';
    if (r.reqStatus === 'rfi') return 'rgba(251,191,36,0.95)';
    if (r.reqStatus === 'completed' || r.directorAction === 'approved') return 'rgba(0,220,130,0.90)';
    if (r.directorAction === 'rejected') return 'rgba(255,80,80,0.90)';
    if (r.directorAction === 'revised')  return 'rgba(255,160,40,0.90)';
    if (r.reqStatus === 'pending-director') return 'rgba(255,140,50,0.90)';
    if (r.estimationFile) return 'rgba(168,85,247,0.90)';
    if (r.estimator)      return 'rgba(255,200,50,0.90)';
    return 'rgba(100,180,255,0.90)';
  };
  const statusLabel = r => {
    if (r.reqStatus === 'out-of-scope') return 'Cancelled';
    if (r.reqStatus === 'rfi') return 'RFI — Awaiting Info';
    if (r.reqStatus === 'completed' || r.directorAction === 'approved') return 'Approved';
    if (r.directorAction === 'rejected') return 'Rejected';
    if (r.directorAction === 'revised')  return 'Revision Required';
    if (r.reqStatus === 'pending-director') return 'Awaiting Cost-Artist';
    if (r.estimationFile) return 'Quotation Ready';
    if (r.estimator)      return 'Being Estimated';
    return 'Pending Assignment';
  };

  const sendMsg = (req, realIdx) => {
    if (!chatMsg.trim() || !onUpdate) return;
    const ts = new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
    onUpdate(req.id, { conversation:[...(req.conversation||[]),{from:req.salesPerson||spName||'Sales',role:'sales',text:chatMsg.trim(),ts,tsMs:Date.now()}] });
    setChatMsg('');
    setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:'smooth'}),60);
  };

  /* ── DETAIL VIEW ── */
  if (openIdx !== null) {
    const r = myReqs[openIdx];
    if (!r) { setOpenIdx(null); return null; }
    const realIdx = requests.indexOf(r);
    const sc = statusColor(r);
    const sl = statusLabel(r);
    const stageIdx = getStageIdx(r);
    const isApprovedByDirector = r.directorAction === 'approved' || r.reqStatus === 'completed';
    const approvedQuotDocs = isApprovedByDirector
      ? (r.salesApprovedDocs?.length > 0
          ? (r.estimationDocs || []).filter(d => d && r.salesApprovedDocs.includes(d.id))
          : (r.estimationDocs?.length > 0 ? r.estimationDocs : [r.estimationDoc].filter(Boolean)))
      : [];
    const quotReady = isApprovedByDirector && approvedQuotDocs.length > 0;
    const infoRows = [
      ['Request ID', r.id], ['Project', r.proj||'—'], ['Client', r.client||'—'],
      ['Deal Type', r.deal||'—'], ['Supply', r.supplyOnly?'Supply Only':r.supplyInstall?'Supply & Install':'—'],
      ['Main Contractor', r.mainContractor||'—'],
      ['Consultant', r.consultant||'—'], ['Email', r.email||'—'],
      ['MOB', r.mob||'—'], ['Lead Time', r.leadTime||'—'],
      ['Estimator', r.estimator||'—'], ['Submitted', r.date||'—'],
      ...(r.remarks ? [['Remarks', r.remarks]] : []),
    ];
    const msgs = r.conversation || [];
    return (
      <div style={{position:'relative',width:'100%',height:'100%',padding:'66px 32px 24px',fontFamily:F,color:'#e2e8f0',overflowY:'auto'}}>
        {/* Back + header */}
        <button onClick={()=>setOpenIdx(null)} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontFamily:F,fontSize:'0.82rem',display:'flex',alignItems:'center',gap:6,marginBottom:18}}>
          ← Back to Quotations
        </button>
        {/* Status bar */}
        <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${sc}40`,borderRadius:10,padding:'12px 20px',display:'flex',alignItems:'center',gap:12,marginBottom:24,flexWrap:'wrap'}}>
          <span style={{width:10,height:10,borderRadius:'50%',background:sc,boxShadow:`0 0 8px ${sc}`,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:2}}>Status</div>
            <div style={{fontSize:'0.96rem',fontWeight:700,color:sc}}>{sl}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:2}}>Request ID</div>
            <div style={{fontFamily:'monospace',fontSize:'0.90rem',fontWeight:700,color:'rgba(220,165,0,0.90)'}}>{r.id}</div>
          </div>
        </div>
        {/* Stage tracker */}
        <div style={{background: r.reqStatus==='out-of-scope' ? 'rgba(200,40,40,0.06)' : r.reqStatus==='rfi' ? 'rgba(180,120,0,0.06)' : 'rgba(255,255,255,0.03)', border: r.reqStatus==='out-of-scope' ? '1px solid rgba(220,60,60,0.35)' : r.reqStatus==='rfi' ? '1px solid rgba(251,191,36,0.30)' : '1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'16px 20px',marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:0}}>
            {STAGES.map((st,si)=>{
              const done=si<=stageIdx; const active=si===stageIdx && r.reqStatus!=='out-of-scope';
              const cancelled = r.reqStatus==='out-of-scope';
              const rfi = r.reqStatus==='rfi';
              return (
                <div key={st.key} style={{display:'flex',alignItems:'center',flex:1}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                    <div style={{width:'100%',height:4,background: cancelled && si>stageIdx ? 'rgba(255,255,255,0.04)' : done?st.color:'rgba(255,255,255,0.07)',borderRadius:2}}/>
                    <div style={{width:10,height:10,borderRadius:'50%',marginTop:-7,background: cancelled && si===stageIdx ? 'rgba(255,70,70,0.80)' : rfi && si===stageIdx ? 'rgba(251,191,36,0.85)' : done?st.color:'rgba(255,255,255,0.12)',boxShadow:active?`0 0 10px ${st.color}`:cancelled&&si===stageIdx?'0 0 10px rgba(255,70,70,0.60)':rfi&&si===stageIdx?'0 0 10px rgba(251,191,36,0.60)':undefined,border:active?`2px solid ${st.color}`:'2px solid transparent'}}/>
                    <div style={{fontSize:'0.52rem',color: cancelled&&si===stageIdx?'rgba(255,70,70,0.90)':rfi&&si===stageIdx?'rgba(251,191,36,0.90)':done?st.color:'rgba(255,255,255,0.22)',marginTop:5,letterSpacing:'0.05em',textAlign:'center',fontWeight:done?600:400,whiteSpace:'nowrap'}}>{st.label}</div>
                  </div>
                  {si<STAGES.length-1&&<div style={{width:6,flexShrink:0}}/>}
                </div>
              );
            })}
          </div>
          {r.reqStatus === 'rfi' && (
            <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid rgba(251,191,36,0.20)',display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(180,120,0,0.20)',border:'1px solid rgba(251,191,36,0.40)',fontSize:'0.90rem'}}>📋</div>
              <div>
                <div style={{fontSize:'0.62rem',fontWeight:800,letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(251,191,36,0.95)',marginBottom:3}}>RFI — Estimator Waiting for More Info from Sales</div>
                <div style={{fontSize:'0.72rem',color:'rgba(255,230,140,0.65)'}}>RFI - Awaiting Info from Sales</div>
                {r.rfiRemark && (
                  <div style={{marginTop:6,fontSize:'0.74rem',color:'rgba(255,220,120,0.72)',fontStyle:'italic',borderLeft:'2px solid rgba(251,191,36,0.40)',paddingLeft:8,lineHeight:1.5}}>"{r.rfiRemark}"</div>
                )}
                <div style={{marginTop:5,fontSize:'0.60rem',color:'rgba(255,255,255,0.28)'}}>By {r.rfiBy||'estimator'}{r.rfiAt ? ` · ${new Date(r.rfiAt).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}` : ''}</div>
                {onUpdate && (
                  <div style={{marginTop:12}}>
                    {rfiRespondOpen !== r.id ? (
                      <button onClick={()=>{setRfiRespondOpen(r.id);setRfiDocs([]);setRfiNote('');setRfiDocUpState(null);}}
                        style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 16px',borderRadius:8,background:'rgba(180,120,0,0.18)',border:'1px solid rgba(251,191,36,0.42)',color:'rgba(251,220,80,0.92)',fontFamily:F,fontSize:'0.74rem',fontWeight:700,cursor:'pointer',outline:'none'}}>
                        ↺ Respond to RFI — Provide Info
                      </button>
                    ) : (
                      <div style={{background:'rgba(180,120,0,0.10)',border:'1px solid rgba(251,191,36,0.28)',borderRadius:10,padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>
                        <div style={{fontSize:'0.66rem',color:'rgba(255,220,100,0.75)',lineHeight:1.6}}>Upload additional documents and/or add a note to respond to the RFI. The estimator will continue with the updated information.</div>
                        <textarea value={rfiNote} onChange={e=>setRfiNote(e.target.value)}
                          placeholder="Add a note for the estimator (optional)…"
                          rows={2}
                          style={{width:'100%',background:'rgba(180,120,0,0.07)',border:'1px solid rgba(251,191,36,0.25)',borderRadius:8,color:'rgba(255,230,140,0.88)',fontFamily:F,fontSize:'0.78rem',padding:'7px 10px',outline:'none',resize:'vertical',lineHeight:1.5,boxSizing:'border-box'}}/>
                        <div style={{display:'flex',flexWrap:'wrap',gap:7,alignItems:'center'}}>
                          <input ref={rfiFileRef} type="file" multiple style={{display:'none'}} onChange={async e=>{
                            if (!e.target.files?.length) return;
                            setRfiDocUpState('uploading');
                            try {
                              const uploaded=[];
                              for (const file of Array.from(e.target.files)) {
                                const url = await uploadToSharePoint(file, r.id, file.name);
                                if (url) uploaded.push({id:Math.random().toString(36).slice(2)+Date.now().toString(36),name:file.name,type:file.type,url,verified:true});
                              }
                              setRfiDocs(prev=>[...prev,...uploaded]);
                              setRfiDocUpState(null);
                            } catch { setRfiDocUpState(null); }
                            e.target.value='';
                          }}/>
                          <button onClick={()=>rfiFileRef.current?.click()} disabled={rfiDocUpState==='uploading'}
                            style={{padding:'4px 12px',borderRadius:7,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',color:rfiDocUpState==='uploading'?'rgba(255,255,255,0.35)':'rgba(255,255,255,0.75)',fontFamily:F,fontSize:'0.68rem',fontWeight:600,cursor:'pointer',outline:'none'}}>
                            {rfiDocUpState==='uploading'?'⟳ Uploading…':'+ Add Documents'}
                          </button>
                          {rfiDocs.map((d,di)=>(
                            <span key={di} style={{fontSize:'0.62rem',color:'rgba(100,210,150,0.85)',background:'rgba(0,180,100,0.08)',border:'1px solid rgba(0,200,120,0.25)',borderRadius:5,padding:'2px 9px'}}>{d.name}</span>
                          ))}
                        </div>
                        <div style={{display:'flex',gap:10}}>
                          <button onClick={()=>handleRfiRespond(r)} disabled={rfiDocUpState==='uploading'}
                            style={{flex:1,padding:'7px 0',borderRadius:8,background:'rgba(180,120,0,0.45)',border:'1px solid rgba(251,191,36,0.60)',color:'rgba(255,230,80,0.96)',fontFamily:F,fontSize:'0.76rem',fontWeight:700,cursor:'pointer',outline:'none'}}>
                            ✓ Submit Response — Resume Estimation
                          </button>
                          <button onClick={()=>{setRfiRespondOpen(null);setRfiDocs([]);setRfiNote('');}}
                            style={{padding:'7px 18px',borderRadius:8,background:'transparent',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.42)',fontFamily:F,fontSize:'0.76rem',cursor:'pointer',outline:'none'}}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {r.reqStatus === 'out-of-scope' && (
            <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid rgba(220,60,60,0.20)',display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(220,50,50,0.18)',border:'1px solid rgba(220,60,60,0.40)',fontSize:'0.90rem'}}>⊘</div>
              <div>
                <div style={{fontSize:'0.62rem',fontWeight:800,letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(255,70,70,0.95)',marginBottom:3}}>Cancelled by Cost-Artist — Timeline Frozen</div>
                <div style={{fontSize:'0.72rem',color:'rgba(255,200,200,0.65)'}}>Cancelled - Due to Invalid Documents</div>
                {r.outScopeRemark && (
                  <div style={{marginTop:6,fontSize:'0.74rem',color:'rgba(255,180,180,0.72)',fontStyle:'italic',borderLeft:'2px solid rgba(220,60,60,0.40)',paddingLeft:8,lineHeight:1.5}}>"{r.outScopeRemark}"</div>
                )}
                <div style={{marginTop:5,fontSize:'0.60rem',color:'rgba(255,255,255,0.28)'}}>By {r.outScopeBy||'Cost-Artist'}{r.outScopeAt ? ` · ${new Date(r.outScopeAt).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}` : ''}</div>
                {onUpdate && (
                  <div style={{marginTop:12}}>
                    {recallOpen !== r.id ? (
                      <button onClick={()=>{setRecallOpen(r.id);setRecallDocs([]);setRecallUpState(null);}}
                        style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 16px',borderRadius:8,background:'rgba(109,40,217,0.18)',border:'1px solid rgba(168,85,247,0.42)',color:'rgba(196,181,253,0.92)',fontFamily:F,fontSize:'0.74rem',fontWeight:700,cursor:'pointer',outline:'none'}}>
                        ↺ Recall &amp; Resubmit with Valid Documents
                      </button>
                    ) : (
                      <div style={{background:'rgba(109,40,217,0.12)',border:'1px solid rgba(168,85,247,0.30)',borderRadius:10,padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>
                        <div style={{fontSize:'0.66rem',color:'rgba(196,181,253,0.75)',lineHeight:1.6}}>Upload replacement documents (optional), then confirm to reset the timeline and re-enter the estimation queue.</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:7,alignItems:'center'}}>
                          <input ref={recallFileRef} type="file" multiple style={{display:'none'}} onChange={async e=>{
                            if (!e.target.files?.length) return;
                            setRecallUpState('uploading');
                            try {
                              const uploaded=[];
                              for (const file of Array.from(e.target.files)) {
                                const url = await uploadToSharePoint(file, r.id, file.name);
                                if (url) uploaded.push({id:Math.random().toString(36).slice(2)+Date.now().toString(36),name:file.name,type:file.type,url,verified:true});
                              }
                              setRecallDocs(prev=>[...prev,...uploaded]);
                              setRecallUpState(null);
                            } catch { setRecallUpState(null); }
                            e.target.value='';
                          }}/>
                          <button onClick={()=>recallFileRef.current?.click()} disabled={recallUpState==='uploading'}
                            style={{padding:'4px 12px',borderRadius:7,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',color:recallUpState==='uploading'?'rgba(255,255,255,0.35)':'rgba(255,255,255,0.75)',fontFamily:F,fontSize:'0.68rem',fontWeight:600,cursor:'pointer',outline:'none'}}>
                            {recallUpState==='uploading'?'⟳ Uploading…':'+ Add Replacement Docs'}
                          </button>
                          {recallDocs.map((d,di)=>(
                            <span key={di} style={{fontSize:'0.62rem',color:'rgba(100,210,150,0.85)',background:'rgba(0,180,100,0.08)',border:'1px solid rgba(0,200,120,0.25)',borderRadius:5,padding:'2px 9px'}}>{d.name}</span>
                          ))}
                        </div>
                        <div style={{display:'flex',gap:10}}>
                          <button onClick={()=>handleRecall(r, realIdx)} disabled={recallUpState==='uploading'}
                            style={{flex:1,padding:'7px 0',borderRadius:8,background:'rgba(109,40,217,0.55)',border:'1px solid rgba(168,85,247,0.60)',color:'rgba(220,200,255,0.96)',fontFamily:F,fontSize:'0.76rem',fontWeight:700,cursor:'pointer',outline:'none'}}>
                            ✓ Confirm Resubmission — Fresh Timeline
                          </button>
                          <button onClick={()=>{setRecallOpen(null);setRecallDocs([]);}}
                            style={{padding:'7px 18px',borderRadius:8,background:'transparent',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.42)',fontFamily:F,fontSize:'0.76rem',cursor:'pointer',outline:'none'}}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* 2-col: info + chat */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.15fr',gap:20,alignItems:'start'}}>
          {/* LEFT — info + download */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'16px 18px'}}>
              <p style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:10}}>Request Info</p>
              {infoRows.map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'5px 0',gap:10}}>
                  <span style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{k}</span>
                  <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.75)',textAlign:'left'}}>{v}</span>
                </div>
              ))}
            </div>
            {/* Submitted documents — always visible to sales */}
            {r.docs?.filter(d => d && typeof d === 'object').length > 0 && (
              <div style={{background:'rgba(0,160,255,0.04)',border:'1px solid rgba(0,160,255,0.18)',borderRadius:10,padding:'16px 18px'}}>
                <p style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,180,255,0.60)',marginBottom:10}}>Submitted Documents</p>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {r.docs.filter(d => d && typeof d === 'object').map((d,i)=>(
                    <button key={i} onClick={()=>downloadDoc(d)}
                      style={{display:'flex',alignItems:'center',gap:8,padding:'8px 13px',borderRadius:8,background:'rgba(0,160,255,0.08)',border:'1px solid rgba(0,160,255,0.24)',color:'rgba(100,190,255,0.90)',fontFamily:F,fontSize:'0.78rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',width:'100%',textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(0,160,255,0.16)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(0,160,255,0.08)'}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.name||`Document_${i+1}`}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Download quotation — only cost-artist approved files */}
            <div style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${quotReady?'rgba(168,85,247,0.30)':isApprovedByDirector?'rgba(0,220,130,0.14)':'rgba(255,255,255,0.07)'}`,borderRadius:10,padding:'16px 18px'}}>
              <p style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:quotReady?'rgba(168,85,247,0.70)':isApprovedByDirector?'rgba(0,220,130,0.50)':'rgba(255,255,255,0.22)',marginBottom:10}}>Approved Quotation</p>
              {quotReady ? (
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {approvedQuotDocs.map((d,i)=>(
                    <button key={i} onClick={()=>downloadDoc(d)}
                      style={{display:'flex',alignItems:'center',gap:8,padding:'9px 14px',borderRadius:8,background:'rgba(168,85,247,0.10)',border:'1px solid rgba(168,85,247,0.28)',color:'rgba(210,170,255,0.90)',fontFamily:F,fontSize:'0.80rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',width:'100%',textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(168,85,247,0.20)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(168,85,247,0.10)'}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d?.name || r.estimationFile || `Quotation_${r.id}`}</span>
                    </button>
                  ))}
                </div>
              ) : isApprovedByDirector ? (
                <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.28)',lineHeight:1.6,margin:0}}>No quotation files released by Cost-Artist yet.</p>
              ) : (
                <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.25)',lineHeight:1.6,margin:0}}>Quotation available once approved by Cost-Artist.</p>
              )}
            </div>
            {/* Director remarks */}
            {r.directorAction && (
              <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'14px 18px'}}>
                <p style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:8}}>Cost-Artist's Decision</p>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:r.directorNote?8:0}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:sc,boxShadow:`0 0 5px ${sc}`,flexShrink:0}}/>
                  <span style={{fontSize:'0.80rem',fontWeight:700,color:sc}}>{sl}</span>
                </div>
                {r.directorNote && <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.60)',lineHeight:1.55,margin:0,paddingLeft:14,borderLeft:`2px solid ${sc}40`}}>{r.directorNote}</p>}
              </div>
            )}
          </div>
          {/* RIGHT — Chat box */}
          <div style={{background:'rgba(109,40,17,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:14,padding:'18px 18px 14px',display:'flex',flexDirection:'column',gap:12,minHeight:520}}>
            <div style={{display:'flex',alignItems:'center',gap:8,paddingBottom:10,borderBottom:'1px solid rgba(168,85,247,0.18)',position:'relative'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(168,85,247,0.90)',boxShadow:'0 0 8px rgba(168,85,247,0.70)',flexShrink:0}}/>
              <p style={{fontSize:'0.60rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(168,85,247,0.85)',margin:0,fontWeight:700}}>Conversation</p>
              {/* Participants + add button */}
              <div ref={addPplRef} style={{display:'flex',alignItems:'center',gap:5,marginLeft:'auto'}}>
                {(r.chatParticipants||[]).map((p,pi)=>(
                  <div key={pi} title={p.name} style={{position:'relative',cursor:'default'}}>
                    <EstAvatar name={p.name} code={p.code} size={22}/>
                  </div>
                ))}
                {onUpdate && (
                  <button onClick={()=>{setShowAddPpl(o=>!o);setAddPplQ('');}}
                    title="Add person to conversation"
                    style={{width:24,height:24,borderRadius:'50%',background:'rgba(168,85,247,0.18)',border:'1px solid rgba(168,85,247,0.40)',color:'rgba(168,85,247,0.95)',fontSize:'1.1rem',lineHeight:1,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,outline:'none',fontWeight:300}}>+</button>
                )}
                {showAddPpl && (
                  <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,zIndex:300,background:'rgba(10,5,26,0.98)',border:'1px solid rgba(168,85,247,0.38)',borderRadius:10,padding:'10px',width:230,boxShadow:'0 12px 44px rgba(0,0,0,0.70)',backdropFilter:'blur(16px)'}}>
                    <div style={{fontSize:'0.50rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(168,85,247,0.60)',fontWeight:700,marginBottom:8}}>Add to conversation</div>
                    <input value={addPplQ} onChange={e=>setAddPplQ(e.target.value)} placeholder="Search name…"
                      autoFocus
                      style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:6,padding:'6px 10px',color:'rgba(255,255,255,0.82)',fontFamily:F,fontSize:'0.76rem',outline:'none',marginBottom:6,boxSizing:'border-box'}}/>
                    <div style={{maxHeight:180,overflowY:'auto',display:'flex',flexDirection:'column',gap:2}}>
                      {FULL_STAFF
                        .filter(s => !(r.chatParticipants||[]).some(p=>p.code===s.code))
                        .filter(s => !addPplQ || s.name.toLowerCase().includes(addPplQ.toLowerCase()))
                        .map(s => (
                          <div key={s.code}
                            onClick={()=>{ onUpdate(r.id,{chatParticipants:[...(r.chatParticipants||[]),{name:s.name,code:s.code,role:s.role}]}); setShowAddPpl(false); setAddPplQ(''); }}
                            style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',borderRadius:7,cursor:'pointer',transition:'background 0.15s'}}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(168,85,247,0.18)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <EstAvatar name={s.name} code={s.code} size={24}/>
                            <div style={{display:'flex',flexDirection:'column',gap:1,minWidth:0}}>
                              <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.82)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</span>
                              <span style={{fontSize:'0.50rem',color:s.role==='sales'?'rgba(255,200,80,0.60)':'rgba(100,200,255,0.55)',letterSpacing:'0.08em',textTransform:'uppercase'}}>{s.role}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Messages */}
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:10,overflowY:'auto',minHeight:0,maxHeight:360,paddingRight:4,scrollbarWidth:'thin',scrollbarColor:'rgba(168,85,247,0.20) transparent'}}>
              {msgs.length === 0 ? (
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:10,opacity:0.4}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.70)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.30)',margin:0,fontStyle:'italic'}}>No messages yet. Start the conversation.</p>
                </div>
              ) : msgs.map((msg,i)=>{
                const isSales = msg.role==='sales';
                return (
                  <div key={i} style={{display:'flex',flexDirection:'column',alignItems:isSales?'flex-end':'flex-start'}}>
                    <div style={{maxWidth:'82%',background:isSales?'rgba(109,40,217,0.28)':'rgba(255,255,255,0.06)',border:isSales?'1px solid rgba(168,85,247,0.35)':'1px solid rgba(255,255,255,0.10)',borderRadius:isSales?'14px 14px 3px 14px':'14px 14px 14px 3px',padding:'9px 13px'}}>
                      <div style={{fontSize:'0.58rem',color:isSales?'rgba(196,181,253,0.70)':'rgba(100,200,255,0.65)',marginBottom:4,fontWeight:600}}>{msg.from} · {msg.ts}</div>
                      <div style={{fontSize:'0.86rem',color:'rgba(255,255,255,0.86)',lineHeight:1.5}}>{msg.text}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef}/>
            </div>
            {/* Input */}
            <div style={{display:'flex',gap:9,alignItems:'flex-end',paddingTop:10,borderTop:'1px solid rgba(168,85,247,0.14)'}}>
              <textarea value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg(r,realIdx);}}}
                placeholder="Type a message… (Enter to send)"
                rows={2}
                style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(168,85,247,0.28)',borderRadius:10,padding:'10px 13px',color:'#e2e8f0',fontFamily:F,fontSize:'0.86rem',outline:'none',resize:'none',lineHeight:1.5}}
              />
              <button onClick={()=>sendMsg(r,realIdx)}
                style={{width:40,height:40,borderRadius:10,flexShrink:0,background:'rgba(109,40,217,0.55)',border:'1px solid rgba(168,85,247,0.50)',color:'#e2d9ff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',alignSelf:'flex-end'}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── LIST VIEW ── */
  return (
    <div style={{position:'relative',width:'100%',height:'100%',padding:'66px 20px 16px',fontFamily:F,color:'#e2e8f0',overflowY:'auto'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:14,flex:1,flexWrap:'wrap'}}>
          <div style={{flexShrink:0}}>
            <p style={{fontSize:'0.52rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(168,85,247,0.60)',marginBottom:3,fontWeight:700}}>NAFFCO · AI SYSTEM</p>
            <h2 style={{fontSize:'1.2rem',fontWeight:800,color:'rgba(255,255,255,0.92)',margin:0}}>Track your Quotation</h2>
          </div>
          {/* Search — inline next to title */}
          <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'7px 14px',minWidth:220,maxWidth:320,flex:1}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ID, project or client…"
              style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.80)',fontFamily:F,fontSize:'0.80rem'}}/>
          </div>
        </div>
        {/* Summary filter buttons */}
        {(()=>{
          const all=myReqs.length,approved=myReqs.filter(r=>r.reqStatus==='completed'||r.directorAction==='approved').length,inProg=myReqs.filter(r=>!r.directorAction&&r.reqStatus!=='completed'&&r.reqStatus!=='out-of-scope').length,rejected=myReqs.filter(r=>r.directorAction==='rejected'||r.reqStatus==='out-of-scope').length;
          const chips=[['Total',all,null,'rgba(100,160,255,0.90)','rgba(80,120,255,0.14)'],['Approved',approved,'approved','rgba(0,220,130,0.95)','rgba(0,180,100,0.12)'],['In Progress',inProg,'inProgress','rgba(255,200,50,0.95)','rgba(220,160,0,0.12)'],['Rejected',rejected,'rejected','rgba(255,80,80,0.95)','rgba(200,40,40,0.12)']];
          return (
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {chips.map(([lbl,cnt,key,c,bg])=>{
                const active=statFilter===key;
                return (
                  <button key={lbl} onClick={()=>setStatFilter(active?null:key)}
                    style={{
                      background: active ? c.replace('0.95','0.22').replace('0.90','0.22') : bg,
                      border: active ? `1.5px solid ${c}` : `1px solid ${c.replace('0.95','0.30').replace('0.90','0.28')}`,
                      borderRadius:8, padding:'6px 15px', display:'flex', alignItems:'center', gap:7,
                      cursor:'pointer', outline:'none', transition:'all 0.15s',
                      boxShadow: active ? `0 0 14px ${c.replace('0.95','0.35').replace('0.90','0.30')}` : 'none',
                      transform: active ? 'translateY(-1px)' : 'none',
                    }}
                    onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background=c.replace('0.95','0.14').replace('0.90','0.12'); e.currentTarget.style.borderColor=c; } }}
                    onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background=bg; e.currentTarget.style.borderColor=c.replace('0.95','0.30').replace('0.90','0.28'); } }}>
                    <span style={{fontSize:'0.52rem',letterSpacing:'0.12em',textTransform:'uppercase',color:c,fontWeight:700}}>{lbl}</span>
                    <span style={{fontSize:'1.0rem',fontWeight:800,color:c,lineHeight:1}}>{cnt}</span>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>
      {/* Cards — filtered by active stat button */}
      {(()=>{
        const visReqs = statFilter==='approved' ? myReqs.filter(r=>r.reqStatus==='completed'||r.directorAction==='approved')
          : statFilter==='inProgress' ? myReqs.filter(r=>!r.directorAction&&r.reqStatus!=='completed'&&r.reqStatus!=='out-of-scope')
          : statFilter==='rejected'   ? myReqs.filter(r=>r.directorAction==='rejected'||r.reqStatus==='out-of-scope')
          : myReqs;
        return visReqs.length === 0 ? (
        <div style={{textAlign:'center',padding:'48px 0',color:'rgba(255,255,255,0.22)'}}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{marginBottom:12,opacity:0.3}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p style={{fontSize:'0.88rem',margin:0}}>No quotations found.</p>
        </div>
      ) : visReqs.map((r) => {
        const i = myReqs.indexOf(r);
        const stageIdx=getStageIdx(r),sc=statusColor(r),sl=statusLabel(r);
        const unread = _unreadCount(r.conversation, r.id, 'estimator');
        return (
          <div key={r.id||i}
            onClick={e=>{ if (e.target.closest('[data-no-nav]')) return; setOpenIdx(i); markReqSeen(r.id); }}
            style={{
              background: r.reqStatus==='out-of-scope' ? 'rgba(80,10,10,0.55)' : unread>0 ? 'rgba(20,50,80,0.55)' : 'rgba(18,10,42,0.55)',
              backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
              border: r.reqStatus==='out-of-scope' ? '1px solid rgba(220,60,60,0.32)' : unread>0 ? '1px solid rgba(100,210,255,0.28)' : '1px solid rgba(168,85,247,0.16)',
              borderRadius:14, padding:'12px 16px', marginBottom:26, cursor:'pointer',
              transition:'all 0.18s',
              boxShadow: r.reqStatus==='out-of-scope' ? '0 4px 20px rgba(180,20,20,0.10)' : '0 4px 20px rgba(0,0,0,0.22)',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor=r.reqStatus==='out-of-scope'?'rgba(255,70,70,0.50)':unread>0?'rgba(100,210,255,0.45)':'rgba(168,85,247,0.40)';
              e.currentTarget.style.background=r.reqStatus==='out-of-scope'?'rgba(100,15,15,0.65)':unread>0?'rgba(20,60,100,0.65)':'rgba(30,14,64,0.65)';
              e.currentTarget.style.boxShadow='0 8px 32px rgba(109,40,217,0.18)';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor=r.reqStatus==='out-of-scope'?'rgba(220,60,60,0.32)':unread>0?'rgba(100,210,255,0.28)':'rgba(168,85,247,0.16)';
              e.currentTarget.style.background=r.reqStatus==='out-of-scope'?'rgba(80,10,10,0.55)':unread>0?'rgba(20,50,80,0.55)':'rgba(18,10,42,0.55)';
              e.currentTarget.style.boxShadow=r.reqStatus==='out-of-scope'?'0 4px 20px rgba(180,20,20,0.10)':'0 4px 20px rgba(0,0,0,0.22)';
            }}>

            {/* ── Two-column body ── */}
            <div style={{display:'flex',alignItems:'stretch',gap:0}}>

              {/* LEFT: Project Details (58%) */}
              <div style={{flex:'0 0 58%',paddingRight:14,borderRight:'1px solid rgba(255,255,255,0.06)'}}>

                {/* Row 1: ID · status · unread · Open → */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:5}}>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <span style={{fontFamily:'monospace',fontSize:'0.78rem',fontWeight:700,color:'rgba(220,165,0,0.90)'}}>{r.id}</span>
                    <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'1px 7px',borderRadius:50,background:`${sc}15`,border:`1px solid ${sc}35`}}>
                      <span style={{width:4,height:4,borderRadius:'50%',background:sc,flexShrink:0}}/>
                      <span style={{fontSize:'0.55rem',color:sc,fontWeight:700,letterSpacing:'0.04em'}}>{sl}</span>
                    </span>
                    {unread > 0 && <span style={{fontSize:'0.55rem',color:'rgba(100,210,255,0.95)',fontWeight:700,background:'rgba(100,210,255,0.12)',borderRadius:50,padding:'1px 7px'}}>💬 {unread}</span>}
                  </div>
                  <span style={{fontSize:'0.56rem',color:'rgba(168,85,247,0.45)',fontWeight:600,flexShrink:0}}>Open →</span>
                </div>

                {/* Row 2: Main Contractor · Project — right: Estimator */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:7}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:7,minWidth:0,overflow:'hidden'}}>
                    <span style={{fontSize:'0.95rem',fontWeight:800,color:'rgba(255,255,255,0.92)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'32vw'}}>{r.mainContractor||'—'}</span>
                    {r.proj && <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.32)',fontWeight:400,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0}}>{r.proj}</span>}
                  </div>
                  {r.estimator ? (
                    <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                      <EstAvatar name={r.estimator} size={22}/>
                      <span style={{fontSize:'0.78rem',fontWeight:700,color:'rgba(255,255,255,0.80)',whiteSpace:'nowrap'}}>{r.estimator}</span>
                    </div>
                  ) : (
                    <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.18)',fontStyle:'italic',flexShrink:0}}>Unassigned</span>
                  )}
                </div>

                {/* Fields: Client, Consultant, Deal, Supply, Lead Time */}
                {(()=>{
                  const supplyLabel = r.supplyInstall ? 'Supply & Install' : r.supplyOnly ? 'Supply Only' : r.deal||'—';
                  return (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'2px 10px'}}>
                      {[['Client',r.client],['Consultant',r.consultant],['Deal',r.deal],['Supply',supplyLabel],['Lead Time',r.leadTime]].map(([lbl,val])=>(
                        <div key={lbl} style={{display:'flex',flexDirection:'column',gap:1,minWidth:0}}>
                          <span style={{fontSize:'0.42rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:700}}>{lbl}</span>
                          <span style={{fontSize:'0.64rem',color:'rgba(255,255,255,0.72)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{val||'—'}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* RIGHT: Horizontal Animated Timeline (42%) */}
              <div style={{flex:1,paddingLeft:16,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                {(()=>{
                  const frozen=r.reqStatus==='out-of-scope';
                  const N=STAGES.length;
                  // Progress bar spans between node centres: left=1/N/2*100%, width=(N-1)/N*100%
                  const trackLeft=`${100/(N*2)}%`;
                  const trackWidth=`${(N-1)/N*100}%`;
                  const fillPct=stageIdx>0?stageIdx/(N-1)*100:0;
                  const fillWidth=`${fillPct*(N-1)/N}%`;
                  const activeColor=frozen?'rgba(255,70,70,0.85)':STAGES[Math.min(stageIdx,N-1)].color;
                  return (
                    <div style={{position:'relative',paddingBottom:2}}>
                      {/* Background track */}
                      <div style={{position:'absolute',left:trackLeft,width:trackWidth,top:10,height:2,background:'rgba(255,255,255,0.07)',borderRadius:2,zIndex:0}}/>
                      {/* Animated progress fill */}
                      {stageIdx>0&&(
                        <div style={{
                          position:'absolute',left:trackLeft,top:10,height:2,
                          width:fillWidth,
                          background:`linear-gradient(90deg,${STAGES[0].color},${activeColor})`,
                          borderRadius:2,zIndex:1,overflow:'hidden',
                          animation:'tlProgressIn 0.9s cubic-bezier(0.22,1,0.36,1) both',
                        }}>
                          {/* shimmer overlay */}
                          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.55) 50%,transparent 100%)',backgroundSize:'200% 100%',animation:'tlShimmer 2.2s ease-in-out 0.9s infinite'}}/>
                        </div>
                      )}
                      {/* Nodes row */}
                      <div style={{display:'flex',alignItems:'flex-start',position:'relative',zIndex:2}}>
                        {STAGES.map((st,si)=>{
                          const done=si<=stageIdx,active=si===stageIdx&&!frozen;
                          const nodeCol=frozen&&si===stageIdx?'rgba(255,70,70,0.85)':done?st.color:'rgba(255,255,255,0.14)';
                          return (
                            <div key={st.key} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                              {/* Node with optional ripple */}
                              <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:22,height:22}}>
                                {active&&(
                                  <div style={{position:'absolute',width:22,height:22,borderRadius:'50%',border:`1.5px solid ${st.color}`,animation:'tlRipple 1.8s ease-out infinite',pointerEvents:'none'}}/>
                                )}
                                <div style={{
                                  width:active?14:12,height:active?14:12,
                                  borderRadius:'50%',
                                  background:done?nodeCol:'transparent',
                                  border:`1.5px solid ${nodeCol}`,
                                  display:'flex',alignItems:'center',justifyContent:'center',
                                  boxShadow:active?`0 0 10px ${st.color},0 0 22px ${st.color}55`:done?`0 0 5px ${nodeCol}70`:'none',
                                  animation:`tlNodePop 0.45s ${si*70}ms cubic-bezier(0.34,1.56,0.64,1) both`,
                                  position:'relative',zIndex:1,
                                  transition:'width 0.3s,height 0.3s',
                                }}>
                                  {done&&!active?(
                                    <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                                      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  ):active?(
                                    <div style={{width:4,height:4,borderRadius:'50%',background:'#fff'}}/>
                                  ):null}
                                </div>
                              </div>
                              {/* Label */}
                              <div style={{
                                fontSize:'0.44rem',letterSpacing:'0.05em',textAlign:'center',
                                fontWeight:done?700:400,lineHeight:1.2,
                                color:frozen&&si===stageIdx?'rgba(255,90,90,0.90)':done?st.color:'rgba(255,255,255,0.20)',
                                whiteSpace:'nowrap',
                                animation:`tlNodePop 0.45s ${si*70+120}ms cubic-bezier(0.34,1.56,0.64,1) both`,
                              }}>{st.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Director note */}
            {r.directorNote && (
              <div style={{marginTop:7,paddingTop:6,borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.68rem',color:'rgba(255,200,140,0.65)',fontStyle:'italic'}}>
                Cost-Artist: "{r.directorNote}"
              </div>
            )}

            {/* Quotation download strip — only cost-artist approved files */}
            {(()=>{
              const isApproved = r.directorAction === 'approved' || r.reqStatus === 'completed';
              if (!isApproved) return null;
              const allDocs = r.estimationDocs?.length > 0 ? r.estimationDocs : [r.estimationDoc].filter(Boolean);
              const releasedDocs = r.salesApprovedDocs?.length > 0
                ? allDocs.filter(d => d && r.salesApprovedDocs.includes(d.id))
                : allDocs;
              if (!releasedDocs.length) return null;
              return (
                <div data-no-nav style={{marginTop:7,paddingTop:6,borderTop:'1px solid rgba(168,85,247,0.12)',display:'flex',flexWrap:'wrap',alignItems:'center',gap:6}} onClick={e=>e.stopPropagation()}>
                  <span style={{fontSize:'0.42rem',color:'rgba(0,220,130,0.60)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:700}}>Approved Quotation</span>
                  {releasedDocs.map((d,di)=>(
                    <button key={di} onClick={()=>downloadDoc(d)}
                      style={{display:'flex',alignItems:'center',gap:5,padding:'2px 9px',borderRadius:6,background:'rgba(0,220,130,0.10)',border:'1px solid rgba(0,200,100,0.32)',color:'rgba(100,230,170,0.90)',fontFamily:F,fontSize:'0.58rem',fontWeight:600,cursor:'pointer',outline:'none'}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {typeof d === 'object' && d.name ? d.name : `Quotation_${r.id}_${di+1}`}
                    </button>
                  ))}
                </div>
              );
            })()}

            {/* Out-of-scope section + Recall */}
            {r.reqStatus === 'out-of-scope' && (
              <div data-no-nav style={{marginTop:8,paddingTop:7,borderTop:'1px solid rgba(220,60,60,0.20)'}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,70,70,0.85)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  <span style={{fontSize:'0.55rem',color:'rgba(255,70,70,0.90)',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase'}}>Cancelled by Cost-Artist</span>
                </div>
                {r.outScopeRemark && (
                  <div style={{fontSize:'0.64rem',color:'rgba(255,180,180,0.55)',fontStyle:'italic',paddingLeft:14,lineHeight:1.4,marginBottom:8}}>"{r.outScopeRemark}"</div>
                )}
                {onUpdate && recallOpen !== r.id && (
                  <button onClick={()=>{setRecallOpen(r.id);setRecallDocs([]);setRecallUpState(null);}}
                    style={{display:'flex',alignItems:'center',gap:6,padding:'4px 12px',borderRadius:7,background:'rgba(109,40,217,0.14)',border:'1px solid rgba(168,85,247,0.35)',color:'rgba(196,181,253,0.90)',fontFamily:F,fontSize:'0.62rem',fontWeight:700,cursor:'pointer',outline:'none',marginTop:4}}>
                    ↺ Recall &amp; Resubmit
                  </button>
                )}
                {recallOpen === r.id && (
                  <div style={{marginTop:6,background:'rgba(109,40,217,0.10)',border:'1px solid rgba(168,85,247,0.28)',borderRadius:9,padding:'10px 12px',display:'flex',flexDirection:'column',gap:8}}>
                    <div style={{fontSize:'0.58rem',color:'rgba(196,181,253,0.75)',lineHeight:1.5}}>Upload replacement documents (optional) then confirm to restart the timeline.</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center'}}>
                      <input ref={recallFileRef} type="file" multiple style={{display:'none'}} onChange={async e=>{
                        if (!e.target.files?.length) return;
                        setRecallUpState('uploading');
                        try {
                          const uploaded=[];
                          for (const file of Array.from(e.target.files)) {
                            const url = await uploadToSharePoint(file, r.id, file.name);
                            if (url) uploaded.push({id:Math.random().toString(36).slice(2)+Date.now().toString(36),name:file.name,type:file.type,url,verified:true});
                          }
                          setRecallDocs(prev=>[...prev,...uploaded]);
                          setRecallUpState(null);
                        } catch { setRecallUpState(null); }
                        e.target.value='';
                      }}/>
                      <button onClick={()=>recallFileRef.current?.click()} disabled={recallUpState==='uploading'}
                        style={{padding:'3px 10px',borderRadius:6,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',color:recallUpState==='uploading'?'rgba(255,255,255,0.35)':'rgba(255,255,255,0.72)',fontFamily:F,fontSize:'0.60rem',fontWeight:600,cursor:'pointer',outline:'none'}}>
                        {recallUpState==='uploading'?'⟳ Uploading…':'+ Add Docs'}
                      </button>
                      {recallDocs.map((d,di)=>(
                        <span key={di} style={{fontSize:'0.56rem',color:'rgba(100,210,150,0.80)',background:'rgba(0,180,100,0.08)',border:'1px solid rgba(0,200,120,0.22)',borderRadius:4,padding:'1px 7px'}}>{d.name}</span>
                      ))}
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>{ const rr=requests.find(x=>x.id===r.id); handleRecall(rr||r, requests.indexOf(rr||r)); }}
                        disabled={recallUpState==='uploading'}
                        style={{flex:1,padding:'5px 0',borderRadius:7,background:'rgba(109,40,217,0.50)',border:'1px solid rgba(168,85,247,0.55)',color:'rgba(220,200,255,0.95)',fontFamily:F,fontSize:'0.68rem',fontWeight:700,cursor:'pointer',outline:'none'}}>
                        ✓ Confirm Resubmission
                      </button>
                      <button onClick={()=>{setRecallOpen(null);setRecallDocs([]);}}
                        style={{padding:'5px 14px',borderRadius:7,background:'transparent',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.45)',fontFamily:F,fontSize:'0.68rem',cursor:'pointer',outline:'none'}}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })
      })()}
    </div>
  );
};

// ─── QUOTED REQUESTS ─────────────────────────────────────────────────────────
const QuotedRequests = ({ requests, spName, showAll, onUpdate }) => {
  const F = "'Inter',sans-serif";
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const chatEndRef = useRef(null);

  const myReqs = (requests || []).filter(r => {
    const approved = r.directorAction === 'approved' || r.reqStatus === 'completed';
    if (!approved) return false;
    if (showAll) return true;
    return (r.salesPerson || '').toLowerCase() === (spName || '').toLowerCase() ||
           (r.submittedBy || '').toLowerCase() === (spName || '').toLowerCase();
  }).sort((a, b) => (b.approvedAt || b.submittedAt || 0) > (a.approvedAt || a.submittedAt || 0) ? 1 : -1);

  const filtered = search.trim()
    ? myReqs.filter(r => {
        const lo = search.toLowerCase();
        return [r.id, r.proj, r.client, r.salesPerson, r.estimator, r.deal, r.mainContractor, r.consultant]
          .some(v => (v || '').toLowerCase().includes(lo));
      })
    : myReqs;

  const SALES_COLORS = {
    Won:         { c:'#4ade80', bg:'rgba(34,197,94,0.12)',  bd:'rgba(34,197,94,0.32)'  },
    Lost:        { c:'#f87171', bg:'rgba(239,68,68,0.12)',  bd:'rgba(239,68,68,0.32)'  },
    'Follow-up': { c:'#fbbf24', bg:'rgba(251,191,36,0.10)', bd:'rgba(251,191,36,0.32)' },
    Risky:       { c:'#fb923c', bg:'rgba(249,115,22,0.10)', bd:'rgba(249,115,22,0.32)' },
    Pending:     { c:'rgba(255,255,255,0.42)', bg:'rgba(255,255,255,0.05)', bd:'rgba(255,255,255,0.14)' },
  };

  const openReq = openId ? myReqs.find(r => r.id === openId) : null;

  // ── Detail Panel ──
  if (openReq) {
    const r = openReq;
    const sc = SALES_COLORS[r.salesStatus || 'Pending'] || SALES_COLORS.Pending;
    const docs = r.estimationDocs?.length ? r.estimationDocs : r.estimationFile ? [{ name:'Quotation', url: r.estimationFile }] : [];
    const infoRows = [
      ['Request ID',      r.id],
      ['Project',         r.proj],
      ['Client',          r.client],
      ['Main Contractor', r.mainContractor],
      ['Consultant',      r.consultant],
      ['Deal Type',       r.deal],
      ['Supply',          r.supplyOnly ? 'Supply Only' : r.supplyInstall ? 'Supply & Install' : '—'],
      ['Lead Time',       r.leadTime],
      ['Submitted By',    r.submittedBy],
      ['Sales Person',    r.salesPerson],
      ['Estimator',       r.estimator],
      ['Submitted On',    r.date],
    ];
    return (
      <div style={{ position:'relative', width:'100%', height:'100%', overflowY:'auto', padding:'72px 28px 32px', fontFamily:F, color:'#e2e8f0', boxSizing:'border-box' }}>
        <button onClick={() => setOpenId(null)}
          style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:'0.82rem', fontFamily:F, display:'flex', alignItems:'center', gap:6, marginBottom:22, padding:0 }}>
          ← Quoted Requests
        </button>

        {/* Approval banner */}
        <div style={{ background:'rgba(0,200,100,0.08)', border:'1px solid rgba(0,200,100,0.30)', borderRadius:12, padding:'14px 20px', display:'flex', alignItems:'center', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(0,200,100,0.14)', border:'1px solid rgba(0,200,100,0.40)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'1.0rem' }}>✓</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'0.50rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(0,220,120,0.55)', marginBottom:2, fontWeight:700 }}>Quotation Approved</div>
            <div style={{ fontSize:'0.90rem', fontWeight:700, color:'rgba(0,220,130,0.92)' }}>This request has been approved by Cost Artist</div>
          </div>
          <div style={{ fontFamily:'monospace', fontSize:'0.82rem', color:'rgba(220,165,0,0.88)', fontWeight:700 }}>{r.id}</div>
        </div>

        {/* Sales status */}
        <div style={{ background:sc.bg, border:`1px solid ${sc.bd}`, borderRadius:10, padding:'12px 18px', display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <span style={{ width:9, height:9, borderRadius:'50%', background:sc.c, boxShadow:`0 0 7px ${sc.c}`, flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'0.50rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:2 }}>Sales Status</div>
            <div style={{ fontSize:'0.92rem', fontWeight:700, color:sc.c }}>{r.salesStatus || 'Pending'}</div>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', marginBottom:20 }}>
          {infoRows.map(([label, val], i) => (
            <div key={label} style={{ padding:'11px 16px', background: i%2===0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)' }}>
              <div style={{ fontSize:'0.48rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:3, fontWeight:700 }}>{label}</div>
              <div style={{ fontSize:'0.80rem', color:'rgba(255,255,255,0.80)', lineHeight:1.4 }}>{val || '—'}</div>
            </div>
          ))}
        </div>

        {/* Director note */}
        {r.directorNote && (
          <div style={{ background:'rgba(180,130,255,0.07)', border:'1px solid rgba(168,85,247,0.25)', borderRadius:10, padding:'14px 18px', marginBottom:20 }}>
            <div style={{ fontSize:'0.50rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(168,85,247,0.65)', marginBottom:6, fontWeight:700 }}>Cost-Artist Note</div>
            <p style={{ fontSize:'0.82rem', color:'rgba(220,200,255,0.85)', lineHeight:1.6, margin:0 }}>{r.directorNote}</p>
          </div>
        )}

        {/* Estimator comments */}
        {r.estimatorComments && (
          <div style={{ background:'rgba(255,200,80,0.05)', border:'1px solid rgba(255,200,80,0.18)', borderRadius:10, padding:'14px 18px', marginBottom:20 }}>
            <div style={{ fontSize:'0.50rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,200,80,0.55)', marginBottom:6, fontWeight:700 }}>Estimator Comments</div>
            <p style={{ fontSize:'0.82rem', color:'rgba(255,230,140,0.85)', lineHeight:1.6, margin:0 }}>{r.estimatorComments}</p>
          </div>
        )}

        {/* Quotation docs */}
        {docs.length > 0 && (
          <div style={{ background:'rgba(0,160,255,0.06)', border:'1px solid rgba(0,160,255,0.22)', borderRadius:10, padding:'16px 18px', marginBottom:20 }}>
            <div style={{ fontSize:'0.50rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(0,180,255,0.60)', marginBottom:12, fontWeight:700 }}>Quotation Files</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {docs.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:8, background:'rgba(0,160,255,0.08)', border:'1px solid rgba(0,160,255,0.20)', textDecoration:'none', color:'rgba(100,200,255,0.90)', fontSize:'0.80rem', fontWeight:600, transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(0,160,255,0.16)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(0,160,255,0.08)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {d.name || `File ${i+1}`}
                  <svg style={{ marginLeft:'auto' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Conversation ── */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'16px 18px' }}>
          <div style={{ fontSize:'0.50rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(168,85,247,0.65)', marginBottom:14, fontWeight:700 }}>Conversation</div>

          {/* Messages */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:14, maxHeight:280, overflowY:'auto' }}>
            {(r.conversation||[]).length === 0 && (
              <div style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.22)', fontStyle:'italic', textAlign:'center', padding:'16px 0' }}>No messages yet. Start the conversation below.</div>
            )}
            {(r.conversation||[]).map((m, mi) => {
              const isMine = m.role === 'sales' || (m.from||'').toLowerCase() === (spName||'').toLowerCase();
              return (
                <div key={mi} style={{ display:'flex', flexDirection:'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth:'78%', background: isMine ? 'rgba(168,85,247,0.16)' : 'rgba(255,255,255,0.06)', border: isMine ? '1px solid rgba(168,85,247,0.28)' : '1px solid rgba(255,255,255,0.10)', borderRadius: isMine ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding:'9px 13px' }}>
                    <div style={{ fontSize:'0.60rem', color: isMine ? 'rgba(210,170,255,0.65)' : 'rgba(255,255,255,0.35)', marginBottom:4, fontWeight:600 }}>{m.from || (isMine ? 'Sales' : 'Estimator')}</div>
                    <div style={{ fontSize:'0.80rem', color:'rgba(255,255,255,0.85)', lineHeight:1.55 }}>{m.text}</div>
                    <div style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.25)', marginTop:4, textAlign: isMine ? 'right' : 'left' }}>{m.ts}</div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef}/>
          </div>

          {/* Input */}
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <textarea value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendChat(r); } }}
              placeholder="Type a message… (Enter to send)"
              rows={2}
              style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:10, padding:'10px 13px', color:'rgba(255,255,255,0.85)', fontFamily:F, fontSize:'0.80rem', outline:'none', resize:'none', lineHeight:1.5 }}/>
            <button onClick={()=>sendChat(r)}
              disabled={!chatMsg.trim()}
              style={{ padding:'10px 18px', borderRadius:10, background: chatMsg.trim() ? 'rgba(168,85,247,0.22)' : 'rgba(255,255,255,0.04)', border: chatMsg.trim() ? '1px solid rgba(168,85,247,0.45)' : '1px solid rgba(255,255,255,0.09)', color: chatMsg.trim() ? 'rgba(210,170,255,0.95)' : 'rgba(255,255,255,0.22)', fontFamily:F, fontSize:'0.80rem', fontWeight:700, cursor: chatMsg.trim() ? 'pointer' : 'default', outline:'none', transition:'all 0.15s', flexShrink:0, alignSelf:'flex-end' }}>
              Send
            </button>
          </div>
        </div>
      </div>
    );

    function sendChat(req) {
      if (!chatMsg.trim() || !onUpdate) return;
      const ts = new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
      onUpdate(req.id, { conversation:[...(req.conversation||[]),{ from: spName||'Sales', role:'sales', text:chatMsg.trim(), ts, tsMs:Date.now() }] });
      setChatMsg('');
      setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:'smooth'}),60);
    }
  }

  // ── List View ──
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflowY:'auto', padding:'72px 28px 32px', fontFamily:F, color:'#e2e8f0', boxSizing:'border-box' }}>

      {/* Header */}
      <div style={{ marginBottom:22 }}>
        <p style={{ fontSize:'0.50rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(0,200,130,0.65)', margin:'0 0 3px', fontWeight:700 }}>NAFFCO · SALES</p>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'rgba(255,255,255,0.92)', margin:'0 0 4px' }}>Quoted Requests</h2>
        <p style={{ fontSize:'0.70rem', color:'rgba(255,255,255,0.28)', margin:0 }}>
          {filtered.length} approved quotation{filtered.length !== 1 ? 's' : ''}{!showAll && spName ? ` · ${spName}` : ''}
        </p>
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:20 }}>
        <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by project, client, ID, estimator…"
          style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'10px 14px 10px 38px', color:'rgba(255,255,255,0.85)', fontFamily:F, fontSize:'0.82rem', outline:'none' }}/>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.22)' }}>
          <div style={{ fontSize:'2.2rem', marginBottom:12, opacity:0.4 }}>📋</div>
          <div style={{ fontSize:'0.86rem', fontWeight:600 }}>No approved quotations yet</div>
          <div style={{ fontSize:'0.72rem', marginTop:6, opacity:0.7 }}>Requests approved by the Cost Artist will appear here</div>
        </div>
      )}

      {/* Cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(r => {
          const sc = SALES_COLORS[r.salesStatus || 'Pending'] || SALES_COLORS.Pending;
          const hasDocs = r.estimationDocs?.length || r.estimationFile;
          const dealColors = {
            'Job In Hand': 'rgba(0,210,130,0.80)', Tender: 'rgba(100,180,255,0.80)',
            Budget: 'rgba(255,200,50,0.80)', Other: 'rgba(168,85,247,0.80)',
          };
          const dealC = dealColors[r.deal] || dealColors.Other;
          return (
            <div key={r.id} onClick={() => setOpenId(r.id)}
              style={{ borderRadius:14, padding:'16px 20px', cursor:'pointer', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', transition:'all 0.18s', backdropFilter:'blur(12px)' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(0,200,100,0.07)'; e.currentTarget.style.borderColor='rgba(0,200,100,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}>

              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'rgba(220,165,0,0.85)', fontWeight:700 }}>{r.id}</span>
                    <span style={{ fontSize:'0.48rem', letterSpacing:'0.12em', textTransform:'uppercase', color:dealC, background:`${dealC.replace('0.80','0.10')}`, padding:'2px 7px', borderRadius:20, fontWeight:700, border:`1px solid ${dealC.replace('0.80','0.28')}` }}>{r.deal || 'Other'}</span>
                    {hasDocs && <span style={{ fontSize:'0.46rem', letterSpacing:'0.10em', textTransform:'uppercase', color:'rgba(100,200,255,0.75)', background:'rgba(0,150,255,0.10)', padding:'2px 7px', borderRadius:20, fontWeight:700, border:'1px solid rgba(0,150,255,0.22)' }}>📎 Docs</span>}
                  </div>
                  <div style={{ fontSize:'0.88rem', fontWeight:700, color:'rgba(255,255,255,0.90)', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.proj || '—'}</div>
                  <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.38)' }}>{r.client || '—'}</div>
                </div>
                {/* Sales status pill */}
                <div style={{ flexShrink:0, background:sc.bg, border:`1px solid ${sc.bd}`, borderRadius:20, padding:'4px 12px', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:sc.c, flexShrink:0 }}/>
                  <span style={{ fontSize:'0.62rem', fontWeight:700, color:sc.c, whiteSpace:'nowrap' }}>{r.salesStatus || 'Pending'}</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                {r.estimator && <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.35)' }}>Est: <span style={{ color:'rgba(255,255,255,0.60)', fontWeight:600 }}>{r.estimator}</span></span>}
                {r.salesPerson && <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.35)' }}>SP: <span style={{ color:'rgba(255,255,255,0.60)', fontWeight:600 }}>{r.salesPerson}</span></span>}
                {r.date && <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.28)' }}>{r.date}</span>}
                <span style={{ marginLeft:'auto', fontSize:'0.60rem', color:'rgba(0,210,110,0.55)', fontWeight:600 }}>✓ Approved</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SALES DASHBOARD ─────────────────────────────────────────────────────────
const SalesDashboard = ({ requests, spName, showAll, setView, diaryEntries=[] }) => {
  const F = "'Inter',sans-serif";
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 40); return () => clearTimeout(t); }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const todayISO = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  const myReqs = requests.filter(r =>
    showAll ||
    (r.salesPerson||'').toLowerCase()===(spName||'').toLowerCase() ||
    (r.submittedBy||'').toLowerCase()===(spName||'').toLowerCase()
  );
  // De-duplicate: for each base ID keep the latest revision for KPI counts
  const baseIdFn = id => (id || '').replace(/(_R\d+|_F\d+)+$/, '');
  const uniqueMyMap = {};
  myReqs.forEach(r => {
    const base = baseIdFn(r.id);
    const prev = uniqueMyMap[base];
    if (!prev || (r.submittedAt || '') > (prev.submittedAt || '')) uniqueMyMap[base] = r;
  });
  const uniqueMyReqs = Object.values(uniqueMyMap);
  const totalQ    = uniqueMyReqs.length;
  const approvedQ = uniqueMyReqs.filter(r=>r.reqStatus==='completed'||r.directorAction==='approved').length;
  const pendingQ  = uniqueMyReqs.filter(r=>!r.directorAction&&r.reqStatus!=='completed').length;
  const rejectedQ = uniqueMyReqs.filter(r=>r.directorAction==='rejected').length;
  const quotedQ   = uniqueMyReqs.filter(r=>r.estimationFile||r.estimationDocs?.length).length;
  const wonQ      = uniqueMyReqs.filter(r=>r.salesStatus==='Won').length;
  const lostQ     = uniqueMyReqs.filter(r=>r.salesStatus==='Lost').length;

  const perfKey  = `sp_perf_${spName||'all'}`;
  const perfRows = (()=>{ try{ return JSON.parse(localStorage.getItem(perfKey)||'[]'); }catch{ return []; } })();
  const totalSO  = perfRows.reduce((s,r)=>s+(Number(r.soValue)||0),0);
  const totalInv = perfRows.reduce((s,r)=>s+(Number(r.invoiceValue)||0),0);
  const fmt = v => { const n=Number(v)||0; return n>=1000000?`${(n/1000000).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(0)}K`:String(n); };

  const actKey    = `sp_acts_${spName||'all'}`;
  const allActs   = (()=>{ try{ return JSON.parse(localStorage.getItem(actKey)||'[]'); }catch{ return []; } })();
  const todayActs = allActs.filter(a=>(a.date||'')===todayISO);

  const myDiary  = diaryEntries.filter(e=>showAll||(e.salesPerson||'')===(spName||''));
  const lastDiary = myDiary[0];

  /* ── animated card wrapper ── */
  const GlowCard = ({ onClick, children, bg, border, glow, anim, animDelay, style={} }) => (
    <div onClick={onClick} style={{
      background:bg, border:`1px solid ${border}`, borderRadius:22, padding:'22px 22px',
      cursor:'pointer', position:'relative', overflow:'hidden',
      boxShadow:`0 8px 36px ${glow}`,
      animation: ready ? `${anim} 0.72s cubic-bezier(0.34,1.56,0.64,1) ${animDelay}ms both` : 'none',
      transition:'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s',
      ...style,
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px) scale(1.018)';e.currentTarget.style.boxShadow=`0 22px 60px ${glow}`;}}
    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0) scale(1)';e.currentTarget.style.boxShadow=`0 8px 36px ${glow}`;}}>
      <div style={{position:'absolute',top:0,left:'-80%',width:'55%',height:'100%',
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',
        animation:`glassSheen 4.5s ease-in-out ${animDelay}ms infinite`,pointerEvents:'none'}}/>
      {children}
    </div>
  );

  const Stat = ({label,value,color}) => (
    <div style={{flex:1,background:'rgba(255,255,255,0.05)',borderRadius:10,padding:'9px 10px',textAlign:'center',minWidth:0}}>
      <div style={{fontSize:'1.05rem',fontWeight:800,color,lineHeight:1}}>{value}</div>
      <div style={{fontSize:'0.42rem',letterSpacing:'0.10em',textTransform:'uppercase',color,opacity:0.6,marginTop:3,fontWeight:700}}>{label}</div>
    </div>
  );

  return (
    <div style={{position:'absolute',inset:0,padding:'8px 22px 18px',fontFamily:F,color:'#e2e8f0',overflowY:'auto',boxSizing:'border-box'}}>

      {/* ── Header (flies in from top) ── */}
      <div style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,gap:12,flexWrap:'wrap',
        paddingTop:62,
        animation: ready ? 'dashHdrIn 0.55s cubic-bezier(0.34,1.56,0.64,1) 0ms both' : 'none',
      }}>
        <div>
          <p style={{fontSize:'0.50rem',letterSpacing:'0.24em',textTransform:'uppercase',color:'rgba(168,85,247,0.70)',margin:'0 0 3px',fontWeight:700}}>NAFFCO · SALES</p>
          <h2 style={{fontSize:'1.55rem',fontWeight:900,letterSpacing:'0.06em',textTransform:'uppercase',margin:'0 0 2px',
            background:'linear-gradient(120deg,#fff 0%,rgba(200,170,255,0.95) 35%,rgba(255,190,80,0.95) 70%,#fff 100%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>My Dashboard</h2>
          <p style={{fontSize:'0.66rem',color:'rgba(255,255,255,0.25)',margin:0,letterSpacing:'0.03em'}}>{dateStr}</p>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[['Total',totalQ,'rgba(100,170,255,0.90)'],['Approved',approvedQ,'rgba(0,220,130,0.90)'],['Pending',pendingQ,'rgba(255,200,50,0.90)'],['Rejected',rejectedQ,'rgba(255,80,80,0.90)']].map(([l,n,c])=>(
            <div key={l} style={{background:`${c}12`,border:`1px solid ${c}30`,borderRadius:10,padding:'6px 14px',textAlign:'center'}}>
              <div style={{fontSize:'1.15rem',fontWeight:800,color:c,lineHeight:1}}>{n}</div>
              <div style={{fontSize:'0.44rem',letterSpacing:'0.12em',textTransform:'uppercase',color:c,opacity:0.7,fontWeight:700,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card Grid ── */}
      <div style={{display:'grid',gridTemplateColumns:'1.35fr 1fr 1fr',gridTemplateRows:'auto auto',gap:14,alignItems:'stretch'}}>

        {/* 1 — Track Quotation · flies from LEFT */}
        <GlowCard onClick={()=>setView('trackQuotation')}
          bg='linear-gradient(150deg,rgba(15,40,100,0.90) 0%,rgba(10,25,75,0.98) 100%)'
          border='rgba(80,150,255,0.30)' glow='rgba(50,110,255,0.25)'
          anim='dashFlyLeft' animDelay={80} style={{gridRow:'1/3'}}>
          <div style={{fontSize:'2.2rem',marginBottom:12}}>📋</div>
          <div style={{fontSize:'0.50rem',letterSpacing:'0.20em',textTransform:'uppercase',color:'rgba(100,170,255,0.65)',fontWeight:700,marginBottom:5}}>Track Your Quotation</div>
          <div style={{fontSize:'clamp(3rem,5vw,4.2rem)',fontWeight:900,color:'rgba(120,185,255,0.95)',lineHeight:1,marginBottom:2}}>{totalQ}</div>
          <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.28)',marginBottom:20}}>total submissions</div>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
            {[['Approved',approvedQ,'rgba(0,220,130,0.90)','rgba(0,55,30,0.75)'],['In Progress',pendingQ,'rgba(255,200,50,0.90)','rgba(55,40,0,0.75)'],['Rejected',rejectedQ,'rgba(255,80,80,0.90)','rgba(55,14,14,0.75)']].map(([l,n,c,bg])=>(
              <div key={l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:bg,borderRadius:11,padding:'10px 14px',backdropFilter:'blur(6px)'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:c,boxShadow:`0 0 9px ${c}`,flexShrink:0}}/>
                  <span style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.75)',fontWeight:500}}>{l}</span>
                </div>
                <span style={{fontSize:'1.2rem',fontWeight:900,color:c}}>{n}</span>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'12px 14px',marginBottom:16}}>
            <div style={{fontSize:'0.44rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:8,fontWeight:700}}>Recent activity</div>
            {myReqs.length===0 && <p style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.20)',margin:0,fontStyle:'italic'}}>No submissions yet</p>}
            {myReqs.slice(0,3).map((r,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',borderBottom:i<2&&i<myReqs.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'rgba(100,170,255,0.65)',flexShrink:0}}/>
                <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.55)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{r.mainContractor||r.proj||r.client||r.id}</span>
                <span style={{fontSize:'0.58rem',color:'rgba(100,170,255,0.50)',fontWeight:600,flexShrink:0,whiteSpace:'nowrap'}}>{r.date||'—'}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <span style={{fontSize:'0.74rem',color:'rgba(100,170,255,0.75)',fontWeight:700}}>View all quotations</span>
            <span style={{color:'rgba(100,170,255,0.75)'}}>→</span>
          </div>
        </GlowCard>

        {/* 2 — Quoted Request · flies from TOP */}
        <GlowCard onClick={()=>setView('salesStatus')}
          bg='linear-gradient(150deg,rgba(70,20,130,0.90) 0%,rgba(45,8,90,0.98) 100%)'
          border='rgba(168,85,247,0.32)' glow='rgba(130,50,240,0.25)'
          anim='dashFlyUp' animDelay={220}>
          <div style={{fontSize:'1.8rem',marginBottom:10}}>📊</div>
          <div style={{fontSize:'0.50rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(168,85,247,0.72)',fontWeight:700,marginBottom:4}}>Quoted Request</div>
          <div style={{fontSize:'3rem',fontWeight:900,color:'rgba(210,170,255,0.95)',lineHeight:1,marginBottom:3}}>{quotedQ}</div>
          <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.28)',marginBottom:16}}>quotations ready</div>
          <div style={{display:'flex',gap:8,marginBottom:14}}>
            <Stat label='Won' value={wonQ} color='rgba(0,220,130,0.90)'/>
            <Stat label='Lost' value={lostQ} color='rgba(255,80,80,0.90)'/>
            <Stat label='Open' value={Math.max(0,quotedQ-wonQ-lostQ)} color='rgba(251,191,36,0.90)'/>
          </div>
          <div style={{fontSize:'0.68rem',color:'rgba(168,85,247,0.70)',fontWeight:700}}>View requests →</div>
        </GlowCard>

        {/* 3 — My Performance · flies from RIGHT */}
        <GlowCard onClick={()=>setView('salesPerformance')}
          bg='linear-gradient(150deg,rgba(100,50,0,0.90) 0%,rgba(65,28,0,0.98) 100%)'
          border='rgba(251,191,36,0.30)' glow='rgba(200,130,0,0.22)'
          anim='dashFlyRight' animDelay={350}>
          <div style={{fontSize:'1.8rem',marginBottom:10}}>📈</div>
          <div style={{fontSize:'0.50rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(251,191,36,0.68)',fontWeight:700,marginBottom:4}}>My Performance</div>
          <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.28)',marginBottom:4}}>SO Value</div>
          <div style={{fontSize:'2.2rem',fontWeight:900,color:'rgba(251,191,36,0.95)',lineHeight:1,marginBottom:14}}>AED {fmt(totalSO)}</div>
          <div style={{display:'flex',gap:8,marginBottom:14}}>
            <Stat label='Invoice' value={`AED ${fmt(totalInv)}`} color='rgba(99,200,255,0.90)'/>
            <Stat label='Records' value={perfRows.length} color='rgba(0,220,130,0.90)'/>
          </div>
          <div style={{fontSize:'0.68rem',color:'rgba(251,191,36,0.70)',fontWeight:700}}>View performance →</div>
        </GlowCard>

        {/* 4 — My Daily Activities · flies from BOTTOM-LEFT */}
        <GlowCard onClick={()=>setView('myActivities')}
          bg='linear-gradient(150deg,rgba(0,70,45,0.90) 0%,rgba(0,42,25,0.98) 100%)'
          border='rgba(0,220,130,0.27)' glow='rgba(0,170,90,0.20)'
          anim='dashFlyLeft' animDelay={480}>
          <div style={{fontSize:'1.8rem',marginBottom:10}}>⚡</div>
          <div style={{fontSize:'0.50rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,220,130,0.68)',fontWeight:700,marginBottom:4}}>My Daily Activities</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:3}}>
            <div style={{fontSize:'3rem',fontWeight:900,color:'rgba(52,211,153,0.95)',lineHeight:1}}>{todayActs.length}</div>
            <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.30)'}}>today</span>
          </div>
          <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.28)',marginBottom:14}}>{allActs.length} total logged</div>
          <div style={{display:'flex',gap:8,marginBottom:14}}>
            <Stat label='Calls' value={todayActs.filter(a=>a.type==='Call'||a.tag==='Call').length} color='rgba(99,200,255,0.90)'/>
            <Stat label='Meetings' value={todayActs.filter(a=>a.type==='Meeting'||a.tag==='Meeting').length} color='rgba(168,85,247,0.90)'/>
          </div>
          <div style={{fontSize:'0.68rem',color:'rgba(0,220,130,0.70)',fontWeight:700}}>View activities →</div>
        </GlowCard>

        {/* 5 — My Diary · flies from BOTTOM-RIGHT */}
        <GlowCard onClick={()=>setView('salesDiary')}
          bg='linear-gradient(150deg,rgba(100,10,55,0.90) 0%,rgba(65,5,35,0.98) 100%)'
          border='rgba(236,72,153,0.27)' glow='rgba(190,50,120,0.20)'
          anim='dashFlyRight' animDelay={620}>
          <div style={{fontSize:'1.8rem',marginBottom:10}}>📔</div>
          <div style={{fontSize:'0.50rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(236,72,153,0.68)',fontWeight:700,marginBottom:4}}>My Diary</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:3}}>
            <div style={{fontSize:'3rem',fontWeight:900,color:'rgba(251,113,133,0.95)',lineHeight:1}}>{myDiary.length}</div>
            <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.30)'}}>entries</span>
          </div>
          <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.28)',marginBottom:12}}>visit notes &amp; follow-ups</div>
          {lastDiary && (
            <div style={{background:'rgba(236,72,153,0.08)',border:'1px solid rgba(236,72,153,0.15)',borderRadius:10,padding:'9px 12px',marginBottom:14}}>
              <div style={{fontSize:'0.44rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(236,72,153,0.55)',marginBottom:4,fontWeight:700}}>Latest entry</div>
              <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.65)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{lastDiary.company||lastDiary.contactPerson||lastDiary.meetingType||'—'}</div>
            </div>
          )}
          <div style={{fontSize:'0.68rem',color:'rgba(236,72,153,0.70)',fontWeight:700}}>View diary →</div>
        </GlowCard>

      </div>
    </div>
  );
};

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
const NavBar = ({ view, setView, navProtected, onHome, onBack, userRole, userCode='', onLogout, onDirectTool, onDirectorAccess, searchQ='', setSearchQ, onSearch }) => {
  const homeActive    = ['landing','form','relax','revisedSearch','revisedForm','finalPriceSearch','finalPriceForm','loading','results'].includes(view);
  const dashActive    = view === 'dashboard';
  const analyseActive = view === 'analyse';
  const salesActive   = view === 'salesStatus';
  const perfActive    = view === 'salesPerformance';
  const actActive     = view === 'myActivities';
  const diaryActive   = view === 'salesDiary';
  const trackActive   = view === 'trackQuotation';
  const myDashActive  = view === 'salesDashboard';
  const [showDirPrompt, setShowDirPrompt] = useState(false);
  const [dirCode, setDirCode] = useState('');
  const [dirErr, setDirErr] = useState(false);
  const dirInputRef = useRef(null);
  const [showEstPrompt, setShowEstPrompt] = useState(false);
  const [estCode, setEstCode] = useState('');
  const [estErr, setEstErr] = useState(false);
  const estInputRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  useEffect(() => {
    if (!showProfileMenu) return;
    const close = () => setShowProfileMenu(false);
    document.addEventListener('click', close, true);
    return () => document.removeEventListener('click', close, true);
  }, [showProfileMenu]);

  const openDirPrompt = () => { setShowDirPrompt(true); setDirCode(''); setDirErr(false); setTimeout(()=>dirInputRef.current?.focus(),60); };
  const submitDirCode = () => {
    const dc = dirCode.trim().toUpperCase();
    if (dc === 'STAR') { setShowDirPrompt(false); onDirectorAccess?.(dc); }
    else { setDirErr(true); setTimeout(()=>setDirErr(false),1200); }
  };

  const isSales = userRole === 'sales';
  return (
    <div className="nav-bar">
      {/* Centered ESTIMATION title + subtitle — hidden for Sales (they get tabs instead) */}
      {!isSales && (
        <div style={{position:'absolute',left:0,right:0,textAlign:'center',pointerEvents:'none',userSelect:'none',zIndex:0,display:'flex',flexDirection:'column',alignItems:'center',gap:1}}>
          <span style={{fontFamily:"'Cinzel',Georgia,'Times New Roman',serif",fontSize:'clamp(0.80rem,1.1vw,1.0rem)',fontWeight:400,letterSpacing:'0.40em',textTransform:'uppercase',
            background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
            backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            filter:'drop-shadow(0 2px 18px rgba(124,58,237,0.60))',animation:'auroraShift 5s ease infinite'}}>
            ESTIMATION
          </span>
          <span style={{fontSize:'clamp(0.40rem,0.6vw,0.48rem)',letterSpacing:'0.30em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontFamily:"'Inter',sans-serif",fontWeight:400}}>
            — PRECISION ENGINE —
          </span>
        </div>
      )}
      {/* Director code prompt overlay */}
      {showDirPrompt && (
        <div style={{position:'fixed',inset:0,zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.65)',backdropFilter:'blur(6px)'}}>
          <div style={{background:'rgba(8,4,24,0.97)',border:'1px solid rgba(255,200,50,0.28)',borderRadius:14,padding:'28px 32px',width:300,display:'flex',flexDirection:'column',gap:14,boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
            <p style={{fontSize:'0.58rem',letterSpacing:'0.20em',textTransform:'uppercase',color:'rgba(255,200,50,0.55)',margin:0,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>Cost Artist Access</p>
            <p style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.65)',margin:0,fontFamily:"'Inter',sans-serif"}}>Enter Cost Artist code to continue</p>
            <input ref={dirInputRef} type="password" value={dirCode} onChange={e=>{setDirCode(e.target.value);setDirErr(false);}}
              onKeyDown={e=>e.key==='Enter'&&submitDirCode()}
              placeholder="· · · ·"
              style={{background:'transparent',border:`1px solid ${dirErr?'rgba(255,80,80,0.60)':'rgba(255,200,50,0.30)'}`,borderRadius:8,color:dirErr?'rgba(255,100,100,0.90)':'rgba(255,220,80,0.90)',
                fontFamily:"'Rajdhani','Orbitron',monospace",fontSize:'1.4rem',fontWeight:700,letterSpacing:'0.35em',textAlign:'center',
                padding:'10px 14px',outline:'none',width:'100%',boxSizing:'border-box',transition:'border-color 0.2s',textTransform:'uppercase'}}/>
            {dirErr && <p style={{fontSize:'0.72rem',color:'rgba(255,80,80,0.80)',margin:0,textAlign:'center',fontFamily:"'Inter',sans-serif"}}>Invalid code — try again</p>}
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowDirPrompt(false)} style={{flex:1,padding:'9px 0',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.38)',fontFamily:"'Inter',sans-serif",fontSize:'0.82rem',cursor:'pointer',outline:'none'}}>Cancel</button>
              <button onClick={submitDirCode} style={{flex:2,padding:'9px 0',borderRadius:8,background:'rgba(180,140,0,0.15)',border:'1px solid rgba(255,200,50,0.40)',color:'rgba(255,215,60,0.90)',fontFamily:"'Inter',sans-serif",fontSize:'0.84rem',fontWeight:700,cursor:'pointer',outline:'none'}}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      {/* E-Dashboard access code prompt */}
      {showEstPrompt && (
        <div style={{position:'fixed',inset:0,zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.65)',backdropFilter:'blur(6px)'}}>
          <div style={{background:'rgba(8,4,24,0.97)',border:'1px solid rgba(100,180,255,0.28)',borderRadius:14,padding:'28px 32px',width:300,display:'flex',flexDirection:'column',gap:14,boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
            <p style={{fontSize:'0.58rem',letterSpacing:'0.20em',textTransform:'uppercase',color:'rgba(100,180,255,0.60)',margin:0,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>Estimation Access</p>
            <p style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.65)',margin:0,fontFamily:"'Inter',sans-serif"}}>Enter estimator access code</p>
            <input ref={estInputRef} type="password" value={estCode} onChange={e=>{setEstCode(e.target.value);setEstErr(false);}}
              onKeyDown={e=>{if(e.key==='Enter'){const c=estCode.trim().toUpperCase();if(c==='EST'){setShowEstPrompt(false);setEstCode('');setView('dashboard');}else{setEstErr(true);setTimeout(()=>setEstErr(false),1200);}}}}
              placeholder="· · · ·"
              style={{background:'transparent',border:`1px solid ${estErr?'rgba(255,80,80,0.60)':'rgba(100,180,255,0.30)'}`,borderRadius:8,color:estErr?'rgba(255,100,100,0.90)':'rgba(100,200,255,0.90)',
                fontFamily:"'Rajdhani','Orbitron',monospace",fontSize:'1.4rem',fontWeight:700,letterSpacing:'0.35em',textAlign:'center',
                padding:'10px 14px',outline:'none',width:'100%',boxSizing:'border-box',transition:'border-color 0.2s',textTransform:'uppercase'}}/>
            {estErr && <p style={{fontSize:'0.72rem',color:'rgba(255,80,80,0.80)',margin:0,textAlign:'center',fontFamily:"'Inter',sans-serif"}}>Invalid code — try again</p>}
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>{setShowEstPrompt(false);setEstCode('');}} style={{flex:1,padding:'9px 0',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.38)',fontFamily:"'Inter',sans-serif",fontSize:'0.82rem',cursor:'pointer',outline:'none'}}>Cancel</button>
              <button onClick={()=>{const c=estCode.trim().toUpperCase();if(c==='EST'){setShowEstPrompt(false);setEstCode('');setView('dashboard');}else{setEstErr(true);setTimeout(()=>setEstErr(false),1200);}}} style={{flex:2,padding:'9px 0',borderRadius:8,background:'rgba(0,100,200,0.15)',border:'1px solid rgba(100,180,255,0.40)',color:'rgba(120,200,255,0.90)',fontFamily:"'Inter',sans-serif",fontSize:'0.84rem',fontWeight:700,cursor:'pointer',outline:'none'}}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      {/* Logo / branding */}
      {isSales ? (
        <img src="/NN.png" alt="N" onClick={onHome} style={{height:34,width:'auto',objectFit:'contain',flexShrink:0,cursor:'pointer',filter:'brightness(1.6) saturate(1.4)',opacity:0.90}}/>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:1,flexShrink:0,cursor:'pointer'}} onClick={onHome}>
          <div style={{fontSize:'clamp(0.62rem,1vw,0.78rem)',fontWeight:500,letterSpacing:'0.26em',textTransform:'uppercase',
            background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
            backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            animation:'auroraShift 5s ease infinite'}}>NAFFCO AI APEX</div>
          <div style={{fontSize:'clamp(0.40rem,0.7vw,0.50rem)',letterSpacing:'0.34em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)'}}>Passion to Protect</div>
        </div>
      )}

      {/* Role-based nav pills — visible for Sales, hidden otherwise */}
      <div className="nav-pills" style={isSales ? {marginLeft:16} : {display:'none'}}>
        {/* ── Guest (no role) — public request access ── */}
        {!userRole && <>
          <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
            New Request
          </button>
          <button className={`nav-btn${view==='openRequests'?' active':''}`} onClick={()=>setView('openRequests')}>
            Open Requests
          </button>
          <button className={`nav-btn${dashActive?' active':''}`} onClick={()=>{setShowEstPrompt(true);setEstCode('');setEstErr(false);setTimeout(()=>estInputRef.current?.focus(),60);}}>
            E-Dashboard
          </button>
        </>}

        {/* ── Sales View ── */}
        {userRole === 'sales' && <>
          <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
            Sales &amp; Marketing
          </button>
          <button className={`nav-btn${myDashActive?' active':''}`} onClick={()=>setView('salesDashboard')}>
            My Dashboard
          </button>
          <button className={`nav-btn${trackActive?' active':''}`} onClick={()=>setView('trackQuotation')}>
            Track Quotation
          </button>
          <button className={`nav-btn${view==='quotedRequests'?' active':''}`} onClick={()=>setView('quotedRequests')}>
            Quoted Requests
          </button>
        </>}

        {/* ── Estimator View ── */}
        {userRole === 'estimator' && <>
          <button className={`nav-btn${dashActive?' active':''}`} onClick={()=>setView('dashboard')}>
            Estimator Dashboard
          </button>
          <button className={`nav-btn${view==='openRequests'?' active':''}`} onClick={()=>setView('openRequests')}>
            Open Requests
          </button>
          <button className={`nav-btn${view==='estOverview'?' active':''}`} onClick={()=>navProtected('estOverview')}>
            Request Overview
          </button>
          <button className={`nav-btn${view==='myTeam'?' active':''}`} onClick={()=>navProtected('myTeam')}>
            My Team
          </button>
        </>}

        {/* ── Director View ── */}
        {userRole === 'director' && <>
          <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
            New Request
          </button>
          <button className={`nav-btn${view==='openRequests'?' active':''}`} onClick={()=>setView('openRequests')}>
            Open Requests
          </button>
          <button className={`nav-btn${dashActive?' active':''}`} onClick={()=>setView('dashboard')}>
            Estimation Team Dashboard
          </button>
          <button className={`nav-btn${view==='estOverview'?' active':''}`} onClick={()=>navProtected('estOverview')}>
            Request Overview
          </button>
          <button className={`nav-btn${view==='myTeam'?' active':''}`} onClick={()=>navProtected('myTeam')}>
            My Team
          </button>
          <button className={`nav-btn${analyseActive?' active':''}`} onClick={()=>setView('analyse')}>
            Analysis
          </button>
          <button className={`nav-btn${salesActive?' active':''}`} onClick={()=>setView('salesStatus')}>
            Sales View
          </button>
          <button className={`nav-btn${view==='quotedRequests'?' active':''}`} onClick={()=>setView('quotedRequests')}>
            Quoted Requests
          </button>
          <button className={`nav-btn${perfActive?' active':''}`} onClick={()=>setView('salesPerformance')}>
            Sales Performance
          </button>
          <button className={`nav-btn${actActive?' active':''}`} onClick={()=>setView('myActivities')}>
            Sales Daily Activities
          </button>
          <button className={`nav-btn${diaryActive?' active':''}`} onClick={()=>setView('salesDiary')}>
            Sales Diary
          </button>
        </>}
      </div>

      {/* Sales center search bar */}
      {isSales && (
        <div style={{flex:1,display:'flex',justifyContent:'center',padding:'0 16px',minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:50,padding:'5px 6px 5px 16px',width:'100%',maxWidth:460}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={searchQ}
              onChange={e=>setSearchQ&&setSearchQ(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&onSearch&&onSearch()}
              placeholder="Search for Requested Quote..."
              style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.80)',fontSize:'0.76rem',fontFamily:"'Inter',sans-serif",minWidth:0}}
            />
            <button onClick={()=>onSearch&&onSearch()}
              style={{background:'rgba(130,90,255,0.20)',border:'1px solid rgba(130,90,255,0.35)',borderRadius:50,padding:'4px 14px',color:'rgba(180,150,255,0.90)',fontSize:'0.68rem',fontWeight:700,cursor:'pointer',outline:'none',letterSpacing:'0.06em',fontFamily:"'Inter',sans-serif",flexShrink:0,transition:'all 0.15s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(130,90,255,0.38)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(130,90,255,0.20)';}}>
              Search
            </button>
          </div>
        </div>
      )}

      {/* Right-side action buttons + profile badge */}
      <div style={{marginLeft: isSales ? 0 : 'auto',display:'flex',alignItems:'center',gap:8,flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end'}}>
        {/* Director View button — for guest on dashboard */}
        {!userRole && view === 'dashboard' && (
          <button onClick={openDirPrompt}
            style={{display:'inline-flex', alignItems:'center', gap:5,
              background:'rgba(20,12,4,0.80)',
              border:'1px solid rgba(255,200,50,0.40)',
              borderRadius:50, padding:'6px 12px',
              color:'rgba(255,210,60,0.88)',
              fontFamily:"'Inter',sans-serif", fontSize:'0.70rem', fontWeight:700, letterSpacing:'0.06em',
              cursor:'pointer', outline:'none',
              boxShadow:'0 2px 12px rgba(200,150,0,0.18)',
              backdropFilter:'blur(10px)', transition:'all 0.2s', whiteSpace:'nowrap',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#92400e,#d97706,#fbbf24)';e.currentTarget.style.color='#fff';e.currentTarget.style.boxShadow='0 4px 22px rgba(200,150,0,0.45)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(20,12,4,0.80)';e.currentTarget.style.color='rgba(255,210,60,0.88)';e.currentTarget.style.boxShadow='0 2px 12px rgba(200,150,0,0.18)';}}>
            ⬡ Cost Artist
          </button>
        )}

        <button
          onClick={onBack || onHome}
          style={{position:'relative',zIndex:1,display:'inline-flex',alignItems:'center',gap:5,background:'rgba(0,0,0,0.44)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:100,padding:'6px 14px',cursor:'pointer',color:'rgba(255,255,255,0.55)',fontSize:'0.72rem',letterSpacing:'0.10em',textTransform:'uppercase',fontFamily:"'Inter',sans-serif",fontWeight:500,outline:'none',flexShrink:0}}
          onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,0.30)';}}
          onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.55)';e.currentTarget.style.borderColor='rgba(255,255,255,0.13)';}}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        {/* Profile badge — on the far right */}
        {userRole && (
          <div style={{position:'relative',flexShrink:0}}>
            <button onClick={()=>setShowProfileMenu(v=>!v)}
              style={{
                display:'flex', alignItems:'center', gap:9,
                padding:'4px 14px 4px 4px', borderRadius:50,
                background: showProfileMenu
                  ? (userRole==='sales'?'rgba(130,90,255,0.20)':userRole==='estimator'?'rgba(0,150,255,0.20)':'rgba(200,150,0,0.20)')
                  : (userRole==='sales'?'rgba(130,90,255,0.10)':userRole==='estimator'?'rgba(0,150,255,0.10)':'rgba(200,150,0,0.10)'),
                border: userRole==='sales'?'1px solid rgba(130,90,255,0.28)':userRole==='estimator'?'1px solid rgba(0,180,255,0.28)':'1px solid rgba(220,170,0,0.28)',
                cursor:'pointer', outline:'none',
                transition:'all 0.15s',
              }}>
              <EstAvatar name={STAFF_NAMES[userCode]||''} code={userCode} size={30}/>
              <div style={{display:'flex',flexDirection:'column',gap:1}}>
                <span style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(255,255,255,0.85)',lineHeight:1.1,fontFamily:"'Inter',sans-serif",
                  maxWidth:130,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {STAFF_NAMES[userCode] || userCode}
                </span>
                <span style={{fontSize:'0.50rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',
                  color:userRole==='sales'?'rgba(160,130,255,0.70)':userRole==='estimator'?'rgba(0,200,255,0.70)':'rgba(255,210,60,0.70)'}}>
                  {userRole === 'sales' ? 'Sales' : userRole === 'estimator' ? 'Estimator' : 'Costing Art Lead'}
                </span>
              </div>
              <span style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.30)',marginLeft:2,transition:'transform 0.15s',
                display:'inline-block',transform:showProfileMenu?'rotate(180deg)':'rotate(0deg)'}}>▼</span>
            </button>
            {showProfileMenu && (
              <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,zIndex:9999,
                background:'rgba(8,4,24,0.97)',border:'1px solid rgba(255,255,255,0.12)',
                borderRadius:10,padding:'6px',minWidth:140,
                boxShadow:'0 12px 40px rgba(0,0,0,0.60)',animation:'fadeUp 0.15s ease both'}}>
                <button onClick={()=>{setShowProfileMenu(false);onLogout?.();}}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:8,
                    padding:'9px 12px',borderRadius:7,background:'transparent',border:'none',
                    color:'rgba(255,100,100,0.80)',fontFamily:"'Inter',sans-serif",fontSize:'0.78rem',
                    fontWeight:600,cursor:'pointer',outline:'none',textAlign:'left',transition:'background 0.12s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.10)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ACCESS CODE MODAL (shared for dashboard EST, overview TSE, team TSE) ────
const VIEW_CODES    = { dashboard:'EST', estOverview:'TSE', myTeam:'TSE' };
const VIEW_LABELS_G = { dashboard:'Estimator Dashboard', estOverview:'Request Overview', myTeam:'My Team' };
const VIEW_ACCENT   = { dashboard:'rgba(80,160,255,0.75)', estOverview:'rgba(20,184,166,0.75)', myTeam:'rgba(20,184,166,0.75)' };
const VIEW_BTN_BG   = { dashboard:'rgba(80,160,255,0.18)',  estOverview:'rgba(20,184,166,0.18)',  myTeam:'rgba(20,184,166,0.18)'  };
const VIEW_BTN_HV   = { dashboard:'rgba(80,160,255,0.34)',  estOverview:'rgba(20,184,166,0.34)',  myTeam:'rgba(20,184,166,0.34)'  };
const VIEW_BTN_C    = { dashboard:'rgba(140,210,255,0.95)', estOverview:'rgba(94,234,212,0.95)', myTeam:'rgba(94,234,212,0.95)'  };

const TseAccessModal = ({ pendingView, onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  const F = "'Inter',sans-serif";
  const required = VIEW_CODES[pendingView] || 'TSE';

  const submit = () => {
    if (code.trim().toUpperCase() === required) { onSuccess(); }
    else { setErr(true); setTimeout(() => setErr(false), 1400); setCode(''); }
  };

  // Particles: [left%, bottom%, size_px, delay_s, duration_s, type(0=float,1=twinkle), color(0=gold,1=blue,2=white)]
  // color: 0=gold(dominant), 1=blue(accent), 2=white(accent) — ~16 gold, 5 blue, 4 white
  const PARTS = [
    [7,12,3,0.0,3.2,0,0],[14,45,2,0.6,4.0,1,0],[22,28,4,1.1,3.6,0,0],[31,60,2,0.3,4.5,1,1],[40,18,3,1.8,3.1,0,0],
    [49,52,2,0.8,4.2,1,0],[57,35,5,2.1,3.8,0,0],[65,70,2,0.4,3.4,1,2],[73,22,3,1.5,4.6,0,0],[82,48,2,0.9,3.3,1,0],
    [90,15,4,1.3,4.1,0,0],[95,62,2,2.4,3.7,1,1],[18,80,3,2.7,4.3,0,0],[35,38,2,1.6,3.5,1,0],[53,55,4,0.2,4.8,0,2],
    [68,25,2,2.0,3.9,1,0],[78,72,3,0.7,4.4,0,0],[87,42,2,1.9,3.6,1,1],[11,65,5,2.3,4.2,0,0],[44,30,2,1.0,3.8,1,0],
    [5,50,3,1.4,3.5,0,0],[25,15,2,0.5,4.1,1,2],[60,85,4,2.2,3.3,0,0],[75,40,2,0.1,4.7,1,1],[93,28,3,1.7,3.9,0,0],
  ];
  const COLORS = [
    // gold
    { bg:'radial-gradient(circle,#ffd93d 30%,rgba(255,160,0,0.55) 100%)', glow:'rgba(255,200,50,0.70)', glowB:'rgba(255,220,80,1.00)' },
    // blue
    { bg:'radial-gradient(circle,#60c8ff 30%,rgba(30,120,255,0.55) 100%)',  glow:'rgba(60,160,255,0.70)',  glowB:'rgba(100,200,255,1.00)' },
    // white
    { bg:'radial-gradient(circle,#ffffff 20%,rgba(180,220,255,0.50) 100%)', glow:'rgba(200,230,255,0.60)', glowB:'rgba(255,255,255,0.95)' },
  ];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9100, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,0.72)', backdropFilter:'blur(18px)', fontFamily:F, overflow:'hidden' }}
      onClick={onCancel}>
      <style>{`
        @keyframes tseFloat {
          0%   { transform:translateY(0) scale(1);    opacity:var(--gop,0.8); }
          55%  { opacity:var(--gop,0.8); }
          100% { transform:translateY(-100px) scale(0.10); opacity:0; }
        }
        @keyframes tseTwinkle {
          0%,100% { transform:scale(0.5) rotate(0deg);   opacity:0.15; }
          50%      { transform:scale(1.6) rotate(180deg); opacity:var(--gop,0.95); }
        }
        @keyframes tseGlowGold  { 0%,100%{box-shadow:0 0 5px 2px rgba(255,200,50,0.45)} 50%{box-shadow:0 0 16px 6px rgba(255,220,80,0.95)} }
        @keyframes tseGlowBlue  { 0%,100%{box-shadow:0 0 5px 2px rgba(60,160,255,0.45)} 50%{box-shadow:0 0 16px 6px rgba(100,200,255,0.95)} }
        @keyframes tseGlowWhite { 0%,100%{box-shadow:0 0 5px 2px rgba(200,230,255,0.35)} 50%{box-shadow:0 0 14px 5px rgba(255,255,255,0.80)} }
        @keyframes tseNumRise {
          0%   { transform:translateY(0);   opacity:0; }
          12%  { opacity:var(--nop,0.18); }
          80%  { opacity:var(--nop,0.18); }
          100% { transform:translateY(-140px); opacity:0; }
        }
      `}</style>
      {/* Floating digit streams */}
      {[
        [3,  -5, '7 2 9', 0.0, 6.5, 0.14,'rgba(255,210,60,0.90)'],
        [10, -8, '4 1',   1.2, 5.8, 0.12,'rgba(255,220,80,0.85)'],
        [19, -3, '8 3 6', 2.4, 7.1, 0.16,'rgba(180,210,255,0.80)'],
        [27,-10, '0 5',   0.7, 6.2, 0.13,'rgba(255,215,50,0.90)'],
        [36, -6, '1 9 4', 3.1, 5.5, 0.15,'rgba(255,210,60,0.85)'],
        [45, -4, '6 2',   1.8, 6.8, 0.12,'rgba(220,235,255,0.75)'],
        [54, -9, '3 7 0', 0.3, 7.3, 0.17,'rgba(255,220,70,0.90)'],
        [63, -2, '5 8',   2.6, 5.9, 0.13,'rgba(255,210,60,0.85)'],
        [72, -7, '2 4 1', 1.0, 6.4, 0.15,'rgba(180,210,255,0.80)'],
        [81,-11, '9 6',   3.5, 5.6, 0.12,'rgba(255,215,50,0.90)'],
        [89, -5, '0 3 8', 0.6, 7.0, 0.16,'rgba(255,220,80,0.85)'],
        [97, -3, '5 1',   2.0, 6.1, 0.13,'rgba(220,235,255,0.75)'],
      ].map(([x,b,txt,delay,dur,nop,col], i) => (
        <div key={`n${i}`} style={{
          position:'absolute', left:`${x}%`, bottom:`${b}%`,
          pointerEvents:'none', userSelect:'none',
          fontFamily:"'Courier New',monospace", fontSize:'0.70rem', fontWeight:700,
          letterSpacing:'0.18em', color:col, lineHeight:2.2, whiteSpace:'nowrap',
          writingMode:'vertical-lr', textOrientation:'mixed',
          '--nop': nop,
          animationName:'tseNumRise',
          animationDuration:`${dur}s`,
          animationDelay:`${delay}s`,
          animationTimingFunction:'linear',
          animationIterationCount:'infinite',
          animationFillMode:'both',
        }}>{txt.split(' ').join('\n')}</div>
      ))}
      {PARTS.map(([x,b,sz,delay,dur,type,col], i) => {
        const C = COLORS[col];
        const glowAnim = col===0 ? 'tseGlowGold' : col===1 ? 'tseGlowBlue' : 'tseGlowWhite';
        const moveAnim = type===1 ? 'tseTwinkle' : 'tseFloat';
        return (
          <div key={i} style={{
            position:'absolute', left:`${x}%`, bottom:`${b}%`, width:sz, height:sz,
            borderRadius: type===1 ? '2px' : '50%',
            pointerEvents:'none',
            background: C.bg,
            '--gop': 0.55 + (i % 6) * 0.08,
            animationName: `${moveAnim}, ${glowAnim}`,
            animationDuration: `${dur}s, ${dur*0.65}s`,
            animationDelay: `${delay}s, ${delay*0.4}s`,
            animationTimingFunction: 'ease-in-out, ease-in-out',
            animationIterationCount: 'infinite, infinite',
            animationFillMode: 'both, both',
          }}/>
        );
      })}
      <div style={{ width:'min(360px,92vw)', background:'rgba(255,255,255,0.07)',
        backdropFilter:'blur(40px) saturate(1.4) brightness(1.08)',
        WebkitBackdropFilter:'blur(40px) saturate(1.4) brightness(1.08)',
        borderRadius:20, padding:'36px 32px 30px',
        boxShadow:'0 24px 80px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,255,255,0.18), 0 0 60px rgba(255,200,60,0.07)',
        display:'flex', flexDirection:'column', gap:18, position:'relative', zIndex:1 }}
        onClick={e => e.stopPropagation()}>
        <div>
          <div style={{ fontSize:'0.52rem', letterSpacing:'0.22em', textTransform:'uppercase',
            color: VIEW_ACCENT[pendingView]||'rgba(20,184,166,0.75)', fontWeight:700, marginBottom:8 }}>Restricted Access</div>
          <div style={{ fontSize:'1.1rem', fontWeight:800, color:'rgba(255,255,255,0.92)', lineHeight:1.2, marginBottom:6 }}>
            {VIEW_LABELS_G[pendingView] || 'Protected Page'}
          </div>
          <div style={{ fontSize:'0.76rem', color:'rgba(255,255,255,0.38)', lineHeight:1.5 }}>
            Enter the access code to continue.
          </div>
        </div>
        <input autoFocus type="password" value={code}
          onChange={e => { setCode(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Access code…"
          style={{ background:'rgba(255,255,255,0.08)', border:`1px solid ${err?'rgba(255,80,80,0.60)':'rgba(255,255,255,0.18)'}`,
            borderRadius:10, padding:'13px 16px', color:'#fff', fontFamily:F, fontSize:'1rem',
            outline:'none', letterSpacing:'0.16em', textTransform:'uppercase', transition:'border-color 0.18s' }}
        />
        {err && <div style={{ fontSize:'0.72rem', color:'rgba(255,100,100,0.90)', marginTop:-8 }}>Invalid code — try again.</div>}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel}
            style={{ flex:1, padding:'11px 0', borderRadius:10, background:'rgba(255,255,255,0.08)',
              border:'1px solid rgba(255,255,255,0.18)', color:'rgba(255,255,255,0.75)',
              fontFamily:F, fontSize:'0.84rem', cursor:'pointer', outline:'none', transition:'all 0.15s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.14)'; e.currentTarget.style.color='rgba(255,255,255,0.92)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.75)'; }}>
            Cancel
          </button>
          <button onClick={submit}
            style={{ flex:2, padding:'11px 0', borderRadius:10,
              background: VIEW_BTN_BG[pendingView]||'rgba(20,184,166,0.18)',
              color: VIEW_BTN_C[pendingView]||'rgba(94,234,212,0.95)',
              fontFamily:F, fontSize:'0.88rem', fontWeight:700, border:'none', cursor:'pointer', outline:'none',
              transition:'background 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.background = VIEW_BTN_HV[pendingView]||'rgba(20,184,166,0.34)'}
            onMouseLeave={e => e.currentTarget.style.background = VIEW_BTN_BG[pendingView]||'rgba(20,184,166,0.18)'}>
            Confirm →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ESTIMATION TEAM VIEW (standalone page) ──────────────────────────────────
const EstimationTeamView = ({ requests }) => {
  const F = "'Inter',sans-serif";
  const [detail, setDetail] = useState(null);

  const scored = EST_ROSTER.map(e => {
    const rqs       = (requests||[]).filter(r => r.estimator === e.name);
    const inHand    = rqs.filter(r => r.reqStatus === 'inprogress' || r.reqStatus === 'pending-director');
    const closed    = rqs.filter(r => r.reqStatus === 'completed' || r.directorAction === 'approved');
    const total     = rqs.length;
    const timings   = rqs.filter(r => r.taggedAt && r.quotationSubmittedAt)
                        .map(r => new Date(r.quotationSubmittedAt).getTime() - r.taggedAt);
    const avgMs     = timings.length ? timings.reduce((a,b)=>a+b,0)/timings.length : null;
    const score     = closed.length * 3 + inHand.length;
    return { e, rqs, inHand, closed, total, avgMs, score };
  }).sort((a,b) => b.score - a.score);

  const fmtDur = ms => {
    if (!ms) return '—';
    const d = Math.floor(ms/86400000), h = Math.floor((ms%86400000)/3600000), m = Math.floor((ms%3600000)/60000);
    return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const MEDALS = ['🥇','🥈','🥉'];

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', padding:'72px 28px 28px', fontFamily:F, color:'#e2e8f0', overflowY:'auto' }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:'0.52rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(20,184,166,0.65)', marginBottom:4, fontWeight:700 }}>NAFFCO · AI SYSTEM</p>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'rgba(255,255,255,0.92)', margin:0 }}>Estimation Team</h2>
        <p style={{ fontSize:'0.76rem', color:'rgba(255,255,255,0.32)', marginTop:4 }}>
          {EST_ROSTER.length} team members · {(requests||[]).filter(r=>r.estimator && (r.reqStatus==='inprogress'||r.reqStatus==='pending-director')).length} active requests
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:16 }}>
        {scored.map(({ e, inHand, closed, total, avgMs, score }, idx) => {
          const isAvail = inHand.length === 0;
          const statusC = isAvail ? 'rgba(52,211,153,0.90)' : inHand.length <= 2 ? 'rgba(251,191,36,0.90)' : 'rgba(239,68,68,0.90)';
          const avatar = AVATAR_URLS[e.code];
          const isSelected = detail?.code === e.code;
          return (
            <div key={e.code} onClick={() => setDetail(isSelected ? null : e)}
              style={{ borderRadius:16, padding:'20px 22px', cursor:'pointer',
                background: isSelected ? 'rgba(20,184,166,0.10)' : 'rgba(255,255,255,0.04)',
                border:`1px solid ${isSelected?'rgba(20,184,166,0.45)':'rgba(255,255,255,0.10)'}`,
                transition:'all 0.22s', backdropFilter:'blur(14px)' }}
              onMouseEnter={e2 => { if(!isSelected) { e2.currentTarget.style.background='rgba(255,255,255,0.07)'; e2.currentTarget.style.borderColor='rgba(255,255,255,0.20)'; } }}
              onMouseLeave={e2 => { if(!isSelected) { e2.currentTarget.style.background='rgba(255,255,255,0.04)'; e2.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; } }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  {avatar
                    ? <img src={avatar} alt={e.name} style={{ width:46, height:46, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(20,184,166,0.40)' }}/>
                    : <div style={{ width:46, height:46, borderRadius:'50%', background:'rgba(20,184,166,0.14)', border:'2px solid rgba(20,184,166,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:800, color:'rgba(94,234,212,0.90)' }}>{e.name.trim().split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div>
                  }
                  <div style={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:statusC, border:'2px solid rgba(6,3,18,0.95)', boxShadow:`0 0 6px ${statusC}` }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {idx < 3 && <span style={{ fontSize:'0.9rem' }}>{MEDALS[idx]}</span>}
                    <span style={{ fontSize:'0.86rem', fontWeight:700, color:'rgba(255,255,255,0.90)', lineHeight:1.2 }}>{e.name}</span>
                  </div>
                  <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.32)', marginTop:3, fontFamily:'monospace' }}>{e.code}</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
                {[
                  { label:'In Hand', value:inHand.length, c:'rgba(251,191,36,0.90)' },
                  { label:'Closed', value:closed.length, c:'rgba(52,211,153,0.90)' },
                  { label:'Total', value:total, c:'rgba(148,163,184,0.80)' },
                ].map(({label,value,c}) => (
                  <div key={label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'8px 0', textAlign:'center' }}>
                    <div style={{ fontSize:'1.0rem', fontWeight:800, color:c, lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:'0.52rem', color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.10em', marginTop:3 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.28)' }}>Avg. TAT: <span style={{ color:'rgba(255,255,255,0.60)', fontFamily:'monospace' }}>{fmtDur(avgMs)}</span></span>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:statusC, boxShadow:`0 0 5px ${statusC}`, flexShrink:0 }}/>
                  <span style={{ fontSize:'0.62rem', fontWeight:700, color:statusC }}>
                    {isAvail ? 'Available' : `${inHand.length} In Hand`}
                  </span>
                </div>
              </div>
              {isSelected && (
                <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid rgba(20,184,166,0.18)' }}>
                  {inHand.length > 0 ? inHand.slice(0,5).map(r => (
                    <div key={r.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'rgba(255,255,255,0.55)', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontFamily:'monospace', color:'rgba(20,184,166,0.75)', marginRight:8 }}>{r.id}</span>
                      <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.proj||r.client||'—'}</span>
                    </div>
                  )) : <div style={{ fontSize:'0.70rem', color:'rgba(52,211,153,0.70)', fontStyle:'italic' }}>No active requests — available.</div>}
                  {inHand.length > 5 && <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.28)', marginTop:4 }}>+{inHand.length-5} more</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── ESTIMATOR HUB ─────────────────────────────────────────────────────────────
// Stable tile — module scope, each tile gets its own colour shine
const HubTile = ({ tile, hov, setHov }) => {
  const F = "'Inter',sans-serif";
  const isHov = hov === tile.id;
  const isLarge = tile.gridRow.includes('span');
  const isWide  = tile.gridColumn.includes('span');
  return (
    <div
      onClick={tile.onClick}
      onMouseEnter={() => setHov(tile.id)}
      onMouseLeave={() => setHov(null)}
      style={{
        gridColumn: tile.gridColumn, gridRow: tile.gridRow,
        position: 'relative', overflow: 'hidden', borderRadius: 18,
        border: `1px solid ${isHov ? tile.shine.border1 : tile.shine.border0}`,
        background: isHov ? tile.shine.bg1 : tile.shine.bg0,
        backdropFilter: 'blur(36px) saturate(1.3) brightness(1.08)',
        WebkitBackdropFilter: 'blur(36px) saturate(1.3) brightness(1.08)',
        boxShadow: isHov
          ? `0 20px 56px rgba(0,0,0,0.42), inset 0 1.5px 0 ${tile.shine.rim1}, inset 0 -1px 0 rgba(0,0,0,0.10), 0 0 36px ${tile.shine.glow}`
          : `inset 0 1.5px 0 ${tile.shine.rim0}, inset 0 -1px 0 rgba(0,0,0,0.07), 0 4px 18px rgba(0,0,0,0.30)`,
        cursor: 'pointer',
        transition: 'all 0.26s cubic-bezier(0.34,1.08,0.64,1)',
        transform: isHov ? 'translateY(-5px) scale(1.016)' : 'none',
        display: 'flex', flexDirection: 'column',
        justifyContent: (isLarge || isWide) ? 'flex-end' : 'space-between',
        padding: isLarge ? '28px 28px 22px' : isWide ? '20px 24px 18px' : '18px 20px 16px',
        fontFamily: F,
      }}
    >
      {/* Per-tile colour shine blob */}
      <div style={{ position:'absolute', top:-50, left:-50, width:220, height:220, background:`radial-gradient(circle,${tile.shine.glow} 0%,transparent 62%)`, pointerEvents:'none', opacity: isHov ? 0.75 : 0.28, transition:'opacity 0.26s' }}/>
      {/* Frosted top-edge streak tinted with tile colour */}
      <div style={{ position:'absolute', top:0, left:'8%', right:'8%', height:1, background:`linear-gradient(90deg,transparent,${tile.shine.streak} 35%,${tile.shine.streak} 65%,transparent)`, pointerEvents:'none' }}/>
      {/* Corner gloss */}
      <div style={{ position:'absolute', top:0, right:0, width:110, height:110, background:`linear-gradient(225deg,${tile.shine.corner} 0%,transparent 52%)`, borderRadius:'0 18px 0 0', pointerEvents:'none' }}/>
      {/* Tag badge */}
      <div style={{ position:'absolute', top: isLarge?17:11, right: isLarge?17:11, padding:'2px 8px', borderRadius:20, background:tile.shine.tagBg, border:`1px solid ${tile.shine.tagBd}`, fontSize:'0.49rem', fontWeight:700, letterSpacing:'0.12em', color:tile.shine.accent, textTransform:'uppercase', pointerEvents:'none' }}>{tile.tag}</div>
      {/* Icon box */}
      <div style={{ display:'flex', alignItems: isWide?'center':'flex-start', zIndex:1, flexDirection: isWide?'row':'column', gap: isWide?14:0 }}>
        <div style={{ width: isLarge?50:38, height: isLarge?50:38, borderRadius:10, background:tile.shine.iconBg, border:`1px solid ${tile.shine.iconBd}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {tile.icon}
        </div>
        {isWide && (
          <div style={{ zIndex:1 }}>
            <div style={{ fontSize:'1.05rem', fontWeight:800, color:'rgba(255,255,255,0.90)', lineHeight:1.18, letterSpacing:'-0.01em', marginBottom:3 }}>{tile.label}</div>
            <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.40)', lineHeight:1.5 }}>{tile.sub}</div>
          </div>
        )}
      </div>
      {/* Label + subtitle (non-wide tiles) */}
      {!isWide && (
        <div style={{ zIndex:1, marginTop: isLarge ? 'auto' : 10 }}>
          <div style={{ fontSize: isLarge?'1.38rem':'0.90rem', fontWeight:800, color:'rgba(255,255,255,0.90)', lineHeight:1.18, letterSpacing:'-0.01em', marginBottom: isLarge?6:4 }}>{tile.label}</div>
          <div style={{ fontSize: isLarge?'0.71rem':'0.63rem', color:'rgba(255,255,255,0.38)', lineHeight:1.5 }}>{tile.sub}</div>
        </div>
      )}
      {/* Footer arrow */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', marginTop: isLarge?13:9, paddingTop: isLarge?10:8, borderTop:`1px solid ${tile.shine.divider}`, zIndex:1 }}>
        <div style={{ width:22, height:22, borderRadius:7, background:tile.shine.iconBg, border:`1px solid ${tile.shine.iconBd}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 0.16s', transform: isHov?'translateX(3px)':'none' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={tile.shine.accent} strokeWidth="2.4" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>
        </div>
      </div>
    </div>
  );
};

// Helper — builds a shine palette from a single hue (rgb string like "80,160,255")
const hubShine = (r,g,b) => ({
  bg0:    `rgba(${r},${g},${b},0.06)`,
  bg1:    `rgba(${r},${g},${b},0.14)`,
  border0:`rgba(${r},${g},${b},0.22)`,
  border1:`rgba(${r},${g},${b},0.50)`,
  rim0:   `rgba(${r},${g},${b},0.28)`,
  rim1:   `rgba(${r},${g},${b},0.50)`,
  glow:   `rgba(${r},${g},${b},0.35)`,
  streak: `rgba(${r},${g},${b},0.55)`,
  corner: `rgba(${r},${g},${b},0.09)`,
  accent: `rgba(${r},${g},${b},0.95)`,
  tagBg:  `rgba(${r},${g},${b},0.10)`,
  tagBd:  `rgba(${r},${g},${b},0.28)`,
  iconBg: `rgba(${r},${g},${b},0.10)`,
  iconBd: `rgba(${r},${g},${b},0.26)`,
  divider:`rgba(${r},${g},${b},0.14)`,
});

// Icons — coloured to match each tile's shine
const HubIconDash = (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><rect x="4" y="4" width="18" height="18" rx="3" fill="rgba(80,160,255,0.18)" stroke="rgba(80,160,255,0.80)" strokeWidth="1.6"/><rect x="26" y="4" width="18" height="8" rx="3" fill="rgba(80,160,255,0.10)" stroke="rgba(80,160,255,0.55)" strokeWidth="1.6"/><rect x="26" y="16" width="18" height="6" rx="3" fill="rgba(80,160,255,0.07)" stroke="rgba(80,160,255,0.38)" strokeWidth="1.6"/><rect x="4" y="26" width="40" height="18" rx="3" fill="rgba(80,160,255,0.12)" stroke="rgba(80,160,255,0.62)" strokeWidth="1.6"/><line x1="10" y1="34" x2="38" y2="34" stroke="rgba(160,210,255,0.30)" strokeWidth="1"/><line x1="10" y1="39" x2="28" y2="39" stroke="rgba(160,210,255,0.18)" strokeWidth="1"/></svg>);
const HubIconNew  = (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.42)" strokeWidth="1.6" strokeDasharray="5 3"/><line x1="24" y1="13" x2="24" y2="35" stroke="rgba(196,150,255,0.90)" strokeWidth="2.8" strokeLinecap="round"/><line x1="13" y1="24" x2="35" y2="24" stroke="rgba(196,150,255,0.90)" strokeWidth="2.8" strokeLinecap="round"/></svg>);
const HubIconOpen = (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><rect x="5" y="10" width="38" height="28" rx="4" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.48)" strokeWidth="1.6"/><line x1="12" y1="19" x2="36" y2="19" stroke="rgba(110,230,180,0.70)" strokeWidth="1.7" strokeLinecap="round"/><line x1="12" y1="25" x2="30" y2="25" stroke="rgba(110,230,180,0.48)" strokeWidth="1.7" strokeLinecap="round"/><line x1="12" y1="31" x2="24" y2="31" stroke="rgba(110,230,180,0.28)" strokeWidth="1.7" strokeLinecap="round"/><circle cx="37" cy="11" r="5" fill="rgba(255,100,80,0.72)"/></svg>);
const HubIconOv   = (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" fill="rgba(251,191,36,0.07)" stroke="rgba(251,191,36,0.38)" strokeWidth="1.6"/><path d="M12 28 L18 20 L24 24 L32 15 L38 19" stroke="rgba(255,220,90,0.88)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="20" r="2.2" fill="rgba(255,220,90,0.85)"/><circle cx="24" cy="24" r="2.2" fill="rgba(255,220,90,0.85)"/><circle cx="32" cy="15" r="2.2" fill="rgba(255,220,90,0.85)"/></svg>);
const HubIconKPI  = (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><rect x="7" y="30" width="7" height="11" rx="2" fill="rgba(249,115,22,0.55)"/><rect x="18" y="22" width="7" height="19" rx="2" fill="rgba(249,115,22,0.72)"/><rect x="29" y="12" width="7" height="29" rx="2" fill="rgba(249,115,22,0.92)"/><line x1="4" y1="42" x2="44" y2="42" stroke="rgba(255,160,80,0.30)" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const HubIconRev  = (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><path d="M10 24 A14 14 0 1 1 24 38" stroke="rgba(236,72,153,0.78)" strokeWidth="2.2" fill="none" strokeLinecap="round"/><polyline points="8,31 10,24 17,26" stroke="rgba(236,72,153,0.90)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><line x1="19" y1="23" x2="35" y2="23" stroke="rgba(255,130,190,0.48)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/><line x1="19" y1="29" x2="29" y2="29" stroke="rgba(255,130,190,0.30)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/></svg>);
const HubIconTeam = (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><circle cx="16" cy="18" r="7" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.60)" strokeWidth="1.6"/><circle cx="32" cy="18" r="7" fill="rgba(20,184,166,0.09)" stroke="rgba(20,184,166,0.45)" strokeWidth="1.6"/><path d="M4 38 Q4 28 16 28 Q24 28 24 28 Q24 28 32 28 Q44 28 44 38" stroke="rgba(94,234,212,0.75)" strokeWidth="1.7" fill="none" strokeLinecap="round"/></svg>);
const HubIconScore= (<svg width={30} height={30} viewBox="0 0 48 48" fill="none"><path d="M24 4 L29 17 H43 L32 26 L36 40 L24 32 L12 40 L16 26 L5 17 H19 Z" fill="rgba(234,179,8,0.15)" stroke="rgba(234,179,8,0.75)" strokeWidth="1.6" strokeLinejoin="round"/><path d="M24 11 L27.5 20 H37 L29 26 L32 36 L24 30.5 L16 36 L19 26 L11 20 H20.5 Z" fill="rgba(234,179,8,0.28)"/></svg>);

const HUB_TILES = (onNew, onDashboard, onOverview, onOpenReqs, onAnalyse, onRevised, onTeam, onScore) => [
  { id:'dash',  label:'Estimator Dashboard', sub:'Live queue · assignments · TAT',    gridColumn:'1',          gridRow:'1 / span 2', icon:HubIconDash,  onClick:onDashboard, tag:'LIVE',    shine:hubShine('80','160','255')  },
  { id:'new',   label:'New Request',          sub:'Submit a quotation request',        gridColumn:'2',          gridRow:'1',          icon:HubIconNew,   onClick:onNew,       tag:'CREATE',  shine:hubShine('168','85','247')  },
  { id:'open',  label:'Open Requests',        sub:'Pending · unassigned queue',        gridColumn:'3',          gridRow:'1',          icon:HubIconOpen,  onClick:onOpenReqs,  tag:'QUEUE',   shine:hubShine('52','211','153')  },
  { id:'ov',    label:'Request Overview',     sub:'Browse all active requests',        gridColumn:'2 / span 2', gridRow:'2',          icon:HubIconOv,    onClick:onOverview,  tag:'ALL',     shine:hubShine('251','191','36')  },
  { id:'kpi',   label:'Analytics & KPI',      sub:'Performance · margins · trends',    gridColumn:'1',          gridRow:'3',          icon:HubIconKPI,   onClick:onAnalyse,   tag:'METRICS', shine:hubShine('249','115','22')  },
  { id:'team',  label:'Estimation Team',      sub:'Team members · workload · status',  gridColumn:'2',          gridRow:'3',          icon:HubIconTeam,  onClick:onTeam,      tag:'TEAM',    shine:hubShine('20','184','166')  },
  { id:'rev',   label:'Revise Quotation',       sub:'Revision · final price submission', gridColumn:'3',          gridRow:'3',          icon:HubIconRev,   onClick:onRevised,   tag:'REVISE',  shine:hubShine('236','72','153')  },
  { id:'score', label:'My Score Card',        sub:'My KPIs · win rate · efficiency',   gridColumn:'1 / span 3', gridRow:'4',          icon:HubIconScore, onClick:onScore,     tag:'MY KPIs', shine:hubShine('234','179','8')   },
];

const EstimatorHub = ({ onNew, onDashboard, onOverview, onOpenReqs, onAnalyse, onRevised, q, setQ, onGo }) => {
  const F = "'Inter',sans-serif";
  const [hov, setHov] = useState(null);
  // Team and Score currently route to analyse/overview as placeholders
  const tiles = HUB_TILES(onNew, onDashboard, onOverview, onOpenReqs, onAnalyse, onRevised, onDashboard, onAnalyse);

  return (
    <div style={{ position:'fixed', inset:0, fontFamily:F, overflow:'hidden', zIndex:600 }}>
      {/* Dark neutral background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#0c0c0e 0%,#101013 50%,#090909 100%)' }}/>
      {/* Faint ambient colour pools matching tile palette */}
      <div style={{ position:'absolute', top:'5%',   left:'10%',  width:480, height:480, background:'radial-gradient(circle,rgba(80,160,255,0.04) 0%,transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'12%',right:'8%', width:380, height:380, background:'radial-gradient(circle,rgba(234,179,8,0.04) 0%,transparent 65%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:'55%',  left:'38%',  width:320, height:320, background:'radial-gradient(circle,rgba(236,72,153,0.03) 0%,transparent 65%)', pointerEvents:'none' }}/>

      {/* Header */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:2, padding:'16px 34px 0', display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:3, height:32, borderRadius:2, background:'linear-gradient(180deg,rgba(255,255,255,0.55) 0%,transparent 100%)', flexShrink:0 }}/>
        <div>
          <div style={{ fontSize:'0.37rem', letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.26)', fontWeight:700, marginBottom:3 }}>NAFFCO · AI ESTIMATION SYSTEM</div>
          <div style={{ fontSize:'1.50rem', fontWeight:900, letterSpacing:'-0.02em', lineHeight:1, color:'rgba(255,255,255,0.88)' }}>AI APEX HUB</div>
        </div>
        <div style={{ marginLeft:'auto', fontSize:'0.52rem', color:'rgba(255,255,255,0.13)', letterSpacing:'0.10em', textTransform:'uppercase' }}>Estimator Portal</div>
      </div>

      {/* 8-tile mosaic — 3 cols, 4 rows */}
      <div style={{
        position:'absolute', top:72, left:0, right:0, bottom:58,
        display:'grid',
        gridTemplateColumns:'minmax(0,1.7fr) minmax(0,1fr) minmax(0,1fr)',
        gridTemplateRows:'1fr 0.58fr 0.58fr 0.40fr',
        gap:9, padding:'8px 32px 6px', boxSizing:'border-box', zIndex:2,
      }}>
        {tiles.map(tile => <HubTile key={tile.id} tile={tile} hov={hov} setHov={setHov}/>)}
      </div>

      {/* Search bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:2, padding:'0 34px 12px', display:'flex', gap:10, alignItems:'center' }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:50, padding:'8px 18px', backdropFilter:'blur(20px)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onGo()}
            placeholder="Search request by name, project or number…"
            style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'rgba(255,255,255,0.65)', fontFamily:F, fontSize:'0.79rem' }}/>
        </div>
        <button onClick={onGo}
          style={{ padding:'8px 20px', borderRadius:50, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.16)', color:'rgba(255,255,255,0.82)', fontFamily:F, fontSize:'0.77rem', fontWeight:700, cursor:'pointer', outline:'none', backdropFilter:'blur(16px)', transition:'background .15s', whiteSpace:'nowrap' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.14)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}>Search</button>
      </div>
    </div>
  );
};

// ─── VIEWS ──────────────────────────────────────────────────────────────────────────────
const Landing = ({onNew,onRevised,onFinalPrice,onDashboard,onOverview,onOpenReqs,onAnalyse,q,setQ,onGo,onDirectTool,userRole}) => {
  const isSales = userRole === 'sales';
  if (userRole === 'estimator') {
    return <EstimatorHub onNew={onNew} onDashboard={onDashboard} onOverview={onOverview} onOpenReqs={onOpenReqs} onAnalyse={onAnalyse} onRevised={onRevised} q={q} setQ={setQ} onGo={onGo}/>;
  }
  return (
    <div className="land" style={{position:'relative'}}>
      <TopSB v={q} set={setQ} go={onGo}/>
      <div className="left-col">
        <div style={{display:'flex', flexDirection:'column'}}>
          <p className="brand">NAFFCO · AI SYSTEM</p>
          <h1 className="page-title">{isSales ? <>SALES &amp;<br/>MARKETING</> : <>AI APEX<br/>HUB</>}</h1>
          {!isSales && (
            <p className="page-sub">Intelligent quotation generation powered<br/>by advanced AI analysis.</p>
          )}
          {isSales && (
            <p style={{fontSize:'0.56rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:700,marginBottom:10,marginTop:4}}>Quick Links</p>
          )}
          <div className="land-btns">
            {[
              {label:'Request a New Quote', onClick:onNew},
              {label:'Revise Quotation',          onClick:onRevised},
              {label:'Final Price Request',       onClick:onFinalPrice},
            ].map(({label,onClick})=>(
              <button key={label} onClick={onClick}
                style={{flex:1,position:'relative',background:'linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%)',backgroundSize:'220% 220%',animation:'auroraShift 5s ease-in-out infinite',border:'1px solid rgba(255,255,255,0.22)',borderRadius:'100px',padding:'10px 20px',cursor:'pointer',color:'#fff',fontSize:'0.75rem',fontWeight:600,fontFamily:"'Inter',sans-serif",letterSpacing:'0.07em',whiteSpace:'nowrap',textAlign:'center',boxShadow:'0 8px 36px rgba(109,40,217,0.5), 0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',transition:'transform 0.15s, box-shadow 0.15s',overflow:'hidden'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(109,40,217,0.65), 0 4px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.20)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 36px rgba(109,40,217,0.5), 0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)';}}>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.03) 55%,transparent 100%)',borderRadius:'100px',pointerEvents:'none'}}/>
                <span className="btn-text-glow">{label}</span>
              </button>
            ))}
          </div>
          <p className="s-lbl">Search for Requested Quote</p>
          <div className="s-bar">
            <span className="ico"><Search size={15} color="rgba(255,255,255,0.5)"/></span>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onGo()} placeholder="Name, project or request #..."/>
            <button className="sent" onClick={onGo} style={{padding:'12px 16px',display:'flex',alignItems:'center'}}><Search size={14} color="rgba(255,255,255,0.6)"/></button>
          </div>
        </div>
      </div>
      <div className="right-col" style={{position:'relative', background:'transparent'}}>
        {/* ── Aurora glow — tightly behind bot body only, avoids edges/corners ── */}
        {/* outer rainbow halo */}
        <div style={{
          position:'absolute',
          top:'-10%', left:'0%', right:'0%', bottom:'-5%',
          zIndex:0,
          background:'conic-gradient(from 0deg at 50% 50%, #ff0000, #ff7700, #ffff00, #00ff88, #00cfff, #6d28d9, #a855f7, #ec4899, #ff0000)',
          backgroundSize:'300% 300%',
          animation:'auroraShift 6s ease-in-out infinite',
          filter:'blur(55px)',
          opacity:0.60,
          WebkitMaskImage:'radial-gradient(ellipse 85% 90% at 50% 50%, black 5%, rgba(0,0,0,0.50) 50%, transparent 78%)',
          maskImage:'radial-gradient(ellipse 85% 90% at 50% 50%, black 5%, rgba(0,0,0,0.50) 50%, transparent 78%)',
        }}/>
        {/* mid rainbow layer — offset angle */}
        <div style={{
          position:'absolute',
          top:'-2%', left:'8%', right:'8%', bottom:'0%',
          zIndex:0,
          background:'linear-gradient(120deg,#ff0000 0%,#ff6600 12%,#ffcc00 24%,#00ff88 36%,#00bfff 48%,#3b82f6 58%,#8b5cf6 68%,#ec4899 80%,#ff3366 90%,#ff0000 100%)',
          backgroundSize:'300% 300%',
          animation:'auroraShift 4s ease-in-out infinite reverse',
          filter:'blur(30px)',
          opacity:0.70,
          WebkitMaskImage:'radial-gradient(ellipse 72% 80% at 50% 44%, black 10%, rgba(0,0,0,0.55) 52%, transparent 78%)',
          maskImage:'radial-gradient(ellipse 72% 80% at 50% 44%, black 10%, rgba(0,0,0,0.55) 52%, transparent 78%)',
        }}/>
        {/* inner bright core */}
        <div style={{
          position:'absolute',
          top:'8%', left:'20%', right:'18%', bottom:'2%',
          zIndex:0,
          background:'linear-gradient(160deg,#ff4444 0%,#ff9900 20%,#ffee00 35%,#a855f7 55%,#ec4899 72%,#ff6600 88%,#ff0000 100%)',
          backgroundSize:'250% 250%',
          animation:'auroraShift 3.5s ease-in-out infinite',
          filter:'blur(16px)',
          opacity:0.80,
          WebkitMaskImage:'radial-gradient(ellipse 55% 68% at 50% 42%, black 18%, rgba(0,0,0,0.45) 55%, transparent 78%)',
          maskImage:'radial-gradient(ellipse 55% 68% at 50% 42%, black 18%, rgba(0,0,0,0.45) 55%, transparent 78%)',
        }}/>
        <img src="/AIBOT.png" alt="AI Bot" className="land-aibot" style={{position:'fixed',inset:0,zIndex:1,width:'100vw',height:'100vh',objectFit:'cover',objectPosition:'center top',display:'block',pointerEvents:'none'}}/>
      </div>
    </div>
  );
};

// ─── FILE HELPERS ─────────────────────────────────────────────────────────────
const readFileAsDoc = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve({
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    name: file.name,
    type: file.type,
    data: reader.result,
  });
  reader.onerror = reject;
  reader.readAsDataURL(file);
});
const readFilesToDocs = (files) => Promise.all(files.map(readFileAsDoc));

// ─── INDEXED DB: persist file data across page reloads ────────────────────────
const _idbOpen = () => new Promise((res, rej) => {
  const r = indexedDB.open('alex_docs_v1', 1);
  r.onupgradeneeded = e => e.target.result.createObjectStore('files');
  r.onsuccess = e => res(e.target.result);
  r.onerror = e => rej(e.target.error);
});
const idbPut = async (key, value) => {
  const db = await _idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').put(value, key);
    tx.oncomplete = res;
    tx.onerror = e => rej(e.target.error);
  });
};
const idbGet = async (key) => {
  const db = await _idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction('files', 'readonly');
    const req = tx.objectStore('files').get(key);
    req.onsuccess = e => res(e.target.result);
    req.onerror = e => rej(e.target.error);
  });
};
// Save a single doc's data URL to IndexedDB (keyed by doc.id)
const saveDocToIDB = async (doc) => {
  if (doc?.id && doc?.data) await idbPut(doc.id, doc.data);
};
// Restore data into a doc object from IndexedDB if it's missing
const restoreDocFromIDB = async (doc) => {
  if (!doc || typeof doc !== 'object' || doc.data || !doc.id) return doc;
  const data = await idbGet(doc.id);
  return data ? { ...doc, data } : doc;
};
// Strip data URL from a doc (keep id/name/type for JSONBin)
const stripDocData = (doc) =>
  doc && typeof doc === 'object' ? { id: doc.id, name: doc.name, type: doc.type, url: doc.url || null } : doc;

const _showDocToast = (msg, isWarn = false) => {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:${isWarn?'rgba(245,158,11,0.96)':'rgba(220,50,50,0.96)'};color:#fff;padding:12px 22px;border-radius:10px;font-size:0.82rem;font-weight:600;z-index:99999;box-shadow:0 4px 24px rgba(0,0,0,0.45);pointer-events:none;max-width:460px;text-align:center;transition:opacity 0.35s ease`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 400); }, 4500);
};

const downloadDoc = async (d) => {
  if (!d) return;

  // Remote URL (SharePoint, R2, or legacy Azure) — fetch as blob for Save dialog
  if (d.url) {
    try {
      const fetchUrl = `${d.url}${d.url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const res = await fetch(fetchUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = d.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    } catch (err) {
      console.error('❌ Download failed:', err);
      window.open(d.url, '_blank');
    }
    return;
  }

  // Base64 data URL — convert to Blob so browser saves correct binary
  if (d.data) {
    try {
      const [header, b64] = d.data.split(',');
      const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = d.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    } catch (err) {
      console.error('Download failed:', err);
    }
    return;
  }

  if (d.id || d.name) {
    _showDocToast(`"${d.name || 'File'}" needs re-upload — no storage URL found.`, true);
  }
};

const docName = (d) => (d && typeof d === 'object' ? d.name : d) || '—';
// ──────────────────────────────────────────────────────────────────────────────

// ── Upload pipeline: Browser → apex-bridge → SharePoint ──────────────────────
const uploadToSharePoint = async (file, folder, customFileName) => {
  try {
    const url = await uploadFile(file, folder || '', customFileName || '');
    return url;
  } catch (err) {
    console.error('❌ uploadFile failed:', err);
    return null;
  }
};

// Azure constants kept for JSON data-blob sync (apex-data.json) — NOT used for file uploads
const AZURE_ACCOUNT   = "apexfilestorage2";
const AZURE_CONTAINER = "estimation-docs";
const AZURE_SAS       = "sv=2025-11-05&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-30T13:08:36Z&st=2026-04-19T20:00:00Z&spr=https&sig=GMAKHd37xTTyBo5eeCg%2BQjzdT37ga%2FtmBDGWHjzfZTc%3D";

// Verify a SharePoint URL is reachable
const verifyFileUrl = async (url) => {
  if (!url) return false;
  try {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
    });
    return res.ok;
  } catch { return false; }
};

const deleteSharePointFile = (url) => deleteFile(url);

// ------------------------------------------------------------------------------

const Form = ({onSubmit, onBack, docUploadProgress}) => {
  const [f,setF] = useState({submittedBy:'',salesPerson:'',proj:'',mainContractor:'',consultant:'',client:'',email:'',mob:'',tel:'',leadTime:'',address:'',remarks:'',supplyOnly:false,supplyInstall:false,customerRank:0});
  const [deal,setDeal] = useState('Job In Hand');
  const [files,setFiles] = useState([]);
  const [drag,setDrag] = useState(false);
  const [errors,setErrors] = useState({});
  const [submitting,setSubmitting] = useState(false);
  const ref = useRef();
  const u = k => e => { setF(p=>({...p,[k]:e.target.value})); setErrors(p=>({...p,[k]:false})); };
  const drop = e => { e.preventDefault(); setDrag(false); if(e.dataTransfer.files?.length){ setFiles(p=>[...p,...Array.from(e.dataTransfer.files)]); setErrors(p=>({...p,files:false})); } };

  const handleSubmit = async () => {
    const errs = {};
    if (!f.submittedBy) errs.submittedBy = true;
    if (!f.salesPerson) errs.salesPerson = true;
    if (!f.proj.trim()) errs.proj = true;
    if (!f.mainContractor.trim()) errs.mainContractor = true;
    if (!f.consultant.trim()) errs.consultant = true;
    if (!f.client.trim()) errs.client = true;
    if (!f.email.trim()) errs.email = true;
    if (!f.mob.trim()) errs.mob = true;
    if (!f.tel.trim()) errs.tel = true;
    if (!f.leadTime) errs.leadTime = true;
    if (!f.customerRank) errs.customerRank = true;
    if (!f.supplyOnly && !f.supplyInstall) errs.supply = true;
    if (!f.address.trim()) errs.address = true;
    if (!f.remarks.trim()) errs.remarks = true;
    if (files.length === 0) errs.files = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    await onSubmit({...f,deal,docs:files.map(x=>x.name),docFiles:files});
  };

  const errBorder = key => errors[key] ? '1.5px solid rgba(255,80,80,0.85)' : undefined;

  return (
    <div className="form-page">

      {/* ── LEFT — AIBOT2 image panel ── */}
      <div className="form-left">
        <button onClick={onBack}
          style={{alignSelf:'flex-start',background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.22)',cursor:'pointer',color:'rgba(255,255,255,0.85)',fontFamily:"'Inter',sans-serif",fontSize:'0.78rem',padding:'6px 14px',borderRadius:50,display:'flex',alignItems:'center',gap:6,marginBottom:18,backdropFilter:'blur(8px)',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.20)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.10)';e.currentTarget.style.color='rgba(255,255,255,0.85)';}}>
          ← Back
        </button>
        <h2>Let's<br/>Quote a Best Offer</h2>
        <p className="sub">Upload your documents below</p>

        {/* Upload zone — fills remaining height */}
        <div style={{marginTop:14,flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
          <div
            className={`upload-glass${drag?' drag':''}`}
            onClick={()=>ref.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={drop}
            style={errors.files?{border:'1.5px solid rgba(255,80,80,0.85)',boxShadow:'0 0 0 3px rgba(255,80,80,0.12)'}:{}}
          >
            <input type="file" multiple ref={ref} style={{display:'none'}}
              onChange={e=>{if(e.target.files?.length){setFiles(p=>[...p,...Array.from(e.target.files)]);setErrors(p=>({...p,files:false}));}}}/>
            {files.length===0 ? (
              <>
                <FileText size={46} className="u-icon" color={errors.files?"rgba(255,100,100,0.7)":"rgba(255,255,255,0.35)"}/>
                <p className="u-text" style={{marginTop:8,color:errors.files?'rgba(255,120,120,0.9)':undefined}}>
                  {errors.files ? '⚠ At least one file is required' : <>Drag & drop files, or <b>click to browse</b></>}
                </p>
              </>
            ) : (
              <div style={{width:'100%',display:'flex',flexDirection:'column',gap:6}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                  <span style={{fontSize:'0.73rem',color:'rgba(255,255,255,0.7)',fontWeight:600}}>{files.length} FILE{files.length>1?'S':''}</span>
                  <span onClick={e=>{e.stopPropagation();ref.current.click();}} style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.4)',cursor:'pointer'}}>+ Add More</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:5,maxHeight:files.length>5?200:'none',overflowY:files.length>5?'auto':'visible',paddingRight:files.length>5?4:0}}>
                  {files.map((file, i) => {
                    const ps = submitting ? (docUploadProgress?.[i]?.status ?? 'pending') : null;
                    return (
                      <div key={i} className="file-chip-g" style={
                        ps === 'done'     ? {borderColor:'rgba(0,200,100,0.35)',background:'rgba(0,200,100,0.07)'}
                        : ps === 'error'  ? {borderColor:'rgba(255,80,80,0.30)',background:'rgba(255,60,60,0.06)'}
                        : ps === 'uploading' ? {borderColor:'rgba(0,180,255,0.28)'}
                        : {}
                      }>
                        {/* Left status icon */}
                        {!submitting && <FileText size={12} color="rgba(255,255,255,0.5)"/>}
                        {ps === 'uploading' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(0,180,255,0.90)" strokeWidth="2.2" strokeLinecap="round"
                            style={{animation:'coreOrb 1s linear infinite',flexShrink:0}}>
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                          </svg>
                        )}
                        {ps === 'done' && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(0,200,255,0.80)" strokeWidth="1.8" style={{flexShrink:0}}>
                            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
                          </svg>
                        )}
                        {ps === 'pending' && <div style={{width:7,height:7,borderRadius:'50%',background:'rgba(255,255,255,0.20)',flexShrink:0}}/>}
                        {ps === 'error' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(255,80,80,0.85)" strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0}}>
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        )}
                        <span style={{
                          flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.72rem',
                          color: ps === 'done' ? 'rgba(0,220,130,0.90)'
                            : ps === 'error' ? 'rgba(255,120,120,0.85)'
                            : ps === 'uploading' ? 'rgba(0,200,255,0.80)'
                            : 'inherit',
                        }}>{file.name}</span>
                        {!submitting && (
                          <button onClick={e=>{e.stopPropagation();setFiles(p=>p.filter((_,j)=>j!==i));}}
                            style={{background:'transparent',border:'none',cursor:'pointer',padding:2,display:'flex'}}>
                            <X size={11} color="rgba(255,80,80,0.8)"/>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT — form fields ── */}
      <div className="form-right" style={{gap:5}}>

        {/* Header — NAFFCO label + title + Customer Rank top-right */}
        <div className="form-right-hdr" style={{marginBottom:4,paddingBottom:10,flexShrink:0}}>
          <div className="form-right-hdr-text">
            <span className="fr-label"><span className="brand-text-glow">NAFFCO · AI ESTIMATION</span></span>
            <h3>Request Information</h3>
            <p>Fill in the details below — our AI will analyze and generate the best quotation for your project.</p>
          </div>
          {/* Customer Rank stars — top right */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:3,flexShrink:0}}>
            <span style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:errors.customerRank?'rgba(255,100,100,0.85)':'rgba(255,255,255,0.22)',fontWeight:600}}>Customer Rank *</span>
            <div style={{display:'flex',gap:4,border:errors.customerRank?'1.5px solid rgba(255,80,80,0.75)':'1.5px solid transparent',borderRadius:6,padding:'2px 4px'}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} type="button" onClick={()=>{setF(p=>({...p,customerRank:n}));setErrors(p=>({...p,customerRank:false}));}}
                  style={{background:'none',border:'none',cursor:'pointer',padding:0,fontSize:'1rem',lineHeight:1,
                    color:f.customerRank>=n?'rgba(255,200,0,0.95)':'rgba(255,255,255,0.15)',
                    transition:'color 0.15s',
                    filter:f.customerRank>=n?'drop-shadow(0 0 4px rgba(255,200,0,0.55))':'none'}}>★</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Single-column fields ── */}
        <div className="two-col-row">
          <select className="glass-input" value={f.submittedBy} onChange={u('submittedBy')} style={{cursor:'pointer',border:errBorder('submittedBy')}}>
            <option value="">— Select Requestor * —</option>
            <optgroup label="Sales">
              {['SX985','SX417','SE628','SE842','SE519','SM386','SE421'].map(c=>(
                <option key={c} value={STAFF_NAMES[c]}>{STAFF_NAMES[c]}</option>
              ))}
            </optgroup>
            <optgroup label="Estimators">
              {['EX552','EX719','EX638','EX904','EX471','EX856','EX392','EX681','EX547','EX903','EX764'].map(c=>(
                <option key={c} value={STAFF_NAMES[c]}>{STAFF_NAMES[c]}</option>
              ))}
            </optgroup>
          </select>
          <select className="glass-input" value={f.salesPerson} onChange={u('salesPerson')} style={{cursor:'pointer',border:errBorder('salesPerson')}}>
            <option value="">— Select Sales Person * —</option>
            {['SX985','SX417','SE628','SE842','SE519','SM386','SE421'].map(c=>(
              <option key={c} value={STAFF_NAMES[c]}>{STAFF_NAMES[c]}</option>
            ))}
          </select>
        </div>
        <input className="glass-input" placeholder="Project *" value={f.proj} onChange={u('proj')} style={{border:errBorder('proj')}}/>
        <input className="glass-input" placeholder="Main Contractor *" value={f.mainContractor} onChange={u('mainContractor')} style={{border:errBorder('mainContractor')}}/>
        <input className="glass-input" placeholder="Consultant *" value={f.consultant} onChange={u('consultant')} style={{border:errBorder('consultant')}}/>
        <input className="glass-input" placeholder="Client / Grantor *" value={f.client} onChange={u('client')} style={{border:errBorder('client')}}/>

        {/* Email + MOB + Tel — 3 columns */}
        <div className="three-col-row">
          <input className="glass-input" placeholder="Email ID *" type="email" value={f.email} onChange={u('email')} style={{border:errBorder('email')}}/>
          <input className="glass-input" placeholder="MOB *" value={f.mob} onChange={u('mob')} style={{border:errBorder('mob')}}/>
          <input className="glass-input" placeholder="Tel *" value={f.tel} onChange={u('tel')} style={{border:errBorder('tel')}}/>
        </div>

        {/* Type + Lead Time + Supply checkboxes */}
        <div className="type-lead-row">
          <div className="type-row">
            <span className="type-lbl">Type :</span>
            <div className="glow-toggle">
              <div className={`glow-pill ${deal==='Job In Hand'?'jih':'tender'}`}/>
              <button className={deal==='Job In Hand'?'sel':''} onClick={()=>setDeal('Job In Hand')}>Job in hand</button>
              <button className={deal==='Tender'?'sel':''} onClick={()=>setDeal('Tender')}>Tender</button>
            </div>
          </div>
          <div className="date-field-wrap glass-input" style={{border:errBorder('leadTime')}}>
            <span className="date-field-lbl" style={{color:errors.leadTime?'rgba(255,100,100,0.85)':undefined}}>Deliver Lead Time *</span>
            <input type="month" className="date-inner" value={f.leadTime} onChange={u('leadTime')} style={{colorScheme:'dark'}}/>
          </div>
          <div className="check-row" style={{border:errors.supply?'1.5px solid rgba(255,80,80,0.85)':'1.5px solid transparent',borderRadius:8,padding:'2px 6px'}}>
            <label className="glass-check">
              <input type="checkbox" checked={f.supplyOnly} onChange={e=>{setF(p=>({...p,supplyOnly:e.target.checked,supplyInstall:e.target.checked?false:p.supplyInstall}));setErrors(p=>({...p,supply:false}));}}/>
              <span className="check-box"/>
              <span style={{color:errors.supply?'rgba(255,120,120,0.9)':undefined}}>Supply Only *</span>
            </label>
            <label className="glass-check">
              <input type="checkbox" checked={f.supplyInstall} onChange={e=>{setF(p=>({...p,supplyInstall:e.target.checked,supplyOnly:e.target.checked?false:p.supplyOnly}));setErrors(p=>({...p,supply:false}));}}/>
              <span className="check-box"/>
              <span style={{color:errors.supply?'rgba(255,120,120,0.9)':undefined}}>Supply &amp; Install *</span>
            </label>
          </div>
        </div>

        <input className="glass-input" placeholder="Address *" value={f.address} onChange={u('address')} style={{border:errBorder('address')}}/>
        <textarea className="glass-textarea remarks-box" placeholder="Remarks *" value={f.remarks} onChange={u('remarks')} style={{border:errBorder('remarks')}}/>

        {Object.values(errors).some(Boolean) && (
          <div style={{fontSize:'0.72rem',color:'rgba(255,100,100,0.85)',fontFamily:"'Inter',sans-serif",marginBottom:2,display:'flex',alignItems:'center',gap:5}}>
            <span>⚠</span>
            <span>Please fill in all required fields and upload at least one file.</span>
          </div>
        )}

        <button className="submit-glass" style={{flexShrink:0,opacity:submitting?0.6:1,cursor:submitting?'not-allowed':'pointer'}} onClick={handleSubmit} disabled={submitting}>
          <span className="btn-text-glow">Submit Request &nbsp;↗</span>
        </button>
      </div>

    </div>
  );
};

// ─── REVISED REQUEST — SEARCH SCREEN ─────────────────────────────────────────
const RevisedSearch = ({requests, onSelect, onBack, userRole='', userCode=''}) => {
  const [q, setQ] = useState('');
  const F2 = "'Inter',sans-serif";
  const isSales = userRole === 'sales';
  const salesName = isSales ? (STAFF_NAMES[userCode?.toUpperCase()] || '') : '';

  const allApproved = requests.filter(r => r.directorAction === 'approved' || r.reqStatus === 'completed');

  const baseList = isSales
    ? allApproved.filter(r =>
        salesName && (
          (r.salesPerson||'').toLowerCase() === salesName.toLowerCase() ||
          (r.submittedBy||'').toLowerCase() === salesName.toLowerCase()
        )
      )
    : allApproved;

  const filtered = q.trim()
    ? baseList.filter(r => {
        const lo = q.trim().toLowerCase();
        return r.id.toLowerCase().includes(lo) ||
          (r.proj||'').toLowerCase().includes(lo) ||
          (r.client||'').toLowerCase().includes(lo) ||
          (r.submittedBy||'').toLowerCase().includes(lo);
      })
    : baseList;

  const ReqRow = ({r, accent='rgba(0,180,255,0.07)', bd='rgba(0,180,255,0.25)'}) => {
    const pal = r.estimator ? avatarPalette(r.estimator) : null;
    const initials = r.estimator ? r.estimator.trim().split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,2) : '';
    const avatarUrl = AVATAR_URLS[EST_ROSTER.find(e=>e.name===r.estimator)?.code];
    return (
      <button key={r.id} onClick={()=>onSelect(r)}
        style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'14px 20px',cursor:'pointer',textAlign:'left',fontFamily:F2,display:'flex',alignItems:'center',gap:16,transition:'background 0.2s,border-color 0.2s',width:'100%'}}
        onMouseEnter={e=>{e.currentTarget.style.background=accent;e.currentTarget.style.borderColor=bd;}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.09)';}}>
        <span style={{fontFamily:'monospace',fontSize:'0.82rem',fontWeight:700,color:'rgba(220,165,0,0.90)',flexShrink:0,minWidth:72}}>{r.id}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:'0.86rem',fontWeight:600,color:'rgba(255,255,255,0.82)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</div>
          <div style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.38)',marginTop:3}}>{r.client||''}{r.client&&r.submittedBy?' · ':''}{r.submittedBy||''}</div>
        </div>
        {/* Estimator avatar + name */}
        {r.estimator ? (
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            {avatarUrl
              ? <img src={avatarUrl} alt={r.estimator} style={{width:30,height:30,borderRadius:'50%',objectFit:'cover',border:`1.5px solid ${pal?.border||'rgba(255,255,255,0.20)'}`}}/>
              : <div style={{width:30,height:30,borderRadius:'50%',background:pal?.bg||'rgba(100,180,255,0.14)',border:`1.5px solid ${pal?.border||'rgba(100,180,255,0.35)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.58rem',fontWeight:800,color:'#fff',flexShrink:0}}>{initials}</div>
            }
            <div style={{display:'flex',flexDirection:'column'}}>
              <span style={{fontSize:'0.48rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:700,lineHeight:1}}>Estimator</span>
              <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.70)',fontWeight:600,lineHeight:1.3,maxWidth:110,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.estimator}</span>
            </div>
          </div>
        ) : (
          <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
            <div style={{width:30,height:30,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1.5px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.58rem',color:'rgba(255,255,255,0.25)'}}>—</div>
            <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.25)'}}>Unassigned</span>
          </div>
        )}
        <span style={{fontSize:'0.68rem',padding:'4px 10px',borderRadius:50,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.42)',flexShrink:0}}>{r.status}</span>
        <span style={{fontSize:'0.82rem',color:'rgba(0,200,255,0.55)',flexShrink:0}}>→</span>
      </button>
    );
  };

  return (
    <div style={{position:'relative',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'80px 60px 40px',overflowY:'auto',fontFamily:F2}}>
      <button onClick={onBack}
        style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.16)',color:'rgba(255,255,255,0.80)',cursor:'pointer',fontSize:'0.80rem',fontFamily:F2,marginBottom:28,alignSelf:'flex-start',display:'flex',alignItems:'center',gap:7,padding:'7px 16px',borderRadius:50,backdropFilter:'blur(8px)',transition:'all 0.2s'}}
        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,0.32)';}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(255,255,255,0.80)';e.currentTarget.style.borderColor='rgba(255,255,255,0.16)';}}>
        ← Back
      </button>

      <div style={{marginBottom:32}}>
        <p style={{fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,200,255,0.55)',marginBottom:8,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <h2 style={{fontSize:'clamp(1.6rem,2.4vw,2.2rem)',fontWeight:800,background:'linear-gradient(135deg,#fff 0%,rgba(200,220,255,0.85) 50%,#fff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8}}>
          Revise Quotation
        </h2>
        <p style={{fontSize:'0.84rem',color:'rgba(255,255,255,0.45)',lineHeight:1.6,maxWidth:480}}>
          {isSales
            ? `Showing your submissions${salesName ? ` for ${salesName}` : ''}. Search to narrow down.`
            : 'Select the original request you want to revise. Search by ID, project or client.'}
        </p>
      </div>

      {/* Search bar */}
      <div style={{display:'flex',alignItems:'center',gap:0,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,marginBottom:24,maxWidth:520,overflow:'hidden'}}>
        <span style={{padding:'12px 14px',display:'flex',alignItems:'center'}}><Search size={15} color="rgba(255,255,255,0.4)"/></span>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Search by ID, project or client…"
          style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.85)',fontSize:'0.86rem',fontFamily:F2,padding:'12px 0'}}/>
        {q && <button onClick={()=>setQ('')} style={{background:'transparent',border:'none',cursor:'pointer',padding:'0 14px',display:'flex',alignItems:'center',opacity:0.45}}><X size={13} color="#fff"/></button>}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{color:'rgba(255,255,255,0.28)',fontSize:'0.86rem',marginTop:20}}>
          {q.trim() ? 'No requests match your search.' : (isSales ? 'No approved submissions found for your account.' : 'No approved requests found.')}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:720}}>
          {!q.trim() && (
            <p style={{fontSize:'0.58rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:700,marginBottom:4}}>Approved Requests — {filtered.length}</p>
          )}
          {filtered.map(r => <ReqRow key={r.id} r={r}/>)}
        </div>
      )}
    </div>
  );
};

// ─── REVISED REQUEST — FORM SCREEN ────────────────────────────────────────────
const RevisedForm = ({original, onSubmit, onBack}) => {
  const [newFiles, setNewFiles] = useState([]);
  const [revRemarks, setRevRemarks] = useState('');
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const F2 = "'Inter',sans-serif";

  const drop = e => { e.preventDefault(); setDrag(false); if(e.dataTransfer.files?.length) setNewFiles(p=>[...p,...Array.from(e.dataTransfer.files)]); };

  const infoRows = [
    ['Request ID', original.id],
    ['Project', original.proj||'—'],
    ['Client / Grantor', original.client||'—'],
    ['Main Contractor', original.mainContractor||'—'],
    ['Consultant', original.consultant||'—'],
    ['Deal Type', original.deal||'—'],
    ['Lead Time', original.leadTime||'—'],
    ['Address', original.address||'—'],
    ['Supply', original.supplyOnly?'Supply Only':original.supplyInstall?'Supply & Install':'—'],
  ];

  return (
    <div className="form-page">

      {/* ── LEFT — reference panel ── */}
      <div className="form-left" style={{display:'flex',flexDirection:'column',padding:'36px 28px'}}>
        <button onClick={onBack}
          style={{alignSelf:'flex-start',background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.22)',cursor:'pointer',color:'rgba(255,255,255,0.88)',fontFamily:F2,fontSize:'0.78rem',padding:'6px 14px',borderRadius:50,display:'flex',alignItems:'center',gap:6,marginBottom:20,backdropFilter:'blur(8px)',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.10)';e.currentTarget.style.color='rgba(255,255,255,0.88)';}}>
          ← Back
        </button>

        {/* REVISED badge */}
        <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 12px',borderRadius:50,background:'rgba(0,150,255,0.12)',border:'1px solid rgba(0,180,255,0.30)',marginBottom:14,alignSelf:'flex-start'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'rgba(0,200,255,0.9)',boxShadow:'0 0 6px rgba(0,200,255,0.7)',flexShrink:0}}/>
          <span style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',color:'rgba(0,200,255,0.90)',textTransform:'uppercase'}}>Revise Quotation</span>
        </div>

        <h2 style={{fontSize:'clamp(1.2rem,2vw,1.7rem)',fontWeight:800,color:'rgba(255,255,255,0.88)',marginBottom:4,lineHeight:1.3}}>Original<br/>Request Details</h2>
        <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.38)',marginBottom:16,lineHeight:1.5}}>Reference — read only</p>

        {/* Original info rows */}
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:0,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'12px 14px'}}>
          {infoRows.map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'6px 0',gap:8}}>
              <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.60)',flexShrink:0,fontWeight:500}}>{k}</span>
              <span style={{fontSize:'0.73rem',color:'rgba(255,255,255,0.88)',textAlign:'right'}}>{v}</span>
            </div>
          ))}
          {original.remarks && (
            <div style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.28)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.10em'}}>Original Remarks</div>
              <div style={{fontSize:'0.75rem',color:'rgba(255,200,100,0.75)',lineHeight:1.5}}>{original.remarks}</div>
            </div>
          )}
          {/* Original docs */}
          {original.docs?.length > 0 && (
            <div style={{paddingTop:10}}>
              <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.28)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.10em'}}>Original Documents ({original.docs.length})</div>
              {original.docs.map((d,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0'}}>
                  <FileText size={11} color="rgba(99,160,240,0.7)"/>
                  <span onClick={()=>downloadDoc(d)} style={{fontSize:'0.72rem',color:'rgba(99,160,240,0.78)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer'}}>{docName(d)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT — revision input panel ── */}
      <div className="form-right">
        <div className="form-right-hdr">
          <span className="fr-label"><span className="brand-text-glow">NAFFCO APEX · Revise Quotation</span></span>
          <h3>Submit Revision</h3>
          <p>Add updated documents and describe your revision below. The estimator will receive the original reference along with your new submission.</p>
        </div>

        {/* Read-only project fields */}
        <input className="glass-input" value={original.proj||''} readOnly placeholder="Project" style={{opacity:0.55,cursor:'default'}}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <input className="glass-input" value={original.client||''} readOnly placeholder="Client / Grantor" style={{opacity:0.55,cursor:'default'}}/>
          <input className="glass-input" value={original.submittedBy||''} readOnly placeholder="Submitted By" style={{opacity:0.55,cursor:'default'}}/>
        </div>

        {/* Revised By — editable */}
        <input className="glass-input" placeholder="Revised By (your name)" id="revisedByInput"
          style={{border:'1px solid rgba(0,180,255,0.30)',boxShadow:'0 0 0 1px rgba(0,180,255,0.10)'}}/>

        {/* New documents upload */}
        <div style={{marginTop:4,marginBottom:4}}>
          <p style={{fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,200,255,0.55)',marginBottom:8,fontWeight:600}}>Updated / New Documents</p>
          <div
            className={`upload-glass${drag?' drag':''}`}
            onClick={()=>ref.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={drop}
            style={{minHeight:100}}
          >
            <input type="file" multiple ref={ref} style={{display:'none'}}
              onChange={e=>{if(e.target.files?.length)setNewFiles(p=>[...p,...Array.from(e.target.files)]);}}/>
            {newFiles.length===0 ? (
              <>
                <FileText size={28} className="u-icon" color="rgba(255,255,255,0.3)"/>
                <p className="u-text">Drag & drop updated files, or <b>click to browse</b></p>
              </>
            ) : (
              <div style={{width:'100%',display:'flex',flexDirection:'column',gap:6}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                  <span style={{fontSize:'0.72rem',color:'rgba(0,200,255,0.75)',fontWeight:600}}>{newFiles.length} NEW FILE{newFiles.length>1?'S':''}</span>
                  <span onClick={e=>{e.stopPropagation();ref.current.click();}} style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.4)',cursor:'pointer'}}>+ Add More</span>
                </div>
                {newFiles.map((file,i)=>(
                  <div key={i} className="file-chip-g">
                    <FileText size={13} color="rgba(0,200,255,0.6)"/>
                    <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</span>
                    <button onClick={e=>{e.stopPropagation();setNewFiles(p=>p.filter((_,j)=>j!==i));}}
                      style={{background:'transparent',border:'none',cursor:'pointer',padding:2,display:'flex'}}>
                      <X size={12} color="rgba(255,80,80,0.8)"/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Revision remarks */}
        <div>
          <p style={{fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,200,255,0.55)',marginBottom:8,fontWeight:600}}>Revision Remarks <span style={{color:'rgba(255,255,255,0.25)',textTransform:'none',letterSpacing:0,fontSize:'0.68rem',fontWeight:400}}>(what changed & why)</span></p>
          <textarea className="glass-textarea remarks-box"
            placeholder="Describe what has changed — scope update, design change, new BOQ, etc."
            value={revRemarks} onChange={e=>setRevRemarks(e.target.value)}
            style={{border:'1px solid rgba(0,180,255,0.22)',boxShadow:'0 0 0 1px rgba(0,180,255,0.08)'}}/>
        </div>

        <button className="submit-glass"
          style={{background:'linear-gradient(105deg,#0f4c75,#1b6ca8 30%,#1e90ff 55%,#00c6ff 80%,#0072ff 100%)',backgroundSize:'220% 220%'}}
          onClick={async()=>{
            const revisedBy = document.getElementById('revisedByInput')?.value?.trim() || original.submittedBy;
            onSubmit({
              // Carry over original project fields
              proj: original.proj,
              client: original.client,
              mainContractor: original.mainContractor,
              consultant: original.consultant,
              email: original.email,
              mob: original.mob,
              tel: original.tel,
              leadTime: original.leadTime,
              address: original.address,
              supplyOnly: original.supplyOnly,
              supplyInstall: original.supplyInstall,
              deal: original.deal,
              submittedBy: revisedBy,
              salesPerson: original.salesPerson,   // always inherit sales person from original
              customerRank: original.customerRank,
              numDoors: original.numDoors,
              // Revision-specific
              requestType: 'revised',
              originalId: original.id,
              originalDocs: original.docs || [],
              originalRemarks: original.remarks || '',
              originalDetails: {
                submittedBy: original.submittedBy,
                date: original.date,
              },
              docs: newFiles.map(x => x.name),
              docFiles: newFiles,
              remarks: revRemarks,
            });
          }}>
          <span className="btn-text-glow">Submit Revise Quotation &nbsp;↗</span>
        </button>
      </div>
    </div>
  );
};

// ─── FINAL PRICE REQUEST — SEARCH SCREEN ─────────────────────────────────────
const FinalPriceSearch = ({requests, onSelect, onBack, userRole='', userCode=''}) => {
  const [q, setQ] = useState('');
  const F2 = "'Inter',sans-serif";
  const isSales = userRole === 'sales';
  const salesName = isSales ? (STAFF_NAMES[userCode?.toUpperCase()] || '') : '';

  const allApproved = requests.filter(r => r.directorAction === 'approved' || r.reqStatus === 'completed');

  const baseList = isSales
    ? allApproved.filter(r =>
        salesName && (
          (r.salesPerson||'').toLowerCase() === salesName.toLowerCase() ||
          (r.submittedBy||'').toLowerCase() === salesName.toLowerCase()
        )
      )
    : allApproved;

  const filtered = q.trim()
    ? baseList.filter(r => {
        const lo = q.trim().toLowerCase();
        return r.id.toLowerCase().includes(lo) ||
          (r.proj||'').toLowerCase().includes(lo) ||
          (r.client||'').toLowerCase().includes(lo) ||
          (r.submittedBy||'').toLowerCase().includes(lo);
      })
    : baseList;

  const ReqRow = ({r}) => (
    <button key={r.id} onClick={()=>onSelect(r)}
      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'14px 20px',cursor:'pointer',textAlign:'left',fontFamily:F2,display:'flex',alignItems:'center',gap:20,transition:'background 0.2s,border-color 0.2s',width:'100%'}}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(16,185,129,0.07)';e.currentTarget.style.borderColor='rgba(52,211,153,0.28)';}}
      onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.09)';}}>
      <span style={{fontFamily:'monospace',fontSize:'0.82rem',fontWeight:700,color:'rgba(220,165,0,0.90)',flexShrink:0,minWidth:72}}>{r.id}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:'0.86rem',fontWeight:600,color:'rgba(255,255,255,0.82)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</div>
        <div style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.38)',marginTop:3}}>{r.client||''}{r.client&&r.submittedBy?' · ':''}{r.submittedBy||''}</div>
      </div>
      <span style={{fontSize:'0.68rem',padding:'4px 10px',borderRadius:50,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.42)',flexShrink:0}}>{r.status}</span>
      <span style={{fontSize:'0.82rem',color:'rgba(52,211,153,0.65)',flexShrink:0}}>→</span>
    </button>
  );

  return (
    <div style={{position:'relative',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'80px 60px 40px',overflowY:'auto',fontFamily:F2}}>
      <button onClick={onBack}
        style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.16)',color:'rgba(255,255,255,0.80)',cursor:'pointer',fontSize:'0.80rem',fontFamily:F2,marginBottom:28,alignSelf:'flex-start',display:'flex',alignItems:'center',gap:7,padding:'7px 16px',borderRadius:50,backdropFilter:'blur(8px)',transition:'all 0.2s'}}
        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,0.32)';}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(255,255,255,0.80)';e.currentTarget.style.borderColor='rgba(255,255,255,0.16)';}}>
        ← Back
      </button>

      <div style={{marginBottom:32}}>
        <p style={{fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(52,211,153,0.65)',marginBottom:8,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <h2 style={{fontSize:'clamp(1.6rem,2.4vw,2.2rem)',fontWeight:800,background:'linear-gradient(135deg,#fff 0%,rgba(167,243,208,0.85) 50%,#fff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8}}>
          Final Price Request
        </h2>
        <p style={{fontSize:'0.84rem',color:'rgba(255,255,255,0.45)',lineHeight:1.6,maxWidth:480}}>
          {isSales
            ? `Showing your submissions${salesName ? ` for ${salesName}` : ''}. Search to narrow down.`
            : 'Select the original request to submit a final price. Search by ID, project or client.'}
        </p>
      </div>

      {/* Search bar */}
      <div style={{display:'flex',alignItems:'center',gap:0,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(52,211,153,0.20)',borderRadius:10,marginBottom:24,maxWidth:520,overflow:'hidden'}}>
        <span style={{padding:'12px 14px',display:'flex',alignItems:'center'}}><Search size={15} color="rgba(52,211,153,0.50)"/></span>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Search by ID, project or client…"
          style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.85)',fontSize:'0.86rem',fontFamily:F2,padding:'12px 0'}}/>
        {q && <button onClick={()=>setQ('')} style={{background:'transparent',border:'none',cursor:'pointer',padding:'0 14px',display:'flex',alignItems:'center',opacity:0.45}}><X size={13} color="#fff"/></button>}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{color:'rgba(255,255,255,0.28)',fontSize:'0.86rem',marginTop:20}}>
          {q.trim() ? 'No requests match your search.' : (isSales ? 'No approved submissions found for your account.' : 'No approved requests found.')}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:720}}>
          {!q.trim() && (
            <p style={{fontSize:'0.58rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:700,marginBottom:4}}>Approved Requests — {filtered.length}</p>
          )}
          {filtered.map(r => <ReqRow key={r.id} r={r}/>)}
        </div>
      )}
    </div>
  );
};

// ─── FINAL PRICE REQUEST — FORM SCREEN ────────────────────────────────────────
const FinalPriceForm = ({original, onSubmit, onBack}) => {
  const [newFiles, setNewFiles] = useState([]);
  const [finalRemarks, setFinalRemarks] = useState('');
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const F2 = "'Inter',sans-serif";

  const drop = e => { e.preventDefault(); setDrag(false); if(e.dataTransfer.files?.length) setNewFiles(p=>[...p,...Array.from(e.dataTransfer.files)]); };

  const infoRows = [
    ['Request ID', original.id],
    ['Project', original.proj||'—'],
    ['Client / Grantor', original.client||'—'],
    ['Main Contractor', original.mainContractor||'—'],
    ['Consultant', original.consultant||'—'],
    ['Deal Type', original.deal||'—'],
    ['Lead Time', original.leadTime||'—'],
    ['Address', original.address||'—'],
    ['Supply', original.supplyOnly?'Supply Only':original.supplyInstall?'Supply & Install':'—'],
  ];

  return (
    <div className="form-page">

      {/* ── LEFT — reference panel ── */}
      <div className="form-left" style={{display:'flex',flexDirection:'column',padding:'36px 28px'}}>
        <button onClick={onBack}
          style={{alignSelf:'flex-start',background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.22)',cursor:'pointer',color:'rgba(255,255,255,0.88)',fontFamily:F2,fontSize:'0.78rem',padding:'6px 14px',borderRadius:50,display:'flex',alignItems:'center',gap:6,marginBottom:20,backdropFilter:'blur(8px)',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.10)';e.currentTarget.style.color='rgba(255,255,255,0.88)';}}>
          ← Back
        </button>

        {/* FINAL PRICE badge */}
        <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 12px',borderRadius:50,background:'rgba(16,185,129,0.12)',border:'1px solid rgba(52,211,153,0.32)',marginBottom:14,alignSelf:'flex-start'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'rgba(52,211,153,0.9)',boxShadow:'0 0 6px rgba(52,211,153,0.7)',flexShrink:0}}/>
          <span style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',color:'rgba(52,211,153,0.95)',textTransform:'uppercase'}}>Final Price Request</span>
        </div>

        <h2 style={{fontSize:'clamp(1.2rem,2vw,1.7rem)',fontWeight:800,color:'rgba(255,255,255,0.88)',marginBottom:4,lineHeight:1.3}}>Original<br/>Request Details</h2>
        <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.38)',marginBottom:16,lineHeight:1.5}}>Reference — read only</p>

        {/* Original info rows */}
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:0,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'12px 14px'}}>
          {infoRows.map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'6px 0',gap:8}}>
              <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.60)',flexShrink:0,fontWeight:500}}>{k}</span>
              <span style={{fontSize:'0.73rem',color:'rgba(255,255,255,0.88)',textAlign:'right'}}>{v}</span>
            </div>
          ))}
          {original.remarks && (
            <div style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.28)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.10em'}}>Original Remarks</div>
              <div style={{fontSize:'0.75rem',color:'rgba(255,200,100,0.75)',lineHeight:1.5}}>{original.remarks}</div>
            </div>
          )}
          {/* Original docs */}
          {original.docs?.length > 0 && (
            <div style={{paddingTop:10}}>
              <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.28)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.10em'}}>Original Documents ({original.docs.length})</div>
              {original.docs.map((d,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0'}}>
                  <FileText size={11} color="rgba(99,160,240,0.7)"/>
                  <span onClick={()=>downloadDoc(d)} style={{fontSize:'0.72rem',color:'rgba(99,160,240,0.78)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer'}}>{docName(d)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT — final price input panel ── */}
      <div className="form-right">
        <div className="form-right-hdr">
          <span className="fr-label"><span className="brand-text-glow">NAFFCO APEX · Final Price Request</span></span>
          <h3>Submit Final Price</h3>
          <p>Add final documents and remarks below. The estimator will receive the original reference along with your final price submission.</p>
        </div>

        {/* Read-only project fields */}
        <input className="glass-input" value={original.proj||''} readOnly placeholder="Project" style={{opacity:0.55,cursor:'default'}}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <input className="glass-input" value={original.client||''} readOnly placeholder="Client / Grantor" style={{opacity:0.55,cursor:'default'}}/>
          <input className="glass-input" value={original.submittedBy||''} readOnly placeholder="Submitted By" style={{opacity:0.55,cursor:'default'}}/>
        </div>

        {/* Submitted By — editable */}
        <input className="glass-input" placeholder="Submitted By (your name)" id="finalPriceByInput"
          style={{border:'1px solid rgba(52,211,153,0.28)',boxShadow:'0 0 0 1px rgba(52,211,153,0.08)'}}/>

        {/* New / final documents upload */}
        <div style={{marginTop:4,marginBottom:4}}>
          <p style={{fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(52,211,153,0.65)',marginBottom:8,fontWeight:600}}>Final / Updated Documents</p>
          <div
            className={`upload-glass${drag?' drag':''}`}
            onClick={()=>ref.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={drop}
            style={{minHeight:100}}
          >
            <input type="file" multiple ref={ref} style={{display:'none'}}
              onChange={e=>{if(e.target.files?.length)setNewFiles(p=>[...p,...Array.from(e.target.files)]);}}/>
            {newFiles.length===0 ? (
              <>
                <FileText size={28} className="u-icon" color="rgba(255,255,255,0.3)"/>
                <p className="u-text">Drag & drop final documents, or <b>click to browse</b></p>
              </>
            ) : (
              <div style={{width:'100%',display:'flex',flexDirection:'column',gap:6}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                  <span style={{fontSize:'0.72rem',color:'rgba(52,211,153,0.80)',fontWeight:600}}>{newFiles.length} FINAL FILE{newFiles.length>1?'S':''}</span>
                  <span onClick={e=>{e.stopPropagation();ref.current.click();}} style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.4)',cursor:'pointer'}}>+ Add More</span>
                </div>
                {newFiles.map((file,i)=>(
                  <div key={i} className="file-chip-g">
                    <FileText size={13} color="rgba(52,211,153,0.65)"/>
                    <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</span>
                    <button onClick={e=>{e.stopPropagation();setNewFiles(p=>p.filter((_,j)=>j!==i));}}
                      style={{background:'transparent',border:'none',cursor:'pointer',padding:2,display:'flex'}}>
                      <X size={12} color="rgba(255,80,80,0.8)"/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Final remarks */}
        <div>
          <p style={{fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(52,211,153,0.65)',marginBottom:8,fontWeight:600}}>Final Remarks <span style={{color:'rgba(255,255,255,0.25)',textTransform:'none',letterSpacing:0,fontSize:'0.68rem',fontWeight:400}}>(pricing notes, special conditions, etc.)</span></p>
          <textarea className="glass-textarea remarks-box"
            placeholder="Add any final pricing notes, special conditions or instructions for the estimator."
            value={finalRemarks} onChange={e=>setFinalRemarks(e.target.value)}
            style={{border:'1px solid rgba(52,211,153,0.20)',boxShadow:'0 0 0 1px rgba(52,211,153,0.06)'}}/>
        </div>

        <button className="submit-glass"
          style={{background:'linear-gradient(105deg,#064e3b,#065f46 20%,#047857 38%,#10b981 54%,#34d399 72%,#6ee7b7 88%,#a7f3d0 100%)',backgroundSize:'220% 220%'}}
          onClick={async()=>{
            const submittedBy = document.getElementById('finalPriceByInput')?.value?.trim() || original.submittedBy;
            onSubmit({
              proj: original.proj,
              client: original.client,
              mainContractor: original.mainContractor,
              consultant: original.consultant,
              email: original.email,
              mob: original.mob,
              tel: original.tel,
              leadTime: original.leadTime,
              address: original.address,
              supplyOnly: original.supplyOnly,
              supplyInstall: original.supplyInstall,
              deal: original.deal,
              submittedBy,
              // Final price-specific
              requestType: 'finalPrice',
              originalId: original.id,
              originalDocs: original.docs || [],
              originalRemarks: original.remarks || '',
              originalDetails: {
                submittedBy: original.submittedBy,
                date: original.date,
              },
              docs: newFiles.map(x => x.name),
              docFiles: newFiles,
              remarks: finalRemarks,
            });
          }}>
          <span className="btn-text-glow">Submit Final Price Request &nbsp;↗</span>
        </button>
      </div>
    </div>
  );
};

const Loading = ({id,q,setQ,go}) => (
  <>
    <TopSB v={q} set={setQ} go={go}/>
    <div style={{position:'relative',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="est-wm-upper">ESTIMATION</div>
      <div className="lc">
        <p className="search-pg-lbl">Searching Request</p>
        <p className="qid">{id}</p>
        <p className="qsub">Kindly wait, retrieving your quotation status&nbsp;<span className="dot d1"/><span className="dot d2"/><span className="dot d3"/></p>
        <div className="lrow">
          <CircLoader/>
          <div className="bars">
            <div className="bar b1" style={{height:20}}/><div className="bar b2" style={{height:38}}/>
            <div className="bar b3" style={{height:58}}/><div className="bar b4" style={{height:28}}/>
            <div className="bar b5" style={{height:48}}/>
          </div>
        </div>
      </div>
    </div>
  </>
);

const Results = ({id, req, q, setQ, go}) => {
  const [email,setEmail] = useState('');
  const canDownload = req && (req.status === 'Approved' || req.status === 'Completed');
  const isFound = !!req;

  return (
    <>
      <TopSB v={q} set={setQ} go={go}/>
      <div style={{position:'relative',width:'100%',height:'100%',display:'flex',alignItems:'center',paddingLeft:'8vw'}}>
        <div className="est-wm-upper">ESTIMATION</div>
        <div className="rw">
          {isFound ? (
            <>
              <p className="search-pg-lbl">
                {canDownload ? 'Quotation Ready' : `Status: ${req.status}`}
              </p>
              <p className="rid">{req.id}</p>
              <p className="rsub">
                {canDownload
                  ? 'Your quotation has been approved and is ready to download.'
                  : req.status === 'Pending Estimation'
                    ? 'Your request is being processed by our estimation team.'
                    : req.status === 'Pending Approval'
                      ? 'Quotation is pending Cost-Artist approval.'
                      : req.status === 'Estimation Uploaded'
                        ? 'Estimation uploaded — awaiting Cost-Artist review.'
                        : req.status === 'Correction Required'
                        ? 'Quotation is under revision — awaiting updated submission.'
                        : req.status === 'Rejected'
                        ? 'This request has been rejected by Cost-Artist.'
                        : 'Request is in progress.'}
              </p>
              {canDownload && (
                <div className="dl-row">
                  <p className="dl-lbl">Download Quotation</p>
                  {(req.estimationDocs?.length > 0 ? req.estimationDocs : [req.estimationDoc]).filter(Boolean).map((d,i)=>(
                    <button key={i} className="dl-btn" onClick={()=>downloadDoc(d)} style={{cursor:'pointer',opacity:1}}>
                      <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="5" fill="#1D6F42"/><path d="M16 22V10M10 16l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{fontWeight:600,maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.name||`Quotation ${i+1}`}</span>
                    </button>
                  ))}
                  <div className="email-row">
                    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="or send to email ID"/>
                    <button><Mail size={15} color="rgba(220,165,0,0.8)"/></button>
                  </div>
                </div>
              )}
              {!canDownload && (
                <div style={{marginTop:8}}>
                  <span style={{
                    display:'inline-block',padding:'6px 18px',borderRadius:50,
                    fontSize:'0.78rem',fontWeight:600,letterSpacing:'0.08em',
                    background:req.status==='Approved'?'rgba(22,163,74,0.2)':req.status==='Pending Approval'?'rgba(234,88,12,0.2)':'rgba(220,165,0,0.15)',
                    border:`1px solid ${req.status==='Approved'?'rgba(22,163,74,0.5)':req.status==='Pending Approval'?'rgba(234,88,12,0.5)':'rgba(220,165,0,0.35)'}`,
                    color:req.status==='Approved'?'rgba(74,222,128,0.9)':req.status==='Pending Approval'?'rgba(251,146,60,0.9)':'rgba(220,185,80,0.9)',
                  }}>{req.status}</span>
                </div>
              )}
             {/* ── Attached submitted files — visible to all users ── */}
              {req.docs?.filter(d => d && typeof d === 'object').length > 0 && (
                <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:8}}>
                  <p style={{fontSize:'0.60rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',margin:0}}>Attached Documents</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    
                    {/* Notice the clean filter and map here! */}
                    {req.docs.filter(d => d && typeof d === 'object').map((d,i) => (
                      <button key={i} onClick={()=>downloadDoc(d)}
                        style={{display:'flex',alignItems:'center',gap:7,padding:'7px 14px',borderRadius:7,background:'rgba(99,160,240,0.08)',border:'1px solid rgba(99,160,240,0.25)',color:'rgba(99,160,240,0.90)',fontSize:'0.76rem',fontWeight:600,cursor:'pointer',outline:'none',fontFamily:"'Inter',sans-serif",transition:'background 0.15s',maxWidth:220,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(99,160,240,0.18)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(99,160,240,0.08)'}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        {d.name}
                      </button>
                    ))}
                    
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="search-pg-lbl" style={{color:'rgba(180,100,100,0.7)'}}>Not Found</p>
              <p className="rid" style={{fontSize:'clamp(1.5rem,3.5vw,2.2rem)'}}>{id}</p>
              <p className="rsub">No quotation request found with this ID. Please check the ID and try again.</p>
            </>
          )}
        </div>
        <div className="fold-fl"><FolderVisual/></div>
      </div>
    </>
  );
};

// ─── RELAX SCREEN ────────────────────────────────────────────────────────────
// ─── TYPEWRITER HOOK ──────────────────────────────────────────────────────────
const useTypewriter = (lines, speed = 38) => {
  const [state, setState] = useState(lines.map(() => ''));
  useEffect(() => {
    const timers = [];
    const intervals = [];
    lines.forEach((line, li) => {
      let i = 0;
      const t = setTimeout(() => {
        const iv = setInterval(() => {
          i++;
          setState(prev => {
            const next = [...prev];
            next[li] = line.text.slice(0, i);
            return next;
          });
          if (i >= line.text.length) clearInterval(iv);
        }, speed);
        intervals.push(iv);
      }, line.delay);
      timers.push(t);
    });
    return () => { timers.forEach(clearTimeout); intervals.forEach(clearInterval); };
  }, []);
  return state;
};

// ─── RELAX SCREEN ─────────────────────────────────────────────────────────────
const RelaxScreen = ({ onAnother, onHome, docUploadProgress, onRetry }) => {
  const LINES = [
    { text: 'Sit back and relax!',                delay: 2200 },
    { text: "We're analyzing your request —",     delay: 3700 },
    { text: "we'll notify you once ready.",        delay: 5100 },
  ];
  const typed = useTypewriter(LINES, 36);
  const [imgVisible, setImgVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setImgVisible(true), 400);
    const t2 = setTimeout(() => setBtnVisible(true), 6600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const isDone = i => typed[i].length === LINES[i].text.length;
  const isTyping = i => typed[i].length > 0 && !isDone(i);
  const isActive = i => typed[i].length > 0;

  return (
    <div className="relax-screen">
      <div className="relax-left">

        {/* Line 0 — heading */}
        {isActive(0) && (
          <p style={{
            fontFamily:"'Dancing Script',cursive",
            fontSize:'clamp(2.6rem,5.5vw,4rem)',
            fontWeight:700, color:'#fff', lineHeight:1.2,
          }}>
            {typed[0]}
            {!isDone(0) && <span className="type-cursor"/>}
          </p>
        )}

        {/* Lines 1 & 2 — subtext */}
        {isActive(1) && (
          <p style={{
            fontSize:'1.05rem', color:'rgba(255,255,255,0.78)',
            lineHeight:1.8, fontWeight:300, maxWidth:340,
          }}>
            {typed[1]}
            {isTyping(1) && <span className="type-cursor"/>}
            {isDone(1) && isActive(2) && (
              <>
                <br/>
                {typed[2]}
                {isTyping(2) && <span className="type-cursor"/>}
              </>
            )}
          </p>
        )}

        {/* Back to home link */}
        {isActive(1) && (
          <button onClick={onHome}
            style={{alignSelf:'flex-start',background:'transparent',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.35)',fontFamily:"'Inter',sans-serif",fontSize:'0.8rem',padding:0,display:'flex',alignItems:'center',gap:6,transition:'color 0.2s',marginTop:-8}}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.75)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
            ← Back to Home
          </button>
        )}


        {/* Submit Another — glowing aurora pill, fades in after delay */}
        <button onClick={onAnother}
          style={{
            alignSelf:'flex-start',
            opacity: btnVisible ? 1 : 0,
            transform: btnVisible ? 'translateY(0)' : 'translateY(10px)',
            transition:'opacity 0.7s ease, transform 0.7s ease',
            pointerEvents: btnVisible ? 'auto' : 'none',
            position:'relative',overflow:'hidden',
            padding:'13px 36px',borderRadius:100,
            background:'linear-gradient(105deg,#0f0c3a,#1e40af 30%,#6d28d9 55%,#a855f7 75%,#00e5ff 100%)',
            backgroundSize:'220% 220%',
            animation: btnVisible ? 'auroraShift 5s ease-in-out infinite' : 'none',
            border:'1px solid rgba(0,220,255,0.30)',
            color:'#fff',
            fontFamily:"'Inter',sans-serif",
            fontSize:'0.95rem',fontWeight:700,
            cursor:'pointer',letterSpacing:'0.08em',
            boxShadow: btnVisible ? '0 0 28px rgba(0,180,255,0.35), 0 0 60px rgba(109,40,217,0.20)' : 'none',
            outline:'none',
          }}>
          ✦ Submit Another Request
        </button>
      </div>

      <div className="relax-right">
        <img
          src="/Relex.png"
          alt="Relaxing"
          className={`relax-img${imgVisible ? ' visible' : ''}`}
        />
      </div>
    </div>
  );
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const REQUESTERS_LIST  = ['John M.','Lara S.','Hassan A.','Diana R.','Yusuf T.','Priya N.','Carlos B.','Aisha O.','Felix W.'];
const TAT_MS = 2 * 24 * 60 * 60 * 1000; // 2-day TAT target

// Format elapsed time as Dd HH:MM:SS
const formatTAT = (ms) => {
  if (!ms || ms < 0) return '0d 00:00:00';
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

const REQ_STATUS_STYLE = {
  'not-started':      {c:'rgba(120,140,200,0.5)',  bg:'rgba(50,65,110,0.06)',    bd:'rgba(70,90,150,0.15)',    label:'Not Started'},
  inprogress:         {c:'#ffd600',               bg:'rgba(255,210,0,0.08)',    bd:'rgba(255,210,0,0.35)',    label:'In Progress'},
  onhold:             {c:'#ff9020',               bg:'rgba(255,135,0,0.08)',    bd:'rgba(255,135,0,0.35)',    label:'On Hold'},
  overdue:            {c:'#d05200',               bg:'rgba(210,82,0,0.09)',     bd:'rgba(210,82,0,0.38)',     label:'Overdue'},
  risky:              {c:'#dd3535',               bg:'rgba(215,45,45,0.09)',    bd:'rgba(215,55,55,0.38)',    label:'Risky'},
  'pending-director':    {c:'rgba(180,130,255,0.95)',bg:'rgba(140,80,255,0.10)',   bd:'rgba(180,130,255,0.30)', label:'Cost-Artist Under Review'},
  completed:          {c:'#00cc77',               bg:'rgba(0,180,90,0.09)',     bd:'rgba(0,210,100,0.35)',   label:'Approved ✓'},
  'out-of-scope':     {c:'rgba(255,70,70,0.95)',  bg:'rgba(200,40,40,0.09)',    bd:'rgba(220,60,60,0.45)',   label:'Cancelled - Due to Invalid Documents'},
  'rfi':              {c:'rgba(251,191,36,0.95)', bg:'rgba(180,120,0,0.10)',    bd:'rgba(251,191,36,0.40)',  label:'RFI - Awaiting Info from Sales'},
};

// ── TAT stage calculator ──────────────────────────────────────────────────────
function calcTATStages(r) {
  const t = ms => (ms > 0 ? ms : null);
  const s1 = r.submittedAt && r.taggedAt
    ? t(r.taggedAt - new Date(r.submittedAt).getTime()) : null;
  const s2 = r.taggedAt && r.quotationSubmittedAt
    ? t(new Date(r.quotationSubmittedAt).getTime() - r.taggedAt) : null;
  const s3 = r.quotationSubmittedAt && r.directorRespondedAt
    ? t(new Date(r.directorRespondedAt).getTime() - new Date(r.quotationSubmittedAt).getTime()) : null;
  const cycles = (r.rejectionCycles||[]).map(c => ({
    ...c,
    s4: c.rejectedAt && c.reassignedAt
      ? t(new Date(c.reassignedAt).getTime() - new Date(c.rejectedAt).getTime()) : null,
  }));
  return { s1, s2, s3, cycles };
}

// ── Mini timeline pill strip ──────────────────────────────────────────────────
const TATTimeline = ({ r, compact }) => {
  const F = "'Inter',sans-serif";
  const fms = ms => {
    if (!ms) return null;
    const h = Math.floor(ms/3600000); const m = Math.floor((ms%3600000)/60000);
    return h > 23 ? `${Math.floor(h/24)}d ${h%24}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  const fdt = ts => {
    if (!ts) return null;
    try { const d = new Date(ts); return d.toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}); } catch { return null; }
  };
  const { s1, s2, s3, cycles } = calcTATStages(r);
  // Live counter for current active stage
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t+1), 30000);
    return () => clearInterval(id);
  }, []);
  const now = Date.now();
  const liveMs = !r.directorRespondedAt && r.quotationSubmittedAt ? now - new Date(r.quotationSubmittedAt).getTime()
    : !r.quotationSubmittedAt && r.taggedAt ? now - r.taggedAt
    : !r.taggedAt && r.submittedAt ? now - new Date(r.submittedAt).getTime()
    : null;

  const resultLabel = r.directorAction === 'approved' ? 'Approved'
    : r.directorAction === 'rejected' ? 'Rejected'
    : r.directorAction === 'revised'   ? 'Revised'
    : 'Result';
  const resultColor = r.directorAction === 'approved' ? 'rgba(50,220,100,0.92)'
    : r.directorAction === 'rejected' ? 'rgba(255,80,80,0.92)'
    : r.directorAction === 'revised'   ? 'rgba(255,160,30,0.92)'
    : 'rgba(180,180,180,0.35)';

  const stages = [
    { label: 'Submitted',   color: 'rgba(120,180,255,0.90)', done: !!r.submittedAt,           tat: null, ts: r.submittedAt },
    { label: 'Assigned',    color: 'rgba(255,200,50,0.90)',  done: !!r.taggedAt,              tat: s1,   ts: r.taggedAt },
    { label: 'Quoted',      color: 'rgba(160,130,255,0.95)', done: !!r.quotationSubmittedAt,  tat: s2,   ts: r.quotationSubmittedAt },
    { label: 'Cost-Artist', color: 'rgba(0,220,180,0.90)',   done: !!r.quotationSubmittedAt,  tat: null, ts: r.quotationSubmittedAt },
    { label: resultLabel,   color: resultColor,               done: !!r.directorRespondedAt,   tat: s3,   ts: r.directorRespondedAt },
  ];
  const dotSz = compact ? 7 : 8;
  return (
    <div style={{display:'flex',alignItems:'center',width:'100%',fontFamily:F}}>
      {stages.map((st, i) => (
        <div key={i} style={{display:'contents'}}>
          {/* inline: dot · label · timestamp — all on one line */}
          <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
            <div style={{width:dotSz,height:dotSz,borderRadius:'50%',
              background:st.done?st.color:'rgba(255,255,255,0.14)',
              boxShadow:st.done?`0 0 7px ${st.color}`:'none',
              border:st.done?`1.5px solid ${st.color}`:'1px solid rgba(255,255,255,0.22)',
              flexShrink:0}}/>
            <span style={{fontSize:compact?'0.54rem':'0.60rem',fontWeight:st.done?700:400,
              color:st.done?'rgba(255,255,255,0.90)':'rgba(255,255,255,0.28)',
              whiteSpace:'nowrap',letterSpacing:'0.05em'}}>
              {st.label}
            </span>
            {st.done && fdt(st.ts) && (
              <span style={{fontSize:compact?'0.44rem':'0.48rem',color:st.color,whiteSpace:'nowrap',
                fontFamily:'monospace',fontWeight:600,opacity:0.80}}>
                {fdt(st.ts)}
              </span>
            )}
          </div>
          {/* inline connector: › duration (arrow first, then duration) */}
          {i < stages.length - 1 && (
            <div style={{display:'flex',alignItems:'center',gap:3,padding:'0 3px',flexShrink:0}}>
              {(() => {
                const isLastSeg = i === stages.length - 2;
                const reversed = isLastSeg && (r.directorAction === 'rejected' || r.directorAction === 'revised');
                const segTat = stages[i+1].tat;
                const segColor = stages[i+1].color;
                const isLive = !segTat && (
                  (i === 0 && !r.taggedAt && liveMs) ||
                  (i === 1 && r.taggedAt && !r.quotationSubmittedAt && liveMs) ||
                  (i === 3 && r.quotationSubmittedAt && !r.directorRespondedAt && liveMs)
                );
                const duration = segTat ? fms(segTat) : isLive ? `${fms(liveMs)} ↻` : null;
                const arrow = reversed ? '‹' : '›';
                const arrowColor = reversed ? 'rgba(255,100,100,0.85)'
                  : stages[i+1].done ? stages[i+1].color
                  : st.done ? `${st.color}80`
                  : 'rgba(255,255,255,0.20)';
                return (
                  <>
                    <span style={{color:arrowColor,fontSize:compact?'0.60rem':'0.66rem',lineHeight:1,fontWeight:600}}>{arrow}</span>
                    {duration && (
                      <span style={{fontSize:compact?'0.62rem':'0.70rem',
                        color:reversed?'rgba(255,120,120,0.90)':segColor,
                        fontFamily:'monospace',fontWeight:700,whiteSpace:'nowrap',
                        textShadow:`0 0 7px ${reversed?'rgba(255,100,100,0.40)':segColor+'70'}`}}>
                        {duration}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      ))}
      {cycles.map((c,i) => (
        <div key={`c${i}`} style={{display:'contents'}}>
          <div style={{minWidth:20,flex:0,display:'flex',flexDirection:'column',alignItems:'center',padding:'0 4px',paddingBottom:24}}>
            <div style={{width:'100%',height:1,background:'rgba(255,90,90,0.30)'}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,flexShrink:0}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'rgba(255,100,100,0.80)',boxShadow:'0 0 5px rgba(255,80,80,0.6)',flexShrink:0,marginBottom:2}}/>
            <span style={{fontSize:'0.48rem',color:'rgba(255,120,120,0.70)',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>Retry {c.cycle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

function getReqStatus(r, now) {
  if (!r.estimator) return 'not-started';
  if (r.reqStatus === 'out-of-scope') return 'out-of-scope';
  if (r.reqStatus === 'rfi') return 'rfi';
  if (r.reqStatus === 'completed' || r.reqStatus === 'onhold' || r.reqStatus === 'risky') return r.reqStatus;
  if (r.reqStatus === 'pending-director') return 'pending-director';
  if (r.taggedAt && (now - r.taggedAt) > TAT_MS) return 'overdue';
  return 'inprogress';
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  'Pending Estimation':   'rgba(220,165,0,0.85)',
  'Estimation Uploaded':  'rgba(99,102,241,0.9)',
  'Pending Approval':     'rgba(234,88,12,0.9)',
  'Approved':             'rgba(22,163,74,0.9)',
  'Completed':            'rgba(20,184,166,0.9)',
  'Out of Scope':         'rgba(220,60,60,0.85)',
  'Correction Required':  'rgba(236,72,153,0.95)',
  'Rejected':             'rgba(220,50,50,0.88)',
};
const Badge = ({s}) => (
  <span style={{
    display:'inline-block',padding:'3px 12px',borderRadius:50,
    fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.08em',
    background:STATUS_COLORS[s]||'rgba(148,163,184,0.5)',
    color:'#fff',whiteSpace:'nowrap',
  }}>{s}</span>
);

// ─── DIRECTOR REVIEW MODAL ────────────────────────────────────────────────────
const DirectorReviewModal = ({req, idx, now, onUpdate, onClose, requests=[]}) => {
  const rs = getReqStatus(req, now);
  const rss = REQ_STATUS_STYLE[rs];
  const [revisedMargin, setRevisedMargin] = useState(req.revisedMargin||'');
  const [action, setAction] = useState(req.directorAction||null);
  const [note, setNote] = useState(req.directorNote||'');
  const [submitted, setSubmitted] = useState(false);
  const allQuotDocs = (req.estimationDocs?.length > 0 ? req.estimationDocs : [req.estimationDoc].filter(Boolean));
  const [editedDocs, setEditedDocs] = useState(()=> allQuotDocs);
  const [selectedDocIds, setSelectedDocIds] = useState(() => req.salesApprovedDocs?.length ? req.salesApprovedDocs : allQuotDocs.map(d=>d.id).filter(Boolean));
  const [docUploadState, setDocUploadState] = useState(null);
  const dirDocUploadRef = useRef(null);
  const [origOpen, setOrigOpen] = useState(false);
  const origReq = req.originalId ? requests.find(r => r.id === req.originalId) : null;
  const similarReqs = req.originalId ? [] : requests.filter(r =>
    r.id !== req.id && (r.reqStatus === 'completed' || r.directorAction === 'approved') &&
    ((r.client||'').toLowerCase() === (req.client||'').toLowerCase() ||
     (r.proj||'').toLowerCase() === (req.proj||'').toLowerCase()) &&
    r.client
  ).slice(0, 5);

  const tatElapsed = req.taggedAt ? now - req.taggedAt : 0;
  const tatPct = Math.min(100, (tatElapsed / TAT_MS) * 100);
  const tatColor = tatPct >= 100 ? '#ff4d4d' : tatPct >= 75 ? '#ff7a30' : tatPct >= 50 ? '#ffb347' : '#00e5ff';
  const tagDate = req.taggedAt ? new Date(req.taggedAt).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';

  const ACTIONS = [
    {v:'approved', label:'Approve', c:'#00e5b0', bg:'rgba(0,229,176,0.10)', bd:'rgba(0,229,176,0.38)'},
    {v:'revised',  label:'Revise',  c:'rgba(120,180,255,0.95)', bg:'rgba(80,140,255,0.10)', bd:'rgba(120,180,255,0.40)'},
    {v:'rejected', label:'Reject',  c:'rgba(255,90,90,0.95)',   bg:'rgba(215,45,45,0.10)',  bd:'rgba(215,55,55,0.40)'},
  ];

  const submit = () => {
    if (!action) return;
    const newStatus = action === 'approved' ? 'Approved' : action === 'revised' ? 'Correction Required' : 'Rejected';
    const newReqStatus = action === 'approved' ? 'completed' : 'inprogress';
    const dTs = new Date().toISOString();
    const tlEntry = { event: action==='approved'?'approved':action==='rejected'?'rejected':'revision', ts: dTs, label: action==='approved'?'Cost Artist Approved':action==='rejected'?'Cost Artist Rejected':'Correction Required', by: 'Cost Artist' };
    onUpdate(req.id, {revisedMargin, directorAction:action, directorNote:note, status:newStatus, reqStatus:newReqStatus,
      estimationDocs: editedDocs,
      directorRespondedAt: dTs, salesApprovedDocs: selectedDocIds.filter(id=>editedDocs.some(d=>d.id===id)), timeline: [...(req.timeline||[]), tlEntry] });
    setSubmitted(true);
    setTimeout(() => onClose(), 1800);
  };

  const handleDirDocUpload = async e => {
    const files = Array.from(e.target.files||[]);
    if (!files.length) return;
    setDocUploadState('uploading');
    const newDocs = [];
    for (const file of files) {
      const id = `dir-doc-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
      let url = null, verified = false;
      try {
        url = await uploadToSharePoint(file, req.id, file.name);
        verified = url ? await verifyFileUrl(url) : false;
      } catch {}
      newDocs.push({ id, name: file.name, url, verified });
    }
    setEditedDocs(prev => [...prev, ...newDocs]);
    setSelectedDocIds(prev => [...prev, ...newDocs.map(d=>d.id)]);
    setDocUploadState(null);
    e.target.value = '';
  };

  const deleteDirDoc = id => {
    setEditedDocs(prev => prev.filter(d => d.id !== id));
    setSelectedDocIds(prev => prev.filter(i => i !== id));
  };

  const F = "'Inter',sans-serif";

  /* ── helpers ── */
  const lbl = t => (
    <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.40)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:5,fontWeight:600}}>{t}</div>
  );
  const val = (v, c='rgba(255,255,255,0.88)') => (
    <div style={{fontSize:'0.82rem',fontWeight:600,color:c,lineHeight:1.4}}>{v||'—'}</div>
  );
  /* glassy card */
  const GC = ({children, accent='rgba(255,255,255,0.06)', border='rgba(255,255,255,0.09)', style:sx={}}) => (
    <div style={{background:accent,border:`1px solid ${border}`,borderRadius:10,padding:'11px 15px',backdropFilter:'blur(14px) saturate(1.6)',WebkitBackdropFilter:'blur(14px) saturate(1.6)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 18px rgba(0,0,0,0.40)',...sx}}>
      {children}
    </div>
  );

  return (
    <div style={{position:'fixed',inset:0,zIndex:9010,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onClose}>
      <div style={{width:'min(840px,96vw)',maxHeight:'92vh',overflowY:'auto',background:'rgba(0,0,0,0.97)',border:'1px solid rgba(0,220,255,0.12)',borderRadius:16,boxShadow:'0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 60px rgba(0,180,255,0.07), 0 40px 100px rgba(0,0,0,0.90)',fontFamily:F,animation:'fadeUp 0.2s ease both'}} onClick={e=>e.stopPropagation()}>

        {/* ── Sticky header ── */}
        <div style={{background:'rgba(0,0,0,0.98)',borderBottom:'1px solid rgba(0,220,255,0.10)',padding:'14px 22px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10,backdropFilter:'blur(20px)'}}>
          <div style={{width:3,height:40,borderRadius:2,background:'linear-gradient(180deg,rgba(0,220,255,0.95) 0%,rgba(80,130,255,0.20) 100%)',flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <span style={{fontFamily:'monospace',fontSize:'0.73rem',fontWeight:700,color:'rgba(0,210,255,0.85)',letterSpacing:'0.10em'}}>{req.id}</span>
              <span style={{fontSize:'0.95rem',fontWeight:700,color:'rgba(255,255,255,0.92)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{req.proj||'—'}</span>
              <span style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 9px',borderRadius:50,background:rss.bg,border:`1px solid ${rss.bd}`,flexShrink:0}}>
                <span style={{width:4,height:4,borderRadius:'50%',background:rss.c}}/>
                <span style={{fontSize:'0.62rem',color:rss.c,fontWeight:700,letterSpacing:'0.05em'}}>{rss.label}</span>
              </span>
            </div>
            <div style={{fontSize:'0.66rem',color:'rgba(0,200,255,0.30)',marginTop:3,letterSpacing:'0.06em'}}>Cost Artist Review · Quotation Request</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:8,color:'rgba(255,255,255,0.45)',fontSize:16,cursor:'pointer',padding:'4px 12px',outline:'none',lineHeight:1,flexShrink:0,transition:'background 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.09)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}>×</button>
        </div>

        <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:14}}>

          {/* ── Row 1: Project · Client · Contractor ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            <GC><>{lbl('Project')}{val(req.proj)}</></GC>
            <GC><>{lbl('Client / Grantor')}{val(req.client)}</></GC>
            <GC><>{lbl('Main Contractor')}{val(req.mainContractor)}</></GC>
          </div>

          {/* ── Row 2: Consultant · Deal Type · Lead Time ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            <GC><>{lbl('Consultant')}{val(req.consultant)}</></GC>
            <GC accent='rgba(0,180,255,0.05)' border='rgba(0,200,255,0.13)'>
              {lbl('Deal Type')}
              <div style={{fontSize:'0.88rem',fontWeight:700,color:'rgba(0,210,255,0.90)'}}>{req.deal||'—'}</div>
            </GC>
            <GC><>{lbl('Lead Time')}{val(req.leadTime)}</></GC>
          </div>

          {/* ── Row 3: Estimator · Margin · TAT ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            {/* Estimator card */}
            <GC accent='rgba(60,100,200,0.12)' border='rgba(80,140,255,0.20)'>
              {lbl('Assigned Estimator')}
              <div style={{fontSize:'0.92rem',fontWeight:700,color:'rgba(110,175,255,0.95)',marginBottom:3}}>{req.estimator||'—'}</div>
              <div style={{fontSize:'0.64rem',color:'rgba(255,255,255,0.25)',letterSpacing:'0.04em'}}>Tagged: {tagDate}</div>
            </GC>
            {/* Margin card */}
            <GC accent='rgba(0,200,255,0.07)' border='rgba(0,210,255,0.20)'>
              {lbl('Estimator Margin')}
              <div style={{display:'flex',alignItems:'baseline',gap:3,marginTop:4}}>
                <span style={{fontSize:'2rem',fontWeight:800,fontFamily:'monospace',lineHeight:1,background:'linear-gradient(135deg,rgba(0,230,255,1) 0%,rgba(100,180,255,0.80) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{req.margin||'—'}</span>
                {req.margin && <span style={{fontSize:'1rem',color:'rgba(0,210,255,0.60)',fontFamily:'monospace',fontWeight:700}}>%</span>}
              </div>
            </GC>
            {/* TAT card */}
            <GC accent='rgba(255,255,255,0.03)' border='rgba(255,255,255,0.08)'>
              {lbl('TAT (2-day target)')}
              <div style={{fontSize:'0.88rem',fontWeight:700,color:tatColor,fontFamily:'monospace',marginBottom:8,letterSpacing:'0.04em'}}>{formatTAT(tatElapsed)}</div>
              <div style={{height:5,borderRadius:3,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:3,width:`${tatPct}%`,background:`linear-gradient(90deg,${tatColor}70,${tatColor})`,transition:'width 0.4s'}}/>
              </div>
              <div style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.22)',marginTop:5}}>{Math.round(tatPct)}% of TAT used</div>
            </GC>
          </div>

          {/* ── Row 4: Category · Quotation Files · Total Amount ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            {/* Category */}
            <GC>
              {lbl('Category')}
              <div style={{display:'flex',flexDirection:'column',gap:5,marginTop:5}}>
                {req.supplyOnly && (
                  <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:'0.76rem',fontWeight:600,color:'rgba(0,200,255,0.90)',background:'rgba(0,200,255,0.08)',border:'1px solid rgba(0,200,255,0.18)',borderRadius:5,padding:'4px 10px',width:'fit-content'}}>
                    <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(0,200,255,0.90)',flexShrink:0}}/>Supply Only
                  </span>
                )}
                {req.supplyInstall && (
                  <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:'0.76rem',fontWeight:600,color:'rgba(160,100,255,0.90)',background:'rgba(140,80,255,0.08)',border:'1px solid rgba(160,100,255,0.20)',borderRadius:5,padding:'4px 10px',width:'fit-content'}}>
                    <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(160,100,255,0.90)',flexShrink:0}}/>Supply & Install
                  </span>
                )}
                {!req.supplyOnly && !req.supplyInstall && <span style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.22)'}}>—</span>}
              </div>
            </GC>
            {/* Quotation files — Cost-Artist can add/delete/select */}
            <GC>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                {lbl('Quotation Files — tick to release to Sales')}
                <div style={{display:'flex',gap:5,marginTop:-4}}>
                  {editedDocs.length > 1 && <>
                    <button onClick={()=>setSelectedDocIds(editedDocs.map(d=>d.id).filter(Boolean))}
                      style={{fontSize:'0.52rem',fontWeight:700,color:'rgba(0,220,130,0.80)',background:'rgba(0,220,130,0.08)',border:'1px solid rgba(0,220,130,0.22)',borderRadius:5,padding:'2px 8px',cursor:'pointer',outline:'none'}}>All</button>
                    <button onClick={()=>setSelectedDocIds([])}
                      style={{fontSize:'0.52rem',fontWeight:700,color:'rgba(255,255,255,0.35)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:5,padding:'2px 8px',cursor:'pointer',outline:'none'}}>None</button>
                  </>}
                  <input ref={dirDocUploadRef} type="file" multiple style={{display:'none'}} onChange={handleDirDocUpload}/>
                  <button onClick={()=>dirDocUploadRef.current?.click()} disabled={docUploadState==='uploading'}
                    style={{fontSize:'0.52rem',fontWeight:700,color:docUploadState==='uploading'?'rgba(255,255,255,0.30)':'rgba(100,180,255,0.90)',background:'rgba(60,120,255,0.10)',border:'1px solid rgba(80,150,255,0.28)',borderRadius:5,padding:'2px 9px',cursor:docUploadState==='uploading'?'wait':'pointer',outline:'none',transition:'all 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(60,120,255,0.20)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(60,120,255,0.10)'}>
                    {docUploadState==='uploading' ? '⟳ Uploading…' : '+ Add File'}
                  </button>
                </div>
              </div>
              {editedDocs.length > 0 ? (
                <div style={{display:'flex',flexDirection:'column',gap:5}}>
                  {editedDocs.map((d,i)=>{
                    const isSel = d.id ? selectedDocIds.includes(d.id) : false;
                    return (
                      <div key={d.id||i} style={{display:'flex',alignItems:'center',gap:5,background:isSel?'rgba(0,220,130,0.07)':'transparent',borderRadius:7,padding:'2px 0',transition:'background 0.15s'}}>
                        {/* Select checkbox */}
                        <button title={isSel?'Deselect':'Select for release'} onClick={()=>{ if(!d.id) return; setSelectedDocIds(prev=>isSel?prev.filter(id=>id!==d.id):[...prev,d.id]); }}
                          style={{flexShrink:0,width:18,height:18,borderRadius:4,background:isSel?'rgba(0,220,130,0.25)':'rgba(255,255,255,0.05)',border:`1.5px solid ${isSel?'rgba(0,220,130,0.70)':'rgba(255,255,255,0.18)'}`,color:isSel?'rgba(0,230,140,0.95)':'rgba(255,255,255,0.30)',cursor:d.id?'pointer':'default',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',fontSize:'0.62rem',fontWeight:800}}>
                          {isSel?'✓':''}
                        </button>
                        {/* Download */}
                        <button onClick={()=>downloadDoc(d)}
                          style={{flex:1,display:'flex',alignItems:'center',gap:7,padding:'6px 10px',borderRadius:7,background:isSel?'rgba(0,220,130,0.10)':'rgba(0,220,130,0.06)',border:`1px solid ${isSel?'rgba(0,220,130,0.40)':'rgba(0,220,130,0.22)'}`,color:'rgba(0,220,130,0.90)',fontSize:'0.74rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',textAlign:'left',overflow:'hidden',minWidth:0}}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(0,220,130,0.16)'}
                          onMouseLeave={e=>e.currentTarget.style.background=isSel?'rgba(0,220,130,0.10)':'rgba(0,220,130,0.06)'}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{d.name||`Quotation ${i+1}`}</span>
                          {isSel&&<span style={{fontSize:'0.44rem',color:'rgba(0,220,130,0.70)',letterSpacing:'0.08em',textTransform:'uppercase',flexShrink:0,fontWeight:700}}>Sales ✓</span>}
                        </button>
                        {/* Delete */}
                        <button onClick={()=>deleteDirDoc(d.id)} title="Remove file"
                          style={{flexShrink:0,width:24,height:24,borderRadius:5,background:'rgba(220,50,50,0.08)',border:'1px solid rgba(220,60,60,0.22)',color:'rgba(220,80,80,0.60)',cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.24)';e.currentTarget.style.color='rgba(255,100,100,0.95)';}}
                          onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.08)';e.currentTarget.style.color='rgba(220,80,80,0.60)';}}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    );
                  })}
                  <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',marginTop:2,paddingLeft:24}}>
                    {selectedDocIds.filter(id=>editedDocs.some(d=>d.id===id)).length} of {editedDocs.length} file{editedDocs.length!==1?'s':''} selected for Sales release
                  </div>
                </div>
              ) : (
                <div style={{padding:'7px 10px',borderRadius:7,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:7}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,180,0,0.70)',flexShrink:0}}/>
                  <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.30)',fontStyle:'italic'}}>No quotation files — use "+ Add File" to attach</span>
                </div>
              )}
            </GC>
            {/* Total Amount */}
            <GC accent='rgba(0,220,130,0.06)' border='rgba(0,220,130,0.16)'>
              {lbl('Total Amount (AED)')}
              <div style={{fontSize:'1.4rem',fontWeight:800,fontFamily:'monospace',lineHeight:1.2,marginTop:5,background:'linear-gradient(135deg,rgba(0,240,160,1) 0%,rgba(0,200,255,0.75) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{req.totalAmt||'—'}</div>
            </GC>
          </div>

          {/* ── Attached Documents — downloadable for estimator/director ── */}
          {req.docs?.length > 0 && (
            <GC>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                {lbl(`Attached Documents (${req.docs.length})`)}
                {req.docs.length > 1 && (
                  <button onClick={()=>req.docs.forEach(d=>downloadDoc(d))}
                    style={{display:'flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:6,background:'rgba(52,211,153,0.08)',border:'1px solid rgba(52,211,153,0.30)',color:'rgba(52,211,153,0.90)',fontSize:'0.65rem',fontWeight:700,cursor:'pointer',outline:'none',fontFamily:F,transition:'background 0.15s',flexShrink:0}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(52,211,153,0.18)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(52,211,153,0.08)'}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download All
                  </button>
                )}
              </div>
              {/* Scrollable container when > 5 docs */}
              <div style={{
                display:'flex',gap:7,flexWrap:'wrap',
                maxHeight: req.docs.length > 5 ? 140 : 'none',
                overflowY: req.docs.length > 5 ? 'auto' : 'visible',
                paddingRight: req.docs.length > 5 ? 2 : 0,
              }}>
                {req.docs.map((d,i)=>(
                  <button key={i} onClick={()=>downloadDoc(d)}
                    style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.72rem',color:'rgba(0,200,255,0.85)',background:'rgba(0,200,255,0.07)',border:'1px solid rgba(0,200,255,0.18)',borderRadius:6,padding:'4px 11px',cursor:'pointer',outline:'none',fontFamily:F,fontWeight:600,transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(0,200,255,0.15)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(0,200,255,0.07)'}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {docName(d)}
                  </button>
                ))}
              </div>
            </GC>
          )}

          {/* ── Revised Margin + Remarks ── */}
          <div style={{display:'grid',gridTemplateColumns:'190px 1fr',gap:12,alignItems:'start'}}>
            <div>
              <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.40)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:7,fontWeight:600}}>Revised Margin %</div>
              <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(0,210,255,0.06)',border:'1px solid rgba(0,210,255,0.22)',borderRadius:10,padding:'10px 14px',backdropFilter:'blur(12px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07)'}}>
                <input type="number" value={revisedMargin} onChange={e=>setRevisedMargin(e.target.value)} placeholder="0.0" min="0" max="100" step="0.5"
                  style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:'monospace',fontSize:'1.6rem',fontWeight:700,width:'100%',color:'rgba(0,220,255,0.95)'}}/>
                <span style={{fontSize:'1.1rem',color:'rgba(0,200,255,0.50)',fontFamily:'monospace',fontWeight:700,flexShrink:0}}>%</span>
              </div>
            </div>
            <div>
              <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.40)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:7,fontWeight:600}}>Remarks</div>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add Cost-Artist remarks or revision notes…" rows={3}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:10,color:'rgba(255,255,255,0.80)',fontFamily:F,fontSize:'0.83rem',padding:'10px 14px',outline:'none',resize:'none',boxSizing:'border-box',backdropFilter:'blur(12px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)'}}
                onFocus={e=>e.target.style.borderColor='rgba(0,210,255,0.30)'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.10)'}/>
            </div>
          </div>

          {/* ── Director Decision ── */}
          <div>
            <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.40)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:10,fontWeight:600}}>Cost-Artist Decision</div>
            <div style={{display:'flex',gap:10}}>
              {ACTIONS.map(a=>(
                <button key={a.v} onClick={()=>setAction(a.v)}
                  style={{flex:1,padding:'13px 0',borderRadius:10,cursor:'pointer',outline:'none',fontFamily:F,fontSize:'0.88rem',fontWeight:action===a.v?700:500,background:action===a.v?a.bg:'rgba(255,255,255,0.03)',border:action===a.v?`1.5px solid ${a.bd}`:'1px solid rgba(255,255,255,0.07)',color:action===a.v?a.c:'rgba(255,255,255,0.32)',transition:'all 0.15s',display:'flex',alignItems:'center',justifyContent:'center',gap:8,backdropFilter:'blur(8px)',boxShadow:action===a.v?`0 0 18px ${a.c}1a`:'none'}}
                  onMouseEnter={e=>{if(action!==a.v)e.currentTarget.style.background='rgba(255,255,255,0.06)';}}
                  onMouseLeave={e=>{if(action!==a.v)e.currentTarget.style.background='rgba(255,255,255,0.03)';}}>
                  {action===a.v&&<span style={{width:7,height:7,borderRadius:'50%',background:a.c,boxShadow:`0 0 9px ${a.c}`,flexShrink:0}}/>}
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Sales Activity Log ── */}
          {req.salesLog?.length > 0 && (() => {
            const SLC = {Won:{c:'#4ade80'},Lost:{c:'#f87171'},'Follow-up':{c:'#fbbf24'},Risky:{c:'#fb923c'},Pending:{c:'rgba(255,255,255,0.40)'}};
            return (
              <GC>
                <div style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:10}}>Sales Activity Log</div>
                <div style={{display:'flex',flexDirection:'column',gap:0}}>
                  {[...req.salesLog].reverse().map((entry,i)=>{
                    const ec=SLC[entry.status]||SLC.Pending;
                    return (
                      <div key={i} style={{display:'flex',gap:9,paddingBottom:9,marginBottom:9,borderBottom:i<req.salesLog.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                          <span style={{width:6,height:6,borderRadius:'50%',background:ec.c,boxShadow:`0 0 4px ${ec.c}`,marginTop:3,flexShrink:0}}/>
                          {i<req.salesLog.length-1&&<div style={{width:1,flex:1,minHeight:8,background:'rgba(255,255,255,0.07)',marginTop:3}}/>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap',marginBottom:entry.remark?3:0}}>
                            <span style={{fontSize:'0.72rem',fontWeight:700,color:ec.c}}>{entry.status}</span>
                            <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.28)'}}>· {entry.by}</span>
                            <span style={{fontSize:'0.56rem',color:'rgba(255,255,255,0.20)',marginLeft:'auto'}}>{entry.ts}</span>
                          </div>
                          {entry.remark&&<p style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.56)',lineHeight:1.5,margin:0,borderLeft:`2px solid ${ec.c}50`,paddingLeft:7}}>{entry.remark}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GC>
            );
          })()}

          {/* ── Original Request History (collapsible) ── */}
          {origReq && (
            <GC>
              <button onClick={()=>setOrigOpen(v=>!v)}
                style={{display:'flex',alignItems:'center',gap:8,background:'transparent',border:'none',cursor:'pointer',padding:0,width:'100%',textAlign:'left',outline:'none'}}>
                <span style={{fontSize:'0.56rem',color:origOpen?'rgba(0,220,255,0.75)':'rgba(255,255,255,0.30)',transition:'color 0.15s'}}>{origOpen?'▾':'▸'}</span>
                <span style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,color:origOpen?'rgba(0,220,255,0.75)':'rgba(255,255,255,0.30)',transition:'color 0.15s'}}>Original Request — {origReq.proj||origReq.id}</span>
                {origReq.directorAction && <span style={{marginLeft:'auto',fontSize:'0.52rem',fontWeight:700,padding:'2px 8px',borderRadius:4,
                  background:origReq.directorAction==='approved'?'rgba(0,220,130,0.12)':origReq.directorAction==='rejected'?'rgba(220,60,60,0.12)':'rgba(255,160,30,0.12)',
                  color:origReq.directorAction==='approved'?'rgba(0,220,130,0.80)':origReq.directorAction==='rejected'?'rgba(220,80,80,0.80)':'rgba(255,180,50,0.80)',
                  border:`1px solid ${origReq.directorAction==='approved'?'rgba(0,220,130,0.28)':origReq.directorAction==='rejected'?'rgba(220,60,60,0.28)':'rgba(255,160,30,0.28)'}`
                }}>{origReq.directorAction.charAt(0).toUpperCase()+origReq.directorAction.slice(1)}</span>}
              </button>
              {origOpen && (
                <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:8,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  {/* Info row */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[['Client',origReq.client],['Project',origReq.proj],['Estimator',origReq.estimator||'—']].map(([k,v])=>(
                      <div key={k}>
                        <div style={{fontSize:'0.48rem',color:'rgba(0,220,255,0.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:3,fontWeight:600}}>{k}</div>
                        <div style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.72)',fontWeight:600}}>{v||'—'}</div>
                      </div>
                    ))}
                  </div>
                  {/* Date + decision */}
                  <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                    <div>
                      <div style={{fontSize:'0.48rem',color:'rgba(0,220,255,0.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:3,fontWeight:600}}>Submitted</div>
                      <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)'}}>{origReq.date||'—'}</div>
                    </div>
                    {origReq.directorRespondedAt && <div>
                      <div style={{fontSize:'0.48rem',color:'rgba(0,220,255,0.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:3,fontWeight:600}}>Responded</div>
                      <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)'}}>{new Date(origReq.directorRespondedAt).toLocaleDateString('en-GB')}</div>
                    </div>}
                    {origReq.revisedMargin && <div>
                      <div style={{fontSize:'0.48rem',color:'rgba(0,220,255,0.35)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:3,fontWeight:600}}>Revised Margin</div>
                      <div style={{fontSize:'0.72rem',color:'rgba(0,220,255,0.80)',fontWeight:700}}>{origReq.revisedMargin}%</div>
                    </div>}
                  </div>
                  {/* Original requestor remarks */}
                  {origReq.remarks && (
                    <div style={{background:'rgba(80,80,200,0.06)',border:'1px solid rgba(120,120,255,0.18)',borderRadius:8,padding:'8px 12px'}}>
                      <div style={{fontSize:'0.48rem',color:'rgba(180,180,255,0.55)',letterSpacing:'0.13em',textTransform:'uppercase',marginBottom:4,fontWeight:700}}>Requestor Remarks</div>
                      <p style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.62)',lineHeight:1.5,margin:0}}>{origReq.remarks}</p>
                    </div>
                  )}
                  {/* Estimator comments on original */}
                  {origReq.estimatorComments && (
                    <div style={{background:'rgba(255,200,40,0.05)',border:'1px solid rgba(255,200,40,0.16)',borderRadius:8,padding:'8px 12px'}}>
                      <div style={{fontSize:'0.48rem',color:'rgba(255,200,40,0.55)',letterSpacing:'0.13em',textTransform:'uppercase',marginBottom:4,fontWeight:700}}>Estimator Comments</div>
                      <p style={{fontSize:'0.76rem',color:'rgba(255,230,140,0.75)',lineHeight:1.5,margin:0}}>{origReq.estimatorComments}</p>
                    </div>
                  )}
                  {/* Cost-Artist note on original */}
                  {origReq.directorNote && (
                    <div style={{background:'rgba(0,150,255,0.06)',border:'1px solid rgba(0,180,255,0.18)',borderRadius:8,padding:'8px 12px'}}>
                      <div style={{fontSize:'0.48rem',color:'rgba(0,200,255,0.55)',letterSpacing:'0.13em',textTransform:'uppercase',marginBottom:4,fontWeight:700}}>Cost-Artist Note</div>
                      <p style={{fontSize:'0.76rem',color:'rgba(180,220,255,0.80)',lineHeight:1.5,margin:0}}>{origReq.directorNote}</p>
                    </div>
                  )}
                  {/* Original quotation docs */}
                  {(origReq.estimationDocs?.length > 0 || origReq.estimationDoc) && (
                    <div>
                      <div style={{fontSize:'0.48rem',color:'rgba(52,211,153,0.50)',letterSpacing:'0.13em',textTransform:'uppercase',marginBottom:5,fontWeight:700}}>Original Quotation Docs</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                        {(origReq.estimationDocs?.length > 0 ? origReq.estimationDocs : [origReq.estimationDoc]).filter(Boolean).map((d,i)=>(
                          <button key={i} onClick={()=>downloadDoc(d)}
                            style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.68rem',color:'rgba(52,211,153,0.85)',background:'rgba(0,180,100,0.08)',border:'1px solid rgba(52,211,153,0.22)',borderRadius:6,padding:'4px 10px',cursor:'pointer',outline:'none',fontFamily:F,fontWeight:600}}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            {d.name||`orig-doc-${i+1}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GC>
          )}

          {/* ── Similar Requests (past approved/completed with same client or project) ── */}
          {similarReqs.length > 0 && (
            <GC>
              <div style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:700,marginBottom:10}}>Similar Past Requests</div>
              <div style={{display:'flex',flexDirection:'column',gap:7}}>
                {similarReqs.map((sr,i)=>{
                  const srDate = sr.directorRespondedAt ? new Date(sr.directorRespondedAt).toLocaleDateString('en-GB') : sr.date||'—';
                  return (
                    <div key={sr.id||i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 12px',borderRadius:8,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',transition:'background 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.055)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                      {/* Estimator avatar */}
                      {(() => {
                        const pal = avatarPalette(sr.estimator||'');
                        const estCode = EST_ROSTER.find(e=>e.name===sr.estimator)?.code;
                        const photoUrl = AVATAR_URLS[estCode];
                        return (
                          <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:photoUrl?'transparent':pal.bg,border:`1.5px solid ${pal.ring}`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',fontSize:'0.62rem',fontWeight:700,color:pal.fg}}>
                            {photoUrl ? <img src={photoUrl} alt={sr.estimator} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : (sr.estimator||'?').charAt(0).toUpperCase()}
                          </div>
                        );
                      })()}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:3}}>
                          <span style={{fontSize:'0.74rem',fontWeight:700,color:'rgba(255,255,255,0.75)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sr.proj||sr.id}</span>
                          <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.30)'}}>·</span>
                          <span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.38)'}}>{sr.client}</span>
                          <span style={{marginLeft:'auto',fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',flexShrink:0}}>{srDate}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
                          {sr.estimator && <span style={{fontSize:'0.60rem',color:'rgba(100,200,255,0.65)',fontWeight:500}}>Est: {sr.estimator}</span>}
                          {sr.revisedMargin && <span style={{fontSize:'0.60rem',color:'rgba(0,220,255,0.55)',fontFamily:'monospace'}}>{sr.revisedMargin}% margin</span>}
                          {sr.totalAmt && <span style={{fontSize:'0.60rem',color:'rgba(0,220,130,0.55)',fontFamily:'monospace'}}>{sr.totalAmt} AED</span>}
                          <span style={{fontSize:'0.54rem',fontWeight:700,padding:'1px 7px',borderRadius:4,
                            background:sr.directorAction==='approved'?'rgba(0,220,130,0.10)':'rgba(255,255,255,0.05)',
                            color:sr.directorAction==='approved'?'rgba(0,220,130,0.75)':'rgba(255,255,255,0.30)',
                            border:`1px solid ${sr.directorAction==='approved'?'rgba(0,220,130,0.22)':'rgba(255,255,255,0.08)'}`
                          }}>{sr.reqStatus==='completed'?'Completed':'Approved'}</span>
                        </div>
                        {/* Similar request docs */}
                        {(sr.estimationDocs?.length > 0 || sr.estimationDoc) && (
                          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:5}}>
                            {(sr.estimationDocs?.length > 0 ? sr.estimationDocs : [sr.estimationDoc]).filter(Boolean).slice(0,3).map((d,di)=>(
                              <button key={di} onClick={()=>downloadDoc(d)}
                                style={{fontSize:'0.60rem',color:'rgba(52,211,153,0.75)',background:'rgba(0,160,80,0.07)',border:'1px solid rgba(52,211,153,0.18)',borderRadius:5,padding:'2px 8px',cursor:'pointer',outline:'none',fontFamily:F,fontWeight:600,display:'flex',alignItems:'center',gap:4}}>
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                {d.name||`doc-${di+1}`}
                              </button>
                            ))}
                            {(sr.estimationDocs?.length||0) > 3 && <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.25)'}}>+{sr.estimationDocs.length-3} more</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GC>
          )}

          {/* ── Footer buttons ── */}
          {submitted ? (
            /* ── Confirmation banner after submit ── */
            <div style={{display:'flex',flexDirection:'column',gap:10,paddingTop:4}}>
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',borderRadius:10,background:'rgba(0,220,130,0.08)',border:'1px solid rgba(0,220,130,0.30)'}}>
                <span style={{fontSize:'1.3rem'}}>✓</span>
                <div>
                  <div style={{fontSize:'0.84rem',fontWeight:700,color:'rgba(0,230,150,0.95)',marginBottom:2}}>Response Submitted</div>
                  <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.45)'}}>
                    Decision: <strong style={{color:'rgba(255,255,255,0.70)'}}>{ACTIONS.find(a=>a.v===action)?.label}</strong>
                    {note && <> · Note recorded</>}
                  </div>
                </div>
              </div>
              <button onClick={onClose}
                style={{padding:'11px 0',borderRadius:10,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.60)',fontFamily:F,fontSize:'0.85rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.10)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>Close</button>
            </div>
          ) : (
            <div style={{display:'flex',gap:10,paddingTop:4}}>
              <button onClick={onClose}
                style={{flex:1,padding:'12px 0',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.38)',fontFamily:F,fontSize:'0.85rem',fontWeight:600,cursor:'pointer',outline:'none',backdropFilter:'blur(8px)',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}>Cancel</button>
              <button onClick={submit} disabled={!action}
                style={{flex:2,padding:'12px 0',borderRadius:10,background:action?'linear-gradient(105deg,#0f0c3a,#1e40af 35%,#6d28d9 65%,#00e5ff)':'rgba(255,255,255,0.04)',backgroundSize:'220% 220%',animation:action?'auroraShift 5s ease-in-out infinite':'none',border:action?'1px solid rgba(0,220,255,0.25)':'1px solid rgba(255,255,255,0.06)',color:action?'#fff':'rgba(255,255,255,0.22)',fontFamily:F,fontSize:'0.9rem',fontWeight:700,cursor:action?'pointer':'not-allowed',outline:'none',boxShadow:action?'0 0 24px rgba(0,180,255,0.18)':'none',transition:'box-shadow 0.3s'}}>
                Submit Response
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ─── DOC UPLOAD OVERLAY (Gmail-style per-file progress) ────────────────────
const DocUploadOverlay = ({ items, onRetry, onSkip, title = 'Uploading Documents to Azure' }) => {
  const F = "'Inter',sans-serif";
  const allDone   = items.every(i => i.status === 'done');
  const anyActive = items.some(i => i.status === 'uploading');
  const done      = items.filter(i => i.status === 'done').length;
  const total     = items.length;
  const pct       = Math.round((done / total) * 100);
  const fmt = b => b < 1048576 ? `${(b/1024).toFixed(0)} KB` : `${(b/1024/1024).toFixed(1)} MB`;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(2,1,12,0.97)', backdropFilter:'blur(24px)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      fontFamily:F,
    }}>
      <style>{`
        @keyframes dup-bar  { 0%{left:-45%;width:45%} 100%{left:110%;width:45%} }
        @keyframes dup-spin { to{transform:rotate(360deg)} }
        @keyframes dup-pop  { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <div style={{ width:'min(500px,92vw)', display:'flex', flexDirection:'column', gap:20 }}>

        {/* Header */}
        <div style={{ textAlign:'center' }}>
          <div style={{
            fontSize:'0.52rem', letterSpacing:'0.24em', textTransform:'uppercase',
            color:'rgba(0,200,255,0.50)', marginBottom:8, fontWeight:700,
          }}>NAFFCO · AZURE DOCUMENT STORAGE</div>
          <h2 style={{
            fontSize:'1.5rem', fontWeight:800, margin:0, letterSpacing:'0.03em',
            background: allDone
              ? 'linear-gradient(105deg,#00e5ff,#00cc77)'
              : 'linear-gradient(105deg,#0099ff,#a855f7)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          }}>
            {allDone ? '✓ All Documents Secured' : title}
          </h2>
          {!allDone && (
            <p style={{ fontSize:'0.76rem', color:'rgba(255,255,255,0.32)', margin:'6px 0 0', lineHeight:1.6 }}>
              Keep this window open while files are uploading.
            </p>
          )}
          {allDone && (
            <p style={{ fontSize:'0.76rem', color:'rgba(0,220,130,0.65)', margin:'6px 0 0' }}>
              ✓ {done} file{done!==1?'s':''} verified on Azure — proceeding…
            </p>
          )}
        </div>

        {/* Overall progress bar */}
        {!allDone && (
          <div>
            <div style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              marginBottom:6, fontFamily:F,
            }}>
              <span style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.35)' }}>
                {done} of {total} uploaded
              </span>
              <span style={{ fontSize:'0.72rem', fontWeight:700, color:'rgba(0,200,255,0.85)', fontFamily:'monospace' }}>
                {pct}%
              </span>
            </div>
            <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:4, overflow:'hidden', position:'relative' }}>
              <div style={{
                position:'absolute', height:'100%',
                background:'linear-gradient(90deg,rgba(0,150,255,0.80),rgba(100,80,255,0.80))',
                borderRadius:4, transition:'width 0.4s ease',
                width:`${pct}%`,
              }}/>
              {anyActive && (
                <div style={{
                  position:'absolute', height:'100%', width:'45%',
                  background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.20),transparent)',
                  animation:'dup-bar 1.4s ease-in-out infinite',
                }}/>
              )}
            </div>
          </div>
        )}

        {/* Per-file list — Gmail style */}
        <div style={{
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:14, overflow:'hidden',
          maxHeight:320, overflowY:'auto',
          scrollbarWidth:'thin', scrollbarColor:'rgba(255,255,255,0.08) transparent',
        }}>
          {items.map((item, i) => {
            const pctFile = item.status === 'done' ? 100
              : item.status === 'uploading' ? (item.progress || 50)
              : 0;
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'13px 18px',
                borderBottom: i < items.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: item.status==='done'
                  ? 'rgba(0,200,100,0.04)'
                  : 'transparent',
                transition:'background 0.3s',
              }}>
                {/* Status icon */}
                <div style={{
                  flexShrink:0, width:32, height:32, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: item.status==='done'
                    ? 'rgba(0,200,100,0.15)'
                    : item.status==='uploading'
                    ? 'rgba(0,150,255,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  border:`1px solid ${item.status==='done'
                    ? 'rgba(0,200,100,0.40)'
                    : item.status==='uploading'
                    ? 'rgba(0,150,255,0.35)'
                    : 'rgba(255,255,255,0.08)'}`,
                  animation: item.status==='done' ? 'dup-pop 0.35s ease both' : 'none',
                }}>
                  {item.status==='done' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(0,220,120,0.95)" strokeWidth="2.8" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {item.status==='uploading' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(0,180,255,0.95)" strokeWidth="2.2" strokeLinecap="round"
                      style={{ animation:'dup-spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                  )}
                  {item.status==='pending' && (
                    <div style={{ width:8, height:8, borderRadius:'50%', background:'rgba(255,255,255,0.20)' }}/>
                  )}
                </div>

                {/* File info + progress */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{
                    fontSize:'0.82rem', fontWeight:600,
                    color:'rgba(255,255,255,0.88)',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                    marginBottom:4,
                  }}>{item.name}</div>

                  <div style={{
                    display:'flex', alignItems:'center',
                    justifyContent:'space-between', gap:8, marginBottom:4,
                  }}>
                    <span style={{
                      fontSize:'0.62rem',
                      color: item.status==='done'
                        ? 'rgba(0,200,130,0.65)'
                        : item.status==='uploading'
                        ? 'rgba(0,180,255,0.65)'
                        : 'rgba(255,255,255,0.28)',
                    }}>
                      {item.size ? fmt(item.size) + ' · ' : ''}
                      {item.status==='done'
                        ? '✓ Secured on Azure'
                        : item.status==='uploading'
                        ? 'Uploading to Azure…'
                        : 'Queued'}
                    </span>
                    {item.status==='done' && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(0,200,255,0.45)" strokeWidth="1.8">
                        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
                      </svg>
                    )}
                  </div>

                  {/* Per-file progress bar */}
                  {(item.status === 'uploading' || item.status === 'done') && (
                    <div style={{
                      height:3, borderRadius:2,
                      background:'rgba(255,255,255,0.08)', overflow:'hidden',
                      position:'relative',
                    }}>
                      <div style={{
                        position:'absolute', height:'100%',
                        background: item.status==='done'
                          ? 'rgba(0,220,130,0.75)'
                          : 'rgba(0,180,255,0.75)',
                        borderRadius:2,
                        width:`${pctFile}%`,
                        transition:'width 0.3s ease',
                        boxShadow: item.status==='done'
                          ? '0 0 6px rgba(0,200,130,0.50)'
                          : '0 0 6px rgba(0,180,255,0.50)',
                      }}/>
                      {item.status==='uploading' && (
                        <div style={{
                          position:'absolute', height:'100%', width:'40%',
                          background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)',
                          animation:'dup-bar 1.2s ease-in-out infinite',
                        }}/>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No error UI — uploads retry silently */}
      </div>
    </div>
  );
};

// ─── ESTIMATION REQUEST OVERVIEW ─────────────────────────────────────────────
const EstRequestOverview = ({ requests, embedded=false }) => {
  const F = "'Inter',sans-serif";

  // Active / pending only — exclude completed, approved, rejected, out-of-scope
  const active = (requests || []).filter(r => {
    if (!r) return false;
    if (r.reqStatus === 'completed') return false;
    if (r.reqStatus === 'out-of-scope') return false;
    if (r.reqStatus === 'cancelled') return false;
    if (r.directorAction === 'approved') return false;
    if (r.directorAction === 'rejected') return false;
    return true;
  });

  // Group by deal type
  const dealGroups = {};
  active.forEach(r => {
    const deal = r.deal || 'Other';
    if (!dealGroups[deal]) dealGroups[deal] = [];
    dealGroups[deal].push(r);
  });

  const DEAL_ORDER = ['Job In Hand', 'Tender', 'Budget', 'Other'];
  const sortedDeals = [
    ...DEAL_ORDER.filter(d => dealGroups[d]),
    ...Object.keys(dealGroups).filter(d => !DEAL_ORDER.includes(d)),
  ];

  // Per-deal: group by estimator (or "Unassigned")
  const getEstGroups = (reqs) => {
    const map = {};
    reqs.forEach(r => {
      const est = r.estimator || 'Unassigned';
      if (!map[est]) map[est] = [];
      map[est].push(r);
    });
    // Sort: named estimators first (alphabetical), Unassigned last
    const entries = Object.entries(map).sort(([a], [b]) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    });
    return entries;
  };

  // Open / active request cards — unified single blue tone
  const OPEN_BLUE = { accent: 'rgba(96,165,255,0.92)', border: 'rgba(80,150,255,0.30)', bg: 'rgba(40,100,220,0.07)' };
  const dealColor = () => OPEN_BLUE;

  // Master-detail: selected estimator (within a deal) → shows their requests in the right panel
  const [sel, setSel] = useState(null); // { deal, est } | null
  const selReqs = sel ? (dealGroups[sel.deal] || []).filter(r => (r.estimator || 'Unassigned') === sel.est) : [];

  // Resizable split between OPEN (top) and CLOSED (bottom) sections
  const [openPct, setOpenPct] = useState(52);
  const splitDragRef = useRef(false);
  const splitAreaRef = useRef(null);
  const onSplitDown = (e) => {
    e.preventDefault();
    splitDragRef.current = true;
    const move = (ev) => {
      if (!splitDragRef.current || !splitAreaRef.current) return;
      const rect = splitAreaRef.current.getBoundingClientRect();
      const pct = ((ev.clientY - rect.top) / rect.height) * 100;
      setOpenPct(Math.min(80, Math.max(20, pct)));
    };
    const up = () => { splitDragRef.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const reqStatusLabel = (r) => {
    if (r.reqStatus === 'completed' || r.directorAction === 'approved') return 'Approved';
    if (r.reqStatus === 'out-of-scope') return 'Cancelled';
    if (r.reqStatus === 'rfi') return 'RFI';
    if (r.reqStatus === 'pending-director') return 'Awaiting Director';
    if (r.reqStatus === 'inprogress') return 'In Progress';
    return r.status || 'Pending';
  };

  return (
    <div style={{
      position:'relative', width:'100%', height:'100%',
      padding:`${embedded?16:72}px 28px 28px`, fontFamily:F, color:'#e2e8f0', overflow:'hidden',
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <p style={{fontSize:'0.52rem',letterSpacing:'0.22em',textTransform:'uppercase',
          color:'rgba(100,180,255,0.60)',marginBottom:4,fontWeight:700}}>NAFFCO · AI SYSTEM</p>
        <h2 style={{fontSize:'1.3rem',fontWeight:800,color:'rgba(255,255,255,0.92)',margin:0}}>
          Estimation Request Overview
        </h2>
        <p style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.32)',marginTop:4}}>
          Active &amp; pending requests only — {active.length} total
        </p>
      </div>

      {/* Summary chips */}
      <div style={{display:'flex',gap:10,marginBottom:28,flexWrap:'wrap'}}>
        {sortedDeals.map(deal => {
          const c = dealColor(deal);
          return (
            <div key={deal} style={{display:'flex',alignItems:'center',gap:10,
              background:c.bg, border:`1px solid ${c.border}`,
              borderRadius:10, padding:'8px 18px'}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:c.accent,flexShrink:0,boxShadow:`0 0 6px ${c.accent}`}}/>
              <span style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(255,255,255,0.70)',letterSpacing:'0.04em'}}>{deal}</span>
              <span style={{fontSize:'1.1rem',fontWeight:800,color:c.accent,lineHeight:1}}>{dealGroups[deal].length}</span>
            </div>
          );
        })}
        <div style={{display:'flex',alignItems:'center',gap:10,
          background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',
          borderRadius:10,padding:'8px 18px'}}>
          <span style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(255,255,255,0.40)',letterSpacing:'0.04em'}}>Total Active</span>
          <span style={{fontSize:'1.1rem',fontWeight:800,color:'rgba(255,255,255,0.80)',lineHeight:1}}>{active.length}</span>
        </div>
      </div>

      {/* ── Resizable split: OPEN (top) | CLOSED (bottom) ── */}
      <div ref={splitAreaRef} style={{flex:1, minHeight:0, display:'flex', flexDirection:'column', overflow:'hidden'}}>

      {/* ── Draggable running-color divider between OPEN (active) and CLOSED ── */}
      <div onMouseDown={onSplitDown} title="Drag to resize"
        style={{order:2, margin:'8px 0', height:14, flexShrink:0, cursor:'row-resize',
          position:'relative', display:'flex', alignItems:'center'}}>
        <div style={{height:3, width:'100%', borderRadius:3, overflow:'hidden',
          background:'linear-gradient(90deg,#00e5ff,#4f46e5,#7c3aed,#a855f7,#ec4899,#f59e0b,#10b981,#00e5ff)',
          backgroundSize:'300% 100%', animation:'auroraShift 4s linear infinite',
          boxShadow:'0 0 14px rgba(124,58,237,0.55)'}}/>
        <div style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
          width:48, height:5, borderRadius:3, background:'rgba(255,255,255,0.45)',
          boxShadow:'0 0 6px rgba(0,0,0,0.6)'}}/>
      </div>

      {/* ── Quotation Closed Stats ── */}
      {(() => {
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);

        // Start of current week (Monday)
        const dow = now.getDay(); // 0=Sun
        const diffToMon = (dow === 0 ? -6 : 1 - dow);
        const thisWeekStart = new Date(now); thisWeekStart.setDate(now.getDate() + diffToMon); thisWeekStart.setHours(0,0,0,0);
        const thisWeekEnd   = new Date(thisWeekStart); thisWeekEnd.setDate(thisWeekStart.getDate() + 6); thisWeekEnd.setHours(23,59,59,999);

        // Previous week
        const prevWeekStart = new Date(thisWeekStart); prevWeekStart.setDate(thisWeekStart.getDate() - 7);
        const prevWeekEnd   = new Date(thisWeekStart); prevWeekEnd.setDate(thisWeekStart.getDate() - 1); prevWeekEnd.setHours(23,59,59,999);

        // Start of current month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const allReqs = requests || [];
        const closed = allReqs.filter(r => r && (r.reqStatus === 'completed' || r.directorAction === 'approved'));

        const getClosedIn = (from, to) =>
          closed.filter(r => {
            const ts = r.directorRespondedAt || r.approvedAt;
            if (!ts) return false;
            const d = new Date(ts);
            return d >= from && d <= to;
          });

        const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
        const todayEnd   = new Date(now); todayEnd.setHours(23,59,59,999);

        // Previous (yesterday) day
        const yestStart = new Date(todayStart); yestStart.setDate(todayStart.getDate() - 1);
        const yestEnd   = new Date(todayEnd);   yestEnd.setDate(todayEnd.getDate() - 1);

        // All closed cards share a single navy-blue tone
        const NAVY = { accent: 'rgba(120,160,255,0.95)', border: 'rgba(50,80,190,0.38)', bg: 'rgba(24,42,120,0.14)' };
        const periods = [
          { label: 'Closed Today',         ...NAVY, items: getClosedIn(todayStart, todayEnd) },
          { label: 'Closed Previous Day',  ...NAVY, items: getClosedIn(yestStart, yestEnd) },
          { label: 'Closed This Week',     ...NAVY, items: getClosedIn(thisWeekStart, thisWeekEnd) },
          { label: 'Closed Previous Week', ...NAVY, items: getClosedIn(prevWeekStart, prevWeekEnd) },
          { label: 'Closed This Month',    ...NAVY, items: getClosedIn(monthStart, monthEnd) },
        ];

        // Aggregate by estimator name within a list of requests
        const byWho = (items) => {
          const map = {};
          items.forEach(r => {
            const name = r.estimator || r.salesPerson || 'Unknown';
            map[name] = (map[name] || 0) + 1;
          });
          return Object.entries(map).sort((a, b) => b[1] - a[1]);
        };

        // Daily closures — last 7 days as cards, last 14 days for the trend graph
        const dayCell = (offset) => {
          const s = new Date(now); s.setHours(0,0,0,0); s.setDate(s.getDate() - offset);
          const e = new Date(s); e.setHours(23,59,59,999);
          return { date:s, count:getClosedIn(s,e).length };
        };
        const TREND_DAYS = 30;
        const trendDays = Array.from({length:TREND_DAYS}, (_,i)=>dayCell(TREND_DAYS-1-i));   // oldest → today
        const trendMax = Math.max(1, ...trendDays.map(d=>d.count));
        const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

        return (
          <div style={{order:3, flex:1, minHeight:0, overflowY:'auto', paddingRight:4}}>
            <p style={{fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',
              color:'rgba(120,160,255,0.55)',fontWeight:700,marginBottom:12}}>
              QUOTATION CLOSED
            </p>

            {/* ── Daily closures + animated trend graph ── */}
            <style>{`@keyframes ovGrowBar{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}`}</style>
            <div style={{display:'flex',gap:12,marginBottom:18,flexWrap:'wrap',alignItems:'stretch'}}>
              {/* Animated daily trend graph */}
              <div style={{flex:1, minWidth:300, padding:'10px 16px 8px', borderRadius:12,
                background:'rgba(8,4,28,0.70)', border:'1px solid rgba(99,102,241,0.22)',
                backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
                display:'flex', flexDirection:'column'}}>
                <span style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',
                  color:'rgba(120,160,255,0.80)',fontWeight:700,marginBottom:8}}>Daily Trend · Last {TREND_DAYS} Days</span>
                <div style={{flex:1,display:'flex',alignItems:'flex-end',gap:1.5,minHeight:128}}>
                  {trendDays.map((d,i)=>{
                    const h = (d.count/trendMax)*100;
                    const isToday = i===trendDays.length-1;
                    return (
                      <div key={i} title={`${WD[d.date.getDay()]} ${d.date.getDate()} — ${d.count} closed`}
                        style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',gap:2,height:'100%'}}>
                        <span style={{fontSize:'0.44rem',fontWeight:700,
                          color:isToday?'rgba(150,190,255,0.95)':'rgba(255,255,255,0.45)'}}>{d.count||''}</span>
                        <div style={{width:'100%',height:`${Math.max(h, d.count?6:0)}%`,minHeight:d.count?4:0,
                          borderRadius:'2px 2px 0 0', transformOrigin:'bottom',
                          background:isToday
                            ? 'linear-gradient(180deg,rgba(150,190,255,0.98),rgba(50,80,190,0.35))'
                            : 'linear-gradient(180deg,rgba(96,140,255,0.88),rgba(50,80,190,0.22))',
                          animation:`ovGrowBar 0.55s cubic-bezier(0.22,1,0.36,1) ${i*0.025}s both`}}/>
                        <span style={{fontSize:'0.40rem',color:'rgba(255,255,255,0.32)',whiteSpace:'nowrap'}}>{d.date.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
              {periods.map(({ label, accent, border, bg, items }) => {
                const who = byWho(items);
                return (
                  <div key={label} style={{
                    background:'rgba(8,4,28,0.70)',
                    border:`1px solid ${border}`,
                    borderRadius:14, overflow:'hidden',
                    backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
                    boxShadow:`0 4px 20px rgba(0,0,0,0.28), inset 0 0 0 1px ${border}`,
                  }}>
                    {/* Card header */}
                    <div style={{
                      padding:'12px 16px 10px',
                      background:`linear-gradient(90deg,${bg},transparent)`,
                      borderBottom:`1px solid ${border}`,
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                    }}>
                      <span style={{fontSize:'0.70rem',fontWeight:700,color:'rgba(255,255,255,0.75)',letterSpacing:'0.03em'}}>{label}</span>
                      <span style={{
                        fontSize:'1.45rem', fontWeight:800, color:accent, lineHeight:1,
                        textShadow:`0 0 12px ${accent}`,
                      }}>{items.length}</span>
                    </div>

                    {/* Who list */}
                    <div style={{padding:'8px 0', minHeight:48}}>
                      {who.length === 0 ? (
                        <p style={{textAlign:'center',fontSize:'0.68rem',color:'rgba(255,255,255,0.18)',
                          padding:'10px 0',fontStyle:'italic',margin:0}}>No closures</p>
                      ) : who.map(([name, cnt]) => {
                        const estCode = Object.entries(STAFF_NAMES).find(([,v]) => v === name)?.[0] || '';
                        return (
                          <div key={name} style={{
                            display:'flex', alignItems:'center', gap:10,
                            padding:'7px 16px',
                            borderBottom:'1px solid rgba(255,255,255,0.04)',
                            transition:'background 0.12s',
                          }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          >
                            <EstAvatar name={name} code={estCode} size={26}/>
                            <span style={{flex:1,fontSize:'0.74rem',fontWeight:600,
                              color:'rgba(255,255,255,0.78)',
                              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{name}</span>
                            <span style={{fontSize:'0.88rem',fontWeight:800,color:accent,flexShrink:0}}>{cnt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* OPEN/ACTIVE requests — master (deal cards w/ clickable estimators) | detail (right table) */}
      <div style={{order:1, height:`${openPct}%`, flexShrink:0, minHeight:0, display:'flex', gap:16, overflow:'hidden'}}>
        {/* LEFT: deal cards */}
        <div style={{flex:1, minWidth:0, overflowY:'auto', paddingRight:4,
          display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20, alignContent:'start'}}>
        {sortedDeals.map(deal => {
          const reqs = dealGroups[deal];
          const estRows = getEstGroups(reqs);
          const c = dealColor(deal);
          return (
            <div key={deal} style={{
              background:'rgba(12,6,32,0.65)',
              border:`1px solid ${c.border}`,
              borderRadius:16, overflow:'hidden',
              backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
              boxShadow:`0 4px 24px rgba(0,0,0,0.28), 0 0 0 1px ${c.border} inset`,
            }}>
              {/* Deal header */}
              <div style={{
                padding:'14px 20px',
                background:`linear-gradient(90deg,${c.bg},transparent)`,
                borderBottom:`1px solid ${c.border}`,
                display:'flex',alignItems:'center',justifyContent:'space-between',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{width:10,height:10,borderRadius:'50%',background:c.accent,
                    boxShadow:`0 0 8px ${c.accent}`,flexShrink:0}}/>
                  <span style={{fontSize:'0.88rem',fontWeight:800,color:'rgba(255,255,255,0.90)',letterSpacing:'0.03em'}}>{deal}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:6,
                  background:c.bg, border:`1px solid ${c.border}`,
                  borderRadius:20, padding:'3px 12px'}}>
                  <span style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',color:c.accent,fontWeight:700}}>Total</span>
                  <span style={{fontSize:'1.0rem',fontWeight:800,color:c.accent,lineHeight:1}}>{reqs.length}</span>
                </div>
              </div>

              {/* Estimator rows */}
              <div style={{padding:'10px 0'}}>
                {estRows.map(([estName, estReqs]) => {
                  const isUnassigned = estName === 'Unassigned';
                  const estCode = Object.entries(STAFF_NAMES).find(([,v]) => v === estName)?.[0] || '';
                  const pct = Math.round((estReqs.length / reqs.length) * 100);
                  const isSel = sel && sel.deal === deal && sel.est === estName;
                  return (
                    <div key={estName} style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'10px 20px', cursor:'pointer',
                      borderBottom:'1px solid rgba(255,255,255,0.04)',
                      borderLeft:`3px solid ${isSel ? c.accent : 'transparent'}`,
                      background: isSel ? 'rgba(96,165,255,0.12)' : 'transparent',
                      transition:'background 0.14s',
                    }}
                      onClick={()=>setSel(isSel ? null : { deal, est: estName })}
                      onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background='transparent'; }}
                    >
                      {/* Avatar */}
                      {isUnassigned ? (
                        <div style={{width:34,height:34,borderRadius:'50%',flexShrink:0,
                          background:'rgba(255,255,255,0.06)',border:'2px solid rgba(255,255,255,0.14)',
                          display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                          </svg>
                        </div>
                      ) : (
                        <EstAvatar name={estName} code={estCode} size={34}/>
                      )}

                      {/* Name + bar */}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
                          <span style={{
                            fontSize:'0.78rem', fontWeight: isUnassigned ? 500 : 700,
                            color: isUnassigned ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)',
                            fontStyle: isUnassigned ? 'italic' : 'normal',
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                          }}>{estName}</span>
                          <span style={{fontSize:'0.90rem',fontWeight:800,
                            color: isUnassigned ? 'rgba(255,255,255,0.40)' : c.accent,
                            marginLeft:8,flexShrink:0}}>{estReqs.length}</span>
                        </div>
                        {/* Progress bar */}
                        <div style={{height:3,borderRadius:2,background:'rgba(255,255,255,0.07)',overflow:'hidden'}}>
                          <div style={{
                            height:'100%', borderRadius:2,
                            width:`${pct}%`,
                            background: isUnassigned
                              ? 'rgba(255,255,255,0.18)'
                              : `linear-gradient(90deg,${c.accent},${c.accent.replace('0.90','0.55')})`,
                            transition:'width 0.5s ease',
                          }}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grand total footer */}
              <div style={{
                padding:'10px 20px',
                borderTop:'1px solid rgba(255,255,255,0.06)',
                display:'flex',alignItems:'center',justifyContent:'space-between',
                background:'rgba(255,255,255,0.02)',
              }}>
                <span style={{fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',
                  color:'rgba(255,255,255,0.35)'}}>Grand Total</span>
                <span style={{fontSize:'1.0rem',fontWeight:800,color:c.accent}}>{reqs.length}</span>
              </div>
            </div>
          );
        })}
        </div>{/* /LEFT grid */}

        {/* RIGHT: selected estimator detail table */}
        <div style={{width:360, flexShrink:0, borderRadius:14, overflow:'hidden',
          background:'#05030f', border:'1px solid rgba(80,150,255,0.20)',
          display:'flex', flexDirection:'column'}}>
          {!sel ? (
            <div style={{flex:1, background:'#000', display:'flex', alignItems:'center', justifyContent:'center',
              color:'rgba(255,255,255,0.25)', fontSize:'0.72rem', fontStyle:'italic', textAlign:'center', padding:20}}>
              Select an estimator to view their requests
            </div>
          ) : (
            <>
              <div style={{padding:'12px 14px', borderBottom:'1px solid rgba(80,150,255,0.20)',
                display:'flex', alignItems:'center', gap:10,
                background:'linear-gradient(90deg,rgba(40,100,220,0.12),transparent)'}}>
                {sel.est === 'Unassigned' ? (
                  <div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,background:'rgba(255,255,255,0.06)',border:'2px solid rgba(255,255,255,0.14)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                ) : (
                  <EstAvatar name={sel.est} code={Object.entries(STAFF_NAMES).find(([,v])=>v===sel.est)?.[0]||''} size={30}/>
                )}
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:'0.80rem',fontWeight:700,color:'rgba(255,255,255,0.92)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sel.est}</div>
                  <div style={{fontSize:'0.56rem',color:'rgba(150,180,255,0.70)',letterSpacing:'0.04em'}}>{sel.deal} · {selReqs.length} request{selReqs.length!==1?'s':''}</div>
                </div>
                <button onClick={()=>setSel(null)} title="Close"
                  style={{flexShrink:0,width:24,height:24,borderRadius:6,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:'0.8rem',lineHeight:1,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
              </div>
              <div style={{flex:1, overflowY:'auto'}}>
                {selReqs.length === 0 ? (
                  <p style={{textAlign:'center',color:'rgba(255,255,255,0.20)',fontSize:'0.7rem',fontStyle:'italic',padding:'24px 0'}}>No requests</p>
                ) : selReqs.map((r,idx)=>(
                  <div key={r.id||idx} style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{flex:1,minWidth:0,fontSize:'0.74rem',fontWeight:600,color:'rgba(255,255,255,0.88)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||r.client||'—'}</span>
                      <span style={{flexShrink:0,fontSize:'0.5rem',fontWeight:700,letterSpacing:'0.04em',textTransform:'uppercase',color:'rgba(150,180,255,0.85)',background:'rgba(40,100,220,0.14)',border:'1px solid rgba(80,150,255,0.25)',borderRadius:6,padding:'2px 6px'}}>{reqStatusLabel(r)}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4,fontSize:'0.6rem',color:'rgba(255,255,255,0.42)'}}>
                      <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.client||r.mainContractor||'—'}</span>
                      {r.date && <span style={{marginLeft:'auto',flexShrink:0}}>{r.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>{/* /RIGHT detail */}
      </div>{/* /OPEN pane */}

      </div>{/* /split area */}

      {active.length === 0 && (
        <div style={{textAlign:'center',padding:'60px 0',color:'rgba(255,255,255,0.22)'}}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{marginBottom:12,opacity:0.3}}><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          <p style={{fontSize:'0.90rem',margin:0}}>No active requests found.</p>
        </div>
      )}
    </div>
  );
};

// ─── COPY LINK BUTTON ─────────────────────────────────────────────────────────
const APP_ORIGIN = 'https://wonderful-flower-020202300.7.azurestaticapps.net';
const SP_DOCS_BASE = 'https://naffcogroup.sharepoint.com/sites/AI-APEX/Shared%20Documents/Estimation_Docs';

const appLink = id => `${APP_ORIGIN}/estimation-hub/estimation/${id}`;
const spLink  = id => `${SP_DOCS_BASE}/${id}`;

const CopyLinkBtn = ({ reqId, link: overrideLink, size = 'normal' }) => {
  const F2 = "'Inter',sans-serif";
  const [copied, setCopied] = useState(false);
  const url = overrideLink || appLink(reqId);
  const isSmall = size === 'small';
  return (
    <button
      title={`Copy shareable link\n${url}`}
      onClick={e=>{ e.stopPropagation(); navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1800); }); }}
      style={{background:copied?'rgba(52,211,153,0.10)':'transparent',border:copied?'1px solid rgba(52,211,153,0.28)':'1px solid transparent',cursor:'pointer',padding:isSmall?'2px 6px':'2px 8px',borderRadius:6,color:copied?'rgba(52,211,153,0.92)':'rgba(255,255,255,0.30)',transition:'all 0.2s',display:'flex',alignItems:'center',gap:3,fontSize:isSmall?'0.58rem':'0.72rem',fontFamily:F2,flexShrink:0}}
      onMouseEnter={e=>{ if(!copied){e.currentTarget.style.color='rgba(255,255,255,0.72)';e.currentTarget.style.borderColor='rgba(255,255,255,0.18)';} }}
      onMouseLeave={e=>{ if(!copied){e.currentTarget.style.color='rgba(255,255,255,0.30)';e.currentTarget.style.borderColor='transparent';} }}>
      {copied
        ? <><svg width={isSmall?9:11} height={isSmall?9:11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
        : <><svg width={isSmall?9:11} height={isSmall?9:11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>Copy Link</>
      }
    </button>
  );
};

const SpBtn = ({ reqId, link: overrideLink, size = 'normal' }) => {
  const F2 = "'Inter',sans-serif";
  const url = overrideLink || spLink(reqId);
  const isSmall = size === 'small';
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      title={`Open in SharePoint\n${url}`}
      onClick={e=>e.stopPropagation()}
      style={{background:'transparent',border:'1px solid transparent',cursor:'pointer',padding:isSmall?'2px 6px':'2px 8px',borderRadius:6,color:'rgba(0,180,255,0.38)',transition:'all 0.2s',display:'flex',alignItems:'center',gap:3,fontSize:isSmall?'0.58rem':'0.72rem',fontFamily:F2,flexShrink:0,textDecoration:'none'}}
      onMouseEnter={e=>{ e.currentTarget.style.color='rgba(0,200,255,0.85)';e.currentTarget.style.borderColor='rgba(0,180,255,0.22)';e.currentTarget.style.background='rgba(0,180,255,0.07)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.color='rgba(0,180,255,0.38)';e.currentTarget.style.borderColor='transparent';e.currentTarget.style.background='transparent'; }}>
      <svg width={isSmall?9:11} height={isSmall?9:11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      SharePoint
    </a>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({
  requests, onUpdate, onDelete, initialViewMode, onDirectTool,
  docUploadProgress, setDocUploadProgress, setPendingSubmit, retryDocUploads, pendingSubmit,
  onOverview, onOpenReqs, userCode='', isEmbedded=false,
  initialOpenId=null, onOpenChange=null,
}) => {
  const [open, setOpen] = useState(null);
  const _deepLinkApplied = useRef(false);
  useEffect(() => {
    if (_deepLinkApplied.current || !initialOpenId || !requests.length) return;
    const idx = requests.findIndex(r => r.id && r.id.toUpperCase() === initialOpenId.toUpperCase());
    if (idx !== -1) { setOpen(requests[idx].id); _deepLinkApplied.current = true; }
  }, [initialOpenId, requests]);
  const [reviewIdx, setReviewIdx] = useState(null);
  const [seenTs, setSeenTs] = useState(() => _getSeen());
  const markDashSeen = (reqId) => { _markSeen(reqId, 'sales'); setSeenTs(_getSeen()); };
  const [showDashAddPpl, setShowDashAddPpl] = useState(false);
  const [dashAddPplQ,    setDashAddPplQ]    = useState('');
  const dashAddPplRef = useRef(null);
  useEffect(() => {
    if (!showDashAddPpl) return;
    const close = e => { if (dashAddPplRef.current && !dashAddPplRef.current.contains(e.target)) { setShowDashAddPpl(false); setDashAddPplQ(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showDashAddPpl]);
  const [dsearch, setDsearch] = useState('');
  const [layoutView, setLayoutView] = useState('list'); // 'list' | 'cards'
  const [colFilters, setColFilters]   = useState({});   // per-column text filters
  const [colFilterOpen, setColFilterOpen] = useState(null); // key of open filter input
  const [sortCol, setSortCol] = useState(null);   // active sort column key
  const [sortDir, setSortDir] = useState('asc');  // 'asc' | 'desc'
  const [, setTick] = useState(0);
  const lockViewMode = !!initialViewMode; // hide view switcher when role is set externally
  const [viewMode, setViewMode] = useState(initialViewMode || 'requester'); // 'requester' | 'estimator' | 'director'
  const [requesterFilter, setRequesterFilter] = useState('');
  const [pinPrompt, setPinPrompt] = useState(null); // null | 'estimator' | 'director'
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);
  const [dirTab, setDirTab] = useState('history'); // 'history' | 'analysis'
  const [oosMode, setOosMode]     = useState(false);   // show OOS remark input
  const [oosRemark, setOosRemark] = useState('');       // draft remark
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashSection, setDashSection] = useState('list'); // 'list' | 'open' | 'overview'
  const [dashFilter, setDashFilter] = useState(() => {
    try {
      // When embedded via iframe, filter comes as URL param
      const urlFilter = new URLSearchParams(window.location.search).get('filter') || '';
      if (urlFilter) return urlFilter;
      const f = sessionStorage.getItem('apex_dash_filter')||''; sessionStorage.removeItem('apex_dash_filter'); return f;
    } catch { return ''; }
  });  // '' | 'new' | 'revise' | 'discount' | 'final' | 'out-of-scope'
  const [statusFilter, setStatusFilter] = useState('');   // '' | 'pending-estimation' | 'pending-approval' | 'unassigned' | 'rfi' | 'approved'
  const [pendingEstDealFilter, setPendingEstDealFilter] = useState(''); // '' | 'Job In Hand' | 'Tender'
  const [estTeamPage, setEstTeamPage] = useState(false);
  const [estTeamDetail, setEstTeamDetail] = useState(null); // {code,name} | null
  const [estTeamPin, setEstTeamPin] = useState('');
  const [estTeamPinErr, setEstTeamPinErr] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // realIdx to delete
  const [deleteCode, setDeleteCode] = useState('');          // must type 'xepa' to confirm
  const [convoInput, setConvoInput] = useState('');
  const [histOpen, setHistOpen] = useState(false);
  const [convoCollapsed, setConvoCollapsed] = useState(true);
  const [dirConvoOpen, setDirConvoOpen] = useState(false);  // Conversation panel expanded
  const [dirAiOpen, setDirAiOpen] = useState(true);         // AI Suggestions panel expanded
  const [colLeftW, setColLeftW] = useState(380);
  const [colRightW, setColRightW] = useState(420);

  // Auto-expand conversation when request has messages, collapse when empty
  useEffect(() => {
    if (open !== null && requests.find(r => r.id === open)) {
      const hasMessages = (requests.find(r => r.id === open)?.conversation || []).length > 0;
      setConvoCollapsed(!hasMessages);
      setDirConvoOpen(hasMessages);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drag-to-resize column handler
  const startColDrag = (which, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = which === 'left' ? colLeftW : colRightW;
    const onMove = ev => {
      const dx = ev.clientX - startX;
      if (which === 'left') setColLeftW(Math.max(220, Math.min(540, startW + dx)));
      else setColRightW(Math.max(220, Math.min(560, startW - dx)));
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  const [dirEditMode, setDirEditMode] = useState(false);    // Cost-Artist editable fields
  const [dirConvoMsg, setDirConvoMsg] = useState('');       // Cost-Artist message input
  const [reassignField, setReassignField] = useState(null); // 'estimator' | 'salesPerson' | null
  const [reassignValue, setReassignValue] = useState('');
  const [resubmitToast, setResubmitToast] = useState(false);
  const [quotUploadState, setQuotUploadState] = useState(null);    // null | 'uploading' | 'error'
  const [toolUploadState, setToolUploadState] = useState(null);    // null | 'uploading' | 'error'
  const [dirDocUploadState, setDirDocUploadState] = useState(null); // null | 'uploading' | 'error'

  const PIN = { estimator: 'EST', director: 'star' };
  const requestViewSwitch = (mode) => {
    if (mode === 'requester' || mode === 'kpi') { setViewMode(mode); return; }
    setPinValue(''); setPinError(false); setPinPrompt(mode);
  };
  const confirmPin = () => {
    if (pinValue.trim().toUpperCase() === PIN[pinPrompt].toUpperCase()) { setViewMode(pinPrompt); setPinPrompt(null); }
    else { setPinError(true); setPinValue(''); }
  };
  const uploadRef = useRef();
  const toolUploadRef = useRef();
  const dirDocUploadRef = useRef();
  const now = Date.now();

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const req = open !== null ? requests.find(r => r.id === open) : null;

  const handleEstimatorUpload = async (e) => {
    if (!e.target.files?.length || !req?.id) return;
    const files = Array.from(e.target.files);
    e.target.value = '';
    setQuotUploadState('uploading');
    const newDocs = [];
    for (const file of files) {
      const safeFn = file.name.replace(/[#?&=%\s]/g, '_');
      const customName = `quotation-${safeFn}`;
      const spUrl = await uploadToSharePoint(file, req.id, customName);
      newDocs.push({
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        name: customName,
        type: file.type,
        url: spUrl || null,
        verified: !!spUrl,
      });
    }
    const existing = req.estimationDocs || (req.estimationDoc ? [req.estimationDoc] : []);
    const allDocs = [...existing, ...newDocs];
    onUpdate(req.id, {
      estimationFile: allDocs[allDocs.length - 1].name,
      estimationDoc: allDocs[allDocs.length - 1],
      estimationDocs: allDocs,
      status: 'Pending Approval',
      reqStatus: 'pending-director',
      directorAction: null,
      directorNote: '',
      directorRespondedAt: null,
      directorSubmitted: false,
      _immediate: true,
    });
    setTimeout(() => setQuotUploadState(null), 800);
  };

  const handleEstimatorDeleteDoc = async (idx) => {
    const existing = req.estimationDocs || (req.estimationDoc ? [req.estimationDoc] : []);
    const toDelete = existing[idx];
    if (toDelete?.url) {
      // File is on SharePoint — server-side lifecycle; no client-side delete needed
    }
    const updated = existing.filter((_, i) => i !== idx);
    onUpdate(req.id, {
      estimationDocs: updated,
      estimationDoc: updated.length ? updated[updated.length - 1] : null,
      estimationFile: updated.length ? updated[updated.length - 1].name : null,
      _immediate: true,
    });
  };

  const handleToolDocUpload = async (e) => {
    if (!e.target.files?.length || !req?.id) return;
    const files = Array.from(e.target.files);
    e.target.value = '';
    setToolUploadState('uploading');
    const newDocs = [];
    for (const file of files) {
      const safeFn = file.name.replace(/[#?&=%\s]/g, '_');
      const customName = `tool-${safeFn}`;
      const spUrl = await uploadToSharePoint(file, req.id, customName);
      const verified = spUrl ? await verifyFileUrl(spUrl) : false;
      newDocs.push({
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        name: customName,
        type: file.type,
        url: spUrl || null,
        verified,
      });
    }
    const existing = req.toolDocs || [];
    onUpdate(req.id, { toolDocs: [...existing, ...newDocs], _immediate: true });
    setTimeout(() => setToolUploadState(null), 800);
  };

  const handleToolDocDelete = async (idx) => {
    const existing = req.toolDocs || [];
    const toDelete = existing[idx];
    if (toDelete?.url) {
      // File is on SharePoint — server-side lifecycle; no client-side delete needed
    }
    const updated = existing.filter((_, i) => i !== idx);
    onUpdate(req.id, { toolDocs: updated, _immediate: true });
  };

  // ── Detail view ──
  if (open !== null && req) {
    const rs = getReqStatus(req, now);
    const rss = REQ_STATUS_STYLE[rs];


    const tatElapsedDash = req.taggedAt ? now - req.taggedAt : 0;
    const tatPctDash = Math.min(100, (tatElapsedDash / TAT_MS) * 100);
    const tatBarColor = tatPctDash >= 100 ? '#ff4d4d' : tatPctDash >= 75 ? '#ff7a30' : tatPctDash >= 50 ? '#ffb347' : '#00e5ff';
    const tagDate = req.taggedAt ? new Date(req.taggedAt).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
    const isRejected = req.directorAction === 'rejected';
    const isResubmission = req.directorAction === 'revised';
    const isOutOfScope = req.reqStatus === 'out-of-scope';
    const isRFI = req.reqStatus === 'rfi';
    const minFiles = 1;
    const allDocsVerified = (req.estimationDocs || []).length >= minFiles && (req.estimationDocs || []).every(d => d.verified !== false);
    const canSendToDirector = allDocsVerified && !!req.projValue && req.reqStatus !== 'pending-director' && req.reqStatus !== 'completed' && !isOutOfScope && !isRFI;
    const DL = (t) => <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:5,fontWeight:600}}>{t}</div>;
    const DV = (v,c='rgba(255,255,255,0.85)') => <div style={{fontSize:'0.82rem',fontWeight:600,color:c,lineHeight:1.4}}>{v||'—'}</div>;
    const GCard = ({children,accent='rgba(255,255,255,0.05)',border='rgba(255,255,255,0.09)',style:sx={}}) => (
      <div style={{background:accent,border:`1px solid ${border}`,borderRadius:10,padding:'12px 16px',backdropFilter:'blur(10px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)',...sx}}>{children}</div>
    );
    const F2 = "'Inter',sans-serif";

    const rankLabels = ['','Bronze','Silver','Gold','Platinum','Diamond'];
    const infoRows = [
      [req.id,                                                                    'ID'],
      [req.submittedBy||'—',                                                      'Submitted By'],
      [req.salesPerson||'—',                                                      'Sales Person'],
      [req.proj||'—',                                                             'Project'],
      [req.client||'—',                                                           'Client / Grantor'],
      [req.customerRank>0?rankLabels[req.customerRank]+' ('+req.customerRank+'★)':'—', 'Customer Rank'],
      [req.mainContractor||'—',                                                   'Main Contractor'],
      [req.consultant||'—',                                                       'Consultant'],
      [req.deal||'—',                                                             'Deal Type'],
      [req.supplyOnly?'Supply Only':req.supplyInstall?'Supply & Install':'—',     'Supply'],
      [req.email||'—',                                                            'Email'],
      [req.mob||'—',                                                              'MOB'],
      [req.tel||'—',                                                              'Tel'],
      [req.leadTime||'—',                                                         'Lead Time'],
      [req.address||'—',                                                          'Address'],
      [req.remarks||'—',                                                          'Remarks'],
      [req.date||'—',                                                             'Submitted'],
    ];

    return (
      <div className="dash-detail-wrap" style={{position:'fixed',inset:'58px 0 0 0',display:'flex',flexDirection:'column',overflowY:'hidden',animation:'fadeUp 0.4s ease both',background:'rgba(6,3,18,0.96)',backdropFilter:'blur(20px) saturate(1.4)',WebkitBackdropFilter:'blur(20px) saturate(1.4)',zIndex:10}}>

        {/* ── Role watermark — top right ── */}
        {(viewMode === 'director' || viewMode === 'estimator') && (
          <div style={{
            position:'absolute', top:14, right:22,
            fontSize:'0.60rem', fontWeight:800,
            letterSpacing:'0.22em', textTransform:'uppercase',
            color: viewMode==='director' ? 'rgba(0,220,255,0.18)' : 'rgba(255,200,50,0.18)',
            fontFamily:"'Inter',sans-serif",
            userSelect:'none', pointerEvents:'none', zIndex:1,
            border: `1px solid ${viewMode==='director'?'rgba(0,220,255,0.10)':'rgba(255,200,50,0.10)'}`,
            borderRadius:4, padding:'3px 8px',
          }}>
            {viewMode === 'director' ? '⬡ Cost-Artist View' : '◈ Estimator View'}
          </div>
        )}

        {reviewIdx !== null && (
          <DirectorReviewModal req={requests[reviewIdx]} idx={reviewIdx} now={now} onUpdate={onUpdate} onClose={()=>setReviewIdx(null)} requests={requests}/>
        )}
        {/* ── Sticky sub-nav header ── */}
        {(() => {
          // inline helpers for header timeline
          const fmsH = ms => { if(!ms)return null; const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000); return h>23?`${Math.floor(h/24)}d ${h%24}h`:h>0?`${h}h ${m}m`:`${m}m`; };
          const fdtH = ts => { if(!ts)return null; try{return new Date(isNaN(+ts)?ts:+ts).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false});}catch{return null;} };
          const {s1,s2,s3} = calcTATStages(req);
          const elapsed = req.submittedAt ? now - new Date(req.submittedAt).getTime() : 0;
          // big elapsed number: time since submission (live)
          const bigDur = req.directorRespondedAt
            ? fmsH(new Date(req.directorRespondedAt).getTime()-new Date(req.submittedAt).getTime())
            : fmsH(elapsed);
          const HSTAGES = [
            {label:'Submitted',  color:'rgba(100,180,255,0.95)', done:!!req.submittedAt,           ts:req.submittedAt,           dur:s1},
            {label:'Assigned',   color:'rgba(255,200,50,0.90)',  done:!!req.taggedAt,                      ts:req.taggedAt,              dur:s2},
            {label:'Quoted',     color:'rgba(168,130,255,0.95)', done:!!req.quotationSubmittedAt,  ts:req.quotationSubmittedAt,  dur:s3},
            {label: req.directorAction==='approved'?'Approved':req.directorAction==='rejected'?'Rejected':req.directorAction==='revised'?'Revised':'Pending Decision',
             color: req.directorAction==='approved'?'rgba(50,220,100,0.95)':req.directorAction==='rejected'?'rgba(255,80,80,0.95)':req.directorAction==='revised'?'rgba(255,160,30,0.95)':'rgba(255,255,255,0.22)',
             done:!!req.directorRespondedAt, ts:req.directorRespondedAt, dur:null},
          ];
          const SEP = () => <div style={{width:1,height:34,background:'rgba(255,255,255,0.09)',flexShrink:0,margin:'0 18px'}}/>;
          const LBL = ({children,color='rgba(255,255,255,0.30)'}) => <div style={{fontSize:'0.44rem',letterSpacing:'0.16em',textTransform:'uppercase',color,fontWeight:700,marginBottom:3}}>{children}</div>;
          return (
            <div style={{
              position:'sticky',top:0,zIndex:50,flexShrink:0,
              padding:'0 28px',height:62,
              background:'rgba(5,2,18,0.98)',
              backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',
              borderBottom:`1px solid ${rss.bd}`,
              display:'flex',alignItems:'center',
            }}>
              {/* ← Back */}
              <button onClick={()=>{ setOpen(null); onOpenChange && onOpenChange(null); }}
                style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.40)',cursor:'pointer',
                  fontSize:'0.74rem',fontFamily:F2,display:'flex',alignItems:'center',gap:5,flexShrink:0,padding:0,
                  letterSpacing:'0.02em',transition:'color 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.85)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.40)'}>
                ← All Requests
              </button>

              <SEP/>

              {/* REQUEST ID */}
              <div style={{flexShrink:0}}>
                <LBL>Request ID</LBL>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  <span style={{fontSize:'0.90rem',fontWeight:800,color:'rgba(220,165,0,0.95)',fontFamily:'monospace',letterSpacing:'0.06em'}}>{req.id}</span>
                  {req.requestType==='revised'    && <span style={{fontSize:'0.48rem',fontWeight:700,color:'rgba(0,200,255,0.85)',background:'rgba(0,200,255,0.10)',borderRadius:20,padding:'1px 7px',letterSpacing:'0.08em',textTransform:'uppercase'}}>REVISE</span>}
                  {req.requestType==='finalPrice' && <span style={{fontSize:'0.48rem',fontWeight:700,color:'rgba(52,211,153,0.90)',background:'rgba(52,211,153,0.10)',borderRadius:20,padding:'1px 7px',letterSpacing:'0.08em',textTransform:'uppercase'}}>FINAL</span>}
                  {req.id && <CopyLinkBtn reqId={req.id} link={req.appLink}/>}
                  {req.id && <SpBtn reqId={req.id} link={req.spLink}/>}
                </div>
              </div>

              <SEP/>

              {/* REQUEST TIMELINE */}
              <div style={{flex:1,minWidth:0,overflow:'hidden'}}>
                <LBL color='rgba(100,180,255,0.45)'>Request Timeline</LBL>
                <div style={{display:'flex',alignItems:'center',gap:0,flexWrap:'nowrap',minWidth:0}}>
                  {/* TOTAL TIME — most prominent, shown first */}
                  {bigDur && (
                    <div style={{marginRight:14,flexShrink:0,display:'flex',flexDirection:'column'}}>
                      <span style={{fontSize:'0.40rem',color:'rgba(255,200,50,0.50)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,lineHeight:1.2}}>Total</span>
                      <span style={{fontSize:'1.00rem',fontWeight:900,fontFamily:'monospace',color:'rgba(255,200,50,0.95)',textShadow:'0 0 14px rgba(255,200,50,0.50)',lineHeight:1,letterSpacing:'-0.02em'}}>{bigDur}</span>
                    </div>
                  )}
                  {/* All stages with interval durations between them */}
                  {HSTAGES.map((st,si) => (
                    <div key={si} style={{display:'flex',alignItems:'center',flexShrink:0}}>
                      {/* Interval connector before each stage (except first) */}
                      {si > 0 && (
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',margin:'0 5px',gap:0}}>
                          <span style={{fontSize:'0.44rem',color:'rgba(255,255,255,0.14)',lineHeight:1}}>—</span>
                          {HSTAGES[si-1].dur && HSTAGES[si-1].done && st.done && (
                            <span style={{fontSize:'0.68rem',fontFamily:'monospace',fontWeight:800,color:HSTAGES[si-1].color,opacity:0.92,lineHeight:1.1,letterSpacing:'0.01em',whiteSpace:'nowrap'}}>{fmsH(HSTAGES[si-1].dur)}</span>
                          )}
                          <span style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.18)',lineHeight:1}}>›</span>
                        </div>
                      )}
                      {/* Stage dot + label */}
                      <div style={{display:'flex',alignItems:'center',gap:si===0?7:4}}>
                        <div style={{width:si===0?9:6,height:si===0?9:6,borderRadius:'50%',flexShrink:0,
                          background:st.done?st.color:'rgba(255,255,255,0.12)',
                          boxShadow:st.done?`0 0 ${si===0?8:5}px ${st.color}`:'none'}}/>
                        <div>
                          <div style={{fontSize:si===0?'0.72rem':'0.64rem',fontWeight:st.done?(si===0?700:600):400,
                            color:st.done?(si===0?'rgba(255,255,255,0.90)':'rgba(255,255,255,0.75)'):'rgba(255,255,255,0.28)',
                            lineHeight:1.1,whiteSpace:'nowrap'}}>{st.label}</div>
                          {si===0 && fdtH(HSTAGES[0].ts) && <div style={{fontSize:'0.56rem',color:HSTAGES[0].color,fontFamily:'monospace',opacity:0.80,letterSpacing:'0.02em',marginTop:1}}>{fdtH(HSTAGES[0].ts)}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SEP/>

              {/* PERSON: Estimator or Sales */}
              <div style={{flexShrink:0,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                {(req.estimator || viewMode==='director') && (viewMode==='estimator' || viewMode==='director') && (
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    {req.estimator && <EstAvatar name={req.estimator} size={30}/>}
                    <div>
                      <LBL color='rgba(99,200,255,0.50)'>Estimator</LBL>
                      {viewMode==='director' && reassignField==='estimator' ? (
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <select value={reassignValue} onChange={e=>setReassignValue(e.target.value)}
                            style={{background:'rgba(0,10,30,0.80)',border:'1px solid rgba(99,200,255,0.45)',borderRadius:6,color:'rgba(140,220,255,0.90)',fontFamily:"'Inter',sans-serif",fontSize:'0.74rem',padding:'4px 8px',outline:'none',cursor:'pointer'}}>
                            <option value="">— select —</option>
                            {EST_ROSTER.map(e=><option key={e.code} value={e.name}>{e.name}</option>)}
                          </select>
                          <button onClick={()=>{if(!reassignValue)return; const nowMs=Date.now(); onUpdate(req.id,{estimator:reassignValue,taggedAt:req.taggedAt||nowMs,timeline:[...(req.timeline||[]),{event:'reassigned',ts:new Date(nowMs).toISOString(),tsMs:nowMs,label:`Reassigned to ${reassignValue}`,by:'Cost-Artist'}],_immediate:true}); setReassignField(null); setReassignValue('');}}
                            style={{padding:'3px 8px',borderRadius:6,background:'rgba(99,200,255,0.14)',border:'1px solid rgba(99,200,255,0.40)',color:'rgba(140,220,255,0.90)',fontSize:'0.70rem',fontWeight:700,cursor:'pointer',outline:'none'}}>Save</button>
                          <button onClick={()=>{setReassignField(null);setReassignValue('');}}
                            style={{padding:'3px 7px',borderRadius:6,background:'transparent',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.35)',fontSize:'0.70rem',cursor:'pointer',outline:'none'}}>✕</button>
                        </div>
                      ) : (
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <div style={{fontSize:'0.74rem',fontWeight:700,color:'rgba(255,255,255,0.88)',lineHeight:1}}>{req.estimator||'Unassigned'}</div>
                          {viewMode==='director' && <button onClick={()=>{setReassignField('estimator');setReassignValue(req.estimator||'');}}
                            style={{fontSize:'0.58rem',padding:'2px 7px',borderRadius:5,background:'rgba(99,200,255,0.08)',border:'1px solid rgba(99,200,255,0.22)',color:'rgba(99,200,255,0.70)',cursor:'pointer',outline:'none',fontFamily:"'Inter',sans-serif"}}>Reassign</button>}
                          {viewMode==='director' && req.estimator && <button onClick={()=>{const nowMs=Date.now(); onUpdate(req.id,{estimator:'',taggedAt:null,timeline:[...(req.timeline||[]),{event:'unassigned',ts:new Date(nowMs).toISOString(),tsMs:nowMs,label:`Estimator removed — unassigned`,by:'Cost-Artist'}],_immediate:true});}}
                            style={{fontSize:'0.58rem',padding:'2px 7px',borderRadius:5,background:'rgba(220,60,60,0.08)',border:'1px solid rgba(220,60,60,0.22)',color:'rgba(220,90,90,0.75)',cursor:'pointer',outline:'none',fontFamily:"'Inter',sans-serif"}}>Remove</button>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {req.salesPerson && (
                  <>
                    {(req.estimator||viewMode==='director') && (viewMode==='estimator' || viewMode==='director') && <div style={{width:1,height:28,background:'rgba(255,255,255,0.08)',margin:'0 10px'}}/>}
                    <EstAvatar name={req.salesPerson} size={30}/>
                    <div>
                      <LBL color='rgba(168,85,247,0.55)'>Sales</LBL>
                      {viewMode==='director' && reassignField==='salesPerson' ? (
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <select value={reassignValue} onChange={e=>setReassignValue(e.target.value)}
                            style={{background:'rgba(20,10,40,0.80)',border:'1px solid rgba(168,85,247,0.45)',borderRadius:6,color:'rgba(200,160,255,0.90)',fontFamily:"'Inter',sans-serif",fontSize:'0.74rem',padding:'4px 8px',outline:'none',cursor:'pointer'}}>
                            <option value="">— select —</option>
                            {Object.entries(STAFF_NAMES).filter(([k])=>ROLE_CODES[k]==='sales').map(([code,name])=><option key={code} value={name}>{name}</option>)}
                          </select>
                          <button onClick={()=>{if(!reassignValue)return; const nowMs=Date.now(); onUpdate(req.id,{salesPerson:reassignValue,timeline:[...(req.timeline||[]),{event:'reassigned-sales',ts:new Date(nowMs).toISOString(),tsMs:nowMs,label:`Sales reassigned to ${reassignValue}`,by:'Cost-Artist'}],_immediate:true}); setReassignField(null); setReassignValue('');}}
                            style={{padding:'3px 8px',borderRadius:6,background:'rgba(168,85,247,0.14)',border:'1px solid rgba(168,85,247,0.40)',color:'rgba(200,160,255,0.90)',fontSize:'0.70rem',fontWeight:700,cursor:'pointer',outline:'none'}}>Save</button>
                          <button onClick={()=>{setReassignField(null);setReassignValue('');}}
                            style={{padding:'3px 7px',borderRadius:6,background:'transparent',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.35)',fontSize:'0.70rem',cursor:'pointer',outline:'none'}}>✕</button>
                        </div>
                      ) : (
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <div style={{fontSize:'0.74rem',fontWeight:700,color:'rgba(255,255,255,0.88)',lineHeight:1}}>{req.salesPerson}</div>
                          {viewMode==='director' && <button onClick={()=>{setReassignField('salesPerson');setReassignValue(req.salesPerson||'');}}
                            style={{fontSize:'0.58rem',padding:'2px 7px',borderRadius:5,background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.22)',color:'rgba(168,85,247,0.70)',cursor:'pointer',outline:'none',fontFamily:"'Inter',sans-serif"}}>Reassign</button>}
                          {viewMode==='director' && <button onClick={()=>{const nowMs=Date.now(); onUpdate(req.id,{salesPerson:'',timeline:[...(req.timeline||[]),{event:'unassigned-sales',ts:new Date(nowMs).toISOString(),tsMs:nowMs,label:`Sales removed — unassigned`,by:'Cost-Artist'}],_immediate:true});}}
                            style={{fontSize:'0.58rem',padding:'2px 7px',borderRadius:5,background:'rgba(220,60,60,0.08)',border:'1px solid rgba(220,60,60,0.22)',color:'rgba(220,90,90,0.75)',cursor:'pointer',outline:'none',fontFamily:"'Inter',sans-serif"}}>Remove</button>}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {req.customerRank > 0 && (() => {
                  const rc=['','rgba(205,127,50,0.95)','rgba(180,180,200,0.95)','rgba(255,200,0,0.95)','rgba(100,220,255,0.95)','rgba(200,130,255,0.95)'][req.customerRank];
                  return <div style={{display:'flex',gap:1,alignItems:'center',marginLeft:6}}>{[1,2,3,4,5].map(n=><span key={n} style={{fontSize:'0.64rem',color:req.customerRank>=n?rc:'rgba(255,255,255,0.10)'}}>★</span>)}</div>;
                })()}
              </div>

              <SEP/>

              {/* REQUEST STATUS */}
              <div style={{flexShrink:0,display:'flex',alignItems:'center',gap:10}}>
                <div style={{bfackground:`${rss.c}14`,border:`1px solid ${rss.bd}`,borderRadius:8,padding:'5px 12px'}}>
                  <LBL color={`${rss.c}80`}>Request Status</LBL>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:rss.c,boxShadow:`0 0 6px ${rss.c}`,flexShrink:0}}/>
                    <span style={{fontSize:'0.78rem',fontWeight:700,color:rss.c,lineHeight:1,whiteSpace:'nowrap'}}>{rss.label}</span>
                  </div>
                </div>
                {viewMode === 'director' && (
                  <button onClick={()=>setDeleteConfirm(open)} title="Delete"
                    style={{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:7,background:'rgba(220,50,50,0.09)',border:'none',color:'rgba(220,80,80,0.55)',cursor:'pointer',outline:'none'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.22)';e.currentTarget.style.color='rgba(255,110,110,0.95)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.09)';e.currentTarget.style.color='rgba(220,80,80,0.55)';}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── Scrollable content area (everything below sticky header) ── */}
        <div style={{flex:1,overflowY:'auto',minHeight:0,padding:'20px 40px 48px',
          scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.12) transparent'}}>

        {/* ── Out of Scope banner — visible to ALL roles ── */}
        {isOutOfScope && (
          <div style={{display:'flex',alignItems:'flex-start',gap:14,padding:'14px 20px',marginBottom:16,borderRadius:10,background:'rgba(200,40,40,0.10)',border:'1px solid rgba(220,60,60,0.50)',boxShadow:'0 0 22px rgba(200,40,40,0.14)'}}>
            <div style={{width:36,height:36,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(220,50,50,0.20)',border:'1px solid rgba(220,60,60,0.45)',fontSize:'1.1rem'}}>⊘</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'0.72rem',fontWeight:800,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,90,90,0.95)',marginBottom:4}}>Cancelled by Cost-Artist — Timeline Frozen</div>
              <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.65)',lineHeight:1.55}}>
                This request has been cancelled due to invalid documents. Timeline is frozen. Contact the estimator or use Recall to re-open.
              </div>
              {req.outScopeRemark && (
                <div style={{marginTop:8,paddingLeft:12,borderLeft:'2px solid rgba(255,80,80,0.40)',fontSize:'0.74rem',color:'rgba(255,200,200,0.80)',fontStyle:'italic',lineHeight:1.5}}>
                  "{req.outScopeRemark}"
                </div>
              )}
              <div style={{marginTop:6,fontSize:'0.64rem',color:'rgba(255,255,255,0.30)',letterSpacing:'0.08em'}}>
                Marked by {req.outScopeBy||'Cost-Artist'} · {req.outScopeAt ? new Date(req.outScopeAt).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}) : '—'}
                {req.outScopeAt && <span style={{marginLeft:8,fontFamily:'monospace',color:'rgba(255,255,255,0.18)'}}>({req.outScopeAt}ms)</span>}
              </div>
            </div>
            {/* Recall button — available to cost-artist (director) only */}
            {viewMode === 'director' && (
              <button
                onClick={() => {
                  const nowMs = Date.now();
                  onUpdate(req.id, {
                    reqStatus: 'not-started',
                    status: 'Pending Estimation',
                    outScopeRemark: null,
                    outScopeAt: null,
                    outScopeBy: null,
                    outOfScopeSubmitted: null,
                    oosNotification: null,
                    _immediate: true,
                    timeline: [...(req.timeline||[]), {
                      event: 'recalled-oos',
                      ts: new Date(nowMs).toISOString(),
                      tsMs: nowMs,
                      label: 'Cancelled/OOS Undone — Re-opened',
                      by: req.estimator || viewMode,
                    }],
                  });
                }}
                style={{flexShrink:0,padding:'8px 18px',borderRadius:8,background:'rgba(255,160,30,0.12)',border:'1px solid rgba(255,160,30,0.40)',color:'rgba(255,190,60,0.95)',fontFamily:"'Inter',sans-serif",fontSize:'0.76rem',fontWeight:700,cursor:'pointer',outline:'none',whiteSpace:'nowrap',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,160,30,0.24)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,160,30,0.12)'}
              >
                ↩ Undo Cancellation
              </button>
            )}
          </div>
        )}

        {/* ── Cost-Artist response notification banner ── */}
        {viewMode === 'estimator' && (isRejected || isResubmission) && (
          <div style={{
            display:'flex',alignItems:'flex-start',gap:14,
            padding:'14px 20px',marginBottom:16,borderRadius:10,
            background: isRejected ? 'rgba(200,40,40,0.10)' : 'rgba(200,120,0,0.10)',
            border: `1px solid ${isRejected ? 'rgba(220,60,60,0.50)' : 'rgba(255,160,30,0.50)'}`,
            boxShadow: isRejected ? '0 0 18px rgba(200,40,40,0.12)' : '0 0 18px rgba(200,120,0,0.12)',
          }}>
            <div style={{
              width:36,height:36,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              background: isRejected ? 'rgba(220,50,50,0.20)' : 'rgba(220,130,0,0.20)',
              border: `1px solid ${isRejected ? 'rgba(220,60,60,0.45)' : 'rgba(255,160,30,0.45)'}`,
              fontSize:'1.1rem',
            }}>
              {isRejected ? '⊘' : '↺'}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'0.72rem',fontWeight:800,letterSpacing:'0.06em',textTransform:'uppercase',
                color: isRejected ? 'rgba(255,100,100,0.95)' : 'rgba(255,190,50,0.95)',
                marginBottom:4,
              }}>
                {isRejected ? 'Rejected by Cost-Artist — Final Decision' : 'Correction Required by Cost-Artist'}
              </div>
              <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.65)',lineHeight:1.55}}>
                {isRejected
                  ? 'Rejected by Cost-Artist. Use Undo to re-open, or upload a new revised file and resubmit for re-review.'
                  : 'Cost-Artist has marked this as Correction Required. Update your quotation and re-submit.'}
              </div>
              {req.directorNote && (
                <div style={{marginTop:8,paddingLeft:12,borderLeft:`2px solid ${isRejected?'rgba(255,80,80,0.40)':'rgba(255,160,30,0.40)'}`,fontSize:'0.74rem',color:'rgba(255,220,160,0.80)',fontStyle:'italic',lineHeight:1.5}}>
                  "{req.directorNote}"
                </div>
              )}
            </div>
            {/* Undo Rejection — estimator only */}
            {isRejected && (
              <button
                onClick={() => {
                  const nowMs = Date.now();
                  onUpdate(req.id, {
                    directorAction: null,
                    directorNote: null,
                    directorRespondedAt: null,
                    directorSubmitted: false,
                    status: 'Pending Estimation',
                    reqStatus: 'not-started',
                    _immediate: true,
                    timeline: [...(req.timeline||[]), {
                      event: 'undo-rejection',
                      ts: new Date(nowMs).toISOString(),
                      tsMs: nowMs,
                      label: 'Rejection Undone — Re-opened for Estimation',
                      by: req.estimator || 'estimator',
                    }],
                  });
                }}
                style={{flexShrink:0,alignSelf:'flex-start',padding:'8px 18px',borderRadius:8,background:'rgba(255,80,80,0.10)',border:'1px solid rgba(255,90,90,0.38)',color:'rgba(255,130,130,0.95)',fontFamily:"'Inter',sans-serif",fontSize:'0.76rem',fontWeight:700,cursor:'pointer',outline:'none',whiteSpace:'nowrap',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,80,80,0.22)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,80,80,0.10)'}
              >
                ↩ Undo Rejection
              </button>
            )}
          </div>
        )}

        {viewMode !== 'director' && (
          <div className="dash-2col" style={{display:'flex',gap:0,maxWidth:'100%',width:'100%',alignItems:'stretch',minHeight:0}}>
            {/* LEFT — request info */}
            <div style={{width: viewMode==='estimator' ? colLeftW : undefined, flex: viewMode==='estimator' ? 'none' : '1', flexShrink:0, background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'18px 20px'}}>
              <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.40)',marginBottom:12,fontWeight:700}}>Request Info</p>
              {infoRows.map(([k,v])=>(
                <div key={v} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'7px 0',gap:12}}>
                  <span style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.88)',fontWeight:600,flex:1,minWidth:0,wordBreak:'break-word',lineHeight:1.45}}>{k}</span>
                  <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.35)',fontWeight:500,flexShrink:0,textAlign:'right',lineHeight:1.45}}>{v}</span>
                </div>
              ))}
              {req.docs?.length > 0 && (
                <div style={{marginTop:10}}>
                  <p style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.28)',marginBottom:6,letterSpacing:'0.12em',textTransform:'uppercase'}}>
                    {req.requestType==='finalPrice' ? 'Final / Updated Documents' : req.requestType==='revised' ? 'New / Updated Documents' : 'Attached Files'}
                  </p>
                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                    {req.docs.map((d,i)=>{
                      const dc = req.requestType==='finalPrice'?'rgba(52,211,153,0.85)':req.requestType==='revised'?'rgba(0,200,255,0.85)':'rgba(99,160,240,0.90)';
                      return (
                        <button key={i} onClick={()=>downloadDoc(d)}
                          style={{display:'flex',alignItems:'center',gap:7,padding:'5px 9px',borderRadius:6,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',outline:'none',fontFamily:F2,transition:'background 0.15s',width:'100%',textAlign:'left'}}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={dc} strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span style={{fontSize:'0.73rem',color:dc,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{docName(d)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* ── Revised / Final Price: original reference docs ── */}
              {(req.requestType==='revised'||req.requestType==='finalPrice') && req.originalDocs?.length > 0 && (
                <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
                  <p style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',marginBottom:6,letterSpacing:'0.12em',textTransform:'uppercase'}}>Original Documents (Reference)</p>
                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                    {req.originalDocs.map((d,i)=>(
                      <button key={i} onClick={()=>downloadDoc(d)}
                        style={{display:'flex',alignItems:'center',gap:7,padding:'5px 9px',borderRadius:6,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',cursor:'pointer',outline:'none',fontFamily:F2,transition:'background 0.15s',width:'100%',textAlign:'left',opacity:0.70}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(160,190,230,0.65)" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span style={{fontSize:'0.72rem',color:'rgba(160,190,230,0.75)',fontStyle:'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{docName(d)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Previous quotation data (revise / final price) ── */}
              {(req.requestType==='revised'||req.requestType==='finalPrice') && req.originalId && (() => {
                const orig = requests.find(r => r.id === req.originalId);
                if (!orig) return null;
                const origQuotDocs = orig.estimationDocs?.length > 0 ? orig.estimationDocs : orig.estimationDoc ? [orig.estimationDoc] : [];
                const origToolDocs = orig.toolDocs || [];
                // Prefer live docs from original; fall back to the snapshot copied at revision-submit time
                const origReqDocs  = (orig.docs?.length ? orig.docs : null) || req.originalDocs || [];
                const hasSomething = orig.projValue || orig.directorNote || origQuotDocs.length || origToolDocs.length || origReqDocs.length;
                if (!hasSomething) return null;
                return (
                  <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid rgba(255,200,40,0.14)'}}>
                    <p style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,200,40,0.55)',marginBottom:8,fontWeight:700}}>
                      Previous Quotation — {orig.id}
                    </p>
                    {/* Estimator row */}
                    {orig.estimator && (() => {
                      const pal = avatarPalette(orig.estimator);
                      const estCode = EST_ROSTER.find(e => e.name === orig.estimator)?.code;
                      const photoUrl = AVATAR_URLS[estCode];
                      return (
                        <div style={{display:'flex',alignItems:'center',gap:9,padding:'7px 10px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:6}}>
                          <div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,background:photoUrl?'transparent':pal.bg,border:`2px solid ${pal.ring}`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',fontSize:'0.72rem',fontWeight:700,color:pal.fg}}>
                            {photoUrl
                              ? <img src={photoUrl} alt={orig.estimator} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                              : orig.estimator.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:1}}>Estimator</div>
                            <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.82)',fontWeight:700}}>{orig.estimator}</div>
                          </div>
                          {orig.directorAction && (
                            <span style={{marginLeft:'auto',fontSize:'0.50rem',fontWeight:700,padding:'2px 8px',borderRadius:4,
                              background:orig.directorAction==='approved'?'rgba(0,220,130,0.12)':orig.directorAction==='rejected'?'rgba(220,60,60,0.12)':'rgba(255,160,30,0.12)',
                              color:orig.directorAction==='approved'?'rgba(0,220,130,0.85)':orig.directorAction==='rejected'?'rgba(220,80,80,0.85)':'rgba(255,180,50,0.85)',
                              border:`1px solid ${orig.directorAction==='approved'?'rgba(0,220,130,0.28)':orig.directorAction==='rejected'?'rgba(220,60,60,0.28)':'rgba(255,160,30,0.28)'}`
                            }}>{orig.directorAction.charAt(0).toUpperCase()+orig.directorAction.slice(1)}</span>
                          )}
                        </div>
                      );
                    })()}
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>

                      {/* Quoted Value */}
                      {orig.projValue && (
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',borderRadius:7,background:'rgba(0,200,120,0.07)',border:'1px solid rgba(0,200,120,0.18)'}}>
                          <span style={{fontSize:'0.56rem',color:'rgba(0,200,120,0.60)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:700}}>Quoted Value</span>
                          <span style={{fontSize:'0.88rem',color:'rgba(0,230,140,0.90)',fontFamily:'monospace',fontWeight:700}}>{orig.projValue} AED</span>
                        </div>
                      )}

                      {/* Request Docs */}
                      {origReqDocs.length > 0 && (
                        <div>
                          <p style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,180,255,0.55)',marginBottom:5,fontWeight:700}}>Request Docs</p>
                          <div style={{display:'flex',flexDirection:'column',gap:3}}>
                            {origReqDocs.map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:7,padding:'5px 9px',borderRadius:6,background:'rgba(0,160,255,0.07)',border:'1px solid rgba(0,180,255,0.20)',cursor:'pointer',outline:'none',fontFamily:F2,width:'100%',textAlign:'left'}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,160,255,0.14)'}
                                onMouseLeave={e=>e.currentTarget.style.background='rgba(0,160,255,0.07)'}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.75)" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                <span style={{fontSize:'0.72rem',color:'rgba(0,200,255,0.85)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{docName(d)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cost-Artist Remarks */}
                      {orig.directorNote && (
                        <div style={{padding:'8px 10px',borderRadius:7,background:'rgba(0,150,255,0.06)',border:'1px solid rgba(0,180,255,0.16)'}}>
                          <p style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,200,255,0.50)',marginBottom:4,fontWeight:700}}>Cost-Artist Remarks</p>
                          <p style={{fontSize:'0.76rem',color:'rgba(180,220,255,0.80)',lineHeight:1.5,margin:0}}>{orig.directorNote}</p>
                        </div>
                      )}

                      {/* Project Docs */}
                      {origToolDocs.length > 0 && (
                        <div>
                          <p style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(168,85,247,0.55)',marginBottom:5,fontWeight:700}}>Project Docs</p>
                          <div style={{display:'flex',flexDirection:'column',gap:3}}>
                            {origToolDocs.map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:7,padding:'5px 9px',borderRadius:6,background:'rgba(168,85,247,0.07)',border:'1px solid rgba(168,85,247,0.22)',cursor:'pointer',outline:'none',fontFamily:F2,width:'100%',textAlign:'left'}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(168,85,247,0.14)'}
                                onMouseLeave={e=>e.currentTarget.style.background='rgba(168,85,247,0.07)'}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(196,181,253,0.75)" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                <span style={{fontSize:'0.72rem',color:'rgba(196,181,253,0.85)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{d.name||`proj-doc-${i+1}`}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quotation Docs */}
                      {origQuotDocs.length > 0 && (
                        <div>
                          <p style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,200,40,0.55)',marginBottom:5,fontWeight:700}}>Quotation Docs</p>
                          <div style={{display:'flex',flexDirection:'column',gap:3}}>
                            {origQuotDocs.map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:7,padding:'5px 9px',borderRadius:6,background:'rgba(255,180,0,0.07)',border:'1px solid rgba(255,200,40,0.22)',cursor:'pointer',outline:'none',fontFamily:F2,width:'100%',textAlign:'left'}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,180,0,0.14)'}
                                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,180,0,0.07)'}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,210,60,0.75)" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                <span style={{fontSize:'0.72rem',color:'rgba(255,210,60,0.85)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{d.name||`quot-doc-${i+1}`}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Drag handle — left / middle */}
            {viewMode === 'estimator' && (
              <div onMouseDown={e=>startColDrag('left',e)}
                onMouseEnter={e=>{const bar=e.currentTarget.firstChild;if(bar)bar.style.background='rgba(220,165,0,0.65)';}}
                onMouseLeave={e=>{const bar=e.currentTarget.firstChild;if(bar)bar.style.background='rgba(255,255,255,0.12)';}}
                style={{width:10,flexShrink:0,cursor:'col-resize',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 5px',zIndex:5,userSelect:'none'}}
                title="Drag to resize">
                <div style={{width:2,height:'50%',borderRadius:2,background:'rgba(255,255,255,0.12)',transition:'background 0.2s',pointerEvents:'none'}}/>
              </div>
            )}
            {viewMode !== 'estimator' && <div style={{width:20,flexShrink:0}}/>}

            {/* RIGHT — view-specific panels */}
            <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:14}}>

              {/* ── REQUESTER right panel ── */}
              {viewMode === 'requester' && (<>
                {req.remarks && (
                  <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'14px 18px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:8}}>Your Remarks</p>
                    <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.65)',lineHeight:1.6}}>{req.remarks}</p>
                  </div>
                )}
                {/* Director Remarks & Status — visible to sales */}
                {req.directorAction && (
                  (() => {
                    const isApproved = req.directorAction === 'approved';
                    const isRejected = req.directorAction === 'rejected';
                    const cfg = isApproved
                      ? {bg:'rgba(0,200,100,0.06)',bd:'rgba(0,200,100,0.22)',dot:'rgba(0,220,120,0.90)',label:'Approved',sub:'Quotation approved by Cost-Artist'}
                      : isRejected
                      ? {bg:'rgba(220,60,60,0.06)',bd:'rgba(220,60,60,0.24)',dot:'rgba(255,90,90,0.95)',label:'Rejected',sub:'Quotation has been rejected'}
                      : {bg:'rgba(255,160,40,0.06)',bd:'rgba(255,160,40,0.24)',dot:'rgba(255,180,60,0.95)',label:'Revision Required',sub:'Estimator is revising the quotation'};
                    return (
                      <div style={{background:cfg.bg,border:`1px solid ${cfg.bd}`,borderRadius:10,padding:'14px 16px',display:'flex',flexDirection:'column',gap:8}}>
                        <span style={{fontSize:'0.56rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:600}}>Cost-Artist's Decision</span>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{width:7,height:7,borderRadius:'50%',background:cfg.dot,boxShadow:`0 0 6px ${cfg.dot}`,flexShrink:0}}/>
                          <span style={{fontSize:'0.78rem',fontWeight:700,color:cfg.dot}}>{cfg.label}</span>
                          <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.35)',marginLeft:2}}>— {cfg.sub}</span>
                        </div>
                        {req.directorNote && (
                          <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.60)',lineHeight:1.5,margin:0,paddingLeft:14,borderLeft:`2px solid ${cfg.dot}40`}}>{req.directorNote}</p>
                        )}
                      </div>
                    );
                  })()
                )}
                {(() => {
                  const canDownloadQuotation =
                    (req.directorAction === 'approved' ||
                     req.reqStatus === 'completed' ||
                     req.status === 'Approved' ||
                     req.status === 'Completed') &&
                    req.directorAction !== 'rejected' &&
                    req.directorAction !== 'revised';
                  return canDownloadQuotation;
                })() ? (
                  <div style={{background:'rgba(0,40,20,0.50)',border:'1px solid rgba(0,200,100,0.28)',borderRadius:10,padding:'16px 18px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,200,100,0.60)',marginBottom:10}}>Download Quotation</p>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {(req.estimationDocs?.length > 0 ? req.estimationDocs : [req.estimationDoc]).filter(Boolean).map((d,i)=>(
                        <button key={i} onClick={()=>downloadDoc(d)}
                          style={{...btnStyle,color:'rgba(52,211,153,0.90)',border:'1px solid rgba(0,180,80,0.40)',background:'rgba(0,160,70,0.10)',justifyContent:'flex-start',gap:8,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>↓ {d.name||`quotation-${i+1}`}</span>
                        </button>
                      ))}
                      {!(req.estimationDocs?.length > 0 || req.estimationDoc) && (
                        <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.28)',margin:0}}>No quotation files attached yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'20px 22px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:10}}>Quotation</p>
                    <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.28)',lineHeight:1.6}}>Quotation will be available once the Cost-Artist approves it.</p>
                  </div>
                )}
                {/* Conversation — sales big chat box */}
                <div style={{background:'rgba(109,40,217,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:14,padding:'18px 18px 14px',display:'flex',flexDirection:'column',gap:12,minHeight:420}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,paddingBottom:10,borderBottom:'1px solid rgba(168,85,247,0.18)'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(168,85,247,0.90)',boxShadow:'0 0 8px rgba(168,85,247,0.70)',flexShrink:0}}/>
                    <p style={{fontSize:'0.60rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(168,85,247,0.85)',margin:0,fontWeight:700}}>Conversation</p>
                    {req.estimator && <span style={{marginLeft:'auto',fontSize:'0.65rem',color:'rgba(100,200,255,0.55)',fontWeight:500}}>with {req.estimator}</span>}
                  </div>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:10,overflowY:'auto',minHeight:200,maxHeight:280,paddingRight:4,scrollbarWidth:'thin',scrollbarColor:'rgba(168,85,247,0.20) transparent'}}>
                    {(req.conversation||[]).length === 0 ? (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:10,opacity:0.4}}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.70)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.30)',margin:0,fontStyle:'italic'}}>No messages yet. Start the conversation.</p>
                      </div>
                    ) : (req.conversation||[]).map((msg,i)=>{
                      const isSales = msg.role==='sales';
                      return (
                        <div key={i} style={{display:'flex',flexDirection:'column',alignItems:isSales?'flex-end':'flex-start'}}>
                          <div style={{maxWidth:'82%',background:isSales?'rgba(109,40,217,0.28)':'rgba(255,255,255,0.06)',border:isSales?'1px solid rgba(168,85,247,0.35)':'1px solid rgba(255,255,255,0.10)',borderRadius:isSales?'14px 14px 3px 14px':'14px 14px 14px 3px',padding:'9px 13px'}}>
                            <div style={{fontSize:'0.58rem',color:isSales?'rgba(196,181,253,0.70)':'rgba(100,200,255,0.65)',marginBottom:4,fontWeight:600}}>{msg.from} · {msg.ts}</div>
                            <div style={{fontSize:'0.86rem',color:'rgba(255,255,255,0.86)',lineHeight:1.5}}>{msg.text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:'flex',gap:9,alignItems:'flex-end',paddingTop:10,borderTop:'1px solid rgba(168,85,247,0.14)'}}>
                    <textarea value={convoInput} onChange={e=>setConvoInput(e.target.value)}
                      onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!convoInput.trim())return;const ts=new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});onUpdate(req.id,{conversation:[...(req.conversation||[]),{from:req.salesPerson||'Sales',role:'sales',text:convoInput.trim(),ts,tsMs:Date.now()}]});setConvoInput('');}}}
                      placeholder="Type a message… (Enter to send)"
                      rows={2}
                      style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(168,85,247,0.28)',borderRadius:10,padding:'10px 13px',color:'#e2e8f0',fontFamily:F2,fontSize:'0.86rem',outline:'none',resize:'none',lineHeight:1.5}}
                    />
                    <button onClick={()=>{if(!convoInput.trim())return;const ts=new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});onUpdate(req.id,{conversation:[...(req.conversation||[]),{from:req.salesPerson||'Sales',role:'sales',text:convoInput.trim(),ts,tsMs:Date.now()}]});setConvoInput('');}}
                      style={{width:40,height:40,borderRadius:10,flexShrink:0,background:'rgba(109,40,217,0.55)',border:'1px solid rgba(168,85,247,0.50)',color:'#e2d9ff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',alignSelf:'flex-end'}}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                </div>
              </>)}

              {/* ── ESTIMATOR right panel ── */}
              {viewMode === 'estimator' && (<div style={{display:'flex',flexDirection:'column',gap:14,height:'100%'}}>

                {/* ── Revised / Final Price info card — estimator view ── */}
                {(req.requestType==='revised'||req.requestType==='finalPrice') && (() => {
                  const isFinal = req.requestType==='finalPrice';
                  const dotC  = isFinal?'rgba(52,211,153,0.9)' :'rgba(0,200,255,0.9)';
                  const dotSh = isFinal?'rgba(52,211,153,0.6)' :'rgba(0,200,255,0.6)';
                  const lblC  = isFinal?'rgba(52,211,153,0.85)':'rgba(0,200,255,0.80)';
                  const rmkC  = isFinal?'rgba(52,211,153,0.35)':'rgba(0,200,255,0.40)';
                  const brdC  = isFinal?'rgba(52,211,153,0.25)':'rgba(0,200,255,0.25)';
                  const bg    = isFinal?'rgba(16,185,129,0.06)':'rgba(0,150,255,0.06)';
                  const bd    = isFinal?'rgba(52,211,153,0.22)' :'rgba(0,180,255,0.22)';
                  return (
                    <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:10,padding:'14px 16px',display:'flex',flexDirection:'column',gap:8}}>
                      <div style={{display:'flex',alignItems:'center',gap:7}}>
                        <span style={{width:6,height:6,borderRadius:'50%',background:dotC,boxShadow:`0 0 6px ${dotSh}`,flexShrink:0}}/>
                        <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.13em',textTransform:'uppercase',color:lblC}}>
                          {isFinal?'Final Price Request':'Revise Quotation'}
                        </span>
                        {req.originalId && <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.30)',marginLeft:2}}>— original ref: <span style={{fontFamily:'monospace',color:'rgba(220,165,0,0.75)'}}>{req.originalId}</span></span>}
                      </div>
                      {req.remarks && (
                        <div>
                          <p style={{fontSize:'0.56rem',letterSpacing:'0.12em',textTransform:'uppercase',color:rmkC,marginBottom:4}}>
                            {isFinal?'Final Remarks':'Revision Remarks'}
                          </p>
                          <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.70)',lineHeight:1.55,margin:0,paddingLeft:12,borderLeft:`2px solid ${brdC}`}}>{req.remarks}</p>
                        </div>
                      )}
                      {req.originalRemarks && (
                        <div>
                          <p style={{fontSize:'0.56rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:4}}>Original Remarks (Reference)</p>
                          <p style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.40)',lineHeight:1.5,margin:0,fontStyle:'italic'}}>{req.originalRemarks}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* ── View Original Request button (estimator navigation) ── */}
                {req.originalId && (() => {
                  const origIdx = requests.findIndex(r => r.id === req.originalId);
                  if (origIdx < 0) return null;
                  const origR = requests[origIdx];
                  return (
                    <button onClick={()=>setOpen(req.originalId)}
                      style={{display:'flex',alignItems:'center',gap:9,padding:'10px 14px',borderRadius:9,background:'rgba(220,165,0,0.08)',border:'1px solid rgba(220,165,0,0.30)',color:'rgba(255,200,60,0.90)',fontFamily:F2,fontSize:'0.78rem',fontWeight:700,cursor:'pointer',outline:'none',transition:'all 0.15s',width:'100%',textAlign:'left'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,165,0,0.16)';e.currentTarget.style.borderColor='rgba(220,165,0,0.50)';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,165,0,0.08)';e.currentTarget.style.borderColor='rgba(220,165,0,0.30)';}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></svg>
                      <span>View Original Request</span>
                      <span style={{marginLeft:'auto',fontSize:'0.65rem',color:'rgba(255,200,60,0.55)',fontFamily:'monospace',fontWeight:600}}>{origR.id}</span>
                      {origR.proj && <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.30)',fontWeight:400,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{origR.proj}</span>}
                    </button>
                  );
                })()}

                {/* ── Comment History thread ── */}
                {(() => {
                  const origReq = req.originalId ? requests.find(r => r.id === req.originalId) : null;
                  const entries = [];

                  // Original requestor remark
                  if (origReq?.remarks) entries.push({
                    role:'Requestor', label:'Original Remarks', text:origReq.remarks,
                    dot:'rgba(180,180,255,0.80)', border:'rgba(120,120,255,0.20)', bg:'rgba(80,80,200,0.05)',
                    ref: origReq.id, date: origReq.date,
                  });
                  // Original Cost-Artist note
                  if (origReq?.directorNote) entries.push({
                    role:'Cost-Artist', label:'Cost-Artist Response (Original)', text:origReq.directorNote,
                    dot:'rgba(0,220,255,0.85)', border:'rgba(0,180,255,0.22)', bg:'rgba(0,150,255,0.05)',
                    ref: origReq.id, date: origReq.directorRespondedAt ? new Date(origReq.directorRespondedAt).toLocaleDateString('en-GB') : origReq.date,
                    extra: origReq.directorAction ? `Decision: ${origReq.directorAction.charAt(0).toUpperCase()+origReq.directorAction.slice(1)}` : null,
                  });
                  // Current requestor remark (revised/finalPrice)
                  if (req.remarks && (req.requestType==='revised'||req.requestType==='finalPrice')) entries.push({
                    role:'Requestor', label: req.requestType==='finalPrice'?'Final Price Remarks':'Revision Remarks', text:req.remarks,
                    dot:'rgba(52,211,153,0.85)', border:'rgba(52,200,130,0.22)', bg:'rgba(16,185,129,0.05)',
                    ref: req.id, date: req.date,
                  });
                  // Current Cost-Artist note (if already responded)
                  if (req.directorNote) entries.push({
                    role:'Cost-Artist', label:'Cost-Artist Response', text:req.directorNote,
                    dot:'rgba(0,220,255,0.85)', border:'rgba(0,180,255,0.22)', bg:'rgba(0,150,255,0.05)',
                    ref: req.id, date: req.directorRespondedAt ? new Date(req.directorRespondedAt).toLocaleDateString('en-GB') : req.date,
                    extra: req.directorAction ? `Decision: ${req.directorAction.charAt(0).toUpperCase()+req.directorAction.slice(1)}` : null,
                  });

                  if (entries.length === 0) return null;
                  return (
                    <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'14px 16px'}}>
                      <p style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:12,fontWeight:700}}>Comment History</p>
                      <div style={{display:'flex',flexDirection:'column',gap:10}}>
                        {entries.map((e,i)=>(
                          <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                            {/* Timeline dot + line */}
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0,paddingTop:3}}>
                              <div style={{width:8,height:8,borderRadius:'50%',background:e.dot,boxShadow:`0 0 6px ${e.dot}`,flexShrink:0}}/>
                              {i < entries.length-1 && <div style={{width:1,flex:1,minHeight:16,background:'rgba(255,255,255,0.08)',marginTop:4}}/>}
                            </div>
                            {/* Content */}
                            <div style={{flex:1,background:e.bg,border:`1px solid ${e.border}`,borderRadius:8,padding:'8px 12px',minWidth:0}}>
                              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5,flexWrap:'wrap'}}>
                                <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase',color:e.dot}}>{e.role}</span>
                                <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.28)'}}>·</span>
                                <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.30)'}}>{e.label}</span>
                                {e.date && <span style={{fontSize:'0.56rem',color:'rgba(255,255,255,0.20)',marginLeft:'auto'}}>{e.date}</span>}
                              </div>
                              {e.extra && <div style={{fontSize:'0.66rem',fontWeight:600,color:e.dot,marginBottom:4}}>{e.extra}</div>}
                              <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.65)',lineHeight:1.5,margin:0}}>{e.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Requester remarks — read-only reference (new requests only) */}
                {req.remarks && req.requestType !== 'revised' && req.requestType !== 'finalPrice' && (
                  <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'12px 16px'}}>
                    <p style={{fontSize:'0.56rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:6}}>Requester Remarks</p>
                    <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.60)',lineHeight:1.55,margin:0}}>{req.remarks}</p>
                  </div>
                )}

                {/* Upload + Margin % + Project Value in one card */}
                <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'16px 18px',display:'flex',flexDirection:'column',gap:10}}>
                  <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:2}}>Quotation Details</p>
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>

                    {/* ── SECTION A: Requester docs (read-only reference) ── */}
                    <div style={{background:'rgba(0,160,255,0.04)',border:'1px solid rgba(0,160,255,0.16)',borderRadius:8,padding:'10px 12px'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:req.docs?.length?8:0}}>
                        <p style={{fontSize:'0.50rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(0,180,255,0.55)',margin:0,fontWeight:700}}>
                          Requester Docs ({req.docs?.length||0})
                        </p>
                        {(req.docs?.length||0) > 1 && (
                          <button onClick={()=>req.docs.forEach(d=>downloadDoc(d))}
                            style={{...btnStyle,padding:'2px 9px',fontSize:'0.60rem',color:'rgba(0,200,255,0.90)',border:'1px solid rgba(0,180,255,0.30)',background:'rgba(0,160,255,0.08)',fontWeight:700,flexShrink:0}}>
                            ↓ All
                          </button>
                        )}
                      </div>
                      {req.docs?.length > 0 ? (
                        <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:req.docs.length>5?130:'none',overflowY:req.docs.length>5?'auto':'visible'}}>
                          {req.docs.map((d,i)=>(
                            <button key={i} onClick={()=>downloadDoc(d)}
                              style={{...btnStyle,textAlign:'left',justifyContent:'flex-start',gap:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'0.72rem',color:'rgba(0,200,255,0.88)',border:'1px solid rgba(0,180,255,0.22)',background:'rgba(0,160,255,0.06)'}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              {docName(d)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic'}}>No documents attached by requester</span>
                      )}
                    </div>

                    {/* ── SECTION B: Tool / Project Documents ── */}
                    <div style={{position:'relative',background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.20)',borderRadius:8,padding:'10px 12px'}}>
                      <div style={{position:'absolute',top:4,right:10,fontSize:'3.2rem',fontWeight:900,color:'rgba(168,85,247,1)',opacity:0.22,pointerEvents:'none',lineHeight:1,userSelect:'none',fontFamily:'monospace'}}>1</div>
                      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:7}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.70)" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                        <p style={{fontSize:'0.50rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(168,85,247,0.70)',margin:0,fontWeight:700}}>
                          Tool / Project Docs
                        </p>
                        <span style={{fontSize:'0.56rem',color:'rgba(255,255,255,0.22)',marginLeft:'auto'}}>{req.toolDocs?.length||0} file{(req.toolDocs?.length||0)!==1?'s':''}</span>
                      </div>
                      {/* Existing tool docs list */}
                      {(req.toolDocs||[]).length > 0 && (
                        <div style={{display:'flex',flexDirection:'column',gap:3,marginBottom:7,maxHeight:120,overflowY:'auto',scrollbarWidth:'thin'}}>
                          {req.toolDocs.map((d,i)=>(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
                              <button onClick={()=>downloadDoc(d)}
                                style={{...btnStyle,flex:1,textAlign:'left',justifyContent:'flex-start',gap:7,fontSize:'0.70rem',color:'rgba(196,181,253,0.90)',border:'1px solid rgba(168,85,247,0.28)',background:'rgba(168,85,247,0.07)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:0}}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{d.name||`tool-doc-${i+1}`}</span>
                                {d.verified && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.75)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              </button>
                              {!isOutOfScope && req.reqStatus !== 'completed' && (
                                <button onClick={()=>handleToolDocDelete(i)} title="Remove"
                                  style={{flexShrink:0,width:24,height:24,borderRadius:5,background:'rgba(220,50,50,0.08)',border:'1px solid rgba(220,60,60,0.22)',color:'rgba(220,80,80,0.55)',cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}
                                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.22)';e.currentTarget.style.color='rgba(255,100,100,0.95)';}}
                                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.08)';e.currentTarget.style.color='rgba(220,80,80,0.55)';}}>
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <input type="file" ref={toolUploadRef} style={{display:'none'}} multiple onChange={handleToolDocUpload}/>
                      <button onClick={()=>!toolUploadState && toolUploadRef.current?.click()}
                        disabled={isOutOfScope||req.reqStatus==='completed'||toolUploadState==='uploading'}
                        style={{...btnStyle,opacity:1,
                          cursor:(isOutOfScope||req.reqStatus==='completed')?'not-allowed':toolUploadState==='uploading'?'wait':'pointer',
                          color:toolUploadState==='uploading'?'rgba(168,85,247,0.55)':'rgba(196,181,253,0.85)',
                          border:'1px solid rgba(168,85,247,0.35)',
                          background:'rgba(168,85,247,0.08)',fontWeight:600}}>
                        {toolUploadState==='uploading'
                          ? '⟳ Uploading…'
                          : `↑ ${(req.toolDocs?.length||0)>0?'Add Tool / Project Doc':'Upload Tool / Project Doc'}`}
                      </button>
                    </div>

                    {/* ── Project Value + No of Doors ── */}
                    <div style={{position:'relative',background:'rgba(0,10,30,0.60)',border:'1px solid rgba(0,200,120,0.22)',borderRadius:8,padding:'10px 12px'}}>
                      <div style={{position:'absolute',top:4,right:10,fontSize:'3.2rem',fontWeight:900,color:'rgba(0,220,130,1)',opacity:0.22,pointerEvents:'none',lineHeight:1,userSelect:'none',fontFamily:'monospace'}}>2</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                        <div>
                          <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,200,120,0.45)',marginBottom:6}}>Project Value (AED)</p>
                          <input type="number" value={req.projValue||''} onChange={e=>onUpdate(req.id,{projValue:e.target.value})} placeholder="0.00" min="0" disabled={isRejected}
                            style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,230,140,0.90)',fontFamily:'monospace',fontSize:'1.1rem',fontWeight:700,width:'100%',opacity:isRejected?0.45:1,cursor:isRejected?'not-allowed':'auto'}}/>
                        </div>
                        <div style={{borderLeft:'1px solid rgba(0,200,120,0.15)',paddingLeft:12}}>
                          <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,200,120,0.45)',marginBottom:6}}>No of Doors</p>
                          <input type="number" value={req.numDoors||''} onChange={e=>onUpdate(req.id,{numDoors:e.target.value})} placeholder="0" min="0" disabled={isRejected}
                            style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,230,140,0.90)',fontFamily:'monospace',fontSize:'1.1rem',fontWeight:700,width:'100%',opacity:isRejected?0.45:1,cursor:isRejected?'not-allowed':'auto'}}/>
                        </div>
                      </div>
                    </div>

                    {/* ── SECTION C: Quotation Documents ── */}
                    <div style={{position:'relative',background:'rgba(0,10,30,0.40)',border:'1px solid rgba(255,200,40,0.22)',borderRadius:8,padding:'10px 12px'}}>
                      <div style={{position:'absolute',top:4,right:10,fontSize:'3.2rem',fontWeight:900,color:'rgba(255,200,40,1)',opacity:0.22,pointerEvents:'none',lineHeight:1,userSelect:'none',fontFamily:'monospace'}}>3</div>
                      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:7}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,200,40,0.65)" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <p style={{fontSize:'0.50rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,210,60,0.70)',margin:0,fontWeight:700}}>
                          Quotation Documents
                        </p>
                        <span style={{fontSize:'0.56rem',color:'rgba(255,255,255,0.22)',marginLeft:'auto'}}>{(req.estimationDocs?.length||0)+(req.estimationDoc&&!req.estimationDocs?.length?1:0)} file{((req.estimationDocs?.length||0)+(req.estimationDoc&&!req.estimationDocs?.length?1:0))!==1?'s':''}</span>
                      </div>
                      {/* Existing quotation docs */}
                      {(() => {
                        const eDocs = req.estimationDocs || (req.estimationDoc ? [req.estimationDoc] : []);
                        if (!eDocs.length) return null;
                        return (
                          <div style={{display:'flex',flexDirection:'column',gap:3,marginBottom:7,maxHeight:130,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(52,211,153,0.15) transparent'}}>
                            {eDocs.map((d,i)=>(
                              <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
                                <button onClick={()=>downloadDoc(d)}
                                  style={{...btnStyle,flex:1,textAlign:'left',justifyContent:'flex-start',gap:7,fontSize:'0.72rem',color:'rgba(52,211,153,0.90)',border:'1px solid rgba(52,211,153,0.28)',background:'rgba(52,211,153,0.06)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:0}}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{d.name||`file-${i+1}`}</span>
                                  {d.verified
                                    ? <span title="Verified on Azure" style={{display:'flex',alignItems:'center',gap:2,flexShrink:0}}>
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.65)" strokeWidth="2" title="Azure"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>
                                      </span>
                                    : d.url
                                    ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,0,0.55)" strokeWidth="2" title="Uploaded (not verified)"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>
                                    : null
                                  }
                                </button>
                                {req.reqStatus !== 'completed' && !isOutOfScope && (
                                  <button onClick={()=>handleEstimatorDeleteDoc(i)} title="Remove file"
                                    style={{flexShrink:0,width:26,height:26,borderRadius:6,background:'rgba(220,50,50,0.08)',border:'1px solid rgba(220,60,60,0.22)',color:'rgba(220,80,80,0.55)',cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}
                                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.22)';e.currentTarget.style.color='rgba(255,100,100,0.95)';}}
                                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.08)';e.currentTarget.style.color='rgba(220,80,80,0.55)';}}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      {/* Previously uploaded (rejected/revised reference) */}
                      {(isRejected || isResubmission) && (req.estimationDocs?.length > 0 || req.estimationDoc) && (
                        <div style={{ background:'rgba(255,160,30,0.06)', border:'1px solid rgba(255,160,30,0.22)', borderRadius:7, padding:'8px 12px', marginBottom:7 }}>
                          <p style={{ fontSize:'0.50rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,180,60,0.60)', marginBottom:6, fontWeight:700 }}>
                            Previously Uploaded (reference)
                          </p>
                          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                            {(req.estimationDocs?.length > 0 ? req.estimationDocs : [req.estimationDoc]).filter(Boolean).map((d, i) => (
                              <button key={i} onClick={() => downloadDoc(d)} style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 10px', borderRadius:6, background:'rgba(255,160,30,0.08)', border:'1px solid rgba(255,160,30,0.28)', color:'rgba(255,200,80,0.90)', fontFamily:"'Inter',sans-serif", fontSize:'0.72rem', fontWeight:600, cursor:'pointer', outline:'none', textAlign:'left', width:'100%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                {d.name || `quotation-file-${i + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <input type="file" ref={uploadRef} style={{display:'none'}} multiple onChange={handleEstimatorUpload}/>
                      <button onClick={()=>!quotUploadState && uploadRef.current.click()}
                        disabled={req.reqStatus==='completed'||isOutOfScope||quotUploadState==='uploading'}
                        style={{...btnStyle,opacity:1,cursor:(req.reqStatus==='completed'||isOutOfScope)?'not-allowed':quotUploadState==='uploading'?'wait':'pointer',
                          color:'rgba(255,210,60,0.95)',
                          border:'1px solid rgba(255,200,40,0.40)',
                          background:'rgba(255,180,0,0.10)',fontWeight:700}}>
                        {quotUploadState==='uploading'
                          ? '⟳ Uploading — Please Wait…'
                          : `↑ ${(req.estimationDocs?.length||0)>0?'Add / Replace Quotation':'Upload Quotation'}`}
                      </button>
                    </div>

                  </div>
                  {/* Estimator Comments */}
                  <div style={{background:'rgba(0,10,30,0.60)',border:'1px solid rgba(255,200,80,0.22)',borderRadius:8,padding:'10px 12px'}}>
                    <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,200,80,0.45)',marginBottom:6}}>Estimator Comments</p>
                    <textarea value={req.estimatorComments||''} onChange={e=>onUpdate(req.id,{estimatorComments:e.target.value})} placeholder="Add comments, notes or scope clarifications…" rows={3} disabled={isRejected}
                      style={{background:'transparent',border:'none',outline:'none',color:'rgba(255,230,140,0.88)',fontFamily:F2,fontSize:'0.84rem',fontWeight:400,width:'100%',resize:'vertical',lineHeight:1.55,opacity:isRejected?0.45:1,cursor:isRejected?'not-allowed':'auto'}}/>
                  </div>
{/* ── Submit to Director — inside card, below comments ── */}
{isRejected ? (
  <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'rgba(200,40,40,0.10)',border:'1px solid rgba(220,60,60,0.40)',borderRadius:8}}>
    <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,80,80,0.95)',boxShadow:'0 0 8px rgba(255,60,60,0.70)',flexShrink:0}}/>
    <div style={{display:'flex',flexDirection:'column',gap:2}}>
      <span style={{fontSize:'0.80rem',fontWeight:700,color:'rgba(255,100,100,0.95)',letterSpacing:'0.04em'}}>Rejected — Final Decision</span>
      <span style={{fontSize:'0.68rem',color:'rgba(255,160,160,0.55)'}}>This request has been rejected by Cost-Artist and cannot be resubmitted.</span>
    </div>
  </div>
) : req.reqStatus === 'pending-director' ? (
  <div style={{display:'flex',flexDirection:'column',gap:6}}>
    {/* Status pill */}
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(140,80,255,0.08)',border:'1px solid rgba(180,130,255,0.25)',borderRadius:8}}>
      <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(180,130,255,0.95)',boxShadow:'0 0 8px rgba(180,130,255,0.7)',flexShrink:0,animation:'pulse 1.8s ease-in-out infinite'}}/>
      <span style={{fontSize:'0.80rem',color:'rgba(180,130,255,0.90)',fontWeight:600,flex:1}}>Under Review by Cost-Artist</span>
    </div>
    {/* Recall button */}
    <button
      onClick={()=>{
        const ts = new Date().toISOString();
        onUpdate(req.id,{
          status:'Pending Estimation',
          reqStatus:'inprogress',
          directorAction:null,
          directorNote:'',
          directorRespondedAt:null,
          timeline:[...(req.timeline||[]),{event:'recalled',ts,label:'Recalled for Correction',by:req.estimator||''}]
        });
      }}
      style={{width:'100%',padding:'8px 0',borderRadius:8,background:'rgba(255,160,30,0.08)',border:'1px solid rgba(255,160,30,0.30)',color:'rgba(255,185,60,0.85)',fontFamily:F2,fontSize:'0.78rem',fontWeight:700,cursor:'pointer',outline:'none',letterSpacing:'0.05em',transition:'background 0.15s'}}
      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,160,30,0.18)'}
      onMouseLeave={e=>e.currentTarget.style.background='rgba(255,160,30,0.08)'}
    >
      ↩ Recall for Correction
    </button>
  </div>
) : isOutOfScope ? (
  <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'rgba(200,40,40,0.10)',border:'1px solid rgba(220,60,60,0.40)',borderRadius:8}}>
    <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,80,80,0.95)',boxShadow:'0 0 8px rgba(255,60,60,0.70)',flexShrink:0}}/>
    <div style={{flex:1}}>
      <div style={{fontSize:'0.80rem',fontWeight:700,color:'rgba(255,100,100,0.95)'}}>Out of Scope — Timeline Frozen</div>
      <div style={{fontSize:'0.68rem',color:'rgba(255,160,160,0.55)',marginTop:2}}>Use the recall button above to re-open this request.</div>
    </div>
  </div>
) : (
  <>
    {req.directorAction === 'revised' && (
      <div style={{padding:'10px 14px',borderRadius:8,background:'rgba(255,160,30,0.10)',border:'1px solid rgba(255,160,30,0.35)',display:'flex',flexDirection:'column',gap:4}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(255,170,30,0.95)',flexShrink:0}}/>
          <span style={{fontSize:'0.75rem',fontWeight:700,color:'rgba(255,190,60,0.95)',letterSpacing:'0.04em'}}>
            Correction Required — Upload revised quotation and re-submit for Cost-Artist Approval
          </span>
        </div>
        {req.directorNote && <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)',paddingLeft:15,lineHeight:1.5}}>{req.directorNote}</div>}
      </div>
    )}
    <button
      onClick={() => {
        if (canSendToDirector) {
          const ts = new Date().toISOString();
          onUpdate(req.id, {
            status: 'Pending Approval',
            reqStatus: 'pending-director',
            directorAction: null,
            directorNote: '',
            directorRespondedAt: null,
            quotationSubmittedAt: ts,
            timeline: [
              ...(req.timeline || []),
              {
                event: 'quoted',
                ts: ts,
                label: isResubmission ? 'Quotation Resubmitted' : 'Quotation Submitted',
                by: req.estimator || ''
              }
            ]
          });
          setResubmitToast(true);
          setTimeout(() => setResubmitToast(false), 3000);
        }
      }}
      disabled={!canSendToDirector}
      title={
        !canSendToDirector
          ? 'Requires: ' +
            ((req.estimationDocs?.length || 0) < minFiles
              ? `${minFiles - (req.estimationDocs?.length || 0)} more quoted file(s)`
              : !allDocsVerified
              ? 'all uploaded files must be verified on Azure'
              : '') +
            (((req.estimationDocs?.length || 0) < minFiles || !allDocsVerified) && !req.projValue ? ' & ' : '') +
            (!req.projValue ? 'quoted value' : '')
          : ''
      }
      style={{
        width: '100%',
        padding: '11px 0',
        borderRadius: 100,
        background: canSendToDirector
          ? 'linear-gradient(105deg,#0f0c3a,#1e40af 30%,#6d28d9 55%,#a855f7 75%,#00e5ff 100%)'
          : 'rgba(255,255,255,0.04)',
        backgroundSize: '220% 220%',
        animation: canSendToDirector
          ? 'auroraShift 5s ease-in-out infinite'
          : 'none',
        border: canSendToDirector
          ? '1px solid rgba(0,220,255,0.25)'
          : '1px solid rgba(255,255,255,0.07)',
        color: canSendToDirector ? '#fff' : 'rgba(255,255,255,0.22)',
        fontFamily: F2,
        fontSize: '0.88rem',
        fontWeight: 700,
        cursor: canSendToDirector ? 'pointer' : 'not-allowed',
        letterSpacing: '0.06em',
        boxShadow: canSendToDirector
          ? '0 4px 22px rgba(0,140,255,0.28)'
          : 'none',
        outline: 'none'
      }}
    >
      {isRejected ? '↺ Resubmit After Rejection for Re-Review' : isResubmission ? '↺ Re-submit with Revised Quote for Cost-Artist Approval' : '✦ Submit to Cost-Artist for Approval'}
    </button>

    {resubmitToast && (
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',background:'rgba(0,200,120,0.12)',border:'1px solid rgba(0,220,130,0.40)',borderRadius:8,animation:'fadeUp 0.2s ease both'}}>
        <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(0,220,130,0.95)',boxShadow:'0 0 8px rgba(0,200,110,0.70)',flexShrink:0}}/>
        <span style={{fontSize:'0.80rem',fontWeight:600,color:'rgba(0,230,140,0.95)'}}>
          {isResubmission ? 'Revised quote submitted — now under Cost-Artist review.' : 'Submitted — request is now under Cost-Artist review.'}
        </span>
      </div>
    )}

    {!canSendToDirector && req.reqStatus !== 'completed' && (
      <div
        style={{
          fontSize: '0.58rem',
          color: 'rgba(255,180,80,0.65)',
          textAlign: 'center',
          marginTop: 4,
          letterSpacing: '0.04em'
        }}
      >
        {(req.estimationDocs?.length || 0) < minFiles && (
          <span>
            Attach {minFiles - (req.estimationDocs?.length || 0)} more quoted file
            {minFiles - (req.estimationDocs?.length || 0) !== 1 ? 's' : ''}
          </span>
        )}

        {(req.estimationDocs?.length || 0) < minFiles && !req.projValue && (
          <span> · </span>
        )}

        {!req.projValue && <span>Enter quoted value</span>}
      </div>
    )}
  </>
)}
                  {/* ── RFI button + inline form ── */}
                  {!isOutOfScope && !isRFI && req.reqStatus !== 'pending-director' && !isRejected && (
                    <div style={{marginTop:4}}>
                      {oosMode ? (
                        <div style={{display:'flex',flexDirection:'column',gap:8,padding:'12px 14px',background:'rgba(180,120,0,0.09)',border:'1px solid rgba(251,191,36,0.38)',borderRadius:10}}>
                          <div style={{fontSize:'0.56rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(251,191,36,0.85)',fontWeight:700}}>📋 RFI — Request for Information</div>
                          <textarea
                            value={oosRemark}
                            onChange={e=>setOosRemark(e.target.value)}
                            placeholder="Mandatory: describe what information or documents are needed from sales…"
                            rows={3}
                            style={{width:'100%',background:'rgba(180,120,0,0.07)',border:'1px solid rgba(251,191,36,0.30)',borderRadius:8,color:'rgba(255,235,160,0.90)',fontFamily:F2,fontSize:'0.82rem',padding:'9px 12px',outline:'none',resize:'vertical',lineHeight:1.55,boxSizing:'border-box'}}
                          />
                          <div style={{display:'flex',gap:8}}>
                            <button onClick={()=>{setOosMode(false);setOosRemark('');}}
                              style={{flex:1,padding:'8px 0',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.40)',fontFamily:F2,fontSize:'0.76rem',cursor:'pointer',outline:'none'}}>
                              Cancel
                            </button>
                            <button
                              disabled={!oosRemark.trim()}
                              onClick={()=>{
                                if(!oosRemark.trim()) return;
                                const nowMs = Date.now();
                                onUpdate(req.id, {
                                  reqStatus: 'rfi',
                                  status: 'RFI - Awaiting Info from Sales',
                                  rfiRemark: oosRemark.trim(),
                                  rfiAt: nowMs,
                                  rfiBy: req.estimator || 'estimator',
                                  rfiSubmitted: true,
                                  rfiNotification: { tsMs: nowMs, ts: new Date(nowMs).toISOString() },
                                  _immediate: true,
                                  timeline: [...(req.timeline||[]), {
                                    event: 'rfi',
                                    ts: new Date(nowMs).toISOString(),
                                    tsMs: nowMs,
                                    label: 'RFI — Estimator Requested More Information',
                                    by: req.estimator || 'estimator',
                                    remark: oosRemark.trim(),
                                  }],
                                });
                                setOosMode(false);
                                setOosRemark('');
                              }}
                              style={{flex:2,padding:'8px 0',borderRadius:8,background:oosRemark.trim()?'rgba(180,120,0,0.25)':'rgba(255,255,255,0.03)',border:`1px solid ${oosRemark.trim()?'rgba(251,191,36,0.55)':'rgba(255,255,255,0.08)'}`,color:oosRemark.trim()?'rgba(251,191,36,0.95)':'rgba(255,255,255,0.20)',fontFamily:F2,fontSize:'0.80rem',fontWeight:700,cursor:oosRemark.trim()?'pointer':'not-allowed',outline:'none',transition:'all 0.15s'}}>
                              📋 Send RFI to Sales
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={()=>setOosMode(true)}
                          style={{width:'100%',padding:'9px 0',borderRadius:8,background:'rgba(180,120,0,0.07)',border:'1px solid rgba(251,191,36,0.24)',color:'rgba(251,191,36,0.70)',fontFamily:F2,fontSize:'0.78rem',fontWeight:600,cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:7,transition:'all 0.15s'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(180,120,0,0.18)';e.currentTarget.style.borderColor='rgba(251,191,36,0.55)';e.currentTarget.style.color='rgba(251,191,36,0.95)';}}
                          onMouseLeave={e=>{e.currentTarget.style.background='rgba(180,120,0,0.07)';e.currentTarget.style.borderColor='rgba(251,191,36,0.24)';e.currentTarget.style.color='rgba(251,191,36,0.70)';}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          RFI — Request for Information
                        </button>
                      )}
                    </div>
                  )}
                  {/* ── RFI active banner (estimator view) ── */}
                  {isRFI && (
                    <div style={{marginTop:4,padding:'10px 14px',background:'rgba(180,120,0,0.10)',border:'1px solid rgba(251,191,36,0.35)',borderRadius:10,display:'flex',flexDirection:'column',gap:6}}>
                      <div style={{fontSize:'0.56rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(251,191,36,0.85)',fontWeight:700}}>📋 RFI Sent — Awaiting Info from Sales</div>
                      {req.rfiRemark && <div style={{fontSize:'0.74rem',color:'rgba(255,230,140,0.75)',lineHeight:1.5,borderLeft:'2px solid rgba(251,191,36,0.35)',paddingLeft:8}}>"{req.rfiRemark}"</div>}
                      <div style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.28)'}}>Sent by {req.rfiBy||'estimator'}{req.rfiAt ? ` · ${new Date(req.rfiAt).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}` : ''}</div>
                    </div>
                  )}
                </div>

                {/* Director's Remarks — shown after Submit button */}
                {req.directorAction && req.directorAction !== 'out-of-scope' && (
                  (() => {
                    const isApproved = req.directorAction === 'approved' || req.reqStatus === 'completed';
                    const isRejected = req.directorAction === 'rejected';
                    const cfg = isApproved
                      ? {bg:'rgba(0,200,100,0.06)',bd:'rgba(0,200,100,0.22)',dot:'rgba(0,220,120,0.90)',statusLabel:'Approved',statusSub:'Submitted to Sales / Requester & Estimator'}
                      : isRejected
                      ? {bg:'rgba(220,60,60,0.06)',bd:'rgba(220,60,60,0.24)',dot:'rgba(255,90,90,0.95)',statusLabel:'Rejected',statusSub:'Request is permanently rejected'}
                      : {bg:'rgba(255,160,40,0.06)',bd:'rgba(255,160,40,0.24)',dot:'rgba(255,180,60,0.95)',statusLabel:'Correction Required',statusSub:'Upload revised quotation and re-submit'};
                    return (
                      <div style={{background:cfg.bg,border:`1px solid ${cfg.bd}`,borderRadius:10,padding:'14px 16px',display:'flex',flexDirection:'column',gap:10}}>
                        <span style={{fontSize:'0.56rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:600}}>Cost-Artist's Remarks</span>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{width:7,height:7,borderRadius:'50%',background:cfg.dot,boxShadow:`0 0 6px ${cfg.dot}`,flexShrink:0}}/>
                          <span style={{fontSize:'0.78rem',fontWeight:700,color:cfg.dot}}>{cfg.statusLabel}</span>
                          <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.35)',marginLeft:2}}>— {cfg.statusSub}</span>
                        </div>
                        {req.directorNote && (
                          <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.65)',lineHeight:1.55,margin:0,paddingLeft:15,borderLeft:`2px solid ${cfg.dot}40`}}>{req.directorNote}</p>
                        )}
                        {req.revisedMargin && (
                          <p style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.40)',margin:0,paddingLeft:15}}>Suggested margin: <strong style={{color:'rgba(255,255,255,0.65)'}}>{req.revisedMargin}%</strong></p>
                        )}
                      </div>
                    );
                  })()
                )}

              </div>)}
            </div>
            {/* ── 3rd column: Conversation (estimator view only) ── */}
            {viewMode === 'estimator' && (<>
              {/* Drag handle — middle / right */}
              {!convoCollapsed && (
                <div onMouseDown={e=>startColDrag('right',e)}
                  onMouseEnter={e=>{const bar=e.currentTarget.firstChild;if(bar)bar.style.background='rgba(168,85,247,0.70)';}}
                  onMouseLeave={e=>{const bar=e.currentTarget.firstChild;if(bar)bar.style.background='rgba(168,85,247,0.22)';}}
                  style={{width:10,flexShrink:0,cursor:'col-resize',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 5px',zIndex:5,userSelect:'none'}}
                  title="Drag to resize">
                  <div style={{width:2,height:'50%',borderRadius:2,background:'rgba(168,85,247,0.22)',transition:'background 0.2s',pointerEvents:'none'}}/>
                </div>
              )}
              {convoCollapsed ? (
                /* Minimized strip */
                <div style={{width:44,flexShrink:0,background:'rgba(109,40,217,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:14,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',padding:'14px 0',position:'sticky',top:62,height:'100%',minHeight:200,cursor:'pointer'}} onClick={()=>setConvoCollapsed(false)}>
                  <button onClick={e=>{e.stopPropagation();setConvoCollapsed(false);}} title="Expand conversation"
                    style={{width:28,height:28,borderRadius:8,background:'rgba(168,85,247,0.18)',border:'1px solid rgba(168,85,247,0.35)',color:'rgba(168,85,247,0.90)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',outline:'none',flexShrink:0}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <div style={{writingMode:'vertical-rl',textOrientation:'mixed',transform:'rotate(180deg)',fontSize:'0.52rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(168,85,247,0.60)',fontWeight:700,userSelect:'none'}}>
                    Conversation
                    {(req.conversation||[]).length > 0 && <span style={{display:'block',fontSize:'0.60rem',color:'rgba(168,85,247,0.90)',fontWeight:800,letterSpacing:'0',marginTop:6,textAlign:'center'}}>{(req.conversation||[]).length}</span>}
                  </div>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(168,85,247,0.70)',boxShadow:'0 0 6px rgba(168,85,247,0.60)',flexShrink:0}}/>
                </div>
              ) : (
                /* Expanded panel */
                <>
                <div style={{width:colRightW,flexShrink:0,background:'rgba(109,40,217,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:14,padding:'18px 18px 14px',display:'flex',flexDirection:'column',gap:12,height:'100%',minHeight:560,position:'sticky',top:62}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,paddingBottom:10,borderBottom:'1px solid rgba(168,85,247,0.18)',position:'relative'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(168,85,247,0.90)',boxShadow:'0 0 8px rgba(168,85,247,0.70)',flexShrink:0}}/>
                    <p style={{fontSize:'0.60rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(168,85,247,0.85)',margin:0,fontWeight:700}}>Conversation</p>
                    {req.salesPerson && <span style={{fontSize:'0.65rem',color:'rgba(160,130,255,0.60)',fontWeight:500}}>with {req.salesPerson}</span>}
                    {/* Participants + add button */}
                    <div ref={dashAddPplRef} style={{display:'flex',alignItems:'center',gap:5,marginLeft:'auto'}}>
                      {(req.chatParticipants||[]).map((p,pi)=>(
                        <div key={pi} title={p.name}><EstAvatar name={p.name} code={p.code} size={22}/></div>
                      ))}
                      <button onClick={()=>{setShowDashAddPpl(o=>!o);setDashAddPplQ('');}}
                        title="Add person to conversation"
                        style={{width:24,height:24,borderRadius:'50%',background:'rgba(168,85,247,0.18)',border:'1px solid rgba(168,85,247,0.40)',color:'rgba(168,85,247,0.95)',fontSize:'1.1rem',lineHeight:1,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,outline:'none',fontWeight:300}}>+</button>
                      {showDashAddPpl && (
                        <div style={{position:'absolute',top:'calc(100% + 8px)',right:32,zIndex:300,background:'rgba(10,5,26,0.98)',border:'1px solid rgba(168,85,247,0.38)',borderRadius:10,padding:'10px',width:230,boxShadow:'0 12px 44px rgba(0,0,0,0.70)',backdropFilter:'blur(16px)'}}>
                          <div style={{fontSize:'0.50rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(168,85,247,0.60)',fontWeight:700,marginBottom:8}}>Add to conversation</div>
                          <input value={dashAddPplQ} onChange={e=>setDashAddPplQ(e.target.value)} placeholder="Search name…"
                            autoFocus
                            style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:6,padding:'6px 10px',color:'rgba(255,255,255,0.82)',fontFamily:F2,fontSize:'0.76rem',outline:'none',marginBottom:6,boxSizing:'border-box'}}/>
                          <div style={{maxHeight:180,overflowY:'auto',display:'flex',flexDirection:'column',gap:2}}>
                            {FULL_STAFF
                              .filter(s => !(req.chatParticipants||[]).some(p=>p.code===s.code))
                              .filter(s => !dashAddPplQ || s.name.toLowerCase().includes(dashAddPplQ.toLowerCase()))
                              .map(s => (
                                <div key={s.code}
                                  onClick={()=>{ onUpdate(req.id,{chatParticipants:[...(req.chatParticipants||[]),{name:s.name,code:s.code,role:s.role}]}); setShowDashAddPpl(false); setDashAddPplQ(''); }}
                                  style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',borderRadius:7,cursor:'pointer',transition:'background 0.15s'}}
                                  onMouseEnter={e=>e.currentTarget.style.background='rgba(168,85,247,0.18)'}
                                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                  <EstAvatar name={s.name} code={s.code} size={24}/>
                                  <div style={{display:'flex',flexDirection:'column',gap:1,minWidth:0}}>
                                    <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.82)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</span>
                                    <span style={{fontSize:'0.50rem',color:s.role==='sales'?'rgba(255,200,80,0.60)':'rgba(100,200,255,0.55)',letterSpacing:'0.08em',textTransform:'uppercase'}}>{s.role}</span>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={()=>setConvoCollapsed(true)} title="Minimize conversation"
                      style={{width:26,height:26,borderRadius:7,background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.28)',color:'rgba(168,85,247,0.80)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',outline:'none',flexShrink:0}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                  {/* Messages */}
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:10,overflowY:'auto',paddingRight:4,scrollbarWidth:'thin',scrollbarColor:'rgba(168,85,247,0.20) transparent'}}>
                    {(req.conversation||[]).length === 0 ? (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:12,opacity:0.45}}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.70)" strokeWidth="1.4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.28)',margin:0,fontStyle:'italic',textAlign:'center',lineHeight:1.5}}>No messages yet.<br/>Start the conversation.</p>
                      </div>
                    ) : (req.conversation||[]).map((msg,i)=>{
                      const isEst = msg.role==='estimator';
                      return (
                        <div key={i} style={{display:'flex',flexDirection:'column',alignItems:isEst?'flex-end':'flex-start'}}>
                          <div style={{maxWidth:'88%',background:isEst?'rgba(109,40,217,0.28)':'rgba(255,255,255,0.06)',border:isEst?'1px solid rgba(168,85,247,0.35)':'1px solid rgba(255,255,255,0.10)',borderRadius:isEst?'14px 14px 3px 14px':'14px 14px 14px 3px',padding:'9px 13px'}}>
                            <div style={{fontSize:'0.58rem',color:isEst?'rgba(196,181,253,0.70)':'rgba(100,200,255,0.65)',marginBottom:4,fontWeight:600}}>{msg.from} · {msg.ts}</div>
                            <div style={{fontSize:'0.86rem',color:'rgba(255,255,255,0.86)',lineHeight:1.5}}>{msg.text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Input */}
                  <div style={{display:'flex',gap:9,alignItems:'flex-end',paddingTop:10,borderTop:'1px solid rgba(168,85,247,0.14)'}}>
                    <textarea value={convoInput} onChange={e=>setConvoInput(e.target.value)}
                      onKeyDown={e=>{
                        if(e.key==='Enter'&&!e.shiftKey){
                          e.preventDefault();
                          if(!convoInput.trim())return;
                          const ts=new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
                          onUpdate(req.id,{conversation:[...(req.conversation||[]),{from:req.estimator||'Estimator',role:'estimator',text:convoInput.trim(),ts,tsMs:Date.now()}]});
                          setConvoInput('');
                        }
                      }}
                      placeholder="Type a message…&#10;Enter to send · Shift+Enter for newline"
                      rows={3}
                      style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(168,85,247,0.28)',borderRadius:10,padding:'10px 13px',color:'#e2e8f0',fontFamily:F2,fontSize:'0.86rem',outline:'none',resize:'none',lineHeight:1.5}}
                    />
                    <button onClick={()=>{
                      if(!convoInput.trim())return;
                      const ts=new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
                      onUpdate(req.id,{conversation:[...(req.conversation||[]),{from:req.estimator||'Estimator',role:'estimator',text:convoInput.trim(),ts,tsMs:Date.now()}]});
                      setConvoInput('');
                    }}
                      style={{width:42,height:42,borderRadius:10,flexShrink:0,background:'rgba(109,40,217,0.55)',border:'1px solid rgba(168,85,247,0.50)',color:'#e2d9ff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',alignSelf:'flex-end'}}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                </div>

              {/* ── Request History ── */}
              {(() => {
                const fmtTs = ms => ms ? new Date(ms).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}) : null;
                const subMs = req.submittedAt || (req.date ? new Date(req.date).getTime() : null);
                const events = [
                  {label:'Submitted',      ts:subMs,                  c:'rgba(120,180,255,0.90)'},
                  {label:'Estimator Assigned', ts:req.taggedAt,       c:'rgba(255,200,50,0.90)'},
                  {label:'Sent to Cost-Artist', ts:req.quotationSubmittedAt ? new Date(req.quotationSubmittedAt).getTime() : null, c:'rgba(168,85,247,0.90)'},
                  {label:`Cost-Artist ${req.directorAction||'Reviewed'}`, ts:req.directorRespondedAt ? new Date(req.directorRespondedAt).getTime() : null, c:'rgba(0,220,130,0.90)'},
                ].filter(ev => ev.ts);
                return (
                  <div style={{marginTop:8,background:'rgba(0,10,30,0.40)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,overflow:'hidden',flexShrink:0}}>
                    <button onClick={()=>setHistOpen(v=>!v)}
                      style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'9px 13px',background:'transparent',border:'none',cursor:'pointer',outline:'none',color:'rgba(255,255,255,0.60)'}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(100,180,255,0.70)" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span style={{fontSize:'0.50rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(100,180,255,0.70)',fontWeight:700,flex:1,textAlign:'left'}}>Request History</span>
                      <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.25)'}}>{events.length} events</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2.5">
                        {histOpen ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                      </svg>
                    </button>
                    {histOpen && (
                      <div style={{padding:'4px 13px 12px',display:'flex',flexDirection:'column',gap:0}}>
                        {events.length === 0 ? (
                          <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic',margin:'8px 0'}}>No history yet.</p>
                        ) : events.map((ev,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,position:'relative'}}>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                              <div style={{width:8,height:8,borderRadius:'50%',background:ev.c,marginTop:11,boxShadow:`0 0 6px ${ev.c}`}}/>
                              {i < events.length - 1 && <div style={{width:1.5,height:28,background:'rgba(255,255,255,0.08)',marginTop:2}}/>}
                            </div>
                            <div style={{paddingTop:7,paddingBottom:4}}>
                              <div style={{fontSize:'0.72rem',fontWeight:600,color:'rgba(255,255,255,0.80)'}}>{ev.label}</div>
                              <div style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.30)',marginTop:2}}>{fmtTs(ev.ts)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              </>
              )}
            </>)}
          </div>
        )}

        {/* ── DIRECTOR view: 3-panel layout ── */}
        {viewMode === 'director' && (() => {
          const GLASSY = 'linear-gradient(135deg,rgba(255,255,255,1) 0%,rgba(255,255,255,0.88) 40%,rgba(255,255,255,0.72) 60%,rgba(255,255,255,0.96) 100%)';
          const DA = [{v:'approved',label:'Approve ✓',c:'#00e5b0',bg:'rgba(0,229,176,0.10)',bd:'rgba(0,229,176,0.38)'},{v:'revised',label:'Revise',c:'rgba(120,180,255,0.95)',bg:'rgba(80,140,255,0.10)',bd:'rgba(120,180,255,0.40)'},{v:'rejected',label:'Reject ✗',c:'rgba(255,90,90,0.95)',bg:'rgba(215,45,45,0.10)',bd:'rgba(215,55,55,0.40)'},{v:'out-of-scope',label:'Out of Scope ⊘',c:'rgba(255,80,80,0.95)',bg:'rgba(200,40,40,0.10)',bd:'rgba(220,60,60,0.40)'}];
          const histReqs = requests.filter(r => r.id !== req.id && (r.client === req.client || r.proj === req.proj));
          const DlIco = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
          const inpStyle = {width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:6,color:'rgba(255,255,255,0.92)',fontFamily:F2,fontSize:'0.80rem',padding:'4px 8px',outline:'none',boxSizing:'border-box',fontWeight:500};

          return (
            <div style={{display:'flex',flexDirection:'column',flex:1,minHeight:0,overflow:'hidden'}}>

              {/* ═══ MAIN 3-COLUMN CONTENT ═══ */}
              <div style={{display:'flex',gap:10,flex:1,minHeight:0}}>

                {/* ═══ LEFT: Project Info + Decision Controls ═══ */}
                <div style={{width:'30%',minWidth:220,display:'flex',flexDirection:'column',gap:8,minHeight:0,overflow:'hidden'}}>

                  {/* Project info — scrollable */}
                  <div style={{flex:1,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.08) transparent',paddingRight:2}}>
                    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:12,padding:'13px 14px',backdropFilter:'blur(20px)'}}>

                      {/* Header: name + Edit toggle */}
                      <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:10}}>
                        <div style={{width:3,height:28,borderRadius:2,background:'linear-gradient(180deg,rgba(255,255,255,0.70),rgba(255,255,255,0.06))',flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:'0.42rem',color:'rgba(255,255,255,0.26)',letterSpacing:'0.16em',textTransform:'uppercase',fontWeight:600,marginBottom:2}}>Project Brief</div>
                          {dirEditMode ? (
                            <input value={req.proj||''} onChange={e=>onUpdate(req.id,{proj:e.target.value})} style={{...inpStyle,fontSize:'0.90rem',fontWeight:800}} placeholder="Project name"/>
                          ) : (
                            <div style={{fontSize:'0.92rem',fontWeight:900,background:GLASSY,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1.1,overflow:'hidden',textOverflow:'ellipsis'}}>{req.proj||'—'}</div>
                          )}
                        </div>
                        <button onClick={()=>setDirEditMode(v=>!v)}
                          style={{flexShrink:0,padding:'3px 10px',borderRadius:20,border:dirEditMode?'1px solid rgba(0,220,130,0.50)':'1px solid rgba(255,255,255,0.15)',background:dirEditMode?'rgba(0,220,130,0.12)':'rgba(255,255,255,0.05)',color:dirEditMode?'rgba(0,220,130,0.90)':'rgba(255,255,255,0.40)',fontFamily:F2,fontSize:'0.56rem',fontWeight:700,cursor:'pointer',outline:'none',letterSpacing:'0.06em'}}>
                          {dirEditMode ? '✓ Done' : 'Edit'}
                        </button>
                      </div>

                      {/* Badges */}
                      <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8,alignItems:'center'}}>
                        {dirEditMode ? (
                          <select value={req.deal||''} onChange={e=>onUpdate(req.id,{deal:e.target.value})}
                            style={{fontSize:'0.60rem',fontWeight:700,color:req.deal==='Job In Hand'?'rgba(255,215,0,0.90)':req.deal==='Tender'?'rgba(79,255,223,0.90)':'rgba(160,130,255,0.80)',background:'rgba(0,0,0,0.55)',border:`1px solid ${req.deal==='Job In Hand'?'rgba(255,215,0,0.40)':req.deal==='Tender'?'rgba(79,255,223,0.40)':'rgba(160,130,255,0.35)'}`,borderRadius:20,padding:'3px 10px',outline:'none',cursor:'pointer',fontFamily:F2,letterSpacing:'0.06em',appearance:'none',WebkitAppearance:'none'}}>
                            <option value="">— Select Deal Type —</option>
                            <option value="Job In Hand">Job In Hand</option>
                            <option value="Tender">Tender</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <span style={{fontSize:'0.60rem',fontWeight:600,color:req.deal==='Job In Hand'?'rgba(255,215,0,0.85)':req.deal==='Tender'?'rgba(79,255,223,0.85)':'rgba(255,255,255,0.70)',background:req.deal==='Job In Hand'?'rgba(255,215,0,0.10)':req.deal==='Tender'?'rgba(79,255,223,0.10)':'rgba(255,255,255,0.07)',border:`1px solid ${req.deal==='Job In Hand'?'rgba(255,215,0,0.28)':req.deal==='Tender'?'rgba(79,255,223,0.28)':'rgba(255,255,255,0.15)'}`,borderRadius:20,padding:'2px 8px'}}>{req.deal||'—'}</span>
                        )}
                        {req.supplyOnly && <span style={{fontSize:'0.60rem',fontWeight:600,color:'rgba(0,200,255,0.85)',background:'rgba(0,200,255,0.08)',border:'1px solid rgba(0,200,255,0.20)',borderRadius:20,padding:'2px 8px'}}>Supply Only</span>}
                        {req.supplyInstall && <span style={{fontSize:'0.60rem',fontWeight:600,color:'rgba(160,100,255,0.85)',background:'rgba(140,80,255,0.08)',border:'1px solid rgba(160,100,255,0.20)',borderRadius:20,padding:'2px 8px'}}>S + I</span>}
                      </div>

                      {/* Margin Breakdown (Cost-Artist only) + Value */}
                      <style>{`input[type=number].no-spin::-webkit-inner-spin-button,input[type=number].no-spin::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number].no-spin{-moz-appearance:textfield}`}</style>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10,paddingBottom:10,borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                        {/* Margin — editable in edit mode */}
                        <div style={{background:'rgba(0,200,255,0.05)',border:'1px solid rgba(0,200,255,0.16)',borderRadius:7,padding:'7px 10px'}}>
                          <div style={{fontSize:'0.42rem',color:'rgba(0,200,255,0.50)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:5}}>Margin</div>
                          {dirEditMode ? (
                            <div style={{display:'flex',flexDirection:'column',gap:3}}>
                              {[['Overhead','overhead',100,0.5],['Profit','profit',100,0.5],['Warranty %','warrantyPct',50,0.5]].map(([lbl,field,max,step])=>(
                                <div key={field} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:4}}>
                                  <span style={{fontSize:'0.44rem',color:'rgba(0,200,255,0.38)',letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{lbl}</span>
                                  <div style={{display:'flex',alignItems:'baseline',gap:1}}>
                                    <input className="no-spin" type="number" value={req[field]||''} placeholder="0" min="0" max={max} step={step}
                                      onChange={e=>{const v=e.target.value;const oh=field==='overhead'?v:req.overhead||0;const pr=field==='profit'?v:req.profit||0;const wp=field==='warrantyPct'?v:req.warrantyPct||0;onUpdate(req.id,{[field]:v,margin:(parseFloat(oh)+parseFloat(pr)+parseFloat(wp)).toFixed(1)});}}
                                      style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,210,255,0.92)',fontFamily:'monospace',fontSize:'0.88rem',fontWeight:700,width:'36px',textAlign:'right'}}/>
                                    <span style={{fontSize:'0.58rem',color:'rgba(0,200,255,0.40)',fontFamily:'monospace'}}>%</span>
                                  </div>
                                </div>
                              ))}
                              <div style={{borderTop:'1px solid rgba(0,200,255,0.12)',paddingTop:3,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                                <span style={{fontSize:'0.44rem',color:'rgba(0,200,255,0.55)',letterSpacing:'0.08em',textTransform:'uppercase'}}>Total</span>
                                <span style={{fontFamily:'monospace',fontSize:'1.0rem',fontWeight:800,background:'linear-gradient(135deg,rgba(0,230,255,1) 0%,rgba(100,180,255,0.85) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1}}>
                                  {(()=>{const t=(parseFloat(req.overhead||0)+parseFloat(req.profit||0)+parseFloat(req.warrantyPct||0)).toFixed(1);return t==='0.0'?'—':t+'%';})()}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div style={{display:'flex',alignItems:'baseline',gap:1}}>
                              <span style={{fontSize:'1.1rem',fontWeight:900,fontFamily:'monospace',background:'linear-gradient(135deg,rgba(0,230,255,1) 0%,rgba(100,180,255,0.85) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1}}>{req.margin||'—'}</span>
                              {req.margin && <span style={{fontSize:'0.68rem',color:'rgba(0,200,255,0.50)',fontFamily:'monospace'}}>%</span>}
                            </div>
                          )}
                        </div>
                        <div style={{background:'rgba(0,220,130,0.05)',border:'1px solid rgba(0,220,130,0.16)',borderRadius:7,padding:'7px 10px'}}>
                          <div style={{fontSize:'0.42rem',color:'rgba(0,220,130,0.50)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:3}}>Value (AED)</div>
                          <div style={{fontSize:'0.78rem',fontWeight:800,fontFamily:'monospace',background:'linear-gradient(135deg,rgba(0,240,160,1) 0%,rgba(0,200,255,0.80) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1.2}}>{req.projValue?Number(req.projValue).toLocaleString('en-AE'):'—'}</div>
                        </div>
                      </div>

                      {/* Customer rank */}
                      {req.customerRank > 0 && (() => {
                        const rc=['','rgba(205,127,50,0.95)','rgba(180,180,200,0.95)','rgba(255,200,0,0.95)','rgba(100,220,255,0.95)','rgba(200,130,255,0.95)'][req.customerRank];
                        return (<div style={{display:'flex',alignItems:'center',gap:5,marginBottom:8}}><span style={{fontSize:'0.44rem',color:'rgba(255,255,255,0.26)',letterSpacing:'0.12em',textTransform:'uppercase'}}>Customer</span>{[1,2,3,4,5].map(n=>(<span key={n} style={{fontSize:'0.78rem',color:req.customerRank>=n?rc:'rgba(255,255,255,0.10)',filter:req.customerRank>=n?`drop-shadow(0 0 4px ${rc})`:'none'}}>★</span>))}</div>);
                      })()}

                      {/* Info rows — editable for Cost-Artist */}
                      {[['Request ID','id',req.id,true],['Sales Person','salesPerson',req.salesPerson,true],['Submitted By','submittedBy',req.submittedBy,true],['Client / Grantor','client',req.client,true],['Main Contractor','mainContractor',req.mainContractor,true],['Consultant','consultant',req.consultant,true],['Lead Time','leadTime',req.leadTime,true],['Address','address',req.address,true],['Submitted','date',req.date,true],['Remarks','remarks',req.remarks,true]].map(([k,field,v,editable])=>(
                        <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'5px 0',gap:8,alignItems:'center'}}>
                          <span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{k}</span>
                          {dirEditMode && editable ? (
                            <input value={v||''} onChange={e=>onUpdate(req.id,{[field]:e.target.value})} style={{...inpStyle,textAlign:'right',width:'60%'}} placeholder={k}/>
                          ) : (
                            <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.75)',textAlign:'right',fontWeight:500}}>{v||'—'}</span>
                          )}
                        </div>
                      ))}

                      {/* Contact */}
                      {(req.email||req.mob||req.tel||dirEditMode) && (
                        <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                          {dirEditMode ? (
                            <div style={{display:'flex',flexDirection:'column',gap:4}}>
                              {[['Email','email'],['MOB','mob'],['Tel','tel']].map(([label,field])=>(
                                <div key={field} style={{display:'flex',alignItems:'center',gap:6}}>
                                  <span style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.28)',width:32,flexShrink:0}}>{label}</span>
                                  <input value={req[field]||''} onChange={e=>onUpdate(req.id,{[field]:e.target.value})} style={inpStyle} placeholder={label}/>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                              {[['Email',req.email],['MOB',req.mob],['Tel',req.tel]].filter(([,v])=>v).map(([k,v])=>(
                                <div key={k}><div style={{fontSize:'0.42rem',color:'rgba(255,255,255,0.24)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:1}}>{k}</div><div style={{fontSize:'0.70rem',fontWeight:600,color:'rgba(255,255,255,0.65)'}}>{v}</div></div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Remarks */}
                      {(req.remarks || dirEditMode) && (
                        <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                          <div style={{fontSize:'0.42rem',color:'rgba(255,255,255,0.24)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,marginBottom:4}}>Remarks</div>
                          {dirEditMode ? (
                            <textarea value={req.remarks||''} onChange={e=>onUpdate(req.id,{remarks:e.target.value})} rows={2} placeholder="Remarks…"
                              style={{...inpStyle,resize:'vertical',lineHeight:1.5}}/>
                          ) : (
                            <div style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.58)',lineHeight:1.6,borderLeft:'2px solid rgba(255,255,255,0.10)',paddingLeft:8}}>{req.remarks}</div>
                          )}
                        </div>
                      )}

                      {/* Out of Scope notice — marked by Cost-Artist */}
                      {req.outOfScopeSubmitted && (
                        <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(220,60,60,0.20)',background:'rgba(220,50,50,0.07)',border:'1px solid rgba(220,60,60,0.30)',borderRadius:8,padding:'9px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:req.outOfScopeReason?6:0}}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,90,0.85)" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            <span style={{fontSize:'0.50rem',color:'rgba(255,110,110,0.85)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:700}}>Out of Scope</span>
                            <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.30)',marginLeft:'auto'}}>by {req.outScopeBy||'Cost-Artist'}</span>
                          </div>
                          {req.outOfScopeReason && (
                            <div style={{fontSize:'0.74rem',color:'rgba(255,180,180,0.75)',lineHeight:1.55,borderLeft:'2px solid rgba(255,80,80,0.30)',paddingLeft:8}}>{req.outOfScopeReason}</div>
                          )}
                        </div>
                      )}

                      {/* Document management — Cost-Artist edit mode only */}
                      {dirEditMode && (
                        <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
                          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
                            <span style={{fontSize:'0.46rem',color:'rgba(0,200,255,0.55)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700}}>Manage Documents</span>
                            <input ref={dirDocUploadRef} type="file" multiple hidden accept="*/*" onChange={async e=>{
                              if(!e.target.files?.length) return;
                              setDirDocUploadState('uploading');
                              try {
                                const newDocs = [];
                                for (const file of Array.from(e.target.files)) {
                                  const spUrl = await uploadToSharePoint(file, req.id, file.name);
                                  if (spUrl) newDocs.push({ id: Math.random().toString(36).slice(2) + Date.now().toString(36), name: file.name, type: file.type, url: spUrl, verified: true });
                                }
                                if (newDocs.length) onUpdate(req.id, { docs: [...(req.docs||[]), ...newDocs], _immediate: true });
                                setDirDocUploadState(null);
                              } catch(err) {
                                console.warn('Director doc upload error:', err);
                                setDirDocUploadState(null);
                              }
                              e.target.value='';
                            }}/>
                            <button onClick={()=>!dirDocUploadState && dirDocUploadRef.current?.click()}
                              disabled={dirDocUploadState==='uploading'}
                              style={{marginLeft:'auto',padding:'3px 10px',borderRadius:6,
                                background: 'rgba(0,200,255,0.10)',
                                border: '1px solid rgba(0,200,255,0.30)',
                                color: dirDocUploadState==='uploading' ? 'rgba(0,200,255,0.45)' : 'rgba(0,200,255,0.85)',
                                fontFamily:F2,fontSize:'0.60rem',fontWeight:700,cursor:dirDocUploadState==='uploading'?'wait':'pointer',outline:'none'}}>
                              {dirDocUploadState==='uploading' ? '⟳ Uploading…' : '+ Add File'}
                            </button>
                          </div>
                          {(req.docs||[]).length === 0 ? (
                            <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic'}}>No files</div>
                          ) : (req.docs||[]).map((d,i)=>(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                              <span style={{fontSize:'0.68rem',color:'rgba(0,200,255,0.80)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{docName(d)}</span>
                              {d.verified
                                ? <span title="Verified on Azure" style={{display:'flex',alignItems:'center',gap:2,flexShrink:0}}>
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.55)" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>
                                  </span>
                                : d.url
                                ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.45)" strokeWidth="2" title="Azure"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>
                                : null}
                              <button onClick={()=>{ const d=(req.docs||[])[i]; if(d?.url)deleteSharePointFile(d.url); onUpdate(req.id,{docs:(req.docs||[]).filter((_,j)=>j!==i),_immediate:true}); }}
                                style={{flexShrink:0,width:20,height:20,borderRadius:4,background:'rgba(220,50,50,0.12)',border:'1px solid rgba(220,50,50,0.30)',color:'rgba(255,100,100,0.80)',fontFamily:F2,fontSize:'0.68rem',cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* ── DECISION CONTROLS (left panel bottom) ── */}
                  <div style={{flexShrink:0,background:'rgba(4,1,22,0.98)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:12,backdropFilter:'blur(20px)',padding:'12px 14px',display:'flex',flexDirection:'column',gap:8}}>
                    {/* Margin % + Remarks */}
                    <div style={{display:'grid',gridTemplateColumns:'88px 1fr',gap:7}}>
                      <div>
                        <div style={{fontSize:'0.44rem',color:'rgba(0,220,255,0.45)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:4}}>Revised Margin %</div>
                        <div style={{display:'flex',alignItems:'center',gap:4,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:7,padding:'5px 8px'}}>
                          <input type="number" value={req.revisedMargin||''} onChange={e=>onUpdate(req.id,{revisedMargin:e.target.value})} placeholder="0.0" min="0" max="100" step="0.5"
                            style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:'monospace',fontSize:'1.00rem',fontWeight:700,width:'100%',color:'rgba(255,255,255,0.95)'}}/>
                          <span style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',fontFamily:'monospace',fontWeight:700}}>%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:'0.44rem',color:'rgba(0,220,255,0.45)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:4}}>Nour Alyazji Remarks</div>
                        <textarea value={req.directorNote||''} onChange={e=>onUpdate(req.id,{directorNote:e.target.value})} placeholder="Notes…" rows={2}
                          style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:7,color:'rgba(255,255,255,0.80)',fontFamily:F2,fontSize:'0.78rem',padding:'5px 9px',outline:'none',resize:'none',boxSizing:'border-box',lineHeight:1.4}}
                          onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.28)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.10)'}/>
                      </div>
                    </div>
                    {/* Approve / Revise / Reject */}
                    <div style={{display:'flex',gap:5}}>
                      {DA.map(a=>(
                        <button key={a.v} onClick={()=>{
                          const ns = a.v === 'approved' ? 'Approved' : a.v === 'rejected' ? 'Rejected' : a.v === 'out-of-scope' ? 'Cancelled - Due to Invalid Documents' : 'Correction Required';
                          const nr = a.v === 'approved' ? 'completed' : a.v === 'rejected' ? 'onhold' : a.v === 'out-of-scope' ? 'out-of-scope' : 'inprogress';
                          onUpdate(req.id,{directorAction:a.v, status:ns, reqStatus:nr, directorSubmitted:false});
                        }}
                                      style={{flex:1,padding:'7px 4px',borderRadius:8,cursor:'pointer',outline:'none',fontFamily:F2,fontSize:'0.74rem',fontWeight:req.directorAction===a.v?700:500,background:req.directorAction===a.v?a.bg:'rgba(255,255,255,0.03)',border:req.directorAction===a.v?`1.5px solid ${a.bd}`:'1px solid rgba(255,255,255,0.08)',color:req.directorAction===a.v?a.c:'rgba(255,255,255,0.35)',transition:'all 0.15s',textAlign:'center',whiteSpace:'nowrap',boxShadow:req.directorAction===a.v?`0 0 14px ${a.c}22`:'none'}}
                          onMouseEnter={e=>{if(req.directorAction!==a.v)e.currentTarget.style.background='rgba(255,255,255,0.07)';}}
                          onMouseLeave={e=>{if(req.directorAction!==a.v)e.currentTarget.style.background='rgba(255,255,255,0.03)';}}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                    {/* Submit Response */}
                    {req.directorSubmitted ? (
                      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'8px 0',borderRadius:9,background:'rgba(0,220,130,0.10)',border:'1px solid rgba(0,220,130,0.38)',color:'rgba(0,230,150,0.95)',fontFamily:F2,fontSize:'0.82rem',fontWeight:700,boxShadow:'0 0 14px rgba(0,200,120,0.16)'}}>
                        <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(0,220,130,0.95)',boxShadow:'0 0 7px rgba(0,220,130,0.8)',flexShrink:0,display:'inline-block'}}/>
                        Response Submitted
                      </div>
                    ) : (
                      <button onClick={()=>{
                        if(req.directorAction){
                          const isOosAction = req.directorAction === 'out-of-scope';
                          const ns = req.directorAction === 'approved' ? 'Approved' : req.directorAction === 'rejected' ? 'Rejected' : isOosAction ? 'Cancelled - Due to Invalid Documents' : 'Correction Required';
                          const nr = req.directorAction === 'approved' ? 'completed' : req.directorAction === 'rejected' ? 'onhold' : isOosAction ? 'out-of-scope' : 'inprogress';
                          const ts = new Date().toISOString();
                          const nowMs = Date.now();
                          const actionLabel = req.directorAction === 'approved' ? 'Cost Artist Approved' : req.directorAction === 'rejected' ? 'Cost Artist Rejected' : isOosAction ? 'Cost Artist — Out of Scope' : 'Correction Required';
                          const eventType = req.directorAction === 'approved' ? 'approved' : req.directorAction === 'rejected' ? 'rejected' : isOosAction ? 'out-of-scope' : 'revision';
                          const oosFields = isOosAction ? {
                            outScopeRemark: req.directorNote || '',
                            outScopeAt: nowMs,
                            outScopeBy: 'Cost-Artist',
                            outOfScopeSubmitted: true,
                            oosNotification: { tsMs: nowMs, ts },
                          } : {};
                          onUpdate(req.id,{
                            status: ns,
                            reqStatus: nr,
                            directorSubmitted: true,
                            directorRespondedAt: ts,
                            directorNote: req.directorNote || '',
                            ...oosFields,
                            timeline: [...(req.timeline || []), { event: eventType, ts, tsMs: nowMs, label: actionLabel, by: 'Cost Artist', remark: isOosAction ? (req.directorNote || '') : undefined }]
                          });
                        }
                      }}
                        disabled={!req.directorAction}
                        style={{width:'100%',padding:'9px',borderRadius:9,background:req.directorAction?'linear-gradient(105deg,#0f0c3a,#1e40af 30%,#6d28d9 55%,#a855f7 75%,#00e5ff 100%)':'rgba(255,255,255,0.04)',backgroundSize:'220% 220%',animation:req.directorAction?'auroraShift 5s ease-in-out infinite':'none',border:req.directorAction?'1px solid rgba(255,255,255,0.20)':'1px solid rgba(255,255,255,0.07)',color:req.directorAction?'#fff':'rgba(255,255,255,0.22)',fontFamily:F2,fontSize:'0.86rem',fontWeight:700,cursor:req.directorAction?'pointer':'not-allowed',letterSpacing:'0.06em',boxShadow:req.directorAction?'0 4px 20px rgba(120,60,255,0.30)':'none',outline:'none'}}>
                        Submit Response
                      </button>
                    )}
                  </div>

                </div>{/* end left column */}

                {/* ═══ CENTER: Documents (D) + AI Suggestions (P) ═══ */}
                <div style={{flex:1,minWidth:0,minHeight:0,display:'flex',flexDirection:'column',gap:8,overflowY:'auto',paddingRight:2,scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.08) transparent'}}>

                  {/* ── ALL DOCUMENTS — D ── */}
                  <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:12,padding:'14px 18px',flexShrink:0}}>
                    <div style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.30)',letterSpacing:'0.16em',textTransform:'uppercase',fontWeight:700,marginBottom:12}}>All Documents</div>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      <div style={{background:'rgba(0,200,255,0.04)',border:'1px solid rgba(0,200,255,0.14)',borderRadius:8,padding:'10px 12px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.65)" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                          <span style={{fontSize:'0.50rem',color:'rgba(0,200,255,0.65)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700}}>Requester Documents</span>
                          <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',marginLeft:'auto'}}>{req.docs?.length||0} file{(req.docs?.length||0)!==1?'s':''}</span>
                        </div>
                        {req.docs?.length > 0 ? (
                          <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:130,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(0,200,255,0.15) transparent',paddingRight:2}}>
                            {req.docs.map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px',borderRadius:6,background:'rgba(0,200,255,0.07)',border:'1px solid rgba(0,200,255,0.22)',color:'rgba(0,200,255,0.92)',fontFamily:F2,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',width:'100%',textAlign:'left',minWidth:0}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,200,255,0.16)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,200,255,0.07)'}>
                                <DlIco/><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{docName(d)}</span>
                              </button>
                            ))}
                          </div>
                        ) : <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic'}}>No files attached</span>}
                      </div>
                      {req.originalDocs?.length > 0 && (
                        <div style={{background:'rgba(160,190,230,0.04)',border:'1px solid rgba(160,190,230,0.14)',borderRadius:8,padding:'10px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(160,190,230,0.55)" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                            <span style={{fontSize:'0.50rem',color:'rgba(160,190,230,0.60)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700}}>Original Documents — Reference</span>
                            <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',marginLeft:'auto'}}>{req.originalDocs.length} file{req.originalDocs.length!==1?'s':''}</span>
                          </div>
                          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                            {req.originalDocs.map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:5,padding:'5px 11px',borderRadius:6,background:'rgba(160,190,230,0.07)',border:'1px solid rgba(160,190,230,0.22)',color:'rgba(160,190,230,0.84)',fontFamily:F2,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',fontStyle:'italic'}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(160,190,230,0.15)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(160,190,230,0.07)'}>
                                <DlIco/>{docName(d)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* ── Tool / Project Docs (read-only for cost-artist) ── */}
                      {(req.toolDocs||[]).length > 0 && (
                        <div style={{background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.20)',borderRadius:8,padding:'10px 12px',marginBottom:8}}>
                          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.70)" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                            <span style={{fontSize:'0.50rem',color:'rgba(168,85,247,0.75)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700}}>Tool / Project Docs</span>
                            <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',marginLeft:'auto'}}>{req.toolDocs.length} file{req.toolDocs.length!==1?'s':''}</span>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:140,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(168,85,247,0.15) transparent'}}>
                            {req.toolDocs.map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px',borderRadius:6,background:'rgba(168,85,247,0.07)',border:'1px solid rgba(168,85,247,0.28)',color:'rgba(196,181,253,0.90)',fontFamily:F2,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',textAlign:'left',width:'100%',minWidth:0}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(168,85,247,0.16)'}
                                onMouseLeave={e=>e.currentTarget.style.background='rgba(168,85,247,0.07)'}>
                                <DlIco/>
                                <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{d.name||`tool-doc-${i+1}`}</span>
                                {d.verified && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.75)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{background:'rgba(0,220,130,0.04)',border:'1px solid rgba(0,220,130,0.14)',borderRadius:8,padding:'10px 12px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,220,130,0.60)" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                          <span style={{fontSize:'0.50rem',color:'rgba(0,220,130,0.65)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700}}>Quotation Documents</span>
                          <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',marginLeft:'auto'}}>{req.estimationDocs?.length?`${req.estimationDocs.length} file${req.estimationDocs.length!==1?'s':''}`:req.estimationDoc?'1 file':'0 files'}</span>
                        </div>
                        <div style={{fontSize:'0.44rem',color:'rgba(0,220,130,0.45)',letterSpacing:'0.10em',marginBottom:7}}>✓ Tick files to release to Sales for download</div>
                        {(req.estimationDocs?.length > 0 || req.estimationDoc?.data || req.estimationDoc?.url) ? (
                          <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:160,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(0,220,130,0.15) transparent',paddingRight:2}}>
                            {(req.estimationDocs?.length > 0 ? req.estimationDocs : [req.estimationDoc]).filter(Boolean).map((d,i)=>{
                              const isReleased = (req.salesApprovedDocs||[]).includes(d.id);
                              return (
                                <div key={i} style={{display:'flex',alignItems:'center',gap:4,background:isReleased?'rgba(0,220,130,0.06)':'transparent',borderRadius:6,padding:'2px 0'}}>
                                  {/* Release-to-sales checkbox */}
                                  <button
                                    title={isReleased ? 'Remove from Sales download' : 'Release to Sales for download'}
                                    onClick={()=>{
                                      const prev = req.salesApprovedDocs || [];
                                      const next = isReleased ? prev.filter(id=>id!==d.id) : [...prev, d.id];
                                      onUpdate(req.id, { salesApprovedDocs: next, _immediate: true });
                                    }}
                                    style={{flexShrink:0,width:18,height:18,borderRadius:4,
                                      background: isReleased?'rgba(0,220,130,0.25)':'rgba(255,255,255,0.05)',
                                      border: `1.5px solid ${isReleased?'rgba(0,220,130,0.70)':'rgba(255,255,255,0.18)'}`,
                                      color: isReleased?'rgba(0,230,140,0.95)':'rgba(255,255,255,0.30)',
                                      cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',
                                      transition:'all 0.15s',fontSize:'0.62rem',fontWeight:800}}>
                                    {isReleased ? '✓' : ''}
                                  </button>
                                  <button onClick={()=>downloadDoc(d)}
                                    style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px',borderRadius:6,
                                      background:isReleased?'rgba(0,220,130,0.10)':'rgba(0,220,130,0.07)',
                                      border:`1px solid ${isReleased?'rgba(0,220,130,0.40)':'rgba(0,220,130,0.28)'}`,
                                      color:'rgba(0,220,130,0.92)',fontFamily:F2,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',flex:1,textAlign:'left',minWidth:0}}
                                    onMouseEnter={e=>e.currentTarget.style.background='rgba(0,220,130,0.16)'} onMouseLeave={e=>e.currentTarget.style.background=isReleased?'rgba(0,220,130,0.10)':'rgba(0,220,130,0.07)'}>
                                    <DlIco/>
                                    <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{d.name||req.estimationFile||`quotation-${i+1}`}</span>
                                    {d.verified && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" title="Verified on Azure"><polyline points="20 6 9 17 4 12"/></svg>}
                                    {isReleased && <span style={{fontSize:'0.44rem',color:'rgba(0,220,130,0.70)',letterSpacing:'0.08em',textTransform:'uppercase',flexShrink:0,fontWeight:700}}>Sales ✓</span>}
                                  </button>
                                  {dirEditMode && (
                                    <button title="Delete file" onClick={()=>{
                                      const all = req.estimationDocs?.length > 0 ? req.estimationDocs : [req.estimationDoc].filter(Boolean);
                                      const updated = all.filter((_,j)=>j!==i);
                                      const removedId = d.id;
                                      onUpdate(req.id,{estimationDocs:updated, estimationDoc:updated.length?updated[updated.length-1]:null, estimationFile:updated.length?updated[updated.length-1].name:null, salesApprovedDocs:(req.salesApprovedDocs||[]).filter(id=>id!==removedId)});
                                    }}
                                      style={{flexShrink:0,width:20,height:20,borderRadius:4,background:'rgba(220,50,50,0.12)',border:'1px solid rgba(220,50,50,0.30)',color:'rgba(255,100,100,0.80)',fontFamily:F2,fontSize:'0.68rem',cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic'}}>No files attached</span>}
                      </div>
                    </div>
                  </div>

                  {/* ── ESTIMATOR COMMENTS — read-only for Cost-Artist ── */}
                  {req.estimatorComments && (
                    <div style={{background:'rgba(255,200,80,0.05)',border:'1px solid rgba(255,200,80,0.18)',borderRadius:10,padding:'12px 14px',flexShrink:0}}>
                      <div style={{fontSize:'0.46rem',color:'rgba(255,200,80,0.60)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,marginBottom:7}}>Estimator Comments</div>
                      <p style={{fontSize:'0.80rem',color:'rgba(255,230,140,0.85)',lineHeight:1.6,margin:0}}>{req.estimatorComments}</p>
                    </div>
                  )}

                  {/* ── AI SUGGESTIONS — P (collapsible) ── */}
                  <div style={{background:'rgba(130,40,255,0.06)',border:'1px solid rgba(168,85,247,0.20)',borderRadius:12,flexShrink:0,...(dirAiOpen?{flex:1,minHeight:120}:{}),display:'flex',flexDirection:'column',overflow:'hidden'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 18px',cursor:'pointer',userSelect:'none',borderBottom:dirAiOpen?'1px solid rgba(168,85,247,0.12)':'none',flexShrink:0}} onClick={()=>setDirAiOpen(v=>!v)}>
                      <div style={{width:6,height:6,borderRadius:'50%',background:'rgba(168,85,247,0.85)',boxShadow:'0 0 8px rgba(168,85,247,0.60)',flexShrink:0}}/>
                      <span style={{fontSize:'0.50rem',color:'rgba(168,85,247,0.80)',letterSpacing:'0.16em',textTransform:'uppercase',fontWeight:700}}>AI Suggestions</span>
                      <span style={{marginLeft:'auto',fontSize:'0.52rem',color:'rgba(255,255,255,0.18)',fontStyle:'italic',marginRight:8}}>Powered by APEX Intelligence</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.60)" strokeWidth="2.5" style={{flexShrink:0}}>
                        {dirAiOpen ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                      </svg>
                    </div>
                    {dirAiOpen && (
                      <div style={{padding:'12px 18px 14px',overflowY:'auto',flex:1}}>
                        {histReqs.length > 0 ? (
                          <div style={{display:'flex',flexDirection:'column',gap:8}}>
                            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 12px'}}>
                              <div style={{fontSize:'0.46rem',color:'rgba(168,85,247,0.55)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:700,marginBottom:6}}>Client Intelligence</div>
                              {[['Past Requests',histReqs.length,'rgba(168,85,247,0.80)'],['Approved',histReqs.filter(r=>r.status==='Approved'||r.status==='Completed').length,'rgba(0,220,130,0.80)'],['Avg Margin',(()=>{const ms=histReqs.filter(r=>r.margin).map(r=>parseFloat(r.margin));return ms.length?(ms.reduce((a,b)=>a+b,0)/ms.length).toFixed(1)+'%':'—';})(),'rgba(0,200,255,0.80)']].map(([k,v,c])=>(
                                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                                  <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.32)'}}>{k}</span>
                                  <span style={{fontSize:'0.70rem',fontWeight:700,color:c}}>{v}</span>
                                </div>
                              ))}
                            </div>
                            {req.margin && histReqs.filter(r=>r.margin).length > 0 && (() => {
                              const avgM = histReqs.filter(r=>r.margin).reduce((a,r)=>a+parseFloat(r.margin),0)/histReqs.filter(r=>r.margin).length;
                              const diff = parseFloat(req.margin) - avgM;
                              if (Math.abs(diff) <= 3) return null;
                              const isHigh = diff > 0;
                              return (
                                <div style={{background:isHigh?'rgba(255,150,0,0.07)':'rgba(0,200,255,0.07)',border:`1px solid ${isHigh?'rgba(255,150,0,0.25)':'rgba(0,200,255,0.25)'}`,borderRadius:8,padding:'10px 12px',display:'flex',gap:8,alignItems:'flex-start'}}>
                                  <span style={{fontSize:'0.88rem',flexShrink:0}}>{isHigh?'⚠️':'ℹ️'}</span>
                                  <div>
                                    <div style={{fontSize:'0.62rem',fontWeight:700,color:isHigh?'rgba(255,170,0,0.90)':'rgba(0,200,255,0.90)',marginBottom:3}}>{isHigh?'Margin Above Average':'Margin Below Average'}</div>
                                    <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.55)',lineHeight:1.5}}>Current ({req.margin}%) is {Math.abs(diff).toFixed(1)}pp {isHigh?'above':'below'} client avg ({avgM.toFixed(1)}%).</div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px 0',gap:10,opacity:0.45}}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.60)" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.28)',margin:0,textAlign:'center',lineHeight:1.5}}>No prior history with this client.<br/>Suggestions appear after first interaction.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>{/* end center column */}

                {/* ═══ RIGHT: History/Tabs + Conversation (C) ═══ */}
                <div style={{width:'28%',minWidth:210,display:'flex',flexDirection:'column',gap:8,minHeight:0,overflow:'hidden'}}>

                  {/* Tab selector */}
                  <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:9,padding:3,gap:2,flexShrink:0}}>
                    {[{k:'history',label:'History'},{k:'analysis',label:'Analysis'}].map(({k,label})=>(
                      <button key={k} onClick={()=>setDirTab(k)}
                        style={{flex:1,padding:'7px 0',borderRadius:7,background:dirTab===k?'rgba(255,255,255,0.10)':'transparent',border:'none',color:dirTab===k?'rgba(255,255,255,0.92)':'rgba(255,255,255,0.35)',fontFamily:F2,fontSize:'0.76rem',fontWeight:dirTab===k?700:500,cursor:'pointer',outline:'none',transition:'all 0.2s',letterSpacing:'0.04em'}}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content — fixed height, internal scroll */}
                  <div style={{overflowY:'auto',display:'flex',flexDirection:'column',gap:7,scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.06) transparent',flex:dirConvoOpen?'0 0 220px':'1',minHeight:0}}>
                    {dirTab === 'history' && (<>
                      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'11px 13px',flexShrink:0}}>
                        <div style={{fontSize:'0.48rem',color:'rgba(255,200,0,0.55)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,marginBottom:7}}>Rate Requester</div>
                        <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.38)',marginBottom:7,lineHeight:1.4}}>{req.submittedBy||'—'}</div>
                        <div style={{display:'flex',gap:4,alignItems:'center'}}>
                          {[1,2,3,4,5].map(n=>(
                            <button key={n} type="button" onClick={()=>onUpdate(req.id,{requesterRating:n})}
                              style={{background:'none',border:'none',cursor:'pointer',padding:0,fontSize:'1.2rem',lineHeight:1,color:(req.requesterRating||0)>=n?'rgba(255,200,0,0.95)':'rgba(255,255,255,0.15)',transition:'color 0.15s, transform 0.15s',filter:(req.requesterRating||0)>=n?'drop-shadow(0 0 5px rgba(255,200,0,0.60))':'none'}}
                              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.2)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>★</button>
                          ))}
                          {req.requesterRating > 0 && <span style={{fontSize:'0.62rem',color:'rgba(255,200,0,0.50)',marginLeft:3}}>({req.requesterRating}/5)</span>}
                        </div>
                      </div>
                      <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'11px 13px',flexShrink:0}}>
                        <div style={{fontSize:'0.48rem',color:'rgba(0,200,255,0.50)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,marginBottom:7}}>
                          Request History {(req.client||req.proj) && <span style={{color:'rgba(255,255,255,0.22)',textTransform:'none',letterSpacing:0,fontSize:'0.58rem',fontWeight:400}}>— {req.client||req.proj}</span>}
                        </div>
                        {histReqs.length === 0 ? (
                          <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.22)',lineHeight:1.5,fontStyle:'italic'}}>No previous requests from this client or project.</div>
                        ) : (
                          <div style={{display:'flex',flexDirection:'column',gap:5}}>
                            {histReqs.slice(0,5).map((hr)=>(
                              <div key={hr.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:7,padding:'7px 9px'}}>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:5,marginBottom:2}}>
                                  <span style={{fontFamily:'monospace',fontSize:'0.66rem',fontWeight:700,color:'rgba(220,165,0,0.85)'}}>{hr.id}</span>
                                  <Badge s={hr.status}/>
                                </div>
                                <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.60)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{hr.proj||'—'}</div>
                                {hr.margin && <div style={{fontSize:'0.60rem',color:'rgba(0,200,255,0.55)',marginTop:2}}>Margin: {hr.margin}%</div>}
                              </div>
                            ))}
                            {histReqs.length > 5 && <div style={{fontSize:'0.64rem',color:'rgba(255,255,255,0.22)',textAlign:'center'}}>+{histReqs.length-5} more</div>}
                          </div>
                        )}
                      </div>
                    </>)}
                    {dirTab === 'analysis' && (<>
                      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'11px 13px',flexShrink:0}}>
                        <div style={{fontSize:'0.48rem',color:'rgba(200,130,255,0.55)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,marginBottom:9}}>Request Analysis</div>
                        {[
                          ['Request Type', req.requestType==='revised'?'Revised':req.requestType==='finalPrice'?'Final Price':'New Request', 'rgba(255,255,255,0.75)'],
                          ['Deal Category', req.deal||'—', 'rgba(255,255,255,0.75)'],
                          ['Supply Mode', req.supplyOnly?'Supply Only':req.supplyInstall?'Supply & Install':'Not specified', 'rgba(255,255,255,0.65)'],
                          ['Estimator Margin', req.margin?`${req.margin}%`:'Not set', req.margin?'rgba(0,210,255,0.90)':'rgba(255,255,255,0.30)'],
                          ['Revised Margin', req.revisedMargin?`${req.revisedMargin}%`:'—', req.revisedMargin?'rgba(200,130,255,0.90)':'rgba(255,255,255,0.30)'],
                          ['Rating', req.requesterRating?`${req.requesterRating} ★`:'Not rated', req.requesterRating?'rgba(255,200,0,0.85)':'rgba(255,255,255,0.30)'],
                        ].map(([k,v,c])=>(
                          <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'5px 0',gap:8}}>
                            <span style={{fontSize:'0.64rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{k}</span>
                            <span style={{fontSize:'0.66rem',fontWeight:600,color:c,textAlign:'right'}}>{v}</span>
                          </div>
                        ))}
                      </div>
                      {histReqs.length > 0 && (
                        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'11px 13px',flexShrink:0}}>
                          <div style={{fontSize:'0.48rem',color:'rgba(0,200,255,0.50)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,marginBottom:9}}>Client Track Record</div>
                          {[
                            ['Total Past Requests', histReqs.length],
                            ['Approved', histReqs.filter(r=>r.status==='Approved'||r.status==='Completed').length],
                            ['Avg Margin', (()=>{const ms=histReqs.filter(r=>r.margin).map(r=>parseFloat(r.margin));return ms.length?(ms.reduce((a,b)=>a+b,0)/ms.length).toFixed(1)+'%':'—';})()],
                          ].map(([k,v])=>(
                            <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'5px 0',gap:8}}>
                              <span style={{fontSize:'0.64rem',color:'rgba(255,255,255,0.30)'}}>{k}</span>
                              <span style={{fontSize:'0.66rem',fontWeight:700,color:'rgba(255,255,255,0.80)'}}>{v}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>)}
                  </div>

                  {/* ── CONVERSATION — C (collapsible) ── */}
                  <div style={{background:'rgba(109,40,217,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:12,display:'flex',flexDirection:'column',overflow:'hidden',...(dirConvoOpen?{flex:1,minHeight:0}:{flexShrink:0})}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderBottom:dirConvoOpen?'1px solid rgba(168,85,247,0.18)':'none',flexShrink:0,cursor:'pointer',userSelect:'none'}} onClick={()=>setDirConvoOpen(v=>!v)}>
                      <div style={{width:7,height:7,borderRadius:'50%',background:'rgba(168,85,247,0.85)',boxShadow:'0 0 7px rgba(168,85,247,0.65)',flexShrink:0}}/>
                      <span style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(168,85,247,0.85)',fontWeight:700}}>Conversation</span>
                      {(req.conversation||[]).length > 0 && (
                        <span style={{background:'rgba(168,85,247,0.18)',border:'1px solid rgba(168,85,247,0.32)',borderRadius:50,padding:'1px 7px',fontSize:'0.56rem',color:'rgba(196,181,253,0.90)',fontWeight:700}}>{(req.conversation||[]).length}</span>
                      )}
                      <span style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.26)',marginLeft:'auto',marginRight:6}}>{[req.estimator,req.salesPerson].filter(Boolean).join(' & ')||''}</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.60)" strokeWidth="2.5" style={{flexShrink:0}}>
                        {dirConvoOpen ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                      </svg>
                    </div>
                    {dirConvoOpen && (
                      <>
                        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:7,padding:'10px 14px',scrollbarWidth:'thin',scrollbarColor:'rgba(168,85,247,0.18) transparent'}}>
                          {(req.conversation||[]).length === 0 ? (
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:10,opacity:0.40}}>
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.70)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                              <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.26)',margin:0,fontStyle:'italic',textAlign:'center',lineHeight:1.5}}>No messages yet.</p>
                            </div>
                          ) : (req.conversation||[]).map((msg,i)=>{
                            const isDir = msg.role==='director';
                            const isEst = msg.role==='estimator';
                            const align = isDir?'flex-end':'flex-start';
                            const bg = isDir?'rgba(0,220,180,0.10)':isEst?'rgba(109,40,217,0.22)':'rgba(255,255,255,0.05)';
                            const bd = isDir?'1px solid rgba(0,220,180,0.28)':isEst?'1px solid rgba(168,85,247,0.28)':'1px solid rgba(255,255,255,0.08)';
                            const br = isDir?'11px 11px 3px 11px':'11px 11px 11px 3px';
                            const nameC = isDir?'rgba(0,220,180,0.70)':isEst?'rgba(196,181,253,0.60)':'rgba(100,200,255,0.55)';
                            return (
                              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:align}}>
                                <div style={{maxWidth:'88%',background:bg,border:bd,borderRadius:br,padding:'6px 10px'}}>
                                  <div style={{fontSize:'0.52rem',color:nameC,marginBottom:2,fontWeight:600}}>{msg.from} · {msg.ts}</div>
                                  <div style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.82)',lineHeight:1.4}}>{msg.text}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{flexShrink:0,padding:'8px 14px',borderTop:'1px solid rgba(168,85,247,0.18)',display:'flex',gap:6,alignItems:'flex-end'}}>
                          <textarea
                            value={dirConvoMsg}
                            onChange={e=>setDirConvoMsg(e.target.value)}
                            onKeyDown={e=>{
                              if(e.key==='Enter'&&!e.shiftKey){
                                e.preventDefault();
                                const txt=dirConvoMsg.trim();
                                if(!txt)return;
                                const msg={role:'director',from:'Nour Alyazji',text:txt,ts:new Date().toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false})};
                                onUpdate(req.id,{conversation:[...(req.conversation||[]),msg]});
                                setDirConvoMsg('');
                              }
                            }}
                            placeholder="Message group… (Enter to send)"
                            rows={2}
                            style={{flex:1,background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.25)',borderRadius:8,color:'rgba(255,255,255,0.88)',fontFamily:F2,fontSize:'0.78rem',padding:'6px 10px',outline:'none',resize:'none',lineHeight:1.4,boxSizing:'border-box'}}
                            onFocus={e=>e.target.style.borderColor='rgba(168,85,247,0.55)'}
                            onBlur={e=>e.target.style.borderColor='rgba(168,85,247,0.25)'}
                          />
                          <button
                            onClick={()=>{
                              const txt=dirConvoMsg.trim();
                              if(!txt)return;
                              const msg={role:'director',from:'Nour Alyazji',text:txt,ts:new Date().toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false})};
                              onUpdate(req.id,{conversation:[...(req.conversation||[]),msg]});
                              setDirConvoMsg('');
                            }}
                            style={{flexShrink:0,width:34,height:34,borderRadius:8,background:dirConvoMsg.trim()?'rgba(168,85,247,0.35)':'rgba(255,255,255,0.05)',border:`1px solid ${dirConvoMsg.trim()?'rgba(168,85,247,0.55)':'rgba(255,255,255,0.10)'}`,color:dirConvoMsg.trim()?'rgba(200,160,255,0.95)':'rgba(255,255,255,0.22)',cursor:dirConvoMsg.trim()?'pointer':'default',outline:'none',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                </div>{/* end right column */}

              </div>{/* end 3-column */}

            </div>
          );
        })()}

        </div>{/* end scrollable content area */}
      </div>
    );
  }

  // ── List view ──
  const lo = dsearch.toLowerCase();
  const filtered = requests.filter(r => {
    if (lo) {
      const fields = [r.id, r.proj, r.client, r.submittedBy, r.salesPerson, r.estimator,
        r.mainContractor, r.consultant, r.deal, r.status, r.reqStatus, r.email, r.mob,
        r.tel, r.address, r.remarks, r.leadTime, r.projValue].map(v => (v||'').toLowerCase());
      if (!fields.some(f => f.includes(lo))) return false;
    }
    if (viewMode === 'requester' && requesterFilter && r.submittedBy !== requesterFilter) return false;
    if (dashFilter === 'new')               { if (r.requestType && r.requestType !== 'new') return false; }
    else if (dashFilter === 'revise')       { if (r.requestType !== 'revised') return false; }
    else if (dashFilter === 'discount')     { if (r.requestType !== 'discount') return false; }
    else if (dashFilter === 'final')        { if (r.requestType !== 'finalPrice') return false; }
    else if (dashFilter === 'out-of-scope') { if (r.reqStatus !== 'out-of-scope') return false; }
    if (statusFilter === 'pending-estimation') { if (r.status !== 'Pending Estimation') return false; if (pendingEstDealFilter && r.deal !== pendingEstDealFilter) return false; }
    else if (statusFilter === 'pending-approval') { if (r.reqStatus !== 'pending-director') return false; }
    else if (statusFilter === 'unassigned')       { if (r.estimator) return false; }
    else if (statusFilter === 'rfi')              { if (r.reqStatus !== 'rfi') return false; }
    else if (statusFilter === 'approved')         { if (r.directorAction !== 'approved' && r.reqStatus !== 'completed') return false; }
    // per-column filters
    const cf = colFilters;
    const cfMatch = (val, key) => !cf[key] || (val||'').toLowerCase().includes(cf[key].toLowerCase());
    if (!cfMatch(r.id,             'id'))            return false;
    if (!cfMatch(r.status,         'status'))        return false;
    if (!cfMatch(r.proj,           'proj'))          return false;
    if (!cfMatch(r.mainContractor, 'mainContractor'))return false;
    if (!cfMatch(r.consultant,     'consultant'))    return false;
    if (!cfMatch(r.client,         'client'))        return false;
    if (!cfMatch(r.salesPerson,    'salesPerson'))   return false;
    if (!cfMatch(r.estimator,      'estimator'))     return false;
    if (cf.projValue && !(r.projValue||'').toString().includes(cf.projValue)) return false;
    return true;
  });

  const cfSet    = (key, val) => setColFilters(prev => ({...prev, [key]: val}));
  const cfToggle = (key) => setColFilterOpen(prev => prev === key ? null : key);
  const cfClear  = (key) => { setColFilters(prev => ({...prev, [key]: ''})); setColFilterOpen(null); };
  const hasAnyColFilter = Object.values(colFilters).some(v => v);

  // Sort toggle: same col → flip dir; new col → asc
  const sortToggle = (key) => {
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(key); setSortDir('asc'); }
  };
  const sortClear = () => { setSortCol(null); setSortDir('asc'); };

  // Extract sortable scalar for a given column key
  const sortVal = (r, key) => {
    const parseDate = ts => ts ? new Date(ts).getTime() : 0;
    const parseSubmitted = r2 => {
      if (r2.submittedAt) return new Date(r2.submittedAt).getTime();
      if (r2.date) { const p=r2.date.split('/'); const d=p.length===3?new Date(`${p[2]}-${p[1]}-${p[0]}`):new Date(r2.date); return isNaN(d)?0:d.getTime(); }
      return 0;
    };
    switch(key) {
      case 'id':            return (r.id||'').toLowerCase();
      case 'status':        return (r.status||'').toLowerCase();
      case 'proj':          return (r.proj||'').toLowerCase();
      case 'mainContractor':return (r.mainContractor||'').toLowerCase();
      case 'consultant':    return (r.consultant||'').toLowerCase();
      case 'client':        return (r.client||'').toLowerCase();
      case 'submittedBy':   return (r.submittedBy||'').toLowerCase();
      case 'estimator':     return (r.estimator||'zzz').toLowerCase();
      case 'submittedDate': return parseSubmitted(r);
      case 'approvedDate':  return parseDate(r.directorRespondedAt);
      case 'timeline': {
        const s = parseSubmitted(r);
        const isApp = r.directorAction==='approved'||r.reqStatus==='completed';
        const e2 = isApp && r.directorRespondedAt ? parseDate(r.directorRespondedAt) : Date.now();
        return s ? e2 - s : 0;
      }
      case 'projValue': return Number(r.projValue)||0;
      default: return '';
    }
  };

  // Apply sort to filtered list
  const sorted = sortCol ? [...filtered].sort((a,b) => {
    const va = sortVal(a, sortCol), vb = sortVal(b, sortCol);
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ?  1 : -1;
    return 0;
  }) : filtered;

  // Sort icon SVG
  const SortIcon = ({ colKey }) => {
    const isActive = sortCol === colKey;
    const asc = isActive && sortDir === 'asc';
    const desc = isActive && sortDir === 'desc';
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1 L2 4 L8 4 Z" fill={asc ? 'rgba(129,140,248,0.95)' : 'rgba(255,255,255,0.20)'}/>
        <path d="M5 9 L2 6 L8 6 Z" fill={desc ? 'rgba(129,140,248,0.95)' : 'rgba(255,255,255,0.20)'}/>
      </svg>
    );
  };

  // Column header cell with filter + sort
  const ColHdr = ({ colKey, label, align }) => {
    const filterActive = !!(colFilters[colKey]);
    const filterOpen   = colFilterOpen === colKey;
    const isSorted     = sortCol === colKey;
    const filterAccent = 'rgba(251,191,36,0.90)';
    const sortAccent   = 'rgba(129,140,248,0.90)';
    const labelColor   = isSorted ? sortAccent : filterActive ? filterAccent : 'rgba(255,255,255,0.24)';
    return (
      <div style={{display:'flex',flexDirection:'column',gap:2,minWidth:0}}>
        {/* Label */}
        <span style={{fontSize:'0.56rem',letterSpacing:'0.12em',textTransform:'uppercase',
          fontWeight:isSorted||filterActive?700:400, color:labelColor,
          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
          textAlign:align==='right'?'right':'left'}}>
          {label}
        </span>
        {/* Sort + Filter buttons — below the label */}
        <div style={{display:'flex',alignItems:'center',gap:2,justifyContent:align==='right'?'flex-end':'flex-start'}}>
          {/* Sort button */}
          <button
            onClick={e=>{e.stopPropagation();sortToggle(colKey);}}
            title={isSorted?(sortDir==='asc'?'Sort Z→A':'Remove sort'):'Sort A→Z'}
            style={{display:'flex',alignItems:'center',justifyContent:'center',width:16,height:16,
              background:isSorted?'rgba(129,140,248,0.18)':'rgba(255,255,255,0.05)',
              border:`1px solid ${isSorted?'rgba(129,140,248,0.50)':'rgba(255,255,255,0.12)'}`,
              borderRadius:3,cursor:'pointer',outline:'none',transition:'all 0.12s',padding:0}}>
            <SortIcon colKey={colKey}/>
          </button>
          {/* Filter button */}
          <button
            onClick={e=>{e.stopPropagation();cfToggle(colKey);}}
            title={`Filter ${label}`}
            style={{display:'flex',alignItems:'center',justifyContent:'center',width:16,height:16,
              background:filterOpen||filterActive?'rgba(251,191,36,0.16)':'rgba(255,255,255,0.05)',
              border:`1px solid ${filterOpen||filterActive?'rgba(251,191,36,0.45)':'rgba(255,255,255,0.12)'}`,
              borderRadius:3,cursor:'pointer',outline:'none',transition:'all 0.12s',padding:0}}>
            <Search size={8} color={filterOpen||filterActive?filterAccent:'rgba(255,255,255,0.32)'}/>
          </button>
        </div>
        {/* Filter input */}
        {filterOpen && (
          <div style={{display:'flex',alignItems:'center',gap:3}}>
            <input
              autoFocus
              value={colFilters[colKey]||''}
              onChange={e=>cfSet(colKey,e.target.value)}
              onKeyDown={e=>{if(e.key==='Escape')cfClear(colKey);}}
              onClick={e=>e.stopPropagation()}
              placeholder="Filter…"
              style={{flex:1,minWidth:0,background:'rgba(0,8,20,0.92)',border:'1px solid rgba(251,191,36,0.45)',
                borderRadius:4,color:'rgba(255,255,255,0.88)',fontFamily:"'Inter',sans-serif",
                fontSize:'0.66rem',padding:'3px 6px',outline:'none',boxSizing:'border-box'}}
            />
            {colFilters[colKey] && (
              <button onClick={e=>{e.stopPropagation();cfClear(colKey);}}
                style={{display:'flex',alignItems:'center',background:'transparent',border:'none',cursor:'pointer',padding:0,opacity:0.55,flexShrink:0}}>
                <X size={9} color="#fff"/>
              </button>
            )}
          </div>
        )}
        {/* Active filter badge */}
        {filterActive && !filterOpen && (
          <div style={{fontSize:'0.52rem',color:filterAccent,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
            background:'rgba(251,191,36,0.10)',borderRadius:3,padding:'1px 5px',cursor:'pointer'}}
            onClick={e=>{e.stopPropagation();cfClear(colKey);}}>
            ✕ {colFilters[colKey]}
          </div>
        )}
      </div>
    );
  };

  // Unified column layout — id | status | proj | mainContractor | consultant | client | salesPerson | projValue | estimator | numDoors | address | submittedDate | approvedDate | timeline
  const COL = '100px 160px minmax(150px,1fr) 130px 130px 130px 120px 110px 120px 80px 110px 110px 110px 110px';

  const VIEW_LABELS = {requester:'Requester', estimator:'Estimator', director:'Cost-Artist', kpi:'KPI'};
  const VIEW_COLORS = {
    requester:{act:'rgba(100,200,255,0.90)', bg:'rgba(0,180,255,0.12)', bd:'rgba(0,200,255,0.30)'},
    estimator:{act:'rgba(160,255,180,0.90)', bg:'rgba(0,200,100,0.12)', bd:'rgba(0,220,130,0.30)'},
    director: {act:'rgba(200,150,255,0.90)', bg:'rgba(140,80,255,0.12)', bd:'rgba(180,100,255,0.30)'},
    kpi:      {act:'rgba(255,200,60,0.95)',  bg:'rgba(220,150,0,0.12)',  bd:'rgba(255,190,40,0.32)'},
  };

  const F = "'Inter',sans-serif";

  return (
    <div style={{position:'fixed',inset: isEmbedded ? '0' : '64px 0 0 0',display:'flex',flexDirection:'row',overflow:'hidden',animation:'fadeUp 0.4s ease both'}}>

      {/* ── PIN prompt modal ── */}
      {pinPrompt && (
        <div style={{position:'fixed',inset:0,zIndex:9020,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setPinPrompt(null)}>
          <div style={{background:'rgba(4,6,20,0.98)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:14,padding:'30px 32px',width:320,boxShadow:'0 40px 80px rgba(0,0,0,0.80)',fontFamily:F,animation:'fadeUp 0.18s ease both'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:'0.58rem',letterSpacing:'0.16em',textTransform:'uppercase',color:VIEW_COLORS[pinPrompt].act,marginBottom:10,fontWeight:700}}>{VIEW_LABELS[pinPrompt]} Access</div>
            <div style={{fontSize:'1rem',fontWeight:700,color:'rgba(255,255,255,0.85)',marginBottom:20}}>Enter access code to continue</div>
            <input autoFocus type="password" value={pinValue} onChange={e=>{setPinValue(e.target.value);setPinError(false);}}
              onKeyDown={e=>e.key==='Enter'&&confirmPin()}
              placeholder="Access code"
              style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid ${pinError?'rgba(255,80,80,0.55)':'rgba(255,255,255,0.14)'}`,borderRadius:8,color:'rgba(255,255,255,0.85)',fontFamily:F,fontSize:'1rem',padding:'11px 14px',outline:'none',boxSizing:'border-box',letterSpacing:'0.25em',transition:'border-color 0.15s'}}/>
            {pinError && <div style={{fontSize:'0.75rem',color:'rgba(255,90,90,0.85)',marginTop:8}}>Incorrect code — try again.</div>}
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <button onClick={()=>setPinPrompt(null)} style={{flex:1,padding:'10px 0',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.40)',fontFamily:F,fontSize:'0.85rem',cursor:'pointer',outline:'none'}}>Cancel</button>
              <button onClick={confirmPin}
                style={{flex:2,padding:'10px 0',borderRadius:8,background:VIEW_COLORS[pinPrompt].bg,border:`1px solid ${VIEW_COLORS[pinPrompt].bd}`,color:VIEW_COLORS[pinPrompt].act,fontFamily:F,fontSize:'0.88rem',fontWeight:700,cursor:'pointer',outline:'none'}}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LEFT GLASSY SIDEBAR ── */}
      {!isEmbedded && (() => {
        const newCount      = requests.filter(r => !r.requestType || r.requestType === 'new').length;
        const reviseCount   = requests.filter(r => r.requestType === 'revised').length;
        const discountCount = requests.filter(r => r.requestType === 'discount').length;
        const finalCount    = requests.filter(r => r.requestType === 'finalPrice').length;
        const oosCount      = requests.filter(r => r.reqStatus === 'out-of-scope').length;
        const sideItems = [
          { key:'',            label:'Overall',       count:requests.length },
          { key:'new',         label:'New',           count:newCount        },
          { key:'revise',      label:'Revise',        count:reviseCount     },
          { key:'discount',    label:'Discount',      count:discountCount   },
          { key:'final',       label:'Final',         count:finalCount      },
          { key:'out-of-scope',label:'Out of Scope',  count:oosCount        },
          { key:'__sep__',     isSep:true                                   },
          { key:'__open__',    label:'Open Requests',    count:0, isNav:true },
          { key:'__overview__',label:'Request Overview', count:0, isNav:true },
        ];
        return sidebarOpen ? (
          <div style={{
            width:220, flexShrink:0, height:'100%', overflowY:'auto', overflowX:'hidden',
            background:'rgba(0,0,10,0.88)', backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)',
            borderRight:'1px solid rgba(255,255,255,0.08)',
            display:'flex', flexDirection:'column', zIndex:20,
          }}>
            <style>{`
              @keyframes dash-aurora-btn {
                0%   { background-position: 0% 50%; }
                50%  { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .dash-liquid {
                position: relative;
                background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05)) !important;
                border: 1px solid rgba(255,255,255,0.32) !important;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.40),
                            inset 0 -2px 8px rgba(255,255,255,0.06),
                            0 4px 20px rgba(0,0,0,0.40) !important;
                overflow: hidden;
              }
              .dash-liquid::before {
                content:''; position:absolute; top:0; left:-65%;
                width:55%; height:100%;
                background: linear-gradient(105deg, transparent, rgba(255,255,255,0.50), transparent);
                transform: skewX(-20deg);
                animation: dash-liquid-shine 3.4s ease-in-out infinite;
              }
              @keyframes dash-liquid-shine {
                0%       { left:-65%; }
                55%,100% { left:135%; }
              }
            `}</style>

            {/* Hamburger + Module title row */}
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 12px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
              <button
                onClick={()=>setSidebarOpen(false)}
                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'7px 9px',cursor:'pointer',display:'flex',flexDirection:'column',gap:4,outline:'none',flexShrink:0}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';}}
              >
                {[0,1,2].map(i=><div key={i} style={{width:16,height:2,background:'rgba(255,255,255,0.70)',borderRadius:2}}/>)}
              </button>
              <div style={{minWidth:0}}>
                <div style={{fontSize:'0.44rem',letterSpacing:'0.20em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:2}}>Module</div>
                <div style={{fontSize:'0.76rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:"'Cinzel',serif",
                  background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
                  backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                  animation:'auroraShift 5s ease infinite',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                  Quotations
                </div>
              </div>
            </div>

            {/* Filter buttons */}
            <div style={{padding:'10px 10px',display:'flex',flexDirection:'column',gap:6,flex:1}}>
              {sideItems.map(item => {
                if (item.isSep) return (
                  <div key="__sep__" style={{height:1,background:'rgba(255,255,255,0.10)',margin:'18px 6px 8px'}}/>
                );
                const isActive = item.isNav
                  ? (item.key==='__open__' ? dashSection==='open' : dashSection==='overview')
                  : (dashSection==='list' && dashFilter === item.key);
                return (
                  <button key={item.key||'overall'}
                    className={isActive ? 'dash-liquid' : undefined}
                    onClick={()=>{ if(item.key==='__open__'){ setDashSection('open'); } else if(item.key==='__overview__'){ setDashSection('overview'); } else { setDashFilter(item.key); setDashSection('list'); } }}
                    style={isActive ? {
                      background:'rgba(255,255,255,0.10)',
                      backdropFilter:'blur(20px)',
                      WebkitBackdropFilter:'blur(20px)',
                      border:'1px solid rgba(255,255,255,0.22)',
                      borderRadius:100, padding:'9px 14px',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor:'pointer', color:'rgba(255,255,255,0.92)',
                      fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
                      fontFamily:"'Cinzel',serif", outline:'none',
                      boxShadow:'inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 8px rgba(0,0,0,0.28)',
                    } : {
                      background:'rgba(255,255,255,0.04)',
                      border:`1px solid rgba(255,255,255,${item.isDim ? 0.04 : 0.09})`,
                      borderRadius:100, padding:'9px 14px',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor: item.isDim ? 'default' : 'pointer',
                      color: item.isDim ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.68)',
                      fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase',
                      fontFamily:"'Cinzel',serif", outline:'none', transition:'background 0.14s, border-color 0.14s, color 0.14s',
                    }}
                    onMouseEnter={e=>{ if(item.isDim||isActive) return; e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.22)'; e.currentTarget.style.color='#fff'; }}
                    onMouseLeave={e=>{ if(isActive) return; e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor=`rgba(255,255,255,${item.isDim?0.04:0.09})`; e.currentTarget.style.color=item.isDim?'rgba(255,255,255,0.20)':'rgba(255,255,255,0.68)'; }}
                  >
                    <span style={{flex:1,textAlign:'center'}}>{item.label}</span>
                    {!item.isNav && item.count > 0 && (
                      <span style={{marginLeft:5,fontSize:'0.60rem',fontWeight:700,color:'rgba(140,210,255,0.75)',fontFamily:F,flexShrink:0}}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* AI Tool Direct — bottom */}
            <div style={{padding:'10px 10px 14px',borderTop:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
              <button
                onClick={()=>onDirectTool?.()}
                style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,width:'100%',padding:'10px 14px',
                  background:'linear-gradient(135deg,rgba(109,40,217,0.20),rgba(168,85,247,0.12))',
                  border:'1px solid rgba(168,85,247,0.35)',borderRadius:100,
                  color:'rgba(196,181,253,0.85)',fontSize:'0.64rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',
                  fontFamily:"'Cinzel',serif",cursor:'pointer',outline:'none',transition:'all 0.18s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,rgba(109,40,217,0.40),rgba(168,85,247,0.28))';e.currentTarget.style.color='#fff';}}
                onMouseLeave={e=>{e.currentTarget.style.background='linear-gradient(135deg,rgba(109,40,217,0.20),rgba(168,85,247,0.12))';e.currentTarget.style.color='rgba(196,181,253,0.85)';}}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                ✦ AI Tool Direct
              </button>
            </div>
          </div>
        ) : (
          /* Hamburger shown when sidebar is closed */
          <button
            onClick={()=>setSidebarOpen(true)}
            style={{position:'absolute',top:14,left:14,zIndex:50,background:'rgba(0,0,10,0.80)',backdropFilter:'blur(14px)',border:'1px solid rgba(255,255,255,0.14)',borderRadius:8,padding:'9px 11px',cursor:'pointer',display:'flex',flexDirection:'column',gap:4.5,outline:'none'}}
          >
            {[0,1,2].map(i=><div key={i} style={{width:17,height:2,background:'rgba(255,255,255,0.70)',borderRadius:2}}/>)}
          </button>
        );
      })()}

      {/* ── EMBEDDED: Open Requests (part of the dashboard) ── */}
      {dashSection === 'open' && (
        <div style={{flex:1,minWidth:0,height:'100%',overflow:'hidden',display:'flex'}}>
          <OpenRequests requests={requests} onUpdate={onUpdate} onDelete={onDelete} userCode={userCode} userRole={viewMode==='director'?'director':'estimator'} isEmbedded={true}/>
        </div>
      )}
      {/* ── EMBEDDED: Estimation Request Overview ── */}
      {dashSection === 'overview' && (
        <div style={{flex:1,minWidth:0,height:'100%'}}>
          <EstRequestOverview requests={requests} embedded={true}/>
        </div>
      )}

      {/* ── MAIN SCROLLABLE CONTENT ── */}
      {dashSection === 'list' && (
      <div style={{flex:1, overflowY:'auto', overflowX:'hidden', padding:'24px 40px 30px'}}>

      {/* ── Header ── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,gap:12,flexWrap:'wrap'}}>
        <h2 style={{fontSize:'1.3rem',fontWeight:700,letterSpacing:'0.1em',color:'rgba(255,255,255,0.85)',textTransform:'uppercase',margin:0,flexShrink:0}}>E-Dashboard</h2>

        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',flex:1,justifyContent:'flex-end'}}>
          {/* View mode toggle — hidden when role is set externally */}
          {!lockViewMode && (
            <div style={{display:'flex',alignItems:'flex-end',gap:4,flexShrink:0}}>
              {/* Requester / Estimator / KPI — regular pills */}
              <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:8,padding:3,gap:2}}>
                {(['requester','estimator','kpi']).map(vm=>{
                  const vc = VIEW_COLORS[vm];
                  const active = viewMode === vm;
                  return (
                    <button key={vm} onClick={()=>requestViewSwitch(vm)}
                      style={{padding:'6px 14px',borderRadius:6,border:active?`1px solid ${vc.bd}`:'1px solid transparent',background:active?vc.bg:'transparent',color:active?vc.act:'rgba(255,255,255,0.35)',fontFamily:F,fontSize:'0.75rem',fontWeight:active?700:500,cursor:'pointer',outline:'none',transition:'all 0.15s',letterSpacing:'0.04em',whiteSpace:'nowrap'}}>
                      {VIEW_LABELS[vm]}
                      {vm==='estimator' && <span style={{fontSize:'0.55rem',opacity:0.55,marginLeft:5}}>🔒</span>}
                    </button>
                  );
                })}
              </div>
              {/* Cost-Artist — arch-tab style */}
              <button onClick={()=>requestViewSwitch('director')}
                className={`arch-tab arch-tab-cost${viewMode==='director'?' arch-tab-cost-active':''}`}
                style={{
                  fontFamily:F,
                  opacity: viewMode==='director' ? 1 : 0.72,
                  ...(viewMode==='director' ? {
                    background:'linear-gradient(135deg,rgba(0,100,180,0.55),rgba(0,200,255,0.35))',
                    color:'rgba(140,240,255,1)',
                    borderColor:'rgba(0,200,255,0.70)',
                    boxShadow:'0 -6px 24px rgba(0,200,255,0.28), inset 0 1px 0 rgba(255,255,255,0.10)',
                  } : {}),
                }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                Cost-Artist 🔒
              </button>
            </div>
          )}

          {/* Requester name filter (only in requester mode) */}
          {viewMode === 'requester' && (
            <select value={requesterFilter} onChange={e=>setRequesterFilter(e.target.value)}
              style={{background:'rgba(0,10,30,0.70)',border:'1px solid rgba(0,200,255,0.22)',borderRadius:8,color:requesterFilter?'rgba(100,200,255,0.90)':'rgba(255,255,255,0.35)',fontFamily:F,fontSize:'0.8rem',padding:'8px 12px',outline:'none',cursor:'pointer',flexShrink:0}}>
              <option value="">All Requesters</option>
              {REQUESTERS_LIST.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          )}

          {/* Filtered count badge */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0,
            background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',
            borderRadius:8,padding:'5px 12px',lineHeight:1}}>
            <span style={{fontSize:'1.05rem',fontWeight:800,color:'rgba(255,255,255,0.88)',fontFamily:"'Inter',sans-serif",lineHeight:1}}>
              {filtered.length}
            </span>
            <span style={{fontSize:'0.48rem',letterSpacing:'0.14em',textTransform:'uppercase',
              color:'rgba(255,255,255,0.28)',fontWeight:600,marginTop:3}}>
              {filtered.length === requests.length ? 'Requests' : `of ${requests.length}`}
            </span>
          </div>

          {/* Search */}
          <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,overflow:'hidden',flex:1,minWidth:320,maxWidth:760}}>
            <span style={{padding:'0 14px',display:'flex',alignItems:'center',opacity:0.30,flexShrink:0}}><Search size={15} color="#fff"/></span>
            <input value={dsearch} onChange={e=>setDsearch(e.target.value)} placeholder="Search by project, client, contractor, ID, requester or estimator…"
              style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.82)',fontFamily:F,fontSize:'0.84rem',padding:'12px 0'}}/>
            {dsearch && <button onClick={()=>setDsearch('')} style={{background:'transparent',border:'none',cursor:'pointer',padding:'0 14px',display:'flex',alignItems:'center',opacity:0.4}}><X size={13} color="#fff"/></button>}
          </div>

          {/* List / Cards toggle */}
          <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:8,padding:3,gap:2,flexShrink:0}}>
            {/* List view */}
            <button title="List view" onClick={()=>setLayoutView('list')}
              style={{display:'flex',alignItems:'center',justifyContent:'center',width:30,height:30,borderRadius:6,border:layoutView==='list'?'1px solid rgba(100,180,255,0.50)':'1px solid transparent',background:layoutView==='list'?'rgba(100,180,255,0.15)':'transparent',cursor:'pointer',outline:'none',transition:'all 0.15s',padding:0}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="14" height="2.5" rx="1" fill={layoutView==='list'?'rgba(100,180,255,0.90)':'rgba(255,255,255,0.35)'}/>
                <rect x="1" y="6.75" width="14" height="2.5" rx="1" fill={layoutView==='list'?'rgba(100,180,255,0.90)':'rgba(255,255,255,0.35)'}/>
                <rect x="1" y="11.5" width="14" height="2.5" rx="1" fill={layoutView==='list'?'rgba(100,180,255,0.90)':'rgba(255,255,255,0.35)'}/>
              </svg>
            </button>
            {/* Card/dashboard view */}
            <button title="Dashboard view" onClick={()=>setLayoutView('cards')}
              style={{display:'flex',alignItems:'center',justifyContent:'center',width:30,height:30,borderRadius:6,border:layoutView==='cards'?'1px solid rgba(168,85,247,0.50)':'1px solid transparent',background:layoutView==='cards'?'rgba(168,85,247,0.15)':'transparent',cursor:'pointer',outline:'none',transition:'all 0.15s',padding:0}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill={layoutView==='cards'?'rgba(168,85,247,0.90)':'rgba(255,255,255,0.35)'}/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill={layoutView==='cards'?'rgba(168,85,247,0.90)':'rgba(255,255,255,0.35)'}/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill={layoutView==='cards'?'rgba(168,85,247,0.90)':'rgba(255,255,255,0.35)'}/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill={layoutView==='cards'?'rgba(168,85,247,0.90)':'rgba(255,255,255,0.35)'}/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Status chips + Export Excel (type filters moved to left sidebar) ── */}
      {!isEmbedded && (() => {
        const exportCsv = () => {
          const headers = ['ID','Status','Req Status','Project','Client','Main Contractor','Consultant','Estimator','Deal','Value (AED)','Lead Time','Submitted By','Request Date','Approved Date','Total Timeline'];
          const rows = filtered.map(r => {
            const fmsDays = ms => { if(!ms||ms<0)return''; const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000); return h>23?`${Math.floor(h/24)}d ${h%24}h`:`${h}h ${m}m`; };
            let startMs = r.submittedAt ? new Date(r.submittedAt).getTime() : null;
            if (!startMs && r.date) { const p=r.date.split('/'); const d=p.length===3?new Date(`${p[2]}-${p[1]}-${p[0]}`):new Date(r.date); if(!isNaN(d))startMs=d.getTime(); }
            const isApproved = r.directorAction==='approved'||r.reqStatus==='completed';
            const endMs = isApproved && r.directorRespondedAt ? new Date(r.directorRespondedAt).getTime() : null;
            const submittedDate = startMs ? new Date(startMs).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '';
            const approvedDate = isApproved && r.directorRespondedAt ? new Date(r.directorRespondedAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '';
            const totalTimeline = startMs && endMs ? fmsDays(endMs - startMs) : '';
            return [r.id,r.status,r.reqStatus,r.proj,r.client,r.mainContractor,r.consultant,r.estimator||'Unassigned',r.deal,r.projValue||'',r.leadTime||'',r.submittedBy||'',submittedDate,approvedDate,totalTimeline];
          });
          const csv = [headers,...rows].map(row=>row.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
          const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href=url; a.download=`EstimationDashboard_${new Date().toISOString().slice(0,10)}.csv`; a.click();
          URL.revokeObjectURL(url);
        };
        const pendingEstCount  = requests.filter(r => r.status === 'Pending Estimation').length;
        const pendingApprCount = requests.filter(r => r.reqStatus === 'pending-director').length;
        const unassignedCount  = requests.filter(r => !r.estimator).length;
        const rfiCount         = requests.filter(r => r.reqStatus === 'rfi').length;
        const approvedCount    = requests.filter(r => r.directorAction === 'approved' || r.reqStatus === 'completed').length;
        const statusChips = [
          { key:'pending-estimation', label:'Pending Estimation', count:pendingEstCount,  c:'rgba(220,165,0,0.90)',   bg:'rgba(220,165,0,0.10)',  bd:'rgba(220,165,0,0.30)'   },
          { key:'pending-approval',   label:'Pending Approval',   count:pendingApprCount, c:'rgba(180,130,255,0.90)', bg:'rgba(140,80,255,0.10)', bd:'rgba(180,130,255,0.30)' },
          { key:'unassigned',         label:'Unassigned',         count:unassignedCount,  c:'rgba(150,190,255,0.85)', bg:'rgba(60,100,200,0.10)', bd:'rgba(100,160,255,0.28)' },
          { key:'rfi',                label:'RFI',                count:rfiCount,         c:'rgba(251,191,36,0.90)',  bg:'rgba(180,120,0,0.10)',  bd:'rgba(251,191,36,0.35)'  },
          { key:'approved',           label:'Approved',           count:approvedCount,    c:'rgba(52,211,153,0.90)',  bg:'rgba(0,180,100,0.09)',  bd:'rgba(0,200,120,0.35)'   },
        ];
        const jihCount    = requests.filter(r => r.status === 'Pending Estimation' && r.deal === 'Job In Hand').length;
        const tenderCount = requests.filter(r => r.status === 'Pending Estimation' && r.deal === 'Tender').length;
        return (
          <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:16}}>
            {/* Status chips row */}
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              {statusChips.map(sc => {
                const active = statusFilter === sc.key;
                return (
                  <button key={sc.key} onClick={()=>{const nf=active?'':sc.key;setStatusFilter(nf);if(nf!=='pending-estimation')setPendingEstDealFilter('');}}
                    style={{display:'flex',alignItems:'center',gap:6,padding:'5px 14px',borderRadius:100,border:`1px solid ${active?sc.bd:'rgba(255,255,255,0.08)'}`,background:active?sc.bg:'rgba(255,255,255,0.03)',color:active?sc.c:'rgba(255,255,255,0.30)',fontFamily:F,fontSize:'0.72rem',fontWeight:active?700:500,cursor:'pointer',outline:'none',transition:'all 0.15s',letterSpacing:'0.04em',flexShrink:0}}>
                    <span style={{width:4,height:4,borderRadius:'50%',background:active?sc.c:'rgba(255,255,255,0.20)',flexShrink:0,transition:'all 0.15s',boxShadow:active?`0 0 5px ${sc.c}`:'none'}}/>
                    {sc.label}
                    <span style={{fontSize:'0.68rem',fontWeight:800,padding:'1px 6px',borderRadius:100,background:active?sc.c.replace(/[\d.]+\)$/,'0.18)'):'rgba(255,255,255,0.06)',color:active?sc.c:'rgba(255,255,255,0.28)'}}>{sc.count}</span>
                  </button>
                );
              })}
              <div style={{flex:1}}/>
              <button onClick={exportCsv}
                style={{display:'flex',alignItems:'center',gap:7,padding:'6px 16px',borderRadius:8,border:'1px solid rgba(52,211,153,0.30)',background:'rgba(52,211,153,0.07)',color:'rgba(52,211,153,0.85)',fontFamily:F,fontSize:'0.72rem',fontWeight:700,cursor:'pointer',outline:'none',transition:'all 0.15s',letterSpacing:'0.04em',flexShrink:0}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(52,211,153,0.16)';e.currentTarget.style.borderColor='rgba(52,211,153,0.55)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(52,211,153,0.07)';e.currentTarget.style.borderColor='rgba(52,211,153,0.30)';}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export Excel
              </button>
            </div>
            {/* Deal sub-filter — shown only when Pending Estimation is active */}
            {statusFilter === 'pending-estimation' && (
              <div style={{display:'flex',alignItems:'center',gap:8,paddingLeft:2,flexWrap:'wrap'}}>
                <span style={{fontSize:'0.52rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:600,fontFamily:F,flexShrink:0}}>DEAL ›</span>
                {[
                  {val:'',            label:'All',         count:pendingEstCount,  c:'rgba(220,165,0,0.80)',   bd:'rgba(220,165,0,0.30)',  bg:'rgba(220,165,0,0.08)'},
                  {val:'Job In Hand', label:'Job In Hand', count:jihCount,         c:'rgba(255,210,60,0.90)',  bd:'rgba(200,150,0,0.45)',  bg:'rgba(180,120,0,0.14)'},
                  {val:'Tender',      label:'Tender',      count:tenderCount,      c:'rgba(80,190,255,0.90)',  bd:'rgba(40,140,255,0.40)', bg:'rgba(20,80,200,0.12)'},
                ].map(d => {
                  const da = pendingEstDealFilter === d.val;
                  return (
                    <button key={d.val||'all'} onClick={()=>setPendingEstDealFilter(da?'':d.val)}
                      style={{display:'flex',alignItems:'center',gap:5,padding:'3px 11px',borderRadius:100,
                        border:`1px solid ${da?d.bd:'rgba(255,255,255,0.08)'}`,
                        background:da?d.bg:'rgba(255,255,255,0.02)',
                        color:da?d.c:'rgba(255,255,255,0.28)',
                        fontFamily:F,fontSize:'0.68rem',fontWeight:da?700:500,
                        cursor:'pointer',outline:'none',transition:'all 0.14s',letterSpacing:'0.04em',flexShrink:0}}>
                      <span style={{width:4,height:4,borderRadius:'50%',flexShrink:0,
                        background:da?d.c:'rgba(255,255,255,0.20)',
                        boxShadow:da?`0 0 5px ${d.c}`:'none',transition:'all 0.14s'}}/>
                      {d.label}
                      <span style={{fontSize:'0.62rem',fontWeight:800,padding:'0px 5px',borderRadius:100,
                        background:da?d.c.replace(/[\d.]+\)$/,'0.18)'):'rgba(255,255,255,0.06)',
                        color:da?d.c:'rgba(255,255,255,0.24)'}}>{d.count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {viewMode === 'estimator' && estTeamPage && (() => {
        const fmtDur = ms => {
          if (!ms) return '—';
          const d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000), m = Math.floor((ms % 3600000) / 60000);
          if (d > 0) return `${d}d ${h}h`; if (h > 0) return `${h}h ${m}m`; return `${m}m`;
        };

        // Build scored roster
        const scored = EST_ROSTER.map(e => {
          const rqs       = requests.filter(r => r.estimator === e.name);
          const inHand    = rqs.filter(r => r.reqStatus === 'inprogress' || r.reqStatus === 'pending-director');
          const closed    = rqs.filter(r => r.reqStatus === 'completed');
          const converted = rqs.filter(r => r.reqStatus === 'completed' && (r.status === 'Won' || r.directorAction === 'approved'));
          const won       = rqs.filter(r => (r.status||'').toLowerCase() === 'won');
          const lost      = rqs.filter(r => (r.status||'').toLowerCase() === 'lost');
          const followUp  = rqs.filter(r => /follow.?up|follow/i.test(r.status||''));
          const risk      = rqs.filter(r => /risk|at.?risk/i.test(r.status||'') || r.reqStatus === 'out-of-scope');
          const timings   = closed.filter(r => r.taggedAt && r.quotationSubmittedAt).map(r => new Date(r.quotationSubmittedAt).getTime() - r.taggedAt);
          const avgMs     = timings.length ? timings.reduce((a,b)=>a+b,0)/timings.length : null;
          const score     = closed.length * 3 + converted.length * 2 + inHand.length;
          return { e, rqs, inHand, closed, converted, won, lost, followUp, risk, timings, avgMs, score, isActive: inHand.length > 0 };
        }).sort((a,b) => b.score - a.score);

        const MEDALS = [
          {rank:1, emoji:'🥇', label:'Top Performer',  c:'rgba(255,215,0,1)',    bg:'rgba(255,200,0,0.14)',  bd:'rgba(255,200,0,0.55)',  gift:'rgba(255,200,0,0.90)'},
          {rank:2, emoji:'🥈', label:'2nd Place',       c:'rgba(192,192,192,1)', bg:'rgba(180,180,180,0.10)',bd:'rgba(192,192,192,0.50)',gift:'rgba(200,210,220,0.90)'},
          {rank:3, emoji:'🥉', label:'3rd Place',       c:'rgba(205,127,50,1)',  bg:'rgba(180,100,30,0.12)', bd:'rgba(200,120,50,0.50)', gift:'rgba(205,140,60,0.90)'},
        ];

        // Detail page modal
        if (estTeamDetail) {
          const entry = scored.find(s => s.e.code === estTeamDetail.code);
          const e = entry?.e;
          const pic = e ? PROFILE_PICS[e.code] : null;
          const medal = MEDALS.find(m => m.rank === scored.indexOf(entry)+1);
          const unlocked = estTeamDetail.unlocked;
          const allRqs = entry?.rqs || [];
          return (
            <div style={{position:'fixed',inset:0,zIndex:9800,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(24px)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F}} onClick={()=>{setEstTeamDetail(null);setEstTeamPin('');setEstTeamPinErr(false);}}>
              <div style={{width:'min(860px,96vw)',maxHeight:'92vh',overflowY:'auto',background:'rgba(4,2,18,0.98)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:24,boxShadow:'0 40px 100px rgba(0,0,0,0.80)',animation:'fadeUp 0.20s ease both'}} onClick={e=>e.stopPropagation()}>
                {/* Hero */}
                <div style={{position:'relative',height:300,overflow:'hidden',borderRadius:'24px 24px 0 0'}}>
                  {pic
                    ? <img src={pic} alt={e?.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',filter:'brightness(0.75) saturate(1.1)'}}/>
                    : <div style={{width:'100%',height:'100%',background:'radial-gradient(circle at 50% 40%,rgba(99,102,241,0.30),rgba(4,2,18,0.95))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'6rem',color:'rgba(196,181,253,0.35)'}}>{e?.name.charAt(0)}</div>
                  }
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(4,2,18,1) 0%,rgba(4,2,18,0.30) 55%,transparent 100%)'}}/>
                  {medal && <div style={{position:'absolute',top:18,left:22,display:'flex',alignItems:'center',gap:8,background:'rgba(0,0,0,0.65)',borderRadius:20,padding:'5px 14px',backdropFilter:'blur(8px)'}}>
                    <span style={{fontSize:'1.1rem'}}>{medal.emoji}</span>
                    <span style={{fontSize:'0.58rem',fontWeight:800,letterSpacing:'0.12em',textTransform:'uppercase',color:medal.c}}>{medal.label}</span>
                  </div>}
                  <button onClick={()=>{setEstTeamDetail(null);setEstTeamPin('');setEstTeamPinErr(false);}} style={{position:'absolute',top:14,right:14,width:32,height:32,borderRadius:'50%',background:'rgba(0,0,0,0.60)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.70)',fontSize:'1rem',cursor:'pointer',outline:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                  <div style={{position:'absolute',bottom:20,left:24}}>
                    <div style={{fontSize:'1.60rem',fontWeight:800,color:'#fff',textShadow:'0 2px 20px rgba(0,0,0,0.90)',lineHeight:1.15}}>{e?.name}</div>
                    <div style={{fontSize:'0.55rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(100,200,255,0.75)',marginTop:4}}>{e?.code} · Estimator</div>
                  </div>
                </div>

                {/* Body */}
                <div style={{padding:'24px 28px 32px',display:'flex',flexDirection:'column',gap:20}}>
                  {/* Stats grid */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                    {[
                      {val:entry?.inHand.length,   label:'In Hand',      c:'rgba(100,200,255,0.95)',bg:'rgba(0,180,255,0.07)',bd:'rgba(0,180,255,0.22)'},
                      {val:entry?.closed.length,   label:'Closed',       c:'rgba(0,220,130,0.95)', bg:'rgba(0,200,100,0.07)',bd:'rgba(0,200,100,0.22)'},
                      {val:entry?.converted.length,label:'To Sales',     c:'rgba(255,200,60,0.95)',bg:'rgba(220,150,0,0.07)', bd:'rgba(220,150,0,0.22)'},
                      {val:fmtDur(entry?.avgMs),   label:'Avg. to Quote',c:'rgba(255,160,80,0.95)',bg:'rgba(200,100,0,0.07)', bd:'rgba(200,100,0,0.22)'},
                    ].map(s=>(
                      <div key={s.label} style={{background:s.bg,border:`1px solid ${s.bd}`,borderRadius:12,padding:'14px 8px',textAlign:'center'}}>
                        <div style={{fontSize:'1.8rem',fontWeight:800,color:s.c,lineHeight:1,fontFamily:F}}>{s.val}</div>
                        <div style={{fontSize:'0.44rem',letterSpacing:'0.10em',textTransform:'uppercase',color:s.c,opacity:0.60,marginTop:5,fontWeight:700}}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Access-code gated section */}
                  {!unlocked ? (
                    <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:14,padding:'20px 22px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,200,60,0.80)" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        <span style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,200,60,0.80)',fontWeight:700}}>Confidential Profile — Enter Access Code</span>
                      </div>
                      <div style={{display:'flex',gap:10}}>
                        <input autoFocus value={estTeamPin} onChange={ev=>{setEstTeamPin(ev.target.value);setEstTeamPinErr(false);}}
                          onKeyDown={ev=>{ if(ev.key==='Enter'){ if(estTeamPin.trim().toUpperCase()===e?.code.toUpperCase()){setEstTeamDetail({...estTeamDetail,unlocked:true});setEstTeamPin('');}else setEstTeamPinErr(true); }}}
                          type="password" placeholder="Your personal access code…"
                          style={{flex:1,background:'rgba(255,255,255,0.05)',border:`1px solid ${estTeamPinErr?'rgba(255,80,80,0.55)':'rgba(255,255,255,0.14)'}`,borderRadius:9,color:'rgba(255,255,255,0.88)',fontFamily:F,fontSize:'0.92rem',padding:'10px 14px',outline:'none',letterSpacing:'0.20em',transition:'border-color 0.15s'}}/>
                        <button onClick={()=>{ if(estTeamPin.trim().toUpperCase()===e?.code.toUpperCase()){setEstTeamDetail({...estTeamDetail,unlocked:true});setEstTeamPin('');}else setEstTeamPinErr(true); }}
                          style={{padding:'10px 22px',borderRadius:9,background:'rgba(255,200,60,0.14)',border:'1px solid rgba(255,200,60,0.40)',color:'rgba(255,200,60,0.95)',fontFamily:F,fontSize:'0.80rem',fontWeight:700,cursor:'pointer',outline:'none',whiteSpace:'nowrap'}}>Unlock</button>
                      </div>
                      {estTeamPinErr && <div style={{fontSize:'0.72rem',color:'rgba(255,90,90,0.85)',marginTop:8}}>Incorrect code — try your estimator code (e.g. EX552)</div>}
                      {/* Blurred preview */}
                      <div style={{marginTop:16,filter:'blur(6px)',pointerEvents:'none',opacity:0.55,display:'flex',flexDirection:'column',gap:10}}>
                        {[['Salary (Monthly)','AED ••,•••'],['Department','Estimation'],['Join Date','•• ••• ••••'],['Performance Score','••/100']].map(([k,v])=>(
                          <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.06)',paddingBottom:8}}>
                            <span style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.45)'}}>{k}</span>
                            <span style={{fontSize:'0.76rem',fontWeight:700,color:'rgba(255,255,255,0.55)'}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{background:'rgba(0,220,130,0.04)',border:'1px solid rgba(0,220,130,0.22)',borderRadius:14,padding:'20px 22px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,220,130,0.80)" strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg>
                        <span style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,220,130,0.80)',fontWeight:700}}>Profile Unlocked</span>
                      </div>
                      {[['Salary (Monthly)','AED — (Configure in Admin)'],['Department','Estimation Division'],['Estimator Code',e?.code],['Total Requests',allRqs.length],['Success Rate',allRqs.length?`${Math.round((entry?.converted.length/Math.max(entry?.closed.length,1))*100)}%`:'—'],['Performance Score',`${entry?.score} pts`]].map(([k,v])=>(
                        <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(0,220,130,0.08)',padding:'9px 0'}}>
                          <span style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.45)'}}>{k}</span>
                          <span style={{fontSize:'0.78rem',fontWeight:700,color:'rgba(255,255,255,0.88)'}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Request history */}
                  {allRqs.length > 0 && (
                    <div>
                      <div style={{fontSize:'0.50rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:700,marginBottom:10}}>Request History ({allRqs.length})</div>
                      <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:200,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.08) transparent'}}>
                        {allRqs.map(r=>(
                          <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 12px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:8}}>
                            <span style={{fontSize:'0.68rem',color:'rgba(100,200,255,0.80)',fontFamily:'monospace',fontWeight:700,flexShrink:0}}>{r.id}</span>
                            <span style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</span>
                            <span style={{fontSize:'0.58rem',color:r.reqStatus==='completed'?'rgba(0,220,130,0.80)':'rgba(255,200,60,0.70)',fontWeight:600,flexShrink:0}}>{r.reqStatus==='completed'?'Closed':'Active'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // ── Top 3 gift-box podium ──
        const top3 = scored.slice(0,3);
        return (
          <div style={{display:'flex',flexDirection:'column',gap:32}}>

            {/* Podium / gift-box section */}
            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                <span style={{fontSize:'0.90rem'}}>🏆</span>
                <span style={{fontSize:'0.50rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,200,60,0.80)',fontWeight:800}}>Top Performers</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                {top3.map((s,idx)=>{
                  const m = MEDALS[idx];
                  const pic = PROFILE_PICS[s.e.code];
                  return (
                    <div key={s.e.code} onClick={()=>{setEstTeamDetail({code:s.e.code,name:s.e.name,unlocked:false});setEstTeamPin('');setEstTeamPinErr(false);}}
                      style={{background:m.bg,border:`1.5px solid ${m.bd}`,borderRadius:12,padding:'10px 10px',display:'flex',flexDirection:'row',alignItems:'center',gap:10,cursor:'pointer',transition:'transform 0.18s,box-shadow 0.18s',position:'relative',overflow:'hidden',boxShadow:`0 2px 14px ${m.bg}`}}
                      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 6px 22px ${m.bd}`;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=`0 2px 14px ${m.bg}`;}}>
                      {/* Gift box SVG */}
                      <div style={{position:'absolute',top:-4,right:-4,opacity:0.14,pointerEvents:'none'}}>
                        <svg width="38" height="38" viewBox="0 0 24 24" fill={m.c} stroke="none"><path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>
                      </div>
                      {/* Photo + rank badge */}
                      <div style={{position:'relative',flexShrink:0}}>
                        <div style={{width:44,height:44,borderRadius:'50%',overflow:'hidden',border:`2px solid ${m.bd}`,boxShadow:`0 0 10px ${m.bd}`}}>
                          {pic
                            ? <img src={pic} alt={s.e.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
                            : <div style={{width:'100%',height:'100%',background:'rgba(99,102,241,0.20)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:700,color:m.c}}>{s.e.name.charAt(0)}</div>
                          }
                        </div>
                        <div style={{position:'absolute',bottom:-4,right:-4,width:18,height:18,borderRadius:'50%',background:`linear-gradient(135deg,${m.c},${m.c}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.70rem',boxShadow:`0 0 8px ${m.bd}`}}>
                          {m.emoji}
                        </div>
                      </div>
                      {/* Info */}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:'0.72rem',fontWeight:800,color:'rgba(255,255,255,0.95)',fontFamily:F,lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.e.name}</div>
                        <div style={{fontSize:'0.42rem',letterSpacing:'0.12em',textTransform:'uppercase',color:m.c,fontWeight:700,marginTop:1}}>{m.label}</div>
                        <div style={{display:'flex',gap:4,marginTop:5,flexWrap:'wrap'}}>
                          <span style={{fontSize:'0.46rem',fontWeight:700,color:m.c,background:`${m.bg}`,border:`1px solid ${m.bd}`,borderRadius:20,padding:'1px 6px'}}>{s.closed.length} Closed</span>
                          <span style={{fontSize:'0.46rem',fontWeight:700,color:'rgba(255,220,80,0.90)',background:'rgba(220,150,0,0.10)',border:'1px solid rgba(220,150,0,0.30)',borderRadius:20,padding:'1px 6px'}}>{s.converted.length} Sales</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Full grid */}
            <div style={{fontSize:'0.50rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:700}}>All Estimators</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:22,marginTop:-16}}>
              {scored.map(({e,inHand,closed,converted,won,lost,followUp,risk,avgMs,isActive},idx) => {
                const medal = MEDALS[idx];
                const pic   = PROFILE_PICS[e.code];
                const borderC = medal ? medal.bd : isActive?'rgba(34,197,94,0.40)':'rgba(255,255,255,0.08)';
                return (
                  <div key={e.code}
                    onClick={()=>{setEstTeamDetail({code:e.code,name:e.name,unlocked:false});setEstTeamPin('');setEstTeamPinErr(false);}}
                    style={{background:'rgba(255,255,255,0.03)',border:`1.5px solid ${borderC}`,borderRadius:20,overflow:'hidden',display:'flex',flexDirection:'column',cursor:'pointer',boxShadow:medal?`0 0 30px ${medal.bg}`:isActive?'0 0 24px rgba(34,197,94,0.08)':'none',transition:'transform 0.18s,box-shadow 0.18s'}}
                    onMouseEnter={ev=>{ev.currentTarget.style.transform='translateY(-3px)';}}
                    onMouseLeave={ev=>{ev.currentTarget.style.transform='translateY(0)';}}>
                    {/* Full portrait photo */}
                    <div style={{position:'relative',height:320,background:'rgba(10,8,30,0.80)',overflow:'hidden',flexShrink:0}}>
                      {pic
                        ? <img src={pic} alt={e.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',filter:'brightness(0.92) saturate(1.15)'}}/>
                        : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'5rem',fontWeight:700,color:'rgba(196,181,253,0.35)',fontFamily:F,background:'radial-gradient(circle at 50% 40%,rgba(99,102,241,0.18),transparent 70%)'}}>{e.name.charAt(0)}</div>
                      }
                      <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:'linear-gradient(to top,rgba(4,2,18,0.95),transparent)',pointerEvents:'none'}}/>
                      <div style={{position:'absolute',bottom:14,left:18,right:14}}>
                        <div style={{fontSize:'1.05rem',fontWeight:800,color:'rgba(255,255,255,0.96)',fontFamily:F,textShadow:'0 2px 12px rgba(0,0,0,0.80)',lineHeight:1.2}}>{e.name}</div>
                        <div style={{fontSize:'0.50rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(100,200,255,0.65)',marginTop:3,fontFamily:F}}>{e.code} · Estimator</div>
                      </div>
                      {/* Medal / active badge */}
                      <div style={{position:'absolute',top:12,right:12,display:'flex',alignItems:'center',gap:5,background:'rgba(0,0,0,0.65)',borderRadius:20,padding:'4px 10px',backdropFilter:'blur(8px)'}}>
                        {medal
                          ? <><span style={{fontSize:'0.90rem'}}>{medal.emoji}</span><span style={{fontSize:'0.50rem',color:medal.c,fontWeight:800,letterSpacing:'0.10em',textTransform:'uppercase'}}>{medal.label}</span></>
                          : <><div style={{width:7,height:7,borderRadius:'50%',background:isActive?'#22c55e':'rgba(255,255,255,0.30)',boxShadow:isActive?'0 0 8px rgba(34,197,94,0.90)':'none'}}/><span style={{fontSize:'0.52rem',color:'rgba(255,255,255,0.80)',fontFamily:F,fontWeight:700}}>{isActive?'Active':'Available'}</span></>
                        }
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{padding:'14px 16px 18px',display:'flex',flexDirection:'column',gap:10}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:7}}>
                        {[
                          {val:inHand.length, label:'In Hand', c:'rgba(100,200,255,0.95)',bg:'rgba(0,180,255,0.07)',bd:'rgba(0,180,255,0.20)'},
                          {val:closed.length, label:'Closed',  c:'rgba(0,220,130,0.95)', bg:'rgba(0,200,100,0.07)',bd:'rgba(0,200,100,0.20)'},
                        ].map(s=>(
                          <div key={s.label} style={{background:s.bg,border:`1px solid ${s.bd}`,borderRadius:9,padding:'8px 4px',textAlign:'center'}}>
                            <div style={{fontSize:'1.4rem',fontWeight:800,color:s.c,lineHeight:1,fontFamily:F}}>{s.val}</div>
                            <div style={{fontSize:'0.40rem',letterSpacing:'0.09em',textTransform:'uppercase',color:s.c,opacity:0.65,marginTop:3,fontWeight:700}}>{s.label}</div>
                          </div>
                        ))}
                        {/* Sales breakdown box */}
                        <div style={{background:'rgba(255,180,60,0.05)',border:'1px solid rgba(255,180,60,0.18)',borderRadius:9,padding:'6px 6px',display:'flex',flexDirection:'column',gap:3}}>
                          {[
                            {val:won.length,     label:'Won',       c:'rgba(52,211,153,0.90)'},
                            {val:lost.length,    label:'Lost',      c:'rgba(255,90,90,0.85)'},
                            {val:followUp.length,label:'Follow-up', c:'rgba(100,200,255,0.80)'},
                            {val:risk.length,    label:'Risk',      c:'rgba(255,160,30,0.85)'},
                          ].map(s=>(
                            <div key={s.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:3}}>
                              <span style={{fontSize:'0.38rem',letterSpacing:'0.07em',textTransform:'uppercase',color:s.c,opacity:0.70,fontWeight:700,whiteSpace:'nowrap'}}>{s.label}</span>
                              <span style={{fontSize:'0.68rem',fontWeight:800,color:s.c,fontFamily:F,lineHeight:1}}>{s.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,180,50,0.05)',border:'1px solid rgba(255,180,50,0.18)',borderRadius:9,padding:'7px 12px'}}>
                        <span style={{fontSize:'0.46rem',letterSpacing:'0.09em',textTransform:'uppercase',color:'rgba(255,180,50,0.55)',fontWeight:700}}>Avg. Time to Quote</span>
                        <span style={{fontSize:'0.88rem',fontWeight:700,color:avgMs?'rgba(255,205,70,0.95)':'rgba(255,255,255,0.22)',fontFamily:F}}>{fmtDur(avgMs)}</span>
                      </div>
                      <div style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.22)',textAlign:'center',letterSpacing:'0.08em'}}>Tap to view full profile</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {viewMode === 'kpi' ? (() => {
        const fmtDur = ms => {
          if (!ms) return '—';
          const d = Math.floor(ms / 86400000);
          const h = Math.floor((ms % 86400000) / 3600000);
          const m = Math.floor((ms % 3600000) / 60000);
          if (d > 0) return `${d}d ${h}h`;
          if (h > 0) return `${h}h ${m}m`;
          return `${m}m`;
        };
        const totalCompleted = requests.filter(r => r.reqStatus === 'completed' || r.status === 'Approved' || r.status === 'Completed').length;
        const totalInHand    = requests.filter(r => r.estimator && r.reqStatus !== 'completed' && r.status !== 'Approved' && r.status !== 'Completed').length;
        return (
          <div style={{paddingTop:4}}>
            {/* Summary strip */}
            <div style={{display:'flex',gap:12,marginBottom:28,flexWrap:'wrap'}}>
              {[
                {label:'Total Requests',  val:requests.length,  c:'rgba(100,180,255,0.90)',  bg:'rgba(0,150,255,0.07)',  bd:'rgba(0,180,255,0.22)'},
                {label:'Completed',       val:totalCompleted,   c:'rgba(0,220,130,0.95)',    bg:'rgba(0,180,100,0.07)',  bd:'rgba(0,200,120,0.25)'},
                {label:'Active / In Hand',val:totalInHand,      c:'rgba(80,200,255,0.90)',   bg:'rgba(0,150,220,0.07)',  bd:'rgba(0,180,255,0.22)'},
                {label:'Unassigned',      val:requests.filter(r=>!r.estimator).length, c:'rgba(200,160,255,0.85)', bg:'rgba(130,80,255,0.07)', bd:'rgba(160,100,255,0.22)'},
              ].map(s=>(
                <div key={s.label} style={{flex:'1 1 140px',background:s.bg,border:`1px solid ${s.bd}`,borderRadius:12,padding:'14px 18px',display:'flex',flexDirection:'column',gap:4}}>
                  <span style={{fontSize:'1.6rem',fontWeight:800,color:s.c,fontFamily:F,lineHeight:1}}>{s.val}</span>
                  <span style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:s.c,opacity:0.55,fontWeight:700}}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Estimator cards */}
            <div style={{fontSize:'0.54rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,200,60,0.50)',marginBottom:18,fontWeight:700}}>Estimator Performance</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:18}}>
              {EST_ROSTER.map(e => {
                const myReqs = requests.filter(r => r.estimator === e.name);
                const done   = myReqs.filter(r => r.reqStatus==='completed'||r.status==='Approved'||r.status==='Completed');
                const active = myReqs.filter(r => r.reqStatus!=='completed'&&r.status!=='Approved'&&r.status!=='Completed');
                const timings = done.filter(r=>r.taggedAt&&r.quotationSubmittedAt)
                  .map(r=>new Date(r.quotationSubmittedAt).getTime()-r.taggedAt);
                const avgMs = timings.length ? timings.reduce((a,b)=>a+b,0)/timings.length : null;
                const isActive = active.length > 0;
                return (
                  <div key={e.code} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:18,padding:'26px 20px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:16,transition:'border-color 0.2s,box-shadow 0.2s',
                    ...(isActive?{borderColor:'rgba(34,197,94,0.28)',boxShadow:'0 0 24px rgba(34,197,94,0.06)'}:{})}}>

                    {/* Avatar + online dot */}
                    <div style={{position:'relative'}}>
                      <EstAvatar name={e.name} code={e.code} size={96}/>
                      <div style={{position:'absolute',bottom:4,right:4,width:16,height:16,borderRadius:'50%',
                        background:isActive?'#22c55e':'rgba(255,255,255,0.15)',
                        border:'2.5px solid rgba(4,2,14,0.95)',
                        boxShadow:isActive?'0 0 8px rgba(34,197,94,0.70)':'none',
                        transition:'all 0.3s'}}/>
                    </div>

                    {/* Name + code */}
                    <div style={{textAlign:'center',lineHeight:1.3}}>
                      <div style={{fontSize:'0.95rem',fontWeight:700,color:'rgba(255,255,255,0.90)',fontFamily:F}}>{e.name}</div>
                      <div style={{fontSize:'0.52rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(100,180,255,0.45)',marginTop:3,fontFamily:F}}>{e.code}</div>
                    </div>

                    {/* Completed / In Hand stat boxes */}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,width:'100%'}}>
                      <div style={{background:'rgba(0,200,100,0.07)',border:'1px solid rgba(0,200,100,0.22)',borderRadius:10,padding:'14px 8px',textAlign:'center'}}>
                        <div style={{fontSize:'2rem',fontWeight:800,color:'rgba(0,220,130,0.95)',lineHeight:1,fontFamily:F}}>{done.length}</div>
                        <div style={{fontSize:'0.46rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(0,200,100,0.50)',marginTop:5,fontWeight:700}}>Completed</div>
                      </div>
                      <div style={{background:'rgba(0,180,255,0.07)',border:'1px solid rgba(0,180,255,0.22)',borderRadius:10,padding:'14px 8px',textAlign:'center'}}>
                        <div style={{fontSize:'2rem',fontWeight:800,color:'rgba(80,200,255,0.95)',lineHeight:1,fontFamily:F}}>{active.length}</div>
                        <div style={{fontSize:'0.46rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(0,180,255,0.50)',marginTop:5,fontWeight:700}}>In Hand</div>
                      </div>
                    </div>

                    {/* Avg time */}
                    <div style={{width:'100%',background:'rgba(255,180,50,0.06)',border:'1px solid rgba(255,180,50,0.20)',borderRadius:10,padding:'11px 14px',textAlign:'center'}}>
                      <div style={{fontSize:'1.15rem',fontWeight:700,color:avgMs?'rgba(255,205,70,0.95)':'rgba(255,255,255,0.22)',fontFamily:F}}>{fmtDur(avgMs)}</div>
                      <div style={{fontSize:'0.46rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(255,180,50,0.45)',marginTop:4,fontWeight:700}}>Avg. Time to Quote</div>
                    </div>

                    {/* Active request titles (condensed) */}
                    {active.length > 0 && (
                      <div style={{width:'100%',display:'flex',flexDirection:'column',gap:4}}>
                        <div style={{fontSize:'0.46rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:700,marginBottom:1}}>Current</div>
                        {active.slice(0,3).map(r=>(
                          <div key={r.id} style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.55)',fontFamily:F,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'3px 8px',background:'rgba(255,255,255,0.04)',borderRadius:5,border:'1px solid rgba(255,255,255,0.07)'}}
                            title={r.proj}>
                            {r.id} — {r.proj||'—'}
                          </div>
                        ))}
                        {active.length > 3 && <div style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.25)',fontFamily:F,textAlign:'center'}}>+{active.length-3} more</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })() : (viewMode === 'estimator' && estTeamPage) ? null : requests.length === 0 ? (
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.95rem'}}>No requests submitted yet.</p>
      ) : filtered.length === 0 ? (
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.95rem'}}>No results match your filter.</p>
      ) : layoutView === 'cards' ? (
        /* ── Dashboard Card View ── */
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
          {filtered.map(r => {
            const realIdx = requests.indexOf(r);
            const caRejected = r.directorAction === 'rejected';
            const caRevised  = r.directorAction === 'revised';
            const isApproved = r.directorAction === 'approved' || r.reqStatus === 'completed';
            const myEstName = (STAFF_NAMES[userCode?.toUpperCase()] || '').toLowerCase();
            const isMyRequest = myEstName && (r.estimator||'').toLowerCase() === myEstName;
            const dashUnread = (viewMode==='estimator' && isMyRequest) ? _unreadCount(r.conversation, r.id, 'sales') : 0;
            const dealC = r.deal==='Job In Hand'?'rgba(255,210,60,0.85)':r.deal==='Tender'?'rgba(80,190,255,0.85)':r.deal==='Budget'?'rgba(52,211,153,0.85)':'rgba(168,85,247,0.85)';
            const dealBd = r.deal==='Job In Hand'?'rgba(200,150,0,0.30)':r.deal==='Tender'?'rgba(40,140,255,0.25)':r.deal==='Budget'?'rgba(16,185,129,0.25)':'rgba(130,60,220,0.25)';
            const cardBg = caRejected?'rgba(200,40,40,0.08)':caRevised?'rgba(180,30,100,0.09)':isApproved?'rgba(0,180,100,0.07)':'rgba(255,255,255,0.04)';
            const cardBd = caRejected?'rgba(220,60,60,0.38)':caRevised?'rgba(236,72,153,0.42)':isApproved?'rgba(0,200,120,0.30)':dashUnread>0?'rgba(168,85,247,0.35)':'rgba(255,255,255,0.09)';
            const statusC = caRejected?'rgba(255,90,90,0.90)':caRevised?'rgba(255,100,180,0.90)':isApproved?'rgba(52,211,153,0.90)':'rgba(255,255,255,0.55)';
            const statusLabel = caRejected?'Rejected':caRevised?'Correction Req.':isApproved?'Approved':r.status||'—';
            const submittedDate = (() => {
              let d = null;
              if (r.submittedAt) d = new Date(r.submittedAt);
              else if (r.date) { const p=r.date.split('/'); d=p.length===3?new Date(`${p[2]}-${p[1]}-${p[0]}`):new Date(r.date); }
              return d && !isNaN(d) ? d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'}) : '—';
            })();
            return (
              <div key={r.id}
                onClick={()=>{ setOpen(r.id); onOpenChange && onOpenChange(r.id); if(viewMode==='estimator') markDashSeen(r.id); }}
                style={{position:'relative',background:cardBg,border:`1px solid ${cardBd}`,borderRadius:12,padding:'14px 16px',cursor:'pointer',transition:'all 0.16s',display:'flex',flexDirection:'column',gap:10}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.32)';}}
                onMouseLeave={e=>{e.currentTarget.style.background=cardBg;e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>

                {/* Top row: ID + deal tag + unread badge */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                  <span style={{fontSize:'0.68rem',color:'rgba(100,180,255,0.85)',fontWeight:700,fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>
                    {r.id||'—'}
                  </span>
                  {r.deal && (
                    <span style={{fontSize:'0.50rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',
                      color:dealC,background:dealBd,border:`1px solid ${dealBd}`,
                      borderRadius:100,padding:'2px 8px',flexShrink:0}}>{r.deal}</span>
                  )}
                  {dashUnread > 0 && (
                    <span style={{fontSize:'0.48rem',background:'rgba(168,85,247,0.80)',color:'#fff',borderRadius:100,padding:'2px 7px',fontWeight:700,flexShrink:0}}>{dashUnread}</span>
                  )}
                </div>

                {/* Project name */}
                <div style={{fontSize:'0.82rem',fontWeight:700,color:'rgba(255,255,255,0.88)',lineHeight:1.3,
                  overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                  {r.proj||'—'}
                </div>

                {/* Client + Contractor */}
                <div style={{display:'flex',flexDirection:'column',gap:3}}>
                  {r.client && <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.52)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>🏢 {r.client}</span>}
                  {r.mainContractor && <span style={{fontSize:'0.66rem',color:'rgba(255,255,255,0.38)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>🏗 {r.mainContractor}</span>}
                  {r.address && <span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.32)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>📍 {r.address}</span>}
                  {r.numDoors && <span style={{fontSize:'0.62rem',color:'rgba(200,220,255,0.45)',whiteSpace:'nowrap'}}>🚪 {r.numDoors} door{Number(r.numDoors)!==1?'s':''}</span>}
                </div>

                {/* RFI comment — visible in card view */}
                {r.reqStatus === 'rfi' && r.rfiRemark && (
                  <div style={{background:'rgba(251,191,36,0.07)',border:'1px solid rgba(251,191,36,0.28)',borderRadius:6,padding:'7px 10px',display:'flex',flexDirection:'column',gap:3}}>
                    <span style={{fontSize:'0.46rem',fontWeight:800,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(251,191,36,0.75)'}}>RFI — Estimator Comment</span>
                    <span style={{fontSize:'0.68rem',color:'rgba(255,220,120,0.82)',lineHeight:1.45,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{r.rfiRemark}</span>
                  </div>
                )}

                {/* Divider */}
                <div style={{height:1,background:'rgba(255,255,255,0.07)'}}/>

                {/* Bottom row: status + estimator + date + value */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6,flexWrap:'wrap'}}>
                  <span style={{fontSize:'0.58rem',fontWeight:700,color:statusC,letterSpacing:'0.04em',
                    background:statusC.replace(/[\d.]+\)$/,'0.12)'),border:`1px solid ${statusC.replace(/[\d.]+\)$/,'0.28)')}`,
                    borderRadius:6,padding:'2px 8px',flexShrink:0}}>{statusLabel}</span>
                  {r.projValue && (
                    <span style={{fontSize:'0.60rem',fontWeight:700,color:'rgba(52,211,153,0.85)',marginLeft:'auto',flexShrink:0}}>
                      AED {Number(r.projValue).toLocaleString()}
                    </span>
                  )}
                </div>

                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,minWidth:0}}>
                    {r.estimator ? (
                      <>
                        <EstAvatar name={r.estimator} code={Object.entries(STAFF_NAMES).find(([,v])=>v===r.estimator)?.[0]||''} size={20}/>
                        <span style={{fontSize:'0.64rem',color:'rgba(100,180,255,0.80)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.estimator}</span>
                      </>
                    ) : (
                      <span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic'}}>Unassigned</span>
                    )}
                  </div>
                  <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.28)',flexShrink:0}}>{submittedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:6,overflowX:'auto'}}>
          <style>{`
            .dash-col-sep > * { border-right: 1px dashed rgba(255,255,255,0.18); padding-right: 6px; }
            .dash-col-sep > *:last-child { border-right: none; padding-right: 0; }
          `}</style>
          {/* ── Column headers ── */}
          <div className="dash-col-sep" style={{display:'grid',gridTemplateColumns:COL,gap:10,padding:'6px 16px',paddingRight:viewMode==='director'?44:16,minWidth:'fit-content',alignItems:'start'}}>
            <ColHdr colKey="id"            label="Req #"/>
            <ColHdr colKey="status"        label="Status"/>
            <ColHdr colKey="proj"          label="Project"/>
            <ColHdr colKey="mainContractor"label="Main Contractor"/>
            <ColHdr colKey="consultant"    label="Consultant"/>
            <ColHdr colKey="client"        label="Client"/>
            <ColHdr colKey="salesPerson"   label="Sales Person"/>
            <ColHdr colKey="projValue"     label="Value (AED)" align="right"/>
            <ColHdr colKey="estimator"     label="Estimator"/>
            <ColHdr colKey="numDoors"      label="# Doors" align="right"/>
            <ColHdr colKey="address"       label="Location"/>
            <ColHdr colKey="submittedDate" label="Request Date"/>
            <ColHdr colKey="approvedDate"  label="Approved Date"/>
            <ColHdr colKey="timeline"      label="Total Timeline"/>
          </div>
          {(hasAnyColFilter || sortCol) && (
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 16px',flexWrap:'wrap'}}>
              {hasAnyColFilter && <>
                <span style={{fontSize:'0.60rem',color:'rgba(251,191,36,0.65)',fontFamily:"'Inter',sans-serif"}}>Filters active</span>
                <button onClick={()=>{setColFilters({});setColFilterOpen(null);}}
                  style={{fontSize:'0.58rem',color:'rgba(251,191,36,0.80)',background:'rgba(251,191,36,0.10)',border:'1px solid rgba(251,191,36,0.30)',borderRadius:4,padding:'2px 8px',cursor:'pointer',outline:'none',fontFamily:"'Inter',sans-serif"}}>
                  Clear filters
                </button>
              </>}
              {sortCol && <>
                <span style={{fontSize:'0.60rem',color:'rgba(129,140,248,0.70)',fontFamily:"'Inter',sans-serif"}}>
                  Sorted by <strong style={{color:'rgba(129,140,248,0.95)'}}>{sortCol}</strong> {sortDir==='asc'?'A→Z':'Z→A'}
                </span>
                <button onClick={sortClear}
                  style={{fontSize:'0.58rem',color:'rgba(129,140,248,0.85)',background:'rgba(129,140,248,0.10)',border:'1px solid rgba(129,140,248,0.30)',borderRadius:4,padding:'2px 8px',cursor:'pointer',outline:'none',fontFamily:"'Inter',sans-serif"}}>
                  Clear sort
                </button>
              </>}
            </div>
          )}

          {/* ── Rows ── */}
          {sorted.map(r => {
            const realIdx = requests.indexOf(r);
            const myEstNameL = (STAFF_NAMES[userCode?.toUpperCase()] || '').toLowerCase();
            const isMyReqL = myEstNameL && (r.estimator||'').toLowerCase() === myEstNameL;
            const dashUnread = (viewMode==='estimator' && isMyReqL) ? _unreadCount(r.conversation, r.id, 'sales') : 0;
            const caRejected = r.directorAction === 'rejected';
            const caRevised  = r.directorAction === 'revised';
            const needsAction = (caRevised) && viewMode === 'estimator';
            const rowBg    = caRejected ? 'rgba(200,40,40,0.06)'  : caRevised ? 'rgba(180,30,100,0.07)'  : dashUnread>0 ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.04)';
            const rowBd    = caRejected ? 'rgba(220,60,60,0.40)'  : caRevised ? 'rgba(236,72,153,0.45)'  : dashUnread>0 ? 'rgba(168,85,247,0.30)' : 'rgba(255,255,255,0.07)';
            const rowBdHov = caRejected ? 'rgba(255,90,90,0.60)'  : caRevised ? 'rgba(255,100,180,0.65)' : 'rgba(255,255,255,0.14)';
            return (
              <div key={r.id} style={{position:'relative'}}>
              <div className="dash-col-sep" style={{display:'grid',gridTemplateColumns:COL,gap:10,alignItems:'start',background:rowBg,border:`1px solid ${rowBd}`,borderRadius:8,padding:'11px 16px',paddingRight: viewMode==='director' ? 44 : 16,transition:'background 0.2s,border-color 0.2s',cursor:'pointer',minWidth:'fit-content'}}
                onClick={()=>{ setOpen(r.id); onOpenChange && onOpenChange(r.id); if(viewMode==='estimator') markDashSeen(r.id); }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.borderColor=rowBdHov;}}
                onMouseLeave={e=>{e.currentTarget.style.background=rowBg;e.currentTarget.style.borderColor=rowBd;}}>

                {/* Req # */}
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  <span style={{fontSize:'0.72rem',color:'rgba(100,180,255,0.85)',fontWeight:600,fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:5}}>{r.id||'—'}{dashUnread>0&&<span style={{fontSize:'0.48rem',background:'rgba(168,85,247,0.80)',color:'#fff',borderRadius:100,padding:'1px 6px',fontFamily:"'Inter',sans-serif",fontWeight:700,flexShrink:0}}>{dashUnread}</span>}</span>
                  {r.deal && <span style={{fontSize:'0.42rem',fontWeight:700,letterSpacing:'0.09em',textTransform:'uppercase',color:r.deal==='Job In Hand'?'rgba(255,215,0,0.70)':r.deal==='Tender'?'rgba(79,255,223,0.70)':'rgba(160,130,255,0.65)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.deal}</span>}
                </div>

                {/* Status */}
                <div style={{display:'flex',flexDirection:'column',gap:3,overflow:'hidden',minWidth:0}}>
                  <Badge s={r.status}/>
                  {(() => {
                    if (caRejected) return (
                      <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:'0.52rem',color:'rgba(255,90,90,0.95)',fontWeight:700,letterSpacing:'0.05em',background:'rgba(220,50,50,0.14)',border:'1px solid rgba(220,60,60,0.35)',borderRadius:4,padding:'1px 6px',width:'fit-content'}}>
                        <span style={{width:4,height:4,borderRadius:'50%',background:'rgba(255,90,90,0.95)',flexShrink:0}}/>
                        Rejected by Cost-Artist
                      </span>
                    );
                    if (caRevised) return (
                      <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:'0.52rem',color:'rgba(255,100,180,0.95)',fontWeight:700,letterSpacing:'0.05em',background:'rgba(180,30,100,0.18)',border:'1px solid rgba(236,72,153,0.50)',borderRadius:4,padding:'1px 6px',width:'fit-content'}}>
                        <span style={{width:4,height:4,borderRadius:'50%',background:'rgba(255,100,180,0.95)',boxShadow:needsAction?'0 0 5px rgba(255,100,180,0.80)':'none',animation:needsAction?'pulse 1.6s ease-in-out infinite':'none',flexShrink:0}}/>
                        Correction Required
                      </span>
                    );
                    const subMap = {
                      'not-started':      {label:'Pending Assignment',  c:'rgba(255,200,50,0.60)'},
                      'inprogress':       {label:'Estimator Review',    c:'rgba(100,200,255,0.70)'},
                      'pending-director':    {label:'Cost-Artist Review',  c:'rgba(180,130,255,0.80)'},
                      'completed':        {label:'Completed',           c:'rgba(52,211,153,0.80)'},
                      'onhold':           {label:'On Hold',             c:'rgba(255,120,60,0.70)'},
                    };
                    const sub = subMap[r.reqStatus];
                    return sub ? <span style={{fontSize:'0.52rem',color:sub.c,fontWeight:600,letterSpacing:'0.05em'}}>{sub.label}</span> : null;
                  })()}
                  {needsAction && (
                    <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:'0.46rem',color:'rgba(255,190,50,0.80)',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase'}}>
                      ↺ Action Required
                    </span>
                  )}
                  {r.requestType==='revised' && (
                    <span style={{fontSize:'0.52rem',color:'rgba(0,200,255,0.70)',fontWeight:600,letterSpacing:'0.06em'}}>REVISE</span>
                  )}
                  {r.requestType==='finalPrice' && (
                    <span style={{fontSize:'0.52rem',color:'rgba(52,211,153,0.80)',fontWeight:600,letterSpacing:'0.06em'}}>FINAL</span>
                  )}
                  {r.reqStatus==='rfi' && r.rfiRemark && (
                    <span style={{fontSize:'0.52rem',color:'rgba(255,220,80,0.85)',fontStyle:'italic',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',lineHeight:1.4,marginTop:2}}>💬 {r.rfiRemark}</span>
                  )}
                </div>

                {/* Project */}
                <span style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.75)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block',minWidth:0}}>{r.proj||'—'}</span>

                {/* Main Contractor */}
                <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.50)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.mainContractor||'—'}</span>

                {/* Consultant */}
                <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.50)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.consultant||'—'}</span>

                {/* Client */}
                <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.65)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.client||'—'}</span>

                {/* Sales Person */}
                <span style={{fontSize:'0.74rem',color:r.salesPerson?'rgba(255,200,80,0.85)':'rgba(255,255,255,0.22)',fontStyle:r.salesPerson?'normal':'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.salesPerson||'—'}</span>

                {/* Value (AED) */}
                <span style={{fontSize:'0.72rem',color:r.projValue?'rgba(255,230,100,0.85)':'rgba(255,255,255,0.2)',fontWeight:r.projValue?600:400,textAlign:'right',whiteSpace:'nowrap',fontFamily:'monospace'}}>
                  {r.projValue ? Math.round(Number(r.projValue)).toLocaleString('en-AE') : '—'}
                </span>

                {/* Estimator */}
                <span style={{fontSize:'0.72rem',color:r.estimator?'rgba(100,180,255,0.85)':'rgba(255,255,255,0.22)',fontStyle:r.estimator?'normal':'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.estimator||'Unassigned'}</span>

                {/* # Doors */}
                <span style={{fontSize:'0.72rem',color:r.numDoors?'rgba(255,255,255,0.70)':'rgba(255,255,255,0.20)',fontFamily:'monospace',textAlign:'right',whiteSpace:'nowrap'}}>{r.numDoors||'—'}</span>

                {/* Location */}
                <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.50)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.address||'—'}</span>

                {/* Request Date */}
                {(() => {
                  let d = null;
                  if (r.submittedAt) d = new Date(r.submittedAt);
                  else if (r.date) {
                    const parts = r.date.split('/');
                    d = parts.length === 3 ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`) : new Date(r.date);
                  }
                  if (!d || isNaN(d)) return <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.18)'}}>—</span>;
                  return (
                    <div style={{display:'flex',flexDirection:'column',gap:1}}>
                      <span style={{fontSize:'0.68rem',fontWeight:600,color:'rgba(100,180,255,0.85)',whiteSpace:'nowrap'}}>
                        {d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
                      </span>
                      <span style={{fontSize:'0.54rem',color:'rgba(80,160,255,0.45)',whiteSpace:'nowrap'}}>
                        {d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false})}
                      </span>
                    </div>
                  );
                })()}

                {/* Approved Date */}
                {(() => {
                  const isApproved = r.directorAction === 'approved' || r.reqStatus === 'completed';
                  if (!isApproved || !r.directorRespondedAt) return <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.18)'}}>—</span>;
                  const d = new Date(r.directorRespondedAt);
                  return (
                    <div style={{display:'flex',flexDirection:'column',gap:1}}>
                      <span style={{fontSize:'0.68rem',fontWeight:600,color:'rgba(0,220,130,0.90)',whiteSpace:'nowrap'}}>
                        {d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
                      </span>
                      <span style={{fontSize:'0.54rem',color:'rgba(0,200,120,0.45)',whiteSpace:'nowrap'}}>
                        {d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false})}
                      </span>
                    </div>
                  );
                })()}

                {/* Total Timeline */}
                {(() => {
                  const fms = ms => {
                    if (!ms || ms < 0) return '—';
                    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
                    return h > 23 ? `${Math.floor(h/24)}d ${h%24}h` : `${h}h ${m}m`;
                  };
                  let startMs = r.submittedAt ? new Date(r.submittedAt).getTime() : null;
                  if (!startMs && r.date) {
                    const parts = r.date.split('/');
                    const d = parts.length === 3 ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`) : new Date(r.date);
                    if (!isNaN(d)) startMs = d.getTime();
                  }
                  if (!startMs) return <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.18)'}}>—</span>;
                  const isApproved = r.directorAction === 'approved' || r.reqStatus === 'completed';
                  const endMs = isApproved && r.directorRespondedAt ? new Date(r.directorRespondedAt).getTime() : Date.now();
                  const totalMs = endMs - startMs;
                  const isLive = !isApproved;
                  return (
                    <div style={{display:'flex',flexDirection:'column',gap:1}}>
                      <span style={{fontSize:'0.72rem',fontWeight:700,color:isApproved?'rgba(0,220,130,0.90)':'rgba(255,200,50,0.85)',fontFamily:'monospace',whiteSpace:'nowrap'}}>
                        {fms(totalMs)}
                      </span>
                      {isLive && <span style={{fontSize:'0.48rem',color:'rgba(255,200,50,0.50)',letterSpacing:'0.08em',textTransform:'uppercase'}}>live</span>}
                    </div>
                  );
                })()}

              </div>

              {/* Delete icon — absolute overlay, director only */}
              {viewMode === 'director' && (
                <button
                  onClick={e => { e.stopPropagation(); setDeleteConfirm(realIdx); }}
                  title="Delete request"
                  style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',display:'flex',alignItems:'center',justifyContent:'center',width:26,height:26,borderRadius:6,background:'rgba(220,50,50,0.10)',border:'1px solid rgba(220,50,50,0.28)',color:'rgba(220,80,80,0.80)',cursor:'pointer',outline:'none',transition:'background 0.15s, color 0.15s',flexShrink:0,zIndex:2}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.22)';e.currentTarget.style.color='rgba(255,100,100,1)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.10)';e.currentTarget.style.color='rgba(220,80,80,0.80)';}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteConfirm !== null && (
        <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.65)',backdropFilter:'blur(8px)'}}>
          <div style={{background:'rgba(12,8,28,0.98)',border:'1px solid rgba(220,60,60,0.40)',borderRadius:14,padding:'28px 32px',maxWidth:380,width:'90%',boxShadow:'0 20px 60px rgba(0,0,0,0.80)',display:'flex',flexDirection:'column',gap:16}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{width:10,height:10,borderRadius:'50%',background:'rgba(220,60,60,0.90)',boxShadow:'0 0 10px rgba(220,60,60,0.60)',flexShrink:0}}/>
              <span style={{fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(220,80,80,0.80)',fontWeight:700}}>Nour Alyazji · Delete Request</span>
            </div>
            <p style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.80)',lineHeight:1.55,margin:0}}>
              Permanently delete <strong style={{color:'rgba(100,180,255,0.95)',fontFamily:'monospace'}}>{requests[deleteConfirm]?.id}</strong>? This cannot be undone.
            </p>
            <div>
              <div style={{fontSize:'0.56rem',color:'rgba(255,100,100,0.60)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:6}}>Type <strong style={{color:'rgba(255,150,150,0.90)',letterSpacing:'0.08em'}}>xepa</strong> to confirm</div>
              <input
                autoFocus
                value={deleteCode}
                onChange={e=>setDeleteCode(e.target.value)}
                placeholder="xepa"
                style={{width:'100%',background:'rgba(220,50,50,0.08)',border:`1px solid ${deleteCode.toLowerCase()==='xepa'?'rgba(220,60,60,0.60)':'rgba(255,255,255,0.14)'}`,borderRadius:7,color:'rgba(255,200,200,0.95)',fontFamily:'monospace',fontSize:'0.96rem',fontWeight:700,padding:'8px 12px',outline:'none',boxSizing:'border-box',letterSpacing:'0.12em',transition:'border-color 0.2s'}}
              />
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={()=>{setDeleteConfirm(null);setDeleteCode('');}}
                style={{padding:'8px 20px',borderRadius:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.65)',cursor:'pointer',fontFamily:F,fontSize:'0.82rem',fontWeight:600,outline:'none',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.10)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                Cancel
              </button>
              <button
                disabled={deleteCode.toLowerCase()!=='xepa'}
                onClick={()=>{ if(deleteCode.toLowerCase()==='xepa'){onDelete(deleteConfirm);setDeleteConfirm(null);setDeleteCode('');setOpen(null);onOpenChange&&onOpenChange(null);} }}
                style={{padding:'8px 20px',borderRadius:7,background:deleteCode.toLowerCase()==='xepa'?'rgba(200,40,40,0.25)':'rgba(255,255,255,0.03)',border:`1px solid ${deleteCode.toLowerCase()==='xepa'?'rgba(220,60,60,0.55)':'rgba(255,255,255,0.08)'}`,color:deleteCode.toLowerCase()==='xepa'?'rgba(255,100,100,0.95)':'rgba(255,255,255,0.20)',cursor:deleteCode.toLowerCase()==='xepa'?'pointer':'not-allowed',fontFamily:F,fontSize:'0.82rem',fontWeight:700,outline:'none',transition:'all 0.2s'}}
                onMouseEnter={e=>{if(deleteCode.toLowerCase()==='xepa')e.currentTarget.style.background='rgba(200,40,40,0.38)';}}
                onMouseLeave={e=>{if(deleteCode.toLowerCase()==='xepa')e.currentTarget.style.background='rgba(200,40,40,0.25)';}}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
      )}{/* ── end MAIN SCROLLABLE CONTENT ── */}
    </div>
  );
};

const btnStyle = {
  background:'rgba(255,255,255,0.07)',
  border:'1px solid rgba(255,255,255,0.14)',
  color:'rgba(255,255,255,0.85)',
  fontFamily:"'Inter',sans-serif",
  fontSize:'0.82rem',fontWeight:600,
  padding:'11px 18px',borderRadius:7,
  cursor:'pointer',transition:'all 0.2s',
  letterSpacing:'0.04em',textAlign:'left',
};

// ─── ANALYSE PAGE ─────────────────────────────────────────────────────────────
const Analyse = ({ requests }) => {
  const F = "'Inter',sans-serif";

  // ── Derived stats ──────────────────────────────────────────────────────────
  // Helper: extract base request ID by stripping _R\d+ / _F\d+ revision suffixes
  const baseId = id => (id || '').replace(/(_R\d+|_F\d+)+$/, '');

  // De-duplicate revisions: for each base request, keep only the latest entry
  // so AX0146, AX0146_R1, AX0146_R2 count as 1 project, valued at the last revision.
  const uniqueBaseMap = {};
  requests.forEach(r => {
    const base = baseId(r.id);
    const prev = uniqueBaseMap[base];
    // Prefer entries with a projValue; otherwise take the latest by submittedAt
    if (!prev || (r.submittedAt || '') > (prev.submittedAt || '')) {
      uniqueBaseMap[base] = r;
    }
  });
  const uniqueRequests = Object.values(uniqueBaseMap);

  const total       = uniqueRequests.length;
  const pending     = requests.filter(r => r.reqStatus === 'not-started' || r.reqStatus === 'inprogress').length;
  const awaitDir    = requests.filter(r => r.reqStatus === 'pending-director').length;
  const approved    = requests.filter(r => r.directorAction === 'approved').length;
  const rejected    = requests.filter(r => r.directorAction === 'rejected').length;
  const revised     = requests.filter(r => r.requestType === 'revised').length;
  const finalPrice  = requests.filter(r => r.requestType === 'finalPrice').length;
  // Value totals use de-duplicated unique requests with latest projValue per base ID
  const withValue   = uniqueRequests.filter(r => r.projValue && Number(r.projValue) > 0);
  const totalValue  = withValue.reduce((s, r) => s + Number(r.projValue), 0);
  const avgValue    = withValue.length ? totalValue / withValue.length : 0;
  const withMargin  = requests.filter(r => r.margin && Number(r.margin) > 0);
  const avgMargin   = withMargin.length ? withMargin.reduce((s,r)=>s+Number(r.margin),0) / withMargin.length : 0;

  // ── Deal type breakdown ────────────────────────────────────────────────────
  const jobInHand   = requests.filter(r => r.deal === 'Job In Hand').length;
  const tender      = requests.filter(r => r.deal === 'Tender').length;

  // ── Supply breakdown ───────────────────────────────────────────────────────
  const supplyOnly    = requests.filter(r => r.supplyOnly).length;
  const supplyInstall = requests.filter(r => r.supplyInstall).length;

  // ── Top estimators by request count ───────────────────────────────────────
  const estMap = {};
  requests.forEach(r => { if (r.estimator) estMap[r.estimator] = (estMap[r.estimator]||0) + 1; });
  const topEstimators = Object.entries(estMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  // ── TAT stage averages ─────────────────────────────────────────────────────
  const fmsTAT = ms => {
    if (!ms) return '—';
    const h = Math.floor(ms/3600000); const m = Math.floor((ms%3600000)/60000);
    return h > 47 ? `${Math.floor(h/24)}d ${h%24}h` : `${h}h ${m}m`;
  };
  const tatStages = requests.map(r => calcTATStages(r));
  const avgStage = (key) => {
    const vals = tatStages.map(s=>s[key]).filter(v=>v>0);
    return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
  };
  const avgS1 = avgStage('s1'); const avgS2 = avgStage('s2'); const avgS3 = avgStage('s3');
  const totalRejections = requests.reduce((a,r)=>(a+(r.rejectionCycles?.length||0)),0);
  const rejectionRate = total > 0 ? ((requests.filter(r=>(r.rejectionCycles?.length||0)>0).length/total)*100).toFixed(0) : 0;
  // Per-estimator TAT
  const estTATMap = {};
  requests.forEach(r => {
    if (!r.estimator) return;
    const { s2 } = calcTATStages(r);
    if (!s2) return;
    if (!estTATMap[r.estimator]) estTATMap[r.estimator] = [];
    estTATMap[r.estimator].push(s2);
  });
  const estTATRanking = Object.entries(estTATMap)
    .map(([name, vals]) => ({ name, avg: vals.reduce((a,b)=>a+b,0)/vals.length, count: vals.length }))
    .sort((a,b)=>a.avg-b.avg).slice(0,5);

  // ── Recent requests (last 5) ───────────────────────────────────────────────
  const recent = [...requests].slice(0, 5);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fmt = n => Number(n).toLocaleString('en-AE', {maximumFractionDigits:0});

  const StatCard = ({label, value, sub, accent='rgba(0,200,255,0.85)', bg='rgba(0,180,255,0.07)', bd='rgba(0,180,255,0.18)'}) => (
    <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:12,padding:'18px 20px',display:'flex',flexDirection:'column',gap:6,flex:1,minWidth:140}}>
      <span style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.30)',fontWeight:600,fontFamily:F}}>{label}</span>
      <span style={{fontSize:'1.7rem',fontWeight:800,color:accent,fontFamily:'monospace',lineHeight:1}}>{value}</span>
      {sub && <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.35)',fontFamily:F}}>{sub}</span>}
    </div>
  );

  const BarRow = ({label, count, max, color}) => (
    <div style={{display:'flex',alignItems:'center',gap:10,fontFamily:F}}>
      <span style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.60)',minWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{label}</span>
      <div style={{flex:1,height:7,background:'rgba(255,255,255,0.07)',borderRadius:50,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${max>0?(count/max)*100:0}%`,background:color,borderRadius:50,transition:'width 0.5s ease'}}/>
      </div>
      <span style={{fontSize:'0.74rem',fontWeight:700,color,minWidth:20,textAlign:'right',fontFamily:'monospace'}}>{count}</span>
    </div>
  );

  if (total === 0) {
    return (
      <div style={{position:'relative',width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:F,gap:14,padding:'80px 40px'}}>
        <div style={{fontSize:'2.5rem',opacity:0.15}}>📊</div>
        <p style={{fontSize:'1rem',color:'rgba(255,255,255,0.30)',textAlign:'center'}}>No data to analyse yet.<br/>Submit some quotation requests first.</p>
      </div>
    );
  }

  return (
    <div className="analyse-wrap" style={{position:'relative',width:'100%',height:'100%',padding:'62px 40px 40px',overflowY:'auto',fontFamily:F,animation:'fadeUp 0.4s ease both'}}>
      <div style={{marginBottom:28}}>
        <p style={{fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(160,130,255,0.65)',marginBottom:6,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <h2 style={{fontSize:'1.5rem',fontWeight:800,color:'rgba(255,255,255,0.88)',margin:0}}>Analyse</h2>
        <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.35)',marginTop:4}}>Overview of all quotation requests and performance metrics.</p>
      </div>

      {/* ── KPI row ── */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:28}}>
        <StatCard label="Total Requests"    value={total}           accent='rgba(255,255,255,0.85)' bg='rgba(255,255,255,0.04)' bd='rgba(255,255,255,0.10)'/>
        <StatCard label="Pending / In Prog" value={pending}         accent='rgba(255,190,60,0.90)'  bg='rgba(255,160,30,0.07)'  bd='rgba(255,180,50,0.20)'/>
        <StatCard label="Awaiting Cost-Artist" value={awaitDir}        accent='rgba(160,130,255,0.90)' bg='rgba(140,80,255,0.07)'  bd='rgba(160,120,255,0.20)'/>
        <StatCard label="Approved"          value={approved}        accent='rgba(52,211,153,0.90)'  bg='rgba(16,185,129,0.07)'  bd='rgba(52,211,153,0.22)'/>
        <StatCard label="Rejected"          value={rejected}        accent='rgba(255,90,90,0.90)'   bg='rgba(200,50,50,0.07)'   bd='rgba(220,70,70,0.22)'/>
        <StatCard label="Total Value (AED)" value={`${fmt(totalValue)}`} sub={`avg ${fmt(avgValue)} / req`} accent='rgba(255,220,80,0.90)' bg='rgba(180,140,0,0.07)' bd='rgba(220,180,0,0.22)'/>
        <StatCard label="Avg Margin"        value={`${avgMargin.toFixed(1)}%`} sub={`across ${withMargin.length} priced requests`} accent='rgba(0,200,255,0.85)' bg='rgba(0,150,255,0.07)' bd='rgba(0,180,255,0.20)'/>
      </div>

      {/* ── Two-column breakdown ── */}
      <div className="analyse-2col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:28}}>

        {/* Request types */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px',display:'flex',flexDirection:'column',gap:12}}>
          <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:4,fontWeight:600}}>Request Types</p>
          <BarRow label="New Quotation"        count={total-revised-finalPrice} max={total} color='rgba(99,160,240,0.80)'/>
          <BarRow label="Revised Request"      count={revised}                  max={total} color='rgba(0,200,255,0.80)'/>
          <BarRow label="Final Price Request"  count={finalPrice}               max={total} color='rgba(52,211,153,0.80)'/>
        </div>

        {/* Deal & supply breakdown */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px',display:'flex',flexDirection:'column',gap:12}}>
          <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:4,fontWeight:600}}>Deal & Supply</p>
          <BarRow label="Job In Hand"      count={jobInHand}     max={total} color='rgba(255,215,0,0.80)'/>
          <BarRow label="Tender"           count={tender}        max={total} color='rgba(79,255,223,0.80)'/>
          <BarRow label="Supply Only"      count={supplyOnly}    max={total} color='rgba(160,130,255,0.80)'/>
          <BarRow label="Supply & Install" count={supplyInstall} max={total} color='rgba(255,150,100,0.80)'/>
        </div>

        {/* Top estimators */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px',display:'flex',flexDirection:'column',gap:10}}>
          <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:4,fontWeight:600}}>Top Estimators</p>
          {topEstimators.length === 0
            ? <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.25)',fontStyle:'italic'}}>No estimators assigned yet.</p>
            : topEstimators.map(([name,count])=>(
                <BarRow key={name} label={name} count={count} max={topEstimators[0][1]} color='rgba(100,180,255,0.80)'/>
              ))
          }
        </div>

        {/* Recent requests */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px',display:'flex',flexDirection:'column',gap:8}}>
          <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:4,fontWeight:600}}>Recent Requests</p>
          {recent.map(r => (
            <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:7}}>
              <span style={{fontFamily:'monospace',fontSize:'0.72rem',fontWeight:700,color:'rgba(220,165,0,0.85)',flexShrink:0}}>{r.id}</span>
              <span style={{flex:1,fontSize:'0.76rem',color:'rgba(255,255,255,0.65)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</span>
              {r.requestType==='revised'    && <span style={{fontSize:'0.58rem',color:'rgba(0,200,255,0.70)',fontWeight:700,flexShrink:0}}>REVISE</span>}
              {r.requestType==='finalPrice' && <span style={{fontSize:'0.58rem',color:'rgba(52,211,153,0.80)',fontWeight:700,flexShrink:0}}>FINAL</span>}
              <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAT Pipeline Analysis ── */}
      <div style={{marginBottom:10}}>
        <p style={{fontSize:'0.58rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(0,200,255,0.50)',marginBottom:16,fontWeight:600}}>TAT Pipeline Analysis</p>

        {/* Stage averages */}
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:20}}>
          {[
            { label:'Submission → Assignment', val:avgS1, color:'rgba(120,180,255,0.85)', icon:'①' },
            { label:'Assignment → Quotation',  val:avgS2, color:'rgba(255,200,50,0.85)',  icon:'②' },
            { label:'Quotation → Cost-Artist',    val:avgS3, color:'rgba(160,130,255,0.90)', icon:'③' },
          ].map(({label,val,color,icon})=>(
            <div key={label} style={{flex:1,minWidth:180,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'16px 18px'}}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}>
                <span style={{fontSize:'0.80rem',color,fontWeight:700}}>{icon}</span>
                <span style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:600}}>{label}</span>
              </div>
              <div style={{fontSize:'1.55rem',fontWeight:800,color,fontFamily:'monospace',lineHeight:1}}>{fmsTAT(val)}</div>
              <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.28)',marginTop:4}}>avg across {tatStages.filter(s=>s[label==='Submission → Assignment'?'s1':label==='Assignment → Quotation'?'s2':'s3']>0).length} requests</div>
            </div>
          ))}
          <div style={{flex:1,minWidth:180,background:'rgba(255,90,90,0.05)',border:'1px solid rgba(255,90,90,0.15)',borderRadius:12,padding:'16px 18px'}}>
            <div style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,120,120,0.50)',marginBottom:8,fontWeight:600}}>Rejection Cycles</div>
            <div style={{fontSize:'1.55rem',fontWeight:800,color:'rgba(255,100,100,0.85)',fontFamily:'monospace',lineHeight:1}}>{totalRejections}</div>
            <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.28)',marginTop:4}}>{rejectionRate}% of requests rejected at least once</div>
          </div>
        </div>

        {/* Per-estimator TAT */}
        {estTATRanking.length > 0 && (
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px'}}>
            <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:12,fontWeight:600}}>Estimator TAT (Assignment → Quotation) — fastest first</p>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {estTATRanking.map((e,i)=>(
                <div key={e.name} style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.25)',fontFamily:'monospace',width:16}}>{i+1}</span>
                  <span style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.70)',minWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</span>
                  <div style={{flex:1,height:6,background:'rgba(255,255,255,0.06)',borderRadius:50,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${estTATRanking.length>1?(1-(e.avg/estTATRanking[estTATRanking.length-1].avg))*100:60}%`,background:'rgba(255,200,50,0.70)',borderRadius:50}}/>
                  </div>
                  <span style={{fontSize:'0.74rem',fontWeight:700,color:'rgba(255,200,50,0.85)',fontFamily:'monospace',minWidth:60,textAlign:'right'}}>{fmsTAT(e.avg)}</span>
                  <span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.25)',fontFamily:'monospace',minWidth:24,textAlign:'right'}}>{e.count}req</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-request timeline strip */}
        <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'20px 22px',marginTop:16}}>
          <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:16,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Request Timelines</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
            {requests.slice(0,12).map(r => {
              const { s1, s2, s3 } = calcTATStages(r);
              const fmsTL = ms => {
                if (!ms) return null;
                const h = Math.floor(ms/3600000), m = Math.floor((ms%3600000)/60000);
                return h > 23 ? `${Math.floor(h/24)}d ${h%24}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
              };
              const fdtTL = ts => {
                if (!ts) return null;
                try { return new Date(isNaN(+ts)?ts:+ts).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}); } catch { return null; }
              };
              const rLabel = r.directorAction==='approved'?'Approved':r.directorAction==='rejected'?'Rejected':r.directorAction==='revise'?'Revised':'Pending Result';
              const rColor = r.directorAction==='approved'?'rgba(50,220,100,0.92)':r.directorAction==='rejected'?'rgba(255,80,80,0.92)':r.directorAction==='revise'?'rgba(255,160,30,0.92)':'rgba(180,180,180,0.28)';
              const totalMs = r.submittedAt && r.directorRespondedAt && r.directorAction==='approved'
                ? new Date(r.directorRespondedAt).getTime() - new Date(r.submittedAt).getTime() : null;
              const stgs = [
                { label:'Submitted',  color:'rgba(100,180,255,0.90)', ts: r.submittedAt,          dur: s1 },
                { label:'Assigned',   color:'rgba(255,200,50,0.90)',  ts: r.taggedAt,              dur: s2 },
                { label:'Quoted',     color:'rgba(168,130,255,0.95)', ts: r.quotationSubmittedAt, dur: s3 },
                { label: rLabel,      color: rColor,                   ts: r.directorRespondedAt,  dur: null },
              ];
              return (
                <div key={r.id} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'14px 16px',fontFamily:"'Inter',sans-serif"}}>
                  {/* Card header */}
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:14,paddingBottom:10,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:'monospace',fontSize:'0.72rem',fontWeight:700,color:'rgba(220,165,0,0.90)',marginBottom:2}}>{r.id}</div>
                      <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.75)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.client||'—'}</div>
                    </div>
                    <div style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.28)',textAlign:'right',flexShrink:0,marginTop:2}}>{r.estimator||'Unassigned'}</div>
                  </div>

                  {/* Vertical timeline stages */}
                  {stgs.map((st, i) => {
                    const done = !!st.ts;
                    const isLast = i === stgs.length - 1;
                    return (
                      <div key={i} style={{display:'flex',gap:10,minHeight: isLast ? 20 : 50}}>
                        {/* Dot + connector */}
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:14,flexShrink:0,paddingTop:2}}>
                          <div style={{
                            width:11,height:11,borderRadius:'50%',flexShrink:0,
                            background: done ? st.color : 'rgba(255,255,255,0.09)',
                            boxShadow: done ? `0 0 10px ${st.color}, 0 0 4px ${st.color}80` : 'none',
                            transition:'all 0.2s',
                          }}/>
                          {!isLast && (
                            <div style={{flex:1,width:1.5,marginTop:4,borderRadius:2,
                              background: done
                                ? `linear-gradient(to bottom, ${st.color}80, rgba(255,255,255,0.05))`
                                : 'rgba(255,255,255,0.05)'}}/>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{flex:1,paddingBottom: isLast ? 0 : 6,minWidth:0}}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6}}>
                            <span style={{fontSize:'0.70rem',fontWeight:done?700:500,
                              color: done ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.22)',
                              letterSpacing:'0.01em'}}>{st.label}</span>
                            {!isLast && st.dur && (
                              <span style={{fontSize:'0.64rem',fontFamily:'monospace',fontWeight:800,
                                color:st.color,letterSpacing:'0.02em',
                                textShadow:`0 0 10px ${st.color}70`,flexShrink:0}}>{fmsTL(st.dur)}</span>
                            )}
                          </div>
                          {done && fdtTL(st.ts)
                            ? <div style={{fontSize:'0.58rem',color:st.color,fontFamily:'monospace',fontWeight:600,opacity:0.78,marginTop:2,letterSpacing:'0.03em'}}>{fdtTL(st.ts)}</div>
                            : !done && <div style={{fontSize:'0.56rem',color:'rgba(255,255,255,0.16)',marginTop:2,fontStyle:'italic'}}>pending…</div>
                          }
                        </div>
                      </div>
                    );
                  })}

                  {/* Total time — approved only */}
                  {totalMs && (
                    <div style={{marginTop:10,paddingTop:9,borderTop:'1px solid rgba(50,220,100,0.15)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontSize:'0.50rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:700}}>Total Time</span>
                      <span style={{fontSize:'0.76rem',fontFamily:'monospace',fontWeight:800,
                        color:'rgba(50,220,100,0.92)',letterSpacing:'0.04em',
                        textShadow:'0 0 12px rgba(50,220,100,0.45)'}}>{fmsTL(totalMs)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TOOL OVERLAY ─────────────────────────────────────────────────────────────
function ToolOverlay({ onClose }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  const retry = () => { setStatus('loading'); };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9800,
      display:'flex', flexDirection:'column',
      background:'#04021a',
      animation:'toolFadeIn 0.25s ease',
    }}>
      {/* Top bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'10px 18px', flexShrink:0,
        background:'rgba(109,40,217,0.12)',
        borderBottom:'1px solid rgba(168,85,247,0.18)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:15}}>✦</span>
          <span style={{
            fontFamily:"'Inter',sans-serif", fontWeight:800,
            fontSize:'0.76rem', letterSpacing:'0.14em',
            background:'linear-gradient(135deg,#c4b5fd,#f9a8d4,#fdba74)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>AI TOOL WORKSPACE</span>
          {/* status dot */}
          <span style={{
            width:7, height:7, borderRadius:'50%', flexShrink:0,
            background: status==='ready' ? '#4ade80' : status==='error' ? '#f87171' : 'rgba(168,85,247,0.70)',
            boxShadow: status==='ready' ? '0 0 8px #4ade80' : status==='error' ? '0 0 8px #f87171' : '0 0 8px rgba(168,85,247,0.70)',
            animation: status==='loading' ? 'toolDotPulse 1.2s ease-in-out infinite' : 'none',
          }}/>
        </div>
        <button onClick={onClose} style={{
          display:'inline-flex', alignItems:'center', gap:6,
          background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
          borderRadius:9, padding:'6px 14px',
          color:'rgba(255,255,255,0.60)', cursor:'pointer',
          fontFamily:"'Inter',sans-serif", fontSize:'0.76rem', fontWeight:600,
          transition:'all 0.15s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(255,255,255,0.60)';}}
        >✕ Close</button>
      </div>

      {/* Loading overlay — sits on top of iframe while loading */}
      {status === 'loading' && (
        <div style={{
          position:'absolute', inset:0, top:45, zIndex:10,
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:28,
          background:'#04021a',
          animation:'toolFadeIn 0.2s ease',
        }}>
          {/* Orbiting ring animation */}
          <div style={{position:'relative', width:90, height:90}}>
            <div style={{
              position:'absolute', inset:0, borderRadius:'50%',
              border:'2px solid transparent',
              borderTopColor:'rgba(168,85,247,0.90)',
              borderRightColor:'rgba(168,85,247,0.30)',
              animation:'toolSpin 1s linear infinite',
            }}/>
            <div style={{
              position:'absolute', inset:10, borderRadius:'50%',
              border:'2px solid transparent',
              borderTopColor:'rgba(236,72,153,0.70)',
              borderLeftColor:'rgba(236,72,153,0.20)',
              animation:'toolSpin 1.6s linear infinite reverse',
            }}/>
            <div style={{
              position:'absolute', inset:22, borderRadius:'50%',
              border:'2px solid transparent',
              borderTopColor:'rgba(249,115,22,0.60)',
              animation:'toolSpin 2.2s linear infinite',
            }}/>
            <div style={{
              position:'absolute', inset:0, display:'flex',
              alignItems:'center', justifyContent:'center',
              fontSize:22, opacity:0.7,
            }}>✦</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{
              fontFamily:"'Inter',sans-serif", fontWeight:700,
              fontSize:'0.92rem', color:'rgba(196,181,253,0.85)',
              letterSpacing:'0.06em', marginBottom:8,
            }}>Connecting to workspace…</div>
            <div style={{
              fontFamily:"'Inter',sans-serif", fontSize:'0.72rem',
              color:'rgba(148,163,184,0.40)', letterSpacing:'0.08em',
            }}>Initializing AI engine</div>
          </div>
          {/* animated bar */}
          <div style={{
            width:200, height:2, borderRadius:2,
            background:'rgba(255,255,255,0.06)', overflow:'hidden',
          }}>
            <div style={{
              height:'100%', borderRadius:2,
              background:'linear-gradient(90deg,transparent,rgba(168,85,247,0.80),transparent)',
              animation:'toolBar 1.6s ease-in-out infinite',
            }}/>
          </div>
        </div>
      )}

      {/* Error screen */}
      {status === 'error' && (
        <div style={{
          position:'absolute', inset:0, top:45, zIndex:10,
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:22,
          background:'#04021a',
          animation:'toolFadeIn 0.3s ease',
        }}>
          {/* Pulsing error orb */}
          <div style={{
            width:84, height:84, borderRadius:'50%',
            background:'radial-gradient(circle,rgba(239,68,68,0.18) 0%,rgba(239,68,68,0.04) 70%)',
            border:'1px solid rgba(239,68,68,0.30)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:32,
            animation:'toolErrPulse 2s ease-in-out infinite',
            boxShadow:'0 0 32px rgba(239,68,68,0.15)',
          }}>⚡</div>
          <div style={{textAlign:'center'}}>
            <div style={{
              fontFamily:"'Inter',sans-serif", fontWeight:800,
              fontSize:'1.10rem', color:'rgba(252,165,165,0.90)',
              marginBottom:10,
            }}>Unable to Connect</div>
            <div style={{
              fontFamily:"'Inter',sans-serif", fontSize:'0.78rem',
              color:'rgba(148,163,184,0.45)', lineHeight:1.65,
              maxWidth:320,
            }}>The workspace is temporarily unavailable.<br/>Please check your connection and try again.</div>
          </div>
          <button onClick={retry} style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'10px 24px', borderRadius:100,
            background:'linear-gradient(135deg,rgba(109,40,217,0.50),rgba(168,85,247,0.40))',
            border:'1px solid rgba(168,85,247,0.35)',
            color:'rgba(196,181,253,0.90)',
            fontFamily:"'Inter',sans-serif", fontSize:'0.80rem', fontWeight:700,
            cursor:'pointer', letterSpacing:'0.06em', transition:'all 0.18s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,rgba(109,40,217,0.75),rgba(168,85,247,0.65))';e.currentTarget.style.color='#fff';}}
            onMouseLeave={e=>{e.currentTarget.style.background='linear-gradient(135deg,rgba(109,40,217,0.50),rgba(168,85,247,0.40))';e.currentTarget.style.color='rgba(196,181,253,0.90)';}}
          >↺ Retry</button>
        </div>
      )}

      {/* iframe — always mounted so it loads; hidden behind overlays */}
      <iframe
        key={status === 'loading' ? 'load' : 'loaded'}
        src="https://apex95-338841056432.us-west1.run.app"
        style={{
          flex:1, width:'100%', border:'none', background:'#fff',
          opacity: status === 'ready' ? 1 : 0,
          pointerEvents: status === 'ready' ? 'auto' : 'none',
          transition:'opacity 0.4s ease',
        }}
        allow="clipboard-read; clipboard-write; microphone; camera"
        title="AI Tool Workspace"
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('error')}
      />

      <style>{`
        @keyframes toolSpin      { to{transform:rotate(360deg)} }
        @keyframes toolBar       { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
        @keyframes toolDotPulse  { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes toolErrPulse  { 0%,100%{transform:scale(1);box-shadow:0 0 32px rgba(239,68,68,0.15)} 50%{transform:scale(1.06);box-shadow:0 0 48px rgba(239,68,68,0.28)} }
      `}</style>
    </div>
  );
}

// ─── DIRECT TOOL MODAL ────────────────────────────────────────────────────────
function DirectToolModal({ onClose, userCode }) {
  const [status, setStatus] = useState('loading');
  const toolUrl = userCode
    ? `https://apex95-338841056432.us-west1.run.app?code=${encodeURIComponent(userCode)}`
    : 'https://apex95-338841056432.us-west1.run.app';
  return (
    <>
      {/* Full-screen glassy surface */}
      <div style={{
        position:'fixed',inset:0,zIndex:9900,
        display:'flex',flexDirection:'column',
        background:'rgba(4,2,26,0.82)',
        backdropFilter:'blur(32px) saturate(180%)',
        WebkitBackdropFilter:'blur(32px) saturate(180%)',
        animation:'dtmFadeIn 0.25s ease',
      }}>
        {/* Header */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'10px 16px',flexShrink:0,
          background:'rgba(109,40,217,0.12)',
          borderBottom:'1px solid rgba(168,85,247,0.18)',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:13}}>✦</span>
            <span style={{
              fontFamily:"'Inter',sans-serif",fontWeight:800,
              fontSize:'0.74rem',letterSpacing:'0.14em',
              background:'linear-gradient(135deg,#c4b5fd,#f9a8d4,#fdba74)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
            }}>AI TOOL DIRECT</span>
            <span style={{
              width:7,height:7,borderRadius:'50%',flexShrink:0,
              background:status==='ready'?'#4ade80':status==='error'?'#f87171':'rgba(168,85,247,0.70)',
              boxShadow:status==='ready'?'0 0 8px #4ade80':status==='error'?'0 0 8px #f87171':'0 0 8px rgba(168,85,247,0.70)',
              animation:status==='loading'?'toolDotPulse 1.2s ease-in-out infinite':'none',
            }}/>
            {/* EST access code badge */}
            {userCode && (
              <div style={{display:'flex',alignItems:'center',gap:6,
                background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.30)',
                borderRadius:50,padding:'3px 12px 3px 8px'}}>
                <span style={{fontSize:'0.52rem',color:'rgba(196,181,253,0.55)',letterSpacing:'0.14em',textTransform:'uppercase',fontFamily:"'Inter',sans-serif",fontWeight:700}}>Access</span>
                <span style={{fontSize:'0.78rem',fontWeight:800,letterSpacing:'0.12em',color:'rgba(220,190,255,0.95)',fontFamily:'monospace'}}>{userCode}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            display:'inline-flex',alignItems:'center',gap:6,
            background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:9,padding:'6px 14px',
            color:'rgba(255,255,255,0.60)',cursor:'pointer',
            fontFamily:"'Inter',sans-serif",fontSize:'0.76rem',fontWeight:600,
            transition:'all 0.15s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.color='#fff';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(255,255,255,0.60)';}}
          >✕ Close</button>
        </div>

        {/* Loading */}
        {status==='loading' && (
          <div style={{
            position:'absolute',inset:0,top:45,zIndex:10,
            display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',gap:24,
            background:'#04021a',
          }}>
            <div style={{position:'relative',width:72,height:72}}>
              <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'2px solid transparent',borderTopColor:'rgba(168,85,247,0.90)',borderRightColor:'rgba(168,85,247,0.30)',animation:'toolSpin 1s linear infinite'}}/>
              <div style={{position:'absolute',inset:10,borderRadius:'50%',border:'2px solid transparent',borderTopColor:'rgba(236,72,153,0.70)',borderLeftColor:'rgba(236,72,153,0.20)',animation:'toolSpin 1.6s linear infinite reverse'}}/>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,opacity:0.7}}>✦</div>
            </div>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:'0.88rem',color:'rgba(196,181,253,0.85)',letterSpacing:'0.06em'}}>Connecting to workspace…</div>
          </div>
        )}

        {/* Error */}
        {status==='error' && (
          <div style={{
            position:'absolute',inset:0,top:45,zIndex:10,
            display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',gap:16,
            background:'#04021a',
          }}>
            <div style={{fontSize:'2rem'}}>⚠</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:'0.88rem',color:'rgba(248,113,113,0.90)'}}>Failed to load workspace</div>
            <button onClick={()=>setStatus('loading')} style={{
              padding:'8px 22px',borderRadius:9,
              background:'linear-gradient(135deg,rgba(109,40,217,0.50),rgba(168,85,247,0.40))',
              border:'1px solid rgba(168,85,247,0.35)',
              color:'rgba(196,181,253,0.90)',
              fontFamily:"'Inter',sans-serif",fontSize:'0.80rem',fontWeight:700,
              cursor:'pointer',letterSpacing:'0.06em',transition:'all 0.18s',
            }}>↺ Retry</button>
          </div>
        )}

        {/* iframe */}
        <iframe
          src={toolUrl}
          style={{
            flex:1,width:'100%',border:'none',background:'#fff',
            opacity:status==='ready'?1:0,
            pointerEvents:status==='ready'?'auto':'none',
            transition:'opacity 0.4s ease',
          }}
          allow="clipboard-read; clipboard-write; microphone; camera"
          title="AI Tool Direct"
          onLoad={()=>setStatus('ready')}
          onError={()=>setStatus('error')}
        />
      </div>
      <style>{`
        @keyframes dtmFadeIn { from{opacity:0;transform:scale(0.985)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </>
  );
}

// ─── INTRO SPLASH ─────────────────────────────────────────────────────────────
const IntroSplash = ({ onDone }) => {
  const [phase, setPhase] = useState(0); // 0=bot-only, 1=bot+aurora, 2=fade-out
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(onDone, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'#000108',
      display:'flex', alignItems:'center', justifyContent:'center',
      opacity: phase === 2 ? 0 : 1,
      transition:'opacity 0.75s ease',
      pointerEvents: phase === 2 ? 'none' : 'auto',
    }}>
      {/* Aurora rings — appear after bot */}
      {phase >= 1 && (
        <>
          <div style={{
            position:'absolute', width:'58vw', height:'58vw', borderRadius:'50%',
            background:'conic-gradient(from 0deg at 50% 50%, #ff0000, #ff7700, #ffff00, #00ff88, #00cfff, #6d28d9, #a855f7, #ec4899, #ff0000)',
            backgroundSize:'300% 300%', animation:'auroraFadeIn 0.9s ease forwards, auroraShift 4s ease-in-out 0.9s infinite',
            filter:'blur(64px)', opacity:0,
          }}/>
          <div style={{
            position:'absolute', width:'38vw', height:'38vw', borderRadius:'50%',
            background:'linear-gradient(120deg,#ff0000,#ff6600,#ffcc00,#00ff88,#00bfff,#8b5cf6,#ec4899)',
            backgroundSize:'300% 300%', animation:'auroraFadeIn 0.9s 0.2s ease forwards, auroraShift 3.5s ease-in-out 1.1s infinite reverse',
            filter:'blur(38px)', opacity:0,
          }}/>
        </>
      )}
      {/* AIBOT image */}
      <img src="/AIBOT.png" alt="AI Bot" style={{
        height:'68vh', width:'auto', objectFit:'contain',
        position:'relative', zIndex:1,
        animation:'introBotUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
      }}/>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AIEstimation({ onBack, onNavigate, initialRole, initialCode, initialView }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [intro,setIntro] = useState(true);
  const isEmbedded = new URLSearchParams(location.search).get('mode') === 'embed';
  const [userRole, setUserRole] = useState(() => {
    if (initialRole) return initialRole;
    if (location.pathname.startsWith('/estimation')) return 'estimator';
    if (location.pathname.startsWith('/sales')) return 'sales';
    return null;
  });
  const [userCode, setUserCode] = useState(initialCode || '');
  const [aiOpen,      setAiOpen]      = useState(false);
  const [toolOpen,    setToolOpen]    = useState(false);
  const [directOpen,  setDirectOpen]  = useState(initialView === 'directTool');

  // 1. Read the current URL to figure out which view to show
  const currentPath = location.pathname.split('/').pop();
  let view = 'landing';
  
  if (currentPath === 'estimation-dashboard') view = 'dashboard';
  else if (currentPath === 'new-request') view = 'form';
  else if (currentPath === 'revised-request') view = 'revisedSearch';
  else if (currentPath === 'revised-form') view = 'revisedForm';
  else if (currentPath === 'final-price') view = 'finalPriceSearch';
  else if (currentPath === 'final-price-form') view = 'finalPriceForm';
  else if (currentPath === 'relax') view = 'relax';
  else if (currentPath === 'open-requests') view = 'openRequests';
  else if (currentPath === 'est-overview') view = 'estOverview';
  else if (currentPath === 'my-team') view = 'myTeam';
  else if (currentPath === 'analyse') view = 'analyse';
  else if (currentPath === 'sales-dashboard') view = 'salesDashboard';
  else if (currentPath === 'quoted-requests') view = 'quotedRequests';
  else if (currentPath === 'track') view = 'trackQuotation';
  else if (currentPath === 'sales-status') view = 'salesStatus';
  else if (currentPath === 'performance') view = 'salesPerformance';
  else if (currentPath === 'activities') view = 'myActivities';
  else if (currentPath === 'diary') view = 'salesDiary';
  else if (currentPath === 'loading') view = 'loading';
  else if (currentPath === 'results') view = 'results';
  else if (currentPath === 'AIapextool') view = 'directTool';
  // If they are just at /estimation or /sales, show the default screen based on role
  else if (currentPath === 'estimation' || currentPath === 'sales') {
     view = (userRole === 'estimator' || userRole === 'director') ? 'dashboard' : 'landing';
  }


  // Access-code gate state
  const [tseGate, setTseGate] = useState(null);        // null | pending view name
  const [estDashGranted, setEstDashGranted] = useState(false); // EST gate for dashboard

  // Protected nav — requires code for certain views (director bypasses all)
  const navProtected = (targetView) => {
    if (userRole === 'director') { setView(targetView); return; }
    setTseGate(targetView);
  };

  // 2. Intercept setView and change the URL instead!
  const setView = (newView) => {
    const viewMap = {
      landing: '',
      dashboard: 'estimation-dashboard',
      form: 'new-request',
      revisedSearch: 'revised-request',
      revisedForm: 'revised-form',
      finalPriceSearch: 'final-price',
      finalPriceForm: 'final-price-form',
      relax: 'relax',
      openRequests: 'open-requests',
      estOverview: 'est-overview',
      myTeam: 'my-team',
      analyse: 'analyse',
      salesDashboard: 'sales-dashboard',
      quotedRequests: 'quoted-requests',
      trackQuotation: 'track',
      salesStatus: 'sales-status',
      salesPerformance: 'performance',
      myActivities: 'activities',
      salesDiary: 'diary',
      loading: 'loading',
      results: 'results',
      directTool: 'AIapextool' 
    };
    
    const targetPath = viewMap[newView] !== undefined ? viewMap[newView] : '';
    // Maintain the base path depending on if they logged in as Sales or Estimator
    const basePath = location.pathname.startsWith('/sales')
      ? '/sales'
      : location.pathname.startsWith('/estimation-hub/estimation')
      ? '/estimation-hub/estimation'
      : '/estimation';
    
    if (targetPath === '') {
        navigate(basePath);
    } else {
        navigate(`${basePath}/${targetPath}`);
    }
  };

  const handleRoleLogin = (role, code) => {
    setUserRole(role);
    setUserCode(code);
    if (role === 'estimator') {
      setView('dashboard');
    } else if (role === 'director') {
      setView('dashboard');
    }
    // Sales: stay on the current view (e.g. /sales/track) — don't redirect
  };

  const handleLogout = () => {
    onBack();
  };

  const _basePath = () => location.pathname.startsWith('/sales')
    ? '/sales'
    : location.pathname.startsWith('/estimation-hub/estimation')
    ? '/estimation-hub/estimation'
    : '/estimation';

  // Smart back — NavBar ← Back navigates to previous logical screen
  const handleNavBack = () => {
    if (view === 'revisedForm')       setView('revisedSearch');
    else if (view === 'finalPriceForm') setView('finalPriceSearch');
    else if (view === 'landing')      onBack();
    else setView('landing');
  };
  const [q,setQ] = useState('');
  const [id,setId] = useState('');
  const [requests,setRequests] = useState([]);
  const visibleRequests = requests.filter(r => !r.deletedAt);

  // Listen for filter changes sent by EstimationHub via postMessage (no iframe reload)
  useEffect(() => {
    if (!isEmbedded) return;
    const handler = (e) => {
      if (e.data?.type === 'apex_set_filter') setDashFilter(e.data.filter ?? '');
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isEmbedded]); // eslint-disable-line

  // Post sidebar counts to parent EstimationHub when running in embedded iframe
  useEffect(() => {
    if (!isEmbedded || !visibleRequests.length) return;
    try {
      window.parent.postMessage({
        type: 'apex_hub_counts',
        counts: {
          '':            visibleRequests.length,
          'new':         visibleRequests.filter(r => !r.requestType || r.requestType === 'new').length,
          'revise':      visibleRequests.filter(r => r.requestType === 'revised').length,
          'discount':    visibleRequests.filter(r => r.requestType === 'discount').length,
          'final':       visibleRequests.filter(r => r.requestType === 'finalPrice').length,
          'out-of-scope':visibleRequests.filter(r => r.reqStatus === 'out-of-scope').length,
          '__open__':    visibleRequests.filter(r => r.status === 'Pending Estimation' || !r.estimator).length,
        },
      }, '*');
    } catch {}
  }, [isEmbedded, requests]); // eslint-disable-line

  const [diaryEntries, setDiaryEntries] = useState([]);
  const [docUploadProgress, setDocUploadProgress] = useState(null); // null | [{name,size,status,url}]
  const [pendingSubmit, setPendingSubmit]           = useState(null); // {formData, newId, uploadedDocs}
  const latestRequestsRef = useRef(requests);
  const latestDiaryRef = useRef(diaryEntries);
  useEffect(() => {
    latestRequestsRef.current = requests;
    latestDiaryRef.current = diaryEntries;
  }, [requests, diaryEntries]);
  // ─── Azure data blob (all request + diary JSON lives here) ──────────────────
  const DATA_BLOB_URL = `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/apex-data.json?${AZURE_SAS}`;
  const currentEtag   = useRef(null);
  const saveTimer     = useRef(null);
  const isSaving      = useRef(false);
  const pendingSave   = useRef(false);

  const serializeRequests = (reqs) => reqs.map(r => ({
    ...r,
    docs:           (r.docs           || []).map(stripDocData),
    originalDocs:   (r.originalDocs   || []).map(stripDocData),
    estimationDoc:  r.estimationDoc   ? stripDocData(r.estimationDoc) : r.estimationDoc,
    estimationDocs: (r.estimationDocs || []).map(stripDocData),
  }));

  const mergeRequests = (local, remote) => {
    const remoteMap = new Map(remote.map(r => [r.id, r]));
    const updated = local.map(lr => {
      const rr = remoteMap.get(lr.id);
      if (!rr) return lr;
      return (rr.updatedAt || 0) > (lr.updatedAt || 0) ? rr : lr;
    });
    const localIds = new Set(local.map(r => r.id));
    const newFromRemote = remote.filter(r => !localIds.has(r.id));
    return [...newFromRemote, ...updated];
  };

  const saveToAzure = async (reqs, diary, retryOnConflict = true) => {
    if (isSaving.current) {
      pendingSave.current = true;
      return;
    }
    
    isSaving.current = true;
    try {
      const body = JSON.stringify({ requests: serializeRequests(reqs), diaryEntries: diary });
      const headers = { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': 'application/json' };
      if (currentEtag.current) headers['If-Match'] = currentEtag.current;
      
      const res = await fetch(DATA_BLOB_URL, { method: 'PUT', headers, body });
      
      if (res.ok) {
        currentEtag.current = res.headers.get('ETag') || null;
        console.log('✅ Saved to Azure');
      } else if (res.status === 412 && retryOnConflict) {
        console.warn('⚠️ Conflict — merging with remote and retrying');
        
        const fetchUrl = `${DATA_BLOB_URL}&_cb=${Date.now()}`;
        const getRes = await fetch(fetchUrl, { cache: 'no-store' }); 
        
        if (getRes.ok) {
          const remoteData = await getRes.json();
          currentEtag.current = getRes.headers.get('ETag') || null;
          const merged = mergeRequests(reqs, remoteData.requests || []);
          setRequests(prev => mergeRequests(prev, remoteData.requests || []));
          isSaving.current = false;
          await saveToAzure(merged, diary, false);
          return;
        }
      }
    } catch(err) { 
      console.error('Save error:', err); 
    } finally { 
      isSaving.current = false; 
      if (pendingSave.current) {
        pendingSave.current = false;
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveToAzure(latestRequestsRef.current, latestDiaryRef.current), 100);
      }
    }
  };

  // Load on startup — Azure first, fall back to JSONBin once for migration
  useEffect(() => {
    const LEGACY_BIN   = "69dcdffeaaba882197f3c176";
    const LEGACY_KEY   = "$2a$10$kpIFmWCwfUxqOw.M.TfqcOyhGnnArBzDluhGquW2s/t.L3vQJtBqW";
    const hydrateIDB = async (raw) => Promise.all(raw.map(async (req) => ({
      ...req,
      docs:           await Promise.all((req.docs            || []).map(restoreDocFromIDB)),
      originalDocs:   await Promise.all((req.originalDocs    || []).map(restoreDocFromIDB)),
      estimationDoc:  req.estimationDoc  ? await restoreDocFromIDB(req.estimationDoc) : req.estimationDoc,
      estimationDocs: req.estimationDocs ? await Promise.all(req.estimationDocs.map(restoreDocFromIDB)) : req.estimationDocs,
    })));
    const load = async () => {
      try {
        const res = await fetch(DATA_BLOB_URL, { cache: 'no-store' });
        if (res.ok) {
          currentEtag.current = res.headers.get('ETag') || null;
          const data = await res.json();
          // Backfill appLink / spLink for requests created before this feature
          const rawReqs = (data.requests || []).map(r => ({
            ...r,
            appLink: r.appLink || appLink(r.id),
            spLink:  r.spLink  || spLink(r.id),
          }));
          setRequests(await hydrateIDB(rawReqs));
          setDiaryEntries(data.diaryEntries || []);
          return;
        }
        if (res.status === 404) {
          // First run — migrate existing data from JSONBin into Azure
          console.log('apex-data.json not found — migrating from JSONBin…');
          try {
            const binRes = await fetch(`https://api.jsonbin.io/v3/b/${LEGACY_BIN}/latest`, {
              headers: { 'X-Master-Key': LEGACY_KEY }
            });
            if (binRes.ok) {
              const binData = await binRes.json();
              const raw = binData.record?.requests || [];
              const diary = binData.record?.diaryEntries || [];
              const enriched = await hydrateIDB(raw);
              setRequests(enriched);
              setDiaryEntries(diary);
              // Immediately write to Azure so future loads use it
              await saveToAzure(enriched, diary);
              console.log('✅ Migration complete — data now in Azure');
              return;
            }
          } catch(migErr) { console.warn('JSONBin migration skipped:', migErr); }
          setRequests([]);
          setDiaryEntries([]);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch(err) { console.error('Load failed:', err); }
    };
    load();
  }, []);

  // Debounced save — 1.2 s after last change to batch rapid updates
  useEffect(() => {
    if (requests.length === 0 && diaryEntries.length === 0) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveToAzure(requests, diaryEntries), 1500);
    return () => clearTimeout(saveTimer.current);
  }, [requests, diaryEntries]);

  // ── Notification toasts ──────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const appStartMs = useRef(Date.now());
  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // Auto-dismiss oldest toast after 6 s
  useEffect(() => {
    if (!toasts.length) return;
    const tid = setTimeout(() => setToasts(prev => prev.slice(1)), 6000);
    return () => clearTimeout(tid);
  }, [toasts]);

  // Full-state sync every 15 s — picks up changes from all other users
  useEffect(() => {
    const myName = (STAFF_NAMES[userCode] || userCode || '').toLowerCase();
    const watchRole = userRole === 'sales' ? 'estimator' : userRole === 'estimator' ? 'sales' : null;
    const poll = async () => {
      try {
        if (isSaving.current) return; // don't overwrite an in-flight save
        const res = await fetch(DATA_BLOB_URL, { cache: 'no-store' });
        if (!res.ok) return;
        const newEtag = res.headers.get('ETag');
        if (newEtag && newEtag === currentEtag.current) return; // nothing changed
        currentEtag.current = newEtag;
        const data = await res.json();
        const remote = data.requests || [];
        const remoteDiary = data.diaryEntries || [];
        // Merge full request state (status, assignments, comments, everything)
        setRequests(prev => mergeRequests(prev, remote));
        // Merge diary entries (append ones we don't have yet)
        setDiaryEntries(prev => {
          const existing = new Set(prev.map(d => d.id));
          const fresh = remoteDiary.filter(d => !existing.has(d.id));
          return fresh.length ? [...prev, ...fresh] : prev;
        });
        // Toast new conversation messages for this user
        if (watchRole) {
          const seen = _getSeen();
          const relevant = remote.filter(r =>
            userRole === 'sales'
              ? ((r.salesPerson||'').toLowerCase() === myName || (r.submittedBy||'').toLowerCase() === myName)
              : (r.estimator||'').toLowerCase() === myName
          );
          const newMsgs = [];
          relevant.forEach(r => {
            const lastSeen = Math.max((seen[r.id]||{})[watchRole] || 0, appStartMs.current);
            (r.conversation||[])
              .filter(m => m.role === watchRole && (m.tsMs||0) > lastSeen)
              .forEach(m => newMsgs.push({ reqId:r.id, client:r.client, proj:r.proj, from:m.from, text:m.text }));
          });
          if (newMsgs.length) {
            const base = Date.now();
            setToasts(prev => [...prev, ...newMsgs.map((m,i) => ({ id:base+i, ...m }))]);
          }

          // Fire toast for sales when estimator cancels (out-of-scope) or sends RFI
          if (userRole === 'sales') {
            const seenOos = (() => { try { return JSON.parse(localStorage.getItem('apex_seen_oos')||'{}'); } catch { return {}; } })();
            const oosToasts = [];
            relevant.forEach(r => {
              if (r.reqStatus === 'out-of-scope' && r.oosNotification?.tsMs) {
                const lastSeen = seenOos[r.id] || 0;
                if (r.oosNotification.tsMs > lastSeen && r.oosNotification.tsMs > appStartMs.current) {
                  oosToasts.push({ reqId:r.id, client:r.client, proj:r.proj, type:'oos', text: r.outScopeRemark || '' });
                  seenOos[r.id] = r.oosNotification.tsMs;
                }
              }
              if (r.reqStatus === 'rfi' && r.rfiNotification?.tsMs) {
                const key = `rfi_${r.id}`;
                const lastSeen = seenOos[key] || 0;
                if (r.rfiNotification.tsMs > lastSeen && r.rfiNotification.tsMs > appStartMs.current) {
                  oosToasts.push({ reqId:r.id, client:r.client, proj:r.proj, type:'rfi', text: r.rfiRemark || '' });
                  seenOos[key] = r.rfiNotification.tsMs;
                }
              }
            });
            if (oosToasts.length) {
              localStorage.setItem('apex_seen_oos', JSON.stringify(seenOos));
              const base2 = Date.now();
              setToasts(prev => [...prev, ...oosToasts.map((t,i) => ({ id:base2+i+500, ...t }))]);
            }
          }
        }
      } catch(e) { /* silent */ }
    };
    const tid = setInterval(poll, 15000);
    return () => clearInterval(tid);
  }, [userRole, userCode]);

  const [foundReq,setFoundReq] = useState(null);
  const [revisedSource,setRevisedSource] = useState(null);       // original request being revised
  const [finalPriceSource,setFinalPriceSource] = useState(null); // original request for final price

  const goLoad = (qid, match) => {
    setId(qid);
    setFoundReq(match || null);
    setView('loading');
    setTimeout(()=>setView('results'), 3400);
  };

  const handleSearch = () => {
    const raw = q.trim();
    if (!raw) return;
    const t = raw.toUpperCase();
    const lo = raw.toLowerCase();
    const match = visibleRequests.find(r =>
      r.id === t ||
      r.id.replace('AX','') === t ||
      (r.client||'').toLowerCase().includes(lo) ||
      (r.customer||'').toLowerCase().includes(lo) ||
      (r.proj||'').toLowerCase().includes(lo)
    );
    goLoad(match ? match.id : t, match);
  };

const nextRequestId = () => {
    const max = requests.reduce((m, r) => {
      const n = parseInt((r.id || '').replace(/^AX0*/,''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    return 'AX' + String(max + 1).padStart(4, '0');
  };

const finaliseSubmit = (formData, newId, uploadedDocs) => {
  const uniqueId = `${newId}-00`;
  const entry = {
    id: newId, uniqueId, parentRequestId: null, revisionNumber: 0, requestVersion: 'New',
    ...formData,
    docs: uploadedDocs,
    status: 'Pending Estimation',
    date: new Date().toLocaleDateString('en-GB'),
    submittedAt: new Date().toISOString(),
    estimationFile: null, estimator: null, margin: '', taggedAt: null,
    quotationSubmittedAt: null, reqStatus: 'not-started',
    directorAction: null, directorNote: '', rejectionCycles: [],
    timeline: [{ event:'submitted', ts:new Date().toISOString(), tsMs:Date.now(), label:'Request Submitted', by: formData.submittedBy||'' }],
    documentUrl: `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${newId}/`,
  };
  setRequests(prev => [entry, ...prev]);
  setDocUploadProgress(null);
  setPendingSubmit(null);
  setView('relax');
};

const runDocUploads = async (formData, newId, docFiles, completionCallback) => {
  const progress = docFiles.map(f => ({ name: f.name, size: f.size, status: 'pending', url: null }));
  setDocUploadProgress([...progress]);

  const uploadedDocs = [];
  for (let i = 0; i < docFiles.length; i++) {
    setDocUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'uploading' } : p));
    const url = await uploadToSharePoint(docFiles[i], newId);
    setDocUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'done', url: url || null } : p));
    uploadedDocs.push({ name: docFiles[i].name, type: docFiles[i].type, url: url || null, verified: !!url });
  }

  setTimeout(() => completionCallback(formData, newId, uploadedDocs), 900);
};

const handleSubmit = async (formData) => {
    const newId = nextRequestId();
    const docFiles = formData.docFiles || [];

    // Create request + navigate to relax immediately — uploads happen in background
    const entry = {
      id: newId, uniqueId: `${newId}-00`, parentRequestId: null, revisionNumber: 0, requestVersion: 'New',
      ...formData,
      docs: docFiles.map(f => ({ name: f.name, type: f.type, url: null, verified: false })),
      status: 'Pending Estimation',
      date: new Date().toLocaleDateString('en-GB'),
      submittedAt: new Date().toISOString(),
      estimationFile: null, estimator: null, margin: '', taggedAt: null,
      quotationSubmittedAt: null, reqStatus: 'not-started',
      directorAction: null, directorNote: '', rejectionCycles: [],
      timeline: [{ event:'submitted', ts:new Date().toISOString(), tsMs:Date.now(), label:'Request Submitted', by: formData.submittedBy||'' }],
      documentUrl: `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${newId}/`,
      appLink:     appLink(newId),
      spLink:      spLink(newId),
    };
    setRequests(prev => [entry, ...prev]);
    setView('relax');

    if (!docFiles.length) return;

    // Background uploads — silent, no error shown
    const uploadedDocs = [];
    for (const file of docFiles) {
      const url = await uploadToSharePoint(file, newId);
      uploadedDocs.push({ name: file.name, type: file.type, url: url || null, verified: !!url });
    }

    // Patch request with real URLs now that uploads finished
    setRequests(prev => prev.map(r => r.id === newId ? { ...r, docs: uploadedDocs } : r));
  };

  const handleFinalPriceSubmit = async (formData) => {
    const origId = formData.originalId;
    const existingFinals = origId ? latestRequestsRef.current.filter(r => r.originalId === origId && r.requestType === 'finalPrice').length : 0;
    const newId = origId ? `${origId}_F${existingFinals + 1}` : nextRequestId();
    const docFiles = formData.docFiles || [];

    const finaliseFinalPriceSubmit = (fData, nId, uDocs) => {
      const origEntry = fData.originalId
        ? latestRequestsRef.current.find(r => r.id === fData.originalId)
        : null;
      const autoEstimator = origEntry?.estimator || null;
      const nowTs = new Date().toISOString();
      const nowMs = Date.now();
      const entry = {
        id: nId,
        ...fData,
        docs: uDocs,
        status: 'Pending Estimation',
        date: new Date().toLocaleDateString('en-GB'),
        submittedAt: nowTs,
        estimationFile: null,
        estimator: autoEstimator,
        margin: '',
        taggedAt: autoEstimator ? nowMs : null,
        reqStatus: autoEstimator ? 'inprogress' : 'not-started',
        directorAction: null, directorNote: '',
        timeline: [
          { event:'submitted', ts:nowTs, tsMs:nowMs, label:'Final Price Request Submitted', by: fData.submittedBy||'' },
          ...(autoEstimator ? [{ event:'assigned', ts:nowTs, tsMs:nowMs, label:`Auto-assigned to ${autoEstimator} (previous estimator)`, by:'System' }] : []),
        ],
      };
      setRequests(prev => [entry, ...prev]);
      setFinalPriceSource(null);
      setDocUploadProgress(null);
      setPendingSubmit(null);
      setView('relax');
    };

    // Added the missing logic and closing brackets
    if (!docFiles.length) {
      finaliseFinalPriceSubmit(formData, newId, []);
      return;
    }
    await runDocUploads(formData, newId, docFiles, finaliseFinalPriceSubmit);
  };

  const handleRevisedSubmit = async (formData) => {
    const origId = formData.originalId;
    // Always derive the base ID by stripping any existing _R\d+ suffix so that
    // revising AX0146_R1 produces AX0146_R2, not AX0146_R1_R1.
    const baseId = origId ? origId.replace(/_R\d+$/, '') : null;
    const existingRevisions = baseId ? latestRequestsRef.current.filter(r => {
      const rBase = (r.id || '').replace(/_R\d+$/, '');
      return rBase === baseId && r.requestType === 'revised';
    }).length : 0;
    const newId = baseId ? `${baseId}_R${existingRevisions + 1}` : nextRequestId();
    const docFiles = formData.docFiles || [];

    const finaliseRevisedSubmit = (fData, nId, uDocs) => {
      // Look up the original using baseId so we always find the root request
      const origEntry = baseId
        ? latestRequestsRef.current.find(r => r.id === baseId)
        : null;
      const autoEstimator = origEntry?.estimator || null;
      const nowTs = new Date().toISOString();
      const nowMs = Date.now();
      const entry = {
        id: nId,
        ...fData,
        originalId: baseId,   // always point to base request, not a prior revision
        docs: uDocs,
        status: 'Pending Estimation',
        date: new Date().toLocaleDateString('en-GB'),
        submittedAt: nowTs,
        estimationFile: null,
        estimator: autoEstimator,
        margin: '',
        taggedAt: autoEstimator ? nowMs : null,
        reqStatus: autoEstimator ? 'inprogress' : 'not-started',
        directorAction: null, directorNote: '',
        timeline: [
          { event:'submitted', ts:nowTs, tsMs:nowMs, label:'Revised Request Submitted', by: fData.submittedBy||'' },
          ...(autoEstimator ? [{ event:'assigned', ts:nowTs, tsMs:nowMs, label:`Auto-assigned to ${autoEstimator} (previous estimator)`, by:'System' }] : []),
        ],
      };
      setRequests(prev => [entry, ...prev]);
      setRevisedSource(null);
      setDocUploadProgress(null);
      setPendingSubmit(null);
      setView('relax');
    };

    // Added the missing logic and closing brackets
    if (!docFiles.length) {
      finaliseRevisedSubmit(formData, newId, []);
      return;
    }
    await runDocUploads(formData, newId, docFiles, finaliseRevisedSubmit);
  };

  const updateRequest = async (id, patch) => { 
    // Changed parameter from 'idx' to 'id'
    const immediate = !!patch._immediate;
    const { _immediate, ...cleanPatch } = patch;
    
    if (cleanPatch.estimationDoc)  await saveDocToIDB(cleanPatch.estimationDoc);
    if (cleanPatch.estimationDocs) await Promise.all(cleanPatch.estimationDocs.map(saveDocToIDB));
    if (cleanPatch.docs)           await Promise.all(cleanPatch.docs.map(saveDocToIDB));
    if (cleanPatch.originalDocs)   await Promise.all(cleanPatch.originalDocs.map(saveDocToIDB));
    
    // Match by r.id instead of i === idx
    const next = (prev) => prev.map(r => r.id === id ? {...r, ...cleanPatch, updatedAt: Date.now()} : r);
    
    setRequests(prev => {
      const updated = next(prev);
      if (immediate) {
        clearTimeout(saveTimer.current);
        latestRequestsRef.current = updated;
        saveToAzure(updated, latestDiaryRef.current);
      }
      return updated;
    });
  };

  const deleteRequest = (idx) => {
    setRequests(prev => {
      const target = prev.filter(r => !r.deletedAt)[idx];
      if (!target) return prev;
      const now = Date.now();
      const updated = prev.map(r => r.id === target.id ? { ...r, deletedAt: now, updatedAt: now } : r);
      clearTimeout(saveTimer.current);
      latestRequestsRef.current = updated;
      saveToAzure(updated, latestDiaryRef.current);
      return updated;
    });
  };

  const retryDocUploads = async () => {
    if (!pendingSubmit) return;
    const { formData, newId, uploadedDocs, completionCallback } = pendingSubmit;
    const failedIdxs = (docUploadProgress || [])
      .map((p, i) => p.status === 'error' ? i : -1).filter(i => i >= 0);

    setDocUploadProgress(prev => prev.map((p, i) => failedIdxs.includes(i) ? { ...p, status: 'pending' } : p));

    const updatedDocs = [...uploadedDocs];
    const docFiles = formData?.docFiles || [];

    for (const i of failedIdxs) {
      setDocUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'uploading' } : p));

      let url = null;
      let verified = false;

      if (docFiles[i]) {
        url = await uploadToSharePoint(docFiles[i], newId, docFiles[i].name);
        verified = url ? await verifyFileUrl(url) : false;
      }

      const status = verified ? 'done' : 'error';
      setDocUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status, url: url || null } : p));
      updatedDocs[i] = { ...updatedDocs[i], url: url || updatedDocs[i]?.url, verified };
    }

    const allOk = updatedDocs.every(d => d.verified);
    setPendingSubmit(prev => ({ ...prev, uploadedDocs: updatedDocs }));
    if (allOk) setTimeout(() => completionCallback(formData, newId, updatedDocs), 900);
  };

  return (
    <div className="root">
      <style>{S}</style>
      <div className="veil"/>

      {/* Document upload overlay — shown for revised/final-price submissions only */}
      {docUploadProgress && view !== 'form' && view !== 'relax' && (
        <DocUploadOverlay
          items={docUploadProgress}
          onRetry={retryDocUploads}
          onSkip={() => pendingSubmit && pendingSubmit.completionCallback && pendingSubmit.completionCallback(pendingSubmit.formData, pendingSubmit.newId, pendingSubmit.uploadedDocs)}
        />
      )}

      {/* NN logo — hidden in embedded mode */}
      {!isEmbedded && (
        <div style={{position:'fixed',inset:0,zIndex:101,pointerEvents:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <img src="/NN.png" alt="" style={{width:'min(420px,55vw)',opacity:0.06,userSelect:'none',filter:'brightness(10) saturate(0)'}}/>
        </div>
      )}
      {/* NavBar hidden in embedded mode */}
      {!isEmbedded && (
        <NavBar view={view} setView={setView} navProtected={navProtected} onHome={onBack} onBack={handleNavBack} userRole={userRole} userCode={userCode} onLogout={handleLogout} onDirectTool={()=>window.open('https://wonderful-flower-020202300.7.azurestaticapps.net/estimation-hub/estimation/AIapextool','_blank','noopener,noreferrer')}
          onDirectorAccess={(code='STAR')=>{ setUserRole('director'); setUserCode(code); setView('dashboard'); }}
          searchQ={q} setSearchQ={setQ} onSearch={handleSearch}/>
      )}

      {/* ── Floating AI Bot button — landing only, estimator & director ── */}
      {view === 'landing' && (userRole === 'estimator' || userRole === 'director') && (
        <>
          <button onClick={()=>setAiOpen(o=>!o)}
            style={{
              position:'fixed', bottom:28, right:28, zIndex:9500,
              display:'inline-flex', alignItems:'center', gap:8,
              background: aiOpen ? 'linear-gradient(135deg,#6d28d9,#a855f7,#ec4899,#f97316)' : 'rgba(10,6,30,0.82)',
              backgroundSize:'200% 200%',
              animation: aiOpen ? 'auroraShift 4s ease-in-out infinite' : 'none',
              border:'1px solid rgba(168,85,247,0.50)', borderRadius:'100px',
              padding:'12px 22px', color:'#fff',
              fontFamily:"'Inter',sans-serif", fontSize:'0.82rem', fontWeight:700, letterSpacing:'0.10em',
              cursor:'pointer', outline:'none',
              boxShadow: aiOpen ? '0 6px 32px rgba(168,85,247,0.60)' : '0 4px 18px rgba(168,85,247,0.28)',
              backdropFilter:'blur(16px)', transition:'all 0.22s',
            }}
            onMouseEnter={e=>{if(!aiOpen){e.currentTarget.style.background='linear-gradient(135deg,#6d28d9,#a855f7,#ec4899,#f97316)';e.currentTarget.style.boxShadow='0 6px 32px rgba(168,85,247,0.55)';}}}
            onMouseLeave={e=>{if(!aiOpen){e.currentTarget.style.background='rgba(10,6,30,0.82)';e.currentTarget.style.boxShadow='0 4px 18px rgba(168,85,247,0.28)';}}}
          >✦ AI Bot</button>
          {aiOpen && <Estimator onClose={()=>setAiOpen(false)}/>}
        </>
      )}


      {directOpen && <DirectToolModal onClose={()=>setDirectOpen(false)} userCode={userCode}/>}

      <style>{`@keyframes toolFadeIn { from{opacity:0} to{opacity:1} }`}</style>
      {view==='landing'           && <Landing onNew={()=>setView('form')} onRevised={()=>setView('revisedSearch')} onFinalPrice={()=>setView('finalPriceSearch')} onDashboard={()=>setView('dashboard')} onOverview={()=>setView('estOverview')} onOpenReqs={()=>setView('openRequests')} onAnalyse={()=>setView('analyse')} q={q} setQ={setQ} onGo={handleSearch} onDirectTool={()=>window.open('/estimation-hub/estimation/AIapextool','_blank','noopener,noreferrer')} userRole={userRole}/>}
      {view==='form'              && <Form onSubmit={handleSubmit} onBack={()=>setView('landing')} docUploadProgress={docUploadProgress}/>}
      {view==='revisedSearch'     && <RevisedSearch requests={visibleRequests} onSelect={r=>{setRevisedSource(r);setView('revisedForm');}} onBack={()=>setView('landing')} userRole={userRole} userCode={userCode}/>}
      {view==='revisedForm'       && revisedSource && <RevisedForm original={revisedSource} onSubmit={handleRevisedSubmit} onBack={()=>setView('revisedSearch')}/>}
      {view==='finalPriceSearch'  && <FinalPriceSearch requests={visibleRequests} onSelect={r=>{setFinalPriceSource(r);setView('finalPriceForm');}} onBack={()=>setView('landing')} userRole={userRole} userCode={userCode}/>}
      {view==='finalPriceForm'    && finalPriceSource && <FinalPriceForm original={finalPriceSource} onSubmit={handleFinalPriceSubmit} onBack={()=>setView('finalPriceSearch')}/>}
      {view==='relax'          && <RelaxScreen onAnother={()=>setView('form')} onHome={()=>setView('landing')} docUploadProgress={docUploadProgress} onRetry={retryDocUploads}/>}
      {view==='openRequests' && <OpenRequests requests={visibleRequests} onUpdate={updateRequest} onDelete={deleteRequest} userCode={userCode} userRole={userRole} isEmbedded={isEmbedded}/>}
      {view==='dashboard' && <Dashboard
          requests={visibleRequests}
          onUpdate={updateRequest}
          onDelete={deleteRequest}
          initialViewMode={userRole==='director'?'director':'estimator'}
          onDirectTool={()=>window.open('/estimation-hub/estimation/AIapextool','_blank','noopener,noreferrer')}
          onOverview={()=>setView('estOverview')}
          onOpenReqs={()=>setView('openRequests')}
          docUploadProgress={docUploadProgress}
          setDocUploadProgress={setDocUploadProgress}
          setPendingSubmit={setPendingSubmit}
          retryDocUploads={retryDocUploads}
          pendingSubmit={pendingSubmit}
          userCode={userCode}
          isEmbedded={isEmbedded}
      />}
      {view==='estOverview'  && <EstRequestOverview requests={visibleRequests}/>}
      {view==='myTeam'       && <EstimationTeamView requests={visibleRequests}/>}
      {/* access code gates removed */}
      {view==='analyse'      && <Analyse requests={visibleRequests}/>}
      {view==='salesDashboard' && <SalesDashboard
          requests={visibleRequests}
          spName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):''}
          showAll={userRole==='director'}
          setView={setView}
          diaryEntries={diaryEntries}/>}
      {view==='trackQuotation' && <TrackQuotation requests={visibleRequests}
          spName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):''}
          showAll={userRole==='director'}
          onUpdate={updateRequest}
          userCode={userRole==='sales'?userCode:''}/>}
      {view==='salesStatus'  && <SalesStatusView requests={visibleRequests} onUpdate={updateRequest}
          autoSpName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):undefined}
          showAll={userRole==='director'}/>}
      {view==='quotedRequests' && <QuotedRequests requests={visibleRequests}
          spName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):''}
          showAll={userRole==='director'}
          onUpdate={updateRequest}/>}
      {view==='salesPerformance' && <SalesPerformance
          spName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):''}
          showAll={userRole==='director'}
          requests={visibleRequests}/>}
      {view==='myActivities' && <MyDailyActivities
          spName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):''}
          showAll={userRole==='director'}/>}
      {view==='salesDiary' && <SalesDiary
          diaryEntries={diaryEntries}
          spName={userRole==='sales' ? (STAFF_NAMES[userCode]||userCode) : ''}
          showAll={userRole==='director'}
          onAddEntry={e => setDiaryEntries(prev => [e, ...prev])}
          onEditEntry={e => setDiaryEntries(prev => prev.map(d => d.id === e.id ? e : d))}
          onDeleteEntry={id => setDiaryEntries(prev => prev.filter(d => d.id !== id))}
        />}
      {view==='loading'   && <Loading id={id} q={q} setQ={setQ} go={handleSearch}/>}
      {view==='results'   && <Results id={id} req={foundReq} q={q} setQ={setQ} go={handleSearch}/>}
      {view==='directTool'&& <DirectToolModal onClose={() => window.close()} userCode={userCode}/>}
      <NotifToast toasts={toasts} onDismiss={dismissToast}/>
    </div>
  );
}
