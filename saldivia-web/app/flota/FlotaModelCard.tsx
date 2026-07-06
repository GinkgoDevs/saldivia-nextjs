"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Model } from "@/types/model";
import { CATALOG_IMG } from "../data/flota-catalog";
import { BRAND_DURATION, BRAND_EASE } from "../components/motion/brand-ease";
import { imageFocalStyle } from "@/lib/image-focal";

type FlotaModel = Pick<Model, "slug" | "name" | "description" | "cover_image_url"> &
  Partial<Pick<Model, "cover_image_focal_x" | "cover_image_focal_y" | "cover_image_zoom">>;

export type { FlotaModel };

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
  const coverStyle = imageFocalStyle(
    model.cover_image_focal_x ?? 50,
    model.cover_image_focal_y ?? 50,
    model.cover_image_zoom ?? 1,
  );
  const aspectClass =
    variant === "grid"
      ? "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4]"
      : aspect === "video"
        ? "aspect-[4/3]"
        : "aspect-square md:aspect-[4/5]";

  const wrapClass =
    variant === "grid"
      ? "group relative flex flex-col overflow-hidden border border-outline-variant/15 bg-white shadow-[0px_20px_48px_rgba(13,44,79,0.12)] transition-shadow duration-300 hover:border-accent-blue/25 hover:shadow-[0px_28px_64px_rgba(13,44,79,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
      : "ui-surface-card group relative flex flex-col overflow-hidden rounded-curve-md hover:border-accent-blue/45 hover:shadow-elev-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2";

  return (
    <a href={href} className={wrapClass}>
      <div className={`relative ${aspectClass} w-full shrink-0 overflow-hidden bg-surface-container-lowest`}>
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
          <img alt="" className="h-full w-full object-contain object-center" src={src} style={coverStyle} />
        </div>
      </div>

      <div className="relative z-[1] border-t border-primary/20 bg-primary px-4 py-3 transition-opacity duration-500 group-hover:opacity-0 sm:px-5 sm:py-3.5">
        <p className="font-headline text-sm font-black uppercase tracking-[0.14em] text-white sm:text-[0.95rem]">
          {model.name}
        </p>
      </div>

      {/* Hover: cubre toda la card (imagen + franja inferior) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <img
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center"
          src={src}
          style={coverStyle}
        />
        <div className="absolute inset-0 bg-primary/85" />

        <div className="absolute inset-3 sm:inset-4 md:inset-5">
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
          <div className="ui-caption-caps mx-auto mt-6 flex items-center justify-center gap-2 text-accent-blue">
            <span className="h-px w-6 bg-accent-blue/80" />
            Ver modelo
            <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
              arrow_forward
            </span>
            <span className="h-px w-6 bg-accent-blue/80" />
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
