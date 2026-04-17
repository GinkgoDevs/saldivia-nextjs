"use client";

import { useCallback, useState } from "react";
import { Button } from "./ui/Button";

type Props = {
  images: readonly string[] | string[];
  altPrefix?: string;
};

/** Fondo alineado al gris de estudio de las fotos de unidades. */
const GALLERY_BG = "#EAEAEA";

export default function ProductGalleryCarousel({
  images,
  altPrefix = "Galería",
}: Props) {
  const list = [...images];
  const n = list.length;
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (i: number) => {
      if (n === 0) return;
      setIndex(((i % n) + n) % n);
    },
    [n]
  );

  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  if (n === 0) return null;

  return (
    <section className="py-12" style={{ backgroundColor: GALLERY_BG }}>
      <div className="container mx-auto px-8">
        <div className="relative">
          <div
            className="relative aspect-[21/9] w-full overflow-hidden rounded-sm md:rounded-md"
            style={{ backgroundColor: GALLERY_BG }}
          >
            <img
              alt={`${altPrefix} — imagen ${index + 1} de ${n}`}
              className="h-full w-full object-cover"
              src={list[index]}
              key={list[index]}
            />

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
                  onClick={() => setIndex(i)}
                  className={`h-1 w-8 shrink-0 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-saldivia-blue focus-visible:ring-offset-2 ${
                    active
                      ? "bg-saldivia-blue scale-y-150"
                      : "bg-saldivia-blue/35 hover:bg-saldivia-blue/55"
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
