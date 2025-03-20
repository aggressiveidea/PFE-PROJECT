"use client"

import { useState } from "react"
import Button from "../components/forSignup/Button"
import InputFeild from "../components/forSignup/InputField"
import AlertBox from "../components/alertBox"
import NetworkGraph from "../components/NetworkGraph"
import { handleChange } from "../utils/handleChange"
import { loginUser } from "../services/Api"
import "./Signin.css"

function Signin() {
  const [existData, setExistData] = useState({
    email: "",
    password: "",
  })

  const [alertMessage, setAlertMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!existData.email.trim() || !existData.password.trim()) {
      setAlertMessage("All fields are required");
      return;
    }

    try {
      const response = await loginUser(existData.email, existData.password);
      
      console.log("Response received in handleSubmit:", response); 

      if (response?.data?.token) {  
        console.log("Login successful", response);
        setAlertMessage("Login successful!");
        localStorage.setItem("token", response.data.token);
      } else {
        setAlertMessage(response.message || "Invalid credentials");
      }
    } catch (error) {
      console.log("Error in handleSubmit:", error);
      setAlertMessage("Login failed. Please try again.");
    }
};


  return (
    <div className="auth-container">
      {alertMessage && <AlertBox message={alertMessage} onClose={() => setAlertMessage("")} />}

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

            <Button text="Login" type="submit" />
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





