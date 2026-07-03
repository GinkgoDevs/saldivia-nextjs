-- Slides del hero principal del home: imagen de fondo, textos y dos botones (CTA).
-- Editable desde /dashboard/home-hero. Si la tabla está vacía, el sitio usa slides estáticas.

CREATE TABLE IF NOT EXISTS public.home_hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  image_alt TEXT,
  eyebrow TEXT,
  title TEXT,
  highlight TEXT,
  subtitle TEXT,
  primary_label TEXT,
  primary_href TEXT,
  secondary_label TEXT,
  secondary_href TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS home_hero_slides_sort_idx
  ON public.home_hero_slides (sort_order);

ALTER TABLE public.home_hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active home_hero_slides" ON public.home_hero_slides;
CREATE POLICY "Public read active home_hero_slides"
  ON public.home_hero_slides
  FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Staff manage home_hero_slides" ON public.home_hero_slides;
CREATE POLICY "Staff manage home_hero_slides"
  ON public.home_hero_slides
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
