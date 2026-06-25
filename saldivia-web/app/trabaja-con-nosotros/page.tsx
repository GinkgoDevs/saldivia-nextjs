import { HeroStagger } from "../components/motion";
import { ContactoForm } from "../components/contact/ContactoForm";
import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";

const PLANT_ADDRESS = "Ruta 21 km. 7, Parque Industrial Alvear, Santa Fe, Argentina";
const CONTACT_PHONE = "+54 0341 4921135";
const CONTACT_PHONE_HREF = "tel:+543414921135";
const CONTACT_EMAIL = "info@saldiviabuses.com.ar";
const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
const RRHH_EMAIL = "rrhh@saldiviabuses.com.ar";
const RRHH_EMAIL_HREF = `mailto:${RRHH_EMAIL}`;
const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLANT_ADDRESS)}`;

export default async function TrabajaConNosotrosPage() {
  const supabase = await createClient();
  const { data: models } = await getModels(supabase, {});
  const modelOptions = (models ?? []).map((m) => ({ name: m.name, slug: m.slug }));

  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <section className="relative flex min-h-[min(60svh,380px)] items-center overflow-hidden bg-primary-container pt-20 pb-10 sm:min-h-[320px] sm:pt-16 sm:pb-0">
          <div className="absolute inset-0 z-0">
            <img
              className="h-full w-full object-cover object-left opacity-50 sm:object-center"
              alt="Planta industrial con unidades en taller y linea de ensamble"
              src="/hero-buses2.png"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/65 to-primary/35" />
          </div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <HeroStagger>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.28em] text-secondary-container">
                  Contacto y RRHH
                </span>
                <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Trabaja con nosotros
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  Envíenos su consulta comercial o su CV para futuras búsquedas laborales.
                </p>
              </HeroStagger>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <aside className="space-y-4 lg:col-span-5">
              <div className="ui-surface-card p-6 sm:p-8">
                <h2 className="text-xl font-black uppercase tracking-tight text-primary sm:text-2xl">
                  Canales directos
                </h2>
                <div className="mt-6 space-y-5 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Telefono
                    </p>
                    <a
                      href={CONTACT_PHONE_HREF}
                      className="mt-1 inline-block text-base font-bold text-primary hover:text-secondary"
                    >
                      {CONTACT_PHONE}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Email</p>
                    <a
                      href={CONTACT_EMAIL_HREF}
                      className="mt-1 inline-block text-base font-bold text-primary hover:text-secondary"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      RRHH (CV)
                    </p>
                    <a
                      href={RRHH_EMAIL_HREF}
                      className="mt-1 inline-block text-base font-bold text-primary hover:text-secondary"
                    >
                      {RRHH_EMAIL}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Direccion</p>
                    <p className="mt-1 text-on-surface-variant">{PLANT_ADDRESS}</p>
                  </div>
                  <a
                    href={MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary"
                  >
                    Ver en Google Maps
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </a>
                </div>
              </div>

              <div className="rounded-curve-sm border border-outline-variant/30 bg-surface-container-low p-6 text-sm text-on-surface-variant sm:p-8">
                Si desea postularse, envíe su CV por mail y nos pondremos en contacto cuando haya vacantes.
              </div>
            </aside>

            <div className="lg:col-span-7">
              <div className="ui-surface-card p-6 sm:p-8 md:p-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl">
                  Escribinos
                </h3>
                <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
                  Complete el formulario y nuestro equipo se pondrá en contacto.
                </p>
                <div className="mt-8">
                  <ContactoForm modelOptions={modelOptions} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
