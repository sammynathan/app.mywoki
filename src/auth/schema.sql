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

-- RLS Policies
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
