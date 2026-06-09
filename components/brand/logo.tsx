import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Stuttgart Archive primary logo — elevated, heritage-grade.
 *
 * Stacked spaced-capitals ("STUTTGART / ARCHIVE") in Cormorant Garamond,
 * ink on light / white on dark, divided by a hairline rule centred on a single
 * small Porsche-red diamond (a restrained "registration mark"). No tagline or
 * bar in the lockup — the mark stands alone, auction-house style. The shorter
 * word is tracked wider so both lines optically align. Entirely original.
 */

/** Compact "SA" monogram for avatars / tight spaces + the favicon. */
export function ArchiveMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)} aria-hidden>
      <span className="font-serif font-semibold tracking-wide" style={{ color: "hsl(var(--foreground))" }}>SA</span>
      <span className="mt-0.5 h-[3px] w-[3px] rotate-45" style={{ background: "var(--brand-red)" }} />
    </span>
  );
}

export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="Stuttgart Archive" className={cn("group inline-flex flex-col items-center leading-none", className)}>
      <span className="font-serif text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-foreground">Stuttgart</span>
      <span className="my-[5px] flex w-full items-center gap-1.5">
        <span className="h-px flex-1 bg-foreground/25" />
        <span className="h-[5px] w-[5px] shrink-0 rotate-45" style={{ background: "var(--brand-red)" }} />
        <span className="h-px flex-1 bg-foreground/25" />
      </span>
      <span className="font-serif text-[0.95rem] font-semibold uppercase tracking-[0.42em] text-foreground" style={{ textIndent: "0.42em" }}>Archive</span>
    </Link>
  );
}
