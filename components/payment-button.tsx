"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Starts a Stripe Checkout session (or mock) for a plan or one-time product. */
export function PaymentButton({
  plan, product, vehicleId, label, variant = "accent",
}: {
  plan?: string; product?: string; vehicleId?: string; label: string;
  variant?: "accent" | "outline" | "default";
}) {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, product, vehicleId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }
  return <Button variant={variant} onClick={go} disabled={loading}>{loading ? "Redirecting…" : label}</Button>;
}
