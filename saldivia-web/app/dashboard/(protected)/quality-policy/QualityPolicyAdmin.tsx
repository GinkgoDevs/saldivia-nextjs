"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

import { clearQualityPolicyPdf, saveQualityPolicyPdf } from "@/app/actions/admin-content";
import { Button, buttonClass } from "@/app/components/ui/Button";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { QualityPolicyRow } from "@/lib/supabase/quality-policy";
import {
  AdminEmptyState,
  AdminFormSection,
  AdminStatusBanner,
  adminToast,
  MediaDropzone,
} from "../_ui/admin-ui";

type Props = { initial: QualityPolicyRow };

export function QualityPolicyAdmin({ initial }: Props) {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState(initial.pdf_url ?? "");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPdfUrl(initial.pdf_url ?? "");
  }, [initial.pdf_url]);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const r = await uploadMediaFromBrowser(file, { folder: "quality-policy" });
      if (!r.ok) {
        adminToast.error(r.error);
        return;
      }
      setPdfUrl(r.publicUrl);
      adminToast.info("PDF subido. Pulse Guardar para publicarlo en Nosotros.");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!pdfUrl.trim()) {
      adminToast.error("Subí un PDF antes de guardar.");
      return;
    }
    setBusy(true);
    try {
      const r = await saveQualityPolicyPdf(pdfUrl);
      if (!r.ok) {
        adminToast.error(r.error === "validation" ? "El PDF es obligatorio." : r.error);
        return;
      }
      adminToast.success("Política de calidad actualizada.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onClear() {
    if (!window.confirm("¿Quitar el PDF de la sección Nosotros?")) return;
    setBusy(true);
    try {
      const r = await clearQualityPolicyPdf();
      if (!r.ok) {
        adminToast.error(r.error);
        return;
      }
      setPdfUrl("");
      adminToast.success("PDF eliminado del sitio.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="max-w-2xl space-y-6" onSubmit={(e) => void onSave(e)}>
      <AdminStatusBanner variant={pdfUrl ? "success" : "info"}>
        {pdfUrl
          ? "Hay un PDF publicado: el botón de descarga aparece en Nosotros → Política de calidad."
          : "Sin PDF publicado: en Nosotros solo se muestra el ícono, sin enlace de descarga."}
      </AdminStatusBanner>

      <AdminFormSection
        title="Documento PDF"
        description="Reemplazalo cuando actualicen la política. Se guarda en Storage y se publica en el sitio."
      >
        {!pdfUrl ? (
          <AdminEmptyState
            icon={FileText}
            title="Todavía no hay PDF"
            description="Subí el documento. Cuando lo cambien más adelante, subí el nuevo archivo y guardá."
          />
        ) : null}
        <MediaDropzone
          id="quality-policy-pdf"
          label={pdfUrl ? "Política de calidad (PDF)" : "Subir PDF"}
          hint="Solo PDF. Al guardar, reemplaza el documento anterior en Nosotros."
          kind="pdf"
          accept="application/pdf"
          value={pdfUrl}
          onChange={(url) => setPdfUrl(url)}
          onFileSelect={onFile}
          uploading={uploading}
          disabled={busy}
          showUrlField
        />
      </AdminFormSection>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={busy || uploading}>
          {busy ? "Guardando…" : uploading ? "Subiendo…" : "Guardar"}
        </Button>
        {pdfUrl ? (
          <Button type="button" variant="outline" disabled={busy || uploading} onClick={() => void onClear()}>
            Quitar del sitio
          </Button>
        ) : null}
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass({ variant: "ghost", size: "md" })}
          >
            Ver PDF actual
          </a>
        ) : null}
      </div>
    </form>
  );
}
