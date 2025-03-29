"use client"

import { useState, useEffect } from "react"
import "./Header.css"
import { translations } from "../../utils/translations"
import { Link } from "react-router-dom"
import { getUserById } from "../../services/Api"

const Header = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const t = translations[language]

  // Load user data from localStorage whenever it changes
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        // Get stored user data
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)

          // Check if user is verified
          if (userData.isVerified) {
            // If we have a user ID, try to fetch the latest data from the server
            if (userData._id) {
              try {
                // Fetch fresh user data from the server
                const response = await getUserById(userData._id)

                if (response && response.success && response.data) {
                  // Update with server data
                  const serverUserData = response.data

                  // Create a complete user object with all necessary fields
                  const completeUserData = {
                    ...userData,
                    ...serverUserData,
                    isVerified: true, // Ensure verified status is maintained
                  }

                  // Update localStorage with the latest data
                  localStorage.setItem("user", JSON.stringify(completeUserData))

                  // Set the user state
                  setUser(completeUserData)
                  console.log("User data updated from server:", completeUserData)
                } else {
                  // If server fetch fails, use the stored data
                  setUser(userData)
                  console.log("Using stored user data:", userData)
                }
              } catch (error) {
                console.error("Error fetching user data:", error)
                // If fetch fails, still use the stored data
                setUser(userData)
              }
            } else {
              // No ID available, just use stored data
              setUser(userData)
            }
          } else {
            // User not verified, don't display
            setUser(null)
            console.log("User not verified, not displaying profile")
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error in loadUserData:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Load user data initially
    loadUserData()

    // Set up event listener for storage changes
    window.addEventListener("storage", loadUserData)

    // Custom event listener for user updates
    const handleUserUpdate = () => loadUserData()
    window.addEventListener("userUpdated", handleUserUpdate)

    return () => {
      window.removeEventListener("storage", loadUserData)
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authData")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Simple function to get user initials
  const getUserInitials = () => {
    if (!user) return "?"

    if (user.firstName || user.lastName) {
      const initials = []
      if (user.firstName) initials.push(user.firstName[0])
      if (user.lastName) initials.push(user.lastName[0])
      return initials.join("").toUpperCase()
    }

    // Fallback to email
    if (user.email) {
      return user.email[0].toUpperCase()
    }

    return "?"
  }

  // Get display name from user object
  const getDisplayName = () => {
    if (!user) return "Guest"

    // If name property exists, use it
    if (user.name) return user.name

    // Otherwise, construct name from firstName and lastName
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }

    // Fallback to email or Guest
    return user.email ? user.email.split("@")[0] : "Guest"
  }

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="url(#paint0_linear)" />
            <path
              d="M10 16L14 20L22 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9333EA" />
                <stop offset="1" stopColor="#C026D3" />
              </linearGradient>
            </defs>
          </svg>
          <span>EL-MOUGHITH</span>
        </a>

        <div className={`nav-container ${isMenuOpen ? "active" : ""}`}>
          <nav className="main-nav">
            <ul>
              <li>
                <a href="#home">{t.home}</a>
              </li>
              <li>
                <a href="#about">{t.about}</a>
              </li>
              <li>
                <a href="#FAQ">FAQ</a>
              </li>
              <li>
                <a href="#explore">{t.explore}</a>
              </li>
              <li>
                <a href="#footer">{t.contact}</a>
              </li>
            </ul>
          </nav>

          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>

          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : user ? (
            <div className="user-profile">
              <div className="user-avatar">
                <span>{getUserInitials()}</span>
              </div>
              <span className="username">{getDisplayName()}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="buttons">
              <Link to="/signup">
                <button className="btn-signup">Sign up</button>
              </Link>
              <Link to="/login">
                <button className="btn-login">Login</button>
              </Link>
            </div>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header




