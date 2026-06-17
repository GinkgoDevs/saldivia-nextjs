/**
 * Genera supabase/scripts/seed_mapa_projects.sql desde public/02  MAPA
 * Uso: node scripts/generate-mapa-seed-sql.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAPA_DIR = path.join(ROOT, "public", "02  MAPA");
const OUT = path.join(ROOT, "supabase", "scripts", "seed_mapa_projects.sql");

const MAPA_FOLDER_TO_SLUG = {
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

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function esc(s) {
  return s.replace(/'/g, "''");
}

function mapaPublicUrl(...segments) {
  return ["/02  MAPA", ...segments]
    .map((part) => encodeURIComponent(part))
    .join("/")
    .replace(/^%2F/, "/");
}

const rows = [];
for (const folder of fs.readdirSync(MAPA_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const slug = MAPA_FOLDER_TO_SLUG[folder.name];
  if (!slug) continue;
  const companies = fs
    .readdirSync(path.join(MAPA_DIR, folder.name), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, "es"));
  let sort = 0;
  for (const company of companies) {
    const files = fs.readdirSync(path.join(MAPA_DIR, folder.name, company));
    const cover = files
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "es"))[0];
    if (!cover) continue;
    rows.push({
      slug,
      company,
      folder: folder.name,
      img: mapaPublicUrl(folder.name, company, cover),
      sort: sort++,
    });
  }
}

let sql = "-- Generado desde public/02  MAPA\n";
sql += "ALTER TABLE public.province_projects ADD COLUMN IF NOT EXISTS image_url TEXT;\n";
sql +=
  "CREATE UNIQUE INDEX IF NOT EXISTS province_projects_slug_title_uq ON public.province_projects (province_slug, title);\n\n";

for (const r of rows) {
  sql += `INSERT INTO public.province_projects (province_slug, title, location_label, segment, image_url, sort_order, active) VALUES ('${esc(r.slug)}', '${esc(r.company)}', '${esc(r.folder)}', 'Flota Saldivia', '${esc(r.img)}', ${r.sort}, true) ON CONFLICT (province_slug, title) DO UPDATE SET image_url = EXCLUDED.image_url, location_label = EXCLUDED.location_label, segment = EXCLUDED.segment, sort_order = EXCLUDED.sort_order, active = EXCLUDED.active;\n`;
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, sql);
console.log(`Generado ${OUT} (${rows.length} proyectos)`);
