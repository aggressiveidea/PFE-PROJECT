"use client"

import { useNavigate } from "react-router-dom"
import { Terminal, BarChart3, Award, Target, Trophy } from "lucide-react"
import { getQuizData, getTopPerformanceCards, getCardPerformance } from "../../services/QuizStorage"
import "./QuizWelcome.css"

const QuizWelcome = ({ darkMode, quizStats }) => {
  const navigate = useNavigate()
  const persistentQuizData = getQuizData()
  const topPerformanceCards = getTopPerformanceCards()
  // Get card performance directly from storage to ensure it's always defined
  const cardPerformance = getCardPerformance()

  // Use the persistent quiz data if available, otherwise use the props
  const displayStats = {
    totalQuizzes: persistentQuizData.totalQuizzes || quizStats.totalQuizzes,
    averageScore: persistentQuizData.averageScore || quizStats.averageScore,
    topDifficulty: persistentQuizData.topDifficulty || quizStats.topDifficulty,
  }

  const handleStartQuiz = () => {
    navigate("/quiz/level")
  }

  // Function to get appropriate color class based on difficulty level
  const getDifficultyColorClass = (type) => {
    switch (type) {
      case "basic":
        return "easy-card"
      case "practical":
        return "medium-card"
      case "advanced":
        return "hard-card"
      default:
        return "easy-card"
    }
  }

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="quiz-welcome">
      <div className="welcome-hero">
        <div className="welcome-icon">
          <Terminal size={32} />
        </div>
        <h1>Welcome to ICT Quiz</h1>
        <p className="welcome-subtitle">
          Test your Information and Communication Technology knowledge with our interactive quiz. Choose your difficulty
          level and challenge yourself!
        </p>
        <button className="start-quiz-button" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>

      {/* Quiz Statistics Dashboard */}
      <div className="quiz-stats-dashboard">
        <h2 className="stats-dashboard-title">Your Quiz Statistics</h2>
        <div className="stats-cards-container">
          <div className="stats-card">
            <div className="stats-card-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stats-card-content">
              <h3>TOTAL QUIZZES</h3>
              <p className="stats-card-value">{displayStats.totalQuizzes}</p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-icon">
              <Award size={24} />
            </div>
            <div className="stats-card-content">
              <h3>AVERAGE SCORE</h3>
              <p className="stats-card-value">{displayStats.averageScore}%</p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-icon">
              <Target size={24} />
            </div>
            <div className="stats-card-content">
              <h3>TOP DIFFICULTY</h3>
              <p className="stats-card-value">{displayStats.topDifficulty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performance Cards Section */}
      <div className="top-difficulty-cards-section">
        <h2 className="top-cards-title">
          <Trophy size={20} className="top-cards-icon" />
          Your Top Performance Cards
        </h2>

        {topPerformanceCards && topPerformanceCards.length > 0 ? (
          <div className="top-cards-container">
            {topPerformanceCards.map((card, index) => (
              <div key={index} className={`top-difficulty-card ${getDifficultyColorClass(card.type)}`}>
                <div className="top-card-header">
                  <span className="top-card-rank">#{index + 1}</span>
                </div>
                <h3 className="top-card-level">{card.displayName}</h3>
                <div className="top-card-score">
                  <span className="score-value">{card.bestScore}%</span>
                  <span className="score-label">BEST SCORE</span>
                </div>
                <div className="top-card-attempts">
                  <span className="attempts-value">{card.attempts}</span>
                  <span className="attempts-label">Attempts</span>
                </div>
                <div className="top-card-date">Last: {formatDate(card.lastAttempt)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-top-cards">
            <p>Complete quizzes to see your top performance cards here!</p>
          </div>
        )}
      </div>

      {/* Difficulty Level Cards */}
      <div className="difficulty-section">
        {/* Basic Concepts Card */}
        <div className="difficulty-card" onClick={() => navigate("/quiz/question/easy")}>
          <div className="difficulty-card-top-border basic"></div>
          <div className="difficulty-icon basic">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="2" x2="9" y2="4"></line>
              <line x1="15" y1="2" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="22"></line>
              <line x1="15" y1="20" x2="15" y2="22"></line>
              <line x1="20" y1="9" x2="22" y2="9"></line>
              <line x1="20" y1="14" x2="22" y2="14"></line>
              <line x1="2" y1="9" x2="4" y2="9"></line>
              <line x1="2" y1="14" x2="4" y2="14"></line>
            </svg>
          </div>
          <h2>Basic Concepts</h2>
          <p>Test your knowledge of fundamental ICT concepts and terminology.</p>

          {cardPerformance && cardPerformance.basic && cardPerformance.basic.attempts > 0 && (
            <div className="card-performance-stats">
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.basic.bestScore}%</span>
              </div>
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.basic.attempts}</span>
              </div>
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.basic.lastScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Practical Skills Card */}
        <div className="difficulty-card" onClick={() => navigate("/quiz/question/medium")}>
          <div className="difficulty-card-top-border practical"></div>
          <div className="difficulty-icon practical">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
              <line x1="19" y1="12" x2="5" y2="12"></line>
            </svg>
          </div>
          <h2>Practical Skills</h2>
          <p>Challenge yourself with questions about software applications and digital tools.</p>

          {cardPerformance && cardPerformance.practical && cardPerformance.practical.attempts > 0 && (
            <div className="card-performance-stats">
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.practical.bestScore}%</span>
              </div>
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.practical.attempts}</span>
              </div>
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.practical.lastScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Topics Card */}
        <div className="difficulty-card" onClick={() => navigate("/quiz/question/hard")}>
          <div className="difficulty-card-top-border advanced"></div>
          <div className="difficulty-icon advanced">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
            </svg>
          </div>
          <h2>Advanced Topics</h2>
          <p>Dive deep into networking, security, and complex ICT systems.</p>

          {cardPerformance && cardPerformance.advanced && cardPerformance.advanced.attempts > 0 && (
            <div className="card-performance-stats">
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.advanced.bestScore}%</span>
              </div>
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.advanced.attempts}</span>
              </div>
              <div className="performance-stat-row">
                <span className="stat-value">{cardPerformance.advanced.lastScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizWelcome





