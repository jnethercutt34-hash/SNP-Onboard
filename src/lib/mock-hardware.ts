// ─── Interfaces ──────────────────────────────────────────────────────────────

export type ComponentType =
  | "GPP_Base"
  | "Mezzanine_XMC"
  | "Networking_Mezzanine"
  | "Crypto_Module"
  | "Expansion_Module"
  | "Power_Converter";

export interface SubComponent {
  name: string;
  spec: string;
  detailId?: string;
}

export interface HardwareComponent {
  id: string;
  name: string;
  type: ComponentType;
  powerDrawWatts: number;
  weightGrams: number;
  description: string;
  subComponents?: SubComponent[];
  detailId?: string;
}

export interface VPXSlot {
  /** 0-based slot index mapping directly to chassis position */
  slotNumber: number;
  baseCard: HardwareComponent;
  /** Mezzanine cards (XMC/PMC) physically bolted onto the base card */
  attachedMezzanines: HardwareComponent[];
}

export interface SystemBuild {
  id: string;
  customerName: string;
  description: string;
  slots: VPXSlot[];
  /** Dynamically calculated: sum of all base cards + mezzanines */
  totalSystemPower: number;
  /** Dynamically calculated: sum of all base cards + mezzanines */
  totalSystemWeight: number;
}

export interface BuildDiff {
  baselineId: string;
  comparisonId: string;
  powerDelta: number;
  weightDelta: number;
  removedComponents: HardwareComponent[];
  addedComponents: HardwareComponent[];
  sharedComponents: HardwareComponent[];
}

// ─── Component Catalog ───────────────────────────────────────────────────────

// GPP Base Cards — carrier boards that plug into the backplane
const gpp_base_red: HardwareComponent = {
  id: "gpp-universal-a",
  name: "Universal GPP Card (Red)",
  type: "GPP_Base",
  powerDrawWatts: 32,
  weightGrams: 280,
  description:
    "General Purpose Processor carrier board — Red. Quad-core ARM Cortex-A78AE, radiation-hardened 3U SpaceVPX. Hosts on-board SDRAM, NVM Flash, and FPGA. Accepts one XMC mezzanine for networking.",
  detailId: "gpp-universal",
  subComponents: [
    { name: "16 GB SDRAM",     spec: "LPDDR4X · ECC",           detailId: "sdram-16gb"    },
    { name: "2 Gb NVM Flash",  spec: "Firmware & config",        detailId: "nvm-flash-2gb" },
    { name: "FPGA — 1.5M SLC", spec: "Signal processing · FEC",  detailId: "fpga-1m5-slc" },
  ],
};

const gpp_base_black: HardwareComponent = {
  id: "gpp-universal-b",
  name: "Universal GPP Card (Black)",
  type: "GPP_Base",
  powerDrawWatts: 31,
  weightGrams: 280,
  description:
    "General Purpose Processor carrier board — Black. Mirrors Red in hot-standby. Identical SDRAM, NVM Flash, and FPGA for full redundancy. Accepts one XMC mezzanine.",
  detailId: "gpp-universal",
  subComponents: [
    { name: "16 GB SDRAM",     spec: "LPDDR4X · ECC",           detailId: "sdram-16gb"    },
    { name: "2 Gb NVM Flash",  spec: "Firmware & config",        detailId: "nvm-flash-2gb" },
    { name: "FPGA — 1.5M SLC", spec: "Signal processing · FEC",  detailId: "fpga-1m5-slc" },
  ],
};

// Mezzanine XMC Cards — bolt onto the GPP base card, do not plug into backplane
const mez_optical_10g: HardwareComponent = {
  id: "mez-optical-10g",
  name: "10G Optical XMC Mezzanine",
  type: "Networking_Mezzanine",
  powerDrawWatts: 6,
  weightGrams: 40,
  description:
    "Quad-channel 10 Gbps fiber-optic mezzanine. SFP+ · 1310 nm. Bolts onto GPP carrier XMC site. Standard networking for baseline configurations.",
  detailId: "optical-10g",
  subComponents: [
    { name: "1G Quad PHY",      spec: "4-port GbE PHY",            detailId: "quad-phy-1g"   },
    { name: "1.2 TB M.2 SSD",   spec: "NVMe Gen 3 · Virtium",      detailId: "ssd-m2-1p2tb"  },
    { name: "64 GB eMMC",        spec: "eMMC 5.1 · Virtium",        detailId: "emmc-64gb"     },
  ],
};

const mez_qsfp_3x: HardwareComponent = {
  id: "mez-qsfp-3x",
  name: "3× QSFP XMC Mezzanine",
  type: "Networking_Mezzanine",
  powerDrawWatts: 8,
  weightGrams: 55,
  description:
    "Triple-port QSFP XMC mezzanine. Routes the GPP data-plane 10G lanes across three independent QSFP cages for high-density rack and payload interconnect. Each QSFP cage supports 4 × 10G lanes (QSFP+) or 1 × 40G (QSFP+). Bolts onto GPP carrier XMC site.",
  detailId: "mez-qsfp-3x",
};

const mez_copper_10g: HardwareComponent = {
  id: "mez-copper-10g",
  name: "10G Copper XMC Mezzanine",
  type: "Networking_Mezzanine",
  powerDrawWatts: 3,
  weightGrams: 25,
  description:
    "Dual-channel 10 Gbps copper Ethernet mezzanine. 10GBase-T · Cat-6A. Reduced SWaP-C profile for pLEO missions with lower radiation-hardening overhead.",
  detailId: "net-10g-copper",
};

// Expansion Modules — occupy their own VPX slot
const crypto_unit: HardwareComponent = {
  id: "crypto-unit",
  name: "Cryptographic Processing Unit",
  type: "Crypto_Module",
  powerDrawWatts: 10,
  weightGrams: 130,
  description:
    "Hardware-accelerated encryption/decryption and secure key management. FIPS 140-2 Level 3 compliant. Offloads cryptographic operations from both GPP cards.",
  detailId: "crypto-unit",
};

const timing_atomic: HardwareComponent = {
  id: "timing-atomic-clock",
  name: "Timing & Networking Expansion (Atomic Clock)",
  type: "Expansion_Module",
  powerDrawWatts: 13,
  weightGrams: 275,
  description:
    "Precision Timing Module with chip-scale atomic clock (CSAC). Provides nanosecond-level time synchronization for orbital operations independent of GPS.",
  detailId: "timing-atomic-clock",
};

// Power Converters — occupy their own VPX slot
const psu_red: HardwareComponent = {
  id: "psu-red",
  name: "Power Converter (Red)",
  type: "Power_Converter",
  powerDrawWatts: 5,
  weightGrams: 140,
  description:
    "28V primary input brick for the Red side. Regulates and distributes power to the Red GPP card and associated peripherals.",
  detailId: "psu-red",
  subComponents: [
    { name: "+3.3V_AUX", spec: "Standby rail",    detailId: "psu-rail-3v3-aux" },
    { name: "+3.3V",     spec: "Logic rail",       detailId: "psu-rail-3v3"     },
    { name: "+5V",       spec: "Peripheral rail",  detailId: "psu-rail-5v"      },
  ],
};

const psu_black: HardwareComponent = {
  id: "psu-black",
  name: "Power Converter (Black)",
  type: "Power_Converter",
  powerDrawWatts: 6,
  weightGrams: 155,
  description:
    "28V primary input brick for the Black side. Supplies the Black GPP card and exclusively provides the +12V high-power rail used by the backplane.",
  detailId: "psu-black",
  subComponents: [
    { name: "+3.3V_AUX", spec: "Standby rail",               detailId: "psu-rail-3v3-aux" },
    { name: "+3.3V",     spec: "Logic rail",                  detailId: "psu-rail-3v3"     },
    { name: "+5V",       spec: "Peripheral rail",             detailId: "psu-rail-5v"      },
    { name: "+12V",      spec: "High-power rail · Black only", detailId: "psu-rail-12v"    },
  ],
};

// ─── Build Factory ────────────────────────────────────────────────────────────

function slotPower(slot: VPXSlot): number {
  return (
    slot.baseCard.powerDrawWatts +
    slot.attachedMezzanines.reduce((s, m) => s + m.powerDrawWatts, 0)
  );
}

function slotWeight(slot: VPXSlot): number {
  return (
    slot.baseCard.weightGrams +
    slot.attachedMezzanines.reduce((s, m) => s + m.weightGrams, 0)
  );
}

function makeBuild(
  id: string,
  customerName: string,
  description: string,
  slots: VPXSlot[]
): SystemBuild {
  return {
    id,
    customerName,
    description,
    slots,
    totalSystemPower:  slots.reduce((s, sl) => s + slotPower(sl),  0),
    totalSystemWeight: slots.reduce((s, sl) => s + slotWeight(sl), 0),
  };
}

// ─── Builds ──────────────────────────────────────────────────────────────────
// Chassis slot order (left → right):
//   0: PSU Red | 1: Spare | 2: Spare | 3: GPP Red | 4: Crypto | 5: GPP Black | 6: PSU Black

export const BUILDS: SystemBuild[] = [
  // Baseline: 5 + (32+6) + 10 + (31+6) + 6 = 96 W
  makeBuild(
    "baseline",
    "Baseline",
    "Standard SNP reference configuration — dual GPP with Optical 10G mezzanines, crypto unit, and dual power converters.",
    [
      { slotNumber: 0, baseCard: psu_red,        attachedMezzanines: []               },
      { slotNumber: 3, baseCard: gpp_base_red,   attachedMezzanines: [mez_optical_10g] },
      { slotNumber: 4, baseCard: crypto_unit,    attachedMezzanines: []               },
      { slotNumber: 5, baseCard: gpp_base_black, attachedMezzanines: [mez_optical_10g] },
      { slotNumber: 6, baseCard: psu_black,      attachedMezzanines: []               },
    ]
  ),

  // ABE pLEO: Copper mezzanines replace Optical on both GPPs
  // (32+3) + (31+3) + 10 + 5 + 6 = 90 W  — SWaP-C optimised
  makeBuild(
    "customer-a-pleo",
    "ABE",
    "Proliferated Low Earth Orbit variant. Copper 10G mezzanines replace Optical on both GPP slots for reduced SWaP-C.",
    [
      { slotNumber: 0, baseCard: psu_red,        attachedMezzanines: []               },
      { slotNumber: 3, baseCard: gpp_base_red,   attachedMezzanines: [mez_copper_10g] },
      { slotNumber: 4, baseCard: crypto_unit,    attachedMezzanines: []               },
      { slotNumber: 5, baseCard: gpp_base_black, attachedMezzanines: [mez_copper_10g] },
      { slotNumber: 6, baseCard: psu_black,      attachedMezzanines: []               },
    ]
  ),

  // J2 pLEO: Copper mezzanines + Atomic Clock in slot 1
  // 5 + 13 + (32+3) + 10 + (31+3) + 6 = 103 W
  makeBuild(
    "customer-b-pleo",
    "J2",
    "Proliferated Low Earth Orbit variant with precision timing. Copper 10G mezzanines on both GPP slots plus Atomic Clock expansion for nanosecond-class synchronization.",
    [
      { slotNumber: 0, baseCard: psu_red,        attachedMezzanines: []               },
      { slotNumber: 1, baseCard: timing_atomic,  attachedMezzanines: []               },
      { slotNumber: 3, baseCard: gpp_base_red,   attachedMezzanines: [mez_copper_10g] },
      { slotNumber: 4, baseCard: crypto_unit,    attachedMezzanines: []               },
      { slotNumber: 5, baseCard: gpp_base_black, attachedMezzanines: [mez_copper_10g] },
      { slotNumber: 6, baseCard: psu_black,      attachedMezzanines: []               },
    ]
  ),

  // JL pLEO: Copper mezzanines, SWaP-C optimised
  // (32+3) + (31+3) + 10 + 5 + 6 = 90 W
  makeBuild(
    "customer-c-pleo",
    "JL",
    "Proliferated Low Earth Orbit variant. Copper 10G mezzanines on both GPP slots, tailored for high-revisit pLEO mission profile.",
    [
      { slotNumber: 0, baseCard: psu_red,        attachedMezzanines: []               },
      { slotNumber: 3, baseCard: gpp_base_red,   attachedMezzanines: [mez_copper_10g] },
      { slotNumber: 4, baseCard: crypto_unit,    attachedMezzanines: []               },
      { slotNumber: 5, baseCard: gpp_base_black, attachedMezzanines: [mez_copper_10g] },
      { slotNumber: 6, baseCard: psu_black,      attachedMezzanines: []               },
    ]
  ),

  // FMS IRAD: Lab prototype — all baseline updates rolled in, currently under test
  // 5 + (32+6) + 10 + (31+6) + 6 = 96 W  (mirrors baseline)
  makeBuild(
    "fms-irad",
    "FMS",
    "Internal R&D prototype currently in the lab. Reflects the full baseline configuration with all rolled-in updates. Used for hardware validation, firmware integration testing, and pre-production qualification.",
    [
      { slotNumber: 0, baseCard: psu_red,        attachedMezzanines: []                },
      { slotNumber: 3, baseCard: gpp_base_red,   attachedMezzanines: [mez_optical_10g] },
      { slotNumber: 4, baseCard: crypto_unit,    attachedMezzanines: []                },
      { slotNumber: 5, baseCard: gpp_base_black, attachedMezzanines: [mez_optical_10g] },
      { slotNumber: 6, baseCard: psu_black,      attachedMezzanines: []                },
    ]
  ),
];

// ─── Utilities ───────────────────────────────────────────────────────────────

export function getBuildById(id: string): SystemBuild | undefined {
  return BUILDS.find((b) => b.id === id);
}

/** Flatten base cards and all mezzanines from every slot into a single list */
export function flattenComponents(build: SystemBuild): HardwareComponent[] {
  return build.slots.flatMap((sl) => [sl.baseCard, ...sl.attachedMezzanines]);
}

export function getBuildDifferences(baselineId: string, comparisonId: string): BuildDiff {
  const base = getBuildById(baselineId);
  const comp = getBuildById(comparisonId);

  if (!base || !comp) {
    throw new Error(`Build not found: ${!base ? baselineId : comparisonId}`);
  }

  const baseComps = flattenComponents(base);
  const compComps = flattenComponents(comp);
  const baseIds   = new Set(baseComps.map((c) => c.id));
  const compIds   = new Set(compComps.map((c) => c.id));

  return {
    baselineId,
    comparisonId,
    powerDelta:         comp.totalSystemPower  - base.totalSystemPower,
    weightDelta:        comp.totalSystemWeight - base.totalSystemWeight,
    removedComponents:  baseComps.filter((c) => !compIds.has(c.id)),
    addedComponents:    compComps.filter((c) => !baseIds.has(c.id)),
    sharedComponents:   baseComps.filter((c) =>  compIds.has(c.id)),
  };
}
