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
import { Progress } from "@/components/ui/progress";
import {
  MODULE_QUALIFICATIONS,
  getModuleQualification,
  getModuleQualSummary,
  type QualStatus,
} from "@/lib/mock-qualification";

export function generateStaticParams() {
  return MODULE_QUALIFICATIONS.map((mq) => ({ moduleId: mq.moduleId }));
}

const STATUS_COLORS: Record<QualStatus, string> = {
  Qualified: "bg-green-500/20 text-green-400 border-green-500/30",
  "In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "N/A": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Waiver: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_DOT: Record<QualStatus, string> = {
  Qualified: "bg-green-400",
  "In Progress": "bg-amber-400",
  Planned: "bg-blue-400",
  "N/A": "bg-gray-400",
  Waiver: "bg-red-400",
};

export default async function ModuleQualDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mq = getModuleQualification(moduleId);
  if (!mq) notFound();

  const summary = getModuleQualSummary(moduleId);
  const pct = summary.total > 0 ? Math.round((summary.qualified / summary.total) * 100) : 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/qualification" className="hover:text-foreground transition-colors">
          Qualification
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{mq.moduleName}</span>
      </nav>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {mq.moduleName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Environmental qualification and radiation tolerance profile
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-heading font-bold text-foreground">{pct}%</span>
            <span className="text-sm text-muted-foreground">qualified</span>
          </div>
          <Progress value={pct} className="h-2 flex-1 max-w-48" />
          <span className="text-xs text-muted-foreground">
            {summary.qualified}/{summary.total} tests
          </span>
        </div>
      </div>

      {/* ── Radiation Profile ─────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">☢️ Radiation Profile</CardTitle>
          <CardDescription>Total Ionizing Dose and Single Event Effects tolerance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {[
              { label: "TID Rating", value: mq.radiation.tidRating },
              { label: "SEL Threshold", value: mq.radiation.selThreshold },
              { label: "SEE Immunity", value: mq.radiation.seeImmunity },
              { label: "Annual Dose (pLEO)", value: mq.radiation.annualDose },
              { label: "Design Life TID", value: mq.radiation.designLifeTid },
              { label: "Margin", value: mq.radiation.margin },
              { label: "Shielding", value: mq.radiation.shielding },
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 py-2.5">
                <span className="text-sm text-muted-foreground shrink-0">{row.label}</span>
                <span className="text-sm text-foreground text-right font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          {mq.radiation.notes && (
            <div className="mt-4 rounded-md bg-blue-500/5 border border-blue-500/20 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{mq.radiation.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Thermal Profile ───────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">🌡️ Thermal Profile</CardTitle>
          <CardDescription>Operating limits and thermal management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {[
              { label: "Operating Range", value: mq.thermal.operatingRange },
              { label: "Survival Range", value: mq.thermal.survivalRange },
              { label: "Max Junction Temp", value: mq.thermal.maxJunctionTemp },
              { label: "Thermal Dissipation", value: mq.thermal.thermalDissipation },
              { label: "Cooling Method", value: mq.thermal.coolingMethod },
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 py-2.5">
                <span className="text-sm text-muted-foreground shrink-0">{row.label}</span>
                <span className="text-sm text-foreground text-right font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          {mq.thermal.notes && (
            <div className="mt-4 rounded-md bg-orange-500/5 border border-orange-500/20 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{mq.thermal.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Test Matrix ───────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">🧪 Qualification Test Matrix</CardTitle>
          <CardDescription>
            {summary.qualified} qualified · {summary.inProgress} in progress · {summary.planned} planned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {mq.tests.map((test, i) => (
              <div key={`${test.testName}-${i}`} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[test.status]}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{test.testName}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{test.standard}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge className={STATUS_COLORS[test.status]}>{test.status}</Badge>
                    {test.testDate && (
                      <p className="text-xs text-muted-foreground mt-1">{test.testDate}</p>
                    )}
                  </div>
                </div>
                {(test.reportRef || test.notes) && (
                  <div className="ml-4 mt-2 text-xs text-muted-foreground">
                    {test.reportRef && <span className="font-mono">Report: {test.reportRef}</span>}
                    {test.reportRef && test.notes && <span className="mx-2">·</span>}
                    {test.notes && <span>{test.notes}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Footer Nav ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-sm">
        <Link href="/qualification" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Qualification Matrix
        </Link>
        <Link href={`/modules/${moduleId}`} className="text-muted-foreground hover:text-foreground transition-colors">
          View Module Specs →
        </Link>
      </div>
    </main>
  );
}
