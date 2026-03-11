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
  MODULE_QUALIFICATIONS,
  MISSION_ENVIRONMENTS,
  getQualStatusCounts,
  getModuleQualSummary,
  type QualStatus,
} from "@/lib/mock-qualification";

const STATUS_COLORS: Record<QualStatus, string> = {
  Qualified: "bg-green-500/20 text-green-400 border-green-500/30",
  "In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "N/A": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Waiver: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function QualificationPage() {
  const statusCounts = getQualStatusCounts();
  const totalTests = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const qualPercent = totalTests > 0 ? Math.round((statusCounts.Qualified / totalTests) * 100) : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Qualification & Environment
        </h1>
        <p className="mt-2 text-muted-foreground">
          Radiation tolerance, environmental qualification status, and mission environment profiles
          for all SNP modules.
        </p>
      </div>

      {/* ── Status Summary ─────────────────────────────────────── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Qualification</CardDescription>
            <CardTitle className="font-heading text-2xl text-green-400">
              {qualPercent}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={qualPercent} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {statusCounts.Qualified} of {totalTests} tests passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Qualified</CardDescription>
            <CardTitle className="font-heading text-2xl text-green-400">
              {statusCounts.Qualified}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">tests completed & passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="font-heading text-2xl text-amber-400">
              {statusCounts["In Progress"]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">tests currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Planned</CardDescription>
            <CardTitle className="font-heading text-2xl text-blue-400">
              {statusCounts.Planned}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">tests scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Mission Environments ───────────────────────────────── */}
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
        Mission Environments
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {MISSION_ENVIRONMENTS.map((env) => (
          <Card key={env.id}>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg">{env.name}</CardTitle>
              <CardDescription>{env.orbit}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Altitude</span>
                  <p className="font-medium text-foreground">{env.altitude}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Inclination</span>
                  <p className="font-medium text-foreground">{env.inclination}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Design Life</span>
                  <p className="font-medium text-foreground">{env.designLife}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Annual TID</span>
                  <p className="font-medium text-foreground">{env.annualTidDose}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Thermal Range</span>
                  <p className="font-medium text-foreground">{env.thermalCycleRange}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Vibration</span>
                  <p className="font-medium text-foreground">{env.vibrationProfile}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Peak Particle Flux</span>
                  <p className="font-medium text-foreground text-xs">{env.peakParticleFlux}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Module Qualification Matrix ────────────────────────── */}
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
        Module Qualification Matrix
      </h2>
      <div className="space-y-4">
        {MODULE_QUALIFICATIONS.map((mq) => {
          const summary = getModuleQualSummary(mq.moduleId);
          const pct = summary.total > 0 ? Math.round((summary.qualified / summary.total) * 100) : 0;

          return (
            <Link key={mq.moduleId} href={`/qualification/${mq.moduleId}`} className="block group">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {mq.moduleName}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        TID: {mq.radiation.tidRating} · SEL: {mq.radiation.selThreshold} · Margin: {mq.radiation.margin.split("(")[0].trim()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-heading font-bold text-foreground">{pct}%</span>
                      <p className="text-xs text-muted-foreground">qualified</p>
                    </div>
                  </div>

                  <Progress value={pct} className="h-2 mb-3" />

                  <div className="flex flex-wrap gap-2">
                    {mq.tests.map((test, i) => (
                      <Badge key={`${test.testName}-${i}`} className={STATUS_COLORS[test.status]}>
                        {test.testName}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
