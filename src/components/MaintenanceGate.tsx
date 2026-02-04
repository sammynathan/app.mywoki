import { useLocation } from "react-router-dom"
import useMaintenanceMode from "../hooks/useMaintenanceMode"
import MaintenanceScreen from "./MaintenanceScreen"

const MANAGEMENT_PATH_PREFIX = "/management"
const STATUS_PATH = "/status"

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const maintenanceMode = useMaintenanceMode()
  const location = useLocation()
  const isManagementPath = location.pathname.startsWith(MANAGEMENT_PATH_PREFIX)
  const isStatusPath = location.pathname === STATUS_PATH

  if (maintenanceMode && !isManagementPath && !isStatusPath) {
    return <MaintenanceScreen />
  }

  return <>{children}</>
}
