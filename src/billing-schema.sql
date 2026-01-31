-- Billing Tables for Mywoki Subscription Management

-- Subscription plans table
CREATE TABLE subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'month',
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  tool_limit TEXT NOT NULL,
  support TEXT NOT NULL,
  team_members TEXT NOT NULL,
  max_tools INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT REFERENCES subscription_plans(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')) DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) + INTERVAL '1 month',
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  paystack_subscription_id TEXT,
  paystack_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Payment methods table
CREATE TABLE payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  paystack_auth_code TEXT NOT NULL,
  last4 TEXT NOT NULL,
  brand TEXT NOT NULL,
  expiry_month INTEGER NOT NULL,
  expiry_year INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Billing history table
CREATE TABLE billing_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT CHECK (status IN ('paid', 'pending', 'failed')) DEFAULT 'paid',
  paystack_reference TEXT,
  description TEXT,
  billed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "subscription_plans_select" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "payment_methods_select" ON payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payment_methods_insert" ON payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payment_methods_update" ON payment_methods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "payment_methods_delete" ON payment_methods FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "billing_history_select" ON billing_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "billing_history_insert" ON billing_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert subscription plans
INSERT INTO subscription_plans (id, name, description, price, features, tool_limit, support, team_members, max_tools) VALUES
('starter', 'Starter', 'Perfect for individuals getting started', 0.00, ARRAY['Access to marketplace tools', 'Basic analytics', 'Email support', 'Community access'], '1 active tool', 'Basic', '1', 1),
('professional', 'Professional', 'For growing teams and businesses', 79.99, ARRAY['Everything in Starter', 'Advanced analytics', 'Priority support', 'Team collaboration', 'API access'], '20 active tools', 'Priority', '5', 20),
('business', 'Business', 'For large organizations', 199.99, ARRAY['Everything in Professional', 'Unlimited tools', '24/7 premium support', 'Custom integrations', 'Dedicated account manager'], 'Unlimited', '24/7 Premium', 'Unlimited', -1);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);
