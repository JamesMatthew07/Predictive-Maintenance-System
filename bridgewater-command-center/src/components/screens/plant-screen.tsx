"use client";

import Link from "next/link";

import { useDemo } from "@/components/providers/demo-provider";
import { getWindowRisk, getWindowRiskLabel } from "@/lib/engine/demo-engine";
import {
  DetailList,
  MetricRow,
  PageIntro,
  QuickLink,
  RiskPill,
  SectionBlock,
} from "@/components/shared/page-primitives";
import { formatPercent } from "@/lib/utils";

export function PlantScreen({ plantId }: { plantId: string }) {
  const { snapshot } = useDemo();
  const plant = snapshot.plants.find((entry) => entry.id === plantId);
  const activeWindowLabel = getWindowRiskLabel(snapshot.window);

  if (!plant) {
    return (
      <div className="space-y-6">
        <PageIntro
          eyebrow="Plant Detail"
          title="Plant not found in the current demo state."
          description="Switch scenarios or return to the portfolio to select one of the public Bridgewater facilities."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Plant Detail"
        title={`${plant.name} operating picture`}
        description={`${plant.summary} ${plant.operationalFocus}`}
        aside={
          <div className="rounded-[1.3rem] border border-border/60 bg-white/80 px-5 py-4 shadow-[0_24px_70px_-56px_rgba(18,40,76,0.28)]">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Public Metadata
            </p>
            <p className="mt-3 text-lg font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
              {plant.address}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Programs: {plant.vehiclePrograms.join(", ")}
            </p>
          </div>
        }
      />

      <MetricRow
        items={[
          {
            label: "Plant Health",
            value: `${plant.healthScore}`,
            detail: "Average asset health across the selected facility.",
            accent: "sky",
          },
          {
            label: "Projected Exposure",
            value: `${plant.downtimeExposureHours.toFixed(1)} hrs`,
            detail: plant.projectedWindow,
          },
          {
            label: "Critical Issues",
            value: `${plant.openCriticalIssues}`,
            detail: "Issues at critical severity still requiring response.",
          },
          {
            label: "Backlog",
            value: `${plant.maintenanceBacklogHours.toFixed(1)} hrs`,
            detail: "Estimated maintenance queue pressure in this facility.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionBlock kicker="Line Summary" title="How the plant is organized today">
          <div className="grid gap-4 md:grid-cols-2">
            {plant.lines.map((line) => {
              const lineAssets = plant.assets.filter((asset) => asset.lineId === line.id);
              const topLineAsset = lineAssets
                .slice()
                .sort(
                  (left, right) =>
                    getWindowRisk(snapshot.window, right) -
                    getWindowRisk(snapshot.window, left),
                )[0];

              return (
                <div key={line.id} className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
                        {line.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{line.productFamily}</p>
                    </div>
                    <RiskPill riskBand={topLineAsset?.riskBand ?? "healthy"} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Takt
                      </p>
                      <p className="mt-1 font-mono text-lg text-[color:var(--brand-ink)]">
                        {line.taktTimeSeconds}s
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Throughput
                      </p>
                      <p className="mt-1 font-mono text-lg text-[color:var(--brand-ink)]">
                        {line.throughputUnitsPerHour}/hr
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Lead risk
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--brand-ink)]">
                        {topLineAsset?.code ?? "Nominal"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock kicker="Plant Actions" title="Move deeper into operations or maintenance">
          <div className="grid gap-3">
            <QuickLink
              href="/operations"
              label="Open operations"
              description="Carry this plant context into the line-level control surface."
            />
            <QuickLink
              href="/maintenance"
              label="Open maintenance"
              description="Inspect alerts, explanation language, and work-order activity for this facility."
            />
          </div>
          <DetailList
            className="pt-3"
            items={[
              {
                label: "Programs in view",
                value: plant.vehiclePrograms.join(", "),
              },
              {
                label: "Operational emphasis",
                value: plant.operationalFocus,
              },
            ]}
          />
        </SectionBlock>
      </div>

      <SectionBlock kicker="Assets" title="Plant assets ranked by current line risk">
        <div className="space-y-3">
          {plant.assets
            .slice()
            .sort(
              (left, right) =>
                getWindowRisk(snapshot.window, right) -
                getWindowRisk(snapshot.window, left),
            )
            .map((asset) => (
              <Link
                key={asset.id}
                href={`/assets/${asset.id}`}
                className="group flex items-center justify-between gap-4 rounded-[1.2rem] border border-border/70 bg-white/76 px-4 py-3 transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-sm text-[color:var(--brand-ink)]">{asset.code}</p>
                    <span className="text-xs text-muted-foreground">{asset.zoneLabel}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{asset.name}</p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="font-mono text-lg text-[color:var(--brand-ink)]">
                      {formatPercent(getWindowRisk(snapshot.window, asset))}
                    </p>
                    <p className="text-xs text-muted-foreground">{activeWindowLabel} risk</p>
                  </div>
                  <RiskPill riskBand={asset.riskBand} />
                </div>
              </Link>
            ))}
        </div>
      </SectionBlock>
    </div>
  );
}
