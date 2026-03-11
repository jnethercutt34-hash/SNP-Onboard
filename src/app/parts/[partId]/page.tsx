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
  PARTS_CATALOG,
  getPartById,
  getTradeStudiesForPart,
} from "@/lib/mock-parts";

export function generateStaticParams() {
  return PARTS_CATALOG.map((p) => ({ partId: p.id }));
}

const TERMINATION_COLORS: Record<string, string> = {
  "Pure-Tin": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  SnPb: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "N/A": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const QUAL_COLORS: Record<string, string> = {
  "QML-Q": "bg-green-600/20 text-green-400 border-green-600/30",
  "QML-V": "bg-emerald-600/20 text-emerald-300 border-emerald-600/30",
  "MIL-PRF": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "COTS-Plus": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  COTS: "bg-red-500/20 text-red-400 border-red-500/30",
  TBD: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const MODULE_NAMES: Record<string, string> = {
  "gpp-universal": "Universal GPP Card",
  "optical-10g": "10G Optical XMC Mezzanine",
  "net-10g-copper": "10G Copper XMC Mezzanine",
  "crypto-unit": "Cryptographic Processing Unit",
  "psu-red": "Power Converter (Red)",
  "psu-black": "Power Converter (Black)",
  "timing-atomic-clock": "Timing & Networking Expansion",
  "mez-qsfp-3x": "3× QSFP XMC Mezzanine",
  "mez-qsfp-passive": "10G QSFP Passive XMC Mezzanine",
};

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ partId: string }>;
}) {
  const { partId } = await params;
  const part = getPartById(partId);
  if (!part) notFound();

  const tradeStudies = getTradeStudiesForPart(partId);

  const specRows: { label: string; value: string }[] = [
    { label: "Manufacturer", value: part.manufacturer },
    { label: "MFR Part Number", value: part.manufacturerPartNumber },
    { label: "Category", value: part.category },
    { label: "Footprint", value: part.footprint },
    { label: "Package Type", value: part.packageType },
    ...(part.value ? [{ label: "Value", value: part.value }] : []),
    ...(part.tolerance ? [{ label: "Tolerance", value: part.tolerance }] : []),
    ...(part.voltageRating
      ? [{ label: "Voltage Rating", value: part.voltageRating }]
      : []),
    ...(part.powerRating
      ? [{ label: "Power Rating", value: part.powerRating }]
      : []),
    { label: "Temperature Range", value: part.temperatureRange },
    { label: "Solder Termination", value: part.solderTermination },
    { label: "Qualification Level", value: part.qualificationLevel },
    { label: "Mitigation Strategy", value: part.mitigationStrategy },
    ...(part.deratingFactor
      ? [{ label: "Derating", value: part.deratingFactor }]
      : []),
    ...(part.radiationRating
      ? [{ label: "Radiation Rating", value: part.radiationRating }]
      : []),
    { label: "Quantity / Unit", value: part.quantity.toString() },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/parts" className="hover:text-foreground transition-colors">
          Parts & Materials
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{part.description}</span>
      </nav>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className={TERMINATION_COLORS[part.solderTermination] || ""}>
            {part.solderTermination}
          </Badge>
          <Badge className={QUAL_COLORS[part.qualificationLevel] || ""}>
            {part.qualificationLevel}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            {part.footprint}
          </Badge>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {part.description}
        </h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          {part.manufacturer} — {part.manufacturerPartNumber}
        </p>
      </div>

      {/* ── Specs ─────────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {specRows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 py-2.5"
              >
                <span className="text-sm text-muted-foreground shrink-0">
                  {row.label}
                </span>
                <span className="text-sm text-foreground text-right font-medium">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Notes ─────────────────────────────────────────────────── */}
      {part.notes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Usage Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {part.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Used On Modules ───────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Used On Modules</CardTitle>
          <CardDescription>
            Modules in the SNP platform that use this part
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {part.usedOnModules.map((modId) => (
              <Link key={modId} href={`/modules/${modId}`}>
                <Badge
                  variant="secondary"
                  className="hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                >
                  {MODULE_NAMES[modId] || modId}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Trade Studies ─────────────────────────────────────────── */}
      {tradeStudies.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Related Trade Studies
            </CardTitle>
            <CardDescription>
              Engineering analyses justifying this part selection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tradeStudies.map((ts) => (
              <Link
                key={ts.id}
                href={`/parts/trade-studies/${ts.id}`}
                className="block group"
              >
                <div className="rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {ts.title}
                    </h3>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {ts.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-2">
                    {ts.documentNumber} · {ts.revision} · {ts.date}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ts.conclusion}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Footer Nav ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-sm">
        <Link
          href="/parts"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Parts Catalog
        </Link>
      </div>
    </main>
  );
}
