/**
 * pages/Estimator.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * NAFFCO Fire Door Estimator — main UI
 *
 * Replaces the old Gemini-based Estimator.jsx.
 * Called from App.jsx via: onNavigate(index, 'estimation')
 *
 * Features:
 *   • Add / edit / remove doors in a live table
 *   • AI extraction: upload BOQ/PDF → auto-populate table
 *   • Live pricing via pricingEngine (dual-pricing, no hardcoded values)
 *   • Per-door cost breakdown panel
 *   • Project totals summary
 *   • PDF export
 *   • Project info (name, client, consultant, etc.)
 *   • Admin tab: edit O&H % and Profit % (writes to Cosmos DB)
 *
 * Props:
 *   onClose()   — navigate back to 3D hub
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { calculateDoorPrice, calculateQuotation } from '../utils/pricingEngine';
import { loadPriceData, savePriceData, saveQuotation } from '../services/azureDb';
import { extractDoorsFromFiles, isAiAvailable } from '../services/aiExtractor';
import { downloadQuotationPDF } from '../utils/pdfGenerator';
import DoorEntryRow, { DoorEntryHeader } from '../components/DoorEntryRow';
import { DoorBreakdown, ProjectTotals } from '../components/PriceSummary';

// ─── BLANK DOOR TEMPLATE ──────────────────────────────────────────────────────
const newDoor = (ref) => ({
  doorRef:          ref || 'D-01',
  wMm:              900,
  hMm:              2100,
  leafCount:        1,
  leafThickMm:      1.2,
  frameMm:          1.5,
  jambDepthMm:      300,
  sheetCode:        'A',
  infill:           'HC',
  sealType:         'teardrop',
  fireRatedSealant: true,
  standard:         'UL',
  fireRating:       60,
  stcRating:        null,
  glassType:        null,
  glassCount:       0,
  finishType:       'powderCoat',
  louverType:       null,
  hardwareSetName:  null,
  warrantyYears:    0,
  includeInstallation: false,
  includeDelivery:  false,
  qty:              1,
});

const nextRef = (doors) => `D-${String(doors.length + 1).padStart(2, '0')}`;

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ['Schedule', 'Breakdown', 'Summary', 'Project Info', 'Admin'];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9500,
    background: 'rgba(0,0,10,0.65)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace",
  },
  panel: {
    width:  'min(1280px, calc(100vw - 24px))',
    height: 'min(840px, calc(100vh - 24px))',
    display: 'flex', flexDirection: 'column',
    background: 'rgba(5,4,18,0.96)',
    border: '1px solid rgba(114,206,238,0.22)',
    borderRadius: 18,
    boxShadow: '0 40px 100px rgba(0,0,0,0.80), 0 0 0 1px rgba(255,255,255,0.04) inset',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 18px',
    background: 'rgba(114,206,238,0.07)',
    borderBottom: '1px solid rgba(114,206,238,0.15)',
    flexShrink: 0,
  },
  tabBar: {
    display: 'flex', gap: 0,
    borderBottom: '1px solid rgba(114,206,238,0.12)',
    flexShrink: 0,
  },
  tab: (active) => ({
    padding: '8px 20px',
    fontSize: '0.68rem',
    fontWeight: active ? 700 : 400,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: active ? '#72CEEE' : 'rgba(255,255,255,0.30)',
    background: active ? 'rgba(114,206,238,0.08)' : 'transparent',
    borderBottom: active ? '2px solid #72CEEE' : '2px solid transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.15s',
  }),
  body: {
    flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
  },
  scrollArea: {
    flex: 1, overflowY: 'auto', overflowX: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(114,206,238,0.18) transparent',
  },
  actionBar: {
    display: 'flex', gap: 8, padding: '8px 14px',
    borderTop: '1px solid rgba(114,206,238,0.10)',
    background: 'rgba(0,0,0,0.30)',
    flexShrink: 0, flexWrap: 'wrap', alignItems: 'center',
  },
  btn: (variant) => {
    const base = {
      padding: '7px 16px', borderRadius: 8, border: 'none',
      cursor: 'pointer', fontSize: '0.70rem', fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      fontFamily: "'JetBrains Mono', monospace",
      transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
    };
    if (variant === 'primary')  return { ...base, background: 'linear-gradient(135deg,#1e4070,#2a6bb0)', color: '#72CEEE', border: '1px solid rgba(114,206,238,0.30)' };
    if (variant === 'success')  return { ...base, background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.30)' };
    if (variant === 'danger')   return { ...base, background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' };
    if (variant === 'ai')       return { ...base, background: 'linear-gradient(135deg,rgba(167,85,247,0.18),rgba(109,40,217,0.10))', color: '#c4b5fd', border: '1px solid rgba(168,85,247,0.28)' };
    if (variant === 'pdf')      return { ...base, background: 'rgba(255,204,0,0.10)', color: '#FFCC00', border: '1px solid rgba(255,204,0,0.25)' };
    return { ...base, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.10)' };
  },
  inp: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 7, color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.78rem', padding: '7px 12px',
    outline: 'none', width: '100%',
  },
  label: {
    fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'rgba(114,206,238,0.55)', marginBottom: 5, display: 'block',
    fontFamily: "'JetBrains Mono', monospace",
  },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Estimator({ onClose }) {
  const [tab, setTab]           = useState('Schedule');
  const [doors, setDoors]       = useState([newDoor('D-01')]);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [selectedDoor, setSelectedDoor] = useState(0);
  const [aiStatus, setAiStatus] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const fileRef = useRef(null);

  const [projectInfo, setProjectInfo] = useState({
    projectRef: '', projectName: '', client: '', consultant: '',
    mainContractor: '', preparedBy: '', validDays: 30, date: '',
  });

  const [adminEdit, setAdminEdit] = useState({ ohPercent: 15, profitPercent: 35 });
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminMsg, setAdminMsg] = useState('');

  // ── Load priceData from Cosmos on mount ──────────────────────────────────────
  useEffect(() => {
    loadPriceData().then(pd => {
      setPriceData(pd);
      setAdminEdit({
        ohPercent:     pd.margins.ohPercent,
        profitPercent: pd.margins.profitPercent,
      });
      setLoading(false);
    });
  }, []);

  // ── Quotation calculation ─────────────────────────────────────────────────────
  const quotation = useMemo(() => {
    if (!priceData || !doors.length) return null;
    try { return calculateQuotation(doors, priceData); }
    catch { return null; }
  }, [doors, priceData]);

  // ── Selected door result ──────────────────────────────────────────────────────
  const selectedResult = useMemo(() => {
    if (!priceData || !doors[selectedDoor]) return null;
    try { return calculateDoorPrice(doors[selectedDoor], priceData); }
    catch { return null; }
  }, [doors, selectedDoor, priceData]);

  // ── Door CRUD ─────────────────────────────────────────────────────────────────
  const addDoor = () => {
    setDoors(prev => [...prev, newDoor(nextRef(prev))]);
    setSelectedDoor(doors.length);
  };

  const updateDoor = useCallback((index, updated) => {
    setDoors(prev => prev.map((d, i) => i === index ? updated : d));
  }, []);

  const removeDoor = useCallback((index) => {
    setDoors(prev => prev.filter((_, i) => i !== index));
    setSelectedDoor(prev => Math.max(0, prev > index ? prev - 1 : prev));
  }, []);

  const duplicateDoor = (index) => {
    const copy = { ...doors[index], doorRef: nextRef(doors) };
    setDoors(prev => [...prev, copy]);
  };

  // ── AI Extraction ─────────────────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setAiLoading(true);
    setAiStatus(`Reading ${files.length} file(s)…`);
    try {
      const { doors: extracted, fileCount } = await extractDoorsFromFiles(files, setAiStatus);
      if (extracted.length) {
        setDoors(prev => [...prev, ...extracted]);
        setAiStatus(`✓ Added ${extracted.length} door(s) from ${fileCount} file(s)`);
        setTab('Schedule');
      } else {
        setAiStatus('No doors found — please add manually');
      }
    } catch (err) {
      setAiStatus(`Error: ${err.message}`);
    }
    setAiLoading(false);
    e.target.value = '';
  };

  // ── PDF Export ────────────────────────────────────────────────────────────────
  const exportPDF = () => {
    if (!quotation) return;
    const lines = quotation.lines.map((l, i) => ({ ...doors[i], ...l }));
    downloadQuotationPDF({ ...quotation, lines }, projectInfo, priceData.margins);
  };

  // ── Save to Cosmos ────────────────────────────────────────────────────────────
  const saveToCloud = async () => {
    if (!quotation) return;
    await saveQuotation({
      projectId:   projectInfo.projectRef || `q-${Date.now()}`,
      projectName: projectInfo.projectName,
      doors,
      totals:      quotation,
      createdBy:   projectInfo.preparedBy,
    });
  };

  // ── Admin: save margins ───────────────────────────────────────────────────────
  const saveMargins = async () => {
    setAdminSaving(true);
    const updated = {
      ...priceData,
      margins: { ohPercent: Number(adminEdit.ohPercent), profitPercent: Number(adminEdit.profitPercent) },
    };
    const ok = await savePriceData(updated);
    if (ok) {
      setPriceData(updated);
      setAdminMsg('✓ Margins saved to Cosmos DB');
    } else {
      setAdminMsg('✗ Save failed — check Cosmos connection');
    }
    setAdminSaving(false);
    setTimeout(() => setAdminMsg(''), 3000);
  };

  const hardwareSetNames = priceData ? Object.keys(priceData.hardwareSets) : [];

  // ─── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div style={S.overlay}>
      <div style={S.panel}>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Logo mark */}
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg,rgba(114,206,238,0.25),rgba(114,206,238,0.08))',
              border: '1px solid rgba(114,206,238,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#72CEEE" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="12" y2="17"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', color: '#72CEEE', textTransform: 'uppercase' }}>
                NAFFCO · Fire Door Estimator
              </div>
              <div style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.30)', letterSpacing: '0.06em' }}>
                {loading ? 'Loading price data…' : `${doors.length} door(s) · ${quotation ? `Grand Total: AED ${quotation.grandTotal.toLocaleString()}` : 'calculating…'}`}
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {aiStatus && (
              <span style={{ fontSize: '0.62rem', color: 'rgba(196,181,253,0.70)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {aiStatus}
              </span>
            )}
            <button style={S.btn('default')} onClick={onClose}>✕ Close</button>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div style={S.tabBar}>
          {TABS.map(t => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.18)', padding: '0 12px', alignSelf: 'center' }}>
            {priceData ? `O&H ${priceData.margins.ohPercent}% · Profit ${priceData.margins.profitPercent}%` : ''}
          </span>
        </div>

        {/* ── BODY ── */}
        <div style={S.body}>

          {/* ════════════ SCHEDULE TAB ════════════ */}
          {tab === 'Schedule' && (
            <>
              <div style={S.scrollArea}>
                {loading ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'rgba(114,206,238,0.40)', fontSize: '0.80rem' }}>
                    Loading price data from Cosmos DB…
                  </div>
                ) : (
                  <>
                    <DoorEntryHeader />
                    {doors.map((door, i) => (
                      <DoorEntryRow
                        key={i}
                        door={door}
                        index={i}
                        onChange={updateDoor}
                        onRemove={removeDoor}
                        priceData={priceData}
                        hardwareSetNames={hardwareSetNames}
                      />
                    ))}
                    {!doors.length && (
                      <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.20)', fontSize: '0.76rem' }}>
                        No doors yet — click "Add Door" or upload a BOQ document
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action bar */}
              <div style={S.actionBar}>
                <button style={S.btn('primary')} onClick={addDoor}>＋ Add Door</button>
                {selectedDoor < doors.length && (
                  <button style={S.btn('default')} onClick={() => duplicateDoor(selectedDoor)}>⧉ Duplicate</button>
                )}

                {/* AI Upload */}
                {isAiAvailable() && (
                  <>
                    <button
                      style={S.btn('ai')}
                      onClick={() => fileRef.current?.click()}
                      disabled={aiLoading}
                    >
                      {aiLoading ? '⟳ Extracting…' : '✦ Upload BOQ (AI)'}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.txt,.csv,.xlsx,.xls" multiple
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </>
                )}

                <div style={{ flex: 1 }} />

                {/* Grand total pill */}
                {quotation && (
                  <div style={{
                    background: 'rgba(114,206,238,0.10)',
                    border: '1px solid rgba(114,206,238,0.25)',
                    borderRadius: 100,
                    padding: '5px 14px',
                    fontSize: '0.72rem', fontWeight: 700, color: '#72CEEE',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    TOTAL: AED {quotation.grandTotal.toLocaleString('en-AE', { maximumFractionDigits: 0 })}
                  </div>
                )}

                <button style={S.btn('pdf')} onClick={exportPDF} disabled={!quotation}>
                  ⬇ Export PDF
                </button>
                <button style={S.btn('success')} onClick={saveToCloud} disabled={!quotation}>
                  ☁ Save
                </button>
              </div>
            </>
          )}

          {/* ════════════ BREAKDOWN TAB ════════════ */}
          {tab === 'Breakdown' && (
            <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
              {/* Door selector sidebar */}
              <div style={{
                width: 200, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
                overflowY: 'auto',
              }}>
                <div style={{ padding: '10px 12px', fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(114,206,238,0.45)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Select Door
                </div>
                {doors.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDoor(i)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '9px 12px',
                      background: selectedDoor === i ? 'rgba(114,206,238,0.10)' : 'transparent',
                      borderLeft: selectedDoor === i ? '3px solid #72CEEE' : '3px solid transparent',
                      border: 'none', cursor: 'pointer',
                      color: selectedDoor === i ? '#72CEEE' : 'rgba(255,255,255,0.45)',
                      fontSize: '0.72rem',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{d.doorRef || `D-${i+1}`}</div>
                    <div style={{ fontSize: '0.60rem', opacity: 0.6 }}>{d.wMm}×{d.hMm} {d.leafCount===2?'DD':'SD'}</div>
                  </button>
                ))}
              </div>

              {/* Breakdown panel */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <DoorBreakdown
                  result={selectedResult}
                  door={doors[selectedDoor]}
                  margins={priceData?.margins}
                />
              </div>
            </div>
          )}

          {/* ════════════ SUMMARY TAB ════════════ */}
          {tab === 'Summary' && (
            <div style={{ ...S.scrollArea, padding: 16 }}>
              <ProjectTotals quotation={quotation} margins={priceData?.margins} />

              {/* Per-door summary table */}
              {quotation && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(114,206,238,0.50)', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                    Per-Door Summary
                  </div>
                  <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
                    {/* header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr 80px 80px 90px 100px', gap: 8, padding: '7px 12px', background: 'rgba(114,206,238,0.06)', fontSize: '0.58rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(114,206,238,0.50)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {['#', 'Ref', 'Spec', 'Qty', 'Base', 'Unit Price', 'Line Total'].map((h,i) => (
                        <div key={i} style={{ textAlign: i > 2 ? 'right' : 'left' }}>{h}</div>
                      ))}
                    </div>
                    {quotation.lines.map((line, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '60px 80px 1fr 80px 80px 90px 100px',
                        gap: 8, padding: '7px 12px', alignItems: 'center',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '0.72rem', color: 'rgba(226,232,240,0.75)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        <div style={{ color: 'rgba(114,206,238,0.50)' }}>{line.lineNo}</div>
                        <div style={{ fontWeight: 700, color: '#72CEEE' }}>{doors[i]?.doorRef || `D-${i+1}`}</div>
                        <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.40)' }}>
                          {doors[i]?.wMm}×{doors[i]?.hMm}mm {doors[i]?.leafCount===2?'DD':'SD'} {doors[i]?.infill} {doors[i]?.standard||''}
                        </div>
                        <div style={{ textAlign: 'right' }}>{line.qty}</div>
                        <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.45)' }}>
                          {line.finalBaseTotal?.toLocaleString('en-AE', { maximumFractionDigits: 0 })}
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 700 }}>
                          AED {line.unitDoorSetPrice?.toLocaleString('en-AE', { maximumFractionDigits: 0 })}
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 700, color: '#72CEEE' }}>
                          AED {line.lineTotal?.toLocaleString('en-AE', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════ PROJECT INFO TAB ════════════ */}
          {tab === 'Project Info' && (
            <div style={{ ...S.scrollArea, padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700 }}>
                {[
                  { key: 'projectRef',    label: 'Quote Reference',  placeholder: 'Q-2025-001' },
                  { key: 'projectName',   label: 'Project Name',     placeholder: 'NAFFCO HQ Expansion' },
                  { key: 'client',        label: 'Client',           placeholder: 'Client name' },
                  { key: 'consultant',    label: 'Consultant',       placeholder: 'Consultant firm' },
                  { key: 'mainContractor',label: 'Main Contractor',  placeholder: 'Contractor name' },
                  { key: 'preparedBy',    label: 'Prepared By',      placeholder: 'Your name' },
                  { key: 'validDays',     label: 'Valid for (days)', placeholder: '30', type: 'number' },
                  { key: 'date',          label: 'Date',             placeholder: 'Auto', type: 'date' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={S.label}>{label}</label>
                    <input
                      style={S.inp}
                      type={type || 'text'}
                      value={projectInfo[key] || ''}
                      onChange={e => setProjectInfo(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <button style={S.btn('pdf')} onClick={exportPDF} disabled={!quotation}>
                  ⬇ Generate PDF with This Info
                </button>
              </div>
            </div>
          )}

          {/* ════════════ ADMIN TAB ════════════ */}
          {tab === 'Admin' && (
            <div style={{ ...S.scrollArea, padding: 24 }}>
              <div style={{ maxWidth: 440 }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(114,206,238,0.50)', marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
                  Commercial Margins — Admin Only
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={S.label}>Overhead & Handling (%)</label>
                    <input
                      style={S.inp}
                      type="number"
                      min={0} max={100}
                      value={adminEdit.ohPercent}
                      onChange={e => setAdminEdit(p => ({ ...p, ohPercent: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={S.label}>Profit Margin (%)</label>
                    <input
                      style={S.inp}
                      type="number"
                      min={0} max={100}
                      value={adminEdit.profitPercent}
                      onChange={e => setAdminEdit(p => ({ ...p, profitPercent: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    style={S.btn('success')}
                    onClick={saveMargins}
                    disabled={adminSaving}
                  >
                    {adminSaving ? '⟳ Saving…' : '☁ Save to Cosmos DB'}
                  </button>
                  {adminMsg && (
                    <span style={{ fontSize: '0.68rem', color: adminMsg.startsWith('✓') ? '#34d399' : '#f87171', fontFamily: "'JetBrains Mono', monospace" }}>
                      {adminMsg}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 24, padding: 14, background: 'rgba(255,204,0,0.05)', border: '1px solid rgba(255,204,0,0.15)', borderRadius: 8, fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                  ⚠ Changes to margins affect ALL new quotations immediately.<br/>
                  Existing saved quotations are not retroactively updated.<br/>
                  All other rates are managed in the Cosmos DB pricemaster document.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
