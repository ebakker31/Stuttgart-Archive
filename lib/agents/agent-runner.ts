import { getAdminSupabase } from "@/lib/supabase/server";
import type { Agent, AgentContext, AgentResult } from "./types";

/**
 * runAgent — the universal execution wrapper.
 *
 * Responsibilities:
 *  - Execute the agent's run() with the provided (already-scoped) context.
 *  - Hard-stop any external side-effect that isn't explicitly authorized by
 *    autopilot settings (publish / message / charge). Agents themselves never
 *    perform side-effects; the runner is the second line of defense.
 *  - Persist the run to ai_agent_runs with confidence, sources, risk flags.
 *  - Always surface approvalRequired = true for anything that would leave the
 *    platform.
 */

export async function runAgent<TInput, TOutput>(
  agent: Agent<TInput, TOutput>,
  input: TInput,
  ctx: AgentContext
): Promise<AgentResult<TOutput>> {
  let result: AgentResult<TOutput>;

  try {
    result = await agent.run(input, ctx);
  } catch (err: any) {
    result = {
      ok: false,
      agentType: agent.type,
      output: null as unknown as TOutput,
      confidence: 0,
      sources: [],
      assumptions: [],
      missingData: [],
      nextActions: ["Retry, or report this error to support."],
      riskFlags: [{ severity: "medium", category: "quality", message: `Agent error: ${err?.message ?? "unknown"}` }],
      approvalRequired: false,
      externalSideEffect: false,
      notes: "Agent threw an exception; no data was changed.",
    };
  }

  // Defense-in-depth: an agent that *could* cause a side-effect always requires
  // approval unless autopilot explicitly enables that class of action.
  if (agent.canHaveExternalSideEffect) {
    const allowed = isExternalActionAllowed(agent, ctx);
    if (!allowed) {
      result.approvalRequired = true;
      result.externalSideEffect = false; // blocked — only a draft was produced
    }
  }

  await persistRun(agent, input, ctx, result);
  return result;
}

function isExternalActionAllowed(agent: Agent, ctx: AgentContext): boolean {
  const ap = ctx.autopilot;
  if (!ap) return false;
  switch (agent.type) {
    case "public_page":
      return ap.externalPublishEnabled;
    case "buyer_reply":
      return ap.externalMessagingEnabled;
    // Instagram + ads are NEVER auto-executed in MVP regardless of settings.
    case "instagram":
    case "ad":
      return false;
    default:
      return false;
  }
}

async function persistRun<TInput, TOutput>(
  agent: Agent<TInput, TOutput>,
  input: TInput,
  ctx: AgentContext,
  result: AgentResult<TOutput>
) {
  const admin = getAdminSupabase();
  if (!admin) return;
  try {
    await admin.from("ai_agent_runs").insert({
      organization_id: ctx.organizationId,
      vehicle_id: ctx.vehicleId ?? null,
      document_id: ctx.documentIds?.[0] ?? null,
      user_id: ctx.userId,
      agent_type: agent.type,
      input_summary: summarizeInput(input),
      scoped_context_json: redactScope(ctx),
      output_json: result.output as any,
      confidence_score: result.confidence,
      risk_flags_json: result.riskFlags,
      approval_required: result.approvalRequired,
    });
  } catch {
    // Logging failures must never break the agent response.
  }
}

function summarizeInput(input: unknown): string {
  try {
    const s = JSON.stringify(input);
    return s.length > 500 ? `${s.slice(0, 500)}…` : s;
  } catch {
    return "[unserializable input]";
  }
}

function redactScope(ctx: AgentContext) {
  // Store only counts + the vehicle id, not the full document text.
  return {
    vehicleId: ctx.vehicleId ?? null,
    documentCount: ctx.scope?.documents.length ?? 0,
    serviceEventCount: ctx.scope?.serviceEvents.length ?? 0,
    modificationCount: ctx.scope?.modifications.length ?? 0,
    photoCount: ctx.scope?.photos.length ?? 0,
    accessLogId: ctx.scope?.accessLogId ?? null,
  };
}

/** Convenience factory to reduce boilerplate in agent definitions. */
export function emptyResult<T>(agentType: AgentResult<T>["agentType"], output: T): AgentResult<T> {
  return {
    ok: true,
    agentType,
    output,
    confidence: 0.5,
    sources: [],
    assumptions: [],
    missingData: [],
    nextActions: [],
    riskFlags: [],
    approvalRequired: false,
    externalSideEffect: false,
  };
}
