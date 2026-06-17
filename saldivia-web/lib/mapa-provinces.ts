/** Carpetas en `public/02  MAPA/` → slug del SVG (`argentinaProvinceMapData.json`). */
export const MAPA_FOLDER_TO_SLUG: Record<string, string> = {
  "BUENOS AIRES": "buenos-aires",
  CABA: "ciudad-de-buenos-aires",
  CATAMARCA: "catamarca",
  CHACO: "chaco",
  CHUBUT: "chubut",
  CORDOBA: "cordoba",
  CORRIENTES: "corrientes",
  "ENTRE RIOS": "entre-rios",
  JUJUY: "jujuy",
  "LA RIOJA": "la-rioja",
  MENDOZA: "mendoza",
  MISIONES: "misiones",
  NEUQUEN: "neuquen",
  "RIO NEGRO": "rio-negro",
  SALTA: "salta",
  "SAN JUAN": "san-juan",
  "SAN LUIS": "san-luis",
  "SANTA CRUZ": "santa-cruz",
  "SANTA FE": "santa-fe",
  "SANTIAGO DEL ESTERO": "santiago-del-estero",
  "TIERRA DEL FUEGO": "tierra-del-fuego",
  TUCUMAN: "tucuman",
};

export const MAPA_PUBLIC_ROOT = "/02  MAPA";

/** Convierte segmentos de ruta a URL pública (espacios y caracteres especiales). */
export function mapaPublicUrl(...segments: string[]): string {
  const path = [MAPA_PUBLIC_ROOT, ...segments].join("/");
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")
    .replace(/^%2F/, "/");
}
