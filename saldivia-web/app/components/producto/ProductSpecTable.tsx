"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BRAND_DURATION, BRAND_EASE } from "@/app/components/motion/brand-ease";

type Row = { id: string; spec_key: string; spec_value: string };

const rowV = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: BRAND_DURATION.fast, ease: BRAND_EASE },
  },
};

const bodyV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};

export function ProductSpecTable({ rows }: { rows: Row[] }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className="overflow-x-auto rounded-sm border border-outline-variant/30 bg-white shadow-sm -mx-1 px-1 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[280px] text-left text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-outline-variant/20 last:border-0">
                <th className="w-[40%] max-w-[11rem] bg-surface-container-low/80 px-3 py-3 font-headline text-sm font-bold uppercase leading-snug tracking-wider text-primary sm:w-auto sm:max-w-none sm:px-6 sm:py-4 md:whitespace-nowrap">
                  {row.spec_key}
                </th>
                <td className="px-3 py-3 text-sm font-medium leading-snug text-on-surface-variant sm:px-6 sm:py-4 sm:text-sm">
                  {row.spec_value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-sm border border-outline-variant/30 bg-white shadow-sm -mx-1 px-1 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[280px] text-left text-sm">
        <motion.tbody initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={bodyV}>
          {rows.map((row) => (
            <motion.tr key={row.id} className="border-b border-outline-variant/20 last:border-0" variants={rowV}>
              <th className="w-[40%] max-w-[11rem] bg-surface-container-low/80 px-3 py-3 font-headline text-sm font-bold uppercase leading-snug tracking-wider text-primary sm:w-auto sm:max-w-none sm:px-6 sm:py-4 md:whitespace-nowrap">
                {row.spec_key}
              </th>
              <td className="px-3 py-3 text-sm font-medium leading-snug text-on-surface-variant sm:px-6 sm:py-4 sm:text-sm">
                {row.spec_value}
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}
