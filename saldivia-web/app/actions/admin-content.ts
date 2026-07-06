"use server";

import { createClient } from "@/lib/supabase/server";
import { slugifyVariantCode } from "@/lib/model-variants";
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
  revalidatePath("/trabaja-con-nosotros");
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

type TechSpecRow = { spec_key: string; spec_value: string };

type VariantInput = {
  id: string | null;
  code: string;
  name: string;
  description: string;
  is_default: boolean;
  tech_specs: TechSpecRow[];
  general_feature_bodies: string[];
};

type SaveModelInput = {
  id: string | null;
  slug: string;
  name: string;
  segment: string;
  description: string;
  cover_image_url: string;
  hero_background_image_url: string;
  hero_background_focal_x: number;
  hero_background_focal_y: number;
  hero_background_zoom: number;
  pdf_url: string;
  sort_order: number;
  active: boolean;
  /** Mostrar en el "Showcase técnico" del home. */
  show_in_showcase?: boolean;
  /** Specs compartidas (variant_id NULL). */
  tech_specs?: TechSpecRow[];
  general_feature_bodies?: string[];
  /** Si se envía, sincroniza variantes del modelo (4x2, 4x4, etc.). */
  variants?: VariantInput[];
};

const MAX_SPEC_ROWS = 80;
const MAX_FEATURE_ROWS = 80;
const MAX_SPEC_FIELD_LEN = 2000;
const MAX_VARIANTS = 24;

function normalizeSpecs(rows: TechSpecRow[] | undefined, limit = MAX_SPEC_ROWS) {
  return (rows ?? [])
    .map((s) => ({
      spec_key: s.spec_key.trim(),
      spec_value: s.spec_value.trim(),
    }))
    .filter((s) => s.spec_key.length > 0 && s.spec_value.length > 0)
    .slice(0, limit)
    .map((s, i) => ({
      spec_key: s.spec_key.slice(0, MAX_SPEC_FIELD_LEN),
      spec_value: s.spec_value.slice(0, MAX_SPEC_FIELD_LEN),
      sort_order: i,
    }));
}

function normalizeFeatureBodies(bodies: string[] | undefined, limit = MAX_FEATURE_ROWS) {
  return (bodies ?? [])
    .map((b) => b.trim())
    .filter((b) => b.length > 0)
    .slice(0, limit)
    .map((body, i) => ({
      body: body.slice(0, MAX_SPEC_FIELD_LEN),
      sort_order: i,
    }));
}

function clampHeroFocal(n: number) {
  if (!Number.isFinite(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function clampHeroZoom(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.min(2.5, Math.max(1, Math.round(n * 100) / 100));
}

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
    hero_background_image_url: input.hero_background_image_url.trim() || null,
    hero_background_focal_x: clampHeroFocal(input.hero_background_focal_x),
    hero_background_focal_y: clampHeroFocal(input.hero_background_focal_y),
    hero_background_zoom: clampHeroZoom(input.hero_background_zoom),
    pdf_url: input.pdf_url.trim() || null,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    active: input.active,
    show_in_showcase: input.show_in_showcase ?? false,
  };

  if (!row.slug || !row.name) {
    return { ok: false as const, error: "validation" };
  }

  const { show_in_showcase: _drop, ...rowLegacy } = row;
  const isMissingShowcaseColumn = (msg?: string) => !!msg?.includes("show_in_showcase");
  const isMissingHeroColumn = (msg?: string) => !!msg?.includes("hero_background_image_url");
  const isMissingHeroFocal = (msg?: string) => !!msg?.includes("hero_background_focal");

  const stripHeroFocal = <T extends Record<string, unknown>>(r: T) => {
    const {
      hero_background_focal_x: _x,
      hero_background_focal_y: _y,
      hero_background_zoom: _z,
      ...rest
    } = r;
    return rest;
  };

  const stripHeroImage = <T extends Record<string, unknown>>(r: T) => {
    const {
      hero_background_image_url: _h,
      hero_background_focal_x: _x,
      hero_background_focal_y: _y,
      hero_background_zoom: _z,
      ...rest
    } = r;
    return rest;
  };

  let modelId: string;
  let warning: string | undefined;

  async function persistModelRow(isInsert: boolean) {
    let payload: Record<string, unknown> = { ...row };
    let result = isInsert
      ? await supabase.from("models").insert(payload).select("id").single()
      : await supabase.from("models").update(payload).eq("id", modelId);

    let error = result.error;

    if (isMissingShowcaseColumn(error?.message)) {
      payload = { ...rowLegacy };
      result = isInsert
        ? await supabase.from("models").insert(payload).select("id").single()
        : await supabase.from("models").update(payload).eq("id", modelId);
      error = result.error;
    }

    if (isMissingHeroFocal(error?.message)) {
      payload = stripHeroFocal(payload);
      warning =
        "Falta la migración 009 (encuadre del hero). Ejecutala en Supabase; el resto se guardó.";
      result = isInsert
        ? await supabase.from("models").insert(payload).select("id").single()
        : await supabase.from("models").update(payload).eq("id", modelId);
      error = result.error;
    }

    if (isMissingHeroColumn(error?.message)) {
      payload = stripHeroImage(payload);
      if (input.hero_background_image_url.trim()) {
        warning =
          "Falta la migración 008 (hero por modelo). Ejecutala en Supabase; la imagen de hero no se guardó.";
      }
      result = isInsert
        ? await supabase.from("models").insert(payload).select("id").single()
        : await supabase.from("models").update(payload).eq("id", modelId);
      error = result.error;
    }

    return { result, error };
  }

  if (input.id) {
    modelId = input.id;
    const persisted = await persistModelRow(false);
    if (persisted.error) return { ok: false as const, error: persisted.error.message };
  } else {
    const persisted = await persistModelRow(true);
    if (persisted.error) return { ok: false as const, error: persisted.error.message };
    const data = persisted.result.data as { id?: string } | null;
    if (!data?.id) return { ok: false as const, error: "validation" };
    modelId = data.id;
  }

  if (input.variants !== undefined) {
    const { error: delProdErr } = await supabase.from("products").delete().eq("model_id", modelId);
    if (delProdErr) return { ok: false as const, error: delProdErr.message };
    const { error: delFeatErr } = await supabase
      .from("model_general_features")
      .delete()
      .eq("model_id", modelId);
    if (delFeatErr) return { ok: false as const, error: delFeatErr.message };

    const rawVariants = input.variants.slice(0, MAX_VARIANTS).map((v, i) => ({
      id: v.id,
      code: slugifyVariantCode(v.code || v.name),
      name: v.name.trim(),
      description: v.description.trim() || null,
      is_default: v.is_default,
      sort_order: i,
      tech_specs: normalizeSpecs(v.tech_specs),
      general_feature_bodies: normalizeFeatureBodies(v.general_feature_bodies),
    }));

    const variants = rawVariants.filter((v) => v.code && v.name);
    if (rawVariants.length > 0 && variants.length === 0) {
      return { ok: false as const, error: "validation" };
    }

    let defaultSet = false;
    for (const v of variants) {
      if (v.is_default && !defaultSet) {
        defaultSet = true;
      } else {
        v.is_default = false;
      }
    }
    if (!defaultSet && variants.length > 0) {
      variants[0].is_default = true;
    }

    const keptIds: string[] = [];

    for (const v of variants) {
      const variantRow = {
        model_id: modelId,
        code: v.code,
        name: v.name,
        description: v.description,
        is_default: v.is_default,
        sort_order: v.sort_order,
      };

      let variantId: string | null = v.id;

      if (variantId) {
        const { error } = await supabase.from("model_variants").update(variantRow).eq("id", variantId);
        if (error) return { ok: false as const, error: error.message };
      } else {
        const { data, error } = await supabase
          .from("model_variants")
          .insert(variantRow)
          .select("id")
          .single();
        if (error) return { ok: false as const, error: error.message };
        if (!data?.id) return { ok: false as const, error: "validation" };
        variantId = data.id;
      }

      if (!variantId) return { ok: false as const, error: "validation" };

      keptIds.push(variantId);

      if (v.tech_specs.length > 0) {
        const { error: insErr } = await supabase.from("products").insert(
          v.tech_specs.map((s) => ({
            model_id: modelId,
            variant_id: variantId,
            ...s,
          })),
        );
        if (insErr) return { ok: false as const, error: insErr.message };
      }

      if (v.general_feature_bodies.length > 0) {
        const { error: insFErr } = await supabase.from("model_general_features").insert(
          v.general_feature_bodies.map((f) => ({
            model_id: modelId,
            variant_id: variantId,
            ...f,
          })),
        );
        if (insFErr) return { ok: false as const, error: insFErr.message };
      }
    }

    const { data: existingVariants } = await supabase
      .from("model_variants")
      .select("id")
      .eq("model_id", modelId);
    const removeVariantIds = (existingVariants ?? [])
      .map((row) => (row as { id: string }).id)
      .filter((id) => !keptIds.includes(id));
    if (removeVariantIds.length > 0) {
      const { error: delVarErr } = await supabase.from("model_variants").delete().in("id", removeVariantIds);
      if (delVarErr) return { ok: false as const, error: delVarErr.message };
    }

    const sharedSpecs = normalizeSpecs(input.tech_specs);
    if (sharedSpecs.length > 0) {
      const { error: insErr } = await supabase.from("products").insert(
        sharedSpecs.map((s) => ({ model_id: modelId, variant_id: null, ...s })),
      );
      if (insErr) return { ok: false as const, error: insErr.message };
    }

    const sharedFeatures = normalizeFeatureBodies(input.general_feature_bodies);
    if (sharedFeatures.length > 0) {
      const { error: insFErr } = await supabase.from("model_general_features").insert(
        sharedFeatures.map((f) => ({ model_id: modelId, variant_id: null, ...f })),
      );
      if (insFErr) return { ok: false as const, error: insFErr.message };
    }
  } else if (input.tech_specs !== undefined) {
    const specs = normalizeSpecs(input.tech_specs).map((s) => ({
      model_id: modelId,
      variant_id: null as string | null,
      ...s,
    }));

    const { error: delErr } = await supabase.from("products").delete().eq("model_id", modelId);
    if (delErr) return { ok: false as const, error: delErr.message };

    if (specs.length > 0) {
      const { error: insErr } = await supabase.from("products").insert(specs);
      if (insErr) return { ok: false as const, error: insErr.message };
    }
  }

  if (input.variants === undefined && input.general_feature_bodies !== undefined) {
    const bodies = normalizeFeatureBodies(input.general_feature_bodies).map((f) => ({
      model_id: modelId,
      variant_id: null as string | null,
      ...f,
    }));

    const { error: delFErr } = await supabase
      .from("model_general_features")
      .delete()
      .eq("model_id", modelId);
    if (delFErr) return { ok: false as const, error: delFErr.message };

    if (bodies.length > 0) {
      const { error: insFErr } = await supabase.from("model_general_features").insert(bodies);
      if (insFErr) return { ok: false as const, error: insFErr.message };
    }
  }

  revalidateContent();
  return { ok: true as const, id: modelId, warning };
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

export async function reorderModels(ordered_model_ids: string[]) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false as const, error: "unauthorized" };

  if (ordered_model_ids.length === 0) {
    return { ok: false as const, error: "validation" };
  }

  if (new Set(ordered_model_ids).size !== ordered_model_ids.length) {
    return { ok: false as const, error: "validation" };
  }

  const { data: existing, error: fetchError } = await supabase.from("models").select("id");

  if (fetchError) return { ok: false as const, error: fetchError.message };
  if (!existing || existing.length !== ordered_model_ids.length) {
    return { ok: false as const, error: "validation" };
  }

  const existingSet = new Set(existing.map((r) => r.id));
  for (const id of ordered_model_ids) {
    if (!existingSet.has(id)) {
      return { ok: false as const, error: "validation" };
    }
  }

  const updates = ordered_model_ids.map((id, sort_order) =>
    supabase.from("models").update({ sort_order }).eq("id", id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { ok: false as const, error: failed.error.message };
  }

  revalidateContent();
  revalidatePath("/dashboard/models");
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
  image_url: string;
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
    image_url: input.image_url.trim() || null,
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

export async function reorderProvinceProjects(province_slug: string, ordered_project_ids: string[]) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false as const, error: "unauthorized" };

  const slug = province_slug.trim().toLowerCase();
  if (!slug || ordered_project_ids.length === 0) {
    return { ok: false as const, error: "validation" };
  }

  if (new Set(ordered_project_ids).size !== ordered_project_ids.length) {
    return { ok: false as const, error: "validation" };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("province_projects")
    .select("id")
    .eq("province_slug", slug);

  if (fetchError) return { ok: false as const, error: fetchError.message };
  if (!existing || existing.length !== ordered_project_ids.length) {
    return { ok: false as const, error: "validation" };
  }

  const existingSet = new Set(existing.map((r) => r.id));
  for (const id of ordered_project_ids) {
    if (!existingSet.has(id)) {
      return { ok: false as const, error: "validation" };
    }
  }

  const updates = ordered_project_ids.map((id, sort_order) =>
    supabase.from("province_projects").update({ sort_order }).eq("id", id).eq("province_slug", slug),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { ok: false as const, error: failed.error.message };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/province-projects");
  return { ok: true as const };
}

function showcaseMetricsFromForm(input: {
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
}) {
  const metrics: { value: string; label: string }[] = [];
  const a = input.stat1_value.trim();
  const b = input.stat1_label.trim();
  if (a && b) metrics.push({ value: a, label: b });
  const c = input.stat2_value.trim();
  const d = input.stat2_label.trim();
  if (c && d) metrics.push({ value: c, label: d });
  return metrics.length ? metrics : null;
}

type SaveHomeShowcaseSlideInput = {
  id: string | null;
  model_id: string;
  sort_order: number;
  hero_image_url: string;
  eyebrow: string;
  lead: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
};

export async function saveHomeShowcaseSlide(input: SaveHomeShowcaseSlideInput) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }

  const modelId = input.model_id.trim();
  if (!modelId) {
    return { ok: false as const, error: "validation" };
  }

  const row = {
    model_id: modelId,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    hero_image_url: input.hero_image_url.trim() || null,
    eyebrow: input.eyebrow.trim() || null,
    lead: input.lead.trim() || null,
    metrics: showcaseMetricsFromForm({
      stat1_value: input.stat1_value,
      stat1_label: input.stat1_label,
      stat2_value: input.stat2_value,
      stat2_label: input.stat2_label,
    }),
  };

  if (input.id) {
    const { error } = await supabase.from("home_showcase_slides").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("home_showcase_slides").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidateContent();
  revalidatePath("/dashboard/home-showcase");
  return { ok: true as const };
}

export async function deleteHomeShowcaseSlide(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }
  const { error } = await supabase.from("home_showcase_slides").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateContent();
  revalidatePath("/dashboard/home-showcase");
  return { ok: true as const };
}

type SaveHomeHeroSlideInput = {
  id: string | null;
  sort_order: number;
  image_url: string;
  image_alt: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
  active: boolean;
};

export async function saveHomeHeroSlide(input: SaveHomeHeroSlideInput) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }

  const clean = (v: string) => v.trim() || null;

  const row = {
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    image_url: clean(input.image_url),
    image_alt: clean(input.image_alt),
    eyebrow: clean(input.eyebrow),
    title: clean(input.title),
    highlight: clean(input.highlight),
    subtitle: clean(input.subtitle),
    primary_label: clean(input.primary_label),
    primary_href: clean(input.primary_href),
    secondary_label: clean(input.secondary_label),
    secondary_href: clean(input.secondary_href),
    active: input.active,
  };

  if (!row.title && !row.highlight && !row.subtitle && !row.image_url) {
    return { ok: false as const, error: "validation" };
  }

  if (input.id) {
    const { error } = await supabase.from("home_hero_slides").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("home_hero_slides").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidateContent();
  revalidatePath("/dashboard/home-hero");
  return { ok: true as const };
}

export async function deleteHomeHeroSlide(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false as const, error: "unauthorized" };
  }
  const { error } = await supabase.from("home_hero_slides").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateContent();
  revalidatePath("/dashboard/home-hero");
  return { ok: true as const };
}

export async function reorderHomeHeroSlides(ordered_ids: string[]) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false as const, error: "unauthorized" };

  if (ordered_ids.length === 0 || new Set(ordered_ids).size !== ordered_ids.length) {
    return { ok: false as const, error: "validation" };
  }

  for (let i = 0; i < ordered_ids.length; i++) {
    const { error } = await supabase
      .from("home_hero_slides")
      .update({ sort_order: i })
      .eq("id", ordered_ids[i]);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidateContent();
  revalidatePath("/dashboard/home-hero");
  return { ok: true as const };
}

export async function addModelImage(input: {
  model_id: string;
  image_url: string;
  sort_order: number;
}) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false as const, error: "unauthorized" };

  if (!input.model_id || !input.image_url.trim()) {
    return { ok: false as const, error: "validation" };
  }

  const { error } = await supabase.from("model_images").insert({
    model_id: input.model_id,
    image_url: input.image_url.trim(),
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidateContent();
  revalidatePath("/dashboard/model-images");
  return { ok: true as const };
}

export async function deleteModelImage(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false as const, error: "unauthorized" };

  const { error } = await supabase.from("model_images").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateContent();
  revalidatePath("/dashboard/model-images");
  return { ok: true as const };
}

export async function updateModelImageSortOrder(id: string, sort_order: number) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false as const, error: "unauthorized" };

  const { error } = await supabase.from("model_images").update({ sort_order }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateContent();
  return { ok: true as const };
}

export async function reorderModelImages(model_id: string, ordered_image_ids: string[]) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false as const, error: "unauthorized" };

  if (!model_id || ordered_image_ids.length === 0) {
    return { ok: false as const, error: "validation" };
  }

  if (new Set(ordered_image_ids).size !== ordered_image_ids.length) {
    return { ok: false as const, error: "validation" };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("model_images")
    .select("id")
    .eq("model_id", model_id);

  if (fetchError) return { ok: false as const, error: fetchError.message };
  if (!existing || existing.length !== ordered_image_ids.length) {
    return { ok: false as const, error: "validation" };
  }

  const existingSet = new Set(existing.map((r) => r.id));
  for (const id of ordered_image_ids) {
    if (!existingSet.has(id)) {
      return { ok: false as const, error: "validation" };
    }
  }

  const updates = ordered_image_ids.map((id, sort_order) =>
    supabase.from("model_images").update({ sort_order }).eq("id", id).eq("model_id", model_id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { ok: false as const, error: failed.error.message };
  }

  revalidateContent();
  revalidatePath("/dashboard/model-images");
  return { ok: true as const };
}
