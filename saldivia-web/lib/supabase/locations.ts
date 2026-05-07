import type { SupabaseClient } from "@supabase/supabase-js";

import type { Location, LocationType } from "@/types/location";

export type LocationFilters = {
  type?: LocationType;
  province?: string;
};

type LocationRow = {
  id: string;
  name: string;
  type: string;
  province: string;
  city: string;
  address: string;
  phone: string | null;
  hours: string | null;
  lat: string | number | null;
  lng: string | number | null;
  active: boolean;
  created_at: string;
};

function toNum(v: string | number | null): number {
  if (v == null || v === "") return NaN;
  if (typeof v === "number") return v;
  return Number(v);
}

function rowToLocation(row: LocationRow): Location | null {
  const lat = toNum(row.lat);
  const lng = toNum(row.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    id: row.id,
    name: row.name,
    type: row.type as Location["type"],
    province: row.province,
    city: row.city,
    address: row.address,
    phone: row.phone,
    hours: row.hours,
    lat,
    lng,
    active: row.active,
    created_at: row.created_at,
  };
}

export type GetLocationsResult =
  | { data: Location[]; error: null }
  | { data: null; error: Error };

/** Fila mínima para mapa SVG del home (no requiere lat/lng). */
export type LocationPresenceRow = {
  name: string;
  type: LocationType;
  province: string;
  city: string;
  address: string;
  phone: string | null;
  hours: string | null;
};

export type GetLocationPresenceResult =
  | { data: LocationPresenceRow[]; error: null }
  | { data: null; error: Error };

/** Ubicaciones activas para agrupar por provincia en ArgentinaProjectsMap. */
export async function getActiveLocationsForHomeMap(
  supabase: SupabaseClient,
): Promise<GetLocationPresenceResult> {
  const { data, error } = await supabase
    .from("locations")
    .select("name, type, province, city, address, phone, hours")
    .eq("active", true)
    .order("province")
    .order("name");

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const rows = data ?? [];
  const out: LocationPresenceRow[] = rows.map((row) => ({
    name: String((row as { name: string }).name ?? ""),
    type: (row as { type: string }).type as LocationType,
    province: String((row as { province: string }).province ?? ""),
    city: String((row as { city: string }).city ?? ""),
    address: String((row as { address: string }).address ?? ""),
    phone: (row as { phone: string | null }).phone ?? null,
    hours: (row as { hours: string | null }).hours ?? null,
  }));

  return { data: out, error: null };
}

export async function getLocations(
  supabase: SupabaseClient,
  filters: LocationFilters = {},
): Promise<GetLocationsResult> {
  let q = supabase
    .from("locations")
    .select(
      "id, name, type, province, city, address, phone, hours, lat, lng, active, created_at",
    )
    .eq("active", true);

  if (filters.type) q = q.eq("type", filters.type);
  if (filters.province) q = q.eq("province", filters.province);

  const { data, error } = await q.order("province").order("name");

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const rows = (data ?? []) as LocationRow[];
  const mapped = rows.map(rowToLocation).filter((x): x is Location => x !== null);
  return { data: mapped, error: null };
}

export type GetAllLocationsResult =
  | { data: Location[]; error: null }
  | { data: null; error: Error };

/** Incluye inactivas; requiere sesión (RLS staff). Uso: dashboard. */
export async function getAllLocationsForAdmin(
  supabase: SupabaseClient,
): Promise<GetAllLocationsResult> {
  const { data, error } = await supabase
    .from("locations")
    .select("id, name, type, province, city, address, phone, hours, lat, lng, active, created_at")
    .order("province")
    .order("name");

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const rows = (data ?? []) as LocationRow[];
  const mapped = rows.map(rowToLocation).filter((x): x is Location => x !== null);
  return { data: mapped, error: null };
}
