import type { SupabaseClient } from "@supabase/supabase-js";

import type { ProvinceProjectRow } from "@/types/province-project";

/** Tipo usado por el mapa SVG (ArgentinaProjectsMap) */
export type ProvinceProjectCard = {
  title: string;
  location: string;
  description: string;
  segment: string;
  year: string;
};

export function groupByProvince(
  rows: ProvinceProjectRow[],
): Partial<Record<string, ProvinceProjectCard[]>> {
  const out: Partial<Record<string, ProvinceProjectCard[]>> = {};
  const sorted = [...rows].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.title.localeCompare(b.title),
  );
  for (const r of sorted) {
    const slug = r.province_slug.trim().toLowerCase();
    if (!slug) continue;
    if (!out[slug]) out[slug] = [];
    out[slug]!.push({
      title: r.title,
      location: r.location_label?.trim() || "—",
      description: r.description?.trim() || "",
      segment: r.segment?.trim() || "—",
      year: r.year?.trim() || "—",
    });
  }
  return out;
}

export type GetProvinceProjectsResult =
  | { data: ProvinceProjectRow[]; error: null }
  | { data: null; error: Error };

export async function getActiveProvinceProjects(
  supabase: SupabaseClient,
): Promise<GetProvinceProjectsResult> {
  const { data, error } = await supabase
    .from("province_projects")
    .select(
      "id, province_slug, title, description, location_label, segment, year, sort_order, active, created_at",
    )
    .eq("active", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("title");

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: (data ?? []) as ProvinceProjectRow[], error: null };
}

/** Staff: todas las filas (activas e inactivas) para el panel. */
export async function getAllProvinceProjectsForAdmin(
  supabase: SupabaseClient,
): Promise<GetProvinceProjectsResult> {
  const { data, error } = await supabase
    .from("province_projects")
    .select(
      "id, province_slug, title, description, location_label, segment, year, sort_order, active, created_at",
    )
    .order("province_slug")
    .order("sort_order", { ascending: true, nullsFirst: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: (data ?? []) as ProvinceProjectRow[], error: null };
}
