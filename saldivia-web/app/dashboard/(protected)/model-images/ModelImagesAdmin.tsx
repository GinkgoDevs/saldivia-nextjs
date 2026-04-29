"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addModelImage,
  deleteModelImage,
  updateModelImageSortOrder,
  uploadMediaToBucket,
} from "@/app/actions/admin-content";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import type { Model, ModelImage } from "@/types/model";

type Props = { models: Model[]; initialImages: ModelImage[] };

export function ModelImagesAdmin({ models, initialImages }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<ModelImage[]>(initialImages);
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id ?? "");
  const [addUrl, setAddUrl] = useState("");
  const [addSortOrder, setAddSortOrder] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage(null);
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadMediaToBucket(fd);
    setBusy(false);
    e.target.value = "";
    if (!r.ok) {
      setMessage(r.error === "unauthorized" ? "Sesión vencida." : (r.error ?? "Error al subir"));
      return;
    }
    setAddUrl(r.publicUrl);
    setMessage("Archivo subido. Hacé clic en 'Agregar' para guardarlo.");
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
      setMessage(r.error);
      return;
    }
    setAddUrl("");
    setAddSortOrder(modelImages.length + 1);
    setMessage("Imagen agregada.");
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;
    setBusy(true);
    setMessage(null);
    const r = await deleteModelImage(id);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
    setMessage("Imagen eliminada.");
  }

  async function onUpdateSortOrder(id: string, sort_order: number) {
    setBusy(true);
    setMessage(null);
    const r = await updateModelImageSortOrder(id, sort_order);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, sort_order } : img)));
    setMessage("Orden actualizado.");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <label className="text-xs font-bold text-secondary" htmlFor="model-select">
          Modelo
        </label>
        <select
          id="model-select"
          className="h-11 w-full max-w-sm rounded-curve-sm border border-outline-variant/40 bg-surface-container-lowest px-3 text-sm"
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
        </select>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
            Galería: {selectedModel?.name ?? "—"}
          </h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            {modelImages.length} {modelImages.length === 1 ? "imagen" : "imágenes"} · orden
            ascendente (0 primero)
          </p>
          {modelImages.length === 0 ? (
            <p className="mt-4 text-sm text-on-surface-variant">
              Sin imágenes para este modelo. Agregá una desde el panel de la derecha.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {modelImages.map((img) => (
                <li
                  key={img.id}
                  className="overflow-hidden rounded border border-outline-variant/30 bg-surface-container-lowest"
                >
                  <div className="aspect-video w-full bg-surface-container-high">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="flex items-center gap-2">
                      <label className="shrink-0 text-xs text-on-surface-variant">Orden</label>
                      <input
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
        </section>

        <section className="rounded border border-outline-variant/30 bg-surface-container-lowest p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
            Agregar imagen
          </h2>
          <form className="mt-4 space-y-4" onSubmit={onAdd}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary">URL de imagen</label>
              <Input
                value={addUrl}
                onChange={(e) => setAddUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-on-surface-variant">O subir archivo</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="text-xs"
                onChange={(e) => void onUpload(e)}
                disabled={busy}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="add-sort-order">
                Orden
              </label>
              <Input
                id="add-sort-order"
                type="number"
                value={String(addSortOrder)}
                onChange={(e) => setAddSortOrder(Number(e.target.value))}
              />
            </div>
            {message && <p className="text-sm text-on-surface-variant">{message}</p>}
            <Button type="submit" disabled={busy || !addUrl.trim() || !selectedModelId}>
              {busy ? "Guardando…" : "Agregar imagen"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
