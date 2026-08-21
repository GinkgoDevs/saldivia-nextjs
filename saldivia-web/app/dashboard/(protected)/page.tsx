import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 font-headline text-on-surface md:px-8 md:py-14">
      <header className="mb-10 border-b border-outline-variant/40 pb-8">
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-secondary">Panel</span>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-primary md:text-4xl">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm text-on-surface-variant md:text-base">
          Gestioná modelos, el carrusel del inicio, showcase, imágenes y el mapa de proyectos. Los cambios se reflejan
          en el sitio según caché y publicación.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/models"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">inventory_2</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Modelos y catálogo</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Alta, edición, portada, hero por ficha de producto y PDF.
          </p>
        </Link>
        <Link
          href="/dashboard/model-images"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">photo_library</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Imágenes de modelos</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Galería de imágenes por modelo: subir, ordenar y eliminar.</p>
        </Link>
        <Link
          href="/dashboard/home-hero"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">view_carousel</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Hero del inicio</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Carrusel principal del home: imágenes, títulos, textos y botones de cada slide.
          </p>
        </Link>
        <Link
          href="/dashboard/home-showcase"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">slideshow</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Showcase del inicio</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Bloque técnico del home: slides con imagen, título y descripción.
          </p>
        </Link>
        <Link
          href="/dashboard/home-gallery"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">photo_library</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Galería del inicio</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Galería de innovación: subir, ordenar, activar o quitar fotos del carrusel.
          </p>
        </Link>
        <Link
          href="/dashboard/quality-policy"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">picture_as_pdf</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Política de calidad</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            PDF descargable en Nosotros: subir o reemplazar cuando lo actualicen.
          </p>
        </Link>
        <Link
          href="/dashboard/locations"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">map</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Ubicaciones del mapa</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Talleres, distribuidores y concesionarios con coordenadas.</p>
        </Link>
        <Link
          href="/dashboard/province-projects"
          className="ui-surface-card block cursor-pointer p-8 transition hover:border-secondary-container/40"
        >
          <span className="material-symbols-outlined text-3xl text-secondary">public</span>
          <h2 className="mt-3 text-lg font-bold text-primary">Mapa por provincia</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Proyectos y fotos del mapa interactivo de Argentina.
          </p>
        </Link>
      </div>
    </main>
  );
}
