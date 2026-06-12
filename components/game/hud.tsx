import { fmt } from "@/lib/game/format";
import { passiveLumenPerSec, rankProgress } from "@/lib/game/engine";
import type { GameState } from "@/lib/game/types";

/** Top status bar: currencies, idle rate, and Garden Rank progress. */
export function Hud({ state, onOpenShop }: { state: GameState; onOpenShop: () => void }) {
  const { rank, pct, next, current } = rankProgress(state.lifetimeLumen);
  const perSec = passiveLumenPerSec(state);

  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 text-slate-100">
        <Stat glyph="🔆" label="Lumen" value={fmt(state.lumen)} sub={perSec > 0 ? `+${fmt(perSec)}/s` : undefined} />
        <button
          onClick={onOpenShop}
          className="group flex items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 transition hover:bg-amber-300/20"
        >
          <span className="text-lg">✨</span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-semibold text-amber-200">{fmt(state.stardust)}</span>
            <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-amber-200/70">Stardust · Shop</span>
          </span>
        </button>

        <div className="ml-auto flex min-w-[180px] flex-1 flex-col gap-1 sm:max-w-xs">
          <div className="flex items-center justify-between text-[0.7rem] text-slate-300">
            <span className="font-semibold tracking-wide text-violet-200">Garden Rank {rank}</span>
            <span className="tabular-nums text-slate-400">
              {fmt(state.lifetimeLumen - current)} / {fmt(next - current)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300 transition-all duration-500"
              style={{ width: `${Math.round(pct * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ glyph, label, value, sub }: { glyph: string; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
      <span className="text-lg">{glyph}</span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tabular-nums">{value}</span>
        <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">
          {label}
          {sub ? <span className="ml-1 text-emerald-300/90 normal-case tracking-normal">{sub}</span> : null}
        </span>
      </span>
    </div>
  );
}
