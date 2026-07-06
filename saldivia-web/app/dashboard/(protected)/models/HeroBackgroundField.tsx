"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Trash2, ZoomIn } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { cn } from "@/app/components/ui/cn";
import { SITE_IMAGE_PREVIEW } from "../_ui/admin-display-previews";

const HERO_PREVIEW = SITE_IMAGE_PREVIEW.productHero;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type Props = {
  modelName: string;
  modelId: string | null;
  imageUrl: string;
  focalX: number;
  focalY: number;
  zoom: number;
  disabled?: boolean;
  uploading?: boolean;
  onImageUrlChange: (url: string) => void;
  onFocalChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onFileSelect: (file: File) => void;
  compact?: boolean;
};

export function HeroBackgroundField({
  modelName,
  modelId,
  imageUrl,
  focalX,
  focalY,
  zoom,
  disabled,
  uploading,
  onImageUrlChange,
  onFocalChange,
  onZoomChange,
  onFileSelect,
  compact = false,
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!imageUrl || disabled) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragRef.current = { x: e.clientX, y: e.clientY, fx: focalX, fy: focalY };
      setDragging(true);
    },
    [disabled, focalX, focalY, imageUrl],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      const sensX = 100 / Math.max(rect.width, 1);
      const sensY = 100 / Math.max(rect.height, 1);
      onFocalChange(
        clamp(Math.round(dragRef.current.fx - dx * sensX), 0, 100),
        clamp(Math.round(dragRef.current.fy - dy * sensY), 0, 100),
      );
    },
    [onFocalChange],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);

  return (
    <div
      className={cn(
        "rounded-sm border border-outline-variant/25 bg-surface-container-low/40",
        compact ? "space-y-2 p-3" : "space-y-3 p-4",
      )}
    >
      {!compact ? (
        <div>
          <p className="text-xs font-bold text-secondary">Fondo del hero en la ficha del producto</p>
          <p className="mt-1 text-[11px] text-on-surface-variant">
            Imagen exclusiva de{" "}
            <span className="font-semibold text-on-surface">{modelName.trim() || "este modelo"}</span> en{" "}
            <code className="text-[10px]">/producto/[slug]</code>.
          </p>
          {!modelId ? (
            <p className="mt-1 text-[11px] font-medium text-amber-800 dark:text-amber-200">
              Guardá el modelo antes de subir la imagen.
            </p>
          ) : null}
        </div>
      ) : !modelId ? (
        <p className="text-[10px] font-medium text-amber-800 dark:text-amber-200">
          Guardá el modelo antes de subir el hero.
        </p>
      ) : null}

      <div className={cn("mx-auto w-full", HERO_PREVIEW.maxWidth)}>
        <div
          ref={previewRef}
          className={cn(
            "relative w-full overflow-hidden rounded-sm border border-outline-variant/30",
            HERO_PREVIEW.bg,
            HERO_PREVIEW.aspect,
            imageUrl && !disabled ? (dragging ? "cursor-grabbing" : "cursor-grab") : "",
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role={imageUrl ? "img" : undefined}
          aria-label={imageUrl ? `Vista previa del hero de ${modelName}` : undefined}
        >
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src={imageUrl}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: `${focalX}% ${focalY}%`,
                transform: zoom > 1 ? `scale(${zoom})` : undefined,
                transformOrigin: `${focalX}% ${focalY}%`,
              }}
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0 hidden md:block"
              aria-hidden
              style={{
                background:
                  "linear-gradient(105deg, rgba(0,23,50,0.88) 0%, rgba(0,23,50,0.55) 35%, rgba(0,23,50,0.12) 62%, transparent 78%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 md:hidden"
              aria-hidden
              style={{
                background:
                  "linear-gradient(to top, rgba(0,23,50,0.85) 0%, rgba(0,23,50,0.35) 50%, transparent 100%)",
              }}
            />
            <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white">
              Arrastrá para encuadrar · zoom {Math.round(zoom * 100)}%
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 text-on-surface-variant">
            <ImageIcon className="size-8 opacity-40" aria-hidden />
            <span className="text-xs">Sin imagen de hero para este modelo</span>
          </div>
        )}
        </div>
      </div>

      {imageUrl ? (
        <div className={cn("grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end", compact && "gap-1.5")}>
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-secondary" htmlFor="hero_zoom">
              <ZoomIn className="size-3.5" aria-hidden />
              Zoom
            </label>
            <input
              id="hero_zoom"
              type="range"
              min={1}
              max={2.5}
              step={0.05}
              value={zoom}
              disabled={disabled}
              className="w-full accent-primary"
              onChange={(e) => onZoomChange(Number(e.target.value))}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="shrink-0 text-on-surface-variant"
            onClick={() => {
              onImageUrlChange("");
              onFocalChange(50, 50);
              onZoomChange(1);
            }}
          >
            <Trash2 className="size-4" aria-hidden />
            Quitar
          </Button>
        </div>
      ) : null}

      {!compact ? (
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-secondary" htmlFor="hero_background_image_url">
            URL (opcional)
          </label>
          <Input
            id="hero_background_image_url"
            value={imageUrl}
            disabled={disabled}
            placeholder="https://…"
            onChange={(e) => onImageUrlChange(e.target.value)}
          />
        </div>
      ) : null}

      <div
        role="button"
        tabIndex={disabled || uploading || !modelId ? -1 : 0}
        aria-disabled={disabled || uploading || !modelId}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.currentTarget.querySelector("input[type=file]") as HTMLInputElement | null)?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onFileSelect(file);
        }}
        className={cn(
          "rounded-sm border-2 border-dashed border-outline-variant/45 bg-surface-container-low/40 text-center transition-colors hover:border-secondary/50",
          compact ? "p-2" : "p-3",
          disabled || uploading || !modelId ? "opacity-60" : "cursor-pointer",
        )}
      >
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-on-surface">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={disabled || uploading || !modelId}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
              e.target.value = "";
            }}
          />
          {uploading ? "Subiendo…" : "Arrastrá una imagen o hacé clic para seleccionar"}
        </label>
        {!modelId ? (
          <p className="mt-1 text-[10px] text-on-surface-variant">
            Guardá el modelo una vez para habilitar la subida.
          </p>
        ) : null}
      </div>
    </div>
  );
}
