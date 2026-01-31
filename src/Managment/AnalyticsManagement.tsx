
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { supabase } from "../lib/supabase"
import {
  TrendingUp,
  Users,
  Wrench,
  Calendar,
  Download
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalTools: number
  activeTools: number
  toolUsageByCategory: Array<{ name: string; value: number }>
  userGrowth: Array<{ date: string; count: number }>
  planDistribution: Array<{ name: string; value: number }>
  topTools: Array<{ name: string; activations: number }>
}

export default function AnalyticsManagement() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalTools: 0,
    activeTools: 0,
    toolUsageByCategory: [],
    userGrowth: [],
    planDistribution: [],
    topTools: []
  })
  const [, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  async function loadAnalytics() {
    try {
      // Get basic stats
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalTools },
        { count: activeTools }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('tools').select('*', { count: 'exact', head: true }),
        supabase.from('user_tool_activations').select('*', { count: 'exact', head: true }).eq('is_active', true)
      ])

      // Get tool usage by category
      const { data: categoryData } = await supabase
        .from('tools')
        .select('category, user_tool_activations!inner(*)')

      const categoryMap = new Map()
      categoryData?.forEach(item => {
        const current = categoryMap.get(item.category) || 0
        categoryMap.set(item.category, current + (item.user_tool_activations?.length || 0))
      })

      const toolUsageByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value
      }))

      // Get user growth data
      let dateFilter = new Date()
      if (timeRange === '7d') {
        dateFilter.setDate(dateFilter.getDate() - 7)
      } else if (timeRange === '30d') {
        dateFilter.setDate(dateFilter.getDate() - 30)
      } else {
        dateFilter.setDate(dateFilter.getDate() - 365)
      }

      const { data: userGrowthData } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', dateFilter.toISOString())

      // Process user growth by day
      const userGrowthMap = new Map()
      userGrowthData?.forEach(user => {
        const date = new Date(user.created_at).toLocaleDateString()
        const current = userGrowthMap.get(date) || 0
        userGrowthMap.set(date, current + 1)
      })

      const userGrowth = Array.from(userGrowthMap.entries())
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .slice(-10)
        .map(([date, count]) => ({ date, count }))

      // Get plan distribution
      const { data: planData } = await supabase
        .from('users')
        .select('plan')

      const planMap = new Map()
      planData?.forEach(user => {
        const current = planMap.get(user.plan) || 0
        planMap.set(user.plan, current + 1)
      })

      const planDistribution = Array.from(planMap.entries()).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }))

      // Get top tools
      const { data: topToolsData } = await supabase
        .from('user_tool_activations')
        .select('tool_id, tools(name)')
        .eq('is_active', true)

      const toolMap = new Map()
      topToolsData?.forEach(activation => {
        const toolName = activation.tools?.[0]?.name || 'Unknown'
        const current = toolMap.get(toolName) || 0
        toolMap.set(toolName, current + 1)
      })

      const topTools = Array.from(toolMap.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, activations]) => ({ name, activations }))

      setAnalytics({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalTools: totalTools || 0,
        activeTools: activeTools || 0,
        toolUsageByCategory,
        userGrowth,
        planDistribution,
        topTools
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `analytics-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform performance and user insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {analytics.totalUsers}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                {analytics.activeUsers} active
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {analytics.totalTools}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                {analytics.activeTools} active
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Tools/User</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {analytics.totalUsers > 0 
                  ? (analytics.activeTools / analytics.totalUsers).toFixed(1)
                  : '0.0'
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                per user
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
              <p className="text-sm text-gray-500 dark:text-gray-400">User Growth</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {analytics.userGrowth.length > 1
                  ? analytics.userGrowth[analytics.userGrowth.length - 1].count
                  : 0
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                latest day
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tool Usage by Category */}
        <Card className="p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tool Usage by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.toolUsageByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.toolUsageByCategory.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Plan Distribution */}
        <Card className="p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.planDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Tools */}
        <Card className="p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Popular Tools
          </h3>
          <div className="space-y-3">
            {analytics.topTools.map((tool, index) => (
              <div key={tool.name} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{tool.name}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tool.activations} activations
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Platform Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">User Engagement:</span> 
                {analytics.activeUsers / analytics.totalUsers > 0.7 
                  ? " High engagement rate"
                  : " Moderate engagement rate"
                }
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Tool Popularity:</span> 
                {analytics.topTools.length > 0 
                  ? ` ${analytics.topTools[0].name} is the most popular tool`
                  : " No tool usage data yet"
                }
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Plan Distribution:</span> 
                {analytics.planDistribution.length > 0 
                  ? ` ${analytics.planDistribution[0].name} plan has the most users`
                  : " No plan data yet"
                }
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Growth Trend:</span> 
                {analytics.userGrowth.length > 1 &&
                  analytics.userGrowth[analytics.userGrowth.length - 1].count > 
                  analytics.userGrowth[0].count
                  ? " Positive growth trend"
                  : " Stable growth trend"
                }
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
