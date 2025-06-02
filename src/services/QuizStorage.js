export const getQuizData = () => {
  try {
    const data = localStorage.getItem("quizStats")
    return data ? JSON.parse(data) : { totalQuizzes: 0, averageScore: 0, topCategory: "None" }
  } catch (error) {
    console.error("Error getting quiz data:", error)
    return { totalQuizzes: 0, averageScore: 0, topCategory: "None" }
  }
}

export const saveQuizData = (data) => {
  try {
    localStorage.setItem("quizStats", JSON.stringify(data))
  } catch (error) {
    console.error("Error saving quiz data:", error)
  }
}

export const getTopPerformanceCategories = () => {
  try {
    const data = localStorage.getItem("categoryPerformance")
    if (!data) return []

    const performance = JSON.parse(data)
    return Object.entries(performance)
      .map(([id, data]) => ({
        id,
        displayName: data.displayName,
        bestScore: data.bestScore,
        attempts: data.attempts,
        lastAttempt: data.lastAttempt,
      }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 3)
  } catch (error) {
    console.error("Error getting top performance categories:", error)
    return []
  }
}

export const getCategoryPerformance = () => {
  try {
    const data = localStorage.getItem("categoryPerformance")
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("Error getting category performance:", error)
    return {}
  }
}

export const updateCategoryPerformance = (categoryId, score, categoryName) => {
  try {
    const performance = getCategoryPerformance()
    const now = new Date().toISOString()

    if (!performance[categoryId]) {
      performance[categoryId] = {
        displayName: categoryName,
        bestScore: score,
        attempts: 1,
        lastAttempt: now,
        totalScore: score,
      }
    } else {
      performance[categoryId].attempts += 1
      performance[categoryId].lastAttempt = now
      performance[categoryId].totalScore += score
      if (score > performance[categoryId].bestScore) {
        performance[categoryId].bestScore = score
      }
    }

    localStorage.setItem("categoryPerformance", JSON.stringify(performance))
  } catch (error) {
    console.error("Error updating category performance:", error)
  }
}

