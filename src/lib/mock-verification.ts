// ─── Verification & Test Status Data Model ────────────────────────────────────

export type VerificationMethod = "Test" | "Analysis" | "Inspection" | "Demonstration" | "Similarity";
export type VerificationStatus = "Pass" | "Fail" | "In Progress" | "Not Started" | "Waiver" | "N/A";

export interface Requirement {
  id: string;
  title: string;
  specification: string;        // e.g., "SyRS §3.2.1"
  category: string;             // e.g., "Performance", "Environmental", "EMI", "Safety"
  verificationMethod: VerificationMethod;
  status: VerificationStatus;
  testProcedure?: string;       // e.g., "SNP-TP-001 §4.3"
  testReport?: string;          // e.g., "SNP-TR-001"
  testDate?: string;
  notes?: string;
  affectedModules: string[];    // detailIds
}

// ─── Mock Requirements ────────────────────────────────────────────────────────

export const REQUIREMENTS: Requirement[] = [
  // Performance
  {
    id: "req-perf-001",
    title: "Processing throughput ≥ 200 GFLOPS (FPGA + ARM combined)",
    specification: "SyRS §3.1.1",
    category: "Performance",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-001 §4.1",
    testReport: "SNP-TR-001",
    testDate: "2025-09-20",
    affectedModules: ["gpp-universal"],
  },
  {
    id: "req-perf-002",
    title: "10 Gbps full-duplex Ethernet throughput per mezzanine port",
    specification: "SyRS §3.1.2",
    category: "Performance",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-002 §4.1",
    testReport: "SNP-TR-007",
    testDate: "2025-10-05",
    affectedModules: ["optical-10g", "net-10g-copper"],
  },
  {
    id: "req-perf-003",
    title: "Hot-standby GPP switchover < 200 ms",
    specification: "SyRS §3.1.3",
    category: "Performance",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-003 §4.2",
    testReport: "SNP-TR-008",
    testDate: "2025-11-12",
    notes: "Measured 148 ms average (ARM FW v2.4.0). Down from 195 ms in v2.3.0.",
    affectedModules: ["gpp-universal"],
  },
  {
    id: "req-perf-004",
    title: "Boot time ≤ 5 seconds (power-on to application ready)",
    specification: "SyRS §3.1.4",
    category: "Performance",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-003 §4.3",
    testReport: "SNP-TR-008",
    testDate: "2025-11-12",
    notes: "Measured 2.8 sec with MRAM direct boot (Boot FW v1.1.0). Flash staging path was 4.2 sec.",
    affectedModules: ["gpp-universal"],
  },

  // Environmental
  {
    id: "req-env-001",
    title: "Operating temperature: −40 °C to +71 °C (chassis boundary)",
    specification: "SyRS §3.2.1",
    category: "Environmental",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-010 §4.1",
    testReport: "SNP-TR-001",
    testDate: "2025-09-15",
    affectedModules: ["gpp-universal", "optical-10g", "net-10g-copper", "crypto-unit", "psu-red", "psu-black"],
  },
  {
    id: "req-env-002",
    title: "Random vibration: 14.1 Grms (20–2000 Hz), GEVS profile",
    specification: "SyRS §3.2.2",
    category: "Environmental",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-011 §4.1",
    testReport: "SNP-TR-002",
    testDate: "2025-10-02",
    affectedModules: ["gpp-universal", "optical-10g", "net-10g-copper", "crypto-unit", "psu-red", "psu-black"],
  },
  {
    id: "req-env-003",
    title: "Mechanical shock: 40 g, 6 ms half-sine",
    specification: "SyRS §3.2.3",
    category: "Environmental",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-011 §4.2",
    testReport: "SNP-TR-002",
    testDate: "2025-10-02",
    affectedModules: ["gpp-universal", "optical-10g", "crypto-unit", "psu-red", "psu-black"],
  },
  {
    id: "req-env-004",
    title: "Altitude/vacuum: operate at ≤ 1 × 10⁻⁶ Torr",
    specification: "SyRS §3.2.4",
    category: "Environmental",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-010 §4.3",
    testReport: "SNP-TR-001",
    testDate: "2025-09-15",
    affectedModules: ["gpp-universal", "optical-10g", "crypto-unit", "psu-red", "psu-black"],
  },
  {
    id: "req-env-005",
    title: "Atomic Clock: CSAC stability under vibration (Allan deviation < 3×10⁻¹⁰ at τ=1s)",
    specification: "J2-SyRS §3.2.5",
    category: "Environmental",
    verificationMethod: "Test",
    status: "In Progress",
    testProcedure: "SNP-TP-015 §4.1",
    notes: "Measuring Allan deviation during random vibe. Preliminary results within spec.",
    affectedModules: ["timing-atomic-clock"],
  },

  // Radiation
  {
    id: "req-rad-001",
    title: "TID tolerance ≥ 100 krad(Si) for all Qualified components",
    specification: "SyRS §3.3.1",
    category: "Radiation",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-020 §4.1",
    testReport: "SNP-TR-004",
    testDate: "2025-08-20",
    affectedModules: ["gpp-universal", "crypto-unit", "psu-red", "psu-black"],
  },
  {
    id: "req-rad-002",
    title: "SEL immunity at LET ≥ 60 MeV·cm²/mg",
    specification: "SyRS §3.3.2",
    category: "Radiation",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-021 §4.1",
    testReport: "SNP-TR-005",
    testDate: "2025-08-25",
    affectedModules: ["gpp-universal", "optical-10g", "net-10g-copper", "crypto-unit"],
  },
  {
    id: "req-rad-003",
    title: "DDR4 EDAC: correct all single-bit errors, detect all double-bit errors",
    specification: "SyRS §3.3.3",
    category: "Radiation",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-022 §4.1",
    testReport: "SNP-TR-009",
    testDate: "2025-09-10",
    affectedModules: ["gpp-universal"],
  },

  // EMI/EMC
  {
    id: "req-emi-001",
    title: "EMI conducted emissions per MIL-STD-461G CE102",
    specification: "SyRS §3.4.1",
    category: "EMI",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-030 §4.1",
    testReport: "SNP-TR-003",
    testDate: "2025-11-18",
    affectedModules: ["psu-red", "psu-black"],
  },
  {
    id: "req-emi-002",
    title: "EMI radiated emissions per MIL-STD-461G RE102",
    specification: "SyRS §3.4.2",
    category: "EMI",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-030 §4.2",
    testReport: "SNP-TR-003",
    testDate: "2025-11-18",
    affectedModules: ["gpp-universal", "optical-10g", "net-10g-copper"],
  },
  {
    id: "req-emi-003",
    title: "Copper mezzanine EMI compliance per MIL-STD-461G",
    specification: "SyRS §3.4.3",
    category: "EMI",
    verificationMethod: "Test",
    status: "In Progress",
    testProcedure: "SNP-TP-031 §4.1",
    notes: "Scheduled completion Q1 2026",
    affectedModules: ["net-10g-copper"],
  },

  // Safety / Security
  {
    id: "req-sec-001",
    title: "FIPS 140-2 Level 3 certification for crypto module",
    specification: "SyRS §3.5.1",
    category: "Safety",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "FIPS 140-2 Validation",
    testReport: "SNP-CERT-001",
    testDate: "2025-06-30",
    affectedModules: ["crypto-unit"],
  },
  {
    id: "req-sec-002",
    title: "Secure boot chain — ECDSA P-384 signature verification",
    specification: "SyRS §3.5.2",
    category: "Safety",
    verificationMethod: "Demonstration",
    status: "Pass",
    testProcedure: "SNP-TP-040 §4.1",
    testReport: "SNP-TR-015",
    testDate: "2026-01-20",
    affectedModules: ["gpp-universal"],
  },
  {
    id: "req-sec-003",
    title: "Key zeroization response < 10 ms on tamper detect",
    specification: "SyRS §3.5.3",
    category: "Safety",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-041 §4.1",
    testReport: "SNP-TR-020",
    testDate: "2025-07-15",
    notes: "Measured 6.2 ms average zeroization time.",
    affectedModules: ["crypto-unit"],
  },

  // Power
  {
    id: "req-pwr-001",
    title: "Input voltage: 28 V DC ± 6 V (MIL-STD-704 compatible)",
    specification: "SyRS §3.6.1",
    category: "Power",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-050 §4.1",
    testReport: "SNP-TR-030",
    testDate: "2025-08-01",
    affectedModules: ["psu-red", "psu-black"],
  },
  {
    id: "req-pwr-002",
    title: "Total system power ≤ 150 W for any build configuration",
    specification: "SyRS §3.6.2",
    category: "Power",
    verificationMethod: "Analysis",
    status: "Pass",
    notes: "Max configuration (J2 with Atomic Clock) = 103 W. 47 W margin to 150 W limit.",
    affectedModules: ["psu-red", "psu-black", "gpp-universal"],
  },
  {
    id: "req-pwr-003",
    title: "Input surge protection per MIL-STD-1275E",
    specification: "SyRS §3.6.3",
    category: "Power",
    verificationMethod: "Test",
    status: "Pass",
    testProcedure: "SNP-TP-051 §4.1",
    testReport: "SNP-TR-030",
    testDate: "2025-08-01",
    affectedModules: ["psu-red", "psu-black"],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getRequirementById(id: string): Requirement | undefined {
  return REQUIREMENTS.find((r) => r.id === id);
}

export function getRequirementsByCategory(category: string): Requirement[] {
  return REQUIREMENTS.filter((r) => r.category === category);
}

export function getRequirementsByModule(moduleId: string): Requirement[] {
  return REQUIREMENTS.filter((r) => r.affectedModules.includes(moduleId));
}

export function getVerificationSummary(): {
  total: number;
  pass: number;
  fail: number;
  inProgress: number;
  notStarted: number;
  byCategory: Record<string, { total: number; pass: number }>;
} {
  const byCategory: Record<string, { total: number; pass: number }> = {};
  let pass = 0, fail = 0, inProgress = 0, notStarted = 0;

  for (const r of REQUIREMENTS) {
    if (r.status === "Pass") pass++;
    else if (r.status === "Fail") fail++;
    else if (r.status === "In Progress") inProgress++;
    else if (r.status === "Not Started") notStarted++;

    if (!byCategory[r.category]) byCategory[r.category] = { total: 0, pass: 0 };
    byCategory[r.category].total++;
    if (r.status === "Pass") byCategory[r.category].pass++;
  }

  return { total: REQUIREMENTS.length, pass, fail, inProgress, notStarted, byCategory };
}

export const CATEGORIES = [...new Set(REQUIREMENTS.map((r) => r.category))];
