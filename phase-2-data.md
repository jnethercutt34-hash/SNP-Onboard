# Phase 2: Mock Data Architecture (Hardware & AI)

## Objective
Create a strongly typed mock data layer that defines the Baseline product, Customer builds for SWaP-C comparisons, and dummy AI responses for the Knowledge Base UI.

## Tasks
1. **Hardware Data (`src/lib/mock-hardware.ts`):**
   - Define TS Interfaces: `HardwareModule` (id, name, type, powerDraw, weight, description) and `SystemBuild` (id, customerName, description, modules, totalPower, totalWeight).
   - Populate Builds:
     - **Baseline:** Dual Universal GPP cards, 16GB RAM, 2Gb NVM, FPGA (1.5M SLCs), 10Gbps optical networking.
     - **Customer A (pLEO):** Swaps optical 10G for Copper; lower radiation-hardening overhead.
     - **Customer B (GEO):** Adds Timing & Networking expansion module with Atomic Clock; higher power draw.
2. **AI Mock Data (`src/lib/mock-ai.ts`):**
   - Create a dictionary/object of dummy responses simulating the ICD, IDD, and SUM manuals.
   - Example entry: `"ERR_0x09": { title: "Fault Code: ERR_0x09", source: "SUM - Sec 4.2", summary: "Loss of sync with Timing & Networking module. Verify 10Gbps optical connection.", confidence: "High" }`
3. **Utility Functions:**
   - Create `getBuildDifferences(baselineId, comparisonId)` to return the delta in power, weight, and swapped modules between any two builds.