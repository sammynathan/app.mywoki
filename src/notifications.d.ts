
declare module '../lib/notifications' {
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

  export interface NotificationService {
    create(notification: CreateNotificationParams): Promise<{
      success: boolean
      data?: Notification
      error?: string
    }>
    
    getUnreadCount(userId: string): Promise<{
      success: boolean
      count: number
      error?: string
    }>
    
    getUserNotifications(userId: string, limit?: number): Promise<{
      success: boolean
      notifications: Notification[]
      error?: string
    }>
    
    markAsRead(userId: string, notificationId: string): Promise<{
      success: boolean
      error?: string
    }>
    
    markAllAsRead(userId: string): Promise<{
      success: boolean
      error?: string
    }>
    
    clearAll(userId: string): Promise<{
      success: boolean
      error?: string
    }>
    
    sendToolActivatedNotification(userId: string, toolName: string, toolId: string): Promise<any>
    sendToolDeactivatedNotification(userId: string, toolName: string, toolId: string): Promise<any>
    sendWelcomeNotification(userId: string, userName: string): Promise<any>
    sendPlanUpgradeNotification(userId: string, oldPlan: string, newPlan: string): Promise<any>
    sendBillingNotification(userId: string, message: string, isError?: boolean): Promise<any>
    sendSystemNotification(userId: string, title: string, message: string): Promise<any>
  }

  export const notificationService: NotificationService
  
  export function subscribeToNotifications(
    userId: string, 
    callback: (notification: Notification) => void
  ): () => void
  
  export function sendBulkNotification(
    userIds: string[],
    notification: Omit<CreateNotificationParams, 'userId'>
  ): Promise<{
    success: boolean
    count?: number
    error?: string
  }>
}
