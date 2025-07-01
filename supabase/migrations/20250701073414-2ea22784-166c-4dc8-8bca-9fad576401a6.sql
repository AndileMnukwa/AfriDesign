
-- Enhanced posters table with comprehensive metadata
ALTER TABLE posters ADD COLUMN IF NOT EXISTS content JSONB;
ALTER TABLE posters ADD COLUMN IF NOT EXISTS visual_settings JSONB;
ALTER TABLE posters ADD COLUMN IF NOT EXISTS performance_score FLOAT;
ALTER TABLE posters ADD COLUMN IF NOT EXISTS export_formats TEXT[];
ALTER TABLE posters ADD COLUMN IF NOT EXISTS social_shares INTEGER DEFAULT 0;

-- Enhanced profiles table with business intelligence
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'english';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brand_personality TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cultural_context TEXT;

-- Create analytics table for business intelligence
CREATE TABLE IF NOT EXISTS poster_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poster_id UUID REFERENCES posters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view', 'download', 'share', 'convert'
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for analytics
ALTER TABLE poster_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics
CREATE POLICY "Users can view their own analytics" 
  ON poster_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" 
  ON poster_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, currency, features, limits) VALUES
('Free', 0.00, 'ZAR', 
 '{"basic_templates": true, "watermarked_exports": true, "standard_support": true}',
 '{"posters_per_month": 2, "invoices_per_month": 2, "export_formats": ["jpg"], "templates": 5}'
),
('Hustler', 99.00, 'ZAR',
 '{"premium_templates": true, "hd_exports": true, "no_watermark": true, "priority_support": true}',
 '{"posters_per_month": -1, "invoices_per_month": -1, "export_formats": ["jpg", "png", "pdf"], "templates": 25}'
),
('Business', 199.00, 'ZAR',
 '{"white_label": true, "analytics_dashboard": true, "api_access": true, "custom_branding": true}',
 '{"posters_per_month": -1, "invoices_per_month": -1, "export_formats": ["jpg", "png", "pdf", "svg"], "templates": -1}'
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON user_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
  ON user_subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
  ON user_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);
