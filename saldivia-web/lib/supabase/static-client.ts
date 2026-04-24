import { createClient } from "@supabase/supabase-js";

/** Cliente anónimo sin cookies; usar en `generateStaticParams` u otros contextos sin request. */
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
