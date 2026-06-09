import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/agents";
import { runAgent } from "@/lib/agents/agent-runner";
import { getAgentScopedContext } from "@/lib/agents/scoped-context";
import { getAppSession } from "@/lib/app-data";
import type { AgentType } from "@/lib/agents/types";

/**
 * Generic agent runner endpoint. Assembles a permission-checked, scoped context,
 * runs the requested agent through the runner (which enforces approval gating
 * and persists the run), and returns the structured result.
 */
export async function POST(req: NextRequest) {
  const session = await getAppSession();
  if (!session.organizationId || !session.userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const agentType = body.agentType as AgentType;
  const agent = getAgent(agentType);
  if (!agent) return NextResponse.json({ error: "Unknown agent." }, { status: 400 });

  const scope = await getAgentScopedContext({
    organizationId: session.organizationId,
    userId: session.userId,
    vehicleId: body.vehicleId ?? null,
    documentIds: body.documentIds ?? [],
    agentType,
  });

  const result = await runAgent(agent, { ...body.input, scope }, {
    organizationId: session.organizationId,
    userId: session.userId,
    vehicleId: body.vehicleId ?? null,
    documentIds: body.documentIds ?? [],
    scope,
  });

  return NextResponse.json(result);
}
