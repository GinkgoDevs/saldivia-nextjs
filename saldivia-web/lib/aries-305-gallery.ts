import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;

/** Rutas públicas `/ARIES-305/...` ordenadas según el nombre de archivo. */
export function getAries305GalleryPaths(): string[] {
  const dir = path.join(process.cwd(), "public", "ARIES-305");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `/ARIES-305/${name}`);
}
