import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArchiveLabel, Separator } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { PLANS, ONE_TIME_PRODUCTS } from "@/lib/payments/plans";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <ArchiveLabel className="justify-center">Pricing</ArchiveLabel>
        <h1 className="mt-4 display text-5xl">Free to start. Built to grow with you.</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          The core archive is free forever. Upgrade for more capacity, advanced tools, and
          per-vehicle listing packs — only when you need them.
        </p>
      </div>

      {/* Subscription plans */}
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <Card key={p.id} className={p.highlight ? "border-oxblood/40 shadow-archive-lg" : ""}>
            <CardContent className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl">{p.name}</span>
                {p.highlight && <Badge variant="accent">Free</Badge>}
              </div>
              <div className="mt-2 text-3xl font-light">{p.priceLabel}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {p.vehicleLimit === Infinity ? "Unlimited vehicles" : `Up to ${p.vehicleLimit} vehicles`}
              </p>
              <Separator className="my-5" />
              <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-oxblood" /> {f}</li>
                ))}
              </ul>
              <Button
                href={p.id === "concierge" ? "/book-demo" : "/signup"}
                variant={p.highlight ? "accent" : "outline"}
                className="mt-6 w-full"
              >
                {p.id === "free" ? "Start free" : p.id === "concierge" ? "Contact us" : `Choose ${p.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* One-time per-vehicle products */}
      <div className="mt-16">
        <ArchiveLabel>Per-vehicle packs</ArchiveLabel>
        <h2 className="mt-3 display text-3xl">One-time upgrades for a specific car.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {ONE_TIME_PRODUCTS.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-xl">{p.name}</span>
                  <span className="text-lg font-light">{p.priceLabel}</span>
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-oxblood" /> {f}</li>
                  ))}
                </ul>
                <Button href="/signup" variant="outline" className="mt-6">Get the {p.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-2xl rounded-md border border-border bg-card/50 p-5 text-center">
        <p className="text-sm text-foreground/80">
          <span className="font-medium">Selling a car?</span> Listing is free — the buyer pays a transparent 5%
          premium (min $250, max $5,000) only at a successful sale, with the car payment handled via licensed
          escrow. <a href="/selling" className="text-oxblood hover:underline">How buying &amp; selling works →</a>
        </p>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
        Payments are processed securely by Stripe on the web. In-app purchases on a future iOS app will be
        handled by the App Store. You can manage or cancel any subscription from your billing settings.
      </p>
    </div>
  );
}
