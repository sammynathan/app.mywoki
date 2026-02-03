import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Card } from "../components/ui/card"
import { Textarea } from "../components/ui/textarea"
import { Save } from "lucide-react"

interface Props {
  activationId: string
}

export default function ProjectNotesPanel({ activationId }: Props) {
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    loadNote()
  }, [activationId])

  async function loadNote() {
    const { data } = await supabase
      .from("project_notes")
      .select("content, updated_at")
      .eq("activation_id", activationId)
      .single()

    if (data?.content) setContent(data.content)
    if (data?.updated_at) setLastSaved(new Date(data.updated_at))
  }

  async function saveNote(value: string) {
    setSaving(true)

    const userId = localStorage.getItem("user_id")
    if (!userId) return

    await supabase
      .from("project_notes")
      .upsert({
        user_id: userId,
        activation_id: activationId,
        content: value,
        updated_at: new Date().toISOString(),
      })

    setSaving(false)
    setLastSaved(new Date())
  }

  return (
    <Card className="p-6 space-y-4 bg-[color:var(--dashboard-surface)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[color:var(--dashboard-text)]">
          Project notes
        </h3>
        <div className="flex items-center gap-2 text-xs text-[color:var(--dashboard-muted)]">
          {saving ? (
            <>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Saving...
            </>
          ) : lastSaved ? (
            <>
              <Save className="w-3 h-3" />
              Saved {lastSaved.toLocaleTimeString()}
            </>
          ) : null}
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(e) => {
          const newValue = e.target.value
          setContent(newValue)
          saveNote(newValue)
        }}
        placeholder="Write your thoughts, next steps, ideas, or todo list here..."
        className="min-h-[200px] text-sm bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)] placeholder-[color:var(--dashboard-muted)] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />

      <div className="text-xs text-[color:var(--dashboard-muted)] pt-2 border-t border-[color:var(--dashboard-border)]">
        <p>💡 Notes are saved automatically as you type.</p>
        <p className="mt-1">Use this space for project planning, meeting notes, or tracking progress.</p>
      </div>
    </Card>
  )
}
