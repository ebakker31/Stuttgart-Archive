"use client";

/**
 * useGame — the React binding for the Lumengarden engine.
 *
 * Owns the single source of truth (a GameState in React state), drives a 1Hz
 * simulation tick, persists to localStorage, and computes offline progress on
 * load. All gameplay math lives in ./engine; this hook only wires it to the
 * browser and surfaces toasts for the UI.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import * as engine from "./engine";
import type { ActionResult } from "./engine";
import type { BuildingId, GameState, SeedId, ThemeId } from "./types";

const STORAGE_KEY = "lumengarden:save:v1";

export interface Toast {
  id: number;
  text: string;
  tone: "good" | "bad" | "info";
}

export interface OfflineReport {
  lumen: number;
  autoHarvested: number;
  seconds: number;
}

export interface UseGame {
  state: GameState | null;
  toasts: Toast[];
  offline: OfflineReport | null;
  dismissOffline: () => void;
  plant: (plotIndex: number, seed: SeedId) => void;
  harvest: (plotIndex: number) => void;
  harvestAll: () => void;
  rush: (plotIndex: number) => void;
  upgrade: (id: BuildingId) => void;
  buyPlot: () => void;
  buyPack: (packId: string, name: string) => void;
  setTheme: (id: ThemeId) => void;
  reset: () => void;
}

export function useGame(): UseGame {
  const [state, setState] = useState<GameState | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [offline, setOffline] = useState<OfflineReport | null>(null);

  // Latest committed state, readable synchronously inside action handlers.
  const stateRef = useRef<GameState | null>(null);
  stateRef.current = state;

  const pushToast = useCallback((text: string, tone: Toast["tone"]) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, text, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  // Load once: restore the save, then fast-forward the world to "now".
  useEffect(() => {
    const now = Date.now();
    let loaded: GameState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loaded = engine.deserialize(raw, now);
    } catch {
      loaded = null;
    }
    const start = loaded ?? engine.createInitialState(now);
    const result = engine.tick(start, now);
    if (loaded && (result.gainedLumen > 1 || result.autoHarvested > 0) && result.elapsedSec > 30) {
      setOffline({
        lumen: Math.floor(result.gainedLumen),
        autoHarvested: result.autoHarvested,
        seconds: result.elapsedSec,
      });
    }
    setState(result.state);
  }, []);

  // 1Hz simulation tick — advances idle income, automation, and countdowns.
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => (prev ? engine.tick(prev, Date.now()).state : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist on every change (cheap; the state is a small plain object).
  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(STORAGE_KEY, engine.serialize(state));
    } catch {
      /* storage full or unavailable — gameplay continues in-memory */
    }
  }, [state]);

  /** Run an engine action against the latest state, toasting the outcome. */
  const run = useCallback(
    (compute: (s: GameState, now: number) => ActionResult, onOk?: string) => {
      const prev = stateRef.current;
      if (!prev) return;
      const res = compute(prev, Date.now());
      if (!res.ok) {
        pushToast(res.reason ?? "That isn't possible right now.", "bad");
        return;
      }
      if (onOk) pushToast(onOk, "good");
      stateRef.current = res.state;
      setState(res.state);
    },
    [pushToast]
  );

  const plant = useCallback(
    (plotIndex: number, seed: SeedId) => run((s, now) => engine.plantSeed(s, plotIndex, seed, now)),
    [run]
  );
  const harvest = useCallback(
    (plotIndex: number) => run((s, now) => engine.harvestPlot(s, plotIndex, now)),
    [run]
  );
  const harvestAll = useCallback(() => run((s, now) => engine.harvestAll(s, now), "Harvested every ready bloom."), [run]);
  const rush = useCallback(
    (plotIndex: number) => run((s, now) => engine.rushPlot(s, plotIndex, now), "Bloom rushed with Stardust ✨"),
    [run]
  );
  const upgrade = useCallback((id: BuildingId) => run((s) => engine.upgradeBuilding(s, id)), [run]);
  const buyPlot = useCallback(() => run((s) => engine.buyPlot(s), "New plot cleared 🌿"), [run]);
  const buyPack = useCallback(
    (packId: string, name: string) => run((s) => engine.buyStardustPack(s, packId), `${name} delivered ✨`),
    [run]
  );
  const setTheme = useCallback((id: ThemeId) => run((s) => engine.buyTheme(s, id)), [run]);

  const dismissOffline = useCallback(() => setOffline(null), []);

  const reset = useCallback(() => {
    const fresh = engine.createInitialState(Date.now());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    stateRef.current = fresh;
    setState(fresh);
    setOffline(null);
    pushToast("Garden reset to a fresh sky.", "info");
  }, [pushToast]);

  return {
    state,
    toasts,
    offline,
    dismissOffline,
    plant,
    harvest,
    harvestAll,
    rush,
    upgrade,
    buyPlot,
    buyPack,
    setTheme,
    reset,
  };
}
