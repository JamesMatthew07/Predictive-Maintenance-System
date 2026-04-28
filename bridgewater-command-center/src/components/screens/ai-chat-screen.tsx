"use client";

import { FormEvent, useRef, useState } from "react";

import { Bot, Database, Send, ShieldCheck, UserRound } from "lucide-react";

import { useDemo } from "@/components/providers/demo-provider";
import { RiskPill, SectionBlock } from "@/components/shared/page-primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  answerMockDataQuestion,
  buildMockDataChatContext,
  hasMockDataQuestionScope,
} from "@/lib/ai/mock-data-chat";
import type { AiMockDataChatResponse } from "@/lib/ai/openai-mock-data-chat";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const sampleQuestions = [
  "Which assets are highest risk right now?",
  "Summarize Warren's current plant risk.",
  "What is happening with RW-WAR-01?",
  "Show current alerts.",
  "What work orders are active?",
  "What are the executive KPIs?",
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const Icon = isUser ? UserRound : Bot;

  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser ? (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:rgba(111,177,200,0.14)] text-[color:var(--brand-sky)]">
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[min(100%,760px)] whitespace-pre-wrap rounded-[1.15rem] px-4 py-3 text-sm leading-6 shadow-[0_16px_50px_-42px_rgba(18,40,76,0.34)]",
          isUser
            ? "bg-[color:var(--brand-navy)] text-white"
            : "border border-border/70 bg-white/82 text-[color:var(--brand-ink)]",
        )}
      >
        {message.content}
      </div>
      {isUser ? (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/78 text-[color:var(--brand-ink)]">
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}

export function AiChatScreen() {
  const { snapshot } = useDemo();
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content:
        "Ask me about the active Bridgewater operating data: plants, assets, alerts, work orders, risk, KPIs, telemetry, scenarios, or recommended maintenance actions. I will keep answers inside that scope.",
    },
  ]);
  const messageCounter = useRef(0);

  async function askQuestion(question: string) {
    const trimmed = question.trim();

    if (!trimmed || isAsking) {
      return;
    }

    const nextIndex = messageCounter.current + 1;
    messageCounter.current = nextIndex;
    const fallbackAnswer = answerMockDataQuestion(trimmed, snapshot);

    setMessages((current) => [
      ...current,
      {
        id: `user-${nextIndex}`,
        role: "user",
        content: trimmed,
      },
      {
        id: `assistant-${nextIndex}`,
        role: "assistant",
        content: "Generating a Bridgewater operating insight...",
      },
    ]);
    setInput("");

    if (!hasMockDataQuestionScope(trimmed, snapshot)) {
      setMessages((current) =>
        current.map((message) =>
          message.id === `assistant-${nextIndex}`
            ? {
                ...message,
                content: fallbackAnswer,
              }
            : message,
        ),
      );
      return;
    }

    setIsAsking(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmed,
          fallbackAnswer,
          context: buildMockDataChatContext(snapshot),
        }),
        cache: "no-store",
      });
      const payload = (await response.json()) as AiMockDataChatResponse | { detail?: string };

      if (!response.ok || !("answer" in payload)) {
        throw new Error(
          "detail" in payload && payload.detail
            ? payload.detail
            : "The AI chat endpoint did not return an answer.",
        );
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === `assistant-${nextIndex}`
            ? {
                ...message,
                content:
                  payload.source === "live"
                    ? payload.answer
                    : `${payload.answer}\n\n${payload.detail ?? "Using deterministic fallback."}`,
              }
            : message,
        ),
      );
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : "The AI chat endpoint was unavailable.";

      setMessages((current) =>
        current.map((message) =>
          message.id === `assistant-${nextIndex}`
            ? {
                ...message,
                content: `${fallbackAnswer}\n\n${detail}`,
              }
            : message,
        ),
      );
    } finally {
      setIsAsking(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion(input);
  }

  return (
    <div className="flex h-full min-h-[calc(100svh-13rem)] flex-col lg:min-h-0">
      <SectionBlock
        kicker="AI Chat"
        title="Bridgewater data assistant"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-white/76 px-3 py-1.5 text-xs text-muted-foreground md:flex">
              <Database className="h-3.5 w-3.5 text-[color:var(--brand-sky)]" />
              {snapshot.plants.length} plants
              <span className="text-border">|</span>
              {snapshot.assets.length} assets
              <span className="text-border">|</span>
              {snapshot.alerts.length} alerts
            </div>
            <RiskPill riskBand={snapshot.heroAsset?.riskBand ?? "healthy"} label={snapshot.window} />
          </div>
        }
        className="flex flex-1 flex-col gap-4 p-4 md:p-5 lg:min-h-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-border/70 bg-white/68 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[color:var(--brand-ink)]">
              Ask about plants, assets, alerts, work orders, KPIs, and maintenance actions.
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Answers stay bound to the current Bridgewater operating state.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--brand-sky)]" />
            Data-bound
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="scrollbar-hidden min-h-[220px] flex-1 space-y-4 overflow-y-auto rounded-[1.25rem] border border-border/70 bg-[color:rgba(255,255,255,0.62)] p-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="shrink-0 rounded-[1.25rem] border border-border/70 bg-white/94 p-3 shadow-[0_22px_80px_-62px_rgba(18,40,76,0.36)]">
            <div className="scrollbar-hidden mb-3 flex gap-2 overflow-x-auto pb-1">
              {sampleQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void askQuestion(question)}
                  disabled={isAsking}
                  className="shrink-0 rounded-full border border-border/70 bg-white px-3 py-2 text-xs text-[color:var(--brand-ink)] transition-colors hover:border-[color:rgba(18,40,76,0.18)] hover:bg-[color:rgba(111,177,200,0.08)] disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Warren, RW-WAR-01, portfolio risk, active alerts, work orders, or executive KPIs..."
              className="min-h-[60px] resize-none rounded-[1rem] border-border/70 bg-white leading-6 md:min-h-[68px]"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-5 text-muted-foreground">
                Answers are generated from the current Bridgewater operating state.
              </p>
              <Button
                type="submit"
                disabled={isAsking}
                className="rounded-full bg-[color:var(--brand-navy)] px-5 hover:bg-[color:var(--brand-ink)]"
              >
                <Send className="h-4 w-4" />
                {isAsking ? "Generating" : "Ask"}
              </Button>
            </div>
          </form>
        </div>
      </SectionBlock>
    </div>
  );
}
