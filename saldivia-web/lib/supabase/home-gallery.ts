import type { SupabaseClient } from "@supabase/supabase-js";

import { STATIC_GALLERY_IMAGES } from "@/lib/home-gallery-data";
import type { HomeGallerySlideRow, ResolvedGalleryImage } from "@/types/home-gallery";

export { STATIC_GALLERY_IMAGES };

const GALLERY_COLUMNS = "id, sort_order, image_url, image_alt, active, created_at";

function resolveSlide(row: HomeGallerySlideRow): ResolvedGalleryImage | null {
  const src = row.image_url?.trim();
  if (!src) return null;
  return {
    id: row.id,
    src,
    alt: row.image_alt?.trim() || "Galería de innovación Saldivia",
  };
}

/**
 * Imágenes activas de la galería del home, ordenadas.
 * Si la tabla no existe o falla la consulta → fotos estáticas.
 * Si la tabla existe y no hay filas activas → array vacío (se oculta la sección).
 */
export async function getHomeGalleryImages(
  supabase: SupabaseClient,
): Promise<ResolvedGalleryImage[]> {
  const { data, error } = await supabase
    .from("home_gallery_slides")
    .select(GALLERY_COLUMNS)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!error.message?.includes("home_gallery_slides")) {
      console.error("[getHomeGalleryImages]", error.message);
    }
    return STATIC_GALLERY_IMAGES;
  }

  const resolved = ((data ?? []) as HomeGallerySlideRow[])
    .map(resolveSlide)
    .filter((img): img is ResolvedGalleryImage => img !== null);

  return resolved;
}

export async function getHomeGallerySlidesForAdmin(
  supabase: SupabaseClient,
): Promise<{ data: HomeGallerySlideRow[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("home_gallery_slides")
    .select(GALLERY_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: (data ?? []) as HomeGallerySlideRow[], error: null };
}
