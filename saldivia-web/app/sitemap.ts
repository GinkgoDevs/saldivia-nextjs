import type { MetadataRoute } from "next";

import { getActiveModelSlugs } from "@/lib/supabase/model-detail";
import { createStaticClient } from "@/lib/supabase/static-client";
import { getSiteUrl } from "@/lib/site-url";

const STATIC = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/flota", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/tecnologia", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/nosotros", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/postventa", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/contacto", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/privacidad", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/terminos", priority: 0.4, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const out: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: s.path ? `${base}${s.path}` : `${base}/`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return out;
    }
    const supabase = createStaticClient();
    const slugs = await getActiveModelSlugs(supabase);
    if (slugs?.length) {
      for (const slug of slugs) {
        out.push({
          url: `${base}/producto/${encodeURIComponent(slug)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch {
    // Catálogo sin Supabase: sitemap estático
  }

  return out;
}
