"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { deleteLocation, saveLocation } from "@/app/actions/admin-content";
import type { Location, LocationType } from "@/types/location";
import {
  ARGENTINA_MAP_PROVINCES,
  ARGENTINA_MAP_PROVINCE_IDS,
  formatArgentinaProvince,
} from "@/lib/argentina-map-provinces";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import {
  AdminCheckbox,
  AdminCrudBadge,
  AdminCrudCard,
  AdminCrudLayout,
  AdminField,
  AdminFormSection,
  AdminFullscreenForm,
  AdminModal,
  AdminModalFooter,
  AdminSelect,
  AdminWizardPanel,
  adminToast,
  type WizardStep,
} from "../_ui/admin-ui";

const LOCATION_WIZARD_STEPS: WizardStep[] = [
  {
    id: "place",
    title: "Ubicación",
    hint: "Nombre, tipo y dirección que verá el visitante en el mapa.",
  },
  {
    id: "contact",
    title: "Contacto y mapa",
    hint: "Coordenadas para Leaflet, teléfono y horario de atención.",
  },
];

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
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

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
  }

  function newRow() {
    setForm({ ...empty });
  }

  function openEdit(row: Location) {
    load(row);
    setWizardStep(0);
    setModalOpen(true);
  }

  function openNew() {
    newRow();
    setWizardStep(0);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setWizardStep(0);
  }

  function validateWizardStep(step: number): boolean {
    if (step !== 0) return true;
    if (!form.name.trim() || !form.province || !form.city.trim() || !form.address.trim()) {
      adminToast.error("Completá nombre, provincia, ciudad y dirección antes de continuar.");
      return false;
    }
    return true;
  }

  function goNextStep() {
    if (!validateWizardStep(wizardStep)) return;
    setWizardStep((s) => Math.min(s + 1, LOCATION_WIZARD_STEPS.length - 1));
  }

  function goPrevStep() {
    setWizardStep((s) => Math.max(s - 1, 0));
  }

  const currentStepId = LOCATION_WIZARD_STEPS[wizardStep]?.id ?? "place";

  async function onDeleteLocation(row: Location) {
    if (!window.confirm(`¿Eliminar "${row.name}" del mapa?`)) return;
    setBusy(true);
    const r = await deleteLocation(row.id);
    setBusy(false);
    if (!r.ok) {
      adminToast.error(r.error);
      return;
    }
    setList((p) => p.filter((l) => l.id !== row.id));
    if (form.id === row.id) {
      setForm(empty);
      setModalOpen(false);
    }
    adminToast.success(`"${row.name}" eliminado.`);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
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
        adminToast.error(r.error);
        return;
      }
      adminToast.success("Ubicación guardada.");
      setModalOpen(false);
      if (!form.id) setForm(empty);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!form.id) return;
    const row = list.find((l) => l.id === form.id);
    if (row) await onDeleteLocation(row);
  }

  return (
    <>
      <AdminCrudLayout
        summary={
          <>
            {sortedList.length} ubicación{sortedList.length === 1 ? "" : "es"} · talleres, distribuidores y
            concesionarios en el mapa
          </>
        }
        newLabel="Nueva ubicación"
        onNew={openNew}
        newDisabled={busy}
      >
        {sortedList.length === 0 ? (
          <li className="rounded-sm border border-dashed border-outline-variant/40 p-8 text-center text-sm text-on-surface-variant">
            No hay ubicaciones cargadas.
          </li>
        ) : (
          sortedList.map((l) => (
            <AdminCrudCard
              key={l.id}
              media={
                <div className="hidden h-28 w-28 shrink-0 items-center justify-center bg-primary/10 text-primary sm:flex">
                  <MapPin className="size-8" aria-hidden />
                </div>
              }
              title={l.name}
              subtitle={
                <>
                  {formatArgentinaProvince(l.province)} · {TYPE_LABEL[l.type]}
                  {l.city ? ` · ${l.city}` : ""}
                </>
              }
              badges={
                <>
                  <AdminCrudBadge tone={l.active ? "secondary" : "warning"}>
                    {l.active ? "Visible" : "Oculto"}
                  </AdminCrudBadge>
                  {l.lat !== 0 || l.lng !== 0 ? (
                    <AdminCrudBadge>Con coordenadas</AdminCrudBadge>
                  ) : null}
                </>
              }
              disabled={busy}
              onEdit={() => openEdit(l)}
              onDelete={() => void onDeleteLocation(l)}
            />
          ))
        )}
      </AdminCrudLayout>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Editar: ${form.name || "ubicación"}` : "Nueva ubicación"}
        fullscreen
        footer={
          <AdminModalFooter
            formId="location-form"
            saving={busy}
            hideSave={wizardStep < LOCATION_WIZARD_STEPS.length - 1}
            onCancel={closeModal}
            onDelete={
              editing && wizardStep === LOCATION_WIZARD_STEPS.length - 1 ? () => void onDelete() : undefined
            }
            leading={
              <>
                {wizardStep > 0 ? (
                  <Button type="button" variant="outline" disabled={busy} onClick={goPrevStep}>
                    Anterior
                  </Button>
                ) : null}
                {wizardStep < LOCATION_WIZARD_STEPS.length - 1 ? (
                  <Button type="button" disabled={busy} onClick={goNextStep}>
                    Siguiente
                  </Button>
                ) : null}
              </>
            }
          />
        }
      >
        <AdminFullscreenForm
          id="location-form"
          steps={LOCATION_WIZARD_STEPS}
          currentStep={wizardStep}
          onStepClick={(index) => {
            if (index < wizardStep) setWizardStep(index);
            else if (index > wizardStep && validateWizardStep(wizardStep)) setWizardStep(index);
          }}
          onSubmit={(e) => {
            if (wizardStep < LOCATION_WIZARD_STEPS.length - 1) {
              e.preventDefault();
              goNextStep();
              return;
            }
            void onSave(e);
          }}
        >
          <AdminWizardPanel stepId="place" currentStepId={currentStepId}>
            <AdminFormSection
              title="Datos de la sede"
              description="Aparecen en el mapa de atención del sitio."
            >
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
                    <option value={form.province}>{form.province} — valor actual</option>
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
            </AdminFormSection>
          </AdminWizardPanel>

          <AdminWizardPanel stepId="contact" currentStepId={currentStepId}>
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
          </AdminWizardPanel>
        </AdminFullscreenForm>
      </AdminModal>
    </>
  );
}
