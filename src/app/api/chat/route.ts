import { NextRequest, NextResponse } from "next/server";
import { searchAiResponses } from "@/lib/mock-ai";

export async function POST(request: NextRequest) {
  let body: { query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const provider = process.env.NEXT_PUBLIC_AI_PROVIDER ?? "mock";

  // ── Mock provider ────────────────────────────────────────────────────────
  if (provider === "mock") {
    // Artificial delay to surface UI loading states during development
    await new Promise((resolve) => setTimeout(resolve, 800));

    const results = searchAiResponses(query);
    return NextResponse.json({ results, provider, query });
  }

  // ── Gemini (Genkit) ──────────────────────────────────────────────────────
  if (provider === "gemini") {
    // TODO: Genkit / Gemini implementation
    //
    // import { genkit } from "genkit";
    // import { googleAI } from "@genkit-ai/googleai";
    //
    // const ai = genkit({ plugins: [googleAI()] });
    // const { text } = await ai.generate({
    //   model: "gemini-2.0-flash",
    //   prompt: `Answer this question about SNP hardware: ${query}`,
    // });
    // return NextResponse.json({ results: [{ title: "Gemini", summary: text }], provider, query });

    return NextResponse.json(
      { error: "Gemini provider not yet configured" },
      { status: 501 }
    );
  }

  // ── Internal / GDMS enterprise ───────────────────────────────────────────
  if (provider === "internal") {
    // TODO: GDMS enterprise AI endpoint
    //
    // const response = await fetch(process.env.GDMS_AI_ENDPOINT!, {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.GDMS_AI_AUTH_TOKEN}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ query }),
    // });
    // const data = await response.json();
    // return NextResponse.json({ results: data.answers, provider, query });

    return NextResponse.json(
      { error: "Internal GDMS provider not yet configured" },
      { status: 501 }
    );
  }

  return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 500 });
}
