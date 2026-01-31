
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { SearchService, type SearchResult } from '../../lib/search-service'

interface SearchContextType {
  query: string
  results: SearchResult[]
  isLoading: boolean
  isOpen: boolean
  recentSearches: string[]
  search: (query: string) => Promise<void>
  clearSearch: () => void
  toggleSearch: () => void
  closeSearch: () => void
  clearRecentSearches: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // Get user ID on mount
  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem('user_id')
      setUserId(id)

      if (id) {
        const searches = await SearchService.getRecentSearches(id)
        setRecentSearches(searches)
      }
    }
    fetchData()
  }, [])

  const search = useCallback(async (searchQuery: string) => {
    if (!userId || !searchQuery.trim()) {
      setResults([])
      setQuery(searchQuery)
      return
    }

    setQuery(searchQuery)
    setIsLoading(true)
    setIsOpen(true)

    try {
      // Debounce search
      setTimeout(async () => {
        const searchResults = await SearchService.search(searchQuery, userId)
        setResults(searchResults)
        setIsLoading(false)

        // Save to recent searches
        if (searchQuery.trim()) {
          SearchService.saveSearch(userId, searchQuery)
          const updatedSearches = await SearchService.getRecentSearches(userId)
          setRecentSearches(updatedSearches)
        }
      }, 300)
    } catch (error) {
      console.error('Search error:', error)
      setIsLoading(false)
    }
  }, [userId])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
  }, [])

  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev)
    if (!isOpen) {
      // Focus search input when opening
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
      }, 100)
    }
  }, [isOpen])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
  }, [])

  const clearRecentSearches = useCallback(() => {
    if (userId) {
      SearchService.clearRecentSearches(userId)
      setRecentSearches([])
    }
  }, [userId])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        toggleSearch()
      }
      
      // / to focus search when not in input
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        event.preventDefault()
        toggleSearch()
      }
      
      // Escape to close search
      if (event.key === 'Escape' && isOpen) {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleSearch, closeSearch, isOpen])

  const value: SearchContextType = {
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
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
