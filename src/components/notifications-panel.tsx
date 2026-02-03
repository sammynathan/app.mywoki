// notifications-panel.tsx - Updated with real data
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
  intent?: 'activate_tool' | 'billing' | 'review' | 'learn'
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export default function NotificationsPanel({ 
  onClose, 
  notifications, 
  onMarkAsRead,
  onClearAll 
}: NotificationsPanelProps) {
  const navigate = useNavigate()

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getCTA = (intent?: string) => {
    switch (intent) {
      case 'activate_tool':
        return 'Activate ->'
      case 'billing':
        return 'Fix billing ->'
      case 'review':
        return 'Review ->'
      case 'learn':
        return 'Learn ->'
      default:
        return null
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id)
    
    // Navigate based on notification data
    if (notification.data?.tool_id) {
      navigate(`/dashboard/tools/${notification.data.tool_id}`)
    } else if (notification.type === 'error' && notification.data?.category === 'billing') {
      navigate('/dashboard/billing')
    } else if (notification.type === 'info' && notification.data?.category === 'support') {
      navigate('/dashboard/support')
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
      if (unreadIds.length > 0) {
        await supabase
          .from('notifications')
          .update({ read: true })
          .in('id', unreadIds)
        
        notifications.forEach(n => {
          if (!n.read) onMarkAsRead(n.id)
        })
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  return (
    <div className="flex flex-col h-96 w-full bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)] shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-[color:var(--dashboard-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[color:var(--dashboard-text)]">Notifications</h2>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-3 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-[color:var(--dashboard-border)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[color:var(--dashboard-muted)]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <AlertCircle className="w-12 h-12 text-[color:var(--dashboard-border)] mb-4" />
              <p className="text-[color:var(--dashboard-text)]">No notifications yet</p>
              <p className="text-[color:var(--dashboard-muted)] text-sm mt-2">
                Notifications about your tools and account will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[color:var(--dashboard-border)]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 cursor-pointer transition-all hover:bg-[color:var(--dashboard-border)] ${getBackgroundColor(
                    notification.type
                  )} ${!notification.read ? 'border-l-green-500' : 'border-transparent'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold text-[color:var(--dashboard-text)]">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-[color:var(--dashboard-muted)] mt-1">{notification.message}</p>
                      {notification.intent && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 inline-block">
                          {getCTA(notification.intent)}
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-[color:var(--dashboard-muted)]">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-[color:var(--dashboard-border)] p-4">
            <button
              onClick={onClearAll}
              className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        )}
    </div>
  )
}
