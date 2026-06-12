/**
 * Lumengarden — pure game engine.
 *
 * Every function is a pure transform of `GameState` (plus a `now` clock value
 * where time matters). Nothing here touches the DOM, localStorage, or React —
 * that lives in the UI layer — which keeps the whole economy unit-testable.
 *
 * Actions return either a new `GameState` or a small `ActionResult` describing
 * success/failure so the UI can show a reason without throwing.
 */
import {
  BUILDINGS,
  EFFECTS,
  GAME,
  SEEDS,
  STARDUST_PACKS,
  STARDUST_PER_RANK,
  THEMES,
  plotPurchaseCost,
} from "./config";
import type {
  BuildingId,
  GameState,
  Plot,
  SeedDef,
  SeedId,
  StardustPack,
  ThemeId,
  TickResult,
} from "./types";

const SEED_BY_ID = new Map(SEEDS.map((s) => [s.id, s]));
const BUILDING_BY_ID = new Map(BUILDINGS.map((b) => [b.id, b]));

export function seedDef(id: SeedId): SeedDef {
  const def = SEED_BY_ID.get(id);
  if (!def) throw new Error(`Unknown seed: ${id}`);
  return def;
}

export interface ActionResult {
  ok: boolean;
  state: GameState;
  /** Human-readable reason when `ok` is false. */
  reason?: string;
}

function fail(state: GameState, reason: string): ActionResult {
  return { ok: false, state, reason };
}

// ---------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------

/**
 * Garden Rank from lifetime Lumen. Rank 1 is free; each rank costs steeply
 * more lifetime Lumen, which paces seed/biome unlocks.
 */
export function rankThreshold(rank: number): number {
  if (rank <= 1) return 0;
  return Math.floor(50 * Math.pow(rank - 1, 2.3));
}

export function getRank(lifetimeLumen: number): number {
  let rank = 1;
  while (rankThreshold(rank + 1) <= lifetimeLumen) rank += 1;
  return rank;
}

/** Progress (0..1) toward the next rank, plus the surrounding thresholds. */
export function rankProgress(lifetimeLumen: number) {
  const rank = getRank(lifetimeLumen);
  const current = rankThreshold(rank);
  const next = rankThreshold(rank + 1);
  const pct = next === current ? 1 : (lifetimeLumen - current) / (next - current);
  return { rank, current, next, pct: Math.max(0, Math.min(1, pct)) };
}

export function buildingLevel(state: GameState, id: BuildingId): number {
  return state.buildings[id] ?? 0;
}

/** Geometric building cost for the *next* level. */
export function buildingCost(id: BuildingId, level: number): number {
  const def = BUILDING_BY_ID.get(id)!;
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, level));
}

/** Garden-wide Lumen multiplier from Prisms. */
export function globalMultiplier(state: GameState): number {
  return 1 + buildingLevel(state, "prism") * EFFECTS.prismMultPerLevel;
}

/** Idle Lumen per second from Glow Wells (already including the Prism boost). */
export function passiveLumenPerSec(state: GameState): number {
  const wells = buildingLevel(state, "glowwell");
  return wells * EFFECTS.glowwellLumenPerSec * globalMultiplier(state);
}

/** Maximum offline Lumen the wells can bank before overflowing. */
export function storageCap(state: GameState): number {
  const hours = GAME.baseStorageHours + buildingLevel(state, "glowwell") * GAME.storageHoursPerWell;
  return passiveLumenPerSec(state) * hours * 3600;
}

/** Effective grow time for a seed after Moondial speed-ups, in ms. */
export function effectiveGrowMs(state: GameState, seed: SeedId): number {
  const def = seedDef(seed);
  const speed = 1 + buildingLevel(state, "moondial") * EFFECTS.moondialSpeedPerLevel;
  return Math.ceil((def.growSec * 1000) / speed);
}

/** Total plots available = base + rank grants + purchased. */
export function plotCapacity(state: GameState): number {
  const rank = getRank(state.lifetimeLumen);
  const rankPlots = Math.floor((rank - 1) / GAME.plotsPerRank);
  return GAME.basePlots + rankPlots + state.boughtPlots;
}

export interface PlotStatus {
  empty: boolean;
  ready: boolean;
  remainingMs: number;
  pct: number;
}

export function plotStatus(state: GameState, plot: Plot, now: number): PlotStatus {
  if (!plot.seed || plot.plantedAt === null) {
    return { empty: true, ready: false, remainingMs: 0, pct: 0 };
  }
  const grow = effectiveGrowMs(state, plot.seed);
  const elapsed = now - plot.plantedAt;
  const remainingMs = Math.max(0, grow - elapsed);
  return {
    empty: false,
    ready: remainingMs <= 0,
    remainingMs,
    pct: Math.max(0, Math.min(1, elapsed / grow)),
  };
}

/** Stardust needed to instantly finish a growing plot (1 per remaining minute). */
export function rushCost(state: GameState, plot: Plot, now: number): number {
  const status = plotStatus(state, plot, now);
  if (status.empty || status.ready) return 0;
  return Math.max(1, Math.ceil(status.remainingMs / 60000));
}

export function harvestValue(state: GameState, seed: SeedId): number {
  return Math.floor(seedDef(seed).yield * globalMultiplier(state));
}

export function unlockedSeeds(state: GameState): SeedDef[] {
  const rank = getRank(state.lifetimeLumen);
  return SEEDS.filter((s) => s.unlockRank <= rank);
}

// ---------------------------------------------------------------------------
// Initial state & cloning
// ---------------------------------------------------------------------------

export function createInitialState(now: number): GameState {
  return {
    version: GAME.version,
    createdAt: now,
    lastSeen: now,
    lumen: GAME.startingLumen,
    stardust: GAME.startingStardust,
    lifetimeLumen: 0,
    plots: Array.from({ length: GAME.basePlots }, () => ({ seed: null, plantedAt: null })),
    buildings: { glowwell: 0, prism: 0, spritehut: 0, moondial: 0 },
    boughtPlots: 0,
    theme: "twilight",
    ownedThemes: ["twilight"],
    stats: { planted: 0, harvested: 0, rushed: 0, spentUsd: 0 },
  };
}

/** Structured clone that is safe for our plain-data state. */
function clone(state: GameState): GameState {
  return {
    ...state,
    plots: state.plots.map((p) => ({ ...p })),
    buildings: { ...state.buildings },
    ownedThemes: [...state.ownedThemes],
    stats: { ...state.stats },
  };
}

/** Grant any Lumen, keeping lifetime + rank-driven plot capacity in sync. */
function addLumen(state: GameState, amount: number): void {
  if (amount <= 0) return;
  const beforeRank = getRank(state.lifetimeLumen);
  state.lumen += amount;
  state.lifetimeLumen += amount;
  const afterRank = getRank(state.lifetimeLumen);
  if (afterRank > beforeRank) {
    state.stardust += (afterRank - beforeRank) * STARDUST_PER_RANK;
  }
  syncPlotCount(state);
}

/** Ensure the plots array length matches the current capacity (rank grants). */
function syncPlotCount(state: GameState): void {
  const cap = plotCapacity(state);
  while (state.plots.length < cap) state.plots.push({ seed: null, plantedAt: null });
}

// ---------------------------------------------------------------------------
// Simulation tick (idle income + Sprite Hut automation + offline catch-up)
// ---------------------------------------------------------------------------

/**
 * Advance the world from `state.lastSeen` to `now`. Applies idle Lumen (capped
 * by storage) and lets Sprite Huts auto-harvest+replant tended plots. Safe to
 * call every animation frame *or* once after a long absence.
 */
export function tick(state: GameState, now: number): TickResult {
  const next = clone(state);
  const elapsedMs = Math.max(0, now - next.lastSeen);
  const elapsedSec = Math.floor(elapsedMs / 1000);

  let gainedLumen = 0;
  let autoHarvested = 0;

  // Idle generators, capped by storage so the well "overflows" when away long.
  const perSec = passiveLumenPerSec(next);
  if (perSec > 0 && elapsedMs > 0) {
    gainedLumen += Math.min(perSec * (elapsedMs / 1000), storageCap(next));
  }

  // Sprite Hut automation: tend up to N plots, harvesting ready ones and
  // replanting the same seed if the keeper can still afford it.
  const tended = buildingLevel(next, "spritehut") * EFFECTS.spritehutPlotsPerLevel;
  if (tended > 0) {
    let used = 0;
    for (const plot of next.plots) {
      if (used >= tended) break;
      if (!plot.seed || plot.plantedAt === null) continue;
      used += 1;
      const status = plotStatus(next, plot, now);
      if (!status.ready) continue;
      const seed = plot.seed;
      gainedLumen += harvestValue(next, seed);
      next.stats.harvested += 1;
      autoHarvested += 1;
      const def = seedDef(seed);
      if (next.lumen + gainedLumen >= def.cost) {
        // Replant immediately so automation keeps cycling. The cost is paid
        // from current Lumen; harvested gains are folded in below.
        plot.plantedAt = now;
        next.stats.planted += 1;
        // Defer the cost: subtract from the running gain bucket if possible,
        // otherwise from banked Lumen.
        if (gainedLumen >= def.cost) gainedLumen -= def.cost;
        else {
          next.lumen -= def.cost - gainedLumen;
          gainedLumen = 0;
        }
      } else {
        plot.seed = null;
        plot.plantedAt = null;
      }
    }
  }

  addLumen(next, gainedLumen);
  next.lastSeen = now;
  return { state: next, gainedLumen, autoHarvested, elapsedSec };
}

// ---------------------------------------------------------------------------
// Player actions
// ---------------------------------------------------------------------------

export function plantSeed(state: GameState, plotIndex: number, seed: SeedId, now: number): ActionResult {
  const plot = state.plots[plotIndex];
  if (!plot) return fail(state, "That plot doesn't exist.");
  if (plot.seed) return fail(state, "That plot is already growing.");
  const def = seedDef(seed);
  if (getRank(state.lifetimeLumen) < def.unlockRank) {
    return fail(state, `${def.name} unlocks at Rank ${def.unlockRank}.`);
  }
  if (state.lumen < def.cost) return fail(state, `Need ${def.cost} Lumen to plant ${def.name}.`);
  const next = clone(state);
  next.lumen -= def.cost;
  next.plots[plotIndex] = { seed, plantedAt: now };
  next.stats.planted += 1;
  return { ok: true, state: next };
}

export function harvestPlot(state: GameState, plotIndex: number, now: number): ActionResult {
  const plot = state.plots[plotIndex];
  if (!plot || !plot.seed) return fail(state, "Nothing to harvest here.");
  const status = plotStatus(state, plot, now);
  if (!status.ready) return fail(state, "This bloom isn't ready yet.");
  const next = clone(state);
  addLumen(next, harvestValue(next, plot.seed));
  next.stats.harvested += 1;
  next.plots[plotIndex] = { seed: null, plantedAt: null };
  return { ok: true, state: next };
}

/** Harvest every ready plot at once. Returns the count harvested via stats. */
export function harvestAll(state: GameState, now: number): ActionResult {
  let next = clone(state);
  let any = false;
  next.plots.forEach((plot, i) => {
    if (!plot.seed) return;
    if (plotStatus(next, plot, now).ready) {
      addLumen(next, harvestValue(next, plot.seed));
      next.stats.harvested += 1;
      next.plots[i] = { seed: null, plantedAt: null };
      any = true;
    }
  });
  if (!any) return fail(state, "No blooms are ready yet.");
  return { ok: true, state: next };
}

export function rushPlot(state: GameState, plotIndex: number, now: number): ActionResult {
  const plot = state.plots[plotIndex];
  if (!plot || !plot.seed) return fail(state, "Nothing growing here to rush.");
  const status = plotStatus(state, plot, now);
  if (status.ready) return fail(state, "This bloom is already ready.");
  const cost = rushCost(state, plot, now);
  if (state.stardust < cost) return fail(state, `Need ${cost} Stardust to rush this bloom.`);
  const next = clone(state);
  next.stardust -= cost;
  next.stats.rushed += 1;
  // Backdate planting so the plot reads as fully grown.
  next.plots[plotIndex] = { seed: plot.seed, plantedAt: now - effectiveGrowMs(next, plot.seed) };
  return { ok: true, state: next };
}

export function upgradeBuilding(state: GameState, id: BuildingId): ActionResult {
  const def = BUILDING_BY_ID.get(id);
  if (!def) return fail(state, "Unknown building.");
  const level = buildingLevel(state, id);
  if (level >= def.maxLevel) return fail(state, `${def.name} is at max level.`);
  const cost = buildingCost(id, level);
  if (state.lumen < cost) return fail(state, `Need ${cost} Lumen to upgrade ${def.name}.`);
  const next = clone(state);
  next.lumen -= cost;
  next.buildings[id] = level + 1;
  syncPlotCount(next);
  return { ok: true, state: next };
}

export function buyPlot(state: GameState): ActionResult {
  const cost = plotPurchaseCost(state.boughtPlots);
  if (state.lumen < cost) return fail(state, `Need ${cost} Lumen for another plot.`);
  const next = clone(state);
  next.lumen -= cost;
  next.boughtPlots += 1;
  next.plots.push({ seed: null, plantedAt: null });
  return { ok: true, state: next };
}

/**
 * Simulated in-app purchase. In a production build this would be fulfilled by
 * the server after a Stripe Checkout / App Store receipt verification (see
 * lib/payments/*). Here it grants Stardust immediately and records the would-be
 * spend for analytics — no real charge occurs.
 */
export function buyStardustPack(state: GameState, packId: string): ActionResult {
  const pack: StardustPack | undefined = STARDUST_PACKS.find((p) => p.id === packId);
  if (!pack) return fail(state, "Unknown pack.");
  const next = clone(state);
  next.stardust += pack.stardust + pack.bonus;
  next.stats.spentUsd = Math.round((next.stats.spentUsd + pack.priceUsd) * 100) / 100;
  return { ok: true, state: next };
}

export function buyTheme(state: GameState, themeId: ThemeId): ActionResult {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return fail(state, "Unknown theme.");
  if (state.ownedThemes.includes(themeId)) {
    const next = clone(state);
    next.theme = themeId;
    return { ok: true, state: next };
  }
  if (state.stardust < theme.cost) return fail(state, `Need ${theme.cost} Stardust for ${theme.name}.`);
  const next = clone(state);
  next.stardust -= theme.cost;
  next.ownedThemes.push(themeId);
  next.theme = themeId;
  return { ok: true, state: next };
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export function serialize(state: GameState): string {
  return JSON.stringify(state);
}

/**
 * Parse a saved blob back into a `GameState`, tolerating older/partial saves by
 * merging onto a fresh initial state. Returns null if the blob is unusable.
 */
export function deserialize(raw: string, now: number): GameState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (!parsed || typeof parsed !== "object") return null;
    const base = createInitialState(now);
    const merged: GameState = {
      ...base,
      ...parsed,
      buildings: { ...base.buildings, ...(parsed.buildings ?? {}) },
      stats: { ...base.stats, ...(parsed.stats ?? {}) },
      plots: Array.isArray(parsed.plots)
        ? parsed.plots.map((p) => ({ seed: p?.seed ?? null, plantedAt: p?.plantedAt ?? null }))
        : base.plots,
      ownedThemes: Array.isArray(parsed.ownedThemes) ? parsed.ownedThemes : base.ownedThemes,
      version: GAME.version,
    };
    syncPlotCount(merged);
    return merged;
  } catch {
    return null;
  }
}
