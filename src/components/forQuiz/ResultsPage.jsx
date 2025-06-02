import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Share2, Home, Repeat, CheckCircle, XCircle, Activity, Star, TrendingUp, Award, Target } from "lucide-react"
import { getCategoryDetails } from "../../services/Api"
import { updateCategoryPerformance } from "../../services/QuizStorage"
import "./ResultsPage.css"

const ResultsPage = ({ darkMode, setQuizStats }) => {
  const { category, score } = useParams()
  const navigate = useNavigate()
  const totalQuestions = 5
  const percentage = Math.round((Number.parseInt(score) / totalQuestions) * 100)
  const scoreBarRef = useRef(null)
  const categoryInfo = getCategoryDetails(category)

  useEffect(() => {
    if (scoreBarRef.current) {
      scoreBarRef.current.style.setProperty("--score-percentage", `${percentage}%`)
    }
    if (setQuizStats) {
      setQuizStats((prevStats) => {
        const newTotalQuizzes = prevStats.totalQuizzes + 1
        const newAverageScore = Math.round(
          (prevStats.averageScore * prevStats.totalQuizzes + percentage) / newTotalQuizzes,
        )

        let newTopCategory = prevStats.topCategory

        if (percentage >= 60) {
          if (prevStats.topCategory === "None" || percentage > prevStats.averageScore) {
            newTopCategory = categoryInfo.name
          }
        }

        const updatedStats = {
          totalQuizzes: newTotalQuizzes,
          averageScore: newAverageScore,
          topCategory: newTopCategory,
        }

        localStorage.setItem("quizStats", JSON.stringify(updatedStats))

        return updatedStats
      })
    }

    updateCategoryPerformance(category, percentage, categoryInfo.name)
  }, [category, percentage, score, setQuizStats, categoryInfo.name])

  const getPerformanceLevel = (percentage) => {
    if (percentage === 100) return "perfect"
    if (percentage >= 80) return "excellent"
    if (percentage >= 60) return "good"
    if (percentage >= 40) return "fair"
    return "needs-improvement"
  }

  const getPerformanceData = (percentage) => {
    const level = getPerformanceLevel(percentage)

    const performanceMap = {
      perfect: {
        title: "Perfect Score! 🎉",
        message: "Outstanding! You've mastered this category completely.",
        color: "#10b981",
        icon: <Star size={36} />,
        tips: [
          "You're ready to teach others in this area",
          "Consider exploring advanced topics in this field",
          "Try other categories to expand your expertise",
        ],
      },
      excellent: {
        title: "Excellent Knowledge! 🌟",
        message: "You have a strong understanding of this subject.",
        color: "#3b82f6",
        icon: <Award size={36} />,
        tips: [
          "Review the questions you missed for complete mastery",
          "Share your knowledge with others",
          "Explore related advanced topics",
        ],
      },
      good: {
        title: "Good Effort! 👍",
        message: "You're building solid knowledge in this area.",
        color: "#f59e0b",
        icon: <TrendingUp size={36} />,
        tips: [
          "Focus on the areas where you made mistakes",
          "Practice with additional resources",
          "Retake the quiz to improve your score",
        ],
      },
      fair: {
        title: "Keep Learning! 📚",
        message: "You're on the right track, but there's room for improvement.",
        color: "#ef4444",
        icon: <Target size={36} />,
        tips: [
          "Review the fundamental concepts",
          "Take time to study the missed topics",
          "Practice regularly to build confidence",
        ],
      },
      "needs-improvement": {
        title: "Keep Trying! 💪",
        message: "This topic needs more attention, but don't give up!",
        color: "#8b5cf6",
        icon: <Repeat size={36} />,
        tips: [
          "Start with basic concepts and build up",
          "Use multiple learning resources",
          "Consider seeking additional help or tutorials",
        ],
      },
    }

    return performanceMap[level]
  }

  const performanceData = getPerformanceData(percentage)

  const handleRetryQuiz = () => {
    navigate(`/quiz/question/${category}`)
  }

  const handleGoHome = () => {
    navigate("/quiz")
  }

  const handleShareResults = () => {
    const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on the ${categoryInfo.name} ICT quiz! 🎯 Can you beat my score? #ICTQuiz #TechKnowledge`

    if (navigator.share) {
      navigator
        .share({
          title: "My ICT Quiz Results",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
          copyToClipboard(shareText)
        })
    } else {
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Results copied to clipboard! 📋")
        })
        .catch((err) => {
          console.error("Failed to copy:", err)
          fallbackCopyTextToClipboard(text)
        })
    } else {
      fallbackCopyTextToClipboard(text)
    }
  }

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      if (successful) {
        alert("Results copied to clipboard! 📋")
      } else {
        alert("Unable to copy to clipboard. Please copy manually.")
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err)
      alert("Unable to copy to clipboard. Please copy manually.")
    }

    document.body.removeChild(textArea)
  }

  return (
    <div className="results-page">
      <div className="results-container">
        <div className="results-header">
          <h1>Quiz Complete!</h1>
          <p className="category-name">{categoryInfo.name} Assessment</p>
        </div>

        <div className="trophy-container">
          <div className="trophy-icon" style={{ backgroundColor: performanceData.color }}>
            {performanceData.icon}
          </div>
          <div className="performance-badge">{getPerformanceLevel(percentage).replace("-", " ").toUpperCase()}</div>
        </div>

        <div className="score-section">
          <h2 className="score-title">
            Your Score:{" "}
            <span style={{ color: performanceData.color }}>
              {score}/{totalQuestions}
            </span>
          </h2>

          <div className="score-bar-container">
            <div
              ref={scoreBarRef}
              className="score-bar-fill"
              style={{
                backgroundColor: performanceData.color,
              }}
            ></div>
            <div className="score-percentage">{percentage}%</div>
          </div>
        </div>

        <div className="score-message-container">
          <h3 className="score-message" style={{ color: performanceData.color }}>
            {performanceData.title}
          </h3>
          <p className="score-submessage">{performanceData.message}</p>
        </div>

        <div className="score-details">
          <div className="score-detail-item correct-answers">
            <div className="detail-icon">
              <CheckCircle size={24} />
            </div>
            <div className="detail-content">
              <h4>Correct</h4>
              <p className="detail-value">{score}</p>
            </div>
          </div>

          <div className="score-detail-item incorrect-answers">
            <div className="detail-icon">
              <XCircle size={24} />
            </div>
            <div className="detail-content">
              <h4>Incorrect</h4>
              <p className="detail-value">{totalQuestions - Number.parseInt(score)}</p>
            </div>
          </div>

          <div className="score-detail-item accuracy">
            <div className="detail-icon">
              <Activity size={24} />
            </div>
            <div className="detail-content">
              <h4>Accuracy</h4>
              <p className="detail-value">{percentage}%</p>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button className="results-button home-button" onClick={handleGoHome}>
            <Home size={18} />
            <span>Back to Quiz Hub</span>
          </button>

          <button
            className="results-button retry-button"
            onClick={handleRetryQuiz}
            style={{ backgroundColor: performanceData.color }}
          >
            <Repeat size={18} />
            <span>Try Again</span>
          </button>

          <button className="results-button share-button" onClick={handleShareResults}>
            <Share2 size={18} />
            <span>Share Results</span>
          </button>
        </div>
      </div>

      <div className="improvement-section">
        <h3>💡 Tips to Improve</h3>
        <div className="tips-container">
          {performanceData.tips.map((tip, index) => (
            <div key={index} className="tip-item">
              <span className="tip-number">{index + 1}</span>
              <p>{tip}</p>
            </div>
          ))}
        </div>

        <div className="resources-section">
          <h4>📚 Recommended Resources</h4>
          <ul className="resources-list">
            <li>Online courses on platforms like Coursera, edX, and Udemy</li>
            <li>Official documentation and certification programs</li>
            <li>Practice with hands-on labs and simulations</li>
            <li>Join professional communities and forums</li>
            <li>Read industry blogs and stay updated with latest trends</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
