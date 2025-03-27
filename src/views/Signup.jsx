"use client"

import { useState } from "react"
import Button from "../components/forSignup/Button"
import InputField from "../components/forSignup/InputField"
import AlertBox from "../components/alertBox"
import NetworkGraph from "../components/NetworkGraph"
import VerificationAlert from "../components/VerificationAlert"
import "./Signup.css"
import { registerUser } from "../services/Api"
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmed: "",
    country: "",
  })

  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("error") // "error" or "success"
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const showAlert = (message, type = "error") => {
    setAlertMessage(message)
    setAlertType(type)
    // Auto-dismiss success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => setAlertMessage(""), 5000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Form validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.passwordConfirmed.trim() ||
      !formData.country
    ) {
      showAlert("All fields are required!")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showAlert("Please enter a valid email address")
      return
    }

    // Password validation
    if (formData.password.length < 8) {
      showAlert("Password must be at least 8 characters long")
      return
    }

    if (formData.password !== formData.passwordConfirmed) {
      showAlert("Passwords do not match!")
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        role: "User", // Default role
        isVerified: false, // Ensure this is set to false
      }

      const response = await registerUser(userData)
      console.log("Registration response:", response)

      if (response.error || (response.data && response.data.error)) {
        // Handle specific error cases
        const errorMessage = response.error || response.data.error || "Registration failed"

        if (errorMessage.includes("Email already in use") || errorMessage.includes("already exists")) {
          showAlert("This email is already registered. Please use a different email or try logging in.")
        } else {
          showAlert(errorMessage)
        }
        return
      }

      // Log the entire response to see its structure
      console.log("Full registration response:", JSON.stringify(response, null, 2))

      // Extract user ID from the response based on your API structure
      let userId = null

      // Try to find the user ID in the response
      if (response.data && response.data.data && response.data.data.user) {
        // If response has data.data.user structure
        userId = response.data.data.user.id || response.data.data.user._id
      } else if (response.data && response.data.data) {
        // If response has data.data structure
        userId = response.data.data.id || response.data.data._id
      } else if (response.data && response.data.user) {
        // If response has data.user structure
        userId = response.data.user.id || response.data.user._id
      } else if (response.data) {
        // If response has data structure
        userId = response.data.id || response.data._id
      } else if (response.user) {
        // If response has user structure
        userId = response.user.id || response.user._id
      } else if (response.token && response.user) {
        // If response has token and user structure (common pattern)
        userId = response.user.id || response.user._id
      }

      // If we still don't have an ID, try to find it directly in the response
      if (!userId) {
        userId = response.id || response._id
      }

      console.log("Extracted user ID:", userId)

      // If we still don't have an ID, create a temporary one
      if (!userId) {
        console.warn("Could not extract user ID from response, using email as temporary ID")
        userId = `temp_${formData.email.replace(/[^a-zA-Z0-9]/g, "_")}`
      }

      const userDataToStore = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        role: "User",
        _id: userId,
      }

      console.log("Storing user data with ID:", userDataToStore)
      localStorage.setItem("user", JSON.stringify(userDataToStore))

      // Also store auth data if available
      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem(
          "authData",
          JSON.stringify({
            token: response.data.data.token,
          }),
        )
      } else if (response.token) {
        localStorage.setItem(
          "authData",
          JSON.stringify({
            token: response.token,
          }),
        )
      }

      // Show verification alert instead of success message
      setRegisteredEmail(formData.email)
      setShowVerification(true)

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmed: "",
        country: "",
      })
    } catch (error) {
      console.error("Registration failed:", error)

      // Handle network errors
      if (error.message === "Failed to fetch") {
        showAlert("Unable to connect to the server. Please check your internet connection and try again.")
      } else {
        showAlert(error.message || "Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signUp">
      {alertMessage && <AlertBox message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />}

      {showVerification && <VerificationAlert email={registeredEmail} onClose={() => setShowVerification(false)} />}

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

              <select name="country" value={formData.country} onChange={handleChange} className="country-dropdown">
                <option value="">Select your country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <Button text={isLoading ? "Signing Up..." : "Sign Up"} type="submit" disabled={isLoading} />
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




