import { formatCurrency, formatDate, formatMileage } from "@/lib/utils";
import { ArchiveLabel } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Wrench, Cog, FileText } from "lucide-react";
import type { DemoServiceEvent, DemoModification } from "@/lib/demo-data";

function groupByYear<T extends { date?: string; installDate?: string }>(items: T[], key: (t: T) => string | undefined) {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const y = key(it) ? new Date(key(it)!).getFullYear().toString() : "Undated";
    (map.get(y) ?? map.set(y, []).get(y)!).push(it);
  }
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

export function ServiceTimeline({ events }: { events: DemoServiceEvent[] }) {
  if (!events.length) return <EmptyTimeline label="No service records yet." />;
  const grouped = groupByYear(events, (e) => e.date);
  return (
    <div className="space-y-8">
      {grouped.map(([year, items]) => (
        <div key={year} className="grid gap-4 md:grid-cols-[80px_1fr]">
          <div className="font-serif text-2xl text-muted-foreground">{year}</div>
          <div className="space-y-3 border-l border-border pl-5">
            {items.sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((e, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-oxblood" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{e.summary}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatDate(e.date)}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 pl-6 text-sm text-muted-foreground">
                  <span>{e.vendor}</span>
                  <span>· {formatMileage(e.mileage)}</span>
                  {e.cost > 0 && <span>· {formatCurrency(e.cost)}</span>}
                  <Badge variant="muted">{e.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModificationTimeline({ mods }: { mods: DemoModification[] }) {
  if (!mods.length) return <EmptyTimeline label="No modifications recorded — owner reports stock." />;
  return (
    <div className="space-y-3">
      {mods.map((m, i) => (
        <div key={i} className="flex items-start justify-between gap-3 rounded-md border border-border bg-card/50 p-4">
          <div className="flex items-start gap-3">
            <Cog className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-muted-foreground">{m.brand} · {m.category}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={m.reversible === "reversible" ? "success" : "warning"}>{m.reversible}</Badge>
            <span className="text-xs text-muted-foreground">OEM retained: {m.oemRetained}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyTimeline({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-border p-8 text-center">
      <FileText className="mx-auto h-6 w-6 text-muted-foreground" />
      <ArchiveLabel className="mt-3 justify-center">{label}</ArchiveLabel>
    </div>
  );
}
