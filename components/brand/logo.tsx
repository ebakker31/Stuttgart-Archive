import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Stuttgart Archive logo — the wordmark + Guards Red line + slogan.
 * "Stuttgart Archive" in Cormorant Garamond (ink on light / white on dark),
 * underlined by a single Guards Red (Indischrot) line — the most authentic
 * Porsche colour — with a small heritage slogan beneath. The chosen chrome
 * emblem (see brand options) is used for the favicon / avatars.
 * Original — no Porsche crest, logo, or official typography.
 */

/** Compact "SA" monogram for avatars / tight spaces. */
export function ArchiveMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)} aria-hidden>
      <span className="font-semibold" style={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-wordmark)" }}>SA</span>
      <span className="mt-0.5 h-[2px] w-4" style={{ background: "var(--brand-red)" }} />
    </span>
  );
}

export function Wordmark({ className, href = "/", slogan = true }: { className?: string; href?: string; slogan?: boolean }) {
  return (
    <Link href={href} aria-label="Stuttgart Archive" className={cn("group inline-flex flex-col items-stretch leading-none", className)}>
      <span className="text-center text-[1.55rem] font-semibold leading-none tracking-[0.01em] text-foreground" style={{ fontFamily: "var(--font-wordmark)" }}>
        Stuttgart Archive
      </span>
      <span className="mt-[7px] h-[3px] w-full transition-all" style={{ background: "var(--brand-red)" }} />
      {slogan && <span className="archive-label mt-[7px] text-center text-[0.5rem] text-muted-foreground">Preserve the story behind the machine</span>}
    </Link>
  );
}
