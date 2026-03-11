// ─── Environmental & Qualification Data Model ────────────────────────────────

export type QualStatus = "Qualified" | "In Progress" | "Planned" | "N/A" | "Waiver";

export interface QualTest {
  testName: string;
  standard: string;            // e.g., "MIL-STD-810H Method 514.8"
  status: QualStatus;
  testDate?: string;
  reportRef?: string;          // document reference
  notes?: string;
}

export interface RadiationProfile {
  tidRating: string;           // e.g., "100 krad(Si)"
  selThreshold: string;        // e.g., "80 MeV·cm²/mg"
  seeImmunity: string;         // e.g., "SEL-immune at LET ≥ 80"
  annualDose: string;          // e.g., "~5 krad/yr at 500 km, 53° inclination"
  designLifeTid: string;       // e.g., "35 krad (7-year mission)"
  margin: string;              // e.g., "2.86× margin to 100 krad rating"
  shielding: string;           // e.g., "3 mm Al equivalent chassis"
  notes?: string;
}

export interface ThermalProfile {
  operatingRange: string;
  survivalRange: string;
  maxJunctionTemp: string;
  thermalDissipation: string;
  coolingMethod: string;
  notes?: string;
}

export interface ModuleQualification {
  moduleId: string;            // detailId from mock-components.ts
  moduleName: string;
  radiation: RadiationProfile;
  thermal: ThermalProfile;
  tests: QualTest[];
}

export interface MissionEnvironment {
  id: string;
  name: string;
  orbit: string;
  altitude: string;
  inclination: string;
  designLife: string;
  annualTidDose: string;
  peakParticleFlux: string;
  thermalCycleRange: string;
  vibrationProfile: string;
  launchVehicle?: string;
}

// ─── Mission Environments ─────────────────────────────────────────────────────

export const MISSION_ENVIRONMENTS: MissionEnvironment[] = [
  {
    id: "pleo-500",
    name: "pLEO Standard (500 km)",
    orbit: "Proliferated Low Earth Orbit",
    altitude: "500 km circular",
    inclination: "53°",
    designLife: "5–7 years",
    annualTidDose: "~5 krad/yr (behind 3 mm Al)",
    peakParticleFlux: "SAA proton peak: ~10⁴ p/cm²/s (E > 30 MeV)",
    thermalCycleRange: "−40 °C to +65 °C (chassis boundary)",
    vibrationProfile: "14.1 Grms random (20–2000 Hz), GEVS compatible",
    launchVehicle: "Falcon 9 / Vulcan",
  },
  {
    id: "pleo-550",
    name: "pLEO High (550 km)",
    orbit: "Proliferated Low Earth Orbit",
    altitude: "550 km circular",
    inclination: "97.6° (SSO)",
    designLife: "7 years",
    annualTidDose: "~7 krad/yr (behind 3 mm Al)",
    peakParticleFlux: "Polar horn proton peak: ~10³ p/cm²/s",
    thermalCycleRange: "−40 °C to +71 °C (chassis boundary)",
    vibrationProfile: "14.1 Grms random (20–2000 Hz), GEVS compatible",
    launchVehicle: "Various",
  },
];

// ─── Module Qualifications ────────────────────────────────────────────────────

export const MODULE_QUALIFICATIONS: ModuleQualification[] = [
  {
    moduleId: "gpp-universal",
    moduleName: "Universal GPP Card",
    radiation: {
      tidRating: "100 krad(Si)",
      selThreshold: "80 MeV·cm²/mg",
      seeImmunity: "SEL-immune at LET ≥ 80 MeV·cm²/mg",
      annualDose: "~5 krad/yr at 500 km pLEO",
      designLifeTid: "35 krad (7-year mission)",
      margin: "2.86× margin (100 krad rating / 35 krad exposure)",
      shielding: "3 mm Al equivalent chassis + local spot shielding on FPGA",
      notes: "AMD Versal VM1502 is rad-hard by design. MRAM inherently radiation-immune. DDR4 protected by EDAC.",
    },
    thermal: {
      operatingRange: "−40 °C to +85 °C (component level)",
      survivalRange: "−55 °C to +125 °C (non-operating)",
      maxJunctionTemp: "125 °C (FPGA), 105 °C (DDR4)",
      thermalDissipation: "32 W (Red) / 31 W (Black)",
      coolingMethod: "Conduction-cooled via wedgelock to chassis cold wall",
      notes: "Thermal strap to chassis rail, no active cooling. Cold wall maintained by spacecraft TCS.",
    },
    tests: [
      { testName: "Thermal Cycling", standard: "MIL-STD-810H Method 503.7", status: "Qualified", testDate: "2025-09-15", reportRef: "SNP-TR-001" },
      { testName: "Random Vibration", standard: "MIL-STD-810H Method 514.8", status: "Qualified", testDate: "2025-10-02", reportRef: "SNP-TR-002" },
      { testName: "Mechanical Shock", standard: "MIL-STD-810H Method 516.8", status: "Qualified", testDate: "2025-10-02", reportRef: "SNP-TR-002" },
      { testName: "EMI/EMC", standard: "MIL-STD-461G", status: "Qualified", testDate: "2025-11-18", reportRef: "SNP-TR-003" },
      { testName: "TID Radiation", standard: "MIL-STD-883 Method 1019.9", status: "Qualified", testDate: "2025-08-20", reportRef: "SNP-TR-004" },
      { testName: "SEE Radiation", standard: "JESD57A", status: "Qualified", testDate: "2025-08-25", reportRef: "SNP-TR-005" },
      { testName: "Altitude / Depressurization", standard: "MIL-STD-810H Method 500.6", status: "Qualified", testDate: "2025-09-15", reportRef: "SNP-TR-001" },
      { testName: "Humidity", standard: "MIL-STD-810H Method 507.6", status: "N/A", notes: "Sealed chassis — not applicable in orbital environment" },
      { testName: "Burn-In", standard: "MIL-STD-883 Method 1015", status: "Qualified", testDate: "2025-07-10", reportRef: "SNP-TR-006" },
    ],
  },
  {
    moduleId: "optical-10g",
    moduleName: "10G Optical XMC Mezzanine",
    radiation: {
      tidRating: "100 krad(Si)",
      selThreshold: "60 MeV·cm²/mg",
      seeImmunity: "SEL-immune at LET ≥ 60 MeV·cm²/mg",
      annualDose: "~5 krad/yr at 500 km pLEO",
      designLifeTid: "35 krad (7-year mission)",
      margin: "2.86× margin",
      shielding: "3 mm Al equivalent chassis",
      notes: "Quad PHY (VSC8504) tested to 100 krad. NVMe SSD lot-tested to 50 krad with 2× margin.",
    },
    thermal: {
      operatingRange: "−40 °C to +85 °C",
      survivalRange: "−55 °C to +125 °C",
      maxJunctionTemp: "105 °C (PHY), 70 °C (SSD)",
      thermalDissipation: "6 W",
      coolingMethod: "Conduction through FMC connector to GPP carrier, then to chassis cold wall",
    },
    tests: [
      { testName: "Thermal Cycling", standard: "MIL-STD-810H Method 503.7", status: "Qualified", testDate: "2025-09-15", reportRef: "SNP-TR-001" },
      { testName: "Random Vibration", standard: "MIL-STD-810H Method 514.8", status: "Qualified", testDate: "2025-10-02", reportRef: "SNP-TR-002" },
      { testName: "Mechanical Shock", standard: "MIL-STD-810H Method 516.8", status: "Qualified", testDate: "2025-10-02", reportRef: "SNP-TR-002" },
      { testName: "EMI/EMC", standard: "MIL-STD-461G", status: "Qualified", testDate: "2025-11-18", reportRef: "SNP-TR-003" },
      { testName: "TID Radiation", standard: "MIL-STD-883 Method 1019.9", status: "Qualified", testDate: "2025-08-20", reportRef: "SNP-TR-004" },
      { testName: "Burn-In", standard: "MIL-STD-883 Method 1015", status: "Qualified", testDate: "2025-07-10", reportRef: "SNP-TR-006" },
    ],
  },
  {
    moduleId: "net-10g-copper",
    moduleName: "10G Copper XMC Mezzanine",
    radiation: {
      tidRating: "50 krad(Si)",
      selThreshold: "60 MeV·cm²/mg",
      seeImmunity: "SEL-immune at LET ≥ 60 MeV·cm²/mg",
      annualDose: "~5 krad/yr at 500 km pLEO",
      designLifeTid: "35 krad (7-year mission)",
      margin: "1.43× margin (50 krad rating / 35 krad exposure)",
      shielding: "3 mm Al equivalent chassis",
      notes: "Copper PHY rated to 50 krad (lower than optical variant). Adequate for 7-year pLEO but no additional margin for mission extensions.",
    },
    thermal: {
      operatingRange: "−40 °C to +85 °C",
      survivalRange: "−55 °C to +125 °C",
      maxJunctionTemp: "105 °C",
      thermalDissipation: "3 W",
      coolingMethod: "Conduction through FMC connector to GPP carrier",
    },
    tests: [
      { testName: "Thermal Cycling", standard: "MIL-STD-810H Method 503.7", status: "Qualified", testDate: "2025-12-05", reportRef: "SNP-TR-010" },
      { testName: "Random Vibration", standard: "MIL-STD-810H Method 514.8", status: "Qualified", testDate: "2025-12-12", reportRef: "SNP-TR-011" },
      { testName: "EMI/EMC", standard: "MIL-STD-461G", status: "In Progress", notes: "Scheduled completion Q1 2026" },
      { testName: "TID Radiation", standard: "MIL-STD-883 Method 1019.9", status: "Qualified", testDate: "2025-11-01", reportRef: "SNP-TR-012" },
      { testName: "Burn-In", standard: "MIL-STD-883 Method 1015", status: "Qualified", testDate: "2025-10-15", reportRef: "SNP-TR-013" },
    ],
  },
  {
    moduleId: "crypto-unit",
    moduleName: "Cryptographic Processing Unit",
    radiation: {
      tidRating: "100 krad(Si)",
      selThreshold: "80 MeV·cm²/mg",
      seeImmunity: "SEL-immune at LET ≥ 80 MeV·cm²/mg",
      annualDose: "~5 krad/yr at 500 km pLEO",
      designLifeTid: "35 krad (7-year mission)",
      margin: "2.86× margin",
      shielding: "3 mm Al equivalent chassis + dedicated shielded enclosure",
      notes: "FIPS 140-2 Level 3 HSM with tamper-evident enclosure provides additional radiation shielding.",
    },
    thermal: {
      operatingRange: "−40 °C to +85 °C",
      survivalRange: "−55 °C to +125 °C",
      maxJunctionTemp: "100 °C",
      thermalDissipation: "10 W",
      coolingMethod: "Conduction-cooled via wedgelock to chassis cold wall",
      notes: "Tamper mesh increases thermal resistance — derated 10% from datasheet max.",
    },
    tests: [
      { testName: "Thermal Cycling", standard: "MIL-STD-810H Method 503.7", status: "Qualified", testDate: "2025-09-15", reportRef: "SNP-TR-001" },
      { testName: "Random Vibration", standard: "MIL-STD-810H Method 514.8", status: "Qualified", testDate: "2025-10-02", reportRef: "SNP-TR-002" },
      { testName: "EMI/EMC", standard: "MIL-STD-461G", status: "Qualified", testDate: "2025-11-18", reportRef: "SNP-TR-003" },
      { testName: "TID Radiation", standard: "MIL-STD-883 Method 1019.9", status: "Qualified", testDate: "2025-08-20", reportRef: "SNP-TR-004" },
      { testName: "FIPS 140-2 L3 Certification", standard: "FIPS 140-2", status: "Qualified", testDate: "2025-06-30", reportRef: "SNP-CERT-001" },
      { testName: "Tamper Response Verification", standard: "FIPS 140-2 §4.7", status: "Qualified", testDate: "2025-07-15", reportRef: "SNP-TR-020" },
    ],
  },
  {
    moduleId: "psu-red",
    moduleName: "Power Converter (Red)",
    radiation: {
      tidRating: "100 krad(Si)",
      selThreshold: "80 MeV·cm²/mg",
      seeImmunity: "SEL-immune at LET ≥ 80 MeV·cm²/mg",
      annualDose: "~5 krad/yr at 500 km pLEO",
      designLifeTid: "35 krad (7-year mission)",
      margin: "2.86× margin",
      shielding: "3 mm Al equivalent chassis",
      notes: "VPT VSC30 series is rad-hard by design. UT32M0R500 CMC rated to 50 krad.",
    },
    thermal: {
      operatingRange: "−55 °C to +125 °C (full mil range)",
      survivalRange: "−65 °C to +150 °C",
      maxJunctionTemp: "150 °C (converter), 125 °C (CMC)",
      thermalDissipation: "5 W",
      coolingMethod: "Conduction-cooled via wedgelock",
    },
    tests: [
      { testName: "Thermal Cycling", standard: "MIL-STD-810H Method 503.7", status: "Qualified", testDate: "2025-09-15", reportRef: "SNP-TR-001" },
      { testName: "Random Vibration", standard: "MIL-STD-810H Method 514.8", status: "Qualified", testDate: "2025-10-02", reportRef: "SNP-TR-002" },
      { testName: "EMI/EMC (Conducted)", standard: "MIL-STD-461G CE102", status: "Qualified", testDate: "2025-11-18", reportRef: "SNP-TR-003" },
      { testName: "Input Surge", standard: "MIL-STD-1275E", status: "Qualified", testDate: "2025-08-01", reportRef: "SNP-TR-030" },
      { testName: "TID Radiation", standard: "MIL-STD-883 Method 1019.9", status: "Qualified", testDate: "2025-08-20", reportRef: "SNP-TR-004" },
    ],
  },
  {
    moduleId: "psu-black",
    moduleName: "Power Converter (Black)",
    radiation: {
      tidRating: "100 krad(Si)",
      selThreshold: "80 MeV·cm²/mg",
      seeImmunity: "SEL-immune at LET ≥ 80 MeV·cm²/mg",
      annualDose: "~5 krad/yr at 500 km pLEO",
      designLifeTid: "35 krad (7-year mission)",
      margin: "2.86× margin",
      shielding: "3 mm Al equivalent chassis",
      notes: "VPT VSC100 series is rad-hard by design.",
    },
    thermal: {
      operatingRange: "−55 °C to +125 °C (full mil range)",
      survivalRange: "−65 °C to +150 °C",
      maxJunctionTemp: "150 °C",
      thermalDissipation: "6 W",
      coolingMethod: "Conduction-cooled via wedgelock",
    },
    tests: [
      { testName: "Thermal Cycling", standard: "MIL-STD-810H Method 503.7", status: "Qualified", testDate: "2025-09-15", reportRef: "SNP-TR-001" },
      { testName: "Random Vibration", standard: "MIL-STD-810H Method 514.8", status: "Qualified", testDate: "2025-10-02", reportRef: "SNP-TR-002" },
      { testName: "EMI/EMC (Conducted)", standard: "MIL-STD-461G CE102", status: "Qualified", testDate: "2025-11-18", reportRef: "SNP-TR-003" },
      { testName: "Input Surge", standard: "MIL-STD-1275E", status: "Qualified", testDate: "2025-08-01", reportRef: "SNP-TR-030" },
      { testName: "TID Radiation", standard: "MIL-STD-883 Method 1019.9", status: "Qualified", testDate: "2025-08-20", reportRef: "SNP-TR-004" },
    ],
  },
  {
    moduleId: "timing-atomic-clock",
    moduleName: "Timing & Networking Expansion",
    radiation: {
      tidRating: "50 krad(Si)",
      selThreshold: "60 MeV·cm²/mg",
      seeImmunity: "SEL-immune at LET ≥ 60 MeV·cm²/mg",
      annualDose: "~5 krad/yr at 500 km pLEO",
      designLifeTid: "35 krad (7-year mission)",
      margin: "1.43× margin",
      shielding: "3 mm Al equivalent chassis + CSAC local shielding",
      notes: "CSAC module has limited TID data — lot-tested to 50 krad. Acceptable for 7-year pLEO with local spot shielding.",
    },
    thermal: {
      operatingRange: "−40 °C to +85 °C",
      survivalRange: "−55 °C to +105 °C",
      maxJunctionTemp: "85 °C (CSAC thermal limit)",
      thermalDissipation: "13 W",
      coolingMethod: "Conduction-cooled via wedgelock, CSAC has internal oven (self-heated)",
      notes: "CSAC internal oven consumes ~0.12 W. Total 13 W includes CSAC + PTP engine + Ethernet interfaces.",
    },
    tests: [
      { testName: "Thermal Cycling", standard: "MIL-STD-810H Method 503.7", status: "In Progress", notes: "Scheduled completion Q2 2026" },
      { testName: "Random Vibration", standard: "MIL-STD-810H Method 514.8", status: "In Progress", notes: "Scheduled completion Q2 2026" },
      { testName: "EMI/EMC", standard: "MIL-STD-461G", status: "Planned", notes: "Scheduled Q3 2026" },
      { testName: "TID Radiation", standard: "MIL-STD-883 Method 1019.9", status: "Qualified", testDate: "2025-11-01", reportRef: "SNP-TR-040" },
      { testName: "CSAC Stability Under Vibration", standard: "Internal procedure", status: "In Progress", notes: "Measuring Allan deviation during random vibe" },
      { testName: "1PPS Accuracy Verification", standard: "Internal procedure", status: "Qualified", testDate: "2025-12-01", reportRef: "SNP-TR-041" },
    ],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getModuleQualification(moduleId: string): ModuleQualification | undefined {
  return MODULE_QUALIFICATIONS.find((mq) => mq.moduleId === moduleId);
}

export function getQualStatusCounts(): Record<QualStatus, number> {
  const counts: Record<QualStatus, number> = { Qualified: 0, "In Progress": 0, Planned: 0, "N/A": 0, Waiver: 0 };
  for (const mq of MODULE_QUALIFICATIONS) {
    for (const t of mq.tests) {
      counts[t.status]++;
    }
  }
  return counts;
}

export function getModuleQualSummary(moduleId: string): { total: number; qualified: number; inProgress: number; planned: number } {
  const mq = getModuleQualification(moduleId);
  if (!mq) return { total: 0, qualified: 0, inProgress: 0, planned: 0 };
  const tests = mq.tests;
  return {
    total: tests.length,
    qualified: tests.filter((t) => t.status === "Qualified").length,
    inProgress: tests.filter((t) => t.status === "In Progress").length,
    planned: tests.filter((t) => t.status === "Planned").length,
  };
}

export function getMissionEnvironmentById(id: string): MissionEnvironment | undefined {
  return MISSION_ENVIRONMENTS.find((m) => m.id === id);
}
