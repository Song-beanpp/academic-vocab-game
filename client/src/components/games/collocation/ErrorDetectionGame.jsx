import { useState, useEffect } from 'react'
import useGameProgress from '../../../hooks/useGameProgress'

const ErrorDetectionGame = ({ data, onComplete, taskId }) => {
  const [items, setItems] = useState([])
  const { currentIndex, setCurrentIndex, correct, setCorrect, clearProgress } = useGameProgress(taskId, data)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setItems(data)
    }
  }, [data])

  const handleSelect = (isError) => {
    if (feedback) return
    setSelected(isError)
  }

  const handleSubmit = () => {
    if (selected === null) return

    // The shown collocation is always an error, so correct answer is "Yes, it's wrong"
    const isCorrect = selected === true

    if (isCorrect) {
      setCorrect(correct + 1)
      setFeedback({ type: 'correct' })
    } else {
      setFeedback({ type: 'wrong' })
    }

    setTimeout(() => {
      setFeedback(null)
      setSelected(null)

      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        const finalCorrect = isCorrect ? correct + 1 : correct
        clearProgress()
        onComplete(finalCorrect / items.length)
      }
    }, 3000)
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-900 border-t-transparent"></div>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  return (
    <div className="max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, Garamond, serif' }}>
      {/* Decorative header with progress - Teal theme for detection */}
      <div className="mb-8 bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 border-2 border-teal-800 rounded-lg p-6 shadow-lg"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'%23f0fdfa\' fill-opacity=\'0.1\'/%3E%3Cpath d=\'M10 0L20 10L10 20L0 10z\' fill=\'%23115e59\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
             backgroundSize: '20px 20px'
           }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔍</span>
            <div>
              <h3 className="text-sm font-semibold text-teal-900 uppercase tracking-wider">Question {currentIndex + 1}</h3>
              <p className="text-xs text-teal-700">of {items.length} exercises</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-900">{correct}</div>
            <div className="text-xs text-teal-700 uppercase tracking-wide">Correct</div>
          </div>
        </div>

        {/* Ornate progress bar */}
        <div className="relative">
          <div className="h-3 bg-teal-200 rounded-full overflow-hidden border border-teal-600 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
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
      <div className="relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-teal-900"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'%23f0fdfa\'/%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23115e59\' stroke-opacity=\'0.03\' stroke-width=\'0.5\'/%3E%3C/svg%3E")'
           }}>
        {/* Decorative corner flourishes */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-teal-700 opacity-30"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-teal-700 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-teal-700 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-teal-700 opacity-30"></div>

        <div className="relative p-8">
          {/* Title with decorative underline */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-teal-900 mb-2" style={{ fontFamily: 'Didot, Georgia, serif' }}>
              Error Detection Exercise
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-700"></div>
              <span className="text-teal-700">⚜</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-700"></div>
            </div>
            <p className="text-sm text-teal-700 mt-2 italic">Identifying Common Collocation Errors</p>
          </div>

          {/* Collocation display - highlighted */}
          <div className="mb-8 p-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border-3 border-yellow-400 shadow-inner"
               style={{ borderWidth: '3px' }}>
            <p className="text-sm text-amber-700 font-semibold mb-2 text-center uppercase tracking-wide">
              Examine this collocation:
            </p>
            <p className="text-3xl font-bold text-center text-gray-900" style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
              "{currentItem.errorCollocation}"
            </p>
            {currentItem.frequency && (
              <p className="text-sm text-gray-600 mt-3 text-center italic">
                Learner frequency: {currentItem.frequency} per million words
              </p>
            )}
          </div>

          <p className="text-center text-teal-800 mb-6 text-xl font-semibold">
            Is there an error in this collocation?
          </p>

          {/* Yes/No buttons - vintage style */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => handleSelect(true)}
              disabled={feedback !== null}
              className={`p-6 rounded-xl border-3 transition-all duration-300 transform hover:scale-[1.05] relative overflow-hidden ${
                selected === true
                  ? feedback
                    ? 'border-green-700 bg-gradient-to-br from-green-50 to-green-100 shadow-lg scale-[1.05]'
                    : 'border-teal-800 bg-gradient-to-br from-teal-100 to-cyan-100 shadow-lg scale-[1.05]'
                  : 'border-teal-600 bg-white hover:bg-teal-50 hover:border-teal-700 shadow-md'
              }`}
              style={{ borderWidth: '3px' }}
            >
              <div className="text-center">
                <span className="text-5xl block mb-2">❌</span>
                <p className="font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>Yes, it's wrong</p>
                <p className="text-sm text-gray-600 mt-1 italic">This is an error</p>
              </div>
              {selected === true && feedback && feedback.type === 'correct' && (
                <span className="absolute right-3 top-3 text-3xl">✓</span>
              )}
            </button>

            <button
              onClick={() => handleSelect(false)}
              disabled={feedback !== null}
              className={`p-6 rounded-xl border-3 transition-all duration-300 transform hover:scale-[1.05] relative overflow-hidden ${
                selected === false
                  ? feedback
                    ? 'border-red-700 bg-gradient-to-br from-red-50 to-red-100 shadow-lg scale-[1.05]'
                    : 'border-teal-800 bg-gradient-to-br from-teal-100 to-cyan-100 shadow-lg scale-[1.05]'
                  : 'border-teal-600 bg-white hover:bg-teal-50 hover:border-teal-700 shadow-md'
              }`}
              style={{ borderWidth: '3px' }}
            >
              <div className="text-center">
                <span className="text-5xl block mb-2">✅</span>
                <p className="font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>No, it's correct</p>
                <p className="text-sm text-gray-600 mt-1 italic">This is acceptable</p>
              </div>
              {selected === false && feedback && feedback.type === 'wrong' && (
                <span className="absolute right-3 top-3 text-3xl">✗</span>
              )}
            </button>
          </div>

          {/* Submit button - vintage style */}
          <button
            onClick={handleSubmit}
            disabled={selected === null || feedback !== null}
            className="w-full py-4 px-6 bg-gradient-to-r from-teal-700 to-cyan-900 text-white rounded-xl font-bold text-lg uppercase tracking-wider shadow-xl hover:from-teal-800 hover:to-cyan-950 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-teal-950"
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
                  <p className={`font-bold text-xl mb-3 ${
                    feedback.type === 'correct' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {feedback.type === 'correct' ? 'Well Spotted!' : 'Not Quite'}
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                      <p className="text-gray-800">
                        <span className="font-semibold">Incorrect:</span>{' '}
                        <span className="line-through text-red-600">"{currentItem.errorCollocation}"</span>
                      </p>
                      <p className="text-gray-800 mt-2">
                        <span className="font-semibold">Correct form:</span>{' '}
                        <span className="text-green-700 font-semibold">"{currentItem.correctCollocation}"</span>
                      </p>
                    </div>
                    {currentItem.explanation && (
                      <p className="text-gray-700 text-sm leading-relaxed pt-2 border-t border-gray-300">
                        <span className="font-semibold">Explanation:</span> {currentItem.explanation}
                      </p>
                    )}
                    {currentItem.examples && currentItem.examples.length > 0 && (
                      <div className="pt-2 border-t border-gray-300">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Example usage:</p>
                        <p className="text-sm italic text-gray-600 leading-relaxed">
                          "{currentItem.examples[0]}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative footer note */}
      <div className="mt-6 text-center text-teal-800 text-sm italic">
        <p>Precision in Academic Writing • London School of Excellence</p>
      </div>
    </div>
  )
}

export default ErrorDetectionGame
