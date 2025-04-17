"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import QuizWelcome from "../components/forQuiz/QuizWelcome"
import LevelPage from "../components/forQuiz/LevelPage"
import QuestionPage from "../components/forQuiz/QuestionPage"
import ResultsPage from "../components/forQuiz/ResultsPage"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import Footer from "../components/forHome/Footer"
import { BarChart3, Award, Target } from "lucide-react"
import "./QuizPage.css"

const QuizPage = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    topDifficulty: "Easy",
  })
  const navigate = useNavigate()
  const location = useLocation()

  // Load quiz stats from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem("quizStats")
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats)
        // Validate the structure to ensure it has all required properties
        if (
          parsedStats &&
          typeof parsedStats === "object" &&
          "totalQuizzes" in parsedStats &&
          "averageScore" in parsedStats &&
          "topDifficulty" in parsedStats
        ) {
          setQuizStats(parsedStats)
        } else {
          console.warn("Invalid quiz stats structure in localStorage, using defaults")
        }
      } catch (error) {
        console.error("Error parsing quiz stats from localStorage:", error)
      }
    }
  }, [])

  // Save quiz stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("quizStats", JSON.stringify(quizStats))
  }, [quizStats])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  // Check if we're on the main quiz page
  const isMainPage = location.pathname === "/quiz" || location.pathname === "/quiz/"

  return (
    <div className={`quiz-page-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header language={language} setLanguage={setLanguage} darkMode={darkMode} />

      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobileMenu={closeMobileMenu}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className={`quiz-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="quiz-content-wrapper">
          <div className="quiz-content">
            <Routes>
              <Route path="/" element={<QuizWelcome darkMode={darkMode} quizStats={quizStats} />} />
              <Route path="/level" element={<LevelPage darkMode={darkMode} />} />
              <Route path="/question/:level" element={<QuestionPage darkMode={darkMode} />} />
              <Route
                path="/results/:level/:score"
                element={<ResultsPage darkMode={darkMode} setQuizStats={setQuizStats} />}
              />
            </Routes>
          </div>

          {isMainPage && (
            <div className="quiz-stats-sidebar">
              <div className="stat-card">
                <h3>Total Quizzes Taken</h3>
                <div className="stat-value">{quizStats.totalQuizzes}</div>
                <div className="stat-icon">
                  <BarChart3 size={20} />
                </div>
              </div>

              <div className="stat-card">
                <h3>Average Score</h3>
                <div className="stat-value">{quizStats.averageScore}%</div>
                <div className="stat-icon">
                  <Award size={20} />
                </div>
              </div>

              <div className="stat-card">
                <h3>Top Difficulty</h3>
                <div className="stat-value">{quizStats.topDifficulty}</div>
                <div className="stat-icon">
                  <Target size={20} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer darkMode={darkMode} setDarkMode={toggleDarkMode} />
    </div>
  )
}

export default QuizPage
