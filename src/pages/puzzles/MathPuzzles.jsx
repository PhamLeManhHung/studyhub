import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Calculator } from 'lucide-react'

const MathPuzzles = ({ onBack }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [answeredPuzzles, setAnsweredPuzzles] = useState(new Set())

  const puzzles = [
    {
      id: 1,
      question: "If the pattern continues: 2, 6, 12, 20, 30, ? What is the next number?",
      answer: "42",
      explanation: "The pattern is: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30. So the next number is 6×7=42."
    },
    {
      id: 2,
      question: "What is the sum of all numbers from 1 to 100?",
      answer: "5050",
      explanation: "Using the formula n(n+1)/2: 100(100+1)/2 = 100×101/2 = 10100/2 = 5050"
    },
    {
      id: 3,
      question: "If 3x + 5 = 20, what is the value of x?",
      answer: "5",
      explanation: "3x + 5 = 20 → 3x = 20 - 5 → 3x = 15 → x = 15/3 → x = 5"
    },
    {
      id: 4,
      question: "A rectangle has a length of 8 cm and width of 6 cm. What is its area?",
      answer: "48",
      explanation: "Area of rectangle = length × width = 8 × 6 = 48 cm²"
    },
    {
      id: 5,
      question: "What is 15% of 200?",
      answer: "30",
      explanation: "15% of 200 = 0.15 × 200 = 30"
    }
  ]

  useEffect(() => {
    const savedScore = localStorage.getItem('studyhub-math-score')
    if (savedScore) {
      setScore(JSON.parse(savedScore))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('studyhub-math-score', JSON.stringify(score))
  }, [score])

  const currentPuzzle = puzzles[currentPuzzleIndex]
  const isAnswered = answeredPuzzles.has(currentPuzzle.id)
  const isCorrect = userAnswer.trim() === currentPuzzle.answer

  const handleSubmit = () => {
    if (!userAnswer.trim()) return
    
    setShowExplanation(true)
    setAnsweredPuzzles(prev => new Set([...prev, currentPuzzle.id]))
    
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
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1)
      setUserAnswer('')
      setShowExplanation(false)
    }
  }

  const handlePrev = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(prev => prev - 1)
      setUserAnswer('')
      setShowExplanation(false)
    }
  }

  const handleReset = () => {
    setCurrentPuzzleIndex(0)
    setUserAnswer('')
    setShowExplanation(false)
    setAnsweredPuzzles(new Set())
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
            <h1 className="text-3xl font-display font-bold text-cozy-900">Math Puzzles</h1>
            <p className="text-cozy-600 mt-1">Solve mathematical challenges and problems.</p>
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
            <Calculator size={24} className="text-blue-600" />
            <h2 className="text-2xl font-display font-bold text-cozy-900">Puzzle {currentPuzzleIndex + 1} of {puzzles.length}</h2>
          </div>
          <p className="text-xl text-cozy-700 leading-relaxed">
            {currentPuzzle.question}
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
                {currentPuzzle.explanation}
              </p>
              {!isCorrect && (
                <p className="text-cozy-700 mt-2">
                  The correct answer is: <span className="font-bold text-cozy-900">{currentPuzzle.answer}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
          <button
            onClick={handlePrev}
            disabled={currentPuzzleIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPuzzleIndex === puzzles.length - 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default MathPuzzles

