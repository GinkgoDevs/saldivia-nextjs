import type { Metadata } from "next";

import { ContactoForm } from "@/app/components/contact/ContactoForm";
import { HeroStagger } from "@/app/components/motion";
import {
  PageHero,
  PageHeroImage,
  PAGE_HERO_EYEBROW_CLASS,
  PAGE_HERO_LEAD_CLASS,
  PAGE_HERO_TITLE_CLASS,
} from "@/app/components/PageHero";
import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import { PLANT_ADDRESS, PLANT_MAPS_HREF } from "@/lib/site-location";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Consultas comerciales, presupuestos y atención a empresas de transporte. Saldivia Carrocerías.",
};

const CONTACT_PHONE = "+54 0341 4921135";
const CONTACT_PHONE_HREF = "tel:+543414921135";
const SALES_EMAIL = "ventas@saldiviabuses.com.ar";
const SALES_EMAIL_HREF = `mailto:${SALES_EMAIL}`;
const AFTERSALES_EMAIL = "postventa@saldiviabuses.com.ar";
const AFTERSALES_EMAIL_HREF = `mailto:${AFTERSALES_EMAIL}`;

export default async function ContactoPage() {
  const supabase = await createClient();
  const { data: models } = await getModels(supabase, {});
  const modelOptions = (models ?? []).map((m) => ({ name: m.name, slug: m.slug }));

  return (
    <div className="bg-surface font-headline text-on-surface">
      <main>
        <PageHero
          image={
            <PageHeroImage
              src="/hero-buses.png"
              alt="Unidades Saldivia en planta industrial"
              className="object-cover object-center"
            />
          }
        >
          <HeroStagger>
            <span className={PAGE_HERO_EYEBROW_CLASS}>Atención comercial</span>
            <h1 className={PAGE_HERO_TITLE_CLASS}>Contacto</h1>
            <p className={PAGE_HERO_LEAD_CLASS}>
              Consultas comerciales, presupuestos y asesoramiento para la renovación o ampliación de su flota.
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
                      Teléfono comercial
                    </p>
                    <a
                      href={CONTACT_PHONE_HREF}
                      className="mt-1 inline-block text-base font-bold text-primary hover:text-secondary"
                    >
                      {CONTACT_PHONE}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Correos directos
                    </p>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                          Ventas
                        </p>
                        <a
                          href={SALES_EMAIL_HREF}
                          className="mt-1 inline-block break-all text-base font-bold text-primary hover:text-secondary"
                        >
                          {SALES_EMAIL}
                        </a>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                          Postventa
                        </p>
                        <a
                          href={AFTERSALES_EMAIL_HREF}
                          className="mt-1 inline-block break-all text-base font-bold text-primary hover:text-secondary"
                        >
                          {AFTERSALES_EMAIL}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Planta</p>
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
                Para postventa y asistencia técnica, visite la sección{" "}
                <a href="/postventa" className="font-bold text-primary hover:text-secondary">
                  Postventa
                </a>
                . Para envío de CV,{" "}
                <a href="/trabaja-con-nosotros" className="font-bold text-primary hover:text-secondary">
                  Trabaja con nosotros
                </a>
                .
              </div>
            </aside>

            <div className="lg:col-span-7">
              <div className="ui-surface-card p-6 sm:p-8 md:p-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl">
                  Solicitar presupuesto
                </h3>
                <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
                  Complete el formulario y nuestro equipo comercial se pondrá en contacto.
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
