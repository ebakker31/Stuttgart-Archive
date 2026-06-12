/**
 * Lumengarden — balance data and tuning constants.
 *
 * Kept separate from the engine so the economy can be retuned without touching
 * logic, and so tests can assert against the same numbers the game ships with.
 */
import type { BuildingDef, SeedDef, StardustPack, ThemeId } from "./types";

export const GAME = {
  name: "Lumengarden",
  tagline: "Sky Gardens of Light",
  version: 1,
  /** Plots granted for free at rank 1. */
  basePlots: 4,
  /** One extra free plot every N ranks. */
  plotsPerRank: 3,
  startingLumen: 25,
  startingStardust: 25,
  /** Idle Lumen accrues offline up to this many hours, then the well overflows. */
  baseStorageHours: 4,
  /** Each Glow Well level adds this many hours of offline storage. */
  storageHoursPerWell: 0.5,
} as const;

export const SEEDS: SeedDef[] = [
  {
    id: "glimmerbud",
    name: "Glimmerbud",
    glyph: "🌱",
    cost: 10,
    growSec: 10,
    yield: 18,
    unlockRank: 1,
    blurb: "A hardy starter sprout. Quick to bloom, gentle on the Lumen.",
  },
  {
    id: "moonpetal",
    name: "Moonpetal",
    glyph: "🌸",
    cost: 60,
    growSec: 60,
    yield: 130,
    unlockRank: 2,
    blurb: "Opens under starlight. Steady returns for a patient keeper.",
  },
  {
    id: "sunblossom",
    name: "Sunblossom",
    glyph: "🌻",
    cost: 350,
    growSec: 300,
    yield: 850,
    unlockRank: 4,
    blurb: "Drinks the high sun. A five-minute bloom with a bright payout.",
  },
  {
    id: "starflower",
    name: "Starflower",
    glyph: "✺",
    cost: 2000,
    growSec: 1200,
    yield: 5200,
    unlockRank: 7,
    blurb: "Slow to wake, but its petals carry the weight of a constellation.",
  },
  {
    id: "auroravine",
    name: "Auroravine",
    glyph: "🌌",
    cost: 12000,
    growSec: 3600,
    yield: 34000,
    unlockRank: 10,
    blurb: "The crown of any sky-garden. An hour's wait for a river of light.",
  },
];

export const BUILDINGS: BuildingDef[] = [
  {
    id: "glowwell",
    name: "Glow Well",
    glyph: "💧",
    baseCost: 50,
    costGrowth: 1.6,
    maxLevel: 50,
    blurb: "Draws ambient light from the clouds — passive Lumen, even while away.",
  },
  {
    id: "prism",
    name: "Prism",
    glyph: "🔷",
    baseCost: 220,
    costGrowth: 1.9,
    maxLevel: 40,
    blurb: "Splits and amplifies every harvest. A garden-wide Lumen multiplier.",
  },
  {
    id: "spritehut",
    name: "Sprite Hut",
    glyph: "🏠",
    baseCost: 160,
    costGrowth: 1.85,
    maxLevel: 30,
    blurb: "Friendly sprites auto-harvest and replant your tended plots for you.",
  },
  {
    id: "moondial",
    name: "Moondial",
    glyph: "🕰️",
    baseCost: 130,
    costGrowth: 1.7,
    maxLevel: 30,
    blurb: "Bends the hours — every seed grows a little faster on your plots.",
  },
];

/** Per-level effect tuning, referenced by the engine. */
export const EFFECTS = {
  /** Glow Well: Lumen per second, per level (before the Prism multiplier). */
  glowwellLumenPerSec: 0.8,
  /** Prism: each level adds this to the global multiplier (1 + level * x). */
  prismMultPerLevel: 0.12,
  /** Sprite Hut: number of plots auto-tended, per level. */
  spritehutPlotsPerLevel: 1,
  /** Moondial: grow time is divided by (1 + level * x). */
  moondialSpeedPerLevel: 0.06,
} as const;

export const STARDUST_PACKS: StardustPack[] = [
  { id: "handful", name: "Handful of Stardust", glyph: "✨", stardust: 60, bonus: 0, priceUsd: 0.99 },
  { id: "pouch", name: "Stardust Pouch", glyph: "🌟", stardust: 180, bonus: 20, priceUsd: 3.99, tag: "Popular" },
  { id: "chest", name: "Stardust Chest", glyph: "💫", stardust: 420, bonus: 80, priceUsd: 8.99, tag: "Best value" },
  { id: "vault", name: "Stardust Vault", glyph: "🌠", stardust: 1000, bonus: 250, priceUsd: 19.99 },
];

export interface ThemeDef {
  id: ThemeId;
  name: string;
  /** Tailwind gradient classes for the garden sky. */
  sky: string;
  swatch: string;
  /** Stardust cost; 0 means owned from the start. */
  cost: number;
}

export const THEMES: ThemeDef[] = [
  { id: "twilight", name: "Twilight", sky: "from-indigo-950 via-violet-900 to-slate-900", swatch: "#4c1d95", cost: 0 },
  { id: "dawn", name: "Dawn", sky: "from-rose-300 via-amber-200 to-sky-300", swatch: "#fda4af", cost: 120 },
  { id: "verdant", name: "Verdant", sky: "from-emerald-900 via-teal-800 to-cyan-900", swatch: "#065f46", cost: 200 },
  { id: "nebula", name: "Nebula", sky: "from-fuchsia-900 via-purple-900 to-indigo-950", swatch: "#86198f", cost: 350 },
];

/** Stardust granted per Garden Rank gained. */
export const STARDUST_PER_RANK = 3;

/** Lumen cost of the next purchasable plot, given how many were already bought. */
export function plotPurchaseCost(boughtPlots: number): number {
  return Math.floor(500 * Math.pow(2.15, boughtPlots));
}
