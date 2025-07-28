-- Fix remaining security function issues by properly setting search_path

-- Fix function search path issues by setting the parameter correctly
CREATE OR REPLACE FUNCTION public.handle_subscription_operations()
RETURNS TRIGGER AS $$
BEGIN
  -- This function allows edge functions to perform operations on subscribers
  -- while maintaining security
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Also fix the existing functions with SET parameter
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;