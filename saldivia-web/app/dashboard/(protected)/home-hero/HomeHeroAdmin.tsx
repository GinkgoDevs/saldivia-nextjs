"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";

import {
  deleteHomeHeroSlide,
  reorderHomeHeroSlides,
  saveHomeHeroSlide,
} from "@/app/actions/admin-content";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { HomeHeroSlideRow } from "@/types/home-hero";
import {
  AdminCheckbox,
  AdminCrudBadge,
  AdminCrudCard,
  AdminCrudDragHandle,
  AdminCrudLayout,
  AdminCrudThumbnail,
  AdminEmptyState,
  AdminField,
  AdminFormSection,
  AdminFullscreenForm,
  AdminModal,
  AdminModalFooter,
  AdminWizardPanel,
  adminToast,
  MediaDropzone,
  type WizardStep,
} from "../_ui/admin-ui";

const HERO_WIZARD_STEPS: WizardStep[] = [
  {
    id: "image",
    title: "Imagen",
    hint: "Foto de fondo del carrusel principal del home.",
  },
  {
    id: "copy",
    title: "Textos",
    hint: "Título, subtítulo y antetítulo que se superponen a la imagen.",
  },
  {
    id: "actions",
    title: "Botones y publicación",
    hint: "Enlaces de los CTAs, orden y visibilidad de la slide.",
  },
];

type FormState = {
  id: string | null;
  sort_order: number;
  image_url: string;
  image_alt: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
  active: boolean;
};

function emptyForm(sortOrder: number): FormState {
  return {
    id: null,
    sort_order: sortOrder,
    image_url: "",
    image_alt: "",
    eyebrow: "",
    title: "",
    highlight: "",
    subtitle: "",
    primary_label: "",
    primary_href: "",
    secondary_label: "",
    secondary_href: "",
    active: true,
  };
}

function slideToForm(s: HomeHeroSlideRow): FormState {
  return {
    id: s.id,
    sort_order: s.sort_order,
    image_url: s.image_url ?? "",
    image_alt: s.image_alt ?? "",
    eyebrow: s.eyebrow ?? "",
    title: s.title ?? "",
    highlight: s.highlight ?? "",
    subtitle: s.subtitle ?? "",
    primary_label: s.primary_label ?? "",
    primary_href: s.primary_href ?? "",
    secondary_label: s.secondary_label ?? "",
    secondary_href: s.secondary_href ?? "",
    active: s.active,
  };
}

function reorderList<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return items;
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

type Props = { initialSlides: HomeHeroSlideRow[] };

export function HomeHeroAdmin({ initialSlides }: Props) {
  const router = useRouter();
  const [list, setList] = useState(initialSlides);
  const [form, setForm] = useState<FormState>(() => emptyForm(initialSlides.length));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    setList(initialSlides);
  }, [initialSlides]);

  const ordered = useMemo(
    () => [...list].sort((a, b) => a.sort_order - b.sort_order),
    [list],
  );

  const editing = Boolean(form.id);

  function loadSlide(s: HomeHeroSlideRow) {
    setForm(slideToForm(s));
  }

  function newSlide() {
    setForm(emptyForm(list.length));
  }

  function openEdit(s: HomeHeroSlideRow) {
    loadSlide(s);
    setWizardStep(0);
    setModalOpen(true);
  }

  function openNew() {
    newSlide();
    setWizardStep(0);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setWizardStep(0);
  }

  function validateWizardStep(step: number): boolean {
    if (step === 0 && !form.image_url.trim() && !form.title.trim()) {
      adminToast.error("Subí una imagen o completá el título antes de continuar.");
      return false;
    }
    return true;
  }

  function goNextStep() {
    if (!validateWizardStep(wizardStep)) return;
    setWizardStep((s) => Math.min(s + 1, HERO_WIZARD_STEPS.length - 1));
  }

  function goPrevStep() {
    setWizardStep((s) => Math.max(s - 1, 0));
  }

  const currentStepId = HERO_WIZARD_STEPS[wizardStep]?.id ?? "image";

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await saveHomeHeroSlide({
        id: form.id,
        sort_order: form.sort_order,
        image_url: form.image_url,
        image_alt: form.image_alt,
        eyebrow: form.eyebrow,
        title: form.title,
        highlight: form.highlight,
        subtitle: form.subtitle,
        primary_label: form.primary_label,
        primary_href: form.primary_href,
        secondary_label: form.secondary_label,
        secondary_href: form.secondary_href,
        active: form.active,
      });
      if (!r.ok) {
        adminToast.error(r.error === "validation" ? "Completá al menos título o imagen." : r.error);
        return;
      }
      adminToast.success("Slide guardada.");
      setModalOpen(false);
      if (!form.id) setForm(emptyForm(list.length + 1));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteSlide(s: HomeHeroSlideRow) {
    if (!window.confirm("¿Eliminar esta slide del hero?")) return;
    setBusy(true);
    const r = await deleteHomeHeroSlide(s.id);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setList((prev) => prev.filter((x) => x.id !== s.id));
    if (form.id === s.id) {
      setForm(emptyForm(Math.max(0, list.length - 1)));
      setModalOpen(false);
    }
    adminToast.success("Slide eliminada.");
    router.refresh();
  }

  async function onDelete() {
    if (!form.id) return;
    const slide = list.find((s) => s.id === form.id);
    if (slide) await onDeleteSlide(slide);
  }

  async function onReorderDrop(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const reordered = reorderList(ordered, fromIndex, toIndex);
    const orderedIds = reordered.map((s) => s.id);
    setList(reordered.map((s, i) => ({ ...s, sort_order: i })));
    setBusy(true);
    const r = await reorderHomeHeroSlides(orderedIds);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    adminToast.success("Orden actualizado.");
    router.refresh();
  }

  async function onImageFile(file: File) {
    setUploading(true);
    try {
      const r = await uploadMediaFromBrowser(file, { folder: "home-hero" });
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

  return (
    <>
      <AdminCrudLayout
        summary={
          <>
            {ordered.length} slide{ordered.length === 1 ? "" : "s"} · carrusel del inicio · arrastrá con el asa
            para reordenar
          </>
        }
        newLabel="Nueva slide"
        onNew={openNew}
        newDisabled={busy}
      >
        {ordered.length === 0 ? (
          <AdminEmptyState
            icon={Layers}
            title="Sin slides del hero"
            description="El carrusel principal del inicio está vacío. Creá la primera slide con imagen, títulos y botones."
          />
        ) : (
          ordered.map((s, index) => (
            <AdminCrudCard
              key={s.id}
              dragHandle={
                <AdminCrudDragHandle
                  disabled={busy}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    setDraggingId(s.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", `${index}|${s.id}`);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDropTargetIndex(null);
                  }}
                />
              }
              media={<AdminCrudThumbnail src={s.image_url} />}
              title={s.title || s.highlight || "(sin título)"}
              subtitle={
                <>
                  Orden {s.sort_order}
                  {s.eyebrow ? ` · ${s.eyebrow}` : ""}
                </>
              }
              badges={
                <AdminCrudBadge tone={s.active ? "secondary" : "warning"}>
                  {s.active ? "Activa" : "Inactiva"}
                </AdminCrudBadge>
              }
              disabled={busy}
              isDragging={draggingId === s.id}
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
              onEdit={() => openEdit(s)}
              onDelete={() => void onDeleteSlide(s)}
            />
          ))
        )}
      </AdminCrudLayout>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Editar: ${form.title || form.highlight || "slide"}` : "Nueva slide"}
        fullscreen
        footer={
          <AdminModalFooter
            formId="hero-slide-form"
            saving={busy}
            uploading={uploading}
            hideSave={wizardStep < HERO_WIZARD_STEPS.length - 1}
            onCancel={closeModal}
            onDelete={
              editing && wizardStep === HERO_WIZARD_STEPS.length - 1 ? () => void onDelete() : undefined
            }
            leading={
              <>
                {wizardStep > 0 ? (
                  <Button type="button" variant="outline" disabled={busy} onClick={goPrevStep}>
                    Anterior
                  </Button>
                ) : null}
                {wizardStep < HERO_WIZARD_STEPS.length - 1 ? (
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
          id="hero-slide-form"
          steps={HERO_WIZARD_STEPS}
          currentStep={wizardStep}
          onStepClick={(index) => {
            if (index < wizardStep) setWizardStep(index);
            else if (index > wizardStep && validateWizardStep(wizardStep)) setWizardStep(index);
          }}
          onSubmit={(e) => {
            if (wizardStep < HERO_WIZARD_STEPS.length - 1) {
              e.preventDefault();
              goNextStep();
              return;
            }
            void onSave(e);
          }}
        >
          <AdminWizardPanel stepId="image" currentStepId={currentStepId}>
            <AdminFormSection title="Imagen de fondo" description="Foto amplia del bus o planta. Se verá detrás del texto.">
              <MediaDropzone
                id="hero-slide-image"
                label="Imagen de fondo"
                value={form.image_url}
                previewAspect="aspect-[16/7]"
                compact
                showUrlField={false}
                uploading={uploading}
                disabled={busy}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                onFileSelect={onImageFile}
              />
              <AdminField id="hero-alt" label="Texto alternativo (accesibilidad)" hint="Describe la imagen para lectores de pantalla.">
                <Input
                  id="hero-alt"
                  value={form.image_alt}
                  onChange={(e) => setForm((f) => ({ ...f, image_alt: e.target.value }))}
                />
              </AdminField>
            </AdminFormSection>
          </AdminWizardPanel>

          <AdminWizardPanel stepId="copy" currentStepId={currentStepId}>
            <AdminFormSection title="Contenido principal">
              <AdminField id="hero-eyebrow" label="Antetítulo" hint="Línea pequeña sobre el título.">
                <Input
                  id="hero-eyebrow"
                  value={form.eyebrow}
                  onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
                  placeholder="Ingeniería de clase mundial"
                />
              </AdminField>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField id="hero-title" label="Título (línea 1)" required>
                  <Input
                    id="hero-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Nuevo ARIES"
                  />
                </AdminField>
                <AdminField id="hero-highlight" label="Destacado (línea 2)">
                  <Input
                    id="hero-highlight"
                    value={form.highlight}
                    onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))}
                    placeholder="405 DD"
                  />
                </AdminField>
              </div>
              <AdminField id="hero-subtitle" label="Subtítulo / descripción">
                <Textarea
                  id="hero-subtitle"
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                />
              </AdminField>
            </AdminFormSection>
          </AdminWizardPanel>

          <AdminWizardPanel stepId="actions" currentStepId={currentStepId}>
            <AdminFormSection title="Botones del slide">
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id="hero-p-label" label="Principal — texto">
                  <Input
                    id="hero-p-label"
                    value={form.primary_label}
                    onChange={(e) => setForm((f) => ({ ...f, primary_label: e.target.value }))}
                    placeholder="Explorar modelos"
                  />
                </AdminField>
                <AdminField id="hero-p-href" label="Principal — enlace">
                  <Input
                    id="hero-p-href"
                    value={form.primary_href}
                    onChange={(e) => setForm((f) => ({ ...f, primary_href: e.target.value }))}
                    placeholder="/flota"
                  />
                </AdminField>
                <AdminField id="hero-s-label" label="Secundario — texto">
                  <Input
                    id="hero-s-label"
                    value={form.secondary_label}
                    onChange={(e) => setForm((f) => ({ ...f, secondary_label: e.target.value }))}
                    placeholder="Tour industrial"
                  />
                </AdminField>
                <AdminField id="hero-s-href" label="Secundario — enlace">
                  <Input
                    id="hero-s-href"
                    value={form.secondary_href}
                    onChange={(e) => setForm((f) => ({ ...f, secondary_href: e.target.value }))}
                    placeholder="/nosotros"
                  />
                </AdminField>
              </div>
            </AdminFormSection>
            <AdminFormSection title="Publicación">
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id="hero-order" label="Orden">
                  <Input
                    id="hero-order"
                    type="number"
                    value={String(form.sort_order)}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sort_order: Number.parseInt(e.target.value, 10) || 0 }))
                    }
                  />
                </AdminField>
                <AdminCheckbox
                  id="hero-active"
                  label="Slide activa"
                  description="Solo las slides activas se muestran en el home."
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
              </div>
            </AdminFormSection>
          </AdminWizardPanel>
        </AdminFullscreenForm>
      </AdminModal>
    </>
  );
}
