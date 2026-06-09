import type { Metadata } from "next";
import { ArchiveLabel, Separator } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEAL_STAGES, MARKETPLACE, calcBuyerPremium } from "@/lib/marketplace";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, ScrollText, Banknote } from "lucide-react";

export const metadata: Metadata = {
  title: "How buying & selling works",
  description: "List free, sell with confidence: documented listings, offers, escrow handoff, and a transparent buyer's premium.",
};

const SAMPLE_PRICES = [45000, 92000, 150000, 250000];

export default function SellingPage() {
  return (
    <div>
      <section className="border-b border-border bg-card/40">
        <div className="container py-16">
          <ArchiveLabel>Buying & selling</ArchiveLabel>
          <h1 className="mt-4 display text-5xl">List free. Sell with confidence.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Stuttgart Archive connects documented sellers with serious buyers. You list for free; the buyer pays
            a transparent premium only when a car actually sells. The car payment moves through a licensed
            escrow partner — never through us.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/signup" variant="accent">List your Porsche — free</Button>
            <Button href="/explore" variant="outline">Browse what's for sale</Button>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="border-b border-border">
        <div className="container grid gap-6 py-14 md:grid-cols-3">
          {[
            { icon: ScrollText, t: "Documented listings", d: "Every listing is backed by the seller's real records, with claims verified and flaws disclosed. Buyers trust what they can see." },
            { icon: ShieldCheck, t: "Escrow, not us", d: `Funds move through ${MARKETPLACE.escrowPartner}. Stuttgart Archive never holds the car payment, so your money is protected by a licensed third party.` },
            { icon: Banknote, t: "Transparent fee", d: `Free to list. The buyer pays ${MARKETPLACE.buyerPremiumRate * 100}% (min ${formatCurrency(MARKETPLACE.buyerPremiumMin)}, max ${formatCurrency(MARKETPLACE.buyerPremiumMax)}) only at a successful sale.` },
          ].map((p) => (
            <Card key={p.t}><CardContent className="p-6">
              <p.icon className="h-6 w-6 text-oxblood" />
              <h3 className="mt-4 font-serif text-xl">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      {/* Deal stages */}
      <section className="border-b border-border">
        <div className="container py-16">
          <ArchiveLabel>How a sale flows</ArchiveLabel>
          <h2 className="mt-3 display text-4xl">From offer to title transfer.</h2>
          <div className="mt-10 space-y-5">
            {DEAL_STAGES.map((s, i) => (
              <div key={s.id} className="grid gap-4 md:grid-cols-[60px_1fr]">
                <div className="font-serif text-3xl text-oxblood/30">{String(i + 1).padStart(2, "0")}</div>
                <div className="border-l border-border pl-5">
                  <div className="font-serif text-xl">{s.label}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee table */}
      <section className="border-b border-border bg-card/40">
        <div className="container py-16">
          <ArchiveLabel>The math</ArchiveLabel>
          <h2 className="mt-3 display text-4xl">No surprises at the finish line.</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Sellers keep the full sale price. Here's the buyer's premium at a few price points.</p>
          <Card className="mt-8 max-w-lg"><CardContent className="p-0">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-4 font-normal">Sale price</th><th className="p-4 font-normal">Buyer's premium</th><th className="p-4 font-normal">Buyer pays</th></tr></thead>
              <tbody>
                {SAMPLE_PRICES.map((price) => {
                  const fee = calcBuyerPremium(price);
                  return (
                    <tr key={price} className="border-b border-border last:border-0">
                      <td className="p-4 font-serif">{formatCurrency(price)}</td>
                      <td className="p-4 text-oxblood">{formatCurrency(fee)}</td>
                      <td className="p-4 text-muted-foreground">{formatCurrency(price + fee)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent></Card>
          <p className="mt-4 text-xs text-muted-foreground">Seller listing fee: {formatCurrency(MARKETPLACE.listingFee)}. Dealers and brokers have dedicated plans with bulk tools and branded pages.</p>
        </div>
      </section>

      <section>
        <div className="container py-16 text-center">
          <h2 className="mx-auto max-w-2xl display text-4xl">Ready to list — or just to get organized?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Build the archive first. When you're ready to sell, the packet, the page, and the buyers are already there.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Button href="/signup" variant="accent" size="lg">Start free</Button>
            <Button href="/pricing" variant="outline" size="lg">See plans & packs</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
