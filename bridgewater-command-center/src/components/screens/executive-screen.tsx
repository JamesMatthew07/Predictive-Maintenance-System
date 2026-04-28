"use client";

import { TrendingUp } from "lucide-react";

import { useDemo } from "@/components/providers/demo-provider";
import {
  DetailList,
  MetricRow,
  PageIntro,
  QuickLink,
  RiskPill,
  SectionBlock,
} from "@/components/shared/page-primitives";
import { formatCurrency } from "@/lib/utils";

export function ExecutiveScreen() {
  const { snapshot } = useDemo();
  const maxExposure = Math.max(...snapshot.plants.map((plant) => plant.downtimeExposureHours), 1);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Executive"
        title="Translate live operational risk into a business-ready Bridgewater story."
        description="The executive surface stays cleaner than the operations view on purpose. It explains why predictive maintenance matters financially and operationally without forcing a stakeholder to interpret dense telemetry first."
        aside={
          <div className="rounded-[1.3rem] border border-border/60 bg-white/80 px-5 py-4 shadow-[0_24px_70px_-56px_rgba(18,40,76,0.28)]">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Boardroom Readout
            </p>
            <p className="mt-3 text-xl font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
              {snapshot.scenario.executiveSummary}
            </p>
          </div>
        }
      />

      <MetricRow
        items={snapshot.executiveMetrics.map((metric, index) => ({
          label: metric.label,
          value: metric.value,
          detail: `${metric.delta}. ${metric.detail}`,
          accent: index === 0 ? "sky" : "default",
        }))}
      />

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <SectionBlock
          kicker="Exposure By Plant"
          title="Which facility deserves executive attention first"
        >
          <div className="space-y-4">
            {snapshot.plants
              .slice()
              .sort((left, right) => right.downtimeExposureHours - left.downtimeExposureHours)
              .map((plant) => (
                <div key={plant.id} className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
                          {plant.name}
                        </p>
                        <RiskPill riskBand={plant.riskBand} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {plant.summary}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-2xl text-[color:var(--brand-ink)]">
                        {plant.downtimeExposureHours.toFixed(1)}h
                      </p>
                      <p className="text-xs text-muted-foreground">line exposure</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-[color:rgba(18,40,76,0.08)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand-sky),var(--brand-navy))]"
                      style={{ width: `${(plant.downtimeExposureHours / maxExposure) * 100}%` }}
                    />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Health
                      </p>
                      <p className="mt-1 font-mono text-lg text-[color:var(--brand-ink)]">
                        {plant.healthScore}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Critical
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--brand-ink)]">
                        {plant.openCriticalIssues} open
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Backlog
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--brand-ink)]">
                        {plant.maintenanceBacklogHours.toFixed(1)} hrs
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Value Story"
          title={snapshot.resolvedStory ? "Avoided downtime has now been protected" : "What Bridgewater is protecting if the team intervenes now"}
        >
          <div className="rounded-[1.3rem] border border-[color:rgba(111,177,200,0.18)] bg-[linear-gradient(180deg,rgba(111,177,200,0.14),rgba(255,255,255,0.98))] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Protected Value
                </p>
                <p className="mt-3 font-mono text-[2.8rem] leading-none tracking-[-0.06em] text-[color:var(--brand-ink)]">
                  {formatCurrency(snapshot.protectedValue)}
                </p>
              </div>
              <div className="rounded-full border border-[color:rgba(111,177,200,0.18)] bg-white/72 p-3 text-[color:var(--brand-sky)]">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {snapshot.resolvedStory
                ? "The maintenance workflow has been verified, so the client can see a completed intervention push the value story back into a protected state."
                : "The numbers stay intentionally incident-sized rather than enterprise-inflated. They explain why a single predicted stoppage on a JIT line matters to Bridgewater leadership."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/78 px-4 py-3">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Avoided Downtime
                </p>
                <p className="mt-2 font-mono text-xl text-[color:var(--brand-ink)]">
                  {snapshot.avoidedDowntimeHours.toFixed(1)} hrs
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/78 px-4 py-3">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Overtime Avoidance
                </p>
                <p className="mt-2 font-mono text-xl text-[color:var(--brand-ink)]">
                  {formatCurrency(snapshot.overtimeAvoidanceValue)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/78 px-4 py-3">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Backlog Pressure
                </p>
                <p className="mt-2 font-mono text-xl text-[color:var(--brand-ink)]">
                  {snapshot.backlogHours.toFixed(1)} hrs
                </p>
              </div>
            </div>
          </div>

          <DetailList
            items={snapshot.scenario.executiveActions.map((action, index) => ({
              label: `Action ${index + 1}`,
              value: action,
            }))}
          />
        </SectionBlock>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionBlock kicker="Presenter Path" title="How to move from boardroom to plant floor without losing the story">
          <div className="grid gap-3">
            <QuickLink
              href={`/plants/${snapshot.selectedPlant.id}`}
              label={`Open ${snapshot.selectedPlant.name}`}
              description="Use the real address and public vehicle programs to keep the product unmistakably Bridgewater-specific."
            />
            <QuickLink
              href="/operations"
              label="Show the operations control surface"
              description="Reveal the line that is most exposed and the sensor movement behind it."
            />
            <QuickLink
              href="/maintenance"
              label="Hand off to maintenance"
              description="Demonstrate how the alert becomes a concrete work order before failure."
            />
          </div>
        </SectionBlock>

        <SectionBlock kicker="Narrative Guardrails" title="Executive framing for the live demo">
          <DetailList
            items={[
              {
                label: "Public footprint",
                value: "Detroit HQ, Warren, Eastaboga, and Lansing remain visible together on every portfolio narrative.",
              },
              {
                label: "Vehicle count discrepancy",
                value: "The demo avoids a single enterprise vehicle-count KPI because Bridgewater's public pages disagree between 11 and 15 programs.",
              },
              {
                label: "AI posture",
                value: "Risk is deterministic; AI is used only for explanation language so the story remains stable in front of clients.",
              },
            ]}
          />
        </SectionBlock>
      </div>
    </div>
  );
}
