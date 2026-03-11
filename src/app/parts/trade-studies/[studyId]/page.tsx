import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TRADE_STUDIES,
  getTradeStudyById,
  getPartsForTradeStudy,
} from "@/lib/mock-parts";

export function generateStaticParams() {
  return TRADE_STUDIES.map((ts) => ({ studyId: ts.id }));
}

const CATEGORY_COLORS: Record<string, string> = {
  Materials: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Derating: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Radiation: "bg-red-500/20 text-red-400 border-red-500/30",
  Thermal: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Reliability: "bg-green-500/20 text-green-400 border-green-500/30",
  Other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default async function TradeStudyDetailPage({
  params,
}: {
  params: Promise<{ studyId: string }>;
}) {
  const { studyId } = await params;
  const study = getTradeStudyById(studyId);
  if (!study) notFound();

  const affectedParts = getPartsForTradeStudy(studyId);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/parts" className="hover:text-foreground transition-colors">
          Parts & Materials
        </Link>
        <span className="mx-2">›</span>
        <Link
          href="/parts/trade-studies"
          className="hover:text-foreground transition-colors"
        >
          Trade Studies
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{study.documentNumber}</span>
      </nav>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className={CATEGORY_COLORS[study.category] || CATEGORY_COLORS.Other}>
            {study.category}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            {study.revision}
          </Badge>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {study.title}
        </h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          {study.documentNumber} · {study.date}
        </p>
      </div>

      {/* ── Summary ──────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {study.summary}
          </p>
        </CardContent>
      </Card>

      {/* ── Conclusion ───────────────────────────────────────────── */}
      <Card className="mb-6 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-emerald-400">
            Conclusion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            {study.conclusion}
          </p>
        </CardContent>
      </Card>

      {/* ── Affected Parts ───────────────────────────────────────── */}
      {affectedParts.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Affected Parts ({affectedParts.length})
            </CardTitle>
            <CardDescription>
              Components governed by this trade study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {affectedParts.map((p) => (
                <Link
                  key={p.id}
                  href={`/parts/${p.id}`}
                  className="flex items-center justify-between py-3 group hover:bg-card/50 transition-colors -mx-2 px-2 rounded"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {p.description}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      {p.manufacturer} — {p.manufacturerPartNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs font-mono">
                      {p.footprint}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ×{p.quantity}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Footer Nav ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-sm">
        <Link
          href="/parts/trade-studies"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← All Trade Studies
        </Link>
        <Link
          href="/parts"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Parts Catalog →
        </Link>
      </div>
    </main>
  );
}
