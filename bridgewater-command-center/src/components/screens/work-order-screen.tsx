"use client";

import Link from "next/link";

import { useDemo } from "@/components/providers/demo-provider";
import {
  DetailList,
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

export function WorkOrderScreen({ workOrderId }: { workOrderId: string }) {
  const { setWorkOrderNotes, setWorkOrderStatus, snapshot, toggleChecklistItem } = useDemo();
  const workOrder = snapshot.workOrders.find((entry) => entry.id === workOrderId);
  const asset = workOrder ? snapshot.assets.find((entry) => entry.id === workOrder.assetId) : undefined;

  if (!workOrder || !asset) {
    return (
      <div className="space-y-6">
        <PageIntro
          eyebrow="Work Order"
          title="This work order is not active in the current session."
          description="Create it from the maintenance screen or return to the technician route to continue the Warren story."
        />
        <EmptyPanel
          title="Work order not found"
          description="The detail page reflects the current in-session work-order state, including draft orders created during the demo."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Work Order"
        title={`${workOrder.id} | ${workOrder.title}`}
        description="A focused view of assignment, status progression, notes, and verification. This is the accountability layer between maintenance triage and technician completion."
        aside={<RiskPill riskBand={asset.riskBand} label={workOrder.priority} />}
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionBlock kicker="Summary" title={`${asset.code} | ${asset.name}`}>
          <DetailList
            items={[
              {
                label: "Plant / line",
                value: `${asset.plant.name} / ${asset.line.name}`,
              },
              {
                label: "Due",
                value: workOrder.dueAt,
              },
              {
                label: "Playbook",
                value: workOrder.playbookCode,
              },
            ]}
          />
          <div className="pt-4">
            <QuickLink
              href={`/assets/${asset.id}`}
              label="Open asset context"
              description="Show the signal history and explanation that justified this order."
            />
          </div>
        </SectionBlock>

        <SectionBlock kicker="Lifecycle" title="Status progression and completion evidence">
          <div className="space-y-5">
            <WorkOrderRail status={workOrder.status} />
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
                  <p className="text-sm text-[color:var(--brand-ink)]">{item.label}</p>
                </button>
              ))}
            </div>
            <Textarea
              value={workOrder.notes}
              onChange={(event) => setWorkOrderNotes(workOrder.id, event.target.value)}
              className="min-h-[120px] resize-none rounded-[1.2rem] border-border/70 bg-white"
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
                <Link href="/technician">Open technician view</Link>
              </Button>
            </div>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
