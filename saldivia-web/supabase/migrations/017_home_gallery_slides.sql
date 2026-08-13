-- Galería de innovación del home. Editable desde /dashboard/home-gallery.
-- Si la tabla no existe o la consulta falla, el sitio usa las imágenes estáticas.

CREATE TABLE IF NOT EXISTS public.home_gallery_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS home_gallery_slides_sort_idx
  ON public.home_gallery_slides (sort_order);

ALTER TABLE public.home_gallery_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active home_gallery_slides" ON public.home_gallery_slides;
CREATE POLICY "Public read active home_gallery_slides"
  ON public.home_gallery_slides
  FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Staff manage home_gallery_slides" ON public.home_gallery_slides;
CREATE POLICY "Staff manage home_gallery_slides"
  ON public.home_gallery_slides
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Semilla: las 9 fotos actuales, solo si la tabla está vacía.
INSERT INTO public.home_gallery_slides (sort_order, image_url, image_alt, active)
SELECT v.sort_order, v.image_url, v.image_alt, true
FROM (
  VALUES
    (0, '/galeria-innovacion/01-planta.webp', 'Unidades Saldivia en planta de fabricación'),
    (1, '/galeria-innovacion/02-flota-entrega.webp', 'Flota Saldivia lista para entrega'),
    (2, '/galeria-innovacion/03-buses-terminados.webp', 'Buses Saldivia terminados'),
    (3, '/galeria-innovacion/04-aerea-planta.webp', 'Vista aérea de la planta Saldivia'),
    (4, '/galeria-innovacion/05-aerea-instalaciones.webp', 'Vista aérea de las instalaciones Saldivia'),
    (5, '/galeria-innovacion/06-carroceria-elevador.webp', 'Carrocería Saldivia sobre elevador'),
    (6, '/galeria-innovacion/07-linea-produccion.webp', 'Línea de producción y taller Saldivia'),
    (7, '/galeria-innovacion/08-estructura-carroceria.webp', 'Estructura de carrocería en fabricación'),
    (8, '/galeria-innovacion/09-interior-terminado.webp', 'Interior terminado de unidad Saldivia')
) AS v(sort_order, image_url, image_alt)
WHERE NOT EXISTS (SELECT 1 FROM public.home_gallery_slides);
