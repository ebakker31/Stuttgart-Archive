import type { Metadata } from "next";
import { GAME } from "@/lib/game/config";

export const metadata: Metadata = {
  title: `${GAME.name} — ${GAME.tagline}`,
  description:
    "A cozy, peaceful sky-garden builder. Grow gardens of light, automate your blooms, and tend your floating island. Family-friendly, no combat.",
};

/** Dark, full-bleed shell — the game owns its own glowing aesthetic. */
export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
}
