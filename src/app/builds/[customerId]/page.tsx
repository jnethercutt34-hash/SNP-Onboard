import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUILDS, getBuildById, getBuildDifferences } from "@/lib/mock-hardware";
import type { ModuleType } from "@/lib/mock-hardware";

export function generateStaticParams() {
  return BUILDS.map((b) => ({ customerId: b.id }));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function moduleTypeBadgeClass(type: ModuleType): string {
  const map: Record<ModuleType, string> = {
    processor: "bg-primary/20 text-primary border-primary/30",
    networking: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    expansion: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    power: "bg-red-500/20 text-red-400 border-red-500/30",
    crypto: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  };
  return map[type] ?? "bg-muted text-muted-foreground";
}

function delta(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const build = getBuildById(customerId);
  if (!build) notFound();

  const isBaseline = build.id === "baseline";
  const diff = isBaseline ? null : getBuildDifferences("baseline", build.id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* ── Back nav ─────────────────────────────────────────────── */}
      <div className="mb-2">
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href="/builds">← Back to Comparisons</Link>
        </Button>
      </div>

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              {build.customerName}
            </h1>
            {isBaseline ? (
              <Badge className="bg-primary/20 text-primary border-primary/30">Baseline</Badge>
            ) : (
              <Badge variant="secondary">
                {build.id.includes("pleo") ? "pLEO" : "GEO"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl">{build.description}</p>
        </div>

        {/* Delta summary panel */}
        {diff && (
          <div className="flex gap-6 rounded-lg border border-border bg-card px-5 py-4 shrink-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Power Δ
              </p>
              <p
                className={`font-heading text-2xl font-bold ${
                  diff.powerDelta > 0 ? "text-destructive" : "text-emerald-400"
                }`}
              >
                {delta(diff.powerDelta)} W
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Weight Δ
              </p>
              <p
                className={`font-heading text-2xl font-bold ${
                  diff.weightDelta > 0 ? "text-destructive" : "text-emerald-400"
                }`}
              >
                {delta(diff.weightDelta)} g
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Totals row ───────────────────────────────────────────── */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Total Power
            </p>
            <p className="font-heading text-3xl font-bold text-primary">
              {build.totalPower} W
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Total Weight
            </p>
            <p className="font-heading text-3xl font-bold text-accent">
              {build.totalWeight} g
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Modules
            </p>
            <p className="font-heading text-3xl font-bold text-foreground">
              {build.modules.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Module grid ──────────────────────────────────────────── */}
      <h2 className="font-heading text-xl font-semibold mb-4 text-foreground">
        Hardware Modules
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {build.modules.map((module) => {
          const isAdded = diff?.added.some((a) => a.id === module.id) ?? false;

          // Find baseline module this swapped out (same type, exists in removed list)
          const swappedOut = isAdded
            ? diff?.removed.find((r) => r.type === module.type) ?? null
            : null;

          // Power / weight delta vs baseline
          const powerDelta = swappedOut
            ? module.powerDraw - swappedOut.powerDraw
            : isAdded
            ? module.powerDraw       // fully new module — entire draw is the delta
            : null;

          const weightDelta = swappedOut
            ? module.weight - swappedOut.weight
            : isAdded
            ? module.weight
            : null;

          return (
            <Card
              key={module.id}
              className={
                isAdded
                  ? "border-primary ring-1 ring-primary/30"
                  : ""
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-sm leading-snug">
                    {module.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${moduleTypeBadgeClass(module.type as ModuleType)}`}
                  >
                    {module.type}
                  </Badge>
                </div>

                {isAdded && (
                  <Badge className="mt-1.5 w-fit text-xs bg-primary/20 text-primary border-primary/30">
                    {swappedOut ? "Swapped vs Baseline" : "Added vs Baseline"}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {module.description}
                </p>

                {module.subComponents && module.subComponents.length > 0 && (
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5">
                    <p className="text-xs text-primary/70 uppercase tracking-widest mb-2">
                      On-board
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {module.subComponents.map((sc) => (
                        <div
                          key={sc.name}
                          className="rounded border border-primary/25 bg-background/60 px-2 py-1"
                        >
                          <p className="text-xs font-medium text-primary leading-none">
                            {sc.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-none">
                            {sc.spec}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-5 border-t border-border pt-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Power</p>
                    <p className="text-sm font-semibold text-foreground">
                      {module.powerDraw} W
                    </p>
                    {powerDelta !== null && (
                      <p
                        className={`text-xs mt-0.5 ${
                          powerDelta > 0 ? "text-destructive" : "text-emerald-400"
                        }`}
                      >
                        {delta(powerDelta)} W vs Baseline
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Weight</p>
                    <p className="text-sm font-semibold text-foreground">
                      {module.weight} g
                    </p>
                    {weightDelta !== null && (
                      <p
                        className={`text-xs mt-0.5 ${
                          weightDelta > 0 ? "text-destructive" : "text-emerald-400"
                        }`}
                      >
                        {delta(weightDelta)} g vs Baseline
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Removed / not-included modules ───────────────────────── */}
      {diff && diff.removed.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-xl font-semibold mb-1 text-muted-foreground">
            Not Included vs Baseline
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            These baseline modules are replaced or omitted in this configuration.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diff.removed.map((module) => (
              <Card key={module.id} className="opacity-50 border-dashed">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-heading text-sm leading-snug line-through text-muted-foreground">
                      {module.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0 text-muted-foreground border-muted"
                    >
                      {module.type}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className="mt-1 w-fit text-xs text-muted-foreground border-muted"
                  >
                    Replaced in this build
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-5">
                    <div>
                      <p className="text-xs text-muted-foreground">Power</p>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {module.powerDraw} W
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {module.weight} g
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
