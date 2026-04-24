import { getAllModelsForAdmin } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import { ModelsAdmin } from "./ModelsAdmin";

export default async function DashboardModelsPage() {
  const supabase = await createClient();
  const { data, error } = await getAllModelsForAdmin(supabase);
  if (error || !data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar el catálogo. Revisá la sesión y RLS: {error?.message}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Modelos y fichas</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Alta, baja y edición de unidades. Las especificaciones técnicas detalladas (tabla products) se pueden
        completar vía panel SQL o ampliar este formulario en una iteración.
      </p>
      <div className="mt-8">
        <ModelsAdmin initial={data} />
      </div>
    </main>
  );
}
