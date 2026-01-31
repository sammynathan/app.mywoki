import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { JSX } from 'react/jsx-runtime'

export default function RequireOnboarding({ children }: { children: JSX.Element }) {
  const { isAuthenticated, onboardingCompleted, loading } = useAuth()

  if (loading) return null

  if (isAuthenticated && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
