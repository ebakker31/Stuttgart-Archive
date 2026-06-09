import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { config } from "@/lib/config";
import { grantEntitlement } from "@/lib/payments/entitlements";
import { getAdminSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/service";
import type { EntitlementType, PlanId, OneTimeProductId } from "@/lib/payments/types";

/**
 * Stripe webhook. Verifies the signature, then syncs subscription status and
 * grants source-agnostic entitlements. Returns 200 in mock mode so the route is
 * deployable without keys.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !config.stripe.webhookSecret) {
    return NextResponse.json({ received: true, mocked: true });
  }

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, config.stripe.webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  const admin = getAdminSupabase();

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as any;
      const orgId = s.metadata?.organization_id;
      const userId = s.metadata?.user_id;
      const plan = s.metadata?.plan as PlanId | "";
      const product = s.metadata?.product as OneTimeProductId | "";
      const vehicleId = s.metadata?.vehicle_id || null;

      if (orgId) {
        if (plan) {
          await grantEntitlement({ organizationId: orgId, userId, type: `plan:${plan}` as EntitlementType, source: "stripe" });
          if (admin) {
            await admin.from("subscriptions").upsert({
              organization_id: orgId, stripe_customer_id: s.customer, stripe_subscription_id: s.subscription,
              status: "active", plan, updated_at: new Date().toISOString(),
            }, { onConflict: "organization_id" } as any);
          }
        } else if (product) {
          await grantEntitlement({ organizationId: orgId, userId, type: `product:${product}` as EntitlementType, source: "stripe", vehicleId });
          if (admin) {
            await admin.from("purchases").insert({
              organization_id: orgId, user_id: userId, vehicle_id: vehicleId,
              product_type: product, stripe_payment_intent_id: s.payment_intent, amount: (s.amount_total ?? 0) / 100, status: "completed",
            });
          }
        }
        if (s.customer_details?.email) {
          await sendEmail({ to: s.customer_details.email, template: plan ? "upgrade_confirmation" : "payment_receipt", organizationId: orgId, data: { plan, item: product || plan, amount: `$${((s.amount_total ?? 0) / 100).toFixed(2)}`, date: new Date().toLocaleDateString() } });
        }
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      if (admin) {
        await admin.from("subscriptions").update({ status: sub.status, current_period_end: new Date(sub.current_period_end * 1000).toISOString(), updated_at: new Date().toISOString() }).eq("stripe_subscription_id", sub.id);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
