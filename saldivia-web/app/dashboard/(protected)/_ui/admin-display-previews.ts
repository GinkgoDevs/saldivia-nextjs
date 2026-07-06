/** Aspectos y estilos de preview alineados a cómo se ven en el sitio público. */
import { IMAGE_ZOOM_RANGE } from "@/lib/image-focal";

export const SITE_IMAGE_PREVIEW = {
  catalogCover: {
    aspect: "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4]",
    objectFit: "contain" as const,
    bg: "bg-surface-container-lowest",
    maxWidth: "max-w-sm",
    zoomMin: IMAGE_ZOOM_RANGE.contain.min,
    zoomMax: IMAGE_ZOOM_RANGE.contain.max,
  },
  productHero: {
    aspect: "aspect-[3/4] sm:aspect-video lg:aspect-[21/9]",
    objectFit: "cover" as const,
    bg: "bg-primary",
    maxWidth: "max-w-2xl",
    zoomMin: IMAGE_ZOOM_RANGE.cover.min,
    zoomMax: IMAGE_ZOOM_RANGE.cover.max,
  },
  homeHero: {
    aspect: "aspect-[3/4] sm:aspect-[16/9]",
    objectFit: "cover" as const,
    bg: "bg-slate-900",
    maxWidth: "max-w-3xl",
    zoomMin: IMAGE_ZOOM_RANGE.cover.min,
    zoomMax: IMAGE_ZOOM_RANGE.cover.max,
  },
  showcase: {
    aspect: "aspect-[4/3] sm:aspect-[16/10]",
    objectFit: "contain" as const,
    bg: "bg-industrial-charcoal",
    maxWidth: "max-w-xl",
    imageClassName: "object-contain object-center p-6 sm:p-8",
    zoomMin: IMAGE_ZOOM_RANGE.contain.min,
    zoomMax: IMAGE_ZOOM_RANGE.contain.max,
  },
  mapProject: {
    aspect: "aspect-[4/3]",
    objectFit: "cover" as const,
    bg: "bg-[#0a1e36]",
    maxWidth: "max-w-xs",
    zoomMin: IMAGE_ZOOM_RANGE.cover.min,
    zoomMax: IMAGE_ZOOM_RANGE.cover.max,
  },
  productGallery: {
    aspect: "aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/5]",
    objectFit: "contain" as const,
    bg: "bg-white",
    maxWidth: "max-w-sm",
    zoomMin: IMAGE_ZOOM_RANGE.contain.min,
    zoomMax: IMAGE_ZOOM_RANGE.contain.max,
  },
} as const;

export type SiteImagePreviewKey = keyof typeof SITE_IMAGE_PREVIEW;
