import type { SupabaseClient } from "@supabase/supabase-js";

import type { Model, ModelImage } from "@/types/model";
import type { Product } from "@/types/product";

export type ModelDetail = {
  model: Model;
  products: Product[];
  images: ModelImage[];
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
    .select("id, slug, name, segment, description, cover_image_url, pdf_url, active, created_at, sort_order")
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

  const [{ data: products, error: pErr }, { data: images, error: iErr }] =
    await Promise.all([
      supabase
        .from("products")
        .select("id, model_id, spec_key, spec_value, sort_order")
        .eq("model_id", modelId)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("spec_key")
        .limit(120),
      supabase
        .from("model_images")
        .select("id, model_id, image_url, sort_order")
        .eq("model_id", modelId)
        .order("sort_order", { ascending: true, nullsFirst: false }),
    ]);

  if (pErr) console.error("[getModelBySlug] products", pErr.message);
  if (iErr) console.error("[getModelBySlug] images", iErr.message);

  return {
    model,
    products: (products ?? []) as Product[],
    images: (images ?? []) as ModelImage[],
  };
}
