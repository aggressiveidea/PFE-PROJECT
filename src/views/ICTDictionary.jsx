"use client"
import { useState, useEffect } from "react"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import Footer from "../components/forHome/Footer"
import GraphVisualization from "../components/forKnowledge/GraphVisualization"
import GraphAlgorithmsSection from "../components/forKnowledge/GraphAlgorithms"
import AccessLock from "../components/forKnowledge/AccessLock"
import "./ICTDictionary.css"

const ICTDictionary = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [darkMode, setDarkMode] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Set RTL direction for Arabic language
  const isRTL = selectedLanguage === "arabic"

  // Check if user is verified
  useEffect(() => {
    const checkUserVerification = () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("user") || "{}")

        // Check if user exists and is verified
        if (userData && userData.isVerified === true) {
          setIsUserVerified(true)
        } else {
          setIsUserVerified(false)
        }
      } catch (error) {
        console.error("Error checking user verification:", error)
        setIsUserVerified(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserVerification()

    // Listen for user updates
    window.addEventListener("userUpdated", checkUserVerification)

    return () => {
      window.removeEventListener("userUpdated", checkUserVerification)
    }
  }, [])

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }

    // Listen for dark mode changes from other components
    const handleDarkModeChange = () => {
      const isDarkMode = localStorage.getItem("darkMode") === "true"
      setDarkMode(isDarkMode)
    }
    window.addEventListener("darkModeChanged", handleDarkModeChange)

    return () => {
      window.removeEventListener("darkModeChanged", handleDarkModeChange)
    }
  }, [])

  const toggleDarkMode = (value) => {
    const newDarkMode = value !== undefined ? value : !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }

    localStorage.setItem("darkMode", newDarkMode.toString())
    window.dispatchEvent(new Event("darkModeChanged"))
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="ict-dictionary" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <div className="layout-container">
          <aside className="sidebar-container">
            <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </aside>
          <main className="main-container">
            <div className="content-area">
              <div className="search-controls-wrapper">
                <div className="search-controls">
                  <div className="language-selector">
                    <label htmlFor="language-select">
                      {selectedLanguage === "english" && "Language:"}
                      {selectedLanguage === "french" && "Langue:"}
                      {selectedLanguage === "arabic" && "اللغة:"}
                    </label>
                    <select
                      id="language-select"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      <option value="english">English</option>
                      <option value="french">Français</option>
                      <option value="arabic">العربية</option>
                    </select>
                  </div>

                  <div className="graph-title">
                    <h2>
                      {selectedLanguage === "english" && "Knowledge Graph Visualization"}
                      {selectedLanguage === "french" && "Visualisation du Graphe de Connaissances"}
                      {selectedLanguage === "arabic" && "تصور الرسم البياني للمعرفة"}
                    </h2>
                  </div>
                </div>
              </div>

              <GraphVisualization language={selectedLanguage} />
              <GraphAlgorithmsSection language={selectedLanguage} />
            </div>
          </main>
        </div>
        <div className="footer-container">
          <Footer darkMode={darkMode} setDarkMode={toggleDarkMode} language={selectedLanguage} />
        </div>

        {/* Show access lock overlay for unverified users */}
        {!isUserVerified && <AccessLock />}
      </div>
    </div>
  )
}

export default ICTDictionary
