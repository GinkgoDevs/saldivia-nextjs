"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const IMAGES = [
  { src: "/saldivia/buses.jpg", alt: "Flota de buses Saldivia" },
  { src: "/saldivia/buses_1.jpg", alt: "Unidades Saldivia en ruta" },
  { src: "/saldivia/carroceria.jpg", alt: "Carrocería y producción Saldivia" },
  { src: "/saldivia/soldadura.jpg", alt: "Soldadura y fabricación en planta" },
  { src: "/saldivia/taller_1.jpg", alt: "Taller Saldivia" },
  { src: "/saldivia/taller_2.jpg", alt: "Línea de mantenimiento y ensamble" },
  { src: "/saldivia/taller_3.jpg", alt: "Instalaciones de taller" },
  { src: "/saldivia/taller_4.jpg", alt: "Procesos en planta industrial" },
  { src: "/saldivia/img-20210910-wa0010.jpg", alt: "Instalaciones Saldivia" },
  { src: "/saldivia/3.jpg", alt: "Producción e ingeniería Saldivia" },
] as const;

const GAP = 16;
const N = IMAGES.length;
/** Clones al inicio/fin: debe ser >= máximo de ítems visibles en cualquier breakpoint */
const CLONE = 4;

function visibleCount(viewportWidth: number) {
  if (viewportWidth >= 1536) return 4;
  if (viewportWidth >= 1024) return 3;
  if (viewportWidth >= 640) return 2;
  return 1;
}

function buildExtended() {
  return [...IMAGES.slice(-CLONE), ...IMAGES, ...IMAGES.slice(0, CLONE)];
}

const extended = buildExtended();
const INITIAL_POS = CLONE;

export default function GalleryCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const posRef = useRef(INITIAL_POS);
  const stepRef = useRef(0);
  const itemWRef = useRef(0);
  const busy = useRef(false);
  const [dotIdx, setDotIdx] = useState(0);
  const [itemW, setItemW] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(3);

  const recalcLayout = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const vw = window.innerWidth;
    const vis = visibleCount(vw);
    setVisible(vis);
    const w = el.offsetWidth;
    const iw = (w - GAP * (vis - 1)) / vis;
    const step = iw + GAP;
    itemWRef.current = iw;
    stepRef.current = step;
    x.set(-posRef.current * step);
    setItemW(iw);
  }, [x]);

  useEffect(() => {
    recalcLayout();
    const ro = new ResizeObserver(recalcLayout);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", recalcLayout);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalcLayout);
    };
  }, [recalcLayout]);

  const normalizePos = useCallback((pos: number) => {
    let p = pos;
    if (p >= N + CLONE) {
      p = CLONE + (p - N - CLONE);
    } else if (p < CLONE) {
      p = N + p;
    }
    return p;
  }, []);

  const go = useCallback(
    (next: number) => {
      if (busy.current || stepRef.current === 0) return;
      busy.current = true;
      const target = next;
      posRef.current = target;
      animate(x, -target * stepRef.current, {
        type: "tween",
        duration: 0.55,
        ease: [0.25, 0.1, 0.25, 1],
        onComplete: () => {
          const p = normalizePos(target);
          if (p !== target) {
            x.set(-p * stepRef.current);
          }
          posRef.current = p;
          setDotIdx(((p - CLONE) % N + N) % N);
          busy.current = false;
        },
      });
      setDotIdx((((target - CLONE) % N) + N) % N);
    },
    [normalizePos, x],
  );

  const next = useCallback(() => go(posRef.current + 1), [go]);
  const prev = useCallback(() => go(posRef.current - 1), [go]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next]);

  const slideWidth =
    itemW > 0 ? `${itemW}px` : `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  return (
    <section
      aria-labelledby="home-gallery-heading"
      className="relative overflow-hidden py-16 md:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="container mx-auto mb-12 px-4 text-center md:mb-14 md:px-6">
        <h2 id="home-gallery-heading" className="ui-section-title text-primary dark:!text-white">
          Galería de innovación
        </h2>
        <div className="technical-gradient mx-auto mt-5 h-1 w-24" />
      </div>

      {/* Carril a ancho casi completo del viewport */}
      <div className="relative w-full">
        <div className="mx-auto w-full max-w-[min(100%,1920px)] px-3 sm:px-5 md:px-8 lg:px-10 xl:px-12">
          <div className="relative overflow-hidden rounded-md md:rounded-lg" ref={viewportRef}>
            <motion.div className="flex" style={{ x, gap: `${GAP}px` }} aria-live="polite">
              {extended.map((img, i) => (
                <div
                  key={`${img.src}-${i}`}
                  className="aspect-[16/10] shrink-0 overflow-hidden rounded-md md:aspect-[16/9] md:rounded-lg"
                  style={{ width: slideWidth }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading={i >= CLONE && i < CLONE + 3 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </motion.div>

            <button
              type="button"
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue sm:left-4 md:h-12 md:w-12"
            >
              <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_left</span>
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue sm:right-4 md:h-12 md:w-12"
            >
              <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_right</span>
            </button>
          </div>

          <div
            className="mt-5 flex flex-wrap justify-center gap-2"
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
                  aria-label={`Imagen ${i + 1} de ${N}`}
                  onClick={() => go(CLONE + i)}
                  className={`h-1.5 w-9 shrink-0 cursor-pointer rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 sm:w-10 ${
                    active ? "scale-y-150 bg-accent-blue" : "bg-accent-blue/35 hover:bg-accent-blue/55"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
