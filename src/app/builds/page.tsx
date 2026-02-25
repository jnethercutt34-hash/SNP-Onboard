import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BUILDS, getBuildDifferences } from "@/lib/mock-hardware";

const SHORT_NAME: Record<string, string> = {
  "gpp-universal-a": "GPP Red",
  "gpp-universal-b": "GPP Black",
  "crypto-unit": "Crypto Unit",
  "psu-red": "PSU Red",
  "psu-black": "PSU Black",
  "net-10g-copper": "10G Copper",
  "timing-atomic-clock": "Atomic Clock",
};

export default function BuildsPage() {
  const maxPower = Math.max(...BUILDS.map((b) => b.totalPower));
  const maxWeight = Math.max(...BUILDS.map((b) => b.totalWeight));

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

      {/* ── Comparison Grid ──────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {BUILDS.map((build) => {
          const isBaseline = build.id === "baseline";
          const diff = isBaseline ? null : getBuildDifferences("baseline", build.id);

          return (
            <Card key={build.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-lg leading-tight">
                    {build.customerName}
                  </CardTitle>
                  {isBaseline ? (
                    <Badge className="shrink-0 bg-primary/20 text-primary border-primary/30">
                      Baseline
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">
                      {build.id.includes("pleo") ? "pLEO" : "GEO"}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  {build.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">

                {/* Power */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      Power
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {build.totalPower} W
                      {diff && (
                        <span
                          className={`ml-1.5 text-xs font-normal ${
                            diff.powerDelta > 0 ? "text-destructive" : "text-emerald-400"
                          }`}
                        >
                          ({diff.powerDelta > 0 ? "+" : ""}
                          {diff.powerDelta} W)
                        </span>
                      )}
                    </span>
                  </div>
                  <Progress
                    value={(build.totalPower / maxPower) * 100}
                    className="h-2"
                  />
                </div>

                {/* Weight */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      Weight
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {build.totalWeight} g
                      {diff && (
                        <span
                          className={`ml-1.5 text-xs font-normal ${
                            diff.weightDelta > 0 ? "text-destructive" : "text-emerald-400"
                          }`}
                        >
                          ({diff.weightDelta > 0 ? "+" : ""}
                          {diff.weightDelta} g)
                        </span>
                      )}
                    </span>
                  </div>
                  <Progress
                    value={(build.totalWeight / maxWeight) * 100}
                    className="h-2"
                  />
                </div>

                {/* Module badges */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    Modules
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {build.modules.map((mod) => {
                      const isAdded = diff?.added.some((a) => a.id === mod.id) ?? false;
                      return (
                        <Badge
                          key={mod.id}
                          variant="outline"
                          className={`text-xs ${
                            isAdded
                              ? "border-primary text-primary bg-primary/10"
                              : "text-muted-foreground"
                          }`}
                        >
                          {SHORT_NAME[mod.id] ?? mod.name}
                        </Badge>
                      );
                    })}
                    {/* Removed modules — struck out */}
                    {diff?.removed.map((mod) => (
                      <Badge
                        key={mod.id}
                        variant="outline"
                        className="text-xs line-through text-muted-foreground/50 border-muted/50"
                      >
                        {SHORT_NAME[mod.id] ?? mod.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-4 border-t border-border pt-4 text-center">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      Modules
                    </p>
                    <p className="font-heading text-xl font-bold text-foreground">
                      {build.modules.length}
                    </p>
                  </div>
                  {diff && (
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">
                        Changed
                      </p>
                      <p className="font-heading text-xl font-bold text-primary">
                        {diff.added.length + diff.removed.length}
                      </p>
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/builds/${build.id}`}>View Module Details →</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
