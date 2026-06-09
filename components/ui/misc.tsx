import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-oxblood transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}

/** Small-caps archival label used for metadata and section eyebrows. */
export function ArchiveLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("archive-label", className)}>{children}</div>;
}

/** Museum-style caption: serif italic with a fine rule. */
export function MuseumCaption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("border-l-2 border-oxblood/40 pl-3 font-serif text-sm italic text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="archive-label">{label}</div>
      <div className="mt-1 font-serif text-lg">{value}</div>
    </div>
  );
}

/** Small Porsche-red diamond — the brand's through-line accent. */
export function Diamond({ className }: { className?: string }) {
  return <span className={cn("inline-block h-[5px] w-[5px] rotate-45", className)} style={{ background: "var(--brand-red)" }} aria-hidden />;
}

/** Section eyebrow: red diamond + tracked small-caps label (echoes the logo). */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Diamond />
      <span className="archive-label">{children}</span>
    </div>
  );
}

/** Hairline divider centred on a red diamond (echoes the wordmark rule). */
export function DiamondRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <Diamond className="h-[6px] w-[6px]" />
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
