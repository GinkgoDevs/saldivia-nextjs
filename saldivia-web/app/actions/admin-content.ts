"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import type { ModelSegment } from "@/types/model";
import type { LocationType } from "@/types/location";

const SEGMENTS: ModelSegment[] = [
  "urbano",
  "interurbano",
  "interprovincial",
  "especiales",
];

const LOC_TYPES: LocationType[] = ["taller", "distribuidor", "concesionario"];

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, user: null };
  }
  return { supabase, user };
}

function revalidateContent() {
  revalidatePath("/flota");
  revalidatePath("/producto");
  revalidatePath("/");
  revalidatePath("/contacto");
}

export async function uploadMediaToBucket(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size < 1) {
    return { ok: false as const, error: "invalid_file" };
  }

  const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `uploads/${user.id.slice(0, 8)}/${Date.now()}-${safe}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("media")
    .upload(path, buf, { contentType: file.type || "application/octet-stream" });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
  return { ok: true as const, publicUrl: pub.publicUrl };
}

type SaveModelInput = {
  id: string | null;
  slug: string;
  name: string;
  segment: string;
  description: string;
  cover_image_url: string;
  pdf_url: string;
  sort_order: number;
  active: boolean;
};

export async function saveModel(input: SaveModelInput) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }

  const seg = input.segment as ModelSegment;
  if (!SEGMENTS.includes(seg)) {
    return { ok: false as const, error: "validation" };
  }

  const row = {
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    name: input.name.trim(),
    segment: seg,
    description: input.description.trim() || null,
    cover_image_url: input.cover_image_url.trim() || null,
    pdf_url: input.pdf_url.trim() || null,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    active: input.active,
  };

  if (!row.slug || !row.name) {
    return { ok: false as const, error: "validation" };
  }

  if (input.id) {
    const { error } = await supabase.from("models").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("models").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidateContent();
  return { ok: true as const };
}

export async function deleteModel(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }
  const { error } = await supabase.from("models").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateContent();
  return { ok: true as const };
}

type SaveLocationInput = {
  id: string | null;
  name: string;
  type: string;
  province: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  active: boolean;
};

export async function saveLocation(input: SaveLocationInput) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }

  const t = input.type as LocationType;
  if (!LOC_TYPES.includes(t)) {
    return { ok: false as const, error: "validation" };
  }

  if (!Number.isFinite(input.lat) || !Number.isFinite(input.lng)) {
    return { ok: false as const, error: "validation" };
  }

  const row = {
    name: input.name.trim(),
    type: t,
    province: input.province.trim(),
    city: input.city.trim(),
    address: input.address.trim(),
    phone: input.phone.trim() || null,
    hours: input.hours.trim() || null,
    lat: input.lat,
    lng: input.lng,
    active: input.active,
  };

  if (!row.name || !row.province || !row.city || !row.address) {
    return { ok: false as const, error: "validation" };
  }

  if (input.id) {
    const { error } = await supabase.from("locations").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("locations").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/flota");
  return { ok: true as const };
}

export async function deleteLocation(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const };
}

type SaveProvinceProjectInput = {
  id: string | null;
  province_slug: string;
  title: string;
  description: string;
  location_label: string;
  segment: string;
  year: string;
  sort_order: number;
  active: boolean;
};

export async function saveProvinceProject(input: SaveProvinceProjectInput) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }

  const slug = input.province_slug.trim().toLowerCase().replace(/\s+/g, "-");
  const row = {
    province_slug: slug,
    title: input.title.trim(),
    description: input.description.trim() || null,
    location_label: input.location_label.trim() || null,
    segment: input.segment.trim() || null,
    year: input.year.trim() || null,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    active: input.active,
  };

  if (!row.province_slug || !row.title) {
    return { ok: false as const, error: "validation" };
  }

  if (input.id) {
    const { error } = await supabase.from("province_projects").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("province_projects").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteProvinceProject(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }
  const { error } = await supabase.from("province_projects").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const };
}
