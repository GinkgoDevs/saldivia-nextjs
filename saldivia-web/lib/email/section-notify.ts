const RESEND_API = "https://api.resend.com/emails";

/** Destinos de notificación por sección (correo respectivo de cada formulario). */
export const SECTION_NOTIFY_EMAILS = {
  ventas: "ventas@saldiviabuses.com.ar",
  postventa: "postventa@saldiviabuses.com.ar",
  cv: "cv@saldiviabuses.com.ar",
} as const;

export type NotifySection = keyof typeof SECTION_NOTIFY_EMAILS;

export function isNotifySection(value: string): value is NotifySection {
  return value in SECTION_NOTIFY_EMAILS;
}

export function resolveNotifyEmail(section: NotifySection): string {
  if (section === "ventas") {
    return process.env.VENTAS_NOTIFY_EMAIL?.trim() || SECTION_NOTIFY_EMAILS.ventas;
  }
  if (section === "postventa") {
    return process.env.POSTVENTA_NOTIFY_EMAIL?.trim() || SECTION_NOTIFY_EMAILS.postventa;
  }
  return process.env.CV_NOTIFY_EMAIL?.trim() || SECTION_NOTIFY_EMAILS.cv;
}

export async function sendSectionNotificationEmail(opts: {
  section: NotifySection;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { sent: false, skipped: true };
  }

  const to = resolveNotifyEmail(opts.section);
  const from = process.env.RESEND_FROM || "Saldivia <onboarding@resend.dev>";

  const body: Record<string, unknown> = {
    from,
    to: [to],
    subject: opts.subject,
    text: opts.text,
  };
  if (opts.replyTo) {
    body.reply_to = opts.replyTo;
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { sent: false, error: errText || res.statusText };
  }

  return { sent: true };
}
