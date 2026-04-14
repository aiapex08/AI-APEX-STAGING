import { useState, useRef, useEffect } from 'react';
import { Search, Mail, X, FileText } from 'lucide-react';
import Estimator from './Estimator';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Dancing+Script:wght@700&display=swap');
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
  @keyframes robFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
  @keyframes visorScn { 0%{opacity:0;transform:translateY(-22px)} 12%{opacity:0.65} 88%{opacity:0.65} 100%{opacity:0;transform:translateY(22px)} }
  @keyframes callout  { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes coreOrb  { to{transform:rotate(360deg)} }
  @keyframes glowBtn  { 0%,100%{box-shadow:0 0 16px rgba(220,165,0,0.15)} 50%{box-shadow:0 0 36px rgba(220,165,0,0.38)} }

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

  .page-title { font-size:clamp(2.4rem,4.5vw,4.2rem); font-weight:800; letter-spacing:0.06em; text-transform:uppercase; line-height:1.1; margin-bottom:10px;
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
    height: 58px;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 28px;
    background: rgba(0,2,4,0.55);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(16px);
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
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50px;
    padding: 4px;
    gap: 2px;
  }
  .nav-btn {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.5);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    padding: 7px 20px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.22s;
    white-space: nowrap;
  }
  .nav-btn:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.08); }
  .nav-btn.active { color: #fff; background: rgba(255,255,255,0.14); font-weight: 600; }
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
  /* AIBOT2 — extreme left panel */
  .form-left {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 40%;
    background: url('/AIBOT2.png') left center / cover no-repeat;
    display: flex; flex-direction: column;
    justify-content: flex-start;
    padding: 78px 36px 40px 36px;
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
    gap: 16px; cursor: pointer;
    transition: all 0.25s;
    padding: 40px 24px;
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
    display: flex; flex-direction: column; gap: 10px;
    overflow-y: auto; scrollbar-width: none;
    padding: 32px 52px 40px 44px;
  }
  .form-right::-webkit-scrollbar { display: none; }
  .form-right-hdr {
    display: flex; flex-direction: column; gap: 6px;
    margin-bottom: 12px; padding-bottom: 18px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
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
    font-size: clamp(1.2rem, 2vw, 1.7rem); font-weight: 700;
    color: rgba(255,255,255,0.88); letter-spacing: 0.03em; margin: 0;
  }
  .form-right-hdr p {
    font-size: 0.82rem; color: rgba(255,255,255,0.32);
    font-weight: 300; line-height: 1.6; margin: 0;
  }
  .glass-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 14px 18px;
    color: rgba(255,255,255,0.8);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    backdrop-filter: blur(6px);
  }
  .glass-input:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.09); }
  .glass-input::placeholder { color: rgba(255,255,255,0.28); }
  .glass-textarea {
    width: 100%; min-height: 100px; resize: none;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 14px 18px;
    color: rgba(255,255,255,0.8);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
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
    padding: 0 14px; cursor: text;
  }
  .date-field-lbl {
    font-size: 0.85rem; color: rgba(255,255,255,0.38);
    white-space: nowrap; font-family: 'Inter', sans-serif; flex-shrink: 0;
  }
  .date-inner {
    flex: 1; background: transparent; border: none; outline: none;
    color: rgba(255,255,255,0.75); font-family: 'Inter', sans-serif;
    font-size: 0.88rem; padding: 13px 0; min-width: 0;
  }
  .remarks-box { min-height: 90px; }
  .check-row { display: flex; gap: 24px; flex-wrap: wrap; align-items: center; padding: 4px 0; }
  .glass-check {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 0.84rem; color: rgba(255,255,255,0.65);
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
    padding: 12px 22px;
    color: rgba(255,255,255,0.4);
    font-family: 'Inter', sans-serif; font-size: 0.82rem;
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
    width: 100%; padding: 18px 36px;
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
    margin-top: 8px;
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

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
const NavBar = ({ view, setView, onHome, onNavigate }) => {
  const homeActive    = ['landing','form','relax','revisedSearch','revisedForm','finalPriceSearch','finalPriceForm','loading','results'].includes(view);
  const dashActive    = view === 'dashboard';
  const analyseActive = view === 'analyse';
  const F = "'Inter',sans-serif";
  return (
    <div className="nav-bar">
      {/* Logo — always goes to main app intro */}
      <button onClick={onHome} style={{background:'transparent',border:'none',cursor:'pointer',padding:0,marginRight:20,flexShrink:0,display:'flex',alignItems:'center'}}>
        <img src="/NN.png" alt="NAFFCO Home" style={{height:36,width:'auto',objectFit:'contain',display:'block'}}/>
      </button>

      {/* Internal nav pills */}
      <div className="nav-pills">
        <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
          Home
        </button>
        <button className={`nav-btn${dashActive?' active':''}`} onClick={()=>setView('dashboard')}>
          Estimation Dashboard
        </button>
        <button className={`nav-btn${analyseActive?' active':''}`} onClick={()=>setView('analyse')}>
          Analyse
        </button>
      </div>


      {/* Cross-app navigation */}
      {onNavigate && (
        <div style={{display:'flex',alignItems:'center',gap:4,marginLeft:16}}>
          <div style={{width:1,height:22,background:'rgba(255,255,255,0.10)',marginRight:12,flexShrink:0}}/>
          <button onClick={()=>onNavigate('New SHOWROOM')}
            style={{background:'transparent',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.48)',fontFamily:F,fontSize:'0.74rem',fontWeight:500,padding:'6px 14px',borderRadius:50,cursor:'pointer',transition:'all 0.2s',whiteSpace:'nowrap',letterSpacing:'0.04em'}}
            onMouseEnter={e=>{e.currentTarget.style.color='rgba(255,255,255,0.88)';e.currentTarget.style.borderColor='rgba(255,255,255,0.30)';e.currentTarget.style.background='rgba(255,255,255,0.06)';}}
            onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.48)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.background='transparent';}}>
            AI Marketing
          </button>
          <button onClick={()=>onNavigate('dataAnalysis')}
            style={{background:'transparent',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.48)',fontFamily:F,fontSize:'0.74rem',fontWeight:500,padding:'6px 14px',borderRadius:50,cursor:'pointer',transition:'all 0.2s',whiteSpace:'nowrap',letterSpacing:'0.04em'}}
            onMouseEnter={e=>{e.currentTarget.style.color='rgba(255,255,255,0.88)';e.currentTarget.style.borderColor='rgba(255,255,255,0.30)';e.currentTarget.style.background='rgba(255,255,255,0.06)';}}
            onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.48)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.background='transparent';}}>
            Overall Dashboard
          </button>
        </div>
      )}

      <button className="nav-back" onClick={onHome} style={{marginLeft:'auto'}}>← Back</button>
    </div>
  );
};

// ─── VIEWS ──────────────────────────────────────────────────────────────────────────────
const Landing = ({onNew,onRevised,onFinalPrice,q,setQ,onGo}) => {
  return (
    <div className="land">
      <div className="left-col">
        <div style={{display:'flex', flexDirection:'column'}}>
          <p className="brand">NAFFCO · AI SYSTEM</p>
          <h1 className="page-title">AI APEX<br/>ESTIMATION</h1>
          <p className="page-sub">Intelligent quotation generation powered<br/>by advanced AI analysis.</p>
          <div style={{display:'flex',flexDirection:'row',gap:8,marginBottom:'34px'}}>
            {[
              {label:'Request a New Quotation', onClick:onNew},
              {label:'Revised Request',          onClick:onRevised},
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
        <img src="/AIBOT.png" alt="AI Bot" style={{position:'fixed',inset:0,zIndex:1,width:'100vw',height:'100vh',objectFit:'cover',objectPosition:'center top',display:'block',pointerEvents:'none'}}/>
      </div>
    </div>
  );
};

const Form = ({onSubmit, onBack}) => {
  const [f,setF] = useState({submittedBy:'',proj:'',mainContractor:'',consultant:'',client:'',email:'',mob:'',tel:'',leadTime:'',address:'',remarks:'',supplyOnly:false,supplyInstall:false,customerRank:0});
  const [deal,setDeal] = useState('Job In Hand');
  const [files,setFiles] = useState([]);
  const [drag,setDrag] = useState(false);
  const ref = useRef();
  const u = k => e => setF(p=>({...p,[k]:e.target.value}));
  const drop = e => { e.preventDefault(); setDrag(false); if(e.dataTransfer.files?.length) setFiles(p=>[...p,...Array.from(e.dataTransfer.files)]); };

  return (
    <div className="form-page">

      {/* ── LEFT — AIBOT2 extreme left panel ── */}
      <div className="form-left">
        <button onClick={onBack}
          style={{alignSelf:'flex-start',background:'transparent',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.45)',fontFamily:"'Inter',sans-serif",fontSize:'0.8rem',padding:0,display:'flex',alignItems:'center',gap:6,marginBottom:20,transition:'color 0.2s'}}
          onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.9)'}
          onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
          ← Back
        </button>
        <h2>Let's<br/>Quote a Best Offer</h2>
        <p className="sub">Upload your documents below</p>

        {/* Upload zone — fills remaining height */}
        <div style={{marginTop:16,flex:1,display:'flex',flexDirection:'column'}}>
          <div
            className={`upload-glass${drag?' drag':''}`}
            onClick={()=>ref.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={drop}
          >
            <input type="file" multiple ref={ref} style={{display:'none'}}
              onChange={e=>{if(e.target.files?.length)setFiles(p=>[...p,...Array.from(e.target.files)]);}}/>
            {files.length===0 ? (
              <>
                <FileText size={34} className="u-icon" color="rgba(255,255,255,0.3)"/>
                <p className="u-text">Drag & drop files, or <b>click to browse</b></p>
              </>
            ) : (
              <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.7)',fontWeight:600}}>{files.length} FILE{files.length>1?'S':''} ATTACHED</span>
                  <span onClick={e=>{e.stopPropagation();ref.current.click();}} style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.4)',cursor:'pointer'}}>+ Add More</span>
                </div>
                {files.map((file,i)=>(
                  <div key={i} className="file-chip-g">
                    <FileText size={13} color="rgba(255,255,255,0.5)"/>
                    <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</span>
                    <button onClick={e=>{e.stopPropagation();setFiles(p=>p.filter((_,j)=>j!==i));}}
                      style={{background:'transparent',border:'none',cursor:'pointer',padding:2,display:'flex'}}>
                      <X size={12} color="rgba(255,80,80,0.8)"/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT — form fields, inputs start from row 4 ── */}
      <div className="form-right">

        {/* Rows 1–3: header block */}
        <div className="form-right-hdr">
          <span className="fr-label"><span className="brand-text-glow">NAFFCO APEX · AI Estimation</span></span>
          <h3>Request Information</h3>
          <p>Fill in the details below — our AI will analyze and generate the best quotation for your project.</p>
        </div>

        {/* Row 4 onwards: form inputs */}
        <input className="glass-input" placeholder="Requestor Name" value={f.submittedBy} onChange={u('submittedBy')}/>
        <input className="glass-input" placeholder="Project" value={f.proj} onChange={u('proj')}/>
        <input className="glass-input" placeholder="Main Contractor" value={f.mainContractor} onChange={u('mainContractor')}/>
        <input className="glass-input" placeholder="Consultant" value={f.consultant} onChange={u('consultant')}/>
        <input className="glass-input" placeholder="Client / Grantor" value={f.client} onChange={u('client')}/>

        {/* Customer Ranking */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:9,backdropFilter:'blur(10px)'}}>
          <span style={{fontSize:'0.65rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.32)',fontWeight:600,flexShrink:0}}>Customer Rank</span>
          <div style={{display:'flex',gap:6}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} type="button" onClick={()=>setF(p=>({...p,customerRank:n}))}
                style={{background:'none',border:'none',cursor:'pointer',padding:0,fontSize:'1.2rem',lineHeight:1,color:f.customerRank>=n?'rgba(255,200,0,0.95)':'rgba(255,255,255,0.18)',transition:'color 0.15s',filter:f.customerRank>=n?'drop-shadow(0 0 5px rgba(255,200,0,0.60))':'none'}}>★</button>
            ))}
          </div>
          {f.customerRank>0 && <span style={{fontSize:'0.68rem',color:'rgba(255,200,0,0.55)',marginLeft:4}}>{['','Bronze','Silver','Gold','Platinum','Diamond'][f.customerRank]}</span>}
        </div>

        {/* Email + Mob + Tel — 3 columns */}
        <div className="three-col-row">
          <input className="glass-input" placeholder="Email ID" type="email" value={f.email} onChange={u('email')}/>
          <input className="glass-input" placeholder="MOB" value={f.mob} onChange={u('mob')}/>
          <input className="glass-input" placeholder="Tel" value={f.tel} onChange={u('tel')}/>
        </div>

        {/* Type + Deliver Lead Time + Supply — same row */}
        <div className="type-lead-row">
          <div className="type-row">
            <span className="type-lbl">Type :</span>
            <div className="glow-toggle">
              <div className={`glow-pill ${deal==='Job In Hand'?'jih':'tender'}`}/>
              <button className={deal==='Job In Hand'?'sel':''} onClick={()=>setDeal('Job In Hand')}>Job in hand</button>
              <button className={deal==='Tender'?'sel':''} onClick={()=>setDeal('Tender')}>Tender</button>
            </div>
          </div>
          <div className="date-field-wrap glass-input">
            <span className="date-field-lbl">Deliver Lead Time</span>
            <input type="date" className="date-inner" value={f.leadTime} onChange={u('leadTime')} style={{colorScheme:'dark'}}/>
          </div>
          <div className="check-row">
            <label className="glass-check">
              <input type="checkbox" checked={f.supplyOnly} onChange={e=>setF(p=>({...p,supplyOnly:e.target.checked,supplyInstall:e.target.checked?false:p.supplyInstall}))}/>
              <span className="check-box"/>
              <span>Supply Only</span>
            </label>
            <label className="glass-check">
              <input type="checkbox" checked={f.supplyInstall} onChange={e=>setF(p=>({...p,supplyInstall:e.target.checked,supplyOnly:e.target.checked?false:p.supplyOnly}))}/>
              <span className="check-box"/>
              <span>Supply &amp; Install</span>
            </label>
          </div>
        </div>

        <input className="glass-input" placeholder="Address" value={f.address} onChange={u('address')}/>
        <textarea className="glass-textarea remarks-box" placeholder="Remarks" value={f.remarks} onChange={u('remarks')}/>

        <button className="submit-glass" onClick={()=>onSubmit({...f,deal,docs:files.map(x=>x.name)})}>
          <span className="btn-text-glow">Submit Request &nbsp;↗</span>
        </button>
      </div>

    </div>
  );
};

// ─── REVISED REQUEST — SEARCH SCREEN ─────────────────────────────────────────
const RevisedSearch = ({requests, onSelect, onBack}) => {
  const [q, setQ] = useState('');
  const F2 = "'Inter',sans-serif";

  const filtered = q.trim()
    ? requests.filter(r => {
        const lo = q.trim().toLowerCase();
        return r.id.toLowerCase().includes(lo) ||
          (r.proj||'').toLowerCase().includes(lo) ||
          (r.client||'').toLowerCase().includes(lo) ||
          (r.submittedBy||'').toLowerCase().includes(lo);
      })
    : requests;

  return (
    <div style={{position:'relative',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'80px 60px 40px',overflowY:'auto',fontFamily:F2}}>
      <button onClick={onBack} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:'0.82rem',fontFamily:F2,marginBottom:28,alignSelf:'flex-start',display:'flex',alignItems:'center',gap:6,padding:0}}
        onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.9)'}
        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
        ← Back
      </button>

      <div style={{marginBottom:32}}>
        <p style={{fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,200,255,0.55)',marginBottom:8,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <h2 style={{fontSize:'clamp(1.6rem,2.4vw,2.2rem)',fontWeight:800,background:'linear-gradient(135deg,#fff 0%,rgba(200,220,255,0.85) 50%,#fff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8}}>
          Revised Request
        </h2>
        <p style={{fontSize:'0.84rem',color:'rgba(255,255,255,0.45)',lineHeight:1.6,maxWidth:480}}>
          Select the existing request you want to revise. The system will pull all project details and documents for reference.
        </p>
      </div>

      {/* Search bar */}
      <div style={{display:'flex',alignItems:'center',gap:0,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,marginBottom:24,maxWidth:520,overflow:'hidden'}}>
        <span style={{padding:'12px 14px',display:'flex',alignItems:'center'}}><Search size={15} color="rgba(255,255,255,0.4)"/></span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by ID, project, client or requestor..."
          style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.85)',fontSize:'0.86rem',fontFamily:F2,padding:'12px 0'}}/>
      </div>

      {/* Request list */}
      {requests.length === 0 ? (
        <div style={{color:'rgba(255,255,255,0.28)',fontSize:'0.86rem',marginTop:20}}>No existing requests found.</div>
      ) : filtered.length === 0 ? (
        <div style={{color:'rgba(255,255,255,0.28)',fontSize:'0.86rem',marginTop:20}}>No requests match your search.</div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:720}}>
          {filtered.map((r,i) => (
            <button key={r.id} onClick={()=>onSelect(r)}
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'14px 20px',cursor:'pointer',textAlign:'left',fontFamily:F2,display:'flex',alignItems:'center',gap:20,transition:'background 0.2s, border-color 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,180,255,0.07)';e.currentTarget.style.borderColor='rgba(0,180,255,0.25)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.09)';}}>
              <span style={{fontFamily:'monospace',fontSize:'0.82rem',fontWeight:700,color:'rgba(220,165,0,0.90)',flexShrink:0,minWidth:72}}>{r.id}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'0.86rem',fontWeight:600,color:'rgba(255,255,255,0.82)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</div>
                <div style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.38)',marginTop:3}}>{r.client||''}{r.client&&r.submittedBy?' · ':''}{r.submittedBy||''}</div>
              </div>
              <span style={{fontSize:'0.68rem',padding:'4px 10px',borderRadius:50,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.42)',flexShrink:0}}>{r.status}</span>
              <span style={{fontSize:'0.82rem',color:'rgba(0,200,255,0.55)',flexShrink:0}}>→</span>
            </button>
          ))}
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
          style={{alignSelf:'flex-start',background:'transparent',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.45)',fontFamily:F2,fontSize:'0.8rem',padding:0,display:'flex',alignItems:'center',gap:6,marginBottom:20,transition:'color 0.2s'}}
          onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.9)'}
          onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
          ← Back
        </button>

        {/* REVISED badge */}
        <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 12px',borderRadius:50,background:'rgba(0,150,255,0.12)',border:'1px solid rgba(0,180,255,0.30)',marginBottom:14,alignSelf:'flex-start'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'rgba(0,200,255,0.9)',boxShadow:'0 0 6px rgba(0,200,255,0.7)',flexShrink:0}}/>
          <span style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',color:'rgba(0,200,255,0.90)',textTransform:'uppercase'}}>Revised Request</span>
        </div>

        <h2 style={{fontSize:'clamp(1.2rem,2vw,1.7rem)',fontWeight:800,color:'rgba(255,255,255,0.88)',marginBottom:4,lineHeight:1.3}}>Original<br/>Request Details</h2>
        <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.38)',marginBottom:16,lineHeight:1.5}}>Reference — read only</p>

        {/* Original info rows */}
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:0,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'12px 14px'}}>
          {infoRows.map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'6px 0',gap:8}}>
              <span style={{fontSize:'0.69rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{k}</span>
              <span style={{fontSize:'0.73rem',color:'rgba(255,255,255,0.70)',textAlign:'right'}}>{v}</span>
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
                  <span style={{fontSize:'0.72rem',color:'rgba(99,160,240,0.78)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT — revision input panel ── */}
      <div className="form-right">
        <div className="form-right-hdr">
          <span className="fr-label"><span className="brand-text-glow">NAFFCO APEX · Revised Request</span></span>
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
          onClick={()=>{
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
              // Revision-specific
              requestType: 'revised',
              originalId: original.id,
              originalDocs: original.docs || [],
              originalRemarks: original.remarks || '',
              originalDetails: {
                submittedBy: original.submittedBy,
                date: original.date,
              },
              docs: newFiles.map(x=>x.name),
              remarks: revRemarks,
            });
          }}>
          <span className="btn-text-glow">Submit Revised Request &nbsp;↗</span>
        </button>
      </div>
    </div>
  );
};

// ─── FINAL PRICE REQUEST — SEARCH SCREEN ─────────────────────────────────────
const FinalPriceSearch = ({requests, onSelect, onBack}) => {
  const [q, setQ] = useState('');
  const F2 = "'Inter',sans-serif";

  const filtered = q.trim()
    ? requests.filter(r => {
        const lo = q.trim().toLowerCase();
        return r.id.toLowerCase().includes(lo) ||
          (r.proj||'').toLowerCase().includes(lo) ||
          (r.client||'').toLowerCase().includes(lo) ||
          (r.submittedBy||'').toLowerCase().includes(lo);
      })
    : requests;

  return (
    <div style={{position:'relative',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'80px 60px 40px',overflowY:'auto',fontFamily:F2}}>
      <button onClick={onBack} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:'0.82rem',fontFamily:F2,marginBottom:28,alignSelf:'flex-start',display:'flex',alignItems:'center',gap:6,padding:0}}
        onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.9)'}
        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
        ← Back
      </button>

      <div style={{marginBottom:32}}>
        <p style={{fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(52,211,153,0.65)',marginBottom:8,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <h2 style={{fontSize:'clamp(1.6rem,2.4vw,2.2rem)',fontWeight:800,background:'linear-gradient(135deg,#fff 0%,rgba(167,243,208,0.85) 50%,#fff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8}}>
          Final Price Request
        </h2>
        <p style={{fontSize:'0.84rem',color:'rgba(255,255,255,0.45)',lineHeight:1.6,maxWidth:480}}>
          Select the existing request you want to finalise. The system will pull all project details and documents for reference.
        </p>
      </div>

      {/* Search bar */}
      <div style={{display:'flex',alignItems:'center',gap:0,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(52,211,153,0.20)',borderRadius:10,marginBottom:24,maxWidth:520,overflow:'hidden'}}>
        <span style={{padding:'12px 14px',display:'flex',alignItems:'center'}}><Search size={15} color="rgba(52,211,153,0.50)"/></span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by ID, project, client or requestor..."
          style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.85)',fontSize:'0.86rem',fontFamily:F2,padding:'12px 0'}}/>
      </div>

      {/* Request list */}
      {requests.length === 0 ? (
        <div style={{color:'rgba(255,255,255,0.28)',fontSize:'0.86rem',marginTop:20}}>No existing requests found.</div>
      ) : filtered.length === 0 ? (
        <div style={{color:'rgba(255,255,255,0.28)',fontSize:'0.86rem',marginTop:20}}>No requests match your search.</div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:720}}>
          {filtered.map((r) => (
            <button key={r.id} onClick={()=>onSelect(r)}
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'14px 20px',cursor:'pointer',textAlign:'left',fontFamily:F2,display:'flex',alignItems:'center',gap:20,transition:'background 0.2s, border-color 0.2s'}}
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
          ))}
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
          style={{alignSelf:'flex-start',background:'transparent',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.45)',fontFamily:F2,fontSize:'0.8rem',padding:0,display:'flex',alignItems:'center',gap:6,marginBottom:20,transition:'color 0.2s'}}
          onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.9)'}
          onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
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
              <span style={{fontSize:'0.69rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{k}</span>
              <span style={{fontSize:'0.73rem',color:'rgba(255,255,255,0.70)',textAlign:'right'}}>{v}</span>
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
                  <span style={{fontSize:'0.72rem',color:'rgba(99,160,240,0.78)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d}</span>
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
          onClick={()=>{
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
              docs: newFiles.map(x=>x.name),
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
                      ? 'Quotation is pending Director approval.'
                      : req.status === 'Estimation Uploaded'
                        ? 'Estimation uploaded — awaiting Director review.'
                        : 'Request is in progress.'}
              </p>
              {canDownload && (
                <div className="dl-row">
                  <p className="dl-lbl">Click here to Download</p>
                  <button className="dl-btn">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="5" fill="#C0392B"/><text x="16" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Arial">PDF</text></svg>
                    <span style={{fontWeight:600}}>PDF</span>
                  </button>
                  <button className="dl-btn">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="5" fill="#1D6F42"/><text x="16" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial">XLS</text></svg>
                    <span style={{fontWeight:600}}>Excel</span>
                  </button>
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
const RelaxScreen = ({ onAnother, onHome }) => {
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
const SLA_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

const REQ_STATUS_STYLE = {
  'not-started':      {c:'rgba(120,140,200,0.5)',  bg:'rgba(50,65,110,0.06)',    bd:'rgba(70,90,150,0.15)',    label:'Not Started'},
  inprogress:         {c:'#ffd600',               bg:'rgba(255,210,0,0.08)',    bd:'rgba(255,210,0,0.35)',    label:'In Progress'},
  onhold:             {c:'#ff9020',               bg:'rgba(255,135,0,0.08)',    bd:'rgba(255,135,0,0.35)',    label:'On Hold'},
  overdue:            {c:'#d05200',               bg:'rgba(210,82,0,0.09)',     bd:'rgba(210,82,0,0.38)',     label:'Overdue'},
  risky:              {c:'#dd3535',               bg:'rgba(215,45,45,0.09)',    bd:'rgba(215,55,55,0.38)',    label:'Risky'},
  'pending-director': {c:'rgba(180,130,255,0.95)',bg:'rgba(140,80,255,0.10)',   bd:'rgba(180,130,255,0.30)', label:'Director Under Review'},
  completed:          {c:'#00cc77',               bg:'rgba(0,180,90,0.09)',     bd:'rgba(0,210,100,0.35)',   label:'Approved ✓'},
};

function getReqStatus(r, now) {
  if (!r.estimator) return 'not-started';
  if (r.reqStatus === 'completed' || r.reqStatus === 'onhold' || r.reqStatus === 'risky') return r.reqStatus;
  if (r.reqStatus === 'pending-director') return 'pending-director';
  if (r.taggedAt && (now - r.taggedAt) > SLA_MS) return 'overdue';
  return 'inprogress';
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  'Pending Estimation': 'rgba(220,165,0,0.85)',
  'Estimation Uploaded': 'rgba(99,102,241,0.9)',
  'Pending Approval': 'rgba(234,88,12,0.9)',
  'Approved': 'rgba(22,163,74,0.9)',
  'Completed': 'rgba(20,184,166,0.9)',
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
const DirectorReviewModal = ({req, idx, now, onUpdate, onClose}) => {
  const rs = getReqStatus(req, now);
  const rss = REQ_STATUS_STYLE[rs];
  const [revisedMargin, setRevisedMargin] = useState(req.revisedMargin||'');
  const [action, setAction] = useState(req.directorAction||null);
  const [note, setNote] = useState(req.directorNote||'');

  const slaElapsed = req.taggedAt ? now - req.taggedAt : 0;
  const slaHrs = (slaElapsed / 3600000).toFixed(1);
  const slaPct = Math.min(100, (slaElapsed / SLA_MS) * 100);
  const slaColor = slaPct >= 100 ? '#ff4d4d' : slaPct >= 75 ? '#ff7a30' : slaPct >= 50 ? '#ffb347' : '#00e5ff';
  const tagDate = req.taggedAt ? new Date(req.taggedAt).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';

  const ACTIONS = [
    {v:'approved', label:'Approve', c:'#00e5b0', bg:'rgba(0,229,176,0.10)', bd:'rgba(0,229,176,0.38)'},
    {v:'revised',  label:'Revise',  c:'rgba(120,180,255,0.95)', bg:'rgba(80,140,255,0.10)', bd:'rgba(120,180,255,0.40)'},
    {v:'rejected', label:'Reject',  c:'rgba(255,90,90,0.95)',   bg:'rgba(215,45,45,0.10)',  bd:'rgba(215,55,55,0.40)'},
  ];

  const submit = () => {
    if (!action) return;
    const newStatus = action === 'approved' ? 'Approved' : action === 'rejected' ? 'Estimation Uploaded' : 'Pending Approval';
    const newReqStatus = action === 'approved' ? 'completed' : action === 'rejected' ? 'onhold' : 'inprogress';
    onUpdate(idx, {revisedMargin, directorAction:action, directorNote:note, status:newStatus, reqStatus:newReqStatus});
    onClose();
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
            <div style={{fontSize:'0.66rem',color:'rgba(0,200,255,0.30)',marginTop:3,letterSpacing:'0.06em'}}>Director Review · Quotation Request</div>
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

          {/* ── Row 3: Estimator · Margin · SLA ── */}
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
            {/* SLA card */}
            <GC accent='rgba(255,255,255,0.03)' border='rgba(255,255,255,0.08)'>
              {lbl('SLA (2-day timer)')}
              <div style={{fontSize:'0.95rem',fontWeight:700,color:slaColor,fontFamily:'monospace',marginBottom:8}}>{slaHrs}h elapsed</div>
              <div style={{height:5,borderRadius:3,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:3,width:`${slaPct}%`,background:`linear-gradient(90deg,${slaColor}70,${slaColor})`,transition:'width 0.4s'}}/>
              </div>
              <div style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.22)',marginTop:5}}>{Math.round(slaPct)}% of SLA used</div>
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
            {/* Quotation files — only available after director approves */}
            <GC>
              {lbl('Quotation Files')}
              {(req.directorAction === 'approved' || req.reqStatus === 'completed') ? (
                <div style={{display:'flex',gap:8,marginTop:7}}>
                  <button onClick={()=>alert(`Download PDF: ${req.estimationFile||'quotation'}.pdf — integrate file hosting to serve real files.`)}
                    style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px 0',borderRadius:7,background:'rgba(255,80,60,0.10)',border:'1px solid rgba(255,80,60,0.32)',color:'rgba(255,120,100,0.95)',fontFamily:F,fontSize:'0.75rem',fontWeight:700,cursor:'pointer',outline:'none',transition:'background 0.15s',backdropFilter:'blur(6px)'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,80,60,0.20)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(255,80,60,0.10)'}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    ↓ PDF
                  </button>
                  <button onClick={()=>alert(`Download Excel: ${req.estimationFile||'quotation'}.xlsx — integrate file hosting to serve real files.`)}
                    style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px 0',borderRadius:7,background:'rgba(0,180,80,0.10)',border:'1px solid rgba(0,200,100,0.32)',color:'rgba(60,220,130,0.95)',fontFamily:F,fontSize:'0.75rem',fontWeight:700,cursor:'pointer',outline:'none',transition:'background 0.15s',backdropFilter:'blur(6px)'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(0,180,80,0.20)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(0,180,80,0.10)'}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    ↓ Excel
                  </button>
                </div>
              ) : (
                <div style={{marginTop:7,padding:'7px 10px',borderRadius:7,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:7}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,180,0,0.70)',flexShrink:0}}/>
                  <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.30)',fontStyle:'italic'}}>Available after Director approval</span>
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
              {lbl('Attached Documents')}
              <div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:7}}>
                {req.docs.map((d,i)=>(
                  <button key={i} onClick={()=>alert(`File "${d}" — integrate a file-hosting service to enable actual downloads.`)}
                    style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.72rem',color:'rgba(0,200,255,0.85)',background:'rgba(0,200,255,0.07)',border:'1px solid rgba(0,200,255,0.18)',borderRadius:6,padding:'4px 11px',cursor:'pointer',outline:'none',fontFamily:F,fontWeight:600,transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(0,200,255,0.15)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(0,200,255,0.07)'}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {d}
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
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add director remarks or revision notes…" rows={3}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:10,color:'rgba(255,255,255,0.80)',fontFamily:F,fontSize:'0.83rem',padding:'10px 14px',outline:'none',resize:'none',boxSizing:'border-box',backdropFilter:'blur(12px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)'}}
                onFocus={e=>e.target.style.borderColor='rgba(0,210,255,0.30)'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.10)'}/>
            </div>
          </div>

          {/* ── Director Decision ── */}
          <div>
            <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.40)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:10,fontWeight:600}}>Director Decision</div>
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

          {/* ── Footer buttons ── */}
          <div style={{display:'flex',gap:10,paddingTop:4}}>
            <button onClick={onClose}
              style={{flex:1,padding:'12px 0',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.38)',fontFamily:F,fontSize:'0.85rem',fontWeight:600,cursor:'pointer',outline:'none',backdropFilter:'blur(8px)',transition:'background 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}>Cancel</button>
            <button onClick={submit} disabled={!action}
              style={{flex:2,padding:'12px 0',borderRadius:10,background:action?'linear-gradient(105deg,#0f0c3a,#1e40af 35%,#6d28d9 65%,#00e5ff)':'rgba(255,255,255,0.04)',backgroundSize:'220% 220%',animation:action?'auroraShift 5s ease-in-out infinite':'none',border:action?'1px solid rgba(0,220,255,0.25)':'1px solid rgba(255,255,255,0.06)',color:action?'#fff':'rgba(255,255,255,0.22)',fontFamily:F,fontSize:'0.9rem',fontWeight:700,cursor:action?'pointer':'not-allowed',outline:'none',boxShadow:action?'0 0 24px rgba(0,180,255,0.18)':'none',transition:'box-shadow 0.3s'}}>
              Submit Decision
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ requests, onUpdate }) => {
  const [open, setOpen] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(null);
  const [dsearch, setDsearch] = useState('');
  const [, setTick] = useState(0);
  const [viewMode, setViewMode] = useState('requester'); // 'requester' | 'estimator' | 'director'
  const [requesterFilter, setRequesterFilter] = useState('');
  const [pinPrompt, setPinPrompt] = useState(null); // null | 'estimator' | 'director'
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);

  const PIN = { estimator: 'est', director: 'star' };
  const requestViewSwitch = (mode) => {
    if (mode === 'requester') { setViewMode('requester'); return; }
    setPinValue(''); setPinError(false); setPinPrompt(mode);
  };
  const confirmPin = () => {
    if (pinValue === PIN[pinPrompt]) { setViewMode(pinPrompt); setPinPrompt(null); }
    else { setPinError(true); setPinValue(''); }
  };
  const uploadRef = useRef();
  const now = Date.now();

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const req = open !== null ? requests[open] : null;

  const handleEstimatorUpload = e => {
    if (!e.target.files?.length) return;
    onUpdate(open, { estimationFile: e.target.files[0].name, status: 'Pending Approval' });
  };

  // ── Detail view ──
  if (open !== null && req) {
    const rs = getReqStatus(req, now);
    const rss = REQ_STATUS_STYLE[rs];


    const slaElapsed = req.taggedAt ? now - req.taggedAt : 0;
    const slaHrs = (slaElapsed / 3600000).toFixed(1);
    const slaPct = Math.min(100, (slaElapsed / SLA_MS) * 100);
    const slaBarColor = slaPct >= 100 ? '#ff4d4d' : slaPct >= 75 ? '#ff7a30' : slaPct >= 50 ? '#ffb347' : '#00e5ff';
    const tagDate = req.taggedAt ? new Date(req.taggedAt).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
    const canSendToDirector = req.estimationFile && req.margin && req.reqStatus !== 'pending-director' && req.reqStatus !== 'completed';
    const DL = (t) => <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:5,fontWeight:600}}>{t}</div>;
    const DV = (v,c='rgba(255,255,255,0.85)') => <div style={{fontSize:'0.82rem',fontWeight:600,color:c,lineHeight:1.4}}>{v||'—'}</div>;
    const GCard = ({children,accent='rgba(255,255,255,0.05)',border='rgba(255,255,255,0.09)',style:sx={}}) => (
      <div style={{background:accent,border:`1px solid ${border}`,borderRadius:10,padding:'12px 16px',backdropFilter:'blur(10px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)',...sx}}>{children}</div>
    );
    const F2 = "'Inter',sans-serif";

    const rankLabels = ['','Bronze','Silver','Gold','Platinum','Diamond'];
    const infoRows = [['ID',req.id],['Submitted By',req.submittedBy||'—'],['Project',req.proj||'—'],['Client / Grantor',req.client||'—'],['Customer Rank',req.customerRank>0?rankLabels[req.customerRank]+' ('+req.customerRank+'★)':'—'],['Main Contractor',req.mainContractor||'—'],['Consultant',req.consultant||'—'],['Deal Type',req.deal],['Email',req.email||'—'],['MOB',req.mob||'—'],['Tel',req.tel||'—'],['Lead Time',req.leadTime||'—'],['Address',req.address||'—'],['Remarks',req.remarks||'—'],['Submitted',req.date]];

    return (
      <div style={{position:'relative',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'70px 36px 20px',overflowY:viewMode==='director'?'hidden':'auto',animation:'fadeUp 0.4s ease both',background:'rgba(255,255,255,0.025)',backdropFilter:'blur(20px) saturate(1.4)',WebkitBackdropFilter:'blur(20px) saturate(1.4)',borderRadius:16,boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,0,0.40)'}}>
        {reviewIdx !== null && (
          <DirectorReviewModal req={requests[reviewIdx]} idx={reviewIdx} now={now} onUpdate={onUpdate} onClose={()=>setReviewIdx(null)}/>
        )}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:viewMode==='director'?8:16}}>
          <button onClick={()=>setOpen(null)} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'0.82rem',fontFamily:F2,alignSelf:'flex-start',display:'flex',alignItems:'center',gap:6}}>
            ← All Requests
          </button>
          {(req.requestType==='revised'||req.requestType==='finalPrice') && (
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 12px',borderRadius:50,
              background:req.requestType==='finalPrice'?'rgba(16,185,129,0.12)':'rgba(0,150,255,0.12)',
              border:req.requestType==='finalPrice'?'1px solid rgba(52,211,153,0.32)':'1px solid rgba(0,180,255,0.32)'}}>
              <span style={{width:6,height:6,borderRadius:'50%',
                background:req.requestType==='finalPrice'?'rgba(52,211,153,0.9)':'rgba(0,200,255,0.9)',
                boxShadow:req.requestType==='finalPrice'?'0 0 6px rgba(52,211,153,0.7)':'0 0 6px rgba(0,200,255,0.7)',flexShrink:0}}/>
              <span style={{fontSize:'0.60rem',fontWeight:700,letterSpacing:'0.12em',
                color:req.requestType==='finalPrice'?'rgba(52,211,153,0.95)':'rgba(0,200,255,0.90)',textTransform:'uppercase'}}>
                {req.requestType==='finalPrice'?'Final Price Request':'Revised Request'}
              </span>
              {req.originalId && <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.32)',letterSpacing:'0.06em'}}>ref: {req.originalId}</span>}
            </div>
          )}
        </div>

        {/* ── Status bar — TOP, always first ── */}
        <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${rss.bd}`,borderRadius:10,padding:viewMode==='director'?'9px 16px':'14px 20px',display:'flex',alignItems:'center',gap:14,marginBottom:viewMode==='director'?10:20,flexWrap:'wrap'}}>
          <span style={{width:11,height:11,borderRadius:'50%',background:rss.c,flexShrink:0,boxShadow:`0 0 10px ${rss.c}`}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'0.56rem',color:'rgba(255,255,255,0.30)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:3}}>Request Status</div>
            <div style={{fontSize:'1rem',fontWeight:700,color:rss.c}}>{rss.label}</div>
            {req.directorNote && <div style={{fontSize:'0.76rem',color:'rgba(255,140,100,0.85)',marginTop:3}}>{req.directorNote}</div>}
          </div>
          <div style={{display:'flex',gap:20,flexWrap:'wrap',alignItems:'center'}}>
            {req.customerRank > 0 && (() => {
              const rc = ['','rgba(205,127,50,0.95)','rgba(180,180,200,0.95)','rgba(255,200,0,0.95)','rgba(100,220,255,0.95)','rgba(200,130,255,0.95)'][req.customerRank];
              return (
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:2}}>Customer Rank</div>
                  <div style={{display:'flex',gap:2,justifyContent:'flex-end'}}>
                    {[1,2,3,4,5].map(n=>(
                      <span key={n} style={{fontSize:'0.78rem',color:req.customerRank>=n?rc:'rgba(255,255,255,0.12)',filter:req.customerRank>=n?`drop-shadow(0 0 4px ${rc})`:'none'}}>★</span>
                    ))}
                  </div>
                </div>
              );
            })()}
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:2}}>Request ID</div>
              <div style={{fontSize:'0.82rem',fontWeight:700,color:'rgba(220,165,0,0.90)',fontFamily:'monospace'}}>{req.id}</div>
            </div>
            {req.estimator && <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:2}}>Estimator</div>
              <div style={{fontSize:'0.82rem',fontWeight:600,color:'rgba(100,190,255,0.90)'}}>{req.estimator}</div>
            </div>}
            {req.margin && <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:2}}>Margin</div>
              <div style={{fontSize:'1rem',fontWeight:800,color:'rgba(0,210,255,0.95)',fontFamily:'monospace'}}>{req.margin}%</div>
            </div>}
            {req.directorAction && <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:2}}>Director</div>
              <div style={{fontSize:'0.82rem',fontWeight:700,color:req.directorAction==='approved'?'#00cc77':req.directorAction==='rejected'?'#dd3535':'rgba(120,180,255,0.90)'}}>{req.directorAction.charAt(0).toUpperCase()+req.directorAction.slice(1)}</div>
            </div>}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* REQUESTER & ESTIMATOR: 2-col layout                                   */}
        {/* DIRECTOR: full-width single layout                                     */}
        {/* ══════════════════════════════════════════════════════════════════════ */}

        {viewMode !== 'director' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,maxWidth:960,width:'100%'}}>
            {/* LEFT — request info */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'18px 20px'}}>
              <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:12}}>Request Info</p>
              {infoRows.map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'6px 0',gap:12}}>
                  <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.32)',flexShrink:0}}>{k}</span>
                  <span style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.78)',textAlign:'right'}}>{v}</span>
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
                        <button key={i} onClick={()=>alert(`File "${d}" — integrate a file-hosting service to enable actual downloads.`)}
                          style={{display:'flex',alignItems:'center',gap:7,padding:'5px 9px',borderRadius:6,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',outline:'none',fontFamily:F2,transition:'background 0.15s',width:'100%',textAlign:'left'}}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={dc} strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span style={{fontSize:'0.73rem',color:dc,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d}</span>
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
                      <button key={i} onClick={()=>alert(`File "${d}" — integrate a file-hosting service to enable actual downloads.`)}
                        style={{display:'flex',alignItems:'center',gap:7,padding:'5px 9px',borderRadius:6,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',cursor:'pointer',outline:'none',fontFamily:F2,transition:'background 0.15s',width:'100%',textAlign:'left',opacity:0.70}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(160,190,230,0.65)" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span style={{fontSize:'0.72rem',color:'rgba(160,190,230,0.75)',fontStyle:'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — view-specific panels */}
            <div style={{display:'flex',flexDirection:'column',gap:14}}>

              {/* ── REQUESTER right panel ── */}
              {viewMode === 'requester' && (<>
                {req.remarks && (
                  <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'14px 18px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:8}}>Your Remarks</p>
                    <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.65)',lineHeight:1.6}}>{req.remarks}</p>
                  </div>
                )}
                {req.directorNote && (
                  <div style={{background:'rgba(255,140,60,0.06)',border:'1px solid rgba(255,140,60,0.20)',borderRadius:10,padding:'14px 18px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,140,60,0.55)',marginBottom:8}}>Director Note</p>
                    <p style={{fontSize:'0.82rem',color:'rgba(255,160,90,0.85)',lineHeight:1.6}}>{req.directorNote}</p>
                  </div>
                )}
                {(req.status==='Approved'||req.status==='Completed') ? (
                  <div style={{background:'rgba(0,40,20,0.50)',border:'1px solid rgba(0,200,100,0.28)',borderRadius:10,padding:'20px 22px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,200,100,0.60)',marginBottom:12}}>Download Quotation</p>
                    <div style={{display:'flex',gap:10}}>
                      <button style={{...btnStyle,flex:1,color:'rgba(255,120,100,0.90)',border:'1px solid rgba(200,60,40,0.35)',background:'rgba(200,50,40,0.10)'}}>↓ PDF</button>
                      <button style={{...btnStyle,flex:1,color:'rgba(60,220,130,0.90)',border:'1px solid rgba(0,180,80,0.35)',background:'rgba(0,160,70,0.10)'}}>↓ Excel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'20px 22px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:10}}>Quotation</p>
                    <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.28)',lineHeight:1.6}}>Quotation will be available once the Director approves it.</p>
                  </div>
                )}
              </>)}

              {/* ── ESTIMATOR right panel ── */}
              {viewMode === 'estimator' && (<div style={{display:'flex',flexDirection:'column',gap:14,height:'100%'}}>

                {/* Request Status — top of right panel */}
                {(() => {
                  const rs = getReqStatus(req, now);
                  const rss = REQ_STATUS_STYLE[rs];
                  return (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'10px 16px'}}>
                      <span style={{fontSize:'0.56rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',fontWeight:600}}>Request Status</span>
                      <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:50,background:rss.bg,border:`1px solid ${rss.bd}`}}>
                        <span style={{width:6,height:6,borderRadius:'50%',background:rss.c,boxShadow:`0 0 5px ${rss.c}`,flexShrink:0}}/>
                        <span style={{fontSize:'0.68rem',color:rss.c,fontWeight:700,letterSpacing:'0.04em'}}>{rss.label}</span>
                      </span>
                    </div>
                  );
                })()}

                {/* Director's Remarks — decision status badge + remarks text */}
                {req.directorAction && (
                  (() => {
                    const isApproved = req.directorAction === 'approved' || req.reqStatus === 'completed';
                    const isRejected = req.directorAction === 'rejected';
                    const cfg = isApproved
                      ? {bg:'rgba(0,200,100,0.06)',bd:'rgba(0,200,100,0.22)',dot:'rgba(0,220,120,0.90)',statusLabel:'Approved',statusSub:'Submitted to Sales / Requester & Estimator'}
                      : isRejected
                      ? {bg:'rgba(220,60,60,0.06)',bd:'rgba(220,60,60,0.24)',dot:'rgba(255,90,90,0.95)',statusLabel:'Rejected',statusSub:'Please redo the estimation'}
                      : /* revised */ {bg:'rgba(255,160,40,0.06)',bd:'rgba(255,160,40,0.24)',dot:'rgba(255,180,60,0.95)',statusLabel:'Revision Required',statusSub:'Please revise and resubmit'};
                    return (
                      <div style={{background:cfg.bg,border:`1px solid ${cfg.bd}`,borderRadius:10,padding:'14px 16px',display:'flex',flexDirection:'column',gap:10}}>
                        {/* Label row */}
                        <span style={{fontSize:'0.56rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:600}}>Director's Remarks</span>
                        {/* Decision status — separate badge */}
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{width:7,height:7,borderRadius:'50%',background:cfg.dot,boxShadow:`0 0 6px ${cfg.dot}`,flexShrink:0}}/>
                          <span style={{fontSize:'0.78rem',fontWeight:700,color:cfg.dot}}>{cfg.statusLabel}</span>
                          <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.35)',marginLeft:2}}>— {cfg.statusSub}</span>
                        </div>
                        {/* Remarks text */}
                        {req.directorNote && (
                          <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.65)',lineHeight:1.55,margin:0,paddingLeft:15,borderLeft:`2px solid ${cfg.dot}40`}}>{req.directorNote}</p>
                        )}
                        {/* Revised margin if set */}
                        {req.revisedMargin && (
                          <p style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.40)',margin:0,paddingLeft:15}}>Suggested margin: <strong style={{color:'rgba(255,255,255,0.65)'}}>{req.revisedMargin}%</strong></p>
                        )}
                      </div>
                    );
                  })()
                )}

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
                          {isFinal?'Final Price Request':'Revised Request'}
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

                {/* Requester remarks — read-only reference */}
                {req.remarks && req.requestType !== 'revised' && req.requestType !== 'finalPrice' && (
                  <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'12px 16px'}}>
                    <p style={{fontSize:'0.56rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:6}}>Requester Remarks</p>
                    <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.60)',lineHeight:1.55,margin:0}}>{req.remarks}</p>
                  </div>
                )}

                {/* Assign Estimator */}
                <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'16px 18px'}}>
                  <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:10}}>Assign Estimator</p>
                  <input type="text" value={req.estimator||''} onChange={e=>{const est=e.target.value; onUpdate(open,{estimator:est||null,taggedAt:est&&!req.estimator?Date.now():req.taggedAt,reqStatus:est?'inprogress':'not-started'});}}
                    placeholder="Type estimator name…"
                    style={{width:'100%',background:'rgba(0,10,30,0.70)',border:'1px solid rgba(99,160,240,0.30)',borderRadius:7,color:req.estimator?'rgba(99,200,255,0.9)':'rgba(255,255,255,0.4)',fontFamily:F2,fontSize:'0.88rem',padding:'10px 12px',outline:'none',boxSizing:'border-box'}}
                    onFocus={e=>e.target.style.borderColor='rgba(99,160,240,0.60)'}
                    onBlur={e=>e.target.style.borderColor='rgba(99,160,240,0.30)'}/>
                </div>

                {/* Upload + Margin % + Project Value in one card */}
                <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'16px 18px',display:'flex',flexDirection:'column',gap:10}}>
                  <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:2}}>Quotation Details</p>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {/* Attached docs — each downloadable */}
                    {req.docs?.length > 0 ? (
                      <div style={{display:'flex',flexDirection:'column',gap:5}}>
                        <p style={{fontSize:'0.52rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:3}}>Attached Documents</p>
                        {req.docs.map((d,i)=>(
                          <button key={i} onClick={()=>alert(`File "${d}" is stored by name only — integrate a file-hosting service to enable actual downloads.`)}
                            style={{...btnStyle,textAlign:'left',justifyContent:'flex-start',gap:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            {d}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button style={{...btnStyle,opacity:0.45,cursor:'default'}}>↓ No Documents Attached</button>
                    )}
                    <input type="file" ref={uploadRef} style={{display:'none'}} onChange={handleEstimatorUpload}/>
                    <button onClick={()=>uploadRef.current.click()}
                      disabled={req.status!=='Pending Estimation'&&req.status!=='Estimation Uploaded'&&req.reqStatus!=='inprogress'}
                      style={{...btnStyle,opacity:1,cursor:'pointer'}}>
                      ↑ Upload Quotation {req.estimationFile?`(${req.estimationFile})`:''}
                    </button>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:4}}>
                    <div style={{background:'rgba(0,10,30,0.60)',border:'1px solid rgba(0,200,255,0.22)',borderRadius:8,padding:'10px 12px'}}>
                      <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,200,255,0.45)',marginBottom:6}}>Margin %</p>
                      <div style={{display:'flex',alignItems:'baseline',gap:4}}>
                        <input type="number" value={req.margin||''} onChange={e=>onUpdate(open,{margin:e.target.value})} placeholder="0.0" min="0" max="100" step="0.5"
                          style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,210,255,0.95)',fontFamily:'monospace',fontSize:'1.3rem',fontWeight:700,width:'100%'}}/>
                        <span style={{fontSize:'0.9rem',color:'rgba(0,200,255,0.50)',fontFamily:'monospace',fontWeight:700}}>%</span>
                      </div>
                    </div>
                    <div style={{background:'rgba(0,10,30,0.60)',border:'1px solid rgba(0,200,120,0.22)',borderRadius:8,padding:'10px 12px'}}>
                      <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,200,120,0.45)',marginBottom:6}}>Project Value (AED)</p>
                      <input type="number" value={req.projValue||''} onChange={e=>onUpdate(open,{projValue:e.target.value})} placeholder="0.00" min="0"
                        style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,230,140,0.90)',fontFamily:'monospace',fontSize:'1.1rem',fontWeight:700,width:'100%'}}/>
                    </div>
                  </div>
                </div>

                {/* Send to Director — always at bottom */}
                {req.reqStatus === 'pending-director' ? (
                  <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'rgba(140,80,255,0.08)',border:'1px solid rgba(180,130,255,0.25)',borderRadius:10,marginTop:'auto'}}>
                    <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(180,130,255,0.95)',boxShadow:'0 0 8px rgba(180,130,255,0.7)',flexShrink:0}}/>
                    <span style={{fontSize:'0.82rem',color:'rgba(180,130,255,0.90)',fontWeight:600}}>Submitted — Awaiting Director Review</span>
                  </div>
                ) : (
                  <button onClick={()=>{if(canSendToDirector)onUpdate(open,{status:'Pending Approval',reqStatus:'pending-director',directorAction:null,directorNote:''}); }}
                    disabled={!canSendToDirector}
                    style={{width:'100%',padding:'13px 0',borderRadius:100,background:canSendToDirector?'linear-gradient(105deg,#0f0c3a,#1e40af 30%,#6d28d9 55%,#a855f7 75%,#00e5ff 100%)':'rgba(255,255,255,0.04)',backgroundSize:'220% 220%',animation:canSendToDirector?'auroraShift 5s ease-in-out infinite':'none',border:canSendToDirector?'1px solid rgba(0,220,255,0.25)':'1px solid rgba(255,255,255,0.07)',color:canSendToDirector?'#fff':'rgba(255,255,255,0.22)',fontFamily:F2,fontSize:'0.92rem',fontWeight:700,cursor:canSendToDirector?'pointer':'not-allowed',letterSpacing:'0.06em',boxShadow:canSendToDirector?'0 6px 28px rgba(0,140,255,0.28)':'none',outline:'none',marginTop:'auto'}}>
                    ✦ Send to Director for Approval
                  </button>
                )}
              </div>)}
            </div>
          </div>
        )}

        {/* ── DIRECTOR view: single-page, no scroll ── */}
        {viewMode === 'director' && (() => {
          const GLASSY = 'linear-gradient(135deg,rgba(255,255,255,1) 0%,rgba(255,255,255,0.88) 40%,rgba(255,255,255,0.72) 60%,rgba(255,255,255,0.96) 100%)';
          const GLASSY_LBL = 'linear-gradient(135deg,rgba(255,255,255,0.78) 0%,rgba(255,255,255,0.52) 60%,rgba(255,255,255,0.72) 100%)';
          const lbl = t => (
            <span style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase',display:'block',marginBottom:5,background:GLASSY_LBL,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 1px 4px rgba(255,255,255,0.10))'}}>
              {t}
            </span>
          );
          const DA = [{v:'approved',label:'Approve ✓',c:'#00e5b0',bg:'rgba(0,229,176,0.10)',bd:'rgba(0,229,176,0.38)'},{v:'revised',label:'Revise',c:'rgba(120,180,255,0.95)',bg:'rgba(80,140,255,0.10)',bd:'rgba(120,180,255,0.40)'},{v:'rejected',label:'Reject ✗',c:'rgba(255,90,90,0.95)',bg:'rgba(215,45,45,0.10)',bd:'rgba(215,55,55,0.40)'}];
          return (
            <div style={{display:'flex',flexDirection:'column',gap:10,width:'100%',flex:1,minHeight:0}}>

              {/* ── PROJECT BRIEF — single unified glassy card, read-only ── */}
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:14,padding:'20px 24px',backdropFilter:'blur(20px) saturate(1.5)',WebkitBackdropFilter:'blur(20px) saturate(1.5)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.30)',flexShrink:0}}>

                {/* ── Customer Ranking strip — top ── */}
                {req.customerRank > 0 && (() => {
                  const rankLabel = ['','Bronze','Silver','Gold','Platinum','Diamond'][req.customerRank];
                  const rankColor = ['','rgba(205,127,50,0.95)','rgba(180,180,200,0.95)','rgba(255,200,0,0.95)','rgba(100,220,255,0.95)','rgba(200,130,255,0.95)'][req.customerRank];
                  return (
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,paddingBottom:12,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <span style={{fontSize:'0.52rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:600,flexShrink:0}}>Customer Ranking</span>
                      <div style={{display:'flex',gap:3}}>
                        {[1,2,3,4,5].map(n=>(
                          <span key={n} style={{fontSize:'1rem',color:req.customerRank>=n?rankColor:'rgba(255,255,255,0.12)',filter:req.customerRank>=n?`drop-shadow(0 0 6px ${rankColor})`:'none'}}>★</span>
                        ))}
                      </div>
                      <span style={{fontSize:'0.72rem',fontWeight:700,color:rankColor,letterSpacing:'0.06em',background:`${rankColor.replace('0.95','0.10')}`,border:`1px solid ${rankColor.replace('0.95','0.35')}`,borderRadius:20,padding:'2px 10px'}}>{rankLabel}</span>
                    </div>
                  );
                })()}

                {/* ── Project name — large header ── */}
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:4,height:44,borderRadius:2,background:'linear-gradient(180deg,rgba(255,255,255,0.70),rgba(255,255,255,0.08))',flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:'0.52rem',color:'rgba(255,255,255,0.30)',letterSpacing:'0.16em',textTransform:'uppercase',fontWeight:600,marginBottom:4}}>Project Brief</div>
                      <div style={{fontSize:'1.55rem',fontWeight:900,background:GLASSY,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 2px 12px rgba(255,255,255,0.22))',lineHeight:1.15,letterSpacing:'-0.01em'}}>{req.proj||'—'}</div>
                    </div>
                  </div>
                  {/* Deal type + category badges */}
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',paddingTop:4}}>
                    <span style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(255,255,255,0.82)',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.20)',borderRadius:20,padding:'4px 13px'}}>{req.deal}</span>
                    {req.supplyOnly && <span style={{fontSize:'0.72rem',fontWeight:600,color:'rgba(0,200,255,0.85)',background:'rgba(0,200,255,0.08)',border:'1px solid rgba(0,200,255,0.22)',borderRadius:20,padding:'4px 13px'}}>Supply Only</span>}
                    {req.supplyInstall && <span style={{fontSize:'0.72rem',fontWeight:600,color:'rgba(160,100,255,0.85)',background:'rgba(140,80,255,0.08)',border:'1px solid rgba(160,100,255,0.22)',borderRadius:20,padding:'4px 13px'}}>Supply & Install</span>}
                  </div>
                </div>

                {/* ── Info grid — 3 columns with styled boxes ── */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
                  {[
                    ['Client / Grantor',  req.client],
                    ['Main Contractor',   req.mainContractor],
                    ['Consultant',        req.consultant],
                    ['Submitted By',      req.submittedBy],
                    ['Lead Time',         req.leadTime],
                    ['Address',           req.address],
                  ].map(([k,v])=> v ? (
                    <div key={k} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:9,padding:'10px 13px'}}>
                      <div style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:5}}>{k}</div>
                      <div style={{fontSize:'0.95rem',fontWeight:700,background:GLASSY,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 1px 5px rgba(180,220,255,0.18))',lineHeight:1.3}}>{v}</div>
                    </div>
                  ) : null)}
                </div>

                {/* ── Contact strip ── */}
                {(req.email||req.mob||req.tel) && (
                  <div style={{display:'flex',gap:20,flexWrap:'wrap',marginBottom:14,paddingBottom:12,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    {req.email && <div><div style={{fontSize:'0.48rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,marginBottom:3}}>Email</div><div style={{fontSize:'0.85rem',fontWeight:600,color:'rgba(255,255,255,0.70)'}}>{req.email}</div></div>}
                    {req.mob   && <div><div style={{fontSize:'0.48rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,marginBottom:3}}>MOB</div><div style={{fontSize:'0.85rem',fontWeight:600,color:'rgba(255,255,255,0.70)'}}>{req.mob}</div></div>}
                    {req.tel   && <div><div style={{fontSize:'0.48rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,marginBottom:3}}>Tel</div><div style={{fontSize:'0.85rem',fontWeight:600,color:'rgba(255,255,255,0.70)'}}>{req.tel}</div></div>}
                  </div>
                )}

                {/* ── Estimator · Margin · SLA · Value — stat row with big numbers ── */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,marginBottom:14,paddingBottom:12,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <div style={{background:'rgba(100,160,255,0.05)',border:'1px solid rgba(100,160,255,0.14)',borderRadius:9,padding:'10px 13px'}}>
                    <div style={{fontSize:'0.48rem',color:'rgba(100,160,255,0.50)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:5}}>Estimator</div>
                    <div style={{fontSize:'0.96rem',fontWeight:800,background:GLASSY,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1.2}}>{req.estimator||'—'}</div>
                    {req.taggedAt && <div style={{fontSize:'0.52rem',color:'rgba(255,255,255,0.20)',marginTop:3}}>{tagDate}</div>}
                  </div>
                  <div style={{background:'rgba(0,200,255,0.05)',border:'1px solid rgba(0,200,255,0.16)',borderRadius:9,padding:'10px 13px'}}>
                    <div style={{fontSize:'0.48rem',color:'rgba(0,200,255,0.50)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:5}}>Margin</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:3}}>
                      <span style={{fontSize:'1.6rem',fontWeight:900,fontFamily:'monospace',background:'linear-gradient(135deg,rgba(0,230,255,1) 0%,rgba(100,180,255,0.85) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 2px 8px rgba(0,200,255,0.30))',lineHeight:1}}>{req.margin||'—'}</span>
                      {req.margin && <span style={{fontSize:'0.95rem',color:'rgba(0,200,255,0.50)',fontFamily:'monospace',fontWeight:700}}>%</span>}
                    </div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:9,padding:'10px 13px'}}>
                    <div style={{fontSize:'0.48rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:5}}>SLA (2-day)</div>
                    <div style={{fontSize:'1.1rem',fontWeight:800,color:slaBarColor,fontFamily:'monospace',filter:`drop-shadow(0 1px 6px ${slaBarColor}60)`,marginBottom:6,lineHeight:1}}>{slaHrs}h</div>
                    <div style={{height:4,borderRadius:2,background:'rgba(255,255,255,0.07)',overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:2,width:`${slaPct}%`,background:`linear-gradient(90deg,${slaBarColor}50,${slaBarColor})`}}/>
                    </div>
                  </div>
                  <div style={{background:'rgba(0,220,130,0.05)',border:'1px solid rgba(0,220,130,0.16)',borderRadius:9,padding:'10px 13px'}}>
                    <div style={{fontSize:'0.48rem',color:'rgba(0,220,130,0.50)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:5}}>Project Value (AED)</div>
                    <div style={{fontSize:'1.05rem',fontWeight:900,fontFamily:'monospace',background:'linear-gradient(135deg,rgba(0,240,160,1) 0%,rgba(0,200,255,0.80) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 1px 7px rgba(0,220,140,0.28))',lineHeight:1.2}}>{req.projValue?Number(req.projValue).toLocaleString('en-AE'):'—'}</div>
                  </div>
                </div>

                {/* ── Remarks — narrative block ── */}
                {req.remarks && (
                  <div style={{marginBottom:14,paddingBottom:12,borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:9,padding:'12px 15px'}}>
                    <div style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:7}}>Remarks</div>
                    <div style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.65)',lineHeight:1.7,borderLeft:'2px solid rgba(255,255,255,0.12)',paddingLeft:12}}>{req.remarks}</div>
                  </div>
                )}

                {/* ── Attached docs ── */}
                {req.docs?.length > 0 && (
                  <div style={{marginBottom:14,paddingBottom:12,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <div style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,marginBottom:8}}>Attached Documents</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                      {req.docs.map((d,i)=>(
                        <button key={i} onClick={()=>alert(`File "${d}" — integrate a file-hosting service to enable actual downloads.`)}
                          style={{display:'flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:7,background:'rgba(0,200,255,0.07)',border:'1px solid rgba(0,200,255,0.20)',color:'rgba(0,200,255,0.85)',fontFamily:F2,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s'}}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(0,200,255,0.14)'}
                          onMouseLeave={e=>e.currentTarget.style.background='rgba(0,200,255,0.07)'}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Quotation files ── */}
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:14,paddingBottom:14,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <span style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:700,flexShrink:0}}>Quotation Files</span>
                  <button style={{display:'flex',alignItems:'center',gap:6,padding:'6px 16px',borderRadius:7,background:'rgba(255,80,60,0.09)',border:'1px solid rgba(255,80,60,0.26)',color:'rgba(255,130,110,0.92)',fontFamily:F2,fontSize:'0.76rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,80,60,0.18)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(255,80,60,0.09)'}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>↓ PDF
                  </button>
                  <button style={{display:'flex',alignItems:'center',gap:6,padding:'6px 16px',borderRadius:7,background:'rgba(0,180,80,0.09)',border:'1px solid rgba(0,210,100,0.26)',color:'rgba(60,225,135,0.92)',fontFamily:F2,fontSize:'0.76rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(0,180,80,0.18)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(0,180,80,0.09)'}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>↓ Excel
                  </button>
                  {req.estimationFile && <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.26)'}}>{req.estimationFile}</span>}
                </div>

                {/* ── DIRECTOR DECISION — inside the card ── */}
                <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:14}}>
                  <div style={{display:'grid',gridTemplateColumns:'160px 1fr auto',gap:14,alignItems:'start',marginBottom:12}}>

                    {/* Revised Margin */}
                    <div>
                      {lbl('Revised Margin %')}
                      <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:8,padding:'7px 11px',backdropFilter:'blur(8px)'}}>
                        <input type="number" value={req.revisedMargin||''} onChange={e=>onUpdate(open,{revisedMargin:e.target.value})} placeholder="0.0" min="0" max="100" step="0.5"
                          style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:'monospace',fontSize:'1.2rem',fontWeight:700,width:'100%',color:'rgba(255,255,255,0.95)'}}/>
                        <span style={{fontSize:'0.95rem',color:'rgba(255,255,255,0.38)',fontFamily:'monospace',fontWeight:700}}>%</span>
                      </div>
                    </div>

                    {/* Director Remarks textarea */}
                    <div>
                      {lbl('Director Remarks')}
                      <textarea value={req.directorNote||''} onChange={e=>onUpdate(open,{directorNote:e.target.value})} placeholder="Add remarks or revision notes…" rows={2}
                        style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:8,color:'rgba(255,255,255,0.80)',fontFamily:F2,fontSize:'0.82rem',padding:'8px 11px',outline:'none',resize:'none',boxSizing:'border-box',backdropFilter:'blur(8px)'}}
                        onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.30)'}
                        onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.10)'}/>
                    </div>

                    {/* Decision buttons */}
                    <div style={{display:'flex',flexDirection:'column',gap:8,paddingTop:2}}>
                      {lbl('Decision')}
                      <div style={{display:'flex',gap:7}}>
                        {DA.map(a=>(
                          <button key={a.v} onClick={()=>{
                            const ns = a.v==='approved'?'Approved':'Pending Estimation';
                            const nr = a.v==='approved'?'completed':'inprogress';
                            onUpdate(open,{directorAction:a.v,status:ns,reqStatus:nr});
                          }}
                            style={{padding:'9px 15px',borderRadius:8,cursor:'pointer',outline:'none',fontFamily:F2,fontSize:'0.82rem',fontWeight:req.directorAction===a.v?700:500,background:req.directorAction===a.v?a.bg:'rgba(255,255,255,0.04)',border:req.directorAction===a.v?`1.5px solid ${a.bd}`:'1px solid rgba(255,255,255,0.09)',color:req.directorAction===a.v?a.c:'rgba(255,255,255,0.38)',transition:'all 0.15s',whiteSpace:'nowrap',boxShadow:req.directorAction===a.v?`0 0 16px ${a.c}22`:'none',backdropFilter:'blur(6px)'}}
                            onMouseEnter={e=>{if(req.directorAction!==a.v)e.currentTarget.style.background='rgba(255,255,255,0.08)';}}
                            onMouseLeave={e=>{if(req.directorAction!==a.v)e.currentTarget.style.background='rgba(255,255,255,0.04)';}}>
                            {req.directorAction===a.v&&<span style={{width:6,height:6,borderRadius:'50%',background:a.c,display:'inline-block',marginRight:6,boxShadow:`0 0 7px ${a.c}`}}/>}
                            {a.label}
                          </button>
                        ))}
                      </div>
                      {req.directorAction && (
                        <button onClick={()=>onUpdate(open,{directorAction:null,directorNote:'',revisedMargin:'',status:'Pending Estimation',reqStatus:'inprogress'})}
                          style={{background:'transparent',border:'none',color:'rgba(255,80,80,0.48)',fontFamily:F2,fontSize:'0.68rem',cursor:'pointer',outline:'none',textAlign:'left',padding:0}}>
                          ↺ Reset decision
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submit button / Thank you state */}
                  {req.directorSubmitted ? (
                    <div style={{textAlign:'center',padding:'14px 0',borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.10)'}}>
                      <span style={{fontSize:'1.1rem',fontWeight:700,background:GLASSY,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 1px 8px rgba(255,255,255,0.25))'}}>Thank you.</span>
                      <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.30)',marginTop:4,letterSpacing:'0.06em'}}>Decision submitted to estimator.</div>
                      <button onClick={()=>onUpdate(open,{directorSubmitted:false,directorAction:null,directorNote:'',revisedMargin:''})}
                        style={{marginTop:10,background:'transparent',border:'none',color:'rgba(255,255,255,0.28)',fontFamily:F2,fontSize:'0.68rem',cursor:'pointer',outline:'none',letterSpacing:'0.04em'}}>
                        ↺ Revise decision
                      </button>
                    </div>
                  ) : (
                    <button onClick={()=>{if(req.directorAction){const ns=req.directorAction==='approved'?'Approved':'Pending Estimation';const nr=req.directorAction==='approved'?'completed':'inprogress';onUpdate(open,{status:ns,reqStatus:nr,directorSubmitted:true});}}}
                      disabled={!req.directorAction}
                      style={{width:'100%',padding:'12px 0',borderRadius:100,background:req.directorAction?'linear-gradient(105deg,#0f0c3a,#1e40af 30%,#6d28d9 55%,#a855f7 75%,#00e5ff 100%)':'rgba(255,255,255,0.04)',backgroundSize:'220% 220%',animation:req.directorAction?'auroraShift 5s ease-in-out infinite':'none',border:req.directorAction?'1px solid rgba(255,255,255,0.20)':'1px solid rgba(255,255,255,0.07)',color:req.directorAction?'#fff':'rgba(255,255,255,0.22)',fontFamily:F2,fontSize:'0.92rem',fontWeight:700,cursor:req.directorAction?'pointer':'not-allowed',letterSpacing:'0.06em',boxShadow:req.directorAction?'0 6px 28px rgba(120,60,255,0.28)':'none',outline:'none',transition:'box-shadow 0.3s'}}>
                      Submit Decision
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })()}
      </div>
    );
  }

  // ── List view ──
  const lo = dsearch.toLowerCase();
  const filtered = requests.filter(r => {
    if (lo && !r.id.toLowerCase().includes(lo) && !(r.client||'').toLowerCase().includes(lo) && !(r.proj||'').toLowerCase().includes(lo)) return false;
    if (viewMode === 'requester' && requesterFilter && r.submittedBy !== requesterFilter) return false;
    return true;
  });


  // Unified column layout — same for all views
  const COL = '100px 120px 1fr 120px 120px 120px 120px 120px 100px 110px';

  const VIEW_LABELS = {requester:'Requester', estimator:'Estimator', director:'Director'};
  const VIEW_COLORS = {
    requester:{act:'rgba(100,200,255,0.90)', bg:'rgba(0,180,255,0.12)', bd:'rgba(0,200,255,0.30)'},
    estimator:{act:'rgba(160,255,180,0.90)', bg:'rgba(0,200,100,0.12)', bd:'rgba(0,220,130,0.30)'},
    director: {act:'rgba(200,150,255,0.90)', bg:'rgba(140,80,255,0.12)', bd:'rgba(180,100,255,0.30)'},
  };

  const F = "'Inter',sans-serif";

  return (
    <div style={{position:'relative',width:'100%',height:'100%',padding:'70px 40px 30px',overflowY:'auto',animation:'fadeUp 0.4s ease both'}}>

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

      {/* ── Header ── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,gap:12,flexWrap:'wrap'}}>
        <h2 style={{fontSize:'1.3rem',fontWeight:700,letterSpacing:'0.1em',color:'rgba(255,255,255,0.85)',textTransform:'uppercase',margin:0,flexShrink:0}}>Estimation Dashboard</h2>

        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',flex:1,justifyContent:'flex-end'}}>
          {/* View mode toggle */}
          <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:8,padding:3,gap:2,flexShrink:0}}>
            {(['requester','estimator','director']).map(vm=>{
              const vc = VIEW_COLORS[vm];
              const active = viewMode === vm;
              return (
                <button key={vm} onClick={()=>requestViewSwitch(vm)}
                  style={{padding:'6px 14px',borderRadius:6,border:active?`1px solid ${vc.bd}`:'1px solid transparent',background:active?vc.bg:'transparent',color:active?vc.act:'rgba(255,255,255,0.35)',fontFamily:F,fontSize:'0.75rem',fontWeight:active?700:500,cursor:'pointer',outline:'none',transition:'all 0.15s',letterSpacing:'0.04em',whiteSpace:'nowrap'}}>
                  {VIEW_LABELS[vm]}
                  {vm!=='requester' && <span style={{fontSize:'0.55rem',opacity:0.55,marginLeft:5}}>🔒</span>}
                </button>
              );
            })}
          </div>

          {/* Requester name filter (only in requester mode) */}
          {viewMode === 'requester' && (
            <select value={requesterFilter} onChange={e=>setRequesterFilter(e.target.value)}
              style={{background:'rgba(0,10,30,0.70)',border:'1px solid rgba(0,200,255,0.22)',borderRadius:8,color:requesterFilter?'rgba(100,200,255,0.90)':'rgba(255,255,255,0.35)',fontFamily:F,fontSize:'0.8rem',padding:'8px 12px',outline:'none',cursor:'pointer',flexShrink:0}}>
              <option value="">All Requesters</option>
              {REQUESTERS_LIST.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          )}

          {/* Search */}
          <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:6,overflow:'hidden',width:'min(260px,100%)'}}>
            <span style={{padding:'0 10px',display:'flex',alignItems:'center',opacity:0.30,flexShrink:0}}><Search size={13} color="#fff"/></span>
            <input value={dsearch} onChange={e=>setDsearch(e.target.value)} placeholder="Search…"
              style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.75)',fontFamily:F,fontSize:'0.82rem',padding:'10px 0'}}/>
            {dsearch && <button onClick={()=>setDsearch('')} style={{background:'transparent',border:'none',cursor:'pointer',padding:'0 10px',display:'flex',alignItems:'center',opacity:0.4}}><X size={12} color="#fff"/></button>}
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.95rem'}}>No requests submitted yet.</p>
      ) : filtered.length === 0 ? (
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.95rem'}}>No results match your filter.</p>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:6,overflowX:'auto'}}>
          {/* ── Column headers ── */}
          <div style={{display:'grid',gridTemplateColumns:COL,gap:10,padding:'6px 16px',fontSize:'0.56rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.24)',minWidth:'fit-content'}}>
            <span>Req #</span>
            <span>Status</span>
            <span>Project</span>
            <span>Main Contractor</span>
            <span>Consultant</span>
            <span>Client</span>
            <span>Requested By</span>
            <span>Estimator</span>
            <span>Deliver Time</span>
            <span style={{textAlign:'right'}}>Value (AED)</span>
          </div>

          {/* ── Rows ── */}
          {filtered.map(r => {
            const realIdx = requests.indexOf(r);
            return (
              <div key={r.id} style={{display:'grid',gridTemplateColumns:COL,gap:10,alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:'11px 16px',transition:'background 0.2s',cursor:'pointer',minWidth:'fit-content'}}
                onClick={()=>setOpen(realIdx)}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}>

                {/* Req # */}
                <span style={{fontSize:'0.72rem',color:'rgba(100,180,255,0.85)',fontWeight:600,fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.id||'—'}</span>

                {/* Status */}
                <div style={{display:'flex',flexDirection:'column',gap:3}}>
                  <Badge s={r.status}/>
                  {r.requestType==='revised' && (
                    <span style={{fontSize:'0.55rem',color:'rgba(0,200,255,0.70)',fontWeight:600,letterSpacing:'0.06em'}}>REVISED</span>
                  )}
                  {r.requestType==='finalPrice' && (
                    <span style={{fontSize:'0.55rem',color:'rgba(52,211,153,0.80)',fontWeight:600,letterSpacing:'0.06em'}}>FINAL</span>
                  )}
                </div>

                {/* Project */}
                <span style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.75)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</span>

                {/* Main Contractor */}
                <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.50)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.mainContractor||'—'}</span>

                {/* Consultant */}
                <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.50)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.consultant||'—'}</span>

                {/* Client */}
                <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.65)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.client||'—'}</span>

                {/* Requested By */}
                <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.55)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.submittedBy||'—'}</span>

                {/* Estimator */}
                <span style={{fontSize:'0.72rem',color:r.estimator?'rgba(100,180,255,0.85)':'rgba(255,255,255,0.22)',fontStyle:r.estimator?'normal':'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.estimator||'Unassigned'}</span>

                {/* Deliver Time */}
                <span style={{fontSize:'0.72rem',color:r.leadTime?'rgba(255,255,255,0.60)':'rgba(255,255,255,0.22)',whiteSpace:'nowrap'}}>{r.leadTime||'—'}</span>

                {/* Value (AED) */}
                <span style={{fontSize:'0.72rem',color:r.projValue?'rgba(255,230,100,0.85)':'rgba(255,255,255,0.2)',fontWeight:r.projValue?600:400,textAlign:'right',whiteSpace:'nowrap',fontFamily:'monospace'}}>
                  {r.projValue ? Number(r.projValue).toLocaleString('en-AE') : '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}
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
  const total       = requests.length;
  const pending     = requests.filter(r => r.reqStatus === 'not-started' || r.reqStatus === 'inprogress').length;
  const awaitDir    = requests.filter(r => r.reqStatus === 'pending-director').length;
  const approved    = requests.filter(r => r.directorAction === 'approved').length;
  const rejected    = requests.filter(r => r.directorAction === 'rejected').length;
  const revised     = requests.filter(r => r.requestType === 'revised').length;
  const finalPrice  = requests.filter(r => r.requestType === 'finalPrice').length;
  const withValue   = requests.filter(r => r.projValue && Number(r.projValue) > 0);
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
    <div style={{position:'relative',width:'100%',height:'100%',padding:'80px 40px 40px',overflowY:'auto',fontFamily:F,animation:'fadeUp 0.4s ease both'}}>
      <div style={{marginBottom:28}}>
        <p style={{fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(160,130,255,0.65)',marginBottom:6,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <h2 style={{fontSize:'1.5rem',fontWeight:800,color:'rgba(255,255,255,0.88)',margin:0}}>Analyse</h2>
        <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.35)',marginTop:4}}>Overview of all quotation requests and performance metrics.</p>
      </div>

      {/* ── KPI row ── */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:28}}>
        <StatCard label="Total Requests"    value={total}           accent='rgba(255,255,255,0.85)' bg='rgba(255,255,255,0.04)' bd='rgba(255,255,255,0.10)'/>
        <StatCard label="Pending / In Prog" value={pending}         accent='rgba(255,190,60,0.90)'  bg='rgba(255,160,30,0.07)'  bd='rgba(255,180,50,0.20)'/>
        <StatCard label="Awaiting Director" value={awaitDir}        accent='rgba(160,130,255,0.90)' bg='rgba(140,80,255,0.07)'  bd='rgba(160,120,255,0.20)'/>
        <StatCard label="Approved"          value={approved}        accent='rgba(52,211,153,0.90)'  bg='rgba(16,185,129,0.07)'  bd='rgba(52,211,153,0.22)'/>
        <StatCard label="Rejected"          value={rejected}        accent='rgba(255,90,90,0.90)'   bg='rgba(200,50,50,0.07)'   bd='rgba(220,70,70,0.22)'/>
        <StatCard label="Total Value (AED)" value={`${fmt(totalValue)}`} sub={`avg ${fmt(avgValue)} / req`} accent='rgba(255,220,80,0.90)' bg='rgba(180,140,0,0.07)' bd='rgba(220,180,0,0.22)'/>
        <StatCard label="Avg Margin"        value={`${avgMargin.toFixed(1)}%`} sub={`across ${withMargin.length} priced requests`} accent='rgba(0,200,255,0.85)' bg='rgba(0,150,255,0.07)' bd='rgba(0,180,255,0.20)'/>
      </div>

      {/* ── Two-column breakdown ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:28}}>

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
              {r.requestType==='revised'    && <span style={{fontSize:'0.58rem',color:'rgba(0,200,255,0.70)',fontWeight:700,flexShrink:0}}>REVISED</span>}
              {r.requestType==='finalPrice' && <span style={{fontSize:'0.58rem',color:'rgba(52,211,153,0.80)',fontWeight:700,flexShrink:0}}>FINAL</span>}
              <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AIEstimation({ onBack, onNavigate }) {
  const [view,setView] = useState('landing');
  const [aiOpen, setAiOpen] = useState(false);
  const [q,setQ] = useState('');
  const [id,setId] = useState('');
  const [requests,setRequests] = useState([]);
  const BIN_ID = "69dcdffeaaba882197f3c176";
  const API_KEY = "$2a$10$kpIFmWCwfUxqOw.M.TfqcOyhGnnArBzDluhGquW2s/t.L3vQJtBqW";

  // Load on startup
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: { 'X-Master-Key': API_KEY }
        });
        const data = await res.json();
        setRequests(data.record.requests || []);
      } catch(err) { console.error('Load failed:', err); }
    };
    load();
  }, []);

  // Save whenever requests change
  useEffect(() => {
    if (requests.length === 0) return;
    const save = async () => {
      try {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          },
          body: JSON.stringify({ requests })
        });
        console.log('✅ Saved to cloud!');
      } catch(err) { console.error('Save failed:', err); }
    };
    save();
  }, [requests]);

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
    const match = requests.find(r =>
      r.id === t ||
      r.id.replace('AX','') === t ||
      (r.client||'').toLowerCase().includes(lo) ||
      (r.customer||'').toLowerCase().includes(lo) ||
      (r.proj||'').toLowerCase().includes(lo)
    );
    goLoad(match ? match.id : t, match);
  };

const handleSubmit = async (formData) => {
  const count = requests.length + 1;
  const newId = 'AX' + String(count).padStart(4, '0');
  const entry = {
    id: newId,
    ...formData,
    status: 'Pending Estimation',
    date: new Date().toLocaleDateString('en-GB'),
    estimationFile: null,
    estimator: null,
    margin: '',
    taggedAt: null,
    reqStatus: 'not-started',
    directorAction: null,
    directorNote: '',
  };

  try {
    const digestRes = await fetch(
      "https://naffcogroup.sharepoint.com/sites/AI-APEX/_api/contextinfo",
      {
        method: "POST",
        headers: { "Accept": "application/json;odata=nometadata" },
        credentials: "include",
        mode: "cors"
      }
    );
    const digestData = await digestRes.json();
    const digest = digestData.FormDigestValue;

    await fetch(
      "https://naffcogroup.sharepoint.com/sites/AI-APEX/_api/web/lists/getbytitle('Estimation Requests')/items",
      {
        method: "POST",
        headers: {
          "Accept": "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
          "X-RequestDigest": digest
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          Title: formData.submittedBy || "",
          Project: formData.proj || "",
          Main_x0020_Contractor: formData.mainContractor || "",
          Consultant: formData.consultant || "",
          Client_x002f_Grantor: formData.client || "",
          Email: formData.email || "",
          Mobile: formData.mob || "",
          Telephone: formData.tel || "",
          Request_x0020_Type: formData.deal || "",
          Supply_x0020_Type: formData.supplyOnly ? "Supply Only" : formData.supplyInstall ? "Supply and Install" : "",
          Deliver_x0020_Lead_x0020_Time: formData.leadTime || "",
          Address: formData.address || "",
          Remarks: formData.remarks || "",
          Status: "Pending Estimation",
          Request_x0020_ID: newId
        })
      }
    );
    console.log("✅ Saved to SharePoint!");
  } catch(err) {
    console.error("❌ SharePoint save failed:", err);
  }

  setRequests(prev => [entry, ...prev]);
  setView('relax');
};

  const handleFinalPriceSubmit = (formData) => {
    const count = requests.length + 1;
    const newId = 'AX' + String(count).padStart(4, '0');
    const entry = {
      id: newId,
      ...formData,
      status: 'Pending Estimation',
      date: new Date().toLocaleDateString('en-GB'),
      estimationFile: null,
      estimator: null,
      margin: '',
      taggedAt: null,
      reqStatus: 'not-started',
      directorAction: null,
      directorNote: '',
    };
    setRequests(prev => [entry, ...prev]);
    setFinalPriceSource(null);
    setView('relax');
  };

  const handleRevisedSubmit = (formData) => {
    const count = requests.length + 1;
    const newId = 'AX' + String(count).padStart(4, '0');
    const entry = {
      id: newId,
      ...formData,
      status: 'Pending Estimation',
      date: new Date().toLocaleDateString('en-GB'),
      estimationFile: null,
      estimator: null,
      margin: '',
      taggedAt: null,
      reqStatus: 'not-started',
      directorAction: null,
      directorNote: '',
    };
    setRequests(prev => [entry, ...prev]);
    setRevisedSource(null);
    setView('relax');
  };

  const updateRequest = (idx, patch) => {
    setRequests(prev => prev.map((r,i) => i===idx ? {...r,...patch} : r));
  };

  return (
    <div className="root">
      <style>{S}</style>
      <div className="veil"/>
      {/* NN logo — faint watermark across all screens */}
      <div style={{position:'fixed',inset:0,zIndex:101,pointerEvents:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src="/NN.png" alt="" style={{width:'min(420px,55vw)',opacity:0.06,userSelect:'none',filter:'brightness(10) saturate(0)'}}/>
      </div>
      <NavBar view={view} setView={setView} onHome={onBack} onNavigate={onNavigate}/>

      {/* ── Floating AI button — left edge, vertically centred ── */}
      <button onClick={()=>setAiOpen(o=>!o)}
        style={{
          position:'fixed', left:0, top:'50%', transform:'translateY(-50%)',
          zIndex:9500,
          writingMode:'vertical-rl', textOrientation:'mixed',
          background: aiOpen
            ? 'linear-gradient(180deg,#6d28d9,#a855f7,#ec4899,#f97316)'
            : 'rgba(10,6,30,0.85)',
          backgroundSize:'100% 200%',
          animation: aiOpen ? 'auroraShift 4s ease-in-out infinite' : 'none',
          border:'1px solid rgba(168,85,247,0.45)',
          borderLeft:'none',
          borderRadius:'0 10px 10px 0',
          padding:'18px 8px',
          color: aiOpen ? '#fff' : 'rgba(200,160,255,0.85)',
          fontFamily:"'Inter',sans-serif",
          fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.12em',
          cursor:'pointer', outline:'none',
          boxShadow: aiOpen
            ? '4px 0 24px rgba(168,85,247,0.55)'
            : '4px 0 12px rgba(168,85,247,0.20)',
          backdropFilter:'blur(12px)',
          transition:'all 0.2s',
        }}
        onMouseEnter={e=>{if(!aiOpen){e.currentTarget.style.background='rgba(109,40,217,0.35)';e.currentTarget.style.color='#fff';}}}
        onMouseLeave={e=>{if(!aiOpen){e.currentTarget.style.background='rgba(10,6,30,0.85)';e.currentTarget.style.color='rgba(200,160,255,0.85)';}}}
      >✦ AI</button>

      {aiOpen && <Estimator onClose={()=>setAiOpen(false)}/>}
      {view==='landing'           && <Landing onNew={()=>setView('form')} onRevised={()=>setView('revisedSearch')} onFinalPrice={()=>setView('finalPriceSearch')} q={q} setQ={setQ} onGo={handleSearch}/>}
      {view==='form'              && <Form onSubmit={handleSubmit} onBack={()=>setView('landing')}/>}
      {view==='revisedSearch'     && <RevisedSearch requests={requests} onSelect={r=>{setRevisedSource(r);setView('revisedForm');}} onBack={()=>setView('landing')}/>}
      {view==='revisedForm'       && revisedSource && <RevisedForm original={revisedSource} onSubmit={handleRevisedSubmit} onBack={()=>setView('revisedSearch')}/>}
      {view==='finalPriceSearch'  && <FinalPriceSearch requests={requests} onSelect={r=>{setFinalPriceSource(r);setView('finalPriceForm');}} onBack={()=>setView('landing')}/>}
      {view==='finalPriceForm'    && finalPriceSource && <FinalPriceForm original={finalPriceSource} onSubmit={handleFinalPriceSubmit} onBack={()=>setView('finalPriceSearch')}/>}
      {view==='relax'          && <RelaxScreen onAnother={()=>setView('form')} onHome={()=>setView('landing')}/>}
      {view==='dashboard' && <Dashboard requests={requests} onUpdate={updateRequest}/>}
      {view==='analyse'   && <Analyse requests={requests}/>}
      {view==='loading'   && <Loading id={id} q={q} setQ={setQ} go={handleSearch}/>}
      {view==='results'   && <Results id={id} req={foundReq} q={q} setQ={setQ} go={handleSearch}/>}
    </div>
  );
}
