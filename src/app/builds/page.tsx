import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BUILDS, getBuildDifferences, flattenComponents } from "@/lib/mock-hardware";
import { ProductLineage } from "@/components/product-lineage";

const SHORT_NAME: Record<string, string> = {
  "gpp-universal-a":     "GPP Red",
  "gpp-universal-b":     "GPP Black",
  "crypto-unit":         "Crypto Unit",
  "psu-red":             "PSU Red",
  "psu-black":           "PSU Black",
  "mez-optical-10g":     "Optical 10G",
  "mez-copper-10g":      "Copper 10G",
  "mez-qsfp-3x":        "3× QSFP",
  "timing-atomic-clock": "Atomic Clock",
};

export default function BuildsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Customer Comparisons
        </h1>
        <p className="mt-2 text-muted-foreground">
          SWaP-C metrics and module configuration across all deployments.
        </p>
      </div>

      {/* ── Product Lineage Diagram ──────────────────────────────── */}
      <ProductLineage />

      {/* ── Comparison Grid ──────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {BUILDS.map((build) => {
          const isBaseline = build.id === "baseline";
          const isIrad = build.id === "fms-irad";
          const diff = isBaseline ? null : getBuildDifferences("baseline", build.id);

          return (
            <Link key={build.id} href={`/builds/${build.id}`} className="block group">
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-lg leading-tight">
                    {build.customerName}
                  </CardTitle>
                  {isBaseline ? (
                    <Badge className="shrink-0 bg-primary/20 text-primary border-primary/30">
                      Baseline
                    </Badge>
                  ) : isIrad ? (
                    <Badge className="shrink-0 bg-amber-500/20 text-amber-400 border-amber-500/30">
                      IRAD · Lab
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">
                      pLEO
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  {build.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">

                {/* Power + Weight */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-md bg-secondary/30 px-3 py-2.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Power</p>
                    <p className="font-heading text-xl font-bold text-primary">
                      {build.totalSystemPower} W
                    </p>
                    {diff && (
                      <p className={`text-xs mt-0.5 ${diff.powerDelta > 0 ? "text-destructive" : "text-emerald-400"}`}>
                        {diff.powerDelta > 0 ? "+" : ""}{diff.powerDelta} W
                      </p>
                    )}
                  </div>
                  <div className="rounded-md bg-secondary/30 px-3 py-2.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Weight</p>
                    <p className="font-heading text-xl font-bold text-accent">
                      {build.totalSystemWeight} g
                    </p>
                    {diff && (
                      <p className={`text-xs mt-0.5 ${diff.weightDelta > 0 ? "text-destructive" : "text-emerald-400"}`}>
                        {diff.weightDelta > 0 ? "+" : ""}{diff.weightDelta} g
                      </p>
                    )}
                  </div>
                </div>

                {/* Component badges */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    Components
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {flattenComponents(build).map((comp, i) => {
                      const isAdded = diff?.addedComponents.some((a) => a.id === comp.id) ?? false;
                      return (
                        <Badge
                          key={`${comp.id}-${i}`}
                          variant="outline"
                          className={`text-xs ${
                            isAdded
                              ? "border-primary text-primary bg-primary/10"
                              : "text-muted-foreground"
                          }`}
                        >
                          {SHORT_NAME[comp.id] ?? comp.name}
                        </Badge>
                      );
                    })}
                    {/* Removed components — struck out */}
                    {diff?.removedComponents.map((comp, i) => (
                      <Badge
                        key={`${comp.id}-removed-${i}`}
                        variant="outline"
                        className="text-xs line-through text-muted-foreground/50 border-muted/50"
                      >
                        {SHORT_NAME[comp.id] ?? comp.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-4 border-t border-border pt-4 text-center">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      Slots Used
                    </p>
                    <p className="font-heading text-xl font-bold text-foreground">
                      {build.slots.length} / 7
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      Spares
                    </p>
                    <p className={`font-heading text-xl font-bold ${7 - build.slots.length > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {7 - build.slots.length}
                    </p>
                  </div>
                  {diff && (
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">
                        Changed
                      </p>
                      <p className="font-heading text-xl font-bold text-primary">
                        {diff.addedComponents.length + diff.removedComponents.length}
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-center text-muted-foreground group-hover:text-primary transition-colors pt-1">
                  View configuration details →
                </p>
              </CardContent>
            </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
