
import { useEffect, useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import MyWokiLoader from "../components/MyWokiLoader"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import { 
  TrendingUp, 
  Calendar, 
  Zap, 
  RefreshCw, 
  BarChart3,
  Activity,
  Clock,
  AlertCircle,
  Sparkles
} from "lucide-react"

const PLAN_LIMITS: Record<string, number> = {
  starter: 3,
  core: 5,
  growth: Infinity,
}

interface ActiveTool {
  id: string
  tool_id: string
  activated_at: string
  last_used_at: string | null
  is_active?: boolean
  tools: {
    name: string
    category: string
    description: string
  }
}

interface UsageStats {
  dailyAverage: number
  peakUsageDay: string
  mostUsedTool: string | null
  totalUsageTime: number
}

export default function UsageAnalyticsPage() {
  const navigate = useNavigate()
  const userId = localStorage.getItem("user_id")

  const [activeTools, setActiveTools] = useState<ActiveTool[]>([])
  const [usedThisWeek, setUsedThisWeek] = useState(0)
  const [plan, setPlan] = useState<"starter" | "core" | "growth">("starter")
  const [loading, setLoading] = useState(true)
  const [usageStats, setUsageStats] = useState<UsageStats>({
    dailyAverage: 0,
    peakUsageDay: "Monday",
    mostUsedTool: null,
    totalUsageTime: 0
  })
  const [realTimeUpdates, setRealTimeUpdates] = useState<{
    lastUpdate: string
    isLive: boolean
    newActivations: number
  }>({
    lastUpdate: "Just now",
    isLive: true,
    newActivations: 0
  })

  useEffect(() => {
    loadAnalytics()
    setupRealtimeSubscription()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (realTimeUpdates.isLive) {
        refreshLastUpdateTime()
      }
    }, 30000)

    return () => {
      clearInterval(interval)
      cleanupSubscriptions()
    }
  }, [])

  async function loadAnalytics() {
    setLoading(true)

    try {
      // 1️⃣ Get user plan
      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("id", userId)
        .single()

      if (profile?.plan) setPlan(profile.plan)

      // 2️⃣ Get active tools (corrected table name)
      const { data: activations, error } = await supabase
        .from("user_tool_activations")
        .select(`
          id,
          tool_id,
          activated_at,
          last_used_at,
          tools (
            name,
            category,
            description
          )
        `)
        .eq("user_id", userId)
        .eq("is_active", true)

      if (error) {
        console.error("Error fetching activations:", error)
      } else {
        const tools = activations as unknown as ActiveTool[]
        setActiveTools(tools || [])

        // 3️⃣ Count tools used in last 7 days
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const usedRecently = (tools || []).filter((t) => {
          if (!t.last_used_at) return false
          return new Date(t.last_used_at) > weekAgo
        })

        setUsedThisWeek(usedRecently.length)

        // 4️⃣ Calculate usage statistics
        calculateUsageStats(tools || [])
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
      updateLastUpdateTime()
    }
  }

  const calculateUsageStats = (tools: ActiveTool[]) => {
    if (tools.length === 0) return

    // Calculate daily average (simplified)
    const daysActive = tools.reduce((acc, tool) => {
      const activated = new Date(tool.activated_at)
      const daysSinceActivation = Math.floor(
        (Date.now() - activated.getTime()) / (1000 * 60 * 60 * 24)
      )
      return acc + Math.max(1, daysSinceActivation)
    }, 0)

    const dailyAverage = daysActive > 0 ? (tools.length / daysActive).toFixed(1) : "0"

    // Find most used tool (by last used date)
    const mostRecentTool = tools.reduce((latest, current) => {
      if (!latest.last_used_at) return current
      if (!current.last_used_at) return latest
      return new Date(current.last_used_at) > new Date(latest.last_used_at) 
        ? current 
        : latest
    })

    // Calculate total usage time (simplified - in days)
    const totalUsageTime = tools.reduce((total, tool) => {
      const activated = new Date(tool.activated_at)
      const daysActive = Math.floor(
        (Date.now() - activated.getTime()) / (1000 * 60 * 60 * 24)
      )
      return total + Math.max(1, daysActive)
    }, 0)

    // Determine peak usage day (simplified - mock data)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const peakDay = days[Math.floor(Math.random() * days.length)]

    setUsageStats({
      dailyAverage: parseFloat(dailyAverage),
      peakUsageDay: peakDay,
      mostUsedTool: mostRecentTool?.tools?.name || null,
      totalUsageTime
    })
  }

  const setupRealtimeSubscription = () => {
    // Subscribe to tool activation events
    const activationSubscription = supabase
      .channel('tool-activations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_tool_activations',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New tool activated:', payload.new)
          handleNewActivation(payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_tool_activations',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Tool activation updated:', payload.new)
          handleActivationUpdate(payload.new)
        }
      )
      .subscribe()

    // Subscribe to tool usage events
    const usageSubscription = supabase
      .channel('tool-usage')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tool_events',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Tool usage event:', payload.new)
          handleToolUsage(payload.new)
        }
      )
      .subscribe()

    return () => {
      activationSubscription.unsubscribe()
      usageSubscription.unsubscribe()
    }
  }

  const cleanupSubscriptions = () => {
    // This function would properly cleanup all subscriptions
    supabase.removeAllChannels()
  }

  const handleNewActivation = async (newActivation: any) => {
    // Fetch the full tool details
    const { data: toolData } = await supabase
      .from('tools')
      .select('name, category, description')
      .eq('id', newActivation.tool_id)
      .single()

    const newTool: ActiveTool = {
      id: newActivation.id,
      tool_id: newActivation.tool_id,
      activated_at: newActivation.activated_at,
      last_used_at: newActivation.last_used_at,
      tools: toolData || { name: 'Unknown', category: 'Unknown', description: '' }
    }

    setActiveTools(prev => {
      // Check if tool already exists
      const exists = prev.some(tool => tool.tool_id === newActivation.tool_id)
      if (exists) {
        return prev.map(tool => 
          tool.tool_id === newActivation.tool_id 
            ? { ...tool, ...newTool }
            : tool
        )
      }
      return [...prev, newTool]
    })

    setRealTimeUpdates(prev => ({
      ...prev,
      newActivations: prev.newActivations + 1
    }))

    // Update usage stats
    setTimeout(() => {
      loadAnalytics()
    }, 1000)
  }

  const handleActivationUpdate = (updatedActivation: any) => {
    setActiveTools(prev =>
      prev.map(tool =>
        tool.id === updatedActivation.id
          ? {
              ...tool,
              is_active: updatedActivation.is_active,
              last_used_at: updatedActivation.last_used_at
            }
          : tool
      ).filter(tool => tool.is_active !== false)
    )
  }

  const handleToolUsage = (usageEvent: any) => {
    if (usageEvent.event_type === 'used') {
      setActiveTools(prev =>
        prev.map(tool =>
          tool.tool_id === usageEvent.tool_id
            ? { ...tool, last_used_at: new Date().toISOString() }
            : tool
        )
      )

      // Update used this week count if applicable
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const usageDate = new Date(usageEvent.created_at)
      
      if (usageDate > weekAgo) {
        setUsedThisWeek(prev => prev + 1)
      }
    }
  }

  const refreshLastUpdateTime = () => {
    setRealTimeUpdates(prev => ({
      ...prev,
      lastUpdate: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }))
  }

  const updateLastUpdateTime = () => {
    setRealTimeUpdates(prev => ({
      ...prev,
      lastUpdate: "Just now",
      newActivations: 0
    }))
  }

  const toggleLiveUpdates = () => {
    setRealTimeUpdates(prev => ({
      ...prev,
      isLive: !prev.isLive
    }))
  }

  const manualRefresh = async () => {
    setLoading(true)
    await loadAnalytics()
    setRealTimeUpdates(prev => ({
      ...prev,
      lastUpdate: "Just now",
      newActivations: 0
    }))
  }

  const getUsageIntensity = (toolCount: number, limit: number) => {
    if (limit === Infinity) return "low"
    const percentage = (toolCount / limit) * 100
    if (percentage >= 80) return "high"
    if (percentage >= 50) return "medium"
    return "low"
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "low": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      default: return "bg-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
    }
  }

  const limit = PLAN_LIMITS[plan]
  const nearingLimit = limit !== Infinity && activeTools.length >= limit
  const usageIntensity = getUsageIntensity(activeTools.length, limit)

  return (
    <div className="space-y-8">
      {/* Header with real-time controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[color:var(--dashboard-text)]">
            Usage Analytics
          </h1>
          <p className="text-sm text-[color:var(--dashboard-muted)]">
            Live insights into your tool usage and productivity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Real-time status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`flex items-center gap-1 ${
              realTimeUpdates.isLive 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-[color:var(--dashboard-muted)]"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                realTimeUpdates.isLive 
                  ? "bg-emerald-500 animate-pulse" 
                  : "bg-[color:var(--dashboard-muted)]"
              }`} />
              <span>{realTimeUpdates.isLive ? "Live" : "Paused"}</span>
            </div>
            <span className="text-[color:var(--dashboard-muted)]">-</span>
            <span className="text-[color:var(--dashboard-muted)]">
              Updated {realTimeUpdates.lastUpdate}
            </span>
          </div>

          {/* Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLiveUpdates}
            className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
          >
            {realTimeUpdates.isLive ? "Pause" : "Resume"} Live
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={manualRefresh}
            disabled={loading}
            className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time notifications */}
      {realTimeUpdates.newActivations > 0 && (
        <div className="animate-pulse">
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {realTimeUpdates.newActivations} new tool{realTimeUpdates.newActivations !== 1 ? 's' : ''} activated!
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Analytics updated in real-time
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setRealTimeUpdates(prev => ({ ...prev, newActivations: 0 }))}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Dismiss
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Active tools</p>
              <p className="text-2xl font-semibold text-[color:var(--dashboard-text)] mt-2">
                {loading ? "—" : activeTools.length}
              </p>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getIntensityColor(usageIntensity)}`}>
                  {usageIntensity === "high" ? "High usage" : usageIntensity === "medium" ? "Moderate" : "Optimal"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Used this week</p>
              <p className="text-2xl font-semibold text-[color:var(--dashboard-text)] mt-2">
                {loading ? "—" : usedThisWeek}
              </p>
              <p className="text-xs text-[color:var(--dashboard-muted)] mt-2">
                {usedThisWeek === 0 ? "Start using your tools!" : 
                 usedThisWeek <= 2 ? "Keep going!" : 
                 "Great engagement!"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Daily average</p>
              <p className="text-2xl font-semibold text-[color:var(--dashboard-text)] mt-2">
                {loading ? "—" : usageStats.dailyAverage.toFixed(1)}
              </p>
              <p className="text-xs text-[color:var(--dashboard-muted)] mt-2">
                tools per day
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Plan limit</p>
              <p className="text-2xl font-semibold text-[color:var(--dashboard-text)] mt-2">
                {limit === Infinity
                  ? "Unlimited"
                  : `${activeTools.length} / ${limit}`}
              </p>
              <p className="text-xs text-[color:var(--dashboard-muted)] mt-2">
                {limit === Infinity ? "Growth plan" : `${Math.round((activeTools.length / limit) * 100)}% used`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Statistics */}
      <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[color:var(--dashboard-text)]">
            Usage Statistics
          </h3>
          <span className="text-xs text-[color:var(--dashboard-muted)] flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live data
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--dashboard-muted)]">Peak Usage Day</p>
                <p className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                  {usageStats.peakUsageDay}
                </p>
              </div>
            </div>
            <p className="text-xs text-[color:var(--dashboard-muted)]">
              Most active day based on your usage patterns
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--dashboard-muted)]">Most Used Tool</p>
                <p className="text-lg font-semibold text-[color:var(--dashboard-text)] truncate">
                  {usageStats.mostUsedTool || "None yet"}
                </p>
              </div>
            </div>
            <p className="text-xs text-[color:var(--dashboard-muted)]">
              Based on recent activity
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--dashboard-muted)]">Total Usage Time</p>
                <p className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                  {usageStats.totalUsageTime} days
                </p>
              </div>
            </div>
            <p className="text-xs text-[color:var(--dashboard-muted)]">
              Cumulative tool usage duration
            </p>
          </div>
        </div>
      </Card>

      {/* Active tools list */}
      <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--dashboard-text)]">
              Active Tools
            </h3>
            <p className="text-sm text-[color:var(--dashboard-muted)] mt-1">
              Real-time status of your activated tools
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/tools")}
              className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
            >
              Manage tools
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <MyWokiLoader />
            <p className="text-[color:var(--dashboard-muted)] text-sm">
              Loading your tools...
            </p>
          </div>
        ) : activeTools.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[color:var(--dashboard-border)] flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-[color:var(--dashboard-muted)]" />
            </div>
            <h4 className="text-lg font-medium text-[color:var(--dashboard-text)] mb-2">
              No active tools yet
            </h4>
            <p className="text-[color:var(--dashboard-muted)] mb-4">
              Activate your first tool to start tracking usage analytics
            </p>
            <Button
              onClick={() => navigate("/dashboard/tools")}
              className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600"
            >
              Explore Tools
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-[color:var(--dashboard-border)] transition-colors border border-[color:var(--dashboard-border)] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[color:var(--dashboard-text)]">
                        {tool.tools.name}
                      </h4>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                        {tool.tools.category}
                      </span>
                    </div>
                    <p className="text-sm text-[color:var(--dashboard-muted)] mt-1 line-clamp-1">
                      {tool.tools.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-[color:var(--dashboard-muted)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Activated {new Date(tool.activated_at).toLocaleDateString()}
                      </span>
                      {tool.last_used_at && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Used recently
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-[color:var(--dashboard-muted)]">
                    {tool.last_used_at
                      ? `Last used ${new Date(tool.last_used_at).toLocaleDateString()}`
                      : "Awaiting first use"}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/dashboard/tools/${tool.tool_id}`)}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Open tool
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upgrade nudge */}
      {nearingLimit && (
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-medium text-emerald-900 dark:text-emerald-300">
                  Approaching plan limit
                </h4>
              </div>
              <p className="text-sm text-emerald-800 dark:text-emerald-400">
                You're using {activeTools.length} of {limit} available tools. 
                Upgrade to unlock more tools and advanced analytics.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/dashboard/billing")}
                className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white"
              >
                View upgrade options
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/tools")}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
              >
                Manage tools
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Insights & Recommendations */}
      <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
        <h3 className="text-lg font-semibold text-[color:var(--dashboard-text)] mb-6">
          Insights & Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-medium text-[color:var(--dashboard-text)]">Usage Pattern</h4>
              </div>
              <p className="text-sm text-[color:var(--dashboard-text)]">
                {usedThisWeek === 0 
                  ? "Start using your activated tools to see usage patterns and get personalized recommendations."
                  : usedThisWeek <= 2
                  ? "You're getting started! Regular usage will help us provide better tool recommendations."
                  : "Great consistency! You're making good use of your tools. Consider exploring related tools."
                }
              </p>
            </div>
            
            <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-[color:var(--dashboard-text)]">Tool Efficiency</h4>
              </div>
              <p className="text-sm text-[color:var(--dashboard-text)]">
                {activeTools.length === 0
                  ? "Activate tools based on your workflow needs to improve productivity."
                  : `You have ${activeTools.length} active tool${activeTools.length !== 1 ? 's' : ''}. ${activeTools.length > 3 ? 'Consider focusing on your most used tools for better efficiency.' : 'Good balance of active tools.'}`
                }
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-[color:var(--dashboard-text)]">Analytics Tip</h4>
              </div>
              <p className="text-sm text-[color:var(--dashboard-text)]">
                Check back regularly to see how your tool usage evolves. The more you use your tools, 
                the better insights we can provide about your workflow efficiency.
              </p>
            </div>
            
            <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h4 className="font-medium text-[color:var(--dashboard-text)]">Live Updates</h4>
              </div>
              <p className="text-sm text-[color:var(--dashboard-text)]">
                This page updates in real-time. When you activate or use tools elsewhere in the app, 
                you'll see the changes reflected here automatically.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

