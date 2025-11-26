import { useState, useEffect } from 'react'

const FillBlankGame = ({ data, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (data && data.errors) {
      const shuffled = [...data.errors].sort(() => Math.random() - 0.5).slice(0, 8)

      const questionList = shuffled.map(item => {
        const correctForm = item.correct_form || ''
        const wrongForm = item.collocation || ''
        const correctWords = correctForm.split(' ')
        const wrongWords = wrongForm.split(' ')
        const correctWord = correctWords[0]
        const wrongWord = wrongWords[0]
        const restOfPhrase = correctWords.slice(1).join(' ')

        // Find an example that contains the correct collocation
        let sentence = ''
        if (item.examples && item.examples.length > 0) {
          const matchingExample = item.examples.find(ex =>
            ex.toLowerCase().includes(correctForm.toLowerCase())
          )
          if (matchingExample) {
            // Replace the correct collocation's first word with blank
            const regex = new RegExp(`\\b${correctWord}\\b`, 'i')
            sentence = matchingExample.replace(regex, '_____')
          }
        }

        // If no matching example, create a clear sentence
        if (!sentence || !sentence.includes('_____')) {
          sentence = `The researcher will _____ ${restOfPhrase} to investigate the hypothesis.`
        }

        // Create better options based on the collocation type
        const options = [
          { text: correctWord, isCorrect: true },
          { text: wrongWord, isCorrect: false }
        ]

        // Add relevant distractors based on the correct word
        const distractors = {
          'do': ['make', 'take', 'have'],
          'make': ['do', 'take', 'give'],
          'take': ['make', 'do', 'get'],
          'have': ['make', 'do', 'get'],
          'conduct': ['make', 'do', 'perform'],
          'carry': ['make', 'do', 'bring'],
          'give': ['make', 'do', 'take']
        }

        const additionalOptions = distractors[correctWord.toLowerCase()] || ['strongly', 'highly', 'greatly']
        additionalOptions.forEach(opt => {
          if (opt !== correctWord && opt !== wrongWord && options.length < 4) {
            options.push({ text: opt, isCorrect: false })
          }
        })

        return {
          sentence,
          options: options.filter((opt, idx, self) =>
            opt.text && self.findIndex(o => o.text === opt.text) === idx
          ).sort(() => Math.random() - 0.5),
          correctAnswer: correctWord,
          fullCorrectForm: correctForm
        }
      })

      setQuestions(questionList)
    }
  }, [data])

  const handleSelect = (index) => {
    if (feedback) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return

    const isCorrect = questions[currentIndex].options[selected].isCorrect

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

      {/* Fill Blank Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Fill in the blank with the correct word
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-lg text-gray-800 leading-relaxed">
            {currentQuestion.sentence.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block w-24 h-8 mx-1 border-b-2 border-primary-500 align-bottom"></span>
                )}
              </span>
            ))}
          </p>
        </div>

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
              ? `Correct! "${currentQuestion.fullCorrectForm}"`
              : `Incorrect. The correct collocation is "${currentQuestion.fullCorrectForm}"`
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default FillBlankGame
