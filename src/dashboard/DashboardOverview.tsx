import { useCallback, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"
import MyWokiLoader from "../components/MyWokiLoader"
import { subscribeToolActivationChange } from "../lib/tool-activation-events"

export default function DashboardOverview() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadProjects = useCallback(async () => {
    const userId = localStorage.getItem("user_id")

    const { data } = await supabase
      .from("user_tool_activations")
      .select(`
        id,
        created_at,
        tools (
          name,
          category
        )
      `)
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    setProjects(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProjects()
    const unsubscribe = subscribeToolActivationChange(() => {
      loadProjects()
    })
    return () => unsubscribe()
  }, [loadProjects])

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-[color:var(--dashboard-text)]">
              Welcome back to your workspace
            </h1>
            <p className="text-[color:var(--dashboard-muted)] max-w-2xl">
              Everything you've activated lives here. Keep building, keep creating.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Active projects */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[color:var(--dashboard-text)]">
              Active projects
            </h2>
            <p className="text-sm text-[color:var(--dashboard-muted)] mt-1">
              Tools you're currently working with
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/tools")}
            variant="outline"
            className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
          >
            Explore more tools
          </Button>
        </div>

        {loading && (
          <Card className="p-6 text-center bg-[color:var(--dashboard-surface)]">
            <div className="flex flex-col items-center gap-3">
              <MyWokiLoader />
              <p className="text-[color:var(--dashboard-muted)] text-sm">Loading your projects...</p>
            </div>
          </Card>
        )}

        {!loading && projects.length === 0 && (
          <Card className="p-8 text-center bg-[color:var(--dashboard-surface)] border-dashed">
            <div className="w-16 h-16 mx-auto rounded-full bg-[color:var(--dashboard-border)] flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[color:var(--dashboard-muted)]" />
            </div>
            <p className="text-[color:var(--dashboard-text)]">
              No active projects yet.
            </p>
            <p className="text-sm text-[color:var(--dashboard-muted)] mt-1">
              Activate your first tool to start building.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate("/dashboard/tools")}
            >
              Explore tools
            </Button>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-5 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 cursor-pointer bg-[color:var(--dashboard-surface)] group"
              onClick={() => navigate(`/dashboard/projects/${project.id}`)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-[color:var(--dashboard-text)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {project.tools.name}
                    </h3>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-[color:var(--dashboard-border)] text-[color:var(--dashboard-muted)] rounded-full">
                      {project.tools.category}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[color:var(--dashboard-muted)] group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="mt-4 text-xs text-[color:var(--dashboard-muted)] flex items-center justify-between">
                  <span>
                    Activated{" "}
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workspace insight */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-[color:var(--dashboard-border)]">
        <h3 className="font-medium text-[color:var(--dashboard-text)] mb-3">
          Workspace insight
        </h3>
        <p className="text-sm text-[color:var(--dashboard-muted)]">
          You currently have{" "}
          <span className="font-medium text-[color:var(--dashboard-text)]">
            {projects.length}
          </span>{" "}
          active project{projects.length !== 1 && "s"}.
          <br />
          Keep things focused — fewer active tools usually means better progress.
        </p>
        {projects.length === 0 && (
          <Button
            className="mt-4"
            onClick={() => navigate("/dashboard/tools")}
          >
            Start your first project
          </Button>
        )}
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="p-4 bg-[color:var(--dashboard-surface)] hover:bg-[color:var(--dashboard-border)] transition-colors cursor-pointer"
          onClick={() => navigate("/doc/getting-started")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400">📚</span>
            </div>
            <div>
              <p className="font-medium text-[color:var(--dashboard-text)]">Learn</p>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Browse tutorials</p>
            </div>
          </div>
        </Card>
        
        <Card
          className="p-4 bg-[color:var(--dashboard-surface)] hover:bg-[color:var(--dashboard-border)] transition-colors cursor-pointer"
          onClick={() => navigate("/dashboard/settings")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400">🎯</span>
            </div>
            <div>
              <p className="font-medium text-[color:var(--dashboard-text)]">Goals</p>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Set milestones</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-[color:var(--dashboard-surface)] border border-dashed border-[color:var(--dashboard-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-amber-600 dark:text-amber-400">⚡</span>
            </div>
            <div>
              <p className="font-medium text-[color:var(--dashboard-text)]">Tips</p>
              <p className="text-sm text-[color:var(--dashboard-muted)]">Coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
