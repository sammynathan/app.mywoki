-- Combined Schema for Mywoki Application
-- Run this in your Supabase SQL editor to set up all tables

-- =========================================
-- AUTH SCHEMA
-- =========================================

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  account_type TEXT CHECK (account_type IN ('individual', 'organization')),
  purpose TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  primary_goal TEXT,
  start_preference TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Verification codes table
CREATE TABLE verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code VARCHAR(6) NOT NULL,
  type TEXT CHECK (type IN ('login', 'signup')) DEFAULT 'login',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  INDEX idx_verification_email (email),
  INDEX idx_verification_expires (expires_at)
);

-- Magic links table
CREATE TABLE magic_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  INDEX idx_magic_links_email (email),
  INDEX idx_magic_links_token (token),
  INDEX idx_magic_links_expires (expires_at)
);

-- Login attempts for rate limiting
CREATE TABLE login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  INDEX idx_login_attempts_email (email),
  INDEX idx_login_attempts_created (created_at)
);

-- RLS Policies for auth
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete" ON users FOR DELETE USING (true);

-- Verification codes policies
CREATE POLICY "verification_codes_insert" ON verification_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "verification_codes_select" ON verification_codes FOR SELECT USING (true);
CREATE POLICY "verification_codes_update" ON verification_codes FOR UPDATE USING (true);
CREATE POLICY "verification_codes_delete" ON verification_codes FOR DELETE USING (true);

-- Magic links policies
CREATE POLICY "magic_links_insert" ON magic_links FOR INSERT WITH CHECK (true);
CREATE POLICY "magic_links_select" ON magic_links FOR SELECT USING (true);
CREATE POLICY "magic_links_update" ON magic_links FOR UPDATE USING (true);
CREATE POLICY "magic_links_delete" ON magic_links FOR DELETE USING (true);

-- Login attempts policies
CREATE POLICY "login_attempts_insert" ON login_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "login_attempts_select" ON login_attempts FOR SELECT USING (true);
CREATE POLICY "login_attempts_update" ON login_attempts FOR UPDATE USING (true);
CREATE POLICY "login_attempts_delete" ON login_attempts FOR DELETE USING (true);

-- Create functions
CREATE OR REPLACE FUNCTION check_email_exists(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM users WHERE email = p_email);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_expired_codes()
RETURNS VOID AS $$
BEGIN
  DELETE FROM verification_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- BILLING SCHEMA
-- =========================================

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

-- Enable RLS for billing
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for billing
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

-- Create indexes for billing
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);

-- =========================================
-- DASHBOARD SCHEMA
-- =========================================

-- Tools table
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'zap',
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  activation_code TEXT UNIQUE,
  requires_mywoki_login BOOLEAN DEFAULT FALSE,
  usage_stats JSONB DEFAULT '{"last_used": "", "activations": 0}'::jsonb,
  issues TEXT[] DEFAULT ARRAY[]::TEXT[],
  use_cases TEXT[] DEFAULT ARRAY[]::TEXT[],
  who_its_for TEXT[] DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  setup_steps TEXT[] DEFAULT ARRAY[]::TEXT[],
  faqs JSONB DEFAULT '[]'::jsonb,
  media_items JSONB DEFAULT '[]'::jsonb,
  resource_links JSONB DEFAULT '[]'::jsonb,
  config_fields JSONB DEFAULT '[]'::jsonb,
  hero_image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User tool activations (references your existing users table)
CREATE TABLE user_tool_activations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE NOT NULL,
  activation_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  mywoki_user_id TEXT,
  intent TEXT,
  activated_from TEXT,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_used TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, tool_id)
);

-- Add Mywoki-specific fields to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS mywoki_account_linked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mywoki_user_id TEXT;

-- Enable RLS on new tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tool_activations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tools (anyone can view)
CREATE POLICY "tools_select" ON tools FOR SELECT USING (true);

-- RLS Policies for user tool activations (users can only see their own)
CREATE POLICY "user_tool_activations_select" ON user_tool_activations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_tool_activations_insert" ON user_tool_activations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tool_activations_update" ON user_tool_activations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_tool_activations_delete" ON user_tool_activations FOR DELETE USING (auth.uid() = user_id);

-- Insert sample tools data
INSERT INTO tools (name, description, icon_name, category, activation_code, requires_mywoki_login) VALUES
('Slack Integration', 'Send notifications and automate messages to your Slack workspace', 'slack', 'Communication', 'SLACK-2024-001', FALSE),
('GitHub Automation', 'Automate repository management and CI/CD workflows', 'github', 'Development', 'GITHUB-2024-001', FALSE),
('Google Sheets Sync', 'Synchronize data between your apps and Google Sheets', 'sheets', 'Analytics', 'SHEETS-2024-001', TRUE),
('Email Campaigns', 'Automate email sequences and campaign management', 'email', 'Marketing', 'EMAIL-2024-001', FALSE),
('Stripe Payments', 'Handle payment processing and subscription management', 'stripe', 'Finance', 'STRIPE-2024-001', TRUE),
('Zapier Connector', 'Connect to thousands of apps and create automated workflows', 'zapier', 'Automation', 'ZAPIER-2024-001', FALSE),
('Jira Integration', 'Sync issues and automate project management', 'jira', 'Development', 'JIRA-2024-001', FALSE),
('Notion API', 'Automate Notion databases and pages', 'notion', 'Productivity', 'NOTION-2024-001', TRUE);

-- Create indexes for dashboard
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_active ON tools(is_active);
CREATE INDEX IF NOT EXISTS idx_user_tool_activations_user_id ON user_tool_activations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_activations_tool_id ON user_tool_activations(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_activations_active ON user_tool_activations(is_active);

-- Function to update tool usage stats
CREATE OR REPLACE FUNCTION update_tool_usage_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tools
    SET usage_stats = jsonb_set(
      jsonb_set(usage_stats, '{activations}', ((usage_stats->>'activations')::int + 1)::text::jsonb),
      '{last_used}', to_jsonb(NEW.last_used)::text
    )
    WHERE id = NEW.tool_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.last_used IS DISTINCT FROM NEW.last_used THEN
      UPDATE tools
      SET usage_stats = jsonb_set(usage_stats, '{last_used}', to_jsonb(NEW.last_used)::text)
      WHERE id = NEW.tool_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for usage stats
DROP TRIGGER IF EXISTS trigger_update_tool_usage ON user_tool_activations;
CREATE TRIGGER trigger_update_tool_usage
  AFTER INSERT OR UPDATE ON user_tool_activations
  FOR EACH ROW EXECUTE FUNCTION update_tool_usage_stats();

-- =========================================
-- CONTENT SCHEMA
-- =========================================

-- Content Table
create table content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  type text check (type in ('cornerstone', 'blog', 'case-study', 'update')),
  summary text,
  body text not null,
  published boolean default false,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for content
alter table content enable row level security;

-- Public can read published content
create policy "public can read published"
on content
for select
using (published = true);

-- Admin full access (authenticated users)
create policy "admin full access"
on content
for all
using (auth.role() = 'authenticated');

-- =========================================
-- ADDITIONAL TABLES FOR DASHBOARD
-- =========================================

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('success', 'error', 'warning', 'info')) DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Employee roles table
CREATE TABLE employee_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'employee', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- User tool settings (per-user configuration)
CREATE TABLE user_tool_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, tool_id)
);

-- Tool access codes table
CREATE TABLE tool_access_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE NOT NULL,
  activation_id UUID REFERENCES user_tool_activations(id) ON DELETE CASCADE NOT NULL,
  access_code TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) + INTERVAL '30 days'
);

-- User projects table
CREATE TABLE user_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_data JSONB NOT NULL,
  intent JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Enable RLS for additional tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tool_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete" ON notifications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "employee_roles_select" ON employee_roles FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);
CREATE POLICY "employee_roles_insert" ON employee_roles FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);
CREATE POLICY "employee_roles_update" ON employee_roles FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);
CREATE POLICY "employee_roles_delete" ON employee_roles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

CREATE POLICY "user_tool_settings_select" ON user_tool_settings FOR SELECT USING (true);
CREATE POLICY "user_tool_settings_insert" ON user_tool_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "user_tool_settings_update" ON user_tool_settings FOR UPDATE USING (true);
CREATE POLICY "user_tool_settings_delete" ON user_tool_settings FOR DELETE USING (true);

CREATE POLICY "tool_access_codes_select" ON tool_access_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tool_access_codes_insert" ON tool_access_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tool_access_codes_update" ON tool_access_codes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_projects_select" ON user_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_projects_insert" ON user_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_projects_update" ON user_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_projects_delete" ON user_projects FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_employee_roles_user_id ON employee_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_settings_user_id ON user_tool_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_settings_tool_id ON user_tool_settings(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_access_codes_user_id ON tool_access_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
