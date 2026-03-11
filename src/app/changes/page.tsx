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
  CHANGE_RECORDS,
  getChangeStatusCounts,
  getModuleName,
  getBuildName,
  type ChangeStatus,
  type ChangeType,
  type ChangeSeverity,
} from "@/lib/mock-changes";

const STATUS_COLORS: Record<ChangeStatus, string> = {
  Draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Reviewed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Approved: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Incorporated: "bg-green-500/20 text-green-400 border-green-500/30",
  Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const TYPE_COLORS: Record<ChangeType, string> = {
  ECO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ECN: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  DCN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Deviation: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Waiver: "bg-red-500/20 text-red-400 border-red-500/30",
};

const SEVERITY_COLORS: Record<ChangeSeverity, string> = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  Major: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Minor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Administrative: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function ChangesPage() {
  const [statusFilter, setStatusFilter] = useState<ChangeStatus | null>(null);
  const [typeFilter, setTypeFilter] = useState<ChangeType | null>(null);

  const statusCounts = useMemo(() => getChangeStatusCounts(), []);
  const total = CHANGE_RECORDS.length;

  const filtered = useMemo(() => {
    return CHANGE_RECORDS.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (typeFilter && c.type !== typeFilter) return false;
      return true;
    }).sort((a, b) => b.dateSubmitted.localeCompare(a.dateSubmitted));
  }, [statusFilter, typeFilter]);

  const hasFilters = statusFilter !== null || typeFilter !== null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Configuration Changes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Engineering change orders (ECOs), engineering change notices (ECNs), and design change notices (DCNs) across the SNP product line.
        </p>
      </div>

      {/* ── Summary ────────────────────────────────────────────── */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.entries(statusCounts) as [ChangeStatus, number][])
          .filter(([, count]) => count > 0)
          .map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              className={`rounded-lg border p-3 text-center transition-all ${
                statusFilter === status ? "border-primary/50 bg-primary/5" : "border-border hover:border-border/80"
              }`}
            >
              <p className="text-2xl font-heading font-bold text-foreground">{count}</p>
              <Badge className={`${STATUS_COLORS[status]} mt-1`}>{status}</Badge>
            </button>
          ))}
      </div>

      {/* ── Type Filters ───────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-1">Type</span>
        {(["ECO", "ECN", "DCN", "Deviation", "Waiver"] as ChangeType[]).map((t) => {
          const count = CHANGE_RECORDS.filter((c) => c.type === t).length;
          if (count === 0) return null;
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(typeFilter === t ? null : t)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                typeFilter === t
                  ? TYPE_COLORS[t] + " ring-1 ring-white/20"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
        {hasFilters && (
          <button
            onClick={() => { setStatusFilter(null); setTypeFilter(null); }}
            className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕ Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} of {total} changes
        </span>
      </div>

      {/* ── Change List ────────────────────────────────────────── */}
      <div className="space-y-4">
        {filtered.map((change) => (
          <Link key={change.id} href={`/changes/${change.id}`} className="block group">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={TYPE_COLORS[change.type]}>{change.type}</Badge>
                      <Badge className={SEVERITY_COLORS[change.severity]}>{change.severity}</Badge>
                      <span className="text-xs font-mono text-muted-foreground">{change.changeNumber}</span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {change.title}
                    </h3>
                  </div>
                  <Badge className={`shrink-0 ${STATUS_COLORS[change.status]}`}>{change.status}</Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {change.description}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                  <span>Submitted: {change.dateSubmitted}</span>
                  {change.dateApproved && <span>Approved: {change.dateApproved}</span>}
                  {change.dateIncorporated && <span>Incorporated: {change.dateIncorporated}</span>}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {change.affectedModules.map((m) => (
                    <Badge key={m} variant="outline" className="text-xs">{getModuleName(m)}</Badge>
                  ))}
                  <span className="text-xs text-muted-foreground self-center ml-1">
                    → {change.affectedBuilds.map(getBuildName).join(", ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No changes match the current filters.
        </div>
      )}
    </main>
  );
}
