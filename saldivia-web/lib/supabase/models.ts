import type { SupabaseClient } from "@supabase/supabase-js";

import type { Model, ModelSegment } from "@/types/model";

export type ModelFilters = {
  segment?: ModelSegment;
};

export type GetModelsResult =
  | { data: Model[]; error: null }
  | { data: null; error: Error };

export async function getModels(
  supabase: SupabaseClient,
  filters: ModelFilters = {},
): Promise<GetModelsResult> {
  let q = supabase
    .from("models")
    .select(
      "id, slug, name, segment, description, cover_image_url, pdf_url, active, created_at, sort_order",
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
