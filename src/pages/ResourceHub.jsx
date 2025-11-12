import { Plus, FileText, Video, Link as LinkIcon, Image, BookOpen } from 'lucide-react'

const ResourceHub = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Resource Hub</h1>
          <p className="text-cozy-600 mt-1">Organize and access your study materials.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Documents', count: 12, icon: FileText, color: 'bg-blue-100', iconColor: 'text-blue-600' },
          { name: 'Videos', count: 8, icon: Video, color: 'bg-red-100', iconColor: 'text-red-600' },
          { name: 'Links', count: 24, icon: LinkIcon, color: 'bg-green-100', iconColor: 'text-green-600' },
          { name: 'Images', count: 15, icon: Image, color: 'bg-purple-100', iconColor: 'text-purple-600' },
        ].map((category, index) => {
          const Icon = category.icon
          return (
            <div key={index} className="card-hover">
              <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={24} className={category.iconColor} />
              </div>
              <h3 className="font-display font-semibold text-cozy-900">{category.name}</h3>
              <p className="text-sm text-cozy-500 mt-1">{category.count} items</p>
            </div>
          )
        })}
      </div>

      {/* Recent Resources */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Recent Resources</h2>
        <div className="space-y-3">
          {[
            { name: 'Calculus Textbook Chapter 3.pdf', type: 'Document', date: '2 days ago', size: '2.4 MB', icon: FileText },
            { name: 'Khan Academy - Algebra Basics', type: 'Video', date: '3 days ago', size: 'Link', icon: Video },
            { name: 'Periodic Table Reference.png', type: 'Image', date: '1 week ago', size: '1.2 MB', icon: Image },
            { name: 'Study Guide Template.docx', type: 'Document', date: '1 week ago', size: '856 KB', icon: FileText },
          ].map((resource, index) => {
            const Icon = resource.icon
            return (
              <div key={index} className="flex items-center justify-between p-4 border border-cozy-200 rounded-xl hover:bg-cozy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cozy-100 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-cozy-600" />
                  </div>
                  <div>
                    <p className="text-cozy-900 font-medium">{resource.name}</p>
                    <p className="text-sm text-cozy-500">{resource.type} • {resource.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-cozy-400">{resource.date}</span>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">Open</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Subject Organization */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">By Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Math', 'Science', 'History', 'English', 'Art', 'Music', 'Languages', 'Other'].map((subject) => (
            <div key={subject} className="p-4 border border-cozy-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                <BookOpen size={16} className="text-primary-600" />
              </div>
              <p className="font-medium text-cozy-900">{subject}</p>
              <p className="text-sm text-cozy-500 mt-1">5 resources</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResourceHub
