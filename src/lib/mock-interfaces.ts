// ─── Interface / Signal Map Data Model ────────────────────────────────────────

export type SignalDomain = "Data Plane" | "Control Plane" | "Utility Plane" | "External" | "Timing";

export type SignalDirection = "In" | "Out" | "Bidirectional";

export interface SignalPath {
  id: string;
  name: string;
  domain: SignalDomain;
  protocol: string;             // e.g., "PCIe Gen3 x4", "10GbE XGMII", "CAN 2.0B"
  speed: string;                // e.g., "32 Gbps", "10 Gbps", "1 Mbps"
  direction: SignalDirection;
  sourceSlot: number;           // 1-indexed chassis slot
  sourceModule: string;         // detailId
  sourceConnector?: string;     // e.g., "VTRAF", "Nano-D", "Backplane P1"
  destSlot: number;
  destModule: string;
  destConnector?: string;
  description: string;
  buildSpecific?: string[];     // build IDs — if absent, applies to all builds
}

// ─── SpaceVPX Backplane Architecture ──────────────────────────────────────────

export const BACKPLANE_INFO = {
  standard: "VITA 78 (SpaceVPX)",
  slots: 7,
  planes: [
    {
      name: "Data Plane",
      description: "High-speed serial links between payload slots. Fat pipe (P1 connector): PCIe Gen3, 10GbE, SRIO. Thin pipe: 1GbE, Aurora.",
      connector: "P1 (Data Plane)",
      maxBandwidth: "40 Gbps per slot (4× PCIe Gen3 x4)",
    },
    {
      name: "Control Plane",
      description: "Dedicated Ethernet control network between all slots. 1GbE star topology from switch slot (Slot 5 — Crypto) to all payload slots.",
      connector: "P2 (Control Plane)",
      maxBandwidth: "1 Gbps per slot",
    },
    {
      name: "Utility Plane",
      description: "Low-speed management bus. I²C, discrete signals, JTAG chain, system reset, slot geographic addressing. Managed by CMC on PSU slots.",
      connector: "P0 (Utility Plane)",
      maxBandwidth: "400 kbps (I²C) / 1 Mbps (CAN)",
    },
  ],
};

// ─── Signal Paths ─────────────────────────────────────────────────────────────

export const SIGNAL_PATHS: SignalPath[] = [
  // ── Data Plane: GPP ↔ Crypto ──────────────────────────────────
  {
    id: "dp-gpp-red-crypto",
    name: "GPP Red → Crypto Data Link",
    domain: "Data Plane",
    protocol: "PCIe Gen3 x4",
    speed: "32 Gbps",
    direction: "Bidirectional",
    sourceSlot: 4,
    sourceModule: "gpp-universal",
    sourceConnector: "Backplane P1",
    destSlot: 5,
    destModule: "crypto-unit",
    destConnector: "Backplane P1",
    description: "Primary encrypted data path from GPP Red to crypto engine. Carries mission data for encryption/decryption. PCIe Gen3 x4 over backplane fat pipe.",
  },
  {
    id: "dp-gpp-black-crypto",
    name: "GPP Black → Crypto Data Link",
    domain: "Data Plane",
    protocol: "PCIe Gen3 x4",
    speed: "32 Gbps",
    direction: "Bidirectional",
    sourceSlot: 6,
    sourceModule: "gpp-universal",
    sourceConnector: "Backplane P1",
    destSlot: 5,
    destModule: "crypto-unit",
    destConnector: "Backplane P1",
    description: "Redundant encrypted data path from GPP Black to crypto engine. Active during hot-standby failover.",
  },
  {
    id: "dp-gpp-red-black",
    name: "GPP Red ↔ GPP Black Crosslink",
    domain: "Data Plane",
    protocol: "10GbE (Aurora)",
    speed: "10 Gbps",
    direction: "Bidirectional",
    sourceSlot: 4,
    sourceModule: "gpp-universal",
    sourceConnector: "Backplane P1",
    destSlot: 6,
    destModule: "gpp-universal",
    destConnector: "Backplane P1",
    description: "Inter-GPP crosslink for state synchronization, health monitoring, and hot-standby failover coordination. 10GbE Aurora protocol.",
  },

  // ── Data Plane: Mezzanine → External ──────────────────────────
  {
    id: "dp-mez-red-vtraf",
    name: "GPP Red Mezzanine → VTRAF (Optical)",
    domain: "External",
    protocol: "10GbE (fiber)",
    speed: "10 Gbps",
    direction: "Bidirectional",
    sourceSlot: 4,
    sourceModule: "optical-10g",
    sourceConnector: "VTRAF (faceplate)",
    destSlot: 0,
    destModule: "external",
    destConnector: "External fiber harness",
    description: "10 Gbps fiber-optic uplink/downlink from GPP Red optical mezzanine through VTRAF AirBorn connector to spacecraft harness.",
    buildSpecific: ["baseline", "fms-irad"],
  },
  {
    id: "dp-mez-black-vtraf",
    name: "GPP Black Mezzanine → VTRAF (Optical)",
    domain: "External",
    protocol: "10GbE (fiber)",
    speed: "10 Gbps",
    direction: "Bidirectional",
    sourceSlot: 6,
    sourceModule: "optical-10g",
    sourceConnector: "VTRAF (faceplate)",
    destSlot: 0,
    destModule: "external",
    destConnector: "External fiber harness",
    description: "Redundant 10 Gbps fiber-optic link from GPP Black optical mezzanine.",
    buildSpecific: ["baseline", "fms-irad"],
  },
  {
    id: "dp-mez-nano-gbe",
    name: "Mezzanine Quad PHY → Nano-D (4× GbE)",
    domain: "External",
    protocol: "1000Base-T (RGMII)",
    speed: "4 Gbps aggregate",
    direction: "Bidirectional",
    sourceSlot: 4,
    sourceModule: "optical-10g",
    sourceConnector: "Nano-D 51-pin (faceplate)",
    destSlot: 0,
    destModule: "external",
    destConnector: "External harness",
    description: "4× 1000Base-T Ethernet via VSC8504 Quad PHY through 51-pin Nano-D connector. Present on all mezzanine variants.",
  },

  // ── Control Plane ─────────────────────────────────────────────
  {
    id: "cp-crypto-gpp-red",
    name: "Crypto → GPP Red Control",
    domain: "Control Plane",
    protocol: "1GbE",
    speed: "1 Gbps",
    direction: "Bidirectional",
    sourceSlot: 5,
    sourceModule: "crypto-unit",
    sourceConnector: "Backplane P2",
    destSlot: 4,
    destModule: "gpp-universal",
    destConnector: "Backplane P2",
    description: "1GbE control plane link for key management commands, health status, and crypto configuration. Star topology from crypto switch.",
  },
  {
    id: "cp-crypto-gpp-black",
    name: "Crypto → GPP Black Control",
    domain: "Control Plane",
    protocol: "1GbE",
    speed: "1 Gbps",
    direction: "Bidirectional",
    sourceSlot: 5,
    sourceModule: "crypto-unit",
    sourceConnector: "Backplane P2",
    destSlot: 6,
    destModule: "gpp-universal",
    destConnector: "Backplane P2",
    description: "Redundant 1GbE control plane link to GPP Black.",
  },

  // ── Utility Plane ─────────────────────────────────────────────
  {
    id: "up-cmc-bus",
    name: "CMC I²C/CAN Management Bus",
    domain: "Utility Plane",
    protocol: "I²C + CAN 2.0B",
    speed: "400 kbps / 1 Mbps",
    direction: "Bidirectional",
    sourceSlot: 1,
    sourceModule: "psu-red",
    sourceConnector: "Backplane P0 + MDM-9",
    destSlot: 7,
    destModule: "psu-black",
    destConnector: "Backplane P0 + MDM-9",
    description: "Chassis management bus connecting all slots via I²C (utility plane) and CAN 2.0B (MDM-9). CMC on PSU Red is primary bus master. Provides power sequencing, health telemetry, slot discovery.",
  },
  {
    id: "up-jtag-chain",
    name: "JTAG Boundary Scan Chain",
    domain: "Utility Plane",
    protocol: "JTAG (IEEE 1149.1)",
    speed: "10 MHz TCK",
    direction: "Bidirectional",
    sourceSlot: 1,
    sourceModule: "psu-red",
    sourceConnector: "Backplane P0",
    destSlot: 7,
    destModule: "psu-black",
    destConnector: "Backplane P0",
    description: "Daisy-chained JTAG through all populated slots: PSU Red → GPP Red → Crypto → GPP Black → PSU Black. Used for factory board test and debug. Accessible via Micro USB on GPP faceplates.",
  },

  // ── Timing (J2-specific) ──────────────────────────────────────
  {
    id: "tm-clock-gpp-red",
    name: "Atomic Clock → GPP Red (1PPS + 10 MHz)",
    domain: "Timing",
    protocol: "LVDS (discrete)",
    speed: "1PPS + 10 MHz",
    direction: "Out",
    sourceSlot: 3,
    sourceModule: "timing-atomic-clock",
    sourceConnector: "Backplane discrete",
    destSlot: 4,
    destModule: "gpp-universal",
    destConnector: "Backplane discrete",
    description: "Precision 1PPS and 10 MHz reference from CSAC Atomic Clock module to GPP Red via backplane discrete channels. LVDS signaling for jitter < 50 ps RMS.",
    buildSpecific: ["customer-b-pleo"],
  },
  {
    id: "tm-clock-gpp-black",
    name: "Atomic Clock → GPP Black (Timing Distribution)",
    domain: "Timing",
    protocol: "LVDS (discrete)",
    speed: "4× 1PPS + 4× 10 MHz",
    direction: "Out",
    sourceSlot: 3,
    sourceModule: "timing-atomic-clock",
    sourceConnector: "Backplane discrete",
    destSlot: 6,
    destModule: "gpp-universal",
    destConnector: "Backplane discrete + faceplate",
    description: "Timing distribution from Atomic Clock through GPP Black to external connectors: 4× 1PPS, 4× 10 MHz outputs for spacecraft subsystem synchronization.",
    buildSpecific: ["customer-b-pleo"],
  },

  // ── Power Distribution ────────────────────────────────────────
  {
    id: "pwr-28v-input",
    name: "28V DC Bus → PSU Red/Black",
    domain: "Utility Plane",
    protocol: "DC Power",
    speed: "28 V DC",
    direction: "In",
    sourceSlot: 0,
    sourceModule: "external",
    sourceConnector: "MDM-15 (faceplate)",
    destSlot: 1,
    destModule: "psu-red",
    destConnector: "MDM-15 (faceplate)",
    description: "Primary 28V DC power input from spacecraft power bus through MDM-15 connectors on PSU Red and PSU Black faceplates. MIL-STD-704 compatible.",
  },
  {
    id: "pwr-backplane-rails",
    name: "PSU → Backplane Power Rails",
    domain: "Utility Plane",
    protocol: "DC Power Rails",
    speed: "3.3V / 5V / 12V",
    direction: "Out",
    sourceSlot: 1,
    sourceModule: "psu-red",
    sourceConnector: "Backplane power pins",
    destSlot: 7,
    destModule: "psu-black",
    destConnector: "Backplane power pins",
    description: "PSU Red and PSU Black provide 3.3V, 5V, and 12V rails to all slots via backplane power distribution. Redundant power paths for fault tolerance.",
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getSignalsByDomain(domain: SignalDomain): SignalPath[] {
  return SIGNAL_PATHS.filter((s) => s.domain === domain);
}

export function getSignalsBySlot(slotNumber: number): SignalPath[] {
  return SIGNAL_PATHS.filter((s) => s.sourceSlot === slotNumber || s.destSlot === slotNumber);
}

export function getSignalsByModule(moduleId: string): SignalPath[] {
  return SIGNAL_PATHS.filter((s) => s.sourceModule === moduleId || s.destModule === moduleId);
}

export function getSignalsForBuild(buildId: string): SignalPath[] {
  return SIGNAL_PATHS.filter((s) => !s.buildSpecific || s.buildSpecific.includes(buildId));
}

export const DOMAINS: SignalDomain[] = ["Data Plane", "Control Plane", "Utility Plane", "External", "Timing"];
