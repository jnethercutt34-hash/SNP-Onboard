import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUILDS } from "@/lib/mock-hardware";
import type { VPXSlot } from "@/lib/mock-hardware";

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
          network switching, and cryptographic operations in LEO mission environments.
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
                10 Gbps SerDes data lanes per slot. Operating range −21 °C to +50 °C deck temperature.
                Radiation-tolerant construction for orbital environments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Dual-GPP — Two-CCA Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each GPP is a two-CCA assembly: a fixed <span className="text-foreground font-medium">Universal carrier board</span> and
                a mission-configurable <span className="text-foreground font-medium">Mezzanine daughter card</span>. Two GPP assemblies
                run in hot-standby with &lt;200 ms switchover via the SpaceVPX control plane.
                Black can be demoted to co-processing mode to double compute throughput on demand.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">GPP Universal Board</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A complex digital CCA built around the <span className="text-foreground font-medium">AMD Versal VM1502</span> — integrating
                a 1.5M SLC FPGA fabric, dual ARM Cortex-A78AE application processors, and an AI Engine array.
                Paired with 16 GB DDR4, 2 Gb MRAM, and a dedicated board-management microcontroller.
                The Universal board is a fixed design — it does not change unit to unit. All mission
                differentiation is handled by the Mezzanine daughter card.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">ECC-Protected Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                16 GB DDR4 SDRAM with hardware ECC correction for radiation-tolerant operation.
                2 Gb <span className="text-foreground font-medium">MRAM</span> provides non-volatile,
                radiation-immune storage for firmware, keys, and configuration — retaining state
                through power cycles and single-event upsets without a re-flash cycle.
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
              <CardTitle className="font-heading text-base">Mezzanine &amp; Spare Slot Expandability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Mezzanine daughter card connects to the Universal board via an{" "}
                <span className="text-foreground font-medium">FMC connector</span>, making it the sole
                hardware variable between builds. Any mezzanine option (Optical, Copper, QSFP, CSAC Timing)
                can be installed on either baseline GPP. Additional GPP assemblies can also occupy the
                two spare VPX slots — each with its own mezzanine — to unlock parallel processing
                pipelines, additional network interfaces, or independent timing domains per side.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Baseline Specs ───────────────────────────────────────── */}
      <section className="mb-14">
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
              {baseline.slots.map((slot: VPXSlot) => (
                <div
                  key={slot.baseCard.id}
                  className="rounded-md border border-border bg-secondary/30 p-3"
                >
                  {slot.baseCard.detailId ? (
                    <Link
                      href={`/modules/${slot.baseCard.detailId}`}
                      className="flex items-center justify-between group"
                    >
                      <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                        {slot.baseCard.name}
                      </p>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors ml-1 shrink-0">
                        →
                      </span>
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {slot.baseCard.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {slot.baseCard.powerDrawWatts} W · {slot.baseCard.weightGrams} g
                  </p>
                  {slot.attachedMezzanines.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {slot.attachedMezzanines.map((sc) =>
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
              ))}
            </div>
            <div className="flex flex-wrap gap-8 border-t border-border pt-5">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Power</p>
                <p className="font-heading text-3xl font-bold text-primary">{baseline.totalSystemPower} W</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Weight</p>
                <p className="font-heading text-3xl font-bold text-accent">{baseline.totalSystemWeight} g</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Modules</p>
                <p className="font-heading text-3xl font-bold text-foreground">{baseline.slots.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Spare Slots</p>
                <p className="font-heading text-3xl font-bold text-muted-foreground">{7 - baseline.slots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Mezzanine Options ────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-semibold mb-1 text-foreground">
          Mezzanine Options
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          XMC mezzanine cards bolt onto each GPP carrier board — one per GPP slot. Select per mission profile.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* ── 10G Optical ── */}
          <Link href="/modules/optical-10g" className="block group">
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-base leading-snug group-hover:text-primary transition-colors">
                    10G Optical XMC Mezzanine
                  </CardTitle>
                  <Badge className="shrink-0 bg-primary/20 text-primary border-primary/30 text-xs">
                    Baseline
                  </Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  Quad-channel 50 Gbps fiber-optic networking via AirBorn FOCuS VTRFA connector.
                  Radiation-hardened, sealed optical path. Standard for all baseline builds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Specs row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Optical BW",  value: "50 Gbps" },
                    { label: "Power",       value: "6 W" },
                    { label: "Weight",      value: "40 g" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-md bg-secondary/30 px-2 py-1.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
                      <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
                    </div>
                  ))}
                </div>
                {/* On-board components */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5">On-Board</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: "1G Quad PHY",    href: "/modules/quad-phy-1g"   },
                      { label: "1.2 TB M.2 SSD", href: "/modules/ssd-m2-1p2tb"  },
                      { label: "64 GB eMMC",      href: "/modules/emmc-64gb"     },
                    ].map(({ label, href }) => (
                      <span key={label}
                        className="inline-block rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-xs text-primary/80">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-right pt-1">
                  View specs & datasheets →
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* ── 10G Copper ── */}
          <Link href="/modules/net-10g-copper" className="block group">
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-base leading-snug group-hover:text-primary transition-colors">
                    10G Copper XMC Mezzanine
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    pLEO
                  </Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  Dual-channel 10GBASE-T copper networking via shielded RJ-45. Reduced SWaP-C
                  profile eliminates fiber management — optimised for proliferated LEO constellations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Specs row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Copper BW", value: "20 Gbps" },
                    { label: "Power",     value: "3 W" },
                    { label: "Weight",    value: "25 g" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-md bg-secondary/30 px-2 py-1.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
                      <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
                    </div>
                  ))}
                </div>
                {/* Savings vs optical */}
                <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-0.5">SWaP-C Savings vs Optical</p>
                  <p className="text-xs text-muted-foreground">−3 W · −15 g · No fiber management overhead</p>
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-right pt-1">
                  View specs & datasheets →
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* ── 3× QSFP ── */}
          <Link href="/modules/mez-qsfp-3x" className="block group">
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-base leading-snug group-hover:text-primary transition-colors">
                    3× QSFP XMC Mezzanine
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    High-Density
                  </Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  Three independent QSFP+ cages routing the GPP 10G data-plane lanes.
                  40 Gbps per port, 120 Gbps aggregate — flexible breakout cabling for payload and rack interconnect.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Specs row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Agg. BW",  value: "120 Gbps" },
                    { label: "Power",    value: "8 W" },
                    { label: "Weight",   value: "55 g" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-md bg-secondary/30 px-2 py-1.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
                      <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
                    </div>
                  ))}
                </div>
                {/* QSFP callout */}
                <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
                  <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-0.5">QSFP+ Cages</p>
                  <p className="text-xs text-muted-foreground">3 × QSFP+ · 4 lanes each · SR4 / LR4 / 4×10G breakout</p>
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-right pt-1">
                  View specs & datasheets →
                </p>
              </CardContent>
            </Card>
          </Link>

        </div>
      </section>

      {/* ── Expansion Modules ─────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-semibold mb-1 text-foreground">
          Expansion Modules
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Mission-specific modules that occupy spare VPX slots. Baseline provides 2 spare slots.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">

          {/* ── Crypto Unit ── */}
          <Link href="/modules/crypto-unit" className="block group">
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-base leading-snug group-hover:text-primary transition-colors">
                    Cryptographic Processing Unit
                  </CardTitle>
                  <Badge className="shrink-0 bg-violet-500/20 text-violet-400 border-violet-500/30 text-xs">
                    All Builds
                  </Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  FIPS 140-2 Level 3 hardware security module. AES-256-GCM at 40 Gbps line rate,
                  ECC P-384 key exchange, and active tamper-zeroization in under 1 µs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "AES Throughput", value: "40 Gbps" },
                    { label: "Power",          value: "10 W" },
                    { label: "Weight",         value: "130 g" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-md bg-secondary/30 px-2 py-1.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
                      <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {["AES-256-GCM", "SHA-3", "ECC P-384", "RSA-4096", "TRNG"].map((alg) => (
                    <span key={alg}
                      className="inline-block rounded border border-violet-500/25 bg-violet-500/10 px-1.5 py-0.5 text-xs text-violet-400/80">
                      {alg}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-right pt-1">
                  View specs & datasheets →
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* ── Atomic Clock ── */}
          <Link href="/modules/timing-atomic-clock" className="block group">
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-base leading-snug group-hover:text-primary transition-colors">
                    Timing &amp; Networking Expansion
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    Expansion
                  </Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  Chip-scale atomic clock (CSAC) for nanosecond-class time synchronization
                  independent of GPS. IEEE 1588v2 PTP Grandmaster. Occupies one spare VPX slot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Holdover",  value: "< 100 ns/day" },
                    { label: "Power",     value: "13 W" },
                    { label: "Weight",    value: "275 g" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-md bg-secondary/30 px-2 py-1.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
                      <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {["10 MHz Ref", "1 PPS", "PTP IEEE 1588v2", "GPS Holdover"].map((feat) => (
                    <span key={feat}
                      className="inline-block rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-xs text-muted-foreground">
                      {feat}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-right pt-1">
                  View specs & datasheets →
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* ── CSAC Precision Timing Module ── */}
          <Card className="h-full border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="font-heading text-base leading-snug text-amber-300">
                  CSAC Precision Timing Module
                </CardTitle>
                <Badge className="shrink-0 bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                  Expansion
                </Badge>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                A dedicated VPX expansion module housing a Chip-Scale Atomic Clock (CSAC).
                Provides nanosecond-class PTP precision, 1PPS, and 10 MHz reference outputs
                to the network interfaces on the connected GPP side. Requires its own VPX slot —
                this is not a drop-in mezzanine swap. Optional signal filtering isolates 1PPS
                and 10 MHz outputs to either the Red or Black security domain without cross-contamination.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "PTP Accuracy", value: "< 50 ns"    },
                  { label: "1PPS Jitter",  value: "< 1 ns"     },
                  { label: "10 MHz Ref",   value: "±5×10⁻¹¹"  },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-md bg-amber-500/10 px-2 py-1.5">
                    <p className="text-xs text-amber-400/70 uppercase tracking-widest leading-none mb-1">{label}</p>
                    <p className="text-sm font-semibold text-amber-200 font-mono">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {["CSAC", "1 PPS Out", "10 MHz Out", "IEEE 1588v2 PTP", "Red Filter", "Black Filter", "Occupies VPX Slot"].map((feat) => (
                  <span key={feat}
                    className="inline-block rounded border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-400/80">
                    {feat}
                  </span>
                ))}
              </div>
              <div className="rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-0.5">Red / Black Domain Filtering</p>
                <p className="text-xs text-muted-foreground">
                  Signal filtering selectable per output — route 1PPS and 10 MHz to Red or
                  Black domain independently. Pairs with the GPP on the same network side
                  to deliver high-precision PTP timestamps to that domain's interfaces.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>


    </main>
  );
}
