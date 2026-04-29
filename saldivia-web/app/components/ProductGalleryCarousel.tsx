"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND_DURATION, BRAND_EASE } from "./motion/brand-ease";
import { Button } from "./ui/Button";

type Props = {
  images: readonly string[] | string[];
  altPrefix?: string;
};

const GALLERY_BG = "#EAEAEA";
const AUTO_PLAY_MS = 4000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function ProductGalleryCarousel({
  images,
  altPrefix = "Galería",
}: Props) {
  const reduce = useReducedMotion();
  const list = [...images];
  const n = list.length;
  const [[index, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  indexRef.current = index;

  const go = useCallback(
    (i: number, dir: number) => {
      if (n === 0) return;
      setPage([((i % n) + n) % n, dir]);
    },
    [n],
  );

  const prev = () => go(index - 1, -1);
  const next = () => go(index + 1, 1);

  // Auto-play: interval does NOT restart on every index change thanks to indexRef
  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(() => go(indexRef.current + 1, 1), AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [paused, go, n]);

  if (n === 0) return null;

  return (
    <section
      className="py-8 sm:py-12"
      style={{ backgroundColor: GALLERY_BG }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -5% 0px" }}
          transition={{ duration: BRAND_DURATION.slow, ease: BRAND_EASE }}
        >
          {/* Image stage */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-sm sm:aspect-video md:aspect-[21/9] md:rounded-md"
            style={{ backgroundColor: GALLERY_BG }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={list[index]}
                custom={direction}
                variants={reduce ? {} : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                  opacity: { duration: 0.25 },
                }}
                alt={`${altPrefix} — imagen ${index + 1} de ${n}`}
                className="absolute inset-0 h-full w-full object-cover"
                src={list[index]}
                draggable={false}
              />
            </AnimatePresence>

            {/* Auto-play progress bar */}
            {!paused && n > 1 && (
              <motion.div
                key={`bar-${index}`}
                className="absolute bottom-0 left-0 h-[3px] bg-saldivia-blue/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTO_PLAY_MS / 1000, ease: "linear" }}
              />
            )}

            <Button
              type="button"
              onClick={prev}
              variant="icon"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-curve-pill border-primary/20 bg-white/90 text-primary shadow-md backdrop-blur-sm hover:bg-white md:left-5"
              aria-label="Imagen anterior"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </Button>
            <Button
              type="button"
              onClick={next}
              variant="icon"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-curve-pill border-primary/20 bg-white/90 text-primary shadow-md backdrop-blur-sm hover:bg-white md:right-5"
              aria-label="Imagen siguiente"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </Button>
          </div>

          {/* Dot indicators */}
          <div
            className="mt-4 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Seleccionar imagen de la galería"
          >
            {list.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Imagen ${i + 1} de ${n}`}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  className={`h-1 w-8 shrink-0 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-saldivia-blue focus-visible:ring-offset-2 ${
                    active
                      ? "scale-y-150 bg-saldivia-blue"
                      : "bg-saldivia-blue/35 hover:bg-saldivia-blue/55"
                  }`}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
