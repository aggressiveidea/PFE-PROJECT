export const getQuizData = () => {
  try {
    const quizData = localStorage.getItem("quizStats");
    return quizData
      ? JSON.parse(quizData)
      : {
          totalQuizzes: 0,
          averageScore: 0,
          topCategory: "None",
        };
  } catch (error) {
    console.error("Error retrieving quiz data:", error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      topCategory: "None",
    };
  }
};

export const updateQuizData = (newData) => {
  try {
    const currentData = getQuizData();
    const updatedData = { ...currentData, ...newData };
    localStorage.setItem("quizStats", JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error("Error updating quiz data:", error);
    return null;
  }
};

export const getCategoryPerformance = () => {
  try {
    const performanceData = localStorage.getItem("categoryPerformance");
    return performanceData ? JSON.parse(performanceData) : {};
  } catch (error) {
    console.error("Error retrieving category performance:", error);
    return {};
  }
};

export const updateCategoryPerformance = (category, score) => {
  try {
    const performanceData = getCategoryPerformance();
    const categoryData = performanceData[category] || {
      attempts: 0,
      bestScore: 0,
      lastScore: 0,
      lastAttempt: null,
    };
    categoryData.attempts += 1;
    categoryData.lastScore = score;
    categoryData.lastAttempt = new Date().toISOString();

    if (score > categoryData.bestScore) {
      categoryData.bestScore = score;
    }

    performanceData[category] = categoryData;
    localStorage.setItem(
      "categoryPerformance",
      JSON.stringify(performanceData)
    );

    return categoryData;
  } catch (error) {
    console.error("Error updating category performance:", error);
    return null;
  }
};

export const getTopPerformanceCategories = () => {
  try {
    const performanceData = getCategoryPerformance();

    const categoriesArray = Object.entries(performanceData).map(
      ([id, data]) => ({
        id,
        ...data,
        displayName: getCategoryDisplayName(id),
      })
    );

    return categoriesArray
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 3);
  } catch (error) {
    console.error("Error getting top performance categories:", error);
    return [];
  }
};
const getCategoryDisplayName = (categoryId) => {
  const displayNames = {
    "personal-data": "Personal Data",
    "e-commerce": "E-commerce",
    networks: "Networks",
    cybercrime: "Cybercrime",
    miscellaneous: "Miscellaneous",
    "it-contract": "IT Contract",
    "intellectual-property": "Intellectual Property",
    organizations: "Organizations",
  };

  return displayNames[categoryId] || categoryId;
};
