"use server";

import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterSubscribeResult =
  | { ok: true }
  | { ok: false; error: "invalid_email" | "database" };

export async function subscribeNewsletter(
  rawEmail: string
): Promise<NewsletterSubscribeResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email" };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("newsletter_subscriptions")
    .insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { ok: true };
    }
    return { ok: false, error: "database" };
  }

  return { ok: true };
}
