import { useState, useEffect, useRef } from 'react';

const AZURE_SAS = 'sv=2025-11-05&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-30T13:08:36Z&st=2026-04-19T20:00:00Z&spr=https&sig=GMAKHd37xTTyBo5eeCg%2BQjzdT37ga%2FtmBDGWHjzfZTc%3D';
const DATA_URL = `https://apexfilestorage2.blob.core.windows.net/estimation-docs/apex-data.json?${AZURE_SAS}`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@keyframes au-aurora{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes growBar{from{width:0}to{width:var(--tw)}}
@keyframes growBarV{from{height:0}to{height:var(--th)}}
.an-aurora{background:linear-gradient(90deg,#7ee8fa,#a78bfa,#f9a8d4,#60a5fa,#7ee8fa);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:au-aurora 6s ease infinite}
.aai-scroll::-webkit-scrollbar{width:5px}
.aai-scroll::-webkit-scrollbar-track{background:transparent}
.aai-scroll::-webkit-scrollbar-thumb{background:rgba(140,190,255,0.15);border-radius:4px}
.aai-tab-btn{background:transparent;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:0.8rem;letter-spacing:0.05em;font-weight:500;padding:8px 18px;border-radius:20px;transition:all 0.2s;color:rgba(255,255,255,0.45)}
.aai-tab-btn.active{background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.14)}
.aai-tab-btn:hover:not(.active){color:rgba(255,255,255,0.7)}
`;

const glass = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(14px)', borderRadius: 14 };
const fmtAED = v => 'AED ' + Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
const TABS = ['Overview', 'Trends', 'Performance', 'Reports'];
const BAR_COLORS = ['#7ee8fa','#a78bfa','#f9a8d4','#60a5fa','#34d399','#fbbf24'];
const PIE_COLORS = ['#7ee8fa','#a78bfa','#f9a8d4','#60a5fa','#34d399','#fbbf24'];

function KpiChip({ label, value, sub }) {
  return (
    <div style={{ ...glass, padding: '18px 22px', flex: '1 1 160px', minWidth: 140 }}>
      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.55rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function HBarChart({ data, title }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ ...glass, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 120, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
            <div style={{ flex: 1, height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 7, overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '100%', width: `${(d.value / max) * 100}%`, borderRadius: 7, background: `linear-gradient(90deg,${BAR_COLORS[i % BAR_COLORS.length]},${BAR_COLORS[(i+2) % BAR_COLORS.length]})`, animation: 'growBar 0.8s ease forwards', '--tw': `${(d.value / max) * 100}%` }} />
            </div>
            <div style={{ width: 36, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data, title }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  const R = 60, cx = 80, cy = 80, stroke = 22;
  const circ = 2 * Math.PI * R;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const dash = pct * circ;
    const s = { d, i, dash, offset, color: PIE_COLORS[i % PIE_COLORS.length] };
    offset += dash;
    return s;
  });
  return (
    <div style={{ ...glass, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <svg width={160} height={160} style={{ flexShrink: 0 }}>
          <defs>
            {slices.map(s => (
              <linearGradient key={s.i} id={`dg${s.i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={s.color} />
                <stop offset="100%" stopColor={PIE_COLORS[(s.i + 2) % PIE_COLORS.length]} />
              </linearGradient>
            ))}
          </defs>
          {slices.map(s => (
            <circle key={s.i} cx={cx} cy={cy} r={R} fill="none"
              stroke={`url(#dg${s.i})`} strokeWidth={stroke}
              strokeDasharray={`${s.dash} ${circ - s.dash}`}
              strokeDashoffset={-s.offset} strokeLinecap="butt"
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }} />
          ))}
          <text x={cx} y={cy + 5} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={13} fontWeight={700}>{total}</text>
          <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>TOTAL</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          {slices.map(s => (
            <div key={s.i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', flex: 1 }}>{s.d.label}</span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{Math.round(s.d.value / total * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarChartSVG({ data, title, valueLabel }) {
  const mounted = useRef(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { if (!mounted.current) { mounted.current = true; requestAnimationFrame(() => setReady(true)); } }, []);
  const W = 520, H = 160, PL = 36, PB = 28, PR = 10, PT = 10;
  const chartW = W - PL - PR, chartH = H - PT - PB;
  const max = Math.max(...data.map(d => d.value), 1);
  const bw = chartW / data.length;
  const bPad = bw * 0.25;
  return (
    <div style={{ ...glass, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{title}</div>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H}>
          <defs>
            <linearGradient id="bgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7ee8fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map(t => (
            <line key={t} x1={PL} x2={W - PR} y1={PT + chartH * (1 - t)} y2={PT + chartH * (1 - t)}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          ))}
          {data.map((d, i) => {
            const bh = ready ? (d.value / max) * chartH : 0;
            const x = PL + i * bw + bPad;
            const w = bw - 2 * bPad;
            const y = PT + chartH - bh;
            return (
              <g key={d.label}>
                <rect x={x} y={y} width={w} height={bh} fill="url(#bgrad)" rx={3}
                  style={{ transition: 'height 0.7s ease, y 0.7s ease' }} />
                <text x={x + w / 2} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>{d.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function AreaChartSVG({ data, title }) {
  const mounted = useRef(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { if (!mounted.current) { mounted.current = true; requestAnimationFrame(() => setReady(true)); } }, []);
  const W = 520, H = 160, PL = 50, PB = 28, PR = 10, PT = 10;
  const chartW = W - PL - PR, chartH = H - PT - PB;
  const max = Math.max(...data.map(d => d.value), 1);
  const pts = data.map((d, i) => [PL + (i / Math.max(data.length - 1, 1)) * chartW, PT + chartH - (d.value / max) * chartH]);
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = pts.length > 0 ? `${pathD} L${pts[pts.length - 1][0]},${PT + chartH} L${pts[0][0]},${PT + chartH} Z` : '';
  return (
    <div style={{ ...glass, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{title}</div>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H}>
          <defs>
            <linearGradient id="agrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map(t => (
            <line key={t} x1={PL} x2={W - PR} y1={PT + chartH * (1 - t)} y2={PT + chartH * (1 - t)}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          ))}
          {ready && areaD && <path d={areaD} fill="url(#agrad)" />}
          {ready && pathD && <path d={pathD} fill="none" stroke="#60a5fa" strokeWidth={2} />}
          {data.map((d, i) => {
            const p = pts[i];
            if (!p) return null;
            return (
              <g key={d.label}>
                {ready && <circle cx={p[0]} cy={p[1]} r={3} fill="#60a5fa" />}
                <text x={p[0]} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>{d.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function OverviewTab({ data }) {
  const total = data.length;
  const totalVal = data.reduce((s, r) => s + (parseFloat(r.projValue) || 0), 0);
  const won = data.filter(r => (r.status || '').toLowerCase().includes('won') || (r.directorAction || '').toLowerCase().includes('approved')).length;
  const winRate = total ? Math.round((won / total) * 100) : 0;
  const active = data.filter(r => !['lost', 'cancelled', 'closed'].includes((r.status || '').toLowerCase())).length;

  const statusMap = {};
  data.forEach(r => { const k = r.reqStatus || r.status || 'Unknown'; statusMap[k] = (statusMap[k] || 0) + 1; });
  const statusData = Object.entries(statusMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }));

  const typeMap = {};
  data.forEach(r => { const k = r.requestType || 'New'; typeMap[k] = (typeMap[k] || 0) + 1; });
  const typeData = Object.entries(typeMap).map(([label, value]) => ({ label, value }));

  const clientMap = {};
  data.forEach(r => { if (r.client) clientMap[r.client] = (clientMap[r.client] || 0) + (parseFloat(r.projValue) || 0); });
  const clientData = Object.entries(clientMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value]) => ({ label, value: Math.round(value / 1000) }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.4s ease' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <KpiChip label="Total Requests" value={total} />
        <KpiChip label="Total Value" value={fmtAED(totalVal)} />
        <KpiChip label="Win Rate" value={`${winRate}%`} />
        <KpiChip label="Active Requests" value={active} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <HBarChart data={statusData} title="Status Distribution" />
        </div>
        <DonutChart data={typeData} title="Quotation Types" />
        <HBarChart data={clientData.map(d => ({ ...d, value: d.value }))} title="Top Clients by Value (AED k)" />
      </div>
    </div>
  );
}

function TrendsTab({ data }) {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('en', { month: 'short', year: '2-digit' }) });
  }
  const volMap = {}, valMap = {};
  data.forEach(r => {
    if (!r.submittedAt) return;
    const d = new Date(r.submittedAt);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    volMap[k] = (volMap[k] || 0) + 1;
    valMap[k] = (valMap[k] || 0) + (parseFloat(r.projValue) || 0);
  });
  const volData = months.map(m => ({ label: m.label, value: volMap[m.key] || 0 }));
  const valData = months.map(m => ({ label: m.label, value: Math.round((valMap[m.key] || 0) / 1000) }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.4s ease' }}>
      <BarChartSVG data={volData} title="Monthly Request Volume (Last 12 Months)" />
      <AreaChartSVG data={valData} title="Monthly Value Trend AED k (Last 12 Months)" />
    </div>
  );
}

function PerformanceTab({ data }) {
  const estMap = {};
  data.forEach(r => {
    const e = r.estimator || 'Unassigned';
    if (!estMap[e]) estMap[e] = { name: e, assigned: 0, completed: 0, approved: 0, totalVal: 0 };
    estMap[e].assigned++;
    const s = (r.status || '').toLowerCase();
    const da = (r.directorAction || '').toLowerCase();
    if (['completed', 'submitted', 'won'].some(x => s.includes(x))) estMap[e].completed++;
    if (da.includes('approved') || s.includes('won')) estMap[e].approved++;
    estMap[e].totalVal += parseFloat(r.projValue) || 0;
  });
  const rows = Object.values(estMap).sort((a, b) => b.assigned - a.assigned);
  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <div style={{ ...glass, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter',sans-serif", fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.06)', position: 'sticky', top: 0 }}>
                {['Estimator', 'Assigned', 'Completed', 'Approved', 'Win Rate', 'Avg Value'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.68rem', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.name} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                  <td style={{ padding: '10px 16px', color: '#e2e8f0', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '10px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.assigned}</td>
                  <td style={{ padding: '10px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.completed}</td>
                  <td style={{ padding: '10px 16px', color: '#34d399' }}>{r.approved}</td>
                  <td style={{ padding: '10px 16px', color: '#7ee8fa' }}>{r.assigned ? Math.round((r.approved / r.assigned) * 100) : 0}%</td>
                  <td style={{ padding: '10px 16px', color: 'rgba(255,255,255,0.5)' }}>{r.assigned ? fmtAED(Math.round(r.totalVal / r.assigned)) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const REPORT_CARDS = [
  { title: 'Finance Dashboard', desc: 'Revenue, costs & margins', color: '#60a5fa' },
  { title: 'Sales KPIs', desc: 'Pipeline & conversion metrics', color: '#a78bfa' },
  { title: 'Operational Metrics', desc: 'Cycle times & throughput', color: '#34d399' },
];

function ReportsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
      <div style={{ ...glass, padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, border: '1.5px dashed rgba(255,255,255,0.15)' }}>
        <svg width={48} height={48} viewBox="0 0 48 48" fill="none">
          <rect x={2} y={2} width={44} height={44} rx={8} fill="rgba(243,200,0,0.08)" stroke="rgba(243,200,0,0.3)" strokeWidth={1.5} />
          <text x={24} y={32} textAnchor="middle" fill="#f3c800" fontSize={22} fontWeight={700}>⚡</text>
        </svg>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Power BI Integration</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
          Connect your Power BI workspace to embed live reports here
        </div>
        <button style={{ marginTop: 8, padding: '9px 24px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed', fontFamily: "'Inter',sans-serif", fontSize: '0.8rem', letterSpacing: '0.04em' }} disabled>
          Configure Integration
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
        {REPORT_CARDS.map(c => (
          <div key={c.title} style={{ ...glass, padding: '18px 18px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 80, borderRadius: 8, background: `linear-gradient(135deg,${c.color}18,rgba(0,0,0,0))`, border: '1px solid rgba(255,255,255,0.06)', filter: 'blur(0.5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={32} height={32} viewBox="0 0 32 32"><rect x={4} y={16} width={5} height={12} rx={2} fill={c.color} opacity={0.4} /><rect x={13} y={10} width={5} height={18} rx={2} fill={c.color} opacity={0.4} /><rect x={22} y={6} width={5} height={22} rx={2} fill={c.color} opacity={0.4} /></svg>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{c.title}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIAnalysis({ onBack }) {
  const [tab, setTab] = useState(() => {
    try { const t = sessionStorage.getItem('aianalysis_tab') || 'overview'; sessionStorage.removeItem('aianalysis_tab'); return t; } catch { return 'overview'; }
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then(j => { setData(j.requests || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'linear-gradient(135deg,#02010e 0%,#060420 50%,#030012 100%)', fontFamily: "'Inter',sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ flexShrink: 0, padding: '18px 28px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, padding: '6px 16px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back
        </button>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>NAFFCO · Intelligence Suite</div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.35rem', fontWeight: 700, lineHeight: 1 }} className="an-aurora">AI Analysis</h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ flexShrink: 0, padding: '14px 28px 10px', display: 'flex', gap: 4 }}>
        {TABS.map(t => (
          <button key={t} className={`aai-tab-btn${tab === t.toLowerCase() ? ' active' : ''}`} onClick={() => setTab(t.toLowerCase())}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div className="aai-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 28px 28px' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Loading data…</div>
        )}
        {error && (
          <div style={{ ...glass, padding: '18px 22px', color: '#f87171', fontSize: '0.82rem' }}>Failed to load data: {error}</div>
        )}
        {!loading && !error && tab === 'overview' && <OverviewTab data={data} />}
        {!loading && !error && tab === 'trends' && <TrendsTab data={data} />}
        {!loading && !error && tab === 'performance' && <PerformanceTab data={data} />}
        {!loading && !error && tab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
