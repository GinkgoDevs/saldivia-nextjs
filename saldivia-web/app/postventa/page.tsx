import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import { HeroStagger } from "../components/motion";
import { PostventaSoporteForm } from "../components/postventa/PostventaSoporteForm";

const POSTVENTA_PHONE = "+54 0800 222 7253";
const POSTVENTA_PHONE_HREF = "tel:+5408002227253";
const POSTVENTA_EMAIL = "postventa@saldivia.com.ar";
const POSTVENTA_EMAIL_HREF = `mailto:${POSTVENTA_EMAIL}`;

export default async function PostventaPage() {
  const supabase = await createClient();
  const { data: models } = await getModels(supabase, {});
  const modelOptions = (models ?? []).map((m) => ({ name: m.name, slug: m.slug }));

  return (
    <div className="bg-surface text-on-surface font-headline">
      <main className="min-h-screen">
        <section className="relative flex min-h-[min(60svh,380px)] items-center overflow-hidden pt-20 pb-10 sm:min-h-[320px] sm:pt-16 sm:pb-0">
          <div className="absolute inset-0 z-0">
            <img
              alt="Área técnica de postventa Saldivia"
              className="h-full w-full object-cover"
              src="/hero-soldadura.png"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/65 to-primary/35" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <HeroStagger>
                <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.28em] text-secondary-container">
                  Soporte oficial
                </span>
                <h1 className="text-3xl font-black uppercase leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Postventa
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  Asistencia técnica, seguimiento y soporte para unidades en operación.
                </p>
              </HeroStagger>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="ui-surface-card p-6 sm:p-8 md:p-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl">
                  Solicitud de asistencia
                </h2>
                <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
                  Completá el formulario con los datos de la unidad y del requerimiento.
                </p>
                <div className="mt-8">
                  <PostventaSoporteForm modelOptions={modelOptions} />
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:col-span-5">
              <div className="ui-surface-card p-6 sm:p-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-primary">Canales directos</h3>
                <div className="mt-6 space-y-5 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Teléfono
                    </p>
                    <a
                      href={POSTVENTA_PHONE_HREF}
                      className="mt-1 inline-block text-base font-bold text-primary hover:text-secondary"
                    >
                      {POSTVENTA_PHONE}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Email</p>
                    <a
                      href={POSTVENTA_EMAIL_HREF}
                      className="mt-1 inline-block text-base font-bold text-primary hover:text-secondary"
                    >
                      {POSTVENTA_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded border border-outline-variant/30 bg-surface-container-low p-6 text-sm text-on-surface-variant sm:p-8">
                Para seguimiento de casos, incluí número de chasis (VIN) y una descripción clara del inconveniente.
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
