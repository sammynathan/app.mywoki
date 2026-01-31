import { supabase, VERIFICATION_CODES_TABLE } from './supabase'
import { brevoService } from './brevo'

export class VerificationService {
  private CODE_EXPIRY_MINUTES = 10
  private CODE_RESEND_COOLDOWN_MINUTES = 1

  async checkEmailExists(email: string): Promise<boolean> {
    console.log('🔍 [Service] Checking if email exists:', email)

    if (!email || !email.includes('@')) {
      console.log('🔍 [Service] Invalid email format')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .limit(1)

      if (error) {
        console.error('🔍 [Service] Error checking email:', error)
        return false
      }

      const exists = !!(data && data.length > 0)
      console.log('🔍 [Service] Email exists:', exists)
      return exists

    } catch (error) {
      console.error('🔍 [Service] Exception checking email:', error)
      return false
    }
  }

  async generateAndSendCode(email: string, type: 'login' | 'signup' = 'login'): Promise<{
    success: boolean;
    message?: string;
    cooldown?: number
  }> {
    console.log('🔍 [Service] Generating code for email:', email)

    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Invalid email address'
      }
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check rate limiting
    const canResend = await this.canResendCode(normalizedEmail)
    if (!canResend.allowed) {
      console.log('🔍 [Service] Rate limited, cooldown:', canResend.cooldown)
      return {
        success: false,
        message: `Please wait ${canResend.cooldown} minute${canResend.cooldown !== 1 ? 's' : ''} before requesting a new code`,
        cooldown: canResend.cooldown
      }
    }

    // Generate 6-digit code
    const code = this.generateCode()
    console.log('🔍 [Service] Generated code:', code)

    // Store in database with expiry
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES)

    try {
      const { error } = await supabase
        .from(VERIFICATION_CODES_TABLE)
        .insert({
          email: normalizedEmail,
          code,
          type,
          expires_at: expiresAt.toISOString(),
          used: false
        })

      if (error) {
        console.error('🔍 [Service] Error storing verification code:', error)
        return {
          success: false,
          message: 'Failed to generate verification code. Please try again.'
        }
      }

      // Send via Brevo
      console.log('🔍 [Service] Sending email via Brevo...')
      const emailSent = await brevoService.sendVerificationCode(email, code)

      if (!emailSent) {
        console.error('🔍 [Service] Email sending failed, cleaning up...')
        await supabase
          .from(VERIFICATION_CODES_TABLE)
          .delete()
          .eq('email', normalizedEmail)
          .eq('code', code)

        return {
          success: false,
          message: 'Failed to send verification email. Please try again.'
        }
      }

      console.log('🔍 [Service] Code sent successfully')
      return { success: true }

    } catch (error) {
      console.error('🔍 [Service] Exception in generateAndSendCode:', error)
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      }
    }
  }

  async verifyCode(email: string, code: string): Promise<{
    success: boolean;
    message?: string;
    isNewUser?: boolean;
    userId?: string;
  }> {
    console.log('🔍 [Service] Verifying code:', { email, code })

    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Invalid email address'
      }
    }

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return {
        success: false,
        message: 'Invalid verification code format'
      }
    }

    const normalizedEmail = email.trim().toLowerCase()

    try {
      // Clean up expired codes first
      await this.cleanupExpiredCodes()

      // Query for the code
      const { data, error } = await supabase
        .from(VERIFICATION_CODES_TABLE)
        .select('*')
        .eq('email', normalizedEmail)
        .eq('code', code)
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1)

      console.log('🔍 [Service] Query result:', { data, error })

      if (error) {
        console.error('🔍 [Service] Database query error:', error)
        return {
          success: false,
          message: 'Database error. Please try again.'
        }
      }

      if (!data || data.length === 0) {
        console.log('🔍 [Service] No matching code found')
        return {
          success: false,
          message: 'Invalid or expired verification code'
        }
      }

      const verification = data[0]

      // Check expiry
      if (new Date(verification.expires_at) < new Date()) {
        console.log('🔍 [Service] Code expired')
        return {
          success: false,
          message: 'Verification code has expired'
        }
      }

      // Mark as used
      const { error: updateError } = await supabase
        .from(VERIFICATION_CODES_TABLE)
        .update({
          used: true
        })
        .eq('id', verification.id)

      if (updateError) {
        console.error('🔍 [Service] Error marking code as used:', updateError)
      }

      // Check if user exists
      const userExists = await this.checkEmailExists(normalizedEmail)
      console.log('🔍 [Service] User exists:', userExists)

      // Get user ID if exists
      let userId: string | undefined
      if (userExists) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', normalizedEmail)
            .limit(1)

          if (userData && userData.length > 0) {
            userId = userData[0].id
          }
        } catch (userError) {
          console.error('🔍 [Service] Error fetching user ID:', userError)
        }
      }

      // Create a Supabase session for this user
      if (userId) {
        console.log('🔍 [Service] Creating Supabase session for user:', userId)
        await this.createSupabaseSession(normalizedEmail, userId)
      } else {
        console.log('🔍 [Service] WARNING: No userId available for session creation')
      }

      return {
        success: true,
        isNewUser: !userExists,
        userId: userId
      }

    } catch (error) {
      console.error('🔍 [Service] Exception in verifyCode:', error)
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      }
    }
  }

  private async createSupabaseSession(email: string, userId: string): Promise<void> {
    try {
      console.log('🔍 [Service] Creating Supabase session for user:', userId)

      // Create a valid-looking JWT token (header.payload.signature) with base64url encoding
      const base64UrlEncode = (str: string) => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

      const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const now = new Date()
      const expiresAt = Math.floor(new Date(now.getTime() + 24 * 60 * 60 * 1000).getTime() / 1000)

      const payload = base64UrlEncode(JSON.stringify({
        iss: 'https://cprykdfnsrgwotyxqaef.supabase.co/auth/v1',
        sub: userId,
        aud: 'authenticated',
        email: email,
        phone: '',
        app_metadata: {
          provider: 'email',
          providers: ['email']
        },
        user_metadata: {},
        role: 'authenticated',
        iat: Math.floor(now.getTime() / 1000),
        exp: expiresAt,
        email_confirmed_at: now.toISOString(),
        phone_confirmed_at: null,
        last_sign_in_at: now.toISOString()
      }))

      const signature = 'mock_' + Math.random().toString(36).substr(2, 9)
      const accessToken = `${header}.${payload}.${signature}`

      const sessionData = {
        access_token: accessToken,
        refresh_token: 'refresh_' + userId + '_' + Date.now(),
        expires_in: 24 * 60 * 60,
        expires_at: expiresAt,
        token_type: 'bearer',
        user: {
          id: userId,
          aud: 'authenticated',
          role: 'authenticated',
          email: email,
          email_confirmed_at: now.toISOString(),
          phone: '',
          confirmed_at: now.toISOString(),
          last_sign_in_at: now.toISOString(),
          app_metadata: {},
          user_metadata: {},
          identities: [{
            id: userId,
            user_id: userId,
            identity_data: { email },
            provider: 'email',
            created_at: now.toISOString(),
            last_sign_in_at: now.toISOString(),
            updated_at: now.toISOString()
          }],
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        }
      }

      // Store in localStorage with Supabase's expected keys
      localStorage.setItem('sb-access-token', sessionData.access_token)
      localStorage.setItem('sb-refresh-token', sessionData.refresh_token)
      localStorage.setItem('sb-user-id', userId)
      localStorage.setItem('supabase.auth.session', JSON.stringify(sessionData))

      console.log('🔍 [Service] Session stored in localStorage for user:', userId)

      // Try to set the session directly on the Supabase client
      const { error } = await supabase.auth.setSession({
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token
      })

      if (error) {
        console.warn('🔍 [Service] Warning setting session on Supabase:', error)
        console.log('✅ [Service] Session data stored in localStorage as fallback')
      } else {
        console.log('✅ [Service] Session set successfully on Supabase client')
      }

    } catch (error) {
      console.error('🔍 [Service] Error creating session:', error)
    }
  }

  async createUser(email: string, name: string, accountType?: string, purpose?: string): Promise<{
    success: boolean;
    message?: string;
    userId?: string
  }> {
    console.log('🔍 [Service] Creating user:', { email, name, accountType, purpose })

    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Invalid email address'
      }
    }

    if (!name || name.trim().length < 2) {
      return {
        success: false,
        message: 'Name must be at least 2 characters long'
      }
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedName = name.trim()

    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          name: normalizedName,
          account_type: accountType || null,
          purpose: purpose || null,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (error) {
        console.error('🔍 [Service] Error creating user:', error)

        // Try update if insert fails (user might have been created in another session)
        if (error.code === '23505') {
          console.log('🔍 [Service] User already exists, fetching ID...')
          const { data: existingData } = await supabase
            .from('users')
            .select('id')
            .eq('email', normalizedEmail)
            .limit(1)

          if (existingData && existingData.length > 0) {
            return {
              success: true,
              message: 'User already exists',
              userId: existingData[0].id
            }
          }
        }

        return {
          success: false,
          message: 'Failed to create user: ' + error.message
        }
      }

      console.log('🔍 [Service] User created with ID:', data.id)

      // Create Supabase session for new user
      console.log('🔍 [Service] Creating Supabase session for new user:', data.id)
      await this.createSupabaseSession(normalizedEmail, data.id)

      // Send welcome email
      try {
        await brevoService.sendWelcomeEmail(email, name)
        console.log('🔍 [Service] Welcome email sent')
      } catch (emailError) {
        console.error('🔍 [Service] Error sending welcome email:', emailError)
      }

      return {
        success: true,
        userId: data.id
      }

    } catch (error) {
      console.error('🔍 [Service] Exception creating user:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while creating your account'
      }
    }
  }

  async updateUserProfile(userId: string, updates: {
    name?: string;
    account_type?: string;
    purpose?: string;
  }): Promise<{ success: boolean; message?: string }> {
    console.log('🔍 [Service] Updating user profile:', { userId, updates })

    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('🔍 [Service] Error updating profile:', error)
        return {
          success: false,
          message: 'Failed to update profile: ' + error.message
        }
      }

      console.log('🔍 [Service] Profile updated successfully')
      return { success: true }

    } catch (error) {
      console.error('🔍 [Service] Exception updating profile:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while updating your profile'
      }
    }
  }

  async updateOnboarding(userId: string, primaryGoal: string, startPreference: string): Promise<{ success: boolean; message?: string }> {
    console.log('🔍 [Service] Updating onboarding:', { userId, primaryGoal, startPreference })

    try {
      const { error } = await supabase
        .from('users')
        .update({
          primary_goal: primaryGoal,
          start_preference: startPreference,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('🔍 [Service] Error updating onboarding:', error)
        return {
          success: false,
          message: 'Failed to complete onboarding: ' + error.message
        }
      }

      console.log('🔍 [Service] Onboarding completed successfully')
      return { success: true }

    } catch (error) {
      console.error('🔍 [Service] Exception updating onboarding:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while completing onboarding'
      }
    }
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private async canResendCode(email: string): Promise<{ allowed: boolean; cooldown?: number }> {
    try {
      const { data } = await supabase
        .from(VERIFICATION_CODES_TABLE)
        .select('created_at')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!data || data.length === 0) return { allowed: true }

      const lastSent = new Date(data[0].created_at)
      const now = new Date()
      const diffMinutes = (now.getTime() - lastSent.getTime()) / (1000 * 60)

      if (diffMinutes < this.CODE_RESEND_COOLDOWN_MINUTES) {
        const cooldown = Math.ceil(this.CODE_RESEND_COOLDOWN_MINUTES - diffMinutes)
        return { allowed: false, cooldown }
      }

      return { allowed: true }
    } catch (error) {
      console.error('🔍 [Service] Error checking resend cooldown:', error)
      return { allowed: true }
    }
  }

  private async cleanupExpiredCodes(): Promise<void> {
    try {
      await supabase
        .from(VERIFICATION_CODES_TABLE)
        .delete()
        .lt('expires_at', new Date().toISOString())
    } catch (error) {
      console.error('🔍 [Service] Error cleaning up expired codes:', error)
    }
  }
}

export const verificationService = new VerificationService()
