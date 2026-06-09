import type { Agent, AgentResult, ScopedServiceEvent } from "./types";

interface TimelineInput {
  events: ScopedServiceEvent[];
}

interface TimelineEvent extends ScopedServiceEvent {
  year: number | null;
  highImpact: boolean;
}

interface TimelineOutput {
  events: TimelineEvent[];
  duplicates: string[];
  mileageInconsistencies: string[];
  serviceGaps: string[];
  highlights: string[];
}

const HIGH_IMPACT = /clutch|ims|rms|engine|transmission|major service|timing|suspension|brake/i;

export const timelineAgent: Agent<TimelineInput, TimelineOutput> = {
  type: "timeline",
  description: "Builds an ordered service/modification timeline and flags gaps and inconsistencies.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<TimelineOutput>> {
    const sorted = [...input.events].sort((a, b) => (a.eventDate || "").localeCompare(b.eventDate || ""));
    const events: TimelineEvent[] = sorted.map((e) => ({
      ...e,
      year: e.eventDate ? new Date(e.eventDate).getFullYear() : null,
      highImpact: HIGH_IMPACT.test(`${e.category} ${e.summary}`),
    }));

    const duplicates: string[] = [];
    const mileageInconsistencies: string[] = [];
    const serviceGaps: string[] = [];

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (prev.eventDate && cur.eventDate && prev.eventDate === cur.eventDate && prev.summary === cur.summary) {
        duplicates.push(`Possible duplicate on ${cur.eventDate}: ${cur.summary}`);
      }
      if (prev.mileage && cur.mileage && cur.mileage < prev.mileage) {
        mileageInconsistencies.push(`Mileage decreased from ${prev.mileage} to ${cur.mileage} (${cur.eventDate}).`);
      }
      if (prev.eventDate && cur.eventDate) {
        const months = (new Date(cur.eventDate).getTime() - new Date(prev.eventDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (months > 24) serviceGaps.push(`~${Math.round(months / 12)} year gap between ${prev.eventDate} and ${cur.eventDate}.`);
      }
    }

    const highlights = events.filter((e) => e.highImpact).map((e) => `${e.eventDate ?? "Undated"}: ${e.summary ?? e.category}`);

    return {
      ok: true,
      agentType: "timeline",
      output: { events, duplicates, mileageInconsistencies, serviceGaps, highlights },
      confidence: sorted.length ? 0.85 : 0.3,
      sources: sorted.map((e) => ({ field: "service_event", value: e.summary, kind: "document_supported" as const, documentId: e.documentId })),
      assumptions: [],
      missingData: sorted.length ? [] : ["No service events recorded yet."],
      nextActions: serviceGaps.length ? ["Look for records covering the gap periods."] : ["Continue adding records as they arrive."],
      riskFlags: mileageInconsistencies.map((m) => ({ severity: "medium" as const, category: "data" as const, message: m })),
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
