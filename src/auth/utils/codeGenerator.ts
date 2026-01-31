export class CodeGenerator {
  private static ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  private static NUMERIC = '0123456789'
  private static HEX = '0123456789ABCDEF'

  static generateNumericCode(length: number = 6): string {
    let code = ''
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.NUMERIC.length)
      code += this.NUMERIC[randomIndex]
    }
    
    return code
  }

  static generateAlphanumericCode(length: number = 8): string {
    let code = ''
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.ALPHANUMERIC.length)
      code += this.ALPHANUMERIC[randomIndex]
    }
    
    return code
  }

  static generateHexCode(length: number = 32): string {
    let code = ''
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.HEX.length)
      code += this.HEX[randomIndex]
    }
    
    return code
  }

  static generateUUID(): string {
    return crypto.randomUUID()
  }

  static generateToken(length: number = 64): string {
    const bytes = new Uint8Array(length)
    crypto.getRandomValues(bytes)
    
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  static generateShortId(length: number = 8): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2)
    
    const combined = (timestamp + random).replace(/[^a-z0-9]/g, '')
    
    return combined.length > length 
      ? combined.substring(0, length)
      : combined.padEnd(length, '0')
  }

  static generateVerificationCode(): string {
    // Format: ABC-123
    const letters = this.generateAlphanumericCode(3).toUpperCase()
    const numbers = this.generateNumericCode(3)
    
    return `${letters}-${numbers}`
  }

  static generateConfirmationCode(): string {
    // Format: XXX-XXX-XXX
    const parts = []
    
    for (let i = 0; i < 3; i++) {
      parts.push(this.generateAlphanumericCode(3).toUpperCase())
    }
    
    return parts.join('-')
  }

  static generateRecoveryCode(): string {
    // Format: 1234-5678-9012-3456
    const parts = []
    
    for (let i = 0; i < 4; i++) {
      parts.push(this.generateNumericCode(4))
    }
    
    return parts.join('-')
  }
}
