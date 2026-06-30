-- Repara model_variants si la tabla existía antes sin todas las columnas
-- (CREATE TABLE IF NOT EXISTS en 011 no agrega columnas faltantes).

CREATE TABLE IF NOT EXISTS public.model_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE
);

ALTER TABLE public.model_variants ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.model_variants ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.model_variants ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.model_variants ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
ALTER TABLE public.model_variants ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.model_variants ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

UPDATE public.model_variants
SET code = COALESCE(NULLIF(trim(code), ''), 'variant-' || substr(id::text, 1, 8))
WHERE code IS NULL OR trim(code) = '';

UPDATE public.model_variants
SET name = COALESCE(NULLIF(trim(name), ''), code)
WHERE name IS NULL OR trim(name) = '';

UPDATE public.model_variants SET is_default = false WHERE is_default IS NULL;
UPDATE public.model_variants SET sort_order = 0 WHERE sort_order IS NULL;
UPDATE public.model_variants SET created_at = now() WHERE created_at IS NULL;

ALTER TABLE public.model_variants ALTER COLUMN code SET NOT NULL;
ALTER TABLE public.model_variants ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.model_variants ALTER COLUMN is_default SET NOT NULL;
ALTER TABLE public.model_variants ALTER COLUMN is_default SET DEFAULT false;
ALTER TABLE public.model_variants ALTER COLUMN sort_order SET NOT NULL;
ALTER TABLE public.model_variants ALTER COLUMN sort_order SET DEFAULT 0;
ALTER TABLE public.model_variants ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE public.model_variants ALTER COLUMN created_at SET DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'model_variants_model_code_unique'
  ) THEN
    ALTER TABLE public.model_variants
      ADD CONSTRAINT model_variants_model_code_unique UNIQUE (model_id, code);
  END IF;
END $$;

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
