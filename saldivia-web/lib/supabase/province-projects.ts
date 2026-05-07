import type { SupabaseClient } from "@supabase/supabase-js";

import type { LocationPresenceRow } from "@/lib/supabase/locations";
import type { LocationType } from "@/types/location";
import type { ProvinceProjectRow } from "@/types/province-project";

/** Tipo usado por el mapa SVG (ArgentinaProjectsMap) */
export type ProvinceProjectCard = {
  title: string;
  location: string;
  description: string;
  segment: string;
  year: string;
};

const LOCATION_TYPE_LABEL: Record<LocationType, string> = {
  taller: "Taller",
  distribuidor: "Distribuidor",
  concesionario: "Concesionario",
};

function locationPresenceToCard(loc: LocationPresenceRow): ProvinceProjectCard {
  const bits = [LOCATION_TYPE_LABEL[loc.type], loc.address];
  if (loc.phone) bits.push(`Tel. ${loc.phone}`);
  if (loc.hours) bits.push(loc.hours);
  return {
    title: loc.name,
    location: loc.city,
    description: bits.filter(Boolean).join(" · "),
    segment: LOCATION_TYPE_LABEL[loc.type],
    year: "—",
  };
}

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

/** Combina casos de `province_projects` con puntos de `locations` (misma clave = slug de provincia del mapa). */
export function mergeProjectsAndLocations(
  projectRows: ProvinceProjectRow[],
  locations: LocationPresenceRow[],
): Partial<Record<string, ProvinceProjectCard[]>> {
  const fromProjects = groupByProvince(projectRows);
  const fromLocs: Partial<Record<string, ProvinceProjectCard[]>> = {};
  const sorted = [...locations].sort((a, b) => a.name.localeCompare(b.name, "es"));
  for (const loc of sorted) {
    const slug = loc.province.trim().toLowerCase();
    if (!slug) continue;
    if (!fromLocs[slug]) fromLocs[slug] = [];
    fromLocs[slug]!.push(locationPresenceToCard(loc));
  }
  const keys = new Set([...Object.keys(fromProjects), ...Object.keys(fromLocs)]);
  const out: Partial<Record<string, ProvinceProjectCard[]>> = {};
  for (const k of keys) {
    const a = fromProjects[k] ?? [];
    const b = fromLocs[k] ?? [];
    out[k] = [...a, ...b];
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
