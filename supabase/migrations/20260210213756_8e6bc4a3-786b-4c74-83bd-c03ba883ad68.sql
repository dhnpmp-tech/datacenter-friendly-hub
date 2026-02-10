
-- Waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL CHECK (type IN ('provider', 'renter')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  location_city TEXT,
  hardware_type TEXT[],
  gpu_models TEXT,
  num_units INTEGER,
  monthly_power_cost_sar NUMERIC,
  use_case TEXT,
  gpu_preference TEXT,
  monthly_budget TEXT,
  heard_from TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted'))
);

-- Page analytics table
CREATE TABLE public.page_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event TEXT NOT NULL CHECK (event IN ('page_view', 'cta_click', 'form_start', 'form_submit')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Waitlist: public can INSERT
CREATE POLICY "Anyone can submit to waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Waitlist: only authenticated can SELECT
CREATE POLICY "Authenticated users can view waitlist"
  ON public.waitlist FOR SELECT
  TO authenticated
  USING (true);

-- Waitlist: only authenticated can UPDATE
CREATE POLICY "Authenticated users can update waitlist"
  ON public.waitlist FOR UPDATE
  TO authenticated
  USING (true);

-- Waitlist: only authenticated can DELETE
CREATE POLICY "Authenticated users can delete waitlist"
  ON public.waitlist FOR DELETE
  TO authenticated
  USING (true);

-- Page analytics: public can INSERT
CREATE POLICY "Anyone can log analytics"
  ON public.page_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Page analytics: only authenticated can SELECT
CREATE POLICY "Authenticated users can view analytics"
  ON public.page_analytics FOR SELECT
  TO authenticated
  USING (true);
