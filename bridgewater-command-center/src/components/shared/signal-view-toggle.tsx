"use client";

import { Button } from "@/components/ui/button";
import { useDemo } from "@/components/providers/demo-provider";
import type { CompareMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const signalModes: Array<{ value: CompareMode; label: string }> = [
  { value: "live", label: "Live" },
  { value: "compare", label: "Compare" },
];

export function SignalViewToggle() {
  const { setCompareMode, state } = useDemo();

  return (
    <div className="grid h-10 w-[184px] grid-cols-2 gap-1 rounded-xl border border-border/60 bg-white/82 p-1">
      {signalModes.map((mode) => (
        <Button
          key={mode.value}
          variant="ghost"
          className={cn(
            "h-full rounded-lg text-xs font-semibold tracking-[0.1em] uppercase transition-all",
            state.compareMode === mode.value
              ? "bg-[color:var(--brand-sky)] text-[color:var(--brand-ink)] shadow-[0_8px_18px_-14px_rgba(18,40,76,0.44)] hover:bg-[color:var(--brand-sky)]"
              : "text-muted-foreground hover:bg-[color:rgba(18,40,76,0.04)]",
          )}
          onClick={() => setCompareMode(mode.value)}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  );
}
