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
  CHANGE_RECORDS,
  getChangeById,
  getModuleName,
  getBuildName,
  type ChangeStatus,
  type ChangeType,
  type ChangeSeverity,
} from "@/lib/mock-changes";

export function generateStaticParams() {
  return CHANGE_RECORDS.map((c) => ({ changeId: c.id }));
}

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

// Timeline step colors
const STEP_DONE = "bg-green-400";
const STEP_CURRENT = "bg-amber-400";
const STEP_FUTURE = "bg-gray-600";

export default async function ChangeDetailPage({
  params,
}: {
  params: Promise<{ changeId: string }>;
}) {
  const { changeId } = await params;
  const change = getChangeById(changeId);
  if (!change) notFound();

  const steps: { label: string; date?: string; done: boolean; current: boolean }[] = [
    { label: "Submitted", date: change.dateSubmitted, done: true, current: false },
    { label: "Approved", date: change.dateApproved, done: !!change.dateApproved, current: change.status === "Approved" },
    { label: "Incorporated", date: change.dateIncorporated, done: !!change.dateIncorporated, current: false },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/changes" className="hover:text-foreground transition-colors">
          Changes
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{change.changeNumber}</span>
      </nav>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className={TYPE_COLORS[change.type]}>{change.type}</Badge>
          <Badge className={SEVERITY_COLORS[change.severity]}>{change.severity}</Badge>
          <Badge className={STATUS_COLORS[change.status]}>{change.status}</Badge>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {change.title}
        </h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          {change.changeNumber} · Submitted by {change.submittedBy}
        </p>
      </div>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${step.done ? STEP_DONE : step.current ? STEP_CURRENT : STEP_FUTURE}`} />
                  <p className="text-xs font-medium text-foreground mt-1">{step.label}</p>
                  {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${step.done ? "bg-green-400/50" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
          {change.approvedBy && (
            <p className="mt-3 text-xs text-muted-foreground">
              Approved by: <span className="text-foreground">{change.approvedBy}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Description ───────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{change.description}</p>
        </CardContent>
      </Card>

      {/* ── Rationale ─────────────────────────────────────────────── */}
      <Card className="mb-6 border-blue-500/20">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-blue-400">Rationale</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{change.rationale}</p>
        </CardContent>
      </Card>

      {/* ── Impact ────────────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Affected Modules</CardTitle>
            <CardDescription>{change.affectedModules.length} module(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {change.affectedModules.map((m) => (
                <Link key={m} href={`/modules/${m}`} className="block group">
                  <div className="flex items-center gap-2 rounded-md p-2 hover:bg-card/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {getModuleName(m)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Affected Builds</CardTitle>
            <CardDescription>{change.affectedBuilds.length} build(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {change.affectedBuilds.map((b) => (
                <Link key={b} href={`/builds/${b}`} className="block group">
                  <div className="flex items-center gap-2 rounded-md p-2 hover:bg-card/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {getBuildName(b)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Document References ────────────────────────────────────── */}
      {change.documentRefs && change.documentRefs.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Document References</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {change.documentRefs.map((ref) => (
                <Badge key={ref} variant="outline" className="font-mono text-xs">
                  {ref}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Notes ─────────────────────────────────────────────────── */}
      {change.notes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{change.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-sm">
        <Link href="/changes" className="text-muted-foreground hover:text-foreground transition-colors">
          ← All Changes
        </Link>
      </div>
    </main>
  );
}
