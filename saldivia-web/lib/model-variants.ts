import type { ModelGeneralFeature } from "@/types/model";
import type { Product } from "@/types/product";

export type SpecRow = { id?: string; spec_key: string; spec_value: string; sort_order?: number | null };

export function sortSpecs(rows: SpecRow[]): SpecRow[] {
  return [...rows].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.spec_key.localeCompare(b.spec_key),
  );
}

/** Combina specs compartidas + específicas de variante (la variante gana si repite clave). */
export function resolveSpecsForVariant(
  shared: Product[],
  variantSpecific: Product[],
): SpecRow[] {
  const map = new Map<string, SpecRow>();
  for (const row of sortSpecs(shared)) {
    map.set(row.spec_key, row);
  }
  for (const row of sortSpecs(variantSpecific)) {
    map.set(row.spec_key, row);
  }
  return sortSpecs(Array.from(map.values()));
}

export function resolveFeaturesForVariant(
  shared: ModelGeneralFeature[],
  variantSpecific: ModelGeneralFeature[],
): string[] {
  const sharedBodies = [...shared]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((f) => f.body);
  const variantBodies = [...variantSpecific]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((f) => f.body);
  return [...sharedBodies, ...variantBodies];
}

export function slugifyVariantCode(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
