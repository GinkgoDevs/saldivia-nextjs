export type ModelSegment = "urbano" | "interurbano" | "interprovincial" | "especiales";

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
  cover_image_url: string | null;
  pdf_url: string | null;
  active: boolean;
  created_at: string;
  sort_order: number | null;
};
