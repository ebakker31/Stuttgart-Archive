import { fmt, fmtDuration } from "@/lib/game/format";
import { harvestValue, plotStatus, rushCost, seedDef } from "@/lib/game/engine";
import type { GameState, SeedId } from "@/lib/game/types";

interface GardenGridProps {
  state: GameState;
  now: number;
  selectedSeed: SeedId;
  onPlant: (plotIndex: number) => void;
  onHarvest: (plotIndex: number) => void;
  onRush: (plotIndex: number) => void;
}

/** The playfield: a grid of plots, each empty, growing, or ready to harvest. */
export function GardenGrid({ state, now, selectedSeed, onPlant, onHarvest, onRush }: GardenGridProps) {
  const picked = seedDef(selectedSeed);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {state.plots.map((plot, i) => {
        const status = plotStatus(state, plot, now);

        if (status.empty) {
          return (
            <button
              key={i}
              onClick={() => onPlant(i)}
              className="group flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-slate-400 transition hover:border-emerald-300/50 hover:bg-emerald-300/5"
            >
              <span className="text-2xl opacity-40 transition group-hover:scale-110 group-hover:opacity-90">
                {picked.glyph}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.15em]">Plant</span>
              <span className="text-[0.6rem] text-slate-500">{picked.name}</span>
            </button>
          );
        }

        const seed = plot.seed as SeedId;
        const def = seedDef(seed);

        if (status.ready) {
          return (
            <button
              key={i}
              onClick={() => onHarvest(i)}
              className="relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-emerald-300/40 bg-emerald-400/10 text-emerald-50 shadow-[0_0_24px_-4px_rgba(52,211,153,0.6)] transition hover:bg-emerald-400/20"
            >
              <span className="animate-pulse text-4xl drop-shadow-[0_0_10px_rgba(110,231,183,0.8)]">{def.glyph}</span>
              <span className="text-[0.7rem] font-semibold">Harvest</span>
              <span className="text-[0.7rem] tabular-nums text-emerald-200">+{fmt(harvestValue(state, seed))} 🔆</span>
            </button>
          );
        }

        // Growing — radial progress ring with a Stardust rush option.
        const cost = rushCost(state, plot, now);
        const deg = Math.round(status.pct * 360);
        return (
          <div
            key={i}
            className="relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04]"
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: `conic-gradient(#a78bfa ${deg}deg, rgba(255,255,255,0.08) ${deg}deg)` }}
            >
              <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-slate-900/80 text-2xl">
                {def.glyph}
              </div>
            </div>
            <span className="text-[0.7rem] tabular-nums text-slate-300">{fmtDuration(status.remainingMs)}</span>
            <button
              onClick={() => onRush(i)}
              className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[0.65rem] font-medium text-amber-200 transition hover:bg-amber-300/25"
            >
              Rush ✨ {cost}
            </button>
          </div>
        );
      })}
    </div>
  );
}
