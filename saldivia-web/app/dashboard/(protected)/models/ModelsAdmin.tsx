"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { deleteModel, reorderModels, saveModel } from "@/app/actions/admin-content";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { Model, ModelAdmin, ModelSegment, ModelVariantAdmin } from "@/types/model";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import {
  ModelVariantsEditor,
  specRowEmpty,
  type SpecRow,
  type VariantFormRow,
} from "./ModelVariantsEditor";
import { HeroBackgroundField } from "./HeroBackgroundField";
import {
  AdminCheckbox,
  AdminCrudBadge,
  AdminCrudCard,
  AdminCrudDragHandle,
  AdminCrudLayout,
  AdminCrudThumbnail,
  AdminField,
  AdminFormSection,
  AdminFullscreenForm,
  AdminModal,
  AdminModalFooter,
  AdminSelect,
  AdminWizardPanel,
  adminToast,
  MediaDropzone,
  type WizardStep,
} from "../_ui/admin-ui";

const MODEL_WIZARD_STEPS: WizardStep[] = [
  {
    id: "basics",
    title: "Datos básicos",
    hint: "Nombre, URL y descripción del colectivo. Son los datos que verá el visitante primero.",
  },
  {
    id: "tech",
    title: "Ficha técnica",
    hint: "Especificaciones y características. Podés dejar variantes vacías si el modelo tiene una sola versión.",
  },
  {
    id: "media",
    title: "Imágenes y PDF",
    hint: "Portada del catálogo, foto de fondo de la ficha y documento descargable.",
  },
  {
    id: "publish",
    title: "Publicación",
    hint: "Orden en el menú, visibilidad en la web y si aparece en el showcase del inicio.",
  },
];

const SEGMENTS: { value: ModelSegment; label: string }[] = [
  { value: "urbano", label: "Urbano" },
  { value: "interurbano", label: "Interurbano" },
  { value: "interprovincial", label: "Interprovincial" },
  { value: "especiales", label: "Especiales" },
];

const empty: Omit<Model, "id" | "created_at"> & { id: string | null } = {
  id: null,
  slug: "",
  name: "",
  segment: "urbano",
  description: null,
  cover_image_url: null,
  hero_background_image_url: null,
  hero_background_focal_x: 50,
  hero_background_focal_y: 50,
  hero_background_zoom: 1,
  pdf_url: null,
  active: true,
  show_in_showcase: false,
  sort_order: 0,
};

type SpecRowLocal = SpecRow;

const specRowEmptyLocal = specRowEmpty;

function specsFromModel(m: ModelAdmin): SpecRowLocal[] {
  const rows = [...(m.products ?? [])]
    .filter((p) => !p.variant_id)
    .sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.spec_key.localeCompare(b.spec_key),
  );
  return rows.map((p) => ({ spec_key: p.spec_key, spec_value: p.spec_value }));
}

function featuresFromModel(m: ModelAdmin): string[] {
  return [...(m.model_general_features ?? [])]
    .filter((f) => !f.variant_id)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((f) => f.body);
}

function variantsFromModel(m: ModelAdmin): VariantFormRow[] {
  const rows = [...(m.model_variants ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
  );
  if (rows.length === 0) return [];

  return rows.map((v: ModelVariantAdmin) => ({
    id: v.id,
    code: v.code,
    name: v.name,
    description: v.description ?? "",
    is_default: v.is_default,
    tech_specs:
      (v.products ?? []).length > 0
        ? (v.products ?? []).map((p) => ({ spec_key: p.spec_key, spec_value: p.spec_value }))
        : [specRowEmptyLocal()],
    general_feature_bodies:
      (v.model_general_features ?? []).length > 0
        ? (v.model_general_features ?? []).map((f) => f.body)
        : [""],
  }));
}

type Props = { initial: ModelAdmin[] };

function reorderList<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return items;
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

export function ModelsAdmin({ initial }: Props) {
  const router = useRouter();
  const [list, setList] = useState<ModelAdmin[]>(initial);
  const [form, setForm] = useState(empty);
  const [specRows, setSpecRows] = useState<SpecRowLocal[]>([specRowEmptyLocal()]);
  const [featureBodies, setFeatureBodies] = useState<string[]>([""]);
  const [variantRows, setVariantRows] = useState<VariantFormRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const currentStepId = MODEL_WIZARD_STEPS[wizardStep]?.id ?? MODEL_WIZARD_STEPS[0].id;

  useEffect(() => {
    setList(initial);
  }, [initial]);

  const sortedList = useMemo(
    () =>
      [...list].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
      ),
    [list],
  );

  const editing = useMemo(() => form.id, [form.id]);

  const hasActiveVariants = useMemo(
    () => variantRows.some((v) => v.name.trim() || v.code.trim()),
    [variantRows],
  );

  function load(m: ModelAdmin) {
    setForm({
      id: m.id,
      slug: m.slug,
      name: m.name,
      segment: m.segment,
      description: m.description,
      cover_image_url: m.cover_image_url,
      hero_background_image_url: m.hero_background_image_url,
      hero_background_focal_x: m.hero_background_focal_x ?? 50,
      hero_background_focal_y: m.hero_background_focal_y ?? 50,
      hero_background_zoom: m.hero_background_zoom ?? 1,
      pdf_url: m.pdf_url,
      active: m.active,
      show_in_showcase: m.show_in_showcase ?? false,
      sort_order: m.sort_order ?? 0,
    });
    const specs = specsFromModel(m);
    setSpecRows(specs.length > 0 ? specs : [specRowEmptyLocal()]);
    const feats = featuresFromModel(m);
    setFeatureBodies(feats.length > 0 ? feats : [""]);
    const vars = variantsFromModel(m);
    setVariantRows(vars);
  }

  function openEdit(m: ModelAdmin) {
    load(m);
    setWizardStep(0);
    setModalOpen(true);
  }

  function openNew() {
    newModel();
    setWizardStep(0);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setWizardStep(0);
  }

  function newModel() {
    setForm({ ...empty, sort_order: list.length });
    setSpecRows([specRowEmptyLocal()]);
    setFeatureBodies([""]);
    setVariantRows([]);
  }

  async function onDeleteModel(m: ModelAdmin) {
    if (
      !window.confirm(
        `¿Eliminar "${m.name}"? Se eliminan también sus imágenes, especificaciones y características vinculadas.`,
      )
    ) {
      return;
    }
    setBusy(true);
    const r = await deleteModel(m.id);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setList((prev) => prev.filter((item) => item.id !== m.id));
    if (form.id === m.id) {
      setForm(empty);
      setModalOpen(false);
    }
    adminToast.success(`"${m.name}" eliminado.`);
    router.refresh();
  }

  async function onReorderDrop(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const reordered = reorderList(sortedList, fromIndex, toIndex);
    const orderedIds = reordered.map((m) => m.id);
    setBusy(true);
    const r = await reorderModels(orderedIds);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error === "validation" ? "No se pudo guardar el orden." : r.error);
      return;
    }
    setList((prev) =>
      prev.map((m) => {
        const idx = orderedIds.indexOf(m.id);
        if (idx === -1) return m;
        return { ...m, sort_order: idx };
      }),
    );
    setForm((f) => {
      if (!f.id) return f;
      const idx = orderedIds.indexOf(f.id);
      if (idx === -1) return f;
      return { ...f, sort_order: idx };
    });
    adminToast.success("Orden actualizado.");
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await saveModel({
        id: form.id,
        slug: form.slug,
        name: form.name,
        segment: form.segment,
        description: form.description ?? "",
        cover_image_url: form.cover_image_url ?? "",
        hero_background_image_url: form.hero_background_image_url ?? "",
        hero_background_focal_x: form.hero_background_focal_x ?? 50,
        hero_background_focal_y: form.hero_background_focal_y ?? 50,
        hero_background_zoom: form.hero_background_zoom ?? 1,
        pdf_url: form.pdf_url ?? "",
        sort_order: form.sort_order ?? 0,
        active: form.active,
        show_in_showcase: form.show_in_showcase,
        tech_specs: specRows,
        general_feature_bodies: featureBodies,
        variants: variantRows.filter((v) => v.name.trim() || v.code.trim()),
      });
      if (!r.ok) {
        adminToast.error(r.error);
        return;
      }
      const savedId = r.id;
      const savedHero = {
        hero_background_image_url: form.hero_background_image_url,
        hero_background_focal_x: form.hero_background_focal_x ?? 50,
        hero_background_focal_y: form.hero_background_focal_y ?? 50,
        hero_background_zoom: form.hero_background_zoom ?? 1,
      };
      setList((prev) => {
        const patch = {
          slug: form.slug,
          name: form.name,
          segment: form.segment,
          description: form.description,
          cover_image_url: form.cover_image_url,
          ...savedHero,
          pdf_url: form.pdf_url,
          active: form.active,
          show_in_showcase: form.show_in_showcase ?? false,
          sort_order: form.sort_order ?? 0,
        };
        const exists = prev.some((m) => m.id === savedId);
        if (exists) {
          return prev.map((m) => (m.id === savedId ? { ...m, ...patch } : m));
        }
        return [
          ...prev,
          {
            ...empty,
            id: savedId,
            created_at: new Date().toISOString(),
            ...patch,
            products: [],
            model_general_features: [],
            model_variants: [],
          },
        ];
      });
      setForm((f) => ({ ...f, id: savedId }));
      if (r.warning) {
        adminToast.info(r.warning);
      } else {
        adminToast.success("Modelo guardado.");
      }
      setModalOpen(false);
      router.refresh();
    } catch {
      adminToast.error("No se pudo guardar. Intente de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!form.id) return;
    const current = list.find((m) => m.id === form.id);
    await onDeleteModel(current ?? ({ id: form.id, name: form.name } as ModelAdmin));
  }

  function validateWizardStep(stepIndex: number): boolean {
    if (stepIndex !== 0) return true;
    if (!form.name.trim() || !form.slug.trim()) {
      adminToast.error("Completá el nombre y el slug antes de continuar.");
      return false;
    }
    return true;
  }

  function goNextStep() {
    if (!validateWizardStep(wizardStep)) return;
    setWizardStep((s) => Math.min(s + 1, MODEL_WIZARD_STEPS.length - 1));
  }

  function goPrevStep() {
    setWizardStep((s) => Math.max(s - 1, 0));
  }

  async function onFile(which: "cover" | "hero" | "pdf", file: File | null) {
    if (!file) return;
    if (which === "hero" && !form.id) {
      adminToast.info("Guardá el modelo una vez antes de subir el hero (cada colectivo tiene el suyo).");
      return;
    }
    setUploading(true);
    try {
      const r = await uploadMediaFromBrowser(
        file,
        which === "hero" && form.id ? { folder: `models/${form.id}/hero` } : undefined,
      );
      if (!r.ok) {
        adminToast.error(r.error === "unauthorized" ? "Sesión vencida." : r.error);
        return;
      }
      if (which === "cover") {
        setForm((f) => ({ ...f, cover_image_url: r.publicUrl }));
      } else if (which === "hero") {
        setForm((f) => ({
          ...f,
          hero_background_image_url: r.publicUrl,
          hero_background_focal_x: 50,
          hero_background_focal_y: 50,
          hero_background_zoom: 1,
        }));
      } else {
        setForm((f) => ({ ...f, pdf_url: r.publicUrl }));
      }
      adminToast.info("Archivo subido. Pulse Guardar para aplicar los cambios a este modelo.");
    } catch {
      adminToast.error("Error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <AdminCrudLayout
        summary={
          <>
            {sortedList.length} modelo{sortedList.length === 1 ? "" : "s"} · orden por{" "}
            <code className="text-xs">sort_order</code> · arrastrá con el asa para reordenar
          </>
        }
        newLabel="Nuevo modelo"
        onNew={openNew}
        newDisabled={busy}
      >
        {sortedList.map((m, index) => (
          <AdminCrudCard
            key={m.id}
            dragHandle={
              <AdminCrudDragHandle
                disabled={busy}
                onDragStart={(e) => {
                  e.stopPropagation();
                  setDraggingId(m.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", `${index}|${m.id}`);
                }}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDropTargetIndex(null);
                }}
              />
            }
            media={<AdminCrudThumbnail src={m.cover_image_url} alt={m.name} />}
            title={m.name}
            subtitle={
              <>
                Orden {m.sort_order ?? 0} · <span className="font-mono text-xs">{m.slug}</span> · {m.segment}
              </>
            }
            badges={
              <>
                {!m.active ? <AdminCrudBadge tone="warning">Inactivo</AdminCrudBadge> : null}
                {(m.model_variants?.length ?? 0) > 0 ? (
                  <AdminCrudBadge>
                    {m.model_variants!.length} configuración{m.model_variants!.length === 1 ? "" : "es"}
                  </AdminCrudBadge>
                ) : null}
                {m.show_in_showcase ? (
                  <AdminCrudBadge tone="secondary">Showcase</AdminCrudBadge>
                ) : null}
                {m.hero_background_image_url ? (
                  <AdminCrudBadge tone="primary">Hero propio</AdminCrudBadge>
                ) : null}
              </>
            }
            disabled={busy}
            isDragging={draggingId === m.id}
            isDropTarget={dropTargetIndex === index}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDropTargetIndex(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDropTargetIndex(null);
              setDraggingId(null);
              const plain = e.dataTransfer.getData("text/plain");
              const pipe = plain.indexOf("|");
              const from = pipe > 0 ? Number.parseInt(plain.slice(0, pipe), 10) : Number.NaN;
              if (!Number.isFinite(from)) return;
              void onReorderDrop(from, index);
            }}
            onEdit={() => openEdit(m)}
            onDelete={() => void onDeleteModel(m)}
          />
        ))}
      </AdminCrudLayout>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Editar: ${form.name || "modelo"}` : "Nuevo modelo"}
        fullscreen
        footer={
          <AdminModalFooter
            formId="model-wizard-form"
            saving={busy}
            uploading={uploading}
            saveLabel="Guardar modelo"
            hideSave={wizardStep < MODEL_WIZARD_STEPS.length - 1}
            onCancel={closeModal}
            onDelete={
              editing && wizardStep === MODEL_WIZARD_STEPS.length - 1 ? () => void onDelete() : undefined
            }
            leading={
              <>
                {wizardStep > 0 ? (
                  <Button type="button" variant="outline" disabled={busy} onClick={goPrevStep}>
                    Anterior
                  </Button>
                ) : null}
                {wizardStep < MODEL_WIZARD_STEPS.length - 1 ? (
                  <Button type="button" disabled={busy} onClick={goNextStep}>
                    Siguiente
                  </Button>
                ) : null}
              </>
            }
          />
        }
      >
        <AdminFullscreenForm
          id="model-wizard-form"
          steps={MODEL_WIZARD_STEPS}
          currentStep={wizardStep}
          onStepClick={(index) => {
            if (index < wizardStep) setWizardStep(index);
            else if (index > wizardStep && validateWizardStep(wizardStep)) setWizardStep(index);
          }}
          onSubmit={(e) => {
            if (wizardStep < MODEL_WIZARD_STEPS.length - 1) {
              e.preventDefault();
              goNextStep();
              return;
            }
            void onSave(e);
          }}
        >
              <AdminWizardPanel stepId="basics" currentStepId={currentStepId}>
                <AdminFormSection title="Identidad del modelo">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AdminField id="name" label="Nombre comercial" required>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Ej: N.A 405"
                        required
                      />
                    </AdminField>
                    <AdminField
                      id="slug"
                      label="Slug (URL)"
                      required
                      hint="Minúsculas y guiones · ej: aries-405"
                    >
                      <Input
                        id="slug"
                        value={form.slug}
                        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                        placeholder="aries-405"
                        required
                      />
                    </AdminField>
                  </div>
                  <AdminField id="segment" label="Segmento">
                    <AdminSelect
                      id="segment"
                      value={form.segment}
                      onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value as ModelSegment }))}
                    >
                      {SEGMENTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </AdminSelect>
                  </AdminField>
                  <AdminField id="description" label="Descripción corta">
                    <Textarea
                      id="description"
                      rows={2}
                      value={form.description ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Breve texto de presentación del colectivo…"
                    />
                  </AdminField>
                </AdminFormSection>
              </AdminWizardPanel>

              <AdminWizardPanel stepId="tech" currentStepId={currentStepId}>
                <AdminFormSection title="Configuraciones (opcional)">
                  <ModelVariantsEditor variants={variantRows} onChange={setVariantRows} busy={busy} />
                </AdminFormSection>
                <div className="grid gap-3 lg:grid-cols-2">
                  <AdminFormSection
                    title={hasActiveVariants ? "Especificaciones compartidas" : "Especificaciones técnicas"}
                  >
                    <div className="mb-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => setSpecRows((rows) => [...rows, specRowEmptyLocal()])}
                      className="gap-1"
                    >
                      <Plus className="size-4" aria-hidden />
                      Agregar fila
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {specRows.map((row, i) => (
                      <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                        <Input
                          aria-label={`Parámetro fila ${i + 1}`}
                          className="sm:flex-1"
                          placeholder="Ej: Motorización"
                          value={row.spec_key}
                          onChange={(e) =>
                            setSpecRows((rows) =>
                              rows.map((r, j) => (j === i ? { ...r, spec_key: e.target.value } : r)),
                            )
                          }
                        />
                        <Input
                          aria-label={`Valor fila ${i + 1}`}
                          className="sm:flex-[2]"
                          placeholder="Ej: Diesel Euro VI"
                          value={row.spec_value}
                          onChange={(e) =>
                            setSpecRows((rows) =>
                              rows.map((r, j) => (j === i ? { ...r, spec_value: e.target.value } : r)),
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-on-surface-variant"
                          disabled={busy || specRows.length <= 1}
                          aria-label={`Quitar fila ${i + 1}`}
                          onClick={() =>
                            setSpecRows((rows) => {
                              const next = rows.filter((_, j) => j !== i);
                              return next.length > 0 ? next : [specRowEmptyLocal()];
                            })
                          }
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      </div>
                    ))}
                  </div>
                </AdminFormSection>
                <AdminFormSection
                  title={hasActiveVariants ? "Características compartidas" : "Características generales"}
                >
                  <div className="mb-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => setFeatureBodies((rows) => [...rows, ""])}
                      className="gap-1"
                    >
                      <Plus className="size-4" aria-hidden />
                      Agregar ítem
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {featureBodies.map((body, i) => (
                      <div key={i} className="flex gap-2">
                        <Textarea
                          aria-label={`Característica ${i + 1}`}
                          rows={1}
                          className="min-h-10 flex-1"
                          placeholder="Texto del ítem"
                          value={body}
                          onChange={(e) =>
                            setFeatureBodies((rows) => rows.map((b, j) => (j === i ? e.target.value : b)))
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 self-start text-on-surface-variant"
                          disabled={busy || featureBodies.length <= 1}
                          aria-label={`Quitar característica ${i + 1}`}
                          onClick={() =>
                            setFeatureBodies((rows) => {
                              const next = rows.filter((_, j) => j !== i);
                              return next.length > 0 ? next : [""];
                            })
                          }
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      </div>
                    ))}
                  </div>
                </AdminFormSection>
                </div>
              </AdminWizardPanel>

              <AdminWizardPanel stepId="media" currentStepId={currentStepId}>
                <div className="grid gap-3 lg:grid-cols-2">
                  <AdminFormSection title="Portada del catálogo">
                    <MediaDropzone
                      id="cover_image"
                      label="Portada"
                      value={form.cover_image_url ?? ""}
                      uploading={uploading}
                      disabled={busy}
                      compact
                      showUrlField={false}
                      onChange={(url) => setForm((f) => ({ ...f, cover_image_url: url || null }))}
                      onFileSelect={(file) => void onFile("cover", file)}
                    />
                  </AdminFormSection>
                  <AdminFormSection title="Hero de la ficha">
                    <HeroBackgroundField
                      modelName={form.name}
                      modelId={form.id}
                      imageUrl={form.hero_background_image_url ?? ""}
                      focalX={form.hero_background_focal_x ?? 50}
                      focalY={form.hero_background_focal_y ?? 50}
                      zoom={form.hero_background_zoom ?? 1}
                      disabled={busy}
                      uploading={uploading}
                      compact
                      onImageUrlChange={(url) => setForm((f) => ({ ...f, hero_background_image_url: url || null }))}
                      onFocalChange={(x, y) =>
                        setForm((f) => ({ ...f, hero_background_focal_x: x, hero_background_focal_y: y }))
                      }
                      onZoomChange={(zoom) => setForm((f) => ({ ...f, hero_background_zoom: zoom }))}
                      onFileSelect={(file) => void onFile("hero", file)}
                    />
                  </AdminFormSection>
                </div>
                <AdminFormSection title="Ficha PDF (opcional)">
                  <MediaDropzone
                    id="pdf_url"
                    kind="pdf"
                    accept="application/pdf"
                    label="PDF"
                    value={form.pdf_url ?? ""}
                    uploading={uploading}
                    disabled={busy}
                    compact
                    showUrlField={false}
                    previewAspect="aspect-auto min-h-[3rem]"
                    onChange={(url) => setForm((f) => ({ ...f, pdf_url: url || null }))}
                    onFileSelect={(file) => void onFile("pdf", file)}
                    emptyLabel="Arrastrá el PDF o hacé clic para seleccionar"
                  />
                </AdminFormSection>
              </AdminWizardPanel>

              <AdminWizardPanel stepId="publish" currentStepId={currentStepId}>
                <AdminFormSection title="Visibilidad y orden">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminField id="sort_order" label="Orden" hint="0 = primero en el listado.">
                      <Input
                        id="sort_order"
                        type="number"
                        value={form.sort_order ?? 0}
                        onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                      />
                    </AdminField>
                    <div className="flex items-end pb-1">
                      <AdminCheckbox
                        id="active"
                        label="Visible en la web"
                        description="Desactivá para ocultar sin borrar el modelo."
                        checked={form.active}
                        onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                      />
                    </div>
                  </div>
                  <AdminCheckbox
                    id="show_in_showcase"
                    label="Mostrar en el Showcase del inicio"
                    description="Aparece en el carrusel técnico del home. Personalizá imagen y textos en Dashboard → Showcase."
                    checked={form.show_in_showcase}
                    onChange={(e) => setForm((f) => ({ ...f, show_in_showcase: e.target.checked }))}
                  />
                </AdminFormSection>
              </AdminWizardPanel>
        </AdminFullscreenForm>
      </AdminModal>
    </>
  );
}
