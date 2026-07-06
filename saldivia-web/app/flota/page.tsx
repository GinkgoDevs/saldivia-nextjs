import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { buttonClass } from "../components/ui/Button";
import { FlotaGrid } from "./FlotaGrid";
import { FadeUp, HeroStagger } from "../components/motion";
import {
  PageHero,
  PageHeroImage,
  PAGE_HERO_EYEBROW_CLASS,
  PAGE_HERO_LEAD_CLASS,
  PAGE_HERO_TITLE_CLASS,
  PAGE_HERO_ACCENT_CLASS,
} from "../components/PageHero";
import type { FlotaModel } from "./FlotaModelCard";

export default async function FlotaPage() {
  const supabase = await createClient();
  const { data: allModels, error } = await getModels(supabase, {});

  const models: FlotaModel[] = [];
  if (!error && allModels) {
    for (const m of allModels) {
      models.push({
        slug: m.slug,
        name: m.name,
        description: m.description,
        cover_image_url: m.cover_image_url,
        cover_image_focal_x: m.cover_image_focal_x,
        cover_image_focal_y: m.cover_image_focal_y,
        cover_image_zoom: m.cover_image_zoom,
      });
    }
  }

  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <main>
        <PageHero
          image={
            <PageHeroImage
              src="/hero-flota-2.jpeg"
              alt="Flota de buses Saldivia en planta"
              priority
            />
          }
        >
          <HeroStagger>
            <span className={PAGE_HERO_EYEBROW_CLASS}>Catálogo de productos</span>
            <h1 className={PAGE_HERO_TITLE_CLASS}>
              Nuestros
              <br />
              <span className={PAGE_HERO_ACCENT_CLASS}>modelos</span>
            </h1>
            <p className={PAGE_HERO_LEAD_CLASS}>
              Todas las unidades del catálogo Saldivia en un solo lugar, con la precisión industrial y el estándar de
              calidad de cada carrocería.
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-200 sm:mt-4">
                No pudimos cargar el catálogo en este momento. Intente más tarde.
              </p>
            )}
          </HeroStagger>
        </PageHero>

        <FlotaGrid models={models} />

        {!error && models.length === 0 && (
          <FadeUp>
            <section className="py-20 text-center text-on-surface-variant">
              <p className="text-sm">
                El catálogo se encuentra en actualización. Consulte nuevamente más tarde.
              </p>
              <Link
                href="/dashboard"
                className={buttonClass({
                  variant: "link-cta",
                  size: "sm",
                  className: "mt-4",
                })}
              >
                Ir al panel
              </Link>
            </section>
          </FadeUp>
        )}
      </main>
    </div>
  );
}
