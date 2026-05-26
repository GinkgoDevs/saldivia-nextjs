import type { Metadata } from "next";
import ArgentinaProjectsMap from "./components/ArgentinaProjectsMap";
import { CountUpStatsRow } from "./components/CountUpStatsRow";
import HomeHero3 from "./components/HomeHero3";
import GalleryCarousel from "./components/GalleryCarousel";
import { MotionReveal } from "./components/home/MotionReveal";
import { TechnicalShowcase } from "./components/home/TechnicalShowcase";
import { TrajectoryRail } from "./components/motion";
import Link from "next/link";
import { buttonClass } from "./components/ui/Button";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Carrocerías para transporte de pasajeros. Proyectos por provincia, catálogo ARIES y soluciones urbano, interurbano e interprovincial.",
  openGraph: {
    title: "Saldivia — Excelencia en Carrocerías",
    description:
      "Más de 40 años de ingeniería industrial: buses, interurbano y larga distancia, con postventa en todo el país.",
  },
};

export default function HomePage() {
  return (
    <div className="font-body bg-surface text-on-surface antialiased">

      <main>
        <HomeHero3 fullHeight />

        {/* Stats Row */}
        <CountUpStatsRow />

        <ArgentinaProjectsMap />

        <TechnicalShowcase />

        <div className="relative overflow-hidden bg-surface-container-low dark:bg-slate-900">
          <TrajectoryRail side="right" height="60%" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(32,149,212,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(32,149,212,0.18),transparent_60%)]" />
          <GalleryCarousel />
          {/* Final CTA */}
          <MotionReveal>
            <section className="relative py-20">
              <div className="container relative mx-auto px-4 md:px-6 text-center">
                <p className="mb-3 font-headline text-xs font-bold uppercase tracking-[0.24em] text-secondary dark:text-secondary-container">
                  Atención comercial personalizada
                </p>
                <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary dark:text-white mb-8">
                  ¿Estás listo para renovar tu flota?
                </h2>
                <p className="mx-auto mb-8 max-w-2xl font-headline text-sm leading-relaxed text-on-surface-variant dark:text-slate-300 md:text-base">
                  Te acompañamos desde la configuración inicial hasta la entrega de la unidad, con tiempos de fabricación líderes y soporte postventa dedicado.
                </p>
                <Link
                  className={buttonClass({
                    variant: "primary",
                    size: "lg",
                    className: "inline-flex rounded-curve-pill px-10 shadow-elev-2",
                  })}
                  href="/trabaja-con-nosotros"
                >
                  Contactar ventas
                </Link>
              </div>
            </section>
          </MotionReveal>
        </div>
      </main>

    </div>
  );
}
