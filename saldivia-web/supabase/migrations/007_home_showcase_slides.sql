-- Slides del showcase técnico del home: cada fila enlaza a un modelo publicado.
CREATE TABLE IF NOT EXISTS public.home_showcase_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  hero_image_url TEXT,
  eyebrow TEXT,
  lead TEXT,
  metrics JSONB
);

CREATE INDEX IF NOT EXISTS home_showcase_slides_sort_idx
  ON public.home_showcase_slides (sort_order);

CREATE INDEX IF NOT EXISTS home_showcase_slides_model_id_idx
  ON public.home_showcase_slides (model_id);

ALTER TABLE public.home_showcase_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read home_showcase for active models" ON public.home_showcase_slides;
CREATE POLICY "Public read home_showcase for active models"
  ON public.home_showcase_slides
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.models m
      WHERE m.id = home_showcase_slides.model_id
        AND m.active = true
    )
  );

DROP POLICY IF EXISTS "Staff manage home_showcase_slides" ON public.home_showcase_slides;
CREATE POLICY "Staff manage home_showcase_slides"
  ON public.home_showcase_slides
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
