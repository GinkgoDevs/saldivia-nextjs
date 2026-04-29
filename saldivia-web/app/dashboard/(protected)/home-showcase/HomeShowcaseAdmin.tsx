"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteHomeShowcaseSlide,
  saveHomeShowcaseSlide,
  uploadMediaToBucket,
} from "@/app/actions/admin-content";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import type { AdminShowcaseSlide } from "@/lib/supabase/home-showcase";
import type { Model } from "@/types/model";

type FormState = {
  id: string | null;
  model_id: string;
  sort_order: number;
  hero_image_url: string;
  eyebrow: string;
  lead: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
};

function emptyForm(sortOrder: number): FormState {
  return {
    id: null,
    model_id: "",
    sort_order: sortOrder,
    hero_image_url: "",
    eyebrow: "",
    lead: "",
    stat1_value: "",
    stat1_label: "",
    stat2_value: "",
    stat2_label: "",
  };
}

function slideToForm(s: AdminShowcaseSlide): FormState {
  const m = Array.isArray(s.metrics) ? s.metrics : [];
  const first = m[0] as { value?: string; label?: string } | undefined;
  const second = m[1] as { value?: string; label?: string } | undefined;
  return {
    id: s.id,
    model_id: s.model_id,
    sort_order: s.sort_order,
    hero_image_url: s.hero_image_url ?? "",
    eyebrow: s.eyebrow ?? "",
    lead: s.lead ?? "",
    stat1_value: typeof first?.value === "string" ? first.value : "",
    stat1_label: typeof first?.label === "string" ? first.label : "",
    stat2_value: typeof second?.value === "string" ? second.value : "",
    stat2_label: typeof second?.label === "string" ? second.label : "",
  };
}

type Props = { initialSlides: AdminShowcaseSlide[]; models: Model[] };

export function HomeShowcaseAdmin({ initialSlides, models }: Props) {
  const router = useRouter();
  const [list, setList] = useState(initialSlides);
  const [form, setForm] = useState<FormState>(() => emptyForm(initialSlides.length));
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setList(initialSlides);
  }, [initialSlides]);

  const modelOptions = useMemo(
    () => [...models].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)),
    [models],
  );

  const editing = useMemo(() => form.id, [form.id]);

  function loadSlide(s: AdminShowcaseSlide) {
    setForm(slideToForm(s));
  }

  function newSlide() {
    setForm(emptyForm(list.length));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const r = await saveHomeShowcaseSlide({
      id: form.id,
      model_id: form.model_id,
      sort_order: form.sort_order,
      hero_image_url: form.hero_image_url,
      eyebrow: form.eyebrow,
      lead: form.lead,
      stat1_value: form.stat1_value,
      stat1_label: form.stat1_label,
      stat2_value: form.stat2_value,
      stat2_label: form.stat2_label,
    });
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setMessage("Guardado.");
    setForm(emptyForm(list.length + (form.id ? 0 : 1)));
    router.refresh();
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm("¿Eliminar este slide del showcase?")) return;
    setBusy(true);
    const r = await deleteHomeShowcaseSlide(form.id);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setList((prev) => prev.filter((x) => x.id !== form.id));
    setForm(emptyForm(Math.max(0, list.length - 1)));
    router.refresh();
  }

  async function onHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      setMessage(r.error);
      return;
    }
    setForm((f) => ({ ...f, hero_image_url: r.publicUrl }));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h2 className="text-lg font-bold uppercase tracking-tight text-primary">Slides actuales</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Orden de aparición: <code className="text-xs">sort_order</code> ascendente. En el home solo se listan modelos
          activos.
        </p>
        <ul className="mt-4 divide-y divide-outline-variant/30 rounded border border-outline-variant/30 bg-surface-container-lowest">
          {list.length === 0 ? (
            <li className="p-4 text-sm text-on-surface-variant">No hay slides. Creá uno y enlazalo a un modelo.</li>
          ) : (
            list.map((s) => {
              const label = s.model ? `${s.model.name} (${s.model.slug})` : s.model_id;
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">{label}</p>
                    <p className="text-xs text-on-surface-variant">
                      orden {s.sort_order}
                      {s.model && !s.model.active ? " · modelo inactivo (no se muestra en el sitio)" : ""}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => loadSlide(s)}>
                    Editar
                  </Button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <div className="rounded border border-outline-variant/30 bg-surface-container-lowest p-6">
        <h2 className="text-lg font-bold uppercase tracking-tight text-primary">
          {editing ? "Editar slide" : "Nuevo slide"}
        </h2>
        <form className="mt-4 space-y-4" onSubmit={onSave}>
          <label className="block text-sm font-medium text-primary">
            Modelo
            <select
              required
              className="mt-1 w-full rounded border border-outline-variant/40 bg-surface px-3 py-2 text-sm"
              value={form.model_id}
              onChange={(e) => setForm((f) => ({ ...f, model_id: e.target.value }))}
            >
              <option value="">Elegir…</option>
              {modelOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.slug}
                  {!m.active ? " (inactivo)" : ""}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="showcase-order">
              Orden
            </label>
            <Input
              id="showcase-order"
              type="number"
              value={String(form.sort_order)}
              onChange={(e) =>
                setForm((f) => ({ ...f, sort_order: Number.parseInt(e.target.value, 10) || 0 }))
              }
            />
          </div>
          <div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="showcase-hero-url">
                Imagen hero (URL, opcional)
              </label>
              <Input
                id="showcase-hero-url"
                value={form.hero_image_url}
                onChange={(e) => setForm((f) => ({ ...f, hero_image_url: e.target.value }))}
                placeholder="Si vacío: portada del modelo o primera imagen de galería"
              />
            </div>
            <label className="mt-2 block text-xs text-on-surface-variant">
              Subir archivo
              <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={onHeroUpload} />
            </label>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="showcase-eyebrow">
              Rubro / etiqueta (opcional)
            </label>
            <Input
              id="showcase-eyebrow"
              value={form.eyebrow}
              onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
              placeholder="Si vacío: según segmento del modelo"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="showcase-lead">
              Texto destacado (opcional)
            </label>
            <Textarea
              id="showcase-lead"
              value={form.lead}
              onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
              placeholder="Si vacío: descripción del modelo"
              rows={3}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="showcase-s1v">
                Dato 1 — valor
              </label>
              <Input
                id="showcase-s1v"
                value={form.stat1_value}
                onChange={(e) => setForm((f) => ({ ...f, stat1_value: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="showcase-s1l">
                Dato 1 — etiqueta
              </label>
              <Input
                id="showcase-s1l"
                value={form.stat1_label}
                onChange={(e) => setForm((f) => ({ ...f, stat1_label: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="showcase-s2v">
                Dato 2 — valor
              </label>
              <Input
                id="showcase-s2v"
                value={form.stat2_value}
                onChange={(e) => setForm((f) => ({ ...f, stat2_value: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="showcase-s2l">
                Dato 2 — etiqueta
              </label>
              <Input
                id="showcase-s2l"
                value={form.stat2_label}
                onChange={(e) => setForm((f) => ({ ...f, stat2_label: e.target.value }))}
              />
            </div>
          </div>
          {message ? <p className="text-sm text-saldivia-blue">{message}</p> : null}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" variant="primary" disabled={busy}>
              Guardar
            </Button>
            <Button type="button" variant="ghost" onClick={newSlide} disabled={busy}>
              Limpiar / nuevo
            </Button>
            {editing ? (
              <Button type="button" variant="outline" onClick={() => void onDelete()} disabled={busy}>
                Eliminar
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
