-- =============================================================================
-- Copiá y pegá esto en: Supabase → SQL Editor → New query → Run
-- Objetivo: tabla province_projects + RLS + dato de prueba (o solo verificar)
-- La migración "oficial" del repo es: migrations/005_province_projects.sql (mismo contenido)
-- =============================================================================

-- 1) Tabla e índices
CREATE TABLE IF NOT EXISTS public.province_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location_label TEXT,
  segment TEXT,
  year TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT province_projects_slug_nonempty CHECK (char_length(trim(province_slug)) > 0)
);

CREATE INDEX IF NOT EXISTS province_projects_slug_idx ON public.province_projects (province_slug);
CREATE INDEX IF NOT EXISTS province_projects_active_idx ON public.province_projects (active);

-- 2) RLS
ALTER TABLE public.province_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active province_projects" ON public.province_projects;
CREATE POLICY "Public read active province_projects"
  ON public.province_projects
  FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Staff manage province_projects" ON public.province_projects;
CREATE POLICY "Staff manage province_projects"
  ON public.province_projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3) Dato de prueba (idempotente: no duplica mismo título en misma provincia)
INSERT INTO public.province_projects (
  province_slug, title, description, location_label, segment, year, sort_order, active
)
SELECT 'cordoba', 'Proyecto test consola', 'Fila de prueba desde SQL Editor.', 'Córdoba Capital', 'Test', '2026', 0, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.province_projects p
  WHERE p.province_slug = 'cordoba' AND p.title = 'Proyecto test consola'
);

-- 4) Ver: debés ver al menos la fila de prueba
SELECT id, province_slug, title, active, created_at
FROM public.province_projects
ORDER BY province_slug, sort_order, title;
