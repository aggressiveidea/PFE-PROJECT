import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import QuizWelcome from "../components/forQuiz/QuizWelcome";
import CategoryPage from "../components/forQuiz/CategoryPage";
import QuestionPage from "../components/forQuiz/QuestionPage";
import ResultsPage from "../components/forQuiz/ResultsPage";
import Header from "../components/forHome/Header";
import Sidebar from "../components/forDashboard/Sidebar";
import Footer from "../components/forHome/Footer";
import { updateCategoryPerformance } from "../services/QuizStorage";
import "./QuizPage.css";

const QuizPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    topCategory: "None",
  });
  const location = useLocation();

  // Load quiz stats from localStorage on component mount
  useEffect(() => {
    // Load quiz stats
    const savedStats = localStorage.getItem("quizStats");
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        // Validate the structure to ensure it has all required properties
        if (
          parsedStats &&
          typeof parsedStats === "object" &&
          "totalQuizzes" in parsedStats &&
          "averageScore" in parsedStats &&
          "topCategory" in parsedStats
        ) {
          setQuizStats(parsedStats);
        } else {
          console.warn(
            "Invalid quiz stats structure in localStorage, using defaults"
          );
        }
      } catch (error) {
        console.error("Error parsing quiz stats from localStorage:", error);
      }
    }
  }, []);

  // Save quiz stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("quizStats", JSON.stringify(quizStats));
  }, [quizStats]);

  // Function to update category performance
  const handleUpdateCategoryPerformance = (category, score) => {
    updateCategoryPerformance(category, score);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div
      className={`quiz-page-container ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobileMenu={closeMobileMenu}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main
        className={`quiz-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="quiz-content-wrapper">
          <div className="quiz-content">
            <Routes>
              <Route
                path="/"
                element={
                  <QuizWelcome darkMode={darkMode} quizStats={quizStats} />
                }
              />
              <Route
                path="/category"
                element={<CategoryPage darkMode={darkMode} />}
              />
              <Route
                path="/question/:category"
                element={<QuestionPage darkMode={darkMode} />}
              />
              <Route
                path="/results/:category/:score"
                element={
                  <ResultsPage
                    darkMode={darkMode}
                    setQuizStats={setQuizStats}
                    updateCategoryPerformance={handleUpdateCategoryPerformance}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} setDarkMode={toggleDarkMode} />
    </div>
  );
};

export default QuizPage;
