"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getProducts, type ProductFilters } from "@/lib/supabase/products";
import type { Product } from "@/types/product";

export type UseProductsState = {
  data: Product[] | null;
  loading: boolean;
  error: Error | null;
};

export function useProducts(filters: ProductFilters = {}): UseProductsState {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const modelId = filters.modelId;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const result = await getProducts(supabase, { modelId });

      if (cancelled) return;
      if (result.error) {
        setData(null);
        setError(result.error);
      } else {
        setData(result.data);
        setError(null);
      }
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [modelId]);

  return { data, loading, error };
}
