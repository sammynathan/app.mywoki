import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import ChatWidget from "../components/ChatWidget"
import KeyboardShortcutsGuide from "../components/context/KeyboardShortcutsGuide"

export default function DashboardLayout() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleMenuClick = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Hidden on mobile, shown on desktop or when mobile menu is open */}
      <aside className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 lg:block ${showMobileMenu ? 'block' : 'hidden'}`}>
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
        {/* Header - Fixed */}
        <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
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
