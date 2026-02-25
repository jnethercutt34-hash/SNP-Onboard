import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUILDS } from "@/lib/mock-hardware";

export default function OverviewPage() {
  const baseline = BUILDS.find((b) => b.id === "baseline")!;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="mb-14">
        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
          3U SpaceVPX · VITA 78
        </Badge>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Secure Network Processor
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          A ruggedized 3U SpaceVPX computing platform for space-borne signal processing,
          network switching, and cryptographic operations in LEO and GEO mission environments.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/builds">Compare Customer Builds →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/knowledge-base">AI Knowledge Base</Link>
          </Button>
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-semibold mb-1 text-foreground">
          System Architecture
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Core subsystems of the SNP reference design.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">3U VPX Form Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                VITA 78 SpaceVPX compliant chassis. PCIe Gen 3 ×4 control plane, dual
                10 Gbps SerDes data lanes per slot. Operating range −40 °C to +85 °C.
                Radiation-tolerant construction for orbital environments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Dual-GPP Redundancy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Two ARM Cortex-A78AE GPP cards in hot-standby. Switchover latency &lt;200 ms
                via SpaceVPX control plane. Black can be demoted to co-processing mode to
                double compute throughput on demand.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">FPGA Signal Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                1.5M SLC FPGA with pipelined FFT core and Reed-Solomon FEC codec. Supports
                partial reconfiguration for in-orbit algorithm updates without a full NVM
                re-flash cycle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">ECC-Protected Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                16 GB radiation-tolerant LPDDR4X SDRAM with hardware ECC correction. Paired
                with 2 Gb NVM flash for firmware and configuration persistence across power
                cycles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">High-Speed Networking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each GPP card integrates a 1G Quad PHY providing four independent GbE ports
                for low-speed management and control-plane traffic. A quad-channel 10 Gbps
                fiber-optic interface (1310 nm, SFP+) handles high-throughput data-plane
                links, swappable to copper 10GBase-T for pLEO missions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Mission Expandability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Expansion slot supports mission-specific modules. GEO deployments add a
                chip-scale atomic clock (CSAC) for nanosecond-class time synchronization
                independent of GPS ground references.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Baseline Specs ───────────────────────────────────────── */}
      <section>
        <h2 className="font-heading text-2xl font-semibold mb-1 text-foreground">
          Baseline Configuration
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Reference build — the foundation for all customer variants.
        </p>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="font-heading">Reference Build</CardTitle>
                <CardDescription className="mt-1">{baseline.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="shrink-0">Baseline</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              {baseline.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-md border border-border bg-secondary/30 p-3"
                >
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {module.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {module.powerDraw} W · {module.weight} g
                  </p>
                  {module.subComponents && module.subComponents.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {module.subComponents.map((sc) => (
                        <span
                          key={sc.name}
                          className="inline-block rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-xs text-primary/80"
                        >
                          {sc.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-8 border-t border-border pt-5">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Total Power
                </p>
                <p className="font-heading text-3xl font-bold text-primary">
                  {baseline.totalPower} W
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Total Weight
                </p>
                <p className="font-heading text-3xl font-bold text-accent">
                  {baseline.totalWeight} g
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Modules
                </p>
                <p className="font-heading text-3xl font-bold text-foreground">
                  {baseline.modules.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Spare Slots
                </p>
                <p className="font-heading text-3xl font-bold text-muted-foreground">
                  2
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

    </main>
  );
}
