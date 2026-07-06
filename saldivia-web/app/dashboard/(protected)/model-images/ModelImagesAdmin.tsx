"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addModelImage,
  deleteModelImage,
  reorderModelImages,
  updateModelImageSortOrder,
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
  AdminField,
  AdminFormActions,
  AdminModal,
  AdminSelect,
  adminToast,
  MediaDropzone,
} from "../_ui/admin-ui";

type Props = { models: Model[]; initialImages: ModelImage[] };

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
  const [addUrl, setAddUrl] = useState("");
  const [addSortOrder, setAddSortOrder] = useState(0);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  function openAdd() {
    setAddUrl("");
    setAddSortOrder(modelImages.length);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
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
      setAddUrl(r.publicUrl);
      adminToast.info("Archivo subido. Pulse «Agregar imagen» para guardarlo en la galería.");
    } finally {
      setUploading(false);
    }
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedModelId || !addUrl.trim()) return;
    setBusy(true);
    const r = await addModelImage({
      model_id: selectedModelId,
      image_url: addUrl.trim(),
      sort_order: addSortOrder,
    });
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setAddUrl("");
    setAddSortOrder(modelImages.length + 1);
    adminToast.success("Imagen agregada a la galería.");
    setModalOpen(false);
    router.refresh();
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
    adminToast.success("Imagen eliminada.");
  }

  async function onUpdateSortOrder(id: string, sort_order: number) {
    setBusy(true);
    const r = await updateModelImageSortOrder(id, sort_order);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, sort_order } : img)));
    adminToast.success("Orden actualizado.");
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
          <li className="rounded-sm border border-dashed border-outline-variant/40 p-8 text-center text-sm text-on-surface-variant">
            Sin imágenes para este modelo. Agregá una con el botón superior.
          </li>
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
              media={<AdminCrudThumbnail src={img.image_url} />}
              title={`Imagen ${index + 1}`}
              subtitle={
                <label className="inline-flex items-center gap-2">
                  <span>Orden</span>
                  <input
                    key={`${img.id}-${img.sort_order ?? 0}`}
                    type="number"
                    className="h-8 w-16 rounded border border-outline-variant/40 bg-surface px-2 text-xs"
                    defaultValue={img.sort_order ?? 0}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (val !== (img.sort_order ?? 0)) {
                        void onUpdateSortOrder(img.id, val);
                      }
                    }}
                  />
                </label>
              }
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
              hideEdit
              onDelete={() => void onDelete(img)}
            />
          ))
        )}
      </AdminCrudLayout>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={`Agregar imagen — ${selectedModel?.name ?? "modelo"}`}
      >
        <form className="space-y-4" onSubmit={onAdd}>
          <MediaDropzone
            id="gallery-upload"
            label="Imagen"
            hint="Se agregará a la galería del modelo seleccionado."
            value={addUrl}
            uploading={uploading}
            disabled={busy || !selectedModelId}
            previewAspect="aspect-video"
            onChange={setAddUrl}
            onFileSelect={onUploadFile}
          />
          <AdminField id="add-sort-order" label="Orden en el carrusel" hint="0 = primera imagen.">
            <Input
              id="add-sort-order"
              type="number"
              value={String(addSortOrder)}
              onChange={(e) => setAddSortOrder(Number(e.target.value))}
            />
          </AdminField>
          <AdminFormActions
            saving={busy}
            uploading={uploading}
            saveLabel="Agregar imagen"
            onClear={closeModal}
            clearLabel="Cancelar"
          />
        </form>
      </AdminModal>
    </>
  );
}
