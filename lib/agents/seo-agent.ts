import type { Agent, AgentResult } from "./types";

interface SeoInput {
  topic?: string;
}

interface SeoOutput {
  landingPageIdeas: string[];
  comparisonPages: string[];
  buyingGuides: string[];
  metadata: { title: string; description: string };
  structuredDataNotes: string[];
  internalLinking: string[];
  highIntentTerms: string[];
}

export const seoAgent: Agent<SeoInput, SeoOutput> = {
  type: "seo",
  description: "Generates original SEO content ideas and metadata with disclaimers.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<SeoOutput>> {
    const topic = input.topic || "Porsche ownership documentation";
    return {
      ok: true,
      agentType: "seo",
      output: {
        landingPageIdeas: ["How to organize Porsche service records", "Building a digital garage for your Porsche", "What documents a Porsche buyer wants to see"],
        comparisonPages: ["Seller packet vs. a folder of receipts", "Private archive vs. spreadsheet tracking"],
        buyingGuides: ["Porsche pre-purchase due diligence checklist", "What 'documented history' really means"],
        metadata: { title: `${topic} — Stuttgart Archive`, description: `Preserve, organize, and share your Porsche's documented history. Independent and privacy-first.` },
        structuredDataNotes: ["Use Article schema for guides", "Avoid Vehicle schema with unverified specs", "Add Organization schema with the independence disclaimer"],
        internalLinking: ["Link guides → /pricing", "Link guides → /demo", "Link comparison pages → relevant features"],
        highIntentTerms: ["porsche service records organizer", "porsche seller packet", "porsche provenance documentation", "porsche buyer due diligence"],
      },
      confidence: 0.7,
      sources: [],
      assumptions: ["Content must be original; never copy competitor or official Porsche text."],
      missingData: [],
      nextActions: ["Draft one guide and pass it through Brand Guardian."],
      riskFlags: [{ severity: "low", category: "brand", message: "Include the independence disclaimer; avoid unsupported vehicle claims." }],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
