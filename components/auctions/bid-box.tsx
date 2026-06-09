"use client";

import { useState } from "react";
import { Countdown } from "@/components/auctions/countdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calcBuyerPremium, MARKETPLACE } from "@/lib/marketplace";
import { formatCurrency } from "@/lib/utils";
import { Heart, Gavel } from "lucide-react";

/**
 * BaT/Sotheby's-style bid box. Optimistic in demo mode; with a backend it would
 * POST a bid (authenticated, validated against the current high bid). Shows the
 * transparent buyer's premium and watch control.
 */
export function BidBox({
  endsAt,
  startingBid,
  initialBids,
  reserve,
  reserveMet,
  watchers,
}: {
  endsAt: number;
  startingBid: number;
  initialBids: number;
  reserve: "reserve" | "no_reserve";
  reserveMet: boolean;
  watchers: number;
}) {
  const [bid, setBid] = useState(startingBid);
  const [count, setCount] = useState(initialBids);
  const [amount, setAmount] = useState("");
  const [watching, setWatching] = useState(false);
  const [watchCount, setWatchCount] = useState(watchers);
  const [note, setNote] = useState<string | null>(null);

  const minNext = bid + 500;
  const premium = calcBuyerPremium(bid);

  function placeBid(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(String(amount).replace(/[^\d.]/g, ""));
    if (!v || v < minNext) {
      setNote(`Enter at least ${formatCurrency(minNext)}.`);
      return;
    }
    setBid(v);
    setCount((c) => c + 1);
    setAmount("");
    setNote("Bid placed (demo). Sign in to bid for real.");
  }

  return (
    <div className="rounded-md border border-border bg-card p-5 shadow-archive">
      <div className="flex items-center justify-between">
        <div>
          <div className="archive-label">Current bid</div>
          <div className="font-serif text-4xl text-oxblood">{formatCurrency(bid)}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{count} bids</div>
        </div>
        <Badge variant={reserve === "no_reserve" ? "success" : reserveMet ? "success" : "warning"}>
          {reserve === "no_reserve" ? "No reserve" : reserveMet ? "Reserve met" : "Reserve not met"}
        </Badge>
      </div>

      <div className="mt-5 rounded-md border border-border bg-background/50 p-3">
        <div className="archive-label mb-2 text-center">Time left</div>
        <Countdown endsAt={endsAt} className="justify-center" />
      </div>

      <form onSubmit={placeBid} className="mt-5 space-y-2">
        <div className="flex gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={formatCurrency(minNext)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" variant="accent" className="h-11 shrink-0"><Gavel className="h-4 w-4" /> Place bid</Button>
        </div>
        <p className="text-xs text-muted-foreground">Minimum next bid {formatCurrency(minNext)}.</p>
        {note && <p className="text-xs text-oxblood">{note}</p>}
      </form>

      <button onClick={() => { setWatching((w) => !w); setWatchCount((c) => c + (watching ? -1 : 1)); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2 text-sm hover:bg-muted">
        <Heart className={watching ? "h-4 w-4 fill-oxblood text-oxblood" : "h-4 w-4"} /> {watching ? "Watching" : "Watch"} · {watchCount}
      </button>

      <div className="mt-4 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
        If you win, a buyer's premium of <span className="font-medium text-foreground">{formatCurrency(premium)}</span>{" "}
        ({MARKETPLACE.buyerPremiumRate * 100}%, {formatCurrency(MARKETPLACE.buyerPremiumMin)}–{formatCurrency(MARKETPLACE.buyerPremiumMax)}) applies.
        The car payment is handled via {MARKETPLACE.escrowPartner} — never by Stuttgart Archive.
      </div>
    </div>
  );
}
