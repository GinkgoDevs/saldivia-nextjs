import { getAllModelsForAdmin } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import { DashboardBackLink } from "../DashboardBackLink";
import { ModelsAdmin } from "./ModelsAdmin";

export default async function DashboardModelsPage() {
  const supabase = await createClient();
  const { data, error } = await getAllModelsForAdmin(supabase);
  if (error || !data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        <DashboardBackLink />
        No se pudo cargar el catálogo. Revisá la sesión y RLS: {error?.message}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <DashboardBackLink />
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Modelos y fichas</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Alta, baja y edición de unidades. Podés cargar la tabla de especificaciones técnicas y el listado de características
        generales que se muestran en <code className="text-xs">/producto/[slug]</code>. Para poblar en bloque desde el
        catálogo documentado, usá el script <code className="text-xs">supabase/scripts/cargar_catalogo_modelos.sql</code>{" "}
        en el SQL Editor de Supabase (luego de aplicar la migración{" "}
        <code className="text-xs">009_model_general_features.sql</code>).
      </p>
      <div className="mt-8">
        <ModelsAdmin initial={data} />
      </div>
    </main>
  );
}
