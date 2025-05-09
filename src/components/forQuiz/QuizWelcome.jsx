"use client"

import { useNavigate } from "react-router-dom"
import { Terminal, BarChart3, Award, Target, Trophy, Cpu, Zap, Brain } from "lucide-react"
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
      <div className="stats-dashboard">
        <h2 className="stats-dashboard-title">Your Quiz Statistics</h2>
        <div className="stats-cards-container">
          <div className="stats-card">
            <div className="stats-card-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stats-card-content">
              <h3>Total Quizzes</h3>
              <p className="stats-card-value">{displayStats.totalQuizzes}</p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-icon">
              <Award size={24} />
            </div>
            <div className="stats-card-content">
              <h3>Average Score</h3>
              <p className="stats-card-value">{displayStats.averageScore}%</p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-icon">
              <Target size={24} />
            </div>
            <div className="stats-card-content">
              <h3>Top Difficulty</h3>
              <p className="stats-card-value">{displayStats.topDifficulty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performance Cards Section */}
      <div className="top-cards-section">
        <h2 className="top-cards-title">
          <Trophy size={20} className="top-cards-icon" />
          Your Top Performance Cards
        </h2>

        {topPerformanceCards && topPerformanceCards.length > 0 ? (
          <div className="top-cards-container">
            {topPerformanceCards.map((card, index) => (
              <div key={index} className={`top-card ${getDifficultyColorClass(card.type)}`}>
                <div className="top-card-header">
                  <span className="top-card-rank">#{index + 1}</span>
                </div>
                <h3 className="top-card-level">{card.displayName}</h3>
                <div className="top-card-score">
                  <span className="score-value">{card.bestScore}%</span>
                  <span className="score-label">Best Score</span>
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
        <div className="difficulty-card" onClick={() => navigate("/quiz/question/easy")} data-level="easy">
          <div className="difficulty-card-inner">
            <div className="difficulty-icon">
              <Cpu size={24} />
            </div>
            <h2>Basic Concepts</h2>
            <p>Test your knowledge of fundamental ICT concepts and terminology.</p>

            {cardPerformance && cardPerformance.basic && cardPerformance.basic.attempts > 0 && (
              <div className="card-performance-stats">
                <div className="performance-stat-row">
                  <span className="stat-label">Best Score:</span>
                  <span className="stat-value">{cardPerformance.basic.bestScore}%</span>
                </div>
                <div className="performance-stat-row">
                  <span className="stat-label">Attempts:</span>
                  <span className="stat-value">{cardPerformance.basic.attempts}</span>
                </div>
                <div className="performance-stat-row">
                  <span className="stat-label">Last Score:</span>
                  <span className="stat-value">{cardPerformance.basic.lastScore}%</span>
                </div>
              </div>
            )}

            <button className="difficulty-button">Start Easy Quiz</button>
          </div>
        </div>

        {/* Practical Skills Card */}
        <div className="difficulty-card" onClick={() => navigate("/quiz/question/medium")} data-level="medium">
          <div className="difficulty-card-inner">
            <div className="difficulty-icon">
              <Zap size={24} />
            </div>
            <h2>Practical Skills</h2>
            <p>Challenge yourself with questions about software applications and digital tools.</p>

            {cardPerformance && cardPerformance.practical && cardPerformance.practical.attempts > 0 && (
              <div className="card-performance-stats">
                <div className="performance-stat-row">
                  <span className="stat-label">Best Score:</span>
                  <span className="stat-value">{cardPerformance.practical.bestScore}%</span>
                </div>
                <div className="performance-stat-row">
                  <span className="stat-label">Attempts:</span>
                  <span className="stat-value">{cardPerformance.practical.attempts}</span>
                </div>
                <div className="performance-stat-row">
                  <span className="stat-label">Last Score:</span>
                  <span className="stat-value">{cardPerformance.practical.lastScore}%</span>
                </div>
              </div>
            )}

            <button className="difficulty-button">Start Medium Quiz</button>
          </div>
        </div>

        {/* Advanced Topics Card */}
        <div className="difficulty-card" onClick={() => navigate("/quiz/question/hard")} data-level="hard">
          <div className="difficulty-card-inner">
            <div className="difficulty-icon">
              <Brain size={24} />
            </div>
            <h2>Advanced Topics</h2>
            <p>Dive deep into networking, security, and complex ICT systems.</p>

            {cardPerformance && cardPerformance.advanced && cardPerformance.advanced.attempts > 0 && (
              <div className="card-performance-stats">
                <div className="performance-stat-row">
                  <span className="stat-label">Best Score:</span>
                  <span className="stat-value">{cardPerformance.advanced.bestScore}%</span>
                </div>
                <div className="performance-stat-row">
                  <span className="stat-label">Attempts:</span>
                  <span className="stat-value">{cardPerformance.advanced.attempts}</span>
                </div>
                <div className="performance-stat-row">
                  <span className="stat-label">Last Score:</span>
                  <span className="stat-value">{cardPerformance.advanced.lastScore}%</span>
                </div>
              </div>
            )}

            <button className="difficulty-button">Start Hard Quiz</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizWelcome
