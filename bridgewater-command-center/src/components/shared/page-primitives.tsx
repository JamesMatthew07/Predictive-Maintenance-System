"use client";

import Link from "next/link";

import { ArrowRight, CheckCircle2, Circle, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { RiskBand, WorkOrderStatus } from "@/lib/types";

const riskBandClasses: Record<RiskBand, string> = {
  healthy:
    "border-[color:rgba(47,143,91,0.18)] bg-[color:rgba(47,143,91,0.10)] text-[color:var(--success)]",
  watch:
    "border-[color:rgba(216,138,29,0.16)] bg-[color:rgba(216,138,29,0.10)] text-[color:var(--warning)]",
  warning:
    "border-[color:rgba(216,138,29,0.2)] bg-[color:rgba(216,138,29,0.14)] text-[color:var(--warning)]",
  critical:
    "border-[color:rgba(199,70,52,0.2)] bg-[color:rgba(199,70,52,0.12)] text-[color:var(--critical)]",
};

const orderSteps: WorkOrderStatus[] = [
  "draft",
  "assigned",
  "in_progress",
  "completed",
  "verified",
];

const orderStepLabels: Record<WorkOrderStatus, string> = {
  draft: "Draft",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  verified: "Verified",
};

export function RiskPill({
  riskBand,
  label,
  subtle = false,
}: {
  riskBand: RiskBand;
  label?: string;
  subtle?: boolean;
}) {
  return (
    <Badge
      className={cn(
        "rounded-full border px-3 py-1 font-medium tracking-[0.08em] uppercase",
        riskBandClasses[riskBand],
        subtle && "bg-transparent",
      )}
    >
      {label ?? riskBand}
    </Badge>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className="fade-in-up grid w-full min-w-0 gap-5 border-b border-border/60 pb-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)] lg:items-end">
      <div className="min-w-0 space-y-3">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-[color:var(--brand-sky)] uppercase">
          {eyebrow}
        </p>
        <div className="space-y-3">
          <h1 className="max-w-4xl text-3xl font-medium tracking-[-0.04em] text-[color:var(--brand-ink)] md:text-[2.7rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </div>
      {aside ? <div className="min-w-0 lg:w-full lg:justify-self-end">{aside}</div> : null}
    </section>
  );
}

export function MetricRow({
  items,
  className,
}: {
  items: Array<{
    label: string;
    value: string;
    detail: string;
    accent?: "default" | "sky";
  }>;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid w-full min-w-0 gap-px overflow-hidden rounded-[1.35rem] border border-border/60 bg-border/70 shadow-[0_24px_80px_-56px_rgba(18,40,76,0.28)] md:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "group min-w-0 bg-white/90 px-5 py-4 backdrop-blur transition-colors hover:bg-white",
            item.accent === "sky" &&
              "bg-[linear-gradient(180deg,rgba(111,177,200,0.16),rgba(255,255,255,0.98))]",
          )}
        >
          <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            {item.label}
          </p>
          <div className="mt-4 flex min-w-0 items-end justify-between gap-4">
            <p className="font-mono text-[2rem] leading-none tracking-[-0.05em] text-[color:var(--brand-ink)]">
              {item.value}
            </p>
          </div>
          <p className="mt-3 max-w-[24ch] text-sm leading-6 text-muted-foreground">
            {item.detail}
          </p>
        </div>
      ))}
    </section>
  );
}

export function SectionBlock({
  kicker,
  title,
  action,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "surface-panel fade-in-up w-full min-w-0 space-y-5 rounded-[1.4rem] border border-border/60 px-5 py-5 shadow-[0_22px_90px_-64px_rgba(18,40,76,0.34)] md:px-6",
        className,
      )}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          {kicker ? (
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--brand-sky)] uppercase">
              {kicker}
            </p>
          ) : null}
          <h2 className="text-xl font-medium tracking-[-0.03em] text-[color:var(--brand-ink)]">
            {title}
          </h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function DetailList({
  items,
  className,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-3", className)}>
      {items.map((item, index) => (
        <div key={item.label}>
          {index > 0 ? <Separator className="mb-3" /> : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <dt className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {item.label}
            </dt>
            <dd className="min-w-0 text-left text-sm leading-6 text-[color:var(--brand-ink)] sm:max-w-[70%] sm:text-right">
              {item.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function EmptyPanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-[1.4rem] border border-dashed border-border/80 bg-white/60 px-6 py-12 text-center">
      <div className="max-w-md space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:rgba(111,177,200,0.14)] text-[color:var(--brand-sky)]">
          <Clock3 className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium tracking-[-0.02em] text-[color:var(--brand-ink)]">
            {title}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

export function WorkOrderRail({
  status,
}: {
  status: WorkOrderStatus;
}) {
  const activeIndex = orderSteps.indexOf(status);

  return (
    <div className="rounded-[1.15rem] border border-border/70 bg-white/70 px-3 py-3">
      <div className="grid grid-cols-5 items-start">
        {orderSteps.map((step, index) => {
          const active = activeIndex >= index;
          const done = activeIndex > index;
          const Icon = done ? CheckCircle2 : active ? ArrowRight : Circle;

          return (
            <div
              key={step}
              className="relative flex min-w-0 flex-col items-center gap-2 px-1 text-center"
            >
              {index < orderSteps.length - 1 ? (
                <span
                  className={cn(
                    "absolute top-4 right-[calc(-50%+18px)] left-[calc(50%+18px)] h-px",
                    done ? "bg-[color:rgba(47,143,91,0.42)]" : "bg-border",
                  )}
                />
              ) : null}
              <div
                className={cn(
                  "relative z-10 grid h-8 w-8 place-items-center rounded-full border transition-colors",
                  active
                    ? "border-[color:rgba(18,40,76,0.16)] bg-[color:rgba(111,177,200,0.14)]"
                    : "border-border/80 bg-white",
                  done && "border-[color:rgba(47,143,91,0.24)] bg-[color:rgba(47,143,91,0.10)]",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    done
                      ? "text-[color:var(--success)]"
                      : active
                        ? "text-[color:var(--brand-sky)]"
                        : "text-muted-foreground",
                  )}
                />
              </div>
              <p
                className={cn(
                  "w-full truncate text-[10px] font-semibold tracking-[0.08em] uppercase",
                  active ? "text-[color:var(--brand-ink)]" : "text-muted-foreground",
                )}
              >
                {orderStepLabels[step]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function QuickLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-center justify-between gap-4 rounded-[1.15rem] border border-border/70 bg-white/70 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[color:rgba(18,40,76,0.16)] hover:bg-white"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-[color:var(--brand-ink)]">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function InlineStat({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className={cn("text-sm text-[color:var(--brand-ink)]", mono && "font-mono")}>
        {value}
      </p>
    </div>
  );
}

export function ActionButtonLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button asChild className="rounded-full bg-[color:var(--brand-navy)] px-5 shadow-none hover:bg-[color:var(--brand-ink)]">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
