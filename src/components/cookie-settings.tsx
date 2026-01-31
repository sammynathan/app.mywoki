import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Cookie, Shield, Eye, Settings,
  CheckCircle, Save, RotateCcw
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Switch } from '../components/ui/switch'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

export default function CookieSettings() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    functional: false,
    marketing: false
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('cookiePreferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPreferences({ ...parsed, essential: true }) // Essential always true
      } catch (e) {
        console.error('Error parsing cookie preferences:', e)
      }
    }
  }, [])

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'essential') return // Essential cannot be changed

    setPreferences(prev => ({ ...prev, [type]: value }))
    setHasChanges(true)
  }

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setHasChanges(false)
    // Here you would typically trigger cookie management logic
    alert('Cookie preferences saved successfully!')
  }

  const resetToDefaults = () => {
    const defaults = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false
    }
    setPreferences(defaults)
    setHasChanges(true)
  }

  const cookieTypes = [
    {
      key: 'essential' as keyof CookiePreferences,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. Cannot be disabled.',
      icon: Shield,
      required: true
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website to improve performance.',
      icon: Eye,
      required: false
    },
    {
      key: 'functional' as keyof CookiePreferences,
      title: 'Functional Cookies',
      description: 'Remember your preferences and settings for a better experience.',
      icon: Settings,
      required: false
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
      icon: Cookie,
      required: false
    }
  ]

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cookie className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900">Cookie Settings</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your cookie preferences below. You can enable or disable different types of cookies except for essential ones which are required for the site to function.
            </p>
          </div>

          {/* Cookie Types */}
          <div className="space-y-6">
            {cookieTypes.map((cookieType) => {
              const Icon = cookieType.icon
              return (
                <Card key={cookieType.key} className="p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {cookieType.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {cookieType.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {cookieType.required ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Required</span>
                        </div>
                      ) : (
                        <Switch
                          checked={preferences[cookieType.key]}
                          onCheckedChange={(checked) => handlePreferenceChange(cookieType.key, checked)}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={savePreferences}
                disabled={!hasChanges}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>

              <Button
                onClick={resetToDefaults}
                variant="outline"
                className="border-gray-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>

            {hasChanges && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  You have unsaved changes. Click "Save Preferences" to apply them.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              For more information about cookies and privacy, please visit our:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/privacy">
                <Button variant="outline">Privacy Policy</Button>
              </Link>
              <Link to="/cookies">
                <Button variant="outline">Cookie Policy</Button>
              </Link>
              <Link to="/terms">
                <Button variant="outline">Terms of Service</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
