import { fmt, fmtDuration } from "@/lib/game/format";
import { effectiveGrowMs, getRank, harvestValue } from "@/lib/game/engine";
import { SEEDS } from "@/lib/game/config";
import type { GameState, SeedId } from "@/lib/game/types";

/** Seed picker — choose which bloom an empty plot will plant. */
export function SeedTray({
  state,
  selectedSeed,
  onSelect,
}: {
  state: GameState;
  selectedSeed: SeedId;
  onSelect: (seed: SeedId) => void;
}) {
  const rank = getRank(state.lifetimeLumen);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {SEEDS.map((seed) => {
        const locked = seed.unlockRank > rank;
        const selected = seed.id === selectedSeed;
        const affordable = state.lumen >= seed.cost;

        return (
          <button
            key={seed.id}
            disabled={locked}
            onClick={() => onSelect(seed.id)}
            className={[
              "flex min-w-[8.5rem] flex-col gap-1 rounded-xl border px-3 py-2 text-left transition",
              locked
                ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-50"
                : selected
                  ? "border-emerald-300/60 bg-emerald-400/10 shadow-[0_0_18px_-6px_rgba(52,211,153,0.7)]"
                  : "border-white/10 bg-white/[0.04] hover:border-white/25",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{seed.glyph}</span>
              <span className="text-sm font-semibold text-slate-100">{seed.name}</span>
            </div>
            {locked ? (
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-slate-400">Rank {seed.unlockRank}</span>
            ) : (
              <div className="flex flex-col gap-0.5 text-[0.65rem] text-slate-300">
                <span className={affordable ? "text-slate-300" : "text-rose-300"}>Cost {fmt(seed.cost)} 🔆</span>
                <span className="text-slate-400">
                  {fmtDuration(effectiveGrowMs(state, seed.id))} → +{fmt(harvestValue(state, seed.id))}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
