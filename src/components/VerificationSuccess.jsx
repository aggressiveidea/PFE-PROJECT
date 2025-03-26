"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import "./VrificationSuccess.css"

export default function VerificationSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push("/signin")
    }, 5000)

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div className="verification-success-page">
      <div className="verification-success-container">
        <div className="success-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified and your account is now active.</p>
        <p className="redirect-text">You will be redirected to the login page in a few seconds...</p>

        <button className="login-button" onClick={() => router.push("/signin")}>
          Go to Login
        </button>
      </div>
    </div>
  )
}

