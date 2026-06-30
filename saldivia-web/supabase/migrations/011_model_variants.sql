-- Configuraciones / variantes por modelo (ej. Aries 305: 4x2, 4x4).
-- Specs y características con variant_id NULL son compartidas; con variant_id aplican a esa variante.

CREATE TABLE IF NOT EXISTS public.model_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT model_variants_model_code_unique UNIQUE (model_id, code)
);

CREATE INDEX IF NOT EXISTS model_variants_model_id_idx ON public.model_variants(model_id);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.model_variants(id) ON DELETE CASCADE;

ALTER TABLE public.model_general_features
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.model_variants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS products_variant_id_idx ON public.products(variant_id);
CREATE INDEX IF NOT EXISTS model_general_features_variant_id_idx ON public.model_general_features(variant_id);

ALTER TABLE public.model_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read model_variants for active models" ON public.model_variants;
CREATE POLICY "Public read model_variants for active models"
  ON public.model_variants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.models m
      WHERE m.id = model_variants.model_id AND m.active = true
    )
  );

DROP POLICY IF EXISTS "Staff manage model_variants" ON public.model_variants;
CREATE POLICY "Staff manage model_variants"
  ON public.model_variants
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
