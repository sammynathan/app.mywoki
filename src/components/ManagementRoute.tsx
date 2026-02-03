import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../auth/AuthContext"
import MyWokiLoader from "./MyWokiLoader"
import AccessDenied from "./AccessDenied"

export default function ManagementRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, userId } = useAuth()
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated || !userId) {
      setChecking(false)
      return
    }

    let isMounted = true

    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from("employee_roles")
          .select("role")
          .eq("user_id", userId)
          .single()

        if (!isMounted) return
        if (error) {
          setIsAdmin(false)
          return
        }

        setIsAdmin(data?.role === "admin")
      } catch (err) {
        if (isMounted) {
          setIsAdmin(false)
        }
      } finally {
        if (isMounted) {
          setChecking(false)
        }
      }
    }

    checkAdmin()

    return () => {
      isMounted = false
    }
  }, [loading, isAuthenticated, userId])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <MyWokiLoader />
          <p className="text-sm text-gray-600 dark:text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <AccessDenied />
  }

  return <>{children}</>
}
