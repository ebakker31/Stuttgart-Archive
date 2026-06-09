"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

/** Live auction countdown. `endsAt` is epoch ms. Turns urgent under 1 hour. */
export function Countdown({ endsAt, className, compact = false }: { endsAt: number; className?: string; compact?: boolean }) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = endsAt - now;
  const { d, h, m, s } = parts(left);
  const urgent = left > 0 && left < 3600_000;
  const ended = left <= 0;

  if (ended) return <span className={cn("font-medium text-muted-foreground", className)}>Auction ended</span>;

  if (compact) {
    const label = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
    return <span className={cn(urgent ? "text-oxblood" : "text-foreground", "tabular-nums font-medium", className)}>{label}</span>;
  }

  const Box = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center">
      <span className={cn("font-serif text-2xl tabular-nums", urgent && "text-oxblood")}>{String(v).padStart(2, "0")}</span>
      <span className="archive-label">{l}</span>
    </div>
  );

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {d > 0 && <Box v={d} l="days" />}
      <Box v={h} l="hrs" />
      <Box v={m} l="min" />
      <Box v={s} l="sec" />
    </div>
  );
}
