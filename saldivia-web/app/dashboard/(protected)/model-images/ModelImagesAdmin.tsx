"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import {
  addModelImage,
  deleteModelImage,
  reorderModelImages,
  updateModelImageSortOrder,
} from "@/app/actions/admin-content";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import type { Model, ModelImage } from "@/types/model";
import {
  AdminField,
  AdminFormActions,
  AdminListPanel,
  AdminSelect,
  AdminStatusBanner,
  AdminTwoColumn,
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
  const [message, setMessage] = useState<{ text: string; variant: "info" | "success" | "error" } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  async function onUploadFile(file: File) {
    setUploading(true);
    setMessage(null);
    try {
      const folder = selectedModelId ? `models/${selectedModelId}/gallery` : undefined;
      const r = await uploadMediaFromBrowser(file, folder ? { folder } : undefined);
      if (!r.ok) {
        setMessage({
          text: r.error === "unauthorized" ? "Sesión vencida." : (r.error ?? "Error al subir"),
          variant: "error",
        });
        return;
      }
      setAddUrl(r.publicUrl);
      setMessage({ text: "Archivo subido. Pulse «Agregar imagen» para guardarlo en la galería.", variant: "info" });
    } finally {
      setUploading(false);
    }
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedModelId || !addUrl.trim()) return;
    setBusy(true);
    setMessage(null);
    const r = await addModelImage({
      model_id: selectedModelId,
      image_url: addUrl.trim(),
      sort_order: addSortOrder,
    });
    setBusy(false);
    if (!r.ok) {
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setAddUrl("");
    setAddSortOrder(modelImages.length + 1);
    setMessage({ text: "Imagen agregada a la galería.", variant: "success" });
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;
    setBusy(true);
    setMessage(null);
    const r = await deleteModelImage(id);
    setBusy(false);
    if (!r.ok) {
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
    setMessage({ text: "Imagen eliminada.", variant: "success" });
  }

  async function onUpdateSortOrder(id: string, sort_order: number) {
    setBusy(true);
    setMessage(null);
    const r = await updateModelImageSortOrder(id, sort_order);
    setBusy(false);
    if (!r.ok) {
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, sort_order } : img)));
    setMessage({ text: "Orden actualizado.", variant: "success" });
  }

  async function onReorderDrop(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const reordered = reorderList(modelImages, fromIndex, toIndex);
    const orderedIds = reordered.map((img) => img.id);
    setBusy(true);
    setMessage(null);
    const r = await reorderModelImages(selectedModelId, orderedIds);
    setBusy(false);
    if (!r.ok) {
      setMessage({
        text: r.error === "validation" ? "No se pudo guardar el orden." : r.error,
        variant: "error",
      });
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
    setMessage({ text: "Orden actualizado.", variant: "success" });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <AdminField id="model-select" label="Modelo" hint="Elegí el colectivo cuya galería querés editar.">
        <AdminSelect
          id="model-select"
          value={selectedModelId}
          onChange={(e) => {
            setSelectedModelId(e.target.value);
            setMessage(null);
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

      <AdminTwoColumn
        className="lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]"
        list={
          <AdminListPanel
            title={`Galería: ${selectedModel?.name ?? "—"}`}
            description={`${modelImages.length} imagen${modelImages.length === 1 ? "" : "es"} · arrastrá con el asa para ordenar`}
          >
          {modelImages.length === 0 ? (
            <p className="p-6 text-center text-sm text-on-surface-variant">
              Sin imágenes para este modelo. Agregá una desde el panel de la derecha.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-0 divide-x divide-y divide-outline-variant/20 sm:grid-cols-2">
              {modelImages.map((img, index) => (
                <li
                  key={img.id}
                  className={`overflow-hidden rounded border bg-surface-container-lowest transition-shadow ${
                    dropTargetIndex === index
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-outline-variant/30"
                  } ${draggingId === img.id ? "opacity-50" : ""}`}
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
                    const from =
                      pipe > 0 ? Number.parseInt(plain.slice(0, pipe), 10) : Number.NaN;
                    if (!Number.isFinite(from)) return;
                    void onReorderDrop(from, index);
                  }}
                >
                  <div className="flex items-stretch gap-0 border-b border-outline-variant/20">
                    <div
                      role="button"
                      tabIndex={busy ? -1 : 0}
                      draggable={!busy}
                      aria-label="Arrastrar para reordenar"
                      title="Arrastrar para reordenar"
                      className="flex shrink-0 cursor-grab touch-none items-center border-r border-outline-variant/20 bg-surface-container-high px-1.5 text-on-surface-variant outline-none hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:cursor-grabbing [&[aria-disabled=true]]:cursor-not-allowed [&[aria-disabled=true]]:opacity-50"
                      aria-disabled={busy}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") e.preventDefault();
                      }}
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
                    >
                      <GripVertical className="size-5" aria-hidden />
                    </div>
                    <div className="aspect-video min-h-0 min-w-0 flex-1 bg-surface-container-high">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.image_url}
                        alt=""
                        draggable={false}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="flex items-center gap-2">
                      <label className="shrink-0 text-xs text-on-surface-variant">Orden</label>
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
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={busy}
                      onClick={() => void onDelete(img.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          </AdminListPanel>
        }
        form={
        <section className="rounded-sm border border-outline-variant/30 bg-surface-container-lowest p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Agregar imagen</h2>
          {message ? (
            <div className="mt-3">
              <AdminStatusBanner variant={message.variant}>{message.text}</AdminStatusBanner>
            </div>
          ) : null}
          <form className="mt-4 space-y-4" onSubmit={onAdd}>
            <MediaDropzone
              id="gallery-upload"
              label="Imagen"
              hint="Se agregará a la galería del modelo seleccionado al pulsar el botón inferior."
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
            />
          </form>
        </section>
        }
      />
    </div>
  );
}
