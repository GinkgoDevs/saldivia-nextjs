"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";
import { BRAND_DURATION, BRAND_EASE } from "./brand-ease";

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: BRAND_DURATION.base, ease: BRAND_EASE },
  },
};

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

type Props = { children: ReactNode; className?: string };

/**
 * Stagger sutil al cargar el hero (primera sección de página).
 */
export function HeroStagger({ children, className }: Props) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={list}
    >
      {Children.map(children, (child, i) => (
        <motion.div key={i} className="min-w-0" variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
