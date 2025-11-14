import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  BookOpen,
  Puzzle,
  TrendingUp,
  Wrench,
  Menu,
  X,
  Search,
  Bell,
  User,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState([])
  const searchRef = useRef(null)
  const quickAddRef = useRef(null)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/planner', label: 'Planner', icon: Calendar },
    { path: '/notes', label: 'Smart Notes', icon: FileText },
    { path: '/flashcards', label: 'Flashcards', icon: CreditCard },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/logic-zone', label: 'Logic Zone', icon: Puzzle },
    { path: '/motivation', label: 'Motivation', icon: TrendingUp },
    { path: '/tools', label: 'Study Tools', icon: Wrench },
  ]

  // Load notifications
  useEffect(() => {
    loadNotifications()
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickAddRef.current && !quickAddRef.current.contains(event.target)) {
        setShowQuickAdd(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = () => {
    const notifs = []
    
    // Check for upcoming tasks due today
    const savedTasks = localStorage.getItem('studyhub-tasks')
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks)
      const today = new Date().toDateString()
      const todayTasks = tasks.filter(task => {
        if (!task.dueDate || task.completed) return false
        const taskDate = new Date(task.dueDate).toDateString()
        return taskDate === today
      })
      
      todayTasks.forEach(task => {
        notifs.push({
          id: `task-${task.id}`,
          type: 'task',
          title: `Task due today: ${task.title}`,
          time: 'Today',
          priority: task.priority || 'medium',
          link: '/planner'
        })
      })
    }

    // Check study streak milestone
    const savedStreak = localStorage.getItem('studyhub-streak')
    if (savedStreak) {
      const streak = parseInt(savedStreak)
      if (streak > 0 && streak % 7 === 0) {
        notifs.push({
          id: 'streak-milestone',
          type: 'achievement',
          title: `🎉 ${streak} day streak! Keep it up!`,
          time: 'Today',
          link: '/motivation'
        })
      }
    }

    setNotifications(notifs)
  }

  const performSearch = (query) => {
    const results = []
    const lowerQuery = query.toLowerCase()

    // Search tasks
    const savedTasks = localStorage.getItem('studyhub-tasks')
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks)
      tasks.forEach(task => {
        if (task.title.toLowerCase().includes(lowerQuery) || 
            (task.description && task.description.toLowerCase().includes(lowerQuery))) {
          results.push({
            type: 'task',
            title: task.title,
            subtitle: task.description || 'Task',
            icon: Calendar,
            iconColor: 'text-primary-600',
            bgColor: 'bg-primary-100',
            link: '/planner'
          })
        }
      })
    }

    // Search notes
    const savedNotes = localStorage.getItem('studyhub-notes')
    if (savedNotes) {
      const notes = JSON.parse(savedNotes)
      notes.forEach(note => {
        if (note.title.toLowerCase().includes(lowerQuery) || 
            note.content.toLowerCase().includes(lowerQuery) ||
            (note.subject && note.subject.toLowerCase().includes(lowerQuery))) {
          results.push({
            type: 'note',
            title: note.title,
            subtitle: note.subject || 'Note',
            icon: FileText,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-100',
            link: '/notes'
          })
        }
      })
    }

    // Search flashcards
    const savedFlashcards = localStorage.getItem('studyhub-flashcards')
    if (savedFlashcards) {
      const decks = JSON.parse(savedFlashcards)
      decks.forEach(deck => {
        if (deck.title.toLowerCase().includes(lowerQuery) ||
            (deck.subject && deck.subject.toLowerCase().includes(lowerQuery))) {
          results.push({
            type: 'flashcard',
            title: deck.title,
            subtitle: `${deck.cards?.length || 0} cards`,
            icon: CreditCard,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-100',
            link: '/flashcards'
          })
        }
      })
    }

    setSearchResults(results.slice(0, 5)) // Limit to 5 results
  }

  const handleQuickAdd = (type) => {
    setShowQuickAdd(false)
    switch (type) {
      case 'task':
        navigate('/planner')
        break
      case 'note':
        navigate('/notes')
        break
      case 'flashcard':
        navigate('/flashcards')
        break
      default:
        break
    }
  }

  const handleSearchResultClick = (result) => {
    setSearchQuery('')
    setShowSearchResults(false)
    navigate(result.link)
  }

  const handleNotificationClick = (notification) => {
    setShowNotifications(false)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Get study streak from localStorage
  const getStudyStreak = () => {
    const savedStreak = localStorage.getItem('studyhub-streak')
    return savedStreak ? parseInt(savedStreak) : 0
  }

  return (
    <div className="min-h-screen bg-cozy-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-white border-r border-cozy-200 flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-cozy-200">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-cozy-900">StudyHub AI</h1>
                <p className="text-xs text-cozy-500">Study smarter</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`sidebar-link group ${
                    active ? 'sidebar-link-active' : ''
                  }`}
                >
                  <Icon
                    size={20}
                    className={active ? 'text-primary-600' : 'text-cozy-500 group-hover:text-cozy-700'}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-cozy-200">
            <div className="bg-cozy-50 rounded-xl p-4">
              <p className="text-xs font-medium text-cozy-900 mb-1">Study Streak</p>
              <p className="text-2xl font-bold text-primary-600">{getStudyStreak()} days 🔥</p>
              <p className="text-xs text-cozy-500 mt-1">Keep it up!</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-cozy-200">
          <Link to="/" className="flex items-center space-x-3" onClick={() => setSidebarOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-cozy-900">StudyHub AI</h1>
              <p className="text-xs text-cozy-500">Study smarter</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-cozy-100 text-cozy-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link group ${
                  active ? 'sidebar-link-active' : ''
                }`}
              >
                <Icon
                  size={20}
                  className={active ? 'text-primary-600' : 'text-cozy-500 group-hover:text-cozy-700'}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-cozy-200">
          <div className="bg-cozy-50 rounded-xl p-4">
            <p className="text-xs font-medium text-cozy-900 mb-1">Study Streak</p>
            <p className="text-2xl font-bold text-primary-600">{getStudyStreak()} days 🔥</p>
            <p className="text-xs text-cozy-500 mt-1">Keep it up!</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-cozy-200 h-20 flex items-center justify-between px-4 lg:px-6 relative z-30">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-cozy-100 text-cozy-600"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                placeholder="Search notes, tasks, flashcards..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cozy-300 bg-cozy-50 
                         text-cozy-900 placeholder-cozy-400 focus:outline-none focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-cozy-lg border border-cozy-200 max-h-96 overflow-y-auto z-50">
                {searchResults.map((result, index) => {
                  const Icon = result.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full flex items-center space-x-3 p-4 hover:bg-cozy-50 transition-colors text-left border-b border-cozy-100 last:border-b-0"
                    >
                      <div className={`w-10 h-10 ${result.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} className={result.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cozy-900 font-medium truncate">{result.title}</p>
                        <p className="text-sm text-cozy-500 truncate">{result.subtitle}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {showSearchResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-cozy-lg border border-cozy-200 p-4 z-50">
                <p className="text-cozy-500 text-center">No results found</p>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Add */}
            <div className="relative" ref={quickAddRef}>
              <button
                onClick={() => {
                  setShowQuickAdd(!showQuickAdd)
                  setShowNotifications(false)
                  setShowProfile(false)
                }}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
              >
                <Plus size={18} />
                <span className="text-sm font-medium">Quick Add</span>
              </button>

              {showQuickAdd && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-cozy-lg border border-cozy-200 z-50">
                  <button
                    onClick={() => handleQuickAdd('task')}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-cozy-50 transition-colors text-left rounded-t-xl"
                  >
                    <Calendar size={20} className="text-primary-600" />
                    <span className="text-cozy-900 font-medium">New Task</span>
                  </button>
                  <button
                    onClick={() => handleQuickAdd('note')}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-cozy-50 transition-colors text-left"
                  >
                    <FileText size={20} className="text-blue-600" />
                    <span className="text-cozy-900 font-medium">New Note</span>
                  </button>
                  <button
                    onClick={() => handleQuickAdd('flashcard')}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-cozy-50 transition-colors text-left rounded-b-xl"
                  >
                    <CreditCard size={20} className="text-purple-600" />
                    <span className="text-cozy-900 font-medium">New Flashcard</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowQuickAdd(false)
                  setShowProfile(false)
                  loadNotifications()
                }}
                className="p-2 rounded-xl hover:bg-cozy-100 text-cozy-600 relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-cozy-lg border border-cozy-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-cozy-200">
                    <h3 className="font-semibold text-cozy-900">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell size={32} className="mx-auto text-cozy-300 mb-2" />
                      <p className="text-cozy-500 text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div>
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className="w-full flex items-start space-x-3 p-4 hover:bg-cozy-50 transition-colors text-left border-b border-cozy-100 last:border-b-0"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'task' ? 'bg-primary-100' : 'bg-yellow-100'
                          }`}>
                            {notif.type === 'task' ? (
                              <Clock size={16} className="text-primary-600" />
                            ) : (
                              <CheckCircle2 size={16} className="text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-cozy-900 font-medium text-sm">{notif.title}</p>
                            <p className="text-xs text-cozy-500 mt-1">{notif.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => {
                alert('Settings page coming soon!')
              }}
              className="p-2 rounded-xl hover:bg-cozy-100 text-cozy-600"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfile(!showProfile)
                  setShowQuickAdd(false)
                  setShowNotifications(false)
                }}
                className="p-2 rounded-xl hover:bg-cozy-100 text-cozy-600"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-cozy-lg border border-cozy-200 z-50">
                  <div className="p-4 border-b border-cozy-200">
                    <p className="font-semibold text-cozy-900">Profile</p>
                    <p className="text-sm text-cozy-500 mt-1">StudyHub User</p>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setShowProfile(false)
                        navigate('/motivation')
                      }}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-cozy-50 transition-colors text-left"
                    >
                      <User size={18} className="text-cozy-600" />
                      <span className="text-cozy-900">View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false)
                        alert('Settings page coming soon!')
                      }}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-cozy-50 transition-colors text-left"
                    >
                      <Settings size={18} className="text-cozy-600" />
                      <span className="text-cozy-900">Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-cozy-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
