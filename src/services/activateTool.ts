
import { supabase } from '../lib/supabase'
import { notificationService } from './notifications'

export async function activateTool({
  userId,
  toolId,
  toolName,
  userPlan,
  source = 'tool_details_page'
}: {
  userId: string
  toolId: string
  toolName: string
  userPlan: string
  source?: 'tool_details_page' | 'dashboard' | 'recommendation'
}) {
  try {
    // 1. Create activation record
    const { data: activation, error: activationError } = await supabase
      .from('user_tool_activations')
      .upsert({
        user_id: userId,
        tool_id: toolId,
        is_active: true,
        activated_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
        activation_source: source
      })
      .select()
      .single()

    if (activationError) throw activationError

    // 2. Track activation event for analytics
    await supabase.from('tool_events').insert({
      user_id: userId,
      tool_id: toolId,
      event_type: 'activated',
      metadata: {
        plan: userPlan,
        source,
        timestamp: new Date().toISOString()
      }
    })

    // 3. Update user's active tool count
    const { count: activeCount } = await supabase
      .from('user_tool_activations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true)

    // 4. Send success notification
    await notificationService.create({
      userId,
      type: 'success',
      title: 'Tool Activated! 🎉',
      message: `"${toolName}" is now ready to use in your workspace.`,
      data: {
        tool_id: toolId,
        tool_name: toolName,
        activation_id: activation.id,
        active_tools_count: activeCount || 0
      },
      intent: 'activate_tool'
    })

    // 5. Send follow-up tips if premium tool
    if (userPlan === 'growth' || userPlan === 'core') {
      setTimeout(async () => {
        await notificationService.create({
          userId,
          type: 'info',
          title: 'Pro Tip for ' + toolName,
          message: 'Check out our advanced features guide to get the most out of this tool.',
          intent: 'learn'
        })
      }, 60000) // Send after 1 minute
    }

    return {
      success: true,
      activation,
      activeToolsCount: activeCount || 0
    }

  } catch (error: any) {
    console.error('Activation failed:', error)
    
    // Send error notification
    await notificationService.create({
      userId,
      type: 'error',
      title: 'Activation Failed',
      message: `Couldn't activate "${toolName}". Please try again.`,
      data: {
        tool_id: toolId,
        error: error.message
      }
    })

    return {
      success: false,
      error: error.message
    }
  }
}
