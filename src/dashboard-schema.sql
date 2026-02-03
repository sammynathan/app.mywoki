-- Dashboard Tables for Mywoki Tool Management
-- This extends your existing users table with dashboard functionality

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

-- Employee roles table (admin access)
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

-- Add Mywoki-specific fields to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS mywoki_account_linked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mywoki_user_id TEXT;

-- Enable RLS on new tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tool_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tool_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tools (anyone can view)
CREATE POLICY "tools_select" ON tools FOR SELECT USING (true);

-- RLS Policies for user tool activations (users can only see their own)
CREATE POLICY "user_tool_activations_select" ON user_tool_activations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_tool_activations_insert" ON user_tool_activations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tool_activations_update" ON user_tool_activations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_tool_activations_delete" ON user_tool_activations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for employee roles (admins can manage all, users can read their own)
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

-- RLS Policies for user tool settings (open access for current setup)
CREATE POLICY "user_tool_settings_select" ON user_tool_settings FOR SELECT USING (true);
CREATE POLICY "user_tool_settings_insert" ON user_tool_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "user_tool_settings_update" ON user_tool_settings FOR UPDATE USING (true);
CREATE POLICY "user_tool_settings_delete" ON user_tool_settings FOR DELETE USING (true);

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

-- Create indexes for better performance
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
