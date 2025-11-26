import { useState, useEffect } from 'react'

const AppropriatenessGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Data is already prepared from taskGenerator
      setQuestions(data)
    } else if (data && data.exercises) {
      // Legacy format support
      const appropriatenessExercises = data.exercises.filter(ex =>
        ex.type === 'appropriateness'
      ).slice(0, 8)

      if (appropriatenessExercises.length === 0) {
        // Create default exercises
        const defaultExercises = [
          {
            sentence: 'Water boils at 100 degrees Celsius at sea level.',
            needsHedging: false,
            explanation: 'This is an established scientific fact.'
          },
          {
            sentence: 'This treatment cures all types of cancer.',
            needsHedging: true,
            explanation: 'Medical claims need hedging as effects vary.'
          },
          {
            sentence: 'The Earth orbits around the Sun.',
            needsHedging: false,
            explanation: 'This is a verified scientific fact.'
          },
          {
            sentence: 'Students who study more get better grades.',
            needsHedging: true,
            explanation: 'Correlations are not absolute and need hedging.'
          },
          {
            sentence: 'The experiment results prove the hypothesis.',
            needsHedging: true,
            explanation: 'Scientific findings should be hedged.'
          },
          {
            sentence: 'DNA contains genetic information.',
            needsHedging: false,
            explanation: 'This is an established biological fact.'
          }
        ]
        setQuestions(defaultExercises.sort(() => Math.random() - 0.5).slice(0, 8))
      } else {
        setQuestions(appropriatenessExercises)
      }
    }
  }, [data])

  const handleSelect = (needsHedging) => {
    if (feedback) return
    setSelected(needsHedging)
  }

  const handleSubmit = () => {
    if (selected === null) return

    const isCorrect = selected === questions[currentIndex].needsHedging

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

      {/* Appropriateness Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Does this sentence need hedging?
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-lg text-gray-800 leading-relaxed">
            "{currentQuestion.sentence}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect(true)}
            disabled={feedback !== null}
            className={`p-4 rounded-lg border-2 transition ${
              selected === true
                ? feedback
                  ? currentQuestion.needsHedging
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-medium">Yes, needs hedging</span>
            <p className="text-xs text-gray-500 mt-1">Claim or speculation</p>
          </button>
          <button
            onClick={() => handleSelect(false)}
            disabled={feedback !== null}
            className={`p-4 rounded-lg border-2 transition ${
              selected === false
                ? feedback
                  ? !currentQuestion.needsHedging
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-medium">No hedging needed</span>
            <p className="text-xs text-gray-500 mt-1">Established fact</p>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={selected === null || feedback !== null}
          className="w-full mt-6 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg ${
            feedback.type === 'correct'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            <p className="font-medium">
              {feedback.type === 'correct' ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-sm mt-1">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppropriatenessGame
