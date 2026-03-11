// Customer-specific module configuration overrides.
// Key format: `${customerId}::${componentDetailId}`
// Used by /builds/[customerId]/modules/[componentId] to show which interfaces
// are actually active for a given customer, versus full hardware capability.

export interface InterfaceUsage {
  name: string;
  status: "active" | "partial" | "unused";
  detail: string;
}

export interface CustomerModuleOverride {
  /** One-line summary of how this module is configured for this customer */
  summary: string;
  /** Per-GPP side breakdown (Red / Black) — use when sides differ */
  perSide?: {
    red?: { note: string; interfaces: InterfaceUsage[] };
    black?: { note: string; interfaces: InterfaceUsage[] };
  };
  /** Flat interface list when both sides are identical */
  interfaces?: InterfaceUsage[];
  /** Build-specific spec values displayed alongside base specs */
  additionalSpecs?: { label: string; value: string }[];
  /** Engineering notes shown in an amber callout */
  notes?: string[];
}

export const CUSTOMER_MODULE_OVERRIDES: Record<string, CustomerModuleOverride> = {

  // ── Baseline ──────────────────────────────────────────────────────────────
  "baseline::optical-10g": {
    summary: "Standard configuration — all interfaces fully active on both Red and Black GPP slots.",
    interfaces: [
      { name: "4× 10G Optical (VTRAF)", status: "active",  detail: "All 4 SFP+ channels active — 50 Gbps full-duplex" },
      { name: "4× 1000Base-T (Nano-D)", status: "active",  detail: "Management plane — all 4 ports active" },
      { name: "1.2 TB M.2 NVMe SSD",   status: "active",  detail: "Mission data storage" },
      { name: "64 GB eMMC",             status: "active",  detail: "OS boot storage" },
      { name: "Micro-USB Debug",        status: "active",  detail: "JTAG / UART" },
    ],
  },

  // ── FMS IRAD ──────────────────────────────────────────────────────────────
  "fms-irad::optical-10g": {
    summary: "Lab prototype — full baseline optical configuration under hardware validation.",
    interfaces: [
      { name: "4× 10G Optical (VTRAF)", status: "active",  detail: "All 4 SFP+ channels active — lab instrumented" },
      { name: "4× 1000Base-T (Nano-D)", status: "active",  detail: "Management plane — all 4 ports active" },
      { name: "1.2 TB M.2 NVMe SSD",   status: "active",  detail: "Mission data storage — under test" },
      { name: "64 GB eMMC",             status: "active",  detail: "OS boot storage" },
      { name: "Micro-USB Debug",        status: "active",  detail: "JTAG / UART — primary lab access" },
    ],
    notes: [
      "FMS IRAD is the hardware validation build. Interface tests are ongoing — configuration reflects intent, not final qualification.",
    ],
  },

  // ── ABE ───────────────────────────────────────────────────────────────────
  // Red GPP: Optical mezzanine (VTRAF) + full 4× 1000Base-T management
  // Black GPP: 3× QSFP mezzanine + only 2× 100Base-T active from Nano-D Quad PHY
  "customer-a-pleo::optical-10g": {
    summary: "ABE Red GPP — VTRAF optical connector for mission data; full 4× 1000Base-T management via Nano-D.",
    perSide: {
      red: {
        note: "Red GPP mezzanine — all interfaces active",
        interfaces: [
          { name: "VTRAF FOCuS Optical",    status: "active",  detail: "Primary mission data link — all 4 SFP+ channels" },
          { name: "4× 1000Base-T (Nano-D)", status: "active",  detail: "Management plane — all 4 ports active" },
          { name: "1.2 TB M.2 NVMe SSD",   status: "active",  detail: "Mission data storage" },
          { name: "64 GB eMMC",             status: "active",  detail: "OS boot storage" },
          { name: "Micro-USB Debug",        status: "active",  detail: "JTAG / UART" },
        ],
      },
    },
  },

  "customer-a-pleo::mez-qsfp-3x": {
    summary: "ABE Black GPP — 3× QSFP+ for payload interconnect; only 2× 100Base-T active from the Nano-D Quad PHY (not full 4× 1000Base-T).",
    perSide: {
      black: {
        note: "Black GPP mezzanine — QSFP active; management PHY partially populated",
        interfaces: [
          { name: "3× QSFP+",                  status: "active",  detail: "All 3 cages active for payload interconnect" },
          { name: "2× 100Base-T (Nano-D)",      status: "partial", detail: "2 of 4 Quad PHY ports active at 100Base-T" },
          { name: "2× 1000Base-T (Nano-D)",     status: "unused",  detail: "Remaining 2 PHY ports not populated in this build" },
          { name: "1.2 TB M.2 NVMe SSD",        status: "active",  detail: "Mission data storage" },
          { name: "64 GB eMMC",                 status: "active",  detail: "OS boot storage" },
          { name: "Micro-USB Debug",            status: "active",  detail: "JTAG / UART" },
        ],
      },
    },
    notes: [
      "VTRAF (Red) and QSFP cages (Black) are faceplate assemblies on separate physical GPP slots.",
      "Nano-D 51-pin connector carries the 1G Quad PHY management traffic; ABE Black uses only 2 of the 4 PHY ports.",
    ],
  },

  // ── J2 ────────────────────────────────────────────────────────────────────
  // Red GPP: Optical mezzanine, VTRAF + RS-422 + LVDS 1PPS
  // Black GPP: Copper mezzanine at 2.5GBase-T + timing outputs + backplane daughter card
  "customer-b-pleo::optical-10g": {
    summary: "J2 Red GPP — VTRAF optical for mission data; RS-422 serial and LVDS 1PPS timing interfaces also active.",
    perSide: {
      red: {
        note: "Red GPP mezzanine — optical + discrete control interfaces",
        interfaces: [
          { name: "VTRAF FOCuS Optical",    status: "active",  detail: "Primary mission data link" },
          { name: "4× 1000Base-T (Nano-D)", status: "active",  detail: "Management plane — all 4 ports active" },
          { name: "1× RS-422 Input",        status: "active",  detail: "Control / telemetry serial input" },
          { name: "1× RS-422 Output",       status: "active",  detail: "Control / telemetry serial output" },
          { name: "1× 1PPS (LVDS) Input",   status: "active",  detail: "Precision timing reference from Atomic Clock module" },
          { name: "1.2 TB M.2 NVMe SSD",   status: "active",  detail: "Mission data storage" },
          { name: "64 GB eMMC",             status: "active",  detail: "OS boot storage" },
          { name: "Micro-USB Debug",        status: "active",  detail: "JTAG / UART" },
        ],
      },
    },
    notes: [
      "RS-422 interfaces are routed via discrete logic on the mezzanine PCB — not part of the baseline optical mezzanine.",
      "1PPS LVDS input is sourced from the CSAC Atomic Clock expansion module in Slot 1.",
    ],
  },

  "customer-b-pleo::net-10g-copper": {
    summary: "J2 Black GPP — Copper PHY limited to 2.5GBase-T; timing signals from Atomic Clock module; backplane daughter card required for additional Ethernet ports.",
    perSide: {
      black: {
        note: "Black GPP mezzanine — 2.5G copper + timing outputs + backplane d/c Ethernet",
        interfaces: [
          { name: "4× 2.5GBase-T (RJ-45)",        status: "partial", detail: "10G-capable PHY fixed at 2.5 Gbps — mission requirement" },
          { name: "4× 1PPS Outputs",               status: "active",  detail: "From CSAC Atomic Clock module via backplane" },
          { name: "4× 10 MHz Outputs",             status: "active",  detail: "From CSAC Atomic Clock module via backplane" },
          { name: "4× 100Base-T (backplane d/c)",  status: "active",  detail: "Requires backplane daughter card — Quad PHY (same IC as Baseline)" },
          { name: "2× 1000Base-T (backplane d/c)", status: "active",  detail: "Requires backplane daughter card — Quad PHY (same IC as Baseline)" },
          { name: "Micro-USB Debug",               status: "active",  detail: "JTAG / UART" },
        ],
      },
    },
    additionalSpecs: [
      { label: "Black Active Speed",     value: "4× 2.5GBase-T (PHY capable of 10G — fixed at 2.5G per mission req.)" },
      { label: "Backplane Daughter Card", value: "Required — 4× 100Base-T + 2× 1000Base-T; Quad PHY (VSC8504, same as Baseline)" },
      { label: "Timing Source",          value: "4× 1PPS · 4× 10 MHz from CSAC Atomic Clock module (Slot 1)" },
    ],
    notes: [
      "The 10G copper PHY supports auto-negotiation at 10G / 2.5G / 1G / 100M; J2 fixes negotiation to 2.5G.",
      "Backplane daughter card is a mission-specific add-on — not present in Baseline or ABE builds.",
      "RS-422 and LVDS 1PPS are on the Red GPP mezzanine; Black GPP carries the timing distribution outputs.",
    ],
  },

  // ── JL ────────────────────────────────────────────────────────────────────
  "customer-c-pleo::net-10g-copper": {
    summary: "JL pLEO Mission — copper mezzanine in standard configuration on both GPP slots. Mission-specific interface allocation TBD.",
    interfaces: [
      { name: "4× 10GBase-T (RJ-45)",   status: "active",  detail: "All 4 copper channels active — full 40 Gbps aggregate" },
      { name: "4× 1000Base-T (Nano-D)", status: "active",  detail: "Management plane — all 4 ports active" },
      { name: "Micro-USB Debug",        status: "active",  detail: "JTAG / UART" },
    ],
    notes: [
      "Interface allocation subject to JL mission requirements — update when confirmed.",
    ],
  },
};
