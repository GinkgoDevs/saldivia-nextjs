import ProductGalleryCarousel from "../../components/ProductGalleryCarousel";
import { getAries305GalleryPaths } from "@/lib/aries-305-gallery";

interface Props {
  params: { slug: string };
}

const DEFAULT_GALLERY_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBl35QlkaqDVVp_W4DopBaNChJ0xBztpjtERM2fPqE7qXeq6XrFgG-NAz_Z790vCf_tvHdNxNcsw2si0Q809vVT2IIxa-8-pKirMysbZzKAixDsgkOk5g7j5L3iq8yhTtVvKPej3zk5x34VHu_8vR_0VpHSHmxWe-rn6BWgBpjvTT18-zXh8NuINlfEXw_HwA7OkiMEZSN15DmNpOgh4EZ1RAYQs5ny5huSEQHDgQhepO64JXKlUw91iyKUzv9fREXJQFYz3a05Mt17",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBhEV-y4sRKcJO2BpjLPmabNqqO92WDmJe0grKwAt8QKFpguZ7BxayAwB-4TxyAhi9sQc9G-Ctl0IhlxDBpvnDRfHVLFHUMTTvQOwkzYJ56WGivN9e6uZC_A7IBLvZJeOEV1iLuiKoSsy0LaaZA3od5MAGYqfoaN8u2kaqpoW7FrH2RtQZzJdb3JPtdadzuC2NKn_M9XAOvWPegQ4Li5OxJ7DqPtLnrpFXwDIfB6AB7RLDmcV0wV0U1nZltKjoYxat1aL7wxl32I1ol",
] as const;

export default function ProductoPage({ params }: Props) {
  const slugKey = params.slug.toLowerCase();
  const aries305FromDisk =
    slugKey === "aries-305" ? getAries305GalleryPaths() : null;
  const galleryImages =
    aries305FromDisk && aries305FromDisk.length > 0
      ? aries305FromDisk
      : DEFAULT_GALLERY_IMAGES;
  const galleryAltPrefix =
    aries305FromDisk && aries305FromDisk.length > 0
      ? "Aries 305"
      : `Modelo ${params.slug}`;
  const heroSrc =
    aries305FromDisk && aries305FromDisk.length > 0
      ? aries305FromDisk[0]
      : undefined;

  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0">
            <img
              alt="Ultra-modern Aries bus"
              className="w-full h-full object-cover opacity-60"
              src={
                heroSrc ??
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAa81PkDYDCwb4mk_Oa2HLAVwSfDCyhiRdRijLyE5Hdd_JvlS1LxSySncTX8BZktEgIvF-u7qIUADgsgWMN8vjxHp_4m4_3Nbn_bJ2dMUk7NgcaLizLMXBEcGce77x2gDuLaSJ5rOGs9uQKh3WVc7CERcZxjHGtR9ujp0cQ_Y3xdXquEWDcf5fvULA5ttylFrHRQ5gfrUzSXUztJgI3EulsY-Cud__9SXFvDCruOYAzPDcROn1apERN1wpB5pDNc6vXAhcfWGqly7bX"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent"></div>
          </div>
          <div className="relative z-10 container mx-auto px-8 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <span className="inline-block bg-saldivia-blue text-white px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.1em] uppercase">Familia ARIES</span>
              <h1 className="text-white text-7xl font-black leading-none tracking-tighter mb-6">
                Modelo {params.slug.toUpperCase()}
              </h1>
              <p className="text-on-primary-container text-xl font-light mb-8 max-w-2xl leading-relaxed">
                Uniendo caminos. El estándar de eficiencia para traslados de media y larga distancia. Versatilidad absoluta en configuraciones de 12 y 13.20 metros.
              </p>
            </div>
          </div>
        </section>

        <ProductGalleryCarousel images={galleryImages} altPrefix={galleryAltPrefix} />

        {/* Model Variants */}
        <section className="py-24 bg-white border-y border-outline-variant/30">
          <div className="container mx-auto px-8">
            <div className="mb-12 text-center">
              <h3 className="text-saldivia-blue text-sm font-bold tracking-[0.3em] uppercase mb-4">Saldivia Precision</h3>
              <h2 className="text-primary text-4xl font-black tracking-tighter uppercase">VARIANTES DISPONIBLES</h2>
              <div className="h-1 w-24 bg-saldivia-blue mt-4 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="variant-card bg-surface-container-low p-8 border-t-4 border-saldivia-blue flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-black text-primary mb-2">Turismo 4x2</h4>
                  <p className="text-on-surface-variant text-sm font-medium tracking-tight italic opacity-80">Configuración estándar</p>
                </div>
                <button className="mt-8 w-full py-2 border border-primary text-primary font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                  Ver Especificaciones
                </button>
              </div>
              <div className="variant-card bg-surface-container-low p-8 border-t-4 border-saldivia-blue flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-black text-primary mb-2">4x4</h4>
                  <p className="text-on-surface-variant text-sm font-medium tracking-tight italic opacity-80">Tracción total</p>
                </div>
                <button className="mt-8 w-full py-2 border border-primary text-primary font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                  Ver Especificaciones
                </button>
              </div>
              <div className="variant-card bg-surface-container-low p-8 border-t-4 border-saldivia-blue flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-black text-primary mb-2">Urbano</h4>
                  <p className="text-on-surface-variant text-sm font-medium tracking-tight italic opacity-80">Uso citadino</p>
                </div>
                <button className="mt-8 w-full py-2 border border-primary text-primary font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                  Ver Especificaciones
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* General Characteristics */}
        <section className="py-24 bg-surface-container-low">
          <div className="container mx-auto px-8 max-w-5xl">
            <div className="mb-16">
              <h3 className="text-saldivia-blue text-sm font-bold tracking-[0.3em] uppercase mb-4">Saldivia Precision</h3>
              <h2 className="text-primary text-4xl font-black tracking-tighter uppercase">CARACTERÍSTICAS GENERALES</h2>
              <div className="h-1 w-24 bg-saldivia-blue mt-4"></div>
            </div>
            <div className="bg-white p-8 md:p-12 shadow-sm border-l-8 border-saldivia-blue">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  "Estructura en perfiles tubulares de acero-carbono de alta resistencia.",
                  "Puerta de ascenso pantográfica con sistema de traba neumática.",
                  "Revestimiento externo en acero galvanizado y Fiberglass.",
                  "Bodegas pasantes con acceso lateral y revestimiento galvanizado.",
                  "Interior climatizado con aire acondicionado y calefacción.",
                  "Sensores de retroceso y sistema de audio de serie.",
                  "Asientos reclinables tipo Turismo, Semicama o Ejecutivo.",
                  "Configuraciones personalizables con o sin sanitario.",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-saldivia-blue mt-0.5">check_circle</span>
                    <span className="text-on-surface-variant font-medium text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Interior Showcase */}
        <section className="h-[500px] flex items-center bg-primary relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              alt="Interior luxury detail"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl35QlkaqDVVp_W4DopBaNChJ0xBztpjtERM2fPqE7qXeq6XrFgG-NAz_Z790vCf_tvHdNxNcsw2si0Q809vVT2IIxa-8-pKirMysbZzKAixDsgkOk5g7j5L3iq8yhTtVvKPej3zk5x34VHu_8vR_0VpHSHmxWe-rn6BWgBpjvTT18-zXh8NuINlfEXw_HwA7OkiMEZSN15DmNpOgh4EZ1RAYQs5ny5huSEQHDgQhepO64JXKlUw91iyKUzv9fREXJQFYz3a05Mt17"
            />
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm"></div>
          </div>
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-xl bg-white/5 p-12 glass-panel border border-white/10">
              <h5 className="text-white text-4xl font-black mb-6 uppercase">El Lujo de la Precisión</h5>
              <p className="text-on-primary-container mb-8">
                Materiales de alta resistencia y texturas táctiles que elevan la experiencia del viaje en cada una de sus variantes.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-saldivia-blue flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">airline_seat_recline_extra</span>
                  </div>
                  <span className="text-white font-medium">Asientos Ergo-Soft Premium</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-saldivia-blue flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">ac_unit</span>
                  </div>
                  <span className="text-white font-medium">Climatización Inteligente</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
