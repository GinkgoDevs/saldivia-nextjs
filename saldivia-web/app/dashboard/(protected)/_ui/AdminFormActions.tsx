import type { ReactNode } from "react";
import { Button } from "@/app/components/ui/Button";

type Props = {
  saving?: boolean;
  uploading?: boolean;
  saveLabel?: string;
  onClear?: () => void;
  clearLabel?: string;
  onDelete?: () => void;
  deleteLabel?: string;
  children?: ReactNode;
};

export function AdminFormActions({
  saving,
  uploading,
  saveLabel = "Guardar",
  onClear,
  clearLabel = "Limpiar",
  onDelete,
  deleteLabel = "Eliminar",
  children,
}: Props) {
  const busy = saving || uploading;
  const label = uploading ? "Subiendo archivo…" : saving ? "Guardando…" : saveLabel;

  return (
    <div className="flex flex-wrap gap-3 border-t border-outline-variant/20 pt-4">
      <Button type="submit" disabled={busy}>
        {label}
      </Button>
      {onClear ? (
        <Button type="button" variant="ghost" disabled={busy} onClick={onClear}>
          {clearLabel}
        </Button>
      ) : null}
      {onDelete ? (
        <Button type="button" variant="outline" disabled={busy} onClick={onDelete}>
          {deleteLabel}
        </Button>
      ) : null}
      {children}
    </div>
  );
}
