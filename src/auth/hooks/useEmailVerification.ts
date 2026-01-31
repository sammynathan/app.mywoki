import { useState, useCallback, useEffect } from 'react'
import { verificationService } from '../services/verification'
import type { EmailVerificationResponse, CodeVerificationResponse } from '../types/auth.types'
import { validation } from '../utils/validation'

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // Handle cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 60000)

      return () => clearInterval(timer)
    }
  }, [cooldown])

  const sendVerificationCode = useCallback(async (
    email: string, 
    type: 'login' | 'signup' = 'login'
  ): Promise<EmailVerificationResponse> => {
    // Validate email
    if (!validation.validateEmail(email)) {
      return { 
        success: false, 
        message: 'Please enter a valid email address' 
      }
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await verificationService.generateAndSendCode(email, type)
      
      if (!result.success) {
        if (result.cooldown) {
          setCooldown(result.cooldown)
          return { 
            success: false, 
            cooldown: result.cooldown,
            message: `Please wait ${result.cooldown} minute(s) before requesting a new code` 
          }
        }
        
        return { 
          success: false, 
          message: 'Failed to send verification code. Please try again.' 
        }
      }

      setSuccess('Verification code sent to your email!')
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code'
      setError(errorMessage)
      return { 
        success: false, 
        message: errorMessage 
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyCode = useCallback(async (
    email: string, 
    code: string
  ): Promise<CodeVerificationResponse> => {
    // Validate code
    if (!validation.validateCode(code)) {
      return { 
        success: false, 
        message: 'Please enter a valid 6-digit code' 
      }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await verificationService.verifyCode(email, code)
      
      if (!result.success) {
        return { 
          success: false, 
          message: result.message || 'Verification failed' 
        }
      }

      return { 
        success: true, 
        isNewUser: result.isNewUser 
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify code'
      setError(errorMessage)
      return { 
        success: false, 
        message: errorMessage 
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const resendCode = useCallback(async (
    email: string
  ): Promise<EmailVerificationResponse> => {
    if (cooldown > 0) {
      return { 
        success: false, 
        cooldown,
        message: `Please wait ${cooldown} minute(s) before resending` 
      }
    }

    return sendVerificationCode(email)
  }, [cooldown, sendVerificationCode])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  return {
    sendVerificationCode,
    verifyCode,
    resendCode,
    loading,
    error,
    success,
    cooldown,
    clearMessages,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(null)
  }
}
