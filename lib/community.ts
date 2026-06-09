import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo-data";

/**
 * Community ("The Paddock") sample data. Lets enthusiasts follow each other and
 * see what members publish — for-sale cars, modifications, and archive updates.
 *
 * Privacy model (same as the rest of the product): members only appear and only
 * surface content they explicitly publish. Following is a user action; the
 * platform never messages anyone on a member's behalf. In demo mode this is
 * sample data (clearly labeled); with Supabase it reads real opt-in profiles.
 */

export interface Member {
  handle: string;
  name: string;
  location: string;
  bio: string;
  joined: string;
  followers: number;
  following: number;
  vehicleSlugs: string[];
  badges: string[];
  isDemo: boolean;
}

export type FeedType = "for_sale" | "modification" | "archive_update" | "joined";

export interface Comment {
  author: string;
  body: string;
  date: string;
}

export interface FeedItem {
  id: string;
  type: FeedType;
  memberHandle: string;
  vehicleSlug?: string;
  title: string;
  body: string;
  date: string;
  likes: number;
  comments: Comment[];
}

export const MEMBERS: Member[] = [
  {
    handle: "graphite-garage", name: "Daniel R.", location: "Portland, OR",
    bio: "Air-cooled devotee. Documenting a 993 I plan to keep forever.",
    joined: "2025-11", followers: 312, following: 88,
    vehicleSlugs: ["1997-911-carrera-coupe", "2018-911-carrera-s"],
    badges: ["Air-cooled", "Long-term owner"], isDemo: true,
  },
  {
    handle: "apex-and-archive", name: "Mara T.", location: "Austin, TX",
    bio: "Track days and tasteful builds. GT4 owner, honest about every chip.",
    joined: "2026-01", followers: 540, following: 121,
    vehicleSlugs: ["2021-cayman-gt4"],
    badges: ["Track enthusiast", "Verified seller"], isDemo: true,
  },
  {
    handle: "open-top-files", name: "Jens K.", location: "Denver, CO",
    bio: "Manual, naturally-aspirated, top-down. Selling the Spyder to fund the next project.",
    joined: "2025-09", followers: 198, following: 64,
    vehicleSlugs: ["2016-boxster-spyder"],
    badges: ["Manual purist"], isDemo: true,
  },
  {
    handle: "basalt-collection", name: "Priya S.", location: "Seattle, WA",
    bio: "Collector. Provenance over everything. Prepping a 997 Turbo for sale.",
    joined: "2025-12", followers: 726, following: 53,
    vehicleSlugs: ["2007-911-turbo", "2020-taycan-turbo"],
    badges: ["Collector", "Provenance-first"], isDemo: true,
  },
];

export const FEED: FeedItem[] = [
  {
    id: "f1", type: "for_sale", memberHandle: "open-top-files", vehicleSlug: "2016-boxster-spyder",
    title: "Listed: 2016 Boxster Spyder — 6-speed, garage-stored",
    body: "Two owners, summers only, full records in the archive. Asking $92,000. Happy to support a PPI.",
    date: "2026-06-07", likes: 47, comments: [
      { author: "apex-and-archive", body: "Spec looks spot on. Any clutch wear notes?", date: "2026-06-07" },
      { author: "graphite-garage", body: "GT Silver on this body is perfect.", date: "2026-06-08" },
    ],
  },
  {
    id: "f2", type: "modification", memberHandle: "apex-and-archive", vehicleSlug: "2021-cayman-gt4",
    title: "Added a documented track alignment to the GT4",
    body: "Reversible, OEM settings saved. Logged it with the receipt so the next owner has the full picture.",
    date: "2026-06-05", likes: 63, comments: [
      { author: "basalt-collection", body: "This is the way — reversible and documented.", date: "2026-06-05" },
    ],
  },
  {
    id: "f3", type: "archive_update", memberHandle: "graphite-garage", vehicleSlug: "1997-911-carrera-coupe",
    title: "Annual service done on the 993 — records uploaded",
    body: "Valve adjustment and fresh fluids by my air-cooled specialist. Completeness score just ticked up.",
    date: "2026-06-03", likes: 38, comments: [],
  },
  {
    id: "f4", type: "archive_update", memberHandle: "basalt-collection", vehicleSlug: "2007-911-turbo",
    title: "Auction prep underway: 997 Turbo, manual, PCCB",
    body: "Pre-sale PPI on file and photo gaps closed. Building the packet before it goes live.",
    date: "2026-06-02", likes: 71, comments: [
      { author: "open-top-files", body: "Manual 997TT — grail spec. Good luck!", date: "2026-06-02" },
    ],
  },
  {
    id: "f5", type: "joined", memberHandle: "apex-and-archive",
    title: "Mara T. joined The Paddock",
    body: "Welcome to the community.",
    date: "2026-05-28", likes: 12, comments: [],
  },
];

export function getMember(handle: string) {
  return MEMBERS.find((m) => m.handle === handle);
}

export function memberVehicles(m: Member): DemoVehicle[] {
  return m.vehicleSlugs.map((s) => DEMO_VEHICLES.find((v) => v.slug === s)).filter(Boolean) as DemoVehicle[];
}

export function feedForMember(handle: string) {
  return FEED.filter((f) => f.memberHandle === handle);
}
