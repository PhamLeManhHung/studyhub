import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Flame, FileText, CreditCard, Plus, Clock, CheckCircle2, BookOpen } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    todayTasks: 0,
    remainingTasks: 0,
    studyStreak: 0,
    notesCount: 0,
    flashcardsCount: 0,
  })
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    // Load tasks
    const savedTasks = localStorage.getItem('studyhub-tasks')
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks)
      const today = new Date().toDateString()
      const todayTasks = tasks.filter(task => {
        if (!task.dueDate) return true
        const taskDate = new Date(task.dueDate).toDateString()
        return taskDate === today
      })
      const remaining = todayTasks.filter(task => !task.completed).length
      
      setStats(prev => ({
        ...prev,
        todayTasks: todayTasks.length,
        remainingTasks: remaining
      }))

      // Get upcoming tasks (next 2)
      const upcoming = tasks
        .filter(task => {
          if (!task.dueDate || task.completed) return false
          const taskDate = new Date(task.dueDate)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          taskDate.setHours(0, 0, 0, 0)
          return taskDate > today
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 2)
      
      setUpcomingTasks(upcoming)
    }

    // Load study streak
    const savedStreak = localStorage.getItem('studyhub-streak')
    if (savedStreak) {
      setStats(prev => ({
        ...prev,
        studyStreak: parseInt(savedStreak)
      }))
    }

    // Load notes count
    const savedNotes = localStorage.getItem('studyhub-notes')
    if (savedNotes) {
      const notes = JSON.parse(savedNotes)
      const thisMonth = new Date()
      thisMonth.setDate(1)
      const thisMonthNotes = notes.filter(note => {
        const noteDate = new Date(note.createdAt || note.updatedAt)
        return noteDate >= thisMonth
      })
      setStats(prev => ({
        ...prev,
        notesCount: thisMonthNotes.length
      }))
    }

    // Load flashcards count
    const savedFlashcards = localStorage.getItem('studyhub-flashcards')
    if (savedFlashcards) {
      const decks = JSON.parse(savedFlashcards)
      const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0)
      setStats(prev => ({
        ...prev,
        flashcardsCount: totalCards
      }))
    }

    // Load recent activity
    loadRecentActivity()
  }

  const loadRecentActivity = () => {
    const activities = []

    // Get recent notes
    const savedNotes = localStorage.getItem('studyhub-notes')
    if (savedNotes) {
      const notes = JSON.parse(savedNotes)
      notes
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 2)
        .forEach(note => {
          activities.push({
            type: 'note',
            title: `Created note: ${note.title}`,
            time: getTimeAgo(note.updatedAt || note.createdAt),
            icon: FileText,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-100'
          })
        })
    }

    // Get recent flashcard activity (if we track it)
    const savedFlashcards = localStorage.getItem('studyhub-flashcards')
    if (savedFlashcards) {
      const decks = JSON.parse(savedFlashcards)
      if (decks.length > 0) {
        const recentDeck = decks[0]
        activities.push({
          type: 'flashcard',
          title: `Studied flashcards: ${recentDeck.title}`,
          time: 'Recently',
          icon: CreditCard,
          iconColor: 'text-purple-600',
          bgColor: 'bg-purple-100'
        })
      }
    }

    // Sort by time and take most recent
    setRecentActivity(activities.slice(0, 2))
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    } else {
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge-danger'
      case 'medium':
        return 'badge-warning'
      case 'low':
        return 'badge bg-blue-100 text-blue-700'
      default:
        return 'badge-warning'
    }
  }

  const handleAddTask = () => {
    navigate('/planner')
  }

  const handleCreateNote = () => {
    navigate('/notes')
  }

  const handleNewFlashcardSet = () => {
    navigate('/flashcards')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Dashboard</h1>
          <p className="text-cozy-600 mt-1">Welcome back! Here's your study overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cozy-600 font-medium">Today's Tasks</p>
              <p className="text-3xl font-bold text-cozy-900 mt-2">{stats.todayTasks}</p>
              <p className="text-xs text-cozy-500 mt-1">{stats.remainingTasks} remaining</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cozy-600 font-medium">Study Streak</p>
              <p className="text-3xl font-bold text-cozy-900 mt-2">{stats.studyStreak} days</p>
              <p className="text-xs text-cozy-500 mt-1">Keep it up!</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Flame className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cozy-600 font-medium">Notes Created</p>
              <p className="text-3xl font-bold text-cozy-900 mt-2">{stats.notesCount}</p>
              <p className="text-xs text-cozy-500 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cozy-600 font-medium">Flashcards</p>
              <p className="text-3xl font-bold text-cozy-900 mt-2">{stats.flashcardsCount}</p>
              <p className="text-xs text-cozy-500 mt-1">Total cards</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={handleAddTask}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Task</span>
            </button>
            <button 
              onClick={handleCreateNote}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <FileText size={20} />
              <span>Create Note</span>
            </button>
            <button 
              onClick={handleNewFlashcardSet}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <CreditCard size={20} />
              <span>New Flashcard Set</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Upcoming Tasks</h2>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-cozy-500">No upcoming tasks. Add one to get started!</p>
              <button 
                onClick={handleAddTask}
                className="btn-primary mt-4"
              >
                Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-cozy-50 rounded-xl hover:bg-cozy-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/planner')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 
                      'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-cozy-900 font-medium">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={14} className="text-cozy-500" />
                        <span className="text-sm text-cozy-500">{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={getPriorityBadge(task.priority)}>
                    {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-cozy-500">No recent activity. Start creating notes or studying flashcards!</p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <button 
                onClick={handleCreateNote}
                className="btn-primary"
              >
                Create Note
              </button>
              <button 
                onClick={handleNewFlashcardSet}
                className="btn-secondary"
              >
                Study Flashcards
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-cozy-50 rounded-xl hover:bg-cozy-100 transition-colors cursor-pointer"
                  onClick={() => {
                    if (activity.type === 'note') {
                      navigate('/notes')
                    } else if (activity.type === 'flashcard') {
                      navigate('/flashcards')
                    }
                  }}
                >
                  <div className={`w-10 h-10 ${activity.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className={activity.iconColor} />
                  </div>
                  <div className="flex-1">
                    <p className="text-cozy-900 font-medium">{activity.title}</p>
                    <p className="text-sm text-cozy-500 mt-1">{activity.time}</p>
                  </div>
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
