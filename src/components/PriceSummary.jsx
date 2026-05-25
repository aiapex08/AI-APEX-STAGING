/**
 * components/PriceSummary.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays the full cost breakdown for a selected door or the project total.
 * Receives: result from calculateDoorPrice() or calculateQuotation()
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fmt = (n) =>
  n == null ? '—' : `AED ${Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pct = (n) => (n == null ? '—' : `${n}%`);

// ─── ROW HELPERS ──────────────────────────────────────────────────────────────
function Row({ label, p1, p2, used, highlight }) {
  const diff = Math.abs((p1 || 0) - (p2 || 0)) > 0.01;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 90px 90px 100px',
      gap: 8,
      padding: '5px 12px',
      background: highlight ? 'rgba(114,206,238,0.07)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: '0.76rem', color: 'rgba(226,232,240,0.75)', fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
      <span style={{ fontSize: '0.72rem', color: 'rgba(96,165,250,0.70)', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(p1)}</span>
      <span style={{ fontSize: '0.72rem', color: 'rgba(52,211,153,0.70)', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(p2)}</span>
      <span style={{
        fontSize: '0.78rem',
        fontWeight: 700,
        textAlign: 'right',
        fontFamily: "'JetBrains Mono', monospace",
        color: diff ? '#FFCC00' : 'rgba(114,206,238,0.90)',
      }}>{fmt(used)}</span>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{
      padding: '8px 12px 4px',
      fontSize: '0.58rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(114,206,238,0.45)',
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      borderTop: '1px solid rgba(114,206,238,0.12)',
      marginTop: 4,
    }}>{label}</div>
  );
}

function TotalRow({ label, value, large }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: large ? '10px 12px' : '6px 12px',
      background: large ? 'rgba(114,206,238,0.10)' : 'transparent',
      borderTop: large ? '1px solid rgba(114,206,238,0.25)' : 'none',
    }}>
      <span style={{
        fontSize: large ? '0.80rem' : '0.74rem',
        fontWeight: large ? 700 : 400,
        color: large ? '#e2e8f0' : 'rgba(226,232,240,0.60)',
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.04em',
      }}>{label}</span>
      <span style={{
        fontSize: large ? '1.0rem' : '0.80rem',
        fontWeight: 700,
        color: large ? '#72CEEE' : 'rgba(114,206,238,0.80)',
        fontFamily: "'JetBrains Mono', monospace",
      }}>{fmt(value)}</span>
    </div>
  );
}

// ─── DOOR BREAKDOWN PANEL ─────────────────────────────────────────────────────
export function DoorBreakdown({ result, door, margins }) {
  if (!result) return (
    <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.76rem' }}>
      Select a door to see its breakdown
    </div>
  );

  const bd = result.breakdown;

  const compRows = [
    { label: 'Steel Sheets',     ...bd.steel },
    { label: 'Frame Steel',      ...bd.frameSteel },
    { label: 'Labour',           ...bd.labour },
    { label: 'Kerf Seal',        ...bd.kerfSeal },
    { label: 'PU Foam',          ...bd.puFoam },
    { label: 'Silicon Sealant',  ...bd.sealant },
    { label: 'Anchoring',        ...bd.anchoring },
    { label: 'Primer',           ...bd.primer },
    { label: 'Rock Wool',        ...bd.rockwool },
    { label: 'Vision Panel',     ...bd.glass },
    { label: 'Louver',           ...bd.louver },
    { label: 'Fire Label',       ...bd.fireLabel },
    { label: 'STC Surcharge',    ...bd.stcSurcharge },
    { label: 'Finish',           ...bd.finish },
    { label: 'Seamless',         ...bd.seamless },
    { label: 'Warranty',         ...bd.warranty },
  ].filter(r => (r.used || 0) > 0);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 90px 90px 100px',
        gap: 8,
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {['Component', 'Pricing 1', 'Pricing 2', 'Used (Higher)'].map((h, i) => (
          <div key={i} style={{
            fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: ['rgba(255,255,255,0.4)', 'rgba(96,165,250,0.6)', 'rgba(52,211,153,0.6)', 'rgba(114,206,238,0.7)'][i],
            textAlign: i > 0 ? 'right' : 'left',
          }}>{h}</div>
        ))}
      </div>

      <Divider label="Material & Labour" />
      {compRows.map((r, i) => (
        <Row key={i} label={r.label} p1={r.p1} p2={r.p2} used={r.used} />
      ))}

      {/* Totals */}
      <div style={{ marginTop: 8 }}>
        <TotalRow label={`Base Cost`}                  value={result.finalBaseTotal} />
        <TotalRow label={`O&H (${margins?.ohPercent ?? 15}%)`}
                                                         value={bd._totals?.ohAmount} />
        <TotalRow label={`Profit (${margins?.profitPercent ?? 35}%)`}
                                                         value={bd._totals?.profitAmount} />
        <TotalRow label="Installation"                 value={bd.installation || 0} />
        <TotalRow label="Delivery"                     value={bd.delivery || 0} />
        <TotalRow label="Hardware"                     value={result.unitHardwareCost} />
        <TotalRow label={`UNIT PRICE × ${door?.qty || 1}`} value={result.unitDoorSetPrice} large />
        {(door?.qty || 1) > 1 && (
          <TotalRow label={`LINE TOTAL (×${door.qty})`} value={result.lineTotal} large />
        )}
      </div>

      {/* Dual pricing comparison */}
      <div style={{
        margin: '12px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
      }}>
        {[
          { label: 'P1 Base', value: result.pricing1Total, color: 'rgba(96,165,250,0.8)' },
          { label: 'P2 Base', value: result.pricing2Total, color: 'rgba(52,211,153,0.8)' },
          { label: 'Max Used', value: result.finalBaseTotal, color: '#72CEEE' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '0.80rem', fontWeight: 700, color }}>{fmt(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROJECT TOTALS PANEL ─────────────────────────────────────────────────────
export function ProjectTotals({ quotation, margins }) {
  if (!quotation) return null;

  return (
    <div style={{
      background: 'rgba(6,3,22,0.85)',
      border: '1px solid rgba(114,206,238,0.20)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        background: 'rgba(114,206,238,0.08)',
        borderBottom: '1px solid rgba(114,206,238,0.15)',
        fontSize: '0.65rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'rgba(114,206,238,0.70)',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
      }}>
        PROJECT COST SUMMARY
      </div>

      <div style={{ padding: '4px 0' }}>
        <TotalRow label="Total Material + Labour" value={quotation.finalBaseTotal} />
        <TotalRow label="Door & Frame Total"       value={quotation.doorFrameTotal} />
        <TotalRow label="Hardware Total"           value={quotation.hardwareTotal} />
        <div style={{ height: 8 }} />

        {/* P1 vs P2 comparison bar */}
        <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(96,165,250,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>Pricing 1 Total</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'rgba(96,165,250,0.9)', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(quotation.pricing1Total)}</div>
          </div>
          <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(52,211,153,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>Pricing 2 Total</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'rgba(52,211,153,0.9)', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(quotation.pricing2Total)}</div>
          </div>
        </div>

        <div style={{ padding: '0 12px 8px' }}>
          <div style={{ background: 'rgba(255,204,0,0.06)', border: '1px solid rgba(255,204,0,0.15)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(255,204,0,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>Max Used (Both Pricings)</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFCC00', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(quotation.finalBaseTotal)}</div>
          </div>
        </div>

        <TotalRow label={`O&H (${margins?.ohPercent ?? 15}%) + Profit (${margins?.profitPercent ?? 35}%)`}
                  value={quotation.grandTotal - quotation.doorFrameTotal - quotation.hardwareTotal} />
      </div>

      {/* Grand total */}
      <div style={{
        margin: 12,
        padding: '14px 16px',
        background: 'linear-gradient(135deg, rgba(114,206,238,0.12), rgba(114,206,238,0.06))',
        border: '1px solid rgba(114,206,238,0.30)',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.80rem', color: '#e2e8f0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          GRAND TOTAL (excl. VAT)
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '1.30rem', color: '#72CEEE' }}>
          {fmt(quotation.grandTotal)}
        </span>
      </div>

      <div style={{ padding: '0 16px 12px', fontSize: '0.60rem', color: 'rgba(255,255,255,0.22)', fontFamily: "'JetBrains Mono', monospace" }}>
        VAT (5%) to be added separately · Prices in AED
      </div>
    </div>
  );
}

export default { DoorBreakdown, ProjectTotals };
