import { Puzzle, Brain, Trophy } from 'lucide-react'

const LogicZone = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-cozy-900">Logic Zone</h1>
        <p className="text-cozy-600 mt-1">Challenge your mind with puzzles and logic games.</p>
      </div>

      {/* Featured Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-bold">Daily Challenge</h2>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Puzzle size={24} />
            </div>
          </div>
          <p className="text-purple-100 mb-4">
            Solve today's logic puzzle and earn points!
          </p>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
            Start Challenge
          </button>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-bold">Brain Training</h2>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Brain size={24} />
            </div>
          </div>
          <p className="text-blue-100 mb-4">
            Improve your cognitive skills with fun exercises.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Start Training
          </button>
        </div>
      </div>

      {/* Puzzle Categories */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Puzzle Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Sudoku', icon: '🔢', difficulty: 'Medium', color: 'bg-blue-100' },
            { name: 'Crosswords', icon: '✏️', difficulty: 'Hard', color: 'bg-purple-100' },
            { name: 'Riddles', icon: '❓', difficulty: 'Easy', color: 'bg-green-100' },
            { name: 'Math Puzzles', icon: '➕', difficulty: 'Medium', color: 'bg-yellow-100' },
            { name: 'Logic Games', icon: '🎮', difficulty: 'Hard', color: 'bg-red-100' },
            { name: 'Memory Games', icon: '🧠', difficulty: 'Easy', color: 'bg-pink-100' },
            { name: 'Word Games', icon: '📝', difficulty: 'Medium', color: 'bg-indigo-100' },
            { name: 'Patterns', icon: '🌀', difficulty: 'Hard', color: 'bg-teal-100' },
          ].map((puzzle, index) => (
            <div key={index} className="card-hover">
              <div className={`w-12 h-12 ${puzzle.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {puzzle.icon}
              </div>
              <h3 className="font-display font-semibold text-cozy-900">{puzzle.name}</h3>
              <p className="text-sm text-cozy-500 mt-1">{puzzle.difficulty}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="text-primary-600" size={24} />
          <h2 className="text-xl font-display font-semibold text-cozy-900">Leaderboard</h2>
        </div>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Alex', points: 2450, badge: '🥇', color: 'bg-yellow-50 border-yellow-200' },
            { rank: 2, name: 'Sam', points: 2320, badge: '🥈', color: 'bg-cozy-50 border-cozy-200' },
            { rank: 3, name: 'Jordan', points: 2180, badge: '🥉', color: 'bg-orange-50 border-orange-200' },
            { rank: 4, name: 'You', points: 1950, badge: '⭐', color: 'bg-primary-50 border-primary-200' },
          ].map((entry) => (
            <div key={entry.rank} className={`flex items-center justify-between p-4 border-2 rounded-xl ${entry.color}`}>
              <div className="flex items-center space-x-3">
                <span className="text-xl">{entry.badge}</span>
                <span className="font-semibold text-cozy-900">#{entry.rank} {entry.name}</span>
              </div>
              <span className="text-cozy-900 font-bold">{entry.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LogicZone
