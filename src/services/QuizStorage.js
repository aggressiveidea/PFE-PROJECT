/**
 * QuizStorage.js - Handles persistent storage for quiz data
 */

// Key for storing quiz data in localStorage
const QUIZ_DATA_KEY = "el_moughith_quiz_data"

/**
 * Get the stored quiz data from localStorage
 * @returns {Object} The stored quiz data or default values
 */
export const getQuizData = () => {
  try {
    const storedData = localStorage.getItem(QUIZ_DATA_KEY)

    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    console.error("Error retrieving quiz data from localStorage:", error)
  }

  // Default values if no data exists or there was an error
  return {
    totalQuizzes: 0,
    averageScore: 0,
    topDifficulty: "Easy",
    quizHistory: [],
    highScores: {
      easy: { score: 0, percentage: 0, date: null },
      medium: { score: 0, percentage: 0, date: null },
      hard: { score: 0, percentage: 0, date: null },
    },
    lastQuizDate: null,
    userId: null, // Can be used to associate with user accounts
  }
}

/**
 * Save quiz data to localStorage
 * @param {Object} data - The quiz data to save
 */
export const saveQuizData = (data) => {
  try {
    localStorage.setItem(QUIZ_DATA_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error saving quiz data to localStorage:", error)
    return false
  }
}

/**
 * Update quiz statistics after completing a quiz
 * @param {string} level - The difficulty level (easy, medium, hard)
 * @param {number} score - The score achieved
 * @param {number} totalQuestions - The total number of questions
 * @param {number} timeSpent - Time spent in seconds
 * @returns {Object} Updated quiz data
 */
export const updateQuizStats = (level, score, totalQuestions, timeSpent) => {
  const quizData = getQuizData()
  const percentage = (score / totalQuestions) * 100
  const currentDate = new Date().toISOString()

  // Update total quizzes and average score
  const newTotalQuizzes = quizData.totalQuizzes + 1
  const newAverageScore = Math.round((quizData.averageScore * quizData.totalQuizzes + percentage) / newTotalQuizzes)

  // Determine if this level should be the new top difficulty
  let newTopDifficulty = quizData.topDifficulty
  if (percentage >= 60) {
    const levelValue = { Easy: 1, Medium: 2, Hard: 3 }
    const currentLevel = level.charAt(0).toUpperCase() + level.slice(1)

    if (levelValue[currentLevel] > levelValue[quizData.topDifficulty]) {
      newTopDifficulty = currentLevel
    }
  }

  // Update high scores if this is a new high score for the level
  const levelKey = level.toLowerCase()
  if (percentage > (quizData.highScores[levelKey]?.percentage || 0)) {
    quizData.highScores[levelKey] = {
      score,
      percentage,
      date: currentDate,
    }
  }

  // Add to quiz history (keep last 10)
  quizData.quizHistory.unshift({
    level,
    score,
    totalQuestions,
    percentage,
    timeSpent,
    date: currentDate,
  })

  // Limit history to 10 entries
  if (quizData.quizHistory.length > 10) {
    quizData.quizHistory = quizData.quizHistory.slice(0, 10)
  }

  // Update the rest of the data
  const updatedData = {
    ...quizData,
    totalQuizzes: newTotalQuizzes,
    averageScore: newAverageScore,
    topDifficulty: newTopDifficulty,
    lastQuizDate: currentDate,
  }

  // Save to localStorage
  saveQuizData(updatedData)

  return updatedData
}

/**
 * Get the user's high score for a specific difficulty level
 * @param {string} level - The difficulty level (easy, medium, hard)
 * @returns {Object|null} The high score data or null if no high score exists
 */
export const getHighScore = (level) => {
  const quizData = getQuizData()
  const levelKey = level.toLowerCase()

  return quizData.highScores[levelKey] || null
}

/**
 * Get the user's quiz history
 * @param {number} limit - Maximum number of history items to return
 * @returns {Array} The quiz history
 */
export const getQuizHistory = (limit = 10) => {
  const quizData = getQuizData()
  return quizData.quizHistory.slice(0, limit)
}

/**
 * Clear all quiz data from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export const clearQuizData = () => {
  try {
    localStorage.removeItem(QUIZ_DATA_KEY)
    return true
  } catch (error) {
    console.error("Error clearing quiz data:", error)
    return false
  }
}
