"use client";

import Link from "next/link";

import { ArrowUpRight, Bolt, ShieldAlert } from "lucide-react";

import { useDemo } from "@/components/providers/demo-provider";
import { getWindowRisk, getWindowRiskLabel } from "@/lib/engine/demo-engine";
import {
  ActionButtonLink,
  DetailList,
  MetricRow,
  PageIntro,
  QuickLink,
  RiskPill,
  SectionBlock,
} from "@/components/shared/page-primitives";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function PortfolioScreen() {
  const { snapshot } = useDemo();
  const maxExposure = Math.max(...snapshot.plants.map((plant) => plant.downtimeExposureHours), 1);
  const activeWindowLabel = getWindowRiskLabel(snapshot.window);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Portfolio"
        title="A Bridgewater-wide operating picture, anchored on Warren before the next shift loses buffer."
        description="This portfolio view is designed to open the client demo with a calm but unmistakably Bridgewater-specific operating picture. Detroit, Warren, Eastaboga, and Lansing stay visible together so the Warren incident feels like a prioritization decision, not an isolated dashboard trick."
        aside={
          <div className="rounded-[1.3rem] border border-border/60 bg-white/80 px-5 py-4 shadow-[0_24px_70px_-56px_rgba(18,40,76,0.28)]">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Active Narrative
            </p>
            <p className="mt-3 text-xl font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
              {snapshot.scenario.name}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {snapshot.scenario.executiveSummary}
            </p>
          </div>
        }
      />

      <MetricRow
        items={[
          {
            label: "Portfolio Health",
            value: `${Math.round(snapshot.portfolioHealth)}`,
            detail: "Blended signal health across the four public Bridgewater facilities.",
            accent: "sky",
          },
          {
            label: "Projected Downtime",
            value: `${snapshot.projectedDowntimeHours.toFixed(1)} hrs`,
            detail: `Exposure currently building inside the active ${activeWindowLabel} scenario window.`,
          },
          {
            label: "Protected Value",
            value: formatCurrency(snapshot.protectedValue),
            detail: "Narrative-safe value story tied to a single credible intervention.",
          },
          {
            label: "Open Critical",
            value: `${snapshot.openCriticalIssues.length}`,
            detail: "Critical issues still unresolved across the current portfolio state.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <SectionBlock
          kicker="Enterprise Risk Lattice"
          title="Plant comparison with Warren intentionally leading the story"
          action={<ActionButtonLink href="/executive" label="Open Executive View" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {snapshot.plants.map((plant) => (
              <Link
                key={plant.id}
                href={`/plants/${plant.id}`}
                className="group rounded-[1.25rem] border border-border/70 bg-white/80 p-4 transition-all hover:-translate-y-0.5 hover:border-[color:rgba(18,40,76,0.16)] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                      {plant.label}
                    </p>
                    <h3 className="mt-2 text-lg font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
                      {plant.name}
                    </h3>
                  </div>
                  <RiskPill riskBand={plant.riskBand} label={plant.riskBand} />
                </div>
                <div className="mt-5 space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Exposure
                      </p>
                      <p className="font-mono text-3xl tracking-[-0.04em] text-[color:var(--brand-ink)]">
                        {plant.downtimeExposureHours.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Health
                      </p>
                      <p className="font-mono text-xl text-[color:var(--brand-ink)]">
                        {plant.healthScore}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[color:rgba(18,40,76,0.08)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand-sky),var(--brand-navy))] transition-[width] duration-500"
                      style={{ width: `${(plant.downtimeExposureHours / maxExposure) * 100}%` }}
                    />
                  </div>
                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase">
                        Programs
                      </p>
                      <p className="mt-1 leading-6">{plant.vehiclePrograms.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase">
                        Watchout
                      </p>
                      <p className="mt-1 leading-6">
                        {plant.openCriticalIssues} critical, {plant.maintenanceBacklogHours.toFixed(1)}h backlog
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Hero Incident"
          title="Warren robotic welder thermal drift"
        >
          {snapshot.heroAsset ? (
            <div className="space-y-5">
              <div className="rounded-[1.25rem] border border-[color:rgba(199,70,52,0.12)] bg-[linear-gradient(180deg,rgba(199,70,52,0.08),rgba(255,255,255,0.96))] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                      Asset
                    </p>
                    <h3 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[color:var(--brand-ink)]">
                      {snapshot.heroAsset.code}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {snapshot.heroAsset.name}
                    </p>
                  </div>
                  <RiskPill riskBand={snapshot.heroAsset.riskBand} />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Health
                    </p>
                    <p className="mt-2 font-mono text-3xl text-[color:var(--brand-ink)]">
                      {snapshot.heroAsset.healthScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      {activeWindowLabel} Risk
                    </p>
                    <p className="mt-2 font-mono text-3xl text-[color:var(--brand-ink)]">
                      {formatPercent(getWindowRisk(snapshot.window, snapshot.heroAsset))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Stoppage Window
                    </p>
                    <p className="mt-2 text-lg font-medium text-[color:var(--brand-ink)]">
                      {snapshot.heroAsset.predictedStoppageWindow ?? "Stable"}
                    </p>
                  </div>
                </div>
              </div>

              <DetailList
                items={[
                  {
                    label: "Signals driving risk",
                    value: snapshot.heroAsset.topDrivers.join(", "),
                  },
                  {
                    label: "Operational impact",
                    value: snapshot.heroAsset.lineImpact,
                  },
                  {
                    label: "Recommended action",
                    value: snapshot.heroAsset.recommendedAction,
                  },
                ]}
              />

              <div className="grid gap-3">
                <QuickLink
                  href="/operations"
                  label="Move to operations"
                  description="Show Seat Line A timing pressure and the live sensor trend."
                />
                <QuickLink
                  href={`/assets/${snapshot.heroAsset.id}`}
                  label="Open asset detail"
                  description="Explain exactly why the model flagged RW-WAR-01."
                />
                <QuickLink
                  href="/maintenance"
                  label="Create maintenance response"
                  description="Convert the alert into an assignable work order."
                />
              </div>
            </div>
          ) : null}
        </SectionBlock>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionBlock
          kicker="Top Risk Assets"
          title="The fastest path from enterprise view to action"
        >
          <div className="space-y-3">
            {snapshot.topRiskAssets.map((asset) => (
              <Link
                key={asset.id}
                href={`/assets/${asset.id}`}
                className="group flex items-center justify-between gap-4 rounded-[1.2rem] border border-border/70 bg-white/72 px-4 py-3 transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-[color:var(--brand-ink)]">{asset.code}</p>
                    <span className="text-xs text-muted-foreground">{asset.plant.name}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{asset.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-lg text-[color:var(--brand-ink)]">
                      {formatPercent(getWindowRisk(snapshot.window, asset))}
                    </p>
                    <p className="text-xs text-muted-foreground">{activeWindowLabel} risk</p>
                  </div>
                  <RiskPill riskBand={asset.riskBand} />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Issue Rail"
          title="What the presenter can say out loud"
        >
          <div className="space-y-3">
            {snapshot.alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {alert.severity === "critical" ? (
                        <ShieldAlert className="h-4 w-4 text-[color:var(--critical)]" />
                      ) : (
                        <Bolt className="h-4 w-4 text-[color:var(--warning)]" />
                      )}
                      <p className="text-sm font-medium text-[color:var(--brand-ink)]">
                        {alert.title}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {alert.triggerReason}
                    </p>
                  </div>
                  <RiskPill riskBand={alert.severity} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-[1.15rem] border border-dashed border-border/70 bg-[color:rgba(111,177,200,0.08)] px-4 py-3 text-sm text-muted-foreground">
            The portfolio intentionally avoids a single enterprise vehicle-count KPI because the public Bridgewater pages conflict. The story stays anchored on plant, line, and asset risk instead.
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
