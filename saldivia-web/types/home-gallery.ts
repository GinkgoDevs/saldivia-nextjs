export type HomeGallerySlideRow = {
  id: string;
  sort_order: number;
  image_url: string;
  image_alt: string | null;
  active: boolean;
  created_at?: string;
};

/** Imagen ya resuelta para el carrusel público. */
export type ResolvedGalleryImage = {
  id: string;
  src: string;
  alt: string;
};
