import ProductGalleryCarousel from "@/app/components/ProductGalleryCarousel";
import { ProductJsonLd } from "@/app/components/ProductJsonLd";
import { ProductVariantSpecs } from "@/app/components/producto/ProductVariantSpecs";
import { ProductoHeroStagger } from "@/app/components/producto/ProductoHeroStagger";
import { FadeUp } from "@/app/components/motion";
import { getAries305GalleryPaths } from "@/lib/aries-305-gallery";
import { getModelBySlug, getActiveModelSlugs } from "@/lib/supabase/model-detail";
import { createStaticClient } from "@/lib/supabase/static-client";
import { createClient } from "@/lib/supabase/server";
import { buttonClass } from "@/app/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const DEFAULT_GALLERY = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBl35QlkaqDVVp_W4DopBaNChJ0xBztpjtERM2fPqE7qXeq6XrFgG-NAz_Z790vCf_tvHdNxNcsw2si0Q809vVT2IIxa-8-pKirMysbZzKAixDsgkOk5g7j5L3iq8yhTtVvKPej3zk5x34VHu_8vR_0VpHSHmxWe-rn6BWgBpjvTT18-zXh8NuINlfEXw_HwA7OkiMEZSN15DmNpOgh4EZ1RAYQs5ny5huSEQHDgQhepO64JXKlUw91iyKUzv9fREXJQFYz3a05Mt17",
] as const;

const DEFAULT_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAa81PkDYDCwb4mk_Oa2HLAVwSfDCyhiRdRijLyE5Hdd_JvlS1LxSySncTX8BZktEgIvF-u7qIUADgsgWMN8vjxHp_4m4_3Nbn_bJ2dMUk7NgcaLizLMXBEcGce77x2gDuLaSJ5rOGs9uQKh3WVc7CERcZxjHGtR9ujp0cQ_Y3xdXquEWDcf5fvULA5ttylFrHRQ5gfrUzSXUztJgI3EulsY-Cud__9SXFvDCruOYAzPDcROn1apERN1wpB5pDNc6vXAhcfWGqly7bX";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const slugs = await getActiveModelSlugs(supabase);
  if (!slugs) return [];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const detail = await getModelBySlug(supabase, slug);
  if (!detail) {
    return { title: "Modelo | Saldivia" };
  }
  const { model } = detail;
  const desc = model.description?.slice(0, 160) ?? `Ficha técnica ${model.name} — Saldivia Carrocerías.`;
  return {
    title: `${model.name} | Saldivia Carrocerías`,
    description: desc,
    openGraph: {
      title: model.name,
      description: desc,
    },
  };
}

function galleryFor(slug: string, detail: Awaited<ReturnType<typeof getModelBySlug>>) {
  if (!detail) return [...DEFAULT_GALLERY];
  const fromDb = detail.images.map((i) => i.image_url).filter(Boolean);
  if (fromDb.length > 0) return fromDb;
  if (slug === "aries-305") {
    const disk = getAries305GalleryPaths();
    if (disk.length > 0) return disk;
  }
  if (detail.model.cover_image_url) return [detail.model.cover_image_url];
  return [...DEFAULT_GALLERY];
}

export default async function ProductoPage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = raw.toLowerCase();
  const supabase = await createClient();
  const detail = await getModelBySlug(supabase, slug);
  if (!detail) {
    notFound();
  }
  const { model, products, general_features, variants } = detail;
  const gallery = galleryFor(slug, detail);
  const altPrefix = model.name;
  const hero =
    model.hero_background_image_url ?? model.cover_image_url ?? gallery[0] ?? DEFAULT_HERO;
  const hasCustomHero = Boolean(model.hero_background_image_url?.trim());
  const heroFocalX = model.hero_background_focal_x ?? 50;
  const heroFocalY = model.hero_background_focal_y ?? 50;
  const heroZoom = model.hero_background_zoom ?? 1;
  const defaultDesc =
    "Uniendo caminos. El estándar de eficiencia para traslados de media y larga distancia, con la precisión Saldivia en cada unidad.";

  return (
    <div className="bg-surface text-on-surface font-headline">
      <ProductJsonLd
        name={model.name}
        description={model.description}
        imageUrl={hero}
        slug={slug}
      />
      <main>
        <section className="relative flex min-h-[min(100svh,880px)] flex-col justify-end overflow-hidden bg-primary pb-14 pt-28 sm:min-h-[min(92svh,760px)] sm:justify-center sm:pb-16 sm:pt-24 md:pb-20 md:pt-28 lg:min-h-[min(88svh,820px)]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className={
                hasCustomHero
                  ? "pointer-events-none absolute inset-0"
                  : "pointer-events-none absolute left-1/2 top-1/2 h-[112%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2 md:h-[110%] md:w-[115%]"
              }
            >
              <img
                alt=""
                className={
                  hasCustomHero
                    ? "animate-product-hero-image h-full w-full object-cover"
                    : "animate-product-hero-image h-full w-full object-cover object-[62%_42%] opacity-[0.70] md:opacity-[0.76]"
                }
                src={hero}
                style={
                  hasCustomHero
                    ? {
                        objectPosition: `${heroFocalX}% ${heroFocalY}%`,
                        transform: heroZoom > 1 ? `scale(${heroZoom})` : undefined,
                        transformOrigin: `${heroFocalX}% ${heroFocalY}%`,
                      }
                    : undefined
                }
              />
            </div>
            {hasCustomHero ? (
              <>
                <div
                  className="absolute inset-0 md:hidden"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,23,50,0.92) 0%, rgba(0,23,50,0.55) 42%, rgba(0,23,50,0.18) 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 hidden md:block"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(105deg, rgba(0,23,50,0.9) 0%, rgba(0,23,50,0.78) 28%, rgba(0,23,50,0.35) 52%, rgba(0,23,50,0.08) 68%, transparent 82%)",
                  }}
                />
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 md:hidden"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(to top, #001732 0%, rgba(0,23,50,0.78) 38%, rgba(0,23,50,0.35) 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 hidden md:block"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(105deg, #001732 0%, rgba(0,23,50,0.93) 38%, rgba(0,23,50,0.52) 62%, rgba(0,23,50,0.12) 85%, transparent 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_75%_at_15%_85%,rgba(32,149,212,0.28)_0%,transparent_52%)] mix-blend-screen opacity-90 md:opacity-100"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,8,18,0.55)_100%)] opacity-80 md:opacity-[0.65]"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.07] industrial-grid mix-blend-overlay"
                  aria-hidden
                />
              </>
            )}
          </div>
          <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="container mx-auto max-w-7xl">
              <ProductoHeroStagger
                name={model.name}
                description={model.description ?? defaultDesc}
                pdfUrl={model.pdf_url}
              />
            </div>
          </div>
        </section>

        <ProductGalleryCarousel images={gallery} altPrefix={altPrefix} showcase />

        <section className="bg-surface-container-low py-12 sm:py-16 md:py-20">
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8">
            <FadeUp size="sm">
              <div className="mb-8 sm:mb-10">
                <p className="ui-section-eyebrow mb-2 text-saldivia-blue">Especificaciones</p>
                <h2 className="ui-section-title text-primary">Ficha resumida</h2>
                <div className="mt-4 h-1 w-20 bg-saldivia-blue sm:w-24" />
              </div>
            </FadeUp>

            <ProductVariantSpecs
              sharedProducts={products}
              sharedFeatures={general_features}
              variants={variants.map((v) => ({
                id: v.id,
                code: v.code,
                name: v.name,
                description: v.description,
                is_default: v.is_default,
                products: v.products,
                general_features: v.general_features,
              }))}
            />
          </div>
        </section>

        <section
          className="relative overflow-hidden bg-primary py-16 md:py-20 lg:py-24"
          aria-labelledby="producto-cta-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0d2c4f] via-[#081b31] to-[#020817]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_40%,rgba(32,149,212,0.22)_0%,transparent_52%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_72%,rgba(56,189,248,0.12)_0%,transparent_48%)]"
            aria-hidden
          />
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]" aria-hidden>
            <defs>
              <pattern id="productoCtaCircuit" width="72" height="72" patternUnits="userSpaceOnUse">
                <path
                  d="M36 8v56M8 36h56M52 52L20 20M52 20L20 52"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.45"
                />
                <circle cx="36" cy="36" r="1" fill="#38bdf8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#productoCtaCircuit)" />
          </svg>
          <div
            className="pointer-events-none absolute -right-24 top-1/2 h-[min(420px,70vw)] w-[min(420px,70vw)] -translate-y-1/2 rounded-full border border-cyan-400/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 border-l-2 border-t-2 border-accent-blue/25"
            aria-hidden
          />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
            <div className="mx-auto flex max-w-2xl flex-col rounded-curve-lg border border-white/15 bg-white p-8 shadow-[0px_32px_80px_rgba(0,0,0,0.35)] sm:p-10 md:p-12">
                <p className="ui-section-eyebrow mb-3 text-saldivia-blue">Saldivia Precision</p>
                <h2
                  id="producto-cta-heading"
                  className="ui-section-title mb-4 text-primary sm:mb-5"
                >
                  Configuración y asesoramiento
                </h2>
                <div className="technical-gradient mb-6 h-1 w-24" />
                <p className="mb-8 text-base leading-relaxed text-on-surface-variant md:text-lg">
                  Cada unidad puede dimensionarse con orientación comercial y técnica. Solicite variantes,
                  equipamiento y documentación para las unidades de su flota.
                </p>
                <Link
                  href="/trabaja-con-nosotros"
                  className={buttonClass({
                    variant: "primary",
                    size: "lg",
                    className: "self-start rounded-curve-md px-8",
                  })}
                >
                  Contacto comercial
                </Link>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}
