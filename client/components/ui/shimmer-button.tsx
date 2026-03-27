"use client";

import { cn } from "@/lib/utils";

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export function ShimmerButton({
  shimmerColor = "#7c6cf0",
  shimmerSize = "0.1em",
  shimmerDuration = "2.5s",
  borderRadius = "12px",
  background = "rgba(0, 0, 0, 0.9)",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative overflow-hidden whitespace-nowrap px-6 py-3 text-sm font-medium text-white transition-all hover:shadow-[0_0_40px_8px_rgba(124,108,240,0.15)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
        className
      )}
      style={{ borderRadius }}
      {...props}
    >
      <span
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{ borderRadius }}
      >
        <span className="absolute inset-[-100%] animate-[shimmer-spin_4s_linear_infinite]">
          <span
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from 0deg, transparent 0 340deg, ${shimmerColor} 360deg)`,
            }}
          />
        </span>
      </span>
      <span
        className="absolute inset-px rounded-[inherit] transition-colors"
        style={{ background, borderRadius }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
