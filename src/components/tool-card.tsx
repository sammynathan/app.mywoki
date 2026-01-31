import React from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { AlertCircle, CheckCircle, Clock, Zap, Settings, Key, Mail } from 'lucide-react'
import type { Tool } from '../lib/types'
import { useNavigate } from 'react-router-dom'
import { useToolActivation } from '../hooks/useToolActivation'

interface ToolCardProps {
  tool: Tool
  isUserActive: boolean
  onToggle: () => void
}

export function ToolCard({ tool, isUserActive, onToggle }: ToolCardProps) {
  const navigate = useNavigate()
  const { activate, deactivate, loading } = useToolActivation(tool.id)

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'slack': <Zap className="w-6 h-6" />,
      'github': <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
      'sheets': <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V4H6zm2 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>,
      'email': <Mail className="w-6 h-6" />,
      'stripe': <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      'zapier': <Zap className="w-6 h-6" />,
    }
    return icons[iconName] || <Zap className="w-6 h-6" />
  }

  return (
    <Card className="bg-gray-800 border-gray-700 p-6 hover:border-green-500 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
            {getIcon(tool.icon_name)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{tool.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                {tool.category}
              </span>
              {tool.requires_mywoki_login && (
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  Mywoki
                </span>
              )}
              {new Date(tool.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                  New
                </span>
              )}
            </div>
          </div>
        </div>
        {isUserActive ? (
          <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full bg-gray-700 text-gray-400 text-xs font-semibold">
            Inactive
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-5 line-clamp-2">{tool.description}</p>

      {/* Issues Alert */}
      {tool.issues && tool.issues.length > 0 && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-white mb-1">Issues Detected:</p>
              {tool.issues.map((issue, idx) => (
                <p key={idx} className="text-gray-400">
                  • {issue}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-gray-900 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 mb-1">Last Used</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="w-3 h-3 text-gray-400" />
            {tool.usage_stats.last_used}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Activations</p>
          <p className="text-sm font-semibold text-white">{tool.usage_stats.activations}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={async () => {
            const success = isUserActive ? await deactivate() : await activate()
            if (success) onToggle()
          }}
          disabled={loading}
          variant={isUserActive ? 'destructive' : 'default'}
          size="sm"
          className={`w-full font-medium ${
            isUserActive
              ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isUserActive ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          onClick={() => navigate(`/dashboard/tools/${tool.id}/configure`)}
          variant="outline"
          size="sm"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
      </div>
    </Card>
  )
}
