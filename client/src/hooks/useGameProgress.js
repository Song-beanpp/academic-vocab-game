import { useState, useEffect } from 'react'

/**
 * Custom hook for managing game progress with localStorage persistence
 * @param {string} taskId - Unique task identifier
 * @param {Array} questions - Array of questions/items
 * @returns {Object} - Game state and setters
 */
const useGameProgress = (taskId, questions) => {
  const storageKey = `game_progress_${taskId}`

  // Initialize state from localStorage or defaults
  const getInitialState = () => {
    if (!taskId || !questions || questions.length === 0) {
      return { currentIndex: 0, correct: 0 }
    }

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Validate saved data
        if (
          typeof parsed.currentIndex === 'number' &&
          typeof parsed.correct === 'number' &&
          parsed.currentIndex >= 0 &&
          parsed.currentIndex < questions.length
        ) {
          return parsed
        }
      }
    } catch (err) {
      console.error('Error loading saved progress:', err)
    }

    return { currentIndex: 0, correct: 0 }
  }

  const [currentIndex, setCurrentIndex] = useState(() => getInitialState().currentIndex)
  const [correct, setCorrect] = useState(() => getInitialState().correct)

  // Save progress whenever state changes
  useEffect(() => {
    if (!taskId || !questions || questions.length === 0) return

    const progress = { currentIndex, correct }
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress))
    } catch (err) {
      console.error('Error saving progress:', err)
    }
  }, [currentIndex, correct, taskId, storageKey, questions])

  // Clear progress when game completes
  const clearProgress = () => {
    try {
      localStorage.removeItem(storageKey)
    } catch (err) {
      console.error('Error clearing progress:', err)
    }
  }

  return {
    currentIndex,
    setCurrentIndex,
    correct,
    setCorrect,
    clearProgress
  }
}

export default useGameProgress
