// NAFFCO — EstimatorReview page (stub — full implementation in PROMPT 7)
import React from 'react';

export default function EstimatorReview() {
  return (
    <div style={{ background: '#0a0812', minHeight: '100vh', fontFamily: "'Inter',sans-serif", color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        @keyframes er-aurora { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>
      {/* Top bar */}
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:58, borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.40)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', flexShrink:0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:500, letterSpacing:'0.26em', textTransform:'uppercase', background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)', backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'er-aurora 5s ease infinite' }}>NAFFCO AI APEX</div>
          <div style={{ fontSize:'0.52rem', letterSpacing:'0.34em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)' }}>Passion to Protect</div>
        </div>
        <div style={{ position:'absolute', left:0, right:0, textAlign:'center', pointerEvents:'none', userSelect:'none' }}>
          <span style={{ fontFamily:"'Cinzel',Georgia,'Times New Roman',serif", fontSize:'clamp(0.80rem,1.1vw,1.0rem)', fontWeight:400, letterSpacing:'0.40em', textTransform:'uppercase',
            background:'linear-gradient(105deg,rgba(255,255,255,0.95) 0%,rgba(210,228,255,0.82) 30%,rgba(255,255,255,0.68) 55%,rgba(190,215,255,0.92) 80%,rgba(255,255,255,0.85) 100%)',
            backgroundSize:'250% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            filter:'drop-shadow(0 1px 10px rgba(160,200,255,0.30))' }}>
            ESTIMATION
          </span>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: 40 }}>
        <h1 style={{ color: '#e8304a' }}>Estimator Review</h1>
        <p style={{ color: '#b0ada8' }}>Door table and review workflow will be built in PROMPT 7.</p>
      </div>
    </div>
  );
}
