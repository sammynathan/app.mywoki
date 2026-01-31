import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Code, Database, Filter, Zap,
  ChevronRight, ExternalLink,
  Calendar, AlertCircle,
  FileText, Settings, Users
} from 'lucide-react'
import { Card } from './ui/card'

export default function SearchServiceDocs() {
  const [lastUpdated] = useState('January 19, 2026')
  const [searchQuery, setSearchQuery] = useState('')

  const sections = [
    { id: 'overview', title: '1. Overview' },
    { id: 'interfaces', title: '2. Interfaces & Types' },
    { id: 'methods', title: '3. Core Methods' },
    { id: 'search-logic', title: '4. Search Logic' },
    { id: 'usage', title: '5. Usage Examples' },
    { id: 'integration', title: '6. Integration' },
    { id: 'troubleshooting', title: '7. Troubleshooting' }
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredSections = sections.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
              API Documentation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            SearchService Documentation
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mb-8">
            Comprehensive guide to the SearchService class for implementing global search functionality across tools, projects, users, and documentation.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>TypeScript Implementation</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Supabase Integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24 p-6 border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5" />
                Sections
              </h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h4>
                <Link
                  to="/lib/search-service.ts"
                  className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <span>Source Code</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to="/hooks/useGlobalSearch.ts"
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <span>React Hook</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:w-3/4 space-y-12">
            {/* Section 1: Overview */}
            <section id="overview" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">1</span>
                  Overview
                </h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    The SearchService is a comprehensive search utility that enables global search functionality across multiple data types in the Mywoki platform. It provides unified search capabilities for tools, user projects, user accounts (admin only), and documentation.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        Key Features
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Multi-type search (tools, projects, users, docs)</li>
                        <li>• Relevance-based ranking</li>
                        <li>• Category and type filtering</li>
                        <li>• Autocomplete suggestions</li>
                        <li>• Recent search history</li>
                      </ul>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        Performance
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Optimized database queries</li>
                        <li>• Caching for suggestions</li>
                        <li>• Pagination support</li>
                        <li>• Error handling and fallbacks</li>
                      </ul>
                    </Card>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Architecture</h3>
                    <p className="text-sm text-gray-600">
                      The SearchService uses Supabase as its data source and implements a relevance scoring algorithm to rank results. It supports both exact matches and fuzzy search across multiple fields.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Interfaces & Types */}
            <section id="interfaces" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">2</span>
                  Interfaces & Types
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      SearchResult Interface
                    </h3>
                    <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`export interface SearchResult {
  id: string
  type: 'tool' | 'project' | 'user' | 'documentation'
  title: string
  description: string
  category?: string
  relevance: number
  url: string
  metadata?: Record<string, any>
}`}
                    </pre>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li><strong>id:</strong> Unique identifier for the result</li>
                      <li><strong>type:</strong> Content type (tool, project, user, documentation)</li>
                      <li><strong>title:</strong> Display title</li>
                      <li><strong>description:</strong> Brief description</li>
                      <li><strong>category:</strong> Optional category grouping</li>
                      <li><strong>relevance:</strong> Search relevance score (0-100)</li>
                      <li><strong>url:</strong> Link to the content</li>
                      <li><strong>metadata:</strong> Additional data specific to the type</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Filter className="w-5 h-5 text-blue-600" />
                      SearchFilters Interface
                    </h3>
                    <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`export interface SearchFilters {
  type?: ('tool' | 'project' | 'user' | 'documentation')[]
  category?: string[]
  minRelevance?: number
}`}
                    </pre>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li><strong>type:</strong> Filter by content types</li>
                      <li><strong>category:</strong> Filter by categories</li>
                      <li><strong>minRelevance:</strong> Minimum relevance threshold</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Core Methods */}
            <section id="methods" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">3</span>
                  Core Methods
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-600" />
                        search()
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Main search method that queries across all content types.
                      </p>
                      <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`static async search(
  query: string,
  userId: string,
  filters?: SearchFilters,
  limit: number = 10
): Promise<SearchResult[]>`}
                      </pre>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        getSuggestions()
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Provides autocomplete suggestions for search queries.
                      </p>
                      <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`static async getSuggestions(
  query: string,
  userId: string,
  limit: number = 5
): Promise<string[]>`}
                      </pre>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        saveSearch()
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Saves a search query to recent searches history.
                      </p>
                      <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`static saveSearch(userId: string, query: string): void`}
                      </pre>
                    </Card>

                    <Card className="p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        getRecentSearches()
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Retrieves recent search history for a user.
                      </p>
                      <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`static getRecentSearches(userId: string, limit: number = 5): string[]`}
                      </pre>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Search Logic */}
            <section id="search-logic" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">4</span>
                  Search Logic
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Relevance Scoring Algorithm</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      The search service uses a weighted scoring system to rank results by relevance:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><strong>100 points:</strong> Exact title match</li>
                      <li><strong>50 points:</strong> Title contains search term</li>
                      <li><strong>25 points:</strong> Description contains search term</li>
                      <li><strong>15 points:</strong> Title starts with search term</li>
                      <li><strong>10 points:</strong> Individual words in title</li>
                      <li><strong>5 points:</strong> Individual words in description</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Search Data Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Tools Search</h4>
                        <p className="text-sm text-gray-600">
                          Searches active tools by name, description, and category using PostgreSQL ILIKE for case-insensitive matching.
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Projects Search</h4>
                        <p className="text-sm text-gray-600">
                          Searches user's activated tools, filtering by active status and user ownership.
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Users Search (Admin)</h4>
                        <p className="text-sm text-gray-600">
                          Admin-only search across user profiles, restricted by role-based access control.
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Documentation Search</h4>
                        <p className="text-sm text-gray-600">
                          Static documentation content with predefined help topics and guides.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Usage Examples */}
            <section id="usage" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">5</span>
                  Usage Examples
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Basic Search</h3>
                    <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`import { SearchService } from '@/lib/search-service'

// Basic search across all content types
const results = await SearchService.search(
  'project management',
  userId,
  undefined, // no filters
  20 // limit
)

console.log(results)
// Returns SearchResult[] sorted by relevance`}
                    </pre>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Filtered Search</h3>
                    <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`// Search only tools and projects with high relevance
const filteredResults = await SearchService.search(
  'analytics',
  userId,
  {
    type: ['tool', 'project'],
    minRelevance: 30,
    category: ['Productivity', 'Business']
  },
  10
)`}
                    </pre>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Autocomplete Suggestions</h3>
                    <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`// Get search suggestions for autocomplete
const suggestions = await SearchService.getSuggestions(
  'proj',
  userId,
  5
)
// Returns: ['Project Management', 'Project Notes', ...]`}
                    </pre>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Managing Search History</h3>
                    <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`// Save a search to history
SearchService.saveSearch(userId, 'dashboard tools')

// Get recent searches
const recent = SearchService.getRecentSearches(userId, 5)

// Clear search history
SearchService.clearRecentSearches(userId)`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Integration */}
            <section id="integration" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">6</span>
                  Integration
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">React Hook Integration</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      The SearchService integrates with the useGlobalSearch React hook for seamless UI integration:
                    </p>
                    <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`import { useGlobalSearch } from '@/hooks/useGlobalSearch'

function SearchComponent() {
  const {
    query,
    setQuery,
    results,
    loading,
    suggestions,
    recentSearches,
    search,
    clearHistory
  } = useGlobalSearch()

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {suggestions.map(suggestion => (
        <div key={suggestion} onClick={() => search(suggestion)}>
          {suggestion}
        </div>
      ))}
    </div>
  )
}`}
                    </pre>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Database Dependencies</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      The SearchService requires the following database tables:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><strong>tools:</strong> id, name, description, category, is_active</li>
                      <li><strong>user_tool_activations:</strong> id, user_id, tool_id, activated_at, is_active</li>
                      <li><strong>users:</strong> id, name, email, plan, status, role</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Troubleshooting */}
            <section id="troubleshooting" className="scroll-mt-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">7</span>
                  Troubleshooting
                </h2>

                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Common Issues</h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          No search results
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Check if Supabase connection is working</li>
                          <li>• Verify user has necessary permissions</li>
                          <li>• Ensure search term is not too short</li>
                          <li>• Check database tables have data</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Low relevance scores</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Try more specific search terms</li>
                          <li>• Use filters to narrow results</li>
                          <li>• Check if content matches search criteria</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Performance issues</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Reduce search limit parameter</li>
                          <li>• Add more specific filters</li>
                          <li>• Check database indexes</li>
                          <li>• Consider caching frequent searches</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Debug Mode</h3>
                    <p className="text-sm text-gray-600">
                      Enable debug logging by setting <code className="bg-gray-200 px-1 rounded">VITE_DEBUG=true</code> in your environment variables to see detailed search query logs.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 shadow-sm p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Complete API Reference
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  For detailed method signatures, parameters, and return types, refer to the source code in <code className="bg-gray-200 px-2 py-1 rounded">src/lib/search-service.ts</code>.
                </p>
                <Link
                  to="/lib/search-service.ts"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Code className="w-5 h-5" />
                  View Source Code
                </Link>
              </div>
            </section>

            {/* Last Updated */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-700">
                <strong>Last Updated:</strong> {lastUpdated}<br />
                <strong>SearchService Version:</strong> 1.0<br />
                <strong>Dependencies:</strong> Supabase, TypeScript<br />
                <strong>Database Schema:</strong> Requires dashboard schema v1.0+
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
