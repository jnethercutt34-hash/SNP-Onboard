import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BUILDS } from "@/lib/mock-hardware";

interface ChecklistItem {
  step: number;
  title: string;
  description: string;
  critical?: boolean;
  reference?: string;
}

const INTEGRATION_PHASES: {
  phase: string;
  icon: string;
  description: string;
  steps: ChecklistItem[];
}[] = [
  {
    phase: "Incoming Inspection",
    icon: "📦",
    description: "Verify all hardware prior to integration",
    steps: [
      { step: 1, title: "Verify shipping container integrity", description: "Check for physical damage, ESD bag seals, humidity indicator cards. Document any anomalies with photos.", reference: "SNP-SUM §2.1" },
      { step: 2, title: "Match serial numbers to traveler", description: "Verify each CCA serial number against the build traveler document. Confirm correct hardware revision (Rev C or Rev D).", critical: true, reference: "SNP-SUM §2.2" },
      { step: 3, title: "Visual inspection under 10× magnification", description: "Inspect all solder joints, connectors, conformal coat coverage, and mechanical hardware. Document any workmanship concerns per IPC-A-610.", reference: "IPC-A-610 Class 3" },
      { step: 4, title: "Verify conformal coat on pure tin parts", description: "Confirm conformal coat coverage on all 0402/0603 pure tin terminated passives per GEIA-STD-0005-2 Category 2. Use UV lamp for fluorescent coat verification.", critical: true, reference: "SNP-TS-001" },
    ],
  },
  {
    phase: "Chassis Preparation",
    icon: "🔧",
    description: "Prepare the 3U SpaceVPX chassis for card insertion",
    steps: [
      { step: 5, title: "Clean chassis wedgelock rails", description: "Use IPA wipes to clean all 7 slot wedgelock rails. Verify no FOD in backplane connectors. Use dry nitrogen blow-off for backplane connector wells.", reference: "SNP-SUM §3.1" },
      { step: 6, title: "Apply thermal interface material", description: "Apply specified thermal grease (Apiezon N or equivalent) to cold wall contact areas. 0.05 mm bond line thickness. Do NOT apply to backplane connector area.", reference: "SNP-SUM §3.2" },
      { step: 7, title: "Verify backplane discrete wiring", description: "For J2 builds: confirm backplane discrete channels are wired for 1PPS and 10 MHz distribution from Slot 3 to Slots 4 and 6.", critical: true, reference: "J2-ICD Rev C" },
    ],
  },
  {
    phase: "Card Installation",
    icon: "🗂️",
    description: "Install CCAs in correct slot order",
    steps: [
      { step: 8, title: "Install PSU Red (Slot 1)", description: "Insert PSU Red CCA into Slot 1. Engage wedgelocks using insertion tool — torque to 4 in-lb. Verify MDM-15 and MDM-9 faceplate connectors are accessible.", reference: "SNP-SUM §4.1" },
      { step: 9, title: "Install expansion modules (Slots 2–3)", description: "If build includes Atomic Clock (J2): install in Slot 3. All other builds: Slots 2–3 remain empty (spare).", reference: "SNP-SUM §4.2" },
      { step: 10, title: "Attach mezzanine to GPP Red", description: "Mate mezzanine daughter card to GPP Red carrier board via FMC connector. Secure with 4× M2.5 screws at 3 in-lb. Verify mezzanine type matches build configuration.", critical: true, reference: "SNP-SUM §4.3" },
      { step: 11, title: "Install GPP Red assembly (Slot 4)", description: "Insert GPP Red + mezzanine assembly into Slot 4. Engage wedgelocks — torque to 4 in-lb. Verify VTRAF/RJ-45/Nano-D faceplate connectors seat flush.", reference: "SNP-SUM §4.4" },
      { step: 12, title: "Install Crypto Module (Slot 5)", description: "Insert crypto unit into Slot 5. Engage wedgelocks. Verify USB-C management port is accessible on faceplate.", reference: "SNP-SUM §4.5" },
      { step: 13, title: "Attach mezzanine to GPP Black", description: "Same procedure as Step 10 for GPP Black. Verify mezzanine type matches build (may differ from Red — e.g., ABE uses 3× QSFP on Black).", critical: true, reference: "SNP-SUM §4.3" },
      { step: 14, title: "Install GPP Black assembly (Slot 6)", description: "Insert GPP Black + mezzanine assembly into Slot 6. Engage wedgelocks — torque to 4 in-lb.", reference: "SNP-SUM §4.6" },
      { step: 15, title: "Install PSU Black (Slot 7)", description: "Insert PSU Black CCA into Slot 7. Engage wedgelocks. Verify MDM-15 power input connector is accessible.", reference: "SNP-SUM §4.7" },
    ],
  },
  {
    phase: "Pre-Power Verification",
    icon: "⚡",
    description: "Verify all connections before applying power",
    steps: [
      { step: 16, title: "Verify all wedgelocks engaged", description: "Visual and tactile check that all populated slot wedgelocks are fully engaged. Use torque verification on 10% sample.", critical: true, reference: "SNP-SUM §5.1" },
      { step: 17, title: "Backplane continuity check", description: "Using DMM, verify continuity on data plane, control plane, and utility plane across all populated slots. Check for shorts between power rails and ground.", reference: "SNP-SUM §5.2" },
      { step: 18, title: "Measure input bus impedance", description: "With power OFF, measure impedance between 28V and GND on MDM-15 connectors. Expected: > 100 Ω. If < 50 Ω, investigate for shorts before powering.", critical: true, reference: "SNP-SUM §5.3" },
      { step: 19, title: "Connect GSE cables", description: "Connect bench PSU (28V, current-limited to 5A) to MDM-15 on PSU Red. Connect serial console (UART) to MDM-9 on PSU Red for CMC telemetry. Connect Micro USB to GPP Red for JTAG/debug.", reference: "SNP-SUM §5.4" },
    ],
  },
  {
    phase: "First Power-On",
    icon: "🔋",
    description: "Initial power application and system verification",
    steps: [
      { step: 20, title: "Apply power — monitor inrush", description: "Enable bench PSU. Monitor inrush current — expect < 3A peak, settling to < 1A within 200 ms. If current exceeds 5A limit, REMOVE POWER IMMEDIATELY.", critical: true, reference: "SNP-SUM §6.1" },
      { step: 21, title: "Verify CMC boot (UART console)", description: "CMC should output boot banner on UART within 500 ms. Verify firmware version, slot discovery, and voltage rail readings (3.3V ± 5%, 5V ± 5%, 12V ± 5%).", reference: "SNP-SUM §6.2" },
      { step: 22, title: "Verify GPP Red boot", description: "Monitor Micro USB JTAG console. Secure boot chain should complete in < 3 seconds. Verify ARM firmware version and FPGA bitstream version.", reference: "SNP-SUM §6.3" },
      { step: 23, title: "Verify GPP Black boot (hot-standby)", description: "GPP Black should enter hot-standby mode within 5 seconds of GPP Red boot. Verify crosslink heartbeat on UART console.", reference: "SNP-SUM §6.4" },
      { step: 24, title: "Run Built-In Test (BIT)", description: "Execute POST (Power-On Self Test) via CMC UART command: 'bit run full'. All modules should report PASS. Document any failures.", critical: true, reference: "SNP-SUM §6.5" },
      { step: 25, title: "Verify network connectivity", description: "Ping test on all Ethernet interfaces (VTRAF/RJ-45/Nano-D as applicable). Verify 10GbE link-up on mezzanine primary interfaces.", reference: "SNP-SUM §6.6" },
    ],
  },
  {
    phase: "Final Closeout",
    icon: "✅",
    description: "Documentation and sealing",
    steps: [
      { step: 26, title: "Record firmware versions in traveler", description: "Document FPGA, ARM, CMC, Crypto, Boot, and PHY firmware versions in the build traveler. Cross-reference with approved version matrix.", reference: "SNP-SUM §7.1" },
      { step: 27, title: "Apply tamper-evident seals", description: "Apply tamper-evident seals to Crypto USB-C port and all chassis fasteners per security protocol. Record seal serial numbers.", critical: true, reference: "SNP-SUM §7.2" },
      { step: 28, title: "Final weight measurement", description: "Weigh completed unit on calibrated scale. Record in traveler. Compare to expected weight for build configuration (±2% tolerance).", reference: "SNP-SUM §7.3" },
      { step: 29, title: "Photography", description: "Take front, rear, top, and connector-detail photographs for as-built documentation. Include serial number placards in frame.", reference: "SNP-SUM §7.4" },
      { step: 30, title: "Pack and ship", description: "Package in ESD-safe container with desiccant packs and shock indicators. Include traveler, test data package, and firmware version card.", reference: "SNP-SUM §7.5" },
    ],
  },
];

const GSE_EQUIPMENT = [
  { name: "Bench Power Supply", spec: "28 V DC, 10 A, current-limited", purpose: "Primary power for integration testing" },
  { name: "Digital Multimeter", spec: "6.5 digit, Kelvin measurement", purpose: "Continuity checks, voltage rail verification" },
  { name: "USB-to-JTAG Cable", spec: "Micro USB to host PC", purpose: "FPGA/ARM debug, firmware programming" },
  { name: "Serial Console Cable", spec: "MDM-9 to USB-UART adapter", purpose: "CMC telemetry and command interface" },
  { name: "Torque Driver", spec: "1–10 in-lb, calibrated", purpose: "Wedgelock engagement, mezzanine screws" },
  { name: "ESD Wrist Strap", spec: "1 MΩ, verified daily", purpose: "Required for all handling" },
  { name: "10× Magnifier / Microscope", spec: "Optical inspection", purpose: "Incoming inspection, solder joint verification" },
  { name: "UV Lamp (365 nm)", spec: "Portable, battery-powered", purpose: "Conformal coat inspection on pure tin parts" },
  { name: "Dry Nitrogen Supply", spec: "99.99% purity, regulator", purpose: "Backplane connector cleaning, FOD removal" },
];

export default function IntegrationPage() {
  const totalSteps = INTEGRATION_PHASES.reduce((s, p) => s + p.steps.length, 0);
  const criticalSteps = INTEGRATION_PHASES.reduce(
    (s, p) => s + p.steps.filter((st) => st.critical).length,
    0
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Assembly & Integration Guide
        </h1>
        <p className="mt-2 text-muted-foreground">
          Step-by-step integration procedure for the SNP 3U SpaceVPX chassis. {totalSteps} steps across{" "}
          {INTEGRATION_PHASES.length} phases — {criticalSteps} critical checkpoints.
        </p>
      </div>

      {/* ── Build Selector ─────────────────────────────────────── */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Build-Specific Notes</CardTitle>
          <CardDescription>Select a build to see configuration-specific steps highlighted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {BUILDS.map((b) => (
              <Link key={b.id} href={`/builds/${b.id}`}>
                <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
                  {b.customerName} — {b.slots.length} slots, {b.totalSystemPower} W
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── GSE Equipment ──────────────────────────────────────── */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-heading text-lg">🔧 Required GSE Equipment</CardTitle>
          <CardDescription>Ground Support Equipment needed for integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {GSE_EQUIPMENT.map((item) => (
              <div key={item.name} className="flex items-start justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.purpose}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">{item.spec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Integration Phases ─────────────────────────────────── */}
      {INTEGRATION_PHASES.map((phase) => (
        <Card key={phase.phase} className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              {phase.icon} {phase.phase}
            </CardTitle>
            <CardDescription>{phase.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {phase.steps.map((step) => (
                <div
                  key={step.step}
                  className={`rounded-lg border p-4 ${
                    step.critical ? "border-red-500/30 bg-red-500/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        step.critical
                          ? "bg-red-500/20 text-red-400"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                        {step.critical && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            CRITICAL
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {step.reference && (
                        <p className="text-xs font-mono text-muted-foreground/60 mt-1">
                          Ref: {step.reference}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
