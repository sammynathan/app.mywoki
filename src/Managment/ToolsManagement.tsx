
import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { supabase } from "../lib/supabase"
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  BarChart3,
  CheckCircle,
  XCircle
} from "lucide-react"

const ALLOWED_EMBED_HOSTS = new Set([
  "docs.google.com",
  "notion.so",
  "notion.site",
  "www.youtube.com",
  "youtube.com",
  "player.vimeo.com",
  "loom.com",
  "share.loom.com"
])

const isAllowedEmbed = (url: string) => {
  try {
    const host = new URL(url).host
    return ALLOWED_EMBED_HOSTS.has(host)
  } catch {
    return false
  }
}

type MediaItem = {
  type: "video" | "embed" | "image"
  provider?: string
  title?: string
  url: string
  height?: number
  width?: number
  caption?: string
}

type ResourceLink = {
  label: string
  url: string
  kind?: string
}

type FaqItem = {
  question: string
  answer: string
}

type ConfigField = {
  key: string
  label: string
  type: "text" | "textarea" | "url" | "number" | "select" | "toggle"
  placeholder?: string
  required?: boolean
  options?: string[]
  help?: string
}

interface Tool {
  id: string
  name: string
  description: string
  long_description?: string
  category: string
  use_cases?: string[]
  who_its_for?: string[]
  features?: string[]
  setup_steps?: string[]
  faqs?: FaqItem[]
  media_items?: MediaItem[]
  resource_links?: ResourceLink[]
  config_fields?: ConfigField[]
  hero_image_url?: string
  tags?: string[]
  sort_order?: number
  is_active: boolean
  created_at: string
  usage_count: number
}

export default function ToolsManagement() {
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [newTool, setNewTool] = useState({
    name: "",
    description: "",
    long_description: "",
    category: "",
    use_cases: [] as string[],
    who_its_for: [] as string[],
    features: [] as string[],
    setup_steps: [] as string[],
    faqs: [] as FaqItem[],
    media_items: [] as MediaItem[],
    resource_links: [] as ResourceLink[],
    config_fields: [] as ConfigField[],
    hero_image_url: "",
    tags: [] as string[]
  })
  const [useCaseInput, setUseCaseInput] = useState("")
  const [audienceInput, setAudienceInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [stepInput, setStepInput] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [faqQuestionInput, setFaqQuestionInput] = useState("")
  const [faqAnswerInput, setFaqAnswerInput] = useState("")
  const [mediaTypeInput, setMediaTypeInput] = useState<MediaItem["type"]>("embed")
  const [mediaProviderInput, setMediaProviderInput] = useState("")
  const [mediaTitleInput, setMediaTitleInput] = useState("")
  const [mediaUrlInput, setMediaUrlInput] = useState("")
  const [mediaHeightInput, setMediaHeightInput] = useState("")
  const [resourceLabelInput, setResourceLabelInput] = useState("")
  const [resourceUrlInput, setResourceUrlInput] = useState("")
  const [resourceKindInput, setResourceKindInput] = useState("")
  const [configKeyInput, setConfigKeyInput] = useState("")
  const [configLabelInput, setConfigLabelInput] = useState("")
  const [configTypeInput, setConfigTypeInput] = useState<ConfigField["type"]>("text")
  const [configPlaceholderInput, setConfigPlaceholderInput] = useState("")
  const [configRequiredInput, setConfigRequiredInput] = useState(false)
  const [configOptionsInput, setConfigOptionsInput] = useState("")
  const [configHelpInput, setConfigHelpInput] = useState("")

  useEffect(() => {
    loadTools()
  }, [])

  useEffect(() => {
    filterTools()
  }, [tools, searchQuery])

  async function loadTools() {
    try {
      const { data: toolsData, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get usage counts for each tool
      const toolsWithUsage = await Promise.all(
        (toolsData || []).map(async (tool) => {
          const { count } = await supabase
            .from('user_tool_activations')
            .select('*', { count: 'exact', head: true })
            .eq('tool_id', tool.id)
            .eq('is_active', true)

          return {
            ...tool,
            usage_count: count || 0
          }
        })
      )

      setTools(toolsWithUsage)
      setFilteredTools(toolsWithUsage)
    } catch (error) {
      console.error('Error loading tools:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterTools() {
    if (!searchQuery.trim()) {
      setFilteredTools(tools)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    )

    setFilteredTools(filtered)
  }

  const handleAddUseCase = () => {
    if (useCaseInput.trim()) {
      setNewTool({
        ...newTool,
        use_cases: [...newTool.use_cases, useCaseInput.trim()]
      })
      setUseCaseInput("")
    }
  }

  const handleAddAudience = () => {
    if (audienceInput.trim()) {
      setNewTool({
        ...newTool,
        who_its_for: [...newTool.who_its_for, audienceInput.trim()]
      })
      setAudienceInput("")
    }
  }

  const removeUseCase = (index: number) => {
    setNewTool({
      ...newTool,
      use_cases: newTool.use_cases.filter((_, i) => i !== index)
    })
  }

  const removeAudience = (index: number) => {
    setNewTool({
      ...newTool,
      who_its_for: newTool.who_its_for.filter((_, i) => i !== index)
    })
  }

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setNewTool({
        ...newTool,
        features: [...newTool.features, featureInput.trim()]
      })
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    setNewTool({
      ...newTool,
      features: newTool.features.filter((_, i) => i !== index)
    })
  }

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setNewTool({
        ...newTool,
        setup_steps: [...newTool.setup_steps, stepInput.trim()]
      })
      setStepInput("")
    }
  }

  const removeStep = (index: number) => {
    setNewTool({
      ...newTool,
      setup_steps: newTool.setup_steps.filter((_, i) => i !== index)
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewTool({
        ...newTool,
        tags: [...newTool.tags, tagInput.trim()]
      })
      setTagInput("")
    }
  }

  const removeTag = (index: number) => {
    setNewTool({
      ...newTool,
      tags: newTool.tags.filter((_, i) => i !== index)
    })
  }

  const handleAddFaq = () => {
    if (faqQuestionInput.trim() && faqAnswerInput.trim()) {
      setNewTool({
        ...newTool,
        faqs: [
          ...newTool.faqs,
          { question: faqQuestionInput.trim(), answer: faqAnswerInput.trim() }
        ]
      })
      setFaqQuestionInput("")
      setFaqAnswerInput("")
    }
  }

  const removeFaq = (index: number) => {
    setNewTool({
      ...newTool,
      faqs: newTool.faqs.filter((_, i) => i !== index)
    })
  }

  const handleAddMediaItem = () => {
    if (!mediaUrlInput.trim()) return
    const height = Number(mediaHeightInput)
    const nextItem: MediaItem = {
      type: mediaTypeInput,
      provider: mediaProviderInput.trim() || undefined,
      title: mediaTitleInput.trim() || undefined,
      url: mediaUrlInput.trim(),
      height: Number.isFinite(height) && height > 0 ? height : undefined
    }
    setNewTool({
      ...newTool,
      media_items: [...newTool.media_items, nextItem]
    })
    setMediaTypeInput("embed")
    setMediaProviderInput("")
    setMediaTitleInput("")
    setMediaUrlInput("")
    setMediaHeightInput("")
  }

  const removeMediaItem = (index: number) => {
    setNewTool({
      ...newTool,
      media_items: newTool.media_items.filter((_, i) => i !== index)
    })
  }

  const handleAddResourceLink = () => {
    if (!resourceLabelInput.trim() || !resourceUrlInput.trim()) return
    const nextLink: ResourceLink = {
      label: resourceLabelInput.trim(),
      url: resourceUrlInput.trim(),
      kind: resourceKindInput.trim() || undefined
    }
    setNewTool({
      ...newTool,
      resource_links: [...newTool.resource_links, nextLink]
    })
    setResourceLabelInput("")
    setResourceUrlInput("")
    setResourceKindInput("")
  }

  const removeResourceLink = (index: number) => {
    setNewTool({
      ...newTool,
      resource_links: newTool.resource_links.filter((_, i) => i !== index)
    })
  }

  const handleAddConfigField = () => {
    if (!configKeyInput.trim() || !configLabelInput.trim()) return
    const options = configOptionsInput
      .split(',')
      .map(option => option.trim())
      .filter(Boolean)

    const nextField: ConfigField = {
      key: configKeyInput.trim(),
      label: configLabelInput.trim(),
      type: configTypeInput,
      placeholder: configPlaceholderInput.trim() || undefined,
      required: configRequiredInput || undefined,
      options: options.length > 0 ? options : undefined,
      help: configHelpInput.trim() || undefined
    }

    setNewTool({
      ...newTool,
      config_fields: [...newTool.config_fields, nextField]
    })

    setConfigKeyInput("")
    setConfigLabelInput("")
    setConfigTypeInput("text")
    setConfigPlaceholderInput("")
    setConfigRequiredInput(false)
    setConfigOptionsInput("")
    setConfigHelpInput("")
  }

  const removeConfigField = (index: number) => {
    setNewTool({
      ...newTool,
      config_fields: newTool.config_fields.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async () => {
    try {
      if (editingTool) {
        // Update existing tool
        await supabase
          .from('tools')
          .update(newTool)
          .eq('id', editingTool.id)
      } else {
        // Add new tool
        await supabase
          .from('tools')
          .insert([newTool])
      }

      // Reset form and reload
      setNewTool({
        name: "",
        description: "",
        long_description: "",
        category: "",
        use_cases: [],
        who_its_for: [],
        features: [],
        setup_steps: [],
        faqs: [],
        media_items: [],
        resource_links: [],
        config_fields: [],
        hero_image_url: "",
        tags: []
      })
      setEditingTool(null)
      setShowAddModal(false)
      loadTools()
    } catch (error) {
      console.error('Error saving tool:', error)
    }
  }

  const toggleToolStatus = async (toolId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('tools')
        .update({ is_active: !currentStatus })
        .eq('id', toolId)

      loadTools()
    } catch (error) {
      console.error('Error toggling tool status:', error)
    }
  }

  const deleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return
    }

    try {
      await supabase
        .from('tools')
        .delete()
        .eq('id', toolId)

      loadTools()
    } catch (error) {
      console.error('Error deleting tool:', error)
    }
  }

  const editTool = (tool: Tool) => {
    setEditingTool(tool)
    setNewTool({
      name: tool.name,
      description: tool.description,
      long_description: tool.long_description || "",
      category: tool.category,
      use_cases: tool.use_cases || [],
      who_its_for: tool.who_its_for || [],
      features: tool.features || [],
      setup_steps: tool.setup_steps || [],
      faqs: tool.faqs || [],
      media_items: tool.media_items || [],
      resource_links: tool.resource_links || [],
      config_fields: tool.config_fields || [],
      hero_image_url: tool.hero_image_url || "",
      tags: tool.tags || []
    })
    setShowAddModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tools Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add, edit, and manage available tools
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Tool
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Tools Grid */}
      {loading ? (
        <div className="text-center py-8 flex flex-col items-center gap-3">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading tools...</p>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No tools found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="p-6 bg-white dark:bg-gray-900">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tool.is_active
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {tool.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {tool.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => editTool(tool)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteTool(tool.id)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BarChart3 className="w-4 h-4" />
                    {tool.usage_count} active users
                  </div>
                  <Button
                    size="sm"
                    variant={tool.is_active ? "outline" : "default"}
                    onClick={() => toggleToolStatus(tool.id, tool.is_active)}
                  >
                    {tool.is_active ? (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingTool ? 'Edit Tool' : 'Add New Tool'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingTool(null)
                    setNewTool({
                      name: "",
                      description: "",
                      long_description: "",
                      category: "",
                      use_cases: [],
                      who_its_for: [],
                      features: [],
                      setup_steps: [],
                      faqs: [],
                      media_items: [],
                      resource_links: [],
                      config_fields: [],
                      hero_image_url: "",
                      tags: []
                    })
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tool Name
                  </label>
                  <Input
                    value={newTool.name}
                    onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                    placeholder="Enter tool name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Input
                    value={newTool.category}
                    onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                    placeholder="e.g., Analytics, Development, Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <Input
                    value={newTool.description}
                    onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                    placeholder="Brief description of the tool"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Long Description
                  </label>
                  <Textarea
                    value={newTool.long_description}
                    onChange={(e) => setNewTool({ ...newTool, long_description: e.target.value })}
                    placeholder="Detailed description of what the tool does"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hero Image URL
                  </label>
                  <Input
                    value={newTool.hero_image_url}
                    onChange={(e) => setNewTool({ ...newTool, hero_image_url: e.target.value })}
                    placeholder="https://example.com/preview.png"
                  />
                  {newTool.hero_image_url?.trim() && (
                    <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                      <img
                        src={newTool.hero_image_url}
                        alt="Hero preview"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Use Cases
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={useCaseInput}
                      onChange={(e) => setUseCaseInput(e.target.value)}
                      placeholder="Add a use case"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddUseCase()}
                    />
                    <Button type="button" onClick={handleAddUseCase}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newTool.use_cases.map((useCase, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-sm"
                      >
                        {useCase}
                        <button
                          type="button"
                          onClick={() => removeUseCase(index)}
                          className="hover:text-emerald-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    />
                    <Button type="button" onClick={handleAddFeature}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newTool.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="hover:text-emerald-900"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Setup Steps
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={stepInput}
                      onChange={(e) => setStepInput(e.target.value)}
                      placeholder="Add a setup step"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                    />
                    <Button type="button" onClick={handleAddStep}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newTool.setup_steps.map((step, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm"
                      >
                        {step}
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="hover:text-blue-900"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={audienceInput}
                      onChange={(e) => setAudienceInput(e.target.value)}
                      placeholder="Add target audience"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAudience()}
                    />
                    <Button type="button" onClick={handleAddAudience}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newTool.who_its_for.map((audience, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm"
                      >
                        {audience}
                        <button
                          type="button"
                          onClick={() => removeAudience(index)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newTool.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:text-gray-900"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    FAQs
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <Input
                      value={faqQuestionInput}
                      onChange={(e) => setFaqQuestionInput(e.target.value)}
                      placeholder="FAQ question"
                    />
                    <Input
                      value={faqAnswerInput}
                      onChange={(e) => setFaqAnswerInput(e.target.value)}
                      placeholder="FAQ answer"
                    />
                  </div>
                  <Button type="button" onClick={handleAddFaq}>
                    Add FAQ
                  </Button>
                  <div className="mt-3 space-y-2">
                    {newTool.faqs.map((faq, index) => (
                      <div key={index} className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{faq.question}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{faq.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Media Items
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <select
                      value={mediaTypeInput}
                      onChange={(e) => setMediaTypeInput(e.target.value as MediaItem["type"])}
                      className="h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm"
                    >
                      <option value="embed">Embed</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                    </select>
                    <Input
                      value={mediaProviderInput}
                      onChange={(e) => setMediaProviderInput(e.target.value)}
                      placeholder="Provider (optional)"
                    />
                    <Input
                      value={mediaTitleInput}
                      onChange={(e) => setMediaTitleInput(e.target.value)}
                      placeholder="Title (optional)"
                    />
                    <Input
                      value={mediaUrlInput}
                      onChange={(e) => setMediaUrlInput(e.target.value)}
                      placeholder="Media URL"
                    />
                    <Input
                      value={mediaHeightInput}
                      onChange={(e) => setMediaHeightInput(e.target.value)}
                      placeholder="Height (optional)"
                    />
                  </div>
                  <Button type="button" onClick={handleAddMediaItem}>
                    Add Media Item
                  </Button>
                  <div className="mt-3 space-y-2">
                    {newTool.media_items.map((item, index) => (
                      <div key={index} className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.title || item.url}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.type} {item.provider ? `- ${item.provider}` : ""}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMediaItem(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-900">
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              alt={item.title || "Media preview"}
                              className="w-full h-auto object-cover"
                              loading="lazy"
                            />
                          ) : isAllowedEmbed(item.url) ? (
                            <iframe
                              src={item.url}
                              title={item.title || "Media preview"}
                              width="100%"
                              height={item.height && item.height > 0 ? item.height : 360}
                              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                              className="w-full"
                              loading="lazy"
                            />
                          ) : (
                            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                              Preview not available for this URL.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resource Links
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <Input
                      value={resourceLabelInput}
                      onChange={(e) => setResourceLabelInput(e.target.value)}
                      placeholder="Label"
                    />
                    <Input
                      value={resourceKindInput}
                      onChange={(e) => setResourceKindInput(e.target.value)}
                      placeholder="Kind (docs, template, guide)"
                    />
                    <Input
                      value={resourceUrlInput}
                      onChange={(e) => setResourceUrlInput(e.target.value)}
                      placeholder="URL"
                    />
                  </div>
                  <Button type="button" onClick={handleAddResourceLink}>
                    Add Resource Link
                  </Button>
                  <div className="mt-3 space-y-2">
                    {newTool.resource_links.map((link, index) => (
                      <div key={index} className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{link.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{link.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeResourceLink(index)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Configuration Fields
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <Input
                      value={configKeyInput}
                      onChange={(e) => setConfigKeyInput(e.target.value)}
                      placeholder="Key (e.g., api_key)"
                    />
                    <Input
                      value={configLabelInput}
                      onChange={(e) => setConfigLabelInput(e.target.value)}
                      placeholder="Label (e.g., API Key)"
                    />
                    <select
                      value={configTypeInput}
                      onChange={(e) => setConfigTypeInput(e.target.value as ConfigField["type"])}
                      className="h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="url">URL</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                      <option value="toggle">Toggle</option>
                    </select>
                    <Input
                      value={configPlaceholderInput}
                      onChange={(e) => setConfigPlaceholderInput(e.target.value)}
                      placeholder="Placeholder (optional)"
                    />
                    <Input
                      value={configOptionsInput}
                      onChange={(e) => setConfigOptionsInput(e.target.value)}
                      placeholder="Options (comma separated)"
                    />
                    <Input
                      value={configHelpInput}
                      onChange={(e) => setConfigHelpInput(e.target.value)}
                      placeholder="Help text (optional)"
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={configRequiredInput}
                        onChange={(e) => setConfigRequiredInput(e.target.checked)}
                      />
                      Required
                    </label>
                  </div>
                  <Button type="button" onClick={handleAddConfigField}>
                    Add Config Field
                  </Button>
                  <div className="mt-3 space-y-2">
                    {newTool.config_fields.map((field, index) => (
                      <div key={index} className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {field.label} ({field.key})
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {field.type}{field.required ? " - required" : ""}{field.options?.length ? ` - options: ${field.options.join(", ")}` : ""}
                          </p>
                          {field.help && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {field.help}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeConfigField(index)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingTool(null)
                    setNewTool({
                      name: "",
                      description: "",
                      long_description: "",
                      category: "",
                      use_cases: [],
                      who_its_for: [],
                      features: [],
                      setup_steps: [],
                      faqs: [],
                      media_items: [],
                      resource_links: [],
                      config_fields: [],
                      hero_image_url: "",
                      tags: []
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingTool ? 'Update Tool' : 'Add Tool'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
