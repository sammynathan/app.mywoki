import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { verificationService } from './services/verification';
import { supabase } from '../lib/supabase';

interface AuthState {
  userId: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  onboardingCompleted: boolean;
}

interface InitiateLoginResponse {
  success: boolean;
  message?: string;
  cooldown?: number;
}

interface AuthContextType {
  userId: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  onboardingCompleted: boolean;
  initiateLogin: (email: string) => Promise<InitiateLoginResponse>;
  verifyCode: (email: string, code: string) => Promise<{
    success: boolean;
    message?: string;
    isNewUser?: boolean;
    userId?: string;
  }>;
  createProfile: (email: string, name: string, accountType?: string, purpose?: string) => Promise<{
    success: boolean;
    message?: string;
    userId?: string;
  }>;
  updateProfile: (userId: string, updates: { name?: string | null; account_type?: string; purpose?: string }) => Promise<{
    success: boolean;
    message?: string;
  }>;
  completeOnboarding: (userId: string, primaryGoal: string, startPreference: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  setOnboardingCompleted: (completed: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Helper function to check onboarding in localStorage
const checkLocalStorageOnboarding = (): boolean => {
  try {
    const data = localStorage.getItem("mywoki_onboarding");
    if (!data) return false;
    
    const parsed = JSON.parse(data);
    return !!(parsed && parsed.primaryGoal && parsed.completedAt);
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    userId: null,
    email: null,
    name: null,
    isAuthenticated: false,
    loading: true,
    onboardingCompleted: checkLocalStorageOnboarding(),
  });

  // Initialize auth state from localStorage and database
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 [Auth] Initializing auth state...');
      
      try {
        const userId = localStorage.getItem('user_id');
        const email = localStorage.getItem('user_email');
        let name = localStorage.getItem('user_name');

        console.log('🔍 [Auth] Found in localStorage:', { userId, email, name });

        // Check if we have a real user (not temp)
        if (userId && email && userId !== 'temp') {
          let dbOnboardingCompleted = false;
          let userName = name;

          try {
            // Fetch user data from database
            const { data: userData, error } = await supabase
              .from('users')
              .select('name, onboarding_completed')
              .eq('id', userId);

            if (error) {
              console.warn('🔍 [Auth] Error fetching user data:', error.message);
            } else if (userData && userData.length > 0) {
              const user = userData[0];
              // Use database name if available
              if (user?.name) {
                userName = user.name;
                localStorage.setItem('user_name', user.name);
              }
              dbOnboardingCompleted = user?.onboarding_completed || false;
            }
          } catch (error) {
            console.error('🔍 [Auth] Error fetching user data:', error);
          }

          const localStorageOnboarding = checkLocalStorageOnboarding();
          console.log('🔍 [Auth] Onboarding status - DB:', dbOnboardingCompleted, 'LocalStorage:', localStorageOnboarding);
          
          // Use whichever onboarding status is true
          const onboardingCompleted = dbOnboardingCompleted || localStorageOnboarding;

          setState({
            userId,
            email,
            name: userName,
            isAuthenticated: true,
            loading: false,
            onboardingCompleted,
          });
        } else {
          console.log('🔍 [Auth] No valid session found');
          
          // Clear any temp data
          if (userId === 'temp') {
            localStorage.removeItem('user_id');
            localStorage.removeItem('temp_email');
          }

          const localStorageOnboarding = checkLocalStorageOnboarding();
          
          // If there's onboarding data but no user, clear it
          if (localStorageOnboarding && !userId) {
            console.warn('🔍 [Auth] Found orphaned onboarding data, clearing');
            localStorage.removeItem('mywoki_onboarding');
          }

          setState({
            userId: null,
            email: null,
            name: null,
            isAuthenticated: false,
            loading: false,
            onboardingCompleted: false,
          });
        }
      } catch (error) {
        console.error('🔍 [Auth] Error during auth initialization:', error);
        setState({
          userId: null,
          email: null,
          name: null,
          isAuthenticated: false,
          loading: false,
          onboardingCompleted: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Sync onboarding status with localStorage changes
  useEffect(() => {
    const syncOnboarding = () => {
      const localStorageOnboarding = checkLocalStorageOnboarding();
      console.log('[Auth] Syncing onboarding with localStorage:', localStorageOnboarding);
      if (state.onboardingCompleted !== localStorageOnboarding) {
        setState(prev => ({
          ...prev,
          onboardingCompleted: localStorageOnboarding,
        }));
      }
    };

    // Listen for storage events (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mywoki_onboarding') {
        syncOnboarding();
      }
    };

    // Listen for custom events
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.type === 'onboardingCompleted') {
        syncOnboarding();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('onboardingCompleted' as any, handleCustomEvent);
    
    // Initial sync
    syncOnboarding();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('onboardingCompleted' as any, handleCustomEvent);
    };
  }, [state.onboardingCompleted]);

  // Add window method for onboarding components to update status
  useEffect(() => {
    window.updateOnboardingStatus = (completed: boolean) => {
      console.log('[Auth] window.updateOnboardingStatus called:', completed);
      setState(prev => ({
        ...prev,
        onboardingCompleted: completed,
      }));
      
      // Trigger custom event for same-tab sync
      window.dispatchEvent(new CustomEvent('onboardingCompleted', { 
        detail: { type: 'onboardingCompleted', completed }
      }));
    };

    return () => {
      delete window.updateOnboardingStatus;
    };
  }, []);

  // Clear auth on browser close/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.isAuthenticated) {
        // Only clear localStorage for temp users
        if (state.userId === 'temp') {
          localStorage.removeItem('user_id');
          localStorage.removeItem('temp_email');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.isAuthenticated, state.userId]);

  const initiateLogin = useCallback(async (email: string): Promise<InitiateLoginResponse> => {
    console.log('🔍 [Auth] Initiating login for:', email);
    setState(prev => ({ ...prev, loading: true }));

    try {
      if (!email || !email.includes('@')) {
        return {
          success: false,
          message: 'Please enter a valid email address',
        };
      }

      const result = await verificationService.generateAndSendCode(email);
      console.log('🔍 [Auth] Code generation result:', result);

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Failed to send verification code. Please try again.',
          cooldown: result.cooldown
        };
      }

      console.log('🔍 [Auth] Code sent successfully');
      return { success: true };
    } catch (error) {
      console.error('🔍 [Auth] Login initiation error:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    console.log('🔍 [Auth] Verifying code for:', { email, code });
    setState(prev => ({ ...prev, loading: true }));

    try {
      if (!email || !email.includes('@')) {
        return {
          success: false,
          message: 'Invalid email address',
        };
      }

      if (!code || code.length !== 6) {
        return {
          success: false,
          message: 'Please enter a valid 6-digit code',
        };
      }

      console.log('🔍 [Auth] Calling verification service...');
      const result = await verificationService.verifyCode(email, code);
      console.log('🔍 [Auth] Verification service result:', result);

      if (!result.success) {
        console.log('🔍 [Auth] Verification failed:', result.message);
        return {
          success: false,
          message: result.message || 'Verification failed',
        };
      }

      if (result.isNewUser) {
        console.log('🔍 [Auth] New user detected - storing email only');
        localStorage.setItem('temp_email', email.toLowerCase().trim());
        localStorage.setItem('user_id', 'temp');

        setState({
          userId: 'temp',
          email: email.toLowerCase().trim(),
          name: null,
          isAuthenticated: false,
          loading: false,
          onboardingCompleted: false,
        });
      } else {
        console.log('🔍 [Auth] Existing user detected with ID:', result.userId);

        if (result.userId) {
          const { data: userData } = await supabase
            .from('users')
            .select('name, onboarding_completed')
            .eq('id', result.userId)
            .single();

          const userName = userData?.name || null;
          const dbOnboardingCompleted = userData?.onboarding_completed || false;
          const localStorageOnboarding = checkLocalStorageOnboarding();
          const onboardingCompleted = dbOnboardingCompleted || localStorageOnboarding;

          localStorage.setItem('user_id', result.userId);
          localStorage.setItem('user_email', email.toLowerCase().trim());
          if (userName) {
            localStorage.setItem('user_name', userName as string);
          }

          setState({
            userId: result.userId,
            email: email.toLowerCase().trim(),
            name: userName,
            isAuthenticated: true,
            loading: false,
            onboardingCompleted,
          });
        } else {
          console.warn('🔍 [Auth] Existing user but no userId returned');
          return {
            success: false,
            message: 'Authentication error. Please try again.',
          };
        }
      }

      return {
        success: true,
        isNewUser: result.isNewUser,
        userId: result.userId,
      };

    } catch (error) {
      console.error('🔍 [Auth] Verification error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const createProfile = useCallback(async (email: string, name: string, accountType?: string, purpose?: string) => {
    console.log('🔍 [Auth] Creating profile:', { email, name, accountType, purpose });
    setState(prev => ({ ...prev, loading: true }));

    try {
      const result = await verificationService.createUser(email, name, accountType, purpose);
      console.log('🔍 [Auth] User creation result:', result);

      if (!result.success) {
        console.log('🔍 [Auth] Profile creation failed:', result.message);
        return {
          success: false,
          message: result.message || 'Failed to create profile. Please try again.',
        };
      }

      console.log('🔍 [Auth] Profile created successfully with ID:', result.userId);

      localStorage.removeItem('temp_email');
      if (result.userId) {
        localStorage.setItem('user_id', result.userId);
      }
      localStorage.setItem('user_email', email.toLowerCase().trim());
      localStorage.setItem('user_name', name.trim());

      setState({
        userId: result.userId || null,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        isAuthenticated: true,
        loading: false,
        onboardingCompleted: false,
      });

      return {
        success: true,
        userId: result.userId,
        message: result.message,
      };
    } catch (error: any) {
      console.error('🔍 [Auth] Profile creation error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create profile. Please try again.',
      };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: { name?: string | null; account_type?: string; purpose?: string }) => {
    console.log('🔍 [Auth] Updating profile:', { userId, updates });

    try {
      const serviceUpdates = {
        ...(updates.name != null ? { name: updates.name } : {}),
        ...(updates.account_type != null ? { account_type: updates.account_type } : {}),
        ...(updates.purpose != null ? { purpose: updates.purpose } : {}),
      };

      const result = await verificationService.updateUserProfile(userId, serviceUpdates);
      console.log('🔍 [Auth] Profile update result:', result);

      if (result.success && updates.name != null) {
        setState(prev => ({
          ...prev,
          name: updates.name as string,
        }));
        localStorage.setItem('user_name', updates.name as string);
      }

      return result;
    } catch (error: any) {
      console.error('🔍 [Auth] Profile update error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  }, []);

  const completeOnboarding = useCallback(async (userId: string, primaryGoal: string, startPreference: string): Promise<{ success: boolean; message?: string; }> => {
    try {
      // Update database
      const { error } = await supabase
        .from('users')
        .update({
          primary_goal: primaryGoal,
          start_preference: startPreference,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('🔍 [Auth] Database update failed:', error);
        return {
          success: false,
          message: 'Failed to save preferences. Please try again.',
        };
      }

      // Update state - but DO NOT redirect here
      setState(prev => ({
        ...prev,
        onboardingCompleted: true
      }));

      return { success: true };

    } catch (error: any) {
      console.error('🔍 [Auth] Onboarding completion error:', error);
      return {
        success: false,
        message: error.message || 'Failed to complete onboarding.'
      };
    }
  }, []);

  const setOnboardingCompleted = useCallback((completed: boolean) => {
    setState(prev => ({ ...prev, onboardingCompleted: completed }));
    
    if (!completed) {
      localStorage.removeItem('mywoki_onboarding');
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🔍 [Auth] Logging out');

    setState({
      userId: null,
      email: null,
      name: null,
      isAuthenticated: false,
      loading: false,
      onboardingCompleted: false,
    });

    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('login_email');
    localStorage.removeItem('temp_email');
    localStorage.removeItem('mywoki_onboarding');

    console.log('🔍 [Auth] Logout complete');
  }, []);

  const value: AuthContextType = {
    ...state,
    initiateLogin,
    verifyCode,
    createProfile,
    updateProfile,
    completeOnboarding,
    setOnboardingCompleted,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Add TypeScript declaration for window
declare global {
  interface Window {
    updateOnboardingStatus?: (completed: boolean) => void;
  }
}