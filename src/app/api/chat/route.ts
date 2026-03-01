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

  // ── Internal / Company AI ────────────────────────────────────────────────
  if (provider === "internal") {
    const endpoint = process.env.GDMS_AI_ENDPOINT;
    const token    = process.env.GDMS_AI_AUTH_TOKEN;
    const model    = process.env.GDMS_AI_MODEL ?? "gpt-4";

    if (!endpoint || !token) {
      return NextResponse.json(
        { error: "GDMS_AI_ENDPOINT and GDMS_AI_AUTH_TOKEN must be set in environment variables." },
        { status: 503 }
      );
    }

    // Load all documents from public/documents/ and build context
    const { loadAllDocuments, buildContext } = await import("@/lib/document-store");
    const docs    = await loadAllDocuments();
    const context = buildContext(docs);

    // Call the company AI via OpenAI-compatible API
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    let aiText: string;
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a technical documentation assistant for the SNP (Secure Network Processor) " +
              "product line. Answer questions accurately and concisely based only on the following " +
              "product documentation. If the answer cannot be found in the documents, say so clearly " +
              "rather than guessing.\n\n" +
              context,
          },
          {
            role: "user",
            content: query,
          },
        ],
      });
      aiText = completion.choices[0]?.message?.content ?? "No response returned by the AI.";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `AI request failed: ${message}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      results: [
        {
          title: query,
          summary: aiText,
          source: `${docs.length} document(s) loaded`,
        },
      ],
      provider: "internal",
      query,
    });
  }

  // ── Gemini (Genkit) — not yet configured ────────────────────────────────
  if (provider === "gemini") {
    return NextResponse.json(
      { error: "Gemini provider not yet configured" },
      { status: 501 }
    );
  }

  return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 500 });
}
