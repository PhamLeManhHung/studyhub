import { Calendar, Flame, FileText, CreditCard, Plus, Clock, CheckCircle2 } from 'lucide-react'

const Dashboard = () => {
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
              <p className="text-3xl font-bold text-cozy-900 mt-2">5</p>
              <p className="text-xs text-cozy-500 mt-1">3 remaining</p>
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
              <p className="text-3xl font-bold text-cozy-900 mt-2">67 days</p>
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
              <p className="text-3xl font-bold text-cozy-900 mt-2">24</p>
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
              <p className="text-3xl font-bold text-cozy-900 mt-2">48</p>
              <p className="text-xs text-cozy-500 mt-1">Active sets</p>
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
            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>Add New Task</span>
            </button>
            <button className="btn-secondary w-full flex items-center justify-center space-x-2">
              <FileText size={20} />
              <span>Create Note</span>
            </button>
            <button className="btn-secondary w-full flex items-center justify-center space-x-2">
              <CreditCard size={20} />
              <span>New Flashcard Set</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-cozy-50 rounded-xl hover:bg-cozy-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <div>
                  <p className="text-cozy-900 font-medium">Math Homework</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock size={14} className="text-cozy-500" />
                    <span className="text-sm text-cozy-500">Today, 3 PM</span>
                  </div>
                </div>
              </div>
              <span className="badge-danger">High</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-cozy-50 rounded-xl hover:bg-cozy-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-cozy-900 font-medium">Science Project</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock size={14} className="text-cozy-500" />
                    <span className="text-sm text-cozy-500">Tomorrow, 10 AM</span>
                  </div>
                </div>
              </div>
              <span className="badge-warning">Medium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-4 bg-cozy-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-cozy-900 font-medium">Created note: React Basics</p>
              <p className="text-sm text-cozy-500 mt-1">2 hours ago</p>
            </div>
            <CheckCircle2 size={20} className="text-green-500" />
          </div>
          <div className="flex items-center space-x-4 p-4 bg-cozy-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-cozy-900 font-medium">Studied flashcards: Biology Terms</p>
              <p className="text-sm text-cozy-500 mt-1">5 hours ago</p>
            </div>
            <CheckCircle2 size={20} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
