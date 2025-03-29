"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getUserById } from "../services/Api"
import "./VerificationSuccess.css"

function VerificationSuccess() {
  const [status, setStatus] = useState("success")
  const [message, setMessage] = useState("Your email has been verified successfully!")
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Get query parameters
    const params = new URLSearchParams(location.search)
    const token = params.get("token")
    const userId = params.get("userId")
    const verified = params.get("verified")

    console.log("Verification params:", { token, userId, verified })

    if (verified === "true" && token && userId) {
      const updateUserData = async () => {
        try {
          // Update localStorage with verified status
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            userData.isVerified = true

            // Store the updated user data
            localStorage.setItem("user", JSON.stringify(userData))

            // Update the auth token
            localStorage.setItem("authData", JSON.stringify({ token }))

            // Try to fetch the latest user data from the server
            try {
              const response = await getUserById(userId)
              if (response && response.success && response.data) {
                // Merge the server data with our local data
                const updatedUserData = {
                  ...userData,
                  ...response.data,
                  isVerified: true, // Ensure verified status is maintained
                }

                // Update localStorage with the complete data
                localStorage.setItem("user", JSON.stringify(updatedUserData))
              }
            } catch (error) {
              console.error("Error fetching updated user data:", error)
              // Continue with the basic verification update even if fetch fails
            }

            // Dispatch an event to notify other components (like Header) that user data has changed
            window.dispatchEvent(new Event("userUpdated"))

            console.log("User data updated with verified status")
          } else {
            console.warn("No user data found in localStorage")
          }
        } catch (error) {
          console.error("Error updating user data:", error)
          setStatus("error")
          setMessage("An error occurred while updating your verification status.")
        }
      }

      updateUserData()

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate("/")
      }, 3000)
    } else {
      setStatus("error")
      setMessage("Verification failed. Please try again.")
      console.error("Verification parameters missing:", { token, userId, verified })
    }
  }, [location.search, navigate])

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className={`verification-icon ${status}`}>
          {status === "success" && <div className="checkmark">✓</div>}
          {status === "error" && <div className="error-mark">✗</div>}
        </div>
        <h1 className="verification-title">{status === "success" ? "Email Verified!" : "Verification Failed"}</h1>
        <p className="verification-message">{message}</p>
        {status === "success" && (
          <p className="redirect-message">You will be redirected to the homepage in a few seconds...</p>
        )}
        {status === "error" && (
          <button className="retry-button" onClick={() => navigate("/")}>
            Return to Home
          </button>
        )}
      </div>
    </div>
  )
}

export default VerificationSuccess


