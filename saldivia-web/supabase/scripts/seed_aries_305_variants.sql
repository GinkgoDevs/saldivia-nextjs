-- Aries 305 (A305): variantes 4x2 y 4x4
-- Ejecutar después de 011/012 (model_variants).
-- Idempotente: puede correrse más de una vez.

DO $$
DECLARE
  v_model_id UUID;
  v_4x2_id UUID;
  v_4x4_id UUID;
BEGIN
  SELECT id INTO v_model_id FROM public.models WHERE slug = 'aries-305' LIMIT 1;

  IF v_model_id IS NULL THEN
    RAISE EXCEPTION 'No existe el modelo con slug aries-305. Cargá el catálogo base primero.';
  END IF;

  UPDATE public.models
  SET
    name = 'Aries 305',
    description = 'Minibús de la familia Aries. Disponible en tracción 4x2 y 4x4 para turismo, traslados y servicios en ruta o terrenos exigentes.'
  WHERE id = v_model_id;

  DELETE FROM public.products WHERE model_id = v_model_id AND variant_id IS NOT NULL;
  DELETE FROM public.model_general_features WHERE model_id = v_model_id AND variant_id IS NOT NULL;
  DELETE FROM public.model_variants WHERE model_id = v_model_id;

  -- Specs que pasan a ser por variante
  DELETE FROM public.products
  WHERE model_id = v_model_id
    AND spec_key IN ('Tracción', 'Aplicación', 'Configuración');

  INSERT INTO public.model_variants (model_id, code, name, description, is_default, sort_order)
  VALUES
    (
      v_model_id,
      '4x2',
      '4x2',
      'Tracción 4x2 para turismo, receptivo y media distancia en ruta convencional.',
      true,
      0
    ),
    (
      v_model_id,
      '4x4',
      '4x4',
      'Tracción 4x4 para turismo y traslados en terrenos difíciles o rutas no pavimentadas.',
      false,
      1
    )
  ON CONFLICT (model_id, code) DO UPDATE
  SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_default = EXCLUDED.is_default,
    sort_order = EXCLUDED.sort_order;

  SELECT id INTO v_4x2_id FROM public.model_variants WHERE model_id = v_model_id AND code = '4x2';
  SELECT id INTO v_4x4_id FROM public.model_variants WHERE model_id = v_model_id AND code = '4x4';

  -- Specs compartidas (todas las configuraciones)
  DELETE FROM public.products
  WHERE model_id = v_model_id
    AND variant_id IS NULL;

  INSERT INTO public.products (model_id, variant_id, spec_key, spec_value, sort_order)
  SELECT v_model_id, NULL, x.spec_key, x.spec_value, x.sort_order
  FROM (VALUES
    ('Tipo de motor', 'Delantero (Minibús)', 0),
    ('Bodega', '2,9 m³ — acceso posterior y lateral', 1),
    ('Tanque de combustible', '250 lts (opcional 300 lts)', 2),
    ('Chasis compatibles', 'Mercedes Benz LO 916 / Agrale MA 8.7', 3),
    ('Capot cubremotor', 'Sí', 4),
    ('Aire acondicionado', 'Preparación de serie para equipo en techo', 5),
    ('Audio', 'Parlantes de serie; reproductor opcional', 6),
    ('Video', 'Opcional', 7)
  ) AS x(spec_key, spec_value, sort_order);

  -- Specs por variante
  INSERT INTO public.products (model_id, variant_id, spec_key, spec_value, sort_order)
  VALUES
    (v_model_id, v_4x2_id, 'Tracción', '4x2', 0),
    (v_model_id, v_4x2_id, 'Aplicación', 'Turismo / receptivo / media distancia', 1),
    (v_model_id, v_4x2_id, 'Configuración de asientos', 'Turismo', 2),
    (v_model_id, v_4x4_id, 'Tracción', '4x4', 0),
    (v_model_id, v_4x4_id, 'Aplicación', 'Turismo en terrenos difíciles / rutas no pavimentadas', 1),
    (v_model_id, v_4x4_id, 'Configuración de asientos', 'Turismo', 2);

  -- Características compartidas (si no existen, insertar set base A305)
  IF NOT EXISTS (
    SELECT 1 FROM public.model_general_features WHERE model_id = v_model_id AND variant_id IS NULL
  ) THEN
    INSERT INTO public.model_general_features (model_id, variant_id, body, sort_order)
    SELECT v_model_id, NULL, x.body, x.sort_order
    FROM (VALUES
      ('Estructura construida en perfiles tubulares de acero-carbono.', 0),
      ('Puerta de ascenso pantográfica con trabas neumáticas.', 1),
      ('Revestimiento externo en chapas de acero galvanizado y Fiberglass.', 2),
      ('Revestimiento interno con laminados plásticos de alta resistencia, pana al tono, piso revestido en PVC de alto tránsito.', 3),
      ('Amplia bodega con acceso por parte trasera y lateral, revestida en chapa de acero galvanizado estampado y traba neumática.', 4),
      ('Portapaquetes interiores construidos en una sola pieza moldeada con canales de A/C, luces individuales de lectura, parlantes e indicadores de taquilla.', 5),
      ('Asientos reclinables tipo Turismo confeccionados en poliuretano inyectado, panas de uso intensivo y estructura metálica.', 6),
      ('Calefacción por radiadores de agua con forzadores por canales de aluminio.', 7),
      ('Pintura exterior poliuretánica.', 8),
      ('Preparación de serie para la colocación de equipos de A/C en el techo del vehículo.', 9),
      ('Parlantes de serie; reproductores de audio y video opcionales.', 10),
      ('Guanteras porta objetos en zona de chofer.', 11)
    ) AS x(body, sort_order);
  END IF;

  RAISE NOTICE 'Aries 305: variantes 4x2 (%) y 4x4 (%) configuradas.', v_4x2_id, v_4x4_id;
END $$;
