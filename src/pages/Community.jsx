import { Plus, Users, MessageCircle, BookOpen, User, Clock, ArrowRight, FileText } from 'lucide-react'

const Community = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Community</h1>
          <p className="text-cozy-600 mt-1">Connect with other students and share knowledge.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Post</span>
        </button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users size={32} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">1,234</p>
          <p className="text-cozy-600 mt-1">Active Members</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle size={32} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">456</p>
          <p className="text-cozy-600 mt-1">Discussions</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BookOpen size={32} className="text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">89</p>
          <p className="text-cozy-600 mt-1">Study Groups</p>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Recent Discussions</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Best study techniques for math?',
              author: 'Alex',
              time: '2 hours ago',
              replies: 12,
              category: 'Study Tips',
            },
            {
              title: 'Looking for a study group - Biology',
              author: 'Sam',
              time: '5 hours ago',
              replies: 5,
              category: 'Study Groups',
            },
            {
              title: 'Flashcard sharing: History dates',
              author: 'Jordan',
              time: '1 day ago',
              replies: 8,
              category: 'Resources',
            },
            {
              title: 'Pomodoro technique results?',
              author: 'Taylor',
              time: '2 days ago',
              replies: 15,
              category: 'Study Tips',
            },
          ].map((post, index) => (
            <div key={index} className="p-4 border border-cozy-200 rounded-xl hover:bg-cozy-50 cursor-pointer transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="badge-primary">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-cozy-900 mb-2">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-cozy-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>by {post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{post.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={14} />
                      <span>{post.replies} replies</span>
                    </div>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700 ml-4 flex items-center space-x-1">
                  <span>View</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Groups */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Popular Study Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Math Study Group', members: 45, subject: 'Mathematics' },
            { name: 'Science Enthusiasts', members: 32, subject: 'Science' },
            { name: 'History Buffs', members: 28, subject: 'History' },
            { name: 'Language Learners', members: 56, subject: 'Languages' },
          ].map((group, index) => (
            <div key={index} className="card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-cozy-900 mb-1">{group.name}</h3>
                  <p className="text-sm text-cozy-500">{group.subject}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-primary-600" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
                <span className="text-sm text-cozy-600">{group.members} members</span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                  <span>Join</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-primary-700" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-cozy-900 mb-2">Community Guidelines</h3>
            <ul className="text-cozy-700 space-y-1 text-sm">
              <li>• Be respectful and supportive of other members</li>
              <li>• Share helpful resources and study tips</li>
              <li>• Keep discussions focused on learning and studying</li>
              <li>• Report any inappropriate content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community
