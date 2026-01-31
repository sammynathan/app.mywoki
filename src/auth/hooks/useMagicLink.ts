import { useState, useCallback } from 'react'
import { supabase } from '../services/supabase'
import type { MagicLinkResponse } from '../types/auth.types'
import { validation } from '../utils/validation'
import { rateLimiter } from '../utils/rateLimiter'

export const useMagicLink = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateMagicLink = useCallback(async (email: string): Promise<MagicLinkResponse> => {
    // Validate email
    if (!validation.validateEmail(email)) {
      return { 
        success: false, 
        message: 'Please enter a valid email address' 
      }
    }

    // Rate limiting check
    const canProceed = await rateLimiter.canSendMagicLink(email)
    if (!canProceed.allowed) {
      return { 
        success: false, 
        message: `Too many attempts. Please wait ${canProceed.cooldown} minute(s)` 
      }
    }

    setLoading(true)
    setError(null)

    try {
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

      // Store magic link in database
      const { error: dbError } = await supabase
        .from('magic_links')
        .insert({
          email,
          token,
          expires_at: expiresAt.toISOString(),
          used: false
        })

      if (dbError) {
        throw new Error('Failed to generate magic link')
      }

      // Generate magic link URL
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin
      const magicLink = `${baseUrl}/auth/magic-link?token=${token}&email=${encodeURIComponent(email)}`

      // Record attempt
      await rateLimiter.recordMagicLinkAttempt(email)

      return {
        success: true,
        link: magicLink,
        message: 'Magic link generated successfully'
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate magic link'
      setError(errorMessage)
      return { 
        success: false, 
        message: errorMessage 
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyMagicLink = useCallback(async (token: string, email: string): Promise<MagicLinkResponse> => {
    setLoading(true)
    setError(null)

    try {
      // Get magic link from database
      const { data: magicLink, error: fetchError } = await supabase
        .from('magic_links')
        .select('*')
        .eq('token', token)
        .eq('email', email)
        .eq('used', false)
        .single()

      if (fetchError || !magicLink) {
        return { 
          success: false, 
          message: 'Invalid or expired magic link' 
        }
      }

      // Check expiry
      if (new Date(magicLink.expires_at) < new Date()) {
        return { 
          success: false, 
          message: 'Magic link has expired' 
        }
      }

      // Mark as used
      await supabase
        .from('magic_links')
        .update({ used: true })
        .eq('id', magicLink.id)

      // Check if user exists
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      const isNewUser = !user

      return {
        success: true,
        message: isNewUser ? 'New user detected' : 'Existing user logged in'
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify magic link'
      setError(errorMessage)
      return { 
        success: false, 
        message: errorMessage 
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    generateMagicLink,
    verifyMagicLink,
    loading,
    error,
    clearError: () => setError(null)
  }
}
