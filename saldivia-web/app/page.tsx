import ArgentinaProjectsMap from "./components/ArgentinaProjectsMap";
import { CountUpStatsRow } from "./components/CountUpStatsRow";

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
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden bg-slate-900">
          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.72] scale-100 transition-all duration-700"
            src="/background.png"
          />
          <div className="absolute inset-0 hero-gradient-home"></div>
          <div className="absolute inset-0 hero-overlay-home"></div>
          <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
            <div className="max-w-4xl text-white">
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="h-[1px] w-12 bg-accent-blue"></span>
                <span className="text-xs font-black tracking-[0.3em] uppercase text-accent-blue">Ingeniería de Clase Mundial</span>
              </div>
              <h1 className="font-headline text-6xl md:text-8xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                Nuevo ARIES<br /><span className="text-accent-blue">405 DD</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed max-w-2xl font-light">
                Redefiniendo los estándares del transporte de pasajeros. Potencia, seguridad extrema y el diseño más imponente de la industria nacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a
                  className="inline-flex items-center justify-center bg-accent-blue hover:bg-accent-blue-alt text-white px-10 py-5 rounded-sm font-black text-sm uppercase tracking-widest transition-all transform hover:scale-105 shadow-2xl"
                  href="/flota"
                >
                  EXPLORAR MODELOS
                  <span className="material-symbols-outlined ml-3">arrow_forward</span>
                </a>
                <a
                  className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-sm font-black text-sm uppercase tracking-widest transition-all"
                  href="/nosotros"
                >
                  TOUR INDUSTRIAL
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Descubrir</span>
            <span className="material-symbols-outlined text-3xl animate-bounce">expand_more</span>
          </div>
        </section>

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
              <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-14 h-14 rounded-full bg-accent-blue flex items-center justify-center hover:bg-accent-blue-alt transition-all shadow-xl">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex-grow flex flex-col lg:flex-row relative">
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
              <div className="lg:w-2/3 relative h-[50vh] lg:h-auto">
                <img
                  alt="Aries 405 DD Detailed"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/ADBb0uj4pIvVhuL3wPnZ8Y4382UPXGKpGW4O6MJjurtbklrB_GuH9bpBXG7McvElBXPJrxq5YGLz8fdcEl2OSO-ylalqbMEiLa5f20OfXrEoQuOBkrLvy2rJeO3FwDvCZ_UWQsBH-7Nmm3aUZJ6-f-4Kjj9EyKp_O7BxWqL7rxg8LEdgj5SHI-raPYK8KCjeWZFvmKo0Cw4BHilwUWzP0K6PaRZ9j-Tu2z7kFoxbOAZY-6BvTf4hd9lSI1jC2a2mi64W3NvY7ZzUpVkXkZo"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-industrial-charcoal via-transparent to-transparent hidden lg:block"></div>
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
                <a
                  className="group inline-flex items-center justify-center bg-white text-industrial-charcoal py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent-blue hover:text-white transition-all shadow-lg"
                  href="#"
                >
                  Descargar Ficha Técnica
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">download</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Segmented Solutions */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-accent-blue font-bold tracking-[0.2em] uppercase text-sm mb-4">Segmentación Especializada</h2>
              <h3 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-6">Soluciones para cada distancia</h3>
              <div className="w-24 h-1.5 bg-accent-blue mx-auto rounded-full"></div>
            </div>
            <div className="flex flex-col space-y-8">
              <a className="hub-card group relative h-[400px] overflow-hidden rounded-3xl flex flex-col justify-center p-8 md:p-12 shadow-xl" href="/flota">
                <div className="absolute inset-0 hub-bg transition-transform duration-700">
                  <img
                    alt="Transporte Urbano"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp1v9AMqTiqFcZea0MHsqrp5mtMe32wUnE5I7fq-DZdPRgSsD6k8RVx7mKqnnlJ9-1R76EfefScx7uRIZJPfrl_JKeGVP9ybdsgjHj3M2ehL8ms1rz_zUIIKGIpuEAfTKO2RGja7niSdTYjXC1dd98lcpAjoKOQ0g15LgeEkOIbUNRloXzrVJVKEyg3blta6ll7Z37BFsK0QYDAPiH9ykAKvLC2Ibbo3_kl5eXSgUGWYgxLUJHVTz47FxuhKZVoaWwkk5Yrh2W_190"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent"></div>
                <div className="relative z-10 text-white max-w-xl">
                  <div className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-3xl">location_city</span>
                  </div>
                  <h4 className="font-headline text-4xl font-bold mb-4">Urbano</h4>
                  <p className="text-slate-100 text-lg mb-8">Eficiencia y versatilidad para el flujo constante de la ciudad.</p>
                  <div className="flex items-center text-sm font-bold tracking-widest uppercase text-accent-blue">
                    Explorar Segmento <span className="material-symbols-outlined ml-2">arrow_right_alt</span>
                  </div>
                </div>
              </a>
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
                  <input
                    className="flex-grow bg-[#081b31]/70 border-white/10 text-white placeholder-slate-500 rounded-md px-4 py-3 text-sm focus:ring-accent-blue outline-none focus:ring-2"
                    placeholder="Ciudad"
                    type="text"
                  />
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
                  className="min-w-[min(72vw,300px)] md:min-w-[280px] lg:min-w-[260px] aspect-[16/7] object-cover rounded-sm desaturated-img hover:grayscale-0 transition-all duration-700 snap-center shrink-0"
                  src={item.src}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-slate-900 relative">
          <div className="container relative mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-8">¿Estás listo para renovar tu flota?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a className="bg-accent-blue hover:bg-accent-blue-alt text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all" href="/contacto">CONTACTAR VENTAS</a>
              <a className="bg-white text-primary px-10 py-4 rounded-full font-bold transition-all" href="/contacto">PEDIR PRESUPUESTO</a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
