-- Encuadre de la imagen exclusiva del showcase (pan + zoom en el carrusel del home).
ALTER TABLE public.home_showcase_slides
  ADD COLUMN IF NOT EXISTS hero_image_focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS hero_image_focal_y smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS hero_image_zoom numeric(4, 2) NOT NULL DEFAULT 1.00;

COMMENT ON COLUMN public.home_showcase_slides.hero_image_focal_x IS
  'Punto focal horizontal de la imagen showcase (0–100).';
COMMENT ON COLUMN public.home_showcase_slides.hero_image_focal_y IS
  'Punto focal vertical de la imagen showcase (0–100).';
COMMENT ON COLUMN public.home_showcase_slides.hero_image_zoom IS
  'Zoom de la imagen showcase (1 = sin zoom, hasta ~2.5).';
