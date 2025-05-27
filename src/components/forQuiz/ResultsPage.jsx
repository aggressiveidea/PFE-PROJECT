import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Trophy, Share2, Home, Repeat, CheckCircle, XCircle, Activity } from "lucide-react"
import { getCategoryDetails } from "../../services/Api"
import "./ResultsPage.css"

const ResultsPage = ({ darkMode, setQuizStats, updateCategoryPerformance }) => {
  const { category, score } = useParams()
  const navigate = useNavigate()
  const totalQuestions = 5
  const percentage = (Number.parseInt(score) / totalQuestions) * 100
  const scoreBarRef = useRef(null)
  const categoryInfo = getCategoryDetails(category)

  useEffect(() => {
    if (scoreBarRef.current) {
      scoreBarRef.current.style.setProperty("--score-percentage", `${percentage}%`)
    }

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

    updateCategoryPerformance(category, percentage)
  }, [category, percentage, score, setQuizStats, updateCategoryPerformance, categoryInfo.name])

  let message = ""
  let subMessage = ""
  const trophyColor = categoryInfo.color || "#6366f1"

  if (percentage >= 80) {
    message = "Excellent Knowledge!"

    if (percentage === 100) {
      subMessage = `You've mastered the ${categoryInfo.name} category. Try another category to expand your knowledge!`
    } else {
      subMessage = `You have a strong understanding of ${categoryInfo.name} concepts.`
    }
  } else if (percentage >= 60) {
    message = "Good Effort!"
    subMessage = `You're building solid knowledge in ${categoryInfo.name}. Keep learning to improve your score.`
  } else if (percentage >= 40) {
    message = "Nice Try!"
    subMessage = `Some ${categoryInfo.name} concepts need more practice. Review and try again.`
  } else {
    message = "Keep Learning!"
    subMessage = `${categoryInfo.name} can be challenging. Start with the basics and build your knowledge step by step.`
  }

  const handleRetryQuiz = () => {
    navigate(`/quiz/question/${category}`)
  }

  const handleGoHome = () => {
    navigate("/quiz")
  }

  const handleShareResults = () => {

    const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on the ${categoryInfo.name} quiz! Can you beat my score?`

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
          <p>{categoryInfo.name} quiz completed</p>
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
        <h3>Want to improve your {categoryInfo.name} knowledge?</h3>
        <p>Try these resources to boost your understanding:</p>
        <ul>
          <li>Online courses on platforms like Coursera or edX</li>
          <li>Specialized tutorials on YouTube</li>
          <li>Practice with different quiz categories</li>
          <li>Join ICT forums and communities</li>
          <li>Read technology blogs and news to stay updated</li>
        </ul>
      </div>
    </div>
  )
}

export default ResultsPage
