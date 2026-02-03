
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { supabase } from "../lib/supabase"
import { 
  Zap, 
  Activity, 
  Users, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Bell
} from "lucide-react"

// Import the notification service
import { notificationService } from "../lib/notifications"

interface ActivationStats {
  totalActivations: number
  recentActivations: number
  topActivatingUsers: Array<{ 
    id: string
    name: string; 
    email: string; 
    count: number 
  }>
  popularTools: Array<{ 
    id: string
    name: string; 
    activations: number 
  }>
  activationTrend: Array<{ 
    date: string; 
    count: number 
  }>
}

export default function ToolActivationManager() {
  const [stats, setStats] = useState<ActivationStats>({
    totalActivations: 0,
    recentActivations: 0,
    topActivatingUsers: [],
    popularTools: [],
    activationTrend: []
  })
  const [loading, setLoading] = useState(true)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [bulkMessage, setBulkMessage] = useState("")
  const [isSendingBulk, setIsSendingBulk] = useState(false)

  useEffect(() => {
    loadActivationStats()
  }, [])

  async function loadActivationStats() {
    setLoading(true)
    try {
      // Get total activations
      const { count: totalActivations } = await supabase
        .from('user_tool_activations')
        .select('*', { count: 'exact', head: true })

      // Get recent activations (last 24 hours)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const { count: recentActivations } = await supabase
        .from('user_tool_activations')
        .select('*', { count: 'exact', head: true })
        .gte('activated_at', dayAgo.toISOString())

      // Get top activating users
      const { data: userActivations } = await supabase
        .from('user_tool_activations')
        .select('user_id, users!inner(name, email)')
        .eq('is_active', true)

      const userMap = new Map<string, { id: string; name: string; email: string; count: number }>()
      userActivations?.forEach(activation => {
        const userId = activation.user_id
        const userName = activation.users?.[0]?.name || 'Unknown'
        const userEmail = activation.users?.[0]?.email || 'Unknown'
        const current = userMap.get(userId) || {
          id: userId,
          name: userName,
          email: userEmail,
          count: 0
        }
        userMap.set(userId, { ...current, count: current.count + 1 })
      })

      const topActivatingUsers = Array.from(userMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Get popular tools
      const { data: toolActivations } = await supabase
        .from('user_tool_activations')
        .select('tool_id, tools!inner(name)')
        .eq('is_active', true)

      const toolMap = new Map<string, { id: string; name: string; activations: number }>()
      toolActivations?.forEach(activation => {
        const toolId = activation.tool_id
        const toolName = activation.tools?.[0]?.name || 'Unknown'
        const current = toolMap.get(toolId) || {
          id: toolId,
          name: toolName,
          activations: 0
        }
        toolMap.set(toolId, { ...current, activations: current.activations + 1 })
      })

      const popularTools = Array.from(toolMap.values())
        .sort((a, b) => b.activations - a.activations)
        .slice(0, 5)

      // Get activation trend (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const { data: trendData } = await supabase
        .from('user_tool_activations')
        .select('activated_at')
        .gte('activated_at', weekAgo.toISOString())

      const trendMap = new Map<string, number>()
      trendData?.forEach(activation => {
        const date = new Date(activation.activated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        const current = trendMap.get(date) || 0
        trendMap.set(date, current + 1)
      })

      const activationTrend = Array.from(trendMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setStats({
        totalActivations: totalActivations || 0,
        recentActivations: recentActivations || 0,
        topActivatingUsers,
        popularTools,
        activationTrend
      })
    } catch (error) {
      console.error('Error loading activation stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendBulkNotification = async () => {
    if (!bulkAction || !bulkMessage.trim()) {
      alert('Please select an action and enter a message')
      return
    }

    setIsSendingBulk(true)

    try {
      // Get all active users
      const { data: activeUsers, error } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('status', 'active')
        .limit(100) // Limit to 100 users for safety

      if (error) throw error
      if (!activeUsers || activeUsers.length === 0) {
        alert('No active users found')
        return
      }

      // Determine notification type based on action
      let type: 'success' | 'error' | 'warning' | 'info' = 'info'
      let title = 'Platform Update'
      
      switch (bulkAction) {
        case 'new_features':
          type = 'success'
          title = 'New Features Available! 🚀'
          break
        case 'maintenance':
          type = 'warning'
          title = 'Scheduled Maintenance ⚠️'
          break
        case 'promotion':
          type = 'info'
          title = 'Special Promotion! 🎁'
          break
      }

      // Send notifications to each user
      let successCount = 0
      let errorCount = 0

      for (const user of activeUsers) {
        const result = await notificationService.create({
          userId: user.id,
          type,
          title,
          message: bulkMessage,
          data: {
            category: 'admin_bulk',
            action: bulkAction,
            sent_at: new Date().toISOString()
          },
          intent: 'promotion'
        })

        if (result.success) {
          successCount++
        } else {
          errorCount++
          console.error(`Failed to send to ${user.email}:`, result.error)
        }

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      alert(`✅ Sent ${successCount} notifications successfully\n❌ Failed: ${errorCount}`)
      
      // Reset form
      setBulkAction("")
      setBulkMessage("")
    } catch (error: any) {
      console.error('Error sending bulk notification:', error)
      alert(`Failed to send notifications: ${error.message}`)
    } finally {
      setIsSendingBulk(false)
    }
  }

  const runMaintenance = async () => {
    if (!confirm('This will deactivate tools that haven\'t been used in 30 days. Continue?')) {
      return
    }

    try {
      // Deactivate tools that haven't been used in 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const { data: oldActivations, error } = await supabase
        .from('user_tool_activations')
        .select('id, user_id, tools(name)')
        .eq('is_active', true)
        .lt('last_used_at', thirtyDaysAgo.toISOString())
        .limit(100)

      if (error) throw error

      if (oldActivations && oldActivations.length > 0) {
        const ids = oldActivations.map(act => act.id)
        
        // Update in batch
        const { error: updateError } = await supabase
          .from('user_tool_activations')
          .update({ 
            is_active: false,
            deactivated_at: new Date().toISOString()
          })
          .in('id', ids)

        if (updateError) throw updateError

        // Notify users about deactivated tools
        let notificationCount = 0
        for (const activation of oldActivations) {
          const result = await notificationService.sendToolDeactivatedNotification(
            activation.user_id,
            activation.tools?.[0]?.name || 'a tool',
            activation.id
          )

          if (result.success) notificationCount++
        }

        alert(`✅ Deactivated ${oldActivations.length} inactive tools\n📨 Sent ${notificationCount} notifications`)
        loadActivationStats()
      } else {
        alert('✅ No inactive tools found')
      }
    } catch (error: any) {
      console.error('Error running maintenance:', error)
      alert(`❌ Maintenance failed: ${error.message}`)
    }
  }

  const sendTestNotification = async () => {
    try {
      // Get current user for testing
      const userId = localStorage.getItem('user_id')
      if (!userId) {
        alert('Please log in to test notifications')
        return
      }

      const result = await notificationService.create({
        userId,
        type: 'success',
        title: 'Test Notification ✅',
        message: 'This is a test notification from the activation manager.',
        data: { test: true, timestamp: new Date().toISOString() },
        intent: 'review'
      })

      if (result.success) {
        alert('✅ Test notification sent! Check your notifications panel.')
      } else {
        alert(`❌ Failed: ${result.error}`)
      }
    } catch (error: any) {
      console.error('Test notification error:', error)
      alert(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--dashboard-text)]">
            Tool Activation Manager
          </h1>
          <p className="text-[color:var(--dashboard-muted)]">
            Monitor and manage tool activations across the platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={sendTestNotification}
            className="gap-2"
          >
            <Bell className="w-4 h-4" />
            Test Notification
          </Button>
          <Button variant="outline" onClick={runMaintenance}>
            Run Maintenance
          </Button>
          <Button onClick={loadActivationStats} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[color:var(--dashboard-surface)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Total Activations</p>
              <p className="text-2xl font-bold text-[color:var(--dashboard-text)] mt-2">
                {stats.totalActivations.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[color:var(--dashboard-surface)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Recent (24h)</p>
              <p className="text-2xl font-bold text-[color:var(--dashboard-text)] mt-2">
                {stats.recentActivations}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[color:var(--dashboard-surface)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Avg. Per User</p>
              <p className="text-2xl font-bold text-[color:var(--dashboard-text)] mt-2">
                {stats.topActivatingUsers.length > 0
                  ? (stats.totalActivations / stats.topActivatingUsers.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[color:var(--dashboard-surface)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Growth Trend</p>
              <p className="text-2xl font-bold text-[color:var(--dashboard-text)] mt-2">
                {stats.activationTrend.length > 1
                  ? stats.activationTrend[stats.activationTrend.length - 1].count
                  : 0
                }
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Top Users and Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Activating Users */}
        <Card className="p-6 bg-[color:var(--dashboard-surface)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[color:var(--dashboard-text)]">
              Top Activating Users
            </h3>
            <span className="text-xs text-[color:var(--dashboard-muted)]">
              {stats.topActivatingUsers.length} users
            </span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-[color:var(--dashboard-muted)]">Loading...</p>
              </div>
            ) : stats.topActivatingUsers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-[color:var(--dashboard-muted)]">No user data available</p>
              </div>
            ) : (
              stats.topActivatingUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-[color:var(--dashboard-border)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="max-w-[200px]">
                      <p className="text-sm font-medium text-[color:var(--dashboard-text)] truncate">
                        {user.name || 'Unnamed User'}
                      </p>
                      <p className="text-xs text-[color:var(--dashboard-muted)] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-[color:var(--dashboard-text)]">
                      {user.count} tools
                    </div>
                    {index < 3 && (
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          #{index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Popular Tools */}
        <Card className="p-6 bg-[color:var(--dashboard-surface)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[color:var(--dashboard-text)]">
              Most Popular Tools
            </h3>
            <span className="text-xs text-[color:var(--dashboard-muted)]">
              by activations
            </span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-[color:var(--dashboard-muted)]">Loading...</p>
              </div>
            ) : stats.popularTools.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-[color:var(--dashboard-muted)]">No tool data available</p>
              </div>
            ) : (
              stats.popularTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3 hover:bg-[color:var(--dashboard-border)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <div className="max-w-[200px]">
                      <p className="text-sm font-medium text-[color:var(--dashboard-text)] truncate">
                        {tool.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-[color:var(--dashboard-muted)]">
                      {tool.activations.toLocaleString()} activations
                    </div>
                    {index === 0 && (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card className="p-6 bg-[color:var(--dashboard-surface)]">
        <h3 className="text-lg font-semibold text-[color:var(--dashboard-text)] mb-4">
          Bulk Notification Sender
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--dashboard-text)] mb-2">
                Notification Type
              </label>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)]"
              >
                <option value="">Select notification type...</option>
                <option value="new_features">New Features Announcement</option>
                <option value="maintenance">Maintenance Notice</option>
                <option value="promotion">Special Promotion</option>
                <option value="general">General Announcement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[color:var(--dashboard-text)] mb-2">
                Message Preview
              </label>
              <div className="text-sm text-[color:var(--dashboard-muted)] p-2 bg-[color:var(--dashboard-surface)] rounded">
                {bulkAction === 'new_features' && '🎉 Exciting new features are now available!'}
                {bulkAction === 'maintenance' && '⚠️ Scheduled maintenance coming soon.'}
                {bulkAction === 'promotion' && '🎁 Special promotion for our users!'}
                {bulkAction === 'general' && '📢 Important platform announcement'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--dashboard-text)] mb-2">
              Custom Message (optional)
            </label>
            <textarea
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              placeholder="Enter your custom message here..."
              className="w-full px-3 py-2 rounded-lg border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)] min-h-[100px] resize-none"
            />
            <p className="text-xs text-[color:var(--dashboard-muted)] mt-1">
              {bulkMessage.length} characters
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm text-[color:var(--dashboard-text)]">
                    Bulk notifications are sent to all active users immediately.
                  </p>
                  <p className="text-xs text-[color:var(--dashboard-muted)] mt-1">
                    Use with caution. Notifications cannot be recalled.
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={sendBulkNotification}
              disabled={!bulkAction || isSendingBulk}
              className="gap-2"
            >
              {isSendingBulk ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Send to All Users
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Activation Trend */}
      <Card className="p-6 bg-[color:var(--dashboard-surface)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[color:var(--dashboard-text)]">
            Activation Trend (Last 7 Days)
          </h3>
          <div className="flex items-center gap-2 text-sm text-[color:var(--dashboard-muted)]">
            <Clock className="w-4 h-4" />
            Updated just now
          </div>
        </div>
        
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-[color:var(--dashboard-muted)]">Loading trend data...</p>
            </div>
          ) : stats.activationTrend.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-[color:var(--dashboard-muted)]">No activation data available</p>
            </div>
          ) : (
            stats.activationTrend.map((day) => {
              const maxCount = Math.max(...stats.activationTrend.map(d => d.count), 1)
              const percentage = (day.count / maxCount) * 100
              
              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[color:var(--dashboard-text)]">{day.date}</span>
                    <span className="text-[color:var(--dashboard-text)] font-medium">
                      {day.count} activation{day.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2 bg-[color:var(--dashboard-border)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}

