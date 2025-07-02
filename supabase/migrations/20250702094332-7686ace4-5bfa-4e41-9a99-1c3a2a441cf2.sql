-- Add missing form fields to posters table for complete data storage
ALTER TABLE public.posters 
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS brand_personality TEXT,
ADD COLUMN IF NOT EXISTS cultural_context TEXT,
ADD COLUMN IF NOT EXISTS custom_images JSONB DEFAULT '[]'::jsonb;

-- Create subscribers table for premium subscription management
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  subscription_end TIMESTAMPTZ,
  monthly_posters_used INTEGER DEFAULT 0,
  monthly_invoices_used INTEGER DEFAULT 0,
  usage_reset_date TIMESTAMPTZ DEFAULT date_trunc('month', now()) + interval '1 month',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Users can view their own subscription" ON public.subscribers
  FOR SELECT
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Edge functions can insert subscription" ON public.subscribers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Edge functions can update subscription" ON public.subscribers
  FOR UPDATE
  USING (true);

-- Create function to reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset usage counters if we've passed the reset date
  IF NEW.usage_reset_date <= now() THEN
    NEW.monthly_posters_used = 0;
    NEW.monthly_invoices_used = 0;
    NEW.usage_reset_date = date_trunc('month', now()) + interval '1 month';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-reset usage
CREATE TRIGGER reset_usage_trigger
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION reset_monthly_usage();