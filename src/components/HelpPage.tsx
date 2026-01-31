// HelpPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HelpCircle, Search, Zap, Shield, Lock,
  BookOpen, Smartphone, Workflow, ChevronRight, ExternalLink,
  Calendar, CheckCircle, AlertCircle,
  CreditCard, Key, Headphones
} from 'lucide-react'
import { Card } from './ui/card'

export default function HelpPage() {
  const [lastUpdated] = useState('January 19, 2026')
  const [searchQuery, setSearchQuery] = useState('')

  const sections = [
    { id: 'getting-started', title: '1. Getting Started' },
    { id: 'account', title: '2. Account & Auth' },
    { id: 'tools', title: '3. Tools & Features' },
    { id: 'billing', title: '4. Billing & Plans' },
    { id: 'security', title: '5. Security' },
    { id: 'troubleshooting', title: '6. Troubleshooting' },
    { id: 'faq', title: '7. FAQs' }
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredSections = sections.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
              Support & Help
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Help Center
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mb-8">
            Find answers to common questions and get support with Mywoki Marketplace.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Comprehensive Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              <span>Live Support Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24 p-6 border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5" />
                Topics
              </h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Need More Help?</h4>
                <Link
                  to="/support"
                  className="flex items-center justify-between text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    <span>Live Support</span>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                <Link
                  to="/privacy"
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to="/cookies"
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <span>Cookie Policy</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:w-3/4 space-y-12">
            {/* Section 1: Getting Started */}
            <section id="getting-started" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-emerald-600">1</span>
                  Getting Started
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    Welcome to Mywoki Marketplace! Here's what you need to know to get started.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-600" />
                        What is Mywoki?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Mywoki is an all-in-one platform that allows you to activate productivity and automation tools instantly, without setup or technical complexity.
                      </p>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Key className="w-5 h-5 text-emerald-600" />
                        Sign Up
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create an account using your email address. We'll send you a one-time code to verify. No passwords needed!
                      </p>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-emerald-600" />
                        Access Your Dashboard
                      </h3>
                      <p className="text-sm text-gray-600">
                        Once logged in, access your personal dashboard where you can manage all your tools and settings.
                      </p>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                        Explore Tools
                      </h3>
                      <p className="text-sm text-gray-600">
                        Browse our library of tools on the Tools page. Each tool has a description and activation button.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Account & Authentication */}
            <section id="account" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-emerald-600">2</span>
                  Account & Authentication
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-emerald-600" />
                      Passwordless Authentication
                    </h3>
                    <p className="text-sm text-gray-600">
                      We use magic link authentication for security and simplicity. You receive a one-time code via email instead of managing passwords.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Resetting Your Access</h3>
                    <p className="text-sm mb-3">
                      If you can't access your account:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Visit the login page and enter your email</li>
                      <li>• Check your email for the verification code</li>
                      <li>• Enter the code to access your account</li>
                      <li>• If you don't receive an email, check your spam folder</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Code Expiration
                    </h3>
                    <p className="text-sm text-gray-600">
                      Verification codes expire after 15 minutes. If yours expired, request a new one.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Tools & Features */}
            <section id="tools" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-emerald-600">3</span>
                  Tools & Features
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    Our tools are designed to boost your productivity. Here's how to use them effectively.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Activating Tools</h3>
                      <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>Go to the Tools page</li>
                        <li>Find the tool you want</li>
                        <li>Click the activation button</li>
                        <li>Tool is instantly available</li>
                      </ol>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Deactivating Tools</h3>
                      <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>Visit your Dashboard</li>
                        <li>Find the active tool</li>
                        <li>Click deactivate</li>
                        <li>Data remains safe</li>
                      </ol>
                    </Card>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-emerald-600" />
                      Using Tools
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Each tool has dedicated settings accessible from the dashboard</li>
                      <li>• Customize preferences to match your workflow</li>
                      <li>• Monitor tool activity and performance</li>
                      <li>• Export data anytime before deactivating</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Billing & Plans */}
            <section id="billing" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-emerald-600">4</span>
                  Billing & Plans
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    Understanding your subscription and managing payments.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                        Payment Methods
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Debit and credit cards</li>
                        <li>• All major card providers supported</li>
                        <li>• Secure SSL encryption</li>
                        <li>• PCI-DSS compliant</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Subscription Changes</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Upgrade anytime, changes apply immediately</li>
                        <li>• Downgrade effective next billing cycle</li>
                        <li>• Cancel without penalties</li>
                        <li>• Prorated charges and refunds</li>
                      </ul>
                    </Card>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Billing Questions?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Check your billing details in your Account Settings or contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Security */}
            <section id="security" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-emerald-600">5</span>
                  Security
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    Your security and privacy are our top priorities.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Our Security Measures
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• End-to-end encryption for all data</li>
                      <li>• Regular security audits</li>
                      <li>• Two-factor authentication available</li>
                      <li>• GDPR and CCPA compliant</li>
                      <li>• Industry-standard protection protocols</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Protecting Your Account</h3>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Use unique access codes for verification</li>
                      <li>• Don't share your login link</li>
                      <li>• Log out on shared computers</li>
                      <li>• Report suspicious activity immediately</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    For detailed information about how we protect your data, please see our <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Troubleshooting */}
            <section id="troubleshooting" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-emerald-600">6</span>
                  Troubleshooting
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Can't log in?</h3>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Check your email for the verification code</li>
                      <li>• Verify the code hasn't expired (15-minute limit)</li>
                      <li>• Check your spam/junk folder</li>
                      <li>• Request a new code and try again</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tool not activating?</h3>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Refresh your browser</li>
                      <li>• Clear browser cache</li>
                      <li>• Check your internet connection</li>
                      <li>• Try a different browser</li>
                      <li>• Contact support if the issue persists</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payment declined?</h3>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Verify card details are correct</li>
                      <li>• Check card expiration date</li>
                      <li>• Ensure sufficient funds</li>
                      <li>• Contact your bank</li>
                      <li>• Try a different payment method</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Still having issues?</h3>
                    <p className="text-sm text-gray-600">
                      Our support team is here to help! Contact us through live chat or email.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: FAQs */}
            <section id="faq" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-emerald-600">7</span>
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Can I use multiple tools at once?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Yes! You can activate and use as many tools as you like depending on your subscription plan.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        What happens to my data if I deactivate a tool?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Your data is safely stored. You can export it before deactivating and reactivate the tool anytime to access it again.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Is there a free trial?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Check our pricing page for current trial offers. Some tools may have trial periods available.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Can I change my email address?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Yes, update your email in Account Settings. You'll need to verify the new email address.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        How often are new tools added?
                      </h3>
                      <p className="text-sm text-gray-600">
                        We regularly add new tools and features. Check the Tools page or follow our updates for announcements.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        What if I need help with a specific tool?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Contact our support team through live chat or email, and we'll assist you with any tool-specific questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Coming Soon Banner */}
            <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-sm p-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  My AI Agent Coming Soon
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Get ready for your intelligent project companion that learns from your goals, adapts to your needs, and helps you build better products and startups.
                </p>
                <Link
                  to="/dashboard/my-ai-agent"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Learn More
                </Link>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 shadow-sm p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Need personalized assistance?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our support team is available to help you with any questions or issues. Connect with us through live chat or email.
                </p>
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Headphones className="w-5 h-5" />
                  Start Live Support
                </Link>
              </div>
            </section>

            {/* Last Updated */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-700">
                <strong>Last Updated:</strong> {lastUpdated}<br />
                <strong>Help Center Version:</strong> 1.0<br />
                <strong>Support Hours:</strong> Monday - Friday, 9 AM - 5 PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}