"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ServiceRequestState =
  | { ok: true }
  | { ok: false; error: "validation" | "database" }
  | null;

function getStr(formData: FormData, k: string): string {
  const v = formData.get(k);
  if (v == null) return "";
  return String(v).trim();
}

/**
 * Origen: formulario /postventa → tabla public.service_requests (ver migración 001 + RLS inserción pública en 004).
 */
export async function submitServiceRequest(
  _prev: ServiceRequestState,
  formData: FormData,
): Promise<ServiceRequestState> {
  const company = getStr(formData, "company");
  const contactName = getStr(formData, "contact_name");
  const email = getStr(formData, "email").toLowerCase();
  const subject = getStr(formData, "subject");
  const description = getStr(formData, "description");

  if (!company || !contactName || !email || !description) {
    return { ok: false, error: "validation" };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "validation" };
  }

  const fullDescription = subject
    ? `Asunto: ${subject}\n\n${description}`
    : description;

  const supabase = await createClient();
  const { error } = await supabase.from("service_requests").insert({
    vin: "—",
    company,
    description: fullDescription,
    contact_name: contactName,
    email,
    phone: null,
  });

  if (error) {
    return { ok: false, error: "database" };
  }

  revalidatePath("/postventa");
  return { ok: true };
}
