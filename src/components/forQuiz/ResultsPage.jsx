"use client"

import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Trophy, Share2, Home, Repeat, CheckCircle, XCircle, Activity } from "lucide-react"
import "./ResultsPage.css"

const ResultsPage = ({ darkMode, setQuizStats, updateCardPerformance }) => {
  const { level, score } = useParams()
  const navigate = useNavigate()
  const totalQuestions = 5
  const percentage = (Number.parseInt(score) / totalQuestions) * 100
  const scoreBarRef = useRef(null)

  useEffect(() => {
    // Set the score percentage as a CSS variable for the animation
    if (scoreBarRef.current) {
      scoreBarRef.current.style.setProperty("--score-percentage", `${percentage}%`)
    }

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

    // Update card performance data
    updateCardPerformance(level, percentage)
  }, [level, percentage, score, setQuizStats, updateCardPerformance])

  let message = ""
  let subMessage = ""
  let trophyColor = ""

  // Determine color and messages based on score
  if (percentage >= 80) {
    trophyColor = "var(--color-easy)"
    message = "Perfect Score! Outstanding!"

    if (percentage === 100) {
      if (level === "easy") {
        subMessage = "You've mastered the basics. Ready to try Medium difficulty?"
      } else if (level === "medium") {
        subMessage = "You've conquered intermediate concepts. Challenge yourself with Hard difficulty!"
      } else {
        subMessage = "You've mastered even the most complex ICT concepts. Impressive!"
      }
    } else {
      if (level === "easy") {
        subMessage = "You have a strong grasp of ICT fundamentals."
      } else if (level === "medium") {
        subMessage = "You have impressive knowledge of practical ICT applications."
      } else {
        subMessage = "You demonstrate advanced understanding of complex ICT systems."
      }
    }
  } else if (percentage >= 60) {
    trophyColor = "var(--color-primary)"
    message = "Good Effort!"

    if (level === "easy") {
      subMessage = "You're building a solid foundation in ICT basics."
    } else if (level === "medium") {
      subMessage = "You're developing good practical ICT skills."
    } else {
      subMessage = "You're making progress with advanced ICT concepts."
    }
  } else if (percentage >= 40) {
    trophyColor = "var(--color-medium)"
    message = "Nice Try!"

    if (level === "easy") {
      subMessage = "Review the fundamentals and try again to improve your score."
    } else if (level === "medium") {
      subMessage = "Some practical concepts need more practice."
    } else {
      subMessage = "Advanced topics can be challenging. Keep studying!"
    }
  } else {
    trophyColor = "var(--color-hard)"
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
          <div className="trophy-icon" style={{ backgroundColor: trophyColor }}>
            <Trophy size={36} />
          </div>
        </div>

        <h2 className="score-title">
          Your Score:{" "}
          <span style={{ color: trophyColor }}>
            {score}/{totalQuestions}
          </span>
        </h2>

        <div className="score-bar-container">
          <div
            ref={scoreBarRef}
            className="score-bar-fill"
            style={{
              backgroundColor: trophyColor,
            }}
          ></div>
        </div>

        <div className="score-message-container">
          <p className="score-message" style={{ color: trophyColor }}>
            {message}
          </p>
          <p className="score-submessage">{subMessage}</p>
        </div>

        <div className="score-details">
          <div className="score-detail-item">
            <div className="detail-icon correct">
              <CheckCircle size={24} />
            </div>
            <h3>Correct Answers</h3>
            <p className="correct-count">{score}</p>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon incorrect">
              <XCircle size={24} />
            </div>
            <h3>Incorrect Answers</h3>
            <p className="incorrect-count">{totalQuestions - Number.parseInt(score)}</p>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon accuracy">
              <Activity size={24} />
            </div>
            <h3>Accuracy</h3>
            <p className="accuracy">{percentage}%</p>
          </div>
        </div>

        <div className="resultQuiz-actions">
          <button className="resultQuiz-button resultQuiz-back-button" onClick={handleGoHome}>
            <Home size={18} />
            <span>Back to Quiz</span>
          </button>

          <button className="resultQuiz-button resultQuiz-retry-button" onClick={handleRetryQuiz}>
            <Repeat size={18} />
            <span>Try Again</span>
          </button>

          <button className="resultQuiz-button resultQuiz-share-button" onClick={handleShareResults}>
            <Share2 size={18} />
            <span>Share Results</span>
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
          <li>Read technology blogs and news to stay updated</li>
        </ul>
      </div>
    </div>
  )
}

export default ResultsPage
