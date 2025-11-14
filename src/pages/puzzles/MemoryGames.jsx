import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2, Brain } from 'lucide-react'

const MemoryGames = ({ onBack }) => {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const symbols = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒']

  const initializeGame = () => {
    const cardPairs = [...symbols, ...symbols]
    const shuffled = cardPairs.sort(() => Math.random() - 0.5)
    const newCards = shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }))
    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setIsComplete(false)
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (matchedPairs.length === symbols.length) {
      setIsComplete(true)
    }
  }, [matchedPairs.length])

  const handleCardClick = (cardId) => {
    const card = cards[cardId]
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    )
    setCards(newCards)
    setFlippedCards([...flippedCards, cardId])

    if (flippedCards.length === 1) {
      const firstCard = cards[flippedCards[0]]
      const secondCard = card
      
      setMoves(prev => prev + 1)

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === flippedCards[0] || c.id === cardId
                ? { ...c, isMatched: true, isFlipped: false }
                : c
            )
          )
          setMatchedPairs(prev => [...prev, firstCard.symbol])
          setFlippedCards([])
        }, 500)
      } else {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === flippedCards[0] || c.id === cardId
                ? { ...c, isFlipped: false }
                : c
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
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
            <h1 className="text-3xl font-display font-bold text-cozy-900">Memory Games</h1>
            <p className="text-cozy-600 mt-1">Test your memory and recall abilities.</p>
          </div>
        </div>
        <button onClick={initializeGame} className="btn-primary flex items-center space-x-2">
          <RotateCcw size={20} />
          <span>New Game</span>
        </button>
      </div>

      {isComplete && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={24} className="text-green-600" />
            <p className="text-lg font-semibold text-green-900">
              Congratulations! You completed the game in {moves} moves!
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Brain size={24} className="text-purple-600" />
            <h2 className="text-xl font-display font-semibold text-cozy-900">Memory Match</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-cozy-600">Moves</p>
              <p className="text-2xl font-bold text-cozy-900">{moves}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-cozy-600">Matched</p>
              <p className="text-2xl font-bold text-green-600">{matchedPairs.length}/{symbols.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center text-4xl ${
                card.isFlipped || card.isMatched
                  ? 'bg-white border-primary-500'
                  : 'bg-primary-100 border-primary-300 hover:bg-primary-200'
              } ${
                card.isMatched ? 'opacity-50' : ''
              }`}
              disabled={card.isMatched}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-cozy-600 mt-6">
          Click cards to flip them. Match pairs to win!
        </p>
      </div>
    </div>
  )
}

export default MemoryGames

