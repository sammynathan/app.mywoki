 // pages/cookie-policy.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Cookie, Shield, Eye, Settings,
  Globe, CheckCircle, ChevronRight,
  ExternalLink, FileText
} from 'lucide-react'
import { Card } from '../components/ui/card'

export default function CookiePolicy() {
  const [lastUpdated] = useState('January 19, 2026')
  const [effectiveDate] = useState('January 19, 2026')

  const sections = [
    { id: 'overview', title: '1. What Are Cookies' },
    { id: 'types', title: '2. Types of Cookies We Use' },
    { id: 'how-we-use', title: '3. How We Use Cookies' },
    { id: 'third-party', title: '4. Third-Party Cookies' },
    { id: 'your-choices', title: '5. Your Cookie Choices' },
    { id: 'managing', title: '6. Managing Cookies' },
    { id: 'do-not-track', title: '7. Do Not Track Signals' },
    { id: 'changes', title: '8. Changes to Cookie Policy' },
    { id: 'contact', title: '9. Contact Information' }
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
            <span className="text-lg font-bold text-gray-900">mywoki</span>
          </Link>
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
                    className="block w-full text-left text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Related Documents</h4>
                <div className="space-y-2">
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <span>Privacy Policy</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <span>Terms of Service</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:w-3/4 space-y-12">
            {/* Introduction */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Cookie className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Our Cookie Commitment
                  </h2>
                  <p className="text-gray-600">
                    Cookies help us provide you with a better experience on Mywoki Marketplace. This policy explains how we use cookies and your choices regarding them.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section id="overview" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">1</span>
                  What Are Cookies
                </h2>

                <div className="space-y-4 text-gray-700">
                  <p>
                    Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences and improve your browsing experience.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Cookie className="w-5 h-5 text-orange-600" />
                        How Cookies Work
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Stored on your browser</li>
                        <li>• Sent back to our servers</li>
                        <li>• Help personalize your experience</li>
                        <li>• Enable website functionality</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-orange-600" />
                        Cookie Security
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Cannot access your files</li>
                        <li>• Cannot install malware</li>
                        <li>• Encrypted during transmission</li>
                        <li>• Limited to our domain</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="types" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">2</span>
                  Types of Cookies We Use
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-green-200 bg-green-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Required for the website to function properly. Cannot be disabled.
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Authentication and security</li>
                        <li>• Session management</li>
                        <li>• Load balancing</li>
                        <li>• CSRF protection</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-blue-200 bg-blue-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Help us understand how visitors use our website.
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Page views and navigation</li>
                        <li>• User behavior patterns</li>
                        <li>• Performance metrics</li>
                        <li>• Error tracking</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-purple-200 bg-purple-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Settings className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Remember your preferences and settings.
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Language preferences</li>
                        <li>• Theme settings</li>
                        <li>• Form data preservation</li>
                        <li>• Custom dashboard layouts</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-orange-200 bg-orange-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Globe className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Used to deliver relevant advertisements.
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Used to deliver relevant advertisements.</li>
                        <li>• Retargeting and remarketing</li>
                        <li>• Affiliate tracking</li>
                        <li>• Social media integration</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="how-we-use" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-600">3</span>
                  How We Use Cookies
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    We use cookies for various purposes to enhance your experience on Mywoki Marketplace. Here's how different types of cookies serve our users:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Essential Uses
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Secure login and authentication</li>
                        <li>• Shopping cart functionality</li>
                        <li>• Payment processing security</li>
                        <li>• Fraud prevention</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        Analytics Uses
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Website performance monitoring</li>
                        <li>• User journey analysis</li>
                        <li>• Feature usage statistics</li>
                        <li>• Conversion tracking</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        Functional Uses
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Personalized user interface</li>
                        <li>• Saved search preferences</li>
                        <li>• Location-based services</li>
                        <li>• Accessibility settings</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-orange-600" />
                        Marketing Uses
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Targeted advertising</li>
                        <li>• Cross-device tracking</li>
                        <li>• Campaign effectiveness</li>
                        <li>• Partner integrations</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="third-party" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-600">4</span>
                  Third-Party Cookies
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    Some cookies are set by third-party services that appear on our pages. We have limited control over these cookies, but we work with reputable partners.
                  </p>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-orange-600" />
                      Third-Party Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Google Analytics</li>
                          <li>• Mixpanel</li>
                          <li>• Hotjar</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Marketing</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Google Ads</li>
                          <li>• Facebook Pixel</li>
                          <li>• LinkedIn Insight</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    These third parties have their own privacy policies and cookie policies. We recommend reviewing their documentation for more information about their practices.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="your-choices" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-600">5</span>
                  Your Cookie Choices
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    You have several options for managing cookies. Essential cookies cannot be disabled as they are necessary for the website to function.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-green-200 bg-green-50">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Cookie Settings
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Manage your cookie preferences through our settings panel.
                      </p>
                      <a href="/cookie-settings" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Open Cookie Settings {'>'}
                      </a>
                    </Card>

                    <Card className="p-6 border border-blue-200 bg-blue-50">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        Browser Controls
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Most browsers allow you to control cookies through settings.
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Block all cookies</li>
                        <li>• Block third-party cookies</li>
                        <li>• Clear existing cookies</li>
                      </ul>
                    </Card>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Opt-Out Options</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      You can opt out of interest-based advertising from participating companies through these industry programs:
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 text-sm underline">Digital Advertising Alliance</a>
                      <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 text-sm underline">Network Advertising Initiative</a>
                      <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 text-sm underline">Your Online Choices</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="managing" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-600">6</span>
                  Managing Cookies
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    Here's how you can manage cookies in different browsers. Note that disabling cookies may affect website functionality.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Chrome</h3>
                      <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>Click the three dots menu</li>
                        <li>Go to Settings {'>'}                         Privacy and security</li>
                        <li>Click Cookies and other site data</li>
                        <li>Choose your preferences</li>
                      </ol>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Firefox</h3>
                      <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>Click the menu button</li>
                        <li>Choose Preferences</li>
                        <li>Select Privacy & Security</li>
                        <li>Choose Cookies and Site Data</li>
                      </ol>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Safari</h3>
                      <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>Go to Safari {'>'}                         Preferences</li>
                        <li>Click Privacy</li>
                        <li>Choose your cookie policy</li>
                        <li>Manage website data</li>
                      </ol>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Edge</h3>
                      <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>Click the three dots menu</li>
                        <li>Go to Settings {'>'}                         Cookies and site permissions</li>
                        <li>Choose your preferences</li>
                        <li>Manage exceptions</li>
                      </ol>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="do-not-track" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-600">7</span>
                  Do Not Track Signals
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    Some browsers include a "Do Not Track" (DNT) feature that signals your preference regarding tracking. We respond to DNT signals as follows:
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      Our DNT Response
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• We honor DNT signals for analytics and marketing cookies</li>
                      <li>• Essential cookies remain active for functionality</li>
                      <li>• Third-party services may not recognize DNT signals</li>
                      <li>• DNT does not affect data collected for legal compliance</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    Note that not all browsers support DNT signals, and some third-party services may not respond to them. DNT is not a legal requirement.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="changes" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-600">8</span>
                  Changes to Cookie Policy
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">When We Update</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Changes in cookie usage or technology</li>
                      <li>• Legal or regulatory requirements</li>
                      <li>• New features or services</li>
                      <li>• Privacy policy updates</li>
                    </ul>
                  </div>

                  <p>
                    When we make material changes, we'll notify you through:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 ml-6">
                    <li>• Email notifications (if applicable)</li>
                    <li>• Website announcements</li>
                    <li>• Updated effective date</li>
                    <li>• Prominent policy notices</li>
                  </ul>

                  <p className="text-sm text-gray-600">
                    Your continued use of our services after changes take effect constitutes acceptance of the updated policy.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-orange-600">9</span>
                  Contact Information
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    If you have questions about this Cookie Policy or our cookie practices, please contact us:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-orange-600" />
                        Privacy Team
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Email: privacy@mywoki.com</p>
                        <p>Response time: Within 30 days</p>
                        <p>Available: Monday - Friday, 9 AM - 5 PM EST</p>
                      </div>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-orange-600" />
                        Additional Resources
                      </h3>
                      <div className="space-y-2 text-sm">
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 block">
                          Privacy Policy {'>'}
                        </a>
                        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 block">
                          Terms of Service {'>'}
                        </a>
                        <a href="/cookie-settings" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 block">
                          Cookie Settings {'>'}
                        </a>
                      </div>
                    </Card>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <p className="text-sm text-gray-700">
                      <strong>Last Updated:</strong> {lastUpdated}<br />
                      <strong>Effective Date:</strong> {effectiveDate}<br />
                      <strong>Version:</strong> 1.0
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
