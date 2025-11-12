import { useState, useEffect } from 'react'
import { Plus, Clock, CheckCircle2, Circle, X, Edit2, Trash2, Flame, Calendar } from 'lucide-react'

const Planner = () => {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  })
  const [studyStreak, setStudyStreak] = useState(0)
  const [lastCompletedDate, setLastCompletedDate] = useState(null)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('studyhub-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    // Load study streak data
    const savedStreak = localStorage.getItem('studyhub-streak')
    const savedLastDate = localStorage.getItem('studyhub-last-date')
    if (savedStreak) {
      setStudyStreak(parseInt(savedStreak))
    }
    if (savedLastDate) {
      setLastCompletedDate(savedLastDate)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('studyhub-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Check and update study streak based on completed tasks
  useEffect(() => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    // Check if any tasks were completed today
    const completedToday = tasks.filter(task => {
      if (!task.completed || !task.completedAt) return false
      const completedDate = new Date(task.completedAt).toDateString()
      return completedDate === today
    })

    if (completedToday.length > 0) {
      // Get current streak and last date from localStorage
      const savedStreak = parseInt(localStorage.getItem('studyhub-streak') || '0')
      const savedLastDate = localStorage.getItem('studyhub-last-date')
      
      // Check if we already updated streak for today
      if (savedLastDate === today) {
        // Already counted today, update state from localStorage
        setStudyStreak(savedStreak)
        setLastCompletedDate(savedLastDate)
        return
      }

      // Calculate new streak
      let newStreak = 1
      if (savedLastDate === yesterday) {
        // Continue streak from yesterday
        newStreak = savedStreak + 1
      } else if (savedLastDate && savedLastDate !== today && savedLastDate !== yesterday) {
        // Streak broken (last completion was more than 1 day ago)
        newStreak = 1
      }

      // Update streak and last completed date
      setStudyStreak(newStreak)
      setLastCompletedDate(today)
      localStorage.setItem('studyhub-streak', newStreak.toString())
      localStorage.setItem('studyhub-last-date', today)
    }
  }, [tasks])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
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

  // Get tasks for today (includes tasks with dueDate today AND tasks without dueDate)
  const getTodayTasks = () => {
    const today = new Date().toDateString()
    return tasks.filter(task => {
      // Include tasks without dueDate or tasks with dueDate today
      if (!task.dueDate) return true // Include tasks without dueDate in today's list
      const taskDate = new Date(task.dueDate).toDateString()
      return taskDate === today
    }).sort((a, b) => {
      // Sort by priority first, then by dueDate (tasks without dueDate go to end)
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // If priorities are equal, tasks with dueDate come first
      if (!a.dueDate && b.dueDate) return 1
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && !b.dueDate) return 0
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
  }

  // Get upcoming tasks (future dates only, excludes tasks without dueDate)
  const getUpcomingTasks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate > today
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }
  
  // Get tasks without dueDate (for display in a separate section if needed)
  const getTasksWithoutDueDate = () => {
    return tasks.filter(task => !task.dueDate && !task.completed).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Open modal for adding new task
  const handleAddTask = () => {
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    })
    setIsModalOpen(true)
  }

  // Open modal for editing task
  const handleEditTask = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
      priority: task.priority || 'medium',
    })
    setIsModalOpen(true)
  }

  // Save task (add or update)
  const handleSaveTask = () => {
    if (!formData.title.trim()) return

    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { 
              ...task, 
              title: formData.title,
              description: formData.description,
              dueDate: formData.dueDate || null,
              priority: formData.priority
            }
          : task
      ))
    } else {
      // Add new task
      const newTask = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        completed: false,
        priority: formData.priority,
        createdAt: new Date().toISOString(),
        dueDate: formData.dueDate || null,
      }
      setTasks([...tasks, newTask])
    }

    setIsModalOpen(false)
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    })
  }

  // Delete task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId))
    }
  }

  // Toggle task completion
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed
        const today = new Date().toISOString()
        return {
          ...task,
          completed: newCompleted,
          completedAt: newCompleted ? today : null
        }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  // Get priority badge class
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

  // Get priority label
  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  const todayTasks = getTodayTasks()
  const upcomingTasks = getUpcomingTasks()
  const completedToday = todayTasks.filter(task => task.completed).length
  const totalToday = todayTasks.length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Planner & To-Do Tracker</h1>
          <p className="text-cozy-600 mt-1">Organize your tasks and stay on track.</p>
        </div>
        <button onClick={handleAddTask} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* To-Do List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Study Streak Counter */}
          <div className="card bg-gradient-to-r from-primary-50 to-warm-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center">
                  <Flame size={24} className="text-primary-700" />
                </div>
                <div>
                  <p className="text-sm text-cozy-600 font-medium">Study Streak</p>
                  <p className="text-2xl font-bold text-primary-600">{studyStreak} days 🔥</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-cozy-600">Today's Progress</p>
                <p className="text-lg font-bold text-cozy-900">
                  {completedToday}/{totalToday} completed
                </p>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">
              Today's Tasks {todayTasks.filter(t => !t.dueDate).length > 0 && (
                <span className="text-sm font-normal text-cozy-500">
                  ({todayTasks.filter(t => !t.dueDate).length} without due date)
                </span>
              )}
            </h2>
            {todayTasks.length === 0 ? (
              <p className="text-cozy-500 text-center py-8">No tasks for today. Add one to get started!</p>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-3 p-4 border border-cozy-200 rounded-xl transition-colors ${
                      task.completed
                        ? 'bg-cozy-50 opacity-75'
                        : 'hover:bg-cozy-50'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className="flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={20} className="text-green-600" />
                      ) : (
                        <Circle size={20} className="text-cozy-400 hover:text-primary-600 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-cozy-900 font-medium ${
                          task.completed ? 'line-through text-cozy-600' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-cozy-500 mt-1">{task.description}</p>
                      )}
                      {task.dueDate ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock size={14} className="text-cozy-500" />
                          <span className="text-sm text-cozy-500">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-cozy-400 italic">No due date</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={getPriorityBadge(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-primary-600 transition-colors"
                        title="Edit task"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-cozy-600 hover:text-red-600 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Upcoming Tasks</h2>
            {upcomingTasks.length === 0 ? (
              <p className="text-cozy-500 text-center py-8">No upcoming tasks.</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-cozy-200 rounded-xl hover:bg-cozy-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-cozy-900 font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-cozy-500 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock size={14} className="text-cozy-500" />
                          <span className="text-sm text-cozy-500">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={getPriorityBadge(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-primary-600 transition-colors"
                          title="Edit task"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-cozy-600 hover:text-red-600 transition-colors"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Calendar View / Stats Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-cozy-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-primary-600" />
                  <span className="text-cozy-700 font-medium">Today</span>
                </div>
                <span className="text-cozy-900 font-bold">{totalToday} tasks</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <span className="text-cozy-700 font-medium">Completed</span>
                </div>
                <span className="text-green-700 font-bold">{completedToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Clock size={20} className="text-yellow-600" />
                  <span className="text-cozy-700 font-medium">Pending</span>
                </div>
                <span className="text-yellow-700 font-bold">{totalToday - completedToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-blue-600" />
                  <span className="text-cozy-700 font-medium">Upcoming</span>
                </div>
                <span className="text-blue-700 font-bold">{upcomingTasks.length}</span>
              </div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Priority Breakdown</h2>
            <div className="space-y-2">
              {['high', 'medium', 'low'].map((priority) => {
                const count = tasks.filter(
                  task => task.priority === priority && !task.completed
                ).length
                return (
                  <div key={priority} className="flex items-center justify-between p-2">
                    <span className={getPriorityBadge(priority)}>
                      {getPriorityLabel(priority)}
                    </span>
                    <span className="text-cozy-700 font-medium">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingTask(null)
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter task title"
                  required
                />
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
                  placeholder="Enter task description (optional)"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingTask(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="btn-primary flex-1"
                  disabled={!formData.title.trim()}
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Planner
