import { useState, useEffect, useRef } from 'react'
import { Puzzle, Brain, RotateCcw, CheckCircle2, XCircle, ArrowLeft, Zap, Trophy, Clock, Flame } from 'lucide-react'

const LogicGames = ({ onBack }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [answeredPuzzles, setAnsweredPuzzles] = useState(new Set())
  const [totalCorrect, setTotalCorrect] = useState(0)
  const timerRef = useRef(null)
  const autoAdvanceRef = useRef(null)

  const puzzles = [
    {
      id: 1,
      question: "If all roses are flowers, and some flowers are red, which statement must be true?",
      options: [
        "All roses are red",
        "Some roses are red",
        "No roses are red",
        "Cannot be determined"
      ],
      correctAnswer: 1,
      explanation: "Since all roses are flowers, and some flowers are red, it's possible that some roses are red. However, we cannot conclude that all roses are red, or that no roses are red, based on the given information."
    },
    {
      id: 2,
      question: "A train leaves Station A at 3:00 PM and travels at 60 mph. Another train leaves Station B at 3:30 PM and travels at 80 mph. If the stations are 200 miles apart, when will they meet?",
      options: [
        "4:00 PM",
        "4:30 PM",
        "5:00 PM",
        "5:30 PM"
      ],
      correctAnswer: 2,
      explanation: "By 3:30 PM, the first train has traveled 30 miles. The remaining distance is 170 miles. The relative speed is 140 mph. Time to meet = 170/140 ≈ 1.21 hours. Adding to 3:30 PM gives approximately 4:43 PM, closest to 5:00 PM."
    },
    {
      id: 3,
      question: "In a group of 30 students, 18 study Math, 15 study Physics, and 10 study both. How many students study neither?",
      options: [
        "5",
        "7",
        "10",
        "12"
      ],
      correctAnswer: 1,
      explanation: "Using inclusion-exclusion: Students studying Math or Physics = 18 + 15 - 10 = 23. Students studying neither = 30 - 23 = 7."
    },
    {
      id: 4,
      question: "Three friends - Alice, Bob, and Charlie - are sitting in a row. Alice is not at either end, and Bob is sitting to the right of Alice. Who is sitting in the middle?",
      options: [
        "Alice",
        "Bob",
        "Charlie",
        "Cannot be determined"
      ],
      correctAnswer: 0,
      explanation: "Since Alice is not at either end, she must be in the middle. Bob is to the right of Alice, so the order is: Charlie (left), Alice (middle), Bob (right)."
    },
    {
      id: 5,
      question: "If all cats are animals, and some animals are pets, which statement is definitely true?",
      options: [
        "All cats are pets",
        "Some cats are pets",
        "No cats are pets",
        "Cannot be determined"
      ],
      correctAnswer: 3,
      explanation: "We know all cats are animals, and some animals are pets. However, we cannot determine if any cats are pets based on this information alone."
    },
    {
      id: 6,
      question: "If today is Monday, what day will it be 100 days from now?",
      options: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday"
      ],
      correctAnswer: 2,
      explanation: "100 days = 14 weeks + 2 days. Since 14 weeks brings us back to Monday, adding 2 days gives Wednesday."
    },
    {
      id: 7,
      question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
      options: [
        "0°",
        "7.5°",
        "15°",
        "30°"
      ],
      correctAnswer: 1,
      explanation: "At 3:15, the hour hand is at 3.25 hours (3 + 15/60) = 97.5°, and the minute hand is at 90°. The difference is 7.5°."
    },
    {
      id: 8,
      question: "If you flip a coin 3 times, what is the probability of getting exactly 2 heads?",
      options: [
        "1/8",
        "3/8",
        "1/2",
        "3/4"
      ],
      correctAnswer: 1,
      explanation: "There are 8 possible outcomes. The outcomes with exactly 2 heads are: HHT, HTH, THH (3 outcomes). So the probability is 3/8."
    },
    {
      id: 9,
      question: "What is the next number in the sequence: 1, 4, 9, 16, 25, ?",
      options: [
        "30",
        "36",
        "40",
        "49"
      ],
      correctAnswer: 1,
      explanation: "These are perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, so the next is 6²=36."
    },
    {
      id: 10,
      question: "If 5 workers can build a wall in 10 days, how many days will it take 10 workers?",
      options: [
        "5 days",
        "10 days",
        "15 days",
        "20 days"
      ],
      correctAnswer: 0,
      explanation: "If 5 workers take 10 days, the total work is 50 worker-days. With 10 workers, it takes 50/10 = 5 days."
    }
  ]

  const currentPuzzle = puzzles[currentPuzzleIndex]
  const isAnswered = answeredPuzzles.has(currentPuzzle.id)
  const isCorrect = selectedAnswer === currentPuzzle.correctAnswer

  // Timer countdown
  useEffect(() => {
    if (isGameActive && !isAnswered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isGameActive, isAnswered, timeLeft])

  // Auto-advance to next question
  useEffect(() => {
    if (showResult) {
      autoAdvanceRef.current = setTimeout(() => {
        handleNextQuestion()
      }, 2500)
    }

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current)
      }
    }
  }, [showResult])

  const handleStartGame = () => {
    setGameStarted(true)
    setIsGameActive(true)
    setTimeLeft(30)
  }

  const handleSelectAnswer = (answerIndex) => {
    if (isAnswered || !isGameActive) return
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    setIsGameActive(false)
    setAnsweredPuzzles(prev => new Set([...prev, currentPuzzle.id]))
    
    const isCorrectAnswer = answerIndex === currentPuzzle.correctAnswer
    const timeBonus = Math.floor(timeLeft * 10) // 10 points per second remaining
    const streakBonus = streak > 0 ? streak * 50 : 0 // 50 points per streak
    const basePoints = isCorrectAnswer ? 100 : 0
    const totalPoints = basePoints + timeBonus + streakBonus
    
    if (isCorrectAnswer) {
      setPoints(prev => prev + totalPoints)
      setStreak(prev => prev + 1)
      setTotalCorrect(prev => prev + 1)
    } else {
      setStreak(0)
    }
  }

  const handleTimeUp = () => {
    if (isAnswered) return
    
    setSelectedAnswer(-1) // -1 means time ran out
    setShowResult(true)
    setIsGameActive(false)
    setAnsweredPuzzles(prev => new Set([...prev, currentPuzzle.id]))
    setStreak(0)
  }

  const handleNextQuestion = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsGameActive(true)
      setTimeLeft(30)
    } else {
      // Game complete
      setGameComplete(true)
      setIsGameActive(false)
    }
  }

  const handleResetGame = () => {
    setCurrentPuzzleIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setPoints(0)
    setStreak(0)
    setTimeLeft(30)
    setIsGameActive(false)
    setGameStarted(false)
    setGameComplete(false)
    setAnsweredPuzzles(new Set())
    setTotalCorrect(0)
    if (timerRef.current) clearInterval(timerRef.current)
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
  }

  const getAccuracy = () => {
    return answeredPuzzles.size > 0 
      ? Math.round((totalCorrect / answeredPuzzles.size) * 100) 
      : 0
  }

  if (!gameStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold text-cozy-900">Logic Games</h1>
              <p className="text-cozy-600 mt-1">Test your logical reasoning skills in a fun quiz game!</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Puzzle size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Ready to Play?</h2>
            <p className="text-purple-100 mb-6 text-lg">
              Answer {puzzles.length} logic questions as fast as you can!
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <Clock size={24} className="mx-auto mb-2" />
                <p className="text-sm">30s per question</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <Zap size={24} className="mx-auto mb-2" />
                <p className="text-sm">Time bonus</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <Flame size={24} className="mx-auto mb-2" />
                <p className="text-sm">Streak bonus</p>
              </div>
            </div>
            <button onClick={handleStartGame} className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors">
              Start Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameComplete) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold text-cozy-900">Game Complete!</h1>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Great Job!</h2>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <p className="text-4xl font-bold mb-2">{points}</p>
                <p className="text-sm">Total Points</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <p className="text-4xl font-bold mb-2">{totalCorrect}/{puzzles.length}</p>
                <p className="text-sm">Correct Answers</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <p className="text-4xl font-bold mb-2">{getAccuracy()}%</p>
                <p className="text-sm">Accuracy</p>
              </div>
            </div>
            <button onClick={handleResetGame} className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors mt-8">
              Play Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Game Stats Bar */}
      <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-1 justify-center mb-1">
                <Zap size={20} className="text-yellow-600" />
                <p className="text-2xl font-bold text-cozy-900">{points}</p>
              </div>
              <p className="text-xs text-cozy-600 font-medium">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 justify-center mb-1">
                <Flame size={20} className="text-red-600" />
                <p className="text-2xl font-bold text-red-600">{streak}</p>
              </div>
              <p className="text-xs text-cozy-600 font-medium">Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 justify-center mb-1">
                <CheckCircle2 size={20} className="text-green-600" />
                <p className="text-2xl font-bold text-green-600">{totalCorrect}/{puzzles.length}</p>
              </div>
              <p className="text-xs text-cozy-600 font-medium">Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 justify-center mb-1">
                <Clock size={20} className={timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-primary-600'} />
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-cozy-900'}`}>
                  {timeLeft}s
                </p>
              </div>
              <p className="text-xs text-cozy-600 font-medium">Time</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-cozy-600 font-medium">Question</p>
            <p className="text-xl font-bold text-cozy-900">
              {currentPuzzleIndex + 1} / {puzzles.length}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="mb-2">
          <div className="w-full bg-cozy-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentPuzzleIndex + 1) / puzzles.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Puzzle size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-cozy-900">Question {currentPuzzleIndex + 1}</h2>
          </div>
          <p className="text-xl text-cozy-700 leading-relaxed font-medium">
            {currentPuzzle.question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {currentPuzzle.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectOption = index === currentPuzzle.correctAnswer
            let buttonClass = "w-full p-5 text-left border-2 rounded-xl transition-all duration-200 font-medium text-lg relative overflow-hidden"
            
            if (showResult) {
              if (isCorrectOption) {
                buttonClass += " border-green-500 bg-green-50 text-green-900 animate-pulse"
              } else if (isSelected && !isCorrectOption) {
                buttonClass += " border-red-500 bg-red-50 text-red-900"
              } else {
                buttonClass += " border-cozy-200 bg-cozy-50 text-cozy-600 opacity-60"
              }
            } else {
              buttonClass += isSelected
                ? " border-primary-500 bg-primary-50 text-primary-900 scale-105"
                : " border-cozy-200 hover:border-primary-300 hover:bg-primary-50 text-cozy-900 cursor-pointer hover:scale-105"
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult || !isGameActive}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-600 mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span className="flex-1">{option}</span>
                  {showResult && (
                    <>
                      {isCorrectOption && (
                        <CheckCircle2 size={24} className="text-green-600 ml-2" />
                      )}
                      {isSelected && !isCorrectOption && (
                        <XCircle size={24} className="text-red-600 ml-2" />
                      )}
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Result Display */}
        {showResult && (
          <div className={`p-6 rounded-xl mb-6 animate-fade-in ${
            isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
          }`}>
            <div className="flex items-start space-x-3 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle2 size={28} className="text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-900 mb-1">Correct! 🎉</h3>
                    {streak > 1 && (
                      <p className="text-green-700 font-semibold">
                        {streak}x Streak! +{streak * 50} bonus points!
                      </p>
                    )}
                    <p className="text-green-700">
                      +{100 + Math.floor(timeLeft * 10) + (streak > 0 ? streak * 50 : 0)} points
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={28} className="text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-yellow-900 mb-1">
                      {selectedAnswer === -1 ? "Time's Up! ⏰" : "Not quite right"}
                    </h3>
                    <p className="text-yellow-700">The correct answer was: <span className="font-bold">{currentPuzzle.options[currentPuzzle.correctAnswer]}</span></p>
                  </div>
                </>
              )}
            </div>
            <p className="text-cozy-700 leading-relaxed mt-3">{currentPuzzle.explanation}</p>
            <p className="text-sm text-cozy-600 mt-4">Next question in 2 seconds...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogicGames
