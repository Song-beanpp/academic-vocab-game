import { useState, useEffect } from 'react'

const WordFamilyGame = ({ data, onComplete }) => {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewed, setViewed] = useState(0)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Data is already pre-filtered from taskGenerator
      setWords(data)
    }
  }, [data])

  const handleNext = () => {
    setViewed(viewed + 1)

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Complete with 100% since this is exploration
      onComplete(1)
    }
  }

  const categorizeByPos = (wordFamily) => {
    // Simple categorization based on common suffixes
    const categories = {
      nouns: [],
      verbs: [],
      adjectives: [],
      adverbs: [],
      others: []
    }

    wordFamily.forEach(word => {
      const lower = word.toLowerCase()
      if (lower.endsWith('tion') || lower.endsWith('ment') || lower.endsWith('ness') || lower.endsWith('ity') || lower.endsWith('er') || lower.endsWith('or')) {
        categories.nouns.push(word)
      } else if (lower.endsWith('ly')) {
        categories.adverbs.push(word)
      } else if (lower.endsWith('ive') || lower.endsWith('al') || lower.endsWith('ous') || lower.endsWith('able') || lower.endsWith('ible') || lower.endsWith('ed')) {
        categories.adjectives.push(word)
      } else if (lower.endsWith('ize') || lower.endsWith('ify') || lower.endsWith('ate')) {
        categories.verbs.push(word)
      } else {
        categories.others.push(word)
      }
    })

    return categories
  }

  if (words.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  const currentWord = words[currentIndex]
  const categories = categorizeByPos(currentWord.familyMembers || [])

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Word {currentIndex + 1} of {words.length}</span>
          <span>Viewed: {viewed}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Word Family Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-primary-800 mb-2">
          {currentWord.headword}
        </h2>
        {currentWord.partOfSpeech && (
          <p className="text-sm text-gray-600 text-center mb-6">
            ({currentWord.partOfSpeech})
          </p>
        )}

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Word Family Members
        </h3>

        <div className="space-y-4">
          {categories.nouns.length > 0 && (
            <div>
              <span className="text-xs font-medium text-blue-600 uppercase">Nouns</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.nouns.map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {categories.verbs.length > 0 && (
            <div>
              <span className="text-xs font-medium text-green-600 uppercase">Verbs</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.verbs.map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {categories.adjectives.length > 0 && (
            <div>
              <span className="text-xs font-medium text-yellow-600 uppercase">Adjectives</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.adjectives.map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {categories.adverbs.length > 0 && (
            <div>
              <span className="text-xs font-medium text-purple-600 uppercase">Adverbs</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.adverbs.map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {categories.others.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase">Others</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.others.map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-6 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
        >
          {currentIndex < words.length - 1 ? 'Next Word Family' : 'Complete'}
        </button>
      </div>
    </div>
  )
}

export default WordFamilyGame
