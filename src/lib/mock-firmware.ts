// ─── Firmware & Software Version Map Data Model ──────────────────────────────

export type FirmwareTarget =
  | "FPGA"         // AMD Versal bitstream
  | "ARM"          // Cortex-A78AE application firmware
  | "CMC"          // UT32M0R500 chassis management controller
  | "Crypto"       // HSM firmware
  | "Boot"         // Bootloader / secure boot
  | "PHY";         // Quad PHY configuration

export type ReleaseStatus = "Released" | "Beta" | "Development" | "Deprecated";

export interface FirmwareRelease {
  id: string;
  target: FirmwareTarget;
  version: string;
  releaseDate: string;
  status: ReleaseStatus;
  compatibleHwRevs: string[];     // e.g., ["Rev C", "Rev D"]
  compatibleBuilds: string[];     // build IDs
  changelog: string[];
  notes?: string;
  updateProcedure?: string;       // brief reference
}

export interface VersionMatrix {
  buildId: string;
  buildName: string;
  versions: Record<FirmwareTarget, string>;   // target → version string
}

// ─── Firmware Releases ────────────────────────────────────────────────────────

export const FIRMWARE_RELEASES: FirmwareRelease[] = [
  // FPGA
  {
    id: "fpga-3.2.1",
    target: "FPGA",
    version: "3.2.1",
    releaseDate: "2026-02-15",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "Added J2 backplane discrete channel routing for 1PPS/10MHz distribution",
      "Fixed PCIe Gen3 link training timeout on cold boot at −40°C",
      "Improved DDR4 EDAC scrub rate (1 scrub/sec → 10 scrubs/sec)",
      "Added MRAM controller interface (replaces NOR Flash controller)",
    ],
    updateProcedure: "Via JTAG (Micro USB debug port) or authenticated OTA update through ARM firmware",
  },
  {
    id: "fpga-3.1.0",
    target: "FPGA",
    version: "3.1.0",
    releaseDate: "2025-11-01",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "Initial MRAM controller support",
      "PCIe Gen3 x4 lane configuration for NVMe SSD",
      "10GbE XGMII interface to Quad PHY",
      "SpaceVPX backplane data plane initialization",
    ],
    notes: "Does not include J2 discrete channel support — use 3.2.1 for J2 builds.",
  },
  {
    id: "fpga-2.0.0",
    target: "FPGA",
    version: "2.0.0",
    releaseDate: "2025-06-15",
    status: "Deprecated",
    compatibleHwRevs: ["Rev B", "Rev C"],
    compatibleBuilds: ["fms-irad"],
    changelog: [
      "Initial FMS IRAD FPGA image",
      "NOR Flash controller (pre-MRAM)",
      "Basic PCIe Gen3 support",
    ],
    notes: "Deprecated — replaced by 3.x series. FMS lab units should be upgraded.",
  },

  // ARM
  {
    id: "arm-2.4.0",
    target: "ARM",
    version: "2.4.0",
    releaseDate: "2026-02-20",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "MRAM boot support — direct boot from MRAM (no flash staging)",
      "Added health telemetry API for CMC over CAN bus",
      "Improved hot-standby switchover time (<150 ms, down from <200 ms)",
      "PTP client for J2 timing synchronization",
      "Kernel security patches (CVE-2025-xxxxx)",
    ],
    updateProcedure: "Authenticated firmware update via CMC CAN command or Micro USB JTAG",
  },
  {
    id: "arm-2.3.0",
    target: "ARM",
    version: "2.3.0",
    releaseDate: "2025-10-15",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "Initial MRAM driver integration",
      "10GbE network stack optimization",
      "Watchdog timer improvements",
    ],
  },

  // CMC
  {
    id: "cmc-1.3.0",
    target: "CMC",
    version: "1.3.0",
    releaseDate: "2026-01-10",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "Added per-slot current monitoring (12-bit ADC, 1 Hz sample rate)",
      "CAN 2.0B message priority update for fault reporting",
      "I²C bus scan for SpaceVPX utility plane module discovery",
      "Power sequencing update for 7-slot chassis (1-indexed)",
    ],
    updateProcedure: "Via MDM-9 serial port (UART) using CMC bootloader",
  },
  {
    id: "cmc-1.2.0",
    target: "CMC",
    version: "1.2.0",
    releaseDate: "2025-08-20",
    status: "Released",
    compatibleHwRevs: ["Rev B", "Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "Initial production CMC firmware",
      "28V input monitoring and OVP/UVP thresholds",
      "Temperature telemetry from on-board ADC",
    ],
  },

  // Crypto
  {
    id: "crypto-4.1.0",
    target: "Crypto",
    version: "4.1.0",
    releaseDate: "2025-12-01",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "fms-irad"],
    changelog: [
      "FIPS 140-2 Level 3 recertification after MRAM change",
      "ACAM key management update for ABE dual-unit configuration",
      "Added cold-spare failover protocol for 2× ACAM",
      "Audit log export format update (v2 schema)",
    ],
    notes: "Required for ABE 2× ACAM configuration. MARCC variant uses crypto-4.0.x.",
  },
  {
    id: "crypto-4.0.2",
    target: "Crypto",
    version: "4.0.2",
    releaseDate: "2025-09-15",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline"],
    changelog: [
      "MARCC crypto configuration",
      "FIPS self-test timing improvement (12 sec → 8 sec)",
      "Key zeroization response time < 10 ms",
    ],
  },

  // Boot
  {
    id: "boot-1.1.0",
    target: "Boot",
    version: "1.1.0",
    releaseDate: "2026-01-15",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "Secure boot chain updated for MRAM (ECDSA P-384 signature verification)",
      "Added fallback boot from redundant MRAM region",
      "Boot time reduced to < 3 seconds (MRAM direct, no flash staging)",
      "Anti-rollback counter stored in MRAM OTP region",
    ],
    updateProcedure: "Via JTAG only — bootloader cannot self-update in the field",
  },

  // PHY
  {
    id: "phy-1.0.2",
    target: "PHY",
    version: "1.0.2",
    releaseDate: "2025-10-01",
    status: "Released",
    compatibleHwRevs: ["Rev C", "Rev D"],
    compatibleBuilds: ["baseline", "customer-a-pleo", "customer-b-pleo", "customer-c-pleo", "fms-irad"],
    changelog: [
      "VSC8504 register configuration for quad GbE mode",
      "RGMII timing adjustment for Versal FPGA interface",
      "Link-down recovery timeout set to 5 seconds",
    ],
    notes: "PHY config is loaded by FPGA at boot — this version tracks the register map revision.",
  },
];

// ─── Per-Build Version Matrix ─────────────────────────────────────────────────

export const VERSION_MATRIX: VersionMatrix[] = [
  {
    buildId: "baseline",
    buildName: "Baseline",
    versions: { FPGA: "3.2.1", ARM: "2.4.0", CMC: "1.3.0", Crypto: "4.0.2", Boot: "1.1.0", PHY: "1.0.2" },
  },
  {
    buildId: "customer-a-pleo",
    buildName: "ABE (pLEO)",
    versions: { FPGA: "3.2.1", ARM: "2.4.0", CMC: "1.3.0", Crypto: "4.1.0", Boot: "1.1.0", PHY: "1.0.2" },
  },
  {
    buildId: "customer-b-pleo",
    buildName: "J2 (pLEO)",
    versions: { FPGA: "3.2.1", ARM: "2.4.0", CMC: "1.3.0", Crypto: "4.1.0", Boot: "1.1.0", PHY: "1.0.2" },
  },
  {
    buildId: "customer-c-pleo",
    buildName: "JL (pLEO)",
    versions: { FPGA: "3.2.1", ARM: "2.4.0", CMC: "1.3.0", Crypto: "4.1.0", Boot: "1.1.0", PHY: "1.0.2" },
  },
  {
    buildId: "fms-irad",
    buildName: "FMS (IRAD)",
    versions: { FPGA: "3.2.1", ARM: "2.4.0", CMC: "1.3.0", Crypto: "4.1.0", Boot: "1.1.0", PHY: "1.0.2" },
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getReleaseById(id: string): FirmwareRelease | undefined {
  return FIRMWARE_RELEASES.find((r) => r.id === id);
}

export function getReleasesByTarget(target: FirmwareTarget): FirmwareRelease[] {
  return FIRMWARE_RELEASES.filter((r) => r.target === target).sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export function getLatestRelease(target: FirmwareTarget): FirmwareRelease | undefined {
  return getReleasesByTarget(target).find((r) => r.status === "Released");
}

export function getVersionMatrixForBuild(buildId: string): VersionMatrix | undefined {
  return VERSION_MATRIX.find((v) => v.buildId === buildId);
}
