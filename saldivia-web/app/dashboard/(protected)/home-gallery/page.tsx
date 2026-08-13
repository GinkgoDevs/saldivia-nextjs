import { getHomeGallerySlidesForAdmin } from "@/lib/supabase/home-gallery";
import { createClient } from "@/lib/supabase/server";

import { HomeGalleryAdmin } from "./HomeGalleryAdmin";

export default async function DashboardHomeGalleryPage() {
  const supabase = await createClient();
  const { data, error } = await getHomeGallerySlidesForAdmin(supabase);

  if (error || !data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar la galería: {error?.message}
        <p className="mt-2 text-xs">
          Verificá que se haya ejecutado la migración{" "}
          <code className="text-xs">017_home_gallery_slides.sql</code> en Supabase.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Galería del home</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Fotos de la Galería de innovación en la página de inicio. Subí, reordená o desactivá imágenes. El orden se
        controla arrastrando el asa. Si no hay ninguna imagen activa, la sección no se muestra en el sitio.
      </p>
      <div className="mt-8">
        <HomeGalleryAdmin initialSlides={data} />
      </div>
    </main>
  );
}
