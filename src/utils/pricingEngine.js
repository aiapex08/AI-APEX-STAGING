/**
 * NAFFCO Fire Door Pricing Engine  v2
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements DUAL-PRICING logic:
 *   Pricing 1 = rates from NAFFCO_Price_Master.xlsx  (priceData.p1)
 *   Pricing 2 = rates from Excel_estimator_template.xlsx / NEW VE DATA  (priceData.p2)
 *   Final cost = max(P1_component, P2_component)  per component line
 *
 * All monetary values: AED.  All dimensions: mm unless noted.
 * No prices hardcoded — every rate loaded from Cosmos DB / Price Master.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const toM = (mm) => mm / 1000;
const areaM2 = (wMm, hMm) => toM(wMm) * toM(hMm);
// Frame perimeter = 2H + W  (metres)
const perimeterM = (wMm, hMm) => 2 * toM(hMm) + toM(wMm);

/** Return max(a, b).  Undefined/null treated as 0. */
const higher = (a, b) => Math.max(a || 0, b || 0);

// ─── STEEL SHEET LOOKUP ──────────────────────────────────────────────────────

/**
 * Look up per-sheet price for a given sheet code + thickness.
 * Returns { p1, p2, used } where used = max(p1, p2).
 *
 * priceData.steelSheets = array of:
 *   { code, thickness, p1Price, p2Price }
 * p2Price = weight(kg) × p2.steelKgRate
 */
function getSheetPrice(sheetCode, thicknessMm, priceData) {
  const row = priceData.steelSheets.find(
    (r) => r.code === sheetCode && r.thickness === thicknessMm
  );
  if (!row) throw new Error(`No sheet price: code=${sheetCode} t=${thicknessMm}mm`);
  const p1 = row.p1Price;
  const p2 = row.p2Price;
  return { p1, p2, used: higher(p1, p2) };
}

// ─── STEEL MATERIAL COST ─────────────────────────────────────────────────────

/**
 * 2 face sheets per leaf (front + back) + 1 frame sheet per door.
 * Returns component breakdown with p1, p2, used per sheet type.
 */
function steelMaterialCost(sheetCode, leafThickMm, frameMm, leafCount, priceData) {
  const leafSheet = getSheetPrice(sheetCode, leafThickMm, priceData);
  const frameSheet = getSheetPrice(sheetCode, frameMm, priceData);
  const nFaceSheets = sheetCode === 'E' ? 3 : 2;

  const p1 = nFaceSheets * leafSheet.p1 * leafCount + frameSheet.p1;
  const p2 = nFaceSheets * leafSheet.p2 * leafCount + frameSheet.p2;
  return { p1, p2, used: higher(p1, p2) };
}

// ─── FRAME STEEL COST ────────────────────────────────────────────────────────

/**
 * Frame steel cost = perimeter(m) × sectionWeight(kg/m, scaled to thickness) × steelKgRate
 * p1 uses steelKgRateP1 (4.75 AED/kg), p2 uses steelKgRateP2 (4.5 AED/kg)
 */
function frameSteelCost(wMm, hMm, frameMm, priceData) {
  const perim = perimeterM(wMm, hMm);
  const baseWeight = priceData.labour.frameSectionWeightKgPerM; // e.g. 6.8 kg/m at 1.5mm
  const scaledWeight = baseWeight * (frameMm / 1.5);
  const weightKg = perim * scaledWeight;

  const p1 = weightKg * priceData.p1.steelKgRate;
  const p2 = weightKg * priceData.p2.steelKgRate;
  return { p1, p2, used: higher(p1, p2) };
}

// ─── LABOUR ──────────────────────────────────────────────────────────────────

/**
 * p1/p2 labour rates per leaf — HC (honeycomb) or MW (mineral wool / rockwool).
 * materialType: 'HC' | 'MW'
 * Both sources agree on HC=85, MW=130, but stored separately for admin editability.
 */
function labourCost(leafCount, materialType, priceData) {
  const key = materialType === 'HC' ? 'labourHCPerLeaf' : 'labourMWPerLeaf';
  const p1 = leafCount * priceData.p1[key];
  const p2 = leafCount * priceData.p2[key];
  return { p1, p2, used: higher(p1, p2) };
}

// ─── KERF / FRAME SEAL ───────────────────────────────────────────────────────

/**
 * Frame seal (IS1046si tear-drop or kerf) per metre of perimeter.
 * Both sources agree on 5–10 AED/m range.
 */
function kerfSealCost(wMm, hMm, sealType, priceData) {
  // sealType: 'kerf' | 'teardrop'
  const perim = perimeterM(wMm, hMm);
  const key = sealType === 'kerf' ? 'kerfSealRatePerM' : 'tearDropSealRatePerM';
  const p1 = perim * priceData.p1[key];
  const p2 = perim * priceData.p2[key];
  return { p1, p2, used: higher(p1, p2) };
}

// ─── PU FOAM ─────────────────────────────────────────────────────────────────

/**
 * Tubes = ceil(perim × jambDepth(m) × 1000 litres → ml  /  (tubeVol × expandRatio)  × wastage)
 * Then cost = tubes × ratePerTube + applicationCharge
 */
function puFoamCost(wMm, hMm, jambDepthMm, priceData) {
  const { puFoamTubeVolMl, puFoamExpandRatio, puFoamWastage, puFoamAppCharge } = priceData.labour;
  const jambVolLitres = perimeterM(wMm, hMm) * toM(jambDepthMm);
  const mlNeeded = jambVolLitres * 1000 / puFoamExpandRatio;
  const tubes = Math.ceil(mlNeeded * puFoamWastage / puFoamTubeVolMl);

  const p1 = tubes * priceData.p1.puFoamRatePerTube + puFoamAppCharge;
  const p2 = tubes * priceData.p2.puFoamRatePerTube + puFoamAppCharge;
  return { p1, p2, used: higher(p1, p2), tubes };
}

// ─── SILICON SEALANT ─────────────────────────────────────────────────────────

/**
 * 2 sides, 20ml/m bead.
 * p2 includes wastage × profit multiplier from NEW VE DATA.
 */
function sealantCost(wMm, hMm, fireRated, priceData) {
  const { sealantTubeVolMl, sealantWastage, sealantAppCharge } = priceData.labour;
  const totalMl = perimeterM(wMm, hMm) * 2 * priceData.labour.sealantMlPerM;
  const tubes = Math.ceil(totalMl / sealantTubeVolMl);

  const p1Key = fireRated ? 'sealantFRRatePerTube' : 'sealantNFRRatePerTube';
  const p1 = tubes * priceData.p1[p1Key] + sealantAppCharge;
  // p2 applies wastage + profit multiplier from template
  const p2 = tubes * priceData.p2[p1Key] * sealantWastage * priceData.p2.sealantProfitMult + sealantAppCharge;
  return { p1, p2, used: higher(p1, p2), tubes };
}

// ─── ANCHORING ───────────────────────────────────────────────────────────────

function anchoringCost(priceData) {
  const p1 = priceData.p1.anchoringRate;
  const p2 = priceData.p2.anchoringRate;
  return { p1, p2, used: higher(p1, p2) };
}

// ─── PRIMER ──────────────────────────────────────────────────────────────────

/**
 * p1: area × 22.4 AED/m²  (Price Master)
 * p2: area × 32.0 AED/m²  (NEW VE DATA #56)
 */
function primerCost(wMm, hMm, priceData) {
  const area = areaM2(wMm, hMm);
  const p1 = area * priceData.p1.primerRatePerM2;
  const p2 = area * priceData.p2.primerRatePerM2;
  return { p1, p2, used: higher(p1, p2) };
}

// ─── ROCK WOOL / MINERAL WOOL INFILL ─────────────────────────────────────────

/**
 * p1: sheets × 20 AED/sheet  (Price Master)
 * p2: sheets × 22 AED/sheet  (NEW VE DATA #57 — includes labour)
 */
function rockWoolCost(wMm, hMm, leafCount, priceData) {
  const SLAB_AREA_M2 = 0.72; // 0.6 × 1.2 m
  const leafArea = areaM2(wMm, hMm);
  const sheets = Math.ceil(leafArea / SLAB_AREA_M2) * leafCount;
  const p1 = sheets * priceData.p1.rockwoolRatePerSlab;
  const p2 = sheets * priceData.p2.rockwoolRatePerSlab;
  return { p1, p2, used: higher(p1, p2), sheets };
}

// ─── VISION PANEL ────────────────────────────────────────────────────────────

/**
 * Both pricings add visionPanelFrameRate (80 AED) to glass rate.
 * Glass rates vary by type — see consolidated price master sheet 3.
 */
function visionPanelCost(glassType, panelCount, priceData) {
  if (!glassType || !panelCount) return { p1: 0, p2: 0, used: 0 };
  const glassRow = priceData.glassRates[glassType];
  if (!glassRow) throw new Error(`Unknown glass type: ${glassType}`);
  const frameCharge = priceData.labour.visionPanelFrameRate;
  const p1 = (glassRow.p1 + frameCharge) * panelCount;
  const p2 = (glassRow.p2 + frameCharge) * panelCount;
  return { p1, p2, used: higher(p1, p2) };
}

// ─── LOUVER ──────────────────────────────────────────────────────────────────

/**
 * louverType: 'bottom' | 'full' | null
 * p1 bottom = 100 AED/leaf (Price Master)
 * p2 bottom = 400 AED/m² (Template NVD #54 — treats as sqm)
 * full = 400/375 AED/m² (p1/p2)
 */
function louverCost(louverType, wMm, hMm, leafCount, priceData) {
  if (!louverType) return { p1: 0, p2: 0, used: 0 };
  const area = areaM2(wMm, hMm);
  if (louverType === 'bottom') {
    const p1 = priceData.p1.louverBottomPerLeaf * leafCount;
    const p2 = priceData.p2.louverBottomPerM2 * area;
    return { p1, p2, used: higher(p1, p2) };
  }
  if (louverType === 'full') {
    const p1 = priceData.p1.louverFullPerM2 * area;
    const p2 = priceData.p2.louverFullPerM2 * area;
    return { p1, p2, used: higher(p1, p2) };
  }
  return { p1: 0, p2: 0, used: 0 };
}

// ─── FIRE RATING LABEL ───────────────────────────────────────────────────────

function fireRatingLabelCost(standard, priceData) {
  if (!standard) return { p1: 0, p2: 0, used: 0 };
  const key = standard === 'UL' ? 'fireRatingUL' : 'fireRatingBS';
  const p1 = priceData.p1[key];
  const p2 = priceData.p2[key];
  return { p1, p2, used: higher(p1, p2) };
}

// ─── STC ACOUSTIC ────────────────────────────────────────────────────────────

function acousticCost(stcRating, leafCount, priceData) {
  if (!stcRating || stcRating < 25) return { p1: 0, p2: 0, used: 0 };
  const isDouble = leafCount >= 2;
  const match = priceData.stcRates.find(
    (r) => stcRating >= r.minStc && stcRating <= r.maxStc
  );
  if (!match) return { p1: 0, p2: 0, used: 0 };
  // STC rates are the same in both pricings
  const rate = isDouble ? match.doubleRate : match.singleRate;
  return { p1: rate, p2: rate, used: rate };
}

// ─── FINISH ──────────────────────────────────────────────────────────────────

/**
 * powderCoat: area × 0.276 × rate
 *   p1 rate = 35 AED/m² (Price Master)
 *   p2 rate = 14 AED/m² (NEW VE DATA #10)
 * superDurable: × multiplier (both = 2)
 * epoxy/wooden: flat rates (same both sources)
 */
function finishCost(finishType, wMm, hMm, leafCount, priceData) {
  if (!finishType) return { p1: 0, p2: 0, used: 0 };
  const isDouble = leafCount >= 2;
  const area = areaM2(wMm, hMm);
  const COVERAGE = 0.276;

  if (finishType === 'powderCoat') {
    const p1 = area * COVERAGE * priceData.p1.powderCoatRatePerM2;
    const p2 = area * COVERAGE * priceData.p2.powderCoatRatePerM2;
    return { p1, p2, used: higher(p1, p2) };
  }
  if (finishType === 'superDurable') {
    const mult = priceData.labour.superDurableMultiplier;
    const p1 = area * COVERAGE * priceData.p1.powderCoatRatePerM2 * mult;
    const p2 = area * COVERAGE * priceData.p2.powderCoatRatePerM2 * mult;
    return { p1, p2, used: higher(p1, p2) };
  }
  // Flat rates — same in both sources
  const flatKey = isDouble
    ? (finishType === 'epoxy' ? 'epoxyFlatDouble' : 'woodenFlatDouble')
    : (finishType === 'epoxy' ? 'epoxyFlatSingle' : 'woodenFlatSingle');
  const flat = priceData.p1[flatKey];
  return { p1: flat, p2: flat, used: flat };
}

// ─── HEIGHT SURCHARGE (P2 ONLY) ──────────────────────────────────────────────

/**
 * Template NEW VE DATA adds per-leaf install surcharges for tall doors.
 * p1 has no equivalent — so this is always from p2 only (conservative).
 */
function heightSurchargeCost(hMm, leafCount, priceData) {
  const { installSurchargeH2500, installSurchargeH2900, installSurchargeH3050 } =
    priceData.p2;
  let surcharge = 0;
  if (hMm > 3050) surcharge = installSurchargeH3050;
  else if (hMm > 2900) surcharge = installSurchargeH2900;
  else if (hMm > 2500) surcharge = installSurchargeH2500;
  const total = surcharge * leafCount;
  return { p1: 0, p2: total, used: total }; // always use p2 (conservative)
}

// ─── SEAMLESS DOOR ────────────────────────────────────────────────────────────

function seamlessSurchargeCost(hMm, isSeamless, priceData) {
  if (!isSeamless) return { p1: 0, p2: 0, used: 0 };
  const rate = priceData.p2.seamlessPerLmHeight; // 16 AED/m
  const total = toM(hMm) * rate;
  return { p1: 0, p2: total, used: total };
}

// ─── WARRANTY ────────────────────────────────────────────────────────────────

function warrantyCost(baseCost, warrantyYears, priceData) {
  if (!warrantyYears) return { p1: 0, p2: 0, used: 0 };
  const rate = priceData.labour.warrantyRatePerYear; // e.g. 0.025
  const w = baseCost * rate * warrantyYears;
  return { p1: w, p2: w, used: w };
}

// ─── HARDWARE SET ─────────────────────────────────────────────────────────────

function hardwareSetCost(setName, priceData) {
  if (!setName) return 0;
  const set = priceData.hardwareSets[setName];
  if (!set) throw new Error(`Hardware set not found: ${setName}`);
  return set.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

// ─── INSTALL & DELIVERY ───────────────────────────────────────────────────────

function installationCost(leafCount, hMm, includeInstallation, priceData) {
  if (!includeInstallation) return 0;
  const isDouble = leafCount >= 2;
  const base = isDouble
    ? priceData.p1.installDouble
    : priceData.p1.installSingle;
  // Add height surcharge if applicable (from p2)
  const heightExtra = heightSurchargeCost(hMm, leafCount, priceData).used;
  return base + heightExtra;
}

function deliveryCost(includeDelivery, priceData) {
  if (!includeDelivery) return 0;
  return priceData.p1.deliveryPerDoor;
}

// ─── O&H AND PROFIT ──────────────────────────────────────────────────────────

function applyMargins(baseCost, priceData) {
  const { ohPercent, profitPercent } = priceData.margins;
  const costPlusOH = baseCost * (1 + ohPercent / 100);
  const sellPrice = costPlusOH * (1 + profitPercent / 100);
  return { ohAmount: costPlusOH - baseCost, profitAmount: sellPrice - costPlusOH, sellPrice };
}

// ─── MAIN ENTRY POINT ────────────────────────────────────────────────────────

/**
 * calculateDoorPrice(door, priceData)
 *
 * door fields:
 *   wMm, hMm           Opening dimensions (mm)
 *   leafCount           1 or 2
 *   leafThickMm         1.0|1.2|1.5|1.8|2.0|2.5
 *   frameMm             Frame steel thickness (mm)
 *   jambDepthMm         Jamb depth (mm), default 300
 *   sheetCode           'A'…'E'  (auto-select by size if omitted)
 *   infill              'HC' (honeycomb) | 'MW' (mineral wool)
 *   sealType            'kerf' | 'teardrop'
 *   fireRatedSealant    boolean
 *   standard            'UL' | 'BS' | null
 *   stcRating           numeric | null
 *   glassType           glass key or null
 *   glassCount          number of panels
 *   louverType          'bottom' | 'full' | null
 *   finishType          'powderCoat' | 'superDurable' | 'epoxy' | 'wooden' | null
 *   isSeamless          boolean
 *   hardwareSetName     string or null
 *   warrantyYears       0|1|2...
 *   includeInstallation boolean
 *   includeDelivery     boolean
 *   qty                 quantity of doors
 *
 * Returns:
 *   breakdown           Per-component { p1, p2, used } object
 *   pricing1Total       Sum of all P1 components (before margins)
 *   pricing2Total       Sum of all P2 components (before margins)
 *   finalBaseTotal      Sum of max(P1,P2) per component
 *   unitNetPrice        finalBaseTotal + O&H (internal)
 *   unitSellPrice       After profit margins + install + delivery
 *   unitHardwareCost    Hardware separate
 *   unitDoorSetPrice    unitSellPrice + hardware
 *   lineTotal           unitDoorSetPrice × qty
 */
function calculateDoorPrice(door, priceData) {
  const {
    wMm, hMm,
    leafCount = 1,
    leafThickMm = 1.2,
    frameMm = 1.5,
    jambDepthMm = 300,
    sheetCode = 'A',
    infill = 'HC',
    sealType = 'teardrop',
    fireRatedSealant = true,
    standard = null,
    stcRating = null,
    glassType = null,
    glassCount = 0,
    louverType = null,
    finishType = 'powderCoat',
    isSeamless = false,
    hardwareSetName = null,
    warrantyYears = 0,
    includeInstallation = false,
    includeDelivery = false,
    qty = 1,
  } = door;

  // ── Compute every component with dual pricing ──────────────────────────────
  const steel     = steelMaterialCost(sheetCode, leafThickMm, frameMm, leafCount, priceData);
  const frameStl  = frameSteelCost(wMm, hMm, frameMm, priceData);
  const labour    = labourCost(leafCount, infill, priceData);
  const kerfSeal  = kerfSealCost(wMm, hMm, sealType, priceData);
  const puFoam    = puFoamCost(wMm, hMm, jambDepthMm, priceData);
  const sealant   = sealantCost(wMm, hMm, fireRatedSealant, priceData);
  const anchoring = anchoringCost(priceData);
  const primer    = primerCost(wMm, hMm, priceData);
  const rockwool  = infill === 'MW'
    ? rockWoolCost(wMm, hMm, leafCount, priceData)
    : { p1: 0, p2: 0, used: 0 };
  const glass     = visionPanelCost(glassType, glassCount, priceData);
  const louver    = louverCost(louverType, wMm, hMm, leafCount, priceData);
  const fireLabel = fireRatingLabelCost(standard, priceData);
  const stc       = acousticCost(stcRating, leafCount, priceData);
  const finish    = finishCost(finishType, wMm, hMm, leafCount, priceData);
  const seamless  = seamlessSurchargeCost(hMm, isSeamless, priceData);

  const componentList = {
    steel, frameSteel: frameStl, labour, kerfSeal, puFoam,
    sealant, anchoring, primer, rockwool, glass, louver,
    fireLabel, stcSurcharge: stc, finish, seamless,
  };

  // ── Base totals ────────────────────────────────────────────────────────────
  const pricing1Base = Object.values(componentList).reduce((s, c) => s + (c.p1 || 0), 0);
  const pricing2Base = Object.values(componentList).reduce((s, c) => s + (c.p2 || 0), 0);
  const finalBase    = Object.values(componentList).reduce((s, c) => s + (c.used || 0), 0);

  // Warranty on finalBase
  const warranty = warrantyCost(finalBase, warrantyYears, priceData);
  const totalBase = finalBase + warranty.used;

  // ── Margins ────────────────────────────────────────────────────────────────
  const { ohAmount, profitAmount, sellPrice } = applyMargins(totalBase, priceData);

  // ── Install, delivery, hardware ───────────────────────────────────────────
  const installation = installationCost(leafCount, hMm, includeInstallation, priceData);
  const delivery     = deliveryCost(includeDelivery, priceData);
  const hardware     = hardwareSetCost(hardwareSetName, priceData);

  const unitNetPrice     = totalBase + ohAmount;
  const unitSellPrice    = sellPrice + installation + delivery;
  const unitHardwareCost = hardware;
  const unitDoorSetPrice = unitSellPrice + unitHardwareCost;

  return {
    breakdown: {
      ...componentList,
      warranty,
      _totals: {
        pricing1Base: Math.round(pricing1Base * 100) / 100,
        pricing2Base: Math.round(pricing2Base * 100) / 100,
        finalBase:    Math.round(finalBase * 100) / 100,
        totalBase:    Math.round(totalBase * 100) / 100,
        ohAmount:     Math.round(ohAmount * 100) / 100,
        profitAmount: Math.round(profitAmount * 100) / 100,
      },
      installation,
      delivery,
    },
    pricing1Total:   Math.round(pricing1Base * 100) / 100,
    pricing2Total:   Math.round(pricing2Base * 100) / 100,
    finalBaseTotal:  Math.round(finalBase * 100) / 100,
    unitNetPrice:    Math.round(unitNetPrice * 100) / 100,
    unitSellPrice:   Math.round(unitSellPrice * 100) / 100,
    unitHardwareCost: Math.round(unitHardwareCost * 100) / 100,
    unitDoorSetPrice: Math.round(unitDoorSetPrice * 100) / 100,
    lineTotal:        Math.round(unitDoorSetPrice * qty * 100) / 100,
    qty,
  };
}

/**
 * calculateQuotation(doors[], priceData)
 * Calculates all door lines and returns project-level totals.
 */
function calculateQuotation(doors, priceData) {
  const lines = doors.map((door, i) => ({
    lineNo: i + 1,
    ...calculateDoorPrice(door, priceData),
  }));

  const grandTotal       = lines.reduce((s, l) => s + l.lineTotal, 0);
  const hardwareTotal    = lines.reduce((s, l) => s + l.unitHardwareCost * l.qty, 0);
  const doorFrameTotal   = grandTotal - hardwareTotal;
  const pricing1Total    = lines.reduce((s, l) => s + l.pricing1Total * l.qty, 0);
  const pricing2Total    = lines.reduce((s, l) => s + l.pricing2Total * l.qty, 0);
  const finalBaseTotal   = lines.reduce((s, l) => s + l.finalBaseTotal * l.qty, 0);

  return {
    lines,
    pricing1Total:  Math.round(pricing1Total  * 100) / 100,
    pricing2Total:  Math.round(pricing2Total  * 100) / 100,
    finalBaseTotal: Math.round(finalBaseTotal * 100) / 100,
    doorFrameTotal: Math.round(doorFrameTotal * 100) / 100,
    hardwareTotal:  Math.round(hardwareTotal  * 100) / 100,
    grandTotal:     Math.round(grandTotal     * 100) / 100,
  };
}

// ─── EXPORTS ─────────────────────────────────────────────────────────────────

export {
  calculateDoorPrice,
  calculateQuotation,
  steelMaterialCost, frameSteelCost, labourCost, kerfSealCost,
  puFoamCost, sealantCost, anchoringCost, primerCost, rockWoolCost,
  visionPanelCost, louverCost, fireRatingLabelCost, acousticCost,
  finishCost, warrantyCost, hardwareSetCost, installationCost,
  deliveryCost, applyMargins, heightSurchargeCost, seamlessSurchargeCost,
  getSheetPrice, higher,
};
