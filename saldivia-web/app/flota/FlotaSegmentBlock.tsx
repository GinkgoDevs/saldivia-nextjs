"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Model } from "@/types/model";
import { FadeUp } from "../components/motion";
import { FlotaModelCard } from "./FlotaModelCard";

type FlotaModel = Pick<Model, "slug" | "name" | "description" | "cover_image_url">;

const gridList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.02 } },
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  variant: "surface" | "muted";
  columns: "2" | "3";
  aspect: "video" | "square";
  models: FlotaModel[];
  id: string;
};

export function FlotaSegmentBlock({
  eyebrow,
  title,
  intro,
  variant,
  columns,
  aspect,
  models,
  id,
}: Props) {
  const reduce = useReducedMotion();
  if (models.length === 0) return null;

  const bg = variant === "muted" ? "bg-surface-container-low" : "bg-surface";
  const grid =
    columns === "3" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2";

  return (
    <section id={id} className={`scroll-mt-20 py-14 sm:scroll-mt-24 sm:py-20 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
        <FadeUp className="mb-10 sm:mb-12 md:mb-16">
          <header>
            <span className="ui-section-eyebrow">{eyebrow}</span>
            <h2 className="ui-section-title text-2xl sm:text-3xl md:text-4xl">{title}</h2>
            <div className="technical-gradient mt-4 h-1 w-20" />
            <p className="ui-section-intro">{intro}</p>
          </header>
        </FadeUp>
        {reduce ? (
          <div className={`grid ${grid} gap-6 md:gap-8`}>
            {models.map((m) => (
              <FlotaModelCard key={m.slug} model={m} aspect={aspect} />
            ))}
          </div>
        ) : (
          <motion.div
            className={`grid ${grid} gap-6 md:gap-8`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08, margin: "0px 0px -6% 0px" }}
            variants={gridList}
          >
            {models.map((m) => (
              <FlotaModelCard key={m.slug} model={m} aspect={aspect} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
