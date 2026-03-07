// SNP Product Lineage — SVG block diagram
// Layout: main horizontal spine  FMS → Baseline → Next Gen
//         customer variants fork downward off Baseline

export function ProductLineage() {
  // ── Main spine (horizontal, cy = 75) ──────────────────────────────────────
  const MCY = 75;

  const fms = { x: 33,  y: 40,  w: 175, h: 155, cx: 121, cy: MCY };
  const bl  = { x: 258, y: 18,  w: 225, h: 158, cx: 370, cy: MCY };
  const ng  = { x: 533, y: 40,  w: 155, h: 70,  cx: 611, cy: MCY };

  // ── Customer branch (forks downward from Baseline bottom) ─────────────────
  const forkY  = 245;   // y of horizontal distributor bar
  const custY  = 265;   // y of customer node tops
  const custW  = 130;
  const custH  = 110;
  const j2H    = 155;   // J2 is taller due to additional interface callouts

  const abe = { x: 126, cx: 191, cy: custY + custH / 2 };
  const j2  = { x: 305, cx: 370, cy: custY + j2H  / 2 };
  const jl  = { x: 484, cx: 549, cy: custY + custH / 2 };

  // Baseline bottom-center (branch origin)
  const blBottom = bl.y + bl.h; // 132

  return (
    <div className="w-full rounded-lg border border-border bg-card/40 px-5 pt-4 pb-3 mb-8">
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2 font-heading select-none">
        SNP Product Lineage
      </p>
      <div className="overflow-x-auto pb-2">
      <svg
        viewBox="0 0 720 455"
        style={{ width: '100%', minWidth: '720px', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SNP product lineage: FMS IRAD prototype feeds into Baseline, which continues to Next Gen on the main line while customer variants branch downward."
      >
        <defs>
          {/* Solid arrowhead — blue (main line FMS→BL) */}
          <marker id="pl-ah-blue" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="hsl(217 91% 60%)" />
          </marker>
          {/* Solid arrowhead — muted (branch drops) */}
          <marker id="pl-ah" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="hsl(215 20% 40%)" />
          </marker>
          {/* Dashed arrowhead — very muted (BL→Next Gen) */}
          <marker id="pl-ah-dash" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="hsl(215 20% 32%)" />
          </marker>
        </defs>

        {/* ── Top section labels ────────────────────────────────────────── */}
        <text x={fms.cx} y="13" textAnchor="middle" fontSize="8.5"
          fill="hsl(38 92% 52%)" letterSpacing="2" fontFamily="monospace">
          PROTOTYPE
        </text>
        <text x={bl.cx} y="13" textAnchor="middle" fontSize="8.5"
          fill="hsl(217 91% 62%)" letterSpacing="2" fontFamily="monospace">
          PRODUCTION
        </text>
        <text x={ng.cx} y="13" textAnchor="middle" fontSize="8.5"
          fill="hsl(215 20% 38%)" letterSpacing="2" fontFamily="monospace">
          ROADMAP
        </text>

        {/* ── Main spine arrows ─────────────────────────────────────────── */}

        {/* FMS → Baseline (solid blue) */}
        <line
          x1={fms.x + fms.w} y1={MCY}
          x2={bl.x - 3}       y2={MCY}
          stroke="hsl(217 91% 60%)" strokeWidth="1.5"
          markerEnd="url(#pl-ah-blue)"
        />
        <text x={(fms.x + fms.w + bl.x) / 2} y={MCY - 6}
          textAnchor="middle" fontSize="7.5"
          fill="hsl(217 55% 48%)" fontFamily="sans-serif">
          all updates
        </text>

        {/* Baseline → Next Gen (dashed — future) */}
        <line
          x1={bl.x + bl.w} y1={MCY}
          x2={ng.x - 3}    y2={MCY}
          stroke="hsl(215 20% 32%)" strokeWidth="1.5"
          strokeDasharray="5 4"
          markerEnd="url(#pl-ah-dash)"
        />

        {/* ── Customer branch from Baseline bottom ─────────────────────── */}

        {/* Vertical trunk: Baseline bottom → horizontal fork */}
        <line
          x1={bl.cx} y1={blBottom}
          x2={bl.cx} y2={forkY}
          stroke="hsl(215 20% 38%)" strokeWidth="1.5"
        />

        {/* Horizontal distributor bar */}
        <line
          x1={abe.cx} y1={forkY}
          x2={jl.cx}  y2={forkY}
          stroke="hsl(215 20% 38%)" strokeWidth="1.5"
        />

        {/* Junction dot where trunk meets bar */}
        <circle cx={bl.cx} cy={forkY} r="3.5"
          fill="hsl(215 20% 38%)" />

        {/* Vertical drop arrows → each customer */}
        {[abe, j2, jl].map((node, i) => (
          <line
            key={i}
            x1={node.cx} y1={forkY}
            x2={node.cx} y2={custY - 3}
            stroke="hsl(215 20% 38%)" strokeWidth="1.5"
            markerEnd="url(#pl-ah)"
          />
        ))}

        {/* "Customer Variants" label — below the boxes */}
        <text x={bl.cx} y={custY + j2H + 12}
          textAnchor="middle" fontSize="7.5"
          fill="hsl(215 20% 42%)" letterSpacing="1.5" fontFamily="monospace">
          CUSTOMER VARIANTS
        </text>

        {/* ── FMS Node ──────────────────────────────────────────────────── */}
        <rect x={fms.x} y={fms.y} width={fms.w} height={fms.h} rx="8"
          fill="rgba(245,158,11,0.07)" stroke="hsl(38 92% 50%)" strokeWidth="1.5"
        />
        <rect x={fms.x + 8} y={fms.y + 8} width={40} height={15} rx="4"
          fill="rgba(245,158,11,0.14)" stroke="hsl(38 92% 50%)" strokeWidth="0.7"
        />
        <text x={fms.x + 28} y={fms.y + 18.5} textAnchor="middle" fontSize="8"
          fill="hsl(38 92% 60%)" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">
          IRAD
        </text>
        <text x={fms.cx} y={fms.y + 37} textAnchor="middle" fontSize="18"
          fill="hsl(38 92% 65%)" fontWeight="700" fontFamily="sans-serif">
          FMS
        </text>
        <text x={fms.cx} y={fms.y + 51} textAnchor="middle" fontSize="9.5"
          fill="hsl(38 50% 55%)" fontFamily="sans-serif">
          Lab Prototype
        </text>
        <line x1={fms.x + 12} y1={fms.y + 60} x2={fms.x + fms.w - 12} y2={fms.y + 60}
          stroke="hsl(38 40% 22%)" strokeWidth="0.8"
        />
        <text x={fms.cx} y={fms.y + 72} textAnchor="middle" fontSize="7"
          fill="hsl(38 40% 52%)" fontFamily="sans-serif">
          16 GB DDR4 · 2 Gb NVM · FPGA 1.5M SLC
        </text>
        <text x={fms.cx} y={fms.y + 83} textAnchor="middle" fontSize="7.5"
          fill="hsl(2 60% 50%)" fontFamily="sans-serif">
          Red: Optical 10G
        </text>
        <text x={fms.cx} y={fms.y + 93} textAnchor="middle" fontSize="6.5"
          fill="hsl(2 45% 40%)" fontFamily="sans-serif">
          MDM · 4× 1000Base-T
        </text>
        <text x={fms.cx} y={fms.y + 105} textAnchor="middle" fontSize="7.5"
          fill="hsl(215 10% 44%)" fontFamily="sans-serif">
          Black: Optical 10G
        </text>
        <text x={fms.cx} y={fms.y + 115} textAnchor="middle" fontSize="6.5"
          fill="hsl(215 10% 36%)" fontFamily="sans-serif">
          MDM · 4× 1000Base-T
        </text>
        <text x={fms.cx} y={fms.y + 127} textAnchor="middle" fontSize="7.5"
          fill="hsl(38 55% 48%)" fontFamily="sans-serif">
          ACAM Crypto
        </text>
        <text x={fms.cx} y={fms.y + 139} textAnchor="middle" fontSize="7"
          fill="hsl(215 20% 35%)" fontFamily="sans-serif">
          HW &amp; FW validation
        </text>

        {/* ── Baseline Node ─────────────────────────────────────────────── */}
        <rect x={bl.x} y={bl.y} width={bl.w} height={bl.h} rx="8"
          fill="rgba(79,142,246,0.07)" stroke="hsl(217 91% 60%)" strokeWidth="1.5"
        />
        <rect x={bl.x + 8} y={bl.y + 8} width={60} height={15} rx="4"
          fill="rgba(79,142,246,0.14)" stroke="hsl(217 91% 60%)" strokeWidth="0.7"
        />
        <text x={bl.x + 38} y={bl.y + 18.5} textAnchor="middle" fontSize="8"
          fill="hsl(217 91% 70%)" fontWeight="700" fontFamily="monospace" letterSpacing="0.4">
          PRODUCTION
        </text>
        <text x={bl.cx} y={bl.y + 49} textAnchor="middle" fontSize="18"
          fill="hsl(217 91% 75%)" fontWeight="700" fontFamily="sans-serif">
          Baseline
        </text>
        <text x={bl.cx} y={bl.y + 65} textAnchor="middle" fontSize="9.5"
          fill="hsl(217 50% 62%)" fontFamily="sans-serif">
          SNP Reference Config
        </text>
        <line x1={bl.x + 14} y1={bl.y + 75} x2={bl.x + bl.w - 14} y2={bl.y + 75}
          stroke="hsl(222 47% 18%)" strokeWidth="0.8"
        />
        <text x={bl.cx} y={bl.y + 85} textAnchor="middle" fontSize="7.5"
          fill="hsl(2 60% 55%)" fontFamily="sans-serif">
          Red: 16 GB DDR4 · 1.2 TB NVMe · Optical 10G
        </text>
        <text x={bl.cx} y={bl.y + 95} textAnchor="middle" fontSize="6.5"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          VTRAF · Nano-D (4× 1000Base-T) · USB
        </text>
        <text x={bl.cx} y={bl.y + 106} textAnchor="middle" fontSize="7.5"
          fill="hsl(215 10% 48%)" fontFamily="sans-serif">
          Black: 16 GB DDR4 · 1.2 TB NVMe · Optical 10G
        </text>
        <text x={bl.cx} y={bl.y + 116} textAnchor="middle" fontSize="6.5"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          VTRAF · Nano-D (4× 1000Base-T) · USB
        </text>
        <text x={bl.cx} y={bl.y + 128} textAnchor="middle" fontSize="7.5"
          fill="hsl(217 55% 62%)" fontFamily="sans-serif">
          7-slot SpaceVPX · MARCC Crypto
        </text>
        <text x={bl.cx} y={bl.y + 139} textAnchor="middle" fontSize="7.5"
          fill="hsl(45 80% 62%)" fontFamily="sans-serif">
          96 W
        </text>

        {/* ── Next Gen Node (ghost / roadmap) ───────────────────────────── */}
        <rect x={ng.x} y={ng.y} width={ng.w} height={ng.h} rx="8"
          fill="hsl(222 47% 5%)" stroke="hsl(215 20% 25%)" strokeWidth="1.2"
          strokeDasharray="6 3"
        />
        <text x={ng.cx} y={ng.y + 26} textAnchor="middle" fontSize="13"
          fill="hsl(215 20% 40%)" fontWeight="700" fontFamily="sans-serif">
          Next Gen SNP
        </text>
        <text x={ng.cx} y={ng.y + 42} textAnchor="middle" fontSize="9"
          fill="hsl(215 20% 33%)" fontFamily="sans-serif">
          Roadmap — TBD
        </text>
        <text x={ng.cx} y={ng.y + 56} textAnchor="middle" fontSize="8"
          fill="hsl(215 20% 27%)" fontFamily="sans-serif">
          Requirements in definition
        </text>

        {/* ── ABE Customer Node ─────────────────────────────────────────── */}
        <rect x={abe.x} y={custY} width={custW} height={custH} rx="6"
          fill="hsl(222 47% 8%)" stroke="hsl(222 47% 22%)" strokeWidth="1.2"
        />
        <text x={abe.cx} y={custY + 14} textAnchor="middle" fontSize="13"
          fill="hsl(210 40% 92%)" fontWeight="700" fontFamily="sans-serif">
          ABE
        </text>
        <text x={abe.cx} y={custY + 25} textAnchor="middle" fontSize="7"
          fill="hsl(215 20% 52%)" fontFamily="sans-serif">
          pLEO · 2× ACAM (Cold Spare)
        </text>
        <text x={abe.cx} y={custY + 34} textAnchor="middle" fontSize="6.5"
          fill="hsl(2 60% 55%)" fontFamily="sans-serif">
          Red: 16 GB DDR4 · Copper 10G
        </text>
        <text x={abe.cx} y={custY + 42} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          VTRFA · 4× 1000Base-T · USB
        </text>
        <text x={abe.cx} y={custY + 50} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          2 Gb NVM · FPGA 1.5M SLC
        </text>
        <text x={abe.cx} y={custY + 60} textAnchor="middle" fontSize="6.5"
          fill="hsl(215 10% 48%)" fontFamily="sans-serif">
          Black: 16 GB DDR4 · Copper 10G
        </text>
        <text x={abe.cx} y={custY + 68} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          3× QSFP · 2× 100Base-T · USB
        </text>
        <text x={abe.cx} y={custY + 76} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          2 Gb NVM · FPGA 1.5M SLC
        </text>
        <text x={abe.cx} y={custY + 88} textAnchor="middle" fontSize="7.5"
          fill="hsl(45 80% 62%)" fontFamily="sans-serif">
          90 W
        </text>

        {/* ── J2 Customer Node ──────────────────────────────────────────── */}
        <rect x={j2.x} y={custY} width={custW} height={j2H} rx="6"
          fill="hsl(222 47% 8%)" stroke="hsl(222 47% 22%)" strokeWidth="1.2"
        />
        <text x={j2.cx} y={custY + 12} textAnchor="middle" fontSize="11"
          fill="hsl(210 40% 92%)" fontWeight="700" fontFamily="sans-serif">
          J2
        </text>
        <text x={j2.cx} y={custY + 22} textAnchor="middle" fontSize="6.5"
          fill="hsl(215 20% 52%)" fontFamily="sans-serif">
          pLEO · Atomic Clock
        </text>
        {/* Red side */}
        <text x={j2.cx} y={custY + 32} textAnchor="middle" fontSize="6.5"
          fill="hsl(2 60% 55%)" fontFamily="sans-serif">
          Red: 16 GB DDR4 · Copper 10G
        </text>
        <text x={j2.cx} y={custY + 40} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          VTRFA · Nano-D · USB
        </text>
        <text x={j2.cx} y={custY + 48} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          1× RS-422 In · 1× RS-422 Out
        </text>
        <text x={j2.cx} y={custY + 56} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          1× 1PPS (LVDS) In
        </text>
        <text x={j2.cx} y={custY + 64} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          2 Gb NVM · FPGA 1.5M SLC
        </text>
        {/* Black side */}
        <text x={j2.cx} y={custY + 74} textAnchor="middle" fontSize="6.5"
          fill="hsl(215 10% 48%)" fontFamily="sans-serif">
          Black: 16 GB DDR4 · 2.5GBase-T
        </text>
        <text x={j2.cx} y={custY + 82} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          VTRFA · Nano-D · USB
        </text>
        <text x={j2.cx} y={custY + 90} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          4× 1PPS · 4× 10 MHz
        </text>
        <text x={j2.cx} y={custY + 98} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          4× 2.5GBase-T
        </text>
        <text x={j2.cx} y={custY + 106} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          4× 100Base-T · 2× 1000Base-T
        </text>
        <text x={j2.cx} y={custY + 113} textAnchor="middle" fontSize="5.5"
          fill="hsl(215 10% 30%)" fontFamily="sans-serif">
          † Backplane d/c required
        </text>
        <text x={j2.cx} y={custY + 119} textAnchor="middle" fontSize="5.5"
          fill="hsl(215 10% 30%)" fontFamily="sans-serif">
          (Quad PHY — same as Baseline)
        </text>
        <text x={j2.cx} y={custY + 127} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          2 Gb NVM · FPGA 1.5M SLC
        </text>
        <text x={j2.cx} y={custY + 133} textAnchor="middle" fontSize="7.5"
          fill="hsl(45 80% 62%)" fontFamily="sans-serif">
          103 W
        </text>

        {/* ── JL Customer Node ──────────────────────────────────────────── */}
        <rect x={jl.x} y={custY} width={custW} height={custH} rx="6"
          fill="hsl(222 47% 8%)" stroke="hsl(222 47% 22%)" strokeWidth="1.2"
        />
        <text x={jl.cx} y={custY + 14} textAnchor="middle" fontSize="13"
          fill="hsl(210 40% 92%)" fontWeight="700" fontFamily="sans-serif">
          JL
        </text>
        <text x={jl.cx} y={custY + 25} textAnchor="middle" fontSize="7"
          fill="hsl(215 20% 52%)" fontFamily="sans-serif">
          pLEO Mission
        </text>
        <text x={jl.cx} y={custY + 34} textAnchor="middle" fontSize="6.5"
          fill="hsl(2 60% 55%)" fontFamily="sans-serif">
          Red: 16 GB DDR4 · Copper 10G
        </text>
        <text x={jl.cx} y={custY + 42} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          VTRFA · Nano-D · USB
        </text>
        <text x={jl.cx} y={custY + 50} textAnchor="middle" fontSize="6"
          fill="hsl(2 45% 42%)" fontFamily="sans-serif">
          2 Gb NVM · FPGA 1.5M SLC
        </text>
        <text x={jl.cx} y={custY + 60} textAnchor="middle" fontSize="6.5"
          fill="hsl(215 10% 48%)" fontFamily="sans-serif">
          Black: 16 GB DDR4 · Copper 10G
        </text>
        <text x={jl.cx} y={custY + 68} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          VTRFA · Nano-D · USB
        </text>
        <text x={jl.cx} y={custY + 76} textAnchor="middle" fontSize="6"
          fill="hsl(215 10% 37%)" fontFamily="sans-serif">
          2 Gb NVM · FPGA 1.5M SLC
        </text>
        <text x={jl.cx} y={custY + 88} textAnchor="middle" fontSize="7.5"
          fill="hsl(45 80% 62%)" fontFamily="sans-serif">
          90 W
        </text>
      </svg>
      </div>
    </div>
  );
}
