/**
 * utils/pdfGenerator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a professional NAFFCO fire door quotation PDF using jsPDF.
 *
 * Install: npm install jspdf jspdf-autotable
 * ─────────────────────────────────────────────────────────────────────────────
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── COLOURS (NAFFCO brand palette) ──────────────────────────────────────────
const C = {
  navy:     [10,  16,  60],
  cyan:     [114, 206, 238],
  white:    [255, 255, 255],
  lightGray:[240, 243, 248],
  midGray:  [160, 170, 185],
  darkText: [30,  35,  50],
  gold:     [255, 204, 0],
  red:      [180, 20,  30],
};

const fmt = (n) =>
  n == null ? '—' : `AED ${Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtN = (n, dec = 0) =>
  n == null ? '—' : Number(n).toLocaleString('en-AE', { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
/**
 * generateQuotationPDF(quotation, projectInfo, margins)
 *
 * @param {object} quotation     — result from calculateQuotation()
 * @param {object} projectInfo   — { projectName, projectRef, client, consultant,
 *                                   mainContractor, preparedBy, validDays, date }
 * @param {object} margins       — { ohPercent, profitPercent }
 * @returns {jsPDF}              — call .save('filename.pdf') or .output('bloburl')
 */
export function generateQuotationPDF(quotation, projectInfo = {}, margins = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 297
  const H = doc.internal.pageSize.getHeight();  // 210
  const now = new Date();
  const dateStr = projectInfo.date || now.toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });

  let y = 0;

  // ── PAGE HEADER ─────────────────────────────────────────────────────────────
  // Navy header bar
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, W, 28, 'F');

  // Cyan accent stripe
  doc.setFillColor(...C.cyan);
  doc.rect(0, 28, W, 1.5, 'F');

  // NAFFCO branding
  doc.setTextColor(...C.cyan);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('NAFFCO', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text('NATIONAL FIRE FIGHTING MANUFACTURING CO.', 14, 17);
  doc.text('Fire Doors Division · Dubai, UAE', 14, 21);

  // Document title (right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...C.white);
  doc.text('FIRE DOOR ESTIMATION', W - 14, 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.cyan);
  const ref = projectInfo.projectRef || `Q-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  doc.text(`Ref: ${ref}`, W - 14, 19, { align: 'right' });
  doc.text(`Date: ${dateStr}`, W - 14, 24, { align: 'right' });

  y = 34;

  // ── PROJECT INFO BOX ────────────────────────────────────────────────────────
  doc.setFillColor(...C.lightGray);
  doc.rect(14, y, W - 28, 22, 'F');
  doc.setDrawColor(...C.cyan);
  doc.setLineWidth(0.4);
  doc.rect(14, y, W - 28, 22);

  const infoData = [
    ['Project:', projectInfo.projectName || '—', 'Client:', projectInfo.client || '—'],
    ['Consultant:', projectInfo.consultant || '—', 'Main Contractor:', projectInfo.mainContractor || '—'],
    ['Prepared by:', projectInfo.preparedBy || '—', 'Valid for:', `${projectInfo.validDays || 30} days`],
  ];

  doc.setTextColor(...C.darkText);
  infoData.forEach((row, i) => {
    const yy = y + 5 + i * 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(row[0], 18, yy);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 48, yy);
    doc.setFont('helvetica', 'bold');
    doc.text(row[2], 130, yy);
    doc.setFont('helvetica', 'normal');
    doc.text(row[3], 172, yy);
  });

  y += 28;

  // ── DOOR SCHEDULE TABLE ─────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.navy);
  doc.text('DOOR SCHEDULE', 14, y + 5);
  y += 8;

  const doorRows = quotation.lines.map(line => {
    const d = line; // line has doorRef etc. from the door input
    return [
      line.lineNo,
      line.doorRef  || `D-${String(line.lineNo).padStart(2,'0')}`,
      `${line.wMm || '—'} × ${line.hMm || '—'}`,
      line.leafCount === 2 ? 'Double' : 'Single',
      line.infill   || 'HC',
      line.standard || '—',
      line.glassType || '—',
      line.finishType?.replace(/([A-Z])/g, ' $1') || '—',
      line.hardwareSetName || '—',
      fmtN(line.qty),
      fmt(line.unitDoorSetPrice),
      fmt(line.lineTotal),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [[
      '#', 'Door Ref', 'W×H (mm)', 'Leaf', 'Core',
      'Std', 'Glass', 'Finish', 'Hardware Set', 'Qty', 'Unit Price', 'Line Total',
    ]],
    body: doorRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7,
      cellPadding: 2,
      textColor: C.darkText,
    },
    headStyles: {
      fillColor: C.navy,
      textColor: C.white,
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: { fillColor: [248, 250, 253] },
    columnStyles: {
      0:  { cellWidth: 8,  halign: 'center' },
      1:  { cellWidth: 22 },
      2:  { cellWidth: 22, halign: 'center' },
      3:  { cellWidth: 16, halign: 'center' },
      4:  { cellWidth: 16, halign: 'center' },
      5:  { cellWidth: 12, halign: 'center' },
      6:  { cellWidth: 24 },
      7:  { cellWidth: 22 },
      8:  { cellWidth: 30 },
      9:  { cellWidth: 12, halign: 'center' },
      10: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
      11: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: C.navy },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // footer on each page
      _drawFooter(doc, W, H, data.pageNumber);
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  // ── COST SUMMARY TABLE ──────────────────────────────────────────────────────
  // Check if we need a new page
  if (y > H - 65) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.navy);
  doc.text('PROJECT COST SUMMARY', 14, y + 5);
  y += 8;

  const summaryRows = [
    ['Total Material + Labour (base)', fmt(quotation.finalBaseTotal), '', ''],
    ['  ↳ Pricing 1 base (Price Master)',  fmt(quotation.pricing1Total), '', ''],
    ['  ↳ Pricing 2 base (Template NVE)',  fmt(quotation.pricing2Total), '', ''],
    ['  ↳ Higher value used (per component)', fmt(quotation.finalBaseTotal), '', ''],
    ['Door & Frame Total', fmt(quotation.doorFrameTotal), '', ''],
    ['Hardware Total',     fmt(quotation.hardwareTotal), '', ''],
    [`Overhead & Handling (${margins.ohPercent ?? 15}%)`, `${margins.ohPercent ?? 15}% on base`, '', ''],
    [`Profit Margin (${margins.profitPercent ?? 35}%)`, `${margins.profitPercent ?? 35}% on base + O&H`, '', ''],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Amount (AED)', '', '']],
    body: summaryRows,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 7.5, cellPadding: 2.5, textColor: C.darkText },
    headStyles: { fillColor: C.navy, textColor: C.white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 253] },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
    },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 4;

  // Grand total highlight box
  doc.setFillColor(...C.navy);
  doc.rect(14, y, 210, 12, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(14, y, 3, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text('GRAND TOTAL (EXCLUDING VAT)', 22, y + 8);

  doc.setFontSize(12);
  doc.setTextColor(...C.cyan);
  doc.text(fmt(quotation.grandTotal), 220, y + 8, { align: 'right' });

  y += 16;

  // VAT note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...C.midGray);
  doc.text('* VAT at 5% to be added to the above grand total. Prices valid for the period stated above.', 14, y);
  doc.text('* All prices in UAE Dirhams (AED). This quotation is subject to NAFFCO standard terms and conditions.', 14, y + 4);

  // ── FOOTER ON LAST PAGE ─────────────────────────────────────────────────────
  _drawFooter(doc, W, H, doc.internal.getNumberOfPages());

  return doc;
}

function _drawFooter(doc, W, H, pageNum) {
  doc.setFillColor(...C.navy);
  doc.rect(0, H - 10, W, 10, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(180, 200, 220);
  doc.text('NAFFCO · National Fire Fighting Manufacturing · Dubai, UAE · www.naffco.com', 14, H - 4);
  doc.text(`Page ${pageNum}`, W - 14, H - 4, { align: 'right' });
}

/**
 * Quick helper: generate and trigger browser download.
 *
 * @param {object} quotation
 * @param {object} projectInfo
 * @param {object} margins
 */
export function downloadQuotationPDF(quotation, projectInfo, margins) {
  const doc = generateQuotationPDF(quotation, projectInfo, margins);
  const ref = projectInfo.projectRef || `QUOTE-${Date.now()}`;
  doc.save(`NAFFCO_${ref}.pdf`);
}

/**
 * Return a blob URL for inline preview.
 */
export function previewQuotationPDF(quotation, projectInfo, margins) {
  const doc = generateQuotationPDF(quotation, projectInfo, margins);
  return doc.output('bloburl');
}
