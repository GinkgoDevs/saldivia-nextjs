"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { BRAND_DURATION, BRAND_EASE } from "../motion/brand-ease";

/**
 * Secciones de Home con elevación sutil al entrar en viewport (Dev A-05 / animación).
 */
export function MotionReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  /* Solo translateY: nunca opacity. Con html { zoom } whileInView a veces no dispara y opacity 0 dejaba bloques enteros invisibles (CTA final, segmentación). */
  return (
    <motion.div
      className={className}
      initial={{ y: 22 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: BRAND_DURATION.base, ease: BRAND_EASE }}
    >
      {children}
    </motion.div>
  );
}
