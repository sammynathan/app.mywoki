import { AlertTriangle } from "lucide-react"
import useMaintenanceMode from "../hooks/useMaintenanceMode"

export default function MaintenanceBanner() {
  const maintenanceMode = useMaintenanceMode()

  if (!maintenanceMode) return null

  return (
    <div className="w-full border-b border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-2 text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>
          Maintenance mode is active. Some features may be unavailable while we update the platform.
        </span>
      </div>
    </div>
  )
}
