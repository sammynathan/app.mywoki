// pages/terms-of-service.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Gavel, AlertTriangle,
  BookOpen, Users, CreditCard, Power,
  Shield, Lock, Globe, Mail,
  Calendar, CheckCircle, XCircle,
  ChevronRight, ExternalLink, Database, Bell
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function TermsOfService() {
  const [lastUpdated] = useState('January 19, 2026')

  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'definitions', title: '2. Definitions' },
    { id: 'accounts', title: '3. Accounts & Registration' },
    { id: 'subscriptions', title: '4. Subscription Terms' },
    { id: 'tools', title: '5. Tool Usage & Access' },
    { id: 'payments', title: '6. Payment Terms' },
    { id: 'user-obligations', title: '7. User Obligations' },
    { id: 'prohibited', title: '8. Prohibited Activities' },
    { id: 'intellectual', title: '9. Intellectual Property' },
    { id: 'third-party', title: '10. Third-Party Tools' },
    { id: 'termination', title: '11. Termination' },
    { id: 'disclaimers', title: '12. Disclaimers' },
    { id: 'liability', title: '13. Liability Limitations' },
    { id: 'indemnification', title: '14. Indemnification' },
    { id: 'disputes', title: '15. Dispute Resolution' },
    { id: 'governing', title: '16. Governing Law' },
    { id: 'changes', title: '17. Changes to Terms' },
    { id: 'contact', title: '18. Contact Information' }
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Logo Bar */}
      <div className="sticky top-0 z-50 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/mywoki-logo.png" alt="mywoki" className="h-12 w-12 object-contain" />
          </Link>
        </div>
      </div>
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> These Terms constitute a legally binding agreement. By using Mywoki Marketplace, you agree to be bound by these Terms.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24 p-6 border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5" />
                On This Page
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Reading</h4>
                <div className="space-y-3">
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Privacy Policy</span>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Cookie Policy</span>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Summary</h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Monthly subscription required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Access to all tools in marketplace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>No refunds for partial periods</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:w-3/4 space-y-12">
            {/* Section 1 - Agreement */}
            <section id="agreement" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">1</span>
                  Agreement to Terms
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    These Terms of Service ("Terms") govern your access to and use of the Mywoki Marketplace platform ("Service"), including any content, functionality, and services offered on or through our website.
                  </p>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">By accessing or using the Service, you:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Agree to be bound by these Terms and our Privacy Policy</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Confirm you are at least 16 years of age (or older if required by your jurisdiction)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Have the legal authority to enter into this agreement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Agree to receive communications electronically</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      If you do not agree:
                    </h3>
                    <p className="text-gray-600">
                      If you do not agree to these Terms, you must not access or use the Service. Your continued use of the Service constitutes acceptance of any changes to these Terms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 - Definitions */}
            <section id="definitions" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">2</span>
                  Definitions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Power className="w-5 h-5 text-blue-600" />
                      Service
                    </h3>
                    <p className="text-gray-600 text-sm">
                      The Mywoki Marketplace platform, including all features, tools, websites, and mobile applications.
                    </p>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      User
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Any individual or entity that accesses or uses the Service, including subscribers and visitors.
                    </p>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Subscription
                    </h3>
                    <p className="text-gray-600 text-sm">
                      The recurring payment plan that grants access to the Service for a specified period.
                    </p>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Tool
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Any software, application, automation, or service available through the Mywoki Marketplace.
                    </p>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Content
                    </h3>
                    <p className="text-gray-600 text-sm">
                      All information, data, text, software, graphics, and other materials available through the Service.
                    </p>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Third-Party Services
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Tools, websites, or services operated by third parties that integrate with or are accessible through the Service.
                    </p>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 3 - Accounts */}
            <section id="accounts" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">3</span>
                  Accounts & Registration
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Creation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6 border border-green-200 bg-green-50">
                        <h4 className="font-semibold text-gray-900 mb-3">You Must Provide:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Accurate and complete information</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Valid email address</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Secure password</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Current contact information</span>
                          </li>
                        </ul>
                      </Card>
                      
                      <Card className="p-6 border border-red-200 bg-red-50">
                        <h4 className="font-semibold text-gray-900 mb-3">You Must Not:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Create multiple accounts</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Use another person's identity</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Share your account credentials</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Use false or misleading information</span>
                          </li>
                        </ul>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Account Security</h3>
                    <p className="text-gray-600 mb-4">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">24h</div>
                        <p className="text-sm text-gray-600">Notify us of unauthorized access</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">2FA</div>
                        <p className="text-sm text-gray-600">Enable two-factor authentication</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">90d</div>
                        <p className="text-sm text-gray-600">Change password regularly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 - Subscriptions */}
            <section id="subscriptions" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">4</span>
                  Subscription Terms
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border border-blue-200">
                      <div className="text-center mb-4">
                        <CreditCard className="w-12 h-12 text-blue-600 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-3">Billing Cycle</h3>
                      <p className="text-gray-600 text-sm text-center">
                        Subscriptions renew automatically each month on the same date. You will be billed in advance for each billing period.
                      </p>
                    </Card>
                    
                    <Card className="p-6 border border-green-200">
                      <div className="text-center mb-4">
                        <Calendar className="w-12 h-12 text-green-600 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-3">Free Trial</h3>
                      <p className="text-gray-600 text-sm text-center">
                        New users may receive a 14-day free trial. After trial ends, subscription automatically converts to paid plan.
                      </p>
                    </Card>
                    
                    <Card className="p-6 border border-purple-200">
                      <div className="text-center mb-4">
                        <Power className="w-12 h-12 text-purple-600 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-3">Plan Changes</h3>
                      <p className="text-gray-600 text-sm text-center">
                        You can upgrade or downgrade your plan at any time. Changes take effect at the start of the next billing cycle.
                      </p>
                    </Card>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      Cancellation Policy
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        You may cancel your subscription at any time through your account settings. Upon cancellation:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Your subscription remains active until the end of the current billing period</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                          <span>No refunds are provided for partial billing periods</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                          <span>All tool access codes will be deactivated at the end of the billing period</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Subscription Tiers</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 font-semibold text-gray-900">Feature</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Starter</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Professional</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Business</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Monthly Price</td>
                            <td className="py-3 text-gray-600">$29.99</td>
                            <td className="py-3 text-gray-600">$79.99</td>
                            <td className="py-3 text-gray-600">$199.99</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Tool Limit</td>
                            <td className="py-3 text-gray-600">5 active tools</td>
                            <td className="py-3 text-gray-600">20 active tools</td>
                            <td className="py-3 text-gray-600">Unlimited</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Support</td>
                            <td className="py-3 text-gray-600">Basic</td>
                            <td className="py-3 text-gray-600">Priority</td>
                            <td className="py-3 text-gray-600">24/7 Premium</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Team Members</td>
                            <td className="py-3 text-gray-600">1</td>
                            <td className="py-3 text-gray-600">5</td>
                            <td className="py-3 text-gray-600">Unlimited</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 5 - Tools */}
            <section id="tools" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">5</span>
                  Tool Usage & Access
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Access Codes</h3>
                    <p className="text-gray-600 mb-4">
                      Mywoki provides unique access codes for each tool you activate. These codes grant you access to third-party tools through our platform.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Single Use</h4>
                        <p className="text-sm text-gray-600 mt-1">One code per user per tool</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Non-Transferable</h4>
                        <p className="text-sm text-gray-600 mt-1">Codes cannot be shared or sold</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Expiration</h4>
                        <p className="text-sm text-gray-600 mt-1">Valid while subscription is active</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Tool Availability</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        We do not guarantee uninterrupted access to any specific tool. Third-party tools may:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Experience downtime or service interruptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Change their API or integration methods</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Be removed from the marketplace at any time</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Usage Limits</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 font-semibold text-gray-900">Resource</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Starter</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Professional</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Business</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-3 font-medium text-gray-900">API Calls</td>
                            <td className="py-3 text-gray-600">10,000/month</td>
                            <td className="py-3 text-gray-600">100,000/month</td>
                            <td className="py-3 text-gray-600">Unlimited</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Data Storage</td>
                            <td className="py-3 text-gray-600">1GB</td>
                            <td className="py-3 text-gray-600">10GB</td>
                            <td className="py-3 text-gray-600">100GB</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Concurrent Tasks</td>
                            <td className="py-3 text-gray-600">5</td>
                            <td className="py-3 text-gray-600">20</td>
                            <td className="py-3 text-gray-600">100</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Support Response</td>
                            <td className="py-3 text-gray-600">48 hours</td>
                            <td className="py-3 text-gray-600">12 hours</td>
                            <td className="py-3 text-gray-600">1 hour</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 6 - Payments */}
            <section id="payments" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">6</span>
                  Payment Terms
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-green-200 bg-green-50">
                      <h3 className="font-semibold text-gray-900 mb-3">Accepted Payment Methods</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-900 font-semibold">Credit Cards</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-900 font-semibold">Debit Cards</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-900 font-semibold">PayPal</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-900 font-semibold">Cryptocurrency</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 border border-blue-200 bg-blue-50">
                      <h3 className="font-semibold text-gray-900 mb-3">Billing Information</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>Monthly recurring billing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>Auto-renewal enabled by default</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Receipts sent via email</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>7-day notice for price changes</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      Refund Policy
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        All payments are non-refundable except as required by law. We do not provide refunds for:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Partial billing periods</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Unused tool time</span>
                          </li>
                        </ul>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Service dissatisfaction</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Tool unavailability</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-red-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Failed Payments</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        If a payment fails, we will:
                      </p>
                      <ol className="space-y-2 text-gray-600 list-decimal pl-5">
                        <li>Notify you immediately via email</li>
                        <li>Retry the payment up to 3 times over 7 days</li>
                        <li>Suspend service access after 3 failed attempts</li>
                        <li>Require manual payment to restore service</li>
                      </ol>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Note:</strong> Service suspension does not cancel your subscription. You must cancel manually to stop future billing attempts.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 7 - User Obligations */}
            <section id="user-obligations" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">7</span>
                  User Obligations
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Compliance Requirements</h3>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Comply with all applicable laws and regulations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Use tools only for legitimate business purposes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Respect intellectual property rights</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Maintain accurate account information</span>
                        </li>
                      </ul>
                    </Card>
                    
                    <Card className="p-6 border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Security Responsibilities</h3>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-2">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <span>Keep login credentials confidential</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <span>Use strong, unique passwords</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <span>Enable two-factor authentication</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <span>Report security incidents immediately</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Data Protection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Data Privacy</h4>
                        <p className="text-sm text-gray-600 mt-1">Comply with privacy laws when processing data</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">User Consent</h4>
                        <p className="text-sm text-gray-600 mt-1">Obtain consent for data collection where required</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <Database className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Data Retention</h4>
                        <p className="text-sm text-gray-600 mt-1">Delete data when no longer needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 - Prohibited Activities */}
            <section id="prohibited" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">8</span>
                  Prohibited Activities
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Strictly Prohibited</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Illegal Activities</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Fraud or deception</li>
                          <li>• Money laundering</li>
                          <li>• Terrorism financing</li>
                          <li>• Illegal file sharing</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Security Violations</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Hacking or cracking</li>
                          <li>• DDoS attacks</li>
                          <li>• Password cracking</li>
                          <li>• Exploit development</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Abusive Content</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Hate speech</li>
                          <li>• Harassment</li>
                          <li>• Child exploitation</li>
                          <li>• Violent content</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Service Abuse</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Spamming</li>
                          <li>• Scraping</li>
                          <li>• Resource overuse</li>
                          <li>• API abuse</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Consequences of Violation</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Violation of these prohibitions may result in:
                      </p>
                      <ol className="space-y-2 text-gray-600 list-decimal pl-5">
                        <li>Immediate suspension of your account</li>
                        <li>Termination of your subscription without refund</li>
                        <li>Legal action and reporting to authorities</li>
                        <li>Permanent ban from Mywoki services</li>
                      </ol>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Note:</strong> We reserve the right to investigate any suspected violations and take appropriate action at our sole discretion.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 9 - Intellectual Property */}
            <section id="intellectual" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">9</span>
                  Intellectual Property
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-purple-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Our Property</h3>
                      <p className="text-gray-600 mb-3">
                        Mywoki owns all intellectual property rights in:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>The Mywoki Marketplace platform</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Our branding, logos, and designs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Proprietary software and code</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Documentation and training materials</span>
                        </li>
                      </ul>
                    </Card>
                    
                    <Card className="p-6 border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Your Content</h3>
                      <p className="text-gray-600 mb-3">
                        You retain ownership of:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Data you input into tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Content you create using tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Your business processes and workflows</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Your proprietary information</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">License Grants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">We Grant You:</h4>
                        <p className="text-sm text-gray-600">
                          A limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business purposes during your subscription term.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">You Grant Us:</h4>
                        <p className="text-sm text-gray-600">
                          A worldwide, royalty-free license to use, store, and process your data as necessary to provide the Service and improve our platform.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Restrictions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">You May Not:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Reverse engineer our software</li>
                          <li>• Copy or resell our platform</li>
                          <li>• Remove copyright notices</li>
                          <li>• Create derivative works</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Third-Party Tools:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Subject to their own licenses</li>
                          <li>• IP owned by respective vendors</li>
                          <li>• Separate terms may apply</li>
                          <li>• Contact vendors for licensing</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 10 - Third-Party Tools */}
            <section id="third-party" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">10</span>
                  Third-Party Tools
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Disclaimer of Responsibility</h3>
                    <p className="text-gray-600 mb-4">
                      Mywoki acts as a marketplace for third-party tools. We are not responsible for:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <span>Tool performance or reliability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <span>Data loss or corruption</span>
                        </li>
                      </ul>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <span>Security breaches in third-party tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <span>Compliance with laws by tool vendors</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Your Responsibilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                        <p className="text-sm text-gray-600">Review third-party terms</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                        <p className="text-sm text-gray-600">Ensure data compliance</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                        <p className="text-sm text-gray-600">Contact vendors for support</p>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Integration Disclaimer</h3>
                    <p className="text-gray-600">
                      While we vet third-party tools, we cannot guarantee their compatibility, security, or compliance with your specific requirements. You are responsible for:
                    </p>
                    <ul className="mt-3 space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Testing tools before production use</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Ensuring tools meet your compliance needs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Backing up your data regularly</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 11 - Termination */}
            <section id="termination" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">11</span>
                  Termination
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-3">You May Terminate</h3>
                      <div className="space-y-3">
                        <p className="text-gray-600 text-sm">
                          Cancel your subscription at any time through your account settings.
                        </p>
                        <div className="p-3 bg-white rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Effective Immediately:</h4>
                          <p className="text-xs text-gray-600">Cancellation processed instantly</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Service Until End:</h4>
                          <p className="text-xs text-gray-600">Access continues until billing period ends</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 border border-red-200">
                      <h3 className="font-semibold text-gray-900 mb-3">We May Terminate</h3>
                      <div className="space-y-3">
                        <p className="text-gray-600 text-sm">
                          We may suspend or terminate your access immediately if:
                        </p>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>You violate these Terms</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Payment failure for 30+ days</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <span>Legal requirements demand it</span>
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Effects of Termination</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="text-center">
      <div className="text-2xl font-bold text-yellow-600 mb-2">LOCK</div>
      <h4 className="font-medium text-gray-900">Access Revoked</h4>
      <p className="text-sm text-gray-600">Immediate loss of platform access</p>
    </div>
                      
    <div className="text-center">
      <div className="text-2xl font-bold text-yellow-600 mb-2">DATA</div>
      <h4 className="font-medium text-gray-900">Data Retention</h4>
      <p className="text-sm text-gray-600">Data kept for legal requirements</p>
    </div>
                      
    <div className="text-center">
      <div className="text-2xl font-bold text-yellow-600 mb-2">EXPORT</div>
      <h4 className="font-medium text-gray-900">Data Export</h4>
      <p className="text-sm text-gray-600">30 days to export your data</p>
    </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Post-Termination</h3>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        After termination, the following sections survive:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Badge variant="outline" className="justify-center">Intellectual Property</Badge>
                        <Badge variant="outline" className="justify-center">Disclaimer</Badge>
                        <Badge variant="outline" className="justify-center">Liability</Badge>
                        <Badge variant="outline" className="justify-center">Indemnification</Badge>
                        <Badge variant="outline" className="justify-center">Governing Law</Badge>
                        <Badge variant="outline" className="justify-center">Dispute Resolution</Badge>
                        <Badge variant="outline" className="justify-center">General Provisions</Badge>
                        <Badge variant="outline" className="justify-center">Contact</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 12 - Disclaimers */}
            <section id="disclaimers" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">12</span>
                  Disclaimers
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Service "As Is"</h3>
                    <p className="text-gray-600 mb-4">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">No Warranties:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Merchantability</li>
                          <li>• Fitness for particular purpose</li>
                          <li>• Non-infringement</li>
                          <li>• Accuracy or reliability</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">No Guarantees:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Uninterrupted service</li>
                          <li>• Error-free operation</li>
                          <li>• Security of data</li>
                          <li>• Tool availability</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Third-Party Disclaimer</h3>
                    <p className="text-gray-600 mb-3">
                      We do not warrant, endorse, guarantee, or assume responsibility for any third-party tool, service, or content available through our platform.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-semibold">Use at your own risk</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-semibold">Due diligence required</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-semibold">Read third-party terms</p>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Jurisdiction-Specific Disclaimers</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">California Residents:</h4>
                        <p className="text-sm text-gray-600">
                          Under California Civil Code Section 1789.3, California users are entitled to know that they may file grievances and complaints with the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">EEA Residents:</h4>
                        <p className="text-sm text-gray-600">
                          Nothing in these Terms affects your statutory rights as a consumer under EU law. Some jurisdictions do not allow the exclusion of certain warranties, so the above exclusions may not apply to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 13 - Liability */}
            <section id="liability" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">13</span>
                  Liability Limitations
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                    <p className="text-gray-600 mb-4">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, MYWOKI SHALL NOT BE LIABLE FOR:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Direct Damages:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Lost profits</li>
                          <li>• Lost revenue</li>
                          <li>• Lost savings</li>
                          <li>• Lost business</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Indirect Damages:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Consequential damages</li>
                          <li>• Incidental damages</li>
                          <li>• Punitive damages</li>
                          <li>• Special damages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Liability Cap</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">$100</div>
                        <p className="text-gray-600">OR</p>
                        <div className="text-4xl font-bold text-blue-600 mt-2">Amount Paid in Last 12 Months</div>
                        <p className="text-sm text-gray-600 mt-3">
                          Whichever is greater. This is our maximum aggregate liability to you for all claims.
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-1">Exceptions:</h4>
                        <p className="text-sm text-gray-600">
                          This limitation does not apply to: (a) death or personal injury caused by negligence; (b) fraud or fraudulent misrepresentation; (c) any liability that cannot be limited by law.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Force Majeure</h3>
                    <p className="text-gray-600">
                      We are not liable for any failure or delay in performance due to causes beyond our reasonable control, including:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <Badge variant="outline" className="justify-center">Acts of God</Badge>
                      <Badge variant="outline" className="justify-center">War</Badge>
                      <Badge variant="outline" className="justify-center">Terrorism</Badge>
                      <Badge variant="outline" className="justify-center">Earthquakes</Badge>
                      <Badge variant="outline" className="justify-center">Floods</Badge>
                      <Badge variant="outline" className="justify-center">Fires</Badge>
                      <Badge variant="outline" className="justify-center">Strikes</Badge>
                      <Badge variant="outline" className="justify-center">Internet Outages</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 14 - Indemnification */}
            <section id="indemnification" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">14</span>
                  Indemnification
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Your Indemnification Obligation</h3>
                    <p className="text-gray-600 mb-4">
                      You agree to indemnify, defend, and hold harmless Mywoki and its affiliates from any claims, damages, losses, or expenses arising from:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Your Actions:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Violation of these Terms</li>
                          <li>• Use of the Service</li>
                          <li>• Your content or data</li>
                          <li>• Your conduct</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Third-Party Claims:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Infringement claims</li>
                          <li>• Privacy violations</li>
                          <li>• Data breaches</li>
                          <li>• Regulatory violations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Indemnification Process</h3>
                    <div className="space-y-3">
                      <ol className="space-y-2 text-gray-600 list-decimal pl-5">
                        <li>We notify you of any claim</li>
                        <li>You assume control of the defense</li>
                        <li>We cooperate in the defense</li>
                        <li>No settlements without our consent</li>
                      </ol>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Important:</strong> This indemnification obligation survives termination of these Terms and your use of the Service.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 15 - Dispute Resolution */}
            <section id="disputes" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">15</span>
                  Dispute Resolution
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border border-green-200">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-green-600">1</div>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-3">Informal Resolution</h3>
                      <p className="text-gray-600 text-sm text-center">
                        Contact us first at legal@mywoki.com. We aim to resolve disputes within 60 days.
                      </p>
                    </Card>
                    
                    <Card className="p-6 border border-yellow-200">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-yellow-600">2</div>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-3">Mediation</h3>
                      <p className="text-gray-600 text-sm text-center">
                        If unresolved, parties agree to mediate through AAA before litigation.
                      </p>
                    </Card>
                    
                    <Card className="p-6 border border-red-200">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-red-600">3</div>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center mb-3">Binding Arbitration</h3>
                      <p className="text-gray-600 text-sm text-center">
                        If mediation fails, disputes resolved by binding arbitration per AAA rules.
                      </p>
                    </Card>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Arbitration Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Rules:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• American Arbitration Association</li>
                          <li>• Commercial Arbitration Rules</li>
                          <li>• Expedited Procedures</li>
                          <li>• One arbitrator</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Location:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• San Francisco, California</li>
                          <li>• English language</li>
                          <li>• Virtual hearings available</li>
                          <li>• Confidential proceedings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Class Action Waiver</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        YOU AGREE TO RESOLVE DISPUTES ON AN INDIVIDUAL BASIS. YOU WAIVE ANY RIGHT TO PARTICIPATE IN CLASS ACTIONS, CLASS ARBITRATIONS, OR REPRESENTATIVE ACTIONS.
                      </p>
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> This waiver may not be enforceable in some jurisdictions. If found unenforceable, the class action portion will be severed.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 16 - Governing Law */}
            <section id="governing" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">16</span>
                  Governing Law
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Primary Jurisdiction</h3>
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-600 mb-2">US</div>
      <h4 className="font-semibold text-gray-900">California, USA</h4>
      <p className="text-sm text-gray-600 mt-2">
        These Terms are governed by California law without regard to conflict of law principles.
      </p>
    </div>
                    </Card>
                    
                    <Card className="p-6 border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-3">EU Residents</h3>
    <div className="text-center">
      <div className="text-4xl font-bold text-green-600 mb-2">EU</div>
      <h4 className="font-semibold text-gray-900">Consumer Protection</h4>
      <p className="text-sm text-gray-600 mt-2">
        EEA consumers retain mandatory consumer protections of their country of residence.
      </p>
    </div>
                    </Card>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Venue</h3>
                    <p className="text-gray-600 mb-4">
                      Any legal action or proceeding arising under these Terms will be brought exclusively in:
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Gavel className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">State or Federal Courts</h4>
                          <p className="text-sm text-gray-600">Located in San Francisco County, California</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 17 - Changes */}
            <section id="changes" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">17</span>
                  Changes to These Terms
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Right to Modify</h3>
                      <p className="text-gray-600">
                        We reserve the right to modify these Terms at any time. Changes will be effective upon posting.
                      </p>
                    </Card>
                    
                    <Card className="p-6 border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Notification</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-600" />
                          <span>Email to registered users</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-green-600" />
                          <span>In-platform notification</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span>Updated date on this page</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Your Continued Use</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Your continued use of the Service after changes constitutes acceptance of the new Terms. If you disagree with changes:
                      </p>
                      <ol className="space-y-2 text-gray-600 list-decimal pl-5">
                        <li>Stop using the Service immediately</li>
                        <li>Cancel your subscription</li>
                        <li>Contact us to delete your account</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 18 - Contact */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">18</span>
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Legal Notices</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">Email: legal@mywoki.com</p>
                        <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
                        <p className="text-gray-600">Hours: 9 AM - 5 PM PST, Mon-Fri</p>
                      </div>
                    </Card>
                    
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Mailing Address</h3>
                      <div className="space-y-1">
                        <p className="text-gray-600">Mywoki Marketplace, Inc.</p>
                        <p className="text-gray-600">Legal Department</p>
                        <p className="text-gray-600">123 Tech Street</p>
                        <p className="text-gray-600">San Francisco, CA 94107</p>
                        <p className="text-gray-600">United States</p>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">EU Representative</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">Mywoki EU Representative</p>
                      <p className="text-gray-600">Data Protection Office Europe</p>
                      <p className="text-gray-600">Dublin, Ireland</p>
                      <p className="text-gray-600">Email: eu-legal@mywoki.com</p>
                    </div>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Notice Requirements</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Legal notices to us must be in writing and sent via certified mail to our mailing address. Notices are effective upon receipt.
                      </p>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Electronic Notice:</strong> By using the Service, you consent to receive electronic communications from us, including notices about your account and changes to these Terms.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gavel className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Binding Legal Agreement</h3>
              </div>
              <p className="text-gray-600 mb-6">
                These Terms of Service were last updated on {lastUpdated}. By using Mywoki Marketplace, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Privacy Policy</Button>
                </a>
                <a href="/acceptable-use" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Acceptable Use</Button>
                </a>
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                  Back to Home
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} Mywoki Marketplace, Inc. All rights reserved.
                  These Terms of Service are a legal document. If you have questions, consult with a legal professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}