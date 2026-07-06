"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { ImageIcon, Trash2, Upload, ZoomIn } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { cn } from "@/app/components/ui/cn";
import { imageFocalStyle } from "@/lib/image-focal";
import { AdminField } from "./AdminField";
import { AdminSitePreviewFrame } from "./AdminSitePreviewFrame";
import { SITE_IMAGE_PREVIEW, type SiteImagePreviewKey } from "./admin-display-previews";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type Props = {
  id?: string;
  label: string;
  hint?: string;
  previewHint?: string;
  previewPreset: SiteImagePreviewKey;
  imageUrl: string;
  fallbackUrl?: string | null;
  focalX: number;
  focalY: number;
  zoom: number;
  disabled?: boolean;
  uploading?: boolean;
  uploadDisabled?: boolean;
  uploadDisabledMessage?: string;
  onImageUrlChange: (url: string) => void;
  onFocalChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onFileSelect: (file: File) => void;
  showUrlField?: boolean;
  urlFieldId?: string;
  overlay?: "productHero" | "none";
  frameClassName?: string;
  frameFooter?: ReactNode;
  framingRequiresOwnImage?: boolean;
  emptyLabel?: string;
  resetFocalOnClear?: boolean;
};

export function FramedImageField({
  id: idProp,
  label,
  hint,
  previewHint,
  previewPreset,
  imageUrl,
  fallbackUrl,
  focalX,
  focalY,
  zoom,
  disabled,
  uploading,
  uploadDisabled,
  uploadDisabledMessage,
  onImageUrlChange,
  onFocalChange,
  onZoomChange,
  onFileSelect,
  showUrlField = false,
  urlFieldId,
  overlay = "none",
  frameClassName,
  frameFooter,
  framingRequiresOwnImage = false,
  emptyLabel = "Sin imagen",
  resetFocalOnClear = true,
}: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const preview = SITE_IMAGE_PREVIEW[previewPreset];
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const hasOwnImage = Boolean(imageUrl.trim());
  const displayUrl = imageUrl.trim() || fallbackUrl?.trim() || "";
  const canFrame =
    Boolean(displayUrl) &&
    !disabled &&
    (!framingRequiresOwnImage || hasOwnImage);

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

  const clearImage = () => {
    onImageUrlChange("");
    if (resetFocalOnClear) {
      onFocalChange(50, 50);
      onZoomChange(1);
    }
  };

  const imgClassName = cn(
    "pointer-events-none absolute inset-0 h-full w-full",
    "imageClassName" in preview ? preview.imageClassName : undefined,
    !("imageClassName" in preview && preview.imageClassName) &&
      (preview.objectFit === "contain" ? "object-contain object-center" : "object-cover"),
  );

  const previewBlock = (
    <div
      ref={previewRef}
      className={cn(
        "relative w-full overflow-hidden rounded-sm border border-outline-variant/30",
        preview.bg,
        preview.aspect,
        canFrame ? (dragging ? "cursor-grabbing" : "cursor-grab") : "",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role={displayUrl ? "img" : undefined}
      aria-label={displayUrl ? label : undefined}
    >
      {displayUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={displayUrl}
            className={imgClassName}
            style={canFrame ? imageFocalStyle(focalX, focalY, zoom) : undefined}
            draggable={false}
          />
          {overlay === "productHero" ? (
            <>
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
            </>
          ) : null}
          {canFrame ? (
            <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white">
              Arrastrá para encuadrar · zoom {Math.round(zoom * 100)}%
              {framingRequiresOwnImage && !hasOwnImage ? " · vista con portada del modelo" : ""}
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 text-on-surface-variant">
          <ImageIcon className="size-8 opacity-40" aria-hidden />
          <span className="text-xs">{emptyLabel}</span>
        </div>
      )}
    </div>
  );

  const busy = disabled || uploading;
  const uploadBlocked = busy || uploadDisabled;

  return (
    <AdminField id={id} label={label} hint={hint}>
      {frameClassName || frameFooter ? (
        <AdminSitePreviewFrame
          maxWidth={preview.maxWidth}
          frameClassName={frameClassName}
          hint={previewHint}
          footer={frameFooter}
        >
          {previewBlock}
        </AdminSitePreviewFrame>
      ) : (
        <div className="space-y-2">
          {previewHint ? (
            <p className="text-[11px] leading-relaxed text-on-surface-variant">{previewHint}</p>
          ) : null}
          <div className={cn("mx-auto w-full", preview.maxWidth)}>{previewBlock}</div>
        </div>
      )}

      {displayUrl && canFrame && hasOwnImage ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-1">
            <label
              className="flex items-center gap-1.5 text-[11px] font-bold text-secondary"
              htmlFor={`${id}-zoom`}
            >
              <ZoomIn className="size-3.5" aria-hidden />
              {preview.zoomMin < 1 ? "Escala" : "Zoom"}
            </label>
            <input
              id={`${id}-zoom`}
              type="range"
              min={preview.zoomMin}
              max={preview.zoomMax}
              step={0.05}
              value={zoom}
              disabled={disabled}
              className="w-full cursor-pointer accent-primary"
              onChange={(e) => onZoomChange(Number(e.target.value))}
            />
            {preview.zoomMin < 1 ? (
              <p className="text-[10px] text-on-surface-variant">
                Menos de 100% aleja la foto dentro del recuadro (útil con fondo blanco).
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="shrink-0 cursor-pointer text-on-surface-variant"
            onClick={clearImage}
          >
            <Trash2 className="size-4" aria-hidden />
            Quitar
          </Button>
        </div>
      ) : displayUrl && framingRequiresOwnImage && !hasOwnImage ? (
        <p className="mt-2 text-[11px] text-on-surface-variant">
          Subí una imagen exclusiva para ajustar zoom y encuadre.
        </p>
      ) : null}

      {showUrlField ? (
        <div className="mt-3 space-y-1">
          <label className="text-[11px] font-medium text-on-surface-variant" htmlFor={urlFieldId ?? `${id}-url`}>
            O pegá una URL
          </label>
          <Input
            id={urlFieldId ?? `${id}-url`}
            value={imageUrl}
            disabled={busy}
            placeholder="https://…"
            onChange={(e) => {
              const url = e.target.value;
              onImageUrlChange(url);
              if (!url.trim() && resetFocalOnClear) {
                onFocalChange(50, 50);
                onZoomChange(1);
              }
            }}
          />
        </div>
      ) : null}

      <div
        role="button"
        tabIndex={uploadBlocked ? -1 : 0}
        aria-disabled={uploadBlocked}
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
          if (file && !uploadBlocked) onFileSelect(file);
        }}
        className={cn(
          "mt-3 rounded-sm border-2 border-dashed border-outline-variant/45 bg-surface-container-low/40 p-3 text-center transition-colors hover:border-secondary/50",
          uploadBlocked ? "opacity-60" : "cursor-pointer",
        )}
      >
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-on-surface">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploadBlocked}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
              e.target.value = "";
            }}
          />
          <Upload className="size-3.5" aria-hidden />
          {uploading ? "Subiendo…" : "Arrastrá una imagen o hacé clic para seleccionar"}
        </label>
        {uploadDisabledMessage ? (
          <p className="mt-1 text-[10px] text-on-surface-variant">{uploadDisabledMessage}</p>
        ) : null}
      </div>
    </AdminField>
  );
}
