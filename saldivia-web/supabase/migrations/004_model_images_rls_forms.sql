-- model_images: galería por modelo (URL pública o Storage)
-- Idempotente: re-ejecutar no falla si ya se aplicó antes.
-- Requisito: models, products, contacts, service_requests (ver 001_initial_schema.sql).
-- Si falta "locations", el bloque de abajo se omite: ejecutá 001 o crea la tabla y volvé a correr solo ese bloque.

CREATE TABLE IF NOT EXISTS public.model_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS model_images_model_id_idx ON public.model_images (model_id);

-- Ampliar segmentos (p. ej. Truck / logística bajo "especiales")
ALTER TABLE public.models DROP CONSTRAINT IF EXISTS models_segment_check;
ALTER TABLE public.models
  ADD CONSTRAINT models_segment_check
  CHECK (segment IN ('urbano', 'interurbano', 'interprovincial', 'especiales'));

ALTER TABLE public.model_images ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo imágenes de modelos activos
DROP POLICY IF EXISTS "Public read model_images for active models" ON public.model_images;
CREATE POLICY "Public read model_images for active models"
  ON public.model_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.models m
      WHERE m.id = model_images.model_id
        AND m.active = true
    )
  );

DROP POLICY IF EXISTS "Staff manage model_images" ON public.model_images;
CREATE POLICY "Staff manage model_images"
  ON public.model_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas staff sobre contenido (además de lectura pública existente)
DROP POLICY IF EXISTS "Staff manage models" ON public.models;
CREATE POLICY "Staff manage models"
  ON public.models
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage products" ON public.products;
CREATE POLICY "Staff manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Solo si public.locations existe (si no, correr antes supabase/migrations/001_initial_schema.sql)
DO $$
BEGIN
  IF to_regclass('public.locations') IS NOT NULL THEN
    ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
    EXECUTE 'DROP POLICY IF EXISTS "Staff manage locations" ON public.locations';
    EXECUTE $sql$
      CREATE POLICY "Staff manage locations"
        ON public.locations
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true)
    $sql$;
  END IF;
END
$$;

-- Formularios públicos
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contacts" ON public.contacts;
CREATE POLICY "Public insert contacts"
  ON public.contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Staff read contacts" ON public.contacts;
CREATE POLICY "Staff read contacts"
  ON public.contacts
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Public insert service_requests" ON public.service_requests;
CREATE POLICY "Public insert service_requests"
  ON public.service_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Staff read service_requests" ON public.service_requests;
CREATE POLICY "Staff read service_requests"
  ON public.service_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Storage: assets públicos (imágenes de modelos, PDFs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  15728640,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read media objects" ON storage.objects;
CREATE POLICY "Public read media objects"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Auth upload media" ON storage.objects;
CREATE POLICY "Auth upload media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Auth update own media" ON storage.objects;
CREATE POLICY "Auth update own media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Auth delete own media" ON storage.objects;
CREATE POLICY "Auth delete own media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');
