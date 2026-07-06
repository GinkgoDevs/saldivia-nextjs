import { getHomeShowcaseSlidesForAdmin } from "@/lib/supabase/home-showcase";
import { createClient } from "@/lib/supabase/server";

import { HomeShowcaseAdmin } from "./HomeShowcaseAdmin";

export default async function DashboardHomeShowcasePage() {
  const supabase = await createClient();
  const slidesRes = await getHomeShowcaseSlidesForAdmin(supabase);

  if (slidesRes.error || !slidesRes.data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar el showcase: {slidesRes.error?.message}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Showcase del home</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Los modelos aparecen aquí cuando los marcás con «Mostrar en el Showcase técnico del home» en{" "}
        <strong>Catálogo → Modelos</strong>. Desde esta pantalla podés subir una imagen exclusiva del showcase,
        personalizar textos y métricas. Las especificaciones técnicas salen de la ficha del modelo.
      </p>
      <div className="mt-8">
        <HomeShowcaseAdmin initialSlides={slidesRes.data} />
      </div>
    </main>
  );
}
