"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Model } from "@/types/model";
import { CATALOG_IMG } from "../data/flota-catalog";
import { BRAND_DURATION, BRAND_EASE } from "../components/motion/brand-ease";

type FlotaModel = Pick<Model, "slug" | "name" | "description" | "cover_image_url">;

const cardItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: BRAND_DURATION.base, ease: BRAND_EASE },
  },
};

function ModelCardInner({
  model,
  aspect,
  variant = "card",
}: {
  model: FlotaModel;
  aspect: "video" | "square";
  variant?: "card" | "grid";
}) {
  const href = `/producto/${model.slug}`;
  const src = model.cover_image_url ?? CATALOG_IMG;
  const aspectClass = aspect === "video" ? "aspect-[4/3]" : "aspect-square md:aspect-[4/5]";

  const wrapClass =
    variant === "grid"
      ? "group relative flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
      : "ui-surface-card group relative flex flex-col overflow-hidden rounded-curve-md hover:border-accent-blue/45 hover:shadow-elev-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2";

  return (
    <a href={href} className={wrapClass}>
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-surface-container-high`}>
        <img
          alt=""
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-[0.55]"
          src={src}
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent px-5 pb-4 pt-20 transition-all duration-500 group-hover:translate-y-4 group-hover:opacity-0">
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-container">
            {model.name}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(32, 149, 212, 0.42) 0%, rgba(13, 44, 79, 0.55) 45%, rgba(0, 23, 50, 0.92) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-primary/25 backdrop-blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute inset-4 md:inset-6">
            <div className="absolute left-0 top-0 h-11 w-11 origin-top-left scale-75 border-l-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute right-0 top-0 h-11 w-11 origin-top-right scale-75 border-r-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 h-11 w-11 origin-bottom-left scale-75 border-b-[3px] border-l-[3px] border-accent-blue opacity-0 transition-all delay-150 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 right-0 h-11 w-11 origin-bottom-right scale-75 border-b-[3px] border-r-[3px] border-accent-blue opacity-0 transition-all delay-200 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute left-1/2 top-1/2 h-px w-[min(72%,220px)] -translate-x-1/2 -translate-y-[3.25rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            <div className="absolute left-1/2 top-1/2 h-px w-[min(72%,220px)] -translate-x-1/2 translate-y-[3.25rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </div>

          <div className="relative z-10 mx-auto max-w-md translate-y-5 px-6 text-center opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="font-headline text-2xl font-black uppercase leading-tight tracking-tighter text-white drop-shadow-md md:text-3xl">
              {model.name}
            </h3>
            <p className="mt-4 font-headline text-sm font-medium leading-relaxed text-white/90 md:text-[0.95rem]">
              {model.description ?? ""}
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-2 font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-accent-blue">
              <span className="h-px w-6 bg-accent-blue/80" />
              Ver modelo
              <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
              <span className="h-px w-6 bg-accent-blue/80" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

type Props = { model: FlotaModel; aspect: "video" | "square"; variant?: "card" | "grid" };

export function FlotaModelCard({ model, aspect, variant = "card" }: Props) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <ModelCardInner model={model} aspect={aspect} variant={variant} />;
  }
  return (
    <motion.div className="min-w-0" variants={cardItem}>
      <ModelCardInner model={model} aspect={aspect} variant={variant} />
    </motion.div>
  );
}
