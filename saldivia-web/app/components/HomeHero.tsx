import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "./ui/Button";

const SEGMENT_LINKS = [
  { label: "Urbano", href: "/flota#urbano" },
  { label: "Interurbano", href: "/flota#interurbano" },
  { label: "Interprovincial", href: "/flota#interprovincial" },
] as const;

/**
 * Hero home v1: mensaje editorial único + panel diagonal (lenguaje marca Saldivia).
 * Server Component — sin carrusel para LCP y foco claro.
 */
export default function HomeHero() {
  return (
    <section
      id="saldivia-home-hero"
      className="relative min-h-screen overflow-hidden bg-primary"
      aria-labelledby="home-hero-heading"
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

      {/* Móvil: legibilidad del copy sobre la foto */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[1] h-[52%] bg-gradient-to-t from-primary/70 via-primary/55 to-transparent lg:hidden"
      />

      {/* Desktop: corte diagonal tipo “avance” (alineado al wordmark inclinado) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[min(560px,52vw)] bg-primary/90 backdrop-blur-[2px] lg:block"
        style={{
          clipPath: "polygon(26% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-end pb-16 pt-28 md:justify-center md:pb-20 md:pt-32 lg:pb-24 lg:pt-28">
        <div className="container relative mx-auto px-4 md:px-6">
          {/* Esquinas marca — mismo vocabulario que /flota */}
          <div className="pointer-events-none absolute left-2 top-0 hidden md:block">
            <div className="h-10 w-10 border-l-2 border-t-2 border-accent-blue/80" />
          </div>

          <div className="relative max-w-3xl lg:max-w-2xl xl:max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-3 font-headline text-xs font-black uppercase tracking-[0.3em] text-accent-blue">
              <span className="h-px w-10 bg-accent-blue" aria-hidden />
              Ingeniería de clase mundial
            </p>

            <h1
              id="home-hero-heading"
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
                className={buttonClass({
                  variant: "primary",
                  size: "lg",
                  className:
                    "rounded-curve-md px-8 shadow-elev-2 md:px-10",
                })}
              >
                Explorar modelos
                <span className="material-symbols-outlined ml-2 text-xl" aria-hidden>
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/nosotros"
                className={buttonClass({
                  variant: "outline",
                  size: "lg",
                  className:
                    "rounded-curve-md border-white/25 bg-white/[0.07] px-8 text-white backdrop-blur-md hover:border-secondary-container/70 hover:bg-white/[0.14] hover:text-white dark:border-white/20 dark:text-white md:px-10",
                })}
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
                      className={buttonClass({
                        variant: "outline",
                        size: "sm",
                        className:
                          "rounded-curve-pill border-white/20 bg-primary/40 text-white backdrop-blur-sm hover:border-secondary-container/60 hover:bg-white/10 hover:text-white dark:border-white/20 dark:text-white",
                      })}
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
