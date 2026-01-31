export type BillingIntent = 'starter' | 'core' | 'growth'

export function getBillingIntent(): BillingIntent {
  try {
    const raw = localStorage.getItem('mywoki_onboarding')
    if (!raw) return 'starter'

    const data = JSON.parse(raw)

    switch (data.primaryGoal) {
      case 'learning':
        return 'starter'
      case 'personal':
        return 'core'
      case 'team':
        return 'growth'
      default:
        return 'starter'
    }
  } catch {
    return 'starter'
  }
}
