/**
 * Agent type system. Every agent in Stuttgart Archive accepts structured input,
 * returns structured JSON, and is wrapped by the agent-runner which persists the
 * run and enforces the real-data-only + approval guarantees.
 */

export type AgentType =
  // App-facing
  | "onboarding"
  | "document"
  | "timeline"
  | "missing_records"
  | "seller_packet"
  | "listing"
  | "auction_prep"
  | "instagram"
  | "ad"
  | "photo_coach"
  | "buyer_faq"
  | "buyer_due_diligence"
  | "privacy_guard"
  | "claim_verification"
  | "valuation_context"
  | "campaign"
  | "buyer_reply"
  | "public_page"
  | "archive_curator"
  | "brand_guardian"
  // Founder / operator
  | "founder_copilot"
  | "growth"
  | "research"
  | "seo"
  | "qa"
  | "self_critique"
  | "error_repair"
  | "support"
  | "revenue";

/** How confident a claim/value is, and where it came from. */
export type SourceKind =
  | "verified_fact"
  | "user_provided_claim"
  | "document_supported"
  | "ai_inference"
  | "missing"
  | "unknown";

export interface SourceReference {
  field: string;
  value?: string | number | null;
  kind: SourceKind;
  documentId?: string | null;
  note?: string;
}

export interface RiskFlag {
  severity: "low" | "medium" | "high";
  category: "claim" | "privacy" | "brand" | "data" | "legal" | "quality";
  message: string;
  saferWording?: string;
}

/** The universal envelope every agent returns. */
export interface AgentResult<T = unknown> {
  ok: boolean;
  agentType: AgentType;
  output: T;
  confidence: number; // 0..1
  sources: SourceReference[];
  assumptions: string[];
  missingData: string[];
  nextActions: string[];
  riskFlags: RiskFlag[];
  approvalRequired: boolean;
  /** True if any external side-effect (publish, send, charge) would occur. */
  externalSideEffect: boolean;
  notes?: string;
  mocked?: boolean;
}

export interface AgentContext {
  organizationId: string;
  userId: string;
  vehicleId?: string | null;
  documentIds?: string[];
  /** Scoped, permission-checked data assembled by getAgentScopedContext(). */
  scope?: ScopedContext;
  /** Autopilot settings gate whether external side-effects are permitted. */
  autopilot?: AutopilotFlags;
}

export interface AutopilotFlags {
  draftContentEnabled: boolean;
  queueForReviewEnabled: boolean;
  externalPublishEnabled: boolean;
  externalMessagingEnabled: boolean;
  internalTasksEnabled: boolean;
}

/** Minimal, redacted vehicle data shape passed to agents. */
export interface ScopedVehicle {
  id: string;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  trim?: string | null;
  generation?: string | null;
  mileage?: number | null;
  transmission?: string | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  options?: string[] | null;
  knownFlaws?: string | null;
  ownershipStory?: string | null;
  archiveNotes?: string | null;
  titleStatus?: string | null;
  ownershipStatus?: string | null;
  isDemo?: boolean;
  // VIN deliberately excluded unless an agent explicitly needs + is allowed it.
}

export interface ScopedServiceEvent {
  id: string;
  eventDate?: string | null;
  mileage?: number | null;
  vendor?: string | null;
  category?: string | null;
  summary?: string | null;
  cost?: number | null;
  documentId?: string | null;
  verificationStatus?: string | null;
}

export interface ScopedModification {
  id: string;
  name?: string | null;
  category?: string | null;
  brand?: string | null;
  installDate?: string | null;
  reversibleStatus?: string | null;
  oemPartsRetained?: string | null;
  documentId?: string | null;
}

export interface ScopedDocument {
  id: string;
  fileName?: string | null;
  documentType?: string | null;
  status?: string | null;
  isPrivate?: boolean;
  extractedText?: string | null;
}

export interface ScopedPhoto {
  id: string;
  category?: string | null;
  containsLicensePlate?: boolean;
  containsPersonalInfo?: boolean;
  approvedForPublic?: boolean;
}

export interface ScopedContext {
  organizationId: string;
  vehicle?: ScopedVehicle;
  serviceEvents: ScopedServiceEvent[];
  modifications: ScopedModification[];
  documents: ScopedDocument[];
  photos: ScopedPhoto[];
  /** Audit trail entry id created when this context was assembled. */
  accessLogId?: string;
}

export interface Agent<TInput = unknown, TOutput = unknown> {
  type: AgentType;
  description: string;
  /** Does running this agent ever produce an external side-effect? */
  canHaveExternalSideEffect: boolean;
  run(input: TInput, ctx: AgentContext): Promise<AgentResult<TOutput>>;
}
