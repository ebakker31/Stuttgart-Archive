import type { ScopedContext } from "@/lib/agents/types";

/**
 * Readiness scores. All scores are derived ONLY from the presence/completeness
 * of real user-provided data — never from invented assessments of the car.
 */

export interface ScoreBreakdown {
  score: number; // 0..100
  label: string;
  factors: { label: string; met: boolean; weight: number }[];
}

function tally(factors: { label: string; met: boolean; weight: number }[]): number {
  const total = factors.reduce((s, f) => s + f.weight, 0) || 1;
  const got = factors.reduce((s, f) => s + (f.met ? f.weight : 0), 0);
  return Math.round((got / total) * 100);
}

function band(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 55) return "Developing";
  if (score >= 30) return "Early";
  return "Just started";
}

export function completenessScore(ctx: ScopedContext): ScoreBreakdown {
  const v = ctx.vehicle;
  const factors = [
    { label: "Core specs entered", met: Boolean(v?.year && v?.model), weight: 2 },
    { label: "Mileage recorded", met: Boolean(v?.mileage), weight: 1 },
    { label: "At least one document", met: ctx.documents.length > 0, weight: 2 },
    { label: "Service history started", met: ctx.serviceEvents.length > 0, weight: 2 },
    { label: "Photos added", met: ctx.photos.length > 0, weight: 1 },
    { label: "Ownership story written", met: Boolean(v?.ownershipStory), weight: 1 },
    { label: "Modifications documented", met: ctx.modifications.length > 0, weight: 1 },
  ];
  const score = tally(factors);
  return { score, label: band(score), factors };
}

export function sellerReadinessScore(ctx: ScopedContext): ScoreBreakdown {
  const v = ctx.vehicle;
  const factors = [
    { label: "Core specs complete", met: Boolean(v?.year && v?.model && v?.mileage), weight: 2 },
    { label: "Service records uploaded", met: ctx.serviceEvents.length >= 2, weight: 3 },
    { label: "Photos available", met: ctx.photos.length >= 4, weight: 2 },
    { label: "Known flaws disclosed", met: Boolean(v?.knownFlaws), weight: 2 },
    { label: "Title status noted", met: Boolean(v?.titleStatus), weight: 1 },
    { label: "Modifications disclosed", met: ctx.modifications.length > 0 || v?.knownFlaws != null, weight: 1 },
  ];
  const score = tally(factors);
  return { score, label: band(score), factors };
}

export function auctionReadinessScore(ctx: ScopedContext): ScoreBreakdown {
  const v = ctx.vehicle;
  const hasUndercarriage = ctx.photos.some((p) => p.category === "undercarriage");
  const factors = [
    { label: "Comprehensive specs", met: Boolean(v?.year && v?.model && v?.trim), weight: 1 },
    { label: "Service history (3+ events)", met: ctx.serviceEvents.length >= 3, weight: 3 },
    { label: "8+ photos", met: ctx.photos.length >= 8, weight: 2 },
    { label: "Undercarriage photo", met: hasUndercarriage, weight: 2 },
    { label: "Known flaws disclosed", met: Boolean(v?.knownFlaws), weight: 2 },
    { label: "Documents on file (3+)", met: ctx.documents.length >= 3, weight: 2 },
    { label: "Ownership story", met: Boolean(v?.ownershipStory), weight: 1 },
  ];
  const score = tally(factors);
  return { score, label: band(score), factors };
}

export function buyerRiskScore(ctx: ScopedContext): ScoreBreakdown {
  // Higher score = more documentation = lower risk.
  const v = ctx.vehicle;
  const factors = [
    { label: "Title status provided", met: Boolean(v?.titleStatus), weight: 2 },
    { label: "Service records present", met: ctx.serviceEvents.length >= 2, weight: 2 },
    { label: "Flaws disclosed", met: Boolean(v?.knownFlaws), weight: 2 },
    { label: "Supporting documents", met: ctx.documents.length >= 2, weight: 2 },
    { label: "Photos to assess condition", met: ctx.photos.length >= 4, weight: 1 },
  ];
  const score = tally(factors);
  const label = score >= 70 ? "Well documented" : score >= 40 ? "Some gaps" : "Significant gaps";
  return { score, label, factors };
}
