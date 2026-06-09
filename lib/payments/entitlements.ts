import { getAdminSupabase } from "@/lib/supabase/server";
import { getPlan, PLANS } from "./plans";
import type {
  Entitlement,
  EntitlementType,
  OneTimeProductId,
  PlanDefinition,
  PlanId,
} from "./types";

/**
 * Source-agnostic entitlements. The rest of the app asks "what can this org
 * do?" — never "did they pay via Stripe or Apple?". Stripe webhooks and the
 * (future) App Store verifier both call grantEntitlement(), and resolution
 * here returns the effective plan + per-vehicle products + usage limits.
 *
 * When Supabase is not configured, everything resolves to the Free plan so the
 * product is fully usable in demo/mock mode.
 */

export interface ResolvedEntitlements {
  plan: PlanDefinition;
  vehicleProducts: Record<string, OneTimeProductId[]>; // vehicleId -> products owned
  raw: Entitlement[];
}

export async function resolveEntitlements(organizationId: string): Promise<ResolvedEntitlements> {
  const free = getPlan("free")!;
  const admin = getAdminSupabase();
  if (!admin) {
    return { plan: free, vehicleProducts: {}, raw: [] };
  }

  const now = new Date().toISOString();

  const { data: rows } = await admin
    .from("entitlements")
    .select("entitlement_type, source, vehicle_id, starts_at, expires_at, metadata_json")
    .eq("organization_id", organizationId);

  const raw: Entitlement[] = (rows ?? []).map((r: any) => ({
    type: r.entitlement_type,
    source: r.source,
    vehicleId: r.vehicle_id,
    startsAt: r.starts_at,
    expiresAt: r.expires_at,
    metadata: r.metadata_json ?? undefined,
  }));

  const active = raw.filter((e) => !e.expiresAt || e.expiresAt > now);

  // Highest-tier active plan wins.
  const planRank: PlanId[] = ["free", "plus", "collector", "dealer", "concierge"];
  let bestPlan: PlanId = "free";
  for (const e of active) {
    if (e.type.startsWith("plan:")) {
      const pid = e.type.split(":")[1] as PlanId;
      if (planRank.indexOf(pid) > planRank.indexOf(bestPlan)) bestPlan = pid;
    }
  }

  const vehicleProducts: Record<string, OneTimeProductId[]> = {};
  for (const e of active) {
    if (e.type.startsWith("product:") && e.vehicleId) {
      const pid = e.type.split(":")[1] as OneTimeProductId;
      (vehicleProducts[e.vehicleId] ||= []).push(pid);
    }
  }

  return { plan: getPlan(bestPlan) ?? free, vehicleProducts, raw };
}

export function hasVehicleProduct(
  resolved: ResolvedEntitlements,
  vehicleId: string,
  product: OneTimeProductId
): boolean {
  return (resolved.vehicleProducts[vehicleId] || []).includes(product);
}

/** Usage-limit check against the resolved plan. Returns whether the action is allowed. */
export interface UsageCheck {
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
  reason?: string;
}

export async function checkVehicleLimit(
  organizationId: string,
  resolved: ResolvedEntitlements
): Promise<UsageCheck> {
  const limit = resolved.plan.vehicleLimit;
  const admin = getAdminSupabase();
  let used = 0;
  if (admin) {
    const { count } = await admin
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("is_demo", false);
    used = count ?? 0;
  }
  const remaining = limit === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, limit - used);
  return {
    allowed: used < limit,
    limit,
    used,
    remaining,
    reason: used >= limit ? `Your ${resolved.plan.name} plan allows ${limit} vehicles.` : undefined,
  };
}

/** Grant (or refresh) an entitlement from a verified payment of either source. */
export async function grantEntitlement(args: {
  organizationId: string;
  userId?: string | null;
  type: EntitlementType;
  source: Entitlement["source"];
  vehicleId?: string | null;
  expiresAt?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<{ ok: boolean; mocked: boolean }> {
  const admin = getAdminSupabase();
  if (!admin) return { ok: false, mocked: true };

  await admin.from("entitlements").insert({
    organization_id: args.organizationId,
    user_id: args.userId ?? null,
    vehicle_id: args.vehicleId ?? null,
    entitlement_type: args.type,
    source: args.source,
    starts_at: new Date().toISOString(),
    expires_at: args.expiresAt ?? null,
    metadata_json: args.metadata ?? {},
  });

  return { ok: true, mocked: false };
}

export function planForEntitlementType(type: EntitlementType): PlanDefinition | undefined {
  if (!type.startsWith("plan:")) return undefined;
  return PLANS.find((p) => p.id === (type.split(":")[1] as PlanId));
}
