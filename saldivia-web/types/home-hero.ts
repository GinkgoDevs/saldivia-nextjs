export type HomeHeroSlideRow = {
  id: string;
  sort_order: number;
  image_url: string | null;
  image_alt: string | null;
  eyebrow: string | null;
  title: string | null;
  highlight: string | null;
  subtitle: string | null;
  primary_label: string | null;
  primary_href: string | null;
  secondary_label: string | null;
  secondary_href: string | null;
  active: boolean;
  created_at?: string;
};

export type HeroCta = { label: string; href: string };

/** Slide ya resuelta para render en el hero del home. */
export type ResolvedHeroSlide = {
  id: string;
  bg: string;
  bgAlt: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primary: HeroCta | null;
  secondary: HeroCta | null;
};
