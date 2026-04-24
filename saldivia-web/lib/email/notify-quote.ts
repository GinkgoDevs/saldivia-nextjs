const RESEND_API = "https://api.resend.com/emails";

export type QuoteEmailPayload = {
  modelName: string;
  configuration: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
};

export async function sendQuoteRequestEmail(
  payload: QuoteEmailPayload,
): Promise<{ sent: boolean; error?: string }> {
  const to = process.env.QUOTE_NOTIFY_EMAIL;
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) {
    return { sent: false };
  }

  const text = [
    "Nueva solicitud de cotización — Saldivia web",
    "",
    `Modelo: ${payload.modelName || "—"}`,
    `Configuración: ${payload.configuration || "—"}`,
    `Empresa: ${payload.company || "—"}`,
    `Contacto: ${payload.contactName}`,
    `Email: ${payload.email}`,
    `Tel: ${payload.phone || "—"}`,
    "",
    "Mensaje:",
    payload.message || "—",
  ].join("\n");

  const from = process.env.RESEND_FROM || "Saldivia <onboarding@resend.dev>";

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Cotización — ${payload.contactName}`,
      text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { sent: false, error: errText || res.statusText };
  }

  return { sent: true };
}
