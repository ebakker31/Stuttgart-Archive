import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Interim wordmark while the final logo is being chosen (see /brand + the logo
 * options PDF). A clean Cormorant Garamond wordmark in ink/white with a hairline
 * rule — deliberately neutral. Will be replaced by the selected direction.
 * Original — no Porsche crest, logo, or official typography.
 */

/** Compact "SA" monogram for avatars / tight spaces + the favicon. */
export function ArchiveMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center font-serif font-semibold leading-none", className)} style={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-wordmark)" }} aria-hidden>
      SA
    </span>
  );
}

export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="Stuttgart Archive" className={cn("group inline-flex flex-col items-start leading-none", className)}>
      <span
        className="text-[1.5rem] font-semibold leading-none tracking-[0.01em] text-foreground"
        style={{ fontFamily: "var(--font-wordmark)" }}
      >
        Stuttgart Archive
      </span>
      <span className="mt-[7px] h-px w-full bg-foreground/20 transition-colors group-hover:bg-foreground/40" />
    </Link>
  );
}
