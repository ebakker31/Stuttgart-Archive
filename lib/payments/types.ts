/**
 * Payment + entitlement type system, shared by the Stripe (web) and
 * App Store (future iOS) providers. The app reasons about *entitlements*,
 * never about a specific payment processor, so a purchase from either source
 * grants the same capabilities.
 */

export type PlanId = "free" | "plus" | "collector" | "dealer" | "concierge";

export type OneTimeProductId = "seller_pack" | "auction_pack";

export type EntitlementSource = "free" | "stripe" | "app_store" | "admin";

export type EntitlementType =
  | "plan:free"
  | "plan:plus"
  | "plan:collector"
  | "plan:dealer"
  | "plan:concierge"
  | "product:seller_pack" // per-vehicle
  | "product:auction_pack"; // per-vehicle

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceLabel: string;
  cadence: "free" | "monthly" | "one_time";
  vehicleLimit: number; // Infinity allowed
  documentUploadLimit: number;
  storageLimitMb: number;
  aiGenerationLimit: number; // per month
  features: string[];
  highlight?: boolean;
}

export interface OneTimeProductDefinition {
  id: OneTimeProductId;
  name: string;
  priceLabel: string;
  amountCents: number;
  perVehicle: true;
  features: string[];
}

export interface CheckoutSessionRequest {
  organizationId: string;
  userId: string;
  email?: string;
  /** A subscription plan OR a one-time product. */
  plan?: PlanId;
  product?: OneTimeProductId;
  /** Required for per-vehicle one-time products. */
  vehicleId?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  url: string | null;
  sessionId: string;
  mocked: boolean;
}

export interface Entitlement {
  type: EntitlementType;
  source: EntitlementSource;
  vehicleId?: string | null;
  startsAt: string;
  expiresAt?: string | null;
  metadata?: Record<string, unknown>;
}

/** A payment provider — Stripe today, App Store later — implements this. */
export interface PaymentProvider {
  readonly id: "stripe" | "app_store";
  createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResult>;
  createBillingPortalSession(args: { customerId: string; returnUrl: string }): Promise<{ url: string | null; mocked: boolean }>;
}
