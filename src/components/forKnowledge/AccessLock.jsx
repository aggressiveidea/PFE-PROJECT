import { useState, useEffect } from "react"
import { Lock, User, ArrowRight, Key, Shield } from "lucide-react"
import { Link } from "react-router-dom"
import "./AccessLock.css"

const AccessLock = ({ onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    //after mount
    setIsAnimating(true)

    const timer = setTimeout(() => {
      setShowSignup(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="access-lock-overlay">
      <div className={`access-lock-container ${isAnimating ? "animate" : ""}`}>
        <div className="access-lock-content">
          <div className="lock-icon-container">
            <div className="lock-icon-wrapper">
              <Lock className="lock-icon" size={48} strokeWidth={1.5} />
              <div className="lock-pulse"></div>
            </div>
          </div>

          <h2 className="access-lock-title">Restricted Access</h2>
          <p className="access-lock-description">
            This knowledge graph visualization is available exclusively to verified users.
          </p>

          <div className="access-lock-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <div className="feature-text">
                <h3>Premium Content</h3>
                <p>Access our comprehensive ICT knowledge graph</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Key size={24} />
              </div>
              <div className="feature-text">
                <h3>Interactive Tools</h3>
                <p>Explore relationships between ICT concepts</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <User size={24} />
              </div>
              <div className="feature-text">
                <h3>Personalized Experience</h3>
                <p>Save your progress and customize your learning</p>
              </div>
            </div>
          </div>

          {showSignup && (
            <div className="access-lock-actions">
              <Link to="/signup" className="signup-button">
                <span>Sign Up Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="login-link">
                Already have an account? Log in
              </Link>
            </div>
          )}
        </div>

        <div className="access-lock-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
          <div className="decoration-line line-1"></div>
          <div className="decoration-line line-2"></div>
          <div className="decoration-line line-3"></div>
          <div className="decoration-dot dot-1"></div>
          <div className="decoration-dot dot-2"></div>
          <div className="decoration-dot dot-3"></div>
          <div className="decoration-dot dot-4"></div>
          <div className="decoration-dot dot-5"></div>
        </div>
      </div>
    </div>
  )
}

export default AccessLock
