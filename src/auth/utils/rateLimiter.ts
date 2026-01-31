import { supabase } from '../services/supabase'

export class RateLimiter {
  private MAX_ATTEMPTS_PER_HOUR = 10
  private MAX_ATTEMPTS_PER_DAY = 50
  private COOLDOWN_MINUTES = 5

  async canSendEmail(email: string): Promise<{ allowed: boolean; cooldown?: number }> {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Check hourly limit
    const { count: hourlyCount } = await supabase
      .from('verification_codes')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', oneHourAgo.toISOString())

    if (hourlyCount && hourlyCount >= this.MAX_ATTEMPTS_PER_HOUR) {
      return { 
        allowed: false, 
        cooldown: this.COOLDOWN_MINUTES 
      }
    }

    // Check daily limit
    const { count: dailyCount } = await supabase
      .from('verification_codes')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', oneDayAgo.toISOString())

    if (dailyCount && dailyCount >= this.MAX_ATTEMPTS_PER_DAY) {
      return { 
        allowed: false, 
        cooldown: 60 // 1 hour
      }
    }

    // Check cooldown
    const { data: lastAttempt } = await supabase
      .from('verification_codes')
      .select('created_at')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastAttempt) {
      const lastSent = new Date(lastAttempt.created_at)
      const diffMinutes = (now.getTime() - lastSent.getTime()) / (1000 * 60)
      
      if (diffMinutes < this.COOLDOWN_MINUTES) {
        const cooldown = Math.ceil(this.COOLDOWN_MINUTES - diffMinutes)
        return { allowed: false, cooldown }
      }
    }

    return { allowed: true }
  }

  async canSendMagicLink(email: string): Promise<{ allowed: boolean; cooldown?: number }> {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    // Check hourly limit for magic links
    const { count: hourlyCount } = await supabase
      .from('magic_links')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', oneHourAgo.toISOString())

    if (hourlyCount && hourlyCount >= 5) { // Max 5 magic links per hour
      return { 
        allowed: false, 
        cooldown: this.COOLDOWN_MINUTES 
      }
    }

    // Check cooldown
    const { data: lastAttempt } = await supabase
      .from('magic_links')
      .select('created_at')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastAttempt) {
      const lastSent = new Date(lastAttempt.created_at)
      const diffMinutes = (now.getTime() - lastSent.getTime()) / (1000 * 60)
      
      if (diffMinutes < 1) { // 1 minute cooldown for magic links
        return { allowed: false, cooldown: 1 }
      }
    }

    return { allowed: true }
  }

  async recordLoginAttempt(
    email: string, 
    success: boolean,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await supabase
      .from('login_attempts')
      .insert({
        email,
        ip_address: ipAddress,
        user_agent: userAgent,
        success
      })
  }

  async recordMagicLinkAttempt(email: string): Promise<void> {
    await supabase
      .from('login_attempts')
      .insert({
        email,
        success: false // Mark as false since it's just an attempt
      })
  }

  async isAccountLocked(email: string): Promise<boolean> {
    const now = new Date()
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000)

    // Count failed attempts in last 15 minutes
    const { count: failedAttempts } = await supabase
      .from('login_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .eq('success', false)
      .gte('created_at', fifteenMinutesAgo.toISOString())

    // Lock account after 5 failed attempts
    return (failedAttempts || 0) >= 5
  }

  async getRemainingAttempts(email: string): Promise<number> {
    const now = new Date()
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000)

    const { count: failedAttempts } = await supabase
      .from('login_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .eq('success', false)
      .gte('created_at', fifteenMinutesAgo.toISOString())

    return Math.max(0, 5 - (failedAttempts || 0))
  }

  async resetAttempts(email: string): Promise<void> {
    // Clean up old attempts
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    await supabase
      .from('login_attempts')
      .delete()
      .eq('email', email)
      .lt('created_at', twentyFourHoursAgo.toISOString())
  }
}

export const rateLimiter = new RateLimiter()
