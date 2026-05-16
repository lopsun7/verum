import { cn } from "@/lib/utils";

export function Pill({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white/72 uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

