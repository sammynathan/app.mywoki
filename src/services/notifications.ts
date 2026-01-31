import { supabase } from '../lib/supabase'

export interface CreateNotificationParams {
  userId: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  data?: Record<string, any>
  intent?: 'activate_tool' | 'billing' | 'review' | 'learn'
}

export const notificationService = {
  async create(notification: CreateNotificationParams) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating notification:', error)
      return { success: false, error }
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
    } catch (error) {
      console.error('Error getting unread count:', error)
      return { success: false, error, count: 0 }
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
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return { success: false, error }
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
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return { success: false, error }
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
    } catch (error) {
      console.error('Error clearing notifications:', error)
      return { success: false, error }
    }
  },

  // Example: Send a tool activation notification
  async sendToolActivatedNotification(userId: string, toolName: string, toolId: string) {
    return this.create({
      userId,
      type: 'success',
      title: 'Tool Activated',
      message: `You've successfully activated "${toolName}". Start using it in your projects.`,
      data: { tool_id: toolId, category: 'tool_activation' },
      intent: 'activate_tool'
    })
  },

  // Example: Send a billing notification
  async sendBillingNotification(userId: string, message: string, isError = false) {
    return this.create({
      userId,
      type: isError ? 'error' : 'info',
      title: isError ? 'Billing Issue' : 'Billing Update',
      message,
      data: { category: 'billing' },
      intent: 'billing'
    })
  }
}