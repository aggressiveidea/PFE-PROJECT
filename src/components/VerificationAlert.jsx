import { useState } from "react"
import { resendVerificationEmail } from "../services/Api"
import '../styles/VerificationAlert.css'

const VerificationAlert = ({ email, onClose }) => {
  const [resendStatus, setResendStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async () => {
    try {
      setIsLoading(true)
      const response = await resendVerificationEmail(email)

      if (response.success) {
        setResendStatus("success")
      } else {
        setResendStatus("error")
      }
    } catch (error) {
      console.error("Failed to resend verification email:", error)
      setResendStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const openEmailClient = () => {

    const domain = email.split("@")[1]


    const emailProviders = {
      "gmail.com": "https://mail.google.com",
      "yahoo.com": "https://mail.yahoo.com",
      "outlook.com": "https://outlook.live.com",
      "hotmail.com": "https://outlook.live.com",
      "aol.com": "https://mail.aol.com",
      "protonmail.com": "https://mail.proton.me",
    }
    if (emailProviders[domain]) {
      window.open(emailProviders[domain], "_blank")
    } else {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <div className="verification-alert">
      <div className="verification-content">
        <div className="verification-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>

        <h3>Verify Your Email</h3>
        <p>
          We've sent a verification link to <strong>{email}</strong>
        </p>
        <p>Please check your inbox and click the link to activate your account.</p>

        {resendStatus === "success" && (
          <div className="resend-success">Verification email sent successfully! Please check your inbox.</div>
        )}

        {resendStatus === "error" && (
          <div className="resend-error">Failed to resend verification email. Please try again later.</div>
        )}

        <div className="verification-actions">
          <button className="email-button" onClick={openEmailClient}>
            Open Email
          </button>

          <button className="resend-button" onClick={handleResend} disabled={isLoading}>
            {isLoading ? "Sending..." : "Resend Email"}
          </button>
        </div>

        <button className="close-verification" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default VerificationAlert

