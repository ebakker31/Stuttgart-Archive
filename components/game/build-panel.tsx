import { fmt } from "@/lib/game/format";
import {
  buildingCost,
  buildingLevel,
  effectiveGrowMs,
  globalMultiplier,
  passiveLumenPerSec,
} from "@/lib/game/engine";
import { BUILDINGS, EFFECTS, plotPurchaseCost } from "@/lib/game/config";
import type { BuildingId, GameState } from "@/lib/game/types";

/** Short, human description of what the *next* level of a building will do. */
function effectLine(state: GameState, id: BuildingId): string {
  const lvl = buildingLevel(state, id);
  switch (id) {
    case "glowwell":
      return `Idle ${fmt(passiveLumenPerSec(state))}/s → ${fmt(
        (lvl + 1) * EFFECTS.glowwellLumenPerSec * globalMultiplier(state)
      )}/s`;
    case "prism":
      return `Harvest ×${globalMultiplier(state).toFixed(2)} → ×${(
        1 +
        (lvl + 1) * EFFECTS.prismMultPerLevel
      ).toFixed(2)}`;
    case "spritehut":
      return `Auto-tends ${lvl} → ${lvl + 1} plot${lvl + 1 === 1 ? "" : "s"}`;
    case "moondial": {
      const cur = effectiveGrowMs(state, "glimmerbud") / 1000;
      const nextSpeed = 1 + (lvl + 1) * EFFECTS.moondialSpeedPerLevel;
      const next = 10 / nextSpeed;
      return `Grow speed +${Math.round((nextSpeed - 1) * 100)}% (${cur.toFixed(1)}s → ${next.toFixed(1)}s)`;
    }
  }
}

export function BuildPanel({
  state,
  onUpgrade,
  onBuyPlot,
}: {
  state: GameState;
  onUpgrade: (id: BuildingId) => void;
  onBuyPlot: () => void;
}) {
  const plotCost = plotPurchaseCost(state.boughtPlots);

  return (
    <div className="flex flex-col gap-2">
      {BUILDINGS.map((b) => {
        const lvl = buildingLevel(state, b.id);
        const maxed = lvl >= b.maxLevel;
        const cost = buildingCost(b.id, lvl);
        const affordable = state.lumen >= cost;

        return (
          <div
            key={b.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
          >
            <span className="text-2xl">{b.glyph}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">{b.name}</span>
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[0.6rem] font-medium text-slate-300">
                  Lv {lvl}
                </span>
              </div>
              <p className="truncate text-[0.7rem] text-slate-400">{effectLine(state, b.id)}</p>
            </div>
            <button
              disabled={maxed || !affordable}
              onClick={() => onUpgrade(b.id)}
              className={[
                "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition",
                maxed
                  ? "cursor-default bg-white/5 text-slate-500"
                  : affordable
                    ? "bg-violet-500/90 text-white hover:bg-violet-400"
                    : "cursor-not-allowed bg-white/5 text-slate-500",
              ].join(" ")}
            >
              {maxed ? "Max" : <>{fmt(cost)} 🔆</>}
            </button>
          </div>
        );
      })}

      <button
        disabled={state.lumen < plotCost}
        onClick={onBuyPlot}
        className={[
          "mt-1 flex items-center justify-between rounded-xl border border-dashed px-3 py-3 text-sm transition",
          state.lumen >= plotCost
            ? "border-emerald-300/40 text-emerald-100 hover:bg-emerald-300/5"
            : "cursor-not-allowed border-white/10 text-slate-500",
        ].join(" ")}
      >
        <span className="flex items-center gap-2">🌿 Clear another plot</span>
        <span className="font-semibold tabular-nums">{fmt(plotCost)} 🔆</span>
      </button>
    </div>
  );
}
