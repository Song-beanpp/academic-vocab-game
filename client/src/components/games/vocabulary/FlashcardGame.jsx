import { useState, useEffect } from 'react'

const FlashcardGame = ({ data, onComplete }) => {
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [mastered, setMastered] = useState(0)
  const [reviewed, setReviewed] = useState(0)
  const [showFeedback, setShowFeedback] = useState(null)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Shuffle and take 10 cards
      const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 10)
      setCards(shuffled)
    }
  }, [data])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMastered = () => {
    setMastered(mastered + 1)
    setShowFeedback({ type: 'mastered', message: 'Great! Word mastered!' })
    setTimeout(() => {
      setShowFeedback(null)
      nextCard()
    }, 800)
  }

  const handleReview = () => {
    setReviewed(reviewed + 1)
    setShowFeedback({ type: 'review', message: 'Marked for review - will appear again' })
    setTimeout(() => {
      setShowFeedback(null)
      nextCard()
    }, 800)
  }

  const nextCard = () => {
    setIsFlipped(false)
    if (currentIndex < cards.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 300)
    } else {
      // Complete the task - score based on mastered words
      const correctRate = mastered / cards.length
      onComplete(correctRate)
    }
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  if (cards.length === 0) {
    return <div className="text-center py-12">Loading cards...</div>
  }

  const currentCard = cards[currentIndex]

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <div className="flex gap-3">
            <span className="text-green-600">Mastered: {mastered}</span>
            <span className="text-yellow-600">Review: {reviewed}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Feedback Toast */}
      {showFeedback && (
        <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
          showFeedback.type === 'mastered'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {showFeedback.message}
        </div>
      )}

      {/* Flashcard */}
      <div
        className={`flip-card h-80 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentCard.word}
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation()
                speakWord(currentCard.word)
              }}
              className="p-2 text-primary-600 hover:text-primary-700"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <p className="text-sm text-gray-400 mt-4">Tap to flip</p>
          </div>

          {/* Back */}
          <div className="flip-card-back bg-primary-50 rounded-xl shadow-lg p-6 overflow-y-auto">
            <h3 className="text-xl font-bold text-primary-800 mb-2">
              {currentCard.word}
            </h3>
            <p className="text-gray-700 mb-4">
              {currentCard.definition}
            </p>
            {currentCard.examples && currentCard.examples.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Examples:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentCard.examples.slice(0, 2).map((ex, i) => (
                    <li key={i} className="italic">{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            {currentCard.wordFamily && currentCard.wordFamily.length > 0 && (
              <p className="text-sm text-gray-500 mt-3">
                Word family: {currentCard.wordFamily.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleReview}
          className="flex-1 py-3 px-4 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition"
        >
          Review Again
        </button>
        <button
          onClick={handleMastered}
          className="flex-1 py-3 px-4 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition"
        >
          Mastered
        </button>
      </div>
    </div>
  )
}

export default FlashcardGame
