-- PDF de política de calidad (sección Nosotros). Una sola fila editable desde /dashboard/quality-policy.

CREATE TABLE IF NOT EXISTS public.quality_policy (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pdf_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.quality_policy (id, pdf_url)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.quality_policy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read quality_policy" ON public.quality_policy;
CREATE POLICY "Public read quality_policy"
  ON public.quality_policy
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff manage quality_policy" ON public.quality_policy;
CREATE POLICY "Staff manage quality_policy"
  ON public.quality_policy
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
