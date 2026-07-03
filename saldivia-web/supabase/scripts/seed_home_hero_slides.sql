-- Carga las 3 slides originales del hero como filas editables desde /dashboard/home-hero.
-- Requiere haber corrido antes la migración 014_home_hero_slides.sql.
-- Solo inserta si la tabla está vacía, para no duplicar contenido ya cargado.

INSERT INTO public.home_hero_slides (
  sort_order, image_url, image_alt, eyebrow, title, highlight, subtitle,
  primary_label, primary_href, secondary_label, secondary_href, active
)
SELECT * FROM (
  VALUES
    (
      0,
      '/background.png',
      'Unidad Saldivia Aries en ruta',
      'Ingeniería de clase mundial',
      'Nuevo ARIES',
      '405 DD',
      'Redefiniendo los estándares del transporte de pasajeros: potencia, seguridad y presencia imponente con el sello industrial Saldivia.',
      'Explorar modelos', '/flota',
      'Tour industrial', '/nosotros',
      true
    ),
    (
      1,
      '/saldivia/soldadura.jpg',
      'Proceso de soldadura certificado en planta Saldivia',
      'Fabricación nacional certificada',
      'Precisión en',
      'cada soldadura',
      'Procesos de manufactura controlados, materiales de primera calidad y estrictos estándares industriales en cada etapa de producción.',
      'Conocer la empresa', '/nosotros',
      'Solicitar visita', '/contacto',
      true
    ),
    (
      2,
      '/hero-buses.png',
      'Flota completa de buses Saldivia',
      'Flota completa para cada operación',
      'De la ciudad',
      'a la ruta',
      'Soluciones para cada tipo de operación, con el mismo compromiso de ingeniería y durabilidad en cada carrocería.',
      'Ver catálogo completo', '/flota',
      'Contacto', '/contacto',
      true
    )
) AS v(
  sort_order, image_url, image_alt, eyebrow, title, highlight, subtitle,
  primary_label, primary_href, secondary_label, secondary_href, active
)
WHERE NOT EXISTS (SELECT 1 FROM public.home_hero_slides);
