import { useState, useEffect } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Save, 
  Bell, 
  User, 
  Shield, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const { userId, name: authName, email: authEmail, updateProfile } = useAuth()
  
  const [loading, setLoading] = useState({
    profile: false,
    notifications: false,
    danger: false
  })
  
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // Profile state
  const [profile, setProfile] = useState({
    name: authName || '',
    email: authEmail || '',
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    productNews: true,
    securityAlerts: true,
    weeklyDigest: false,
    marketing: false,
  })

  // Danger zone state
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch user data on mount
  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, email, notification_preferences')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        // Update profile
        if (data.name) setProfile(prev => ({ ...prev, name: data.name }))
        if (data.email) setProfile(prev => ({ ...prev, email: data.email }))
        
        // Update notifications
        if (data.notification_preferences) {
          setNotifications(prev => ({
            ...prev,
            ...data.notification_preferences
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!userId) return
    
    setLoading(prev => ({ ...prev, profile: true }))
    
    try {
      const result = await updateProfile(userId, { name: profile.name })
      
      if (result.success) {
        setSaveStatus({
          type: 'success',
          message: 'Profile updated successfully!'
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error: any) {
      setSaveStatus({
        type: 'error',
        message: error.message || 'Failed to update profile'
      })
    } finally {
      setLoading(prev => ({ ...prev, profile: false }))
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
    }
  }

  // Handle notifications update
  const handleNotificationsUpdate = async () => {
    if (!userId) return
    
    setLoading(prev => ({ ...prev, notifications: true }))
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          notification_preferences: notifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      setSaveStatus({
        type: 'success',
        message: 'Notification preferences saved!'
      })
    } catch (error: any) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to save notification preferences'
      })
    } finally {
      setLoading(prev => ({ ...prev, notifications: false }))
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!userId || deleteConfirm !== 'DELETE') return
    
    setIsDeleting(true)
    
    try {
      // In a real app, you would have proper account deletion flow
      // This is just a placeholder
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Clear local storage
      localStorage.clear()
      
      // Navigate to home
      window.location.href = '/'
      
    } catch (error) {
      console.error('Error deleting account:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Save status indicator */}
      {saveStatus.type && (
        <Card className={`p-4 border-l-4 ${
          saveStatus.type === 'success' 
            ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-600'
            : 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-600'
        }`}>
          <div className="flex items-center gap-3">
            {saveStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <p className={`text-sm font-medium ${
              saveStatus.type === 'success'
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            }`}>
              {saveStatus.message}
            </p>
          </div>
        </Card>
      )}

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[color:var(--dashboard-text)]">
          Account settings
        </h1>
        <p className="text-[color:var(--dashboard-muted)]">
          Manage your preferences and account details
        </p>
      </header>

      {/* Profile Section */}
      <Card className="p-6 space-y-6 bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[color:var(--dashboard-text)]">
              Profile
            </h2>
            <p className="text-sm text-[color:var(--dashboard-muted)]">
              Name, email, and basic info
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[color:var(--dashboard-text)]">
              Full name
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[color:var(--dashboard-text)]">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)] cursor-not-allowed"
            />
            <p className="text-xs text-[color:var(--dashboard-muted)]">
              Email cannot be changed
            </p>
          </div>
        </div>

        <Button
          onClick={handleProfileUpdate}
          disabled={loading.profile || !profile.name.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {loading.profile ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save changes
            </>
          )}
        </Button>
      </Card>

      {/* Focus & Intent */}
      <Card className="p-6 space-y-6 bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400">ðŸŽ¯</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[color:var(--dashboard-text)]">
              Focus & intent
            </h2>
            <p className="text-sm text-[color:var(--dashboard-muted)]">
              Update what you're working on. This affects tool recommendations.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg">
          <p className="text-sm text-[color:var(--dashboard-text)] mb-3">
            Your current preferences help us recommend the right tools for your workflow.
          </p>
          <Button 
            onClick={() => navigate('/onboarding')}
            variant="outline"
            className="border-emerald-300 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            Update intent
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 space-y-6 bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[color:var(--dashboard-text)]">
              Notifications
            </h2>
            <p className="text-sm text-[color:var(--dashboard-muted)]">
              Choose what deserves your attention.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 hover:bg-[color:var(--dashboard-border)] rounded-lg">
              <div>
                <p className="font-medium text-[color:var(--dashboard-text)] capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
                <p className="text-xs text-[color:var(--dashboard-muted)]">
                  Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} via email
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, [key]: checked }))
                }
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          ))}
        </div>

        <Button
          onClick={handleNotificationsUpdate}
          disabled={loading.notifications}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {loading.notifications ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save notification preferences
            </>
          )}
        </Button>
      </Card>

      {/* Billing */}
      <Card className="p-6 space-y-6 bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[color:var(--dashboard-text)]">
              Billing & subscription
            </h2>
            <p className="text-sm text-[color:var(--dashboard-muted)]">
              View plan, invoices, and limits.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Current plan
              </p>
              <p className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                Starter
              </p>
              <p className="text-xs text-[color:var(--dashboard-muted)] mt-1">
                3 active tools - Unlimited projects
              </p>
            </div>
            <Button
              onClick={() => navigate('/dashboard/billing')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Manage billing
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 space-y-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-red-700 dark:text-red-400">
              Danger zone
            </h2>
            <p className="text-sm text-red-600 dark:text-red-500">
              Irreversible actions. Proceed with caution.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="font-medium text-[color:var(--dashboard-text)] mb-2">
              Delete account
            </h3>
            <p className="text-sm text-[color:var(--dashboard-muted)] mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="delete-confirm" className="text-red-700 dark:text-red-400">
                  Type "DELETE" to confirm
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="border-red-300 dark:border-red-700 bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)]"
                />
              </div>
              
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || isDeleting}
                variant="destructive"
                className="w-full"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting account...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Permanently delete account
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-[color:var(--dashboard-surface)] rounded-lg border border-[color:var(--dashboard-border)]">
            <h3 className="font-medium text-[color:var(--dashboard-text)] mb-2">
              Export data
            </h3>
            <p className="text-sm text-[color:var(--dashboard-muted)] mb-4">
              Download all your data in a portable format.
            </p>
            <Button
              variant="outline"
              className="border-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)]"
            >
              Export all data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

