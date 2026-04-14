const F = "'Inter',sans-serif";
const SITE_URL = 'https://ais-dev-e3o6rlu64mseqvoodbtsco-250550132737.europe-west2.run.app';

export default function Estimator({ onClose }) {
  return (
    /* ── Frosted glass overlay ── */
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:8000,
        background:'rgba(5,3,20,0.55)',
        backdropFilter:'blur(18px) saturate(160%)',
        WebkitBackdropFilter:'blur(18px) saturate(160%)',
        display:'flex', alignItems:'center', justifyContent:'center',
        animation:'apexFadeUp 0.22s ease both',
        fontFamily: F,
      }}
    >
      <style>{`
        @keyframes apexFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes apexAurora { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>

      {/* ── Glass card ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:'min(1200px,96vw)', height:'min(820px,92vh)',
          display:'flex', flexDirection:'column',
          background:'rgba(255,255,255,0.08)',
          backdropFilter:'blur(28px) saturate(180%)',
          WebkitBackdropFilter:'blur(28px) saturate(180%)',
          borderRadius:24,
          border:'1px solid rgba(255,255,255,0.18)',
          boxShadow:'0 8px 48px rgba(31,38,135,0.50), inset 0 1px 0 rgba(255,255,255,0.12)',
          overflow:'hidden',
          position:'relative',
        }}
      >
        {/* Aurora accent line */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:'linear-gradient(90deg,#6d28d9,#a855f7,#ec4899,#f97316,#fbbf24)',
          backgroundSize:'200% 100%',
          animation:'apexAurora 5s ease-in-out infinite',
          pointerEvents:'none', zIndex:2,
        }}/>

        {/* ── Header ── */}
        <div style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'14px 24px',
          borderBottom:'1px solid rgba(255,255,255,0.10)',
          flexShrink:0, position:'relative', zIndex:1,
        }}>
          <div style={{
            width:9, height:9, borderRadius:'50%',
            background:'linear-gradient(135deg,#a855f7,#ec4899)',
            boxShadow:'0 0 12px rgba(168,85,247,0.90)',
            flexShrink:0,
          }}/>
          <span style={{fontSize:'1rem',fontWeight:700,color:'rgba(255,255,255,0.95)',letterSpacing:'0.03em'}}>
            APEX AI
          </span>
          <span style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase'}}>
            Intelligent Assistant
          </span>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'0.62rem',color:'rgba(52,211,153,0.85)',letterSpacing:'0.08em'}}>
              ● Connected
            </span>
            <button
              onClick={onClose}
              style={{
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)',
                borderRadius:8, color:'rgba(255,255,255,0.50)', fontFamily:F,
                width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', outline:'none', transition:'all 0.15s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.color='rgba(255,255,255,0.50)';}}
            >✕</button>
          </div>
        </div>

        {/* ── Embedded website ── */}
        <iframe
          src={SITE_URL}
          title="Apex AI Tool"
          style={{
            flex:1,
            width:'100%',
            border:'none',
            display:'block',
            borderRadius:'0 0 24px 24px',
          }}
          allow="camera; microphone; clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
