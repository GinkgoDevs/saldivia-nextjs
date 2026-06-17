import ArgentinaProjectsMapClient from "./ArgentinaProjectsMapClient";
import { createClient } from "@/lib/supabase/server";
import { getActiveLocationsForHomeMap } from "@/lib/supabase/locations";
import {
  getActiveProvinceProjects,
  mergeProjectsAndLocations,
} from "@/lib/supabase/province-projects";

/** Mapa del home: proyectos por provincia (`province_projects`) + ubicaciones activas (`locations`). */
export default async function ArgentinaProjectsMap() {
  const supabase = await createClient();
  const [ppRes, locRes] = await Promise.all([
    getActiveProvinceProjects(supabase),
    getActiveLocationsForHomeMap(supabase),
  ]);

  const byProvince =
    ppRes.error && locRes.error
      ? {}
      : mergeProjectsAndLocations(ppRes.data ?? [], locRes.data ?? []);

  const hasData = Object.values(byProvince).some((arr) => (arr?.length ?? 0) > 0);
  const fetchError = !hasData ? (ppRes.error ?? locRes.error) : null;

  return (
    <ArgentinaProjectsMapClient byProvince={byProvince} fetchError={fetchError} />
  );
}
