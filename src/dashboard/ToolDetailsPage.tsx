import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { CheckCircle, BarChart3, ArrowLeft, Sparkles, Users, Zap, Activity } from "lucide-react"
import { PLAN_LIMITS, type PlanId } from "../lib/plans"
import UpgradeNudge from "./UpgradeNudge"
import { useNavigate } from "react-router-dom"
import { notificationService } from "../lib/notifications"
import MyWokiLoader from "../components/MyWokiLoader"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  long_description?: string
  use_cases?: string[]
  who_its_for?: string[]
  is_active: boolean
}

interface UserData {
  plan: PlanId
  activeToolCount: number
  name: string
  email: string
}

interface ActivationStats {
  totalActivations: number
  recentActivations: number
  popularWithUsers: string[]
  averageUsageTime: string
}

export default function ToolDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tool, setTool] = useState<Tool | null>(null)
  const [userData, setUserData] = useState<UserData>({ 
    plan: 'starter', 
    activeToolCount: 0,
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [activating, setActivating] = useState(false)
  const [activationStats, setActivationStats] = useState<ActivationStats>({
    totalActivations: 0,
    recentActivations: 0,
    popularWithUsers: [],
    averageUsageTime: "2-3 days"
  })

  const userId = localStorage.getItem("user_id")

  useEffect(() => {
    if (id) {
      fetchToolAndUserData()
      fetchActivationStats()
    }
  }, [id])

  const fetchToolAndUserData = async () => {
    setLoading(true)
    try {
      // Fetch tool details
      const { data: toolData, error: toolError } = await supabase
        .from("tools")
        .select("*")
        .eq("id", id)
        .single()
      if (toolError) throw toolError
      setTool(toolData)

      if (userId) {
        const [
          { data: activationData, error: activationError },
          { data: planData, error: planError },
          { count: activeCount, error: countError },
          { data: userProfile, error: userError }
        ] = await Promise.all([
          supabase
            .from("user_tool_activations")
            .select("is_active, last_used_at")
            .eq("user_id", userId)
            .eq("tool_id", id)
            .single(),
          supabase
            .from("users")
            .select("plan")
            .eq("id", userId)
            .single(),
          supabase
            .from("user_tool_activations")
            .select('*', { count: 'exact', head: true })
            .eq("user_id", userId)
            .eq("is_active", true),
          supabase
            .from("users")
            .select("name, email")
            .eq("id", userId)
            .single()
        ]);

        if (activationError && activationError.code !== 'PGRST116') throw activationError
        if (planError) throw planError
        if (countError) throw countError
        if (userError) throw userError

        setIsActive(activationData?.is_active ?? false)
        setUserData({
          plan: planData?.plan ?? 'starter',
          activeToolCount: activeCount ?? 0,
          name: userProfile?.name || '',
          email: userProfile?.email || ''
        })
      }
    } catch (err) {
      console.error("Failed to load tool details", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivationStats = async () => {
    try {
      // Get total activations for this tool
      const { count: totalActivations } = await supabase
        .from('user_tool_activations')
        .select('*', { count: 'exact', head: true })
        .eq('tool_id', id)

      // Get recent activations (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const { count: recentActivations } = await supabase
        .from('user_tool_activations')
        .select('*', { count: 'exact', head: true })
        .eq('tool_id', id)
        .gte('activated_at', weekAgo.toISOString())

      // Get which user types commonly use this tool
      const { data: userActivations } = await supabase
        .from('user_tool_activations')
        .select('users(plan)')
        .eq('tool_id', id)
        .limit(10)

      const plans = userActivations?.map(ua => ua.users?.[0]?.plan).filter(Boolean) as string[]
      const popularPlans = [...new Set(plans)].slice(0, 3)

      setActivationStats({
        totalActivations: totalActivations || 0,
        recentActivations: recentActivations || 0,
        popularWithUsers: popularPlans.map(p => p.charAt(0).toUpperCase() + p.slice(1) + ' Plan'),
        averageUsageTime: "2-3 days"
      })
    } catch (error) {
      console.error('Error fetching activation stats:', error)
    }
  }

  const activateTool = async () => {
    if (!userId || !tool) return
    setActivating(true)

    try {
      // Create activation record
      const { data: activation, error: activationError } = await supabase
        .from("user_tool_activations")
        .upsert({
          user_id: userId,
          tool_id: tool.id,
          is_active: true,
          activated_at: new Date().toISOString(),
          last_used_at: new Date().toISOString()
        })
        .select()
        .single()

      if (activationError) throw activationError

      // Create tool event for analytics
      await supabase.from("tool_events").insert({
        tool_id: tool.id,
        user_id: userId,
        event_type: "activated",
        metadata: {
          plan: userData.plan,
          source: 'tool_details_page'
        }
      })

      // Send notification to user
      await notificationService.create({
        userId,
        type: 'success',
        title: 'Tool Activated! 🎉',
        message: `You've successfully activated "${tool.name}". It's now available in your projects dashboard.`,
        data: { 
          tool_id: tool.id, 
          tool_name: tool.name,
          activation_id: activation.id 
        },
        intent: 'activate_tool'
      })

      // Optionally send welcome email for the tool
      if (tool.category === 'premium') {
        await notificationService.create({
          userId,
          type: 'info',
          title: 'Premium Tool Tips',
          message: `Get the most out of "${tool.name}" with our getting started guide.`,
          intent: 'learn'
        })
      }

      setIsActive(true)
      setUserData(prev => ({ ...prev, activeToolCount: prev.activeToolCount + 1 }))
      
      // Show success message
      alert(`🎉 ${tool.name} activated successfully! Check your notifications for next steps.`)
      
    } catch (err: any) {
      console.error("Activation failed", err)
      
      // Send error notification
      if (userId) {
        await notificationService.create({
          userId,
          type: 'error',
          title: 'Activation Failed',
          message: `We couldn't activate "${tool.name}". Please try again or contact support.`,
          data: { tool_id: tool.id, error: err.message }
        })
      }
      
      alert('Activation failed. Please try again.')
    } finally {
      setActivating(false)
    }
  }

  const deactivateTool = async () => {
    if (!userId || !tool) return
    
    if (!confirm(`Are you sure you want to deactivate ${tool.name}? Your data will be preserved.`)) {
      return
    }

    try {
      await supabase
        .from("user_tool_activations")
        .update({ 
          is_active: false,
          deactivated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .eq("tool_id", tool.id)

      // Create deactivation event
      await supabase.from("tool_events").insert({
        tool_id: tool.id,
        user_id: userId,
        event_type: "deactivated"
      })

      // Send notification
      await notificationService.create({
        userId,
        type: 'info',
        title: 'Tool Deactivated',
        message: `"${tool.name}" has been deactivated. You can reactivate it anytime.`,
        data: { tool_id: tool.id }
      })

      setIsActive(false)
      setUserData(prev => ({ ...prev, activeToolCount: Math.max(0, prev.activeToolCount - 1) }))
      
      alert(`Tool deactivated. You can reactivate it anytime from your tools list.`)
    } catch (err) {
      console.error("Deactivation failed", err)
      alert('Failed to deactivate tool')
    }
  }

  if (loading || !tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[color:var(--dashboard-bg)] gap-3">
        <MyWokiLoader />
        <div className="text-[color:var(--dashboard-muted)] text-sm">Loading tool details...</div>
      </div>
    )
  }
  
  const { plan, activeToolCount } = userData
  const limit = (PLAN_LIMITS[plan] || PLAN_LIMITS['starter']).maxActiveTools
  const limitReached = activeToolCount >= limit

  return (
    <div className="space-y-8 p-4 md:p-6 bg-[color:var(--dashboard-bg)] min-h-screen">
      {/* Back button */}
      <Button
        onClick={() => navigate("/dashboard/tools")}
        variant="ghost"
        className="-ml-2 bg-[color:var(--dashboard-surface)] hover:bg-[color:var(--dashboard-border)] border border-[color:var(--dashboard-border)]"
      >
        <ArrowLeft className="w-4 h-4 mr-2 text-[color:var(--dashboard-muted)]" />
        <span className="text-[color:var(--dashboard-text)]">Back to tools</span>
      </Button>

      {limitReached && !isActive && <UpgradeNudge activeCount={activeToolCount} limit={limit} />}

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-full">
            {tool.category}
          </span>
          {isActive && (
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
              Active
            </span>
          )}
          {!tool.is_active && (
            <span className="px-3 py-1 text-sm font-medium bg-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)] rounded-full">
              Disabled
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[color:var(--dashboard-text)]">
              {tool.name}
            </h1>
            <p className="text-[color:var(--dashboard-muted)] max-w-3xl mt-2">
              {tool.description}
            </p>
          </div>
          
          {/* Activation Stats */}
          <div className="flex md:flex-col items-center gap-4 md:gap-2 bg-[color:var(--dashboard-surface)] p-4 rounded-lg border border-[color:var(--dashboard-border)]">
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-[color:var(--dashboard-text)]">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{activationStats.totalActivations}</span>
              </div>
              <p className="text-xs text-[color:var(--dashboard-muted)]">Total Activations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-[color:var(--dashboard-text)]">
                <Activity className="w-4 h-4" />
                <span className="font-semibold">{activationStats.recentActivations}</span>
              </div>
              <p className="text-xs text-[color:var(--dashboard-muted)]">This Week</p>
            </div>
          </div>
        </div>
      </header>

      {/* Why this tool exists */}
      <Card className="p-6 space-y-3 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-medium text-[color:var(--dashboard-text)]">
            Why this tool exists
          </h2>
        </div>
        <p className="text-sm text-[color:var(--dashboard-text)] leading-relaxed">
          {tool.long_description ||
            "This tool exists to remove friction from common business workflows, helping founders and teams move faster without adding complexity."}
        </p>
      </Card>

      {/* What it helps with */}
      {tool.use_cases && tool.use_cases.length > 0 && (
        <Card className="p-6 space-y-4 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
          <h3 className="font-medium text-[color:var(--dashboard-text)]">
            What this tool helps you do
          </h3>

          <ul className="space-y-2">
            {tool.use_cases.map((useCase) => (
              <li key={useCase} className="flex items-start gap-3 text-sm text-[color:var(--dashboard-text)]">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Who it's for */}
      {tool.who_its_for && tool.who_its_for.length > 0 && (
        <Card className="p-6 space-y-3 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
          <h3 className="font-medium text-[color:var(--dashboard-text)]">
            Who this is for
          </h3>

          <div className="flex flex-wrap gap-2">
            {tool.who_its_for.map((audience) => (
              <span
                key={audience}
                className="text-xs px-3 py-1 rounded-full bg-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)] border border-[color:var(--dashboard-border)]"
              >
                {audience}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Tool Popularity Stats */}
      {/* <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="font-medium text-[color:var(--dashboard-text)] mb-4">
          Tool Popularity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                {activationStats.totalActivations}
              </span>
            </div>
            <p className="text-xs text-[color:var(--dashboard-muted)]">Total Activations</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                {activationStats.recentActivations}
              </span>
            </div>
            <p className="text-xs text-[color:var(--dashboard-muted)]">This Week</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                {activationStats.averageUsageTime}
              </span>
            </div>
            <p className="text-xs text-[color:var(--dashboard-muted)]">Avg. Usage</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                {activationStats.popularWithUsers.length > 0 ? activationStats.popularWithUsers[0] : 'All Plans'}
              </span>
            </div>
            <p className="text-xs text-[color:var(--dashboard-muted)]">Popular With</p>
          </div>
        </div>
      </Card> */}

      {/* Activation section */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border border-[color:var(--dashboard-border)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="font-medium text-[color:var(--dashboard-text)]">
              {isActive ? "🎉 Tool is Active" : "⚡ Activate this tool"}
            </h3>
            <p className="text-sm text-[color:var(--dashboard-text)]">
              {isActive 
                ? "You're currently using this tool in your projects. All data is saved and backed up."
                : `You have ${activeToolCount} / ${isFinite(limit) ? limit : 'Unlimited'} tools active.`
              }
            </p>
            {!tool.is_active && (
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ This tool is temporarily disabled by administrators.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            {isActive ? (
              <>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  Active in your workspace
                </div>
                <Button
                  onClick={deactivateTool}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                >
                  Deactivate Tool
                </Button>
              </>
            ) : !tool.is_active ? (
              <Button 
                disabled 
                variant="outline" 
                className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-muted)]"
              >
                Tool Disabled
              </Button>
            ) : limitReached ? (
              <Button 
                disabled 
                variant="outline" 
                className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-muted)]"
              >
                Limit reached
              </Button>
            ) : (
              <Button
                onClick={activateTool}
                disabled={activating}
                className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                {activating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Activating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Activate tool
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Activation benefits */}
        {!isActive && tool.is_active && (
          <div className="mt-4 p-4 bg-[color:var(--dashboard-surface)] rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-medium text-[color:var(--dashboard-text)] mb-2">
              What happens when you activate:
            </h4>
            <ul className="space-y-1 text-sm text-[color:var(--dashboard-text)]">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Tool added to your projects dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Automatic data backup and versioning
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Get usage tips and best practices
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Can be deactivated anytime without data loss
              </li>
            </ul>
          </div>
        )}
      </Card>

      {/* Similar tools recommendation */}
      <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)]">
        <h3 className="font-medium text-[color:var(--dashboard-text)] mb-4">
          Frequently used together
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Project Management', 'Analytics Dashboard', 'File Storage'].map((relatedTool) => (
            <span
              key={relatedTool}
              className="text-xs px-3 py-1 rounded-full bg-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)] hover:bg-[color:var(--dashboard-surface)] cursor-pointer transition-colors border border-[color:var(--dashboard-border)]"
              onClick={() => {
                // In a real app, this would navigate to the related tool
                console.log('Navigate to:', relatedTool)
              }}
            >
              {relatedTool}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}
