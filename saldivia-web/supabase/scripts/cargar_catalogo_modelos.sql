-- =============================================================================
-- Catálogo modelos: esquema + datos alineados a docs/modelos.md
-- Ejecutar en Supabase → SQL Editor (todo el archivo).
-- ATENCIÓN: la sección § datos borra y reinserta specs y características solo para
-- los slugs listados en §3; el resto de modelos no se toca.
-- =============================================================================

-- §1 Esquema (idempotente; equivalente a migrations/009_model_general_features.sql)
CREATE TABLE IF NOT EXISTS public.model_general_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS model_general_features_model_id_idx
  ON public.model_general_features(model_id);

ALTER TABLE public.model_general_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read model_general_features for active models" ON public.model_general_features;
CREATE POLICY "Public read model_general_features for active models"
  ON public.model_general_features
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.models m
      WHERE m.id = model_general_features.model_id
        AND m.active = true
    )
  );

DROP POLICY IF EXISTS "Staff manage model_general_features" ON public.model_general_features;
CREATE POLICY "Staff manage model_general_features"
  ON public.model_general_features
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- §2 Modelos que a veces no vienen en seed clásico
INSERT INTO public.models (slug, name, segment, description, sort_order, active)
VALUES
  (
    'aries-325-hd',
    'Aries 325 HD',
    'especiales',
    'Versión especial del Aries 325 en configuración 4×4, desarrollada para condiciones de uso extremas donde los buses convencionales no pueden llegar.',
    60,
    true
  ),
  (
    'a345-motor-delantero',
    'A345 — Motor delantero',
    'interurbano',
    'Uso ideal para circuitos ciudadanos, servicios receptivos, traslados de personal, intermedias, media y larga distancia en llano, caminos de montaña y ripio.',
    61,
    true
  ),
  (
    'a325-motor-delantero',
    'A325 — Motor delantero',
    'interurbano',
    'Uso ideal para circuitos ciudadanos, servicios receptivos, traslados de personal, intermedias y media distancia en llano, caminos de montaña y ripio.',
    62,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  segment = EXCLUDED.segment,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- §3 Reset de contenido dinámico (solo estos slugs; coincide con docs/modelos.md)
WITH target AS (
  SELECT id
  FROM public.models
  WHERE slug IN (
    'aries-365',
    'aries-345',
    'aries-330',
    'aries-truck',
    'aries-325-hd',
    'a345-motor-delantero',
    'a325-motor-delantero',
    'aries-305'
  )
)
DELETE FROM public.model_general_features WHERE model_id IN (SELECT id FROM target);

WITH target AS (
  SELECT id
  FROM public.models
  WHERE slug IN (
    'aries-365',
    'aries-345',
    'aries-330',
    'aries-truck',
    'aries-325-hd',
    'a345-motor-delantero',
    'a325-motor-delantero',
    'aries-305'
  )
)
DELETE FROM public.products WHERE model_id IN (SELECT id FROM target);

-- §4 Especificaciones técnicas (tabla products)
INSERT INTO public.products (model_id, spec_key, spec_value, sort_order)
SELECT m.id, x.k, x.v, x.ord
FROM (VALUES
  ('aries-365', 'Longitud aprox.', '~13,65 m', 0),
  ('aries-365', 'Bodega', '1.200 dm³ — pasante, acceso bilateral', 1),
  ('aries-365', 'Tipo de motor', 'Trasero', 2),
  ('aries-365', 'Uso ideal', 'Media y larga distancia', 3),
  ('aries-365', 'Configuración de asientos', 'Turismo / Semicama / Ejecutivo', 4),
  ('aries-365', 'Sanitario', 'Opcional', 5),
  ('aries-365', 'Cucheta para acompañante', 'Opcional', 6),
  ('aries-365', 'Cámara de retroceso', 'Opcional (sensores de serie)', 7),
  ('aries-345', 'Longitud aprox.', '~13,45 m', 0),
  ('aries-345', 'Bodega', '1.050 dm³ — pasante, acceso bilateral', 1),
  ('aries-345', 'Tipo de motor', 'Trasero', 2),
  ('aries-345', 'Uso ideal', 'Media y larga distancia', 3),
  ('aries-345', 'Configuración de asientos', 'Turismo / Semicama / Ejecutivo', 4),
  ('aries-345', 'Sanitario', 'Opcional', 5),
  ('aries-345', 'Cucheta para acompañante', 'Opcional (solo en bodega; excluida en Argentina)', 6),
  ('aries-345', 'Cámara de retroceso', 'Opcional (sensores de serie)', 7),
  ('aries-330', 'Longitud aprox.', '~12,80 m', 0),
  ('aries-330', 'Tipo de motor', 'Trasero', 1),
  ('aries-330', 'Uso ideal', 'Corta y media distancia', 2),
  ('aries-330', 'Configuración de asientos', 'Turismo / Semicama / Ejecutivo', 3),
  ('aries-330', 'Climatización', 'Calefacción + Aire acondicionado', 4),
  ('aries-330', 'Bodegas', 'Pasantes, acceso bilateral', 5),
  ('aries-330', 'Cámara de retroceso', 'Opcional', 6),
  ('aries-330', 'Video', 'Opcional', 7),
  ('aries-truck', 'Base', 'Sobre chasis de camión (multi-marca)', 0),
  ('aries-truck', 'Uso ideal', 'Montaña, minería, condiciones extremas', 1),
  ('aries-truck', 'Servicios', 'Traslado de personal / turismo', 2),
  ('aries-truck', 'Estructura', 'Reforzada para uso extremo', 3),
  ('aries-truck', 'Adaptabilidad', 'Multi-marca y multi-modelo', 4),
  ('aries-truck', 'Costo operativo', 'Bajo', 5),
  ('aries-325-hd', 'Tracción', '4×4', 0),
  ('aries-325-hd', 'Base', 'Aries 325 (versión reforzada)', 1),
  ('aries-325-hd', 'Uso ideal', 'Montaña, zonas de difícil acceso', 2),
  ('aries-325-hd', 'Estribo', 'Rebatible automáticamente', 3),
  ('aries-325-hd', 'Calefacción', 'Radiadores de agua con forzadores por canales de aluminio', 4),
  ('aries-325-hd', 'Aire acondicionado', 'Preparación de serie para equipo en techo', 5),
  ('aries-325-hd', 'Sellado', 'Especial anti-filtración de agua y polvo', 6),
  ('aries-325-hd', 'Insonorización', 'Especial atención', 7),
  ('a345-motor-delantero', 'Tipo de motor', 'Delantero', 0),
  ('a345-motor-delantero', 'Bodega', '8,55 m³ — pasante, acceso bilateral', 1),
  ('a345-motor-delantero', 'Tanque de combustible', '450 litros — carga por ambos laterales', 2),
  ('a345-motor-delantero', 'Chasis compatibles', 'Mercedes Benz OF 1721 y OF 1724 / Volkswagen 17.230 OD / Volvo B270F / Agrale MA 17', 3),
  ('a345-motor-delantero', 'Puerta del chofer', 'Independiente del pasaje', 4),
  ('a345-motor-delantero', 'Capot cubremotor', 'Sí', 5),
  ('a345-motor-delantero', 'Sanitario', 'Posible inclusión', 6),
  ('a345-motor-delantero', 'Minibar', 'Posible inclusión', 7),
  ('a325-motor-delantero', 'Tipo de motor', 'Delantero', 0),
  ('a325-motor-delantero', 'Bodega', '5,5 m³', 1),
  ('a325-motor-delantero', 'Tanque de combustible', 'Original del chasis', 2),
  ('a325-motor-delantero', 'Chasis compatibles', 'Mercedes Benz OF 1519 y OF 1621 / Volkswagen 15.190 OD / Agrale MA 15', 3),
  ('a325-motor-delantero', 'Puerta del chofer', 'Independiente del pasaje', 4),
  ('a325-motor-delantero', 'Capot cubremotor', 'Sí', 5),
  ('a325-motor-delantero', 'Sanitario', 'Posible inclusión', 6),
  ('a325-motor-delantero', 'Minibar', 'Posible inclusión', 7),
  ('aries-305', 'Tipo de motor', 'Delantero (Minibús)', 0),
  ('aries-305', 'Bodega', '2,9 m³ — acceso posterior y lateral', 1),
  ('aries-305', 'Tanque de combustible', '250 lts (opcional 300 lts)', 2),
  ('aries-305', 'Chasis compatibles', 'Mercedes Benz LO 916 / Agrale MA 8.7', 3),
  ('aries-305', 'Capot cubremotor', 'Sí', 4),
  ('aries-305', 'Aire acondicionado', 'Preparación de serie para equipo en techo', 5),
  ('aries-305', 'Audio', 'Parlantes de serie; reproductor opcional', 6),
  ('aries-305', 'Video', 'Opcional', 7)
) AS x(slug, k, v, ord)
JOIN public.models m ON m.slug = x.slug;

-- §5 Características generales (model_general_features)
INSERT INTO public.model_general_features (model_id, body, sort_order)
SELECT m.id, x.body, x.ord
FROM (VALUES
  ('aries-365', 'Estructura construida en perfiles tubulares de acero-carbono.', 0),
  ('aries-365', 'Puerta de ascenso pantográfica con trabas neumáticas.', 1),
  ('aries-365', 'Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 2),
  ('aries-365', 'Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 3),
  ('aries-365', 'Bodegas pasantes con acceso por ambos laterales, revestidas en chapa de acero galvanizado estampado y traba neumática.', 4),
  ('aries-365', 'Portapaquetes interiores construidos en una sola pieza moldeada con canales de distribución de aire acondicionado, luces individuales de lectura, parlantes e indicadores de taquilla.', 5),
  ('aries-365', 'Asientos reclinables tipo Turismo, Semicama o Ejecutivo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 6),
  ('aries-365', 'Interior climatizado por calefacción y aire acondicionado.', 7),
  ('aries-365', 'Pintura exterior poliuretánica.', 8),
  ('aries-365', 'Instalación de sistema de audio de serie; video opcional.', 9),
  ('aries-365', 'Sensores de retroceso de serie; cámara trasera para maniobras opcional.', 10),
  ('aries-365', 'Guanteras porta objetos en zona de chofer.', 11),
  ('aries-365', 'Cucheta para acompañante opcional.', 12),
  ('aries-345', 'Estructura construida en perfiles tubulares de acero-carbono.', 0),
  ('aries-345', 'Puerta de ascenso pantográfica con trabas neumáticas.', 1),
  ('aries-345', 'Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 2),
  ('aries-345', 'Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 3),
  ('aries-345', 'Bodegas pasantes con acceso por ambos laterales, revestidas en chapa de acero galvanizado estampado y traba neumática.', 4),
  ('aries-345', 'Portapaquetes interiores construidos en una sola pieza moldeada con canales de A/C, luces individuales de lectura, parlantes e indicadores de taquilla.', 5),
  ('aries-345', 'Asientos reclinables tipo Turismo, Semicama o Ejecutivo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 6),
  ('aries-345', 'Interior climatizado por calefacción y aire acondicionado.', 7),
  ('aries-345', 'Pintura exterior poliuretánica.', 8),
  ('aries-345', 'Instalación de sistema de audio de serie; video opcional.', 9),
  ('aries-345', 'Sensores de retroceso de serie; cámara trasera para maniobras opcional.', 10),
  ('aries-345', 'Guanteras porta objetos en zona de chofer.', 11),
  ('aries-330', 'Estructura construida en perfiles tubulares de acero-carbono.', 0),
  ('aries-330', 'Puerta de ascenso pantográfica con trabas neumáticas.', 1),
  ('aries-330', 'Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 2),
  ('aries-330', 'Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 3),
  ('aries-330', 'Bodegas pasantes con acceso en ambos laterales, revestidas en chapa de acero galvanizado estampado y traba neumática.', 4),
  ('aries-330', 'Portapaquetes interiores con canales de distribución de A/C, luces individuales de lectura, parlantes e indicadores de taquilla.', 5),
  ('aries-330', 'Asientos reclinables tipo Turismo, Semicama o Ejecutivo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 6),
  ('aries-330', 'Interior climatizado por calefacción y aire acondicionado.', 7),
  ('aries-330', 'Pintura exterior poliuretánica.', 8),
  ('aries-330', 'Instalación de sistema de audio de serie; video opcional.', 9),
  ('aries-330', 'Sensores de retroceso y cámara trasera para maniobras opcionales.', 10),
  ('aries-330', 'Guanteras porta objetos en zona de chofer.', 11),
  ('aries-truck', 'Estructura y componentes reforzados para contextos de uso en condiciones extremas.', 0),
  ('aries-truck', 'Adaptable a diferentes marcas y modelos de camiones disponibles en el mercado.', 1),
  ('aries-truck', 'Versátil: habilitado para traslado de personal o servicio turístico en zonas de montaña.', 2),
  ('aries-truck', 'Bajo costo operativo respecto a vehículos especializados equivalentes.', 3),
  ('aries-truck', 'Diseñado para operar donde los buses convencionales no pueden llegar.', 4),
  ('aries-325-hd', 'Estructura reforzada para condiciones de uso extremo.', 0),
  ('aries-325-hd', 'Puerta de ascenso pantográfica con trabas neumáticas.', 1),
  ('aries-325-hd', 'Estribo rebatible automáticamente.', 2),
  ('aries-325-hd', 'Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 3),
  ('aries-325-hd', 'Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 4),
  ('aries-325-hd', 'Especial atención en sellado por filtraciones de agua y polvo, e insonorización.', 5),
  ('aries-325-hd', 'Asientos reclinables tipo Turismo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 6),
  ('aries-325-hd', 'Calefacción por radiadores de agua con forzadores por canales de aluminio.', 7),
  ('aries-325-hd', 'Pintura exterior poliuretánica.', 8),
  ('aries-325-hd', 'Preparación de serie para la colocación de equipos de A/C en el techo del vehículo.', 9),
  ('aries-325-hd', 'Instalación de sistema de audio de serie; video opcional.', 10),
  ('aries-325-hd', 'Guanteras porta objetos en zona de chofer.', 11),
  ('a345-motor-delantero', 'Estructura construida en perfiles tubulares de acero-carbono.', 0),
  ('a345-motor-delantero', 'Puerta de ascenso pantográfica con trabas neumáticas.', 1),
  ('a345-motor-delantero', 'Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 2),
  ('a345-motor-delantero', 'Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 3),
  ('a345-motor-delantero', 'Especial atención en sellado por filtraciones de agua y polvo e insonorización; capa externa e interna con aislantes intermedios.', 4),
  ('a345-motor-delantero', 'Bodegas pasantes con acceso en ambos laterales (reducida solo por larguero de chasis), revestidas en chapa de acero galvanizado estampado y traba neumática.', 5),
  ('a345-motor-delantero', 'Portapaquetes interiores construidos en una sola pieza moldeada con canales de A/C, luces individuales de lectura, parlantes e indicadores de taquilla.', 6),
  ('a345-motor-delantero', 'Asientos reclinables tipo Turismo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 7),
  ('a345-motor-delantero', 'Calefacción por radiadores de agua con forzadores por canales de aluminio.', 8),
  ('a345-motor-delantero', 'Pintura exterior poliuretánica.', 9),
  ('a345-motor-delantero', 'Preparación de serie para la colocación de equipos de A/C en el techo del vehículo.', 10),
  ('a345-motor-delantero', 'Instalación de sistema de audio de serie; video opcional.', 11),
  ('a345-motor-delantero', 'Guanteras porta objetos en zona de chofer.', 12),
  ('a325-motor-delantero', 'Estructura construida en perfiles tubulares de acero-carbono.', 0),
  ('a325-motor-delantero', 'Puerta de ascenso pantográfica con trabas neumáticas.', 1),
  ('a325-motor-delantero', 'Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 2),
  ('a325-motor-delantero', 'Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 3),
  ('a325-motor-delantero', 'Especial atención en sellado por filtraciones de agua y polvo e insonorización; capa externa e interna con aislantes intermedios.', 4),
  ('a325-motor-delantero', 'Bodegas pasantes con acceso en ambos laterales (reducida solo por larguero de chasis), revestidas en chapa de acero galvanizado estampado y traba neumática.', 5),
  ('a325-motor-delantero', 'Portapaquetes interiores construidos en una sola pieza moldeada con canales de A/C, luces individuales de lectura, parlantes e indicadores de taquilla.', 6),
  ('a325-motor-delantero', 'Asientos reclinables tipo Turismo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 7),
  ('a325-motor-delantero', 'Calefacción por radiadores de agua con forzadores por canales de aluminio.', 8),
  ('a325-motor-delantero', 'Pintura exterior poliuretánica.', 9),
  ('a325-motor-delantero', 'Preparación de serie para la colocación de equipos de A/C en el techo del vehículo.', 10),
  ('a325-motor-delantero', 'Instalación de sistema de audio de serie; video opcional.', 11),
  ('a325-motor-delantero', 'Guanteras porta objetos en zona de chofer.', 12),
  ('aries-305', 'Estructura construida en perfiles tubulares de acero-carbono.', 0),
  ('aries-305', 'Puerta de ascenso pantográfica con trabas neumáticas.', 1),
  ('aries-305', 'Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 2),
  ('aries-305', 'Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 3),
  ('aries-305', 'Amplia bodega con acceso por parte trasera y lateral, revestida en chapa de acero galvanizado estampado y traba neumática.', 4),
  ('aries-305', 'Portapaquetes interiores construidos en una sola pieza moldeada con canales de A/C, luces individuales de lectura, parlantes e indicadores de taquilla.', 5),
  ('aries-305', 'Asientos reclinables tipo Turismo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 6),
  ('aries-305', 'Calefacción por radiadores de agua con forzadores por canales de aluminio.', 7),
  ('aries-305', 'Pintura exterior poliuretánica.', 8),
  ('aries-305', 'Preparación de serie para la colocación de equipos de A/C en el techo del vehículo.', 9),
  ('aries-305', 'Parlantes de serie; reproductores de audio y video opcionales.', 10),
  ('aries-305', 'Guanteras porta objetos en zona de chofer.', 11)
) AS x(slug, body, ord)
JOIN public.models m ON m.slug = x.slug;
