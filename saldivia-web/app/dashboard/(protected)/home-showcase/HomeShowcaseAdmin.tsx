"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteHomeShowcaseSlide,
  saveHomeShowcaseSlide,
} from "@/app/actions/admin-content";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { AdminShowcaseSlide } from "@/lib/supabase/home-showcase";
import type { Model } from "@/types/model";
import {
  AdminField,
  AdminFormActions,
  AdminFormSection,
  AdminListPanel,
  AdminSelect,
  AdminStatusBanner,
  AdminTwoColumn,
  MediaDropzone,
} from "../_ui/admin-ui";

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
  const [message, setMessage] = useState<{ text: string; variant: "info" | "success" | "error" } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setMessage({ text: "Slide guardada.", variant: "success" });
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
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setList((prev) => prev.filter((x) => x.id !== form.id));
    setForm(emptyForm(Math.max(0, list.length - 1)));
    setMessage({ text: "Slide eliminada.", variant: "success" });
    router.refresh();
  }

  async function onHeroFile(file: File) {
    setUploading(true);
    setMessage(null);
    try {
      const r = await uploadMediaFromBrowser(file, { folder: "home-showcase" });
      if (!r.ok) {
        setMessage({ text: r.error, variant: "error" });
        return;
      }
      setForm((f) => ({ ...f, hero_image_url: r.publicUrl }));
      setMessage({ text: "Imagen subida. Pulse Guardar para publicar.", variant: "info" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminTwoColumn
      list={
        <AdminListPanel
          title="Slides del showcase"
          description="Orden ascendente por sort_order. Solo modelos activos aparecen en el home."
        >
          <ul className="divide-y divide-outline-variant/25">
            {list.length === 0 ? (
              <li className="p-6 text-center text-sm text-on-surface-variant">
                No hay slides. Creá uno y enlazalo a un modelo.
              </li>
            ) : (
              list.map((s) => {
                const label = s.model ? `${s.model.name} (${s.model.slug})` : s.model_id;
                return (
                  <li
                    key={s.id}
                    className={`flex items-center gap-3 p-3 ${
                      form.id === s.id ? "bg-secondary-container/15 ring-1 ring-inset ring-primary/25" : ""
                    }`}
                  >
                    {s.hero_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.hero_image_url} alt="" className="size-14 shrink-0 rounded-sm object-cover" />
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-surface-container text-[10px] text-on-surface-variant">
                        auto
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-primary">{label}</p>
                      <p className="text-xs text-on-surface-variant">
                        orden {s.sort_order}
                        {s.model && !s.model.active ? " · modelo inactivo" : ""}
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
        </AdminListPanel>
      }
      form={
        <section className="rounded-sm border border-outline-variant/30 bg-surface-container-lowest p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
            {editing ? "Editar slide" : "Nuevo slide"}
          </h2>
          {message ? (
            <div className="mt-3">
              <AdminStatusBanner variant={message.variant}>{message.text}</AdminStatusBanner>
            </div>
          ) : null}
          <form className="mt-4 space-y-5" onSubmit={onSave}>
            <AdminField id="showcase-model" label="Modelo" required hint="El slide mostrará datos de este colectivo.">
              <AdminSelect
                id="showcase-model"
                required
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
              </AdminSelect>
            </AdminField>

            <AdminField id="showcase-order" label="Orden">
              <Input
                id="showcase-order"
                type="number"
                value={String(form.sort_order)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number.parseInt(e.target.value, 10) || 0 }))
                }
              />
            </AdminField>

            <MediaDropzone
              id="showcase-hero"
              label="Imagen del showcase"
              hint="Si está vacía, se usa la portada del modelo o la primera imagen de la galería."
              value={form.hero_image_url}
              uploading={uploading}
              disabled={busy}
              onChange={(url) => setForm((f) => ({ ...f, hero_image_url: url }))}
              onFileSelect={onHeroFile}
            />

            <AdminField id="showcase-eyebrow" label="Rubro / etiqueta" hint="Si vacío: según segmento del modelo.">
              <Input
                id="showcase-eyebrow"
                value={form.eyebrow}
                onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
              />
            </AdminField>

            <AdminField id="showcase-lead" label="Texto destacado" hint="Si vacío: descripción del modelo.">
              <Textarea
                id="showcase-lead"
                value={form.lead}
                onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
                rows={3}
              />
            </AdminField>

            <AdminFormSection title="Métricas destacadas" description="Dos datos numéricos bajo el texto.">
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id="showcase-s1v" label="Dato 1 — valor">
                  <Input
                    id="showcase-s1v"
                    value={form.stat1_value}
                    onChange={(e) => setForm((f) => ({ ...f, stat1_value: e.target.value }))}
                  />
                </AdminField>
                <AdminField id="showcase-s1l" label="Dato 1 — etiqueta">
                  <Input
                    id="showcase-s1l"
                    value={form.stat1_label}
                    onChange={(e) => setForm((f) => ({ ...f, stat1_label: e.target.value }))}
                  />
                </AdminField>
                <AdminField id="showcase-s2v" label="Dato 2 — valor">
                  <Input
                    id="showcase-s2v"
                    value={form.stat2_value}
                    onChange={(e) => setForm((f) => ({ ...f, stat2_value: e.target.value }))}
                  />
                </AdminField>
                <AdminField id="showcase-s2l" label="Dato 2 — etiqueta">
                  <Input
                    id="showcase-s2l"
                    value={form.stat2_label}
                    onChange={(e) => setForm((f) => ({ ...f, stat2_label: e.target.value }))}
                  />
                </AdminField>
              </div>
            </AdminFormSection>

            <AdminFormActions
              saving={busy}
              uploading={uploading}
              onClear={newSlide}
              clearLabel="Limpiar / nuevo"
              onDelete={editing ? () => void onDelete() : undefined}
            />
          </form>
        </section>
      }
    />
  );
}
