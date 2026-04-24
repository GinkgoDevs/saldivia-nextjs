-- Seed de desarrollo: ejecutar en SQL Editor de Supabase o con psql tras migraciones.
-- Idempotente: modelos por ON CONFLICT (slug); alinear con supabase/models_rows.csv.
-- products / model_images: solo filas faltantes (NOT EXISTS).
-- Nota: slugs viejos del seed previo (p. ej. aries-325, truck) no se eliminan automáticamente.
-- Si model_images se creó sin image_url (p. ej. con columna "url"), alinear (ver migrations/006_*.sql)
DO $align_model_images$
BEGIN
  IF to_regclass('public.model_images') IS NULL THEN
    RETURN;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'model_images' AND column_name = 'image_url'
  ) THEN
    RETURN;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'model_images' AND column_name = 'url'
  ) THEN
    ALTER TABLE public.model_images RENAME COLUMN url TO image_url;
    RETURN;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'model_images' AND column_name = 'src'
  ) THEN
    ALTER TABLE public.model_images RENAME COLUMN src TO image_url;
    RETURN;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'model_images' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE public.model_images RENAME COLUMN file_url TO image_url;
    RETURN;
  END IF;
  ALTER TABLE public.model_images ADD COLUMN image_url text;
END
$align_model_images$;

INSERT INTO public.models (id, slug, name, segment, description, cover_image_url, pdf_url, sort_order, active)
VALUES
  (
    '964b9503-974e-47d6-893f-b24caec02e41'::uuid,
    'aries-305',
    'Aries 305',
    'interprovincial',
    'Bus versátil de la familia Aries. Disponible en versiones turismo 4x2, 4x4 y urbano para adaptarse a distintos servicios y rutas.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    1,
    true
  ),
  (
    '4aab5380-8cc3-429a-8faf-170b92aacfe3'::uuid,
    'aries-315',
    'Aries 315',
    'urbano',
    'Unidad urbana de alta eficiencia disponible en versión Diesel y GNC. Diseñada para servicios urbanos de alta frecuencia.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    2,
    true
  ),
  (
    'adc4c7da-9b4f-4733-8be8-a2d6f6a48673'::uuid,
    'aries-330',
    'Aries 330',
    'interurbano',
    'Modelo interurbano con tres configuraciones de motorización: trasero, delantero y delantero 4x4 para rutas exigentes.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    3,
    true
  ),
  (
    '6b601b9d-1e7d-4775-b510-09c19977c789'::uuid,
    'aries-345',
    'Aries 345',
    'interurbano',
    'Bus interurbano disponible en dos longitudes: 12 metros y 13,20 metros para distintas capacidades operativas.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    4,
    true
  ),
  (
    '9d82eafc-5696-461b-82b4-77152ef28283'::uuid,
    'aries-365',
    'Aries 365',
    'interprovincial',
    'Uno de los modelos más completos de la familia Aries. Cuatro longitudes disponibles para cubrir cualquier tipo de servicio de larga distancia.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    5,
    true
  ),
  (
    'c98d69f4-84da-47e8-ae6f-ab6b6305b818'::uuid,
    'aries-405',
    'Aries 405',
    'interprovincial',
    'El tope de gama de Saldivia. Bus de larga distancia premium disponible en versiones Dual, Ejecutivo y Suite.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    6,
    true
  ),
  (
    '93d9e81e-0616-41c8-86e8-0778bd45ebbc'::uuid,
    'aries-truck',
    'Aries Truck',
    'interprovincial',
    'Vehículo de trabajo pesado para servicios mineros, petroleros y traslado de personal en terrenos exigentes. Versiones 4x4 y 6x4.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    7,
    true
  ),
  (
    'ef37349f-8e2f-4bdc-a563-f956700aabbb'::uuid,
    'aries-truck-mini',
    'Aries Truck Mini',
    'interprovincial',
    'Versión compacta del Truck para servicios en rutas y terrenos difíciles.',
    'https://saldiviabuses.com.ar/wp-content/uploads/2019/09/365-web-2022-01.jpg',
    NULL,
    8,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  segment = EXCLUDED.segment,
  description = EXCLUDED.description,
  cover_image_url = EXCLUDED.cover_image_url,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active,
  pdf_url = COALESCE(public.models.pdf_url, EXCLUDED.pdf_url);

-- Especificaciones (por modelo; solo se insertan pares aún inexistentes)
INSERT INTO public.products (model_id, spec_key, spec_value, sort_order)
SELECT m.id, v.spec_key, v.spec_value, v.sort_order
FROM public.models m
CROSS JOIN (VALUES
  ('aries-305', 'Largo', '12,00 m (referencia)', 0),
  ('aries-305', 'Carrocería', 'Estructura perfiles de acero', 1),
  ('aries-305', 'Aplicación', 'Turismo, 4x4, urbano', 2)
) AS v(slug, spec_key, spec_value, sort_order)
WHERE m.slug = v.slug
  AND NOT EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.model_id = m.id AND p.spec_key = v.spec_key
  );

INSERT INTO public.products (model_id, spec_key, spec_value, sort_order)
SELECT m.id, v.spec_key, v.spec_value, v.sort_order
FROM public.models m
CROSS JOIN (VALUES
  ('aries-405', 'Piso', 'Doble piso', 0),
  ('aries-405', 'Climatización', 'Aire acondicionado y calefacción', 1)
) AS v(slug, spec_key, spec_value, sort_order)
WHERE m.slug = v.slug
  AND NOT EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.model_id = m.id AND p.spec_key = v.spec_key
  );

INSERT INTO public.products (model_id, spec_key, spec_value, sort_order)
SELECT m.id, v.spec_key, v.spec_value, v.sort_order
FROM public.models m
CROSS JOIN (VALUES
  ('aries-truck', 'Aplicación', 'Carga, minería e industria', 0)
) AS v(slug, spec_key, spec_value, sort_order)
WHERE m.slug = v.slug
  AND NOT EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.model_id = m.id AND p.spec_key = v.spec_key
  );

-- Galería: portada pública del modelo si aún no hay filas en model_images
INSERT INTO public.model_images (model_id, image_url, sort_order)
SELECT m.id, m.cover_image_url, 0
FROM public.models m
WHERE m.cover_image_url IS NOT NULL
  AND btrim(m.cover_image_url) <> ''
  AND NOT EXISTS (SELECT 1 FROM public.model_images i WHERE i.model_id = m.id);

-- Proyectos por provincia (mapa SVG; province_slug = id en argentinaProvinceMapData.json)
-- Tabla: migrations/005_province_projects.sql — si no está aplicada, se omite sin error.
DO $seed_province_projects$
BEGIN
  IF to_regclass('public.province_projects') IS NULL THEN
    RAISE NOTICE 'Omitido: province_projects no existe. Ejecutar 005_province_projects.sql o equivalente.';
    RETURN;
  END IF;

  INSERT INTO public.province_projects (
    province_slug, title, description, location_label, segment, year, sort_order, active
  )
  SELECT v.province_slug, v.title, v.description, v.location_label, v.segment, v.year, v.sort_order, true
  FROM (
    VALUES
      (
        'buenos-aires',
        'Renovación de flota de larga distancia',
        'Configuraciones de alta capacidad para operaciones de larga distancia y recambio progresivo de unidades.',
        'AMBA y corredor atlántico',
        'Larga distancia',
        '2025',
        0
      ),
      (
        'buenos-aires',
        'Implementación de servicio ejecutivo',
        'Proyecto orientado a servicios ejecutivos con foco en confort interior y operación intensiva.',
        'La Plata',
        'Ejecutivo',
        '2024',
        1
      ),
      (
        'cordoba',
        'Proyecto interurbano regional',
        'Unidades adaptadas para servicios interurbanos con foco en confort y disponibilidad operativa.',
        'Córdoba Capital',
        'Interurbano',
        '2024',
        0
      ),
      (
        'mendoza',
        'Operación corredor andino',
        'Configuraciones reforzadas para recorridos exigentes y variación térmica.',
        'Gran Mendoza',
        'Especiales',
        '2025',
        0
      ),
      (
        'salta',
        'Servicio para operación minera',
        'Transporte de personal en altura con especificaciones para climas extremos.',
        'Puna salteña',
        'Personal minero',
        '2024',
        0
      ),
      (
        'chubut',
        'Implementación patagónica',
        'Unidades para recorridos extensos en Patagonia con énfasis en postventa.',
        'Trelew y Puerto Madryn',
        'Regional',
        '2025',
        0
      )
  ) AS v(
    province_slug, title, description, location_label, segment, year, sort_order
  )
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.province_projects p
    WHERE p.province_slug = v.province_slug
      AND p.title = v.title
  );
END
$seed_province_projects$;
