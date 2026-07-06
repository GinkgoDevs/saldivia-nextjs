"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProvinceProject, reorderProvinceProjects, saveProvinceProject } from "@/app/actions/admin-content";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { ProvinceProjectRow } from "@/types/province-project";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
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
  AdminReorderToggle,
  AdminSelect,
  AdminWizardPanel,
  adminToast,
  MediaDropzone,
  type WizardStep,
} from "../_ui/admin-ui";

const PROJECT_WIZARD_STEPS: WizardStep[] = [
  {
    id: "basics",
    title: "Proyecto",
    hint: "Provincia del mapa, título y descripción de la empresa o caso.",
  },
  {
    id: "media",
    title: "Imagen y detalles",
    hint: "Foto del colectivo, zona, segmento y año del proyecto.",
  },
  {
    id: "publish",
    title: "Publicación",
    hint: "Orden en el mapa y visibilidad en el sitio.",
  },
];

type ProvinceOption = { id: string; name: string };

type FormState = {
  id: string | null;
  province_slug: string;
  title: string;
  description: string;
  location_label: string;
  segment: string;
  year: string;
  image_url: string;
  sort_order: number;
  active: boolean;
};

function emptyForm(): FormState {
  return {
    id: null,
    province_slug: "",
    title: "",
    description: "",
    location_label: "",
    segment: "",
    year: "",
    image_url: "",
    sort_order: 0,
    active: true,
  };
}

function rowToForm(row: ProvinceProjectRow): FormState {
  return {
    id: row.id,
    province_slug: row.province_slug,
    title: row.title,
    description: row.description ?? "",
    location_label: row.location_label ?? "",
    segment: row.segment ?? "",
    year: row.year ?? "",
    image_url: row.image_url ?? "",
    sort_order: row.sort_order ?? 0,
    active: row.active,
  };
}

type Props = { initial: ProvinceProjectRow[]; provinceOptions: ProvinceOption[] };

function reorderList<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function ProvinceProjectsAdmin({ initial, provinceOptions }: Props) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [reorderMode, setReorderMode] = useState(false);
  const [orderProvince, setOrderProvince] = useState(provinceOptions[0]?.id ?? "");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    setList(initial);
  }, [initial]);

  const sortedList = useMemo(
    () =>
      [...list].sort(
        (a, b) =>
          a.province_slug.localeCompare(b.province_slug, "es") ||
          (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
          a.title.localeCompare(b.title, "es"),
      ),
    [list],
  );

  const orderedForProvince = useMemo(
    () =>
      list
        .filter((row) => row.province_slug === orderProvince)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.title.localeCompare(b.title, "es")),
    [list, orderProvince],
  );

  const editing = Boolean(form.id);

  const provinceNameById = useMemo(
    () => new Map(provinceOptions.map((p) => [p.id, p.name])),
    [provinceOptions],
  );

  const displayList = reorderMode ? orderedForProvince : sortedList;

  function projectSubtitle(row: ProvinceProjectRow) {
    return (
      <>
        {provinceNameById.get(row.province_slug) ?? row.province_slug}
        {row.location_label ? ` · ${row.location_label}` : ""}
      </>
    );
  }

  function renderProjectCard(row: ProvinceProjectRow, index: number) {
    return (
      <AdminCrudCard
        key={row.id}
        dragHandle={
          reorderMode ? (
            <AdminCrudDragHandle
              disabled={busy}
              onDragStart={(e) => {
                e.stopPropagation();
                setDraggingId(row.id);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", `${index}|${row.id}`);
              }}
              onDragEnd={() => {
                setDraggingId(null);
                setDropTargetIndex(null);
              }}
            />
          ) : undefined
        }
        media={<AdminCrudThumbnail src={row.image_url} alt={row.title} />}
        title={row.title}
        subtitle={projectSubtitle(row)}
        badges={
          reorderMode ? (
            <AdminCrudBadge>Orden {row.sort_order ?? index}</AdminCrudBadge>
          ) : (
            <AdminCrudBadge tone={row.active ? "secondary" : "warning"}>
              {row.active ? "Visible" : "Oculto"}
            </AdminCrudBadge>
          )
        }
        disabled={busy}
        isDragging={reorderMode && draggingId === row.id}
        isDropTarget={reorderMode && dropTargetIndex === index}
        onDragOver={
          reorderMode
            ? (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDropTargetIndex(index);
              }
            : undefined
        }
        onDrop={
          reorderMode
            ? (e) => {
                e.preventDefault();
                setDropTargetIndex(null);
                setDraggingId(null);
                const plain = e.dataTransfer.getData("text/plain");
                const pipe = plain.indexOf("|");
                const from = pipe > 0 ? Number.parseInt(plain.slice(0, pipe), 10) : Number.NaN;
                if (!Number.isFinite(from)) return;
                void onReorderDrop(from, index);
              }
            : undefined
        }
        onEdit={() => openEdit(row)}
        onDelete={() => void onDeleteRow(row)}
      />
    );
  }

  function load(row: ProvinceProjectRow) {
    setForm(rowToForm(row));
  }

  function newRow() {
    setForm(emptyForm());
  }

  function openEdit(row: ProvinceProjectRow) {
    load(row);
    setWizardStep(0);
    setModalOpen(true);
  }

  function openNew() {
    newRow();
    setWizardStep(0);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setWizardStep(0);
  }

  function validateWizardStep(step: number): boolean {
    if (step !== 0) return true;
    if (!form.province_slug || !form.title.trim()) {
      adminToast.error("Completá provincia y título antes de continuar.");
      return false;
    }
    return true;
  }

  function goNextStep() {
    if (!validateWizardStep(wizardStep)) return;
    setWizardStep((s) => Math.min(s + 1, PROJECT_WIZARD_STEPS.length - 1));
  }

  function goPrevStep() {
    setWizardStep((s) => Math.max(s - 1, 0));
  }

  const currentStepId = PROJECT_WIZARD_STEPS[wizardStep]?.id ?? "basics";

  async function onReorderDrop(fromIndex: number, toIndex: number) {
    if (!orderProvince || fromIndex === toIndex) return;
    const reordered = reorderList(orderedForProvince, fromIndex, toIndex);
    const orderedIds = reordered.map((r) => r.id);
    setBusy(true);
    const r = await reorderProvinceProjects(orderProvince, orderedIds);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error === "validation" ? "No se pudo guardar el orden." : r.error);
      return;
    }
    setList((prev) =>
      prev.map((row) => {
        const idx = orderedIds.indexOf(row.id);
        if (idx === -1) return row;
        return { ...row, sort_order: idx };
      }),
    );
    adminToast.success("Orden actualizado.");
    router.refresh();
  }

  async function onImageFile(file: File) {
    setUploading(true);
    try {
      const r = await uploadMediaFromBrowser(file, { folder: "mapa-projects" });
      if (!r.ok) {
        adminToast.error(r.error);
        return;
      }
      setForm((f) => ({ ...f, image_url: r.publicUrl }));
      adminToast.info("Imagen subida. Pulse Guardar para publicar.");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await saveProvinceProject({
      id: form.id,
      province_slug: form.province_slug,
      title: form.title,
      description: form.description,
      location_label: form.location_label,
      segment: form.segment,
      year: form.year,
      image_url: form.image_url,
      sort_order: form.sort_order,
      active: form.active,
    });
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error === "validation" ? "Provincia y título son obligatorios." : r.error);
      return;
    }
    adminToast.success("Proyecto guardado.");
    setModalOpen(false);
    if (!form.id) setForm(emptyForm());
    router.refresh();
  }

  async function onDeleteRow(row: ProvinceProjectRow) {
    if (!window.confirm(`¿Eliminar "${row.title}" del mapa?`)) return;
    setBusy(true);
    const r = await deleteProvinceProject(row.id);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setList((p) => p.filter((x) => x.id !== row.id));
    if (form.id === row.id) {
      setForm(emptyForm());
      setModalOpen(false);
    }
    adminToast.success(`"${row.title}" eliminado.`);
  }

  async function onDelete() {
    if (!form.id) return;
    const row = list.find((r) => r.id === form.id);
    if (row) await onDeleteRow(row);
  }

  return (
    <>
      <AdminCrudLayout
        summary={
          reorderMode ? (
            <>
              Reordenando proyectos de{" "}
              <strong>{provinceNameById.get(orderProvince) ?? orderProvince}</strong> · arrastrá con el
              asa para cambiar la posición en el mapa
            </>
          ) : (
            <>
              {sortedList.length} proyecto{sortedList.length === 1 ? "" : "s"} en el mapa de provincias
            </>
          )
        }
        toolbar={
          <AdminReorderToggle
            enabled={reorderMode}
            disabled={busy}
            onChange={(on) => {
              setReorderMode(on);
              setDraggingId(null);
              setDropTargetIndex(null);
            }}
          />
        }
        filter={
          reorderMode ? (
            <div className="max-w-md">
              <AdminField id="pp-order-prov" label="Provincia a reordenar">
                <AdminSelect
                  id="pp-order-prov"
                  value={orderProvince}
                  onChange={(e) => {
                    setOrderProvince(e.target.value);
                    setDraggingId(null);
                    setDropTargetIndex(null);
                  }}
                >
                  {provinceOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminField>
            </div>
          ) : null
        }
        newLabel="Nuevo proyecto"
        onNew={openNew}
        newDisabled={busy || reorderMode}
      >
        {displayList.length === 0 ? (
          <li className="rounded-sm border border-dashed border-outline-variant/40 p-8 text-center text-sm text-on-surface-variant">
            {reorderMode ? "Sin proyectos en esta provincia." : "No hay proyectos cargados."}
          </li>
        ) : (
          displayList.map((row, index) => renderProjectCard(row, index))
        )}
      </AdminCrudLayout>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Editar: ${form.title || "proyecto"}` : "Nuevo proyecto"}
        fullscreen
        footer={
          <AdminModalFooter
            formId="province-project-form"
            saving={busy}
            uploading={uploading}
            hideSave={wizardStep < PROJECT_WIZARD_STEPS.length - 1}
            onCancel={closeModal}
            onDelete={
              editing && wizardStep === PROJECT_WIZARD_STEPS.length - 1 ? () => void onDelete() : undefined
            }
            leading={
              <>
                {wizardStep > 0 ? (
                  <Button type="button" variant="outline" disabled={busy} onClick={goPrevStep}>
                    Anterior
                  </Button>
                ) : null}
                {wizardStep < PROJECT_WIZARD_STEPS.length - 1 ? (
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
          id="province-project-form"
          steps={PROJECT_WIZARD_STEPS}
          currentStep={wizardStep}
          onStepClick={(index) => {
            if (index < wizardStep) setWizardStep(index);
            else if (index > wizardStep && validateWizardStep(wizardStep)) setWizardStep(index);
          }}
          onSubmit={(e) => {
            if (wizardStep < PROJECT_WIZARD_STEPS.length - 1) {
              e.preventDefault();
              goNextStep();
              return;
            }
            void onSave(e);
          }}
        >
          <AdminWizardPanel stepId="basics" currentStepId={currentStepId}>
            <AdminFormSection
              title="Identificación"
              description="El slug de provincia debe coincidir con el mapa SVG (ej. buenos-aires, cordoba)."
            >
              <AdminField id="pp-prov" label="Provincia (mapa)" required>
                <AdminSelect
                  id="pp-prov"
                  value={form.province_slug}
                  onChange={(e) => setForm((f) => ({ ...f, province_slug: e.target.value }))}
                  required
                >
                  <option value="">Elegir…</option>
                  {provinceOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </AdminSelect>
              </AdminField>
              <AdminField id="pp-title" label="Título del proyecto" required>
                <Input
                  id="pp-title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </AdminField>
              <AdminField id="pp-desc" label="Descripción">
                <Textarea
                  id="pp-desc"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </AdminField>
            </AdminFormSection>
          </AdminWizardPanel>

          <AdminWizardPanel stepId="media" currentStepId={currentStepId}>
            <AdminFormSection title="Imagen" description="Foto del colectivo o del proyecto en la empresa.">
              <MediaDropzone
                id="pp-img"
                label="Imagen del proyecto"
                value={form.image_url}
                uploading={uploading}
                disabled={busy}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                onFileSelect={onImageFile}
              />
            </AdminFormSection>
            <AdminFormSection title="Detalles opcionales">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AdminField id="pp-loc" label="Ubicación / zona">
                  <Input
                    id="pp-loc"
                    value={form.location_label}
                    onChange={(e) => setForm((f) => ({ ...f, location_label: e.target.value }))}
                  />
                </AdminField>
                <AdminField id="pp-seg" label="Segmento">
                  <Input
                    id="pp-seg"
                    value={form.segment}
                    onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value }))}
                  />
                </AdminField>
                <AdminField id="pp-year" label="Año">
                  <Input
                    id="pp-year"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  />
                </AdminField>
              </div>
            </AdminFormSection>
          </AdminWizardPanel>

          <AdminWizardPanel stepId="publish" currentStepId={currentStepId}>
            <AdminFormSection title="Visibilidad y orden">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AdminField id="pp-sort" label="Orden" hint="0 = primero en la provincia.">
                  <Input
                    id="pp-sort"
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))}
                  />
                </AdminField>
              </div>
              <AdminCheckbox
                id="pp-active"
                label="Activo (visible en el sitio)"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
            </AdminFormSection>
          </AdminWizardPanel>
        </AdminFullscreenForm>
      </AdminModal>
    </>
  );
}
