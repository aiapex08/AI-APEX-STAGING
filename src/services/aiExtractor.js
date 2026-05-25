/**
 * services/aiExtractor.js  v2
 * ─────────────────────────────────────────────────────────────────────────────
 * Supports: PDF, images (JPG/PNG/WEBP), XLSX, XLS, CSV, TXT
 * Multiple files at once — merges all extracted doors into one list
 * XLSX/XLS: converted to CSV text via SheetJS before sending to Claude
 * ─────────────────────────────────────────────────────────────────────────────
 */
import * as XLSX from 'xlsx';

const API_URL = '/api/anthropic/v1/messages';
const MODEL   = 'claude-3-5-sonnet-20241022';

// ─── EXTRACTION PROMPT ────────────────────────────────────────────────────────
const EXTRACTION_SYSTEM = `You are a NAFFCO fire door estimation assistant.
Extract a structured door schedule from the attached document.

For EACH door extract:
- doorRef: door tag/reference number
- wMm: width in mm (default 900)
- hMm: height in mm (default 2100)
- leafCount: 1=single, 2=double (default 1)
- leafThickMm: 1.0|1.2|1.5|1.8|2.0|2.5 (default 1.2)
- frameMm: frame thickness mm (default 1.5)
- infill: HC (honeycomb) or MW (mineral wool) (default HC)
- standard: UL | BS | null
- fireRating: minutes e.g. 60,90,120 or null
- stcRating: number or null
- glassType: Firelite|Firelite NT|Firelite PLUS|Clear Tempered|Georgian Wired|Pyran Platinum|Pyrostop|null
- glassCount: number of vision panels (default 0)
- finishType: powderCoat|superDurable|epoxy|wooden (default powderCoat)
- louverType: bottom|full|null
- hardwareSetName: e.g. "SET-1 BS304 SD-L" or null
- qty: quantity (default 1)

Respond ONLY with a valid JSON array. No markdown, no explanation.
Example: [{"doorRef":"D-01","wMm":900,"hMm":2100,"leafCount":1,"leafThickMm":1.2,"frameMm":1.5,"infill":"HC","standard":"UL","fireRating":60,"stcRating":null,"glassType":null,"glassCount":0,"finishType":"powderCoat","louverType":null,"hardwareSetName":null,"qty":1}]
If no door data found return: []`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getApiKey() {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const SUPPORTED_MIME = [
  'application/pdf',
  'image/jpeg','image/jpg','image/png','image/gif','image/webp',
];

function isImage(mime) {
  return mime.startsWith('image/');
}

/**
 * Convert XLSX/XLS/CSV file → plain text CSV string using SheetJS
 */
async function excelToText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const results = [];
  workbook.SheetNames.forEach(name => {
    const sheet = workbook.Sheets[name];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    if (csv.trim()) {
      results.push(`=== Sheet: ${name} ===\n${csv}`);
    }
  });
  return results.join('\n\n');
}

function normalizeExtracted(raw, sourceFile) {
  if (!Array.isArray(raw)) return [];
  return raw.map((d, i) => ({
    doorRef:          d.doorRef        || `D-${String(i + 1).padStart(2, '0')}`,
    wMm:              Number(d.wMm)    || 900,
    hMm:              Number(d.hMm)    || 2100,
    leafCount:        Number(d.leafCount)   || 1,
    leafThickMm:      Number(d.leafThickMm) || 1.2,
    frameMm:          Number(d.frameMm)     || 1.5,
    jambDepthMm:      300,
    sheetCode:        'A',
    infill:           d.infill        || 'HC',
    sealType:         'teardrop',
    fireRatedSealant: true,
    standard:         d.standard      || null,
    fireRating:       d.fireRating    || null,
    stcRating:        d.stcRating     || null,
    glassType:        d.glassType     || null,
    glassCount:       Number(d.glassCount)  || 0,
    finishType:       d.finishType    || 'powderCoat',
    louverType:       d.louverType    || null,
    hardwareSetName:  d.hardwareSetName || null,
    warrantyYears:    0,
    includeInstallation: false,
    includeDelivery:  false,
    qty:              Number(d.qty)   || 1,
    _source:          sourceFile,
  }));
}

async function extractFromSingleFile(file, onProgress) {
  const mime = file.type || '';
  const name = file.name || '';
  const ext  = name.split('.').pop().toLowerCase();

  console.log('[aiExtractor] Processing:', name, 'mime:', mime, 'ext:', ext);
  onProgress?.(`Processing ${name}…`);

  const userContent = [];

  // ── XLSX / XLS → convert to text via SheetJS ──────────────────────────────
  if (['xlsx','xls'].includes(ext) || mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('openxmlformats')) {
    onProgress?.(`Converting Excel: ${name}…`);
    const text = await excelToText(file);
    console.log('[aiExtractor] Excel converted, text length:', text.length);
    userContent.push({ type: 'text', text: `Excel file: ${name}\n\n${text}` });
  }
  // ── CSV / TXT ──────────────────────────────────────────────────────────────
  else if (ext === 'csv' || ext === 'txt' || mime === 'text/plain' || mime === 'text/csv') {
    const text = await file.text();
    console.log('[aiExtractor] Text file, length:', text.length);
    userContent.push({ type: 'text', text: `File: ${name}\n\n${text}` });
  }
  // ── PDF ───────────────────────────────────────────────────────────────────
  else if (mime === 'application/pdf' || ext === 'pdf') {
    onProgress?.(`Reading PDF: ${name}…`);
    const b64 = await fileToBase64(file);
    console.log('[aiExtractor] PDF base64 length:', b64.length);
    userContent.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: b64 },
    });
  }
  // ── Images ────────────────────────────────────────────────────────────────
  else if (isImage(mime) || ['jpg','jpeg','png','gif','webp'].includes(ext)) {
    onProgress?.(`Reading image: ${name}…`);
    const b64 = await fileToBase64(file);
    const safeMime = ['image/jpeg','image/png','image/gif','image/webp'].includes(mime)
      ? mime : 'image/jpeg';
    console.log('[aiExtractor] Image mime:', safeMime, 'base64 length:', b64.length);
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: safeMime, data: b64 },
    });
  }
  else {
    // Fallback: try as plain text
    try {
      const text = await file.text();
      console.log('[aiExtractor] Fallback text, length:', text.length);
      userContent.push({ type: 'text', text: `File: ${name}\n\n${text}` });
    } catch {
      throw new Error(`Unsupported file type: ${ext} (${mime})`);
    }
  }

  userContent.push({ type: 'text', text: `Extract ALL fire door entries from this document as a JSON array. 
Look for: door numbers/tags, dimensions (width x height), leaf type (single/double), fire rating, glass panels, hardware, quantity.
Return ONLY a JSON array, nothing else.` });

  onProgress?.(`Sending ${name} to Claude AI…`);
  console.log('[aiExtractor] Sending to Claude, content blocks:', userContent.length);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: 4096,
      system:     EXTRACTION_SYSTEM,
      messages:   [{ role: 'user', content: userContent }],
    }),
  });

  console.log('[aiExtractor] Response status:', response.status);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error('[aiExtractor] API error:', err);
    throw new Error(`Claude API error ${response.status}: ${err?.error?.message || response.statusText}`);
  }

  const data    = await response.json();
  const rawText = data.content?.find(b => b.type === 'text')?.text || '[]';
  console.log('[aiExtractor] Raw Claude response:', rawText.substring(0, 500));

  const clean = rawText.replace(/```json|```/g, '').trim();

  let parsed = [];
  try {
    parsed = JSON.parse(clean);
    console.log('[aiExtractor] Parsed doors:', parsed.length);
  } catch(e) {
    console.warn('[aiExtractor] JSON parse failed:', e.message, '\nRaw:', rawText);
    // Try to extract JSON array from response
    const match = rawText.match(/\[.*\]/s);
    if (match) {
      try { parsed = JSON.parse(match[0]); }
      catch { console.warn('[aiExtractor] Fallback parse also failed'); }
    }
  }

  return normalizeExtracted(parsed, name);
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Extract doors from MULTIPLE files at once.
 * Merges all results into a single door array.
 *
 * @param {FileList | File[]} files
 * @param {function} onProgress  (message: string) => void
 * @returns {Promise<{ doors: Array, fileCount: number, totalTokens: number }>}
 */
export async function extractDoorsFromFiles(files, onProgress) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env.local');

  const fileArray = Array.from(files);
  const allDoors  = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    onProgress?.(`File ${i + 1}/${fileArray.length}: ${file.name}`);
    try {
      const doors = await extractFromSingleFile(file, onProgress);
      allDoors.push(...doors);
      onProgress?.(`✓ ${file.name} → ${doors.length} door(s) found`);
    } catch (err) {
      onProgress?.(`⚠ ${file.name}: ${err.message}`);
    }
  }

  onProgress?.(`✓ Done — ${allDoors.length} total door(s) extracted`);
  return { doors: allDoors, fileCount: fileArray.length };
}

// Keep single-file export for backward compat
export async function extractDoorsFromFile(file, userHint = '', onProgress) {
  const { doors } = await extractDoorsFromFiles([file], onProgress);
  return { doors, rawText: '', tokensUsed: 0 };
}

export function isAiAvailable() {
  return Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY);
}
