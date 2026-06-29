import ArgentinaProjectsMapClient from "./ArgentinaProjectsMapClient";
import { createClient } from "@/lib/supabase/server";
import { getActiveProvinceProjects, groupByProvince } from "@/lib/supabase/province-projects";

/** Mapa del home: solo proyectos con imagen (`province_projects`). */
export default async function ArgentinaProjectsMap() {
  const supabase = await createClient();
  const ppRes = await getActiveProvinceProjects(supabase);

  const rows = (ppRes.data ?? []).filter((r) => Boolean(r.image_url?.trim()));
  const byProvince = ppRes.error ? {} : groupByProvince(rows);

  const hasData = Object.values(byProvince).some((arr) => (arr?.length ?? 0) > 0);
  const fetchError = !hasData ? ppRes.error : null;

  return (
    <ArgentinaProjectsMapClient byProvince={byProvince} fetchError={fetchError} />
  );
}
