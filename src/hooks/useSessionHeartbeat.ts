import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../auth/AuthContext"

const HEARTBEAT_INTERVAL_MS = 60_000

export default function useSessionHeartbeat(source: string) {
  const { userId, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !userId) return

    let isMounted = true

    const upsertSession = async () => {
      if (!isMounted) return
      const now = new Date().toISOString()
      await supabase
        .from("user_sessions")
        .upsert(
          {
            user_id: userId,
            last_seen: now,
            user_agent: navigator.userAgent,
            source
          },
          { onConflict: "user_id" }
        )
    }

    upsertSession()

    const interval = setInterval(upsertSession, HEARTBEAT_INTERVAL_MS)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        upsertSession()
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      isMounted = false
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [isAuthenticated, userId, source])
}
