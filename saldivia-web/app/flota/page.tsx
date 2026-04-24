import type { Model } from "@/types/model";
import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { buttonClass } from "../components/ui/Button";
import { CATALOG_IMG, FLEET_SEGMENTS, type FleetSegment } from "../data/flota-catalog";
import { FlotaChips } from "./FlotaChips";

type FlotaModel = Pick<Model, "slug" | "name" | "description" | "cover_image_url">;

function ModelCard({
  model,
  aspect,
}: {
  model: FlotaModel;
  aspect: "video" | "square";
}) {
  const href = `/producto/${model.slug}`;
  const src = model.cover_image_url ?? CATALOG_IMG;
  const aspectClass = aspect === "video" ? "aspect-[16/9]" : "aspect-square md:aspect-[4/5]";

  return (
    <a
      href={href}
      className="ui-surface-card group relative flex flex-col overflow-hidden rounded-curve-md hover:border-accent-blue/45 hover:shadow-elev-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
    >
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-surface-container-high`}>
        <img
          alt=""
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-[0.55]"
          src={src}
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent px-5 pb-4 pt-20 transition-all duration-500 group-hover:translate-y-4 group-hover:opacity-0">
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-container">
            {model.name}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(32, 149, 212, 0.42) 0%, rgba(13, 44, 79, 0.55) 45%, rgba(0, 23, 50, 0.92) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-primary/25 backdrop-blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute inset-4 md:inset-6">
            <div className="absolute left-0 top-0 h-11 w-11 origin-top-left scale-75 border-l-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute right-0 top-0 h-11 w-11 origin-top-right scale-75 border-r-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 h-11 w-11 origin-bottom-left scale-75 border-b-[3px] border-l-[3px] border-accent-blue opacity-0 transition-all delay-150 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 right-0 h-11 w-11 origin-bottom-right scale-75 border-b-[3px] border-r-[3px] border-accent-blue opacity-0 transition-all delay-200 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute left-1/2 top-1/2 h-px w-[min(72%,220px)] -translate-x-1/2 -translate-y-[3.25rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            <div className="absolute left-1/2 top-1/2 h-px w-[min(72%,220px)] -translate-x-1/2 translate-y-[3.25rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </div>

          <div className="relative z-10 mx-auto max-w-md translate-y-5 px-6 text-center opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="font-headline text-2xl font-black uppercase leading-tight tracking-tighter text-white drop-shadow-md md:text-3xl">
              {model.name}
            </h3>
            <p className="mt-4 font-headline text-sm font-medium leading-relaxed text-white/90 md:text-[0.95rem]">
              {model.description ?? ""}
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-2 font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-accent-blue">
              <span className="h-px w-6 bg-accent-blue/80" />
              Ver modelo
              <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
              <span className="h-px w-6 bg-accent-blue/80" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function SegmentSection({
  eyebrow,
  title,
  intro,
  variant,
  columns,
  aspect,
  models,
  id,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  variant: "surface" | "muted";
  columns: "2" | "3";
  aspect: "video" | "square";
  models: FlotaModel[];
  id: string;
}) {
  if (models.length === 0) return null;

  const bg = variant === "muted" ? "bg-surface-container-low" : "bg-surface";

  const grid =
    columns === "3"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <header className="mb-12 md:mb-16">
          <span className="ui-section-eyebrow">{eyebrow}</span>
          <h2 className="ui-section-title md:text-4xl">{title}</h2>
          <div className="technical-gradient mt-4 h-1 w-20" />
          <p className="ui-section-intro">{intro}</p>
        </header>
        <div className={`grid ${grid} gap-6 md:gap-8`}>
          {models.map((m) => (
            <ModelCard key={m.slug} model={m} aspect={aspect} />
          ))}
        </div>
      </div>
    </section>
  );
}

type SearchParams = { segment?: string | string[] };

export default async function FlotaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const raw = sp.segment;
  const segmentParam = (Array.isArray(raw) ? raw[0] : raw) ?? null;
  const activeSegment = segmentParam && FLEET_SEGMENTS.some((s) => s.id === segmentParam) ? segmentParam : null;

  const supabase = await createClient();
  const { data: allModels, error } = await getModels(supabase, {});

  const byId = new Map<string, FlotaModel[]>();
  for (const s of FLEET_SEGMENTS) {
    byId.set(s.id, []);
  }
  if (!error && allModels) {
    for (const m of allModels) {
      if (!FLEET_SEGMENTS.some((s) => s.id === m.segment)) continue;
      if (activeSegment && m.segment !== activeSegment) continue;
      byId.get(m.segment)!.push({
        slug: m.slug,
        name: m.name,
        description: m.description,
        cover_image_url: m.cover_image_url,
      });
    }
  }

  const segmentsToRender: FleetSegment[] = activeSegment
    ? FLEET_SEGMENTS.filter((s) => s.id === activeSegment)
    : FLEET_SEGMENTS;

  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <main>
        <section className="relative flex min-h-[420px] items-center overflow-hidden asymmetric-gradient pt-16 md:min-h-[480px]">
          <div className="pointer-events-none absolute inset-0 industrial-grid-light opacity-[0.12]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
            <span className="mb-4 block font-headline text-xs font-bold uppercase tracking-[0.3em] text-secondary-container">
              Catálogo de productos
            </span>
            <h1 className="max-w-4xl font-headline text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white md:text-6xl lg:text-7xl">
              Arquitectura
              <br />
              <span className="text-secondary-container">de flota</span>
            </h1>
            <p className="mt-8 max-w-2xl font-headline text-base font-medium leading-relaxed text-on-primary-container md:text-lg">
              Soluciones de transporte para entorno urbano, interurbano y larga distancia, con la precisión
              industrial y el estándar de calidad Saldivia en cada carrocería.
            </p>
            {error && (
              <p className="mt-6 text-sm text-red-200">
                No pudimos cargar el catálogo. Configurá Supabase o revisá la consola.
              </p>
            )}
            <FlotaChips activeSegment={activeSegment} />
          </div>
        </section>

        {segmentsToRender.map((seg) => {
          const list = (byId.get(seg.id) ?? []) as FlotaModel[];
          return (
            <SegmentSection
              key={seg.id}
              id={seg.id}
              eyebrow={seg.eyebrow}
              title={seg.title}
              intro={seg.intro}
              variant={seg.variant}
              columns={seg.columns}
              aspect={seg.aspect}
              models={list}
            />
          );
        })}

        {!error && allModels && allModels.length === 0 && (
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
        )}
      </main>
    </div>
  );
}
