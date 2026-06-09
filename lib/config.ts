/**
 * Central runtime configuration + integration mode detection.
 * Every external integration degrades to a clearly-labeled mock mode when its
 * credentials are absent, so the product builds and runs with zero accounts.
 */

const has = (v?: string | null) => Boolean(v && v.trim().length > 0);

export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  adminEmails: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    get enabled() {
      return has(process.env.NEXT_PUBLIC_SUPABASE_URL) && has(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    },
  },

  llm: {
    provider: (process.env.LLM_PROVIDER || "mock").toLowerCase(),
    apiKey: process.env.LLM_API_KEY || "",
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    baseUrl: process.env.LLM_BASE_URL || "",
    get enabled() {
      return has(process.env.LLM_API_KEY) && (process.env.LLM_PROVIDER || "mock") !== "mock";
    },
  },

  email: {
    apiKey: process.env.RESEND_API_KEY || "",
    mockMode:
      process.env.EMAIL_MOCK_MODE === "true" || !has(process.env.RESEND_API_KEY),
    from: {
      noreply: process.env.EMAIL_FROM_NOREPLY || "Stuttgart Archive <noreply@stuttgartarchive.com>",
      support: process.env.EMAIL_FROM_SUPPORT || "Stuttgart Archive Support <support@stuttgartarchive.com>",
      hello: process.env.EMAIL_FROM_HELLO || "Stuttgart Archive <hello@stuttgartarchive.com>",
      concierge: process.env.EMAIL_FROM_CONCIERGE || "Stuttgart Archive Concierge <concierge@stuttgartarchive.com>",
      updates: process.env.EMAIL_FROM_UPDATES || "Stuttgart Archive <updates@stuttgartarchive.com>",
    },
    founderEmail: process.env.FOUNDER_NOTIFICATION_EMAIL || "",
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    prices: {
      plus: process.env.STRIPE_PLUS_PRICE_ID || "",
      collector: process.env.STRIPE_COLLECTOR_PRICE_ID || "",
      dealer: process.env.STRIPE_DEALER_PRICE_ID || "",
      sellerPack: process.env.STRIPE_SELLER_PACK_PRICE_ID || "",
      auctionPack: process.env.STRIPE_AUCTION_PACK_PRICE_ID || "",
    },
    get enabled() {
      return has(process.env.STRIPE_SECRET_KEY);
    },
  },

  integrations: {
    instagramEnabled: has(process.env.INSTAGRAM_CLIENT_ID),
    metaAdsEnabled: has(process.env.META_ADS_APP_ID),
  },

  appStore: {
    sharedSecret: process.env.APP_STORE_SHARED_SECRET || "",
  },

  stockPhotos: {
    pexelsKey: process.env.PEXELS_API_KEY || "",
    unsplashKey: process.env.UNSPLASH_ACCESS_KEY || "",
    // "loremflickr" enables no-key demo photos; otherwise illustrations are used.
    source: (process.env.DEMO_PHOTO_SOURCE || "").toLowerCase(),
  },
} as const;

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return config.adminEmails.includes(email.toLowerCase());
}
