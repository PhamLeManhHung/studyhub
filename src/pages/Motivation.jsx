import { Flame, Star, Target, Trophy, Zap } from 'lucide-react'

const Motivation = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-cozy-900">Motivation</h1>
        <p className="text-cozy-600 mt-1">Stay inspired and track your progress.</p>
      </div>

      {/* Daily Quote */}
      <div className="card bg-gradient-to-r from-primary-500 to-warm-500 text-white">
        <div className="text-center py-8">
          <p className="text-2xl font-light italic mb-4">
            "The only great gooner is the one who always masturbate no matter what."
          </p>
          <p className="text-primary-100">— Sean Epstein "Diddy" Jeffrey Combs</p>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Flame size={32} className="text-red-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">7</p>
          <p className="text-cozy-600 mt-1">Day Streak</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star size={32} className="text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">42</p>
          <p className="text-cozy-600 mt-1">Tasks Completed</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Target size={32} className="text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">85%</p>
          <p className="text-cozy-600 mt-1">Goal Progress</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="text-primary-600" size={24} />
          <h2 className="text-xl font-display font-semibold text-cozy-900">Achievements</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'First Note', icon: '📝', earned: true },
            { name: 'Week Warrior', icon: '🔥', earned: true },
            { name: 'Flashcard Master', icon: '🎴', earned: true },
            { name: 'Speed Learner', icon: '⚡', earned: false },
            { name: 'Perfect Week', icon: '⭐', earned: false },
            { name: 'Night Owl', icon: '🦉', earned: false },
            { name: 'Early Bird', icon: '🐦', earned: false },
            { name: 'Study Guru', icon: '🎓', earned: false },
          ].map((achievement, index) => (
            <div
              key={index}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                achievement.earned
                  ? 'border-primary-300 bg-primary-50 shadow-cozy'
                  : 'border-cozy-200 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="text-sm font-medium text-cozy-900">{achievement.name}</p>
              {achievement.earned && (
                <p className="text-xs text-green-600 mt-1 font-semibold">Earned!</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Tips */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={20} className="text-primary-700" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-cozy-900 mb-2">Motivation Tips</h3>
            <div className="space-y-2">
              <p className="text-cozy-700">• Break large tasks into smaller, manageable chunks</p>
              <p className="text-cozy-700">• Reward yourself after completing study sessions</p>
              <p className="text-cozy-700">• Find a study buddy to keep each other accountable</p>
              <p className="text-cozy-700">• Remember why you're studying - keep your goals in mind</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Motivation
