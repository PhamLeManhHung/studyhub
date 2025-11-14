import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, GitBranch } from 'lucide-react'

const Patterns = ({ onBack }) => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [answeredPatterns, setAnsweredPatterns] = useState(new Set())

  const patterns = [
    {
      id: 1,
      type: 'number',
      question: "What number comes next in this sequence: 2, 4, 8, 16, ?",
      answer: "32",
      explanation: "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
    },
    {
      id: 2,
      type: 'shape',
      question: "What comes next: ⬛ ⬜ ⬛ ⬜ ⬛ ?",
      answer: "⬜",
      explanation: "The pattern alternates between black and white squares: ⬛ ⬜ ⬛ ⬜ ⬛ ⬜"
    },
    {
      id: 3,
      type: 'number',
      question: "What number comes next: 1, 4, 9, 16, 25, ?",
      answer: "36",
      explanation: "These are perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36"
    },
    {
      id: 4,
      type: 'letter',
      question: "What letter comes next: A, C, E, G, ?",
      answer: "I",
      explanation: "The pattern skips one letter: A (skip B) C (skip D) E (skip F) G (skip H) I"
    },
    {
      id: 5,
      type: 'number',
      question: "What number comes next: 1, 1, 2, 3, 5, 8, ?",
      answer: "13",
      explanation: "This is the Fibonacci sequence: each number is the sum of the two preceding ones. 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13"
    }
  ]

  useEffect(() => {
    const savedScore = localStorage.getItem('studyhub-patterns-score')
    if (savedScore) {
      setScore(JSON.parse(savedScore))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('studyhub-patterns-score', JSON.stringify(score))
  }, [score])

  const currentPattern = patterns[currentPatternIndex]
  const isAnswered = answeredPatterns.has(currentPattern.id)
  const isCorrect = userAnswer.trim().toUpperCase() === currentPattern.answer.toUpperCase()

  const handleSubmit = () => {
    if (!userAnswer.trim()) return
    
    setShowExplanation(true)
    setAnsweredPatterns(prev => new Set([...prev, currentPattern.id]))
    
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
    if (currentPatternIndex < patterns.length - 1) {
      setCurrentPatternIndex(prev => prev + 1)
      setUserAnswer('')
      setShowExplanation(false)
    }
  }

  const handlePrev = () => {
    if (currentPatternIndex > 0) {
      setCurrentPatternIndex(prev => prev - 1)
      setUserAnswer('')
      setShowExplanation(false)
    }
  }

  const handleReset = () => {
    setCurrentPatternIndex(0)
    setUserAnswer('')
    setShowExplanation(false)
    setAnsweredPatterns(new Set())
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
            <h1 className="text-3xl font-display font-bold text-cozy-900">Patterns</h1>
            <p className="text-cozy-600 mt-1">Identify and complete patterns.</p>
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
            <GitBranch size={24} className="text-teal-600" />
            <h2 className="text-2xl font-display font-bold text-cozy-900">Pattern {currentPatternIndex + 1} of {patterns.length}</h2>
          </div>
          <p className="text-xl text-cozy-700 leading-relaxed">
            {currentPattern.question}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isAnswered && handleSubmit()}
            placeholder="Enter your answer..."
            className="input-field text-lg"
            disabled={isAnswered}
          />
          
          {!isAnswered && (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="btn-primary w-full"
            >
              Submit Answer
            </button>
          )}

          {showExplanation && (
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
                    <h3 className="font-semibold text-yellow-900">Not quite right</h3>
                  </>
                )}
              </div>
              <p className="text-cozy-700 leading-relaxed">
                {currentPattern.explanation}
              </p>
              {!isCorrect && (
                <p className="text-cozy-700 mt-2">
                  The correct answer is: <span className="font-bold text-cozy-900">{currentPattern.answer}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
          <button
            onClick={handlePrev}
            disabled={currentPatternIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPatternIndex === patterns.length - 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Patterns

