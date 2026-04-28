"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { Wrench } from "lucide-react";

import {
  getAlternateWindow,
  getWindowRisk,
  getWindowRiskLabel,
} from "@/lib/engine/demo-engine";
import { users } from "@/lib/mock-data";
import { useDemo } from "@/components/providers/demo-provider";
import { LineTrendChart } from "@/components/charts/line-trend-chart";
import {
  DetailList,
  EmptyPanel,
  MetricRow,
  PageIntro,
  QuickLink,
  RiskPill,
  SectionBlock,
  WorkOrderRail,
} from "@/components/shared/page-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SensorKey, WorkOrderStatus } from "@/lib/types";
import { formatPercent, formatTimestamp } from "@/lib/utils";

const workOrderStatuses: WorkOrderStatus[] = ["assigned", "in_progress", "completed", "verified"];

const workOrderStatusLabels: Record<WorkOrderStatus, string> = {
  draft: "Draft",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  verified: "Verified",
};

function getTelemetry(asset: NonNullable<ReturnType<typeof useDemo>["snapshot"]["heroAsset"]>, sensorKey: SensorKey) {
  return {
    current: asset.telemetry.filter((point) => point.sensorKey === sensorKey),
    baseline: asset.baselineTelemetry.filter((point) => point.sensorKey === sensorKey),
    sensor: asset.sensors.find((sensor) => sensor.key === sensorKey),
  };
}

export function MaintenanceScreen() {
  const {
    createHeroWorkOrder,
    getAssetExplanationState,
    requestAssetExplanation,
    setAlertStatus,
    setWorkOrderAssignee,
    setWorkOrderNotes,
    setWorkOrderStatus,
    snapshot,
  } = useDemo();
  const plantAlerts = snapshot.alerts.filter((alert) => alert.plantId === snapshot.selectedPlant.id);
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>(plantAlerts[0]?.id);
  const [draftAssignee, setDraftAssignee] = useState("user-tech-01");

  const selectedAlert =
    plantAlerts.find((alert) => alert.id === selectedAlertId) ?? plantAlerts[0];
  const selectedAsset = selectedAlert
    ? snapshot.assets.find((asset) => asset.id === selectedAlert.assetId)
    : snapshot.heroAsset;
  const explanationState = selectedAsset
    ? getAssetExplanationState(selectedAsset.id)
    : null;
  const selectedExplanation = selectedAsset
    ? explanationState?.payload ?? snapshot.explanationByAsset[selectedAsset.id]
    : null;
  const workOrder = selectedAsset
    ? snapshot.workOrders.find((entry) => entry.assetId === selectedAsset.id)
    : undefined;
  const primarySensor = selectedAsset?.sensors[0];
  const primarySeries =
    selectedAsset && primarySensor ? getTelemetry(selectedAsset, primarySensor.key) : null;
  const technicianOptions = users.filter((user) => user.role === "technician");
  const activeWindowLabel = getWindowRiskLabel(snapshot.window);
  const alternateWindow = getAlternateWindow(snapshot.window);
  const alternateWindowLabel = getWindowRiskLabel(alternateWindow);
  const requestExplanation = useEffectEvent((assetId: string) => {
    void requestAssetExplanation(assetId);
  });

  useEffect(() => {
    if (!selectedAsset) {
      return;
    }

    requestExplanation(selectedAsset.id);
  }, [selectedAsset, explanationState?.signature]);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Maintenance"
        title="Turn a live Bridgewater alert into an action plan a technician can actually execute."
        description={snapshot.scenario.maintenanceNarrative}
        aside={
          selectedAsset ? (
            <div className="rounded-[1.3rem] border border-border/60 bg-white/80 px-5 py-4 shadow-[0_24px_70px_-56px_rgba(18,40,76,0.28)]">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Selected alert
              </p>
              <p className="mt-3 font-mono text-2xl tracking-[-0.04em] text-[color:var(--brand-ink)]">
                {selectedAsset.code}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{selectedAlert?.title}</p>
            </div>
          ) : null
        }
      />

      <MetricRow
        items={[
          {
            label: "Selected Plant",
            value: snapshot.selectedPlant.name,
            detail: `${plantAlerts.length} active alerts in the plant maintenance queue.`,
            accent: "sky",
          },
          {
            label: "Open Work Orders",
            value: `${snapshot.workOrders.length}`,
            detail: "Live work orders currently tracked in the demo session.",
          },
          {
            label: `Lead ${activeWindowLabel} Risk`,
            value: selectedAsset ? formatPercent(getWindowRisk(snapshot.window, selectedAsset)) : "0%",
            detail: selectedAsset?.predictedStoppageWindow ?? "No active stoppage window",
          },
          {
            label: "Recommended Playbook",
            value: selectedAsset?.playbookCode ?? "PB",
            detail: selectedAsset?.recommendedAction ?? "Select an alert to view the playbook.",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionBlock kicker="Triage Queue" title="Prioritize the plant's active alerts">
          <div className="space-y-3">
            {plantAlerts.map((alert) => {
              const asset = snapshot.assets.find((entry) => entry.id === alert.assetId);

              return (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={`w-full rounded-[1.2rem] border px-4 py-3 text-left transition-all ${
                    selectedAlertId === alert.id
                      ? "border-[color:rgba(18,40,76,0.16)] bg-[color:rgba(111,177,200,0.08)]"
                      : "border-border/70 bg-white/76 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-[color:var(--brand-ink)]">
                          {asset?.code}
                        </p>
                        <span className="text-xs text-muted-foreground">{asset?.line.name}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-[color:var(--brand-ink)]">
                        {alert.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {alert.triggerReason}
                      </p>
                    </div>
                    <RiskPill riskBand={alert.severity} />
                  </div>
                </button>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock kicker="Inspector" title="Asset context, explanation, and work dispatch">
          {selectedAsset && selectedExplanation ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-lg text-[color:var(--brand-ink)]">
                        {selectedAsset.code}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedAsset.name}
                      </p>
                    </div>
                    <RiskPill riskBand={selectedAsset.riskBand} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {selectedExplanation.summary}
                  </p>
                  <p className="mt-4 rounded-2xl border border-border/70 bg-[color:rgba(111,177,200,0.08)] px-4 py-3 text-sm leading-6 text-[color:var(--brand-ink)]">
                    {selectedExplanation.impact}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  {selectedExplanation.confidenceNote ? (
                    <p className="mt-3 text-xs leading-6 text-muted-foreground">
                      {selectedExplanation.confidenceNote}
                    </p>
                  ) : null}
                  {explanationState?.detail ? (
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {explanationState.detail}
                    </p>
                  ) : null}
                </div>
                <DetailList
                  items={[
                    {
                      label: "Top drivers",
                      value: selectedAsset.topDrivers.join(", "),
                    },
                    {
                      label: "Active / alternate risk",
                      value: `${activeWindowLabel} ${formatPercent(
                        getWindowRisk(snapshot.window, selectedAsset),
                      )} / ${alternateWindowLabel} ${formatPercent(
                        getWindowRisk(alternateWindow, selectedAsset),
                      )}`,
                    },
                    {
                      label: "Playbook action",
                      value: selectedAsset.recommendedAction,
                    },
                  ]}
                />
              </div>

              {primarySeries ? (
                <LineTrendChart
                  title={primarySeries.sensor?.label ?? "Signal"}
                  unit={primarySeries.sensor?.unit ?? ""}
                  current={primarySeries.current}
                  baseline={primarySeries.baseline}
                  showBaseline
                />
              ) : null}

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[1.2rem] border border-border/70 bg-white/80 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Recommended playbook
                      </p>
                      <p className="mt-3 text-xl font-medium tracking-[-0.04em] text-[color:var(--brand-ink)]">
                        {selectedAsset.playbookCode}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-[color:rgba(18,40,76,0.12)] bg-white px-3 py-1 text-[10px] tracking-[0.12em] text-muted-foreground uppercase"
                    >
                      Service cadence
                    </Badge>
                  </div>
                  <div className="mt-5 rounded-[1rem] border border-[color:rgba(111,177,200,0.22)] bg-[color:rgba(111,177,200,0.08)] px-4 py-3">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Operational impact
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--brand-ink)]">
                      {selectedAsset.lineImpact}
                    </p>
                  </div>
                  <div className="mt-3 rounded-[1rem] border border-border/70 bg-white/70 px-4 py-3">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Last maintenance
                    </p>
                    <p className="mt-2 font-mono text-sm text-[color:var(--brand-ink)]">
                      {formatTimestamp(selectedAsset.lastMaintenanceAt)}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.2rem] border border-border/70 bg-white/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-[color:var(--brand-sky)]" />
                      <div>
                        <p className="text-sm font-medium text-[color:var(--brand-ink)]">
                          Work-order composer
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Assign, advance, and open the full order without leaving triage.
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-[color:rgba(18,40,76,0.12)] bg-[color:rgba(111,177,200,0.08)] px-3 py-1 text-[10px] tracking-[0.12em] text-[color:var(--brand-ink)] uppercase"
                    >
                      {workOrder ? workOrderStatusLabels[workOrder.status] : "Draft"}
                    </Badge>
                  </div>
                  {!workOrder ? (
                    <div className="mt-4 space-y-4">
                      <Select value={draftAssignee} onValueChange={setDraftAssignee}>
                        <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-white">
                          <SelectValue placeholder="Assign technician" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicianOptions.map((technician) => (
                            <SelectItem key={technician.id} value={technician.id}>
                              {technician.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={selectedAsset.recommendedAction}
                        readOnly
                        className="min-h-[116px] resize-none rounded-[1.2rem] border-border/70 bg-[color:rgba(111,177,200,0.08)] leading-6"
                      />
                      <div className="flex flex-wrap gap-3">
                        <Button
                          className="rounded-full bg-[color:var(--brand-navy)] px-5 hover:bg-[color:var(--brand-ink)]"
                          onClick={() => createHeroWorkOrder(draftAssignee)}
                        >
                          Create and Assign
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => selectedAlert && setAlertStatus(selectedAlert.id, "acknowledged")}
                        >
                          Acknowledge Alert
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <WorkOrderRail status={workOrder.status} />
                      <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                        <div>
                          <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                            Technician
                          </p>
                          <Select
                            value={workOrder.assignedTo ?? draftAssignee}
                            onValueChange={(value) => setWorkOrderAssignee(workOrder.id, value)}
                          >
                            <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-white">
                              <SelectValue placeholder="Assign technician" />
                            </SelectTrigger>
                            <SelectContent>
                              {technicianOptions.map((technician) => (
                                <SelectItem key={technician.id} value={technician.id}>
                                  {technician.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                            Status
                          </p>
                          <Select
                            value={workOrder.status}
                            onValueChange={(value) => setWorkOrderStatus(workOrder.id, value as WorkOrderStatus)}
                          >
                            <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-white">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              {workOrderStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {workOrderStatusLabels[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Textarea
                        value={workOrder.notes}
                        onChange={(event) => setWorkOrderNotes(workOrder.id, event.target.value)}
                        className="min-h-[110px] resize-none rounded-[1.2rem] border-border/70 bg-white leading-6"
                      />
                      <QuickLink
                        href={`/work-orders/${workOrder.id}`}
                        label="Open full work order"
                        description="Use the dedicated work-order page for status, notes, and verification."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyPanel
              title="No alert selected"
              description="Pick an alert from the queue to inspect the asset context, explanation, and work-order workflow."
            />
          )}
        </SectionBlock>
      </div>
    </div>
  );
}
