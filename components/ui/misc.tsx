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
