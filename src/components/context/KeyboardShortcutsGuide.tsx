
import { useState, useEffect } from 'react'
import { Command, Search, X, ArrowUp, Slash } from 'lucide-react'
import { Card } from '../ui/card'

export default function KeyboardShortcutsGuide() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show guide on Shift+? or Shift+/
      if (event.shiftKey && (event.key === '?' || event.key === '/')) {
        event.preventDefault()
        setIsVisible(true)
      }
      
      // Hide on Escape
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  if (!isVisible) return null

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open search', icon: <Search className="w-4 h-4" /> },
    { keys: ['/'], description: 'Focus search', icon: <Slash className="w-4 h-4" /> },
    { keys: ['↑', '↓'], description: 'Navigate results', icon: <ArrowUp className="w-4 h-4" /> },
    { keys: ['Enter'], description: 'Select result', icon: <Command className="w-4 h-4" /> },
    { keys: ['Esc'], description: 'Close search/guide', icon: <X className="w-4 h-4" /> },
    { keys: ['Shift', '?'], description: 'Show shortcuts', icon: <Command className="w-4 h-4" /> },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" 
        onClick={() => setIsVisible(false)}
      />

      {/* Guide modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500 dark:text-gray-400">
                      {shortcut.icon}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <div key={keyIndex} className="flex items-center">
                        <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="mx-1 text-gray-400">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs mx-1">Esc</kbd> 
                to close this guide
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
