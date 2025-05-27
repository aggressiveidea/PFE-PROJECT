import { useState, useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import QuizWelcome from "../components/forQuiz/QuizWelcome"
import CategoryPage from "../components/forQuiz/CategoryPage"
import QuestionPage from "../components/forQuiz/QuestionPage"
import ResultsPage from "../components/forQuiz/ResultsPage"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import Footer from "../components/forHome/Footer"
import { updateCategoryPerformance } from "../services/QuizStorage"
import { Calendar, Clock, Code, Terminal, Brain } from "lucide-react"
import "./QuizPage.css"

const QuizPage = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    topCategory: "None",
  })
  const location = useLocation()

  useEffect(() => {
    const savedStats = localStorage.getItem("quizStats")
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats)
        if (
          parsedStats &&
          typeof parsedStats === "object" &&
          "totalQuizzes" in parsedStats &&
          "averageScore" in parsedStats &&
          "topCategory" in parsedStats
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


  useEffect(() => {
    localStorage.setItem("quizStats", JSON.stringify(quizStats))
  }, [quizStats])

  const handleUpdateCategoryPerformance = (category, score) => {
    updateCategoryPerformance(category, score)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

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
          {/* Enhanced Welcome Section */}
          <div className="quiz-welcome-section">
            <div className="quiz-welcome-content">
              <div className="quiz-welcome-badge">
                <Brain size={16} />
                <span>ICT Knowledge Assessment</span>
              </div>
              <h1 className="quiz-welcome-title">
                Quiz Platform<span className="quiz-code-accent">{"<quiz/>"}</span>
              </h1>
              <p className="quiz-welcome-subtitle">
                Test your ICT knowledge with our comprehensive quiz system and track your learning progress.
              </p>

              {/* Code snippet */}
              <div className="quiz-code-snippet">
                <div className="quiz-code-header">
                  <div className="quiz-code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="quiz-code-title">quiz-system.js</span>
                </div>
                <div className="quiz-code-content">
                  <span className="quiz-code-line">
                    <span className="quiz-code-function">quiz</span>
                    <span className="quiz-code-punctuation">.</span>
                    <span className="quiz-code-function">startAssessment</span>
                    <span className="quiz-code-punctuation">(</span>
                    <span className="quiz-code-string">"{quizStats.topCategory || "category"}"</span>
                    <span className="quiz-code-punctuation">);</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="quiz-welcome-stats">
              <div className="quiz-date-info">
                <div className="quiz-date-item">
                  <Calendar size={16} />
                  <span>
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="quiz-date-item">
                  <Clock size={16} />
                  <span>
                    {new Date().toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* IT-themed background elements */}
            <div className="quiz-tech-bg">
              <div className="quiz-circuit-pattern"></div>
              <div className="quiz-floating-icons">
                <Code size={24} className="quiz-floating-icon" />
                <Terminal size={20} className="quiz-floating-icon" />
                <Brain size={22} className="quiz-floating-icon" />
              </div>
            </div>
          </div>

          <div className="quiz-content">
            <Routes>
              <Route path="/" element={<QuizWelcome darkMode={darkMode} quizStats={quizStats} />} />
              <Route path="/category" element={<CategoryPage darkMode={darkMode} />} />
              <Route path="/question/:category" element={<QuestionPage darkMode={darkMode} />} />
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
  )
}

export default QuizPage
