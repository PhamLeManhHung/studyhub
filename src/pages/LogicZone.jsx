import { useState } from 'react'
import { Puzzle, Brain, Sparkles, ArrowLeft, Loader2, X } from 'lucide-react'
import { generatePuzzle } from '../utils/aiService'
import LogicGames from './puzzles/LogicGames'
import Sudoku from './puzzles/Sudoku'
import Crosswords from './puzzles/Crosswords'
import Riddles from './puzzles/Riddles'
import MathPuzzles from './puzzles/MathPuzzles'
import MemoryGames from './puzzles/MemoryGames'
import WordGames from './puzzles/WordGames'
import Patterns from './puzzles/Patterns'

const LogicZone = () => {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null)
  const [aiPuzzleModal, setAiPuzzleModal] = useState(false)
  const [generatedPuzzle, setGeneratedPuzzle] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [puzzleDifficulty, setPuzzleDifficulty] = useState('medium')

  const puzzleCategories = [
    { 
      id: 'sudoku', 
      name: 'Sudoku', 
      icon: '🔢', 
      difficulty: 'Medium', 
      color: 'bg-blue-100', 
      iconColor: 'text-blue-600',
      description: 'Classic number puzzle game'
    },
    { 
      id: 'crosswords', 
      name: 'Crosswords', 
      icon: '✏️', 
      difficulty: 'Hard', 
      color: 'bg-purple-100', 
      iconColor: 'text-purple-600',
      description: 'Word puzzle with intersecting clues'
    },
    { 
      id: 'riddles', 
      name: 'Riddles', 
      icon: '❓', 
      difficulty: 'Easy', 
      color: 'bg-green-100', 
      iconColor: 'text-green-600',
      description: 'Brain teasers and tricky questions'
    },
    { 
      id: 'math', 
      name: 'Math Puzzles', 
      icon: '➕', 
      difficulty: 'Medium', 
      color: 'bg-yellow-100', 
      iconColor: 'text-yellow-600',
      description: 'Mathematical challenges and problems'
    },
    { 
      id: 'logic', 
      name: 'Logic Games', 
      icon: '🎮', 
      difficulty: 'Hard', 
      color: 'bg-red-100', 
      iconColor: 'text-red-600',
      description: 'Logical reasoning and deduction'
    },
    { 
      id: 'memory', 
      name: 'Memory Games', 
      icon: '🧠', 
      difficulty: 'Easy', 
      color: 'bg-pink-100', 
      iconColor: 'text-pink-600',
      description: 'Test your memory and recall'
    },
    { 
      id: 'word', 
      name: 'Word Games', 
      icon: '📝', 
      difficulty: 'Medium', 
      color: 'bg-indigo-100', 
      iconColor: 'text-indigo-600',
      description: 'Vocabulary and word challenges'
    },
    { 
      id: 'patterns', 
      name: 'Patterns', 
      icon: '🌀', 
      difficulty: 'Hard', 
      color: 'bg-teal-100', 
      iconColor: 'text-teal-600',
      description: 'Identify and complete patterns'
    },
  ]

  const handleSelectPuzzle = (puzzleId) => {
    setSelectedPuzzle(puzzleId)
  }

  const handleBack = () => {
    setSelectedPuzzle(null)
  }

  const renderPuzzle = () => {
    switch (selectedPuzzle) {
      case 'sudoku':
        return <Sudoku onBack={handleBack} />
      case 'crosswords':
        return <Crosswords onBack={handleBack} />
      case 'riddles':
        return <Riddles onBack={handleBack} />
      case 'math':
        return <MathPuzzles onBack={handleBack} />
      case 'logic':
        return <LogicGames onBack={handleBack} />
      case 'memory':
        return <MemoryGames onBack={handleBack} />
      case 'word':
        return <WordGames onBack={handleBack} />
      case 'patterns':
        return <Patterns onBack={handleBack} />
      default:
        return null
    }
  }

  if (selectedPuzzle) {
    return renderPuzzle()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Logic Zone</h1>
          <p className="text-cozy-600 mt-1">Challenge your mind with puzzles and logic games.</p>
        </div>
        <button 
          onClick={() => setAiPuzzleModal(true)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Sparkles size={20} />
          <span>AI Generate</span>
        </button>
      </div>

      {/* Puzzle Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {puzzleCategories.map((puzzle) => (
          <button
            key={puzzle.id}
            onClick={() => handleSelectPuzzle(puzzle.id)}
            className="card-hover text-left"
          >
            <div className={`w-16 h-16 ${puzzle.color} rounded-xl flex items-center justify-center text-3xl mb-4`}>
              {puzzle.icon}
            </div>
            <h3 className="font-display font-semibold text-cozy-900 mb-1">{puzzle.name}</h3>
            <p className="text-xs text-cozy-500 mb-2">{puzzle.description}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${puzzle.color} ${puzzle.iconColor}`}>
              {puzzle.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Challenge */}
      <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold">Daily Challenge</h2>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Puzzle size={24} />
          </div>
        </div>
        <p className="text-purple-100 mb-4">
          Complete today's featured puzzle and earn points! Challenge yourself with a random puzzle from any category.
        </p>
        <button 
          onClick={() => {
            const randomPuzzle = puzzleCategories[Math.floor(Math.random() * puzzleCategories.length)]
            handleSelectPuzzle(randomPuzzle.id)
          }}
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
        >
          Start Random Challenge
        </button>
      </div>

      {/* Study Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-cozy-900 mb-1">Puzzle Tips</h3>
            <p className="text-cozy-700">
              Start with easier puzzles to build confidence, then gradually move to more challenging ones. 
              Take breaks between sessions to keep your mind fresh. Practice regularly to improve your problem-solving skills!
            </p>
          </div>
        </div>
      </div>

      {/* AI Generate Puzzle Modal */}
      {aiPuzzleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">AI Generate Puzzle</h2>
              <button
                onClick={() => {
                  setAiPuzzleModal(false)
                  setGeneratedPuzzle(null)
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">Difficulty Level</label>
                <select
                  value={puzzleDifficulty}
                  onChange={(e) => setPuzzleDifficulty(e.target.value)}
                  className="input-field"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {isGenerating ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={32} className="text-primary-600 animate-spin mr-3" />
                  <span className="text-cozy-600">AI is generating your puzzle...</span>
                </div>
              ) : generatedPuzzle ? (
                <div className="space-y-4">
                  <div className="card bg-primary-50 border-primary-200">
                    <h3 className="font-semibold text-cozy-900 mb-3">Generated Puzzle</h3>
                    <p className="text-cozy-700 mb-4">{generatedPuzzle.question}</p>
                    <div className="space-y-2">
                      {generatedPuzzle.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-xl border-2 ${
                            index === generatedPuzzle.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : 'border-cozy-200 bg-white'
                          }`}
                        >
                          <span className="font-medium text-primary-600 mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <p className="text-sm text-cozy-700">
                        <strong>Explanation:</strong> {generatedPuzzle.explanation}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={async () => {
                        setIsGenerating(true)
                        try {
                          const puzzle = await generatePuzzle(puzzleDifficulty, 'general')
                          setGeneratedPuzzle(puzzle)
                        } catch (error) {
                          alert('Error generating puzzle. Please try again.')
                        } finally {
                          setIsGenerating(false)
                        }
                      }}
                      className="btn-secondary flex-1"
                    >
                      Generate Another
                    </button>
                    <button
                      onClick={() => {
                        setAiPuzzleModal(false)
                        setGeneratedPuzzle(null)
                        handleSelectPuzzle('logic')
                      }}
                      className="btn-primary flex-1"
                    >
                      Try This Puzzle
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    setIsGenerating(true)
                    try {
                      const puzzle = await generatePuzzle(puzzleDifficulty, 'general')
                      setGeneratedPuzzle(puzzle)
                    } catch (error) {
                      alert('Error generating puzzle. Please try again.')
                    } finally {
                      setIsGenerating(false)
                    }
                  }}
                  className="btn-primary w-full"
                >
                  Generate Puzzle
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogicZone
