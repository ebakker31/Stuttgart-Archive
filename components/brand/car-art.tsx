import { cn } from "@/lib/utils";

/**
 * Original "blueprint plate" car illustrations — engineering-notebook styling
 * that matches the brand's technical-drawing inspiration. These are entirely
 * original vector artwork (no Porsche logos, crest, photos, or brand assets),
 * tinted to each vehicle's real exterior color. They are NOT photographs.
 *
 * To use real licensed photography instead, drop a file in /public/demo-cars/
 * and set `photo` on the demo vehicle (see lib/demo-data.ts) — VehicleImage
 * will prefer the photo automatically.
 */

export type CarBody = "coupe" | "mid" | "sedan" | "vintage";

/** Map common Porsche color names to an archival tint. */
export function colorToHex(name?: string): string {
  const n = (name || "").toLowerCase();
  if (n.includes("yellow")) return "#E8B71E";
  if (n.includes("arena") || (n.includes("red") && n.includes("metallic"))) return "#7C2B26";
  if (n.includes("red")) return "#8C2B2B";
  if (n.includes("white") || n.includes("carrara")) return "#E7E4DC";
  if (n.includes("black") || n.includes("basalt")) return "#2A2D31";
  if (n.includes("silver") || n.includes("gt silver")) return "#C4C7CC";
  if (n.includes("blue")) return "#3C5A73";
  if (n.includes("green")) return "#46584A";
  return "#AFB3B8";
}

export function bodyForModel(model: string, year: number): CarBody {
  const m = model.toLowerCase();
  if (m.includes("taycan")) return "sedan";
  if (m.includes("cayman") || m.includes("boxster") || m.includes("spyder")) return "mid";
  if (year < 2000) return "vintage";
  return "coupe";
}

// Hand-tuned side-profile silhouettes (viewBox 0 0 440 210, ground at y≈176).
const BODY_PATHS: Record<CarBody, { body: string; glass: string; frontCx: number; rearCx: number }> = {
  coupe: {
    body: "M40,150 L36,126 Q38,110 60,106 L150,99 Q166,97 180,86 L210,60 Q250,46 312,54 L344,96 Q372,104 400,112 Q412,115 410,130 L406,150 Z",
    glass: "M186,86 L212,63 Q250,50 306,57 L332,92 Z",
    frontCx: 110, rearCx: 352,
  },
  vintage: {
    body: "M44,150 L40,124 Q44,104 74,100 L150,96 Q168,92 184,76 L214,56 Q252,44 300,54 L330,96 Q360,108 392,116 Q404,119 400,132 L396,150 Z",
    glass: "M190,78 L216,58 Q250,48 296,57 L320,92 Z",
    frontCx: 116, rearCx: 344,
  },
  mid: {
    body: "M40,150 L36,128 Q38,112 58,108 L140,103 Q156,101 176,90 L236,64 Q286,52 326,68 L356,104 Q380,110 402,116 Q414,119 412,132 L408,150 Z",
    glass: "M182,90 L238,66 Q284,56 320,70 L344,100 Z",
    frontCx: 108, rearCx: 356,
  },
  sedan: {
    body: "M36,150 L32,126 Q34,110 56,106 L132,100 Q150,98 168,82 L214,56 Q252,48 320,56 L362,92 Q386,98 406,108 Q416,112 414,128 L410,150 Z",
    glass: "M174,82 L214,58 Q252,50 314,58 L348,90 Z",
    frontCx: 104, rearCx: 360,
  },
};

export function CarPlate({
  body,
  color,
  className,
  showGrid = true,
}: {
  body: CarBody;
  color: string;
  className?: string;
  showGrid?: boolean;
}) {
  const p = BODY_PATHS[body];
  const isDark = ["#2A2D31"].includes(color);
  const stroke = isDark ? "#5A5E63" : "rgba(25,27,30,0.55)";
  const glass = "rgba(120,135,150,0.30)";

  return (
    <svg viewBox="0 0 440 210" className={cn("h-full w-full", className)} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Archival car profile illustration">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="1" />
          <stop offset="1" stopColor={color} stopOpacity="0.82" />
        </linearGradient>
      </defs>

      {showGrid && (
        <g opacity="0.5">
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="210" stroke="rgba(25,27,30,0.05)" strokeWidth="1" />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 20} x2="440" y2={i * 20} stroke="rgba(25,27,30,0.05)" strokeWidth="1" />
          ))}
        </g>
      )}

      {/* ground / datum line */}
      <line x1="20" y1="176" x2="420" y2="176" stroke="rgba(140,43,43,0.5)" strokeWidth="1" strokeDasharray="2 4" />

      {/* body */}
      <path d={p.body} fill="url(#cg)" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      {/* glass house */}
      <path d={p.glass} fill={glass} stroke={stroke} strokeWidth="1" />
      {/* belt line */}
      <path d={`M70,118 L400,118`} stroke={stroke} strokeOpacity="0.4" strokeWidth="0.8" />

      {/* wheels */}
      {[p.frontCx, p.rearCx].map((cx, i) => (
        <g key={i}>
          {/* wheel-arch cut */}
          <path d={`M${cx - 40},150 A40,40 0 0 1 ${cx + 40},150`} fill={isDark ? "#1B1D20" : "#F4F1EA"} stroke="none" />
          <circle cx={cx} cy={150} r={30} fill="#1F2226" stroke={stroke} strokeWidth="1.5" />
          <circle cx={cx} cy={150} r={15} fill="none" stroke="#9AA0A6" strokeWidth="1.4" />
          <circle cx={cx} cy={150} r={3.2} fill="#9AA0A6" />
          {Array.from({ length: 5 }).map((_, s) => {
            const a = (s / 5) * Math.PI * 2;
            return <line key={s} x1={cx} y1={150} x2={cx + Math.cos(a) * 14} y2={150 + Math.sin(a) * 14} stroke="#9AA0A6" strokeWidth="1.2" />;
          })}
        </g>
      ))}

      {/* dimension tick marks under wheels */}
      <g stroke="rgba(25,27,30,0.4)" strokeWidth="0.8">
        <line x1={p.frontCx} y1="186" x2={p.frontCx} y2="194" />
        <line x1={p.rearCx} y1="186" x2={p.rearCx} y2="194" />
        <line x1={p.frontCx} y1="190" x2={p.rearCx} y2="190" />
      </g>
    </svg>
  );
}
