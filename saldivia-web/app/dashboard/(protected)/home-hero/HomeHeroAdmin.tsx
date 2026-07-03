"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";

import {
  deleteHomeHeroSlide,
  reorderHomeHeroSlides,
  saveHomeHeroSlide,
  uploadMediaToBucket,
} from "@/app/actions/admin-content";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import type { HomeHeroSlideRow } from "@/types/home-hero";

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
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error === "validation" ? "Completá al menos título o imagen." : r.error);
      return;
    }
    setMessage("Guardado.");
    setForm(emptyForm(list.length + (form.id ? 0 : 1)));
    router.refresh();
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm("¿Eliminar esta slide del hero?")) return;
    setBusy(true);
    const r = await deleteHomeHeroSlide(form.id);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setList((prev) => prev.filter((x) => x.id !== form.id));
    setForm(emptyForm(Math.max(0, list.length - 1)));
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
      setMessage(r.error);
      return;
    }
    router.refresh();
  }

  async function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
    setForm((f) => ({ ...f, image_url: r.publicUrl }));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Slides del hero</h2>
        <p className="mt-1 text-xs text-on-surface-variant">
          Se muestran en este orden. Usá las flechas para reordenar.
        </p>
        <ul className="mt-4 space-y-2 rounded-sm border border-outline-variant/30 p-2">
          {ordered.length === 0 ? (
            <li className="p-4 text-sm text-on-surface-variant">
              No hay slides. Creá la primera con el formulario.
            </li>
          ) : (
            ordered.map((s, index) => (
              <li
                key={s.id}
                className={`flex items-stretch overflow-hidden rounded-sm border ${
                  form.id === s.id ? "border-primary ring-1 ring-primary/30" : "border-outline-variant/30"
                }`}
              >
                <div className="flex flex-col border-r border-outline-variant/25 bg-surface-container-high">
                  <button
                    type="button"
                    disabled={busy || index === 0}
                    onClick={() => void move(index, -1)}
                    aria-label="Subir"
                    className="flex flex-1 items-center px-1.5 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === ordered.length - 1}
                    onClick={() => void move(index, 1)}
                    aria-label="Bajar"
                    className="flex flex-1 items-center px-1.5 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" aria-hidden />
                  </button>
                </div>
                {s.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image_url}
                    alt=""
                    className="h-16 w-24 shrink-0 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center bg-surface-container text-[10px] text-on-surface-variant">
                    sin img
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => loadSlide(s)}
                  className="min-w-0 flex-1 px-3 py-2 text-left text-sm hover:bg-surface-container-high"
                >
                  <span className="block truncate font-bold text-primary">
                    {s.title || s.highlight || "(sin título)"}{" "}
                    {s.highlight && s.title ? (
                      <span className="font-normal text-on-surface-variant">{s.highlight}</span>
                    ) : null}
                  </span>
                  <span className="block truncate text-xs text-on-surface-variant">
                    orden {s.sort_order} {s.active ? "" : "· inactiva"}
                    {s.eyebrow ? ` · ${s.eyebrow}` : ""}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <Button className="mt-4" type="button" variant="outline" size="sm" onClick={newSlide}>
          Nueva slide
        </Button>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
          {editing ? "Editar slide" : "Nueva slide"}
        </h2>
        {message && <p className="mt-2 text-sm text-on-surface-variant">{message}</p>}
        <form className="mt-4 space-y-4" onSubmit={onSave}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="hero-image">
              Imagen de fondo (URL o archivo)
            </label>
            <Input
              id="hero-image"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="/background.png o URL subida"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-xs"
              onChange={(e) => void onImageUpload(e)}
            />
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image_url}
                alt=""
                className="mt-2 aspect-[16/6] w-full rounded-sm object-cover"
              />
            ) : null}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="hero-alt">
              Texto alternativo de la imagen (accesibilidad)
            </label>
            <Input
              id="hero-alt"
              value={form.image_alt}
              onChange={(e) => setForm((f) => ({ ...f, image_alt: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="hero-eyebrow">
              Antetítulo (eyebrow)
            </label>
            <Input
              id="hero-eyebrow"
              value={form.eyebrow}
              onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
              placeholder="Ingeniería de clase mundial"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="hero-title">
                Título (línea 1)
              </label>
              <Input
                id="hero-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Nuevo ARIES"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="hero-highlight">
                Destacado (línea 2)
              </label>
              <Input
                id="hero-highlight"
                value={form.highlight}
                onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))}
                placeholder="405 DD"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="hero-subtitle">
              Subtítulo / descripción
            </label>
            <Textarea
              id="hero-subtitle"
              rows={3}
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            />
          </div>

          <fieldset className="space-y-3 rounded-sm border border-outline-variant/25 bg-surface-container-low/40 p-4">
            <legend className="px-1 text-xs font-bold uppercase tracking-wide text-secondary">
              Botón principal
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant" htmlFor="hero-p-label">
                  Texto
                </label>
                <Input
                  id="hero-p-label"
                  value={form.primary_label}
                  onChange={(e) => setForm((f) => ({ ...f, primary_label: e.target.value }))}
                  placeholder="Explorar modelos"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant" htmlFor="hero-p-href">
                  Enlace (adónde lleva)
                </label>
                <Input
                  id="hero-p-href"
                  value={form.primary_href}
                  onChange={(e) => setForm((f) => ({ ...f, primary_href: e.target.value }))}
                  placeholder="/flota"
                />
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Dejá ambos campos vacíos para ocultar este botón.
            </p>
          </fieldset>

          <fieldset className="space-y-3 rounded-sm border border-outline-variant/25 bg-surface-container-low/40 p-4">
            <legend className="px-1 text-xs font-bold uppercase tracking-wide text-secondary">
              Botón secundario
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant" htmlFor="hero-s-label">
                  Texto
                </label>
                <Input
                  id="hero-s-label"
                  value={form.secondary_label}
                  onChange={(e) => setForm((f) => ({ ...f, secondary_label: e.target.value }))}
                  placeholder="Tour industrial"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant" htmlFor="hero-s-href">
                  Enlace (adónde lleva)
                </label>
                <Input
                  id="hero-s-href"
                  value={form.secondary_href}
                  onChange={(e) => setForm((f) => ({ ...f, secondary_href: e.target.value }))}
                  placeholder="/nosotros"
                />
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Dejá ambos campos vacíos para ocultar este botón.
            </p>
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="hero-order">
                Orden
              </label>
              <Input
                id="hero-order"
                type="number"
                value={String(form.sort_order)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number.parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input
                id="hero-active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              <label htmlFor="hero-active" className="text-sm">
                Activa (visible en el home)
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Guardando…" : "Guardar"}
            </Button>
            <Button type="button" variant="ghost" onClick={newSlide} disabled={busy}>
              Limpiar / nueva
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={() => void onDelete()} disabled={busy}>
                Eliminar
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
