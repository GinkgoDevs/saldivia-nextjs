import type { SupabaseClient } from "@supabase/supabase-js";

export type QualityPolicyRow = {
  id: number;
  pdf_url: string | null;
  updated_at?: string;
};

/** URL pública del PDF, o null si no hay documento cargado / tabla ausente. */
export async function getQualityPolicyPdfUrl(
  supabase: SupabaseClient,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("quality_policy")
    .select("pdf_url")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    if (!error.message?.includes("quality_policy")) {
      console.error("[getQualityPolicyPdfUrl]", error.message);
    }
    return null;
  }

  const url = data?.pdf_url?.trim();
  return url || null;
}

export async function getQualityPolicyForAdmin(
  supabase: SupabaseClient,
): Promise<{ data: QualityPolicyRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("quality_policy")
    .select("id, pdf_url, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: (data as QualityPolicyRow | null) ?? { id: 1, pdf_url: null },
    error: null,
  };
}
