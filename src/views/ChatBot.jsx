"use client"

import { useState, useEffect } from "react"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import Footer from "../components/forHome/Footer"
import IctAssistant from "../components/forChatBot/IctAssistant"
import "./ChatBot.css"

const ChatBot = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")

  // Check for dark mode preference on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [])

  // Update dark mode when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)

    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const openMobileMenu = () => {
    setMobileOpen(true)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`chatbot-page ${darkMode ? "dark-mode" : ""}`}>
      <Header darkMode={darkMode} language={language} setLanguage={setLanguage} />
      <div className="chatbot-content">
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileOpen}
          closeMobileMenu={closeMobileMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className={`chatbot-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <button className="mobile-menu-button" onClick={openMobileMenu} aria-label="Open menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h2 className="chatbot-title">ICT Terms Assistant</h2>
          <IctAssistant darkMode={darkMode} />
        </main>
      </div>
      <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  )
}

export default ChatBot


