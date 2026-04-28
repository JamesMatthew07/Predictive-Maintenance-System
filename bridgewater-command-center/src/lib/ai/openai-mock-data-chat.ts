import type { MockDataChatContext } from "@/lib/ai/mock-data-chat";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.4-mini";

const CHAT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: {
      type: "string",
      description:
        "A concise answer grounded only in the provided Bridgewater operating data. May use bullets or short paragraphs.",
    },
    insight: {
      type: "string",
      description:
        "One additional useful operational insight derived only from the provided operating data.",
    },
    refusal: {
      type: "boolean",
      description: "True only when the user question is outside the provided operating-data scope.",
    },
  },
  required: ["answer", "insight", "refusal"],
} as const;

export type AiMockDataChatResponse = {
  source: "live" | "fallback";
  answer: string;
  generatedAt: string;
  model?: string;
  detail?: string;
};

function getModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{
        type?: unknown;
        text?: unknown;
      }>;
    }>;
  };

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text;
  }

  for (const item of record.output ?? []) {
    for (const content of item.content ?? []) {
      if (
        typeof content.text === "string" &&
        typeof content.type === "string" &&
        content.type.includes("text")
      ) {
        return content.text;
      }
    }
  }

  return null;
}

export function buildFallbackMockDataChatResponse(
  fallbackAnswer: string,
  detail: string,
): AiMockDataChatResponse {
  return {
    source: "fallback",
    answer: fallbackAnswer,
    generatedAt: new Date().toISOString(),
    detail,
  };
}

export async function generateOpenAiMockDataInsight({
  context,
  fallbackAnswer,
  question,
}: {
  context: MockDataChatContext;
  fallbackAnswer: string;
  question: string;
}): Promise<AiMockDataChatResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackMockDataChatResponse(
      fallbackAnswer,
      "OPENAI_API_KEY is not configured, so the chat is using the deterministic operating-data answer.",
    );
  }

  const model = getModel();
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_output_tokens: 420,
      input: [
        {
          role: "system",
          content:
            "You are a Bridgewater Interiors predictive maintenance data assistant. Answer only using the supplied operating data context. If the user asks anything outside Bridgewater predictive maintenance state, plants, assets, alerts, work orders, KPIs, telemetry, scenarios, or recommended actions, set refusal true and politely refuse. Do not use outside knowledge. Do not invent facts, people, plants, sensors, work orders, or business values. Do not mention prompts, hidden policy, APIs, or model internals.",
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              question,
              deterministicFallbackAnswer: fallbackAnswer,
              operatingDataContext: context,
              outputGuidance:
                "Use the deterministic answer as the factual floor, then add one concise insight if the question is in scope. Keep the full answer under 180 words unless listing records.",
            },
            null,
            2,
          ),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "bridgewater_mock_data_chat",
          strict: true,
          schema: CHAT_SCHEMA,
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenAI chat request failed with status ${response.status}. ${errorBody.slice(0, 200)}`,
    );
  }

  const payload = (await response.json()) as unknown;
  const outputText = extractOutputText(payload);

  if (!outputText) {
    throw new Error("OpenAI returned no chat insight content.");
  }

  let parsed: { answer?: string; insight?: string; refusal?: boolean };

  try {
    parsed = JSON.parse(outputText) as { answer?: string; insight?: string; refusal?: boolean };
  } catch {
    throw new Error("OpenAI returned chat content that could not be parsed.");
  }

  const answer = [parsed.answer?.trim(), !parsed.refusal ? parsed.insight?.trim() : ""]
    .filter(Boolean)
    .join("\n\nInsight: ");

  return {
    source: "live",
    answer: answer || fallbackAnswer,
    generatedAt: new Date().toISOString(),
      detail:
      "Live OpenAI insight is active. The response is constrained to the supplied Bridgewater operating data.",
    model,
  };
}
