import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { activateTool } from '../services/activateTool'
import { emitToolActivationChange } from '../lib/tool-activation-events'

export function useToolActivation(toolId: string, source: 'tool_details_page' | 'dashboard' | 'recommendation' = 'dashboard') {
  const [loading, setLoading] = useState(false)

  const activate = async () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return { success: false, activation: null }

    setLoading(true)

    try {
      // Fetch tool details
      const { data: tool, error: toolError } = await supabase
        .from('tools')
        .select('name, id')
        .eq('id', toolId)
        .single()

      if (toolError || !tool) {
        console.error('Tool fetch failed:', toolError)
        setLoading(false)
        return { success: false, activation: null }
      }

      const result = await activateTool({
        userId,
        toolId,
        toolName: tool.name,
        userPlan: 'starter', // or fetch from somewhere
        source
      })

      emitToolActivationChange({ userId, toolId, isActive: true, source })
      setLoading(false)
      return { success: true, activation: result.activation }
    } catch (error) {
      console.error('Activation failed:', error)
      setLoading(false)
      return { success: false, activation: null }
    }
  }

  const deactivate = async () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return

    setLoading(true)

    const { error } = await supabase
      .from('user_tool_activations')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('tool_id', toolId)

    setLoading(false)

    if (error) {
      console.error('Deactivation failed:', error)
      return false
    }

    emitToolActivationChange({ userId, toolId, isActive: false, source })
    return true
  }

  return {
    activate,
    deactivate,
    loading,
  }
}
