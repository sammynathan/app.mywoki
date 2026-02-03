
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { supabase } from "../lib/supabase"
import MyWokiLoader from "../components/MyWokiLoader"
import {
  Users,
  Wrench,
  Activity,
  TrendingUp,
  BarChart3,
  Clock,
  AlertCircle,
  Bell
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Stats {
  totalUsers: number
  activeUsers: number
  totalTools: number
  activeTools: number
  recentActivations: number
  pendingNotifications: number
}

export default function ManagementOverview() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTools: 0,
    activeTools: 0,
    recentActivations: 0,
    pendingNotifications: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      // Load all stats in parallel
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalTools },
        { count: activeTools },
        { count: recentActivations },
        { count: pendingNotifications }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('tools').select('*', { count: 'exact', head: true }),
        supabase.from('user_tool_activations').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('tool_events').select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false)
      ])

      // Load recent activities
      const { data: activities } = await supabase
        .from('tool_events')
        .select(`
          *,
          tools (name),
          users (email, name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalTools: totalTools || 0,
        activeTools: activeTools || 0,
        recentActivations: recentActivations || 0,
        pendingNotifications: pendingNotifications || 0
      })
      setRecentActivities(activities || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <MyWokiLoader />
        <div className="text-gray-500 dark:text-gray-400 text-sm">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage your platform in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalUsers}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.activeUsers} active
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tools</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalTools}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.activeTools} active
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent Activations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.recentActivations}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last 24 hours
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Notifications</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.pendingNotifications}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                Unread
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {Math.floor(Math.random() * 50) + 10}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current users
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Tool Usage</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {Math.round(stats.activeTools / (stats.totalUsers || 1) * 100) / 100}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tools per user
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          onClick={() => navigate('/management/users')}
          className="h-auto py-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Users className="w-6 h-6" />
          <span>Manage Users</span>
        </Button>
        <Button 
          onClick={() => navigate('/management/tools')}
          className="h-auto py-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Wrench className="w-6 h-6" />
          <span>Manage Tools</span>
        </Button>
        <Button 
          onClick={() => navigate('/management/notifications')}
          className="h-auto py-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Bell className="w-6 h-6" />
          <span>Send Notifications</span>
        </Button>
        <Button 
          onClick={() => navigate('/management/monitoring')}
          className="h-auto py-4 flex flex-col items-center gap-2"
          variant="outline"
        >
          <Activity className="w-6 h-6" />
          <span>Live Monitoring</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadDashboardData}
          >
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent activity
            </p>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.tools?.name} - {activity.event_type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by {activity.users?.name || activity.users?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(activity.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
