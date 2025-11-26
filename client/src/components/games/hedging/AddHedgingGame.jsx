import { useState, useEffect } from 'react'
import useGameProgress from '../../../hooks/useGameProgress'

const AddHedgingGame = ({ data, onComplete, taskId }) => {
  const [questions, setQuestions] = useState([])
  const { currentIndex, setCurrentIndex, correct, setCorrect, clearProgress } = useGameProgress(taskId, data)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

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
        clearProgress()
        onComplete(finalCorrect / questions.length)
      }
    }, 3000)
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-900 border-t-transparent"></div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, Garamond, serif' }}>
      {/* Decorative header with progress - Indigo/Purple theme for hedging */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-2 border-indigo-800 rounded-lg p-6 shadow-lg"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'%23eef2ff\' fill-opacity=\'0.1\'/%3E%3Cpath d=\'M10 0L20 10L10 20L0 10z\' fill=\'%234c1d95\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
             backgroundSize: '20px 20px'
           }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎓</span>
            <div>
              <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider">Exercise {currentIndex + 1}</h3>
              <p className="text-xs text-indigo-700">of {questions.length} questions</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-900">{correct}</div>
            <div className="text-xs text-indigo-700 uppercase tracking-wide">Correct</div>
          </div>
        </div>

        {/* Ornate progress bar */}
        <div className="relative">
          <div className="h-3 bg-indigo-200 rounded-full overflow-hidden border border-indigo-600 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            >
              <div className="h-full w-full" style={{
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent)',
                backgroundSize: '10px 10px'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main card with vintage academic styling */}
      <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-indigo-900"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'%23eef2ff\'/%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%234c1d95\' stroke-opacity=\'0.03\' stroke-width=\'0.5\'/%3E%3C/svg%3E")'
           }}>
        {/* Decorative corner flourishes */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-indigo-700 opacity-30"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-indigo-700 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-indigo-700 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-indigo-700 opacity-30"></div>

        <div className="relative p-8">
          {/* Title with decorative underline */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2" style={{ fontFamily: 'Didot, Georgia, serif' }}>
              Hedging Language Practice
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-700"></div>
              <span className="text-indigo-700">⚜</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-700"></div>
            </div>
            <p className="text-sm text-indigo-700 mt-2 italic">Expressing Appropriate Academic Caution</p>
          </div>

          {/* Sentence display - like a manuscript */}
          <div className="mb-8 p-6 bg-white bg-opacity-80 rounded-lg border-2 border-indigo-300 shadow-inner"
               style={{
                 backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, rgba(79, 70, 229, 0.1) 29px, rgba(79, 70, 229, 0.1) 30px)',
                 lineHeight: '30px'
               }}>
            <p className="text-xl text-gray-800 leading-relaxed" style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
              {currentQuestion.sentence.split('_____').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="inline-block px-3 py-1 mx-1 bg-yellow-100 border-2 border-yellow-400 rounded font-semibold text-yellow-800">
                      _____
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>

          <p className="text-center text-indigo-800 mb-6 italic text-lg">
            Choose the appropriate hedging expression
          </p>

          {/* Option buttons - vintage style, 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={feedback !== null}
                className={`p-5 text-center rounded-xl border-3 transition-all duration-300 transform hover:scale-[1.05] font-serif text-lg relative overflow-hidden ${
                  selected === index
                    ? feedback
                      ? option.isCorrect
                        ? 'border-green-700 bg-gradient-to-br from-green-50 to-green-100 shadow-lg scale-[1.05]'
                        : 'border-red-700 bg-gradient-to-br from-red-50 to-red-100 shadow-lg scale-[1.05]'
                      : 'border-indigo-800 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg scale-[1.05]'
                    : feedback && option.isCorrect
                      ? 'border-green-700 bg-gradient-to-br from-green-50 to-green-100 shadow-lg'
                      : 'border-indigo-600 bg-white hover:bg-indigo-50 hover:border-indigo-700 shadow-md'
                }`}
                style={{
                  borderWidth: '3px',
                  fontFamily: 'Baskerville, Georgia, serif'
                }}
              >
                <span className="relative z-10 block font-semibold">{option.text}</span>
                {selected === index && feedback && (
                  <span className="absolute right-3 top-3 text-2xl">
                    {option.isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Submit button - vintage style */}
          <button
            onClick={handleSubmit}
            disabled={selected === null || feedback !== null}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-700 to-purple-900 text-white rounded-xl font-bold text-lg uppercase tracking-wider shadow-xl hover:from-indigo-800 hover:to-purple-950 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-indigo-950"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Submit Answer
          </button>

          {/* Feedback section - elegant card */}
          {feedback && (
            <div className={`mt-6 p-6 rounded-xl border-3 shadow-xl ${
              feedback.type === 'correct'
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-700'
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-700'
            }`}>
              <div className="flex items-start gap-4">
                <span className="text-4xl">{feedback.type === 'correct' ? '✓' : '✗'}</span>
                <div className="flex-1">
                  <p className={`font-bold text-xl mb-2 ${
                    feedback.type === 'correct' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {feedback.type === 'correct' ? 'Excellent Choice!' : 'Not Quite Right'}
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-800">
                      <span className="font-semibold">Correct answer:</span>{' '}
                      <span className="italic text-lg">"{currentQuestion.correctAnswer}"</span>
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed pt-2 border-t border-gray-300">
                      Hedging expressions like "{currentQuestion.correctAnswer}" help express appropriate academic caution,
                      avoiding overly definitive claims.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative footer note */}
      <div className="mt-6 text-center text-indigo-800 text-sm italic">
        <p>Academic Writing Excellence • Cambridge Tradition</p>
      </div>
    </div>
  )
}

export default AddHedgingGame
