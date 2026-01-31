"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { verificationService } from "../auth/services/verification"
import HelpModal from "./HelpModal"

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
)

const EmailSpinner = () => (
  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
)

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { userId, isAuthenticated, loading, initiateLogin, verifyCode, createProfile } = useAuth()

  // State management
  const [step, setStep] = useState<"email" | "code" | "profile">("email")
  const [email, setEmail] = useState(() => localStorage.getItem('login_email') || '')
  const [code, setCode] = useState("")
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [name, setName] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendTimer, setResendTimer] = useState(0)
  const [showNotification, setShowNotification] = useState("")
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailExists, setEmailExists] = useState<boolean | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Refs
  const verificationProcessedRef = useRef(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const emailRef = useRef<string>(email)
  const redirectedRef = useRef(false)

  // Initialize OTP refs
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 6)
  }, [])

  // Update email ref when email changes
  useEffect(() => {
    if (email) {
      emailRef.current = email
      localStorage.setItem('login_email', email)
    }
  }, [email])

  // Email existence check - skip if already redirected
  useEffect(() => {
    if (redirectedRef.current) return // Skip if already redirected
    
    const checkEmail = async () => {
      if (email && /^\S+@\S+\.\S+$/.test(email)) {
        setCheckingEmail(true)
        try {
          const exists = await verificationService.checkEmailExists(email)
          setEmailExists(exists)
          if (import.meta.env.DEV) {
            console.log(`🔍 Email ${exists ? 'exists' : 'does not exist'} in database`)
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error checking email:', error)
          }
          setEmailExists(null)
        }
        setCheckingEmail(false)
      } else {
        setEmailExists(null)
      }
    }

    const debounceTimer = setTimeout(checkEmail, 500)
    return () => clearTimeout(debounceTimer)
  }, [email, redirectedRef])

  // Move to profile step when new user is verified - skip if already redirected
  useEffect(() => {
    if (redirectedRef.current) return // Skip if already redirected
    
    if (userId === 'temp' && step === 'code') {
      if (import.meta.env.DEV) {
        console.log('🔍 New user verified, moving to profile step')
      }
      setStep("profile")
      setShowNotification("Verified! Please create your profile ✓")
    }
  }, [userId, step, redirectedRef])

  // Redirect to dashboard only after profile is created - guard with ref to prevent multiple redirects
  useEffect(() => {
    // Early return if already redirected
    if (redirectedRef.current) {
      return
    }

    // Only redirect if authenticated with a real user ID
    if (isAuthenticated && userId && typeof userId === 'string' && userId !== 'temp' && userId.length > 0) {
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      if (import.meta.env.DEV) {
        console.log('🔍 Profile complete, redirecting to:', redirectTo)
      }
      redirectedRef.current = true
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, userId, searchParams, navigate])

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 60000)
      return () => clearInterval(timer)
    }
  }, [resendCooldown])

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [resendTimer])

  // Notification auto-hide
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  // OTP handler
  const handleOtpChange = useCallback((value: string, index: number) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      setTimeout(() => {
        otpInputRefs.current[index + 1]?.focus()
      }, 10)
    }

    const newCode = newOtp.join("")
    setCode(newCode)

    if (newOtp.every(d => d !== "") && !verificationProcessedRef.current) {
      if (import.meta.env.DEV) {
        console.log('🔍 All OTP digits entered, auto-verifying...')
      }
      verificationProcessedRef.current = true
      setIsVerifying(true)
      
      const currentEmail = emailRef.current || email || localStorage.getItem('login_email') || ''
      
      if (!currentEmail || !currentEmail.includes('@')) {
        if (import.meta.env.DEV) {
          console.error('🔍 ERROR: Email is empty!')
        }
        setShowNotification("Email is missing. Please go back and re-enter your email.")
        verificationProcessedRef.current = false
        setIsVerifying(false)
        return
      }
      
      setTimeout(() => {
        handleCodeVerify(newCode, currentEmail)
      }, 300)
    }
  }, [otp, email])

  const handleOtpKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        setCode(newOtp.join(""))
        
        setTimeout(() => {
          otpInputRefs.current[index - 1]?.focus()
          otpInputRefs.current[index - 1]?.select()
        }, 10)
      } else if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        setCode(newOtp.join(""))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      otpInputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      otpInputRefs.current[index + 1]?.focus()
    }
  }, [otp])

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '')

    if (pasteData.length >= 6 && !verificationProcessedRef.current) {
      if (import.meta.env.DEV) {
        console.log('🔍 Pasted OTP code:', pasteData)
      }
      
      const currentEmail = emailRef.current || email || localStorage.getItem('login_email') || ''
      
      if (!currentEmail || !currentEmail.includes('@')) {
        if (import.meta.env.DEV) {
          console.error('🔍 ERROR: Email is empty during paste!')
        }
        setShowNotification("Email is missing. Please go back and re-enter your email.")
        return
      }
      
      verificationProcessedRef.current = true
      setIsVerifying(true)
      
      const digits = pasteData.slice(0, 6).split('')
      setOtp(digits)
      setCode(digits.join(""))
      
      setTimeout(() => {
        handleCodeVerify(digits.join(""), currentEmail)
      }, 300)
    }
  }, [email])

  // Action Handlers
  const handleEmailSubmit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setShowNotification("Please enter a valid email address")
      return
    }

    localStorage.setItem('login_email', email)
    emailRef.current = email
    
    if (import.meta.env.DEV) {
      console.log('🔍 Initiating login for email:', email)
    }
    const result = await initiateLogin(email)
    
    if (result.success) {
      if (import.meta.env.DEV) {
        console.log('🔍 Verification code sent successfully')
      }
      setStep("code")
      setShowNotification("Verification code sent to your email ✓")
      
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 100)
    } else {
      if (import.meta.env.DEV) {
        console.log('🔍 Failed to send code:', result.message)
      }
      setShowNotification(result.message || "Failed to send code")
      if (result.cooldown) {
        setResendCooldown(result.cooldown)
        setResendTimer(result.cooldown * 60)
      }
    }
  }

  const handleCodeVerify = async (codeToVerify?: string, emailToUse?: string) => {
    const currentEmail = emailToUse || emailRef.current || email || localStorage.getItem('login_email') || ''
    const codeToCheck = codeToVerify || code
    
    if (import.meta.env.DEV) {
      console.log('🔍 Verifying code:', { code: codeToCheck, email: currentEmail })
    }
    
    if (!currentEmail || !currentEmail.includes('@')) {
      if (import.meta.env.DEV) {
        console.error('🔍 CRITICAL: Email is empty!')
      }
      setShowNotification("Email is missing. Please go back and re-enter your email.")
      verificationProcessedRef.current = false
      setIsVerifying(false)
      
      setTimeout(() => {
        setStep("email")
        setOtp(["", "", "", "", "", ""])
        setCode("")
      }, 1000)
      return
    }
    
    if (codeToCheck.length !== 6) {
      setShowNotification("Please enter the complete 6-digit code")
      verificationProcessedRef.current = false
      setIsVerifying(false)
      return
    }

    setShowNotification("Verifying code...")

    try {
      const result = await verifyCode(currentEmail, codeToCheck)
      if (import.meta.env.DEV) {
        console.log('🔍 verifyCode result:', result)
      }

      if (result.success) {
        if (result.isNewUser) {
          if (import.meta.env.DEV) {
            console.log('🔍 New user verified successfully')
          }
          // The useEffect will handle moving to profile step
          // when userId becomes 'temp'
        } else {
          if (import.meta.env.DEV) {
            console.log('🔍 Existing user verified successfully')
          }
          setShowNotification("Login successful! Redirecting...")
          // The useEffect will handle the redirect
        }
      } else {
        if (import.meta.env.DEV) {
          console.log('🔍 Verification failed:', result.message)
        }
        setShowNotification(result.message || "Invalid verification code")
        
        setOtp(["", "", "", "", "", ""])
        setCode("")
        verificationProcessedRef.current = false
        setIsVerifying(false)
        
        setTimeout(() => {
          otpInputRefs.current[0]?.focus()
        }, 100)
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('🔍 Verification error:', error)
      }
      setShowNotification("Verification failed. Please try again.")
      
      verificationProcessedRef.current = false
      setIsVerifying(false)
    }
  }

  const handleProfileSubmit = async () => {
    if (!name.trim()) {
      setShowNotification("Please enter your name")
      return
    }

    const currentEmail = emailRef.current || email || localStorage.getItem('login_email') || ''
    
    if (!currentEmail || !currentEmail.includes('@')) {
      setShowNotification("Email is missing. Please start over.")
      setStep("email")
      return
    }
    
    if (import.meta.env.DEV) {
      console.log('🔍 Creating profile for:', { name, email: currentEmail })
    }
    const result = await createProfile(currentEmail, name.trim())
    
    if (result.success) {
      if (import.meta.env.DEV) {
        console.log('🔍 Profile created successfully')
      }
      setShowNotification("Profile created successfully ✓")
      setIsTransitioning(true)
      setTimeout(() => navigate("/onboarding"), 500)
    } else {
      if (import.meta.env.DEV) {
        console.log('🔍 Profile creation failed:', result.message)
      }
      setShowNotification(result.message || "Failed to create profile. Please try again.")
    }
  }

  const handleBackToEmail = () => {
    if (import.meta.env.DEV) {
      console.log('🔍 Going back to email step')
    }
    setStep("email")
    setOtp(["", "", "", "", "", ""])
    setCode("")
    verificationProcessedRef.current = false
    setIsVerifying(false)
    
    const savedEmail = localStorage.getItem('login_email') || emailRef.current || ''
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }



  const handleResendCode = async () => {
    if (resendCooldown > 0 || resendTimer > 0) return
    
    const currentEmail = emailRef.current || email || localStorage.getItem('login_email') || ''
    
    if (!currentEmail || !currentEmail.includes('@')) {
      setShowNotification("Email is missing. Please go back and re-enter your email.")
      return
    }
    
    if (import.meta.env.DEV) {
      console.log('🔍 Resending code to', currentEmail)
    }
    
    // Reset verification state to allow new attempt
    verificationProcessedRef.current = false
    setOtp(["" , "", "", "", "", ""])
    setCode("")
    
    const result = await initiateLogin(currentEmail)
    
    if (result.success) {
      setShowNotification("New verification code sent ✓")
      if (result.cooldown) {
        setResendCooldown(result.cooldown)
        setResendTimer(result.cooldown * 60)
      }
      // Focus back on first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 100)
    } else {
      setShowNotification(result.message || "Failed to resend code")
      if (result.cooldown) {
        setResendCooldown(result.cooldown)
        setResendTimer(result.cooldown * 60)
      }
    }
  }

  // UI
  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      {showNotification && (
        <div className="bg-black text-white text-center py-3 px-4 text-sm font-medium animate-fade-in">
          {showNotification}
        </div>
      )}

      <header className="py-4 px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/mywoki-logo.png" alt="mywoki" className="h-12 w-12" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="w-full max-w-md">
          {step === "email" && (
            <div className="w-full max-w-sm mx-auto animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
                Welcome to mywoki
              </h1>
              <p className="mt-2 text-center text-gray-600">
                Log in or sign up with your email
              </p>

              <div className="mt-8 relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    const newEmail = e.target.value.trim()
                    setEmail(newEmail)
                    emailRef.current = newEmail
                    localStorage.setItem('login_email', newEmail)
                  }}
                  className="w-full px-4 py-3 pr-12 text-base text-black rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700"
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                  autoComplete="email"
                  autoFocus
                />

                {/* Email checking spinner */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {checkingEmail ? (
                    <EmailSpinner />
                  ) : emailExists !== null ? (
                    <span 
                      className={`text-sm font-medium ${emailExists ? 'text-emerald-600' : 'text-blue-600'}`}
                      title={emailExists ? "Existing user" : "New user"}
                    >
                      {emailExists ? '✓' : '★'}
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={loading || !email || !/^\S+@\S+\.\S+$/.test(email)}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm hover:shadow-md"
              >
                {loading ? <Spinner /> : "Continue"}
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms and Privacy Policy
              </p>
            </div>
          )}

          {step === "code" && (
            <div className="w-full max-w-sm mx-auto animate-fade-in">
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToEmail}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Back to email"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-500 font-medium">Step 2 of 3</span>
                </div>
                <div className="w-9"></div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
                Check your email
              </h1>
              <p className="mt-2 text-center text-gray-600">
                Enter the 6-digit code sent to
              </p>
              <p className="text-center text-gray-900 font-medium text-sm mt-1 break-all">
                {emailRef.current || email || localStorage.getItem('login_email') || 'No email found'}
              </p>

              <div className="mt-8 flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpInputRefs.current[i] = el; }}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    inputMode="numeric"
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 rounded-lg text-black border border-gray-300 text-center text-xl font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                    disabled={isVerifying}
                    aria-label={`Digit ${i + 1} of 6`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  const currentEmail = emailRef.current || email || localStorage.getItem('login_email') || ''
                  if (!currentEmail || !currentEmail.includes('@')) {
                    setShowNotification("Email is missing. Please go back and re-enter your email.")
                    return
                  }
                  handleCodeVerify()
                }}
                disabled={isVerifying || otp.some(d => d === "") || loading}
                className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
              >
                {isVerifying || loading ? (
                  <>
                    <Spinner />
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify code"
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive a code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || resendTimer > 0 || loading}
                  className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {resendTimer > 0
                    ? `Resend code in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`
                    : resendCooldown > 0
                    ? `Resend available in ${resendCooldown} minute${resendCooldown > 1 ? 's' : ''}`
                    : "Click to resend code"
                  }
                </button>
              </div>
            </div>
          )}

          {step === "profile" && (
            <div className="w-full max-w-sm mx-auto animate-fade-in">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => {
                    setStep("code")
                    verificationProcessedRef.current = false
                    setIsVerifying(false)
                  }}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Back to code verification"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-500 font-medium">Step 3 of 3</span>
                </div>
                <div className="w-9"></div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Tell us about yourself
              </h1>
              <p className="mt-2 text-gray-600">
                What should we call you?
              </p>
              
              <input
                type="text"
                className="mt-6 w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base shadow-sm text-black"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProfileSubmit()}
                autoComplete="name"
                autoFocus
              />
              
              <button
                onClick={handleProfileSubmit}
                disabled={loading || !name.trim()}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
              >
                {loading ? <Spinner /> : "Continue"}
              </button>
            </div>
          )}


        </div>

        {isTransitioning && (
          <div className="absolute inset-0 bg-[#f7f7f5] bg-opacity-75 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <EmailSpinner />
              <span className="text-gray-600">Redirecting to onboarding...</span>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center">
        <button
          onClick={() => setShowHelpModal(true)}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          Need help?
        </button>

        <div className="mt-4 text-xs text-gray-500">
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 px-2">Terms of Service</a> |
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 px-2">Privacy Policy</a> |
          <a href="/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 px-2">Cookie Policy</a>
          {/* Contact Us link removed as requested */}
        </div>
      </footer>

      <HelpModal showHelpModal={showHelpModal} setShowHelpModal={setShowHelpModal} />
    </div>
  )
}