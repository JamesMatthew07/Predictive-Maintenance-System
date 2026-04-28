import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-input bg-white/86 px-3 py-2 text-sm text-[color:var(--brand-ink)] shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground selection:bg-[color:rgba(111,177,200,0.28)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-[color:var(--brand-sky)] focus-visible:ring-[3px] focus-visible:ring-[color:rgba(111,177,200,0.22)] aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
