import { useState, useCallback, useEffect } from 'react'
import { verificationService } from '../services/verification'
import { supabase } from '../services/supabase'
import { authService } from '../services/authService'

interface AuthState {
  userId: string | null
  email: string | null
  name: string | null
  isAuthenticated: boolean
  loading: boolean
}

interface InitiateLoginResponse {
  success: boolean
  message?: string
  cooldown?: number
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    userId: null,
    email: null,
    name: null,
    isAuthenticated: false,
    loading: false
  })

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const user = await authService.getCurrentUser()
      if (user) {
        setState({
          userId: user.id,
          email: user.email,
          name: user.name || null,
          isAuthenticated: true,
          loading: false
        })
      }
    }
    
    checkExistingSession()
  }, [])

  const initiateLogin = useCallback(async (email: string): Promise<InitiateLoginResponse> => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const result = await verificationService.generateAndSendCode(email)
      
      if (!result.success && result.cooldown) {
        return { 
          success: false, 
          message: `Please wait ${result.cooldown} minute(s) before requesting a new code` 
        }
      }
      
      if (!result.success) {
        return { 
          success: false, 
          message: result.message || 'Failed to send verification code. Please try again.' 
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Login initiation error:', error)
      return { 
        success: false, 
        message: 'An error occurred. Please try again.' 
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const verifyCode = useCallback(async (email: string, code: string) => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const result = await verificationService.verifyCode(email, code)
      
      if (!result.success) {
        return { 
          success: false, 
          message: result.message || 'Verification failed' 
        }
      }

      // For NEW users, we don't authenticate yet - we need profile creation
      if (result.isNewUser) {
        setState({
          userId: 'temp', // Temporary marker for new user
          email,
          name: null,
          isAuthenticated: false, // NOT authenticated yet
          loading: false
        })
        
        return { 
          success: true, 
          isNewUser: true,
          userId: 'temp'
        }
      }
      
      // For EXISTING users, fetch user data and authenticate
      if (result.userId) {
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', result.userId)
          .single()

        if (user) {
          // Create session
          await authService.createSession(user.id)
          
          setState({
            userId: user.id,
            email: user.email,
            name: user.name || null,
            isAuthenticated: true,
            loading: false
          })
          
          return { 
            success: true, 
            isNewUser: false,
            userId: user.id
          }
        }
      }
      
      // Fallback if user not found
      return { 
        success: false, 
        message: 'User not found. Please try again.' 
      }
      
    } catch (error) {
      console.error('Verification error:', error)
      return { 
        success: false, 
        message: 'Verification failed. Please try again.' 
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const createProfile = useCallback(async (email: string, name: string, accountType?: string, purpose?: string) => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const result = await verificationService.createUser(email, name, accountType, purpose)
      
      if (!result.success) {
        return { 
          success: false, 
          message: result.message || 'Failed to create profile. Please try again.' 
        }
      }
      
      if (result.userId) {
        // Create session for the new user
        await authService.createSession(result.userId)
        
        // Fetch the newly created user
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', result.userId)
          .single()

        if (user) {
          setState({
            userId: user.id,
            email: user.email,
            name: user.name || null,
            isAuthenticated: true, // NOW authenticated after profile creation
            loading: false
          })
          
          return { success: true, userId: user.id }
        }
      }
      
      return { 
        success: false, 
        message: 'Failed to create user session' 
      }
      
    } catch (error) {
      console.error('Profile creation error:', error)
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create profile. Please try again.' 
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    setState({
      userId: null,
      email: null,
      name: null,
      isAuthenticated: false,
      loading: false
    })
  }, [])

  return {
    ...state,
    initiateLogin,
    verifyCode,
    createProfile,
    logout
  }
}