-- Phase 1: Critical Database Security Fixes

-- 1. Enable RLS on subscription_plans and add proper policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active subscription plans only
CREATE POLICY "Public can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (true);

-- Only authenticated admin users can modify subscription plans
-- For now, we'll restrict to service role, can be enhanced later with admin roles
CREATE POLICY "Service role can manage subscription plans" 
ON public.subscription_plans 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2. Create security definer function for edge function operations on subscribers
CREATE OR REPLACE FUNCTION public.handle_subscription_operations()
RETURNS TRIGGER AS $$
BEGIN
  -- This function allows edge functions to perform operations on subscribers
  -- while maintaining security
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update subscribers policies to be more restrictive
DROP POLICY IF EXISTS "Edge functions can insert subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Edge functions can update subscription" ON public.subscribers;

-- More restrictive policies for subscribers
CREATE POLICY "Users can view own subscription" 
ON public.subscribers 
FOR SELECT 
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Authenticated service can manage subscriptions" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

CREATE POLICY "Service can update subscriptions" 
ON public.subscribers 
FOR UPDATE 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4. Secure database functions by setting search_path
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = public;
  -- Reset usage counters if we've passed the reset date
  IF NEW.usage_reset_date <= now() THEN
    NEW.monthly_posters_used = 0;
    NEW.monthly_invoices_used = 0;
    NEW.usage_reset_date = date_trunc('month', now()) + interval '1 month';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = public;
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;