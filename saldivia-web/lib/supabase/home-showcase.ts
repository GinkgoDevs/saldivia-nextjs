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

/** Slides estáticas si la tabla está vacía, la consulta falla o no hay modelos activos enlazados. */
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

type ModelEmbed = {
  id: string;
  slug: string;
  name: string;
  segment: ModelSegment;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  active: boolean;
};

type SlideQueryRow = HomeShowcaseSlideRow & { model: ModelEmbed | ModelEmbed[] | null };

function embedModel(m: ModelEmbed | ModelEmbed[] | null | undefined): ModelEmbed | null {
  if (!m) return null;
  return Array.isArray(m) ? m[0] ?? null : m;
}

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

export async function getHomeShowcaseSlides(
  supabase: SupabaseClient,
): Promise<ResolvedHomeShowcaseSlide[]> {
  const { data, error } = await supabase
    .from("home_showcase_slides")
    .select(
      `
      id,
      model_id,
      sort_order,
      hero_image_url,
      eyebrow,
      lead,
      metrics,
      model:models (
        id,
        slug,
        name,
        segment,
        description,
        cover_image_url,
        pdf_url,
        active
      )
    `,
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getHomeShowcaseSlides]", error.message);
    return [];
  }

  const rows = (data ?? []) as SlideQueryRow[];
  if (rows.length === 0) return [];

  const modelIds = [
    ...new Set(
      rows
        .map((r) => embedModel(r.model)?.id)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];

  const [productsRes, imagesRes] = await Promise.all([
    modelIds.length
      ? supabase
          .from("products")
          .select("model_id, spec_key, spec_value, sort_order")
          .in("model_id", modelIds)
      : Promise.resolve({ data: [] as ProductRow[], error: null }),
    modelIds.length
      ? supabase
          .from("model_images")
          .select("model_id, image_url, sort_order")
          .in("model_id", modelIds)
      : Promise.resolve({ data: [] as ImageRow[], error: null }),
  ]);

  if (productsRes.error) {
    console.error("[getHomeShowcaseSlides] products", productsRes.error.message);
  }
  if (imagesRes.error) {
    console.error("[getHomeShowcaseSlides] model_images", imagesRes.error.message);
  }

  const productsByModel = groupByModelId((productsRes.data ?? []) as ProductRow[]);
  const imagesByModel = groupByModelId((imagesRes.data ?? []) as ImageRow[]);

  const resolved: ResolvedHomeShowcaseSlide[] = [];

  for (const row of rows) {
    const m = embedModel(row.model);
    if (!m || !m.active) continue;

    const modelProducts = productsByModel.get(m.id) ?? [];
    const specs = sortSpecs(modelProducts).slice(0, 2).map((p) => ({
      key: p.spec_key,
      value: p.spec_value,
    }));

    const modelImages = imagesByModel.get(m.id) ?? [];
    const imgs = sortImages(modelImages);
    const heroSrc =
      row.hero_image_url?.trim() ||
      m.cover_image_url?.trim() ||
      imgs[0]?.image_url?.trim() ||
      FALLBACK_HERO;

    const seg = m.segment in SEGMENT_EYEBROW ? m.segment : "interprovincial";
    const eyebrow = row.eyebrow?.trim() || SEGMENT_EYEBROW[seg];
    const lead = row.lead?.trim() || m.description?.trim() || "";
    const metrics = normalizeMetrics(row.metrics);

    resolved.push({
      id: row.id,
      slug: m.slug,
      name: m.name,
      heroSrc,
      eyebrow,
      lead,
      specRows: specs,
      metrics,
      pdfUrl: m.pdf_url?.trim() || null,
    });
  }

  return resolved;
}

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

/**
 * Slides del showcase del home construidas desde los modelos marcados con
 * `show_in_showcase = true` en el dashboard. Si la columna no existe todavía,
 * la consulta falla o no hay modelos marcados, devuelve [] (el home usa fallback).
 */
export async function getShowcaseSlidesFromModels(
  supabase: SupabaseClient,
): Promise<ResolvedHomeShowcaseSlide[]> {
  const { data, error } = await supabase
    .from("models")
    .select("id, slug, name, segment, description, cover_image_url, pdf_url, sort_order")
    .eq("active", true)
    .eq("show_in_showcase", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name");

  if (error) {
    if (!error.message?.includes("show_in_showcase")) {
      console.error("[getShowcaseSlidesFromModels]", error.message);
    }
    return [];
  }

  const models = (data ?? []) as ShowcaseModelRow[];
  if (models.length === 0) return [];

  const modelIds = models.map((m) => m.id);

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
    console.error("[getShowcaseSlidesFromModels] products", productsRes.error.message);
  }
  if (imagesRes.error) {
    console.error("[getShowcaseSlidesFromModels] model_images", imagesRes.error.message);
  }

  const productsByModel = groupByModelId((productsRes.data ?? []) as ProductRow[]);
  const imagesByModel = groupByModelId((imagesRes.data ?? []) as ImageRow[]);

  return models.map((m) => {
    const specs = sortSpecs(productsByModel.get(m.id) ?? [])
      .slice(0, 2)
      .map((p) => ({ key: p.spec_key, value: p.spec_value }));

    const imgs = sortImages(imagesByModel.get(m.id) ?? []);
    const heroSrc =
      m.cover_image_url?.trim() || imgs[0]?.image_url?.trim() || FALLBACK_HERO;

    const seg = m.segment in SEGMENT_EYEBROW ? m.segment : "interprovincial";

    return {
      id: `model-${m.id}`,
      slug: m.slug,
      name: m.name,
      heroSrc,
      eyebrow: SEGMENT_EYEBROW[seg],
      lead: m.description?.trim() || "",
      specRows: specs,
      metrics: [],
      pdfUrl: m.pdf_url?.trim() || null,
    };
  });
}

export type AdminShowcaseSlide = HomeShowcaseSlideRow & {
  model: { id: string; name: string; slug: string; active: boolean } | null | undefined;
};

export async function getHomeShowcaseSlidesForAdmin(
  supabase: SupabaseClient,
): Promise<{ data: AdminShowcaseSlide[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("home_showcase_slides")
    .select(
      `
      id,
      model_id,
      sort_order,
      hero_image_url,
      eyebrow,
      lead,
      metrics,
      model:models ( id, name, slug, active )
    `,
    )
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const rows = (data ?? []) as (HomeShowcaseSlideRow & {
    model: { id: string; name: string; slug: string; active: boolean } | null | undefined | Array<{
      id: string;
      name: string;
      slug: string;
      active: boolean;
    }>;
  })[];

  const normalized: AdminShowcaseSlide[] = rows.map((r) => {
    const emb = r.model;
    const modelRow = Array.isArray(emb) ? emb[0] ?? null : emb ?? null;
    return { ...r, model: modelRow };
  });

  return { data: normalized, error: null };
}
