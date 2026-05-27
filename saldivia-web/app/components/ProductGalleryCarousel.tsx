"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BRAND_DURATION, BRAND_EASE } from "./motion/brand-ease";
import { Button } from "./ui/Button";

type Props = {
  images: readonly string[] | string[];
  altPrefix?: string;
  /** Sin section/container propio: para layout de dos columnas en ficha de producto */
  embedded?: boolean;
};

const GALLERY_BG = "#EAEAEA";
const AUTO_PLAY_MS = 5000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function GalleryStage({
  list,
  index,
  direction,
  altPrefix,
  n,
  embedded,
  reduce,
  onPrev,
  onNext,
  onOpenLightbox,
  showControls,
  autoPlayProgress,
  stageClass,
  fillMode,
}: {
  list: string[];
  index: number;
  direction: number;
  altPrefix: string;
  n: number;
  embedded: boolean;
  reduce: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenLightbox: () => void;
  showControls: boolean;
  autoPlayProgress: boolean;
  stageClass: string;
  fillMode: "contain" | "cover";
}) {
  const variants = embedded || reduce ? fadeVariants : slideVariants;
  const transition = embedded || reduce
    ? { duration: 0.35, ease: BRAND_EASE }
    : {
        x: { type: "tween" as const, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.25 },
      };

  return (
    <div
      className={`relative ${stageClass}`}
      style={{ backgroundColor: embedded ? undefined : GALLERY_BG }}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={list[index]}
          custom={direction}
          variants={reduce ? {} : variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="absolute inset-0"
        >
          <Image
            src={list[index]}
            alt={`${altPrefix} — imagen ${index + 1} de ${n}`}
            fill
            className={fillMode === "contain" ? "object-contain p-3" : "object-cover"}
            sizes={embedded ? "(max-width: 1024px) 100vw, 40vw" : "100vw"}
            priority={index === 0}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {n > 1 && (
        <div
          className="pointer-events-none absolute left-3 top-3 z-10 rounded-curve-sm bg-primary/75 px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums text-white backdrop-blur-sm"
          aria-live="polite"
        >
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </div>
      )}

      <button
        type="button"
        onClick={onOpenLightbox}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-curve-sm border border-white/20 bg-primary/75 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saldivia-blue"
        aria-label="Ver imagen ampliada"
      >
        <span className="material-symbols-outlined text-xl text-white">fullscreen</span>
      </button>

      {autoPlayProgress && (
        <motion.div
          key={`bar-${index}`}
          className="absolute bottom-0 left-0 z-10 h-[3px] bg-saldivia-blue/80"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: AUTO_PLAY_MS / 1000, ease: "linear" }}
        />
      )}

      {showControls && (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-primary/75 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saldivia-blue md:left-4"
            aria-label="Imagen anterior"
          >
            <span className="material-symbols-outlined text-2xl text-white">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-primary/75 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saldivia-blue md:right-4"
            aria-label="Imagen siguiente"
          >
            <span className="material-symbols-outlined text-2xl text-white">chevron_right</span>
          </button>
        </>
      )}
    </div>
  );
}

function ThumbnailRail({
  list,
  index,
  onSelect,
  altPrefix,
}: {
  list: string[];
  index: number;
  onSelect: (i: number) => void;
  altPrefix: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = thumbRefs.current[index];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  return (
    <div
      ref={railRef}
      className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Miniaturas de la galería"
    >
      {list.map((src, i) => {
        const active = i === index;
        return (
          <button
            key={`${src}-${i}`}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`${altPrefix} — miniatura ${i + 1}`}
            onClick={() => onSelect(i)}
            className={`relative h-[4.5rem] w-[5.5rem] shrink-0 cursor-pointer snap-center overflow-hidden rounded-curve-sm border-2 bg-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saldivia-blue focus-visible:ring-offset-2 ${
              active
                ? "border-saldivia-blue shadow-elev-1 ring-1 ring-saldivia-blue/30"
                : "border-outline-variant/25 opacity-75 hover:border-saldivia-blue/50 hover:opacity-100"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-contain p-1"
              sizes="88px"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({
  list,
  index,
  direction,
  altPrefix,
  n,
  reduce,
  onClose,
  onPrev,
  onNext,
  onGo,
}: {
  list: string[];
  index: number;
  direction: number;
  altPrefix: string;
  n: number;
  reduce: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGo: (i: number) => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex flex-col bg-primary/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería ampliada — ${altPrefix}`}
      onClick={onClose}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
        <p className="font-headline text-sm font-bold uppercase tracking-wider text-white/80">
          {altPrefix}{" "}
          <span className="font-mono tabular-nums text-secondary-container">
            {index + 1}/{n}
          </span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-curve-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          aria-label="Cerrar galería ampliada"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div
        className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 pb-6 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-curve-md bg-white/5">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={list[index]}
              custom={direction}
              variants={reduce ? {} : fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: BRAND_EASE }}
              className="absolute inset-0"
            >
              <Image
                src={list[index]}
                alt={`${altPrefix} — imagen ${index + 1} de ${n}`}
                fill
                className="object-contain p-4 sm:p-8"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {n > 1 && (
            <>
              <Button
                type="button"
                onClick={onPrev}
                variant="icon"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-curve-pill border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:left-4"
                aria-label="Imagen anterior"
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </Button>
              <Button
                type="button"
                onClick={onNext}
                variant="icon"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-curve-pill border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:right-4"
                aria-label="Imagen siguiente"
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </Button>
            </>
          )}
        </div>

        {n > 1 && (
          <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1">
            {list.map((src, i) => (
              <button
                key={`lb-${src}-${i}`}
                type="button"
                onClick={() => onGo(i)}
                className={`relative h-14 w-[4.5rem] shrink-0 cursor-pointer overflow-hidden rounded border-2 transition-all ${
                  i === index ? "border-secondary-container opacity-100" : "border-white/20 opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={src} alt="" fill className="object-contain p-0.5" sizes="72px" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default function ProductGalleryCarousel({
  images,
  altPrefix = "Galería",
  embedded = false,
}: Props) {
  const reduce = useReducedMotion();
  const list = [...images];
  const n = list.length;
  const [[index, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const indexRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  indexRef.current = index;

  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (i: number, dir: number) => {
      if (n === 0) return;
      setPage([((i % n) + n) % n, dir]);
    },
    [n],
  );

  const prev = useCallback(() => go(index - 1, -1), [go, index]);
  const next = useCallback(() => go(index + 1, 1), [go, index]);

  const autoPlayEnabled = !embedded && !lightboxOpen && n > 1;

  useEffect(() => {
    if (!autoPlayEnabled || paused) return;
    const id = setInterval(() => go(indexRef.current + 1, 1), AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [autoPlayEnabled, paused, go]);

  useEffect(() => {
    if (n <= 1) return;
    const preload = (i: number) => {
      const img = new window.Image();
      img.src = list[i];
    };
    preload((index + 1) % n);
    preload((index - 1 + n) % n);
  }, [index, list, n]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (lightboxOpen) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prev, next]);

  if (n === 0) return null;

  const stageClass = embedded
    ? "aspect-[4/3] w-full overflow-hidden rounded-curve-md border border-outline-variant/25 bg-white shadow-elev-1 sm:aspect-[3/4] lg:aspect-[4/5]"
    : "aspect-[4/3] w-full overflow-hidden rounded-sm sm:aspect-video md:aspect-[21/9] md:rounded-md";

  const fillMode = embedded ? "contain" : "cover";
  const showControls = n > 1;
  const autoPlayProgress = autoPlayEnabled && !paused;

  const carousel = (
    <motion.div
      ref={rootRef}
      tabIndex={0}
      className="relative outline-none"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -5% 0px" }}
      transition={{ duration: BRAND_DURATION.slow, ease: BRAND_EASE }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <GalleryStage
        list={list}
        index={index}
        direction={direction}
        altPrefix={altPrefix}
        n={n}
        embedded={embedded}
        reduce={!!reduce}
        onPrev={prev}
        onNext={next}
        onOpenLightbox={() => setLightboxOpen(true)}
        showControls={showControls}
        autoPlayProgress={autoPlayProgress}
        stageClass={stageClass}
        fillMode={fillMode}
      />

      {showControls && (
        <ThumbnailRail
          list={list}
          index={index}
          altPrefix={altPrefix}
          onSelect={(i) => go(i, i > index ? 1 : -1)}
        />
      )}

      {!embedded && showControls && (
        <div className="mt-4 flex justify-center gap-2" role="presentation" aria-hidden>
          {list.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-8 shrink-0 rounded-full transition-all ${
                i === index ? "bg-saldivia-blue" : "bg-saldivia-blue/30"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <>
      {embedded ? <div className="h-full">{carousel}</div> : (
        <section className="py-8 sm:py-12" style={{ backgroundColor: GALLERY_BG }}>
          <div className="container mx-auto px-4 sm:px-6 md:px-8">{carousel}</div>
        </section>
      )}

      {mounted && lightboxOpen && (
        <Lightbox
          list={list}
          index={index}
          direction={direction}
          altPrefix={altPrefix}
          n={n}
          reduce={!!reduce}
          onClose={() => setLightboxOpen(false)}
          onPrev={prev}
          onNext={next}
          onGo={(i) => go(i, i > index ? 1 : -1)}
        />
      )}
    </>
  );
}
