"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getModels, type ModelFilters } from "@/lib/supabase/models";
import type { Model } from "@/types/model";

export type UseModelsState = {
  data: Model[] | null;
  loading: boolean;
  error: Error | null;
};

export function useModels(filters: ModelFilters = {}): UseModelsState {
  const [data, setData] = useState<Model[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const segment = filters.segment;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const result = await getModels(supabase, { segment });

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
  }, [segment]);

  return { data, loading, error };
}
