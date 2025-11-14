import { useState, useEffect } from 'react'
import { Plus, Search, FileText, X, Edit2, Trash2, Tag, Sparkles, Lightbulb, BookOpen, Hash, Loader2 } from 'lucide-react'
import { summarizeText, explainText, generateQuestions, extractKeyPoints } from '../utils/aiService'

const SmartNotes = () => {
  const [notes, setNotes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tags: [],
    highlights: [],
  })
  const [newTag, setNewTag] = useState('')
  const [highlightText, setHighlightText] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiType, setAiType] = useState(null)

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'ICT', 'GCED', 'CLISE', 'Vietnamese Studies']

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('studyhub-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('studyhub-notes', JSON.stringify(notes))
  }, [notes])

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

  // Get preview text from content
  const getPreview = (content) => {
    if (!content) return 'No content'
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText
  }

  // Filter notes based on search and subject
  const getFilteredNotes = () => {
    let filtered = notes

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === selectedSubject)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(note => {
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query)) ||
          note.subject.toLowerCase().includes(query)
        )
      })
    }

    // Sort by most recent first
    return filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Add highlight
  const handleAddHighlight = () => {
    if (highlightText.trim() && !formData.highlights.includes(highlightText.trim())) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightText.trim()]
      }))
      setHighlightText('')
    }
  }

  // Remove highlight
  const handleRemoveHighlight = (highlightToRemove) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(highlight => highlight !== highlightToRemove)
    }))
  }

  // Open modal for adding new note
  const handleAddNote = () => {
    setEditingNote(null)
    setFormData({
      title: '',
      content: '',
      subject: '',
      tags: [],
      highlights: [],
    })
    setIsModalOpen(true)
  }

  // Open modal for editing note
  const handleEditNote = (note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      subject: note.subject || '',
      tags: note.tags || [],
      highlights: note.highlights || [],
    })
    setIsModalOpen(true)
  }

  // Save note (add or update)
  const handleSaveNote = () => {
    if (!formData.title.trim()) return

    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note =>
        note.id === editingNote.id
          ? {
              ...note,
              title: formData.title,
              content: formData.content,
              subject: formData.subject,
              tags: formData.tags,
              highlights: formData.highlights,
              updatedAt: new Date().toISOString(),
            }
          : note
      ))
    } else {
      // Add new note
      const newNote = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        subject: formData.subject,
        tags: formData.tags,
        highlights: formData.highlights,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNotes([...notes, newNote])
    }

    setIsModalOpen(false)
    setEditingNote(null)
    setFormData({
      title: '',
      content: '',
      subject: '',
      tags: [],
      highlights: [],
    })
  }

  // Delete note
  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
      }
    }
  }

  // Open note view
  const handleOpenNote = (note) => {
    setSelectedNote(note)
  }

  // Close note view
  const handleCloseNote = () => {
    setSelectedNote(null)
    setAiResult(null)
    setAiType(null)
  }

  // AI Feature handlers
  const handleSummarizeNote = async (note) => {
    if (!note.content) {
      alert('This note has no content to summarize.')
      return
    }
    setAiLoading(true)
    setAiType('summarize')
    try {
      const result = await summarizeText(note.content)
      setAiResult(result)
    } catch (error) {
      alert('Error generating summary. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleExplainNote = async (note) => {
    if (!note.content) {
      alert('This note has no content to explain.')
      return
    }
    setAiLoading(true)
    setAiType('explain')
    try {
      const result = await explainText(note.content)
      setAiResult(result)
    } catch (error) {
      alert('Error generating explanation. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleGenerateQuestions = async (note) => {
    if (!note.content) {
      alert('This note has no content to generate questions from.')
      return
    }
    setAiLoading(true)
    setAiType('questions')
    try {
      const result = await generateQuestions(note.content)
      setAiResult(result)
    } catch (error) {
      alert('Error generating questions. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleKeyPoints = async (note) => {
    if (!note.content) {
      alert('This note has no content to extract key points from.')
      return
    }
    setAiLoading(true)
    setAiType('keypoints')
    try {
      const result = await extractKeyPoints(note.content)
      setAiResult(result)
    } catch (error) {
      alert('Error extracting key points. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCloseAIResult = () => {
    setAiResult(null)
    setAiType(null)
  }

  // Highlight content with highlights
  const highlightContent = (content, highlights) => {
    if (!content) return ''
    
    // Escape HTML in content first to prevent XSS, but preserve newlines
    let escapedContent = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
    
    // Convert newlines to <br> for display
    escapedContent = escapedContent.replace(/\n/g, '<br>')
    
    // If no highlights, return escaped content
    if (!highlights || highlights.length === 0) {
      return escapedContent
    }
    
    // Apply highlights (escape HTML in highlight text first)
    let highlightedContent = escapedContent
    highlights.forEach(highlight => {
      // Escape HTML in highlight
      const escapedHighlight = highlight
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
      
      // Escape special regex characters
      const regexEscapedHighlight = escapedHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(${regexEscapedHighlight})`, 'gi')
      highlightedContent = highlightedContent.replace(regex, '<mark class="bg-yellow-200 px-1 rounded font-medium">$1</mark>')
    })
    
    return highlightedContent
  }

  const filteredNotes = getFilteredNotes()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Smart Notes</h1>
          <p className="text-cozy-600 mt-1">AI-powered note-taking with smart organization.</p>
        </div>
        <button onClick={handleAddNote} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Note</span>
        </button>
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
              placeholder="Search notes by title, content, tags, or subject..."
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

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-cozy-300 mb-4" />
          <p className="text-cozy-600 text-lg mb-2">
            {notes.length === 0 ? 'No notes yet. Create your first note!' : 'No notes match your search.'}
          </p>
          {notes.length === 0 && (
            <button onClick={handleAddNote} className="btn-primary mt-4">
              Create Your First Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-display font-semibold text-cozy-900 truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-cozy-500 mt-1">{note.subject || 'Uncategorized'}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <FileText size={20} className="text-primary-600" />
                </div>
              </div>
              <p className="text-cozy-600 text-sm mb-3 line-clamp-2">
                {getPreview(note.content)}
              </p>
              
              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                    >
                      <Hash size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-cozy-500">+{note.tags.length - 3} more</span>
                  )}
                </div>
              )}

              {/* Highlights indicator */}
              {note.highlights && note.highlights.length > 0 && (
                <div className="flex items-center space-x-1 mb-3">
                  <Lightbulb size={14} className="text-yellow-600" />
                  <span className="text-xs text-cozy-500">
                    {note.highlights.length} highlight{note.highlights.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
                <span className="text-xs text-cozy-400">
                  {formatDate(note.updatedAt || note.createdAt)}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-1 hover:bg-cozy-100 rounded text-cozy-600 hover:text-primary-600 transition-colors"
                    title="Edit note"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 hover:bg-red-50 rounded text-cozy-600 hover:text-red-600 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenNote(note)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Open →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note View Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Note Header */}
            <div className="p-6 border-b border-cozy-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">
                    {selectedNote.title}
                  </h2>
                  <p className="text-sm text-cozy-500">
                    {selectedNote.subject || 'Uncategorized'} • {formatDate(selectedNote.updatedAt || selectedNote.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      handleEditNote(selectedNote)
                      setSelectedNote(null)
                    }}
                    className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-primary-600 transition-colors"
                    title="Edit note"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteNote(selectedNote.id)
                      setSelectedNote(null)
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg text-cozy-600 hover:text-red-600 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={handleCloseNote}
                    className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {selectedNote.tags && selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedNote.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                    >
                      <Hash size={14} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* AI Features */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSummarizeNote(selectedNote)}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <Sparkles size={16} />
                  <span>Summarize</span>
                </button>
                <button
                  onClick={() => handleExplainNote(selectedNote)}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <Lightbulb size={16} />
                  <span>Explain This</span>
                </button>
                <button
                  onClick={() => handleGenerateQuestions(selectedNote)}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <BookOpen size={16} />
                  <span>Generate Questions</span>
                </button>
                <button
                  onClick={() => handleKeyPoints(selectedNote)}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <Sparkles size={16} />
                  <span>Key Points</span>
                </button>
              </div>
            </div>

            {/* Note Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-cozy-50 rounded-xl">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="text-primary-600 animate-spin mb-4" />
                  <p className="text-cozy-600">AI is processing your request...</p>
                </div>
              ) : aiResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-cozy-900">AI Result</h3>
                    <button
                      onClick={handleCloseAIResult}
                      className="btn-secondary text-sm"
                    >
                      Close
                    </button>
                  </div>
                  <div className="prose max-w-none text-cozy-700 break-words leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-cozy-200">
                    {aiResult}
                  </div>
                  <div className="border-t border-cozy-200 pt-4">
                    <h4 className="font-semibold text-cozy-900 mb-2">Original Note:</h4>
                    <div
                      className="prose max-w-none text-cozy-700 break-words leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlightContent(
                          selectedNote.content,
                          selectedNote.highlights
                        )
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="prose max-w-none text-cozy-700 break-words leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightContent(
                      selectedNote.content,
                      selectedNote.highlights
                    )
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingNote(null)
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Note Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter note title"
                  required
                />
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
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Write your note content here..."
                  rows="10"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                    >
                      <Hash size={14} className="mr-1" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="input-field flex-1"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    onClick={handleAddTag}
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <Tag size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Highlights
                  <span className="text-xs text-cozy-500 ml-2">
                    (Keywords or phrases to highlight in your note)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                    >
                      <Lightbulb size={14} className="mr-1" />
                      {highlight}
                      <button
                        onClick={() => handleRemoveHighlight(highlight)}
                        className="ml-2 hover:text-yellow-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={highlightText}
                    onChange={(e) => setHighlightText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                    className="input-field flex-1"
                    placeholder="Add a highlight keyword and press Enter"
                  />
                  <button
                    onClick={handleAddHighlight}
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <Lightbulb size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingNote(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="btn-primary flex-1"
                  disabled={!formData.title.trim() || !formData.content.trim()}
                >
                  {editingNote ? 'Update Note' : 'Create Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Features Banner */}
      <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
        <div className="flex items-center space-x-4 flex-col sm:flex-row">
          <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} className="text-primary-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-semibold text-cozy-900">AI-Powered Features</h3>
            <p className="text-cozy-600 text-sm mt-1">
              Get automatic summaries, key points extraction, and smart suggestions for your notes.
            </p>
          </div>
          <button className="btn-primary">Try AI Features</button>
        </div>
      </div>
    </div>
  )
}

export default SmartNotes
