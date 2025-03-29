"use client"

import { useState } from "react"
import Button from "../components/forSignup/Button"
import InputFeild from "../components/forSignup/InputField"
import AlertBox from "../components/alertBox"
import NetworkGraph from "../components/NetworkGraph"
import { handleChange } from "../utils/handleChange"
import { loginUser } from "../services/Api"
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
  const navigate = useNavigate()

  const showAlert = (message, type = "error") => {
    setAlertMessage(message)
    setAlertType(type)
    if (type === "success") {
      setTimeout(() => setAlertMessage(""), 3000)
    }
  }

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

        // Extract user data
        const userData = response.data.user

        if (userData) {
          // Make sure isVerified is included
          const userToStore = {
            ...userData,
            isVerified: userData.isVerified || false,
          }

          // Store user data
          localStorage.setItem("user", JSON.stringify(userToStore))

          // Notify other components
          window.dispatchEvent(new Event("userUpdated"))

          // Show success message
          showAlert("Login successful! Redirecting...", "success")

          // Redirect after a short delay
          setTimeout(() => {
            navigate("/")
          }, 1500)
        } else {
          showAlert("Login successful but user data is missing")
        }
      } else {
        // Handle error response
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

  return (
    <div className="auth-container">
      {alertMessage && <AlertBox message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />}

      <div className="left-section">
        <NetworkGraph />
        <div className="stars">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        <div className="content">
          <h1>ICT exploration</h1>
          <p>Welcome to the website</p>
        </div>
      </div>

      <div className="right-section">
        <div className="form-container">
          <h2>Welcome Back</h2>
          <p className="subtitle">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <InputFeild
                placeholder="Enter your email"
                type="email"
                name="email"
                value={existData.email}
                onChange={(e) => handleChange(e, setExistData)}
              />
              <InputFeild
                placeholder="Enter your password"
                type="password"
                name="password"
                value={existData.password}
                onChange={(e) => handleChange(e, setExistData)}
              />
            </div>

            <div className="forgot-password-container">
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <Button text={isLoading ? "Logging in..." : "Login"} type="submit" disabled={isLoading} />
          </form>

          <div className="auth-footer">
            <p className="or-text">
              <span></span>
              or Sign in with
              <span></span>
            </p>
            {/* nzid social media later  */}

            <p className="signup-text">
              Don't have an account?
              <a href="/signup" className="signup-link">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin




