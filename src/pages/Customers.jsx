import { useState, useEffect, useMemo } from 'react';

const AZURE_SAS = 'sv=2025-11-05&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-30T13:08:36Z&st=2026-04-19T20:00:00Z&spr=https&sig=GMAKHd37xTTyBo5eeCg%2BQjzdT37ga%2FtmBDGWHjzfZTc%3D';
const DATA_URL = `https://apexfilestorage2.blob.core.windows.net/estimation-docs/apex-data.json?${AZURE_SAS}`;

const TABS = [
  { key: 'contractor', label: 'Contractor', color: '#6366f1' },
  { key: 'consultant', label: 'Consultant', color: '#00c8ff' },
  { key: 'client',     label: 'Client',     color: '#34d399' },
];

function fmtShort(v) {
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
  if (v >= 1000) return (v / 1000).toFixed(0) + 'K';
  return String(v);
}

function groupBy(requests, key) {
  const map = {};
  for (const r of requests) {
    const name = (r[key] || '').trim();
    if (!name) continue;
    if (!map[name]) map[name] = [];
    map[name].push(r);
  }
  return map;
}

function buildRows(requests, tabKey) {
  const fieldMap = { contractor: 'mainContractor', consultant: 'consultant', client: 'client' };
  const grouped = groupBy(requests, fieldMap[tabKey]);
  return Object.entries(grouped).map(([name, rows]) => {
    let totalValue = 0, won = 0, lost = 0, lastTs = 0;
    for (const r of rows) {
      totalValue += Number(r.projValue || 0);
      const combined = ((r.salesStatus || '') + ' ' + (r.status || '')).toLowerCase();
      if (combined.includes('won')) won++;
      else if (combined.includes('lost')) lost++;
      const ts = r.submittedAt ? new Date(r.submittedAt).getTime() : 0;
      if (ts > lastTs) lastTs = ts;
    }
    const pending = rows.length - won - lost;
    return { name, count: rows.length, totalValue, won, lost, pending, lastTs };
  }).sort((a, b) => b.totalValue - a.totalValue);
}

export default function Customers({ onBack }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab] = useState(() => {
    try { const t = sessionStorage.getItem('customers_tab')||'contractor'; sessionStorage.removeItem('customers_tab'); return t; } catch { return 'contractor'; }
  });
  const [search, setSearch]     = useState('');

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then(d => { setRequests(d.requests || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const rows = useMemo(() => buildRows(requests, tab), [requests, tab]);
  const activeColor = TABS.find(t => t.key === tab).color;

  const filtered = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const kpiCount = rows.length;
  const kpiValue = rows.reduce((s, r) => s + r.totalValue, 0);
  const kpiQuotes = rows.reduce((s, r) => s + r.count, 0);

  const s = {
    wrap: { position:'fixed', inset:0, zIndex:200, background:'linear-gradient(135deg,#02010e 0%,#060420 50%,#030012 100%)', fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', color:'#e2e8f0' },
    header: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)' },
    backBtn: { background:'none', border:'1px solid rgba(255,255,255,0.14)', color:'#94a3b8', borderRadius:20, padding:'6px 14px', cursor:'pointer', fontSize:13, marginRight:16 },
    titleWrap: { display:'flex', flexDirection:'column' },
    subtitle: { fontSize:12, color:'#64748b', marginTop:2 },
    kpiRow: { display:'flex', gap:10 },
    kpi: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'6px 14px', textAlign:'center', minWidth:90 },
    kpiVal: { fontSize:16, fontWeight:700, color: activeColor },
    kpiLbl: { fontSize:10, color:'#64748b', marginTop:1 },
    tabRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)' },
    tabPills: { display:'flex', background:'rgba(255,255,255,0.04)', borderRadius:20, padding:3, gap:2 },
    search: { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:8, padding:'7px 12px', color:'#e2e8f0', fontSize:13, width:280, outline:'none' },
    tableWrap: { flex:1, overflowY:'auto', padding:'16px 24px 24px' },
    table: { width:'100%', borderCollapse:'collapse' },
    th: { textAlign:'left', padding:'10px 12px', fontSize:11, color:'#64748b', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, background:'#060420', zIndex:1 },
    td: { padding:'11px 12px', fontSize:13, borderBottom:'1px solid rgba(255,255,255,0.04)', verticalAlign:'middle' },
    spinner: { display:'flex', alignItems:'center', justifyContent:'center', flex:1, height:200 },
  };

  function tabPill(t) {
    const active = tab === t.key;
    return (
      <button key={t.key} onClick={() => setTab(t.key)} style={{ background: active ? t.color+'22' : 'none', border: active ? `1px solid ${t.color}55` : '1px solid transparent', color: active ? t.color : '#64748b', borderRadius:16, padding:'5px 16px', cursor:'pointer', fontSize:13, fontWeight: active ? 600 : 400, transition:'all .2s' }}>
        {t.label}
      </button>
    );
  }

  function WinBar({ won, count }) {
    const pct = count ? (won / count) * 100 : 0;
    return (
      <div style={{ width:60, height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, marginTop:4, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:'#34d399', borderRadius:2 }} />
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
        @keyframes aurora { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .aurora-title {
          font-family:'Cinzel',serif; font-size:22px; font-weight:700; letter-spacing:0.04em;
          background:linear-gradient(90deg,#a78bfa,#60a5fa,#34d399,#f472b6,#a78bfa);
          background-size:300% 300%; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:aurora 4s ease infinite;
        }
        tr.cust-row:hover td { background:rgba(255,255,255,0.03); }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:3px}
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div style={{ display:'flex', alignItems:'center' }}>
          <button style={s.backBtn} onClick={onBack}>← Back</button>
          <div style={s.titleWrap}>
            <span className="aurora-title">Customers</span>
            <span style={s.subtitle}>Analysis &amp; History</span>
          </div>
        </div>
        <div style={s.kpiRow}>
          <div style={s.kpi}>
            <div style={s.kpiVal}>{kpiCount}</div>
            <div style={s.kpiLbl}>Entities</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiVal}>AED {fmtShort(kpiValue)}</div>
            <div style={s.kpiLbl}>Total Est. Value</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiVal}>{kpiQuotes}</div>
            <div style={s.kpiLbl}>Total Quotes</div>
          </div>
        </div>
      </div>

      {/* Tab bar + search */}
      <div style={s.tabRow}>
        <div style={s.tabPills}>{TABS.map(tabPill)}</div>
        <input style={s.search} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        {loading ? (
          <div style={s.spinner}>
            <div style={{ width:36, height:36, border:'3px solid rgba(255,255,255,0.1)', borderTopColor: activeColor, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>{TABS.find(t=>t.key===tab).label}</th>
                <th style={{...s.th, textAlign:'center'}}>Quotes</th>
                <th style={s.th}>Est. Value (AED)</th>
                <th style={{...s.th, textAlign:'center', color:'#34d399'}}>Won</th>
                <th style={{...s.th, textAlign:'center', color:'#f87171'}}>Lost</th>
                <th style={{...s.th, textAlign:'center', color:'#fbbf24'}}>Pending</th>
                <th style={s.th}>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const avg = row.count ? row.totalValue / row.count : 0;
                const lastDate = row.lastTs ? new Date(row.lastTs).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
                return (
                  <tr key={row.name} className="cust-row">
                    <td style={s.td}>
                      <div style={{ fontWeight:500, color:'#e2e8f0' }}>{row.name}</div>
                      <WinBar won={row.won} count={row.count} />
                    </td>
                    <td style={{...s.td, textAlign:'center', color:'#94a3b8'}}>{row.count}</td>
                    <td style={s.td}>
                      <div style={{ fontWeight:600, color: activeColor }}>{Number(row.totalValue).toLocaleString()}</div>
                      <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>avg {Number(avg).toLocaleString()}</div>
                    </td>
                    <td style={{...s.td, textAlign:'center', color:'#34d399', fontWeight:600}}>{row.won}</td>
                    <td style={{...s.td, textAlign:'center', color:'#f87171', fontWeight:600}}>{row.lost}</td>
                    <td style={{...s.td, textAlign:'center', color:'#fbbf24', fontWeight:600}}>{row.pending}</td>
                    <td style={{...s.td, color:'#64748b', fontSize:12}}>{lastDate}</td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr><td colSpan={7} style={{...s.td, textAlign:'center', color:'#475569', padding:'40px 0'}}>No data found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
