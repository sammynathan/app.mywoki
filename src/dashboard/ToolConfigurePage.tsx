import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import MyWokiLoader from "../components/MyWokiLoader"
import { ArrowLeft, Save } from "lucide-react"

type ConfigField = {
  key: string
  label: string
  type: "text" | "textarea" | "url" | "number" | "select" | "toggle"
  placeholder?: string
  required?: boolean
  options?: string[]
  help?: string
}

type ResourceLink = {
  label: string
  url: string
  kind?: string
}

type Tool = {
  id: string
  name: string
  description: string
  setup_steps?: string[]
  config_fields?: ConfigField[]
  resource_links?: ResourceLink[]
}

export default function ToolConfigurePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const userId = localStorage.getItem("user_id")

  const [tool, setTool] = useState<Tool | null>(null)
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      loadTool()
    }
  }, [id])

  const loadTool = async () => {
    setLoading(true)
    try {
      const { data: toolData, error: toolError } = await supabase
        .from("tools")
        .select("id, name, description, setup_steps, config_fields, resource_links")
        .eq("id", id)
        .single()

      if (toolError) throw toolError

      setTool(toolData as Tool)

      if (userId) {
        const { data: settingsData, error: settingsError } = await supabase
          .from("user_tool_settings")
          .select("settings")
          .eq("user_id", userId)
          .eq("tool_id", id)
          .single()

        if (settingsError && settingsError.code !== "PGRST116") {
          throw settingsError
        }

        if (settingsData?.settings && typeof settingsData.settings === "object") {
          setSettings(settingsData.settings as Record<string, any>)
        }
      }
    } catch (error) {
      console.error("Failed to load tool configuration", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    if (!userId || !tool) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from("user_tool_settings")
        .upsert({
          user_id: userId,
          tool_id: tool.id,
          settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error("Failed to save tool settings", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <MyWokiLoader />
        <div className="text-[color:var(--dashboard-muted)] text-sm">Loading configuration...</div>
      </div>
    )
  }

  const configFields = Array.isArray(tool.config_fields) ? tool.config_fields : []
  const setupSteps = tool.setup_steps || []
  const resourceLinks = Array.isArray(tool.resource_links) ? tool.resource_links : []

  return (
    <div className="space-y-8 p-4 md:p-6 bg-[color:var(--dashboard-bg)] min-h-screen">
      <Button
        onClick={() => navigate(`/dashboard/tools/${tool.id}`)}
        variant="ghost"
        className="-ml-2 bg-[color:var(--dashboard-surface)] hover:bg-[color:var(--dashboard-border)] border border-[color:var(--dashboard-border)]"
      >
        <ArrowLeft className="w-4 h-4 mr-2 text-[color:var(--dashboard-muted)]" />
        <span className="text-[color:var(--dashboard-text)]">Back to tool</span>
      </Button>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[color:var(--dashboard-text)]">
          Configure {tool.name}
        </h1>
        <p className="text-sm text-[color:var(--dashboard-muted)] max-w-2xl">
          {tool.description}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)] space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[color:var(--dashboard-text)]">
              Tool settings
            </h2>
            <Button onClick={saveSettings} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save settings"}
            </Button>
          </div>

          {configFields.length === 0 ? (
            <div className="text-sm text-[color:var(--dashboard-muted)]">
              This tool doesn’t have custom configuration fields yet. Add them in the management dashboard to make this page unique.
            </div>
          ) : (
            <div className="space-y-4">
              {configFields.map((field) => {
                const value = settings[field.key]

                if (field.type === "textarea") {
                  return (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-[color:var(--dashboard-text)]">
                        {field.label}
                        {field.required ? " *" : ""}
                      </label>
                      <Textarea
                        value={value ?? ""}
                        onChange={(e) => handleSettingChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                      {field.help && (
                        <p className="text-xs text-[color:var(--dashboard-muted)]">{field.help}</p>
                      )}
                    </div>
                  )
                }

                if (field.type === "select") {
                  return (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-[color:var(--dashboard-text)]">
                        {field.label}
                        {field.required ? " *" : ""}
                      </label>
                      <select
                        value={value ?? ""}
                        onChange={(e) => handleSettingChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)]"
                      >
                        <option value="">Select...</option>
                        {(field.options || []).map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {field.help && (
                        <p className="text-xs text-[color:var(--dashboard-muted)]">{field.help}</p>
                      )}
                    </div>
                  )
                }

                if (field.type === "toggle") {
                  return (
                    <div key={field.key} className="flex items-center justify-between rounded-lg border border-[color:var(--dashboard-border)] p-3">
                      <div>
                        <p className="text-sm font-medium text-[color:var(--dashboard-text)]">
                          {field.label}
                        </p>
                        {field.help && (
                          <p className="text-xs text-[color:var(--dashboard-muted)] mt-1">{field.help}</p>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => handleSettingChange(field.key, e.target.checked)}
                      />
                    </div>
                  )
                }

                return (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium text-[color:var(--dashboard-text)]">
                      {field.label}
                      {field.required ? " *" : ""}
                    </label>
                    <Input
                      type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                      value={value ?? ""}
                      onChange={(e) => handleSettingChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                    {field.help && (
                      <p className="text-xs text-[color:var(--dashboard-muted)]">{field.help}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          {setupSteps.length > 0 && (
            <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)] space-y-3">
              <h3 className="text-sm font-medium text-[color:var(--dashboard-text)]">
                Setup checklist
              </h3>
              <ol className="space-y-2 text-sm text-[color:var(--dashboard-text)]">
                {setupSteps.map((step, index) => (
                  <li key={`${step}-${index}`} className="flex items-start gap-3">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {resourceLinks.length > 0 && (
            <Card className="p-6 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)] space-y-3">
              <h3 className="text-sm font-medium text-[color:var(--dashboard-text)]">
                Resources
              </h3>
              <div className="flex flex-col gap-2">
                {resourceLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
