import type { ReactNode } from "react";
import { Button } from "@/app/components/ui/Button";

type Props = {
  formId?: string;
  saving?: boolean;
  uploading?: boolean;
  saveLabel?: string;
  onCancel?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  hideSave?: boolean;
};

export function AdminModalFooter({
  formId,
  saving,
  uploading,
  saveLabel = "Guardar",
  onCancel,
  onDelete,
  deleteLabel = "Eliminar",
  leading,
  trailing,
  hideSave,
}: Props) {
  const busy = saving || uploading;
  const label = uploading ? "Subiendo archivo…" : saving ? "Guardando…" : saveLabel;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {leading}
      {!hideSave ? (
        <Button type="submit" form={formId} disabled={busy}>
          {label}
        </Button>
      ) : null}
      {onCancel ? (
        <Button type="button" variant="ghost" disabled={busy} className="cursor-pointer" onClick={onCancel}>
          Cancelar
        </Button>
      ) : null}
      {trailing}
      {onDelete ? (
        <Button
          type="button"
          variant="outline"
          className="ml-auto cursor-pointer text-on-surface-variant"
          disabled={busy}
          onClick={onDelete}
        >
          {deleteLabel}
        </Button>
      ) : null}
    </div>
  );
}
