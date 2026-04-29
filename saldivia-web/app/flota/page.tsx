import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "../components/ui/Button";
import { FLEET_SEGMENTS } from "../data/flota-catalog";
import { FlotaGrid } from "./FlotaGrid";
import { FadeUp, HeroStagger } from "../components/motion";

import type { Model } from "@/types/model";

type FlotaModel = Pick<Model, "slug" | "name" | "description" | "cover_image_url">;

type SearchParams = { segment?: string | string[] };

export default async function FlotaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const raw = sp.segment;
  const segmentParam = (Array.isArray(raw) ? raw[0] : raw) ?? null;
  const activeSegment = segmentParam && FLEET_SEGMENTS.some((s) => s.id === segmentParam) ? segmentParam : null;

  const supabase = await createClient();
  const { data: allModels, error } = await getModels(supabase, {});

  const models: FlotaModel[] = [];
  if (!error && allModels) {
    for (const m of allModels) {
      if (!FLEET_SEGMENTS.some((s) => s.id === m.segment)) continue;
      if (activeSegment && m.segment !== activeSegment) continue;
      models.push({
        slug: m.slug,
        name: m.name,
        description: m.description,
        cover_image_url: m.cover_image_url,
      });
    }
  }

  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <main>
        <section className="relative flex min-h-[min(100svh,520px)] items-center overflow-hidden pt-20 pb-12 sm:min-h-[420px] sm:pt-16 sm:pb-0 md:min-h-[480px]">
          <Image
            src="/hero-buses.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-black/60" />
          <div className="pointer-events-none absolute inset-0 industrial-grid-light opacity-[0.08]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8">
            <HeroStagger>
              <span className="mb-4 block font-headline text-xs font-bold uppercase tracking-[0.3em] text-secondary-container">
                Catálogo de productos
              </span>
              <h1 className="max-w-4xl font-headline text-3xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-6xl lg:text-7xl">
                Arquitectura
                <br />
                <span className="text-secondary-container">de flota</span>
              </h1>
              <p className="mt-0 max-w-2xl font-headline text-sm font-medium leading-relaxed text-on-primary-container sm:mt-2 sm:text-base md:text-lg">
                Soluciones de transporte para entorno urbano, interurbano y larga distancia, con la precisión
                industrial y el estándar de calidad Saldivia en cada carrocería.
              </p>
              {error && (
                <p className="mt-2 text-sm text-red-200 sm:mt-4">
                  No pudimos cargar el catálogo. Configurá Supabase o revisá la consola.
                </p>
              )}
            </HeroStagger>
          </div>
        </section>

        <FlotaGrid models={models} />

        {!error && models.length === 0 && (
          <FadeUp>
            <section className="py-20 text-center text-on-surface-variant">
              <p className="text-sm">
                Aún no hay modelos en la base. Cargá el seed SQL o usá el dashboard para publicar unidades.
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
