import { DEMO_VEHICLES, getDemoVehicle, type DemoVehicle } from "@/lib/demo-data";

/**
 * Auction-style marketplace listings ("the BaT/Sotheby's experience"), backed by
 * each car's real documented archive. Demo data; clearly labeled. Time-left is
 * computed relative to render time so the countdowns always read as "live."
 */

export interface Bid {
  amount: number;
  bidder: string;
  hoursAgo: number;
}

export interface ListingComment {
  author: string;
  body: string;
  hoursAgo: number;
  isSeller?: boolean;
}

export interface AuctionListing {
  vehicleSlug: string;
  title: string;
  currentBid: number;
  bidCount: number;
  reserve: "reserve" | "no_reserve";
  reserveMet: boolean;
  watchers: number;
  /** Hours from now until the auction ends (kept in the future at render time). */
  endsInHours: number;
  highlights: string[];
  bids: Bid[];
  comments: ListingComment[];
}

export const LISTINGS: AuctionListing[] = [
  {
    vehicleSlug: "2007-911-turbo",
    title: "2007 Porsche 911 Turbo (997.1) — 6-Speed, PCCB",
    currentBid: 78500,
    bidCount: 24,
    reserve: "reserve",
    reserveMet: false,
    watchers: 612,
    endsInHours: 53,
    highlights: [
      "Desirable 6-speed manual",
      "PCCB ceramic composite brakes",
      "Basalt Black over Sea Blue",
      "Major services current; pre-sale PPI on file",
    ],
    bids: [
      { amount: 78500, bidder: "manualonly", hoursAgo: 3 },
      { amount: 76000, bidder: "flat6fan", hoursAgo: 8 },
      { amount: 72500, bidder: "boost_addict", hoursAgo: 20 },
      { amount: 65000, bidder: "garagequeen", hoursAgo: 40 },
    ],
    comments: [
      { author: "basalt-collection", body: "Happy to answer anything — full records are in the archive tab.", hoursAgo: 30, isSeller: true },
      { author: "flat6fan", body: "Manual 997TT with PCCB and a PPI on file is exactly what I've been waiting for.", hoursAgo: 7 },
      { author: "manualonly", body: "Any details on the coil-over weep noted in the inspection?", hoursAgo: 3 },
    ],
  },
  {
    vehicleSlug: "2016-boxster-spyder",
    title: "2016 Porsche Boxster Spyder — 6-Speed, Garage-Stored",
    currentBid: 71000,
    bidCount: 18,
    reserve: "no_reserve",
    reserveMet: true,
    watchers: 438,
    endsInHours: 26,
    highlights: [
      "Manual, 3.8L naturally aspirated",
      "Two owners, summers only",
      "Documented service history",
      "Selling at NO RESERVE",
    ],
    bids: [
      { amount: 71000, bidder: "topdownsummer", hoursAgo: 1 },
      { amount: 69500, bidder: "purist981", hoursAgo: 5 },
      { amount: 66000, bidder: "openroad", hoursAgo: 14 },
    ],
    comments: [
      { author: "open-top-files", body: "Stored climate-controlled every winter. Ask me anything.", hoursAgo: 18, isSeller: true },
      { author: "purist981", body: "The honesty on the chips is refreshing. GLWTA.", hoursAgo: 5 },
    ],
  },
  {
    vehicleSlug: "2021-cayman-gt4",
    title: "2021 Porsche 718 Cayman GT4 — Clubsport, Racing Yellow",
    currentBid: 96000,
    bidCount: 31,
    reserve: "reserve",
    reserveMet: true,
    watchers: 884,
    endsInHours: 8,
    highlights: [
      "Clubsport package, carbon buckets",
      "Honest, documented track use",
      "Racing Yellow over black",
      "Reserve met",
    ],
    bids: [
      { amount: 96000, bidder: "apexhunter", hoursAgo: 1 },
      { amount: 94500, bidder: "yellowfever", hoursAgo: 2 },
      { amount: 90000, bidder: "trackrat", hoursAgo: 6 },
    ],
    comments: [
      { author: "apex-and-archive", body: "Every track day is logged in the archive. Tires have ~60% left.", hoursAgo: 6, isSeller: true },
    ],
  },
  {
    vehicleSlug: "2018-911-carrera-s",
    title: "2018 Porsche 911 Carrera S (991.2) — PDK, Sport Chrono",
    currentBid: 64000,
    bidCount: 12,
    reserve: "reserve",
    reserveMet: false,
    watchers: 295,
    endsInHours: 72,
    highlights: [
      "18k careful miles, two owners",
      "Sport Chrono + sport exhaust",
      "GT Silver over Bordeaux Red",
      "Complete dealer service records",
    ],
    bids: [
      { amount: 64000, bidder: "silverarrow", hoursAgo: 4 },
      { amount: 61000, bidder: "daily991", hoursAgo: 18 },
    ],
    comments: [],
  },
];

export interface ResolvedListing extends AuctionListing {
  vehicle: DemoVehicle;
  endsAt: number; // epoch ms, computed at render time
}

export function getListings(): ResolvedListing[] {
  const now = Date.now();
  return LISTINGS.map((l) => ({
    ...l,
    vehicle: getDemoVehicle(l.vehicleSlug)!,
    endsAt: now + l.endsInHours * 3600_000,
  })).filter((l) => l.vehicle);
}

export function getListing(slug: string): ResolvedListing | undefined {
  return getListings().find((l) => l.vehicleSlug === slug);
}

/** For sale but not (yet) a live auction — surfaced as "available" in the marketplace. */
export function nonAuctionForSale(): DemoVehicle[] {
  const liveSlugs = new Set(LISTINGS.map((l) => l.vehicleSlug));
  return DEMO_VEHICLES.filter(
    (v) => (v.saleStatus === "For sale" || v.ownershipStatus === "For sale") && !liveSlugs.has(v.slug)
  );
}
