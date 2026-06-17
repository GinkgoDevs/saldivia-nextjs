/**
 * Sincroniza proyectos desde public/02  MAPA hacia Supabase (province_projects).
 *
 * Uso (desde saldivia-web/):
 *   node scripts/sync-mapa-projects.mjs
 *
 * Requiere en .env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAPA_DIR = path.join(ROOT, "public", "02  MAPA");

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

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const val = m[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

function mapaPublicUrl(...segments) {
  return ["/02  MAPA", ...segments]
    .map((part) => encodeURIComponent(part))
    .join("/")
    .replace(/^%2F/, "/");
}

function pickCoverImage(files) {
  const images = files
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es"));
  return images[0] ?? null;
}

function scanMapa() {
  if (!fs.existsSync(MAPA_DIR)) {
    throw new Error(`No se encontró la carpeta: ${MAPA_DIR}`);
  }

  const rows = [];
  const provinceDirs = fs.readdirSync(MAPA_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const provDir of provinceDirs) {
    const folderName = provDir.name;
    const slug = MAPA_FOLDER_TO_SLUG[folderName];
    if (!slug) {
      console.warn(`⚠ Provincia sin mapeo: "${folderName}"`);
      continue;
    }

    const provPath = path.join(MAPA_DIR, folderName);
    const companyDirs = fs.readdirSync(provPath, { withFileTypes: true }).filter((d) => d.isDirectory());

    let sortOrder = 0;
    const companies = companyDirs
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b, "es"));

    for (const company of companies) {
      const companyPath = path.join(provPath, company);
      const files = fs.readdirSync(companyPath);
      const cover = pickCoverImage(files);
      if (!cover) {
        console.warn(`⚠ Sin imagen: ${folderName} / ${company}`);
        continue;
      }

      rows.push({
        province_slug: slug,
        title: company,
        description: null,
        location_label: folderName,
        segment: "Flota Saldivia",
        year: null,
        image_url: mapaPublicUrl(folderName, company, cover),
        sort_order: sortOrder++,
        active: true,
      });
    }
  }

  return rows.sort(
    (a, b) =>
      a.province_slug.localeCompare(b.province_slug, "es") ||
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title, "es"),
  );
}

async function main() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
    process.exit(1);
  }

  const rows = scanMapa();
  console.log(`Encontrados ${rows.length} proyectos en MAPA.`);

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const BATCH = 100;
  let upserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from("province_projects").upsert(batch, {
      onConflict: "province_slug,title",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error("Error en upsert:", error.message);
      if (error.message.includes("image_url") || error.message.includes("unique")) {
        console.error("\n¿Aplicaste la migración 010_province_projects_image_url.sql en Supabase?");
      }
      process.exit(1);
    }
    upserted += batch.length;
    console.log(`  … ${upserted}/${rows.length}`);
  }

  const byProvince = {};
  for (const r of rows) {
    byProvince[r.province_slug] = (byProvince[r.province_slug] ?? 0) + 1;
  }
  console.log("\nProyectos por provincia:");
  for (const [slug, count] of Object.entries(byProvince).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${slug}: ${count}`);
  }
  console.log("\nListo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
