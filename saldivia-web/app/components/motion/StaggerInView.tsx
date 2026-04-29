"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { BRAND_DURATION, BRAND_EASE } from "./brand-ease";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: BRAND_DURATION.base, ease: BRAND_EASE },
  },
};

type InViewProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

/**
 * Contenedor: hijos con `StaggerItem` entran en cascada al entrar en viewport.
 */
export function StaggerInView({ children, className, stagger = 0.09 }: InViewProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-6% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
      }}
    >
      {children}
    </motion.div>
  );
}

type ItemProps = { children: ReactNode; className?: string };

export function StaggerItem({ children, className }: ItemProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
