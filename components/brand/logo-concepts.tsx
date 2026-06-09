import { cn } from "@/lib/utils";

/**
 * Original Stuttgart Archive logo concepts. All marks are bespoke geometry —
 * NOT derived from any Porsche crest, shield, logo, or typography. They lean on
 * archival / museum-seal / editorial-masthead motifs.
 *
 * `currentColor` drives the ink so each mark inherits light/dark + accent.
 */

type MarkProps = { className?: string };

/** 1. Index-card mark — a filed archive card with a timeline notch. */
export function MarkIndexCard({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-16 w-16", className)} fill="none" aria-hidden>
      <rect x="9" y="13" width="46" height="38" rx="3" className="stroke-current" strokeWidth="2.4" />
      <line x1="9" y1="24" x2="55" y2="24" className="stroke-current" strokeWidth="2.4" />
      <line x1="32" y1="24" x2="32" y2="51" className="stroke-oxblood" strokeWidth="2.4" />
      <circle cx="32" cy="37.5" r="3" className="fill-oxblood" />
      <line x1="16" y1="18.5" x2="26" y2="18.5" className="stroke-current" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** 2. Archive seal — a museum stamp ring with an SA monogram. */
export function MarkSeal({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-16 w-16", className)} fill="none" aria-hidden>
      <circle cx="32" cy="32" r="29" className="stroke-current" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="24" className="stroke-current" strokeWidth="0.8" opacity="0.6" />
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        const r1 = 26.5, r2 = 28;
        return <line key={i} x1={32 + Math.cos(a) * r1} y1={32 + Math.sin(a) * r1} x2={32 + Math.cos(a) * r2} y2={32 + Math.sin(a) * r2} className="stroke-current" strokeWidth="0.7" opacity="0.5" />;
      })}
      <text x="32" y="40" textAnchor="middle" className="fill-current" style={{ fontFamily: "var(--font-wordmark)", fontSize: 24, fontWeight: 600 }}>SA</text>
      <circle cx="32" cy="14.5" r="1.4" className="fill-oxblood" />
    </svg>
  );
}

/** 3. Monogram block — serif SA embossed in a graphite square. */
export function MarkMonogramBlock({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-16 w-16", className)} fill="none" aria-hidden>
      <rect x="6" y="6" width="52" height="52" rx="4" className="fill-current" />
      <rect x="6" y="6" width="52" height="52" rx="4" className="stroke-oxblood" strokeWidth="0" />
      <text x="32" y="43" textAnchor="middle" className="fill-background" style={{ fontFamily: "var(--font-wordmark)", fontSize: 30, fontWeight: 600, letterSpacing: "0.02em" }}>SA</text>
      <line x1="20" y1="49" x2="44" y2="49" className="stroke-oxblood" strokeWidth="1.6" />
    </svg>
  );
}

/** 4. Single-S emblem — a serif S inside a fine ring. */
export function MarkSEmblem({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-16 w-16", className)} fill="none" aria-hidden>
      <circle cx="32" cy="32" r="29" className="stroke-current" strokeWidth="2" />
      <text x="32" y="44" textAnchor="middle" className="fill-current" style={{ fontFamily: "var(--font-wordmark)", fontSize: 38, fontWeight: 600 }}>S</text>
      <line x1="32" y1="5" x2="32" y2="11" className="stroke-oxblood" strokeWidth="2" />
    </svg>
  );
}

/** 5. Masthead rule — double-rule editorial motif (no figural mark). */
export function MarkMasthead({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 120 64" className={cn("h-16 w-28", className)} fill="none" aria-hidden>
      <line x1="6" y1="20" x2="114" y2="20" className="stroke-current" strokeWidth="1.5" />
      <line x1="6" y1="24" x2="114" y2="24" className="stroke-current" strokeWidth="0.8" />
      <text x="60" y="40" textAnchor="middle" className="fill-current" style={{ fontFamily: "var(--font-wordmark)", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase" as const }}>S · A</text>
      <line x1="6" y1="46" x2="114" y2="46" className="stroke-current" strokeWidth="0.8" />
      <line x1="6" y1="50" x2="114" y2="50" className="stroke-current" strokeWidth="1.5" />
      <circle cx="60" cy="48" r="1.2" className="fill-oxblood" />
    </svg>
  );
}

/** 6. Archive tab — a folder/file tab with a precision tick scale. */
export function MarkTab({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-16 w-16", className)} fill="none" aria-hidden>
      <path d="M10 20 H30 L34 14 H54 V50 H10 Z" className="stroke-current" strokeWidth="2.4" strokeLinejoin="round" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={16 + i * 5} y1="44" x2={16 + i * 5} y2={i === 3 ? 30 : 38} className={i === 3 ? "stroke-oxblood" : "stroke-current"} strokeWidth={i === 3 ? 2 : 1.2} />
      ))}
    </svg>
  );
}

export const LOGO_CONCEPTS: { id: string; name: string; note: string; Mark: (p: MarkProps) => JSX.Element }[] = [
  { id: "seal", name: "Archive Seal", note: "Museum-stamp ring with an SA monogram — authoritative, collector-grade.", Mark: MarkSeal },
  { id: "monogram", name: "Monogram Block", note: "Serif SA embossed in graphite — confident and modern-classic.", Mark: MarkMonogramBlock },
  { id: "index", name: "Index Card", note: "A filed card with a timeline notch — literal to the archive idea.", Mark: MarkIndexCard },
  { id: "masthead", name: "Editorial Masthead", note: "Double-rule newspaper masthead — quiet old-money restraint.", Mark: MarkMasthead },
  { id: "s", name: "S Emblem", note: "A single serif S in a fine ring — minimal and timeless.", Mark: MarkSEmblem },
  { id: "tab", name: "Archive Tab", note: "A folder tab with a precision scale — engineering-notebook feel.", Mark: MarkTab },
];
