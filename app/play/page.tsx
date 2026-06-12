"use client";

import { useState } from "react";
import { useGame } from "@/lib/game/use-game";
import { plotStatus } from "@/lib/game/engine";
import { GAME, THEMES } from "@/lib/game/config";
import { fmt, fmtDuration } from "@/lib/game/format";
import type { SeedId } from "@/lib/game/types";
import { Hud } from "@/components/game/hud";
import { SeedTray } from "@/components/game/seed-tray";
import { GardenGrid } from "@/components/game/garden-grid";
import { BuildPanel } from "@/components/game/build-panel";
import { ShopModal } from "@/components/game/shop-modal";

export default function PlayPage() {
  const game = useGame();
  const [selectedSeed, setSelectedSeed] = useState<SeedId>("glimmerbud");
  const [shopOpen, setShopOpen] = useState(false);
  const now = Date.now();

  if (!game.state) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        <span className="animate-pulse">Unfurling the garden…</span>
      </div>
    );
  }

  const state = game.state;
  const theme = THEMES.find((t) => t.id === state.theme) ?? THEMES[0];
  const readyCount = state.plots.filter((p) => plotStatus(state, p, now).ready).length;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.sky} transition-colors duration-700`}>
      <div className="min-h-screen bg-slate-950/40">
        <Hud state={state} onOpenShop={() => setShopOpen(true)} />

        <main className="mx-auto max-w-5xl px-4 pb-24 pt-5">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl font-light tracking-tight text-white sm:text-3xl">{GAME.name}</h1>
              <p className="text-sm text-slate-300/80">{GAME.tagline} — tend a floating island of living light.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={game.harvestAll}
                className="rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/20"
              >
                Harvest all{readyCount > 0 ? ` (${readyCount})` : ""}
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Start a brand-new garden? This clears your current save.")) game.reset();
                }}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                New garden
              </button>
            </div>
          </header>

          <section className="mb-4">
            <SeedTray state={state} selectedSeed={selectedSeed} onSelect={setSelectedSeed} />
          </section>

          <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
            <section>
              <GardenGrid
                state={state}
                now={now}
                selectedSeed={selectedSeed}
                onPlant={(i) => game.plant(i, selectedSeed)}
                onHarvest={game.harvest}
                onRush={game.rush}
              />
            </section>

            <aside className="flex flex-col gap-5">
              <Panel title="Sky Workshop" subtitle="Spend Lumen to grow your garden">
                <BuildPanel state={state} onUpgrade={game.upgrade} onBuyPlot={game.buyPlot} />
              </Panel>

              <Panel title="Keeper's Log">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <LogStat label="Blooms grown" value={fmt(state.stats.harvested)} />
                  <LogStat label="Seeds planted" value={fmt(state.stats.planted)} />
                  <LogStat label="Rushed" value={fmt(state.stats.rushed)} />
                  <LogStat label="Lifetime light" value={fmt(state.lifetimeLumen)} />
                </dl>
              </Panel>

              <p className="text-[0.65rem] leading-relaxed text-slate-400">
                An original, peaceful builder — no battles, no clans, no attacking other players. Grow on real-time
                timers, automate with sprites, and skip the wait with Stardust. Your garden saves to this browser.
              </p>
            </aside>
          </div>
        </main>
      </div>

      {/* Toasts */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex flex-col items-center gap-2">
        {game.toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto rounded-full px-4 py-2 text-sm font-medium shadow-lg backdrop-blur",
              t.tone === "good"
                ? "bg-emerald-500/90 text-white"
                : t.tone === "bad"
                  ? "bg-rose-500/90 text-white"
                  : "bg-slate-700/90 text-slate-100",
            ].join(" ")}
          >
            {t.text}
          </div>
        ))}
      </div>

      {/* Welcome-back / offline progress */}
      {game.offline ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 text-center text-slate-100 shadow-2xl">
            <div className="mb-2 text-4xl">🌙</div>
            <h2 className="text-lg font-semibold">Welcome back, Keeper</h2>
            <p className="mt-1 text-sm text-slate-300">
              While you were away for {fmtDuration(game.offline.seconds * 1000)}, your garden gathered
            </p>
            <p className="my-3 text-2xl font-semibold text-amber-200">+{fmt(game.offline.lumen)} 🔆</p>
            {game.offline.autoHarvested > 0 ? (
              <p className="text-xs text-emerald-300">Sprites auto-harvested {game.offline.autoHarvested} blooms.</p>
            ) : null}
            <button
              onClick={game.dismissOffline}
              className="mt-4 w-full rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              Collect
            </button>
          </div>
        </div>
      ) : null}

      {shopOpen ? (
        <ShopModal
          state={state}
          onBuyPack={game.buyPack}
          onBuyTheme={game.setTheme}
          onClose={() => setShopOpen(false)}
        />
      ) : null}
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur">
      <div className="mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">{title}</h2>
        {subtitle ? <p className="text-[0.7rem] text-slate-400">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function LogStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-slate-500">{label}</dt>
      <dd className="font-semibold tabular-nums text-slate-100">{value}</dd>
    </div>
  );
}
