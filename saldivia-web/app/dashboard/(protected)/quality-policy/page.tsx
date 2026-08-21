import { getQualityPolicyForAdmin } from "@/lib/supabase/quality-policy";
import { createClient } from "@/lib/supabase/server";

import { QualityPolicyAdmin } from "./QualityPolicyAdmin";

export default async function DashboardQualityPolicyPage() {
  const supabase = await createClient();
  const { data, error } = await getQualityPolicyForAdmin(supabase);

  if (error || !data) {
    return (
      <main className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-on-surface-variant md:px-8">
        No se pudo cargar la política de calidad: {error?.message}
        <p className="mt-2 text-xs">
          Verificá que se haya ejecutado la migración{" "}
          <code className="text-xs">018_quality_policy.sql</code> en Supabase.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8 md:py-12">
      <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Política de calidad</h1>
      <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
        PDF que se descarga desde la sección de calidad en <strong>Nosotros</strong>. Cuando el cliente actualice el
        documento, subí el nuevo archivo acá y guardá: el sitio lo toma automáticamente.
      </p>
      <div className="mt-8">
        <QualityPolicyAdmin initial={data} />
      </div>
    </main>
  );
}
