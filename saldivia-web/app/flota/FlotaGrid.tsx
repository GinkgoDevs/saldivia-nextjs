"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Model } from "@/types/model";
import { FlotaModelCard } from "./FlotaModelCard";

type FlotaModel = Pick<Model, "slug" | "name" | "description" | "cover_image_url">;

const gridList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
};

export function FlotaGrid({ models }: { models: FlotaModel[] }) {
  const reduce = useReducedMotion();
  if (models.length === 0) return null;

  const inner = (
    <>
      {models.map((m) => (
        <FlotaModelCard key={m.slug} model={m} aspect="video" variant="grid" />
      ))}
    </>
  );

  return (
    <section className="w-full bg-surface">
      {reduce ? (
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">{inner}</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.04 }}
          variants={gridList}
        >
          {inner}
        </motion.div>
      )}
    </section>
  );
}
