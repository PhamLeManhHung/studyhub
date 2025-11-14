import { useState, useEffect } from 'react'
import { Plus, FileText, Video, Link as LinkIcon, Image, BookOpen, X, Edit2, Trash2, Search, ExternalLink, Sparkles, Loader2 } from 'lucide-react'
import { summarizeVideo } from '../utils/aiService'

const ResourceHub = () => {
  const [resources, setResources] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'website',
    subject: '',
    description: '',
  })
  const [aiSummary, setAiSummary] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [summarizingResource, setSummarizingResource] = useState(null)

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'ICT', 'GCED', 'CLISE', 'Vietnamese Studies']
  const resourceTypes = [
    { value: 'youtube', label: 'YouTube Video', icon: Video },
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'website', label: 'Website', icon: LinkIcon },
  ]

  // Load resources from localStorage on mount
  useEffect(() => {
    const savedResources = localStorage.getItem('studyhub-resources')
    if (savedResources) {
      setResources(JSON.parse(savedResources))
    }
  }, [])

  // Save resources to localStorage whenever resources change
  useEffect(() => {
    localStorage.setItem('studyhub-resources', JSON.stringify(resources))
  }, [resources])

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    return null
  }

  // Get resource thumbnail
  const getResourceThumbnail = (resource) => {
    if (resource.type === 'youtube') {
      return getYouTubeThumbnail(resource.url)
    }
    if (resource.type === 'pdf') {
      return null // PDFs don't have thumbnails
    }
    // For websites, we could use a service like screenshot API, but for now return null
    return null
  }

  // Get resource icon
  const getResourceIcon = (type) => {
    switch (type) {
      case 'youtube':
        return Video
      case 'pdf':
        return FileText
      case 'website':
        return LinkIcon
      default:
        return LinkIcon
    }
  }

  // Get resource type color
  const getResourceTypeColor = (type) => {
    switch (type) {
      case 'youtube':
        return 'bg-red-100 text-red-600'
      case 'pdf':
        return 'bg-blue-100 text-blue-600'
      case 'website':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-cozy-100 text-cozy-600'
    }
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Auto-detect resource type from URL
  const handleUrlChange = (e) => {
    const url = e.target.value
    setFormData(prev => {
      let detectedType = 'website'
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        detectedType = 'youtube'
      } else if (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf')) {
        detectedType = 'pdf'
      }
      return {
        ...prev,
        url: url,
        type: prev.type || detectedType
      }
    })
  }

  // Open modal for adding new resource
  const handleAddResource = () => {
    setEditingResource(null)
    setFormData({
      title: '',
      url: '',
      type: 'website',
      subject: '',
      description: '',
    })
    setIsModalOpen(true)
  }

  // Open modal for editing resource
  const handleEditResource = (resource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      url: resource.url,
      type: resource.type,
      subject: resource.subject || '',
      description: resource.description || '',
    })
    setIsModalOpen(true)
  }

  // Save resource (add or update)
  const handleSaveResource = () => {
    if (!formData.title.trim() || !formData.url.trim()) return

    // Validate URL
    try {
      new URL(formData.url)
    } catch {
      alert('Please enter a valid URL')
      return
    }

    if (editingResource) {
      // Update existing resource
      setResources(resources.map(resource =>
        resource.id === editingResource.id
          ? {
              ...resource,
              title: formData.title,
              url: formData.url,
              type: formData.type,
              subject: formData.subject,
              description: formData.description,
              updatedAt: new Date().toISOString(),
            }
          : resource
      ))
    } else {
      // Add new resource
      const newResource = {
        id: Date.now().toString(),
        title: formData.title,
        url: formData.url,
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setResources([...resources, newResource])
    }

    setIsModalOpen(false)
    setEditingResource(null)
    setFormData({
      title: '',
      url: '',
      type: 'website',
      subject: '',
      description: '',
    })
  }

  // Delete resource
  const handleDeleteResource = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(resource => resource.id !== resourceId))
    }
  }

  // Filter resources based on search and subject
  const getFilteredResources = () => {
    let filtered = resources

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(resource => {
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.url.toLowerCase().includes(query) ||
          (resource.description && resource.description.toLowerCase().includes(query)) ||
          (resource.subject && resource.subject.toLowerCase().includes(query))
        )
      })
    }

    // Sort by most recent first
    return filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
  }

  // Get resource count by type
  const getResourceCountByType = (type) => {
    return resources.filter(r => r.type === type).length
  }

  // Get resource count by subject
  const getResourceCountBySubject = (subject) => {
    if (subject === 'all') return resources.length
    return resources.filter(r => r.subject === subject).length
  }

  // AI Summarize Video handler
  const handleAISummarize = async (resource) => {
    if (resource.type !== 'youtube') {
      alert('AI Summarize is only available for YouTube videos.')
      return
    }
    
    setSummarizingResource(resource)
    setAiLoading(true)
    try {
      const summary = await summarizeVideo(resource.url)
      setAiSummary({ resourceId: resource.id, summary })
    } catch (error) {
      alert('Error generating video summary. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const filteredResources = getFilteredResources()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Resource Hub</h1>
          <p className="text-cozy-600 mt-1">Organize and access your study materials.</p>
        </div>
        <button onClick={handleAddResource} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resourceTypes.map((type) => {
          const Icon = type.icon
          const count = getResourceCountByType(type.value)
          return (
            <div key={type.value} className="card-hover">
              <div className={`w-12 h-12 ${getResourceTypeColor(type.value)} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={24} />
              </div>
              <h3 className="font-display font-semibold text-cozy-900">{type.label}</h3>
              <p className="text-sm text-cozy-500 mt-1">{count} {count === 1 ? 'item' : 'items'}</p>
            </div>
          )
        })}
        <div className="card-hover">
          <div className="w-12 h-12 bg-cozy-100 rounded-xl flex items-center justify-center mb-3">
            <BookOpen size={24} className="text-cozy-600" />
          </div>
          <h3 className="font-display font-semibold text-cozy-900">Total</h3>
          <p className="text-sm text-cozy-500 mt-1">{resources.length} {resources.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-400"
            />
            <input
              type="text"
              placeholder="Search resources by title, URL, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={48} className="mx-auto text-cozy-300 mb-4" />
          <p className="text-cozy-600 text-lg mb-2">
            {resources.length === 0 ? 'No resources yet. Add your first resource!' : 'No resources match your search.'}
          </p>
          {resources.length === 0 && (
            <button onClick={handleAddResource} className="btn-primary mt-4">
              Add Your First Resource
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.type)
            const thumbnail = getResourceThumbnail(resource)
            return (
              <div key={resource.id} className="card-hover">
                {/* Thumbnail */}
                {thumbnail ? (
                  <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-cozy-100">
                    <img
                      src={thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className={`w-full h-40 mb-4 rounded-xl flex items-center justify-center ${getResourceTypeColor(resource.type)}`}>
                    <Icon size={48} />
                  </div>
                )}

                {/* Resource Info */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-display font-semibold text-cozy-900 truncate">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-cozy-500 mt-1">
                      {resource.subject || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="p-1 hover:bg-cozy-100 rounded text-cozy-600 hover:text-primary-600 transition-colors"
                      title="Edit resource"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="p-1 hover:bg-red-50 rounded text-cozy-600 hover:text-red-600 transition-colors"
                      title="Delete resource"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {resource.description && (
                  <p className="text-cozy-600 text-sm mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                )}

                {/* Resource Type Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
                    <Icon size={12} className="mr-1" />
                    {resourceTypes.find(t => t.value === resource.type)?.label || resource.type}
                  </span>
                  <span className="text-xs text-cozy-400">
                    {formatDate(resource.updatedAt || resource.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-cozy-200">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 flex items-center justify-center space-x-2 text-sm"
                  >
                    <ExternalLink size={16} />
                    <span>Open</span>
                  </a>
                  {resource.type === 'youtube' && (
                    <button
                      onClick={() => handleAISummarize(resource)}
                      disabled={aiLoading && summarizingResource?.id === resource.id}
                      className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50"
                      title="AI Summarize Video"
                    >
                      {aiLoading && summarizingResource?.id === resource.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span className="hidden sm:inline">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span className="hidden sm:inline">AI Summarize</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Subject Organization */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">By Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {subjects.map((subject) => {
            const count = getResourceCountBySubject(subject)
            return (
              <div
                key={subject}
                className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                  selectedSubject === subject
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-cozy-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
                onClick={() => setSelectedSubject(selectedSubject === subject ? 'all' : subject)}
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen size={16} className="text-primary-600" />
                </div>
                <p className="font-medium text-cozy-900">{subject}</p>
                <p className="text-sm text-cozy-500 mt-1">{count} {count === 1 ? 'resource' : 'resources'}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">
                {editingResource ? 'Edit Resource' : 'New Resource'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingResource(null)
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Resource Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter resource title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleUrlChange}
                  className="input-field"
                  placeholder="https://example.com or https://youtube.com/watch?v=..."
                  required
                />
                <p className="text-xs text-cozy-500 mt-1">
                  Resource type will be auto-detected from URL (YouTube, PDF, or Website)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Resource Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter a brief description (optional)"
                  rows="3"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingResource(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveResource}
                  className="btn-primary flex-1"
                  disabled={!formData.title.trim() || !formData.url.trim()}
                >
                  {editingResource ? 'Update Resource' : 'Add Resource'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {aiSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">Video Summary</h2>
              <button
                onClick={() => {
                  setAiSummary(null)
                  setSummarizingResource(null)
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="prose max-w-none text-cozy-700 whitespace-pre-wrap">
              {aiSummary.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResourceHub
