-- Flag para elegir qué modelos aparecen en el "Showcase técnico" del home.
-- Se administra con un checkbox por modelo en /dashboard/models.

ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS show_in_showcase BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS models_show_in_showcase_idx
  ON public.models(show_in_showcase)
  WHERE show_in_showcase = true;
