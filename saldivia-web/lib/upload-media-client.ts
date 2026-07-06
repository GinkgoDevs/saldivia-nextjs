import { createClient } from "@/lib/supabase/client";

export const MEDIA_UPLOAD_MAX_BYTES = 15 * 1024 * 1024;

export type MediaUploadResult =
  | { ok: true; publicUrl: string }
  | { ok: false; error: string };

/** Sube a Storage desde el navegador (evita límite de body en server actions). */
export async function uploadMediaFromBrowser(file: File): Promise<MediaUploadResult> {
  if (file.size < 1) {
    return { ok: false, error: "Archivo vacío." };
  }
  if (file.size > MEDIA_UPLOAD_MAX_BYTES) {
    return { ok: false, error: "El archivo supera 15 MB." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "unauthorized" };
  }

  const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `uploads/${user.id.slice(0, 8)}/${Date.now()}-${safe}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
  return { ok: true, publicUrl: pub.publicUrl };
}
