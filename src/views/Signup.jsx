"use client"

import { useState } from "react"
import Button from "../components/forSignup/Button"
import InputField from "../components/forSignup/InputField"
import AlertBox from "../components/alertBox"
import NetworkGraph from "../components/NetworkGraph"
import "./Signup.css"

function Signup() {
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmed: "",
    boxchecked: false,
  })

  const [alertMessage, setAlertMessage] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setformData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.passwordConfirmed.trim()
    ) {
      setAlertMessage("All fields are required!")
      return
    }

    if (formData.password !== formData.passwordConfirmed) {
      setAlertMessage("Passwords do not match!")
      return
    }

    if (!formData.boxchecked) {
      setAlertMessage("You must agree to the Terms & Conditions to sign up.")
      return
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }

      localStorage.setItem("user", JSON.stringify(userData))
      setAlertMessage("Registration successful! Welcome aboard!")

      setTimeout(() => {
        window.location.href = "/profile"
      }, 1000)
    } catch (error) {
      console.error("Registration failed:", error)
      setAlertMessage(error.message || "Registration failed. Try again.")
    }
  }

  return (
    <div className="signUp">
      {alertMessage && <AlertBox message={alertMessage} onClose={() => setAlertMessage("")} />}
      <div className="layout-container">
        <div className="left-section">
          <h2>Sign Up</h2>
          <p className="subtitle">Create your account to get started.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <InputField
                placeholder="Enter your first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                placeholder="Enter your last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <InputField
                placeholder="Enter your email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                placeholder="Create a password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputField
                placeholder="Confirm password"
                type="password"
                name="passwordConfirmed"
                value={formData.passwordConfirmed}
                onChange={handleChange}
              />
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="boxchecked"
                name="boxchecked"
                checked={formData.boxchecked}
                onChange={handleChange}
              />
              <label htmlFor="boxchecked">I agree to the terms of service and privacy policy</label>
            </div>

            <Button text="Sign Up" type="submit" />
          </form>

          <p className="signin-link">
            Already have an account? <a href="/signin">Sign in</a>
          </p>
        </div>

        <div className="right-section">
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
            <h1>Join the Network</h1>
            <p>Explore the future of technology</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
