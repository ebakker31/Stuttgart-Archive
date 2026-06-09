import { getAppSession } from "@/lib/app-data";
import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentButton } from "@/components/payment-button";
import { PLANS, ONE_TIME_PRODUCTS } from "@/lib/payments/plans";
import { config } from "@/lib/config";
import { CheckCircle2 } from "lucide-react";

export default async function BillingPage({ searchParams }: { searchParams: { mock_checkout?: string; plan?: string; product?: string } }) {
  const session = await getAppSession();
  const justUpgraded = searchParams.mock_checkout === "1";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <ArchiveLabel>Billing</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Your plan.</h1>
        <p className="mt-2 text-muted-foreground">
          {config.stripe.enabled ? "Payments are processed securely by Stripe." : "Stripe is in mock mode — checkout flows are testable without keys."}
        </p>
      </div>

      {justUpgraded && (
        <div className="rounded-md border border-emerald-600/30 bg-emerald-600/5 p-4 text-sm text-emerald-700 dark:text-emerald-400">
          Mock checkout complete for <strong>{searchParams.plan || searchParams.product}</strong>. With live Stripe keys, the webhook would grant the matching entitlement.
        </div>
      )}

      <Card className="border-oxblood/30"><CardContent className="flex items-center justify-between p-6">
        <div><ArchiveLabel className="text-oxblood">Current plan</ArchiveLabel><div className="mt-1 font-serif text-2xl">Free</div><p className="text-sm text-muted-foreground">3 vehicles · basic tools · 10 AI generations/mo</p></div>
        <Badge variant="accent">Active</Badge>
      </CardContent></Card>

      <section>
        <ArchiveLabel>Upgrade</ArchiveLabel>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {PLANS.filter((p) => ["plus", "collector", "dealer"].includes(p.id)).map((p) => (
            <Card key={p.id}><CardContent className="flex h-full flex-col p-5">
              <div className="font-serif text-xl">{p.name}</div>
              <div className="mt-1 text-2xl font-light">{p.priceLabel}</div>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted-foreground">{p.features.slice(0, 4).map((f) => <li key={f} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-oxblood" /> {f}</li>)}</ul>
              <div className="mt-5"><PaymentButton plan={p.id} label={`Upgrade to ${p.name}`} /></div>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <section>
        <ArchiveLabel>Per-vehicle packs</ArchiveLabel>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {ONE_TIME_PRODUCTS.map((p) => (
            <Card key={p.id}><CardContent className="flex items-center justify-between p-5">
              <div><div className="font-serif text-lg">{p.name}</div><div className="text-sm text-muted-foreground">{p.priceLabel}</div></div>
              <PaymentButton product={p.id} vehicleId="demo" label="Purchase" variant="outline" />
            </CardContent></Card>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground">Manage or cancel subscriptions anytime via the Stripe customer portal (available with live keys).</p>
    </div>
  );
}
