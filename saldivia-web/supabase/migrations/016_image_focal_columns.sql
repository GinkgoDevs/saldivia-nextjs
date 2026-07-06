-- Encuadre (pan + zoom) para el resto de imágenes editables en el admin.

ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS cover_image_focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS cover_image_focal_y smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS cover_image_zoom numeric(4, 2) NOT NULL DEFAULT 1.00;

ALTER TABLE public.model_images
  ADD COLUMN IF NOT EXISTS focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS focal_y smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS zoom numeric(4, 2) NOT NULL DEFAULT 1.00;

ALTER TABLE public.home_hero_slides
  ADD COLUMN IF NOT EXISTS image_focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS image_focal_y smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS image_zoom numeric(4, 2) NOT NULL DEFAULT 1.00;

ALTER TABLE public.province_projects
  ADD COLUMN IF NOT EXISTS image_focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS image_focal_y smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS image_zoom numeric(4, 2) NOT NULL DEFAULT 1.00;
