"use client";

import { submitServiceRequest, type ServiceRequestState } from "@/app/actions/postventa";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="technical-gradient px-10 text-white hover:opacity-95 sm:w-auto"
      fullWidth
      size="sm"
      type="submit"
      disabled={pending}
    >
      {pending ? "Enviando…" : "Enviar consulta"}
    </Button>
  );
}

function errorMessage(s: ServiceRequestState): string | null {
  if (!s || s.ok) return null;
  if (s.error === "validation")
    return "Revise empresa, nombre, correo electrónico y mensaje. El email debe ser válido.";
  if (s.error === "database")
    return "No pudimos registrar la consulta. Intente de nuevo o utilice los canales de la sección Contacto.";
  if (s.error === "email")
    return "La consulta se registró, pero el aviso por correo falló. Nos pondremos en contacto igualmente.";
  return null;
}

export function PostventaSoporteForm() {
  const [state, formAction] = useActionState<ServiceRequestState, FormData>(submitServiceRequest, null);
  const err = errorMessage(state);
  const ok = state?.ok;

  return (
    <form action={formAction} className="space-y-6">
      {ok && (
        <p
          className="rounded-sm border border-secondary-container/40 bg-surface-container-low px-4 py-3 text-sm text-primary"
          role="status"
        >
          Recibimos su consulta. El equipo de postventa la verá en el sistema a la brevedad.
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

      <div>
        <label
          className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
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
          className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
          htmlFor="postventa_contact_name"
        >
          Nombre <span className="text-secondary">*</span>
        </label>
        <Input
          id="postventa_contact_name"
          name="contact_name"
          required
          autoComplete="name"
          className="bg-surface-container-low placeholder:text-outline-variant"
          placeholder="Nombre y apellido"
          type="text"
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
          htmlFor="postventa_email"
        >
          Correo electrónico <span className="text-secondary">*</span>
        </label>
        <Input
          id="postventa_email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="bg-surface-container-low placeholder:text-outline-variant"
          placeholder="respuesta@empresa.com"
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
          htmlFor="postventa_subject"
        >
          Asunto
        </label>
        <Input
          id="postventa_subject"
          name="subject"
          className="bg-surface-container-low placeholder:text-outline-variant"
          placeholder="Motivo de la consulta"
          type="text"
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
          htmlFor="postventa_description"
        >
          Mensaje <span className="text-secondary">*</span>
        </label>
        <Textarea
          id="postventa_description"
          name="description"
          required
          className="bg-surface-container-low placeholder:text-outline-variant"
          placeholder="Describa su consulta o requerimiento"
          rows={5}
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
