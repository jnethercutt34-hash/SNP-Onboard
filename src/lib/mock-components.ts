// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface TechSpec {
  label: string;
  value: string;
}

export interface DatasheetEntry {
  id: string;
  title: string;
  docNumber: string;
  revision: string;
  pages: number;
  /** Simulated AI-generated summary of the datasheet */
  aiSummary: string;
  /** Simulated file size string, e.g. "2.4 MB" */
  fileSize: string;
}

export interface RelatedComponent {
  detailId: string;
  name: string;
  relationship: string;
}

export interface SubModuleRef {
  detailId: string;
  name: string;
  category: string;
  tagline: string;
}

export interface ComponentDetail {
  id: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  overview: string;
  specs: TechSpec[];
  datasheets: DatasheetEntry[];
  related: RelatedComponent[];
  /** On-board sub-modules (e.g. GPP card ICs) that can be navigated to independently */
  subModules?: SubModuleRef[];
}

// ─── Component Catalog ────────────────────────────────────────────────────────

export const COMPONENT_DETAILS: Record<string, ComponentDetail> = {

  "gpp-universal": {
    id: "gpp-universal",
    name: "Universal GPP Card",
    shortName: "GPP Card",
    category: "Processor",
    tagline: "Quad-core ARM Cortex-A78AE · SpaceVPX 3U · Radiation-Hardened",
    overview:
      "The Universal General Purpose Processor (GPP) card is the primary compute element of the SNP platform. Based on the ARM Cortex-A78AE — a radiation-tolerant quad-core processor designed for safety-critical applications — it provides the processing backbone for network switching, cryptographic offload coordination, and in-orbit software execution. Two GPP cards (Red and Black) operate in hot-standby redundancy: Red is the active master while Black mirrors all state. Upon fault detection via the SpaceVPX control plane, the Black card assumes control within 200 ms. Black can alternatively be promoted to co-processing mode for double compute throughput on computationally intensive tasks.",
    specs: [
      { label: "CPU", value: "ARM Cortex-A78AE · Quad-core · 2.6 GHz" },
      { label: "ISA", value: "ARMv8.2-A · Neon · SVE" },
      { label: "Form Factor", value: "3U SpaceVPX (VITA 78)" },
      { label: "Control Plane", value: "PCIe Gen 3 ×4" },
      { label: "Data Plane", value: "Dual 10 Gbps SerDes lanes" },
      { label: "Operating Temp", value: "−40 °C to +85 °C" },
      { label: "Radiation Tolerance", value: "≥ 100 krad (Si) TID" },
      { label: "SEU Mitigation", value: "ECC on caches, hardware scrubbing" },
      { label: "Redundancy", value: "Hot-standby (Red/Black)" },
      { label: "Switchover Latency", value: "< 200 ms" },
      { label: "Power Draw", value: "37–38 W per card" },
      { label: "Weight", value: "320 g" },
      { label: "Thermal Interface", value: "Conduction-cooled via chassis wedge locks" },
    ],
    datasheets: [
      {
        id: "ds-gpp-hw",
        title: "Universal GPP Card Hardware Reference Manual",
        docNumber: "SNP-HW-GPP-001",
        revision: "Rev C",
        pages: 148,
        fileSize: "8.2 MB",
        aiSummary:
          "The Hardware Reference Manual covers the GPP card's PCB architecture, connector pinout (P1/P2 SpaceVPX backplane connectors), power sequencing requirements, and thermal management guidelines. Key sections detail the Cortex-A78AE's memory controller configuration for the on-board LPDDR4X arrays, ECC initialization sequence, and the FPGA reconfiguration interface. The manual specifies that the 28 V primary input must be stable within ±2% before CPU boot assertion, and that thermal dissipation requires chassis conduction cooling with interface resistance < 0.15 °C/W.",
      },
      {
        id: "ds-gpp-sw",
        title: "GPP Board Support Package (BSP) Guide",
        docNumber: "SNP-SW-GPP-002",
        revision: "Rev B",
        pages: 94,
        fileSize: "5.1 MB",
        aiSummary:
          "The BSP Guide documents the Linux 6.1 LTS kernel configuration for the GPP card, including device tree overlays for SpaceVPX endpoint enumeration, the FPGA partial reconfiguration driver (SNP FPGA Manager), and the redundancy manager daemon (snp-redd) that monitors heartbeats and triggers failover. Notable: the BSP ships with a pre-integrated SELinux policy enforcing mandatory access control on cryptographic key paths. The guide includes step-by-step procedures for NVM firmware update, SDRAM ECC scrubbing configuration, and SpaceVPX slot enumeration.",
      },
      {
        id: "ds-gpp-test",
        title: "GPP Environmental Test Report",
        docNumber: "SNP-TST-GPP-003",
        revision: "Rev A",
        pages: 62,
        fileSize: "3.8 MB",
        aiSummary:
          "Documents MIL-STD-810H environmental qualification results for the GPP card: vibration (20–2000 Hz, 7.7 g RMS), thermal cycling (−55 °C to +125 °C, 100 cycles), and thermal vacuum (10−5 torr, 8-hour dwell). Radiation test results show TID tolerance at 105 krad(Si) with no functional failures. SEL testing confirmed no latch-up events at 75 MeV·cm²/mg LET. All tests conducted at NRL-certified lab; unit-level pass results are documented with lot traceability.",
      },
    ],
    related: [
      { detailId: "sdram-16gb", name: "16 GB SDRAM", relationship: "On-board memory" },
      { detailId: "nvm-flash-2gb", name: "2 Gb NVM Flash", relationship: "On-board storage" },
      { detailId: "fpga-1m5-slc", name: "FPGA — 1.5M SLC", relationship: "On-board co-processor" },
      { detailId: "optical-10g", name: "10G Optical Interface", relationship: "On-board networking" },
      { detailId: "quad-phy-1g", name: "1G Quad PHY", relationship: "On-board management NIC" },
      { detailId: "crypto-unit", name: "Crypto Processing Unit", relationship: "Cryptographic offload target" },
    ],
    subModules: [
      {
        detailId: "sdram-16gb",
        name: "16 GB SDRAM",
        category: "Memory",
        tagline: "LPDDR4X · Hardware ECC · 34 GB/s bandwidth",
      },
      {
        detailId: "nvm-flash-2gb",
        name: "2 Gb NVM Flash",
        category: "Storage",
        tagline: "SPI NOR · Firmware & bitstream storage · 256 MB",
      },
      {
        detailId: "fpga-1m5-slc",
        name: "FPGA — 1.5M SLC",
        category: "FPGA",
        tagline: "Pipelined FFT · Reed-Solomon FEC · Partial reconfig",
      },
      {
        detailId: "optical-10g",
        name: "10G Optical Interface",
        category: "Networking",
        tagline: "Quad-channel SFP+ · 1310 nm · 40 Gbps aggregate",
      },
      {
        detailId: "quad-phy-1g",
        name: "1G Quad PHY",
        category: "Networking",
        tagline: "4-port GbE · Management & control plane",
      },
    ],
  },

  "crypto-unit": {
    id: "crypto-unit",
    name: "Cryptographic Processing Unit",
    shortName: "Crypto Unit",
    category: "Cryptography",
    tagline: "FIPS 140-2 Level 3 · Hardware-Accelerated · Dual-GPP Offload",
    overview:
      "The Cryptographic Processing Unit (CPU) is a dedicated hardware security module integrated into the SNP platform. It provides AES-256-GCM bulk encryption, SHA-3 hashing, ECC P-384 key exchange, and RSA-4096 signature verification at line rate without loading the GPP processors. The unit maintains a FIPS 140-2 Level 3 validated key store with physical tamper detection: any breach of the module boundary triggers immediate zeroization of all key material. It serves both GPP cards simultaneously via a dedicated SpaceVPX utility plane connection, ensuring cryptographic services remain available even during GPP failover.",
    specs: [
      { label: "Certification", value: "FIPS 140-2 Level 3 (pending Level 4 upgrade)" },
      { label: "Symmetric Cipher", value: "AES-256-GCM · AES-256-CBC · ChaCha20-Poly1305" },
      { label: "Hash Functions", value: "SHA-2 (256/384/512) · SHA-3 · HMAC" },
      { label: "Asymmetric Crypto", value: "ECC P-256/P-384 · RSA-2048/4096 · X25519" },
      { label: "AES Throughput", value: "40 Gbps (GCM mode)" },
      { label: "Key Storage", value: "512 × 256-bit hardware slots" },
      { label: "RNG", value: "SP 800-90B compliant TRNG + DRBG" },
      { label: "Tamper Response", value: "Active mesh + voltage sensing → zeroize < 1 µs" },
      { label: "Interface", value: "SpaceVPX Utility Plane (dedicated)" },
      { label: "Power Draw", value: "10 W" },
      { label: "Weight", value: "130 g" },
      { label: "Zeroization Time", value: "< 1 µs (hardware-triggered)" },
    ],
    datasheets: [
      {
        id: "ds-crypto-hw",
        title: "Cryptographic Processing Unit Hardware Manual",
        docNumber: "SNP-HW-CPU-001",
        revision: "Rev D",
        pages: 112,
        fileSize: "6.5 MB",
        aiSummary:
          "The hardware manual details the CPU's internal architecture: a custom ASIC implementing AES-256-GCM and SHA-3 pipeline cores, a hardware TRNG seeded by ring oscillator entropy, and the key management unit (KMU) with battery-backed key RAM. The tamper detection section describes the active mesh layer that monitors for probing attempts and the voltage/temperature trip points that trigger zeroization. Connector assignments show the utility plane interface uses a dedicated P0 connector on the SpaceVPX backplane, isolated from the data plane.",
      },
      {
        id: "ds-crypto-fips",
        title: "FIPS 140-2 Security Policy",
        docNumber: "SNP-SEC-CPU-002",
        revision: "Rev B",
        pages: 44,
        fileSize: "2.1 MB",
        aiSummary:
          "The FIPS 140-2 Security Policy is the publicly releasable subset of the validation documentation. It defines the module boundary (hardware + firmware), lists approved algorithms with caveat certificate numbers (AES Cert #C1847, SHA Cert #C1848, ECDSA Cert #C1849), describes the Crypto Officer and User roles, and enumerates all CSPs (Critical Security Parameters) and the conditions under which they are zeroized. The policy documents self-tests executed on power-on: known-answer tests for AES, SHA, HMAC, and ECDSA, and continuous RNG health tests.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Primary service consumer" },
      { detailId: "psu-black", name: "Power Converter (Black)", relationship: "Primary power source (+5V rail)" },
    ],
  },

  "psu-red": {
    id: "psu-red",
    name: "Power Converter (Red)",
    shortName: "PSU Red",
    category: "Power",
    tagline: "28 V Input · Rad-Tolerant · Red-Side Power Distribution",
    overview:
      "The Red Power Converter is a 28 V primary-input DC/DC brick that powers the Red GPP card and its associated peripherals. It is responsible for the +3.3V_AUX standby rail (maintained even during sleep states), the +3.3V logic rail for FPGA I/O and memory, and the +5V peripheral rail for PHY transceivers and minor board ICs. The converter is radiation-tolerant and operates independently from the Black converter to preserve fault isolation: a failure on the Red side does not impact the Black side.",
    specs: [
      { label: "Input Voltage", value: "28 V DC (MIL-STD-1275D compliant)" },
      { label: "Input Range", value: "16 V – 40 V (transient protected)" },
      { label: "Output Rails", value: "+3.3V_AUX, +3.3V, +5V" },
      { label: "+3.3V_AUX Current", value: "500 mA (always-on standby)" },
      { label: "+3.3V Current", value: "10 A max" },
      { label: "+5V Current", value: "4 A max" },
      { label: "Efficiency", value: "≥ 88% at full load" },
      { label: "Regulation", value: "±1% line/load" },
      { label: "Ripple (max)", value: "50 mV p-p" },
      { label: "Inrush Limiting", value: "Soft-start, 5 ms ramp" },
      { label: "Protection", value: "OVP, UVP, OCP, OTP" },
      { label: "Radiation Tolerance", value: "50 krad (Si) TID" },
      { label: "Power Draw", value: "5 W (self-consumption)" },
      { label: "Weight", value: "140 g" },
    ],
    datasheets: [
      {
        id: "ds-psu-red-hw",
        title: "Power Converter (Red) Hardware Reference",
        docNumber: "SNP-HW-PSR-001",
        revision: "Rev B",
        pages: 76,
        fileSize: "4.2 MB",
        aiSummary:
          "This manual covers the Red PSU's topology (dual-phase synchronous buck for +3.3V, single-phase for +5V and AUX), component selection rationale for radiation tolerance (use of radiation-hardened FETs and ceramic capacitors), and EMI filter design. The sequencing section is critical: +3.3V_AUX must be valid before +3.3V, and +3.3V must reach 90% of setpoint before +5V enables. A separate table documents the overcurrent trip thresholds per rail and the latching vs. auto-retry behavior. The manual also covers SpaceVPX utility plane monitoring interface for telemetry readback (voltage, current, temperature).",
      },
      {
        id: "ds-psu-red-qual",
        title: "Red PSU Qualification Test Report",
        docNumber: "SNP-TST-PSR-002",
        revision: "Rev A",
        pages: 38,
        fileSize: "2.0 MB",
        aiSummary:
          "The qualification test report documents load transient testing (50% step at 1 A/µs), thermal performance at −40 °C and +85 °C operating extremes, and TID radiation exposure testing up to 55 krad(Si). Efficiency measurements at 25%, 50%, 75%, and 100% load are tabulated at three input voltage corners (16 V, 28 V, 40 V). No derating failures were observed across the qualification matrix. EMI conducted emissions are shown to meet MIL-STD-461G CE102 limits.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card (Red)", relationship: "Primary load" },
      { detailId: "psu-black", name: "Power Converter (Black)", relationship: "Black-side counterpart" },
    ],
  },

  "psu-black": {
    id: "psu-black",
    name: "Power Converter (Black)",
    shortName: "PSU Black",
    category: "Power",
    tagline: "28 V Input · +12V Backplane Rail · Black-Side Power Distribution",
    overview:
      "The Black Power Converter mirrors the Red converter's output rails (+3.3V_AUX, +3.3V, +5V) and uniquely adds the +12V high-power rail used exclusively by the SpaceVPX backplane and the Cryptographic Processing Unit. Because the +12V rail is safety-critical — its failure would disable the Crypto Unit — the Black PSU uses an additional output-stage monitoring circuit with 100 µs fault detection and automatic load shedding. The Black PSU operates fully independently from the Red PSU, preserving dual-failure isolation at the power distribution level.",
    specs: [
      { label: "Input Voltage", value: "28 V DC (MIL-STD-1275D compliant)" },
      { label: "Input Range", value: "16 V – 40 V (transient protected)" },
      { label: "Output Rails", value: "+3.3V_AUX, +3.3V, +5V, +12V" },
      { label: "+3.3V_AUX Current", value: "500 mA (always-on standby)" },
      { label: "+3.3V Current", value: "10 A max" },
      { label: "+5V Current", value: "4 A max" },
      { label: "+12V Current", value: "3 A max (backplane + Crypto Unit)" },
      { label: "+12V Fault Detection", value: "100 µs (hardware monitor)" },
      { label: "Efficiency", value: "≥ 87% at full load" },
      { label: "Regulation", value: "±1% line/load" },
      { label: "Ripple (max)", value: "50 mV p-p (+3.3V/+5V), 100 mV p-p (+12V)" },
      { label: "Protection", value: "OVP, UVP, OCP, OTP per rail" },
      { label: "Radiation Tolerance", value: "50 krad (Si) TID" },
      { label: "Power Draw", value: "6 W (self-consumption)" },
      { label: "Weight", value: "155 g" },
    ],
    datasheets: [
      {
        id: "ds-psu-black-hw",
        title: "Power Converter (Black) Hardware Reference",
        docNumber: "SNP-HW-PSB-001",
        revision: "Rev B",
        pages: 84,
        fileSize: "4.7 MB",
        aiSummary:
          "This manual extends the Red PSU reference with documentation of the +12V rail, including its boost converter topology, the dedicated output-stage monitor ASIC, and the fault isolation relay that disconnects the backplane in the event of a +12V fault. The sequencing table is extended: +12V must be the last rail to enable (after +5V) and first to disable during power-down. The Crypto Unit's 12 V power path is shown in a separate schematic excerpt. Thermal derating curves show the Black PSU requires chassis conduction cooling identical to the Red PSU.",
      },
      {
        id: "ds-psu-black-qual",
        title: "Black PSU Qualification Test Report",
        docNumber: "SNP-TST-PSB-002",
        revision: "Rev A",
        pages: 42,
        fileSize: "2.2 MB",
        aiSummary:
          "Qualification results for the Black PSU, covering all four output rails across the full temperature and input voltage range. The +12V rail's 100 µs fault detection time was verified via hardware fault injection. Cross-rail isolation was tested by shorting each output individually — no secondary rail disruption was observed. Radiation testing at 55 krad(Si) TID showed no performance degradation. EMI results comply with MIL-STD-461G CE102 and RE102.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card (Black)", relationship: "Primary load" },
      { detailId: "crypto-unit", name: "Cryptographic Processing Unit", relationship: "+12V consumer" },
      { detailId: "psu-red", name: "Power Converter (Red)", relationship: "Red-side counterpart" },
    ],
  },

  "sdram-16gb": {
    id: "sdram-16gb",
    name: "16 GB SDRAM (LPDDR4X)",
    shortName: "16 GB SDRAM",
    category: "Memory",
    tagline: "LPDDR4X · Hardware ECC · Radiation-Tolerant · On-Board GPP",
    overview:
      "The 16 GB LPDDR4X SDRAM array is integrated directly onto each GPP card and provides the primary working memory for the ARM Cortex-A78AE processor. Hardware Error Correction Code (ECC) is always active: single-bit errors are corrected in-line (SECDED algorithm) and double-bit errors are flagged as unrecoverable. The memory controller performs periodic background scrubbing to prevent accumulation of corrected errors. The LPDDR4X interface runs at 4266 MT/s (LPDDR4X-4266), providing 34 GB/s theoretical peak bandwidth split across two 32-bit channels.",
    specs: [
      { label: "Capacity", value: "16 GB (2 × 8 GB dies)" },
      { label: "Interface", value: "LPDDR4X · Dual-channel · 32-bit per channel" },
      { label: "Speed Grade", value: "LPDDR4X-4266 (4266 MT/s)" },
      { label: "Peak Bandwidth", value: "34.1 GB/s" },
      { label: "ECC", value: "SECDED hardware ECC · always-on" },
      { label: "Scrubbing", value: "Background periodic scrub, configurable interval" },
      { label: "Operating Voltage", value: "1.1 V (LPDDR4X)" },
      { label: "Operating Temp", value: "−40 °C to +95 °C (junction)" },
      { label: "Radiation Tolerance", value: "≥ 100 krad (Si) TID" },
      { label: "SEU LET Threshold", value: "> 15 MeV·cm²/mg" },
      { label: "Package", value: "BGA · on-board (not socketed)" },
    ],
    datasheets: [
      {
        id: "ds-sdram-component",
        title: "LPDDR4X SDRAM Component Datasheet",
        docNumber: "SNP-DS-MEM-001",
        revision: "Rev E",
        pages: 210,
        fileSize: "11.4 MB",
        aiSummary:
          "This component-level datasheet covers AC and DC electrical specifications for the LPDDR4X die, including detailed timing parameters (tRCD, tRAS, tRP, tRC) across the temperature range. The radiation section documents TID test methodology per JEDEC JESD57 and SEU characterization using heavy-ion testing. The datasheet includes recommended decoupling capacitor placement and PCB trace length/impedance guidelines for the differential data/command bus. The ECC scheme is described as SECDED (72-bit codeword over 64-bit data) implemented in the memory controller, not the DRAM die itself.",
      },
      {
        id: "ds-sdram-integration",
        title: "GPP Memory Subsystem Integration Note",
        docNumber: "SNP-AN-MEM-002",
        revision: "Rev B",
        pages: 28,
        fileSize: "1.6 MB",
        aiSummary:
          "Application note covering the integration of LPDDR4X onto the GPP card, including the memory controller (part of the SoC) configuration registers for ECC enable, scrub rate, and error logging. Describes the software API for reading ECC error counters via the /sys/devices/ sysfs interface on the Linux BSP. Provides guidance on memory test at power-on using the built-in memory BIST and expected test duration (< 2 s for full 16 GB sweep at test speed).",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Host processor" },
      { detailId: "nvm-flash-2gb", name: "2 Gb NVM Flash", relationship: "Co-resident on-board storage" },
      { detailId: "fpga-1m5-slc", name: "FPGA — 1.5M SLC", relationship: "Co-resident on-board FPGA" },
    ],
  },

  "nvm-flash-2gb": {
    id: "nvm-flash-2gb",
    name: "2 Gb NVM Flash",
    shortName: "NVM Flash",
    category: "Storage",
    tagline: "SPI NOR Flash · Firmware & Config · Radiation-Tolerant · On-Board GPP",
    overview:
      "The 2 Gb (256 MB) NVM Flash device is a SPI NOR flash integrated on each GPP card, serving as non-volatile storage for the boot firmware (U-Boot), Linux kernel image, device tree blobs, and FPGA bitstream(s). Its radiation-tolerant design ensures configuration survives the full mission dose without data corruption. The flash is write-protected by hardware during normal operation and can only be updated through the authenticated firmware update procedure, preventing unauthorized software installation.",
    specs: [
      { label: "Capacity", value: "2 Gb (256 MB)" },
      { label: "Technology", value: "SPI NOR Flash" },
      { label: "Interface", value: "Octal SPI (OSPI) · up to 200 MHz" },
      { label: "Read Throughput", value: "200 MB/s (Octal DDR mode)" },
      { label: "Write Endurance", value: "100,000 program/erase cycles" },
      { label: "Data Retention", value: "20 years at 85 °C" },
      { label: "Write Protection", value: "Hardware WP pin + OTP sector locking" },
      { label: "ECC", value: "On-chip 1-bit ECC per 256-byte sector" },
      { label: "Operating Voltage", value: "1.8 V" },
      { label: "Operating Temp", value: "−55 °C to +125 °C" },
      { label: "Radiation Tolerance", value: "≥ 100 krad (Si) TID" },
      { label: "Package", value: "BGA · on-board (not socketed)" },
    ],
    datasheets: [
      {
        id: "ds-nvm-component",
        title: "2 Gb SPI NOR Flash Component Datasheet",
        docNumber: "SNP-DS-NVM-001",
        revision: "Rev C",
        pages: 156,
        fileSize: "7.9 MB",
        aiSummary:
          "The component datasheet covers all operating modes: Standard SPI, Dual SPI, Quad SPI, and Octal SPI (both SDR and DDR). Timing diagrams for read, program, and erase operations are provided with min/max parameters across temperature. The radiation section documents TID test results and includes a burn-in procedure for post-irradiation recovery. OTP sector map shows 512 bytes of one-time programmable area used by the SNP platform for device identity storage. The write protection register bit definitions and hardware WP pin behavior are detailed in section 6.",
      },
      {
        id: "ds-nvm-fw-update",
        title: "NVM Firmware Update Procedure",
        docNumber: "SNP-PROC-NVM-002",
        revision: "Rev A",
        pages: 22,
        fileSize: "1.1 MB",
        aiSummary:
          "Describes the authenticated firmware update process for the SNP platform. The procedure requires a signed firmware image (ECDSA P-384 signature verified by the Crypto Unit before any write begins), a dedicated update partition to hold the new image before commit, and a multi-stage verification: hash check of the new image, write to update partition, verify write, atomic swap of boot pointers, and reboot. The process is designed to be power-fail safe: an interrupted update reverts to the previous image on next boot.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Host processor" },
      { detailId: "sdram-16gb", name: "16 GB SDRAM", relationship: "Runtime memory counterpart" },
      { detailId: "fpga-1m5-slc", name: "FPGA — 1.5M SLC", relationship: "Bitstream source" },
      { detailId: "crypto-unit", name: "Crypto Processing Unit", relationship: "Validates firmware signatures" },
    ],
  },

  "fpga-1m5-slc": {
    id: "fpga-1m5-slc",
    name: "FPGA — 1.5M SLC",
    shortName: "FPGA",
    category: "FPGA",
    tagline: "1.5M SLC · FFT Core · Reed-Solomon FEC · Partial Reconfiguration",
    overview:
      "The 1.5M SLC (Single-Level Cell) FPGA is the signal processing engine on each GPP card. It implements pipelined FFT cores for wideband spectral analysis and a Reed-Solomon FEC codec for forward error correction on incoming data streams. The FPGA supports partial reconfiguration: specific functional regions of the bitstream can be updated in-orbit without halting the entire device, allowing algorithm updates or new waveform implementations to be deployed as mission requirements evolve. All FPGA configuration bitstreams are stored in the co-resident NVM Flash.",
    specs: [
      { label: "Logic Elements", value: "1.5M SLC (Single-Level Cell)" },
      { label: "Technology", value: "SRAM-based (radiation-mitigated)" },
      { label: "SEU Mitigation", value: "TMR on critical configuration bits + scrubbing" },
      { label: "DSP Slices", value: "2,400 × 18×18 multipliers" },
      { label: "Block RAM", value: "72 Mb on-chip BRAM" },
      { label: "FFT Core", value: "Pipelined, 4096-point, streaming" },
      { label: "FEC Codec", value: "Reed-Solomon (255, 223) GF(2⁸)" },
      { label: "Partial Reconfig", value: "Supported — region-based PR" },
      { label: "Config Interface", value: "OSPI from on-board NVM Flash" },
      { label: "Config Time", value: "< 500 ms (full bitstream)" },
      { label: "I/O Banks", value: "24 × HP I/O banks · LVDS supported" },
      { label: "Operating Temp", value: "−40 °C to +100 °C (junction)" },
      { label: "Radiation Tolerance", value: "≥ 100 krad (Si) TID (design-dependent)" },
    ],
    datasheets: [
      {
        id: "ds-fpga-component",
        title: "1.5M SLC FPGA Device Datasheet",
        docNumber: "SNP-DS-FPGA-001",
        revision: "Rev D",
        pages: 380,
        fileSize: "19.2 MB",
        aiSummary:
          "This comprehensive device datasheet covers the FPGA family architecture: CLB structure, DSP slice cascade capabilities, BRAM modes (simple/true dual-port, FIFO), and high-speed serial transceiver (GTH) specifications up to 32.75 Gbps. The radiation section documents both TID and SEU test results with TMR implementation guidelines for mission-critical logic. Configuration interfaces are covered in detail: OSPI master/slave modes, SelectMAP, and JTAG. The datasheet includes power estimation guidelines and the recommended external VCCAUX/VCCO sequencing requirements that the GPP card's PSU must observe.",
      },
      {
        id: "ds-fpga-pr",
        title: "FPGA Partial Reconfiguration Application Note",
        docNumber: "SNP-AN-FPGA-002",
        revision: "Rev B",
        pages: 54,
        fileSize: "3.2 MB",
        aiSummary:
          "Documents the workflow for deploying partial reconfiguration bitstreams to the SNP FPGA. The static region (containing the configuration controller, ICAP interface, and SpaceVPX AXI interconnect) is always present; reconfigurable partitions (RP0: FFT/DSP, RP1: FEC codec, RP2: mission-specific logic) can be updated independently. The application note covers PR bitstream generation from Vivado, the SNP FPGA Manager Linux driver that manages ICAP writes, and verification steps (readback CRC). A detailed timing analysis shows RP updates complete in < 80 ms per partition at the nominal ICAP clock rate.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Host processor & config master" },
      { detailId: "nvm-flash-2gb", name: "NVM Flash", relationship: "Bitstream storage" },
      { detailId: "sdram-16gb", name: "16 GB SDRAM", relationship: "DMA target for processed data" },
    ],
  },

  "optical-10g": {
    id: "optical-10g",
    name: "10G Optical Interface",
    shortName: "10G Optical",
    category: "Networking",
    tagline: "Quad-Channel · SFP+ · 1310 nm · 10 Gbps per Lane",
    overview:
      "The 10G Optical Interface is a quad-channel fiber-optic networking module integrated on each GPP card. It provides four independent 10 Gbps full-duplex lanes at 1310 nm wavelength using SFP+ form-factor cages, supporting both single-mode and multi-mode fiber. Total aggregate bandwidth is 40 Gbps per GPP card (80 Gbps across both GPP cards). The optical interface handles high-throughput data-plane traffic including sensor data ingestion, inter-satellite links (ISL), and ground-station downlink buffering. For pLEO missions where fiber connectivity is not required, the interface can be replaced with the 10 Gbps copper module.",
    specs: [
      { label: "Channels", value: "4 × SFP+ cages (quad-channel)" },
      { label: "Per-Lane Speed", value: "10 Gbps full-duplex" },
      { label: "Aggregate BW", value: "40 Gbps (4 × 10 Gbps)" },
      { label: "Wavelength", value: "1310 nm" },
      { label: "Fiber Type", value: "Single-mode (SMF) preferred, MMF supported" },
      { label: "Reach (SMF)", value: "Up to 10 km" },
      { label: "Reach (MMF)", value: "Up to 300 m (OM3)" },
      { label: "Tx Power", value: "−1 dBm to +3 dBm" },
      { label: "Rx Sensitivity", value: "−14 dBm (BER < 10−12)" },
      { label: "Protocol", value: "10GBASE-SR / 10GBASE-LR (per IEEE 802.3)" },
      { label: "MAC", value: "Integrated in FPGA (10G Ethernet MAC core)" },
      { label: "Operating Temp", value: "−40 °C to +85 °C" },
    ],
    datasheets: [
      {
        id: "ds-optical-hw",
        title: "10G Optical Interface Integration Guide",
        docNumber: "SNP-HW-OPT-001",
        revision: "Rev C",
        pages: 88,
        fileSize: "5.0 MB",
        aiSummary:
          "Integration guide covering SFP+ cage mechanical specifications, optical connector types (LC duplex), and fiber management recommendations for space environments (radiation-resistant optical fiber grades). The SFP+ management interface (I²C-based DDM/DOM) is documented with register maps for monitoring optical power, laser bias current, and temperature. A section covers the FPGA 10G Ethernet MAC configuration registers and the DMA descriptor ring structure used by the GPP Linux driver (snp-10g-eth driver) for zero-copy packet transfer to SDRAM.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Host card" },
      { detailId: "fpga-1m5-slc", name: "FPGA — 1.5M SLC", relationship: "Implements 10G MAC cores" },
      { detailId: "quad-phy-1g", name: "1G Quad PHY", relationship: "Management plane complement" },
    ],
  },

  "quad-phy-1g": {
    id: "quad-phy-1g",
    name: "1G Quad PHY",
    shortName: "1G Quad PHY",
    category: "Networking",
    tagline: "4-Port GbE · 1000BASE-T · Management & Control Plane",
    overview:
      "The 1G Quad PHY is a four-port Gigabit Ethernet physical-layer transceiver integrated on each GPP card. It provides the management and control-plane network interfaces used for low-speed telemetry, command & control (C2), inter-module management traffic, and ground station uplink/downlink of configuration data. Unlike the 10G optical interface used for high-throughput data-plane traffic, the 1G Quad PHY operates over copper (RJ-45 or board-level connector) and requires no fiber management. All four ports are independently configurable for speed (10/100/1000) and duplex.",
    specs: [
      { label: "Ports", value: "4 × independent GbE ports" },
      { label: "Speed", value: "10/100/1000BASE-T (auto-negotiation)" },
      { label: "Interface to SoC", value: "RGMII (per port)" },
      { label: "Cable Type", value: "Cat-5e or better (for 1000BASE-T)" },
      { label: "Cable Reach", value: "100 m (1000BASE-T per IEEE 802.3ab)" },
      { label: "EEE", value: "IEEE 802.3az (Energy Efficient Ethernet)" },
      { label: "MDIO", value: "Clause 22 and Clause 45" },
      { label: "LEDs", value: "Per-port Link/Activity (configurable)" },
      { label: "Wake-on-LAN", value: "Supported" },
      { label: "Operating Voltage", value: "3.3 V (I/O) / 1.0 V (core)" },
      { label: "Operating Temp", value: "−40 °C to +85 °C" },
      { label: "Package", value: "QFN-64 · on-board" },
    ],
    datasheets: [
      {
        id: "ds-phy-component",
        title: "Quad GbE PHY Component Datasheet",
        docNumber: "SNP-DS-PHY-001",
        revision: "Rev B",
        pages: 164,
        fileSize: "8.8 MB",
        aiSummary:
          "The PHY datasheet covers all four-port configurations, RGMII timing requirements (2 ns setup/hold at the SoC interface), auto-negotiation state machine detail, and loopback test modes (near-end, far-end). The Energy Efficient Ethernet section documents LPI (Low Power Idle) entry/exit timing. Register map covers the full MDIO address space including extended registers for cable diagnostics (TDR-based) and port mirroring. A separate power table shows per-port power consumption as a function of link speed and cable condition, ranging from 120 mW (idle) to 750 mW (1000BASE-T full load).",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Host card" },
      { detailId: "optical-10g", name: "10G Optical Interface", relationship: "Data-plane complement" },
    ],
  },

  "net-10g-copper": {
    id: "net-10g-copper",
    name: "10 Gbps Copper Networking",
    shortName: "10G Copper",
    category: "Networking",
    tagline: "Dual-Channel · 10GBASE-T · pLEO SWaP-C Optimized",
    overview:
      "The 10 Gbps Copper Networking module is a standalone expansion card used in Customer A's pLEO configuration as a lower-SWaP-C alternative to fiber-optic networking. It provides dual-channel 10GBASE-T Ethernet over standard copper cabling (Cat-6A or better), eliminating the need for SFP+ transceivers and optical fiber management while maintaining 10 Gbps throughput per channel. The reduced radiation-hardening overhead compared to the optical interface makes it cost-effective for proliferated LEO constellations where individual unit radiation exposure is lower than GEO or deep-space missions.",
    specs: [
      { label: "Channels", value: "2 × 10GBASE-T (dual-channel)" },
      { label: "Per-Lane Speed", value: "10 Gbps full-duplex" },
      { label: "Aggregate BW", value: "20 Gbps" },
      { label: "Cable Type", value: "Cat-6A or Cat-7 (shielded)" },
      { label: "Cable Reach", value: "100 m at 10 Gbps" },
      { label: "Protocol", value: "10GBASE-T (IEEE 802.3an)" },
      { label: "Connector", value: "Shielded RJ-45 (2 × per module)" },
      { label: "Form Factor", value: "3U SpaceVPX expansion slot" },
      { label: "Power Draw", value: "3 W" },
      { label: "Weight", value: "90 g" },
      { label: "Operating Temp", value: "−40 °C to +85 °C" },
      { label: "Radiation Tolerance", value: "30 krad (Si) TID" },
    ],
    datasheets: [
      {
        id: "ds-copper-hw",
        title: "10G Copper Networking Module Hardware Manual",
        docNumber: "SNP-HW-COP-001",
        revision: "Rev A",
        pages: 58,
        fileSize: "3.1 MB",
        aiSummary:
          "The hardware manual covers the 10GBASE-T PHY IC selection (Aquantia AQR113C-based design), PCB layout guidelines for 10G differential pair routing, and shielding requirements for the RJ-45 connectors in radiation environments. The module interfaces to the GPP card's FPGA via the SpaceVPX data plane using 10G Ethernet MAC cores. Power management registers allow per-port low-power mode when a link is not active. A comparison table with the optical 10G interface quantifies the SWaP-C trade: −5 W, −230 g vs. optical at the cost of 30 krad vs. 100 krad TID tolerance.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Host processor" },
      { detailId: "optical-10g", name: "10G Optical Interface", relationship: "High-rad alternative" },
    ],
  },

  "timing-atomic-clock": {
    id: "timing-atomic-clock",
    name: "Timing & Networking Expansion (Atomic Clock)",
    shortName: "Atomic Clock",
    category: "Expansion",
    tagline: "CSAC · Nanosecond Sync · GPS-Independent · GEO Missions",
    overview:
      "The Timing & Networking Expansion module integrates a chip-scale atomic clock (CSAC) to provide nanosecond-class time synchronization for GEO orbital operations where GPS signal availability is intermittent or unavailable. The CSAC maintains timing accuracy independently of external references, with drift of < 100 ns/day after GPS holdover. This is essential for time-division multiplexing (TDM) protocols, precision navigation solutions, and cryptographic timestamp binding. The module also provides additional networking expansion capability for GEO missions with higher data-plane connectivity requirements.",
    specs: [
      { label: "Clock Technology", value: "CSAC (Chip-Scale Atomic Clock) — Cesium" },
      { label: "Frequency Output", value: "10 MHz reference + 1 PPS" },
      { label: "GPS Holdover Accuracy", value: "< 100 ns/day (2σ)" },
      { label: "Warm-Up Time", value: "< 3 minutes to full accuracy" },
      { label: "Allan Deviation", value: "< 3×10−10 at τ = 1 s" },
      { label: "Phase Noise", value: "−130 dBc/Hz at 1 Hz offset" },
      { label: "GNSS Input", value: "GPS L1/L2 + GLONASS (optional)" },
      { label: "Time Distribution", value: "PTP IEEE 1588v2 (Grandmaster capable)" },
      { label: "Networking", value: "Dual GbE ports (expansion)" },
      { label: "Form Factor", value: "3U SpaceVPX expansion slot" },
      { label: "Power Draw", value: "13 W (CSAC: 120 mW, rest: 12.88 W)" },
      { label: "Weight", value: "275 g" },
      { label: "Operating Temp", value: "−40 °C to +85 °C" },
    ],
    datasheets: [
      {
        id: "ds-atomic-hw",
        title: "Timing & Networking Expansion Hardware Reference",
        docNumber: "SNP-HW-TMG-001",
        revision: "Rev B",
        pages: 96,
        fileSize: "5.4 MB",
        aiSummary:
          "The hardware reference covers the CSAC module integration (Microsemi SA.45s-based design), 10 MHz and 1 PPS output conditioning circuitry, and the GNSS receiver front-end. The PTP grandmaster implementation is documented with synchronization hierarchy diagrams showing how time is distributed to both GPP cards and optionally to payloads via the SpaceVPX utility plane. Section 4 covers the dual GbE expansion ports (shared RGMII to the GPP FPGA), their intended use for GEO mission-specific connectivity, and connector assignments on the SpaceVPX P2 connector.",
      },
      {
        id: "ds-atomic-csac",
        title: "CSAC Performance Characterization Report",
        docNumber: "SNP-TST-TMG-002",
        revision: "Rev A",
        pages: 34,
        fileSize: "2.0 MB",
        aiSummary:
          "Characterization results for the CSAC in the SNP thermal environment. Frequency stability vs. temperature curves are provided for the −40 °C to +85 °C range, showing Allan deviation remains < 5×10−10 across the full range. Holdover accuracy tests simulated GPS signal loss for 24, 48, and 72 hours; cumulative timing error remained < 72 ns, 155 ns, and 240 ns respectively (all within the < 100 ns/day specification). Radiation testing at 50 krad(Si) showed no measurable degradation in frequency accuracy.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card", relationship: "Time consumer (PTP client)" },
      { detailId: "crypto-unit", name: "Crypto Processing Unit", relationship: "Uses timestamps for replay protection" },
    ],
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getComponentById(id: string): ComponentDetail | undefined {
  return COMPONENT_DETAILS[id];
}

export function getAllComponentIds(): string[] {
  return Object.keys(COMPONENT_DETAILS);
}
