import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/** Misma estructura, overlay y disposición que el hero de /flota */
export const PAGE_HERO_SECTION_CLASS =
  "relative flex min-h-[min(100svh,520px)] items-center overflow-hidden pt-20 pb-12 sm:min-h-[420px] sm:pt-16 sm:pb-0 md:min-h-[480px]";

export const PAGE_HERO_EYEBROW_CLASS =
  "ui-section-eyebrow mb-4 block text-accent-blue";

/** Acento en títulos de hero (siempre sobre fondo oscuro) */
export const PAGE_HERO_ACCENT_CLASS = "text-accent-blue";

export const PAGE_HERO_TITLE_CLASS =
  "max-w-4xl font-headline text-3xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-6xl lg:text-7xl";

export const PAGE_HERO_LEAD_CLASS =
  "mt-0 max-w-2xl font-headline text-sm font-medium leading-relaxed text-on-primary-container sm:mt-2 sm:text-base md:text-lg";

export const PAGE_HERO_CONTENT_CLASS =
  "relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8";

export const PAGE_HERO_IMAGE_POSITION_CLASS =
  "object-cover object-[50%_72%] sm:object-[50%_68%] md:object-[50%_65%]";

function PageHeroOverlays() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-0 industrial-grid-light opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
    </>
  );
}

type PageHeroImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

export function PageHeroImage({
  src,
  alt,
  className = PAGE_HERO_IMAGE_POSITION_CLASS,
  style,
  priority = false,
}: PageHeroImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      style={style}
      priority={priority}
      sizes="100vw"
    />
  );
}

type PageHeroProps = {
  /** Imagen de fondo: usar PageHeroImage o un nodo personalizado (p. ej. ficha de producto). */
  image: ReactNode;
  children: ReactNode;
};

export function PageHero({ image, children }: PageHeroProps) {
  return (
    <section className={PAGE_HERO_SECTION_CLASS}>
      <div className="absolute inset-0">{image}</div>
      <PageHeroOverlays />
      <div className={PAGE_HERO_CONTENT_CLASS}>{children}</div>
    </section>
  );
}
