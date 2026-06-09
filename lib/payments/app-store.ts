import { config } from "@/lib/config";
import type {
  CheckoutSessionRequest,
  CheckoutSessionResult,
  PaymentProvider,
} from "./types";

/**
 * App Store In-App Purchase provider — PLACEHOLDER for a future native iOS app.
 *
 * The web app does NOT process App Store purchases. This file exists so the
 * entitlements layer can treat StoreKit purchases identically to Stripe ones.
 * When a native iOS app ships, it will:
 *   1. Present StoreKit products (see APP_STORE_PRODUCT_IDS below).
 *   2. Send the signed transaction / receipt to a verification endpoint.
 *   3. The server validates with Apple (App Store Server API) using
 *      APP_STORE_SHARED_SECRET and grants the matching entitlement via
 *      grantEntitlementFromAppStore() in entitlements.ts.
 *
 * See the README "Future iOS payment setup" section for the full flow.
 */

/** Product identifiers reserved for future App Store configuration. */
export const APP_STORE_PRODUCT_IDS = {
  // Auto-renewable subscriptions
  plus: "com.stuttgartarchive.plus.monthly",
  collector: "com.stuttgartarchive.collector.monthly",
  dealer: "com.stuttgartarchive.dealer.monthly",
  // Non-consumable, per-vehicle one-time products
  sellerPack: "com.stuttgartarchive.sellerpack",
  auctionPack: "com.stuttgartarchive.auctionpack",
} as const;

export interface AppStoreReceiptValidationRequest {
  signedTransaction: string; // StoreKit 2 JWS
  organizationId: string;
  userId: string;
  vehicleId?: string;
}

export const appStoreProvider: PaymentProvider = {
  id: "app_store",

  async createCheckoutSession(_req: CheckoutSessionRequest): Promise<CheckoutSessionResult> {
    // Not applicable on web — purchases happen inside the native app via StoreKit.
    return {
      url: null,
      sessionId: "appstore_native_only",
      mocked: true,
    };
  },

  async createBillingPortalSession() {
    // Apple manages subscriptions in the device Settings app.
    return { url: null, mocked: true };
  },
};

/**
 * Placeholder receipt validation. Wire this to Apple's App Store Server API
 * when the native app exists. Returns false until implemented so no
 * entitlement can be granted from an unverified receipt.
 */
export async function validateAppStoreReceipt(
  _req: AppStoreReceiptValidationRequest
): Promise<{ valid: boolean; reason: string }> {
  if (!config.appStore.sharedSecret) {
    return { valid: false, reason: "APP_STORE_SHARED_SECRET not configured (web-only build)." };
  }
  // TODO(native-ios): verify JWS signature + call Apple's verifyReceipt / Server API.
  return { valid: false, reason: "App Store validation not implemented in web MVP." };
}
