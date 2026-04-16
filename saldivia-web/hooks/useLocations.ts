"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getLocations, type LocationFilters } from "@/lib/supabase/locations";
import type { Location } from "@/types/location";

export type UseLocationsState = {
  data: Location[] | null;
  loading: boolean;
  error: Error | null;
};

export function useLocations(filters: LocationFilters = {}): UseLocationsState {
  const [data, setData] = useState<Location[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { type, province } = filters;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const result = await getLocations(supabase, { type, province });

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
  }, [type, province]);

  return { data, loading, error };
}
