// src/pages/content/ContentPage.tsx
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Filter,
  Search,
  BookOpen,
  FileText,
  Video,
  Lock,
  Calendar,
  Clock
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ContentItem {
  id: string
  title: string
  excerpt: string
  type: 'essay' | 'guide' | 'video'
  premium: boolean
  read_time: number
  created_at: string
  tags: string[]
  image_url?: string
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'essay' | 'guide' | 'video' | 'premium'>('all')

  useEffect(() => {
    fetchContent()
  }, [])

  useEffect(() => {
    let filtered = content

    if (filter !== 'all') {
      if (filter === 'premium') {
        filtered = filtered.filter(item => item.premium)
      } else {
        filtered = filtered.filter(item => item.type === filter)
      }
    }

    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    setFilteredContent(filtered)
  }, [content, search, filter])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('content')
        .select('id, title, excerpt, type, premium, read_time, created_at, tags, image_url')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContent(data || [])
      setFilteredContent(data || [])
    } catch (err) {
      console.error('Error fetching content:', err)
    } finally {
      setLoading(false)
    }
  }

  const getIconByType = (type: string) => {
    switch (type) {
      case 'essay': return FileText
      case 'guide': return BookOpen
      case 'video': return Video
      default: return FileText
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <Helmet>
        <title>All Content — Sammy Nathan</title>
        <meta
          name="description"
          content="Browse all essays, guides, and resources from Sammy Nathan about product strategy, systems thinking, and sustainable growth."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Navigation */}
        <nav className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Link
              to="/sammy-nathan"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sammy Nathan
            </Link>
          </div>
        </nav>

        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">All Content</h1>
            <p className="text-xl text-slate-600 mb-8">
              Essays, guides, and frameworks for building with intention
            </p>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles, guides, topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    filter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('essay')}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap inline-flex items-center gap-2 ${
                    filter === 'essay'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Essays
                </button>
                <button
                  onClick={() => setFilter('guide')}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap inline-flex items-center gap-2 ${
                    filter === 'guide'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Guides
                </button>
                <button
                  onClick={() => setFilter('premium')}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap inline-flex items-center gap-2 ${
                    filter === 'premium'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Premium
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 h-48 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredContent.length > 0 ? (
              <>
                <div className="text-slate-600 mb-6">
                  Showing {filteredContent.length} of {content.length} pieces
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredContent.map((item) => {
                    const Icon = getIconByType(item.type)
                    return (
                      <Link
                        key={item.id}
                        to={`/content/${item.id}`}
                        className="group block bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        {item.image_url && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium text-slate-600 capitalize">
                                {item.type}
                              </span>
                            </div>
                            {item.premium && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                Premium
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {item.title}
                          </h3>

                          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                            {item.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.created_at)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {item.read_time || 5} min
                            </span>
                          </div>

                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-4">
                              {item.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No content found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your search or filter</p>
                <button
                  onClick={() => {
                    setSearch('')
                    setFilter('all')
                  }}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
