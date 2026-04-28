"use client";

import { useDeferredValue } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TelemetryPoint } from "@/lib/types";

export function LineTrendChart({
  title,
  unit,
  current,
  baseline,
  showBaseline,
}: {
  title: string;
  unit: string;
  current: TelemetryPoint[];
  baseline: TelemetryPoint[];
  showBaseline: boolean;
}) {
  const deferredCurrent = useDeferredValue(current);
  const deferredBaseline = useDeferredValue(baseline);

  const data = deferredCurrent.map((point, index) => ({
    label: point.label,
    current: point.value,
    baseline: deferredBaseline[index]?.value ?? point.baseline,
    guide: point.baseline,
  }));
  const windowLabel = data.length > 120 ? "72h window" : "24h window";
  const latestPoint = data[data.length - 1];
  const latestDelta = latestPoint ? latestPoint.current - latestPoint.baseline : 0;
  const deltaDigits = Math.abs(latestDelta) < 10 ? 2 : 1;
  const deltaPrefix = latestDelta > 0 ? "+" : "";

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[color:var(--brand-ink)]">{title}</p>
          <p className="text-xs text-muted-foreground">{unit}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {windowLabel}
          </p>
          <p className="font-mono text-sm text-[color:var(--brand-ink)]">
            {deltaPrefix}
            {latestDelta.toFixed(deltaDigits)} {unit} vs baseline
          </p>
        </div>
      </div>
      <ChartContainer
        className="h-[220px] w-full"
        config={{
          current: {
            label: "Live scenario",
            color: "var(--brand-navy)",
          },
          baseline: {
            label: "Healthy baseline",
            color: "var(--brand-sky)",
          },
        }}
      >
        <LineChart data={data} margin={{ top: 12, right: 12, left: -14, bottom: 2 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 6" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            minTickGap={28}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={42}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={{ stroke: "rgba(18,40,76,0.1)", strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ReferenceLine
            y={data[data.length - 1]?.guide}
            stroke="rgba(17,24,39,0.16)"
            strokeDasharray="4 4"
          />
          {showBaseline ? (
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="var(--brand-sky)"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="current"
            stroke="var(--brand-navy)"
            strokeWidth={3}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
