import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Original Stuttgart Archive wordmark + mark. The mark is an abstract archival
 * motif — a filed index card with a timeline notch — NOT derived from any
 * official Porsche crest, logo, or typography.
 */
export function ArchiveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="25" height="21" rx="2" className="stroke-current" strokeWidth="1.6" />
      <line x1="3.5" y1="11.5" x2="28.5" y2="11.5" className="stroke-current" strokeWidth="1.6" />
      <line x1="16" y1="11.5" x2="16" y2="26.5" className="stroke-oxblood" strokeWidth="1.6" />
      <circle cx="16" cy="18.5" r="1.7" className="fill-oxblood" />
    </svg>
  );
}

export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <ArchiveMark className="text-graphite dark:text-parchment" />
      <span className="flex flex-col leading-none">
        <span className="wordmark text-xl">Stuttgart Archive</span>
        <span className="archive-label mt-1 text-[0.56rem]">Est. for the marque</span>
      </span>
    </Link>
  );
}
