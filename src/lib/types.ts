// types.ts
export interface Tool {
  id: string
  name: string
  description: string
  icon_name: string
  category: string
  is_active: boolean
  activation_code: string
  requires_mywoki_login: boolean
  usage_stats: {
    last_used: string
    activations: number
  }
  issues: string[]
  vendor_id?: string
  external_api_url?: string
  integration_guide?: string
  support_email?: string
  price: number
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  stripe_subscription_id?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
  subscription_plans?: {
    name: string
    description: string
    price: number
    max_tools: number
  }
}

export interface Notification {
  id: string
  user_id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

export interface ToolVendor {
  id: string
  name: string
  email: string
  company?: string
  api_key: string
  is_active: boolean
  commission_rate: number
  created_at: string
}