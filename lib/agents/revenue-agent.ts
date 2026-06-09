import type { Agent, AgentResult } from "./types";

interface RevenueInput {
  signals?: { vehicleCount?: number; nearVehicleLimit?: boolean; preparingSale?: boolean; preparingAuction?: boolean };
}

interface RevenueOutput {
  upgradeMoments: string[];
  suggestedPlan: string | null;
  upgradeCopy: string | null;
  retentionPlays: string[];
}

/**
 * Revenue Agent — surfaces honest, contextual upgrade moments. No dark patterns:
 * it never blocks core free utility or pressures the user.
 */
export const revenueAgent: Agent<RevenueInput, RevenueOutput> = {
  type: "revenue",
  description: "Identifies honest upgrade moments without dark patterns or blocking free utility.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<RevenueOutput>> {
    const s = input.signals ?? {};
    const moments: string[] = [];
    let plan: string | null = null;
    let copy: string | null = null;

    if (s.nearVehicleLimit) { moments.push("Near free vehicle limit"); plan = "Archive Plus"; copy = "You're getting real use out of your garage. Archive Plus adds room for more vehicles and storage — only if you need it."; }
    if (s.preparingSale) { moments.push("Preparing to sell"); plan = plan || "Seller Pack"; copy = copy || "Selling soon? The Seller Pack turns your records into a polished, shareable packet for this vehicle."; }
    if (s.preparingAuction) { moments.push("Preparing an auction listing"); plan = "Auction Pack"; copy = "Going to auction? The Auction Pack adds platform-style drafts, checklists, and a claim verification report for this car."; }
    if ((s.vehicleCount ?? 0) >= 4) { moments.push("Multiple vehicles — collector candidate"); plan = plan || "Collector"; }

    return {
      ok: true,
      agentType: "revenue",
      output: { upgradeMoments: moments, suggestedPlan: plan, upgradeCopy: copy, retentionPlays: ["Maintenance reminders keep owners returning", "Weekly archive summary (opt-in)", "Celebrate completeness milestones"] },
      confidence: 0.6,
      sources: [],
      assumptions: ["Suggestions are contextual nudges, shown once, never blocking."],
      missingData: [],
      nextActions: plan ? [`Offer ${plan} at the relevant moment — not as a wall.`] : ["No upgrade pressure warranted right now."],
      riskFlags: [{ severity: "low", category: "quality", message: "Keep trust-first: no dark patterns, no blocking core free utility." }],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
