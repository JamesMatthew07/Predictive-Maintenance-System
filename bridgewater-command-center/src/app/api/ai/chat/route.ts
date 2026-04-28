import { NextResponse } from "next/server";

import {
  buildFallbackMockDataChatResponse,
  generateOpenAiMockDataInsight,
} from "@/lib/ai/openai-mock-data-chat";
import type { MockDataChatContext } from "@/lib/ai/mock-data-chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AiChatRequest = {
  question: string;
  fallbackAnswer: string;
  context: MockDataChatContext;
};

function isValidRequest(body: Partial<AiChatRequest>): body is AiChatRequest {
  return Boolean(
    typeof body.question === "string" &&
      body.question.trim() &&
      typeof body.fallbackAnswer === "string" &&
      body.fallbackAnswer.trim() &&
      body.context &&
      body.context.company === "Bridgewater Interiors" &&
      body.context.scenario &&
      Array.isArray(body.context.plants) &&
      Array.isArray(body.context.assets),
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function hasContextScope(question: string, context: MockDataChatContext) {
  const normalizedQuestion = normalize(question);
  const terms = [
    "asset",
    "assets",
    "alert",
    "alerts",
    "backlog",
    "bridgewater",
    "downtime",
    "exposure",
    "health",
    "kpi",
    "line",
    "maintenance",
    "operations",
    "plant",
    "plants",
    "portfolio",
    "risk",
    "scenario",
    "telemetry",
    "work order",
    context.scenario.name,
    context.selectedPlant,
    ...context.plants.flatMap((plant) => [plant.id, plant.name, plant.city, plant.state]),
    ...context.assets.flatMap((asset) => [asset.id, asset.code, asset.name, asset.assetType, asset.plant, asset.line]),
    ...context.alerts.flatMap((alert) => [alert.id, alert.title, alert.status, alert.severity]),
    ...context.workOrders.flatMap((order) => [order.id, order.title, order.status, order.playbookCode]),
  ];

  return terms.some((term) => normalizedQuestion.includes(normalize(term)));
}

export async function POST(request: Request) {
  let body: Partial<AiChatRequest>;

  try {
    body = (await request.json()) as Partial<AiChatRequest>;
  } catch {
    return NextResponse.json(
      { detail: "The AI chat request body was not valid JSON." },
      { status: 400 },
    );
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { detail: "The AI chat request was missing required Bridgewater operating context." },
      { status: 400 },
    );
  }

  if (!hasContextScope(body.question, body.context)) {
    return NextResponse.json(buildFallbackMockDataChatResponse(body.fallbackAnswer, "Question was outside the Bridgewater operating-data scope."), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  try {
    const result = await generateOpenAiMockDataInsight(body);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "OpenAI was unavailable, so the deterministic Bridgewater operating-data answer was returned.";

    return NextResponse.json(buildFallbackMockDataChatResponse(body.fallbackAnswer, detail), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
