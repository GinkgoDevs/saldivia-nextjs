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
    <section className="bg-surface py-10 sm:py-14 md:py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
        {reduce ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {inner}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.04 }}
            variants={gridList}
          >
            {inner}
          </motion.div>
        )}
      </div>
    </section>
  );
}
