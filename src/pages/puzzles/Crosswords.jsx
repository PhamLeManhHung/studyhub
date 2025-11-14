import { useState } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react'

const Crosswords = ({ onBack }) => {
  const [answers, setAnswers] = useState({})
  const [isComplete, setIsComplete] = useState(false)

  const clues = {
    across: [
      { num: 1, clue: "Opposite of down", answer: "UP", length: 2 },
      { num: 3, clue: "A large body of water", answer: "OCEAN", length: 5 },
      { num: 6, clue: "A furry pet", answer: "CAT", length: 3 },
    ],
    down: [
      { num: 1, clue: "To consume food", answer: "EAT", length: 3 },
      { num: 2, clue: "A type of fruit", answer: "PEAR", length: 4 },
      { num: 4, clue: "Opposite of cold", answer: "HOT", length: 3 },
    ]
  }

  const handleInputChange = (key, value) => {
    const newAnswers = { ...answers, [key]: value.toUpperCase() }
    setAnswers(newAnswers)
    checkCompletion(newAnswers)
  }

  const checkCompletion = (currentAnswers) => {
    const allClues = [...clues.across, ...clues.down]
    const allCorrect = allClues.every(clue => {
      const key = `${clue.num}-${clue.clue.substring(0, 5)}`
      return currentAnswers[key]?.toUpperCase() === clue.answer
    })
    setIsComplete(allCorrect)
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
            <h1 className="text-3xl font-display font-bold text-cozy-900">Crosswords</h1>
            <p className="text-cozy-600 mt-1">Solve the word puzzle with intersecting clues.</p>
          </div>
        </div>
        <button onClick={() => { setAnswers({}); setIsComplete(false) }} className="btn-primary flex items-center space-x-2">
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      {isComplete && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={24} className="text-green-600" />
            <p className="text-lg font-semibold text-green-900">Well done! You completed the crossword!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Crossword Grid</h2>
          <div className="bg-cozy-50 p-4 rounded-xl">
            <p className="text-cozy-600 text-center py-12">
              Crossword grid visualization would go here. For now, use the clues below to solve!
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-display font-semibold text-cozy-900 mb-4">Clues</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold text-cozy-900 mb-3">Across</h3>
            <div className="space-y-3">
              {clues.across.map((clue) => {
                const key = `${clue.num}-${clue.clue.substring(0, 5)}`
                const isCorrect = answers[key]?.toUpperCase() === clue.answer
                return (
                  <div key={clue.num} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary-600">{clue.num}.</span>
                      <span className="text-sm text-cozy-700">{clue.clue}</span>
                      <span className="text-xs text-cozy-500">({clue.length})</span>
                    </div>
                    <input
                      type="text"
                      value={answers[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      maxLength={clue.length}
                      className={`input-field text-center text-lg font-bold ${
                        isCorrect && answers[key] ? 'bg-green-50 border-green-500' : ''
                      }`}
                      placeholder={'_'.repeat(clue.length)}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-cozy-900 mb-3">Down</h3>
            <div className="space-y-3">
              {clues.down.map((clue) => {
                const key = `${clue.num}-${clue.clue.substring(0, 5)}`
                const isCorrect = answers[key]?.toUpperCase() === clue.answer
                return (
                  <div key={clue.num} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary-600">{clue.num}.</span>
                      <span className="text-sm text-cozy-700">{clue.clue}</span>
                      <span className="text-xs text-cozy-500">({clue.length})</span>
                    </div>
                    <input
                      type="text"
                      value={answers[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      maxLength={clue.length}
                      className={`input-field text-center text-lg font-bold ${
                        isCorrect && answers[key] ? 'bg-green-50 border-green-500' : ''
                      }`}
                      placeholder={'_'.repeat(clue.length)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Crosswords

