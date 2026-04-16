import type { SupabaseClient } from "@supabase/supabase-js";

import type { Product } from "@/types/product";

export type ProductFilters = {
  modelId?: string;
};

export type GetProductsResult =
  | { data: Product[]; error: null }
  | { data: null; error: Error };

const PRODUCTS_LIMIT = 80;

export async function getProducts(
  supabase: SupabaseClient,
  filters: ProductFilters = {},
): Promise<GetProductsResult> {
  let q = supabase
    .from("products")
    .select("id, model_id, spec_key, spec_value, sort_order")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("spec_key")
    .limit(PRODUCTS_LIMIT);

  if (filters.modelId) q = q.eq("model_id", filters.modelId);

  const { data, error } = await q;

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: (data ?? []) as Product[],
    error: null,
  };
}
