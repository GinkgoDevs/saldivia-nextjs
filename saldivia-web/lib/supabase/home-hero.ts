import type { SupabaseClient } from "@supabase/supabase-js";

import type { HomeHeroSlideRow, ResolvedHeroSlide } from "@/types/home-hero";

const HERO_COLUMNS =
  "id, sort_order, image_url, image_focal_x, image_focal_y, image_zoom, image_alt, eyebrow, title, highlight, subtitle, primary_label, primary_href, secondary_label, secondary_href, active, created_at";
const HERO_COLUMNS_LEGACY =
  "id, sort_order, image_url, image_alt, eyebrow, title, highlight, subtitle, primary_label, primary_href, secondary_label, secondary_href, active, created_at";

/** Slides estáticas si la tabla está vacía, no existe todavía o la consulta falla. */
export function getStaticHeroSlides(): ResolvedHeroSlide[] {
  return [
    {
      id: "static-aries-405",
      bg: "/background.png",
      bgAlt: "Unidad Saldivia Aries en ruta",
      bgFocalX: 50,
      bgFocalY: 50,
      bgZoom: 1,
      eyebrow: "Ingeniería de clase mundial",
      title: "Nuevo ARIES",
      highlight: "405 DD",
      subtitle:
        "Redefiniendo los estándares del transporte de pasajeros: potencia, seguridad y presencia imponente con el sello industrial Saldivia.",
      primary: { label: "Explorar modelos", href: "/flota" },
      secondary: { label: "Tour industrial", href: "/nosotros" },
    },
    {
      id: "static-soldadura",
      bg: "/saldivia/soldadura.jpg",
      bgAlt: "Proceso de soldadura certificado en planta Saldivia",
      bgFocalX: 50,
      bgFocalY: 50,
      bgZoom: 1,
      eyebrow: "Fabricación nacional certificada",
      title: "Precisión en",
      highlight: "cada soldadura",
      subtitle:
        "Procesos de manufactura controlados, materiales de primera calidad y estrictos estándares industriales en cada etapa de producción.",
      primary: { label: "Conocer la empresa", href: "/nosotros" },
      secondary: { label: "Solicitar visita", href: "/contacto" },
    },
    {
      id: "static-buses",
      bg: "/hero-buses.png",
      bgAlt: "Flota completa de buses Saldivia",
      bgFocalX: 50,
      bgFocalY: 50,
      bgZoom: 1,
      eyebrow: "Flota completa para cada operación",
      title: "De la ciudad",
      highlight: "a la ruta",
      subtitle:
        "Soluciones para cada tipo de operación, con el mismo compromiso de ingeniería y durabilidad en cada carrocería.",
      primary: { label: "Ver catálogo completo", href: "/flota" },
      secondary: { label: "Contacto", href: "/contacto" },
    },
  ];
}

const FALLBACK_BG = "/hero-buses.png";

function resolveCta(label: string | null, href: string | null): { label: string; href: string } | null {
  const l = label?.trim();
  const h = href?.trim();
  if (!l || !h) return null;
  return { label: l, href: h };
}

function resolveSlide(row: HomeHeroSlideRow): ResolvedHeroSlide {
  return {
    id: row.id,
    bg: row.image_url?.trim() || FALLBACK_BG,
    bgAlt: row.image_alt?.trim() || row.title?.trim() || "Saldivia",
    bgFocalX: row.image_focal_x ?? 50,
    bgFocalY: row.image_focal_y ?? 50,
    bgZoom: Number(row.image_zoom ?? 1),
    eyebrow: row.eyebrow?.trim() || "",
    title: row.title?.trim() || "",
    highlight: row.highlight?.trim() || "",
    subtitle: row.subtitle?.trim() || "",
    primary: resolveCta(row.primary_label, row.primary_href),
    secondary: resolveCta(row.secondary_label, row.secondary_href),
  };
}

/**
 * Slides del hero para el sitio público. Devuelve las slides activas ordenadas
 * por `sort_order`. Si la tabla no existe, está vacía o la consulta falla,
 * devuelve las slides estáticas por defecto.
 */
export async function getHomeHeroSlides(supabase: SupabaseClient): Promise<ResolvedHeroSlide[]> {
  let { data, error } = await supabase
    .from("home_hero_slides")
    .select(HERO_COLUMNS)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error?.message?.includes("image_focal")) {
    const fallback = await supabase
      .from("home_hero_slides")
      .select(HERO_COLUMNS_LEGACY)
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    data = fallback.data as typeof data;
    error = fallback.error;
  }

  if (error) {
    if (!error.message?.includes("home_hero_slides")) {
      console.error("[getHomeHeroSlides]", error.message);
    }
    return getStaticHeroSlides();
  }

  const rows = (data ?? []).map((row) => ({
    ...(row as HomeHeroSlideRow),
    image_focal_x: (row as HomeHeroSlideRow).image_focal_x ?? 50,
    image_focal_y: (row as HomeHeroSlideRow).image_focal_y ?? 50,
    image_zoom: (row as HomeHeroSlideRow).image_zoom ?? 1,
  })) as HomeHeroSlideRow[];
  const resolved = rows.map(resolveSlide).filter((s) => s.title || s.highlight || s.subtitle);
  return resolved.length > 0 ? resolved : getStaticHeroSlides();
}

export async function getHomeHeroSlidesForAdmin(
  supabase: SupabaseClient,
): Promise<{ data: HomeHeroSlideRow[] | null; error: Error | null }> {
  let { data, error } = await supabase
    .from("home_hero_slides")
    .select(HERO_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error?.message?.includes("image_focal")) {
    const fallback = await supabase
      .from("home_hero_slides")
      .select(HERO_COLUMNS_LEGACY)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    data = fallback.data as typeof data;
    error = fallback.error;
  }

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: (data ?? []).map((row) => ({
      ...(row as HomeHeroSlideRow),
      image_focal_x: (row as HomeHeroSlideRow).image_focal_x ?? 50,
      image_focal_y: (row as HomeHeroSlideRow).image_focal_y ?? 50,
      image_zoom: (row as HomeHeroSlideRow).image_zoom ?? 1,
    })) as HomeHeroSlideRow[],
    error: null,
  };
}
