"use server";

import { sendSectionNotificationEmail } from "@/lib/email/section-notify";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_BYTES = 5 * 1024 * 1024;

const ALLOWED_CV_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_CV_EXT = new Set(["pdf", "doc", "docx"]);

export type CvApplicationState =
  | { ok: true }
  | { ok: false; error: "validation" | "file" | "file_too_large" | "database" | "email" }
  | null;

function getStr(formData: FormData, k: string): string {
  const v = formData.get(k);
  if (v == null) return "";
  return String(v).trim();
}

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  if (i < 0) return "";
  return name.slice(i + 1).toLowerCase();
}

function sanitizeFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[/\\]/g, "_")
    .replace(/[^\w.\- ()áéíóúüñÁÉÍÓÚÜÑ]/gi, "_")
    .slice(0, 120);
  return cleaned || "cv.pdf";
}

function isAllowedCv(file: File): boolean {
  const ext = extensionOf(file.name);
  if (ALLOWED_CV_EXT.has(ext)) return true;
  if (file.type && ALLOWED_CV_MIME.has(file.type)) return true;
  return false;
}

export async function submitCvApplication(
  _prev: CvApplicationState,
  formData: FormData,
): Promise<CvApplicationState> {
  const contactName = getStr(formData, "contact_name");
  const email = getStr(formData, "email").toLowerCase();
  const phone = getStr(formData, "phone");
  const position = getStr(formData, "position");
  const message = getStr(formData, "message");
  const rawFile = formData.get("cv_file");

  if (!contactName || !email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "validation" };
  }

  if (!(rawFile instanceof File) || rawFile.size < 1) {
    return { ok: false, error: "file" };
  }
  if (rawFile.size > MAX_CV_BYTES) {
    return { ok: false, error: "file_too_large" };
  }
  if (!isAllowedCv(rawFile)) {
    return { ok: false, error: "file" };
  }

  const filename = sanitizeFilename(rawFile.name);
  const contentType = rawFile.type || "application/octet-stream";
  const cvNote = `CV adjunto: ${filename}`;
  const storedMessage = [position ? `Puesto de interés: ${position}` : "", cvNote, message]
    .filter(Boolean)
    .join("\n\n");

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    model_name: null,
    configuration: position || null,
    company: null,
    contact_name: contactName,
    email,
    phone: phone || null,
    message: storedMessage,
  });

  if (error) {
    return { ok: false, error: "database" };
  }

  if (process.env.RESEND_API_KEY) {
    const bytes = Buffer.from(await rawFile.arrayBuffer());
    const text = [
      "Nueva postulación — Trabaja con nosotros — Saldivia web",
      "",
      `Contacto: ${contactName}`,
      `Email: ${email}`,
      `Tel: ${phone || "—"}`,
      `Puesto / área: ${position || "—"}`,
      `CV: ${filename}`,
      "",
      "Mensaje:",
      message || "—",
    ].join("\n");

    const { sent, skipped, error: mailErr } = await sendSectionNotificationEmail({
      section: "cv",
      subject: `CV — ${contactName}${position ? ` (${position})` : ""}`,
      text,
      replyTo: email,
      attachments: [
        {
          filename,
          content: bytes.toString("base64"),
          content_type: contentType,
        },
      ],
    });

    if (!skipped && !sent) {
      console.error("[submitCvApplication] email", mailErr);
      return { ok: false, error: "email" };
    }
  }

  revalidatePath("/trabaja-con-nosotros");
  return { ok: true };
}
