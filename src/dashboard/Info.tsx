import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { Button } from "../components/ui/button"
import NotificationsPanel from "../components/notifications-panel"
import type { Notification } from "../components/notifications-panel"
import { notificationService, subscribeToNotifications } from "../lib/notifications"
import { useAuth } from "../auth/AuthContext"

export default function Notifications() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [, setLoading] = useState(true)
  const { userId } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userId) {
      loadNotifications()
    }
  }, [userId])

  useEffect(() => {
    if (userId && notificationsOpen) {
      loadNotifications()
    }
  }, [notificationsOpen, userId])

  useEffect(() => {
    if (!userId) return

    const unsubscribe = subscribeToNotifications(userId, (newNotification) => {
      setNotifications(prev => {
        const filtered = prev.filter(n => !n.id.startsWith('sample-'))
        if (filtered.some(n => n.id === newNotification.id)) {
          return filtered
        }

        const transformed: Notification = {
          id: newNotification.id,
          type: newNotification.type as Notification['type'],
          title: newNotification.title,
          message: newNotification.message,
          data: newNotification.data,
          read: newNotification.read,
          created_at: newNotification.created_at,
          intent: newNotification.intent as Notification['intent']
        }

        const next = [transformed, ...filtered].slice(0, 10)
        setUnreadCount(next.filter(n => !n.read).length)
        return next
      })
    })

    return () => {
      unsubscribe()
    }
  }, [userId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])

  const loadNotifications = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const [countResult, notificationsResult] = await Promise.all([
        notificationService.getUnreadCount(userId),
        notificationService.getUserNotifications(userId, 10)
      ])

      if (countResult.success) {
        setUnreadCount(countResult.count)
      }

      if (notificationsResult.success) {
        // Transform lib notifications to component format
        let transformedNotifications: Notification[] = notificationsResult.notifications.map(n => ({
          id: n.id,
          type: n.type as Notification['type'],
          title: n.title,
          message: n.message,
          data: n.data,
          read: n.read,
          created_at: n.created_at,
          intent: n.intent as Notification['intent']
        }))

        // If no real notifications, show some sample ones
        if (transformedNotifications.length === 0) {
          transformedNotifications = [
            {
              id: 'sample-1',
              type: 'info',
              title: 'Welcome to mywoki!',
              message: 'Get started by exploring tools and activating your first project.',
              data: {},
              read: false,
              created_at: new Date().toISOString(),
              intent: 'learn'
            },
            {
              id: 'sample-2',
              type: 'success',
              title: 'Tool Available',
              message: 'New AI tools have been added to your workspace.',
              data: {},
              read: false,
              created_at: new Date(Date.now() - 3600000).toISOString(),
              intent: 'activate_tool'
            }
          ]
          setUnreadCount(2) // Set sample unread count
        }

        setNotifications(transformedNotifications)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    if (!userId) return

    // Skip database update for sample notifications
    if (!id.startsWith('sample-')) {
      const result = await notificationService.markAsRead(userId, id)
      if (!result.success) return
    }

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleClearAll = async () => {
    if (!userId) return

    // Skip database clear if all notifications are samples
    const hasRealNotifications = notifications.some(n => !n.id.startsWith('sample-'))
    if (hasRealNotifications) {
      const result = await notificationService.clearAll(userId)
      if (!result.success) return
    }

    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="relative rounded-full hover:bg-[color:var(--dashboard-border)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-[color:var(--dashboard-text)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {notificationsOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)] rounded-lg shadow-lg z-50">
          <NotificationsPanel
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAll}
          />
        </div>
      )}
    </div>
  )
}

