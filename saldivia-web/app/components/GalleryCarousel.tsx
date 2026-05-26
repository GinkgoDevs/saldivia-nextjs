"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const IMAGES = [
  { src: "/saldivia/buses.jpg",               alt: "Flota de buses Saldivia" },
  { src: "/saldivia/buses_1.jpg",             alt: "Unidades Saldivia en ruta" },
  { src: "/saldivia/carroceria.jpg",          alt: "Carrocería y producción Saldivia" },
  { src: "/saldivia/soldadura.jpg",           alt: "Soldadura y fabricación en planta" },
  { src: "/saldivia/taller_1.jpg",            alt: "Taller Saldivia" },
  { src: "/saldivia/taller_2.jpg",            alt: "Línea de mantenimiento y ensamble" },
  { src: "/saldivia/taller_3.jpg",            alt: "Instalaciones de taller" },
  { src: "/saldivia/taller_4.jpg",            alt: "Procesos en planta industrial" },
  { src: "/saldivia/img-20210910-wa0010.jpg", alt: "Instalaciones Saldivia" },
  { src: "/saldivia/3.jpg",                   alt: "Producción e ingeniería Saldivia" },
];

const GAP = 12; // px between items
const n = IMAGES.length;
const CLONE = 3; // items cloned on each side for infinite loop
const extended = [...IMAGES.slice(-CLONE), ...IMAGES, ...IMAGES.slice(0, CLONE)];
const INITIAL_POS = CLONE; // first real item in extended array

export default function GalleryCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const posRef = useRef(INITIAL_POS);
  const stepRef = useRef(0); // px per item+gap
  const itemWRef = useRef(0);
  const busy = useRef(false);
  const [dotIdx, setDotIdx] = useState(0);
  const [itemW, setItemW] = useState(0);
  const [paused, setPaused] = useState(false);

  const recalcLayout = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const vw = window.innerWidth;
    const visible = vw >= 1024 ? 3 : vw >= 640 ? 2 : 1;
    const w = el.offsetWidth;
    const iw = (w - GAP * (visible - 1)) / visible;
    const step = iw + GAP;
    itemWRef.current = iw;
    stepRef.current = step;
    // Snap to current position without animation
    x.set(-posRef.current * step);
    setItemW(iw);
  }, [x]);

  useEffect(() => {
    recalcLayout();
    const ro = new ResizeObserver(recalcLayout);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [recalcLayout]);

  const go = useCallback(
    (next: number) => {
      if (busy.current || stepRef.current === 0) return;
      busy.current = true;
      animate(x, -next * stepRef.current, {
        type: "tween",
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        onComplete: () => {
          busy.current = false;
          let p = next;
          // Wrap: jumped into clones at the end → snap to real start
          if (next >= n + CLONE) {
            p = CLONE + (next - n - CLONE);
            x.set(-p * stepRef.current);
          }
          // Wrap: jumped into clones at the start → snap to real end
          else if (next < CLONE) {
            p = n + next; // e.g. next=2 → p=12 (last real item)
            x.set(-p * stepRef.current);
          }
          posRef.current = p;
          setDotIdx(((p - CLONE) % n + n) % n);
        },
      });
      posRef.current = next;
      setDotIdx((((next - CLONE) % n) + n) % n);
    },
    [x],
  );

  const next = useCallback(() => go(posRef.current + 1), [go]);
  const prev = useCallback(() => go(posRef.current - 1), [go]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      aria-labelledby="home-gallery-heading"
      className="relative overflow-hidden py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header — mismo patrón visual de secciones del home */}
        <div className="mb-14 text-center md:mb-16">
          <h2
            id="home-gallery-heading"
            className="ui-section-title text-primary dark:!text-white"
          >
            Galería de innovación
          </h2>
          <div className="technical-gradient mx-auto mt-5 h-1 w-24" />
        </div>

        {/* Viewport – overflow hidden, shows exactly N items */}
        <div className="relative overflow-hidden rounded-sm" ref={viewportRef}>
          <motion.div className="flex" style={{ x, gap: `${GAP}px` }}>
            {extended.map((img, i) => (
              <div
                key={i}
                className="aspect-[16/9] shrink-0 overflow-hidden rounded-sm"
                style={{
                  width: itemW > 0 ? `${itemW}px` : `calc((100% - ${GAP * 2}px) / 3)`,
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </motion.div>

          {/* Arrow – prev */}
          <button
            type="button"
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-md backdrop-blur-sm transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>

          {/* Arrow – next */}
          <button
            type="button"
            onClick={next}
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-md backdrop-blur-sm transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </div>

        {/* Dot indicators */}
        <div
          className="mt-4 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Seleccionar imagen de la galería"
        >
          {IMAGES.map((_, i) => {
            const active = i === dotIdx;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Imagen ${i + 1} de ${n}`}
                onClick={() => go(CLONE + i)}
                className={`h-1 w-8 shrink-0 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 ${
                  active
                    ? "scale-y-150 bg-accent-blue"
                    : "bg-accent-blue/35 hover:bg-accent-blue/55"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
