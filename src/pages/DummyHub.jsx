import React, { useState, useRef } from 'react';

export default function DummyHub() {
  const [phase, setPhase]       = useState('select'); // 'select' | 'code'
  const [selDept, setSelDept]   = useState(null);
  const [code, setCode]         = useState('');
  const [showCode, setShowCode] = useState(false);
  const [shake, setShake]       = useState(false);
  const [errMsg, setErrMsg]     = useState('');
  const inputRef = useRef(null);

  // Department definitions
  const depts = [
    {
      id: 'sales', label: 'Sales & Marketing', hint: 'Enter sales code',
      desc: 'Pipeline, CRM & marketing', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
    {
      id: 'estimation', label: 'Estimation', hint: 'Enter estimation code',
      desc: 'Cost analysis & quotations', color: '#a78bfa', glow: 'rgba(167,139,250,0.35)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="8" y1="15" x2="11" y2="15"/>
        </svg>
      ),
    },
    {
      id: 'contracts', label: 'Contracts', desc: 'Document & legal management',
      color: '#60a5fa', glow: 'rgba(96,165,250,0.25)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <path d="M9 13h6M9 17h4"/>
        </svg>
      ),
    },
    {
      id: 'engineering', label: 'Engineering', desc: 'Design, systems & technical',
      color: '#34d399', glow: 'rgba(52,211,153,0.25)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
    },
  ];

  const pickDept = (dept) => {
    setSelDept(dept);
    setCode('');
    setErrMsg('');
    setPhase('code');
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const doShake = (msg) => {
    setErrMsg(msg);
    setShake(true);
    setTimeout(() => { setShake(false); setCode(''); }, 620);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const entered = code.trim().toUpperCase();
    if (!entered) return;
    
    // Dummy login logic for testing
    if (entered === 'TEST') {
      alert(`Logged into ${selDept.label} successfully!`);
    } else {
      doShake('Invalid code (Try "TEST")');
    }
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:"#010106", // Dark background fallback
      fontFamily:"'Inter',sans-serif", color:'#e2e8f0', overflow:'hidden',
    }}>
      <style>{`
        @keyframes hs-aurora   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes hs-fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hs-shake    { 0%{transform:translateX(0)} 15%{transform:translateX(-10px)} 30%{transform:translateX(10px)} 45%{transform:translateX(-8px)} 60%{transform:translateX(8px)} 75%{transform:translateX(-4px)} 90%{transform:translateX(4px)} 100%{transform:translateX(0)} }
        @keyframes hs-errPulse { 0%{box-shadow:0 0 0 rgba(220,30,30,0)} 50%{box-shadow:0 0 22px rgba(220,30,30,0.7)} 100%{box-shadow:0 0 8px rgba(220,30,30,0.3)} }

        .hs-land  { position:relative;width:100%;height:100%;display:flex;padding-top:52px }
        .hs-left  { width:50%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 3vw 0 10vw;position:relative;z-index:10 }
        .hs-right { width:56%;height:100%;position:relative;overflow:hidden }

        /* top-left branding */
        .hs-topbrand {
          position:absolute; top:28px; left:40px; z-index:30;
          display:flex; flex-direction:column; gap:1px;
          animation: hs-fadeUp 0.5s ease both;
        }
        .hs-topbrand-naffco {
          font-size:clamp(0.78rem,1vw,0.95rem); font-weight:500; letter-spacing:0.28em;
          text-transform:uppercase; line-height:1;
          background:linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%);
          background-size:250% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 1px 8px rgba(109,40,217,0.5));
          animation:hs-aurora 6s ease infinite;
        }
        .hs-topbrand-sub {
          font-size:clamp(0.52rem,0.65vw,0.62rem); font-weight:400; letter-spacing:0.38em;
          text-transform:uppercase; color:rgba(255,255,255,0.28);
        }

        /* page title */
        .hs-title { font-size:clamp(2.1rem,4vw,4rem);font-weight:800;letter-spacing:0.06em;text-transform:uppercase;line-height:1.1;margin-bottom:10px;
          background:linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%);
          background-size:220% 220%;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          filter:drop-shadow(0 2px 16px rgba(109,40,217,0.55));
          animation:hs-aurora 6s ease infinite; }
        .hs-sub { font-size:0.82rem;letter-spacing:0.04em;margin-bottom:24px;font-weight:400;line-height:1.7;max-width:280px;
          background:linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(200,220,255,0.65) 40%,rgba(255,255,255,0.45) 65%,rgba(180,210,255,0.70) 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }

        /* tiles */
        .hs-tiles { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
        .hs-tile {
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; align-items:flex-start; gap:12px;
          background:rgba(6,4,22,0.88);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:20px 14px 16px;
          cursor:pointer; color:#e8eeff; text-align:left;
          transition:transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .hs-tile::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg, transparent, var(--tc), transparent);
          opacity:0.5; border-radius:14px 14px 0 0; transition:opacity 0.3s;
        }
        .hs-tile:hover {
          transform:translateY(-7px) scale(1.015);
          border-color:rgba(255,255,255,0.18);
          box-shadow:0 18px 48px var(--tg, rgba(0,0,0,0.4)), 0 0 0 1px rgba(255,255,255,0.06) inset;
        }
        .hs-tile:hover::before { opacity:1; }

        .hs-cb-tl, .hs-cb-br {
          position:absolute; width:11px; height:11px;
          border-color:var(--tc); border-style:solid; opacity:0.55;
          transition:opacity 0.3s, width 0.3s, height 0.3s;
        }
        .hs-cb-tl { top:7px; left:7px; border-width:1.5px 0 0 1.5px; border-radius:4px 0 0 0; }
        .hs-cb-br { bottom:7px; right:7px; border-width:0 1.5px 1.5px 0; border-radius:0 0 4px 0; }
        .hs-tile:hover .hs-cb-tl, .hs-tile:hover .hs-cb-br { opacity:1; width:16px; height:16px; }

        .hs-icon-wrap { position:relative; width:44px; height:44px; flex-shrink:0; }
        .hs-icon-ring {
          position:absolute; inset:-2px; border-radius:11px;
          background:conic-gradient(from 0deg, var(--tc) 0deg, transparent 100deg, transparent 260deg, var(--tc) 360deg);
          animation:hs-spin 3.5s linear infinite; opacity:0.65;
        }
        @keyframes hs-spin { to { transform:rotate(360deg); } }
        .hs-tile:hover .hs-icon-ring { opacity:1; }
        .hs-icon-bg {
          position:absolute; inset:2px; border-radius:9px; background:rgba(6,4,22,0.95);
          display:flex; align-items:center; justify-content:center;
        }
        .hs-tile-name { font-size:0.84rem; font-weight:600; line-height:1.25; color:#e8eeff; }
        .hs-tile-desc { font-size:0.70rem; color:rgba(255,255,255,0.36); line-height:1.4; }

        /* code entry */
        .hs-cinput { background:transparent;border:none;border-bottom:2px solid #333;outline:none;
          color:#e0e0e0;font-size:clamp(20px,3vw,36px);font-weight:600;letter-spacing:0.3em;text-align:center;
          text-transform:uppercase;width:clamp(200px,28vw,320px);padding:8px 0;
          caret-color:#cc0000;transition:border-color 0.3s; }
        .hs-cinput:focus  { border-bottom-color:#cc0000; }
        .hs-cinput.hs-err { border-bottom-color:#dc1e1e;color:#dc1e1e;animation:hs-errPulse 0.5s ease forwards; }
        .hs-cform.hs-shake { animation:hs-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .hs-back { display:inline-flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;
          color:rgba(255,255,255,0.38);font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;padding:0;transition:color 0.2s; }
        .hs-back:hover { color:rgba(255,255,255,0.75); }
        .hs-hint   { font-size:11px;letter-spacing:0.3em;color:#2a2a2a;text-transform:uppercase;margin-top:22px; }
        .hs-errmsg { font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#dc1e1e;margin-top:10px;opacity:0;transition:opacity 0.2s; }
        .hs-errmsg.vis { opacity:1; }

        /* AR Viewer pill */
        .hs-ar-btn {
          position:absolute; bottom:24px; right:24px; z-index:40;
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.20); border-radius:100px;
          padding:7px 16px; cursor:pointer; color:rgba(255,255,255,0.82);
          font-size:0.70rem; font-weight:600; letter-spacing:0.10em; text-transform:uppercase;
          transition:background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .hs-ar-btn:hover { background:rgba(0,200,255,0.12); border-color:rgba(0,200,255,0.45); color:#fff; box-shadow:0 0 16px rgba(0,200,255,0.22); }
        .hs-ar-dot { width:6px; height:6px; border-radius:50%; background:#00cfff; box-shadow:0 0 6px #00cfff; }
      `}</style>

      {/* ── TOP-LEFT BRANDING ── */}
      <div className="hs-topbrand">
        <div className="hs-topbrand-naffco">NAFFCO AI APEX</div>
        <div className="hs-topbrand-sub">Passion to Protect</div>
      </div>

      {/* ── BOTTOM-LEFT LOGO ── */}
      <img src="/logo.png" alt="NAFFCO" style={{
        position:'absolute', bottom:24, left:36, zIndex:30,
        height:32, width:'auto', objectFit:'contain',
        opacity:0.55, filter:'drop-shadow(0 1px 8px rgba(109,40,217,0.35))',
        animation:'hs-fadeUp 0.6s ease both', cursor:'pointer'
      }} onClick={() => alert("Cost Artist Login Prompt!")} />

      {/* ── BOTTOM-RIGHT: AR Viewer ── */}
      <button className="hs-ar-btn" onClick={() => alert("AR Viewer Activated!")}>
        <span className="hs-ar-dot"/> AR Viewer
      </button>

      <div className="hs-land">
        {/* ── LEFT COLUMN ── */}
        <div className="hs-left">

          {phase === 'select' ? (
            <div style={{display:'flex',flexDirection:'column',animation:'hs-fadeUp 0.55s ease both'}}>
              <h1 className="hs-title">AI APEX HUB</h1>
              <p style={{ fontSize:'0.72rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', textAlign:'center', marginBottom:24, marginTop:-8, fontWeight:500 }}> - STATE OF ART - </p>
              
              <div className="hs-tiles">
                {depts.map((dept, idx) => (
                  <button
                    key={dept.id}
                    className="hs-tile"
                    style={{ '--tc': dept.color, '--tg': dept.glow }}
                    onClick={() => pickDept(dept)}
                  >
                    <span className="hs-cb-tl"/>
                    <span className="hs-cb-br"/>
                    <svg style={{position:'absolute',top:12,right:12}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dept.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    <div className="hs-icon-wrap">
                      <div className="hs-icon-ring"/>
                      <div className="hs-icon-bg">{dept.icon(dept.color)}</div>
                    </div>
                    <div>
                      <div className="hs-tile-name">{dept.label}</div>
                      <div className="hs-tile-desc">{dept.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          ) : (
            /* ── CODE ENTRY ── */
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',animation:'hs-fadeUp 0.4s ease both'}}>
              <button className="hs-back" onClick={() => { setPhase('select'); setCode(''); setErrMsg(''); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
              <h1 className="hs-title" style={{fontSize:'clamp(1.8rem,3.2vw,3rem)'}}>{selDept?.label}</h1>
              <p className="hs-sub">{selDept?.hint}</p>
              <form className={`hs-cform${shake ? ' hs-shake' : ''}`} onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:0}}>
                <div style={{position:'relative',display:'inline-flex',alignItems:'center'}}>
                  <input ref={inputRef} className={`hs-cinput${errMsg ? ' hs-err' : ''}`} type={showCode ? 'text' : 'password'}
                    value={code} onChange={e => { setCode(e.target.value); setErrMsg(''); }}
                    placeholder="— — — —" maxLength={10} autoComplete="off" spellCheck={false} style={{paddingRight:36}} />
                  <button type="button" onClick={() => setShowCode(v => !v)}
                    style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:4,color:showCode?'#cc0000':'#444',outline:'none'}}>
                    {showCode
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    }
                  </button>
                </div>
                <div className={`hs-errmsg${errMsg ? ' vis' : ''}`}>{errMsg || '\u00A0'}</div>
                <div className="hs-hint">Press Enter to confirm</div>
              </form>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN — AIBOT ── */}
        <div className="hs-right" style={{position:'relative',background:'transparent'}}>
          <div style={{position:'absolute',top:'-10%',left:'0%',right:'0%',bottom:'-5%',zIndex:0,
            background:'conic-gradient(from 0deg at 50% 50%,#ff0000,#ff7700,#ffff00,#00ff88,#00cfff,#6d28d9,#a855f7,#ec4899,#ff0000)',
            backgroundSize:'300% 300%',animation:'hs-aurora 6s ease-in-out infinite',
            filter:'blur(55px)',opacity:0.60}}/>
          <div style={{position:'absolute',top:'-2%',left:'8%',right:'8%',bottom:'0%',zIndex:0,
            background:'linear-gradient(120deg,#ff0000 0%,#ff6600 12%,#ffcc00 24%,#00ff88 36%,#00bfff 48%,#3b82f6 58%,#8b5cf6 68%,#ec4899 80%,#ff3366 90%,#ff0000 100%)',
            backgroundSize:'300% 300%',animation:'hs-aurora 4s ease-in-out infinite reverse',
            filter:'blur(30px)',opacity:0.70}}/>
          <img src="/AIBOT.png" alt="AI Bot" style={{position:'fixed',inset:0,zIndex:1,width:'100vw',height:'100vh',objectFit:'cover',objectPosition:'center top',display:'block',pointerEvents:'none'}}/>
        </div>
      </div>
    </div>
  );
}