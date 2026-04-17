import ArgentinaProjectsMap from "./components/ArgentinaProjectsMap";
import { CountUpStatsRow } from "./components/CountUpStatsRow";
import HomeHero from "./components/HomeHero";
import Link from "next/link";
import { Button, buttonClass } from "./components/ui/Button";
import { Input } from "./components/ui/Input";

const saldiviaGalleryImages = [
  { src: "/saldivia/buses.jpg", alt: "Flota de buses Saldivia" },
  { src: "/saldivia/buses_1.jpg", alt: "Unidades Saldivia en ruta" },
  { src: "/saldivia/carroceria.jpg", alt: "Carrocería y producción Saldivia" },
  { src: "/saldivia/soldadura.jpg", alt: "Soldadura y fabricación en planta" },
  { src: "/saldivia/taller_1.jpg", alt: "Taller Saldivia" },
  { src: "/saldivia/taller_2.jpg", alt: "Línea de mantenimiento y ensamble" },
  { src: "/saldivia/taller_3.jpg", alt: "Instalaciones de taller" },
  { src: "/saldivia/taller_4.jpg", alt: "Procesos en planta industrial" },
  { src: "/saldivia/img-20210910-wa0010.jpg", alt: "Instalaciones Saldivia" },
  { src: "/saldivia/3.jpg", alt: "Producción e ingeniería Saldivia" },
] as const;

export default function HomePage() {
  return (
    <div className="font-body bg-surface text-on-surface antialiased">

      <main>
        <HomeHero />

        {/* Stats Row */}
        <CountUpStatsRow />

        <ArgentinaProjectsMap />

        {/* Technical Showcase */}
        <section className="relative bg-industrial-charcoal overflow-hidden text-white min-h-screen flex flex-col">
          <div className="absolute top-0 left-0 w-full p-8 md:p-12 z-20 flex justify-between items-end bg-gradient-to-b from-industrial-charcoal to-transparent">
            <div>
              <h2 className="text-accent-blue font-bold text-xs tracking-[0.4em] uppercase mb-2">Ingeniería en Movimiento</h2>
              <h3 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">SHOWCASE TÉCNICO</h3>
            </div>
            <div className="flex gap-4">
              <Button
                variant="icon"
                className="h-14 w-14 rounded-curve-pill border-white/20 text-white hover:bg-white/10"
                aria-label="Anterior"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              <Button
                variant="icon"
                className="h-14 w-14 rounded-curve-pill bg-accent-blue text-white shadow-elev-2 hover:bg-accent-blue-alt"
                aria-label="Siguiente"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          </div>
          <div className="flex-grow flex flex-col lg:flex-row relative">
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
              <div className="lg:w-2/3 relative h-[50vh] lg:h-full">
                <img
                  alt="Aries 405 DD Detailed"
                  className="w-full h-full object-cover"
                  src="/ARIES-305/345_1.png"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-industrial-charcoal/70 via-transparent to-transparent hidden lg:block"></div>
              </div>
              <div className="lg:w-1/3 glass-panel p-8 md:p-12 lg:p-16 flex flex-col justify-center border-l border-white/5">
                <div className="mb-10">
                  <span className="bg-white/10 text-metallic-silver px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase mb-4 inline-block border border-white/10">LONG DISTANCE SERIES</span>
                  <h4 className="font-headline text-5xl font-bold mb-2">ARIES 405 DD</h4>
                  <p className="text-slate-400 text-lg leading-snug">Buque insignia de dos pisos diseñado para máxima rentabilidad y confort premium.</p>
                </div>
                <div className="space-y-4 mb-12">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Configuración</span>
                    <span className="text-metallic-silver font-semibold text-sm">Doble Piso (6x2 / 8x2)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Altura Total</span>
                    <span className="text-metallic-silver font-semibold text-sm">4.05 Metros</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-12">
                  <div className="bg-industrial-steel/50 p-5 rounded-lg border border-white/5">
                    <div className="text-accent-blue text-3xl font-bold mb-1">98%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Aislamiento Acústico</div>
                  </div>
                  <div className="bg-industrial-steel/50 p-5 rounded-lg border border-white/5">
                    <div className="text-accent-blue text-3xl font-bold mb-1">ABS+EBS</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Frenado</div>
                  </div>
                </div>
                <Link
                  className={buttonClass({
                    variant: "outline",
                    size: "lg",
                    className:
                      "group rounded-curve-pill border-white bg-white text-industrial-charcoal hover:border-accent-blue hover:bg-accent-blue hover:text-white dark:text-white",
                  })}
                  href="/contacto"
                >
                  Descargar Ficha Técnica
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">download</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Segmentación: tres distancias → anclas del catálogo /flota */}
        <section className="bg-surface py-20 md:py-24" aria-labelledby="home-segmentacion-heading">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-14 text-center md:mb-16">
              <p className="ui-section-eyebrow">
                Segmentación especializada
              </p>
              <h2
                id="home-segmentacion-heading"
                className="ui-section-title"
              >
                Soluciones para cada distancia
              </h2>
              <div className="technical-gradient mx-auto mt-5 h-1 w-24" />
              <p className="ui-section-intro mx-auto">
                Urbano, media distancia y larga distancia: mismos estándares de ingeniería, distintas plataformas según su operación.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {[
                {
                  href: "/flota#urbano",
                  title: "Urbano",
                  copy: "Alto volumen, maniobrabilidad y eficiencia para el transporte citadino.",
                  icon: "location_city" as const,
                  img: "/saldivia/buses_1.jpg",
                  imgAlt: "Colectivo urbano Saldivia",
                },
                {
                  href: "/flota#interurbano",
                  title: "Interurbano",
                  copy: "Confort y rendimiento para trayectos regionales y corredores semirrápidos.",
                  icon: "route" as const,
                  img: "/saldivia/carroceria.jpg",
                  imgAlt: "Carrocería Saldivia para media distancia",
                },
                {
                  href: "/flota#interprovincial",
                  title: "Interprovincial",
                  copy: "Presencia en ruta y confort ejecutivo para los viajes más exigentes.",
                  icon: "map" as const,
                  img: "/saldivia/buses.jpg",
                  imgAlt: "Bus de larga distancia Saldivia",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="ui-surface-card hub-card group relative flex min-h-[320px] cursor-pointer flex-col justify-end overflow-hidden rounded-curve-md p-8 hover:border-accent-blue/35 hover:shadow-elev-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 md:min-h-[380px] md:p-10"
                >
                  <div className="absolute inset-0 hub-bg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    <img alt={card.imgAlt} className="h-full w-full object-cover" src={card.img} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/20" />
                  <div className="relative z-10 text-white">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-accent-blue">
                      <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                    </div>
                    <h3 className="font-headline text-2xl font-black uppercase tracking-tighter md:text-3xl">
                      {card.title}
                    </h3>
                    <p className="mt-3 font-headline text-sm leading-relaxed text-white/90 md:text-base">
                      {card.copy}
                    </p>
                    <span className="mt-6 inline-flex items-center font-headline text-xs font-bold uppercase tracking-widest text-secondary-container transition-colors duration-200 group-hover:text-white">
                      Ver en catálogo
                      <span className="material-symbols-outlined ml-1 text-lg transition-transform duration-200 group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* After-Sales Box */}
        <section className="bg-[#081b31] py-12 industrial-grid">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto bg-primary border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
              <div className="p-10 lg:w-[45%]">
                <div className="flex items-center gap-4 mb-3">
                  <span className="material-symbols-outlined text-accent-blue text-3xl">manufacturing</span>
                  <h2 className="font-headline text-xl font-bold text-white uppercase">Repuestos y Servicio</h2>
                </div>
                <p className="text-slate-300 text-sm opacity-80">Encuentre el Distribuidor de Asistencia Técnica o Repuestos más cercano.</p>
              </div>
              <div className="p-10 lg:w-[55%] w-full bg-white/5 backdrop-blur-sm">
                <form className="flex flex-col sm:flex-row gap-4">
                  <Input
                    className="flex-grow bg-[#081b31]/70 border-white/10 text-white placeholder-slate-500 rounded-curve-sm"
                    placeholder="Ciudad"
                    type="text"
                    tone="inverse"
                  />
                  <Button
                    className="px-8"
                    size="sm"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-sm">search</span> BUSCAR
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery of Innovation */}
        <section className="py-16 bg-industrial-charcoal">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center mb-10">
              <h3 className="font-headline text-xl font-light text-metallic-silver tracking-[0.2em] uppercase">Gallery of Innovation</h3>
              <div className="w-12 h-[1px] bg-accent-blue mt-4"></div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {saldiviaGalleryImages.map((item) => (
                <img
                  key={item.src}
                  alt={item.alt}
                  className="min-w-[min(72vw,300px)] md:min-w-[280px] lg:min-w-[260px] aspect-[16/7] object-cover rounded-sm desaturated-img hover:grayscale-0 transition-all duration-700 snap-center shrink-0"
                  src={item.src}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-slate-900 py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(32,149,212,0.18),transparent_60%)]" />
          <div className="container relative mx-auto px-4 md:px-6 text-center">
            <p className="mb-3 font-headline text-xs font-bold uppercase tracking-[0.24em] text-secondary-container">
              Atención comercial personalizada
            </p>
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-8">¿Estás listo para renovar tu flota?</h2>
            <p className="mx-auto mb-8 max-w-2xl font-headline text-sm leading-relaxed text-slate-300 md:text-base">
              Te acompañamos desde la configuración inicial hasta la entrega de la unidad, con tiempos de fabricación líderes y soporte postventa dedicado.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                className={buttonClass({
                  variant: "primary",
                  size: "lg",
                  className: "rounded-curve-pill px-10 shadow-elev-2",
                })}
                href="/contacto"
              >
                Contactar Ventas
              </Link>
              <Link
                className={buttonClass({
                  variant: "outline",
                  size: "lg",
                  className: "rounded-curve-pill border-white bg-white text-primary px-10 hover:bg-white/90",
                })}
                href="/contacto"
              >
                Pedir Presupuesto
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
