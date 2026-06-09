/**
 * Marketplace economics — the buyer's-fee model.
 *
 * Listing is free for individual sellers. When a car sells, the BUYER pays a
 * capped premium (collected by Stuttgart Archive via Stripe). The car payment
 * itself moves through a licensed escrow partner or directly between the
 * parties — the platform never holds vehicle funds (keeps us out of money-
 * transmitter/escrow licensing territory). This mirrors how Cars & Bids and
 * Bring a Trailer structure fees.
 */

export const MARKETPLACE = {
  listingFee: 0, // free to list for individuals (dealers via plan)
  buyerPremiumRate: 0.05, // 5%
  buyerPremiumMin: 250,
  buyerPremiumMax: 5000,
  escrowPartner: "a licensed escrow provider (e.g. Escrow.com)",
} as const;

/** Buyer's premium for a given sale price, clamped to the min/max. */
export function calcBuyerPremium(salePrice: number): number {
  if (!Number.isFinite(salePrice) || salePrice <= 0) return MARKETPLACE.buyerPremiumMin;
  const raw = salePrice * MARKETPLACE.buyerPremiumRate;
  return Math.round(Math.min(MARKETPLACE.buyerPremiumMax, Math.max(MARKETPLACE.buyerPremiumMin, raw)));
}

/** Total a buyer pays Stuttgart Archive (premium only — not the car price). */
export function buyerTotalFees(salePrice: number): number {
  return calcBuyerPremium(salePrice);
}

/** The ordered stages of a private-sale deal. */
export type DealStage =
  | "inquiry"
  | "offer"
  | "accepted"
  | "escrow_opened"
  | "inspection"
  | "paperwork"
  | "funds_released"
  | "closed";

export const DEAL_STAGES: { id: DealStage; label: string; detail: string }[] = [
  { id: "inquiry", label: "Inquiry", detail: "Buyer reaches out through the listing. No reply is sent automatically." },
  { id: "offer", label: "Offer", detail: "Buyer submits an offer; the seller reviews and accepts, counters, or declines." },
  { id: "accepted", label: "Accepted", detail: "Both parties agree on price and terms in writing." },
  { id: "escrow_opened", label: "Escrow", detail: `Funds are placed with ${MARKETPLACE.escrowPartner}. Stuttgart Archive never holds the car payment.` },
  { id: "inspection", label: "Inspection", detail: "Buyer completes a PPI / inspection window per the agreed terms." },
  { id: "paperwork", label: "Paperwork", detail: "Bill of sale signed, title and odometer disclosure prepared." },
  { id: "funds_released", label: "Funds released", detail: "Escrow releases funds to the seller; the buyer's premium is charged." },
  { id: "closed", label: "Closed", detail: "Title transfers and the archive moves to the new owner." },
];
