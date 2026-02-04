import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { AlertTriangle } from "lucide-react"

type Incident = {
  id: string
  title: string
  status: "open" | "monitoring" | "resolved"
  created_at: string
}

type ToolIssue = {
  id: string
  name: string
  issues: string[]
}

export default function StatusBanner() {
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null)
  const [toolIssues, setToolIssues] = useState<ToolIssue[]>([])

  useEffect(() => {
    loadActiveIncident()

    const channel = supabase
      .channel("status-banner")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        () => loadActiveIncident()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadActiveIncident = async () => {
    const { data } = await supabase
      .from("incidents")
      .select("id, title, status, created_at")
      .in("status", ["open", "monitoring"])
      .order("created_at", { ascending: false })
      .limit(1)

    setActiveIncident(data?.[0] ?? null)

    const { data: tools } = await supabase
      .from("tools")
      .select("id, name, issues")

    const issues = (tools || []).filter((tool) => Array.isArray(tool.issues) && tool.issues.length > 0) as ToolIssue[]
    setToolIssues(issues)
  }

  if (!activeIncident && toolIssues.length === 0) return null

  const bannerMessage = activeIncident
    ? `We are investigating an issue: ${activeIncident.title}`
    : `We are seeing issues with ${toolIssues[0]?.name}`

  return (
    <div className="w-full bg-rose-50 border-b border-rose-200 text-rose-800">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{bannerMessage}</span>
        </div>
        <Link to="/status" className="font-medium text-rose-700 hover:text-rose-800">
          View status
        </Link>
      </div>
    </div>
  )
}
