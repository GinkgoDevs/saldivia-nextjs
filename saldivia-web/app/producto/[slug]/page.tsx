import ProductGalleryCarousel from "@/app/components/ProductGalleryCarousel";
import { ProductJsonLd } from "@/app/components/ProductJsonLd";
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

  return (
    <div className="bg-surface text-on-surface font-headline">
      <ProductJsonLd
        name={model.name}
        description={model.description}
        imageUrl={hero}
        slug={slug}
      />
      <main>
        <section className="relative h-[600px] overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0">
            <img
              alt=""
              className="h-full w-full object-cover opacity-60"
              src={hero}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-center px-8">
            <div className="container mx-auto max-w-3xl">
              <span className="mb-6 inline-block bg-saldivia-blue px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                Familia ARIES
              </span>
              <h1 className="mb-6 text-5xl font-black leading-none tracking-tighter text-white md:text-7xl">
                {model.name}
              </h1>
              <p className="mb-8 max-w-2xl text-xl font-light leading-relaxed text-on-primary-container">
                {model.description ??
                  "Uniendo caminos. El estándar de eficiencia para traslados de media y larga distancia, con la precisión Saldivia en cada unidad."}
              </p>
              <div className="flex flex-wrap gap-4">
                {model.pdf_url && (
                  <a
                    href={model.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass({ variant: "primary", size: "md" })}
                  >
                    Descargar ficha (PDF)
                  </a>
                )}
                <Link
                  href="/contacto"
                  className={buttonClass({
                    variant: "outline",
                    size: "md",
                    className: "border-white/40 text-white hover:bg-white/10",
                  })}
                >
                  Cotizar
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ProductGalleryCarousel images={gallery} altPrefix={altPrefix} />

        <section className="border-y border-outline-variant/30 bg-white py-24">
          <div className="container mx-auto max-w-4xl px-8 text-center">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-saldivia-blue">Saldivia Precision</h3>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-primary">Configuración y asesoramiento</h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-saldivia-blue" />
            <p className="mt-6 text-on-surface-variant">
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

        <section className="bg-surface-container-low py-24">
          <div className="container mx-auto max-w-5xl px-8">
            <div className="mb-12">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-saldivia-blue">Especificaciones</h3>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-primary">Ficha resumida</h2>
              <div className="mt-4 h-1 w-24 bg-saldivia-blue" />
            </div>
            {sortedSpecs.length > 0 ? (
              <div className="overflow-x-auto rounded-sm border border-outline-variant/30 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {sortedSpecs.map((row) => (
                      <tr key={row.id} className="border-b border-outline-variant/20 last:border-0">
                        <th className="whitespace-nowrap bg-surface-container-low/80 px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-primary">
                          {row.spec_key}
                        </th>
                        <td className="px-6 py-4 font-medium text-on-surface-variant">{row.spec_value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-on-surface-variant">
                Las especificaciones detalladas se publican desde el panel de administración o consulte con nuestro
                equipo.
              </p>
            )}

            <ul className="mt-10 grid list-none grid-cols-1 gap-6 md:grid-cols-2">
              {[
                "Estructura en perfiles tubulares de acero al carbono de alta resistencia.",
                "Revestimiento externo con acabados y procesos de pintura bajo control industrial.",
                "Interior diseñable según servicio, confort y normativa de aplicación.",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-saldivia-blue">check_circle</span>
                  <span className="text-sm font-medium leading-relaxed text-on-surface-variant">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative flex h-[500px] items-center overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <img alt="" className="h-full w-full object-cover" src={interiorSrc} />
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" />
          </div>
          <div className="container relative z-10 mx-auto px-8">
            <div className="max-w-xl border border-white/10 bg-white/5 p-12 glass-panel">
              <h5 className="mb-6 text-4xl font-black uppercase text-white">Diseño y confort a medida</h5>
              <p className="mb-8 text-on-primary-container">
                Interior y acabados que refuerzan su marca de transporte. Coordinamos ingeniería, homologación y
                acompañamiento de postventa.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-saldivia-blue">
                    <span className="material-symbols-outlined text-white">airline_seat_recline_extra</span>
                  </div>
                  <span className="font-medium text-white">Asientos y layout según reglamentación y servicio</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-saldivia-blue">
                    <span className="material-symbols-outlined text-white">ac_unit</span>
                  </div>
                  <span className="font-medium text-white">Climatización y confort de marcha</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
