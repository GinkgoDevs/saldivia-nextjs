-- Lectura pública (rol anon) para contenido del sitio. Solo filas activas donde aplica.

ALTER TABLE public.models ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon can read active models" ON public.models;
DROP POLICY IF EXISTS "Public read active models" ON public.models;
CREATE POLICY "Public read active models"
  ON public.models
  FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Anon can read products for active models" ON public.products;
DROP POLICY IF EXISTS "Public read products for active models" ON public.products;
CREATE POLICY "Public read products for active models"
  ON public.products
  FOR SELECT
  USING (
    model_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.models m
      WHERE m.id = products.model_id
        AND m.active = true
    )
  );

DROP POLICY IF EXISTS "Anon can read active locations" ON public.locations;
DROP POLICY IF EXISTS "Public read active locations" ON public.locations;
CREATE POLICY "Public read active locations"
  ON public.locations
  FOR SELECT
  USING (active = true);
