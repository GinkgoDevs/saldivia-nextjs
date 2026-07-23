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
import { getHomeHeroSlides } from "@/lib/supabase/home-hero";
import { createClient } from "@/lib/supabase/server";

/** Ocultar temporalmente el mapa del home (cambiar a `true` para volver a mostrarlo). */
const SHOW_HOME_MAP = false;

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Carrocerías para transporte de pasajeros. Catálogo ARIES y soluciones urbano, interurbano e interprovincial.",
  openGraph: {
    title: "Saldivia — Excelencia en Carrocerías",
    description:
      "Más de 40 años de ingeniería industrial: buses, interurbano y larga distancia, con servicio de postventa en planta.",
  },
};

export default async function HomePage() {
  let heroSlides;
  try {
    const supabase = await createClient();
    heroSlides = await getHomeHeroSlides(supabase);
  } catch (err) {
    console.error("[HomePage] hero slides fallback:", err);
  }

  return (
    <div className="font-body bg-surface text-on-surface antialiased">

      <main>
        <HomeHero3 fullHeight slides={heroSlides} />

        {/* Stats Row */}
        <CountUpStatsRow />

        {SHOW_HOME_MAP ? <ArgentinaProjectsMap /> : null}

        <TechnicalShowcase />

        <div className="relative overflow-hidden bg-surface-container-low">
          <TrajectoryRail side="right" height="60%" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(32,149,212,0.08),transparent_60%)]" />
          <GalleryCarousel />
          {/* Final CTA */}
          <MotionReveal>
            <section className="relative py-20">
              <div className="container relative mx-auto px-4 md:px-6 text-center">
                <p className="ui-section-eyebrow mb-3">
                  Atención comercial personalizada
                </p>
                <h2 className="ui-section-title mb-8">
                  ¿Está listo para renovar su flota?
                </h2>
                <p className="ui-section-intro mx-auto mb-8 max-w-2xl">
                  Lo acompañamos desde la configuración inicial hasta la entrega de la unidad, con tiempos de fabricación líderes y soporte postventa dedicado.
                </p>
                <Link
                  className={buttonClass({
                    variant: "primary",
                    size: "lg",
                    className: "inline-flex rounded-curve-pill px-10 shadow-elev-2",
                  })}
                  href="/contacto"
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
