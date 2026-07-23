import { CountUpStatsRow } from "../components/CountUpStatsRow";
import HomeHero2 from "../components/HomeHero2";
import { TechnicalShowcase } from "../components/home/TechnicalShowcase";

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

export default function Home2Page() {
  return (
    <div className="font-body bg-surface text-on-surface antialiased">
      <main>
        <HomeHero2 />

        <CountUpStatsRow />

        {/* Mapa de proyectos oculto: el cliente no quiere exponer info de clientes */}
        {/* <ArgentinaProjectsMap /> */}

        <TechnicalShowcase />

        {/* Segmentación */}
        <section className="bg-surface py-20 md:py-24" aria-labelledby="home2-segmentacion-heading">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-14 text-center md:mb-16">
              <p className="mb-3 font-headline text-xs font-bold uppercase tracking-[0.28em] text-secondary">
                Segmentación especializada
              </p>
              <h2
                id="home2-segmentacion-heading"
                className="font-headline text-3xl font-black uppercase tracking-tighter text-primary md:text-5xl"
              >
                Soluciones para cada distancia
              </h2>
              <div className="technical-gradient mx-auto mt-5 h-1 w-24" />
              <p className="mx-auto mt-6 max-w-2xl font-headline text-sm leading-relaxed text-on-surface-variant md:text-base">
                Urbano, media distancia y larga distancia: mismos estándares de ingeniería, distintas plataformas según su operación.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {[
                { href: "/flota#urbano", title: "Urbano", copy: "Alto volumen, maniobrabilidad y eficiencia para el transporte citadino.", icon: "location_city" as const, img: "/saldivia/buses_1.jpg", imgAlt: "Colectivo urbano Saldivia" },
                { href: "/flota#interurbano", title: "Interurbano", copy: "Confort y rendimiento para trayectos regionales y corredores semirrápidos.", icon: "route" as const, img: "/saldivia/carroceria.jpg", imgAlt: "Carrocería Saldivia para media distancia" },
                { href: "/flota#interprovincial", title: "Interprovincial", copy: "Presencia en ruta y confort ejecutivo para los viajes más exigentes.", icon: "map" as const, img: "/saldivia/buses.jpg", imgAlt: "Bus de larga distancia Saldivia" },
              ].map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  className="hub-card group relative flex min-h-[320px] cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-outline-variant/25 bg-surface-container-lowest p-8 shadow-[0px_12px_32px_rgba(13,44,79,0.08)] transition-shadow duration-300 hover:border-accent-blue/35 hover:shadow-[0px_20px_48px_rgba(13,44,79,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 md:min-h-[380px] md:p-10"
                >
                  <div className="absolute inset-0 hub-bg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    <img alt={card.imgAlt} className="h-full w-full object-cover" src={card.img} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-brand via-primary-brand/75 to-primary-brand/20" />
                  <div className="relative z-10 text-white">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-accent-blue">
                      <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                    </div>
                    <h3 className="font-headline text-2xl font-black uppercase tracking-tighter md:text-3xl">{card.title}</h3>
                    <p className="mt-3 font-headline text-sm leading-relaxed text-white/90 md:text-base">{card.copy}</p>
                    <span className="mt-6 inline-flex items-center font-headline text-xs font-bold uppercase tracking-widest text-accent-blue transition-colors duration-200 group-hover:text-white">
                      Ver en catálogo
                      <span className="material-symbols-outlined ml-1 text-lg transition-transform duration-200 group-hover:translate-x-0.5">arrow_forward</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* After-Sales Box */}
        <section className="bg-[#081b31] py-12 industrial-grid">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto bg-primary-brand border border-white/5 rounded-lg overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
              <div className="p-10 lg:w-[45%]">
                <div className="flex items-center gap-4 mb-3">
                  <span className="material-symbols-outlined text-accent-blue text-3xl">manufacturing</span>
                  <h2 className="font-headline text-xl font-bold text-white uppercase">Repuestos y Servicio</h2>
                </div>
                <p className="text-slate-300 text-sm opacity-80">Encuentre el Distribuidor de Asistencia Técnica o Repuestos más cercano.</p>
              </div>
              <div className="p-10 lg:w-[55%] w-full bg-white/5 backdrop-blur-sm">
                <form className="flex flex-col sm:flex-row gap-4">
                  <input className="flex-grow bg-[#081b31]/70 border-white/10 text-white placeholder-slate-500 rounded-md px-4 py-3 text-sm focus:ring-accent-blue outline-none focus:ring-2" placeholder="Ciudad" type="text" />
                  <button className="bg-accent-blue hover:bg-accent-blue-alt text-white font-bold px-8 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs" type="submit">
                    <span className="material-symbols-outlined text-sm">search</span> BUSCAR
                  </button>
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
                  className="min-w-[min(72vw,300px)] md:min-w-[280px] lg:min-w-[260px] aspect-[16/7] object-cover rounded-lg desaturated-img hover:grayscale-0 transition-all duration-700 snap-center shrink-0"
                  src={item.src}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-slate-900 relative">
          <div className="container relative mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-8">¿Está listo para renovar su flota?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a className="bg-accent-blue hover:bg-accent-blue-alt text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all" href="/trabaja-con-nosotros">CONTACTAR VENTAS</a>
              <a className="bg-white text-primary-brand px-10 py-4 rounded-full font-bold transition-all" href="/trabaja-con-nosotros">PEDIR PRESUPUESTO</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
