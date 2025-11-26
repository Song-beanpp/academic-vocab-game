import { useState, useEffect } from 'react'

const ContrastiveGame = ({ data, onComplete }) => {
  const [items, setItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [understood, setUnderstood] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setItems(data)
    }
  }, [data])

  const handleNext = () => {
    setUnderstood(understood + 1)

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // All items reviewed - 100% completion
      onComplete(1.0)
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
          <span>Reviewed: {understood}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Contrastive Learning Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x">
          {/* Error Side */}
          <div className="p-6 bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-500 text-xl">✗</span>
              <h3 className="font-semibold text-red-800">Common Error</h3>
            </div>
            <p className="text-2xl font-bold text-red-700 mb-3">
              {currentItem.errorForm}
            </p>
            <div className="text-sm text-red-600">
              <p className="mb-1">Learner frequency:</p>
              <p className="font-medium">{currentItem.learnerFrequency}</p>
            </div>
          </div>

          {/* Correct Side */}
          <div className="p-6 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-500 text-xl">✓</span>
              <h3 className="font-semibold text-green-800">Correct Form</h3>
            </div>
            <p className="text-2xl font-bold text-green-700 mb-3">
              {currentItem.correctForm}
            </p>
            <div className="text-sm text-green-600">
              <p className="mb-1">Native frequency:</p>
              <p className="font-medium">{currentItem.nativeFrequency}</p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-6 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Explanation</h4>
          <p className="text-gray-600">{currentItem.explanation}</p>

          {currentItem.examples && currentItem.examples.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Examples</h4>
              <ul className="space-y-2">
                {currentItem.examples.slice(0, 2).map((example, i) => (
                  <li key={i} className="text-sm text-gray-600 pl-4 border-l-2 border-green-300">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <button
            onClick={handleNext}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            {currentIndex < items.length - 1 ? 'I understand, Next' : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContrastiveGame
