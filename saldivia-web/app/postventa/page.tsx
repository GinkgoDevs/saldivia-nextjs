import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import { FadeUp, HeroStagger } from "../components/motion";
import { PostventaSoporteForm } from "../components/postventa/PostventaSoporteForm";
import { Button } from "../components/ui/Button";
import { PostventaServiceGrid } from "./PostventaServiceGrid";

export default async function PostventaPage() {
  const supabase = await createClient();
  const { data: models } = await getModels(supabase, {});
  const modelOptions = (models ?? []).map((m) => ({ name: m.name, slug: m.slug }));
  return (
    <div className="bg-surface text-on-surface font-headline">
      <main className="min-h-screen">
        <section className="relative flex min-h-[min(100svh,420px)] items-center overflow-hidden pt-20 pb-10 sm:h-[400px] sm:min-h-0 sm:pt-16 sm:pb-0">
          <div className="absolute inset-0 z-0">
            <img
              alt="Technical support facility"
              className="h-full w-full object-cover"
              src="/hero-soldadura.png"
            />
            <div className="absolute inset-0 machined-gradient opacity-80"></div>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl">
              <HeroStagger>
                <span className="mb-0 inline-block bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:mb-1">
                  Ingeniería en Movimiento
                </span>
                <h1 className="text-2xl font-extrabold leading-tight tracking-tighter text-white sm:text-3xl md:text-4xl lg:text-5xl">
                  CENTRO DE POSTVENTA Y SOPORTE TÉCNICO
                </h1>
              </HeroStagger>
            </div>
          </div>
        </section>

        <section className="relative z-20 mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 md:px-8 md:-mt-12 lg:-mt-16">
          <PostventaServiceGrid />

          <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 sm:gap-12 lg:mt-24 lg:grid-cols-3">
            <FadeUp className="lg:col-span-2" size="sm">
              <div className="mb-8 sm:mb-12">
                <h2 className="mb-2 text-xl font-black tracking-tighter text-primary sm:text-2xl md:text-3xl">
                  SOLICITUD DE ASISTENCIA TÉCNICA
                </h2>
                <div className="h-1 w-12 bg-secondary"></div>
              </div>
              <PostventaSoporteForm modelOptions={modelOptions} />
            </FadeUp>

            <FadeUp delay={0.08} size="sm" className="space-y-6 sm:space-y-8">
              <div className="rounded bg-surface-container-high p-5 sm:p-8">
                <h3 className="mb-3 font-black text-lg tracking-tighter text-primary sm:mb-4 sm:text-xl">CANALES DIRECTOS</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center machined-gradient">
                      <span className="material-symbols-outlined text-xl text-white">phone_in_talk</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Atención 24/7</p>
                      <p className="text-lg font-bold text-primary">+54 0800 222 7253</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center machined-gradient">
                      <span
                        className="material-symbols-outlined text-xl text-white"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        mail
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email Corporativo</p>
                      <p className="text-lg font-bold text-primary">postventa@saldivia.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[220px] overflow-hidden machined-gradient p-5 sm:h-[250px] sm:p-8">
                <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 scale-150 opacity-10">
                  <span className="material-symbols-outlined" style={{ fontSize: "200px" }}>
                    engineering
                  </span>
                </div>
                <div className="relative z-10">
                  <h4 className="mb-3 text-xl font-black leading-none tracking-tighter text-white sm:mb-4 sm:text-2xl">BIBLIOTECA TÉCNICA</h4>
                  <p className="mb-4 text-sm leading-relaxed text-on-primary-container sm:mb-6">
                    Acceda a manuales de usuario, esquemas eléctricos y guías de mantenimiento preventivo.
                  </p>
                  <Button
                    className="bg-secondary-container px-5 text-on-secondary-container hover:bg-white sm:px-6"
                    size="sm"
                  >
                    Area de Clientes
                  </Button>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
    </div>
  );
}
