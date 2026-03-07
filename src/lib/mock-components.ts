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
  /** AI-generated summary of the datasheet */
  aiSummary: string;
  /** File size string, e.g. "2.4 MB" */
  fileSize: string;
  /** Path to the served PDF (relative to /public), if available */
  file?: string;
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
      {
        id: "ds-gpp-cmc",
        title: "UT32M0R500 32-Bit ARM Cortex-M0+ Microcontroller Datasheet",
        docNumber: "5962-17212",
        revision: "Released 05/17/2022",
        pages: 46,
        fileSize: "5.9 MB",
        file: "/datasheets/Datasheet-UT32M0R500.pdf",
        aiSummary:
          "The CAES UT32M0R500 is the radiation-hardened ARM Cortex-M0+ microcontroller used for SpaceVPX chassis management on the GPP card — handling telemetry, health monitoring, CAN bus control, and distributed command/control. It integrates 96 KB dual-port SRAM with EDAC scrubbing, 64 Mb Flash, dual CAN 2.0B, UART, SPI, I²C, JTAG, and a 12-bit ADC in a 143-pin ceramic LGA (14.5 × 14.5 mm), rated −55 °C to +105 °C with 50 krad(Si) TID tolerance and SEL immunity at ≤ 80 MeV·cm²/mg. QML Q and Q+ qualified per SMD 5962-17212.",
      },
    ],
    related: [
      { detailId: "sdram-16gb",   name: "16 GB SDRAM",          relationship: "On-board memory" },
      { detailId: "nvm-flash-2gb",name: "2 Gb NVM Flash",        relationship: "On-board storage" },
      { detailId: "fpga-1m5-slc", name: "FPGA — 1.5M SLC",      relationship: "On-board co-processor" },
      { detailId: "optical-10g",  name: "10G Optical Mezzanine", relationship: "Attached XMC mezzanine" },
      { detailId: "crypto-unit",  name: "Crypto Processing Unit",relationship: "Cryptographic offload target" },
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
        name: "10G Optical Mezzanine",
        category: "Networking",
        tagline: "XMC · Quad SFP+ · 1G PHY · Virtium SSD & eMMC",
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
        id: "ds-vsc30-2800s",
        title: "VSC30-2800S Series Radiation Tolerant DC-DC Converters",
        docNumber: "VSC30-2800S-5.0",
        revision: "Rev 5.0",
        pages: 11,
        fileSize: "860 KB",
        file: "/datasheets/VPT-VSC30-2800S-Series.pdf",
        aiSummary:
          "The VPT VSC30-2800S is a NewSpace-qualified radiation-tolerant DC-DC converter delivering 25–30 W from a 15–50 V input (80 V transient), available in 3.3 V, 5 V, 12 V, or 15 V single-output configurations — providing the +3.3V and +5V rails on the Red PSU. Guaranteed to 30 krad(Si) TID with SEE tested to 42 MeV·cm²/mg (no destructive SEGR, SEB, or SEL events), operating from −55 °C to +105 °C with no power derating and ultra-low outgassing (< 1.5% TML, 0.12% CVCM) at just 48 g. Manufactured in an ISO 9001 / J-STD-001 / IPC-A-610 certified facility with MIL-STD-461 CE compliance using VPT's VSCF3-28 EMI filter.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card (Red)", relationship: "Primary load" },
      { detailId: "psu-black", name: "Power Converter (Black)", relationship: "Black-side counterpart" },
    ],
    subModules: [
      { detailId: "psu-rail-3v3-aux", name: "+3.3V_AUX", category: "Power", tagline: "Always-on standby · 500 mA · VSC30-2800S" },
      { detailId: "psu-rail-3v3",     name: "+3.3V",      category: "Power", tagline: "Logic rail · 10 A · VSC30-2800S" },
      { detailId: "psu-rail-5v",      name: "+5V",        category: "Power", tagline: "Peripheral rail · 4 A · VSC100-2800S" },
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
        id: "ds-vsc100-2800s",
        title: "VSC100-2800S Series Radiation Tolerant DC-DC Converters",
        docNumber: "VSC100-2800S-7.0",
        revision: "Rev 7.0",
        pages: 13,
        fileSize: "572 KB",
        file: "/datasheets/VPT-VSC100-2800S-Series.pdf",
        aiSummary:
          "The VPT VSC100-2800S is a NewSpace-qualified radiation-tolerant DC-DC converter outputting 66–100 W from a 16–40 V input (50 V transient), available in 3.3 V, 5 V, 12 V, 15 V, or 28 V single-output variants — covering the +5V and +12V backplane rails on the Black PSU. Guaranteed to 30 krad(Si) TID (tested to 40 krad) with SEE immunity tested to 42 MeV·cm²/mg and continuous operation across −55 °C to +105 °C with no power derating. Up to 5 units can be paralleled with current sharing; low outgassing (< 1.5% TML, < 0.12% CVCM) and 79 g max weight suit LEO and NASA Class D missions.",
      },
    ],
    related: [
      { detailId: "gpp-universal", name: "Universal GPP Card (Black)", relationship: "Primary load" },
      { detailId: "crypto-unit", name: "Cryptographic Processing Unit", relationship: "+12V consumer" },
      { detailId: "psu-red", name: "Power Converter (Red)", relationship: "Red-side counterpart" },
    ],
    subModules: [
      { detailId: "psu-rail-3v3-aux", name: "+3.3V_AUX", category: "Power", tagline: "Always-on standby · 500 mA · VSC30-2800S" },
      { detailId: "psu-rail-3v3",     name: "+3.3V",      category: "Power", tagline: "Logic rail · 10 A · VSC30-2800S" },
      { detailId: "psu-rail-5v",      name: "+5V",        category: "Power", tagline: "Peripheral rail · 4 A · VSC100-2800S" },
      { detailId: "psu-rail-12v",     name: "+12V",       category: "Power", tagline: "High-power backplane · 3 A · VSC30-2800S" },
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
      {
        id: "ds-mram-component",
        title: "AS3064204 / AS3128208 Space-Grade Dual QSPI MRAM Datasheet",
        docNumber: "AS3064204-DS-C7",
        revision: "Rev C.7",
        pages: 56,
        fileSize: "1.5 MB",
        file: "/datasheets/MRAM-Datasheet.pdf",
        aiSummary:
          "The Avalanche Technology AS3064204/AS3128208 is a Space-Grade-E 64/128 Mb Dual QSPI MRAM offering non-volatile SRAM-equivalent persistence via 22 nm pMTJ STT-MRAM technology — endurance exceeds 10¹⁶ write cycles with 20-year retention at 85 °C, far beyond SPI NOR Flash. It supports Dual QPI (4-4-4) at up to 100 MHz SDR / 50 MHz DDR from a 2.5–3.6 V supply, with hardware and software block protection and dedicated protection signals. The 56-ball FBGA (10 × 10 mm) package is qualified per JESD47H.01 with 168-hour burn-in at 125 °C, making it the NVM storage technology for persistent register and firmware state in the SNP platform.",
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
    name: "10G Optical XMC Mezzanine",
    shortName: "10G Optical Mezz",
    category: "Networking",
    tagline: "Quad-Channel SFP+ · 1G PHY · Virtium 1.2TB SSD · 64GB eMMC",
    overview:
      "The 10G Optical XMC Mezzanine is a high-density expansion card that bolts onto each GPP base card. It provides quad-channel 10 Gbps fiber-optic networking (4 × 12.5 Gbps via AirBorn FOCuS VTRFA connector), a four-port 1G Quad PHY for management-plane traffic, a Virtium 1.2 TB M.2 NVMe SSD for high-capacity mission data storage, and a Virtium 64 GB eMMC for OS boot and partition storage. Total aggregate optical bandwidth is 50 Gbps per mezzanine (100 Gbps across both GPP cards). The mezzanine conforms to the VITA 42 XMC standard and connects to the host GPP card via P15/P16 XMC connectors.",
    specs: [
      { label: "Form Factor",       value: "VITA 42 XMC (conduction-cooled)" },
      { label: "Host Interface",    value: "P15/P16 XMC connectors → GPP card" },
      { label: "Optical Channels",  value: "4 × 12.5 Gbps (VTRFA AirBorn FOCuS)" },
      { label: "Aggregate Optical BW", value: "50 Gbps full-duplex" },
      { label: "Optical Connector", value: "AirBorn FOCuS VTRFA (faceplate)" },
      { label: "GbE Ports",         value: "4 × 1000BASE-T (Microchip VSC8504)" },
      { label: "GbE Connector",     value: "51-pin Nano connector (faceplate)" },
      { label: "M.2 SSD",           value: "Virtium StorFly 1.2 TB NVMe Gen 3 M.2 2280" },
      { label: "eMMC",              value: "Virtium 64 GB eMMC 5.1" },
      { label: "Debug Port",        value: "Micro-USB (faceplate) — JTAG/UART" },
      { label: "Power Draw",        value: "6 W total (optical + PHY + storage)" },
      { label: "Weight",            value: "40 g" },
      { label: "Operating Temp",    value: "−40 °C to +85 °C" },
      { label: "Radiation Tolerance", value: "≥ 50 krad (Si) TID" },
    ],
    datasheets: [
      {
        id: "ds-optical-hw",
        title: "10G Optical XMC Mezzanine Hardware Reference",
        docNumber: "SNP-HW-OPT-001",
        revision: "Rev C",
        pages: 88,
        fileSize: "5.0 MB",
        aiSummary:
          "Hardware reference covering the XMC mezzanine architecture: VTRFA optical cage, XMC P15/P16 connector pinout, Microchip VSC8504 Quad PHY RGMII routing, Virtium M.2 and eMMC power and signal conditioning, and the debug Micro-USB JTAG bridge circuit. Thermal interface design for conduction cooling via the XMC wedge lock to the host GPP card rail is detailed with interface resistance budgets. The manual includes firmware register maps for VSC8504 MDIO management and Virtium SMART telemetry polling.",
      },
      {
        id: "ds-vtraf-aoc",
        title: "AirBorn FOCuS Active Optical Cables",
        docNumber: "AIRBORN-FOCUS-AOC",
        revision: "Rev 1",
        pages: 51,
        fileSize: "19.8 MB",
        file: "/datasheets/VTRAF-Datasheet.pdf",
        aiSummary:
          "AirBorn FOCuS Active Optical Cables deliver 4-channel × 12.5 Gbps (50 Gbps aggregate) fiber-optic connectivity using radiation-hardened, non-outgassing components qualified for space, defense, and industrial environments. The patented sealed optical path eliminates foreign object debris (FOD) as a failure mode, and cables install identically to copper — no transceiver or fiber cleaning required. Rated to 100 m reach with full EMI immunity, the FOCuS connector integrates into the SNP GPP faceplate as the primary high-speed data-plane optical interface.",
      },
    ],
    related: [
      { detailId: "gpp-universal",  name: "Universal GPP Card",    relationship: "Host base card" },
      { detailId: "fpga-1m5-slc",   name: "FPGA — 1.5M SLC",      relationship: "Implements 10G MAC cores" },
      { detailId: "quad-phy-1g",    name: "1G Quad PHY (VSC8504)", relationship: "On-board management PHY" },
      { detailId: "ssd-m2-1p2tb",   name: "1.2 TB M.2 SSD",       relationship: "On-board mission storage" },
      { detailId: "emmc-64gb",       name: "64 GB eMMC",            relationship: "On-board OS storage" },
      { detailId: "net-10g-copper", name: "10G Copper Mezzanine",  relationship: "pLEO SWaP-C alternative" },
    ],
    subModules: [
      {
        detailId: "quad-phy-1g",
        name: "1G Quad PHY",
        category: "Networking",
        tagline: "Microchip VSC8504 · 4-port GbE · Management plane",
      },
      {
        detailId: "ssd-m2-1p2tb",
        name: "1.2 TB M.2 SSD",
        category: "Storage",
        tagline: "Virtium StorFly · NVMe Gen 3 · Space-qualified",
      },
      {
        detailId: "emmc-64gb",
        name: "64 GB eMMC",
        category: "Storage",
        tagline: "Virtium · eMMC 5.1 · OS boot & partitions",
      },
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
        id: "ds-phy-vsc8504",
        title: "VSC8504 Quad-Port 10/100/1000BASE-T PHY Datasheet",
        docNumber: "DS60001810A",
        revision: "Rev A",
        pages: 133,
        fileSize: "3.1 MB",
        file: "/datasheets/Quad_PHY.pdf",
        aiSummary:
          "The Microchip VSC8504 is a low-power quad-port Gigabit Ethernet transceiver with QSGMII/SGMII SerDes MAC interfaces supporting dual media — simultaneous copper RJ-45 and fiber SFP per port. EcoEthernet v2.0 features include Energy Efficient Ethernet (EEE), ActiPHY link-down power savings, and PerfectReach automatic cable-length power adjustment, covering 10/100/1000BASE-T over Cat-5 UTP beyond 100 m. The device additionally supports Synchronous Ethernet with dual recovered clock outputs and a ring resiliency feature enabling 1000BASE-T port switchover without link interruption.",
      },
    ],
    related: [
      { detailId: "optical-10g",  name: "10G Optical XMC Mezzanine", relationship: "Host mezzanine card" },
      { detailId: "gpp-universal",name: "Universal GPP Card",         relationship: "Host base card" },
      { detailId: "ssd-m2-1p2tb",name: "1.2 TB M.2 SSD",            relationship: "Co-resident on mezzanine" },
      { detailId: "emmc-64gb",    name: "64 GB eMMC",                 relationship: "Co-resident on mezzanine" },
    ],
  },

  "net-10g-copper": {
    id: "net-10g-copper",
    name: "10 Gbps Copper Networking",
    shortName: "10G Copper",
    category: "Networking",
    tagline: "Dual-Channel · 10GBASE-T · pLEO SWaP-C Optimized",
    overview:
      "The 10 Gbps Copper Networking module is a standalone expansion card used in pLEO configurations as a lower-SWaP-C alternative to fiber-optic networking. It provides dual-channel 10GBASE-T Ethernet over standard copper cabling (Cat-6A or better), eliminating the need for SFP+ transceivers and optical fiber management while maintaining 10 Gbps throughput per channel. The reduced radiation-hardening overhead compared to the optical interface makes it cost-effective for proliferated LEO constellations.",
    specs: [
      { label: "Channels", value: "4 × 10GBASE-T (quad-channel)" },
      { label: "Per-Lane Speed", value: "10 Gbps full-duplex" },
      { label: "Aggregate BW", value: "40 Gbps" },
      { label: "Cable Type", value: "Cat-6A or Cat-7 (shielded)" },
      { label: "Cable Reach", value: "100 m at 10 Gbps" },
      { label: "Protocol", value: "10GBASE-T (IEEE 802.3an)" },
      { label: "Connector", value: "Shielded RJ-45 (4 × per module)" },
      { label: "Mgmt Ports", value: "4 × 1000BASE-T via 51-pin Nano-D connector (Microchip VSC8504 Quad PHY)" },
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
      { detailId: "mez-qsfp-3x", name: "3× QSFP Mezzanine",  relationship: "High-density alternative" },
    ],
  },

  "mez-qsfp-3x": {
    id: "mez-qsfp-3x",
    name: "3× QSFP XMC Mezzanine",
    shortName: "3× QSFP",
    category: "Networking",
    tagline: "3× QSFP+ · 10G Lanes · High-Density Interconnect · XMC",
    overview:
      "The 3× QSFP XMC Mezzanine routes the GPP data-plane 10G lanes to three independent QSFP+ cages, enabling high-density rack and payload interconnect without the fiber-management overhead of SFP+. Each QSFP+ cage supports 4 × 10G lanes (40 Gbps per port) from the GPP FPGA fabric, providing 120 Gbps aggregate capacity in the same XMC footprint as the Optical and Copper mezzanines. The QSFP form factor is compatible with standard 40GBASE-SR4, 40GBASE-LR4, and breakout (4 × 10G) cabling, giving system integrators flexible cabling options for satellite payload and ground-support equipment.",
    specs: [
      { label: "QSFP Cages",      value: "3 × QSFP+ (independent)" },
      { label: "Per-Port Lanes",  value: "4 × 10G (QSFP+)" },
      { label: "Per-Port BW",     value: "40 Gbps full-duplex" },
      { label: "Aggregate BW",    value: "120 Gbps" },
      { label: "Protocols",       value: "40GBASE-SR4 / LR4 / CR4 · 4×10G breakout" },
      { label: "Mgmt Ports",      value: "4 × 1000BASE-T via 51-pin Nano-D connector (Microchip VSC8504 Quad PHY)" },
      { label: "Form Factor",     value: "XMC (mezzanine on GPP base card)" },
      { label: "Power Draw",      value: "8 W (excl. transceiver modules)" },
      { label: "Weight",          value: "55 g (excl. transceiver modules)" },
      { label: "Operating Temp",  value: "−40 °C to +85 °C" },
      { label: "Radiation Tol.",  value: "50 krad (Si) TID" },
      { label: "Host Interface",  value: "SpaceVPX data-plane via FPGA SerDes" },
    ],
    datasheets: [
      {
        id: "ds-qsfp-hw",
        title: "3× QSFP XMC Mezzanine Hardware Reference",
        docNumber: "SNP-HW-QSFP-001",
        revision: "Rev A",
        pages: 72,
        fileSize: "4.2 MB",
        aiSummary:
          "The hardware reference documents the QSFP+ cage layout, SerDes routing from the GPP FPGA to each cage, and retimer/CDR IC placement for signal integrity at 10G NRZ. Cage power sequencing and I2C management bus topology are detailed in Section 3. Section 5 provides a transceiver compatibility matrix covering QSFP+ SR4, LR4, and DAC/AOC breakout cables. Thermal budgets for three simultaneously populated QSFP+ transceivers are provided for both conduction-cooled and open-frame configurations.",
      },
    ],
    related: [
      { detailId: "gpp-universal",  name: "Universal GPP Card",      relationship: "Host base card" },
      { detailId: "optical-10g",      name: "10G Optical XMC Mezzanine",       relationship: "SFP+ alternative" },
      { detailId: "net-10g-copper",   name: "10G Copper Mezzanine",            relationship: "Copper alternative" },
      { detailId: "mez-qsfp-passive", name: "10G QSFP Passive XMC Mezzanine",  relationship: "Passive DAC alternative" },
      { detailId: "fpga-1m5-slc",     name: "FPGA — 1.5M SLC",                 relationship: "Provides SerDes lanes" },
    ],
  },

  "mez-qsfp-passive": {
    id: "mez-qsfp-passive",
    name: "10G QSFP Passive XMC Mezzanine",
    shortName: "QSFP Passive Mezz",
    category: "Networking",
    tagline: "3× QSFP+ Passive · DAC · 1G Quad PHY · Virtium 1.2TB SSD · 64GB eMMC",
    overview:
      "The 10G QSFP Passive XMC Mezzanine provides three QSFP+ cages wired for passive Direct Attach Copper (DAC) or Active Optical Cable (AOC) interconnects — no active optical transceiver modules required in the cage itself. This eliminates transceiver power draw and simplifies cable management for short-reach rack and payload interconnects. Like the active QSFP mezzanine it includes the full management stack: a four-port 1G Quad PHY (Microchip VSC8504) via 51-pin Nano-D connector, a Virtium 1.2 TB M.2 NVMe SSD for mission data storage, and a Virtium 64 GB eMMC for OS boot. Conforms to VITA 42 XMC standard.",
    specs: [
      { label: "Form Factor",        value: "VITA 42 XMC (conduction-cooled)" },
      { label: "Host Interface",     value: "P15/P16 XMC connectors → GPP card" },
      { label: "QSFP Cages",         value: "3 × QSFP+ (passive DAC / AOC — no active transceivers)" },
      { label: "Per-Port Lanes",     value: "4 × 10G (QSFP+)" },
      { label: "Per-Port BW",        value: "40 Gbps full-duplex" },
      { label: "Aggregate BW",       value: "120 Gbps" },
      { label: "Cable Type",         value: "Passive DAC (≤5 m) or AOC (≤100 m)" },
      { label: "Protocols",          value: "40GBASE-CR4 (DAC) · 40GBASE-SR4 (AOC) · 4×10G breakout" },
      { label: "Mgmt Ports",         value: "4 × 1000BASE-T via 51-pin Nano-D connector (Microchip VSC8504 Quad PHY)" },
      { label: "M.2 SSD",            value: "Virtium StorFly 1.2 TB NVMe Gen 3 M.2 2280" },
      { label: "eMMC",               value: "Virtium 64 GB eMMC 5.1" },
      { label: "Debug Port",         value: "Micro-USB (faceplate) — JTAG/UART" },
      { label: "Power Draw",         value: "5 W (no transceiver power — DAC cables are passive)" },
      { label: "Weight",             value: "48 g (excl. cables)" },
      { label: "Operating Temp",     value: "−40 °C to +85 °C" },
      { label: "Radiation Tolerance", value: "≥ 50 krad (Si) TID" },
    ],
    subModules: [
      { detailId: "quad-phy-1g",  name: "1G Quad PHY (VSC8504)", category: "Networking",  tagline: "4-port 1G management PHY" },
      { detailId: "ssd-m2-1p2tb", name: "1.2 TB M.2 SSD",        category: "Storage",     tagline: "NVMe Gen 3 · Virtium StorFly" },
      { detailId: "emmc-64gb",    name: "64 GB eMMC",             category: "Storage",     tagline: "eMMC 5.1 · Virtium · OS boot" },
    ],
    datasheets: [
      {
        id: "ds-qsfp-passive-hw",
        title: "10G QSFP Passive XMC Mezzanine Hardware Reference",
        docNumber: "SNP-HW-QSFPP-001",
        revision: "Rev A",
        pages: 68,
        fileSize: "3.8 MB",
        aiSummary:
          "Hardware reference for the passive QSFP XMC mezzanine. Covers QSFP+ cage layout and DAC/AOC compatibility, PCB signal integrity guidelines for passive 10G lanes, Microchip VSC8504 Quad PHY integration, Nano-D 51-pin connector pin assignment, and Virtium SSD/eMMC integration. Includes a SWaP-C comparison versus the active QSFP mezzanine: the passive variant saves approximately 3 W (no transceiver power) and is preferred for short-reach interconnects where DAC cable lengths are under 5 m.",
        file: undefined,
      },
    ],
    related: [
      { detailId: "mez-qsfp-3x",   name: "3× QSFP Active Mezzanine",  relationship: "Active transceiver variant" },
      { detailId: "optical-10g",    name: "10G Optical XMC Mezzanine", relationship: "SFP+ optical alternative" },
      { detailId: "gpp-universal",  name: "Universal GPP Card",        relationship: "Host base card" },
      { detailId: "quad-phy-1g",    name: "1G Quad PHY (VSC8504)",     relationship: "On-board management PHY" },
    ],
  },

  "timing-atomic-clock": {
    id: "timing-atomic-clock",
    name: "Timing & Networking Expansion (Atomic Clock)",
    shortName: "Atomic Clock",
    category: "Expansion",
    tagline: "CSAC · Nanosecond Sync · GPS-Independent · Precision Timing",
    overview:
      "The Timing & Networking Expansion module integrates a chip-scale atomic clock (CSAC) to provide nanosecond-class time synchronization for orbital operations where GPS signal availability is intermittent or unavailable. The CSAC maintains timing accuracy independently of external references, with drift of < 100 ns/day after GPS holdover. This is essential for time-division multiplexing (TDM) protocols, precision navigation solutions, and cryptographic timestamp binding. The module also provides additional networking expansion capability for missions with higher data-plane connectivity requirements.",
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
          "The hardware reference covers the CSAC module integration (Microsemi SA.45s-based design), 10 MHz and 1 PPS output conditioning circuitry, and the GNSS receiver front-end. The PTP grandmaster implementation is documented with synchronization hierarchy diagrams showing how time is distributed to both GPP cards and optionally to payloads via the SpaceVPX utility plane. Section 4 covers the dual GbE expansion ports (shared RGMII to the GPP FPGA), their intended use for mission-specific connectivity, and connector assignments on the SpaceVPX P2 connector.",
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
  "psu-rail-3v3-aux": {
    id: "psu-rail-3v3-aux",
    name: "+3.3V_AUX Standby Rail",
    shortName: "+3.3V_AUX",
    category: "Power",
    tagline: "Always-On · 500 mA · VSC30-2800S · Both PSUs",
    overview:
      "The +3.3V_AUX rail is the always-on standby supply present on both Red and Black Power Converters. It remains energised even during low-power sleep states, sustaining SpaceVPX utility plane standby circuitry, chassis management controllers (UT32M0R500), and module health monitors. It is the first rail to assert on power-up and the last to de-assert on shutdown, ensuring safe sequencing and state preservation across the redundant architecture. Generated by the VPT VSC30-2800S in its 3.3 V output configuration.",
    specs: [
      { label: "Nominal Voltage",  value: "3.3 V" },
      { label: "Max Current",      value: "500 mA" },
      { label: "Max Power",        value: "1.65 W" },
      { label: "Regulation",       value: "±1% line/load" },
      { label: "Ripple (max)",     value: "50 mV p-p" },
      { label: "Sequencing",       value: "First on · last off" },
      { label: "Generator",        value: "VPT VSC30-2800S (3.3 V variant)" },
      { label: "Converter Input",  value: "15–50 V continuous · 80 V transient" },
      { label: "Converter TID",    value: "30 krad(Si) guaranteed" },
      { label: "Converter SEE",    value: "SEL/SEB/SEGR immune · 42 MeV·cm²/mg" },
      { label: "Converter Temp",   value: "−55 °C to +105 °C · no derating" },
      { label: "Availability",     value: "Both Red and Black PSUs" },
    ],
    datasheets: [
      {
        id: "ds-vsc30-3v3aux",
        title: "VSC30-2800S Series Radiation Tolerant DC-DC Converters",
        docNumber: "VSC30-2800S-5.0",
        revision: "Rev 5.0",
        pages: 11,
        fileSize: "860 KB",
        file: "/datasheets/VPT-VSC30-2800S-Series.pdf",
        aiSummary:
          "The VPT VSC30-2800S delivers 25–30 W from a 15–50 V input in single-output variants (3.3 V, 5 V, 12 V, 15 V), with guaranteed 30 krad(Si) TID tolerance and SEE immunity tested at 42 MeV·cm²/mg (no destructive SEGR, SEB, or SEL). Continuous operation from −55 °C to +105 °C with no power derating, ultra-low outgassing (<1.5% TML, 0.12% CVCM), and fixed-frequency operation with synchronisation make it well-suited for LEO and NASA Class D satellite power systems at just 48 g.",
      },
    ],
    related: [
      { detailId: "psu-red",      name: "Power Converter (Red)",   relationship: "Host — Red-side instance" },
      { detailId: "psu-black",    name: "Power Converter (Black)", relationship: "Host — Black-side instance" },
      { detailId: "psu-rail-3v3", name: "+3.3V Logic Rail",        relationship: "Same converter, main logic output" },
    ],
  },

  "psu-rail-3v3": {
    id: "psu-rail-3v3",
    name: "+3.3V Logic Rail",
    shortName: "+3.3V",
    category: "Power",
    tagline: "Logic Supply · 10 A · VSC30-2800S · Both PSUs",
    overview:
      "The +3.3V Logic Rail is the primary digital supply for FPGA I/O banks, SDRAM data interfaces, PHY transceivers, and on-board management ICs on both GPP cards. It must reach 90% of setpoint before the +5V rail asserts during power-up sequencing. Generated by the VPT VSC30-2800S (3.3 V / 25 W variant), each PSU provides a fully independent instance of this rail, preserving fault isolation between the Red and Black sides of the redundant architecture.",
    specs: [
      { label: "Nominal Voltage",  value: "3.3 V" },
      { label: "Max Current",      value: "10 A" },
      { label: "Max Power",        value: "25 W (VSC30 3.3V variant)" },
      { label: "Regulation",       value: "±1% line/load" },
      { label: "Ripple (max)",     value: "50 mV p-p" },
      { label: "Sequencing",       value: "Second on (after +3.3V_AUX) · before +5V" },
      { label: "Generator",        value: "VPT VSC30-2800S (3.3 V / 25 W)" },
      { label: "Converter Input",  value: "15–50 V continuous · 80 V transient" },
      { label: "Converter TID",    value: "30 krad(Si) guaranteed" },
      { label: "Converter SEE",    value: "SEL/SEB/SEGR immune · 42 MeV·cm²/mg" },
      { label: "Converter Temp",   value: "−55 °C to +105 °C · no derating" },
      { label: "Availability",     value: "Both Red and Black PSUs" },
    ],
    datasheets: [
      {
        id: "ds-vsc30-3v3",
        title: "VSC30-2800S Series Radiation Tolerant DC-DC Converters",
        docNumber: "VSC30-2800S-5.0",
        revision: "Rev 5.0",
        pages: 11,
        fileSize: "860 KB",
        file: "/datasheets/VPT-VSC30-2800S-Series.pdf",
        aiSummary:
          "The VPT VSC30-2800S delivers 25–30 W from a 15–50 V input in single-output variants (3.3 V, 5 V, 12 V, 15 V), with guaranteed 30 krad(Si) TID tolerance and SEE immunity tested at 42 MeV·cm²/mg. Fixed-frequency operation with synchronisation, undervoltage lockout, and current-limit/short-circuit protection are standard. Outgassing below 1.5% TML / 0.12% CVCM in a 1.885″ × 1.325″ × 0.360″ package at 48 g.",
      },
    ],
    related: [
      { detailId: "psu-red",          name: "Power Converter (Red)",   relationship: "Host — Red-side instance" },
      { detailId: "psu-black",        name: "Power Converter (Black)", relationship: "Host — Black-side instance" },
      { detailId: "psu-rail-3v3-aux", name: "+3.3V_AUX Standby Rail", relationship: "Same converter, standby output" },
      { detailId: "psu-rail-5v",      name: "+5V Peripheral Rail",     relationship: "Asserts after this rail" },
    ],
  },

  "psu-rail-5v": {
    id: "psu-rail-5v",
    name: "+5V Peripheral Rail",
    shortName: "+5V",
    category: "Power",
    tagline: "Peripheral Supply · 4 A · VSC100-2800S · Both PSUs",
    overview:
      "The +5V Peripheral Rail powers SFP+ transceiver bias circuits, PHY transceivers, and board-level peripheral ICs outside the core processor and FPGA voltage domains. Generated by the VPT VSC100-2800S (5 V / 100 W variant) — the highest-wattage converter on the board — it asserts last in the power-up sequence after the +3.3V rail reaches 90% of setpoint, protecting downstream devices from partial-power states. Its enable is conditioned on +3.3V stability.",
    specs: [
      { label: "Nominal Voltage",    value: "5 V" },
      { label: "Max Current",        value: "4 A" },
      { label: "Max Power",          value: "20 W (load) · 100 W (converter rated)" },
      { label: "Regulation",         value: "±1% line/load" },
      { label: "Ripple (max)",       value: "50 mV p-p" },
      { label: "Sequencing",         value: "Last on (Red) · before +12V (Black)" },
      { label: "Generator",          value: "VPT VSC100-2800S (5 V / 100 W)" },
      { label: "Converter Input",    value: "16–40 V continuous · 50 V transient" },
      { label: "Converter TID",      value: "30 krad(Si) guaranteed" },
      { label: "Converter SEE",      value: "No destructive SEE · 42 MeV·cm²/mg" },
      { label: "Converter Temp",     value: "−55 °C to +105 °C · no derating" },
      { label: "Converter Paralleling", value: "Up to 5 units with active current sharing" },
      { label: "Availability",       value: "Both Red and Black PSUs" },
    ],
    datasheets: [
      {
        id: "ds-vsc100-5v",
        title: "VSC100-2800S Series Radiation Tolerant DC-DC Converters",
        docNumber: "VSC100-2800S-7.0",
        revision: "Rev 7.0",
        pages: 13,
        fileSize: "572 KB",
        file: "/datasheets/VPT-VSC100-2800S-Series.pdf",
        aiSummary:
          "The VPT VSC100-2800S delivers 66–100 W from a 16–40 V input (50 V transient) in single-output variants (3.3 V, 5 V, 12 V, 15 V, 28 V), guaranteed to 30 krad(Si) TID with SEE tested to 42 MeV·cm²/mg. Up to 5 units can be paralleled with active current sharing; fixed-frequency operation with synchronisation minimises inter-converter noise. Low outgassing (<1.5% TML, 0.12% CVCM) and 79 g max weight suit LEO and NASA Class D satellite power budgets.",
      },
    ],
    related: [
      { detailId: "psu-red",      name: "Power Converter (Red)",   relationship: "Host — Red-side instance" },
      { detailId: "psu-black",    name: "Power Converter (Black)", relationship: "Host — Black-side instance" },
      { detailId: "psu-rail-3v3", name: "+3.3V Logic Rail",        relationship: "Must be valid before +5V asserts" },
      { detailId: "psu-rail-12v", name: "+12V High-Power Rail",    relationship: "Asserts after +5V (Black only)" },
    ],
  },

  "psu-rail-12v": {
    id: "psu-rail-12v",
    name: "+12V High-Power Rail",
    shortName: "+12V",
    category: "Power",
    tagline: "Backplane Supply · 3 A · VSC30-2800S · Black PSU Only",
    overview:
      "The +12V High-Power Rail is exclusive to the Black Power Converter, providing the primary supply for the SpaceVPX backplane and the Cryptographic Processing Unit. A dedicated hardware output-stage monitor provides 100 µs fault detection: any fault triggers automatic load shedding and backplane isolation, preventing cascade failures. As the last rail to assert and the first to de-assert, it gates the final stage of the power-up sequence — ensuring all logic is stable before the cryptographic subsystem powers. Generated by the VPT VSC30-2800S in its 12 V / 30 W output configuration.",
    specs: [
      { label: "Nominal Voltage",  value: "12 V" },
      { label: "Max Current",      value: "3 A" },
      { label: "Max Power",        value: "30 W (VSC30 12V variant)" },
      { label: "Regulation",       value: "±1% line/load" },
      { label: "Ripple (max)",     value: "100 mV p-p" },
      { label: "Fault Detection",  value: "100 µs (hardware output monitor)" },
      { label: "Sequencing",       value: "Last on · first off" },
      { label: "Generator",        value: "VPT VSC30-2800S (12 V / 30 W)" },
      { label: "Converter Input",  value: "15–50 V continuous · 80 V transient" },
      { label: "Converter TID",    value: "30 krad(Si) guaranteed" },
      { label: "Converter SEE",    value: "SEL/SEB/SEGR immune · 42 MeV·cm²/mg" },
      { label: "Converter Temp",   value: "−55 °C to +105 °C · no derating" },
      { label: "Availability",     value: "Black PSU only" },
      { label: "Loads",            value: "SpaceVPX backplane · Cryptographic Processing Unit" },
    ],
    datasheets: [
      {
        id: "ds-vsc30-12v",
        title: "VSC30-2800S Series Radiation Tolerant DC-DC Converters",
        docNumber: "VSC30-2800S-5.0",
        revision: "Rev 5.0",
        pages: 11,
        fileSize: "860 KB",
        file: "/datasheets/VPT-VSC30-2800S-Series.pdf",
        aiSummary:
          "The VPT VSC30-2800S in its 12 V / 30 W configuration provides the high-voltage rail for the SpaceVPX backplane and Crypto Unit. Guaranteed 30 krad(Si) TID, SEL/SEB/SEGR immunity at 42 MeV·cm²/mg, and continuous −55 °C to +105 °C operation with no derating. Fixed-frequency topology with synchronisation ensures minimal noise coupling to sensitive RF and timing circuitry sharing the chassis.",
      },
    ],
    related: [
      { detailId: "psu-black",   name: "Power Converter (Black)",      relationship: "Host PSU" },
      { detailId: "crypto-unit", name: "Cryptographic Processing Unit", relationship: "Primary +12V consumer" },
      { detailId: "psu-rail-5v", name: "+5V Peripheral Rail",          relationship: "Asserts before +12V" },
    ],
  },

  // ─── Virtium Storage ─────────────────────────────────────────────────────────

  "ssd-m2-1p2tb": {
    id: "ssd-m2-1p2tb",
    name: "1.2 TB M.2 NVMe SSD",
    shortName: "1.2 TB SSD",
    category: "Storage",
    tagline: "Virtium StorFly · NVMe Gen 3 · M.2 2280 · Space-Qualified",
    overview:
      "The Virtium StorFly 1.2 TB M.2 NVMe SSD is a space-qualified solid-state drive mounted on the 10G Optical XMC Mezzanine. It provides high-capacity mission data storage — sensor recordings, downlink buffers, onboard processing results — accessible directly by the GPP ARM processor via the PCIe Gen 3 x4 interface routed through the XMC connector. Virtium's enterprise-grade flash management firmware (StorFly FW) provides power-loss protection, wear leveling, and SMART telemetry for health monitoring over the SpaceVPX utility plane. Designed for wide-temperature and radiation-tolerant operation, it replaces traditional spinning disks in demanding orbital environments.",
    specs: [
      { label: "Manufacturer",      value: "Virtium Technology" },
      { label: "Capacity",          value: "1.2 TB" },
      { label: "Form Factor",       value: "M.2 2280 (80 mm)" },
      { label: "Interface",         value: "NVMe 1.4 over PCIe Gen 3 x4" },
      { label: "Sequential Read",   value: "3,400 MB/s" },
      { label: "Sequential Write",  value: "3,100 MB/s" },
      { label: "Random Read (4K)",  value: "680,000 IOPS" },
      { label: "Random Write (4K)", value: "720,000 IOPS" },
      { label: "NAND Type",         value: "3D eMLC / Industrial-grade 3D NAND" },
      { label: "Power-Loss Protect",value: "Capacitor-backed write cache" },
      { label: "Endurance",         value: "≥ 3 DWPD (Drive Writes Per Day)" },
      { label: "SMART Telemetry",   value: "NVMe SMART + Virtium proprietary VIT" },
      { label: "Operating Temp",    value: "−40 °C to +85 °C" },
      { label: "Supply Voltage",    value: "3.3 V (M.2 connector)" },
      { label: "Power (Active)",    value: "3.5 W (peak read/write)" },
    ],
    datasheets: [
      {
        id: "ds-storfly-1p2tb",
        title: "StorFly M.2 NVMe SSD Product Brief",
        docNumber: "VT-STORFLY-M2-NVMe",
        revision: "Rev 2.1",
        pages: 8,
        fileSize: "1.2 MB",
        aiSummary:
          "Virtium StorFly M.2 NVMe SSDs are industrial/mil-aero solid-state drives built with 3D eMLC NAND and Virtium's StorFly firmware providing power-loss protection via on-board capacitors, advanced wear leveling, and real-time SMART plus Virtium Intelligent Technology (VIT) telemetry. Available in capacities from 120 GB to 1.92 TB in M.2 2242/2260/2280 form factors, rated −40 °C to +85 °C with optional conformal coating and extended screening for airborne and spaceborne applications.",
      },
    ],
    related: [
      { detailId: "optical-10g",  name: "10G Optical XMC Mezzanine", relationship: "Host mezzanine card" },
      { detailId: "emmc-64gb",    name: "64 GB eMMC",                 relationship: "Co-resident boot storage" },
      { detailId: "gpp-universal",name: "Universal GPP Card",         relationship: "NVMe host processor" },
      { detailId: "nvm-flash-2gb",name: "2 Gb NVM Flash",             relationship: "Firmware storage complement" },
    ],
  },

  "emmc-64gb": {
    id: "emmc-64gb",
    name: "64 GB eMMC",
    shortName: "64 GB eMMC",
    category: "Storage",
    tagline: "Virtium · eMMC 5.1 · HS400 · OS Boot & Partitions",
    overview:
      "The Virtium 64 GB eMMC is an industrial-grade embedded MultiMediaCard mounted on the 10G Optical XMC Mezzanine, providing the primary boot partition and OS root filesystem for the GPP ARM Linux stack. Operating at HS400 (400 MB/s) over the 8-bit eMMC 5.1 bus, it hosts the U-Boot bootloader, Linux kernel, device tree, and GPP system partitions. The eMMC's hardware write-protect and replay-protected memory block (RPMB) partition are used by the SNP security subsystem to store authenticated boot state and device attestation keys. Virtium's industrial screening ensures reliable operation across the full thermal and vibration envelope.",
    specs: [
      { label: "Manufacturer",      value: "Virtium Technology" },
      { label: "Capacity",          value: "64 GB" },
      { label: "Interface",         value: "eMMC 5.1 · 8-bit bus" },
      { label: "Bus Mode",          value: "HS400 (200 MHz DDR)" },
      { label: "Sequential Read",   value: "400 MB/s" },
      { label: "Sequential Write",  value: "200 MB/s" },
      { label: "NAND Type",         value: "3D MLC / Industrial-grade" },
      { label: "Write Endurance",   value: "≥ 3,000 P/E cycles" },
      { label: "RPMB",              value: "Supported — 512 KB authenticated partition" },
      { label: "Hardware WP",       value: "Permanent / Temporary WP supported" },
      { label: "Boot Partitions",   value: "2 × 4 MB boot areas" },
      { label: "Operating Temp",    value: "−40 °C to +85 °C" },
      { label: "Supply Voltage",    value: "1.8 V (core) / 3.3 V (I/O)" },
      { label: "Package",           value: "153-ball BGA · soldered on-board" },
    ],
    datasheets: [
      {
        id: "ds-virtium-emmc",
        title: "Virtium eMMC Industrial Product Brief",
        docNumber: "VT-eMMC-IND",
        revision: "Rev 1.4",
        pages: 6,
        fileSize: "800 KB",
        aiSummary:
          "Virtium industrial eMMC devices are built with 3D MLC NAND and qualified for −40 °C to +85 °C operation with optional extended temperature screening to −40 °C to +105 °C. The eMMC 5.1 standard provides HS400 (400 MB/s read) bus mode, hardware write-protect, RPMB authenticated partitions, and background operations management — making them suitable for secure boot and OS storage in airborne and spaceborne computing systems. Available in 16 GB, 32 GB, 64 GB, and 128 GB, in 153-ball BGA packages for board-level integration.",
      },
    ],
    related: [
      { detailId: "optical-10g",  name: "10G Optical XMC Mezzanine", relationship: "Host mezzanine card" },
      { detailId: "ssd-m2-1p2tb",name: "1.2 TB M.2 SSD",            relationship: "Co-resident mission storage" },
      { detailId: "nvm-flash-2gb",name: "2 Gb NVM Flash",             relationship: "Bitstream/firmware storage" },
      { detailId: "gpp-universal",name: "Universal GPP Card",         relationship: "eMMC host processor" },
    ],
  },

  // ─── Connectors ───────────────────────────────────────────────────────────────

  "conn-vtrfa": {
    id: "conn-vtrfa",
    name: "VTRFA AirBorn FOCuS Connector",
    shortName: "VTRFA",
    category: "Connector",
    tagline: "4-Channel · 12.5 Gbps/ch · Active Optical · Space-Qualified",
    overview:
      "The VTRFA is the AirBorn FOCuS (Fiber Optic Connection Using Signals) active optical connector on the GPP faceplate. It provides the primary high-speed data-plane optical link between the SNP chassis and external subsystems. Each connector carries four independent full-duplex optical channels at 12.5 Gbps (50 Gbps aggregate), using radiation-hardened active optical cable (AOC) assemblies. The sealed connector body eliminates the need for field-cleanable fiber ends — the optical path is permanently sealed at manufacture, removing FOD (Foreign Object Debris) as a failure mode. Cables install and mate identically to standard copper connectors.",
    specs: [
      { label: "Manufacturer",       value: "AirBorn (FOCuS series)" },
      { label: "Part Family",        value: "VTRFA Active Optical Cable Connector" },
      { label: "Channels",           value: "4 × full-duplex optical lanes" },
      { label: "Per-Lane Rate",      value: "12.5 Gbps NRZ" },
      { label: "Aggregate BW",       value: "50 Gbps (4T + 4R)" },
      { label: "Fiber",              value: "Multimode OM4 (integrated in AOC)" },
      { label: "Max Cable Length",   value: "100 m" },
      { label: "Connector Housing",  value: "Sealed, non-cleanable (FOD-safe)" },
      { label: "Mating Standard",    value: "AirBorn FOCuS — proprietary latch" },
      { label: "Signal Standard",    value: "IEEE 802.3ae 10GBASE-SR (per lane)" },
      { label: "EMI",                value: "Full immunity (optical — no shielding req.)" },
      { label: "Radiation Tolerance",value: "Rad-hardened components" },
      { label: "Operating Temp",     value: "−40 °C to +85 °C" },
      { label: "Faceplate Location", value: "GPP Red & GPP Black — center-left" },
    ],
    datasheets: [
      {
        id: "ds-vtraf-conn",
        title: "AirBorn FOCuS Active Optical Cables",
        docNumber: "AIRBORN-FOCUS-AOC",
        revision: "Rev 1",
        pages: 51,
        fileSize: "19.8 MB",
        file: "/datasheets/VTRAF-Datasheet.pdf",
        aiSummary:
          "AirBorn FOCuS Active Optical Cables deliver 4-channel × 12.5 Gbps fiber-optic connectivity using radiation-hardened, non-outgassing components qualified for space, defense, and industrial use. The sealed optical path eliminates FOD contamination. Cables are rated to 100 m with full EMI immunity and install identically to copper connectors.",
      },
    ],
    related: [
      { detailId: "optical-10g",  name: "10G Optical XMC Mezzanine", relationship: "Connected module" },
      { detailId: "gpp-universal",name: "Universal GPP Card",         relationship: "Host faceplate" },
      { detailId: "conn-nano-51", name: "51-Pin Nano Connector",      relationship: "Adjacent GPP faceplate connector" },
    ],
  },

  "conn-nano-51": {
    id: "conn-nano-51",
    name: "51-Pin Nano Connector",
    shortName: "Nano 51",
    category: "Connector",
    tagline: "MIL-DTL-83513 · 51 Pins · 3 Rows × 17 · Data & Control",
    overview:
      "The 51-pin Nano-D connector on the GPP faceplate provides the secondary external interface for data-plane breakout, discrete control signals, and auxiliary serial interfaces routed from the mezzanine Quad PHY and XMC logic. MIL-DTL-83513 compliant, the nano-D form factor delivers high contact density in a compact, vibration-resistant shell — standard across military and space avionics. This connector carries 10/100/1000BASE-T signals from the Microchip VSC8504 Quad PHY to external management-plane equipment, along with GPIO, SPI, and UART auxiliary channels.",
    specs: [
      { label: "Standard",          value: "MIL-DTL-83513 (Nano-D)" },
      { label: "Pin Count",         value: "51 pins (3 rows × 17 contacts)" },
      { label: "Contact Pitch",     value: "1.27 mm (0.050\")" },
      { label: "Shell Size",        value: "Size 1 Nano-D" },
      { label: "Signal Assignment", value: "GbE × 4 (RGMII), SPI, UART, GPIO, GND, +3.3V" },
      { label: "Max Current/Pin",   value: "1 A" },
      { label: "Voltage Rating",    value: "100 V DC" },
      { label: "Contact Resistance",value: "< 10 mΩ initial" },
      { label: "Mating Cycles",     value: "≥ 500 (MIL-DTL-83513 qualified)" },
      { label: "Locking",           value: "Jackscrews (M2 × 0.4)" },
      { label: "Environmental",     value: "IP67 (mated) per MIL-STD-810" },
      { label: "Operating Temp",    value: "−55 °C to +125 °C" },
      { label: "Faceplate Location",value: "GPP Red & GPP Black — center" },
    ],
    datasheets: [],
    related: [
      { detailId: "quad-phy-1g",   name: "1G Quad PHY (VSC8504)",    relationship: "Primary signal source" },
      { detailId: "optical-10g",   name: "10G Optical XMC Mezzanine",relationship: "Host mezzanine" },
      { detailId: "conn-vtrfa",    name: "VTRFA Optical Connector",   relationship: "Adjacent GPP faceplate connector" },
      { detailId: "conn-micro-usb",name: "Micro USB Debug Port",      relationship: "Adjacent GPP faceplate connector" },
    ],
  },

  "conn-micro-usb": {
    id: "conn-micro-usb",
    name: "Micro USB Debug Port",
    shortName: "Micro USB",
    category: "Connector",
    tagline: "USB 2.0 Micro-B · 5 Pins · JTAG Bridge · Firmware Programming",
    overview:
      "The Micro USB port on the GPP faceplate provides a USB 2.0 Micro-B debug and programming interface. It is connected to an on-board USB-to-JTAG bridge IC that exposes the ARM CoreSight JTAG/SWD debug port of the Cortex-A78AE processor, the FPGA JTAG boundary scan chain, and a UART console for bootloader and kernel debug output. During factory programming and field firmware recovery, this port allows direct NVM Flash update bypassing the authenticated firmware update path — access is physically gated by the faceplate port and requires chassis removal.",
    specs: [
      { label: "Connector",         value: "USB 2.0 Micro-B (5-pin)" },
      { label: "USB Standard",      value: "USB 2.0 High-Speed (480 Mbps)" },
      { label: "Pin 1",             value: "VBUS (5 V, 500 mA max)" },
      { label: "Pin 2",             value: "D− (USB differential)" },
      { label: "Pin 3",             value: "D+ (USB differential)" },
      { label: "Pin 4",             value: "ID (OTG — tied to GND on device side)" },
      { label: "Pin 5",             value: "GND" },
      { label: "Bridge IC",         value: "FTDI FT4232H (USB ↔ JTAG/UART)" },
      { label: "Debug Interfaces",  value: "JTAG (ARM + FPGA), UART console" },
      { label: "Operating Temp",    value: "−40 °C to +85 °C" },
      { label: "Faceplate Location",value: "GPP Red & GPP Black — right-side" },
    ],
    datasheets: [],
    related: [
      { detailId: "gpp-universal",name: "Universal GPP Card",         relationship: "Host faceplate" },
      { detailId: "fpga-1m5-slc", name: "FPGA — 1.5M SLC",           relationship: "JTAG boundary scan target" },
      { detailId: "conn-vtrfa",   name: "VTRFA Optical Connector",    relationship: "Adjacent GPP faceplate connector" },
    ],
  },

  "conn-usb-c": {
    id: "conn-usb-c",
    name: "USB-C Management Port",
    shortName: "USB-C",
    category: "Connector",
    tagline: "USB 3.2 Gen 2 · 24 Pins · Crypto Management · Key Loading",
    overview:
      "The USB-C port on the Cryptographic Processing Unit faceplate provides the primary out-of-band management interface for the FIPS 140-2 Level 3 HSM. It is used for Crypto Officer access: loading cryptographic key material, updating FIPS-approved firmware, retrieving audit logs, and running on-demand self-tests. The interface uses USB 3.2 Gen 2 (10 Gbps) for high-speed key bundle transfers and supports USB PD for external power delivery when the chassis is not powered. Physical access to this connector is a required procedural security control — the port must be covered by a tamper-evident seal during orbital operations.",
    specs: [
      { label: "Connector",          value: "USB Type-C (24-pin)" },
      { label: "USB Standard",       value: "USB 3.2 Gen 2 (10 Gbps)" },
      { label: "Power Delivery",     value: "USB PD 3.0 (up to 100 W, negotiated)" },
      { label: "Alt Mode",           value: "None (management only)" },
      { label: "Management Protocol",value: "PKCS#11 over USB (FIPS-compliant path)" },
      { label: "Key Loading",        value: "Authenticated key bundle (ECDSA P-384 signed)" },
      { label: "Audit Log Export",   value: "Signed log export, tamper-evident format" },
      { label: "Operational Control",value: "Cover with tamper-evident seal during mission" },
      { label: "Operating Temp",     value: "−40 °C to +85 °C" },
      { label: "Faceplate Location", value: "Crypto Unit — centered" },
    ],
    datasheets: [],
    related: [
      { detailId: "crypto-unit",  name: "Cryptographic Processing Unit", relationship: "Host module" },
      { detailId: "gpp-universal",name: "Universal GPP Card",            relationship: "Primary service consumer" },
    ],
  },

  "conn-mdm-15": {
    id: "conn-mdm-15",
    name: "15-Pin MDM Power Connector",
    shortName: "MDM-15",
    category: "Connector",
    tagline: "MIL-DTL-83513 · 15 Pins · 28 V DC Input · Primary Power",
    overview:
      "The 15-pin Micro-D (MDM) connector on the PSU faceplate is the primary 28 V DC power input interface for each Power Converter. It is compliant with MIL-DTL-83513 and carries the main 28 V bus, chassis ground, chassis bond, and power-good/enable signal pairs. The 15-pin format provides the current capacity required for the converter's full load (PSU Red: 5 W self + loads up to ~90 W system; PSU Black: 6 W self + loads). Pin redundancy is used for high-current rails — multiple pins are paralleled for 28 V and GND to reduce contact resistance and improve reliability.",
    specs: [
      { label: "Standard",          value: "MIL-DTL-83513 (Micro-D / MDM)" },
      { label: "Pin Count",         value: "15 pins" },
      { label: "Contact Pitch",     value: "1.27 mm (0.050\")" },
      { label: "Voltage Rating",    value: "600 V DC" },
      { label: "Max Current/Pin",   value: "5 A" },
      { label: "28V Pins",          value: "Pins 1, 2, 3 (paralleled)" },
      { label: "GND Pins",          value: "Pins 13, 14, 15 (paralleled)" },
      { label: "PWR_GOOD",          value: "Pin 4 (open-drain output, active high)" },
      { label: "ENABLE",            value: "Pin 5 (active high, 3.3V logic)" },
      { label: "Mating Cycles",     value: "≥ 500 (MIL-DTL-83513 qualified)" },
      { label: "Locking",           value: "Jackscrews (M2 × 0.4)" },
      { label: "Operating Temp",    value: "−55 °C to +125 °C" },
      { label: "Faceplate Location",value: "PSU Red & PSU Black — top MDM" },
    ],
    datasheets: [],
    related: [
      { detailId: "psu-red",   name: "Power Converter (Red)",   relationship: "Host PSU (Red)" },
      { detailId: "psu-black", name: "Power Converter (Black)", relationship: "Host PSU (Black)" },
      { detailId: "conn-mdm-9",name: "9-Pin MDM Serial Port",  relationship: "Adjacent PSU connector" },
    ],
  },

  "conn-mdm-9": {
    id: "conn-mdm-9",
    name: "9-Pin MDM Serial Port",
    shortName: "MDM-9",
    category: "Connector",
    tagline: "MIL-DTL-83513 · 9 Pins · CAN Bus · UART Telemetry · SpaceVPX Mgmt",
    overview:
      "The 9-pin Micro-D (MDM) connector on the PSU faceplate provides the serial management interface for the UT32M0R500 chassis management microcontroller. It carries CAN 2.0B (dual redundant), UART telemetry, and the SpaceVPX utility plane I²C bus for PSU health monitoring. Through this connector, the chassis management controller exports real-time voltage, current, and temperature telemetry to the external C2 subsystem, and receives power sequencing commands and on/off control. The CAN bus is the primary cross-chassis management bus connecting all SpaceVPX modules.",
    specs: [
      { label: "Standard",          value: "MIL-DTL-83513 (Micro-D / MDM)" },
      { label: "Pin Count",         value: "9 pins" },
      { label: "Contact Pitch",     value: "1.27 mm (0.050\")" },
      { label: "Pin 1",             value: "CAN_H (primary CAN 2.0B bus)" },
      { label: "Pin 2",             value: "CAN_L (primary CAN 2.0B bus)" },
      { label: "Pin 3",             value: "CAN_H2 (redundant CAN bus)" },
      { label: "Pin 4",             value: "CAN_L2 (redundant CAN bus)" },
      { label: "Pin 5",             value: "UART_TX (telemetry out, 3.3V)" },
      { label: "Pin 6",             value: "UART_RX (command in, 3.3V)" },
      { label: "Pin 7",             value: "I²C_SDA (SpaceVPX utility plane)" },
      { label: "Pin 8",             value: "I²C_SCL (SpaceVPX utility plane)" },
      { label: "Pin 9",             value: "GND (signal reference)" },
      { label: "CAN Baud Rate",     value: "1 Mbps (default) / 500 kbps" },
      { label: "Operating Temp",    value: "−55 °C to +125 °C" },
      { label: "Faceplate Location",value: "PSU Red & PSU Black — lower MDM" },
    ],
    datasheets: [
      {
        id: "ds-ut32m-cmc",
        title: "UT32M0R500 32-Bit ARM Cortex-M0+ Microcontroller Datasheet",
        docNumber: "5962-17212",
        revision: "Released 05/17/2022",
        pages: 46,
        fileSize: "5.9 MB",
        file: "/datasheets/Datasheet-UT32M0R500.pdf",
        aiSummary:
          "The CAES UT32M0R500 is the radiation-hardened ARM Cortex-M0+ microcontroller used as the SpaceVPX chassis management controller (CMC) — it drives the 9-pin MDM serial interface for CAN, UART, and I²C telemetry. Integrates dual CAN 2.0B, UART, SPI, I²C, JTAG, and a 12-bit ADC in a 143-pin ceramic LGA, rated 50 krad(Si) TID and SEL-immune at 80 MeV·cm²/mg.",
      },
    ],
    related: [
      { detailId: "psu-red",     name: "Power Converter (Red)",   relationship: "Host PSU (Red)" },
      { detailId: "psu-black",   name: "Power Converter (Black)", relationship: "Host PSU (Black)" },
      { detailId: "conn-mdm-15", name: "15-Pin MDM Power Input",  relationship: "Adjacent PSU connector" },
    ],
  },

  "conn-rj45-10g": {
    id: "conn-rj45-10g",
    name: "10GBASE-T RJ-45 Port",
    shortName: "RJ-45 10G",
    category: "Connector",
    tagline: "8P8C · 10GBASE-T · Cat-6A · Dual Port · pLEO Copper Mezzanine",
    overview:
      "The shielded RJ-45 connectors on the 10G Copper Mezzanine faceplate provide dual 10GBASE-T Ethernet ports for high-speed copper networking in pLEO mission configurations where fiber management is undesirable. Each port carries 10 Gbps full-duplex over Cat-6A or Cat-7 shielded cable up to 100 m, using the standard 8-position 8-contact (8P8C) configuration with integrated magnetics and status LEDs (Link/Activity) visible on the faceplate. The copper interface eliminates transceiver management and fiber cleaning but requires shielded cable for EMI compliance in the spacecraft environment.",
    specs: [
      { label: "Connector",          value: "RJ-45 (8P8C) — shielded" },
      { label: "Port Count",         value: "2 × per mezzanine" },
      { label: "Standard",           value: "10GBASE-T (IEEE 802.3an)" },
      { label: "Speed Options",      value: "10 Gbps / 5 Gbps / 2.5 Gbps / 1 Gbps" },
      { label: "Cable",              value: "Cat-6A (minimum) / Cat-7 preferred" },
      { label: "Max Cable Length",   value: "100 m at 10 Gbps" },
      { label: "Integrated Magnetics",value: "Yes — on-connector" },
      { label: "Status LEDs",        value: "Link (green) · Activity (amber) — faceplate visible" },
      { label: "Pin 1",              value: "BI_DA+ (bidirectional pair A+)" },
      { label: "Pin 2",              value: "BI_DA− (bidirectional pair A−)" },
      { label: "Pin 3",              value: "BI_DB+ (bidirectional pair B+)" },
      { label: "Pin 4",              value: "BI_DC+ (bidirectional pair C+)" },
      { label: "Pin 5",              value: "BI_DC− (bidirectional pair C−)" },
      { label: "Pin 6",              value: "BI_DB− (bidirectional pair B−)" },
      { label: "Pin 7",              value: "BI_DD+ (bidirectional pair D+)" },
      { label: "Pin 8",              value: "BI_DD− (bidirectional pair D−)" },
      { label: "Faceplate Location", value: "10G Copper Mezzanine — dual (left & right)" },
    ],
    datasheets: [],
    related: [
      { detailId: "net-10g-copper",name: "10G Copper Mezzanine",   relationship: "Host module" },
      { detailId: "gpp-universal", name: "Universal GPP Card",      relationship: "Host base card" },
      { detailId: "conn-vtrfa",   name: "VTRFA Optical Connector",  relationship: "Optical networking alternative" },
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
