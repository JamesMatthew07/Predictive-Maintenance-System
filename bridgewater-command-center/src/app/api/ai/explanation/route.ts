import { NextResponse } from "next/server";

import {
  buildFallbackExplanationResponse,
  generateOpenAiExplanation,
} from "@/lib/ai/openai-explanations";
import type { AiExplanationRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidRequest(body: Partial<AiExplanationRequest>): body is AiExplanationRequest {
  return Boolean(
    body.assetId &&
      body.assetCode &&
      body.scenarioId &&
      body.scenarioName &&
      body.fallbackExplanation,
  );
}

export async function POST(request: Request) {
  let body: Partial<AiExplanationRequest>;

  try {
    body = (await request.json()) as Partial<AiExplanationRequest>;
  } catch {
    return NextResponse.json(
      { detail: "The AI explanation request body was not valid JSON." },
      { status: 400 },
    );
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { detail: "The AI explanation request was missing required Bridgewater asset context." },
      { status: 400 },
    );
  }

  try {
    const result = await generateOpenAiExplanation(body);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "OpenAI was unavailable, so the deterministic Bridgewater explanation was returned.";

    return NextResponse.json(buildFallbackExplanationResponse(body, detail), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
