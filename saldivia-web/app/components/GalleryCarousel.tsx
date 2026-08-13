"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { STATIC_GALLERY_IMAGES } from "@/lib/home-gallery-data";
import type { ResolvedGalleryImage } from "@/types/home-gallery";

const GAP = 24;
/** Clones al inicio/fin: debe ser >= máximo de ítems visibles en cualquier breakpoint */
const CLONE = 4;

function visibleCount(viewportWidth: number) {
  if (viewportWidth >= 1536) return 4;
  if (viewportWidth >= 1024) return 3;
  if (viewportWidth >= 640) return 2;
  return 1;
}

type Props = {
  images?: ResolvedGalleryImage[];
};

export default function GalleryCarousel({ images }: Props) {
  const IMAGES = images ?? STATIC_GALLERY_IMAGES;
  const N = IMAGES.length;
  const extended = useMemo(() => {
    if (N === 0) return [];
    return [...IMAGES.slice(-CLONE), ...IMAGES, ...IMAGES.slice(0, CLONE)];
  }, [IMAGES, N]);
  const INITIAL_POS = CLONE;
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
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    posRef.current = INITIAL_POS;
    setDotIdx(0);
    x.set(-INITIAL_POS * stepRef.current);
  }, [N, INITIAL_POS, x]);

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
  }, [N]);

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
    [normalizePos, x, N],
  );

  const next = useCallback(() => go(posRef.current + 1), [go]);
  const prev = useCallback(() => go(posRef.current - 1), [go]);

  const openLightbox = useCallback((realIdx: number) => setLightboxIdx(realIdx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const lightboxNext = useCallback(
    () => setLightboxIdx((i) => (i === null ? i : (i + 1) % N)),
    [N],
  );
  const lightboxPrev = useCallback(
    () => setLightboxIdx((i) => (i === null ? i : (i - 1 + N) % N)),
    [N],
  );

  useEffect(() => {
    if (paused || lightboxIdx !== null) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next, lightboxIdx]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") lightboxNext();
      else if (e.key === "ArrowLeft") lightboxPrev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIdx, closeLightbox, lightboxNext, lightboxPrev]);

  const slideWidth =
    itemW > 0 ? `${itemW}px` : `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`;

  if (N === 0) return null;

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
        <h2 id="home-gallery-heading" className="ui-section-title">
          Galería de innovación
        </h2>
        <div className="technical-gradient mx-auto mt-5 h-1 w-24" />
      </div>

      {/* Carril a ancho casi completo del viewport */}
      <div className="relative w-full">
        <div className="mx-auto w-full max-w-[min(100%,1920px)] px-3 sm:px-5 md:px-8 lg:px-10 xl:px-12">
          <div className="relative overflow-hidden rounded-lg" ref={viewportRef}>
            <motion.div className="flex" style={{ x, gap: `${GAP}px` }} aria-live="polite">
              {extended.map((img, i) => {
                const realIdx = (((i - CLONE) % N) + N) % N;
                return (
                  <div
                    key={`${img.src}-${i}`}
                    className="aspect-[16/10] shrink-0 overflow-hidden rounded-lg md:aspect-[16/9]"
                    style={{ width: slideWidth }}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(realIdx)}
                      aria-label={`Ampliar imagen: ${img.alt}`}
                      className="group relative block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading={i >= CLONE && i < CLONE + 3 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        draggable={false}
                      />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                        <span className="material-symbols-outlined rounded-full bg-black/55 p-2 text-2xl text-white backdrop-blur-sm">
                          zoom_in
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
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

      {lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              lightboxPrev();
            }}
            aria-label="Imagen anterior"
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue sm:left-5"
          >
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>

          <figure className="mx-4 max-h-[90vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={IMAGES[lightboxIdx].src}
              alt={IMAGES[lightboxIdx].alt}
              className="mx-auto max-h-[82vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              draggable={false}
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {IMAGES[lightboxIdx].alt}
              <span className="ml-2 text-white/40">
                {lightboxIdx + 1} / {N}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              lightboxNext();
            }}
            aria-label="Imagen siguiente"
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue sm:right-5"
          >
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>
        </div>
      )}
    </section>
  );
}
