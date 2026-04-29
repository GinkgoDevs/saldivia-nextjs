import { getHomeShowcaseSlidesForAdmin } from "@/lib/supabase/home-showcase";
import { getAllModelsForAdmin } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";

import { HomeShowcaseAdmin } from "./HomeShowcaseAdmin";

export default async function DashboardHomeShowcasePage() {
  const supabase = await createClient();
  const [slidesRes, modelsRes] = await Promise.all([
    getHomeShowcaseSlidesForAdmin(supabase),
    getAllModelsForAdmin(supabase),
  ]);

  if (slidesRes.error || !slidesRes.data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar el showcase: {slidesRes.error?.message}
      </main>
    );
  }

  if (modelsRes.error || !modelsRes.data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar modelos: {modelsRes.error?.message}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Showcase del home</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Carrusel &quot;Showcase técnico&quot;: cada slide está vinculado a un modelo. Las dos filas de especificaciones
        salen de la ficha (tabla <code className="text-xs">products</code>) del modelo; podés personalizar imagen,
        rubro, texto y cajas de métricas.
      </p>
      <div className="mt-8">
        <HomeShowcaseAdmin initialSlides={slidesRes.data} models={modelsRes.data} />
      </div>
    </main>
  );
}
