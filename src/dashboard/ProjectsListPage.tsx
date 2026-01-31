import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, FolderKanban, Plus } from "lucide-react"

export default function ProjectsListPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const userId = localStorage.getItem("user_id")

    const { data } = await supabase
      .from("user_tool_activations")
      .select(`
        id,
        created_at,
        tools (
          name,
          category,
          description
        )
      `)
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    setProjects(data || [])
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            All your active projects in one place
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/tools")}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {projects.length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400">🎯</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {projects.length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-amber-600 dark:text-amber-400">⚡</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {projects.length > 0 
                  ? new Date(projects[0].created_at).toLocaleDateString()
                  : "Never"
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects grid */}
      {loading && (
        <Card className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
        </Card>
      )}

      {!loading && projects.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <FolderKanban className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            No active projects yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Activate a tool to start your first project.
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
            className="p-5 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-900"
            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {project.tools.name}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                    {project.tools.category}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.tools.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Started {new Date(project.created_at).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  Active
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}