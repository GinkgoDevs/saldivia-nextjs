export type ShowcaseMetric = { value: string; label: string };

export type HomeShowcaseSlideRow = {
  id: string;
  model_id: string;
  sort_order: number;
  hero_image_url: string | null;
  eyebrow: string | null;
  lead: string | null;
  metrics: ShowcaseMetric[] | null;
};

export type ResolvedHomeShowcaseSlide = {
  id: string;
  slug: string;
  name: string;
  heroSrc: string;
  eyebrow: string;
  lead: string;
  specRows: { key: string; value: string }[];
  metrics: ShowcaseMetric[];
  pdfUrl: string | null;
};
