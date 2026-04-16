export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-14">
        <header className="mb-10 border-b border-outline-variant/40 pb-8">
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-secondary">
            Área autenticada
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-primary md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
            Estructura base del panel: métricas, accesos rápidos y gestión de contenido se integrarán
            aquí. Esta vista es un esqueleto funcional mientras se define el alcance del producto.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-sm border border-outline-variant/35 bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(13,44,79,0.06)] lg:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
              Actividad reciente
            </h2>
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="flex gap-4 border-b border-outline-variant/25 pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-12 w-12 shrink-0 rounded-sm bg-surface-container-high" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-2/3 max-w-xs rounded-sm bg-surface-container-high" />
                    <div className="h-3 w-full max-w-md rounded-sm bg-surface-container-high/80" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-sm border border-outline-variant/35 bg-surface-container-low p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                Accesos
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">dashboard</span>
                  Resumen (próximamente)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">inventory_2</span>
                  Catálogo (próximamente)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">group</span>
                  Usuarios (próximamente)
                </li>
              </ul>
            </section>
            <section className="rounded-sm border border-dashed border-outline-variant/60 bg-surface-container-low/50 p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Sesión activa
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Cerrar sesión y preferencias se conectarán al flujo de Supabase Auth.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
