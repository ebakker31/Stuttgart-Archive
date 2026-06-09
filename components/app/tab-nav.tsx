import Link from "next/link";
import { cn } from "@/lib/utils";

export function TabNav({ base, active, tabs }: { base: string; active: string; tabs: [string, string][] }) {
  return (
    <div className="-mb-px flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map(([id, label]) => (
        <Link
          key={id}
          href={id === "overview" ? base : `${base}?tab=${id}`}
          className={cn(
            "whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm transition-colors",
            active === id ? "border-oxblood font-medium text-oxblood" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
