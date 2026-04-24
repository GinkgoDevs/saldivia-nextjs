-- Proyectos / presencia por provincia (sin coordenadas; alimenta el mapa SVG)

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
