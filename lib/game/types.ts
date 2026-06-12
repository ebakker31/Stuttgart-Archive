/**
 * Lumengarden — type definitions.
 *
 * A cozy, peaceful sky-garden builder. No combat: you grow glow-plants on
 * real-time timers, harvest Lumen (soft currency), and reinvest into idle
 * generators, multipliers and automation. Stardust (premium currency) skips
 * timers and buys cosmetics — the free-to-play scaling levers, reskinned into
 * an original, family-friendly theme.
 *
 * All game logic in this folder is pure and deterministic: every function that
 * depends on the clock takes `now` (epoch ms) as an argument, so the economy
 * is fully unit-testable without a running React/Next.js runtime.
 */

export type SeedId =
  | "glimmerbud"
  | "moonpetal"
  | "sunblossom"
  | "starflower"
  | "auroravine";

export type BuildingId = "glowwell" | "prism" | "spritehut" | "moondial";

export type ThemeId = "twilight" | "dawn" | "verdant" | "nebula";

/** A single garden plot. `seed === null` means the plot is empty. */
export interface Plot {
  seed: SeedId | null;
  /** Epoch ms the seed was planted, or null when empty. */
  plantedAt: number | null;
}

export interface SeedDef {
  id: SeedId;
  name: string;
  glyph: string;
  /** Lumen cost to plant. */
  cost: number;
  /** Base grow time in seconds (before Moondial speed-ups). */
  growSec: number;
  /** Lumen yielded on harvest (before multipliers). */
  yield: number;
  /** Garden rank required before this seed can be planted. */
  unlockRank: number;
  blurb: string;
}

export interface BuildingDef {
  id: BuildingId;
  name: string;
  glyph: string;
  baseCost: number;
  /** Geometric cost growth per level. */
  costGrowth: number;
  maxLevel: number;
  blurb: string;
}

export interface StardustPack {
  id: string;
  name: string;
  glyph: string;
  stardust: number;
  bonus: number;
  /** Display price only — purchases in this build are simulated. */
  priceUsd: number;
  tag?: string;
}

export interface GameState {
  version: number;
  createdAt: number;
  /** Last time the state was persisted — basis for offline progress. */
  lastSeen: number;
  lumen: number;
  stardust: number;
  /** Lifetime Lumen ever harvested — drives Garden Rank. */
  lifetimeLumen: number;
  plots: Plot[];
  /** Level per building; 0 means not yet built. */
  buildings: Record<BuildingId, number>;
  /** Extra plots bought with Lumen, on top of the rank-granted plots. */
  boughtPlots: number;
  theme: ThemeId;
  ownedThemes: ThemeId[];
  stats: {
    planted: number;
    harvested: number;
    rushed: number;
    spentUsd: number;
  };
}

/** Result of advancing the simulation, surfaced to the UI for toasts. */
export interface TickResult {
  state: GameState;
  /** Lumen gained from idle generators + automation since `lastSeen`. */
  gainedLumen: number;
  /** Plots auto-harvested by Sprite Huts during this tick. */
  autoHarvested: number;
  /** Whole seconds elapsed since the previous tick. */
  elapsedSec: number;
}
