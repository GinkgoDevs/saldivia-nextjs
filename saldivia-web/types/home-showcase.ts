export type ShowcaseMetric = { value: string; label: string };

export type HomeShowcaseSlideRow = {
  id: string;
  model_id: string;
  sort_order: number;
  hero_image_url: string | null;
  hero_image_focal_x?: number;
  hero_image_focal_y?: number;
  hero_image_zoom?: number;
  eyebrow: string | null;
  lead: string | null;
  metrics: ShowcaseMetric[] | null;
};

export type ResolvedHomeShowcaseSlide = {
  id: string;
  slug: string;
  name: string;
  heroSrc: string;
  heroFocalX: number;
  heroFocalY: number;
  heroZoom: number;
  eyebrow: string;
  lead: string;
  specRows: { key: string; value: string }[];
  metrics: ShowcaseMetric[];
  pdfUrl: string | null;
};
