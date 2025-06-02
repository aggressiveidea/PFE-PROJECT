import { useNavigate } from "react-router-dom"
import {
  Terminal,
  BarChart3,
  Award,
  Target,
  Trophy,
  Database,
  ShoppingCart,
  Network,
  Shield,
  FileQuestion,
  FileText,
  Copyright,
  Building,
  Play,
  TrendingUp,
} from "lucide-react"
import { getQuizData, getTopPerformanceCategories, getCategoryPerformance } from "../../services/QuizStorage"
import "./QuizWelcome.css"

const QuizWelcome = ({ darkMode, quizStats }) => {
  const navigate = useNavigate()
  const persistentQuizData = getQuizData()
  const topPerformanceCategories = getTopPerformanceCategories()
  const categoryPerformance = getCategoryPerformance()

  const displayStats = {
    totalQuizzes: persistentQuizData.totalQuizzes || quizStats.totalQuizzes || 0,
    averageScore: persistentQuizData.averageScore || quizStats.averageScore || 0,
    topCategory: persistentQuizData.topCategory || quizStats.topCategory || "None",
  }

  const handleStartQuiz = () => {
    navigate("/quiz/category")
  }

  const getCategoryDetails = (categoryId) => {
    const categoryMap = {
      "personal-data": {
        name: "Personal Data",
        color: "#3b82f6",
        description: "Data protection, privacy laws, and GDPR compliance",
      },
      "e-commerce": {
        name: "E-commerce",
        color: "#10b981",
        description: "Online business, digital transactions, and regulations",
      },
      networks: {
        name: "Networks",
        color: "#8b5cf6",
        description: "Network infrastructure, protocols, and communication",
      },
      cybercrime: {
        name: "Cybercrime",
        color: "#ef4444",
        description: "Digital security, computer crimes, and cyber threats",
      },
      miscellaneous: {
        name: "Miscellaneous",
        color: "#f59e0b",
        description: "Emerging technologies and digital transformation",
      },
      "it-contract": {
        name: "IT Contract",
        color: "#06b6d4",
        description: "Technology agreements and service contracts",
      },
      "intellectual-property": {
        name: "Intellectual Property",
        color: "#ec4899",
        description: "Patents, copyrights, and digital IP protection",
      },
      organizations: {
        name: "Organizations",
        color: "#84cc16",
        description: "IT governance and regulatory organizations",
      },
    }

    return (
      categoryMap[categoryId] || {
        name: "Unknown",
        color: "#6b7280",
        description: "Category description not available",
      }
    )
  }

  // Function to get appropriate icon based on category
  const getCategoryIcon = (categoryId) => {
    const icons = {
      "personal-data": <Database size={24} />,
      "e-commerce": <ShoppingCart size={24} />,
      networks: <Network size={24} />,
      cybercrime: <Shield size={24} />,
      miscellaneous: <FileQuestion size={24} />,
      "it-contract": <FileText size={24} />,
      "intellectual-property": <Copyright size={24} />,
      organizations: <Building size={24} />,
    }

    return icons[categoryId] || <FileQuestion size={24} />
  }

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  // All categories with enhanced data
  const quizCategories = [
    {
      id: "personal-data",
      name: "Personal Data",
      icon: <Database size={24} />,
      description: "Test your knowledge of data protection and privacy laws.",
      questionCount: 5,
      difficulty: "Medium",
    },
    {
      id: "e-commerce",
      name: "E-commerce",
      icon: <ShoppingCart size={24} />,
      description: "Test your knowledge of online business, digital transactions, and e-commerce regulations.",
      questionCount: 5,
      difficulty: "Easy",
    },
    {
      id: "networks",
      name: "Networks",
      icon: <Network size={24} />,
      description: "Questions about network infrastructure, protocols, and communication systems.",
      questionCount: 5,
      difficulty: "Hard",
    },
    {
      id: "cybercrime",
      name: "Cybercrime",
      icon: <Shield size={24} />,
      description: "Challenge yourself with questions about digital security and computer crimes.",
      questionCount: 5,
      difficulty: "Hard",
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: <FileQuestion size={24} />,
      description: "Various IT topics including emerging technologies and digital transformation.",
      questionCount: 5,
      difficulty: "Medium",
    },
    {
      id: "it-contract",
      name: "IT Contract",
      icon: <FileText size={24} />,
      description: "Questions about technology agreements, service contracts, and licensing.",
      questionCount: 5,
      difficulty: "Easy",
    },
    {
      id: "intellectual-property",
      name: "Intellectual Property",
      icon: <Copyright size={24} />,
      description: "Explore the world of patents, copyrights, and digital IP protection.",
      questionCount: 5,
      difficulty: "Medium",
    },
    {
      id: "organizations",
      name: "Organizations",
      icon: <Building size={24} />,
      description: "Test your knowledge of IT governance, standards bodies, and regulatory organizations.",
      questionCount: 5,
      difficulty: "Easy",
    },
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#10b981"
      case "Medium":
        return "#f59e0b"
      case "Hard":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="quiz-welcome">
      {/* Enhanced Hero Section */}
      <div className="quiz-welcome-hero">
        <div className="quiz-welcome-icon">
          <Terminal size={32} />
        </div>
        <h1>Welcome to ICT Quiz Challenge</h1>
        <p className="quiz-welcome-subtitle">
          Test your knowledge across eight specialized categories of Information and Communication Technology. Challenge
          yourself with real-world scenarios and advance your ICT expertise!
        </p>
        <div className="quiz-hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">8</span>
            <span className="hero-stat-label">Categories</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">40</span>
            <span className="hero-stat-label">Questions</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">5</span>
            <span className="hero-stat-label">Per Quiz</span>
          </div>
        </div>
        <button className="quiz-start-button" onClick={handleStartQuiz}>
          <Play size={20} />
          Start Quiz Challenge
        </button>
      </div>

      {/* Enhanced Quiz Statistics Dashboard */}
      <div className="quiz-stats-dashboard">
        <h2 className="quiz-stats-title">
          <TrendingUp size={24} />
          Your Performance Dashboard
        </h2>
        <div className="quiz-stats-cards-container">
          <div className="quiz-stats-card total-quizzes">
            <div className="quiz-stats-card-icon">
              <BarChart3 size={24} />
            </div>
            <div className="quiz-stats-card-content">
              <h3>Total Quizzes</h3>
              <p className="quiz-stats-card-value">{displayStats.totalQuizzes}</p>
              <span className="quiz-stats-card-subtitle">Completed</span>
            </div>
          </div>

          <div className="quiz-stats-card average-score">
            <div className="quiz-stats-card-icon">
              <Award size={24} />
            </div>
            <div className="quiz-stats-card-content">
              <h3>Average Score</h3>
              <p className="quiz-stats-card-value">{displayStats.averageScore}%</p>
              <span className="quiz-stats-card-subtitle">Overall Performance</span>
            </div>
          </div>

          <div className="quiz-stats-card top-category">
            <div className="quiz-stats-card-icon">
              <Target size={24} />
            </div>
            <div className="quiz-stats-card-content">
              <h3>Best Category</h3>
              <p className="quiz-stats-card-value">{displayStats.topCategory}</p>
              <span className="quiz-stats-card-subtitle">Your Strength</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Top Performance Categories Section */}
      <div className="quiz-top-cards-section">
        <h2 className="quiz-top-cards-title">
          <Trophy size={20} className="quiz-top-cards-icon" />
          Your Top Performance Categories
        </h2>

        {topPerformanceCategories && topPerformanceCategories.length > 0 ? (
          <div className="quiz-top-cards-container">
            {topPerformanceCategories.slice(0, 3).map((category, index) => {
              const categoryDetails = getCategoryDetails(category.id)
              return (
                <div
                  key={index}
                  className="quiz-top-card"
                  style={{
                    "--card-accent": categoryDetails.color,
                    "--card-accent-light": `${categoryDetails.color}20`,
                  }}
                >
                  <div className="quiz-top-card-header">
                    <span className="quiz-top-card-rank">#{index + 1}</span>
                    <div className="quiz-top-card-icon">{getCategoryIcon(category.id)}</div>
                  </div>
                  <h3 className="quiz-top-card-level">{category.displayName}</h3>
                  <div className="quiz-top-card-score">
                    <span className="quiz-score-value">{category.bestScore}%</span>
                    <span className="quiz-score-label">Best Score</span>
                  </div>
                  <div className="quiz-top-card-attempts">
                    <span className="quiz-attempts-value">{category.attempts}</span>
                    <span className="quiz-attempts-label">Attempts</span>
                  </div>
                  <div className="quiz-top-card-date">Last: {formatDate(category.lastAttempt)}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="quiz-no-top-cards">
            <div className="no-performance-icon">
              <Trophy size={48} />
            </div>
            <h3>Start Your Journey!</h3>
            <p>Complete quizzes to see your top performance categories here!</p>
            <button className="quiz-start-button-small" onClick={handleStartQuiz}>
              Take Your First Quiz
            </button>
          </div>
        )}
      </div>

      {/* Enhanced All Categories Section */}
      <div className="quiz-categories-section">
        <h2 className="quiz-categories-title">All Quiz Categories</h2>
        <div className="quiz-categories-grid">
          {quizCategories.map((category) => {
            const categoryDetails = getCategoryDetails(category.id)
            return (
              <div
                key={category.id}
                className="quiz-category-card"
                onClick={() => navigate(`/quiz/question/${category.id}`)}
              >
                <div className="quiz-category-header">
                  <div
                    className="quiz-category-icon"
                    style={{
                      backgroundColor: categoryDetails.color,
                    }}
                  >
                    {category.icon}
                  </div>
                  <div className="quiz-category-meta">
                    <span
                      className="quiz-category-difficulty"
                      style={{ color: getDifficultyColor(category.difficulty) }}
                    >
                      {category.difficulty}
                    </span>
                    <span className="quiz-category-count">{category.questionCount} questions</span>
                  </div>
                </div>
                <h3 className="quiz-category-title">{category.name}</h3>
                <p className="quiz-category-description">{category.description}</p>
                <button
                  className="quiz-category-button"
                  style={{
                    backgroundColor: categoryDetails.color,
                  }}
                >
                  <Play size={16} />
                  Start Quiz
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuizWelcome
