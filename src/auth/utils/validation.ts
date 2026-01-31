export const validation = {
  validateEmail: (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email.trim())
  },

  validateCode: (code: string): boolean => {
    return /^\d{6}$/.test(code.trim())
  },

  validatePassword: (password: string): {
    isValid: boolean
    errors: string[]
  } => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  validateName: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50
  },

  sanitizeInput: (input: string): string => {
    return input
      .trim()
      .replace(/[<>'"&]/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 500)
  },

  validateUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  validatePhone: (phone: string): boolean => {
    const re = /^[\+]?[1-9][\d]{0,15}$/
    return re.test(phone.replace(/[\s\-\(\)]/g, ''))
  },

  validateDate: (date: string): boolean => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime()) && parsed <= new Date()
  }
}
