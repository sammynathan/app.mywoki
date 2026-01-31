
import { supabase } from './supabase'

export interface SearchResult {
  id: string
  type: 'tool' | 'project' | 'user' | 'documentation'
  title: string
  description: string
  category?: string
  relevance: number
  url: string
  metadata?: Record<string, any>
}

export interface SearchFilters {
  type?: ('tool' | 'project' | 'user' | 'documentation')[]
  category?: string[]
  minRelevance?: number
}

interface ToolRecord {
  id: string
  name: string
  description: string
  category: string
  is_active: boolean
}

interface UserRecord {
  id: string
  name: string | null
  email: string
  plan: string
  status: string
  role?: string
}

interface ProjectWithTool {
  id: string
  activated_at: string
  tools: {
    id: string
    name: string
    description: string
    category: string
  }
}

export class SearchService {
  // Search across all content types
  static async search(
    query: string,
    userId: string,
    filters?: SearchFilters,
    limit: number = 10
  ): Promise<SearchResult[]> {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase().trim()
    const results: SearchResult[] = []

    try {
      // Search tools
      if (!filters?.type || filters.type.includes('tool')) {
        const toolResults = await this.searchTools(searchTerm, limit)
        results.push(...toolResults)
      }

      // Search projects (user's own projects)
      if (!filters?.type || filters.type.includes('project')) {
        const projectResults = await this.searchProjects(searchTerm, userId, limit)
        results.push(...projectResults)
      }

      // Search users (if admin)
      if (!filters?.type || filters.type.includes('user')) {
        const userResults = await this.searchUsers(searchTerm, userId, limit)
        results.push(...userResults)
      }

      // Search documentation
      if (!filters?.type || filters.type.includes('documentation')) {
        const docResults = await this.searchDocumentation(searchTerm, limit)
        results.push(...docResults)
      }

      // Apply category filters
      let filteredResults = results
      if (filters?.category?.length) {
        filteredResults = results.filter(result => 
          result.category && filters.category!.includes(result.category)
        )
      }

      // Apply relevance threshold
      if (filters?.minRelevance) {
        filteredResults = filteredResults.filter(result => 
          result.relevance >= filters.minRelevance!
        )
      }

      // Sort by relevance and return
      return filteredResults
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit)

    } catch (error) {
      console.error('Search error:', error)
      return []
    }
  }

  // Search tools
  private static async searchTools(
    searchTerm: string,
    limit: number
  ): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('id, name, description, category, is_active')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .limit(limit)

      if (error) throw error

      const tools = data as ToolRecord[]

      return (tools || []).map((tool) => ({
        id: tool.id,
        type: 'tool' as const,
        title: tool.name,
        description: tool.description,
        category: tool.category,
        relevance: this.calculateRelevance(searchTerm, tool.name, tool.description),
        url: `/dashboard/tools/${tool.id}`,
        metadata: {
          active: tool.is_active
        }
      }))
    } catch (error) {
      console.error('Error searching tools:', error)
      return []
    }
  }

  // Search user's projects
  private static async searchProjects(
    searchTerm: string,
    userId: string,
    limit: number
  ): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('user_tool_activations')
        .select(`
          id,
          activated_at,
          tools (
            id,
            name,
            description,
            category
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(limit)

      if (error) throw error

      const projects = data as unknown as ProjectWithTool[]

      return (projects || [])
        .map(project => {
          const tool = project.tools
          const relevance = this.calculateRelevance(searchTerm, tool.name, tool.description)
          
          return {
            id: project.id,
            type: 'project' as const,
            title: tool.name,
            description: tool.description,
            category: tool.category,
            relevance,
            url: `/dashboard/projects/${project.id}`,
            metadata: {
              activated_at: project.activated_at
            }
          }
        })
        .filter(result => result.relevance > 0)
        .slice(0, limit)
    } catch (error) {
      console.error('Error searching projects:', error)
      return []
    }
  }

  // Search users (admin only)
  private static async searchUsers(
    searchTerm: string,
    userId: string,
    limit: number
  ): Promise<SearchResult[]> {
    try {
      // Check if user is admin
      const isAdmin = await this.checkIfAdmin(userId)
      if (!isAdmin) return []

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, plan, status')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,plan.ilike.%${searchTerm}%`)
        .limit(limit)

      if (error) throw error

      const users = data as UserRecord[]

      return (users || []).map(user => ({
        id: user.id,
        type: 'user' as const,
        title: user.name || user.email,
        description: `${user.plan} plan • ${user.status}`,
        category: 'Users',
        relevance: this.calculateRelevance(searchTerm, user.name || '', user.email),
        url: `/management/users/${user.id}`,
        metadata: {
          email: user.email,
          plan: user.plan,
          status: user.status
        }
      }))
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }

  // Search documentation (mock data - you can replace with real docs)
  private static async searchDocumentation(
    searchTerm: string,
    limit: number
  ): Promise<SearchResult[]> {
    const documentation = [
      {
        id: 'getting-started',
        title: 'Getting Started Guide',
        description: 'Learn how to use the platform and activate your first tools',
        category: 'Documentation'
      },
      {
        id: 'tool-activation',
        title: 'Tool Activation Guide',
        description: 'How to activate and manage tools in your workspace',
        category: 'Documentation'
      },
      {
        id: 'billing-faq',
        title: 'Billing & Subscription FAQ',
        description: 'Common questions about plans, billing, and upgrades',
        category: 'Documentation'
      },
      {
        id: 'api-integration',
        title: 'API Integration Guide',
        description: 'How to integrate external services with our platform',
        category: 'Documentation'
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        description: 'Tips and best practices for optimizing your workflow',
        category: 'Documentation'
      }
    ]

    return documentation
      .map(doc => ({
        id: doc.id,
        type: 'documentation' as const,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        relevance: this.calculateRelevance(searchTerm, doc.title, doc.description),
        url: `/doc/${doc.id}`,
        metadata: {}
      }))
      .filter(result => result.relevance > 0)
      .slice(0, limit)
  }

  // Calculate relevance score (simple implementation)
  private static calculateRelevance(
    searchTerm: string,
    title: string,
    description: string
  ): number {
    const titleLower = title.toLowerCase()
    const descLower = description.toLowerCase()
    const searchTerms = searchTerm.split(' ')

    let score = 0

    // Exact title match
    if (titleLower === searchTerm) score += 100
    // Title contains search term
    else if (titleLower.includes(searchTerm)) score += 50
    // Description contains search term
    else if (descLower.includes(searchTerm)) score += 25

    // Check for individual word matches
    searchTerms.forEach(term => {
      if (term.length < 3) return // Skip short words
      
      if (titleLower.includes(term)) score += 10
      if (descLower.includes(term)) score += 5
    })

    // Bonus for starts with search term
    if (titleLower.startsWith(searchTerm)) score += 15

    return Math.min(score, 100)
  }

  // Check if user is admin
  private static async checkIfAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) return false
      
      const user = data as { role?: string }
      return user?.role === 'admin'
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Get search suggestions (for autocomplete)
  static async getSuggestions(
    query: string,
    userId: string,
    limit: number = 5
  ): Promise<string[]> {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase().trim()
    const suggestions = new Set<string>()

    try {
      // Get tool name suggestions
      const { data: tools } = await supabase
        .from('tools')
        .select('name')
        .ilike('name', `%${searchTerm}%`)
        .eq('is_active', true)
        .limit(limit)

      tools?.forEach(tool => {
        if (tool.name) suggestions.add(tool.name)
      })

      // Get category suggestions
      const { data: categories } = await supabase
        .from('tools')
        .select('category')
        .ilike('category', `%${searchTerm}%`)
        .limit(limit)

      const uniqueCategories = [...new Set(categories?.map(c => c.category).filter(Boolean) || [])]
      uniqueCategories.forEach(cat => {
        if (cat) suggestions.add(cat)
      })

      // Get user's project suggestions
      const { data: projects } = await supabase
        .from('user_tool_activations')
        .select(`
          tools (
            name
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(limit)

      projects?.forEach((project: any) => {
        if (project.tools?.name) {
          suggestions.add(project.tools.name)
        }
      })

      return Array.from(suggestions).slice(0, limit)
    } catch (error) {
      console.error('Error getting suggestions:', error)
      return []
    }
  }

  // Get recent searches for user
  static getRecentSearches(userId: string, limit: number = 5): string[] {
    try {
      const recentSearches = localStorage.getItem(`recent_searches_${userId}`)
      if (!recentSearches) return []
      
      const searches = JSON.parse(recentSearches)
      return Array.isArray(searches) ? searches.slice(0, limit) : []
    } catch (error) {
      console.error('Error getting recent searches:', error)
      return []
    }
  }

  // Save search to recent searches
  static saveSearch(userId: string, query: string): void {
    try {
      const key = `recent_searches_${userId}`
      const recentSearches = JSON.parse(localStorage.getItem(key) || '[]')
      
      // Remove if already exists
      const filtered = recentSearches.filter((q: string) => 
        q.toLowerCase() !== query.toLowerCase()
      )
      
      // Add to beginning
      filtered.unshift(query)
      
      // Keep only last 10 searches
      const limited = filtered.slice(0, 10)
      localStorage.setItem(key, JSON.stringify(limited))
    } catch (error) {
      console.error('Error saving search:', error)
    }
  }

  // Clear recent searches
  static clearRecentSearches(userId: string): void {
    localStorage.removeItem(`recent_searches_${userId}`)
  }
}
