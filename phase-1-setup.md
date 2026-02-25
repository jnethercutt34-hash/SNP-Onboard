# Phase 1: Foundation, Theming & Environment Setup

## Objective
Initialize a Next.js 15 (App Router) project with React 19, Tailwind CSS, and ShadCN UI. Establish the "Tactical Aerospace" design system and the environment variables needed for the multi-stage AI integration.

## Tasks
1. **Initialize Project:** Set up the Next.js app with TypeScript.
2. **Environment Variables:** Create a `.env.local` file with the following routing toggle:
   - `NEXT_PUBLIC_AI_PROVIDER=mock` (Options: mock, gemini, internal)
   - `GEMINI_API_KEY=placeholder`
   - `GDMS_AI_ENDPOINT=placeholder`
   - `GDMS_AI_AUTH_TOKEN=placeholder`
3. **Install ShadCN UI:** Configure the components library (add Button, Card, Badge, Progress, Tabs, Input, ScrollArea).
4. **Configure Theming (`src/app/globals.css`):**
   - Apply the dark "Tactical Aerospace" HSL variables:
     - `--background`: 222 47% 4% (Deep Void)
     - `--card`: 222 47% 7%
     - `--primary`: 217 91% 60% (Mission Blue)
     - `--accent`: 262 80% 60% (Intelligence Purple)
   - Set up the dual-font strategy: Space Grotesk (headings/logo) and Inter (body/technical text).
5. **Scaffold Layouts:**
   - Create a persistent top navigation bar with the text-based logo ("SNP Product HUB") using the primary color and heading font.
   - Create placeholder pages for `/` (Dashboard/Overview), `/builds` (Customer Comparisons), and `/knowledge-base` (AI Search).2