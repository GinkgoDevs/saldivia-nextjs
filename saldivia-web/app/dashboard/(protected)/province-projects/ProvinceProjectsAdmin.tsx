"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProvinceProject, reorderProvinceProjects, saveProvinceProject } from "@/app/actions/admin-content";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { ProvinceProjectRow } from "@/types/province-project";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import {
  AdminCheckbox,
  AdminField,
  AdminFormActions,
  AdminSelect,
  AdminStatusBanner,
  AdminTwoColumn,
  MediaDropzone,
} from "../_ui/admin-ui";

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
  const [message, setMessage] = useState<{ text: string; variant: "info" | "success" | "error" } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orderProvince, setOrderProvince] = useState(provinceOptions[0]?.id ?? "");

  useEffect(() => {
    setList(initial);
  }, [initial]);

  const orderedForProvince = list
    .filter((row) => row.province_slug === orderProvince)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.title.localeCompare(b.title, "es"));

  async function onReorderMove(fromIndex: number, toIndex: number) {
    if (!orderProvince || fromIndex === toIndex) return;
    const reordered = reorderList(orderedForProvince, fromIndex, toIndex);
    const orderedIds = reordered.map((r) => r.id);
    setBusy(true);
    setMessage(null);
    const r = await reorderProvinceProjects(orderProvince, orderedIds);
    setBusy(false);
    if (!r.ok) {
      setMessage({
        text: r.error === "validation" ? "No se pudo guardar el orden." : r.error,
        variant: "error",
      });
      return;
    }
    setList((prev) =>
      prev.map((row) => {
        const idx = orderedIds.indexOf(row.id);
        if (idx === -1) return row;
        return { ...row, sort_order: idx };
      }),
    );
    setMessage({ text: "Orden actualizado.", variant: "success" });
    router.refresh();
  }

  function load(row: ProvinceProjectRow) {
    setForm(rowToForm(row));
  }

  function newRow() {
    setForm(emptyForm());
  }

  async function onImageFile(file: File) {
    setUploading(true);
    setMessage(null);
    try {
      const r = await uploadMediaFromBrowser(file, { folder: "mapa-projects" });
      if (!r.ok) {
        setMessage({ text: r.error, variant: "error" });
        return;
      }
      setForm((f) => ({ ...f, image_url: r.publicUrl }));
      setMessage({ text: "Imagen subida. Pulse Guardar para publicar.", variant: "info" });
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
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
      setMessage({
        text: r.error === "validation" ? "Provincia y título son obligatorios." : r.error,
        variant: "error",
      });
      return;
    }
    setMessage({ text: "Proyecto guardado.", variant: "success" });
    setForm(emptyForm());
    router.refresh();
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm("¿Eliminar este proyecto del mapa?")) return;
    setBusy(true);
    const r = await deleteProvinceProject(form.id);
    setBusy(false);
    if (!r.ok) {
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setList((p) => p.filter((x) => x.id !== form.id));
    setForm(emptyForm());
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="space-y-8">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Orden por provincia</h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            Las empresas con menor número aparecen primero en el mapa del sitio.
          </p>
          <div className="mt-3 space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="pp-order-prov">
              Provincia
            </label>
            <select
              id="pp-order-prov"
              className="h-11 w-full rounded-curve-sm border border-outline-variant/40 bg-surface-container-lowest px-2 text-sm"
              value={orderProvince}
              onChange={(e) => setOrderProvince(e.target.value)}
            >
              {provinceOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <ul className="mt-4 max-h-[280px] space-y-1 overflow-y-auto rounded-sm border border-outline-variant/30 p-2 text-sm">
            {orderedForProvince.length === 0 ? (
              <li className="px-3 py-2 text-on-surface-variant">Sin proyectos en esta provincia.</li>
            ) : (
              orderedForProvince.map((row, index) => (
                <li
                  key={row.id}
                  className="flex items-center gap-2 rounded-sm bg-surface-container-high/40 px-2 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate font-bold">{row.title}</span>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy || index === 0}
                      onClick={() => void onReorderMove(index, index - 1)}
                      aria-label={`Subir ${row.title}`}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy || index === orderedForProvince.length - 1}
                      onClick={() => void onReorderMove(index, index + 1)}
                      aria-label={`Bajar ${row.title}`}
                    >
                      ↓
                    </Button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Listado</h2>
        <ul className="mt-4 max-h-[480px] space-y-2 overflow-y-auto rounded-sm border border-outline-variant/30 p-2 text-sm">
          {list.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => load(row)}
                className={`w-full rounded-sm px-3 py-2 text-left ${
                  form.id === row.id ? "bg-secondary-container/25" : "hover:bg-surface-container-high"
                }`}
              >
                <span className="block font-bold">{row.title}</span>
                <span className="text-xs text-on-surface-variant">
                  {row.province_slug} · {row.active ? "visible" : "oculto"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Button className="mt-4" type="button" variant="outline" size="sm" onClick={newRow}>
          Nuevo proyecto
        </Button>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Editar / crear</h2>
        <p className="mt-1 text-xs text-on-surface-variant">
          El <strong>slug de provincia</strong> debe coincidir con el mapa SVG (ej. buenos-aires, cordoba).
        </p>
        {message ? (
          <div className="mt-3">
            <AdminStatusBanner variant={message.variant}>{message.text}</AdminStatusBanner>
          </div>
        ) : null}
        <form className="mt-4 space-y-4" onSubmit={onSave}>
          <AdminField id="pp-prov" label="Provincia (mapa)" required hint="Debe coincidir con el slug del mapa SVG.">
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
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </AdminField>
          <MediaDropzone
            id="pp-img"
            label="Imagen del proyecto"
            value={form.image_url}
            uploading={uploading}
            disabled={busy}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            onFileSelect={onImageFile}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="pp-loc">
                Ubicación / zona
              </label>
              <Input
                id="pp-loc"
                value={form.location_label}
                onChange={(e) => setForm((f) => ({ ...f, location_label: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="pp-seg">
                Segmento
              </label>
              <Input
                id="pp-seg"
                value={form.segment}
                onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="pp-year">
                Año
              </label>
              <Input
                id="pp-year"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="pp-sort">
                Orden
              </label>
              <Input
                id="pp-sort"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <div className="flex items-end gap-2 pb-1">
            <AdminCheckbox
              id="pp-active"
              label="Activo (visible en el sitio)"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
          </div>
          <AdminFormActions
            saving={busy}
            uploading={uploading}
            onDelete={form.id ? () => void onDelete() : undefined}
          />
        </form>
      </section>
    </div>
  );
}
