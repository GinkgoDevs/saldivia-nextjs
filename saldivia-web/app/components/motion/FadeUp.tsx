"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { BRAND_DURATION, BRAND_EASE } from "./brand-ease";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Slightly snappier for dense UI */
  size?: "sm" | "md";
};

/**
 * Sección o bloque que entra con fade + leve desplazamiento al hacer scroll.
 */
export function FadeUp({ children, className, delay = 0, y, size = "md" }: Props) {
  const reduce = useReducedMotion();
  const dy = y ?? (size === "sm" ? 14 : 24);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: dy }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-7% 0px -4% 0px" }}
      transition={{
        duration: size === "sm" ? BRAND_DURATION.fast : BRAND_DURATION.base,
        delay,
        ease: BRAND_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
