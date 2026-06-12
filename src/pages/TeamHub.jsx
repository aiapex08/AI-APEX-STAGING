import { useState, useEffect, useMemo } from 'react';

const AZURE_SAS = 'sv=2025-11-05&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-30T13:08:36Z&st=2026-04-19T20:00:00Z&spr=https&sig=GMAKHd37xTTyBo5eeCg%2BQjzdT37ga%2FtmBDGWHjzfZTc%3D';
const DATA_URL = `https://apexfilestorage2.blob.core.windows.net/estimation-docs/apex-data.json?${AZURE_SAS}`;

const MEMBERS = [
  { id:'u001', name:'XYZ',                          role:'Cost Artist', photo:null     },
  { id:'u002', name:'Emelaine Jane',                role:'Cost Artist', photo:'/S.jpg' },
  { id:'u003', name:'Sachin Poojary',               role:'Estimator',   photo:'/g.jpg' },
  { id:'u004', name:'Mohammad Samee Hamid Khan',    role:'Estimator',   photo:'/h.jpg' },
  { id:'u005', name:'Moazzam Ali',                  role:'Estimator',   photo:'/i.jpg' },
  { id:'u006', name:'Benson Benjamine',             role:'Estimator',   photo:'/j.jpg' },
  { id:'u007', name:'Pranav Manjalam Kandiyil',     role:'Estimator',   photo:'/K.jpg' },
  { id:'u008', name:'Saeem Sajid Gadkari',          role:'Estimator',   photo:'/L.jpg' },
  { id:'u009', name:'Jaffar Shaik',                 role:'Estimator',   photo:'/M.jpg' },
];

/* ── read live from TeamAccess localStorage ── */
const TA_EMP_KEY  = 'ta_v6_emp';
const DIR_SALARY_FIELDS = ['basic','hra','car','mobile','transportation','food','others','bonus'];

const dirAgeInOrg = doj => {
  if (!doj) return '—';
  const ms = Date.now() - new Date(doj).getTime();
  if (ms < 0) return '—';
  const y = Math.floor(ms / (1000*60*60*24*365));
  const m = Math.floor((ms % (1000*60*60*24*365)) / (1000*60*60*24*30));
  return y > 0 ? `${y}y ${m}m` : m > 0 ? `${m}m` : '< 1m';
};

const dirFmtDoj = d => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }
  catch { return '—'; }
};

const loadDirectory = () => {
  try {
    const arr = JSON.parse(localStorage.getItem(TA_EMP_KEY) || '[]');
    return Object.fromEntries(arr.map(e => [e.id, e]));
  } catch { return {}; }
};

/* ── Request deduplication helpers (mirrors AIEstimation logic) ── */
const baseIdFn = id => (id || '').replace(/(_R\d+|_F\d+)+$/, '');
const revNum   = id => { const m = (id||'').match(/_R(\d+)$/); return m ? parseInt(m[1]) : 0; };

/* For each member's requests: group by base ID, keep latest revision */
const dedupeRequests = mine => {
  const map = {};
  mine.forEach(r => {
    const base = baseIdFn(r.id || '');
    if (!map[base] || revNum(r.id) > revNum(map[base].id)) map[base] = r;
  });
  return Object.values(map);
};

const ROLE_ORDER = ['Cost Artist', 'Estimator'];
const ROLE_STYLE = {
  'Cost Artist': { c:'rgba(255,200,60,0.95)',  bg:'rgba(200,150,0,0.10)',  bd:'rgba(220,170,0,0.35)'  },
  'Estimator':   { c:'rgba(140,190,255,0.95)', bg:'rgba(60,120,240,0.08)', bd:'rgba(100,160,255,0.28)' },
};

const fmt = v => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v || 0);

/* ── Thin glass tokens — uniform for all cards (matches hub card aesthetic) */
const G = {
  bg:      'rgba(255,255,255,0.038)',
  border:  '1px solid rgba(200,225,255,0.14)',
  shadow:  '0 28px 80px rgba(0,4,30,0.55), 0 4px 12px rgba(0,0,0,0.30), inset 0 1.5px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(180,210,255,0.05)',
  blur:    'blur(10px) saturate(130%) brightness(1.12)',
  topLine: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12) 28%,rgba(255,255,255,0.24) 50%,rgba(255,255,255,0.12) 72%,transparent)',
  divider: 'rgba(200,225,255,0.08)',
  statBg:  'rgba(255,255,255,0.045)',
  barTrack:'rgba(255,255,255,0.07)',
};

/* ── Avatar ── */
function Avatar({ name, photo, size = 44 }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = (name.charCodeAt(0) * 7 + (name.charCodeAt(1) || 0) * 13) % 360;
  if (photo) return (
    <img src={photo} alt={name} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0, display:'block' }}/>
  );
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`hsl(${hue},55%,22%)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:size*0.33, color:`hsl(${hue},70%,70%)`, flexShrink:0, letterSpacing:'0.04em', fontFamily:"'Inter',sans-serif" }}>
      {initials}
    </div>
  );
}

/* ── Spinner ── */
function Spinner() {
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:10, color:'rgba(255,255,255,0.32)', fontSize:'0.82rem', fontFamily:"'Inter',sans-serif" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation:'th-spin 1.1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Loading…
    </div>
  );
}

/* ── Section heading ── */
function SecHead({ icon, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
      <span style={{ fontSize:'0.80rem' }}>{icon}</span>
      <span style={{ fontSize:'0.57rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(160,200,255,0.50)' }}>{label}</span>
      <div style={{ flex:1, height:1, background:'rgba(200,225,255,0.07)' }}/>
    </div>
  );
}

/* ── Achievements ── */
function getAchievements(member, rank) {
  const b = [];
  if (rank === 0) b.push({ icon:'🥇', label:'Top Performer' });
  else if (rank === 1) b.push({ icon:'🥈', label:'Silver Estimator' });
  else if (rank === 2) b.push({ icon:'🥉', label:'Bronze Estimator' });
  if (member.winPct >= 70) b.push({ icon:'🏆', label:'High Win Rate' });
  if (member.totalVal >= 1_000_000) b.push({ icon:'💎', label:'Million+ Portfolio' });
  if (member.completed >= 10) b.push({ icon:'⚡', label:'High Throughput' });
  if (member.inProg >= 3) b.push({ icon:'🔥', label:'Active Handler' });
  if (member.approved >= 5) b.push({ icon:'✅', label:'Director Approved' });
  if (member.total === 0) b.push({ icon:'🌱', label:'Getting Started' });
  return b;
}

/* ── AI Suggestions ── */
function getAISuggestions(member, rank) {
  const s = [];
  if (member.total === 0) { s.push("No requests assigned yet. Ensure onboarding and system access are complete to begin contributing to the pipeline."); return s; }
  if (rank === 0) s.push("Top performer in the department. Consider a mentoring role to scale your expertise and elevate the team's overall win rate.");
  if (member.winPct < 40 && member.completed > 0)
    s.push("Win rate is below 40%. Focus on competitive pricing, stronger value propositions, and tighter engagement during the proposal phase.");
  else if (member.winPct >= 70)
    s.push("Excellent win rate above 70%. Document and share proposal strategies — they could significantly benefit the broader estimation team.");
  else if (member.winPct >= 50)
    s.push("Solid win rate. Target premium-margin opportunities and refine follow-up processes to push conversion above 60%.");
  if (member.inProg > 5)
    s.push(`Active workload is high with ${member.inProg} ongoing requests. Prioritize near-deadline items to maintain quality.`);
  if (member.totalVal >= 1_000_000)
    s.push(`Managing AED ${fmt(member.totalVal)} in project value. Reduce discounting on premium opportunities to protect margins.`);
  if (member.completed > 5 && member.winPct >= 50)
    s.push("Strong execution track record — a solid candidate for complex, high-value estimations.");
  if (s.length < 2) s.push("Consistent throughput will unlock advanced performance tiers. Keep building your portfolio of completed estimations.");
  return s.slice(0, 3);
}

/* ── Expanded pop-out card ─────────────────────────────────────────────── */
function ExpandedCard({ u, rank, onCollapse }) {
  const rs           = ROLE_STYLE[u.role] || ROLE_STYLE.Estimator;
  const achievements = getAchievements(u, rank);
  const suggestions  = getAISuggestions(u, rank);
  const winColor     = u.winPct >= 60 ? '#34d399' : u.winPct >= 40 ? '#f59e0b' : '#ef4444';
  const MEDALS       = ['🥇','🥈','🥉'];

  return (
    <div
      style={{
        gridColumn:       '1 / -1',
        position:         'relative',
        display:          'flex',
        minHeight:        '15vh',          /* pop-out height reference */
        borderRadius:     18,
        overflow:         'hidden',
        background:       G.bg,
        border:           G.border,
        boxShadow:        G.shadow,
        backdropFilter:   G.blur,
        WebkitBackdropFilter: G.blur,
        animation:        'th-popOut 0.28s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* top specular streak */}
      <div style={{ position:'absolute', top:0, left:'14%', right:'14%', height:1, pointerEvents:'none', zIndex:4,
        background: G.topLine }}/>
      {/* left edge glint */}
      <div style={{ position:'absolute', top:'6%', left:0, height:'30%', width:1, zIndex:4,
        background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.12) 40%,rgba(255,255,255,0.07) 70%,transparent)', pointerEvents:'none' }}/>
      {/* inner lens */}
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', borderRadius:'inherit',
        background:'linear-gradient(130deg,rgba(255,255,255,0.035) 0%,rgba(255,255,255,0.010) 30%,transparent 55%)' }}/>

      {/* ✕ close */}
      <button
        onClick={e => { e.stopPropagation(); onCollapse(); }}
        style={{
          position:'absolute', top:12, right:12, zIndex:10,
          width:26, height:26, borderRadius:'50%',
          background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.10)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          color:'rgba(255,255,255,0.40)', fontSize:'0.72rem', lineHeight:1,
          transition:'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.color='#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.055)'; e.currentTarget.style.color='rgba(255,255,255,0.40)'; }}
      >✕</button>

      {/* ── LEFT — profile pic panel ─────────────────── */}
      <div style={{
        width: 210, flexShrink:0, zIndex:2,
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'28px 18px 24px', gap:11,
        borderRight:`1px solid ${G.divider}`,
      }}>
        {/* medal */}
        {rank < 3 && (
          <div style={{ fontSize:'1.60rem', lineHeight:1, animation:'th-pulse 2.8s ease-in-out infinite' }}>
            {MEDALS[rank]}
          </div>
        )}

        {/* big profile pic */}
        <div style={{
          width:110, height:110, borderRadius:'50%', overflow:'hidden', flexShrink:0,
          border:'2px solid rgba(200,225,255,0.22)',
          boxShadow:'0 0 0 4px rgba(200,225,255,0.05), 0 8px 32px rgba(0,0,20,0.45)',
        }}>
          <Avatar name={u.name} photo={u.photo} size={110}/>
        </div>

        {/* name */}
        <div style={{
          fontFamily:"'Cinzel',serif", fontSize:'0.82rem', fontWeight:700,
          letterSpacing:'0.06em', textTransform:'uppercase', textAlign:'center',
          color:'rgba(225,238,255,0.94)', lineHeight:1.4,
        }}>{u.name}</div>

        {/* role */}
        <span style={{ fontSize:'0.57rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase',
          padding:'2px 12px', borderRadius:100, background:rs.bg, border:`1px solid ${rs.bd}`, color:rs.c }}>
          {u.role}
        </span>

        {/* rank */}
        <div style={{ fontSize:'0.50rem', letterSpacing:'0.14em', textTransform:'uppercase',
          color:'rgba(160,200,255,0.38)', textAlign:'center' }}>
          Rank #{rank + 1}
        </div>

        {/* divider */}
        <div style={{ width:'55%', height:1, background: G.divider, margin:'2px 0' }}/>

        {/* value */}
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'1.20rem', fontWeight:800, color:'rgba(255,200,75,0.90)', lineHeight:1 }}>
            AED {fmt(u.totalVal)}
          </div>
          <div style={{ fontSize:'0.42rem', letterSpacing:'0.12em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.24)', marginTop:4 }}>Total Value</div>
        </div>

        {/* win rate pill */}
        <div style={{ padding:'4px 15px', borderRadius:100, textAlign:'center',
          background:`${winColor}14`, border:`1px solid ${winColor}38` }}>
          <div style={{ fontSize:'0.95rem', fontWeight:800, color:`${winColor}ee`, lineHeight:1 }}>
            {u.winPct}%
          </div>
          <div style={{ fontSize:'0.40rem', letterSpacing:'0.10em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.24)', marginTop:2 }}>Win Rate</div>
        </div>
      </div>

      {/* ── RIGHT — detail panel ─────────────────────── */}
      <div style={{
        flex:1, minWidth:0, overflowY:'auto', zIndex:2,
        padding:'22px 22px', display:'flex', flexDirection:'column', gap:18,
      }}>

        {/* Performance */}
        <section>
          <SecHead icon="📊" label="Performance"/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[
              { label:'Assigned',  value:u.total,     c:'rgba(160,200,255,0.92)' },
              { label:'Completed', value:u.completed, c:'rgba(52,211,153,0.92)'  },
              { label:'Active',    value:u.inProg,    c:'rgba(251,191,36,0.92)'  },
              { label:'Approved',  value:u.approved,  c:'rgba(168,85,247,0.92)'  },
            ].map(s => (
              <div key={s.label} style={{ background: G.statBg, borderRadius:10, padding:'11px 6px', textAlign:'center' }}>
                <div style={{ fontSize:'1.45rem', fontWeight:800, color:s.c, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'0.44rem', letterSpacing:'0.10em', textTransform:'uppercase',
                  color:'rgba(255,255,255,0.28)', marginTop:5 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* win rate bar */}
          <div style={{ marginTop:8, background: G.statBg, borderRadius:10, padding:'9px 13px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:'0.56rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>Win Rate</span>
              <span style={{ fontSize:'0.70rem', fontWeight:700, color:`${winColor}ee` }}>{u.winPct}%</span>
            </div>
            <div style={{ height:4, borderRadius:2, background: G.barTrack }}>
              <div style={{ height:'100%', borderRadius:2, width:`${u.winPct}%`,
                background:`linear-gradient(90deg,${winColor},${winColor}88)`, transition:'width 0.9s ease' }}/>
            </div>
          </div>
        </section>

        {/* Achievements + Analysis side by side */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          <section>
            <SecHead icon="🏆" label="Achievements"/>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {achievements.length > 0 ? achievements.map((a, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 11px',
                  borderRadius:100, background: G.statBg, border: G.border,
                  fontSize:'0.62rem', fontWeight:600, color:'rgba(210,228,255,0.80)' }}>
                  <span>{a.icon}</span>{a.label}
                </div>
              )) : (
                <div style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.22)', fontStyle:'italic' }}>
                  Milestones unlock achievements.
                </div>
              )}
            </div>
          </section>

          <section>
            <SecHead icon="📈" label="Analysis"/>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {[
                { label:'Completion', pct: u.total     ? Math.round(u.completed / u.total * 100)     : 0, c:'#34d399' },
                { label:'Approval',   pct: u.completed ? Math.round(u.approved  / u.completed * 100) : 0, c:'#a855f7' },
                { label:'Active Load',pct: Math.min(100, u.inProg * 10), c:'#f59e0b' },
              ].map(b => (
                <div key={b.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontSize:'0.56rem', letterSpacing:'0.06em', textTransform:'uppercase',
                      color:'rgba(255,255,255,0.28)' }}>{b.label}</span>
                    <span style={{ fontSize:'0.60rem', fontWeight:700, color:b.c }}>{b.pct}%</span>
                  </div>
                  <div style={{ height:3.5, borderRadius:2, background: G.barTrack }}>
                    <div style={{ height:'100%', borderRadius:2, width:`${b.pct}%`, background:b.c,
                      opacity:0.82, transition:'width 0.9s ease' }}/>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* AI Suggestions */}
        <section>
          <SecHead icon="🤖" label="AI Suggestions"/>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {suggestions.map((s, i) => (
              <div key={i} style={{
                display:'flex', gap:8, padding:'8px 12px',
                background:'rgba(124,58,237,0.06)', border:'1px solid rgba(168,85,247,0.13)',
                borderRadius:8, fontSize:'0.68rem', lineHeight:1.56,
                color:'rgba(210,226,255,0.70)',
              }}>
                <div style={{ color:'rgba(168,85,247,0.70)', fontWeight:700, flexShrink:0, marginTop:1 }}>▸</div>
                {s}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Expanded Detail Card (fills KPI grid area) ──────────────────────── */
function ExpandedDetailCard({ u, rank, allCount, onClose }) {
  const rs       = ROLE_STYLE[u.role] || ROLE_STYLE.Estimator;
  const winColor = u.winPct >= 60 ? '#34d399' : u.winPct >= 40 ? '#f59e0b' : '#ef4444';
  const wonVal   = u.completed > 0 ? Math.round(u.approved / u.completed * u.totalVal) : 0;
  const MEDALS   = ['🥇','🥈','🥉'];
  const kpiTier  = rank === 0 ? 'Top Performer'
                 : rank === 1 ? 'Senior Performer'
                 : rank === 2 ? 'Strong Performer'
                 : u.winPct >= 50 ? 'Good Performer' : 'Developing';

  const Row = ({ label, value, sub }) => (
    <div style={{
      background:'rgba(255,255,255,0.035)', border:'1px solid rgba(255,255,255,0.075)',
      borderRadius:13, padding:'13px 16px',
    }}>
      <div style={{ fontSize:'0.44rem', fontWeight:700, textTransform:'uppercase',
        letterSpacing:'0.14em', color:'rgba(160,200,255,0.36)', marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:'0.92rem', fontWeight:700, color:'rgba(225,238,255,0.92)', lineHeight:1.2 }}>{value}</div>
      {sub && <div style={{ fontSize:'0.56rem', color:'rgba(255,255,255,0.26)', marginTop:3 }}>{sub}</div>}
    </div>
  );

  return (
    /* backdrop — click outside closes */
    <div onClick={onClose} style={{ position:'absolute', inset:0, zIndex:50 }}>
      {/* panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:'absolute', inset:12,
          display:'flex', borderRadius:20, overflow:'hidden',
          background: G.bg, border: G.border, boxShadow: G.shadow,
          backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
          animation:'th-popOut 0.30s cubic-bezier(0.22,1,0.36,1)',
          fontFamily:"'Inter',sans-serif",
        }}
      >
        {/* specular top */}
        <div style={{ position:'absolute', top:0, left:'14%', right:'14%', height:1,
          pointerEvents:'none', zIndex:4, background:G.topLine }}/>

        {/* ✕ close */}
        <button onClick={onClose} style={{
          position:'absolute', top:13, right:14, zIndex:10,
          width:28, height:28, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.12)',
          background:'rgba(255,255,255,0.06)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'rgba(255,255,255,0.40)', fontSize:'0.72rem', transition:'all 0.15s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='rgba(255,255,255,0.40)';}}
        >✕</button>

        {/* ── LEFT — profile ── */}
        <div style={{
          width:'34%', flexShrink:0, zIndex:2,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:'32px 24px', gap:13,
          borderRight:`1px solid ${G.divider}`,
          background:'linear-gradient(160deg,rgba(255,255,255,0.022) 0%,rgba(255,255,255,0.006) 100%)',
        }}>
          {rank < 3 && (
            <div style={{ fontSize:'2.2rem', lineHeight:1, animation:'th-pulse 2.8s ease-in-out infinite' }}>
              {MEDALS[rank]}
            </div>
          )}

          <div style={{
            width:120, height:120, borderRadius:'50%', overflow:'hidden', flexShrink:0,
            border:'2px solid rgba(200,225,255,0.22)',
            boxShadow:'0 0 0 5px rgba(200,225,255,0.05), 0 12px 44px rgba(0,0,20,0.60)',
          }}>
            <Avatar name={u.name} photo={u.photo} size={120}/>
          </div>

          <div style={{
            fontFamily:"'Cinzel',serif", fontSize:'0.88rem', fontWeight:700,
            letterSpacing:'0.05em', textTransform:'uppercase', textAlign:'center',
            color:'rgba(225,238,255,0.94)', lineHeight:1.4,
          }}>{u.name}</div>

          <span style={{
            fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase',
            padding:'3px 14px', borderRadius:100, background:rs.bg, border:`1px solid ${rs.bd}`, color:rs.c,
          }}>{u.role}</span>

          <div style={{ width:'52%', height:1, background:G.divider }}/>

          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'1.60rem', fontWeight:800, color:`${winColor}ee`, lineHeight:1 }}>
              {u.winPct}%
            </div>
            <div style={{ fontSize:'0.40rem', letterSpacing:'0.12em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.24)', marginTop:4 }}>Win Rate</div>
          </div>

          <div style={{
            padding:'4px 18px', borderRadius:100, textAlign:'center',
            background:`${winColor}10`, border:`1px solid ${winColor}28`,
          }}>
            <div style={{ fontSize:'0.52rem', fontWeight:600, color:'rgba(255,255,255,0.38)',
              letterSpacing:'0.08em', textTransform:'uppercase' }}>
              Rank #{rank + 1} of {allCount}
            </div>
          </div>
        </div>

        {/* ── RIGHT — details ── */}
        <div style={{ flex:1, minWidth:0, overflowY:'auto', zIndex:2, padding:'26px 26px' }}>
          <div style={{ fontSize:'0.48rem', fontWeight:700, textTransform:'uppercase',
            letterSpacing:'0.18em', color:'rgba(160,200,255,0.36)', marginBottom:18 }}>
            Estimator Profile
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
            <Row label="Date of Joining"     value={u.doj || '—'}                   sub="Employment start"            />
            <Row label="Experience"          value={u.exp || '—'}                   sub="With NAFFCO"                 />
            <Row label="KPI Info"            value={kpiTier}                        sub={`${u.completed} completed · ${u.winPct}% win`} />
            <Row label="Ranking"             value={`#${rank + 1} of ${allCount}`}  sub="By total assignments"        />
            <Row label="Total Quoted Value"  value={u.totalVal > 0 ? `AED ${fmt(u.totalVal)}` : '—'} sub="Portfolio value" />
            <Row label="Quoted Count"        value={`${u.total}`}                   sub="Total requests assigned"     />
            <Row label="Won Value"           value={wonVal > 0 ? `AED ${fmt(wonVal)}` : '—'} sub="Estimated won value" />
            <Row label="Active Now"          value={`${u.inProg}`}                  sub="In progress"                 />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Flip Card ── */
function FlipCard({ u, rank, isFlipped, isBlurred, onFlip }) {
  const [hov, setHov] = useState(false);
  const rs       = ROLE_STYLE[u.role] || ROLE_STYLE.Estimator;
  const winColor = u.winPct >= 60 ? '#34d399' : u.winPct >= 40 ? '#f59e0b' : '#ef4444';
  const acvs     = getAchievements(u, rank);
  const hue      = (u.name.charCodeAt(0)*7 + (u.name.charCodeAt(1)||0)*13) % 360;

  const glass = (alpha='0.88') => ({
    backdropFilter: 'blur(24px) saturate(165%) brightness(1.08)',
    WebkitBackdropFilter: 'blur(24px) saturate(165%) brightness(1.08)',
    boxShadow: `0 28px 70px rgba(0,0,28,0.72), 0 2px 8px rgba(0,0,20,0.50), inset 0 1.5px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.30)`,
  });

  return (
    <div style={{
      height: 348,
      perspective: '1100px',
      filter:    isBlurred ? 'blur(6px) brightness(0.26) saturate(0.28)' : 'none',
      opacity:   isBlurred ? 0.60 : 1,
      transform: isBlurred ? 'scale(0.94)' : (hov && !isFlipped ? 'scale(1.025) translateY(-3px)' : 'scale(1)'),
      transition:'filter 0.38s ease, opacity 0.38s ease, transform 0.28s ease',
    }}>
      <div style={{
        position:'relative', width:'100%', height:'100%',
        transformStyle:'preserve-3d',
        transition:'transform 0.72s cubic-bezier(0.35,0.10,0.25,1.00)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>

        {/* ══ FRONT ══ */}
        <div
          onClick={() => !isFlipped && onFlip(u.id)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            position:'absolute', inset:0,
            backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
            borderRadius:22,
            overflow:'hidden',
            background:`radial-gradient(ellipse at 50% -10%, hsl(${hue},44%,14%) 0%, rgba(5,4,14,0.92) 72%)`,
            border: hov ? '1px solid rgba(255,255,255,0.30)' : '1px solid rgba(255,255,255,0.17)',
            ...glass(),
            display:'flex', flexDirection:'column',
            cursor:'pointer',
            transition:'border-color 0.22s ease',
          }}
        >
          {/* Portrait */}
          <div style={{ flex:'0 0 63%', position:'relative', overflow:'hidden' }}>
            {u.photo
              ? <img src={u.photo} alt={u.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }}/>
              : <div style={{
                    width:'100%', height:'100%',
                    background:`radial-gradient(ellipse at 50% 30%, hsl(${hue},52%,19%) 0%, hsl(${hue},42%,7%) 70%)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                  <div style={{
                    width:104, height:104, borderRadius:'50%',
                    background:`hsl(${hue},55%,22%)`,
                    border:'2.5px solid rgba(255,255,255,0.20)',
                    boxShadow:`0 0 55px hsl(${hue},55%,18%), 0 0 20px rgba(0,0,0,0.50)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:38, fontWeight:800, color:`hsl(${hue},80%,73%)`,
                    fontFamily:"'Inter',sans-serif",
                  }}>
                    {u.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                </div>
            }
            {/* Gradient fade */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'58%', pointerEvents:'none',
              background:'linear-gradient(to top, rgba(5,4,14,1) 0%, rgba(5,4,14,0.18) 78%, transparent 100%)' }}/>
            {/* Medal */}
            {rank < 3 && (
              <div style={{ position:'absolute', top:10, left:12, fontSize:'1.38rem', lineHeight:1,
                filter:'drop-shadow(0 2px 5px rgba(0,0,0,0.75))' }}>
                {['🥇','🥈','🥉'][rank]}
              </div>
            )}
            {/* Name overlay */}
            <div style={{ position:'absolute', bottom:10, left:14, right:14,
              fontSize:'0.80rem', fontWeight:700, color:'rgba(228,240,255,0.96)',
              textShadow:'0 1px 10px rgba(0,0,25,0.95)',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {u.name}
            </div>
          </div>

          {/* Info panel */}
          <div style={{ flex:1, padding:'8px 13px 11px', display:'flex', flexDirection:'column', gap:6 }}>

            {/* Row 1 — role | emp # · rank */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.48rem', fontWeight:700, letterSpacing:'0.09em', textTransform:'uppercase',
                padding:'2px 9px', borderRadius:100, background:rs.bg, border:`1px solid ${rs.bd}`, color:rs.c }}>
                {u.role}
              </span>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ fontSize:'0.44rem', color:'rgba(160,200,255,0.50)', letterSpacing:'0.06em',
                  fontWeight:600, maxWidth:60, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {u.empNo || u.id}
                </span>
                <span style={{ fontSize:'0.40rem', color:'rgba(255,255,255,0.18)' }}>·</span>
                <span style={{ fontSize:'0.44rem', fontWeight:700, color:'rgba(255,255,255,0.30)', letterSpacing:'0.04em' }}>
                  #{rank+1}
                </span>
              </div>
            </div>

            {/* Row 2 — total quoted value */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.96rem', fontWeight:800, color:'rgba(255,200,78,0.94)', lineHeight:1 }}>
                AED {fmt(u.totalVal)}
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:3 }}>
                <span style={{ fontSize:'0.38rem', letterSpacing:'0.11em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)' }}>
                  Total Quoted Value
                </span>
                <span style={{ fontSize:'0.38rem', letterSpacing:'0.08em', textTransform:'uppercase',
                  color:'rgba(160,200,255,0.38)', fontWeight:600 }}>
                  {u.total} quotes
                </span>
              </div>
            </div>

            {/* Row 3 — tap hint */}
            <div style={{ fontSize:'0.40rem', color:'rgba(255,255,255,0.15)', textAlign:'center', letterSpacing:'0.08em' }}>
              — tap to open —
            </div>
          </div>

          {/* Specular top streak */}
          <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, pointerEvents:'none',
            background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.30) 50%,transparent)' }}/>
          <div style={{ position:'absolute', top:'6%', left:0, height:'25%', width:1, pointerEvents:'none',
            background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.16) 40%,transparent)' }}/>
        </div>

        {/* ══ BACK ══ */}
        <div style={{
          position:'absolute', inset:0,
          backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
          borderRadius:22,
          overflow:'hidden',
          background:'rgba(6,4,14,0.92)',
          border:'1px solid rgba(255,255,255,0.16)',
          ...glass(),
          padding:'13px',
          display:'flex', flexDirection:'column', gap:8,
        }}>
          {/* Top specular */}
          <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, pointerEvents:'none',
            background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.24) 50%,transparent)' }}/>

          {/* Close */}
          <button
            onClick={e => { e.stopPropagation(); onFlip(null); }}
            style={{
              position:'absolute', top:10, right:10, zIndex:5,
              width:24, height:24, borderRadius:'50%',
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.13)',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              color:'rgba(255,255,255,0.42)', fontSize:'0.62rem', transition:'all 0.15s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.16)';e.currentTarget.style.color='#fff';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='rgba(255,255,255,0.42)';}}
          >✕</button>

          {/* Mini profile */}
          <div style={{ display:'flex', alignItems:'center', gap:9, paddingRight:28 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', overflow:'hidden', flexShrink:0,
              border:'1.5px solid rgba(200,225,255,0.24)',
              boxShadow:`0 0 18px hsl(${hue},55%,18%)` }}>
              <Avatar name={u.name} photo={u.photo} size={40}/>
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'rgba(228,240,255,0.94)',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</div>
              <span style={{ fontSize:'0.44rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase',
                padding:'1px 7px', borderRadius:100, background:rs.bg, border:`1px solid ${rs.bd}`, color:rs.c }}>
                {u.role}
              </span>
            </div>
          </div>

          {/* 2×2 stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {[
              {label:'Assigned', value:u.total,     c:'rgba(160,200,255,0.93)'},
              {label:'Done',     value:u.completed, c:'rgba(52,211,153,0.93)' },
              {label:'Active',   value:u.inProg,    c:'rgba(251,191,36,0.93)' },
              {label:'Approved', value:u.approved,  c:'rgba(168,85,247,0.93)' },
            ].map(s=>(
              <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10,
                padding:'9px 5px', textAlign:'center', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize:'1.30rem', fontWeight:800, color:s.c, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'0.41rem', letterSpacing:'0.09em', textTransform:'uppercase',
                  color:'rgba(255,255,255,0.26)', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Win rate */}
          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:9, padding:'8px 11px',
            border:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:'0.50rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>Win Rate</span>
              <span style={{ fontSize:'0.64rem', fontWeight:700, color:winColor }}>{u.winPct}%</span>
            </div>
            <div style={{ height:3, borderRadius:2, background:'rgba(255,255,255,0.07)' }}>
              <div style={{ height:'100%', borderRadius:2, width:`${u.winPct}%`,
                background:`linear-gradient(90deg,${winColor},${winColor}60)` }}/>
            </div>
          </div>

          {/* Portfolio value */}
          <div style={{ textAlign:'center', padding:'5px 0', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize:'1.05rem', fontWeight:800, color:'rgba(255,200,78,0.93)', lineHeight:1 }}>
              AED {fmt(u.totalVal)}
            </div>
            <div style={{ fontSize:'0.40rem', letterSpacing:'0.12em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.26)', marginTop:3 }}>Total Portfolio</div>
          </div>

          {/* Achievements */}
          {acvs.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {acvs.slice(0,3).map((a,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 8px',
                  borderRadius:100, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
                  fontSize:'0.52rem', color:'rgba(210,228,255,0.78)' }}>
                  {a.icon} {a.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Flip Overlay — 60 % screen modal with card-flip entry ───────────── */
function FlipOverlay({ u, rank, allCount, onClose }) {
  const rs          = ROLE_STYLE[u.role] || ROLE_STYLE.Estimator;
  const winColor    = u.winPct >= 60 ? '#34d399' : u.winPct >= 40 ? '#f59e0b' : '#ef4444';
  const achievements = getAchievements(u, rank);
  const suggestions  = getAISuggestions(u, rank);
  const hue         = (u.name.charCodeAt(0)*7 + (u.name.charCodeAt(1)||0)*13) % 360;
  const kpiTier     = rank === 0 ? 'Top Performer' : rank === 1 ? 'Senior Performer'
                    : rank === 2 ? 'Strong Performer' : u.winPct >= 50 ? 'Good Performer' : 'Developing';
  const MEDALS      = ['🥇','🥈','🥉'];

  const [selMonth, setSelMonth] = useState(null);

  const salary         = u.salary || null;
  const gross          = salary ? DIR_SALARY_FIELDS.reduce((s,k)=>s+(Number(salary[k])||0),0) : 0;
  const salaryBreakup  = salary ? DIR_SALARY_FIELDS.map(k=>[k.charAt(0).toUpperCase()+k.slice(1),salary[k]]).filter(([,v])=>v>0).map(([k,v])=>`${k}: ${Number(v).toLocaleString()}`).join(' · ') : null;
  const wonVal         = u.wonVal || 0;
  const completionRate = u.total     ? Math.round(u.completed / u.total     * 100) : 0;
  const approvalRate   = u.completed ? Math.round(u.approved  / u.completed * 100) : 0;
  const months         = u.monthly   ? Object.keys(u.monthly).sort().reverse() : [];
  const monthData      = selMonth && u.monthly ? (u.monthly[selMonth] || {total:0,completed:0,approved:0,value:0,wonValue:0}) : null;
  const fmtMonth       = key => { const [y,m] = key.split('-'); return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]} ${y}`; };

  const tierColor = rank===0?'#fbbf24':rank===1?'rgba(200,200,215,0.92)':rank===2?'#f97316':u.winPct>=50?'rgba(140,190,255,0.90)':'rgba(155,155,170,0.65)';
  const tierBg    = rank===0?'rgba(251,191,36,0.10)':rank===1?'rgba(200,200,215,0.07)':rank===2?'rgba(249,115,22,0.10)':'rgba(60,120,240,0.08)';
  const tierBd    = rank===0?'rgba(251,191,36,0.35)':rank===1?'rgba(200,200,215,0.25)':rank===2?'rgba(249,115,22,0.35)':'rgba(100,160,255,0.28)';

  const kpi = monthData ? {
    win:        monthData.total     ? Math.round(monthData.wonCount  / monthData.total     * 100) : 0,
    completion: monthData.total     ? Math.round(monthData.completed / monthData.total     * 100) : 0,
    approval:   monthData.completed ? Math.round(monthData.approved  / monthData.completed * 100) : 0,
    quotedVal:  monthData.value, wonVal: monthData.wonValue, wonCount: monthData.wonCount||0, total: monthData.total,
  } : { win: u.total ? Math.round((u.wonCount||0) / u.total * 100) : 0, completion:completionRate, approval:approvalRate, quotedVal:u.totalVal, wonVal, wonCount:u.wonCount||0, total:u.total };

  const InfoRow = ({ label, value, sub, accent }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
      padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize:'0.50rem', letterSpacing:'0.08em', textTransform:'uppercase',
        color:'rgba(130,170,255,0.36)', flexShrink:0, paddingRight:14, paddingTop:2 }}>{label}</span>
      <div style={{ textAlign:'right', minWidth:0 }}>
        <div style={{ fontSize:'0.82rem', fontWeight:600, color:accent||'rgba(215,230,255,0.86)', lineHeight:1.25 }}>{value}</div>
        {sub && <div style={{ fontSize:'0.50rem', color:'rgba(255,255,255,0.30)', marginTop:3 }}>{sub}</div>}
      </div>
    </div>
  );

  const KpiRow = ({ label, pct, color }) => (
    <div style={{ marginBottom:11 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:'0.52rem', letterSpacing:'0.07em', textTransform:'uppercase', color:'rgba(160,200,255,0.38)' }}>{label}</span>
        <span style={{ fontSize:'0.65rem', fontWeight:700, color }}>{pct}%</span>
      </div>
      <div style={{ height:3, borderRadius:2, background:'rgba(255,255,255,0.07)' }}>
        <div style={{ height:'100%', borderRadius:2, width:`${Math.min(100,pct)}%`,
          background:`linear-gradient(90deg,${color},${color}70)`, transition:'width 0.9s ease' }}/>
      </div>
    </div>
  );

  const SLabel = ({ children, mt }) => (
    <div style={{ fontSize:'0.44rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase',
      color:'rgba(130,170,255,0.28)', paddingBottom:5, marginBottom:2,
      marginTop: mt ?? 20, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      {children}
    </div>
  );

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:800,
      background:'rgba(0,0,8,0.82)',
      backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      animation:'th-fadeIn 0.20s ease',
      fontFamily:"'Inter',sans-serif",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position:'relative', display:'flex',
        width:'min(960px,90vw)', height:'min(600px,84vh)',
        borderRadius:24, overflow:'hidden',
        background:G.bg, border:G.border, boxShadow:G.shadow,
        backdropFilter:G.blur, WebkitBackdropFilter:G.blur,
        animation:'th-cardFlip 0.52s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ position:'absolute', top:0, left:'14%', right:'14%', height:1,
          pointerEvents:'none', zIndex:4, background:G.topLine }}/>

        <button onClick={onClose} style={{
          position:'absolute', top:14, right:14, zIndex:20,
          width:30, height:30, borderRadius:'50%',
          border:'1px solid rgba(255,255,255,0.12)',
          background:'rgba(255,255,255,0.06)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'rgba(255,255,255,0.40)', fontSize:'0.76rem', transition:'all 0.15s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='rgba(255,255,255,0.40)';}}
        >✕</button>

        {/* ── LEFT: full-cover profile photo ── */}
        <div style={{
          width:'38%', flexShrink:0, position:'relative', overflow:'hidden',
          borderRight:`1px solid ${G.divider}`,
        }}>
          {/* full-cover image or initials bg */}
          {u.photo
            ? <img src={u.photo} alt={u.name} style={{
                position:'absolute', inset:0, width:'100%', height:'100%',
                objectFit:'cover', objectPosition:'top center',
              }}/>
            : <div style={{
                position:'absolute', inset:0,
                background:`radial-gradient(ellipse at 50% 30%, hsl(${hue},52%,20%) 0%, hsl(${hue},42%,7%) 80%)`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <div style={{
                  fontSize:'7rem', fontWeight:800, color:`hsl(${hue},70%,62%)`,
                  opacity:0.28, fontFamily:"'Inter',sans-serif", userSelect:'none', letterSpacing:'-0.02em',
                }}>
                  {u.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
                </div>
              </div>
          }

          {/* top fade */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'22%', pointerEvents:'none',
            background:'linear-gradient(to bottom,rgba(0,0,0,0.55) 0%,transparent 100%)' }}/>
          {/* bottom fade for text */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'65%', pointerEvents:'none',
            background:'linear-gradient(to top,rgba(2,1,10,0.97) 0%,rgba(2,1,10,0.72) 45%,transparent 100%)' }}/>

          {/* medal — top-left */}
          {rank < 3 && (
            <div style={{ position:'absolute', top:14, left:16, zIndex:3, fontSize:'2.0rem', lineHeight:1,
              animation:'th-pulse 2.8s ease-in-out infinite',
              filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.80))' }}>
              {MEDALS[rank]}
            </div>
          )}

          {/* info overlay at bottom */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:3, padding:'16px 20px 22px' }}>
            <div style={{
              fontFamily:"'Cinzel',serif", fontSize:'1.00rem', fontWeight:700,
              letterSpacing:'0.06em', textTransform:'uppercase',
              color:'rgba(225,238,255,0.96)', lineHeight:1.3,
              textShadow:'0 2px 12px rgba(0,0,20,0.90)', marginBottom:9,
            }}>{u.name}</div>

            <span style={{
              fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase',
              padding:'2px 14px', borderRadius:100,
              background:rs.bg, border:`1px solid ${rs.bd}`, color:rs.c,
            }}>{u.role}</span>

            <div style={{ marginTop:12, display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:'0.96rem', fontWeight:700, color:'rgba(200,225,255,0.88)', lineHeight:1 }}>
                  {u.exp || '—'}
                </div>
                <div style={{ fontSize:'0.40rem', letterSpacing:'0.12em', textTransform:'uppercase',
                  color:'rgba(255,255,255,0.36)', marginTop:3 }}>Experience</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'0.88rem', fontWeight:700, color:'rgba(160,200,255,0.72)', lineHeight:1 }}>
                  {u.empNo || u.id}
                </div>
                <div style={{ fontSize:'0.40rem', letterSpacing:'0.12em', textTransform:'uppercase',
                  color:'rgba(255,255,255,0.36)', marginTop:3 }}>Emp #</div>
              </div>
            </div>

            <div style={{ fontSize:'0.46rem', letterSpacing:'0.14em', textTransform:'uppercase',
              color:'rgba(160,200,255,0.36)', marginTop:8 }}>
              Rank #{rank+1} of {allCount}
            </div>
          </div>
        </div>

        {/* ── RIGHT: details (no boxes) ── */}
        <div style={{ flex:1, minWidth:0, overflowY:'auto', padding:'20px 24px',
          display:'flex', flexDirection:'column' }}>

          {/* KPI Tier — prominent header */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18,
            paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize:'0.42rem', fontWeight:700, letterSpacing:'0.16em',
              textTransform:'uppercase', color:'rgba(160,200,255,0.28)' }}>KPI Tier</span>
            <span style={{ fontSize:'0.74rem', fontWeight:700, letterSpacing:'0.05em',
              padding:'3px 18px', borderRadius:100,
              background:tierBg, border:`1px solid ${tierBd}`, color:tierColor }}>
              {kpiTier}
            </span>
          </div>

          {/* PROFILE */}
          <SLabel mt={0}>Profile</SLabel>
          <InfoRow label="Emp #"       value={u.empNo || u.id} />
          <InfoRow label="DOJ"         value={u.doj || '—'} />
          <InfoRow label="Experience"  value={u.exp || '—'} />
          <InfoRow label="Designation" value={u.designation || u.role} />
          <InfoRow label="Status"      value={u.status || 'Active'}
            accent={u.status==='Resigned'?'rgba(239,68,68,0.85)':u.status==='On Leave'?'rgba(251,191,36,0.85)':'rgba(52,211,153,0.85)'} />
          {gross > 0
            ? <InfoRow label="Salary"
                value={`AED ${gross.toLocaleString()} / mo`}
                sub={salaryBreakup || undefined}
              />
            : <InfoRow label="Salary" value="—" />
          }

          {/* QUOTATIONS */}
          <SLabel>Quotations</SLabel>
          <InfoRow label="Total Quotations"   value={u.total} sub="unique projects (latest revision)" />
          <InfoRow label="Total Quoted Value" value={u.totalVal > 0 ? `AED ${fmt(u.totalVal)}` : '—'} sub="latest revision value per project" accent="rgba(255,200,75,0.92)" />
          <InfoRow label="Total Won Value"    value={wonVal > 0 ? `AED ${fmt(wonVal)}` : '—'} sub={u.wonCount > 0 ? `${u.wonCount} project${u.wonCount>1?'s':''} marked Won by Sales` : 'no sales Won status set'} accent={wonVal > 0 ? 'rgba(52,211,153,0.92)' : 'rgba(255,255,255,0.35)'} />

          {/* MONTH FILTER */}
          {months.length > 0 && (
            <div style={{ marginTop:18, marginBottom:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                <span style={{ fontSize:'0.42rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase',
                  color:'rgba(160,200,255,0.28)', marginRight:2 }}>Filter</span>
                {['all', ...months.slice(0,6)].map(m => {
                  const active = (m==='all' && !selMonth) || selMonth===m;
                  return (
                    <button key={m} onClick={()=>setSelMonth(m==='all'?null:m)} style={{
                      padding:'2px 10px', borderRadius:100, cursor:'pointer',
                      fontFamily:"'Inter',sans-serif", fontSize:'0.53rem', fontWeight:600,
                      background: active?'rgba(140,190,255,0.13)':'rgba(255,255,255,0.04)',
                      border: active?'1px solid rgba(140,190,255,0.36)':'1px solid rgba(255,255,255,0.09)',
                      color: active?'rgba(170,215,255,0.90)':'rgba(255,255,255,0.34)',
                      transition:'all 0.15s',
                    }}>
                      {m==='all'?'All':fmtMonth(m)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly detail when filtered */}
          {selMonth && monthData && (
            <>
              <SLabel>{fmtMonth(selMonth)}</SLabel>
              <InfoRow label="Quotes"       value={monthData.total} />
              <InfoRow label="Quoted Value" value={monthData.value>0?`AED ${fmt(monthData.value)}`:'—'} accent="rgba(255,200,75,0.88)" />
              <InfoRow label="Won Value"    value={monthData.wonValue>0?`AED ${fmt(monthData.wonValue)}`:'—'} sub={monthData.wonCount>0?`${monthData.wonCount} Won by Sales`:undefined} accent="rgba(52,211,153,0.88)" />
            </>
          )}

          {/* KPI PARAMETERS */}
          <SLabel>KPI Parameters{selMonth?` — ${fmtMonth(selMonth)}`:' (Overall)'}</SLabel>
          <KpiRow label="Win Rate (Sales Won)"  pct={kpi.win}        color={winColor} />
          <KpiRow label="Completion Rate" pct={kpi.completion} color="#34d399"  />
          <KpiRow label="Approval Rate"   pct={kpi.approval}   color="#a855f7"  />
          <KpiRow label="Active Load"     pct={Math.min(100, u.inProg*10)} color="#f59e0b" />
        </div>
      </div>
    </div>
  );
}

/* ── KPI Tab — flip-card grid + big overlay ── */
function KpiTab({ stats, loading }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected     = selectedId ? stats.find(u => u.id === selectedId) : null;
  const selectedRank = selectedId ? stats.findIndex(u => u.id === selectedId) : -1;

  if (loading) return <Spinner />;

  return (
    <div style={{ flex:1, position:'relative', overflow:'hidden', fontFamily:"'Inter',sans-serif" }}>
      {/* scrollable grid */}
      <div style={{
        position:'absolute', inset:0, overflowY:'auto', padding:'24px',
        filter:    selectedId ? 'blur(5px) brightness(0.24) saturate(0.25)' : 'none',
        transition:'filter 0.35s ease',
        pointerEvents: selectedId ? 'none' : 'auto',
      }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:18, alignItems:'start' }}>
          {stats.map((u, rank) => (
            <FlipCard
              key={u.id}
              u={u}
              rank={rank}
              isFlipped={selectedId === u.id}
              isBlurred={selectedId !== null && selectedId !== u.id}
              onFlip={id => setSelectedId(id)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <FlipOverlay
          u={selected}
          rank={selectedRank}
          allCount={stats.length}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

/* ── Org Chart modal ─────────────────────────────────────────────────── */
function MemberModal({ member, allStats, onClose }) {
  const rank         = allStats.findIndex(s => s.id === member.id);
  const rs           = ROLE_STYLE[member.role] || ROLE_STYLE.Estimator;
  const achievements = getAchievements(member, rank);
  const suggestions  = getAISuggestions(member, rank);
  const winColor     = member.winPct >= 60 ? '#34d399' : member.winPct >= 40 ? '#f59e0b' : '#ef4444';

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:700,
      background:'rgba(0,0,8,0.72)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:16,
      animation:'th-fadeIn 0.20s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position:'relative', display:'flex',
        width:'min(880px,96vw)', maxHeight:'90vh',
        borderRadius:20, overflow:'hidden',
        background: G.bg, border: G.border, boxShadow: G.shadow,
        backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
        animation:'th-slideUp 0.26s cubic-bezier(0.22,1,0.36,1)',
        fontFamily:"'Inter',sans-serif",
      }}>
        {/* specular */}
        <div style={{ position:'absolute', top:0, left:'14%', right:'14%', height:1, pointerEvents:'none', zIndex:4, background: G.topLine }}/>
        {/* close */}
        <button onClick={onClose} style={{
          position:'absolute', top:12, right:12, zIndex:20,
          width:26, height:26, borderRadius:'50%',
          background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.10)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          color:'rgba(255,255,255,0.42)', fontSize:'0.72rem', transition:'all 0.16s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.055)'; e.currentTarget.style.color='rgba(255,255,255,0.42)'; }}
        >✕</button>

        {/* Left */}
        <div style={{ width:210, flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center',
          padding:'36px 18px 26px', gap:11, borderRight:`1px solid ${G.divider}` }}>
          {rank < 3 && <div style={{ fontSize:'1.60rem', lineHeight:1, animation:'th-pulse 2.8s ease-in-out infinite' }}>
            {['🥇','🥈','🥉'][rank]}</div>}
          <div style={{ width:110, height:110, borderRadius:'50%', overflow:'hidden', flexShrink:0,
            border:'2px solid rgba(200,225,255,0.22)',
            boxShadow:'0 0 0 4px rgba(200,225,255,0.05), 0 8px 32px rgba(0,0,20,0.45)' }}>
            <Avatar name={member.name} photo={member.photo} size={110}/>
          </div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.82rem', fontWeight:700,
            letterSpacing:'0.06em', textTransform:'uppercase', textAlign:'center',
            color:'rgba(225,238,255,0.94)', lineHeight:1.4 }}>{member.name}</div>
          <span style={{ fontSize:'0.57rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase',
            padding:'2px 12px', borderRadius:100, background:rs.bg, border:`1px solid ${rs.bd}`, color:rs.c }}>
            {member.role}</span>
          <div style={{ fontSize:'0.50rem', letterSpacing:'0.14em', textTransform:'uppercase',
            color:'rgba(160,200,255,0.36)', textAlign:'center' }}>
            Rank #{rank + 1} of {allStats.length}
          </div>
          <div style={{ width:'55%', height:1, background: G.divider }}/>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'1.20rem', fontWeight:800, color:'rgba(255,200,75,0.90)', lineHeight:1 }}>
              AED {fmt(member.totalVal)}</div>
            <div style={{ fontSize:'0.42rem', letterSpacing:'0.12em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.24)', marginTop:4 }}>Total Value</div>
          </div>
          <div style={{ padding:'4px 15px', borderRadius:100, textAlign:'center',
            background:`${winColor}14`, border:`1px solid ${winColor}38` }}>
            <div style={{ fontSize:'0.95rem', fontWeight:800, color:`${winColor}ee`, lineHeight:1 }}>
              {member.winPct}%</div>
            <div style={{ fontSize:'0.40rem', letterSpacing:'0.10em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.24)', marginTop:2 }}>Win Rate</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ flex:1, minWidth:0, overflowY:'auto', padding:'22px 22px',
          display:'flex', flexDirection:'column', gap:18 }}>
          <section>
            <SecHead icon="📊" label="Performance"/>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {[
                { label:'Assigned',  value:member.total,     c:'rgba(160,200,255,0.92)' },
                { label:'Completed', value:member.completed, c:'rgba(52,211,153,0.92)'  },
                { label:'Active',    value:member.inProg,    c:'rgba(251,191,36,0.92)'  },
                { label:'Approved',  value:member.approved,  c:'rgba(168,85,247,0.92)'  },
              ].map(s => (
                <div key={s.label} style={{ background: G.statBg, borderRadius:10, padding:'11px 6px', textAlign:'center' }}>
                  <div style={{ fontSize:'1.45rem', fontWeight:800, color:s.c, lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:'0.44rem', letterSpacing:'0.10em', textTransform:'uppercase',
                    color:'rgba(255,255,255,0.28)', marginTop:5 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:8, background: G.statBg, borderRadius:10, padding:'9px 13px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:'0.56rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>Win Rate</span>
                <span style={{ fontSize:'0.70rem', fontWeight:700, color:`${winColor}ee` }}>{member.winPct}%</span>
              </div>
              <div style={{ height:4, borderRadius:2, background: G.barTrack }}>
                <div style={{ height:'100%', borderRadius:2, width:`${member.winPct}%`,
                  background:`linear-gradient(90deg,${winColor},${winColor}88)`, transition:'width 0.9s ease' }}/>
              </div>
            </div>
          </section>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <section>
              <SecHead icon="🏆" label="Achievements"/>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {achievements.length > 0 ? achievements.map((a, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 11px',
                    borderRadius:100, background: G.statBg, border: G.border,
                    fontSize:'0.62rem', fontWeight:600, color:'rgba(210,228,255,0.78)' }}>
                    <span>{a.icon}</span>{a.label}
                  </div>
                )) : <div style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.22)', fontStyle:'italic' }}>Milestones unlock achievements.</div>}
              </div>
            </section>
            <section>
              <SecHead icon="📈" label="Analysis"/>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {[
                  { label:'Completion', pct: member.total     ? Math.round(member.completed / member.total * 100)     : 0, c:'#34d399' },
                  { label:'Approval',   pct: member.completed ? Math.round(member.approved  / member.completed * 100) : 0, c:'#a855f7' },
                  { label:'Active Load',pct: Math.min(100, member.inProg * 10), c:'#f59e0b' },
                ].map(b => (
                  <div key={b.label}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <span style={{ fontSize:'0.56rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>{b.label}</span>
                      <span style={{ fontSize:'0.60rem', fontWeight:700, color:b.c }}>{b.pct}%</span>
                    </div>
                    <div style={{ height:3.5, borderRadius:2, background: G.barTrack }}>
                      <div style={{ height:'100%', borderRadius:2, width:`${b.pct}%`, background:b.c, opacity:0.82, transition:'width 0.9s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section>
            <SecHead icon="🤖" label="AI Suggestions"/>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{ display:'flex', gap:8, padding:'8px 12px',
                  background:'rgba(124,58,237,0.06)', border:'1px solid rgba(168,85,247,0.12)',
                  borderRadius:8, fontSize:'0.68rem', lineHeight:1.56, color:'rgba(210,226,255,0.70)' }}>
                  <div style={{ color:'rgba(168,85,247,0.68)', fontWeight:700, flexShrink:0, marginTop:1 }}>▸</div>
                  {s}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Org Chart Tab ── */
function OrgChartTab({ stats, onSelect }) {
  const byRole = {};
  stats.forEach(m => { if (!byRole[m.role]) byRole[m.role] = []; byRole[m.role].push(m); });

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'28px 24px', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ padding:'13px 40px', borderRadius:14,
          background:'linear-gradient(105deg,rgba(99,102,241,0.14),rgba(168,85,247,0.10))',
          border:'1px solid rgba(139,92,246,0.38)', textAlign:'center' }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:'1rem', fontWeight:700, letterSpacing:'0.16em',
            textTransform:'uppercase', background:'linear-gradient(90deg,#00e5ff,#7c3aed,#a855f7,#00e5ff)',
            backgroundSize:'220% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text', animation:'th-aurora 5s ease infinite' }}>NAFFCO AI APEX</div>
          <div style={{ fontSize:'0.55rem', letterSpacing:'0.22em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.28)', marginTop:4 }}>Estimation Department</div>
        </div>
        <div style={{ width:1, height:24, background:'linear-gradient(to bottom,rgba(139,92,246,0.50),rgba(139,92,246,0.10))' }}/>
        <div style={{ width:'60%', height:1, background:'rgba(139,92,246,0.30)' }}/>
      </div>

      <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap', marginTop:0 }}>
        {ROLE_ORDER.filter(r => byRole[r]).map(role => {
          const rs = ROLE_STYLE[role];
          return (
            <div key={role} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:'1 1 220px', maxWidth:400 }}>
              <div style={{ width:1, height:20, background:'rgba(139,92,246,0.30)' }}/>
              <div style={{ padding:'6px 20px', borderRadius:100, background:rs.bg, border:`1px solid ${rs.bd}`, marginBottom:16 }}>
                <span style={{ fontSize:'0.64rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:rs.c }}>{role}</span>
                <span style={{ fontSize:'0.60rem', color:rs.c, opacity:0.60, marginLeft:6 }}>({byRole[role].length})</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${rs.bd}`, borderRadius:16, padding:'20px 16px', width:'100%' }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:18, justifyContent:'center' }}>
                  {byRole[role].map(m => (
                    <div key={m.id} onClick={() => onSelect(m)}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, width:80,
                        cursor:'pointer', borderRadius:12, padding:'8px 4px', transition:'background 0.16s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(140,190,255,0.07)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                      <div style={{ width:64, height:64, borderRadius:'50%', border:`2px solid ${rs.bd}`,
                        boxShadow:'0 0 12px rgba(124,58,237,0.16)', overflow:'hidden' }}>
                        <Avatar name={m.name} photo={m.photo} size={64}/>
                      </div>
                      <div style={{ fontSize:'0.57rem', fontWeight:600, color:'rgba(210,225,255,0.78)',
                        textAlign:'center', lineHeight:1.35, wordBreak:'break-word' }}>
                        {m.name.split(' ').slice(0, 2).join('\n')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function TeamHub({ onBack }) {
  const [tab, setTab] = useState(() => {
    try { const t = sessionStorage.getItem('teamhub_tab') || 'kpi'; sessionStorage.removeItem('teamhub_tab'); return t; } catch { return 'kpi'; }
  });
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState(null);

  const directory = useMemo(() => loadDirectory(), []);

  useEffect(() => {
    if (requests.length > 0) return;
    setLoading(true);
    fetch(DATA_URL)
      .then(r => r.json())
      .then(d => { setRequests(d.requests || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []); // eslint-disable-line

  const stats = useMemo(() => MEMBERS.map(m => {
    const dir       = directory[m.id] || {};
    const mine      = requests.filter(r => (r.estimator || '').toLowerCase() === m.name.toLowerCase());

    /* deduplicated: one entry per base request ID, latest revision value */
    const deduped   = dedupeRequests(mine);
    const total     = deduped.length;
    const totalVal  = deduped.reduce((s, r) => s + (Number(r.projValue) || 0), 0);
    const wonVal    = deduped.filter(r => r.salesStatus === 'Won').reduce((s, r) => s + (Number(r.projValue)||0), 0);
    const wonCount  = deduped.filter(r => r.salesStatus === 'Won').length;

    /* status counts also use deduped latest revision */
    const completed = deduped.filter(r => r.reqStatus === 'completed').length;
    const inProg    = deduped.filter(r => r.reqStatus === 'inprogress' || r.reqStatus === 'pending-director').length;
    const approved  = deduped.filter(r => r.directorAction === 'approved').length;
    const winPct    = completed ? Math.round(approved / completed * 100) : 0;

    /* monthly breakdown (also deduplicated) */
    const monthly   = {};
    deduped.forEach(r => {
      const raw = r.createdAt || r.date || r.submittedDate || r.dateCreated || r.requestDate || r.created;
      if (!raw) return;
      try {
        const d = new Date(raw);
        if (isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!monthly[key]) monthly[key] = { total:0, completed:0, approved:0, value:0, wonValue:0, wonCount:0 };
        monthly[key].total++;
        if (r.reqStatus === 'completed') monthly[key].completed++;
        if (r.directorAction === 'approved') { monthly[key].approved++; }
        if (r.salesStatus === 'Won') { monthly[key].wonValue += Number(r.projValue)||0; monthly[key].wonCount++; }
        monthly[key].value += Number(r.projValue)||0;
      } catch {}
    });
    return {
      ...m,
      total, completed, inProg, approved, totalVal, wonVal, wonCount, winPct, monthly,
      empNo:       dir.empNo       || m.id,
      doj:         dirFmtDoj(dir.doj),
      exp:         dirAgeInOrg(dir.doj),
      salary:      dir.salary      || null,
      designation: dir.designation || m.role,
      status:      dir.status      || 'Active',
    };
  }).sort((a, b) => b.total - a.total), [requests, directory]);

  const TABS = [
    { key:'kpi',      label:'KPI',       path:'M23 6 13.5 15.5 8.5 10.5 1 18 M17 6h6v6' },
    { key:'orgchart', label:'Org Chart', path:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75' },
  ];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'linear-gradient(135deg,#02010e 0%,#060420 50%,#030012 100%)', fontFamily:"'Inter',sans-serif", color:'#e2e8f0', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        @keyframes th-aurora  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes th-spin    { to{transform:rotate(360deg)} }
        @keyframes th-pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes th-fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes th-slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes th-popOut   { from{opacity:0;transform:scale(0.97) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes th-cardFlip { from{opacity:0;transform:perspective(1200px) rotateY(90deg) scale(0.94)} to{opacity:1;transform:perspective(1200px) rotateY(0deg) scale(1)} }
        @keyframes th-shimmer { 0%{left:-120%} 100%{left:220%} }
        ::-webkit-scrollbar       { width:5px; background:rgba(255,255,255,0.03) }
        ::-webkit-scrollbar-thumb { background:rgba(140,190,255,0.13); border-radius:4px }
      `}</style>

      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 55% 38% at 50% -8%, rgba(124,58,237,0.16) 0%, transparent 70%)', pointerEvents:'none' }}/>

      {/* Header */}
      <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'15px 24px 12px', borderBottom:'1px solid rgba(140,190,255,0.09)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={onBack}
            style={{ background:'none', border:'1px solid rgba(255,255,255,0.13)', borderRadius:100, padding:'6px 14px', cursor:'pointer', color:'rgba(255,255,255,0.52)', fontSize:'0.70rem', letterSpacing:'0.12em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:5, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(255,255,255,0.30)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.52)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.13)'; }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div>
            <h1 style={{ margin:0, fontFamily:"'Cinzel',serif", fontSize:'clamp(1rem,2.4vw,1.5rem)', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', background:'linear-gradient(90deg,#00e5ff,#7c3aed,#a855f7,#00e5ff)', backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'th-aurora 5s ease infinite' }}>Team</h1>
            <div style={{ fontSize:'0.58rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.26)', marginTop:2 }}>Estimation · {MEMBERS.length} Members</div>
          </div>
        </div>

        <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100, padding:3, gap:2 }}>
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 20px', borderRadius:100, border: active ? '1px solid rgba(140,190,255,0.35)' : '1px solid transparent', background: active ? 'rgba(140,190,255,0.12)' : 'transparent', color: active ? 'rgba(170,215,255,0.95)' : 'rgba(255,255,255,0.38)', fontFamily:"'Inter',sans-serif", fontSize:'0.76rem', fontWeight: active ? 700 : 500, cursor:'pointer', outline:'none', transition:'all 0.18s', letterSpacing:'0.04em' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {t.path.split(' M').map((seg, i) => <path key={i} d={(i === 0 ? '' : 'M') + seg}/>)}
                </svg>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'kpi'      && <KpiTab      stats={stats} loading={loading} />}
      {tab === 'orgchart' && <OrgChartTab stats={stats} onSelect={setSelected} />}

      {selected && (
        <FlipOverlay
          u={selected}
          rank={stats.findIndex(s => s.id === selected.id)}
          allCount={stats.length}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
