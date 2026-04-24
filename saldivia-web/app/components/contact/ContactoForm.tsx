"use client";

import { submitContactQuote, type ContactQuoteState } from "@/app/actions/contact";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { useFormState, useFormStatus } from "react-dom";

type ModelOption = { name: string; slug: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full bg-secondary text-on-secondary hover:bg-secondary"
      disabled={pending}
      size="lg"
      type="submit"
    >
      {pending ? "Enviando…" : "Enviar consulta de cotización"}
    </Button>
  );
}

function errorMessage(s: ContactQuoteState): string | null {
  if (!s || s.ok) return null;
  if (s.error === "validation") return "Completá nombre, email válido y los campos obligatorios.";
  if (s.error === "database") return "No pudimos guardar el pedido. Intentá de nuevo o escribinos por email.";
  if (s.error === "email") return "El pedido se registró, pero el aviso por correo falló. Te contactaremos igualmente.";
  return null;
}

type Props = { modelOptions: ModelOption[] };

export function ContactoForm({ modelOptions }: Props) {
  const [state, formAction] = useFormState<ContactQuoteState, FormData>(submitContactQuote, null);
  const err = errorMessage(state);
  const ok = state?.ok;

  return (
    <form action={formAction} className="space-y-8">
      {ok && (
        <p className="rounded-sm border border-secondary-container/40 bg-surface-container-low px-4 py-3 text-sm text-primary">
          Gracias. Un asesor se pondrá en contacto a la brevedad.
        </p>
      )}
      {err && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-200">
          {err}
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-machined text-[11px] font-bold text-secondary" htmlFor="contact_name">
            Nombre y apellido <span className="text-primary">*</span>
          </label>
          <Input
            id="contact_name"
            name="contact_name"
            required
            autoComplete="name"
            placeholder="Ej: Juan Pérez"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label className="text-machined text-[11px] font-bold text-secondary" htmlFor="company">
            Empresa
          </label>
          <Input id="company" name="company" placeholder="Transporte del Sol" type="text" autoComplete="organization" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-machined text-[11px] font-bold text-secondary" htmlFor="email">
          Correo electrónico <span className="text-primary">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="email@empresa.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-machined text-[11px] font-bold text-secondary" htmlFor="phone">
          Teléfono
        </label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+54 11 0000-0000" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-machined text-[11px] font-bold text-secondary" htmlFor="model_name">
            Modelo de interés
          </label>
          <select
            id="model_name"
            name="model_name"
            className="h-12 w-full rounded-curve-sm border border-outline-variant/40 bg-surface-container-lowest px-4 font-headline text-sm text-on-surface outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent-blue"
            defaultValue=""
          >
            <option value="">Indistinto / a definir con asesor</option>
            {modelOptions.map((m) => (
              <option key={m.slug} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-machined text-[11px] font-bold text-secondary" htmlFor="configuration">
            Configuración / requisitos
          </label>
          <Input
            id="configuration"
            name="configuration"
            placeholder="Ej: 12 m, 44 asientos, baño, USB…"
            type="text"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-machined text-[11px] font-bold text-secondary" htmlFor="message">
          Mensaje o consulta
        </label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Plazo, ruta, normativa, volumen de unidades…"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
