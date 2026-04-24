"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProvinceProject, saveProvinceProject } from "@/app/actions/admin-content";
import type { ProvinceProjectRow } from "@/types/province-project";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";

type ProvinceOption = { id: string; name: string };

type FormState = {
  id: string | null;
  province_slug: string;
  title: string;
  description: string;
  location_label: string;
  segment: string;
  year: string;
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
    sort_order: row.sort_order ?? 0,
    active: row.active,
  };
}

type Props = { initial: ProvinceProjectRow[]; provinceOptions: ProvinceOption[] };

export function ProvinceProjectsAdmin({ initial, provinceOptions }: Props) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setList(initial);
  }, [initial]);

  function load(row: ProvinceProjectRow) {
    setForm(rowToForm(row));
  }

  function newRow() {
    setForm(emptyForm());
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
      sort_order: form.sort_order,
      active: form.active,
    });
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error === "validation" ? "Provincia y título son obligatorios." : r.error);
      return;
    }
    setMessage("Guardado.");
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
      setMessage(r.error);
      return;
    }
    setList((p) => p.filter((x) => x.id !== form.id));
    setForm(emptyForm());
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
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
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Editar / crear</h2>
        <p className="mt-1 text-xs text-on-surface-variant">
          El <strong>slug de provincia</strong> debe coincidir con el mapa SVG (ej. buenos-aires, cordoba).
        </p>
        {message && <p className="mt-2 text-sm text-on-surface-variant">{message}</p>}
        <form className="mt-4 space-y-3" onSubmit={onSave}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="pp-prov">
              Provincia (mapa)
            </label>
            <select
              id="pp-prov"
              className="h-11 w-full rounded-curve-sm border border-outline-variant/40 bg-surface-container-lowest px-2 text-sm"
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
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="pp-title">
              Título del proyecto
            </label>
            <Input
              id="pp-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="pp-desc">
              Descripción
            </label>
            <Textarea
              id="pp-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
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
            <input
              id="pp-active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            <label htmlFor="pp-active" className="text-sm">
              Activo (visible en el sitio)
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Guardando…" : "Guardar"}
            </Button>
            {form.id && (
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
