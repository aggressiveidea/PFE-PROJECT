"use client"

import { useNavigate } from "react-router-dom"
import { Cpu, Code, Shield, Terminal } from "lucide-react"
import { getQuizData } from "../../services/QuizStorage"
import "./QuizWelcome.css"

const QuizWelcome = ({ darkMode, quizStats }) => {
  const navigate = useNavigate()
  const persistentQuizData = getQuizData()

  // Use the persistent quiz data if available, otherwise use the props
  const displayStats = {
    totalQuizzes: persistentQuizData.totalQuizzes || quizStats.totalQuizzes,
    averageScore: persistentQuizData.averageScore || quizStats.averageScore,
    topDifficulty: persistentQuizData.topDifficulty || quizStats.topDifficulty,
  }

  const handleStartQuiz = () => {
    navigate("/quiz/level")
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

      <div className="quiz-stats-display">
        <div className="stat-item">
          <div className="stat-icon">
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
              <path d="M12 20v-6M6 20V10M18 20V4"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Quizzes</h3>
            <p>{displayStats.totalQuizzes}</p>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
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
              <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"></path>
              <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"></path>
              <path d="M10 21v-4"></path>
              <path d="M14 21v-4"></path>
              <path d="m22 12-3 3-3-3"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Average Score</h3>
            <p>{displayStats.averageScore}%</p>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
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
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Top Difficulty</h3>
            <p>{displayStats.topDifficulty}</p>
          </div>
        </div>
      </div>

      <div className="difficulty-section">
        <div className="difficulty-card basic">
          <div className="difficulty-icon">
            <Cpu size={24} />
          </div>
          <h2>Basic Concepts</h2>
          <p>Test your knowledge of fundamental ICT concepts and terminology.</p>
        </div>

        <div className="difficulty-card practical">
          <div className="difficulty-icon">
            <Code size={24} />
          </div>
          <h2>Practical Skills</h2>
          <p>Challenge yourself with questions about software applications and digital tools.</p>
        </div>

        <div className="difficulty-card advanced">
          <div className="difficulty-icon">
            <Shield size={24} />
          </div>
          <h2>Advanced Topics</h2>
          <p>Dive deep into networking, security, and complex ICT systems.</p>
        </div>
      </div>
    </div>
  )
}

export default QuizWelcome
