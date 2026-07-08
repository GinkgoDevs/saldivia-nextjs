import { HeroStagger } from "../components/motion";
import { ContactoForm } from "../components/contact/ContactoForm";
import {
  PageHero,
  PageHeroImage,
  PAGE_HERO_EYEBROW_CLASS,
  PAGE_HERO_LEAD_CLASS,
  PAGE_HERO_TITLE_CLASS,
  PAGE_HERO_ACCENT_CLASS,
} from "../components/PageHero";
import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";

import { PLANT_ADDRESS, PLANT_MAPS_HREF } from "@/lib/site-location";

const CONTACT_PHONE = "+54 0341 4921135";
const CONTACT_PHONE_HREF = "tel:+543414921135";
const CONTACT_EMAIL = "info@saldiviabuses.com.ar";
const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
const RRHH_EMAIL = "cv@saldiviabuses.com.ar";
const RRHH_EMAIL_HREF = `mailto:${RRHH_EMAIL}`;

export default async function TrabajaConNosotrosPage() {
  const supabase = await createClient();
  const { data: models } = await getModels(supabase, {});
  const modelOptions = (models ?? []).map((m) => ({ name: m.name, slug: m.slug }));

  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <PageHero
          image={
            <PageHeroImage
              src="/hero-buses2.png"
              alt="Planta industrial con unidades en taller y línea de ensamble"
              className="object-cover object-left sm:object-[50%_68%] md:object-[50%_65%]"
            />
          }
        >
          <HeroStagger>
            <span className={PAGE_HERO_EYEBROW_CLASS}>Contacto y RRHH</span>
            <h1 className={PAGE_HERO_TITLE_CLASS}>
              Trabaja
              <br />
              <span className={PAGE_HERO_ACCENT_CLASS}>con nosotros</span>
            </h1>
            <p className={PAGE_HERO_LEAD_CLASS}>
              Envíenos su consulta comercial o su CV para futuras búsquedas laborales.
            </p>
          </HeroStagger>
        </PageHero>

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
                    href={PLANT_MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary"
                  >
                    Ver en Google Maps
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </a>
                </div>
              </div>

              <div className="rounded-curve-lg border border-outline-variant/30 bg-surface-container-low p-6 text-sm text-on-surface-variant sm:p-8">
                Si desea postularse, envíe su CV por mail y nos pondremos en contacto cuando haya vacantes.
              </div>
            </aside>

            <div className="lg:col-span-7">
              <div className="ui-surface-card p-6 sm:p-8 md:p-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl">
                  Escríbanos
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
