import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUILDS, getBuildById, getBuildDifferences } from "@/lib/mock-hardware";
import type { ModuleType } from "@/lib/mock-hardware";
import { ChassisDiagram } from "@/components/chassis-diagram";

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

      {/* ── Chassis diagram ──────────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Front Panel — 3U SpaceVPX Chassis
        </h2>
        <ChassisDiagram modules={build.modules}/>
        <p className="text-xs text-muted-foreground mt-2">
          Slot layout: GPP Red · GPP Black · Crypto Unit · PSU Red · PSU Black · Expansion · Spare
        </p>
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
      <h2 className="font-heading text-xl font-semibold mb-1 text-foreground">
        Hardware Modules
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Click any module or sub-module chip to view full specs, datasheets, and AI analysis.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {build.modules.map((module) => {
          const isAdded = diff?.added.some((a) => a.id === module.id) ?? false;

          const swappedOut = isAdded
            ? diff?.removed.find((r) => r.type === module.type) ?? null
            : null;

          const powerDelta = swappedOut
            ? module.powerDraw - swappedOut.powerDraw
            : isAdded
            ? module.powerDraw
            : null;

          const weightDelta = swappedOut
            ? module.weight - swappedOut.weight
            : isAdded
            ? module.weight
            : null;

          return (
            <div
              key={module.id}
              className={`rounded-md border p-3 ${
                isAdded
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border bg-secondary/30"
              }`}
            >
              {/* Module name + type badge */}
              <div className="flex items-start justify-between gap-2">
                {module.detailId ? (
                  <Link
                    href={`/modules/${module.detailId}`}
                    className="flex items-center gap-1 group/link"
                  >
                    <p className="text-sm font-medium text-foreground group-hover/link:text-primary transition-colors leading-snug">
                      {module.name}
                    </p>
                    <span className="text-xs text-muted-foreground group-hover/link:text-primary transition-colors shrink-0">
                      →
                    </span>
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {module.name}
                  </p>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs shrink-0 ${moduleTypeBadgeClass(module.type as ModuleType)}`}
                >
                  {module.type}
                </Badge>
              </div>

              {/* Added / swapped badge */}
              {isAdded && (
                <Badge className="mt-1.5 text-xs bg-primary/20 text-primary border-primary/30">
                  {swappedOut ? "Swapped vs Baseline" : "Added vs Baseline"}
                </Badge>
              )}

              {/* Power & weight with deltas */}
              <p className="text-xs text-muted-foreground mt-1.5">
                <span className="font-medium text-foreground">{module.powerDraw} W</span>
                {powerDelta !== null && (
                  <span className={`ml-1 ${powerDelta > 0 ? "text-destructive" : "text-emerald-400"}`}>
                    ({delta(powerDelta)} W)
                  </span>
                )}
                <span className="mx-1.5">·</span>
                <span className="font-medium text-foreground">{module.weight} g</span>
                {weightDelta !== null && (
                  <span className={`ml-1 ${weightDelta > 0 ? "text-destructive" : "text-emerald-400"}`}>
                    ({delta(weightDelta)} g)
                  </span>
                )}
              </p>

              {/* Sub-component chips */}
              {module.subComponents && module.subComponents.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {module.subComponents.map((sc) =>
                    sc.detailId ? (
                      <Link
                        key={sc.name}
                        href={`/modules/${sc.detailId}`}
                        className="inline-block rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-xs text-primary/80 hover:bg-primary/20 hover:border-primary/50 transition-colors"
                      >
                        {sc.name}
                      </Link>
                    ) : (
                      <span
                        key={sc.name}
                        className="inline-block rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {sc.name}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Not included vs Baseline ──────────────────────────────── */}
      {diff && diff.removed.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-xl font-semibold mb-1 text-muted-foreground">
            Not Included vs Baseline
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            These baseline modules are replaced or omitted in this configuration.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {diff.removed.map((module) => (
              <div
                key={module.id}
                className="rounded-md border border-dashed border-muted/50 bg-secondary/10 p-3 opacity-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-muted-foreground leading-snug line-through">
                    {module.name}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-xs shrink-0 text-muted-foreground border-muted"
                  >
                    {module.type}
                  </Badge>
                </div>
                <Badge
                  variant="outline"
                  className="mt-1.5 text-xs text-muted-foreground border-muted"
                >
                  Replaced in this build
                </Badge>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {module.powerDraw} W · {module.weight} g
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
