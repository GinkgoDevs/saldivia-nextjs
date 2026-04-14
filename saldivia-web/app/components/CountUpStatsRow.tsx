"use client";

import { motion, useInView } from "framer-motion";
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
}: {
  end: number;
  suffix: string;
  label: string;
  delayMs: number;
  inView: boolean;
}) {
  const durationMs = end >= 1000 ? 2200 : 1600;
  const value = useCountUp(end, inView, durationMs, delayMs);
  const delayS = delayMs / 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delayS, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-2 font-headline text-5xl font-extrabold tabular-nums text-accent-blue">
        {value.toLocaleString("es-AR")}
        {suffix}
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</div>
    </motion.div>
  );
}

function IsoCell({ inView, delayMs }: { inView: boolean; delayMs: number }) {
  const delayS = delayMs / 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delayS, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-2 font-headline text-5xl font-extrabold text-accent-blue">ISO</div>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Certificación 9001</div>
    </motion.div>
  );
}

export function CountUpStatsRow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section ref={ref} className="bg-primary py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 gap-12 text-center md:grid-cols-4">
          <CountCell end={40} suffix="+" label="Años de Trayectoria" delayMs={0} inView={inView} />
          <CountCell end={5000} suffix="+" label="Unidades Producidas" delayMs={120} inView={inView} />
          <IsoCell inView={inView} delayMs={240} />
          <CountCell end={100} suffix="%" label="Capital Nacional" delayMs={360} inView={inView} />
        </div>
      </div>
    </section>
  );
}
