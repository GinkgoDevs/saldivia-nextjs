"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { deleteModel, reorderModels, saveModel, uploadMediaToBucket } from "@/app/actions/admin-content";
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
  pdf_url: null,
  active: true,
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
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

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
      pdf_url: m.pdf_url,
      active: m.active,
      sort_order: m.sort_order ?? 0,
    });
    const specs = specsFromModel(m);
    setSpecRows(specs.length > 0 ? specs : [specRowEmptyLocal()]);
    const feats = featuresFromModel(m);
    setFeatureBodies(feats.length > 0 ? feats : [""]);
    const vars = variantsFromModel(m);
    setVariantRows(vars);
  }

  function newModel() {
    setForm({ ...empty, sort_order: list.length });
    setSpecRows([specRowEmptyLocal()]);
    setFeatureBodies([""]);
    setVariantRows([]);
  }

  async function onReorderDrop(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const reordered = reorderList(sortedList, fromIndex, toIndex);
    const orderedIds = reordered.map((m) => m.id);
    setBusy(true);
    setMessage(null);
    const r = await reorderModels(orderedIds);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error === "validation" ? "No se pudo guardar el orden." : r.error);
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
    setMessage("Orden actualizado.");
    router.refresh();
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
      hero_background_image_url: form.hero_background_image_url ?? "",
      pdf_url: form.pdf_url ?? "",
      sort_order: form.sort_order ?? 0,
      active: form.active,
      tech_specs: specRows,
      general_feature_bodies: featureBodies,
      variants: variantRows.filter((v) => v.name.trim() || v.code.trim()),
    });
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setMessage("Guardado.");
    setForm(empty);
    setVariantRows([]);
    router.refresh();
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm("¿Eliminar este modelo? Se eliminan también sus imágenes, especificaciones y características vinculadas.")) {
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

  async function onFile(which: "cover" | "hero" | "pdf", file: File | null) {
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
    } else if (which === "hero") {
      setForm((f) => ({ ...f, hero_background_image_url: r.publicUrl }));
    } else {
      setForm((f) => ({ ...f, pdf_url: r.publicUrl }));
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Listado</h2>
        <p className="mt-1 text-xs text-on-surface-variant">
          Ordenados por <code className="text-[10px]">sort_order</code> (flota, menú, home). Arrastrá con el asa para
          reordenar.
        </p>
        <ul className="mt-4 max-h-[480px] space-y-2 overflow-y-auto rounded-sm border border-outline-variant/30 p-2">
          {sortedList.map((m, index) => (
            <li
              key={m.id}
              className={`flex overflow-hidden rounded-sm border transition-shadow ${
                dropTargetIndex === index
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent"
              } ${draggingId === m.id ? "opacity-50" : ""}`}
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
            >
              <div
                role="button"
                tabIndex={busy ? -1 : 0}
                draggable={!busy}
                aria-label="Arrastrar para reordenar modelo"
                title="Arrastrar para reordenar"
                className="flex shrink-0 cursor-grab touch-none items-center border-r border-outline-variant/25 bg-surface-container-high px-1.5 text-on-surface-variant outline-none hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:cursor-grabbing [&[aria-disabled=true]]:cursor-not-allowed [&[aria-disabled=true]]:opacity-50"
                aria-disabled={busy}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") e.preventDefault();
                }}
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
              >
                <GripVertical className="size-5" aria-hidden />
              </div>
              <button
                type="button"
                onClick={() => load(m)}
                className={`min-w-0 flex-1 rounded-r-sm px-3 py-2 text-left text-sm transition ${
                  form.id === m.id
                    ? "bg-secondary-container/25 text-primary"
                    : "hover:bg-surface-container-high"
                }`}
              >
                <span className="block font-bold">{m.name}</span>
                <span className="text-xs text-on-surface-variant">
                  orden {m.sort_order ?? 0} · {m.slug} · {m.segment} {m.active ? "" : "· inactivo"}
                  {(m.model_variants?.length ?? 0) > 0
                    ? ` · ${m.model_variants!.length} config.`
                    : ""}
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
          <div className="space-y-3 rounded-sm border border-outline-variant/25 bg-surface-container-low/40 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-secondary">
                Configuraciones / variantes
              </p>
              <p className="mt-0.5 text-[11px] text-on-surface-variant">
                Opcional en cualquier modelo. Agregá distintas versiones (ej. 4x2, 4x4, motor delantero) con
                specs y características propias. Si no agregás ninguna, la ficha usa solo los datos compartidos
                de abajo.
              </p>
            </div>
            <ModelVariantsEditor variants={variantRows} onChange={setVariantRows} busy={busy} />
          </div>
          <div className="space-y-3 rounded-sm border border-outline-variant/25 bg-surface-container-low/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-secondary">
                  {hasActiveVariants ? "Especificaciones compartidas" : "Especificaciones técnicas"}
                </p>
                <p className="mt-0.5 text-[11px] text-on-surface-variant">
                  {hasActiveVariants
                    ? "Aplican a todas las configuraciones (se combinan con las de cada variante en la ficha)."
                    : "Tabla de la ficha del producto. Se guarda el orden de las filas."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => setSpecRows((rows) => [...rows, specRowEmptyLocal()])}
                className="gap-1"
              >
                <Plus className="size-4" aria-hidden />
                Fila
              </Button>
            </div>
            <div className="space-y-2">
              {specRows.map((row, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <Input
                    aria-label={`Parámetro fila ${i + 1}`}
                    className="sm:flex-1"
                    placeholder="Parámetro"
                    value={row.spec_key}
                    onChange={(e) =>
                      setSpecRows((rows) =>
                        rows.map((r, j) => (j === i ? { ...r, spec_key: e.target.value } : r)),
                      )
                    }
                  />
                  <Input
                    aria-label={`Detalle fila ${i + 1}`}
                    className="sm:flex-[2]"
                    placeholder="Detalle / valor"
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
          </div>
          <div className="space-y-3 rounded-sm border border-outline-variant/25 bg-surface-container-low/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-secondary">
                  {hasActiveVariants ? "Características compartidas" : "Características generales"}
                </p>
                <p className="mt-0.5 text-[11px] text-on-surface-variant">
                  {hasActiveVariants
                    ? "Ítems comunes a todas las configuraciones del modelo."
                    : "Listado con viñetas bajo la ficha del producto."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => setFeatureBodies((rows) => [...rows, ""])}
                className="gap-1"
              >
                <Plus className="size-4" aria-hidden />
                Ítem
              </Button>
            </div>
            <div className="space-y-2">
              {featureBodies.map((body, i) => (
                <div key={i} className="flex gap-2">
                  <Textarea
                    aria-label={`Característica ${i + 1}`}
                    rows={2}
                    className="min-h-[2.75rem] flex-1"
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
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="cover_image_url">
              Portada en /flota (URL o archivo)
            </label>
            <p className="text-[11px] text-on-surface-variant">
              Tarjetas del catálogo de flota; si falta, se usa una imagen por defecto del sitio.
            </p>
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
            <label className="text-xs font-bold text-secondary" htmlFor="hero_background_image_url">
              Fondo del hero en la ficha del producto (URL o archivo)
            </label>
            <p className="text-[11px] text-on-surface-variant">
              Imagen amplia detrás del título en <code className="text-xs">/producto/[slug]</code>. Si está vacío, se
              usa la portada de flota y luego la galería.
            </p>
            <Input
              id="hero_background_image_url"
              value={form.hero_background_image_url ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, hero_background_image_url: e.target.value }))}
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-xs"
              onChange={(e) => void onFile("hero", e.target.files?.[0] ?? null)}
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
