-- Encuadre del hero por modelo (pan + zoom en la ficha /producto/[slug]).
ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS hero_background_focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS hero_background_focal_y smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS hero_background_zoom numeric(4, 2) NOT NULL DEFAULT 1.00;

COMMENT ON COLUMN public.models.hero_background_focal_x IS
  'Punto focal horizontal del hero (0–100).';
COMMENT ON COLUMN public.models.hero_background_focal_y IS
  'Punto focal vertical del hero (0–100).';
COMMENT ON COLUMN public.models.hero_background_zoom IS
  'Zoom del hero (1 = sin zoom, hasta ~2.5).';
