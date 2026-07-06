export const DEFAULT_IMAGE_FOCAL = { x: 50, y: 50, zoom: 1 } as const;

export function clampImageFocal(n: number) {
  if (!Number.isFinite(n)) return DEFAULT_IMAGE_FOCAL.x;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function clampImageZoom(n: number) {
  if (!Number.isFinite(n)) return DEFAULT_IMAGE_FOCAL.zoom;
  return Math.min(2.5, Math.max(1, Math.round(n * 100) / 100));
}

export function imageFocalStyle(
  focalX: number,
  focalY: number,
  zoom: number,
): { objectPosition: string; transform?: string; transformOrigin: string } {
  return {
    objectPosition: `${focalX}% ${focalY}%`,
    transform: zoom > 1 ? `scale(${zoom})` : undefined,
    transformOrigin: `${focalX}% ${focalY}%`,
  };
}
