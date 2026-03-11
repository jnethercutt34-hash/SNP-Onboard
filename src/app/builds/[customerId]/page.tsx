import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUILDS, getBuildById, getBuildDifferences, flattenComponents } from "@/lib/mock-hardware";
import type { ComponentType, HardwareComponent } from "@/lib/mock-hardware";
import { ChassisDiagramWithSwitcher } from "@/components/chassis-diagram";

export function generateStaticParams() {
  return BUILDS.map((b) => ({ customerId: b.id }));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function componentTypeBadgeClass(type: ComponentType): string {
  const map: Record<ComponentType, string> = {
    GPP_Base:             "bg-primary/20 text-primary border-primary/30",
    Mezzanine_XMC:        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Networking_Mezzanine: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Crypto_Module:        "bg-violet-500/20 text-violet-400 border-violet-500/30",
    Expansion_Module:     "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Power_Converter:      "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return map[type] ?? "bg-muted text-muted-foreground";
}

function delta(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

// ── Page ─────────────────────────────────────────────────────────────────────

const MEZZANINE_TYPES = new Set<ComponentType>(["Mezzanine_XMC", "Networking_Mezzanine"]);

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const build = getBuildById(customerId);
  if (!build) notFound();

  const isBaseline = build.id === "baseline";
  const isIrad = build.id === "fms-irad";
  const diff = isBaseline ? null : getBuildDifferences("baseline", build.id);

  // Prepare builds data for the switcher (serializable props only)
  const buildsForSwitcher = BUILDS.map((b) => ({
    id: b.id,
    customerName: b.customerName,
    slots: b.slots,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* ── Back nav ─────────────────────────────────────────────── */}
      <div className="mb-2">
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href="/builds">&larr; Back to Comparisons</Link>
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
            ) : isIrad ? (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">IRAD &middot; Lab</Badge>
            ) : (
              <Badge variant="secondary">
                pLEO
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
                Power &Delta;
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
                Weight &Delta;
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

      {/* ── Chassis diagram with build switcher ────────────────────── */}
      <div className="mb-10">
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Front Panel &mdash; 3U SpaceVPX Chassis
        </h2>
        <ChassisDiagramWithSwitcher
          builds={buildsForSwitcher}
          currentBuildId={customerId}
        />
        <p className="text-xs text-muted-foreground mt-2">
          {Array.from({ length: 7 }, (_, i) => {
            const s = build.slots.find((sl) => sl.slotNumber === i + 1);
            return `S${i + 1}: ${s ? s.baseCard.name.replace(" (Red)", " R").replace(" (Black)", " B") : "Spare"}`;
          }).join(" \u00B7 ")}
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
              {build.totalSystemPower} W
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Total Weight
            </p>
            <p className="font-heading text-3xl font-bold text-accent">
              {build.totalSystemWeight} g
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Modules
            </p>
            <p className="font-heading text-3xl font-bold text-foreground">
              {build.slots.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Module grid ──────────────────────────────────────────── */}
      <h2 className="font-heading text-xl font-semibold mb-1 text-foreground">
        Hardware Configuration
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Each slot shows the base card and any attached XMC mezzanines. Click a card to view full specs.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {build.slots.map((slot) => {
          const allComponents: HardwareComponent[] = [slot.baseCard, ...slot.attachedMezzanines];

          return (
            <div key={slot.slotNumber} className="rounded-md border border-border bg-secondary/30 p-3">
              {/* Slot header */}
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                Slot {slot.slotNumber}
              </p>

              {allComponents.map((comp) => {
                const isAdded    = diff?.addedComponents.some((a) => a.id === comp.id) ?? false;
                const isRemoved  = diff?.removedComponents.some((r) => r.id === comp.id) ?? false;
                const isMezzanine = comp.type === "Mezzanine_XMC";

                return (
                  <div
                    key={comp.id}
                    className={`rounded border p-2 mb-1.5 last:mb-0 ${
                      isAdded
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : isMezzanine
                        ? "border-border/50 bg-secondary/50 ml-3"
                        : "border-border bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {comp.detailId ? (
                        <Link
                          href={
                            MEZZANINE_TYPES.has(comp.type)
                              ? `/builds/${customerId}/modules/${comp.detailId}`
                              : `/modules/${comp.detailId}`
                          }
                          className="flex items-center gap-1 group/link"
                        >
                          <p className="text-sm font-medium text-foreground group-hover/link:text-primary transition-colors leading-snug">
                            {comp.name}
                          </p>
                          <span className="text-xs text-muted-foreground group-hover/link:text-primary transition-colors shrink-0">&rarr;</span>
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-foreground leading-snug">{comp.name}</p>
                      )}
                      <Badge variant="outline" className={`text-xs shrink-0 ${componentTypeBadgeClass(comp.type)}`}>
                        {comp.type.replace("_", " ")}
                      </Badge>
                    </div>

                    {isAdded && (
                      <Badge className="mt-1 text-xs bg-primary/20 text-primary border-primary/30">
                        {isRemoved ? "Swapped vs Baseline" : "Added vs Baseline"}
                      </Badge>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      {comp.powerDrawWatts} W &middot; {comp.weightGrams} g
                    </p>

                    {comp.subComponents && comp.subComponents.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {comp.subComponents.map((sc) =>
                          sc.detailId ? (
                            <Link key={sc.name} href={`/modules/${sc.detailId}`}
                              className="inline-block rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-xs text-primary/80 hover:bg-primary/20 hover:border-primary/50 transition-colors">
                              {sc.name}
                            </Link>
                          ) : (
                            <span key={sc.name}
                              className="inline-block rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-xs text-muted-foreground">
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
          );
        })}
      </div>

      {/* ── Not included vs Baseline ──────────────────────────────── */}
      {diff && diff.removedComponents.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-xl font-semibold mb-1 text-muted-foreground">
            Not Included vs Baseline
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            These baseline components are replaced or omitted in this configuration.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {diff.removedComponents.map((comp, i) => (
              <div
                key={`${comp.id}-${i}`}
                className="rounded-md border border-dashed border-muted/40 bg-secondary/10 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground/60 leading-snug line-through decoration-foreground/40">
                    {comp.name}
                  </p>
                  <Badge variant="outline" className="text-xs shrink-0 text-muted-foreground border-muted">
                    {comp.type.replace("_", " ")}
                  </Badge>
                </div>
                <Badge variant="outline" className="mt-1.5 text-xs text-muted-foreground border-muted">
                  Replaced in this build
                </Badge>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {comp.powerDrawWatts} W &middot; {comp.weightGrams} g
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
