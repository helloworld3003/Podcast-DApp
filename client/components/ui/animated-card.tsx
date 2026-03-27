"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  className?: string;
  children: React.ReactNode;
  containerClassName?: string;
}

export function AnimatedCard({
  className,
  children,
  containerClassName,
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl animate-fade-in-up",
        containerClassName
      )}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute -inset-px z-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124,108,240,0.1), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}
