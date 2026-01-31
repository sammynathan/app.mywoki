"use client"

import { useState, useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { useEmailVerification } from '../hooks/useEmailVerification'
import { validation } from '../utils/validation'

interface EmailCodeInputProps {
  email: string
  onCodeVerified: (isNewUser: boolean) => void
  onResendRequested: () => void
  autoSubmit?: boolean
  length?: number
  disabled?: boolean
}

export default function EmailCodeInput({
  email,
  onCodeVerified,
  onResendRequested,
  autoSubmit = true,
  length = 6,
  disabled = false
}: EmailCodeInputProps) {
  const { verifyCode, resendCode, loading, error, cooldown } = useEmailVerification()
  
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [message, setMessage] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Auto-submit when all digits are entered
  useEffect(() => {
    const code = digits.join('')
    if (autoSubmit && code.length === length && validation.validateCode(code)) {
      handleSubmit()
    }
  }, [digits, autoSubmit])

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow numbers
    
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1) // Take only last character
    setDigits(newDigits)

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous input on backspace
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        setDigits(newDigits)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '')
    
    if (pasteData.length === length) {
      const newDigits = pasteData.split('').slice(0, length)
      setDigits(newDigits)
      
      // Focus last input
      inputRefs.current[length - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    const code = digits.join('')
    
    if (!validation.validateCode(code)) {
      setMessage('Please enter a valid 6-digit code')
      return
    }

    setIsVerifying(true)
    setMessage('')

    const result = await verifyCode(email, code)
    
    if (result.success) {
      setMessage('Code verified successfully!')
      setTimeout(() => {
        onCodeVerified(result.isNewUser || false)
      }, 500)
    } else {
      setMessage(result.message || 'Verification failed')
      // Clear inputs on error
      setDigits(Array(length).fill(''))
      inputRefs.current[0]?.focus()
    }
    
    setIsVerifying(false)
  }

  const handleResend = async () => {
    setMessage('')
    const result = await resendCode(email)
    
    if (result.success) {
      setMessage('New code sent to your email!')
      onResendRequested()
    } else {
      setMessage(result.message || 'Failed to resend code')
    }
  }

  const canResend = cooldown === 0 && !disabled

  return (
    <div className="w-full">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Enter the {length}-digit code sent to{' '}
          <span className="font-semibold">{email}</span>
        </label>
        
        <div className="flex justify-center gap-3 mb-4">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled || isVerifying}
              className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors ${
                digit ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          ))}
        </div>

        <div className="h-6 flex items-center justify-center">
          {isVerifying && (
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Verifying...</span>
            </div>
          )}
          
          {message && !isVerifying && (
            <p className={`text-sm ${
              message.includes('success') ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {!autoSubmit && (
          <button
            onClick={handleSubmit}
            disabled={digits.join('').length !== length || isVerifying || disabled}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </button>
        )}

        <button
          onClick={handleResend}
          disabled={!canResend || loading}
          className="w-full text-emerald-600 py-2 text-sm font-medium hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown} min(s)` : 'Resend code'}
        </button>
      </div>

      {/* Code input instructions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check your spam folder if you don't see the email
          </p>
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Code expires in 10 minutes
          </p>
        </div>
      </div>
    </div>
  )
}
