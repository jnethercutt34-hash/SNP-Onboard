# SNP-Onboard — Session Context
_Last updated: 2026-02-28_

## What This App Is
A Next.js 16 (App Router, TypeScript, Tailwind v4) internal product onboarding hub for the **SNP (Secure Network Processor)** — a ruggedized 3U SpaceVPX computing platform for LEO/pLEO space missions. The app lives at `C:/AI-Tools/SNP-Onboard` and is pushed to `https://github.com/jnethercutt34-hash/SNP-Onboard`.

---

## App Structure

```
src/
  app/
    page.tsx                    — Overview / home page
    builds/
      page.tsx                  — Customer comparison grid
      [customerId]/page.tsx     — Individual build detail page
    modules/
      page.tsx                  — Full component catalog
      [componentId]/page.tsx    — Component detail + datasheet page
    knowledge-base/page.tsx     — AI document Q&A (client component)
    api/chat/route.ts           — AI backend (mock | internal | gemini)
  lib/
    mock-hardware.ts            — All hardware component types, builds, utilities
    mock-components.ts          — Detailed component pages (specs, datasheets, related)
    mock-ai.ts                  — Mock AI responses + AiResponse type
    document-store.ts           — Server-side doc ingestion (PDF/DOCX/XLSX/TXT)
  components/
    chassis-diagram.tsx         — SVG chassis front-panel diagram (clickable connectors)
    answer-card.tsx             — Knowledge base result card
    navbar.tsx                  — Site navigation
public/
  datasheets/                   — Real component PDFs served to /datasheets/*
  documents/                    — Knowledge base documents (PDF/DOCX/XLSX/TXT)
    icd/                        — Interface Control Documents
    idd/                        — Interface Design Documents
    irs/                        — Interface Requirements Specs
    requirements/{system,hardware,software}/
    design/{hardware,software,firmware}/
    test/{plans,procedures,reports}/
    certifications/
    standards/
    user-docs/                  — User/operator manuals
    customer/{baseline,abe-pleo,j2-pleo,jl-pleo}/
```

---

## Hardware Catalog (mock-hardware.ts)

### ComponentType union
`"GPP_Base" | "Mezzanine_XMC" | "Networking_Mezzanine" | "Crypto_Module" | "Expansion_Module" | "Power_Converter"`

### Component Catalog
| id | Name | Type | W | g |
|---|---|---|---|---|
| gpp-universal-a | Universal GPP Card (Red) | GPP_Base | 32 | 280 |
| gpp-universal-b | Universal GPP Card (Black) | GPP_Base | 31 | 280 |
| mez-optical-10g | 10G Optical XMC Mezzanine | Networking_Mezzanine | 6 | 40 |
| mez-copper-10g | 10G Copper XMC Mezzanine | Networking_Mezzanine | 3 | 25 |
| mez-qsfp-3x | 3× QSFP XMC Mezzanine | Networking_Mezzanine | 8 | 55 |
| crypto-unit | Cryptographic Processing Unit | Crypto_Module | 10 | 130 |
| timing-atomic-clock | Timing & Networking Expansion | Expansion_Module | 13 | 275 |
| psu-red | Power Converter (Red) | Power_Converter | 5 | 140 |
| psu-black | Power Converter (Black) | Power_Converter | 6 | 155 |

### Customer Builds (VITA 78 7-slot chassis, slots 0–6)
| Build ID | Customer | Description | Power | Slots Used |
|---|---|---|---|---|
| baseline | Baseline | Dual optical mezzanine | 96 W | 5 |
| customer-a-pleo | ABE | pLEO copper mezzanines | 90 W | 5 |
| customer-b-pleo | J2 | pLEO copper + atomic clock (slot 1) | 103 W | 6 |
| customer-c-pleo | JL | pLEO copper mezzanines | 90 W | 5 |

Standard slot layout: Slot 0=PSU Red, 1=Spare/Expansion, 2=Spare, 3=GPP Red, 4=Crypto, 5=GPP Black, 6=PSU Black

---

## AI Knowledge Base

### How it works
- `GET /knowledge-base` — client page with search input
- `POST /api/chat` — backend, reads `NEXT_PUBLIC_AI_PROVIDER` env var:
  - `mock` (default): keyword search against `mock-ai.ts` hardcoded entries
  - `internal`: loads all docs from `public/documents/`, builds context string, calls OpenAI-compatible API
  - `gemini`: stubbed (not implemented)

### Environment variables needed (copy .env.local.example → .env.local)
```
NEXT_PUBLIC_AI_PROVIDER=internal
GDMS_AI_ENDPOINT=https://your-company-ai.example.com/v1
GDMS_AI_AUTH_TOKEN=your-api-key-here
GDMS_AI_MODEL=gpt-4
```

### Document ingestion (document-store.ts)
- Scans `public/documents/` recursively
- Supported: `.pdf` (pdf-parse), `.docx` (mammoth), `.xlsx`/`.xls` (xlsx), `.txt` (fs.readFile)
- In-memory cache: loaded once per Node.js process cold start
- Drop files in, restart dev server to pick up new docs
- Mock test docs already present: `SNP-ICD-001_RevA.txt`, `SNP-IDD-001_RevA.txt`, `SNP-SUM-001_RevA.txt`

---

## Chassis Diagram (chassis-diagram.tsx)

SVG-based front-panel diagram. Each card type has its own face component. Connectors are wrapped in `<a href="/modules/conn-[id]">` SVG anchors with `.conn-link:hover { filter: brightness(2); }`.

GPP front panel connectors:
- VTRFA (AirBorn FOCuS optical) → `/modules/conn-vtrfa`
- NANO-D 51-pin → `/modules/conn-nano-51`
- Micro-USB (below other two) → `/modules/conn-micro-usb`

Other connectors: USB-C (crypto), MDM-15 + MDM-9 (PSU), dual RJ-45 (copper mezzanine)

---

## Key Decisions & Conventions

- **No GEO** — product is LEO/pLEO only. All GEO references have been removed.
- **Duplicate key pattern**: `flattenComponents()` can return the same mezzanine ID twice (once per GPP). Always use `key={`${comp.id}-${i}`}` with index in `.map()` for component lists.
- **AiResponse type**: `manual`, `source`, `confidence` are optional — real AI responses won't have them; mock responses do.
- **SHORT_NAME map** in `builds/page.tsx` maps component IDs to display labels for badges.
- **componentTypeBadgeClass** in `builds/[customerId]/page.tsx` must include all ComponentType values (Record<ComponentType, string> is exhaustive).
- `pdf-parse` must be in `dependencies` (not devDependencies) and in `next.config.ts` `serverExternalPackages`.

---

## Recent Work (this session)
- Removed all GEO callouts across the entire codebase
- Added 3× QSFP XMC mezzanine to catalog, component detail pages, and overview
- Wired up real AI integration in `/api/chat` using OpenAI SDK (configurable base URL)
- Built `document-store.ts` for server-side multi-format document ingestion
- Added `.env.local.example` for API configuration
- Added mock test documents (ICD, IDD, SUM) for knowledge base testing
- `AiResponse` fields made optional; `AnswerCard` updated to conditionally render badges
- Fixed duplicate React key errors in builds pages
- Added J2 Atomic Clock to J2 build config
- All changes committed and pushed to GitHub
