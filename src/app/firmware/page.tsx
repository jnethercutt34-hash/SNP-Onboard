import Link from "next/link";
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
  VERSION_MATRIX,
  getReleasesByTarget,
  type FirmwareTarget,
  type ReleaseStatus,
} from "@/lib/mock-firmware";

const TARGETS: FirmwareTarget[] = ["FPGA", "ARM", "CMC", "Crypto", "Boot", "PHY"];

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

export default function FirmwarePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Firmware & Software
        </h1>
        <p className="mt-2 text-muted-foreground">
          Version matrix, release history, and compatibility for all firmware targets across the SNP platform.
        </p>
      </div>

      {/* ── Version Matrix ─────────────────────────────────────── */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-heading text-lg">📋 Per-Build Version Matrix</CardTitle>
          <CardDescription>Current firmware versions deployed on each build</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Build
                  </th>
                  {TARGETS.map((t) => (
                    <th key={t} className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <Badge className={TARGET_COLORS[t]}>{t}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {VERSION_MATRIX.map((vm) => (
                  <tr key={vm.buildId} className="hover:bg-card/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/builds/${vm.buildId}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {vm.buildName}
                      </Link>
                    </td>
                    {TARGETS.map((t) => (
                      <td key={t} className="px-4 py-3 text-center font-mono text-xs text-foreground">
                        {vm.versions[t]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Release History by Target ──────────────────────────── */}
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
        Release History
      </h2>
      <div className="space-y-6">
        {TARGETS.map((target) => {
          const releases = getReleasesByTarget(target);
          return (
            <Card key={target}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge className={TARGET_COLORS[target]}>{target}</Badge>
                  <CardTitle className="font-heading text-lg">
                    {target === "FPGA" && "AMD Versal Bitstream"}
                    {target === "ARM" && "Cortex-A78AE Application"}
                    {target === "CMC" && "Chassis Management Controller"}
                    {target === "Crypto" && "HSM Firmware"}
                    {target === "Boot" && "Secure Bootloader"}
                    {target === "PHY" && "Quad PHY Configuration"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {releases.map((rel) => (
                    <Link key={rel.id} href={`/firmware/${rel.id}`} className="block group">
                      <div className="rounded-lg border border-border p-3 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              v{rel.version}
                            </span>
                            <Badge className={STATUS_COLORS[rel.status]}>{rel.status}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{rel.releaseDate}</span>
                        </div>
                        <ul className="space-y-0.5">
                          {rel.changelog.slice(0, 2).map((entry, i) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              • {entry}
                            </li>
                          ))}
                          {rel.changelog.length > 2 && (
                            <li className="text-xs text-muted-foreground/60">
                              + {rel.changelog.length - 2} more…
                            </li>
                          )}
                        </ul>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
