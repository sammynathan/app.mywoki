import { Button } from './ui/button'
import {
  ArrowRight,
  Zap,
  Sparkles,
  FolderKanban,
  Workflow,
  BarChart,
  Settings,
} from 'lucide-react'

type PrimaryGoal = 'personal' | 'team' | 'learning'

interface OnboardingData {
  primaryGoal: PrimaryGoal
}

interface EmptyStateProps {
  type: 'dashboard' | 'tools' | 'projects' | 'automations' | 'analytics' | 'settings'
  onboardingData?: OnboardingData
  onAction?: () => void
  onEditGoals?: () => void
}

export function EmptyState({
  type,
  onboardingData,
  onAction,
  onEditGoals,
}: EmptyStateProps) {
  const goal = onboardingData?.primaryGoal

  const contentMap = {
    dashboard: {
      icon: Zap,
      title:
        goal === 'personal'
          ? 'Your personal software space'
          : goal === 'team'
          ? 'Your team stack starts here'
          : goal === 'learning'
          ? 'Explore without pressure'
          : 'Welcome to your dashboard',
      description:
        goal === 'personal'
          ? 'Tools designed to save time and reduce noise. Activate only what helps.'
          : goal === 'team'
          ? 'Set up tools without the usual chaos. Start with one, add as you grow.'
          : goal === 'learning'
          ? 'Discover tools freely and learn as you go.'
          : 'Start exploring tools that matter to you.',
      action:
        goal === 'personal'
          ? 'Activate your first tool'
          : goal === 'team'
          ? 'Set up your stack'
          : goal === 'learning'
          ? 'Try a tool'
          : 'Browse tools',
      color:
        goal === 'personal'
          ? 'from-blue-50 to-blue-100'
          : goal === 'team'
          ? 'from-emerald-50 to-emerald-100'
          : goal === 'learning'
          ? 'from-purple-50 to-purple-100'
          : 'from-gray-50 to-gray-100',
    },

    tools: {
      icon: Sparkles,
      title: 'Tools appear when they matter',
      description:
        "You don't need everything at once. Activate tools only when they support your goal.",
      action: 'View recommended tools',
      color: 'from-blue-50 to-indigo-100',
    },

    projects: {
      icon: FolderKanban,
      title: 'Your work will live here',
      description:
        'Projects organize tools and automations around real outcomes.',
      action: 'Start a project',
      color: 'from-emerald-50 to-green-100',
    },

    automations: {
      icon: Workflow,
      title: 'Automate after clarity',
      description:
        'Once a task repeats, we help you simplify it — not before.',
      action: 'Learn about automations',
      color: 'from-purple-50 to-violet-100',
    },

    analytics: {
      icon: BarChart,
      title: 'Nothing to measure yet',
      description:
        'Insights appear when activity starts. We keep metrics focused and useful.',
      action: 'See what we track',
      color: 'from-amber-50 to-orange-100',
    },

    settings: {
      icon: Settings,
      title: 'Preferences shape mywoki',
      description:
        'The system adapts as you work — not the other way around.',
      action: 'Explore settings',
      color: 'from-gray-50 to-gray-100',
    },
  }

  const content = contentMap[type]
  const Icon = content.icon

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 text-center">
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${content.color} flex items-center justify-center mb-6`}
      >
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
      </div>

      <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-3 max-w-md">
        {content.title}
      </h3>

      <p className="text-gray-600 mb-8 max-w-md">
        {content.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {onAction && (
          <Button className="px-6 py-3 rounded-xl flex items-center gap-2" onClick={onAction}>
            {content.action}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {type === 'dashboard' && onboardingData && onEditGoals && (
          <Button variant="outline" onClick={onEditGoals}>
            Edit goals
          </Button>
        )}
      </div>
    </div>
  )
}
