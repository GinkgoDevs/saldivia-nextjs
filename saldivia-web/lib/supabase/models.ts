import type { SupabaseClient } from "@supabase/supabase-js";

import type { Model, ModelAdmin, ModelGeneralFeature, ModelSegment, ModelVariant, ModelVariantAdmin } from "@/types/model";
import type { Product } from "@/types/product";

function groupRowsByModelId<T extends { model_id: string | null }>(rows: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    if (!row.model_id) continue;
    const list = map.get(row.model_id);
    if (list) list.push(row);
    else map.set(row.model_id, [row]);
  }
  return map;
}

const MODEL_COLUMNS =
  "id, slug, name, segment, description, cover_image_url, cover_image_focal_x, cover_image_focal_y, cover_image_zoom, hero_background_image_url, hero_background_focal_x, hero_background_focal_y, hero_background_zoom, pdf_url, active, show_in_showcase, created_at, sort_order";
const MODEL_COLUMNS_LEGACY =
  "id, slug, name, segment, description, cover_image_url, hero_background_image_url, pdf_url, active, created_at, sort_order";
const MODEL_COLUMNS_NO_HERO =
  "id, slug, name, segment, description, cover_image_url, pdf_url, active, show_in_showcase, created_at, sort_order";

function withCoverDefaults<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map((r) => ({
    ...r,
    cover_image_focal_x: (r as { cover_image_focal_x?: number }).cover_image_focal_x ?? 50,
    cover_image_focal_y: (r as { cover_image_focal_y?: number }).cover_image_focal_y ?? 50,
    cover_image_zoom: (r as { cover_image_zoom?: number }).cover_image_zoom ?? 1,
  }));
}

function withHeroDefaults<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map((r) => ({
    ...r,
    hero_background_focal_x: (r as { hero_background_focal_x?: number }).hero_background_focal_x ?? 50,
    hero_background_focal_y: (r as { hero_background_focal_y?: number }).hero_background_focal_y ?? 50,
    hero_background_zoom: (r as { hero_background_zoom?: number }).hero_background_zoom ?? 1,
    hero_background_image_url:
      (r as { hero_background_image_url?: string | null }).hero_background_image_url ?? null,
  }));
}

function withShowcaseDefault<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map((r) => ("show_in_showcase" in r ? r : { ...r, show_in_showcase: false }));
}

function normalizeModelRows<T extends Record<string, unknown>>(rows: T[]): T[] {
  return withHeroDefaults(withCoverDefaults(withShowcaseDefault(rows)));
}

export type ModelFilters = {
  segment?: ModelSegment;
};

export type GetModelsResult =
  | { data: Model[]; error: null }
  | { data: null; error: Error };

export type GetModelsAdminResult =
  | { data: ModelAdmin[]; error: null }
  | { data: null; error: Error };

export async function getModels(
  supabase: SupabaseClient,
  filters: ModelFilters = {},
): Promise<GetModelsResult> {
  const runQuery = (columns: string) => {
    let q = supabase.from("models").select(columns).eq("active", true);
    if (filters.segment) q = q.eq("segment", filters.segment);
    return q
      .order("segment")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("name");
  };

  let { data, error } = await runQuery(MODEL_COLUMNS);
  if (error?.message?.includes("cover_image_focal")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_LEGACY));
  }
  if (error?.message?.includes("hero_background_focal")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_LEGACY));
  }
  if (error?.message?.includes("show_in_showcase")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_LEGACY));
  }
  if (error?.message?.includes("hero_background_image_url")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_NO_HERO));
  }

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: normalizeModelRows((data ?? []) as unknown as Model[]),
    error: null,
  };
}

export type GetModelResult =
  | { data: Model; error: null }
  | { data: null; error: Error };

export async function getModelBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<GetModelResult> {
  const runQuery = (columns: string) =>
    supabase.from("models").select(columns).eq("slug", slug).eq("active", true).maybeSingle();

  let { data, error } = await runQuery(MODEL_COLUMNS);
  if (error?.message?.includes("cover_image_focal")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_LEGACY));
  }
  if (error?.message?.includes("hero_background_focal")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_LEGACY));
  }
  if (error?.message?.includes("show_in_showcase")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_LEGACY));
  }
  if (error?.message?.includes("hero_background_image_url")) {
    ({ data, error } = await runQuery(MODEL_COLUMNS_NO_HERO));
  }

  if (error) return { data: null, error: new Error(error.message) };
  if (!data) return { data: null, error: new Error(`Model not found: ${slug}`) };

  return { data: normalizeModelRows([data as unknown as Model])[0], error: null };
}

export async function getAllModelsForAdmin(
  supabase: SupabaseClient,
): Promise<GetModelsAdminResult> {
  const runModelsQuery = (columns: string) =>
    supabase
      .from("models")
      .select(columns)
      .order("segment")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("name");

  let { data: models, error: modelsError } = await runModelsQuery(MODEL_COLUMNS);
  if (modelsError?.message?.includes("cover_image_focal")) {
    ({ data: models, error: modelsError } = await runModelsQuery(MODEL_COLUMNS_LEGACY));
  }
  if (modelsError?.message?.includes("hero_background_focal")) {
    ({ data: models, error: modelsError } = await runModelsQuery(MODEL_COLUMNS_LEGACY));
  }
  if (modelsError?.message?.includes("show_in_showcase")) {
    ({ data: models, error: modelsError } = await runModelsQuery(MODEL_COLUMNS_LEGACY));
  }
  if (modelsError?.message?.includes("hero_background_image_url")) {
    ({ data: models, error: modelsError } = await runModelsQuery(MODEL_COLUMNS_NO_HERO));
  }

  if (modelsError) {
    return { data: null, error: new Error(modelsError.message) };
  }

  const modelList = normalizeModelRows((models ?? []) as unknown as Model[]);
  if (modelList.length === 0) {
    return { data: [], error: null };
  }

  const ids = modelList.map((m) => m.id);

  const [prodRes, featRes, varRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, model_id, variant_id, spec_key, spec_value, sort_order")
      .in("model_id", ids),
    supabase
      .from("model_general_features")
      .select("id, model_id, variant_id, body, sort_order")
      .in("model_id", ids),
    supabase
      .from("model_variants")
      .select("id, model_id, code, name, description, is_default, sort_order")
      .in("model_id", ids)
      .order("sort_order", { ascending: true, nullsFirst: false }),
  ]);

  let productsData = prodRes.data;
  let featuresData = featRes.data;

  if (prodRes.error?.message?.includes("variant_id")) {
    const fallback = await supabase
      .from("products")
      .select("id, model_id, spec_key, spec_value, sort_order")
      .in("model_id", ids);
    if (fallback.error) {
      return { data: null, error: new Error(fallback.error.message) };
    }
    productsData = (fallback.data ?? []).map((row) => ({ ...row, variant_id: null }));
  } else if (prodRes.error) {
    return { data: null, error: new Error(prodRes.error.message) };
  }

  if (featRes.error?.message?.includes("variant_id")) {
    const fallback = await supabase
      .from("model_general_features")
      .select("id, model_id, body, sort_order")
      .in("model_id", ids);
    if (fallback.error) {
      return { data: null, error: new Error(fallback.error.message) };
    }
    featuresData = (fallback.data ?? []).map((row) => ({ ...row, variant_id: null }));
  } else if (featRes.error) {
    return { data: null, error: new Error(featRes.error.message) };
  }

  if (varRes.error) {
    console.warn("[getAllModelsForAdmin] model_variants:", varRes.error.message);
  }

  const productsByModel = groupRowsByModelId((productsData ?? []) as Product[]);
  const featuresByModel = groupRowsByModelId((featuresData ?? []) as ModelGeneralFeature[]);
  const variantsByModel = varRes.error
    ? new Map<string, ModelVariant[]>()
    : groupRowsByModelId((varRes.data ?? []) as ModelVariant[]);

  const data: ModelAdmin[] = modelList.map((m) => {
    const allProducts = [...(productsByModel.get(m.id) ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.spec_key.localeCompare(b.spec_key),
    );
    const allFeatures = [...(featuresByModel.get(m.id) ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );
    const variantRows = [...(variantsByModel.get(m.id) ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
    );

    const products = allProducts.filter((p) => !p.variant_id);
    const model_general_features = allFeatures.filter((f) => !f.variant_id);

    const model_variants: ModelVariantAdmin[] = variantRows.map((variant) => ({
      ...variant,
      products: allProducts.filter((p) => p.variant_id === variant.id),
      model_general_features: allFeatures.filter((f) => f.variant_id === variant.id),
    }));

    return { ...m, products, model_general_features, model_variants };
  });

  return { data, error: null };
}
