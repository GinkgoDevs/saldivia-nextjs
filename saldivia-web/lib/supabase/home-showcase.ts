import type { SupabaseClient } from "@supabase/supabase-js";

import type { ModelSegment } from "@/types/model";
import type { HomeShowcaseSlideRow, ResolvedHomeShowcaseSlide, ShowcaseMetric } from "@/types/home-showcase";

const SEGMENT_EYEBROW: Record<ModelSegment, string> = {
  urbano: "SERIE URBANA",
  interurbano: "SERIE INTERURBANA",
  interprovincial: "LARGA DISTANCIA",
  especiales: "APLICACIONES ESPECIALES",
};

const FALLBACK_HERO = "/ARIES-305/345_1.png";

/** Slides estáticas si la consulta falla o no hay modelos marcados para showcase. */
export function getStaticFallbackHomeShowcaseSlides(): ResolvedHomeShowcaseSlide[] {
  return [
    {
      id: "fallback-showcase-aries-365",
      slug: "aries-365",
      name: "Aries 365",
      heroSrc: FALLBACK_HERO,
      eyebrow: "LARGA DISTANCIA",
      lead: "Plataforma interprovincial con estándares de confort y seguridad Saldivia.",
      specRows: [
        { key: "Motorización", value: "Diesel Euro V / Euro VI" },
        { key: "Operación", value: "Corredores nacionales" },
      ],
      metrics: [
        { value: "98%", label: "Aislamiento acústico" },
        { value: "ABS+EBS", label: "Frenado" },
      ],
      pdfUrl: null,
    },
    {
      id: "fallback-showcase-aries-405",
      slug: "aries-405",
      name: "Aries 405",
      heroSrc: FALLBACK_HERO,
      eyebrow: "LARGA DISTANCIA",
      lead: "Referente para operaciones de larga distancia con cabina y bodega de alto volumen.",
      specRows: [
        { key: "Plazas", value: "Hasta 46 semicama" },
        { key: "Baño", value: "Opción premium" },
      ],
      metrics: [
        { value: "40+ años", label: "Ingeniería Saldivia" },
        { value: "Postventa", label: "En todo el país" },
      ],
      pdfUrl: null,
    },
  ];
}

type ProductRow = {
  model_id: string;
  spec_key: string;
  spec_value: string;
  sort_order: number | null;
};
type ImageRow = { model_id: string; image_url: string; sort_order: number | null };

type ShowcaseModelRow = {
  id: string;
  slug: string;
  name: string;
  segment: ModelSegment;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  sort_order: number | null;
};

function groupByModelId<T extends { model_id: string }>(rows: T[] | null): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows ?? []) {
    const list = map.get(row.model_id);
    if (list) list.push(row);
    else map.set(row.model_id, [row]);
  }
  return map;
}

function sortSpecs(rows: ProductRow[]) {
  return [...rows].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.spec_key.localeCompare(b.spec_key),
  );
}

function sortImages(rows: ImageRow[]) {
  return [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function normalizeMetrics(raw: unknown): ShowcaseMetric[] {
  if (!Array.isArray(raw)) return [];
  const out: ShowcaseMetric[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const v = item as Record<string, unknown>;
    const value = typeof v.value === "string" ? v.value.trim() : "";
    const label = typeof v.label === "string" ? v.label.trim() : "";
    if (value && label) out.push({ value, label });
    if (out.length >= 2) break;
  }
  return out;
}

async function fetchShowcaseModels(supabase: SupabaseClient): Promise<ShowcaseModelRow[]> {
  const { data, error } = await supabase
    .from("models")
    .select("id, slug, name, segment, description, cover_image_url, pdf_url, sort_order")
    .eq("active", true)
    .eq("show_in_showcase", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name");

  if (error) {
    if (!error.message?.includes("show_in_showcase")) {
      console.error("[fetchShowcaseModels]", error.message);
    }
    return [];
  }

  return (data ?? []) as ShowcaseModelRow[];
}

async function fetchSlidesByModelId(
  supabase: SupabaseClient,
  modelIds: string[],
): Promise<Map<string, HomeShowcaseSlideRow>> {
  if (modelIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("home_showcase_slides")
    .select("id, model_id, sort_order, hero_image_url, eyebrow, lead, metrics")
    .in("model_id", modelIds);

  if (error) {
    console.error("[fetchSlidesByModelId]", error.message);
    return new Map();
  }

  const map = new Map<string, HomeShowcaseSlideRow>();
  for (const row of (data ?? []) as HomeShowcaseSlideRow[]) {
    if (!map.has(row.model_id)) {
      map.set(row.model_id, row);
    }
  }
  return map;
}

async function resolveShowcaseSlides(
  supabase: SupabaseClient,
  models: ShowcaseModelRow[],
): Promise<ResolvedHomeShowcaseSlide[]> {
  if (models.length === 0) return [];

  const modelIds = models.map((m) => m.id);
  const slidesByModel = await fetchSlidesByModelId(supabase, modelIds);

  const [productsRes, imagesRes] = await Promise.all([
    supabase
      .from("products")
      .select("model_id, spec_key, spec_value, sort_order")
      .in("model_id", modelIds),
    supabase
      .from("model_images")
      .select("model_id, image_url, sort_order")
      .in("model_id", modelIds),
  ]);

  if (productsRes.error) {
    console.error("[resolveShowcaseSlides] products", productsRes.error.message);
  }
  if (imagesRes.error) {
    console.error("[resolveShowcaseSlides] model_images", imagesRes.error.message);
  }

  const productsByModel = groupByModelId((productsRes.data ?? []) as ProductRow[]);
  const imagesByModel = groupByModelId((imagesRes.data ?? []) as ImageRow[]);

  const withSort = models.map((m) => {
    const slide = slidesByModel.get(m.id);
    const specs = sortSpecs(productsByModel.get(m.id) ?? [])
      .slice(0, 2)
      .map((p) => ({ key: p.spec_key, value: p.spec_value }));

    const imgs = sortImages(imagesByModel.get(m.id) ?? []);
    const heroSrc =
      slide?.hero_image_url?.trim() ||
      m.cover_image_url?.trim() ||
      imgs[0]?.image_url?.trim() ||
      FALLBACK_HERO;

    const seg = m.segment in SEGMENT_EYEBROW ? m.segment : "interprovincial";
    const eyebrow = slide?.eyebrow?.trim() || SEGMENT_EYEBROW[seg];
    const lead = slide?.lead?.trim() || m.description?.trim() || "";
    const metrics = normalizeMetrics(slide?.metrics);

    return {
      sortOrder: slide?.sort_order ?? m.sort_order ?? 0,
      slide: {
        id: slide?.id ?? `model-${m.id}`,
        slug: m.slug,
        name: m.name,
        heroSrc,
        eyebrow,
        lead,
        specRows: specs,
        metrics,
        pdfUrl: m.pdf_url?.trim() || null,
      } satisfies ResolvedHomeShowcaseSlide,
    };
  });

  withSort.sort(
    (a, b) => a.sortOrder - b.sortOrder || a.slide.name.localeCompare(b.slide.name, "es"),
  );
  return withSort.map((x) => x.slide);
}

/**
 * Slides del showcase del home: modelos activos con `show_in_showcase = true`,
 * enriquecidos con overrides de `home_showcase_slides` (imagen, textos, métricas).
 */
export async function getShowcaseSlidesFromModels(
  supabase: SupabaseClient,
): Promise<ResolvedHomeShowcaseSlide[]> {
  const models = await fetchShowcaseModels(supabase);
  return resolveShowcaseSlides(supabase, models);
}

export type AdminShowcaseSlide = {
  id: string | null;
  model_id: string;
  sort_order: number;
  hero_image_url: string | null;
  eyebrow: string | null;
  lead: string | null;
  metrics: ShowcaseMetric[] | null;
  model: {
    id: string;
    name: string;
    slug: string;
    active: boolean;
    cover_image_url: string | null;
    sort_order: number | null;
  };
};

export async function getHomeShowcaseSlidesForAdmin(
  supabase: SupabaseClient,
): Promise<{ data: AdminShowcaseSlide[] | null; error: Error | null }> {
  const { data: models, error } = await supabase
    .from("models")
    .select("id, slug, name, active, cover_image_url, sort_order, show_in_showcase")
    .eq("show_in_showcase", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name");

  if (error) {
    if (error.message?.includes("show_in_showcase")) {
      return { data: [], error: null };
    }
    return { data: null, error: new Error(error.message) };
  }

  const modelRows = models ?? [];
  if (modelRows.length === 0) {
    return { data: [], error: null };
  }

  const modelIds = modelRows.map((m) => m.id as string);
  const slidesByModel = await fetchSlidesByModelId(supabase, modelIds);

  const entries: AdminShowcaseSlide[] = modelRows.map((m) => {
    const slide = slidesByModel.get(m.id as string);
    return {
      id: slide?.id ?? null,
      model_id: m.id as string,
      sort_order: slide?.sort_order ?? (m.sort_order as number | null) ?? 0,
      hero_image_url: slide?.hero_image_url ?? null,
      eyebrow: slide?.eyebrow ?? null,
      lead: slide?.lead ?? null,
      metrics: slide?.metrics ?? null,
      model: {
        id: m.id as string,
        name: m.name as string,
        slug: m.slug as string,
        active: m.active as boolean,
        cover_image_url: (m.cover_image_url as string | null) ?? null,
        sort_order: (m.sort_order as number | null) ?? null,
      },
    };
  });

  entries.sort(
    (a, b) => a.sort_order - b.sort_order || a.model.name.localeCompare(b.model.name, "es"),
  );

  return { data: entries, error: null };
}

/** @deprecated Usar getShowcaseSlidesFromModels (misma fuente unificada). */
export async function getHomeShowcaseSlides(
  supabase: SupabaseClient,
): Promise<ResolvedHomeShowcaseSlide[]> {
  return getShowcaseSlidesFromModels(supabase);
}
