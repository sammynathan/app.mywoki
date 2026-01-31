import { useState, useCallback } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Check } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

type PrimaryGoal = 'learning' | 'personal' | 'team'
type StartStyle = 'guided' | 'explore'

export default function Onboarding() {
  const { userId, completeOnboarding: completeOnboardingInContext } = useAuth()
  const [step, setStep] = useState(1)
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | null>(null)
  const [startStyle, setStartStyle] = useState<StartStyle | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)

 const completeOnboarding = useCallback(async () => {
  if (!primaryGoal || !startStyle || !userId) return

  setIsCompleting(true)

  try {
    const result = await completeOnboardingInContext(
      userId,
      primaryGoal,
      startStyle
    )

    if (!result.success) {
      throw new Error(result.message)
    }

    // ✅ Save to localStorage for persistence
    localStorage.setItem('mywoki_onboarding', JSON.stringify({
      primaryGoal,
      startStyle,
      completedAt: new Date().toISOString(),
      userId: userId !== 'temp' ? userId : undefined
    }))

    // ✅ Update window method for AuthContext sync
    if (window.updateOnboardingStatus) {
      window.updateOnboardingStatus(true)
    } else {
      // Dispatch custom event as fallback
      window.dispatchEvent(new CustomEvent('onboardingCompleted', {
        detail: { type: 'onboardingCompleted', completed: true }
      }))
    }

    // ✅ Navigate to dashboard
    window.location.href = '/dashboard'

  } catch (err) {
    console.error(err)
    setIsCompleting(false)
  }
}, [primaryGoal, startStyle, userId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-6 py-12">
      <Card className="w-full max-w-xl p-8 space-y-8 shadow-lg">
        {/* Progress */}
        <div className="flex justify-center gap-2">
  {[1,2,3].map(i => (
    <div
      key={i}
      className={`w-2 h-2 rounded-full ${
        step >= i ? 'bg-emerald-500' : 'bg-gray-300'
      }`}
    />
  ))}
</div>


        {/* STEP 1 — PRIMARY GOAL */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center">
                <img 
                  src="/mywoki-logo.png" 
                  className="h-8 w-8" 
                  alt="mywoki logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2310b981'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-family='Arial' font-size='40'%3EM%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Welcome to mywoki
              </h1>
              <p className="text-gray-600 text-lg">
                What brings you here today?
              </p>
            </div>

            <div className="space-y-4">
              <GoalOption
                selected={primaryGoal === 'learning'}
                icon="🎓"
                title="Learning & exploring"
                description="Trying things out, no pressure to commit. Perfect for students and curious minds."
                onClick={() => setPrimaryGoal('learning')}
              />

              <GoalOption
                selected={primaryGoal === 'personal'}
                icon="✨"
                title="Personal projects"
                description="Working on your own ideas, workflows, and creative projects."
                onClick={() => setPrimaryGoal('personal')}
              />

              <GoalOption
                selected={primaryGoal === 'team'}
                icon="👥"
                title="Team collaboration"
                description="Building with others, managing projects, and growing together."
                onClick={() => setPrimaryGoal('team')}
              />
            </div>

            <Button
              className="w-full py-3 text-lg"
              disabled={!primaryGoal}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* STEP 2 — START STYLE */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-semibold text-gray-900">
                How would you like to start?
              </h1>
              <p className="text-gray-600">
                Choose your preferred learning style. You can always change this later.
              </p>
            </div>

            <div className="space-y-4">
              <GoalOption
                selected={startStyle === 'guided'}
                icon="🗺️"
                title="Guide me"
                subtitle="Recommended for beginners"
                description="Follow a curated path with step-by-step suggestions and personalized recommendations."
                onClick={() => setStartStyle('guided')}
              />

              <GoalOption
                selected={startStyle === 'explore'}
                icon="🧭"
                title="I'll explore on my own"
                subtitle="For experienced users"
                description="Jump right in and discover tools at your own pace. Full control from day one."
                onClick={() => setStartStyle('explore')}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="w-full py-3"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="w-full py-3"
                disabled={!startStyle}
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 — CONFIRM */}
        {step === 3 && (
          <div className="space-y-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
              <img 
                src="/mywoki-logo.png" 
                className="h-10 w-10" 
                alt="mywoki logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2310b981'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-family='Arial' font-size='40'%3EM%3C/text%3E%3C/svg%3E"
                }}
              />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-gray-900">
                You're all set! 🎉
              </h1>
              <p className="text-gray-600 text-lg">
                We'll customize your experience based on your preferences.
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 text-left space-y-4 border border-emerald-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Your focus</p>
                <p className="font-medium text-gray-900">
                  {primaryGoal === 'learning' && '🎓 Learning & exploration'}
                  {primaryGoal === 'personal' && '✨ Personal projects'}
                  {primaryGoal === 'team' && '👥 Team collaboration'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Start style</p>
                <p className="font-medium text-gray-900">
                  {startStyle === 'guided' && '🗺️ Guided experience'}
                  {startStyle === 'explore' && '🧭 Self-guided exploration'}
                </p>
              </div>
              
              <div className="pt-4 border-t border-emerald-100">
                <p className="text-sm text-gray-600">
                  ✨ You can update these preferences anytime in your settings.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full py-3 text-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                onClick={completeOnboarding}
                disabled={isCompleting}
              >
                {isCompleting ? 'Completing...' : 'Enter mywoki →'}
              </Button>
              
              <button
                onClick={() => setStep(2)}
                className="text-sm text-gray-500 hover:text-gray-700"
                disabled={isCompleting}
              >
                ← Go back and edit
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

/* ---------- Reusable Option Component ---------- */

function GoalOption({
  icon,
  title,
  subtitle,
  description,
  selected,
  onClick,
}: {
  icon: string
  title: string
  subtitle?: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`text-2xl ${selected ? 'opacity-100' : 'opacity-70'}`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
              {subtitle && (
                <p className="text-sm text-emerald-600 font-medium mt-1">{subtitle}</p>
              )}
            </div>
            {selected && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mt-3">{description}</p>
        </div>
      </div>
    </button>
  )
}

// Global helper for AuthContext sync
declare global {
  interface Window {
    updateOnboardingStatus?: (completed: boolean) => void;
  }
}