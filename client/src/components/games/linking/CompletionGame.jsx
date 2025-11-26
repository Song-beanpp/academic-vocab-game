import { useState, useEffect } from 'react'

const CompletionGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setQuestions(data)
    }
  }, [data])

  useEffect(() => {
    // Reset answers for new question
    setAnswers({})
  }, [currentIndex])

  const handleSelect = (blankId, optionIndex) => {
    if (feedback) return
    setAnswers({
      ...answers,
      [blankId]: optionIndex
    })
  }

  const handleSubmit = () => {
    const currentQuestion = questions[currentIndex]
    const blanks = currentQuestion.blanks

    // Check if all blanks are answered
    if (Object.keys(answers).length < blanks.length) return

    // Calculate correctness
    let correctCount = 0
    blanks.forEach(blank => {
      const selectedOption = blank.options[answers[blank.id]]
      if (selectedOption && selectedOption.isCorrect) {
        correctCount++
      }
    })

    const isAllCorrect = correctCount === blanks.length

    if (isAllCorrect) {
      setCorrect(correct + 1)
      setFeedback({ type: 'correct' })
    } else {
      setFeedback({ type: 'wrong', correctCount, total: blanks.length })
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

  const currentQuestion = questions[currentIndex]
  const allAnswered = currentQuestion.blanks.every(blank => answers[blank.id] !== undefined)

  // Parse paragraph to show blanks
  const renderParagraph = () => {
    let text = currentQuestion.paragraph
    const parts = []
    let lastIndex = 0

    // Find all [number] patterns
    const regex = /\[(\d+)\]/g
    let match

    while ((match = regex.exec(text)) !== null) {
      // Add text before the blank
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
      }

      const blankId = parseInt(match[1])
      const blank = currentQuestion.blanks.find(b => b.id === blankId)

      if (blank) {
        parts.push({ type: 'blank', blank, id: blankId })
      }

      lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) })
    }

    return parts
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

      {/* Completion Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Complete the paragraph
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-800 leading-relaxed">
            {renderParagraph().map((part, i) => {
              if (part.type === 'text') {
                return <span key={i}>{part.content}</span>
              } else {
                const selectedIdx = answers[part.id]
                const selected = selectedIdx !== undefined ? part.blank.options[selectedIdx] : null

                return (
                  <span
                    key={i}
                    className={`inline-block px-2 py-1 mx-1 rounded font-medium ${
                      feedback
                        ? selected?.isCorrect
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                        : selected
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {selected ? selected.text : `[${part.id}]`}
                  </span>
                )
              }
            })}
          </p>
        </div>

        {/* Options for each blank */}
        {currentQuestion.blanks.map(blank => (
          <div key={blank.id} className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Blank [{blank.id}]:
            </p>
            <div className="flex flex-wrap gap-2">
              {blank.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(blank.id, index)}
                  disabled={feedback !== null}
                  className={`px-3 py-1 text-sm rounded-lg border-2 transition ${
                    answers[blank.id] === index
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
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || feedback !== null}
          className="w-full mt-4 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              ? 'All correct!'
              : `${feedback.correctCount}/${feedback.total} correct. Check the highlighted answers.`
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default CompletionGame
