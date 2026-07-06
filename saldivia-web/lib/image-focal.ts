export const DEFAULT_IMAGE_FOCAL = { x: 50, y: 50, zoom: 1 } as const;

/** Rango de escala según cómo encaja la imagen en el recuadro. */
export const IMAGE_ZOOM_RANGE = {
  /** object-contain: permite alejar (<100%) dejando ver el fondo del recuadro. */
  contain: { min: 0.5, max: 2.5 },
  /** object-cover: solo acercar desde el encuadre base. */
  cover: { min: 1, max: 2.5 },
} as const;

export function clampImageFocal(n: number) {
  if (!Number.isFinite(n)) return DEFAULT_IMAGE_FOCAL.x;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function clampImageZoom(
  n: number,
  min: number = IMAGE_ZOOM_RANGE.cover.min,
  max: number = IMAGE_ZOOM_RANGE.cover.max,
) {
  if (!Number.isFinite(n)) return DEFAULT_IMAGE_FOCAL.zoom;
  return Math.min(max, Math.max(min, Math.round(n * 100) / 100));
}

export function imageFocalStyle(
  focalX: number,
  focalY: number,
  zoom: number,
): { objectPosition: string; transform?: string; transformOrigin: string } {
  return {
    objectPosition: `${focalX}% ${focalY}%`,
    transform: Math.abs(zoom - 1) > 0.001 ? `scale(${zoom})` : undefined,
    transformOrigin: `${focalX}% ${focalY}%`,
  };
}
