import { getAllModelsForAdmin } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import type { ModelImage } from "@/types/model";
import { DashboardBackLink } from "../DashboardBackLink";
import { ModelImagesAdmin } from "./ModelImagesAdmin";

export default async function DashboardModelImagesPage() {
  const supabase = await createClient();
  const [modelsRes, imagesRes] = await Promise.all([
    getAllModelsForAdmin(supabase),
    supabase
      .from("model_images")
      .select("id, model_id, image_url, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  if (modelsRes.error || !modelsRes.data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        <DashboardBackLink />
        No se pudo cargar los modelos: {modelsRes.error?.message}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <DashboardBackLink />
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Imágenes de modelos</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Galería de imágenes por modelo (tabla <code className="text-xs">model_images</code>). Estas imágenes
        aparecen en el carrusel de la ficha de cada producto.
      </p>
      <div className="mt-8">
        <ModelImagesAdmin
          models={modelsRes.data}
          initialImages={(imagesRes.data ?? []) as ModelImage[]}
        />
      </div>
    </main>
  );
}
