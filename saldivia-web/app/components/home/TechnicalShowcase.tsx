import { TechnicalShowcaseClient } from "@/app/components/home/TechnicalShowcaseClient";
import { getShowcaseSlidesFromModels } from "@/lib/supabase/home-showcase";
import { createClient } from "@/lib/supabase/server";
import type { ResolvedHomeShowcaseSlide } from "@/types/home-showcase";

const SLIDES: ResolvedHomeShowcaseSlide[] = [
  {
    id: "showcase-aries-405",
    slug: "aries-405",
    name: "Aries 405 DD",
    heroSrc: "/ARIES-305/345_1.png",
    heroFocalX: 50,
    heroFocalY: 50,
    heroZoom: 1,
    eyebrow: "LONG DISTANCE SERIES",
    lead: "Buque insignia de dos pisos diseñado para máxima rentabilidad y confort premium.",
    specRows: [
      { key: "Configuración", value: "Doble Piso (6×2 / 8×2)" },
      { key: "Altura total", value: "4.05 Metros" },
    ],
    metrics: [
      { value: "98%", label: "Aislamiento acústico" },
      { value: "ABS+EBS", label: "Frenado" },
    ],
    pdfUrl: null,
  },
  {
    id: "showcase-aries-365",
    slug: "aries-365",
    name: "Aries 365",
    heroSrc: "/ARIES-305/345_4.png",
    heroFocalX: 50,
    heroFocalY: 50,
    heroZoom: 1,
    eyebrow: "LARGA DISTANCIA",
    lead: "Plataforma interprovincial con estándares de confort y seguridad Saldivia.",
    specRows: [
      { key: "Motorización", value: "Diesel Euro V / Euro VI" },
      { key: "Operación", value: "Corredores nacionales" },
    ],
    metrics: [
      { value: "40+", label: "Años de ingeniería" },
      { value: "ISO", label: "Certificación" },
    ],
    pdfUrl: null,
  },
  {
    id: "showcase-aries-305",
    slug: "aries-305",
    name: "Aries 305",
    heroSrc: "/ARIES-305/345_5.png",
    heroFocalX: 50,
    heroFocalY: 50,
    heroZoom: 1,
    eyebrow: "SERIE VERSÁTIL",
    lead: "Bus versátil disponible en versiones turismo 4×2, 4×4 y urbano para adaptarse a distintas rutas.",
    specRows: [
      { key: "Largo", value: "12,00 m" },
      { key: "Aplicación", value: "Turismo · 4×4 · Urbano" },
    ],
    metrics: [
      { value: "3", label: "Configuraciones" },
      { value: "4×4", label: "Opción todo terreno" },
    ],
    pdfUrl: null,
  },
];

export async function TechnicalShowcase() {
  let slides = SLIDES;
  try {
    const supabase = await createClient();
    const fromModels = await getShowcaseSlidesFromModels(supabase);
    if (fromModels.length > 0) {
      slides = fromModels;
    }
  } catch (err) {
    console.error("[TechnicalShowcase] fallback to static slides:", err);
  }

  return <TechnicalShowcaseClient slides={slides} />;
}
