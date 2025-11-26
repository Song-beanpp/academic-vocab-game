import { useState, useEffect } from 'react'

const SpellingGame = ({ data, onComplete }) => {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 10)
      setWords(shuffled)
    }
  }, [data])

  const speakWord = () => {
    if ('speechSynthesis' in window && words[currentIndex]) {
      const utterance = new SpeechSynthesisUtterance(words[currentIndex].word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const currentWord = words[currentIndex]
    const isCorrect = input.toLowerCase().trim() === currentWord.word.toLowerCase()

    if (isCorrect) {
      setCorrect(correct + 1)
      setFeedback({ type: 'correct', message: 'Correct!' })
    } else {
      setFeedback({
        type: 'wrong',
        message: `Incorrect. The word is "${currentWord.word}"`
      })
    }

    setTimeout(() => {
      setFeedback(null)
      setInput('')
      setShowHint(false)

      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        const finalCorrect = isCorrect ? correct + 1 : correct
        onComplete(finalCorrect / words.length)
      }
    }, 3000)
  }

  if (words.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  const currentWord = words[currentIndex]

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Word {currentIndex + 1} of {words.length}</span>
          <span>Correct: {correct}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Spelling Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Listen and spell the word
        </h2>

        {/* Play Button */}
        <button
          onClick={speakWord}
          className="w-full py-4 bg-primary-100 text-primary-700 rounded-lg font-medium hover:bg-primary-200 transition flex items-center justify-center gap-2 mb-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Play Audio
        </button>

        {/* Definition Hint */}
        <p className="text-sm text-gray-600 mb-4 text-center">
          <strong>Definition:</strong> {currentWord.definition}
        </p>

        {/* First Letter Hint */}
        {showHint && (
          <p className="text-sm text-primary-600 mb-4 text-center">
            Hint: Starts with "{currentWord.word[0].toUpperCase()}"
          </p>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Type the word..."
            autoFocus
            disabled={feedback !== null}
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="flex-1 py-2 px-4 text-gray-600 hover:text-gray-800"
              disabled={showHint || feedback !== null}
            >
              Show Hint
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
              disabled={!input.trim() || feedback !== null}
            >
              Check
            </button>
          </div>
        </form>

        {/* Feedback */}
        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            feedback.type === 'correct'
              ? 'bg-green-100 text-green-700 animate-correct'
              : 'bg-red-100 text-red-700 animate-wrong'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpellingGame
