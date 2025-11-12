import { Plus, CreditCard, Play, TrendingUp } from 'lucide-react'

const Flashcards = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Flashcards</h1>
          <p className="text-cozy-600 mt-1">Create and study with interactive flashcards.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Set</span>
        </button>
      </div>

      {/* Study Session Preview */}
      <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">Continue Studying</h2>
            <p className="text-blue-100">Biology Terms - 15 cards remaining</p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2">
            <Play size={20} />
            <span>Study Now</span>
          </button>
        </div>
      </div>

      {/* Flashcard Sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Biology Terms', count: 48, progress: 65, subject: 'Science' },
          { title: 'Spanish Vocabulary', count: 32, progress: 40, subject: 'Language' },
          { title: 'History Dates', count: 25, progress: 80, subject: 'History' },
          { title: 'Math Formulas', count: 18, progress: 90, subject: 'Math' },
          { title: 'Chemistry Elements', count: 56, progress: 30, subject: 'Science' },
          { title: 'Literature Terms', count: 22, progress: 55, subject: 'English' },
        ].map((set, index) => (
          <div key={index} className="card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-display font-semibold text-cozy-900">{set.title}</h3>
                <p className="text-sm text-cozy-500 mt-1">{set.subject}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-cozy-600 font-medium">Progress</span>
                <span className="text-cozy-900 font-semibold">{set.progress}%</span>
              </div>
              <div className="w-full bg-cozy-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${set.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
              <span className="text-sm text-cozy-500">{set.count} cards</span>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                <span>Study</span>
                <TrendingUp size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Study Tips */}
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-cozy-900 mb-1">Study Tip</h3>
            <p className="text-cozy-700">
              Use spaced repetition! Review cards you struggle with more frequently to improve retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcards
