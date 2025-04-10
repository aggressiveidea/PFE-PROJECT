"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Header.css"
import { getUserById } from "../../services/Api"

// Default translations as a fallback
const defaultTranslations = {
  en: {
    home: "Home",
    about: "About",
    explore: "Explore",
    contact: "Contact",
  },
  fr: {
    home: "Accueil",
    about: "À propos",
    explore: "Explorer",
    contact: "Contact",
  },
  ar: {
    home: "الرئيسية",
    about: "حول",
    explore: "استكشاف",
    contact: "اتصل بنا",
  },
}

const Header = ({ language = "en", setLanguage, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Use imported translations if available, otherwise use default
  const translations = window.translations || defaultTranslations
  const t = translations[language] || translations.en

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          if (userData.isVerified) {
            if (userData._id) {
              try {
                const response = await getUserById(userData._id)

                if (response && response.success && response.data) {
                  const serverUserData = response.data

                  const completeUserData = {
                    ...userData,
                    ...serverUserData,
                    isVerified: true,
                  }

                  localStorage.setItem("user", JSON.stringify(completeUserData))

                  setUser(completeUserData)
                  console.log("User data updated from server:", completeUserData)
                } else {
                  setUser(userData)
                  console.log("Using stored user data:", userData)
                }
              } catch (error) {
                console.error("Error fetching user data:", error)
                setUser(userData)
              }
            } else {
              setUser(userData)
            }
          } else {
            setUser(userData)
            console.log("User not verified")
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

    loadUserData()

    window.addEventListener("storage", loadUserData)

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

  const getUserInitials = () => {
    if (!user) return "?"

    if (user.firstName || user.lastName) {
      const initials = []
      if (user.firstName) initials.push(user.firstName[0])
      if (user.lastName) initials.push(user.lastName[0])
      return initials.join("").toUpperCase()
    }

    if (user.email) {
      return user.email[0].toUpperCase()
    }

    return "?"
  }

  const getDisplayName = () => {
    if (!user) return "Guest"

    if (user.name) return user.name

    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }

    return user.email ? user.email.split("@")[0] : "Guest"
  }

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className={`header-container ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="logo-section">
          <a href="/" className="logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="12" fill="url(#paint0_linear)" />
                <path
                  d="M7.5 12L10.5 15L16.5 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9333EA" />
                    <stop offset="1" stopColor="#C026D3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>EL-MOUGHITH</span>
          </a>
        </div>

        <div className="nav-section">
          <nav className="main-nav">
            {user && user.isVerified ? (
              <ul>
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <a href="/library">Library</a>
                </li>
                <li>
                  <a href="/dictionary">Terms</a>
                </li>
                <li>
                  <a href="/articles">Articles</a>
                </li>
                <li>
                  <a href="/faq">FAQ</a>
                </li>
              </ul>
            ) : (
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
            )}
          </nav>
        </div>

        <div className="user-section">
          <div className="language-select-container">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : user ? (
            <div className="user-controls">
              <div className="user-info">
                <div className="user-avatar">
                  {user && user.profileImgUrl && !user.profileImgUrl.includes("placeholder.svg") ? (
                    <img
                      src={user.profileImgUrl || "/placeholder.svg"}
                      alt={getDisplayName()}
                      className="user-avatar-img"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=40&width=40"
                        e.target.style.display = "none"
                        e.target.nextElementSibling.style.display = "flex"
                      }}
                    />
                  ) : null}
                  <span
                    className="user-initials"
                    style={{
                      display: user?.profileImgUrl && !user.profileImgUrl.includes("placeholder.svg") ? "none" : "flex",
                    }}
                  >
                    {getUserInitials()}
                  </span>
                </div>
                <span className="display-name">{getDisplayName()}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
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

      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {user && user.isVerified ? (
              <ul>
                <li>
                  <a href="/profile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile
                  </a>
                </li>
                <li>
                  <a href="/library">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Library
                  </a>
                </li>
                <li>
                  <a href="/dictionary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/articles">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Articles
                  </a>
                </li>
                <li>
                  <a href="/faq">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    FAQ
                  </a>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <a href="#home">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    {t.home}
                  </a>
                </li>
                <li>
                  <a href="#about">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    {t.about}
                  </a>
                </li>
                <li>
                  <a href="#FAQ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#explore">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    {t.explore}
                  </a>
                </li>
                <li>
                  <a href="#footer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {t.contact}
                  </a>
                </li>
              </ul>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header


















