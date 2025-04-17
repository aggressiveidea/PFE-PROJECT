"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Trophy, Share2, Home, Repeat, Award } from "lucide-react"
import confetti from "canvas-confetti"
import "./ResultsPage.css"

const ResultsPage = ({ darkMode, setQuizStats }) => {
  const { level, score } = useParams()
  const navigate = useNavigate()
  const totalQuestions = 5
  const percentage = (Number.parseInt(score) / totalQuestions) * 100
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Update quiz stats
    setQuizStats((prevStats) => {
      const newTotalQuizzes = prevStats.totalQuizzes + 1
      const newAverageScore = Math.round(
        (prevStats.averageScore * prevStats.totalQuizzes + percentage) / newTotalQuizzes,
      )

      // Determine if this level should be the new top difficulty
      let newTopDifficulty = prevStats.topDifficulty

      // Always update top difficulty if score is good enough
      if (percentage >= 60) {
        if (
          level === "hard" ||
          (level === "medium" && prevStats.topDifficulty !== "Hard") ||
          (level === "easy" && prevStats.topDifficulty === "Easy")
        ) {
          newTopDifficulty = level.charAt(0).toUpperCase() + level.slice(1)
        }
      }

      // Store the updated stats in localStorage immediately
      const updatedStats = {
        totalQuizzes: newTotalQuizzes,
        averageScore: newAverageScore,
        topDifficulty: newTopDifficulty,
      }

      localStorage.setItem("quizStats", JSON.stringify(updatedStats))

      return updatedStats
    })

    // Trigger confetti if score is good
    if (percentage >= 80) {
      setShowConfetti(true)
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Confetti burst
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"],
        })
      }, 250)
    }
  }, [level, percentage, score, setQuizStats])

  let message = ""
  let color = ""
  let subMessage = ""

  // Determine color based on score
  if (percentage >= 80) {
    color = "#10b981" // green
  } else if (percentage >= 60) {
    color = "#8b5cf6" // purple
  } else if (percentage >= 40) {
    color = "#f59e0b" // orange
  } else {
    color = "#ef4444" // red
  }

  // Create personalized message based on score and difficulty level
  if (percentage === 100) {
    message = "Perfect Score! Outstanding!"

    if (level === "easy") {
      subMessage = "You've mastered the basics. Ready to try Medium difficulty?"
    } else if (level === "medium") {
      subMessage = "You've conquered intermediate concepts. Challenge yourself with Hard difficulty!"
    } else {
      subMessage = "You've mastered even the most complex ICT concepts. Impressive!"
    }
  } else if (percentage >= 80) {
    message = "Excellent Performance!"

    if (level === "easy") {
      subMessage = "You have a strong grasp of ICT fundamentals."
    } else if (level === "medium") {
      subMessage = "You have impressive knowledge of practical ICT applications."
    } else {
      subMessage = "You demonstrate advanced understanding of complex ICT systems."
    }
  } else if (percentage >= 60) {
    message = "Good Effort!"

    if (level === "easy") {
      subMessage = "You're building a solid foundation in ICT basics."
    } else if (level === "medium") {
      subMessage = "You're developing good practical ICT skills."
    } else {
      subMessage = "You're making progress with advanced ICT concepts."
    }
  } else if (percentage >= 40) {
    message = "Nice Try!"

    if (level === "easy") {
      subMessage = "Review the fundamentals and try again to improve your score."
    } else if (level === "medium") {
      subMessage = "Some practical concepts need more practice."
    } else {
      subMessage = "Advanced topics can be challenging. Keep studying!"
    }
  } else {
    message = "Keep Learning!"

    if (level === "easy") {
      subMessage = "Start with the basics and build your ICT knowledge step by step."
    } else if (level === "medium") {
      subMessage = "Try the Easy level first to build your confidence."
    } else {
      subMessage = "Advanced topics require strong foundations. Try an easier level first."
    }
  }

  const handleRetryQuiz = () => {
    navigate(`/quiz/question/${level}`)
  }

  const handleGoHome = () => {
    navigate("/quiz")
  }

  const handleShareResults = () => {
    // Create share text
    const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on the ${level} level ICT quiz! Can you beat my score?`

    // Check if Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: "My ICT Quiz Results",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
          // Fallback - copy to clipboard
          copyToClipboard(shareText)
        })
    } else {
      // Fallback - copy to clipboard
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Results copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
      })
  }

  return (
    <div className="results-page">
      <div className="results-container">
        <div className="results-header">
          <h1>Quiz Results</h1>
          <p>{level.charAt(0).toUpperCase() + level.slice(1)} level ICT quiz completed</p>
        </div>

        <div className="trophy-container">
          <div className="trophy-icon" style={{ backgroundColor: color }}>
            <Trophy size={32} />
          </div>
        </div>

        <h2 className="score-title">
          Your Score:{" "}
          <span style={{ color }}>
            {score}/{totalQuestions}
          </span>
        </h2>

        <div className="score-bar-container">
          <div
            className="score-bar-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>

        <div className="score-message-container">
          <p className="score-message" style={{ color }}>
            {message}
          </p>
          <p className="score-submessage">{subMessage}</p>
        </div>

        <div className="score-details">
          <div className="score-detail-item">
            <div className="detail-icon correct">
              <Award size={20} />
            </div>
            <h3>Correct Answers</h3>
            <p className="correct-count">{score}</p>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon incorrect">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h3>Incorrect Answers</h3>
            <p className="incorrect-count">{totalQuestions - Number.parseInt(score)}</p>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon accuracy">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3>Accuracy</h3>
            <p className="accuracy">{percentage}%</p>
          </div>
        </div>

        <div className="results-actions">
          <button className="action-button back-button" onClick={handleGoHome}>
            <Home size={18} />
            Back to Quiz
          </button>

          <button className="action-button retry-button" onClick={handleRetryQuiz}>
            <Repeat size={18} />
            Try Again
          </button>

          <button className="action-button share-button" onClick={handleShareResults}>
            <Share2 size={18} />
            Share Results
          </button>
        </div>
      </div>

      <div className="improvement-tips">
        <h3>Want to improve your score?</h3>
        <p>Try these resources to boost your ICT knowledge:</p>
        <ul>
          <li>Online courses on platforms like Coursera or edX</li>
          <li>ICT tutorials on YouTube</li>
          <li>Practice with different difficulty levels</li>
          <li>Join ICT forums and communities</li>
        </ul>
      </div>
    </div>
  )
}

export default ResultsPage
