import ProductGalleryCarousel from "@/app/components/ProductGalleryCarousel";
import { ProductJsonLd } from "@/app/components/ProductJsonLd";
import { ProductVariantSpecs } from "@/app/components/producto/ProductVariantSpecs";
import { ProductoHeroStagger } from "@/app/components/producto/ProductoHeroStagger";
import { FadeUp } from "@/app/components/motion";
import { PageHero } from "@/app/components/PageHero";
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
  const fromDb = detail.images
    .filter((i) => i.image_url)
    .map((i) => ({
      src: i.image_url,
      focalX: i.focal_x ?? 50,
      focalY: i.focal_y ?? 50,
      zoom: i.zoom ?? 1,
    }));
  if (fromDb.length > 0) return fromDb;
  if (slug === "aries-305") {
    const disk = getAries305GalleryPaths();
    if (disk.length > 0) return disk;
  }
  if (detail.model.cover_image_url) {
    return [
      {
        src: detail.model.cover_image_url,
        focalX: detail.model.cover_image_focal_x ?? 50,
        focalY: detail.model.cover_image_focal_y ?? 50,
        zoom: detail.model.cover_image_zoom ?? 1,
      },
    ];
  }
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
  const firstGalleryItem = gallery[0];
  const firstGalleryUrl =
    typeof firstGalleryItem === "string" ? firstGalleryItem : firstGalleryItem?.src;
  const hero =
    model.hero_background_image_url ?? model.cover_image_url ?? firstGalleryUrl ?? DEFAULT_HERO;
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
        <PageHero
          image={
            <div
              className={
                hasCustomHero
                  ? "h-full w-full"
                  : "pointer-events-none absolute left-1/2 top-1/2 h-[112%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2 md:h-[110%] md:w-[115%]"
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className={
                  hasCustomHero
                    ? "h-full w-full object-cover"
                    : "h-full w-full object-cover object-[62%_42%]"
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
          }
        >
          <ProductoHeroStagger
            name={model.name}
            description={model.description ?? defaultDesc}
            pdfUrl={model.pdf_url}
          />
        </PageHero>

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
          className="relative overflow-hidden bg-primary-brand py-16 md:py-20 lg:py-24"
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
            <div className="mx-auto flex max-w-2xl flex-col rounded-curve-lg border border-outline-variant/25 bg-surface-container-lowest p-8 shadow-elev-3 sm:p-10 md:p-12">
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
