"use client";

import Link from "next/link";
import { useEffect, useEffectEvent } from "react";

import { useDemo } from "@/components/providers/demo-provider";
import { LineTrendChart } from "@/components/charts/line-trend-chart";
import {
  getAlternateWindow,
  getWindowRisk,
  getWindowRiskLabel,
} from "@/lib/engine/demo-engine";
import {
  DetailList,
  MetricRow,
  PageIntro,
  QuickLink,
  RiskPill,
  SectionBlock,
} from "@/components/shared/page-primitives";
import { SignalViewToggle } from "@/components/shared/signal-view-toggle";
import { Badge } from "@/components/ui/badge";
import type { SensorKey } from "@/lib/types";
import { formatPercent, formatTimestamp } from "@/lib/utils";

function telemetry(asset: NonNullable<ReturnType<typeof useDemo>["snapshot"]["heroAsset"]>, sensorKey: SensorKey) {
  return {
    current: asset.telemetry.filter((point) => point.sensorKey === sensorKey),
    baseline: asset.baselineTelemetry.filter((point) => point.sensorKey === sensorKey),
    sensor: asset.sensors.find((sensor) => sensor.key === sensorKey),
  };
}

export function AssetScreen({ assetId }: { assetId: string }) {
  const {
    getAssetExplanationState,
    requestAssetExplanation,
    snapshot,
    state,
  } = useDemo();
  const asset = snapshot.assets.find((entry) => entry.id === assetId);
  const explanationState = asset ? getAssetExplanationState(asset.id) : null;
  const explanation = asset
    ? explanationState?.payload ?? snapshot.explanationByAsset[asset.id]
    : null;
  const requestExplanation = useEffectEvent((nextAssetId: string) => {
    void requestAssetExplanation(nextAssetId);
  });

  useEffect(() => {
    if (!asset) {
      return;
    }

    requestExplanation(asset.id);
  }, [asset, explanationState?.signature]);

  if (!asset) {
    return (
      <div className="space-y-6">
        <PageIntro
          eyebrow="Asset Detail"
          title="This asset is not present in the current session."
          description="Return to the portfolio or choose another scenario to open a seeded Bridgewater asset."
        />
      </div>
    );
  }

  const resolvedExplanation = explanation ?? snapshot.explanationByAsset[asset.id];
  const primary = telemetry(asset, asset.sensors[0].key);
  const secondary = telemetry(asset, asset.sensors[1].key);
  const activeWindowLabel = getWindowRiskLabel(state.window);
  const alternateWindow = getAlternateWindow(state.window);
  const alternateWindowLabel = getWindowRiskLabel(alternateWindow);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Asset Detail"
        title={`${asset.code} | ${asset.name}`}
        description={`${asset.plant.name}, ${asset.line.name}, ${asset.zoneLabel}. This page is where the presenter can slow down and explain the live AI narrative without losing the Bridgewater operating context.`}
        aside={
          <div className="rounded-[1.3rem] border border-border/60 bg-white/80 px-5 py-4 shadow-[0_24px_70px_-56px_rgba(18,40,76,0.28)]">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Risk band
            </p>
            <div className="mt-3 flex items-center gap-3">
              <RiskPill riskBand={asset.riskBand} />
              <span className="font-mono text-sm text-muted-foreground">{asset.assetType}</span>
            </div>
          </div>
        }
      />

      <MetricRow
        items={[
          {
            label: "Health Score",
            value: `${asset.healthScore}`,
            detail: resolvedExplanation.summary,
            accent: "sky",
          },
          {
            label: "Active Failure Risk",
            value: formatPercent(getWindowRisk(state.window, asset)),
            detail: `${activeWindowLabel} planning horizon. ${asset.predictedStoppageWindow ?? "No immediate stoppage window"}`,
          },
          {
            label: "Comparison Horizon",
            value: formatPercent(getWindowRisk(alternateWindow, asset)),
            detail: `${alternateWindowLabel} planning horizon. ${asset.lineImpact}`,
          },
          {
            label: "Signal Overlay",
            value: state.compareMode === "compare" ? "Compare" : "Live",
            detail: "Use the signal history toggle to show or hide the healthy baseline overlay.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionBlock
          kicker="Signal History"
          title="What changed on the asset"
          action={<SignalViewToggle />}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <LineTrendChart
              title={primary.sensor?.label ?? ""}
              unit={primary.sensor?.unit ?? ""}
              current={primary.current}
              baseline={primary.baseline}
              showBaseline={state.compareMode === "compare"}
            />
            <LineTrendChart
              title={secondary.sensor?.label ?? ""}
              unit={secondary.sensor?.unit ?? ""}
              current={secondary.current}
              baseline={secondary.baseline}
              showBaseline={state.compareMode === "compare"}
            />
          </div>
        </SectionBlock>

        <SectionBlock kicker="Explanation" title="AI narrative with operational grounding">
          <div className="space-y-4 rounded-[1.2rem] border border-border/70 bg-white/76 p-4">
            <p className="text-sm leading-7 text-muted-foreground">{resolvedExplanation.summary}</p>
            <p className="rounded-2xl border border-border/70 bg-[color:rgba(111,177,200,0.08)] px-4 py-3 text-sm leading-6 text-[color:var(--brand-ink)]">
              {resolvedExplanation.impact}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-[color:rgba(18,40,76,0.12)] bg-white/82 text-[color:var(--brand-ink)]"
              >
                {explanationState?.status === "loading"
                  ? "Refreshing with OpenAI"
                  : explanationState?.source === "live"
                    ? `Live OpenAI${explanationState.model ? ` | ${explanationState.model}` : ""}`
                    : explanationState?.source === "fallback"
                      ? "Deterministic fallback"
                      : "Deterministic narrative"}
              </Badge>
              {explanationState?.generatedAt ? (
                <span className="font-mono text-[11px] text-muted-foreground">
                  Updated {formatTimestamp(explanationState.generatedAt)}
                </span>
              ) : null}
            </div>
            {resolvedExplanation.confidenceNote ? (
              <p className="text-xs leading-6 text-muted-foreground">
                {resolvedExplanation.confidenceNote}
              </p>
            ) : null}
            {explanationState?.detail ? (
              <p className="text-xs leading-6 text-muted-foreground">
                {explanationState.detail}
              </p>
            ) : null}
          </div>
          <DetailList
            items={[
              {
                label: "Drivers",
                value: asset.topDrivers.join(", "),
              },
              {
                label: "Recommended action",
                value: asset.recommendedAction,
              },
              {
                label: "Last maintenance",
                value: asset.lastMaintenanceAt,
              },
            ]}
          />
        </SectionBlock>
      </div>

      <SectionBlock kicker="Related Workflow" title="What happens next around this asset">
        <div className="grid gap-3 lg:grid-cols-3">
          {asset.activeAlert ? (
            <div className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Alert
              </p>
              <p className="mt-2 text-sm font-medium text-[color:var(--brand-ink)]">
                {asset.activeAlert.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{asset.activeAlert.status}</p>
            </div>
          ) : null}
          {asset.activeWorkOrder ? (
            <Link
              href={`/work-orders/${asset.activeWorkOrder.id}`}
              className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4 transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Work order
              </p>
              <p className="mt-2 font-mono text-sm text-[color:var(--brand-ink)]">
                {asset.activeWorkOrder.id}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {asset.activeWorkOrder.status}
              </p>
            </Link>
          ) : (
            <QuickLink
              href="/maintenance"
              label="Create work order"
              description="Open maintenance to dispatch this asset into a technician workflow."
            />
          )}
          <QuickLink
            href={`/plants/${asset.plant.id}`}
            label="Return to plant"
            description="Pull the audience back to the facility view without losing context."
          />
        </div>
      </SectionBlock>
    </div>
  );
}
