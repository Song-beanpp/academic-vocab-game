import { useState, useEffect } from 'react'

const StrengthRankingGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userOrder, setUserOrder] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setQuestions(data)
    }
  }, [data])

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      // Items are already shuffled from backend
      setUserOrder(questions[currentIndex].items.map((item, idx) => ({
        ...item,
        id: `${currentIndex}-${idx}`
      })))
    }
  }, [questions, currentIndex])

  const moveItem = (fromIndex, toIndex) => {
    if (feedback) return
    const newOrder = [...userOrder]
    const [removed] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, removed)
    setUserOrder(newOrder)
  }

  const handleSubmit = () => {
    // Check if order is correct (should be ascending by strength)
    let correctCount = 0
    const totalItems = userOrder.length

    for (let i = 0; i < totalItems; i++) {
      if (userOrder[i].strength === i + 1) {
        correctCount++
      }
    }

    const isAllCorrect = correctCount === totalItems
    const partialScore = correctCount / totalItems

    if (isAllCorrect) {
      setCorrect(correct + 1)
      setFeedback({ type: 'correct', score: 1 })
    } else {
      setFeedback({ type: 'wrong', score: partialScore })
    }

    setTimeout(() => {
      setFeedback(null)

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        const finalCorrect = isAllCorrect ? correct + 1 : correct
        onComplete(finalCorrect / questions.length)
      }
    }, 3000)
  }

  if (questions.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Correct: {correct}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Ranking Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
          Rank by hedging strength
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Weak (uncertain) → Strong (certain)
        </p>

        <div className="space-y-2">
          {userOrder.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 ${
                feedback
                  ? item.strength === index + 1
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.text}</span>
                </div>
                {!feedback && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveItem(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(index, Math.min(userOrder.length - 1, index + 1))}
                      disabled={index === userOrder.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={feedback !== null}
          className="w-full mt-6 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Order
        </button>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            feedback.type === 'correct'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {feedback.type === 'correct'
              ? 'Perfect order!'
              : 'Incorrect order. Check the highlighting for correct positions.'
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default StrengthRankingGame
