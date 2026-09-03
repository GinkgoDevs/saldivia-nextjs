"use client";

import { submitCvApplication, type CvApplicationState } from "@/app/actions/cv";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full bg-secondary text-on-secondary hover:bg-secondary"
      disabled={pending}
      size="lg"
      type="submit"
    >
      {pending ? "Enviando…" : "Enviar postulación"}
    </Button>
  );
}

function errorMessage(s: CvApplicationState): string | null {
  if (!s || s.ok) return null;
  if (s.error === "validation") return "Complete nombre y un correo electrónico válido.";
  if (s.error === "file") return "Adjunte su CV en PDF, DOC o DOCX.";
  if (s.error === "file_too_large") return "El archivo no debe superar 5 MB.";
  if (s.error === "database")
    return "No pudimos registrar la postulación. Intente de nuevo o envíe su CV a cv@saldiviabuses.com.ar.";
  if (s.error === "email")
    return "La postulación se registró, pero el aviso por correo falló. Nos pondremos en contacto igualmente.";
  return null;
}

export function CvApplicationForm() {
  const [state, formAction] = useActionState<CvApplicationState, FormData>(
    submitCvApplication,
    null,
  );
  const [fileName, setFileName] = useState("");
  const err = errorMessage(state);
  const ok = state?.ok;

  return (
    <form action={formAction} className="space-y-8">
      {ok && (
        <p
          className="rounded-sm border border-secondary-container/40 bg-surface-container-low px-4 py-3 text-sm text-primary"
          role="status"
        >
          Recibimos su CV. Nos pondremos en contacto cuando haya vacantes acordes a su perfil.
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-machined text-sm font-bold text-secondary" htmlFor="cv_contact_name">
            Nombre y apellido <span className="text-primary">*</span>
          </label>
          <Input
            id="cv_contact_name"
            name="contact_name"
            required
            autoComplete="name"
            placeholder="Ej: Juan Pérez"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label className="text-machined text-sm font-bold text-secondary" htmlFor="cv_position">
            Puesto o área de interés
          </label>
          <Input
            id="cv_position"
            name="position"
            placeholder="Ej: Producción, soldadura, administración…"
            type="text"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-machined text-sm font-bold text-secondary" htmlFor="cv_email">
          Correo electrónico <span className="text-primary">*</span>
        </label>
        <Input
          id="cv_email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="su.email@correo.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-machined text-sm font-bold text-secondary" htmlFor="cv_phone">
          Teléfono
        </label>
        <Input id="cv_phone" name="phone" type="tel" autoComplete="tel" placeholder="+54 11 0000-0000" />
      </div>

      <div className="space-y-2">
        <label className="text-machined text-sm font-bold text-secondary" htmlFor="cv_file">
          Adjuntar CV <span className="text-primary">*</span>
        </label>
        <input
          id="cv_file"
          name="cv_file"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="peer sr-only"
          aria-describedby="cv_file_hint"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setFileName(file?.name ?? "");
          }}
        />
        <label
          htmlFor="cv_file"
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-curve-sm border border-transparent bg-surface-variant px-4 py-3 font-headline text-sm text-on-surface transition-all duration-base ease-brand-fluid hover:border-secondary/40 hover:bg-surface-container-lowest peer-focus-visible:ring-2 peer-focus-visible:ring-accent-blue peer-focus-visible:ring-offset-2"
        >
          <span className="material-symbols-outlined text-secondary" aria-hidden>
            attach_file
          </span>
          <span className={`min-w-0 flex-1 truncate ${fileName ? "text-on-surface" : "text-outline"}`}>
            {fileName || "Seleccionar archivo (PDF, DOC o DOCX)"}
          </span>
        </label>
        <p id="cv_file_hint" className="text-xs text-on-surface-variant">
          Tamaño máximo: 5 MB.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-machined text-sm font-bold text-secondary" htmlFor="cv_message">
          Mensaje
        </label>
        <Textarea
          id="cv_message"
          name="message"
          rows={5}
          placeholder="Breve presentación, disponibilidad o experiencia relevante…"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
