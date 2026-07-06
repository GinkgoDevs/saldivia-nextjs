import type { Product } from "@/types/product";

export type ModelSegment = "urbano" | "interurbano" | "interprovincial" | "especiales";

export type ModelGeneralFeature = {
  id: string;
  model_id: string;
  /** NULL = compartida entre todas las variantes del modelo */
  variant_id?: string | null;
  body: string;
  sort_order: number | null;
};

/** Configuración / variante de un modelo (ej. 4x2, 4x4, motor delantero). */
export type ModelVariant = {
  id: string;
  model_id: string;
  code: string;
  name: string;
  description: string | null;
  is_default: boolean;
  sort_order: number | null;
};

export type ModelVariantAdmin = ModelVariant & {
  products?: Product[];
  model_general_features?: ModelGeneralFeature[];
};

export type ModelImage = {
  id: string;
  model_id: string;
  image_url: string;
  sort_order: number | null;
};

export type Model = {
  id: string;
  slug: string;
  name: string;
  segment: ModelSegment;
  description: string | null;
  /** Portada en tarjetas /flota y mega menú visual cuando aplique */
  cover_image_url: string | null;
  /** Fondo del hero en la ficha /producto/[slug]; si falta, se usa cover_image_url */
  hero_background_image_url: string | null;
  /** Encuadre del hero (0–100). */
  hero_background_focal_x: number;
  hero_background_focal_y: number;
  /** Zoom del hero (1 = normal). */
  hero_background_zoom: number;
  pdf_url: string | null;
  active: boolean;
  /** Si true, el modelo se muestra en el "Showcase técnico" del home. */
  show_in_showcase: boolean;
  created_at: string;
  sort_order: number | null;
};

/** Listado admin con relaciones embebidas desde Supabase. */
export type ModelAdmin = Model & {
  model_variants?: ModelVariantAdmin[];
  /** Specs compartidas (variant_id NULL) */
  model_general_features?: ModelGeneralFeature[];
  products?: Product[];
};
