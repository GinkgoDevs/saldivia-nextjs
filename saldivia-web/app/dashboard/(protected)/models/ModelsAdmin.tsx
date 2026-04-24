"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteModel, saveModel, uploadMediaToBucket } from "@/app/actions/admin-content";
import type { Model, ModelSegment } from "@/types/model";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";

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
  pdf_url: null,
  active: true,
  sort_order: 0,
};

type Props = { initial: Model[] };

export function ModelsAdmin({ initial }: Props) {
  const router = useRouter();
  const [list, setList] = useState<Model[]>(initial);
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setList(initial);
  }, [initial]);

  const editing = useMemo(() => form.id, [form.id]);

  function load(m: Model) {
    setForm({
      id: m.id,
      slug: m.slug,
      name: m.name,
      segment: m.segment,
      description: m.description,
      cover_image_url: m.cover_image_url,
      pdf_url: m.pdf_url,
      active: m.active,
      sort_order: m.sort_order ?? 0,
    });
  }

  function newModel() {
    setForm({ ...empty, sort_order: list.length });
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const r = await saveModel({
      id: form.id,
      slug: form.slug,
      name: form.name,
      segment: form.segment,
      description: form.description ?? "",
      cover_image_url: form.cover_image_url ?? "",
      pdf_url: form.pdf_url ?? "",
      sort_order: form.sort_order ?? 0,
      active: form.active,
    });
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setMessage("Guardado.");
    setForm(empty);
    router.refresh();
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm("¿Eliminar este modelo? Se eliminan también sus especificaciones e imágenes vinculadas.")) {
      return;
    }
    setBusy(true);
    const r = await deleteModel(form.id);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setList((prev) => prev.filter((m) => m.id !== form.id));
    setForm(empty);
  }

  async function onFile(which: "cover" | "pdf", file: File | null) {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadMediaToBucket(fd);
    setBusy(false);
    if (!r.ok) {
      setMessage(
        r.error === "unauthorized" ? "Sesión vencida." : (r as { error?: string }).error ?? "Error al subir",
      );
      return;
    }
    if (which === "cover") {
      setForm((f) => ({ ...f, cover_image_url: r.publicUrl }));
    } else {
      setForm((f) => ({ ...f, pdf_url: r.publicUrl }));
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Listado</h2>
        <ul className="mt-4 max-h-[480px] space-y-2 overflow-y-auto rounded-sm border border-outline-variant/30 p-2">
          {list.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => load(m)}
                className={`w-full rounded-sm px-3 py-2 text-left text-sm transition ${
                  form.id === m.id
                    ? "bg-secondary-container/25 text-primary"
                    : "hover:bg-surface-container-high"
                }`}
              >
                <span className="block font-bold">{m.name}</span>
                <span className="text-xs text-on-surface-variant">
                  {m.slug} · {m.segment} {m.active ? "" : "· inactivo"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Button className="mt-4" type="button" variant="outline" size="sm" onClick={newModel}>
          Nuevo modelo
        </Button>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
          {editing ? "Editar" : "Crear"} modelo
        </h2>
        {message && <p className="mt-2 text-sm text-on-surface-variant">{message}</p>}
        <form className="mt-4 space-y-4" onSubmit={onSave}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="slug">
                Slug (URL)
              </label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="aries-330"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="name">
                Nombre
              </label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Aries 330"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="segment">
              Segmento
            </label>
            <select
              id="segment"
              className="h-11 w-full rounded-curve-sm border border-outline-variant/40 bg-surface-container-lowest px-3 text-sm"
              value={form.segment}
              onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value as ModelSegment }))}
            >
              {SEGMENTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="description">
              Descripción
            </label>
            <Textarea
              id="description"
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="cover_image_url">
              Imagen de portada (URL)
            </label>
            <Input
              id="cover_image_url"
              value={form.cover_image_url ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-xs"
              onChange={(e) => void onFile("cover", e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="pdf_url">
              Ficha PDF (URL)
            </label>
            <Input
              id="pdf_url"
              value={form.pdf_url ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, pdf_url: e.target.value }))}
            />
            <input type="file" accept="application/pdf" className="text-xs" onChange={(e) => void onFile("pdf", e.target.files?.[0] ?? null)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="sort_order">
                Orden
              </label>
              <Input
                id="sort_order"
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input
                id="active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              <label htmlFor="active" className="text-sm">
                Activo (visible en web)
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Guardando…" : "Guardar"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" disabled={busy} onClick={() => void onDelete()}>
                Eliminar
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
