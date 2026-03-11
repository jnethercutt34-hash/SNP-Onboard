// ─── Configuration Change Tracker Data Model ─────────────────────────────────

export type ChangeType = "ECO" | "ECN" | "DCN" | "Deviation" | "Waiver";
export type ChangeStatus = "Draft" | "Submitted" | "Reviewed" | "Approved" | "Incorporated" | "Rejected";
export type ChangeSeverity = "Critical" | "Major" | "Minor" | "Administrative";

export interface ChangeRecord {
  id: string;
  changeNumber: string;        // e.g., "ECO-2025-042"
  type: ChangeType;
  title: string;
  description: string;
  severity: ChangeSeverity;
  status: ChangeStatus;
  dateSubmitted: string;
  dateApproved?: string;
  dateIncorporated?: string;
  submittedBy: string;
  approvedBy?: string;
  affectedModules: string[];   // detailIds from mock-components.ts
  affectedBuilds: string[];    // build IDs from mock-hardware.ts
  rationale: string;
  documentRefs?: string[];     // e.g., ["SNP-ECO-042", "SNP-TR-050"]
  notes?: string;
}

// ─── Module Name Map ──────────────────────────────────────────────────────────

const MODULE_NAMES: Record<string, string> = {
  "gpp-universal": "Universal GPP Card",
  "optical-10g": "10G Optical XMC Mezzanine",
  "net-10g-copper": "10G Copper XMC Mezzanine",
  "crypto-unit": "Cryptographic Processing Unit",
  "psu-red": "Power Converter (Red)",
  "psu-black": "Power Converter (Black)",
  "timing-atomic-clock": "Timing & Networking Expansion",
  "mez-qsfp-3x": "3× QSFP XMC Mezzanine",
  "mez-qsfp-passive": "10G QSFP Passive XMC Mezzanine",
};

export function getModuleName(id: string): string {
  return MODULE_NAMES[id] || id;
}

const BUILD_NAMES: Record<string, string> = {
  baseline: "Baseline",
  "customer-a-pleo": "ABE (pLEO)",
  "customer-b-pleo": "J2 (pLEO)",
  "customer-c-pleo": "JL (pLEO)",
  "fms-irad": "FMS (IRAD)",
};

export function getBuildName(id: string): string {
  return BUILD_NAMES[id] || id;
}

// ─── Mock Change Records ──────────────────────────────────────────────────────

export const CHANGE_RECORDS: ChangeRecord[] = [
  {
    id: "eco-2025-042",
    changeNumber: "ECO-2025-042",
    type: "ECO",
    title: "Replace NVM Flash with MRAM on Universal GPP Board",
    description:
      "Replace the 2 Gb NOR Flash (Cypress S29GL02GP) with 2 Gb MRAM (Everspin EMxxLX) on both Red and Black Universal GPP carrier boards. MRAM provides inherent radiation immunity (no SEU bit-flips), unlimited write endurance, and non-volatile retention without charge pump circuitry.",
    severity: "Major",
    status: "Incorporated",
    dateSubmitted: "2025-04-15",
    dateApproved: "2025-05-02",
    dateIncorporated: "2025-06-10",
    submittedBy: "J. Nethercutt",
    approvedBy: "Chief Engineer",
    affectedModules: ["gpp-universal"],
    affectedBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    rationale:
      "Flash memory susceptible to single-event upsets in pLEO radiation environment. MRAM is inherently radiation-immune — no error correction overhead, simpler boot sequence, and eliminates flash wear-leveling firmware complexity. Trade study SNP-TS-MRAM confirmed MRAM as superior for ≤7-year pLEO missions.",
    documentRefs: ["SNP-ECO-042", "SNP-TS-MRAM"],
  },
  {
    id: "eco-2025-058",
    changeNumber: "ECO-2025-058",
    type: "ECO",
    title: "Add 4× 1000Base-T via Nano-D to All Mezzanine Cards",
    description:
      "Add Microchip VSC8504 Quad PHY and 51-pin Nano-D connector to all mezzanine variants (Optical, Copper, QSFP Active, QSFP Passive). Provides 4× 10/100/1000Base-T Ethernet on every mezzanine configuration, regardless of primary high-speed interface.",
    severity: "Major",
    status: "Incorporated",
    dateSubmitted: "2025-06-20",
    dateApproved: "2025-07-08",
    dateIncorporated: "2025-08-15",
    submittedBy: "Hardware Engineering",
    approvedBy: "Program Manager",
    affectedModules: ["optical-10g", "net-10g-copper", "mez-qsfp-3x", "mez-qsfp-passive"],
    affectedBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    rationale:
      "Customer feedback indicated need for standardized low-speed Ethernet across all configurations. Quad PHY via Nano-D connector provides 4× GbE ports without consuming high-speed XMC lanes. Eliminates per-customer mezzanine wiring variations.",
    documentRefs: ["SNP-ECO-058"],
  },
  {
    id: "eco-2025-071",
    changeNumber: "ECO-2025-071",
    type: "ECO",
    title: "Copper Mezzanine: Dual-Channel to Quad-Channel 10GBase-T",
    description:
      "Upgrade the 10G Copper XMC Mezzanine from 2× 10GBase-T ports to 4× 10GBase-T ports (quad-channel). Provides 40 Gbps aggregate copper bandwidth matching the optical mezzanine capability.",
    severity: "Major",
    status: "Incorporated",
    dateSubmitted: "2025-09-01",
    dateApproved: "2025-09-15",
    dateIncorporated: "2025-10-20",
    submittedBy: "Systems Engineering",
    approvedBy: "Chief Engineer",
    affectedModules: ["net-10g-copper"],
    affectedBuilds: ["customer-a-pleo", "customer-b-pleo", "customer-c-pleo"],
    rationale:
      "Dual-channel was insufficient for J2 mission data throughput requirements. Quad-channel provides parity with optical variant and supports future bandwidth growth. No significant SWaP-C impact (same power envelope).",
    documentRefs: ["SNP-ECO-071"],
  },
  {
    id: "ecn-2025-015",
    changeNumber: "ECN-2025-015",
    type: "ECN",
    title: "J2 Build: Move Atomic Clock from Slot 2 to Slot 3",
    description:
      "Relocate the Timing & Networking Expansion module (Atomic Clock) from chassis slot 2 to slot 3 in the J2 (customer-b-pleo) build configuration. Slot 3 is adjacent to GPP Red (slot 4), reducing backplane trace length for timing-critical 1PPS and 10 MHz signals.",
    severity: "Minor",
    status: "Incorporated",
    dateSubmitted: "2025-10-05",
    dateApproved: "2025-10-12",
    dateIncorporated: "2025-11-01",
    submittedBy: "J. Nethercutt",
    approvedBy: "Systems Engineering",
    affectedModules: ["timing-atomic-clock"],
    affectedBuilds: ["customer-b-pleo"],
    rationale:
      "Shorter backplane path between Atomic Clock (slot 3) and GPP Red (slot 4) reduces timing jitter on 1PPS distribution. Measured improvement: 50 ps RMS jitter reduction.",
    documentRefs: ["SNP-ECN-015"],
  },
  {
    id: "ecn-2025-022",
    changeNumber: "ECN-2025-022",
    type: "ECN",
    title: "Rename VTRFA Connector to VTRAF Across All Documentation",
    description:
      "Correct the AirBorn optical connector designation from 'VTRFA' to 'VTRAF' (Visible Through-chassis Ruggedized Assembly, Fiber-optic) across all source code, documentation, chassis diagrams, and product lineage diagrams.",
    severity: "Administrative",
    status: "Incorporated",
    dateSubmitted: "2025-11-10",
    dateApproved: "2025-11-10",
    dateIncorporated: "2025-11-12",
    submittedBy: "Documentation",
    approvedBy: "Configuration Management",
    affectedModules: ["gpp-universal", "optical-10g"],
    affectedBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    rationale:
      "Vendor designation is VTRAF, not VTRFA. Correcting across all references for consistency with vendor datasheet and ICD.",
    documentRefs: ["SNP-ECN-022"],
  },
  {
    id: "eco-2026-003",
    changeNumber: "ECO-2026-003",
    type: "ECO",
    title: "Pure Tin Passives Approval for ≤0603 Footprint (pLEO)",
    description:
      "Approve use of pure tin (Sn) terminated passive components at 0402 and 0603 footprints for all pLEO mission configurations. Conformal coating per GEIA-STD-0005-2 Category 2 is the required mitigation. Components at 0805 and larger footprints continue to require SnPb termination or hot solder dip.",
    severity: "Major",
    status: "Approved",
    dateSubmitted: "2026-01-15",
    dateApproved: "2026-02-10",
    submittedBy: "Materials Engineering",
    approvedBy: "Chief Engineer",
    affectedModules: ["gpp-universal", "optical-10g", "net-10g-copper", "crypto-unit", "psu-red", "psu-black"],
    affectedBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    rationale:
      "Trade study SNP-TS-001 demonstrates tin whisker risk is acceptable for ≤0603 passives in pLEO (≤7 year) missions with conformal coat mitigation. Enables use of widely available commercial passives, reducing lead time by 8–12 weeks on 40% of the passive BOM.",
    documentRefs: ["SNP-ECO-003", "SNP-TS-001"],
    notes: "Pending incorporation into production BOM. Existing SnPb stock may be used until depleted.",
  },
  {
    id: "dcn-2026-001",
    changeNumber: "DCN-2026-001",
    type: "DCN",
    title: "J2 Black: Add RS-422, 1PPS, 10 MHz Interfaces via Backplane",
    description:
      "Add the following interfaces to the J2 (customer-b-pleo) GPP Black via backplane discrete channels: 4× 1PPS outputs, 4× 10 MHz outputs, 4× 2.5GBase-T, 4× 100Base-T, and 2× 1000Base-T. Requires backplane discrete channel allocation and Quad PHY configuration update.",
    severity: "Major",
    status: "Incorporated",
    dateSubmitted: "2025-12-01",
    dateApproved: "2025-12-15",
    dateIncorporated: "2026-01-20",
    submittedBy: "J2 Program Office",
    approvedBy: "Configuration Control Board",
    affectedModules: ["gpp-universal", "net-10g-copper", "timing-atomic-clock"],
    affectedBuilds: ["customer-b-pleo"],
    rationale:
      "J2 mission requires precision timing distribution to multiple spacecraft subsystems. 1PPS and 10 MHz signals sourced from Atomic Clock module, routed through GPP Black backplane interfaces to external harness connectors.",
    documentRefs: ["SNP-DCN-001", "J2-ICD-Rev-C"],
  },
  {
    id: "eco-2026-010",
    changeNumber: "ECO-2026-010",
    type: "ECO",
    title: "Add 3× QSFP Active XMC Mezzanine to Component Catalog",
    description:
      "Add the 3× QSFP Active XMC Mezzanine as a new mezzanine option. Provides 3× QSFP+ ports with active optics, 120 Gbps aggregate bandwidth. Used on ABE GPP Black for high-density downlink.",
    severity: "Major",
    status: "Incorporated",
    dateSubmitted: "2025-07-15",
    dateApproved: "2025-08-01",
    dateIncorporated: "2025-09-15",
    submittedBy: "Hardware Engineering",
    approvedBy: "Program Manager",
    affectedModules: ["mez-qsfp-3x"],
    affectedBuilds: ["customer-a-pleo"],
    rationale:
      "ABE mission requires high-density optical downlink exceeding single VTRAF connector capacity. 3× QSFP+ provides 3× 40 Gbps (120 Gbps aggregate) for mission data offload.",
    documentRefs: ["SNP-ECO-010"],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getChangeById(id: string): ChangeRecord | undefined {
  return CHANGE_RECORDS.find((c) => c.id === id);
}

export function getChangesByModule(moduleId: string): ChangeRecord[] {
  return CHANGE_RECORDS.filter((c) => c.affectedModules.includes(moduleId));
}

export function getChangesByBuild(buildId: string): ChangeRecord[] {
  return CHANGE_RECORDS.filter((c) => c.affectedBuilds.includes(buildId));
}

export function getChangesByStatus(status: ChangeStatus): ChangeRecord[] {
  return CHANGE_RECORDS.filter((c) => c.status === status);
}

export function getChangeStatusCounts(): Record<ChangeStatus, number> {
  const counts: Record<ChangeStatus, number> = {
    Draft: 0, Submitted: 0, Reviewed: 0, Approved: 0, Incorporated: 0, Rejected: 0,
  };
  for (const c of CHANGE_RECORDS) {
    counts[c.status]++;
  }
  return counts;
}
