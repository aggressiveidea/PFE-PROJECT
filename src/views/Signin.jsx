"use client"

import { useState, useEffect } from "react"
import Button from "../components/forSignup/Button"
import InputField from "../components/forSignup/InputField"
import AlertBox from "../components/alertBox"
import NetworkGraph from "../components/NetworkGraph"
import { motion } from "framer-motion"
import { handleChange } from "../utils/handleChange"
import { loginUser, getUserById } from "../services/Api"
import "./Signin.css"
import { useNavigate } from "react-router-dom"

function Signin() {
  const [existData, setExistData] = useState({
    email: "",
    password: "",
  })
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("error")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if dark mode is enabled in localStorage or system preference
    const darkModeEnabled =
      localStorage.getItem("darkMode") === "true" ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setIsDarkMode(darkModeEnabled)

    // Apply dark mode class to body if needed
    if (darkModeEnabled) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }

    // Set typing animation to complete after delay
    const timer = setTimeout(() => {
      setTypingComplete(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const showAlert = (message, type = "error") => {
    setAlertMessage(message)
    setAlertType(type)
    if (type === "success") {
      setTimeout(() => setAlertMessage(""), 3000)
    }
  }

  // Enhanced handleSubmit function to ensure user data is properly stored and fetched
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!existData.email.trim() || !existData.password.trim()) {
      showAlert("All fields are required")
      setIsLoading(false)
      return
    }

    try {
      const response = await loginUser(existData.email, existData.password)

      console.log("Login response:", response)

      // Check for successful login
      if (response.success && response.data && response.data.token) {
        // Store auth token
        localStorage.setItem(
          "authData",
          JSON.stringify({
            token: response.data.token,
          }),
        )

        localStorage.setItem("token", response.data.token)

        const userData = response.data.user

        if (userData) {
          const userToStore = {
            ...userData,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            role: userData.role || "User",
            _id: userData._id || userData.id || "",
            isVerified: userData.isVerified || false,
          }

          localStorage.setItem("user", JSON.stringify(userToStore))
          console.log("Storing user data in localStorage:", userToStore)

          // After login, fetch complete user data to ensure we have everything
          try {
            const userId = userToStore._id || userToStore.id
            if (userId) {
              const completeUserData = await getUserById(userId)
              console.log("Complete user data fetched:", completeUserData)

              if (completeUserData) {
                // Merge the complete data with what we already have
                const enhancedUserData = {
                  ...userToStore,
                  ...completeUserData,
                  _id: userId, // Ensure ID is preserved
                }

                localStorage.setItem("user", JSON.stringify(enhancedUserData))
                console.log("Enhanced user data stored:", enhancedUserData)
              }
            }
          } catch (fetchError) {
            console.error("Error fetching complete user data:", fetchError)
            // Continue with login even if this fails
          }

          // Notify other components about the user update
          window.dispatchEvent(new Event("userUpdated"))

          showAlert("Login successful! Redirecting...", "success")
          setTimeout(() => {
            navigate("/")
          }, 1500)
        } else {
          showAlert("Login successful but user data is missing")
        }
      } else {
        const errorMessage = response.message || response.error || "Invalid credentials"
        showAlert(errorMessage)
      }
    } catch (error) {
      console.error("Login error:", error)
      showAlert(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
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

  // Typewriter animation for the heading
  const headingText = "ICT exploration"
  const subText = "Welcome to the website"

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
        }, 100) // Speed of typing

        return () => clearInterval(interval)
      }, delay)

      return () => clearTimeout(timer)
    }, [text, delay])

    return <span className={className}>{displayText}</span>
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
            <h2>Welcome Back</h2>
            <p className="signin-subtitle">Enter your credentials to access your account</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="signin-form" variants={itemVariants}>
            <div className="signin-input-group">
              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={existData.email}
                  onChange={(e) => handleChange(e, setExistData)}
                  className="signin-input"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  value={existData.password}
                  onChange={(e) => handleChange(e, setExistData)}
                  className="signin-input"
                />
              </motion.div>
            </div>

            <motion.div className="signin-forgot-password-container" variants={itemVariants}>
              <a href="/forgot-password" className="signin-forgot-password">
                Forgot Password?
              </a>
            </motion.div>

            <motion.div className="signin-button-container" variants={itemVariants}>
              <Button
                text={isLoading ? "Logging in..." : "Login"}
                type="submit"
                disabled={isLoading}
                className="signin-button"
              />
            </motion.div>
          </motion.form>

          <motion.div className="signin-auth-footer" variants={itemVariants}>
            <p className="signin-or-text">
              <span></span>
              or Sign in with
              <span></span>
            </p>
            {/* Social media buttons will go here */}

            <p className="signin-signup-text">
              Don't have an account?
              <a href="/signup" className="signin-signup-link">
                Sign up
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signin
