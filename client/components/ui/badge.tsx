"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "info";
}

const variants = {
  default: "border-white/[0.08] bg-white/[0.04] text-white/60",
  success: "border-[#34d399]/20 bg-[#34d399]/10 text-[#34d399]",
  warning: "border-[#fbbf24]/20 bg-[#fbbf24]/10 text-[#fbbf24]",
  info: "border-[#4fc3f7]/20 bg-[#4fc3f7]/10 text-[#4fc3f7]",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
