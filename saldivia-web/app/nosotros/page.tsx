import { FadeUp, HeroStagger, TrajectoryRail } from "../components/motion";
import NosotrosTimeline from "../components/NosotrosTimeline";
import { NosotrosCalidad } from "./NosotrosCalidad";
import {
  PageHero,
  PageHeroImage,
  PAGE_HERO_EYEBROW_CLASS,
  PAGE_HERO_LEAD_CLASS,
  PAGE_HERO_TITLE_CLASS,
} from "../components/PageHero";
import { getQualityPolicyPdfUrl } from "@/lib/supabase/quality-policy";
import { createClient } from "@/lib/supabase/server";

export default async function NosotrosPage() {
  let qualityPdfUrl: string | null = null;
  try {
    const supabase = await createClient();
    qualityPdfUrl = await getQualityPolicyPdfUrl(supabase);
  } catch (err) {
    console.error("[NosotrosPage] quality policy pdf:", err);
  }

  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <PageHero
          image={
            <PageHeroImage
              src="/saldivia/carroceria.jpg"
              alt="Armado de la estructura de carrocería en planta industrial"
              className="object-cover object-center"
            />
          }
        >
          <HeroStagger>
            <span className={PAGE_HERO_EYEBROW_CLASS}>Nuestra historia</span>
            <h1 className={PAGE_HERO_TITLE_CLASS}>Nosotros</h1>
            <p className={PAGE_HERO_LEAD_CLASS}>
              Desde el 10 de agosto de 1995 trabajamos con una convicción clara: diseñar, fabricar y comercializar
              vehículos que acompañen el crecimiento del transporte de pasajeros, siempre con foco en la calidad, la
              innovación y el servicio postventa.
            </p>
          </HeroStagger>
        </PageHero>

        <NosotrosTimeline />

        <NosotrosCalidad pdfUrl={qualityPdfUrl} />

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
                  <div className="rotate-2 rounded-lg bg-surface-container-high p-2 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:p-4">
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
