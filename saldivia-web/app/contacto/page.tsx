import { FadeUp, HeroStagger, StaggerInView, StaggerItem } from "../components/motion";
import { buttonClass } from "../components/ui/Button";
import { ContactoForm } from "../components/contact/ContactoForm";
import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import { ContactoChannelStagger } from "./ContactoChannelStagger";

const PLANT_ADDRESS =
  "Parque Industrial Alvear, Ruta 21 Km 7, Alvear, Santa Fe, Argentina";
export default async function ContactoPage() {
  const supabase = await createClient();
  const { data: models } = await getModels(supabase, {});
  const modelOptions = (models ?? []).map((m) => ({ name: m.name, slug: m.slug }));
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedQuery = encodeURIComponent(PLANT_ADDRESS);
  const mapEmbedSrc = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${embedQuery}&zoom=15`
    : null;
  const mapsExternalHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLANT_ADDRESS)}`;

  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <section className="relative flex min-h-[min(100svh,480px)] items-center overflow-hidden bg-primary-container pt-20 pb-10 sm:h-[450px] sm:min-h-0 sm:pt-16 sm:pb-0">
          <div className="absolute inset-0 z-0">
            <img
              className="h-full w-full object-cover opacity-30 mix-blend-overlay"
              alt="Bus manufacturing facility"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhYxKqaSFEx2SsOSyf72IupxQSTraxx3mVoYdLimkg6EsBaSSN9kbBKtpdDr0oNGTrWJRA08OV7DqUV3XEIbgizHY7IMwE-nheke7fg1f9MnzzR19ctpuzs2bwa2gplghpgiKz2oGmAYppmydPOHjqRSipRZUyr_y7CGyXFSHVzwPsNDG8XwJ85JhexXLQzpelA-5wbk_VHJZF2K3VaSYn6dTQNqJcHW2BWHhgyqu4DeEHlKHBNODwg9JcyjzudtjJA4j7mbcWE_rz"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent"></div>
          </div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl">
              <HeroStagger>
                <span className="mb-0 block font-label text-sm font-bold text-machined text-secondary-container sm:mb-1">
                  Ingeniería de Clase Mundial
                </span>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-primary sm:text-4xl md:text-6xl lg:text-7xl">
                  Contáctenos
                </h1>
                <p className="mt-0 max-w-xl text-sm leading-relaxed text-on-primary-container font-headline sm:text-base md:text-lg">
                  Conecte con nuestra planta industrial y equipo comercial. Estamos aquí para impulsar su flota con
                  precisión y eficiencia.
                </p>
              </HeroStagger>
            </div>
          </div>
        </section>

        <section className="bg-surface py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="flex flex-col gap-8 sm:gap-10 lg:col-span-5 lg:gap-12">
                <FadeUp size="sm">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="font-headline text-xl font-bold text-secondary sm:text-2xl">Canales Directos</h2>
                    <p className="text-sm text-on-surface-variant font-headline sm:text-base">
                      Póngase en contacto con el departamento específico para una respuesta más ágil.
                    </p>
                  </div>
                </FadeUp>
                <ContactoChannelStagger />
              </div>

              <div className="lg:col-span-7">
                <FadeUp delay={0.06} size="sm">
                  <div className="ui-surface-card p-5 sm:p-8 md:p-12">
                    <h3 className="mb-2 font-headline text-2xl font-bold text-primary sm:text-3xl">Solicitud de cotización</h3>
                    <p className="mb-8 text-sm text-on-surface-variant sm:mb-10 sm:text-base">
                      Complete el formulario y un asesor técnico comercial lo contactará a la brevedad.
                    </p>
                    <ContactoForm modelOptions={modelOptions} />
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low pt-12 sm:pt-16 md:pt-24">
          <FadeUp>
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
              <div className="mb-8 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <span className="font-label text-sm font-bold text-machined text-secondary">Ubicación Estratégica</span>
                  <h2 className="font-headline text-2xl font-bold text-primary sm:text-3xl md:text-4xl">Planta Industrial Alvear</h2>
                  <div className="flex items-start gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-secondary">location_on</span>
                    <p className="font-headline text-sm leading-relaxed sm:text-base">{PLANT_ADDRESS}.</p>
                  </div>
                </div>
                <a
                  className={buttonClass({
                    variant: "link-cta",
                    size: "sm",
                    className:
                      "group min-h-0 w-fit px-0 py-0 text-secondary hover:text-secondary border-b-2 border-transparent hover:border-secondary rounded-none focus-visible:ring-offset-surface-container-low",
                  })}
                  href={mapsExternalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en Google Maps
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </a>
              </div>
            </div>
          </FadeUp>
          <div className="relative h-[min(50vh,420px)] w-full overflow-hidden rounded-t-lg bg-surface-container-highest sm:h-[min(55vh,480px)] md:h-[500px]">
            {mapEmbedSrc ? (
              <iframe
                title="Ubicación Planta Industrial Alvear en Google Maps"
                className="absolute inset-0 w-full h-full border-0"
                src={mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-secondary">map</span>
                <p className="max-w-md font-headline">
                  Configurá <code className="rounded bg-surface-container-low px-2 py-0.5 text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en{" "}
                  <code className="rounded bg-surface-container-low px-2 py-0.5 text-sm">.env.local</code> para mostrar el mapa.
                </p>
                <a
                  className={buttonClass({
                    variant: "link-cta",
                    size: "sm",
                    className:
                      "min-h-0 px-0 py-0 text-secondary underline rounded-none focus-visible:ring-offset-surface-container-highest",
                  })}
                  href={mapsExternalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps
                </a>
              </div>
            )}
            <div className="pointer-events-none absolute bottom-2 right-2 flex max-w-[calc(100%-1rem)] flex-wrap justify-end gap-1.5 sm:bottom-4 sm:right-4 sm:gap-2">
              <div className="rounded bg-secondary-container px-2 py-1.5 text-[10px] font-bold text-machined text-on-secondary-container shadow-md sm:px-4 sm:py-2 sm:text-xs">
                -32.9597, -60.6393
              </div>
              <div className="rounded bg-secondary-container px-2 py-1.5 text-[10px] font-bold text-machined text-on-secondary-container shadow-md sm:px-4 sm:py-2 sm:text-xs">
                S 21 KM 7
              </div>
            </div>
          </div>
        </section>

        <div className="bg-primary">
          <StaggerInView
            className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-10 text-on-primary opacity-60 sm:flex-row sm:flex-wrap sm:gap-12 md:gap-16 sm:px-8 sm:py-16"
            stagger={0.12}
          >
            <StaggerItem className="flex max-w-full items-center gap-3 sm:gap-4">
              <span className="material-symbols-outlined shrink-0 text-3xl sm:text-4xl">verified</span>
              <span className="text-machined text-[11px] font-bold sm:text-xs">Certificación ISO 9001</span>
            </StaggerItem>
            <StaggerItem className="flex max-w-full items-center gap-3 sm:gap-4">
              <span className="material-symbols-outlined shrink-0 text-3xl sm:text-4xl">workspace_premium</span>
              <span className="text-machined text-[11px] font-bold sm:text-xs">Calidad de Exportación</span>
            </StaggerItem>
            <StaggerItem className="flex max-w-full items-center gap-3 sm:gap-4">
              <span className="material-symbols-outlined shrink-0 text-3xl sm:text-4xl">high_quality</span>
              <span className="text-machined text-[11px] font-bold sm:text-xs">Ingeniería Certificada</span>
            </StaggerItem>
          </StaggerInView>
        </div>
      </main>
    </div>
  );
}
