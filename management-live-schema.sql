-- Run this in Supabase SQL editor to enable management live features

-- Management settings (public read for maintenance mode)
CREATE TABLE IF NOT EXISTS management_settings (
  scope TEXT PRIMARY KEY DEFAULT 'global',
  site_name TEXT,
  site_description TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  send_welcome_email BOOLEAN DEFAULT TRUE,
  send_tool_activation_email BOOLEAN DEFAULT TRUE,
  send_weekly_digest BOOLEAN DEFAULT TRUE,
  require_email_verification BOOLEAN DEFAULT TRUE,
  enable_two_factor BOOLEAN DEFAULT FALSE,
  session_timeout INTEGER DEFAULT 24,
  cache_enabled BOOLEAN DEFAULT TRUE,
  realtime_updates BOOLEAN DEFAULT TRUE,
  auto_backup BOOLEAN DEFAULT TRUE,
  backup_frequency TEXT DEFAULT 'daily',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE management_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "management_settings_select_all"
ON management_settings FOR SELECT USING (true);

CREATE POLICY "management_settings_insert_admin"
ON management_settings FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

CREATE POLICY "management_settings_update_admin"
ON management_settings FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

-- User sessions (for live monitoring)
CREATE TABLE IF NOT EXISTS user_sessions (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_agent TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_sessions_insert_self"
ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_sessions_update_self"
ON user_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_sessions_select_admin"
ON user_sessions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  component TEXT DEFAULT 'platform',
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  status TEXT CHECK (status IN ('open', 'monitoring', 'resolved')) DEFAULT 'open',
  reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  resolved_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE incidents ADD COLUMN IF NOT EXISTS component TEXT DEFAULT 'platform';

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "incidents_select_admin"
ON incidents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

CREATE POLICY "incidents_select_public"
ON incidents FOR SELECT USING (true);

CREATE POLICY "incidents_insert_admin"
ON incidents FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

CREATE POLICY "incidents_update_admin"
ON incidents FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

-- Notification templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'success', 'error')) DEFAULT 'info',
  target TEXT CHECK (target IN ('all', 'specific_plan', 'specific_users')) DEFAULT 'all',
  plan_filter TEXT,
  user_ids UUID[],
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_templates_select_admin"
ON notification_templates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

CREATE POLICY "notification_templates_insert_admin"
ON notification_templates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

CREATE POLICY "notification_templates_update_admin"
ON notification_templates FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

-- Tool events (used in analytics and management)
CREATE TABLE IF NOT EXISTS tool_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE tool_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tool_events_select_owner_or_admin"
ON tool_events FOR SELECT USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM employee_roles er
    WHERE er.user_id = auth.uid() AND er.role = 'admin'
  )
);

CREATE POLICY "tool_events_insert_owner"
ON tool_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Project notes
CREATE TABLE IF NOT EXISTS project_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activation_id UUID REFERENCES user_tool_activations(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_notes_select_owner"
ON project_notes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "project_notes_insert_owner"
ON project_notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_notes_update_owner"
ON project_notes FOR UPDATE USING (auth.uid() = user_id);
