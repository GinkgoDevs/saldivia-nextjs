import Image from "next/image";
import Link from "next/link";

const SEGMENT_LINKS = [
  { label: "Urbano", href: "/flota#urbano" },
  { label: "Interurbano", href: "/flota#interurbano" },
  { label: "Interprovincial", href: "/flota#interprovincial" },
] as const;

export default function HomeHero3({ fullHeight = false }: { fullHeight?: boolean }) {
  return (
    <section
      id="saldivia-home-hero"
      className="relative overflow-hidden bg-primary"
      style={{ height: fullHeight ? '125dvh' : '93.75dvh' }}
      aria-labelledby="home-hero-heading-3"
    >
      <div className="absolute inset-0 z-0 bg-slate-900">
        <Image
          src="/background.png"
          alt="Unidad Saldivia Aries en ruta"
          fill
          priority
          className="object-cover object-center brightness-[0.85]"
          sizes="100vw"
        />
      </div>

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

      <div className="relative z-10 flex h-full flex-col justify-end pb-16 pt-28 md:justify-center md:pb-20 md:pt-32 lg:pb-24 lg:pt-28">
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="pointer-events-none absolute left-2 top-0 hidden md:block">
            <div className="h-10 w-10 border-l-2 border-t-2 border-accent-blue/80" />
          </div>

          <div className="relative max-w-3xl lg:max-w-2xl xl:max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-3 font-headline text-xs font-black uppercase tracking-[0.3em] text-accent-blue">
              <span className="h-px w-10 bg-accent-blue" aria-hidden />
              Ingeniería de clase mundial
            </p>

            <h1
              id="home-hero-heading-3"
              className="font-headline text-5xl font-black uppercase leading-[0.92] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[4.25rem] xl:text-8xl"
            >
              Nuevo ARIES
              <br />
              <span className="text-accent-blue">405 DD</span>
            </h1>

            <p className="mt-6 max-w-xl font-headline text-base font-medium leading-relaxed text-slate-200 md:mt-8 md:max-w-2xl md:text-lg md:leading-relaxed lg:text-xl lg:font-light">
              Redefiniendo los estándares del transporte de pasajeros: potencia, seguridad y presencia imponente con el
              sello industrial Saldivia.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 md:mt-10">
              <Link
                href="/flota"
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-sm bg-accent-blue px-8 py-4 font-headline text-sm font-black uppercase tracking-widest text-white shadow-xl transition-colors duration-200 hover:bg-accent-blue-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:px-10 md:py-5"
              >
                Explorar modelos
                <span className="material-symbols-outlined ml-2 text-xl" aria-hidden>
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/nosotros"
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-sm border border-white/25 bg-white/5 px-8 py-4 font-headline text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:px-10 md:py-5"
              >
                Tour industrial
              </Link>
            </div>

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
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/35 md:bottom-8 md:flex">
        <span className="font-headline text-[10px] font-bold uppercase tracking-[0.35em]">Descubrir</span>
        <span className="material-symbols-outlined motion-safe:animate-bounce motion-reduce:animate-none text-2xl" aria-hidden>
          expand_more
        </span>
      </div>
    </section>
  );
}
