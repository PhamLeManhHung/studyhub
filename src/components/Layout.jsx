import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  BookOpen,
  Puzzle,
  TrendingUp,
  Wrench,
  Users,
  Menu,
  X,
  Search,
  Bell,
  User,
  Settings,
} from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/planner', label: 'Planner', icon: Calendar },
    { path: '/notes', label: 'Smart Notes', icon: FileText },
    { path: '/flashcards', label: 'Flashcards', icon: CreditCard },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/logic-zone', label: 'Logic Zone', icon: Puzzle },
    { path: '/motivation', label: 'Motivation', icon: TrendingUp },
    { path: '/tools', label: 'Study Tools', icon: Wrench },
    { path: '/community', label: 'Community', icon: Users },
  ]

  const isActive = (path) => {
    return location.pathname === path
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
              <p className="text-2xl font-bold text-primary-600">7 days 🔥</p>
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
            <p className="text-2xl font-bold text-primary-600">7 days 🔥</p>
            <p className="text-xs text-cozy-500 mt-1">Keep it up!</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-cozy-200 h-20 flex items-center justify-between px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-cozy-100 text-cozy-600"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-400"
              />
              <input
                type="text"
                placeholder="Search notes, tasks, flashcards..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cozy-300 bg-cozy-50 
                         text-cozy-900 placeholder-cozy-400 focus:outline-none focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">
              <span className="text-sm font-medium">Quick Add</span>
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-xl hover:bg-cozy-100 text-cozy-600 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 rounded-xl hover:bg-cozy-100 text-cozy-600">
              <Settings size={20} />
            </button>

            {/* User Profile */}
            <button className="p-2 rounded-xl hover:bg-cozy-100 text-cozy-600">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>
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
