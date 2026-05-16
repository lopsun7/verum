import * as React from "react";

import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.86),rgba(15,23,42,0.62))] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

