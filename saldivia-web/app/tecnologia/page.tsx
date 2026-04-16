const PILARES = [
  {
    icon: "architecture",
    title: "Ingeniería estructural",
    body:
      "Chasis, carrocería y cálculos orientados a seguridad, peso y vida útil. Contenido detallado en preparación.",
  },
  {
    icon: "electric_bolt",
    title: "Sistemas y eficiencia",
    body:
      "Integración eléctrica, climatización y soluciones para reducir consumo. Sección en construcción con datos de producto.",
  },
  {
    icon: "shield_lock",
    title: "Seguridad activa y pasiva",
    body:
      "Asistencias al conductor, visibilidad y cumplimiento normativo. Próximos releases con fichas técnicas descargables.",
  },
] as const;

export default function TecnologiaPage() {
  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <main>
        <section className="relative flex min-h-[420px] items-center overflow-hidden asymmetric-gradient pt-16 md:min-h-[480px]">
          <div className="pointer-events-none absolute inset-0 industrial-grid-light opacity-[0.12]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-secondary-container">
              Línea tecnológica
            </span>
            <h1 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white md:text-6xl lg:text-7xl">
              Precisión
              <br />
              <span className="text-secondary-container">en cada sistema</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-on-primary-container md:text-lg">
              Pilares de diseño, manufactura y validación que definen cada unidad Saldivia. Esta página es un
              esqueleto editorial: aquí se publicarán whitepapers, fichas y recorridos técnicos.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              <span className="material-symbols-outlined text-base text-accent-blue">progress_activity</span>
              Contenido en desarrollo
            </p>
          </div>
        </section>

        <section className="border-t border-outline-variant/30 bg-surface-container-low py-20 md:py-24">
          <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
            <header className="mb-12 md:mb-16">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-secondary">
                Esqueleto de secciones
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-primary md:text-4xl">
                Tres ejes de la plataforma
              </h2>
              <div className="technical-gradient mt-4 h-1 w-20" />
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
                Las tarjetas siguientes reservan espacio visual y jerarquía para cuando el equipo de ingeniería
                cargue narrativas, diagramas y especificaciones.
              </p>
            </header>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {PILARES.map((p) => (
                <article
                  key={p.title}
                  className="flex flex-col border border-outline-variant/35 bg-surface-container-lowest p-8 shadow-[0px_12px_32px_rgba(13,44,79,0.08)] transition-colors duration-200 hover:border-accent-blue/35"
                >
                  <span className="material-symbols-outlined mb-5 text-4xl text-secondary">{p.icon}</span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-primary">{p.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-on-surface-variant">{p.body}</p>
                  <div className="mt-6 h-1 w-full bg-surface-container-high" aria-hidden />
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                    Placeholder de contenido
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 text-on-primary md:py-20">
          <div className="mx-auto flex max-w-screen-2xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white md:text-3xl">
                Próximo: biblioteca técnica
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-primary-container">
                PDFs, esquemas y datos de homologación se enlazarán desde este bloque tipo CTA.
              </p>
            </div>
            <span className="inline-flex cursor-default items-center gap-2 border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/80">
              <span className="material-symbols-outlined text-lg">lock</span>
              Acceso restringido (mock)
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
