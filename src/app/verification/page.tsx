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
import {
  REQUIREMENTS,
  CATEGORIES,
  getVerificationSummary,
  getRequirementsByCategory,
  type VerificationStatus,
  type VerificationMethod,
} from "@/lib/mock-verification";

const STATUS_COLORS: Record<VerificationStatus, string> = {
  Pass: "bg-green-500/20 text-green-400 border-green-500/30",
  Fail: "bg-red-500/20 text-red-400 border-red-500/30",
  "In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Not Started": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Waiver: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "N/A": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const STATUS_DOT: Record<VerificationStatus, string> = {
  Pass: "bg-green-400",
  Fail: "bg-red-400",
  "In Progress": "bg-amber-400",
  "Not Started": "bg-gray-400",
  Waiver: "bg-purple-400",
  "N/A": "bg-gray-400",
};

const METHOD_COLORS: Record<VerificationMethod, string> = {
  Test: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Analysis: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Inspection: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Demonstration: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Similarity: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const CATEGORY_ICONS: Record<string, string> = {
  Performance: "⚡",
  Environmental: "🌡️",
  Radiation: "☢️",
  EMI: "📡",
  Safety: "🔒",
  Power: "🔋",
};

const MODULE_NAMES: Record<string, string> = {
  "gpp-universal": "GPP",
  "optical-10g": "Optical",
  "net-10g-copper": "Copper",
  "crypto-unit": "Crypto",
  "psu-red": "PSU-R",
  "psu-black": "PSU-B",
  "timing-atomic-clock": "Clock",
};

export default function VerificationPage() {
  const summary = getVerificationSummary();
  const passPct = Math.round((summary.pass / summary.total) * 100);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Verification & Test Status
        </h1>
        <p className="mt-2 text-muted-foreground">
          Requirements verification matrix — traceability from requirements to test procedures and results.
        </p>
      </div>

      {/* ── Summary ────────────────────────────────────────────── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardDescription>Overall Verification</CardDescription>
            <CardTitle className="font-heading text-2xl text-green-400">
              {passPct}% Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={passPct} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {summary.pass} of {summary.total} requirements verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Passed</CardDescription>
            <CardTitle className="font-heading text-2xl text-green-400">{summary.pass}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">requirements</p></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="font-heading text-2xl text-amber-400">{summary.inProgress}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">requirements</p></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Not Started</CardDescription>
            <CardTitle className="font-heading text-2xl text-gray-400">{summary.notStarted}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">requirements</p></CardContent>
        </Card>
      </div>

      {/* ── Category Progress ──────────────────────────────────── */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const data = summary.byCategory[cat];
          const pct = data.total > 0 ? Math.round((data.pass / data.total) * 100) : 0;
          return (
            <Card key={cat}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {CATEGORY_ICONS[cat] || "📋"} {cat}
                  </span>
                  <span className="text-sm font-heading font-bold text-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5 mb-1" />
                <p className="text-xs text-muted-foreground">{data.pass}/{data.total} verified</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Requirements Matrix ────────────────────────────────── */}
      {CATEGORIES.map((cat) => {
        const reqs = getRequirementsByCategory(cat);
        return (
          <div key={cat} className="mb-8">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              {CATEGORY_ICONS[cat] || "📋"} {cat}
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {reqs.map((req) => (
                    <div key={req.id} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${STATUS_DOT[req.status]}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{req.title}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs font-mono text-muted-foreground">{req.specification}</span>
                              <Badge className={METHOD_COLORS[req.verificationMethod] + " text-xs"}>
                                {req.verificationMethod}
                              </Badge>
                              {req.testProcedure && (
                                <span className="text-xs text-muted-foreground font-mono">{req.testProcedure}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <Badge className={STATUS_COLORS[req.status]}>{req.status}</Badge>
                          {req.testDate && (
                            <p className="text-xs text-muted-foreground mt-1">{req.testDate}</p>
                          )}
                        </div>
                      </div>

                      {(req.notes || req.testReport) && (
                        <div className="ml-4 mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {req.testReport && (
                            <span className="font-mono">Report: {req.testReport}</span>
                          )}
                          {req.notes && <span>{req.notes}</span>}
                        </div>
                      )}

                      <div className="ml-4 mt-1.5 flex flex-wrap gap-1">
                        {req.affectedModules.map((m) => (
                          <Link key={m} href={`/modules/${m}`}>
                            <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors cursor-pointer">
                              {MODULE_NAMES[m] || m}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </main>
  );
}
