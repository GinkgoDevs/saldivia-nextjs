-- 004 declara public.model_images(…, image_url, …) pero
-- "CREATE TABLE IF NOT EXISTS" no aplica a tablas ya creadas con otra forma.
-- Esto alinea con seed.sql, RLS 004 y lib/supabase/model-detail.ts.

DO $m$
BEGIN
  IF to_regclass('public.model_images') IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'model_images'
      AND column_name = 'image_url'
  ) THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'model_images'
      AND column_name = 'url'
  ) THEN
    ALTER TABLE public.model_images RENAME COLUMN url TO image_url;
    RETURN;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'model_images'
      AND column_name = 'src'
  ) THEN
    ALTER TABLE public.model_images RENAME COLUMN src TO image_url;
    RETURN;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'model_images'
      AND column_name = 'file_url'
  ) THEN
    ALTER TABLE public.model_images RENAME COLUMN file_url TO image_url;
    RETURN;
  END IF;

  -- Tabla manual sin columna de URL previa: añadimos la que usa la app/seed
  ALTER TABLE public.model_images ADD COLUMN image_url text;
END
$m$;
