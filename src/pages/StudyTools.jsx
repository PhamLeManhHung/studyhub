import { Timer, BarChart3, FileText, Book, Music, Palette, Calculator, BookOpen, Sparkles } from 'lucide-react'

const StudyTools = () => {
  const tools = [
    { name: 'Pomodoro Timer', icon: Timer, description: 'Focus with timed study sessions', color: 'bg-red-100', iconColor: 'text-red-600' },
    { name: 'Word Counter', icon: BarChart3, description: 'Count words in your notes', color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { name: 'Text Summarizer', icon: FileText, description: 'AI-powered text summarization', color: 'bg-green-100', iconColor: 'text-green-600' },
    { name: 'Citation Generator', icon: Book, description: 'Generate citations easily', color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Study Music', icon: Music, description: 'Curated focus playlists', color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { name: 'Color Picker', icon: Palette, description: 'Choose colors for notes', color: 'bg-pink-100', iconColor: 'text-pink-600' },
    { name: 'Unit Converter', icon: Calculator, description: 'Convert between units', color: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { name: 'Calculator', icon: Calculator, description: 'Quick calculations', color: 'bg-cozy-100', iconColor: 'text-cozy-600' },
    { name: 'Dictionary', icon: BookOpen, description: 'Look up definitions', color: 'bg-teal-100', iconColor: 'text-teal-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-cozy-900">Study Tools</h1>
        <p className="text-cozy-600 mt-1">Helpful utilities to enhance your study sessions.</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <div key={index} className="card-hover">
              <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={24} className={tool.iconColor} />
              </div>
              <h3 className="text-lg font-display font-semibold text-cozy-900 mb-1">{tool.name}</h3>
              <p className="text-sm text-cozy-600 mb-4">{tool.description}</p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Open Tool →
              </button>
            </div>
          )
        })}
      </div>

      {/* Featured Tool */}
      <div className="card bg-gradient-to-r from-primary-500 to-blue-600 text-white">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Timer size={32} />
              <h2 className="text-2xl font-display font-bold">Pomodoro Timer</h2>
            </div>
            <p className="text-primary-100 mb-4">
              Boost productivity with the Pomodoro Technique. Work for 25 minutes, then take a 5-minute break.
            </p>
            <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
              Start Timer
            </button>
          </div>
          <div className="text-6xl opacity-20">⏱️</div>
        </div>
      </div>

      {/* AI Tools */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-purple-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-semibold text-cozy-900 mb-2">AI-Powered Tools</h3>
            <p className="text-cozy-700 mb-4">
              Coming soon: Advanced AI features including smart summaries, question generation, and personalized study recommendations.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="badge-primary">Text Summarizer</span>
              <span className="badge bg-pink-100 text-pink-700">Question Generator</span>
              <span className="badge bg-blue-100 text-blue-700">Study Planner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyTools
