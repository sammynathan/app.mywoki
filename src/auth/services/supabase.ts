import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

// Database schema
export const USERS_TABLE = 'users'
export const VERIFICATION_CODES_TABLE = 'verification_codes'
export const MAGIC_LINKS_TABLE = 'magic_links'
export const LOGIN_ATTEMPTS_TABLE = 'login_attempts'
