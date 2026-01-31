"use client"

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMagicLink } from '../hooks/useMagicLink'
import { authService } from '../services/authService'
import { validation } from '../utils/validation'

export default function MagicLinkVerification() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { generateMagicLink, verifyMagicLink, loading, error } = useMagicLink()
  
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  // Check for token in URL
  const token = searchParams.get('token')
  const emailFromUrl = searchParams.get('email')

  // Auto-verify if token exists
  useState(() => {
    if (token && emailFromUrl) {
      handleAutoVerify(token, emailFromUrl)
    }
  })

  const handleAutoVerify = async (token: string, email: string) => {
    setIsVerifying(true)
    setMessage('Verifying magic link...')

    const result = await verifyMagicLink(token, email)
    
    if (result.success) {
      setMessage('Magic link verified successfully!')
      
      // Check if user exists and create session
      await authService.createSession(email)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } else {
      setMessage(result.message || 'Failed to verify magic link')
    }
    
    setIsVerifying(false)
  }

  const handleSendMagicLink = async () => {
    if (!validation.validateEmail(email)) {
      setMessage('Please enter a valid email address')
      return
    }

    setMessage('')
    const result = await generateMagicLink(email)
    
    if (result.success && result.link) {
      setMagicLinkSent(true)
      setMessage('Magic link sent to your email! Click the link to login.')
      
      // Optional: Copy link to clipboard
      // await navigator.clipboard.writeText(result.link)
    } else {
      setMessage(result.message || 'Failed to send magic link')
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setMessage('')
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Verifying Magic Link</h2>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {magicLinkSent ? 'Check Your Email' : 'Magic Link Login'}
          </h1>
          <p className="text-gray-600 mt-2">
            {magicLinkSent 
              ? 'We sent a magic link to your email. Click it to login instantly.' 
              : 'Enter your email to receive a magic login link.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {message && !error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('success') 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' 
              : 'bg-blue-50 border border-blue-200 text-blue-600'
          }`}>
            {message}
          </div>
        )}

        {!magicLinkSent ? (
          <>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleSendMagicLink}
              disabled={loading || !email}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Want to use a verification code instead?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Use Code
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <p className="text-gray-700 mb-6">
              We sent a secure login link to{' '}
              <span className="font-semibold text-gray-900">{email}</span>.
              Check your inbox and click the link to access your account.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleSendMagicLink}
                disabled={loading}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Resending...' : 'Resend Magic Link'}
              </button>

              <button
                onClick={() => {
                  setMagicLinkSent(false)
                  setMessage('')
                }}
                className="w-full text-emerald-600 py-3 rounded-lg font-medium hover:text-emerald-700"
              >
                Use a different email
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                The magic link will expire in 15 minutes.
                Can't find the email? Check your spam folder.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
