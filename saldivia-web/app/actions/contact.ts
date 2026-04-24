"use server";

import { sendQuoteRequestEmail } from "@/lib/email/notify-quote";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactQuoteState =
  | { ok: true }
  | { ok: false; error: "validation" | "database" | "email" }
  | null;

type Field = {
  modelName: string;
  configuration: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
};

function getStr(formData: FormData, k: string): string {
  const v = formData.get(k);
  if (v == null) return "";
  return String(v).trim();
}

export async function submitContactQuote(
  _prev: ContactQuoteState,
  formData: FormData,
): Promise<ContactQuoteState> {
  const f: Field = {
    modelName: getStr(formData, "model_name"),
    configuration: getStr(formData, "configuration"),
    company: getStr(formData, "company"),
    contactName: getStr(formData, "contact_name"),
    email: getStr(formData, "email").toLowerCase(),
    phone: getStr(formData, "phone"),
    message: getStr(formData, "message"),
  };

  if (!f.contactName || !f.email || !EMAIL_RE.test(f.email)) {
    return { ok: false, error: "validation" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    model_name: f.modelName || null,
    configuration: f.configuration || null,
    company: f.company || null,
    contact_name: f.contactName,
    email: f.email,
    phone: f.phone || null,
    message: f.message || null,
  });

  if (error) {
    return { ok: false, error: "database" };
  }

  if (process.env.RESEND_API_KEY && process.env.QUOTE_NOTIFY_EMAIL) {
    const { sent, error: mailErr } = await sendQuoteRequestEmail(f);
    if (!sent) {
      console.error("[submitContactQuote] email", mailErr);
      return { ok: false, error: "email" };
    }
  }

  revalidatePath("/contacto");
  return { ok: true };
}
