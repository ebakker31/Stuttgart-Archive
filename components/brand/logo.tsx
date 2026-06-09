import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Stuttgart Archive primary logo — the "Framed Nameplate": an elegant Cormorant
 * Garamond wordmark in Porsche-inspired carmine red, set inside a thin frame
 * with red corner ticks (museum object-label feel). Adapts to light/dark.
 * Entirely original — no Porsche crest, logo, or official typography.
 */

const TICKS = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];

/** Compact "SA" monogram for avatars/tight spaces + the favicon. */
export function ArchiveMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center justify-center font-semibold leading-none", className)}
      style={{ color: "var(--brand-red)", fontFamily: "var(--font-wordmark)" }}
      aria-hidden
    >
      SA
    </span>
  );
}

export function Wordmark({
  className,
  href = "/",
  subtitle = true,
  frame = true,
}: {
  className?: string;
  href?: string;
  subtitle?: boolean;
  frame?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex", className)}>
      <span className={cn("relative inline-flex flex-col items-center px-4 py-2", frame && "border border-foreground/25")}>
        <span className="wordmark whitespace-nowrap text-xl leading-none">Stuttgart Archive</span>
        {subtitle && <span className="archive-label mt-1.5 text-[0.5rem] text-muted-foreground">Est. for the marque</span>}
        {frame &&
          TICKS.map((pos) => (
            <span key={pos} className={cn("pointer-events-none absolute h-[7px] w-[7px]", pos)} style={{ borderColor: "var(--brand-red)" }} />
          ))}
      </span>
    </Link>
  );
}
