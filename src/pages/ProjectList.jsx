import { useState, useEffect } from 'react';

const AZURE_SAS = 'sv=2025-11-05&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-30T13:08:36Z&st=2026-04-19T20:00:00Z&spr=https&sig=GMAKHd37xTTyBo5eeCg%2BQjzdT37ga%2FtmBDGWHjzfZTc%3D';
const DATA_URL = `https://apexfilestorage2.blob.core.windows.net/estimation-docs/apex-data.json?${AZURE_SAS}`;

const fmtVal = v => {
  const n = Number(v) || 0;
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return String(n || 0);
};

const fmtDate = iso => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
  } catch { return '—'; }
};

const daysSince = iso => {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
};

const statusColor = s => {
  const l = (s || '').toLowerCase();
  if (l.includes('won') || l.includes('awarded')) return { bg: 'rgba(16,185,129,0.18)', color: '#34d399', border: '1px solid rgba(52,211,153,0.35)' };
  if (l.includes('lost') || l.includes('cancel')) return { bg: 'rgba(239,68,68,0.18)', color: '#f87171', border: '1px solid rgba(248,113,113,0.35)' };
  if (l.includes('submit') || l.includes('sent')) return { bg: 'rgba(99,102,241,0.18)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.35)' };
  if (l.includes('pending') || l.includes('progress')) return { bg: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' };
  return { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.25)' };
};

const TABS = ['all', 'lowmargin', 'overdue', 'duplication'];
const TAB_LABELS = { all: 'All Projects', lowmargin: 'Low Margin', overdue: 'Overdue Offers', duplication: 'Duplication' };

const chip = (label, value, color = '#818cf8') => (
  <div key={label} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.18)', borderRadius: 10, padding: '6px 18px', minWidth: 90 }}>
    <span style={{ color, fontWeight: 700, fontSize: 18 }}>{value}</span>
    <span style={{ color: '#64748b', fontSize: 11, marginTop: 1 }}>{label}</span>
  </div>
);

const TH = ({ children, style }) => (
  <th style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.06)', ...style }}>{children}</th>
);

const TD = ({ children, style }) => (
  <td style={{ padding: '10px 12px', fontSize: 13, color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.04)', ...style }}>{children}</td>
);

const Badge = ({ text, style }) => (
  <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700, ...style }}>{text}</span>
);

export default function ProjectList({ onBack }) {
  const [tab, setTab] = useState(() => {
    try { const t = sessionStorage.getItem('projectlist_tab') || 'all'; sessionStorage.removeItem('projectlist_tab'); return t; } catch { return 'all'; }
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(DATA_URL)
      .then(r => r.json())
      .then(json => {
        const rows = Array.isArray(json) ? json : (json.requests || json.data || []);
        rows.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
        setData(rows);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const filtered = data.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (r.proj || '').toLowerCase().includes(q) || (r.client || '').toLowerCase().includes(q) || String(r.id || '').includes(q);
  });

  const lowMargin = data.filter(r =>
    Number(r.projValue) < 50000 || r.salesStatus === 'Risk' || (r.status || '').toLowerCase().includes('risk')
  );

  const overdue = data.filter(r =>
    (r.reqStatus === 'inprogress' || r.reqStatus === 'pending-director') && daysSince(r.submittedAt) > 30
  );

  const dupGroups = (() => {
    const map = {};
    data.forEach(r => {
      const key = `${(r.client || '').trim()}|||${(r.mainContractor || '').trim()}`;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return Object.entries(map).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
  })();

  // ── Styles ────────────────────────────────────────────────────────────────
  const root = { position: 'fixed', inset: 0, zIndex: 200, background: 'linear-gradient(135deg,#02010e 0%,#060420 50%,#030012 100%)', fontFamily: "'Inter',sans-serif", color: '#e2e8f0', overflowY: 'auto' };
  const container = { maxWidth: 1200, margin: '0 auto', padding: '28px 20px 60px' };
  const glassTable = { background: 'rgba(0,4,12,0.55)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', borderRadius: 14, overflow: 'hidden', width: '100%' };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderProjectRow = (r, extra) => {
    const sc = statusColor(r.status);
    return (
      <tr key={r.id || Math.random()} style={{ transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.04)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <TD><span style={{ color: '#818cf8', fontWeight: 600, fontSize: 12 }}>{r.id || '—'}</span></TD>
        <TD style={{ maxWidth: 200 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.proj}>{r.proj || '—'}</span></TD>
        <TD style={{ maxWidth: 160 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.client}>{r.client || '—'}</span></TD>
        <TD style={{ maxWidth: 140 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.mainContractor}>{r.mainContractor || '—'}</span></TD>
        <TD><span style={{ fontWeight: 600, color: '#a5b4fc' }}>AED {fmtVal(r.projValue)}</span></TD>
        <TD><Badge text={r.status || 'N/A'} style={sc} /></TD>
        <TD><span style={{ color: '#94a3b8', fontSize: 12 }}>{r.salesStatus || '—'}</span></TD>
        <TD><span style={{ color: '#94a3b8', fontSize: 12 }}>{r.estimator || '—'}</span></TD>
        <TD><span style={{ color: '#475569', fontSize: 12 }}>{fmtDate(r.submittedAt)}</span></TD>
        {extra && <TD>{extra(r)}</TD>}
      </tr>
    );
  };

  const renderTable = (rows, extra, extraHeader) => (
    <div style={glassTable}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,4,14,0.80)' }}>
              <TH>ID</TH><TH>Project</TH><TH>Client</TH><TH>Contractor</TH>
              <TH>Value (AED)</TH><TH>Status</TH><TH>Sales Status</TH><TH>Estimator</TH><TH>Date</TH>
              {extraHeader && <TH>{extraHeader}</TH>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={extra ? 10 : 9} style={{ textAlign: 'center', padding: 40, color: '#475569' }}>No records found</td></tr>
              : rows.map(r => renderProjectRow(r, extra))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Tab content ───────────────────────────────────────────────────────────
  const renderAll = () => {
    const totalVal = filtered.reduce((s, r) => s + (Number(r.projValue) || 0), 0);
    const won = filtered.filter(r => (r.status || '').toLowerCase().includes('won') || (r.status || '').toLowerCase().includes('awarded')).length;
    const lost = filtered.filter(r => (r.status || '').toLowerCase().includes('lost')).length;
    return (
      <>
        <div style={{ marginBottom: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project, client, ID…"
            style={{ width: '100%', maxWidth: 380, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '9px 16px', color: '#e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          {chip('Total Projects', filtered.length)}
          {chip('Total Value', 'AED ' + fmtVal(totalVal), '#a5b4fc')}
          {chip('Won', won, '#34d399')}
          {chip('Lost', lost, '#f87171')}
        </div>
        {renderTable(filtered)}
      </>
    );
  };

  const renderLowMargin = () => {
    const totalVal = lowMargin.reduce((s, r) => s + (Number(r.projValue) || 0), 0);
    return (
      <>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <span style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '5px 14px', fontSize: 13, color: '#fca5a5' }}>
            Projects where estimated value is below AED 50,000 or marked as Risk
          </span>
          {chip('Low Margin', lowMargin.length, '#f87171')}
          {chip('Total Value', 'AED ' + fmtVal(totalVal), '#fbbf24')}
        </div>
        {renderTable(lowMargin, () => <Badge text="LOW" style={{ background: 'rgba(239,68,68,0.18)', color: '#f87171', border: '1px solid rgba(248,113,113,0.35)' }} />, 'Flag')}
      </>
    );
  };

  const renderOverdue = () => {
    const daysCell = r => {
      const d = daysSince(r.submittedAt);
      const color = d > 60 ? '#f87171' : '#fbbf24';
      return <span style={{ fontWeight: 700, color }}>{d}d</span>;
    };
    return (
      <>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <span style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, padding: '5px 14px', fontSize: 13, color: '#fde68a' }}>
            Requests still pending for over 30 days with no response
          </span>
          {chip('Overdue', overdue.length, '#fbbf24')}
        </div>
        {renderTable(overdue, daysCell, 'Days Pending')}
      </>
    );
  };

  const renderDuplication = () => (
    <>
      <div style={{ marginBottom: 18 }}>
        <span style={{ background: 'rgba(129,140,248,0.10)', border: '1px solid rgba(129,140,248,0.22)', borderRadius: 8, padding: '5px 14px', fontSize: 13, color: '#c7d2fe' }}>
          Projects with the same client + contractor combination submitted more than once
        </span>
      </div>
      {dupGroups.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>No duplicate groups found</div>}
      {dupGroups.map(([key, rows]) => {
        const [client, contractor] = key.split('|||');
        const open = expanded[key];
        return (
          <div key={key} style={{ ...glassTable, marginBottom: 16 }}>
            <div onClick={() => setExpanded(p => ({ ...p, [key]: !p[key] }))}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer', background: 'rgba(129,140,248,0.06)', userSelect: 'none' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>{client || '(No Client)'}</span>
              <span style={{ color: '#475569', fontSize: 13 }}>×</span>
              <span style={{ fontSize: 14, color: '#a5b4fc' }}>{contractor || '(No Contractor)'}</span>
              <Badge text={`${rows.length} duplicates`} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }} />
              <span style={{ color: '#64748b', fontSize: 18, marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
            </div>
            {open && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,4,14,0.80)' }}>
                      <TH>ID</TH><TH>Project</TH><TH>Client</TH><TH>Contractor</TH>
                      <TH>Value (AED)</TH><TH>Status</TH><TH>Sales Status</TH><TH>Estimator</TH><TH>Date</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const sc = statusColor(r.status);
                      return (
                        <tr key={r.id || i} style={{ background: 'rgba(239,68,68,0.04)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.09)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.04)'}>
                          <TD><span style={{ color: '#818cf8', fontWeight: 600, fontSize: 12 }}>{r.id || '—'}</span></TD>
                          <TD style={{ maxWidth: 200 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.proj}>{r.proj || '—'}</span></TD>
                          <TD style={{ color: '#fca5a5' }}>{r.client || '—'}</TD>
                          <TD style={{ color: '#fca5a5' }}>{r.mainContractor || '—'}</TD>
                          <TD><span style={{ fontWeight: 600, color: '#a5b4fc' }}>AED {fmtVal(r.projValue)}</span></TD>
                          <TD><Badge text={r.status || 'N/A'} style={sc} /></TD>
                          <TD><span style={{ color: '#94a3b8', fontSize: 12 }}>{r.salesStatus || '—'}</span></TD>
                          <TD><span style={{ color: '#94a3b8', fontSize: 12 }}>{r.estimator || '—'}</span></TD>
                          <TD><span style={{ color: '#475569', fontSize: 12 }}>{fmtDate(r.submittedAt)}</span></TD>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={root}>
      <div style={container}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <button onClick={onBack}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '6px 18px', color: '#94a3b8', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.15)'; e.currentTarget.style.color = '#818cf8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}>
            ← Back
          </button>
          <div>
            <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 700, background: 'linear-gradient(90deg,#818cf8,#c084fc,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1.2 }}>
              Project Analysis
            </h1>
            <p style={{ color: '#475569', fontSize: 12, margin: '3px 0 0', fontFamily: 'inherit' }}>NAFFCO Fire Protection — Estimation Intelligence</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '7px 20px', borderRadius: 10, border: tab === t ? '1px solid rgba(129,140,248,0.5)' : '1px solid rgba(255,255,255,0.07)', background: tab === t ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)', color: tab === t ? '#818cf8' : '#64748b', fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Body */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 80, color: '#475569' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
            <div>Loading project data…</div>
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '16px 20px', color: '#fca5a5', marginBottom: 20 }}>
            Failed to load data: {error}
          </div>
        )}
        {!loading && !error && (
          <>
            {tab === 'all' && renderAll()}
            {tab === 'lowmargin' && renderLowMargin()}
            {tab === 'overdue' && renderOverdue()}
            {tab === 'duplication' && renderDuplication()}
          </>
        )}
      </div>
    </div>
  );
}
