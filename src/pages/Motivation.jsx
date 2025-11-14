import { useState, useEffect } from 'react'
import { Flame, Star, Target, Trophy, Zap, Sparkles, Calendar, Heart, Loader2, X } from 'lucide-react'
import { generateAdvice } from '../utils/aiService'

const Motivation = () => {
  const [dailyQuote, setDailyQuote] = useState('')
  const [reflection, setReflection] = useState('')
  const [streak, setStreak] = useState(0)
  const [lastReflectionDate, setLastReflectionDate] = useState(null)
  const [mood, setMood] = useState('')
  const [moodHistory, setMoodHistory] = useState([])
  const [aiAdvice, setAiAdvice] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  // Motivational quotes array
  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Dream bigger. Do bigger.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Unknown" },
    { text: "Little things make big things happen.", author: "John Wooden" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
  ]

  // Mood emojis
  const moodEmojis = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😄', label: 'Excited' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😎', label: 'Confident' },
    { emoji: '🤔', label: 'Thoughtful' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😟', label: 'Worried' },
    { emoji: '😤', label: 'Determined' },
    { emoji: '🙂', label: 'Neutral' },
    { emoji: '💪', label: 'Motivated' },
  ]

  // Load data from localStorage on mount
  useEffect(() => {
    // Load daily quote (set once per day)
    const savedQuoteDate = localStorage.getItem('studyhub-quote-date')
    const savedQuote = localStorage.getItem('studyhub-quote')
    const today = new Date().toDateString()
    
    if (savedQuoteDate === today && savedQuote) {
      setDailyQuote(savedQuote)
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      const quoteText = `"${randomQuote.text}" — ${randomQuote.author}`
      setDailyQuote(quoteText)
      localStorage.setItem('studyhub-quote', quoteText)
      localStorage.setItem('studyhub-quote-date', today)
    }

    // Load reflection
    const savedReflection = localStorage.getItem('studyhub-reflection')
    const savedReflectionDate = localStorage.getItem('studyhub-reflection-date')
    if (savedReflection) {
      setReflection(savedReflection)
    }
    if (savedReflectionDate) {
      setLastReflectionDate(savedReflectionDate)
    }

    // Load streak
    const savedStreak = localStorage.getItem('studyhub-motivation-streak')
    const savedLastDate = localStorage.getItem('studyhub-motivation-last-date')
    if (savedStreak) {
      setStreak(parseInt(savedStreak))
    }
    if (savedLastDate) {
      setLastReflectionDate(savedLastDate)
    }

    // Load mood
    const savedMood = localStorage.getItem('studyhub-mood')
    const savedMoodDate = localStorage.getItem('studyhub-mood-date')
    if (savedMood) {
      setMood(savedMood)
    }

    // Load mood history
    const savedMoodHistory = localStorage.getItem('studyhub-mood-history')
    if (savedMoodHistory) {
      setMoodHistory(JSON.parse(savedMoodHistory))
    }
  }, [])

  // Update streak when reflection is saved
  useEffect(() => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (reflection.trim() && lastReflectionDate) {
      const savedStreak = parseInt(localStorage.getItem('studyhub-motivation-streak') || '0')
      const savedLastDate = localStorage.getItem('studyhub-motivation-last-date')
      
      if (lastReflectionDate === today) {
        // Already counted today
        setStreak(savedStreak)
        return
      }

      let newStreak = 1
      if (savedLastDate === yesterday) {
        // Continue streak from yesterday
        newStreak = savedStreak + 1
      } else if (savedLastDate && savedLastDate !== today && savedLastDate !== yesterday) {
        // Streak broken (last reflection was more than 1 day ago)
        newStreak = 1
      }

      setStreak(newStreak)
      localStorage.setItem('studyhub-motivation-streak', newStreak.toString())
      localStorage.setItem('studyhub-motivation-last-date', today)
    }
  }, [reflection, lastReflectionDate])

  // Save reflection to localStorage
  const handleSaveReflection = () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    localStorage.setItem('studyhub-reflection', reflection)
    localStorage.setItem('studyhub-reflection-date', today)
    setLastReflectionDate(today)
    
    // Update streak
    const savedStreak = parseInt(localStorage.getItem('studyhub-motivation-streak') || '0')
    const savedLastDate = localStorage.getItem('studyhub-motivation-last-date')
    
    let newStreak = 1
    if (savedLastDate === yesterday) {
      newStreak = savedStreak + 1
    } else if (savedLastDate && savedLastDate !== today && savedLastDate !== yesterday) {
      newStreak = 1
    } else if (savedLastDate === today) {
      newStreak = savedStreak // Keep current streak if already saved today
    }
    
    setStreak(newStreak)
    localStorage.setItem('studyhub-motivation-streak', newStreak.toString())
    localStorage.setItem('studyhub-motivation-last-date', today)
  }

  // Handle mood selection
  const handleMoodSelect = (selectedMood) => {
    const today = new Date().toDateString()
    setMood(selectedMood)
    localStorage.setItem('studyhub-mood', selectedMood)
    localStorage.setItem('studyhub-mood-date', today)
    
    // Update mood history
    const updatedHistory = moodHistory.filter(entry => entry.date !== today)
    updatedHistory.push({ date: today, mood: selectedMood })
    updatedHistory.sort((a, b) => new Date(b.date) - new Date(a.date))
    setMoodHistory(updatedHistory.slice(0, 7)) // Keep last 7 days
    localStorage.setItem('studyhub-mood-history', JSON.stringify(updatedHistory.slice(0, 7)))
  }

  // Get streak days display
  const getStreakDays = () => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      const savedLastDate = localStorage.getItem('studyhub-motivation-last-date')
      const isActive = savedLastDate === dateStr
      days.push({ date: dateStr, isActive })
    }
    return days
  }

  // AI Advice handler
  const handleAIAdvice = async () => {
    setAiLoading(true)
    try {
      const userData = {
        streak,
        mood,
        reflection: reflection.trim(),
        lastReflectionDate
      }
      const advice = await generateAdvice(userData)
      setAiAdvice(advice)
    } catch (error) {
      alert('Error generating advice. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const streakDays = getStreakDays()
  const today = new Date().toDateString()
  const savedMoodDate = localStorage.getItem('studyhub-mood-date')
  const showMoodForToday = savedMoodDate === today

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Motivation</h1>
          <p className="text-cozy-600 mt-1">Stay inspired and track your progress.</p>
        </div>
        <button 
          onClick={handleAIAdvice} 
          disabled={aiLoading}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          {aiLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>AI Advice</span>
            </>
          )}
        </button>
      </div>

      {/* Daily Quote */}
      <div className="card bg-gradient-to-r from-primary-500 to-warm-500 text-white">
        <div className="text-center py-8">
          <Heart size={32} className="mx-auto mb-4 text-primary-100" />
          <p className="text-2xl font-light italic mb-4">
            {dailyQuote}
          </p>
        </div>
      </div>

      {/* Streak Tracker */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <Flame size={32} className="text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-cozy-900">{streak}</p>
              <p className="text-cozy-600 mt-1">Day Streak 🔥</p>
            </div>
          </div>
        </div>
        
        {/* 7-Day Streak Calendar */}
        <div>
          <h3 className="text-lg font-display font-semibold text-cozy-900 mb-4">7-Day Streak</h3>
          <div className="grid grid-cols-7 gap-2">
            {streakDays.map((day, index) => {
              const date = new Date(day.date)
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
              const dayNumber = date.getDate()
              
              return (
                <div
                  key={index}
                  className={`text-center p-3 rounded-xl border-2 transition-all ${
                    day.isActive
                      ? 'bg-primary-50 border-primary-500 shadow-cozy'
                      : 'bg-cozy-50 border-cozy-200'
                  }`}
                >
                  <p className="text-xs text-cozy-600 mb-1">{dayName}</p>
                  <p className={`text-lg font-bold ${
                    day.isActive ? 'text-primary-600' : 'text-cozy-400'
                  }`}>
                    {dayNumber}
                  </p>
                  {day.isActive && (
                    <Flame size={16} className="mx-auto mt-1 text-red-600" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Daily Reflection */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar size={24} className="text-primary-600" />
          <h2 className="text-xl font-display font-semibold text-cozy-900">Daily Reflection</h2>
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="input-field"
          placeholder="Write your thoughts, goals, achievements, or anything you want to reflect on today..."
          rows="6"
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-cozy-500">
            {lastReflectionDate === today ? 'Saved today' : 'Not saved yet'}
          </p>
          <button
            onClick={handleSaveReflection}
            className="btn-primary"
            disabled={!reflection.trim()}
          >
            Save Reflection
          </button>
        </div>
      </div>

      {/* Mood Tracker */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Heart size={24} className="text-primary-600" />
          <h2 className="text-xl font-display font-semibold text-cozy-900">Mood Tracker</h2>
        </div>
        <p className="text-sm text-cozy-600 mb-4">How are you feeling today?</p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-4">
          {moodEmojis.map((moodOption, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(moodOption.emoji)}
              className={`p-3 rounded-xl border-2 transition-all text-2xl ${
                mood === moodOption.emoji
                  ? 'border-primary-500 bg-primary-50 scale-110'
                  : 'border-cozy-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
              title={moodOption.label}
            >
              {moodOption.emoji}
            </button>
          ))}
        </div>
        {showMoodForToday && mood && (
          <p className="text-sm text-cozy-600">
            Today's mood: {mood} {moodEmojis.find(m => m.emoji === mood)?.label}
          </p>
        )}
        
        {/* Mood History (Last 7 Days) */}
        {moodHistory.length > 0 && (
          <div className="mt-6 pt-6 border-t border-cozy-200">
            <h3 className="text-sm font-semibold text-cozy-700 mb-3">Recent Mood History</h3>
            <div className="flex items-center space-x-2">
              {moodHistory.slice(0, 7).map((entry, index) => {
                const date = new Date(entry.date)
                const isToday = entry.date === today
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-1"
                    title={isToday ? 'Today' : date.toLocaleDateString()}
                  >
                    <span className="text-2xl">{entry.mood}</span>
                    <span className="text-xs text-cozy-500">
                      {isToday ? 'Today' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star size={32} className="text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">{streak}</p>
          <p className="text-cozy-600 mt-1">Day Streak</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Target size={32} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">
            {moodHistory.length}
          </p>
          <p className="text-cozy-600 mt-1">Days Tracked</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Heart size={32} className="text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-cozy-900">
            {reflection.trim() ? '✓' : '—'}
          </p>
          <p className="text-cozy-600 mt-1">Reflection Today</p>
        </div>
      </div>

      {/* AI Advice Modal */}
      {aiAdvice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">AI Advice for You</h2>
              <button
                onClick={() => setAiAdvice(null)}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="prose max-w-none text-cozy-700 whitespace-pre-wrap bg-primary-50 p-6 rounded-xl border border-primary-200">
              {aiAdvice}
            </div>
          </div>
        </div>
      )}

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
              <p className="text-cozy-700">• Track your mood and reflect daily to stay mindful</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Motivation
