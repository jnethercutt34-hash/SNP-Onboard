import type { VPXSlot } from "@/lib/mock-hardware";

// ── Layout ────────────────────────────────────────────────────────────────────

const VW = 910;
const VH = 220;
const EAR = 28;           // rack ear width
const RAIL = 20;          // top / bottom rail height
const SLOTS = 7;
const TOTAL_W = VW - EAR * 2;          // 854
const SW = TOTAL_W / SLOTS;            // ≈ 122
const FW = Math.round(SW * 0.9);       // face plate width (~90% of slot, gaps between modules)
const FY = RAIL;                       // face plate top y
const FH = VH - RAIL * 2;             // face plate height = 180

function fx(slot: number) {
  return EAR + slot * SW;
}

// Slot positions are now carried directly by VPXSlot.slotNumber (0–6).

// ── Shared sub-elements ───────────────────────────────────────────────────────

// Recessed pull handle — flat industrial style matching product photo
function Handles({ x }: { x: number }) {
  return (
    <>
      {/* top recessed handle groove */}
      <rect x={x + 6} y={FY + 4} width={FW - 12} height={8} rx={1.5}
            fill="#050505" stroke="#1a1a1a" strokeWidth="0.7"/>
      <rect x={x + 10} y={FY + 5.5} width={FW - 20} height={5} rx={1}
            fill="#080808" stroke="#222" strokeWidth="0.5"/>
      {/* bottom recessed handle groove */}
      <rect x={x + 6} y={FY + FH - 12} width={FW - 12} height={8} rx={1.5}
            fill="#050505" stroke="#1a1a1a" strokeWidth="0.7"/>
      <rect x={x + 10} y={FY + FH - 10.5} width={FW - 20} height={5} rx={1}
            fill="#080808" stroke="#222" strokeWidth="0.5"/>
    </>
  );
}

// Blue-only LEDs matching product photo illumination
function Leds({ x, count = 3 }: { x: number; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <circle cx={x + 14 + i * 11} cy={FY + 19} r={5} fill="#1d4ed8" opacity="0.12"/>
          <circle cx={x + 14 + i * 11} cy={FY + 19} r={2.8} fill="#1d4ed8" opacity="0.7"/>
          <circle cx={x + 14 + i * 11} cy={FY + 19} r={1.4} fill="#93c5fd" opacity="0.9"/>
        </g>
      ))}
    </>
  );
}

// Blue-lit rectangular connector port (matches the ports visible in product photo)
function BluePort({ px, py, w = 20, h = 14 }: { px: number; py: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={px} y={py} width={w} height={h} rx={1}
            fill="#02040a" stroke="#0f2040" strokeWidth="0.7"/>
      <rect x={px + 2} y={py + 2} width={w - 4} height={h - 4} rx={0.5}
            fill="#030810" stroke="#1a3a6e" strokeWidth="0.4"/>
      <rect x={px + 3} y={py + 3} width={w - 6} height={h - 6} rx={0.3}
            fill="#1d4ed8" opacity="0.18"/>
      <rect x={px + 3} y={py + 3} width={w - 6} height={2} rx={0.3}
            fill="#60a5fa" opacity="0.35"/>
    </g>
  );
}

// ── Connector helpers ─────────────────────────────────────────────────────────

// MDM (Micro-D Miniature) connector — vertical/portrait orientation
// pins = 9 or 15; 2 columns of pins running top-to-bottom
function MdmV({ px, py, pins }: { px: number; py: number; pins: 9 | 15 }) {
  const rows   = Math.ceil(pins / 2);   // 9→5 rows, 15→8 rows
  const bodyW  = 16;
  const bodyH  = rows * 5 + 10;
  const pinR   = 1.1;
  const col0X  = px + 4;
  const col1X  = px + 10;
  const startY = py + 6;

  return (
    <g>
      {/* Outer metal shell */}
      <rect x={px} y={py} width={bodyW} height={bodyH} rx={2}
            fill="#080808" stroke="#252525" strokeWidth="0.9"/>
      {/* Inner insert */}
      <rect x={px + 2} y={py + 2} width={bodyW - 4} height={bodyH - 4} rx={1}
            fill="#050505" stroke="#1a1a1a" strokeWidth="0.5"/>
      {/* Threaded jack-screw holes at top and bottom */}
      <circle cx={px + bodyW / 2} cy={py + 1.5}          r={1.5} fill="#030303" stroke="#1e1e1e" strokeWidth="0.4"/>
      <circle cx={px + bodyW / 2} cy={py + bodyH - 1.5}  r={1.5} fill="#030303" stroke="#1e1e1e" strokeWidth="0.4"/>
      {/* Pins — col 0 has ceil(pins/2) pins, col 1 has floor(pins/2) */}
      {Array.from({ length: Math.ceil(pins / 2) }, (_, r) => (
        <circle key={`c0r${r}`} cx={col0X} cy={startY + r * 5} r={pinR}
                fill="#0a0a0a" stroke="#2e2e2e" strokeWidth="0.5"/>
      ))}
      {Array.from({ length: Math.floor(pins / 2) }, (_, r) => (
        <circle key={`c1r${r}`} cx={col1X} cy={startY + r * 5 + 2.5} r={pinR}
                fill="#0a0a0a" stroke="#2e2e2e" strokeWidth="0.5"/>
      ))}
    </g>
  );
}

// VTRFA Airborn — wide high-density rectangular panel connector
// Represented as a broad rectangular shell with 2 rows of dense pins
function VtrfaAirborn({ px, py, w = 72 }: { px: number; py: number; w?: number }) {
  const h = 18;
  const pinCols = 18;
  const pinSpX  = (w - 10) / (pinCols - 1);

  return (
    <g>
      {/* Outer shell — wide rectangular */}
      <rect x={px} y={py} width={w} height={h} rx={1.5}
            fill="#080808" stroke="#252525" strokeWidth="0.9"/>
      {/* Inner insert */}
      <rect x={px + 2} y={py + 2} width={w - 4} height={h - 4} rx={1}
            fill="#050505" stroke="#181818" strokeWidth="0.5"/>
      {/* 2 rows of pins */}
      {Array.from({ length: pinCols }, (_, i) => (
        <g key={i}>
          <circle cx={px + 5 + i * pinSpX} cy={py + 6}  r={1.0} fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.4"/>
          <circle cx={px + 5 + i * pinSpX} cy={py + 12} r={1.0} fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.4"/>
        </g>
      ))}
      {/* Corner retention screws */}
      <circle cx={px + 4}     cy={py + h / 2} r={2.5} fill="#060606" stroke="#1e1e1e" strokeWidth="0.5"/>
      <circle cx={px + w - 4} cy={py + h / 2} r={2.5} fill="#060606" stroke="#1e1e1e" strokeWidth="0.5"/>
    </g>
  );
}

// 51-pin nano connector — 3 rows × 17 pins, compact rectangular housing
function NanoConn({ px, py, w = 52 }: { px: number; py: number; w?: number }) {
  const h = 16;
  const cols = 17;
  const spX  = (w - 8) / (cols - 1);

  return (
    <g>
      <rect x={px} y={py} width={w} height={h} rx={1}
            fill="#080808" stroke="#222222" strokeWidth="0.9"/>
      <rect x={px + 2} y={py + 2} width={w - 4} height={h - 4} rx={0.5}
            fill="#050505" stroke="#161616" strokeWidth="0.5"/>
      {/* 3 rows × 17 pins = 51 */}
      {[0, 1, 2].map(row =>
        Array.from({ length: cols }, (_, col) => (
          <circle key={`${row}-${col}`}
                  cx={px + 4 + col * spX}
                  cy={py + 4 + row * 4}
                  r={0.9} fill="#0a0a0a" stroke="#282828" strokeWidth="0.4"/>
        ))
      )}
    </g>
  );
}

// USB-C connector — oval housing with central tab
function UsbC({ px, py }: { px: number; py: number }) {
  const w = 18; const h = 10;
  return (
    <g>
      <rect x={px} y={py} width={w} height={h} rx={5}
            fill="#080808" stroke="#252525" strokeWidth="0.9"/>
      <rect x={px + 2} y={py + 2} width={w - 4} height={h - 4} rx={3}
            fill="#040404" stroke="#181818" strokeWidth="0.5"/>
      <rect x={px + 5} y={py + 3.5} width={w - 10} height={h - 7} rx={0.5}
            fill="#0a0a0a" stroke="#1e1e1e" strokeWidth="0.4"/>
    </g>
  );
}

// Micro USB connector — small trapezoid opening
function MicroUsb({ px, py }: { px: number; py: number }) {
  return (
    <g>
      {/* Outer housing */}
      <rect x={px} y={py} width={13} height={7} rx={1}
            fill="#080808" stroke="#222" strokeWidth="0.8"/>
      {/* Trapezoid opening — wider at top */}
      <path d={`M${px+2},${py+1.5} L${px+11},${py+1.5} L${px+10},${py+5.5} L${px+3},${py+5.5} Z`}
            fill="#030303" stroke="#181818" strokeWidth="0.4"/>
      {/* 5 pins inside */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={px + 3 + i * 1.5} y={py + 2.5} width={0.8} height={3}
              fill="#1a1a1a" stroke="none"/>
      ))}
    </g>
  );
}

// ── Portrait connector variants (rotated 90° for GPP faceplate) ──────────────

// VTRFA Airborn — portrait: 2 columns × 18 rows of pins
function VtrfaAirbornV({ px, py }: { px: number; py: number }) {
  const w = 18; const h = 55;
  const rows   = 18;
  const pinSpY = (h - 10) / (rows - 1);

  return (
    <g>
      <rect x={px} y={py} width={w} height={h} rx={1.5}
            fill="#080808" stroke="#252525" strokeWidth="0.9"/>
      <rect x={px + 2} y={py + 2} width={w - 4} height={h - 4} rx={1}
            fill="#050505" stroke="#181818" strokeWidth="0.5"/>
      {Array.from({ length: rows }, (_, i) => (
        <g key={i}>
          <circle cx={px + 5.5} cy={py + 5 + i * pinSpY} r={0.7} fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.4"/>
          <circle cx={px + 12.5} cy={py + 5 + i * pinSpY} r={0.7} fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.4"/>
        </g>
      ))}
      {/* Retention screws top / bottom */}
      <circle cx={px + w / 2} cy={py + 3.5}      r={2.5} fill="#060606" stroke="#1e1e1e" strokeWidth="0.5"/>
      <circle cx={px + w / 2} cy={py + h - 3.5}  r={2.5} fill="#060606" stroke="#1e1e1e" strokeWidth="0.5"/>
    </g>
  );
}

// 51-pin Nano — portrait: 3 columns × 17 rows
function NanoConnV({ px, py }: { px: number; py: number }) {
  const w = 14; const h = 42;
  const rows = 17;
  const spY  = (h - 8) / (rows - 1);

  return (
    <g>
      <rect x={px} y={py} width={w} height={h} rx={1}
            fill="#080808" stroke="#222222" strokeWidth="0.9"/>
      <rect x={px + 2} y={py + 2} width={w - 4} height={h - 4} rx={0.5}
            fill="#050505" stroke="#161616" strokeWidth="0.5"/>
      {[0, 1, 2].map(col =>
        Array.from({ length: rows }, (_, row) => (
          <circle key={`${col}-${row}`}
                  cx={px + 3.5 + col * 3.5}
                  cy={py + 4 + row * spY}
                  r={0.65} fill="#0a0a0a" stroke="#282828" strokeWidth="0.4"/>
        ))
      )}
    </g>
  );
}

// Micro USB — portrait orientation
function MicroUsbV({ px, py }: { px: number; py: number }) {
  return (
    <g>
      <rect x={px} y={py} width={8} height={14} rx={1}
            fill="#080808" stroke="#222" strokeWidth="0.8"/>
      <path d={`M${px+1.5},${py+2} L${px+6.5},${py+2} L${px+6},${py+12} L${px+2},${py+12} Z`}
            fill="#030303" stroke="#181818" strokeWidth="0.4"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={px + 2.5} y={py + 3 + i * 1.5} width={3} height={0.8}
              fill="#1a1a1a" stroke="none"/>
      ))}
    </g>
  );
}

// ── GPP faceplate ─────────────────────────────────────────────────────────────

function GppFace({ x, side }: { x: number; side: "RED" | "BLACK" }) {
  const mid = FW / 2;
  const isRed = side === "RED";
  // Red side gets a very subtle red-tinted panel; Black side stays dark
  const panelFill  = isRed ? "#0f0808" : "#0a0a0a";
  const panelStroke = isRed ? "#2a1010" : "#1c1c1c";
  const labelColor = isRed ? "#ef4444" : "#60a5fa";
  const screwStroke = isRed ? "#2a1010" : "#1a1a1a";

  return (
    <g>
      {/* Panel body — red-tinted for RED side, matte black for BLACK */}
      <rect x={x} y={FY} width={FW} height={FH} fill={panelFill} stroke={panelStroke} strokeWidth="0.8"/>
      {/* Top edge accent line */}
      <rect x={x} y={FY} width={FW} height={2} fill={isRed ? "#7f1d1d" : "#1e2a3a"} opacity="0.7"/>
      {/* Subtle panel screw holes at corners — matches product photo */}
      {[[x+7, FY+7],[x+FW-7, FY+7],[x+7, FY+FH-7],[x+FW-7, FY+FH-7]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="#060606" stroke={screwStroke} strokeWidth="0.6"/>
      ))}
      <Handles x={x}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#2a2a2a" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">GPP</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill={labelColor} fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {side}
      </text>

      {/* ── Connectors — portrait, VTRFA+NANO side-by-side, USB below-right ── */}
      <a href="/modules/conn-vtrfa" className="conn-link">
        <VtrfaAirbornV px={x + 24} py={FY + 50}/>
        <text x={x + 33} y={FY + 131} textAnchor="middle"
              fill="#1a2a3a" fontSize="4.5" fontFamily="monospace">VTRFA</text>
      </a>
      <a href="/modules/conn-nano-51" className="conn-link">
        <NanoConnV px={x + 64} py={FY + 57}/>
        <text x={x + 71} y={FY + 131} textAnchor="middle"
              fill="#1a2a3a" fontSize="4.5" fontFamily="monospace">NANO</text>
      </a>
      <a href="/modules/conn-micro-usb" className="conn-link">
        <MicroUsbV px={x + 62} py={FY + 114}/>
        <text x={x + 66} y={FY + 136} textAnchor="middle"
              fill="#1a2a3a" fontSize="4.5" fontFamily="monospace">USB</text>
      </a>

      <text x={x + mid} y={FY + 150} textAnchor="middle"
            fill="#161616" fontSize="5.5" fontFamily="monospace">ARM A78AE · QUAD CORE</text>
      <text x={x + mid} y={FY + 160} textAnchor="middle"
            fill="#161616" fontSize="5.5" fontFamily="monospace">16 GB LPDDR4X · ECC</text>
    </g>
  );
}

// ── Crypto faceplate ──────────────────────────────────────────────────────────

function CryptoFace({ x }: { x: number }) {
  const mid = FW / 2;

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#0a0a0a" stroke="#1c1c1c" strokeWidth="0.8"/>
      {[[x+7, FY+7],[x+FW-7, FY+7],[x+7, FY+FH-7],[x+FW-7, FY+FH-7]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="#060606" stroke="#1a1a1a" strokeWidth="0.6"/>
      ))}
      <Handles x={x}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#2a2a2a" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">CRYPTO</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill="#3b82f6" fontSize="9" fontFamily="monospace" fontWeight="bold">UNIT</text>

      {/* ── USB-C — centered ── */}
      <a href="/modules/conn-usb-c" className="conn-link">
        <UsbC px={x + Math.round(FW / 2) - 9} py={FY + 65}/>
        <text x={x + mid} y={FY + 82} textAnchor="middle"
              fill="#1a2a3a" fontSize="5" fontFamily="monospace">USB-C</text>
      </a>

      {/* FIPS badge */}
      <rect x={x + 18} y={FY + 112} width={FW - 36} height={14} rx={1.5}
            fill="#060606" stroke="#1a2e50" strokeWidth="0.7"/>
      <text x={x + mid} y={FY + 122} textAnchor="middle"
            fill="#3b82f6" fontSize="7" fontFamily="monospace" fontWeight="bold"
            letterSpacing="0.5">FIPS 140-2 L3</text>

      <text x={x + mid} y={FY + 143} textAnchor="middle"
            fill="#1a2a3a" fontSize="5.5" fontFamily="monospace">AES-256 · ECC P-384</text>
      <text x={x + mid} y={FY + 155} textAnchor="middle"
            fill="#161616" fontSize="5.5" fontFamily="monospace">TAMPER EVIDENT</text>
    </g>
  );
}

// ── PSU faceplate ─────────────────────────────────────────────────────────────

function PsuFace({ x, side }: { x: number; side: "RED" | "BLACK" }) {
  const isBlack = side === "BLACK";
  const isRed = !isBlack;
  const mid = FW / 2;

  // Red PSU gets warm red-tinted panel; Black PSU stays dark
  const panelFill   = isRed ? "#0f0808" : "#0a0a0a";
  const panelStroke = isRed ? "#2a1010" : "#1c1c1c";
  const labelColor  = isRed ? "#ef4444" : "#60a5fa";
  const pinStroke   = isRed ? "#3a1010" : "#1d3a6e";

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill={panelFill} stroke={panelStroke} strokeWidth="0.8"/>
      {/* Top edge accent line */}
      <rect x={x} y={FY} width={FW} height={2} fill={isRed ? "#7f1d1d" : "#1e2a3a"} opacity="0.7"/>
      {[[x+7, FY+7],[x+FW-7, FY+7],[x+7, FY+FH-7],[x+FW-7, FY+FH-7]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="#060606" stroke={panelStroke} strokeWidth="0.6"/>
      ))}
      <Handles x={x}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#2a2a2a" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">POWER</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill={labelColor} fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {side}
      </text>

      {/* ── 15-pin MDM (top) — centered, vertical orientation ── */}
      {/* bodyH = ceil(15/2)*5+10 = 50px */}
      <a href="/modules/conn-mdm-15" className="conn-link">
        <MdmV px={x + Math.round(mid) - 8} py={FY + 52} pins={15}/>
        <text x={x + mid} y={FY + 108} textAnchor="middle"
              fill="#1a2a3a" fontSize="5" fontFamily="monospace">15-PIN MDM</text>
      </a>

      {/* ── 9-pin MDM (below) — centered, vertical orientation ── */}
      {/* bodyH = ceil(9/2)*5+10 = 35px */}
      <a href="/modules/conn-mdm-9" className="conn-link">
        <MdmV px={x + Math.round(mid) - 8} py={FY + 115} pins={9}/>
        <text x={x + mid} y={FY + 156} textAnchor="middle"
              fill="#1a2a3a" fontSize="5" fontFamily="monospace">9-PIN MDM</text>
      </a>

      <text x={x + mid} y={FY + 166} textAnchor="middle"
            fill="#1e1e1e" fontSize="5" fontFamily="monospace">28 VDC INPUT</text>
    </g>
  );
}

// ── 10G Copper faceplate ──────────────────────────────────────────────────────

function CopperFace({ x }: { x: number }) {
  const mid = FW / 2;

  const Rj45 = ({ px, py }: { px: number; py: number }) => (
    <g>
      <rect x={px} y={py} width={46} height={34} rx={1.5}
            fill="#060606" stroke="#181818" strokeWidth="0.7"/>
      <rect x={px + 3} y={py + 3} width={40} height={28} rx={1} fill="#030303"/>
      <rect x={px + 10} y={py}    width={8}  height={5}  fill="#0a0a0a"/>
      <rect x={px + 28} y={py}    width={8}  height={5}  fill="#0a0a0a"/>
      {/* blue status LEDs on port */}
      <circle cx={px + 39} cy={py + 5}  r={2.2} fill="#3b82f6" opacity="0.9"/>
      <circle cx={px + 39} cy={py + 13} r={2.2} fill="#3b82f6" opacity="0.45"/>
    </g>
  );

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#0a0a0a" stroke="#1c1c1c" strokeWidth="0.8"/>
      {[[x+7, FY+7],[x+FW-7, FY+7],[x+7, FY+FH-7],[x+FW-7, FY+FH-7]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="#060606" stroke="#1a1a1a" strokeWidth="0.6"/>
      ))}
      <Handles x={x}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#2a2a2a" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">10G NET</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill="#3b82f6" fontSize="9" fontFamily="monospace" fontWeight="bold">COPPER</text>

      <a href="/modules/conn-rj45-10g" className="conn-link">
        <Rj45 px={x + 10} py={FY + 56}/>
      </a>
      <a href="/modules/conn-rj45-10g" className="conn-link">
        <Rj45 px={x + 60} py={FY + 56}/>
      </a>

      <text x={x + mid} y={FY + 103} textAnchor="middle"
            fill="#1a2a3a" fontSize="6" fontFamily="monospace">10GBASE-T · DUAL</text>
      <text x={x + mid} y={FY + 118} textAnchor="middle"
            fill="#1a2a3a" fontSize="6" fontFamily="monospace">CAT-6A SHIELDED</text>
      <text x={x + mid} y={FY + 130} textAnchor="middle"
            fill="#161616" fontSize="5.5" fontFamily="monospace">100 m REACH</text>

      <rect x={x + 20} y={FY + 140} width={FW - 40} height={12} rx={1.5}
            fill="#060606" stroke="#181818" strokeWidth="0.7"/>
      <text x={x + mid} y={FY + 149} textAnchor="middle"
            fill="#3b82f6" fontSize="6" fontFamily="monospace" fontWeight="bold">pLEO CONFIG</text>

      <text x={x + mid} y={FY + 163} textAnchor="middle"
            fill="#161616" fontSize="5.5" fontFamily="monospace">SWaP-C OPTIMISED</text>
    </g>
  );
}

// ── Atomic clock faceplate ────────────────────────────────────────────────────

function AtomicFace({ x }: { x: number }) {
  const mid = FW / 2;
  const clockCx = x + mid;
  const clockCy = FY + 82;
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <g>
      <rect x={x} y={FY} width={FW} height={FH} fill="#0a0a0a" stroke="#1c1c1c" strokeWidth="0.8"/>
      {[[x+7, FY+7],[x+FW-7, FY+7],[x+7, FY+FH-7],[x+FW-7, FY+FH-7]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="#060606" stroke="#1a1a1a" strokeWidth="0.6"/>
      ))}
      <Handles x={x}/>

      <text x={x + mid} y={FY + 36} textAnchor="middle"
            fill="#2a2a2a" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">TIMING</text>
      <text x={x + mid} y={FY + 47} textAnchor="middle"
            fill="#3b82f6" fontSize="9" fontFamily="monospace" fontWeight="bold">CSAC</text>

      {/* Clock face — blue tinted */}
      <circle cx={clockCx} cy={clockCy} r={26} fill="none" stroke="#1d3a6e" strokeWidth="0.7" opacity="0.4"/>
      <circle cx={clockCx} cy={clockCy} r={20} fill="none" stroke="#1d4ed8" strokeWidth="0.7" opacity="0.5"/>
      {ticks.map(deg => {
        const rad = (deg * Math.PI) / 180;
        const r1 = 20; const r2 = 24;
        return (
          <line key={deg}
                x1={clockCx + Math.sin(rad) * r1} y1={clockCy - Math.cos(rad) * r1}
                x2={clockCx + Math.sin(rad) * r2} y2={clockCy - Math.cos(rad) * r2}
                stroke="#3b82f6" strokeWidth={deg % 90 === 0 ? 1.2 : 0.6} opacity="0.45"/>
        );
      })}
      <line x1={clockCx} y1={clockCy} x2={clockCx} y2={clockCy - 14}
            stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
      <line x1={clockCx} y1={clockCy} x2={clockCx + 12} y2={clockCy + 6}
            stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.75"/>
      <circle cx={clockCx} cy={clockCy} r={2.5} fill="#60a5fa" opacity="0.9"/>

      <text x={x + mid} y={FY + 116} textAnchor="middle"
            fill="#1a2a3a" fontSize="5.5" fontFamily="monospace">&lt; 100 ns/day</text>

      <rect x={x + 10} y={FY + 122} width={FW - 20} height={12} rx={1.5}
            fill="#060606" stroke="#181818" strokeWidth="0.7"/>
      <text x={x + mid} y={FY + 131} textAnchor="middle"
            fill="#1a2a3a" fontSize="6" fontFamily="monospace">1 PPS · 10 MHz REF</text>

      <text x={x + mid} y={FY + 145} textAnchor="middle"
            fill="#161616" fontSize="5.5" fontFamily="monospace">IEEE 1588v2 PTP GM</text>
      <rect x={x + 20} y={FY + 152} width={FW - 40} height={11} rx={1.5}
            fill="#060606" stroke="#181818" strokeWidth="0.6"/>
      <text x={x + mid} y={FY + 160} textAnchor="middle"
            fill="#3b82f6" fontSize="6" fontFamily="monospace" fontWeight="bold">PRECISION SYNC</text>
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
      <rect x={x} y={FY} width={FW} height={FH} fill="#060606"
            stroke="#141414" strokeWidth="0.7" strokeDasharray="5 4"/>
      {screwY.flatMap(sy => screwX.map(sx => (
        <g key={`${sx}${sy}`}>
          <circle cx={sx} cy={sy} r={5.5} fill="#040404" stroke="#1a1a1a" strokeWidth="0.8"/>
          <line x1={sx - 3} y1={sy} x2={sx + 3} y2={sy} stroke="#1a1a1a" strokeWidth="1.2"/>
          <line x1={sx} y1={sy - 3} x2={sx} y2={sy + 3} stroke="#1a1a1a" strokeWidth="1.2"/>
        </g>
      )))}
      <text x={x + mid} y={FY + 84} textAnchor="middle"
            fill="#141414" fontSize="8" fontFamily="monospace" letterSpacing="1">SPARE</text>
      <text x={x + mid} y={FY + 98} textAnchor="middle"
            fill="#0e0e0e" fontSize="6.5" fontFamily="monospace">SLOT</text>
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ChassisDiagramProps {
  slots: VPXSlot[];
}

export function ChassisDiagram({ slots }: ChassisDiagramProps) {
  // Build a lookup from slotNumber → VPXSlot
  const slotMap = new Map(slots.map((s) => [s.slotNumber, s]));

  function renderFace(slotIdx: number) {
    const x    = fx(slotIdx);
    const slot = slotMap.get(slotIdx);
    if (!slot) return <EmptyFace key={slotIdx} x={x}/>;
    switch (slot.baseCard.id) {
      case "gpp-universal-a":    return <GppFace    key={slotIdx} x={x} side="RED"/>;
      case "gpp-universal-b":    return <GppFace    key={slotIdx} x={x} side="BLACK"/>;
      case "crypto-unit":        return <CryptoFace key={slotIdx} x={x}/>;
      case "psu-red":            return <PsuFace    key={slotIdx} x={x} side="RED"/>;
      case "psu-black":          return <PsuFace    key={slotIdx} x={x} side="BLACK"/>;
      case "timing-atomic-clock":return <AtomicFace key={slotIdx} x={x}/>;
      default:                   return <EmptyFace  key={slotIdx} x={x}/>;
    }
  }

  const labelText = `SNP-3UVPX · VITA 78 SpaceVPX · ${slots.length} / ${SLOTS} SLOTS OCCUPIED`;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full block"
        aria-label="3U SpaceVPX chassis — front view"
        style={{ maxHeight: "280px" }}
      >
          {/* ── Connector hover styles ── */}
        <style>{`
          .conn-link { cursor: pointer; }
          .conn-link:hover { filter: brightness(2); }
        `}</style>

        {/* ── Chassis body — matte black matching product photo ── */}
        <rect width={VW} height={VH} rx={4} fill="#080808" stroke="#1a1a1a" strokeWidth="1.5"/>

        {/* ── Left mounting flange — matches product photo base flanges */}
        <rect x={0} y={0} width={EAR} height={VH} rx={3} fill="#060606" stroke="#141414" strokeWidth="1"/>
        {[30, 80, 130, 170].map(y => (
          <g key={y}>
            <circle cx={14} cy={y} r={5.5} fill="#040404" stroke="#1a1a1a" strokeWidth="0.8"/>
            <circle cx={14} cy={y} r={2.5} fill="#020202"/>
            {/* bolt cross */}
            <line x1={11} y1={y} x2={17} y2={y} stroke="#222" strokeWidth="0.8"/>
            <line x1={14} y1={y-3} x2={14} y2={y+3} stroke="#222" strokeWidth="0.8"/>
          </g>
        ))}

        {/* ── Right mounting flange */}
        <rect x={VW - EAR} y={0} width={EAR} height={VH} rx={3}
              fill="#060606" stroke="#141414" strokeWidth="1"/>
        {[30, 80, 130, 170].map(y => (
          <g key={y}>
            <circle cx={VW - 14} cy={y} r={5.5} fill="#040404" stroke="#1a1a1a" strokeWidth="0.8"/>
            <circle cx={VW - 14} cy={y} r={2.5} fill="#020202"/>
            <line x1={VW-17} y1={y} x2={VW-11} y2={y} stroke="#222" strokeWidth="0.8"/>
            <line x1={VW-14} y1={y-3} x2={VW-14} y2={y+3} stroke="#222" strokeWidth="0.8"/>
          </g>
        ))}

        {/* ── Top rail */}
        <rect x={EAR} y={0} width={VW - EAR * 2} height={RAIL}
              fill="#070707" stroke="#141414" strokeWidth="0.8"/>
        {Array.from({ length: SLOTS - 1 }, (_, i) => (
          <line key={i}
                x1={EAR + (i + 1) * SW} y1={0}
                x2={EAR + (i + 1) * SW} y2={RAIL}
                stroke="#111" strokeWidth="1"/>
        ))}
        {/* Chassis label */}
        <text x={EAR + 8} y={14} fill="#1e1e1e" fontSize="7" fontFamily="monospace"
              letterSpacing="1" fontWeight="bold">
          {labelText}
        </text>

        {/* ── Bottom rail */}
        <rect x={EAR} y={VH - RAIL} width={VW - EAR * 2} height={RAIL}
              fill="#070707" stroke="#141414" strokeWidth="0.8"/>
        {Array.from({ length: SLOTS - 1 }, (_, i) => (
          <line key={i}
                x1={EAR + (i + 1) * SW} y1={VH - RAIL}
                x2={EAR + (i + 1) * SW} y2={VH}
                stroke="#111" strokeWidth="1"/>
        ))}

        {/* ── Slot separators ───────────────────────────────────── */}
        {Array.from({ length: SLOTS - 1 }, (_, i) => (
          <line key={i}
                x1={EAR + (i + 1) * SW - 1} y1={RAIL}
                x2={EAR + (i + 1) * SW - 1} y2={VH - RAIL}
                stroke="#0d1e34" strokeWidth="1.5"/>
        ))}

        {/* ── Module faces ──────────────────────────────────────── */}
        {Array.from({ length: SLOTS }, (_, i) => renderFace(i))}
      </svg>
    </div>
  );
}
