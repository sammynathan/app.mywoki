import axios from 'axios'

interface BrevoEmailOptions {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  sender?: { name: string; email: string }
}

export class BrevoService {
  private apiKey: string
  private sender = { name: 'mywoki', email: 'noreply@mywoki.com' }

  constructor() {
    this.apiKey = import.meta.env.VITE_BREVO_API_KEY

    if (!this.apiKey) {
      throw new Error('Missing Brevo API key. Please set VITE_BREVO_API_KEY in your .env file.')
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your mywoki Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10B981;">Verify Your Email</h2>
            <p>Enter this code to continue with your mywoki account:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 10px; font-weight: bold; color: #111827; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #6B7280; font-size: 14px;">
              This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: [{ email }],
      subject: 'Your mywoki Verification Code',
      htmlContent
    })
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Welcome to mywoki, ${name}!</h2>
          <p>Your account is ready to use.</p>
        </body>
      </html>
    `

    return this.sendEmail({
      to: [{ email, name }],
      subject: 'Welcome to mywoki!',
      htmlContent
    })
  }

  private async sendEmail(options: BrevoEmailOptions): Promise<boolean> {
    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: options.sender || this.sender,
          to: options.to,
          subject: options.subject,
          htmlContent: options.htmlContent
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.status === 201
    } catch (error) {
      console.error('Brevo email error:', error)
      return false
    }
  }
}

let brevoService: BrevoService | null = null

try {
  brevoService = new BrevoService()
} catch (error) {
  console.warn('Brevo service not initialized:', error)
}

export { brevoService }
