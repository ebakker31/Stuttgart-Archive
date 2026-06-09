import { config } from "@/lib/config";

/**
 * OpenAI-compatible LLM abstraction.
 *
 * Design principle: agents are deterministic-first. They compute their
 * structured result from REAL user data using rule-based logic, and only use
 * the LLM to *polish prose* where helpful. This guarantees the real-data-only
 * rule holds even in mock mode and prevents the model from inventing facts.
 */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export interface LLMResult {
  text: string;
  provider: string;
  model: string;
  mocked: boolean;
}

export async function llmComplete(messages: ChatMessage[], opts?: { temperature?: number; maxTokens?: number }): Promise<LLMResult> {
  if (!config.llm.enabled) {
    return mockComplete(messages);
  }

  try {
    const base = config.llm.baseUrl || defaultBaseUrl(config.llm.provider);
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.llm.apiKey}`,
      },
      body: JSON.stringify({
        model: config.llm.model,
        messages,
        temperature: opts?.temperature ?? 0.4,
        max_tokens: opts?.maxTokens ?? 900,
      }),
    });
    if (!res.ok) {
      return mockComplete(messages);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { text, provider: config.llm.provider, model: config.llm.model, mocked: false };
  } catch {
    // Network / provider failure -> safe deterministic fallback.
    return mockComplete(messages);
  }
}

function defaultBaseUrl(provider: string) {
  switch (provider) {
    case "openai":
      return "https://api.openai.com/v1";
    case "anthropic":
      // Anthropic exposes an OpenAI-compatible endpoint.
      return "https://api.anthropic.com/v1";
    default:
      return "https://api.openai.com/v1";
  }
}

/**
 * Mock completion: echoes a concise, honest paraphrase of the supplied data.
 * It NEVER fabricates vehicle facts — it only restates the provided context
 * and flags anything missing. This is what makes the app safe out of the box.
 */
function mockComplete(messages: ChatMessage[]): LLMResult {
  const user = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const text = `[grounded draft — generated locally in mock mode]\n\nThe following is composed only from the data you provided. Review before publishing.\n\n${user.slice(0, 1200)}`;
  return { text, provider: "mock", model: "mock-grounded-v1", mocked: true };
}
