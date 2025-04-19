// Function to get quiz data from localStorage
export const getQuizData = () => {
  try {
    const quizData = localStorage.getItem("quizStats")
    return quizData ? JSON.parse(quizData) : { totalQuizzes: 0, averageScore: 0, topDifficulty: "Easy" }
  } catch (error) {
    console.error("Error retrieving quiz data:", error)
    return { totalQuizzes: 0, averageScore: 0, topDifficulty: "Easy" }
  }
}

// Function to get card performance data from localStorage
export const getCardPerformance = () => {
  try {
    const cardData = localStorage.getItem("cardPerformance")
    if (!cardData) {
      // Initialize default card performance data if none exists
      const defaultCardData = {
        basic: { attempts: 0, bestScore: 0, lastScore: 0, lastAttempt: null },
        practical: { attempts: 0, bestScore: 0, lastScore: 0, lastAttempt: null },
        advanced: { attempts: 0, bestScore: 0, lastScore: 0, lastAttempt: null },
      }
      localStorage.setItem("cardPerformance", JSON.stringify(defaultCardData))
      return defaultCardData
    }
    return JSON.parse(cardData)
  } catch (error) {
    console.error("Error retrieving card performance data:", error)
    return {
      basic: { attempts: 0, bestScore: 0, lastScore: 0, lastAttempt: null },
      practical: { attempts: 0, bestScore: 0, lastScore: 0, lastAttempt: null },
      advanced: { attempts: 0, bestScore: 0, lastScore: 0, lastAttempt: null },
    }
  }
}

// Function to update card performance in localStorage
export const updateCardPerformance = (cardType, score) => {
  try {
    const cardData = getCardPerformance()
    const percentage = score

    // Map level names to card types
    const cardTypeMap = {
      easy: "basic",
      medium: "practical",
      hard: "advanced",
    }

    const cardKey = cardTypeMap[cardType] || cardType

    if (cardData[cardKey]) {
      // Update card data
      cardData[cardKey].attempts += 1
      cardData[cardKey].lastScore = percentage
      cardData[cardKey].lastAttempt = new Date().toISOString()

      // Update best score if current score is higher
      if (percentage > cardData[cardKey].bestScore) {
        cardData[cardKey].bestScore = percentage
      }

      // Save updated data
      localStorage.setItem("cardPerformance", JSON.stringify(cardData))
      return cardData
    }

    return cardData
  } catch (error) {
    console.error("Error updating card performance:", error)
    return null
  }
}

// Function to get top performance cards
export const getTopPerformanceCards = () => {
  try {
    const cardData = getCardPerformance()

    // Convert to array for sorting
    const cardsArray = Object.entries(cardData).map(([type, data]) => ({
      type,
      ...data,
      // Map card types to display names
      displayName: type === "basic" ? "Easy" : type === "practical" ? "Medium" : "Hard",
    }))

    // Sort by best score (descending)
    return cardsArray
      .filter((card) => card.attempts > 0) // Only include cards that have been attempted
      .sort((a, b) => b.bestScore - a.bestScore)
  } catch (error) {
    console.error("Error getting top performance cards:", error)
    return []
  }
}

// Legacy functions for backward compatibility
export const getTopDifficultyCards = () => {
  return getTopPerformanceCards().map((card) => ({
    level: card.displayName,
    score: card.bestScore,
    date: card.lastAttempt,
  }))
}

export const updateTopDifficultyCards = (newCard) => {
  const cardType = newCard.level.toLowerCase()
  return updateCardPerformance(cardType, newCard.score)
}
