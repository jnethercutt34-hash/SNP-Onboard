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
  FIRMWARE_RELEASES,
  getReleaseById,
  type FirmwareTarget,
  type ReleaseStatus,
} from "@/lib/mock-firmware";

export function generateStaticParams() {
  return FIRMWARE_RELEASES.map((r) => ({ releaseId: r.id }));
}

const TARGET_COLORS: Record<FirmwareTarget, string> = {
  FPGA: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ARM: "bg-green-500/20 text-green-400 border-green-500/30",
  CMC: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Crypto: "bg-red-500/20 text-red-400 border-red-500/30",
  Boot: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  PHY: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const STATUS_COLORS: Record<ReleaseStatus, string> = {
  Released: "bg-green-500/20 text-green-400 border-green-500/30",
  Beta: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Deprecated: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const BUILD_NAMES: Record<string, string> = {
  baseline: "Baseline",
  "customer-a-pleo": "ABE (pLEO)",
  "customer-b-pleo": "J2 (pLEO)",
  "customer-c-pleo": "JL (pLEO)",
  "fms-irad": "FMS (IRAD)",
};

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ releaseId: string }>;
}) {
  const { releaseId } = await params;
  const release = getReleaseById(releaseId);
  if (!release) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/firmware" className="hover:text-foreground transition-colors">
          Firmware
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{release.target} v{release.version}</span>
      </nav>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className={TARGET_COLORS[release.target]}>{release.target}</Badge>
          <Badge className={STATUS_COLORS[release.status]}>{release.status}</Badge>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {release.target} — v{release.version}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Released {release.releaseDate}
        </p>
      </div>

      {/* ── Changelog ─────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {release.changelog.map((entry, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary shrink-0 mt-0.5">•</span>
                <span className="text-foreground">{entry}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ── Compatibility ─────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Hardware Compatibility</CardTitle>
            <CardDescription>Compatible hardware revisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {release.compatibleHwRevs.map((rev) => (
                <Badge key={rev} variant="outline" className="font-mono">{rev}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Build Compatibility</CardTitle>
            <CardDescription>Supported customer builds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {release.compatibleBuilds.map((b) => (
                <Link key={b} href={`/builds/${b}`} className="block group">
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {BUILD_NAMES[b] || b}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Update Procedure ──────────────────────────────────────── */}
      {release.updateProcedure && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Update Procedure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{release.updateProcedure}</p>
          </CardContent>
        </Card>
      )}

      {/* ── Notes ─────────────────────────────────────────────────── */}
      {release.notes && (
        <Card className="mb-6 border-amber-500/20">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-amber-400">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">{release.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-sm">
        <Link href="/firmware" className="text-muted-foreground hover:text-foreground transition-colors">
          ← All Firmware
        </Link>
      </div>
    </main>
  );
}
