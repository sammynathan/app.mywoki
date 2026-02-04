
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { supabase } from "../lib/supabase"
import { useAuth } from "../auth/AuthContext"
import {
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  AlertTriangle
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

interface Incident {
  id: string
  title: string
  description: string | null
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'monitoring' | 'resolved'
  created_at: string
  component?: string | null
}

export default function LiveMonitoring() {
  const { userId } = useAuth()
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [showIncidentForm, setShowIncidentForm] = useState(false)
  const [reportingIncident, setReportingIncident] = useState(false)
  const [incidentForm, setIncidentForm] = useState({
    title: "",
    description: "",
    severity: "medium" as Incident["severity"],
    component: "platform"
  })
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
    await Promise.all([loadEvents(), loadActiveSessions(), loadSystemHealth(), loadIncidents()])
  }

  async function loadData() {
    setIsRefreshing(true)
    await Promise.all([loadEvents(), loadActiveSessions(), loadSystemHealth(), loadIncidents()])
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
      const activeWindow = new Date(Date.now() - 15 * 60 * 1000).toISOString()

      const { data: sessionsData } = await supabase
        .from('user_sessions')
        .select('user_id, last_seen, users(name, email)')
        .gte('last_seen', activeWindow)
        .order('last_seen', { ascending: false })
        .limit(10)

      const sessions = await Promise.all(
        (sessionsData || []).map(async (session) => {
          const { count } = await supabase
            .from('user_tool_activations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user_id)
            .eq('is_active', true)

          return {
            user_id: session.user_id,
            user_name: session.users?.name || 'Unknown',
            user_email: session.users?.email || 'Unknown',
            last_activity: session.last_seen,
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
      const activeWindow = new Date(Date.now() - 15 * 60 * 1000).toISOString()

      const start = performance.now()
      const { error } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
      const responseTime = Math.round(performance.now() - start)

      const { count: activeConnections } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', activeWindow)

      const status = error
        ? 'down'
        : responseTime > 800
          ? 'degraded'
          : 'healthy'

      const uptime = status === 'down' ? 0 : status === 'degraded' ? 98.5 : 99.9

      setSystemHealth({
        status,
        uptime,
        responseTime,
        activeConnections: activeConnections || 0
      })

      await maybeAutoReportIncident(status, responseTime, activeConnections || 0)
    } catch (error) {
      console.error('Error loading system health:', error)
    }
  }

  async function maybeAutoReportIncident(
    status: 'healthy' | 'degraded' | 'down',
    responseTime: number,
    activeConnections: number
  ) {
    if (status === 'healthy') return

    const { data: existing } = await supabase
      .from('incidents')
      .select('id')
      .in('status', ['open', 'monitoring'])
      .order('created_at', { ascending: false })
      .limit(1)

    if (existing && existing.length > 0) return

    const title = status === 'down'
      ? 'Service outage detected'
      : 'Degraded performance detected'

    const description = `Automated check detected ${status} status. Response time: ${responseTime}ms. Active sessions: ${activeConnections}.`

    await supabase
      .from('incidents')
      .insert({
        title,
        description,
        severity: status === 'down' ? 'critical' : 'high',
        status: 'open',
        component: 'platform',
        reported_by: userId || null
      })
  }

  async function loadIncidents() {
    try {
      const { data } = await supabase
        .from('incidents')
        .select('id, title, description, severity, status, created_at, component')
        .order('created_at', { ascending: false })
        .limit(10)

      setIncidents(data || [])
    } catch (error) {
      console.error('Error loading incidents:', error)
    }
  }

  const reportIncident = async () => {
    if (!incidentForm.title.trim()) return

    setReportingIncident(true)
    try {
      const { error } = await supabase
        .from('incidents')
        .insert({
          title: incidentForm.title.trim(),
          description: incidentForm.description.trim() || null,
          severity: incidentForm.severity,
          status: 'open',
          component: incidentForm.component,
          reported_by: userId || null
        })

      if (error) throw error

      setIncidentForm({ title: "", description: "", severity: "medium", component: "platform" })
      setShowIncidentForm(false)
      loadIncidents()
    } catch (error) {
      console.error('Error reporting incident:', error)
    } finally {
      setReportingIncident(false)
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
        async (payload) => {
          const { data } = await supabase
            .from('user_tool_activations')
            .select('id, activated_at, user_id, tools(name), users(name, email)')
            .eq('id', payload.new.id)
            .single()

          if (!data) return

          const newEvent: RealTimeEvent = {
            id: data.id,
            type: 'tool_activation',
            user_id: data.user_id,
            user_name: data.users?.name || 'User',
            user_email: data.users?.email || '',
            tool_name: data.tools?.name,
            message: `activated ${data.tools?.name || 'a tool'}`,
            timestamp: data.activated_at || new Date().toISOString(),
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

  const getIncidentSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
    }
  }

  const getIncidentStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'resolved': return 'text-emerald-600 dark:text-emerald-400'
      case 'monitoring': return 'text-amber-600 dark:text-amber-400'
      default: return 'text-red-600 dark:text-red-400'
    }
  }

  const formatComponentLabel = (component?: string | null) => {
    const key = (component || 'platform').toLowerCase()
    switch (key) {
      case 'api': return 'API'
      case 'dashboard': return 'Dashboard'
      case 'storage': return 'Storage'
      case 'tools': return 'Tools'
      case 'realtime': return 'Realtime'
      default: return 'Platform'
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

  const cpuUsage = Math.min(100, Math.max(1, Math.round(systemHealth.responseTime / 10)))
  const memoryUsage = Math.min(100, Math.max(1, Math.round((systemHealth.activeConnections / 50) * 100)))
  const dbConnections = systemHealth.activeConnections

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

      {/* Incidents */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incident Reports
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track and report platform incidents
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowIncidentForm((prev) => !prev)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report incident
          </Button>
        </div>

        {showIncidentForm && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Incident title
                </label>
                <input
                  value={incidentForm.title}
                  onChange={(event) => setIncidentForm({ ...incidentForm, title: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  placeholder="Short description of the incident"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Severity
                </label>
                <select
                  value={incidentForm.severity}
                  onChange={(event) =>
                    setIncidentForm({
                      ...incidentForm,
                      severity: event.target.value as Incident["severity"]
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Affected component
                </label>
                <select
                  value={incidentForm.component}
                  onChange={(event) =>
                    setIncidentForm({
                      ...incidentForm,
                      component: event.target.value
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="platform">Platform</option>
                  <option value="api">API</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="storage">Storage</option>
                  <option value="tools">Tools</option>
                  <option value="realtime">Realtime</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (optional)
              </label>
              <textarea
                value={incidentForm.description}
                onChange={(event) =>
                  setIncidentForm({ ...incidentForm, description: event.target.value })
                }
                className="mt-2 w-full min-h-[120px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                placeholder="Add any extra context or steps to reproduce"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                onClick={reportIncident}
                disabled={reportingIncident || !incidentForm.title.trim()}
              >
                {reportingIncident ? "Reporting..." : "Submit incident"}
              </Button>
            </div>
          </div>
        )}

        {incidents.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No incidents reported.
          </p>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-800 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {incident.title}
                    </p>
                    <p className={`text-xs font-medium ${getIncidentStatusColor(incident.status)}`}>
                      {incident.status.toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getIncidentSeverityColor(incident.severity)}`}>
                    {incident.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {formatComponentLabel(incident.component)}
                  </span>
                </div>
                {incident.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {incident.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reported {new Date(incident.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* System Metrics */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          System Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated CPU Usage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{cpuUsage}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500" 
                style={{ width: `${cpuUsage}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Memory Usage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{memoryUsage}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${memoryUsage}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions (15m)</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{dbConnections}/50</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500" 
                style={{ width: `${Math.min(100, Math.round((dbConnections / 50) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
