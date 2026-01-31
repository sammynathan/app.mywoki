export interface User {
  id: string
  email: string
  name?: string
  account_type?: 'individual' | 'organization'
  purpose?: string
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface VerificationCode {
  id: string
  email: string
  code: string
  type: 'login' | 'signup'
  expires_at: string
  used: boolean
  created_at: string
}

export interface LoginAttempt {
  id: string
  email: string
  ip_address?: string
  user_agent?: string
  success: boolean
  created_at: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

export interface EmailVerificationResponse {
  success: boolean
  cooldown?: number
  message?: string
}

export interface CodeVerificationResponse {
  success: boolean
  isNewUser?: boolean
  message?: string
  userId?: string
}

export interface MagicLinkResponse {
  success: boolean
  message?: string
  link?: string
}

export interface AuthState {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  loading: boolean
  user?: User
}
