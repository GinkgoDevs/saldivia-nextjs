"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";

import {
  deleteHomeHeroSlide,
  reorderHomeHeroSlides,
  saveHomeHeroSlide,
} from "@/app/actions/admin-content";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { uploadMediaFromBrowser } from "@/lib/upload-media-client";
import type { HomeHeroSlideRow } from "@/types/home-hero";
import {
  AdminCheckbox,
  AdminField,
  AdminFormActions,
  AdminFormSection,
  AdminListPanel,
  AdminStatusBanner,
  AdminTwoColumn,
  MediaDropzone,
} from "../_ui/admin-ui";

type FormState = {
  id: string | null;
  sort_order: number;
  image_url: string;
  image_alt: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
  active: boolean;
};

function emptyForm(sortOrder: number): FormState {
  return {
    id: null,
    sort_order: sortOrder,
    image_url: "",
    image_alt: "",
    eyebrow: "",
    title: "",
    highlight: "",
    subtitle: "",
    primary_label: "",
    primary_href: "",
    secondary_label: "",
    secondary_href: "",
    active: true,
  };
}

function slideToForm(s: HomeHeroSlideRow): FormState {
  return {
    id: s.id,
    sort_order: s.sort_order,
    image_url: s.image_url ?? "",
    image_alt: s.image_alt ?? "",
    eyebrow: s.eyebrow ?? "",
    title: s.title ?? "",
    highlight: s.highlight ?? "",
    subtitle: s.subtitle ?? "",
    primary_label: s.primary_label ?? "",
    primary_href: s.primary_href ?? "",
    secondary_label: s.secondary_label ?? "",
    secondary_href: s.secondary_href ?? "",
    active: s.active,
  };
}

type Props = { initialSlides: HomeHeroSlideRow[] };

export function HomeHeroAdmin({ initialSlides }: Props) {
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

  const ordered = useMemo(
    () => [...list].sort((a, b) => a.sort_order - b.sort_order),
    [list],
  );

  const editing = Boolean(form.id);

  function loadSlide(s: HomeHeroSlideRow) {
    setForm(slideToForm(s));
    setMessage(null);
  }

  function newSlide() {
    setForm(emptyForm(list.length));
    setMessage(null);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const r = await saveHomeHeroSlide({
        id: form.id,
        sort_order: form.sort_order,
        image_url: form.image_url,
        image_alt: form.image_alt,
        eyebrow: form.eyebrow,
        title: form.title,
        highlight: form.highlight,
        subtitle: form.subtitle,
        primary_label: form.primary_label,
        primary_href: form.primary_href,
        secondary_label: form.secondary_label,
        secondary_href: form.secondary_href,
        active: form.active,
      });
      if (!r.ok) {
        setMessage({
          text: r.error === "validation" ? "Completá al menos título o imagen." : r.error,
          variant: "error",
        });
        return;
      }
      setMessage({ text: "Slide guardada.", variant: "success" });
      if (!form.id) setForm(emptyForm(list.length + 1));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm("¿Eliminar esta slide del hero?")) return;
    setBusy(true);
    const r = await deleteHomeHeroSlide(form.id);
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

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target], next[index]];
    const orderedIds = next.map((s) => s.id);
    setList(next.map((s, i) => ({ ...s, sort_order: i })));
    setBusy(true);
    const r = await reorderHomeHeroSlides(orderedIds);
    setBusy(false);
    if (!r.ok) {
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    router.refresh();
  }

  async function onImageFile(file: File) {
    setUploading(true);
    setMessage(null);
    try {
      const r = await uploadMediaFromBrowser(file, { folder: "home-hero" });
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

  return (
    <AdminTwoColumn
      list={
        <AdminListPanel
          title="Slides del hero"
          description="Orden de aparición en el carrusel del inicio. Usá las flechas para reordenar."
          action={
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={newSlide}>
              <Plus className="size-4" aria-hidden />
              Nueva
            </Button>
          }
        >
          <ul className="divide-y divide-outline-variant/25">
            {ordered.length === 0 ? (
              <li className="p-6 text-center text-sm text-on-surface-variant">
                No hay slides. Creá la primera con el formulario.
              </li>
            ) : (
              ordered.map((s, index) => (
                <li
                  key={s.id}
                  className={`flex items-stretch ${
                    form.id === s.id ? "bg-secondary-container/15 ring-1 ring-inset ring-primary/25" : ""
                  }`}
                >
                  <div className="flex flex-col border-r border-outline-variant/20 bg-surface-container-high">
                    <button
                      type="button"
                      disabled={busy || index === 0}
                      onClick={() => void move(index, -1)}
                      aria-label="Subir en el orden"
                      className="flex min-h-10 flex-1 cursor-pointer items-center px-2 text-on-surface-variant hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      disabled={busy || index === ordered.length - 1}
                      onClick={() => void move(index, 1)}
                      aria-label="Bajar en el orden"
                      className="flex min-h-10 flex-1 cursor-pointer items-center px-2 text-on-surface-variant hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown className="size-4" aria-hidden />
                    </button>
                  </div>
                  {s.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.image_url} alt="" className="h-20 w-28 shrink-0 object-cover" />
                  ) : (
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center bg-surface-container text-[10px] text-on-surface-variant">
                      Sin img
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => loadSlide(s)}
                    className="min-w-0 flex-1 cursor-pointer px-3 py-2 text-left transition-colors hover:bg-surface-container-high"
                  >
                    <span className="block truncate font-bold text-primary">
                      {s.title || s.highlight || "(sin título)"}
                    </span>
                    <span className="block truncate text-xs text-on-surface-variant">
                      orden {s.sort_order}
                      {s.active ? "" : " · inactiva"}
                      {s.eyebrow ? ` · ${s.eyebrow}` : ""}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </AdminListPanel>
      }
      form={
        <section className="rounded-sm border border-outline-variant/30 bg-surface-container-lowest p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
            {editing ? "Editar slide" : "Nueva slide"}
          </h2>
          {message ? (
            <div className="mt-3">
              <AdminStatusBanner variant={message.variant}>{message.text}</AdminStatusBanner>
            </div>
          ) : null}
          <form className="mt-4 space-y-5" onSubmit={onSave}>
            <MediaDropzone
              id="hero-slide-image"
              label="Imagen de fondo"
              hint="Foto amplia del bus o planta. Se verá detrás del texto en el home."
              value={form.image_url}
              previewAspect="aspect-[16/7]"
              uploading={uploading}
              disabled={busy}
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              onFileSelect={onImageFile}
            />

            <AdminField id="hero-alt" label="Texto alternativo (accesibilidad)" hint="Describe la imagen para lectores de pantalla.">
              <Input
                id="hero-alt"
                value={form.image_alt}
                onChange={(e) => setForm((f) => ({ ...f, image_alt: e.target.value }))}
              />
            </AdminField>

            <AdminField id="hero-eyebrow" label="Antetítulo" hint="Línea pequeña sobre el título.">
              <Input
                id="hero-eyebrow"
                value={form.eyebrow}
                onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
                placeholder="Ingeniería de clase mundial"
              />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField id="hero-title" label="Título (línea 1)" required>
                <Input
                  id="hero-title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Nuevo ARIES"
                />
              </AdminField>
              <AdminField id="hero-highlight" label="Destacado (línea 2)">
                <Input
                  id="hero-highlight"
                  value={form.highlight}
                  onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))}
                  placeholder="405 DD"
                />
              </AdminField>
            </div>

            <AdminField id="hero-subtitle" label="Subtítulo / descripción">
              <Textarea
                id="hero-subtitle"
                rows={3}
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              />
            </AdminField>

            <AdminFormSection
              title="Botón principal"
              description="Dejá ambos campos vacíos para ocultar este botón."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id="hero-p-label" label="Texto">
                  <Input
                    id="hero-p-label"
                    value={form.primary_label}
                    onChange={(e) => setForm((f) => ({ ...f, primary_label: e.target.value }))}
                    placeholder="Explorar modelos"
                  />
                </AdminField>
                <AdminField id="hero-p-href" label="Enlace">
                  <Input
                    id="hero-p-href"
                    value={form.primary_href}
                    onChange={(e) => setForm((f) => ({ ...f, primary_href: e.target.value }))}
                    placeholder="/flota"
                  />
                </AdminField>
              </div>
            </AdminFormSection>

            <AdminFormSection
              title="Botón secundario"
              description="Dejá ambos campos vacíos para ocultar este botón."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id="hero-s-label" label="Texto">
                  <Input
                    id="hero-s-label"
                    value={form.secondary_label}
                    onChange={(e) => setForm((f) => ({ ...f, secondary_label: e.target.value }))}
                    placeholder="Tour industrial"
                  />
                </AdminField>
                <AdminField id="hero-s-href" label="Enlace">
                  <Input
                    id="hero-s-href"
                    value={form.secondary_href}
                    onChange={(e) => setForm((f) => ({ ...f, secondary_href: e.target.value }))}
                    placeholder="/nosotros"
                  />
                </AdminField>
              </div>
            </AdminFormSection>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField id="hero-order" label="Orden">
                <Input
                  id="hero-order"
                  type="number"
                  value={String(form.sort_order)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number.parseInt(e.target.value, 10) || 0 }))
                  }
                />
              </AdminField>
              <AdminCheckbox
                id="hero-active"
                label="Slide activa"
                description="Solo las slides activas se muestran en el home."
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
            </div>

            <AdminFormActions
              saving={busy}
              uploading={uploading}
              onClear={newSlide}
              clearLabel="Limpiar / nueva"
              onDelete={editing ? () => void onDelete() : undefined}
            />
          </form>
        </section>
      }
    />
  );
}
