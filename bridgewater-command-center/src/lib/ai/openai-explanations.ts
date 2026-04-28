import type {
  AiExplanationRequest,
  AiExplanationResponse,
  ExplanationPayload,
} from "@/lib/types";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.4-mini";
const EXPLANATION_CACHE_TTL_MS = 1000 * 60 * 15;
const MAX_CACHED_EXPLANATIONS = 48;
const explanationResponseCache = new Map<
  string,
  {
    expiresAt: number;
    response: AiExplanationResponse;
  }
>();
const inFlightExplanationRequests = new Map<string, Promise<AiExplanationResponse>>();

const EXPLANATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: {
      type: "string",
      description:
        "A concise 1-2 sentence explanation of why the asset is being surfaced now.",
    },
    impact: {
      type: "string",
      description:
        "A concise 1-2 sentence operational impact statement grounded in plant and line context.",
    },
    recommendedAction: {
      type: "string",
      description:
        "A practical action statement that matches the provided operating context.",
    },
    confidenceNote: {
      type: "string",
      description:
        "A short note that this explanation is grounded in the provided Bridgewater demo context.",
    },
  },
  required: ["summary", "impact", "recommendedAction", "confidenceNote"],
} as const;

function getModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function getCachedExplanation(signature: string) {
  const cached = explanationResponseCache.get(signature);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    explanationResponseCache.delete(signature);
    return null;
  }

  return cached.response;
}

function rememberExplanation(
  signature: string,
  response: AiExplanationResponse,
) {
  if (explanationResponseCache.size >= MAX_CACHED_EXPLANATIONS) {
    const oldestKey = explanationResponseCache.keys().next().value;

    if (oldestKey) {
      explanationResponseCache.delete(oldestKey);
    }
  }

  explanationResponseCache.set(signature, {
    expiresAt: Date.now() + EXPLANATION_CACHE_TTL_MS,
    response,
  });
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

function normalizePayload(
  request: AiExplanationRequest,
  candidate: Partial<ExplanationPayload>,
): ExplanationPayload {
  return {
    ...request.fallbackExplanation,
    summary: candidate.summary?.trim() || request.fallbackExplanation.summary,
    impact: candidate.impact?.trim() || request.fallbackExplanation.impact,
    recommendedAction:
      candidate.recommendedAction?.trim() ||
      request.fallbackExplanation.recommendedAction,
    confidenceNote:
      candidate.confidenceNote?.trim() ||
      request.fallbackExplanation.confidenceNote ||
      `Grounded in the active ${request.plantName} demo context and the deterministic Bridgewater scenario state.`,
  };
}

export function buildFallbackExplanationResponse(
  request: AiExplanationRequest,
  detail: string,
): AiExplanationResponse {
  return {
    source: "fallback",
    payload: normalizePayload(request, request.fallbackExplanation),
    generatedAt: new Date().toISOString(),
    detail,
  };
}

export async function generateOpenAiExplanation(
  request: AiExplanationRequest,
): Promise<AiExplanationResponse> {
  const cachedResponse = getCachedExplanation(request.signature);

  if (cachedResponse) {
    return cachedResponse;
  }

  const inFlight = inFlightExplanationRequests.get(request.signature);

  if (inFlight) {
    return inFlight;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackExplanationResponse(
      request,
      "OPENAI_API_KEY is not configured, so the app is using the deterministic Bridgewater fallback narrative.",
    );
  }

  const model = getModel();
  const requestPromise = (async () => {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_output_tokens: 240,
        input: [
          {
            role: "system",
            content:
              "You are writing Bridgewater Interiors predictive maintenance narrative copy for a polished client-facing demo. Stay grounded in the provided data only. Be concise, specific, and operationally credible. Do not invent sensors, technicians, or outcomes. Do not mention APIs, prompts, hidden analysis, or that you are an AI model. If the work order is verified, explain the stabilization clearly instead of implying an active failure.",
          },
          {
            role: "user",
            content: JSON.stringify(
              {
                company: "Bridgewater Interiors",
                objective:
                  "Explain the current asset condition in a way that helps an executive or maintenance lead understand what changed and why it matters.",
                asset: {
                  id: request.assetId,
                  code: request.assetCode,
                  name: request.assetName,
                  type: request.assetType,
                  plant: request.plantName,
                  line: request.lineName,
                  zone: request.zoneLabel,
                },
                scenario: {
                  id: request.scenarioId,
                  name: request.scenarioName,
                  window: request.window,
                  compareMode: request.compareMode,
                },
                condition: {
                  riskBand: request.riskBand,
                  healthScore: request.healthScore,
                  anomalyScore: request.anomalyScore,
                  failureRisk24h: request.failureRisk24h,
                  failureRisk72h: request.failureRisk72h,
                  predictedStoppageWindow: request.predictedStoppageWindow,
                  topDrivers: request.topDrivers,
                  lineImpact: request.lineImpact,
                  lastMaintenanceAt: request.lastMaintenanceAt,
                },
                activeAlert: request.activeAlert,
                activeWorkOrder: request.activeWorkOrder,
                seededAction: request.recommendedAction,
                deterministicFallback: request.fallbackExplanation,
              },
              null,
              2,
            ),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "bridgewater_explanation",
            strict: true,
            schema: EXPLANATION_SCHEMA,
          },
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `OpenAI request failed with status ${response.status}. ${errorBody.slice(0, 200)}`,
      );
    }

    const payload = (await response.json()) as unknown;
    const outputText = extractOutputText(payload);

    if (!outputText) {
      throw new Error("OpenAI returned no explanation content.");
    }

    let parsed: Partial<ExplanationPayload>;

    try {
      parsed = JSON.parse(outputText) as Partial<ExplanationPayload>;
    } catch {
      throw new Error("OpenAI returned explanation content that could not be parsed.");
    }

    const result: AiExplanationResponse = {
      source: "live",
      payload: normalizePayload(request, parsed),
      generatedAt: new Date().toISOString(),
      detail:
        "Live OpenAI narrative is active. Risk scoring, alerts, and work-order state remain deterministic in the Bridgewater demo engine.",
      model,
    };

    rememberExplanation(request.signature, result);

    return result;
  })();

  inFlightExplanationRequests.set(request.signature, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightExplanationRequests.delete(request.signature);
  }
}
