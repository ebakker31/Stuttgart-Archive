"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** A labeled toggle. In demo mode it updates locally; with a backend it would PATCH settings. */
export function ToggleSetting({
  label, description, defaultOn, locked,
}: {
  label: string; description?: string; defaultOn?: boolean; locked?: boolean;
}) {
  const [on, setOn] = useState(Boolean(defaultOn));
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        disabled={locked}
        onClick={() => !locked && setOn((v) => !v)}
        aria-pressed={on}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          on ? "border-oxblood bg-oxblood" : "border-border bg-muted",
          locked && "cursor-not-allowed opacity-60"
        )}
      >
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", on ? "left-[22px]" : "left-0.5")} />
      </button>
    </div>
  );
}
