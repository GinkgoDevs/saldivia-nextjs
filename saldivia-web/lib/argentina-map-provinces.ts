import argentinaProvinceMapData from "@/app/components/argentinaProvinceMapData.json";

type ProvinceRow = { id: string; name: string };

const rows = argentinaProvinceMapData.provinces as ProvinceRow[];

const labelById = new Map(rows.map((p) => [p.id, p.name]));

/** Provincias del SVG (orden alfabético por nombre para selects). */
export const ARGENTINA_MAP_PROVINCES = [...rows].sort((a, b) =>
  a.name.localeCompare(b.name, "es"),
);

/** Resuelve `id` del mapa (ej. buenos-aires) → nombre visible. */
export function argentinaMapProvinceLabel(id: string): string | null {
  return labelById.get(id) ?? null;
}

/** Texto en UI: slug conocido → nombre; si no, el valor guardado (legacy). */
export function formatArgentinaProvince(stored: string): string {
  const t = stored.trim();
  if (!t) return t;
  return argentinaMapProvinceLabel(t) ?? t;
}

export const ARGENTINA_MAP_PROVINCE_IDS = new Set(rows.map((p) => p.id));
