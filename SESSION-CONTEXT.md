# SNP-Onboard — Session Context
_Last updated: 2026-03-06_

> **For new agents:** Read this entire file before making any changes.
> It covers the full application architecture, all data models, key conventions,
> and a complete history of decisions made across all sessions.

---

## 1. What This App Is

An internal product onboarding and reference hub for the **SNP (Secure Network Processor)** — a ruggedized 3U SpaceVPX computing platform used in LEO and pLEO space missions. Built for engineers and customers to explore hardware configurations, compare customer builds, browse component specs/datasheets, and query an AI-powered documentation knowledge base.

- **Framework:** Next.js 16.1.6, App Router, TypeScript, Tailwind CSS v4, shadcn/ui
- **Local path:** `C:/AI-Tools/SNP-Onboard`
- **Git remote:** `https://github.com/jnethercutt34-hash/SNP-Onboard` (branch: `main`)
- **Git identity:** `jnethercutt34 <jnethercutt34@gmail.com>`
- **Run dev:** `npm run dev`
- **Type check:** `npx tsc --noEmit`
- **Network access:** Dev server binds to `0.0.0.0` by default — coworkers on the same LAN can access via the Network URL shown at startup (e.g. `http://192.168.0.118:3000`). Windows Firewall must allow inbound TCP on port 3000.
- **Desktop shortcut:** `C:\Users\jneth\Desktop\SNP-Onboard.lnk` → runs `C:\AI-Tools\SNP-Onboard\launch.bat` which starts the dev server and opens `http://localhost:3000`. Icon: `public/app-icon.ico` (dark navy chip with "SNP" in blue).

---

## 2. App Pages & Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Overview: hero, architecture cards, chassis diagram, baseline config, mezzanine options, expansion modules |
| `/builds` | `src/app/builds/page.tsx` | Product lineage diagram + customer comparison grid — all builds side by side with power/weight/diff |
| `/builds/[customerId]` | `src/app/builds/[customerId]/page.tsx` | Single build detail: chassis SVG, slot manifest, added/removed components vs baseline |
| `/modules` | `src/app/modules/page.tsx` | Full component catalog, filterable by category |
| `/modules/[componentId]` | `src/app/modules/[componentId]/page.tsx` | Component detail: specs table, datasheets, sub-modules, related components |
| `/knowledge-base` | `src/app/knowledge-base/page.tsx` | AI Q&A — client component, calls POST /api/chat |
| `/api/chat` | `src/app/api/chat/route.ts` | AI backend handler |

---

## 3. Source File Map

```
src/
  app/
    layout.tsx                        Global layout + navbar
    page.tsx                          Overview / home
    builds/
      page.tsx                        Product lineage diagram + customer comparison grid
      [customerId]/page.tsx           Build detail page
    modules/
      page.tsx                        Component catalog
      [componentId]/page.tsx          Component detail + datasheets
    knowledge-base/page.tsx           AI knowledge base (client component)
    api/chat/route.ts                 AI provider routing (mock | internal | gemini)
  components/
    chassis-diagram.tsx               SVG front-panel chassis diagram
    product-lineage.tsx               SVG product lineage / flow diagram (builds page header)
    answer-card.tsx                   Knowledge base result card
    navbar.tsx                        Site navigation bar
    ui/                               shadcn/ui primitives (badge, button, card, etc.)
  lib/
    mock-hardware.ts                  Hardware types, component catalog, builds, utilities
    mock-components.ts                Component detail page data (specs, datasheets, related)
    mock-ai.ts                        Mock AI responses + AiResponse interface
    document-store.ts                 Server-side document ingestion for knowledge base
    utils.ts                          cn() utility
public/
  app-icon.ico                        Desktop shortcut icon (dark navy chip, "SNP" in blue)
  datasheets/                         Real PDF datasheets served at /datasheets/*
  documents/                          Knowledge base document tree (see Section 7)
```

---

## 4. Data Model (mock-hardware.ts)

### ComponentType (exhaustive union — all Record<ComponentType, string> maps must include all values)
```typescript
type ComponentType =
  | "GPP_Base"
  | "Mezzanine_XMC"
  | "Networking_Mezzanine"
  | "Crypto_Module"
  | "Expansion_Module"
  | "Power_Converter"
```

### HardwareComponent
```typescript
interface HardwareComponent {
  id: string;
  name: string;
  type: ComponentType;
  powerDrawWatts: number;
  weightGrams: number;
  description: string;
  subComponents?: SubComponent[];   // on-board chips/storage shown in UI
  detailId?: string;                // links to mock-components.ts entry
}
```

### VPXSlot
```typescript
interface VPXSlot {
  slotNumber: number;               // 0-based, maps to physical chassis position
  baseCard: HardwareComponent;
  attachedMezzanines: HardwareComponent[];
}
```

### SystemBuild
```typescript
interface SystemBuild {
  id: string;
  customerName: string;
  description: string;
  slots: VPXSlot[];
  totalSystemPower: number;         // dynamically calculated
  totalSystemWeight: number;        // dynamically calculated
}
```

---

## 5. Hardware Catalog

### Component Instances

| id | Name | Type | W | g | detailId |
|---|---|---|---|---|---|
| `gpp-universal-a` | Universal GPP Card (Red) | GPP_Base | 32 | 280 | gpp-universal |
| `gpp-universal-b` | Universal GPP Card (Black) | GPP_Base | 31 | 280 | gpp-universal |
| `mez-optical-10g` | 10G Optical XMC Mezzanine | Networking_Mezzanine | 6 | 40 | optical-10g |
| `mez-copper-10g` | 10G Copper XMC Mezzanine | Networking_Mezzanine | 3 | 25 | net-10g-copper |
| `mez-qsfp-3x` | 3× QSFP XMC Mezzanine | Networking_Mezzanine | 8 | 55 | mez-qsfp-3x |
| `crypto-unit` | Cryptographic Processing Unit | Crypto_Module | 10 | 130 | crypto-unit |
| `timing-atomic-clock` | Timing & Networking Expansion | Expansion_Module | 13 | 275 | timing-atomic-clock |
| `psu-red` | Power Converter (Red) | Power_Converter | 5 | 140 | psu-red |
| `psu-black` | Power Converter (Black) | Power_Converter | 6 | 155 | psu-black |

**GPP two-CCA architecture:**
- Each GPP is two CCAs: **Universal carrier board** + **Mezzanine daughter card** (connects via FMC connector)
- Universal board is fixed — does not change unit to unit
- Universal board contains: AMD Versal VM1502 (1.5M SLC FPGA fabric, dual ARM Cortex-A78AE, AI Engine), 16 GB DDR4, 2 Gb MRAM, board-management microcontroller
- Mezzanine is the only mission-variable CCA per GPP

**GPP subComponents** (on Universal board):
- Both GPP cards: 16 GB DDR4 SDRAM, 2 Gb MRAM, FPGA 1.5M SLC (Versal VM1502)

**mez-optical-10g subComponents** (on mezzanine, NOT on GPP base card):
- 1G Quad PHY (VSC8504), 1.2 TB M.2 SSD (Virtium StorFly NVMe Gen3), 64 GB eMMC (Virtium 5.1)

**Note:** Copper mezzanines (`mez-copper-10g`) do NOT have NVMe — NVMe is only on the optical mezzanine.

### Customer Builds

#### Standard Chassis Layout (VITA 78 SpaceVPX, 7 slots, 0-indexed)
```
Slot 0: PSU Red
Slot 1: Spare (or Expansion Module)
Slot 2: Spare
Slot 3: GPP Red
Slot 4: Crypto Module
Slot 5: GPP Black
Slot 6: PSU Black
```

#### Builds

| Build ID | customerName | Description | Total Power | Slot 1 | Crypto |
|---|---|---|---|---|---|
| `baseline` | Baseline | Dual optical mezzanine — reference config | 96 W | empty | MARCC |
| `customer-a-pleo` | ABE | pLEO — 2× ACAM (cold spare), Red: VTRFA, Black: 3× QSFP | 90 W | empty | 2× ACAM |
| `customer-b-pleo` | J2 | pLEO — copper mezzanines + Atomic Clock | 103 W | timing-atomic-clock | — |
| `customer-c-pleo` | JL | pLEO — copper mezzanines both GPPs | 90 W | empty | — |
| `fms-irad` | FMS | IRAD lab prototype — ACAM crypto, MDM connector for 1000Base-T | 96 W | empty | ACAM |

**Crypto callouts:**
- FMS IRAD → **ACAM** crypto
- Baseline → **MARCC** crypto
- ABE → **2× ACAM** (one cold spare)

**Connector callouts:**
- Baseline GPP Red & Black: VTRFA (optical), Nano-D (4× 1000Base-T), USB
- FMS GPP Red & Black: Optical 10G mezzanine, MDM connector (4× 1000Base-T)
- ABE GPP Red: VTRFA · Nano-D · USB; GPP Black: 3× QSFP · Nano-D · USB

**Power math (baseline / FMS):** PSU Red (5) + GPP Red (32) + Optical (6) + Crypto (10) + GPP Black (31) + Optical (6) + PSU Black (6) = **96 W**
**Power math (J2):** PSU Red (5) + Atomic Clock (13) + GPP Red (32) + Copper (3) + Crypto (10) + GPP Black (31) + Copper (3) + PSU Black (6) = **103 W**

### Utility Functions (mock-hardware.ts)
- `getBuildById(id)` — returns SystemBuild or undefined
- `flattenComponents(build)` — returns all base cards + mezzanines as a flat array
- `getBuildDifferences(baselineId, comparisonId)` — returns BuildDiff with powerDelta, weightDelta, added/removed/shared components

---

## 6. Component Detail Pages (mock-components.ts)

Each entry is a `ComponentDetail` object keyed by `detailId`. Contains:
- `id`, `name`, `shortName`, `category`, `tagline`, `overview`
- `specs: { label, value }[]`
- `datasheets: { id, title, docNumber, revision, pages, fileSize, file?, aiSummary }[]`
- `related: { detailId, name, relationship }[]`
- `subModules?: { detailId, name, category, tagline }[]`

**Connector entries** (detailId → `/modules/[detailId]`):
`conn-vtrfa`, `conn-nano-51`, `conn-micro-usb`, `conn-usb-c`, `conn-mdm-15`, `conn-mdm-9`, `conn-rj45-10g`

**Storage/chip entries:**
`sdram-16gb`, `nvm-flash-2gb`, `fpga-1m5-slc`, `ssd-m2-1p2tb`, `emmc-64gb`, `quad-phy-1g`

**Power rail entries:**
`psu-rail-3v3-aux`, `psu-rail-3v3`, `psu-rail-5v`, `psu-rail-12v`

---

## 7. Knowledge Base & AI (mock-ai.ts, document-store.ts, api/chat/route.ts)

### AiResponse Type
```typescript
interface AiResponse {
  title: string;
  summary: string;
  source?: string;        // optional — real AI won't return section references
  manual?: ManualSource;  // optional — "ICD" | "IDD" | "SUM"
  confidence?: ConfidenceLevel; // optional — "High" | "Medium" | "Low"
  relatedKeys?: string[];
}
```
`source`, `manual`, `confidence` are **optional** — mock responses have them, live AI responses won't. `AnswerCard` conditionally renders those badges.

### AI Provider Routing (`/api/chat` POST)
Reads `NEXT_PUBLIC_AI_PROVIDER` env var:
- `"mock"` (default): keyword search in `AI_RESPONSES` dict in mock-ai.ts + 800ms fake delay
- `"internal"`: loads all docs via document-store, injects as system prompt context, calls OpenAI-compatible API
- `"gemini"`: stubbed, returns 501

### Environment Variables (copy `.env.local.example` → `.env.local`)
```
NEXT_PUBLIC_AI_PROVIDER=internal
GDMS_AI_ENDPOINT=https://your-company-ai.example.com/v1
GDMS_AI_AUTH_TOKEN=your-api-key-here
GDMS_AI_MODEL=gpt-4
```

### Document Store (document-store.ts)
- Scans `public/documents/` recursively on first query
- Supported formats: `.pdf` (pdf-parse), `.docx` (mammoth), `.xlsx`/`.xls` (xlsx), `.txt` (fs.readFile)
- Placeholder `.txt` files are **skipped** — they contain only folder descriptions, no content worth indexing (only real documents get ingested)
- Results cached in-memory for the Node.js process lifetime
- Call `clearDocumentCache()` to force reload

### Document Folder Structure
```
public/documents/
  icd/                          Interface Control Documents
  idd/                          Interface Design Documents
  irs/                          Interface Requirements Spec
  requirements/
    system/                     System Requirements Spec (SyRS)
    hardware/                   Hardware Requirements Spec (HRS)
    software/                   Software Requirements Spec (SRS)
  design/
    hardware/                   Hardware Design Document (HDD)
    software/                   Software Design Document (SDD)
    firmware/                   Firmware Design Document (FDD)
  test/
    plans/                      Test Plans
    procedures/                 Test Procedures
    reports/                    Test Reports
  certifications/               Cert packages (FIPS, radiation, etc.)
  standards/                    Reference standards
  user-docs/                    Operator/user manuals (SUM)
  customer/
    baseline/
    abe-pleo/
    j2-pleo/
    jl-pleo/
    customer-a-pleo/            Legacy folder
    customer-b-geo/             Legacy folder
```

### Mock Test Documents (immediately queryable)
- `public/documents/icd/SNP-ICD-001_RevA.txt` — all connector pinouts, fault codes, slot assignments, environmental limits
- `public/documents/idd/SNP-IDD-001_RevA.txt` — GPP/FPGA/crypto architecture, mezzanine design, SWaP-C rationale, boot sequence
- `public/documents/user-docs/SNP-SUM-001_RevA.txt` — full fault code troubleshooting guide (ERR_0x01–ERR_0x0F), GSE interface, maintenance procedures, weight/power specs

---

## 8. Chassis SVG Diagram (chassis-diagram.tsx)

SVG-based front-panel diagram rendered as a React server component. Each VPX slot type has its own `*Face` sub-component. Layout is computed from slot numbers.

**Connector components** (SVG sub-components):
- `VtrfaAirbornV` — AirBorn FOCuS optical connector (w=18, h=55)
- `NanoConnV` — Nano-D 51-pin connector (w=14, h=42)
- `MicroUsbV` — Micro-USB (w=8, h=14)
- `UsbC`, `Rj45`, `MdmConn` — other connector types

**Clickable connectors:** All connectors are wrapped in SVG `<a href="/modules/conn-[id]">` anchors. Hover uses `.conn-link:hover { filter: brightness(2); }` defined in a `<style>` block inside the SVG.

**GPP front panel connector positions (x = slot x-offset, FY = front panel y-offset):**
- VTRFA: `px={x+24} py={FY+50}`, label at `y={FY+131}`
- NANO: `px={x+64} py={FY+57}`, label at `y={FY+131}`
- USB: `px={x+62} py={FY+114}`, label at `y={FY+136}`

**Atomic Clock front panel:** Shows "PRECISION SYNC" label (not "GEO MISSION")

---

## 9. Product Lineage Diagram (product-lineage.tsx)

SVG infographic rendered at the top of `/builds`. Horizontally scrollable — SVG scales to fill container width with `style={{ width: '100%', minWidth: '720px' }}` inside an `overflow-x-auto` wrapper.

**Layout (viewBox="0 0 720 408"):**
- **Main horizontal spine (left → right):** FMS → Baseline → Next Gen
  - FMS → Baseline: solid blue arrow labeled "all updates"
  - Baseline → Next Gen: dashed arrow (future/roadmap)
- **Customer variants:** branch downward from Baseline bottom-center
  - Vertical trunk + horizontal distributor bar + 3 drop arrows
  - Junction dot at the T-intersection
  - Customers in a row: ABE · J2 · JL

**Node dimensions:**
- FMS: `{ x:33, y:40, w:175, h:155, cx:121 }`
- Baseline: `{ x:258, y:18, w:225, h:158, cx:370 }`
- Next Gen: `{ x:533, y:40, w:155, h:70, cx:611 }`
- forkY: 245, custY: 265, custW: 130, custH: 110
- ABE: `{ x:126, cx:191 }` · J2: `{ x:305, cx:370 }` · JL: `{ x:484, cx:549 }`

**Per-card (Red/Black) callout convention:**
- All spec lines split into "Red: ..." (fill `hsl(2 60% 55%)`) and "Black: ..." (fill `hsl(215 10% 48%)`)
- Connector sub-lines indented under each card in dimmer versions of the same colors
- Shared specs prefixed "R+B:" (fill `hsl(215 20% 38%)`)
- Wattage callouts: `hsl(45 80% 62%)` (amber-gold) so they pop
- "7-slot SpaceVPX · MARCC Crypto" in Baseline: `hsl(217 55% 62%)` (mission blue)

**Node content summary:**
- FMS: amber glow, IRAD badge — 16 GB DDR4 · 2 Gb NVM · FPGA 1.5M SLC (shared), Red/Black Optical 10G each with MDM · 4× 1000Base-T sub-line, ACAM Crypto, HW & FW validation
- Baseline: mission blue glow, PRODUCTION badge — Red/Black: 16 GB DDR4 · 1.2 TB NVMe · Optical 10G + VTRFA · Nano-D (4× 1000Base-T) · USB, 7-slot SpaceVPX · MARCC Crypto, 96 W
- Next Gen: ghost/dashed border, roadmap placeholder
- ABE: pLEO · 2× ACAM (Cold Spare), Red: 16 GB DDR4 · Copper 10G + VTRFA · Nano-D · USB, Black: 16 GB DDR4 · Copper 10G + 3× QSFP · Nano-D · USB, R+B: 2 Gb NVM · FPGA 1.5M SLC, 90 W
- J2: pLEO · Atomic Clock, Red/Black Copper 10G + VTRFA · Nano-D · USB each, R+B: 2 Gb NVM · FPGA 1.5M SLC, 103 W
- JL: pLEO Mission, Red/Black Copper 10G + VTRFA · Nano-D · USB each, R+B: 2 Gb NVM · FPGA 1.5M SLC, 90 W

**"CUSTOMER VARIANTS" label:** positioned below the three customer boxes at `y={custY + custH + 12}`

---

## 10. Builds Page Badge Logic (builds/page.tsx)

Three badge types:
```typescript
const isBaseline = build.id === "baseline";
const isIrad     = build.id === "fms-irad";

// isBaseline  → blue  "Baseline" badge
// isIrad      → amber "IRAD · Lab" badge
// otherwise   → secondary "pLEO" badge
```

---

## 11. Overview Page (page.tsx) — Key Sections

### System Architecture Cards (6 cards, lg:grid-cols-3)
1. **3U VPX Form Factor** — VITA 78, PCIe Gen 3, operating range
2. **Dual-GPP — Two-CCA Architecture** — Each GPP is Universal carrier + Mezzanine daughter card; two GPPs in hot-standby, <200 ms switchover
3. **GPP Universal Board** — AMD Versal VM1502 (1.5M SLC FPGA, dual ARM Cortex-A78AE, AI Engine), 16 GB DDR4, 2 Gb MRAM, uController. **Fixed design — does not change unit to unit.**
4. **ECC-Protected Memory** — 16 GB DDR4 + 2 Gb MRAM (radiation-immune, non-volatile)
5. **High-Speed Networking** — 1G Quad PHY, 10 Gbps fiber-optic / copper swap
6. **Mezzanine & Spare Slot Expandability** — Mezzanine connects via **FMC connector** to Universal board. Any mezzanine can go on baseline GPPs or spare slot GPPs.

### Mezzanine Options (3 cards, lg:grid-cols-3)
- 10G Optical XMC (Baseline) → `/modules/optical-10g`
- 10G Copper XMC (pLEO) → `/modules/net-10g-copper`
- 3× QSFP XMC (High-Density) → `/modules/mez-qsfp-3x`

### Expansion Modules (3 cards, sm:grid-cols-2 — note: now 3 cards in a 2-col grid)
- Cryptographic Processing Unit → `/modules/crypto-unit`
- Timing & Networking Expansion (Atomic Clock) → `/modules/timing-atomic-clock`
- **CSAC Precision Timing Module** (static card, no link) — dedicated VPX expansion module with CSAC, PTP < 50 ns, 1PPS, 10 MHz. **Requires its own VPX slot — not a mezzanine swap.** Red/Black domain filtering for 1PPS and 10 MHz outputs.

---

## 12. Key Conventions & Rules

### Never Break These
1. **No GEO** — product is LEO/pLEO only. No GEO references anywhere in UI, descriptions, or data.
2. **Duplicate key fix** — `flattenComponents()` can return the same mezzanine ID twice (once per GPP slot). Always use `key={\`${comp.id}-${i}\`}` with index in `.map()` for component lists in JSX.
3. **ComponentType Record maps are exhaustive** — `Record<ComponentType, string>` maps appear in `builds/[customerId]/page.tsx` (`componentTypeBadgeClass`). Must include ALL ComponentType values or TypeScript errors.
4. **pdf-parse in production deps** — must stay in `dependencies` (not `devDependencies`) and listed in `next.config.ts` `serverExternalPackages`.
5. **AiResponse optional fields** — `manual`, `source`, `confidence` are optional. Do not make them required.

### Build ID Convention
All non-baseline, non-IRAD builds use `customer-[letter]-pleo` IDs. The badge shows `"pLEO"` for these. FMS uses `fms-irad` and gets an amber IRAD badge.

### SHORT_NAME Map (builds/page.tsx)
Maps component IDs → short display labels for badge chips:
```typescript
const SHORT_NAME: Record<string, string> = {
  "gpp-universal-a":     "GPP Red",
  "gpp-universal-b":     "GPP Black",
  "crypto-unit":         "Crypto Unit",
  "psu-red":             "PSU Red",
  "psu-black":           "PSU Black",
  "mez-optical-10g":     "Optical 10G",
  "mez-copper-10g":      "Copper 10G",
  "mez-qsfp-3x":         "3× QSFP",
  "timing-atomic-clock": "Atomic Clock",
}
```

### next.config.ts serverExternalPackages
```typescript
serverExternalPackages: ["pdf-parse", "mammoth", "xlsx"]
```

---

## 13. Dependencies

### Production
`next@16.1.6`, `react@19.2.3`, `react-dom@19.2.3`, `openai@^6.25.0`, `mammoth@^1.11.0`, `xlsx@^0.18.5`, `pdf-parse@^2.4.5`, `lucide-react`, `radix-ui`, `clsx`, `tailwind-merge`, `class-variance-authority`

### Dev
`typescript`, `tailwindcss@^4`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next`, `shadcn`, `tw-animate-css`, `@types/node`, `@types/react`, `@types/react-dom`

---

## 14. Git Commit History

```
(this session)   Update session context
beb86e2          Update session context
6357cf0          Add FMS IRAD build and product lineage diagram
15b398e          Update session context + fix pdf-parse production dependency
8987e2f          Add SESSION-CONTEXT.md for future agent onboarding
53625d5          Add AI knowledge base integration, GEO removal, new mezzanine, and document store
```

---

## 15. Known Issues / Pending Work

- **pdf-parse v2.4.5** — atypical version (npm latest is 1.1.1). Moved to production deps. If PDF parsing fails, verify with `node -e "require('pdf-parse')"`.
- **Document ingestion cache** — In-memory only. Restart dev server to pick up newly dropped documents.
- **Placeholder .txt files** — `PLACE_*_HERE.txt` files in every `public/documents/` subfolder will be ingested as noise when real documents are added. Consider adding a `PLACE_*` filename filter to `document-store.ts`.
- **Gemini provider** — Stubbed in `/api/chat/route.ts`, returns 501.
- **FMS build detail page** — `fms-irad` build has no special treatment on the `/builds/[customerId]` detail page beyond the standard diff view vs baseline (which correctly shows 0 changes, same config).
- **Next Gen node** — Currently a ghost placeholder. As requirements are defined, this should become a real build entry with its own ID and configuration.
- **CSAC Precision Timing Module** — Static card on overview page only; no detail page (`/modules/[id]`) or hardware catalog entry yet.
- **mock-hardware.ts memory** — SESSION-CONTEXT says 2 Gb MRAM but code may still reference "NVM Flash". Verify and update `mock-hardware.ts` / `mock-components.ts` to use MRAM terminology.

---

## 16. Session Trigger

When the user types **"End of Session"**, always:
1. Overwrite this file (`SESSION-CONTEXT.md`) with the latest state
2. `git add SESSION-CONTEXT.md && git commit -m "Update session context" && git push origin main`
