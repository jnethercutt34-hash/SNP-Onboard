// ─── Interfaces ──────────────────────────────────────────────────────────────

export type ModuleType =
  | "processor"
  | "networking"
  | "expansion"
  | "power"
  | "crypto";

export interface SubComponent {
  name: string;
  /** Short spec label shown as a chip */
  spec: string;
}

export interface HardwareModule {
  id: string;
  name: string;
  type: ModuleType;
  /** Watts */
  powerDraw: number;
  /** Grams */
  weight: number;
  description: string;
  /** On-board components integrated onto this module (not separate line items) */
  subComponents?: SubComponent[];
}

export interface SystemBuild {
  id: string;
  customerName: string;
  description: string;
  modules: HardwareModule[];
  /** Sum of all module powerDraw (W) */
  totalPower: number;
  /** Sum of all module weight (g) */
  totalWeight: number;
}

export interface BuildDiff {
  baselineId: string;
  comparisonId: string;
  powerDelta: number;
  weightDelta: number;
  /** Modules present in baseline but removed in comparison */
  removed: HardwareModule[];
  /** Modules present in comparison but not in baseline */
  added: HardwareModule[];
  /** Modules present in both (unchanged) */
  shared: HardwareModule[];
}

// ─── Module Catalog ──────────────────────────────────────────────────────────

const MODULES = {
  gpp_a: {
    id: "gpp-universal-a",
    name: "Universal GPP Card (Red)",
    type: "processor" as ModuleType,
    powerDraw: 38,
    weight: 320,
    description:
      "General Purpose Processor card — Red. Quad-core ARM Cortex-A78AE, radiation-hardened SpaceVPX 3U form factor. Carries on-board SDRAM, NVM Flash, and FPGA.",
    subComponents: [
      { name: "16 GB SDRAM", spec: "LPDDR4X · ECC" },
      { name: "2 Gb NVM Flash", spec: "Firmware & config" },
      { name: "FPGA — 1.5M SLC", spec: "Signal processing · FEC" },
      { name: "10G Optical", spec: "Quad-ch · SFP+ · 1310 nm" },
      { name: "1G Quad PHY", spec: "4-port GbE PHY" },
    ],
  },
  gpp_b: {
    id: "gpp-universal-b",
    name: "Universal GPP Card (Black)",
    type: "processor" as ModuleType,
    powerDraw: 37,
    weight: 320,
    description:
      "General Purpose Processor card — Black. Mirrors Red in hot-standby; carries identical on-board SDRAM, NVM Flash, and FPGA for full redundancy.",
    subComponents: [
      { name: "16 GB SDRAM", spec: "LPDDR4X · ECC" },
      { name: "2 Gb NVM Flash", spec: "Firmware & config" },
      { name: "FPGA — 1.5M SLC", spec: "Signal processing · FEC" },
      { name: "10G Optical", spec: "Quad-ch · SFP+ · 1310 nm" },
      { name: "1G Quad PHY", spec: "4-port GbE PHY" },
    ],
  },
  crypto_unit: {
    id: "crypto-unit",
    name: "Cryptographic Processing Unit",
    type: "crypto" as ModuleType,
    powerDraw: 10,
    weight: 130,
    description:
      "Hardware-accelerated encryption/decryption and secure key management. FIPS 140-2 compliant. Offloads cryptographic operations from both GPP cards.",
  },
  psu_red: {
    id: "psu-red",
    name: "Power Converter (Red)",
    type: "power" as ModuleType,
    powerDraw: 5,
    weight: 140,
    description:
      "28V primary input brick for the Red side. Regulates and distributes power to the Red GPP card and associated peripherals.",
    subComponents: [
      { name: "+3.3V_AUX", spec: "Standby rail" },
      { name: "+3.3V", spec: "Logic rail" },
      { name: "+5V", spec: "Peripheral rail" },
    ],
  },
  psu_black: {
    id: "psu-black",
    name: "Power Converter (Black)",
    type: "power" as ModuleType,
    powerDraw: 6,
    weight: 155,
    description:
      "28V primary input brick for the Black side. Supplies the Black GPP card and exclusively provides the +12V high-power rail used by the backplane.",
    subComponents: [
      { name: "+3.3V_AUX", spec: "Standby rail" },
      { name: "+3.3V", spec: "Logic rail" },
      { name: "+5V", spec: "Peripheral rail" },
      { name: "+12V", spec: "High-power rail · Black only" },
    ],
  },
  net_10g_copper: {
    id: "net-10g-copper",
    name: "10 Gbps Copper Networking",
    type: "networking" as ModuleType,
    powerDraw: 3,
    weight: 90,
    description:
      "Dual-channel 10 Gbps copper Ethernet. Reduced SWaP-C profile for pLEO missions with lower radiation-hardening overhead.",
  },
  timing_atomic: {
    id: "timing-atomic-clock",
    name: "Timing & Networking Expansion (Atomic Clock)",
    type: "expansion" as ModuleType,
    powerDraw: 13,
    weight: 275,
    description:
      "Precision Timing Module with chip-scale atomic clock (CSAC). Provides nanosecond-level time synchronization for GEO orbital operations.",
  },
} satisfies Record<string, HardwareModule>;

// ─── Builds ──────────────────────────────────────────────────────────────────

function sumField(modules: HardwareModule[], field: "powerDraw" | "weight"): number {
  return modules.reduce((acc, m) => acc + m[field], 0);
}

function makeBuild(
  id: string,
  customerName: string,
  description: string,
  modules: HardwareModule[]
): SystemBuild {
  return {
    id,
    customerName,
    description,
    modules,
    totalPower: sumField(modules, "powerDraw"),
    totalWeight: sumField(modules, "weight"),
  };
}

// Baseline: 38 + 37 + 10 + 5 + 6 = 96 W
const baselineModules: HardwareModule[] = [
  MODULES.gpp_a,
  MODULES.gpp_b,
  MODULES.crypto_unit,
  MODULES.psu_red,
  MODULES.psu_black,
];

// Customer A (pLEO): optical → copper  →  99 W  (−1 W)
const customerAModules: HardwareModule[] = [
  MODULES.gpp_a,
  MODULES.gpp_b,
  MODULES.crypto_unit,
  MODULES.psu_red,
  MODULES.psu_black,
  MODULES.net_10g_copper,
];

// Customer B (GEO): + atomic clock  →  109 W  (+13 W)
const customerBModules: HardwareModule[] = [
  MODULES.gpp_a,
  MODULES.gpp_b,
  MODULES.crypto_unit,
  MODULES.psu_red,
  MODULES.psu_black,
  MODULES.timing_atomic,
];

export const BUILDS: SystemBuild[] = [
  makeBuild(
    "baseline",
    "Baseline",
    "Standard SNP reference configuration — dual GPP with on-board SDRAM/Flash/FPGA, crypto unit, dual power converters, optical networking.",
    baselineModules
  ),
  makeBuild(
    "customer-a-pleo",
    "Customer A — pLEO",
    "Proliferated Low Earth Orbit variant. Copper networking replaces optical for reduced SWaP-C and lower radiation-hardening overhead.",
    customerAModules
  ),
  makeBuild(
    "customer-b-geo",
    "Customer B — GEO",
    "Geostationary Earth Orbit variant. Adds Timing & Networking Expansion with atomic clock for precision time synchronization.",
    customerBModules
  ),
];

// ─── Utility ─────────────────────────────────────────────────────────────────

export function getBuildById(id: string): SystemBuild | undefined {
  return BUILDS.find((b) => b.id === id);
}

export function getBuildDifferences(baselineId: string, comparisonId: string): BuildDiff {
  const base = getBuildById(baselineId);
  const comp = getBuildById(comparisonId);

  if (!base || !comp) {
    throw new Error(`Build not found: ${!base ? baselineId : comparisonId}`);
  }

  const baseIds = new Set(base.modules.map((m) => m.id));
  const compIds = new Set(comp.modules.map((m) => m.id));

  const removed = base.modules.filter((m) => !compIds.has(m.id));
  const added = comp.modules.filter((m) => !baseIds.has(m.id));
  const shared = base.modules.filter((m) => compIds.has(m.id));

  return {
    baselineId,
    comparisonId,
    powerDelta: comp.totalPower - base.totalPower,
    weightDelta: comp.totalWeight - base.totalWeight,
    removed,
    added,
    shared,
  };
}
