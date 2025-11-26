import { useState, useEffect } from 'react'

const ComparisonGame = ({ data, onComplete }) => {
  const [items, setItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (data && data.errors) {
      const shuffled = [...data.errors].sort(() => Math.random() - 0.5).slice(0, 8)
      setItems(shuffled)
    }
  }, [data])

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Complete with 100% since this is comparison learning
      onComplete(1)
    }
  }

  if (items.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  const currentItem = items[currentIndex]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Item {currentIndex + 1} of {items.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Comparison Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wrong Form */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-600 text-xl">✗</span>
            <h3 className="font-semibold text-red-800">Incorrect Form</h3>
          </div>
          <p className="text-lg font-medium text-red-900 mb-3">
            {currentItem.collocation}
          </p>
          <div className="text-sm text-red-700">
            <p>Error type: <span className="capitalize">{currentItem.error_type}</span></p>
            {currentItem.learner_per_million && (
              <p>Learner frequency: {currentItem.learner_per_million}/million</p>
            )}
          </div>
        </div>

        {/* Correct Form */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600 text-xl">✓</span>
            <h3 className="font-semibold text-green-800">Correct Form</h3>
          </div>
          <p className="text-lg font-medium text-green-900 mb-3">
            {currentItem.correct_form}
          </p>
          <div className="text-sm text-green-700">
            {currentItem.corpus_freq_per_million > 0 && (
              <p>Native frequency: {currentItem.corpus_freq_per_million}/million</p>
            )}
          </div>
        </div>
      </div>

      {/* Examples */}
      {currentItem.examples && currentItem.examples.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 mt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Correct Usage Examples</h4>
          <ul className="space-y-2">
            {currentItem.examples.slice(0, 3).map((example, i) => (
              <li key={i} className="text-sm text-gray-600 pl-4 border-l-2 border-green-300">
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grammar Issue */}
      {currentItem.grammar_issue && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
          <h4 className="font-semibold text-blue-800 mb-2">Grammar Note</h4>
          <p className="text-sm text-blue-700">{currentItem.grammar_issue}</p>
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full mt-6 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
      >
        {currentIndex < items.length - 1 ? 'Next Comparison' : 'Complete'}
      </button>
    </div>
  )
}

export default ComparisonGame
