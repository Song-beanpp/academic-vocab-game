import { useState, useEffect } from 'react'
import useGameProgress from '../../../hooks/useGameProgress'

const ErrorCorrectionGame = ({ data, onComplete, taskId }) => {
  const [items, setItems] = useState([])
  const { currentIndex, setCurrentIndex, correct, setCorrect, clearProgress } = useGameProgress(taskId, data)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setItems(data)
    }
  }, [data])

  const handleSelect = (index) => {
    if (feedback) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return

    const isCorrect = items[currentIndex].options[selected].isCorrect

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
        clearProgress() // Clear saved progress on completion
        onComplete(finalCorrect / items.length)
      }
    }, 3000)
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-900 border-t-transparent"></div>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  return (
    <div className="max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, Garamond, serif' }}>
      {/* Decorative header with progress */}
      <div className="mb-8 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 border-2 border-amber-800 rounded-lg p-6 shadow-lg"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'%23fef3c7\' fill-opacity=\'0.1\'/%3E%3Cpath d=\'M10 0L20 10L10 20L0 10z\' fill=\'%23d97706\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
             backgroundSize: '20px 20px'
           }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wider">Question {currentIndex + 1}</h3>
              <p className="text-xs text-amber-700">of {items.length} exercises</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-900">{correct}</div>
            <div className="text-xs text-amber-700 uppercase tracking-wide">Correct</div>
          </div>
        </div>

        {/* Ornate progress bar */}
        <div className="relative">
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden border border-amber-600 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 transition-all duration-500 ease-out shadow-lg"
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
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-900"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'%23fffbeb\'/%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23d97706\' stroke-opacity=\'0.03\' stroke-width=\'0.5\'/%3E%3C/svg%3E")'
           }}>
        {/* Decorative corner flourishes */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-amber-700 opacity-30"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-amber-700 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-amber-700 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-amber-700 opacity-30"></div>

        <div className="relative p-8">
          {/* Title with decorative underline */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Didot, Georgia, serif' }}>
              Academic Collocation Exercise
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700"></div>
              <span className="text-amber-700">⚜</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700"></div>
            </div>
          </div>

          {/* Sentence display - like a manuscript */}
          <div className="mb-8 p-6 bg-white bg-opacity-80 rounded-lg border-2 border-amber-300 shadow-inner"
               style={{
                 backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, rgba(217, 119, 6, 0.1) 29px, rgba(217, 119, 6, 0.1) 30px)',
                 lineHeight: '30px'
               }}>
            <p className="text-xl text-gray-800 leading-relaxed" style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
              {currentItem.sentence}
            </p>
          </div>

          <p className="text-center text-amber-800 mb-6 italic text-lg">
            Select the correct academic collocation
          </p>

          {/* Option buttons - vintage style */}
          <div className="space-y-4 mb-6">
            {currentItem.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={feedback !== null}
                className={`w-full p-5 text-left rounded-xl border-3 transition-all duration-300 transform hover:scale-[1.02] font-serif text-lg relative overflow-hidden ${
                  selected === index
                    ? feedback
                      ? option.isCorrect
                        ? 'border-green-700 bg-gradient-to-r from-green-50 to-green-100 shadow-lg scale-[1.02]'
                        : 'border-red-700 bg-gradient-to-r from-red-50 to-red-100 shadow-lg scale-[1.02]'
                      : 'border-amber-800 bg-gradient-to-r from-amber-100 to-amber-200 shadow-lg scale-[1.02]'
                    : feedback && option.isCorrect
                      ? 'border-green-700 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'
                      : 'border-amber-600 bg-white hover:bg-amber-50 hover:border-amber-700 shadow-md'
                }`}
                style={{
                  borderWidth: '3px',
                  fontFamily: 'Baskerville, Georgia, serif'
                }}
              >
                {/* Decorative quote mark */}
                <span className="absolute top-2 left-2 text-4xl text-amber-300 opacity-30">"</span>
                <span className="relative z-10 block pl-8">{option.text}</span>
                {selected === index && feedback && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
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
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl font-bold text-lg uppercase tracking-wider shadow-xl hover:from-amber-800 hover:to-amber-950 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-amber-950"
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
                    {feedback.type === 'correct' ? 'Excellent!' : 'Not Quite'}
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-800">
                      <span className="font-semibold">Correct form:</span>{' '}
                      <span className="italic text-lg">"{currentItem.correctForm}"</span>
                    </p>
                    {currentItem.explanation && (
                      <p className="text-gray-700 text-sm leading-relaxed pt-2 border-t border-gray-300">
                        {currentItem.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative footer note */}
      <div className="mt-6 text-center text-amber-800 text-sm italic">
        <p>Excellence in Academic English • Oxford Standard</p>
      </div>
    </div>
  )
}

export default ErrorCorrectionGame
