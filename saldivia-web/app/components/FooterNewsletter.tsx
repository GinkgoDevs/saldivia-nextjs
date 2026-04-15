"use client";

import { subscribeNewsletter } from "@/app/actions/newsletter";
import { type FormEvent, useState, useTransition } from "react";

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
        <input
          id="footer-newsletter-email"
          name="email"
          autoComplete="email"
          disabled={pending}
          className="w-full rounded border border-transparent bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Tu email"
          type="email"
          required
        />
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded bg-accent-blue px-4 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Suscribirse al newsletter"
        >
          <span className="material-symbols-outlined" aria-hidden>
            send
          </span>
        </button>
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
