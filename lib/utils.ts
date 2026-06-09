import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined, currency = "USD") {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMileage(miles: number | null | undefined) {
  if (miles === null || miles === undefined) return "—";
  return `${new Intl.NumberFormat("en-US").format(miles)} mi`;
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Mask a VIN per the vehicle's public mode. */
export function maskVin(vin: string | null | undefined, mode: "hidden" | "partial" | "full") {
  if (!vin) return "—";
  if (mode === "full") return vin;
  if (mode === "partial") return `${vin.slice(0, 3)}••••••${vin.slice(-4)}`;
  return "Hidden by owner";
}
