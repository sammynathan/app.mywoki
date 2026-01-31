import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import ChatWidget from "../components/ChatWidget"
import KeyboardShortcutsGuide from "../components/context/KeyboardShortcutsGuide"
export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Fixed height */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header - Fixed */}
        <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <DashboardHeader />
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