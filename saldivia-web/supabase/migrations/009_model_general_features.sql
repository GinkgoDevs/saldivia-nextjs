-- Características generales por modelo (listados en ficha /producto/[slug]).
-- Las especificaciones técnicas siguen en public.products (spec_key / spec_value).

CREATE TABLE IF NOT EXISTS public.model_general_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS model_general_features_model_id_idx
  ON public.model_general_features(model_id);

ALTER TABLE public.model_general_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read model_general_features for active models" ON public.model_general_features;
CREATE POLICY "Public read model_general_features for active models"
  ON public.model_general_features
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.models m
      WHERE m.id = model_general_features.model_id
        AND m.active = true
    )
  );

DROP POLICY IF EXISTS "Staff manage model_general_features" ON public.model_general_features;
CREATE POLICY "Staff manage model_general_features"
  ON public.model_general_features
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
