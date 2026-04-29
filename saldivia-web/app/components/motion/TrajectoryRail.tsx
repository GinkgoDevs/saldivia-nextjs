"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BRAND_EASE } from "./brand-ease";

type Props = {
  side?: "left" | "right";
  /** Height of the rail as a CSS value, e.g. "52%" */
  height?: string;
  /** Tailwind classes to override positioning */
  className?: string;
};

export function TrajectoryRail({ side = "left", height = "52%", className }: Props) {
  const reduce = useReducedMotion();

  const posClass =
    side === "left"
      ? "left-5 md:left-8 lg:left-14"
      : "right-5 md:right-8 lg:right-14";

  const base = `pointer-events-none absolute top-0 hidden md:flex flex-col items-center ${posClass} ${className ?? ""}`;

  if (reduce) {
    return (
      <div className={base} style={{ height }}>
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-accent-blue/25 to-accent-blue/45" />
        <div className="h-[5px] w-[5px] rounded-full bg-accent-blue/55 ring-[3px] ring-accent-blue/12" />
      </div>
    );
  }

  return (
    <div className={base} style={{ height }}>
      <motion.div
        className="w-px flex-1 bg-gradient-to-b from-transparent via-accent-blue/25 to-accent-blue/45"
        style={{ scaleY: 0, transformOrigin: "top" }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.5, ease: BRAND_EASE, delay: 0.1 }}
      />
      <motion.div
        className="h-[5px] w-[5px] rounded-full bg-accent-blue/55 ring-[3px] ring-accent-blue/12"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 1.45 }}
      />
    </div>
  );
}
