import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Stuttgart Archive logo — editorial masthead (chosen direction #1).
 * "STUTTGART ARCHIVE" in Cormorant Garamond spaced capitals between two fine
 * rules, ink on light / white on dark. Single-serif, restrained, auction-house.
 * Original — no Porsche crest, logo, or official typography.
 */

/** Compact "SA" mini-masthead for avatars / tight spaces (echoes the favicon). */
export function ArchiveMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-stretch leading-none", className)} aria-hidden>
      <span className="h-px bg-foreground/30" />
      <span className="my-[3px] text-center font-serif text-sm font-semibold tracking-[0.12em] text-foreground" style={{ fontFamily: "var(--font-wordmark)" }}>SA</span>
      <span className="h-px bg-foreground/30" />
    </span>
  );
}

export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="Stuttgart Archive" className={cn("group inline-flex flex-col items-stretch leading-none", className)}>
      <span className="h-px bg-foreground/30 transition-colors group-hover:bg-foreground/50" />
      <span
        className="my-[6px] text-center text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-foreground"
        style={{ fontFamily: "var(--font-wordmark)", textIndent: "0.2em" }}
      >
        Stuttgart Archive
      </span>
      <span className="h-px bg-foreground/30 transition-colors group-hover:bg-foreground/50" />
    </Link>
  );
}
