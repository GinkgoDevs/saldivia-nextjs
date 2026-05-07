import ArgentinaProjectsMapClient from "./ArgentinaProjectsMapClient";
import { createClient } from "@/lib/supabase/server";
import { getActiveLocationsForHomeMap } from "@/lib/supabase/locations";
import { mergeProjectsAndLocations } from "@/lib/supabase/province-projects";

/** Mapa del home: solo ubicaciones activas (`locations`), agrupadas por slug de provincia del SVG. */
export default async function ArgentinaProjectsMap() {
  const supabase = await createClient();
  const locRes = await getActiveLocationsForHomeMap(supabase);

  const byProvince = locRes.error ? {} : mergeProjectsAndLocations([], locRes.data ?? []);

  const hasData = Object.values(byProvince).some((arr) => (arr?.length ?? 0) > 0);
  const fetchError = !hasData ? locRes.error : null;

  return (
    <ArgentinaProjectsMapClient byProvince={byProvince} fetchError={fetchError} />
  );
}
