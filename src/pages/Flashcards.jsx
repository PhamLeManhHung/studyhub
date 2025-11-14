import { useState, useEffect } from 'react'
import { Plus, CreditCard, Play, X, Edit2, Trash2, RotateCcw, Sparkles, BookOpen, Shuffle, Loader2 } from 'lucide-react'
import { generateFlashcards } from '../utils/aiService'

const Flashcards = () => {
  const [decks, setDecks] = useState([])
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isQuizMode, setIsQuizMode] = useState(false)
  const [currentDeck, setCurrentDeck] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [flippedCards, setFlippedCards] = useState(new Set())
  const [editingDeck, setEditingDeck] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [deckFormData, setDeckFormData] = useState({
    title: '',
    subject: '',
  })
  const [cardFormData, setCardFormData] = useState({
    question: '',
    answer: '',
  })
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [aiGenerateModal, setAiGenerateModal] = useState(false)
  const [aiInputText, setAiInputText] = useState('')
  const [aiCardCount, setAiCardCount] = useState(5)

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'ICT', 'GCED', 'CLISE', 'Vietnamese Studies']

  // Load decks from localStorage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem('studyhub-flashcards')
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks))
    }
  }, [])

  // Save decks to localStorage whenever decks change
  useEffect(() => {
    localStorage.setItem('studyhub-flashcards', JSON.stringify(decks))
  }, [decks])

  // Handle deck form input change
  const handleDeckInputChange = (e) => {
    const { name, value } = e.target
    setDeckFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle card form input change
  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    setCardFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Open modal for adding new deck
  const handleAddDeck = () => {
    setEditingDeck(null)
    setDeckFormData({
      title: '',
      subject: '',
    })
    setIsDeckModalOpen(true)
  }

  // Open modal for editing deck
  const handleEditDeck = (deck) => {
    setEditingDeck(deck)
    setDeckFormData({
      title: deck.title,
      subject: deck.subject || '',
    })
    setIsDeckModalOpen(true)
  }

  // Save deck (add or update)
  const handleSaveDeck = () => {
    if (!deckFormData.title.trim()) return

    if (editingDeck) {
      // Update existing deck
      setDecks(decks.map(deck =>
        deck.id === editingDeck.id
          ? {
              ...deck,
              title: deckFormData.title,
              subject: deckFormData.subject,
            }
          : deck
      ))
    } else {
      // Add new deck
      const newDeck = {
        id: Date.now().toString(),
        title: deckFormData.title,
        subject: deckFormData.subject,
        cards: [],
        createdAt: new Date().toISOString(),
      }
      setDecks([...decks, newDeck])
    }

    setIsDeckModalOpen(false)
    setEditingDeck(null)
    setDeckFormData({
      title: '',
      subject: '',
    })
  }

  // Delete deck
  const handleDeleteDeck = (deckId) => {
    if (window.confirm('Are you sure you want to delete this deck? All cards will be deleted.')) {
      setDecks(decks.filter(deck => deck.id !== deckId))
      if (currentDeck?.id === deckId) {
        setCurrentDeck(null)
        setIsQuizMode(false)
      }
    }
  }

  // Open deck to view/edit cards
  const handleOpenDeck = (deck) => {
    setCurrentDeck(deck)
    setIsQuizMode(false)
    setCurrentCardIndex(0)
    setFlippedCards(new Set())
  }

  // Open modal for adding new card
  const handleAddCard = () => {
    if (!currentDeck) return
    setEditingCard(null)
    setCardFormData({
      question: '',
      answer: '',
    })
    setIsCardModalOpen(true)
  }

  // Open modal for editing card
  const handleEditCard = (card) => {
    setEditingCard(card)
    setCardFormData({
      question: card.question,
      answer: card.answer,
    })
    setIsCardModalOpen(true)
  }

  // Save card (add or update)
  const handleSaveCard = () => {
    if (!cardFormData.question.trim() || !cardFormData.answer.trim()) return
    if (!currentDeck) return

    const updatedDecks = decks.map(deck => {
      if (deck.id === currentDeck.id) {
        if (editingCard) {
          // Update existing card
          const updatedCards = deck.cards.map(card =>
            card.id === editingCard.id
              ? {
                  ...card,
                  question: cardFormData.question,
                  answer: cardFormData.answer,
                }
              : card
          )
          return { ...deck, cards: updatedCards }
        } else {
          // Add new card
          const newCard = {
            id: Date.now().toString(),
            question: cardFormData.question,
            answer: cardFormData.answer,
            createdAt: new Date().toISOString(),
          }
          return { ...deck, cards: [...deck.cards, newCard] }
        }
      }
      return deck
    })

    setDecks(updatedDecks)
    setCurrentDeck(updatedDecks.find(d => d.id === currentDeck.id))
    setIsCardModalOpen(false)
    setEditingCard(null)
    setCardFormData({
      question: '',
      answer: '',
    })
  }

  // Delete card
  const handleDeleteCard = (cardId) => {
    if (!currentDeck) return
    if (window.confirm('Are you sure you want to delete this card?')) {
      const updatedDecks = decks.map(deck => {
        if (deck.id === currentDeck.id) {
          return { ...deck, cards: deck.cards.filter(card => card.id !== cardId) }
        }
        return deck
      })
      setDecks(updatedDecks)
      const updatedDeck = updatedDecks.find(d => d.id === currentDeck.id)
      setCurrentDeck(updatedDeck)
      if (currentCardIndex >= updatedDeck.cards.length) {
        setCurrentCardIndex(Math.max(0, updatedDeck.cards.length - 1))
      }
    }
  }

  // Toggle card flip
  const handleFlipCard = (cardId) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  // Start quiz mode
  const handleStartQuiz = (deck) => {
    if (deck.cards.length === 0) {
      alert('This deck has no cards. Add some cards first!')
      return
    }
    setCurrentDeck(deck)
    setIsQuizMode(true)
    setCurrentCardIndex(0)
    setFlippedCards(new Set())
  }

  // Get random card for quiz
  const getRandomCard = () => {
    if (!currentDeck || currentDeck.cards.length === 0) return null
    const randomIndex = Math.floor(Math.random() * currentDeck.cards.length)
    return currentDeck.cards[randomIndex]
  }

  // Next random card in quiz mode
  const handleNextQuizCard = () => {
    if (!currentDeck) return
    const randomIndex = Math.floor(Math.random() * currentDeck.cards.length)
    setCurrentCardIndex(randomIndex)
    setFlippedCards(new Set())
  }

  // Navigate to next card
  const handleNextCard = () => {
    if (!currentDeck) return
    setCurrentCardIndex((prev) => (prev + 1) % currentDeck.cards.length)
    setFlippedCards(new Set())
  }

  // Navigate to previous card
  const handlePrevCard = () => {
    if (!currentDeck) return
    setCurrentCardIndex((prev) => (prev - 1 + currentDeck.cards.length) % currentDeck.cards.length)
    setFlippedCards(new Set())
  }

  // Close deck view
  const handleCloseDeck = () => {
    setCurrentDeck(null)
    setIsQuizMode(false)
    setCurrentCardIndex(0)
    setFlippedCards(new Set())
  }

  // AI Generate Flashcards handler
  const handleAIGenerate = () => {
    setAiGenerateModal(true)
  }

  const handleAIGenerateSubmit = async () => {
    if (!aiInputText.trim()) {
      alert('Please enter some text or topic to generate flashcards from.')
      return
    }

    setIsAIGenerating(true)
    try {
      const generatedCards = await generateFlashcards(aiInputText, aiCardCount)
      
      // Create a new deck with generated cards
      const newDeck = {
        id: Date.now().toString(),
        title: `AI Generated - ${new Date().toLocaleDateString()}`,
        subject: '',
        cards: generatedCards,
        createdAt: new Date().toISOString(),
      }
      
      setDecks([...decks, newDeck])
      setAiGenerateModal(false)
      setAiInputText('')
      setAiCardCount(5)
      alert(`Successfully generated ${generatedCards.length} flashcards!`)
    } catch (error) {
      alert('Error generating flashcards. Please try again.')
    } finally {
      setIsAIGenerating(false)
    }
  }

  // Get filtered decks by subject
  const getFilteredDecks = (subject) => {
    if (!subject || subject === 'all') return decks
    return decks.filter(deck => deck.subject === subject)
  }

  // Get all subjects from decks
  const getDeckSubjects = () => {
    const subjectSet = new Set(decks.map(deck => deck.subject).filter(Boolean))
    return Array.from(subjectSet).sort()
  }

  const currentCard = currentDeck && currentDeck.cards.length > 0 
    ? (isQuizMode ? getRandomCard() : currentDeck.cards[currentCardIndex])
    : null
  const isFlipped = currentCard ? flippedCards.has(currentCard.id) : false

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cozy-900">Flashcards</h1>
          <p className="text-cozy-600 mt-1">Create and study with interactive flashcards.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleAIGenerate} className="btn-secondary flex items-center space-x-2">
            <Sparkles size={20} />
            <span>AI Generate</span>
          </button>
          <button onClick={handleAddDeck} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
            <span>New Deck</span>
          </button>
        </div>
      </div>

      {!currentDeck ? (
        <>
          {/* Flashcard Decks Grid */}
          {decks.length === 0 ? (
            <div className="card text-center py-12">
              <CreditCard size={48} className="mx-auto text-cozy-300 mb-4" />
              <p className="text-cozy-600 text-lg mb-2">No flashcard decks yet. Create your first deck!</p>
              <button onClick={handleAddDeck} className="btn-primary mt-4">
                Create Your First Deck
              </button>
            </div>
          ) : (
            <>
              {/* Subject Filter */}
              <div className="card">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCurrentDeck(null)}
                    className="px-4 py-2 rounded-xl font-medium border border-cozy-300 hover:bg-cozy-50 transition-colors"
                  >
                    All Decks
                  </button>
                  {getDeckSubjects().map(subject => (
                    <button
                      key={subject}
                      className="px-4 py-2 rounded-xl font-medium border border-cozy-300 hover:bg-primary-50 hover:border-primary-300 transition-colors"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decks.map((deck) => (
                  <div key={deck.id} className="card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                        <h3 className="text-lg font-display font-semibold text-cozy-900">{deck.title}</h3>
                        <p className="text-sm text-cozy-500 mt-1">{deck.subject || 'Uncategorized'}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-cozy-600 font-medium">Cards</span>
                        <span className="text-cozy-900 font-semibold">{deck.cards.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-cozy-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenDeck(deck)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditDeck(deck)}
                          className="p-1 hover:bg-cozy-100 rounded text-cozy-600 hover:text-primary-600 transition-colors"
                          title="Edit deck"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteDeck(deck.id)}
                          className="p-1 hover:bg-red-50 rounded text-cozy-600 hover:text-red-600 transition-colors"
                          title="Delete deck"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleStartQuiz(deck)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                        disabled={deck.cards.length === 0}
                      >
                        <Play size={16} />
                        <span>Quiz</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* Deck View / Study Mode */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-cozy-900">{currentDeck.title}</h2>
                <p className="text-cozy-600 mt-1">
                  {currentDeck.subject || 'Uncategorized'} • {currentDeck.cards.length} cards
                  {isQuizMode && ' • Quiz Mode'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isQuizMode && (
                  <button
                    onClick={() => setIsQuizMode(false)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw size={16} />
                    <span>Exit Quiz</span>
                  </button>
                )}
                <button onClick={handleCloseDeck} className="btn-secondary">
                  <X size={20} />
                </button>
              </div>
            </div>

            {currentDeck.cards.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard size={48} className="mx-auto text-cozy-300 mb-4" />
                <p className="text-cozy-600 text-lg mb-4">This deck has no cards yet.</p>
                <button onClick={handleAddCard} className="btn-primary">
                  Add Your First Card
                </button>
              </div>
            ) : (
              <>
                {/* Flashcard Display */}
                <div className="mb-6">
                  <div
                    className="relative w-full max-w-2xl mx-auto"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className="relative w-full h-64 cursor-pointer group"
                      style={{ transformStyle: 'preserve-3d' }}
                      onClick={() => currentCard && handleFlipCard(currentCard.id)}
                    >
                      {/* Card Front */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-cozy-lg p-8 flex items-center justify-center transition-transform duration-500`}
                        style={{
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <div className="text-center text-white">
                          <p className="text-sm font-medium mb-2 opacity-90">Question</p>
                          <p className="text-2xl font-display font-bold">{currentCard?.question}</p>
                        </div>
                      </div>

                      {/* Card Back */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-primary-600 rounded-2xl shadow-cozy-lg p-8 flex items-center justify-center transition-transform duration-500`}
                        style={{
                          transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <div className="text-center text-white">
                          <p className="text-sm font-medium mb-2 opacity-90">Answer</p>
                          <p className="text-2xl font-display font-bold">{currentCard?.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isQuizMode && (
                    <div className="text-center mt-4 text-cozy-600">
                      Card {currentCardIndex + 1} of {currentDeck.cards.length}
                    </div>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {!isQuizMode && (
                    <>
                      <button
                        onClick={handlePrevCard}
                        className="btn-secondary"
                        disabled={currentDeck.cards.length === 0}
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNextCard}
                        className="btn-secondary"
                        disabled={currentDeck.cards.length === 0}
                      >
                        Next
                      </button>
                    </>
                  )}
                  {isQuizMode && (
                    <button
                      onClick={handleNextQuizCard}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Shuffle size={20} />
                      <span>Next Random Card</span>
                    </button>
                  )}
                </div>

                {/* Card List */}
                <div className="border-t border-cozy-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-display font-semibold text-cozy-900">All Cards</h3>
                    <button onClick={handleAddCard} className="btn-primary flex items-center space-x-2">
                      <Plus size={16} />
                      <span>Add Card</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentDeck.cards.map((card, index) => (
                      <div
                        key={card.id}
                        className="p-4 border border-cozy-200 rounded-xl hover:bg-cozy-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs text-cozy-500 font-medium">Card #{index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setCurrentCardIndex(index)
                                setFlippedCards(new Set())
                                setIsQuizMode(false)
                              }}
                              className="p-1 hover:bg-cozy-100 rounded text-cozy-600 hover:text-primary-600 transition-colors"
                              title="View card"
                            >
                              <CreditCard size={14} />
                            </button>
                            <button
                              onClick={() => handleEditCard(card)}
                              className="p-1 hover:bg-cozy-100 rounded text-cozy-600 hover:text-primary-600 transition-colors"
                              title="Edit card"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-1 hover:bg-red-50 rounded text-cozy-600 hover:text-red-600 transition-colors"
                              title="Delete card"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-cozy-900 font-medium mb-1">{card.question}</p>
                        <p className="text-sm text-cozy-600">{card.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Deck Modal */}
      {isDeckModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">
                {editingDeck ? 'Edit Deck' : 'New Deck'}
              </h2>
              <button
                onClick={() => {
                  setIsDeckModalOpen(false)
                  setEditingDeck(null)
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Deck Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={deckFormData.title}
                  onChange={handleDeckInputChange}
                  className="input-field"
                  placeholder="Enter deck title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={deckFormData.subject}
                  onChange={handleDeckInputChange}
                  className="input-field"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsDeckModalOpen(false)
                    setEditingDeck(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDeck}
                  className="btn-primary flex-1"
                  disabled={!deckFormData.title.trim()}
                >
                  {editingDeck ? 'Update Deck' : 'Create Deck'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">
                {editingCard ? 'Edit Card' : 'New Card'}
              </h2>
              <button
                onClick={() => {
                  setIsCardModalOpen(false)
                  setEditingCard(null)
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Question *
                </label>
                <textarea
                  name="question"
                  value={cardFormData.question}
                  onChange={handleCardInputChange}
                  className="input-field"
                  placeholder="Enter the question"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Answer *
                </label>
                <textarea
                  name="answer"
                  value={cardFormData.answer}
                  onChange={handleCardInputChange}
                  className="input-field"
                  placeholder="Enter the answer"
                  rows="3"
                  required
                />
      </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsCardModalOpen(false)
                    setEditingCard(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCard}
                  className="btn-primary flex-1"
                  disabled={!cardFormData.question.trim() || !cardFormData.answer.trim()}
                >
                  {editingCard ? 'Update Card' : 'Add Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {aiGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cozy-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-cozy-900">
                AI Generate Flashcards
              </h2>
              <button
                onClick={() => {
                  setAiGenerateModal(false)
                  setAiInputText('')
                }}
                className="p-2 hover:bg-cozy-100 rounded-lg text-cozy-600 hover:text-cozy-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Enter text or topic to generate flashcards from
                </label>
                <textarea
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  className="input-field"
                  placeholder="Paste your notes, textbook content, or describe a topic..."
                  rows="8"
                />
                <p className="text-xs text-cozy-500 mt-1">
                  The AI will analyze the text and create question-answer pairs for flashcards.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-700 mb-2">
                  Number of flashcards to generate
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={aiCardCount}
                  onChange={(e) => setAiCardCount(parseInt(e.target.value) || 5)}
                  className="input-field"
                />
              </div>

              {isAIGenerating ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={24} className="text-primary-600 animate-spin mr-3" />
                  <span className="text-cozy-600">AI is generating your flashcards...</span>
                </div>
              ) : (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setAiGenerateModal(false)
                      setAiInputText('')
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAIGenerateSubmit}
                    className="btn-primary flex-1"
                    disabled={!aiInputText.trim()}
                  >
                    Generate Flashcards
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Study Tips */}
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-cozy-900 mb-1">Study Tip</h3>
            <p className="text-cozy-700">
              Use spaced repetition! Review cards you struggle with more frequently to improve retention.
              Try quiz mode for random practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcards
