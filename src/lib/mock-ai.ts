// ─── Interfaces ──────────────────────────────────────────────────────────────

export type ConfidenceLevel = "High" | "Medium" | "Low";
export type ManualSource = "ICD" | "IDD" | "SUM";

export interface AiResponse {
  title: string;
  /** e.g. "SUM - Sec 4.2", "ICD - Sec 2.1" */
  source: string;
  manual: ManualSource;
  summary: string;
  confidence: ConfidenceLevel;
  relatedKeys?: string[];
}

// ─── Mock Response Dictionary ─────────────────────────────────────────────────

export const AI_RESPONSES: Record<string, AiResponse> = {
  // ── Fault / Error Codes (SUM) ─────────────────────────────────────────────
  ERR_0x09: {
    title: "Fault Code: ERR_0x09",
    source: "SUM - Sec 4.2",
    manual: "SUM",
    summary:
      "Loss of sync with Timing & Networking module. Verify 10 Gbps optical connection and check CSAC lock status via telemetry register 0x4A.",
    confidence: "High",
    relatedKeys: ["ERR_0x0A", "timing-atomic-clock", "net-10g-optical"],
  },
  ERR_0x0A: {
    title: "Fault Code: ERR_0x0A",
    source: "SUM - Sec 4.3",
    manual: "SUM",
    summary:
      "FPGA configuration load failure. The bitstream CRC check failed during boot. Re-flash NVM with a validated bitstream image and power-cycle the unit.",
    confidence: "High",
    relatedKeys: ["ERR_0x09", "gpp-universal-a", "gpp-universal-b"],
  },
  ERR_0x1C: {
    title: "Fault Code: ERR_0x1C",
    source: "SUM - Sec 5.1",
    manual: "SUM",
    summary:
      "GPP Black heartbeat timeout. Processor has not responded within the 500 ms watchdog window. Initiate warm reset via command 0xF3. If fault persists, swap to single-GPP redundancy mode.",
    confidence: "High",
    relatedKeys: ["ERR_0x1D", "gpp-universal-b"],
  },
  ERR_0x1D: {
    title: "Fault Code: ERR_0x1D",
    source: "SUM - Sec 5.2",
    manual: "SUM",
    summary:
      "GPP Red/Black memory parity error detected. ECC correction applied but uncorrectable multi-bit error threshold exceeded. Schedule RAM module replacement at next maintenance window.",
    confidence: "High",
    relatedKeys: ["ERR_0x1C", "gpp-universal-a", "gpp-universal-b"],
  },
  ERR_0x2B: {
    title: "Fault Code: ERR_0x2B",
    source: "SUM - Sec 6.4",
    manual: "SUM",
    summary:
      "NVM write endurance limit approaching. Flash block at address range 0x80000–0x9FFFF has exceeded 90% of rated write cycles. Migrate configuration data to a healthy block.",
    confidence: "Medium",
    relatedKeys: ["gpp-universal-a", "gpp-universal-b"],
  },

  // ── Interfaces (ICD) ─────────────────────────────────────────────────────
  "SpaceVPX-backplane": {
    title: "SpaceVPX Backplane Interface",
    source: "ICD - Sec 2.1",
    manual: "ICD",
    summary:
      "The SNP uses a 3U SpaceVPX backplane with VITA 78 compliance. Power rails: +3.3 V, +5 V, +12 V. Control plane via PCIe Gen 3 x4. Data plane via dual 10 Gbps SerDes lanes per slot.",
    confidence: "High",
    relatedKeys: ["net-10g-optical", "net-10g-copper"],
  },
  "optical-interface": {
    title: "10 Gbps Optical Transceiver Interface",
    source: "ICD - Sec 3.2",
    manual: "ICD",
    summary:
      "Single-mode LC fiber connectors, 1310 nm wavelength. Max fiber run: 10 km. SFP+ form factor. Compatible with Customer B GEO ground station uplink. Not present in Customer A pLEO configuration.",
    confidence: "High",
    relatedKeys: ["net-10g-optical", "net-10g-copper", "SpaceVPX-backplane"],
  },
  "copper-interface": {
    title: "10 Gbps Copper Ethernet Interface",
    source: "ICD - Sec 3.3",
    manual: "ICD",
    summary:
      "RJ-45 10GBase-T interface. Reduced SWaP-C profile for pLEO missions. 5 W lower power draw versus optical variant. Maximum cable length 30 m. Used exclusively in Customer A pLEO build.",
    confidence: "High",
    relatedKeys: ["net-10g-copper", "optical-interface"],
  },
  "csac-timing": {
    title: "Chip-Scale Atomic Clock Timing Interface",
    source: "ICD - Sec 4.1",
    manual: "ICD",
    summary:
      "1 PPS output with <100 ns absolute accuracy. Disciplined oscillator interface over RS-422. Allan deviation < 3×10⁻¹⁰ at 1 s. Required for GEO precision timing. Exposed via expansion slot on Customer B build only.",
    confidence: "High",
    relatedKeys: ["timing-atomic-clock", "ERR_0x09"],
  },

  // ── Design (IDD) ─────────────────────────────────────────────────────────
  "fpga-signal-processing": {
    title: "FPGA Signal Processing Architecture",
    source: "IDD - Sec 7.1",
    manual: "IDD",
    summary:
      "The 1.5M SLC FPGA implements a pipelined FFT core and Reed-Solomon FEC codec. The baseline bitstream targets 250 MHz clock. Partial reconfiguration regions allow in-orbit algorithm updates without full re-flash.",
    confidence: "High",
    relatedKeys: ["gpp-universal-a", "gpp-universal-b", "ERR_0x0A"],
  },
  "swap-c-pleo": {
    title: "pLEO SWaP-C Design Rationale",
    source: "IDD - Sec 1.4",
    manual: "IDD",
    summary:
      "Customer A pLEO configuration targets a 134 W total power budget, 34 W below Baseline. Key trade: optical → copper networking saves 5 W and 40 g. Reduced radiation hardening requirements in LEO allow omission of additional shielding mass.",
    confidence: "Medium",
    relatedKeys: ["net-10g-copper", "customer-a-pleo"],
  },
  "geo-timing-rationale": {
    title: "GEO Precision Timing Design Rationale",
    source: "IDD - Sec 1.5",
    manual: "IDD",
    summary:
      "Customer B GEO mission requires nanosecond-class time synchronization for inter-satellite link coordination. The atomic clock expansion adds 18 W and 275 g but eliminates dependency on GPS-disciplined ground references during eclipse periods.",
    confidence: "Medium",
    relatedKeys: ["timing-atomic-clock", "csac-timing", "customer-b-geo"],
  },
  "redundancy-architecture": {
    title: "Dual-GPP Redundancy Architecture",
    source: "IDD - Sec 3.2",
    manual: "IDD",
    summary:
      "GPP Red is the primary processor; Black operates in hot-standby. Switchover latency < 200 ms via SpaceVPX control plane. Both cards share access to the SDRAM and NVM via the backplane arbiter. Black can be demoted to co-processing mode to double compute throughput.",
    confidence: "High",
    relatedKeys: ["gpp-universal-a", "gpp-universal-b", "ERR_0x1C"],
  },
};

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Returns matching responses for a free-text query by checking key and title. */
export function searchAiResponses(query: string): AiResponse[] {
  const q = query.toLowerCase();
  return Object.entries(AI_RESPONSES)
    .filter(
      ([key, resp]) =>
        key.toLowerCase().includes(q) ||
        resp.title.toLowerCase().includes(q) ||
        resp.summary.toLowerCase().includes(q) ||
        resp.source.toLowerCase().includes(q)
    )
    .map(([, resp]) => resp);
}

/** Returns all entries for a given manual source. */
export function getResponsesByManual(manual: ManualSource): AiResponse[] {
  return Object.values(AI_RESPONSES).filter((r) => r.manual === manual);
}
