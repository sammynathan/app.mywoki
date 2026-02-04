
import { Outlet, NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  BarChart3, 
  Users, 
  Wrench, 
  Bell, 
  Settings,
  Home,
  Activity,
  Shield
} from "lucide-react"
import { cn } from "../lib/utils"
import MaintenanceBanner from "../components/MaintenanceBanner"
import useSessionHeartbeat from "../hooks/useSessionHeartbeat"

export default function ManagementLayout() {
  useSessionHeartbeat("management")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const navItems = [
    { path: "/management", icon: Home, label: "Overview" },
    { path: "/management/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/management/users", icon: Users, label: "Users" },
    { path: "/management/tools", icon: Wrench, label: "Tools" },
    { path: "/management/notifications", icon: Bell, label: "Notifications" },
    { path: "/management/monitoring", icon: Activity, label: "Live Monitoring" },
    { path: "/management/settings", icon: Settings, label: "Settings" },
  ]

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-md flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/management"}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Admin info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        <MaintenanceBanner />
        {/* Header */}
        <header className="shrink-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Management Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
