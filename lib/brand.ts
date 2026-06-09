/**
 * Stuttgart Archive — brand constants and legally-required copy.
 * These strings are the single source of truth for the product name,
 * tagline, disclaimers, and claim-safe wording used across the app.
 */

export const BRAND = {
  name: "Stuttgart Archive",
  tagline: "Preserve the story behind the machine.",
  promise:
    "Stuttgart Archive helps Porsche owners, buyers, sellers, and collectors preserve real vehicle history, organize paperwork, build digital garages, and share only what they approve.",
  emails: {
    hello: "hello@stuttgartarchive.com",
    support: "support@stuttgartarchive.com",
    concierge: "concierge@stuttgartarchive.com",
    noreply: "noreply@stuttgartarchive.com",
    updates: "updates@stuttgartarchive.com",
  },
} as const;

/** Required footer / legal disclaimer. Must appear on every page footer. */
export const FOOTER_DISCLAIMER =
  "Stuttgart Archive is an independent platform and is not affiliated with, endorsed by, sponsored by, or connected to Porsche AG, Porsche Cars North America, the Porsche Museum, the official Porsche company archive, Stuttgart City Archive, Bring a Trailer, Cars & Bids, PCARMARKET, Meta, Instagram, Apple, Stripe, or any auction/listing platform. Porsche and related model names are trademarks of their respective owners and are used only for descriptive purposes.";

export const DEMO_DISCLAIMER = "This is sample demo data, not a real vehicle listing.";

/** Standard guardrail notices shown on any page that produces external content. */
export const GUARDRAILS = {
  draftOnly: "Draft only — nothing is published without your approval.",
  reviewClaims: "AI-generated claims should be reviewed before use.",
  approvedFields: "Only approved public fields will be shared.",
  factsOnly: "Facts are based only on the data you provide.",
} as const;

/**
 * Claim-safe rewrites. The Claim Verification Agent and UI use these to
 * replace unsupported absolute claims with grounded, honest wording.
 */
export const CLAIM_SAFE_REWRITES: Record<string, string> = {
  "accident-free": "No accident records were provided in the uploaded documents.",
  "full service history": "Includes available service records from the current owner's files.",
  "rare spec": "Desirable enthusiast-oriented specification.",
  "investment-grade": "Well-documented example for buyers to review.",
  "all original": "No major modifications were identified in the uploaded records.",
  "never tracked": "No track-use records were provided in the uploaded documents.",
  "numbers matching": "Owner describes the car as numbers-matching; not independently verified.",
  "one-owner": "Ownership records provided cover the periods documented in the files.",
};

export type UserMode =
  | "owner"
  | "collector"
  | "buyer"
  | "seller"
  | "auction"
  | "dealer"
  | "browse";

export const USER_MODES: {
  id: UserMode;
  question: string;
  label: string;
  description: string;
  firstAction: string;
}[] = [
  {
    id: "owner",
    question: "I own a Porsche",
    label: "Owner",
    description: "Organize records, build a service timeline, preserve the story.",
    firstAction: "Add your first vehicle",
  },
  {
    id: "collector",
    question: "I collect Porsches",
    label: "Collector",
    description: "A collection dashboard with provenance tracking and maintenance reminders.",
    firstAction: "Build your collection",
  },
  {
    id: "buyer",
    question: "I want to buy a Porsche",
    label: "Buyer",
    description: "Watchlists, comparisons, and due-diligence checklists.",
    firstAction: "Start a watchlist",
  },
  {
    id: "seller",
    question: "I want to sell a Porsche",
    label: "Seller",
    description: "Seller packets, public pages, and buyer-ready documentation.",
    firstAction: "Prepare a seller packet",
  },
  {
    id: "auction",
    question: "I am preparing an auction listing",
    label: "Auction prep",
    description: "Auction-style drafts, photo and video checklists, and Q&A prep.",
    firstAction: "Start auction prep",
  },
  {
    id: "dealer",
    question: "I am a dealer or broker",
    label: "Dealer / Broker",
    description: "Inventory dashboard, branded pages, lead capture, and marketing kits.",
    firstAction: "Set up your inventory",
  },
  {
    id: "browse",
    question: "I just want to browse/research",
    label: "Researcher",
    description: "Explore public archives and research before you commit.",
    firstAction: "Explore the archive",
  },
];

/** Vehicle ownership statuses. */
export const OWNERSHIP_STATUSES = [
  "Own",
  "Previously owned",
  "Interested in buying",
  "Watching",
  "For sale",
  "Auction prep",
  "Listed",
  "Sold",
  "Research only",
] as const;
