import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Stuttgart Archive primary logo. An elegant Cormorant Garamond wordmark
 * (ink on light, white on dark) with a single Porsche-inspired carmine
 * "heritage bar" beneath it and a quiet, descriptive line. Clean, tasteful,
 * and original — no Porsche crest, logo, or official typography.
 */

/** Compact "SA" monogram for avatars/tight spaces + the favicon. */
export function ArchiveMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)} aria-hidden>
      <span className="font-semibold" style={{ fontFamily: "var(--font-wordmark)", color: "hsl(var(--foreground))" }}>SA</span>
      <span className="mt-0.5 h-[2px] w-4 rounded-[1px]" style={{ background: "var(--brand-red)" }} />
    </span>
  );
}

export function Wordmark({
  className,
  href = "/",
  subtitle = true,
}: {
  className?: string;
  href?: string;
  subtitle?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="wordmark text-[1.6rem] leading-none">Stuttgart Archive</span>
      {/* Porsche-inspired heritage bar */}
      <span className="mt-2 flex items-center gap-2.5">
        <span className="h-[3px] w-9 rounded-[1px] transition-all group-hover:w-12" style={{ background: "var(--brand-red)" }} />
        {subtitle && <span className="archive-label text-[0.5rem] text-muted-foreground">An independent Porsche archive</span>}
      </span>
    </Link>
  );
}
