import fs from "node:fs";
import sharp from "sharp";

/** Ancho máximo para portadas del mapa (suficiente para cards y lightbox). */
export const MAPA_COVER_MAX_WIDTH = 1400;
export const MAPA_COVER_JPEG_QUALITY = 80;

/**
 * Comprime una foto de portada a JPEG optimizado.
 */
export async function compressMapaCoverImage(filePath) {
  const originalBytes = fs.statSync(filePath).size;

  const buffer = await sharp(filePath, { failOn: "none" })
    .rotate()
    .resize({ width: MAPA_COVER_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: MAPA_COVER_JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  return {
    buffer,
    contentType: "image/jpeg",
    originalBytes,
    compressedBytes: buffer.length,
  };
}
