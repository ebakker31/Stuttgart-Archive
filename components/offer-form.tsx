"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { calcBuyerPremium, MARKETPLACE } from "@/lib/marketplace";
import { formatCurrency } from "@/lib/utils";

/**
 * Make-an-offer form for a for-sale vehicle. Submits to /api/offers. No reply is
 * sent automatically — the seller reviews and responds. Shows the transparent
 * buyer's premium so there are no surprises at close.
 */
export function OfferForm({ vehicle, askingPrice }: { vehicle: string; askingPrice?: number }) {
  const [amount, setAmount] = useState(askingPrice ? String(askingPrice) : "");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const numericAmount = Number(String(amount).replace(/[^\d.]/g, "")) || 0;
  const premium = calcBuyerPremium(numericAmount || askingPrice || 0);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle, amount: numericAmount,
          name: fd.get("name"), email: fd.get("email"), message: fd.get("message"),
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="rounded-md border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">Offer sent. The seller will review and respond directly.</p>;
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div>
        <Label htmlFor="offer-amount">Your offer</Label>
        <Input id="offer-amount" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$" required className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label htmlFor="offer-name">Name</Label><Input id="offer-name" name="name" required className="mt-1" /></div>
        <div><Label htmlFor="offer-email">Email</Label><Input id="offer-email" name="email" type="email" required className="mt-1" /></div>
      </div>
      <div><Label htmlFor="offer-msg">Message (optional)</Label><Textarea id="offer-msg" name="message" rows={2} className="mt-1" /></div>

      <div className="rounded-md border border-border bg-background/50 p-3 text-xs text-muted-foreground">
        If accepted, a buyer's premium of <span className="font-medium text-foreground">{formatCurrency(premium)}</span> ({MARKETPLACE.buyerPremiumRate * 100}% of sale price, {formatCurrency(MARKETPLACE.buyerPremiumMin)}–{formatCurrency(MARKETPLACE.buyerPremiumMax)}) applies. The car payment is handled via {MARKETPLACE.escrowPartner}, not by Stuttgart Archive.
      </div>

      <Button type="submit" variant="accent" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Submit offer"}
      </Button>
      {status === "error" && <p className="text-xs text-oxblood">Something went wrong — try again.</p>}
    </form>
  );
}
