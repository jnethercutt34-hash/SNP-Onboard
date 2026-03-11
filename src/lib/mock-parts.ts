// ─── Parts & Materials Data Model ─────────────────────────────────────────────
// Mock BOM data — will be replaced/augmented with real BOM import

export type PartCategory =
  | "Resistor"
  | "Capacitor"
  | "Inductor"
  | "Diode"
  | "Transistor"
  | "IC"
  | "Connector"
  | "Crystal/Oscillator"
  | "Transformer"
  | "Mechanical"
  | "Other";

export type QualificationLevel =
  | "QML-Q"    // MIL-PRF-38535 Class Q (Space)
  | "QML-V"    // MIL-PRF-38535 Class V (Rad-Hard Space)
  | "MIL-PRF"  // Military grade
  | "COTS-Plus" // Commercial with upscreening
  | "COTS"     // Commercial off-the-shelf
  | "TBD";

export type SolderTermination =
  | "SnPb"      // Tin-lead (traditional space)
  | "Pure-Tin"  // Pure tin (with mitigation)
  | "Gold"      // Gold plating
  | "N/A";      // Through-hole, press-fit, etc.

export type MitigationStrategy =
  | "None Required"
  | "Conformal Coat"
  | "Hot Solder Dip"
  | "Approved per Trade Study"
  | "Derating Applied"
  | "Radiation Testing Complete";

export interface PartEntry {
  id: string;
  manufacturerPartNumber: string;
  manufacturer: string;
  description: string;
  category: PartCategory;
  footprint: string;              // e.g., "0402", "0603", "QFN-48", "BGA-256"
  packageType: string;            // e.g., "SMD", "Through-Hole", "BGA", "QFP"
  value?: string;                 // e.g., "10kΩ", "100nF", "4.7µH"
  tolerance?: string;             // e.g., "±1%", "±5%"
  voltageRating?: string;         // e.g., "50V", "16V"
  powerRating?: string;           // e.g., "0.1W", "0.25W"
  temperatureRange: string;       // e.g., "−55°C to +125°C"
  solderTermination: SolderTermination;
  qualificationLevel: QualificationLevel;
  mitigationStrategy: MitigationStrategy;
  tradeStudyRef?: string;         // e.g., "TS-001 Pure Tin Passive Acceptability"
  radiationRating?: string;       // e.g., "100 krad(Si) TID", "SEL-immune"
  deratingFactor?: string;        // e.g., "50% voltage, 60% power"
  usedOnModules: string[];        // detailIds from mock-components.ts
  quantity: number;               // qty per unit/build
  notes?: string;
}

export interface TradeStudy {
  id: string;
  title: string;
  documentNumber: string;
  revision: string;
  date: string;
  summary: string;
  conclusion: string;
  affectedParts: string[];        // part IDs
  category: "Materials" | "Derating" | "Radiation" | "Thermal" | "Reliability" | "Other";
}

// ─── Trade Studies ────────────────────────────────────────────────────────────

export const TRADE_STUDIES: TradeStudy[] = [
  {
    id: "ts-001",
    title: "Pure Tin Termination Acceptability for pLEO Passive Components",
    documentNumber: "SNP-TS-001",
    revision: "Rev B",
    date: "2025-08-15",
    summary:
      "Analysis of tin whisker risk for pure tin terminated passive components (0402, 0603 footprints) in the pLEO mission environment. Evaluates whisker growth models, conformal coating mitigation effectiveness, and mission duration impact. References GEIA-STD-0005-2, NASA-STD-6012, and GSFC S-311-M-70.",
    conclusion:
      "Pure tin passives ≤0603 are acceptable for pLEO missions (≤7 year design life) with conformal coat mitigation per GEIA-STD-0005-2 Category 2. No hot solder dip required for passives at this footprint. Larger footprints (0805+) and connectors require SnPb or hot solder dip.",
    affectedParts: ["res-0402-10k", "res-0402-100", "res-0402-1k", "cap-0402-100n", "cap-0402-10n", "cap-0603-1u", "cap-0603-10u"],
    category: "Materials",
  },
  {
    id: "ts-002",
    title: "Passive Component Derating Policy — SNP Program",
    documentNumber: "SNP-TS-002",
    revision: "Rev A",
    date: "2025-06-20",
    summary:
      "Defines voltage, power, and temperature derating requirements for all passive components per MIL-HDBK-217F and internal reliability guidelines. All passives derated to ≤50% voltage and ≤60% power at worst-case temperature. Capacitors further derated by 20% for ceramic Class II dielectrics (X7R, X5R) due to voltage coefficient nonlinearity.",
    conclusion:
      "Derating factors applied: Resistors 50% power, Capacitors 50% voltage + 20% ceramic penalty (Class II), Inductors 80% saturation current. All passive selections in the BOM comply with these requirements.",
    affectedParts: ["res-0402-10k", "res-0402-100", "cap-0402-100n", "cap-0603-1u", "cap-0603-10u"],
    category: "Derating",
  },
  {
    id: "ts-003",
    title: "Radiation Tolerance Assessment — COTS-Plus Components",
    documentNumber: "SNP-TS-003",
    revision: "Rev A",
    date: "2025-09-10",
    summary:
      "Total Ionizing Dose (TID) and Single Event Effects (SEE) assessment for COTS-Plus components used in the SNP platform. Covers lot-acceptance testing protocols, TID characterization at 50 krad(Si) and 100 krad(Si) levels, and SEL screening per MIL-STD-883 Method 1019.",
    conclusion:
      "All COTS-Plus ICs verified to 50 krad(Si) minimum via lot acceptance testing. SEL immunity confirmed at ≥60 MeV·cm²/mg LET. Passive components inherently radiation tolerant to >300 krad(Si). No additional shielding required for pLEO orbit profile.",
    affectedParts: ["ic-ftdi-ft4232h", "ic-ti-tps7a45"],
    category: "Radiation",
  },
];

// ─── Mock BOM Parts ───────────────────────────────────────────────────────────

export const PARTS_CATALOG: PartEntry[] = [
  // ── Resistors ──────────────────────────────────────────────────────────────
  {
    id: "res-0402-10k",
    manufacturerPartNumber: "RC0402FR-0710KL",
    manufacturer: "Yageo",
    description: "Chip Resistor 10kΩ 1% 0402 Thick Film",
    category: "Resistor",
    footprint: "0402",
    packageType: "SMD",
    value: "10 kΩ",
    tolerance: "±1%",
    voltageRating: "50 V",
    powerRating: "0.063 W (1/16 W)",
    temperatureRange: "−55 °C to +155 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% power → 0.031 W max applied",
    usedOnModules: ["gpp-universal", "optical-10g", "net-10g-copper", "crypto-unit"],
    quantity: 87,
    notes: "Pull-up/pull-down networks, I²C bus terminators, voltage dividers",
  },
  {
    id: "res-0402-100",
    manufacturerPartNumber: "RC0402FR-07100RL",
    manufacturer: "Yageo",
    description: "Chip Resistor 100Ω 1% 0402 Thick Film",
    category: "Resistor",
    footprint: "0402",
    packageType: "SMD",
    value: "100 Ω",
    tolerance: "±1%",
    voltageRating: "50 V",
    powerRating: "0.063 W (1/16 W)",
    temperatureRange: "−55 °C to +155 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% power → 0.031 W max applied",
    usedOnModules: ["gpp-universal", "optical-10g", "net-10g-copper"],
    quantity: 124,
    notes: "Series termination for high-speed differential pairs (PCIe, 10GbE SGMII)",
  },
  {
    id: "res-0402-1k",
    manufacturerPartNumber: "RC0402FR-071KL",
    manufacturer: "Yageo",
    description: "Chip Resistor 1kΩ 1% 0402 Thick Film",
    category: "Resistor",
    footprint: "0402",
    packageType: "SMD",
    value: "1 kΩ",
    tolerance: "±1%",
    voltageRating: "50 V",
    powerRating: "0.063 W (1/16 W)",
    temperatureRange: "−55 °C to +155 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% power → 0.031 W max applied",
    usedOnModules: ["gpp-universal", "crypto-unit"],
    quantity: 42,
    notes: "LED current limiting, reset networks, configuration pull-ups",
  },
  {
    id: "res-0402-49r9",
    manufacturerPartNumber: "RC0402FR-0749R9L",
    manufacturer: "Yageo",
    description: "Chip Resistor 49.9Ω 1% 0402 Thick Film",
    category: "Resistor",
    footprint: "0402",
    packageType: "SMD",
    value: "49.9 Ω",
    tolerance: "±1%",
    voltageRating: "50 V",
    powerRating: "0.063 W (1/16 W)",
    temperatureRange: "−55 °C to +155 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% power → 0.031 W max applied",
    usedOnModules: ["gpp-universal", "optical-10g"],
    quantity: 64,
    notes: "Impedance matching for LVDS, PCIe Gen 3 differential pairs",
  },

  // ── Capacitors ─────────────────────────────────────────────────────────────
  {
    id: "cap-0402-100n",
    manufacturerPartNumber: "GRM155R71C104KA88D",
    manufacturer: "Murata",
    description: "MLCC 100nF 16V X7R 0402",
    category: "Capacitor",
    footprint: "0402",
    packageType: "SMD",
    value: "100 nF",
    tolerance: "±10%",
    voltageRating: "16 V",
    temperatureRange: "−55 °C to +125 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% voltage → 8 V max applied, +20% ceramic penalty",
    usedOnModules: ["gpp-universal", "optical-10g", "net-10g-copper", "crypto-unit", "psu-red", "psu-black"],
    quantity: 216,
    notes: "Decoupling — distributed across all power rails (3.3V, 1.8V, 1.0V)",
  },
  {
    id: "cap-0402-10n",
    manufacturerPartNumber: "GRM155R71E103KA01D",
    manufacturer: "Murata",
    description: "MLCC 10nF 25V X7R 0402",
    category: "Capacitor",
    footprint: "0402",
    packageType: "SMD",
    value: "10 nF",
    tolerance: "±10%",
    voltageRating: "25 V",
    temperatureRange: "−55 °C to +125 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% voltage → 12.5 V max applied",
    usedOnModules: ["gpp-universal", "psu-red", "psu-black"],
    quantity: 48,
    notes: "High-frequency decoupling near FPGA power pins",
  },
  {
    id: "cap-0603-1u",
    manufacturerPartNumber: "GRM188R61E105KA12D",
    manufacturer: "Murata",
    description: "MLCC 1µF 25V X5R 0603",
    category: "Capacitor",
    footprint: "0603",
    packageType: "SMD",
    value: "1 µF",
    tolerance: "±10%",
    voltageRating: "25 V",
    temperatureRange: "−55 °C to +85 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% voltage → 12.5 V max applied, +20% ceramic penalty",
    usedOnModules: ["gpp-universal", "optical-10g", "net-10g-copper", "psu-red", "psu-black"],
    quantity: 92,
    notes: "Bulk decoupling, LDO output capacitors, filter networks",
  },
  {
    id: "cap-0603-10u",
    manufacturerPartNumber: "GRM188R60J106ME47D",
    manufacturer: "Murata",
    description: "MLCC 10µF 6.3V X5R 0603",
    category: "Capacitor",
    footprint: "0603",
    packageType: "SMD",
    value: "10 µF",
    tolerance: "±20%",
    voltageRating: "6.3 V",
    temperatureRange: "−55 °C to +85 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Conformal Coat",
    tradeStudyRef: "ts-001",
    deratingFactor: "50% voltage → 3.15 V max applied",
    usedOnModules: ["gpp-universal", "psu-red", "psu-black"],
    quantity: 34,
    notes: "Bulk storage for 3.3V and 1.8V rails, slow transient filtering",
  },
  {
    id: "cap-1206-22u-tant",
    manufacturerPartNumber: "T491D226K016AT",
    manufacturer: "KEMET",
    description: "Tantalum 22µF 16V 1206 Molded",
    category: "Capacitor",
    footprint: "1206",
    packageType: "SMD",
    value: "22 µF",
    tolerance: "±10%",
    voltageRating: "16 V",
    temperatureRange: "−55 °C to +125 °C",
    solderTermination: "SnPb",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "Derating Applied",
    deratingFactor: "50% voltage → 8 V max applied, 67% surge",
    usedOnModules: ["psu-red", "psu-black"],
    quantity: 8,
    notes: "PSU input/output filter — tantalum selected for ESR stability over temperature. SnPb termination required for 1206+ footprint per TS-001.",
  },

  // ── Inductors ──────────────────────────────────────────────────────────────
  {
    id: "ind-0603-4u7",
    manufacturerPartNumber: "LQM18FN4R7M00D",
    manufacturer: "Murata",
    description: "Ferrite Inductor 4.7µH 0603 Multilayer",
    category: "Inductor",
    footprint: "0603",
    packageType: "SMD",
    value: "4.7 µH",
    tolerance: "±20%",
    temperatureRange: "−40 °C to +85 °C",
    solderTermination: "Pure-Tin",
    qualificationLevel: "COTS-Plus",
    mitigationStrategy: "Conformal Coat",
    deratingFactor: "80% saturation current",
    usedOnModules: ["gpp-universal", "psu-red", "psu-black"],
    quantity: 18,
    notes: "EMI filtering on power rails, common-mode chokes",
  },

  // ── ICs ────────────────────────────────────────────────────────────────────
  {
    id: "ic-ftdi-ft4232h",
    manufacturerPartNumber: "FT4232HL",
    manufacturer: "FTDI",
    description: "Quad High-Speed USB to UART/JTAG Bridge IC",
    category: "IC",
    footprint: "QFN-64",
    packageType: "QFN",
    temperatureRange: "−40 °C to +85 °C",
    solderTermination: "SnPb",
    qualificationLevel: "COTS-Plus",
    mitigationStrategy: "Approved per Trade Study",
    tradeStudyRef: "ts-003",
    radiationRating: "50 krad(Si) TID (lot tested)",
    usedOnModules: ["gpp-universal"],
    quantity: 2,
    notes: "USB-to-JTAG/UART bridge for Micro USB debug port. One per GPP. COTS-Plus with lot acceptance TID testing.",
  },
  {
    id: "ic-ti-tps7a45",
    manufacturerPartNumber: "TPS7A4501DGNR",
    manufacturer: "Texas Instruments",
    description: "Low-Noise LDO Regulator 1.5A Fixed Output",
    category: "IC",
    footprint: "MSOP-8",
    packageType: "MSOP",
    temperatureRange: "−40 °C to +125 °C",
    solderTermination: "SnPb",
    qualificationLevel: "COTS-Plus",
    mitigationStrategy: "Approved per Trade Study",
    tradeStudyRef: "ts-003",
    radiationRating: "50 krad(Si) TID (lot tested)",
    usedOnModules: ["gpp-universal", "optical-10g", "net-10g-copper"],
    quantity: 6,
    notes: "Auxiliary LDO for clean analog supplies (ADC reference, PLL). Low noise (4.17µV RMS). COTS-Plus with lot acceptance.",
  },

  // ── Diodes ─────────────────────────────────────────────────────────────────
  {
    id: "diode-tvs-smaj28a",
    manufacturerPartNumber: "SMAJ28A",
    manufacturer: "Littelfuse",
    description: "TVS Diode 28V Unidirectional SMA",
    category: "Diode",
    footprint: "SMA",
    packageType: "SMD",
    voltageRating: "28 V standoff",
    temperatureRange: "−55 °C to +150 °C",
    solderTermination: "SnPb",
    qualificationLevel: "MIL-PRF",
    mitigationStrategy: "None Required",
    usedOnModules: ["psu-red", "psu-black"],
    quantity: 4,
    notes: "Input power bus TVS protection — clamps 28V bus transients per MIL-STD-1275",
  },

  // ── Crystal / Oscillator ───────────────────────────────────────────────────
  {
    id: "xtal-25mhz",
    manufacturerPartNumber: "ABM8-25.000MHZ-B2-T",
    manufacturer: "Abracon",
    description: "Crystal 25MHz ±20ppm 3.2×2.5mm",
    category: "Crystal/Oscillator",
    footprint: "3225",
    packageType: "SMD",
    value: "25 MHz",
    tolerance: "±20 ppm",
    temperatureRange: "−40 °C to +85 °C",
    solderTermination: "SnPb",
    qualificationLevel: "COTS-Plus",
    mitigationStrategy: "Approved per Trade Study",
    usedOnModules: ["gpp-universal"],
    quantity: 2,
    notes: "Reference clock for Quad PHY (VSC8504) and FTDI bridge. One per GPP.",
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getPartById(id: string): PartEntry | undefined {
  return PARTS_CATALOG.find((p) => p.id === id);
}

export function getPartsByModule(moduleDetailId: string): PartEntry[] {
  return PARTS_CATALOG.filter((p) => p.usedOnModules.includes(moduleDetailId));
}

export function getPartsByCategory(category: PartCategory): PartEntry[] {
  return PARTS_CATALOG.filter((p) => p.category === category);
}

export function getPartsByFootprint(footprint: string): PartEntry[] {
  return PARTS_CATALOG.filter((p) => p.footprint === footprint);
}

export function getPartsByTermination(termination: SolderTermination): PartEntry[] {
  return PARTS_CATALOG.filter((p) => p.solderTermination === termination);
}

export function getTradeStudyById(id: string): TradeStudy | undefined {
  return TRADE_STUDIES.find((ts) => ts.id === id);
}

export function getTradeStudiesForPart(partId: string): TradeStudy[] {
  return TRADE_STUDIES.filter((ts) => ts.affectedParts.includes(partId));
}

export function getPartsForTradeStudy(tradeStudyId: string): PartEntry[] {
  const ts = getTradeStudyById(tradeStudyId);
  if (!ts) return [];
  return PARTS_CATALOG.filter((p) => ts.affectedParts.includes(p.id));
}

export type BOMSummary = {
  totalUniquePartNumbers: number;
  totalQuantity: number;
  byCategory: Record<string, { count: number; qty: number }>;
  byTermination: Record<string, { count: number; qty: number }>;
  byQualification: Record<string, { count: number; qty: number }>;
  pureTimParts: number;
  pureTimPercentage: number;
};

export function getBOMSummary(): BOMSummary {
  const byCategory: Record<string, { count: number; qty: number }> = {};
  const byTermination: Record<string, { count: number; qty: number }> = {};
  const byQualification: Record<string, { count: number; qty: number }> = {};

  let totalQty = 0;
  let pureTimCount = 0;

  for (const p of PARTS_CATALOG) {
    totalQty += p.quantity;

    // By category
    if (!byCategory[p.category]) byCategory[p.category] = { count: 0, qty: 0 };
    byCategory[p.category].count++;
    byCategory[p.category].qty += p.quantity;

    // By termination
    if (!byTermination[p.solderTermination]) byTermination[p.solderTermination] = { count: 0, qty: 0 };
    byTermination[p.solderTermination].count++;
    byTermination[p.solderTermination].qty += p.quantity;

    // By qualification
    if (!byQualification[p.qualificationLevel]) byQualification[p.qualificationLevel] = { count: 0, qty: 0 };
    byQualification[p.qualificationLevel].count++;
    byQualification[p.qualificationLevel].qty += p.quantity;

    if (p.solderTermination === "Pure-Tin") pureTimCount++;
  }

  return {
    totalUniquePartNumbers: PARTS_CATALOG.length,
    totalQuantity: totalQty,
    byCategory,
    byTermination,
    byQualification,
    pureTimParts: pureTimCount,
    pureTimPercentage: Math.round((pureTimCount / PARTS_CATALOG.length) * 100),
  };
}
