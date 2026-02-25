# Phase 4: AI Knowledge Base UI & API Routing

## Objective
Build the frontend search interface for querying technical manuals and set up the Next.js API route that handles the `mock` vs `gemini` vs `internal` environment logic.

## Tasks
1. **The API Switchboard (`src/app/api/chat/route.ts`):**
   - Create a POST handler that reads `process.env.NEXT_PUBLIC_AI_PROVIDER`.
   - **IF 'mock':** Add an 800ms artificial delay (for UI loading states), check the query against `src/lib/mock-ai.ts`, and return the dummy "Answer Card" data.
   - **IF 'gemini':** Leave a commented-out block for future Genkit implementation.
   - **IF 'internal':** Leave a commented-out block for the future GDMS enterprise fetch call.
2. **Knowledge Base UI (`/knowledge-base`):**
   - Build a chat/search interface with a text input and submit button.
   - Implement loading states (spinners or ShadCN skeleton loaders) while waiting for the API response.
3. **Answer Card Component:**
   - Render the API response in an "Answer Card".
   - Style this card utilizing the `--accent` (Intelligence Purple) color to clearly differentiate AI-generated insights from human-verified hardware specs. Ensure the source manual (ICD, IDD, SUM) is badged clearly.