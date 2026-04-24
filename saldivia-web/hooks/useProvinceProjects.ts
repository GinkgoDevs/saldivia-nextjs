"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getActiveProvinceProjects, groupByProvince } from "@/lib/supabase/province-projects";
import type { ProvinceProjectCard } from "@/lib/supabase/province-projects";

export type UseProvinceProjectsState = {
  byProvince: Partial<Record<string, ProvinceProjectCard[]>> | null;
  loading: boolean;
  error: Error | null;
};

export function useProvinceProjects(): UseProvinceProjectsState {
  const [byProvince, setByProvince] = useState<Partial<Record<string, ProvinceProjectCard[]>> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const res = await getActiveProvinceProjects(supabase);
      if (cancelled) return;
      if (res.error) {
        setByProvince(null);
        setError(res.error);
      } else {
        setByProvince(groupByProvince(res.data ?? []));
        setError(null);
      }
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { byProvince, loading, error };
}
