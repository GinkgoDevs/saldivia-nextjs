"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useCountUp(end: number, enabled: boolean, durationMs: number, delayMs: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(0);
      return;
    }

    let raf = 0;
    let cancelled = false;
    const startWall = performance.now() + delayMs;

    const tick = (now: number) => {
      if (cancelled) return;
      if (now < startWall) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (now - startWall) / durationMs);
      setValue(Math.round(easeOutCubic(t) * end));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [enabled, end, durationMs, delayMs]);

  return value;
}

function CountCell({
  end,
  suffix,
  label,
  delayMs,
  inView,
  reduceMotion,
}: {
  end: number;
  suffix: string;
  label: string;
  delayMs: number;
  inView: boolean;
  reduceMotion: boolean;
}) {
  const durationMs = end >= 1000 ? 2200 : 1600;
  const value = useCountUp(end, inView, durationMs, delayMs);
  const display = value;
  const delayS = delayMs / 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={
        reduceMotion
          ? { duration: 0.2, delay: delayS * 0.25, ease: [0.22, 1, 0.36, 1] }
          : { duration: 0.5, delay: delayS, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="mb-2 font-headline text-5xl font-extrabold tabular-nums text-accent-blue">
        {display.toLocaleString("es-AR")}
        {suffix}
      </div>
      <div className="ui-caption-caps text-on-surface-variant dark:text-on-primary-container">
        {label}
      </div>
    </motion.div>
  );
}

const FOUNDING_YEAR = 1995;

function StaticStatCell({
  value,
  label,
  delayMs,
  inView,
  reduceMotion,
}: {
  value: string;
  label: string;
  delayMs: number;
  inView: boolean;
  reduceMotion: boolean;
}) {
  const delayS = delayMs / 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={
        reduceMotion
          ? { duration: 0.2, delay: delayS * 0.25, ease: [0.22, 1, 0.36, 1] }
          : { duration: 0.5, delay: delayS, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="mb-2 font-headline text-5xl font-extrabold tabular-nums text-accent-blue">{value}</div>
      <div className="ui-caption-caps text-on-surface-variant dark:text-on-primary-container">
        {label}
      </div>
    </motion.div>
  );
}

export function CountUpStatsRow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const trajectoryYears = new Date().getFullYear() - FOUNDING_YEAR;

  return (
    <section
      ref={ref}
      className="bg-surface-container-lowest py-20 text-on-surface dark:bg-primary-container dark:text-on-primary-container"
    >
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-14 text-center md:mb-16">
          <p className="ui-section-eyebrow">
            Indicadores clave
          </p>
          <h2 className="ui-section-title md:text-3xl dark:text-white">
            Trayectoria en números
          </h2>
          <div className="technical-gradient mx-auto mt-4 h-1 w-20 rounded-full" />
        </header>
        <div className="grid grid-cols-2 gap-10 text-center md:grid-cols-4 md:gap-12">
          <CountCell
            end={trajectoryYears}
            suffix="+"
            label="Años de trayectoria"
            delayMs={0}
            inView={inView}
            reduceMotion={!!reduceMotion}
          />
          <CountCell
            end={4000}
            suffix="+"
            label="Unidades producidas"
            delayMs={120}
            inView={inView}
            reduceMotion={!!reduceMotion}
          />
          <CountCell
            end={14500}
            suffix=""
            label="Metros cuadrados cubiertos"
            delayMs={240}
            inView={inView}
            reduceMotion={!!reduceMotion}
          />
          <StaticStatCell
            value="2,6 ha"
            label="Terreno de planta"
            delayMs={360}
            inView={inView}
            reduceMotion={!!reduceMotion}
          />
        </div>
      </div>
    </section>
  );
}
