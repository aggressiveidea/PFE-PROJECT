<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom"
=======
"use client";

import { useNavigate } from "react-router-dom";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
} from "lucide-react"
import { getQuizData, getTopPerformanceCategories, getCategoryPerformance } from "../../services/QuizStorage"
import { getCategoryDetails } from "../../services/Api"
import "./QuizWelcome.css"

const QuizWelcome = ({ darkMode, quizStats }) => {
  const navigate = useNavigate()
  const persistentQuizData = getQuizData()
  const topPerformanceCategories = getTopPerformanceCategories()
  const categoryPerformance = getCategoryPerformance()
=======
} from "lucide-react";
import {
  getQuizData,
  getTopPerformanceCategories,
  getCategoryPerformance,
} from "../../services/QuizStorage";
import { getCategoryDetails } from "../../services/Api";
import "./QuizWelcome.css";

const QuizWelcome = ({ darkMode, quizStats }) => {
  const navigate = useNavigate();
  const persistentQuizData = getQuizData();
  const topPerformanceCategories = getTopPerformanceCategories();
  const categoryPerformance = getCategoryPerformance();
>>>>>>> Stashed changes

  const displayStats = {
    totalQuizzes: persistentQuizData.totalQuizzes || quizStats.totalQuizzes,
    averageScore: persistentQuizData.averageScore || quizStats.averageScore,
    topCategory: persistentQuizData.topCategory || quizStats.topCategory,
<<<<<<< Updated upstream
  }

  const handleStartQuiz = () => {
    navigate("/quiz/category")
  }

=======
  };

  const handleStartQuiz = () => {
    navigate("/quiz/category");
  };

  // Function to get appropriate icon based on category
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    }

    return icons[categoryId] || <FileQuestion size={24} />
  }
=======
    };

    return icons[categoryId] || <FileQuestion size={24} />;
  };
>>>>>>> Stashed changes

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  // All categories
  const quizCategories = [
    {
      id: "personal-data",
      name: "Personal Data",
      icon: <Database size={24} />,
      description: "Test your knowledge of data protection and privacy laws.",
    },
    {
      id: "e-commerce",
      name: "E-commerce",
      icon: <ShoppingCart size={24} />,
      description:
        "Test your knowledge of online business, digital transactions, and e-commerce regulations.",
    },
    {
      id: "networks",
      name: "Networks",
      icon: <Network size={24} />,
      description:
        "Questions about network infrastructure, protocols, and communication systems.",
    },
    {
      id: "cybercrime",
      name: "Cybercrime",
      icon: <Shield size={24} />,
      description:
        "Challenge yourself with questions about digital security and computer crimes.",
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: <FileQuestion size={24} />,
      description:
        "Various IT topics including emerging technologies and digital transformation.",
    },
    {
      id: "it-contract",
      name: "IT Contract",
      icon: <FileText size={24} />,
      description:
        "Questions about technology agreements, service contracts, and licensing.",
    },
    {
      id: "intellectual-property",
      name: "Intellectual Property",
      icon: <Copyright size={24} />,
      description:
        "Explore the world of patents, copyrights, and digital IP protection.",
    },
    {
      id: "organizations",
      name: "Organizations",
      icon: <Building size={24} />,
      description:
        "Test your knowledge of IT governance, standards bodies, and regulatory organizations.",
    },
  ];

  const quizCategories = [
    {
      id: "personal-data",
      name: "Personal Data",
      icon: <Database size={24} />,
      description: "Test your knowledge of data protection and privacy laws.",
    },
    {
      id: "e-commerce",
      name: "E-commerce",
      icon: <ShoppingCart size={24} />,
      description: "Test your knowledge of online business, digital transactions, and e-commerce regulations.",
    },
    {
      id: "networks",
      name: "Networks",
      icon: <Network size={24} />,
      description: "Questions about network infrastructure, protocols, and communication systems.",
    },
    {
      id: "cybercrime",
      name: "Cybercrime",
      icon: <Shield size={24} />,
      description: "Challenge yourself with questions about digital security and computer crimes.",
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: <FileQuestion size={24} />,
      description: "Various IT topics including emerging technologies and digital transformation.",
    },
    {
      id: "it-contract",
      name: "IT Contract",
      icon: <FileText size={24} />,
      description: "Questions about technology agreements, service contracts, and licensing.",
    },
    {
      id: "intellectual-property",
      name: "Intellectual Property",
      icon: <Copyright size={24} />,
      description: "Explore the world of patents, copyrights, and digital IP protection.",
    },
    {
      id: "organizations",
      name: "Organizations",
      icon: <Building size={24} />,
      description: "Test your knowledge of IT governance, standards bodies, and regulatory organizations.",
    },
  ]

  return (
    <div className="quiz-welcome">
      <div className="quiz-welcome-hero">
        <div className="quiz-welcome-icon">
          <Terminal size={32} />
        </div>
        <h1>Welcome to ICT Quiz</h1>
        <p className="quiz-welcome-subtitle">
<<<<<<< Updated upstream
          Test your knowledge across eight specialized categories of Information and Communication Technology. Choose a
          category and challenge yourself!
=======
          Test your knowledge across eight specialized categories of Information
          and Communication Technology. Choose a category and challenge
          yourself!
>>>>>>> Stashed changes
        </p>
        <button className="quiz-start-button" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
<<<<<<< Updated upstream
=======

      {/* Quiz Statistics Dashboard */}
>>>>>>> Stashed changes
      <div className="quiz-stats-dashboard">
        <h2 className="quiz-stats-title">Your Quiz Statistics</h2>
        <div className="quiz-stats-cards-container">
          <div className="quiz-stats-card">
            <div className="quiz-stats-card-icon">
              <BarChart3 size={24} />
            </div>
            <div className="quiz-stats-card-content">
              <h3>Total Quizzes</h3>
<<<<<<< Updated upstream
              <p className="quiz-stats-card-value">{displayStats.totalQuizzes}</p>
=======
              <p className="quiz-stats-card-value">
                {displayStats.totalQuizzes}
              </p>
>>>>>>> Stashed changes
            </div>
          </div>

          <div className="quiz-stats-card">
            <div className="quiz-stats-card-icon">
              <Award size={24} />
            </div>
            <div className="quiz-stats-card-content">
              <h3>Average Score</h3>
<<<<<<< Updated upstream
              <p className="quiz-stats-card-value">{displayStats.averageScore}%</p>
=======
              <p className="quiz-stats-card-value">
                {displayStats.averageScore}%
              </p>
>>>>>>> Stashed changes
            </div>
          </div>

          <div className="quiz-stats-card">
            <div className="quiz-stats-card-icon">
              <Target size={24} />
            </div>
            <div className="quiz-stats-card-content">
              <h3>Top Category</h3>
<<<<<<< Updated upstream
              <p className="quiz-stats-card-value">{displayStats.topCategory}</p>
=======
              <p className="quiz-stats-card-value">
                {displayStats.topCategory}
              </p>
>>>>>>> Stashed changes
            </div>
          </div>
        </div>
      </div>
<<<<<<< Updated upstream
=======

      {/* Top Performance Categories Section */}
>>>>>>> Stashed changes
      <div className="quiz-top-cards-section">
        <h2 className="quiz-top-cards-title">
          <Trophy size={20} className="quiz-top-cards-icon" />
          Your Top Performance Categories
        </h2>

        {topPerformanceCategories && topPerformanceCategories.length > 0 ? (
          <div className="quiz-top-cards-container">
            {topPerformanceCategories.map((category, index) => (
              <div
                key={index}
                className={`quiz-top-card`}
                style={{
                  "--card-accent": getCategoryDetails(category.id).color,
<<<<<<< Updated upstream
                  "--card-accent-light": `${getCategoryDetails(category.id).color}CC`,
=======
                  "--card-accent-light": `${
                    getCategoryDetails(category.id).color
                  }CC`,
>>>>>>> Stashed changes
                }}
              >
                <div className="quiz-top-card-header">
                  <span className="quiz-top-card-rank">#{index + 1}</span>
                </div>
                <h3 className="quiz-top-card-level">{category.displayName}</h3>
                <div className="quiz-top-card-score">
<<<<<<< Updated upstream
                  <span className="quiz-score-value">{category.bestScore}%</span>
                  <span className="quiz-score-label">Best Score</span>
                </div>
                <div className="quiz-top-card-attempts">
                  <span className="quiz-attempts-value">{category.attempts}</span>
                  <span className="quiz-attempts-label">Attempts</span>
                </div>
                <div className="quiz-top-card-date">Last: {formatDate(category.lastAttempt)}</div>
=======
                  <span className="quiz-score-value">
                    {category.bestScore}%
                  </span>
                  <span className="quiz-score-label">Best Score</span>
                </div>
                <div className="quiz-top-card-attempts">
                  <span className="quiz-attempts-value">
                    {category.attempts}
                  </span>
                  <span className="quiz-attempts-label">Attempts</span>
                </div>
                <div className="quiz-top-card-date">
                  Last: {formatDate(category.lastAttempt)}
                </div>
>>>>>>> Stashed changes
              </div>
            ))}
          </div>
        ) : (
          <div className="quiz-no-top-cards">
            <p>Complete quizzes to see your top performance categories here!</p>
          </div>
        )}
      </div>
<<<<<<< Updated upstream
=======

      {/* All Categories Section */}
>>>>>>> Stashed changes
      <div className="quiz-categories-section">
        <h2 className="quiz-categories-title">All Quiz Categories</h2>
        <div className="quiz-categories-grid">
          {quizCategories.map((category) => (
            <div
              key={category.id}
              className="quiz-category-card"
              onClick={() => navigate(`/quiz/question/${category.id}`)}
            >
<<<<<<< Updated upstream
              <div className="quiz-category-icon" style={{ backgroundColor: getCategoryDetails(category.id).color }}>
                {category.icon}
              </div>
              <h3 className="quiz-category-title">{category.name}</h3>
              <p className="quiz-category-description">{category.description}</p>
              <button
                className="quiz-category-button"
                style={{ backgroundColor: getCategoryDetails(category.id).color }}
=======
              <div
                className="quiz-category-icon"
                style={{
                  backgroundColor: getCategoryDetails(category.id).color,
                }}
              >
                {category.icon}
              </div>
              <h3 className="quiz-category-title">{category.name}</h3>
              <p className="quiz-category-description">
                {category.description}
              </p>
              <button
                className="quiz-category-button"
                style={{
                  backgroundColor: getCategoryDetails(category.id).color,
                }}
>>>>>>> Stashed changes
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

<<<<<<< Updated upstream
export default QuizWelcome

=======
export default QuizWelcome;
>>>>>>> Stashed changes
