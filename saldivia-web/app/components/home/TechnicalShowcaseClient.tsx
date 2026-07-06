"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";

import { buttonClass } from "@/app/components/ui/Button";
import { BRAND_DURATION, BRAND_EASE } from "@/app/components/motion/brand-ease";
import type { ResolvedHomeShowcaseSlide } from "@/types/home-showcase";

const T = { duration: BRAND_DURATION.base, ease: BRAND_EASE };
const SLOW = { duration: BRAND_DURATION.slow, ease: BRAND_EASE };

// y-only variants — no opacity, avoids whileInView+html{zoom} invisible-element bug
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};
const itemY = {
  hidden: { y: 22 },
  show: { y: 0, transition: T },
};
const itemYDelayed = {
  hidden: { y: 18 },
  show: { y: 0, transition: { ...T, delay: 0.12 } },
};

export function TechnicalShowcaseClient({ slides }: { slides: ResolvedHomeShowcaseSlide[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const n = slides.length;
  const slide = slides[index];

  // Fire animations once when section enters viewport
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const animState = !reduce && isInView ? "show" : "hidden";

  const goPrev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % n), [n]);

  if (!slide) return null;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-industrial-charcoal text-white"
      aria-roledescription="carrusel"
      aria-label="Showcase técnico de modelos"
    >
      {/* ── Atmospheric background ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/saldivia/taller_1.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-industrial-charcoal/80" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[min(52vh,380px)] bg-gradient-to-b from-industrial-charcoal from-0% via-industrial-charcoal/75 via-35% to-transparent to-100%"
          aria-hidden
        />
      </div>

      {/* Desktop: viñeta divisoria imagen → panel (altura total de la sección) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-[420px] z-[11] hidden w-32 bg-gradient-to-l from-industrial-charcoal to-transparent lg:block xl:right-[480px]"
        aria-hidden
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        variants={reduce ? {} : stagger}
        initial="hidden"
        animate={animState}
        className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-8 pb-4 pt-20 md:px-12 md:pb-6 md:pt-24"
      >
        <div>
          <motion.p
            variants={reduce ? {} : itemY}
            className="ui-caption-caps mb-1 text-accent-blue"
          >
            Ingeniería en Movimiento
          </motion.p>
          <motion.h2
            variants={reduce ? {} : itemY}
            className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
          >
            SHOWCASE TÉCNICO
          </motion.h2>
        </div>

        {n > 1 && (
          <motion.div variants={reduce ? {} : itemY} className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Slide anterior"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 active:scale-95"
            >
              <span className="material-symbols-outlined select-none text-[20px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Slide siguiente"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 active:scale-95"
            >
              <span className="material-symbols-outlined select-none text-[20px]">chevron_right</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ── Body: image + content panel ────────────────────────── */}
      <div className="relative z-10 flex flex-grow flex-col pt-24 md:pt-28 lg:flex-row lg:items-stretch lg:pt-32">

        {/* Hero image */}
        <div className="relative flex min-h-0 flex-1 self-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${slide.id}`}
              className="relative h-[45vh] w-full lg:h-full lg:min-h-0"
              initial={reduce ? {} : { x: -20 }}
              animate={reduce ? {} : { x: 0 }}
              exit={reduce ? {} : { x: 16 }}
              transition={SLOW}
            >
              <img
                src={slide.heroSrc}
                alt={slide.name}
                className="h-full w-full object-contain p-6 md:p-10 lg:p-12"
                style={{
                  objectPosition: `${slide.heroFocalX}% ${slide.heroFocalY}%`,
                  transform: slide.heroZoom > 1 ? `scale(${slide.heroZoom})` : undefined,
                  transformOrigin: `${slide.heroFocalX}% ${slide.heroFocalY}%`,
                }}
              />
              {/* Blend bottom on mobile */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-industrial-charcoal to-transparent lg:hidden" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="flex w-full flex-col justify-center px-8 py-12 md:px-12 lg:w-[420px] lg:shrink-0 lg:py-24 xl:w-[480px]"
            initial={reduce ? {} : { y: 20 }}
            animate={reduce ? {} : { y: 0 }}
            exit={reduce ? {} : { y: -14 }}
            transition={T}
          >
            {/* Slide counter */}
            {n > 1 && (
              <div className="mb-6 flex items-center gap-3">
                <span className="font-mono text-xs font-bold tabular-nums text-accent-blue">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative h-px flex-1 max-w-[60px] bg-white/15">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-accent-blue"
                    animate={{ width: `${((index + 1) / n) * 100}%` }}
                    transition={{ duration: 0.45, ease: BRAND_EASE }}
                  />
                </div>
                <span className="font-mono text-xs font-bold tabular-nums text-white/25">
                  {String(n).padStart(2, "0")}
                </span>
              </div>
            )}

            {/* Model name */}
            <motion.h3
              variants={reduce ? {} : itemYDelayed}
              initial="hidden"
              animate={animState}
              className="mb-2 font-headline text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight"
            >
              {slide.name}
            </motion.h3>

            {slide.lead && (
              <motion.p
                variants={reduce ? {} : itemYDelayed}
                initial="hidden"
                animate={animState}
                className="mb-8 text-[0.95rem] leading-relaxed text-slate-400"
              >
                {slide.lead}
              </motion.p>
            )}

            {/* Spec rows */}
            {slide.specRows.length > 0 && (
              <div className="mb-8 divide-y divide-white/[0.07]">
                {slide.specRows.map((row) => (
                  <div key={row.key} className="flex items-center justify-between py-3">
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
                      {row.key}
                    </span>
                    <span className="text-sm font-semibold text-white/90">{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Link
                className={buttonClass({
                  variant: "outline",
                  size: "lg",
                  className:
                    "group justify-center rounded-sm border-white bg-white text-industrial-charcoal hover:border-accent-blue hover:bg-accent-blue hover:text-white",
                })}
                href={`/producto/${slide.slug}`}
              >
                Ver ficha del modelo
                <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
              {slide.pdfUrl && (
                <a
                  href={slide.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass({
                    variant: "ghost",
                    size: "lg",
                    className:
                      "justify-center rounded-sm border border-white/20 text-white hover:bg-white/10",
                  })}
                >
                  Descargar ficha técnica
                  <span className="material-symbols-outlined ml-2 text-[20px]">download</span>
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
