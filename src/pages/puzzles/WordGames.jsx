import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, BookOpen } from 'lucide-react'

const WordGames = ({ onBack }) => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [answeredGames, setAnsweredGames] = useState(new Set())

  const games = [
    {
      id: 1,
      type: 'anagram',
      question: "Unscramble the letters: R T E A H",
      answer: "EARTH",
      explanation: "The letters R, T, E, A, H can be rearranged to form EARTH."
    },
    {
      id: 2,
      type: 'synonym',
      question: "What is a synonym for 'happy'?",
      answer: "JOYFUL",
      alternatives: ["GLAD", "CHEERFUL", "DELIGHTED", "PLEASED"],
      explanation: "Joyful is a synonym for happy, meaning feeling or showing great pleasure."
    },
    {
      id: 3,
      type: 'word_ladder',
      question: "Change one letter to transform 'CAT' into 'DOG' (show intermediate steps):",
      answer: "CAT -> COT -> DOT -> DOG",
      explanation: "CAT → COT (change A to O) → DOT (change C to D) → DOG (change T to G)"
    },
    {
      id: 4,
      type: 'definition',
      question: "What word means 'a person who studies the stars'?",
      answer: "ASTRONOMER",
      explanation: "An astronomer is a scientist who studies celestial objects and phenomena."
    },
    {
      id: 5,
      type: 'word_find',
      question: "Find a 5-letter word that means 'very large':",
      answer: "GIANT",
      explanation: "Giant means very large or enormous in size."
    }
  ]

  useEffect(() => {
    const savedScore = localStorage.getItem('studyhub-word-score')
    if (savedScore) {
      setScore(JSON.parse(savedScore))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('studyhub-word-score', JSON.stringify(score))
  }, [score])

  const currentGame = games[currentGameIndex]
  const isAnswered = answeredGames.has(currentGame.id)
  
  const checkAnswer = (answer) => {
    const normalizedAnswer = answer.toUpperCase().trim()
    const normalizedCorrect = currentGame.answer.toUpperCase().trim()
    
    if (normalizedAnswer === normalizedCorrect) return true
    
    if (currentGame.alternatives) {
      return currentGame.alternatives.some(alt => 
        normalizedAnswer === alt.toUpperCase()
      )
    }
    
    return false
  }

  const isCorrect = checkAnswer(userAnswer)

  const handleSubmit = () => {
    if (!userAnswer.trim()) return
    
    setShowAnswer(true)
    setAnsweredGames(prev => new Set([...prev, currentGame.id]))
    
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
    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex(prev => prev + 1)
      setUserAnswer('')
      setShowAnswer(false)
    }
  }

  const handlePrev = () => {
    if (currentGameIndex > 0) {
      setCurrentGameIndex(prev => prev - 1)
      setUserAnswer('')
      setShowAnswer(false)
    }
  }

  const handleReset = () => {
    setCurrentGameIndex(0)
    setUserAnswer('')
    setShowAnswer(false)
    setAnsweredGames(new Set())
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
            <h1 className="text-3xl font-display font-bold text-cozy-900">Word Games</h1>
            <p className="text-cozy-600 mt-1">Vocabulary and word challenges.</p>
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
            <BookOpen size={24} className="text-indigo-600" />
            <h2 className="text-2xl font-display font-bold text-cozy-900">Challenge {currentGameIndex + 1} of {games.length}</h2>
          </div>
          <p className="text-xl text-cozy-700 leading-relaxed">
            {currentGame.question}
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
              <p className="text-cozy-700 leading-relaxed">
                {currentGame.explanation}
              </p>
              {!isCorrect && (
                <p className="text-cozy-700 mt-2">
                  The correct answer is: <span className="font-bold text-cozy-900">{currentGame.answer}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
          <button
            onClick={handlePrev}
            disabled={currentGameIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentGameIndex === games.length - 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default WordGames

