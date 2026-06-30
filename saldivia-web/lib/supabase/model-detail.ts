import type { SupabaseClient } from "@supabase/supabase-js";

import type { Model, ModelGeneralFeature, ModelImage, ModelVariant } from "@/types/model";
import type { Product } from "@/types/product";

export type ModelVariantDetail = ModelVariant & {
  products: Product[];
  general_features: ModelGeneralFeature[];
};

export type ModelDetail = {
  model: Model;
  /** Specs compartidas (variant_id NULL) */
  products: Product[];
  images: ModelImage[];
  /** Características compartidas */
  general_features: ModelGeneralFeature[];
  variants: ModelVariantDetail[];
};

export async function getActiveModelSlugs(
  supabase: SupabaseClient,
): Promise<string[] | null> {
  const { data, error } = await supabase
    .from("models")
    .select("slug")
    .eq("active", true);

  if (error) {
    console.error("[getActiveModelSlugs]", error.message);
    return null;
  }

  return (data ?? []).map((r) => (r as { slug: string }).slug);
}

export async function getModelBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<ModelDetail | null> {
  const normalized = slug.trim().toLowerCase();

  const { data: modelRow, error: modelError } = await supabase
    .from("models")
    .select(
      "id, slug, name, segment, description, cover_image_url, hero_background_image_url, pdf_url, active, created_at, sort_order",
    )
    .eq("slug", normalized)
    .eq("active", true)
    .maybeSingle();

  if (modelError) {
    console.error("[getModelBySlug] model", modelError.message);
    return null;
  }
  if (!modelRow) return null;

  const model = modelRow as Model;
  const modelId = model.id;

  const [{ data: products, error: pErr }, { data: images, error: iErr }, { data: general_features, error: fErr }, { data: variants, error: vErr }] =
    await Promise.all([
      supabase
        .from("products")
        .select("id, model_id, variant_id, spec_key, spec_value, sort_order")
        .eq("model_id", modelId)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("spec_key")
        .limit(200),
      supabase
        .from("model_images")
        .select("id, model_id, image_url, sort_order")
        .eq("model_id", modelId)
        .order("sort_order", { ascending: true, nullsFirst: false }),
      supabase
        .from("model_general_features")
        .select("id, model_id, variant_id, body, sort_order")
        .eq("model_id", modelId)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .limit(200),
      supabase
        .from("model_variants")
        .select("id, model_id, code, name, description, is_default, sort_order")
        .eq("model_id", modelId)
        .order("sort_order", { ascending: true, nullsFirst: false }),
    ]);

  if (pErr) console.error("[getModelBySlug] products", pErr.message);
  if (iErr) console.error("[getModelBySlug] images", iErr.message);
  if (fErr) console.error("[getModelBySlug] model_general_features", fErr.message);
  if (vErr) console.warn("[getModelBySlug] model_variants", vErr.message);

  let allProducts = (products ?? []) as Product[];
  let allFeatures = (general_features ?? []) as ModelGeneralFeature[];

  if (pErr?.message?.includes("variant_id")) {
    const { data: fallbackProducts } = await supabase
      .from("products")
      .select("id, model_id, spec_key, spec_value, sort_order")
      .eq("model_id", modelId)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("spec_key")
      .limit(200);
    allProducts = ((fallbackProducts ?? []) as Product[]).map((row) => ({ ...row, variant_id: null }));
  }

  if (fErr?.message?.includes("variant_id")) {
    const { data: fallbackFeatures } = await supabase
      .from("model_general_features")
      .select("id, model_id, body, sort_order")
      .eq("model_id", modelId)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .limit(200);
    allFeatures = ((fallbackFeatures ?? []) as ModelGeneralFeature[]).map((row) => ({
      ...row,
      variant_id: null,
    }));
  }

  const variantRows = vErr ? [] : ((variants ?? []) as ModelVariant[]);

  const sharedProducts = allProducts.filter((p) => !p.variant_id);
  const sharedFeatures = allFeatures.filter((f) => !f.variant_id);

  const variantDetails: ModelVariantDetail[] = variantRows.map((variant) => ({
    ...variant,
    products: allProducts.filter((p) => p.variant_id === variant.id),
    general_features: allFeatures.filter((f) => f.variant_id === variant.id),
  }));

  return {
    model,
    products: sharedProducts,
    images: (images ?? []) as ModelImage[],
    general_features: sharedFeatures,
    variants: variantDetails,
  };
}
