
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { supabase } from "../lib/supabase"
import {
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Zap
} from "lucide-react"

interface RealTimeEvent {
  id: string
  type: 'tool_activation' | 'user_signup' | 'notification_sent' | 'error'
  user_id: string
  user_name: string
  user_email: string
  tool_name?: string
  message: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
}

interface ActiveSession {
  user_id: string
  user_name: string
  user_email: string
  last_activity: string
  active_tools: number
}

export default function LiveMonitoring() {
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy' as 'healthy' | 'degraded' | 'down',
    uptime: 99.9,
    responseTime: 120,
    activeConnections: 0
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadInitialData()
    setupRealtimeSubscription()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadInitialData() {
    await Promise.all([loadEvents(), loadActiveSessions(), loadSystemHealth()])
  }

  async function loadData() {
    setIsRefreshing(true)
    await Promise.all([loadEvents(), loadActiveSessions(), loadSystemHealth()])
    setIsRefreshing(false)
  }

  async function loadEvents() {
    try {
      // Get recent tool activations
      const { data: activations } = await supabase
        .from('user_tool_activations')
        .select(`
          *,
          tools(name),
          users(name, email)
        `)
        .order('activated_at', { ascending: false })
        .limit(20)

      const activationEvents: RealTimeEvent[] = (activations || []).map(act => ({
        id: act.id,
        type: 'tool_activation',
        user_id: act.user_id,
        user_name: act.users?.name || 'Unknown',
        user_email: act.users?.email || 'Unknown',
        tool_name: act.tools?.name,
        message: `activated ${act.tools?.name}`,
        timestamp: act.activated_at,
        severity: 'low'
      }))

      // Get recent user signups
      const { data: signups } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      const signupEvents: RealTimeEvent[] = (signups || []).map(user => ({
        id: user.id,
        type: 'user_signup',
        user_id: user.id,
        user_name: user.name || 'New User',
        user_email: user.email,
        message: 'signed up',
        timestamp: user.created_at,
        severity: 'low'
      }))

      // Combine and sort events
      const allEvents = [...activationEvents, ...signupEvents]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15)

      setEvents(allEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  async function loadActiveSessions() {
    try {
      // Simulate active sessions (in real app, track actual sessions)
      const { data: users } = await supabase
        .from('users')
        .select('id, name, email, last_login')
        .order('last_login', { ascending: false })
        .limit(10)

      const sessions = await Promise.all(
        (users || []).map(async (user) => {
          const { count } = await supabase
            .from('user_tool_activations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_active', true)

          return {
            user_id: user.id,
            user_name: user.name || 'Unknown',
            user_email: user.email,
            last_activity: user.last_login || new Date().toISOString(),
            active_tools: count || 0
          }
        })
      )

      setActiveSessions(sessions)
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  async function loadSystemHealth() {
    try {
      // Simulate system health metrics
      // In a real app, these would come from your backend/API
      const randomResponseTime = Math.floor(Math.random() * 100) + 50
      const randomConnections = Math.floor(Math.random() * 100) + 20

      setSystemHealth({
        status: randomResponseTime > 300 ? 'degraded' : 'healthy',
        uptime: 99.9,
        responseTime: randomResponseTime,
        activeConnections: randomConnections
      })
    } catch (error) {
      console.error('Error loading system health:', error)
    }
  }

  function setupRealtimeSubscription() {
    // Subscribe to tool activation events
    const subscription = supabase
      .channel('tool_activations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_tool_activations'
        },
        (payload) => {
          // Add new event to the list
          const newEvent: RealTimeEvent = {
            id: payload.new.id,
            type: 'tool_activation',
            user_id: payload.new.user_id,
            user_name: 'User', // Would fetch user details
            user_email: '', // Would fetch user details
            tool_name: '', // Would fetch tool details
            message: 'activated a tool',
            timestamp: payload.new.activated_at,
            severity: 'low'
          }
          setEvents(prev => [newEvent, ...prev.slice(0, 14)])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const getEventIcon = (type: RealTimeEvent['type']) => {
    switch (type) {
      case 'tool_activation':
        return <Zap className="w-4 h-4 text-emerald-500" />
      case 'user_signup':
        return <Users className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'degraded': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      case 'down': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diff = now.getTime() - past.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Live Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time platform activity and system health
          </p>
        </div>
        <Button 
          onClick={loadData} 
          variant="outline"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">System Status</p>
              <p className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getHealthColor(systemHealth.status)}`}>
                {systemHealth.status.toUpperCase()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              {systemHealth.status === 'healthy' ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {systemHealth.uptime}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Response Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {systemHealth.responseTime}ms
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Connections</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {systemHealth.activeConnections}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Real-time Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Events Feed */}
        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-time Events
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent events
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{event.user_name}</span> {event.message}
                      {event.tool_name && (
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {' '}{event.tool_name}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {event.user_email}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatTimeAgo(event.timestamp)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active Sessions */}
        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Sessions
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {activeSessions.length} active
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {activeSessions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No active sessions
              </p>
            ) : (
              activeSessions.map((session) => (
                <div
                  key={session.user_id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-medium">
                      {session.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user_email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(session.last_activity)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.active_tools} active tools
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          System Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">24%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500" 
                style={{ width: '24%' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">62%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: '62%' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database Connections</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">18/50</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500" 
                style={{ width: '36%' }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
