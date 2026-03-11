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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PARTS_CATALOG,
  TRADE_STUDIES,
  getBOMSummary,
  type PartCategory,
  type SolderTermination,
  type QualificationLevel,
} from "@/lib/mock-parts";

const CATEGORY_COLORS: Record<PartCategory, string> = {
  Resistor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Capacitor: "bg-green-500/20 text-green-400 border-green-500/30",
  Inductor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Diode: "bg-red-500/20 text-red-400 border-red-500/30",
  Transistor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  IC: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Connector: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Crystal/Oscillator": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Transformer: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  Mechanical: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const TERMINATION_COLORS: Record<SolderTermination, string> = {
  "Pure-Tin": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  SnPb: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "N/A": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const QUAL_COLORS: Record<QualificationLevel, string> = {
  "QML-Q": "bg-green-600/20 text-green-400 border-green-600/30",
  "QML-V": "bg-emerald-600/20 text-emerald-300 border-emerald-600/30",
  "MIL-PRF": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "COTS-Plus": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  COTS: "bg-red-500/20 text-red-400 border-red-500/30",
  TBD: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

type FilterKey = "category" | "termination" | "qualification" | "footprint";

export default function PartsPage() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<FilterKey, string | null>>({
    category: null,
    termination: null,
    qualification: null,
    footprint: null,
  });

  const summary = useMemo(() => getBOMSummary(), []);

  const uniqueFootprints = useMemo(
    () => [...new Set(PARTS_CATALOG.map((p) => p.footprint))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return PARTS_CATALOG.filter((p) => {
      if (activeFilters.category && p.category !== activeFilters.category) return false;
      if (activeFilters.termination && p.solderTermination !== activeFilters.termination) return false;
      if (activeFilters.qualification && p.qualificationLevel !== activeFilters.qualification) return false;
      if (activeFilters.footprint && p.footprint !== activeFilters.footprint) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.description.toLowerCase().includes(q) ||
          p.manufacturerPartNumber.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.value && p.value.toLowerCase().includes(q)) ||
          p.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, activeFilters]);

  const toggleFilter = (key: FilterKey, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const clearFilters = () => {
    setActiveFilters({ category: null, termination: null, qualification: null, footprint: null });
    setSearch("");
  };

  const hasActiveFilters = Object.values(activeFilters).some(Boolean) || search.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Parts & Materials
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bill of Materials catalog — component selection, materials compliance, and trade study traceability.
          </p>
        </div>
        <Link href="/parts/import">
          <Button variant="outline" className="shrink-0">
            Import BOM
          </Button>
        </Link>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unique Part Numbers</CardDescription>
            <CardTitle className="font-heading text-2xl">{summary.totalUniquePartNumbers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              across {Object.keys(summary.byCategory).length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Quantity / Unit</CardDescription>
            <CardTitle className="font-heading text-2xl">{summary.totalQuantity.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">parts per baseline build</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pure Tin Parts</CardDescription>
            <CardTitle className="font-heading text-2xl">
              {summary.pureTimParts}{" "}
              <span className="text-sm font-normal text-yellow-400">({summary.pureTimPercentage}%)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              ≤0603 with conformal coat — per TS-001
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Trade Studies</CardDescription>
            <CardTitle className="font-heading text-2xl">{TRADE_STUDIES.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/parts/trade-studies" className="text-xs text-primary hover:underline">
              View all trade studies →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search by part number, description, manufacturer, or value…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-lg"
            />
          </div>

          {/* Category filters */}
          <div className="mb-3">
            <span className="mr-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Category
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {Object.keys(summary.byCategory).map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleFilter("category", cat)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                    activeFilters.category === cat
                      ? CATEGORY_COLORS[cat as PartCategory] + " ring-1 ring-white/20"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}{" "}
                  <span className="opacity-60">({summary.byCategory[cat].count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Termination filters */}
          <div className="mb-3">
            <span className="mr-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Solder Termination
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {Object.keys(summary.byTermination).map((term) => (
                <button
                  key={term}
                  onClick={() => toggleFilter("termination", term)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                    activeFilters.termination === term
                      ? TERMINATION_COLORS[term as SolderTermination] + " ring-1 ring-white/20"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {term}{" "}
                  <span className="opacity-60">({summary.byTermination[term].count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Qualification filters */}
          <div className="mb-3">
            <span className="mr-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Qualification
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {Object.keys(summary.byQualification).map((qual) => (
                <button
                  key={qual}
                  onClick={() => toggleFilter("qualification", qual)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                    activeFilters.qualification === qual
                      ? QUAL_COLORS[qual as QualificationLevel] + " ring-1 ring-white/20"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {qual}{" "}
                  <span className="opacity-60">({summary.byQualification[qual].count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footprint filters */}
          <div className="mb-1">
            <span className="mr-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Footprint
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {uniqueFootprints.map((fp) => (
                <button
                  key={fp}
                  onClick={() => toggleFilter("footprint", fp)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                    activeFilters.footprint === fp
                      ? "bg-primary/20 text-primary border-primary/30 ring-1 ring-white/20"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {fp}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-border">
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕ Clear all filters
              </button>
              <span className="ml-3 text-xs text-muted-foreground">
                {filtered.length} of {PARTS_CATALOG.length} parts
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Parts Table ────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Part
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    MFR P/N
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Footprint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Termination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Qual
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Qty
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((part) => (
                  <tr
                    key={part.id}
                    className="hover:bg-card/50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/parts/${part.id}`}
                        className="text-foreground group-hover:text-primary transition-colors font-medium"
                      >
                        {part.description}
                      </Link>
                      {part.value && (
                        <span className="ml-2 text-muted-foreground">{part.value}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {part.manufacturerPartNumber}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={CATEGORY_COLORS[part.category]}>
                        {part.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{part.footprint}</td>
                    <td className="px-4 py-3">
                      <Badge className={TERMINATION_COLORS[part.solderTermination]}>
                        {part.solderTermination}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={QUAL_COLORS[part.qualificationLevel]}>
                        {part.qualificationLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{part.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No parts match your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
