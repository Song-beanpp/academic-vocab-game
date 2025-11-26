import { useState, useEffect } from 'react'

const ParagraphCompleteGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && data.exercises) {
      const completeExercises = data.exercises.filter(ex =>
        ex.type === 'paragraph_complete' || ex.blanks
      ).slice(0, 5)

      if (completeExercises.length === 0) {
        // Create default exercises
        const defaultExercises = [
          {
            paragraph: 'The study aimed to investigate the relationship between diet and health. [1], 500 participants were recruited. [2], they were divided into three groups. [3], the results showed significant differences between groups.',
            blanks: [
              {
                id: 1,
                options: [
                  { text: 'First', isCorrect: true },
                  { text: 'However', isCorrect: false },
                  { text: 'Therefore', isCorrect: false }
                ]
              },
              {
                id: 2,
                options: [
                  { text: 'Then', isCorrect: true },
                  { text: 'Nevertheless', isCorrect: false },
                  { text: 'Instead', isCorrect: false }
                ]
              },
              {
                id: 3,
                options: [
                  { text: 'Finally', isCorrect: true },
                  { text: 'Similarly', isCorrect: false },
                  { text: 'Meanwhile', isCorrect: false }
                ]
              }
            ]
          },
          {
            paragraph: 'Climate change poses serious threats to biodiversity. [1], many species are losing their habitats. [2], some are adapting to new conditions. [3], conservation efforts must be intensified.',
            blanks: [
              {
                id: 1,
                options: [
                  { text: 'For example', isCorrect: true },
                  { text: 'Therefore', isCorrect: false },
                  { text: 'Instead', isCorrect: false }
                ]
              },
              {
                id: 2,
                options: [
                  { text: 'However', isCorrect: true },
                  { text: 'Similarly', isCorrect: false },
                  { text: 'Thus', isCorrect: false }
                ]
              },
              {
                id: 3,
                options: [
                  { text: 'Therefore', isCorrect: true },
                  { text: 'Nevertheless', isCorrect: false },
                  { text: 'Meanwhile', isCorrect: false }
                ]
              }
            ]
          }
        ]
        setQuestions(defaultExercises)
      } else {
        setQuestions(completeExercises)
      }
    }
  }, [data])

  const handleSelect = (blankId, optionIndex) => {
    if (feedback) return
    setAnswers({
      ...answers,
      [blankId]: optionIndex
    })
  }

  const handleSubmit = () => {
    const currentQ = questions[currentIndex]
    let correctCount = 0

    currentQ.blanks.forEach(blank => {
      const selectedIndex = answers[blank.id]
      if (selectedIndex !== undefined && blank.options[selectedIndex].isCorrect) {
        correctCount++
      }
    })

    const isAllCorrect = correctCount === currentQ.blanks.length
    const score = correctCount / currentQ.blanks.length

    if (isAllCorrect) {
      setCorrect(correct + 1)
      setFeedback({ type: 'correct', score })
    } else {
      setFeedback({ type: 'partial', score, correctCount })
    }

    setTimeout(() => {
      setFeedback(null)
      setAnswers({})

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Calculate final score based on number of fully correct paragraphs
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

  // Render paragraph with blanks
  const renderParagraph = () => {
    const parts = currentQuestion.paragraph.split(/\[(\d+)\]/)
    return parts.map((part, index) => {
      const blankNum = parseInt(part)
      if (!isNaN(blankNum)) {
        const blank = currentQuestion.blanks.find(b => b.id === blankNum)
        if (blank) {
          const selectedIndex = answers[blank.id]
          return (
            <select
              key={index}
              value={selectedIndex ?? ''}
              onChange={(e) => handleSelect(blank.id, parseInt(e.target.value))}
              disabled={feedback !== null}
              className={`mx-1 px-2 py-1 border rounded ${
                feedback
                  ? selectedIndex !== undefined && blank.options[selectedIndex].isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-primary-300'
              }`}
            >
              <option value="">Select...</option>
              {blank.options.map((opt, i) => (
                <option key={i} value={i}>{opt.text}</option>
              ))}
            </select>
          )
        }
      }
      return <span key={index}>{part}</span>
    })
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

      {/* Complete Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Complete the paragraph
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-800 leading-relaxed">
            {renderParagraph()}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || feedback !== null}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            feedback.type === 'correct'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {feedback.type === 'correct'
              ? 'All correct!'
              : `${feedback.correctCount}/${currentQuestion.blanks.length} correct`
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default ParagraphCompleteGame
