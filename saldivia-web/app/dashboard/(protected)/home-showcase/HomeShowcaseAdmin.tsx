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
import { Button } from "@/app/components/ui/Button";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { AdminShowcaseSlide } from "@/lib/supabase/home-showcase";
import {
  AdminCrudBadge,
  AdminCrudCard,
  AdminCrudLayout,
  AdminCrudThumbnail,
  AdminField,
  AdminFormSection,
  AdminFullscreenForm,
  AdminModal,
  AdminModalFooter,
  AdminWizardPanel,
  adminToast,
  type WizardStep,
} from "../_ui/admin-ui";
import { ShowcaseImageField } from "./ShowcaseImageField";

const SHOWCASE_WIZARD_STEPS: WizardStep[] = [
  {
    id: "image",
    title: "Imagen",
    hint: "Foto exclusiva del carrusel. Arrastrá para encuadrar y ajustá el zoom.",
  },
  {
    id: "copy",
    title: "Textos",
    hint: "Rubro y descripción destacada. Si están vacíos, se usan los del modelo.",
  },
  {
    id: "metrics",
    title: "Métricas",
    hint: "Dos datos numéricos que aparecen bajo el texto en el showcase.",
  },
];

type FormState = {
  id: string | null;
  model_id: string;
  sort_order: number;
  hero_image_url: string;
  hero_image_focal_x: number;
  hero_image_focal_y: number;
  hero_image_zoom: number;
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
    hero_image_focal_x: s.hero_image_focal_x ?? 50,
    hero_image_focal_y: s.hero_image_focal_y ?? 50,
    hero_image_zoom: s.hero_image_zoom ?? 1,
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
  const [wizardStep, setWizardStep] = useState(0);

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
    setWizardStep(0);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(null);
    setWizardStep(0);
  }

  function goNextStep() {
    setWizardStep((s) => Math.min(s + 1, SHOWCASE_WIZARD_STEPS.length - 1));
  }

  function goPrevStep() {
    setWizardStep((s) => Math.max(s - 1, 0));
  }

  const currentStepId = SHOWCASE_WIZARD_STEPS[wizardStep]?.id ?? "image";

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    const r = await saveHomeShowcaseSlide({
      id: form.id,
      model_id: form.model_id,
      sort_order: form.sort_order,
      hero_image_url: form.hero_image_url,
      hero_image_focal_x: form.hero_image_focal_x,
      hero_image_focal_y: form.hero_image_focal_y,
      hero_image_zoom: form.hero_image_zoom,
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
      setForm((f) =>
        f
          ? {
              ...f,
              hero_image_url: r.publicUrl,
              hero_image_focal_x: 50,
              hero_image_focal_y: 50,
              hero_image_zoom: 1,
            }
          : f,
      );
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
        fullscreen
        footer={
          form ? (
            <AdminModalFooter
              formId="showcase-form"
              saving={busy}
              uploading={uploading}
              hideSave={wizardStep < SHOWCASE_WIZARD_STEPS.length - 1}
              onCancel={closeModal}
              onDelete={
                wizardStep === SHOWCASE_WIZARD_STEPS.length - 1 ? () => void onDelete() : undefined
              }
              leading={
                <>
                  {wizardStep > 0 ? (
                    <Button type="button" variant="outline" disabled={busy} onClick={goPrevStep}>
                      Anterior
                    </Button>
                  ) : null}
                  {wizardStep < SHOWCASE_WIZARD_STEPS.length - 1 ? (
                    <Button type="button" disabled={busy} onClick={goNextStep}>
                      Siguiente
                    </Button>
                  ) : null}
                </>
              }
            />
          ) : null
        }
      >
        {form ? (
          <AdminFullscreenForm
            id="showcase-form"
            steps={SHOWCASE_WIZARD_STEPS}
            currentStep={wizardStep}
            onStepClick={(index) => {
              if (index < wizardStep) setWizardStep(index);
              else if (index > wizardStep) setWizardStep(index);
            }}
            onSubmit={(e) => {
              if (wizardStep < SHOWCASE_WIZARD_STEPS.length - 1) {
                e.preventDefault();
                goNextStep();
                return;
              }
              void onSave(e);
            }}
          >
            <AdminWizardPanel stepId="image" currentStepId={currentStepId}>
              <AdminField id="showcase-model" label="Modelo">
                <Input
                  id="showcase-model"
                  value={editingModel ? `${editingModel.name} — ${editingModel.slug}` : ""}
                  readOnly
                  disabled
                />
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
              <ShowcaseImageField
                label="Imagen exclusiva del showcase"
                hint="Solo para el carrusel del home. Arrastrá la imagen para encuadrar y usá el zoom."
                imageUrl={form.hero_image_url}
                fallbackUrl={editingModel?.cover_image_url}
                focalX={form.hero_image_focal_x}
                focalY={form.hero_image_focal_y}
                zoom={form.hero_image_zoom}
                uploading={uploading}
                disabled={busy}
                onImageUrlChange={(url) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          hero_image_url: url,
                          ...(url.trim()
                            ? {}
                            : { hero_image_focal_x: 50, hero_image_focal_y: 50, hero_image_zoom: 1 }),
                        }
                      : f,
                  )
                }
                onFocalChange={(x, y) =>
                  setForm((f) => (f ? { ...f, hero_image_focal_x: x, hero_image_focal_y: y } : f))
                }
                onZoomChange={(zoom) => setForm((f) => (f ? { ...f, hero_image_zoom: zoom } : f))}
                onFileSelect={onHeroFile}
              />
            </AdminWizardPanel>

            <AdminWizardPanel stepId="copy" currentStepId={currentStepId}>
              <AdminFormSection title="Textos del slide" description="Si están vacíos, se completan con los datos del modelo.">
                <AdminField id="showcase-eyebrow" label="Rubro / etiqueta">
                  <Input
                    id="showcase-eyebrow"
                    value={form.eyebrow}
                    onChange={(e) => setForm((f) => (f ? { ...f, eyebrow: e.target.value } : f))}
                  />
                </AdminField>
                <AdminField id="showcase-lead" label="Texto destacado">
                  <Textarea
                    id="showcase-lead"
                    value={form.lead}
                    onChange={(e) => setForm((f) => (f ? { ...f, lead: e.target.value } : f))}
                    rows={4}
                  />
                </AdminField>
              </AdminFormSection>
            </AdminWizardPanel>

            <AdminWizardPanel stepId="metrics" currentStepId={currentStepId}>
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
            </AdminWizardPanel>
          </AdminFullscreenForm>
        ) : null}
      </AdminModal>
    </>
  );
}
