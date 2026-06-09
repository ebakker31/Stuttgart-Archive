/**
 * Auction Radar — upcoming collector-car auction events.
 *
 * LEGAL POSTURE: This is editorial, informational listing only. Stuttgart
 * Archive is independent and not affiliated with, endorsed by, or partnered
 * with any auction house or marketplace named here. Event names are used
 * descriptively, no third-party logos/marks are used, and every entry links to
 * the official organizer where details should be verified. Dates are shown as
 * approximate windows and labeled "verify with organizer" because they are not
 * pulled from a live, authorized feed in this MVP.
 *
 * FUTURE (legal) CONNECTION: real, current event data should come from an
 * authorized source — an official API, a licensed data partner, or an
 * organizer-provided feed/affiliate program. Implement such a source as an
 * AuctionFeedProvider and register it below; never scrape sites that prohibit it.
 */

export interface AuctionEvent {
  id: string;
  name: string;
  organizer: string;
  location: string;
  /** Approximate window, e.g. "Mid-January 2027". Not an authoritative date. */
  window: string;
  format: "in_person" | "online";
  /** Official organizer URL for verification (opens in a new tab). */
  url: string;
  /** Why it's relevant to Porsche owners/sellers — editorial note, no claims. */
  note: string;
}

export interface AuctionFeedProvider {
  readonly id: string;
  listUpcoming(): Promise<AuctionEvent[]>;
}

/**
 * Curated provider — a hand-maintained editorial list of well-known recurring
 * collector-car auctions and marketplaces. Replace/augment with an authorized
 * live provider when a licensed source is available.
 */
const CURATED: AuctionEvent[] = [
  {
    id: "mecum-kissimmee",
    name: "Mecum Kissimmee",
    organizer: "Mecum Auctions",
    location: "Kissimmee, Florida, USA",
    window: "Early January",
    format: "in_person",
    url: "https://www.mecum.com/",
    note: "One of the largest collector-car sales of the year; regularly features air- and water-cooled Porsche.",
  },
  {
    id: "bj-scottsdale",
    name: "Barrett-Jackson Scottsdale",
    organizer: "Barrett-Jackson",
    location: "Scottsdale, Arizona, USA",
    window: "Late January",
    format: "in_person",
    url: "https://www.barrett-jackson.com/",
    note: "High-profile no-reserve format; a strong venue for well-documented modern Porsche.",
  },
  {
    id: "rm-arizona",
    name: "RM Sotheby's Arizona",
    organizer: "RM Sotheby's",
    location: "Phoenix, Arizona, USA",
    window: "Late January",
    format: "in_person",
    url: "https://rmsothebys.com/",
    note: "Curated, documentation-forward sale — provenance and records matter here.",
  },
  {
    id: "amelia",
    name: "The Amelia (Concours week sales)",
    organizer: "Multiple houses",
    location: "Amelia Island, Florida, USA",
    window: "Early March",
    format: "in_person",
    url: "https://www.ameliaconcours.org/",
    note: "Concours-week auctions favor exceptional, fully documented examples.",
  },
  {
    id: "monterey",
    name: "Monterey Car Week sales",
    organizer: "Gooding, RM Sotheby's, Bonhams, Broad Arrow & others",
    location: "Monterey Peninsula, California, USA",
    window: "Mid-August",
    format: "in_person",
    url: "https://en.wikipedia.org/wiki/Monterey_Car_Week",
    note: "The marquee week of the year for significant Porsche; presentation and history are everything.",
  },
  {
    id: "bonhams-quail",
    name: "Bonhams|Cars — The Quail",
    organizer: "Bonhams|Cars",
    location: "Carmel, California, USA",
    window: "Mid-August (Monterey week)",
    format: "in_person",
    url: "https://carsonline.bonhams.com/",
    note: "Boutique sale during Monterey week; rewards thorough provenance files.",
  },
  {
    id: "bring-a-trailer",
    name: "Bring a Trailer (online)",
    organizer: "Bring a Trailer",
    location: "Online",
    window: "Rolling, year-round",
    format: "online",
    url: "https://bringatrailer.com/",
    note: "Comment-driven online auctions; documentation and honest disclosure win bidders.",
  },
  {
    id: "cars-and-bids",
    name: "Cars & Bids (online)",
    organizer: "Cars & Bids",
    location: "Online",
    window: "Rolling, year-round",
    format: "online",
    url: "https://carsandbids.com/",
    note: "Enthusiast online marketplace focused on modern-era cars, including Porsche.",
  },
  {
    id: "pcarmarket",
    name: "PCARMARKET (online)",
    organizer: "PCARMARKET",
    location: "Online",
    window: "Rolling, year-round",
    format: "online",
    url: "https://www.pcarmarket.com/",
    note: "Marque-focused online auctions and reserve sales for Porsche.",
  },
];

export const curatedAuctionProvider: AuctionFeedProvider = {
  id: "curated",
  async listUpcoming() {
    return CURATED;
  },
};

/**
 * Live-feed provider. Set AUCTION_FEED_URL to an authorized JSON endpoint that
 * returns an array of AuctionEvent objects (your own admin feed, a licensed
 * partner, or an affiliate API). Falls back to the curated list on any error so
 * the page never breaks.
 */
export function liveAuctionProvider(url: string): AuctionFeedProvider {
  return {
    id: "live",
    async listUpcoming() {
      try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return CURATED;
        const data = await res.json();
        const events = Array.isArray(data) ? data : data?.events;
        if (!Array.isArray(events) || !events.length) return CURATED;
        // Trust only the fields we expect; ignore anything else.
        return events.map((e: any, i: number) => ({
          id: String(e.id ?? `live-${i}`),
          name: String(e.name ?? "Auction"),
          organizer: String(e.organizer ?? ""),
          location: String(e.location ?? ""),
          window: String(e.window ?? e.date ?? "TBA"),
          format: e.format === "online" ? "online" : "in_person",
          url: String(e.url ?? "#"),
          note: String(e.note ?? ""),
        })) as AuctionEvent[];
      } catch {
        return CURATED;
      }
    },
  };
}

/** Resolve the active provider — live feed when configured, else curated. */
export async function getUpcomingAuctions(): Promise<AuctionEvent[]> {
  const url = process.env.AUCTION_FEED_URL;
  const provider = url ? liveAuctionProvider(url) : curatedAuctionProvider;
  return provider.listUpcoming();
}

/** Whether a live feed is configured (for UI labeling). */
export function auctionFeedIsLive(): boolean {
  return Boolean(process.env.AUCTION_FEED_URL);
}
