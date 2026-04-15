import {
  CATALOG_IMG,
  FLEET_SEGMENTS,
  FLEET_SPECIALS_SECTION_ID,
  SPECIAL_MODELS,
  type FleetModel,
} from "../data/flota-catalog";

function ModelCard({
  model,
  aspect,
}: {
  model: FleetModel;
  aspect: "video" | "square";
}) {
  const src = model.image ?? CATALOG_IMG;
  const aspectClass = aspect === "video" ? "aspect-[16/9]" : "aspect-square md:aspect-[4/5]";

  return (
    <a
      href={model.href}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-outline-variant/35 bg-surface-container-lowest shadow-[0px_12px_32px_rgba(13,44,79,0.08)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent-blue/45 hover:shadow-[0px_24px_56px_rgba(13,44,79,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
    >
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-surface-container-high`}>
        <img
          alt=""
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-[0.55]"
          src={src}
        />

        {/* Estado reposo: nombre en franja */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent px-5 pb-4 pt-20 transition-all duration-500 group-hover:translate-y-4 group-hover:opacity-0">
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-container">
            {model.name}
          </p>
        </div>

        {/* Capa hover: brillo marca + marco + centro */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {/* Resplandor celeste / azul marca */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(32, 149, 212, 0.42) 0%, rgba(13, 44, 79, 0.55) 45%, rgba(0, 23, 50, 0.92) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-primary/25 backdrop-blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />

          {/* Marco esquinas — gráfico de marca */}
          <div className="absolute inset-4 md:inset-6">
            <div className="absolute left-0 top-0 h-11 w-11 origin-top-left scale-75 border-l-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute right-0 top-0 h-11 w-11 origin-top-right scale-75 border-r-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 h-11 w-11 origin-bottom-left scale-75 border-b-[3px] border-l-[3px] border-accent-blue opacity-0 transition-all delay-150 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 right-0 h-11 w-11 origin-bottom-right scale-75 border-b-[3px] border-r-[3px] border-accent-blue opacity-0 transition-all delay-200 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            {/* Líneas horizontales tipo “ingeniería” */}
            <div className="absolute left-1/2 top-1/2 h-px w-[min(72%,220px)] -translate-x-1/2 -translate-y-[3.25rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            <div className="absolute left-1/2 top-1/2 h-px w-[min(72%,220px)] -translate-x-1/2 translate-y-[3.25rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </div>

          {/* Texto centrado */}
          <div className="relative z-10 mx-auto max-w-md translate-y-5 px-6 text-center opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="font-headline text-2xl font-black uppercase leading-tight tracking-tighter text-white drop-shadow-md md:text-3xl">
              {model.name}
            </h3>
            <p className="mt-4 font-headline text-sm font-medium leading-relaxed text-white/90 md:text-[0.95rem]">
              {model.description}
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
  models: FleetModel[];
  id: string;
}) {
  const bg = variant === "muted" ? "bg-surface-container-low" : "bg-surface";

  const grid =
    columns === "3"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  const heading = (
    <>
      <span className="mb-3 block font-headline text-xs font-bold uppercase tracking-[0.25em] text-secondary">
        {eyebrow}
      </span>
      <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-primary md:text-4xl">
        {title}
      </h2>
      <div className="technical-gradient mt-4 h-1 w-20" />
      <p className="mt-6 max-w-2xl font-headline text-sm leading-relaxed text-on-surface-variant md:text-base">
        {intro}
      </p>
    </>
  );

  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <header className="mb-12 md:mb-16">{heading}</header>
        <div className={`grid ${grid} gap-6 md:gap-8`}>
          {models.map((model) => (
            <ModelCard key={model.name} model={model} aspect={aspect} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialCard({ model }: { model: (typeof SPECIAL_MODELS)[number] }) {
  const src = model.image ?? CATALOG_IMG;
  return (
    <a
      href={model.href}
      className="group relative block overflow-hidden rounded-sm border border-white/15 bg-primary-darker/40 shadow-[0px_20px_48px_rgba(0,0,0,0.25)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
    >
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <img
          alt=""
          className="h-full w-full object-cover opacity-60 transition-[transform,filter,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-40 group-hover:brightness-[0.65]"
          src={src}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30 opacity-95 transition-opacity duration-500 group-hover:opacity-0" />

        {/* Reposo: título abajo a la izquierda */}
        <div className="absolute inset-x-0 bottom-0 z-[5] p-6 transition-all duration-500 group-hover:translate-y-6 group-hover:opacity-0 md:p-10">
          <span className="mb-2 block font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-accent-blue">
            {model.label}
          </span>
          <h3 className="font-headline text-2xl font-black uppercase tracking-tighter text-white md:text-4xl">
            {model.name}
          </h3>
        </div>

        {/* Hover: mismo lenguaje gráfico que ModelCard */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 90% 75% at 50% 50%, rgba(32, 149, 212, 0.38) 0%, rgba(13, 44, 79, 0.65) 50%, rgba(0, 23, 50, 0.95) 100%)",
            }}
          />
          <div className="absolute inset-5 md:inset-8">
            <div className="absolute left-0 top-0 h-12 w-12 origin-top-left scale-75 border-l-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute right-0 top-0 h-12 w-12 origin-top-right scale-75 border-r-[3px] border-t-[3px] border-accent-blue opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 h-12 w-12 origin-bottom-left scale-75 border-b-[3px] border-l-[3px] border-accent-blue opacity-0 transition-all delay-150 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute bottom-0 right-0 h-12 w-12 origin-bottom-right scale-75 border-b-[3px] border-r-[3px] border-accent-blue opacity-0 transition-all delay-200 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
            <div className="absolute left-1/2 top-1/2 h-px w-[min(65%,280px)] -translate-x-1/2 -translate-y-[3.5rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            <div className="absolute left-1/2 top-1/2 h-px w-[min(65%,280px)] -translate-x-1/2 translate-y-[3.5rem] scale-x-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </div>
          <div className="relative z-10 mx-auto max-w-lg translate-y-5 px-6 text-center opacity-0 transition-all delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <p className="mb-2 font-headline text-[10px] font-bold uppercase tracking-[0.3em] text-accent-blue">{model.label}</p>
            <h3 className="font-headline text-2xl font-black uppercase tracking-tighter text-white md:text-4xl">
              {model.name}
            </h3>
            <p className="mt-4 font-headline text-sm font-medium leading-relaxed text-white/90 md:text-base">
              {model.description}
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-2 font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-accent-blue">
              <span className="h-px w-6 bg-accent-blue/80" />
              Conocer más
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
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

export default function FlotaPage() {
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
            <div className="mt-10 flex flex-wrap gap-3">
              {FLEET_SEGMENTS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center border border-white/25 bg-white/5 px-4 py-2 font-headline text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:border-secondary-container/60 hover:bg-white/10"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {FLEET_SEGMENTS.map((seg) => (
          <SegmentSection
            key={seg.id}
            id={seg.id}
            eyebrow={seg.eyebrow}
            title={seg.title}
            intro={seg.intro}
            variant={seg.variant}
            columns={seg.columns}
            aspect={seg.aspect}
            models={seg.models}
          />
        ))}

        <section id={FLEET_SPECIALS_SECTION_ID} className="scroll-mt-24 bg-primary py-20 md:py-28">
          <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
            <header className="mb-12 md:mb-16">
              <span className="mb-3 block font-headline text-xs font-bold uppercase tracking-[0.25em] text-secondary-container">
                Aplicaciones a medida
              </span>
              <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-white md:text-4xl">
                Segmento especiales
              </h2>
              <div className="mt-4 h-1 w-20 bg-white/20" />
              <p className="mt-6 max-w-2xl font-headline text-sm leading-relaxed text-on-primary-container md:text-base">
                Proyectos y derivados para logística, servicios industriales y requerimientos fuera de serie.
              </p>
            </header>
            <div className="flex flex-col gap-6 md:gap-8">
              {SPECIAL_MODELS.map((m) => (
                <SpecialCard key={m.name} model={m} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
