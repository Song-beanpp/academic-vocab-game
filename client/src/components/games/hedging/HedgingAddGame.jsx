import { useState, useEffect } from 'react'

const HedgingAddGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && data.exercises) {
      const hedgingExercises = data.exercises.filter(ex =>
        ex.type === 'hedging_add' || ex.hedging_options
      ).slice(0, 8)

      if (hedgingExercises.length === 0) {
        // Create default exercises if none exist
        const defaultExercises = [
          {
            sentence: 'This method produces accurate results.',
            options: [
              { text: 'may produce', isCorrect: true },
              { text: 'definitely produces', isCorrect: false },
              { text: 'always produces', isCorrect: false },
              { text: 'must produce', isCorrect: false }
            ]
          },
          {
            sentence: 'The data shows a correlation between the variables.',
            options: [
              { text: 'appears to show', isCorrect: true },
              { text: 'certainly shows', isCorrect: false },
              { text: 'obviously shows', isCorrect: false },
              { text: 'proves', isCorrect: false }
            ]
          }
        ]
        setQuestions(defaultExercises)
      } else {
        setQuestions(hedgingExercises)
      }
    }
  }, [data])

  const handleSelect = (index) => {
    if (feedback) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return

    const currentQ = questions[currentIndex]
    const isCorrect = currentQ.options[selected].isCorrect

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

      {/* Hedging Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Select the correct hedging word
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500 mb-2">Fill in the blank:</p>
          <p className="text-gray-800 font-medium leading-relaxed">
            {currentQuestion.sentence.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block px-3 py-1 mx-1 bg-primary-100 border-b-2 border-primary-500 text-primary-600 font-bold">?</span>
                )}
              </span>
            ))}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-3 text-center">
          Select the best hedging expression:
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={feedback !== null}
              className={`w-full p-3 text-left rounded-lg border-2 transition ${
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
            {feedback.type === 'correct' ? 'Correct!' : 'Incorrect'}
          </div>
        )}
      </div>
    </div>
  )
}

export default HedgingAddGame
