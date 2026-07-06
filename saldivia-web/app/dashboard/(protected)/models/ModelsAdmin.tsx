"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Trash2 } from "lucide-react";
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
  AdminField,
  AdminFormActions,
  AdminListPanel,
  AdminSelect,
  AdminStatusBanner,
  AdminTwoColumn,
  MediaDropzone,
} from "../_ui/admin-ui";

type AdminMessage = { text: string; variant: "info" | "success" | "error" } | null;

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
  const [message, setMessage] = useState<AdminMessage>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    setMessage(null);
  }

  function newModel() {
    setForm({ ...empty, sort_order: list.length });
    setSpecRows([specRowEmptyLocal()]);
    setFeatureBodies([""]);
    setVariantRows([]);
    setMessage(null);
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
      setMessage({
        text: r.error === "validation" ? "No se pudo guardar el orden." : r.error,
        variant: "error",
      });
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
    setMessage({ text: "Orden actualizado.", variant: "success" });
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
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
        setMessage({ text: r.error, variant: "error" });
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
      setMessage({
        text: r.warning ?? "Modelo guardado.",
        variant: r.warning ? "info" : "success",
      });
      router.refresh();
    } catch {
      setMessage({ text: "No se pudo guardar. Intente de nuevo.", variant: "error" });
    } finally {
      setBusy(false);
    }
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
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setList((prev) => prev.filter((m) => m.id !== form.id));
    setForm(empty);
    setMessage({ text: "Modelo eliminado.", variant: "success" });
  }

  async function onFile(which: "cover" | "hero" | "pdf", file: File | null) {
    if (!file) return;
    if (which === "hero" && !form.id) {
      setMessage({
        text: "Guardá el modelo una vez antes de subir el hero (cada colectivo tiene el suyo).",
        variant: "info",
      });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const r = await uploadMediaFromBrowser(
        file,
        which === "hero" && form.id ? { folder: `models/${form.id}/hero` } : undefined,
      );
      if (!r.ok) {
        setMessage({
          text: r.error === "unauthorized" ? "Sesión vencida." : r.error,
          variant: "error",
        });
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
      setMessage({
        text: "Archivo subido. Pulse Guardar para aplicar los cambios a este modelo.",
        variant: "info",
      });
    } catch {
      setMessage({ text: "Error al subir el archivo.", variant: "error" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminTwoColumn
      className="lg:grid-cols-[minmax(0,1fr)_minmax(340px,480px)]"
      list={
        <AdminListPanel
          title="Modelos"
          description="Orden por sort_order (flota, menú, home). Arrastrá con el asa para reordenar."
          action={
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={newModel}>
              <Plus className="size-4" aria-hidden />
              Nuevo
            </Button>
          }
        >
          <ul className="divide-y divide-outline-variant/25">
            {sortedList.map((m, index) => (
              <li
                key={m.id}
                className={`flex overflow-hidden transition-shadow ${
                  dropTargetIndex === index ? "ring-2 ring-inset ring-primary/30" : ""
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
                  className="flex shrink-0 cursor-grab touch-none items-center border-r border-outline-variant/20 bg-surface-container-high px-1.5 text-on-surface-variant outline-none hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:cursor-grabbing [&[aria-disabled=true]]:cursor-not-allowed [&[aria-disabled=true]]:opacity-50"
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
                {m.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.cover_image_url} alt="" className="h-16 w-20 shrink-0 object-cover" />
                ) : (
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center bg-surface-container text-[9px] text-on-surface-variant">
                    sin foto
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => load(m)}
                  className={`min-w-0 flex-1 cursor-pointer px-3 py-2 text-left text-sm transition ${
                    form.id === m.id
                      ? "bg-secondary-container/20 text-primary"
                      : "hover:bg-surface-container-high"
                  }`}
                >
                  <span className="block truncate font-bold">{m.name}</span>
                  <span className="block truncate text-xs text-on-surface-variant">
                    orden {m.sort_order ?? 0} · {m.slug} · {m.segment}
                    {!m.active ? " · inactivo" : ""}
                  </span>
                  <span className="mt-0.5 flex flex-wrap gap-1">
                    {(m.model_variants?.length ?? 0) > 0 ? (
                      <span className="rounded bg-surface-container-high px-1.5 py-0.5 text-[10px]">
                        {m.model_variants!.length} config.
                      </span>
                    ) : null}
                    {m.show_in_showcase ? (
                      <span className="rounded bg-secondary/15 px-1.5 py-0.5 text-[10px] text-secondary">
                        showcase
                      </span>
                    ) : null}
                    {m.hero_background_image_url ? (
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">hero</span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </AdminListPanel>
      }
      form={
        <section className="rounded-sm border border-outline-variant/30 bg-surface-container-lowest p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
            {editing ? `Editar: ${form.name || "modelo"}` : "Crear modelo"}
          </h2>
          {message ? (
            <div className="mt-3">
              <AdminStatusBanner variant={message.variant}>{message.text}</AdminStatusBanner>
            </div>
          ) : null}
          <form className="mt-4 space-y-4" onSubmit={onSave}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminField id="slug" label="Slug (URL)" required hint="Ej: aries-330 — se usa en /producto/[slug]">
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="aries-330"
                required
              />
            </AdminField>
            <AdminField id="name" label="Nombre" required>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Aries 330"
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
          <AdminField id="description" label="Descripción">
            <Textarea
              id="description"
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </AdminField>
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
          <MediaDropzone
            id="cover_image"
            label="Portada en /flota"
            hint="Tarjetas del catálogo de flota. Si falta, se usa una imagen por defecto."
            value={form.cover_image_url ?? ""}
            uploading={uploading}
            disabled={busy}
            previewAspect="aspect-[4/3]"
            onChange={(url) => setForm((f) => ({ ...f, cover_image_url: url || null }))}
            onFileSelect={(file) => void onFile("cover", file)}
          />
          <HeroBackgroundField
            modelName={form.name}
            modelId={form.id}
            imageUrl={form.hero_background_image_url ?? ""}
            focalX={form.hero_background_focal_x ?? 50}
            focalY={form.hero_background_focal_y ?? 50}
            zoom={form.hero_background_zoom ?? 1}
            disabled={busy}
            uploading={uploading}
            onImageUrlChange={(url) => setForm((f) => ({ ...f, hero_background_image_url: url || null }))}
            onFocalChange={(x, y) =>
              setForm((f) => ({ ...f, hero_background_focal_x: x, hero_background_focal_y: y }))
            }
            onZoomChange={(zoom) => setForm((f) => ({ ...f, hero_background_zoom: zoom }))}
            onFileSelect={(file) => void onFile("hero", file)}
          />
          <MediaDropzone
            id="pdf_url"
            label="Ficha PDF"
            hint="Documento técnico descargable desde la ficha del producto."
            kind="pdf"
            accept="application/pdf"
            value={form.pdf_url ?? ""}
            uploading={uploading}
            disabled={busy}
            previewAspect="aspect-auto min-h-[5rem]"
            onChange={(url) => setForm((f) => ({ ...f, pdf_url: url || null }))}
            onFileSelect={(file) => void onFile("pdf", file)}
            emptyLabel="Arrastrá el PDF o hacé clic para seleccionar"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField id="sort_order" label="Orden en flota / menú">
              <Input
                id="sort_order"
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </AdminField>
            <AdminCheckbox
              id="active"
              label="Activo (visible en web)"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
          </div>
          <AdminCheckbox
            id="show_in_showcase"
            label="Mostrar en el Showcase técnico del home"
            description="El carrusel del inicio muestra los modelos activos marcados aquí, en sort_order. Usa portada, descripción y las 2 primeras specs."
            checked={form.show_in_showcase}
            onChange={(e) => setForm((f) => ({ ...f, show_in_showcase: e.target.checked }))}
          />
          <AdminFormActions
            saving={busy}
            uploading={uploading}
            onDelete={editing ? () => void onDelete() : undefined}
          />
        </form>
        </section>
      }
    />
  );
}
