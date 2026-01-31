
import { useSearch } from '../components/context/SearchContext'
import { useNavigate } from 'react-router-dom'

export function useGlobalSearch() {
  const { query, results, search, clearSearch } = useSearch()
  const navigate = useNavigate()

  // Function to perform search from any component
  const performSearch = async (searchQuery: string) => {
    await search(searchQuery)
  }

  // Function to navigate to a specific search result
  const navigateToResult = (resultId: string, resultType: string) => {
    // Map result type to URL
    const urlMap: Record<string, string> = {
      tool: `/dashboard/tools/${resultId}`,
      project: `/dashboard/projects/${resultId}`,
      user: `/management/users/${resultId}`,
      documentation: `/docs/${resultId}`
    }

    const url = urlMap[resultType]
    if (url) {
      navigate(url)
      clearSearch()
    }
  }

  // Function to filter results by type
  const filterByType = (type: string) => {
    return results.filter(result => result.type === type)
  }

  // Get search suggestions for the current query
  const getQuickSuggestions = () => {
    if (!query.trim() || results.length === 0) return []
    
    return results
      .slice(0, 3)
      .map(result => ({
        id: result.id,
        title: result.title,
        type: result.type,
        url: result.url
      }))
  }

  return {
    query,
    results,
    performSearch,
    navigateToResult,
    filterByType,
    getQuickSuggestions,
    clearSearch
  }
}
