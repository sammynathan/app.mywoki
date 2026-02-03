
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"

import { supabase } from "../lib/supabase"
import MyWokiLoader from "../components/MyWokiLoader"
import {
  Send,
  Bell,
  Users,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle
} from "lucide-react"

interface NotificationTemplate {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  target: 'all' | 'specific_plan' | 'specific_users'
  plan_filter?: string
  user_ids?: string[]
  created_at: string
  sent_count: number
}

interface User {
  id: string
  email: string
  name: string
  plan: string
}

export default function NotificationsManagement() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  
  const [newNotification, setNewNotification] = useState<{
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
    target: 'all' | 'specific_plan' | 'specific_users'
    plan_filter: string
    user_ids: string[]
  }>({
    title: "",
    message: "",
    type: "info",
    target: "all",
    plan_filter: "",
    user_ids: []
  })

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Load templates
      const { data: templatesData } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false })

      setTemplates(templatesData || [])

      // Load users for selection
      const { data: usersData } = await supabase
        .from('users')
        .select('id, email, name, plan')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setUsers(usersData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      alert('Please fill in title and message')
      return
    }

    setSending(true)

    try {
      // Determine target users
      let targetUsers: User[] = []
      
      if (newNotification.target === 'all') {
        targetUsers = users
      } else if (newNotification.target === 'specific_plan' && newNotification.plan_filter) {
        targetUsers = users.filter(user => user.plan === newNotification.plan_filter)
      } else if (newNotification.target === 'specific_users' && selectedUserIds.length > 0) {
        targetUsers = users.filter(user => selectedUserIds.includes(user.id))
      }

      // Send notifications to each user
      const notifications = targetUsers.map(user => ({
        user_id: user.id,
        type: newNotification.type,
        title: newNotification.title,
        message: newNotification.message,
        data: {
          category: 'admin_notification',
          sent_at: new Date().toISOString()
        },
        intent: 'review'
      }))

      // Batch insert notifications
      const { error } = await supabase
        .from('notifications')
        .insert(notifications)

      if (error) throw error

      // Save as template
      await supabase
        .from('notification_templates')
        .insert([{
          ...newNotification,
          sent_count: targetUsers.length
        }])

      // Reset form
      setNewNotification({
        title: "",
        message: "",
        type: "info",
        target: "all",
        plan_filter: "",
        user_ids: []
      })
      setSelectedUserIds([])

      // Reload data
      loadData()

      alert(`Notification sent to ${targetUsers.length} users successfully!`)
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notifications Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Send notifications to users and manage templates
        </p>
      </div>

      {/* Send Notification Form */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Send New Notification
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Title
                </label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="info">Information</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience
                </label>
                <select
                  value={newNotification.target}
                  onChange={(e) => {
                    setNewNotification({ 
                      ...newNotification, 
                      target: e.target.value as any,
                      plan_filter: "",
                      user_ids: []
                    })
                    setSelectedUserIds([])
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Users</option>
                  <option value="specific_plan">Specific Plan</option>
                  <option value="specific_users">Specific Users</option>
                </select>
              </div>

              {newNotification.target === 'specific_plan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Plan
                  </label>
                  <select
                    value={newNotification.plan_filter}
                    onChange={(e) => setNewNotification({ ...newNotification, plan_filter: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a plan</option>
                    <option value="starter">Starter</option>
                    <option value="core">Core</option>
                    <option value="growth">Growth</option>
                  </select>
                </div>
              )}

              {newNotification.target === 'specific_users' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Users
                  </label>
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={selectedUserIds.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUserIds([...selectedUserIds, user.id])
                            } else {
                              setSelectedUserIds(selectedUserIds.filter(id => id !== user.id))
                            }
                          }}
                          className="rounded"
                        />
                        <label htmlFor={`user-${user.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                          {user.name || user.email} ({user.plan})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <Textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                placeholder="Enter your notification message here..."
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {newNotification.message.length} characters
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={sendNotification}
              disabled={sending || !newNotification.title || !newNotification.message}
              className="gap-2"
            >
              {sending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Templates */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Templates
          </h3>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <MyWokiLoader />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No templates yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Create your first notification template above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map(template => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border ${getTypeColor(template.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getTypeIcon(template.type)}
                    <div>
                      <h4 className="font-medium">{template.title}</h4>
                      <p className="text-sm mt-1">{template.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Sent to {template.sent_count} users
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(template.created_at).toLocaleDateString()}
                        </span>
                        <span className="capitalize">{template.target}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setNewNotification({
                        ...template,
                        user_ids: [],
                        plan_filter: template.plan_filter || ""
                      })
                      if (template.user_ids) {
                        setSelectedUserIds(template.user_ids)
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
