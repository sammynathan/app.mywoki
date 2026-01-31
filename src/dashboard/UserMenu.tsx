import { useState, useRef, useEffect } from "react"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"

interface UserMenuProps {
  userName?: string | null
}

export default function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U'

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-medium">
          {userInitial}
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {userName || "User"}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-lg rounded-lg z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b dark:border-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userName || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Free Plan • Upgrade available
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/dashboard/settings')
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left flex items-center text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <User className="h-4 w-4 mr-3" />
              Your Profile
            </button>
            
            <button
              onClick={() => {
                navigate('/dashboard/settings')
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left flex items-center text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t dark:border-gray-800 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left flex items-center text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign out
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}