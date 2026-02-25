import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getComponentById, getAllComponentIds } from "@/lib/mock-components";
import type { DatasheetEntry, RelatedComponent, SubModuleRef } from "@/lib/mock-components";

export function generateStaticParams() {
  return getAllComponentIds().map((id) => ({ componentId: id }));
}

// ── Category badge colour ─────────────────────────────────────────────────────

function categoryBadgeClass(category: string): string {
  const map: Record<string, string> = {
    Processor: "bg-primary/20 text-primary border-primary/30",
    Cryptography: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    Power: "bg-red-500/20 text-red-400 border-red-500/30",
    Memory: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Storage: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    FPGA: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Networking: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Expansion: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };
  return map[category] ?? "bg-muted/20 text-muted-foreground border-muted";
}

// ── Sub-module card ────────────────────────────────────────────────────────────

function SubModuleCard({ item }: { item: SubModuleRef }) {
  return (
    <Link href={`/modules/${item.detailId}`} className="block group">
      <Card className="hover:border-primary/50 transition-colors h-full">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${categoryBadgeClass(item.category)}`}
            >
              {item.category}
            </Badge>
            <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm shrink-0">
              →
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {item.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono leading-snug">
            {item.tagline}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── Datasheet card ────────────────────────────────────────────────────────────

function DatasheetCard({ entry }: { entry: DatasheetEntry }) {
  return (
    <Card className="overflow-hidden">
      {/* Accent bar */}
      <div className="h-0.5 w-full bg-accent" />
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="font-heading text-sm leading-snug">{entry.title}</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs text-muted-foreground border-muted font-mono">
              {entry.docNumber}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground border-muted">
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
        {/* AI Summary */}
        <div className="rounded-md border border-accent/20 bg-accent/5 p-3">
          <p className="text-xs text-accent/80 uppercase tracking-widest mb-2 font-semibold">
            AI Summary
          </p>
          <p className="text-sm text-foreground leading-relaxed">{entry.aiSummary}</p>
        </div>

        {/* Dummy open button */}
        <Button variant="outline" size="sm" className="w-full" disabled>
          Open Datasheet (Upload to activate)
        </Button>
      </CardContent>
    </Card>
  );
}

function RelatedCard({ item }: { item: RelatedComponent }) {
  return (
    <Link href={`/modules/${item.detailId}`} className="block group">
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.relationship}</p>
            </div>
            <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm shrink-0">
              →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ componentId: string }>;
}) {
  const { componentId } = await params;
  const component = getComponentById(componentId);
  if (!component) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

      {/* ── Back nav ──────────────────────────────────────────────── */}
      <div className="mb-2">
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href="/">← Back to Overview</Link>
        </Button>
      </div>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {component.name}
          </h1>
          <Badge
            variant="outline"
            className={`text-xs mt-1 shrink-0 ${categoryBadgeClass(component.category)}`}
          >
            {component.category}
          </Badge>
        </div>
        <p className="text-sm text-accent font-mono mb-3">{component.tagline}</p>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">{component.overview}</p>
      </div>

      {/* ── On-Board Sub-Modules ──────────────────────────────────── */}
      {component.subModules && component.subModules.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading text-xl font-semibold mb-1 text-foreground">
            On-Board Sub-Modules
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Integrated ICs and interfaces carried on this card. Click any sub-module for full specs, datasheets, and AI analysis.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {component.subModules.map((sub) => (
              <SubModuleCard key={sub.detailId} item={sub} />
            ))}
          </div>
        </section>
      )}

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <Tabs defaultValue="specs">
        <TabsList className="mb-6">
          <TabsTrigger value="specs">Tech Specs</TabsTrigger>
          <TabsTrigger value="datasheets">
            Datasheets & AI
            <Badge className="ml-2 px-1.5 py-0 text-xs bg-accent/20 text-accent border-accent/30">
              {component.datasheets.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="related">
            Related
            <Badge className="ml-2 px-1.5 py-0 text-xs bg-muted text-muted-foreground border-muted">
              {component.related.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ── Tech Specs Tab ──────────────────────────────────────── */}
        <TabsContent value="specs">
          <Card>
            <CardContent className="pt-6">
              <table className="w-full text-sm">
                <tbody>
                  {component.specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={`${
                        i < component.specs.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
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

        {/* ── Datasheets & AI Tab ─────────────────────────────────── */}
        <TabsContent value="datasheets">
          {component.datasheets.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
                No datasheets available for this component yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a datasheet to enable AI-powered analysis. AI summaries below are generated from
                placeholder content and will be replaced once real documents are provided.
              </p>
              {component.datasheets.map((entry) => (
                <DatasheetCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Related Tab ─────────────────────────────────────────── */}
        <TabsContent value="related">
          {component.related.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
                No related components listed.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {component.related.map((item) => (
                <RelatedCard key={item.detailId} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

    </main>
  );
}
