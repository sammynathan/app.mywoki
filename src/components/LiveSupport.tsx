// LiveSupport.tsx
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MessageCircle, Mail, HelpCircle, CheckCircle, Clock } from "lucide-react"
import ChatWidget, { tawkTo } from "./ChatWidget"  // ← IMPORT tawkTo HERE!

export default function LiveSupport() {
  const navigate = useNavigate()
  const [chatStatus, setChatStatus] = useState<'loading' | 'ready' | 'online' | 'offline'>('loading')
  const [supportHours, setSupportHours] = useState<{isOpen: boolean, nextOpen: string}>({isOpen: false, nextOpen: '9:00 AM'})

  // Check current time for support hours
  useEffect(() => {
    const checkSupportHours = () => {
      const now = new Date()
      const day = now.getDay()
      const hour = now.getHours()
      
      const isWeekday = day >= 1 && day <= 5
      const isBusinessHours = hour >= 9 && hour < 18
      
      const isOpen = isWeekday && isBusinessHours
      
      let nextOpen = '9:00 AM'
      if (!isWeekday) {
        nextOpen = 'Monday 9:00 AM'
      } else if (!isBusinessHours && hour < 9) {
        nextOpen = 'Today 9:00 AM'
      } else if (!isBusinessHours && hour >= 18) {
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' })
        nextOpen = `${dayName} 9:00 AM`
      }
      
      setSupportHours({ isOpen, nextOpen })
    }
    
    checkSupportHours()
    const interval = setInterval(checkSupportHours, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Listen for tawk.to status changes
  useEffect(() => {
    const tawkApi = window.Tawk_API;
    if (tawkApi && tawkApi.onStatusChange) {
      tawkApi.onStatusChange((status: string) => {
        setChatStatus(status === 'online' ? 'online' : 'offline')
      })
    }
    
    const timer = setTimeout(() => {
      if (window.Tawk_API) {
        setChatStatus('ready')
      } else {
        setChatStatus('offline')
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // FIXED: Use tawkTo.openChat() instead of window.Tawk_API directly!
  const openChat = () => {
    // This will show the widget in the SAME tab, not open a new one
    const success = tawkTo.openChat();
    
    // If tawkTo.openChat() returns false, it means API isn't ready yet
    // But it will handle the fallback internally
    if (!success) {
      console.log('Chat widget opening...');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-20 flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 flex-1">
          <img src="/mywoki-logo.png" className="h-12 w-12" alt="mywoki logo" />
          <span className="font-semibold text-gray-900 text-lg">Live Support</span>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Content */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <MessageCircle className="mb-6 text-emerald-600 w-16 h-16" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Live Support Chat
              </h1>
              <p className="text-gray-600 text-lg">
                Our support team is here to help you with anything related to mywoki.
                Whether you have questions about features, need technical assistance,
                or want to provide feedback, we're ready to help.
              </p>
            </div>

            {/* Support Status Card */}
            <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {chatStatus === 'loading' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="font-medium text-gray-900">Loading chat widget...</span>
                    </>
                  )}
                  {chatStatus === 'ready' && (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium text-gray-900">Chat is ready to connect</span>
                    </>
                  )}
                  {chatStatus === 'online' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-gray-900">Support team is online</span>
                    </>
                  )}
                  {chatStatus === 'offline' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="font-medium text-gray-900">Leave a message</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {supportHours.isOpen 
                      ? 'Open now • Closes 6:00 PM' 
                      : `Opens ${supportHours.nextOpen}`}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Hours of Operation:</strong> Monday-Friday, 9:00 AM - 6:00 PM</p>
                <p><strong>Average Response Time:</strong> Within 5 minutes during business hours</p>
              </div>
            </div>

            {/* Help Tips */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 mb-8">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Getting the Most from Live Chat</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Be prepared</strong> - Have your account details ready for faster service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Describe your issue clearly</strong> - Include error messages or screenshots if possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Check our Help Center first</strong> - Many common questions have instant answers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Non-urgent matters?</strong> Email is best for complex issues requiring research</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Email Support */}
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8">
              <Mail className="mb-4 text-emerald-600 w-10 h-10" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Prefer Email Support?
              </h3>
              <p className="text-gray-600 mb-6">
                For detailed technical issues, billing inquiries, or when you need to share files,
                email support is often the best option. We respond to all emails within 24 hours.
              </p>
              <a
                href="mailto:support@mywoki.com?subject=mywoki Support Request&body=Please describe your issue in detail..."
                className="inline-flex items-center gap-3 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                Email support@mywoki.com
              </a>
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:w-1/2">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Start a Live Chat
                  </h2>
                  <p className="text-gray-600">
                    Connect directly with our support team in real-time. Perfect for
                    quick questions, troubleshooting, or guidance on using mywoki.
                  </p>
                </div>

                <div className="space-y-6">
                  <button
                    onClick={openChat}  // ← This now calls the FIXED function!
                    className="
                      w-full px-8 py-5 rounded-xl font-bold text-lg
                      bg-gradient-to-r from-emerald-600 to-emerald-500 
                      text-white hover:from-emerald-700 hover:to-emerald-600 
                      transition-all transform hover:scale-[1.02] shadow-lg
                      flex items-center justify-center gap-3
                    "
                  >
                    <MessageCircle className="w-6 h-6" />
                    Open Live Chat
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    <p>Click above to open the chat window. Our team is standing by to assist you.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="mailto:support@mywoki.com"
                      className="
                        px-6 py-4 
                        bg-blue-50 text-blue-700 
                        rounded-lg hover:bg-blue-100 
                        transition-colors
                        flex items-center justify-center gap-3
                        font-medium
                      "
                    >
                      <Mail className="w-5 h-5" />
                      Email Support
                    </a>
                    
                    <button
                      onClick={() => navigate('/help')}
                      className="
                        px-6 py-4 
                        bg-gray-50 text-gray-700 
                        rounded-lg hover:bg-gray-100 
                        transition-colors
                        flex items-center justify-center gap-3
                        font-medium
                      "
                    >
                      <HelpCircle className="w-5 h-5" />
                      Help Center
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">What to Expect:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Immediate connection to our support team</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Secure, private conversation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Ability to share screenshots and files</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Chat transcript emailed to you automatically</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tawk.to Chat Widget */}
      <ChatWidget autoShow={false} />
    </div>
  )
}