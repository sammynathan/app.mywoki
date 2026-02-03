import { useState, useEffect, useRef } from "react"
import { Search, Menu, X, Command, Clock } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import Notifications from "./Info"
import UserMenu from "./UserMenu"
import { useAuth } from "../auth/AuthContext"
import { useSearch } from "../components/context/SearchContext"
import SearchResults from "../components/SearchResults"

interface DashboardHeaderProps {
  onMenuClick?: () => void
  showMobileMenu?: boolean
}

export default function DashboardHeader({ 
  onMenuClick, 
  showMobileMenu = false 
}: DashboardHeaderProps) {
  const { name } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const {
    query,
    results,
    isLoading,
    isOpen,
    recentSearches,
    search,
    clearSearch,
    toggleSearch,
    closeSearch,
    clearRecentSearches
  } = useSearch()

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle search input change
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    await search(value)
    
    // Show suggestions for longer queries
    if (value.length >= 2) {
      setShowSuggestions(true)
      // In a real implementation, fetch suggestions from API
      // For now, we'll use mock suggestions based on query
      const mockSuggestions = getMockSuggestions(value)
      setSuggestions(mockSuggestions)
    } else {
      setShowSuggestions(false)
    }
  }

  const getMockSuggestions = (query: string): string[] => {
    const allSuggestions = [
      'Analytics Dashboard',
      'Project Management',
      'File Storage',
      'Team Collaboration',
      'API Integration',
      'Data Visualization',
      'Customer Support',
      'Marketing Automation',
      'Financial Reports',
      'User Analytics'
    ]
    
    return allSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // The search is already handled by the search context
      closeSearch()
      // Focus on the first result or navigate
      if (results.length > 0) {
        // In a real app, you might want to navigate to the first result
        console.log('Top result:', results[0])
      }
    }
  }

  // Clear search
  const handleClearSearch = () => {
    clearSearch()
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    search(suggestion)
    setShowSuggestions(false)
  }

  return (
    <>
      <header className={`sticky top-0 z-40 bg-[color:var(--dashboard-surface)]/90 backdrop-blur-md border-b border-[color:var(--dashboard-border)] transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left section: Mobile menu + Brand */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-text)] hover:bg-[color:var(--dashboard-border)] transition-colors"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Brand/Logo */}
              <div className="flex items-center ml-4">
                
                <span className="text-lg font-semibold text-[color:var(--dashboard-text)]">
                  workspace
                </span>
              </div>
            </div>

            {/* Center section: Search */}
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[color:var(--dashboard-muted)]" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search tools, projects, or documentation..."
                    className="block w-full pl-10 pr-24 py-2.5 border border-[color:var(--dashboard-border)] rounded-xl bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)] placeholder-[color:var(--dashboard-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    value={query}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (query.trim()) {
                        toggleSearch()
                      }
                    }}
                  />
                  
                  {/* Search actions */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
                    {query && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1 rounded-md text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-text)] transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    
                    {/* Keyboard shortcut hint */}
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[color:var(--dashboard-muted)] border border-[color:var(--dashboard-border)] rounded-md">
                      <Command className="h-3 w-3" />
                      <span>K</span>
                    </div>
                  </div>

                  {/* Suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[color:var(--dashboard-surface)] border border-[color:var(--dashboard-border)] rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="p-2 border-b border-[color:var(--dashboard-border)]">
                        <div className="flex items-center gap-2 text-xs text-[color:var(--dashboard-muted)]">
                          <Search className="w-3 h-3" />
                          <span>Suggestions</span>
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-3 py-2 hover:bg-[color:var(--dashboard-border)] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[color:var(--dashboard-muted)]" />
                              <span className="text-sm text-[color:var(--dashboard-text)]">
                                {suggestion}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Right section: Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <div className="hidden sm:block">
                <Notifications />
              </div>

              {/* User Menu */}
              <UserMenu userName={name} />

              {/* Mobile search button (hidden on desktop) */}
              <button
                className="sm:hidden p-2 rounded-md text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-text)] hover:bg-[color:var(--dashboard-border)]"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Results Modal */}
      <SearchResults
        results={results}
        query={query}
        isOpen={isOpen}
        onClose={closeSearch}
        recentSearches={recentSearches}
        onSearch={search}
        onClearRecent={clearRecentSearches}
      />
    </>
  )
}

