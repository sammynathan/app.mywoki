
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  X, 
  Clock, 
  Zap, 
  FolderKanban, 
  User, 
  Book, 
  ChevronRight,
  TrendingUp,
  Star
} from 'lucide-react'
import type { SearchResult } from '../lib/search-service'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isOpen: boolean
  onClose: () => void
  recentSearches: string[]
  onSearch: (query: string) => void
  onClearRecent: () => void
}

export default function SearchResults({
  results,
  query,
  isOpen,
  onClose,
  recentSearches,
  onSearch,
  onClearRecent
}: SearchResultsProps) {
  const navigate = useNavigate()
  const resultsRef = useRef<HTMLDivElement>(null)

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        onClose()
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        // Implement keyboard navigation here if needed
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool': return <Zap className="w-4 h-4 text-emerald-500" />
      case 'project': return <FolderKanban className="w-4 h-4 text-blue-500" />
      case 'user': return <User className="w-4 h-4 text-purple-500" />
      case 'documentation': return <Book className="w-4 h-4 text-amber-500" />
      default: return <Search className="w-4 h-4 text-gray-500" />
    }
  }

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url)
    onClose()
  }

  const getRelevanceBadge = (relevance: number) => {
    if (relevance >= 80) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-full">
          <Star className="w-3 h-3" />
          Best match
        </span>
      )
    }
    if (relevance >= 60) {
      return (
        <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
          Great match
        </span>
      )
    }
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Results panel */}
      <div
        ref={resultsRef}
        className="fixed left-1/2 top-24 transform -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Results content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            // No results
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            // Results list
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-1">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {result.title}
                          </h4>
                          {getRelevanceBadge(result.relevance)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          {result.category && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                              {result.category}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {result.type}
                          </span>
                          {result.metadata?.active === false && (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {query === '' && recentSearches.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Recent searches
                </h3>
                <button
                  onClick={onClearRecent}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => onSearch(search)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search tips */}
          {query !== '' && results.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Search tips
                </h3>
              </div>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>• Use quotation marks for exact phrases: "project management"</li>
                <li>• Filter by type: tool:analytics or project:reporting</li>
                <li>• Press Esc to close search</li>
                <li>• Press Enter to open the top result</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">↑↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Enter</kbd>
                <span>Select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Esc</kbd>
                <span>Close</span>
              </span>
            </div>
            <span>Press / to focus search</span>
          </div>
        </div>
      </div>
    </>
  )
}
