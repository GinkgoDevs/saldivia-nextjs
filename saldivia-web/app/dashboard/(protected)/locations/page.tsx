import { getAllLocationsForAdmin } from "@/lib/supabase/locations";
import { createClient } from "@/lib/supabase/server";
import { LocationsAdmin } from "./LocationsAdmin";

export default async function DashboardLocationsPage() {
  const supabase = await createClient();
  const { data, error } = await getAllLocationsForAdmin(supabase);
  if (error || !data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar ubicaciones. {error?.message}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Proyectos destacados (mapa del inicio)</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        Cada fila se agrupa por provincia en el mapa SVG de la home. Elegí la provincia del listado (slug del
        mapa). Inactivo oculta el punto público sin borrarlo. La red Leaflet u otros usos pueden seguir usando
        coordenadas cuando las agregues.
      </p>
      <div className="mt-8">
        <LocationsAdmin initial={data} />
      </div>
    </main>
  );
}
