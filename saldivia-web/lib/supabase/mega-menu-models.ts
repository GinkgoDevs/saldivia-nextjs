import { FLEET_SEGMENTS } from "@/app/data/flota-catalog";
import { createClient } from "@/lib/supabase/server";

export type MegaMenuModel = {
  slug: string;
  name: string;
  href: string;
};

export type MegaMenuSegment = {
  id: string;
  title: string;
  models: MegaMenuModel[];
};

function fallbackFromCatalog(): MegaMenuSegment[] {
  return FLEET_SEGMENTS.map((s) => ({
    id: s.id,
    title: s.title,
    models: s.models.map((m) => ({
      name: m.name,
      href: m.href,
      slug: m.href.replace(/^\/producto\//, ""),
    })),
  }));
}

/**
 * Modelos activos agrupados por segmento (misma estructura que el catálogo /flota).
 * Si falla la query, usa datos estáticos para no romper el menú.
 */
export async function getMegaMenuFleet(): Promise<MegaMenuSegment[]> {
  const allowed = new Set(FLEET_SEGMENTS.map((s) => s.id));
  const segmentOrder = (seg: string) => {
    const i = FLEET_SEGMENTS.findIndex((s) => s.id === seg);
    return i === -1 ? 999 : i;
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("models")
    .select("slug, name, segment, sort_order")
    .eq("active", true);

  if (error) {
    console.error("[getMegaMenuFleet]", error.message);
    return fallbackFromCatalog();
  }

  if (!data?.length) {
    return FLEET_SEGMENTS.map((s) => ({
      id: s.id,
      title: s.title,
      models: [],
    }));
  }

  const sorted = [...data]
    .filter((row) => allowed.has(row.segment))
    .sort((a, b) => {
      const bySeg = segmentOrder(a.segment) - segmentOrder(b.segment);
      if (bySeg !== 0) return bySeg;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

  const grouped = new Map<string, MegaMenuModel[]>();
  for (const id of FLEET_SEGMENTS.map((s) => s.id)) {
    grouped.set(id, []);
  }
  for (const row of sorted) {
    grouped.get(row.segment)!.push({
      slug: row.slug,
      name: row.name,
      href: `/producto/${row.slug}`,
    });
  }

  return FLEET_SEGMENTS.map((s) => ({
    id: s.id,
    title: s.title,
    models: grouped.get(s.id) ?? [],
  }));
}
