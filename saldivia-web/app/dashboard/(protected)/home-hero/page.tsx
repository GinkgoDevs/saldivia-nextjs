import { getHomeHeroSlidesForAdmin } from "@/lib/supabase/home-hero";
import { createClient } from "@/lib/supabase/server";

import { HomeHeroAdmin } from "./HomeHeroAdmin";

export default async function DashboardHomeHeroPage() {
  const supabase = await createClient();
  const { data, error } = await getHomeHeroSlidesForAdmin(supabase);

  if (error || !data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar el hero: {error?.message}
        <p className="mt-2 text-xs">
          Verificá que se haya ejecutado la migración{" "}
          <code className="text-xs">014_home_hero_slides.sql</code> en Supabase.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Hero del home</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Slides del carrusel principal de la página de inicio. Cada slide tiene imagen de fondo, textos y dos botones
        (con su texto y adónde llevan). El orden se controla con las flechas. Si no hay ninguna slide activa, el sitio
        usa un contenido por defecto.
      </p>
      <div className="mt-8">
        <HomeHeroAdmin initialSlides={data} />
      </div>
    </main>
  );
}
