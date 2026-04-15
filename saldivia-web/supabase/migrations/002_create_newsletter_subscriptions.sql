-- Newsletter signups from the public site (footer form)

CREATE TABLE public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX newsletter_subscriptions_email_lower_key
  ON public.newsletter_subscriptions (lower(trim(email)));

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert newsletter_subscriptions"
  ON public.newsletter_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read newsletter_subscriptions"
  ON public.newsletter_subscriptions
  FOR SELECT
  TO public
  USING (auth.role() = 'authenticated'::text);
