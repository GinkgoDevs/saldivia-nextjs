/**
 * Sincroniza proyectos desde public/02  MAPA hacia Supabase:
 * 1. Sube la portada de cada empresa al bucket `media` (Storage)
 * 2. Upsert en `province_projects` con la URL pública de Supabase
 *
 * Uso (desde saldivia-web/):
 *   npm run sync:mapa
 *   node scripts/sync-mapa-projects.mjs --dry-run
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
const STORAGE_BUCKET = "media";
const STORAGE_PREFIX = "mapa";
/** Límite del bucket `media` (ver migración 004_model_images_rls_forms.sql) */
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const UPLOAD_CONCURRENCY = 4;

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

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const dryRun = process.argv.includes("--dry-run");

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

function sanitizeStorageSegment(value) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "item"
  );
}

function sanitizeFilename(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext);
  const safeBase = sanitizeStorageSegment(base) || "cover";
  return `${safeBase}${ext}`;
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
    const companies = companyDirs.map((d) => d.name).sort((a, b) => a.localeCompare(b, "es"));

    for (const company of companies) {
      const companyPath = path.join(provPath, company);
      const files = fs.readdirSync(companyPath);
      const cover = pickCoverImage(files);
      if (!cover) {
        console.warn(`⚠ Sin imagen: ${folderName} / ${company}`);
        continue;
      }

      const localFilePath = path.join(companyPath, cover);
      const storagePath = [
        STORAGE_PREFIX,
        slug,
        sanitizeStorageSegment(company),
        sanitizeFilename(cover),
      ].join("/");

      rows.push({
        province_slug: slug,
        title: company,
        description: null,
        location_label: folderName,
        segment: "Flota Saldivia",
        year: null,
        sort_order: sortOrder++,
        active: true,
        localFilePath,
        storagePath,
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

async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await fn(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function uploadCover(supabase, row) {
  const stat = fs.statSync(row.localFilePath);
  if (stat.size > MAX_FILE_BYTES) {
    const mb = (stat.size / (1024 * 1024)).toFixed(1);
    console.warn(`⚠ Omitida (>15 MB, ${mb} MB): ${row.title} (${row.storagePath})`);
    return { ...row, image_url: null, uploadError: "file_too_large" };
  }

  const ext = path.extname(row.localFilePath).toLowerCase();
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
  const buffer = fs.readFileSync(row.localFilePath);

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(row.storagePath, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error(`✗ Storage ${row.title}: ${error.message}`);
    return { ...row, image_url: null, uploadError: error.message };
  }

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(row.storagePath);
  return { ...row, image_url: pub.publicUrl, uploadError: null };
}

function toDbRow(row) {
  return {
    province_slug: row.province_slug,
    title: row.title,
    description: row.description,
    location_label: row.location_label,
    segment: row.segment,
    year: row.year,
    image_url: row.image_url,
    sort_order: row.sort_order,
    active: row.active,
  };
}

async function main() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
    process.exit(1);
  }

  const scanned = scanMapa();
  console.log(`Encontrados ${scanned.length} proyectos en MAPA.`);

  if (dryRun) {
    console.log("\n[dry-run] Primeras rutas de storage:");
    for (const row of scanned.slice(0, 5)) {
      console.log(`  ${row.storagePath}`);
    }
    console.log("\n[dry-run] Sin subida ni escritura en Supabase.");
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log(`\nSubiendo portadas a ${STORAGE_BUCKET}/${STORAGE_PREFIX}/ …`);
  let uploaded = 0;
  const withUrls = await mapPool(scanned, UPLOAD_CONCURRENCY, async (row, index) => {
    const result = await uploadCover(supabase, row);
    uploaded += 1;
    if (uploaded % 10 === 0 || uploaded === scanned.length) {
      process.stdout.write(`\r  storage: ${uploaded}/${scanned.length}`);
    }
    return result;
  });
  console.log("");

  const ready = withUrls.filter((r) => r.image_url);
  const failed = withUrls.filter((r) => !r.image_url);
  if (failed.length > 0) {
    console.warn(`\n⚠ ${failed.length} proyecto(s) sin imagen subida (ver warnings arriba).`);
  }

  const BATCH = 100;
  let upserted = 0;
  for (let i = 0; i < ready.length; i += BATCH) {
    const batch = ready.slice(i, i + BATCH).map(toDbRow);
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
    console.log(`  db: ${upserted}/${ready.length}`);
  }

  const byProvince = {};
  for (const r of ready) {
    byProvince[r.province_slug] = (byProvince[r.province_slug] ?? 0) + 1;
  }
  console.log("\nProyectos por provincia:");
  for (const [slug, count] of Object.entries(byProvince).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${slug}: ${count}`);
  }
  console.log(`\nListo. ${ready.length} proyectos con URL de Supabase Storage.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
