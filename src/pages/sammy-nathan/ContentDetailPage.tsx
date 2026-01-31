// src/pages/ContentDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  Lock, 
  Mail, 
  Calendar, 
  Clock, 
  Tag,
  ChevronRight,
  BookOpen
} from 'lucide-react'
import { supabase } from '../../lib/supabase' // Assuming you have supabase client setup

interface Content {
  updated_at: string
  id: string
  title: string
  content: string
  excerpt: string
  type: 'essay' | 'guide' | 'video'
  premium: boolean
  published: boolean
  image_url: string
  video_url: string
  tags: string[]
  read_time: number
  created_at: string
}

interface PremiumAccessForm {
  name: string
  email: string
  message: string
}

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPremiumForm, setShowPremiumForm] = useState(false)
  const [premiumForm, setPremiumForm] = useState<PremiumAccessForm>({
    name: '',
    email: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [id])

  const fetchContent = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single()

      if (error) throw error
      
      if (!data) {
        throw new Error('Content not found')
      }
      
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
      console.error('Error fetching content:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePremiumFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Premium access request:', premiumForm)
      
      // Send email notification or save to database
      const { error } = await supabase
        .from('premium_requests')
        .insert([{
          content_id: content?.id,
          content_title: content?.title,
          name: premiumForm.name,
          email: premiumForm.email,
          message: premiumForm.message,
          created_at: new Date().toISOString()
        }])
      
      if (error) throw error
      
      setSubmitted(true)
      setPremiumForm({ name: '', email: '', message: '' })
      
      // Hide form after successful submission
      setTimeout(() => {
        setShowPremiumForm(false)
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error('Error submitting premium request:', err)
      alert('Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Content Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The content you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{content.title} — Sammy Nathan</title>
        <meta name="description" content={content.excerpt || content.title} />
        <meta name="keywords" content={content.tags?.join(', ')} />
        {content.image_url && <meta property="og:image" content={content.image_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": content.title,
            "description": content.excerpt,
            "datePublished": content.created_at,
            "dateModified": content.updated_at || content.created_at,
            "wordCount": content.content.split(' ').length,
            "timeRequired": `PT${content.read_time}M`,
            "author": {
              "@type": "Person",
              "name": "Sammy Nathan",
              "url": "https://sammy-nathan.mywoki.com"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Navigation */}
        <nav className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-40">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all content
            </button>
          </div>
        </nav>

        {/* Premium Banner */}
        {content.premium && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Lock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">Premium Content</h3>
                    <p className="text-sm text-amber-700">
                      This content is available to premium subscribers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPremiumForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition shadow-sm hover:shadow-md inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Get Access
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </span>
              {content.premium && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {content.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(content.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{content.read_time || 5} min read</span>
              </div>
            </div>
            
            {content.excerpt && (
              <div className="bg-slate-100 rounded-2xl p-6 mb-8">
                <p className="text-lg text-slate-700 italic">{content.excerpt}</p>
              </div>
            )}
            
            {content.image_url && (
              <div className="mb-8">
                <img 
                  src={content.image_url} 
                  alt={content.title}
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            )}
            
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            {content.premium ? (
              <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="inline-flex p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
                    <Lock className="w-12 h-12 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    This is Premium Content
                  </h3>
                  <p className="text-slate-600">
                    To continue reading this {content.type}, you'll need premium access.
                    This helps support the creation of in-depth, high-quality content.
                  </p>
                  <button
                    onClick={() => setShowPremiumForm(true)}
                    className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition shadow-lg hover:shadow-xl w-full"
                  >
                    Get Access Now
                  </button>
                  <p className="text-sm text-slate-500">
                    One-time access or subscription options available
                  </p>
                </div>
              </div>
            ) : (
              <div 
                className="content-body"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            )}
          </article>

          {/* Video Content */}
          {content.video_url && !content.premium && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4">Video Content</h3>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={content.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </main>

        {/* Premium Access Modal */}
        {showPremiumForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-slideUp">
              {submitted ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex p-3 bg-emerald-100 rounded-full">
                    <Mail className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Request Sent!
                  </h3>
                  <p className="text-slate-600">
                    Thank you for your interest. I'll get back to you within 24 hours with access details.
                  </p>
                  <button
                    onClick={() => setShowPremiumForm(false)}
                    className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Get Premium Access
                      </h3>
                      <p className="text-slate-600">
                        Get full access to "{content.title}"
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePremiumFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={premiumForm.name}
                        onChange={(e) => setPremiumForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={premiumForm.email}
                        onChange={(e) => setPremiumForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Message (Optional)
                      </label>
                      <textarea
                        value={premiumForm.message}
                        onChange={(e) => setPremiumForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition h-32"
                        placeholder="Tell me about your interest in this content..."
                      />
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-600">
                        By requesting access, you agree to receive emails about this content and related updates. You can unsubscribe at any time.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowPremiumForm(false)}
                        className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Sending...' : 'Request Access'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}