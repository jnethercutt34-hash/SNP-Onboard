import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getComponentById, getAllComponentIds } from "@/lib/mock-components";
import { getBuildById, BUILDS } from "@/lib/mock-hardware";
import { CUSTOMER_MODULE_OVERRIDES } from "@/lib/customer-module-overrides";
import type { InterfaceUsage } from "@/lib/customer-module-overrides";

export function generateStaticParams() {
  return BUILDS.flatMap((build) =>
    build.slots
      .flatMap((slot) => [slot.baseCard, ...slot.attachedMezzanines])
      .filter((comp) => !!comp.detailId)
      .map((comp) => ({ customerId: build.id, componentId: comp.detailId! }))
  );
}

function StatusBadge({ status }: { status: InterfaceUsage["status"] }) {
  if (status === "active")
    return (
      <Badge className="shrink-0 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
        Active
      </Badge>
    );
  if (status === "partial")
    return (
      <Badge className="shrink-0 text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
        Partial
      </Badge>
    );
  return (
    <Badge className="shrink-0 text-xs bg-muted/30 text-muted-foreground border-muted">
      Unused
    </Badge>
  );
}

function InterfaceList({ interfaces }: { interfaces: InterfaceUsage[] }) {
  return (
    <div className="space-y-2">
      {interfaces.map((iface) => (
        <div key={iface.name} className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-foreground">{iface.name}</p>
            <p className="text-xs text-muted-foreground">{iface.detail}</p>
          </div>
          <StatusBadge status={iface.status} />
        </div>
      ))}
    </div>
  );
}

export default async function CustomerModulePage({
  params,
}: {
  params: Promise<{ customerId: string; componentId: string }>;
}) {
  const { customerId, componentId } = await params;
  const build = getBuildById(customerId);
  const component = getComponentById(componentId);
  if (!build || !component) notFound();

  const override = CUSTOMER_MODULE_OVERRIDES[`${customerId}::${componentId}`];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/builds" className="hover:text-foreground transition-colors">
          Builds
        </Link>
        <span>›</span>
        <Link href={`/builds/${customerId}`} className="hover:text-foreground transition-colors">
          {build.customerName}
        </Link>
        <span>›</span>
        <span className="text-foreground">{component.shortName ?? component.name}</span>
      </div>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {component.name}
          </h1>
          <Badge
            variant="outline"
            className="text-xs mt-1 shrink-0 bg-primary/20 text-primary border-primary/30"
          >
            {build.customerName} Build
          </Badge>
        </div>
        <p className="text-sm text-accent font-mono mb-3">{component.tagline}</p>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">{component.overview}</p>
      </div>

      {/* ── Customer Interface Configuration ──────────────────────── */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-semibold mb-1 text-foreground">
          {build.customerName} Interface Configuration
        </h2>

        {override ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">{override.summary}</p>

            {/* Per-side cards */}
            {override.perSide ? (
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                {override.perSide.red && (
                  <Card className="border-red-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                        Red GPP
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{override.perSide.red.note}</p>
                    </CardHeader>
                    <CardContent>
                      <InterfaceList interfaces={override.perSide.red.interfaces} />
                    </CardContent>
                  </Card>
                )}
                {override.perSide.black && (
                  <Card className="border-slate-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                        Black GPP
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{override.perSide.black.note}</p>
                    </CardHeader>
                    <CardContent>
                      <InterfaceList interfaces={override.perSide.black.interfaces} />
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : override.interfaces ? (
              <Card className="mb-4">
                <CardContent className="pt-4">
                  <InterfaceList interfaces={override.interfaces} />
                </CardContent>
              </Card>
            ) : null}

            {/* Build-specific specs */}
            {override.additionalSpecs && override.additionalSpecs.length > 0 && (
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Build-Specific Specs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <tbody>
                      {override.additionalSpecs.map((spec, i) => (
                        <tr
                          key={spec.label}
                          className={
                            i < override.additionalSpecs!.length - 1
                              ? "border-b border-border"
                              : ""
                          }
                        >
                          <td className="py-2.5 pr-6 text-muted-foreground whitespace-nowrap w-1/3">
                            {spec.label}
                          </td>
                          <td className="py-2.5 text-foreground font-medium">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* Engineering notes */}
            {override.notes && override.notes.length > 0 && (
              <div className="rounded-md border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">
                  Engineering Notes
                </p>
                <ul className="space-y-1">
                  {override.notes.map((note, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-md border border-border bg-secondary/20 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              No customer-specific configuration recorded for this module in the{" "}
              {build.customerName} build. All base capabilities apply — refer to full specs below.
            </p>
          </div>
        )}
      </section>

      {/* ── Full Module Specs ─────────────────────────────────────── */}
      <div className="mb-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Full Module Specifications
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Complete hardware capability — active interfaces for {build.customerName} are shown above.
        </p>
      </div>

      <Tabs defaultValue="specs">
        <TabsList className="mb-6">
          <TabsTrigger value="specs">Tech Specs</TabsTrigger>
          <TabsTrigger value="datasheets">
            Datasheets &amp; AI
            <Badge className="ml-2 px-1.5 py-0 text-xs bg-accent/20 text-accent border-accent/30">
              {component.datasheets.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specs">
          <Card>
            <CardContent className="pt-6">
              <table className="w-full text-sm">
                <tbody>
                  {component.specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={i < component.specs.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="py-2.5 pr-6 text-muted-foreground whitespace-nowrap w-1/3">
                        {spec.label}
                      </td>
                      <td className="py-2.5 text-foreground font-medium">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="datasheets">
          {component.datasheets.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
                No datasheets available for this component yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {component.datasheets.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <div className="h-0.5 w-full bg-accent" />
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <CardTitle className="font-heading text-sm leading-snug">
                        {entry.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground border-muted font-mono"
                        >
                          {entry.docNumber}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground border-muted"
                        >
                          {entry.revision}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">{entry.pages} pages</span>
                      <span className="text-xs text-muted-foreground">{entry.fileSize}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border border-accent/20 bg-accent/5 p-3">
                      <p className="text-xs text-accent/80 uppercase tracking-widest mb-2 font-semibold">
                        AI Summary
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{entry.aiSummary}</p>
                    </div>
                    {entry.file ? (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={entry.file} target="_blank" rel="noopener noreferrer">
                          Open Datasheet →
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Open Datasheet (Upload to activate)
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Footer nav ────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href={`/builds/${customerId}`}>← Back to {build.customerName} Build</Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link href={`/modules/${componentId}`}>View Generic Module →</Link>
        </Button>
      </div>

    </main>
  );
}
