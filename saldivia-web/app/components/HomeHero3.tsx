"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

import { getStaticHeroSlides } from "@/lib/supabase/home-hero";
import { imageFocalStyle } from "@/lib/image-focal";
import type { ResolvedHeroSlide } from "@/types/home-hero";

const INTERVAL_MS = 11_000;
const TRANSITION_MS = 1800;

export default function HomeHero3({
  fullHeight = false,
  slides,
}: {
  fullHeight?: boolean;
  slides?: ResolvedHeroSlide[];
}) {
  const SLIDES = slides && slides.length > 0 ? slides : getStaticHeroSlides();
  const [active, setActive] = useState(0);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restart Ken Burns animation every time a slide becomes active
  useEffect(() => {
    const el = bgRefs.current[active];
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight; // force reflow to restart animation
    el.style.animation = "heroKenBurns 12s ease-out forwards";
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
      className="relative overflow-hidden bg-slate-950"
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
              style={imageFocalStyle(slide.bgFocalX, slide.bgFocalY, slide.bgZoom)}
              sizes="100vw"
            />
          </div>
        </div>
      ))}

      {/* ── Content area ──────────────────────────────── */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-24 pt-28 md:justify-center md:pb-20 md:pt-32 lg:pb-24 lg:pt-28">
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="pointer-events-none absolute left-2 top-0 hidden md:block">
            <div className="h-10 w-10 border-l-2 border-t-2 border-white/35" />
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
                <p className="mb-4 inline-flex items-center gap-3 font-headline text-sm font-black uppercase tracking-[0.28em] text-white/65 md:text-base">
                  <span className="h-px w-10 bg-white/45" aria-hidden />
                  {slide.eyebrow}
                </p>

                <h1
                  id={i === 0 ? "home-hero-heading" : undefined}
                  className="font-headline text-5xl font-black uppercase leading-[0.92] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[4.25rem] xl:text-8xl"
                >
                  {slide.title}
                  {slide.highlight ? (
                    <>
                      {slide.title ? <br /> : null}
                      <span className="text-white/90">{slide.highlight}</span>
                    </>
                  ) : null}
                </h1>

                {slide.subtitle ? (
                  <p className="mt-6 max-w-xl font-headline text-base font-medium leading-relaxed text-slate-200 md:mt-8 md:max-w-2xl md:text-lg md:leading-relaxed lg:text-xl lg:font-light">
                    {slide.subtitle}
                  </p>
                ) : null}

                {(slide.primary || slide.secondary) && (
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 md:mt-10">
                    {slide.primary && (
                      <Link
                        href={slide.primary.href}
                        className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-sm bg-white px-8 py-4 font-headline text-sm font-black uppercase tracking-widest text-slate-900 shadow-xl transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:px-10 md:py-5"
                      >
                        {slide.primary.label}
                        <span className="material-symbols-outlined ml-2 text-xl" aria-hidden>
                          arrow_forward
                        </span>
                      </Link>
                    )}
                    {slide.secondary && (
                      <Link
                        href={slide.secondary.href}
                        className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-sm border border-white/25 bg-white/5 px-8 py-4 font-headline text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:px-10 md:py-5"
                      >
                        {slide.secondary.label}
                      </Link>
                    )}
                  </div>
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
            className={`h-[3px] rounded-full transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              i === active
                ? "w-9 bg-white"
                : "w-[9px] bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
