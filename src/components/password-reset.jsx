"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { verifyResetLink, resetPassword } from "../services/Api"
import "./password-reset.css"

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState("")
  const [tokenStatus, setTokenStatus] = useState("checking") // "checking", "valid", or "invalid"
  const [userId, setUserId] = useState(null)

  // Get query parameters from URL
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Extract userId from URL query parameters
  const userIdFromUrl = searchParams.get("id")

  // Add detailed debugging
  console.log("PasswordReset component mounted")
  console.log("URL parameters:", { userId: userIdFromUrl })

  // Verify the reset link when component mounts
  useEffect(() => {
    const verifyLink = async () => {
      console.log("Verifying reset link...")

      if (!userIdFromUrl) {
        console.error("Missing userId in URL")
        setServerError("Invalid or incomplete reset link. Please request a new password reset.")
        setTokenStatus("invalid")
        return
      }

      try {
        const result = await verifyResetLink(userIdFromUrl)
        console.log("Reset link verification result:", result)

        if (result.isValid) {
          console.log("Reset link is valid, showing password reset form")
          setTokenStatus("valid")
          setUserId(result.userId)
        } else {
          console.error("Reset link is invalid:", result.message)
          setServerError(result.message || "Password reset link is invalid or has expired")
          setTokenStatus("invalid")
        }
      } catch (error) {
        console.error("Error verifying reset link:", error)
        setServerError("Error verifying reset link. Please request a new password reset.")
        setTokenStatus("invalid")
      }
    }

    verifyLink()
  }, [userIdFromUrl])

  // Redirect to home page after successful password reset
  useEffect(() => {
    if (isSuccess) {
      console.log("Password reset successful, redirecting to home page in 3 seconds...")
      const timer = setTimeout(() => {
        console.log("Redirecting now...")
        navigate("/", { replace: true })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  const validatePassword = (password) => {
    const errors = {}

    if (!password) {
      errors.password = "Password is required"
      return errors
    }

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long"
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter"
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one number"
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      errors.password = "Password must contain at least one special character"
    }

    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when user types
    setErrors({
      ...errors,
      [name]: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset errors
    setErrors({})
    setServerError("")

    // Validate password
    const passwordErrors = validatePassword(formData.password)

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      passwordErrors.confirmPassword = "Passwords do not match"
    }

    // If there are errors, show them and stop submission
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors)
      return
    }

    // Start loading state
    setIsLoading(true)

    try {
      // Make the API call to reset password
      console.log("Submitting password reset for user:", userId)
      const result = await resetPassword(userId, formData.password)

      console.log("Password reset result:", result)

      // Show success state
      setIsSuccess(true)
      console.log("Set isSuccess to true")

      // The redirect will happen in the useEffect
    } catch (error) {
      console.error("Password reset error:", error)
      setServerError(error.message || "An error occurred while resetting your password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card success-card">
          <div className="success-icon">✓</div>
          <h1>Password Reset Successful!</h1>
          <p>Your password has been successfully reset.</p>
          <p>You have been logged out for security reasons.</p>
          <p>You will be redirected to the home page in a few seconds...</p>
          <button className="reset-button" onClick={() => navigate("/", { replace: true })}>
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h1>Reset Your Password</h1>
        <p className="reset-description">
          Please enter your new password below. Make sure it's secure and you'll remember it.
        </p>

        {serverError && <div className="error-message server-error">{serverError}</div>}

        {tokenStatus === "checking" && (
          <div className="loading-message">
            <span className="spinner"></span>
            Verifying reset link...
          </div>
        )}

        {tokenStatus === "invalid" && (
          <div className="form-footer">
            <Link to="/settings" className="reset-button">
              Request New Reset Link
            </Link>
          </div>
        )}

        {tokenStatus === "valid" && (
          <form onSubmit={handleSubmit} className="reset-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
                disabled={isLoading}
                placeholder="Enter your new password"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
              <div className="password-requirements">
                <p>Password must:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? "met" : ""}>Be at least 8 characters long</li>
                  <li className={/[A-Z]/.test(formData.password) ? "met" : ""}>Include an uppercase letter</li>
                  <li className={/[a-z]/.test(formData.password) ? "met" : ""}>Include a lowercase letter</li>
                  <li className={/[0-9]/.test(formData.password) ? "met" : ""}>Include a number</li>
                  <li className={/[^A-Za-z0-9]/.test(formData.password) ? "met" : ""}>Include a special character</li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error-input" : ""}
                disabled={isLoading}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>

            <button type="submit" className="reset-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default PasswordReset

