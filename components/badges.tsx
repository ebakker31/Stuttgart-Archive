import { Badge } from "@/components/ui/badge";
import { DEMO_DISCLAIMER } from "@/lib/brand";
import { ShieldCheck, FileText, Eye, EyeOff, AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import type { SourceKind } from "@/lib/agents/types";

export function DemoDataBadge() {
  return (
    <Badge variant="demo" title={DEMO_DISCLAIMER}>
      <CircleDashed className="h-3 w-3" /> Demo data
    </Badge>
  );
}

export function PrivacyStatusBadge({ status }: { status: "private" | "draft_public" | "public" }) {
  if (status === "public") return <Badge variant="success"><Eye className="h-3 w-3" /> Public</Badge>;
  if (status === "draft_public") return <Badge variant="warning"><CircleDashed className="h-3 w-3" /> Draft public</Badge>;
  return <Badge variant="muted"><EyeOff className="h-3 w-3" /> Private</Badge>;
}

function scoreVariant(score: number) {
  if (score >= 80) return "success" as const;
  if (score >= 50) return "warning" as const;
  return "danger" as const;
}

export function SellerReadinessBadge({ score }: { score: number }) {
  return <Badge variant={scoreVariant(score)}><FileText className="h-3 w-3" /> Seller {score}</Badge>;
}
export function AuctionReadinessBadge({ score }: { score: number }) {
  return <Badge variant={scoreVariant(score)}><FileText className="h-3 w-3" /> Auction {score}</Badge>;
}
export function BuyerRiskBadge({ score }: { score: number }) {
  return <Badge variant={scoreVariant(score)}><ShieldCheck className="h-3 w-3" /> Docs {score}</Badge>;
}

export function ClaimRiskBadge({ supported }: { supported: boolean }) {
  return supported ? (
    <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Supported</Badge>
  ) : (
    <Badge variant="danger"><AlertTriangle className="h-3 w-3" /> Needs review</Badge>
  );
}

export function PrivacyRiskBadge({ safe }: { safe: boolean }) {
  return safe ? (
    <Badge variant="success"><ShieldCheck className="h-3 w-3" /> Privacy OK</Badge>
  ) : (
    <Badge variant="danger"><AlertTriangle className="h-3 w-3" /> Privacy risk</Badge>
  );
}

const SOURCE_LABEL: Record<SourceKind, { label: string; variant: "success" | "outline" | "accent" | "muted" | "warning" }> = {
  verified_fact: { label: "Verified", variant: "success" },
  document_supported: { label: "Document-supported", variant: "accent" },
  user_provided_claim: { label: "User-provided", variant: "outline" },
  ai_inference: { label: "AI inference", variant: "warning" },
  missing: { label: "Missing", variant: "muted" },
  unknown: { label: "Unknown", variant: "muted" },
};

export function SourceReferenceBadge({ kind }: { kind: SourceKind }) {
  const s = SOURCE_LABEL[kind];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
