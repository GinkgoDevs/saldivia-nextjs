"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Images } from "lucide-react";

import {
  deleteHomeGallerySlide,
  reorderHomeGallerySlides,
  saveHomeGallerySlide,
} from "@/app/actions/admin-content";
import { Input } from "@/app/components/ui/Input";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { HomeGallerySlideRow } from "@/types/home-gallery";
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
  AdminModal,
  AdminModalFooter,
  adminToast,
  MediaDropzone,
} from "../_ui/admin-ui";

type FormState = {
  id: string | null;
  sort_order: number;
  image_url: string;
  image_alt: string;
  active: boolean;
};

function emptyForm(sortOrder: number): FormState {
  return {
    id: null,
    sort_order: sortOrder,
    image_url: "",
    image_alt: "",
    active: true,
  };
}

function slideToForm(s: HomeGallerySlideRow): FormState {
  return {
    id: s.id,
    sort_order: s.sort_order,
    image_url: s.image_url ?? "",
    image_alt: s.image_alt ?? "",
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

type Props = { initialSlides: HomeGallerySlideRow[] };

export function HomeGalleryAdmin({ initialSlides }: Props) {
  const router = useRouter();
  const [list, setList] = useState(initialSlides);
  const [form, setForm] = useState<FormState>(() => emptyForm(initialSlides.length));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  function openEdit(s: HomeGallerySlideRow) {
    setForm(slideToForm(s));
    setModalOpen(true);
  }

  function openNew() {
    setForm(emptyForm(list.length));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image_url.trim()) {
      adminToast.error("Subí una imagen antes de guardar.");
      return;
    }
    setBusy(true);
    try {
      const r = await saveHomeGallerySlide({
        id: form.id,
        sort_order: form.sort_order,
        image_url: form.image_url,
        image_alt: form.image_alt,
        active: form.active,
      });
      if (!r.ok) {
        adminToast.error(r.error === "validation" ? "La imagen es obligatoria." : r.error);
        return;
      }
      adminToast.success("Imagen guardada.");
      setModalOpen(false);
      if (!form.id) setForm(emptyForm(list.length + 1));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteSlide(s: HomeGallerySlideRow) {
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;
    setBusy(true);
    const r = await deleteHomeGallerySlide(s.id);
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
    adminToast.success("Imagen eliminada.");
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
    const r = await reorderHomeGallerySlides(orderedIds);
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
      const r = await uploadMediaFromBrowser(file, { folder: "home-gallery" });
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
            {ordered.length} imagen{ordered.length === 1 ? "" : "es"} · galería de innovación · arrastrá con el asa
            para reordenar
          </>
        }
        newLabel="Nueva imagen"
        onNew={openNew}
        newDisabled={busy}
      >
        {ordered.length === 0 ? (
          <AdminEmptyState
            icon={Images}
            title="Sin imágenes en la galería"
            description="La Galería de innovación del inicio está vacía. Subí la primera foto para mostrarla en el home."
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
              title={s.image_alt?.trim() || "(sin descripción)"}
              subtitle={<>Orden {s.sort_order}</>}
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
        title={editing ? "Editar imagen" : "Nueva imagen"}
        maxWidthClass="max-w-2xl"
        footer={
          <AdminModalFooter
            formId="gallery-slide-form"
            saving={busy}
            uploading={uploading}
            onCancel={closeModal}
            onDelete={editing ? () => void onDelete() : undefined}
          />
        }
      >
        <form id="gallery-slide-form" className="space-y-4" onSubmit={(e) => void onSave(e)}>
          <AdminFormSection
            title="Foto"
            description="Se muestra en el carrusel Galería de innovación del inicio (formato horizontal)."
          >
            <MediaDropzone
              id="gallery-slide-image"
              label="Imagen"
              hint="JPG, PNG o WebP. Recomendado 16:10 o 16:9."
              value={form.image_url}
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              onFileSelect={onImageFile}
              uploading={uploading}
              disabled={busy}
              previewAspect="aspect-[16/10]"
              previewObjectFit="cover"
              previewBg="bg-surface-container-high"
            />
            <AdminField
              id="gallery-alt"
              label="Texto alternativo"
              hint="Describe la imagen para accesibilidad y pie del lightbox."
            >
              <Input
                id="gallery-alt"
                value={form.image_alt}
                onChange={(e) => setForm((f) => ({ ...f, image_alt: e.target.value }))}
                placeholder="Línea de producción en planta Saldivia"
              />
            </AdminField>
          </AdminFormSection>
          <AdminFormSection title="Publicación">
            <AdminCheckbox
              id="gallery-active"
              label="Imagen activa"
              description="Solo las imágenes activas se muestran en el home."
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
          </AdminFormSection>
        </form>
      </AdminModal>
    </>
  );
}
