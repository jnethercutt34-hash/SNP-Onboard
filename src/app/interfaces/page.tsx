"use client";

import { useState, useMemo } from "react";
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
  SIGNAL_PATHS,
  BACKPLANE_INFO,
  DOMAINS,
  getSignalsByDomain,
  getSignalsForBuild,
  type SignalDomain,
} from "@/lib/mock-interfaces";
import { BUILDS } from "@/lib/mock-hardware";

const DOMAIN_COLORS: Record<SignalDomain, string> = {
  "Data Plane": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Control Plane": "bg-green-500/20 text-green-400 border-green-500/30",
  "Utility Plane": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  External: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Timing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const DOMAIN_ICONS: Record<SignalDomain, string> = {
  "Data Plane": "📡",
  "Control Plane": "🎛️",
  "Utility Plane": "🔧",
  External: "🔌",
  Timing: "⏱️",
};

const MODULE_SHORT: Record<string, string> = {
  "gpp-universal": "GPP",
  "optical-10g": "Optical Mez",
  "net-10g-copper": "Copper Mez",
  "crypto-unit": "Crypto",
  "psu-red": "PSU Red",
  "psu-black": "PSU Black",
  "timing-atomic-clock": "Atomic Clock",
  external: "External",
};

export default function InterfacesPage() {
  const [domainFilter, setDomainFilter] = useState<SignalDomain | null>(null);
  const [buildFilter, setBuildFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let signals = buildFilter === "all" ? SIGNAL_PATHS : getSignalsForBuild(buildFilter);
    if (domainFilter) signals = signals.filter((s) => s.domain === domainFilter);
    return signals;
  }, [domainFilter, buildFilter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Interface & Signal Map
        </h1>
        <p className="mt-2 text-muted-foreground">
          SpaceVPX backplane signal routing, external connector mapping, and per-build interface configuration.
        </p>
      </div>

      {/* ── Backplane Architecture ─────────────────────────────── */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-heading text-lg">🔲 {BACKPLANE_INFO.standard} Backplane</CardTitle>
          <CardDescription>{BACKPLANE_INFO.slots}-slot chassis — 3 signal planes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {BACKPLANE_INFO.planes.map((plane) => (
              <div key={plane.name} className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{plane.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{plane.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{plane.connector}</span>
                  <span className="font-mono text-foreground">{plane.maxBandwidth}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Domain */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider self-center mr-1">Domain</span>
          {DOMAINS.map((d) => {
            const count = (buildFilter === "all" ? SIGNAL_PATHS : getSignalsForBuild(buildFilter)).filter((s) => s.domain === d).length;
            return (
              <button
                key={d}
                onClick={() => setDomainFilter(domainFilter === d ? null : d)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                  domainFilter === d
                    ? DOMAIN_COLORS[d] + " ring-1 ring-white/20"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {DOMAIN_ICONS[d]} {d} ({count})
              </button>
            );
          })}
        </div>

        {/* Build */}
        <div className="flex flex-wrap gap-1.5 ml-auto">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider self-center mr-1">Build</span>
          <button
            onClick={() => setBuildFilter("all")}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
              buildFilter === "all" ? "bg-primary/20 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {BUILDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setBuildFilter(buildFilter === b.id ? "all" : b.id)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                buildFilter === b.id ? "bg-primary/20 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {b.customerName}
            </button>
          ))}
        </div>
      </div>

      {/* ── Signal List ────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.map((signal) => (
          <Card key={signal.id} className="hover:border-border/80 transition-colors">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={DOMAIN_COLORS[signal.domain]}>{signal.domain}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{signal.protocol}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{signal.name}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-foreground">{signal.speed}</span>
                  <p className="text-xs text-muted-foreground">{signal.direction}</p>
                </div>
              </div>

              {/* Signal path visualization */}
              <div className="flex items-center gap-2 my-3 px-2">
                <div className="rounded border border-border px-2 py-1 text-center min-w-[80px]">
                  <p className="text-xs font-medium text-foreground">
                    {signal.sourceSlot > 0 ? `Slot ${signal.sourceSlot}` : "Ext"}
                  </p>
                  <p className="text-xs text-muted-foreground">{MODULE_SHORT[signal.sourceModule] || signal.sourceModule}</p>
                  {signal.sourceConnector && (
                    <p className="text-xs text-primary/70 font-mono">{signal.sourceConnector}</p>
                  )}
                </div>

                <div className="flex-1 flex items-center">
                  <div className="flex-1 h-px bg-primary/30" />
                  <span className="mx-1 text-primary text-xs">→</span>
                  <div className="flex-1 h-px bg-primary/30" />
                </div>

                <div className="rounded border border-border px-2 py-1 text-center min-w-[80px]">
                  <p className="text-xs font-medium text-foreground">
                    {signal.destSlot > 0 ? `Slot ${signal.destSlot}` : "Ext"}
                  </p>
                  <p className="text-xs text-muted-foreground">{MODULE_SHORT[signal.destModule] || signal.destModule}</p>
                  {signal.destConnector && (
                    <p className="text-xs text-primary/70 font-mono">{signal.destConnector}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{signal.description}</p>

              {signal.buildSpecific && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Build-specific:</span>
                  {signal.buildSpecific.map((b) => (
                    <Badge key={b} variant="outline" className="text-xs">
                      {BUILDS.find((build) => build.id === b)?.customerName || b}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No signals match the current filters.
        </div>
      )}
    </main>
  );
}
