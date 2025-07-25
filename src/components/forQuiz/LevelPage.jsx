import { useNavigate } from "react-router-dom"
import { Cpu, Zap, Brain } from "lucide-react"
import "./LevelPage.css"

const LevelPage = ({ darkMode }) => {
  const navigate = useNavigate()

  const handleLevelSelect = (level) => {
 
    localStorage.setItem("currentLevel", level.toLowerCase())

  
    navigate(`/quiz/question/${level.toLowerCase()}`)
  }

  const handleBack = () => {
    navigate("/quiz")
  }

  return (
    <div className="level-page">
      <div className="level-header">
        <h1>Select Difficulty Level</h1>
        <p>Choose a difficulty level that matches your ICT knowledge</p>
      </div>

      <div className="level-cards">
        <div className="level-card" data-level="easy">
          <div className="level-card-inner">
            <div className="level-card-header">
              <div className="level-icon">
                <Cpu />
              </div>
              <h2>Easy</h2>
              <span className="level-badge">Basic</span>
            </div>
            <div className="level-card-content">
              <p className="level-description">
                Fundamental concepts, computer basics, and simple terminology. Perfect for beginners.
              </p>
              <ul className="level-features">
                <li>5 questions</li>
                <li>No time limit</li>
                <li>Basic concepts</li>
              </ul>
              <button className="level-button" onClick={() => handleLevelSelect("easy")}>
                Start Easy Quiz
              </button>
            </div>
          </div>
        </div>

        <div className="level-card" data-level="medium">
          <div className="level-card-inner">
            <div className="level-card-header">
              <div className="level-icon">
                <Zap />
              </div>
              <h2>Medium</h2>
              <span className="level-badge">Intermediate</span>
            </div>
            <div className="level-card-content">
              <p className="level-description">
                Software applications, digital tools, and practical ICT skills for everyday use.
              </p>
              <ul className="level-features">
                <li>5 questions</li>
                <li>No time limit</li>
                <li>Intermediate concepts</li>
              </ul>
              <button className="level-button" onClick={() => handleLevelSelect("medium")}>
                Start Medium Quiz
              </button>
            </div>
          </div>
        </div>

        <div className="level-card" data-level="hard">
          <div className="level-card-inner">
            <div className="level-card-header">
              <div className="level-icon">
                <Brain />
              </div>
              <h2>Hard</h2>
              <span className="level-badge">Advanced</span>
            </div>
            <div className="level-card-content">
              <p className="level-description">
                Networks, security, programming concepts, and complex ICT systems for experts.
              </p>
              <ul className="level-features">
                <li>5 questions</li>
                <li>No time limit</li>
                <li>Advanced concepts</li>
              </ul>
              <button className="level-button" onClick={() => handleLevelSelect("hard")}>
                Start Hard Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevelPage


