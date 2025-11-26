import { useState, useEffect } from 'react'

const LinkingMatchGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setQuestions(data)
    }
  }, [data])

  const handleSelect = (index) => {
    if (feedback) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return

    const currentQuestion = questions[currentIndex]
    const isCorrect = currentQuestion.options[selected].isCorrect

    if (isCorrect) {
      setCorrect(correct + 1)
      setFeedback({ type: 'correct' })
    } else {
      setFeedback({ type: 'wrong' })
    }

    setTimeout(() => {
      setFeedback(null)
      setSelected(null)

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

  const currentQuestion = questions[currentIndex]

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

      {/* Linking Match Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Select the best connector
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-800 mb-2">{currentQuestion.sentence1}</p>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-primary-600 font-medium text-xl">?</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <p className="text-gray-800">{currentQuestion.sentence2}</p>
        </div>

        <p className="text-sm text-gray-500 mb-3 text-center">
          Logical relation: <span className="capitalize font-medium text-primary-600">{currentQuestion.relation}</span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={feedback !== null}
              className={`p-3 text-center rounded-lg border-2 transition ${
                selected === index
                  ? feedback
                    ? option.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-primary-500 bg-primary-50'
                  : feedback && option.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selected === null || feedback !== null}
          className="w-full mt-6 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            feedback.type === 'correct'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {feedback.type === 'correct'
              ? `Correct! "${currentQuestion.correctAnswer}" connects these sentences.`
              : `Incorrect. "${currentQuestion.correctAnswer}" would be the correct connector.`
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default LinkingMatchGame
