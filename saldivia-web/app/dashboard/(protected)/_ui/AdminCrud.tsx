import type { ReactNode } from "react";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/components/ui/cn";
type LayoutProps = {
  summary: ReactNode;
  newLabel?: string;
  onNew?: () => void;
  newDisabled?: boolean;
  /** Controles extra en la fila del encabezado (ej. switch de reordenar). */
  toolbar?: ReactNode;
  /** Filtros o ayuda contextual debajo del encabezado. */
  filter?: ReactNode;
  children: ReactNode;
};

export function AdminCrudLayout({
  summary,
  newLabel,
  onNew,
  newDisabled,
  toolbar,
  filter,
  children,
}: LayoutProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-on-surface-variant">{summary}</div>
        <div className="flex flex-wrap items-center gap-3">
          {toolbar}
          {onNew && newLabel ? (
            <Button type="button" className="gap-2" onClick={onNew} disabled={newDisabled}>
              <Plus className="size-4" aria-hidden />
              {newLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {filter ? <div className="mb-4">{filter}</div> : null}

      <ul className="space-y-3">{children}</ul>
    </>
  );
}

export function AdminReorderToggle({
  enabled,
  onChange,
  disabled,
  label = "Reordenar",
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  const id = "admin-reorder-toggle";
  return (
    <div className="flex min-h-11 items-center gap-2.5 rounded-sm border border-outline-variant/25 bg-surface-container-low/30 px-3 py-2">
      <label htmlFor={id} className="cursor-pointer text-sm font-medium text-on-surface">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          enabled ? "bg-primary" : "bg-outline-variant/50",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            enabled && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

type CardProps = {
  dragHandle?: ReactNode;
  media?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  badges?: ReactNode;
  onEdit?: () => void;
  onDelete: () => void;
  hideEdit?: boolean;
  disabled?: boolean;
  isDropTarget?: boolean;
  isDragging?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
};

export function AdminCrudCard({
  dragHandle,
  media,
  title,
  subtitle,
  badges,
  onEdit,
  onDelete,
  hideEdit,
  disabled,
  isDropTarget,
  isDragging,
  onDragOver,
  onDrop,
}: CardProps) {
  return (
    <li
      className={cn(
        "flex overflow-hidden rounded-sm border bg-surface-container-lowest transition-shadow",
        isDropTarget ? "border-primary ring-2 ring-primary/25" : "border-outline-variant/30",
        isDragging && "opacity-50",
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {dragHandle}
      {media}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-primary">{title}</h3>
          {subtitle ? (
            <div className="mt-0.5 truncate text-sm text-on-surface-variant">{subtitle}</div>
          ) : null}
          {badges ? <div className="mt-2 flex flex-wrap gap-1.5">{badges}</div> : null}
        </div>
        <div className="flex shrink-0 gap-2">
          {!hideEdit ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-10 gap-1.5"
              disabled={disabled}
              onClick={onEdit}
            >
              <Pencil className="size-3.5" aria-hidden />
              Editar
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10 gap-1.5 text-on-surface-variant"
            disabled={disabled}
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" aria-hidden />
            Eliminar
          </Button>
        </div>
      </div>
    </li>
  );
}

export function AdminCrudBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "secondary" | "warning";
}) {
  const tones = {
    neutral: "bg-surface-container-high text-on-surface",
    primary: "bg-primary/15 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    warning: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
  };
  return (
    <span className={cn("rounded px-2 py-0.5 text-[11px] font-medium", tones[tone])}>{children}</span>
  );
}

export function AdminCrudDragHandle({
  disabled,
  onDragStart,
  onDragEnd,
}: {
  disabled?: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      draggable={!disabled}
      aria-label="Arrastrar para reordenar"
      title="Arrastrar para reordenar"
      className="flex w-10 shrink-0 cursor-grab touch-none items-center justify-center border-r border-outline-variant/20 bg-surface-container-high text-on-surface-variant outline-none hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:cursor-grabbing"
      aria-disabled={disabled}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <GripVertical className="size-5" aria-hidden />
    </div>
  );
}

export function AdminCrudThumbnail({ src, alt = "" }: { src?: string | null; alt?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="hidden h-28 w-40 shrink-0 object-cover sm:block" />
    );
  }
  return (
    <div className="hidden h-28 w-40 shrink-0 items-center justify-center bg-surface-container text-xs text-on-surface-variant sm:flex">
      Sin imagen
    </div>
  );
}
