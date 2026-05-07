-- Imagen de fondo del hero en /producto/[slug], independiente de la portada en /flota.
ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS hero_background_image_url TEXT;

COMMENT ON COLUMN public.models.hero_background_image_url IS
  'URL pública (Storage u externa) para el fondo del hero en la ficha del producto; si es NULL se usa cover_image_url y luego la galería.';
