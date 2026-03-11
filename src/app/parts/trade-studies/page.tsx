import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRADE_STUDIES, getPartsForTradeStudy } from "@/lib/mock-parts";

const CATEGORY_COLORS: Record<string, string> = {
  Materials: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Derating: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Radiation: "bg-red-500/20 text-red-400 border-red-500/30",
  Thermal: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Reliability: "bg-green-500/20 text-green-400 border-green-500/30",
  Other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function TradeStudiesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/parts" className="hover:text-foreground transition-colors">
          Parts & Materials
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Trade Studies</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Trade Studies
        </h1>
        <p className="mt-2 text-muted-foreground">
          Engineering analyses supporting component selection, materials compliance, and derating decisions.
        </p>
      </div>

      {/* ── Studies ─────────────────────────────────────────────── */}
      <div className="space-y-6">
        {TRADE_STUDIES.map((ts) => {
          const affectedParts = getPartsForTradeStudy(ts.id);
          return (
            <Link key={ts.id} href={`/parts/trade-studies/${ts.id}`} className="block group">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                        {ts.title}
                      </CardTitle>
                      <CardDescription className="font-mono mt-1">
                        {ts.documentNumber} · {ts.revision} · {ts.date}
                      </CardDescription>
                    </div>
                    <Badge className={CATEGORY_COLORS[ts.category] || CATEGORY_COLORS.Other}>
                      {ts.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {ts.summary}
                  </p>

                  <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3 mb-4">
                    <p className="text-xs font-medium text-emerald-400 mb-1">Conclusion</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ts.conclusion}
                    </p>
                  </div>

                  {affectedParts.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Affected Parts ({affectedParts.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {affectedParts.map((p) => (
                          <Badge key={p.id} variant="outline" className="text-xs font-mono">
                            {p.manufacturerPartNumber}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
