import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import ChatWidget from "../components/ChatWidget"
import KeyboardShortcutsGuide from "../components/context/KeyboardShortcutsGuide"
import MaintenanceBanner from "../components/MaintenanceBanner"
import StatusBanner from "../components/StatusBanner"
import useSessionHeartbeat from "../hooks/useSessionHeartbeat"

export default function DashboardLayout() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  useSessionHeartbeat("dashboard")

  const handleMenuClick = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <div className="flex h-screen bg-[color:var(--dashboard-bg)] text-[color:var(--dashboard-text)]">
      {/* Sidebar - Hidden on mobile, shown on desktop or when mobile menu is open */}
      <aside className={`w-64 bg-[color:var(--dashboard-surface)] border-r border-[color:var(--dashboard-border)] lg:block ${showMobileMenu ? 'block' : 'hidden'}`}>
        <Sidebar />
      </aside>

      {/* Mobile overlay when sidebar is open */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-h-0">
        <StatusBanner />
        <MaintenanceBanner />
        {/* Header - Fixed */}
        <header className="shrink-0 bg-[color:var(--dashboard-surface)] border-b border-[color:var(--dashboard-border)]">
          <DashboardHeader
            onMenuClick={handleMenuClick}
            showMobileMenu={showMobileMenu}
          />
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
      <ChatWidget />
      <KeyboardShortcutsGuide />
    </div>
  )
}
