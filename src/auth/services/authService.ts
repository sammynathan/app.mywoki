import { supabase } from './supabase'
import type {
  AuthResponse,
  User
} from '../types/auth.types'

export class AuthService {
  private SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

  async checkSession(): Promise<User | null> {
    const session = localStorage.getItem('auth_session')
    
    if (!session) return null

    try {
      const { userId, expiresAt } = JSON.parse(session)
      
      if (new Date(expiresAt) < new Date()) {
        this.clearSession()
        return null
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !user) {
        this.clearSession()
        return null
      }

      return user
    } catch {
      this.clearSession()
      return null
    }
  }

  async createSession(userId: string): Promise<void> {
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION)
    
    localStorage.setItem('auth_session', JSON.stringify({
      userId,
      expiresAt: expiresAt.toISOString()
    }))
  }

  clearSession(): void {
    localStorage.removeItem('auth_session')
  }

  async getCurrentUser(): Promise<User | null> {
    return this.checkSession()
  }

  async logout(): Promise<AuthResponse> {
    try {
      this.clearSession()
      return { success: true, message: 'Logged out successfully' }
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to logout',
        message: 'An error occurred during logout'
      }
    }
  }

  async updateProfile(
    userId: string, 
    updates: Partial<User>
  ): Promise<AuthResponse> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)

      if (error) {
        return { 
          success: false, 
          error: error.message,
          message: 'Failed to update profile'
        }
      }

      return { 
        success: true, 
        message: 'Profile updated successfully' 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'An error occurred while updating profile'
      }
    }
  }

  async deleteAccount(userId: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        return { 
          success: false, 
          error: error.message,
          message: 'Failed to delete account'
        }
      }

      this.clearSession()
      return { 
        success: true, 
        message: 'Account deleted successfully' 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'An error occurred while deleting account'
      }
    }
  }
}

export const authService = new AuthService()
