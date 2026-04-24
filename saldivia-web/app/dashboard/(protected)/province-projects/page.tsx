import argentinaProvinceMapData from "@/app/components/argentinaProvinceMapData.json";
import { createClient } from "@/lib/supabase/server";
import { getAllProvinceProjectsForAdmin } from "@/lib/supabase/province-projects";
import { ProvinceProjectsAdmin } from "./ProvinceProjectsAdmin";

const mapData = argentinaProvinceMapData as {
  provinces: { id: string; name: string }[];
};

export default async function DashboardProvinceProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await getAllProvinceProjectsForAdmin(supabase);
  const provinceOptions = mapData.provinces.map((p) => ({ id: p.id, name: p.name }));

  if (error || !data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar proyectos por provincia.{" "}
        {error?.message ?? "¿Migración 005 aplicada?"}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Proyectos (mapa Argentina)</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Cada fila aparece en la provincia correspondiente del mapa de inicio. Desactivar oculta el proyecto en el
        sitio público.
      </p>
      <div className="mt-8">
        <ProvinceProjectsAdmin initial={data} provinceOptions={provinceOptions} />
      </div>
    </main>
  );
}
