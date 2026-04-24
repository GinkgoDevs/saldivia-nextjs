import Link from "next/link";
import { buttonClass } from "@/app/components/ui/Button";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 font-headline text-on-surface md:px-8 md:py-14">
      <header className="mb-10 border-b border-outline-variant/40 pb-8">
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-secondary">Panel</span>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-primary md:text-4xl">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm text-on-surface-variant md:text-base">
          Gestioná modelos, fichas (URLs de imagen y PDF) y la red de puntos del mapa. Los cambios se reflejan en el
          sitio según caché y publicación.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/models"
          className="ui-surface-card block p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">inventory_2</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Modelos y catálogo</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Alta, edición, activar/desactivar y subida a Storage.</p>
        </Link>
        <Link
          href="/dashboard/locations"
          className="ui-surface-card block p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">map</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Ubicaciones del mapa</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Talleres, distribuidores y concesionarios con coordenadas.</p>
        </Link>
      </div>
      <p className="mt-10 text-sm text-on-surface-variant">
        <Link
          className={buttonClass({ variant: "link-cta", size: "sm", className: "px-0 py-0" })}
          href="/"
        >
          Volver al sitio
        </Link>
      </p>
    </main>
  );
}
