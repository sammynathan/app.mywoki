import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutGrid,
  Wrench,
  BarChart3,
  CreditCard,
  Settings,
  FolderKanban,
  Home
} from "lucide-react"
import { cn } from "../lib/utils"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"

const navItems = [
  { path: "/dashboard", icon: LayoutGrid, label: "Overview" },
  { path: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
  { path: "/dashboard/tools", icon: Wrench, label: "Tools" },
  { path: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
]

const footerItems = [
  { path: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const [userPlan, setUserPlan] = useState<string>('starter')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserPlan()
  }, [])

  const fetchUserPlan = async () => {
    try {
      const userId = localStorage.getItem('user_id')
      if (!userId) {
        setUserPlan('starter')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user plan:', error)
        setUserPlan('starter')
      } else {
        setUserPlan(data?.plan || 'starter')
      }
    } catch (error) {
      console.error('Failed to fetch user plan:', error)
      setUserPlan('starter')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeClick = () => {
    navigate('/dashboard/billing')
  }

  const formatPlanName = (plan: string) => {
    if (!plan) return 'Starter'
    return plan.charAt(0).toUpperCase() + plan.slice(1)
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'starter':
        return {
          bgFrom: 'from-emerald-50',
          bgTo: 'to-green-50',
          darkBgFrom: 'dark:from-emerald-900/10',
          darkBgTo: 'dark:to-green-900/10',
          border: 'border-emerald-100',
          darkBorder: 'dark:border-emerald-800',
          text: 'text-emerald-800',
          darkText: 'dark:text-emerald-300'
        }
      case 'core':
        return {
          bgFrom: 'from-blue-50',
          bgTo: 'to-indigo-50',
          darkBgFrom: 'dark:from-blue-900/10',
          darkBgTo: 'dark:to-indigo-900/10',
          border: 'border-blue-100',
          darkBorder: 'dark:border-blue-800',
          text: 'text-blue-800',
          darkText: 'dark:text-blue-300'
        }
      case 'growth':
        return {
          bgFrom: 'from-purple-50',
          bgTo: 'to-pink-50',
          darkBgFrom: 'dark:from-purple-900/10',
          darkBgTo: 'dark:to-pink-900/10',
          border: 'border-purple-100',
          darkBorder: 'dark:border-purple-800',
          text: 'text-purple-800',
          darkText: 'dark:text-purple-300'
        }
      default:
        return {
          bgFrom: 'from-emerald-50',
          bgTo: 'to-green-50',
          darkBgFrom: 'dark:from-emerald-900/10',
          darkBgTo: 'dark:to-green-900/10',
          border: 'border-emerald-100',
          darkBorder: 'dark:border-emerald-800',
          text: 'text-emerald-800',
          darkText: 'dark:text-emerald-300'
        }
    }
  }

  const planColors = getPlanColor(userPlan)

  return (
    <div className="flex flex-col h-full bg-[color:var(--dashboard-surface)] border-r border-[color:var(--dashboard-border)]">
      {/* Logo/Brand */}
      <div className="flex items-center h-16 px-6 border-b border-[color:var(--dashboard-border)]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br rounded-md flex items-center justify-center">
            <img src="/mywoki-logo.png" alt="Logo" className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[color:var(--dashboard-text)]">mywoki</h1>
            <p className="text-xs text-[color:var(--dashboard-muted)]">Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "text-[color:var(--dashboard-muted)] hover:bg-[color:var(--dashboard-border)]"
              )
            }
          >
            <item.icon className={cn(
              "mr-3 h-5 w-5",
              "group-hover:scale-110 transition-transform"
            )} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Plan info */}
      <div className="px-4 py-4">
        <div className={cn(
          "bg-gradient-to-r rounded-lg p-4 border",
          planColors.bgFrom,
          planColors.bgTo,
          planColors.darkBgFrom,
          planColors.darkBgTo,
          planColors.border,
          planColors.darkBorder
        )}>
          <p className={cn(
            "text-xs font-medium mb-1",
            planColors.text,
            planColors.darkText
          )}>
            Current Plan
          </p>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-[color:var(--dashboard-border)] rounded w-20 mb-2"></div>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-[color:var(--dashboard-text)] mb-2">
                {formatPlanName(userPlan)}
              </p>
              
              {/* Show upgrade button only for starter plan */}
              {userPlan.toLowerCase() === 'starter' ? (
                <button
                  onClick={handleUpgradeClick}
                  className="w-full text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center justify-center gap-1 group"
                >
                  Upgrade
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    -&gt;
                  </span>
                </button>
              ) : userPlan.toLowerCase() === 'core' ? (
                <button
                  onClick={handleUpgradeClick}
                  className="w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-1 group"
                >
                  Upgrade to Growth
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    -&gt;
                  </span>
                </button>
              ) : (
                <p className="text-xs text-[color:var(--dashboard-muted)]">
                  Maximum plan
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="border-t border-[color:var(--dashboard-border)] px-4 py-4 space-y-1">
        {footerItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
                  : "text-[color:var(--dashboard-muted)] hover:bg-[color:var(--dashboard-border)]"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
        
        {/* Quick link to home */}
        <a
          href="/"
          className="flex items-center px-3 py-2.5 text-sm font-medium text-[color:var(--dashboard-muted)] hover:bg-[color:var(--dashboard-border)] rounded-lg"
        >
          <Home className="mr-3 h-5 w-5" />
          Back to Home
        </a>
      </div>
    </div>
  )
}

