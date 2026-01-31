
import { supabase } from './supabase'

export interface CreateNotificationParams {
  userId: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  data?: Record<string, any>
  intent?: 'activate_tool' | 'billing' | 'review' | 'learn' | 'promotion'
}

export interface Notification {
  id: string
  user_id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  data?: Record<string, any>
  intent?: string
  read: boolean
  created_at: string
}

export const notificationService = {
  async create(notification: CreateNotificationParams) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          intent: notification.intent,
          read: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating notification:', error)
      return { success: false, error: error.message }
    }
  },

  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)
      
      if (error) throw error
      return { success: true, count: count || 0 }
    } catch (error: any) {
      console.error('Error getting unread count:', error)
      return { success: false, error: error.message, count: 0 }
    }
  },

  async getUserNotifications(userId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return { success: true, notifications: data || [] }
    } catch (error: any) {
      console.error('Error getting user notifications:', error)
      return { success: false, error: error.message, notifications: [] }
    }
  },

  async markAsRead(userId: string, notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
      
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Error marking notification as read:', error)
      return { success: false, error: error.message }
    }
  },

  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
      
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error)
      return { success: false, error: error.message }
    }
  },

  async clearAll(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
      
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Error clearing notifications:', error)
      return { success: false, error: error.message }
    }
  },

  // Send specific notification types
  async sendToolActivatedNotification(userId: string, toolName: string, toolId: string) {
    return this.create({
      userId,
      type: 'success',
      title: 'Tool Activated! 🎉',
      message: `You've successfully activated "${toolName}". Start using it in your projects.`,
      data: { 
        tool_id: toolId, 
        tool_name: toolName,
        category: 'tool_activation'
      },
      intent: 'activate_tool'
    })
  },

  async sendToolDeactivatedNotification(userId: string, toolName: string, toolId: string) {
    return this.create({
      userId,
      type: 'info',
      title: 'Tool Deactivated',
      message: `"${toolName}" has been deactivated. You can reactivate it anytime.`,
      data: { tool_id: toolId, tool_name: toolName },
      intent: 'activate_tool'
    })
  },

  async sendWelcomeNotification(userId: string, userName: string) {
    return this.create({
      userId,
      type: 'success',
      title: 'Welcome to mywoki! 👋',
      message: `Hello ${userName || 'there'}! Get started by exploring tools and activating your first project.`,
      data: { category: 'welcome', timestamp: new Date().toISOString() },
      intent: 'learn'
    })
  },

  async sendPlanUpgradeNotification(userId: string, oldPlan: string, newPlan: string) {
    return this.create({
      userId,
      type: 'success',
      title: 'Plan Upgraded! 🚀',
      message: `You've upgraded from ${oldPlan} to ${newPlan}. New features are now available.`,
      data: { 
        old_plan: oldPlan, 
        new_plan: newPlan,
        category: 'billing'
      },
      intent: 'billing'
    })
  },

  async sendBillingNotification(userId: string, message: string, isError = false) {
    return this.create({
      userId,
      type: isError ? 'error' : 'info',
      title: isError ? 'Billing Issue' : 'Billing Update',
      message,
      data: { category: 'billing' },
      intent: 'billing'
    })
  },

  async sendSystemNotification(userId: string, title: string, message: string) {
    return this.create({
      userId,
      type: 'info',
      title,
      message,
      data: { category: 'system', timestamp: new Date().toISOString() },
      intent: 'review'
    })
  }
}

// Real-time notifications subscription helper
export function subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
  const subscription = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as Notification)
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

// Bulk notification sender (for admin use)
export async function sendBulkNotification(
  userIds: string[],
  notification: Omit<CreateNotificationParams, 'userId'>
) {
  try {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      ...notification,
      read: false,
      created_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select()

    if (error) throw error
    return { success: true, count: data?.length || 0 }
  } catch (error: any) {
    console.error('Error sending bulk notifications:', error)
    return { success: false, error: error.message }
  }
}
