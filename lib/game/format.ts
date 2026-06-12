/** Compact number + duration formatting for the Lumengarden HUD. */

const UNITS = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];

/** 950 → "950", 1234 → "1.23K", 5_400_000 → "5.4M". */
export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "∞";
  const sign = n < 0 ? "-" : "";
  let v = Math.abs(n);
  if (v < 1000) return sign + Math.floor(v).toString();
  let u = 0;
  while (v >= 1000 && u < UNITS.length - 1) {
    v /= 1000;
    u += 1;
  }
  const digits = v < 10 ? 2 : v < 100 ? 1 : 0;
  return sign + v.toFixed(digits) + UNITS[u];
}

/** Milliseconds → "1h 02m", "4m 10s", "9s". */
export function fmtDuration(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}
