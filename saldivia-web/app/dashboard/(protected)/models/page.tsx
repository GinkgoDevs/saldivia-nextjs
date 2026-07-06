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
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-on-surface-variant">
          Arrastrá para reordenar. Usá <strong>Editar</strong> para modificar cada colectivo o{" "}
          <strong>Nuevo modelo</strong> para dar de alta uno.
        </p>
      </div>
      <div className="mt-4">
        <ModelsAdmin initial={data} />
      </div>
    </main>
  );
}
