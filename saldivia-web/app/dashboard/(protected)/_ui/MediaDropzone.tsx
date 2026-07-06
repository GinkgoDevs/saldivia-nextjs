"use client";

import { useCallback, useId, useRef, useState } from "react";
import { FileImage, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/components/ui/cn";
import { AdminField } from "./AdminField";

type Props = {
  id?: string;
  label: string;
  hint?: string;
  accept?: string;
  value: string;
  onChange: (url: string) => void;
  onFileSelect: (file: File) => void | Promise<void>;
  uploading?: boolean;
  disabled?: boolean;
  previewAspect?: string;
  showUrlField?: boolean;
  emptyLabel?: string;
  kind?: "image" | "pdf";
};

export function MediaDropzone({
  id: idProp,
  label,
  hint,
  accept = "image/jpeg,image/png,image/webp",
  value,
  onChange,
  onFileSelect,
  uploading,
  disabled,
  previewAspect = "aspect-video",
  showUrlField = true,
  emptyLabel = "Arrastrá un archivo o hacé clic para seleccionar",
  kind = "image",
}: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const isImage = kind === "image";
  const busy = disabled || uploading;

  const pickFile = useCallback(
    (file: File | null | undefined) => {
      if (!file || busy) return;
      void onFileSelect(file);
    },
    [busy, onFileSelect],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      pickFile(e.dataTransfer.files?.[0]);
    },
    [pickFile],
  );

  return (
    <AdminField id={id} label={label} hint={hint}>
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-disabled={busy}
        aria-label={value ? "Cambiar archivo" : emptyLabel}
        onKeyDown={(e) => {
          if (busy) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!busy) setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget === e.target) setDragOver(false);
        }}
        onDrop={onDrop}
        onClick={() => {
          if (!busy) inputRef.current?.click();
        }}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-sm border-2 border-dashed transition-colors duration-200",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-outline-variant/45 bg-surface-container-low/50 hover:border-secondary/50 hover:bg-surface-container-low",
          busy && "pointer-events-none opacity-70",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            pickFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {value && isImage ? (
          <div className={cn("relative w-full bg-primary", previewAspect)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={value} className="h-full w-full object-cover" draggable={false} />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100 group-focus-visible:bg-black/40 group-focus-visible:opacity-100">
              <span className="flex items-center gap-2 rounded-sm bg-black/70 px-3 py-1.5 text-xs font-medium text-white">
                <Upload className="size-3.5" aria-hidden />
                Cambiar imagen
              </span>
            </div>
          </div>
        ) : value && !isImage ? (
          <div className="flex items-center gap-3 px-4 py-6">
            <FileText className="size-8 shrink-0 text-secondary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-on-surface">PDF cargado</p>
              <p className="truncate text-[11px] text-on-surface-variant">{value}</p>
            </div>
          </div>
        ) : (
          <div className={cn("flex flex-col items-center justify-center gap-2 px-4 py-8 text-center", previewAspect)}>
            {uploading ? (
              <Loader2 className="size-8 animate-spin text-secondary" aria-hidden />
            ) : isImage ? (
              <FileImage className="size-8 text-on-surface-variant/60" aria-hidden />
            ) : (
              <FileText className="size-8 text-on-surface-variant/60" aria-hidden />
            )}
            <p className="text-xs font-medium text-on-surface">{uploading ? "Subiendo…" : emptyLabel}</p>
            <p className="text-[10px] text-on-surface-variant">JPG, PNG o WebP · máx. 15 MB</p>
          </div>
        )}
      </div>

      {value ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            className="gap-1.5 text-on-surface-variant"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
          >
            <Trash2 className="size-3.5" aria-hidden />
            Quitar
          </Button>
        </div>
      ) : null}

      {showUrlField ? (
        <div className="space-y-1">
          <label htmlFor={`${id}-url`} className="text-[11px] font-medium text-on-surface-variant">
            O pegá una URL
          </label>
          <Input
            id={`${id}-url`}
            value={value}
            disabled={busy}
            placeholder="https://…"
            onChange={(e) => onChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </AdminField>
  );
}
