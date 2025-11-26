import { useState, useEffect } from 'react'

const ParagraphReorderGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userOrder, setUserOrder] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Data is already prepared from taskGenerator
      setQuestions(data)
    } else if (data && data.exercises) {
      // Legacy format support
      const reorderExercises = data.exercises.filter(ex =>
        ex.type === 'paragraph_reorder' || ex.sentences
      ).slice(0, 5)

      if (reorderExercises.length === 0) {
        const defaultExercises = [
          {
            sentences: [
              { text: 'First, the researchers collected data from 100 participants.', order: 1 },
              { text: 'Then, they analyzed the results using statistical methods.', order: 2 },
              { text: 'Finally, they drew conclusions based on their findings.', order: 3 },
              { text: 'These conclusions have important implications for future research.', order: 4 }
            ]
          }
        ]
        setQuestions(defaultExercises)
      } else {
        setQuestions(reorderExercises)
      }
    }
  }, [data])

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      // Shuffle sentences for user to reorder, add unique IDs
      const shuffled = [...questions[currentIndex].sentences]
        .map((item, idx) => ({ ...item, id: `${currentIndex}-${idx}` }))
        .sort(() => Math.random() - 0.5)
      setUserOrder(shuffled)
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
    const isCorrect = userOrder.every((item, index) => item.order === index + 1)

    if (isCorrect) {
      setCorrect(correct + 1)
      setFeedback({ type: 'correct' })
    } else {
      setFeedback({ type: 'wrong' })
    }

    setTimeout(() => {
      setFeedback(null)

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        const finalCorrect = isCorrect ? correct + 1 : correct
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
          <span>Paragraph {currentIndex + 1} of {questions.length}</span>
          <span>Correct: {correct}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Reorder Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
          Reorder the paragraph
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Arrange sentences in logical order
        </p>

        <div className="space-y-2">
          {userOrder.map((item, index) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border-2 ${
                feedback
                  ? item.order === index + 1
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <p className="flex-1 text-sm text-gray-700">{item.text}</p>
                {!feedback && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveItem(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(index, Math.min(userOrder.length - 1, index + 1))}
                      disabled={index === userOrder.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {feedback.type === 'correct' ? 'Perfect order!' : 'Incorrect order. Check the highlighting.'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ParagraphReorderGame
