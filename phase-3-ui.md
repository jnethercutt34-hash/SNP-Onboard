# Phase 3: Dashboard & Comparison UI

## Objective
Build the interactive user interface to view the high-level system explanation, compare customer builds, and inspect individual hardware modules using the mock hardware data.

## Tasks
1. **Product Overview (Home Page - `/`):**
   - Build a high-level summary component explaining the Secure Network Processor (SNP) architecture, Baseline capabilities, and the 3U-VPX form factor.
2. **Build Comparison Matrix (`/builds`):**
   - Create a visual grid comparing the Baseline alongside Customer A, B, and C.
   - Use ShadCN Progress bars and Badges to visualize total SWaP-C metrics (Power and Weight).
3. **Module Deep-Dive View:**
   - Implement a dynamic route or modal (e.g., `/builds/[customerId]`) listing all modules in that specific build.
   - Highlight modifications: If a module differs from the Baseline, outline it in `--primary` (Mission Blue) and explicitly state the delta (e.g., "+5 Watts vs Baseline").