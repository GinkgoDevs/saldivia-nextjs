"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import {
  addModelImage,
  deleteModelImage,
  reorderModelImages,
  updateModelImage,
} from "@/app/actions/admin-content";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import { Input } from "@/app/components/ui/Input";
import type { Model, ModelImage } from "@/types/model";
import {
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
  AdminSelect,
  adminToast,
  MediaDropzone,
} from "../_ui/admin-ui";

type Props = { models: Model[]; initialImages: ModelImage[] };

type ImageFormState = {
  id: string | null;
  image_url: string;
  sort_order: number;
};

function emptyForm(sortOrder: number): ImageFormState {
  return { id: null, image_url: "", sort_order: sortOrder };
}

function reorderList<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return items;
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

export function ModelImagesAdmin({ models, initialImages }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<ModelImage[]>(initialImages);
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id ?? "");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [form, setForm] = useState<ImageFormState>(() => emptyForm(0));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const sortedModels = useMemo(
    () =>
      [...models].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
      ),
    [models],
  );

  const modelImages = useMemo(
    () =>
      images
        .filter((img) => img.model_id === selectedModelId)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [images, selectedModelId],
  );

  const selectedModel = useMemo(
    () => models.find((m) => m.id === selectedModelId),
    [models, selectedModelId],
  );

  const editing = modalMode === "edit" && Boolean(form.id);

  function openAdd() {
    setForm(emptyForm(modelImages.length));
    setModalMode("add");
    setModalOpen(true);
  }

  function openEdit(img: ModelImage) {
    setForm({
      id: img.id,
      image_url: img.image_url,
      sort_order: img.sort_order ?? 0,
    });
    setModalMode("edit");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm(modelImages.length));
  }

  async function onUploadFile(file: File) {
    setUploading(true);
    try {
      const folder = selectedModelId ? `models/${selectedModelId}/gallery` : undefined;
      const r = await uploadMediaFromBrowser(file, folder ? { folder } : undefined);
      if (!r.ok) {
        adminToast.error(r.error === "unauthorized" ? "Sesión vencida." : (r.error ?? "Error al subir"));
        return;
      }
      setForm((f) => ({ ...f, image_url: r.publicUrl }));
      adminToast.info(
        editing ? "Imagen subida. Pulse Guardar para aplicar los cambios." : "Imagen subida. Pulse «Agregar imagen» para guardar.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedModelId || !form.image_url.trim()) {
      adminToast.error("Subí o pegá una URL de imagen.");
      return;
    }

    setBusy(true);
    try {
      if (editing && form.id) {
        const r = await updateModelImage({
          id: form.id,
          image_url: form.image_url.trim(),
          sort_order: form.sort_order,
        });
        if (!r.ok) {
          adminToast.error(r.error);
          return;
        }
        setImages((prev) =>
          prev.map((img) =>
            img.id === form.id
              ? { ...img, image_url: form.image_url.trim(), sort_order: form.sort_order }
              : img,
          ),
        );
        adminToast.success("Imagen actualizada.");
      } else {
        const r = await addModelImage({
          model_id: selectedModelId,
          image_url: form.image_url.trim(),
          sort_order: form.sort_order,
        });
        if (!r.ok) {
          adminToast.error(r.error);
          return;
        }
        adminToast.success("Imagen agregada a la galería.");
      }
      closeModal();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(img: ModelImage) {
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;
    setBusy(true);
    const r = await deleteModelImage(img.id);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    if (form.id === img.id) closeModal();
    adminToast.success("Imagen eliminada.");
    router.refresh();
  }

  async function onDeleteFromModal() {
    if (!form.id) return;
    const img = images.find((i) => i.id === form.id);
    if (img) await onDelete(img);
  }

  async function onReorderDrop(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const reordered = reorderList(modelImages, fromIndex, toIndex);
    const orderedIds = reordered.map((img) => img.id);
    setBusy(true);
    const r = await reorderModelImages(selectedModelId, orderedIds);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error === "validation" ? "No se pudo guardar el orden." : r.error);
      return;
    }
    setImages((prev) =>
      prev.map((img) => {
        if (img.model_id !== selectedModelId) return img;
        const idx = orderedIds.indexOf(img.id);
        if (idx === -1) return img;
        return { ...img, sort_order: idx };
      }),
    );
    adminToast.success("Orden actualizado.");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 max-w-md">
        <AdminField id="model-select" label="Modelo" hint="Elegí el colectivo cuya galería querés editar.">
          <AdminSelect
            id="model-select"
            value={selectedModelId}
            onChange={(e) => {
              setSelectedModelId(e.target.value);
            }}
          >
            {sortedModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.slug}
                {!m.active ? " (inactivo)" : ""}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
      </div>

      <AdminCrudLayout
        summary={
          <>
            {modelImages.length} imagen{modelImages.length === 1 ? "" : "es"} en{" "}
            <strong>{selectedModel?.name ?? "—"}</strong> · arrastrá con el asa para ordenar
          </>
        }
        newLabel="Agregar imagen"
        onNew={openAdd}
        newDisabled={busy || !selectedModelId}
      >
        {modelImages.length === 0 ? (
          <AdminEmptyState
            icon={ImageIcon}
            title="Galería vacía"
            description={
              selectedModel
                ? `Todavía no hay fotos para ${selectedModel.name}. Agregá imágenes para el carrusel de la ficha del producto.`
                : "Elegí un modelo y subí las fotos de su galería."
            }
          />
        ) : (
          modelImages.map((img, index) => (
            <AdminCrudCard
              key={img.id}
              dragHandle={
                <AdminCrudDragHandle
                  disabled={busy}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    setDraggingId(img.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", `${index}|${img.id}`);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDropTargetIndex(null);
                  }}
                />
              }
              media={<AdminCrudThumbnail src={img.image_url} alt={`Imagen ${index + 1}`} />}
              title={`Imagen ${index + 1}`}
              subtitle={`Orden ${img.sort_order ?? index}`}
              badges={<AdminCrudBadge>#{img.sort_order ?? index}</AdminCrudBadge>}
              disabled={busy}
              isDragging={draggingId === img.id}
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
              onEdit={() => openEdit(img)}
              onDelete={() => void onDelete(img)}
            />
          ))
        )}
      </AdminCrudLayout>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={
          editing
            ? `Editar imagen — ${selectedModel?.name ?? "modelo"}`
            : `Agregar imagen — ${selectedModel?.name ?? "modelo"}`
        }
        fullscreen
        footer={
          <AdminModalFooter
            formId="gallery-image-form"
            saving={busy}
            uploading={uploading}
            saveLabel={editing ? "Guardar cambios" : "Agregar imagen"}
            onCancel={closeModal}
            onDelete={editing ? () => void onDeleteFromModal() : undefined}
          />
        }
      >
        <AdminFullscreenForm id="gallery-image-form" onSubmit={onSave}>
          <AdminFormSection
            title={editing ? "Reemplazar o ajustar" : "Nueva imagen"}
            description="Subí un archivo o pegá una URL. El orden define la posición en el carrusel de la ficha."
          >
            <MediaDropzone
              id="gallery-upload"
              label="Imagen"
              value={form.image_url}
              uploading={uploading}
              disabled={busy || !selectedModelId}
              compact
              showUrlField
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              onFileSelect={onUploadFile}
            />
            <AdminField id="gallery-sort-order" label="Orden en el carrusel" hint="0 = primera imagen.">
              <Input
                id="gallery-sort-order"
                type="number"
                value={String(form.sort_order)}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
              />
            </AdminField>
          </AdminFormSection>
        </AdminFullscreenForm>
      </AdminModal>
    </>
  );
}
