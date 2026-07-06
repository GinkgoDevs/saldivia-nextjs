"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  removeModelFromHomeShowcase,
  saveHomeShowcaseSlide,
} from "@/app/actions/admin-content";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { AdminShowcaseSlide } from "@/lib/supabase/home-showcase";
import {
  AdminCrudBadge,
  AdminCrudCard,
  AdminCrudLayout,
  AdminCrudThumbnail,
  AdminField,
  AdminFormActions,
  AdminFormSection,
  AdminModal,
  adminToast,
  MediaDropzone,
} from "../_ui/admin-ui";

type FormState = {
  id: string | null;
  model_id: string;
  sort_order: number;
  hero_image_url: string;
  eyebrow: string;
  lead: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
};

function slideToForm(s: AdminShowcaseSlide): FormState {
  const m = Array.isArray(s.metrics) ? s.metrics : [];
  const first = m[0] as { value?: string; label?: string } | undefined;
  const second = m[1] as { value?: string; label?: string } | undefined;
  return {
    id: s.id,
    model_id: s.model_id,
    sort_order: s.sort_order,
    hero_image_url: s.hero_image_url ?? "",
    eyebrow: s.eyebrow ?? "",
    lead: s.lead ?? "",
    stat1_value: typeof first?.value === "string" ? first.value : "",
    stat1_label: typeof first?.label === "string" ? first.label : "",
    stat2_value: typeof second?.value === "string" ? second.value : "",
    stat2_label: typeof second?.label === "string" ? second.label : "",
  };
}

function previewImageUrl(s: AdminShowcaseSlide): string | null {
  return s.hero_image_url?.trim() || s.model.cover_image_url?.trim() || null;
}

type Props = { initialSlides: AdminShowcaseSlide[] };

export function HomeShowcaseAdmin({ initialSlides }: Props) {
  const router = useRouter();
  const [list, setList] = useState(initialSlides);
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setList(initialSlides);
  }, [initialSlides]);

  const ordered = useMemo(
    () => [...list].sort((a, b) => a.sort_order - b.sort_order || a.model.name.localeCompare(b.model.name, "es")),
    [list],
  );

  const editingModel = useMemo(
    () => (form ? list.find((s) => s.model_id === form.model_id)?.model : null),
    [form, list],
  );

  function openEdit(s: AdminShowcaseSlide) {
    setForm(slideToForm(s));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(null);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    const r = await saveHomeShowcaseSlide({
      id: form.id,
      model_id: form.model_id,
      sort_order: form.sort_order,
      hero_image_url: form.hero_image_url,
      eyebrow: form.eyebrow,
      lead: form.lead,
      stat1_value: form.stat1_value,
      stat1_label: form.stat1_label,
      stat2_value: form.stat2_value,
      stat2_label: form.stat2_label,
    });
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    adminToast.success("Showcase guardado.");
    setModalOpen(false);
    setForm(null);
    router.refresh();
  }

  async function onRemoveFromShowcase(s: AdminShowcaseSlide) {
    if (
      !window.confirm(
        `¿Quitar "${s.model.name}" del showcase? Se desmarca en Modelos y deja de aparecer en el home.`,
      )
    ) {
      return;
    }
    setBusy(true);
    const r = await removeModelFromHomeShowcase(s.model_id);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setList((prev) => prev.filter((x) => x.model_id !== s.model_id));
    if (form?.model_id === s.model_id) {
      closeModal();
    }
    adminToast.success(`"${s.model.name}" quitado del showcase.`);
    router.refresh();
  }

  async function onDelete() {
    if (!form) return;
    const slide = list.find((s) => s.model_id === form.model_id);
    if (slide) await onRemoveFromShowcase(slide);
  }

  async function onHeroFile(file: File) {
    setUploading(true);
    try {
      const r = await uploadMediaFromBrowser(file, { folder: "home-showcase" });
      if (!r.ok) {
        adminToast.error(r.error);
        return;
      }
      setForm((f) => (f ? { ...f, hero_image_url: r.publicUrl } : f));
      adminToast.info("Imagen subida. Pulse Guardar para publicar en el showcase.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <AdminCrudLayout
        summary={
          <>
            {ordered.length} modelo{ordered.length === 1 ? "" : "s"} en el showcase · marcados en{" "}
            <Link href="/dashboard/models" className="font-medium text-primary underline-offset-2 hover:underline">
              Catálogo → Modelos
            </Link>
          </>
        }
      >
        {ordered.length === 0 ? (
          <li className="rounded-sm border border-dashed border-outline-variant/40 p-8 text-center text-sm text-on-surface-variant">
            No hay modelos en el showcase. En{" "}
            <Link href="/dashboard/models" className="font-medium text-primary underline-offset-2 hover:underline">
              Modelos
            </Link>
            , activá «Mostrar en el Showcase técnico del home» en cada colectivo que quieras destacar.
          </li>
        ) : (
          ordered.map((s) => {
            const thumb = previewImageUrl(s);
            const hasShowcaseImage = Boolean(s.hero_image_url?.trim());
            return (
              <AdminCrudCard
                key={s.model_id}
                media={<AdminCrudThumbnail src={thumb} alt={s.model.name} />}
                title={`${s.model.name} (${s.model.slug})`}
                subtitle={`Orden ${s.sort_order}`}
                badges={
                  <>
                    {!s.model.active ? (
                      <AdminCrudBadge tone="warning">Modelo inactivo</AdminCrudBadge>
                    ) : null}
                    {hasShowcaseImage ? (
                      <AdminCrudBadge tone="primary">Imagen showcase</AdminCrudBadge>
                    ) : (
                      <AdminCrudBadge>Usa portada del modelo</AdminCrudBadge>
                    )}
                  </>
                }
                disabled={busy}
                onEdit={() => openEdit(s)}
                onDelete={() => void onRemoveFromShowcase(s)}
              />
            );
          })
        )}
      </AdminCrudLayout>

      <AdminModal
        open={modalOpen && Boolean(form)}
        onClose={closeModal}
        title={editingModel ? `Showcase: ${editingModel.name}` : "Editar showcase"}
      >
        {form ? (
          <form className="space-y-5" onSubmit={onSave}>
            <AdminField id="showcase-model" label="Modelo">
              <Input id="showcase-model" value={editingModel ? `${editingModel.name} — ${editingModel.slug}` : ""} readOnly disabled />
            </AdminField>

            <AdminField id="showcase-order" label="Orden en el carrusel">
              <Input
                id="showcase-order"
                type="number"
                value={String(form.sort_order)}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, sort_order: Number.parseInt(e.target.value, 10) || 0 } : f))
                }
              />
            </AdminField>

            <MediaDropzone
              id="showcase-hero"
              label="Imagen exclusiva del showcase"
              hint="Solo para el carrusel del home. No reemplaza la portada del modelo en /flota. Si está vacía, se usa la portada o la primera imagen de la galería."
              value={form.hero_image_url}
              uploading={uploading}
              disabled={busy}
              previewAspect="aspect-[4/3]"
              onChange={(url) => setForm((f) => (f ? { ...f, hero_image_url: url } : f))}
              onFileSelect={onHeroFile}
            />

            <AdminField id="showcase-eyebrow" label="Rubro / etiqueta" hint="Si vacío: según segmento del modelo.">
              <Input
                id="showcase-eyebrow"
                value={form.eyebrow}
                onChange={(e) => setForm((f) => (f ? { ...f, eyebrow: e.target.value } : f))}
              />
            </AdminField>

            <AdminField id="showcase-lead" label="Texto destacado" hint="Si vacío: descripción del modelo.">
              <Textarea
                id="showcase-lead"
                value={form.lead}
                onChange={(e) => setForm((f) => (f ? { ...f, lead: e.target.value } : f))}
                rows={3}
              />
            </AdminField>

            <AdminFormSection title="Métricas destacadas" description="Dos datos numéricos bajo el texto.">
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id="showcase-s1v" label="Dato 1 — valor">
                  <Input
                    id="showcase-s1v"
                    value={form.stat1_value}
                    onChange={(e) => setForm((f) => (f ? { ...f, stat1_value: e.target.value } : f))}
                  />
                </AdminField>
                <AdminField id="showcase-s1l" label="Dato 1 — etiqueta">
                  <Input
                    id="showcase-s1l"
                    value={form.stat1_label}
                    onChange={(e) => setForm((f) => (f ? { ...f, stat1_label: e.target.value } : f))}
                  />
                </AdminField>
                <AdminField id="showcase-s2v" label="Dato 2 — valor">
                  <Input
                    id="showcase-s2v"
                    value={form.stat2_value}
                    onChange={(e) => setForm((f) => (f ? { ...f, stat2_value: e.target.value } : f))}
                  />
                </AdminField>
                <AdminField id="showcase-s2l" label="Dato 2 — etiqueta">
                  <Input
                    id="showcase-s2l"
                    value={form.stat2_label}
                    onChange={(e) => setForm((f) => (f ? { ...f, stat2_label: e.target.value } : f))}
                  />
                </AdminField>
              </div>
            </AdminFormSection>

            <AdminFormActions
              saving={busy}
              uploading={uploading}
              onClear={closeModal}
              clearLabel="Cancelar"
              onDelete={() => void onDelete()}
            />
          </form>
        ) : null}
      </AdminModal>
    </>
  );
}
