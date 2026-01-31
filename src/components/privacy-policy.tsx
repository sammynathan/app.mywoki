// pages/privacy-policy.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Lock, Eye, Database,
  Users, Globe, Mail,
  ChevronRight, ExternalLink, CheckCircle,
  FileText, Bell, CreditCard, Server
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function PrivacyPolicy() {
  const [lastUpdated] = useState('January 19, 2026')

  const sections = [
    { id: 'overview', title: '1. Overview & Scope' },
    { id: 'definitions', title: '2. Key Definitions' },
    { id: 'data-collection', title: '3. Data We Collect' },
    { id: 'usage-data', title: '4. How We Use Your Data' },
    { id: 'legal-basis', title: '5. Legal Basis for Processing' },
    { id: 'data-sharing', title: '6. Data Sharing & Disclosure' },
    { id: 'data-retention', title: '7. Data Retention' },
    { id: 'data-security', title: '8. Data Security' },
    { id: 'your-rights', title: '9. Your Rights & Choices' },
    { id: 'international', title: '10. International Data Transfers' },
    { id: 'children', title: '11. Children\'s Privacy' },
    { id: 'changes', title: '12. Changes to Policy' },
    { id: 'contact', title: '13. Contact Information' }
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
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <span>Terms of Service</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <span>Cookie Policy</span>
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
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Our Commitment to Your Privacy
                  </h2>
                  <p className="text-gray-600">
                    At Mywoki Marketplace, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section id="overview" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">1</span>
                  Overview & Scope
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    This Privacy Policy applies to all services offered by Mywoki Marketplace ("we," "us," or "our"), including:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Subscription Services</h4>
                        <p className="text-sm text-gray-600 mt-1">Monthly access to our marketplace tools</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Server className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Tool Integrations</h4>
                        <p className="text-sm text-gray-600 mt-1">Third-party software and automations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">User Accounts</h4>
                        <p className="text-sm text-gray-600 mt-1">Profile management and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Bell className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Communication</h4>
                        <p className="text-sm text-gray-600 mt-1">Emails, notifications, and support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="definitions" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">2</span>
                  Key Definitions
                </h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Personal Data</h4>
                    <p className="text-gray-600 mt-1">
                      Any information relating to an identified or identifiable natural person. This includes names, email addresses, IP addresses, and usage data.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Processing</h4>
                    <p className="text-gray-600 mt-1">
                      Any operation performed on personal data, including collection, storage, use, disclosure, or erasure.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Data Controller</h4>
                    <p className="text-gray-600 mt-1">
                      Mywoki Marketplace determines the purposes and means of processing personal data.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Data Processor</h4>
                    <p className="text-gray-600 mt-1">
                      Third parties who process personal data on our behalf (e.g., payment processors, analytics providers).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - Data Collection */}
            <section id="data-collection" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">3</span>
                  Data We Collect
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-600" />
                      Information You Provide
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Account Information</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Name and email address</li>
                          <li>• Password (encrypted)</li>
                          <li>• Profile picture</li>
                          <li>• Contact preferences</li>
                        </ul>
                      </Card>
                      
                      <Card className="p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Payment Information</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Billing address</li>
                          <li>• Payment method details (processed by Stripe)</li>
                          <li>• Subscription history</li>
                          <li>• Invoice records</li>
                        </ul>
                      </Card>
                      
                      <Card className="p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Tool Usage Data</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Activated tools</li>
                          <li>• Access codes generated</li>
                          <li>• Usage frequency</li>
                          <li>• Tool preferences</li>
                        </ul>
                      </Card>
                      
                      <Card className="p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Communication Data</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Support tickets</li>
                          <li>• Chat transcripts</li>
                          <li>• Email correspondence</li>
                          <li>• Feedback and surveys</li>
                        </ul>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-green-600" />
                      Automatically Collected Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Technical Data</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• IP address and location</li>
                          <li>• Browser type and version</li>
                          <li>• Device information</li>
                          <li>• Operating system</li>
                        </ul>
                      </Card>
                      
                      <Card className="p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Usage Data</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Pages visited</li>
                          <li>• Time spent on site</li>
                          <li>• Clickstream data</li>
                          <li>• Feature usage patterns</li>
                        </ul>
                      </Card>
                      
                      <Card className="p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Cookies & Tracking</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Session cookies</li>
                          <li>• Authentication tokens</li>
                          <li>• Analytics cookies</li>
                          <li>• Preference cookies</li>
                        </ul>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 - Usage */}
            <section id="usage-data" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">4</span>
                  How We Use Your Data
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Service Provision</h3>
                      </div>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Process subscriptions and payments</li>
                        <li>• Provide access to marketplace tools</li>
                        <li>• Generate and manage access codes</li>
                        <li>• Maintain user accounts</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Communication</h3>
                      </div>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Send important service updates</li>
                        <li>• Provide customer support</li>
                        <li>• Share promotional offers</li>
                        <li>• Collect feedback and reviews</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Analytics & Improvement</h3>
                      </div>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Analyze usage patterns</li>
                        <li>• Improve platform performance</li>
                        <li>• Develop new features</li>
                        <li>• Conduct market research</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Shield className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Security & Compliance</h3>
                      </div>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Detect and prevent fraud</li>
                        <li>• Comply with legal obligations</li>
                        <li>• Enforce our terms of service</li>
                        <li>• Protect user accounts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 - Legal Basis */}
            <section id="legal-basis" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">5</span>
                  Legal Basis for Processing (GDPR)
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    For users in the European Economic Area (EEA), we process your personal data under the following legal bases:
                  </p>
                  
                  <Card className="p-6 border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 font-semibold text-gray-900">Legal Basis</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Purpose</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Examples</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Contractual Necessity</td>
                            <td className="py-3 text-gray-600">To fulfill our service agreement</td>
                            <td className="py-3 text-gray-600">Processing payments, providing tools</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Legitimate Interests</td>
                            <td className="py-3 text-gray-600">To improve our services</td>
                            <td className="py-3 text-gray-600">Analytics, marketing, fraud prevention</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Legal Obligation</td>
                            <td className="py-3 text-gray-600">To comply with laws</td>
                            <td className="py-3 text-gray-600">Tax reporting, legal requests</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Consent</td>
                            <td className="py-3 text-gray-600">With your explicit permission</td>
                            <td className="py-3 text-gray-600">Marketing emails, cookies</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 6 - Data Sharing */}
            <section id="data-sharing" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">6</span>
                  Data Sharing & Disclosure
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Service Providers</h3>
                    <p className="text-gray-600 mb-4">
                      We share data with third-party service providers who assist in operating our platform:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Payment Processors</h4>
                        <p className="text-sm text-gray-600 mt-1">Stripe, PayPal for subscription handling</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Cloud Infrastructure</h4>
                        <p className="text-sm text-gray-600 mt-1">AWS, Supabase for data storage</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Analytics</h4>
                        <p className="text-sm text-gray-600 mt-1">Google Analytics, Mixpanel</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900">Communication</h4>
                        <p className="text-sm text-gray-600 mt-1">SendGrid, Twilio for notifications</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                    <p className="text-gray-600">
                      We may disclose your information if required by law, such as to:
                    </p>
                    <ul className="mt-3 space-y-2 text-gray-600">
                      <li>• Comply with legal processes or government requests</li>
                      <li>• Enforce our Terms of Service</li>
                      <li>• Protect the rights, property, or safety of Mywoki</li>
                      <li>• Prevent fraud or security issues</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Business Transfers</h3>
                    <p className="text-gray-600">
                      In the event of a merger, acquisition, or asset sale, your personal data may be transferred. We will notify you before your data is transferred and becomes subject to a different privacy policy.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 - Data Retention */}
            <section id="data-retention" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">7</span>
                  Data Retention
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy:
                  </p>
                  
                  <Card className="p-6 border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 font-semibold text-gray-900">Data Type</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Retention Period</th>
                            <th className="text-left py-3 font-semibold text-gray-900">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Account Information</td>
                            <td className="py-3 text-gray-600">While active + 7 years</td>
                            <td className="py-3 text-gray-600">Legal compliance, service continuity</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Payment Records</td>
                            <td className="py-3 text-gray-600">7 years after last transaction</td>
                            <td className="py-3 text-gray-600">Tax and financial regulations</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Usage Data</td>
                            <td className="py-3 text-gray-600">3 years</td>
                            <td className="py-3 text-gray-600">Analytics and improvement</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Support Tickets</td>
                            <td className="py-3 text-gray-600">5 years after resolution</td>
                            <td className="py-3 text-gray-600">Customer service history</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium text-gray-900">Marketing Data</td>
                            <td className="py-3 text-gray-600">Until consent withdrawn</td>
                            <td className="py-3 text-gray-600">User preference based</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Data Deletion</h3>
                    <p className="text-gray-600">
                      You can request deletion of your personal data at any time by contacting us. However, we may retain certain information as required by law or for legitimate business purposes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 - Security */}
            <section id="data-security" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-green-600" />
                  <span>8. Data Security</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Encryption</h4>
                      <p className="text-sm text-gray-600 mt-2">All data encrypted in transit and at rest using AES-256</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Access Controls</h4>
                      <p className="text-sm text-gray-600 mt-2">Role-based access, 2FA, and regular audits</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Regular Backups</h4>
                      <p className="text-sm text-gray-600 mt-2">Automated daily backups with 30-day retention</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Security Measures Include:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        SSL/TLS encryption for all connections
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Regular security audits and penetration testing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        DDoS protection and Web Application Firewall
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Employee security training and background checks
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Incident response plan and 24/7 monitoring
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Compliance with SOC 2 Type II standards
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 - Your Rights */}
            <section id="your-rights" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">9</span>
                  Your Rights & Choices
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Access & Portability</h3>
                    <p className="text-gray-600 text-sm">
                      You can request a copy of your personal data in a structured, machine-readable format.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      Request Data Export
                    </Button>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Correction & Update</h3>
                    <p className="text-gray-600 text-sm">
                      Update your account information at any time through your dashboard settings.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      Update Profile
                    </Button>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Deletion & Erasure</h3>
                    <p className="text-gray-600 text-sm">
                      Request deletion of your personal data, subject to legal retention requirements.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      Request Deletion
                    </Button>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Marketing Preferences</h3>
                    <p className="text-gray-600 text-sm">
                      Control marketing communications through your account settings or unsubscribe links.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      Manage Preferences
                    </Button>
                  </Card>
                </div>
                
                <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2">GDPR Rights (EEA Users)</h3>
                  <p className="text-gray-600 mb-4">
                    If you are in the European Economic Area, you have additional rights under GDPR:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Right to Restrict Processing</h4>
                      <p className="text-sm text-gray-600 mt-1">Request temporary restriction of data processing</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Right to Object</h4>
                      <p className="text-sm text-gray-600 mt-1">Object to processing based on legitimate interests</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Right to Withdraw Consent</h4>
                      <p className="text-sm text-gray-600 mt-1">Withdraw previously given consent at any time</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Right to Lodge Complaint</h4>
                      <p className="text-sm text-gray-600 mt-1">File complaint with a supervisory authority</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 10 - International */}
            <section id="international" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-green-600" />
                  <span>10. International Data Transfers</span>
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Your personal data may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country.
                  </p>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Safeguards for International Transfers</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Standard Contractual Clauses (SCCs) approved by the European Commission</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Adequacy decisions for countries with equivalent data protection laws</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Binding Corporate Rules for intra-group transfers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Data processing agreements with all third-party providers</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Primary Data Locations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">US</div>
                        <p className="text-sm text-gray-600">Primary servers</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">EU</div>
                        <p className="text-sm text-gray-600">Backup servers</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">CA</div>
                        <p className="text-sm text-gray-600">Analytics processing</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">SG</div>
                        <p className="text-sm text-gray-600">Asia-Pacific CDN</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 11 - Children */}
            <section id="children" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">11</span>
                  Children's Privacy
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Age Restriction</h3>
                    <p className="text-gray-600">
                      Our services are not intended for children under 16 years of age. We do not knowingly collect personal data from children under 16.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Parental Consent</h3>
                    <p className="text-gray-600 mb-3">
                      If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately. We will take steps to remove that information from our servers.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li>• We require parental consent for users under 16 in some jurisdictions</li>
                      <li>• COPPA (Children's Online Privacy Protection Act) compliance</li>
                      <li>• Age verification measures for age-restricted content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 12 - Changes */}
            <section id="changes" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-green-600">12</span>
                  Changes to This Policy
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 border border-gray-200 text-center">
                      <Bell className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900">Email Notification</h4>
                      <p className="text-sm text-gray-600 mt-1">Send email to registered users</p>
                    </Card>
                    
                    <Card className="p-4 border border-gray-200 text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="font-bold text-green-600">!</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">In-App Notice</h4>
                      <p className="text-sm text-gray-600 mt-1">Display banner notification</p>
                    </Card>
                    
                    <Card className="p-4 border border-gray-200 text-center">
                      <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900">Updated Date</h4>
                      <p className="text-sm text-gray-600 mt-1">Change "Last Updated" date</p>
                    </Card>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Continued Use</h3>
                    <p className="text-gray-600">
                      Your continued use of our services after any changes to this Privacy Policy constitutes your acceptance of the new terms. We encourage you to review this policy periodically.
                    </p>
                  </div>
                  
                  <Card className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Version History</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div>
                          <h4 className="font-medium text-gray-900">Version 2.0</h4>
                          <p className="text-sm text-gray-600">January 19, 2026</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div>
                          <h4 className="font-medium text-gray-900">Version 1.5</h4>
                          <p className="text-sm text-gray-600">October 15, 2025</p>
                        </div>
                        <span className="text-sm text-gray-500">Added GDPR section</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Version 1.0</h4>
                          <p className="text-sm text-gray-600">July 1, 2025</p>
                        </div>
                        <span className="text-sm text-gray-500">Initial release</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 13 - Contact */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-green-600" />
                  <span>13. Contact Information</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Data Protection Officer</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">Email: dpo@mywoki.com</p>
                        <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
                        <p className="text-gray-600">Hours: 9 AM - 5 PM EST, Mon-Fri</p>
                      </div>
                    </Card>
                    
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">General Inquiries</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">Email: privacy@mywoki.com</p>
                        <p className="text-gray-600">Support: support@mywoki.com</p>
                        <p className="text-gray-600">Legal: legal@mywoki.com</p>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Mailing Address</h3>
                    <div className="space-y-1">
                      <p className="text-gray-600">Mywoki Marketplace, Inc.</p>
                      <p className="text-gray-600">Data Protection Office</p>
                      <p className="text-gray-600">123 Tech Street</p>
                      <p className="text-gray-600">San Francisco, CA 94107</p>
                      <p className="text-gray-600">United States</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-2">EU Representative</h3>
                    <p className="text-gray-600 mb-3">
                      For users in the European Economic Area, you may contact our EU representative:
                    </p>
                    <div className="space-y-1">
                      <p className="text-gray-600">Mywoki EU Representative</p>
                      <p className="text-gray-600">Data Protection Office Europe</p>
                      <p className="text-gray-600">Dublin, Ireland</p>
                      <p className="text-gray-600">Email: eu-privacy@mywoki.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Your Privacy Matters</h3>
              </div>
              <p className="text-gray-600 mb-6">
                This Privacy Policy was last updated on {lastUpdated}. By using Mywoki Marketplace, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Terms of Service</Button>
                </a>
                <a href="/cookies" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Cookie Policy</Button>
                </a>
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}