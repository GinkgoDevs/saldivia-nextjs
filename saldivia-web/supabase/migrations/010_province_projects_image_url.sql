-- Imagen de proyecto (ruta pública, ej. /02  MAPA/CORDOBA/EMPRESA/foto.jpg)

ALTER TABLE public.province_projects
  ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS province_projects_slug_title_uq
  ON public.province_projects (province_slug, title);
