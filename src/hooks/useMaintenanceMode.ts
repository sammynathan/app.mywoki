import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const SETTINGS_KEY = "management_settings"
const SETTINGS_SCOPE = "global"

const readMaintenanceMode = (): boolean => {
  if (typeof window === "undefined") return false

  const savedSettings = localStorage.getItem(SETTINGS_KEY)
  if (!savedSettings) return false

  try {
    const parsed = JSON.parse(savedSettings)
    return Boolean(parsed?.maintenanceMode)
  } catch {
    return false
  }
}

const writeMaintenanceMode = (value: boolean) => {
  if (typeof window === "undefined") return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ maintenanceMode: value }))
}

export default function useMaintenanceMode() {
  const [maintenanceMode, setMaintenanceMode] = useState(readMaintenanceMode)

  useEffect(() => {
    let isMounted = true

    const loadMaintenanceMode = async () => {
      const { data, error } = await supabase
        .from("management_settings")
        .select("maintenance_mode")
        .eq("scope", SETTINGS_SCOPE)
        .maybeSingle()

      if (!isMounted) return

      if (error || !data) {
        const fallback = readMaintenanceMode()
        setMaintenanceMode(fallback)
        return
      }

      const mode = Boolean(data.maintenance_mode)
      setMaintenanceMode(mode)
      writeMaintenanceMode(mode)
    }

    loadMaintenanceMode()

    const channel = supabase
      .channel("management_settings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "management_settings",
          filter: `scope=eq.${SETTINGS_SCOPE}`
        },
        (payload) => {
          const mode = Boolean(payload.new?.maintenance_mode)
          setMaintenanceMode(mode)
          writeMaintenanceMode(mode)
        }
      )
      .subscribe()

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ maintenanceMode?: boolean }>
      if (typeof customEvent.detail?.maintenanceMode === "boolean") {
        const mode = customEvent.detail.maintenanceMode
        setMaintenanceMode(mode)
        writeMaintenanceMode(mode)
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SETTINGS_KEY) {
        setMaintenanceMode(readMaintenanceMode())
      }
    }

    window.addEventListener("managementSettingsUpdated", handleCustomEvent as EventListener)
    window.addEventListener("storage", handleStorage)

    return () => {
      isMounted = false
      window.removeEventListener("managementSettingsUpdated", handleCustomEvent as EventListener)
      window.removeEventListener("storage", handleStorage)
      supabase.removeChannel(channel)
    }
  }, [])

  return maintenanceMode
}
