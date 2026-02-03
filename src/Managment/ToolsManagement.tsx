
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

interface Tool {
  id: string
  name: string
  description: string
  long_description?: string
  category: string
  use_cases?: string[]
  who_its_for?: string[]
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
    who_its_for: [] as string[]
  })
  const [useCaseInput, setUseCaseInput] = useState("")
  const [audienceInput, setAudienceInput] = useState("")

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
        who_its_for: []
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
      who_its_for: tool.who_its_for || []
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
                      who_its_for: []
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
                      who_its_for: []
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
