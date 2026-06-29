import { FadeUp, HeroStagger, TrajectoryRail } from "../components/motion";
import NosotrosTimeline from "../components/NosotrosTimeline";

export default function NosotrosPage() {
  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <section className="relative flex min-h-[min(52svh,380px)] items-center overflow-hidden asymmetric-gradient pt-24 pb-12 sm:min-h-[400px] sm:pb-10 md:min-h-[440px] md:pb-14 lg:min-h-[460px]">
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover object-center"
              alt="Armado de la estructura de carrocería en planta industrial"
              src="/saldivia/carroceria.jpg"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 sm:px-10 md:px-14">
            <HeroStagger>
              <h1 className="max-w-5xl text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tighter text-white">
                Nosotros
              </h1>
              <div className="mt-10 flex max-w-3xl items-start gap-5">
                <span className="mt-1 h-14 w-0.5 shrink-0 bg-secondary-container" />
                <p className="text-base font-medium leading-relaxed text-white/80 sm:text-lg md:text-xl">
                  Desde el 10 de agosto de 1995 trabajamos con una convicción clara: diseñar, fabricar y comercializar
                  vehículos que acompañen el crecimiento del transporte de pasajeros, siempre con foco en la calidad, la
                  innovación y el servicio postventa.
                </p>
              </div>
            </HeroStagger>
          </div>
        </section>

        <NosotrosTimeline />

        <FadeUp>
          <section className="relative overflow-hidden border-t border-outline-variant/20 bg-surface py-14 sm:py-20 md:py-24">
            <TrajectoryRail side="left" height="58%" />
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
                <div className="w-full lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full opacity-10 blur-3xl technical-gradient"></div>
                    <h2 className="relative text-3xl font-black uppercase leading-tight tracking-tighter text-primary sm:text-4xl md:text-5xl">
                      SALDIVIA, <br />
                      <span className="text-secondary">UNIENDO CAMINOS.</span>
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-on-surface-variant sm:mt-8 sm:text-lg">
                      Hoy seguimos creciendo con la misma pasión que nos impulsó desde el primer día, respaldados por
                      una sólida trayectoria, un servicio de postventa centralizado en planta y un equipo comprometido con la excelencia.
                    </p>
                    <ul className="mt-10 space-y-6">
                      <li className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary-container">
                          <span className="material-symbols-outlined text-sm text-on-secondary-container">check</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest text-primary">+4.100 unidades producidas</p>
                          <p className="text-sm text-on-surface-variant">
                            Una amplia diversidad de modelos que acompañan el crecimiento del transporte de pasajeros.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary-container">
                          <span className="material-symbols-outlined text-sm text-on-secondary-container">check</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest text-primary">Planta industrial</p>
                          <p className="text-sm text-on-surface-variant">
                            14.500 m² cubiertos sobre un predio de 2,6 hectáreas en el Parque Industrial Alvear.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="relative w-full lg:w-1/2">
                  <div className="rotate-2 rounded-xl bg-surface-container-high p-2 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:p-4">
                    <img
                      className="h-auto min-h-[220px] w-full max-h-[420px] rounded-lg object-cover sm:h-[500px] sm:max-h-none"
                      alt="Soldadura de estructura metálica en planta industrial Saldivia Carrocería"
                      src="/saldivia/soldadura.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeUp>

      </main>
    </div>
  );
}
