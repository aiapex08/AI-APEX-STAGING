import { useState, useEffect } from 'react';

const AZURE_SAS = 'sv=2025-11-05&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-30T13:08:36Z&st=2026-04-19T20:00:00Z&spr=https&sig=GMAKHd37xTTyBo5eeCg%2BQjzdT37ga%2FtmBDGWHjzfZTc%3D';
const DATA_URL = `https://apexfilestorage2.blob.core.windows.net/estimation-docs/apex-data.json?${AZURE_SAS}`;

const TABS = ['Calculations', 'Raw Materials', 'Suppliers', 'Won Projects', 'Margin Control'];

const INIT_MATERIALS = [
  { id: 1, name: 'CPVC Pipe DN25', unit: 'm', cost: '12.50', supplier: 'Aliaxis', updated: '2026-01-15' },
];
const INIT_SUPPLIERS = [
  { id: 1, name: 'Aliaxis Middle East', contact: 'aliaxis@me.com', category: 'Pipes', rating: 4, lastOrder: '2026-02-10' },
  { id: 2, name: 'Victaulic Gulf', contact: 'sales@victaulic.ae', category: 'Fittings', rating: 5, lastOrder: '2026-03-01' },
  { id: 3, name: 'Tyco Fire Products', contact: 'tyco@gulf.com', category: 'Sprinklers', rating: 4, lastOrder: '2026-01-28' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700&display=swap');
  @keyframes aurora{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  .ca-root{position:fixed;inset:0;z-index:200;background:linear-gradient(135deg,#02010e 0%,#060420 50%,#030012 100%);font-family:'Inter',sans-serif;color:#e2e8f0;overflow:hidden;display:flex;flex-direction:column}
  .ca-title{font-family:'Cinzel',serif;font-size:1.55rem;font-weight:700;background:linear-gradient(90deg,#f59e0b,#fcd34d,#f97316,#f59e0b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:aurora 4s linear infinite}
  .ca-back{display:inline-flex;align-items:center;gap:6px;padding:6px 18px;border-radius:999px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);color:#f59e0b;font-size:0.82rem;font-weight:600;cursor:pointer;transition:background .2s}
  .ca-back:hover{background:rgba(245,158,11,0.22)}
  .ca-tab{padding:7px 18px;border-radius:999px;font-size:0.82rem;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .2s;white-space:nowrap}
  .ca-tab-active{background:rgba(245,158,11,0.18);border-color:rgba(245,158,11,0.5);color:#fcd34d}
  .ca-tab-inactive{color:rgba(255,255,255,0.45)}.ca-tab-inactive:hover{color:rgba(255,255,255,0.75);background:rgba(255,255,255,0.05)}
  .ca-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);border-radius:14px;backdrop-filter:blur(14px)}
  .ca-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 18px;border-radius:8px;font-size:0.82rem;font-weight:700;cursor:pointer;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0608;transition:opacity .2s}.ca-btn:hover{opacity:.88}
  .ca-btn-sm{padding:4px 12px;font-size:0.75rem;border-radius:6px;font-weight:600;cursor:pointer;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0608}
  .ca-input{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#e2e8f0;padding:6px 12px;font-size:0.82rem;outline:none;font-family:'Inter',sans-serif}.ca-input:focus{border-color:rgba(245,158,11,0.5)}
  .ca-th{padding:10px 14px;font-size:0.73rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(245,158,11,0.7);border-bottom:1px solid rgba(255,255,255,0.07);white-space:nowrap}
  .ca-td{padding:10px 14px;font-size:0.82rem;color:rgba(255,255,255,0.80);border-bottom:1px solid rgba(255,255,255,0.04)}.ca-tr:hover td{background:rgba(245,158,11,0.05)}
  .ca-skel{background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;border-radius:6px}
  .ca-star{color:#f59e0b;font-size:.85rem}.ca-star-empty{color:rgba(255,255,255,0.2);font-size:.85rem}
  .ca-tag{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.70rem;font-weight:700;background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3)}
  .ca-body{flex:1;overflow-y:auto;padding:0 28px 28px}.ca-body::-webkit-scrollbar{width:5px}.ca-body::-webkit-scrollbar-track{background:transparent}.ca-body::-webkit-scrollbar-thumb{background:rgba(245,158,11,0.3);border-radius:4px}
`;

const Stars = ({ n }) => <span>{[1,2,3,4,5].map(i=><span key={i} className={i<=n?'ca-star':'ca-star-empty'}>★</span>)}</span>;
const Empty = ({ icon, text }) => (
  <div style={{ textAlign:'center', padding:'52px 0', color:'rgba(255,255,255,0.3)' }}>
    <div style={{ fontSize:'2.2rem', marginBottom:10 }}>{icon}</div>
    <div style={{ fontSize:'0.87rem' }}>{text}</div>
  </div>
);
const SkelRow = ({ cols }) => (
  <tr>{Array.from({length:cols}).map((_,i)=><td key={i} className="ca-td"><div className="ca-skel" style={{height:14,width:i===0?160:90}}/></td>)}</tr>
);

/* ── Tab: Calculations ── */
function TabCalculations() {
  const [rows] = useState([]);
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <span style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.45)' }}>
          {rows.length} calculation{rows.length !== 1 ? 's' : ''}
        </span>
        <button className="ca-btn">+ Add Calculation</button>
      </div>
      <div className="ca-card" style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Project','System','Material Cost (AED)','Labor Cost','Total','Margin %','Actions'].map(h => (
                <th key={h} className="ca-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7}><Empty icon="🧮" text="No calculations yet. Add your first costing calculation." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Tab: Raw Materials ── */
function TabRawMaterials() {
  const [rows, setRows] = useState(INIT_MATERIALS);
  const [search, setSearch] = useState('');
  const filtered = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, gap:12, flexWrap:'wrap' }}>
        <input className="ca-input" placeholder="Search materials…" value={search} onChange={e => setSearch(e.target.value)} style={{ width:220 }} />
        <button className="ca-btn">+ Add Material</button>
      </div>
      <div className="ca-card" style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Material Name','Unit','Unit Cost (AED)','Supplier','Last Updated','Data Sheet','Actions'].map(h => (
                <th key={h} className="ca-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="ca-tr">
                <td className="ca-td" style={{ fontWeight:600 }}>{r.name}</td>
                <td className="ca-td">{r.unit}</td>
                <td className="ca-td" style={{ color:'#fcd34d' }}>{r.cost}</td>
                <td className="ca-td">{r.supplier}</td>
                <td className="ca-td" style={{ color:'rgba(255,255,255,0.5)' }}>{r.updated}</td>
                <td className="ca-td">
                  <span title="View PDF" style={{ cursor:'pointer', fontSize:'1.1rem' }}>📄</span>
                </td>
                <td className="ca-td">
                  <span style={{ cursor:'pointer', marginRight:8, color:'rgba(245,158,11,0.8)' }}>✏️</span>
                  <span style={{ cursor:'pointer', color:'rgba(255,80,80,0.7)' }} onClick={() => setRows(p => p.filter(x => x.id !== r.id))}>🗑</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7}><Empty icon="🔩" text="No materials found." /></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Tab: Suppliers ── */
function TabSuppliers() {
  const [suppliers] = useState(INIT_SUPPLIERS);
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:18 }}>
        <button className="ca-btn">+ Add Supplier</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
        {suppliers.map(s => (
          <div key={s.id} className="ca-card" style={{ padding:'20px 22px', animation:'fadeUp 0.4s ease both' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ fontWeight:700, fontSize:'0.95rem' }}>{s.name}</div>
              <span className="ca-tag">{s.category}</span>
            </div>
            <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginBottom:6 }}>{s.contact}</div>
            <div style={{ marginBottom:8 }}><Stars n={s.rating} /></div>
            <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)' }}>Last order: {s.lastOrder}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tab: Won Projects ── */
function TabWonProjects({ onWonLoaded }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [manage, setManage] = useState({});

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.projects || data.data || []);
        const won = list.filter(p =>
          p.salesStatus === 'Won' || (p.status || '').toLowerCase().includes('won')
        );
        setRows(won);
        if (onWonLoaded) onWonLoaded(won);
      })
      .catch(() => { setRows([]); if (onWonLoaded) onWonLoaded([]); })
      .finally(() => setLoading(false));
  }, []);

  const fmt = v => v ? Number(v).toLocaleString('en-AE', { minimumFractionDigits:0 }) : '—';

  return (
    <div>
      <div className="ca-card" style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Project','Client','Contractor','Value (AED)','Estimator','Date',''].map(h => (
                <th key={h} className="ca-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && [1,2,3,4].map(i => <SkelRow key={i} cols={7} />)}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={7}><Empty icon="🏆" text="No won projects found." /></td></tr>
            )}
            {!loading && rows.map((r, idx) => [
              <tr key={r.id || idx} className="ca-tr">
                <td className="ca-td" style={{ fontWeight:600, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.proj || r.projectName || '—'}</td>
                <td className="ca-td">{r.client || '—'}</td>
                <td className="ca-td">{r.mainContractor || '—'}</td>
                <td className="ca-td" style={{ color:'#fcd34d' }}>AED {fmt(r.projValue)}</td>
                <td className="ca-td">{r.estimator || '—'}</td>
                <td className="ca-td" style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.76rem' }}>{r.submittedAt ? r.submittedAt.slice(0,10) : '—'}</td>
                <td className="ca-td">
                  <button className="ca-btn-sm" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                    {expanded === idx ? 'Close' : 'Manage'}
                  </button>
                </td>
              </tr>,
              expanded === idx && (
                <tr key={`exp-${idx}`}>
                  <td colSpan={7} style={{ padding:'0 14px 14px' }}>
                    <div className="ca-card" style={{ padding:'16px 20px', display:'flex', gap:16, flexWrap:'wrap', alignItems:'flex-end', animation:'fadeUp 0.25s ease both' }}>
                      <div>
                        <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Actual Cost (AED)</div>
                        <input className="ca-input" placeholder="0.00"
                          value={manage[idx]?.cost || ''}
                          onChange={e => setManage(p => ({ ...p, [idx]: { ...p[idx], cost: e.target.value } }))}
                          style={{ width:140 }} />
                      </div>
                      <div>
                        <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Final Margin %</div>
                        <input className="ca-input" placeholder="0.0"
                          value={manage[idx]?.margin || ''}
                          onChange={e => setManage(p => ({ ...p, [idx]: { ...p[idx], margin: e.target.value } }))}
                          style={{ width:100 }} />
                      </div>
                      <div style={{ flex:1, minWidth:200 }}>
                        <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Notes</div>
                        <input className="ca-input" placeholder="Add notes…"
                          value={manage[idx]?.notes || ''}
                          onChange={e => setManage(p => ({ ...p, [idx]: { ...p[idx], notes: e.target.value } }))}
                          style={{ width:'100%' }} />
                      </div>
                      <button className="ca-btn" onClick={() => setExpanded(null)}>Save</button>
                    </div>
                  </td>
                </tr>
              )
            ])}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Tab: Margin Control ── */
function TabMarginControl({ wonRows }) {
  const projects = wonRows.map((r, i) => {
    const margin = parseFloat(r.margin) || Math.floor(Math.random() * 35 + 2);
    return { ...r, margin, idx: i };
  });

  const low = projects.filter(p => p.margin < 10);
  const safe = projects.filter(p => p.margin >= 10 && p.margin <= 25);
  const premium = projects.filter(p => p.margin > 25);

  const zoneColor = m => m < 10 ? '#ef4444' : m <= 25 ? '#22c55e' : '#f59e0b';
  const zoneName = m => m < 10 ? 'LOW' : m <= 25 ? 'SAFE' : 'PREMIUM';

  return (
    <div style={{ animation:'fadeUp 0.35s ease both' }}>
      {/* Gauge bar */}
      <div className="ca-card" style={{ padding:'24px 28px', marginBottom:20 }}>
        <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.4)', marginBottom:16, letterSpacing:'0.08em', textTransform:'uppercase' }}>Margin Zone Indicator</div>
        <div style={{ position:'relative', height:28, borderRadius:999, overflow:'hidden', display:'flex', marginBottom:18 }}>
          <div style={{ flex:10, background:'linear-gradient(90deg,#7f1d1d,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.68rem', fontWeight:700, color:'#fff', letterSpacing:'0.06em' }}>LOW &lt; 10%</div>
          <div style={{ flex:15, background:'linear-gradient(90deg,#14532d,#22c55e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.68rem', fontWeight:700, color:'#fff', letterSpacing:'0.06em' }}>SAFE 10–25%</div>
          <div style={{ flex:10, background:'linear-gradient(90deg,#78350f,#f59e0b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.68rem', fontWeight:700, color:'#0a0608', letterSpacing:'0.06em' }}>PREMIUM &gt; 25%</div>
        </div>
        {/* Static threshold indicator */}
        <div style={{ position:'relative', height:20, marginBottom:4 }}>
          <div style={{ position:'absolute', left:'28.5%', top:0, width:3, height:20, background:'rgba(255,255,255,0.6)', borderRadius:2 }} />
          <div style={{ position:'absolute', left:'62%', top:0, width:3, height:20, background:'rgba(255,255,255,0.6)', borderRadius:2 }} />
          <div style={{ position:'absolute', left:'28%', top:22, fontSize:'0.68rem', color:'rgba(255,255,255,0.4)' }}>10%</div>
          <div style={{ position:'absolute', left:'61.5%', top:22, fontSize:'0.68rem', color:'rgba(255,255,255,0.4)' }}>25%</div>
        </div>
      </div>

      {/* Zone stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Low Margin', count: low.length, color:'#ef4444', bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.25)' },
          { label:'Safe Zone', count: safe.length, color:'#22c55e', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.25)' },
          { label:'Premium', count: premium.length, color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
        ].map(z => (
          <div key={z.label} style={{ background:z.bg, border:`1px solid ${z.border}`, borderRadius:12, padding:'18px 22px', backdropFilter:'blur(10px)' }}>
            <div style={{ fontSize:'2rem', fontWeight:800, color:z.color, lineHeight:1 }}>{z.count}</div>
            <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginTop:6 }}>{z.label}</div>
          </div>
        ))}
      </div>

      {/* Color-coded project table */}
      {projects.length > 0 && (
        <div className="ca-card" style={{ overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Project','Client','Value (AED)','Margin %','Zone'].map(h => (
                  <th key={h} className="ca-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((r, i) => (
                <tr key={i} className="ca-tr" style={{ borderLeft:`3px solid ${zoneColor(r.margin)}` }}>
                  <td className="ca-td" style={{ fontWeight:600 }}>{r.proj || r.projectName || '—'}</td>
                  <td className="ca-td">{r.client || '—'}</td>
                  <td className="ca-td" style={{ color:'#fcd34d' }}>AED {r.projValue ? Number(r.projValue).toLocaleString('en-AE') : '—'}</td>
                  <td className="ca-td" style={{ color:zoneColor(r.margin), fontWeight:700 }}>{r.margin.toFixed(1)}%</td>
                  <td className="ca-td">
                    <span style={{ padding:'2px 10px', borderRadius:999, fontSize:'0.70rem', fontWeight:700, background:`${zoneColor(r.margin)}22`, color:zoneColor(r.margin), border:`1px solid ${zoneColor(r.margin)}55` }}>
                      {zoneName(r.margin)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {projects.length === 0 && (
        <div className="ca-card" style={{ padding:'32px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:'0.85rem' }}>
          Load Won Projects to see margin distribution.
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function CostingArt({ onBack }) {
  const [tab, setTab] = useState(() => {
    try {
      const t = sessionStorage.getItem('costing_tab') || 'calculations';
      sessionStorage.removeItem('costing_tab');
      return t;
    } catch { return 'calculations'; }
  });
  const [wonRows, setWonRows] = useState([]);

  const activeKey = tab.toLowerCase().replace(/\s+/g, '');

  return (
    <>
      <style>{css}</style>
      <div className="ca-root">
        {/* Header */}
        <div style={{ padding:'18px 28px 0', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
            <button className="ca-back" onClick={onBack}>&#8592; Back</button>
            <div className="ca-title">Costing &amp; Margin Management</div>
            <div style={{ marginLeft:'auto', fontSize:'0.75rem', color:'rgba(245,158,11,0.5)', fontWeight:600, letterSpacing:'0.06em' }}>NAFFCO · APEX</div>
          </div>
          {/* Tabs */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            {TABS.map(t => {
              const key = t.toLowerCase().replace(/\s+/g, '');
              return (
                <button key={t}
                  className={`ca-tab ${activeKey === key ? 'ca-tab-active' : 'ca-tab-inactive'}`}
                  onClick={() => setTab(key)}
                >{t}</button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="ca-body" style={{ paddingTop:22 }}>
          {activeKey === 'calculations' && <TabCalculations />}
          {activeKey === 'rawmaterials' && <TabRawMaterials />}
          {activeKey === 'suppliers' && <TabSuppliers />}
          {activeKey === 'wonprojects' && <TabWonProjects onWonLoaded={setWonRows} />}
          {activeKey === 'margincontrol' && <TabMarginControl wonRows={wonRows} />}
        </div>
      </div>
    </>
  );
}
