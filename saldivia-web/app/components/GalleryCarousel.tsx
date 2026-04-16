"use client";

import { useCallback, useState } from "react";

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

const n = IMAGES.length;

export default function GalleryCarousel() {
  const [index, setIndex] = useState(0);

  const go = useCallback((i: number) => {
    setIndex(((i % n) + n) % n);
  }, []);

  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  return (
    <section className="py-16 bg-industrial-charcoal">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header centrado */}
        <div className="flex flex-col items-center mb-10">
          <h3 className="font-headline text-xl font-light text-metallic-silver tracking-[0.2em] uppercase">
            Galería de Innovación
          </h3>
          <div className="w-12 h-[1px] bg-accent-blue mt-4" />
        </div>

        {/* Imagen con flechas */}
        <div className="relative w-full overflow-hidden rounded-sm">
          {/* Mobile: 1 imagen — Desktop: 2 imágenes */}
          <div className="flex gap-3">
            <div className="w-full md:w-1/2 aspect-[16/9] overflow-hidden rounded-sm shrink-0">
              <img
                key={IMAGES[index].src}
                src={IMAGES[index].src}
                alt={IMAGES[index].alt}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
            </div>
            <div className="hidden md:block md:w-1/2 aspect-[16/9] overflow-hidden rounded-sm shrink-0">
              <img
                key={IMAGES[(index + 1) % n].src}
                src={IMAGES[(index + 1) % n].src}
                alt={IMAGES[(index + 1) % n].alt}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/20 bg-white/90 text-primary shadow-md backdrop-blur-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue md:left-5"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/20 bg-white/90 text-primary shadow-md backdrop-blur-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue md:right-5"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </div>

        {/* Puntos indicadores */}
        <div
          className="mt-4 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Seleccionar imagen de la galería"
        >
          {IMAGES.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Imagen ${i + 1} de ${n}`}
                onClick={() => setIndex(i)}
                className={`h-1 w-8 shrink-0 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 ${
                  active
                    ? "bg-accent-blue scale-y-150"
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
