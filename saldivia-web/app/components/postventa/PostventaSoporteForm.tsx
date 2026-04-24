"use client";

import { submitServiceRequest, type ServiceRequestState } from "@/app/actions/postventa";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { useFormState, useFormStatus } from "react-dom";

type ModelOption = { name: string; slug: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="technical-gradient px-10 text-white hover:opacity-95"
      size="sm"
      type="submit"
      disabled={pending}
    >
      {pending ? "Enviando…" : "Enviar requerimiento"}
    </Button>
  );
}

function errorMessage(s: ServiceRequestState): string | null {
  if (!s || s.ok) return null;
  if (s.error === "validation")
    return "Revisá empresa, VIN y descripción. Si completás email, que sea válido.";
  if (s.error === "database") return "No pudimos registrar el pedido. Intentá de nuevo o escribinos por el 0800.";
  return null;
}

type Props = { modelOptions: ModelOption[] };

export function PostventaSoporteForm({ modelOptions }: Props) {
  const [state, formAction] = useFormState<ServiceRequestState, FormData>(submitServiceRequest, null);
  const err = errorMessage(state);
  const ok = state?.ok;

  return (
    <form action={formAction} className="space-y-6">
      {ok && (
        <p
          className="rounded-sm border border-secondary-container/40 bg-surface-container-low px-4 py-3 text-sm text-primary"
          role="status"
        >
          Recibimos tu solicitud. El equipo de postventa la verá en el sistema a la brevedad.
        </p>
      )}
      {err && (
        <p
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {err}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            htmlFor="postventa_company"
          >
            Empresa <span className="text-secondary">*</span>
          </label>
          <Input
            id="postventa_company"
            name="company"
            required
            autoComplete="organization"
            className="bg-surface-container-low placeholder:text-outline-variant"
            placeholder="Razón social o nombre de flota"
            type="text"
          />
        </div>
        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            htmlFor="postventa_model"
          >
            Modelo del bus
          </label>
          <select
            id="postventa_model"
            name="model_name"
            className="w-full rounded border-none bg-surface-container-low py-3 pl-4 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-secondary"
            defaultValue=""
          >
            <option value="">Seleccione un modelo (opcional)</option>
            {modelOptions.map((m) => (
              <option key={m.slug} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            htmlFor="postventa_vin"
          >
            Número de chasis (VIN) <span className="text-secondary">*</span>
          </label>
          <Input
            id="postventa_vin"
            name="vin"
            required
            className="bg-surface-container-low placeholder:text-outline-variant"
            placeholder="Ej: 9BWAA0123456789"
            type="text"
            autoComplete="off"
          />
        </div>
        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            htmlFor="postventa_contact_name"
          >
            Nombre de contacto
          </label>
          <Input
            id="postventa_contact_name"
            name="contact_name"
            autoComplete="name"
            className="bg-surface-container-low placeholder:text-outline-variant"
            placeholder="Quien recibe el seguimiento"
            type="text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            htmlFor="postventa_email"
          >
            Email
          </label>
          <Input
            id="postventa_email"
            name="email"
            type="email"
            autoComplete="email"
            className="bg-surface-container-low placeholder:text-outline-variant"
            placeholder="respuesta@empresa.com"
          />
        </div>
        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            htmlFor="postventa_phone"
          >
            Teléfono
          </label>
          <Input
            id="postventa_phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="bg-surface-container-low placeholder:text-outline-variant"
            placeholder="+54 …"
          />
        </div>
      </div>

      <div>
        <label
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
          htmlFor="postventa_description"
        >
          Descripción del requerimiento <span className="text-secondary">*</span>
        </label>
        <Textarea
          id="postventa_description"
          name="description"
          required
          className="bg-surface-container-low placeholder:text-outline-variant"
          placeholder="Síntoma, repuesto, taller asignado, urgencia…"
          rows={4}
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
