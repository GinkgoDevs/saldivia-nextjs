import {
  sendSectionNotificationEmail,
  type NotifySection,
} from "@/lib/email/section-notify";

export type QuoteEmailPayload = {
  modelName: string;
  configuration: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
};

const SECTION_LABEL: Record<NotifySection, string> = {
  ventas: "Cotización / contacto comercial",
  postventa: "Consulta de postventa",
  cv: "CV / trabaja con nosotros",
};

export async function sendQuoteRequestEmail(
  payload: QuoteEmailPayload,
  section: NotifySection = "ventas",
): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  const label = SECTION_LABEL[section];
  const text = [
    `Nueva solicitud — ${label} — Saldivia web`,
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

  const subjectPrefix =
    section === "cv" ? "CV" : section === "postventa" ? "Postventa" : "Cotización";

  return sendSectionNotificationEmail({
    section,
    subject: `${subjectPrefix} — ${payload.contactName}`,
    text,
    replyTo: payload.email,
  });
}
