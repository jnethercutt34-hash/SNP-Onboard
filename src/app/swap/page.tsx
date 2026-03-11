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
import { Progress } from "@/components/ui/progress";
import { BUILDS, flattenComponents, type SystemBuild } from "@/lib/mock-hardware";

// ─── Constants ─────────────────────────────────────────────────────────────
const MAX_POWER_BUDGET = 150; // Watts — bus limit
const MAX_WEIGHT_BUDGET = 4500; // grams — allocation
const POWER_WARNING_PCT = 80;
const WEIGHT_WARNING_PCT = 85;

// Slot-level power for stacked bar
function getSlotPower(build: SystemBuild) {
  return build.slots
    .map((slot) => {
      const mezzPower = slot.attachedMezzanines.reduce((s, m) => s + m.powerDrawWatts, 0);
      return {
        slotNumber: slot.slotNumber,
        label: slot.baseCard.name.replace(/Universal GPP Card |Power Converter |Cryptographic |Timing & Networking /g, "").replace(/\(|\)/g, ""),
        basePower: slot.baseCard.powerDrawWatts,
        mezzPower,
        totalPower: slot.baseCard.powerDrawWatts + mezzPower,
        baseWeight: slot.baseCard.weightGrams,
        mezzWeight: slot.attachedMezzanines.reduce((s, m) => s + m.weightGrams, 0),
        totalWeight: slot.baseCard.weightGrams + slot.attachedMezzanines.reduce((s, m) => s + m.weightGrams, 0),
      };
    })
    .sort((a, b) => a.slotNumber - b.slotNumber);
}

// Colors for builds
const BUILD_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  baseline: { bg: "bg-blue-500/20", bar: "bg-blue-500", text: "text-blue-400" },
  "customer-a-pleo": { bg: "bg-purple-500/20", bar: "bg-purple-500", text: "text-purple-400" },
  "customer-b-pleo": { bg: "bg-amber-500/20", bar: "bg-amber-500", text: "text-amber-400" },
  "customer-c-pleo": { bg: "bg-emerald-500/20", bar: "bg-emerald-500", text: "text-emerald-400" },
  "fms-irad": { bg: "bg-orange-500/20", bar: "bg-orange-500", text: "text-orange-400" },
};

const SLOT_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
  "bg-green-500", "bg-teal-500", "bg-blue-500",
];

export default function SwapDashboardPage() {
  const [selectedBuild, setSelectedBuild] = useState<string>("baseline");

  const build = useMemo(
    () => BUILDS.find((b) => b.id === selectedBuild) || BUILDS[0],
    [selectedBuild]
  );

  const slots = useMemo(() => getSlotPower(build), [build]);
  const components = useMemo(() => flattenComponents(build), [build]);
  const totalPower = build.totalSystemPower;
  const totalWeight = build.totalSystemWeight;
  const powerPct = Math.round((totalPower / MAX_POWER_BUDGET) * 100);
  const weightPct = Math.round((totalWeight / MAX_WEIGHT_BUDGET) * 100);
  const powerMargin = MAX_POWER_BUDGET - totalPower;
  const weightMargin = MAX_WEIGHT_BUDGET - totalWeight;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          SWaP-C Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Size, Weight, and Power analysis across all builds. Compare power budgets, weight allocations, and slot-level contributions.
        </p>
      </div>

      {/* ── Build Selector ─────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {BUILDS.map((b) => {
          const colors = BUILD_COLORS[b.id] || BUILD_COLORS.baseline;
          const isActive = b.id === selectedBuild;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBuild(b.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                isActive
                  ? `${colors.bg} ${colors.text} border-current ring-1 ring-white/20`
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {b.customerName}
              <span className="ml-1.5 opacity-60">{b.totalSystemPower} W</span>
            </button>
          );
        })}
      </div>

      {/* ── Top-Level Metrics ──────────────────────────────────── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Power</CardDescription>
            <CardTitle className="font-heading text-2xl">
              {totalPower} W
              <span className={`ml-2 text-sm font-normal ${powerPct >= POWER_WARNING_PCT ? "text-red-400" : "text-green-400"}`}>
                ({powerMargin} W margin)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={powerPct} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">
              {powerPct}% of {MAX_POWER_BUDGET} W bus limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Weight</CardDescription>
            <CardTitle className="font-heading text-2xl">
              {(totalWeight / 1000).toFixed(2)} kg
              <span className={`ml-2 text-sm font-normal ${weightPct >= WEIGHT_WARNING_PCT ? "text-red-400" : "text-green-400"}`}>
                ({(weightMargin / 1000).toFixed(2)} kg margin)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={weightPct} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">
              {weightPct}% of {(MAX_WEIGHT_BUDGET / 1000).toFixed(1)} kg allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Populated Slots</CardDescription>
            <CardTitle className="font-heading text-2xl">
              {build.slots.length}
              <span className="text-sm font-normal text-muted-foreground ml-1">/ 7</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {7 - build.slots.length} spare slot{7 - build.slots.length !== 1 ? "s" : ""} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Component Count</CardDescription>
            <CardTitle className="font-heading text-2xl">{components.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              base cards + mezzanines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Power Budget Bar Chart ─────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">⚡ Power Budget — Slot Breakdown</CardTitle>
          <CardDescription>
            Per-slot power contribution for {build.customerName} ({totalPower} W / {MAX_POWER_BUDGET} W)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stacked horizontal bar */}
          <div className="mb-4">
            <div className="flex h-10 rounded-lg overflow-hidden bg-secondary">
              {slots.map((slot, i) => {
                const widthPct = (slot.totalPower / MAX_POWER_BUDGET) * 100;
                return (
                  <div
                    key={slot.slotNumber}
                    className={`${SLOT_COLORS[i % SLOT_COLORS.length]} relative group`}
                    style={{ width: `${widthPct}%` }}
                    title={`Slot ${slot.slotNumber}: ${slot.label} — ${slot.totalPower} W`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {slot.totalPower}W
                    </div>
                  </div>
                );
              })}
              {/* Margin */}
              <div
                className="bg-secondary flex items-center justify-center"
                style={{ width: `${(powerMargin / MAX_POWER_BUDGET) * 100}%` }}
              >
                <span className="text-xs text-muted-foreground">Margin</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {slots.map((slot, i) => (
              <div key={slot.slotNumber} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm shrink-0 ${SLOT_COLORS[i % SLOT_COLORS.length]}`} />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Slot {slot.slotNumber}: {slot.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {slot.basePower} W{slot.mezzPower > 0 ? ` + ${slot.mezzPower} W mez` : ""} = {slot.totalPower} W
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Weight Budget Bar Chart ────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">⚖️ Weight Budget — Slot Breakdown</CardTitle>
          <CardDescription>
            Per-slot weight contribution for {build.customerName} ({(totalWeight / 1000).toFixed(2)} kg / {(MAX_WEIGHT_BUDGET / 1000).toFixed(1)} kg)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex h-10 rounded-lg overflow-hidden bg-secondary">
              {slots.map((slot, i) => {
                const widthPct = (slot.totalWeight / MAX_WEIGHT_BUDGET) * 100;
                return (
                  <div
                    key={slot.slotNumber}
                    className={`${SLOT_COLORS[i % SLOT_COLORS.length]} relative group`}
                    style={{ width: `${widthPct}%` }}
                    title={`Slot ${slot.slotNumber}: ${slot.label} — ${slot.totalWeight} g`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {slot.totalWeight}g
                    </div>
                  </div>
                );
              })}
              <div
                className="bg-secondary flex items-center justify-center"
                style={{ width: `${(weightMargin / MAX_WEIGHT_BUDGET) * 100}%` }}
              >
                <span className="text-xs text-muted-foreground">Margin</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {slots.map((slot, i) => (
              <div key={slot.slotNumber} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm shrink-0 ${SLOT_COLORS[i % SLOT_COLORS.length]}`} />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Slot {slot.slotNumber}: {slot.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {slot.baseWeight}g{slot.mezzWeight > 0 ? ` + ${slot.mezzWeight}g mez` : ""} = {slot.totalWeight}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Cross-Build Comparison ─────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">📊 Cross-Build Comparison</CardTitle>
          <CardDescription>Power and weight across all builds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {BUILDS.map((b) => {
              const colors = BUILD_COLORS[b.id] || BUILD_COLORS.baseline;
              const pPct = (b.totalSystemPower / MAX_POWER_BUDGET) * 100;
              const wPct = (b.totalSystemWeight / MAX_WEIGHT_BUDGET) * 100;
              const isSelected = b.id === selectedBuild;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuild(b.id)}
                  className={`w-full text-left rounded-lg border p-4 transition-all ${
                    isSelected ? "border-primary/50 bg-primary/5" : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-heading font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {b.customerName}
                      </span>
                      {b.id === "baseline" && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Baseline</Badge>
                      )}
                      {b.id === "fms-irad" && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">IRAD</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={colors.text}>{b.totalSystemPower} W</span>
                      <span className="text-muted-foreground">{(b.totalSystemWeight / 1000).toFixed(2)} kg</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Power</span>
                        <span>{Math.round(pPct)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${pPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Weight</span>
                        <span>{Math.round(wPct)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${wPct}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
