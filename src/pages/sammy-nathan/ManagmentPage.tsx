"use client"

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  Upload, Image as ImageIcon, Video, Save, Eye, 
  Lock, Globe, Edit, Trash2, Plus, X, BookOpen
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// Define TypeScript interfaces
interface ContentPost {
  id: string
  title: string
  content: string
  excerpt?: string
  type: 'essay' | 'guide' | 'video' | 'framework'
  premium: boolean
  published: boolean
  image_url?: string
  video_url?: string
  tags?: string[]
  created_at: string
}

interface FormData {
  title: string
  content: string
  type: 'essay' | 'guide' | 'video' | 'framework'
  premium: boolean
  image_url: string
  video_url: string
  tags: string
  excerpt: string
}

export default function ManagementPage() {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    type: 'essay',
    premium: false,
    image_url: '',
    video_url: '',
    tags: '',
    excerpt: ''
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setPosts(data as ContentPost[])
    }
    setLoading(false)
  }

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { data, error } = await supabase.storage
      .from('content-images')
      .upload(`public/${Date.now()}_${file.name}`, file)

    if (!error && data) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images/${data.path}`
      setFormData(prev => ({...prev, image_url: url}))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      excerpt: formData.excerpt || formData.content.substring(0, 200) + '...',
      published: true // Default to published
    }

    if (editing) {
      // Update existing
      await supabase
        .from("content")
        .update(postData)
        .eq("id", editing)
    } else {
      // Create new
      await supabase
        .from("content")
        .insert([postData])
    }

    setShowEditor(false)
    setEditing(null)
    setFormData({
      title: '',
      content: '',
      type: 'essay',
      premium: false,
      image_url: '',
      video_url: '',
      tags: '',
      excerpt: ''
    })
    
    fetchPosts()
  }

  const togglePublish = async (id: string, published: boolean) => {
    await supabase
      .from("content")
      .update({ published: !published })
      .eq("id", id)
    fetchPosts()
  }

  const deletePost = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from("content").delete().eq("id", id)
      fetchPosts()
    }
  }

  const startEdit = (post: ContentPost) => {
    setEditing(post.id)
    setFormData({
      title: post.title,
      content: post.content,
      type: post.type,
      premium: post.premium,
      image_url: post.image_url || '',
      video_url: post.video_url || '',
      tags: post.tags?.join(', ') || '',
      excerpt: post.excerpt || ''
    })
    setShowEditor(true)
  }

  if (loading) return <div className="p-8"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" /></div>

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
            <p className="text-slate-600">Create, edit, and manage your premium content</p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Content
          </button>
        </div>

        {/* Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editing ? 'Edit Content' : 'Create New Content'}
                </h2>
                <button onClick={() => {
                  setShowEditor(false)
                  setEditing(null)
                }} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as FormData['type']})}
                        className="w-full px-4 py-3 border rounded-lg"
                      >
                        <option value="essay">Essay</option>
                        <option value="guide">Guide</option>
                        <option value="video">Video</option>
                        <option value="framework">Framework</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.premium}
                          onChange={(e) => setFormData({...formData, premium: e.target.checked})}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="flex items-center gap-1">
                          <Lock className="w-4 h-4" /> Premium Content
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg"
                        placeholder="systems, product, growth"
                      />
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Featured Image</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        {formData.image_url ? (
                          <div className="space-y-3">
                            <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, image_url: ''})}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleUploadImage}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
                            >
                              <Upload className="w-4 h-4 inline mr-2" />
                              Upload Image
                            </button>
                            <p className="text-xs text-slate-500 mt-2">JPG, PNG up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Video URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.video_url}
                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content *</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={12}
                      className="w-full px-4 py-3 border rounded-lg font-mono text-sm"
                      placeholder="Write your content here... (Markdown supported)"
                      required
                    />
                    <div className="border rounded-lg p-4 overflow-y-auto">
                      <label className="block text-sm font-medium mb-2 text-slate-600">Preview</label>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{formData.content || '*Preview will appear here*'}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt (Optional)</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Brief summary for preview cards..."
                  />
                  <p className="text-sm text-slate-500 mt-1">If empty, first 200 characters will be used</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditor(false)
                      setEditing(null)
                    }}
                    className="px-6 py-3 border rounded-xl font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editing ? 'Update Content' : 'Publish Content'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold text-lg mb-4">Content Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Posts</span>
                  <span className="font-bold text-2xl">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Premium Content</span>
                  <span className="font-bold text-2xl text-amber-600">
                    {posts.filter(p => p.premium).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Published</span>
                  <span className="font-bold text-2xl text-emerald-600">
                    {posts.filter(p => p.published).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-semibold text-lg mb-3 text-emerald-800">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setFormData({
                      title: 'New Video Tutorial',
                      content: '# New Video\n\nAdd your content here...',
                      type: 'video',
                      premium: true,
                      image_url: '',
                      video_url: '',
                      tags: 'tutorial, video',
                      excerpt: ''
                    })
                    setShowEditor(true)
                  }}
                  className="w-full text-left p-3 bg-white/50 hover:bg-white rounded-lg border border-emerald-200 text-sm flex items-center gap-3"
                >
                  <Video className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-medium">Create Video Tutorial</div>
                    <div className="text-xs text-emerald-700">Premium template</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setFormData({
                      title: 'Free Guide Template',
                      content: '# Free Guide\n\nStart writing...',
                      type: 'guide',
                      premium: false,
                      image_url: '',
                      video_url: '',
                      tags: 'guide, free',
                      excerpt: ''
                    })
                    setShowEditor(true)
                  }}
                  className="w-full text-left p-3 bg-white/50 hover:bg-white rounded-lg border border-emerald-200 text-sm flex items-center gap-3"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-medium">Create Free Guide</div>
                    <div className="text-xs text-emerald-700">Lead magnet template</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">All Content</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-slate-100 rounded-full">
                      {posts.length} items
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y">
                {posts.map(post => (
                  <div key={post.id} className="p-6 hover:bg-slate-50/50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg truncate">{post.title}</h4>
                          <div className="flex items-center gap-2">
                            {post.premium && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs font-bold">
                                PREMIUM
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              post.published 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              {post.type}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt || post.content?.substring(0, 150) + '...'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {post.image_url && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" /> Has image
                            </span>
                          )}
                          {post.video_url && (
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" /> Has video
                            </span>
                          )}
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          {post.tags && post.tags.length > 0 && (
                            <span className="truncate">
                              {post.tags.slice(0, 2).map((tag: string) => `#${tag}`).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => startEdit(post)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => togglePublish(post.id, post.published)}
                          className={`p-2 hover:bg-slate-100 rounded-lg ${
                            post.published ? 'text-emerald-600' : 'text-slate-600'
                          }`}
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          {post.published ? <Globe className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {posts.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg">No content yet</p>
                  <p className="text-sm mt-1">Create your first piece of content to get started</p>
                  <button
                    onClick={() => setShowEditor(true)}
                    className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
                  >
                    Create First Content
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}