"use client";

import { useState } from "react";
import { fmt } from "@/lib/game/format";
import { STARDUST_PACKS, THEMES } from "@/lib/game/config";
import type { GameState, ThemeId } from "@/lib/game/types";

/**
 * The Stardust shop. Purchases here are SIMULATED — no real charge occurs. In a
 * production build, each pack would open Stripe Checkout (web) or a native
 * store flow, and Stardust would be granted server-side after the receipt is
 * verified. The repo already ships the payment plumbing in lib/payments/*.
 */
export function ShopModal({
  state,
  onBuyPack,
  onBuyTheme,
  onClose,
}: {
  state: GameState;
  onBuyPack: (packId: string, name: string) => void;
  onBuyTheme: (id: ThemeId) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"stardust" | "cosmetics">("stardust");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-slate-900 text-slate-100 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Stardust Shop</h2>
            <p className="text-[0.7rem] text-amber-200/80">You hold {fmt(state.stardust)} ✨</p>
          </div>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex gap-1 border-b border-white/10 px-3 pt-2">
          {(["stardust", "cosmetics"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "rounded-t-lg px-4 py-2 text-sm font-medium capitalize transition",
                tab === t ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {tab === "stardust" ? (
            <div className="grid grid-cols-2 gap-3">
              {STARDUST_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => onBuyPack(pack.id, pack.name)}
                  className="relative flex flex-col items-center gap-1 rounded-xl border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-transparent p-4 text-center transition hover:border-amber-300/50 hover:from-amber-300/20"
                >
                  {pack.tag ? (
                    <span className="absolute -top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[0.6rem] font-bold text-slate-900">
                      {pack.tag}
                    </span>
                  ) : null}
                  <span className="text-3xl">{pack.glyph}</span>
                  <span className="text-sm font-semibold text-amber-100">
                    {fmt(pack.stardust + pack.bonus)} ✨
                  </span>
                  {pack.bonus > 0 ? (
                    <span className="text-[0.65rem] text-emerald-300">+{pack.bonus} bonus</span>
                  ) : (
                    <span className="text-[0.65rem] text-slate-500">base pack</span>
                  )}
                  <span className="mt-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                    ${pack.priceUsd.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => {
                const owned = state.ownedThemes.includes(theme.id);
                const active = state.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onBuyTheme(theme.id)}
                    className={[
                      "flex flex-col gap-2 rounded-xl border p-3 text-left transition",
                      active
                        ? "border-violet-300/60 bg-violet-400/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25",
                    ].join(" ")}
                  >
                    <div className={`h-14 w-full rounded-lg bg-gradient-to-br ${theme.sky}`} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{theme.name}</span>
                      {active ? (
                        <span className="text-[0.65rem] text-violet-200">Active</span>
                      ) : owned ? (
                        <span className="text-[0.65rem] text-slate-400">Equip</span>
                      ) : (
                        <span className="text-[0.65rem] text-amber-200">{theme.cost} ✨</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[0.65rem] leading-relaxed text-slate-400">
            Demo build — purchases are simulated and <strong className="text-slate-300">no real money</strong> is charged.
            In production each pack would route through Stripe / the app store and grant Stardust after the receipt is
            verified.
          </p>
        </div>
      </div>
    </div>
  );
}
