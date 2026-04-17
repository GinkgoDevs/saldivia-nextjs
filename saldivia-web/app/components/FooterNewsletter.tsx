"use client";

import { subscribeNewsletter } from "@/app/actions/newsletter";
import { type FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export default function FooterNewsletter() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorReason, setErrorReason] = useState<"validation" | "server" | null>(
    null
  );
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorReason("validation");
      setStatus("error");
      return;
    }
    setStatus("idle");
    setErrorReason(null);
    startTransition(async () => {
      const res = await subscribeNewsletter(email);
      if (res.ok) {
        setStatus("sent");
        setErrorReason(null);
        form.reset();
      } else {
        setErrorReason(res.error === "invalid_email" ? "validation" : "server");
        setStatus("error");
      }
    });
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
        noValidate
      >
        <label htmlFor="footer-newsletter-email" className="sr-only">
          Correo para newsletter
        </label>
        <Input
          id="footer-newsletter-email"
          name="email"
          autoComplete="email"
          disabled={pending}
          className="w-full border-white/15 bg-white/10 text-white placeholder:text-white/40"
          placeholder="Tu email"
          type="email"
          tone="inverse"
          required
        />
        <Button
          type="submit"
          disabled={pending}
          className="min-w-[44px] shrink-0 px-4"
          size="sm"
          aria-label="Suscribirse al newsletter"
        >
          <span className="material-symbols-outlined" aria-hidden>
            send
          </span>
        </Button>
      </form>
      {status === "sent" ? (
        <p className="text-sm font-medium text-secondary-container" role="status">
          Gracias. Pronto nos pondremos en contacto.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-error-container" role="alert">
          {errorReason === "validation"
            ? "Ingresá un email válido."
            : "No pudimos registrar tu email. Intentá de nuevo en unos segundos."}
        </p>
      ) : null}
    </div>
  );
}
