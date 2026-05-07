import Image from "next/image";
import { TecnologiaPilaresGrid } from "../components/tecnologia/TecnologiaPilaresGrid";
import { FadeUp, HeroStagger, TrajectoryRail } from "../components/motion";

export default function TecnologiaPage() {
  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <main>
        <section className="relative flex min-h-[min(100svh,520px)] items-center overflow-hidden pt-20 pb-12 sm:min-h-[420px] sm:pt-16 sm:pb-0 md:min-h-[480px]">
          <Image
            src="/hero-bus.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-black/60" />
          <div className="pointer-events-none absolute inset-0 industrial-grid-light opacity-[0.08]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8">
            <HeroStagger>
              <span className="mb-0 block text-xs font-bold uppercase tracking-[0.3em] text-secondary-container">
                Línea tecnológica
              </span>
              <h1 className="max-w-4xl text-3xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-6xl lg:text-7xl">
                Precisión
                <br />
                <span className="text-secondary-container">en cada sistema</span>
              </h1>
              <p className="mt-0 max-w-2xl text-sm font-medium leading-relaxed text-on-primary-container sm:text-base md:text-lg">
                Pilares de diseño, manufactura y validación que definen cada unidad Saldivia.
              </p>
            </HeroStagger>
          </div>
        </section>

        <FadeUp>
          <section className="relative border-t border-outline-variant/30 bg-surface-container-low py-14 sm:py-20 md:py-24">
            <TrajectoryRail side="right" height="50%" />
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
              <header className="mb-10 sm:mb-12 md:mb-16">
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-secondary">
                  Esqueleto de secciones
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl md:text-4xl">
                  Tres ejes de la plataforma
                </h2>
                <div className="technical-gradient mt-4 h-1 w-20" />
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:mt-6 md:text-base">
                  Las tarjetas siguientes reservan espacio visual y jerarquía para cuando el equipo de ingeniería
                  cargue narrativas, diagramas y especificaciones.
                </p>
              </header>
              <TecnologiaPilaresGrid />
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.06} size="sm">
          <section className="bg-primary py-12 text-on-primary sm:py-16 md:py-20">
            <div className="mx-auto flex max-w-screen-2xl flex-col items-stretch gap-5 px-4 sm:px-6 sm:items-start md:flex-row md:items-center md:justify-between md:gap-6 md:px-8">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white sm:text-2xl md:text-3xl">
                  Próximo: biblioteca técnica
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-primary-container sm:mt-3">
                  PDFs, esquemas y datos de homologación se enlazarán desde este bloque tipo CTA.
                </p>
              </div>
              <span className="inline-flex w-full cursor-default items-center justify-center gap-2 border border-white/25 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white/80 sm:w-auto sm:justify-start sm:px-5 sm:text-xs">
                <span className="material-symbols-outlined text-lg">lock</span>
                Acceso restringido (mock)
              </span>
            </div>
          </section>
        </FadeUp>
      </main>
    </div>
  );
}
