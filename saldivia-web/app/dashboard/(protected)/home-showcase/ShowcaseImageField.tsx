"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload, ZoomIn } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { AdminField } from "../_ui/AdminField";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type Props = {
  label: string;
  hint?: string;
  imageUrl: string;
  fallbackUrl?: string | null;
  focalX: number;
  focalY: number;
  zoom: number;
  disabled?: boolean;
  uploading?: boolean;
  onImageUrlChange: (url: string) => void;
  onFocalChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onFileSelect: (file: File) => void;
};

export function ShowcaseImageField({
  label,
  hint,
  imageUrl,
  fallbackUrl,
  focalX,
  focalY,
  zoom,
  disabled,
  uploading,
  onImageUrlChange,
  onFocalChange,
  onZoomChange,
  onFileSelect,
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const displayUrl = imageUrl.trim() || fallbackUrl?.trim() || "";
  const hasCustomImage = Boolean(imageUrl.trim());
  const canFrame = hasCustomImage && Boolean(displayUrl) && !disabled;

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!canFrame) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragRef.current = { x: e.clientX, y: e.clientY, fx: focalX, fy: focalY };
      setDragging(true);
    },
    [canFrame, focalX, focalY],
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
    <AdminField id="showcase-hero" label={label} hint={hint}>
      <div
        ref={previewRef}
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-outline-variant/30 bg-industrial-charcoal ${
          canFrame ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role={displayUrl ? "img" : undefined}
        aria-label={displayUrl ? "Vista previa del showcase" : undefined}
      >
        {displayUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src={displayUrl}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain p-4"
              style={{
                objectPosition: `${focalX}% ${focalY}%`,
                transform: zoom > 1 ? `scale(${zoom})` : undefined,
                transformOrigin: `${focalX}% ${focalY}%`,
              }}
              draggable={false}
            />
            <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[10px] text-white">
              Arrastrá para encuadrar · zoom {Math.round(zoom * 100)}%
              {!hasCustomImage ? " · vista con portada del modelo" : ""}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-on-surface-variant">
            <ImageIcon className="size-8 opacity-40" aria-hidden />
            <span className="text-xs">Sin imagen para el showcase</span>
          </div>
        )}
      </div>

      {displayUrl && hasCustomImage ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-secondary" htmlFor="showcase_zoom">
              <ZoomIn className="size-3.5" aria-hidden />
              Zoom
            </label>
            <input
              id="showcase_zoom"
              type="range"
              min={1}
              max={2.5}
              step={0.05}
              value={zoom}
              disabled={disabled}
              className="w-full cursor-pointer accent-primary"
              onChange={(e) => onZoomChange(Number(e.target.value))}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="shrink-0 cursor-pointer text-on-surface-variant"
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
      ) : displayUrl && !hasCustomImage ? (
        <p className="mt-2 text-[11px] text-on-surface-variant">
          Subí una imagen exclusiva para ajustar zoom y encuadre. Mientras tanto se usa la portada del modelo.
        </p>
      ) : null}

      <div className="mt-3 space-y-1">
        <label className="text-[11px] font-medium text-on-surface-variant" htmlFor="showcase-hero-url">
          O pegá una URL
        </label>
        <Input
          id="showcase-hero-url"
          value={imageUrl}
          disabled={disabled}
          placeholder="https://…"
          onChange={(e) => {
            const url = e.target.value;
            onImageUrlChange(url);
            if (!url.trim()) {
              onFocalChange(50, 50);
              onZoomChange(1);
            }
          }}
        />
      </div>

      <div
        role="button"
        tabIndex={disabled || uploading ? -1 : 0}
        aria-disabled={disabled || uploading}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.currentTarget.querySelector("input[type=file]") as HTMLInputElement | null)?.click();
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onFileSelect(file);
        }}
        className={`mt-3 rounded-sm border-2 border-dashed border-outline-variant/45 bg-surface-container-low/40 p-3 text-center transition-colors hover:border-secondary/50 ${
          disabled || uploading ? "opacity-60" : "cursor-pointer"
        }`}
      >
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-on-surface">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
              e.target.value = "";
            }}
          />
          <Upload className="size-3.5" aria-hidden />
          {uploading ? "Subiendo…" : "Arrastrá una imagen o hacé clic para seleccionar"}
        </label>
      </div>
    </AdminField>
  );
}
