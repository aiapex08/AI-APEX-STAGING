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
  .or-layout { position:absolute;inset:0;top:0;display:flex;flex-direction:column }
  .or-main   { flex:1;min-width:0;overflow-y:auto;padding:62px 32px 16px }
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
    .or-main   { padding:62px 16px 12px }
    .or-team   { height:16vh;min-height:100px;padding:8px 16px 8px }

    /* Dashboard detail */
    .dash-detail-wrap { padding:62px 14px 16px!important }
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
const SalesPerformance = ({ spName, showAll }) => {
  const F = "'Inter',sans-serif";
  const SK = `sp_perf_${spName||'all'}`;
  const [rows, setRows] = useState(() => { try { return JSON.parse(localStorage.getItem(SK)||'[]'); } catch { return []; } });
  const [showAdd, setShowAdd] = useState(false);
  const blank = { customer:'', so:'', invoiceValue:'', collection:'' };
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

  const maxInv = Math.max(1, ...rows.map(r => Number(r.invoiceValue)||0));
  const totalInv = rows.reduce((s,r) => s + (Number(r.invoiceValue)||0), 0);
  const totalCol = rows.reduce((s,r) => s + (Number(r.collection)||0), 0);
  const fmt = v => Number(v) >= 1000 ? `${(Number(v)/1000).toFixed(1)}K` : String(Number(v)||0);

  const inp = (ex={}) => ({ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:7, color:'rgba(255,255,255,0.85)', fontFamily:F, fontSize:'0.84rem', padding:'9px 12px', outline:'none', boxSizing:'border-box', ...ex });

  return (
    <div className="ss-page" style={{ overflowY:'auto', fontFamily:F }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, letterSpacing:'0.10em', color:'rgba(255,255,255,0.88)', textTransform:'uppercase', margin:0 }}>Sales Performance</h2>
          <p style={{ fontSize:'0.70rem', color:'rgba(255,255,255,0.30)', marginTop:4, letterSpacing:'0.06em' }}>Customer · SO # · Invoice Value · Collection</p>
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
        <div style={{ background:'rgba(4,6,20,0.95)', border:'1px solid rgba(168,85,247,0.25)', borderRadius:14, padding:'22px 24px', marginBottom:20, display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:10, alignItems:'flex-end' }}>
          {[['Customer','customer','Company name'],['SO #','so','Sales order #'],['Invoice Value (AED)','invoiceValue','0'],['Collection (AED)','collection','0']].map(([lbl,key,ph])=>(
            <div key={key}>
              <label style={{ fontSize:'0.54rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.32)', display:'block', marginBottom:5 }}>{lbl}</label>
              <input value={form[key]} onChange={e=>UP(key,e.target.value)} placeholder={ph} style={inp(key==='invoiceValue'||key==='collection'?{textAlign:'right'}:{})}/>
            </div>
          ))}
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={()=>setShowAdd(false)} style={{ padding:'9px 12px', borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.38)', fontFamily:F, fontSize:'0.80rem', cursor:'pointer', outline:'none' }}>✕</button>
            <button onClick={save} style={{ padding:'9px 18px', borderRadius:8, background:'rgba(168,85,247,0.20)', border:'1px solid rgba(168,85,247,0.45)', color:'rgba(200,160,255,0.95)', fontFamily:F, fontSize:'0.84rem', fontWeight:700, cursor:'pointer', outline:'none' }}>Save</button>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:260, gap:12, opacity:0.35 }}>
          <span style={{ fontSize:'2.4rem' }}>📊</span>
          <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.40)', textAlign:'center' }}>No performance records yet.<br/>Add your first record above.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Summary chips */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[['Total Records', rows.length, 'rgba(168,85,247,0.80)'],['Total Invoice', `AED ${totalInv.toLocaleString()}`, 'rgba(99,200,255,0.80)'],['Total Collection', `AED ${totalCol.toLocaleString()}`, 'rgba(52,211,153,0.80)'],['Outstanding', `AED ${Math.max(0,totalInv-totalCol).toLocaleString()}`, 'rgba(251,191,36,0.80)']].map(([l,v,c])=>(
              <div key={l} style={{ padding:'10px 18px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', flexDirection:'column', gap:4, minWidth:140 }}>
                <span style={{ fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', fontWeight:600 }}>{l}</span>
                <span style={{ fontSize:'1.0rem', fontWeight:800, color:c }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'18px 20px' }}>
            <p style={{ fontSize:'0.56rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:16, fontWeight:700 }}>Invoice vs Collection by Customer</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {rows.map(r => {
                const inv = Number(r.invoiceValue)||0;
                const col = Number(r.collection)||0;
                const pInv = (inv/maxInv)*100;
                const pCol = inv > 0 ? (col/inv)*100 : 0;
                return (
                  <div key={r.id} style={{ display:'grid', gridTemplateColumns:'160px 1fr 100px', gap:10, alignItems:'center' }}>
                    <span style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.70)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.customer}</span>
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{ height:8, borderRadius:4, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pInv}%`, background:'rgba(99,160,255,0.70)', borderRadius:4 }}/>
                      </div>
                      <div style={{ height:8, borderRadius:4, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pCol}%`, background:'rgba(52,211,153,0.70)', borderRadius:4 }}/>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'0.68rem', color:'rgba(99,160,255,0.80)', fontWeight:600 }}>AED {fmt(inv)}</div>
                      <div style={{ fontSize:'0.64rem', color:'rgba(52,211,153,0.70)' }}>AED {fmt(col)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:'flex', gap:14, marginTop:14 }}>
              {[['rgba(99,160,255,0.70)','Invoice Value'],['rgba(52,211,153,0.70)','Collection']].map(([c,l])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:22, height:6, borderRadius:3, background:c }}/>
                  <span style={{ fontSize:'0.60rem', color:'rgba(255,255,255,0.35)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 120px 160px 160px 36px', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              {['Customer','SO #','Invoice Value','Collection',''].map(h=>(
                <span key={h} style={{ fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', fontWeight:700 }}>{h}</span>
              ))}
            </div>
            {rows.map((r,i) => (
              <div key={r.id} style={{ display:'grid', gridTemplateColumns:'1fr 120px 160px 160px 36px', padding:'12px 16px', borderBottom: i<rows.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center' }}>
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.80)' }}>{r.customer}</span>
                <span style={{ fontSize:'0.76rem', color:'rgba(255,255,255,0.45)', fontFamily:'monospace' }}>{r.so||'—'}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(99,160,255,0.85)', textAlign:'right' }}>AED {Number(r.invoiceValue||0).toLocaleString()}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(52,211,153,0.85)', textAlign:'right' }}>AED {Number(r.collection||0).toLocaleString()}</span>
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

  const handleLogin = (e) => {
    e && e.preventDefault();
    const name = loginInput.trim();
    if (!name) { setLoginError(true); return; }
    // check if any request has this salesperson
    const match = requests.find(r =>
      (r.salesPerson || '').toLowerCase() === name.toLowerCase()
    );
    if (!match) { setLoginError(true); return; }
    setSpName(match.salesPerson);
    setLoggedIn(true);
    setLoginError(false);
  };

  // filtered to this salesperson only (or all if director/showAll)
  const myRequests = showAll
    ? requests
    : loggedIn
      ? requests.filter(r =>
          (r.salesPerson || '').toLowerCase() === spName.toLowerCase() ||
          (r.salesPerson || '').toUpperCase() === spName.toUpperCase()
        )
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
    onUpdate(globalIdx, { salesStatus: newStatus, salesStatusAt: ts, salesLog: [...prev, entry] });
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>My Dashboard</h2>
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
      ['Request ID', r.id], ['Project', r.proj || '—'], ['Client', r.client || '—'],
      ['Main Contractor', r.mainContractor || '—'], ['Consultant', r.consultant || '—'],
      ['Submitted By', r.submittedBy || '—'], ['Deal Type', r.deal || '—'],
      ['Email', r.email || '—'], ['MOB', r.mob || '—'], ['Tel', r.tel || '—'],
      ['Lead Time', r.leadTime || '—'], ['Address', r.address || '—'],
      ['Submitted On', r.date || '—'],
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
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 0', gap: 12 }}>
                <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.32)', flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.78)', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
            {r.remarks && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', marginBottom: 5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Remarks</p>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.60)', lineHeight: 1.6 }}>{r.remarks}</p>
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

            {/* Attached submitted files */}
            {r.docs?.filter(d => d && typeof d === 'object' && (d.data || d.url)).length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px' }}>
                <p style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>Attached Documents</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {r.docs.filter(d => d && typeof d === 'object' && (d.data || d.url)).map((d, i) => (
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
      <div className="ss-hdr">
        <div>
          <span className="ss-title">{showAll ? 'Sales Overview' : 'My Dashboard'}</span>
          <div style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em' }}>
            {showAll
              ? <span style={{ color: 'rgba(200,220,255,0.70)', fontWeight: 600 }}>All Sales Requests</span>
              : <>Logged in as <span style={{ color: 'rgba(200,220,255,0.70)', fontWeight: 600 }}>{spName}</span></>
            }
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, marginBottom: 16, maxWidth: 440, overflow: 'hidden', flexShrink: 0 }}>
        <span style={{ padding: '10px 13px', display: 'flex', alignItems: 'center' }}><Search size={14} color="rgba(255,255,255,0.35)" /></span>
        <input value={dsearch} onChange={e => setDsearch(e.target.value)} placeholder="Search by ID, project or client..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.85)', fontFamily: F2, fontSize: '0.86rem', padding: '10px 0' }} />
      </div>

      {myRequests.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.22)', fontSize: '0.88rem', letterSpacing: '0.08em' }}>
          No requests assigned to you yet.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10, overflowY:'auto', flex:1 }}>
          {/* Column headers */}
          <div style={{ display:'grid', gridTemplateColumns:'110px 1fr 150px 150px 140px 36px', gap:10, padding:'0 14px', alignItems:'center' }}>
            {['Request #','Project · Customer','Est. Status','Ageing TAT','Sales Status',''].map(h=>(
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
            return (
              <div key={r.id}
                style={{ display:'grid', gridTemplateColumns:'110px 1fr 150px 150px 140px 36px', gap:10,
                  padding:'12px 14px', borderRadius:12,
                  background: flashId===r.id ? 'rgba(99,220,160,0.08)' : 'rgba(255,255,255,0.03)',
                  border:`1px solid ${flashId===r.id ? 'rgba(52,211,153,0.30)' : 'rgba(255,255,255,0.07)'}`,
                  alignItems:'center', transition:'all 0.3s' }}>

                {/* Request # */}
                <span style={{ fontSize:'0.76rem', fontWeight:700, color:'rgba(220,165,0,0.90)', fontFamily:'monospace', letterSpacing:'0.04em' }}>{r.id}</span>

                {/* Project · Customer */}
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.82)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.proj || '—'}</div>
                  <div style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.35)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {[r.client, r.mainContractor].filter(Boolean).join(' · ') || '—'}
                  </div>
                </div>

                {/* Estimation Status — non-editable */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:50,
                  background:'rgba(220,165,0,0.08)', border:'1px solid rgba(220,165,0,0.22)', maxWidth:155 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'rgba(220,185,80,0.9)', flexShrink:0 }}/>
                  <span style={{ fontSize:'0.64rem', fontWeight:600, color:'rgba(220,185,80,0.88)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.status || 'Pending'}</span>
                </div>

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

                {/* Sales Status — read-only badge */}
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  {(() => {
                    const col = scol[curSales] || scol.Pending;
                    return (
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:50,
                        background: col.bg, border:`1px solid ${col.bd}`,
                        fontSize:'0.65rem', fontWeight:700, color: col.c, letterSpacing:'0.06em' }}>
                        <span style={{ width:5, height:5, borderRadius:'50%', background:col.c, flexShrink:0 }}/>
                        {curSales}
                      </span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};


// ─── ROLE LOGIN ───────────────────────────────────────────────────────────────
const ROLE_CODES = {
  // Sales
  SX985:'sales', SX417:'sales', SE628:'sales', SE842:'sales', SE519:'sales', SM386:'sales',
  // Estimators
  EX552:'estimator', EX719:'estimator', EX638:'estimator', EX904:'estimator',
  EX471:'estimator', EX856:'estimator', EX392:'estimator', EX681:'estimator',
  EX547:'estimator', EX903:'estimator', EX764:'estimator',
  // Director
  COSTA:'director', STAR:'director',
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

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'rgba(0,1,6,0.94)', backdropFilter:'blur(20px)',
      animation:'fadeUp 0.4s ease both', fontFamily:F2,
    }}>
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',width:'60vw',height:'60vw',borderRadius:'50%',top:'-20vw',left:'-15vw',
          background:'radial-gradient(circle,rgba(109,40,217,0.12) 0%,transparent 70%)',filter:'blur(40px)'}}/>
        <div style={{position:'absolute',width:'50vw',height:'50vw',borderRadius:'50%',bottom:'-15vw',right:'-10vw',
          background:'radial-gradient(circle,rgba(0,180,255,0.10) 0%,transparent 70%)',filter:'blur(40px)'}}/>
      </div>
      <div style={{
        position:'relative', zIndex:1,
        width:'min(460px,94vw)',
        background:'rgba(0,4,16,0.82)',
        border:'1px solid rgba(255,255,255,0.09)',
        borderRadius:20, padding:'44px 40px 40px',
        backdropFilter:'blur(24px)',
        boxShadow:'0 24px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.04) inset',
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
            { label:'Sales',       hint:'SX985 · SX417 · SE628 · SE842 · SE519 · SM386', color:'rgba(160,130,255,0.85)', bg:'rgba(130,90,255,0.07)',  bd:'rgba(130,90,255,0.20)'  },
            { label:'Estimator',   hint:'EX552 · EX719 · EX638 · EX904 · EX471 · EX856 · EX392 · EX681 · EX547 · EX903 · EX764', color:'rgba(0,200,255,0.85)',   bg:'rgba(0,150,255,0.07)',   bd:'rgba(0,180,255,0.20)'   },
            { label:'Cost-Artist', hint:'COSTA · STAR',  color:'rgba(255,210,60,0.85)',  bg:'rgba(200,150,0,0.07)',   bd:'rgba(220,170,0,0.20)'   },
          ].map(({label,hint,color,bg,bd}) => (
            <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
              background:bg, border:`1px solid ${bd}`, borderRadius:10, padding:'9px 14px'}}>
              <span style={{fontSize:'0.78rem',fontWeight:600,color,letterSpacing:'0.04em'}}>{label}</span>
              <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.30)',fontFamily:'monospace',letterSpacing:'0.12em'}}>{hint}</span>
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
  'SE519':'Yazan Al Agha','SM386':'Ali Hussnain',
  // Estimators
  'EX552':'Sachin Poojary','EX719':'Mohammad Samee Hamid Khan',
  'EX638':'Moazzam Ali','EX904':'Benson Benjamine',
  'EX471':'Pranav Manjalam Kandiyil','EX856':'Saeem Sajid Gadkari',
  'EX392':'Jaffar Shaik','EX681':'Muzafar Khasab Abdul',
  'EX547':'Afridi Miyan Basheer','EX903':'Alfaj Muhammad',
  'EX764':'Vimal Vencent',
  // Director
  'COSTA':'APEX-CA','STAR':'APEX-CA',
};

const EST_ROSTER = [
  {code:'EX552',name:'Sachin Poojary'},
  {code:'EX719',name:'Mohammad Samee Hamid Khan'},
  {code:'EX638',name:'Moazzam Ali'},
  {code:'EX904',name:'Benson Benjamine'},
  {code:'EX471',name:'Pranav Manjalam Kandiyil'},
  {code:'EX856',name:'Saeem Sajid Gadkari'},
  {code:'EX392',name:'Jaffar Shaik'},
  {code:'EX681',name:'Muzafar Khasab Abdul'},
  {code:'EX547',name:'Afridi Miyan Basheer'},
  {code:'EX903',name:'Alfaj Muhammad'},
  {code:'EX764',name:'Vimal Vencent'},
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
  'COSTA':'/r.jpg','STAR':'/S.jpg',
  // Lowercase name keys — Sales
  'ammar khaldoun':'/A.jpg','ashik bin shams':'/b.jpg',
  'mohammad hindawi':'/c.jpg','ibrahim odeh':'/d.jpg',
  'yazan al agha':'/e.jpg','ali hussnain':'/f.jpg',
  // Lowercase name keys — Estimators
  'sachin poojary':'/g.jpg','mohammad samee hamid khan':'/h.jpg',
  'moazzam ali':'/i.jpg','benson benjamine':'/j.jpg',
  'pranav manjalam kandiyil':'/K.jpg','saeem sajid gadkari':'/L.jpg',
  'jaffar shaik':'/M.jpg','muzafar khasab abdul':'/N.jpg',
  'afridi miyan basheer':'/O.jpg','alfaj muhammad':'/R.jpg',
  'vimal vencent':'/Q.jpg',
  // Cost Artist name key
  'apex-ca':'/R.jpg',
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

const OpenRequests = ({ requests, onUpdate, onDelete, userCode='', userRole='' }) => {
  const F = "'Inter',sans-serif";
  const openReqs = requests.map((r,i)=>({r,i})).filter(({r})=>!r.estimator && r.status==='Pending Estimation');
  const [claiming, setClaiming] = useState(null);
  const [estName, setEstName] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [justClaimed, setJustClaimed] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // {idx, id}

  const openClaim = (idx, reqId) => {
    setClaiming({idx,reqId});
    setEstName(STAFF_NAMES[userCode] || '');
    setNameErr(false);
  };
  const closeClaim = () => { setClaiming(null); setEstName(''); setNameErr(false); };

  const confirmClaim = () => {
    const name = estName.trim();
    if (!name) { setNameErr(true); return; }
    const ts = new Date().toISOString();
    onUpdate(claiming.idx, {
      estimator: name,
      taggedAt: Date.now(),
      reqStatus: 'inprogress',
      timeline: [...(requests[claiming.idx].timeline||[]), { event:'assigned', ts, label:`Assigned to ${name}`, by: name }],
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

  const estStatus = e => {
    const inHand = e.active + e.pending;
    if (inHand === 0) return { label:'Available', dot:'#22c55e', glow:'rgba(34,197,94,0.55)', dim:false };
    if (inHand <= 2)  return { label:`${inHand} In Hand`, dot:'#fbbf24', glow:'rgba(251,191,36,0.50)', dim:false };
    return               { label:`${inHand} Requests`, dot:'#ef4444', glow:'rgba(239,68,68,0.50)', dim:false };
  };

  // check if last active within 24 h → online, else offline
  const isOnline = e => e.lastActive && (Date.now() - e.lastActive) < 86400000;

  return (
    <div className="or-layout" style={{fontFamily:F,animation:'fadeUp 0.4s ease both'}}>

      {/* ── LEFT: main content ── */}
      <div className="or-main">

      {/* Claim identity modal */}
      {claiming && (
        <div style={{position:'fixed',inset:0,zIndex:9500,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,8,0.72)',backdropFilter:'blur(10px)'}}>
          <div style={{background:'rgba(8,4,24,0.98)',border:'1px solid rgba(168,85,247,0.30)',borderRadius:20,padding:'36px 32px',width:340,display:'flex',flexDirection:'column',alignItems:'center',gap:18,boxShadow:'0 30px 80px rgba(0,0,0,0.7)',animation:'fadeUp 0.25s ease both'}}>
            <p style={{fontSize:'0.55rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(168,85,247,0.60)',margin:0,fontWeight:700}}>Claim Request · {claiming.reqId}</p>
            {/* Estimator selector */}
            <p style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.30)',margin:0,alignSelf:'flex-start',letterSpacing:'0.06em'}}>Select estimator</p>
            <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7,maxHeight:240,overflowY:'auto',paddingRight:2}}>
              {EST_ROSTER.map(e=>{
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
            {nameErr && <p style={{fontSize:'0.72rem',color:'rgba(255,90,90,0.80)',margin:0,textAlign:'center'}}>Please select an estimator</p>}
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

      {/* Header */}
      <div style={{marginBottom:28}}>
        <p style={{fontSize:'0.55rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(160,130,255,0.55)',marginBottom:6,fontWeight:600}}>NAFFCO · AI SYSTEM</p>
        <div style={{display:'flex',alignItems:'baseline',gap:14}}>
          <h2 style={{fontSize:'1.5rem',fontWeight:800,color:'rgba(255,255,255,0.88)',margin:0}}>Open Requests</h2>
          <span style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.28)',fontWeight:400}}>{openReqs.length} unassigned</span>
        </div>
        <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.32)',marginTop:4}}>Pick a request and assign it to yourself to begin estimation.</p>
      </div>

      {openReqs.length === 0 ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:260,gap:14,opacity:0.4}}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.4)',fontFamily:F,textAlign:'center'}}>All requests are assigned.<br/>No open requests right now.</p>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:18}}>
          {openReqs.map(({r,i})=>{
            const isClaimed = justClaimed === r.id;
            const pal = avatarPalette('unassigned');
            return (
              <div key={r.id}
                style={{position:'relative',background:isClaimed?'rgba(16,185,129,0.08)':'rgba(6,4,20,0.90)',
                  border:`1px solid ${isClaimed?'rgba(52,211,153,0.40)':'rgba(255,255,255,0.08)'}`,
                  borderRadius:16,padding:'20px',display:'flex',flexDirection:'column',gap:12,
                  transition:'all 0.4s',overflow:'hidden',
                  boxShadow:isClaimed?'0 0 30px rgba(52,211,153,0.18)':'none'}}>
                {/* Top stripe */}
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,
                  background:isClaimed?'linear-gradient(90deg,transparent,rgba(52,211,153,0.8),transparent)':'linear-gradient(90deg,transparent,rgba(168,85,247,0.5),transparent)'}}/>

                {/* ID + deal badge + delete */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontFamily:'monospace',fontSize:'0.80rem',fontWeight:800,color:'rgba(220,165,0,0.90)',letterSpacing:'0.08em'}}>{r.id}</span>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    {r.deal && <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:dealColor(r.deal),border:`1px solid ${dealColor(r.deal)}50`,borderRadius:4,padding:'2px 7px'}}>{r.deal}</span>}
                    {r.requestType==='revised'    && <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(0,200,255,0.75)',border:'1px solid rgba(0,200,255,0.22)',borderRadius:4,padding:'2px 7px'}}>REVISED</span>}
                    {r.requestType==='finalPrice' && <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(52,211,153,0.80)',border:'1px solid rgba(52,211,153,0.25)',borderRadius:4,padding:'2px 7px'}}>FINAL</span>}
                    {userRole === 'director' && (
                      <button
                        onClick={e=>{e.stopPropagation();setDeleteConfirm({idx:i,id:r.id});}}
                        title="Delete request"
                        style={{display:'flex',alignItems:'center',justifyContent:'center',width:26,height:26,borderRadius:6,background:'rgba(220,50,50,0.10)',border:'1px solid rgba(220,50,50,0.28)',color:'rgba(220,80,80,0.80)',cursor:'pointer',outline:'none',transition:'all 0.15s',flexShrink:0}}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.24)';e.currentTarget.style.color='rgba(255,100,100,1)';e.currentTarget.style.borderColor='rgba(220,60,60,0.55)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.10)';e.currentTarget.style.color='rgba(220,80,80,0.80)';e.currentTarget.style.borderColor='rgba(220,50,50,0.28)';}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Project + Client */}
                <div>
                  <p style={{fontSize:'0.92rem',fontWeight:700,color:'rgba(255,255,255,0.88)',margin:0,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.proj||'—'}</p>
                  <p style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.40)',margin:'3px 0 0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.client||'—'}</p>
                </div>

                {/* Meta row */}
                <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
                  {[
                    {label:'Submitted By', val:r.submittedBy||'—'},
                    {label:'Lead Time',    val:r.leadTime||'—'},
                    {label:'Date',         val:r.date||'—'},
                  ].map(({label,val})=>(
                    <div key={label} style={{display:'flex',flexDirection:'column',gap:2}}>
                      <span style={{fontSize:'0.48rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:600}}>{label}</span>
                      <span style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.65)',fontWeight:500}}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Remarks snippet */}
                {r.remarks && <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.35)',lineHeight:1.5,margin:0,borderLeft:'2px solid rgba(168,85,247,0.25)',paddingLeft:8,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{r.remarks}</p>}

                {/* CTA */}
                {isClaimed ? (
                  <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(52,211,153,0.08)',border:'1px solid rgba(52,211,153,0.25)',borderRadius:10,marginTop:4}}>
                    <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(52,211,153,0.90)',boxShadow:'0 0 8px rgba(52,211,153,0.7)',flexShrink:0}}/>
                    <span style={{fontSize:'0.80rem',color:'rgba(52,211,153,0.90)',fontWeight:600}}>Request Claimed!</span>
                  </div>
                ) : (
                  <button onClick={()=>openClaim(i, r.id)}
                    style={{width:'100%',marginTop:4,padding:'11px 0',borderRadius:10,
                      background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.28)',
                      color:'rgba(200,160,255,0.88)',fontFamily:F,fontSize:'0.82rem',fontWeight:700,
                      cursor:'pointer',outline:'none',letterSpacing:'0.06em',
                      display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all 0.2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(105deg,#4c1d95,#6d28d9,#a855f7)';e.currentTarget.style.color='#fff';e.currentTarget.style.boxShadow='0 4px 20px rgba(168,85,247,0.40)';e.currentTarget.style.borderColor='rgba(168,85,247,0.60)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(168,85,247,0.08)';e.currentTarget.style.color='rgba(200,160,255,0.88)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.28)';}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Take This Request
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>{/* end left */}

      {/* ── BOTTOM: Estimator Team strip (full roster, always visible) ── */}
      <div className="or-team">
        <p style={{fontSize:'0.45rem',letterSpacing:'0.18em',textTransform:'uppercase',
          color:'rgba(255,255,255,0.22)',fontWeight:700,margin:'0 0 8px',flexShrink:0}}>Estimator Team</p>
        <div style={{display:'flex',gap:8,overflowX:'auto',flex:1,alignItems:'center',paddingBottom:2}}>
          {EST_ROSTER.map(er => {
            const stats = estRoster.find(x => x.name === er.name);
            const inHand  = stats ? stats.active + stats.pending : 0;
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
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={()=>setDeleteConfirm(null)}
                style={{padding:'9px 22px',borderRadius:8,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.60)',cursor:'pointer',fontFamily:F,fontSize:'0.82rem',fontWeight:600,outline:'none',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.10)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                Cancel
              </button>
              <button onClick={()=>{ onDelete(deleteConfirm.idx); setDeleteConfirm(null); }}
                style={{padding:'9px 22px',borderRadius:8,background:'rgba(200,40,40,0.20)',border:'1px solid rgba(220,60,60,0.50)',color:'rgba(255,100,100,0.95)',cursor:'pointer',fontFamily:F,fontSize:'0.82rem',fontWeight:700,outline:'none',transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(200,40,40,0.36)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(200,40,40,0.20)'}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ─── TRACK YOUR QUOTATION ────────────────────────────────────────────────────
const TrackQuotation = ({ requests, spName, showAll, onUpdate }) => {
  const F = "'Inter',sans-serif";
  const [search, setSearch]     = useState('');
  const [openIdx, setOpenIdx]   = useState(null);
  const [chatMsg, setChatMsg]   = useState('');
  const chatEndRef              = useRef(null);

  const myReqs = requests.filter(r => {
    const matchSP = showAll || (r.salesPerson || '').toLowerCase() === (spName || '').toLowerCase() || (r.submittedBy || '').toLowerCase() === (spName || '').toLowerCase();
    const matchSearch = !search || r.id?.toLowerCase().includes(search.toLowerCase()) || (r.proj||'').toLowerCase().includes(search.toLowerCase()) || (r.client||'').toLowerCase().includes(search.toLowerCase());
    return matchSP && matchSearch;
  }).sort((a,b) => (b.submittedAt||b.date||'').localeCompare(a.submittedAt||a.date||''));

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
    if (r.reqStatus === 'completed' || r.directorAction === 'approved') return 'rgba(0,220,130,0.90)';
    if (r.directorAction === 'rejected') return 'rgba(255,80,80,0.90)';
    if (r.directorAction === 'revised')  return 'rgba(255,160,40,0.90)';
    if (r.reqStatus === 'pending-director') return 'rgba(255,140,50,0.90)';
    if (r.estimationFile) return 'rgba(168,85,247,0.90)';
    if (r.estimator)      return 'rgba(255,200,50,0.90)';
    return 'rgba(100,180,255,0.90)';
  };
  const statusLabel = r => {
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
    onUpdate(realIdx, { conversation:[...(req.conversation||[]),{from:req.salesPerson||spName||'Sales',role:'sales',text:chatMsg.trim(),ts,tsMs:Date.now()}] });
    setChatMsg('');
    setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:'smooth'}),60);
  };

  const downloadDoc = d => {
    if (!d?.data) return;
    const byteStr = atob(d.data.split(',')[1]||d.data);
    const ab = new ArrayBuffer(byteStr.length);
    const ia = new Uint8Array(ab);
    for (let i=0;i<byteStr.length;i++) ia[i]=byteStr.charCodeAt(i);
    const blob = new Blob([ab],{type:d.type||'application/octet-stream'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=d.name||'quotation';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  /* ── DETAIL VIEW ── */
  if (openIdx !== null) {
    const r = myReqs[openIdx];
    if (!r) { setOpenIdx(null); return null; }
    const realIdx = requests.indexOf(r);
    const sc = statusColor(r);
    const sl = statusLabel(r);
    const stageIdx = getStageIdx(r);
    const quotReady = r.estimationFile || r.estimationDocs?.length;
    const infoRows = [
      ['Request ID', r.id], ['Project', r.proj||'—'], ['Client', r.client||'—'],
      ['Deal Type', r.deal||'—'], ['Main Contractor', r.mainContractor||'—'],
      ['Consultant', r.consultant||'—'], ['Email', r.email||'—'],
      ['MOB', r.mob||'—'], ['Lead Time', r.leadTime||'—'],
      ['Estimator', r.estimator||'—'], ['Submitted', r.date||'—'],
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
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'16px 20px',marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:0}}>
            {STAGES.map((st,si)=>{
              const done=si<=stageIdx; const active=si===stageIdx;
              return (
                <div key={st.key} style={{display:'flex',alignItems:'center',flex:1}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                    <div style={{width:'100%',height:4,background:done?st.color:'rgba(255,255,255,0.07)',borderRadius:2}}/>
                    <div style={{width:10,height:10,borderRadius:'50%',marginTop:-7,background:done?st.color:'rgba(255,255,255,0.12)',boxShadow:active?`0 0 10px ${st.color}`:undefined,border:active?`2px solid ${st.color}`:'2px solid transparent'}}/>
                    <div style={{fontSize:'0.52rem',color:done?st.color:'rgba(255,255,255,0.22)',marginTop:5,letterSpacing:'0.05em',textAlign:'center',fontWeight:done?600:400,whiteSpace:'nowrap'}}>{st.label}</div>
                  </div>
                  {si<STAGES.length-1&&<div style={{width:6,flexShrink:0}}/>}
                </div>
              );
            })}
          </div>
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
                  <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.75)',textAlign:'right'}}>{v}</span>
                </div>
              ))}
            </div>
            {/* Download quotation */}
            <div style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${quotReady?'rgba(168,85,247,0.30)':'rgba(255,255,255,0.07)'}`,borderRadius:10,padding:'16px 18px'}}>
              <p style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:quotReady?'rgba(168,85,247,0.70)':'rgba(255,255,255,0.22)',marginBottom:10}}>Quotation</p>
              {quotReady ? (
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {(r.estimationDocs||[r.estimationDoc]).filter(Boolean).map((d,i)=>(
                    <button key={i} onClick={()=>d?.data?downloadDoc(d):null}
                      style={{display:'flex',alignItems:'center',gap:8,padding:'9px 14px',borderRadius:8,background:'rgba(168,85,247,0.10)',border:'1px solid rgba(168,85,247,0.28)',color:'rgba(210,170,255,0.90)',fontFamily:F,fontSize:'0.80rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s',width:'100%',textAlign:'left'}}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(168,85,247,0.20)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(168,85,247,0.10)'}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {d?.name || r.estimationFile || `Quotation_${r.id}`}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.25)',lineHeight:1.6,margin:0}}>Quotation will be available once the estimator uploads it.</p>
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
            <div style={{display:'flex',alignItems:'center',gap:9,paddingBottom:10,borderBottom:'1px solid rgba(168,85,247,0.18)'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(168,85,247,0.90)',boxShadow:'0 0 8px rgba(168,85,247,0.70)',flexShrink:0}}/>
              <p style={{fontSize:'0.60rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(168,85,247,0.85)',margin:0,fontWeight:700}}>Conversation</p>
              {r.estimator && <span style={{marginLeft:'auto',fontSize:'0.65rem',color:'rgba(100,200,255,0.55)',fontWeight:500}}>with {r.estimator}</span>}
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
    <div style={{position:'relative',width:'100%',minHeight:'100%',padding:'72px 36px 36px',fontFamily:F,color:'#e2e8f0',overflowY:'auto'}}>
      <div style={{maxWidth:960,margin:'0 auto'}}>
        {/* Header */}
        <div style={{marginBottom:24}}>
          <p style={{fontSize:'0.55rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(168,85,247,0.60)',marginBottom:6,fontWeight:700}}>NAFFCO · AI SYSTEM</p>
          <h2 style={{fontSize:'1.5rem',fontWeight:800,color:'rgba(255,255,255,0.92)',margin:0,marginBottom:4}}>Track your Quotation</h2>
          <p style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.32)',margin:0}}>
            {showAll ? 'All submitted quotation requests' : `Quotations submitted by ${spName || 'you'}`}
          </p>
        </div>
        {/* Search */}
        <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'8px 14px',marginBottom:24,maxWidth:360}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ID, project or client…"
            style={{flex:1,background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.80)',fontFamily:F,fontSize:'0.82rem'}}/>
        </div>
        {/* Summary chips */}
        {(()=>{
          const all=myReqs.length,approved=myReqs.filter(r=>r.reqStatus==='completed'||r.directorAction==='approved').length,pending=myReqs.filter(r=>!r.directorAction&&r.reqStatus!=='completed').length,rejected=myReqs.filter(r=>r.directorAction==='rejected').length;
          return (
            <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap'}}>
              {[['Total',all,'rgba(100,160,255,0.80)','rgba(80,120,255,0.15)'],['Approved',approved,'rgba(0,220,130,0.90)','rgba(0,180,100,0.12)'],['In Progress',pending,'rgba(255,200,50,0.90)','rgba(220,160,0,0.12)'],['Rejected',rejected,'rgba(255,80,80,0.90)','rgba(200,40,40,0.12)']].map(([lbl,cnt,c,bg])=>(
                <div key={lbl} style={{background:bg,border:`1px solid ${c}30`,borderRadius:8,padding:'8px 18px',display:'flex',flexDirection:'column',gap:2}}>
                  <span style={{fontSize:'0.55rem',letterSpacing:'0.14em',textTransform:'uppercase',color:c,fontWeight:700}}>{lbl}</span>
                  <span style={{fontSize:'1.4rem',fontWeight:800,color:c,lineHeight:1}}>{cnt}</span>
                </div>
              ))}
            </div>
          );
        })()}
        {/* Cards */}
        {myReqs.length === 0 ? (
          <div style={{textAlign:'center',padding:'48px 0',color:'rgba(255,255,255,0.22)'}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{marginBottom:12,opacity:0.3}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p style={{fontSize:'0.88rem',margin:0}}>No quotations found.</p>
          </div>
        ) : myReqs.map((r,i) => {
          const stageIdx=getStageIdx(r),sc=statusColor(r),sl=statusLabel(r);
          const hasNewMsg=(r.conversation||[]).some(m=>m.role==='estimator');
          return (
            <div key={r.id||i}
              onClick={()=>setOpenIdx(i)}
              style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px',marginBottom:14,cursor:'pointer',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,0.40)';e.currentTarget.style.background='rgba(109,40,217,0.06)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.background='rgba(255,255,255,0.03)';}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:14}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontFamily:'monospace',fontSize:'0.88rem',fontWeight:700,color:'rgba(220,165,0,0.90)'}}>{r.id}</span>
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 10px',borderRadius:50,background:`${sc}18`,border:`1px solid ${sc}40`}}>
                      <span style={{width:5,height:5,borderRadius:'50%',background:sc,boxShadow:`0 0 5px ${sc}`,flexShrink:0}}/>
                      <span style={{fontSize:'0.65rem',color:sc,fontWeight:700,letterSpacing:'0.04em'}}>{sl}</span>
                    </span>
                    {hasNewMsg && <span style={{fontSize:'0.60rem',color:'rgba(168,85,247,0.90)',fontWeight:700,background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.28)',borderRadius:50,padding:'1px 8px'}}>💬 Message</span>}
                  </div>
                  <div style={{fontSize:'0.84rem',fontWeight:600,color:'rgba(255,255,255,0.82)',marginBottom:2}}>{r.proj||'—'}</div>
                  <div style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.38)'}}>{r.client||'—'}{r.deal?` · ${r.deal}`:''}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.25)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:2}}>Submitted</div>
                  <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.60)',fontWeight:600}}>{r.date||'—'}</div>
                  {r.estimator&&<div style={{fontSize:'0.72rem',color:'rgba(100,200,255,0.65)',marginTop:4}}>Est: {r.estimator}</div>}
                  <div style={{fontSize:'0.65rem',color:'rgba(168,85,247,0.55)',marginTop:6,fontWeight:600}}>Open →</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:0}}>
                {STAGES.map((st,si)=>{
                  const done=si<=stageIdx,active=si===stageIdx;
                  return (
                    <div key={st.key} style={{display:'flex',alignItems:'center',flex:1}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                        <div style={{width:'100%',height:3,background:done?st.color:'rgba(255,255,255,0.08)',borderRadius:2}}/>
                        <div style={{width:8,height:8,borderRadius:'50%',marginTop:-5.5,background:done?st.color:'rgba(255,255,255,0.12)',boxShadow:active?`0 0 8px ${st.color}`:undefined,border:active?`2px solid ${st.color}`:'2px solid transparent'}}/>
                        <div style={{fontSize:'0.50rem',color:done?st.color:'rgba(255,255,255,0.22)',marginTop:4,letterSpacing:'0.06em',textAlign:'center',fontWeight:done?600:400,whiteSpace:'nowrap'}}>{st.label}</div>
                      </div>
                      {si<STAGES.length-1&&<div style={{width:8,flexShrink:0}}/>}
                    </div>
                  );
                })}
              </div>
              {r.directorNote&&(
                <div style={{marginTop:12,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.06)',fontSize:'0.76rem',color:'rgba(255,200,140,0.75)',fontStyle:'italic'}}>
                  Cost-Artist: "{r.directorNote}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
const NavBar = ({ view, setView, onHome, onBack, userRole, userCode='', onLogout, onDirectTool, onDirectorAccess }) => {
  const homeActive    = ['landing','form','relax','revisedSearch','revisedForm','finalPriceSearch','finalPriceForm','loading','results'].includes(view);
  const dashActive    = view === 'dashboard';
  const analyseActive = view === 'analyse';
  const salesActive   = view === 'salesStatus';
  const perfActive    = view === 'salesPerformance';
  const diaryActive   = view === 'salesDiary';
  const trackActive   = view === 'trackQuotation';
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
    if (dc === 'STAR' || dc === 'COSTA') { setShowDirPrompt(false); onDirectorAccess?.(dc); }
    else { setDirErr(true); setTimeout(()=>setDirErr(false),1200); }
  };

  return (
    <div className="nav-bar" style={{position:'relative'}}>
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
      {/* Estimation Dashboard access code prompt */}
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
      {/* Logo */}
      <button onClick={onHome} style={{background:'transparent',border:'none',cursor:'pointer',padding:0,marginRight:12,flexShrink:0,display:'flex',alignItems:'center'}}>
        <img src="/NN.png" alt="NAFFCO Home" style={{height:'clamp(26px,4vw,36px)',width:'auto',objectFit:'contain',display:'block'}}/>
      </button>

      {/* Role-based nav pills */}
      <div className="nav-pills">
        {/* ── Guest (no role) — public request access ── */}
        {!userRole && <>
          <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
            New Request
          </button>
          <button className={`nav-btn${view==='openRequests'?' active':''}`} onClick={()=>setView('openRequests')}>
            Open Requests
          </button>
          <button className={`nav-btn${dashActive?' active':''}`} onClick={()=>{setShowEstPrompt(true);setEstCode('');setEstErr(false);setTimeout(()=>estInputRef.current?.focus(),60);}}>
            Estimation Dashboard
          </button>
        </>}

        {/* ── Sales View ── */}
        {userRole === 'sales' && <>
          <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
            Sales &amp; Marketing
          </button>
          <button className={`nav-btn${trackActive?' active':''}`} onClick={()=>setView('trackQuotation')}>
            Track your Quotation
          </button>
          <button className={`nav-btn${salesActive?' active':''}`} onClick={()=>setView('salesStatus')}>
            My Dashboard
          </button>
          <button className={`nav-btn${perfActive?' active':''}`} onClick={()=>setView('salesPerformance')}>
            Sales Performance
          </button>
          <button className={`nav-btn${diaryActive?' active':''}`} onClick={()=>setView('salesDiary')}>
            My Diary
          </button>
        </>}

        {/* ── Estimator View ── */}
        {userRole === 'estimator' && <>
          <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
            New Request
          </button>
          <button className={`nav-btn${dashActive?' active':''}`} onClick={()=>setView('dashboard')}>
            Estimator Dashboard
          </button>
        </>}

        {/* ── Director View ── */}
        {userRole === 'director' && <>
          <button className={`nav-btn${homeActive?' active':''}`} onClick={()=>setView('landing')}>
            New Request
          </button>
          <button className={`nav-btn${dashActive?' active':''}`} onClick={()=>setView('dashboard')}>
            Cost Artist Dashboard
          </button>
          <button className={`nav-btn${analyseActive?' active':''}`} onClick={()=>setView('analyse')}>
            Analysis
          </button>
          <button className={`nav-btn${salesActive?' active':''}`} onClick={()=>setView('salesStatus')}>
            Sales View
          </button>
          <button className={`nav-btn${perfActive?' active':''}`} onClick={()=>setView('salesPerformance')}>
            Sales Performance
          </button>
          <button className={`nav-btn${diaryActive?' active':''}`} onClick={()=>setView('salesDiary')}>
            My Diary
          </button>
        </>}
      </div>

      {/* Profile badge — click to show Sign Out */}
      {userRole && (
        <div style={{position:'relative',flexShrink:0,marginLeft:10}}>
          <button onClick={()=>setShowProfileMenu(v=>!v)}
            style={{
              display:'flex', alignItems:'center', gap:9,
              padding:'4px 14px 4px 4px', borderRadius:50,
              background: userRole==='sales'?'rgba(130,90,255,0.10)':userRole==='estimator'?'rgba(0,150,255,0.10)':'rgba(200,150,0,0.10)',
              border: userRole==='sales'?'1px solid rgba(130,90,255,0.28)':userRole==='estimator'?'1px solid rgba(0,180,255,0.28)':'1px solid rgba(220,170,0,0.28)',
              cursor:'pointer', outline:'none', background: showProfileMenu
                ? (userRole==='sales'?'rgba(130,90,255,0.20)':userRole==='estimator'?'rgba(0,150,255,0.20)':'rgba(200,150,0,0.20)')
                : (userRole==='sales'?'rgba(130,90,255,0.10)':userRole==='estimator'?'rgba(0,150,255,0.10)':'rgba(200,150,0,0.10)'),
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
                {userRole === 'sales' ? 'Sales' : userRole === 'estimator' ? 'Estimator' : 'Cost Artist'}
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

      {/* Right-side action buttons */}
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end'}}>
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

        {(!userRole || userRole === 'sales') && <button className="nav-back" onClick={onBack || onHome}>← Back</button>}
      </div>
    </div>
  );
};

// ─── VIEWS ──────────────────────────────────────────────────────────────────────────────
const Landing = ({onNew,onRevised,onFinalPrice,q,setQ,onGo,onDirectTool,userRole}) => {
  const isSales = userRole === 'sales';
  return (
    <div className="land" style={{position:'relative'}}>
      <div className="left-col">
        <div style={{display:'flex', flexDirection:'column'}}>
          <p className="brand">NAFFCO · AI SYSTEM</p>
          <h1 className="page-title">{isSales ? <>SALES &amp;<br/>MARKETING</> : <>AI APEX<br/>ESTIMATION</>}</h1>
          {!isSales && (
            <p className="page-sub">Intelligent quotation generation powered<br/>by advanced AI analysis.</p>
          )}
          {isSales && (
            <p style={{fontSize:'0.56rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',fontWeight:700,marginBottom:10,marginTop:4}}>Quick Links</p>
          )}
          <div className="land-btns">
            {[
              {label:'Request a New Quote', onClick:onNew},
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

const downloadDoc = async (d) => {
  if (!d) return;
  // Azure URL — fetch as blob so browser triggers Save dialog instead of opening a new tab
  if (d.url) {
    try {
      const res = await fetch(d.url);
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = d.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    } catch(err) {
      console.error('❌ Download failed:', err);
      window.open(d.url, '_blank'); // fallback
    }
    return;
  }
  // Legacy base64 download
  if (d.data) {
    const link = document.createElement('a');
    link.href = d.data;
    link.download = d.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const docName = (d) => (d && typeof d === 'object' ? d.name : d) || '—';
// ──────────────────────────────────────────────────────────────────────────────

const Form = ({onSubmit, onBack}) => {
  const [f,setF] = useState({submittedBy:'',salesPerson:'',proj:'',mainContractor:'',consultant:'',client:'',email:'',mob:'',tel:'',leadTime:'',address:'',remarks:'',supplyOnly:false,supplyInstall:false,customerRank:0});
  const [deal,setDeal] = useState('Job In Hand');
  const [files,setFiles] = useState([]);
  const [drag,setDrag] = useState(false);
  const ref = useRef();
  const u = k => e => setF(p=>({...p,[k]:e.target.value}));
  const drop = e => { e.preventDefault(); setDrag(false); if(e.dataTransfer.files?.length) setFiles(p=>[...p,...Array.from(e.dataTransfer.files)]); };

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
          >
            <input type="file" multiple ref={ref} style={{display:'none'}}
              onChange={e=>{if(e.target.files?.length)setFiles(p=>[...p,...Array.from(e.target.files)]);}}/>
            {files.length===0 ? (
              <>
                <FileText size={46} className="u-icon" color="rgba(255,255,255,0.35)"/>
                <p className="u-text" style={{marginTop:8}}>Drag & drop files, or <b>click to browse</b></p>
              </>
            ) : (
              <div style={{width:'100%',display:'flex',flexDirection:'column',gap:6}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                  <span style={{fontSize:'0.73rem',color:'rgba(255,255,255,0.7)',fontWeight:600}}>{files.length} FILE{files.length>1?'S':''}</span>
                  <span onClick={e=>{e.stopPropagation();ref.current.click();}} style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.4)',cursor:'pointer'}}>+ Add More</span>
                </div>
                {/* Scrollable file list — fixed height when > 5 files to prevent overflow */}
                <div style={{
                  display:'flex',flexDirection:'column',gap:5,
                  maxHeight: files.length > 5 ? 200 : 'none',
                  overflowY: files.length > 5 ? 'auto' : 'visible',
                  paddingRight: files.length > 5 ? 4 : 0,
                }}>
                  {files.map((file,i)=>(
                    <div key={i} className="file-chip-g">
                      <FileText size={12} color="rgba(255,255,255,0.5)"/>
                      <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'0.72rem'}}>{file.name}</span>
                      <button onClick={e=>{e.stopPropagation();setFiles(p=>p.filter((_,j)=>j!==i));}}
                        style={{background:'transparent',border:'none',cursor:'pointer',padding:2,display:'flex'}}>
                        <X size={11} color="rgba(255,80,80,0.8)"/>
                      </button>
                    </div>
                  ))}
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
            <span style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.22)',fontWeight:600}}>Customer Rank</span>
            <div style={{display:'flex',gap:4}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} type="button" onClick={()=>setF(p=>({...p,customerRank:n}))}
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
          <select className="glass-input" value={f.submittedBy} onChange={u('submittedBy')} style={{cursor:'pointer'}}>
            <option value="">— Select Requestor —</option>
            <optgroup label="Sales">
              {['SX985','SX417','SE628','SE842','SE519','SM386'].map(c=>(
                <option key={c} value={STAFF_NAMES[c]}>{STAFF_NAMES[c]}</option>
              ))}
            </optgroup>
            <optgroup label="Estimators">
              {['EX552','EX719','EX638','EX904','EX471','EX856','EX392','EX681','EX547','EX903','EX764'].map(c=>(
                <option key={c} value={STAFF_NAMES[c]}>{STAFF_NAMES[c]}</option>
              ))}
            </optgroup>
          </select>
          <select className="glass-input" value={f.salesPerson} onChange={u('salesPerson')} style={{cursor:'pointer'}}>
            <option value="">— Select Sales Person —</option>
            {['SX985','SX417','SE628','SE842','SE519','SM386'].map(c=>(
              <option key={c} value={STAFF_NAMES[c]}>{STAFF_NAMES[c]}</option>
            ))}
          </select>
        </div>
        <input className="glass-input" placeholder="Project" value={f.proj} onChange={u('proj')}/>
        <input className="glass-input" placeholder="Main Contractor" value={f.mainContractor} onChange={u('mainContractor')}/>
        <input className="glass-input" placeholder="Consultant" value={f.consultant} onChange={u('consultant')}/>
        <input className="glass-input" placeholder="Client / Grantor" value={f.client} onChange={u('client')}/>

        {/* Email + MOB + Tel — 3 columns */}
        <div className="three-col-row">
          <input className="glass-input" placeholder="Email ID" type="email" value={f.email} onChange={u('email')}/>
          <input className="glass-input" placeholder="MOB" value={f.mob} onChange={u('mob')}/>
          <input className="glass-input" placeholder="Tel" value={f.tel} onChange={u('tel')}/>
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
          <div className="date-field-wrap glass-input">
            <span className="date-field-lbl">Deliver Lead Time</span>
            <input type="month" className="date-inner" value={f.leadTime} onChange={u('leadTime')} style={{colorScheme:'dark'}}/>
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

        <button className="submit-glass" style={{flexShrink:0}} onClick={()=>onSubmit({...f,deal,docs:files.map(x=>x.name),docFiles:files})}>
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
      <button onClick={onBack}
        style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.16)',color:'rgba(255,255,255,0.80)',cursor:'pointer',fontSize:'0.80rem',fontFamily:F2,marginBottom:28,alignSelf:'flex-start',display:'flex',alignItems:'center',gap:7,padding:'7px 16px',borderRadius:50,backdropFilter:'blur(8px)',transition:'all 0.2s'}}
        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,0.32)';}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(255,255,255,0.80)';e.currentTarget.style.borderColor='rgba(255,255,255,0.16)';}}>
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
          style={{alignSelf:'flex-start',background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.22)',cursor:'pointer',color:'rgba(255,255,255,0.88)',fontFamily:F2,fontSize:'0.78rem',padding:'6px 14px',borderRadius:50,display:'flex',alignItems:'center',gap:6,marginBottom:20,backdropFilter:'blur(8px)',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.10)';e.currentTarget.style.color='rgba(255,255,255,0.88)';}}>
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
          onClick={async()=>{
            const revisedBy = document.getElementById('revisedByInput')?.value?.trim() || original.submittedBy;
            const docs = await readFilesToDocs(newFiles);
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
              docs,
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
            const docs = await readFilesToDocs(newFiles);
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
              docs,
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
                        : 'Request is in progress.'}
              </p>
              {canDownload && (
                <div className="dl-row">
                  <p className="dl-lbl">Click here to Download</p>
                  <button className="dl-btn" onClick={()=>req.estimationDoc?.data && downloadDoc(req.estimationDoc)} style={{cursor:req.estimationDoc?.data?'pointer':'default',opacity:req.estimationDoc?.data?1:0.55}}>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="5" fill="#C0392B"/><text x="16" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Arial">PDF</text></svg>
                    <span style={{fontWeight:600}}>PDF</span>
                  </button>
                  <button className="dl-btn" onClick={()=>req.estimationDoc?.data && downloadDoc(req.estimationDoc)} style={{cursor:req.estimationDoc?.data?'pointer':'default',opacity:req.estimationDoc?.data?1:0.55}}>
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
              {/* ── Attached submitted files — visible to all users ── */}
              {req.docs?.filter(d => d && typeof d === 'object' && (d.data || d.url)).length > 0 && (
                <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:8}}>
                  <p style={{fontSize:'0.60rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',margin:0}}>Attached Documents</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {req.docs.filter(d => d && typeof d === 'object' && (d.data || d.url)).map((d,i) => (
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
  'pending-director': {c:'rgba(180,130,255,0.95)',bg:'rgba(140,80,255,0.10)',   bd:'rgba(180,130,255,0.30)', label:'Cost-Artist Under Review'},
  completed:          {c:'#00cc77',               bg:'rgba(0,180,90,0.09)',     bd:'rgba(0,210,100,0.35)',   label:'Approved ✓'},
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
  const liveMs = !r.quotationSubmittedAt && r.taggedAt ? now - r.taggedAt
    : !r.taggedAt && r.submittedAt ? now - new Date(r.submittedAt).getTime()
    : null;

  const stages = [
    { label: 'Submitted',   color: 'rgba(120,180,255,0.90)', done: !!r.submittedAt,           tat: null, ts: r.submittedAt },
    { label: 'Assigned',    color: 'rgba(255,200,50,0.90)',  done: !!r.taggedAt,              tat: s1,   ts: r.taggedAt },
    { label: 'Quoted',      color: 'rgba(160,130,255,0.95)', done: !!r.quotationSubmittedAt,  tat: s2,   ts: r.quotationSubmittedAt },
    { label: 'Cost-Artist', color: 'rgba(0,220,180,0.90)',   done: !!r.directorRespondedAt,   tat: s3,   ts: r.directorRespondedAt },
  ];
  const dotSz = compact ? 8 : 10;
  return (
    <div style={{display:'flex',alignItems:'flex-start',width:'100%',fontFamily:F}}>
      {stages.map((st, i) => (
        <div key={i} style={{display:'contents'}}>
          {/* dot + label + timestamp */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1,flexShrink:0}}>
            <div style={{width:dotSz,height:dotSz,borderRadius:'50%',
              background:st.done?st.color:'rgba(255,255,255,0.14)',
              boxShadow:st.done?`0 0 8px ${st.color},0 0 18px ${st.color}55`:'none',
              border:st.done?`1.5px solid ${st.color}`:'1px solid rgba(255,255,255,0.24)',
              flexShrink:0,marginBottom:2}}/>
            <span style={{fontSize:compact?'0.52rem':'0.58rem',fontWeight:st.done?700:400,
              background:st.done?`linear-gradient(135deg,#fff 0%,${st.color} 100%)`:'none',
              WebkitBackgroundClip:st.done?'text':'unset',
              WebkitTextFillColor:st.done?'transparent':'unset',
              color:st.done?'unset':'rgba(255,255,255,0.28)',
              letterSpacing:'0.07em',whiteSpace:'nowrap'}}>{st.label}</span>
            {st.done && fdt(st.ts) && (
              <span style={{fontSize:compact?'0.42rem':'0.46rem',color:st.color,whiteSpace:'nowrap',fontFamily:'monospace',fontWeight:600,opacity:0.85,marginTop:1}}>{fdt(st.ts)}</span>
            )}
          </div>
          {/* flex-expanding connector + TAT duration */}
          {i < stages.length - 1 && (
            <div style={{flex:1,minWidth:18,display:'flex',flexDirection:'column',alignItems:'center',padding:'0 4px',paddingBottom:0,justifyContent:'flex-start',gap:1}}>
              {(() => {
                const segTat = stages[i+1].tat;
                const segColor = stages[i+1].color;
                const isLive = !segTat && (
                  (i === 0 && !r.taggedAt && liveMs) ||
                  (i === 1 && r.taggedAt && !r.quotationSubmittedAt && liveMs)
                );
                return (segTat || isLive) ? (
                  <span style={{fontSize:compact?'0.72rem':'0.80rem',color:segTat?segColor:'rgba(255,200,50,0.75)',fontFamily:'monospace',fontWeight:700,whiteSpace:'nowrap',letterSpacing:'0.04em',
                    textShadow:segTat?`0 0 8px ${segColor}80`:'0 0 8px rgba(255,200,50,0.40)',
                    marginBottom:2}}>
                    {segTat ? fms(segTat) : `${fms(liveMs)} ↻`}
                  </span>
                ) : (
                  <span style={{fontSize:'0.52rem',color:'rgba(255,255,255,0.16)',fontFamily:'monospace',marginBottom:2}}>—</span>
                );
              })()}
              <div style={{width:'100%',height:1.5,borderRadius:1,
                background:stages[i+1].done
                  ?`linear-gradient(90deg,${st.color}80,${stages[i+1].color}80)`
                  :st.done?`linear-gradient(90deg,${st.color}50,rgba(255,255,255,0.08))`
                  :'rgba(255,255,255,0.08)'}}/>
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
  if (r.reqStatus === 'completed' || r.reqStatus === 'onhold' || r.reqStatus === 'risky') return r.reqStatus;
  if (r.reqStatus === 'pending-director') return 'pending-director';
  if (r.taggedAt && (now - r.taggedAt) > TAT_MS) return 'overdue';
  return 'inprogress';
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  'Pending Estimation': 'rgba(220,165,0,0.85)',
  'Estimation Uploaded': 'rgba(99,102,241,0.9)',
  'Pending Approval': 'rgba(234,88,12,0.9)',
  'Approved': 'rgba(22,163,74,0.9)',
  'Completed': 'rgba(20,184,166,0.9)',
  'Out of Scope': 'rgba(220,60,60,0.85)',
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
  const [submitted, setSubmitted] = useState(false);

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
    const newStatus = action === 'approved' ? 'Approved' : action === 'rejected' ? 'Estimation Uploaded' : 'Pending Approval';
    const newReqStatus = action === 'approved' ? 'completed' : action === 'rejected' ? 'onhold' : 'inprogress';
    const dTs = new Date().toISOString();
    const tlEntry = { event: action==='approved'?'approved':action==='rejected'?'rejected':'revision', ts: dTs, label: action==='approved'?'Cost Artist Approved':action==='rejected'?'Cost Artist Rejected':'Revision Requested', by: 'Cost Artist' };
    onUpdate(idx, {revisedMargin, directorAction:action, directorNote:note, status:newStatus, reqStatus:newReqStatus,
      directorRespondedAt: dTs, timeline: [...(req.timeline||[]), tlEntry] });
    setSubmitted(true);
    setTimeout(() => onClose(), 1800);
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
            {/* Quotation files — only available after director approves */}
            <GC>
              {lbl('Quotation Files')}
              {(req.directorAction === 'approved' || req.reqStatus === 'completed') ? (
                <div style={{marginTop:7,padding:'7px 10px',borderRadius:7,background:'rgba(52,211,153,0.06)',border:'1px solid rgba(52,211,153,0.22)',display:'flex',alignItems:'center',gap:7}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(52,211,153,0.85)',flexShrink:0}}/>
                  <span style={{fontSize:'0.68rem',color:'rgba(52,211,153,0.85)',fontWeight:600}}>Quotation Approved — documents available above</span>
                </div>
              ) : (
                <div style={{marginTop:7,padding:'7px 10px',borderRadius:7,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:7}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,180,0,0.70)',flexShrink:0}}/>
                  <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.30)',fontStyle:'italic'}}>Available after Cost-Artist approval</span>
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

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ requests, onUpdate, onDelete, initialViewMode, onDirectTool }) => {
  const [open, setOpen] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(null);
  const [dsearch, setDsearch] = useState('');
  const [, setTick] = useState(0);
  const lockViewMode = !!initialViewMode; // hide view switcher when role is set externally
  const [viewMode, setViewMode] = useState(initialViewMode || 'requester'); // 'requester' | 'estimator' | 'director'
  const [requesterFilter, setRequesterFilter] = useState('');
  const [pinPrompt, setPinPrompt] = useState(null); // null | 'estimator' | 'director'
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);
  const [dirTab, setDirTab] = useState('history'); // 'history' | 'analysis'
  const [deleteConfirm, setDeleteConfirm] = useState(null); // realIdx to delete
  const [deleteCode, setDeleteCode] = useState('');          // must type 'xepa' to confirm
  const [convoInput, setConvoInput] = useState('');
  const [convoCollapsed, setConvoCollapsed] = useState(false);
  const [dirConvoOpen, setDirConvoOpen] = useState(true);   // Conversation panel expanded
  const [dirAiOpen, setDirAiOpen] = useState(true);         // AI Suggestions panel expanded
  const [dirEditMode, setDirEditMode] = useState(false);    // Cost-Artist editable fields

  const PIN = { estimator: 'EST', director: 'star' };
  const requestViewSwitch = (mode) => {
    if (mode === 'requester') { setViewMode('requester'); return; }
    setPinValue(''); setPinError(false); setPinPrompt(mode);
  };
  const confirmPin = () => {
    if (pinValue.trim().toUpperCase() === PIN[pinPrompt].toUpperCase()) { setViewMode(pinPrompt); setPinPrompt(null); }
    else { setPinError(true); setPinValue(''); }
  };
  const uploadRef = useRef();
  const dirDocUploadRef = useRef();
  const now = Date.now();

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const req = open !== null ? requests[open] : null;

  const handleEstimatorUpload = async e => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const newDocs = await readFilesToDocs(files);
    const existing = req.estimationDocs || (req.estimationDoc ? [req.estimationDoc] : []);
    const allDocs = [...existing, ...newDocs];
    onUpdate(open, {
      estimationFile: allDocs[allDocs.length - 1].name,
      estimationDoc: allDocs[allDocs.length - 1],
      estimationDocs: allDocs,
      status: 'Pending Approval',
    });
    e.target.value = '';
  };

  // ── Detail view ──
  if (open !== null && req) {
    const rs = getReqStatus(req, now);
    const rss = REQ_STATUS_STYLE[rs];


    const tatElapsedDash = req.taggedAt ? now - req.taggedAt : 0;
    const tatPctDash = Math.min(100, (tatElapsedDash / TAT_MS) * 100);
    const tatBarColor = tatPctDash >= 100 ? '#ff4d4d' : tatPctDash >= 75 ? '#ff7a30' : tatPctDash >= 50 ? '#ffb347' : '#00e5ff';
    const tagDate = req.taggedAt ? new Date(req.taggedAt).toLocaleString('en-AE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
    const canSendToDirector = (req.estimationFile || (req.estimationDocs && req.estimationDocs.length > 0)) && req.reqStatus !== 'pending-director' && req.reqStatus !== 'completed';
    const DL = (t) => <div style={{fontSize:'0.55rem',color:'rgba(0,220,255,0.38)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:5,fontWeight:600}}>{t}</div>;
    const DV = (v,c='rgba(255,255,255,0.85)') => <div style={{fontSize:'0.82rem',fontWeight:600,color:c,lineHeight:1.4}}>{v||'—'}</div>;
    const GCard = ({children,accent='rgba(255,255,255,0.05)',border='rgba(255,255,255,0.09)',style:sx={}}) => (
      <div style={{background:accent,border:`1px solid ${border}`,borderRadius:10,padding:'12px 16px',backdropFilter:'blur(10px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)',...sx}}>{children}</div>
    );
    const F2 = "'Inter',sans-serif";

    const rankLabels = ['','Bronze','Silver','Gold','Platinum','Diamond'];
    const infoRows = [['ID',req.id],['Submitted By',req.submittedBy||'—'],['Sales Person',req.salesPerson||'—'],['Project',req.proj||'—'],['Client / Grantor',req.client||'—'],['Customer Rank',req.customerRank>0?rankLabels[req.customerRank]+' ('+req.customerRank+'★)':'—'],['Main Contractor',req.mainContractor||'—'],['Consultant',req.consultant||'—'],['Deal Type',req.deal],['Email',req.email||'—'],['MOB',req.mob||'—'],['Tel',req.tel||'—'],['Lead Time',req.leadTime||'—'],['Address',req.address||'—'],['Remarks',req.remarks||'—'],['Submitted',req.date]];

    return (
      <div className="dash-detail-wrap" style={{position:'relative',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'0 36px 20px',overflowY:viewMode==='director'?'hidden':'auto',animation:'fadeUp 0.4s ease both',background:'rgba(255,255,255,0.025)',backdropFilter:'blur(20px) saturate(1.4)',WebkitBackdropFilter:'blur(20px) saturate(1.4)',borderRadius:16,boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,0,0.40)'}}>

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
          <DirectorReviewModal req={requests[reviewIdx]} idx={reviewIdx} now={now} onUpdate={onUpdate} onClose={()=>setReviewIdx(null)}/>
        )}
        {/* ── Sticky sub-nav header ── */}
        <div style={{
          position:'sticky', top:0, zIndex:50,
          margin:'0 -36px 16px',
          padding:'10px 36px',
          background:'rgba(6,2,20,0.92)',
          backdropFilter:'blur(18px)',
          WebkitBackdropFilter:'blur(18px)',
          borderBottom:`1px solid ${rss.bd}`,
          display:'flex', alignItems:'center', gap:14,
        }}>
          {/* Back */}
          <button onClick={()=>setOpen(null)} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:'0.78rem',fontFamily:F2,display:'flex',alignItems:'center',gap:6,flexShrink:0,padding:'4px 0'}}>
            ← All Requests
          </button>
          <div style={{width:1,height:22,background:'rgba(255,255,255,0.10)',flexShrink:0}}/>
          {/* Request ID + type badge */}
          <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div>
              <div style={{fontSize:'0.48rem',color:'rgba(255,255,255,0.26)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:1}}>Request ID</div>
              <div style={{fontSize:'0.88rem',fontWeight:700,color:'rgba(220,165,0,0.90)',fontFamily:'monospace'}}>{req.id}</div>
            </div>
            {(req.requestType==='revised'||req.requestType==='finalPrice') && (
              <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:50,
                background:req.requestType==='finalPrice'?'rgba(16,185,129,0.12)':'rgba(0,150,255,0.12)',
                border:req.requestType==='finalPrice'?'1px solid rgba(52,211,153,0.32)':'1px solid rgba(0,180,255,0.32)'}}>
                <span style={{width:5,height:5,borderRadius:'50%',background:req.requestType==='finalPrice'?'rgba(52,211,153,0.9)':'rgba(0,200,255,0.9)',flexShrink:0}}/>
                <span style={{fontSize:'0.54rem',fontWeight:700,letterSpacing:'0.10em',color:req.requestType==='finalPrice'?'rgba(52,211,153,0.95)':'rgba(0,200,255,0.90)',textTransform:'uppercase'}}>
                  {req.requestType==='finalPrice'?'Final Price':'Revised'}
                </span>
                {req.originalId && <span style={{fontSize:'0.54rem',color:'rgba(255,255,255,0.28)'}}>ref: {req.originalId}</span>}
              </div>
            )}
          </div>
          {/* Customer rank + Director action */}
          {req.customerRank > 0 && (() => {
            const rc=['','rgba(205,127,50,0.95)','rgba(180,180,200,0.95)','rgba(255,200,0,0.95)','rgba(100,220,255,0.95)','rgba(200,130,255,0.95)'][req.customerRank];
            return <div style={{display:'flex',gap:2,alignItems:'center',flexShrink:0}}>{[1,2,3,4,5].map(n=>(<span key={n} style={{fontSize:'0.70rem',color:req.customerRank>=n?rc:'rgba(255,255,255,0.10)',filter:req.customerRank>=n?`drop-shadow(0 0 4px ${rc})`:'none'}}>★</span>))}</div>;
          })()}
          {req.directorAction && (
            <span style={{fontSize:'0.72rem',fontWeight:700,flexShrink:0,color:req.directorAction==='approved'?'#00cc77':req.directorAction==='rejected'?'#dd3535':'rgba(120,180,255,0.90)'}}>
              {req.directorAction.charAt(0).toUpperCase()+req.directorAction.slice(1)}
            </span>
          )}
          {/* Estimator + Sales avatars */}
          {(req.estimator || req.salesPerson) && (
            <div style={{display:'flex',gap:10,alignItems:'center',flexShrink:0,paddingRight:14,borderRight:'1px solid rgba(255,255,255,0.08)'}}>
              {req.estimator && (
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <EstAvatar name={req.estimator} size={26}/>
                  <div>
                    <div style={{fontSize:'0.46rem',color:'rgba(99,200,255,0.50)',letterSpacing:'0.10em',textTransform:'uppercase',fontWeight:700}}>Estimator</div>
                    <div style={{fontSize:'0.70rem',fontWeight:600,color:'rgba(255,255,255,0.76)'}}>{req.estimator}</div>
                  </div>
                </div>
              )}
              {req.salesPerson && (
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <EstAvatar name={req.salesPerson} size={26}/>
                  <div>
                    <div style={{fontSize:'0.46rem',color:'rgba(160,130,255,0.50)',letterSpacing:'0.10em',textTransform:'uppercase',fontWeight:700}}>Sales</div>
                    <div style={{fontSize:'0.70rem',fontWeight:600,color:'rgba(255,255,255,0.76)'}}>{req.salesPerson}</div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Timeline — fills space between Sales and Status */}
          {(viewMode === 'estimator' || viewMode === 'director') ? (
            <div style={{flex:1,minWidth:0,paddingLeft:10,paddingRight:10}}>
              <div style={{fontSize:'0.46rem',letterSpacing:'0.16em',textTransform:'uppercase',
                background:'linear-gradient(90deg,rgba(255,255,255,0.90) 0%,rgba(100,200,255,0.80) 100%)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                marginBottom:3,fontWeight:700}}>Request Timeline</div>
              <TATTimeline r={req} compact={viewMode !== 'director'}/>
            </div>
          ) : (
            <div style={{flex:1}}/>
          )}
          {/* Right: Delete (director only) + Status badge */}
          <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            {viewMode === 'director' && (
              <button onClick={()=>setDeleteConfirm(open)} title="Delete this request"
                style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:50,background:'rgba(220,50,50,0.10)',border:'1px solid rgba(220,50,50,0.30)',color:'rgba(220,80,80,0.80)',fontFamily:F2,fontSize:'0.70rem',fontWeight:700,cursor:'pointer',outline:'none'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.22)';e.currentTarget.style.color='rgba(255,100,100,1)';e.currentTarget.style.borderColor='rgba(220,60,60,0.55)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.10)';e.currentTarget.style.color='rgba(220,80,80,0.80)';e.currentTarget.style.borderColor='rgba(220,50,50,0.30)';}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                Delete
              </button>
            )}
            <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,0.04)',border:`1px solid ${rss.bd}`,borderRadius:50,padding:'5px 14px 5px 10px'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:rss.c,flexShrink:0,boxShadow:`0 0 7px ${rss.c}`}}/>
              <div>
                <div style={{fontSize:'0.46rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:1}}>Request Status</div>
                <div style={{fontSize:'0.82rem',fontWeight:700,color:rss.c,lineHeight:1}}>{rss.label}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* REQUESTER & ESTIMATOR: 2-col layout                                   */}
        {/* DIRECTOR: full-width single layout                                     */}
        {/* ══════════════════════════════════════════════════════════════════════ */}

        {viewMode !== 'director' && (
          <div className="dash-2col" style={{display:'grid',gridTemplateColumns:viewMode==='estimator'?(convoCollapsed?'380px 1fr 44px':'380px 1fr 420px'):'1fr 1fr',gap:20,maxWidth:'100%',width:'100%'}}>
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
                {(req.status==='Approved'||req.status==='Completed') ? (
                  <div style={{background:'rgba(0,40,20,0.50)',border:'1px solid rgba(0,200,100,0.28)',borderRadius:10,padding:'20px 22px'}}>
                    <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,200,100,0.60)',marginBottom:12}}>Download Quotation</p>
                    <div style={{display:'flex',gap:10}}>
                      <button onClick={()=>req.estimationDoc?.data && downloadDoc(req.estimationDoc)} style={{...btnStyle,flex:1,color:'rgba(255,120,100,0.90)',border:'1px solid rgba(200,60,40,0.35)',background:'rgba(200,50,40,0.10)',cursor:req.estimationDoc?.data?'pointer':'default',opacity:req.estimationDoc?.data?1:0.5}}>↓ PDF</button>
                      <button onClick={()=>req.estimationDoc?.data && downloadDoc(req.estimationDoc)} style={{...btnStyle,flex:1,color:'rgba(60,220,130,0.90)',border:'1px solid rgba(0,180,80,0.35)',background:'rgba(0,160,70,0.10)',cursor:req.estimationDoc?.data?'pointer':'default',opacity:req.estimationDoc?.data?1:0.5}}>↓ Excel</button>
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
                      onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!convoInput.trim())return;const ts=new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});onUpdate(open,{conversation:[...(req.conversation||[]),{from:req.salesPerson||'Sales',role:'sales',text:convoInput.trim(),ts,tsMs:Date.now()}]});setConvoInput('');}}}
                      placeholder="Type a message… (Enter to send)"
                      rows={2}
                      style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(168,85,247,0.28)',borderRadius:10,padding:'10px 13px',color:'#e2e8f0',fontFamily:F2,fontSize:'0.86rem',outline:'none',resize:'none',lineHeight:1.5}}
                    />
                    <button onClick={()=>{if(!convoInput.trim())return;const ts=new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});onUpdate(open,{conversation:[...(req.conversation||[]),{from:req.salesPerson||'Sales',role:'sales',text:convoInput.trim(),ts,tsMs:Date.now()}]});setConvoInput('');}}
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
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {/* Attached docs — each downloadable */}
                    {req.docs?.length > 0 ? (
                      <div style={{display:'flex',flexDirection:'column',gap:5}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:3}}>
                          <p style={{fontSize:'0.52rem',letterSpacing:'0.13em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',margin:0}}>Attached Documents ({req.docs.length})</p>
                          {req.docs.length > 1 && (
                            <button onClick={()=>req.docs.forEach(d=>downloadDoc(d))}
                              style={{...btnStyle,padding:'3px 10px',fontSize:'0.62rem',color:'rgba(52,211,153,0.90)',border:'1px solid rgba(52,211,153,0.30)',background:'rgba(52,211,153,0.08)',fontWeight:700,flexShrink:0}}>
                              ↓ Download All
                            </button>
                          )}
                        </div>
                        {/* Scrollable when > 5 docs */}
                        <div style={{
                          display:'flex',flexDirection:'column',gap:4,
                          maxHeight: req.docs.length > 5 ? 160 : 'none',
                          overflowY: req.docs.length > 5 ? 'auto' : 'visible',
                          paddingRight: req.docs.length > 5 ? 2 : 0,
                        }}>
                          {req.docs.map((d,i)=>(
                            <button key={i} onClick={()=>downloadDoc(d)}
                              style={{...btnStyle,textAlign:'left',justifyContent:'flex-start',gap:7,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              {docName(d)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button style={{...btnStyle,opacity:0.45,cursor:'default'}}>↓ No Documents Attached</button>
                    )}
                    <input type="file" ref={uploadRef} style={{display:'none'}} multiple onChange={handleEstimatorUpload}/>
                    {/* Uploaded quotation files list */}
                    {(() => {
                      const eDocs = req.estimationDocs || (req.estimationDoc ? [req.estimationDoc] : []);
                      if (!eDocs.length) return null;
                      return (
                        <div style={{display:'flex',flexDirection:'column',gap:3}}>
                          <div style={{fontSize:'0.50rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(52,211,153,0.45)',marginBottom:1}}>
                            Uploaded ({eDocs.length} file{eDocs.length>1?'s':''})
                          </div>
                          {eDocs.map((d,i)=>(
                            <button key={i} onClick={()=>downloadDoc(d)}
                              style={{...btnStyle,textAlign:'left',justifyContent:'flex-start',gap:7,fontSize:'0.72rem',color:'rgba(52,211,153,0.90)',border:'1px solid rgba(52,211,153,0.28)',background:'rgba(52,211,153,0.06)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              {d.name||`file-${i+1}`}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                    <button onClick={()=>uploadRef.current.click()}
                      disabled={req.status!=='Pending Estimation'&&req.status!=='Estimation Uploaded'&&req.reqStatus!=='inprogress'}
                      style={{...btnStyle,opacity:1,cursor:'pointer',color:'rgba(255,210,60,0.95)',border:'1px solid rgba(255,200,40,0.40)',background:'rgba(255,180,0,0.10)',fontWeight:700}}>
                      ↑ {(req.estimationDocs?.length||0)>0?'Add More Files':'Upload Quotation'}
                    </button>
                  </div>
                  {/* ── Margin breakdown ── */}
                  <div style={{background:'rgba(0,10,30,0.60)',border:'1px solid rgba(0,200,255,0.22)',borderRadius:8,padding:'12px 14px',marginTop:4}}>
                    <style>{`input[type=number].no-spin::-webkit-inner-spin-button,input[type=number].no-spin::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number].no-spin{-moz-appearance:textfield}`}</style>
                    <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,200,255,0.45)',marginBottom:10}}>Margin Breakdown</p>

                    {/* 4 sub-fields row */}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:0,borderBottom:'1px solid rgba(0,200,255,0.10)',paddingBottom:10,marginBottom:10}}>
                      {/* Overhead % */}
                      <div style={{borderRight:'1px solid rgba(0,200,255,0.10)',paddingRight:10}}>
                        <p style={{fontSize:'0.50rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(0,200,255,0.38)',marginBottom:5}}>Overhead %</p>
                        <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                          <input className="no-spin" type="number" value={req.overhead||''} onChange={e=>{const oh=e.target.value;onUpdate(open,{overhead:oh,margin:(parseFloat(oh||0)+parseFloat(req.profit||0)+parseFloat(req.warrantyPct||0)).toFixed(1)});}} placeholder="0" min="0" max="100" step="0.5"
                            style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,210,255,0.92)',fontFamily:'monospace',fontSize:'1.15rem',fontWeight:700,width:'100%'}}/>
                          <span style={{fontSize:'0.70rem',color:'rgba(0,200,255,0.40)',fontFamily:'monospace'}}>%</span>
                        </div>
                      </div>
                      {/* Profit % */}
                      <div style={{borderRight:'1px solid rgba(0,200,255,0.10)',paddingLeft:10,paddingRight:10}}>
                        <p style={{fontSize:'0.50rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(0,200,255,0.38)',marginBottom:5}}>Profit %</p>
                        <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                          <input className="no-spin" type="number" value={req.profit||''} onChange={e=>{const pr=e.target.value;onUpdate(open,{profit:pr,margin:(parseFloat(req.overhead||0)+parseFloat(pr||0)+parseFloat(req.warrantyPct||0)).toFixed(1)});}} placeholder="0" min="0" max="100" step="0.5"
                            style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,210,255,0.92)',fontFamily:'monospace',fontSize:'1.15rem',fontWeight:700,width:'100%'}}/>
                          <span style={{fontSize:'0.70rem',color:'rgba(0,200,255,0.40)',fontFamily:'monospace'}}>%</span>
                        </div>
                      </div>
                      {/* Warranty: yr | % */}
                      <div style={{borderRight:'1px solid rgba(0,200,255,0.10)',paddingLeft:10,paddingRight:10}}>
                        <p style={{fontSize:'0.50rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(0,200,255,0.38)',marginBottom:5}}>Warranty</p>
                        <div style={{display:'flex',alignItems:'baseline',gap:4}}>
                          <input className="no-spin" type="number" value={req.warrantyYr||''} onChange={e=>onUpdate(open,{warrantyYr:e.target.value})} placeholder="0" min="0" max="20" step="1"
                            style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,210,255,0.92)',fontFamily:'monospace',fontSize:'1.15rem',fontWeight:700,width:'36px'}}/>
                          <span style={{fontSize:'0.60rem',color:'rgba(0,200,255,0.35)',fontFamily:'monospace'}}>yr</span>
                          <span style={{fontSize:'0.60rem',color:'rgba(0,200,255,0.20)',fontFamily:'monospace'}}>|</span>
                          <input className="no-spin" type="number" value={req.warrantyPct||''} onChange={e=>{const wp=e.target.value;onUpdate(open,{warrantyPct:wp,margin:(parseFloat(req.overhead||0)+parseFloat(req.profit||0)+parseFloat(wp||0)).toFixed(1)});}} placeholder="0" min="0" max="50" step="0.5"
                            style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,210,255,0.92)',fontFamily:'monospace',fontSize:'1.15rem',fontWeight:700,width:'36px'}}/>
                          <span style={{fontSize:'0.70rem',color:'rgba(0,200,255,0.40)',fontFamily:'monospace'}}>%</span>
                        </div>
                      </div>
                      {/* Total */}
                      <div style={{paddingLeft:10}}>
                        <p style={{fontSize:'0.50rem',letterSpacing:'0.10em',textTransform:'uppercase',color:'rgba(0,200,255,0.38)',marginBottom:5}}>Total</p>
                        <span style={{fontFamily:'monospace',fontSize:'1.55rem',fontWeight:800,color:'rgba(0,210,255,0.95)',lineHeight:1}}>
                          {(() => { const t=(parseFloat(req.overhead||0)+parseFloat(req.profit||0)+parseFloat(req.warrantyPct||0)).toFixed(1); return t==='0.0'?'—':t+'%'; })()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Project Value */}
                  <div style={{background:'rgba(0,10,30,0.60)',border:'1px solid rgba(0,200,120,0.22)',borderRadius:8,padding:'10px 12px'}}>
                    <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,200,120,0.45)',marginBottom:6}}>Project Value (AED)</p>
                    <input type="number" value={req.projValue||''} onChange={e=>onUpdate(open,{projValue:e.target.value})} placeholder="0.00" min="0"
                      style={{background:'transparent',border:'none',outline:'none',color:'rgba(0,230,140,0.90)',fontFamily:'monospace',fontSize:'1.1rem',fontWeight:700,width:'100%'}}/>
                  </div>
                  {/* Estimator Comments */}
                  <div style={{background:'rgba(0,10,30,0.60)',border:'1px solid rgba(255,200,80,0.22)',borderRadius:8,padding:'10px 12px'}}>
                    <p style={{fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,200,80,0.45)',marginBottom:6}}>Estimator Comments</p>
                    <textarea value={req.estimatorComments||''} onChange={e=>onUpdate(open,{estimatorComments:e.target.value})} placeholder="Add comments, notes or scope clarifications…" rows={3}
                      style={{background:'transparent',border:'none',outline:'none',color:'rgba(255,230,140,0.88)',fontFamily:F2,fontSize:'0.84rem',fontWeight:400,width:'100%',resize:'vertical',lineHeight:1.55}}/>
                  </div>
                  {/* ── Submit to Director — inside card, below comments ── */}
                  {req.reqStatus === 'pending-director' ? (
                    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(140,80,255,0.08)',border:'1px solid rgba(180,130,255,0.25)',borderRadius:8}}>
                      <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(180,130,255,0.95)',boxShadow:'0 0 8px rgba(180,130,255,0.7)',flexShrink:0}}/>
                      <span style={{fontSize:'0.80rem',color:'rgba(180,130,255,0.90)',fontWeight:600}}>Submitted — Awaiting Cost-Artist Review</span>
                    </div>
                  ) : req.outOfScopeSubmitted ? (
                    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(220,60,60,0.08)',border:'1px solid rgba(220,60,60,0.28)',borderRadius:8}}>
                      <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(255,90,90,0.95)',boxShadow:'0 0 8px rgba(255,80,80,0.7)',flexShrink:0}}/>
                      <span style={{fontSize:'0.80rem',color:'rgba(255,110,110,0.90)',fontWeight:600}}>Out of Scope — Notified to Sales</span>
                    </div>
                  ) : (
                    <button onClick={()=>{if(canSendToDirector){const ts=new Date().toISOString();onUpdate(open,{status:'Pending Approval',reqStatus:'pending-director',directorAction:null,directorNote:'',quotationSubmittedAt:ts,timeline:[...(req.timeline||[]),{event:'quoted',ts,label:'Quotation Submitted',by:req.estimator||''}]});}}}
                      disabled={!canSendToDirector}
                      style={{width:'100%',padding:'11px 0',borderRadius:100,background:canSendToDirector?'linear-gradient(105deg,#0f0c3a,#1e40af 30%,#6d28d9 55%,#a855f7 75%,#00e5ff 100%)':'rgba(255,255,255,0.04)',backgroundSize:'220% 220%',animation:canSendToDirector?'auroraShift 5s ease-in-out infinite':'none',border:canSendToDirector?'1px solid rgba(0,220,255,0.25)':'1px solid rgba(255,255,255,0.07)',color:canSendToDirector?'#fff':'rgba(255,255,255,0.22)',fontFamily:F2,fontSize:'0.88rem',fontWeight:700,cursor:canSendToDirector?'pointer':'not-allowed',letterSpacing:'0.06em',boxShadow:canSendToDirector?'0 4px 22px rgba(0,140,255,0.28)':'none',outline:'none'}}>
                      ✦ Submit to Cost-Artist for Approval
                    </button>
                  )}

                  {/* ── A: Out of Scope / Reject  |  B: Justification ── */}
                  {!req.outOfScopeSubmitted && req.reqStatus !== 'pending-director' && (
                    <div style={{display:'flex',gap:8,marginTop:2}}>
                      {/* A — Out of Scope button */}
                      <div style={{flexShrink:0,display:'flex',flexDirection:'column',gap:6,minWidth:160}}>
                        <div style={{fontSize:'0.44rem',color:'rgba(255,100,100,0.40)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600}}>A · Out of Scope</div>
                        {req.outOfScope ? (
                          <div style={{display:'flex',flexDirection:'column',gap:5}}>
                            <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:8,background:'rgba(220,50,50,0.15)',border:'1px solid rgba(220,60,60,0.45)'}}>
                              <span style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,90,90,0.95)',boxShadow:'0 0 6px rgba(255,80,80,0.7)',flexShrink:0}}/>
                              <span style={{fontSize:'0.76rem',color:'rgba(255,110,110,0.90)',fontWeight:700}}>Out of Scope</span>
                            </div>
                            <button onClick={()=>onUpdate(open,{outOfScope:false,outOfScopeReason:''})}
                              style={{padding:'4px 0',borderRadius:6,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',color:'rgba(255,255,255,0.35)',fontFamily:F2,fontSize:'0.68rem',cursor:'pointer',outline:'none'}}>
                              ✕ Cancel
                            </button>
                            <button
                              disabled={!(req.outOfScopeReason||'').trim()}
                              onClick={()=>{if((req.outOfScopeReason||'').trim()){const ts=new Date().toISOString();onUpdate(open,{outOfScopeSubmitted:true,status:'Out of Scope',reqStatus:'onhold',timeline:[...(req.timeline||[]),{event:'outofscope',ts,label:'Marked Out of Scope',by:req.estimator||''}]});}}}
                              style={{padding:'7px 0',borderRadius:8,background:(req.outOfScopeReason||'').trim()?'rgba(220,50,50,0.18)':'rgba(255,255,255,0.03)',border:`1px solid ${(req.outOfScopeReason||'').trim()?'rgba(220,60,60,0.50)':'rgba(255,255,255,0.08)'}`,color:(req.outOfScopeReason||'').trim()?'rgba(255,100,100,0.95)':'rgba(255,255,255,0.20)',fontFamily:F2,fontSize:'0.76rem',fontWeight:700,cursor:(req.outOfScopeReason||'').trim()?'pointer':'not-allowed',outline:'none',transition:'all 0.15s'}}>
                              ⊘ Submit Out of Scope
                            </button>
                          </div>
                        ) : (
                          <button onClick={()=>onUpdate(open,{outOfScope:true})}
                            style={{padding:'9px 14px',borderRadius:8,background:'rgba(220,50,50,0.08)',border:'1px solid rgba(220,60,60,0.28)',color:'rgba(255,100,100,0.70)',fontFamily:F2,fontSize:'0.78rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'all 0.15s',textAlign:'left',display:'flex',alignItems:'center',gap:7}}
                            onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,50,50,0.18)';e.currentTarget.style.borderColor='rgba(220,60,60,0.50)';e.currentTarget.style.color='rgba(255,110,110,0.95)';}}
                            onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,50,50,0.08)';e.currentTarget.style.borderColor='rgba(220,60,60,0.28)';e.currentTarget.style.color='rgba(255,100,100,0.70)';}}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            Out of Scope / Reject
                          </button>
                        )}
                      </div>
                      {/* B — Justification / Reason */}
                      <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
                        <div style={{fontSize:'0.44rem',color:req.outOfScope?'rgba(255,100,100,0.55)':'rgba(255,255,255,0.22)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,transition:'color 0.2s'}}>B · Justification / Reason</div>
                        <textarea
                          value={req.outOfScopeReason||''}
                          onChange={e=>onUpdate(open,{outOfScopeReason:e.target.value})}
                          disabled={!req.outOfScope}
                          placeholder={req.outOfScope ? "Provide reason or justification for Out of Scope…" : "Select 'Out of Scope' to enter reason"}
                          rows={4}
                          style={{flex:1,width:'100%',background:req.outOfScope?'rgba(220,50,50,0.07)':'rgba(255,255,255,0.02)',border:`1px solid ${req.outOfScope?'rgba(220,60,60,0.35)':'rgba(255,255,255,0.07)'}`,borderRadius:8,color:req.outOfScope?'rgba(255,200,200,0.88)':'rgba(255,255,255,0.25)',fontFamily:F2,fontSize:'0.82rem',padding:'9px 12px',outline:'none',resize:'vertical',boxSizing:'border-box',lineHeight:1.55,cursor:req.outOfScope?'text':'not-allowed',transition:'all 0.2s'}}
                          onFocus={e=>{if(req.outOfScope)e.target.style.borderColor='rgba(255,80,80,0.55)';}}
                          onBlur={e=>{if(req.outOfScope)e.target.style.borderColor='rgba(220,60,60,0.35)';}}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Director's Remarks — shown after Submit button */}
                {req.directorAction && (
                  (() => {
                    const isApproved = req.directorAction === 'approved' || req.reqStatus === 'completed';
                    const isRejected = req.directorAction === 'rejected';
                    const cfg = isApproved
                      ? {bg:'rgba(0,200,100,0.06)',bd:'rgba(0,200,100,0.22)',dot:'rgba(0,220,120,0.90)',statusLabel:'Approved',statusSub:'Submitted to Sales / Requester & Estimator'}
                      : isRejected
                      ? {bg:'rgba(220,60,60,0.06)',bd:'rgba(220,60,60,0.24)',dot:'rgba(255,90,90,0.95)',statusLabel:'Rejected',statusSub:'Please redo the estimation'}
                      : {bg:'rgba(255,160,40,0.06)',bd:'rgba(255,160,40,0.24)',dot:'rgba(255,180,60,0.95)',statusLabel:'Revision Required',statusSub:'Please revise and resubmit'};
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
            {viewMode === 'estimator' && (
              convoCollapsed ? (
                /* Minimized strip */
                <div style={{background:'rgba(109,40,217,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:14,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',padding:'14px 0',position:'sticky',top:62,height:'100%',minHeight:200,cursor:'pointer'}} onClick={()=>setConvoCollapsed(false)}>
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
                <div style={{background:'rgba(109,40,217,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:14,padding:'18px 18px 14px',display:'flex',flexDirection:'column',gap:12,height:'100%',minHeight:560,position:'sticky',top:62}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,paddingBottom:10,borderBottom:'1px solid rgba(168,85,247,0.18)'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(168,85,247,0.90)',boxShadow:'0 0 8px rgba(168,85,247,0.70)',flexShrink:0}}/>
                    <p style={{fontSize:'0.60rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(168,85,247,0.85)',margin:0,fontWeight:700}}>Conversation</p>
                    {req.salesPerson && <span style={{fontSize:'0.65rem',color:'rgba(160,130,255,0.60)',fontWeight:500}}>with {req.salesPerson}</span>}
                    <button onClick={()=>setConvoCollapsed(true)} title="Minimize conversation"
                      style={{marginLeft:'auto',width:26,height:26,borderRadius:7,background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.28)',color:'rgba(168,85,247,0.80)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',outline:'none',flexShrink:0}}>
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
                          onUpdate(open,{conversation:[...(req.conversation||[]),{from:req.estimator||'Estimator',role:'estimator',text:convoInput.trim(),ts,tsMs:Date.now()}]});
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
                      onUpdate(open,{conversation:[...(req.conversation||[]),{from:req.estimator||'Estimator',role:'estimator',text:convoInput.trim(),ts,tsMs:Date.now()}]});
                      setConvoInput('');
                    }}
                      style={{width:42,height:42,borderRadius:10,flexShrink:0,background:'rgba(109,40,217,0.55)',border:'1px solid rgba(168,85,247,0.50)',color:'#e2d9ff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',alignSelf:'flex-end'}}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ── DIRECTOR view: 3-panel layout ── */}
        {viewMode === 'director' && (() => {
          const GLASSY = 'linear-gradient(135deg,rgba(255,255,255,1) 0%,rgba(255,255,255,0.88) 40%,rgba(255,255,255,0.72) 60%,rgba(255,255,255,0.96) 100%)';
          const DA = [{v:'approved',label:'Approve ✓',c:'#00e5b0',bg:'rgba(0,229,176,0.10)',bd:'rgba(0,229,176,0.38)'},{v:'revised',label:'Revise',c:'rgba(120,180,255,0.95)',bg:'rgba(80,140,255,0.10)',bd:'rgba(120,180,255,0.40)'},{v:'rejected',label:'Reject ✗',c:'rgba(255,90,90,0.95)',bg:'rgba(215,45,45,0.10)',bd:'rgba(215,55,55,0.40)'}];
          const histReqs = requests.filter(r => r.id !== req.id && (r.client === req.client || r.proj === req.proj));
          const DlIco = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
          const inpStyle = {width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:6,color:'rgba(255,255,255,0.92)',fontFamily:F2,fontSize:'0.80rem',padding:'4px 8px',outline:'none',boxSizing:'border-box',fontWeight:500};

          return (
            <div style={{display:'flex',flexDirection:'column',flex:1,minHeight:0,overflow:'hidden'}}>

              {/* ═══ MAIN 3-COLUMN CONTENT ═══ */}
              <div style={{display:'flex',gap:10,flex:1,minHeight:0,overflow:'hidden'}}>

                {/* ═══ LEFT: Project Info + Decision Controls ═══ */}
                <div style={{width:'30%',minWidth:230,display:'flex',flexDirection:'column',gap:8,overflow:'hidden'}}>

                  {/* Project info — scrollable */}
                  <div style={{flex:1,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.08) transparent',paddingRight:2}}>
                    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:12,padding:'13px 14px',backdropFilter:'blur(20px)'}}>

                      {/* Header: name + Edit toggle */}
                      <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:10}}>
                        <div style={{width:3,height:28,borderRadius:2,background:'linear-gradient(180deg,rgba(255,255,255,0.70),rgba(255,255,255,0.06))',flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:'0.42rem',color:'rgba(255,255,255,0.26)',letterSpacing:'0.16em',textTransform:'uppercase',fontWeight:600,marginBottom:2}}>Project Brief</div>
                          {dirEditMode ? (
                            <input value={req.proj||''} onChange={e=>onUpdate(open,{proj:e.target.value})} style={{...inpStyle,fontSize:'0.90rem',fontWeight:800}} placeholder="Project name"/>
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
                      <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
                        <span style={{fontSize:'0.60rem',fontWeight:600,color:'rgba(255,255,255,0.70)',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:20,padding:'2px 8px'}}>{req.deal}</span>
                        {req.supplyOnly && <span style={{fontSize:'0.60rem',fontWeight:600,color:'rgba(0,200,255,0.85)',background:'rgba(0,200,255,0.08)',border:'1px solid rgba(0,200,255,0.20)',borderRadius:20,padding:'2px 8px'}}>Supply Only</span>}
                        {req.supplyInstall && <span style={{fontSize:'0.60rem',fontWeight:600,color:'rgba(160,100,255,0.85)',background:'rgba(140,80,255,0.08)',border:'1px solid rgba(160,100,255,0.20)',borderRadius:20,padding:'2px 8px'}}>S + I</span>}
                      </div>

                      {/* Margin + Value */}
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10,paddingBottom:10,borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                        <div style={{background:'rgba(0,200,255,0.05)',border:'1px solid rgba(0,200,255,0.16)',borderRadius:7,padding:'7px 10px'}}>
                          <div style={{fontSize:'0.42rem',color:'rgba(0,200,255,0.50)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:3}}>Margin</div>
                          <div style={{display:'flex',alignItems:'baseline',gap:1}}>
                            <span style={{fontSize:'1.1rem',fontWeight:900,fontFamily:'monospace',background:'linear-gradient(135deg,rgba(0,230,255,1) 0%,rgba(100,180,255,0.85) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1}}>{req.margin||'—'}</span>
                            {req.margin && <span style={{fontSize:'0.68rem',color:'rgba(0,200,255,0.50)',fontFamily:'monospace'}}>%</span>}
                          </div>
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
                      {[['Client / Grantor','client',req.client],['Main Contractor','mainContractor',req.mainContractor],['Consultant','consultant',req.consultant],['Submitted By','submittedBy',req.submittedBy],['Lead Time','leadTime',req.leadTime],['Address','address',req.address]].filter(([,,v])=>v||dirEditMode).map(([k,field,v])=>(
                        <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'5px 0',gap:8,alignItems:'center'}}>
                          <span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.30)',flexShrink:0}}>{k}</span>
                          {dirEditMode ? (
                            <input value={v||''} onChange={e=>onUpdate(open,{[field]:e.target.value})} style={{...inpStyle,textAlign:'right',width:'60%'}} placeholder={k}/>
                          ) : (
                            <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.75)',textAlign:'right',fontWeight:500}}>{v}</span>
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
                                  <input value={req[field]||''} onChange={e=>onUpdate(open,{[field]:e.target.value})} style={inpStyle} placeholder={label}/>
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
                            <textarea value={req.remarks||''} onChange={e=>onUpdate(open,{remarks:e.target.value})} rows={2} placeholder="Remarks…"
                              style={{...inpStyle,resize:'vertical',lineHeight:1.5}}/>
                          ) : (
                            <div style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.58)',lineHeight:1.6,borderLeft:'2px solid rgba(255,255,255,0.10)',paddingLeft:8}}>{req.remarks}</div>
                          )}
                        </div>
                      )}

                      {/* Out of Scope notice — shown to APEX-CA when estimator flagged it */}
                      {req.outOfScopeSubmitted && (
                        <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(220,60,60,0.20)',background:'rgba(220,50,50,0.07)',border:'1px solid rgba(220,60,60,0.30)',borderRadius:8,padding:'9px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:req.outOfScopeReason?6:0}}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,90,0.85)" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            <span style={{fontSize:'0.50rem',color:'rgba(255,110,110,0.85)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:700}}>Out of Scope</span>
                            <span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.30)',marginLeft:'auto'}}>by {req.estimator||'Estimator'}</span>
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
                              const newDocs = await readFilesToDocs(Array.from(e.target.files));
                              onUpdate(open,{docs:[...(req.docs||[]),...newDocs]});
                              e.target.value='';
                            }}/>
                            <button onClick={()=>dirDocUploadRef.current?.click()}
                              style={{marginLeft:'auto',padding:'3px 10px',borderRadius:6,background:'rgba(0,200,255,0.10)',border:'1px solid rgba(0,200,255,0.30)',color:'rgba(0,200,255,0.85)',fontFamily:F2,fontSize:'0.60rem',fontWeight:700,cursor:'pointer',outline:'none'}}>
                              + Add File
                            </button>
                          </div>
                          {(req.docs||[]).length === 0 ? (
                            <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic'}}>No files</div>
                          ) : (req.docs||[]).map((d,i)=>(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                              <span style={{fontSize:'0.68rem',color:'rgba(0,200,255,0.80)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{docName(d)}</span>
                              <button onClick={()=>onUpdate(open,{docs:(req.docs||[]).filter((_,j)=>j!==i)})}
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
                          <input type="number" value={req.revisedMargin||''} onChange={e=>onUpdate(open,{revisedMargin:e.target.value})} placeholder="0.0" min="0" max="100" step="0.5"
                            style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:'monospace',fontSize:'1.00rem',fontWeight:700,width:'100%',color:'rgba(255,255,255,0.95)'}}/>
                          <span style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',fontFamily:'monospace',fontWeight:700}}>%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:'0.44rem',color:'rgba(0,220,255,0.45)',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:4}}>APEX-CA Remarks</div>
                        <textarea value={req.directorNote||''} onChange={e=>onUpdate(open,{directorNote:e.target.value})} placeholder="Notes…" rows={2}
                          style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:7,color:'rgba(255,255,255,0.80)',fontFamily:F2,fontSize:'0.78rem',padding:'5px 9px',outline:'none',resize:'none',boxSizing:'border-box',lineHeight:1.4}}
                          onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.28)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.10)'}/>
                      </div>
                    </div>
                    {/* Approve / Revise / Reject */}
                    <div style={{display:'flex',gap:5}}>
                      {DA.map(a=>(
                        <button key={a.v} onClick={()=>{
                          const ns = a.v==='approved'?'Approved':a.v==='rejected'?'Estimation Uploaded':'Pending Approval';
                          const nr = a.v==='approved'?'completed':a.v==='rejected'?'onhold':'inprogress';
                          onUpdate(open,{directorAction:a.v,status:ns,reqStatus:nr,directorSubmitted:false});
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
                      <button onClick={()=>{if(req.directorAction){const ns=req.directorAction==='approved'?'Approved':req.directorAction==='rejected'?'Estimation Uploaded':'Pending Approval';const nr=req.directorAction==='approved'?'completed':req.directorAction==='rejected'?'onhold':'inprogress';onUpdate(open,{status:ns,reqStatus:nr,directorSubmitted:true,directorRespondedAt:new Date().toISOString(),directorNote:req.directorNote||''});}}}
                        disabled={!req.directorAction}
                        style={{width:'100%',padding:'9px',borderRadius:9,background:req.directorAction?'linear-gradient(105deg,#0f0c3a,#1e40af 30%,#6d28d9 55%,#a855f7 75%,#00e5ff 100%)':'rgba(255,255,255,0.04)',backgroundSize:'220% 220%',animation:req.directorAction?'auroraShift 5s ease-in-out infinite':'none',border:req.directorAction?'1px solid rgba(255,255,255,0.20)':'1px solid rgba(255,255,255,0.07)',color:req.directorAction?'#fff':'rgba(255,255,255,0.22)',fontFamily:F2,fontSize:'0.86rem',fontWeight:700,cursor:req.directorAction?'pointer':'not-allowed',letterSpacing:'0.06em',boxShadow:req.directorAction?'0 4px 20px rgba(120,60,255,0.30)':'none',outline:'none'}}>
                        Submit Response
                      </button>
                    )}
                  </div>

                </div>{/* end left column */}

                {/* ═══ CENTER: Documents (D) + AI Suggestions (P) ═══ */}
                <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:8,overflowY:'auto',paddingRight:2,scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.08) transparent'}}>

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
                          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                            {req.docs.map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:5,padding:'5px 11px',borderRadius:6,background:'rgba(0,200,255,0.08)',border:'1px solid rgba(0,200,255,0.25)',color:'rgba(0,200,255,0.92)',fontFamily:F2,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s'}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,200,255,0.18)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,200,255,0.08)'}>
                                <DlIco/>{docName(d)}
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
                      <div style={{background:'rgba(0,220,130,0.04)',border:'1px solid rgba(0,220,130,0.14)',borderRadius:8,padding:'10px 12px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,220,130,0.60)" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                          <span style={{fontSize:'0.50rem',color:'rgba(0,220,130,0.65)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700}}>Quotation Documents</span>
                          <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.22)',marginLeft:'auto'}}>{req.estimationDocs?.length?`${req.estimationDocs.length} file${req.estimationDocs.length!==1?'s':''}`:req.estimationDoc?'1 file':'0 files'}</span>
                        </div>
                        {(req.estimationDocs?.length > 0 || req.estimationDoc?.data || req.estimationDoc?.url) ? (
                          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                            {(req.estimationDocs?.length > 0 ? req.estimationDocs : [req.estimationDoc]).filter(Boolean).map((d,i)=>(
                              <button key={i} onClick={()=>downloadDoc(d)}
                                style={{display:'flex',alignItems:'center',gap:5,padding:'5px 11px',borderRadius:6,background:'rgba(0,220,130,0.08)',border:'1px solid rgba(0,220,130,0.30)',color:'rgba(0,220,130,0.92)',fontFamily:F2,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',outline:'none',transition:'background 0.15s'}}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,220,130,0.18)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,220,130,0.08)'}>
                                <DlIco/>{d.name||req.estimationFile||`quotation-${i+1}`}
                              </button>
                            ))}
                          </div>
                        ) : <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.22)',fontStyle:'italic'}}>No files attached</span>}
                      </div>
                    </div>
                  </div>

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
                <div style={{width:'28%',minWidth:210,display:'flex',flexDirection:'column',gap:8,overflow:'hidden'}}>

                  {/* Tab selector */}
                  <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:9,padding:3,gap:2,flexShrink:0}}>
                    {[{k:'history',label:'History'},{k:'analysis',label:'Analysis'}].map(({k,label})=>(
                      <button key={k} onClick={()=>setDirTab(k)}
                        style={{flex:1,padding:'7px 0',borderRadius:7,background:dirTab===k?'rgba(255,255,255,0.10)':'transparent',border:'none',color:dirTab===k?'rgba(255,255,255,0.92)':'rgba(255,255,255,0.35)',fontFamily:F2,fontSize:'0.76rem',fontWeight:dirTab===k?700:500,cursor:'pointer',outline:'none',transition:'all 0.2s',letterSpacing:'0.04em'}}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div style={{overflowY:'auto',display:'flex',flexDirection:'column',gap:7,scrollbarWidth:'thin',scrollbarColor:'rgba(255,255,255,0.06) transparent',maxHeight:dirConvoOpen?'36%':'100%',transition:'max-height 0.25s ease',flexShrink:0}}>
                    {dirTab === 'history' && (<>
                      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'11px 13px',flexShrink:0}}>
                        <div style={{fontSize:'0.48rem',color:'rgba(255,200,0,0.55)',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,marginBottom:7}}>Rate Requester</div>
                        <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.38)',marginBottom:7,lineHeight:1.4}}>{req.submittedBy||'—'}</div>
                        <div style={{display:'flex',gap:4,alignItems:'center'}}>
                          {[1,2,3,4,5].map(n=>(
                            <button key={n} type="button" onClick={()=>onUpdate(open,{requesterRating:n})}
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
                  <div style={{background:'rgba(109,40,217,0.07)',border:'1px solid rgba(168,85,247,0.35)',borderRadius:12,display:'flex',flexDirection:'column',minHeight:0,overflow:'hidden',...(dirConvoOpen?{flex:1}:{flexShrink:0})}}>
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
                            const isEst = msg.role==='estimator';
                            return (
                              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:isEst?'flex-end':'flex-start'}}>
                                <div style={{maxWidth:'88%',background:isEst?'rgba(109,40,217,0.22)':'rgba(255,255,255,0.05)',border:isEst?'1px solid rgba(168,85,247,0.28)':'1px solid rgba(255,255,255,0.08)',borderRadius:isEst?'11px 11px 3px 11px':'11px 11px 11px 3px',padding:'6px 10px'}}>
                                  <div style={{fontSize:'0.52rem',color:isEst?'rgba(196,181,253,0.60)':'rgba(100,200,255,0.55)',marginBottom:2,fontWeight:600}}>{msg.from} · {msg.ts}</div>
                                  <div style={{fontSize:'0.80rem',color:'rgba(255,255,255,0.82)',lineHeight:1.4}}>{msg.text}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{flexShrink:0,padding:'8px 14px',borderTop:'1px solid rgba(168,85,247,0.12)'}}>
                          <div style={{fontSize:'0.52rem',color:'rgba(255,255,255,0.20)',textAlign:'center',fontStyle:'italic'}}>Conversation between Sales &amp; Estimator</div>
                        </div>
                      </>
                    )}
                  </div>

                </div>{/* end right column */}

              </div>{/* end 3-column */}

            </div>
          );
        })()}
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
    return true;
  });


  // Unified column layout
  const COL = '100px 160px 1fr 130px 130px 130px 130px 120px 100px 110px';

  const VIEW_LABELS = {requester:'Requester', estimator:'Estimator', director:'Cost-Artist'};
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
          {/* View mode toggle — hidden when role is set externally */}
          {!lockViewMode && <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:8,padding:3,gap:2,flexShrink:0}}>
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
          </div>}

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
            <span>Timeline</span>
            <span style={{textAlign:'right'}}>Value (AED)</span>
          </div>

          {/* ── Rows ── */}
          {filtered.map(r => {
            const realIdx = requests.indexOf(r);
            return (
              <div key={r.id} style={{position:'relative'}}>
              <div style={{display:'grid',gridTemplateColumns:COL,gap:10,alignItems:'start',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:'11px 16px',paddingRight: viewMode==='director' ? 44 : 16,transition:'background 0.2s',cursor:'pointer',minWidth:'fit-content'}}
                onClick={()=>setOpen(realIdx)}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}>

                {/* Req # */}
                <span style={{fontSize:'0.72rem',color:'rgba(100,180,255,0.85)',fontWeight:600,fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.id||'—'}</span>

                {/* Status */}
                <div style={{display:'flex',flexDirection:'column',gap:3,overflow:'hidden',minWidth:0}}>
                  <Badge s={r.status}/>
                  {(() => {
                    const subMap = {
                      'not-started':   {label:'Pending Assignment', c:'rgba(255,200,50,0.60)'},
                      'inprogress':    {label:'Estimator Review',   c:'rgba(100,200,255,0.70)'},
                      'pending-director':{label:'Cost-Artist Review',  c:'rgba(180,130,255,0.80)'},
                      'completed':     {label:'Completed',          c:'rgba(52,211,153,0.80)'},
                      'onhold':        {label:'On Hold',            c:'rgba(255,120,60,0.70)'},
                    };
                    const sub = subMap[r.reqStatus];
                    return sub ? <span style={{fontSize:'0.52rem',color:sub.c,fontWeight:600,letterSpacing:'0.05em'}}>{sub.label}</span> : null;
                  })()}
                  {r.requestType==='revised' && (
                    <span style={{fontSize:'0.52rem',color:'rgba(0,200,255,0.70)',fontWeight:600,letterSpacing:'0.06em'}}>REVISED</span>
                  )}
                  {r.requestType==='finalPrice' && (
                    <span style={{fontSize:'0.52rem',color:'rgba(52,211,153,0.80)',fontWeight:600,letterSpacing:'0.06em'}}>FINAL</span>
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

                {/* Requested By */}
                <div style={{display:'flex',flexDirection:'column',gap:1,overflow:'hidden'}}>
                  <span style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.60)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.submittedBy||'—'}</span>
                  {r.salesPerson && <span style={{fontSize:'0.58rem',color:'rgba(255,200,80,0.65)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.salesPerson}</span>}
                </div>

                {/* Estimator */}
                <span style={{fontSize:'0.72rem',color:r.estimator?'rgba(100,180,255,0.85)':'rgba(255,255,255,0.22)',fontStyle:r.estimator?'normal':'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.estimator||'Unassigned'}</span>

                {/* Latest TAT timing */}
                {(() => {
                  const { s1, s2, s3 } = calcTATStages(r);
                  const fms = ms => { if(!ms)return'—'; const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000); return h>23?`${Math.floor(h/24)}d ${h%24}h`:`${h}h ${m}m`; };
                  const latest = s3 ? { val: s3, label: 'Dir', color: 'rgba(0,220,180,0.80)' }
                    : s2 ? { val: s2, label: 'Est', color: 'rgba(255,200,50,0.80)' }
                    : s1 ? { val: s1, label: 'Asn', color: 'rgba(120,180,255,0.80)' }
                    : null;
                  return latest
                    ? <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:1}}>
                        <span style={{fontSize:'0.50rem',color:'rgba(255,255,255,0.22)',letterSpacing:'0.10em',textTransform:'uppercase'}}>{latest.label}</span>
                        <span style={{fontSize:'0.72rem',fontWeight:700,color:latest.color,fontFamily:'monospace',whiteSpace:'nowrap'}}>{fms(latest.val)}</span>
                      </div>
                    : <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.18)'}}>—</span>;
                })()}

                {/* Value (AED) */}
                <span style={{fontSize:'0.72rem',color:r.projValue?'rgba(255,230,100,0.85)':'rgba(255,255,255,0.2)',fontWeight:r.projValue?600:400,textAlign:'right',whiteSpace:'nowrap',fontFamily:'monospace'}}>
                  {r.projValue ? Number(r.projValue).toLocaleString('en-AE') : '—'}
                </span>
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
              <span style={{fontSize:'0.62rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(220,80,80,0.80)',fontWeight:700}}>APEX-CA · Delete Request</span>
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
                onClick={()=>{ if(deleteCode.toLowerCase()==='xepa'){onDelete(deleteConfirm);setDeleteConfirm(null);setDeleteCode('');setOpen(null);} }}
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
              {r.requestType==='revised'    && <span style={{fontSize:'0.58rem',color:'rgba(0,200,255,0.70)',fontWeight:700,flexShrink:0}}>REVISED</span>}
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
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px',marginTop:16}}>
          <p style={{fontSize:'0.58rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:12,fontWeight:600}}>Request Timelines</p>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {requests.slice(0,10).map(r=>(
              <div key={r.id} style={{display:'flex',alignItems:'center',gap:14,borderBottom:'1px solid rgba(255,255,255,0.04)',paddingBottom:10}}>
                <span style={{fontFamily:'monospace',fontSize:'0.72rem',fontWeight:700,color:'rgba(220,165,0,0.85)',flexShrink:0,minWidth:58}}>{r.id}</span>
                <span style={{fontSize:'0.70rem',color:'rgba(255,255,255,0.45)',flexShrink:0,minWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.estimator||'Unassigned'}</span>
                <div style={{flex:1,minWidth:0}}><TATTimeline r={r}/></div>
              </div>
            ))}
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
        src="https://estai8-4-338841056432.us-west1.run.app"
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
    ? `https://estai8-4-338841056432.us-west1.run.app/?code=${encodeURIComponent(userCode)}`
    : 'https://estai8-4-338841056432.us-west1.run.app/';
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
  const [intro,setIntro] = useState(true);
  const [userRole, setUserRole] = useState(initialRole || null);
  const [userCode, setUserCode] = useState(initialCode || '');
  const [view,setView] = useState(() => {
    if (initialView) return initialView;
    return (initialRole === 'estimator' || initialRole === 'director') ? 'dashboard' : 'landing';
  });
  const [aiOpen,      setAiOpen]      = useState(false);
  const [toolOpen,    setToolOpen]    = useState(false);
  const [directOpen,  setDirectOpen]  = useState(initialView === 'directTool');

  const handleRoleLogin = (role, code) => {
    setUserRole(role);
    setUserCode(code);
    if (role === 'estimator') setView('dashboard');
    else setView('landing');
  };

  const handleLogout = () => {
    onBack();
  };

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
  const [diaryEntries, setDiaryEntries] = useState([]);
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
        const raw = data.record.requests || [];
        // Restore file data from IndexedDB (stripped before JSONBin save to stay within size limits)
        const enriched = await Promise.all(raw.map(async (req) => ({
          ...req,
          docs: await Promise.all((req.docs || []).map(restoreDocFromIDB)),
          originalDocs: await Promise.all((req.originalDocs || []).map(restoreDocFromIDB)),
          estimationDoc: req.estimationDoc ? await restoreDocFromIDB(req.estimationDoc) : req.estimationDoc,
          estimationDocs: req.estimationDocs ? await Promise.all(req.estimationDocs.map(restoreDocFromIDB)) : req.estimationDocs,
        })));
        setRequests(enriched);
        setDiaryEntries(data.record.diaryEntries || []);
      } catch(err) { console.error('Load failed:', err); }
    };
    load();
  }, []);

  // Save whenever requests or diary changes
  useEffect(() => {
    if (requests.length === 0 && diaryEntries.length === 0) return;
    const save = async () => {
      try {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          },
          body: JSON.stringify({
            requests: requests.map(r => ({
              ...r,
              docs: (r.docs || []).map(stripDocData),
              originalDocs: (r.originalDocs || []).map(stripDocData),
              estimationDoc: r.estimationDoc ? stripDocData(r.estimationDoc) : r.estimationDoc,
              estimationDocs: (r.estimationDocs || []).map(stripDocData),
            })),
            diaryEntries,
          })
        });
        console.log('✅ Saved to cloud!');
      } catch(err) { console.error('Save failed:', err); }
    };
    save();
  }, [requests, diaryEntries]);

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

const AZURE_ACCOUNT = "apexfilestorage2";
const AZURE_CONTAINER = "estimation-docs";
const AZURE_SAS = "sv=2025-11-05&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-30T13:08:36Z&st=2026-04-19T20:00:00Z&spr=https&sig=GMAKHd37xTTyBo5eeCg%2BQjzdT37ga%2FtmBDGWHjzfZTc%3D";

const uploadToAzure = async (file, requestId) => {
  try {
    const blobName = `${requestId}/${file.name}`;
    const url = `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobName}?${AZURE_SAS}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });
    if (res.ok) {
      const downloadUrl = `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobName}`;
      console.log('✅ Uploaded:', downloadUrl);
      return downloadUrl;
    } else {
      console.error('❌ Upload failed:', res.status);
      return null;
    }
  } catch(err) {
    console.error('❌ Azure upload error:', err);
    return null;
  }
};

const handleSubmit = async (formData) => {
  const count = requests.length + 1;
  const newId = 'AX' + String(count).padStart(4, '0');
  const uniqueId = `${newId}-00`;

  // Upload files to Azure and get download URLs
  const docFiles = formData.docFiles || [];
  const uploadedDocs = await Promise.all(
    docFiles.map(async (file) => {
      const url = await uploadToAzure(file, newId);
      return { name: file.name, type: file.type, url };
    })
  );

  const entry = {
    id: newId,
    uniqueId,
    parentRequestId: null,
    revisionNumber: 0,
    requestVersion: 'New',
    ...formData,
    docs: uploadedDocs,
    status: 'Pending Estimation',
    date: new Date().toLocaleDateString('en-GB'),
    submittedAt: new Date().toISOString(),
    estimationFile: null,
    estimator: null,
    margin: '',
    taggedAt: null,
    quotationSubmittedAt: null,
    reqStatus: 'not-started',
    directorAction: null,
    directorNote: '',
    rejectionCycles: [],
    timeline: [{ event: 'submitted', ts: new Date().toISOString(), label: 'Request Submitted', by: formData.submittedBy || '' }],
    documentUrl: `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${newId}/`,
  };

  setRequests(prev => [entry, ...prev]);
  setView('relax');
};

  const handleFinalPriceSubmit = async (formData) => {
    const count = requests.length + 1;
    const newId = 'AX' + String(count).padStart(4, '0');
    // Persist new docs + original reference docs to IndexedDB
    await Promise.all((formData.docs || []).map(saveDocToIDB));
    await Promise.all((formData.originalDocs || []).map(saveDocToIDB));
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

  const handleRevisedSubmit = async (formData) => {
    const count = requests.length + 1;
    const newId = 'AX' + String(count).padStart(4, '0');
    // Persist new docs + original reference docs to IndexedDB
    await Promise.all((formData.docs || []).map(saveDocToIDB));
    await Promise.all((formData.originalDocs || []).map(saveDocToIDB));
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

  const updateRequest = async (idx, patch) => {
    // Persist any doc data in patch to IndexedDB before it gets stripped on JSONBin save
    if (patch.estimationDoc) await saveDocToIDB(patch.estimationDoc);
    if (patch.estimationDocs) await Promise.all(patch.estimationDocs.map(saveDocToIDB));
    if (patch.docs) await Promise.all(patch.docs.map(saveDocToIDB));
    if (patch.originalDocs) await Promise.all(patch.originalDocs.map(saveDocToIDB));
    setRequests(prev => prev.map((r,i) => i===idx ? {...r,...patch} : r));
  };

  const deleteRequest = (idx) => {
    setRequests(prev => prev.filter((_,i) => i !== idx));
  };

  return (
    <div className="root">
      <style>{S}</style>
      <div className="veil"/>

      {/* NN logo — faint watermark across all screens */}
      <div style={{position:'fixed',inset:0,zIndex:101,pointerEvents:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src="/NN.png" alt="" style={{width:'min(420px,55vw)',opacity:0.06,userSelect:'none',filter:'brightness(10) saturate(0)'}}/>
      </div>
      {/* RoleLogin only when no role AND not in a guest-accessible view */}
      {!userRole && !['landing','form','revisedSearch','revisedForm','finalPriceSearch','finalPriceForm','relax','loading','results','dashboard','openRequests'].includes(view) && <RoleLogin onLogin={handleRoleLogin}/>}
      <NavBar view={view} setView={setView} onHome={onBack} onBack={handleNavBack} userRole={userRole} userCode={userCode} onLogout={handleLogout} onDirectTool={()=>setDirectOpen(true)}
        onDirectorAccess={(code='STAR')=>{ setUserRole('director'); setUserCode(code); setView('dashboard'); }}/>

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

      {/* ── AI Tool Direct — fixed top center-right, in navbar zone ── */}
      {((userRole && userRole !== 'sales' && userRole !== 'director') || (userRole === 'director' && view === 'form') || (!userRole && view === 'dashboard')) && (
        <button onClick={()=>setDirectOpen(true)}
          style={{
            position:'fixed', top:10, right:265, zIndex:9501,
            display:'inline-flex', alignItems:'center', gap:6,
            background:'rgba(10,6,30,0.82)',
            border:'1px solid rgba(168,85,247,0.48)',
            borderRadius:'100px',
            padding:'7px 16px',
            color:'rgba(200,160,255,0.90)',
            fontFamily:"'Inter',sans-serif", fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.07em',
            cursor:'pointer', outline:'none',
            boxShadow:'0 2px 16px rgba(168,85,247,0.25)',
            backdropFilter:'blur(16px)', transition:'all 0.2s', whiteSpace:'nowrap',
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#6d28d9,#a855f7,#ec4899,#f97316)';e.currentTarget.style.color='#fff';e.currentTarget.style.boxShadow='0 4px 22px rgba(168,85,247,0.55)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(10,6,30,0.82)';e.currentTarget.style.color='rgba(200,160,255,0.90)';e.currentTarget.style.boxShadow='0 2px 16px rgba(168,85,247,0.25)';}}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          ✦ AI Tool Direct
        </button>
      )}

      {directOpen && <DirectToolModal onClose={()=>setDirectOpen(false)} userCode={userCode}/>}

      <style>{`@keyframes toolFadeIn { from{opacity:0} to{opacity:1} }`}</style>
      {view==='landing'           && <Landing onNew={()=>setView('form')} onRevised={()=>setView('revisedSearch')} onFinalPrice={()=>setView('finalPriceSearch')} q={q} setQ={setQ} onGo={handleSearch} onDirectTool={()=>setDirectOpen(true)} userRole={userRole}/>}
      {view==='form'              && <Form onSubmit={handleSubmit} onBack={()=>setView('landing')}/>}
      {view==='revisedSearch'     && <RevisedSearch requests={requests} onSelect={r=>{setRevisedSource(r);setView('revisedForm');}} onBack={()=>setView('landing')}/>}
      {view==='revisedForm'       && revisedSource && <RevisedForm original={revisedSource} onSubmit={handleRevisedSubmit} onBack={()=>setView('revisedSearch')}/>}
      {view==='finalPriceSearch'  && <FinalPriceSearch requests={requests} onSelect={r=>{setFinalPriceSource(r);setView('finalPriceForm');}} onBack={()=>setView('landing')}/>}
      {view==='finalPriceForm'    && finalPriceSource && <FinalPriceForm original={finalPriceSource} onSubmit={handleFinalPriceSubmit} onBack={()=>setView('finalPriceSearch')}/>}
      {view==='relax'          && <RelaxScreen onAnother={()=>setView('form')} onHome={()=>setView('landing')}/>}
      {view==='openRequests' && <OpenRequests requests={requests} onUpdate={updateRequest} onDelete={deleteRequest} userCode={userCode} userRole={userRole}/>}
      {view==='dashboard' && <Dashboard requests={requests} onUpdate={updateRequest} onDelete={deleteRequest}
          initialViewMode={userRole==='director'?'director':'estimator'} onDirectTool={()=>setDirectOpen(true)}/>}
      {view==='analyse'      && <Analyse requests={requests}/>}
      {view==='trackQuotation' && <TrackQuotation requests={requests}
          spName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):''}
          showAll={userRole==='director'}
          onUpdate={updateRequest}/>}
      {view==='salesStatus'  && <SalesStatusView requests={requests} onUpdate={updateRequest}
          autoSpName={userRole==='sales'?(STAFF_NAMES[userCode]||userCode):undefined}
          showAll={userRole==='director'}/>}
      {view==='salesPerformance' && <SalesPerformance
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
    </div>
  );
}
