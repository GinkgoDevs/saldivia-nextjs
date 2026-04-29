"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const SEGMENT_LINKS = [
  { label: "Urbano", href: "/flota#urbano" },
  { label: "Interurbano", href: "/flota#interurbano" },
  { label: "Interprovincial", href: "/flota#interprovincial" },
] as const;

const SLIDES = [
  {
    id: "aries-405",
    bg: "/background.png",
    bgAlt: "Unidad Saldivia Aries en ruta",
    eyebrow: "Ingeniería de clase mundial",
    title: "Nuevo ARIES",
    highlight: "405 DD",
    subtitle:
      "Redefiniendo los estándares del transporte de pasajeros: potencia, seguridad y presencia imponente con el sello industrial Saldivia.",
    primary: { label: "Explorar modelos", href: "/flota" },
    secondary: { label: "Tour industrial", href: "/nosotros" },
    showSegments: false,
  },
  {
    id: "soldadura",
    bg: "/hero-soldadura.png",
    bgAlt: "Proceso de soldadura certificado en planta Saldivia",
    eyebrow: "Fabricación nacional certificada",
    title: "Precisión en",
    highlight: "cada soldadura",
    subtitle:
      "Procesos de manufactura controlados, materiales de primera calidad y estrictos estándares industriales en cada etapa de producción.",
    primary: { label: "Conocer la empresa", href: "/nosotros" },
    secondary: { label: "Solicitar visita", href: "/contacto" },
    showSegments: false,
  },
  {
    id: "buses",
    bg: "/hero-buses.png",
    bgAlt: "Flota completa de buses Saldivia",
    eyebrow: "Flota completa para cada operación",
    title: "De la ciudad",
    highlight: "a la ruta",
    subtitle:
      "Urbano, interurbano e interprovincial: una solución para cada segmento, con el mismo compromiso de ingeniería y durabilidad.",
    primary: { label: "Ver catálogo completo", href: "/flota" },
    secondary: { label: "Consultar presupuesto", href: "/contacto" },
    showSegments: true,
  },
] as const;

const INTERVAL_MS = 6500;
const TRANSITION_MS = 1300;

export default function HomeHero3({ fullHeight = false }: { fullHeight?: boolean }) {
  const [active, setActive] = useState(0);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restart Ken Burns animation every time a slide becomes active
  useEffect(() => {
    const el = bgRefs.current[active];
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight; // force reflow to restart animation
    el.style.animation = "heroKenBurns 11s ease-out forwards";
  }, [active]);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, INTERVAL_MS);
  }, [advance]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleDotClick = (index: number) => {
    setActive(index);
    startTimer();
  };

  return (
    <section
      id="saldivia-home-hero"
      className="relative overflow-hidden bg-primary"
      style={{ height: fullHeight ? "125dvh" : "93.75dvh" }}
      aria-labelledby="home-hero-heading"
    >
      {/* ── Background slides with Ken Burns ─────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 z-0 bg-slate-900"
          style={{
            opacity: i === active ? 1 : 0,
            transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
          }}
        >
          <div
            ref={(el) => { bgRefs.current[i] = el; }}
            className="absolute inset-0"
          >
            <Image
              src={slide.bg}
              alt={slide.bgAlt}
              fill
              priority={i === 0}
              className="object-cover object-center brightness-[0.82]"
              sizes="100vw"
            />
          </div>
        </div>
      ))}

      {/* ── Fixed overlays ────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[1] hero-gradient-home" />
      <div className="pointer-events-none absolute inset-0 z-[1] hero-overlay-home" />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[1] h-[52%] bg-gradient-to-t from-primary/70 via-primary/55 to-transparent lg:hidden"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[min(560px,52vw)] bg-primary/75 lg:block"
        style={{ clipPath: "polygon(26% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />

      {/* ── Content area ──────────────────────────────── */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-24 pt-28 md:justify-center md:pb-20 md:pt-32 lg:pb-24 lg:pt-28">
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="pointer-events-none absolute left-2 top-0 hidden md:block">
            <div className="h-10 w-10 border-l-2 border-t-2 border-accent-blue/80" />
          </div>

          {/* CSS grid stack — all slides share the same cell */}
          <div className="grid">
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className="col-start-1 row-start-1 max-w-3xl lg:max-w-2xl xl:max-w-3xl"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity ${TRANSITION_MS}ms ease-in-out, transform ${TRANSITION_MS}ms ease-in-out`,
                  pointerEvents: i === active ? "auto" : "none",
                }}
                aria-hidden={i !== active}
              >
                <p className="mb-4 inline-flex items-center gap-3 font-headline text-xs font-black uppercase tracking-[0.3em] text-accent-blue">
                  <span className="h-px w-10 bg-accent-blue" aria-hidden />
                  {slide.eyebrow}
                </p>

                <h1
                  id={i === 0 ? "home-hero-heading" : undefined}
                  className="font-headline text-5xl font-black uppercase leading-[0.92] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[4.25rem] xl:text-8xl"
                >
                  {slide.title}
                  <br />
                  <span className="text-accent-blue">{slide.highlight}</span>
                </h1>

                <p className="mt-6 max-w-xl font-headline text-base font-medium leading-relaxed text-slate-200 md:mt-8 md:max-w-2xl md:text-lg md:leading-relaxed lg:text-xl lg:font-light">
                  {slide.subtitle}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 md:mt-10">
                  <Link
                    href={slide.primary.href}
                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-sm bg-accent-blue px-8 py-4 font-headline text-sm font-black uppercase tracking-widest text-white shadow-xl transition-colors duration-200 hover:bg-accent-blue-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:px-10 md:py-5"
                  >
                    {slide.primary.label}
                    <span className="material-symbols-outlined ml-2 text-xl" aria-hidden>
                      arrow_forward
                    </span>
                  </Link>
                  <Link
                    href={slide.secondary.href}
                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-sm border border-white/25 bg-white/5 px-8 py-4 font-headline text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:px-10 md:py-5"
                  >
                    {slide.secondary.label}
                  </Link>
                </div>

                {slide.showSegments && (
                  <nav aria-label="Accesos rápidos a segmentos" className="mt-8 md:mt-10">
                    <p className="mb-3 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      Segmentos
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {SEGMENT_LINKS.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="inline-flex min-h-[44px] cursor-pointer items-center rounded-sm border border-white/20 bg-primary/30 px-4 py-2.5 font-headline text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-200 hover:border-secondary-container/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation dots ───────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => handleDotClick(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-[3px] rounded-full transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
              i === active
                ? "w-9 bg-accent-blue"
                : "w-[9px] bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
