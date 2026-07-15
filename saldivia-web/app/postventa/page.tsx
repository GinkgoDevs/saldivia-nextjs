import { HeroStagger } from "../components/motion";
import { PostventaSoporteForm } from "../components/postventa/PostventaSoporteForm";
import {
  PageHero,
  PageHeroImage,
  PAGE_HERO_LEAD_CLASS,
  PAGE_HERO_TITLE_CLASS,
  PAGE_HERO_ACCENT_CLASS,
} from "../components/PageHero";

const POSTVENTA_EMAIL = "postventa@saldiviabuses.com.ar";
const POSTVENTA_EMAIL_HREF = `mailto:${POSTVENTA_EMAIL}`;
const AUTOGESTION_URL = "https://portal.saldiviabuses.com.ar/";

export default function PostventaPage() {
  return (
    <div className="bg-surface font-headline text-on-surface">
      <main className="min-h-screen">
        <PageHero
          image={
            <PageHeroImage
              src="/saldivia/soldadura.jpg"
              alt="Área técnica de postventa Saldivia"
              className="object-cover object-center"
            />
          }
        >
          <HeroStagger>
            <h1 className={PAGE_HERO_TITLE_CLASS}>
              Saldivia lo acompaña
              <br />
              <span className={PAGE_HERO_ACCENT_CLASS}>en todo el camino</span>
            </h1>
            <p className={PAGE_HERO_LEAD_CLASS}>
              En Saldivia estamos siempre atentos para ayudarlo en lo que necesite. Envíenos su consulta a través del
              formulario.
            </p>
          </HeroStagger>
        </PageHero>

        <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="ui-surface-card p-6 sm:p-8 md:p-10">
                <PostventaSoporteForm />
              </div>
            </div>

            <aside className="space-y-4 lg:col-span-5">
              <div className="ui-surface-card p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  También podes escribirnos a:{" "}
                  <a
                    href={POSTVENTA_EMAIL_HREF}
                    className="font-bold text-primary hover:text-secondary"
                  >
                    {POSTVENTA_EMAIL}
                  </a>
                </p>
              </div>

              <div className="ui-surface-card p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  Acceso clientes
                </p>
                <a
                  href={AUTOGESTION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-base font-bold text-primary hover:text-secondary"
                >
                  portal.saldiviabuses.com.ar
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
