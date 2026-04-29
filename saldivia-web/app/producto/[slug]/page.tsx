import ProductGalleryCarousel from "@/app/components/ProductGalleryCarousel";
import { ProductJsonLd } from "@/app/components/ProductJsonLd";
import { ProductoFeatureList } from "@/app/components/producto/ProductoFeatureList";
import { ProductoHeroStagger } from "@/app/components/producto/ProductoHeroStagger";
import { ProductSpecTable } from "@/app/components/producto/ProductSpecTable";
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
  const { model, products } = detail;
  const gallery = galleryFor(slug, detail);
  const altPrefix = model.name;
  const hero = model.cover_image_url ?? gallery[0] ?? DEFAULT_HERO;
  const interiorSrc = gallery[1] ?? gallery[0] ?? DEFAULT_GALLERY[0];
  const sortedSpecs = [...products].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.spec_key.localeCompare(b.spec_key),
  );
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
        <section className="relative flex min-h-[min(100svh,640px)] flex-col justify-end overflow-hidden bg-primary pb-10 pt-24 sm:min-h-[480px] sm:justify-center sm:pb-0 sm:pt-0 md:min-h-[600px] md:h-[600px]">
          <div className="absolute inset-0 z-0">
            <img
              alt=""
              className="h-full w-full object-cover opacity-60"
              src={hero}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20 sm:bg-gradient-to-r sm:from-primary sm:via-primary/40 sm:to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-8">
            <div className="container mx-auto max-w-3xl">
              <ProductoHeroStagger
                familyLabel="Familia ARIES"
                name={model.name}
                description={model.description ?? defaultDesc}
                pdfUrl={model.pdf_url}
              />
            </div>
          </div>
        </section>

        <ProductGalleryCarousel images={gallery} altPrefix={altPrefix} />

        <FadeUp>
          <section className="border-y border-outline-variant/30 bg-white py-14 sm:py-20 md:py-24">
            <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 md:px-8">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-saldivia-blue sm:mb-4 sm:text-sm">
                Saldivia Precision
              </h3>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl md:text-4xl">
                Configuración y asesoramiento
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 bg-saldivia-blue sm:w-24" />
              <p className="mt-5 text-sm text-on-surface-variant sm:mt-6 sm:text-base">
                Cada unidad se puede dimensionar con orientación comercial y técnica. Solicitá variantes, equipamiento y
                documentación bajo unidades de su flota.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/contacto" className={buttonClass({ variant: "secondary", size: "md" })}>
                  Consultar con un asesor
                </Link>
              </div>
            </div>
          </section>
        </FadeUp>

        <section className="bg-surface-container-low py-14 sm:py-20 md:py-24">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
            <FadeUp size="sm">
              <div className="mb-8 sm:mb-12">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-saldivia-blue sm:mb-4 sm:text-sm">Especificaciones</h3>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl md:text-4xl">Ficha resumida</h2>
                <div className="mt-3 h-1 w-20 bg-saldivia-blue sm:mt-4 sm:w-24" />
              </div>
            </FadeUp>
            {sortedSpecs.length > 0 ? (
              <ProductSpecTable
                rows={sortedSpecs.map((row) => ({
                  id: row.id,
                  spec_key: row.spec_key,
                  spec_value: row.spec_value,
                }))}
              />
            ) : (
              <FadeUp>
                <p className="text-on-surface-variant">
                  Las especificaciones detalladas se publican desde el panel de administración o consulte con nuestro
                  equipo.
                </p>
              </FadeUp>
            )}

            <ProductoFeatureList />
          </div>
        </section>

        <section className="relative flex min-h-[420px] items-center overflow-hidden bg-primary py-12 sm:min-h-[480px] sm:py-0 md:h-[500px]">
          <div className="absolute inset-0">
            <img alt="" className="h-full w-full object-cover" src={interiorSrc} />
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" />
          </div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
            <FadeUp size="sm">
              <div className="glass-panel max-w-xl border border-white/10 bg-white/5 p-6 sm:p-10 md:p-12">
                <h5 className="mb-4 text-2xl font-black uppercase text-white sm:mb-6 sm:text-3xl md:text-4xl">Diseño y confort a medida</h5>
                <p className="mb-6 text-sm text-on-primary-container sm:mb-8 sm:text-base">
                  Interior y acabados que refuerzan su marca de transporte. Coordinamos ingeniería, homologación y
                  acompañamiento de postventa.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-saldivia-blue sm:h-10 sm:w-10">
                      <span className="material-symbols-outlined text-base text-white sm:text-[22px]">airline_seat_recline_extra</span>
                    </div>
                    <span className="text-sm font-medium text-white sm:text-base">Asientos y layout según reglamentación y servicio</span>
                  </div>
                  <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-saldivia-blue sm:h-10 sm:w-10">
                      <span className="material-symbols-outlined text-base text-white sm:text-[22px]">ac_unit</span>
                    </div>
                    <span className="text-sm font-medium text-white sm:text-base">Climatización y confort de marcha</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
    </div>
  );
}
