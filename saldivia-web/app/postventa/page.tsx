import { HeroStagger } from "../components/motion";
import { PostventaSoporteForm } from "../components/postventa/PostventaSoporteForm";

const POSTVENTA_EMAIL = "postventa@saldiviabuses.com.ar";
const POSTVENTA_EMAIL_HREF = `mailto:${POSTVENTA_EMAIL}`;
const AUTOGESTION_URL = "https://autogestion.saldiviabuses.com.ar";

export default function PostventaPage() {
  return (
    <div className="bg-surface font-headline text-on-surface">
      <main className="min-h-screen">
        <section className="relative flex min-h-[min(60svh,380px)] items-center overflow-hidden pb-10 pt-20 sm:min-h-[320px] sm:pb-0 sm:pt-16">
          <div className="absolute inset-0 z-0">
            <img
              alt="Área técnica de postventa Saldivia"
              className="h-full w-full object-cover"
              src="/saldivia/soldadura.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/65 to-primary/35" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <HeroStagger>
                <h1 className="text-3xl font-black uppercase leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Saldivia lo acompaña en todo el camino
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  En Saldivia estamos siempre atentos para ayudarlo en lo que necesite. Envíenos su consulta a
                  través del formulario.
                </p>
              </HeroStagger>
            </div>
          </div>
        </section>

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
                  También puede escribirnos a:{" "}
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
                  autogestion.saldiviabuses.com.ar
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
