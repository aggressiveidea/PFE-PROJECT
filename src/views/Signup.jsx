import { useState, useEffect } from "react"
import Button from "../components/forSignup/Button"
import InputField from "../components/forSignup/InputField"
import AlertBox from "../components/alertBox"
import NetworkGraph from "../components/NetworkGraph"
import VerificationAlert from "../components/VerificationAlert"
import { motion } from "framer-motion"
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
  const [alertType, setAlertType] = useState("error") 
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)

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
    if (type === "success") {
      setTimeout(() => setAlertMessage(""), 5000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showAlert("Please enter a valid email address")
      return
    }

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
        role: "User",
        isVerified: false,
      }

      const response = await registerUser(userData)
      console.log("Registration response:", response)

      if (response.error || (response.data && response.data.error)) {
        const errorMessage = response.error || response.data.error || "Registration failed"

        if (errorMessage.includes("Email already in use") || errorMessage.includes("already exists")) {
          showAlert("This email is already registered. Please use a different email or try logging in.")
        } else {
          showAlert(errorMessage)
        }
        return
      }

      console.log("Full registration response:", JSON.stringify(response, null, 2))
      let userId = null

      if (response.data && response.data.data && response.data.data.user) {
        userId = response.data.data.user.id || response.data.data.user._id
      } else if (response.data && response.data.data) {
        userId = response.data.data.id || response.data.data._id
      } else if (response.data && response.data.user) {
        userId = response.data.user.id || response.data.user._id
      } else if (response.data) {
        userId = response.data.id || response.data._id
      } else if (response.user) {
        userId = response.user.id || response.user._id
      } else if (response.token && response.user) {
        userId = response.user.id || response.user._id
      }

      if (!userId) {
        userId = response.id || response._id
      }

      console.log("Extracted user ID:", userId)

      const userDataToStore = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        role: "User",
        _id: userId,
        isVerified: false,
      }

      console.log("Storing user data with ID:", userDataToStore)
      localStorage.setItem("user", JSON.stringify(userDataToStore))

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

      setRegisteredEmail(formData.email)
      setShowVerification(true)

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
      if (error.message === "Failed to fetch") {
        showAlert("Unable to connect to the server. Please check your internet connection and try again.")
      } else {
        showAlert(error.message || "Registration failed. Please try again.")
      }
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

  const headingText = "Join the Network"
  const subText = "Explore the future of technology"

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

  return (
    <div className={`signup-container ${isDarkMode ? "signup-dark-mode" : ""}`}>
      {alertMessage && <AlertBox message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />}

      {showVerification && <VerificationAlert email={registeredEmail} onClose={() => setShowVerification(false)} />}

      <div className="signup-layout">
        <motion.div className="signup-form-section" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div className="signup-header" variants={itemVariants}>
            <h2>Sign Up</h2>
            <p className="signup-subtitle">Create your account to get started.</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            <div className="signup-input-container">
              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Enter your first name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="signup-input"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Enter your last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="signup-input"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="signup-input"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Create a password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="signup-input"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <InputField
                  placeholder="Confirm password"
                  type="password"
                  name="passwordConfirmed"
                  value={formData.passwordConfirmed}
                  onChange={handleChange}
                  className="signup-input"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="signup-country-dropdown"
                >
                  <option value="">Select your country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            <motion.div className="signup-button-container" variants={itemVariants}>
              <Button
                text={isLoading ? "Signing Up..." : "Sign Up"}
                type="submit"
                disabled={isLoading}
                className="signup-button"
              />
            </motion.div>
          </motion.form>

          <motion.p className="signup-signin-link" variants={itemVariants}>
            Already have an account? <a href="/login">Sign in</a>
          </motion.p>
        </motion.div>

        <div className="signup-visual-section">
          <NetworkGraph />
          <div className="signup-stars">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="signup-star"
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
          <div className="signup-content">
            <div className="signup-animated-text">
              <h1 className="signup-heading">
                {typingComplete ? headingText : <TypewriterText text={headingText} className="signup-typewriter" />}
              </h1>
              <p className="signup-subheading">
                {typingComplete ? (
                  subText
                ) : (
                  <TypewriterText text={subText} className="signup-typewriter" delay={1500} />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
