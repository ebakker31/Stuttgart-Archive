import { describe, it, expect } from "vitest";
import {
  buildingCost,
  buyPlot,
  buyStardustPack,
  buyTheme,
  createInitialState,
  deserialize,
  effectiveGrowMs,
  getRank,
  globalMultiplier,
  harvestPlot,
  passiveLumenPerSec,
  plantSeed,
  plotCapacity,
  plotStatus,
  rankProgress,
  rushCost,
  rushPlot,
  serialize,
  tick,
  upgradeBuilding,
} from "@/lib/game/engine";
import { GAME, SEEDS } from "@/lib/game/config";

const T0 = 1_700_000_000_000; // fixed clock for determinism

describe("Lumengarden engine — ranks", () => {
  it("starts at rank 1 with no lifetime Lumen", () => {
    expect(getRank(0)).toBe(1);
  });

  it("rank rises monotonically with lifetime Lumen", () => {
    expect(getRank(60)).toBeGreaterThanOrEqual(2);
    expect(getRank(1_000_000)).toBeGreaterThan(getRank(1000));
  });

  it("rank progress stays within [0,1]", () => {
    const p = rankProgress(300);
    expect(p.pct).toBeGreaterThanOrEqual(0);
    expect(p.pct).toBeLessThanOrEqual(1);
    expect(p.next).toBeGreaterThan(p.current);
  });
});

describe("Lumengarden engine — planting & harvesting", () => {
  it("plants a seed, debiting Lumen and occupying the plot", () => {
    const s0 = createInitialState(T0);
    const res = plantSeed(s0, 0, "glimmerbud", T0);
    expect(res.ok).toBe(true);
    expect(res.state.lumen).toBe(GAME.startingLumen - 10);
    expect(res.state.plots[0].seed).toBe("glimmerbud");
    expect(res.state.stats.planted).toBe(1);
  });

  it("refuses to plant without enough Lumen", () => {
    // Rank 2 (so Moonpetal is unlocked) but only 25 Lumen on hand — it costs 60.
    const s0 = { ...createInitialState(T0), lumen: 25, lifetimeLumen: 100 };
    const res = plantSeed(s0, 0, "moonpetal", T0);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/Lumen/);
  });

  it("refuses to plant a rank-locked seed", () => {
    const s0 = createInitialState(T0);
    const res = plantSeed({ ...s0, lumen: 99999 }, 0, "auroravine", T0);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/Rank/);
  });

  it("cannot harvest before the bloom is ready", () => {
    const planted = plantSeed(createInitialState(T0), 0, "glimmerbud", T0).state;
    const early = harvestPlot(planted, 0, T0 + 3000); // 3s < 10s
    expect(early.ok).toBe(false);
  });

  it("harvests a ready bloom for its yield and clears the plot", () => {
    const planted = plantSeed(createInitialState(T0), 0, "glimmerbud", T0).state;
    const grow = effectiveGrowMs(planted, "glimmerbud");
    const res = harvestPlot(planted, 0, T0 + grow);
    expect(res.ok).toBe(true);
    expect(res.state.plots[0].seed).toBeNull();
    // 25 starting - 10 planted + 18 yield = 33
    expect(res.state.lumen).toBe(33);
    expect(res.state.lifetimeLumen).toBe(18);
  });

  it("a full plant→harvest cycle is net positive (sustainable economy)", () => {
    for (const seed of SEEDS) {
      expect(seed.yield).toBeGreaterThan(seed.cost);
    }
  });
});

describe("Lumengarden engine — Stardust rushing", () => {
  it("rush cost scales with remaining time and is at least 1", () => {
    const planted = plantSeed(createInitialState(T0), 0, "glimmerbud", T0).state;
    const cost = rushCost(planted, planted.plots[0], T0 + 1000);
    expect(cost).toBeGreaterThanOrEqual(1);
  });

  it("rushing finishes the bloom so it can be harvested immediately", () => {
    const planted = plantSeed(createInitialState(T0), 0, "glimmerbud", T0).state;
    const rushed = rushPlot(planted, 0, T0 + 1000);
    expect(rushed.ok).toBe(true);
    expect(rushed.state.stardust).toBeLessThan(planted.stardust);
    const status = plotStatus(rushed.state, rushed.state.plots[0], T0 + 1000);
    expect(status.ready).toBe(true);
  });
});

describe("Lumengarden engine — buildings", () => {
  it("building cost grows geometrically with level", () => {
    expect(buildingCost("glowwell", 1)).toBeGreaterThan(buildingCost("glowwell", 0));
  });

  it("a Glow Well produces passive Lumen per second", () => {
    const s0 = { ...createInitialState(T0), lumen: 100000 };
    const up = upgradeBuilding(s0, "glowwell");
    expect(up.ok).toBe(true);
    expect(passiveLumenPerSec(up.state)).toBeGreaterThan(0);
  });

  it("a Prism raises the global harvest multiplier", () => {
    const s0 = { ...createInitialState(T0), lumen: 100000 };
    const up = upgradeBuilding(s0, "prism");
    expect(globalMultiplier(up.state)).toBeGreaterThan(globalMultiplier(s0));
  });

  it("a Moondial shortens grow time", () => {
    const s0 = { ...createInitialState(T0), lumen: 100000 };
    const base = effectiveGrowMs(s0, "glimmerbud");
    const up = upgradeBuilding(s0, "moondial");
    expect(effectiveGrowMs(up.state, "glimmerbud")).toBeLessThan(base);
  });
});

describe("Lumengarden engine — idle tick & offline progress", () => {
  it("accrues idle Lumen from Glow Wells over elapsed time", () => {
    let s = { ...createInitialState(T0), lumen: 100000 };
    s = upgradeBuilding(s, "glowwell").state;
    const result = tick(s, s.lastSeen + 60_000); // 1 minute
    expect(result.gainedLumen).toBeGreaterThan(0);
    expect(result.state.lastSeen).toBe(s.lastSeen + 60_000);
  });

  it("caps offline idle income at storage capacity", () => {
    let s = { ...createInitialState(T0), lumen: 100000 };
    s = upgradeBuilding(s, "glowwell").state;
    const oneDay = tick(s, s.lastSeen + 24 * 3600_000).gainedLumen;
    const tenDays = tick(s, s.lastSeen + 240 * 3600_000).gainedLumen;
    // Beyond the storage window, extra absence yields no extra Lumen.
    expect(tenDays).toBeCloseTo(oneDay, 5);
  });

  it("Sprite Huts auto-harvest ready plots during a tick", () => {
    let s = { ...createInitialState(T0), lumen: 100000 };
    s = upgradeBuilding(s, "spritehut").state;
    s = plantSeed(s, 0, "glimmerbud", T0).state;
    const grow = effectiveGrowMs(s, "glimmerbud");
    const result = tick(s, T0 + grow + 1000);
    expect(result.autoHarvested).toBeGreaterThanOrEqual(1);
  });
});

describe("Lumengarden engine — plots & purchases", () => {
  it("plot capacity grows with rank", () => {
    const low = createInitialState(T0);
    const high = { ...low, lifetimeLumen: 10_000_000 };
    expect(plotCapacity(high)).toBeGreaterThan(plotCapacity(low));
  });

  it("buying a plot debits Lumen and adds a slot", () => {
    const s0 = { ...createInitialState(T0), lumen: 100000 };
    const before = s0.plots.length;
    const res = buyPlot(s0);
    expect(res.ok).toBe(true);
    expect(res.state.plots.length).toBe(before + 1);
    expect(res.state.lumen).toBeLessThan(s0.lumen);
  });
});

describe("Lumengarden engine — simulated IAP & cosmetics", () => {
  it("a Stardust pack grants stardust + bonus and records would-be spend", () => {
    const s0 = createInitialState(T0);
    const res = buyStardustPack(s0, "pouch");
    expect(res.ok).toBe(true);
    expect(res.state.stardust).toBe(s0.stardust + 180 + 20);
    expect(res.state.stats.spentUsd).toBeCloseTo(3.99, 2);
  });

  it("buying a theme costs Stardust and equips it", () => {
    const s0 = { ...createInitialState(T0), stardust: 1000 };
    const res = buyTheme(s0, "dawn");
    expect(res.ok).toBe(true);
    expect(res.state.theme).toBe("dawn");
    expect(res.state.ownedThemes).toContain("dawn");
    expect(res.state.stardust).toBeLessThan(s0.stardust);
  });

  it("re-equipping an owned theme is free", () => {
    let s = { ...createInitialState(T0), stardust: 1000 };
    s = buyTheme(s, "dawn").state;
    const stardust = s.stardust;
    const res = buyTheme(s, "twilight");
    expect(res.ok).toBe(true);
    expect(res.state.stardust).toBe(stardust);
  });
});

describe("Lumengarden engine — persistence", () => {
  it("round-trips through serialize/deserialize", () => {
    const s0 = plantSeed(createInitialState(T0), 0, "glimmerbud", T0).state;
    const restored = deserialize(serialize(s0), T0 + 5000);
    expect(restored).not.toBeNull();
    expect(restored!.plots[0].seed).toBe("glimmerbud");
    expect(restored!.lumen).toBe(s0.lumen);
  });

  it("tolerates a partial/legacy save by merging onto defaults", () => {
    const restored = deserialize(JSON.stringify({ lumen: 500 }), T0);
    expect(restored).not.toBeNull();
    expect(restored!.lumen).toBe(500);
    expect(restored!.buildings.glowwell).toBe(0);
    expect(restored!.plots.length).toBeGreaterThanOrEqual(GAME.basePlots);
  });

  it("returns null for unusable blobs", () => {
    expect(deserialize("not json", T0)).toBeNull();
  });
});
