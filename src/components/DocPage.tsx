import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, BookOpen, HelpCircle, Zap,
  CreditCard, Settings, CheckCircle,
  AlertCircle, Calendar, ExternalLink
} from 'lucide-react'
import { Card } from './ui/card'
import NotFound from './NotFound'

export default function DocPage() {
  const { id } = useParams<{ id: string }>()
  const [lastUpdated] = useState('January 19, 2026')

  const docs = {
    'getting-started': {
      title: 'Getting Started Guide',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Learn how to use the platform and activate your first tools',
      content: (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Welcome to Mywoki Marketplace
            </h3>
            <p className="text-sm text-gray-600">
              Mywoki is an all-in-one platform that allows you to activate productivity and automation tools instantly, without setup or technical complexity.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  1. Create Your Account
                </h4>
                <p className="text-sm text-gray-600">
                  Sign up using your email address. We'll send you a one-time code to verify. No passwords needed!
                </p>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  2. Access Your Dashboard
                </h4>
                <p className="text-sm text-gray-600">
                  Once logged in, access your personal dashboard where you can manage all your tools and settings.
                </p>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  3. Explore Tools
                </h4>
                <p className="text-sm text-gray-600">
                  Browse our library of tools on the Tools page. Each tool has a description and activation button.
                </p>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  4. Activate Your First Tool
                </h4>
                <p className="text-sm text-gray-600">
                  Click the activation button on any tool. It's instantly available in your workspace.
                </p>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    'tool-activation': {
      title: 'Tool Activation Guide',
      icon: <Zap className="w-8 h-8" />,
      description: 'How to activate and manage tools in your workspace',
      content: (
        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Tool Activation Process
            </h3>
            <p className="text-sm text-gray-600">
              Activating tools in Mywoki is designed to be simple and instant. Here's how it works.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Activation Steps</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">1. Find Your Tool</h4>
                <p className="text-sm text-gray-600">
                  Navigate to the Tools page and browse our collection. Use filters to find tools by category or search by name.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">2. Review Details</h4>
                <p className="text-sm text-gray-600">
                  Click on any tool to see detailed information, features, and requirements before activating.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">3. Activate Instantly</h4>
                <p className="text-sm text-gray-600">
                  Click the "Activate" button. The tool is immediately available in your dashboard and workspace.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">4. Configure Settings</h4>
                <p className="text-sm text-gray-600">
                  Access tool-specific settings from your dashboard to customize behavior and preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Tool Types
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Standard Tools:</strong> Activate immediately with one click</p>
              <p><strong>Premium Tools:</strong> May require subscription upgrade</p>
              <p><strong>Integration Tools:</strong> May need additional setup or API keys</p>
            </div>
          </div>
        </div>
      )
    },
    'billing-faq': {
      title: 'Billing & Subscription FAQ',
      icon: <CreditCard className="w-8 h-8" />,
      description: 'Common questions about plans, billing, and upgrades',
      content: (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Billing Overview
            </h3>
            <p className="text-sm text-gray-600">
              Understanding your subscription and managing payments.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">How does billing work?</h4>
                <p className="text-sm text-gray-600">
                  We use a subscription-based model. You pay monthly for access to tools based on your plan. Billing occurs on the same day each month.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
                <p className="text-sm text-gray-600">
                  Yes! You can upgrade your plan immediately. Downgrades take effect at the next billing cycle. Changes are prorated.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-sm text-gray-600">
                  We accept all major credit cards, debit cards, and digital payment methods. All payments are processed securely.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-sm text-gray-600">
                  Check our pricing page for current trial offers. Some tools may have trial periods available.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">How do refunds work?</h4>
                <p className="text-sm text-gray-600">
                  We offer a 30-day money-back guarantee. Contact support within 30 days of any charge for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'api-integration': {
      title: 'API Integration Guide',
      icon: <Settings className="w-8 h-8" />,
      description: 'How to integrate external services with our platform',
      content: (
        <div className="space-y-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              API Integration Overview
            </h3>
            <p className="text-sm text-gray-600">
              Connect external services and automate workflows with our comprehensive API.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">REST API</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Full REST API access for programmatic tool management and data retrieval.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• JSON-based requests</li>
                  <li>• OAuth 2.0 authentication</li>
                  <li>• Rate limiting included</li>
                </ul>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Webhooks</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Real-time notifications for tool events and status changes.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Instant event delivery</li>
                  <li>• Configurable endpoints</li>
                  <li>• Retry mechanisms</li>
                </ul>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">SDK Libraries</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Official SDKs for popular programming languages.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• JavaScript/TypeScript</li>
                  <li>• Python</li>
                  <li>• PHP</li>
                </ul>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Zapier Integration</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Connect with 2000+ apps through our Zapier integration.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• No-code automation</li>
                  <li>• Pre-built templates</li>
                  <li>• Real-time sync</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    'best-practices': {
      title: 'Best Practices',
      icon: <CheckCircle className="w-8 h-8" />,
      description: 'Tips and best practices for optimizing your workflow',
      content: (
        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Optimization Tips
            </h3>
            <p className="text-sm text-gray-600">
              Maximize your productivity with these proven best practices.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Workflow Optimization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Tool Selection</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Start with 3-5 core tools</li>
                  <li>• Choose tools that complement each other</li>
                  <li>• Regularly review and deactivate unused tools</li>
                  <li>• Test tools before committing to premium plans</li>
                </ul>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Organization</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Use clear naming conventions</li>
                  <li>• Group related tools by project</li>
                  <li>• Set up automated backups</li>
                  <li>• Document your workflows</li>
                </ul>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Security</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Use strong, unique passwords</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Regularly review access permissions</li>
                  <li>• Keep tools updated</li>
                </ul>
              </Card>

              <Card className="p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Monitor tool usage analytics</li>
                  <li>• Optimize tool configurations</li>
                  <li>• Clean up old data regularly</li>
                  <li>• Use automation to reduce manual tasks</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      )
    }
  }

  const doc = id ? docs[id as keyof typeof docs] : null

  if (!doc) {
    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            {doc.icon}
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
              Documentation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {doc.title}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mb-8">
            {doc.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Documentation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/help" className="hover:text-blue-600">Help</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{doc.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24 p-6 border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
              <div className="mb-6">
                <Link
                  to="/help"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Help Center
                </Link>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Related Documentation
              </h3>
              <nav className="space-y-2">
                {Object.entries(docs).map(([key, docItem]) => (
                  <Link
                    key={key}
                    to={`/doc/${key}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                      key === id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {docItem.title}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Need More Help?</h4>
                <Link
                  to="/help"
                  className="flex items-center justify-between text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Contact Support</span>
                  </div>
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              {doc.content}
            </div>

            {/* Footer */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-700">
                <strong>Last Updated:</strong> {lastUpdated}<br />
                <strong>Document ID:</strong> {id}<br />
                <strong>Help Center:</strong> Comprehensive user assistance and documentation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
