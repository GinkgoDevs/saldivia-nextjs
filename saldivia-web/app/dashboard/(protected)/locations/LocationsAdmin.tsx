"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus } from "lucide-react";
import { deleteLocation, saveLocation } from "@/app/actions/admin-content";
import type { Location, LocationType } from "@/types/location";
import {
  ARGENTINA_MAP_PROVINCES,
  ARGENTINA_MAP_PROVINCE_IDS,
  formatArgentinaProvince,
} from "@/lib/argentina-map-provinces";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import {
  AdminCheckbox,
  AdminField,
  AdminFormActions,
  AdminFormSection,
  AdminListPanel,
  AdminSelect,
  AdminStatusBanner,
  AdminTwoColumn,
} from "../_ui/admin-ui";

const TYPES: { value: LocationType; label: string }[] = [
  { value: "taller", label: "Taller" },
  { value: "distribuidor", label: "Distribuidor" },
  { value: "concesionario", label: "Concesionario" },
];

const TYPE_LABEL: Record<LocationType, string> = {
  taller: "Taller",
  distribuidor: "Distribuidor",
  concesionario: "Concesionario",
};

type LocForm = {
  id: string | null;
  name: string;
  type: LocationType;
  province: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  active: boolean;
};

type AdminMessage = { text: string; variant: "info" | "success" | "error" } | null;

const empty: LocForm = {
  id: null,
  name: "",
  type: "taller",
  province: "",
  city: "",
  address: "",
  phone: "",
  hours: "",
  lat: 0,
  lng: 0,
  active: true,
};

type Props = { initial: Location[] };

export function LocationsAdmin({ initial }: Props) {
  const router = useRouter();
  const [list, setList] = useState<Location[]>(initial);
  const [form, setForm] = useState<LocForm>(empty);
  const [message, setMessage] = useState<AdminMessage>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setList(initial);
  }, [initial]);

  const sortedList = useMemo(
    () => [...list].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [list],
  );

  const editing = Boolean(form.id);

  function load(row: Location) {
    setForm({
      id: row.id,
      name: row.name,
      type: row.type,
      province: row.province,
      city: row.city,
      address: row.address,
      phone: row.phone ?? "",
      hours: row.hours ?? "",
      lat: row.lat,
      lng: row.lng,
      active: row.active,
    });
    setMessage(null);
  }

  function newRow() {
    setForm({ ...empty });
    setMessage(null);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const r = await saveLocation({
        id: form.id,
        name: form.name,
        type: form.type,
        province: form.province,
        city: form.city,
        address: form.address,
        phone: form.phone,
        hours: form.hours,
        lat: form.lat,
        lng: form.lng,
        active: form.active,
      });
      if (!r.ok) {
        setMessage({ text: r.error, variant: "error" });
        return;
      }
      setMessage({ text: "Ubicación guardada.", variant: "success" });
      if (!form.id) setForm(empty);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm("¿Eliminar este punto del mapa?")) return;
    setBusy(true);
    const r = await deleteLocation(form.id);
    setBusy(false);
    if (!r.ok) {
      setMessage({ text: r.error, variant: "error" });
      return;
    }
    setList((p) => p.filter((l) => l.id !== form.id));
    setForm(empty);
    setMessage({ text: "Ubicación eliminada.", variant: "success" });
  }

  return (
    <AdminTwoColumn
      list={
        <AdminListPanel
          title="Ubicaciones"
          description="Talleres, distribuidores y concesionarios que aparecen en el mapa del sitio."
          action={
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={newRow}>
              <Plus className="size-4" aria-hidden />
              Nueva
            </Button>
          }
        >
          <ul className="divide-y divide-outline-variant/25">
            {sortedList.length === 0 ? (
              <li className="p-6 text-center text-sm text-on-surface-variant">
                No hay ubicaciones cargadas.
              </li>
            ) : (
              sortedList.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => load(l)}
                    className={`flex w-full cursor-pointer items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-surface-container-high ${
                      form.id === l.id ? "bg-secondary-container/15 ring-1 ring-inset ring-primary/25" : ""
                    }`}
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                      <MapPin className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-primary">{l.name}</span>
                      <span className="block truncate text-xs text-on-surface-variant">
                        {formatArgentinaProvince(l.province)} · {TYPE_LABEL[l.type]}
                        {l.city ? ` · ${l.city}` : ""}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-on-surface-variant/80">
                        {l.active ? "Visible" : "Oculto"}
                        {l.lat !== 0 || l.lng !== 0 ? " · con coordenadas" : ""}
                      </span>
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
            {editing ? "Editar ubicación" : "Nueva ubicación"}
          </h2>
          {message ? (
            <div className="mt-3">
              <AdminStatusBanner variant={message.variant}>{message.text}</AdminStatusBanner>
            </div>
          ) : null}
          <form className="mt-4 space-y-5" onSubmit={onSave}>
            <AdminField id="lname" label="Nombre" required>
              <Input
                id="lname"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField id="ltype" label="Tipo">
                <AdminSelect
                  id="ltype"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LocationType }))}
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </AdminSelect>
              </AdminField>
              <AdminCheckbox
                id="lactive"
                label="Visible en el sitio"
                description="Si está desactivado, no aparece en el mapa."
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
            </div>

            <AdminField
              id="prov"
              label="Provincia"
              required
              hint="Debe coincidir con el identificador del mapa SVG (ej. buenos-aires, cordoba)."
            >
              <AdminSelect
                id="prov"
                value={form.province}
                onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
                required
              >
                <option value="">Seleccioná provincia</option>
                {form.province && !ARGENTINA_MAP_PROVINCE_IDS.has(form.province) ? (
                  <option value={form.province}>
                    {form.province} — valor actual
                  </option>
                ) : null}
                {ARGENTINA_MAP_PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>

            <AdminField id="city" label="Ciudad" required>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                required
              />
            </AdminField>

            <AdminField id="addr" label="Dirección" required>
              <Textarea
                id="addr"
                rows={2}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
              />
            </AdminField>

            <AdminFormSection
              title="Coordenadas (opcional)"
              description="Para mapas con marcadores (Leaflet). Podés usar 0, 0 si solo importa la presencia en el SVG del home."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField id="lat" label="Latitud">
                  <Input
                    id="lat"
                    type="number"
                    step="0.0000001"
                    value={form.lat}
                    onChange={(e) => setForm((f) => ({ ...f, lat: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </AdminField>
                <AdminField id="lng" label="Longitud">
                  <Input
                    id="lng"
                    type="number"
                    step="0.0000001"
                    value={form.lng}
                    onChange={(e) => setForm((f) => ({ ...f, lng: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </AdminField>
              </div>
            </AdminFormSection>

            <AdminFormSection title="Contacto">
              <div className="space-y-3">
                <AdminField id="phone" label="Teléfono">
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </AdminField>
                <AdminField id="hours" label="Horario">
                  <Input
                    id="hours"
                    value={form.hours}
                    onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
                    placeholder="Lun–Vie 8:00–17:00"
                  />
                </AdminField>
              </div>
            </AdminFormSection>

            <AdminFormActions
              saving={busy}
              onClear={newRow}
              clearLabel="Limpiar"
              onDelete={editing ? () => void onDelete() : undefined}
            />
          </form>
        </section>
      }
    />
  );
}
