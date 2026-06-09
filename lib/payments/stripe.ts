import Stripe from "stripe";
import { config } from "@/lib/config";
import type {
  CheckoutSessionRequest,
  CheckoutSessionResult,
  PaymentProvider,
  PlanId,
  OneTimeProductId,
} from "./types";

/**
 * Stripe (web) payment provider.
 *
 * Runs in MOCK MODE when STRIPE_SECRET_KEY is absent: createCheckoutSession
 * returns a local stub URL so the upgrade flow is fully clickable in dev/CI
 * without real keys. Webhook handling lives in app/api/stripe/webhook.
 */

let _stripe: Stripe | null = null;
export function getStripe(): Stripe | null {
  if (!config.stripe.enabled) return null;
  if (!_stripe) {
    _stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2024-10-28.acacia" as Stripe.LatestApiVersion });
  }
  return _stripe;
}

function priceIdForPlan(plan: PlanId): string | null {
  switch (plan) {
    case "plus":
      return config.stripe.prices.plus || null;
    case "collector":
      return config.stripe.prices.collector || null;
    case "dealer":
      return config.stripe.prices.dealer || null;
    default:
      return null; // free / concierge are not self-serve Stripe subscriptions
  }
}

function priceIdForProduct(product: OneTimeProductId): string | null {
  switch (product) {
    case "seller_pack":
      return config.stripe.prices.sellerPack || null;
    case "auction_pack":
      return config.stripe.prices.auctionPack || null;
  }
}

export const stripeProvider: PaymentProvider = {
  id: "stripe",

  async createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResult> {
    const stripe = getStripe();

    // Mock mode: return a stub so the UI flow is testable end-to-end.
    if (!stripe) {
      const fakeId = `cs_mock_${Date.now()}`;
      const target = req.plan ? `plan=${req.plan}` : `product=${req.product}`;
      return {
        url: `${config.appUrl}/app/billing?mock_checkout=1&${target}${req.vehicleId ? `&vehicle=${req.vehicleId}` : ""}`,
        sessionId: fakeId,
        mocked: true,
      };
    }

    const isSubscription = Boolean(req.plan);
    const priceId = req.plan ? priceIdForPlan(req.plan) : req.product ? priceIdForProduct(req.product) : null;
    if (!priceId) {
      // Missing configured price -> mock fallback rather than crashing checkout.
      return {
        url: `${config.appUrl}/app/billing?missing_price=1`,
        sessionId: "cs_missing_price",
        mocked: true,
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      customer_email: req.email,
      client_reference_id: req.organizationId,
      metadata: {
        organization_id: req.organizationId,
        user_id: req.userId,
        plan: req.plan ?? "",
        product: req.product ?? "",
        vehicle_id: req.vehicleId ?? "",
      },
      // Trial support: applied automatically if the Stripe Price has a trial.
      allow_promotion_codes: true,
    });

    return { url: session.url, sessionId: session.id, mocked: false };
  },

  async createBillingPortalSession({ customerId, returnUrl }) {
    const stripe = getStripe();
    if (!stripe) {
      return { url: `${config.appUrl}/app/billing?mock_portal=1`, mocked: true };
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: portal.url, mocked: false };
  },
};
