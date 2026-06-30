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
  let q = supabase
    .from("models")
    .select(
      "id, slug, name, segment, description, cover_image_url, hero_background_image_url, pdf_url, active, created_at, sort_order",
    )
    .eq("active", true);

  if (filters.segment) q = q.eq("segment", filters.segment);

  const { data, error } = await q
    .order("segment")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name");

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: (data ?? []) as Model[],
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
  const { data, error } = await supabase
    .from("models")
    .select(
      "id, slug, name, segment, description, cover_image_url, hero_background_image_url, pdf_url, active, created_at, sort_order",
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) return { data: null, error: new Error(error.message) };
  if (!data) return { data: null, error: new Error(`Model not found: ${slug}`) };

  return { data: data as Model, error: null };
}

export async function getAllModelsForAdmin(
  supabase: SupabaseClient,
): Promise<GetModelsAdminResult> {
  const { data: models, error: modelsError } = await supabase
    .from("models")
    .select(
      "id, slug, name, segment, description, cover_image_url, hero_background_image_url, pdf_url, active, created_at, sort_order",
    )
    .order("segment")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name");

  if (modelsError) {
    return { data: null, error: new Error(modelsError.message) };
  }

  const modelList = (models ?? []) as Model[];
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
