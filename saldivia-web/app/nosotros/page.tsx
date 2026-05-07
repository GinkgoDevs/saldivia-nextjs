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
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-14 bg-secondary-container" />
                <span className="text-xs font-bold uppercase tracking-[0.45em] text-secondary-container">
                  Nuestra Trayectoria
                </span>
              </div>
              <h1 className="max-w-5xl text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tighter text-white">
                DÉCADAS DE
                <br />
                <span className="text-secondary-container">PRECISIÓN</span>
              </h1>
              <div className="mt-10 flex max-w-2xl items-start gap-5">
                <span className="mt-1 h-14 w-0.5 shrink-0 bg-secondary-container" />
                <p className="text-base font-medium leading-relaxed text-white/80 sm:text-lg md:text-xl">
                  Desde nuestros orígenes industriales hasta convertirnos en referentes del transporte regional, cada
                  kilómetro recorrido es testimonio de ingeniería y compromiso.
                </p>
              </div>
            </HeroStagger>
          </div>
        </section>

        <NosotrosTimeline />

        <FadeUp>
          <section className="relative overflow-hidden bg-surface py-14 sm:py-20 md:py-24">
            <TrajectoryRail side="left" height="58%" />
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
                <div className="w-full lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full opacity-10 blur-3xl technical-gradient"></div>
                    <h2 className="relative text-3xl font-black uppercase leading-tight tracking-tighter text-primary sm:text-4xl md:text-5xl">
                      EL ADN DE <br />
                      <span className="text-secondary">CADA ESTRUCTURA</span>
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-on-surface-variant sm:mt-8 sm:text-lg">
                      No solo fabricamos carrocerías; esculpimos piezas de ingeniería que resisten las condiciones más
                      extremas. Nuestra obsesión por el detalle se traduce en longevidad para su flota.
                    </p>
                    <ul className="mt-10 space-y-6">
                      <li className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary-container">
                          <span className="material-symbols-outlined text-sm text-on-secondary-container">check</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest text-primary">Aceros de alta resistencia</p>
                          <p className="text-sm text-on-surface-variant">
                            Aleaciones certificadas que optimizan el peso sin comprometer la seguridad.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary-container">
                          <span className="material-symbols-outlined text-sm text-on-secondary-container">check</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest text-primary">Aerodinámica computacional</p>
                          <p className="text-sm text-on-surface-variant">
                            Diseños testeados en túneles de viento virtuales para reducir el consumo.
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
                      alt="Industrial welding process"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrDFciMzKIDBVpeDSlHAdhQ64TjXYVTPMsFO5nwrejTh-YiKGjy86Jr2ALH03jcOhb7DUWWzgo6wunQ3RuxcUFYS8ENvh_wXE-X9tQ_fsQST0tRMDBy6a4AfvH57CdzEk8r4EZURzfNLrXPKiWxLyN5Yw64JZOOe8ZqJA-1CZFCjqvqyqOlIDlE2e6q-ZLDW7SEMMzdW5SNyihyiDnBzUGRDR2CSJdoj8vgeqz_rh8Vi2o3ulPAtvS0mMD82y_4_sWw4DSXQjZVCZc"
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
