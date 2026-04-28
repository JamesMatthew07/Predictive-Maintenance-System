"use client";

import { getAlternateWindow, getWindowRisk, getWindowRiskLabel } from "@/lib/engine/demo-engine";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/components/providers/demo-provider";
import { LineTrendChart } from "@/components/charts/line-trend-chart";
import {
  MetricRow,
  PageIntro,
  RiskPill,
  SectionBlock,
} from "@/components/shared/page-primitives";
import { SignalViewToggle } from "@/components/shared/signal-view-toggle";
import type { SensorKey } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

function sensorSeries(asset: NonNullable<ReturnType<typeof useDemo>["snapshot"]["heroAsset"]>, sensorKey: SensorKey) {
  return {
    current: asset.telemetry.filter((point) => point.sensorKey === sensorKey),
    baseline: asset.baselineTelemetry.filter((point) => point.sensorKey === sensorKey),
    sensor: asset.sensors.find((sensor) => sensor.key === sensorKey),
  };
}

export function OperationsScreen() {
  const { setLineId, snapshot, state } = useDemo();
  const activePlant = snapshot.selectedPlant;
  const activeWindowLabel = getWindowRiskLabel(state.window);
  const alternateWindowLabel = getWindowRiskLabel(getAlternateWindow(state.window));
  const lineId = state.selectedLineId ?? activePlant.lines[0]?.id;
  const lineAssets = activePlant.assets.filter((asset) => asset.lineId === lineId);
  const focalAsset =
    lineAssets
      .slice()
      .sort(
        (left, right) => getWindowRisk(state.window, right) - getWindowRisk(state.window, left),
      )[0] ??
    snapshot.heroAsset;
  const primarySensor = focalAsset?.sensors[0];
  const secondarySensor = focalAsset?.sensors[1];
  const primarySeries =
    focalAsset && primarySensor ? sensorSeries(focalAsset, primarySensor.key) : null;
  const secondarySeries =
    focalAsset && secondarySensor ? sensorSeries(focalAsset, secondarySensor.key) : null;

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Operations"
        title={`Which line is exposed in ${activePlant.name}, and how soon does buffer disappear?`}
        description={snapshot.scenario.operationsNarrative}
        aside={
          focalAsset ? (
            <div className="rounded-[1.3rem] border border-border/60 bg-white/80 px-5 py-4 shadow-[0_24px_70px_-56px_rgba(18,40,76,0.28)]">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Lead asset
              </p>
              <p className="mt-3 font-mono text-2xl tracking-[-0.04em] text-[color:var(--brand-ink)]">
                {focalAsset.code}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {focalAsset.predictedStoppageWindow ?? "Stable window"}
              </p>
            </div>
          ) : null
        }
      />

      <MetricRow
        items={[
          {
            label: "Active Plant",
            value: activePlant.name,
            detail: `${activePlant.address}. ${activePlant.vehiclePrograms.join(", ")}`,
            accent: "sky",
          },
          {
            label: "Selected Line",
            value: activePlant.lines.find((line) => line.id === lineId)?.name ?? "Line",
            detail: focalAsset?.lineImpact ?? "Use the line switcher to inspect risk concentration.",
          },
          {
            label: `Lead ${activeWindowLabel} Risk`,
            value: focalAsset ? formatPercent(getWindowRisk(state.window, focalAsset)) : "0%",
            detail: focalAsset?.predictedStoppageWindow ?? "No stoppage window active",
          },
          {
            label: "At-Risk Assets",
            value: `${lineAssets.filter((asset) => asset.riskBand !== "healthy").length}`,
            detail: `Assets on the selected line outside the healthy band in the active ${activeWindowLabel} horizon. ${alternateWindowLabel} context remains visible in the risk cards.`,
          },
        ]}
      />

      <SectionBlock kicker="Line Switcher" title="Move across the plant without leaving the operational story">
        <div className="flex flex-wrap gap-2">
          {activePlant.lines.map((line) => (
            <Button
              key={line.id}
              variant="ghost"
              className={
                line.id === lineId
                  ? "rounded-full bg-[color:var(--brand-navy)] px-4 text-white hover:bg-[color:var(--brand-ink)]"
                  : "rounded-full border border-border/70 bg-white/72 px-4 text-muted-foreground hover:bg-white"
              }
              onClick={() => setLineId(line.id)}
            >
              {line.name}
            </Button>
          ))}
        </div>
      </SectionBlock>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionBlock
          kicker="Sensor Drift"
          title="The telemetry that makes the line risk credible"
          action={<SignalViewToggle />}
        >
          {focalAsset && primarySeries && secondarySeries ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <LineTrendChart
                title={primarySeries.sensor?.label ?? primarySensor?.label ?? "Primary signal"}
                unit={primarySeries.sensor?.unit ?? ""}
                current={primarySeries.current}
                baseline={primarySeries.baseline}
                showBaseline={state.compareMode === "compare"}
              />
              <LineTrendChart
                title={secondarySeries.sensor?.label ?? secondarySensor?.label ?? "Secondary signal"}
                unit={secondarySeries.sensor?.unit ?? ""}
                current={secondarySeries.current}
                baseline={secondarySeries.baseline}
                showBaseline={state.compareMode === "compare"}
              />
            </div>
          ) : null}
        </SectionBlock>

        <SectionBlock kicker="At-Risk Assets" title="What will stop first if nothing changes">
          <div className="space-y-3">
            {lineAssets
              .slice()
              .sort(
                (left, right) =>
                  getWindowRisk(state.window, right) - getWindowRisk(state.window, left),
              )
              .map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-[color:var(--brand-ink)]">{asset.code}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{asset.name}</p>
                    </div>
                    <RiskPill riskBand={asset.riskBand} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        {activeWindowLabel} risk
                      </p>
                      <p className="mt-1 font-mono text-lg text-[color:var(--brand-ink)]">
                        {formatPercent(getWindowRisk(state.window, asset))}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Window
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--brand-ink)]">
                        {asset.predictedStoppageWindow ?? "Stable"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Driver
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--brand-ink)]">
                        {asset.topDrivers[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock kicker="Current Alerts" title="What operations can hand off to maintenance immediately">
        <div className="space-y-3">
          {snapshot.alerts
            .filter((alert) => alert.plantId === activePlant.id)
            .map((alert) => (
              <div
                key={alert.id}
                className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-white/76 p-4 md:grid-cols-[1.4fr_0.9fr_auto]"
              >
                <div>
                  <p className="text-sm font-medium text-[color:var(--brand-ink)]">{alert.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {alert.triggerReason}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Status
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--brand-ink)]">{alert.status}</p>
                </div>
                <div className="flex items-start justify-end">
                  <RiskPill riskBand={alert.severity} />
                </div>
              </div>
            ))}
        </div>
      </SectionBlock>
    </div>
  );
}
