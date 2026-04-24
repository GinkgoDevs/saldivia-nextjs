"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Secciones de Home con elevación sutil al entrar en viewport (Dev A-05 / animación).
 */
export function MotionReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -4% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
