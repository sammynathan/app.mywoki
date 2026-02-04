
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { supabase } from "../lib/supabase"
import { 
  Settings,
  Shield,
  Bell,
  Database,
  Zap,
  Save,
  RefreshCw
} from "lucide-react"

const defaultSettings = {
  // General
  siteName: "mywoki",
  siteDescription: "Workspace Management Platform",
  maintenanceMode: false,

  // Notifications
  sendWelcomeEmail: true,
  sendToolActivationEmail: true,
  sendWeeklyDigest: true,

  // Security
  requireEmailVerification: true,
  enableTwoFactor: false,
  sessionTimeout: 24,

  // Performance
  cacheEnabled: true,
  realtimeUpdates: true,
  autoBackup: true,
  backupFrequency: "daily"
}

export default function ManagementSettings() {
  const [settings, setSettings] = useState(defaultSettings)

  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('management_settings')
        .select('*')
        .eq('scope', 'global')
        .maybeSingle()

      if (error) {
        console.error('Error loading management settings:', error)
        return
      }

      if (!data) {
        setSettings(defaultSettings)
        return
      }

      setSettings({
        siteName: data.site_name ?? defaultSettings.siteName,
        siteDescription: data.site_description ?? defaultSettings.siteDescription,
        maintenanceMode: data.maintenance_mode ?? defaultSettings.maintenanceMode,
        sendWelcomeEmail: data.send_welcome_email ?? defaultSettings.sendWelcomeEmail,
        sendToolActivationEmail: data.send_tool_activation_email ?? defaultSettings.sendToolActivationEmail,
        sendWeeklyDigest: data.send_weekly_digest ?? defaultSettings.sendWeeklyDigest,
        requireEmailVerification: data.require_email_verification ?? defaultSettings.requireEmailVerification,
        enableTwoFactor: data.enable_two_factor ?? defaultSettings.enableTwoFactor,
        sessionTimeout: data.session_timeout ?? defaultSettings.sessionTimeout,
        cacheEnabled: data.cache_enabled ?? defaultSettings.cacheEnabled,
        realtimeUpdates: data.realtime_updates ?? defaultSettings.realtimeUpdates,
        autoBackup: data.auto_backup ?? defaultSettings.autoBackup,
        backupFrequency: data.backup_frequency ?? defaultSettings.backupFrequency
      })
    } catch (error) {
      console.error('Error loading management settings:', error)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('management_settings')
        .upsert({
          scope: 'global',
          site_name: settings.siteName,
          site_description: settings.siteDescription,
          maintenance_mode: settings.maintenanceMode,
          send_welcome_email: settings.sendWelcomeEmail,
          send_tool_activation_email: settings.sendToolActivationEmail,
          send_weekly_digest: settings.sendWeeklyDigest,
          require_email_verification: settings.requireEmailVerification,
          enable_two_factor: settings.enableTwoFactor,
          session_timeout: settings.sessionTimeout,
          cache_enabled: settings.cacheEnabled,
          realtime_updates: settings.realtimeUpdates,
          auto_backup: settings.autoBackup,
          backup_frequency: settings.backupFrequency,
          updated_at: new Date().toISOString()
        }, { onConflict: 'scope' })

      if (error) throw error

      window.dispatchEvent(
        new CustomEvent('managementSettingsUpdated', {
          detail: { maintenanceMode: settings.maintenanceMode }
        })
      )
      
      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      })
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to save settings'
      })
    } finally {
      setLoading(false)
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
    }
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        ...defaultSettings
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Management Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure platform settings and preferences
        </p>
      </div>

      {/* Save Status */}
      {saveStatus.type && (
        <Card className={`p-4 border-l-4 ${
          saveStatus.type === 'success' 
            ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-600'
            : 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-600'
        }`}>
          <p className={`text-sm font-medium ${
            saveStatus.type === 'success'
              ? 'text-green-800 dark:text-green-300'
              : 'text-red-800 dark:text-red-300'
          }`}>
            {saveStatus.message}
          </p>
        </Card>
      )}

      {/* General Settings */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              General Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Platform name and basic configuration
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Temporarily disable public access
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notification Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure automated notifications
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'sendWelcomeEmail', label: 'Send Welcome Email', description: 'Send email when new user signs up' },
            { key: 'sendToolActivationEmail', label: 'Send Tool Activation Email', description: 'Notify users when they activate a tool' },
            { key: 'sendWeeklyDigest', label: 'Send Weekly Digest', description: 'Weekly summary email to active users' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, [item.key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Platform security and access controls
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Require Email Verification</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Users must verify email before accessing platform
              </p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable 2FA for admin accounts
              </p>
            </div>
            <Switch
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactor: checked })}
            />
          </div>

          <div>
            <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              min="1"
              max="720"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 24 })}
            />
          </div>
        </div>
      </Card>

      {/* Performance Settings */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimize platform performance
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'cacheEnabled', label: 'Enable Caching', description: 'Cache frequently accessed data' },
            { key: 'realtimeUpdates', label: 'Realtime Updates', description: 'Enable live updates for dashboards' },
            { key: 'autoBackup', label: 'Auto Backup', description: 'Automatically backup database' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, [item.key]: checked })
                }
              />
            </div>
          ))}

          <div>
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <select
              id="backupFrequency"
              value={settings.backupFrequency}
              onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
              className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Database Stats */}
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Database className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Database Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Database statistics and maintenance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Size</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">2.4 GB</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Backup</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">2 hours ago</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Connection Pool</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">18/50</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Database Cleanup
          </Button>
          <Button variant="outline">
            Run Backup Now
          </Button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={resetToDefaults}
          className="text-gray-700 dark:text-gray-300"
        >
          Reset to Defaults
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
          <Button
            onClick={saveSettings}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
