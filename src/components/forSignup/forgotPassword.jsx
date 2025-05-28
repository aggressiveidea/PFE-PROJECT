import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "./Button"
import InputField from "./InputField"
import AlertBox from "../../components/alertBox"
import NetworkGraph from "../NetworkGraph"
import { requestPasswordReset } from "../../services/Api"
import "../../views/Signin.css"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("error")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const darkModeEnabled =
      localStorage.getItem("darkMode") === "true" ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setIsDarkMode(darkModeEnabled)

    if (darkModeEnabled) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }

    const timer = setTimeout(() => {
      setTypingComplete(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const showAlert = (message, type = "error") => {
    setAlertMessage(message)
    setAlertType(type)
    if (type === "success") {
      setTimeout(() => setAlertMessage(""), 5000)
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (alertMessage) {
      setAlertMessage("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email.trim()) {
      showAlert("Email address is required")
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await requestPasswordReset(email)

      if (response.success) {
        setIsSuccess(true)
        showAlert("Password reset instructions have been sent to your email address", "success")
      } else {
        showAlert(response.message || "Failed to send password reset email")
      }
    } catch (error) {
      console.error("Password reset request error:", error)
      showAlert(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const headingText = "Password Recovery"
  const subText = "We'll help you get back in"

  const TypewriterText = ({ text, className, delay = 0 }) => {
    const [displayText, setDisplayText] = useState("")

    useEffect(() => {
      let currentIndex = 0
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayText(text.substring(0, currentIndex))
            currentIndex++
          } else {
            clearInterval(interval)
          }
        }, 100)

        return () => clearInterval(interval)
      }, delay)

      return () => clearTimeout(timer)
    }, [text, delay])

    return <span className={className}>{displayText}</span>
  }

  if (isSuccess) {
    return (
      <div className={`signin-container ${isDarkMode ? "signin-dark-mode" : ""}`}>
        {alertMessage && <AlertBox message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />}

        <div className="signin-layout">
          <div className="signin-visual-section">
            <NetworkGraph />
            <div className="signin-stars">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="signin-star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                  }}
                />
              ))}
            </div>
            <div className="signin-content">
              <div className="signin-animated-text">
                <h1 className="signin-heading">✓ Email Sent!</h1>
                <p className="signin-subheading">Check your inbox for reset instructions</p>
              </div>
            </div>
          </div>

          <motion.div className="signin-form-section" initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div className="signin-header" variants={itemVariants}>
              <h2>Check Your Email</h2>
              <p className="signin-subtitle">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
            </motion.div>

            <motion.div className="signin-form" variants={itemVariants}>
              <div className="signin-input-group">
                <p style={{ color: "var(--signin-text-secondary)", textAlign: "center", lineHeight: "1.6" }}>
                  If you don't see the email in your inbox, please check your spam folder. The reset link will expire in
                  1 hour for security reasons.
                </p>
              </div>

              <motion.div className="signin-button-container" variants={itemVariants}>
                <Button
                  text="Back to Sign In"
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="signin-button"
                />
              </motion.div>
            </motion.div>

            <motion.div className="signin-auth-footer" variants={itemVariants}>
              <p className="signin-signup-text">
                Didn't receive the email?
                <button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                  }}
                  className="signin-signup-link"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Try again
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={`signin-container ${isDarkMode ? "signin-dark-mode" : ""}`}>
      {alertMessage && <AlertBox message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />}

      <div className="signin-layout">
        <div className="signin-visual-section">
          <NetworkGraph />
          <div className="signin-stars">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="signin-star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                }}
              />
            ))}
          </div>
          <div className="signin-content">
            <div className="signin-animated-text">
              <h1 className="signin-heading">
                {typingComplete ? headingText : <TypewriterText text={headingText} className="signin-typewriter" />}
              </h1>
              <p className="signin-subheading">
                {typingComplete ? (
                  subText
                ) : (
                  <TypewriterText text={subText} className="signin-typewriter" delay={1500} />
                )}
              </p>
            </div>
          </div>
        </div>

        <motion.div className="signin-form-section" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div className="signin-header" variants={itemVariants}>
            <h2>Forgot Your Password?</h2>
            <p className="signin-subtitle">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="signin-form" variants={itemVariants}>
            <div className="signin-input-group">
              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Enter your email address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="signin-input"
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <motion.div className="signin-button-container" variants={itemVariants}>
              <Button
                text={isLoading ? "Sending..." : "Send Reset Instructions"}
                type="submit"
                disabled={isLoading}
                className="signin-button"
              />
            </motion.div>
          </motion.form>

          <motion.div className="signin-auth-footer" variants={itemVariants}>
            <p className="signin-signup-text">
              Remember your password?
              <button
                onClick={() => navigate("/signin")}
                className="signin-signup-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Back to Sign In
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPassword
