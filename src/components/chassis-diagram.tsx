import type { HardwareModule } from "@/lib/mock-hardware";

// ── Layout ────────────────────────────────────────────────────────────────────

const VW = 910;
const VH = 220;
const EAR = 28;           // rack ear width
const RAIL = 20;          // top / bottom rail height
const SLOTS = 7;
const TOTAL_W = VW - EAR * 2;          // 854
const SW = TOTAL_W / SLOTS;            // ≈ 122
const FW = SW - 3;                     // face plate width (gap on right)
const FY = RAIL;                       // face plate top y
const FH = VH - RAIL * 2;             // face plate height = 180

function fx(slot: number) {
  return EAR + slot * SW;
}

// ── Slot assignment ───────────────────────────────────────────────────────────

const SLOT_FOR: Record<string, number> = {
  "gpp-universal-a":   0,
  "gpp-universal-b":   1,
  "crypto-unit":       2,
  "psu-red":           3,
  "psu-black":         4,
  "net-10g-copper":    5,
  "timing-atomic-clock": 5,
};

// ── Shared sub-elements ───────────────────────────────────────────────────────

function Handles({ x }: { x: number }) {
  const grips = [34, 48, 62, 76, 90];
  return (
    <>
      {/* top handle */}
      <rect x={x + 8} y={FY + 4} width={FW - 16} height={9} rx={2}
            fill="#111c2e" stroke="#253a58" strokeWidth="0.8"/>
      {grips.map(d => (
        <line key={`th${d}`} x1={x + d} y1={FY + 5.5} x2={x + d} y2={FY + 11.5}
              stroke="#2a4468" strokeWidth="1.5"/>
      ))}
      {/* bottom handle */}
      <rect x={x + 8} y={FY + FH - 13} width={FW - 16} height={9} rx={2}
            fill="#111c2e" stroke="#253a58" strokeWidth="0.8"/>
      {grips.map(d => (
        <line key={`bh${d}`} x1={x + d} y1={FY + FH - 11.5} x2={x + d} y2={FY + FH - 5.5}
              stroke="#2a4468" strokeWidth="1.5"/>
      ))}
    </>
  );
}

function Leds({ x, colors }: { x: number; colors: string[] }) {
  return (
    <>
      {colors.map((c, i) => (
        <g key={i}>
          <circle cx={x + 15 + i * 13} cy={FY + 19} r={4} fill={c} opacity="0.25"/>
          <circle cx={x + 15 + i * 13} cy={FY + 19} r={2.5} fill={c}/>
        </g>
      ))}
    </>
  );
}

// ── GPP faceplate ─────────────────────────────────────────────────────────────

function GppFace({ x, side }: { x: number; side: "RED" | "BLACK" }) {
  const accent = side === "RED" ? "#3b82f6" : "#64748b";
  const bg     = side === "RED" ? "#080f1c" : "#070b17";
  const mid    = FW / 2;

  // SFP+ port helper
  const SfpPort = ({ px, py }: { px: number; py: number }) => (
    <g>
      <rect x={px} y={py} width={20} height={16} rx={1}
            fill="#040a12" stroke="#1e3555" strokeWidth="0.6"/>
      <circle cx={px + 10} cy={py + 8} r={5.5} fill="#02050e" stroke="#1a3050" strokeWidth="0.5"/>
      <circle cx={px + 10} cy={py + 8} r={3}   fill={accent} opacity="0.65"/>
      <circle cx={px + 10} cy={py + 8} r={1.5} fill="#c0e0ff" opacity="0.9"/>
    </g>
  );

  // GbE port helper
  const GbePort = ({ px, py, lit }: { px: number; py: number; lit: boolean }) => (
    <g>
      <rect x={px} y={py} width={22} height={16} rx={1}
            fill="#050b14" stroke="#1a2e48" strokeWidth="0.6"/>
      <rect x={px + 2} y={py + 2} width={18} height={12} rx={0.5} fill="#030810"/>
      <rect x={px + 5} y={py}     width={5}  height={3}  fill="#0b1828"/>
      <rect x={px + 12} y={py}    width={5}  height={3}  fill="#0b1828"/>
      <circle cx={px + 19} cy={py + 3} r={1.8}
              fill={lit ? accent : "#1a2d44"} opacity="0.85"/>
    </g>
  );

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill={bg} stroke="#1a3050" strokeWidth="0.8"/>
      {/* accent stripe */}
      <rect x={x} y={FY} width={FW} height={3} fill={accent} opacity="0.85"/>
      <Handles x={x}/>
      <Leds x={x} colors={["#10b981", accent, accent]}/>

      {/* labels */}
      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#64748b" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">
        GPP
      </text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {side}
      </text>

      {/* SFP+ cage block — 4 ports (2 × 2) */}
      <rect x={x + 6} y={FY + 52} width={FW - 12} height={46} rx={2}
            fill="#040b14" stroke="#1a3050" strokeWidth="0.7"/>
      <SfpPort px={x + 10} py={FY + 56}/>
      <SfpPort px={x + 34} py={FY + 56}/>
      <SfpPort px={x + 58} py={FY + 56}/>
      <SfpPort px={x + 82} py={FY + 56}/>
      <SfpPort px={x + 10} py={FY + 76}/>
      <SfpPort px={x + 34} py={FY + 76}/>
      <SfpPort px={x + 58} py={FY + 76}/>
      <SfpPort px={x + 82} py={FY + 76}/>
      <text x={x + mid} y={FY + 106} textAnchor="middle"
            fill="#2a4060" fontSize="5.5" fontFamily="monospace">
        10G · SFP+ · 8-PORT
      </text>

      {/* GbE RJ-45 row */}
      <GbePort px={x + 7}  py={FY + 112} lit={true}/>
      <GbePort px={x + 31} py={FY + 112} lit={true}/>
      <GbePort px={x + 55} py={FY + 112} lit={false}/>
      <GbePort px={x + 79} py={FY + 112} lit={false}/>
      <text x={x + mid} y={FY + 136} textAnchor="middle"
            fill="#2a4060" fontSize="5.5" fontFamily="monospace">
        1G · GbE × 4
      </text>

      {/* Processor info */}
      <text x={x + mid} y={FY + 150} textAnchor="middle"
            fill="#1a2e48" fontSize="5.5" fontFamily="monospace">
        ARM A78AE · QUAD CORE
      </text>
      <text x={x + mid} y={FY + 160} textAnchor="middle"
            fill="#1a2e48" fontSize="5.5" fontFamily="monospace">
        16 GB LPDDR4X · ECC
      </text>
    </g>
  );
}

// ── Crypto faceplate ──────────────────────────────────────────────────────────

function CryptoFace({ x }: { x: number }) {
  const accent = "#8b5cf6";
  const mid = FW / 2;
  const pins = [-10, -3.5, 3.5, 10, 0].map((dx, _, arr) =>
    arr.length === 5
      ? { dx, dy: [0, 1, 2, 3, 4].map(i => [0, -11, -7, 7, 11][i])[_] }
      : { dx, dy: 0 }
  );

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#0a0715" stroke="#2a1855" strokeWidth="0.8"/>
      <rect x={x} y={FY} width={FW} height={3} fill={accent} opacity="0.85"/>
      <Handles x={x}/>
      <Leds x={x} colors={["#10b981", accent, "#6d28d9"]}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#64748b" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">CRYPTO</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">UNIT</text>

      {/* Key icon */}
      <circle cx={x + mid} cy={FY + 76} r={18} fill="none" stroke={accent}
              strokeWidth="1.2" opacity="0.5"/>
      <circle cx={x + mid} cy={FY + 76} r={10} fill="#08061a" stroke="#6d28d9" strokeWidth="1"/>
      <circle cx={x + mid} cy={FY + 76} r={5}  fill={accent} opacity="0.25"/>
      <line x1={x + mid + 10} y1={FY + 76} x2={x + mid + 27} y2={FY + 76}
            stroke={accent} strokeWidth="2.5" opacity="0.7"/>
      <line x1={x + mid + 22} y1={FY + 76} x2={x + mid + 22} y2={FY + 85}
            stroke={accent} strokeWidth="2.5" opacity="0.7"/>
      <line x1={x + mid + 27} y1={FY + 76} x2={x + mid + 27} y2={FY + 83}
            stroke={accent} strokeWidth="2.5" opacity="0.7"/>

      {/* FIPS badge */}
      <rect x={x + 20} y={FY + 102} width={FW - 40} height={14} rx={2}
            fill="#0c0820" stroke="#4c1d95" strokeWidth="0.8"/>
      <text x={x + mid} y={FY + 112} textAnchor="middle"
            fill="#7c3aed" fontSize="7" fontFamily="monospace" fontWeight="bold"
            letterSpacing="0.5">FIPS 140-2 L3</text>

      {/* Utility connector */}
      <rect x={x + 10} y={FY + 122} width={FW - 20} height={12} rx={2}
            fill="#07040f" stroke="#3b1e6e" strokeWidth="0.7"/>
      {[12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100].map(d => (
        <circle key={d} cx={x + d} cy={FY + 128} r={2} fill="#08061a" stroke="#4c1d95" strokeWidth="0.5"/>
      ))}
      <text x={x + mid} y={FY + 143} textAnchor="middle"
            fill="#3b1e6e" fontSize="5.5" fontFamily="monospace">VPX UTILITY PLANE</text>

      <text x={x + mid} y={FY + 155} textAnchor="middle"
            fill="#2d1b5e" fontSize="5.5" fontFamily="monospace">AES-256 · ECC P-384</text>
      <text x={x + mid} y={FY + 165} textAnchor="middle"
            fill="#1e1240" fontSize="5.5" fontFamily="monospace">TAMPER EVIDENT</text>
    </g>
  );
}

// ── PSU faceplate ─────────────────────────────────────────────────────────────

function PsuFace({ x, side }: { x: number; side: "RED" | "BLACK" }) {
  const accent = "#ef4444";
  const isBlack = side === "BLACK";
  const mid = FW / 2;

  // 5-pin mil-circular connector
  const pinOffsets = [
    [0, -11], [10.5, -3.4], [6.5, 9], [-6.5, 9], [-10.5, -3.4],
  ] as [number, number][];

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#0e0606" stroke="#3a1010" strokeWidth="0.8"/>
      <rect x={x} y={FY} width={FW} height={3} fill={accent} opacity="0.85"/>
      <Handles x={x}/>
      <Leds x={x} colors={["#10b981", accent]}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#64748b" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">POWER</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {side}
      </text>

      {/* Mil-circular 28V input connector */}
      <circle cx={x + mid} cy={FY + 80} r={26} fill="#090404" stroke="#3a1010" strokeWidth="1.5"/>
      <circle cx={x + mid} cy={FY + 80} r={20} fill="#0c0606" stroke="#601818" strokeWidth="1"/>
      {pinOffsets.map(([dx, dy], i) => (
        <circle key={i} cx={x + mid + dx} cy={FY + 80 + dy} r={3}
                fill="#0a0404" stroke="#7a2020" strokeWidth="0.8"/>
      ))}
      <text x={x + mid} y={FY + 115} textAnchor="middle"
            fill="#7f1d1d" fontSize="6" fontFamily="monospace">28 VDC INPUT</text>

      {/* Rail outputs */}
      {[
        { label: "+3.3V_AUX", y: 125, highlight: false },
        { label: "+3.3V",     y: 137, highlight: false },
        { label: "+5V",       y: 149, highlight: false },
        ...(isBlack ? [{ label: "+12V (BKPL)", y: 161, highlight: true }] : []),
      ].map(({ label, y, highlight }) => (
        <g key={label}>
          <text x={x + 10} y={FY + y} fill={highlight ? accent : "#475569"}
                fontSize="6" fontFamily="monospace" opacity={highlight ? 1 : 0.8}>
            {label}
          </text>
          <rect x={x + FW - 28} y={FY + y - 8} width={20} height={7} rx={1.5}
                fill={highlight ? "#1a0505" : "#0a0808"}
                stroke={highlight ? "#7a2020" : "#1e1010"} strokeWidth="0.6"/>
        </g>
      ))}
    </g>
  );
}

// ── 10G Copper faceplate ──────────────────────────────────────────────────────

function CopperFace({ x }: { x: number }) {
  const accent = "#10b981";
  const mid = FW / 2;

  const Rj45 = ({ px, py }: { px: number; py: number }) => (
    <g>
      <rect x={px} y={py} width={46} height={34} rx={2}
            fill="#050f08" stroke="#143520" strokeWidth="0.7"/>
      <rect x={px + 3} y={py + 3} width={40} height={28} rx={1} fill="#030b05"/>
      <rect x={px + 10} y={py}    width={8}  height={5}  fill="#0a1a0e"/>
      <rect x={px + 28} y={py}    width={8}  height={5}  fill="#0a1a0e"/>
      <circle cx={px + 39} cy={py + 5}  r={2.2} fill={accent} opacity="0.9"/>
      <circle cx={px + 39} cy={py + 13} r={2.2} fill={accent} opacity="0.5"/>
    </g>
  );

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#050d08" stroke="#122510" strokeWidth="0.8"/>
      <rect x={x} y={FY} width={FW} height={3} fill={accent} opacity="0.85"/>
      <Handles x={x}/>
      <Leds x={x} colors={[accent, accent]}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#64748b" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">10G NET</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">COPPER</text>

      <Rj45 px={x + 10} py={FY + 56}/>
      <Rj45 px={x + 60} py={FY + 56}/>

      <text x={x + mid} y={FY + 103} textAnchor="middle"
            fill="#0d3020" fontSize="6" fontFamily="monospace">10GBASE-T · DUAL</text>

      <text x={x + mid} y={FY + 118} textAnchor="middle"
            fill="#0f4020" fontSize="6" fontFamily="monospace">CAT-6A SHIELDED</text>
      <text x={x + mid} y={FY + 130} textAnchor="middle"
            fill="#0d3020" fontSize="5.5" fontFamily="monospace">100 m REACH</text>

      <rect x={x + 20} y={FY + 140} width={FW - 40} height={12} rx={2}
            fill="#040c06" stroke="#0f3018" strokeWidth="0.7"/>
      <text x={x + mid} y={FY + 149} textAnchor="middle"
            fill="#0f4020" fontSize="6" fontFamily="monospace" fontWeight="bold">pLEO CONFIG</text>

      <text x={x + mid} y={FY + 163} textAnchor="middle"
            fill="#0a2010" fontSize="5.5" fontFamily="monospace">SWaP-C OPTIMISED</text>
    </g>
  );
}

// ── Atomic clock faceplate ────────────────────────────────────────────────────

function AtomicFace({ x }: { x: number }) {
  const accent = "#f97316";
  const mid = FW / 2;
  const cx = x + mid;
  const cy = FY + 82;
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#0c0907" stroke="#2a1a08" strokeWidth="0.8"/>
      <rect x={x} y={FY} width={FW} height={3} fill={accent} opacity="0.85"/>
      <Handles x={x}/>
      <Leds x={x} colors={["#10b981", accent]}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#64748b" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">TIMING</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">CSAC</text>

      {/* Clock face */}
      <circle cx={cx} cy={cy} r={26} fill="none" stroke={accent} strokeWidth="0.7" opacity="0.3"/>
      <circle cx={cx} cy={cy} r={20} fill="none" stroke={accent} strokeWidth="0.7" opacity="0.5"/>
      {ticks.map(deg => {
        const rad = (deg * Math.PI) / 180;
        const r1 = 20; const r2 = 24;
        return (
          <line key={deg}
                x1={cx + Math.sin(rad) * r1} y1={cy - Math.cos(rad) * r1}
                x2={cx + Math.sin(rad) * r2} y2={cy - Math.cos(rad) * r2}
                stroke={accent} strokeWidth={deg % 90 === 0 ? 1.2 : 0.7} opacity="0.5"/>
        );
      })}
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 14}
            stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={cx + 12} y2={cy + 6}
            stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
      <circle cx={cx} cy={cy} r={2.5} fill={accent} opacity="0.9"/>

      <text x={x + mid} y={FY + 116} textAnchor="middle"
            fill="#7c3810" fontSize="5.5" fontFamily="monospace">&lt; 100 ns/day</text>

      {/* PPS / 10 MHz connector */}
      <rect x={x + 10} y={FY + 122} width={FW - 20} height={12} rx={2}
            fill="#08050a" stroke="#5a2e0a" strokeWidth="0.7"/>
      <text x={x + mid} y={FY + 131} textAnchor="middle"
            fill="#7c3810" fontSize="6" fontFamily="monospace">1 PPS · 10 MHz REF</text>

      <text x={x + mid} y={FY + 145} textAnchor="middle"
            fill="#5c2e08" fontSize="5.5" fontFamily="monospace">IEEE 1588v2 PTP GM</text>
      <rect x={x + 20} y={FY + 152} width={FW - 40} height={11} rx={2}
            fill="#07040a" stroke="#4a2008" strokeWidth="0.6"/>
      <text x={x + mid} y={FY + 160} textAnchor="middle"
            fill="#7c3810" fontSize="6" fontFamily="monospace" fontWeight="bold">GEO MISSION</text>
    </g>
  );
}

// ── Empty slot ────────────────────────────────────────────────────────────────

function EmptyFace({ x }: { x: number }) {
  const mid = FW / 2;
  const screwY = [FY + 10, FY + FH - 10];
  const screwX = [x + 12, x + FW - 12];

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#040810"
            stroke="#0d1828" strokeWidth="0.7" strokeDasharray="5 4"/>
      {screwY.flatMap(sy => screwX.map(sx => (
        <g key={`${sx}${sy}`}>
          <circle cx={sx} cy={sy} r={5.5} fill="#06091a" stroke="#131f35" strokeWidth="0.8"/>
          <line x1={sx - 3} y1={sy} x2={sx + 3} y2={sy} stroke="#0f1d30" strokeWidth="1.2"/>
          <line x1={sx} y1={sy - 3} x2={sx} y2={sy + 3} stroke="#0f1d30" strokeWidth="1.2"/>
        </g>
      )))}
      <text x={x + mid} y={FY + 84} textAnchor="middle"
            fill="#0d1e32" fontSize="8" fontFamily="monospace" letterSpacing="1">EXPANSION</text>
      <text x={x + mid} y={FY + 96} textAnchor="middle"
            fill="#0d1e32" fontSize="8" fontFamily="monospace" letterSpacing="1">SLOT</text>
      <text x={x + mid} y={FY + 110} textAnchor="middle"
            fill="#091528" fontSize="6.5" fontFamily="monospace">AVAILABLE</text>
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ChassisDiagramProps {
  modules: HardwareModule[];
}

export function ChassisDiagram({ modules }: ChassisDiagramProps) {
  const installedIds = new Set(modules.map(m => m.id));

  // Build slot array — null means empty
  const slotModules: (HardwareModule | null)[] = Array.from(
    { length: SLOTS },
    (_, slotIdx) => {
      const id = Object.entries(SLOT_FOR).find(([, s]) => s === slotIdx)?.[0];
      return id && installedIds.has(id) ? (modules.find(m => m.id === id) ?? null) : null;
    }
  );

  function renderFace(module: HardwareModule | null, slotIdx: number) {
    const x = fx(slotIdx);
    if (!module) return <EmptyFace key={slotIdx} x={x}/>;
    switch (module.id) {
      case "gpp-universal-a":    return <GppFace    key={slotIdx} x={x} side="RED"/>;
      case "gpp-universal-b":    return <GppFace    key={slotIdx} x={x} side="BLACK"/>;
      case "crypto-unit":        return <CryptoFace key={slotIdx} x={x}/>;
      case "psu-red":            return <PsuFace    key={slotIdx} x={x} side="RED"/>;
      case "psu-black":          return <PsuFace    key={slotIdx} x={x} side="BLACK"/>;
      case "net-10g-copper":     return <CopperFace key={slotIdx} x={x}/>;
      case "timing-atomic-clock":return <AtomicFace key={slotIdx} x={x}/>;
      default:                   return <EmptyFace  key={slotIdx} x={x}/>;
    }
  }

  const labelText = `SNP-3UVPX · VITA 78 SpaceVPX · ${modules.length} / ${SLOTS} SLOTS OCCUPIED`;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full block"
        aria-label="3U SpaceVPX chassis — front view"
        style={{ maxHeight: "280px" }}
      >
        {/* ── Chassis body ────────────────────────────────────── */}
        <rect width={VW} height={VH} rx={5} fill="#060c18" stroke="#19304e" strokeWidth="1.5"/>

        {/* ── Left rack ear ────────────────────────────────────── */}
        <rect x={0} y={0} width={EAR} height={VH} rx={4} fill="#08101e" stroke="#162840" strokeWidth="1"/>
        {[30, 80, 130, 170].map(y => (
          <g key={y}>
            <circle cx={14} cy={y} r={5.5} fill="#040c18" stroke="#162840" strokeWidth="0.8"/>
            <circle cx={14} cy={y} r={2.5} fill="#03080f"/>
          </g>
        ))}

        {/* ── Right rack ear ───────────────────────────────────── */}
        <rect x={VW - EAR} y={0} width={EAR} height={VH} rx={4}
              fill="#08101e" stroke="#162840" strokeWidth="1"/>
        {[30, 80, 130, 170].map(y => (
          <g key={y}>
            <circle cx={VW - 14} cy={y} r={5.5} fill="#040c18" stroke="#162840" strokeWidth="0.8"/>
            <circle cx={VW - 14} cy={y} r={2.5} fill="#03080f"/>
          </g>
        ))}

        {/* ── Top rail ─────────────────────────────────────────── */}
        <rect x={EAR} y={0} width={VW - EAR * 2} height={RAIL}
              fill="#080f1e" stroke="#19304e" strokeWidth="0.8"/>
        {/* Slot divider tick marks on top rail */}
        {Array.from({ length: SLOTS - 1 }, (_, i) => (
          <line key={i}
                x1={EAR + (i + 1) * SW} y1={0}
                x2={EAR + (i + 1) * SW} y2={RAIL}
                stroke="#0d1e34" strokeWidth="1"/>
        ))}
        {/* Chassis label */}
        <text x={EAR + 8} y={14} fill="#1e3a5f" fontSize="7" fontFamily="monospace"
              letterSpacing="1" fontWeight="bold">
          {labelText}
        </text>
        {/* Status LEDs on top rail (right side) */}
        <circle cx={VW - EAR - 30} cy={10} r={3.5} fill="#10b981" opacity="0.9"/>
        <circle cx={VW - EAR - 30} cy={10} r={6}   fill="#10b981" opacity="0.15"/>
        <text x={VW - EAR - 24} y={13.5} fill="#0f4020" fontSize="6" fontFamily="monospace">PWR</text>
        <circle cx={VW - EAR - 60} cy={10} r={3.5} fill="#3b82f6" opacity="0.7"/>
        <circle cx={VW - EAR - 60} cy={10} r={6}   fill="#3b82f6" opacity="0.1"/>
        <text x={VW - EAR - 54} y={13.5} fill="#1e3a5f" fontSize="6" fontFamily="monospace">STS</text>

        {/* ── Bottom rail ───────────────────────────────────────── */}
        <rect x={EAR} y={VH - RAIL} width={VW - EAR * 2} height={RAIL}
              fill="#080f1e" stroke="#19304e" strokeWidth="0.8"/>
        {Array.from({ length: SLOTS - 1 }, (_, i) => (
          <line key={i}
                x1={EAR + (i + 1) * SW} y1={VH - RAIL}
                x2={EAR + (i + 1) * SW} y2={VH}
                stroke="#0d1e34" strokeWidth="1"/>
        ))}

        {/* ── Slot separators ───────────────────────────────────── */}
        {Array.from({ length: SLOTS - 1 }, (_, i) => (
          <line key={i}
                x1={EAR + (i + 1) * SW - 1} y1={RAIL}
                x2={EAR + (i + 1) * SW - 1} y2={VH - RAIL}
                stroke="#0d1e34" strokeWidth="1.5"/>
        ))}

        {/* ── Module faces ──────────────────────────────────────── */}
        {slotModules.map((m, i) => renderFace(m, i))}
      </svg>
    </div>
  );
}
