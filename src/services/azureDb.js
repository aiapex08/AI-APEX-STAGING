/**
 * services/azureDb.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Azure Cosmos DB connection via Azure Static Web Apps built-in Data API
 * or direct REST if the Data API bridge is not configured.
 *
 * Single responsibility: load / save priceData from Cosmos DB.
 * The priceData object is the SINGLE SOURCE OF TRUTH for all pricing.
 *
 * Setup (Azure Portal):
 *   Cosmos DB account → database: "naffco-estimator"
 *     container: "pricemaster"   (partition key: /type)
 *     container: "quotations"    (partition key: /projectId)
 *
 * Environment variables (set in Azure Static Web App settings + .env.local):
 *   VITE_COSMOS_ENDPOINT   = https://<account>.documents.azure.com:443/
 *   VITE_COSMOS_KEY        = <primary readonly key for client queries>
 *   VITE_COSMOS_DB         = naffco-estimator
 *   VITE_COSMOS_CONTAINER  = pricemaster
 *
 * NOTE: For production, move writes behind an Azure Function (never expose
 * write keys to the browser). Read-only key is safe client-side.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ENDPOINT  = import.meta.env.VITE_COSMOS_ENDPOINT  || '';
const KEY       = import.meta.env.VITE_COSMOS_KEY        || '';
const DB        = import.meta.env.VITE_COSMOS_DB         || 'naffco-estimator';
const CONTAINER = import.meta.env.VITE_COSMOS_CONTAINER  || 'pricemaster';

// ─── COSMOS REST HELPERS ──────────────────────────────────────────────────────

/**
 * Generate a UTC date string formatted exactly as Cosmos DB expects for auth.
 */
function utcNow() {
  return new Date().toUTCString().replace('GMT', 'gmt');
}

/**
 * Generate a Cosmos DB authorization token (master key auth).
 * NOTE: Only safe with a read-only key exposed to the browser.
 */
async function cosmosAuth(method, resourceType, resourceLink, date) {
  const text = `${method.toLowerCase()}\n${resourceType.toLowerCase()}\n${resourceLink}\n${date.toLowerCase()}\n\n`;
  const encoder = new TextEncoder();
  const keyBytes = Uint8Array.from(atob(KEY), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(text));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return encodeURIComponent(`type=master&ver=1.0&sig=${b64}`);
}

async function cosmosQuery(sql, parameters = []) {
  if (!ENDPOINT || !KEY) return null; // fall back to defaults
  const resourceLink = `dbs/${DB}/colls/${CONTAINER}`;
  const date = utcNow();
  const auth = await cosmosAuth('post', 'docs', resourceLink, date);
  const url  = `${ENDPOINT}${resourceLink}/docs`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':               'application/query+json',
      'x-ms-date':                  date,
      'x-ms-version':               '2018-12-31',
      'x-ms-documentdb-isquery':    'true',
      'x-ms-query-enable-crosspartition': 'true',
      'Authorization':              auth,
    },
    body: JSON.stringify({ query: sql, parameters }),
  });

  if (!res.ok) {
    console.error('[azureDb] Cosmos query failed:', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return data.Documents || [];
}

async function cosmosUpsert(doc) {
  if (!ENDPOINT || !KEY) return false;
  const resourceLink = `dbs/${DB}/colls/${CONTAINER}`;
  const date = utcNow();
  const auth = await cosmosAuth('post', 'docs', resourceLink, date);
  const url  = `${ENDPOINT}${resourceLink}/docs`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'x-ms-date':     date,
      'x-ms-version':  '2018-12-31',
      'x-ms-documentdb-is-upsert': 'true',
      'Authorization': auth,
    },
    body: JSON.stringify(doc),
  });
  return res.ok;
}

// ─── DEFAULT PRICE DATA (fallback when Cosmos is unavailable) ────────────────
// All values verified from NAFFCO_Price_Master_Consolidated.xlsx
// Dual-pricing rule: each rate = max(P1, P2) from the consolidated master.

export const DEFAULT_PRICE_DATA = {
  // ── Steel sheets (AED/sheet) — code, thickness, p1Price, p2Price ──────────
  steelSheets: [
    // Code A: 1219×2200mm
    { code: 'A', thickness: 1.0, p1Price: 132,  p2Price: 101.10 },
    { code: 'A', thickness: 1.2, p1Price: 152,  p2Price: 121.32 },
    { code: 'A', thickness: 1.5, p1Price: 182,  p2Price: 151.65 },
    { code: 'A', thickness: 1.8, p1Price: 212,  p2Price: 181.98 },
    { code: 'A', thickness: 2.0, p1Price: 233,  p2Price: 202.20 },
    { code: 'A', thickness: 2.5, p1Price: 283,  p2Price: 252.75 },
    // Code B: 1219×2438mm
    { code: 'B', thickness: 1.0, p1Price: 142,  p2Price: 112.12 },
    { code: 'B', thickness: 1.2, p1Price: 165,  p2Price: 134.54 },
    { code: 'B', thickness: 1.5, p1Price: 198,  p2Price: 168.17 },
    { code: 'B', thickness: 1.8, p1Price: 232,  p2Price: 201.81 },
    { code: 'B', thickness: 2.0, p1Price: 254,  p2Price: 224.24 },
    // Code C: 1219×2600mm
    { code: 'C', thickness: 1.2, p1Price: 174,  p2Price: 143.45 },
    // Code D: 1219×3100mm
    { code: 'D', thickness: 1.0, p1Price: 173,  p2Price: 133.69 },
    { code: 'D', thickness: 1.2, p1Price: 201,  p2Price: 160.43 },
    { code: 'D', thickness: 1.5, p1Price: 244,  p2Price: 200.54 },
    { code: 'D', thickness: 1.8, p1Price: 287,  p2Price: 240.64 },
    { code: 'D', thickness: 2.0, p1Price: 315,  p2Price: 267.38 },
    // Code E: 1500×3100mm
    { code: 'E', thickness: 1.2, p1Price: 241,  p2Price: 197.39 },
    { code: 'E', thickness: 1.5, p1Price: 293,  p2Price: 246.74 },
    { code: 'E', thickness: 1.8, p1Price: 346,  p2Price: 296.08 },
    { code: 'E', thickness: 2.0, p1Price: 381,  p2Price: 328.98 },
  ],

  // ── Pricing 1 rates (NAFFCO Price Master) ─────────────────────────────────
  p1: {
    steelKgRate:           4.75,
    labourHCPerLeaf:       85,
    labourMWPerLeaf:       130,
    kerfSealRatePerM:      10,
    tearDropSealRatePerM:  5,
    puFoamRatePerTube:     32,
    sealantFRRatePerTube:  4.5,
    sealantNFRRatePerTube: 4.5,
    primerRatePerM2:       22.4,
    rockwoolRatePerSlab:   20,
    fireRatingUL:          12,
    fireRatingBS:          7,
    powderCoatRatePerM2:   35,
    louverBottomPerLeaf:   100,
    louverFullPerM2:       400,
    anchoringRate:         30.4,
    epoxyFlatSingle:       1000,
    epoxyFlatDouble:       1800,
    woodenFlatSingle:      550,
    woodenFlatDouble:      850,
    installSingle:         150,
    installDouble:         250,
    deliveryPerDoor:       200,
  },

  // ── Pricing 2 rates (Template NEW VE DATA) ────────────────────────────────
  p2: {
    steelKgRate:           4.5,
    labourHCPerLeaf:       85,
    labourMWPerLeaf:       130,
    kerfSealRatePerM:      10,
    tearDropSealRatePerM:  5,
    puFoamRatePerTube:     32.8,
    sealantFRRatePerTube:  11.5,
    sealantNFRRatePerTube: 6,
    primerRatePerM2:       32,
    rockwoolRatePerSlab:   22,
    fireRatingUL:          12,
    fireRatingBS:          7,
    powderCoatRatePerM2:   14,
    louverBottomPerM2:     400,
    louverFullPerM2:       375,
    anchoringRate:         30.4,
    installSurchargeH2500: 52,
    installSurchargeH2900: 83,
    installSurchargeH3050: 101,
    seamlessPerLmHeight:   16,
    sealantProfitMult:     1.1,
  },

  // ── Labour / consumable constants ─────────────────────────────────────────
  labour: {
    frameSectionWeightKgPerM:  6.8,
    puFoamTubeVolMl:           650,
    puFoamExpandRatio:         40,
    puFoamWastage:             1.2,
    puFoamAppCharge:           5,
    sealantTubeVolMl:          250,
    sealantMlPerM:             20,
    sealantWastage:            1.1,
    sealantAppCharge:          4,
    visionPanelFrameRate:      80,
    warrantyRatePerYear:       0.025,
    superDurableMultiplier:    2,
  },

  // ── Glass rates (AED/panel) ────────────────────────────────────────────────
  glassRates: {
    'Firelite':          { p1: 150, p2: 150 },
    'Firelite NT':       { p1: 200, p2: 200 },
    'Firelite PLUS':     { p1: 500, p2: 500 },
    'Pyran Platinum':    { p1: 250, p2: 250 },
    'Georgian Wired':    { p1: 500, p2: 500 },
    'Clear Tempered':    { p1: 250, p2: 333 },
    'Pyrostop':          { p1: 1000,p2: 1000},
    'Contraflam EI60':   { p1: 2024,p2: 2024},
    'Contraflam EW120':  { p1: 1288,p2: 1288},
  },

  // ── STC acoustic surcharges ────────────────────────────────────────────────
  stcRates: [
    { minStc: 25, maxStc: 39, singleRate: 75,  doubleRate: 235 },
    { minStc: 40, maxStc: 42, singleRate: 278, doubleRate: 438 },
    { minStc: 45, maxStc: 99, singleRate: 353, doubleRate: 438 },
  ],

  // ── Hardware sets ──────────────────────────────────────────────────────────
  hardwareSets: {
    'SET-1 BS304 SD-L':  [
      { item: 'Hinge 4" SS304',          qty: 3, unitPrice: 45  },
      { item: 'Mortice Lock BS304',       qty: 1, unitPrice: 185 },
      { item: 'Lever Handle SS304 pair',  qty: 1, unitPrice: 120 },
      { item: 'Door Closer SS304',        qty: 1, unitPrice: 220 },
      { item: 'Floor Spring SS304',       qty: 0, unitPrice: 0   },
      { item: 'Door Stop SS304',          qty: 1, unitPrice: 25  },
    ],
    'SET-2 BS304 DD-L':  [
      { item: 'Hinge 4" SS304',           qty: 6, unitPrice: 45  },
      { item: 'Panic Bar BS304 active',   qty: 1, unitPrice: 650 },
      { item: 'Panic Bar BS304 inactive', qty: 1, unitPrice: 420 },
      { item: 'Door Closer SS304 x2',     qty: 2, unitPrice: 220 },
      { item: 'Door Coordinator',         qty: 1, unitPrice: 185 },
      { item: 'Door Stop SS304',          qty: 2, unitPrice: 25  },
    ],
    'SET-3 ANSI304 SD-L': [
      { item: 'Hinge 4" ANSI304',         qty: 3, unitPrice: 38  },
      { item: 'Cylindrical Lock ANSI304', qty: 1, unitPrice: 155 },
      { item: 'Lever Handle ANSI304 pr',  qty: 1, unitPrice: 95  },
      { item: 'Door Closer ANSI',         qty: 1, unitPrice: 195 },
      { item: 'Door Stop ANSI304',        qty: 1, unitPrice: 22  },
    ],
    'None': [],
  },

  // ── Commercial margins (admin-editable) ───────────────────────────────────
  margins: {
    ohPercent:     15,
    profitPercent: 35,
  },
};

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Load the live priceData from Cosmos DB.
 * Falls back to DEFAULT_PRICE_DATA if Cosmos is unreachable.
 *
 * @returns {Promise<object>} priceData
 */
export async function loadPriceData() {
  try {
    const docs = await cosmosQuery(
      "SELECT * FROM c WHERE c.type = 'pricemaster' ORDER BY c._ts DESC OFFSET 0 LIMIT 1"
    );
    if (docs && docs.length > 0) {
      const { id, _rid, _self, _etag, _attachments, _ts, type, ...priceData } = docs[0];
      console.info('[azureDb] Loaded priceData from Cosmos DB', new Date(_ts * 1000));
      return priceData;
    }
  } catch (err) {
    console.warn('[azureDb] Cosmos unavailable, using defaults:', err.message);
  }
  console.info('[azureDb] Using DEFAULT_PRICE_DATA');
  return DEFAULT_PRICE_DATA;
}

/**
 * Save updated priceData back to Cosmos DB.
 * Only admin role should call this.
 *
 * @param {object} priceData
 * @returns {Promise<boolean>} success
 */
export async function savePriceData(priceData) {
  const doc = {
    id:   'pricemaster-current',
    type: 'pricemaster',
    ...priceData,
    updatedAt: new Date().toISOString(),
  };
  const ok = await cosmosUpsert(doc);
  if (ok) console.info('[azureDb] priceData saved to Cosmos DB');
  else    console.error('[azureDb] Failed to save priceData');
  return ok;
}

/**
 * Save a completed quotation document.
 *
 * @param {object} quotation  { projectId, projectName, doors[], totals, createdBy, ... }
 * @returns {Promise<boolean>}
 */
export async function saveQuotation(quotation) {
  const doc = {
    id:        `q-${quotation.projectId}-${Date.now()}`,
    type:      'quotation',
    createdAt: new Date().toISOString(),
    ...quotation,
  };
  return cosmosUpsert(doc);
}

/**
 * List recent quotations for the current user / project.
 *
 * @param {string} [projectId]  optional filter
 * @returns {Promise<Array>}
 */
export async function listQuotations(projectId) {
  const where = projectId
    ? `WHERE c.type = 'quotation' AND c.projectId = @pid`
    : `WHERE c.type = 'quotation'`;
  const params = projectId ? [{ name: '@pid', value: projectId }] : [];
  const docs = await cosmosQuery(
    `SELECT c.id, c.projectId, c.projectName, c.createdAt, c.createdBy, c.totals
     FROM c ${where} ORDER BY c._ts DESC OFFSET 0 LIMIT 50`,
    params
  );
  return docs || [];
}
