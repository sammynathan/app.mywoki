export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price: number
  period: string
  features: string[]
  tool_limit: string
  support: string
  team_members: string
  max_tools: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  paystack_subscription_id?: string
  paystack_customer_id?: string
  created_at: string
  updated_at: string
  subscription_plans?: SubscriptionPlan
}

export interface PaymentMethod {
  id: string
  user_id: string
  paystack_auth_code: string
  last4: string
  brand: string
  expiry_month: number
  expiry_year: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface BillingHistory {
  id: string
  user_id: string
  subscription_id?: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  paystack_reference?: string
  description?: string
  billed_at: string
}
