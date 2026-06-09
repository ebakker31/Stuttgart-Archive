import type { Agent, AgentType } from "./types";
import { onboardingAgent } from "./onboarding-agent";
import { documentAgent } from "./document-agent";
import { timelineAgent } from "./timeline-agent";
import { missingRecordsAgent } from "./missing-records-agent";
import { sellerPacketAgent } from "./seller-packet-agent";
import { listingAgent } from "./listing-agent";
import { auctionPrepAgent } from "./auction-prep-agent";
import { instagramAgent } from "./instagram-agent";
import { adAgent } from "./ad-agent";
import { photoCoachAgent } from "./photo-coach-agent";
import { buyerFaqAgent } from "./buyer-faq-agent";
import { buyerDueDiligenceAgent } from "./buyer-due-diligence-agent";
import { privacyGuardAgent } from "./privacy-guard-agent";
import { claimVerificationAgent } from "./claim-verification-agent";
import { valuationContextAgent } from "./valuation-context-agent";
import { campaignAgent } from "./campaign-agent";
import { buyerReplyAgent } from "./buyer-reply-agent";
import { publicPageAgent } from "./public-page-agent";
import { archiveCuratorAgent } from "./archive-curator-agent";
import { brandGuardianAgent } from "./brand-guardian-agent";
import { founderCopilotAgent } from "./founder-copilot-agent";
import { growthAgent } from "./growth-agent";
import { researchAgent } from "./research-agent";
import { seoAgent } from "./seo-agent";
import { qaAgent } from "./qa-agent";
import { selfCritiqueAgent } from "./self-critique-agent";
import { errorRepairAgent } from "./error-repair-agent";
import { supportAgent } from "./support-agent";
import { revenueAgent } from "./revenue-agent";

export const AGENTS: Record<AgentType, Agent<any, any>> = {
  onboarding: onboardingAgent,
  document: documentAgent,
  timeline: timelineAgent,
  missing_records: missingRecordsAgent,
  seller_packet: sellerPacketAgent,
  listing: listingAgent,
  auction_prep: auctionPrepAgent,
  instagram: instagramAgent,
  ad: adAgent,
  photo_coach: photoCoachAgent,
  buyer_faq: buyerFaqAgent,
  buyer_due_diligence: buyerDueDiligenceAgent,
  privacy_guard: privacyGuardAgent,
  claim_verification: claimVerificationAgent,
  valuation_context: valuationContextAgent,
  campaign: campaignAgent,
  buyer_reply: buyerReplyAgent,
  public_page: publicPageAgent,
  archive_curator: archiveCuratorAgent,
  brand_guardian: brandGuardianAgent,
  founder_copilot: founderCopilotAgent,
  growth: growthAgent,
  research: researchAgent,
  seo: seoAgent,
  qa: qaAgent,
  self_critique: selfCritiqueAgent,
  error_repair: errorRepairAgent,
  support: supportAgent,
  revenue: revenueAgent,
};

export function getAgent(type: AgentType): Agent<any, any> | undefined {
  return AGENTS[type];
}

export { runAgent } from "./agent-runner";
export { getAgentScopedContext } from "./scoped-context";
export * from "./types";
