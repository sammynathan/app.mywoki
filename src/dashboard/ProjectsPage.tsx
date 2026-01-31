import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import ProjectNotesPanel from "./ProjectNotesPanel"
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [id])

  async function loadProject() {
    const { data } = await supabase
      .from("user_tool_activations")
      .select(`
        id,
        tools (
          name,
          description,
          category
        ),
        created_at,
        activated_at
      `)
      .eq("id", id)
      .single()

    setProject(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-gray-400">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Project not found
        </h2>
        <Button
          onClick={() => navigate("/dashboard")}
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Button
  onClick={() => navigate("/dashboard/projects")}  // New
  variant="ghost"
  className="mb-4 -ml-2"
>
  <ArrowLeft className="w-4 h-4 mr-2" />
  Back to projects
</Button>
      {/* Project header */}
      <div className="space-y-4">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-full">
            {project.tools.category}
          </span>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
            {project.tools.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {project.tools.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Card className="p-4 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Activated</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.activated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Project actions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your project configuration
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open tool
            </Button>
            <Button>Configure</Button>
          </div>
        </div>
      </Card>

      {/* Project notes */}
      <ProjectNotesPanel activationId={project.id} />

      {/* Recent activity (placeholder) */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Recent activity
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Project created and tool activated
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(project.created_at).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Notes section is ready for your thoughts
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Start adding notes above
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}