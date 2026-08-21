"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { BRAND_EASE } from "../components/motion/brand-ease";
import { buttonClass } from "../components/ui/Button";

const METRICS = [
  { label: "Sistema de gestión de calidad NORMA ISO 9001.", value: 100 },
  { label: "Expectativas de nuestros clientes", value: 100 },
  { label: "Tiempo de fabricación más bajo del mercado", value: 95 },
  { label: "Alternativas de carrozado y equipamiento", value: 80 },
] as const;

function QualityMetric({
  label,
  value,
  index,
  inView,
  reduceMotion,
}: {
  label: string;
  value: number;
  index: number;
  inView: boolean;
  reduceMotion: boolean;
}) {
  const delay = reduceMotion ? 0 : 0.12 + index * 0.1;

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <p className="text-sm font-medium leading-snug text-white/90 sm:text-base">{label}</p>
        <span className="shrink-0 font-headline text-sm font-black tabular-nums text-accent-blue sm:text-base">
          {value}%
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-sm bg-white/20"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label}
      >
        <motion.div
          className="h-full origin-left bg-accent-blue"
          initial={{ scaleX: reduceMotion ? value / 100 : 0 }}
          animate={inView || reduceMotion ? { scaleX: value / 100 } : { scaleX: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, delay, ease: BRAND_EASE }}
        />
      </div>
    </div>
  );
}

export function NosotrosCalidad({ pdfUrl }: { pdfUrl?: string | null }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion() ?? false;
  const href = pdfUrl?.trim() || null;

  return (
    <section
      ref={ref}
      aria-labelledby="nosotros-calidad-heading"
      className="relative overflow-hidden py-16 text-white sm:py-20 md:py-24"
    >
      <img
        src="/galeria-innovacion/07-linea-produccion.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-primary-brand/88" />
      <div className="pointer-events-none absolute inset-0 industrial-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-brand via-primary-brand/70 to-primary-brand/40" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2
              id="nosotros-calidad-heading"
              className="font-headline text-3xl font-black uppercase leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl"
            >
              La más alta calidad
              <br />
              de nuestro trabajo.
            </h2>
            <p className="mt-6 text-xs font-bold uppercase italic tracking-[0.28em] text-accent-blue sm:text-sm">
              Política de calidad
            </p>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({
                  variant: "on-dark-outline",
                  size: "sm",
                  className: "mt-6 gap-2",
                })}
              >
                <span className="material-symbols-outlined text-xl text-accent-blue" aria-hidden>
                  picture_as_pdf
                </span>
                Descargar PDF
              </a>
            ) : (
              <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-accent-blue" aria-hidden>
                <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
              </span>
            )}
          </div>

          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              En la actualidad, nuestras capacidades nos brindan la posibilidad de fabricar unidades de las más
              variadas características, dando cuenta de una gran flexibilidad en el diseño y en las alternativas de
              carrozado y equipamiento.
            </p>
            <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-7">
              {METRICS.map((metric, index) => (
                <QualityMetric
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  index={index}
                  inView={inView}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
