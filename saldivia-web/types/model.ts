export type ModelSegment = "urbano" | "interurbano" | "interprovincial";

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
