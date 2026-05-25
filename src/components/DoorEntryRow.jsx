/**
 * components/DoorEntryRow.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Single row in the door schedule table.
 * Receives: door object + index, onChange handler, onRemove handler, priceData
 * Displays: all editable door fields + live unit price preview
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useMemo } from 'react';
import { calculateDoorPrice } from '../utils/pricingEngine';

// ─── OPTION LISTS ─────────────────────────────────────────────────────────────
const THICKNESSES  = [1.0, 1.2, 1.5, 1.8, 2.0, 2.5];
const SHEET_CODES  = ['A','B','C','D','E'];
const INFILLS      = [{ value: 'HC', label: 'Honeycomb' }, { value: 'MW', label: 'Mineral Wool' }];
const STANDARDS    = [{ value: '', label: '—' }, { value: 'UL', label: 'UL' }, { value: 'BS', label: 'BS' }];
const GLASS_TYPES  = ['', 'Firelite','Firelite NT','Firelite PLUS','Clear Tempered','Georgian Wired','Pyran Platinum','Pyrostop','Contraflam EI60','Contraflam EW120'];
const LOUVER_TYPES = [{ value: '', label: '—' }, { value: 'bottom', label: 'Bottom' }, { value: 'full', label: 'Full' }];
const FINISH_TYPES = [
  { value: 'powderCoat',   label: 'Powder Coat' },
  { value: 'superDurable', label: 'Super Durable' },
  { value: 'epoxy',        label: 'Epoxy' },
  { value: 'wooden',       label: 'Wooden' },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  row: {
    display: 'grid',
    gridTemplateColumns: '32px 80px 70px 70px 60px 60px 50px 50px 80px 50px 110px 60px 80px 60px 80px 70px 80px',
    gap: 4,
    alignItems: 'center',
    padding: '6px 8px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    transition: 'background 0.15s',
  },
  inp: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 5,
    color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.72rem',
    padding: '4px 6px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  sel: {
    background: 'rgba(10,8,30,0.95)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 5,
    color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.72rem',
    padding: '3px 4px',
    width: '100%',
    outline: 'none',
  },
  price: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#72CEEE',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255,80,80,0.5)',
    fontSize: '1rem',
    lineHeight: 1,
    padding: 0,
    transition: 'color 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function DoorEntryRow({ door, index, onChange, onRemove, priceData, hardwareSetNames }) {
  const [hovered, setHovered] = useState(false);

  const set = (field, value) => onChange(index, { ...door, [field]: value });
  const num = (field, value) => onChange(index, { ...door, [field]: parseFloat(value) || 0 });
  const int = (field, value) => onChange(index, { ...door, [field]: parseInt(value, 10) || 1 });

  // Live price calculation
  const result = useMemo(() => {
    try {
      return calculateDoorPrice(door, priceData);
    } catch {
      return null;
    }
  }, [door, priceData]);

  const unitPrice = result?.unitDoorSetPrice ?? 0;
  const lineTotal = result?.lineTotal        ?? 0;

  return (
    <div
      style={{ ...S.row, background: hovered ? 'rgba(114,206,238,0.04)' : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Remove */}
      <button
        style={S.removeBtn}
        onClick={() => onRemove(index)}
        title="Remove door"
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,80,80,1)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,80,80,0.5)')}
      >
        ✕
      </button>

      {/* Door Ref */}
      <input
        style={S.inp}
        value={door.doorRef || ''}
        onChange={e => set('doorRef', e.target.value)}
        placeholder="D-01"
        title="Door reference"
      />

      {/* Width */}
      <input
        style={S.inp}
        type="number"
        value={door.wMm || ''}
        onChange={e => num('wMm', e.target.value)}
        placeholder="W (mm)"
        min={400} max={3000}
        title="Width mm"
      />

      {/* Height */}
      <input
        style={S.inp}
        type="number"
        value={door.hMm || ''}
        onChange={e => num('hMm', e.target.value)}
        placeholder="H (mm)"
        min={1800} max={4000}
        title="Height mm"
      />

      {/* Leaf count */}
      <select style={S.sel} value={door.leafCount || 1} onChange={e => int('leafCount', e.target.value)} title="Single / Double leaf">
        <option value={1}>Single</option>
        <option value={2}>Double</option>
      </select>

      {/* Leaf thickness */}
      <select style={S.sel} value={door.leafThickMm || 1.2} onChange={e => num('leafThickMm', e.target.value)} title="Leaf face sheet thickness">
        {THICKNESSES.map(t => <option key={t} value={t}>{t}mm</option>)}
      </select>

      {/* Frame thickness */}
      <select style={S.sel} value={door.frameMm || 1.5} onChange={e => num('frameMm', e.target.value)} title="Frame sheet thickness">
        {[1.2, 1.5, 1.8, 2.0].map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      {/* Sheet code */}
      <select style={S.sel} value={door.sheetCode || 'A'} onChange={e => set('sheetCode', e.target.value)} title="Sheet size code">
        {SHEET_CODES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Infill */}
      <select style={S.sel} value={door.infill || 'HC'} onChange={e => set('infill', e.target.value)} title="Door infill type">
        {INFILLS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Standard */}
      <select style={S.sel} value={door.standard || ''} onChange={e => set('standard', e.target.value || null)} title="Fire rating standard">
        {STANDARDS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Glass type */}
      <select style={S.sel} value={door.glassType || ''} onChange={e => set('glassType', e.target.value || null)} title="Vision panel glass type">
        {GLASS_TYPES.map(g => <option key={g} value={g}>{g || '— No Glass —'}</option>)}
      </select>

      {/* Glass count */}
      <input
        style={{ ...S.inp, textAlign: 'center' }}
        type="number"
        value={door.glassCount || 0}
        onChange={e => int('glassCount', e.target.value)}
        min={0} max={10}
        title="Number of vision panels"
      />

      {/* Finish */}
      <select style={S.sel} value={door.finishType || 'powderCoat'} onChange={e => set('finishType', e.target.value)} title="Surface finish">
        {FINISH_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Louver */}
      <select style={S.sel} value={door.louverType || ''} onChange={e => set('louverType', e.target.value || null)} title="Louver type">
        {LOUVER_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Hardware set */}
      <select style={S.sel} value={door.hardwareSetName || ''} onChange={e => set('hardwareSetName', e.target.value || null)} title="Hardware set">
        <option value="">— No HW —</option>
        {hardwareSetNames.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      {/* Qty */}
      <input
        style={{ ...S.inp, textAlign: 'center' }}
        type="number"
        value={door.qty || 1}
        onChange={e => int('qty', e.target.value)}
        min={1} max={999}
        title="Quantity"
      />

      {/* Unit price + line total */}
      <div style={{ textAlign: 'right' }}>
        <div style={S.price}>
          {unitPrice ? `AED ${unitPrice.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—'}
        </div>
        {(door.qty || 1) > 1 && (
          <div style={{ ...S.price, fontSize: '0.64rem', color: 'rgba(114,206,238,0.55)' }}>
            ×{door.qty} = {lineTotal.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COLUMN HEADER ROW ────────────────────────────────────────────────────────
export function DoorEntryHeader() {
  const heads = [
    '', 'Ref', 'W (mm)', 'H (mm)', 'Leaf', 'Leaf t', 'Fr t', 'Code',
    'Infill', 'Std', 'Glass Type', '#Glass', 'Finish', 'Louver',
    'HW Set', 'Qty', 'Unit Price',
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32px 80px 70px 70px 60px 60px 50px 50px 80px 50px 110px 60px 80px 60px 80px 70px 80px',
      gap: 4,
      padding: '6px 8px',
      borderBottom: '1px solid rgba(114,206,238,0.2)',
      background: 'rgba(114,206,238,0.05)',
    }}>
      {heads.map((h, i) => (
        <div key={i} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.60rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: 'rgba(114,206,238,0.60)',
          textTransform: 'uppercase',
          textAlign: i === heads.length - 1 ? 'right' : 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{h}</div>
      ))}
    </div>
  );
}
