import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

const Riddles = ({ onBack }) => {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [answeredRiddles, setAnsweredRiddles] = useState(new Set())

  const riddles = [
    {
      id: 1,
      riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "echo",
      hints: ["It's a sound phenomenon", "It repeats what you say"]
    },
    {
      id: 2,
      riddle: "The more you take, the more you leave behind. What am I?",
      answer: "footsteps",
      hints: ["Think about walking", "They're left on the ground"]
    },
    {
      id: 3,
      riddle: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
      answer: "map",
      hints: ["It's used for navigation", "It shows locations"]
    },
    {
      id: 4,
      riddle: "What has keys but no locks, space but no room, and you can enter but not go inside?",
      answer: "keyboard",
      hints: ["It's used with computers", "You type on it"]
    },
    {
      id: 5,
      riddle: "I'm tall when I'm young, and short when I'm old. What am I?",
      answer: "candle",
      hints: ["It provides light", "It gets shorter as it burns"]
    }
  ]

  useEffect(() => {
    const savedScore = localStorage.getItem('studyhub-riddles-score')
    if (savedScore) {
      setScore(JSON.parse(savedScore))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('studyhub-riddles-score', JSON.stringify(score))
  }, [score])

  const currentRiddle = riddles[currentRiddleIndex]
  const isCorrect = userAnswer.toLowerCase().trim() === currentRiddle.answer.toLowerCase()
  const isAnswered = answeredRiddles.has(currentRiddle.id)

  const handleSubmit = () => {
    if (!userAnswer.trim()) return
    
    setShowAnswer(true)
    setAnsweredRiddles(prev => new Set([...prev, currentRiddle.id]))
    
    if (isCorrect) {
      setScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1
      }))
    } else {
      setScore(prev => ({
        correct: prev.correct,
        total: prev.total + 1
      }))
    }
  }

  const handleNext = () => {
    if (currentRiddleIndex < riddles.length - 1) {
      setCurrentRiddleIndex(prev => prev + 1)
      setUserAnswer('')
      setShowAnswer(false)
    }
  }

  const handlePrev = () => {
    if (currentRiddleIndex > 0) {
      setCurrentRiddleIndex(prev => prev - 1)
      setUserAnswer('')
      setShowAnswer(false)
    }
  }

  const handleReset = () => {
    setCurrentRiddleIndex(0)
    setUserAnswer('')
    setShowAnswer(false)
    setAnsweredRiddles(new Set())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-cozy-900">Riddles</h1>
            <p className="text-cozy-600 mt-1">Solve brain teasers and tricky questions.</p>
          </div>
        </div>
        <button onClick={handleReset} className="btn-primary flex items-center space-x-2">
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <p className="text-sm text-cozy-600 font-medium">Score</p>
            <p className="text-3xl font-bold text-primary-600">
              {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-cozy-600 font-medium">Correct</p>
            <p className="text-2xl font-bold text-green-600">{score.correct}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-cozy-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-cozy-900">{score.total}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb size={24} className="text-yellow-600" />
            <h2 className="text-2xl font-display font-bold text-cozy-900">Riddle {currentRiddleIndex + 1} of {riddles.length}</h2>
          </div>
          <p className="text-xl text-cozy-700 leading-relaxed italic mb-6">
            "{currentRiddle.riddle}"
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !showAnswer && handleSubmit()}
            placeholder="Enter your answer..."
            className="input-field text-lg"
            disabled={showAnswer}
          />
          
          {!showAnswer && (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="btn-primary w-full"
            >
              Submit Answer
            </button>
          )}

          {showAnswer && (
            <div className={`p-4 rounded-xl ${
              isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
            }`}>
              <div className="flex items-start space-x-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-green-900">Correct!</h3>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-yellow-900">Not quite!</h3>
                  </>
                )}
              </div>
              <p className="text-cozy-700">
                The answer is: <span className="font-bold text-cozy-900">{currentRiddle.answer}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
          <button
            onClick={handlePrev}
            disabled={currentRiddleIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentRiddleIndex === riddles.length - 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Riddles

