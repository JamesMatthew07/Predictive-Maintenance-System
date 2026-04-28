"use client";

import { useState } from "react";
import Link from "next/link";

import { HardHat } from "lucide-react";

import { useDemo } from "@/components/providers/demo-provider";
import { getUserById } from "@/lib/engine/demo-engine";
import {
  EmptyPanel,
  PageIntro,
  QuickLink,
  RiskPill,
  SectionBlock,
  WorkOrderRail,
} from "@/components/shared/page-primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { WorkOrderStatus } from "@/lib/types";

export function TechnicianScreen() {
  const { setWorkOrderNotes, setWorkOrderStatus, snapshot, state, toggleChecklistItem } = useDemo();
  const technicianId = state.role === "technician" ? undefined : "user-tech-01";
  const plantWorkOrders = snapshot.workOrders.filter((workOrder) => {
    const orderAsset = snapshot.assets.find((asset) => asset.id === workOrder.assetId);

    return orderAsset?.plantId === snapshot.selectedPlant.id;
  });
  const activeOrder =
    plantWorkOrders.find((workOrder) => workOrder.assignedTo === technicianId) ??
    plantWorkOrders.find((workOrder) => workOrder.assetId === snapshot.heroAsset?.id) ??
    plantWorkOrders[0] ??
    snapshot.workOrders[0];
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | undefined>();
  const selectedWorkOrder = selectedWorkOrderId
    ? snapshot.workOrders.find((entry) => entry.id === selectedWorkOrderId)
    : undefined;
  const selectedAsset = selectedWorkOrder
    ? snapshot.assets.find((entry) => entry.id === selectedWorkOrder.assetId)
    : undefined;
  const workOrder =
    selectedAsset?.plantId === snapshot.selectedPlant.id ? selectedWorkOrder : activeOrder;
  const asset = workOrder ? snapshot.assets.find((entry) => entry.id === workOrder.assetId) : undefined;
  const assignedUser = getUserById(workOrder?.assignedTo)?.name;

  if (!workOrder || !asset) {
    return (
      <div className="space-y-6">
        <PageIntro
          eyebrow="Technician"
          title="The technician workflow is ready for dispatch."
          description="Create or assign a work order from the maintenance workspace and it will appear here in a stripped-down, mobile-friendly task flow."
        />
        <EmptyPanel
          title="No assigned technician work"
          description="Use the maintenance workspace to dispatch the Warren work order and then return here to complete the task."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Technician"
        title="A focused task view for the plant floor."
        description="This route deliberately strips away the dashboard chrome. The goal is to make the next action, the checklist, and the verification state readable on tablet or mobile width."
        aside={
          <div className="rounded-[1.3rem] border border-border/60 bg-white/80 px-5 py-4 shadow-[0_24px_70px_-56px_rgba(18,40,76,0.28)]">
              <div className="flex items-center gap-2">
                <HardHat className="h-4 w-4 text-[color:var(--brand-sky)]" />
                <p className="text-sm font-medium text-[color:var(--brand-ink)]">
                  {assignedUser ?? workOrder.assignedTo ?? "Dispatch pending"}
                </p>
              </div>
            <p className="mt-2 font-mono text-lg text-[color:var(--brand-ink)]">
              {workOrder.id}
            </p>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <SectionBlock kicker="Active Job" title={`${asset.code} | ${asset.name}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-border/70 bg-white/76 px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Plant / line
                </p>
                <p className="mt-1 text-sm text-[color:var(--brand-ink)]">
                  {asset.plant.name} / {asset.line.name}
                </p>
              </div>
              <RiskPill riskBand={asset.riskBand} />
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/76 p-4">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Task summary
              </p>
              <p className="mt-3 text-lg font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
                {workOrder.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {asset.recommendedAction}
              </p>
            </div>
            <QuickLink
              href={`/assets/${asset.id}`}
              label="Open asset detail"
              description="Use the detailed asset page if the presenter wants to show the signal history before finishing the job."
            />
          </div>
        </SectionBlock>

        <SectionBlock kicker="Execution" title="Checklist, notes, and verification">
          <div className="space-y-5">
            <WorkOrderRail status={workOrder.status} />
            <div className="space-y-3">
              {plantWorkOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelectedWorkOrderId(order.id)}
                  className={`w-full rounded-[1.1rem] border px-4 py-3 text-left ${
                    workOrder.id === order.id
                      ? "border-[color:rgba(18,40,76,0.16)] bg-[color:rgba(111,177,200,0.08)]"
                      : "border-border/70 bg-white/76 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm text-[color:var(--brand-ink)]">{order.id}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{order.title}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{order.status}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {workOrder.checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(workOrder.id, item.id)}
                  className={`flex w-full items-start gap-3 rounded-[1.1rem] border px-4 py-3 text-left ${
                    item.completed
                      ? "border-[color:rgba(47,143,91,0.2)] bg-[color:rgba(47,143,91,0.08)]"
                      : "border-border/70 bg-white/76"
                  }`}
                >
                  <div
                    className={`mt-0.5 h-5 w-5 rounded-full border ${
                      item.completed
                        ? "border-[color:var(--success)] bg-[color:var(--success)]"
                        : "border-border/90 bg-white"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-[color:var(--brand-ink)]">{item.label}</p>
                  </div>
                </button>
              ))}
            </div>
            <Textarea
              value={workOrder.notes}
              onChange={(event) => setWorkOrderNotes(workOrder.id, event.target.value)}
              className="min-h-[120px] resize-none rounded-[1.2rem] border-border/70 bg-white"
              placeholder="Add verification notes, readings, or parts used."
            />
            <div className="flex flex-wrap gap-2">
              {(["assigned", "in_progress", "completed", "verified"] as WorkOrderStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={workOrder.status === status ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setWorkOrderStatus(workOrder.id, status)}
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/work-orders/${workOrder.id}`}>Open detail</Link>
              </Button>
            </div>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
