"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteLocation, saveLocation } from "@/app/actions/admin-content";
import type { Location, LocationType } from "@/types/location";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";

const TYPES: { value: LocationType; label: string }[] = [
  { value: "taller", label: "Taller" },
  { value: "distribuidor", label: "Distribuidor" },
  { value: "concesionario", label: "Concesionario" },
];

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
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setList(initial);
  }, [initial]);

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
  }

  function newRow() {
    setForm({ ...empty });
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
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
    if (!window.confirm("¿Eliminar este punto?")) return;
    setBusy(true);
    const r = await deleteLocation(form.id);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.error);
      return;
    }
    setList((p) => p.filter((l) => l.id !== form.id));
    setForm(empty);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Listado</h2>
        <ul className="mt-4 max-h-[480px] space-y-2 overflow-y-auto rounded-sm border border-outline-variant/30 p-2 text-sm">
          {list.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => load(l)}
                className={`w-full rounded-sm px-3 py-2 text-left ${
                  form.id === l.id ? "bg-secondary-container/25" : "hover:bg-surface-container-high"
                }`}
              >
                <span className="block font-bold">{l.name}</span>
                <span className="text-xs text-on-surface-variant">
                  {l.province} — {l.type} {l.active ? "" : "· oculto"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Button className="mt-4" type="button" variant="outline" size="sm" onClick={newRow}>
          Nueva ubicación
        </Button>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Editar / crear</h2>
        {message && <p className="mt-2 text-sm text-on-surface-variant">{message}</p>}
        <form className="mt-4 space-y-3" onSubmit={onSave}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="lname">
              Nombre
            </label>
            <Input
              id="lname"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="ltype">
                Tipo
              </label>
              <select
                id="ltype"
                className="h-11 w-full rounded-curve-sm border border-outline-variant/40 bg-surface-container-lowest px-2 text-sm"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LocationType }))}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input
                id="lactive"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              <label htmlFor="lactive" className="text-sm">
                Activo
              </label>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="prov">
              Provincia
            </label>
            <Input
              id="prov"
              value={form.province}
              onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="city">
              Ciudad
            </label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="addr">
              Dirección
            </label>
            <Textarea
              id="addr"
              rows={2}
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="lat">
                Lat
              </label>
              <Input
                id="lat"
                type="number"
                step="0.0000001"
                value={form.lat}
                onChange={(e) => setForm((f) => ({ ...f, lat: parseFloat(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary" htmlFor="lng">
                Lng
              </label>
              <Input
                id="lng"
                type="number"
                step="0.0000001"
                value={form.lng}
                onChange={(e) => setForm((f) => ({ ...f, lng: parseFloat(e.target.value) }))}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="phone">
              Teléfono
            </label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary" htmlFor="hours">
              Horario
            </label>
            <Input id="hours" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} />
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
